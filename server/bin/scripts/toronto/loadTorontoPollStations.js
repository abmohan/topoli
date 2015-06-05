var _                         = require('lodash');
var async                     = require('async');
var datamap                   = require('./datamap');
var mongoose                  = require('mongoose');
var shapefile                 = require('shapefile');
var torontoPollStationSchema  = require('../../../models/TorontoPollStation.js').schema;

/**
 * Given a property matching and a GeoJSON feature, creates a
 * JSON object that can be used to populate a mongoose model and
 * saved that mongoose model to the database
*/
var saveFeature = async.compose(

  function parseFeature(propertyMapping, feature, callback) {

    var parsedFeature = {};

    async.each(

      _.keys(propertyMapping),

      function (propertyKey, keyCB) {

        var propertyValue = propertyMapping[propertyKey];
        parsedFeature[propertyKey] = _.isFunction(propertyValue) ? propertyValue(feature) : feature.properties[propertyValue];

        console.log(propertyKey, propertyValue, parsedFeature);

        return keyCB();
      },

      function (err) {
        if (err) {
          console.error("Error parsing shapefile feature", err);
          return callback(err);
        }

        return callback(null, parsedFeature);

      }
    );

  }
);

var saveShapefile = async.compose(

  function saveFeatures(model, propertyMapping, features, callback) {

    async.each(features, function (feature, featureCB) {
      console.log(feature.properties);

      saveFeature(propertyMapping, feature, function (err, savedFeature) {
        if (err) {
          console.error("Error saving feature", err);
          return callback(err);
        }
        return featureCB(null, savedFeature);
      });
    }, function (err) {
      if (err) {
        console.error("Error parsing shapefile features", err);
        return callback(err);
      }
      return callback();
    });

  },
  function openShapefile(filename, model, propertyMapping, callback) {

    shapefile.read(filename, function (err, collection) {

      if (err) {
        console.error("Error reading shapefile:", err);
        return callback(err);
      }
      return callback(null, model, propertyMapping, collection.features.slice(0,2));

    });

  }

);




function loadTorontoPollStations(electionDate, callback) {

  // mapping between shapefile property names and mongoose model field names
  var propertyMapping = {

    electionDate: function() {
      return Date.parse("2014-10-27");
    },

    name: "POINT_NAME",
    address: "ADD_FULL",

    featureCode: "FEAT_CD",
    featureCodeDescription: "FEAT_C_DSC",

    wardNum: function (feature) {
      return feature.properties.PT_LNG_CD.slice(0, 2);
    },
    pollNum: "PT_SHRT_CD",

    voterCount: "VOTER_CNT",

    cityPointID: "POINT_ID",
    cityObjectID: "OBJECTID"
  };

  var electionDates = _.pluck(datamap.elections, 'electionDate');

  if (electionDates.indexOf(electionDate) < 0) {
    return callback(new Error("No data for electionDate '" + electionDate + "'."));
  }

  var filename = _.findWhere(datamap.elections, {electionDate: electionDate}).pollStations.shapefilePath;

  console.log("Loading Toronto polls", electionDate, filename);

  var mongoURI = process.env.MONGOLAB_URI || "mongodb://localhost/topoli";
  console.log("Connecting to MongoDB", mongoURI);
  var db = mongoose.createConnection(mongoURI);

  var TorontoPollStation = db.model('TorontoPollStation', torontoPollStationSchema);

  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function (err) {

    if (err) {
      console.error(err);
      return callback(err);
    }

    console.log("Loading shapefile:", filename);
    saveShapefile(filename, TorontoPollStation, propertyMapping, function (err) {
      if (err) {
        console.error(err);
        return callback(err);
      }
      console.log("Finished loading");
      db.close();
      return callback();
    });



  });

}

loadTorontoPollStations("2014-10-27 EST", function (err) {
  console.log(err || "returning...");
  return;
});

module.exports = loadTorontoPollStations;
