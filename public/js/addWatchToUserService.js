(function () {
    'use strict';

    angular.module('heatin_up')
        .factory('addWatchToUserService', addWatchToUserService);

    addWatchToUserService.$inject = ['$http'];

    function addWatchToUserService($http) {
        return {
            addUserWatch: addUserWatch,
            getUser: getUser
        };

        function addUserWatch(username, southwest, northeast) {
            var southeast = {
                longitude: northeast.longitude,
                latitude: southwest.latitude
            };

            var northwest = {
                longitude: southwest.longitude,
                latitude: northeast.latitude
            };

            return $http({
                method: 'POST',
                url: '/api/addUserWatch',
                data: {
                    username: username,
                    topLeft: northwest,
                    topRight: northeast,
                    bottomLeft: southwest,
                    bottomRight: southeast
                }
            })
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                console.log(error);
            }
        }

        function getUser(username) {
            return $http({
                method: 'POST',
                url: '/api/getUser',
                data: {
                    username: username
                }
            })
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                console.log(error);
            }
        }
    }

})();