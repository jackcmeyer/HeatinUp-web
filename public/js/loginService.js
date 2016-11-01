(function () {
    'use strict';

    angular.module('heatin_up')
        .factory('loginService', loginService);

    loginService.$inject = ['$window', '$http'];

    function loginService($window, $http) {
        return {
            saveToken: saveToken,
            getToken: getToken,
            isLoggedIn: isLoggedIn,
            login: login,
            logout: logout
        };

        function saveToken(token) {
            $window.localStorage["heatin_up-token"] = token;
        }

        function getToken() {
            return $window.localStorage["heatin_up-token"];
        }

        function isLoggedIn() {
            var token = getToken();

            if(token){
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        }

        function login(user) {
            return $http({
                method: 'POST',
                url: '/api/login',
                data: {
                    user: user
                }
            })
                .then(success)
                .catch(fail);

            function success(data) {
                return saveToken(data.token);
            }

            function fail(error) {
                console.log(error);
            }
        }

        function logout() {
            $window.localStorage.removeItem("heatin_up-token");
        }
    }

})();