SellingGroupController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.sellinggroup', {
                url: '/sellinggroup',
                title: 'Setup',
                templateUrl: helper.basepath('salling_group/selling_group.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.add-selling-group', {
                url: '/sellinggroup/add',
                title: 'Setup',
                templateUrl: helper.basepath('add.html'),
                controller: 'SellingGroupAddController'
            })
            .state('app.view-selling-group', {
                url: '/sellinggroup/:id/view',
                title: 'Setup',
                templateUrl: helper.basepath('view.html'),
                resolve: angular.extend(helper.resolveFor('ngDialog'), {
                    tpl: function () {
                        return { path: helper.basepath('ngdialog-template.html') };
                    }
                }),
                controller: 'SellingGroupViewController'
            })
            .state('app.edit-selling-group', {
                url: '/sellinggroup/:id/edit',
                title: 'Setup',
                templateUrl: helper.basepath('edit.html'),
                controller: 'SellingGroupEditController'
            })

    }]);

myApp.controller('SellingGroupController', SellingGroupController);
myApp.controller('SellingGroupAddController', SellingGroupAddController);
myApp.controller('SellingGroupViewController', SellingGroupViewController);
myApp.controller('SellingGroupEditController', SellingGroupEditController);

function SellingGroupController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
    'use strict';

    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
            { 'name': 'Selling Groups', 'url': '#', 'isActive': false }];

    var vm = this;
    var Api = $scope.$root.setup + "ledger-group/srmpredefines";
    var postData = {
        'token': $scope.$root.token,
        'all': "1",
        'column': 'type',
        'value': 'BUYING_GROUP'
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
                ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);

            }
        });


    $scope.delete = function (id, rec, arr_data) {
        var delUrl = $scope.$root.setup + "ledger-group/delete-srmpredefine";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token, 'type': 'BUYING_GROUP' })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        /*var index = arr_data.indexOf(rec.id);
                         arr_data.splice(index, 1);*/
                        $timeout(function () {
                            $state.go('app.sellinggroup');
                        }, 3000);
                    }
                    else {
                        toaster.pop('error', 'Error', res.data.error);
                        // toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

}

function SellingGroupAddController($scope, $stateParams, $http, $state, toaster, $timeout, $rootScope) {

    $scope.formTitle = 'Selling Group';
    $scope.btnCancelUrl = 'app.sellinggroup';

    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
            { 'name': 'Selling Groups', 'url': 'app.sellinggroup', 'isActive': false }];
    // {'name': 'Add', 'url': '#', 'isActive': false}];

    $scope.formUrl = function () {
        return "app/views/salling_group/_form.html";
    }

    $scope.rec = {};
    $scope.predefine_types = {};
    var postUrl = $scope.$root.setup + "ledger-group/add-srmpredefine";

    $scope.add = function (rec) {
        rec.token = $scope.$root.token;
        rec.type = 'BUYING_GROUP';
        $http
            .post(postUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $rootScope.get_global_data(1);
                    $timeout(function () {
                        $state.go('app.sellinggroup');
                    }, 1000);
                }
                else
                    toaster.pop('error', 'Add', res.data.error);
                // toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
            });
    }
}

function SellingGroupViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
    $scope.formTitle = 'Selling Group';
    $scope.btnCancelUrl = 'app.sellinggroup';
    $scope.hideDel = false;
    $scope.showLoader = true;
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
            { 'name': 'Selling Groups', 'url': 'app.sellinggroup', 'isActive': false }];
    // {'name': 'Detail', 'url': '#', 'isActive': false}];


    $scope.gotoEdit = function () {
        $state.go("app.edit-selling-group", { id: $stateParams.id });
    };


    $scope.rec = {};
    $scope.predefine_types = {};
    var postUrl = $scope.$root.setup + "ledger-group/get-srmpredefine";
    var postData = { 'token': $scope.$root.token, 'id': $stateParams.id, 'type': 'BUYING_GROUP' };

    $timeout(function () {
        $http
            .post(postUrl, postData)
            .then(function (res) {
                $scope.rec = res.data.response;
            });
        $scope.formUrl = function () {
            return "app/views/salling_group/_form.html";
        }
        $scope.showLoader = false;
    }, 3000);

    $scope.delete = function (id, rec, arr_data) {
        var delUrl = $scope.$root.setup + "ledger-group/delete-srmpredefine";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token, 'type': 'BUYING_GROUP' })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        /*var index = arr_data.indexOf(rec.id);
                         arr_data.splice(index, 1);*/
                        $timeout(function () {
                            $state.go('app.sellinggroup');
                        }, 3000);
                    }
                    else {
                        toaster.pop('error', 'Error', res.data.error);
                        // toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };


};

function SellingGroupEditController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout, $rootScope) {

    $scope.formTitle = 'Selling Group';
    $scope.btnCancelUrl = 'app.sellinggroup';
    $scope.hideDel = false;
    $scope.showLoader = true;
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
            { 'name': 'Selling Groups', 'url': 'app.sellinggroup', 'isActive': false }];
    // {'name': 'Edit', 'url': '#', 'isActive': false}];


    $scope.rec = {};
    $scope.predefine_types = {};
    var postUrl = $scope.$root.setup + "ledger-group/get-srmpredefine";
    var updateUrl = $scope.$root.setup + "ledger-group/update-srmpredefine";
    var postData = { 'token': $scope.$root.token, 'id': $stateParams.id, 'type': 'BUYING_GROUP' };

    // $timeout(function () {
    $http
        .post(postUrl, postData)
        .then(function (res) {
            $scope.rec = res.data.response;
            $scope.rec.deletePerm = 1;
        });
    $scope.formUrl = function () {
        return "app/views/salling_group/_form.html";
    }
    $scope.showLoader = false;
    // }, 3000);

    $scope.update = function (rec) {
        rec.token = $scope.$root.token;
        rec.type = 'BUYING_GROUP';
        $http
            .post(updateUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $rootScope.get_global_data(1);
                    $timeout(function () {
                        $state.go('app.sellinggroup');
                    }, 1000);
                }
                else {
                    toaster.pop('success', 'Edit', res.data.error);

                    $timeout(function () {
                        $state.go('app.sellinggroup');
                    }, 1000);
                }
            });
    }

    $scope.delete = function (id, rec, arr_data) {
        var delUrl = $scope.$root.setup + "ledger-group/delete-srmpredefine";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token, 'type': 'SELLING_GROUP' })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        /*var index = arr_data.indexOf(rec.id);
                         arr_data.splice(index, 1);*/
                        $timeout(function () {
                            $state.go('app.sellinggroup');
                        }, 3000);
                    }
                    else {
                        toaster.pop('error', 'Error', res.data.error);
                        // toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };
}