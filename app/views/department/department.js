DepartmentController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.department', {
                url: '/department',
                title: 'Setup',
                templateUrl: helper.basepath('department/department.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.adddepartment', {
                url: '/department/add',
                title: 'Setup',
                templateUrl: helper.basepath('add.html'),
                controller: 'DepartmentAddController'
            })
            .state('app.view-department', {
                url: '/department/:id/view',
                title: 'Setup',
                templateUrl: helper.basepath('view.html'),
                resolve: angular.extend(helper.resolveFor('ngDialog'), {
                    tpl: function () {
                        return { path: helper.basepath('ngdialog-template.html') };
                    }
                }),
                controller: 'DepartmentViewController'
            })
            .state('app.edit-department', {
                url: '/department/:id/edit',
                title: 'Setup',
                templateUrl: helper.basepath('edit.html'),
                resolve: angular.extend(helper.resolveFor('ngDialog'), {
                    tpl: function () {
                        return { path: helper.basepath('ngdialog-template.html') };
                    }
                }),
                controller: 'DepartmentEditController'
            })

    }]);

myApp.controller('DepartmentController', DepartmentController);
myApp.controller('DepartmentAddController', DepartmentAddController);
myApp.controller('DepartmentViewController', DepartmentViewController);
myApp.controller('DepartmentEditController', DepartmentEditController);

function DepartmentController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
    'use strict';



    var vm = this;
    $scope.class = 'inline_block';
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex': '7' },
            { 'name': 'Department', 'url': '#', 'isActive': false }];

    var Api = $scope.$root.hr + "hr_department/get-department";
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
    },
        {
            total: 0, // length of data
            counts: [], // hide page counts control

            getData: function ($defer, params) {
                //$scope.checkData = ngDataService.getData( $defer, params, Api,$filter,$scope,postData);
                ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);
            }
        });



    $scope.delete = function (id, index, arr_data) {
        var delUrl = $scope.$root.hr + "hr_department/delete-department";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {

                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data.splice(index, 1);
                        // $timeout(function(){ $state.go('app.hr_tabs'); }, 3000);
                    }
                    else {
                        toaster.pop('error', 'Info', 'Record cannot be Deleted.');
                    }
                });
        },
            function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
    };

}

function DepartmentAddController($scope, $stateParams, $http, $state, toaster, $timeout) {

    $scope.formTitle = 'Department';
    $scope.btnCancelUrl = 'app.department';

    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex': '7' },
            { 'name': 'Department', 'url': 'app.department', 'isActive': false }];
    // { 'name': 'Add', 'url': '#', 'isActive': false }
    $scope.rec = {};
    $scope.status = {};
    $scope.arr_type = {};
    var Api = $scope.$root.setup + "hr/depart-category-list";
    $http
        .post(Api, { 'token': $scope.$root.token })
        .then(function (res) {
            if (res.data.ack == 1)
                $scope.arr_type = res.data.response;

        });

    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];
    $scope.rec.status = $scope.arr_status[0];
    $scope.formUrl = function () {
        return "app/views/department/_form.html";
    }


    //    $scope.rec.code = '';
    //    var postUrl_code = $scope.$root.hr + "hr_department/dep_code";
    //    $http
    //         .post(postUrl_code, {'token': $scope.$root.token})
    //         .then(function (res) {
    //             if (res.data.ack == true) {
    //                 $scope.rec.code = res.data.response.code;
    //                 $scope.code = res.data.response.code;
    //                 // console.log(res.data.response.code);
    //             }
    //         });



    var postUrl = $scope.$root.hr + "hr_department/add_department";
    $scope.add = function (rec) {
        if (rec.name == undefined || rec.name.trim() == "") {
            rec.name = "";
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Name']));
            return;
        }
        rec.token = $scope.$root.token;
        rec.statuss = $scope.arr_status[0].value;
        rec.types = $scope.rec.type !== undefined ? $scope.rec.type.id : 0;

        $http
            .post(postUrl, rec)
            .then(function (res) {
                //	 console.log(rec);
                if (res.data.ack == true) {
                    toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                    $timeout(function () {
                        $state.go('app.department');
                    }, 1000);
                }
                else
                    toaster.pop('error', 'Info', res.data.error);
            });
    }


}

function DepartmentViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
    $scope.formTitle = 'Department';
    $scope.btnCancelUrl = 'app.department';
    $scope.hideDel = false;
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex': '7' },
            { 'name': 'Department', 'url': 'app.department', 'isActive': false }];
    // { 'name': 'Detail', 'url': '#', 'isActive': false }];

    $scope.formUrl = function () {
        return "app/views/department/_form.html";
    }

    $scope.gotoEdit = function () {
        $state.go("app.edit-department", { id: $stateParams.id });
    };

    $scope.rec = {};
    $scope.status = {};
    $scope.arr_type = {};
    var Api = $scope.$root.setup + "hr/depart-category-list";
    $http
        .post(Api, { 'token': $scope.$root.token })
        .then(function (res) {
            if (res.data.ack == 1)
                $scope.arr_type = res.data.response;

        });

    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'inActive', 'value': 0 }];

    var postUrl = $scope.$root.setup + "hr/get-department";
    var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

    $http
        .post(postUrl, postData)
        .then(function (res) {

            //             if (res.data.response.code == 0) {
            //
            //                 var postUrl_code = $scope.$root.hr + "hr_department/dep_code";
            //                 $http
            //                      .post(postUrl_code, {'token': $scope.$root.token})
            //                      .then(function (res) {
            //                          if (res.data.ack == true) {
            //                              $scope.rec.code = res.data.response.code;
            //                              $scope.code = res.data.response.code;
            //                              // console.log(res.data.response.code);
            //                          }
            //                      });
            //
            //             }

            $scope.rec = res.data.response;
            $.each($scope.arr_status, function (index, obj) {
                if (obj.value == res.data.response.status)
                    $scope.rec.status = obj

            });
            $timeout(function () {
                $.each($scope.arr_type, function (index, obj) {
                    if (obj.id == res.data.response.type)
                        $scope.rec.type = obj

                });

            }, 2000);

        });

    $scope.delete = function (id, index, arr_data) {
        var delUrl = $scope.$root.hr + "hr_department/delete-department";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token })
                .then(function (res) {

                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () { $state.go('app.department'); }, 1500);
                    }
                    else {
                        toaster.pop('error', 'Info', 'Record cannot be Deleted.');
                    }
                });
        },
            function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
    };


}


function DepartmentEditController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {

    $scope.formTitle = 'Department';
    $scope.btnCancelUrl = 'app.department';
    $scope.hideDel = false;
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex': '7' },
            { 'name': 'Department', 'url': 'app.department', 'isActive': false }];
    // { 'name': 'Edit', 'url': '#', 'isActive': false }

    $scope.formUrl = function () {
        return "app/views/department/_form.html";
    }


    $scope.rec = {};
    $scope.status = {};
    $scope.arr_type = {};
    var Api = $scope.$root.setup + "hr/depart-category-list";
    $http
        .post(Api, { 'token': $scope.$root.token })
        .then(function (res) {
            if (res.data.ack == 1)
                $scope.arr_type = res.data.response;

        });


    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'inActive', 'value': 0 }];

    var postUrl = $scope.$root.setup + "hr/get-department";
    var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };
    $http
        .post(postUrl, postData)
        .then(function (res) {

            //             if (res.data.response.code == 0) {
            //
            //                 var postUrl_code = $scope.$root.hr + "hr_department/dep_code";
            //                 $http
            //                      .post(postUrl_code, {'token': $scope.$root.token})
            //                      .then(function (res) {
            //                          if (res.data.ack == true) {
            //                              $scope.rec.code = res.data.response.code;
            //                              $scope.code = res.data.response.code;
            //                              // console.log(res.data.response.code);
            //                          }
            //                      });
            //
            //             }
            $scope.rec = res.data.response;
            $scope.rec.deletePerm = 1;
            $.each($scope.arr_status, function (index, obj) {
                if (obj.value == res.data.response.status)
                    $scope.rec.status = obj

            });
            // $timeout(function () {
            $.each($scope.arr_type, function (index, obj) {
                if (obj.id == res.data.response.type)
                    $scope.rec.type = obj

            });

            // }, 2000);


        });

    var updateUrl = $scope.$root.hr + "hr_department/add_department";
    $scope.update = function (rec) {
        rec.token = $scope.$root.token;
        rec.statuss = $scope.arr_status[0].value;

        rec.types = $scope.rec.type !== undefined ? $scope.rec.type.id : 0;

        $http
            .post(updateUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));

                    $timeout(function () {
                        $state.go('app.department');
                    }, 1500);
                }
                else
                    //toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    toaster.pop('error', 'Info', res.data.error);

                


            });
    }
    $scope.delete = function (id, index, arr_data) {
        var delUrl = $scope.$root.hr + "hr_department/delete-department";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token })
                .then(function (res) {

                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () { $state.go('app.department'); }, 1500);
                    }
                    else {
                        toaster.pop('error', 'Info', 'Record cannot be Deleted.');
                    }
                });
        },
            function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
    };

}


