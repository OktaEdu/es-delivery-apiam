//BEGIN: IMPORT CODE DEPENDENCIES
var url = require('url');
var restify = require('restify');
var loki = require('lokijs');
var bunyan = require('bunyan');
//END: IMPORT CODE DEPENDENCIES

//BEGIN: INITIATES LOGGER AND RESTIFY SERVER
var log = new bunyan.createLogger({name: 'ice-resource-server'});
var server = restify.createServer({
  log: log,
  serializers: restify.bunyan.serializers
});
//END: INITIATES LOGGER AND RESTIFY SERVER

//BEGIN: ENABLE RESTIFY FEATURES: REQUEST LOGGER, BODY PARSING, AND CORS
server.use(restify.requestLogger());
server.use(restify.bodyParser());
server.use(restify.CORS());
restify.CORS.ALLOW_HEADERS.push("authorization");
restify.CORS.ALLOW_HEADERS.push("withcredentials");
restify.CORS.ALLOW_HEADERS.push("x-requested-with");
restify.CORS.ALLOW_HEADERS.push("x-forwarded-for");
restify.CORS.ALLOW_HEADERS.push("x-customheader");
restify.CORS.ALLOW_HEADERS.push("user-agent");
restify.CORS.ALLOW_HEADERS.push("keep-alive");
restify.CORS.ALLOW_HEADERS.push("host");
restify.CORS.ALLOW_HEADERS.push("accept");
restify.CORS.ALLOW_HEADERS.push("connection");
restify.CORS.ALLOW_HEADERS.push("content-type");
//END: ENABLE RESTIFY FEATURES: REQUEST LOGGER, BODY PARSING, AND CORS

//BEGIN: STARTS IN-MEMORY DB (LOKIJS) AND SEED DATA
var db = new loki('ice');
var promos = db.addCollection('promos', {unique: 'code'});
var validity = 30;
var endPromo = new Date();
endPromo.setDate(endPromo.getDate() + validity);
promos.insert({ code: "10OFFICE", validFor: validity, target: "PUBLIC", endDate: endPromo.toDateString(), description: "Okta Ice is cool. 10% off for everybody" });
promos.insert({ code: "WILLYVANILLY", validFor: validity, target: "PUBLIC", endDate: endPromo.toDateString(), description: "15% off the new Vanilla collection" });
promos.insert({ code: "20PREMIUM", validFor: validity, target: "PREMIUM", endDate: endPromo.toDateString(), description: "Premium Customers get 20% off" });
promos.insert({ code: "NUTS4CHOCO", validFor: validity, target: "PREMIUM", endDate: endPromo.toDateString(), description: "Premium customers get 30% off the Choco Nuts flavor" });
promos.insert({ code: "BOT", validFor: validity, target: "ROBOT", endDate: endPromo.toDateString(), description: "Chatbot gets 30% off" });
//END: STARTS IN-MEMORY DB (LOKIJS) AND SEED DATA

//BEGIN: SECURITY CONFIGURATION

//END: SECURITY CONFIGURATION

//BEGIN: TURNS THE SERVER ON
server.on('after', restify.auditLogger({log: log}));
//BEGIN: TURNS THE SERVER ON

//BEGIN: PROMO API ENDPOINTS
//BEGIN: GET PUBLIC PROMOS (GET http://localhost:5000/publicpromos)
//EVERYBODY CAN ACCESS THIS (NO PROTECTION REQUIRED)
server.get({path: '/publicpromos'},
  function respond(req, res, next) {
    var query = promos.chain().find({'target' : 'PUBLIC'}).data();
    console.log("\n\nPromos: " + query + "\n\n");
    res.send(200, query);

    return next();
  }
);
//END: GET PUBLIC PROMOS (GET http://localhost:5000/publicpromos)

