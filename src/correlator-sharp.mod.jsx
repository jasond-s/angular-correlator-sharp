(function(ng, uuid, cs) {

    ng

    .module('correlator-sharp', [])

    /* Add the interceptor to the app provider
    /*****************************************************/

    .config(['$httpProvider', function($httpProvider) {

        $httpProvider.interceptors.push('csHttpInterceptor');

    }])


    /* Interceptor used for setting headers from the current activity.
    /*****************************************************/

    .factory('csHttpInterceptor', [
        'csStatic',
        'csActivityScope',

        function(statics, activityScope) {

            return {

                request: function(config) {

                    // Add the name for the scope.
                    let name = `${config.method} ${config.url}`;

                    // Add the current activity scope's id.
                    let reqScope = new cs.ActivityScope(name, activityScope.current);

                    config.headers[statics.CORRELATION_ID_HEADER] = reqScope.id.value;
                    config.headers[statics.CORRELATION_ID_STARTED_HEADER] = reqScope.id.time.toISOString();
                    config.headers[statics.CORRELATION_ID_NAME_HEADER] = reqScope.name;

                    if (reqScope.parent)
                        config.headers[statics.CORRELATION_ID_PARENT_HEADER] = reqScope.parent.id.value;

                    return config;
                },

                response: function(response) {

                    let correlationId = response.headers[statics.CORRELATION_ID_HEADER];
                    if (correlationId) {

                        // Setup the scope with server generated id.
                        let name = `${response.config.method} ${response.config.url}`;

                        activityScope.create(name, correlationId)
                    }

                    return response;
                }
            };

        }
    ])

    /* Globals useful for the other apps to use.
    /*****************************************************/

    .service('csStatic', function() {
        return ng.extend({}, cs.Statics);
    })

    /* Angular wrapper around the UUID module.
    /*****************************************************/

    .service('csUuid', function() {
        return {
            generate: function(seed) {
                return new uuid(seed);
            }
        }
    })

    /* Angular wrapper around the ActivityScope module.
    /*****************************************************/

    .service('csActivityScope', ['$rootScope', 'csUuid', function($rootscope, uuid) {

        return {

            // Access memebers

            get current() {
                return cs.ActivityScope.current;
            },

            set current(value) {
                cs.ActivityScope.current = value;
            },

            // Creation members.

            create(name, seed) {
                return cs.ActivityScope.create(name, seed);
            },

            child(name, seed) {
                return cs.ActivityScope.child(name, seed);
            },

            new(name, seed) {
                return cs.ActivityScope.new(name, seed);
            }
        };
    }]);

}(angular, Uuid, CorrelatorSharp));