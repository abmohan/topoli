'use strict';

const express = require('express');
const path = require('path');
// const apiRoutes = require('./apiRouter');

module.exports = function topoliRouter(app) {

  // app.use('/api', apiRoutes);
  app.use(express.static(path.resolve(__dirname, '../client')));

  app.get('*', function (req, res, next) {

    res.sendFile('index.html');

  });


};
