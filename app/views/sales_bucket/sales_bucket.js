myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
<<<<<<< HEAD
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
=======
    function($stateProvider, $locationProvider, $urlRouterProvider, helper) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.sales-bucket', {
                url: '/sales_bucket',
                title: 'Human Resources',
                templateUrl: helper.basepath('sales_bucket/sales_bucket.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.add-sales-bucket', {
                url: '/addbucket',
                title: 'Human Resources',
                templateUrl: helper.basepath('sales_bucket/_form.html'),
                resolve: helper.resolveFor('ngDialog'),
                controller: 'SalesbucketEditController'
            })
            .state('app.view-sales-bucket', {
                url: '/:id/viewbuckett',
                title: 'Human Resources',
                templateUrl: helper.basepath('sales_bucket/_form.html'),
                resolve: helper.resolveFor('ngDialog'),
                controller: 'SalesbucketEditController'
            })
            .state('app.edit-sales-bucket', {
                url: '/:id/editsales_bucket',
                title: 'Human Resources',
                templateUrl: helper.basepath('sales_bucket/_form.html'),
                resolve: helper.resolveFor('ngDialog'),
                controller: 'SalesbucketEditController'
            })

<<<<<<< HEAD
    }]);
=======
    }
]);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


myApp.controller('SalesbuckettListController', SalesbuckettListController);
SalesbuckettListController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$state"];
<<<<<<< HEAD
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
function SalesbuckettListController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $state) {
    'use strict';
    var vm = this;

    $scope.class = 'inline_block';
<<<<<<< HEAD
    $scope.$root.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex': '7' },
            { 'name': 'View Bucket', 'url': '#', 'isActive': false }];
=======
    $scope.$root.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
        { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        { 'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex': '7' },
        { 'name': 'View Bucket', 'url': '#', 'isActive': false }
    ];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    var Api = $scope.$root.sales + "customer/sale-bucket/get-sale-bucket-list";
    var postData = {
        'token': $scope.$root.token
    };
    $scope.searchKeyword = {};

<<<<<<< HEAD
    $scope.$watch("MyCustomeFilters", function () {
=======
    $scope.$watch("MyCustomeFilters", function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
            $scope.table.tableParams5.reload();
        }
    }, true);
    $scope.MyCustomeFilters = {}

    vm.tableParams5 = new ngParams({
<<<<<<< HEAD
        page: 1,            // show first page
        count: 999,           // count per page // $scope.$root.pagination_limit
        sorting: { "bucket_no": 'Desc' }
    },
        {
            total: 0,           // length of data
            counts: [],         // hide page counts control

            getData: function ($defer, params) {
                ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);
            }
        });
=======
        page: 1, // show first page
        count: 999, // count per page // $scope.$root.pagination_limit
        sorting: { "bucket_no": 'Desc' }
    }, {
        total: 0, // length of data
        counts: [], // hide page counts control

        getData: function($defer, params) {
            ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);
        }
    });
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


    $scope.main_bucket_listing = true;
    $scope.show_add_bucket_listing = false;
    $scope.show_add_bucket_form = false;

    $scope.bk_id = 0;
    $scope.columns_general = [];
    $scope.general = {};
    $scope.rec = {};

    $scope.arr_status = [];
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'inActive', 'value': 0 }];
    $scope.rec.status = $scope.arr_status[0];

    $scope.isAdded = false;
    $scope.counter = 0;
    $scope.prodCounter = 0;
    $scope.read_type2 = true;
    $scope.product_type = true;
    $scope.count_result = 0;

<<<<<<< HEAD
    $scope.getSalePerson_single = function (id) {
=======
    $scope.getSalePerson_single = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.columns = [];
        $scope.record = {};

        $scope.title = 'Sales bucket';
        // if($scope.rec.sale_type.id==1)$scope.title = 'Sales Group';

        var postData = {
            'token': $scope.$root.token,
            'bk_id': id
        };

        $http
            .post(Api, postData)
<<<<<<< HEAD
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.columns = [];//record_bk
                    $scope.record = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
=======
            .then(function(res) {
                if (res.data.ack == true) {
                    $scope.columns = []; //record_bk
                    $scope.record = res.data.response;
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });


                    //$('#sale_target_pop').modal({ show: true });
<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });

        ngDialog.openConfirm({
            template: 'modalDialogId2',
            className: 'ngdialog-theme-default',
            scope: $scope
<<<<<<< HEAD
        }).then(function (result) {
=======
        }).then(function(result) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            $scope.rec.bucket_name = result.name;
            //$scope.rec.sale_person_name = result.first_name+' '+result.last_name;
            $scope.rec.bucket_id = result.id;

<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });

    }


<<<<<<< HEAD
    $scope.goto_main = function () {
=======
    $scope.goto_main = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        // $scope.$root.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        // { 'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex': '7' },
        // { 'name': 'View Bucket', 'url': 'app.sales-bucket', 'isActive': false }];

        $scope.main_bucket_listing = true;
        $scope.show_add_bucket_listing = false;
        $scope.show_add_bucket_form = false;

        $scope.show_add_cust_listing = false;
        $scope.show_add_cust_form = false;

    }

<<<<<<< HEAD
    $scope.get_sale_person_bucket = function (id) {
=======
    $scope.get_sale_person_bucket = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.bk_id = id;
        $scope.main_bucket_listing = false;
        $scope.show_add_bucket_listing = true;
        $scope.show_add_bucket_form = false;
        $scope.show_add_cust_listing = false;
        $scope.show_add_cust_form = false;

        // $scope.$root.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        // { 'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex': '7' },
        // { 'name': 'View Bucket', 'url': 'app.sales-bucket', 'isActive': false }];
        //$state.go("app.sales-bucket")
        //	$state.reload()

        $scope.showLoader = true;

        var APIURLSB = $scope.$root.sales + "customer/sale-bucket/get-sale-person-bucket-list";
        $http
            .post(APIURLSB, { 'token': $scope.$root.token, bk_id: $scope.bk_id })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.columns_general = [];
                $scope.general = {};

                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.general = res.data.response;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columns_general.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }

                // else toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));
            });
    }

<<<<<<< HEAD
    $scope.edit_sale_person_bucket = function (id) {
=======
    $scope.edit_sale_person_bucket = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.check_sale_bucket_readonly = false;
        $scope.show_add_bucket_listing = false;
        $scope.show_add_bucket_form = true;

        if (id == undefined) return;

        $scope.check_sale_bucket_readonly = true;

        var get = $scope.$root.sales + "customer/sale-bucket/get-sale-person-bucket-by-id";
        var postData = { 'token': $scope.$root.token, 'id': id };
        $scope.rec = {};
        $http
            .post(get, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.rec = res.data.response;


                if (res.data.response.starting_date == 0) $scope.rec.starting_date = null;
                else $scope.rec.starting_date = $scope.$root.convert_unix_date_to_angular(res.data.response.starting_date);

                if (res.data.response.ending_date == 0) $scope.rec.ending_date = null;
                else $scope.rec.ending_date = $scope.$root.convert_unix_date_to_angular(res.data.response.ending_date);

<<<<<<< HEAD
                $.each($scope.arr_status, function (index, obj) {
=======
                $.each($scope.arr_status, function(index, obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.value == res.data.response.status) $scope.rec.status = obj;
                });

            });

    }

<<<<<<< HEAD
    $scope.add_sale_person_bucket = function (rec) {
=======
    $scope.add_sale_person_bucket = function(rec) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var updateUrl = $scope.$root.sales + "customer/sale-bucket/update-person-sale-bucket";

        if ($scope.rec.id == undefined) var updateUrl = $scope.$root.sales + "customer/sale-bucket/add-person-sale-bucket";

        $scope.rec.token = $scope.$root.token;

        if ($scope.rec.status !== undefined) $scope.rec.statuss = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;

        $http
            .post(updateUrl, $scope.rec)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (res.data.ack == true) {

                    if ($scope.rec.id == undefined) toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                    else toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));


                    //if($scope.rec.id==undefined)
                    $scope.get_sale_person_bucket($scope.bk_id);
<<<<<<< HEAD
                }
                else toaster.pop('error', 'info', res.data.error);
=======
                } else toaster.pop('error', 'info', res.data.error);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


            });


    }

<<<<<<< HEAD
    $scope.delete_sale_person_bucket = function (id, index, arr_data_ret) {
=======
    $scope.delete_sale_person_bucket = function(id, index, arr_data_ret) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var delUrl = $scope.$root.sales + "customer/sale-bucket/delete-person-sale-bucket";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data_ret.splice(index, 1);
                    }
                    else toaster.pop('error', 'Info', 'Record cannot be Deleted.');

                });
        },
            function (reason) {
=======
        }).then(function(value) {
                $http
                    .post(delUrl, { id: id, 'token': $scope.$root.token })
                    .then(function(res) {
                        if (res.data.ack == true) {
                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                            arr_data_ret.splice(index, 1);
                        } else toaster.pop('error', 'Info', 'Record cannot be Deleted.');

                    });
            },
            function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                console.log('Modal promise rejected. Reason: ', reason);
            });
    };

<<<<<<< HEAD
    $scope.showEditForm = function () {
=======
    $scope.showEditForm = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.check_sale_bucket_readonly = false;
        //$scope.perreadonly = true;
    }


    $scope.$root.load_date_picker('sale bucket');


}


SalesbucketEditController.$inject = ["$scope", "$filter", "$resource", "$timeout", "$http", "ngDialog", "toaster", "$state", "$rootScope", "$stateParams"];
myApp.controller('SalesbucketEditController', SalesbucketEditController);
<<<<<<< HEAD
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
function SalesbucketEditController($scope, $filter, $resource, $timeout, $http, ngDialog, toaster, $state, $rootScope, $stateParams) {
    'use strict';


    $scope.EmployeeSelectAllowedCols = [
<<<<<<< HEAD
        "Employee No.","name", "Department", "job_title", "Email"
    ]

    $scope.$root.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
    { 'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex': '7' },
    { 'name': 'View Bucket', 'url': '#', 'isActive': false }];

    $scope.getBucketFilterData = function () {
=======
        "Employee No.", "name", "Department", "job_title", "Email"
    ]

    $scope.$root.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        { 'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex': '7' },
        { 'name': 'View Bucket', 'url': '#', 'isActive': false }
    ];

    $scope.getBucketFilterData = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var postUrl = $rootScope.setup + "hr/get-bucket-filter-data";
        $scope.showLoader = true;
        $http
            .post(postUrl, {
                'token': $rootScope.token
            })
