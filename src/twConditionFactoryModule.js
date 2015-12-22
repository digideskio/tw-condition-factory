'use strict';

var angular = require('angular');
var ConditionFactory = require('./ConditionFactory');

var conditionFactoryModule = angular.module('tw-condition-factory', []);
conditionFactoryModule.service('ConditionFactory', ['$q', ConditionFactory]);