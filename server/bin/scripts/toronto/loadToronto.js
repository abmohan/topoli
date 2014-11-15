var _                 = require('lodash');
var datamap           = require('./datamap');
var loadTorontoWards  = require('./loadTorontoWards');

function loadToronto(year, cb) {

  var torontoElectionData = datamap;

  // ensure year is an integer (and not a string)
  year = parseInt(year, 10);

  var dataToLoad = _.findWhere(torontoElectionData, {year: year});
  if (!dataToLoad) {
    throw new Error("No data exists for the year " + year);
  }

  console.log("Loading data for Toronto", year);
  loadTorontoWards(dataToLoad.wardShapefile, year, cb);

}

module.exports = loadToronto;
