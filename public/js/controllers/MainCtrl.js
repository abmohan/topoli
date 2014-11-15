angular.module('sampleApp')
.controller('MainController', function ($scope) {
  console.log("MainCtrl loading");
  $scope.tagline = 'To the moon and back!';

});
