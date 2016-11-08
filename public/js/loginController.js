(function () {
    'use strict';

    angular.module('heatin_up')
        .controller('loginController', loginController);

    loginController.$inject = ['loginService', '$location'];

    function loginController(loginService, $location) {
        var vm = this;
        vm.user = {username:'', password: ''};
        vm.login = login;
        vm.register = register;

        function login() {
            if(vm.user.username == '' || vm.user.password == '')
                return;

            return loginService.login(vm.user)
                .then(success)
                .catch(fail);

            function success() {
                $location.path('/home');
            }

            function fail() {
                console.log("Error in login controller. Failed at function login...");
            }
        }

        function register() {
            $location.path('/register');
        }
    }

})();