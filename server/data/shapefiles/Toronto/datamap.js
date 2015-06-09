const path = require('path');


var datamap = [
  {
    year: 2014,
    jurisdiction: 'Toronto',
    entity: 'polling_station',
    filename: path.join(__dirname,
      './polling_stations/2014/VOTING_LOCATION_2014_WGS84.shp'),
    propertyMap: {
      electionDate: function () {
        return '2014-10-27';
      },
      pollNumber: function (rawFeature) { // poll number, parsed to integer
        return parseInt(rawFeature['PT_SHRT_CD']);
      },
      pollName: 'POINT_NAME', // Voting location name
      pollAddress: 'ADD_FULL', // street address

      pollType: 'FEAT_CD', // P or S (primary or secondary)

      pollLongCode: 'PT_LNG_CD',

      wardNum: function (rawFeature) {  // first two digits of long code
        return parseInt(rawFeature['PT_LNG_CD'].slice(0, 2));
      },

      results: function () {
        return [];
      }
    }
  },

  {
    year: 2010,
    jurisdiction: 'Toronto',
    entity: 'city_ward',
    filename: path.join(__dirname,
      './city_wards/2010/icitw_wgs84.shp'),
    propertyMap: {
      number: 'SCODE_NAME', // Ward Number
      name: 'NAME', // Name of the Ward with corresponding ward number

      featureCode: 'LCODE_NAME', // Ward Number + community council (N,S, E, W)

      torontoGeoID: 'GEO_ID', // unique geographic identifier
      torontoTypeDesc: 'TYPE_DESC', // Ward
      torontoTypeCode: 'TYPE_CODE' // City Ward
    }

  }

];


module.exports = datamap;
