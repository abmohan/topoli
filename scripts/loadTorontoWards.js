var _           = require('lodash');
var mongoose    = require('mongoose');
var shapefile   = require('shapefile-stream');
var through     = require('through2');
var TorontoWard = require('../models/TorontoWard.js');

function loadTorontoWards(filename, year) {

  var mongoURI = process.env.MONGOLAB_URI || "mongodb://localhost/topoli";
  console.log("Connecting to MongoDB", mongoURI);
  mongoose.connect(mongoURI);

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function callback() {

    // mapping between shapefile property names and mongoose model field names
    var propertyMapping = {
      geoId : "GEO_ID",
      name : "NAME",
      number : "SCODE_NAME",
      longCodeName : "LCODE_NAME"
    };

    console.log("Loading shapefile:", filename);
    shapefile.createReadStream(filename)
      .pipe(through.obj(function (data, enc, next) {

        var shapefileData = {
          year: year,
          type: data.type,
          properties: {},
          loc: data.geometry
        };

        _.keys(propertyMapping).forEach(function (key) {
          shapefileData.properties[key] = data.properties[propertyMapping[key]];
        });

        TorontoWard.create(shapefileData, function (err, torontoWard) {
          if (err) {
            console.log("Error saving shapefile", err);
            return err;
          }

          console.log("Created ward", torontoWard.properties.name);
          next();
        });

      })).on('end', function () {

        console.log("\n\nFinished loading all records");
        db.close();

      });

  });

}

module.exports = loadTorontoWards;