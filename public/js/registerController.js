(function () {
    'use strict';

    angular.module('heatin_up')
        .controller('registerController', registerController);

    registerController.$inject = ['registerService', '$location'];

    function registerController(registerService, $location) {
        var vm = this;
        vm.user = {username: '', password: '', confirmPassword: ''};
        vm.passwordError = '';
        vm.createAccount = createAccount;
        vm.cancel = cancel;

        function createAccount() {
            if(vm.user.username == '' || vm.user.password == '' || vm.user.confirmPassword == '')
                return;

            vm.passwordError = '';

            if(vm.user.password != vm.user.confirmPassword) {
                vm.passwordError = 'Passwords do not match';
                return;
            }

            registerService.createAccount(vm.user)
                .then(success)
                .catch(fail);

            function success() {
                $location.path('/login');
            }

            function fail(error) {
                console.log("Error in createAccount()");
                console.log(error);
            }
        }

        function cancel() {
            $location.path('/login');
        }
    }

})();