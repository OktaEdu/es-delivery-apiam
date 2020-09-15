import router from '../router' //router: required to redirect users
import {OktaAuth} from '@okta/okta-auth-js' //okta authjs: required login in Okta


//constants
// TODO: Update Okta Org Domain
const OKTA_ORG = 'https://oktaiceXXX.oktapreview.com';
// TODO: Update Auth. Server ID
const AUTHZ_SERVER = OKTA_ORG + '/oauth2/' + 'ausXXXXXXXXXXXXXXXX';
const AUTHZ_URL = AUTHZ_SERVER + '/v1/authorize';
const CLIENT_ID = okta.client.id; // command line env var: OKTA_CLIENT_ID
//variables
var redirectUri = '';
var scopes = [];
var tokens = [];
var oktaAuth = createOktaAuth('');

/**
 * validateAuthZ
 * validates if a user has authorized ID Token and Access Token
 * param Object to - info about request destination
 * param Object from - info about request origin
 * param Object next - for triggering the next step in the Vue lifecycle
 */
export function validateAuthZ(to, from, next) {
  hasValidIdToken( function (idToken) {
    // APP SESSION = FALSE
    // If the user requests the Premium Promos page, but aren't signed in yet,
    // we must first request the ID Token
    if(!idToken) {
      // delete invalid tokens if they exist
      oktaAuth.tokenManager.clear();
      // where Okta will redirect the user back to to process the ID Token
      // must be allowed in OIDC app def. in Okta
      redirectUri = window.location.origin + '/redirect';
      // instantiate new OktaAuth object with redirect URI for ID Token
      oktaAuth = createOktaAuth(redirectUri);
      // Base OIDC Scopes that this app requires
      // TODO: Update Scopes
      scopes = ['openid'];
      tokens = ['id_token'];
      router.push('/login');
    // APP SESSION = TRUE
    // if the user is logged in to the app, then we need to
    // request the access token
    } else {
      hasValidAccessToken( function (accessToken) {
        // VALID ACCESS TOKEN DOESN'T EXIST
        if(!accessToken) {
          // based on what is in the promosScopes claim in the ID Token,
          // set the scopes requested for the access token
          // TODO: Update Scopes to use Claim from ID Token
          scopes = ['promos:read'];
          tokens = ['token'];
          // OKTA SESSION = TRUE and LOCAL SESSION = FALSE
          oktaAuth.token.getWithoutPrompt({
            responseType: tokens,
            scopes: scopes
          })
          .then(function (tokenArray) {
            oktaAuth.tokenManager.add('access_token', tokenArray[0]);
            next();
          })
          .catch(function (err) {
            alert('error: ' + err.message);
            router.push('/error');
          });
        // VALID ACCESS TOKEN DOES EXIST
        } else {
          // send the user to the page they requested
          next();
        }
      });
    }
  });

}

/**
 * validatePremPromosAuthZ
 * wrapper for validateAuthZ()
 * sets relayState first
*/
export function validatePremPromosAuthZ(to, from, next) {
  // persist page requested for use after redirect back
  sessionStorage.setItem('relayState', 'premium-promos');
  validateAuthZ(to, from, next);
}

/**
 * validateProfileAuthZ
 * wrapper for validateAuthZ()
 * sets relayState first
*/
export function validateProfileAuthZ(to, from, next) {
  // persist page requested for use after redirect back
  sessionStorage.setItem('relayState', 'profile');
  validateAuthZ(to, from, next);
}

/**
 * loginAtOkta
 * Starts the OAuth login process with redirect using the Okta Auth JS
 * access public
 */
export function loginAtOkta() {
  oktaAuth.token.getWithRedirect({
    responseType: tokens,
    scopes: scopes,
  });
}

/**
 * redirect
 * Called by Okta after the OIDC Login.
 * Extract and validate ID Token from the redirect
 * and save token info in Token Manager.
 * The parseFromUrl perfoms the token validation
 * access public
 */
export function redirect() {
  oktaAuth.token.parseFromUrl()
  .then(function (tokenArray) {
    oktaAuth.tokenManager.add('id_token', tokenArray[0]);
    router.push(getRelayState());
  })
  .catch(function (err) {
    alert('error: ' + err.errorCode + '\nmessage: ' + err.message);
    router.push('/error');
  });
}

/**
 * hasValidIdToken
 * Checks whether the user is logged in locally. If not, clears the tokenManager
 * return boolean true when the user is logged in with a valid session
 */
function hasValidIdToken(done) {
  getIdToken()
  .then(function (token) {
    done(token);
  })
  .catch(function (err) {
    console.error(err);
  });
}

/**
 * createOktaAuth
 * Helper - generates and returns an OktaAuth object
 */
function createOktaAuth(redirectUriArg) {
  return new OktaAuth({
    url: OKTA_ORG,
    clientId: CLIENT_ID,
    redirectUri: redirectUriArg,
    issuer: AUTHZ_SERVER,
    authorizeUrl: AUTHZ_URL
  });
}

/**
 * getRelayState
 * Helper - limits the URLs stored in session storage to enumerated strings
 */
function getRelayState() {
  switch (sessionStorage.getItem('relayState')) {
    case 'profile':
      redirectUri = '/profile';
      break;
    case 'premium-promos':
      redirectUri = '/premium-promos';
      break;
    case 'home':
      redirectUri = '/';
      break;
    default:
      redirectUri = '/error';
  }
  return redirectUri;
}

