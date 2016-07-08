function ConditionFactory($q) {

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
            return $q.when(condition.check.apply(this, arguments))
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

export default ConditionFactory
