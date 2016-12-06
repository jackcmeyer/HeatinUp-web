(function () {
    'use strict';

    angular.module("heatin_up")
        .factory('companyService', companyService);

    companyService.$inject = ['$http', 'loginService'];

    function companyService($http, loginService) {
        return {
            createNewCompany: createNewCompany,
            addMemberToCompany: addMemberToCompany,
            getCompaniesForOwner: getCompaniesForOwner,
            getAllLocationDataForCompany: getAllLocationDataForCompany,
            getAllLocationDataForCompanyByDate: getAllLocationDataForCompanyByDate
        };

        //Create a new company
        function createNewCompany(givenCompanyName){
            return $http({
                method: 'post',
                url: '/api/createCompany',
                data:{
                    name: givenCompanyName,
                    owner: loginService.getUsername()
                }
            })
                .then(success)
                .catch(fail);

            function success(response){
                return response.data;
            }
            function fail(error){
                console.log("Error in createNewCompany()");
                console.log(error);
            }
        }

        //Delete a company given a companyId
        function deleteCompany(givenCompanyID){
            return $http({
                method: 'post',
                url: '/api/deleteCompany',
                data:{
                    companyID: givenCompanyID,
                }
            })
                .then(success)
                .catch(fail);

            function success(response){
                return response.data;
            }
            function fail(error){
                console.log("Error in deleteCompany()");
                console.log(error);
            }
        }

        //Add a member to the company via username
        function addMemberToCompany(givenCompanyId, givenUsername){
            return $http({
                method: 'post',
                url: '/api/addMemberToCompany',
                data:{
                    companyID: givenCompanyId,
                    username: givenUsername
                }
            })
                .then(success)
                .catch(fail);

            function success(response){
                return response.data;
            }
            function fail(error){
                return error;
            }
        }

        //Gets company based on current user
        function getCompaniesForOwner() {
            return $http({
                method: 'POST',
                url: '/api/getCompaniesForOwner',
                data: {
                    username: loginService.getUsername()
                }
            })
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                console.log("Error in getCompaniesForOwner()");
                console.log(error);
            }
        }

        //Get all location data for a company, by companyId
        function getAllLocationDataForCompany(givenCompanyID) {
            return $http({
                method: 'POST',
                url: '/api/getAllLocationDataForCompany',
                data: {
                    companyID: givenCompanyID
                }
            })
                .then(success)
                .catch(fail);

            //Return GPS data on success
            function success(response) {
                var returnVal = [];

                for (var i = 0; i < response.data.length; i++) {
                    returnVal.push({latitude: response.data[i].latitude, longitude: response.data[i].longitude});
                }

                return returnVal;
            }

            function fail(error) {
                console.log("Error in getAllLocationDataForCompany()");
                console.log(error);
            }
        }

        //Get all the location data for a company, with a date filter, given a company id and a date
        function getAllLocationDataForCompanyByDate(companyId, timeFilter) {
            return $http({
                method: 'POST',
                url: '/api/getAllLocationDataForCompanyByDate',
                data: {
                    companyID: companyId,
                    time: timeFilter
                }
            })
                .then(success)
                .catch(fail);

            //Return GPS data on success
            function success(response) {
                var returnVal = [];

                for (var i = 0; i < response.data.length; i++) {
                    returnVal.push({latitude: response.data[i].latitude, longitude: response.data[i].longitude});
                }

                return returnVal;
            }

            function fail(error) {
                console.log("Error in getAllLocationDataForCompanyByDate()");
                console.log(error);
            }
        }
    }

})();