JobTitleController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.job-title', {
                url: '/job-title',
                title: 'Setup',
                templateUrl: helper.basepath('job_title/job_title.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.add-job-title', {
                url: '/job-title/add',
                title: 'Setup',
                templateUrl: helper.basepath('add.html'),
                controller: 'EDITCRMCLASSFICATIONLIST'
            })
            .state('app.view-job-title', {
                url: '/job-title/:id/view',
                title: 'Setup',
                templateUrl: helper.basepath('view.html'),
                resolve: angular.extend(helper.resolveFor('ngDialog'), {
                    tpl: function () {
                        return { path: helper.basepath('ngdialog-template.html') };
                    }
                }),
                controller: 'EDITCRMCLASSFICATIONLIST'
            })
            .state('app.edit-job-title', {
                url: '/job-title/:id/edit',
                title: 'Setup',
                templateUrl: helper.basepath('edit.html'),
                controller: 'EDITCRMCLASSFICATIONLIST'
            })

    }]);

myApp.controller('JobTitleController', JobTitleController);
myApp.controller('EDITCRMCLASSFICATIONLIST', EDITCRMCLASSFICATIONLIST);

function JobTitleController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
    'use strict';
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
            { 'name': 'Role In Opportunity Cycle', 'url': '#', 'isActive': false }];

    var vm = this;
    var Api = $scope.$root.setup + "hr/job-title";
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

                ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);
            }
        });


    $scope.$data = {};
    $scope.delete = function (id, index, $data) {
        var delUrl = $scope.$root.setup + "hr/delete-job-title";
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
                        toaster.pop('error', 'Deleted', res.data.error);
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    }


}


function EDITCRMCLASSFICATIONLIST($scope, $stateParams, $http, $state, $resource, toaster, ngDialog, $timeout) {

    $scope.formTitle = 'Role In Opportunity Cycle';
    $scope.btnCancelUrl = 'app.job-title';
    $scope.hideDel = false;

    $scope.check_readonly = false;
    //    if ($stateParams.id > 0)
    //        $scope.check_readonly = true;
    //
    //
    //    $scope.gotoEdit = function () {
    //        $scope.check_readonly = false;
    //        //$scope.perreadonly = true;
    //    }


    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
            { 'name': 'Role In Opportunity Cycle', 'url': 'app.job-title', 'isActive': false }];
    //  {'name': 'Edit', 'url': '#', 'isActive': false}];

    $scope.formUrl = function () {
        return "app/views/job_title/_form.html";
    }

    $scope.rec = {};
    $scope.arr_status = [];
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'inActive', 'value': 0 }];
    $scope.rec.status = $scope.arr_status[0];
    $scope.arr_type = [{ 'label': 'HR', 'value': 1 }, { 'label': 'Opp cycle', 'value': 2 }];
    $scope.rec.type = $scope.arr_type[1];

    var postUrl = $scope.$root.setup + "hr/get-job-title";
    var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };
    if ($stateParams.id !== undefined) {
        $http
            .post(postUrl, postData)
            .then(function (res) {
                $scope.rec = res.data.response;
                $scope.rec.deletePerm = 1;
                // $timeout(function () {

                $.each($scope.arr_status, function (index, obj) {
                    if (obj.value == res.data.response.status)
                        $scope.rec.status = obj;
                });

                //                     $.each($scope.arr_type, function (index, obj) {
                //                         if (obj.value == res.data.response.type)
                //                             $scope.rec.type = obj;
                //                     });
                // }, 1000);
            });
        // $scope.check_readonly = true;
    }else{
        $scope.check_readonly = false;
    }

    $scope.gotoEdit = function () {
        // $scope.check_readonly = false;
        $state.go("app.edit-job-title", { id: $stateParams.id });
    }

    $scope.add = function (rec) {
        var updateUrl = $scope.$root.setup + "hr/add-job-title";
        if ($stateParams.id)
            var updateUrl = $scope.$root.setup + "hr/update-job-title";
        rec.token = $scope.$root.token;
        rec.statuss = 1;//$scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;
        rec.types = 2;//$scope.rec.type !== undefined ? $scope.rec.type.value : 0;
        $http
            .post(updateUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    if ($stateParams.id)
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    else
                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));

                    $state.go('app.job-title');
                }
                else {
                    toaster.pop('error', 'Error', res.data.error);
                    /* if ($stateParams.id)
                        toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(107));
                    else
                        toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107)); */

                }
            });
    }

    $scope.update = function (rec) {
        var updateUrl = $scope.$root.setup + "hr/add-job-title";
        if ($stateParams.id)
            var updateUrl = $scope.$root.setup + "hr/update-job-title";
        rec.token = $scope.$root.token;
        rec.statuss = 1;//$scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;
        rec.types = 2;//$scope.rec.type !== undefined ? $scope.rec.type.value : 0;
        $http
            .post(updateUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    if ($stateParams.id)
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    else
                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));

                    $state.go('app.job-title');
                }
                else {
                    toaster.pop('error', 'Error', res.data.error);
                    /* if ($stateParams.id)
                        toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(107));
                    else
                        toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107)); */

                }
            });
    }

    $scope.delete = function (id) { // , index, $data
        var delUrl = $scope.$root.setup + "hr/delete-job-title";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        // $data.splice(index, 1);
                        $state.go('app.job-title');
                    }
                    else {
                        toaster.pop('error', 'Deleted', res.data.error);
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    }

}


