(function () {
    'use strict';

    angular.module('heatin_up')
        .controller("userIntersectionController", userIntersectionController);

    userIntersectionController.$inject = ['homeService', 'loginService', '$location'];

    function userIntersectionController(homeService, loginService, $location) {
        var vm = this;
        vm.error = "";
        vm.mapProperties = {};
        vm.heatmapLayer = {};
        vm.showingResults = false;
        vm.users = {first: "", second: ""};
        vm.date = {month: "", day: "", year: ""};
        vm.toggleHeatmap = toggleHeatmap;
        vm.changeGradient = changeGradient;
        vm.changeRadius = changeRadius;
        vm.changeOpacity = changeOpacity;
        vm.search = search;
        vm.reset = reset;
        vm.activate = activate;
        vm.logout = logout;

        activate();

        function activate() {
            if (!loginService.isLoggedIn())
                $location.path('/login');

            vm.mapProperties = {
                center: {
                    latitude: 42.038,
                    longitude: -93.644
                },
                zoom: 13,
                show: true,
                data: {},
                heatLayerCallback: function (layer) {
                    vm.heatmapLayer = layer;
                }
            };
        }

        function logout() {
            loginService.logout();
            $location.path('/login');
        }

        function toggleHeatmap() {
            vm.mapProperties.show = !vm.mapProperties.show;
        }

        function changeGradient() {
            var gradient = [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 191, 255, 1)',
                'rgba(0, 127, 255, 1)',
                'rgba(0, 63, 255, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(0, 0, 223, 1)',
                'rgba(0, 0, 191, 1)',
                'rgba(0, 0, 159, 1)',
                'rgba(0, 0, 127, 1)',
                'rgba(63, 0, 91, 1)',
                'rgba(127, 0, 63, 1)',
                'rgba(191, 0, 31, 1)',
                'rgba(255, 0, 0, 1)'
            ];
            vm.heatmapLayer.set('gradient', vm.heatmapLayer.get('gradient') ? null : gradient);
        }

        function changeRadius() {
            vm.heatmapLayer.set('radius', vm.heatmapLayer.get('radius') ? null : 20);
        }

        function changeOpacity() {
            vm.heatmapLayer.set('opacity', vm.heatmapLayer.get('opacity') ? null : 0.5);
        }

        function search() {
            if(vm.users.first == "" || vm.users.second == "" || vm.date.month.length < 2 || vm.date.day.length < 2 || vm.date.year.length < 4)
                return;

            vm.error = "";
            var date = vm.date.month + "-" + vm.date.day + "-" + vm.date.year;

            homeService.getIntersection(vm.users.first, vm.users.second, date)
                .then(success)
                .catch(fail);

            function success(response) {
                if(response.length > 0) {
                    vm.showingResults = true;
                    vm.mapProperties.data = response;

                    var dataArray = [];
                    for (var i = 0; i < vm.mapProperties.data.length; i++) {
                        dataArray.push(new google.maps.LatLng(vm.mapProperties.data[i].latitude, vm.mapProperties.data[i].longitude));
                    }

                    vm.heatmapLayer.setData(dataArray);
                }
                else {
                    vm.error = "No intersections on this day";
                }
            }

            function fail(error) {
                console.log(error);
            }
        }

        function reset() {
            vm.showingResults = false;
            vm.users.first = "";
            vm.users.second = "";
            vm.date.month = "";
            vm.date.day = "";
            vm.date.year = "";
            vm.heatmapLayer.setData([]);
        }
    }

})();