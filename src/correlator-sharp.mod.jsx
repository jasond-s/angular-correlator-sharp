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

                    // Add the current activity scope's id.

                    config.headers[statics.CORRELATION_ID_HEADER] = activityScope.current.id.value;
                    config.headers[statics.CORRELATION_ID_STARTED_HEADER] = activityScope.current.id.time;
                    config.headers[statics.CORRELATION_ID_NAME_HEADER] = activityScope.current.name;

                    if (activityScope.current.parent)
                        config.headers[statics.CORRELATION_ID_PARENT_HEADER] = activityScope.current.id.parent.id;

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
        return ng.extend({}, cs.statics);
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

}(angular, Uuid, CorrelatorSharp))