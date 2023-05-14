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
  const accessToken = await oktaAuth.tokenManager.get("accessToken");
  const idToken = await oktaAuth.tokenManager.get("idToken");
  let userInfo = await oktaAuth.token.getUserInfo(accessToken, idToken);
  let scopes = userInfo["promosScopes"].concat(myConfig.oidc.scopes);
  console.log(scopes);
  let currentTime = new Date().getTime();
  let updatedTime = new Date(currentTime + 2 * 60 * 60 * 1000);
  var tokenToRenew = {
    accessToken: accessToken,
    claims: { scps: scopes },
    scopes: scopes,
    expiresAt: updatedTime,
    authorizeUrl: myConfig.oidc.authorizeUrl,
    issuer: myConfig.oidc.issuer,
    clientId: myConfig.oidc.clientId,
  };
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
