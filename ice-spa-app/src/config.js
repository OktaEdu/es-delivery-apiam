// config.js
export default {
  oidc: {
    clientId: "XXXXXXXXXXXXXXXXXX",
    issuer: "https://oktaiceXXXXXXXX.oktapreview.com",
    redirectUri: window.location.origin + "/login/callback",
    scopes: ["openid", "profile", "email"],
    tokenManager: {
      storage: "localStorage",
    },
  },
};
