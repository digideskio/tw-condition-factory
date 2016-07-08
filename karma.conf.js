const webpackConfig = require('./webpack.config.js');
webpackConfig.entry = {};
webpackConfig.devtool = 'inline-source-map';

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    reporters: ['progress', 'mocha'],
    autoWatch: false,
    singleRun: true,
    browsers: ['PhantomJS'],
    files: [
      './spec.bundle.js',
    ],
    preprocessors: {
      './spec.bundle.js': ['webpack', 'sourcemap'],
    },
    mochaReporter: {
      output: 'minimal',
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
    },
    client: {
      captureConsole: true,
    },
  });
};
