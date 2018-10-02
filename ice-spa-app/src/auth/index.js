import router from '../router' //router: required to redirect users
//import OktaAuth from '@okta/okta-auth-js' //okta authjs: required login in Okta

//constants
// const OKTA_ORG = 'https://oktaiceXXX.oktapreview.com';
// const AUTHZ_SERVER = OKTA_ORG;
// const AUTHZ_URL = AUTHZ_SERVER + '/oauth2/v1/authorize';
// const CLIENT_ID = okta.client.id; // command line env var: OKTA_CLIENT_ID
// const REDIRECT_URL = window.location.origin + '/redirect';
// const SCOPES = ['openid', 'profile', 'email'];
// const TOKENS = ['token', 'id_token'];
// const OKTA_AUTH_JS = new OktaAuth({
//   url: OKTA_ORG,
//   clientId: CLIENT_ID,
//   redirectUri: REDIRECT_URL,
//   issuer: AUTHZ_SERVER,
//   authorizeUrl: AUTHZ_URL,
// });

/**
 * TODO: loginOkta
 * Starts the OAuth login process with redirect using the Okta Auth JS
 * access public
 */
export function loginOkta() {

}

/**
 * TODO: redirect
 * Called by Okta after the OIDC Login.
 * Extract and validate tokens from the redirect and save token info in Token Manager
 * The parseFromUrl perfoms the token validation
 * access public
 */
export function redirect() {

}

/**
 * TODO: getIdToken
 * Get idToken from tokenManager
 * access public
 * return Object idToken
 */
export function getIdToken() {

}

/**
 * TODO: getAccessToken
 * Get access from tokenManager
 * access public
 * return Object accessToken
 */
export function getAccessToken() {

}

/**
 * TODO: validateAccessLocal
 * validates if a user can access protected pages based on ID Token
 * param Object to - info about request destination
 * param Object from - info about request origin
 * param Object next - for triggering the next step in the Vue lifecycle
 */
export function validateAccessLocal(to, from, next) {

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

}

/**
 * TODO: hasOktaSession
 * Checks whether the user has an active session at Okta.
 */
function hasOktaSession( done ) {

}

/**
 * TODO: hasValidIdToken
 * Checks whether the user is logged in locally. If not, clears the tokenManager
 * return boolean true when the user is logged in with a valid session
 */
function hasValidIdToken( done ) {

}

/**
 * TODO: logoutLocal
 * Clear the id_token and access_token from tokenManager and redirects user to /home
 * access public
 */
export function logoutLocal() {

}

/**
 * TODO: getAuthHeader
 * get Authorization header for REST requests with OAuth
 * access public
 * return Object headers
 */
export function getAuthHeader() {

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
      OKTA_AUTH_JS.signOut()
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
  OKTA_AUTH_JS.tokenManager.clear();

  hasOktaSession(function(hasOktaSessionBool) {
    if (hasOktaSessionBool) {
      //Sign out from Okta
      OKTA_AUTH_JS.signOut()
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
 * param String login - user login
 * param String password - user password
 */
export function loginWithForm(login, password) {
 OKTA_AUTH_JS.signIn({
   username: login,
   password: password
 })
 .then(function (transaction) {
   if (transaction.status === 'SUCCESS') {
     OKTA_AUTH_JS.token.getWithoutPrompt({
       responseType: TOKENS,
       scopes: SCOPES,
       sessionToken: transaction.sessionToken
     })
     .then(function (tokenArray) {
       //save the id_token and the access_token in the tokenManager
       OKTA_AUTH_JS.tokenManager.add('access_token', tokenArray[0]);
       OKTA_AUTH_JS.tokenManager.add('id_token', tokenArray[1]);
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
