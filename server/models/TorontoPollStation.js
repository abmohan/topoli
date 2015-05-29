var _ = require('lodash');
var mongoose = require('mongoose');
var TorontoPollResult = require('./TorontoPollResult.js');

var schemaOptions = {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
};

var torontoPollStationSchema = new mongoose.Schema({

  type: {
    type: String,
    required: true,
    default: "Feature"
  },

  properties: {

    electionDate: { type: Date, required: true }, // election year to which shapefile corresponds to

    // poll station information (not applicable to advanced polls)
    name: String, // name of voting location
    address: String, // street address

    /* Feature code descriptions:
     'P'/'PRIMARY': a regular poll. has a corresponding area shapefile
     'S'/'SECONDARY': a self-contained voting station. does not have a corresponding area shapefile
     'A'/'ADVANCED': an advanced poll
     */
    featureCode: {
      type: String,
      required: true,
      uppercase: true,
      enum: ['P', 'S', 'A']
    },
    featureCodeDescription: {
      type: String,
      required: true,
      uppercase: true,
      enum: ['PRIMARY', 'SECONDARY', 'ADVANCED']
    },

    // macro location information
    pollNum: Number, // voting subdivision (i.e. poll) number
    wardNum: Number,  // municipal ward number

    // voter statistics (not applicable to advanced polls)
    voterCount: Number,

    // city of Toronto identifiers (not applicable to advanced polls)
    cityPointID: Number, // unique location identifier
    cityObjectID: Number, // a city of Toronto identifier

    results: [TorontoPollResult.schema]
  },

  // geopoint coordinates (not applicable to advanced polls)
  geometry: {type: Object, index: '2dsphere'}

}, schemaOptions);

// add virtual fields
torontoPollStationSchema.virtual('properties.isAdvancedPoll').get(function () {
  return this.properties.pollNum >= 90 && this.properties.pollNum <= 99;
});


// find/create poll and append poll result(s)
torontoPollStationSchema.statics.addResult = function (pollResultData, callback) {

  var query = {
    'properties.electionDate': pollResultData.electionDate,
    'properties.pollNum': pollResultData.pollNum,
    'properties.wardNum': pollResultData.wardNum
  };

  this.find(query, function (err, pollStation) {

    if (err) { return callback(err); }

    if (!pollStation) {
      return callback(new Error("The following poll is not in the database" + query));
    }

    pollStation.properties.results = _.union(pollStation.properties.results, [pollResultData]);

    pollStation.save(function (err) {
      if (err) { return callback(err); }
      return callback(null, pollStation);
    });

  });

};

// make electionDate, poll and candidate unique
torontoPollStationSchema.index(
  { 'properties.electionDate': 1, 'properties.pollNum': 1, 'properties.wardNum': 1},
  { unique: true }
);

module.exports = mongoose.model('TorontoPollStation', torontoPollStationSchema);
