var _           = require('lodash');
var async       = require('async');
var datamap     = require('./datamap');
var mongoose    = require('mongoose');
var shapefile   = require('shapefile');

function loadTorontoPollSubdivisions(electionDate, callback) {

  var electionDates = _.pluck(datamap.elections, 'electionDate');

  if (electionDates.indexOf(electionDate) < 0) {
    return callback(new Error("No data for electionDate '" + electionDate + "'."));
  }

  var filename = _.findWhere(datamap.elections, {electionDate: electionDate}).polls.shapefilePath;

  console.log("Loading Toronto polls", electionDate, filename);

  var mongoURI = process.env.MONGOLAB_URI || "mongodb://localhost/topoli";
  console.log("Connecting to MongoDB", mongoURI);
  var db = mongoose.createConnection(mongoURI);

  var torontoPollSubdivisionSchema = require('../../../models/TorontoPollSubdivision.js').schema;
  var TorontoPollSubdivision = db.model('TorontoPollSubdivision', torontoPollSubdivisionSchema);

  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function (err) {

    if (err) {
      console.error(err);
      return callback(err);
    }

    // mapping between shapefile property names and mongoose model field names
    var propertyMapping = {
      // pollName: "AREA_LONG",
      areaId: "AREA_ID",
      pollNum: "AREA_SHORT",
      systemObjectId: "OBJECTID"
    };

    console.log("Loading shapefile:", filename);

    var reader = shapefile.reader(filename);
    reader.readHeader(function processHeader(err) {
      // display error and quit if header reading was unsuccessful
      if (err) {
        console.error("Error reading shapefile header", err);
        reader.end();
        db.close();
        return;
      }

      var feature = null;
      async.doUntil(
        function processFeature(cb) {
          reader.readRecord(function (err, data) {
            // update feature
            feature = data;

            // display error and quit if header reading was unsuccessful
            if (err) {

              console.error("Error reading shapefile record", err, data);
              reader.close();
              db.close();
              return cb(err);

            }

            if (data !== shapefile.end) {

              // parse shapefile properties
              var shapefileData = {
                electionDate: Date.parse(electionDate),
                type: data.type,
                properties: {
                  electionDate: electionDate,
                  wardNum: data.properties.AREA_LONG.slice(0, 2)
                },
                geometry: data.geometry
              };

              _.keys(propertyMapping).forEach(function (key) {
                shapefileData.properties[key] = data.properties[propertyMapping[key]];
              });

              // save shapefile
              TorontoPollSubdivision.create(shapefileData, function (err, createdRecord) {
                if (err) {

                  // ignore duplicate key errors
                  if (err.code === 11000) {
                    console.log("Record already exists for election", electionDate,
                      "ward", data.properties.AREA_LONG.slice(0, 2), "poll",  data.properties.AREA_LONG.slice(3));
                    return cb();
                  }

                  console.log("Error saving shapefile to database", err);
                  return cb(err);
                }

                console.log("Created poll for election", createdRecord.electionDate,
                  "ward", createdRecord.properties.wardNum, "poll", createdRecord.properties.pollNum);
                return cb();

              });

            } else {
              // if we're at the end, close file and db and quit
              console.log("\nFinished loading polls shapefile");
              return cb();
            }

          });

        },

        function checkShapefileEnd() {
          return feature === shapefile.end;
        },

        function postShapefileLoad() {
          console.log("Toronto poll import complete");
          reader.close();
          console.log("Reader closed");
          db.close();
          console.log("DB closed");
          return callback();
        }

      );


    });


  });

}

module.exports = loadTorontoPollSubdivisions;
