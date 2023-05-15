import { createApp } from "vue";
import { OktaAuth } from "@okta/okta-auth-js";
import OktaVue from "@okta/okta-vue";
import App from "./App.vue";
import router from "./router";

import myConfig from "@/config";

// instantiate an OktaAuth object with the settings in config.js
const oktaAuth = new OktaAuth(myConfig.oidc);

createApp(App)
  .directive("focus", {
    // When the bound element is inserted into the DOM...
    mounted: function (el) {
      // Focus the element
      el.focus();
    },
  })
  .use(router)
  .use(OktaVue, {
    oktaAuth,
    onAuthRequired: async () => {
      await oktaAuth.signInWithRedirect({ originalUri: "/" });
    },
    onAuthResume: async () => {
      await oktaAuth.signInWithRedirect({ originalUri: "/" });
    },
  })
  .mount("#app");

export async function getAuthHeader() {
  return {};
}

export async function adaptScopes() {
  // Get existing access token and id token (we will call this only after successful login)
  const accessToken = await oktaAuth.tokenManager.get("accessToken");
  const idToken = await oktaAuth.tokenManager.get("idToken");
  // Get user info associated with the tokens
  let userInfo = await oktaAuth.token.getUserInfo(accessToken, idToken);
  // Extract the promosScopes group claim (array of scopes)
  // and concatenate that array with the array of existing scopes set in config.js
  let scopes = userInfo["promosScopes"].concat(myConfig.oidc.scopes);
  // Create an expiration time that is one hour from now
  let currentTime = new Date().getTime();
  let updatedTime = new Date(currentTime + 2 * 60 * 60 * 1000);
  // Configuration for the updated/renewed token with custom scopes
  let tokenToRenew = {
    accessToken: accessToken,
    claims: { scps: scopes },
    scopes: scopes,
    expiresAt: updatedTime,
    authorizeUrl: myConfig.oidc.authorizeUrl,
    issuer: myConfig.oidc.issuer,
    clientId: myConfig.oidc.clientId,
  };
  // Renew the access token with custom scopes extracted from the ID Token
  // and add this token to the token manager
  oktaAuth.token
    .renew(tokenToRenew)
    .then(function (freshToken) {
      console.log(freshToken);
      oktaAuth.tokenManager.add("accessToken", freshToken);
    })
    .catch(function (err) {
      // handle OAuthError
      console.log(err);
    });
  return;
}
