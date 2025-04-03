SrmOrderStagesController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.srm-order-stages', {
                url: '/srm-order-stages',
                title: 'SRM Order Stages',
                templateUrl: helper.basepath('srm_order_stages/srm_order_stages.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.add-srm-order-stages', {
                url: '/srm-order-stages/add',
                title: 'Add Order Stages',
                templateUrl: helper.basepath('add.html'),
                controller: 'SrmOrderStagesAddController'
            })
            .state('app.view-srm-order-stages', {
                url: '/srm-order-stages/:id/view',
                title: 'View ',
                templateUrl: helper.basepath('view.html'),
                /*resolve: angular.extend(helper.resolveFor('ngDialog'),{
                 tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
                 }),*/
                controller: 'SrmOrderStagesViewController'
            })
            .state('app.edit-srm-order-stages', {
                url: '/srm-order-stages/:id/edit',
                title: 'Edit Order Stages',
                templateUrl: helper.basepath('edit.html'),
                controller: 'SrmOrderStagesEditController'
            })

    }]);

myApp.controller('SrmOrderStagesController', SrmOrderStagesController);
myApp.controller('SrmOrderStagesAddController', SrmOrderStagesAddController);
myApp.controller('SrmOrderStagesViewController', SrmOrderStagesViewController);
myApp.controller('SrmOrderStagesEditController', SrmOrderStagesEditController);

function SrmOrderStagesController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
    'use strict';

    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false },
            { 'name': 'Purchase & SRM', 'url': 'app.setup', 'isActive': false },
            { 'name': 'SRM Order Stages', 'url': '#', 'isActive': false }];

    var vm = this;

    var Api = $scope.$root.setup + "srm/get-order-stages-list";
    var postData = {
        'token': $scope.$root.token,
        'all': "1"
    };

    $scope.$watch("MyCustomeFilters", function () {
        if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
            $scope.table.tableParams5.reload();
        }
    }, true);

    $scope.MyCustomeFilters = {};

    vm.tableParams5 = new ngParams({
        page: 1,            // show first page
        count: $scope.$root.pagination_limit,           // count per page
        filter: {
            name: '',
            status: ''
        }
    }, {
            total: 0,           // length of data
            counts: [],         // hide page counts control

            getData: function ($defer, params) {
                //$scope.checkData = ngDataService.getData( $defer, params, Api,$filter,$scope,postData);
                ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);
            }
        });


    $scope.$data = {};
    $scope.delete = function (id, index, $data) {
        var delUrl = $scope.$root.setup + "srm/srm-delete-order-stages";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $data.splice(index, 1);
                    }
                    else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

}

function SrmOrderStagesAddController($scope, $stateParams, $http, $state, toaster, $timeout) {

    $scope.formTitle = 'SRM Order Stages';
    $scope.btnCancelUrl = 'app.srm-order-stages';
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false },
            { 'name': 'Purchase & SRM', 'url': 'app.setup', 'isActive': false },
            { 'name': 'SRM Order Stages', 'url': 'app.srm-order-stages', 'isActive': false },
            { 'name': 'Add', 'url': '#', 'isActive': false }];

    $scope.formUrl = function () {
        return "app/views/srm_order_stages/_form.html";
    }

    $scope.rec = {};
    $scope.status = {};
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'inActive', 'value': 0 }];
    $scope.rec.status = $scope.arr_status[0];
    var postUrl = $scope.$root.setup + "srm/add-order-stages-list";


    $scope.add = function (rec) {
        rec.token = $scope.$root.token;
        // rec.stats = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;

        $http
            .post(postUrl, rec)
            .then(function (res) {


                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $timeout(function () {
                        $state.go('app.srm-order-stages');
                    }, 3000);
                }
                else
                    toaster.pop('error', 'Info', res.data.error);
            });
    }
}

function SrmOrderStagesViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
    $scope.formTitle = 'SRM Order Stages';
    $scope.btnCancelUrl = 'app.srm-order-stages';
    $scope.hideDel = false;
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': '#', 'isActive': false },
            { 'name': 'Purchase & SRM', 'url': '#', 'isActive': false },
            { 'name': 'SRM Order Stages', 'url': 'app.srm-order-stages', 'isActive': false }];

    $scope.formUrl = function () {
        return "app/views/srm_order_stages/_form.html";
    }

    $scope.gotoEdit = function () {
        $state.go("app.edit-srm-order-stages", { id: $stateParams.id });
    };


    $scope.rec = {};
    $scope.status = {};
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'inActive', 'value': 0 }];

    $scope.rec.status = 1;

    var postUrl = $scope.$root.setup + "srm/srm-get-order-stages-by-id";
    var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

    $http
        .post(postUrl, postData)
        .then(function (res) {
            $scope.rec = res.data.response;


            $.each($scope.arr_status, function (index, obj) {
                if (obj.value == res.data.response.status) {
                    $scope.rec.status = $scope.arr_status[index];

                }
            });
        });


};

function SrmOrderStagesEditController($scope, $stateParams, $http, $state, $resource, toaster, $timeout) {

    $scope.formTitle = 'SRM Order Stages';
    $scope.btnCancelUrl = 'app.srm-order-stages';
    $scope.hideDel = false;
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false },
            { 'name': 'Purchase & SRM', 'url': 'app.setup', 'isActive': false },
            { 'name': 'SRM Order Stages', 'url': 'app.srm-order-stages', 'isActive': false }];

    $scope.formUrl = function () {
        return "app/views/srm_order_stages/_form.html";
    }


    $scope.rec = {};
    $scope.status = {};
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'inActive', 'value': 0 }];

    var postUrl = $scope.$root.setup + "srm/srm-get-order-stages-by-id";
    var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

    $http
        .post(postUrl, postData)
        .then(function (res) {
            $scope.rec = res.data.response;
            $scope.rec.deletePerm = 1;


            $.each($scope.arr_status, function (index, obj) {
                if (obj.value == res.data.response.status) {
                    $scope.rec.status = $scope.arr_status[index];

                }
            });
        });


    $scope.update = function (rec) {
        if (rec.id > 0) var updateUrl = $scope.$root.setup + "srm/update-order-stages-list";

        var updateUrl = $scope.$root.setup + "srm/add-order-stages-list";
        rec.token = $scope.$root.token;
        rec.stats = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;

        $http
            .post(updateUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $timeout(function () {
                        $state.go('app.srm-order-stages');
                    }, 3000);
                }
                else
                    toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
            });
    }

}


