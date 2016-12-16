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
        vm.error = "";
        vm.activate = activate;
        vm.logout = logout;
        vm.createCompany = createCompany;
        vm.removeCompany = removeCompany;
        vm.viewLocationData = viewLocationData;
        vm.setEditingCompany = setEditingCompany;
        vm.addMember = addMember;
        vm.watchUser = watchUser;
        vm.removeMember = removeMember;

        activate();

        function activate() {
            if (!loginService.isLoggedIn())
                $location.path('/login');

            companyService.getCompaniesForOwner()
                .then(success)
                .catch(fail);

            function success(response) {
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

            companyService.deleteCompany(company._id)
                .then(success)
                .catch(fail);

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

            vm.error = "";

            companyService.addMemberToCompany(vm.editingCompany._id, vm.newUserName)
                .then(success);

            function success(response) {
                if(response.data && response.data.message && response.data.message == "Username does not exist")
                {
                    vm.error = response.data.message;
                    return;
                }

                vm.companyMembers.push(vm.newUserName);
                vm.newUserName = "";
            }
        }

        function watchUser(member) {
            $(".modal-backdrop").hide();
            $location.path('/company_management/add_watch/username/' + member);
        }
        
        function removeMember(member) {
            companyService.removeMemberFromCompany(vm.editingCompany._id, member)
                .then(success)
                .catch(fail);

            function success(response) {
                if(response.message == "success")
                {
                    var index = vm.companyMembers.indexOf(member);

                    if(index > -1)
                        vm.companyMembers.splice(index, 1);
                }
            }

            function fail(error) {
                console.log(error);
            }
        }
    }

})();