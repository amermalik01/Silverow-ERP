
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.roles', {
                url: '/roles',
                title: 'Setup',
                templateUrl: helper.basepath('roles/roles.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'RolesEditController'
            })
            .state('app.addRoles', {
                url: '/roles/add',
                title: 'Setup',
                templateUrl: helper.basepath('roles/_form.html'),
                resolve: helper.resolveFor('ngDialog'),
                controller: 'RolesEditController'
            })
            .state('app.viewRoles', {
                url: '/roles/:id/view',
                title: 'Setup',
                templateUrl: helper.basepath('roles/_form.html'),
                resolve: helper.resolveFor('ngDialog'),
                controller: 'RolesEditController'
            })
            .state('app.editRoles', {
                url: '/roles/:id/edit',
                title: 'Setup',
                templateUrl: helper.basepath('roles/_form.html'),
                resolve: helper.resolveFor('ngDialog'),
                controller: 'RolesEditController'
            })
            .state('app.permissionRoles', {
                url: '/permission',
                title: 'Setup',
                templateUrl: helper.basepath('roles/_permission.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'RolesPermissionController'
            })

    }]);
RolesController.$inject = ["$scope", "$state", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService",
    "$http", "ngDialog", "toaster", "$rootScope"];
myApp.controller('RolesController', RolesController);
function RolesController($scope, $state, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $rootScope) {
    'use strict';


    // required for inner references
    $scope.class = 'inline_block';
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','style':''},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Human Resources', 'url': 'app.setup', 'style': '', 'tabIndex': '7' },
            { 'name': 'Roles and Permissions', 'url': '#', 'style': 'color:#515253;' }];

    var vm = this;
    var Api = $scope.$root.hr + "roles/roles";
    var postData = { 'token': $scope.$root.token };


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
                ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);
            }
        });






    var role_id = 0;
    $scope.columnsp = [];
    $scope.salepersons = [];
    $scope.selectedSalespersons = [];
    $scope.role_record = [];
    $scope.searchKeyword = {};
    $scope.searchKeyword.search = "";
    $scope.show_popup_assign = function (id, name, item_paging) {
        role_id = id;
        $scope.columnsp = [];
        $scope.salepersons = [];

        $scope.title_role = name;
        var postUrl = $scope.$root.hr + "employee/listings";


        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        if (item_paging == 1)
            $rootScope.item_paging.spage = 1
        $scope.postData.page = $rootScope.item_paging.spage;

        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;

        $scope.postData.searchKeyword = $scope.searchKeyword.$;
        if ($scope.searchKeyword.emp_type !== undefined && $scope.searchKeyword.emp_type !== null) {
            $scope.postData.emp_types = $scope.searchKeyword.emp_type.id;
        }

        if ($scope.searchKeyword.deprtment !== undefined && $scope.searchKeyword.deprtment !== null)
            $scope.postData.deprtments = $scope.searchKeyword.deprtment.id;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.salepersons = {};
        }

        $scope.showLoader = true;
        $timeout(function () {

            $http
                .post(postUrl, $scope.postData)
                .then(function (res) {
                    if (res.data.ack == true) {

                        $scope.total = res.data.total;
                        $scope.item_paging.total_pages = res.data.total_pages;
                        $scope.item_paging.cpage = res.data.cpage;
                        $scope.item_paging.ppage = res.data.ppage;
                        $scope.item_paging.npage = res.data.npage;
                        $scope.item_paging.pages = res.data.pages;

                        $scope.total_paging_record = res.data.total_paging_record;


                        $scope.salepersons = res.data.response;
                        //$('#sale_target_pop').modal({ show: true });


                        angular.forEach(res.data.response[0], function (val, index) {
                            if (index != 'chk' && index != 'id') {
                                $scope.columnsp.push({
                                    'title': toTitleCase(index),
                                    'field': index,
                                    'visible': true
                                });
                            }
                        });
                        $('#show_popup_assign').modal({ show: true });
                    }
                    // else toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));
                });
            $scope.showLoader = false;
        }, 1000);

    }

    angular.element(document).on('click', '.checkAllSalesperson', function () {
        $scope.selectedSalespersons = [];
        if (angular.element('.checkAllSalesperson').is(':checked') == true) {
            $scope.isSalePerersonChanged = true;
            var isPrimary = false;
            for (var i = 0; i < $scope.salepersons.length; i++) {
                if ($scope.salepersons[i].isPrimary)
                    isPrimary = true;

                $scope.salepersons[i].chk = true;
                $scope.selectedSalespersons.push($scope.salepersons[i]);
            }
            if (!isPrimary) {
                $scope.salepersons[0].isPrimary = true;
                $scope.selectedSalespersons[0].isPrimary = true;
            }

        } else {
            for (var i = 0; i < $scope.salepersons.length; i++) {
                $scope.salepersons[i].chk = false;
                $scope.salepersons[i].isPrimary = false;
            }
            $scope.selectedSalespersons = [];
        }

        //$timeout(function(){
        $scope.$root.$apply(function () {
            $scope.selectedSalespersons;
        });
        //},500);

    });

    $scope.selectSaleperson = function (sp, isPrimary) {
        $scope.isSalePerersonChanged = true;
        for (var i = 0; i < $scope.salepersons.length; i++) {
            if (isPrimary == 1)
                $scope.salepersons[i].isPrimary = false;
            if (sp.id == $scope.salepersons[i].id) {
                if ($scope.salepersons[i].chk == true && isPrimary == 0) {
                    $scope.salepersons[i].chk = false;
                    $scope.salepersons[i].isPrimary = false;
                    $.each($scope.selectedSalespersons, function (indx, obj) {
                        if (obj != undefined) {
                            if (obj.id == sp.id)
                                $scope.selectedSalespersons.splice(indx, 1);
                        }
                    });
                } else {
                    if (isPrimary == 1 || $scope.selectedSalespersons.length == 0) {
                        var isExist = false;
                        $scope.salepersons[i].isPrimary = true;
                        $.each($scope.selectedSalespersons, function (indx, obj) {
                            if (obj != undefined) {
                                $scope.selectedSalespersons[indx].isPrimary = false;
                                if (obj.id == sp.id) {
                                    isExist = true;
                                    $scope.selectedSalespersons[indx].isPrimary = true;
                                }

                            }
                        });
                        if (!isExist) {
                            $scope.salepersons[i].chk = true;
                            $scope.selectedSalespersons.push($scope.salepersons[i]);
                        }

                    } else {
                        $scope.salepersons[i].chk = true;
                        $scope.selectedSalespersons.push($scope.salepersons[i]);
                    }
                }

            }

        }
    }

    $scope.add_assign_roles = function () {

        var excUrl = $scope.$root.hr + "roles/add-multiple-role-employee";
        var post = {};
        var temp = [];
        //selectedSalespersons
        $.each($scope.salepersons, function (index, obj2) {
            if (obj2.chk)
                temp.push({ id: obj2.id });
        })
        post.role_id = role_id;
        post.token = $scope.$root.token;
        post.salespersons = temp;

        $http
            .post(excUrl, post)
            .then(function (res) {
                if (res.data.ack == true)
                    toaster.pop('Success', 'info', $scope.$root.getErrorMessageByCode(102));
                // else toaster.pop('error', 'info', count_name + 'Record is Not Updated Convert into Customer');
            });
    }

    $scope.selectedrolesrecord = [];
    $scope.all_roles_record = [];

    $scope.getAssignRoles = function (isShow) {
        $scope.columns = [];
        $scope.all_roles_record = [];

        var postUrl = $scope.$root.hr + "roles/roles";
        var postData = { 'token': $scope.$root.token };

        $http
            .post(postUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $.each(res.data.response, function (indx, obj) {
                        obj.chk = false;
                        if ($scope.selectedrolesrecord.length > 0) {
                            $.each($scope.selectedrolesrecord, function (indx, obj2) {
                                if (obj.id == obj2.id)
                                    obj.chk = true;
                            });
                        }
                        $scope.all_roles_record.push(obj);
                    });
                } //else   toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));


            });

    }
    $scope.getAssignRoles();
    $scope.get_employee_role_list = function (id) {

        var salepersonUrl = $scope.$root.hr + "roles/get-role-to-employee";
        $http
            .post(salepersonUrl, { id: id, 'token': $scope.$root.token, 'type': 1 })
            .then(function (emp_data) {
                if (emp_data.data.ack == true) {
                    $scope.selectedrolesrecord = [];

                    $('#show_role_all_employee').modal({ show: true });

                    $timeout(function () {
                        $scope.$root.$apply(function () {

                            $.each($scope.all_roles_record, function (indx, obj) {
                                obj.chk = false;
                                $.each(emp_data.data.response, function (indx, obj2) {
                                    if (obj.id == obj2.role_id) {
                                        obj.chk = true;

                                        $scope.selectedrolesrecord.push(obj);
                                    }
                                });
                                //$scope.all_roles_record.push(obj);
                            });

                        });
                    }, 1000);
                }
                else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });

    }


}

