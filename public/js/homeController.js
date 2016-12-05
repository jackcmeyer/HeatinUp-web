(function() {
    'use strict';

    angular.module("heatin_up")
        .controller('homeController', homeController);

    homeController.$inject = ['homeService', 'loginService', '$location'];

    function homeController(homeService, loginService, $location) {
        var vm = this;
        vm.currentlyShowing = loginService.getUsername();
        vm.userSearch = "";
        vm.allUsers = false;
        vm.showingAllUsers = false;
        vm.userFilter = false;
        vm.date = {month: "", day: "", year: ""};
        vm.dateFilter = false;
        vm.mapReady = 0;
        vm.mapProperties = {};
        vm.heatmapLayer = {};
        vm.activate = activate;
        vm.logout = logout;
        vm.toggleHeatmap = toggleHeatmap;
        vm.changeGradient = changeGradient;
        vm.changeRadius = changeRadius;
        vm.changeOpacity = changeOpacity;
        vm.filterByUsername = filterByUsername;
        vm.filterByDate = filterByDate;
        vm.resetUsers = resetUsers;
        vm.resetDates = resetDates;

        activate();

        function activate() {
            if(!loginService.isLoggedIn())
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
                    // vm.heatmapLayer.map.panTo(new google.maps.LatLng(vm.mapProperties.updatedCenter.latitude, vm.mapProperties.updatedCenter.longitude));

                    var dataArray = [];
                    for(var i = 0; i < vm.mapProperties.data.length; i++)
                    {
                        dataArray.push(new google.maps.LatLng(vm.mapProperties.data[i].latitude, vm.mapProperties.data[i].longitude));
                    }

                    vm.heatmapLayer.setData(dataArray);
                }
            };

            homeService.getMapCenter()
                .then(centerSuccess)
                .catch(fail);

            homeService.getLocationDataForUser(vm.currentlyShowing)
                .then(dataSuccess)
                .catch(fail);

            function centerSuccess(response) {
                //TODO Figure out how to pan the map to coords
                vm.mapReady++;
            }

            function dataSuccess(response) {
                vm.mapProperties.data = response;
                vm.mapReady++;
            }

            function fail(error) {
                console.log(error);
            }
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

        function filterByUsername() {
            if(!vm.allUsers && vm.userSearch == "")
                return;

            if(vm.dateFilter && !vm.allUsers) {
                if(vm.date.month.length < 2 || vm.date.day.length < 2 || vm.date.year.length < 4)
                    return;

                var date = vm.date.month + "-" + vm.date.day + "-" + vm.date.year;
                homeService.getLocationDataForUserByDate(date, vm.userSearch)
                    .then(successUser)
                    .catch(fail);
            }
            else if(vm.dateFilter && vm.allUsers) {
                if(vm.date.month.length < 2 || vm.date.day.length < 2 || vm.date.year.length < 4)
                    return;

                var date = vm.date.month + "-" + vm.date.day + "-" + vm.date.year;
                homeService.getLocationDataForAllByDate(date)
                    .then(successAll)
                    .catch(fail);
            }
            else if(!vm.dateFilter && vm.allUsers)
                homeService.getLocationDataForAll()
                    .then(successAll)
                    .catch(fail);
            else
                homeService.getLocationDataForUser(vm.userSearch)
                    .then(successUser)
                    .catch(fail);

            function successAll(response) {
                vm.currentlyShowing = "everyone";
                vm.userFilter = true;
                vm.showingAllUsers = true;

                vm.mapProperties.data = response;

                var dataArray = [];
                for(var i = 0; i < vm.mapProperties.data.length; i++)
                {
                    dataArray.push(new google.maps.LatLng(vm.mapProperties.data[i].latitude, vm.mapProperties.data[i].longitude));
                }

                vm.heatmapLayer.setData(dataArray);
            }

            function successUser(response) {
                vm.currentlyShowing = vm.userSearch;
                vm.showingAllUsers = false;
                vm.userFilter = true;

                vm.mapProperties.data = response;

                var dataArray = [];
                for(var i = 0; i < vm.mapProperties.data.length; i++)
                {
                    dataArray.push(new google.maps.LatLng(vm.mapProperties.data[i].latitude, vm.mapProperties.data[i].longitude));
                }

                vm.heatmapLayer.setData(dataArray);
            }

            function fail(error) {
                console.log(error);
            }
        }

        function filterByDate() {
            if(vm.date.month.length < 2 || vm.date.day.length < 2 || vm.date.year.length < 4)
                return;

            var date = vm.date.month + "-" + vm.date.day + "-" + vm.date.year;

            if(vm.showingAllUsers)
                homeService.getLocationDataForAllByDate(date)
                    .then(success)
                    .catch(fail);
            else
                homeService.getLocationDataForUserByDate(date, vm.currentlyShowing)
                    .then(success)
                    .catch(fail);

            function success(response) {
                vm.dateFilter = true;

                vm.mapProperties.data = response;

                var dataArray = [];
                for(var i = 0; i < vm.mapProperties.data.length; i++)
                {
                    dataArray.push(new google.maps.LatLng(vm.mapProperties.data[i].latitude, vm.mapProperties.data[i].longitude));
                }

                vm.heatmapLayer.setData(dataArray);
            }

            function fail(error) {
                console.log(error);
            }
        }

        function resetUsers() {

            if(vm.dateFilter) {
                if(vm.date.month.length < 2 || vm.date.day.length < 2 || vm.date.year.length < 4)
                    return;

                var date = vm.date.month + "-" + vm.date.day + "-" + vm.date.year;
                homeService.getLocationDataForUserByDate(date, loginService.getUsername())
                    .then(success)
                    .catch(fail);
            }
            else
                homeService.getLocationDataForUser(loginService.getUsername())
                    .then(success)
                    .catch(fail);

            function success(response) {
                vm.currentlyShowing = loginService.getUsername();
                vm.userSearch = "";
                vm.allUsers = false;
                vm.showingAllUsers = false;
                vm.userFilter = false;

                vm.mapProperties.data = response;

                var dataArray = [];
                for(var i = 0; i < vm.mapProperties.data.length; i++)
                {
                    dataArray.push(new google.maps.LatLng(vm.mapProperties.data[i].latitude, vm.mapProperties.data[i].longitude));
                }

                vm.heatmapLayer.setData(dataArray);
            }

            function fail(error) {
                console.log(error);
            }
        }

        function resetDates() {

            if(vm.showingAllUsers)
            {
                homeService.getLocationDataForAll()
                    .then(success)
                    .catch(fail);
            }
            else
            {
                homeService.getLocationDataForUser(vm.currentlyShowing)
                    .then(success)
                    .catch(fail);
            }

            function success(response) {
                vm.dateFilter = false;
                vm.date.month = "";
                vm.date.day = "";
                vm.date.year = "";

                vm.mapProperties.data = response;

                var dataArray = [];
                for(var i = 0; i < vm.mapProperties.data.length; i++)
                {
                    dataArray.push(new google.maps.LatLng(vm.mapProperties.data[i].latitude, vm.mapProperties.data[i].longitude));
                }

                vm.heatmapLayer.setData(dataArray);
            }

            function fail(error) {
                console.log(error);
            }
        }
    }

})();