var path = require('path');

var shapefiles = [
  {

    filename: path.resolve(__dirname, './data/toronto/shapefiles/wards/2010/icitw_wgs84.shp'),
    metadata: {
      jurisdiction: "Toronto",
      type: "Ward",
      year: 2014
    },
    datamap: {
      wardName: "NAME",         // ward name with corresponding ward number
      wardNumber: "SCODE_NAME", // Ward Number
      wardCode: "LCODE_NAME",   // Ward Number and the community council area
      torontoGeoID: "GEO_ID",   // unique geographic identifier
      torontoEntityDesc: "TYPE_DESC",  // 'Ward'
      torontoEntityType: "TYPE_CODE"   // 'City Ward'
    }
  },
  {
    filename: path.resolve(__dirname, './data/toronto/shapefiles/polls/2014/VOTING_SUBDIVISION_2014_WGS84.shp'),
    metadata: {
      jurisdiction: "Toronto",
      type: "Poll",
      year: 2014
    },
    datamap: {
      pollNumber: "AREA_SHORT", // Voting subdivision ID
      pollWardNumber: "AREA_LONG", // Municipal Ward number with voting subdivision ID
      pollName: "AREA_NAME", // Voting subdivision name

      torontoAreaID: "AREA_ID", // Unique area identifier
      torontoObjectID: "OBJECTID" // System generated unique ID
    }
  },
  {
    filename: path.resolve(__dirname, './data/toronto/shapefiles/polling_stations/2014/VOTING_LOCATION_2014_WGS84.shp'),
    metadata: {
      jurisdiction: "Toronto",
      type: "Polling station",
      year: 2014
    },
    datamap: {
      pointName: "POINT_NAME", // Voting location name
      pointCode: "PT_SHRT_CD", // Voting location ID
      pointCodeLong: "PT_LNG_CD", // Municipal Ward number with voting location ID
      address: "ADD_FULL", // Full street address

      featureCode: "FEAT_CD", // Feature code (S,P)
      featureCodeDesc: "FEAT_C_DSC", // Feature Code Description (Primary,Secondary)

      voterCount: "VOTER_CNT", // Voter count per voting location

      torontoPointID: "POINT_ID", // Unique location identifier
      torontoObjectID: "OBJECTID" // System generated number
    }
  }
];

module.exports = {
  shapefiles: shapefiles
};
