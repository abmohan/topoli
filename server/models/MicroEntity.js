const bluebird = require('bluebird');
const mongoose = bluebird.promisifyAll(require('mongoose'));


var MicroEntity = mongoose.model('MicroEntity', {
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


bluebird.promisifyAll(MicroEntity);
bluebird.promisifyAll(MicroEntity.prototype);

module.exports = MicroEntity;
