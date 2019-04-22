//BEGIN: IMPORT CODE DEPENDENCIES
const express = require('express');
const OktaJwtVerifier = require('@okta/jwt-verifier');
var cors = require('cors');
var setupController=require('./controllers/setupController');
//END: IMPORT CODE DEPENDENCIES

const app = express();
app.use(cors());
setupController(app);

//BEGIN: INITIALIZE OKTA JWT VERIFIER

//END: INITIALIZE OKTA JWT VERIFIER


//BEGIN: SECURITY CONFIGURATION

//END: SECURITY CONFIGURATION


//SETS A LISTEN HOST AND PORT FOR THE API
app.listen(process.env.PORT || 5000);
