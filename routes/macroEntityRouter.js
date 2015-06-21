'use strict';

module.exports = function macroEntityRouter(app) {

  app.get('/', function (req, res, send) {
    return res.send('OK');
  });

};
