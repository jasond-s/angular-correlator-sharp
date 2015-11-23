


(function (ng) {

	ng
		.module('correlator-sharp-ng-route', [ 
			'ngRoute', 
			'correlator-sharp' 
		])

		.run(['$rootScope', 'ActivityScope', 'Uuid', function (rootScope, activityScope, uuid) {

			rootScope.$on('$routeChangeStart', function (event, next, current) {

				activityScope.create(next);

			});

		}]);

} (angular))