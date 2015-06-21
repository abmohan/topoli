'use strict';

const router            = require('express').Router;

// const macroEntityRouter = require('./macroEntityRouter');
// const microEntityRouter = require('./microEntityRouter');


module.exports = function apiRouter(app) {

  // app.use('/macroentities/', macroEntityRouter);
  // app.use('/microentities/', microEntityRouter);

  app.get('/', function (req, res, next) {
    res.send("API Working");
  })

};
