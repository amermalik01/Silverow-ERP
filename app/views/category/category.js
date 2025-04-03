myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.category', {
                url: '/category',
                title: 'Setup',
                templateUrl: helper.basepath('category/category.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.addCategory', {
                url: '/category/add',
                title: 'Setup',
                templateUrl: helper.basepath('add.html'),
                controller: 'CategoryAddController'
            })
            .state('app.viewCategory', {
                url: '/categories/:id/view',
                title: 'Setup',
                templateUrl: helper.basepath('view.html'),
                resolve: angular.extend(helper.resolveFor('ngDialog'), {
                    tpl: function () {
                        return { path: helper.basepath('ngdialog-template.html') };
                    }
                }),
                controller: 'CategoryViewController'
            })

            .state('app.editCategory', {
                url: '/categories/:id/edit',
                title: 'Setup',
                templateUrl: helper.basepath('edit.html'),
                resolve: angular.extend(helper.resolveFor('ngDialog'), {
                    tpl: function () {
                        return { path: helper.basepath('ngdialog-template.html') };
                    }
                }),
                controller: 'CategoryEditController'
            })


    }]);


CategoryController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService"
    , "$http", "toaster", "ngDialog"];
myApp.controller('CategoryController', CategoryController);
myApp.controller('CategoryAddController', CategoryAddController);
myApp.controller('CategoryViewController', CategoryViewController);
myApp.controller('CategoryEditController', CategoryEditController);

function CategoryController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, toaster, ngDialog) {
    'use strict';

    // required for inner references
    $scope.showLoader = true;
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Inventory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
            { 'name': 'Categories', 'url': '#', 'isActive': false }];

    var vm = this;
    var Api = $scope.$root.stock + "categories";
    var postData = {
        'token': $scope.$root.token,
        'all': "1"
    };

    $scope.record = [];
    $scope.columns = [];

    $http
        .post(Api, postData)
        .then(function (res) {
            
            $scope.showLoader = false;
            if (res.data.ack == true) {
                // toaster.pop('success', 'Deleted', 'Record Deleted ');
                $scope.record = res.data.response;
                // $scope.columns = res.data.response;

                angular.forEach($scope.record, function (val) {
                    $scope.brand = '';
                    angular.forEach(val.brand, function (val2) {

                        $scope.brand += val2 + ', ';
                    });

                    $scope.brand = $scope.brand.substring(0, $scope.brand.length - 2);
                    val.brand = $scope.brand;
                });
                
                // console.log($scope.record);

                angular.forEach(res.data.response[0], function (val, index) {
                    $scope.columns.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                });
            }
        });

    /* $scope.$watch("MyCustomeFilters", function () {
        if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
            $scope.table.tableParams5.reload();
        }
    }, true);
    $scope.MyCustomeFilters = {}
    $scope.checkData = {};
    //console.log($scope);
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

    $scope.$data = {}; */

    $scope.deleteCategory = function (id, index, $data) {
        var delUrl = $scope.$root.stock + "categories/delete-category";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { 'token': $scope.$root.token, id: id })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', 'Record Deleted');
                        $data.splice(index, 1);
                    }
                    else {
                        toaster.pop('error', 'Can\'t be deleted', res.data.error);
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    $scope.warehouse_allocation_cost = 0;
}


