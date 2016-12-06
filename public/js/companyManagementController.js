(function () {
    'use strict';

    angular.module('heatin_up')
        .controller("companyManagementController", companyManagementController);

    companyManagementController.$inject = ['companyService', 'loginService', '$location'];

    function companyManagementController(companyService, loginService, $location) {
        var vm = this;
        vm.newCompanyName = "";
        vm.companies = [];
        vm.editingCompany = {};
        vm.companyMembers = [];
        vm.activate = activate;
        vm.logout = logout;
        vm.createCompany = createCompany;
        vm.removeCompany = removeCompany;
        vm.viewLocationData = viewLocationData;
        vm.setEditingCompany = setEditingCompany;
        vm.addMember = addMember;
        vm.removeMember = removeMember;

        activate();

        function activate() {
            if (!loginService.isLoggedIn())
                $location.path('/login');

            companyService.getCompaniesForOwner()
                .then(success)
                .catch(fail);

            function success(response) {
                console.log(response);
                vm.companies = response;
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

            companyService.createNewCompany(vm.newCompanyName)
                .then(success)
                .catch(fail);

            function success() {
                vm.newCompanyName = "";
                vm.activate();
            }

            function fail(error) {
                console.log(error);
            }
        }

        function removeCompany(company) {

            //TODO remove company

            function success() {
                vm.activate();
            }

            function fail(error) {
                console.log(error);
            }
        }

        function viewLocationData(company) {
            $location.path('/company_management/locations/id/' + company._id);
        }

        function setEditingCompany(company) {
            vm.editingCompany = company;
            vm.companyMembers = company.members;
        }

        function addMember() {
            if(vm.newUserName == "")
                return;

            companyService.addMemberToCompany(vm.editingCompany._id, vm.newUserName)
                .then(success)
                .catch(fail);

            function success(response) {
                vm.companyMembers.push(vm.newUserName);
                vm.newUserName = "";
            }

            function fail(error) {
                console.log(error);
            }
        }
        
        function removeMember(member) {
            //TODO Remove Member
        }
    }

})();