// config.js
export default {
  oidc: {
    clientId: "XXXXXXXXXXXXXXXXXX",
    issuer: "https://oktaiceXXXXXXXX.oktapreview.com",
    redirectUri: window.location.origin + "/login/callback",
    // authorizationEndpoint: "https:// oktaiceXXXXXXXX.oktapreview.com/oauth2/axxxxxxxxxxxx/v1/authorize",
    scopes: ["openid", "profile", "email"],
    tokenManager: {
      storage: "localStorage",
    },
  },
};
