;(function(ng) {
    ng
    .module('correlator-sharp-ngRoute', ['ngRoute', 'correlator-sharp'])
    .run(['$rootScope', 'csActivityScope', function(rootScope, activityScope) {
        rootScope.$on('$routeChangeStart', function(event, next, current) {
            activityScope.create(next.scope.name);
        });
    }]);
}(angular));