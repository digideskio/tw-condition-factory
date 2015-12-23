# Condition Factory Angular Component

[![Build Status](https://travis-ci.org/transferwise/tw-condition-factory.svg)](https://travis-ci.org/transferwise/tw-condition-factory)

## Usage
```
var condition = ConditionFactory.createCondition(
	check, // check function must return either Boolean or Boolean promise
	onError // callback function
);
```
Returns a condition object
```
{
  check: check,
  resolve: function(){...} // returns promise that rejects if condition check fails,
  onError: onError
}
```
Rejection object:
```
{
  type: ConditionFactory.CONDITION_TYPE,
  onError: onError
}
```

## Examples
```
RoutingConditions.userIsLoggedIn = ConditionFactory.createCondition(
	function() {
		return !!UserService.getToken();
	},
	function() {
	  redirectTo('login')
	}
);
RoutingConditions.userIsNotLoggedIn = ConditionFactory.createReversedCondition(
	RoutingConditions.userIsLoggedIn,
	function() {
	  redirectTo('profile')
	}
);

// Routing
$routeProvider
	.when('/profile', {
		templateUrl: '/templates/profile.html',
		controller: 'ProfileController',
		controllerAs: 'vm',
		resolve: {
			canAccess: function(RoutingConditions) {
				return RoutingConditions.userIsLoggedIn.resolve();
			}
		}
	})
	.when('/login', {
		templateUrl: '/templates/login.html',
		controller: 'LoginController',
		controllerAs: 'vm',
		resolve: {
			canAccess: function(RoutingConditions) {
				return RoutingConditions.userIsNotLoggedIn.resolve();
			}
		}
	})
	.when('/error', {
		templateUrl: '/templates/error.html',
		controller: 'ErrorController',
		controllerAs: 'vm',
	});

// Handle the unresolved conditions used in routes
$rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
	console.log("route rejection: cannot go to " + current.$$route.originalPath);
	console.log(rejection);
	try {
		rejection.onError();
	} catch(event) {
		redirectTo('error');
	}
});
```
