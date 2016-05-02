const express = require('express');
// const sequelize = require('sequelize');
const winston = require('winston');

const app = express();
// const dbConfig = require('./config/db');
const webServerConfig = require('./config/webserver');

app.set('publicDir', webServerConfig.publicFolderPath);

require('./routes')(app);

app.listen(webServerConfig.port, function cb() {
  winston.log('TOpoli node app is running on port', webServerConfig.port);
});
