(function () {
    'use strict';

    angular.module('heatin_up')
        .controller("addWatchToUserController", addWatchToUserController);

    addWatchToUserController.$inject = ['addWatchToUserService', '$stateParams'];
    
    function addWatchToUserController(addWatchToUserService, $stateParams) {
        var vm = this;
        vm.error = "";
        vm.userCords = {nw: {}, ne: {}, sw: {}, se: {}};
        vm.mapProperties = {};
        vm.activate = activate;
        vm.addWatch = addWatch;

        activate();

        function activate() {
            vm.mapProperties = {
                center: {
                    latitude: 42.03,
                    longitude: -93.644
                },
                bounds: {
                    sw: {
                        latitude: 42.00631247184321,
                        longitude: -93.67253417968743
                    },
                    ne: {
                        latitude: 42.043044117482594,
                        longitude: -93.6204833984375
                    }
                },
                zoom: 13,
                visible: true,
                clickable: true,
                draggable: true,
                editable: true
            };

            if(!$stateParams.username)
                return;

            addWatchToUserService.getUser($stateParams.username)
                .then(success)
                .catch(fail);

            function success(response) {
                if(!response.topLeft)
                    return;

                vm.mapProperties.bounds.ne = response.topRight;
                vm.mapProperties.bounds.sw = response.bottomLeft;

                vm.userCords.nw.latitude = response.topLeft.latitude;
                vm.userCords.nw.longitude = response.topLeft.longitude;
                vm.userCords.ne.latitude = response.topRight.latitude;
                vm.userCords.ne.longitude = response.topRight.longitude;
                vm.userCords.sw.latitude = response.bottomLeft.latitude;
                vm.userCords.sw.longitude = response.bottomLeft.longitude;
                vm.userCords.se.latitude = response.bottomRight.latitude;
                vm.userCords.se.longitude = response.bottomRight.longitude;
            }

            function fail(error) {
                console.log(error);
            }
        }
        
        function addWatch() {
            if(!$stateParams.username)
                return;

            vm.error = "Working...";

            addWatchToUserService.addUserWatch($stateParams.username, vm.mapProperties.bounds.sw, vm.mapProperties.bounds.ne)
                .then(success)
                .catch(fail);

            function success(response) {
                vm.error = "";

                if(!response.topLeft)
                    return;

                vm.userCords.nw.latitude = response.topLeft.latitude;
                vm.userCords.nw.longitude = response.topLeft.longitude;
                vm.userCords.ne.latitude = response.topRight.latitude;
                vm.userCords.ne.longitude = response.topRight.longitude;
                vm.userCords.sw.latitude = response.bottomLeft.latitude;
                vm.userCords.sw.longitude = response.bottomLeft.longitude;
                vm.userCords.se.latitude = response.bottomRight.latitude;
                vm.userCords.se.longitude = response.bottomRight.longitude;
            }

            function fail(error) {
                console.log(error);
            }
        }
    }

})();