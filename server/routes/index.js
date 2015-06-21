'use strict';

const express   = require('express');
const path      = require('path');
const apiRouter = require('./apiRouter');


module.exports = function topoliRouter(app) {

  const publicDir = app.get('publicDir');
  app.use(express.static(publicDir));

  app.use('/api', apiRouter);
  // app.get('/api', function (req, res) {
  //   return res.send("OK");
  // });


  app.get('*', function (req, res, next) {

    return res.sendFile(path.join(publicDir, 'index.html'));

  });

};
