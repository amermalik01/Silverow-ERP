myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.modules-codes', {
                url: '/modules-codes',
                title: 'Setup',
                templateUrl: helper.basepath('modules_codes/modules_codes.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog")
            })
            .state('app.addModuleCode', {
                url: '/modules-codes/add',
                title: 'Setup',
                templateUrl: helper.basepath('modules_codes/_form.html'),
                controller: 'ModuleCodeAddController',
                resolve: helper.resolveFor("ngDialog")
            })
            .state('app.editModuleCode', {
                url: '/modules-codes/:id/edit',
                title: 'Setup',
                templateUrl: helper.basepath('modules_codes/_form.html'),
                controller: 'ModuleCodeAddController',
                resolve: helper.resolveFor("ngDialog")
            })
    }]);

/*ModuleCodeEditController*/

/*
 templateUrl: helper.basepath('edit.html'),*/

ModuleCodeController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "ngTableDataService", "$http", "ngDialog", "toaster", "$rootScope", "$timeout",];
myApp.controller('ModuleCodeController', ModuleCodeController);
function ModuleCodeController($scope, $filter, ngParams, $resource, ngDataService, $http, ngDialog, toaster, $rootScope, $timeout) {
    'use strict';

    $scope.class = 'inline_block';

    $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
    { 'name': 'General', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
    { 'name': 'Module Codes', 'url': '#', 'isActive': false }];

    angular.element('ul.level-1 li').each(function (index) {
        if (angular.element(this).hasClass('active')) {
            angular.element(this).removeClass('active');
        }
    });
    $scope.showLoader = true;
    var vm = this;
    var Api = $scope.$root.setup + "general/modules-codes";

    var postData = {
        'token': $scope.$root.token,
        'all': "1"
    };
    $scope.module_codes_arr = [];
    $http
        .post(Api, { all: '1', 'token': $scope.$root.token })
        .then(function (res) {

            if (res.data.ack == true) {
                $scope.module_codes_arr = res.data.response;
            }
            else
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(108));
                $scope.showLoader = false;
        });
    /* 
        $scope.$watch("MyCustomeFilters", function () {
            if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
                $scope.table.tableParams5.reload();
            }
        }, true);
    
        $scope.MyCustomeFilters = {}
    
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
                    $scope.checkData = ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);
                }
            }); */


    $scope.delete = function (id, index, arr_data) {
        var delUrl = $scope.$root.setup + "general/delete-module-code";
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
                    }
                    else
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(108));

                });
        }, function (reason) {
            // console.log('Modal promise rejected. Reason: ', reason);
        });
    };
}


