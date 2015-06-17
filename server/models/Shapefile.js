const bluebird = require('bluebird');
const mongoose = bluebird.promisifyAll(require('mongoose'));

 var Shapefile = mongoose.model('Shapefile', {
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

bluebird.promisifyAll(Shapefile);
bluebird.promisifyAll(Shapefile.prototype);

module.exports = Shapefile;
