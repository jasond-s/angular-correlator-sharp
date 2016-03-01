;(function(ng) {
    ng
    .module('correlator-sharp-ui-router', ['ui.router', 'correlator-sharp'])
    .run(['$rootScope', 'csActivityScope', function(rootScope, activityScope) {
        rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, error) {
            activityScope.create(toState.name);
        });
    }]);
}(angular));