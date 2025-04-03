DepartmentcategoryController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$rootScope"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
             .state('app.depart-category', {
                 url: '/depart_category',
                 title: 'department Category',
                 templateUrl: helper.basepath('department_category/department_category.html'),
                 resolve: helper.resolveFor('ngTable', 'ngDialog')
             })
             .state('app.add-depart-category', {
                 url: '/depart_category/add',
                 title: 'Add department Category',
                 templateUrl: helper.basepath('edit.html'),
                 controller: 'DepartmentcategoryControllerEdit'
             })
             .state('app.view-depart-category', {
                 url: '/depart_category/:id/view',
                 title: 'View department Category ',
                 templateUrl: helper.basepath('edit.html'),
                 resolve: angular.extend(helper.resolveFor('ngDialog'), {
                     tpl: function () {
                         return {path: helper.basepath('ngdialog-template.html')};
                     }
                 }),
                 controller: 'DepartmentcategoryControllerEdit'
             })
             .state('app.edit-depart-category', {
                 url: '/depart_category/:id/edit',
                 title: 'Edit Job Title',
                 templateUrl: helper.basepath('edit.html'),
                 controller: 'DepartmentcategoryControllerEdit'
             })

    }]);

myApp.controller('DepartmentcategoryController', DepartmentcategoryController);
myApp.controller('DepartmentcategoryControllerEdit', DepartmentcategoryControllerEdit);

function DepartmentcategoryController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $rootScope) {
    'use strict';
    $rootScope.breadcrumbs =
         [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
             {'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1'},
             {'name': 'Human Resources', 'url': 'app.setup', 'tabIndex': '7'},
             {'name': 'Department Category', 'url': '#', 'isActive': false}];

    var vm = this;
    var Api = $scope.$root.setup + "hr/depart-category-list";
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
        var delUrl = $scope.$root.setup + "hr/delete-depart-category-list";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                 .post(delUrl, {id: id, 'token': $scope.$root.token})
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


function DepartmentcategoryControllerEdit($scope, $stateParams, $http, $state, $resource, toaster,$timeout){

    $scope.formTitle = 'Employee Role In Opportunity Cycle';
    $scope.btnCancelUrl = 'app.depart-category';
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
             {'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1'},
             {'name': 'Human Resources', 'url': 'app.setup', 'tabIndex': '7'},
             {'name': 'Department Category', 'url': 'app.depart-category', 'isActive': false}];
            //  {'name': 'Edit', 'url': '#', 'isActive': false}];

    $scope.formUrl = function () {
        return "app/views/department_category/_form.html";
    }

    $scope.rec = {};
    $scope.arr_status = [];
    $scope.arr_status = [{'label': 'Active', 'value': 1}, {'label': 'inActive', 'value': 0}];
    $scope.rec.status = $scope.arr_status[0];
    $scope.arr_type = [{'label': 'HR', 'value': 1}, {'label': 'Opp cycle', 'value': 2}];


    var postUrl = $scope.$root.setup + "hr/get-depart-category-list";
    var postData = {'token': $scope.$root.token, 'id': $stateParams.id};
    if ($stateParams.id !== undefined) {
        $http
             .post(postUrl, postData)
             .then(function (res) {
                 $scope.rec = res.data.response;
                 $timeout(function () {

                     $.each($scope.arr_status, function (index, obj) {
                         if (obj.value == res.data.response.status)
                             $scope.rec.status = obj;
                     });

                     $.each($scope.arr_type, function (index, obj) {
                         if (obj.value == res.data.response.type)
                             $scope.rec.type = obj;
                     });
                 }, 2000);
             });
    }

    $scope.update = function (rec) {
        var updateUrl = $scope.$root.setup + "hr/add-depart-category-list";
        if ($stateParams.id)
            var updateUrl = $scope.$root.setup + "hr/update-depart-category-list";
        rec.token = $scope.$root.token;
        rec.statuss = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;
        rec.types = $scope.rec.type !== undefined ? $scope.rec.type.value : 0;
        $http
             .post(updateUrl, rec)
             .then(function (res) {
                 if (res.data.ack == true) {
                     toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                     $timeout(function () {
                         $state.go('app.depart-category');
                     }, 1000);
                 }
                 else
                     toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));


             });
    }

}


