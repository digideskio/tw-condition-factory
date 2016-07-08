var webpack = require('webpack');
var prodConfig = require('./webpack.config');
var packageName = require('./package.json').name;

prodConfig.plugins = [
  new webpack.optimize.UglifyJsPlugin({compress: { warnings: false }})
];

prodConfig.output.filename = packageName + '.min.js';

module.exports = prodConfig;
