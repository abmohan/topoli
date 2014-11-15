var TorontoPoll = require('../../../models/TorontoPoll.js');

function loadTorontoPolls() {

  // mapping between shapefile property names and mongoose model field names
  var propertyMapping = {
    areaId : "AREA_ID",
    number : "AREA_SHORT",
    longCode : "AREA_LONG",
    systemObjectId : "OBJECTID"
  };

  // Object.defineProperties(propertyMapping, {
  //   ward: {
  //     get: 
  //   }
  // });

}

module.exports = loadTorontoPolls;