function CategoryAddController($scope, $stateParams, $http, $state, $timeout, toaster, $rootScope, $filter) {

    $scope.btnCancelUrl = 'app.category';
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Inventory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
            { 'name': 'Categories', 'url': '#', 'isActive': false }];
    // { 'name': 'Add', 'url': '#', 'isActive': false }];

    $scope.formUrl = function () {
        return "app/views/category/_form.html";
    }

    var postUrl = $scope.$root.stock + "categories/add-category";
    //alert(postUrl);
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];
    $scope.rec = {};
    $scope.status = {};
    $scope.brandSelArray = [];
    $scope.rec.status = $scope.arr_status[0];

    $scope.add = function (rec) {
        rec.token = $scope.$root.token;
        rec.statusid = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;
        rec.brandSelArray = $scope.brandSelArray;
        $scope.showLoader = true;
        $http
            .post(postUrl, rec)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));

                    $rootScope.updateSelectedGlobalData("category");
                    $rootScope.updateSelectedGlobalData("brand");

                    $timeout(function () {
                        $state.go('app.category');
                    }, 1000);
                }
                else
                    toaster.pop('error', 'Info', res.data.error);

                    
            });
    }

    //$scope.warehouse_allocation_cost = 0;

    $scope.getBrands = function () {

        // $scope.title = 'Categories';
        $scope.title = 'Brands';
        $scope.showLoader = true;
        $scope.columns = [];
        $scope.Brandsarray = [];

        if ($rootScope.brand_prodcut_arr != undefined) {
            if ($rootScope.brand_prodcut_arr.length > 0) {

                $scope.Brandsarray = $rootScope.brand_prodcut_arr;
                $scope.columns = $rootScope.brand_prodcut_arr;
                angular.element('#brandsModal').modal({ show: true });
            }
            else
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
        }
        else
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));


        $scope.showLoader = false;
    }


    $scope.selectbrandschk = function (cat) {

        $scope.selectedAll = false;

        for (var i = 0; i < $scope.Brandsarray.length; i++) {

            if (cat.id == $scope.Brandsarray[i].id) {

                if ($scope.Brandsarray[i].chk == true)
                    $scope.Brandsarray[i].chk = false;
                else
                    $scope.Brandsarray[i].chk = true;
            }
        }
    }
    $scope.searchKeyword = {};
    $scope.checkAllbrands = function (val) {
        var selection_filter = $filter('filter');
        var filtered = selection_filter($scope.Brandsarray, $scope.searchKeyword.search);
        
        $scope.PendingSelbrand = [];

        if (val == true) {

            angular.forEach(filtered, function (obj) {
				obj.chk = true;
				$scope.PendingSelbrand.push(obj);
            })
            
            // for (var i = 0; i < $scope.Brandsarray.length; i++) {
            //     $scope.Brandsarray[i].chk = true;
            //     $scope.PendingSelbrand.push($scope.Brandsarray[i]);
            // }
        } else {
            angular.forEach($scope.Brandsarray, function (obj) {
				obj.chk = false;
            })

            // for (var i = 0; i < $scope.Brandsarray.length; i++) {
            //     $scope.Brandsarray[i].chk = false;
            // }

            $scope.PendingSelbrand = [];
        }
    }

    $scope.submitPendingSelbrands = function () {

        $scope.PendingSelbrand = [];
        $scope.PendingSelbrandTooltip = "";

        for (var i = 0; i < $scope.Brandsarray.length; i++) {

            if ($scope.Brandsarray[i].chk == true) {
                $scope.PendingSelbrand.push($scope.Brandsarray[i]);
                $scope.PendingSelbrandTooltip = $scope.PendingSelbrandTooltip + $scope.Brandsarray[i].title + "; ";
            }
        }

        $scope.PendingSelbrandTooltip = $scope.PendingSelbrandTooltip.slice(0, -2);

        $scope.brandSelArray = $scope.PendingSelbrand;
        $scope.SelbrandTooltip = $scope.PendingSelbrandTooltip;

        angular.element('#brandsModal').modal('hide');
    }

    $scope.clearPendingSelbrands = function () {
        $scope.PendingSelbrand = [];
        $scope.PendingSelbrandTooltip = "";
        angular.element('#brandsModal').modal('hide');
    }
}

function CategoryViewController($scope, $stateParams, $http, $state, $timeout, $resource, ngDialog, toaster, $rootScope) {
    $scope.btnCancelUrl = 'app.category';
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Inventory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
            { 'name': 'Categories', 'url': 'app.category', 'isActive': false }];

    $scope.formUrl = function () {
        return "app/views/category/_form.html";
    }

    $scope.gotoEdit = function () {
        $state.go("app.editCategory", { id: $stateParams.id });
    };


    $scope.rec = {};
    $scope.status = {};
    $scope.brandSelArray = [];
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];
    var postUrl = $scope.$root.stock + "categories/get-category";
    var postData = {
        'token': $scope.$root.token,
        'id': $stateParams.id
    };
    $scope.showLoader = true;
    $http
        .post(postUrl, postData)
        .then(function (res) {
            /* $scope.rec = res.data.response;
            $.each($scope.arr_status, function (index, obj) {
                if (obj.value == res.data.response.status) {
                    $scope.rec.status = $scope.arr_status[index];
                }
            }); */

            if (res.data.ack == true) {
                $scope.rec.id = res.data.id;
                $scope.rec.name = res.data.name;
                $scope.rec.description = res.data.description;

                if ($rootScope.brand_prodcut_arr.length > 0) {

                    angular.forEach($rootScope.brand_prodcut_arr, function (obj) {
                        obj.chk = false;

                        if (res.data.brands.length > 0) {

                            angular.forEach(res.data.brands, function (obj2) {
                                if (obj.id == obj2.brandID) {
                                    obj.chk = true;
                                    $scope.brandSelArray.push(obj);
                                }
                            });
                        }
                    });
                }

                angular.forEach($scope.arr_status, function (obj) {
                    if (obj.value == res.data.status) {
                        $scope.rec.status = obj;
                    }
                });
            }
                $scope.showLoader = false;
        });


    var delUrl = $scope.$root.stock + "categories/delete-category";

    $scope.delete = function () {
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default'
        }).then(function (value) {
            $http
                .post(delUrl, postData)
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', 'Record Deleted ');
                        $timeout(function () {
                            $state.go('app.category');
                        }, 1500);
                    }
                    else {
                        toaster.pop('error', 'Can\'t be deleted', res.data.error);
                        $timeout(function () {
                            $state.go('app.category');
                        }, 1500);
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

        //if(popupService.showPopup('Would you like to delete?')) {

        //  }*/
    };

};