myApp.controller('ModuleCodeAddController', ModuleCodeAddController);
function ModuleCodeAddController($scope, $stateParams, $http, $state, ngDialog, toaster, $rootScope, $timeout) {
    $scope.formTitle = 'Module Code';
    $scope.btnCancelUrl = 'app.modules-codes';
    $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false },
    { 'name': 'General', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
    { 'name': 'Module Codes', 'url': 'app.modules-codes', 'isActive': false }];
    // { 'name': 'Add', 'url': '#', 'isActive': false }];

    angular.element('ul.level-1 li').each(function (index) {
        if (angular.element(this).hasClass('active')) {
            angular.element(this).removeClass('active');
        }
    });

    $scope.rec = {};
    $scope.brandDetails = {};

    $scope.status = [{ 'id': 1, 'name': 'Active' }, { 'id': 0, 'name': 'Inactive' }];
    $scope.rec.genric_status = $scope.status[0];

    $scope.formUrl = function () {
        return "app/views/modules_codes/_form.html";
    }

    $scope.history = [];

    var postUrl = $scope.$root.setup + "general/add-module-code";
    var controllerUrl = $scope.$root.setup + "general/controllers";
    var checkCodeUrl = $scope.$root.setup + "general/get-controller";
    var getModuleValueUrl = $scope.$root.setup + "general/get-module-value";
    var historyUrl = $scope.$root.setup + "general/get-module-code-history";

    $scope.add_category = false;
    $scope.add_brand = false;
    $scope.types = [];
    $scope.module_categories = {};
    $scope.module_brands = {};
    $scope.columnss_cat = [];
    $scope.columnss_bnd = [];
    $scope.types.push({ "id": "0", "name": "Internal" });
    $scope.types.push({ "id": "1", "name": "External" });
    $scope.controllerFlag = false;

    $http
        .post(controllerUrl, { 'token': $scope.$root.token })
        .then(function (res) {
            if (res.data.ack == true)
                $scope.controllers = res.data.response;

            else
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(232, ['Country']));
        });

    $scope.check_readonly = false;

    $scope.gotoEdit = function () {
        $scope.check_readonly = false;
    }

    $scope.getModuleCodeHistory = function (id) {

        var postData = {
            'token': $scope.$root.token,
            'id': id
        };
        $http
            .post(historyUrl, postData)
            .then(function (res) {

                if (res.data.ack == true) {
                    $scope.columns_code_history = [];
                    $scope.history = [];
                    $scope.history = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_code_history.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });


                    angular.element('#module_code_history').modal({ show: true });
                } else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                    $scope.columns_code_history = [];
                    $scope.history = [];
                }

            });
    }

    $scope.resettoogleshow = function (arg) {

        if (arg == 1) {
            $scope.display_brand_body = false;
            $scope.display_cat_body = false;
            $scope.display_gen_body = true;
        }
        else if (arg == 2) {
            $scope.display_brand_body = false;
            $scope.display_cat_body = true;
            $scope.display_gen_body = false;
        }
        else if (arg == 3) {
            $scope.display_brand_body = true;
            $scope.display_cat_body = false;
            $scope.display_gen_body = false;
        }
    }


    if ($stateParams.id > 0) {
        $scope.check_readonly = true;
        //$scope.check_hrvalues_readonly = true;
        // $scope.perreadonly = false;
        //  console.log($stateParams.id);
        $scope.rec = {};

        var get_module_code = $scope.$root.setup + "general/get-module-code";

        $http
            .post(get_module_code, { 'token': $scope.$root.token, 'id': $stateParams.id })
            .then(function (ress) {

                if (ress.data.ack == true) {
                    // console.log(ress.data.response);

                    $scope.controllerFlag = true;
                    $scope.display_brand_body = false;
                    $scope.display_cat_body = false;
                    $scope.display_gen_body = true;
                    $scope.controllers2 = ress.data.modulesList.response;

                    //$scope.rec.controllers = ress.data.response.module_code_id;

                    angular.forEach($scope.controllers2, function (value, index) {
                        if (ress.data.response.module_code_id == value.id)
                            $scope.rec.controllers = value;
                    });

                    // console.log(ress.data.response.type);

                    $scope.rec.generic_id = ress.data.response.id;
                    $scope.rec.genericIntExt = ress.data.response.type;
                    $scope.hideExternal(!$scope.rec.genericIntExt);
                    $scope.rec.generic_prefix = ress.data.response.prefix;
                    $scope.rec.generic_range_from = ress.data.response.range_from;
                    $scope.rec.generic_range_to = ress.data.response.range_to;

                    var rangeToLength = ress.data.response.range_to.length;

                    if (ress.data.response.last_sequence_num > 0 && !($scope.rec.brand_id > 0)){
                        var lastSequenceNumVar = ress.data.response.last_sequence_num - 1;
                        $scope.rec.last_sequence_num = (ress.data.response.last_sequence_num != null) ? ($scope.rec.generic_prefix + String(lastSequenceNumVar).padStart(rangeToLength, '0')) : '';
                    }

                    // console.log(ress.data.response.last_sequence_num.padStart(rangeToLength, '0'));

                    // $scope.rec.last_sequence_num = ress.data.response.last_sequence_num;
                    $scope.rec.brand_id = ress.data.response.brand_id;
                    // $scope.rec.genric_status = ress.data.response.status;

                    if ($scope.rec.brand_id > 0) {

                        $scope.add_brand = true;
                        $scope.resettoogleshow(3);

                        angular.forEach($scope.types, function (obj) {

                            if (obj.id == ress.data.response.type) {
                                $scope.rec.brand_type = obj;
                            }
                        });

                        angular.forEach($rootScope.brand_prodcut_arr,function(obj){

                            if (obj.id == $scope.rec.brand_id){
                                $scope.rec.brand_brand = obj;
                            }
                        });

                        $scope.rec.brand_prefix = ress.data.response.prefix;
                        $scope.rec.brand_range_from = ress.data.response.range_from;// Number()
                        $scope.rec.brand_range_to = ress.data.response.range_to;   
                        
                        var brandRangeToLength = ress.data.response.range_to.length;

                        if (ress.data.response.last_sequence_num > 0 && ($scope.rec.brand_id > 0)) {
                            var lastSequenceNumVar = ress.data.response.last_sequence_num - 1;
                            $scope.rec.last_sequence_num = (ress.data.response.last_sequence_num != null) ? ($scope.rec.brand_prefix + String(lastSequenceNumVar).padStart(brandRangeToLength, '0')) : '';
                            // $scope.rec.last_sequence_num = (ress.data.response.last_sequence_num != null) ? ($scope.rec.generic_prefix + lastSequenceNumVar.padStart(rangeToLength, '0')) : '';
                        }
                    }

                    $scope.rec.module_category = ress.data.response.module_category_id;

                    angular.forEach($scope.status, function (value) {
                        if (ress.data.response.status == value.id)
                            $scope.rec.genric_status = value;
                    });



                    //  console.log($scope.rec.generic_range_from);
                }
            });
    }
    else
        $scope.rec.genericIntExt = 0;

    $scope.showEditForm = function () {
        $scope.check_module_readonly = false;
        //$scope.perreadonly = true;
    }

    $scope.toggleCategoryForm = function (toggleCat) {
        $scope.add_category = toggleCat;
        $scope.rec.category_id = "";
        $scope.rec.category_category = "";
        $scope.rec.category_type = "";
        $scope.rec.category_prefix = "";
        $scope.rec.category_range_from = "";
        $scope.rec.category_range_to = "";
    }

    $scope.cat_index = "";
    $scope.bnd_index = "";

    $scope.showCategoryEditForm = function (record, index) {

        $scope.cat_index = index;
        $scope.add_category = true;
        $scope.rec.category_id = record.id;
        $scope.rec.category_prefix = record.prefix;
        $scope.rec.category_range_from = record.range_from;
        $scope.rec.category_range_to = record.range_to;

        angular.forEach($rootScope.cat_prodcut_arr, function (obj) {
            if (obj.id == record.category_id)
                $scope.rec.category_category = obj;
        });
        /* angular.forEach($scope.category, function (value, index) {
            if (record.category_id == value['id']) {
                $scope.rec.category_category = value;
            }
        }); */
        angular.forEach($scope.types, function (value, index) {
            if (record.type == "Internal" & value['id'] == 0) {
                $scope.rec.category_type = value;
            }
            else if (record.type == "External" & value['id'] == 1) {
                $scope.rec.category_type = value;
            }
        });

        angular.forEach($scope.status, function (value) {
            if (record.status == value.id)
                $scope.rec.category_status = value;
        });
    }

    $scope.toggleBrandForm = function (toggleBrd) {
        $scope.add_brand = toggleBrd;
        $scope.rec.brand_id = "";
        $scope.rec.brand_brand = "";
        $scope.rec.brand_type = "";
        $scope.rec.brand_prefix = "";
        $scope.rec.brand_range_from = "";
        $scope.rec.brand_range_to = "";
        $scope.check_readonly = false;
    }

    $scope.showBrandEditForm = function (record, index) {
        $scope.bnd_index = index;
        $scope.add_brand = true;
        $scope.rec.brand_id = record.id;
        $scope.rec.brand_prefix = record.prefix;
        $scope.rec.brand_range_from = record.range_from;
        $scope.rec.brand_range_to = record.range_to;

        angular.forEach($rootScope.brand_prodcut_arr, function (obj) {
            if (obj.id == record.brand_id)
                $scope.rec.brand_brand = value;
        });

        /* angular.forEach($scope.brandnames, function (value, index) {
            if (record.brand_id == value['id']) {
                $scope.rec.brand_brand = value;
            }
        }); */

        angular.forEach($scope.types, function (value, index) {
            if (record.type == "Internal" & value['id'] == 0) {
                $scope.rec.brand_type = value;
            } else if (record.type == "External" & value['id'] == 1) {
                $scope.rec.brand_type = value;

            }
        });

        angular.forEach($scope.status, function (value, index) {
            if (record.status == value['id']) {
                $scope.rec.brand_status = value;
            }
        });
    }

    $scope.rec.hide_internal_div = true;

    $scope.hideExternal = function (type) {
        $scope.rec.hide_internal_div = false;

        if (type == 1)
            $scope.rec.hide_internal_div = true;
    }

    $scope.setModule = function (module_cat) {
        $scope.rec.module_category = module_cat;
    }

    $scope.moduleValues = function (controller) {
        $scope.controllerFlag = true;
        $scope.rec.generic_id = "";
        $scope.rec.generic_prefix = "";
        $scope.rec.generic_range_from = "";
        $scope.rec.generic_range_to = "";
        $scope.rec.brand_id = "";
        $scope.rec.brand_brand = "";
        $scope.rec.brand_type = "";
        $scope.rec.brand_prefix = "";
        $scope.rec.brand_range_from = "";
        $scope.rec.brand_range_to = "";
        $scope.rec.category_id = "";
        $scope.rec.category_category = "";
        $scope.rec.category_type = "";
        $scope.rec.category_prefix = "";
        $scope.rec.category_range_from = "";
        $scope.rec.category_range_to = "";
        $scope.module_categories = [];
        $scope.module_brands = [];
        $scope.columnss_cat = [];
        $scope.columnss_bnd = [];

        $http
            .post(getModuleValueUrl, { 'token': $scope.$root.token, 'controller': controller })
            .then(function (ress) {
                if (ress.data.ack == true) {
                    var count = 0;

                    if (ress.data.response.generic != undefined) {
                        angular.forEach(ress.data.response.generic, function (val, index) {
                            if (val['mc_id'] == 2 && val['type'] == 0) {
                                $scope.rec.genericIntExt = 0;
                                $scope.rec.generic_id = val['id'];
                                $scope.rec.generic_prefix = val['prefix'];
                                $scope.rec.generic_range_from = val['range_from'];
                                $scope.rec.generic_range_to = val['range_to'];

                                angular.forEach($scope.status, function (value, index) {
                                    if (val.status == value['status']) $scope.rec.genric_status = value;
                                });
                            }
                            if (val['mc_id'] == 2 && val['type'] == 1) {
                                $scope.rec.generic_id = val['id'];
                                $scope.rec.genericIntExt = 1;
                            }
                        });
                    }

                    if (ress.data.response.category != undefined) {
                        angular.forEach(ress.data.response.category[0], function (val, index) {
                            if (index == 'category' || index == 'type' || index == 'prefix' || index == 'range_from' || index == 'range_to' || index == 'id' || index == 'status') {
                                $scope.columnss_cat.push({
                                    'title': toTitleCase(index),
                                    'field': index,
                                    'visible': true
                                });
                            }
                        });

                        $scope.module_categories = ress.data.response.category;
                    }

                    if (ress.data.response.brand != undefined) {
                        angular.forEach(ress.data.response.brand[0], function (val, index) {
                            if (index == 'brand' || index == 'type' || index == 'prefix' || index == 'range_from' || index == 'range_to' || index == 'id' || index == 'status') {
                                $scope.columnss_bnd.push({
                                    'title': toTitleCase(index),
                                    'field': index,
                                    'visible': true
                                });
                            }
                        });
                        $scope.module_brands = ress.data.response.brand;
                    }

                } else { //Shahzada

                    var name = $scope.rec.controllers.name;
                    $scope.rec.generic_prefix = name.substr(0, 4);
                    $scope.rec.generic_range_from = "0001";
                    $scope.rec.generic_range_to = "9999";

                    $scope.display_brand_body = false;
                    $scope.display_cat_body = false;
                    $scope.display_gen_body = true;
                }
            });
    }

    $scope.delete_rule = function (id, index, arr_data) {
        var delUrl = $scope.$root.setup + "general/delete-module-rule";
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
                        //angular.element('#id_'+id).hide();
                        //angular.element('.st_'+id).html('Inactive');
                    } else {
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            // console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.chkForBrand = function (brand) {

        if (brand > 0) {

            var chkForBrandUrl = $scope.$root.stock + "products-listing/chk-for-brand";
            // $scope.showLoader = true;

            $http
                .post(chkForBrandUrl, { 'token': $scope.$root.token, 'brand': brand })
                .then(function (res) {

                    $scope.brandDetails = {};

                    if (res.data.ack == 1) {                        

                        $scope.brandDetails.brandModuleType = res.data.moduleType;
                        $scope.brandDetails.brandModuleCategoryID = res.data.module_category_id;
                        $scope.brandDetails.brandlastSequenceNum = res.data.last_sequence_num;
                        $scope.brandDetails.brandPrefix = res.data.prefix;
                        $scope.brandDetails.brandrangeFrom = res.data.range_from; 
                        $scope.brandDetails.brandrangeTo = res.data.range_to;
                        $scope.brandDetails.brandmoduleCodeID = res.data.module_code_id;

                        $scope.brandDetails.brandModuleType = res.data.moduleType;
                        $scope.brandDetails.brandModuleCategoryID = res.data.module_category_id;
                        // $scope.rec.last_sequence_num = res.data.last_sequence_num;
                        $scope.rec.brand_prefix = res.data.prefix;
                        $scope.rec.brand_range_from = res.data.range_from;
                        $scope.rec.brand_range_to = res.data.range_to;
                        // $scope.res.module_code_id = res.data.module_code_id;

                        var brandRangeToLength = res.data.range_to.length;

                        if (res.data.last_sequence_num > 0) {
                            var lastSequenceNumVar = res.data.last_sequence_num - 1;
                            $scope.rec.last_sequence_num = (res.data.last_sequence_num != null) ? ($scope.rec.brand_prefix + String(lastSequenceNumVar).padStart(brandRangeToLength, '0')) : '';
                            // $scope.rec.last_sequence_num = (ress.data.response.last_sequence_num != null) ? ($scope.rec.generic_prefix + lastSequenceNumVar.padStart(rangeToLength, '0')) : '';
                        }

                    }
                    else {
                        $scope.rec.brand_prefix = '';
                        $scope.rec.brand_range_from = '';
                        $scope.rec.brand_range_to = '';
                        $scope.rec.last_sequence_num = '';
                    } 
                });
        }
    }

    

    $scope.add = function (rec) {
         $scope.showLoader = true;
        rec.token = $scope.$root.token;
        rec.module_title = rec.controllers.name;
        rec.table = rec.controller = rec.controllers.id;
        rec.g_status = (rec.genric_status !== undefined && rec.genric_status != null) ? rec.genric_status.id : 0;
        rec.brand_status = $scope.status[0];
        rec.brand_id = (rec.brand_brand != undefined && rec.brand_brand != '') ? rec.brand_brand.id : 0;

        
        if (rec.brand_id>0){

            if (rec.brand_type == undefined || rec.brand_type == '') {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(300, ['Module Type']));
                return false;
            }
            
            var brandType = (rec.brand_type != undefined && rec.brand_type != '') ? rec.brand_type.id : 0;

            if (brandType  != 1){

                if (!rec.brand_prefix.match(/^([a-z\(\)]+)$/i)) {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(300, ['Prefix']));
                    return false;
                }

                if (!(Number(rec.brand_range_from) > 0)) {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(238, ['Brand Range From', '0']));
                    return false;
                }

                if (!(Number(rec.brand_range_to) > 0)) {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(238, ['Brand Range To', '0']));
                    return false;
                }
            }               
        }
        else if (rec.genericIntExt == 0){
            if (!rec.generic_prefix.match(/^([a-z\(\)]+)$/i)) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(300, ['Prefix']));
                return false;
            }

            if (!(Number(rec.generic_range_from) > 0)) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(238, ['Range From', '0']));
                return false;
            }

            if (!(Number(rec.generic_range_to) > 0)) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(238, ['Range To', '0']));
                return false;
            }
        }

        
        // console.log($scope.rec);
        // console.log($scope.rec.genericIntExt);
        $scope.module_brands = [];
        $http
            .post(postUrl, rec)
            .then(function (ress) {
                if (ress.data.ack == 1) {

                    if (ress.data.action == "Edit")
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
                    else
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    
                    $timeout(function () {
                        $state.go('app.modules-codes');
                    }, 3000);
                    $scope.showLoader = false;
                }
                else if (ress.data.ack == 2)
                    toaster.pop('error', 'Add', ress.data.error);
                else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(105));

                    $scope.showLoader = false;
            });
    }

}