var mongoose = require('mongoose');
var TorontoPollResult = require('./TorontoPollResult.js');


var schemaOptions = {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
};

var torontoPollSubdivisionSchema = new mongoose.Schema({

  type: {
    type: String,
    required: true,
    default: "Feature"
  },

  properties: {

    electionDate: { type: Date, required: true }, // election year to which shapefile corresponds to
    // pollName: { type: String, unique: true }, // concatenation of ward number with poll number (city of Toronto field)
    pollNum: Number, // voting subdivision (i.e. poll) number
    wardNum: Number,  // municipal ward number

    areaId: Number, // a city of Toronto identifier
    systemObjectID: Number, // a city of Toronto identifier

    results: [TorontoPollResult.schema]
  },

  geometry: {type: Object, index: '2dsphere'}  // polygon geocordinates

}, schemaOptions);

// make electionDate, poll and candidate unique
torontoPollSubdivisionSchema.index(
  { 'properties.electionDate': 1, 'properties.pollNum': 1, 'properties.wardNum': 1},
  { unique: true }
);

module.exports = mongoose.model('TorontoPollSubdivision', torontoPollSubdivisionSchema);
