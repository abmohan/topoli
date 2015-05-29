var Promise     = require('bluebird');
var mongoose    = Promise.promisifyAll(require('mongoose'));
var R           = require('ramda');
var shapefile   = Promise.promisifyAll(require('shapefile'));
var TorontoWard = require('../models/TorontoWard.js');


module.exports = function loadTorontoWards(uri, datamap) {

  var deferred = Promise.pending();

  var mongoURI = uri || process.env.MONGOLAB_URI || "mongodb://localhost/topoli";

  console.log("Connecting to MongoDB", mongoURI);
  mongoose.connect(mongoURI);

  var db = mongoose.connection;
  db.on('error', function (err) {
    console.error("Error", err);

    handleConnectionError(err)
    .finally(function () {
      console.log("Closing database connection");
      db.close();
      deferred.reject(err);
    });

  });

  db.once('open', function () {
    loadTorontoWardData()
    .then(function (result) {
      console.log("finished loading ward data", result);
    })
    .finally(function () {
      console.log("Closing database connection");
      db.close();
      deferred.fulfill();
    });
  });

  return deferred;

};

function handleConnectionError(err) {
  return Promise.reject(err);
}

function loadTorontoWardData() {
  return Promise.resolve("OK!");
}



//
//
//   db.once('open', function callback() {
//
//     // mapping between shapefile property names and mongoose model field names
//     var propertyMapping = {
//       geoId : "GEO_ID",
//       name : "NAME",
//       number : "SCODE_NAME",
//       longCodeName : "LCODE_NAME"
//     };
//
//     console.log("Loading shapefile:", filename);
//
//     var reader = shapefile.reader(filename);
//     reader.readHeader(function processHeader(err) {
//       // display error and quit if header reading was unsuccessful
//       if (err) {
//         console.error("Error reading shapefile header", err);
//         reader.end();
//         db.close();
//         return;
//       }
//
//       var feature = null;
//       async.doUntil(
//         function processFeature(callback) {
//           reader.readRecord(function (err, data) {
//             // update feature
//             feature = data;
//
//             // display error and quit if header reading was unsuccessful
//             if (err) {
//
//               console.error("Error reading shapefile record", err, data);
//               reader.close();
//               db.close();
//               return callback(err);
//
//             }
//
//             if (data !== shapefile.end) {
//
//               // parse shapefile properties
//               var shapefileData = {
//                 year: year,
//                 type: data.type,
//                 properties: {},
//                 geometry: data.geometry
//               };
//
//               _.keys(propertyMapping).forEach(function (key) {
//                 shapefileData.properties[key] = data.properties[propertyMapping[key]];
//               });
//
//               // save shapefile
//               TorontoWard.create(shapefileData, function (err, torontoWard) {
//                 if (err) {
//
//                   // ignore duplicate key errors
//                   if (err.code === 11000) {
//                     console.log("Record already exists", data.properties.NAME);
//                     return callback();
//                   }
//
//                   console.log("Error saving shapefile to database", err);
//                   return callback(err);
//                 }
//
//                 console.log("Created ward", torontoWard.properties.name);
//                 return callback();
//
//               });
//
//             } else {
//               // if we're at the end, close file and db and quit
//               console.log("\nFinished loading shapefile");
//               return callback();
//             }
//
//           });
//
//         },
//
//         function checkShapefileEnd() {
//           return feature === shapefile.end;
//         },
//
//         function postShapefileLoad() {
//           reader.close();
//           console.log("Reader closed");
//           db.close();
//           console.log("DB closed");
//           return cb();
//         }
//
//       );
//
//
//     });
//
//     console.log("Toronto ward import complete");
//
//   });
//
