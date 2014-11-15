
// set up =======================================
var bodyParser     = require('body-parser');
var express        = require('express');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');

// configuration ================================
// mongo
var db = require('./server/config/db');
mongoose.connect(db.uristring, function (err) {
  if (err) {
    console.log("ERROR connection to", db.uristring, ":", err);
    return;
  }

  console.log("Succussfully connected to:", db.uristring);
});

// express
var app = express();
app.set('port', (process.env.PORT || 5000));
// app.use(express.static(__dirname + '/public'));

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));


// routes ==================================================
require('./server/routes')(app); // configure our routes


// // routes
// app.get('/', function (req, res) {
//   console.log("Request received at '/'", req.headers);
//   res.sendFile(path.resolve(__dirname, '../client/app/index.html'));
// });

// app.get('/public/app.js', function (req, res) {
//   console.log("Request received at '/'", req.headers);
//   res.sendFile(path.resolve(__dirname, '../client/app/app.js'));
// });


// app.get('/api', function (req, res) {
//   console.log("Request received at '/api'", req.headers);
//   res.send("topoli API running.");
// });

// app.get('/api/wards', function (req, res) {

//   console.log("Request received at '/api/wards'", req.headers);

//   TorontoWard.find(function (err, wards) {
//     if (err) {
//       console.log(err);
//       res.send(err);
//     }
//     res.send({ type: "FeatureCollection", features: wards });
//   });

// });

// listen =======================================

app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'));
});

// expose app
exports = module.exports = app;

