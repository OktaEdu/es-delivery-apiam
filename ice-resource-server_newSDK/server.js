//BEGIN: IMPORT CODE DEPENDENCIES
const express = require('express');
const OktaJwtVerifier = require('@okta/jwt-verifier');
var cors = require('cors');
var setupController=require('./controllers/setupController');
//END: IMPORT CODE DEPENDENCIES

const app = express();
app.use(cors());

//BEGIN: INITIALIZE OKTA JWT VERIFIER
const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://okta.okta.com/oauth2/default',
  clientId: '0oah4yba7chCY1Jc60h7',
  assertClaims: {
    aud: 'api://default',
  },
});
//END: INITIALIZE OKTA JWT VERIFIER


setupController(app);
//BEGIN: SECURITY CONFIGURATION

//END: SECURITY CONFIGURATION


//SETS A LISTEN HOST AND PORT FOR THE API
app.listen(process.env.PORT || 5000);
