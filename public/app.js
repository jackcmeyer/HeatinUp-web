(function() {
    'use strict';

    angular.module("heatin_up", ['ui.router', 'uiGmapgoogle-maps'])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider', 'uiGmapGoogleMapApiProvider'];

    function config($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {
        // Google maps api stuff
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyCgzf0nLxiHmIgNIQBJnvQjWZgtPqQaobk',
            v: '3', //defaults to latest 3.X anyhow
            libraries: 'visualization'
        });

        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'partials/home.html',
                controller: 'homeController',
                controllerAs: 'vm'
            })
            .state('userIntersection', {
                url: '/user_intersection',
                templateUrl: 'partials/userIntersection.html',
                controller: 'userIntersectionController',
                controllerAs: 'vm'
            })
            .state('companyManagement', {
                url: '/company_management',
                templateUrl: 'partials/companyManagement.html',
                controller: 'companyManagementController',
                controllerAs: 'vm'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'partials/login.html',
                controller: 'loginController',
                controllerAs: 'vm'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'partials/register.html',
                controller: 'registerController',
                controllerAs: 'vm'
            });
    }
})();
