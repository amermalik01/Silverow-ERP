
PricingStrategyController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout",
    "ngTableDataService", "$http", "ngDialog", "toaster"];

myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
                .state('app.pricing-strategy', {
                    url: '/pricing-strategy',
                    title: 'Pricing Strategy',
                    templateUrl: helper.basepath('pricing_strategy/pricing_strategy.html'),
                    resolve: helper.resolveFor('ngTable', "ngDialog")
                })
    }]);

myApp.controller('PricingStrategyController', PricingStrategyController);

function PricingStrategyController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
    'use strict';

    $scope.class = 'inline_block';
    $scope.breadcrumbs =
            [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
                {'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1'},
                {'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3'},
                {'name': 'Promotional Pricing Strategy', 'url': '#', 'isActive': false}];

    $scope.rec = {};
    $scope.SelectedStrategies = {};
    $scope.pricing_strategy_types1 = {};
    $scope.pricing_strategy_types2 = {};
    var custPodTypeUrl = $scope.$root.setup + "general/all-customer-product-type";
    var getPricingStrategyUrl = $scope.$root.setup + "general/get-pricing-strategy";
    var getPricingStrategyTypesUrl = $scope.$root.setup + "general/pricing-strategy-types";
    $http
            .post(custPodTypeUrl, {'token': $scope.$root.token})
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.arr_cust_prod_type = res.data.response;
                }
            });

    $http
            .post(getPricingStrategyUrl, {'token': $scope.$root.token})
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.SelectedStrategies = res.data.response;
                } else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });
            
            $http
            .post(getPricingStrategyTypesUrl, {'token': $scope.$root.token})
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.pricing_strategy_types1 = res.data.response[1];
                    $scope.pricing_strategy_types2 = res.data.response[2];
                } else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });

    $scope.showVolumePrice = false;
    $scope.showVolumePriceTypes = function () {
        $scope.showVolumePrice = true;
    };

    $scope.hideVolumePriceTypes = function () {
        $scope.showVolumePrice = false;
    };

    $scope.addStrategy = function (rec) {
        var postUrl = $scope.$root.setup + "general/add-pricing-strategy";
        rec.token = $scope.$root.token;
        $http
                .post(postUrl, rec)
                .then(function (ress) {
                    if (ress.data.ack == 1) {
                        toaster.pop('success', 'Update', $scope.$root.getErrorMessageByCode(102));
                    }else if(ress.data.ack == 2){
                        toaster.pop('success', 'Add', 'Record Added.');
                    } else {
                        toaster.pop('error', 'Add', 'Record Not Added');
                    }
                });
    };


    /*
     var vm = this;
     var Api = $scope.$root.setup + "general/modules-codes";
     var postData = {
     'token': $scope.$root.token,
     'all': "1"
     };
     
     $scope.$watch("MyCustomeFilters", function () {
     if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
     $scope.table.tableParams5.reload();
     }
     }, true);
     $scope.MyCustomeFilters = {
     }
     
     vm.tableParams5 = new ngParams({
     page: 1, // show first page
     count: $scope.$root.pagination_limit, // count per page
     filter: {
     name: '',
     age: ''
     }
     }, {
     total: 0, // length of data
     counts: [], // hide page counts control
     
     getData: function ($defer, params) {
     $scope.checkData = ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);
     }
     });
     
     
     $scope.delete = function (id, index, arr_data) {
     var delUrl = $scope.$root.setup + "general/delete-module-code";
     ngDialog.openConfirm({
     template: 'modalDeleteDialogId',
     className: 'ngdialog-theme-default-custom'
     }).then(function (value) {
     $http
     .post(delUrl, {id: id, 'token': $scope.$root.token})
     .then(function (res) {
     
     if (res.data.ack == true) {
     toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
     arr_data.splice(index, 1);
     // $timeout(function(){ $state.go('app.item'); }, 3000);
     } else
     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(108));
     
     });
     }, function (reason) {
     // console.log('Modal promise rejected. Reason: ', reason);
     });
     
     };
     */


}