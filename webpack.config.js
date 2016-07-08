const path = require('path');

var packageName = require("./package.json").name;

module.exports = {
  entry: './src/module.js',
  output: {
    path: __dirname + '/dist',
    filename: packageName + '.js',
  },
  plugins: [],
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.html$/, loader: 'html' },
    ],
  },
  resolve: {
    root: path.resolve('./'),
  },
};
