var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var torontoPollResultSchema = new mongoose.Schema({

  year: { type: Number, required: true },
  number: { type: Number, required: true },
  wardNum: { type: Number, required: true },

  shapefile: ObjectId,

  constituency: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    default: 'TORONTO'
  },

  office: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    enum: ['MAYOR', 'COUNCIL', 'TDSB', 'TCDSB', 'CSV', 'CSDC']
  },

  candidate: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },

  votes: {
    type: Number,
    required: true,
    min: 0
  }

});

// make year, poll and candidate unique
torontoPollResultSchema.index(
  { year: 1, number: 1, candidate: 1 },
  { unique: true }
);

module.exports = mongoose.model('TorontoPollResult', torontoPollResultSchema);
