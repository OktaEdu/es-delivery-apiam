//const OktaJwtVerifier = require('@okta/jwt-verifier');

//Authenticate and validate access token
  function validationRequired(req, res, next, scopes) {

	//Substract the Access token
    // const authHeader = req.headers.authorization || '';
    // const match = authHeader.match(/Bearer (.+)/);
    //
    // if (!match) {
    //   return res.status(401).end();
    // }
    // const accessToken = match[1];
    // const AUDIENCE = "http://localhost:8081";

	//Initiate OktaJwtVerifier
    // const verifier = new OktaJwtVerifier({
    //   issuer: 'https://oktaice###.oktapreview.com/oauth2/a###############',
    //   clientId: 'okta.client.id',
    //   assertClaims: {
    //     aud: AUDIENCE,
    //     'scp.includes': scopes
    //   }
    // });

	//Verify the access token
  //   verifier.verifyAccessToken(accessToken, AUDIENCE)
  //     .then((jwt) => {
  //       req.jwt = jwt;
  //       next();
  //     })
  //     .catch((err) => {
  //       res.status(401).send(err.message);
  //     });
  // }

module.exports.validationRequired = validationRequired;
