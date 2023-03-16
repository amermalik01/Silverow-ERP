SegmentController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.segment', {
                url: '/segment',
                title: 'Setup',
                templateUrl: helper.basepath('segment/segment.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.add-segment', {
                url: '/segment/add',
                title: 'Setup ',
                templateUrl: helper.basepath('add.html'),
                controller: 'SegmentAddController'
            })
            .state('app.view-segment', {
                url: '/segment/:id/view',
                title: 'Setup',
                templateUrl: helper.basepath('view.html'),
                resolve: angular.extend(helper.resolveFor('ngDialog'), {
                    tpl: function () {
                        return { path: helper.basepath('ngdialog-template.html') };
                    }
                }),
                controller: 'SegmentViewController'
            })
            .state('app.edit-segment', {
                url: '/segment/:id/edit',
                title: 'Setup',
                templateUrl: helper.basepath('edit.html'),
                controller: 'SegmentEditController'
            })

    }]);

myApp.controller('SegmentController', SegmentController);
myApp.controller('SegmentAddController', SegmentAddController);
myApp.controller('SegmentViewController', SegmentViewController);
myApp.controller('SegmentEditController', SegmentEditController);

function SegmentController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
    'use strict';

    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
            { 'name': 'Segments', 'url': '#', 'isActive': false }];

    var vm = this;
    var Api = $scope.$root.setup + "ledger-group/predefines";
    var postData = {
        'token': $scope.$root.token,
        'all': "1",
        'column': 'type',
        'value': 'SEGMENT'
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




}

function SegmentAddController($scope, $stateParams, $http, $state, toaster, $timeout) {

    $scope.formTitle = 'Segment';
    $scope.btnCancelUrl = 'app.segment';

    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
            { 'name': 'Segments', 'url': 'app.segment', 'isActive': false }];
    // {'name': 'Add', 'url': '#', 'isActive': false}];

    $scope.formUrl = function () {
        return "app/views/segment/_form.html";
    }

    $scope.rec = {};
    $scope.predefine_types = {};
    var postUrl = $scope.$root.setup + "ledger-group/add-predefine";

    $scope.add = function (rec) {
        rec.token = $scope.$root.token;
        rec.type = 'SEGMENT';
        $http
            .post(postUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $timeout(function () {
                        $state.go('app.segment');
                    }, 1000);
                }
                else
                    toaster.pop('error', 'Add', res.data.error);
                // toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
            });
    }
}

function SegmentViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
    $scope.formTitle = 'Segment';
    $scope.btnCancelUrl = 'app.segment';
    $scope.hideDel = false;
    $scope.showLoader = true;
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
            { 'name': 'Segments', 'url': 'app.segment', 'isActive': false }];
    // {'name': 'Detail', 'url': '#', 'isActive': false}];


    $scope.gotoEdit = function () {
        $state.go("app.edit-segment", { id: $stateParams.id });
    };


    $scope.rec = {};
    $scope.predefine_types = {};
    var postUrl = $scope.$root.setup + "ledger-group/get-predefine";
    var postData = { 'token': $scope.$root.token, 'id': $stateParams.id, 'type': 'SEGMENT' };

    $timeout(function () {
        $http
            .post(postUrl, postData)
            .then(function (res) {
                $scope.rec = res.data.response;
            });
        $scope.formUrl = function () {
            return "app/views/segment/_form.html";
        }
        $scope.showLoader = false;
    }, 3000);

    $scope.delete = function (id, rec, arr_data) {
        var delUrl = $scope.$root.setup + "ledger-group/delete-predefine";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token, 'type': 'SEGMENT' })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        /*var index = arr_data.indexOf(rec.id);
                        arr_data.splice(index, 1);*/

                        $timeout(function () {
                            $state.go('app.segment');
                        }, 3000);
                    }
                    else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };
};

function SegmentEditController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {

    $scope.formTitle = 'Segment';
    $scope.btnCancelUrl = 'app.segment';
    $scope.hideDel = false;
    $scope.showLoader = true;
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
            { 'name': 'Segments', 'url': 'app.segment', 'isActive': false }];
    // {'name': 'Edit', 'url': '#', 'isActive': false}];


    $scope.rec = {};
    $scope.predefine_types = {};
    var postUrl = $scope.$root.setup + "ledger-group/get-predefine";
    var updateUrl = $scope.$root.setup + "ledger-group/update-predefine";
    var postData = { 'token': $scope.$root.token, 'id': $stateParams.id, 'type': 'SEGMENT' };

    // $timeout(function () {
    $http
        .post(postUrl, postData)
        .then(function (res) {
            $scope.rec = res.data.response;
            $scope.rec.deletePerm = 1;
        });
    $scope.formUrl = function () {
        return "app/views/segment/_form.html";
    }
    $scope.showLoader = false;
    // }, 3000);

    $scope.update = function (rec) {
        rec.token = $scope.$root.token;
        rec.type = 'SEGMENT';
        $http
            .post(updateUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $timeout(function () {
                        $state.go('app.segment');
                    }, 1000);
                } else if (res.data.ack == 2) {
                    toaster.pop('success', 'Edit', res.data.error);
                    $timeout(function () {
                        $state.go('app.segment');
                    }, 1000);
                }
                else {
                    toaster.pop('error', 'Edit', res.data.error);

                    $timeout(function () {
                        $state.go('app.segment');
                    }, 1000);
                }
            });
    }

    $scope.delete = function (id, rec, arr_data) {
        var delUrl = $scope.$root.setup + "ledger-group/delete-predefine";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token, 'type': 'SEGMENT' })
                .then(function (res) {
                    if (res.data.ack == 1) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        /* var index = arr_data.indexOf(rec.id);
                         arr_data.splice(index, 1);*/
                        $timeout(function () {
                            $state.go('app.segment');
                        }, 1500);
                    } else if (res.data.ack == 0) {
                        toaster.pop('error', 'Info', res.data.error);
                    } else {
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

}


