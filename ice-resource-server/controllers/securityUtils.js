//import OktaJwtVerifier from "@okta/jwt-verifier";
import configs from "../config.js";

//Authenticate and validate access token
export function validationRequired(req, res, next, scopes) {
  //Extract the Access token
  // const authHeader = req.headers.authorization ? req.headers.authorization : "";
  // const match = authHeader.match(/Bearer (.+)/);
  //
  // if (!match) {
  //   return res.status(401).end();
  // }
  // const accessToken = match[1];
  //Initiate OktaJwtVerifier
  // const verifier = new OktaJwtVerifier({
  //   issuer: configs.issuer,
  //   clientId: configs.clientId,
  //   assertClaims: {
  //     aud: configs.audience,
  //     'scp.includes': scopes
  //   }
  // });
  //Verify the access token
  //   verifier.verifyAccessToken(accessToken, configs.audience)
  //     .then((jwt) => {
  //       req.jwt = jwt;
  //       next();
  //     })
  //     .catch((err) => {
  //       res.status(401).send(err.message);
  //     });
}
