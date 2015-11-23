


(function (ng) {

	ng
		.module('correlator-sharp-ui-state', [ 
			'ui-router', 
			'correlator-sharp' 
		])

		.run(['$rootScope', 'ActivityScope', 'Uuid', function (rootScope, activityScope, uuid) {

			rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, error) {
				
				activityScope.create(toState);

			});
		}]);

} (angular))