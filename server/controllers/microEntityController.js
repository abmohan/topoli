'use strict';

const MicroEntity = require('../models/MicroEntity');
const MacroEntity = require('../models/MacroEntity');


exports.findByJurisdiction = function findByName(req, res, next) {

  var jurisdiction = req.params.jurisdiction.toUpperCase();

  MicroEntity.find({ 'properties.jurisdiction':  jurisdiction })
  .exec()
  .then(function (results) {
    res.send(results);
  });

};
