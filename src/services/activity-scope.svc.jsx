


(function (ng, globals) {
	
	ng
		.module('correlator-sharp')
	
		.service('ActivityScope', ['$rootScope', 'Uuid', function ($rootscope, uuid) {

			var activityScope = null;

			return {
				get current() {
					return activityScope;
				},
				set current(value) {
					activityScope = value;
				},

				create(name, seed){
					return activityScope = new ActivityScope(name, null, uuid.generate(seed));
				},

				createChild(name, seed) {
					return activityScope = new ActivityScope(name, activityScope, uuid.generate(seed));
				}
			};
		}]);

} (angular, window))