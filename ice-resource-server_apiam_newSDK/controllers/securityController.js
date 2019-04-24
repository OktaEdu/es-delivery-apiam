const OktaJwtVerifier = require('@okta/jwt-verifier');

//BEGIN: INITIALIZE OKTA JWT VERIFIER
  const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: 'https://oktaicephe100.oktapreview.com/oauth2/aush6hs3h3vE72pRe0h7',
    clientId: 'okta.client.id',
    assertClaims: {
      aud: 'http://localhost:5000',
    },
  });
  //END: INITIALIZE OKTA JWT VERIFIER

//Authendicate and validate access token
  function authenticationRequired(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/Bearer (.+)/);

    if (!match) {
      return res.status(401).end();
    }

    const accessToken = match[1];
    console.log(accessToken);

    return oktaJwtVerifier.verifyAccessToken(accessToken)
      .then((jwt) => {
        req.jwt = jwt;
        next();
      })
      .catch((err) => {
        res.status(401).send(err.message);
      });
  }

module.exports.authenticationRequired = authenticationRequired;
