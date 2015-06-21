

module.exports = function microEntityRouter(app) {

  app.get('/', function (req, res, send) {
    return res.send('OK');
  });

};
