angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider

        // home page
        .when('/', {
            templateUrl: '/views/home.html',
            controller: 'AppController'
        }
    );
}]);