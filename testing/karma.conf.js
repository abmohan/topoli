module.exports = function (config) {

  'use strict';

  console.log(process.cwd());

  config.set({

    basePath: '',

    frameworks: ['mocha', 'chai', 'chai-as-promised'],

    files: [
      'server/**/*.js',
      'client/app/**/*.js'
    ],
    exclude: [],

    reporters: ['nyan', 'progress'],

    port: 9999,
    colors: true,
    autoWatch: true,
    singleRun: false,

    logLevel: config.LOG_ERROR,

    browsers: ['PhantomJS']

  });
};
