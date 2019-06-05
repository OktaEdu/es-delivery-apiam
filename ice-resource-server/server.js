//BEGIN: IMPORT CODE DEPENDENCIES
const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var setupController=require('./controllers/setupController');
//END: IMPORT CODE DEPENDENCIES

//APP CONFIGURATION SETUP
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//SETS A LISTEN HOST AND PORT FOR THE API
app.listen(process.env.PORT || 5000);

//START THE APP
setupController(app);
