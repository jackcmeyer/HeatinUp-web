(function () {
    'use strict';

    angular.module("heatin_up")
        .factory('homeService', homeService);

    homeService.$inject = ['$http', 'loginService'];

    function homeService($http, loginService) {
        return {
            getMapCenter: getMapCenter,
            getDataPoints: getDataPoints,
            getDataPointsForDate: getDataPointsForDate,
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

        function getDataPoints() {
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
                var returnVal = [];

                for(var i = 0; i < response.data.length; i++) {
                    returnVal.push({latitude: response.data[i].latitude, longitude: response.data[i].longitude});
                }

                return returnVal;
            }

            function fail(error) {
                console.log(error);
            }
        }

        function getDataPointsForDate(date) {
            return $http({
                method: 'POST',
                url: '/api/getLocationDataForUserByDate',
                data: {
                    username: loginService.getUsername(),
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
    }

})();