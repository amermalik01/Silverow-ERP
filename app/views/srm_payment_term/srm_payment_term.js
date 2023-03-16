SrmPaymentTermsController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.srm-payment-term', {
                url: '/srm-payment-terms',
                title: 'Setup',
                templateUrl: helper.basepath('srm_payment_term/srm_payment_term.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.add-srm-payment-terms', {
                url: '/srm-payment-terms/add',
                title: 'Setup',
                templateUrl: helper.basepath('add.html'),
                controller: 'SRMPaymentTermsAddController'
            })
            .state('app.view-srm-payment-terms', {
                url: '/srm-payment-terms/:id/view',
                title: 'Setup',
                templateUrl: helper.basepath('view.html'),
                /*resolve: angular.extend(helper.resolveFor('ngDialog'),{
                 tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
                 }),*/
                controller: 'SRMPaymentTermsViewController'
            })
            .state('app.edit-srm-payment-terms', {
                url: '/srm-payment-terms/:id/edit',
                title: 'Setup',
                templateUrl: helper.basepath('edit.html'),
                controller: 'SRMPaymentTermsEditController'
            })
    }
]);

myApp.controller('SrmPaymentTermsController', SrmPaymentTermsController);
myApp.controller('SRMPaymentTermsAddController', SRMPaymentTermsAddController);
myApp.controller('SRMPaymentTermsViewController', SRMPaymentTermsViewController);
myApp.controller('SRMPaymentTermsEditController', SRMPaymentTermsEditController);

function SrmPaymentTermsController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
    'use strict';

    $scope.breadcrumbs = [{
        'name': 'Setup',
        'url': 'app.setup',
        'isActive': false,
        'tabIndex': '1'
    },
    {
        'name': 'Purchases',
        'url': 'app.setup',
        'isActive': false,
        'tabIndex': '4'
    },
    {
        'name': 'Payment Terms',
        'url': '#',
        'isActive': false
    }
    ];

    var vm = this;
    //   var Api = $scope.$root.setup+"srm/srm-payment-terms";
    var Api = $scope.$root.setup + "srm/srm-get-srm-payment-terms-list";
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
                //$scope.checkData = ngDataService.getData( $defer, params, Api,$filter,$scope,postData);
                ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);
            }
        });

    $scope.$data = {};
    $scope.delete = function (id, index, $data) {
        var delUrl = $scope.$root.setup + "srm/srm-delete-payment-term";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };
}

function SRMPaymentTermsAddController($scope, $stateParams, $http, $state, toaster, $timeout) {

    $scope.formTitle = 'SRM Payment Terms';
    $scope.btnCancelUrl = 'app.srm-payment-term';
    $scope.breadcrumbs = [{
        'name': 'Setup',
        'url': 'app.setup',
        'isActive': false,
        'tabIndex': '1'
    },
    {
        'name': 'Purchases',
        'url': 'app.setup',
        'isActive': false,
        'tabIndex': '4'
    },
    {
        'name': 'Payment Terms',
        'url': 'app.srm-payment-term',
        'isActive': false
    }
    ];
    // { 'name': 'Add', 'url': '#', 'isActive': false }];

    $scope.formUrl = function () {
        return "app/views/srm_payment_term/_form.html";
    }

    $scope.arr_status = [{
        'label': 'Active',
        'value': 1
    }, {
        'label': 'inActive',
        'value': 0
    }];

    $scope.rec = {};
    var postUrl = $scope.$root.setup + "srm/srm-add-payment-term";

    $scope.rec.status = $scope.arr_status[0];

    $scope.add = function (rec) {
        if (isNaN(rec.days)) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(546));
            return;
        }
        rec.status = $scope.arr_status[0];
        rec.token = $scope.$root.token;
        rec.stats = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;
        $http
            .post(postUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $timeout(function () {
                        $state.go('app.srm-payment-term');
                    }, 2000);
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(107));
            });
    }
}

function SRMPaymentTermsViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
    $scope.formTitle = 'SRM Payment Terms';
    $scope.btnCancelUrl = 'app.srm-payment-term';
    $scope.hideDel = false;
    $scope.breadcrumbs = [{
        'name': 'Setup',
        'url': 'app.setup',
        'isActive': false,
        'tabIndex': '1'
    },
    {
        'name': 'Purchases',
        'url': 'app.setup',
        'isActive': false,
        'tabIndex': '4'
    },
    {
        'name': 'Payment Terms',
        'url': 'app.srm-payment-term',
        'isActive': false
    }
    ];
    // { 'name': 'Detail', 'url': '#', 'isActive': false }];

    $scope.formUrl = function () {
        return "app/views/srm_payment_term/_form.html";
    }

    $scope.gotoEdit = function () {
        $state.go("app.edit-srm-payment-terms", {
            id: $stateParams.id
        });
    };


    $scope.rec = {};
    $scope.status = {};
    $scope.arr_status = [{
        'label': 'Active',
        'value': 1
    }, {
        'label': 'inActive',
        'value': 0
    }];

    var postUrl = $scope.$root.setup + "srm/srm-get-payment-term-by-id";
    var postData = {
        'token': $scope.$root.token,
        'id': $stateParams.id
    };

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
        var delUrl = $scope.$root.setup + "srm/srm-delete-payment-term";
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
                            $state.go('app.srm-payment-term');
                        }, 1000);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };
}

function SRMPaymentTermsEditController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {

    $scope.formTitle = 'SRM Payment Terms';
    $scope.btnCancelUrl = 'app.srm-payment-term';
    $scope.hideDel = false;
    $scope.breadcrumbs = [{
        'name': 'Setup',
        'url': 'app.setup',
        'isActive': false,
        'tabIndex': '1'
    },
    {
        'name': 'Purchases',
        'url': 'app.setup',
        'isActive': false,
        'tabIndex': '4'
    },
    {
        'name': 'Payment Terms',
        'url': 'app.srm-payment-term',
        'isActive': false
    }
    ];
    // { 'name': 'Edit', 'url': '#', 'isActive': false }];

    $scope.formUrl = function () {
        return "app/views/srm_payment_term/_form.html";
    }

    $scope.rec = {};
    $scope.status = {};
    $scope.arr_status = [{
        'label': 'Active',
        'value': 1
    }, {
        'label': 'inActive',
        'value': 0
    }];

    var postUrl = $scope.$root.setup + "srm/srm-get-payment-term-by-id";
    var postData = {
        'token': $scope.$root.token,
        'id': $stateParams.id
    };

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

    //	var updateUrl = $scope.$root.setup+"srm/update-payment-term";
    var updateUrl = $scope.$root.setup + "srm/srm-add-payment-term";
    $scope.update = function (rec) {
        if (isNaN(rec.days)) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(546));
            return;
        }
        rec.status = $scope.arr_status[0];
        rec.token = $scope.$root.token;
        rec.stats = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;

        $http
            .post(updateUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $timeout(function () {
                        $state.go('app.srm-payment-term');
                    }, 1000);
                } else
                    toaster.pop('error', 'Edit', res.data.error);
                //toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
            });
    }

    $scope.delete = function () {
        var delUrl = $scope.$root.setup + "srm/srm-delete-payment-term";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    'id': $stateParams.id,
                    'token': $scope.$root.token,
                    'pi_id': 11
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () {
                            $state.go('app.srm-payment-term');
                        }, 1000);
                    } else {
                        toaster.pop('error', 'Deleted', res.data.error);
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };
}