DebitNoteStagesController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.debit-note-order-stages', {
                url: '/debit-note-order-stages',
                title: 'Setup',
                templateUrl: helper.basepath('debitNoteStages/debitNoteStages.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.add-debit-note-order-stages', {
                url: '/debit-note-order-stages/add',
                title: 'Setup',
                templateUrl: helper.basepath('add.html'),
                controller: 'DebitNoteStagesAddController'
            })
            .state('app.view-debit-note-order-stages', {
                url: '/debit-note-order-stages/:id/view',
                title: 'Setup',
                templateUrl: helper.basepath('view.html'),
                controller: 'DebitNoteStagesViewController'
            })
            .state('app.edit-debit-note-order-stages', {
                url: '/debit-note-order-stages/:id/edit',
                title: 'Setup',
                templateUrl: helper.basepath('edit.html'),
                controller: 'DebitNoteStagesEditController'
            })
    }]);

myApp.controller('DebitNoteStagesController', DebitNoteStagesController);
myApp.controller('DebitNoteStagesAddController', DebitNoteStagesAddController);
myApp.controller('DebitNoteStagesViewController', DebitNoteStagesViewController);
myApp.controller('DebitNoteStagesEditController', DebitNoteStagesEditController);

function DebitNoteStagesController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
    'use strict';

    $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
    { 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
    { 'name': 'Debit Note Stages', 'url': '#', 'isActive': false }];

    var vm = this;

    var Api = $scope.$root.setup + "crm/get-order-stages-list";
    var postData = {
        'token': $scope.$root.token,
        'type': 3,
        'all': "1"
    };

    /* $scope.$watch("MyCustomeFilters", function () {
        if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
            $scope.table.tableParams5.reload();
        }
    }, true); */

    $scope.MyCustomeFilters = {};

    vm.tableParams5 = new ngParams({
        page: 1,// show first page
        count: $scope.$root.pagination_limit, // count per page
        filter: {
            name: '',
            status: ''
        }
    }, {
            total: 0,   // length of data
            counts: [], // hide page counts control

            getData: function ($defer, params) {
                //$scope.checkData = ngDataService.getData( $defer, params, Api,$filter,$scope,postData);
                ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);
            }
        });

    $scope.$data = {};
    $scope.columns = [];
    $scope.searchKeyword = {};
    
    $http
        .post(Api, postData)
        .then(function (res) {
            if (res.data.ack == true) {

                angular.forEach(res.data.response[0], function (val, index) {
                    $scope.columns.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                });
                $scope.data = res.data.response;
            }
        });

    var move = function (origin, destination) {
        var temp = $scope.data[destination];

        $scope.data[destination] = $scope.data[origin];
        $scope.data[origin] = temp;

        var sortUrl = $scope.$root.setup + "crm/sort-order-stages";
        $http
            .post(sortUrl, { 'record': $scope.data, 'type': 3, 'token': $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
                    $timeout(function () {
                        // $state.go('app.debit-note-order-stages');
                        $scope.table.tableParams5.reload();
                    }, 1000);
                }
                else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(336));
            });
    };

    $scope.moveUp = function (index) {
        move(index, index - 1);
    };

    $scope.moveDown = function (index) {
        move(index, index + 1);
    };
}

function DebitNoteStagesAddController($scope, $stateParams, $http, $timeout, $state, toaster) {

    $scope.formTitle = 'Debit Note Stages';
    $scope.btnCancelUrl = 'app.debit-note-order-stages';

    $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
    { 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
    { 'name': 'Debit Note Stages', 'url': 'app.debit-note-order-stages', 'isActive': false }];
    // { 'name': 'Add', 'url': '#', 'isActive': false }];

    $scope.formUrl = function () {
        return "app/views/debitNoteStages/_form.html";
    }

    $scope.rec = {};
    $scope.status = {};
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];
    $scope.rec.status = $scope.arr_status[0];


    var postUrl = $scope.$root.setup + "crm/add-order-stages-list";

    $scope.add = function (rec) {
        rec.token = $scope.$root.token;
        rec.stats = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;
        rec.type = 3;

        $http
            .post(postUrl, rec)
            .then(function (res) {

                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $timeout(function () {
                        $state.go('app.debit-note-order-stages');
                    }, 1000);
                }
                else
                    toaster.pop('error', 'Info', res.data.error);
            });
    }
}

