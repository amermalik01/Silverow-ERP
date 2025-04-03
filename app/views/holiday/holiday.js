myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.holidaySettings', {
                url: '/holiday',
                title: 'Setup',
                templateUrl: helper.basepath('holiday/holiday.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: "HolidayController"
            })


    }]);


HolidayController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService"
    , "$http", "toaster", "ngDialog"];
myApp.controller('HolidayController', HolidayController);
function HolidayController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, toaster, ngDialog) {
    'use strict';

    // required for inner references
    $scope.showLoader = true;

    $scope.$root.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex': '7' },
            { 'name': 'Holiday Settings', 'url': '#', 'isActive': false }];

    $scope.holidaySetupReadonly = true;
    var Api = $scope.$root.setup + "general/company-holiday-settings";
    var postData = {
        'token': $scope.$root.token
    };

    $http
        .post(Api, postData)
        .then(function (res) {
            if (res.data.ack == true) {
             
                $scope.month = res.data.holiday_start_month;    
            }
            
                $scope.showLoader = false;
        
            
        });


    $scope.updateHolidayMonth = function(){
        
        $scope.showLoader = true;
        var Api = $scope.$root.setup + "general/update-company-holiday-settings";

        var postData = {
            token: $scope.$root.token,
            month: $scope.month
        }
        $http
            .post(Api, postData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                  
                    toaster.pop('success', 'info', $scope.$root.getErrorMessageByCode(102));
                    

                }
            });
    }
}
