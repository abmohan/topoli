var _                 = require('lodash');
var async             = require('async');
var datamap           = require('./datamap');
var excelParser       = require('excel-parser');
var mongoose          = require('mongoose');
var shapefile         = require('shapefile');
var TorontoPollResult = require('../../../models/TorontoPollResult.js');


function loadMayoralResults(year, callback) {

  var supportedYears = _.pluck(datamap, 'year');

  if (supportedYears.indexOf(year) < 0) {
    return callback(new Error("No data for year '" + year + "'."));
  }

  var filename = _.findWhere(
    _.findWhere(datamap, {year: year}).offices,
    {name: 'MAYOR'}
  ).results;

  // read worksheets
  excelParser.worksheets({inFile: filename}, function saveWorksheets(err, worksheets) {

    if (err) {
      console.error("Error opening workbook", err);
      return callback(err);
    }

    // async.each(worksheets, function saveWorksheet(worksheet, cb) {

      excelParser.parse(
        {
          inFile: filename,
          worksheet: worksheet.id
        },
        function getParsedWorksheet(err, rows) {

          if (err) {
            console.log("Error parsing worksheet", err);
            return cb(err);
          }

          // extract ward number
          // console.log(rows);
          // var wardNum = parseInt(rows[0][0].slice(rows[0][0].lastIndexOf(':') + 1), 10);

          // save header row
          // var headerRow = rows[1];

          // loop through all rows, ignoring first two and last
          // console.log(rows.slice(2, -1));

        }
      );

    // }
    // ,
    //   function saveWorksheetsComplete(err) {
    //     if (err) {
    //       console.log('A worksheet failed to process');
    //       return;
    //     }
    //     console.log("All worksheets loaded successfully");
    //     return;
    //   });

  // });

  callback();

}


function loadTorontoPollResults() {

  var mongoURI = process.env.MONGOLAB_URI || "mongodb://localhost/topoli";
  console.log("Connecting to MongoDB", mongoURI);
  mongoose.connect(mongoURI);

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function callback() {

    loadMayoralResults(2014);

    console.log("db opened");
    db.close();

  });


}

module.exports = loadMayoralResults;
