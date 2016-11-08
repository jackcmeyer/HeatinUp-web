(function () {
    'use strict';

    angular.module('heatin_up')
        .factory('registerService', registerService);

    registerService.$inject = ['$http'];

    function registerService($http) {

        return {
            createAccount: createAccount
        };

        function createAccount(user) {
            return $http({
                method: 'POST',
                url: '/api/register',
                data: {
                    username: user.username,
                    password: user.password
                }
            })
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                console.log("Error in register()");
                console.log(error);
            }
        }
    }

})();