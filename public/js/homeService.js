(function () {
    'use strict';

    angular.module("heatin_up")
        .factory('homeService', homeService);

    homeService.$inject = ['$http', 'loginService'];

    function homeService($http, loginService) {
        return {
            getMapCenter: getMapCenter,
            getLocationDataForUser: getLocationDataForUser,
            getLocationDataForAll: getLocationDataForAll,
            getLocationDataForUserByDate: getLocationDataForUserByDate,
            getLocationDataForAllByDate: getLocationDataForAllByDate
        };

        function getMapCenter() {
            return $http({
                method: 'POST',
                url: '/api/getLocationDataForUser',
                data: {
                    username: loginService.getUsername()
                }
            })
                .then(success)
                .catch(fail);

            function success(response) {
                var longitudeCenter = 0.0;
                var latitudeCenter = 0.0;

                for(var i = 0; i < response.data.length; i++) {
                    latitudeCenter += response.data[i].latitude;
                    longitudeCenter += response.data[i].longitude;
                }

                longitudeCenter = longitudeCenter / response.data.length;
                latitudeCenter = latitudeCenter / response.data.length;

                return {longitudeCenter: longitudeCenter.toFixed(3), latitudeCenter: latitudeCenter.toFixed(3)};
            }

            function fail(error) {
                console.log(error);
            }
        }

        function getLocationDataForUser(username) {
            return $http({
                method: 'POST',
                url: '/api/getLocationDataForUser',
                data: {
                    username: username
                }
            })
                .then(success)
                .catch(fail);

            function success(response) {
                var returnVal = [];

                for(var i = 0; i < response.data.length; i++) {
                    returnVal.push({latitude: response.data[i].latitude, longitude: response.data[i].longitude});
                }

                return returnVal;
            }

            function fail(error) {
                console.log("Error in GetLocationDataForUser()");
                console.log(error);
            }
        }
        
        function getLocationDataForAll() {
            return $http({
                method: 'POST',
                url: '/api/getLocationDataForAll'
            })
                .then(success)
                .catch(fail);

            function success(response) {
                var returnVal = [];

                for(var i = 0; i < response.data.length; i++) {
                    returnVal.push({latitude: response.data[i].latitude, longitude: response.data[i].longitude});
                }

                return returnVal;
            }

            function fail(error) {
                console.log("Error in GetLocationDataForAll()");
                console.log(error);
            }
        }

        function getLocationDataForUserByDate(date, username) {
            return $http({
                method: 'POST',
                url: '/api/getLocationDataForUserByDate',
                data: {
                    username: username,
                    time: date
                }
            })
                .then(success)
                .catch(fail);

            function success(response) {
                var returnVal = [];

                for(var i = 0; i < response.data.length; i++) {
                    returnVal.push({latitude: response.data[i].latitude, longitude: response.data[i].longitude});
                }

                return returnVal;
            }

            function fail(error) {
                console.log("Error in GetDataPointsForDate()");
                console.log(error);
            }
        }

        function getLocationDataForAllByDate(date) {
            return $http({
                method: 'POST',
                url: '/api/getLocationDataForAllByDate',
                data: {
                    time: date
                }
            })
                .then(success)
                .catch(fail);

            function success(response) {
                var returnVal = [];

                for(var i = 0; i < response.data.length; i++) {
                    returnVal.push({latitude: response.data[i].latitude, longitude: response.data[i].longitude});
                }

                return returnVal;
            }

            function fail(error) {
                console.log("Error in GetLocationDataForAllByDate()");
                console.log(error);
            }
        }

        function getIntersection(givenUsername1, givenUsername2, givenTime){
            return $http({
                method: 'POST',
                url: '/api/getIntersection',
                data: {
                    username1: givenUsername1,
                    username2: givenUsername2,
                    time: givenTime
                }
            })
                .then(success)
                .catch(fail);

            function success(response) {
                var returnVal = [];

                for(var i = 0; i < response.data.length; i++) {
                    returnVal.push({latitude: response.data[i].latitude, longitude: response.data[i].longitude});
                }

                return returnVal;
            }

            function fail(error) {
                console.log("Error in getIntersection()");
                console.log(error);
            }
        }
    }

})();