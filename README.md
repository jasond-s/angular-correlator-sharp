
[ ![angular-correlator-sharp](https://travis-ci.org/jasond-s/angular-correlator-sharp.svg "Travis Build") ](https://travis-ci.org/jasond-s/angular-correlator-sharp "angular-correlator-sharp")

# angular-correlator-sharp

A simple angular module providing support for the [correlator sharp package](https://github.com/ivanz/CorrelatorSharp).


## Installation

`npm install angular-correlator-sharp --save`


## Usage

You can use the provided service to interact with the current scope and create new sub scopes.

```javascript

	angular
		.module('myApp', [ 'correlator-sharp' ])
		.controller('myController', ['$scope', 'csActivityScope', function ($scope, csActivityScope) {

            // The id of the 'myController_child' scope.
            $scope.stateChangeCorrelationId = csActivityScope.current.id.value;

            // Change the current scope.        
            csActivityScope.new('myController');

            // Nest a context as a child scope.
            csActivityScope.child('myController_child');

            // The id of the 'myController_child' scope.
            $scope.currentCorrelationId = csActivityScope.current.id.value;

            // The id of the 'myController' scope.
            $scope.parentCorrelationId = csActivityScope.current.parent.id.value;

            // Generate a new root scope
            csActivityScope.create('myApp');
		}]);

```


### Addins

This package currently come pre packaged with a number of extras, including ActivityScope initialisers for the standard `ngRoute` module and also the `ui.router` routing modules.

It also has a tracing logger for [Azure's Application Insights](https://azure.microsoft.com/en-gb/documentation/articles/app-insights-get-started/) tracing. 

As the package grows and new logging frameworks and front-end frameworks are added, these will be broken out into their own packages.
