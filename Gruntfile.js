var loadToronto = require('./server/bin/scripts/toronto/loadToronto');

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
  });

  grunt.registerTask('load', 'Loads data into the db', function (dataset, year) {

    grunt.log.writeln("running", this.name, dataset, year);
    var done = this.async();

    if (arguments.length !== 2) {
      grunt.log.error("No arguments provided");
      return;
    }

    if (dataset.toUpperCase() === 'TORONTO') {
      grunt.log.writeln("Loading Toronto wards, polls and results");

      year = parseInt(year || (new Date()).getFullYear(), 10);  // use current year as default
      loadToronto(year, function () {
        done();
      });

    }

  });

  // Default task(s).
  grunt.registerTask('default', []);

};
