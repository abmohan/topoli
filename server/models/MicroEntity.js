'use strict';

const bluebird = require('bluebird');
const mongoose = bluebird.promisifyAll(require('mongoose'));
const extend   = bluebird.promisifyAll(require('mongoose-schema-extend'));
const R        = require('ramda');

const ShapefileSchema = require('./ShapefileSchema');

const MicroEntitySchema = ShapefileSchema.extend({});

MicroEntitySchema.statics = R.merge(MicroEntitySchema.statics, {
  getGeoIntersectionsAsync: getGeoIntersectionsAsync
});

function getGeoIntersectionsAsync(macroGeometry) {

  const aggregationQuery = [
    {
      $match: {
        geometry: {
          $geoIntersects: {
            $geometry: macroGeometry
          }
        }
      }
    },
    {
      $project: {
        '_id' : 1,
        'pollName': '$properties.pollName',
        'year': '$properties.year',
        'electionDate': '$properties.electionDate',
        'jurisdiction': '$properties.jurisdiction'
      }
    }
  ];

  return this.aggregateAsync(aggregationQuery);

}

const MicroEntity = mongoose.model('MicroEntity', MicroEntitySchema);


module.exports = MicroEntity;
