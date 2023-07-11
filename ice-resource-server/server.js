//BEGIN: IMPORT CODE DEPENDENCIES
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import setupController from "./controllers/setupController.js";
//END: IMPORT CODE DEPENDENCIES

//APP CONFIGURATION SETUP
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//SETS A LISTEN HOST AND PORT FOR THE API
app.listen(process.env.PORT || 8081);

//START THE APP
setupController(app);

console.log("API running on http://localhost:8081");
