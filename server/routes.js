// import models
var path           = require('path');
var TorontoWard    = require('./models/TorontoWard');

module.exports = function (app) {

  // server routes ===========================================================
  // handle things like api calls
  // authentication routes

  // api routes
  app.get('/api', function (req, res) {
    console.log("Request received at '/api'", req.headers);
    res.send("topoli API running.");
  });

  app.get('/api/toronto/wards', function (req, res) {

    console.log("Request received at '/api/toronto/wards'", req.headers);

    // use mongoose to get all wards in the database
    TorontoWard.find({}, function (err, wards) {
      console.log(err, wards);

      // if there is an error retrieving, send the error.
      if (err) {
        console.error(err);
        res.send(err);
      }

      return res.json({ type: "FeatureCollection", features: wards }); // return all wards in JSON format
    });
    console.log("OK");
  });

  // route to handle creating goes here (app.post)
  // route to handle delete goes here (app.delete)

  // frontend routes =========================================================
  // route to handle all angular requests
  app.get('*', function (req, res) {
    console.log("Catch all request received", req.headers);
    res.sendFile(path.resolve(__dirname, '../public/views/index.html')); // load our public/index.html file
  });

};
