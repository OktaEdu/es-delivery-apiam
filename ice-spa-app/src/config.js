// config.js
export default {
  oidc: {
    clientId: "0oaqca4m0bBAVq9cA697", // 👈 update with your Client ID
    issuer: "https://demo-indigo-cricket.okta.com/oauth2/ausqcad81rGdAKjrv697", // 👈 update
    redirectUri: window.location.origin + "/login/callback",
    authorizationEndpoint: "https://demo-indigo-cricket.okta.com/oauth2/ausqcad81rGdAKjrv697/v1/authorize",
    scopes: ["openid", "profile", "email", "promos:read"],
    tokenManager: {
      storage: "localStorage",
    },
  },
};
