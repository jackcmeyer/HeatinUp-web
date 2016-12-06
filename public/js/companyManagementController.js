(function () {
    'use strict';

    angular.module('heatin_up')
        .controller("companyManagementController", companyManagementController);

    companyManagementController.$inject = ['loginService', '$location'];

    function companyManagementController(loginService, $location) {
        var vm = this;
        vm.newCompanyName = "";
        vm.companies = ["test", "test2", "test3"];
        vm.editingCompany = {};
        vm.companyMembers = ["Anthony", "Jack", "Nischay", "Ian"];
        vm.activate = activate;
        vm.logout = logout;
        vm.createCompany = createCompany;
        vm.viewLocationData = viewLocationData;
        vm.setEditingCompany = setEditingCompany;
        vm.addMember = addMember;
        vm.removeMember = removeMember;

        activate();

        function activate() {
            if (!loginService.isLoggedIn())
                $location.path('/login');

            //TODO get companies

            function success(response) {
                //TODO Set Companies
            }

            function fail(error) {
                console.log(error);
            }
        }

        function logout() {
            loginService.logout();
            $location.path('/login');
        }

        function createCompany() {
            if(vm.newCompanyName == "")
                return;

            //TODO call create company

            function success(response) {
                vm.activate();
            }

            function fail(error) {
                console.log(error);
            }
        }

        function viewLocationData(company) {
            //TODO GetCompanyId and switch views
        }

        function setEditingCompany(company) {
            vm.editingCompany = company;

            //TODO Get company members
        }

        function addMember() {
            if(vm.newUserName == "")
                return;

            //TODO Add Member
            function success(response) {
                vm.newUserName = "";
            }
        }
        
        function removeMember(member) {
            //TODO Remove Member
        }
    }

})();