myApp.controller('RolesEditController', ["$scope", "$filter", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$stateParams", "$state", "$rootScope", "$q", function RolesEditController($scope, $filter, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams, $state, $rootScope, $q) {

    // myApp.controller('RolesEditController', RolesEditController);
    // RolesEditController.$inject = ["$scope", "$state", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$rootScope"];
    // function RolesEditController($scope, $state, $filter, ngTableParams, $resource, $timeout, ngTableDataService, $http, ngDialog, toaster, $rootScope) {

    $scope.btnCancelUrl = 'app.roles';
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Human Resources', 'url': 'app.setup', 'style': '', 'tabIndex': '7' },
            { 'name': 'Roles and Permissions', 'url': 'app.roles', 'isactive': false }];
    // { 'name': 'Edit', 'url': '#', 'isActive': false }


    $scope.rec = {};
    $scope.rec.end_date = "31/12/2027";
    $scope.rec.id = 0;
    $scope.$root.urole = $stateParams.id;
    $scope.arr_status = [];
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];
    $scope.rec.status = $scope.arr_status[0];


    //added this to make search functional inside Permissions table
    // $scope.permissionSearch = "";
    // $scope.isSimilar = function (e,query) {
    //     debugger
    //     if (query.trim() == "") return;
    //     debugger
    //     var text = e.display_name;
    //     var result = (text.indexOf(query) > -1)?true:false
    //     return (result);
    //  }


    $scope.expandAll = true;
    $scope.switchExpand = function () {
        if ($scope.expandAll == true) $scope.expandAll = false;
        else if ($scope.expandAll == false) $scope.expandAll = true;
    }
    if ($stateParams.id > 0)
        $scope.check_permison_readonly = true;

    $scope.showEditForm = function () {
        $scope.check_permison_readonly = false;
    }

    $scope.performLinkedPermissions = function(record, perm){
        if (perm == 3){
            if (!record.allowuright_view){
                record.allowuright_add = record.allowuright_edit = record.allowuright_view = record.allowuright_delete = record.allowuright_approved = record.allowuright_convert = record.allowuright_dispatch = record.allowuright_post = record.allowuright_receive = false;
            }
        }
        else{
            if (record.allowuright_add || record.allowuright_edit || record.allowuright_delete || record.allowuright_approved || record.allowuright_convert || record.allowuright_dispatch || record.allowuright_post || record.allowuright_receive){
                record.allowuright_view = true;
            }
        }
        if (record.linkedRecords == undefined){
            return;
        }
        else{
            angular.forEach($scope.rec_uright_tree, function (obj, index) {
                angular.forEach(record.linkedRecords.split(","), function(linkedRecord){
                    if (obj.id == linkedRecord){
                        if (obj.valid_permissions.indexOf(perm) > -1){
                            if (perm == 1){
                                obj.allowuright_add = record.allowuright_add;
                            }
                            else if (perm == 2){
                                obj.allowuright_edit = record.allowuright_edit;
                            }
                            else if (perm == 3){
                                obj.allowuright_view = record.allowuright_view;
                            }
                            else if (perm == 4){
                                obj.allowuright_delete = record.allowuright_delete;
                            }
                            else if (perm == 5){
                                obj.allowuright_approved = record.allowuright_approved;
                            }
                            else if (perm == 6){
                                obj.allowuright_convert = record.allowuright_convert;
                            }
                            else if (perm == 7){
                                obj.allowuright_dispatch = record.allowuright_dispatch;
                            }
                            else if (perm == 8){
                                obj.allowuright_post = record.allowuright_post;
                            }
                            else if (perm == 9){
                                obj.allowuright_receive = record.allowuright_receive;
                            }
                        }
                    }
                })
            });

        }

    }

    $scope.doInherit = function (id) {
        // var thisElem = $scope.rec_uright_tree.find(item => item.id === id);
        var thisElem = $scope.rec_uright_tree.find(function(item) {
            return item.id === id;
        });
        angular.forEach($scope.rec_uright_tree, function (obj, index) {
            if (obj.parent_id == thisElem.id) {
                angular.forEach($scope.rec_uright_tree, function (obj2, index2) {
                    if (obj2.parent_id == obj.id) {
                        try {
                            obj2.allowuright_add = thisElem.allowuright_add && obj2.valid_permissions.indexOf('1') > -1 ? true : false;
                            obj2.allowuright_edit = thisElem.allowuright_edit && obj2.valid_permissions.indexOf('2') > -1 ? true : false;
                            obj2.allowuright_view = thisElem.allowuright_view && obj2.valid_permissions.indexOf('3') > -1 ? true : false;
                            obj2.allowuright_delete = thisElem.allowuright_delete && obj2.valid_permissions.indexOf('4') > -1 ? true : false;
                            obj2.allowuright_approved = thisElem.allowuright_approved && obj2.valid_permissions.indexOf('5') > -1 ? true : false;
                            obj2.allowuright_convert = thisElem.allowuright_convert && obj2.valid_permissions.indexOf('6') > -1 ? true : false;
                            obj2.allowuright_dispatch = thisElem.allowuright_dispatch && obj2.valid_permissions.indexOf('7') > -1 ? true : false;
                            obj2.allowuright_post = thisElem.allowuright_post && obj2.valid_permissions.indexOf('8') > -1 ? true : false;
                            obj2.allowuright_receive = thisElem.allowuright_receive && obj2.valid_permissions.indexOf('9') > -1 ? true : false;
                        } catch (error) {

                        }

                    }
                })
                try {
                    obj.allowuright_add = thisElem.allowuright_add && obj.valid_permissions.indexOf('1') > -1 ? true : false;
                    obj.allowuright_edit = thisElem.allowuright_edit && obj.valid_permissions.indexOf('2') > -1 ? true : false;
                    obj.allowuright_view = thisElem.allowuright_view && obj.valid_permissions.indexOf('3') > -1 ? true : false;
                    obj.allowuright_delete = thisElem.allowuright_delete && obj.valid_permissions.indexOf('4') > -1 ? true : false;
                    obj.allowuright_approved = thisElem.allowuright_approved && obj.valid_permissions.indexOf('5') > -1 ? true : false;
                    obj.allowuright_convert = thisElem.allowuright_convert && obj.valid_permissions.indexOf('6') > -1 ? true : false;
                    obj.allowuright_dispatch = thisElem.allowuright_dispatch && obj.valid_permissions.indexOf('7') > -1 ? true : false;
                    obj.allowuright_post = thisElem.allowuright_post && obj.valid_permissions.indexOf('8') > -1 ? true : false;
                    obj.allowuright_receive = thisElem.allowuright_receive && obj.valid_permissions.indexOf('9') > -1 ? true : false;
                } catch (error) {

                }

            }
        });
    }

    $scope.getCheckStatus = function (obj, all) {
        var result;
        if (all) {
            if (obj.valid_permissions != undefined)
                result = (
                    (obj.valid_permissions.indexOf('1') <= -1 || obj.allowuright_add) && (obj.valid_permissions.indexOf('2') <= -1 || obj.allowuright_edit) && (obj.valid_permissions.indexOf('3') <= -1 || obj.allowuright_view) && (obj.valid_permissions.indexOf('4') <= -1 || obj.allowuright_delete) && (obj.valid_permissions.indexOf('5') <= -1 || obj.allowuright_approved) && (obj.valid_permissions.indexOf('6') <= -1 || obj.allowuright_convert) && (obj.valid_permissions.indexOf('7') <= -1 || obj.allowuright_dispatch) && (obj.valid_permissions.indexOf('8') <= -1 || obj.allowuright_post) && (obj.valid_permissions.indexOf('9') <= -1 || obj.allowuright_receive)
                ) ? true : false;
        }
        else {
            if (obj.valid_permissions != undefined)
                result = (
                    (obj.valid_permissions.indexOf('1') > -1 && obj.allowuright_add) || (obj.valid_permissions.indexOf('2') > -1 && obj.allowuright_edit) || (obj.valid_permissions.indexOf('3') > -1 && obj.allowuright_view) || (obj.valid_permissions.indexOf('4') > -1 && obj.allowuright_delete) || (obj.valid_permissions.indexOf('5') > -1 && obj.allowuright_approved) || (obj.valid_permissions.indexOf('6') > -1 && obj.allowuright_convert) || (obj.valid_permissions.indexOf('7') > -1 && obj.allowuright_dispatch) || (obj.valid_permissions.indexOf('8') > -1 && obj.allowuright_post) || (obj.valid_permissions.indexOf('9') > -1 && obj.allowuright_receive)
                ) ? true : false;
        }
        return result;
    }

    $scope.checkAllPerms = function (obj) {
        var allChecked;
        if (obj.valid_permissions == null) {
            return;
        }
        if (
            (obj.valid_permissions.indexOf('1') <= -1 || obj.allowuright_add) && (obj.valid_permissions.indexOf('2') <= -1 || obj.allowuright_edit) && (obj.valid_permissions.indexOf('3') <= -1 || obj.allowuright_view) && (obj.valid_permissions.indexOf('4') <= -1 || obj.allowuright_delete) && (obj.valid_permissions.indexOf('5') <= -1 || obj.allowuright_approved) && (obj.valid_permissions.indexOf('6') <= -1 || obj.allowuright_convert) && (obj.valid_permissions.indexOf('7') <= -1 || obj.allowuright_dispatch) && (obj.valid_permissions.indexOf('8') <= -1 || obj.allowuright_post) && (obj.valid_permissions.indexOf('9') <= -1 || obj.allowuright_receive)
        ) {
            allChecked = true;
        }
        else {
            allChecked = false;
        }
        if (allChecked) {
            obj.allowuright_add = obj.allowuright_edit = obj.allowuright_view = obj.allowuright_delete = obj.allowuright_approved = obj.allowuright_convert = obj.allowuright_dispatch = obj.allowuright_post = obj.allowuright_receive = false;
        }
        else {
            if (obj.valid_permissions.indexOf('1') > -1) {
                obj.allowuright_add = true;
            }
            if (obj.valid_permissions.indexOf('2') > -1) {
                obj.allowuright_edit = true;
            }
            if (obj.valid_permissions.indexOf('3') > -1) {
                obj.allowuright_view = true;
            }
            if (obj.valid_permissions.indexOf('4') > -1) {
                obj.allowuright_delete = true;
            }
            if (obj.valid_permissions.indexOf('5') > -1) {
                obj.allowuright_approved = true;
            }
            if (obj.valid_permissions.indexOf('6') > -1) {
                obj.allowuright_convert = true;
            }
            if (obj.valid_permissions.indexOf('7') > -1) {
                obj.allowuright_dispatch = true;
            }
            if (obj.valid_permissions.indexOf('8') > -1) {
                obj.allowuright_post = true;
            }
            if (obj.valid_permissions.indexOf('9') > -1) {
                obj.allowuright_receive = true;
            }
        }
        for (var i = 1; i <= 9; i++){
            $scope.performLinkedPermissions(obj, i);
        }
        $scope.getCheckStatus(obj);
        return obj;
    }

    $scope.validateViewPerm = function (obj) {
        if (obj.allowuright_view == false) {
            return;
        }
        var thisElem = obj;
        angular.forEach($scope.rec_uright_tree, function (obj, index) {
            if (obj.id == thisElem.parent_id) {
                angular.forEach($scope.rec_uright_tree, function (obj2, index2) {
                    if (obj2.id == obj.parent_id) {
                        obj2.allowuright_view = thisElem.allowuright_view ? true : false;
                    }
                })
                obj.allowuright_view = thisElem.allowuright_view ? true : false;
            }
        });
    }

    $scope.product_type = true;
    $scope.count_result = 0;
    $scope.getCode = function (rec) {
        var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
        var name = $scope.$root.base64_encode('ref_roles');
        var no = $scope.$root.base64_encode('role_no');
        var module_category_id = 2;
        /*if( $scope.formData.brand_ids != 0)  module_category_id=1;
         if( $scope.formData.brand_ids == 0)
         {
         if( $scope.formData.category_ids != 0) module_category_id=3;
         }*/

        $http
            .post(getCodeUrl, { 'is_increment': 1, 'token': $scope.$root.token, 'tb': name, 'm_id': 54, 'no': no, 'category': '', 'brand': '', 'module_category_id': module_category_id })
            .then(function (res) {
                if (res.data.ack == 1) {
                    $scope.rec.role_code = res.data.code;
                    $scope.rec.role_no = res.data.nubmer;

                    $scope.rec.code_type = module_category_id;//res.data.code_type;
                    $scope.count_result++;

                    if (res.data.type == 1) {
                        $scope.product_type = false;
                    }
                    else {
                        $scope.product_type = true;
                    }

                    if ($scope.count_result > 0) {
                        return true;
                    }
                    else {
                        return false;
                    }

                }
                else {
                    toaster.pop('error', 'info', res.data.error);
                    return false;
                }
            });
    }
    //if($scope.$root.urole=== undefined ) $scope.getCode();


    $scope.delete_role = function (id, index, arr_data) {
        var delUrl = $scope.$root.hr + "roles/delete-role";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId2',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {

                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        // arr_data.splice(index,1);

                        if ($state.current.url == "/roles") {
                            $timeout(function () {
                                $state.reload();
                            }, 1000);
                        }
                        $timeout(function () {
                            $state.go('app.roles');
                        }, 1000);
                    }
                    else
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(108));

                });
        },
            function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
    };

    $scope.init = function(){
        if ($scope.$root.urole !== undefined) {
    
            var postUrl = $scope.$root.hr + "roles/get-role";
            var postData = {
                'token': $scope.$root.token,
                'id': $stateParams.id
            };
    
            $http
                .post(postUrl, postData)
                .then(function (res) {
                    $scope.rec = res.data.response;
    
                    $.each($scope.arr_status, function (index, obj) {
                        if (obj.value == res.data.response.status)
                            $scope.rec.status = $scope.arr_status[index];
                    });
    
                    //$scope.get_uright_list($stateParams.id);
                    $scope.showadd_uright_list();
                });
    
        }

    }
    $scope.init();


    $scope.update_mainrole = function (rec) {

        if ($scope.rec.role == undefined || $scope.rec.role.trim().length == 0){
            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(230, ['Name']));
            return;
        }

        var postUrl = $scope.$root.hr + "roles/add-role";
        if ($scope.$root.urole > 0)
            var postUrl = $scope.$root.hr + "roles/update-role";

        $scope.rec.token = $scope.$root.token;
        $scope.rec.statuss = $scope.arr_status[0].value;
        $scope.rec.start_date = 0;
        $scope.rec.end_date = 0;


        $scope.showLoader = true;

        $http
            .post(postUrl, $scope.rec)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    //toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));

                    if ($scope.$root.urole == undefined)
                        $state.go("app.editRoles", { id: res.data.id });
                    else {
                        $scope.add_uright_tree();
                    }

                    //$timeout(function(){ $state.go('app.roles'); }, 3000);
                }
                else
                    toaster.pop('error', 'Edit', res.data.error);


            });
    }



    //User Right portion
    $scope.role_arry = [];
    var roleUrl = $scope.$root.hr + "roles/roles";
    $http
        .post(roleUrl, { 'token': $scope.$root.token })
        .then(function (res) {
            $scope.role_arry = [];
            if (res.data.ack == true)
                $scope.role_arry = res.data.response;
            // if ($scope.user_type == 1)  $scope.role_arry.push({id: '-1', role: '++Add New++'});
        });
    $scope.permision_arry = [];
    var roleUrl = $scope.$root.hr + "roles/permision-list";
    $http
        .post(roleUrl, { 'token': $scope.$root.token })
        .then(function (res) {
            $scope.role_arry = [];
            if (res.data.ack == true)
                $scope.permision_arry = res.data.response;
            // if ($scope.user_type == 1)  $scope.role_arry.push({id: '-1', role: '++Add New++'});
        });


    $scope.urcolumns = [];
    $scope.ur_record = {};
    $scope.rec_uright_form = {};
    var permision_arr = {};
    $scope.rec_uright_tree = {};

    $scope.uright_list = false;
    $scope.uright_form = true;


    $scope.get_uright_list = function (id, index, arr_data_ret) {
        var dfd = $q.defer();
        // this will fetch checked permissions for current record
        $scope.uright_list = true;
        $scope.uright_form = false;
        $scope.show_tree = false;
        $scope.show_form = false;

        var Api = $scope.$root.hr + "roles/user-rights-list";
        var httpPromise = $http
            .post(Api, { id: id, 'token': $scope.$root.token })
            .then(function (res) {
                $scope.urcolumns = [];
                $scope.ur_record = {};
                if (res.data.ack == true) {
                    $scope.ur_record = res.data.response;
                    angular.forEach($scope.ur_record, function (obj, index) {
                        obj.order = parseInt(obj.order);
                        var permissionsArray = obj.permissions.split(",");
                        for (var i = 0; i < permissionsArray.length; i++) {
                            if (permissionsArray[i] == "1") {
                                permissionsArray[i] = "Add";
                            }
                            else if (permissionsArray[i] == "2") {
                                permissionsArray[i] = "Edit";
                            }
                            else if (permissionsArray[i] == "3") {
                                permissionsArray[i] = "View";
                            }
                            else if (permissionsArray[i] == "4") {
                                permissionsArray[i] = "Delete";
                            }
                            else if (permissionsArray[i] == "5") {
                                permissionsArray[i] = "Approved";
                            }
                            else if (permissionsArray[i] == "6") {
                                permissionsArray[i] = "Convert";
                            }
                            else if (permissionsArray[i] == "7") {
                                permissionsArray[i] = "Dispatch";
                            }
                            else if (permissionsArray[i] == "8") {
                                permissionsArray[i] = "Post";
                            }
                            else if (permissionsArray[i] == "9") {
                                permissionsArray[i] = "Receive";
                            }
                        }
                        obj.permissions = permissionsArray.join(", ");
                    });

                    angular.forEach(res.data.response[0], function (val, index) {
                        if (index != 'chk' && index != 'id' && index != 'order' && index != 'module_id') {
                            $scope.urcolumns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }
                    });

                }

            });

        return httpPromise;
    };

    $scope.showadd_uright_list = function () {
        $scope.uright_list = false;
        $scope.uright_form = true;
        $scope.show_tree = true;
        $scope.show_form = false;
        $scope.rec_uright_form = {};
        $scope.get_tree_data();
    };

    $scope.showedit_uright_list = function (id) {
        $scope.uright_list = false;
        $scope.uright_form = true;
        $scope.show_tree = false;
        $scope.show_form = true;
        $scope.rec_uright_form = {};
        var get = $scope.$root.hr + "roles/get-user-rights-by-id";
        var postData = { 'token': $scope.$root.token, 'id': id };

        $http
            .post(get, postData)
            .then(function (res) {

                $scope.rec_uright_form = res.data.response;
                $scope.get_tree_data();
                $scope.showLoader = true;
                $timeout(function () {
                    //$scope.$root.$apply(function () {
                    /*$.each($scope.role_arry,function(index,obj){ 
                     if(obj.id == res.data.response.role_id) $scope.rec_uright_form.role = obj; 
                     });*/
                    angular.forEach($scope.rec_uright_one, function (obj, index) {

                        if (obj.id == res.data.response.module_id)
                            $scope.rec_uright_form.module = obj;
                    });
                    $scope.showLoader = false;
                    //});
                }, 2000);

                if (typeof $scope.rec_uright_form.permisions !== "undefined")
                    permision_arr = $scope.rec_uright_form.permisions.split(',');
                for (var i = 0; i < permision_arr.length; i++) {

                    if (permision_arr[i] == 1)
                        $scope.rec_uright_form.allowuright_add = true;
                    if (permision_arr[i] == 2)
                        $scope.rec_uright_form.allowuright_edit = true;
                    if (permision_arr[i] == 3)
                        $scope.rec_uright_form.allowuright_view = true;
                    if (permision_arr[i] == 4)
                        $scope.rec_uright_form.allowuright_delete = true;
                    if (permision_arr[i] == 5)
                        $scope.rec_uright_form.allowuright_approved = true;
                    if (permision_arr[i] == 6)
                        $scope.rec_uright_form.allowuright_convert = true;
                    if (permision_arr[i] == 7)
                        $scope.rec_uright_form.allowuright_dispatch = true;
                    if (permision_arr[i] == 8)
                        $scope.rec_uright_form.allowuright_post = true;
                    if (permision_arr[i] == 9)
                        $scope.rec_uright_form.allowuright_receive = true;
                }
            });

    };

    $scope.delete_uright = function (id, index, arr_data_ret) {

        var delUrl = $scope.$root.hr + "roles/delete-user-rights";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {

                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                        arr_data_ret.splice(index, 1);
                    }
                    else
                        toaster.pop('error', 'Info', 'Record cannot be Deleted.');

                });
        },
            function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
    };

    $scope.add_uright_form = function (rec_uright_form) {
        return;
        var updateUrl = $scope.$root.hr + "roles/add-user-rights";
        if ($scope.$root.urole > 0)
            var updateUrl = $scope.$root.hr + "roles/update-user-rights";

        $scope.rec_uright_form.token = $scope.$root.token;
        $scope.List = '';

        if ($scope.rec_uright_form.module.allowuright_add == true)
            $scope.List += 1 + ',';
        if ($scope.rec_uright_form.module.allowuright_edit == true)
            $scope.List += 2 + ',';
        if ($scope.rec_uright_form.module.allowuright_view == true)
            $scope.List += 3 + ',';
        if ($scope.rec_uright_form.module.allowuright_delete == true)
            $scope.List += 4 + ',';
        if ($scope.rec_uright_form.module.allowuright_approved == true)
            $scope.List += 5 + ',';
        if ($scope.rec_uright_form.module.allowuright_convert == true)
            $scope.List += 6 + ',';
        if ($scope.rec_uright_form.module.allowuright_dispatch == true)
            $scope.List += 7 + ',';
        if ($scope.rec_uright_form.module.allowuright_post == true)
            $scope.List += 8 + ',';
        if ($scope.rec_uright_form.module.allowuright_receive == true)
            $scope.List += 9 + ',';

        $scope.rec_uright_form.selectedList = $scope.List.substring(0, $scope.List.length - 1);

        $scope.rec_uright_form.module_id = $scope.rec_uright_form.module !== undefined ? $scope.rec_uright_form.module.id : 0;
        $scope.rec_uright_form.name = $scope.rec_uright_form.module !== undefined ? $scope.rec_uright_form.module.name : 0;

        $http
            .post(updateUrl, $scope.rec_uright_form)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));

                    $scope.get_uright_list($scope.$root.urole);

                }
                else
                    toaster.pop('error', 'info', res.data.error);
            });


    }

    $scope.getChildrens = function (record) {
        var newArr = [];
        angular.forEach($scope.rec_uright_tree, function (obj, index) {
            if (obj.parent_id == record.id) {
                newArr.push(obj);
            }
        });
        return newArr;
    }


    $scope.get_tree_data = function () {
        $scope.showLoader = true;
        $scope.get_uright_list($stateParams.id).then(function () {
            $scope.rec_uright_tree = [];
            var postUrl_cat = $scope.$root.hr + "roles/get-user-rights-module-data";
            $http
                .post(postUrl_cat, { 'token': $scope.$root.token, 'display_id': 0 })
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.rec_uright_one = res.data.response;
                        /*$scope.rec_uright_two = res.data.response;
                         $scope.rec_uright_three = res.data.response;*/

                        $scope.rec_uright_tree = res.data.response;
                        angular.forEach($scope.rec_uright_tree, function (obj, index) {
                            angular.forEach($scope.ur_record, function (obj2, index2) {
                                if (obj.id == obj2.module_id) {
                                    var permissionsArray = obj2.permissions.split(", ");
                                    for (var i = 0; i < permissionsArray.length; i++) {
                                        if (permissionsArray[i] == "1") {
                                            permissionsArray[i] = "Add";
                                        }
                                        else if (permissionsArray[i] == "2") {
                                            permissionsArray[i] = "Edit";
                                        }
                                        else if (permissionsArray[i] == "3") {
                                            permissionsArray[i] = "View";
                                        }
                                        else if (permissionsArray[i] == "4") {
                                            permissionsArray[i] = "Delete";
                                        }
                                        else if (permissionsArray[i] == "5") {
                                            permissionsArray[i] = "Approved";
                                        }
                                        else if (permissionsArray[i] == "6") {
                                            permissionsArray[i] = "Convert";
                                        }
                                        else if (permissionsArray[i] == "7") {
                                            permissionsArray[i] = "Dispatch";
                                        }
                                        else if (permissionsArray[i] == "8") {
                                            permissionsArray[i] = "Post";
                                        }
                                        else if (permissionsArray[i] == "9") {
                                            permissionsArray[i] = "Receive";
                                        }
                                    }
                                    if (permissionsArray.length) {
                                        for (var i = 0; i < permissionsArray.length; i++) {
                                            if (permissionsArray[i] == "Add") {
                                                obj.allowuright_add = true;
                                            }
                                            else if (permissionsArray[i] == "Edit") {
                                                obj.allowuright_edit = true;
                                            }
                                            else if (permissionsArray[i] == "View") {
                                                obj.allowuright_view = true;
                                            }
                                            else if (permissionsArray[i] == "Delete") {
                                                obj.allowuright_delete = true;
                                            }
                                            else if (permissionsArray[i] == "Approved") {
                                                obj.allowuright_approved = true;
                                            }
                                            else if (permissionsArray[i] == "Convert") {
                                                obj.allowuright_convert = true;
                                            }
                                            else if (permissionsArray[i] == "Dispatch") {
                                                obj.allowuright_dispatch = true;
                                            }
                                            else if (permissionsArray[i] == "Post") {
                                                obj.allowuright_post = true;
                                            }
                                            else if (permissionsArray[i] == "Receive") {
                                                obj.allowuright_receive = true;
                                            }
                                        }
                                    }
                                }
                            });
                        });
                        /*	$.each(res.data.response,function(catIndex, catObj){
                         
                         $.each($scope.permision_arry ,function(Index, Obj){
                         catObj.pid=Obj.id;
                         catObj.pname=Obj.name;
                         });
                         $scope.rec_uright_tree.push(catObj);
                         });*/
                    }
                    else
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                    $scope.showLoader = false;
                });
        })

    };

    $scope.add_uright_tree = function () {

        /* $scope.rec_uright.selectedList = $scope.permision_arry.filter(function (namesDataItem) {
         return namesDataItem.checked;
         });*/

        //$scope.update_mainrole();

        var temp = [];
        var PostData = {};
        var selectedList = '';
        $.each($scope.rec_uright_tree, function (index, obj) {
            var List = '';
            var selectedList = '';

            if (obj.allowuright_add == true)
                List += 1 + ',';
            if (obj.allowuright_edit == true)
                List += 2 + ',';
            if (obj.allowuright_view == true)
                List += 3 + ',';
            if (obj.allowuright_delete == true)
                List += 4 + ',';
            if (obj.allowuright_approved == true)
                List += 5 + ',';
            if (obj.allowuright_convert == true)
                List += 6 + ',';
            if (obj.allowuright_dispatch == true)
                List += 7 + ',';
            if (obj.allowuright_post == true)
                List += 8 + ',';
            if (obj.allowuright_receive == true)
                List += 9 + ',';

            selectedList = List.substring(0, List.length - 1);
            if (selectedList.length > 0)
                temp.push({ name: obj.name, module_id: obj.id, permisions: selectedList, allow_flag: 0 });
        });

        if (selectedList.length) {
            toaster.pop('error', 'info', 'Select Permisions');
            return;
        }
        PostData.selected = temp;
        PostData.token = $scope.$root.token;
        PostData.role_id = $stateParams.id;
        var updateUrl = $scope.$root.hr + "roles/add-user-rights";
        //var updateUrl = $scope.$root.hr+"roles/add-user-rights-module-data"; 

        $scope.showLoader = true;
        $http
            .post(updateUrl, PostData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(101));

                    //$scope.get_uright_list($scope.$root.urole);

                }
                else
                    toaster.pop('error', 'info', res.data.error);

                $scope.check_permison_readonly = true;
            });
    }


    //	 angular.element(document).on('click', '.checkAllrole', function () {
    $scope.check_nested = function (level_index, id, classs) {

        if (angular.element('.' + classs).is(':checked') == true) {
            for (var i = 0; i < $scope.rec_uright_tree.length; i++) {
                if (level_index == [i] && id == $scope.rec_uright_tree[i].id) {
                    //	$scope.enable_check_value([i],true)

                    angular.element('#selected_subs_' + $scope.rec_uright_tree[i].name).prop('checked');

                    /* for (var j = 0;j < $scope.rec_uright_tree.length; j++) {
                     if($scope.rec_uright_tree[j].parent_id > $scope.rec_uright_tree[i].id) 
                     $scope.enable_check_value([j],true)
                     }*/
                }
            }
        }
        else {
            for (var i = 0; i < $scope.rec_uright_tree.length; i++) {
                if (level_index == [i]) {
                    $scope.enable_check_value([i], false)
                    for (var j = 0; j < $scope.rec_uright_tree.length; j++) {
                        if ($scope.rec_uright_tree[j].parent_id > $scope.rec_uright_tree[i].id)
                            $scope.enable_check_value([j], false)
                    }
                }
            }
        }

    }
    //});
    $scope.enable_check_value = function (index, val) {
        $scope.rec_uright_tree[index].test = val;
        $scope.rec_uright_tree[index].allowuright_add = val;
        $scope.rec_uright_tree[index].allowuright_view = val;
        $scope.rec_uright_tree[index].allowuright_edit = val;
        $scope.rec_uright_tree[index].allowuright_delete = val;
        $scope.rec_uright_tree[index].allowuright_approved = val;
        $scope.rec_uright_tree[index].allowuright_convert = val;
        $scope.rec_uright_tree[index].allowuright_dispatch = val;
        $scope.rec_uright_tree[index].allowuright_post = val;
        $scope.rec_uright_tree[index].allowuright_receive = val;
    }





    $scope.$root.load_date_picker('roles');
}]);


myApp.controller('RolesPermissionController', RolesPermissionController);
function RolesPermissionController($scope, $stateParams, $http, $state, $resource, toaster, $resource, $timeout) {

    $scope.class = 'block';
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','style':''},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Human Resources', 'url': 'app.setup', 'style': '', 'tabIndex': '7' },
            { 'name': 'Roles and Permissions', 'url': 'app.roles', 'style': '' },
            { 'name': 'User Rights', 'url': '#', 'style': 'color:#515253;' }];



    $scope.rec = {};
    var table = 'roles';
    $scope.role = {};
    $resource('api/company/fill_combo/roles/role/id/0/role/0').get(function (data) {

        $scope.role = data.combo_data;
        //$scope.role = $scope.role[data.selected_comp]; 
    });



    $scope.rec = {};

    var id = $stateParams.id;
    var table = 'roles';
    $scope.rec = $resource('api/company/get_record/:id/:table').get({ id: id, table: table }, function (data) {
        return data;
    });

    $scope.update = function (rec) {
        $scope.rec.table = 'roles';
        $http
            .post('api/company/edit', rec)
            .then(function (res) {
                if (res.data == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $timeout(function () {
                        $state.go('app.roles');

                    }, 1000);
                }
                else
                    toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
            });
    }

}

