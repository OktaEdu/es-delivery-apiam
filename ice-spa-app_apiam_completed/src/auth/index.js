import router from '../router' //router: required to redirect users
import {OktaAuth} from '@okta/okta-auth-js' //okta authjs: required login in Okta

//constants
const OKTA_ORG = 'https://oktaiceXXX.oktapreview.com';
const AUTHZ_SERVER = OKTA_ORG + '/oauth2/' + 'ausXXXXXXXXXXXXXXXX';
const AUTHZ_URL = AUTHZ_SERVER + '/v1/authorize';
const CLIENT_ID = okta.client.id; // command line env var: OKTA_CLIENT_ID
const REDIRECT_URL = window.location.origin + '/redirect';
const SCOPES = ['openid', 'profile', 'email','promos:read'];

//variables
var grantType;
var responseType;
var pkceFlag;
if (!OktaAuth.features.isPKCESupported()) {
  console.log('PKCE is not supported in this browser');
  grantType = 'implicit';
  responseType = ['token', 'id_token'];
  pkceFlag = false;
}

//Initiate the Okta Client
const OKTA_AUTH_JS = new OktaAuth({
  grantType: grantType,
  url: OKTA_ORG,
  clientId: CLIENT_ID,
  redirectUri: REDIRECT_URL,
  issuer: AUTHZ_SERVER,
  authorizeUrl: AUTHZ_URL,
  pkce: pkceFlag
});

/**
 * TODO: loginOkta
 * Starts the OAuth login process with redirect using the Okta Auth JS
 * access public
 */
export function loginOkta() {
  OKTA_AUTH_JS.token.getWithRedirect({
    responseType: responseType,
    scopes: SCOPES,
  });
}

/**
 * TODO: redirect
 * Called by Okta after the OIDC Login.
 * Extract and validate tokens from the redirect and save token info in Token Manager
 * The parseFromUrl perfoms the token validation
 * access public
 */
export function redirect() {
  OKTA_AUTH_JS.token.parseFromUrl()
  .then(function(res) {
    var tokens = res.tokens;
    OKTA_AUTH_JS.tokenManager.add('id_token', tokens.idToken);
    OKTA_AUTH_JS.tokenManager.add('access_token', tokens.accessToken);
    router.push('/profile');
    })
    .catch(function (err) {
      alert('error: ' + err.errorCode + '\nmessage: ' + err.message);
      router.push('/error');
    });
}

/**
 * TODO: getIdToken
 * Get idToken from tokenManager
 * access public
 * return Object idToken
 */
export function getIdToken() {
  return OKTA_AUTH_JS.tokenManager.get('id_token');
}

/**
 * TODO: getAccessToken
 * Get access from tokenManager
 * access public
 * return Object accessToken
 */
export function getAccessToken() {
  return OKTA_AUTH_JS.tokenManager.get('access_token');
}

/**
 * TODO: validateAccessLocal
 * validates if a user can access protected pages based on ID Token
 * param Object to - info about request destination
 * param Object from - info about request origin
 * param Object next - for triggering the next step in the Vue lifecycle
 */
export function validateAccessLocal(to, from, next) {
  hasValidIdToken(function( hasValidIdTokenBool ) {
    // LOCAL SESSION = FALSE
    if(!hasValidIdTokenBool) {
      OKTA_AUTH_JS.tokenManager.clear();
      router.push('/login');
    // LOCAL SESSION = TRUE
    } else {
      next();
    }
  });
}

/**
 * TODO: validateAccessOkta
 * validates if a user can access protected pages based on
 * ID Token and Okta sessionToken
 * param Object to - info about request destination
 * param Object from - info about request origin
 * param Object next - for triggering the next step in the Vue lifecycle
 */
export function validateAccessOkta(to, from, next) {
  hasOktaSession(function( hasOktaSessionBool ) {
    // OKTA SESSION = FALSE
    if(!hasOktaSessionBool) {
      OKTA_AUTH_JS.tokenManager.clear();
      router.push('/login');
    } else {
      hasValidIdToken(function( hasValidIdTokenBool ) {
        // OKTA SESSION = TRUE and LOCAL SESSION = FALSE
        if(!hasValidIdTokenBool) {
          OKTA_AUTH_JS.token.getWithoutPrompt({
            responseType: responseType,
            scopes: SCOPES
          })
          .then(function(res) {
            var tokens = res.tokens;
            OKTA_AUTH_JS.tokenManager.add('id_token', tokens.idToken);
            OKTA_AUTH_JS.tokenManager.add('access_token', tokens.accessToken);
            next();
          })
          .catch(function(err) {
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
 * TODO: hasOktaSession
 * Checks whether the user has an active session at Okta.
 */
function hasOktaSession( done ) {
  OKTA_AUTH_JS.session.exists()
  .then(function(exists) {
    done(exists);
  })
  .catch(function(err) {
    console.error(err);
  });
}

/**
 * TODO: hasValidIdToken
 * Checks whether the user is logged in locally. If not, clears the tokenManager
 * return boolean true when the user is logged in with a valid session
 */
function hasValidIdToken( done ) {
  OKTA_AUTH_JS.tokenManager.get('id_token')
  .then(function(token) {
    done(token);
  })
  .catch(function(err) {
    console.error(err);
  });
}

/**
 * TODO: logoutLocal
 * Clear the id_token and access_token from tokenManager and redirects user to /home
 * access public
 */
export function logoutLocal() {
 OKTA_AUTH_JS.tokenManager.clear();
 router.push('/home');
}

/**
 * TODO: getAuthHeader
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
  hasOktaSession(function(hasOktaSessionBool) {
    if (hasOktaSessionBool) {
      //Sign out from Okta
      OKTA_AUTH_JS.signOut({
          postLogoutRedirectUri:'${window.location.origin}/home'
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
  OKTA_AUTH_JS.tokenManager.clear();

  hasOktaSession(function(hasOktaSessionBool) {
    if (hasOktaSessionBool) {
      //Sign out from Okta
      OKTA_AUTH_JS.signOut({
        postLogoutRedirectUri:'${window.location.origin}/home'
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
  OKTA_AUTH_JS.session.exists()
  .then(function(exists) {
    if (exists) {
      OKTA_AUTH_JS.session.get()
      .then(function(session) {
        window.alert('Username: ' + session.login +
                     '\n Expires At: ' + session.expiresAt);
      })
      .catch(function(err) {
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
 * param String username - user name
 * param String password - user password
 */
export function loginWithForm(username, password) {
 OKTA_AUTH_JS.signIn({
   username: username,
   password: password
 })
 .then(function (transaction) {
   if (transaction.status === 'SUCCESS') {
     OKTA_AUTH_JS.token.getWithoutPrompt({
       responseType: responseType,
       scopes: SCOPES,
       sessionToken: transaction.sessionToken
     })
     .then(function(res) {
       var tokens = res.tokens;
       OKTA_AUTH_JS.tokenManager.add('id_token', tokens.idToken);
       OKTA_AUTH_JS.tokenManager.add('access_token', tokens.accessToken);
       router.push('/profile');
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
