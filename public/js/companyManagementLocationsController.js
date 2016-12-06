(function () {
    'use strict';

    angular.module('heatin_up')
        .controller("companyManagementLocationsController", companyManagementLocationsController);

    companyManagementLocationsController.$inject = ['companyService', 'loginService', '$location'];
    
    function companyManagementLocationsController(companyService, loginService, $location) {
        var vm = this;
        vm.activate = activate;
        vm.logout = logout;

        activate();

        function activate() {
            if (!loginService.isLoggedIn())
                $location.path('/login');
        }

        function logout() {
            loginService.logout();
            $location.path('/login');
        }
    }
})();