(function () {
    'use strict';

    angular.module('heatin_up')
        .controller("companyManagementLocationsController", companyManagementLocationsController);

    companyManagementLocationsController.$inject = ['companyService', 'loginService', '$location', '$stateParams'];
    
    function companyManagementLocationsController(companyService, loginService, $location, $stateParams) {
        var vm = this;
        vm.mapProperties = {};
        vm.heatmapLayer = {};
        vm.date = {month: "", day: "", year: ""};
        vm.dateFilter = false;
        vm.timelapseOn = false;
        vm.speed = 1.0;
        vm.i = 0;
        vm.recursiveDataArray = [];
        vm.recrusiveLoop = recrusiveLoop;
        vm.toggleHeatmap = toggleHeatmap;
        vm.changeGradient = changeGradient;
        vm.changeRadius = changeRadius;
        vm.changeOpacity = changeOpacity;
        vm.activate = activate;
        vm.logout = logout;
        vm.filterByDate = filterByDate;
        vm.resetDates = resetDates;
        vm.toggleTimelapse = toggleTimelapse;

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
                    companyService.getAllLocationDataForCompany($stateParams.companyId)
                        .then(success)
                        .catch(fail);

                    function success(response) {
                        vm.mapProperties.data = response;

                        var dataArray = [];
                        for (var i = 0; i < vm.mapProperties.data.length; i++) {
                            dataArray.push(new google.maps.LatLng(vm.mapProperties.data[i].latitude, vm.mapProperties.data[i].longitude));
                        }

                        vm.heatmapLayer.setData(dataArray);
                    }

                    function fail(error) {
                        console.log(error);
                    }
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
        
        function filterByDate() {
            if(vm.date.month.length < 2 || vm.date.day.length < 2 || vm.date.year.length < 4)
                return;

            var date = vm.date.month + "-" + vm.date.day + "-" + vm.date.year;

            companyService.getAllLocationDataForCompanyByDate($stateParams.companyId, date)
                .then(success)
                .catch(fail);

            function success(response) {
                vm.dateFilter = true;
                vm.mapProperties.data = response;

                var dataArray = [];
                for (var i = 0; i < vm.mapProperties.data.length; i++) {
                    dataArray.push(new google.maps.LatLng(vm.mapProperties.data[i].latitude, vm.mapProperties.data[i].longitude));
                }

                vm.heatmapLayer.setData(dataArray);
            }

            function fail(error) {
                console.log(error);
            }
        }
        
        function resetDates() {
            companyService.getAllLocationDataForCompany($stateParams.companyId)
                .then(success)
                .catch(fail);

            function success(response) {
                vm.dateFilter = false;
                vm.date.month = "";
                vm.date.day = "";
                vm.date.year = "";
                vm.mapProperties.data = response;

                var dataArray = [];
                for (var i = 0; i < vm.mapProperties.data.length; i++) {
                    dataArray.push(new google.maps.LatLng(vm.mapProperties.data[i].latitude, vm.mapProperties.data[i].longitude));
                }

                vm.heatmapLayer.setData(dataArray);
            }

            function fail(error) {
                console.log(error);
            }
        }

        function toggleTimelapse() {
            vm.timelapseOn = !vm.timelapseOn;

            if(vm.timelapseOn) {
                vm.heatmapLayer.setData([]);
                vm.recrusiveLoop();
            }
            else
            {
                var dataArray = [];
                for (var i = 0; i < vm.mapProperties.data.length; i++) {
                    dataArray.push(new google.maps.LatLng(vm.mapProperties.data[i].latitude, vm.mapProperties.data[i].longitude));
                }

                vm.heatmapLayer.setData(dataArray);
            }
        }

        function recrusiveLoop() {
            setTimeout(function(){
                if(!vm.timelapseOn)
                    return;

                vm.i++;
                if(vm.i == vm.mapProperties.data.length)
                {
                    vm.i = 0;
                    vm.recursiveDataArray = [];
                }

                vm.recursiveDataArray.push(new google.maps.LatLng(vm.mapProperties.data[vm.i].latitude, vm.mapProperties.data[vm.i].longitude));
                vm.heatmapLayer.setData(vm.recursiveDataArray);

                vm.recrusiveLoop();
            }, vm.speed * 1000);
        }
    }
})();