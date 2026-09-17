// config.js
export default {
  oidc: {
    clientId: "0oa13t69y38GhNF2n1d8", // 👈 update with your Client ID
    issuer: "https://kazemi-oie.oktapreview.com", // 👈 update
    redirectUri: window.location.origin + "/login/callback",
    // authorizationEndpoint: "https://{domain}.okta.com/oauth2/axxxxxxxxxxxx/v1/authorize",
    scopes: ["openid", "profile", "email"],
    tokenManager: {
      storage: "localStorage",
    },
  },
};