//BEGIN: GET ALL PROMOS (GET http://localhost:5000/promos)
//PROTECTION REQUIRED: ONLY REQUESTS WITH THE OAUTH SCOPE: 'promos:read' CAN ACCESS
server.get({path: '/promos'},
  // passport.authenticate('oauth2-jwt-bearer', { session: false , scopes: ['promos:read'] }),
  function respond(req, res, next) {
    var query = promos.chain().find({}).simplesort('code').data();
    res.send(200, query);

    return next();
  }
);
//END: GET ALL PROMOS (GET http://localhost:5000/promos)

//BEGIN: SEARCH SPECIFIC PROMOS (GET http://localhost:5000/promos/:filter)
//PROTECTION REQUIRED: ONLY REQUESTS WITH THE OAUTH SCOPE: 'promos:read' CAN ACCESS
server.get({path: '/promos/:filter'},
  // passport.authenticate('oauth2-jwt-bearer', { session: false, scopes: ['promos:read'] }),
  function respond(req, res, next) {
    var query = promos.chain().find(
      {
        $or: [
          {'code' : req.params.filter},
          {'target' : req.params.filter}
        ]
      }
    ).data();
    console.log("\n\nPromos: " + query + "\n\n");
    res.send(200, query);
    return next();
  }
);
//END: SEARCH SPECIFIC PROMOS (GET http://localhost:5000/promos/:filter)

//BEGIN: CREATE PROMOS (POST http://localhost:5000/promos)
//PROTECTION REQUIRED: ONLY REQUESTS WITH THE OAUTH SCOPE: 'promos:create' CAN ACCESS
server.post({path: '/promos'},
  // passport.authenticate('oauth2-jwt-bearer', { session: false, scopes: ['promos:create'] }),
  function respond(req, res, next) {
    var promo = req.params;
    promo.created = new Date().toDateString();
    promo.lastUpdated = new Date().toDateString();
    promo.startDate = new Date().toDateString();
    var endTime = new Date();
    var validFor = promo.validFor;
    if(validFor == null) { validFor = 30; }
    promo.endDate = new Date(endTime.setDate(endTime.getDate() + validFor)).toDateString();
    if(promo.target == null) { promo.target = "PUBLIC"; }
    // Save to DB
    var addPromo = promos.insert( promo );
    try {
      res.send(201, promo);
    } catch (err) {
      res.send(400, err);
    }

    return next();
  }
);
//END: CREATE PROMOS (POST http://localhost:5000/promos)

//BEGIN: DELETE PROMOS (DELETE http://localhost:5000/promos)
//PROTECTION REQUIRED: ONLY REQUESTS WITH THE OAUTH SCOPE: 'promos:delete' CAN ACCESS
server.del({path: '/promos/:code'},
  // passport.authenticate('oauth2-jwt-bearer', { session: false, scopes: ['promos:delete'] }),
  function response(req, res, next) {
    var removePromo = promos.find({'code' : req.params.code});
    try {
      promos.remove(removePromo);
      res.send(204);
    } catch (err) {
      res.send(404, err);
    }

    return next();
  }
);
//END: DELETE PROMOS (DELETE http://localhost:5000/promos)

//BEGIN: DELETE ALL PROMOS (DELETE http://localhost:5000/delete)
//PROTECTION REQUIRED: ONLY REQUESTS WITH THE OAUTH SCOPE: 'promos:delete' CAN ACCESS
server.del({path: '/delete'},
  // passport.authenticate('oauth2-jwt-bearer', { session: false, scopes: ['promos:cancel'] }),
  function respond(req, res, next) {
    var removeAll = promos.chain().remove();
    console.log("Removed all entries from database");
    res.send(204, 'No more promos');

    return next();
  }
);
//END: DELETE ALL PROMOS (DELETE http://localhost:5000/delete)
//END: PROMO API ENDPOINTS

//SETS A LISTEN HOST AND PORT FOR THE API
var port = (process.env.PORT || 5000);
server.listen(port, '0.0.0.0', function () {
  log.info('listening: %s', server.url);
});
//SETS A LISTEN HOST AND PORT FOR THE API
