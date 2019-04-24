//BEGIN: IMPORT CODE DEPENDENCIES
const express = require('express');
var cors = require('cors');
var setupController=require('./controllers/setupController');
//END: IMPORT CODE DEPENDENCIES

const app = express();
app.use(cors());
setupController(app);

//SETS A LISTEN HOST AND PORT FOR THE API
app.listen(process.env.PORT || 5000);
