'use strict';

const router            = require('express').Router();

const macroEntityRouter = require('./macroEntityRouter');
const microEntityRouter = require('./microEntityRouter');

router.get('/', function (req, res) {
  return res.send("TOpoli API");
});

router.use('/microentities', microEntityRouter);
router.use('/macroentities', microEntityRouter);


module.exports = router;
