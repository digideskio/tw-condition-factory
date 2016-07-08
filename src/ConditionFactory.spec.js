import angular from 'angular';
import Module from './module';

describe('Service: ConditionFactory', function() {
    var $q, $rootScope, ConditionFactory;

    beforeEach(angular.mock.module('tw-condition-factory'));

    beforeEach(inject(function($injector) {
        ConditionFactory = $injector.get('ConditionFactory');
        $q = $injector.get('$q');
        $rootScope = $injector.get('$rootScope');
    }));

    var CHECK_RETURN_TRUE = function () {
        return true;
    };
    var CHECK_RETURN_FALSE = function () {
        return false;
    };
    var DEFAULT_ON_ERROR = function() {
        return 'DEFAULT_ON_ERROR result';
    };

    describe("createCondition", function () {

        it("should refuse to create condition if argument missing", function () {
            expect(function () {
                ConditionFactory.createCondition(CHECK_RETURN_TRUE);
            })
                .toThrow(Error('[CANNOT_CREATE_CONDITION] missing argument onError'));
        });

        it("should refuse to create condition if bad argument type", function () {
            expect(function () {
                ConditionFactory.createCondition("striiiing", DEFAULT_ON_ERROR);
            })
                .toThrow(Error('[CANNOT_CREATE_CONDITION] check should be of type "function"'));
        });

        it("should return a well-formed condition object", function () {
            var condition = ConditionFactory.createCondition(
                CHECK_RETURN_TRUE,
                function() { return 'overview' });

            expect(condition.hasOwnProperty('check')).toBe(true);
            expect(condition.check).toEqual(CHECK_RETURN_TRUE);

            expect(condition.hasOwnProperty('resolve')).toBe(true);

            expect(condition.hasOwnProperty('onError')).toBe(true);
            expect(condition.onError()).toEqual("overview");
        });

        it("if condition does not resolve, a well-formed rejection object is returned", function () {
            var condition = ConditionFactory.createCondition(
                CHECK_RETURN_FALSE,
                DEFAULT_ON_ERROR
            );
            var rejection;
            condition.resolve()
                .catch(function (res) {
                    rejection = res;
                });
            $rootScope.$apply();

            expect(rejection.type).toEqual(ConditionFactory.CONDITION_TYPE);
            expect(rejection.onError).toEqual(DEFAULT_ON_ERROR);
        });

        it("if condition resolves, no rejection object is returned", function () {
            var condition = ConditionFactory.createCondition(
                CHECK_RETURN_TRUE,
                DEFAULT_ON_ERROR
            );
            var rejection;
            condition.resolve()
                .catch(function (res) {
                    rejection = res;
                });
            $rootScope.$apply();

            expect(rejection).toEqual(undefined);
        });

        it("resolve should apply arguments to check function correctly", function () {
            function areEqual(a, b) { return a === b  }

            var condition = ConditionFactory.createCondition(
                areEqual,
                DEFAULT_ON_ERROR
            );
            var rejection;
            condition.resolve(2, 2)
                .catch(function (res) {
                    rejection = res;
                });
            $rootScope.$apply();
            expect(rejection).toEqual(undefined);

            condition.resolve(2, 3)
                .catch(function (res) {
                    rejection = res;
                });
            $rootScope.$apply();

            expect(rejection.type).toEqual(ConditionFactory.CONDITION_TYPE);
            expect(rejection.onError).toEqual(DEFAULT_ON_ERROR);
        });

    });

    describe("createReversedCondition", function () {
        var reversedConditionOnError;
        beforeEach(function() {
            reversedConditionOnError = function() { return 'something else' };
        });

        it("a reversed condition rejects when the original condition does not", function() {
            var condition = ConditionFactory.createCondition(
                CHECK_RETURN_TRUE,
                DEFAULT_ON_ERROR
            );
            var reversedCondition = ConditionFactory.createReversedCondition(
                condition,
                reversedConditionOnError
            );
            var rejection;
            var revRejection;

            condition.resolve()
                .catch(function(res){
                    rejection = res;
                });
            reversedCondition.resolve()
                .catch(function(res){
                    revRejection = res;
                });

            $rootScope.$apply();

            expect(rejection).toEqual(undefined);
            expect(revRejection.type).toEqual(ConditionFactory.CONDITION_TYPE);
            expect(revRejection.onError).toEqual(reversedConditionOnError);
        });

        it("a reversed condition does not reject when the original does", function() {
            var condition = ConditionFactory.createCondition(
                CHECK_RETURN_FALSE,
                DEFAULT_ON_ERROR
            );
            var reversedCondition = ConditionFactory.createReversedCondition(
                condition,
                reversedConditionOnError);

            var rejection;
            var revRejection;

            condition.resolve()
                .catch(function(res){
                    rejection = res;
                });
            reversedCondition.resolve()
                .catch(function(res){
                    revRejection = res;
                });

            $rootScope.$apply();

            expect(rejection.type).toEqual(ConditionFactory.CONDITION_TYPE);
            expect(rejection.onError).toEqual(DEFAULT_ON_ERROR);
            expect(revRejection).toEqual(undefined);
        });

        it("should handle arguments", function () {
            function areEqual(a, b) { return a === b  }

            var condition = ConditionFactory.createCondition(
                areEqual,
                DEFAULT_ON_ERROR
            );
            var reversedCondition = ConditionFactory.createReversedCondition(
                condition,
                reversedConditionOnError);

            var rejection;
            reversedCondition.resolve(3, 2)
                .catch(function (res) {
                    rejection = res;
                });
            $rootScope.$apply();
            expect(rejection).toEqual(undefined);

            reversedCondition.resolve(2, 2)
                .catch(function (res) {
                    rejection = res;
                });
            $rootScope.$apply();

            expect(rejection.type).toEqual(ConditionFactory.CONDITION_TYPE);
            expect(rejection.onError).toEqual(reversedConditionOnError);
        });

    });

});
