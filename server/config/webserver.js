const path = require('path');

const localWebServerPort = 5000;

module.exports = {
  publicFolderPath: path.resolve(__dirname, '../../dist'),
  port: process.env.PORT || localWebServerPort
};
