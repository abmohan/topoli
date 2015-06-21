'use strict';

const router      = require('express').Router();
const controller  = require('../controllers/MicroentityController');

// requests to get all microentities should be denied
router.get('/', function (req, res) {

  res.status(400); // bad request
  res.send({error: "Jurisdiction must be provided"});

});

router.get('/:jurisdiction', controller.findByJurisdiction);

module.exports = router;
