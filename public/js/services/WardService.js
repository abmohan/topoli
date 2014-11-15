angular.module('sampleApp')

  .factory('WardService', ['$http', function ($http) {

    return {
      // call to get all wards
      get : function () {
        return $http.get('/api/toronto/wards');
      }

    };

  }]);