function DebitNoteStagesViewController($scope, $stateParams, $http, $state, $timeout, $resource, ngDialog, toaster) {
    $scope.formTitle = 'Debit Note Stages';
    $scope.btnCancelUrl = 'app.debit-note-order-stages';
    $scope.hideDel = false;

    $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
    { 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
    { 'name': 'Debit Note Stages', 'url': 'app.debit-note-order-stages', 'isActive': false }];
    // { 'name': 'Detail', 'url': '#', 'isActive': false }];

    $scope.formUrl = function () {
        return "app/views/debitNoteStages/_form.html";
    }

    $scope.gotoEdit = function () {
        $state.go("app.edit-debit-note-order-stages", { id: $stateParams.id });
    }

    $scope.rec = {};
    $scope.status = {};
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

    $scope.rec.status = 1;

    var postUrl = $scope.$root.setup + "crm/crm-get-order-stages-by-id";
    var postData = { 'token': $scope.$root.token, 'type': 3, 'id': $stateParams.id };

    $http
        .post(postUrl, postData)
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.rec = res.data.response;

                angular.forEach($scope.arr_status, function (obj) {
                    if (obj.value == res.data.response.status)
                        $scope.rec.status = obj;
                });
            }
        });

    $scope.delete = function () {
        var delUrl = $scope.$root.setup + "crm/crm-delete-order-stages";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { 'id': $stateParams.id, 'token': $scope.$root.token, 'type': 3  })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () {
                            $state.go('app.debit-note-order-stages');
                        }, 1000);
                    }
                    else
                        toaster.pop('error', 'Deleted', res.data.error);
                        // toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }
}

function DebitNoteStagesEditController($scope, $stateParams, $http, $state, $resource, $timeout, ngDialog, toaster) {

    $scope.formTitle = 'Debit Note Stages';
    $scope.btnCancelUrl = 'app.debit-note-order-stages';
    $scope.hideDel = false;

    $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
    { 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
    { 'name': 'Debit Note Stages', 'url': 'app.debit-note-order-stages', 'isActive': false }];
    // { 'name': 'Edit', 'url': '#', 'isActive': false }];

    $scope.formUrl = function () {
        return "app/views/debitNoteStages/_form.html";
    }

    $scope.rec = {};
    $scope.status = {};
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

    var postUrl = $scope.$root.setup + "crm/crm-get-order-stages-by-id";
    var postData = { 'token': $scope.$root.token, 'type': 3, 'id': $stateParams.id };

    $http
        .post(postUrl, postData)
        .then(function (res) {

            if (res.data.ack == true) {
                $scope.rec = res.data.response;
                $scope.rec.deletePerm = 1;

                angular.forEach($scope.arr_status, function (obj) {
                    if (obj.value == res.data.response.status)
                        $scope.rec.status = obj;
                });
            }
        });

    $scope.update = function (rec) {
        if (rec.id > 0)
            var updateUrl = $scope.$root.setup + "crm/update-order-stages-list";

        var updateUrl = $scope.$root.setup + "crm/add-order-stages-list";
        rec.token = $scope.$root.token;
        rec.stats = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;
        rec.type = 3;

        $http
            .post(updateUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $timeout(function () {
                        $state.go('app.debit-note-order-stages');
                    }, 1000);
                }
                else
                    toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
            });
    }

    $scope.delete = function () {
        if ($scope.rec.rank == 1) {
            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(109, ['First Stage']));
            return;
        }
        var delUrl = $scope.$root.setup + "crm/crm-delete-order-stages";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { 'id': $stateParams.id, 'token': $scope.$root.token, 'type': 3 })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () {
                            $state.go('app.debit-note-order-stages');
                        }, 1000);
                    }
                    else
                        toaster.pop('error', 'Deleted', res.data.error);
                        // toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }
}