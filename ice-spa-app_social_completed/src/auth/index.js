import router from '../router' //router: required to redirect users
import OktaAuth from '@okta/okta-auth-js' //okta authjs: required login in Okta

//constants
const OKTA_ORG = 'https://oktacdev024.oktapreview.com';
const AUTHZ_SERVER = 'https://oktacdev024.oktapreview.com/oauth2/ausazr3usgim5HCTH0h7';
const AUTHZ_URL = AUTHZ_SERVER + '/v1/authorize';
const CLIENT_ID = '0oab1ll87sMhnbeZh0h7';
const REDIRECT_URL = 'http://localhost:8080/redirect';
const SCOPES = ['openid', 'profile', 'email', 'promos:read'];
const TOKENS = ['token', 'id_token'];
const OKTA_AUTH_JS = new OktaAuth({
  url: OKTA_ORG,
  clientId: CLIENT_ID,
  redirectUri: REDIRECT_URL,
  issuer: AUTHZ_SERVER,
  authorizeUrl: AUTHZ_URL,
});

/**
 * loginOkta
 * Starts the OAuth login process with redirect using the Okta Auth JS
 * @access public
 */
export function loginOkta() {
  OKTA_AUTH_JS.token.getWithRedirect({
    responseType: TOKENS,
    scopes: SCOPES
  });
}

export function loginWithFB() {
  OKTA_AUTH_JS.token.getWithRedirect({
    responseType: TOKENS,
    scopes: SCOPES,
    idp: '0oab1x6uimRQJMpar0h7'
  });
}

/**
 * loginWithForm
 * log into Okta using the AuthJS.
 * After a successful login, request an OIDC token using the sessionToken
 * @param String login - user login
 * @param String password - user password
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
 .fail(function (err) {
   console.error(err);
 });
}

/**
 * redirect
 * Called by Okta after the OIDC Login.
 * Extract and validate tokens from the redirect and save token info in Token Manager
 * The parseFromUrl perfoms the token validation
 * @access public
 */
export function redirect() {
  OKTA_AUTH_JS.token.parseFromUrl()
  .then(function (tokenArray) {
    //get token from the url
    //save the id_token and the access_token in the tokenManager
    OKTA_AUTH_JS.tokenManager.add('access_token', tokenArray[0]);
    OKTA_AUTH_JS.tokenManager.add('id_token', tokenArray[1]);
    router.push('/profile')
  })
  .catch(function (err) {
    //Errors during the login are returned as OAuthError
    alert('error: '+err.errorCode + '\nmessage: ' + err.message);
    router.push('/error')
  });
}


/**
 * logout
 * Clear the id_token and access_token from tokenManager and redirects user to /home
 * @access public
 */
export function logout() {
  if (isLoggedIn()) {
    //Sign out from the app
    OKTA_AUTH_JS.tokenManager.clear();
    OKTA_AUTH_JS.signOut()
    .then(function () {
      router.push('/home');
    })
    .fail(function (err) {
      console.error(err);
      router.push('/error');
    });
  } else {
    console.log("Not logged in");
    router.push('/home');
  }
}

/**
 * getIdToken
 * Get idToken from tokenManager
 * @access public
 * @return Object idToken
 */
export function getIdToken() {
  return OKTA_AUTH_JS.tokenManager.get('id_token');
}

/**
 * getAccessToken
 * Get access from tokenManager
 * @access public
 * @return Object accessToken
 */
export function getAccessToken() {
  return OKTA_AUTH_JS.tokenManager.get('access_token');
}


/**
 * getAuthHeader
 * get Authorization header for REST requests with OAuth
 * @access public
 * @return Object headers
 */
export function getAuthHeader() {
  return {
    headers:{
      'Authorization': 'Bearer ' + getAccessToken().accessToken
    }
  }
}

/**
 * validateAccess
 * validates if a user can access protected pages.
 * @param Object to - info about request destination
 * @param Object from - info about request origin
 * @param Object next - for triggering the next step in the Vue lifecycle
 */
export function validateAccess(to, from, next) {
  if (!isLoggedIn()) {
    router.push('/loginform');
  } else {
    next();
  }
}

/**
 * isLoggedIn
 * Checks whether the user is logged in. If not, clears the tokenManager
 * @return boolean true when the user is logged in with a valid session
 */
export function isLoggedIn() {
 //check if the id token exists and is not expired
 const idToken = getIdToken();
 const accessToken = getAccessToken();
 if (
   idToken && !isTokenExpired(idToken) &&
   accessToken && !isTokenExpired(accessToken)
 ) {
   return true;
 }
 OKTA_AUTH_JS.tokenManager.clear();
 return false;
}

/**
 * isTokenExpired
 * check if a token is expired
 * @param Object token - id_token or access_token for validation
 * @return boolean true when the token is expired
 */
function isTokenExpired(token) {
  var tokenExpired = getTokenExpiration(token) < Date.now();
  if (tokenExpired) {
    alert(
      'The token expiration date is due: ' +
      '\nToken expiration: ' + getTokenExpiration(token) +
      '\nCurrent time: ' + Date() + '.' +
      '\nClick OK to start a new session.'
    );
  }
  return tokenExpired;
}

/**
 * getTokenExpiration
 * get the token expiration date (expiresAt field)
 * @param Object token - id_token or access_token for validation
 * @return Date token expiration date and time
 */
function getTokenExpiration(token){
  if (!token.expiresAt) { return null; }
  const date = new Date(0);
  date.setUTCSeconds(token.expiresAt);
  return date;
}
