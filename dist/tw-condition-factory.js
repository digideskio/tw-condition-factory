(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);

module.exports = function ConditionFactory($q) {

    var self = this;
    var ARG_VALIDATIONS = {
        check: {
            type: 'function',
            nullable: false
        },
        onError: {
            type: 'function',
            nullable: false
        }
    };

    self.CONDITION_TYPE = 'condition';
    self.createCondition = createCondition;
    self.createReversedCondition = createReversedCondition;

    // check argument should return a bool in a promise to indicate if condition is satisfied or not
    // createCondition catches the exception to replace it by standard one
    function createCondition(check, onError) {
        var args = {
            check: check,
            onError: onError
        };
        validateArgs(args);

        return {
            check: check,
            resolve: function() {
                return  $q.when(check.apply(this, arguments))
                    .then(function(condition) {
                        if (!condition) {
                            return $q.reject(formatRejection(onError));
                        }
                    });
            },
            onError: onError
        };
    }

    function createReversedCondition(condition, onError) {
        return createCondition(
            reverseConditionCheck(condition),
            onError
        );
    }

    // private
    function validateArgs(args) {
        for (var argName in ARG_VALIDATIONS) {
            if (ARG_VALIDATIONS.hasOwnProperty(argName)) {
                if (!ARG_VALIDATIONS[argName].nullable && !args[argName]) {
                    throw Error('[CANNOT_CREATE_CONDITION] missing argument ' + argName);
                }
                if (typeof args[argName] !== ARG_VALIDATIONS[argName].type) {
                    throw Error('[CANNOT_CREATE_CONDITION] ' +
                        argName + ' should be of type "' + ARG_VALIDATIONS[argName].type + '"');
                }
            }
        }
    }

    function reverseConditionCheck(condition) {
        return function() {
            return $q.when(condition.check())
                .then(function(condition) {
                    return !condition;
                });
        };
    }

    function formatRejection(onError) {
        return {
            type: self.CONDITION_TYPE,
            onError: onError
        };
    }

};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);
var ConditionFactory = require('./ConditionFactory');

var conditionFactoryModule = angular.module('tw-condition-factory', []);
conditionFactoryModule.service('ConditionFactory', ['$q', ConditionFactory]);
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./ConditionFactory":1}]},{},[2]);
