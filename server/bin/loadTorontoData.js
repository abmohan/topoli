var Promise           = require('bluebird');
var loadTorontoWards  = require('./loadTorontoWards');

loadTorontoWards()
.then(function (result) {
  console.log("Toronto data loaded", result);
})
.catch(function (err) {
  console.error("Error loading Toronto data", err);
});
