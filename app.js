
// set up =======================================
var express = require('express');
var mongoose = require('mongoose');
var TorontoWard = require('./models/TorontoWard');

// configuration ================================
// mongo
var uristring = process.env.MONGOLAB_URI || 'mongodb://localhost/topoli';
mongoose.connect(uristring, function (err) {
  if (err) {
    console.log("ERROR connection to", uristring, ":", err);
    return;
  }

  console.log("Succussfully connected to:", uristring);
});

// express
var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));


// routes 
app.get('/', function (req, res) {
  console.log("Request received at '/'", req.headers);
  res.send('Hello World!');
});

app.get('/api', function (req, res) {
  console.log("Request received at '/api'", req.headers);
  res.send("topoli API running.");
});

app.get('/api/wards', function (req, res) {

  console.log("Request received at '/api/wards'", req.headers);

  TorontoWard.find(function (err, wards) {
    if (err) {
      res.send(err);
    }

    res.json(wards);
  });

});

// listen =======================================

app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'));
});
