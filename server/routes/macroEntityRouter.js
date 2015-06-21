'use strict';

const router = require('express').Router();

router.get('/', function (req, res) {
  return res.send("Microentity API");
});

module.exports = router;