<<<<<<< HEAD
            .then(function (res) {
                if (res.data.ack == true) {

                    $scope.modules = [];
                    angular.forEach(res.data.response, function (value, key) {
=======
            .then(function(res) {
                if (res.data.ack == true) {

                    $scope.modules = [];
                    angular.forEach(res.data.response, function(value, key) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.modules.push({
                            name: key,
                            data: value
                        });
                    });

                    $scope.bucketFilterData = res.data.response;
                    //$scope.arr_filter_product = res.data.response.item;
<<<<<<< HEAD
                    angular.forEach(res.data.response.item, function (obj) {
                        var tempObj = {
                            name: obj.meta.display_field_name,
                            field_name: obj.meta.field_name,
                            display_field_name: obj.meta.display_field_name,
                            foreign_key_name: obj.meta.foreign_key_name,
                            foreign_key_id: obj.meta.foreign_key_id,
                            is_numeric: obj.meta.is_numeric
                        };
                        $scope.arr_filter_product.push(tempObj);
                    })
                    //return $scope.bucketFilterData;
                }
                $scope.showLoader = false;
                
=======

                    if ($scope.bucketFilterData) {

                        angular.forEach($scope.bucketFilterData.item, function(obj) {
                            var tempObj = {
                                name: obj.meta.display_field_name,
                                field_name: obj.meta.field_name,
                                display_field_name: obj.meta.display_field_name,
                                foreign_key_name: obj.meta.foreign_key_name,
                                foreign_key_id: obj.meta.foreign_key_id,
                                is_numeric: obj.meta.is_numeric
                            };
                            $scope.arr_filter_product.push(tempObj);
                        });
                    }
                    //return $scope.bucketFilterData;
                }
                $scope.showLoader = false;

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            });
    }

    $scope.check_sale_bucket_readonly = false;

    if ($stateParams.id > 0) {
        $scope.check_sale_bucket_readonly = true;
<<<<<<< HEAD
    }
    else{
        $scope.getBucketFilterData();
    }
    
    

    $scope.showEditForm = function () {
=======
    } else {
        $scope.getBucketFilterData();
    }



    $scope.showEditForm = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.check_sale_bucket_readonly = false;
        //$scope.perreadonly = true;
    }

    $scope.formTitle = 'Sales bucket';
    $scope.btnCancelUrl = 'app.sales-bucket';
    $scope.hideDel = false;

    $scope.rec = {};
    $scope.rec.id = 0;
    /* $scope.arr_target_uom = [];
    $scope.get_product_uom = function () {

        var unitUrl = $scope.$root.stock + "unit-measure/get-all-unit";
        $http
            .post(unitUrl, { 'token': $scope.$root.token })
            .then(function (res) {
                $scope.arr_target_uom = [];

                $scope.arr_target_uom.push({ 'id': '', 'title': '' });

                if (res.data.ack == true) $scope.arr_target_uom = res.data.response;

                else toaster.pop('error', 'Error', " Unit of measure Not found.");

                //if ($scope.user_type == 1)  $scope.unit_measures.push({id: '-1', title: '++Add New++'});

            });

    }
    $scope.get_product_uom(); */

    $scope.$root.sale_target_id = $stateParams.id;
    /* $scope.generate_unique_id = function () {

        var getUrl = $scope.$root.sales + "customer/sale-bucket/get-unique-id";

        $http
            .post(getUrl, { 'token': $scope.$root.token })
            .then(function (res) {

                if (res.data.ack == 1) {
                    $scope.rec.unique_id = res.data.product_unique_id;
                    $scope.rec.id = res.data.id;
                    $scope.$root.sale_target_id = res.data.id;
                    ;
                    //  toaster.pop('success', 'info', res.data.error);
                }
                else {
                    toaster.pop('error', 'info', res.data.error);
                    return false;
                }
            });

    } */
    // if($scope.$root.sale_target_id===undefined) 	$scope.generate_unique_id();


    $scope.product_type = true;
    $scope.count_result = 0;


    $scope.arr_status = [];
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'inActive', 'value': 0 }];
    $scope.rec.status = $scope.arr_status[0];

    $scope.showdataproduct = false;
    $scope.showdatacustomer = false;
    $scope.showdatasalesperson = false;
    $scope.primarySalesperson = "";
    if ($scope.$root.sale_target_id !== undefined) {

        var get = $scope.$root.sales + "customer/sale-bucket/get-sale-bucket-by-id";
        var postData = { 'token': $scope.$root.token, 'id': $scope.$root.sale_target_id };
        $scope.showLoader = true;
        $http
            .post(get, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.rec = res.data.response;
                $scope.allEmployees = res.data.allEmployees.response;
                $scope.allEmployeesIDs = [];

<<<<<<< HEAD
                angular.forEach($scope.allEmployees, function (obj) {
                    if (res.data.primarySalesperson == obj.id) {
                        $scope.primarySalesperson = obj.id;
                        obj.is_primary = true;
                    }
                    else
=======
                angular.forEach($scope.allEmployees, function(obj) {
                    if (res.data.primarySalesperson == obj.id) {
                        $scope.primarySalesperson = obj.id;
                        obj.is_primary = true;
                    } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        obj.is_primary = false;
                    $scope.allEmployeesIDs.push(obj.id);
                });

                $scope.allEmployeesIDs = $scope.allEmployeesIDs.join(",");

                if (res.data.employeeIDs != undefined) {
                    if (res.data.employeeIDs.length)
                        $scope.selectedEmployees = res.data.employeeIDs.join(",");
                }


                if ($scope.$root.breadcrumbs.length == 3) {
                    $scope.$root.breadcrumbs = [
                        { 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
                        { 'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex': '7' },
                        { 'name': 'View Bucket', 'url': 'app.sales-bucket', 'isActive': false }
                    ];
<<<<<<< HEAD
                    $scope.$root.breadcrumbs.push({ 'name': $scope.rec.name + " ("+$scope.rec.sale_bk_code+")", 'url': '#', 'isActive': true });
=======
                    $scope.$root.breadcrumbs.push({ 'name': $scope.rec.name + " (" + $scope.rec.sale_bk_code + ")", 'url': '#', 'isActive': true });
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                }



                if (res.data.response.starting_date == 0) $scope.rec.starting_date = null;
                else $scope.rec.starting_date = $scope.$root.convert_unix_date_to_angular(res.data.response.starting_date);

                if (res.data.response.ending_date == 0) $scope.rec.ending_date = null;
                else $scope.rec.ending_date = $scope.$root.convert_unix_date_to_angular(res.data.response.ending_date);

<<<<<<< HEAD
                $.each($scope.arr_status, function (index, obj) {
=======
                $.each($scope.arr_status, function(index, obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.value == res.data.response.status) $scope.rec.status = obj;
                });

                // $scope.getSalePersons_edit_sale($scope.$root.sale_target_id);
                // $scope.getsalesperson_pop(1, 0);

                //$scope.get_bucket_customer_edit($scope.$root.sale_target_id, 1);
                //$scope.getcustomer_filter(1,0);

                //$scope.get_bucket_product_edit($scope.$root.sale_target_id, 1);
                //$scope.getproduct_filter(1,0);

                $scope.showdatasalesperson = false;
                if (res.data.response.salepersn > 0) $scope.showdatasalesperson = true;

                $scope.showdataproduct = false;
                if (res.data.response.prod_status > 0) $scope.showdataproduct = true;

                $scope.showdatacustomer = false;
                if (res.data.response.cust_status > 0) $scope.showdatacustomer = true;

                $scope.showLoader = false;
                $scope.getBucketFilterData();
            });
<<<<<<< HEAD
    }
    else {
=======
    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var get = $scope.$root.sales + "customer/sale-bucket/get-sale-bucket-preData";
        var postData = { 'token': $scope.$root.token };

        $http
            .post(get, postData)
<<<<<<< HEAD
            .then(function (res) {

                if (res.data.ack == true) {
                    $scope.allEmployees = res.data.allEmployees.response;
                    angular.forEach($scope.allEmployees, function (obj) {
=======
            .then(function(res) {

                if (res.data.ack == true) {
                    $scope.allEmployees = res.data.allEmployees.response;
                    angular.forEach($scope.allEmployees, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        obj.is_primary = false;
                    });
                    $scope.allEmployeesIDs = [];

<<<<<<< HEAD
                    angular.forEach($scope.allEmployees, function (obj) {
=======
                    angular.forEach($scope.allEmployees, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.allEmployeesIDs.push(obj.id);
                    });
                }
            });
    }

<<<<<<< HEAD
    $scope.askConfirmation = function (rec, overwrite) {
        
=======
    $scope.askConfirmation = function(rec, overwrite) {

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if ($scope.primarySalesperson == undefined || $scope.primarySalesperson == "") {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Primary Employee']));
            return;
        }
        if (overwrite) {
            $scope.overwrite = true;
            ngDialog.openConfirm({
                template: "applyFiltersDialogId",
                className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
            }).then(function (value) {
                $scope.update_main(rec);
            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
        else {
=======
            }).then(function(value) {
                $scope.update_main(rec);
            }, function(reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.overwrite = false;
            $scope.update_main(rec);
        }
    }

<<<<<<< HEAD
    $scope.update_main = function (rec) {
        if ($scope.selectedEmployees == undefined || $scope.selectedEmployees.length == 0){
=======
    $scope.update_main = function(rec) {
        if ($scope.selectedEmployees == undefined || $scope.selectedEmployees.length == 0) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Employee(s)']));
            $scope.showLoader = false;
            return;
        }
<<<<<<< HEAD
        if (rec.name == undefined || rec.name && rec.name.trim() == ""){
=======
        if (rec.name == undefined || rec.name && rec.name.trim() == "") {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Name']));
            $scope.showLoader = false;
            return;
        }

        $scope.showLoader = true;

        if (rec.sale_bk_code != undefined) {
            $scope.UpdateForm(rec);
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
            var name = $scope.$root.base64_encode('crm_sale_bucket');

            $http
                .post(getCodeUrl, {
                    'token': $scope.$root.token,
                    'tb': name,
                    'category': '',
                    'brand': '',
                })
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.showLoader = false;
                    if (res.data.ack == 1) {
                        rec.sale_bk_code = res.data.code;
                        $scope.UpdateForm(rec);
<<<<<<< HEAD
                    }
                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        toaster.pop('error', 'info', res.data.error);
                        return false;
                    }
                });
        }
    }


<<<<<<< HEAD
    $scope.UpdateForm = function (rec) {
=======
    $scope.UpdateForm = function(rec) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.showLoader = true;
        // console.log(rec);
        // return false;
        /* if ($scope.rec.status !== undefined)
            $scope.rec.statuss = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0; */
        $scope.rec.statuss = 1;

        var updateUrl = $scope.$root.sales + "customer/sale-bucket/add-sale-bucket";

        if ($scope.$root.sale_target_id > 0)
            var updateUrl = $scope.$root.sales + "customer/sale-bucket/update-sale-bucket";

        $scope.rec.employees = $scope.selectedEmployees;
        $scope.rec.employeeIDs = $scope.allEmployeesIDs;
        $scope.rec.primarySalesperson = $scope.primarySalesperson;
        $scope.rec.token = $scope.$root.token;
        $scope.rec.overwrite = $scope.overwrite;

        $http
            .post(updateUrl, $scope.rec)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    if ($scope.rec.id == 0) {
                        $scope.$root.sale_target_id = res.data.id;
                        $scope.rec.id = res.data.id;
                        //return;
                    }

                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $scope.check_sale_bucket_readonly = true;

<<<<<<< HEAD
                    
                    $scope.$root.sale_target_id = res.data.id;
                    
=======

                    $scope.$root.sale_target_id = res.data.id;

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    if ($stateParams.id === undefined) {
                        $stateParams.id = res.data.id;
                        $scope.check_sale_bucket_readonly = false;
                        $scope.moduleDataRetriever($scope.moduleName);
<<<<<<< HEAD
                        if ($scope.module_id){
                            $scope.get_bucket_product_edit($scope.$root.sale_target_id, 1, $scope.module_id, 1);
                        }
                        else{
                            $scope.check_sale_bucket_readonly = true;
                            $timeout(function () {
=======
                        if ($scope.module_id) {
                            $scope.get_bucket_product_edit($scope.$root.sale_target_id, 1, $scope.module_id, 1);
                        } else {
                            $scope.check_sale_bucket_readonly = true;
                            $timeout(function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                $rootScope.animateGlobal = false;
                                $state.go("app.sales-bucket");
                            }, 1500);
                        }

                        $rootScope.animateGlobal = true;

                        $rootScope.get_global_data(0);
                        $rootScope.getInventoryGlobalData(0);
                        $rootScope.getInventorySetupGlobalData(0);
                        $rootScope.getEmployeeGlobalData(0);
                        $rootScope.getPOSOData(0);
<<<<<<< HEAD
                        
                        $timeout(function () {
                            $rootScope.animateGlobal = false;
                            //$state.go("app.view-sales-bucket", { id: res.data.id });
                        }, 1500);
                    }
                    else {
=======

                        $timeout(function() {
                            $rootScope.animateGlobal = false;
                            //$state.go("app.view-sales-bucket", { id: res.data.id });
                        }, 1500);
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        $rootScope.animateGlobal = true;

                        $rootScope.get_global_data(0);
                        $rootScope.getInventoryGlobalData(0);
                        $rootScope.getInventorySetupGlobalData(0);
                        $rootScope.getEmployeeGlobalData(0);
                        $rootScope.getPOSOData(0);
<<<<<<< HEAD
                        
                        $timeout(function () {
=======

                        $timeout(function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $rootScope.animateGlobal = false;
                            $state.go("app.sales-bucket");
                        }, 1500);
                    }


                    // if ($stateParams.id !== undefined) {
                    //     // $scope.update_salespersons($scope.$root.sale_target_id);
                    // }
                    // else {
                    //     if ($scope.isSalePerersonChanged)
                    //         $scope.add_salespersons($scope.$root.sale_target_id);

<<<<<<< HEAD
                        // if($scope.isProoductChanged_detail)
                        //$scope.add_bucket_product($scope.$root.sale_target_id, 1);

                        // if ($scope.isregionChanged_detail)
                        //     $scope.add_bucket_to_customer($scope.$root.sale_target_id, 1);

                        // $scope.add_bucket_customer($scope.$root.sale_target_id, 1);
                   // }
                }
                else toaster.pop('error', 'info', res.data.error);
=======
                    // if($scope.isProoductChanged_detail)
                    //$scope.add_bucket_product($scope.$root.sale_target_id, 1);

                    // if ($scope.isregionChanged_detail)
                    //     $scope.add_bucket_to_customer($scope.$root.sale_target_id, 1);

                    // $scope.add_bucket_customer($scope.$root.sale_target_id, 1);
                    // }
                } else toaster.pop('error', 'info', res.data.error);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            });
    }


<<<<<<< HEAD
    $scope.delete_sale_buket = function (id, index, arr_data_ret) {

        var delUrl = $scope.$root.sales + "customer/sale-bucket/delete-sale-bucket";
        var template = "";
        if ($scope.allAppliedFilters.length){
            template = "bucketDeleteDialogId";
        }
        else{
=======
    $scope.delete_sale_buket = function(id, index, arr_data_ret) {

        var delUrl = $scope.$root.sales + "customer/sale-bucket/delete-sale-bucket";
        var template = "";
        if ($scope.allAppliedFilters.length) {
            template = "bucketDeleteDialogId";
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            template = "modalDeleteDialogId";
        }

        ngDialog.openConfirm({
            template: template,
            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {

                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                        $rootScope.animateGlobal = true;

                        $rootScope.get_global_data(0);
                        $rootScope.getInventoryGlobalData(0);
                        $rootScope.getInventorySetupGlobalData(0);
                        $rootScope.getEmployeeGlobalData(0);
                        $rootScope.getPOSOData(0);
                        
                        // arr_data_ret.splice(index,1);
                        $timeout(function () {
                            $rootScope.animateGlobal = false;
                            $state.go("app.sales-bucket");
                        }, 1500);
                    }
                    else toaster.pop('error', 'Info', 'Record cannot be Deleted.');

                });
        },
            function (reason) {
=======
        }).then(function(value) {
                $http
                    .post(delUrl, { id: id, 'token': $scope.$root.token })
                    .then(function(res) {

                        if (res.data.ack == true) {
                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                            $rootScope.animateGlobal = true;

                            $rootScope.get_global_data(0);
                            $rootScope.getInventoryGlobalData(0);
                            $rootScope.getInventorySetupGlobalData(0);
                            $rootScope.getEmployeeGlobalData(0);
                            $rootScope.getPOSOData(0);

                            // arr_data_ret.splice(index,1);
                            $timeout(function() {
                                $rootScope.animateGlobal = false;
                                $state.go("app.sales-bucket");
                            }, 1500);
                        } else toaster.pop('error', 'Info', 'Record cannot be Deleted.');

                    });
            },
            function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                console.log('Modal promise rejected. Reason: ', reason);
            });
    };


    $scope.isSalePerersonChanged = false;
    $scope.salepersons = [];
    $scope.selectedSalespersons = [];
    $scope.dropdown_selectedsalespersons = [];
    var primary_sale_id = 0;

<<<<<<< HEAD
    $scope.getsalesperson_pop = function (isShow) {
=======
    $scope.getsalesperson_pop = function(isShow) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.columns = [];
        $scope.salepersons = [];
        $scope.title = 'Salesperson';
        $scope.searchKeyword = {};


        /*$scope.columns_sp = [];
        $scope.record = {};
 
 
        $scope.record = $rootScope.salesperson_arr;
        $scope.showLoader = false;*/


<<<<<<< HEAD
        angular.forEach($rootScope.salesperson_arr, function (obj) {
=======
        angular.forEach($rootScope.salesperson_arr, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            obj.chk = false;
            obj.isPrimary = false;

            if ($scope.selectedSalespersons.length > 0) {
<<<<<<< HEAD
                angular.forEach($scope.selectedSalespersons, function (obj2) {
=======
                angular.forEach($scope.selectedSalespersons, function(obj2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id == obj2.salesperson_id) {

                        obj.chk = true;
                        if (obj2.is_primary == 1)
                            obj.isPrimary = true;

                    }
                });
            }
            $scope.salepersons.push(obj);
        });


<<<<<<< HEAD
        angular.forEach($rootScope.salesperson_arr[0], function (val, index) {
=======
        angular.forEach($rootScope.salesperson_arr[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (index != 'chk' && index != 'id') {
                $scope.columns.push({
                    'title': toTitleCase(index),
                    'field': index,
                    'visible': true
                });
            }
        });


        /*==================================*/
        /*var postUrl = $scope.$root.hr + "employee/listings";
 
        var postData = {'token': $scope.$root.token};
 
        $http
            .post(postUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    //if($scope.rec.id ==0){
                    $.each(res.data.response, function (indx, obj) {
                        obj.chk = false;
                        obj.isPrimary = false;
                        if ($scope.selectedSalespersons.length > 0) {
                            $.each($scope.selectedSalespersons, function (indx, obj2) {
                                if (obj.id == obj2.salesperson_id) {
 
                                    obj.chk = true;
                                    if (obj2.is_primary == 1)
                                        obj.isPrimary = true;
 
                                }
                            });
                        }
                        $scope.salepersons.push(obj);
                    });
                    //	}
 
                    angular.forEach(res.data.response[0], function (val, index) {
                        if (index != 'chk' && index != 'id') {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }
                    });
                }
                //else   toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });*/

        $scope.showsaleperson = true;

        if ($scope.rec.id > 0)
            $scope.showsaleperson = false;

        //if( $scope.rec.id>0) $scope.get_customer_by_sale_person();
        if (!isShow)
            angular.element('#salesPersonModal').modal({ show: true });


        $scope.columns_saleperson = [];
        $scope.record_saleperson = {};
        $scope.rec.select_saleperson = '';
        //$scope.getSalePersons_edit_sale($scope.$root.sale_target_id);

    }

<<<<<<< HEAD
    angular.element(document).on('click', '.checkAllSalesperson', function () {
=======
    angular.element(document).on('click', '.checkAllSalesperson', function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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
<<<<<<< HEAD
        $scope.$root.$apply(function () {
=======
        $scope.$root.$apply(function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.selectedSalespersons;
        });
        //},500);

    });

<<<<<<< HEAD
    $scope.selectSaleperson = function (sp, isPrimary) {
=======
    $scope.selectSaleperson = function(sp, isPrimary) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.isSalePerersonChanged = true;

        for (var i = 0; i < $scope.salepersons.length; i++) {
            if (isPrimary == 1) $scope.salepersons[i].isPrimary = false;

            if (sp.id == $scope.salepersons[i].id) {
                if ($scope.salepersons[i].chk == true && isPrimary == 0) {
                    $scope.salepersons[i].chk = false;
                    $scope.salepersons[i].isPrimary = false;
<<<<<<< HEAD
                    $.each($scope.selectedSalespersons, function (indx, obj) {
=======
                    $.each($scope.selectedSalespersons, function(indx, obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (obj != undefined) {
                            if (obj.id == sp.id)
                                $scope.selectedSalespersons.splice(indx, 1);
                        }
                    });
<<<<<<< HEAD
                }
                else {
                    if (isPrimary == 1 || $scope.selectedSalespersons.length == 0) {
                        var isExist = false;
                        $scope.salepersons[i].isPrimary = true;
                        $.each($scope.selectedSalespersons, function (indx, obj) {
=======
                } else {
                    if (isPrimary == 1 || $scope.selectedSalespersons.length == 0) {
                        var isExist = false;
                        $scope.salepersons[i].isPrimary = true;
                        $.each($scope.selectedSalespersons, function(indx, obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

<<<<<<< HEAD
                    }
                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.salepersons[i].chk = true;
                        $scope.selectedSalespersons.push($scope.salepersons[i]);
                    }
                }

            }

        }

    }

<<<<<<< HEAD
    $scope.getSalePersons_edit_sale = function (id, type) {
=======
    $scope.getSalePersons_edit_sale = function(id, type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        //var salepersonUrl = $scope.$root.sales + "crm/crm/get-crm-salesperson";
        var salepersonUrl = $scope.$root.sales + "customer/sale-bucket/get-crm-salesperson";

        $http
            .post(salepersonUrl, { id: id, 'token': $scope.$root.token, 'type': 6 })
<<<<<<< HEAD
            .then(function (emp_data) {
                if (emp_data.data.ack == true) {
                    $timeout(function () {
                        $scope.$root.$apply(function () {

                            $scope.selectedSalespersons = [];
                            $scope.dropdown_selectedsalespersons = [];
                            $.each($scope.salepersons, function (indx, obj) {
                                obj.chk = false;
                                obj.isPrimary = false;
                                $.each(emp_data.data.response, function (indx, obj2) {
=======
            .then(function(emp_data) {
                if (emp_data.data.ack == true) {
                    $timeout(function() {
                        $scope.$root.$apply(function() {

                            $scope.selectedSalespersons = [];
                            $scope.dropdown_selectedsalespersons = [];
                            $.each($scope.salepersons, function(indx, obj) {
                                obj.chk = false;
                                obj.isPrimary = false;
                                $.each(emp_data.data.response, function(indx, obj2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    if (obj.id == obj2.salesperson_id) {
                                        obj.chk = true;

                                        if (obj2.is_primary == 1) {
                                            obj.isPrimary = true;
                                            obj.first_name = obj.first_name + ' (Primary)';
                                            primary_sale_id = obj.id;
                                        }
                                        $scope.selectedSalespersons.push(obj2);

                                        $scope.dropdown_selectedsalespersons.push(obj);
                                    }
                                });

                            });
                            //$scope.dropdown_selectedsalespersons=$scope.$root.remove_dupciation_in_array($scope.dropdown_selectedsalespersons);


                        });
                    }, 1000);
                }
            });

        if (type == 1) angular.element('#salesPersonModal').modal({ show: true });

    }

<<<<<<< HEAD
    $scope.add_salespersons = function (id) {
=======
    $scope.add_salespersons = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        //   var excUrl = $scope.$root.sales + "crm/crm/add-crm-salesperson";
        var excUrl = $scope.$root.sales + "customer/sale-bucket/add-crm-salesperson";
        var post = {};
        var temp = [];
<<<<<<< HEAD
        $.each($scope.selectedSalespersons, function (index, obj) {

            if (obj.isPrimary == 1) primary_sale_id = obj.id;

            temp.push({ id: obj.id, isPrimary: obj.isPrimary });
        })
        //	console.log(primary_sale_id);$scope.showLoader = false;return;
=======
        $.each($scope.selectedSalespersons, function(index, obj) {

                if (obj.isPrimary == 1) primary_sale_id = obj.id;

                temp.push({ id: obj.id, isPrimary: obj.isPrimary });
            })
            //	console.log(primary_sale_id);$scope.showLoader = false;return;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


        post.id = id;
        post.salespersons = temp;
        post.type = 6;
        post.token = $scope.$root.token;
        $http
            .post(excUrl, post)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            });
    }

<<<<<<< HEAD
    $scope.update_salespersons = function (id) {
=======
    $scope.update_salespersons = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        //$scope.loader_pop=true;
        $scope.showLoader = true;


        //   var excUrl = $scope.$root.sales + "crm/crm/add-crm-salesperson";
        var excUrl = $scope.$root.sales + "customer/sale-bucket/update-crm-salesperson";
        var post = {};
        var temp = [];

        if ($scope.rec.select_saleperson !== undefined && $scope.rec.select_saleperson !== null)
            post.pre_sale_person = $scope.rec.select_saleperson !== undefined ? $scope.rec.select_saleperson.id : 0;

        var pre_selected_primary = 0;
<<<<<<< HEAD
        $.each($scope.salepersons_exculde, function (index, obj) {

            if (obj.isPrimary == 1) primary_sale_id = obj.id;

            if (post.pre_sale_person == obj.salesperson_id) {
                if (obj.is_primary == 1) pre_selected_primary = true;
            }

            // $scope.salepersons[i].chk = true;
            if (obj.chk) temp.push({ id: obj.id, salesperson_id: obj.salesperson_id, isPrimary: obj.isPrimary });
        })
        //console.log(primary_sale_id);$scope.showLoader = false;return;
=======
        $.each($scope.salepersons_exculde, function(index, obj) {

                if (obj.isPrimary == 1) primary_sale_id = obj.id;

                if (post.pre_sale_person == obj.salesperson_id) {
                    if (obj.is_primary == 1) pre_selected_primary = true;
                }

                // $scope.salepersons[i].chk = true;
                if (obj.chk) temp.push({ id: obj.id, salesperson_id: obj.salesperson_id, isPrimary: obj.isPrimary });
            })
            //console.log(primary_sale_id);$scope.showLoader = false;return;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        post.id = id;
        post.primary_sale_id = pre_selected_primary;
        post.salespersons = temp;
        if ($scope.rec.select_all_saleperson !== undefined && $scope.rec.select_all_saleperson !== null)
            post.replace_sale_person = $scope.rec.select_all_saleperson !== undefined ? $scope.rec.select_all_saleperson.id : 0;

        post.type = 6;
        post.token = $scope.$root.token;

        $http
            .post(excUrl, post)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.showLoader = false;
                    $scope.selectedSalespersons = [];
                    // $scope.getSalePersons_edit_sale($scope.$root.sale_target_id);
                    // $scope.getsalesperson_pop(1,0);

                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
<<<<<<< HEAD
                }
                else toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(106));
=======
                } else toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(106));
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            });

    }

<<<<<<< HEAD
    $scope.check_primary_sp = function () {
=======
    $scope.check_primary_sp = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if (!$("input[name='isPrimary']").is(':checked')) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Primary Employee']));
            $('.isPrimary_sp').attr("disabled", true);
            return;
<<<<<<< HEAD
        }
        else $('.isPrimary_sp').attr("disabled", false);
=======
        } else $('.isPrimary_sp').attr("disabled", false);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        //   alert('One of the radio buttons is checked!');


    }

<<<<<<< HEAD
    $scope.get_customer_by_sale_person = function (id, type) {
=======
    $scope.get_customer_by_sale_person = function(id, type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.columns_saleperson = [];
        $scope.record_saleperson = {};
        //$scope.rec.select_saleperson='';

        if ($scope.rec.select_saleperson == undefined) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Salesperson']));
            return;
        }

        var custUrl = $scope.$root.sales + "customer/sale-target/get-customer-crm-sale-person-id";
        var postData = {
            'token': $scope.$root.token,
            'sale_person_id': id
        };

        $http
            .post(custUrl, postData)
<<<<<<< HEAD
            .then(function (res) {

                $scope.record_saleperson = res.data.response;

                angular.forEach(res.data.response[0], function (val, index) {
=======
            .then(function(res) {

                $scope.record_saleperson = res.data.response;

                angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.columns_saleperson.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                });
            });
        $scope.get_sale_person_exculde(id, type);
    }

    $scope.salepersons_exculde = [];
<<<<<<< HEAD
    $scope.get_sale_person_exculde = function (id, type) {
=======
    $scope.get_sale_person_exculde = function(id, type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        angular.element('#salesPersonModal').modal({ show: true });

        $scope.salepersons_exculde = [];
        $scope.columns_exclude = [];

        if (type == 1) var id1 = id;
        if (type == 2) var id1 = id;

<<<<<<< HEAD
        $.each($scope.salepersons, function (indx, obj) {
=======
        $.each($scope.salepersons, function(indx, obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (id1 !== obj.id) $scope.salepersons_exculde.push(obj);

        });

<<<<<<< HEAD
        angular.forEach($scope.salepersons[0], function (val, index) {
=======
        angular.forEach($scope.salepersons[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (index != 'chk' && index != 'id') {
                $scope.columns_exclude.push({
                    'title': toTitleCase(index),
                    'field': index,
                    'visible': true
                });
            }
        });

    }


    //----------------------customer filter----------------
    /*	 $scope.item_paging = {};
     $scope.itemselectPage = function (pageno) {
     $scope.item_paging.spage = pageno;
     };*/

    $scope.arr_filter = [];
    $scope.arr_filter = [{ 'name': 'CustomerName', 'id': 1 }, {
        'name': 'CustomerCountry',
        'id': 2
<<<<<<< HEAD
    }, { 'name': 'CustomerCity', 'id': 3 }
        , { 'name': 'CustomerPostCode', 'id': 4 }, { 'name': 'CustomerTurnOver', 'id': 5 }, { 'name': 'Region', 'id': 6 }
        , { 'name': 'Segment', 'id': 7 }, { 'name': 'BuyingGroup', 'id': 8 }, {
        'name': 'Loctioname',
        'id': 9
    }, { 'name': 'Locationcity', 'id': 10 }
        , { 'name': 'LocationPostcode', 'id': 11 }, { 'name': 'LocationCountry', 'id': 12 }];
=======
    }, { 'name': 'CustomerCity', 'id': 3 }, { 'name': 'CustomerPostCode', 'id': 4 }, { 'name': 'CustomerTurnOver', 'id': 5 }, { 'name': 'Region', 'id': 6 }, { 'name': 'Segment', 'id': 7 }, { 'name': 'BuyingGroup', 'id': 8 }, {
        'name': 'Loctioname',
        'id': 9
    }, { 'name': 'Locationcity', 'id': 10 }, { 'name': 'LocationPostcode', 'id': 11 }, { 'name': 'LocationCountry', 'id': 12 }];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    $scope.arr_operator = [];
    $scope.arr_operator = [
        { 'name': 'Include', 'id': 1 },
        { 'name': 'Equal to', 'id': 2 },
        { 'name': 'Start with', 'id': 3 },
        { 'name': 'Greater than', 'id': 4 },
        { 'name': 'Lesser than', 'id': 5 },
        { 'name': 'Greater than or Equal to', 'id': 6 },
        { 'name': 'Lesser than or Equal to', 'id': 7 },
        { 'name': 'Exclude', 'id': 8 }
    ];

    $scope.arr_operator_limited = [
        { 'name': 'Include', 'id': 1 },
        { 'name': 'Exclude', 'id': 8 }
    ];

<<<<<<< HEAD
    $scope.newItemInList = function (tag) { // this is a functional created for ui-select to allow new value as input additional to the values inside array..
=======
    $scope.newItemInList = function(tag) { // this is a functional created for ui-select to allow new value as input additional to the values inside array..
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var obj = {};
        obj.id = 999;
        obj.name = tag;
        //$scope.cat_prodcut_arr.push(obj);
        return { id: tag, name: tag };
    }
<<<<<<< HEAD
    $scope.newBrandInBrandsArray = function (tag) { // this is a functional created for ui-select to allow new value as input additional to the values inside array..
=======
    $scope.newBrandInBrandsArray = function(tag) { // this is a functional created for ui-select to allow new value as input additional to the values inside array..
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var obj = {};
        obj.id = $scope.brand_prodcut_arr.length;
        obj.name = tag;
        $scope.brand_prodcut_arr.push(obj);
        return obj;
    }
<<<<<<< HEAD
    $scope.newUnitInUnitsArray = function (tag) { // this is a functional created for ui-select to allow new value as input additional to the values inside array..
=======
    $scope.newUnitInUnitsArray = function(tag) { // this is a functional created for ui-select to allow new value as input additional to the values inside array..
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var obj = {};
        obj.id = $scope.uni_prooduct_arr.length;
        obj.name = tag;
        $scope.uni_prooduct_arr.push(obj);
        return obj;
    }
<<<<<<< HEAD
    $scope.newOriginInOriginArray = function (tag) { // this is a functional created for ui-select to allow new value as input additional to the values inside array..
=======
    $scope.newOriginInOriginArray = function(tag) { // this is a functional created for ui-select to allow new value as input additional to the values inside array..
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var obj = {};
        obj.id = $scope.itemOriginCountries.length;
        obj.name = tag;
        $scope.itemOriginCountries.push(obj);
        return obj;
    }

    $scope.arr_logic_operator = [];
    $scope.arr_logic_operator = [{ 'name': 'AND', 'id': 1 }, { 'name': 'OR', 'id': 2 }];

    $scope.isregionChanged_detail = false;
    $scope.arr_customer_all = [];
    $scope.selectedCustomer = [];
    $scope.searchKeyword = {};
    $scope.salepersons_customer_arry = [];
    $scope.dropdown_crm_bucket = [];

<<<<<<< HEAD
    $scope.getcustomer_filter = function (isShow, type, item_paging) {
=======
    $scope.getcustomer_filter = function(isShow, type, item_paging) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.showLoader = true;

        $scope.columnss = [];
        $scope.arr_customer_all = [];
        var postData = {};
        $scope.title = ' Create Customer Filtor ';
        var postUrl = $scope.$root.sales + "customer/sale-bucket/get-customer-crm-filter-list";

        postData.token = $scope.$root.token;

        postData.type = type;
        postData.module_id = $scope.$root.sale_target_id;

        if (item_paging == 1) $rootScope.item_paging.spage = 1
        postData.page = $rootScope.item_paging.spage;

        postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;
        if (postData.pagination_limits == -1) {
            postData.page = -1;
            //$scope.searchKeyword={};
            //$scope.array_dynamic_filter_product = {};
            //$scope.array_dynamic_filter_product = [{sort_id: '1'}];
            //$scope.arr_customer_all = {};
        }

        //if(item_paging==1)$scope.item_paging.spage=1
        //postData.page= $scope.item_paging.spage;

        postData.array_dynamic_filter = $scope.array_dynamic_filter

        /*
         if($scope.searchKeyword.normal_filter!==undefined)
         postData.normal_filter = $scope.searchKeyword.normal_filter.id!==undefined ? $scope.searchKeyword.normal_filter.id:0;
 
         if($scope.searchKeyword.operator_filter!==undefined)
         postData.operator_filter=$scope.searchKeyword.operator_filter.id!==undefined?$scope.searchKeyword.operator_filter.id:0;
 
         if($scope.searchKeyword.operator_search!==undefined)
         postData.operator_search=$scope.searchKeyword.operator_search;
 
         if($scope.searchKeyword.logical_filter!==undefined)
         postData.logical_filter = $scope.searchKeyword.logical_filter.id!==undefined?$scope.searchKeyword.logical_filter.id:0;
         */

        /* $http({
         method:'POST',
         url:"php/customerInfo.php?action=day",
         headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
         }).then(function successCallback(response){
         */
        $http
            .post(postUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record;

                    var primary_sale_id = 0;
                    var isPrimary = 0;
                    var ids = 0;

                    $scope.dropdown_crm_bucket = [];
                    // $scope.dropdown_crm_bucket={};

<<<<<<< HEAD
                    $.each($scope.salepersons, function (indx, obj) {
                        $.each($scope.selectedSalespersons, function (indx, obj2) {
=======
                    $.each($scope.salepersons, function(indx, obj) {
                        $.each($scope.selectedSalespersons, function(indx, obj2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                            if ($scope.$root.sale_target_id === undefined) {
                                ids = obj2.id;
                                isPrimary = obj.isPrimary;
<<<<<<< HEAD
                            }
                            else {
=======
                            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                isPrimary = obj2.is_primary;
                                ids = obj2.salesperson_id;
                            }

                            if (obj.id == ids) {
                                obj.chk = true;
                                if (isPrimary == true) {
                                    obj.isPrimary = true;
                                    obj.first_name = obj.first_name + '(Primary)';
                                    primary_sale_id = obj.id;
                                }
                                $scope.dropdown_crm_bucket.push(obj);
                            }
                        });
                    });

<<<<<<< HEAD
                    $.each(res.data.response, function (indx, obj) {
=======
                    $.each(res.data.response, function(indx, obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        /* $.each($scope.dropdown_crm_bucket, function (indx, obj3) {
                         if (obj3.id == primary_sale_id)  obj.select_saleperson=obj3;
                         });*/
                        obj.select_saleperson = primary_sale_id; //$scope.dropdown_selectedsalespersons[0];

                        /* if ($scope.selectedCustomer.length > 0) {
                         $.each($scope.selectedCustomer, function (indx, obj2) {
                         //  if (obj.id == obj2.id)   obj.chk = true;
                         });
                         }*/

                        obj.chk = false;
                        $scope.arr_customer_all.push(obj);
                    });
<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (index != 'chk' && index != 'id') {
                            $scope.columnss.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }
                    });
                    $scope.showLoader = false;
<<<<<<< HEAD
                }
                else $scope.showLoader = false;
=======
                } else $scope.showLoader = false;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                //toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });

        if (!isShow) angular.element('#groupInfoModal_detail').modal({ show: true });

        //	if($scope.$root.sale_target_id!==undefined &&  isShow) $scope.get_bucket_customer_edit($scope.$root.sale_target_id,1);

    }

<<<<<<< HEAD
    angular.element(document).on('click', '.checkAll_Customer', function () {
=======
    angular.element(document).on('click', '.checkAll_Customer', function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.selectedCustomer = [];
        if (angular.element('.checkAll_Customer').is(':checked') == true) {
            $scope.isregionChanged_detail = true;
            for (var i = 0; i < $scope.arr_customer_all.length; i++) {
                $scope.arr_customer_all[i].chk = true;
                $scope.selectedCustomer.push($scope.arr_customer_all[i]);
            }
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            for (var i = 0; i < $scope.arr_customer_all.length; i++) {
                $scope.arr_customer_all[i].chk = false;
            }
            $scope.selectedCustomer = [];
        }

<<<<<<< HEAD
        $scope.$root.$apply(function () {
=======
        $scope.$root.$apply(function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.selectedCustomer;
        });

    });

<<<<<<< HEAD
    $scope.selectCustomer_bucket = function (cust) {
=======
    $scope.selectCustomer_bucket = function(cust) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.isregionChanged_detail = true;

        for (var i = 0; i < $scope.arr_customer_all.length; i++) {
            if (cust.id == $scope.arr_customer_all[i].id) {
                if ($scope.arr_customer_all[i].chk == true) {
                    $scope.arr_customer_all[i].chk = false;
<<<<<<< HEAD
                    $.each($scope.selectedCustomer, function (indx, obj) {
=======
                    $.each($scope.selectedCustomer, function(indx, obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (obj != undefined) {
                            if (obj.id == cust.id)
                                $scope.selectedCustomer.splice(indx, 1);
                        }
                    });
<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.arr_customer_all[i].chk = true;
                    $scope.selectedCustomer.push($scope.arr_customer_all[i]);
                }

            }

        }
        if ($scope.selectedCustomer.length == $scope.arr_customer_all.length) {
<<<<<<< HEAD
            $timeout(function () {
                $scope.$root.$apply(function () {
                    angular.element('.checkAll_Customer').prop('checked', true);
                });
            }, 500);
        }
        else {
            $timeout(function () {
                $scope.$root.$apply(function () {
=======
            $timeout(function() {
                $scope.$root.$apply(function() {
                    angular.element('.checkAll_Customer').prop('checked', true);
                });
            }, 500);
        } else {
            $timeout(function() {
                $scope.$root.$apply(function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    angular.element('.checkAll_Customer').prop('checked', false);
                });
            }, 500);
        }
    }

<<<<<<< HEAD
    $scope.get_bucket_customer_edit = function (id, type) {
=======
    $scope.get_bucket_customer_edit = function(id, type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


        var salepersonUrl = $scope.$root.sales + "customer/sale-bucket/get-sale-customer";
        $http
            .post(salepersonUrl, { module_id: id, 'token': $scope.$root.token, 'type': type })
<<<<<<< HEAD
            .then(function (emp_data) {

                if (emp_data.data.ack == true) {
                    $scope.showLoader = true;
                    $timeout(function () {
                        $scope.$root.$apply(function () {

                            $.each($scope.arr_customer_all, function (indx, obj) {
                                obj.chk = false;
                                // obj.isPrimary = false;
                                $.each(emp_data.data.response_customer, function (indx, obj2) {
=======
            .then(function(emp_data) {

                if (emp_data.data.ack == true) {
                    $scope.showLoader = true;
                    $timeout(function() {
                        $scope.$root.$apply(function() {

                            $.each($scope.arr_customer_all, function(indx, obj) {
                                obj.chk = false;
                                // obj.isPrimary = false;
                                $.each(emp_data.data.response_customer, function(indx, obj2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    if (obj.id == obj2.id) {
                                        //  obj.chk = true;
                                        $scope.selectedCustomer.push(obj);
                                    }
                                });
                                //   $scope.arr_customer_all.push(obj);
                            });

                            $scope.array_dynamic_filter = emp_data.data.response_filter;
<<<<<<< HEAD
                            $.each($scope.array_dynamic_filter, function (index, obj_rec) {
=======
                            $.each($scope.array_dynamic_filter, function(index, obj_rec) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                                obj_rec.id = obj_rec.id;
                                obj_rec.sort_id = obj_rec.sort_id;
                                obj_rec.operator_search = obj_rec.operator_search;

<<<<<<< HEAD
                                $.each($scope.arr_filter, function (index, obj) {
                                    if (obj.id == obj_rec.normal_filter) obj_rec.normal_filter = obj;
                                });

                                $.each($scope.arr_operator, function (index, obj) {
                                    if (obj.id == obj_rec.operator_filter) obj_rec.operator_filter = obj;
                                });

                                $.each($scope.arr_logic_operator, function (index, obj) {
=======
                                $.each($scope.arr_filter, function(index, obj) {
                                    if (obj.id == obj_rec.normal_filter) obj_rec.normal_filter = obj;
                                });

                                $.each($scope.arr_operator, function(index, obj) {
                                    if (obj.id == obj_rec.operator_filter) obj_rec.operator_filter = obj;
                                });

                                $.each($scope.arr_logic_operator, function(index, obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    if (obj.id == obj_rec.logical_filter) obj_rec.logical_filter = obj;
                                });

                                // $scope.array_dynamic_filter.push(obj_rec);
                            });

                            var new_add = $scope.arr_filter.length - emp_data.data.total;
                            if (new_add > 0 && new_add < $scope.arr_filter.length) {

                                var newItemNo = $scope.array_dynamic_filter.length + new_add;
                                var start = (parseFloat(emp_data.data.total)) + 1;

                                for (var i = start; i <= newItemNo; i++) {
                                    // $scope.array_dynamic_filter.push({sort_id: '' + [i]}); //object.i
                                }

                            }

                            $scope.showLoader = false;
                        });
                    }, 1000);
<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.array_dynamic_filter = {};
                    $scope.array_dynamic_filter = [{ sort_id: '1' }];
                    //toaster.pop('error', 'info',$scope.$root.getErrorMessageByCode(400));
                }
            });

    }

<<<<<<< HEAD
    $scope.add_bucket_customer = function (id, type) {
=======
    $scope.add_bucket_customer = function(id, type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


        //,$scope.selectedProducts[$scope.counter].id
        var check = false;
        var excUrl = $scope.$root.sales + "customer/sale-bucket/add-sale-customer";
        var post = {};
        var temp = [];
        /*    $.each($scope.selectedCustomer, function (index, obj) {
         temp.push({id: obj.id, isPrimary: obj.isPrimary});
         })
         post.salespersons = temp;*/

        post.array_dynamic_filter = $scope.array_dynamic_filter;
        post.type = type;
        post.bucket_id = id;
        post.module_id = 48; // module_id for Customer is 48 in table "ref_modules"
        post.token = $scope.$root.token;
        $http
            .post(excUrl, post)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) check = true;
            });


    }

<<<<<<< HEAD
    $scope.show_assign_cnfrm = function () {
=======
    $scope.show_assign_cnfrm = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        angular.element('#show_assign_cnfrm').modal({ show: true });

    }

<<<<<<< HEAD
    $scope.add_bucket_to_customer = function (id, type, confrm_type) {
=======
    $scope.add_bucket_to_customer = function(id, type, confrm_type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        angular.element('#show_assign_cnfrm').modal('hide');

        // if($stateParams.id!==undefined) $scope.add_bucket_customer(id,1);

        //$scope.loader_pop=true;
        $scope.showLoader = true;
        var check = false;
        var excUrl = $scope.$root.sales + "customer/sale-bucket/add-bucket-to-customer";
        var post = {};
        var temp = [];
        //$scope.selectedCustomer
<<<<<<< HEAD
        $.each($scope.arr_customer_all, function (index, obj) {
=======
        $.each($scope.arr_customer_all, function(index, obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (obj.chk) temp.push({ id: obj.id, select_saleperson: obj.select_saleperson });
        })
        post.confrm_type = confrm_type;

        if (primary_sale_id == 0) {
            $scope.showLoader = false;
            toaster.pop('error', 'info', ' Select Primary Sales Person ');
            return;

        }
        if (temp.length == 0) {
            $scope.showLoader = false;
            toaster.pop('error', 'info', ' Select Customer Sales Person ');
            return;
        }

        post.salespersons = temp;
        post.primary_sale_id = primary_sale_id;
<<<<<<< HEAD
        post.bucket_id = $scope.$root.sale_target_id;// id;
=======
        post.bucket_id = $scope.$root.sale_target_id; // id;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        post.token = $scope.$root.token;

        $http
            .post(excUrl, post)
<<<<<<< HEAD
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.showLoader = false;
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                }
                else {
=======
            .then(function(res) {
                if (res.data.ack == true) {
                    $scope.showLoader = false;
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(105));
                    $scope.showLoader = false;
                }
            });

    }

<<<<<<< HEAD
    $scope.get_filter_pop_list = function (id, main_index) {
=======
    $scope.get_filter_pop_list = function(id, main_index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        //$scope.country_type_arr = [];
        //$scope.region_customer_arr = [];
        //$scope.region_segment_arr = [];
        //$scope.bying_group_customer_arr = [];

        $scope.rec.searchKeywordpop2 = '';
        $scope.main_index = main_index;

        if (id == 2 || id == 12) {
            $scope.$root.get_country_list();
            $scope.title = 'Country';
<<<<<<< HEAD
        }

        else if (id == 6) {
            $scope.$root.get_region_list();
            $scope.title = 'Region';
        }

        else if (id == 7) {
            $scope.$root.get_segment_list();
            $scope.title = 'Segment';
        }

        else if (id == 8) {
=======
        } else if (id == 6) {
            $scope.$root.get_region_list();
            $scope.title = 'Region';
        } else if (id == 7) {
            $scope.$root.get_segment_list();
            $scope.title = 'Segment';
        } else if (id == 8) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.$root.get_buyinggroup_list();
            $scope.title = 'Buying Group';
        }

        if (id == 2 || id == 6 || id == 7 || id == 8) angular.element('#nested_popup_sp').modal({ show: true });


        $scope.type = id;

        /*	$http
         .post(excUrl, post)
         .then(function (res) {
         if (res.data.ack == true) {
         $.each(res.data.response, function (index, obj) {
 
         $scope.country_type_arr.push(obj);
         });
 
         }
         });
         */
    }

<<<<<<< HEAD
    $scope.confirm = function (result, array, main_index, type) {
=======
    $scope.confirm = function(result, array, main_index, type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


        if (type == 2) var name = result.name;
        else var name = result.title;

<<<<<<< HEAD
        $.each(array, function (index, obj) {
=======
        $.each(array, function(index, obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (index == main_index) obj.operator_search = name;
        });

        angular.element('#nested_popup_sp').modal('hide');

    }

    $scope.cust_id = 0;
    $scope.crm_bucket_array = [];
<<<<<<< HEAD
    $scope.crm_bucket_detail = function (id) {
=======
    $scope.crm_bucket_detail = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.cust_id = id;

        $scope.crm_bucket = [];
        $scope.bucket_selected_array = [];
        var bucketApi = $scope.$root.sales + "customer/sale-bucket/get-sale-bucket-list";
        $http
            .post(bucketApi, { 'token': $scope.$root.token })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {

                    $scope.crm_bucket_array = res.data.response;
                    var bucketApi = $scope.$root.sales + "customer/sale-bucket/get-sales-person-and-bucket";
                    $http
                        .post(bucketApi, { module_id: $scope.cust_id, 'token': $scope.$root.token, 'type': 1 })
<<<<<<< HEAD
                        .then(function (emp_data) {
=======
                        .then(function(emp_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                            if (emp_data.data.ack == true) {
                                $scope.selectedSalespersons_bucket = emp_data.data.response_salesperson;


<<<<<<< HEAD
                                $.each($scope.crm_bucket_array, function (indx, obj) {
                                    obj.chk = false;
                                    obj.isPrimary = false;

                                    $.each(emp_data.data.response, function (indx, obj2) {
=======
                                $.each($scope.crm_bucket_array, function(indx, obj) {
                                    obj.chk = false;
                                    obj.isPrimary = false;

                                    $.each(emp_data.data.response, function(indx, obj2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        if (obj.id == obj2.bucket_id) {
                                            obj.chk = true;
                                            obj.bucket_id = obj2.bucket_id;
                                            if (obj2.is_primary == 1) obj.isPrimary = true;

                                            $scope.bucket_selected_array.push(obj);
                                        }
                                    });
                                });
                            }

                        });

                    $('#crm_bucket').modal({ show: true });
<<<<<<< HEAD
                }
                else toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
=======
                } else toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            });
    }

    $scope.selectedSalespersons_bucket = [];
<<<<<<< HEAD
    $scope.get_bucket_salesperson = function (id) {
=======
    $scope.get_bucket_salesperson = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.salepersons_bucket = [];
        $scope.selectedSalespersons_bucket = [];
        $scope.searchKeywordpop3 = '';

        //var postUrl = $scope.$root.hr + "employee/listings";
        var postUrl = $scope.$root.sales + "customer/sale-bucket/get-sales-person-bucket";
        var postData = {
            'bucket_selected_array': $scope.bucket_selected_array,
            module_id: id,
            'token': $scope.$root.token
        };

        $http
            .post(postUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.salepersons_bucket = res.data.response;

                    var salepersonUrl = $scope.$root.sales + "crm/crm/get-crm-salesperson";
                    $http
                        .post(salepersonUrl, { id: $scope.cust_id, 'token': $scope.$root.token, 'type': 2 })
<<<<<<< HEAD
                        .then(function (emp_data) {

                            if (emp_data.data.ack == true) {
                                var ids = 0;
                                $.each($scope.salepersons_bucket, function (indx, obj) {
                                    ids = obj.id.split('.')[0];
                                    $.each(emp_data.data.response, function (indx, obj2) {
=======
                        .then(function(emp_data) {

                            if (emp_data.data.ack == true) {
                                var ids = 0;
                                $.each($scope.salepersons_bucket, function(indx, obj) {
                                    ids = obj.id.split('.')[0];
                                    $.each(emp_data.data.response, function(indx, obj2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        if (ids === obj2.salesperson_id && obj.bucket_id === id) {
                                            $scope.selectedSalespersons_bucket.push(obj);
                                        }
                                    });
                                });
                            }
                        });


                    angular.element('#salesperson_bucket').modal({ show: true });
<<<<<<< HEAD
                }
                else toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
=======
                } else toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            });

    }

    $scope.customer_loc_record = {};
<<<<<<< HEAD
    $scope.get_customer_loc = function (id) {
=======
    $scope.get_customer_loc = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.columns_customer_loc_record = [];
        $scope.customer_loc_record = {};
        $scope.searchKeywordpop3 = '';

        var ApiAjax = $scope.$root.sales + "crm/crm/alt-depots";
        $http
            .post(ApiAjax, { 'column': 'crm_id', 'value': id, token: $scope.$root.token })
<<<<<<< HEAD
            .then(function (res) {
                if (res.data.record.result) {

                    $scope.customer_loc_record = res.data.record.result;
                    angular.forEach(res.data.record.result[0], function (val, index) {
=======
            .then(function(res) {
                if (res.data.record.result) {

                    $scope.customer_loc_record = res.data.record.result;
                    angular.forEach(res.data.record.result[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        //   if (index != 'chk' && index != 'id'&& index != 'Location'&& index != 'Type') {
                        $scope.columns_customer_loc_record.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                        //    }
                    });

                    angular.element('#customer_location').modal({ show: true });
<<<<<<< HEAD
                }
                else toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
=======
                } else toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            });


    }

<<<<<<< HEAD
    $scope.delete_bucket_frm_customer = function (id, index, arr_data_ret) {
=======
    $scope.delete_bucket_frm_customer = function(id, index, arr_data_ret) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


        var delUrl = $scope.$root.sales + "customer/sale-bucket/delete-bucket-customer-card";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data_ret.splice(index, 1);
                    }
                    else toaster.pop('error', 'Info', 'Record cannot be Deleted.');

                });
        },
            function (reason) {
=======
        }).then(function(value) {
                $http
                    .post(delUrl, { id: id, 'token': $scope.$root.token })
                    .then(function(res) {
                        if (res.data.ack == true) {
                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                            arr_data_ret.splice(index, 1);
                        } else toaster.pop('error', 'Info', 'Record cannot be Deleted.');

                    });
            },
            function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                console.log('Modal promise rejected. Reason: ', reason);
            });


    }

<<<<<<< HEAD
    $scope.clear_search = function () {
=======
    $scope.clear_search = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.searchKeyword = {};
        var postData = {};
        $scope.array_dynamic_filter = {};
        $scope.array_dynamic_filter = [{ sort_id: '1' }];

        /*	$scope.searchKeyword.normal_filter='';
         $scope.searchKeyword.operator_filter='';
         $scope.searchKeyword.operator_search='';
         $scope.searchKeyword.logical_filter='';
         */
        //$scope.item_paging.spage =1;
        $rootScope.item_paging.spage = 1;
        $scope.arr_customer_all = {};
        //$scope.getcustomer_filter();
    }

    $scope.array_dynamic_filter = {};
    $scope.array_dynamic_filter = [{ sort_id: '1' }];

<<<<<<< HEAD
    $scope.addNewChoice = function (item) {
=======
    $scope.addNewChoice = function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if (item.logical_filter !== undefined || item.logical_filter !== null) {
            var newItemNo = $scope.array_dynamic_filter.length + 1;
            $scope.array_dynamic_filter.push({ 'sort_id': '' + newItemNo });
        }
    };

<<<<<<< HEAD
    $scope.remove_choice = function (item, index1) {
=======
    $scope.remove_choice = function(item, index1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        //  var lastItem = $scope.array_dynamic_filter.length-1;
        $scope.array_dynamic_filter.splice(index1, 1); //lastItem

<<<<<<< HEAD
        $.each($scope.array_dynamic_filter, function (index, obj_rec) {
=======
        $.each($scope.array_dynamic_filter, function(index, obj_rec) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (index1 - 1 == index) obj_rec.logical_filter = '';
        });

    }

    //----------------------General Ledger filter by Ahmad----------------

    $scope.generalLedgerFilterArray = [];
    $scope.generalLedgerFilterArray = [
        { 'name': 'G/L Account No.', 'id': 1 },
        { 'name': 'G/L Account Name', 'id': 2 },
        { 'name': 'Category', 'id': 3 },
        { 'name': 'Sub-category', 'id': 4 }
    ];
    $scope.searchKeyword = {};

    // $scope.getGeneralLedgerFilter = function (isShow, type, item_paging) {
    //     $scope.showLoader = true;

    //     var postData = {};
    //     $scope.title = 'Create General Ledger Filter';
    //     var postprdUrl = $scope.$root.sales + "customer/sale-bucket/get-general-ledger-filter-list";
    //     postData.token = $scope.$root.token;
    //     postData.type = type;
    //     postData.module_id = $scope.$root.sale_target_id;

    //     if (item_paging == 1) $rootScope.item_paging.spage = 1
    //     postData.page = $rootScope.item_paging.spage;

    //     postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;
    //     if (postData.pagination_limits == -1) {
    //         postData.page = -1;
    //     }


    //     postData.array_dynamic_filter_product = $scope.array_dynamic_filter_product


    //     $http
    //         .post(postprdUrl, postData)
    //         .then(function (res) {
    //             $scope.columns = [];
    //             $scope.arr_all_product = [];
    //             if (res.data.ack == true) {

    //                 $scope.total = res.data.total;
    //                 $scope.item_paging.total_pages = res.data.total_pages;
    //                 $scope.item_paging.cpage = res.data.cpage;
    //                 $scope.item_paging.ppage = res.data.ppage;
    //                 $scope.item_paging.npage = res.data.npage;
    //                 $scope.item_paging.pages = res.data.pages;

    //                 $scope.total_paging_record = res.data.total_paging_record;


    //                 $.each(res.data.response, function (indx, obj) {
    //                     obj.chk = false;
    //                     // obj.isPrimary = false;
    //                     if ($scope.selectedProdct.length > 0) {
    //                         $.each($scope.selectedProdct, function (indx, obj2) {
    //                             //  if (obj.id == obj2.id)   obj.chk = true;
    //                         });
    //                     }
    //                     $scope.arr_all_product.push(obj);
    //                 });

    //                 //$scope.arr_all_product=$scope.$root.remove_dupciation_in_array($scope.arr_all_product);

    //                 angular.forEach(res.data.response[0], function (val, index) {
    //                     if (index != 'chk' && index != 'id') {
    //                         $scope.columns.push({
    //                             'title': toTitleCase(index),
    //                             'field': index,
    //                             'visible': true
    //                         });
    //                     }
    //                 });

    //                 $scope.showLoader = false;


    //             }
    //             else $scope.showLoader = false;
    //             //toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
    //         });

    //     if (!isShow) angular.element('#product_dilter_pop').modal({ show: true });
    // }


    //----------------------product filter----------------

    $scope.arr_filter_product = [];
    $scope.bucketFilterData;



<<<<<<< HEAD
    $scope.moduleDataRetriever = function (moduleName) {
        $scope.columns = [];
        $scope.tableData = [];
        $scope.moduleName = moduleName;
        $scope.arr_filter_product = [];
        angular.forEach($scope.bucketFilterData[moduleName], function (obj) {
            if (obj.constructor === Object) {
                var tempObj = {
                    name: obj.meta.display_field_name,
                    field_name: obj.meta.field_name,
                    display_field_name: obj.meta.display_field_name,
                    foreign_key_name: obj.meta.foreign_key_name,
                    foreign_key_id: obj.meta.foreign_key_id,
                    is_numeric: obj.meta.is_numeric
                };
                $scope.arr_filter_product.push(tempObj);
            }
        })
    }
    // $scope.arr_filter_product = [
    //     { 'name': 'ItemNo.', 'id': 1 },
    //     { 'name': 'ItemDescription', 'id': 2 },
    //     { 'name': 'Category', 'id': 3 },
    //     { 'name': 'Brand', 'id': 4 },
    //     { 'name': 'Unit', 'id': 5 },
    //     { 'name': 'ItemOriginCountry', 'id': 6 },
    // ];
=======
    $scope.moduleDataRetriever = function(moduleName) {
            $scope.columns = [];
            $scope.tableData = [];
            $scope.moduleName = moduleName;
            $scope.arr_filter_product = [];
            angular.forEach($scope.bucketFilterData[moduleName], function(obj) {
                if (obj.constructor === Object) {
                    var tempObj = {
                        name: obj.meta.display_field_name,
                        field_name: obj.meta.field_name,
                        display_field_name: obj.meta.display_field_name,
                        foreign_key_name: obj.meta.foreign_key_name,
                        foreign_key_id: obj.meta.foreign_key_id,
                        is_numeric: obj.meta.is_numeric
                    };
                    $scope.arr_filter_product.push(tempObj);
                }
            })
        }
        // $scope.arr_filter_product = [
        //     { 'name': 'ItemNo.', 'id': 1 },
        //     { 'name': 'ItemDescription', 'id': 2 },
        //     { 'name': 'Category', 'id': 3 },
        //     { 'name': 'Brand', 'id': 4 },
        //     { 'name': 'Unit', 'id': 5 },
        //     { 'name': 'ItemOriginCountry', 'id': 6 },
        // ];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    $scope.isProoductChanged_detail = false;
    $scope.arr_all_product = [];
    $scope.selectedProdct = [];
    $scope.searchKeyword = {};
    $scope.module_select = "";

<<<<<<< HEAD
    $scope.ifShowSearchBtn = function () {
=======
    $scope.ifShowSearchBtn = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var flag = true;
        if ($scope.array_dynamic_filter_product[0].normal_filter && $scope.array_dynamic_filter_product[0].operator_filter && $scope.array_dynamic_filter_product[0].operator_search) {
            flag = false;
        }
        return flag;
    }

<<<<<<< HEAD
    $scope.getFilterSearchResults = function (isShow, type, item_paging, moduleName, go) {
=======
    $scope.getFilterSearchResults = function(isShow, type, item_paging, moduleName, go) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.showLoader = true;
        var postprdUrl = "";
        postData.token = $scope.$root.token;
        postData.type = type;
        postData.bucket_id = $scope.$root.sale_target_id;
        postData.module_id;
        postprdUrl = $scope.$root.sales + "customer/sale-bucket/get-filter-results";
        switch (moduleName) {
            case ("Customer"):
                $scope.module_id = 48;
                $scope.title = "Create Customer Filter";
                break;
            case ("Item"):
                $scope.module_id = 11;
                $scope.title = "Create Item Filter";
                break;
            case ("CRM"):
                $scope.module_id = 40;
                $scope.title = "Create CRM Filter";
                break;
            case ("General Ledger"):
                $scope.module_id = 65;
                $scope.title = "Create G/L Filter";
                break;
            case ("SRM"):
                $scope.module_id = 18;
                $scope.title = "Create SRM Filter";
                break;
            case ("Supplier"):
                $scope.module_id = 24;
                $scope.title = "Create Supplier Filter";
                break;
        }
        postData.module_id = $scope.module_id;
        if ($scope.array_dynamic_filter_product.length > 1)
            for (var i = $scope.array_dynamic_filter_product.length - 1; i >= 0; i--) {
                var obj = $scope.array_dynamic_filter_product[i];
                if (!(obj.hasOwnProperty("normal_filter")) || !(obj.hasOwnProperty("operator_filter")) || !(obj.hasOwnProperty("operator_search"))) {
                    $scope.array_dynamic_filter_product.splice(i, 1);
                }
            }
<<<<<<< HEAD
        /* angular.forEach($scope.array_dynamic_filter_product, function (obj, index) {
            if (!(obj.hasOwnProperty("normal_filter")) || !(obj.hasOwnProperty("operator_filter")) || !(obj.hasOwnProperty("operator_search"))) {
                $scope.array_dynamic_filter_product.splice(index, 1);
            }
        }) */
=======
            /* angular.forEach($scope.array_dynamic_filter_product, function (obj, index) {
                if (!(obj.hasOwnProperty("normal_filter")) || !(obj.hasOwnProperty("operator_filter")) || !(obj.hasOwnProperty("operator_search"))) {
                    $scope.array_dynamic_filter_product.splice(index, 1);
                }
            }) */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var arrLength = $scope.array_dynamic_filter_product.length;
        if (arrLength && $scope.array_dynamic_filter_product[arrLength - 1].hasOwnProperty("logical_filter")) {
            delete $scope.array_dynamic_filter_product[arrLength - 1].logical_filter
        }
        postData.array_dynamic_filter_product = $scope.array_dynamic_filter_product;

        postData.type = type;
        // debugger
        $http
            .post(postprdUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack || (res.data.response != undefined && res.data.response.length == 0)) {

                    $scope.tableData = res.data.response;

                    $scope.localResultsPagination = {
                        currentPage: 0,
                        pageSize: 25,
<<<<<<< HEAD
                        numberOfPages: function () {
=======
                        numberOfPages: function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            return Math.ceil($scope.tableData.length / $scope.localResultsPagination.pageSize);
                        }
                    }

                    $scope.columns = [];
                    $scope.record = res.data.response;
<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columns.push({
                            'title': index,
                            'field': index,
                            'visible': true
                        });
                    });
                    console.log("SUCCESS TRACE", res.data);
                    if (res.data.response.length == 0) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(634));
                    }
<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    console.log("ERROR TRACE", res.data);
                    toaster.pop('error', 'Incorrect Filter!', 'Check Console for Details!');
                }
                $scope.showLoader = false;
            });
    }

<<<<<<< HEAD
    $scope.getproduct_filter = function (isShow, type, item_paging, moduleName, go) {
        $scope.columns = [];
        var postData   = {};
        $scope.title   = '';
=======
    $scope.getproduct_filter = function(isShow, type, item_paging, moduleName, go) {
        $scope.columns = [];
        var postData = {};
        $scope.title = '';
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if ($scope.rec.name == undefined || $scope.rec.name.length == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Bucket Name']));
            $scope.showLoader = false;
            return;
        }
        // if ($scope.$root.sale_target_id == undefined) {
        //     $scope.stopChangeState = true;
        //     $scope.update_main($scope.rec);
        // }
<<<<<<< HEAD
        postData.token     = $scope.$root.token;
        postData.type      = type;
=======
        postData.token = $scope.$root.token;
        postData.type = type;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        postData.bucket_id = $scope.$root.sale_target_id;
        postData.module_id;
        switch (moduleName) {
            case ("Customer"):
                $scope.module_id = 48;
                $scope.title = "Create Customer Filter";
                break;
            case ("Item"):
                $scope.module_id = 11;
                $scope.title = "Create Item Filter";
                break;
            case ("CRM"):
                $scope.module_id = 40;
                $scope.title = "Create CRM Filter";
                break;
            case ("General Ledger"):
                $scope.module_id = 65;
                $scope.title = "Create G/L Filter";
                break;
            case ("SRM"):
                $scope.module_id = 18;
                $scope.title = "Create SRM Filter";
                break;
            case ("Supplier"):
                $scope.module_id = 24;
                $scope.title = "Create Supplier Filter";
                break;
            case ("HR"):
<<<<<<< HEAD
                    $scope.module_id = 1;
                    $scope.title = "Create HR Filter";
                    break;
        }
        postData.module_id = $scope.module_id;

        if ($scope.$root.sale_target_id == undefined){
=======
                $scope.module_id = 1;
                $scope.title = "Create HR Filter";
                break;
        }
        postData.module_id = $scope.module_id;

        if ($scope.$root.sale_target_id == undefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            // save bucket and then get back here...
            $scope.moduleName = moduleName;
            $scope.askConfirmation($scope.rec);
            return;
        }

        $scope.showLoader = true;

        if (typeof moduleName != "undefined") {
            $scope.moduleDataRetriever(moduleName);
            $scope.get_bucket_product_edit($scope.$root.sale_target_id, 1, $scope.module_id, isShow);
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.moduleDataRetriever($scope.moduleName);
        }
        // if (!moduleName) {


        //     if (item_paging == 1) $rootScope.item_paging.spage = 1
        //     postData.page = $rootScope.item_paging.spage;

        //     postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;
        //     if (postData.pagination_limits == -1) {
        //         postData.page = -1;
        //         //$scope.searchKeyword={};
        //         //$scope.array_dynamic_filter_product = {};
        //         //$scope.array_dynamic_filter_product = [{sort_id: '1'}];
        //         //	$scope.arr_all_product = {};
        //     }

        //     //if(item_paging==1)$scope.item_paging.spage=1
        //     //postData.page= $scope.item_paging.spage;

        //     postData.array_dynamic_filter_product = $scope.array_dynamic_filter_product.sort((a, b) => a.sort_id > b.sort_id);



        //     /*
        //      if($scope.searchKeyword.normal_filter!==undefined)
        //      postData.normal_filter = $scope.searchKeyword.normal_filter.id!==undefined ? $scope.searchKeyword.normal_filter.id:0;
        //      if($scope.searchKeyword.operator_filter!==undefined)postData.operator_filter=$scope.searchKeyword.operator_filter.id!==undefined?$scope.searchKeyword.operator_filter.id:0;
        //      if($scope.searchKeyword.operator_search!==undefined)
        //      postData.operator_search=$scope.searchKeyword.operator_search;

        //      if($scope.searchKeyword.logical_filter!==undefined)
        //      postData.logical_filter = $scope.searchKeyword.logical_filter.id!==undefined?$scope.searchKeyword.logical_filter.id:0;
        //      */

        //     $http
        //         .post(postprdUrl, postData)
        //         .then(function (res) {
        //             $scope.columns = [];
        //             $scope.arr_all_product = [];
        //             if (res.data.ack == true) {

        //                 $scope.total = res.data.total;
        //                 $scope.item_paging.total_pages = res.data.total_pages;
        //                 $scope.item_paging.cpage = res.data.cpage;
        //                 $scope.item_paging.ppage = res.data.ppage;
        //                 $scope.item_paging.npage = res.data.npage;
        //                 $scope.item_paging.pages = res.data.pages;

        //                 $scope.total_paging_record = res.data.total_paging_record;


        //                 $.each(res.data.response, function (indx, obj) {
        //                     obj.chk = false;
        //                     // obj.isPrimary = false;
        //                     if ($scope.selectedProdct.length > 0) {
        //                         $.each($scope.selectedProdct, function (indx, obj2) {
        //                             //  if (obj.id == obj2.id)   obj.chk = true;
        //                         });
        //                     }
        //                     $scope.arr_all_product.push(obj);
        //                 });

        //                 //$scope.arr_all_product=$scope.$root.remove_dupciation_in_array($scope.arr_all_product);

        //                 angular.forEach(res.data.response[0], function (val, index) {
        //                     if (index != 'chk' && index != 'id') {
        //                         $scope.columns.push({
        //                             'title': toTitleCase(index),
        //                             'field': index,
        //                             'visible': true
        //                         });
        //                     }
        //                 });

        //                 $scope.showLoader = false;


        //             }
        //             else $scope.showLoader = false;
        //             //toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
        //         });
        // }



        //	if($scope.$root.sale_target_id!==undefined && isShow ) $scope.get_bucket_product_edit($scope.$root.sale_target_id,1);
    }

<<<<<<< HEAD
    angular.element(document).on('click', '.checkAll_Product', function () {
=======
    angular.element(document).on('click', '.checkAll_Product', function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.selectedProdct = [];
        if (angular.element('.checkAll_Product').is(':checked') == true) {
            $scope.isProoductChanged_detail = true;
            for (var i = 0; i < $scope.arr_all_product.length; i++) {
                $scope.arr_all_product[i].chk = true;
                $scope.selectedProdct.push($scope.arr_all_product[i]);
            }
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            for (var i = 0; i < $scope.arr_all_product.length; i++) {
                $scope.arr_all_product[i].chk = false;
            }
            $scope.selectedProdct = [];
        }

<<<<<<< HEAD
        $scope.$root.$apply(function () {
=======
        $scope.$root.$apply(function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.selectedProdct;
        });

    });

<<<<<<< HEAD
    $scope.selectProduct_bucket = function (cust) {
=======
    $scope.selectProduct_bucket = function(cust) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.isProoductChanged_detail = true;

        for (var i = 0; i < $scope.arr_all_product.length; i++) {
            if (cust.id == $scope.arr_all_product[i].id) {
                if ($scope.arr_all_product[i].chk == true) {
                    $scope.arr_all_product[i].chk = false;
<<<<<<< HEAD
                    $.each($scope.selectedProdct, function (indx, obj) {
=======
                    $.each($scope.selectedProdct, function(indx, obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (obj != undefined) {
                            if (obj.id == cust.id)
                                $scope.selectedProdct.splice(indx, 1);
                        }
                    });
<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.arr_all_product[i].chk = true;
                    $scope.selectedProdct.push($scope.arr_all_product[i]);
                }

            }

        }
        if ($scope.selectedProdct.length == $scope.arr_all_product.length) {
<<<<<<< HEAD
            $timeout(function () {
                $scope.$root.$apply(function () {
                    angular.element('.checkAll_Product').prop('checked', true);
                });
            }, 500);
        }
        else {
            $timeout(function () {
                $scope.$root.$apply(function () {
=======
            $timeout(function() {
                $scope.$root.$apply(function() {
                    angular.element('.checkAll_Product').prop('checked', true);
                });
            }, 500);
        } else {
            $timeout(function() {
                $scope.$root.$apply(function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    angular.element('.checkAll_Product').prop('checked', false);
                });
            }, 500);
        }
    }


    // this function will sort an object array based on it's properties
    function createComparator(property) {
<<<<<<< HEAD
        return function (a, b) {
=======
        return function(a, b) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            return a[property] - b[property];
        };
    }

    $scope.allAppliedFilters = [];
<<<<<<< HEAD
    $scope.ifFilters = function (moduleId) {
        var flag = false;
        angular.forEach($scope.allAppliedFilters, function (obj, index) {
=======
    $scope.ifFilters = function(moduleId) {
        var flag = false;
        angular.forEach($scope.allAppliedFilters, function(obj, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (obj.module_id == moduleId) {
                flag = true;
            }
        })
        return flag;
    }

<<<<<<< HEAD
    $scope.get_bucket_product_edit = function (id, type, moduleId, isShow) {
=======
    $scope.get_bucket_product_edit = function(id, type, moduleId, isShow) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.showLoader = true;
        var salepersonUrl = $scope.$root.sales + "customer/sale-bucket/getBucketFilters";
        $http
            .post(salepersonUrl, { bucket_id: id, 'token': $scope.$root.token, 'type': type })
<<<<<<< HEAD
            .then(function (emp_data) {
=======
            .then(function(emp_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (emp_data.data.ack == true) {


                    // $.each($scope.arr_all_product, function (indx, obj) {
                    //     obj.chk = false;
                    //     // obj.isPrimary = false;
                    //     $.each(emp_data.data.response_product, function (indx, obj2) {
                    //         if (obj.id == obj2.id) {
                    //             //  obj.chk = true;
                    //             $scope.selectedProdct.push(obj);
                    //         }
                    //     });
                    //     $scope.arr_all_product.push(obj);
                    // });
                    if ($scope.allAppliedFilters.length == 0) {
                        $scope.allAppliedFilters = emp_data.data.response_filter;
                        $scope.showLoader = false;
                        //console.log($scope.allAppliedFilters);
                        return;
                    }
                    $scope.allAppliedFilters = emp_data.data.response_filter;
                    $scope.array_dynamic_filter_product = [];
                    //$scope.array_dynamic_filter_product = emp_data.data.response_filter;
<<<<<<< HEAD
                    $.each(emp_data.data.response_filter, function (i, o) {
=======
                    $.each(emp_data.data.response_filter, function(i, o) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (o.module_id != moduleId.toString()) return true;
                        else {
                            $scope.array_dynamic_filter_product.push(o);
                        }
                    })
                    if ($scope.array_dynamic_filter_product.length == 0) {
                        $scope.array_dynamic_filter_product = [{ sort_id: '1' }];
<<<<<<< HEAD
                    }
                    else {
                        $scope.array_dynamic_filter_product.sort(createComparator("sort_id"));
                    }
                    $.each($scope.array_dynamic_filter_product, function (index, obj_rec) {

                        obj_rec.id = obj_rec.id;
                        obj_rec.sort_id = obj_rec.sort_id;   
                        
                        $.each($scope.arr_filter_product, function (index, obj) {
                            if (obj.field_name == obj_rec.normal_filter) obj_rec.normal_filter = obj;
                        });

                        if(obj_rec.normal_filter && obj_rec.normal_filter.is_numeric == 1)
                            obj_rec.operator_search = parseFloat(obj_rec.operator_search);

                        $.each($scope.arr_operator, function (index, obj) {
                            if (obj.id == obj_rec.operator_filter) obj_rec.operator_filter = obj;
                        });

                        $.each($scope.arr_logic_operator, function (index, obj) {
=======
                    } else {
                        $scope.array_dynamic_filter_product.sort(createComparator("sort_id"));
                    }
                    $.each($scope.array_dynamic_filter_product, function(index, obj_rec) {

                        obj_rec.id = obj_rec.id;
                        obj_rec.sort_id = obj_rec.sort_id;

                        $.each($scope.arr_filter_product, function(index, obj) {
                            if (obj.field_name == obj_rec.normal_filter) obj_rec.normal_filter = obj;
                        });

                        if (obj_rec.normal_filter && obj_rec.normal_filter.is_numeric == 1)
                            obj_rec.operator_search = parseFloat(obj_rec.operator_search);

                        $.each($scope.arr_operator, function(index, obj) {
                            if (obj.id == obj_rec.operator_filter) obj_rec.operator_filter = obj;
                        });

                        $.each($scope.arr_logic_operator, function(index, obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (obj.id == obj_rec.logical_filter) obj_rec.logical_filter = obj;
                        });

                        // $scope.array_dynamic_filter_product.push(obj_rec);
                    });

                    var new_add = $scope.arr_filter_product.length - emp_data.data.total;
                    if (new_add > 0 && new_add < $scope.arr_filter_product.length) {

                        var newItemNo = $scope.array_dynamic_filter_product.length + new_add;
                        var start = (parseFloat(emp_data.data.total)) + 1;

                        for (var i = start; i <= newItemNo; i++) {
                            // $scope.array_dynamic_filter_product.push({sort_id: '' + [i]}); //object.i
                        }

                    }




<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.array_dynamic_filter_product = {};
                    $scope.array_dynamic_filter_product = [{ sort_id: '1' }];
                    //toaster.pop('error', 'info',$scope.$root.getErrorMessageByCode(400));
                }
                console.log($scope.array_dynamic_filter_product);
                if (isShow) angular.element('#product_dilter_pop').modal({ show: true });
                $scope.showLoader = false;

            });

    }
    if ($scope.$root.sale_target_id)
        $scope.get_bucket_product_edit($scope.$root.sale_target_id, 1);

<<<<<<< HEAD
    $scope.add_bucket_product = function (id, type) {
        if ($scope.array_dynamic_filter_product[$scope.array_dynamic_filter_product.length - 1].normal_filter && $scope.array_dynamic_filter_product[$scope.array_dynamic_filter_product.length - 1].operator_filter  == undefined)
        {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Operator']));
            return false;
        }
  
=======
    $scope.add_bucket_product = function(id, type) {
        if ($scope.array_dynamic_filter_product[$scope.array_dynamic_filter_product.length - 1].normal_filter && $scope.array_dynamic_filter_product[$scope.array_dynamic_filter_product.length - 1].operator_filter == undefined) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Operator']));
            return false;
        }

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.showLoader = true;
        //,$scope.selectedProducts[$scope.counter].id
        var check = false;
        var excUrl = $scope.$root.sales + "customer/sale-bucket/add-sale-bucket-product";
        var post = {};
        var temp = [];
        /*    $.each($scope.selectedProdct, function (index, obj) {
         temp.push({id: obj.id, isPrimary: obj.isPrimary});
         })
         post.salespersons = temp;*/

        if ($scope.array_dynamic_filter_product.length > 1)
<<<<<<< HEAD
          
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            for (var i = $scope.array_dynamic_filter_product.length - 1; i >= 0; i--) {

                var obj = $scope.array_dynamic_filter_product[i];
                if (!(obj.hasOwnProperty("normal_filter")) || !(obj.hasOwnProperty("operator_filter")) || !(obj.hasOwnProperty("operator_search"))) {
                    $scope.array_dynamic_filter_product.splice(i, 1);
                }
            }
<<<<<<< HEAD
        /* angular.forEach($scope.array_dynamic_filter_product, function (obj, index) {
            if (!(obj.hasOwnProperty("normal_filter")) || !(obj.hasOwnProperty("operator_filter")) || !(obj.hasOwnProperty("operator_search"))) {
                $scope.array_dynamic_filter_product.splice(index, 1);
            }
        }) */
=======
            /* angular.forEach($scope.array_dynamic_filter_product, function (obj, index) {
                if (!(obj.hasOwnProperty("normal_filter")) || !(obj.hasOwnProperty("operator_filter")) || !(obj.hasOwnProperty("operator_search"))) {
                    $scope.array_dynamic_filter_product.splice(index, 1);
                }
            }) */
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var arrLength = $scope.array_dynamic_filter_product.length;
        if (arrLength && $scope.array_dynamic_filter_product[arrLength - 1].hasOwnProperty("logical_filter")) {
            delete $scope.array_dynamic_filter_product[arrLength - 1].logical_filter
        }
        post.array_dynamic_filter_product = $scope.array_dynamic_filter_product;
        post.type = type;
        post.bucket_id = id;
        post.module_id = $scope.module_id;
        post.token = $scope.$root.token;
        $http
            .post(excUrl, post)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {

                    check = true;
                    $scope.allAppliedFilters = [];
                    $scope.get_bucket_product_edit(id, 1);
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
<<<<<<< HEAD
                }
                else {
                 
=======
                } else {

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(106));
                }
                angular.element('#product_dilter_pop').modal("hide");
                $scope.showLoader = false;

            });

    }

<<<<<<< HEAD
    $scope.get_filter_pop_product = function (id, main_index) {
=======
    $scope.get_filter_pop_product = function(id, main_index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.rec.searchKeywordpop2 = '';
        $scope.main_index = main_index;

        if (id == 3) {
            $scope.$root.get_category_list();
            $scope.title2 = 'Category';
<<<<<<< HEAD
        }

        else if (id == 4) {
            $scope.$root.get_brand_list();
            $scope.title2 = 'Brand';
        }

        else if (id == 5) {
            $scope.$root.get_uom_list();
            $scope.title2 = 'Unit';
        }

        else if (id == 6) {
=======
        } else if (id == 4) {
            $scope.$root.get_brand_list();
            $scope.title2 = 'Brand';
        } else if (id == 5) {
            $scope.$root.get_uom_list();
            $scope.title2 = 'Unit';
        } else if (id == 6) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            //$scope.$root.get_uom_list();
            $scope.title2 = 'ItemOriginCountry';
        }

        // hiding this popup because the concept of popup over popup isn't a good one..
        //if (id == 3 || id == 4 || id == 5) angular.element('#nested_popup_product').modal({ show: true });


        $scope.type = id;
    }

<<<<<<< HEAD
    $scope.confirm_product = function (result, array, main_index, type) {
=======
    $scope.confirm_product = function(result, array, main_index, type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var name = result.name;
        if (type == 5) name = result.title;

<<<<<<< HEAD
        $.each(array, function (index, obj) {
=======
        $.each(array, function(index, obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (index == main_index) obj.operator_search = name;
        });

        angular.element('#nested_popup_product').modal('hide');

    }

<<<<<<< HEAD
    $scope.clear_search_product = function () {
=======
    $scope.clear_search_product = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        //test cross domain
        /*
         var  excUrl= "http://wcidevapps.com/salescentral/idisk/0001000383/iDisk";
         $http
         .post(excUrl, {   'token': $scope.$root.token })
         .then(function (res) {
         console.log(res);
         });
 
         ajax.request({
         url: 'http://www.w3schools.com/cssref/css3_pr_text-shadow.asp',
         dataType: 'jsonp',
         method: 'GET',
         headers: {
         'Access-Control-Allow-Origin': '*'
         },
         success: function(response) {
         console.log(response);
         }
         });
 
         return;*/


        $scope.item_paging.spage = 1;
        $scope.searchKeyword = {};
        var postData = {};
        $scope.array_dynamic_filter_product = {};
        $scope.array_dynamic_filter_product = [{ sort_id: '1' }];

        /*	$scope.searchKeyword.normal_filter='';
         $scope.searchKeyword.operator_filter='';
         $scope.searchKeyword.operator_search='';
         $scope.searchKeyword.logical_filter='';
         */
        $scope.arr_all_product = {};

        $scope.tableData = {};
        $scope.columns = {};

        // $scope.getproduct_filter();
    }

    $scope.array_dynamic_filter_product = {};
    $scope.array_dynamic_filter_product = [{ sort_id: '1' }];

<<<<<<< HEAD
    $scope.addNewIndexProduct = function (item, index) {
=======
    $scope.addNewIndexProduct = function(item, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // if ($scope.array_dynamic_filter_product.length == 4) {
        //     item.logical_filter = {};
        //     return;
        // }
        if (index != $scope.array_dynamic_filter_product.length - 1) {
            return;
        }
        if (item.logical_filter !== undefined || item.logical_filter !== null) {
            var newItemNo = $scope.array_dynamic_filter_product.length + 1;
            $scope.array_dynamic_filter_product.push({ 'sort_id': '' + newItemNo });
        }
    };

<<<<<<< HEAD
    $scope.resetFilterValue = function(obj){
        obj.operator_search = "";
    }

    $scope.removeIndexProduct = function (item, index1) {
=======
    $scope.resetFilterValue = function(obj) {
        obj.operator_search = "";
    }

    $scope.removeIndexProduct = function(item, index1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        //  var lastItem = $scope.array_dynamic_filter_product.length-1;
        $scope.array_dynamic_filter_product.splice(index1, 1); //lastItem

        if (index1 == $scope.array_dynamic_filter_product.length) {
            $scope.array_dynamic_filter_product[index1 - 1].logical_filter = "";
        }
        // $.each($scope.array_dynamic_filter_product, function (index, obj_rec) {
        //     if (index1 - 1 == index) obj_rec.logical_filter = '';
        // });
        //$scope.getproduct_filter();

    }


    $scope.$root.load_date_picker('sale bucket');

}