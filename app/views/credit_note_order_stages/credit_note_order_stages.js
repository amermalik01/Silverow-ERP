CreditNoteOrderStagesController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.credit-note-order-stages', {
                url: '/credit-note-order-stages',
                title: 'Setup',
                templateUrl: helper.basepath('credit_note_order_stages/credit_note_order_stages.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.add-credit-note-order-stages', {
                url: '/credit-note-order-stages/add',
                title: 'Setup',
                templateUrl: helper.basepath('add.html'),
                controller: 'CreditNoteOrderStagesAddController'
            })
            .state('app.view-credit-note-order-stages', {
                url: '/credit-note-order-stages/:id/view',
                title: 'Setup',
                templateUrl: helper.basepath('view.html'),
                /*resolve: angular.extend(helper.resolveFor('ngDialog'),{
                 tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
                 }),*/
                controller: 'CreditNoteOrderStagesViewController'
            })
            .state('app.edit-credit-note-order-stages', {
                url: '/credit-note-order-stages/:id/edit',
                title: 'Setup',
                templateUrl: helper.basepath('edit.html'),
                controller: 'CreditNoteOrderStagesEditController'
            })

    }]);

myApp.controller('CreditNoteOrderStagesController', CreditNoteOrderStagesController);
myApp.controller('CreditNoteOrderStagesAddController', CreditNoteOrderStagesAddController);
myApp.controller('CreditNoteOrderStagesViewController', CreditNoteOrderStagesViewController);
myApp.controller('CreditNoteOrderStagesEditController', CreditNoteOrderStagesEditController);

function CreditNoteOrderStagesController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
    'use strict';

    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
            { 'name': 'Credit Note Stages', 'url': '#', 'isActive': false }];

    var vm = this;

    var Api = $scope.$root.setup + "crm/get-order-stages-list";
    var postData = {
        'token': $scope.$root.token,
        'type': 4,
        'all': "1"
    };

    /* $scope.$watch("MyCustomeFilters", function () {
        if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
            $scope.table.tableParams5.reload();
        }
    }, true); */

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
    $scope.columns = [];

    $scope.searchKeyword = {};
    
    $http
        .post(Api, postData)
        .then(function (res) {

            angular.forEach(res.data.response[0], function (val, index) {
                $scope.columns.push({
                    'title': toTitleCase(index),
                    'field': index,
                    'visible': true
                });
            });
            $scope.data = res.data.response;
        });

    var move = function (origin, destination) {
        var temp = $scope.data[destination];

        $scope.data[destination] = $scope.data[origin];
        $scope.data[origin] = temp;

        var sortUrl = $scope.$root.setup + "crm/sort-crm-order-stages";
        $http
            .post(sortUrl, { 'record': $scope.data, 'token': $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
                    $timeout(function () {
                        // $state.go('app.credit-note-order-stages');
                        $scope.table.tableParams5.reload();
                    }, 1000);
                }
                else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(336));
                }
            });
    };

    $scope.moveUp = function (index) {
        move(index, index - 1);
    };

    $scope.moveDown = function (index) {
        move(index, index + 1);
    };
}

function CreditNoteOrderStagesAddController($scope, $stateParams, $timeout, $http, $state, toaster) {

    $scope.formTitle = 'Credit Note Order Stages';
    $scope.btnCancelUrl = 'app.credit-note-order-stages';
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
            { 'name': 'Credit Note Stages', 'url': 'app.credit-note-order-stages', 'isActive': false }];
    // {'name': 'Add', 'url': '#', 'isActive': false}];

    $scope.formUrl = function () {
        return "app/views/credit_note_order_stages/_form.html";
    }

    $scope.rec = {};
    $scope.status = {};
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'inActive', 'value': 0 }];
    $scope.rec.status = $scope.arr_status[0];
    $scope.rec.type = 4;
    var postUrl = $scope.$root.setup + "crm/add-order-stages-list";


    $scope.add = function (rec) {
        rec.token = $scope.$root.token;
        // rec.stats = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;

        $http
            .post(postUrl, rec)
            .then(function (res) {


                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $timeout(function () {
                        $state.go('app.credit-note-order-stages');
                    }, 1000);
                }
                else
                    toaster.pop('error', 'Info', res.data.error);
            });
    }

}

function CreditNoteOrderStagesViewController($scope, $stateParams, $http, $timeout, $state, $resource, ngDialog, toaster) {
    $scope.formTitle = 'Credit Note Order Stages';
    $scope.btnCancelUrl = 'app.credit-note-order-stages';
    $scope.hideDel = false;
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
            { 'name': 'Credit Note Stages', 'url': 'app.credit-note-order-stages', 'isActive': false }];
    // {'name': 'Detail', 'url': '#', 'isActive': false}];

    $scope.formUrl = function () {
        return "app/views/credit_note_order_stages/_form.html";
    }

    $scope.gotoEdit = function () {
        $state.go("app.edit-credit-note-order-stages", { id: $stateParams.id });
    };


    $scope.rec = {};
    $scope.status = {};
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'inActive', 'value': 0 }];

    $scope.rec.status = 1;
    $scope.rec.type = 4;
    var postUrl = $scope.$root.setup + "crm/crm-get-order-stages-by-id";
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


    $scope.delete = function (id, index, $data) {
        var delUrl = $scope.$root.setup + "crm/crm-delete-order-stages";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: $scope.rec.id, 'token': $scope.$root.token, 'type': 4 })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        // $data.splice(index, 1);
                        $timeout(function () {
                            $state.go('app.credit-note-order-stages');
                        }, 1000);
                    }
                    else {
                        toaster.pop('error', 'Deleted', res.data.error);
                        // toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

}

function CreditNoteOrderStagesEditController($scope, $stateParams, $timeout, $http, $state, $resource, toaster, ngDialog) {

    $scope.formTitle = 'Credit Note Order Stages';
    $scope.btnCancelUrl = 'app.credit-note-order-stages';
    $scope.hideDel = false;
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
            { 'name': 'Credit Note Stages', 'url': 'app.credit-note-order-stages', 'isActive': false }];
    // {'name': 'Edit', 'url': '#', 'isActive': false}];

    $scope.formUrl = function () {
        return "app/views/credit_note_order_stages/_form.html";
    }


    $scope.rec = {};
    $scope.status = {};
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'inActive', 'value': 0 }];

    var postUrl = $scope.$root.setup + "crm/crm-get-order-stages-by-id";
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
        if (rec.id > 0) var updateUrl = $scope.$root.setup + "crm/update-order-stages-list";

        var updateUrl = $scope.$root.setup + "crm/add-order-stages-list";
        rec.token = $scope.$root.token;
        rec.stats = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;
        $scope.rec.type = 4;
        $http
            .post(updateUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $timeout(function () {
                        $state.go('app.credit-note-order-stages');
                    }, 1000);
                }
                else
                    toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
            });
    }

    $scope.delete = function (id, index, $data) {
        if ($scope.rec.rank == 1) 
        {
            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(109, ['First Stage']));
            return;
        }
        var delUrl = $scope.$root.setup + "crm/crm-delete-order-stages";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: $scope.rec.id, 'token': $scope.$root.token, 'type': 4})
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        // $data.splice(index, 1);
                        $timeout(function () {
                            $state.go('app.credit-note-order-stages');
                        }, 1000);
                    }
                    else {
                        toaster.pop('error', 'Deleted', res.data.error);
                        // toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

}


