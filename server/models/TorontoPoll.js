var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var torontoPollSchema = new mongoose.Schema({

  type: String,

  properties: {

    year: Number, // election year to which shapefile corresponds to
    areaId: { type: Number, unique: true }, // a city of Toronto identifier
    number: Number, // voting subdivision (i.e. poll) number
    wardNum: Number,  // municipal ward number
    longCode: String, // concatenation of ward number with poll number (city of Toronto field)
    systemObjectID: { type: Number, unique: true } // a city of Toronto identifier
  },

  geometry: {type: Object, index: '2dsphere'}  // polygon geocordinates

});

module.exports = mongoose.model('TorontoPolls', torontoPollSchema);