/**
 * getIdToken
 * Get ID Token from tokenManager
 * access public
 */
export function getIdToken() {
  return oktaAuth.tokenManager.get('id_token');
}

/**
 * getAccessToken
 * Get access from tokenManager
 * access public
 */
export function getAccessToken() {
  return oktaAuth.tokenManager.get('access_token');
}

/**
 * hasValidIdToken
 * Checks whether the user is logged in locally. If not, clears the tokenManager
 * return boolean true when the user is logged in with a valid session
 */
function hasValidAccessToken(done) {
  getAccessToken()
  .then(function (token) {
    done(token);
  })
  .catch(function (err) {
    console.error(err);
  });
}

/**
 * validateAccessOkta
 * validates if a user can access protected pages based on
 * ID Token and Okta sessionToken
 * param Object to - info about request destination
 * param Object from - info about request origin
 * param Object next - for triggering the next step in the Vue lifecycle
 */
export function validateAccessOkta(to, from, next) {
  hasOktaSession(function (hasOktaSessionBool) {
    // OKTA SESSION = FALSE
    if(!hasOktaSessionBool) {
      oktaAuth.tokenManager.clear();
      router.push('/loginform');
    } else {
      hasValidIdToken(function (idToken) {
        // OKTA SESSION = TRUE and LOCAL SESSION = FALSE
        if(!idToken) {
          oktaAuth.token.getWithoutPrompt({
            responseType: tokens,
            scopes: scopes
          })
          .then(function (tokenArray) {
            oktaAuth.tokenManager.add('access_token',
                                          tokenArray[0]);
            oktaAuth.tokenManager.add('id_token',
                                          tokenArray[1]);
            next();
          })
          .catch(function (err) {
            alert('error: ' + err.message);
            router.push('/error');
          });
        // OKTA SESSION = TRUE and LOCAL SESSION = TRUE
        } else {
          next();
        }
      });
    }
  });


}

/**
 * hasOktaSession
 * Checks whether the user has an active session at Okta.
 */
function hasOktaSession(done) {
  oktaAuth.session.exists()
  .then(function (exists) {
    done(exists);
  })
  .catch(function (err) {
    console.error(err);
  });
}

/**
 * logoutLocal
 * Clear the id_token and access_token from tokenManager and redirects user to /home
 * access public
 */
export function logoutLocal() {
 oktaAuth.tokenManager.clear();
 router.push('/home');
}

/**
 * getAuthHeader
 * get Authorization header for REST requests with OAuth
 * access public
 * return Object headers
 */
export async function getAuthHeader() {
  var token = await getAccessToken();
  return {
    headers: {
      'Authorization': 'Bearer ' + token.accessToken
    }
  }

}

/**
 * logout Okta
 * Close the user's session at Okta
 * access public
 */
export function logoutOkta() {
  hasOktaSession(function (hasOktaSessionBool) {
    if (hasOktaSessionBool) {
      //Sign out from Okta
      oktaAuth.signOut()
      .then(function () {
        router.push('/home');
      })
      .catch(function (err) {
        console.error(err);
        router.push('/error');
      });
    } else {
      console.log('logoutOkta(): hasOktaSession() returned false.');
    }
  });
}

/**
 * Single Logout
 * Clear the id_token and access_token and close the user's session at Okta
 * access public
 */
export function singleLogout() {
  //Sign out from the app
  oktaAuth.tokenManager.clear();

  hasOktaSession(function (hasOktaSessionBool) {
    if (hasOktaSessionBool) {
      //Sign out from Okta
      oktaAuth.signOut()
      .then(function () {
        router.push('/home');
      })
      .catch(function (err) {
        console.error(err);
        router.push('/error');
      });
    } else {
      console.log("singleLogout(): hasOktaSession() returned false.");
      router.push('/home');
    }
  });
}

/**
 * Check Okta Session
 * Check if a session exists on Okta
 * access public
 */
export function checkOktaSession() {
  oktaAuth.session.exists()
  .then(function (exists) {
    if (exists) {
      oktaAuth.session.get()
      .then(function (session) {
        window.alert('Username: ' + session.login +
                     '\n Expires At: ' + session.expiresAt);
      })
      .catch(function (err) {
        router.push('/error');
      });
    } else {
      window.alert('No!');
    }
  });
}

/**
 * loginWithForm
 * log into Okta using the AuthJS.
 * After a successful login, request an OIDC token using the sessionToken
 * param String login - user login
 * param String password - user password
 */
export function loginWithForm(login, password) {
 oktaAuth.signIn({
   username: login,
   password: password
 })
 .then(function (transaction) {
   if (transaction.status === 'SUCCESS') {
     oktaAuth.token.getWithoutPrompt({
       responseType: tokens,
       scopes: scopes,
       sessionToken: transaction.sessionToken
     })
     .then(function (tokenArray) {
       //save the id_token and the access_token in the tokenManager
       oktaAuth.tokenManager.add('access_token', tokenArray[0]);
       oktaAuth.tokenManager.add('id_token', tokenArray[1]);
       router.push('/profile')
     })
     .catch(function (err) {
       //Errors during the login are returned as OAuthError
       alert('error: ' + err.errorCode + '\nmessage: ' + err.message);
       router.push('/error')
     });
   } else {
     alert('We cannot handle the ' + transaction.status + ' status');
   }
 })
 .catch(function (err) {
   console.error(err);
 });
}
