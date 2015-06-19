const path      = require('path');
const constants = require('../../../config/constants');

function getTitleCase(text) {
  return text
    .toLowerCase()
    .split(' ')
    .map(function (text) {
      return text[0].toUpperCase() + text.substring(1);
    })
    .join(" ");
}

const datamap = [
  {
    year: 2014,
    jurisdiction: constants.JURISDICTIONS.TORONTO,
    entity: constants.GEO_ENTITIES.TORONTO.VOTING_LOCATION,
    entityType: constants.GEO_ENTITY_TYPES.MICRO,
    filename: path.join(__dirname,
      './voting_locations/2014/VOTING_LOCATION_2014_WGS84.shp'),
    propertyMap: {
      electionDate: function () {
        return '2014-10-27';
      },

      jurisdiction: function () {
        return constants.JURISDICTIONS.TORONTO;
      },

      entity: function () {
        return constants.GEO_ENTITIES.TORONTO.VOTING_LOCATION;
      },

      pollName: 'POINT_NAME', // Voting location name
      pollNum: function (rawFeature) { // poll number, parsed to integer
        return parseInt(rawFeature['PT_SHRT_CD']);
      },
      pollAddress: 'ADD_FULL', // street address

      pollType: 'FEAT_CD', // P or S (primary or secondary)

      longCode: 'PT_LNG_CD',

      wardNum: function (rawFeature) {  // first two digits of long code
        return parseInt(rawFeature['PT_LNG_CD'].slice(0, 2));
      },

      results: function () {
        return [];
      },

      pollArea: function() {  // will be filled in at runtime
        return undefined;
      }

    }
  },

  {
    year: 2014,
    jurisdiction: constants.JURISDICTIONS.TORONTO,
    entity: constants.GEO_ENTITIES.TORONTO.CITY_POLL,
    entityType: constants.GEO_ENTITY_TYPES.MICRO,
    filename: path.join(__dirname,
      './city_polls/2014/VOTING_SUBDIVISION_2014_WGS84.shp'),
    propertyMap: {
      electionDate: function () {
        return '2014-10-27';
      },

      pollNum: function (rawFeature) { // Poll Number
          return parseInt(rawFeature['AREA_SHORT']);
      },
      pollName: 'AREA_NAME', // Name of the poll

      wardNum: function (rawFeature) { // the ward number
        return parseInt(rawFeature['AREA_LONG'].slice(0,2));
      },

      torontoAreaID: 'AREA_ID' // City of Toronto unique geographic identifier
    }
  },

  {
    year: 2006,
    jurisdiction: constants.JURISDICTIONS.TORONTO,
    entity: constants.GEO_ENTITIES.TORONTO.CITY_WARD,
    entityType: constants.GEO_ENTITY_TYPES.MACRO,
    filename: path.join(__dirname,
      './city_wards/2006/icitw_wgs84.shp'),
    propertyMap: {

      year: function () {
        return 2006;
      },

      jurisdiction: function () {
        return constants.JURISDICTIONS.TORONTO;
      },

      entity: function () {
        return constants.GEO_ENTITIES.TORONTO.CITY_WARD;
      },

      wardNum: 'SCODE_NAME', // Ward Number
      name: 'NAME', // Name of the Ward with corresponding ward number

      longCode: 'LCODE_NAME', // Ward Number + community council (N,S, E, W)

      torontoGeoID: 'GEO_ID', // unique geographic identifier
      torontoTypeDesc: 'TYPE_DESC', // Ward
      torontoTypeCode: 'TYPE_CODE' // City Ward
    }

  },

  {
    year: 2006,
    jurisdiction: constants.JURISDICTIONS.TORONTO,
    entity: constants.GEO_ENTITIES.TORONTO.NEIGHBOURHOOD,
    entityType: constants.GEO_ENTITY_TYPES.MACRO,
    filename: path.join(__dirname,
      './neighbourhoods/2006/NEIGHBORHOODS_WGS84.shp'),
    propertyMap: {

      year: function () {
        return 2006;
      },

      jurisdiction: function () {
        return constants.JURISDICTIONS.TORONTO;
      },

      entity: function () {
        return constants.GEO_ENTITIES.TORONTO.NEIGHBOURHOOD;
      },

      name: function (rawFeature) { // neighbourhood name

        const rawName = rawFeature['AREA_NAME']

        // filter out the parenthesised numbers at end of neighourhood name
        const trailingParenthesesRegex = /^.*?(?=\s\()/;
        const matches = rawName.match(/^.*?(?=\s\()/);

        // return the match if it exists. otherwise return the raw name
        return matches ? matches[0] : rawName;
      },

      longName: 'AREA_NAME', // full neighourhood name (including parentheses)

      number: function (rawFeature) { // area short code
        return parseInt(rawFeature['AREA_S_CD']);
      }
    }

  },

  {
    year: 2006,
    jurisdiction: constants.JURISDICTIONS.TORONTO,
    entity: constants.GEO_ENTITIES.TORONTO.FORMER_MUNICIPALITY,
    entityType: constants.GEO_ENTITY_TYPES.MACRO,
    filename: path.join(__dirname,
      './former_municipalities/2006/citygcs_former_municipality_wgs84.shp'),
    propertyMap: {

      year: function () {
        return 2006;
      },

      jurisdiction: function () {
        return constants.JURISDICTIONS.TORONTO;
      },

      entity: function () {
        return constants.GEO_ENTITIES.TORONTO.FORMER_MUNICIPALITY;
      },

      name: function(rawFeature) { // entity's name, converted to title case
        return getTitleCase(rawFeature['AREA_NAME']);
      },

      torontoAreaID: 'AREA_ID' // internal city of Toronto area ID

    }

  }

];


module.exports = datamap;
