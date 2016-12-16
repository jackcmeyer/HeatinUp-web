(function () {
    'use strict';

    angular.module('heatin_up')
        .controller("addWatchToUserController", addWatchToUserController);

    // addWatchToUserController.$inject = [];
    
    function addWatchToUserController() {
        var vm = this;
        vm.mapProperties = {};
        vm.activate = activate;

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
            }
        }
    }

})();