function CategoryEditController($scope, $stateParams, $http, $state, $timeout, $resource, toaster, $rootScope, ngDialog, $filter) {


    $scope.btnCancelUrl = 'app.category';
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Inventory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
            { 'name': 'Categories', 'url': 'app.category', 'isActive': false }];

    $scope.rec = {};
    $scope.status = {};
    $scope.brandSelArray = [];
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

    var postUrl = $scope.$root.stock + "categories/get-category";
    var postData = {
        'token': $scope.$root.token,
        'id': $stateParams.id
    };

    $http
        .post(postUrl, postData)
        .then(function (res) {

            if (res.data.ack == true) {

                $scope.rec.name = res.data.name;
                $scope.rec.description = res.data.description;
                $scope.rec.id = res.data.id;
                $scope.rec.deletePerm = 1;
                if ($rootScope.brand_prodcut_arr.length > 0) {

                    angular.forEach($rootScope.brand_prodcut_arr, function (obj) {
                        obj.chk = false;

                        if (res.data.brands.length > 0) {

                            angular.forEach(res.data.brands, function (obj2) {
                                if (obj.id == obj2.brandID) {
                                    obj.chk = true;
                                    $scope.brandSelArray.push(obj);
                                }
                            });
                        }
                    });
                }

                angular.forEach($scope.arr_status, function (obj) {
                    if (obj.value == res.data.status) {
                        $scope.rec.status = obj;
                    }
                });
            }
            /* $scope.rec = res.data.response;
            $.each($scope.arr_status, function (index, obj) {
                if (obj.value == res.data.response.status) {
                    $scope.rec.status = $scope.arr_status[index];
                }
            }); */
        });

    $scope.formUrl = function () {
        return "app/views/category/_form.html";
    }

    $scope.delete = function (id, index, $data) {
        var delUrl = $scope.$root.stock + "categories/delete-category";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http.post(delUrl, { 'token': $scope.$root.token, id: id })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', res.data.success);
                        $timeout(function () {
                            $state.go('app.category');
                        }, 1500);
                    } else {
                        toaster.pop('error', 'Error', res.data.error);
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    var postUrl = $scope.$root.stock + "categories/update-category";
    $scope.rec = {};
    $scope.update = function (rec) {
        rec.token = $scope.$root.token;
        rec.id = $stateParams.id;
        rec.statusid = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;
        rec.brandSelArray = $scope.brandSelArray;
        $scope.showLoader = true;
        $http
            .post(postUrl, rec)
            .then(function (res) {
                if (res.data.ack == 1) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));

                    $rootScope.updateSelectedGlobalData("category");
                    $rootScope.updateSelectedGlobalData("brand");

                    $timeout(function () {
                        $state.go('app.category');
                    }, 1500);
                }
                else toaster.pop('error', 'Edit', res.data.error);

                $scope.showLoader = false;
                /*else if(res.data.ack == 2){
                 toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(107));
                 // $timeout(function(){ $state.go('app.category'); }, 3000);
                 } else if(res.data.ack == 0){
                 toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                 $timeout(function(){ $state.go('app.category'); }, 3000);
                 }*/
            });
    }

    $scope.getBrands = function () {

        // $scope.title = 'Categories';
        $scope.title = 'Brands';
        $scope.showLoader = true;
        $scope.columns = [];
        $scope.Brandsarray = [];

        if ($rootScope.brand_prodcut_arr != undefined) {
            if ($rootScope.brand_prodcut_arr.length > 0) {

                $scope.Brandsarray = $rootScope.brand_prodcut_arr;
                $scope.columns = $rootScope.brand_prodcut_arr;
                angular.element('#brandsModal').modal({ show: true });
            }
            else
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
        }
        else
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));


        $scope.showLoader = false;
    }


    $scope.selectbrandschk = function (cat) {

        $scope.selectedAll = false;

        for (var i = 0; i < $scope.Brandsarray.length; i++) {

            if (cat.id == $scope.Brandsarray[i].id) {

                if ($scope.Brandsarray[i].chk == true)
                    $scope.Brandsarray[i].chk = false;
                else
                    $scope.Brandsarray[i].chk = true;
            }
        }
    }
    $scope.searchKeyword = {};
    $scope.checkAllbrands = function (val) {

        var selection_filter = $filter('filter');
        var filtered = selection_filter($scope.Brandsarray, $scope.searchKeyword.search);
        
        $scope.PendingSelbrand = [];

        if (val == true) {

            angular.forEach(filtered, function (obj) {
				obj.chk = true;
				$scope.PendingSelbrand.push(obj);
            })

        } else {
            angular.forEach($scope.Brandsarray, function (obj) {
				obj.chk = false;
            })

            $scope.PendingSelbrand = [];
        }
    }

    $scope.submitPendingSelbrands = function () {

        $scope.PendingSelbrand = [];
        $scope.PendingSelbrandTooltip = "";

        for (var i = 0; i < $scope.Brandsarray.length; i++) {

            if ($scope.Brandsarray[i].chk == true) {
                $scope.PendingSelbrand.push($scope.Brandsarray[i]);
                $scope.PendingSelbrandTooltip = $scope.PendingSelbrandTooltip + $scope.Brandsarray[i].title + "; ";
            }
        }

        $scope.PendingSelbrandTooltip = $scope.PendingSelbrandTooltip.slice(0, -2);

        $scope.brandSelArray = $scope.PendingSelbrand;
        $scope.SelbrandTooltip = $scope.PendingSelbrandTooltip;

        angular.element('#brandsModal').modal('hide');
    }

    $scope.clearPendingSelbrands = function () {
        $scope.PendingSelbrand = [];
        $scope.PendingSelbrandTooltip = "";
        angular.element('#brandsModal').modal('hide');
    }

    // ---------------- Warehouse allocation cost start 	 -----------------------------------------
    $scope.warehouse_allocation_cost = 1;
    $scope.status_list = [];
    $scope.status_list = [{ value: 'Active', id: '1' }, { value: 'Inactive', id: '2' }];

    $scope.cost_types = [{ title: 'Fixed', id: '1' }, { title: 'Hourly', id: '2' }, {
        title: 'Daily',
        id: '3'
    }, { title: 'Weekly', id: '4' }];


    $scope.warehouse_allocation_cost_Form = function (bin_loc_id) {

        $scope.warehouse_allocation_cost_FormShow = true;
        $scope.warehouse_allocation_cost_List_Show = false;

        $scope.rec3.status_ids = $scope.status_list[0];

        $scope.arr_warehouse = [];
        var warehouse_Url = $scope.$root.setup + "warehouse/get-all-list";
        $http
            .post(warehouse_Url, { 'token': $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.arr_warehouse = res.data.response;
                }
            });

        $scope.arr_currency = [];
        var currencyUrl = $scope.$root.setup + "general/currency-list";
        $http
            .post(currencyUrl, { 'token': $scope.$root.token })
            .then(function (res) {

                if (res.data.ack == true) {
                    $scope.arr_currency = res.data.response;

                    $.each($scope.arr_currency, function (index, elem) {
                        if (elem.id == $scope.$root.defaultCurrency) $scope.rec3.currency = elem;
                    });
                }
            });
    }

    $scope.warehouse_allocation_cost_popup = function (cat_id) {
        $scope.rec3 = {};
        $scope.warehouse_allocation_cost_FormShow = false;
        $scope.warehouse_allocation_cost_List_Show = true;

        $scope.showLoader = true;

        var warehouse_allocation_cost_Url = $scope.$root.stock + "categories/warehouse-allocation-cost-category";

        $http
            .post(warehouse_allocation_cost_Url, {
                'token': $scope.$root.token,
                'cat_id': cat_id
            })
            .then(function (res) {
                if (res.data.response != null) {
                    $scope.columns2 = [];
                    $scope.warehouse_allocation_cost_data = [];
                    $scope.warehouse_allocation_cost_data = res.data.response;

                    //console.log(res.data.response);

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns2.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }

                $('#warehouse_allocation_cost_data_modal').modal({ show: true });
                $scope.showLoader = false;
            });
    }

    $scope.general_warehouse_allocation_cost = function () {

        $scope.rec3 = {};

        var warehouse_allocation_cost_Url = $scope.$root.stock + "categories/warehouse-allocation-cost-category";

        $http
            .post(warehouse_allocation_cost_Url, {
                'token': $scope.$root.token,
                'cat_id': $stateParams.id
            })
            .then(function (res) {
                if (res.data.response != null) {
                    $scope.columns2 = [];
                    $scope.warehouse_allocation_cost_data = [];
                    $scope.warehouse_allocation_cost_data = res.data.response;

                    //console.log(res.data.response);

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns2.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }

                $('#warehouse_allocation_cost_data_modal').modal({ show: true });
                $scope.showLoader = false;
            });

        $scope.warehouse_allocation_cost_FormShow = false;
        $scope.warehouse_allocation_cost_List_Show = true;
    }

    $scope.add_warehouse_allocation_cost = function (rec3) {

        rec3.cat_id = $stateParams.id;
        rec3.token = $scope.$root.token;

        if (rec3.cost == undefined || rec3.warehouse == undefined)
            return false;

        if (rec3.warehouse !== undefined)
            rec3.warehouse_id = rec3.warehouse.id;

        if (rec3.status_ids !== undefined)
            rec3.status = rec3.status_ids.id;

        if (rec3.currency !== undefined)
            rec3.currency_id = rec3.currency.id;

        if (rec3.cost_type !== undefined)
            rec3.cost_type_id = rec3.cost_type.id;

        var add_warehouse_allocation_cost_Url = $scope.$root.stock + "categories/add-warehouse-allocation-cost-category";

        if (rec3.id != undefined)
            var add_warehouse_allocation_cost_Url = $scope.$root.stock + "categories/update-warehouse-allocation-cost-category";


        /*console.log(rec3);
         return false;*/

        $http
            .post(add_warehouse_allocation_cost_Url, rec3)
            .then(function (res) {

                if (res.data.ack == true) {
                    $timeout(function () {
                        $scope.general_warehouse_allocation_cost();
                    }, 2000);

                    if (rec3.id > 0)
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    else {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    }
                }
                else {
                    if (rec3.id > 0)
                        toaster.pop('error', 'Edit', res.data.error);
                    else
                        toaster.pop('error', 'Info', res.data.error);
                }
            });

    }

    $scope.edit_warehouse_allocation_cost = function (id) {

        $scope.showLoader = true;

        var warehouse_allocation_cost_byid_Url = $scope.$root.stock + "categories/warehouse-allocation-cost-category-by-id";
        var postViewData = {
            'token': $scope.$root.token,
            'id': id,
            'cat_id': $stateParams.id
        };

        $http
            .post(warehouse_allocation_cost_byid_Url, postViewData)
            .then(function (res3) {

                if (res3.data.ack == true) {
                    $scope.rec3 = res3.data.response;
                    $scope.rec3.id = res3.data.response.id;

                    $.each($scope.status_list, function (index, obj) {
                        if (obj.id == res3.data.response.status)
                            $scope.rec3.status_ids = $scope.status_list[index];
                    });

                    if (res3.data.response.currency_id > 0) {

                        $.each($scope.arr_currency, function (index, elem) {
                            if (elem.id == res3.data.response.currency_id)
                                $scope.rec3.currency = elem;
                        });
                    }
                    else {

                        $.each($scope.arr_currency, function (index, elem) {
                            if (elem.id == $scope.$root.defaultCurrency) $scope.rec3.currency = elem;
                        });
                    }

                    if (res3.data.response.cost_type_id > 0) {

                        $.each($scope.cost_types, function (index, elem) {
                            if (elem.id == res3.data.response.cost_type_id)
                                $scope.rec3.cost_type = elem;
                        });
                    }

                    if (res3.data.response.warehouse_id > 0) {

                        $scope.arr_warehouse = [];
                        var warehouse_Url = $scope.$root.setup + "warehouse/get-all-list";
                        $http
                            .post(warehouse_Url, { 'token': $scope.$root.token })
                            .then(function (res) {
                                if (res.data.ack == true) {
                                    $scope.arr_warehouse = res.data.response;

                                    $.each($scope.arr_warehouse, function (index, elem) {
                                        if (elem.id == res3.data.response.warehouse_id)
                                            $scope.rec3.warehouse = elem;
                                    });
                                }
                            });
                    }

                    $scope.warehouse_allocation_cost_FormShow = true;
                    $scope.warehouse_allocation_cost_List_Show = false;
                }
            });
        $scope.showLoader = false;
    }

    $scope.delete_warehouse_allocation_cost = function (id, index, arr_data) {
        var delUrl = $scope.$root.stock + "categories/delete-warehouse-allocation-cost-category";
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
                    else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    // ---------------- Warehouse allocation cost End 	 -----------------------------------------

}

