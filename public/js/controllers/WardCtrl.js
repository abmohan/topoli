angular.module('sampleApp')

  .controller('WardController', function ($scope, WardService, d3Service) {

    console.log("loading voter turnout data");

    WardService.get()
      .success(function (wardData) {
        if ($scope.data) {
          $scope.data.wards = wardData;
        } else {
          $scope.data = {wards: wardData};
        }

      })
      .error(function (error) {
        $scope.error = error;
      });

  })
  .directive('torontoMap', function ($q, $window, WardService, d3Service) {

    var directiveDefinitionObject = {

      restrict: 'AE',

      link: function (scope, element, attrs) {

        $q.all([WardService.get(), d3Service.d3()]).then(function (data) {

          var el = element[0];
          var json = data[0].data;
          var d3 = data[1];

          var svg = d3.select(el)
            .append("svg")
            .style('width', '100%');

          window.onresize = function() {
            scope.$apply();
          }

          scope.$watch(function() {
            return angular.element($window)[0].innerWidth;
          }, function() {
            scope.render();
          });

          scope.render = function() {

            // remove all previous items before rendering
            svg.selectAll('*').remove();

            var width = parseInt(d3.select(el).style('width'), 10),
              mapRatio = 1,
              height = Math.min(width * mapRatio, window.innerHeight);
              scale = width,
              center = d3.geo.centroid(json);

            var projection = d3.geo.mercator()
              .scale(scale)
              .center(center);

             // create the path
            var path = d3.geo.path()
              .projection(projection);

            var rotation = [0, 0, 0],
              bounds  = path.bounds(json),
              hscale  = width * width / (bounds[1][0] - bounds[0][0]),
              vscale  = width * height / (bounds[1][1] - bounds[0][1]);
            scale   = 0.9 * Math.min(hscale, vscale);

            projection = d3.geo.mercator()
                .scale(scale)
                .center(center)
                .translate([width / 2, height / 2]);

            path = d3.geo.path()
                .projection(projection);

            svg.attr("width", width)
              .attr("height", height);

            svg.selectAll("path")
                .data(json.features)
              .enter().append("path")
                .attr("d", path)
                .style("fill", "white")
                .style("stroke-width", "1")
                .style("stroke", "black");
          }

        });

      }
    };

    return directiveDefinitionObject;

  });
