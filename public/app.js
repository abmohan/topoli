var width  = window.innerWidth;
var height = window.innerHeight;

var vis = d3.select("#vis")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

d3.json("/api/wards", function (json) {
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
