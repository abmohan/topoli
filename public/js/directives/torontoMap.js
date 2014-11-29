angular.module('sampleApp.directives')
  .directive('torontoMap', function ($q, WardService, d3Service) {

    var directiveDefinitionObject = {

      restrict: 'AE',

      link: function (scope, element, attrs) {

        $q.all([WardService.get(), d3Service.d3()]).then(function (data) {
          var json = data[0].data;
          var d3 = data[1];
          console.log(element[0].style.width, element[0].style.height);
          var width  = 940;
          var height = 600;

          // TODO: figure out the element
          var vis = d3.select(element[0])
            .append("svg")
            .attr("width", width)
            .attr("height", height);

          // create a first guess for the projection
          var center = d3.geo.centroid(json);
          var scale  = 150;
          var offset = [width / 2, height / 2];

          var projection = d3.geo.mercator()
            .scale(scale)
            .center(center)
            .translate(offset);

           // create the path
          var path = d3.geo.path()
            .projection(projection);

          // using the path determine the bounds of the current map and use
          // these to determine better values for the scale and translation
          var rotation = [0, 0, 0];
          var bounds  = path.bounds(json);
          var hscale  = scale * width / (bounds[1][0] - bounds[0][0]);
          var vscale  = scale * height / (bounds[1][1] - bounds[0][1]);
          scale   = (hscale < vscale) ? hscale : vscale;
          offset  = [width - (bounds[0][0] + bounds[1][0]) / 2,
                         height - (bounds[0][1] + bounds[1][1]) / 2];

          // new projection
          projection = d3.geo.mercator()
            .center(center)
            .scale(scale)
            .translate(offset)
            .rotate(rotation);
          path = path.projection(projection);

          vis.selectAll("path").data(json.features).enter().append("path")
            .attr("d", path)
            .style("fill", "white")
            .style("stroke-width", "1")
            .style("stroke", "black");
        });

      }
    };

    return directiveDefinitionObject;

  });


