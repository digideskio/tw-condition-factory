#! /usr/bin/env node
var shell = require('shelljs');
var colors = require('colors');

function getLoggerForCommand(cmd) {
  return function(exitCode, stdout, stderr) {
    if (exitCode == 0) {
      console.log(('Successfully ran ' + cmd).green);
    } else {
      console.log(('Error when running ' + cmd).underline.red, stderr.red);
    }
  }
}

function runWebpackWithConfigFile(fileName) {
  var command = 'webpack --config ' + fileName;
  console.log(('Running ' + command).cyan);
  shell.exec(command, {silent: true}, getLoggerForCommand(command));
}

runWebpackWithConfigFile('webpack.config.js');
runWebpackWithConfigFile('webpack.config.prod.js');
