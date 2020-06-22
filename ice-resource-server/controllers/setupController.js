var loki = require('lokijs');
var db = new loki('ice');
//const security = require('./securityUtils');

module.exports= function (app){
  //BEGIN: STARTS IN-MEMORY DB (LOKIJS) AND SEED DATA
    var promos = db.addCollection('promos', {unique: 'code'});
    var validity = 30;
    var endPromo = new Date();
    endPromo.setDate(endPromo.getDate() + validity);
    promos.insert({ code: "10OFFICE", validFor: validity, target: "PUBLIC", endDate: endPromo.toDateString(), description: "Okta Ice is cool. 10% off for everybody" });
    promos.insert({ code: "WILLYVANILLY", validFor: validity, target: "PUBLIC", endDate: endPromo.toDateString(), description: "15% off the new Vanilla collection" });
    promos.insert({ code: "20PREMIUM", validFor: validity, target: "PREMIUM", endDate: endPromo.toDateString(), description: "Premium Customers get 20% off" });
    promos.insert({ code: "NUTS4CHOCO", validFor: validity, target: "PREMIUM", endDate: endPromo.toDateString(), description: "Premium customers get 30% off the Choco Nuts flavor" });
    promos.insert({ code: "BOT", validFor: validity, target: "ROBOT", endDate: endPromo.toDateString(), description: "Chatbot gets 30% off" });
    console.log("Database Initiated");
  //END: STARTS IN-MEMORY DB (LOKIJS) AND SEED DATA

  //BEGIN: PROMO API ENDPOINTS
  //BEGIN: GET PUBLIC PROMOS (GET http://localhost:5000/publicpromos)
  //EVERYBODY CAN ACCESS THIS (NO PROTECTION REQUIRED)
  app.get('/publicpromos',
  function (req, res, next) {
    var query = promos.chain().find({'target' : 'PUBLIC'}).data();
    console.log("Promos: " + JSON.stringify(query));
    res.status(200).send(query);
    return next();
  });
  //END: GET PUBLIC PROMOS (GET http://localhost:5000/publicpromos)

  //BEGIN: GET ALL PROMOS (GET http://localhost:5000/promos)
  //PROTECTION REQUIRED: ONLY REQUESTS WITH THE OAUTH SCOPE: 'promos:read' CAN ACCESS
  app.get('/promos',
    // function (req, res, next) {
    //   security.validationRequired(req, res, next, ['promos:read']);
    // },
    function (req, res, next) {
      var query = promos.chain().find({}).simplesort('code').data();
      console.log("Promos: " + JSON.stringify(query));
      res.status(200).send(query);
      return next();
    });
  //END: GET ALL PROMOS (GET http://localhost:5000/promos)

  //BEGIN: SEARCH SPECIFIC PROMOS (GET http://localhost:5000/promos/:filter)
  //PROTECTION REQUIRED: ONLY REQUESTS WITH THE OAUTH SCOPE: 'promos:read' CAN ACCESS
  app.get('/promos/:filter',
    // function (req, res, next) {
    //   security.validationRequired(req, res, next, ['promos:read']);
    // },
    function (req, res, next) {
      var query = promos.chain().find(
        {
          $or: [
            {'code' : req.params.filter},
            {'target' : req.params.filter}
          ]
        }
      ).data();
      console.log("Promos: " + JSON.stringify(query));
      res.status(200).send(query);
      return next();
    }
  );
  //END: SEARCH SPECIFIC PROMOS (GET http://localhost:5000/promos/:filter)

  //BEGIN: CREATE PROMOS (POST http://localhost:5000/promos)
  //PROTECTION REQUIRED: ONLY REQUESTS WITH THE OAUTH SCOPE: 'promos:create' CAN ACCESS
  app.post('/promos',
    // function (req, res, next) {
    //   security.validationRequired(req, res, next, ['promos:create']);
    // },
    function (req, res, next) {
      var promo = req.body;
      console.log(promo);
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
        res.status(201).send(promo);
      } catch (err) {
        res.status(400).send(err);
      }
      return next();
    }
  );
  //END: CREATE PROMOS (POST http://localhost:5000/promos)

  //BEGIN: DELETE PROMOS (DELETE http://localhost:5000/promos)
  //PROTECTION REQUIRED: ONLY REQUESTS WITH THE OAUTH SCOPE: 'promos:delete' CAN ACCESS
  app.delete('/promos/:filter',
    // function (req, res, next) {
    //   security.validationRequired(req, res, next, ['promos:delete']);
    // },
    function (req, res, next) {
      var query = promos.chain().find(
        {
          $or: [
            {'code' : req.params.filter},
            {'target' : req.params.filter}
          ]
        }
      ).data();
      console.log("Promos: " + JSON.stringify(query));
       try {
        promos.remove(query);
        res.status(204).send('SUCCESS');
      } catch (err) {
        res.status(400).send(err);
      }
      return next();
    }
  );

  //END: DELETE PROMOS (DELETE http://localhost:5000/promos)

  //BEGIN: DELETE ALL PROMOS (DELETE http://localhost:5000/delete)
  //PROTECTION REQUIRED: ONLY REQUESTS WITH THE OAUTH SCOPE: 'promos:delete' CAN ACCESS
  app.delete('/delete',
  // function (req, res, next) {
  //   security.validationRequired(req, res, next, ['promos:delete']);
  // },
    function (req, res, next) {
      var removeAll = promos.chain().remove();
      console.log("Removed all entries from database");
     res.status(204).send('No more promos');
      return next();
    }
  );
  //END: DELETE ALL PROMOS (DELETE http://localhost:5000/delete)
  //END: PROMO API ENDPOINTS
}
