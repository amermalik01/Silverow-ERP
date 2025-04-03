SRMPaymentMethodsController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.srm-payment-method', {
                url: '/srm-payment-methods',
                title: 'Setup',
                templateUrl: helper.basepath('srm_payment_method/srm_payment_method.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.add-srm-payment-method', {
                url: '/srm-payment-methods/add',
                title: 'Setup',
                templateUrl: helper.basepath('add.html'),
                controller: 'SRMPaymentMethodsAddController'
            })
            .state('app.view-srm-payment-methods', {
                url: '/srm-payment-methods/:id/view',
                title: 'Setup',
                templateUrl: helper.basepath('view.html'),
                /*	resolve: angular.extend(helper.resolveFor('ngDialog'),{
                 tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
                 }),*/
                controller: 'SRMPaymentMethodsViewController'
            })
            .state('app.edit-srm-payment-method', {
                url: '/srm-payment-methods/:id/edit',
                title: 'Setup',
                templateUrl: helper.basepath('edit.html'),
                controller: 'SRMPaymentMethodsEditController'
            })
    }]);

myApp.controller('SRMPaymentMethodsController', SRMPaymentMethodsController);
myApp.controller('SRMPaymentMethodsAddController', SRMPaymentMethodsAddController);
myApp.controller('SRMPaymentMethodsViewController', SRMPaymentMethodsViewController);
myApp.controller('SRMPaymentMethodsEditController', SRMPaymentMethodsEditController);

function SRMPaymentMethodsController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
    'use strict';

    $scope.breadcrumbs =
        [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        { 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
        { 'name': 'Payment Methods', 'url': '#', 'isActive': false }];

    var vm = this;
    var Api = $scope.$root.setup + "srm/srm-get-payment-methods-list";
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
            age: ''
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
    $scope.delete = function () {
        var delUrl = $scope.$root.setup + "srm/srm-delete-payment-method";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { 'id': $stateParams.id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () {
                            $state.go('app.srm-payment-method');
                        }, 1000);
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

function SRMPaymentMethodsAddController($scope, $stateParams, $http, $state, toaster, $timeout) {

    $scope.formTitle = 'SRM Payment Methods';
    $scope.btnCancelUrl = 'app.srm-payment-method';
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},4
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
            { 'name': 'Payment Methods', 'url': 'app.srm-payment-method', 'isActive': false }];
    // { 'name': 'Add', 'url': '#', 'isActive': false }];

    $scope.formUrl = function () {
        return "app/views/srm_payment_method/_form.html";
    }

    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'inActive', 'value': 0 }];

    $scope.rec = {};
    $scope.rec.status = $scope.arr_status[0];
    var postUrl = $scope.$root.setup + "srm/srm-add-payment-method";

    $scope.add = function (rec) {
        rec.status = $scope.arr_status[0];
        rec.token = $scope.$root.token;
        rec.stats = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;
        $http
            .post(postUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $timeout(function () {
                        $state.go('app.srm-payment-method');
                    }, 3000);
                }
                else
                    toaster.pop('error', 'Info', res.data.error);
            });
    }
}

function SRMPaymentMethodsViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
    $scope.formTitle = 'SRM Payment Methods';
    $scope.btnCancelUrl = 'app.srm-payment-method';
    $scope.hideDel = false;
    $scope.breadcrumbs =
        [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        { 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
        { 'name': 'Payment Methods', 'url': 'app.srm-payment-method', 'isActive': false }];
    // { 'name': 'Detail', 'url': '#', 'isActive': false }];

    $scope.formUrl = function () {
        return "app/views/srm_payment_method/_form.html";
    }

    $scope.gotoEdit = function () {
        $state.go("app.edit-srm-payment-method", { id: $stateParams.id });
    }

    $scope.rec = {};
    $scope.status = {};
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'inActive', 'value': 0 }];

    var postUrl = $scope.$root.setup + "srm/srm-get-payment-method-by-id";
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
    $scope.delete = function () {
        var delUrl = $scope.$root.setup + "srm/srm-delete-payment-method";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    'id': $stateParams.id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () {
                            $state.go('app.srm-payment-method');
                        }, 1000);
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
// SRMPaymentMethodsEditController.$inject = ["$scope", "$stateParams", "$http", "$state", "$resource", "ngDialog", "toaster", "$timeout"];

function SRMPaymentMethodsEditController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {

    $scope.formTitle = 'SRM Payment Methods';
    $scope.btnCancelUrl = 'app.srm-payment-method';
    $scope.hideDel = false;

    $scope.breadcrumbs =
        [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        { 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
        { 'name': 'Payment Methods', 'url': 'app.srm-payment-method', 'isActive': false }];
    // { 'name': 'Edit', 'url': '#', 'isActive': false }];

    $scope.formUrl = function () {
        return "app/views/srm_payment_method/_form.html";
    }

    $scope.rec = {};
    $scope.status = {};
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'inActive', 'value': 0 }];

    var postUrl = $scope.$root.setup + "srm/srm-get-payment-method-by-id";
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

    //var updateUrl = $scope.$root.setup+"srm/srm-update-payment-method";

    var updateUrl = $scope.$root.setup + "srm/srm-add-payment-method";
    $scope.update = function (rec) {
        rec.status = $scope.arr_status[0];
        rec.token = $scope.$root.token;
        rec.stats = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;
        $http
            .post(updateUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $timeout(function () {
                        $state.go('app.srm-payment-method');
                    }, 3000);
                }
                else
                    toaster.pop('error', 'Edit', res.data.error);
                // toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
            });
    }

    $scope.delete = function () {
        var delUrl = $scope.$root.setup + "srm/srm-delete-payment-method";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    'id': $stateParams.id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', res.data.success);
                        $timeout(function () {
                            $state.go('app.srm-payment-method');
                        }, 1000);
                    }
                    else {
                        toaster.pop('error', 'Deleted', res.data.error);
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };
}