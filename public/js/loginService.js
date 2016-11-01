(function () {
    'use strict';

    angular.module('heatin_up')
        .factory('loginService', loginService);

    loginService.$inject = ['$window', '$http'];

    function loginService($window, $http) {

        var loggedIn = false;

        return {
            isLoggedIn: isLoggedIn,
            login: login,
            logout: logout
        };

        function isLoggedIn() {
            return loggedIn;
        }

        function login(user) {
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
        }
    }

})();