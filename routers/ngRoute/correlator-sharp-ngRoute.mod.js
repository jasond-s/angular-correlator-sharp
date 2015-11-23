(function(ng) {
    ng
        .module('correlator-sharp-ngRoute', ['ngRoute', 'correlator-sharp'])
        .run(['$rootScope', 'csActivityScope', 'csUuid', function(rootScope, activityScope, uuid) {
            rootScope.$on('$routeChangeStart', function(event, next, current) {
                activityScope.create(next);
            });
        }]);
}(angular))