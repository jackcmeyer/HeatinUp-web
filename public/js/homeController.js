(function() {
    'use strict';

    angular.module("heatin_up")
        .controller('homeController', homeController);

    homeController.$inject = ['homeService'];

    function homeController(homeService) {
        var vm = this;
        vm.mapProperties = {};
        vm.heatmapLayer = {};
        vm.activate = activate;
        vm.changeGradient = changeGradient;
        vm.changeRadius = changeRadius;
        vm.changeOpacity = changeOpacity;

        activate();

        function activate() {
            vm.mapProperties = {
                center: {
                    latitude: 37.775,
                    longitude: -122.434
                },
                zoom: 13,
                heatLayerCallback: function (layer) {
                    vm.heatmapLayer = layer;
                    vm.heatmapLayer.setData(homeService.getDataPoints());
                }
            };
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
    }

})();