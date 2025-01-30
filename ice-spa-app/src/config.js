// config.js
export default {
  oidc: {
    clientId: "XXXXXXXXXXXXXXXXXX", // 👈 update with your Client ID
    issuer: "https://{domain}.okta.com", // 👈 update with your Okta Org URL
    redirectUri: window.location.origin + "/login/callback",
    // authorizationEndpoint: "https://{domain}.okta.com/oauth2/axxxxxxxxxxxx/v1/authorize",
    scopes: ["openid", "profile", "email"],
    tokenManager: {
      storage: "localStorage",
    },
  },
};
