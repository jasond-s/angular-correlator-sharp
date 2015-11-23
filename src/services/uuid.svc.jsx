


(function (ng, Uuid) {

	ng	
		.module('correlator-sharp')

		.service('Uuid', function () {

			return {
				generate: function (seed) {
					return new Uuid(seed);
				}
			}
		});

} (angular, Uuid))