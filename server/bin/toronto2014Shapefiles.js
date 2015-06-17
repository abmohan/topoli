const bluebird              = require('bluebird');
const shapefile             = bluebird.promisifyAll(require('shapefile'));
const R                     = require('ramda');

const shapefileDatasources  = require('../data/shapefiles/Toronto/datamap');


function getShapefileData(datasource) {

  return bluebird.resolve(datasource);

}


function applyPropertyMap(propertyMap, properties, mappedFeature, propertyMapKey) {

  var propertyMapValue = propertyMap[propertyMapKey];

  if (typeof propertyMapValue === 'function') {
    mappedFeature[propertyMapKey] = propertyMapValue.call(this, properties);
  }
  else {
    mappedFeature[propertyMapKey] = properties[propertyMapValue];
  }

  return mappedFeature;

}

function parseFeatureCollection(propertyMap, features) {

  return bluebird.map(features, function (feature) {

    return R.merge(feature, {
      properties: R.reduce(
        R.partial(applyPropertyMap, propertyMap, feature.properties),
        {},
        R.keys(propertyMap))
    });

  });

}

function getFeatureCollection(datasource) {

  console.log("Reading", datasource.filename);

  return shapefile.readAsync(datasource.filename)
    .then(function (rawFeatureCollection) {

      return parseFeatureCollection(
        datasource.propertyMap,
        rawFeatureCollection.features
      );

    })
    .then(function (mappedFeatures) {

      return {
        year: datasource.year,
        jurisdiction: datasource.jurisdiction,
        entity: datasource.entity,
        entityType: datasource.entityType,
        features: mappedFeatures
      };

    });
}

function getAll() {

  return getShapefileData(shapefileDatasources)
    .map(getFeatureCollection);

}


module.exports = {
  getAll: getAll
};
