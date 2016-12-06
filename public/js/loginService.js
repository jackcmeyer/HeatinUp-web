(function () {
    'use strict';

    angular.module('heatin_up')
        .factory('loginService', loginService);

    loginService.$inject = ['$http'];

    function loginService($http) {

        var loggedIn = true;
        var username = "test";

        return {
            getUsername: getUsername,
            isLoggedIn: isLoggedIn,
            login: login,
            logout: logout
        };

        function getUsername() {
            return username;
        }

        function isLoggedIn() {
            return loggedIn;
        }

        function login(user) {
            username = user.username;

            return $http({
                method: 'POST',
                url: '/api/login',
                data: {
                    username: user.username,
                    password: user.password
                }
            })
                .then(success)
                .catch(fail);

            function success(response) {
                loggedIn = true;
                return response.data;
            }

            function fail(error) {
                console.log(error);
            }
        }

        function logout() {
            loggedIn = false;
            username = "";
        }
    }

})();