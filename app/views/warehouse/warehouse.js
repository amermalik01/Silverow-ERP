myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function($stateProvider, $locationProvider, $urlRouterProvider, helper) {

        $stateProvider
            .state('app.warehouse', {
                url: '/warehouse/:filter_id',
                title: 'Setup',
                templateUrl: helper.basepath('warehouse/warehouse.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.add-warehouse', {
                url: '/warehouse/add',
                title: 'Setup',
                templateUrl: helper.basepath('warehouse/add_form.html'), //addTabs
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'WarehouseEditController'
            })
            .state('app.view-warehouse', {
                url: '/warehouse/:id/view',
                title: 'Setup',
                templateUrl: helper.basepath('warehouse/_form.html'), //addTabs
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'WarehouseEditController'
            })
            .state('app.edit-warehouse', {
                url: '/warehouse/:id/edit',
                title: 'Setup',
                templateUrl: helper.basepath('warehouse/_form.html'), //addTabs
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'WarehouseEditController'
            })

    }
]);


WarehouseControllerListing.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "moduleTracker"];

myApp.controller('WarehouseControllerListing', WarehouseControllerListing);

function WarehouseControllerListing($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, moduleTracker) {

    moduleTracker.updateName("warehouse");
    moduleTracker.updateRecord("");

    $scope.$root.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
        { 'name': 'Warehouse', 'url': '#', 'isActive': false }
    ];

    var Api = $scope.$root.setup + "warehouse/listings";
    var delUrl = $scope.$root.setup + "warehouse/delete-warehouse";



    $scope.postData = {
        'token': $scope.$root.token,
        'all': "1"
    };

    $scope.tempWarehouseArr = {};
    $scope.searchKeyword = {};

    $scope.showWarehouseListing = function(item_paging) {

        $scope.warehouseParam = {};
        $scope.warehouseParam.token = $scope.$root.token;

        if (item_paging == 1)
            $scope.item_paging.spage = 1;

        $scope.warehouseParam.page = $scope.$root.item_paging.spage;

        // $scope.warehouseParam.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;
        // $scope.warehouseParam.item_paging = $scope.item_paging;

        if ($scope.warehouseParam.pagination_limits == -1) {
            $scope.warehouseParam.page = -1;
        }

        $scope.warehouseParam.searchKeyword = $scope.searchKeyword;
        $scope.showLoader = true;
        //$scope.postData

        $http
            .post(Api, $scope.warehouseParam)
            .then(function(res) {
                // $scope.tableData = res;
                /* $scope.columns = [];
                $scope.$data = {}; */

                $scope.showLoader = false;
                // debugger
                if (res.data.ack == true) {

                    $scope.tempWarehouseArr = res;

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    /* $scope.$data = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
                        if (index != 'chk' && index != 'id') {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }

                    }); */
                    angular.forEach($scope.tempWarehouseArr.data.response.tbl_meta_data.response.colMeta, function(obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });
                    $scope.showLoader = false;
                }
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });
    }


    //var vm = this;
    $scope.postData = {};

    $scope.postData = {
        'token': $scope.$root.token,
        'all': "1"
    };
    // $scope.$watch("MyCustomeFilters", function () {
    //     if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
    //         $scope.table.tableParams5.reload();
    //     }
    // }, true);
    // $scope.MyCustomeFilters = {}

    // vm.tableParams5 = new ngParams({
    //     page: 1,            // show first page
    //     count: $scope.$root.pagination_limit           // count per page
    // },
    //     {
    //         total: 0,           // length of data
    //         counts: [],         // hide page counts control

    //         getData: function ($defer, params) {
    //             ngDataService.getDataCustom($defer, params, Api, $filter, $scope, $scope.postData);
    //         }
    //     });

    function toTitleCase(str) {
        var title = str.replace('_', ' ');
        return title.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }


    $scope.getItem = function(parm) {
        $scope.rec = {};
        $scope.rec.token = $scope.$root.token;
        //$scope.rec.warehouse_id = $scope.rec.warehouse !=undefined? $scope.rec.warehouse.id:'';
        //$scope.rec.category_id = $scope.rec.category !=undefined? $scope.rec.category.id:'';
        if (parm == 'all') {
            $scope.rec = {};
            $scope.rec.token = $scope.$root.token;
        }
        $scope.postData = $scope.rec;
        $scope.$root.$broadcast("myReload");
    }

    $scope.$on("myReload", function(event) {
        //var ApiAjax = $resource('api/company/get_listing_ajax/:module_id/:module_table/:filter_id/:more_fields/:condition');

        // ngDataService.getDataCustom( $scope.MainDefer, $scope.mainParams, Api,$scope.mainFilter,$scope,$scope.postData);
        // ngDataService.getDataCustom($defer, params, Api, $filter, $scope, $scope.postData);
        $scope.table.tableParams5.reload();
        //return;
    });
    $scope.$data = {};
    $scope.delete = function(id, index, $data) {
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function(value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function(res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function(reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };
}


WarehouseEditController.$inject = ["$scope", "$filter", "$resource", "$timeout", "$http", "ngDialog", "toaster", "$stateParams", "$state", "moduleTracker"];
myApp.controller('WarehouseEditController', WarehouseEditController);

function WarehouseEditController($scope, $filter, $resource, $timeout, $http, ngDialog, toaster, $stateParams, $state, moduleTracker) {

    $scope.altContacListingShow = false;
    $scope.altContacFormShow = false;
    $scope.altbin_loc_FormShow = false;
    $scope.bin_loc_ListingShow = false;

    console.log($scope.altContacListingShow + ' ' + $scope.altContacFormShow + ' ' + $scope.altbin_loc_FormShow + ' ' + $scope.bin_loc_ListingShow);

    moduleTracker.updateName("warehouse");
    moduleTracker.updateRecord($stateParams.id);
    console.log(moduleTracker);

    if ($stateParams.id > 0) {
        $scope.check_wh_readonly = true;
    }

    $scope.delete = function(id, index, $data) {
        var delUrl = $scope.$root.setup + "warehouse/delete-warehouse";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function(value) {
            $http
                .post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token })
                .then(function(res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function() {
                            $state.go("app.warehouse", {});
                        }, 1000);
                    } else {
                        toaster.pop('error', 'Error', res.data.error);
                    }
                });
        }, function(reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    //console.log($scope.$root.defaultCountry);
    //--------------Country Code--------------------


    $scope.rec = {};

    $scope.showEditForm = function() {
        $scope.check_wh_readonly = false;
    }

    var vm = this;
    // $scope.datePicker = Calendar.get_caledar();
    $scope.class = 'block';

    $scope.drp = {};
    var id = $stateParams.id;
    $scope.$root.wrhID = id;
    var table = 'crm';
    //$scope.btnCancelUrl = 'app.item';

    $scope.$root.model_code = '';

    $scope.status_list = [];
    $scope.cost_types = [];
    $scope.shiping_list = [];
    $scope.countries = [];
    //$scope.type_list = [];

    $scope.arr_currency = [];
    $scope.arr_dimension = [];

    $scope.arr_volume_1 = [];
    $scope.arr_volume_2 = [];
    $scope.arr_volume_3 = [];
    $scope.price_method_list = [];
    $scope.formData_vol_1 = {};
    $scope.formData_vol_2 = {};
    $scope.formData_vol_3 = {};
    $scope.formData6 = {};
    $scope.columns = [];
    $scope.record = {};
    $scope.storage_list = {};
    $scope.formData_customer = {};
    $scope.selected = 0;
    $scope.total = 0;
    $scope.selected_count = 0;

    $scope.status_list = [{ value: 'Active', id: '1' }, { value: 'Inactive', id: '2' }];

    $scope.rec.status_ids = $scope.status_list[0];

    // $scope.styleOptions = {"1": "blue", "2": "violet", "3": "yellow", "4": "red"};

    $scope.cost_types = [{ title: 'Fixed', id: '1' }, { title: 'Daily', id: '2' }, {
        title: 'Weekly',
        id: '3'
    }, { title: 'Monthly', id: '4' }, { title: 'Annually', id: '5' }];

    /*$scope.cost_types = [{title: 'Fixed', id: '1'}, {title: 'Hourly', id: '2'}, {
     title: 'Daily',
     id: '3'
     }, {title: 'Weekly', id: '4'}];*/


    /*$scope.type_list = [{value: ' ', id: '0'}, {value: 'Transit', id: '1'}, {
     value: 'Direct',
     id: '2'
     }, {value: 'Warehouse', id: '3'}];*/
    $scope.storage_type_list = [];

    var storage_type_list_Url = $scope.$root.setup + "warehouse/get-warehouse-storage-type";
    $http
        .post(storage_type_list_Url, { 'token': $scope.$root.token })
        .then(function(res) {

            $scope.storage_type_list.push({ 'id': '', 'title': '' });

            if (res.data.ack == true)
                $scope.storage_type_list = res.data.response;

            $scope.storage_type_list.push({ 'id': '-1', 'title': '++ Add New ++' });

        });

    $scope.storage_list = [{ value: 'Day', id: '1' }, { value: 'Week', id: '2' }, { value: 'Month', id: '3' }];

    var countryUrl = $scope.$root.setup + "general/countries";
    $http
        .post(countryUrl, { 'token': $scope.$root.token })
        .then(function(res) {
            if (res.data.ack == true) {
                $scope.countries = res.data.response;
                if ($stateParams.id == undefined) {
                    $.each($scope.countries, function(index, elem) {
                        if (elem.id == $scope.$root.defaultCountry)
                            $scope.rec.country_id = elem;
                    });
                }
            }
        });

    // var countryUrl = $scope.$root.setup + "general/countries";
    // $http
    //     .post(countryUrl, { 'token': $scope.$root.token })
    //     .then(function (res) {
    //         if (res.data.ack == true)
    //             $scope.countries = res.data.response;

    //     });

    // $.each($scope.countries, function (index, elem) {
    //     if (elem.id == $scope.$root.defaultCountry)
    //         $scope.rec.country_id = elem;
    // });
    //$scope.rec.country_id = $scope.$root.defaultCountry;
    // $scope.rec.country_id = $scope.$root.get_obj_frm_arry($scope.$root.country_type_arr, $scope.$root.defaultCountry);

    $scope.product_type = true;
    $scope.count_result = 0;



    //------------ Get Currency Rate -----------------------------------------------

    $scope.arr_currency = [];
    var currencyUrl = $scope.$root.setup + "general/currency-list";
    $http
        .post(currencyUrl, { 'token': $scope.$root.token })
        .then(function(res) {
            $scope.arr_currency = [];
            if (res.data.ack == true) {
                $scope.arr_currency = res.data.response;
                $.each($scope.arr_currency, function(index, elem) {
                    if (elem.id == $scope.$root.defaultCurrency) $scope.rec.currency_id = elem;
                });

            }
            //else   toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
        });


    // var ref_dimension_Url = $scope.$root.setup + "general/ref-dimension-list";
    var ref_dimension_Url = $scope.$root.stock + "unit-measure/get-all-unit";
    $http
        .post(ref_dimension_Url, { 'token': $scope.$root.token })
        .then(function(res) {
            $scope.arr_dimension = [];
            if (res.data.ack == true) {
                $scope.arr_dimension = res.data.response;
            }
            //else   toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
        });

    var price = 0;
    var currency_id = 0;
    var converted_price = 0;
    $scope.validatePrice = function(price, type) {
        //console.log(price+type);
        // if (price== undefined) return;
        /*  var currency_idd='';
         if(type=='level_1')currency_idd= $scope.rec.currency_id.id;
         var id = 0;
         if (val > 0) id = currency_idd;
         else  id = $scope.$root.defaultCurrency;

         $.each($scope.arr_currency, function (index, elem) {
         if (elem.id == id) $scope.rec.currency_id = elem;
         });*/
        if (type == 'level_1') {
            price = $scope.rec.storage;
            currency_id = $scope.rec.currency_id.id;
        }

        var isValide = true;
        if (Number(price) == undefined || currency_id == undefined) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Currency']));
            $('.cur_block').attr("disabled", false);
            isValide = false;
            return;
        }

        var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
        $http
            .post(currencyURL, { 'id': currency_id, token: $scope.$root.token })
            .then(function(res) {
                if (res.data.ack == true) {

                    if (res.data.response.conversion_rate == null) {

                        if (type == 'level_1') $scope.rec.converted_price = null;

                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Currency Conversion Rate']));
                        $('.cur_block').attr("disabled", true);
                        return;
                    }

                    var newPrice1 = Number(price);
                    var newPrice = 0;

                    if (currency_id != $scope.$root.defaultCurrency)
                        newPrice = Number(newPrice1) / Number(res.data.response.conversion_rate);
                    else newPrice = Number(newPrice1);


                    if (newPrice1 > 0) converted_price = Number(newPrice1).toFixed(2);
                    else newPrice = 0;
                    if (newPrice > 0) converted_price = Number(newPrice).toFixed(2);
                    else newPrice = 0;

                    if (type == 'level_1') $scope.rec.converted_price = converted_price;
                    /*else if(type=='level_2') $scope.rec.converted_price= converted_price;
                     else if(type=='level_3') $scope.rec.converted_price= converted_price;
                     */
                    //console.log("Converted Price:"+converted_price);

                    $('.cur_block').attr("disabled", false);
                }

            });
    }


    // if ($stateParams.id === undefined) $scope.getCode_WareHouse();

    // $scope.arr_generate = [{ 'id': '1', 'name': 'E-Dispatch Note', 'chk': false }];
    $scope.arr_generate = [{ 'id': '1', 'name': 'E-Dispatch Email', 'chk': false }];


    var additional_cost_title_Url = $scope.$root.setup + "warehouse/get-warehouse-loc-additional-cost-title";
    $http
        .post(additional_cost_title_Url, { 'token': $scope.$root.token })
        .then(function(res) {
            $scope.additional_cost_title = [];
            $scope.additional_cost_title.push({ 'id': '', 'title': '' });

            if (res.data.ack == true) $scope.additional_cost_title = res.data.response;
            //else    toaster.pop('error', 'Error', "No Category found!");

            $scope.additional_cost_title.push({ 'id': '-1', 'title': '++ Add New ++' });

        });

    $scope.rec_loc = {};

    if ($stateParams.id !== undefined) {


        $scope.showLoader = true;

        var DetailsURL = $scope.$root.setup + "warehouse/get-warehouse";


        $http
            .post(DetailsURL, { 'token': $scope.$root.token, 'id': id })
            .then(function(res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {

                    $scope.rec = res.data.response;
                    $scope.rec.id = res.data.response.id;
                    moduleTracker.updateRecordName(res.data.response.name);

                    $scope.drp.email_1 = res.data.response.dispatchNoteEmail;

                    if (res.data.response.generate) {
                        var arrGen = res.data.response.generate.split(',');
                        angular.forEach($scope.arr_generate, function(elem, index) {
                            var indx = arrGen.indexOf(elem.id) == -1;
                            if (!indx) {
                                $scope.arr_generate[index].chk = true;
                            }
                        });
                    }

                    $scope.$root.model_code = res.data.response.name + '( ' + res.data.response.wrh_code + ' )';

                    $scope.module_code = $scope.$root.model_code;


                    //$scope.rec.crm_no = res.data.response.wrh_no;

                    $scope.new_list = true;
                    $scope.save_list = false;

                    $.each($scope.status_list, function(index, obj) {
                        if (obj.id == res.data.response.status) {
                            $scope.rec.status_ids = $scope.status_list[index];
                        }
                    });

                    $.each($scope.storage_type_list, function(index, obj) {
                        if (obj.id == res.data.response.type) {
                            $scope.rec.types = $scope.storage_type_list[index];
                        }
                    });





                    $scope.rec_loc.title = $scope.rec.title;
                    $scope.rec_loc.warehouse_loc_sdate = $scope.rec.warehouse_loc_sdate;
                    $scope.rec_loc.warehouse_loc_edate = $scope.rec.warehouse_loc_edate;
                    $scope.rec_loc.bin_cost = $scope.rec.bin_cost;
                    $scope.rec_loc.description = $scope.rec.description;

                    $scope.rec_loc.id = $scope.rec.wlid;
                    $scope.rec_loc.parent_id = $scope.rec.parent_id;

                    $.each($scope.status_list, function(index, obj) {
                        if (obj.id == $scope.rec.status)
                            $scope.rec_loc.status_ids = $scope.status_list[index];
                    });

                    if ($scope.rec.currency_id > 0) {
                        $.each($scope.arr_currency, function(index, elem) {
                            if (elem.id == $scope.rec.currency_id)
                                $scope.rec_loc.currency = elem;
                        });

                    } else {
                        $.each($scope.arr_currency, function(index, elem) {
                            if (elem.id == $scope.$root.defaultCurrency)
                                $scope.rec_loc.currency = elem;
                        });
                    }

                    $.each($scope.arr_dimension, function(index, elem) {
                        if (elem.id == $scope.rec.dimensions_id)
                            $scope.rec_loc.dimension = elem;
                    });

                    $.each($scope.cost_types, function(index, elem) {
                        if (elem.id == $scope.rec.cost_type_id)
                            $scope.rec_loc.cost_type = elem;
                    });

                    var postUrl = $scope.$root.setup + "warehouse/alt-parent-bin-location";

                    $http
                        .post(postUrl, { 'token': $scope.$root.token, 'wrh_id': $scope.$root.wrhID, 'bin_loc_wrh_id': $scope.rec.wlid })
                        .then(function(res2) {

                            $scope.parent_bin = [];
                            if (res2.data.ack == true) {

                                $scope.parent_bin = res2.data.response;

                                $.each($scope.parent_bin, function(index, obj) {
                                    if (obj.id == $scope.rec_loc.parent_id)
                                        $scope.rec_loc.parent_bin_location = $scope.parent_bin[index];
                                });
                            }
                        });

                    /*$.each($scope.type_list, function (index, obj) {
                     if (obj.id == res.data.response.type) {
                     $scope.rec.types = $scope.type_list[index];
                     }
                     });*/


                    $.each($scope.storage_list, function(index, obj) {
                        if (obj.id == res.data.response.pallet_type) {
                            $scope.rec.pallet_type = $scope.storage_list[index];
                        }
                    });


                    $.each($scope.countries, function(index, elem) {
                        if (elem.id == res.data.response.country_id)
                            $scope.rec.country_id = elem;
                    });

                    $.each($scope.arr_currency, function(index, elem) {
                        if (elem.id == res.data.response.currency_id)
                            $scope.rec.currency_id = elem;
                    });

                    $scope.$root.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
                        { 'name': 'Warehouse', 'url': 'app.warehouse', 'style': '' },
                        { 'name': $scope.$root.model_code, 'url': '#', 'style': 'color:#515253;' }
                    ];
                }
            });
    } else {
        $scope.$root.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Warehouse', 'url': 'app.warehouse', 'style': '' }
        ];
    }

    $scope.generalInformation = function() {
        $scope.$root.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Warehouse', 'url': 'app.warehouse', 'style': '' },
            { 'name': $scope.$root.model_code, 'url': '#', 'style': 'color:#515253;' }
        ];

        /*{ 'name': 'General', 'url': '#', 'style': '' } */


        $scope.altContacListingShow = false;
        $scope.altContacFormShow = false;

        $scope.bin_loc_ListingShow = false;
        $scope.altbin_loc_FormShow = false;

        $scope.bin_loc_add_cost_FormShow = false;
        $scope.bin_loc_add_cost_List_Show = false;
    }


    //--------------------- start General   ------------------------------------------


    $scope.add_general_warehouse = function(rec, drp) {

        if ($scope.rec.wrh_code != undefined) {
            $scope.UpdateForm(rec, drp);
        } else {
            $scope.showLoader = true;

            var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
            var name = $scope.$root.base64_encode('warehouse');

            $http
                .post(getCodeUrl, {
                    'is_increment': 1,
                    'token': $scope.$root.token,
                    'tb': name,
                    'category': '',
                    'brand': ''
                })
                .then(function(res) {

                    if (res.data.ack == 1) {
                        $scope.showLoader = false;
                        $scope.rec.wrh_code = res.data.code;
                        // $scope.rec.wrh_no = res.data.nubmer;
                        $scope.count_result++;

                        if ($scope.count_result > 0) {
                            $scope.UpdateForm(rec, drp);
                            return true;
                        } else {
                            console.log($scope.count_result + 'd');
                            return false;
                        }

                    } else {
                        toaster.pop('error', 'info', res.data.error);
                        return false;
                    }
                }).catch(function(message) {
                    $scope.showLoader = false;
                    // toaster.pop('error', 'info', 'Server is not Acknowledging');
                    throw new Error(message.data);
                });
        }
    }
    $scope.setGenerate = function(id) {
        for (var i = 0; i < $scope.arr_generate.length; i++) {
            if (id == $scope.arr_generate[i].id) {
                if ($scope.arr_generate[i].chk == true)
                    $scope.arr_generate[i].chk = false
                else
                    $scope.arr_generate[i].chk = true
            }
        }
    }

    $scope.UpdateForm = function(rec, drp) {

        rec.country_ids = rec.country_id != undefined ? rec.country_id.id : 0;
        rec.pallet_types = rec.pallet_type != undefined ? rec.pallet_type.id : 0;
        rec.status = rec.status_ids != undefined ? rec.status_ids.id : 0;
        rec.type = (rec.types != undefined && rec.types != '') ? rec.types.id : 0;
        // rec.company_type = drp.company_type_id != undefined?drp.company_type_id.id:0;
        rec.currency_ids = rec.currency_id != undefined ? rec.currency_id.id : 0;
        // rec.type = 1;
        rec.token = $scope.$root.token;

        rec.dispatchNoteEmail = drp.email_1;
        var strGen = [];
        for (var i = 0; i < $scope.arr_generate.length; i++) {
            if ($scope.arr_generate[i].chk == true)
                strGen.push($scope.arr_generate[i].id);
        }
        rec.generate = strGen.toString();


        if (rec.type == 0 || rec.type == -1) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Warehouse Storage Type']));
            return false;
        }

        $scope.showLoader = true;

        if ($scope.rec_loc) {

            if ($scope.rec_loc.parent_bin_location !== undefined)
                rec.parent_id = $scope.rec_loc.parent_bin_location.id;

            if ($scope.rec_loc.status_ids !== undefined)
                rec.status = $scope.rec_loc.status_ids.id;

            if ($scope.rec_loc.currency !== undefined)
                rec.currency_id = $scope.rec_loc.currency.id;

            if ($scope.rec_loc.dimension !== undefined)
                rec.dimensions_id = $scope.rec_loc.dimension.id;

            if ($scope.rec_loc.cost_type !== undefined)
                rec.cost_type_id = $scope.rec_loc.cost_type.id;

            if ($scope.rec_loc.bin_cost && $scope.rec_loc.bin_cost != 0 && !$scope.rec_loc.cost_type) {
                toaster.pop('error', 'Edit', 'Cost Frequency is mandatory');
                return false;
            }

        }

        rec.rec_loc = $scope.rec_loc;


        var addcrmUrl = $scope.$root.setup + "warehouse/add-warehouse";
        if (rec.id != undefined)
            addcrmUrl = $scope.$root.setup + "warehouse/update-warehouse";
        //console.log(rec);return;
        $http
            .post(addcrmUrl, rec)
            .then(function(res) {

                $scope.showLoader = false;

                if (res.data.ack == 1) {
                    if (rec.id > 0) {
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                        $scope.check_wh_readonly = true;
                    } else
                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));

                    $scope.$root.rec_id = res.data.id;
                    //toaster.pop('success', res.data.info,res.data.msg);
                    if (res.data.info == 'insert') {
                        $timeout(function() {
                            $state.go("app.view-warehouse", { id: res.data.id });
                        }, 1000);

                    }

                } else {
                    if (rec.id > 0)
                        toaster.pop('error', 'Edit', res.data.error);
                    //toaster.pop('error', 'Edit', 'Record can\'t be  Saved!');
                    else
                        toaster.pop('error', 'Error', res.data.error);
                }
            });

    }


    //--------------------   Warehouse Storage Type --------------------


    $scope.storage_type_Data = {};
    // $scope.storage_type_list = [];

    $scope.onChange_storage_warehouse_type = function() {
        // angular.element('#model_storage_type').modal({show: true});

        if ($scope.rec.types != undefined) {

            var id = $scope.rec.types.id;

            if (id == -1)
                angular.element('#model_storage_type').modal({ show: true });

            $("#storage_type").val('');
            $scope.storage_type_Data.title = '';
        }
    }


    $scope.add_storage_type = function(storage_type_Data) {

        var add_storage_type_list_Url = $scope.$root.setup + "warehouse/add-warehouse-storage-type";
        var storage_type_list_Url = $scope.$root.setup + "warehouse/get-warehouse-storage-type";

        $scope.storage_type_Data.token = $scope.$root.token;

        if ($scope.storage_type_Data.title == undefined || $scope.storage_type_Data.title == "" || $scope.storage_type_Data.title == null) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Storage Type']));
            return false;
        }

        $http
            .post(add_storage_type_list_Url, storage_type_Data)
            .then(function(res) {
                if (res.data.ack == true) {

                    toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));

                    $('#model_storage_type').modal('hide');

                    $http
                        .post(storage_type_list_Url, { 'token': $scope.$root.token })
                        .then(function(res) {
                            if (res.data.ack == true) {
                                $scope.storage_type_list = [];

                                $scope.storage_type_list.push({ 'id': '', 'title': '' });
                                $scope.storage_type_list = res.data.response;

                                $.each($scope.storage_type_list, function(index, elem) {
                                    if (elem.title == storage_type_Data.title)
                                        $scope.rec.types = elem;
                                });

                                $scope.storage_type_list.push({ 'id': '-1', 'title': '++ Add New ++' });
                            }
                        });

                } else
                    toaster.pop('error', 'Add', res.data.error);
            });
    }

    //--------------------- end General   ------------------------------------------
    $scope.gotoedit = function() {
        $scope.check_readonly = false;
    }

    // ---------------- Contact   	 -----------------------------------------
    // default values false
    $scope.general_contact = function() {

        $scope.altContacListingShow = false;
        $scope.altContacFormShow = false;
        $scope.bin_loc_ListingShow = false;
        $scope.altbin_loc_FormShow = false;

        $scope.$root.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Warehouse', 'url': 'app.warehouse', 'style': '' },
            { 'name': $scope.$root.model_code, 'url': '#', 'style': 'color:#515253;' }
        ];

        /* ,{ 'name': 'Contact', 'url': '#', 'style': '' } */



        //$scope.check_readonly = true;

        $scope.showLoader = true;
        $scope.SearchKeyword = {};

        var postData = {};
        var vm = this;
        var postUrl = $scope.$root.setup + "warehouse/alt-contacts";

        //$scope.postData = {'column':'crm_id','value':$scope.$root.wrhID,token:$scope.$root.token}
        $http
            .post(postUrl, { 'token': $scope.$root.token, 'id': $scope.$root.wrhID })
            .then(function(res) {
                $scope.showLoader = false;
                $scope.altContacListingShow = true;
                if (res.data.response != null) {
                    $scope.columns = [];
                    $scope.contact_data = [];
                    $scope.contact_data = res.data.response;
                    angular.forEach(res.data.response[0], function(val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
            });
    }


    $scope.contact_add_Form = function() {
        $scope.rec2 = {};
        $scope.altContacFormShow = true;
        $scope.altContacListingShow = false;


        $scope.rec2.country = $scope.$root.get_obj_frm_arry($scope.$root.country_type_arr, $scope.$root.defaultCountry);

    }

    $scope.rec2 = {};

    $scope.add_srm_contact = function(rec2) {
        rec2.countrys = $scope.rec2.country != undefined ? $scope.rec2.country.id : 0;
        rec2.wrh_id = $scope.$root.wrhID;
        rec2.token = $scope.$root.token;

        var altAddUrl = $scope.$root.setup + "warehouse/add-alt-contact";
        if (rec2.id != undefined)
            var altAddUrl = $scope.$root.setup + "warehouse/update-alt-contact";

        //console.log(rec2); return;
        $http
            .post(altAddUrl, rec2)
            .then(function(res) {

                if (res.data.ack == true) {

                    if (rec2.id > 0)
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    else
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

                    $timeout(function() {
                        $scope.general_contact();
                    }, 3000);
                } else {
                    if (rec2.id > 0)
                        toaster.pop('error', 'Edit', res.data.error);
                    else
                        toaster.pop('error', 'Info', res.data.error);
                }
            });
    }

    $scope.editcontactForm = function(id, mode) {

        if (mode == 1)
            $scope.check_readonly = false;
        else
            $scope.check_readonly = true;

        $scope.showLoader = true;

        $scope.altContacFormShow = true;
        $scope.altContacListingShow = false;
        //$scope.rec = {};

        var altcontUrl = $scope.$root.setup + "warehouse/get-alt-contact-by-id";
        var postViewData = {
            'token': $scope.$root.token,
            'id': id
        };

        $http
            .post(altcontUrl, postViewData)
            .then(function(res) {
                $scope.rec2 = res.data.response;
                $scope.rec2.id = res.data.response.id;
                $scope.showLoader = false;

                angular.forEach($scope.countries, function(obj) {
                    if (obj.id == res.data.response.country)
                        $scope.rec2.country = obj;
                });
            });
    }

    $scope.deletecontact = function(id, index, arr_data) {
        var delUrl = $scope.$root.setup + "warehouse/delete-alt-contact";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function(value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function(res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function(reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    //---------------- Contact    ------------------------

    // ---------------- BIN location start   	 -----------------------------------------

    //select_additional_cost

    $scope.bin_loc_add_cost_buttons_Show = false;


    $scope.openStorageLocAddCostForm = function(bin_loc_id) {
        // console.log(bin_loc_id);

        if (bin_loc_id > 0) {

            // $scope.bin_loc_add_cost_FormShow = true;
            // $scope.bin_loc_add_cost_List_Show = false;

            // $scope.bin_loc_add_cost_buttons_Show = true;

            // $scope.check_readonly = false;
            $scope.rec3 = {};
            $scope.rec3.status_ids = $scope.status_list[0];

            angular.element('#storageLocAddCostModal').modal({ show: true });
            // angular.element('#bin_loc_add_cost_modal').modal({ show: true });

        } else {
            toaster.pop('error', 'Info', "Please add location data first!");
        }
    }

    /* $scope.bin_loc_add_cost_popup = function (loc_id) {
        $scope.rec3 = {};
        //console.log(loc_id);

        $scope.popup_title = $scope.rec.name + " : " + $scope.rec2.title + "  ";

        $scope.bin_loc_add_cost_FormShow = false;
        $scope.bin_loc_add_cost_List_Show = true;

        $scope.bin_loc_id = loc_id;

        $scope.showLoader = true;

        var bin_loc_add_cost_Url = $scope.$root.setup + "warehouse/alt-bin-loc-add-cost";

        $http
            .post(bin_loc_add_cost_Url, {
                'token': $scope.$root.token,
                'wrh_id': $scope.$root.wrhID,
                'bin_loc_wrh_id': loc_id
            })
            .then(function (res) {
                if (res.data.response != null) {
                    $scope.columns2 = [];
                    $scope.bin_loc_add_cost_data = [];
                    $scope.bin_loc_add_cost_data = res.data.response;

                    //console.log(res.data.response);

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns2.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }


                //  $('#bin_loc_add_cost_modal').modal({show: true});
            });
        $scope.showLoader = false;

    } */

    $scope.general_bin_loc_cost = function(bin_loc_id) {

        //console.log(bin_loc_id);
        var bin_loc_add_cost_Url = $scope.$root.setup + "warehouse/alt-bin-loc-add-cost";
        //$scope.rec3 = {};

        $http
            .post(bin_loc_add_cost_Url, {
                'token': $scope.$root.token,
                'wrh_id': $scope.$root.wrhID,
                'bin_loc_wrh_id': bin_loc_id
            })
            .then(function(res) {
                if (res.data.response != null) {
                    $scope.columns2 = [];
                    $scope.bin_loc_add_cost_data = [];
                    $scope.bin_loc_add_cost_data = res.data.response;

                    angular.forEach(res.data.response[0], function(val, index) {
                        $scope.columns2.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
            });
        // $scope.bin_loc_add_cost_FormShow = false;
        $scope.bin_loc_add_cost_List_Show = true;
    }


    // $scope.add_bin_loc_add_cost = function (rec3) {
    $scope.addStorageLocAddCost = function(rec3) {

        rec3.wrh_id = $scope.$root.wrhID;
        rec3.token = $scope.$root.token;
        rec3.bin_loc_id = $scope.bin_loc_id;
        //rec3.bin_loc_id = $stateParams.id;
        //rec3.bin_loc_id = rec3.warehouse_bin_loc_id;

        // console.log($scope.bin_loc_id);
        // console.log(rec3.additional_cost_sdate);

        if ($scope.bin_loc_id == "") {
            toaster.pop('error', 'Info', "Please Add Warehouse Location First");
            return false;
        }

        // $scope.showLoader = true;

        rec3.title_id = (rec3.title != undefined && rec3.title != '') ? rec3.title.id : 0;
        rec3.status = (rec3.status_ids != undefined && rec3.status_ids != '') ? rec3.status_ids.id : 0;
        rec3.dimensions_id = (rec3.dimension != undefined && rec3.dimension != '') ? rec3.dimension.id : 0;
        rec3.cost_type_id = (rec3.cost_type != undefined && rec3.cost_type != '') ? rec3.cost_type.id : 0;

        if (!(rec3.title_id > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Title']));
            return false;
        }




        var add_bin_loc_add_cost_Url = $scope.$root.setup + "warehouse/add-bin-loc-add-cost";

        if (rec3.id != undefined)
            var add_bin_loc_add_cost_Url = $scope.$root.setup + "warehouse/update-bin-loc-add-cost";

        $http
            .post(add_bin_loc_add_cost_Url, rec3)
            .then(function(res) {

                if (res.data.ack == true) {

                    var storageLocID = rec3.bin_loc_id;

                    $timeout(function() {
                        $scope.general_bin_loc_cost(storageLocID);
                    }, 1000);
                    // $scope.bin_loc_add_cost_buttons_Show = false;

                    if (rec3.id > 0)
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    else {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    }


                    $scope.rec3 = {};
                    // angular.element('#bin_loc_add_cost_modal').modal('hide');
                    $scope.showdatac = true;
                } else {
                    if (rec3.id > 0)
                        toaster.pop('error', 'Edit', res.data.error);
                    else
                        toaster.pop('error', 'Info', res.data.error);
                }
                // $scope.showLoader = false;
            });

    }

    var additional_cost_title_Url = $scope.$root.setup + "warehouse/get-warehouse-loc-additional-cost-title";
    $http
        .post(additional_cost_title_Url, { 'token': $scope.$root.token })
        .then(function(res) {
            $scope.additional_cost_title = [];
            $scope.additional_cost_title.push({ 'id': '', 'title': '' });

            if (res.data.ack == true)
                $scope.additional_cost_title = res.data.response;

            $scope.additional_cost_title.push({ 'id': '-1', 'title': '++ Add New ++' });

        });

    $scope.editStorageLocAddCost = function(id) {
        /*console.log(rec3);
         console.log(rec3.id);
         return false;*/
        // $scope.check_readonly = true;
        // $scope.showLoader = true;

        var bin_loc_Url = $scope.$root.setup + "warehouse/get-alt-bin-loc-add-cost-by-id";
        var postViewData = {
            'token': $scope.$root.token,
            'id': id,
            'wrh_id': $scope.$root.wrhID
        };

        $http
            .post(bin_loc_Url, postViewData)
            .then(function(res3) {

                if (res3.data.ack == true) {
                    $scope.rec3 = res3.data.response;
                    $scope.rec3.id = res3.data.response.id;

                    $scope.rec3.cost = parseFloat(res3.data.response.cost);

                    angular.forEach($scope.status_list, function(obj) {
                        if (obj.id == res3.data.response.status)
                            $scope.rec3.status_ids = obj;
                    });

                    angular.forEach($scope.arr_dimension, function(elem) {
                        if (elem.id == res3.data.response.dimensions_id)
                            $scope.rec3.dimension = elem;
                    });

                    angular.forEach($scope.cost_types, function(elem) {
                        if (elem.id == res3.data.response.cost_type_id)
                            $scope.rec3.cost_type = elem;
                    });

                    angular.forEach($scope.additional_cost_title, function(elem) {
                        if (elem.id == res3.data.response.add_cost_title_id)
                            $scope.rec3.title = elem;
                    });

                    // $scope.bin_loc_add_cost_FormShow = true;
                    // $scope.bin_loc_add_cost_List_Show = false;
                    // $scope.bin_loc_add_cost_buttons_Show = true;

                    // angular.element('#bin_loc_add_cost_modal').modal({ show: true });
                }
                $scope.showLoader = false;
            });
    }

    $scope.delete_bin_loc_add_cost = function(id, index, arr_data) {
        var delUrl = $scope.$root.setup + "warehouse/delete-bin-loc-add-cost";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function(value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token, 'wrh_id': $scope.$root.wrhID })
                .then(function(res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function(reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };


    $scope.bin_loc_add_Form = function() {
        $scope.rec2 = {};
        $scope.altbin_loc_FormShow = true;
        $scope.bin_loc_ListingShow = false;
        $scope.check_readonly = false;

        // $scope.bin_loc_add_cost_setup_Show = false;
        $scope.bin_loc_add_cost_setup_Show = true;
        $scope.bin_loc_add_cost_List_Show = true;
        $scope.bin_loc_add_cost_FormShow = false;
        $scope.bin_loc_add_cost_buttons_Show = false;

        $scope.columns2 = [];
        $scope.bin_loc_id = "";
        $scope.bin_loc_add_cost_data = [];

        $scope.rec2.status_ids = $scope.status_list[0];
        $scope.showdatac = false;

        $scope.showLoader = true;

        $.each($scope.arr_currency, function(index, elem) {
            if (elem.id == $scope.$root.defaultCurrency)
                $scope.rec2.currency = elem;
        });

        var postUrl = $scope.$root.setup + "warehouse/alt-parent-bin-location";

        $http
            .post(postUrl, { 'token': $scope.$root.token, 'wrh_id': $scope.$root.wrhID })
            .then(function(res) {
                $scope.parent_bin = [];
                if (res.data.ack == true) {
                    $scope.parent_bin = res.data.response;
                }

                $scope.showLoader = false;
            });
    }

    if ($stateParams.id > 0) {
        $scope.bin_loc_add_Form();
    }

    $timeout(function() {
        $scope.searchKeyword = {};
        $scope.searchKeyword.status_ids = $scope.status_list[0];
    }, 1000);

    // default values false
    $scope.general_bin_location = function(search) {

        $scope.showLoader = true;
        $scope.altContacListingShow = false;
        $scope.altContacFormShow = false;
        $scope.bin_loc_ListingShow = false;
        $scope.altbin_loc_FormShow = false;

        $scope.$root.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
            { 'name': 'Warehouse', 'url': 'app.warehouse', 'style': '' },
            { 'name': $scope.$root.model_code, 'url': '#', 'style': 'color:#515253;' }
        ];

        /* , { 'name': 'location', 'url': '#', 'style': '' } */


        if (search == undefined)
            search = 1;
        //$scope.check_readonly = true;
        var postData = {};
        var vm = this;
        var postUrl = $scope.$root.setup + "warehouse/alt-bin-location";

        $http
            .post(postUrl, { 'token': $scope.$root.token, 'wrh_id': $scope.$root.wrhID, 'status_id': search })
            .then(function(res) {
                $scope.showLoader = false;
                $scope.bin_loc_ListingShow = true;
                if (res.data.response != null) {
                    $scope.columns = [];
                    $scope.bin_loc_data = [];
                    $scope.bin_loc_data = res.data.response;
                    //console.log($scope.bin_loc_data);
                    angular.forEach(res.data.response[0], function(val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }

            });

    }

    $scope.add_bin_location = function(rec2) {


        rec2.wrh_id = $scope.$root.wrhID;
        rec2.token = $scope.$root.token;

        if (rec2.parent_bin_location !== undefined)
            rec2.parent_id = rec2.parent_bin_location.id;

        if (rec2.status_ids !== undefined)
            rec2.status = rec2.status_ids.id;

        if (rec2.currency !== undefined)
            rec2.currency_id = rec2.currency.id;

        if (rec2.dimension !== undefined)
            rec2.dimensions_id = rec2.dimension.id;

        if (rec2.cost_type !== undefined)
            rec2.cost_type_id = rec2.cost_type.id;

        if (rec2.bin_cost && rec2.bin_cost != 0 && !rec2.cost_type) {
            toaster.pop('error', 'Edit', 'Cost Frequency is mandatory');
            return false;
        }

        var altAddUrl = $scope.$root.setup + "warehouse/add-bin-location";

        if (rec2.id != undefined)
            var altAddUrl = $scope.$root.setup + "warehouse/update-bin-location";

        //console.log(rec2); return;
        $scope.showLoader = true;

        $http
            .post(altAddUrl, rec2)
            .then(function(res) {

                $scope.showLoader = false;

                if (res.data.ack == true) {
                    /*$timeout(function () {
                     $scope.general_bin_location();
                     }, 3000);*/

                    $scope.columns2 = [];
                    $scope.bin_loc_add_cost_data = [];

                    //if (rec2.cost > 0) {

                    // if (rec2.id > 0)
                    //     $scope.edit_bin_location_Form(rec2.id);
                    // }

                    //$scope.rec3.id = res.data.id;
                    $scope.bin_loc_id = res.data.id;

                    if (rec2.id > 0) {
                        //$scope.edit_bin_location_Form(rec2.id);
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    } else {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    }

                    $timeout(function() {
                        $scope.general_bin_location();
                    }, 1500);

                    // $scope.check_readonly = true;
                } else {
                    if (rec2.id > 0)
                        toaster.pop('error', 'Edit', res.data.error);
                    else
                        toaster.pop('error', 'Info', res.data.error);
                }

                $scope.bin_loc_add_cost_List_Show = true;
                $scope.bin_loc_add_cost_FormShow = false;
                $scope.bin_loc_add_cost_setup_Show = true;
            });

    }

    $scope.check_conversion_rate = function(currency) {
        // console.log(currency);
        if (currency != $scope.$root.defaultCurrency) {
            var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
            // var currencyURL = $scope.$root.setup + "general/get-currency";
            $http
                .post(currencyURL, { 'id': currency, token: $scope.$root.token })
                .then(function(res) {
                    // console.log(res);
                    if (res.data.ack == true) {

                        if (res.data.response.conversion_rate == null) {
                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Currency Conversion Rate']));
                            $scope.rec2.currency = "";
                            return;
                        }
                    } else {
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Currency Conversion Rate']));
                        $scope.rec2.currency = "";
                        return;
                    }
                });
        } else return true;
    }

    $scope.edit_bin_location_Form = function(id, mode) {
        $scope.check_readonly = true;
        $scope.showLoader = true;
        if (mode > 0)
            $scope.check_readonly = false;

        $scope.altbin_loc_FormShow = true;
        $scope.bin_loc_ListingShow = false;


        var additional_cost_title_Url = $scope.$root.setup + "warehouse/get-warehouse-loc-additional-cost-title";
        $http
            .post(additional_cost_title_Url, { 'token': $scope.$root.token })
            .then(function(res) {
                $scope.additional_cost_title = [];
                $scope.additional_cost_title.push({ 'id': '', 'title': '' });

                if (res.data.ack == true) $scope.additional_cost_title = res.data.response;
                //else    toaster.pop('error', 'Error', "No Category found!");

                $scope.additional_cost_title.push({ 'id': '-1', 'title': '++ Add New ++' });

            });


        /*$scope.showdatac = false;

         var bin_loc_add_cost_total_Url = $scope.$root.setup + "warehouse/alt-bin-loc-add-cost";

         $http
         .post(bin_loc_add_cost_total_Url, postViewData)
         .then(function (res) {
         if (res.data.total > 0)
         $scope.showdatac = true;
         });*/


        var bin_loc_Url = $scope.$root.setup + "warehouse/get-alt-bin-loc-by-id";
        var postViewData = {
            'token': $scope.$root.token,
            'id': id,
            'wrh_id': $scope.$root.wrhID,
            'bin_loc_wrh_id': id
        };

        $http
            .post(bin_loc_Url, postViewData)
            .then(function(res) {

                if (res.data.ack == true) {

                    $scope.rec2 = res.data.response;
                    $scope.rec2.id = res.data.response.id;
                    $scope.rec2.parent_id = res.data.response.parent_id;

                    var postUrl = $scope.$root.setup + "warehouse/alt-parent-bin-location";

                    $http
                        .post(postUrl, { 'token': $scope.$root.token, 'wrh_id': $scope.$root.wrhID, 'bin_loc_wrh_id': id })
                        .then(function(res2) {

                            $scope.parent_bin = [];
                            if (res2.data.ack == true) {

                                $scope.parent_bin = res2.data.response;

                                $.each($scope.parent_bin, function(index, obj) {
                                    if (obj.id == $scope.rec2.parent_id)
                                        $scope.rec2.parent_bin_location = $scope.parent_bin[index];
                                });
                            }
                        });

                    $.each($scope.status_list, function(index, obj) {
                        if (obj.id == res.data.response.status)
                            $scope.rec2.status_ids = $scope.status_list[index];
                    });

                    if (res.data.response.currency_id > 0) {
                        $.each($scope.arr_currency, function(index, elem) {
                            if (elem.id == res.data.response.currency_id)
                                $scope.rec2.currency = elem;
                        });

                    } else {
                        $.each($scope.arr_currency, function(index, elem) {
                            if (elem.id == $scope.$root.defaultCurrency)
                                $scope.rec2.currency = elem;
                        });
                    }

                    $.each($scope.arr_dimension, function(index, elem) {
                        if (elem.id == res.data.response.dimensions_id)
                            $scope.rec2.dimension = elem;
                    });

                    $.each($scope.cost_types, function(index, elem) {
                        if (elem.id == res.data.response.cost_type_id)
                            $scope.rec2.cost_type = elem;
                    });
                }


                // $scope.bin_loc_id = $stateParams.id;
                $scope.bin_loc_id = id;

                //if (res.data.response.cost > 0) {
                $scope.bin_loc_add_cost_List_Show = true;
                $scope.bin_loc_add_cost_FormShow = false;
                $scope.bin_loc_add_cost_buttons_Show = false;

                $scope.bin_loc_add_cost_setup_Show = true;


                var bin_loc_add_cost_Url = $scope.$root.setup + "warehouse/alt-bin-loc-add-cost";

                $http
                    .post(bin_loc_add_cost_Url, {
                        'token': $scope.$root.token,
                        'wrh_id': $scope.$root.wrhID,
                        'bin_loc_wrh_id': id
                    })
                    .then(function(res) {
                        if (res.data.response != null) {
                            $scope.columns2 = [];
                            $scope.bin_loc_add_cost_data = [];
                            $scope.bin_loc_add_cost_data = res.data.response;

                            //console.log(res.data.response);

                            angular.forEach(res.data.response[0], function(val, index) {
                                $scope.columns2.push({
                                    'title': toTitleCase(index),
                                    'field': index,
                                    'visible': true
                                });
                            });
                        }

                        $scope.showLoader = false;
                    });

                /* } else {
                 $scope.showLoader = false;
                 }*/
                // $scope.showLoader = false;
            });
    }

    $scope.delete_bin_location = function(id, index, arr_data) {
        var delUrl = $scope.$root.setup + "warehouse/delete-bin-location";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function(value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token, 'wrh_id': $scope.$root.wrhID })
                .then(function(res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data.splice(index, 1);
                        $scope.general_bin_location();
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function(reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };


    //--------------------   Warehouse Additional Cost Title --------------------
    $scope.additional_cost_Data = {};

    $scope.onChange_additional_cost_title = function() {

        var id = this.rec3.title.id;
        //console.log(id );

        if (id == -1)
            $('#model_additional_cost_title').modal({ show: true });

        $("#title").val('');
        $scope.additional_cost_Data.title = '';
    }

    $scope.closeAdditionalCostTitle = function() {
        $scope.rec3.title = '';
        $('#model_additional_cost_title').modal('hide');
    }

    $scope.add_additional_cost_title = function(additional_cost_Data) {

        var add_additional_cost_title_Url = $scope.$root.setup + "warehouse/add-warehouse-loc-additional-cost-title";
        var additional_cost_title_Url = $scope.$root.setup + "warehouse/get-warehouse-loc-additional-cost-title";

        $scope.additional_cost_Data.token = $scope.$root.token;
        //$scope.additional_cost_Data.title = $scope.additional_cost_Data.title;

        if ($scope.additional_cost_Data.title == "" || $scope.additional_cost_Data.title == null) {
            return false;
        }

        $http
            .post(add_additional_cost_title_Url, additional_cost_Data)
            .then(function(res) {
                if (res.data.ack == true) {

                    toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));

                    $('#model_additional_cost_title').modal('hide');

                    $http
                        .post(additional_cost_title_Url, { 'token': $scope.$root.token })
                        .then(function(res) {
                            if (res.data.ack == true) {
                                $scope.additional_cost_title.push({ 'id': '', 'title': '' });
                                $scope.additional_cost_title = res.data.response;

                                $.each($scope.additional_cost_title, function(index, elem) {
                                    if (elem.title == additional_cost_Data.title)
                                        $scope.rec3.title = elem;
                                });

                                $scope.additional_cost_title.push({ 'id': '-1', 'title': '++ Add New ++' });
                            }
                        });

                } else
                    toaster.pop('error', 'Add', res.data.error);
            });
    }

    $scope.warehouse_loc_History_modal = function(id, title) {

        // console.log(title);

        var postUrl = $scope.$root.setup + "warehouse/alt-warehouse-loc-History";

        $scope.cost_modal_title = "";
        $scope.add_cost_del_chk = 0;

        $http
            .post(postUrl, { 'token': $scope.$root.token, 'wrh_loc_id': id })
            .then(function(res2) {

                $scope.columns2 = [];
                $scope.warehouse_loc_History = [];

                if (res2.data.ack == true) {
                    $scope.warehouse_loc_History = res2.data.response;
                    $scope.add_cost_del_chk = 1;

                    $scope.cost_modal_title = title + " - Warehouse Storage Location & Cost History ";

                    angular.forEach(res2.data.response[0], function(val, index) {
                        $scope.columns2.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    angular.element('#cost_modal').modal({ show: true });
                } else {
                    toaster.pop('error', 'Info', 'No History Exists. ');
                    angular.element('#cost_modal').modal('hide');
                }
            });
    }

    $scope.delete_warehouse_loc_History = function(id, index, arr_data) {

        var delUrl = $scope.$root.setup + "warehouse/delete-warehouse-loc-History";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function(value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function(res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data.splice(index, 1);
                        $scope.general_bin_location();
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function(reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };

    $scope.chk_item_assigned_modal = function(id, title) {

        // console.log(title);

        // var postUrl = $scope.$root.setup + "warehouse/alt-warehouse-loc-History";
        var postUrl = $scope.$root.setup + "warehouse/get-prod-by-warehouse-loc-id";

        $scope.cost_modal_title = "";

        $http
            .post(postUrl, { 'token': $scope.$root.token, 'wrh_loc_id': id })
            .then(function(res2) {

                $scope.columns2 = [];
                $scope.warehouse_loc_History = [];

                if (res2.data.ack == true) {
                    $scope.warehouse_loc_History = res2.data.response;

                    $scope.cost_modal_title = title + " - Warehouse Storage Location Assigned by Items";

                    angular.forEach(res2.data.response[0], function(val, index) {
                        $scope.columns2.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    angular.element('#cost_modal').modal({ show: true });
                } else {
                    toaster.pop('error', 'Info', 'No History Exists. ');
                    angular.element('#cost_modal').modal('hide');
                }
            });
    }

    $scope.show_add_cost_pop = function(id, title) {

        /*var postUrl = $scope.$root.setup + "warehouse/alt-warehouse-loc-History";

         $scope.cost_modal_title = "";

         $http
         .post(postUrl, {'token': $scope.$root.token, 'wrh_loc_id': id})
         .then(function (res2) {

         $scope.columns2 = [];
         $scope.warehouse_loc_History = [];

         if (res2.data.ack == true) {
         $scope.warehouse_loc_History = res2.data.response;

         $scope.cost_modal_title = "Warehouse Location & Cost History ";

         angular.forEach(res2.data.response[0], function (val, index) {
         $scope.columns2.push({
         'title': toTitleCase(index),
         'field': index,
         'visible': true
         });
         });
         angular.element('#cost_modal').modal({show: true});
         }
         else {
         toaster.pop('error', 'Info', 'No History Exists. ');
         angular.element('#cost_modal').modal('hide');
         }
         });*/


        var bin_loc_add_cost_Url = $scope.$root.setup + "warehouse/alt-bin-loc-add-cost";

        $scope.cost_modal_title = "";

        $http
            .post(bin_loc_add_cost_Url, {
                'token': $scope.$root.token,
                'wrh_id': $scope.$root.wrhID,
                'bin_loc_wrh_id': id
            })
            .then(function(res2) {
                $scope.columns2 = [];
                $scope.warehouse_loc_History = [];

                if (res2.data.ack == true) {

                    //console.log(res.data.response);

                    $scope.warehouse_loc_History = res2.data.response;

                    $scope.cost_modal_title = title + " - Additional Cost ";

                    angular.forEach(res2.data.response[0], function(val, index) {
                        $scope.columns2.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    angular.element('#cost_modal').modal({ show: true });

                } else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(525));
                    angular.element('#cost_modal').modal('hide');
                }
            });
    }

    /*$scope.getTotal_additional_cost = function (int) {

     var Total_additional_cost = 0;

     angular.forEach($scope.bin_loc_add_cost_data, function (el) {
     Total_additional_cost = Number(Total_additional_cost) + Number(el.Cost);
     });

     return Total_additional_cost;
     };*/

    $scope.additional_cost_History_modal = function(id, title) {

        // console.log(title);

        var postUrl = $scope.$root.setup + "warehouse/alt-warehouse-loc-add-cost-History";

        $scope.cost_modal_title = "";
        $scope.add_cost_del_chk = 0;

        $http
            .post(postUrl, { 'token': $scope.$root.token, 'wrh_loc_id': id })
            .then(function(res4) {

                $scope.columns4 = [];
                $scope.warehouse_loc_History = [];

                if (res4.data.ack == true) {
                    $scope.warehouse_loc_History = res4.data.response;

                    $scope.cost_modal_title = "Additional Cost History ";
                    $scope.add_cost_del_chk = 1;

                    angular.forEach(res4.data.response[0], function(val, index) {
                        $scope.columns4.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    angular.element('#additional_cost_history_modal').modal({ show: true });
                } else {
                    toaster.pop('error', 'Info', 'No History Exists. ');
                    angular.element('#additional_cost_history_modal').modal('hide');
                }
            });
    }

    $scope.delete_additional_cost_History = function(id, index, arr_data) {

        var delUrl = $scope.$root.setup + "warehouse/delete-warehouse-loc-add-cost-History";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function(value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function(res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data.splice(index, 1);
                        $scope.general_bin_loc_cost($scope.bin_loc_id);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function(reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };


    // ---------------- BIN location End     	 -----------------------------------------


    // $timeout(function () {
    //     angular.element(document).ready(function () {
    //         angular.element('.date-picker').datepicker({ dateFormat: $("#date_format").val() });
    //     });
    //     console.log('date picker active');
    // }, 1000);

    $scope.item_paging = {};
    $scope.itemselectPage = function(pageno) {
        $scope.item_paging.spage = pageno;
    };
    //$timeout(function () {

    $scope.row_id = $stateParams.id;
    $scope.module_id = 113;
    $scope.subtype = 4;
    $scope.module = "Setup";
    $scope.module_name = "Warehouse";
    //$scope.module_code= $scope.$root.model_code ;
    //console.log( $scope.module_id+'call'+$scope.module+'call'+$scope.module_name+'call'+$scope.module_code);
    $scope.$root.$broadcast("image_module", $scope.row_id, $scope.module, $scope.module_id, $scope.module_name, $scope.module_code, $scope.subtype);

    //  }, 1000);


}