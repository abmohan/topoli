var path = require('path');

var datamap = [
  {
    year: 2014,
    constituency: 'Toronto',
    wardShapefile: path.resolve(__dirname, './data/shapefiles/wards_2010_WGS84/icitw_wgs84.shp'),
    pollsShapefile: path.resolve(__dirname, './data/shapefiles/voting_subdivision_2014_wgs84/VOTING_SUBDIVISION_2014_WGS84.shp'),
    offices: [
      {
        name: 'MAYOR',
        results: path.resolve(__dirname, './data/results/2014/MAYOR.xls')
      },
      {
        name: 'COUNCIL',
        results: path.resolve(__dirname, './data/results/2014/COUNCILLOR.xls')
      }
    ]
  }
];

module.exports = datamap;
