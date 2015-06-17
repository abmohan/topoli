const bluebird                = require('bluebird');
const mongoose                = bluebird.promisifyAll(require('mongoose'));
const R                       = require('ramda');
const shapefile               = bluebird.promisifyAll(require('shapefile'));

const MicroEntity             = require('../models/MicroEntity');
// const MacroEntity             = require('../models/MacroEntity');

const toronto2014Results      = require('./toronto2014Results');
const toronto2014Shapefiles   = require('./toronto2014Shapefiles');
const dbUrl                   = require('../config/db').url;
const constants               = require('../config/constants');

const util                    = require('util');


bluebird.join(
  getShapefiles(),
  getElectionResults(),
  processShapefiles
);

function getShapefiles() {
  return toronto2014Shapefiles.getAll();
}

function getElectionResults() {

  return toronto2014Results.getAll()
    .then(mergePollData);

}

function getShapefileType(shapefiles, entity) {
  var votingLocationCriteria = R.propEq('entity', entity);

  return bluebird.resolve(R.find(votingLocationCriteria, shapefiles))
    .then(function (shapefile) {
      return shapefile.features;
    });

}

/*
 * A hash function to generate a unique way of representing a single
 & ward and poll
 *
 */
function getPollKey(pollData) {
  return `w${pollData.wardNum}p${pollData.pollNum}`;
}

/*
 * Merges an array of polling data from different candidates into a hash table
 *
 */
function mergePollData(electionData) {

  return bluebird.reduce(
    electionData,

    function(electionResults, pollData) {
      var pollKey = getPollKey(pollData);

      // append to hashtable array if it exists. otherwise start a new array
      electionResults[pollKey] = R.append(pollData, electionResults[pollKey]);
      return electionResults

    },

    // initialize with an empty object
    {}
  );

}

function processShapefiles(shapefiles, results) {

  return bluebird.join(
    processMicroEntityShapefiles(shapefiles, results),
    processMacroEntityShapefiles(shapefiles),
    performDBupdate
  );

}



function processMicroEntityShapefiles(shapefiles, electionResults) {

  // match results with voting location shapefile
  return bluebird.join(
    getShapefileType(
      shapefiles,
      constants.GEO_ENTITIES.TORONTO.VOTING_LOCATION
    ),
    getShapefileType(
      shapefiles,
      constants.GEO_ENTITIES.TORONTO.CITY_POLL
    )
    .reduce(getCityPollIndex, {}),
    mergePollEntities
  );


  // ---------- Function definitions -----------------

  function getCityPollIndex(cityPollIndex, cityPoll) {
    var pollKey = getPollKey(cityPoll.properties);
    cityPollIndex[pollKey] = cityPoll;

    return cityPollIndex;
  }


  function mergePollEntities(votingLocations, cityPollIndex) {

    return bluebird.map(votingLocations, function(votingLocation) {

      var pollKey = getPollKey(votingLocation.properties);

      votingLocation.properties.results = electionResults[pollKey];
      votingLocation.properties.pollArea = cityPollIndex[pollKey];

      return votingLocation;

    });

  }

}

function processMacroEntityShapefiles(shapefiles) {

  return bluebird.filter(shapefiles, function (shapefile) {
    // extract macro entities only
    return shapefile.entityType == constants.GEO_ENTITY_TYPES.MACRO;
  })
  // get only the features
  .map(function (shapefile) {
    return shapefile.features
  })
  // flatten all features
  .then(R.flatten);

}


function performDBupdate(microEntities, macroEntities) {
  // console.log('microEntities', (util.inspect(microEntities, {showHidden: false, depth: 4})));

  return mongoose.connectAsync(dbUrl)
    .then(function () {
      console.log("Removing existing documents");
      return MicroEntity.removeAsync({})
    })

    .then(function (query) {
      console.log("Documents removed:", query.result);
      console.log("Inserting", microEntities.length,"documents");

      return bluebird.resolve(bluebird.promisifyAll(
        MicroEntity.collection.initializeUnorderedBulkOp()
      ))
      .then(function (bulk) {
        return bluebird.each(microEntities, function (microentity) {
          bulk.insert(microentity);
        })
        .then(function () {
          return bulk.executeAsync();
        });
      });
    })
    .then(function (query) {
      console.log("Insert success!");
      console.log("Closing collection");
      return mongoose.connection.closeAsync();
    });

}
