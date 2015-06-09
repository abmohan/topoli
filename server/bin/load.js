const bluebird                = require('bluebird');
const shapefile               = bluebird.promisifyAll(require('shapefile'));

const toronto2014Results      = require('./toronto2014Results');
const toronto2014Shapefiles   = require('./toronto2014Shapefiles');
const dbUrl                   = require('../config/db').url;

const util                    = require('util');


function getElectionResults() {
  return toronto2014Results.getAll();
}

function getShapefiles() {
  return toronto2014Shapefiles.getAll();
}

function insertResultsIntoShapefiles(shapefiles, results) {
  console.log(util.inspect(results, {showHidden: false, depth: 4}));
  // console.log(shapefiles);
  //
  // return bluebird.map(shapefiles, function (shapefile) {
  //
  //   console.log(shapefile.properties);
  //
  //   var wardNum = shapefile.properties.wardNum;
  //   var pollNum = shapefile.properties.pollNum;
  //   var key = `w${wardNum}p${pollNum}`;
  //
  //   shapefile.properties.results.push(results[key]);
  //
  //   return shapefile;
  //
  // });

}


bluebird.join(
  toronto2014Shapefiles.getAll(),
  getElectionResults(),
  insertResultsIntoShapefiles
)
// .then(function (results) {
//   console.log(util.inspect(results, {showHidden: false, depth: 4}));
// });
//   .then(function (results) {

//   });
//
//
// .then(function (results) {
//   console.log(util.inspect(results, {showHidden: false, depth: null}));
// });
