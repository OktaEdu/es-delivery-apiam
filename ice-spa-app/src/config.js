// config.js
export default {
  oidc: {
    clientId: "0oax3gr1ovk6Vfeie697", // 👈 update with your Client ID
    issuer: "https://integrator-4448035.okta.com", // 👈 update
    redirectUri: window.location.origin + "/login/callback",
    // authorizationEndpoint: "https://integrator-4448035.okta.com/oauth2/axxxxxxxxxxxx/v1/authorize",
    scopes: ["openid", "profile", "email"],
    tokenManager: {
      storage: "localStorage",
    },
  },
};
