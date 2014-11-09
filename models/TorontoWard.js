var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var torontoWardSchema = new mongoose.Schema({

  type: String,

  properties: {
    // TODO: implement communityCouncil: String,

    year: Number, // the election year in which the shapefile was published
    geoId: { type: Number, unique: true }, // a city of Toronto identifier
    name: String, // ward name (English)
    number: Number, // municipal ward number
    longCodeName: String // ward number and community council area it is in (N, S, E or W)
  },

  loc: {type: Object, index: '2dsphere'}  // polygon geocordinates

});

// TODO: Add virtual to reference polls in ward
module.exports = mongoose.model('TorontoWards', torontoWardSchema);
