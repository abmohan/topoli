angular.module('sampleApp').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

  $routeProvider

    // home page
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'MainController'
    })

    // ward page that will use the WardController
    .when('/toronto/wards', {
      templateUrl: 'views/toronto/ward.html',
      controller: 'WardController'
    });

  $locationProvider.html5Mode(true);

}]);
