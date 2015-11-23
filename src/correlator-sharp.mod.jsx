


(function (ng) {

	let CORRELATION_ID_HEADER = 'X-Correlation-Id';

	ng

		.module('correlator-sharp', [ ])

		.factory('correlatorSharpHttpInterceptor', ['ActivityScope', function(activityScope) {

			return {

				'request': function(config) {

					// Add the current activity scope's id.

					config.headers[CORRELATION_ID_HEADER] = activityScope.current.id.value;

					return config;
				},

				'response': function(response) {

					let correlationId = response.headers[CORRELATION_ID_HEADER];
					if (correlationId) {
						// Setup the scope with server generated id.

						let name = `${response.config.url} ${response.config.method}`;

						activityScope.current = activityScope.fromHeader(name, correlationId);
					}

					return response;
				}
			};

		}])

		.config(['$httpProvider', function ($httpProvider) {

			$httpProvider.interceptors.push('correlatorSharpHttpInterceptor');

		}]);

} (angular))