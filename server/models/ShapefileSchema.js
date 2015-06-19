'use strict';

const bluebird = require('bluebird');
const mongoose = bluebird.promisifyAll(require('mongoose'));
const R        = require('ramda');


 const ShapefileSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    default: 'Feature'
  },

  properties: {
    type: Object,
    required: true,
    default: {}
  },

  geometry: {
    type: Object,
    index: '2dsphere'
  }

});


ShapefileSchema.statics = R.merge(ShapefileSchema.statics, {
  bulkInsertAsync: bulkInsertAsync
});


function bulkInsertAsync(documents) {

  return bluebird.resolve(bluebird.promisifyAll(
    this.collection.initializeUnorderedBulkOp()
  ))
  .then(function (bulk) {
    return bluebird.each(documents, function (document) {
      bulk.insert(document);
    })
    .then(function () {
      return bulk.executeAsync();
    });
  });

}


module.exports = ShapefileSchema;
