const express = require('express');

module.exports = function topoliRouter(app) {
  const publicDir = app.get('publicDir');
  app.use('/', express.static(publicDir));
};
