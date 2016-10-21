(function() {
    'use strict';

    angular.module("heatin_up", ['ui.router'])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'partials/home.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'partials/login.html'
            });
    }
})();
