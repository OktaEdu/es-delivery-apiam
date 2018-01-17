import router from '../router' //router: required to redirect users
// import OktaAuth from '@okta/okta-auth-js' //okta authjs: required login in Okta

//constants
// const OKTA_ORG = 'https://oktacdev024.oktapreview.com';
// const AUTHZ_SERVER = 'https://oktacdev024.oktapreview.com';
// const AUTHZ_URL = AUTHZ_SERVER + '/oauth2/v1/authorize';
// const CLIENT_ID = '0oab1ll87sMhnbeZh0h7';
// const REDIRECT_URL = 'http://localhost:8080/redirect';
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
 * loginOkta
 * Starts the OAuth login process with redirect using the Okta Auth JS
 * @access public
 */
export function loginOkta() {

}

/**
 * loginWithForm
 * log into Okta using the AuthJS.
 * After a successful login, request an OIDC token using the sessionToken
 * @param String login - user login
 * @param String password - user password
 */
 export function loginWithForm(login, password) {

 }

/**
 * redirect
 * Called by Okta after the OIDC Login.
 * Extract and validate tokens from the redirect and save token info in Token Manager
 * The parseFromUrl perfoms the token validation
 * @access public
 */
export function redirect() {
  alert('error: Redirect is not implemented yet');
  router.push('/error');
}


/**
 * logout
 * Clear the id_token and access_token from tokenManager and redirects user to /home
 * @access public
 */
export function logout() {

}

/**
 * getIdToken
 * Get idToken from tokenManager
 * @access public
 * @return Object idToken
 */
export function getIdToken() {
  // return OKTA_AUTH_JS.tokenManager.get('id_token');
}

/**
 * getAccessToken
 * Get access from tokenManager
 * @access public
 * @return Object accessToken
 */
export function getAccessToken() {
  // return OKTA_AUTH_JS.tokenManager.get('access_token');
}


/**
 * getAuthHeader
 * get Authorization header for REST requests with OAuth
 * @access public
 * @return Object headers
 */
export function getAuthHeader() {

}

/**
 * validateAccess
 * validates if a user can access protected pages.
 * @param Object to - info about request destination
 * @param Object from - info about request origin
 * @param Object next - for triggering the next step in the Vue lifecycle
 */
export function validateAccess(to, from, next) {

}

/**
 * isLoggedIn
 * Checks whether the user is logged in. If not, clears the tokenManager
 * @return boolean true when the user is logged in with a valid session
 */
export function isLoggedIn() {

}

/**
 * isTokenExpired
 * check if a token is expired
 * @param Object token - id_token or access_token for validation
 * @return boolean true when the token is expired
 */
function isTokenExpired(token) {

}

/**
 * getTokenExpiration
 * get the token expiration date (expiresAt field)
 * @param Object token - id_token or access_token for validation
 * @return Date token expiration date and time
 */
function getTokenExpiration(token) {

}
