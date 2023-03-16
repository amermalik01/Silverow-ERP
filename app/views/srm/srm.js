myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

        $stateProvider
            .state('app.srm', {
                url: '/srm/:filter_id',
                title: 'Purchases',
                templateUrl: helper.basepath('srm/srm.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.add-srm', {
                url: '/srm/add',
                title: 'Purchases',
                templateUrl: helper.basepath('addTabs.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'SrmEditController'
            })
            .state('app.view-srm', {
                url: '/srm/:id/view',
                title: 'Purchases',
                templateUrl: helper.basepath('addTabs.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'SrmEditController'
            })
            .state('app.edit-srm', {
                url: '/srm/:id/edit',
                title: 'Purchases',
                templateUrl: helper.basepath('addTabs.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'SrmEditController'
            })            
            .state('app.searchHaulierDatabase', {
                url: '/haulier-database/:module',
                title: 'Purchases',
                templateUrl: helper.basepath('srm/searchHaulierDatabaseListing.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'CommonSrmSupplierController'
            })
    }
]);

/* templateUrl: helper.basepath('srm/_form.html'), //addTabs */


SrmController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http",
    "ngDialog", "toaster", "$rootScope", "$state", "moduleTracker","jsreportService",
];
myApp.controller('SrmController', SrmController);

function SrmController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $rootScope, $state, moduleTracker) {
    'use strict';

    moduleTracker.updateName("srm");
    moduleTracker.updateRecord("");

    $scope.searchAreas = {};

    $scope.$root.breadcrumbs = [ //{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
        {
            'name': 'Purchases',
            'url': '#',
            'isActive': false
        },
        {
            'name': 'SRM',
            'url': '#',
            'isActive': false
        }
    ];

    var vm = this;
    var Api = $scope.$root.pr + "srm/srm/listings";
    $scope.postData = {};

    $scope.postData = {
        'token': $scope.$root.token,
        'all': "1"
    };


    $scope.searchKeyword = {};
    $scope.getsrm_list = function (item_paging, sort_column, sortform) {

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;

        if (item_paging == 1) $scope.item_paging.spage = 1;

        $scope.postData.page = $scope.item_paging.spage;

        // $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        $scope.postData.searchKeyword = $scope.searchKeyword;
        // $scope.postData.segments = $scope.searchKeyword.segment !== undefined ? $scope.searchKeyword.segment.id : 0;
        // $scope.postData.regions = $scope.searchKeyword.region !== undefined ? $scope.searchKeyword.region.id : 0;
        // $scope.postData.selling_groups = $scope.searchKeyword.selling_group !== undefined ? $scope.searchKeyword.selling_group.id : 0;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }


        if ((sort_column != undefined) && (sort_column != null)) {
            //sort by column
            $scope.postData.sort_column = sort_column;
            $scope.postData.sortform = sortform;

            $rootScope.sortform = sortform;
            $rootScope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;
            $rootScope.sort_column = sort_column;

            $rootScope.save_single_value($rootScope.sort_column, 'srmsort_name')

            /*$scope.sortform=sortform;
             $scope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;
             $scope.sort_column=sort_column;
             */
        }


        $scope.showLoader = true;

        $http
            .post(Api, $scope.postData)
            .then(function (res) {
                $scope.tableData = res;
                $scope.columns = [];
                $scope.record_data = {};
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;


                    $scope.record_data = res.data.response;
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
                $scope.showLoader = false;
            });
    }

    var col = '';
    col = $rootScope.get_single_value('srmsort_name');
    // $scope.getsrm_list(1, col, 'Desc');
    $scope.$root.itemselectPage(1);
}


myApp.controller('SrmEditController', SrmEditController);

function SrmEditController($scope, $filter, $resource, $timeout, $http, ngDialog, toaster, $stateParams, $state, $rootScope, SubmitContactLoc, moduleTracker) {
    // 'use strict';

    moduleTracker.updateName("srm");
    moduleTracker.updateRecord($stateParams.id);

    // reload Setup global data
    $rootScope.get_global_data(1);

    $scope.addPriceTabPermission = $rootScope.allowadd_srm_price_tab;
    $scope.editPriceTabPermission = $rootScope.allowedit_srm_price_tab;
    $scope.viewPriceTabPermission = $rootScope.allowview_srm_price_tab;
    $scope.deletePriceTabPermission = $rootScope.allowdelete_srm_price_tab;
    $scope.convertPriceTabPermission = $rootScope.allowconvert_srm_price_tab;


    $scope.addContactPermission = $rootScope.allowadd_srm_contact_tab;
    $scope.editContactPermission = $rootScope.allowedit_srm_contact_tab;
    $scope.viewContactPermission = $rootScope.allowview_srm_contact_tab;
    $scope.deleteContactPermission = $rootScope.allowdelete_srm_contact_tab;

    $scope.addLocationPermission = $rootScope.allowadd_srm_location_tab;
    $scope.editLocationPermission = $rootScope.allowedit_srm_location_tab;
    $scope.viewLocationPermission = $rootScope.allowview_srm_location_tab;
    $scope.deleteLocationPermission = $rootScope.allowdelete_srm_location_tab;

    $scope.addHaulierTabPermission = $rootScope.allowadd_srm_haulier_tab;
    $scope.editHaulierTabPermission = $rootScope.allowedit_srm_haulier_tab;
    $scope.viewHaulierTabPermission = $rootScope.allowview_srm_haulier_tab;
    $scope.deleteHaulierTabPermission = $rootScope.allowdelete_srm_haulier_tab;

    $scope.searchKeyword = {};
    $scope.searchAreas = {};

    if ($stateParams.id > 0)
        $scope.check_srm_readonly = true;

    $scope.showEditForm = function () {
        $scope.check_srm_readonly = false;
        //$scope.perreadonly = true;
    }

    $scope.offeredByColumnsShow = [
        "name", "job_title", "Department"
    ]

    $scope.formUrl = function () {
        return "app/views/srm/_form.html";
    }

    var vm = this;

    $scope.class = 'block';
    $scope.rec = {};
    $scope.drp = {};
    $scope.crm_no = '';
    $scope.disableClass = 1;
    var srm_name = '';
    var id = $stateParams.id;
    $scope.$root.srm_id = id;
    var table = 'srm';

    $scope.shiping_list = [];

    $scope.recnew = {};
    $scope.recnew.srmid = 0;
    if ($stateParams.id !== undefined)
        $scope.recnew.srmid = id;

    $scope.price_method_list = [];
    $scope.formData_vol_1 = {};
    $scope.formData_vol_2 = {};
    $scope.formData_vol_3 = {};
    $scope.altContacFormShow = false;
    $scope.altContacListingShow = false;
    $scope.altDepotFormShow = false;
    $scope.altDepotListingShow = true;

    $scope.socialMediasGeneral = {};
    $scope.socialMediasContactGeneral = {};
    $scope.socialMediasContactArr = {};
    $scope.tempSocialMedia = [];

    $rootScope.social_medias_general_form = [];
    $rootScope.social_medias_contact_form = [];
    angular.forEach($rootScope.social_medias, function (element) {
        if (element.value != undefined && element.value.length > 0)
            delete element.value;
    });

    var refreshId = setInterval(function () {
        if (($rootScope.social_medias != undefined && $rootScope.social_medias.length > 0)) {
            angular.copy($rootScope.social_medias, $rootScope.social_medias_general_form);
            angular.copy($rootScope.social_medias, $rootScope.social_medias_contact_form);
            clearInterval(refreshId);
        }
    }, 500);
    
    $scope.qty = 5;
    $scope.defaultOption = 2;

    $scope.formData_customer = {};
    $scope.selected = 0;
    $scope.total = 0;
    $scope.selected_count = 0;

    $scope.bill_to_customer = "";

    $scope.set_link = function () {
        if ($scope.rec.web_address != undefined && $scope.rec.web_address.length > 0)
            $scope.rec.web_address = ($scope.rec.web_address.indexOf('://') === -1) ? 'http://' + $scope.rec.web_address : $scope.rec.web_address;
    }


    $scope.delete = function () {
        var delUrl = $scope.$root.pr + "srm/srm/delete-srm";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    'id': $stateParams.id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                        $state.go('app.srm');


                    } else {
                        toaster.pop('error', 'Error', res.data.error);
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    $scope.convert = function (id, index, $data) {

        ngDialog.openConfirm({
            template: 'app/views/srm/_confirm_convert_modal.html',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {

            var supplierModuleCodeType = 1;

            var checkformodulecode = $scope.$root.pr + "supplier/supplier/check_for_module_code";
                $http
                    .post(checkformodulecode, {
                        'token': $scope.$root.token
                    })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            supplierModuleCodeType = res.data.moduleCodeType;
                            if (supplierModuleCodeType == 0) {

                            $scope.product_type = true;
                            $scope.count_result = 0;
                            //var getCodeUrl = $scope.$root.pr + "supplier/supplier/get-supplier-code";
                            var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
                            // var name = $scope.$root.base64_encode('srm');
                            var name = $scope.$root.base64_encode('supplier');
                            var no = $scope.$root.base64_encode('supplier_no');
                
                            var module_category_id = 2;
                
                            $http
                                .post(getCodeUrl, {
                                    'is_increment': 1,
                                    'token': $scope.$root.token,
                                    'tb': name,
                                    'm_id': 54,
                                    'no': no,
                                    'category': '',
                                    'brand': '',
                                    'module_category_id': module_category_id,
                                    'type': '2,3',
                                    'status': '18'
                                })
                                .then(function (res) {
                
                                    if (res.data.ack == 1) {
                                        $scope.supplier_code = res.data.code;
                                        $scope.supplier_no = res.data.nubmer;
                
                                        $scope.code_type = module_category_id; //res.data.code_type;
                                        $scope.count_result++;
                
                                        if (res.data.type == 1) $scope.product_type = false;
                                        else $scope.product_type = true;
                
                
                                        var convUrl = $scope.$root.pr + "srm/srm/convert";
                                        $http
                                            .post(convUrl, {
                                                'id': $stateParams.id,
                                                'type': 2,
                                                'module': 1,
                                                'token': $scope.$root.token,
                                                'supplier_no': $scope.supplier_no,
                                                'supplier_code': $scope.supplier_code
                                            })
                                            .then(function (res) {
                                                // $data.splice(index, 1);
                
                                                if (res.data.ack == true) {
                                                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(229, ['Supplier']));
                                                    $timeout(function () {
                                                        $state.go("app.srm");
                                                    }, 1500);
                
                                                } else
                                                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(235, ['Supplier']));
                
                                            });
                
                
                                    } else {
                                        toaster.pop('error', 'info', res.data.error);
                                        return false;
                                    }
                                });
                
                        }
                        else {
                            var convUrl = $scope.$root.pr + "srm/srm/convert";
                            $http
                                .post(convUrl, {
                                    'id': $stateParams.id,
                                    'type': 2,
                                    'module': 1,
                                    'token': $scope.$root.token
                                })
                                .then(function (res) {
                                    // $data.splice(index, 1);
    
                                    if (res.data.ack == true) {
                                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(229, ['Supplier']));
                                        $state.go("app.srm");
    
                                    } else
                                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(235, ['Supplier']));
    
                                });
                        }
                        }
                    })
       

        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };


    //--------------------- add segemtn  ------------------------------------------

    $scope.history_salespersons = {};
    $scope.columns_history = [];
    $scope.history_title = "";
    $scope.history_type = "";
    $scope.historytype = function (type) {
        $scope.history_type = type;
        var Url = $scope.$root.pr + "srm/srm/srm-history";
        if (type == "Salespersons") {
            $scope.history_title = "Salesperson History";
        } else if (type == "CreditLimit") {
            $scope.history_title = "Credit Limit History";
        } else if (type == "Status") {
            $scope.history_title = "Status History";
        }

        var postData = {
            'token': $scope.$root.token,
            'srm_id': $scope.$root.srm_id, // $stateParams.id
            'type': type
        };
        $http
            .post(Url, postData)
            .then(function (res) {

                if (res.data.ack == true) {

                    $scope.crm_history = {};
                    $scope.columns_history = [];
                    $scope.crm_history = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_history.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.element('#history_modal').modal({
                        show: true
                    });
                } else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                    $scope.crm_history = {};
                }

            });
    };

    $scope.drp = [];
    $scope.status_list = [];
    $scope.status_list = [{
        'id': '1',
        'title': 'Active'
    }, {
        'id': '0',
        'title': 'Inactive'
    }];
    $scope.drp.status_ids = $scope.status_list[0];
    // $scope.status_list = [{'name': 'Active', 'value': 1}, {'name': 'Inactive', 'value': 2}, {'name': 'Deleted', 'value': 0}, {'name': 'Deleted Temp', 'value': 4}, {'name': 'Discontinued', 'value': 3}];


    $scope.addNewPredefinedPopup = function (drpdown, type, title, drp) {

        $scope.isBtnPredefined = true;

        var sel_id = drpdown.id

        if (sel_id > 0)
            return false;

        if (drpdown.id > 0)
            return false;

        $scope.popup_title = title;
        $scope.pedefined = {};

        ngDialog.openConfirm({
            template: 'app/views/crm/add_predefined.html',
            className: 'ngdialog-theme-default-custom-large',
            scope: $scope
        }).then(function (pedefined) {

            var types = type;
            pedefined.token = $scope.$root.token;
            if (type == 'STATUS') {
                types = 2;
                pedefined.name = pedefined.title;
            }
            pedefined.type = types;
            pedefined.status = 1;

            var postUrl = $scope.$root.setup + "ledger-group/add-predefine";
            if (type == 'PREFER_METHOD')
                var postUrl = $scope.$root.pr + "srm/srm/add-pref-method-of-comm";
            if (type == 'STATUS')
                var postUrl = $scope.$root.stock + "product-status/add-status-list";

            if ((pedefined.title == undefined)) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Name']));
                return;
            }

            $http
                .post(postUrl, pedefined)
                .then(function (ress) {
                    if (ress.data.ack == true) {
                        var sid = ress.data.id;


                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        var getUrl = $scope.$root.setup + "ledger-group/get-predefine-by-type";

                        if (type == 'PREFER_METHOD')
                            var getUrl = $scope.$root.pr + "srm/srm/get-all-pref-method-of-comm";
                        if (type == 'STATUS')
                            var getUrl = $scope.$root.stock + "product-status/get-status";


                        $http
                            .post(getUrl, {
                                'token': $scope.$root.token,
                                type: types
                            })
                            .then(function (res) {
                                if (res.data.ack == true) {



                                    if (type == 'STATUS') {
                                        // $scope.status_list = res.data.response;
                                        angular.forEach($scope.status_list, function (elem) {
                                            if (elem.id == sid) drp.status_ids = elem;
                                        });
                                        /*  if ($scope.user_type == 1)
                                         $scope.status_list.push({'id': '-1', 'title': '++ Add New ++'});*/
                                    }

                                    if (type == 'SEGMENT') {
                                        $scope.arr_segment = res.data.response;

                                        angular.forEach($scope.arr_segment, function (elem) {
                                            if (elem.id == sid)
                                                drp.company_type_id = elem;
                                        });
                                        if ($scope.user_type == 1)
                                            $scope.arr_segment.push({
                                                'id': '-1',
                                                'name': '++ Add New ++'
                                            });
                                    }
                                    if (type == 'BUYING_GROUP') {
                                        $scope.arr_buying_group = res.data.response;

                                        angular.forEach($scope.arr_buying_group, function (elem) {
                                            if (elem.id == sid)
                                                drp.buying_grp_id = elem;
                                        });
                                        if ($scope.user_type == 1)
                                            $scope.arr_buying_group.push({
                                                'id': '-1',
                                                'name': '++ Add New ++'
                                            });

                                    }

                                }
                            });
                    } else toaster.pop('error', 'Info', ress.data.error);
                });

        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    //add currency
    /* $scope.addNewCurrencyPopup = function (drp) {
        var id = drp.currency != undefined ? drp.currency.id : 0;
        if (id > 0)
            return false;

        //	$scope.fnDatePicker();
        $scope.currency = {};
        ngDialog.openConfirm({
            template: 'app/views/company/add_new_currency.html',
            className: 'ngdialog-theme-default-custom-large',
            scope: $scope
        }).then(function (currency) {
            var addCurrencyUrl = $scope.$root.setup + "general/add-currency";
            currency.token = $scope.$root.token;
            currency.company_id = $scope.$root.defaultCompany;
            currency.status = $scope.currency.c_status !== undefined ? $scope.currency.c_status.value : 0;

            $http
                .post(addCurrencyUrl, currency)
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', res.data.msg);
                        var currencyUrl = $scope.$root.setup + "general/currency-list";
                        $http
                            .post(currencyUrl, {
                                'company_id': $scope.$root.defaultCompany,
                                'token': $scope.$root.token
                            })
                            .then(function (res1) {
                                if (res1.data.ack == true) {

                                    $rootScope.arr_currency = res1.data.response;
                                    $scope.arr_currency.push({
                                        'id': '-1',
                                        'name': '++ Add New ++'
                                    });

                                    angular.forEach($scope.arr_currency, function (elem) {
                                        if (elem.id == res.data.id)
                                            drp.currency = elem;
                                    });
                                }

                            });
                    } else if (res.data.ack == false) {
                        toaster.pop('error', 'Info', res.data.msg);
                    } else
                        toaster.pop('error', 'Info', res.data.msg);

                });

        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }
 */

    //--------------------- start General   ------------------------------------------


    $scope.product_type = true;
    $scope.count_result = 0;

    var getCodeUrl = $scope.$root.stock + "products-listing/get-code";

    $scope.getCode = function (rec) {

        // var getCrmCodeUrl = $scope.$root.pr + "srm/srm/get-srm-code";

        var name = $scope.$root.base64_encode('srm');
        var no = $scope.$root.base64_encode('srm_no');

        var module_category_id = 2;

        $http
            .post(getCodeUrl, {
                'is_increment': 1,
                'token': $scope.$root.token,
                'tb': name,
                'm_id': 54,
                'no': no,
                'category': $scope.formData.category_ids,
                'brand': $scope.formData.brand_ids,
                'module_category_id': module_category_id,
                'type': '1,2'
            })

            .then(function (res) {

                if (res.data.ack == 1) {
                    //console.log(res); console.log( res.data.nubmer);
                    $scope.rec.srm_code = res.data.code;
                    $scope.rec.srm_no = res.data.nubmer;

                    $scope.rec.code_type = module_category_id; //res.data.code_type;
                    $scope.count_result++;

                    if (res.data.type == 1) {
                        $scope.product_type = false;
                    } else {
                        $scope.product_type = true;
                    }

                    if ($scope.count_result > 0) {
                        console.log($scope.count_result);
                        return true;
                    } else {
                        console.log($scope.count_result + 'd');
                        return false;
                    }

                } else {
                    toaster.pop('error', 'info', res.data.error);
                    return false;
                }
            });

    }



    $scope.show_status_date = function (status_sel) {


        if (status_sel.name != "Active")
            $scope.status_change_date = 1;
        else
            $scope.status_change_date = 0;
    }

    $scope.$root.model_code = "";
    $scope.$root.breadcrumbs = [{ 'name': 'Purchases', 'url': '#', 'style': '' }, { 'name': 'SRM', 'url': 'app.srm', 'style': '' }];

    $scope.get_srm_data_by_id = function () {

        $scope.showLoader = true;
        $scope.isSrm = false;
        $scope.moduleCodeType = 1;
        
        var DetailsURL = $scope.$root.pr + "srm/srm/get-srm";
        $http
            .post(DetailsURL, {
                'token': $scope.$root.token,
                'id': $stateParams.id
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    moduleTracker.updateRecordName(res.data.response.name);
                    console.log('res: ', res);
                    $scope.rec = res.data.response;                    
                    $scope.moduleCodeType = res.data.moduleCodeType;
                    $scope.rec.id = res.data.response.id;
                    $scope.check_srm_readonly = true;

                    if(res.data.response.type == 1){
                        $scope.isSrm = true;
                    }
                    //$scope.$root.bdname = res.data.response.name;
                    $scope.rec.old_status = res.data.response.status;
                    $scope.rec.old_contact = res.data.response.contact_person;
                    $scope.rec.old_location = res.data.response.address_1;
                    $scope.module_code = res.data.response.name;
                    $scope.rec.purchaser_code_id = res.data.response.salesperson_id;
                    //$scope.rec.status_date = $scope.$root.convert_unix_date_to_angular(res.data.response.status_date);

                    $scope.status_list = [{
                        'id': '1',
                        'title': 'Active'
                    }, {
                        'id': '0',
                        'title': 'Inactive'
                    }];

                    $scope.rec.srm_no = res.data.response.srm_no;
                    $scope.rec.srm_code = res.data.response.srm_code;

                    $scope.$root.model_code = res.data.response.name + ' ( ' + res.data.response.srm_code + ' )';

                    if ($scope.$root.breadcrumbs.length == 2) {
                        $scope.$root.breadcrumbs.push({
                            'name': $scope.$root.model_code,
                            'url': '#',
                            'isActive': false
                        });
                    }

                    angular.forEach($scope.status_list, function (obj) {
                        if (obj.id == res.data.response.status) $scope.drp.status_ids = obj;
                    });



                    /* if (res.data.response.arr_pref_method_comm.length > 0) {

                        $scope.arr_pref_method_comm = res.data.response.arr_pref_method_comm;

                        angular.forEach($scope.arr_pref_method_comm, function (obj) {
                            if (obj.id == res.data.response.pref_method_of_communication)
                                $scope.drp.pref_mthod_of_comm = obj;
                        });
                    } */

                    if ($rootScope.arr_pref_method_comm.length > 0) {

                        // $scope.arr_pref_method_comm = res.data.response.arr_pref_method_comm;

                        angular.forEach($rootScope.arr_pref_method_comm, function (obj) {
                            if (obj.id == res.data.response.primaryc_pref_method_of_communication)
                                $scope.drp.pref_mthod_of_comm = obj;
                        });
                    }

                    if (res.data.response.price_method_list != undefined && res.data.response.price_method_list.length > 0) {
                        $scope.price_method_list = res.data.response.price_method_list;
                    }

                    $scope.tempSocialMedia = [];
                    angular.forEach($rootScope.social_medias_general_form, function (obj2) {

                        if (obj2.id == $scope.rec.socialmedia1 && $scope.rec.socialmedia1 != 0) {
                            obj2.value = $scope.rec.socialmedia1_value;
                            $scope.tempSocialMedia.push(obj2);
                        }
                        if (obj2.id == $scope.rec.socialmedia2 && $scope.rec.socialmedia2 != 0) {
                            obj2.value = $scope.rec.socialmedia2_value;
                            $scope.tempSocialMedia.push(obj2);
                        }
                        if (obj2.id == $scope.rec.socialmedia3 && $scope.rec.socialmedia3 != 0) {
                            obj2.value = $scope.rec.socialmedia3_value;
                            $scope.tempSocialMedia.push(obj2);
                        }
                        if (obj2.id == $scope.rec.socialmedia4 && $scope.rec.socialmedia4 != 0) {
                            obj2.value = $scope.rec.socialmedia4_value;
                            $scope.tempSocialMedia.push(obj2);
                        }
                        if (obj2.id == $scope.rec.socialmedia5 && $scope.rec.socialmedia5 != 0) {
                            obj2.value = $scope.rec.socialmedia5_value;
                            $scope.tempSocialMedia.push(obj2);
                        }
                    });

                    if ($scope.rec.contact_person != undefined) {
                        if ($scope.rec.contact_person.length > 0)
                            $scope.rec.contactCollapse = false;
                        else
                            $scope.rec.contactCollapse = true;
                    }
                    if ($scope.tempSocialMedia.length) {
                        $scope.socialMediasGeneral = {};
                        $scope.socialMediasGeneral['srmSM'] = $scope.tempSocialMedia;
                    }

                    if ($scope.rec.currency_id) {
                        $rootScope.supp_current_edit_currency = $scope.$root.get_obj_frm_arry($rootScope.arr_currency, $scope.rec.currency_id);
                    } else {
                        $rootScope.supp_current_edit_currency = $scope.$root.defaultCurrency;
                    }

                    angular.forEach($rootScope.country_type_arr, function (elem) {
                        if (elem.id == res.data.response.country_id)
                            $scope.drp.country_id = elem;
                    });

                    angular.forEach($scope.arr_currency, function (elem) {
                        if (elem.id == res.data.response.currency_id)
                            $scope.drp.currency = elem;
                    });

                    if (res.data.response.status_date == 0) {
                        res.data.response.status_date = null;
                        $scope.status_change_date = 0;
                    } else {
                        $scope.rec.status_date = $scope.$root.convert_unix_date_to_angular(res.data.response.status_date);
                        $scope.status_change_date = 1;
                    }

                    var test_id = 0;
                    var tempGen = [];
                    $scope.disable_classification = false;
                    if (res.data.response.srm_classification > 0) {
                        angular.forEach($rootScope.arr_srm_classification, function (obj) {
                            if (obj.id == res.data.response.srm_classification) {
                                $scope.drp.srm_classification = obj;
                                if (obj.title == 'Supplier')
                                    $scope.disable_classification = true;
                            }
                        });
                    }

                    if ($scope.rec.segment_id != undefined && $rootScope.segment_supplier_arr != undefined)
                        $scope.drp.segment_id = $scope.$root.get_obj_frm_arry($rootScope.segment_supplier_arr, $scope.rec.segment_id);

                    if ($scope.rec.selling_grp_id != undefined && $rootScope.selling_group_arr != undefined)
                        $scope.drp.selling_grp_id = $scope.$root.get_obj_frm_arry($rootScope.selling_group_arr, $scope.rec.selling_grp_id);

                    // if ($scope.rec.region_id != undefined && $rootScope.region_customer_arr != undefined)
                    //     $scope.drp.region_id = $scope.$root.get_obj_frm_arry($rootScope.region_customer_arr, $scope.rec.region_id);


                    if ($scope.rec.region_id != undefined && $rootScope.region_supplier_arr != undefined)
                        $scope.drp.region_id = $scope.$root.get_obj_frm_arry($rootScope.region_supplier_arr, $scope.rec.region_id);

                    $scope.getAltContact_genral($scope.rec, 1);
                    $scope.getAltLocationfrmGeneral($scope.rec, 1);

                }
                // else 	toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                $scope.showLoader = false;

            }).catch(function (message) {
                $scope.showLoader = false;
                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.hasDupsObjects = function (array) {

        return array.map(function (value) {
            return value.name + value.url

        }).some(function (value, index, array) {
            return array.indexOf(value) !== array.lastIndexOf(value);
        })
    }

    if ($stateParams.id !== undefined)
        $scope.get_srm_data_by_id();

    $scope.generalInformation = function () {
        //   $scope.$root.breadcrumbs[3].name = 'General';
        $scope.get_srm_data_by_id();
    }

    $scope.generate_unique_id = function () {

        $scope.moduleCodeType = 1;

        if ($stateParams.id === undefined) {
            var getUrl = $scope.$root.pr + "srm/srm/get-unique-id";

            $http
                .post(getUrl, {
                    'token': $scope.$root.token,
                    table: 'srm',
                    type: 1
                })
                .then(function (res) {

                    if (res.data.ack == 1) {

                        /* $scope.rec.unique_id = res.data.unique_id;
                        $scope.rec.id = res.data.id;
                        $scope.$root.srm_id = res.data.id; */


                        $scope.rec.is_billing_address = 1;
                        $scope.rec.is_delivery_collection_address = 1;
                        $scope.rec.is_invoice_address = 1;

                        // $scope.rec.purchaser_code = $rootScope.defaultUserName;
                        // $scope.rec.purchaser_code_id = $rootScope.userId;

                        $scope.moduleCodeType = res.data.moduleCodeType;

                        // if (res.data.response.arr_pref_method_comm.length > 0) {
                        //     $scope.arr_pref_method_comm = res.data.response.arr_pref_method_comm;
                        // }

                        angular.forEach($rootScope.country_type_arr, function (elem) {
                            if (elem.id == $scope.$root.defaultCountry)
                                $scope.drp.country_id = elem;
                        });

                        angular.forEach($rootScope.arr_currency, function (elem) {
                            if (elem.id == $scope.$root.defaultCurrency)
                                $scope.drp.currency = elem;
                        });

                        $scope.drp.country_id = $scope.$root.get_obj_frm_arry($scope.$root.country_type_arr, $scope.$root.defaultCountry);

                        if (res.data.response.price_method_list != undefined && res.data.response.price_method_list.length > 0) {
                            $scope.price_method_list = res.data.response.price_method_list;
                        }
                    } else {
                        toaster.pop('error', 'info', res.data.error);
                        return false;
                    }
                });

        }
    }

    if ($stateParams.id === undefined)
        $scope.generate_unique_id();


    $scope.add_general_srm = function (rec, drp) {

        if (drp.status_ids == undefined || drp.status_ids == ''){
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Status']));
            return false;
        }

        

        rec.country_id = (drp.country_id != undefined && drp.country_id != '') ? drp.country_id.id : 0;
        rec.status = (drp.status_ids != undefined && drp.status_ids != '') ? drp.status_ids.id : 0;
        rec.selling_grp_id = (drp.selling_grp_id != undefined && drp.selling_grp_id != '') ? drp.selling_grp_id.id : 0;
        rec.segment_id = (drp.segment_id != undefined && drp.segment_id != '') ? drp.segment_id.id : 0;
        rec.region_id = (drp.region_id != undefined && drp.region_id != '') ? drp.region_id.id : 0;
        rec.pref_method_of_communication = (drp.pref_mthod_of_comm != undefined && drp.pref_mthod_of_comm != '') ? drp.pref_mthod_of_comm.id : 0;
        rec.srm_classification = (drp.srm_classification != undefined && drp.srm_classification != '') ? drp.srm_classification.id : 0;
        rec.currency_id = (drp.currency != undefined && drp.currency != '') ? drp.currency.id : 0;

        if (drp.company_type_id != undefined) {
            var arrSeg = [];
            if (drp.company_type_id.length > 0) {

                angular.forEach(drp.company_type_id, function (elem) {
                    arrSeg.push(elem.id);
                });
                rec.segment_id = arrSeg.toString();
            }
        }

        rec.socialmedia1s = (rec.socialmedia1 != undefined && rec.socialmedia1 != '') ? rec.socialmedia1.id : 0;
        rec.socialmedia2s = (rec.socialmedia2 != undefined && rec.socialmedia2 != '') ? rec.socialmedia2.id : 0;
        rec.socialmedia3s = (rec.socialmedia3 != undefined && rec.socialmedia3 != '') ? rec.socialmedia3.id : 0;
        rec.socialmedia4s = (rec.socialmedia4 != undefined && rec.socialmedia4 != '') ? rec.socialmedia4.id : 0;
        rec.socialmedia5s = (rec.socialmedia5 != undefined && rec.socialmedia5 != '') ? rec.socialmedia5.id : 0;

        if (rec.currency_id == 0) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Currency']));
            return false;
        }

        /* if (rec.status == 0) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Status']));
            return false;
        } */

        if (rec.web_address != undefined && rec.web_address.length > 0)
            rec.web_address = (rec.web_address.indexOf('://') === -1) ? 'http://' + rec.web_address : rec.web_address;

        if (angular.element('#genis_billing_address').is(':checked') == false)
            rec.is_billing_address = 0;

        if (angular.element('#genis_delivery_collection_address').is(':checked') == false)
            rec.is_delivery_collection_address = 0;
        // else if ($stateParams.id == undefined)
        //     toaster.pop('warning', 'info', "Contact and Delivery Hours can be added on Other Locations tab.");

        if (angular.element('#genis_invoice_address').is(':checked') == false)
            rec.is_invoice_address = 0;

        // Location address or postcode is mandatory if you want tad phone or email
        if ($scope.rec.phone != undefined && $scope.rec.phone != "" || $scope.rec.email != undefined && $scope.rec.email != "") {
            var addresscheck = false;
            var postcodecheck = false;
            if ($scope.rec.address_1 == null || $scope.rec.address_1 == "" || $scope.rec.address_1 == undefined) {
                addresscheck = true;
            }
            if ($scope.rec.postcode == null || $scope.rec.postcode == "" || $scope.rec.postcode == undefined) {
                postcodecheck = true;
            }
        }
        if (addresscheck && postcodecheck) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(231, ['Address Line 1 ', 'Postcode']));
            $scope.showLoader = false;
            return;
        }

        rec.type = 1;
        rec.token = $scope.$root.token;
        $scope.showLoader = true;
        if ($scope.rec.srm_code != undefined){
            if (rec.is_delivery_collection_address != 0 && $stateParams.id == undefined)
                toaster.pop('warning', 'info', "Contact and Delivery Hours can be added on Other Locations tab.");
            $scope.UpdateForm(rec);
        }            
        else {
            rec.srmModuleType = 1;                        
            $scope.recDupChk = rec;

            var duplicationChkUrl = $scope.$root.pr + "srm/srm/duplication-chk-crm";

            $http
                .post(duplicationChkUrl, rec)
                .then(function (res) {

                    if (res.data.ack == true) {
                        $scope.showLoader = false;

                        $scope.errorMsg = res.data.error;

                        ngDialog.openConfirm({
                            template: 'app/views/crm/duplicationChkModal.html',
                            className: 'ngdialog-theme-default-custom',
                            scope: $scope
                        }).then(function (value) {


                            /* code to get SRM code Start */

                            if (rec.is_delivery_collection_address != 0 && $stateParams.id == undefined)
                                toaster.pop('warning', 'info', "Contact and Delivery Hours can be added on Other Locations tab.");

                            var name = $scope.$root.base64_encode('srm');
                            var no = $scope.$root.base64_encode('srm_no');

                            $scope.showLoader = true;

                            var module_category_id = 2;

                            $http
                                .post(getCodeUrl, {
                                    'is_increment': 1,
                                    'token': $scope.$root.token,
                                    'tb': name,
                                    'm_id': 54,
                                    'no': no,
                                    'category': $scope.formData.category_ids,
                                    'brand': $scope.formData.brand_ids,
                                    'module_category_id': module_category_id,
                                    'type': '1,2'
                                })
                                .then(function (res) {

                                    if (res.data.ack == 1) {
                                        //console.log(res); console.log( res.data.nubmer);
                                        $scope.rec.srm_code = res.data.code;
                                        $scope.rec.srm_no = res.data.nubmer;

                                        $scope.rec.code_type = module_category_id; //res.data.code_type;
                                        $scope.count_result++;

                                        if (res.data.type == 1)
                                            $scope.product_type = false;
                                        else
                                            $scope.product_type = true;

                                        if ($scope.rec.srm_code != undefined) {

                                            /* code to add SRM Start */
                                            $scope.UpdateForm(rec);
                                            /* code to add SRM End */
                                        }
                                        else {
                                            $scope.showLoader = false;
                                            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['SRM Code']));
                                        }
                                    } else {
                                        $scope.showLoader = false;
                                        toaster.pop('error', 'info', res.data.error);
                                        return false;
                                    }
                                });

                            /* code to get SRM code End */

                            }, function (reason) {
                                console.log('Modal promise rejected. Reason: ', reason);
                            });

                    } else {
                        
                        /* code to get SRM code Start */

                        if (rec.is_delivery_collection_address != 0 && $stateParams.id == undefined)
                            toaster.pop('warning', 'info', "Contact and Delivery Hours can be added on Other Locations tab.");

                        var name = $scope.$root.base64_encode('srm');
                        var no = $scope.$root.base64_encode('srm_no');

                        $scope.showLoader = true;

                        var module_category_id = 2;

                        $http
                            .post(getCodeUrl, {
                                'is_increment': 1,
                                'token': $scope.$root.token,
                                'tb': name,
                                'm_id': 54,
                                'no': no,
                                'category': $scope.formData.category_ids,
                                'brand': $scope.formData.brand_ids,
                                'module_category_id': module_category_id,
                                'type': '1,2'
                            })
                            .then(function (res) {

                                if (res.data.ack == 1) {
                                    //console.log(res); console.log( res.data.nubmer);
                                    $scope.rec.srm_code = res.data.code;
                                    $scope.rec.srm_no = res.data.nubmer;

                                    $scope.rec.code_type = module_category_id; //res.data.code_type;
                                    $scope.count_result++;

                                    if (res.data.type == 1)
                                        $scope.product_type = false;
                                    else
                                        $scope.product_type = true;

                                    if ($scope.rec.srm_code != undefined) {

                                        /* code to add SRM Start */
                                        $scope.UpdateForm(rec);
                                        /* code to add SRM End */
                                    }
                                    else {
                                        $scope.showLoader = false;
                                        toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['SRM Code']));
                                    }
                                } else {
                                    $scope.showLoader = false;
                                    toaster.pop('error', 'info', res.data.error);
                                    return false;
                                }
                            });

                            /* code to get SRM code End */
                    }

                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
                });
        }
    }

    ///* Function to Update SRM General Form*/
    $scope.UpdateForm = function (rec) {

        if ($scope.rec.srm_code != undefined) {

            var addcrmUrl = $scope.$root.pr + "srm/srm/add-srm";

            if ($scope.$root.srm_id > 0)
                addcrmUrl = $scope.$root.pr + "srm/srm/update-srm";

            if (rec.currency_id) {
                $rootScope.supp_current_edit_currency = $scope.$root.get_obj_frm_arry($rootScope.arr_currency, rec.currency_id);
            } else {
                $rootScope.supp_current_edit_currency = $scope.$root.defaultCurrency;
            }
            // console.log($rootScope.supp_current_edit_currency);

            if ($scope.rec.contact_person != undefined) {

                $scope.add_contact_from_general(rec);
                rec.contact = $scope.addContactData;
            }

            if ($scope.rec.address_1 != undefined) {
                if ($scope.rec.address_1.length > 0) {
                    $scope.addAltlocationfromGeneral(rec);
                    rec.loc = $scope.addLocdata;
                } else if ($scope.rec.postcode != undefined && $scope.rec.postcode.length > 0) {
                    $scope.addAltlocationfromGeneral(rec);
                    rec.loc = $scope.addLocdata;
                }
                else
                    rec.loc = {};
            } else if ($scope.rec.postcode != undefined && $scope.rec.postcode.length > 0) {
                $scope.addAltlocationfromGeneral(rec);
                rec.loc = $scope.addLocdata;
            }
            else
                rec.loc = {};

            // if (!(rec.loc.length>0) && rec.alt_loc_id>0){
            if (rec.loc.depot == undefined && rec.alt_loc_id>0){
                $scope.showLoader = false;
                toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(378, ['Primary Location']));
                return false;
            }

            rec.acc_id = $scope.$root.srm_id;
            rec.social_media_arr = $scope.socialMediasGeneral.srmSM;

            // console.log('rec: ', rec); 
            $http
                .post(addcrmUrl, rec)
                .then(function (res) {

                    $scope.showLoader = false;

                    if (res.data.ack == true) {

                        if ($stateParams.id == undefined)
                            toaster.pop('success', 'Add', 'Record  Inserted  .');
                        else
                            toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));

                        $scope.$root.rec_id = res.data.id;
                        $scope.rec.srm_id = res.data.id;

                        if(!$scope.rec.alt_loc_id && res.data.alt_loc_id) 
                            $scope.rec.alt_loc_id = res.data.alt_loc_id;

                         if(!$scope.rec.alt_contact_id && res.data.alt_contact_id) 
                            $scope.rec.alt_contact_id = res.data.alt_contact_id; 
                         
                        $scope.rec.contact_name = $scope.rec.contact_person;
                        $scope.rec.web_add = rec.web_address;
                        $scope.rec.country_ids = $scope.rec_contact.country_id != undefined ? $scope.rec_contact.country_id.id : 0;

                        // if ($scope.$root.srm_id === undefined)
                        //     return;

                        // console.log($scope.rec.old_status);
                        if ($scope.rec.old_status != rec.status)
                            $scope.add_status_history($scope.rec.srm_id, rec);

                        if ($stateParams.id == undefined)
                            $state.go("app.edit-srm", {
                                id: res.data.id
                            });
                        else
                            $scope.check_srm_readonly = true;
                    } else {
                        if ($stateParams.id > 0)
                            toaster.pop('error', 'Error', res.data.error);
                        else
                            toaster.pop('error', 'Error', res.data.error);
                    }
                });

        } else toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['SRM Code']));
    }
    //--------------------- end General   ------------------------------------------
    $scope.gotoedit = function () {
        $scope.check_readonly = false;
    }

    // sync location primary record with general start
    $scope.getAltLocationfrmGeneral = function (arr, type) {
        if (type != undefined) {
            if (arr) {

                $scope.rec.address_1 = $scope.rec.primary_address_1;
                $scope.rec.address_2 = $scope.rec.primary_address_2;
                $scope.rec.city = $scope.rec.primary_city;
                $scope.rec.county = $scope.rec.primary_county;
                $scope.rec.postcode = $scope.rec.primary_postcode;
                $scope.rec.alt_loc_id = $scope.rec.primary_id;

                if ($scope.rec.primary_country != undefined && $rootScope.country_type_arr != undefined)
                    $scope.drp.country_id = $scope.$root.get_obj_frm_arry($rootScope.country_type_arr, $scope.rec.primary_country);


                /* if ($scope.rec.primary_is_billing_address == 1)
                    $scope.rec.is_billing_address = 1;
                else
                    $scope.rec.is_billing_address = 0;

                if ($scope.rec.primary_is_invoice_address == 1)
                    $scope.rec.is_invoice_address = 1;
                else
                    $scope.rec.is_invoice_address = 0;

                if ($scope.rec.primary_is_delivery_collection_address == 1)
                    $scope.rec.is_delivery_collection_address = 1;
                else
                    $scope.rec.is_delivery_collection_address = 0; */

                if ($scope.rec.primary_is_billing_address == 1)
                    $scope.rec.is_billing_address = true;
                else
                    $scope.rec.is_billing_address = false;

                if ($scope.rec.primary_is_invoice_address == 1)
                    $scope.rec.is_invoice_address = true;
                else
                    $scope.rec.is_invoice_address = false;

                if ($scope.rec.primary_is_delivery_collection_address == 1)
                    $scope.rec.is_delivery_collection_address = true;
                else
                    $scope.rec.is_delivery_collection_address = false;

            } else {
                $scope.rec.address_1 = null;
                $scope.rec.address_2 = null;
                $scope.rec.city = null;
                $scope.rec.county = null;
                $scope.rec.postcode = null;
                $scope.rec.alt_loc_id = null;

                $scope.rec.is_billing_address = 0;
                $scope.rec.is_delivery_collection_address = 0;
                $scope.rec.is_invoice_address = 0;

                angular.forEach($rootScope.country_type_arr, function (elem) {
                    if (elem.id == $scope.$root.defaultCountry)
                        $scope.drp.country_id = elem;
                });
            }
        } else {

            $scope.postData = {
                'acc_id': $scope.$root.srm_id,
                'module_type': 2,
                'token': $scope.$root.token,
                'is_primary': 1
            }
            var ApiAjax = $scope.$root.pr + "srm/srm/alt-depots";
            $http
                .post(ApiAjax, $scope.postData)
                .then(function (alt_res) {
                    if (alt_res.data.record.ack == true) {

                        $scope.rec.address_1 = alt_res.data.record.result[0].address_1;
                        $scope.rec.address_2 = alt_res.data.record.result[0].address_2;
                        $scope.rec.city = alt_res.data.record.result[0].city;
                        $scope.rec.county = alt_res.data.record.result[0].county;
                        $scope.rec.postcode = alt_res.data.record.result[0].postcode;
                        $scope.rec.alt_loc_id = alt_res.data.record.result[0].id;

                        if ($scope.rec.country_id != undefined && $rootScope.country_type_arr != undefined)
                            $scope.drp.country_id = $scope.$root.get_obj_frm_arry($rootScope.country_type_arr, alt_res.data.record.result[0].country);

                        //  $scope.get_alt_contact_social_media_list($scope.rec.alt_contact_id);

                        if (alt_res.data.record.result[0].is_billing_address == 1)
                            $scope.rec.is_billing_address = 1;
                        else
                            $scope.rec.is_billing_address = 0;

                        if (alt_res.data.record.result[0].is_delivery_collection_address == 1)
                            $scope.rec.is_delivery_collection_address = 1;
                        else
                            $scope.rec.is_delivery_collection_address = 0;

                        if (alt_res.data.record.result[0].is_invoice_address == 1)
                            $scope.rec.is_invoice_address = 1;
                        else
                            $scope.rec.is_invoice_address = 0;
                    } else {

                        $scope.rec.address_1 = null;
                        $scope.rec.address_2 = null;
                        $scope.rec.city = null;
                        $scope.rec.county = null;
                        $scope.rec.postcode = null;
                        $scope.rec.alt_loc_id = null;

                        $scope.rec.is_billing_address = 0;
                        $scope.rec.is_delivery_collection_address = 0;
                        $scope.rec.is_invoice_address = 0;

                        angular.forEach($rootScope.country_type_arr, function (elem) {
                            if (elem.id == $scope.$root.defaultCountry)
                                $scope.drp.country_id = elem;
                        });
                    }
                });
        }
    }

    $scope.getAltContact_genral = function (arr, type) {
        if (type != undefined) {
            if (arr) {

                $scope.rec.contact_person = $scope.rec.primaryc_name;
                $scope.rec.cjob_title = $scope.rec.primaryc_job_title;
                $scope.rec.cdirect_line = $scope.rec.primaryc_direct_line;
                $scope.rec.cmobile = $scope.rec.primaryc_mobile;
                $scope.rec.cphone = $scope.rec.primaryc_phone;
                $scope.rec.cfax = $scope.rec.primaryc_fax;
                $scope.rec.cemail = $scope.rec.primaryc_email;
                $scope.rec.cbooking_instructions = $scope.rec.primaryc_booking_instructions;
                $scope.rec.alt_contact_id = $scope.rec.primaryc_id;

                if ($scope.rec.pref_method_of_communication != undefined)
                    $scope.drp.pref_mthod_of_comm = $scope.$root.get_obj_frm_arry($rootScope.arr_pref_method_comm, $scope.rec.pref_method_of_communication);
                // $scope.drp.pref_mthod_of_comm = $scope.$root.get_obj_frm_arry($scope.arr_pref_method_comm, $scope.rec.pref_method_of_communication);

                /*
                $scope.rec.csocialmedia1_value = $scope.rec.primaryc_socialmedia1_value;
                $scope.rec.csocialmedia2_value = $scope.rec.primaryc_socialmedia2_value;
                $scope.rec.csocialmedia3_value = $scope.rec.primaryc_socialmedia3_value;
                $scope.rec.csocialmedia4_value = $scope.rec.primaryc_socialmedia4_value;
                $scope.rec.csocialmedia5_value = $scope.rec.primaryc_socialmedia5_value;

                angular.forEach($rootScope.social_medias, function (obj2) {

                    if (obj2.id == $scope.rec.primaryc_socialmedia1)
                        $scope.rec.csocialmedia1 = obj2;

                    if (obj2.id == $scope.rec.primaryc_socialmedia2)
                        $scope.rec.csocialmedia2 = obj2;

                    if (obj2.id == $scope.rec.primaryc_socialmedia3)
                        $scope.rec.csocialmedia3 = obj2;

                    if (obj2.id == $scope.rec.primaryc_socialmedia4)
                        $scope.rec.csocialmedia4 = obj2;

                    if (obj2.id == $scope.rec.primaryc_socialmedia5)
                        $scope.rec.csocialmedia5 = obj2;
                }); */

                $scope.tempContactSocialMedia = [];
                angular.forEach($rootScope.social_medias_contact_form, function (obj) {

                    if (obj.id == $scope.rec.primaryc_socialmedia1 && $scope.rec.primaryc_socialmedia1 != 0) {
                        obj.value = $scope.rec.primaryc_socialmedia1_value;
                        $scope.tempContactSocialMedia.push(obj);
                    }
                    if (obj.id == $scope.rec.primaryc_socialmedia2 && $scope.rec.primaryc_socialmedia2 != 0) {
                        obj.value = $scope.rec.primaryc_socialmedia2_value;
                        $scope.tempContactSocialMedia.push(obj);
                    }
                    if (obj.id == $scope.rec.primaryc_socialmedia3 && $scope.rec.primaryc_socialmedia3 != 0) {
                        obj.value = $scope.rec.primaryc_socialmedia3_value;
                        $scope.tempContactSocialMedia.push(obj);
                    }
                    if (obj.id == $scope.rec.primaryc_socialmedia4 && $scope.rec.primaryc_socialmedia4 != 0) {
                        obj.value = $scope.rec.primaryc_socialmedia4_value;
                        $scope.tempContactSocialMedia.push(obj);
                    }
                    if (obj.id == $scope.rec.primaryc_socialmedia5 && $scope.rec.primaryc_socialmedia5 != 0) {
                        obj.value = $scope.rec.primaryc_socialmedia5_value;
                        $scope.tempContactSocialMedia.push(obj);
                    }
                });

                if ($scope.tempContactSocialMedia.length) {
                    $scope.socialMediasContactGeneral = {};
                    $scope.socialMediasContactGeneral['SRMprimaryContactSM'] = $scope.tempContactSocialMedia;
                }
            } else {
                $scope.rec.contact_person = null;
                $scope.rec.cjob_title = null;
                $scope.rec.cdirect_line = null;
                $scope.rec.cmobile = null;
                $scope.rec.cphone = null;
                $scope.rec.cfax = null;
                $scope.rec.cnotes = null;
                $scope.rec.cemail = null;
                $scope.rec.alt_contact_id = null;

                $scope.rec.socialmedia1_value = null;
                $scope.rec.socialmedia2_value = null;
                $scope.rec.socialmedia3_value = null;
                $scope.rec.socialmedia4_value = null;
                $scope.rec.socialmedia5_value = null;

                $scope.rec.socialmedia1 = null;
                $scope.rec.socialmedia2 = null;
                $scope.rec.socialmedia3 = null;
                $scope.rec.socialmedia4 = null;
                $scope.rec.socialmedia5 = null;
            }
        } else {

            $scope.postData = {
                'acc_id': $scope.$root.srm_id,
                'module_type': $rootScope.SRMType,
                'token': $scope.$root.token,
                'is_primary': 1
            }
            var ApiAjax = $scope.$root.pr + "srm/srm/get-alt-contacts-list";
            $http
                .post(ApiAjax, $scope.postData)
                .then(function (alt_res) {

                    if (alt_res.data.ack == true) {

                        $scope.rec.contact_person = alt_res.data.response[0].name;
                        $scope.rec.cjob_title = alt_res.data.response[0].job_title;
                        $scope.rec.cdirect_line = alt_res.data.response[0].direct_line;
                        $scope.rec.cmobile = alt_res.data.response[0].mobile;
                        $scope.rec.cphone = alt_res.data.response[0].phone;
                        $scope.rec.cfax = alt_res.data.response[0].fax;
                        $scope.rec.cemail = alt_res.data.response[0].email;
                        $scope.rec.cbooking_instructions = alt_res.data.response[0].booking_instructions;
                        $scope.rec.alt_contact_id = alt_res.data.response[0].id;

                        if (alt_res.data.response[0].pref_method_of_communication != undefined) {

                            angular.forEach($rootScope.arr_pref_method_comm, function (elem) {
                                if (elem.id == alt_res.data.response[0].pref_method_of_communication) {
                                    $scope.drp.pref_mthod_of_comm = elem;
                                }
                            });

                            // angular.forEach($scope.arr_pref_method_comm, function (elem) {
                            //     if (elem.id == alt_res.data.response[0].pref_method_of_communication) {
                            //         $scope.drp.pref_mthod_of_comm = elem;
                            //     }
                            // });
                        }

                        $scope.rec.csocialmedia1_value = alt_res.data.response[0].socialmedia1_value;
                        $scope.rec.csocialmedia2_value = alt_res.data.response[0].socialmedia2_value;
                        $scope.rec.csocialmedia3_value = alt_res.data.response[0].socialmedia3_value;
                        $scope.rec.csocialmedia4_value = alt_res.data.response[0].socialmedia4_value;
                        $scope.rec.csocialmedia5_value = alt_res.data.response[0].socialmedia5_value;

                        angular.forEach($rootScope.social_medias, function (elem) {

                            if (elem.id == alt_res.data.response[0].socialmedia1)
                                $scope.rec.csocialmedia1 = elem;

                            if (elem.id == alt_res.data.response[0].socialmedia2)
                                $scope.rec.csocialmedia2 = elem;

                            if (elem.id == alt_res.data.response[0].socialmedia3)
                                $scope.rec.csocialmedia3 = elem;

                            if (elem.id == alt_res.data.response[0].socialmedia4)
                                $scope.rec.csocialmedia4 = elem;

                            if (elem.id == alt_res.data.response[0].socialmedia5)
                                $scope.rec.csocialmedia5 = elem;
                        });
                        //$scope.get_alt_contact_social_media_list($scope.rec.alt_contact_id);
                    } else {
                        $scope.rec.contact_person = null;
                        $scope.rec.cjob_title = null;
                        $scope.rec.cdirect_line = null;
                        $scope.rec.cmobile = null;
                        $scope.rec.cphone = null;
                        $scope.rec.cfax = null;
                        $scope.rec.cnotes = null;
                        $scope.rec.cemail = null;
                        $scope.rec.alt_contact_id = null;

                        $scope.rec.csocialmedia1_value = null;
                        $scope.rec.csocialmedia2_value = null;
                        $scope.rec.csocialmedia3_value = null;
                        $scope.rec.csocialmedia4_value = null;
                        $scope.rec.csocialmedia5_value = null;

                        $scope.rec.csocialmedia1 = null;
                        $scope.rec.csocialmedia2 = null;
                        $scope.rec.csocialmedia3 = null;
                        $scope.rec.csocialmedia4 = null;
                        $scope.rec.csocialmedia5 = null;
                    }
                });
        }
        // $scope.$root.breadcrumbs[3].name = 'General';
    }

    $scope.add_contact_from_general = function (rec) {
        var rec2 = {};
        $scope.addContactData = {};
        rec2.module_type = $rootScope.SRMType;

        // rec2.token = $scope.$root.token;
        rec2.alt_contact_id = rec.alt_contact_id;
        rec2.acc_id = $scope.$root.srm_id;
        rec2.contact_name = rec.contact_person;
        rec2.is_primary = 1;
        rec2.depot = $scope.rec.contact_person; //Main office';
        rec2.job_title = $scope.rec.cjob_title;
        rec2.direct_line = $scope.rec.cdirect_line;
        rec2.mobile = $scope.rec.cmobile;
        rec2.email = $scope.rec.cemail;
        rec2.phone = $scope.rec.cphone;
        rec2.fax = $scope.rec.cfax;
        rec2.booking_instructions = $scope.rec.cbooking_instructions;
        rec2.notes = rec.primaryc_notes;

        rec2.pref_method_of_communication = $scope.drp.pref_mthod_of_comm != undefined ? $scope.drp.pref_mthod_of_comm.id : 0;

        rec2.socialmedia1s = rec.csocialmedia1 != undefined ? rec.csocialmedia1.id : 0;
        rec2.socialmedia2s = rec.csocialmedia2 != undefined ? rec.csocialmedia2.id : 0;
        rec2.socialmedia3s = rec.csocialmedia3 != undefined ? rec.csocialmedia3.id : 0;
        rec2.socialmedia4s = rec.csocialmedia4 != undefined ? rec.csocialmedia4.id : 0;
        rec2.socialmedia5s = rec.csocialmedia5 != undefined ? rec.csocialmedia5.id : 0;

        rec2.socialmedia1_value = rec.csocialmedia1_value;
        rec2.socialmedia2_value = rec.csocialmedia2_value;
        rec2.socialmedia3_value = rec.csocialmedia3_value;
        rec2.socialmedia4_value = rec.csocialmedia4_value;
        rec2.socialmedia5_value = rec.csocialmedia5_value;
        rec2.social_media_arr_contact = $scope.socialMediasContactGeneral.SRMprimaryContactSM;

        $scope.addContactData = rec2;
    }

    $scope.add_multicontact_location_dropdown_general = function (location_id, contact_id) {
        console.log(location_id);
        console.log(contact_id);
        var post = {};

        post.acc_id = $rootScope.srm_id;
        post.module_type = 2;
        post.location_id = location_id;
        post.contact_id = contact_id;
        post.token = $rootScope.token;

        var postUrl = $scope.$root.pr + "srm/srm/add-list-contact-location-general";
        $http
            .post(postUrl, post)
            .then(function (ress) {

            });
    }

    $scope.add_multicontact_location_dropdown = function (id, type) {
        /*console.log($scope.isselectcontactlocchk);
         console.log(type);*/

        if ($scope.isselectcontactlocchk == false)
            return;

        var post = {};
        var temp = [];


        //console.log($scope.record_data_contact);

        angular.forEach($scope.selected_data_loc_contact, function (obj) {
            temp.push({
                id: obj.id
            });
        });

        post.addcontactslisting = temp;
        post.acc_id = $scope.$root.srm_id;
        post.module_type = 2;
        post.rec_id = id;
        post.type = type;
        post.token = $scope.$root.token;

        var postUrl = $scope.$root.pr + "srm/srm/add-list-contact-location";
        $http
            .post(postUrl, post)
            .then(function (ress) {
                if (type == 1)
                    angular.element('#popup_add_location').modal('hide');
                else
                    angular.element('#popup_add_location2').modal('hide');

                //if (ress.data.ack == true)    toaster.pop('success', "Info", $scope.$root.getErrorMessageByCode(101));
            }).catch(function (e) {
                throw new Error(e.data);
            });
    }

    $scope.addAltlocationfromGeneral = function (rec) {
        $scope.addLocdata = {};

        var rec2 = {};
        // rec2.token = $scope.$root.token;
        rec2.contact_name = rec.contact_person;
        rec2.is_primary = 1;
        rec2.depot = rec.name;//'General Location'; //$scope.rec.contact_person;//
        rec2.role = rec.job_title;
        rec2.phone = rec.phone;
        rec2.email = rec.email;
        rec2.is_primary = 1;
        rec2.is_general = 0;
        rec2.module_type = $rootScope.SRMType;

        rec2.address = rec.address_1;
        rec2.address_2 = rec.address_2;
        rec2.city = rec.city;
        rec2.county = rec.county;
        rec2.postcode = rec.postcode;
        rec2.alt_loc_id = rec.alt_loc_id;
        rec2.acc_id = $scope.$root.srm_id;
        rec2.country = ($scope.drp.country_id != undefined && $scope.drp.country_id != '') ? $scope.drp.country_id.id : 0;

        if (angular.element('#genis_billing_address').is(':checked') == false)
            rec2.is_billing_address = 0;
        else rec2.is_billing_address = 1;

        if (angular.element('#genis_delivery_collection_address').is(':checked') == false)
            rec2.is_delivery_collection_address = 0;
        else rec2.is_delivery_collection_address = 1;

        if (angular.element('#genis_invoice_address').is(':checked') == false)
            rec2.is_invoice_address = 0;
        else rec2.is_invoice_address = 1;

        rec2.social_media_arr_contact = $scope.socialMediasContactGeneral.SRMprimaryContactSM;
        $scope.addLocdata = rec2;
    }



    $scope.add_status_history = function (id, rec) {
        var excUrl = $scope.$root.pr + "srm/srm/add-status-log";
        var post = {};
        post.id = id;
        post.status_id = rec.status;
        post.token = $scope.$root.token;
        $http
            .post(excUrl, post)
            .then(function (res) { });
    }


    // get assigned location listings assigned to primary contact.
    $scope.getGenAssinLoc = function (primaryContID) {

        $scope.page_title = "Assigned Locations";

        $scope.loc_columns = [];
        $scope.locationRecord = {};

        var ApiAjax = $scope.$root.sales + "crm/crm/get-PrimaryContact-Loc-Assign";
        $scope.postData = {
            'primaryc_id': primaryContID,
            'acc_id': $stateParams.id,
            'token': $scope.$root.token
        }

        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res) {
                $scope.loc_columns = [];
                $scope.locationRecord = {};

                if (res.data.ack == true) {
                    $scope.locationRecord = res.data.response;

                    angular.forEach($scope.locationRecord[0], function (val, index) {
                        if (index != 'chk' && index != 'id') {
                            $scope.loc_columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }
                    });

                    $scope.loadingprimaryLocModal = false;
                    angular.element('#primaryAssignedlocmodal').modal({
                        show: true
                    });
                } else
                    $scope.loadingprimaryLocModal = false;
            });
    }


    /* $scope.addloccaiontiming = function (rec_loc) {
        $scope.rec_loc.acc_id = $scope.$root.srm_id;
        $scope.rec_loc.rec_loc_location_id = $scope.rec_loc.id;
        $scope.rec_loc.module_type = 2;
        var postUrl = $scope.$root.pr + "srm/srm/add-location-time";

        $http
            .post(postUrl, $scope.rec_loc)
            .then(function (ress) {
                // if (ress.data.ack == true)    toaster.pop('success', "Info", $scope.$root.getErrorMessageByCode(101));
            });
    } */

    $scope.clearSearchAreas = function () {
        $scope.searchAreas = {};
        $scope.record_areas = {};
    }



    $scope.crm_social_medias = [];
    $scope.columns_crm_social = [];
    $scope.crmMediaForm = {};
    $scope.socialForm = {};
    $scope.isSocialFormValid = false;
    $scope.crm_media_form = false;

    $scope.showCrmMediaForm = function () {
        $scope.crm_media_form = true;
        $scope.crmMediaForm = {};
        $scope.get_social_media_list();
    };

    $scope.hideCrmMediaForm = function () {
        $scope.crm_media_form = false;
        $scope.crmMediaForm = {};
    };

    $scope.get_social_media_list = function () {

        var urlCRMSocialMedias = $scope.$root.pr + "srm/srm/get-social-media";
        $scope.social_medias = [];
        $http
            .post(urlCRMSocialMedias, {
                'token': $scope.$root.token
            })
            .then(function (res) {

                if (res.data.ack == true) {

                    $scope.social_medias = res.data.response;
                    if ($scope.user_type == 1)
                        $scope.social_medias.push({
                            'id': '-1',
                            'name': '++ Add New ++'
                        });
                }
            });
    };

    $scope.add_social_media_popup = function (media, arg) {
        $scope.isSocialValid = true;
        var id = media.id;
        if (id > 0)
            return false;

        $scope.socialForm = {};
        ngDialog.openConfirm({
            template: 'app/views/crm/social_media.html',
            className: 'ngdialog-theme-default-custom-large',
            scope: $scope
        }).then(function (socialForm) {

            socialForm.token = $scope.$root.token;
            var postUrl = $scope.$root.pr + "srm/srm/add-social-media";
            $scope.isSocialValid = true;
            if ($scope.socialForm.name == undefined) {
                toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(552));
                return false;
            }


            $http
                .post(postUrl, socialForm)
                .then(function (ress) {
                    if (ress.data.ack == true) {
                        toaster.pop('success', "Info", $scope.$root.getErrorMessageByCode(101));
                        $scope.get_social_media_list();
                        angular.forEach($scope.social_medias, function (obj, index) {
                            if (obj.id == ress.data.id) {
                                if (arg == 1) $scope.crmMediaForm.media = $scope.social_medias[index];
                                else if (arg == 2) $scope.altContactMediaForm.media = $scope.social_medias[index];

                            }
                        });

                    } else toaster.pop('error', 'Info', ress.data.error);

                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };


    $scope.get_crm_social_media_list = function () {

        var urlCRMSocialMedias = $scope.$root.pr + "srm/srm/get-srm-social-media";
        $http
            .post(urlCRMSocialMedias, {
                'token': $scope.$root.token,
                'srm_id': $scope.$root.srm_id
            })
            .then(function (res) {
                if (res.data.response == undefined)
                    return;
                $scope.columns_crm_social = [];
                $scope.crm_social_medias = res.data.response;
                angular.forEach(res.data.response[0], function (val, index) {
                    $scope.columns_crm_social.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                });
                //    console.log($scope.columns_crm_social);

            });

    };

    $scope.add_crm_social_media = function () {
        $scope.crmMediaForm.token = $scope.$root.token;
        $scope.crmMediaForm.srm_id = $scope.$root.srm_id;
        $scope.crmMediaForm.media_id = ($scope.crmMediaForm.media != undefined) ? $scope.crmMediaForm.media.id : '';

        if ($scope.crmMediaForm.media_id == "" || $scope.crmMediaForm.address == undefined || $scope.crmMediaForm.address == "") {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(104));
        } else {
            var postUrl = $scope.$root.pr + "srm/srm/add-srm-social-media";
            $http
                .post(postUrl, $scope.crmMediaForm)
                .then(function (ress) {
                    if (ress.data.ack == true) {
                        toaster.pop('success', "Info", $scope.$root.getErrorMessageByCode(101));
                        $scope.get_crm_social_media_list();
                        $scope.crm_media_form = false;
                    } else {
                        toaster.pop('error', 'Info', ress.data.error);
                    }
                });
        }
    };

    $scope.delete_crm_social_media = function (id) {

        var postUrl = $scope.$root.pr + "srm/srm/delete-srm-social-media";
        $http
            .post(postUrl, {
                'id': id,
                'token': $scope.$root.token
            })
            .then(function (ress) {
                if (ress.data.ack == true) {
                    toaster.pop('success', "Add", $scope.$root.getErrorMessageByCode(103));
                    $scope.get_crm_social_media_list();
                } else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(108));
                }
            });
    };
    /////// End SRM Social Media///////////


    $scope.checkMediaValue = function () {
        if ($scope.socialForm.name != "") {
            $scope.isSocialFormValid = true;
        } else {
            $scope.isSocialFormValid = false;
        }
    };

    //////// Alt-Contact Social Media////////

    $scope.alt_contact_social_medias = [];
    $scope.columns_alt_contact_social = [];
    // $scope.social_medias = [];
    $scope.altContactMediaForm = {};
    $scope.socialForm = {};
    $scope.isSocialFormValid = false;
    $scope.alt_contact_media_form = false;

    $scope.showAltContactMediaForm = function () {
        $scope.alt_contact_media_form = true;
        $scope.altContactMediaForm = {};
        $scope.get_social_media_list();
    };

    $scope.hideAltContactMediaForm = function () {
        $scope.alt_contact_media_form = false;
        $scope.altContactMediaForm = {};
    };

    ////////// End Alt. Contact Social Media//


    $scope.selected_count = 0;
    $scope.searchKeyword_purch = {};


    $scope.checkAll_del_list = function () {

        var bool = angular.element("#selecctall").is(':checked');
        if (!bool)
            angular.element('.pic_block_del_list').attr("disabled", true);
        else
            angular.element('.pic_block_del_list').attr("disabled", false);

        //  alert(bool);
        angular.forEach($scope.selection_record_del, function (item) {
            angular.element('#selected__del' + item.id).prop('checked', bool);
        });
    };

    $scope.checksingle_del_list_edit = function (classname) {
        angular.element('.pic_block_del_list').attr("disabled", false);

        angular.element(".new_button_" + classname).hide();
        angular.element(".replace_button_" + classname).show();
        var count = 0;
        angular.forEach($scope.selection_record_del, function (item) {
            //  angular.element('#selected_'+item.id).click();
            // if (item.price != null || $scope.getDiscountOnValue()) {
            //var bool = document.getElementById("selected_" + item.id).checked;
            var bool = angular.element("#selected__del" + item.id).is(':checked');
            if (bool) count++;
            else angular.element('#selecctall').prop('checked', false);
        });

    };

    $scope.calculate_total_del_list = function () {
        var count = 0;
        angular.forEach($scope.selection_record_del, function (value) {
            if (angular.element('#selected__del' + value.id).prop('checked'))
                count++;
        });

        if (count != 0) {
            angular.element('#from_selected').hide();
            angular.element('#from_ch_selected').show();
        } else {
            angular.element('#from_selected').show();
            angular.element('#from_ch_selected').hide();
        }

        return count;
    };


    $scope.items = [];
    $scope.new_list = false;
    $scope.save_list = true;

    $scope.getItems = function () {

        $scope.new_list = false;
        $scope.save_list = true;
        if ($scope.items.length == 0) {

            var prodApi = $scope.$root.hr + "employee/listings";
            var postData = {
                'token': $scope.$root.token,
                'all': "1",
            };
            $http
                .post(prodApi, postData)
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.items = [];
                        var purchasedCodeId = "";
                        var purchasedCodes = [];

                        if ($scope.rec.purchase_code_id) {
                            purchasedCodeId = $scope.rec.purchase_code_id;
                            if (purchasedCodeId != "") {
                                purchasedCodes = purchasedCodeId.split(',');
                            }
                        }

                        angular.forEach(res.data.response, function (obj) {
                            obj.chk = false;
                            for (var i = 0; i < purchasedCodes.length; i++) {
                                if (obj.id == purchasedCodes[i]) {
                                    obj.chk = true;
                                }
                            }
                            $scope.items.push(obj);
                        });

                    } else
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                });
        }
        ngDialog.openConfirm({
            template: 'app/views/srm/_listing_employee_modal.html',
            className: 'ngdialog-theme-default',
            scope: $scope,
            size: 'lg'
        }).then(function (result) {
            //   document.getElementById("display_record").innerHTML ='';

            $scope.selectedList = $scope.items.filter(function (namesDataItem) {
                return namesDataItem.Selected;
            });

            var test_name = '';
            var test_id = '';
            var customer_price = '';
            var discount_type = '';
            angular.forEach($scope.selectedList, function (obj) {
                for (var i = 0; i < $scope.items.length; i++) {
                    var object = $scope.items[i];
                    if (object.first_name == obj.first_name) {
                        test_name += obj.first_name + ",";
                    }

                    if (object.id == obj.id) {
                        test_id += obj.id + ",";
                    }
                }
                $scope.rec.purchase_code = test_name;
                $scope.rec.purchase_code_id = test_id;
            });

            console.log($scope.rec.purchase_code);

        }, function (reason) {
            // console.log('Modal promise rejected. Reason: ', reason);
        });
    };

    angular.element(document).on('click', '#checkAll', function () {
        if (angular.element('#checkAll').is(':checked') == true) {
            for (var i = 0; i < $scope.items.length; i++) {
                $scope.items[i].chk = true;
            }
        } else {
            for (var i = 0; i < $scope.items.length; i++) {
                $scope.items[i].chk = false;
            }
        }
        $scope.$root.$apply(function () {
            $scope.items;
        })
    });


    //--------------------- end General   ------------------------------------------

    //--------------------- assign general fields to contact and location tabs start   ------------------------------------------

    $scope.isCheced = false;

    $scope.sameAsGeneral = function (type) {
        //console.log(type);

        if ($scope.isCheced == false) {
            if (type == "contact") {
                $scope.rec_contact.location = 'Main office';
                $scope.rec_contact.address_1 = $scope.rec.address_1;
                $scope.rec_contact.address_2 = $scope.rec.address_2;
                $scope.rec_contact.city = $scope.rec.city;
                $scope.rec_contact.county = $scope.rec.county;
                $scope.rec_contact.postcode = $scope.rec.postcode;
                angular.forEach($rootScope.country_type_arr, function (elem) {
                    if (elem.id == $scope.drp.country_id.id)
                        $scope.rec_contact.country_id = elem;
                });

            } else if (type == "loc") {
                $scope.rec_location.contact_name = $scope.rec.contact_person;
                $scope.rec_location.role = $scope.rec.job_title;
                $scope.rec_location.direct_line = $scope.rec.direct_line;
                $scope.rec_location.mobile = $scope.rec.mobile;
                $scope.rec_location.telephone = $scope.rec.phone;
                $scope.rec_location.fax = $scope.rec.fax;
                $scope.rec_location.email = $scope.rec.email;
            }
            $scope.isCheced = true;
        } else {
            if (type == "contact") {
                $scope.rec_contact.location = null;
                $scope.rec_contact.address_1 = null;
                $scope.rec_contact.address_2 = null;
                $scope.rec_contact.city = null;
                $scope.rec_contact.county = null;
                $scope.rec_contact.postcode = null;
                $scope.rec_contact.country_id = "";
            } else if (type == "loc") {
                $scope.rec_location.contact_name = null;
                $scope.rec_location.role = null;
                $scope.rec_location.direct_line = null;
                $scope.rec_location.mobile = null;
                $scope.rec_location.telephone = null;
                $scope.rec_location.fax = null;
                $scope.rec_location.email = null;
            }
            $scope.isCheced = false;
        }
    }

    //--------------------- assign general fields to contact and location tabs end   ------------------------------------------
    // ---------------- Contact   	 -----------------------------------------

    $scope.general_contact = function () {
        // $scope.$root.breadcrumbs[3].name = 'Contact';

        $scope.altContacListingShow = true;
        $scope.altContacFormShow = false;

        $scope.showLoader = true;
        //$scope.check_readonly = true;  

        var API = $scope.$root.pr + "srm/srm/alt-contacts";
        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'acc_id': $scope.$root.srm_id,
            'page': $scope.item_paging.spage,
            //'country_keyword': angular.element('#search_sale_listing_data').val()
        };
        $http
            .post(API, $scope.postData)
            .then(function (res) {

                $scope.contact_data = [];
                $scope.columns = [];
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;


                    $scope.contact_data = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    $scope.showLoader = false;
                }
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400)); 
            });

        $scope.showLoader = false;
    }

    $scope.check_readonly_contact = true;
    $scope.gotoeditcontact = function () {
        $scope.check_readonly_contact = false;
    }

    $scope.rec_contact = {};
    $scope.contact_add_Form = function () {
        $scope.rec_contact = {};

        //	$scope.rec.contact_name='';
        $scope.check_readonly_contact = false;
        $scope.altContacFormShow = true;
        $scope.altContacListingShow = false;
    }

    $scope.add_srm_contact = function (rec_contact) {
        // rec.country = $scope.alt_country_id != undefined?$scope.alt_country_id.id:0;
        $scope.rec_contact.srm_id = $scope.$root.srm_id;
        $scope.rec_contact.token = $scope.$root.token;
        var altAddUrl = $scope.$root.pr + "srm/srm/add-alt-contact";
        if ($scope.rec_contact.id != undefined)
            var altAddUrl = $scope.$root.pr + "srm/srm/update-alt-contact";

        //console.log(rec_contact); return;
        $scope.rec_contact.country_id = $scope.rec_contact.country_id != undefined ? $scope.rec_contact.country_id.id : 0;
        $http
            .post(altAddUrl, $scope.rec_contact)
            .then(function (res) {

                if (res.data.ack == true) {
                    $scope.general_contact();

                    if ($scope.rec_contact.id > 0)
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    else {
                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                    }
                } else {
                    if ($scope.rec_contact.id > 0)
                        toaster.pop('error', 'Edit', res.data.error);
                    else
                        toaster.pop('error', 'Info', res.data.error);
                }
            });
    };

    $scope.editcontactForm = function (id) {
        $scope.check_readonly_contact = true;

        $scope.altContacFormShow = true;
        $scope.altContacListingShow = false;


        var altcontUrl = $scope.$root.pr + "srm/srm/get-alt-contact-by-id";
        var postViewData = {
            'token': $scope.$root.token,
            'id': id
        };
        $scope.showLoader = true;

        $http
            .post(altcontUrl, postViewData)
            .then(function (res) {
                $scope.rec_contact = {};
                $scope.rec_contact = res.data.response;

                $scope.rec_contact.rec_contact_id = res.data.response.id;

                angular.forEach($rootScope.country_type_arr, function (elem) {
                    if (elem.id == res.data.response.country_id)
                        $scope.rec_contact.country_id = elem;
                });
                $scope.showLoader = false;
            });
        $scope.showLoader = false;
    };

    /*  $scope.deletecontact = function (id, index, arr_data) {
         var delUrl = $scope.$root.pr + "srm/srm/delete-alt-contact";
         ngDialog.openConfirm({
             template: 'modalDeleteDialogId',
             className: 'ngdialog-theme-default-custom'
         }).then(function (value) {
             $http
                 .post(delUrl, {
                     id: id,
                     'token': $scope.$root.token
                 })
                 .then(function (res) {
                     if (res.data.ack == true) {
                         toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                         $timeout(function () {
                             $scope.getAltContacts();
                         }, 1500)
                     } else {
                         toaster.pop('error', 'Deleted', 'Record cannot be deleted.');
                     }
                 });
         }, function (reason) {
             console.log('Modal promise rejected. Reason: ', reason);
         });
 
     };
  */
    //---------------- Contact    ------------------------


    // ---------------- Location   	 -----------------------------------------

    $scope.gotoeditlocation = function () {
        $scope.location_check_readonly = false;
    }

    $scope.location_check_readonly = true;
    $scope.rec_location = {};
    $scope.general_location = function () {
        // $scope.$root.breadcrumbs[3].name = 'Location';
        $scope.showLoader = true;
        $scope.location_data = [];
        $scope.columns = [];
        //$scope.check_readonly = true;  ,
        //'country_keyword': angular.element('#search_sale_listing_data').val()

        var API = $scope.$root.pr + "srm/srm/alt-depots";
        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.item_paging.spage
        };
        $http
            .post(API, $scope.postData)
            .then(function (res) {



                $scope.altDepotListingShow = true;
                $scope.altDepotFormShow = false;

                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;


                    $scope.location_data = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    $scope.showLoader = false;
                }
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400)); 
            });

        $scope.showLoader = false;
    };

    $scope.location_add_Form = function () {
        $scope.location_check_readonly = false;
        $scope.altDepotListingShow = false;
        $scope.altDepotFormShow = true;
        $scope.rec_location = {};

    };

    $scope.add_srm_location = function (rec_location1) {

        $scope.rec_location.srm_id = $scope.$root.srm_id;
        $scope.rec_location.token = $scope.$root.token;
        var altAddUrl = $scope.$root.pr + "srm/srm/add-alt-depot";

        if ($scope.rec_location.id != undefined)
            var altAddUrl = $scope.$root.pr + "srm/srm/update-alt-depot";

        //console.log(rec); return;
        $scope.rec_location.country_id = $scope.rec_location.country_id != undefined ? $scope.rec_location.country_id.id : 0;
        $http
            .post(altAddUrl, $scope.rec_location)
            .then(function (res) {
                //	$scope.$root.count = $scope.$root.count+1;
                if (res.data.ack == true) {

                    if ($scope.rec_location.id > 0)
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    else {
                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                    }
                    $scope.general_location();

                } else {
                    if ($scope.rec_location.id > 0)
                        toaster.pop('error', 'Edit', res.data.error);
                    //toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(105));
                    else
                        toaster.pop('error', 'Info', res.data.error);

                }
            });
    };

    $scope.editlocationForm = function (id) {


        $scope.location_check_readonly = true;
        $scope.altDepotFormShow = true;
        $scope.altDepotListingShow = false;
        $scope.rec_location = {};
        $scope.showLoader = true;

        var altcontUrl = $scope.$root.pr + "srm/srm/get-alt-depot-by-id";
        var postViewData = {
            'token': $scope.$root.token,
            'id': id
        };

        $http
            .post(altcontUrl, postViewData)
            .then(function (res) {
                $scope.rec_location = res.data.response;
                $scope.rec_location.id = res.data.response.id;

                angular.forEach($rootScope.country_type_arr, function (elem) {
                    if (elem.id == res.data.response.country_id)
                        $scope.rec_location.country_id = elem;
                });
            });
        $scope.showLoader = false;
    };

    $scope.deletelocation = function (id, index, arr_data) {
        var delUrl = $scope.$root.pr + "srm/srm/delete-alt-depot";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };


    //---------------- Location    ------------------------


    // ---------------- Shipping   	 -----------------------------------------

    $scope.getArea = function (arg, show_id) {
        $scope.titile_2 = 'Area';
        $scope.title = 'Area';
        //	var empUrl = $scope.$root.pr+"supplier/supplier/get-coverage-all-areas"; 
        if (arg == 'sale_full')
            var empUrl = $scope.$root.pr + "srm/srm/get-coverage-all-areas";
        else if (arg == 'sale_half')
            var empUrl = $scope.$root.pr + "srm/srm/get-selected-area";
        $http
            .post(empUrl, {
                'token': $scope.$root.token,
                'id': $scope.$root.srm_id
            })
            .then(function (res) {
                if (res.data.ack == true) {

                    $scope.record_ship = {};
                    $scope.columns_ship = [];
                    $scope.record_ship = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_ship.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    $scope.record = {};
                    $scope.columnss = [];
                    $scope.total = 0;
                    $scope.record = res.data.response;
                    $scope.total = res.data.total;
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columnss.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

            });

        if (arg == 'sale_full') {

            ngDialog.openConfirm({
                template: 'modalSaleDialogId',
                // templateUrl: 'app/views/_listing_modal.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            }).then(function (result) {

                if (arg == 'sale_full') {

                    $scope.selectedList = $scope.record.filter(function (namesDataItem) {
                        return namesDataItem.Selected;
                    });
                    var test_name = '';
                    var test_id = '';
                    var customer_price = '';
                    angular.forEach($scope.selectedList, function (obj) {

                        for (var i = 0; i < $scope.record.length; i++) {
                            var object = $scope.record[i];
                            if (object.name == obj.name) {
                                test_name += obj.name + ",";
                            }

                            if (object.id == obj.id) {
                                test_id += obj.id + ",";
                            }
                        }

                        document.getElementById("display_area_record").innerHTML = test_name.substring(0, test_name.length - 1);
                        $scope.rec.coverage_area = test_name;
                        $scope.rec.coverage_area_id = test_id;

                    });
                }
            },
                function (reason) {
                    console.log('Modal promise rejected. Reason: ', reason);
                });
        } else if (arg == 'sale_half') {

            ngDialog.openConfirm({
                template: 'app/views/srm/_listing_employee.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            }).then(function (result) {

                if (show_id == 1) {
                    $scope.rec_area.valid_from = result.name;
                    $scope.rec_area.valid_from_id = result.id;
                }
                if (show_id == 2) {
                    $scope.rec.valid_to = result.name;
                    $scope.rec.valid_to_id = result.id;
                }
            },
                function (reason) {
                    console.log('Modal promise rejected. Reason: ', reason);
                });

        }


    }


    $scope.calculateChecked = function () {
        var count = 0;
        //item.Selected
        angular.forEach($scope.record, function (value) {
            //  console.log(value.Selected);
            if (value.Selected)
                count++;
        });

        return count;
    };

    //Area
    $scope.area = {};
    $scope.area.spage = 1;
    $scope.resetKeyword = function () {
        angular.element('#search_area_data').val('');
    };
    $scope.resetSaleKeyword = function () {
        angular.element('#search_sale_area_data').val('');
    };
    $scope.setSelectPage = function (pageno) {
        $scope.area.spage = pageno;
    };
    $scope.get_shipping_agent = function () {

        $scope.title = "Areas";
        $scope.showShipLoader = true;
        $scope.ship_sale_areas = [];
        $scope.checkedsale = 0;
        $scope.shipinglistingShow = true;
        $scope.shipinglistingShowForm = true;
        $scope.customers_list = true;
        $scope.btnCancelUrl = 'app.get_shipping_agent';


        var prodApi = $scope.$root.pr + "srm/srm/srm-areas";;
        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.area.spage,
            'keyword': angular.element('#search_area_data').val()
        };
        $http
            .post(prodApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {

                    $scope.area.total_pages = res.data.total_pages;
                    $scope.area.cpage = res.data.cpage;
                    $scope.area.ppage = res.data.ppage;
                    $scope.area.npage = res.data.npage;
                    $scope.area.pages = res.data.pages;

                    $scope.ship_data = [];
                    $scope.ship_column = [];

                    $scope.ship_data = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.ship_column.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    $scope.showShipLoader = false;

                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });


    };

    $scope.areas_tab = "country";
    $scope.areas_listing_tab = "country";

    $scope.areas_country = {};
    $scope.ship_data_country = [];
    $scope.ship_column_country = [];
    $scope.setCountrySelectPage = function (pageno) {
        $scope.areas_country.spage = pageno;
    };
    $scope.checkAllCountries = function () {
        if (angular.element('#checkAllCountries').is(':checked')) {
            angular.forEach($scope.ship_data_country, function (val, index) {
                if (!angular.element('#shipping_country_' + $scope.ship_data_country[index].id).is(':checked')) {
                    angular.element('#shipping_country_' + $scope.ship_data_country[index].id).prop('checked', true);
                }
            });
        } else {
            angular.forEach($scope.ship_data_country, function (val, index) {
                if (angular.element('#shipping_country_' + $scope.ship_data_country[index].id).is(':checked')) {
                    angular.element('#shipping_country_' + $scope.ship_data_country[index].id).prop('checked', false);
                }
            });
        }
    };


    $scope.areas_region = {};
    $scope.ship_data_region = [];
    $scope.ship_column_region = [];
    $scope.setRegionSelectPage = function (pageno) {
        $scope.areas_region.spage = pageno;
    };
    $scope.checkAllRegions = function () {
        if (angular.element('#checkAllRegions').is(':checked')) {
            angular.forEach($scope.ship_data_region, function (val, index) {
                if (!angular.element('#shipping_region_' + $scope.ship_data_region[index].id).is(':checked')) {
                    angular.element('#shipping_region_' + $scope.ship_data_region[index].id).prop('checked', true);
                }
            });
        } else {
            angular.forEach($scope.ship_data_region, function (val, index) {
                if (angular.element('#shipping_region_' + $scope.ship_data_region[index].id).is(':checked')) {
                    angular.element('#shipping_region_' + $scope.ship_data_region[index].id).prop('checked', false);
                }
            });
        }
    };
    $scope.get_regions_shipping_agent = function () {
        $scope.areas_tab = "region";
        $scope.title = "Regions";
        $scope.showShipLoader = true;
        $scope.ship_sale_areas = [];
        $scope.checkedsale = 0;

        var prodApi = $scope.$root.pr + "srm/srm/srm-regions";

        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.areas_region.spage,
            'region_keyword': angular.element('#search_sale_add_listing_data').val()
        };
        $http
            .post(prodApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {

                    $scope.areas_region.total_pages = res.data.total_pages;
                    $scope.areas_region.cpage = res.data.cpage;
                    $scope.areas_region.ppage = res.data.ppage;
                    $scope.areas_region.npage = res.data.npage;
                    $scope.areas_region.pages = res.data.pages;

                    $scope.ship_data_region = [];
                    $scope.ship_column_region = [];

                    $scope.ship_data_region = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.ship_column_region.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.forEach(res.data.regions, function (val, index) {
                        angular.element('#shipping_region_' + res.data.regions[index]).prop('checked', true);
                    });
                    $scope.showShipLoader = false;

                } else {

                    $scope.areas_region = {};
                    $scope.ship_data_region = [];
                    $scope.ship_column_region = [];
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });
        $scope.showShipLoader = false;

    };

    $scope.areas_county = {};
    $scope.ship_data_county = [];
    $scope.ship_column_county = [];

    $scope.setCountySelectPage = function (pageno) {
        $scope.areas_county.spage = pageno;
    };

    $scope.checkAllCounties = function () {
        if (angular.element('#checkAllCounties').is(':checked')) {
            angular.forEach($scope.ship_data_county, function (val, index) {
                if (!angular.element('#shipping_county_' + $scope.ship_data_county[index].id).is(':checked')) {
                    angular.element('#shipping_county_' + $scope.ship_data_county[index].id).prop('checked', true);
                }
            });
        } else {
            angular.forEach($scope.ship_data_county, function (val, index) {
                if (angular.element('#shipping_county_' + $scope.ship_data_county[index].id).is(':checked')) {
                    angular.element('#shipping_county_' + $scope.ship_data_county[index].id).prop('checked', false);
                }
            });
        }
    };

    $scope.get_county_shipping_agent = function () {
        $scope.areas_tab = "county";
        $scope.title = "Counties";
        $scope.showShipLoader = true;
        $scope.ship_sale_areas = [];
        $scope.checkedsale = 0;

        var prodApi = $scope.$root.pr + "srm/srm/srm-counties";

        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.areas_county.spage,
            'county_keyword': angular.element('#search_sale_add_listing_data').val()
        };
        $http
            .post(prodApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {

                    $scope.areas_county.total_pages = res.data.total_pages;
                    $scope.areas_county.cpage = res.data.cpage;
                    $scope.areas_county.ppage = res.data.ppage;
                    $scope.areas_county.npage = res.data.npage;
                    $scope.areas_county.pages = res.data.pages;

                    $scope.ship_data_county = [];
                    $scope.ship_column_county = [];

                    $scope.ship_data_county = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.ship_column_county.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    angular.forEach(res.data.counties, function (val, index) {
                        angular.element('#shipping_county_' + res.data.counties[index]).prop('checked', true);
                    });

                    $scope.showShipLoader = false;

                } else {
                    $scope.areas_county = {};
                    $scope.ship_data_county = [];
                    $scope.ship_column_county = [];
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });

        $scope.showShipLoader = false;
    };

    $scope.areas_area = {};
    $scope.ship_data_area = [];
    $scope.ship_column_area = [];

    $scope.setAreaSelectPage = function (pageno) {
        $scope.areas_area.spage = pageno;
    };

    $scope.checkAllAreas = function () {
        if (angular.element('#checkAllAreas').is(':checked')) {
            angular.forEach($scope.ship_data_area, function (val, index) {
                if (!angular.element('#shipping_area_' + $scope.ship_data_area[index].id).is(':checked')) {
                    angular.element('#shipping_area_' + $scope.ship_data_area[index].id).prop('checked', true);
                }
            });
        } else {
            angular.forEach($scope.ship_data_area, function (val, index) {
                if (angular.element('#shipping_area_' + $scope.ship_data_area[index].id).is(':checked')) {
                    angular.element('#shipping_area_' + $scope.ship_data_area[index].id).prop('checked', false);
                }
            });
        }
    };

    $scope.get_area_shipping_agent = function () {
        $scope.areas_tab = "area";
        $scope.title = "Areas";
        $scope.showShipLoader = true;

        var prodApi = $scope.$root.pr + "srm/srm/srm-areas1";

        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.areas_area.spage,
            'name_keyword': angular.element('#search_sale_add_listing_data').val()
        };
        $http
            .post(prodApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {

                    $scope.areas_area.total_pages = res.data.total_pages;
                    $scope.areas_area.cpage = res.data.cpage;
                    $scope.areas_area.ppage = res.data.ppage;
                    $scope.areas_area.npage = res.data.npage;
                    $scope.areas_area.pages = res.data.pages;

                    $scope.ship_data_area = [];
                    $scope.ship_column_area = [];

                    $scope.ship_data_area = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.ship_column_area.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.forEach(res.data.areas, function (val, index) {
                        angular.element('#shipping_area_' + res.data.areas[index]).prop('checked', true);
                    });

                    $scope.showShipLoader = false;

                } else {
                    $scope.areas_area = {};
                    $scope.ship_data_area = [];
                    $scope.ship_column_area = [];
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });

        $scope.showShipLoader = false;
    };

    $scope.sale_area = {};
    $scope.sale_area.spage = 1;

    $scope.setSaleSelectPage = function (pageno) {
        $scope.sale_area.spage = pageno;
    };


    $scope.get_sale_shipping_agent = function () {

        $scope.showLoader = true;
        $scope.ship_sale_areas = [];
        $scope.checkedsale = 0;

        // $scope.$root.breadcrumbs[3].name = 'Shipping Areas';

        $scope.shipinglistingShow = true;
        $scope.shipinglistingShowForm = true;
        $scope.customers_list = true;
        $scope.btnCancelUrl = 'app.get_shipping_agent';


        var prodApi = $scope.$root.pr + "srm/srm/srm-sale-areas";

        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.sale_area.spage,
            'keyword': angular.element('#search_sale_area_data').val()
        };
        $http
            .post(prodApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {

                    $scope.sale_area.total_pages = res.data.total_pages;
                    $scope.sale_area.cpage = res.data.cpage;
                    $scope.sale_area.ppage = res.data.ppage;
                    $scope.sale_area.npage = res.data.npage;
                    $scope.sale_area.pages = res.data.pages;

                    $scope.ship_sale_data = [];
                    $scope.ship_sale_column = [];

                    $scope.ship_sale_data = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.ship_sale_column.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    $scope.showLoader = false;

                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });


    };

    $scope.ship_sale_areas = [];
    $scope.checkedsale = 0;

    $scope.selectSaleItem = function (obj) {

        if (angular.element('#shipping_area_' + obj.id).is(':checked')) {
            $scope.ship_sale_areas.push({
                'id': obj.id,
                'postcode': obj.postcode,
                'name': obj.name,
                'county': obj.county,
                'nuts_region': obj.nuts_region,
                'country': obj.country
            });
            $scope.checkedsale += 1;
        } else {
            var ship_areas = $scope.ship_sale_areas;
            for (var i = 0; i < ship_areas.length; i += 1) {
                if (ship_areas[i]['id'] == obj.id) {
                    $scope.checkedsale -= 1;
                    $scope.ship_sale_areas.splice(i, 1);
                }
            }
        }

    };

    $scope.addSaleAreas = function () {
        var prodApi = $scope.$root.pr + "srm/srm/srm-add-sale-areas";

        var postData = {
            'token': $scope.$root.token,
            'srm_id': $scope.$root.srm_id,
            'data': $scope.ship_sale_areas
        };
        $http
            .post(prodApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $scope.checkedsale = 0;
                    angular.element('#modalAreas').modal('hide');
                    $scope.get_sale_shipping_agent();
                } else {
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
                }

            });
    };

    $scope.addSaleArea = function (type) {
        var prodApi = $scope.$root.pr + "srm/srm/srm-add-sale-area";
        var areas = [];
        var areas_old = [];
        var message = "";
        if (type == 1) {
            angular.forEach($scope.ship_data_country, function (val, index) {
                if (angular.element('#shipping_country_' + $scope.ship_data_country[index].id).is(':checked')) {
                    areas.push({
                        'id': $scope.ship_data_country[index].id
                    });
                    areas_old.push({
                        'id': $scope.ship_data_country[index].id
                    });
                } else {
                    areas_old.push({
                        'id': $scope.ship_data_country[index].id
                    });
                }
            });
            message = "Countries";
        } else if (type == 2) {
            angular.forEach($scope.ship_data_region, function (val, index) {
                if (angular.element('#shipping_region_' + $scope.ship_data_region[index].id).is(':checked')) {
                    areas.push({
                        'id': $scope.ship_data_region[index].id
                    });
                    areas_old.push({
                        'id': $scope.ship_data_region[index].id
                    });
                } else {
                    areas_old.push({
                        'id': $scope.ship_data_region[index].id
                    });
                }
            });
            message = "Region";
        } else if (type == 3) {
            angular.forEach($scope.ship_data_county, function (val, index) {
                if (angular.element('#shipping_county_' + $scope.ship_data_county[index].id).is(':checked')) {
                    areas.push({
                        'id': $scope.ship_data_county[index].id
                    });
                    areas_old.push({
                        'id': $scope.ship_data_county[index].id
                    });
                } else {
                    areas_old.push({
                        'id': $scope.ship_data_county[index].id
                    });
                }
            });
            message = "County";
        } else if (type == 4) {
            angular.forEach($scope.ship_data_area, function (val, index) {
                if (angular.element('#shipping_area_' + $scope.ship_data_area[index].id).is(':checked')) {
                    areas.push({
                        'id': $scope.ship_data_area[index].id
                    });
                    areas_old.push({
                        'id': $scope.ship_data_area[index].id
                    });
                } else {
                    areas_old.push({
                        'id': $scope.ship_data_area[index].id
                    });
                }
            });
            message = "Area";
        }
        var postData = {
            'token': $scope.$root.token,
            'srm_id': $scope.$root.srm_id,
            'data': areas,
            'data_old': areas_old,
            'type': type
        };
        $http
            .post(prodApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $scope.checkedsale = 0;
                } else {
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
                }

            });
    };

    $scope.deleteSaleArea = function (id) {

        var prodApi = $scope.$root.pr + "srm/srm/srm-delete-sale-area";

        var postData = {
            'token': $scope.$root.token,
            'id': id
        };
        $http
            .post(prodApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Delete', $scope.$root.getErrorMessageByCode(103));
                    $scope.get_sale_shipping_agent();
                } else {
                    toaster.pop('error', 'Delete', $scope.$root.getErrorMessageByCode(104));
                }

            });

    };

    $scope.showAreas = function () {
        angular.element('#modalAreas').modal({
            show: true
        });
    };

    $scope.resetSearch = function (id) {
        angular.element('#' + id).val('');
    };

    $scope.location_id = 0;
    $scope.showSaleLoader = function () {
        $scope.showLocationLoader = true;
        $scope.showLocationLoader = false;
    };

    $scope.get_sale_area = function (locationid) {

        $scope.showPriceLoader = true;

        if (locationid == 1 || locationid == 2) {
            $scope.location_id = locationid;
            $scope.sale_area.spage = 1;
        }
        $scope.title = 'Locations';
        var empUrl = $scope.$root.pr + "srm/srm/srm-sale-areas";

        $http
            .post(empUrl, {
                'token': $scope.$root.token,
                'id': $scope.$root.srm_id,
                'page': $scope.sale_area.spage,
                'keyword': angular.element('#search_sale_price_data').val()
            })
            .then(function (res) {
                if (res.data.ack == true) {

                    $scope.sale_area.total_pages = res.data.total_pages;
                    $scope.sale_area.cpage = res.data.cpage;
                    $scope.sale_area.ppage = res.data.ppage;
                    $scope.sale_area.npage = res.data.npage;
                    $scope.sale_area.pages = res.data.pages;

                    $scope.record_ship = {};
                    $scope.columns_ship = [];
                    $scope.record_ship = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_ship.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });


                    $scope.record = {};
                    $scope.columnss = [];
                    $scope.total = 0;
                    $scope.record = res.data.response;
                    $scope.total = res.data.total;
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columnss.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    if (locationid == 1 || locationid == 2) {
                        ngDialog.openConfirm({
                            template: 'app/views/srm/_listing_location.html',
                            className: 'ngdialog-theme-default',
                            scope: $scope
                        }).then(function (result) {
                            if ($scope.location_id == 1) {
                                $scope.rec_area.valid_from = result.name;
                                $scope.rec_area.valid_from_id = result.id;
                            }
                            if ($scope.location_id == 2) {
                                $scope.rec.valid_to = result.name;
                                $scope.rec.valid_to_id = result.id;
                            }
                        },
                            function (reason) {
                                console.log('Modal promise rejected. Reason: ', reason);
                            });
                    }
                } else {
                    $scope.sale_area = {};
                    $scope.record_ship = {};
                    $scope.columns_ship = [];
                    toaster.pop('error', 'Info', 'Please select area(s) from Area Coverd!');
                }

            });

        $scope.showPriceLoader = false;

    };

    $scope.areas_shipping_country = {};
    $scope.ship_data_countries = [];
    $scope.ship_column_countries = [];

    $scope.setShipCountrySelectPage = function (pageno) {
        $scope.areas_shipping_country.spage = pageno;
        $scope.areas_listing_tab = "country";
    };

    $scope.get_shipping_countries = function () {

        $scope.shipinglistingShow = true;
        $scope.shipinglistingShowForm = true;

        $scope.showLoader = true;
        var prodApi = $scope.$root.pr + "srm/srm/srm-sale-countries";

        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.areas_shipping_country.spage,
            'country_keyword': angular.element('#search_sale_listing_data').val()
        };
        $http
            .post(prodApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {

                    $scope.areas_shipping_country.total_pages = res.data.total_pages;
                    $scope.areas_shipping_country.cpage = res.data.cpage;
                    $scope.areas_shipping_country.ppage = res.data.ppage;
                    $scope.areas_shipping_country.npage = res.data.npage;
                    $scope.areas_shipping_country.pages = res.data.pages;

                    $scope.ship_data_countries = [];
                    $scope.ship_column_countries = [];

                    $scope.ship_data_countries = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.ship_column_countries.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    $scope.showLoader = false;
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });

        $scope.showLoader = false;
    };

    $scope.areas_shipping_region = {};
    $scope.ship_data_regions = [];
    $scope.ship_column_regions = [];

    $scope.setShipRegionSelectPage = function (pageno) {
        $scope.areas_shipping_region.spage = pageno;
        $scope.areas_listing_tab = "region";
    };

    $scope.get_shipping_regions = function () {

        $scope.showLoader = true;

        var prodApi = $scope.$root.pr + "srm/srm/srm-sale-regions";

        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.areas_shipping_region.spage,
            'region_keyword': angular.element('#search_sale_listing_data').val()
        };
        $http
            .post(prodApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {

                    $scope.areas_shipping_region.total_pages = res.data.total_pages;
                    $scope.areas_shipping_region.cpage = res.data.cpage;
                    $scope.areas_shipping_region.ppage = res.data.ppage;
                    $scope.areas_shipping_region.npage = res.data.npage;
                    $scope.areas_shipping_region.pages = res.data.pages;

                    $scope.ship_data_regions = [];
                    $scope.ship_column_regions = [];

                    $scope.ship_data_regions = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.ship_column_regions.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

                $scope.showLoader = false;
            });


    };

    $scope.areas_shipping_county = {};
    $scope.ship_data_counties = [];
    $scope.ship_column_counties = [];

    $scope.setShipCountySelectPage = function (pageno) {
        $scope.areas_shipping_county.spage = pageno;
        $scope.areas_listing_tab = "county";
    };

    $scope.get_shipping_counties = function () {

        $scope.showLoader = true;
        var prodApi = $scope.$root.pr + "srm/srm/srm-sale-counties";

        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.areas_shipping_county.spage,
            'county_keyword': angular.element('#search_sale_listing_data').val()
        };
        $http
            .post(prodApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {

                    $scope.areas_shipping_county.total_pages = res.data.total_pages;
                    $scope.areas_shipping_county.cpage = res.data.cpage;
                    $scope.areas_shipping_county.ppage = res.data.ppage;
                    $scope.areas_shipping_county.npage = res.data.npage;
                    $scope.areas_shipping_county.pages = res.data.pages;

                    $scope.ship_data_counties = [];
                    $scope.ship_column_counties = [];

                    $scope.ship_data_counties = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.ship_column_counties.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

                $scope.showLoader = false;
            });
    };

    $scope.areas_shipping_area = {};
    $scope.ship_data_areas = [];
    $scope.ship_column_areas = [];

    $scope.setShipAreaSelectPage = function (pageno) {
        $scope.areas_shipping_area.spage = pageno;
        $scope.areas_listing_tab = "area";
    };

    $scope.get_shipping_areas = function () {

        $scope.showLoader = true;
        var prodApi = $scope.$root.pr + "srm/srm/srm-saleareas";

        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.areas_shipping_area.spage,
            'name_keyword': angular.element('#search_sale_listing_data').val()
        };
        $http
            .post(prodApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {

                    $scope.areas_shipping_area.total_pages = res.data.total_pages;
                    $scope.areas_shipping_area.cpage = res.data.cpage;
                    $scope.areas_shipping_area.ppage = res.data.ppage;
                    $scope.areas_shipping_area.npage = res.data.npage;
                    $scope.areas_shipping_area.pages = res.data.pages;

                    $scope.ship_data_areas = [];
                    $scope.ship_column_areas = [];

                    $scope.ship_data_areas = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.ship_column_areas.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

                $scope.showLoader = false;
            });
    };

    //Area

    $scope.get_shipping_agent_pre = function () {

        // $scope.$root.breadcrumbs[3].name = 'Shipping';

        $scope.shipinglistingShow = true;
        $scope.shipinglistingShowForm = true;
        $scope.customers_list = true;
        document.getElementById("display_area_record").innerHTML = '';
        $scope.btnCancelUrl = 'app.get_shipping_agent';

        var postUrl = $scope.$root.pr + "srm/srm/srm-shipping";
        $http
            .post(postUrl, {
                'token': $scope.$root.token,
                'id': $scope.$root.srm_id
            })
            .then(function (res) {
                if (res.data.response != null) {
                    $scope.ship_data = [];
                    $scope.ship_column = [];

                    $scope.ship_data = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.ship_column.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
            });
    }

    $scope.add_srm_shipping = function (rec) {

        rec.srm_id = $scope.$root.srm_id;
        rec.token = $scope.$root.token;
        rec.shipping_method = $scope.rec.shipping_methods !== undefined ? $scope.rec.shipping_methods.id : 0;
        rec.price_method = $scope.rec.price_methods !== undefined ? $scope.rec.price_methods.id : 0;

        var altAddUrl = $scope.$root.pr + "srm/srm/add-srm-shipping";

        $http
            .post(altAddUrl, rec)
            .then(function (res) {
                //	$scope.$root.count = $scope.$root.count+1;
                if (res.data.ack == true) {

                    if (rec.id > 0)
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    else {
                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                    }
                    document.getElementById("display_area_record").innerHTML = '';

                    $scope.get_shipping_agent();

                } else {
                    if (rec.id == 0)
                        toaster.pop('error', 'Edit', res.data.error);
                    //toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(105));
                    else
                        toaster.pop('error', 'Info', res.data.error);
                    //toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(105));
                }
            });

    }

    $scope.edit_shipping_Form = function (id) {
        $scope.check_readonly = true;
        $scope.showLoader = true;
        $scope.customers_list = false;

        var altcontUrl = $scope.$root.pr + "srm/srm/get-srm-shipping-by-id";
        var postViewData = {
            'token': $scope.$root.token,
            'id': id
        };

        $http
            .post(altcontUrl, postViewData)
            .then(function (res) {
                $scope.rec = res.data.response;
                $scope.rec.id = res.data.response.id;
                $scope.rec.update_id = res.data.response.id;


                angular.forEach($scope.price_method_list, function (obj) {
                    if (obj.id == res.data.response.price_method) {
                        $scope.rec.price_methods = obj;
                    }
                });

                angular.forEach($scope.shiping_list, function (index, obj) {
                    if (obj.id == res.data.response.shipping_method) {
                        $scope.rec.shipping_methods = obj;
                    }
                });
            });

        $scope.showLoader = false;
    }

    $scope.delete_shipping = function (id, index, arr_data) {
        var delUrl = $scope.$root.pr + "srm/srm/delete-srm-shipping";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    $scope.columns = [];
    $scope.record = {};
    $scope.formData_customer = {};
    $scope.selected = 0;
    $scope.total = 0;
    $scope.selected_count = 0;

    $scope.viewAllCustomers = function (id) {
        $scope.formData_customer = {};
        $scope.title = 'Area';

        angular.element('#model_btn_cs').modal({
            show: true
        });

        var sale_Url = $scope.$root.pr + "srm/srm/get-coverage-all-areas";
        var postData_sale = {
            'token': $scope.$root.token,
            'id': id
        };

        $http
            .post(sale_Url, postData_sale)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.formData_customer.update_id = id;

                    $scope.selection_record = {};
                    $scope.columnss = [];

                    $scope.selection_record = res.data.response;
                    $scope.total = res.data.total;
                    $scope.selected_count = res.data.selected_count;
                    $scope.from_selected = true;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columnss.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.forEach(res.data.response, function (value, key) {
                        if (value.checked == 1)
                            angular.element('#selected_' + value.id).click();
                    });
                }
            });

    }

    $scope.checkAll_cancel = function () {

        var bool = true;
        if ($scope.selectedAll == false) {
            bool = false;
        }
        $scope.from_ch_selected = true;
        $scope.from_selected = false;
        angular.forEach($scope.selection_record, function (item) {

            if (item.Selected == true) {
                item.Selected = false;
            } else {
                item.Selected = bool;
            }
        });
    };

    //add_customer
    $scope.add_customer = function (formData_customer) {

        $scope.selectedList = $scope.selection_record.filter(function (namesDataItem) {
            return namesDataItem.Selected;
        });
        var test_name = '';
        var test_id = '';
        var customer_price = '';
        angular.forEach($scope.selectedList, function (obj) {

            for (var i = 0; i < $scope.selection_record.length; i++) {
                var object = $scope.selection_record[i];
                if (object.name == obj.name) {
                    test_name += obj.name + ",";
                }
                if (object.id == obj.id) {
                    test_id += obj.id + ",";
                }
                if (object.price == obj.price) {
                    customer_price += obj.price + ",";
                }
            }

            document.getElementById("display_record").innerHTML = test_name;
            $scope.formData_customer.coverage_area2 = test_name;
            $scope.formData_customer.coverage_area_id2 = test_id;
            $scope.formData_customer.coverage_price2 = customer_price;
        });

        $scope.formData_customer.product_id = $stateParams.id;
        $scope.formData_customer.token = $scope.$root.token;
        //	console.log(formData_customer);return;

        var updateUrl = $scope.$root.pr + "srm/srm/add-customer";
        $http
            .post(updateUrl, formData_customer)
            .then(function (res) {

                if (res.data.ack == true) {
                    $scope.get_shipping_agent();
                    angular.element('#model_btn_cs').modal('hide');
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));

                } else {
                    toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(105));
                }
            });
    }


    //---------------- Area    ------------------------
    

    /* $scope.get_area = function () {

        //  $scope.get_areas();
        // $scope.$root.breadcrumbs[3].name = 'Area';

        $scope.arealistingShow = true;
        $scope.arealistingShowForm = false;


        $scope.showLoader = true;
        var API = $scope.$root.pr + "srm/srm/srm-area";
        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id
        };
        $http
            .post(API, $scope.postData)
            .then(function (res) {

                $scope.area_data = [];
                $scope.columns = [];
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.area_data = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
                $scope.showLoader = false;
            });
    } */

    $scope.get_covered_country = function () {
        var UrlApi = $scope.$root.pr + "srm/srm/get-covered-country";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
        };
        $http
            .post(UrlApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.area_covered_country = res.data.response;
                }
            });
    }

    $scope.get_offer_methods = function () {
        var offerMethodUrl = $scope.$root.setup + "crm/offer-method-list";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
        };
        $http
            .post(offerMethodUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.$root.arr_offer_method = res.data.response;
                }
            });
    }
        

    $scope.get_areas = function () {

        var areaApi = $scope.$root.pr + "srm/srm/get-covered-areas";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
        };
        $http
            .post(areaApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.columns_areas = [];
                    $scope.record_areas = {};
                    $scope.record_areas = res.data.response;

                    $scope.viewby = 15;
                    $scope.totalItems = $scope.record_areas.length;
                    $scope.currentPage = 1;
                    $scope.itemsPerPage = $scope.viewby;
                    $scope.maxSize = 8; //Number of pager buttons to show

                    angular.forEach(res.data.response[0], function (val, index) {
                        if (isNaN(index)) {
                            $scope.columns_areas.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }
                    });
                    $scope.$root.location_to = res.data.response;
                }
                $scope.showLoader = false;
            });
    }

    //---------------- Area    ------------------------


    // ---------------- Shipping   	 -----------------------------------------

    //ng-click="reload_popup(1,'model_btn_purchase')" //modaladdevent
    $scope.reload_popup = function (div_id, div_model) {

        angular.element('#' + div_model).modal('hide');
        //  $scope.show_p_unit_pop = false;  
        if (div_id == 1) {
            $scope.rec.price_methods = $scope.price_method_list[0];
        } else if (div_id == 2) {
            $scope.rec.shipping_methods = $scope.shiping_list[0];
        } else if (div_id == 3) {
            $scope.rec.offer_method_ids = $scope.price_method_list[0];
        } else if (div_id == 7) {
            $scope.formData.volume_1 = $scope.arr_volume_1[0];
        } else if (div_id == 8) {
            $scope.formData.volume_2 = $scope.arr_volume_2[0];
        } else if (div_id == 9) {
            $scope.formData.volume_3 = $scope.arr_volume_3[0];

        } else if (div_id == 10) {
            $scope.formData.volume_1 = $scope.arr_volume_purchase_1[0];
        } else if (div_id == 11) {
            $scope.formData.volume_2 = $scope.arr_volume_purchase_2[0];
        } else if (div_id == 12) {
            $scope.formData.volume_3 = $scope.arr_volume_purchase_3[0];
        }
    }

    // ------------- 	 add method    	 ----------------------------------------

    $scope.formData6 = {};
    $scope.onChangmethod = function () {

        var id = this.rec.price_methods.id;

        if (id == -1)
            angular.element('#modal_method').modal({
                show: true
            });

        angular.element("#name").val('');
        $scope.name = '';
    }

    $scope.add_method_pop = function (formData6) {

        var addcountriesUrl = $scope.$root.pr + "srm/srm/add-shiping-list";
        $scope.formData6.token = $scope.$root.token;
        $scope.formData6.data = $scope.formFields;
        $http
            .post(addcountriesUrl, formData6)
            .then(function (res) {
                if (res.data.ack == true) {
                    angular.element('#model_method').modal('hide');
                    toaster.pop('success', 'Add', 'Record  Inserted.');
                    angular.element('#modal_method').modal('hide');

                    $http
                        .post(method_url, {
                            'token': $scope.$root.token
                        })
                        .then(function (res) {
                            if (res.data.ack == true) {
                                $scope.price_method_list = res.data.response;
                                if ($scope.user_type == 1) {
                                    $scope.price_method_list.push({
                                        'id': '-1',
                                        'name': '++ Add New ++'
                                    });
                                }

                            }
                            //else 	toaster.pop('error', 'Error', "No brand found!");
                        });
                } else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
            });
    }

    $scope.onChangeprice = function () {

        var id = this.rec.offer_method_ids.id;

        //	console.log(id);
        if (id == -1) {
            // $scope.show_method_pop= true;   
            // angular.element('#modal_method_id').click();  
            angular.element('#modal_method2').modal({
                show: true
            });
        }

        angular.element("#name").val('');
        $scope.name = '';
    }

    $scope.onChangeshipping = function () {

        var id = this.rec.shipping_methods.id;

        //	console.log(id);
        if (id == -1) {
            // $scope.show_method_pop= true;   
            // angular.element('#modal_method_id').click();  
            angular.element('#modal_shiping').modal({
                show: true
            });
        }

        angular.element("#name").val('');
        $scope.name = '';
    }

    $scope.add_shipping_pop = function (formData6) {

        var add_shipping_method_url = $scope.$root.pr + "srm/srm/add-shiping-list";
        $scope.formData6.token = $scope.$root.token;
        $scope.formData6.data = $scope.formFields;
        $http
            .post(add_shipping_method_url, formData6)
            .then(function (res) {
                if (res.data.ack == true) {

                    toaster.pop('success', 'Add', 'Record  Inserted.');
                    angular.element('#modal_shiping').modal('hide');

                    $http
                        .post(shipping_method_url, {
                            'token': $scope.$root.token
                        })
                        .then(function (res) {
                            if (res.data.ack == true) {
                                $scope.shiping_list = res.data.response;
                                if ($scope.user_type == 1) {
                                    $scope.shiping_list.push({
                                        'id': '-1',
                                        'name': '++ Add New ++'
                                    });
                                }

                            }
                            //else 	toaster.pop('error', 'Error', "No brand found!");
                        });
                } else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
            });
    }


    // ---------------- Price List   	 -----------------------------------------

    $scope.wordsLength = 0;
    $scope.arr_unit_of_measure = [];
    $scope.arr_OfferMethod = [];

    $scope.isVolumeDiscForm = false;
    $scope.isVolumeDiscListing = false;

    $scope.searchKeyword_price = {};
    $scope.arr_volume_1 = [];
    $scope.arr_volume_1.push({
        'id': '-1',
        'name': '++ Add New ++'
    });

    $scope.getproductsPriceOffer = function (isShow, item_paging) {

        if (isShow == 77)
            $scope.searchKeyword_price = {};

        $scope.title = 'Items';

        angular.element('#price_item_popup').modal({
            show: true
        });
        return;

        var prodApi_setup = $scope.$root.sales + "stock/products-listing/get-all-products";

        $scope.showLoader = true;
        $scope.columns = [];
        $scope.record = {};
        $scope.title = 'Items';

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;

        /*if (item_paging == 1)
         $rootScope.item_paging.spage = 1;*/

        $rootScope.item_paging.spage = item_paging;

        $scope.postData.page = $rootScope.item_paging.spage;
        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.selection_record = {};
        }

        if (isShow == 77)
            $scope.searchKeyword_price = {};

        $scope.postData.searchKeyword = $scope.searchKeyword_price.searchBox;

        if ($scope.searchKeyword_price.category_names != null)
            $scope.postData.category_name = $scope.searchKeyword_price.category_names !== undefined ? $scope.searchKeyword_price.category_names.id : 0;

        if ($scope.searchKeyword_price.brand_names != null)
            $scope.postData.brand_name = $scope.searchKeyword_price.brand_names !== undefined ? $scope.searchKeyword_price.brand_names.id : 0;

        if ($scope.searchKeyword_price.units != null)
            $scope.postData.unitss = $scope.searchKeyword_price.units !== undefined ? $scope.searchKeyword_price.units.id : 0;
        ////console.log($scope.searchKeyword_price.units);

        $http
            .post(prodApi_setup, $scope.postData)
            .then(function (res) {

                if (res.data.ack == true) {
                    $scope.columns = [];

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.products = res.data.response;
                    $scope.showLoader = false;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                } else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });


    }

    $scope.confirm2 = function (result) {
        // console.log(result);

        $scope.PriceOffer_rec.Item_Code = result.product_code;
        $scope.PriceOffer_rec.Item_Description = result.description;
        $scope.PriceOffer_rec.product_id = result.id;
        $scope.PriceOffer_rec.product_unit_id = result.unit_id;

        var restype = 1;

        $scope.loadDropDownsData_Price(result.id, restype);
        angular.element('#price_item_popup').modal('hide');
    }

    $scope.loadDropDownsData_Price = function (item_id, type) {

        $scope.arr_unit_of_measure = [];

        var unitUrl = $scope.$root.stock + "unit-measure/get-unit-setup-list-category";
        $http
            .post(unitUrl, {
                product_id: item_id,
                'token': $scope.$root.token
            })
            .then(function (unit_data) {
                if (unit_data.data.ack == 1) {

                    angular.forEach(unit_data.data.response, function (obj) {
                        $scope.arr_unit_of_measure.push(obj);
                    });
                }
                //$scope.arr_unit_of_measure.push({'id':'-1','title':'++ Add New ++'});
            });
    }

    $scope.ShowVolDiscPriceHistory = function (id, type) {

        $scope.history_title = "Price Volume Discount History";

        //$scope.history_type = type;

        $scope.Price_rec_history = {};
        $scope.showLoader = true;

        var ApiAjax = $scope.$root.pr + "srm/srm/get-srm-price-volume-history";

        $scope.postData = {
            token: $scope.$root.token,
            id: id
        }

        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res) {
                $scope.Price_rec_history = {};

                if (res.data.ack == true)
                    $scope.Price_rec_history = res.data.response;

                $scope.showLoader = false;
                angular.element('#_SrmPriceVolHistory_modal').modal({
                    show: true
                });
            });
    }
    $scope.getSRMPriceHistory = function (id, type) {
        $scope.showLoader = true;
        $scope.history_title = "Price Offer History";
        $scope.PriceOffer_rec_history = {};

        var ApiAjax = $scope.$root.pr + "srm/srm/get-srm-price-history";

        $scope.srm_id = $stateParams.id;

        $scope.postData = {
            crm_ids: $scope.crm_id,
            token: $scope.$root.token,
            price_type: type,
            id: id
        }

        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res) {
                $scope.price_history_info_columns = [];
                $scope.price_history_info_record_data = {};

                if (res.data.ack == true)
                    $scope.price_history_info_record_data = res.data.response;

                $scope.showLoader = false;
                angular.element('#_SrmPriceHistory_modal').modal({
                    show: true
                });
            });
    }
    $scope.getCurrencyCode = function () {
        $scope.currency_code = this.rec.currency_ids.name;
    }

    $scope.showSRMPriceInfoEditForm = function () {
        // //console.log("here");
        $scope.PriceOffer_check_readonly = false;
    }
    $scope.searchKeyword_offered = {};
    $scope.getOffer_PriceOffer = function (isShow, item_paging) {

        $scope.showLoader = true;
        $scope.columns_pr = [];
        $scope.record_pr = {};
        $scope.searchKeyword_offered = {};
        $scope.title = 'Offered By';

        var GenSalePersonUrl = $scope.$root.pr + "srm/srm/alt-contacts";

        var GenSalePersonPostData = {
            'acc_id': $stateParams.id,
            'module_type': 2,
            'token': $scope.$root.token
        };

        $http
            .post(GenSalePersonUrl, GenSalePersonPostData)
            .then(function (res) {
                console.log(res.data.record.result);

                if (res.data.record.ack == true) {


                    $scope.record_pr = res.data.record.result;
                    $scope.showLoader = false;

                    angular.forEach(res.data.record.result[0], function (val, index) {
                        $scope.columns_pr.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.element('#_SrmPriceInfoEmplisting_model').modal({
                        show: true
                    });
                } else {
                    $scope.showLoader = false;
                }
            });
    }

    // select for add Items in price module.
    $scope.searchKeywordItem = {};
    $scope.selectPriceItems = function () {

        $scope.filterPriceItem = [];
        angular.element('#PriceItemsModal').modal({
            show: true
        });
    }

    $scope.confirmOffer_PriceOffer = function (result) {

        //console.log(result);
        // $scope.PriceOffer_rec.offered_by = result.first_name + ' ' + result.last_name;

        $scope.PriceOffer_rec.offered_by = result.name;
        $scope.PriceOffer_rec.offered_by_id = result.id;

        angular.element('#_SrmPriceInfoEmplisting_model').modal('hide');
    }
    $scope.getVolDiscouts_PriceOffer = function () {

        if ($scope.$root.price_type == 1)
            var ApiAjax = $scope.$root.pr + "srm/srm/get-sup-price-offer-volume-listing";
        else
            var ApiAjax = $scope.$root.pr + "srm/srm/get-sup-price-list-volume-listing";

        $scope.PriceOffer_volume_discdata = {};
        $scope.isVolumeDiscForm = false;
        $scope.isVolumeDiscListing = true;
        $scope.formData = {};

        $scope.postData = {
            id: $scope.arrIds,
            price_volume_disc: 1,
            token: $scope.$root.token
        }

        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res_price_vol) {
                ////console.log(res_price_vol);

                if (res_price_vol.data.ack == true) {
                    $scope.PriceOffer_volume_discdata = res_price_vol.data.response;
                }
            });

    }
    $scope.PriceOffer_validatePrice = function (price) {

        if (price == undefined)
            return;

        var price_a = 0;
        var currency_id = 0;

        if (price != undefined)
            price_a = price;
        //price_a = $scope.PriceOffer_rec.credit_amount;

        if ($scope.PriceOffer_rec.old_price > 0) {
            if ($scope.PriceOffer_rec.old_price != Number(price)) {

                var priceupdateUrl = $scope.$root.pr + "srm/srm/update-price-volume-with-NewPrice";

                ngDialog.openConfirm({
                    template: 'ModalContinueUpdatePrice',
                    className: 'ngdialog-theme-default-custom'
                }).then(function (value) {
                    $http
                        .post(priceupdateUrl, {
                            'id': $scope.PriceOffer_rec.id,
                            'price': price,
                            token: $scope.$root.token
                        })
                        .then(function (res) {

                            if (res.data.ack == true) {
                                $scope.getVolDiscouts_PriceOffer();
                                toaster.pop('success', 'Update', $scope.$root.getErrorMessageByCode(627));
                            } else
                                toaster.pop('error', 'Update', $scope.$root.getErrorMessageByCode(553, ['Volume Discount Record(s)']));
                        });
                }, function (reason) {
                    //console.log('Modal promise rejected. Reason: ', reason);
                });
            }
        }


        if ($scope.PriceOffer_rec.currencys != undefined)
            currency_id = $scope.PriceOffer_rec.currencys.id;

        if (currency_id == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Currency']));
            $scope.PriceOffer_rec.price_offered = null;
            return;
        }

        if (currency_id == $scope.$root.defaultCurrency) {
            $scope.PriceOffer_rec.price_offered = Number(price_a);

            var newPrice = 0;

            if ($scope.PriceOffer_rec.unit_of_measures != undefined) {

                if ($scope.PriceOffer_rec.unit_of_measures.unit_id != $scope.PriceOffer_rec.product_unit_id) {

                    if ($scope.PriceOffer_rec.unit_of_measures.unit_id != $scope.PriceOffer_rec.unit_of_measures.ref_unit_id)
                        newPrice = Number(price) / $scope.PriceOffer_rec.unit_of_measures.ref_quantity;
                    else
                        newPrice = Number(price) / $scope.PriceOffer_rec.unit_of_measures.quantity;
                } else
                    newPrice = Number(price);
            } else
                newPrice = Number(price);

            $scope.PriceOffer_rec.converted_price = Number(newPrice).toFixed(2);
        } else {
            var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
            $http
                .post(currencyURL, {
                    'id': $scope.PriceOffer_rec.currencys.id,
                    token: $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        if (res.data.response.conversion_rate == null) {
                            toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                            $scope.PriceOffer_rec.price_offered = null;
                            $scope.PriceOffer_rec.converted_price = null;
                            return;
                        }

                        var new_price = "";

                        if ($scope.PriceOffer_rec.unit_of_measures != undefined) {

                            if ($scope.PriceOffer_rec.unit_of_measures.unit_id != $scope.PriceOffer_rec.product_unit_id) {
                                if ($scope.PriceOffer_rec.unit_of_measures.unit_id != $scope.PriceOffer_rec.unit_of_measures.ref_unit_id)
                                    new_price = Number(price) / $scope.PriceOffer_rec.unit_of_measures.ref_quantity;
                                else
                                    new_price = Number(price) / $scope.PriceOffer_rec.unit_of_measures.quantity;
                            } else
                                new_price = Number(price);
                        } else
                            new_price = Number(price);

                        /*//console.log(" new price after unit of measure conversion:  " +new_price);
                         //console.log(" currency id from form:  " +$scope.PriceOffer_rec.currencys.id);
                         //console.log(" Company Default currency id:  " +$scope.$root.defaultCurrency);*/

                        if ($scope.PriceOffer_rec.currencys != undefined) {

                            if ($scope.PriceOffer_rec.currencys.id != $scope.$root.defaultCurrency)
                                newPrice = Number(new_price) / Number(res.data.response.conversion_rate);
                            else
                                newPrice = Number(new_price);
                        }

                        $scope.PriceOffer_rec.converted_price = Number(newPrice).toFixed(2);
                    } else {
                        toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                        $scope.PriceOffer_rec.price_offered = null;
                        $scope.PriceOffer_rec.converted_price = null;
                    }
                });
        }
    }

    $scope.showSRMPriceInfoEditForm = function () {
        // //console.log("here");
        $scope.PriceOffer_check_readonly = false;
    }

    $scope.showSRMPriceInfoListing = function () {
        $scope.SRMPriceInfoFormShow = false;
        $scope.SRMPriceInfoListingShow = true;
    }

    $scope.getLocPriceOffer = function () {
        $scope.showLoader = true;
        $scope.arr_location = [];
        $scope.title = 'Locations';

        var getlocationUrl = $scope.$root.pr + "srm/srm/get-warehouses-and-company-addresses";
        $http
            .post(getlocationUrl, {
                'token': $scope.$root.token,
                'srm_id': $scope.$root.srm_id
            })
            .then(function (res) {

                $scope.showLoader = false;

                if (res.data.ack == true) {
                    // $scope.arr_location = res.data.response;

                    angular.forEach(res.data.response, function (obj) {
                        obj.chk = false;

                        if ($scope.selectedCRMLoc.length > 0) {
                            angular.forEach($scope.selectedCRMLoc, function (obj2) {
                                if (obj.id == obj2.id) {
                                    obj.chk = true;
                                }
                            });
                        }
                        $scope.arr_location.push(obj);
                    });

                    for (var i = 0; i < $scope.arr_location.length; i++) {
                        var object = $scope.arr_location[i];

                        if (object.id == $scope.employee_id)
                            $scope.arr_location.splice(i, 1);
                    }

                    angular.element('#SRMLocModal').modal({
                        show: true
                    });
                } else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });
    }
    $scope.checkAllSRMLoc = function (val) {
        // $scope.selectedCRMLoc = [];
        //$scope.selCRMLocTooltip = "";

        if (val == true) {

            $scope.isCRMLocChanged = true;

            for (var i = 0; i < $scope.arr_location.length; i++) {
                $scope.arr_location[i].chk = true;
                //$scope.selectedCRMLoc.push($scope.arr_location[i]);
                //$scope.selCRMLocTooltip = $scope.selCRMLocTooltip + $scope.arr_location[i].title + "; ";
            }

            //$scope.selCRMLocTooltip = $scope.selCRMLocTooltip.slice(0, -2);

        } else {
            for (var i = 0; i < $scope.arr_location.length; i++) {
                $scope.arr_location[i].chk = false;
            }

        }
    }
    $scope.submitPendingSelectedSRMLoc = function () {

        $scope.PendingSelectedCRMLoc = [];
        $scope.PendingselCRMLocTooltip = "";

        var isPrimary = false;

        for (var i = 0; i < $scope.arr_location.length; i++) {
            if ($scope.arr_location[i].chk == true) {
                $scope.PendingSelectedCRMLoc.push($scope.arr_location[i]);
                $scope.PendingselCRMLocTooltip = $scope.PendingselCRMLocTooltip + $scope.arr_location[i].title + "; ";
            }
        }

        $scope.PendingselCRMLocTooltip = $scope.PendingselCRMLocTooltip.slice(0, -2);

        $scope.selectedCRMLoc = $scope.PendingSelectedCRMLoc;
        $scope.selCRMLocTooltip = $scope.PendingselCRMLocTooltip;

        angular.element('#SRMLocModal').modal('hide');
    }

    $scope.selectSRMLoc = function (loc) {

        $scope.isCRMLocChanged = true;

        for (var i = 0; i < $scope.arr_location.length; i++) {

            if (loc.id == $scope.arr_location[i].id) {
                if ($scope.arr_location[i].chk == true) {
                    $scope.arr_location[i].chk = false;
                } else
                    $scope.arr_location[i].chk = true;
            }
        }
    }

    $scope.clearPendingSelectedSRMLoc = function () {
        $scope.PendingSelectedCRMLoc = [];
        $scope.PendingselCRMLocTooltip = "";
        angular.element('#SRMLocModal').modal('hide');
    }

    //Reset Price Offer Form

    $scope.PriceOffershowVolDiscForm = function () {

        $scope.get_item_voume_list();

        $scope.isVolumeDiscForm = true;
        $scope.isVolumeDiscListing = false;
        $scope.check_volume_readonly = false;
        $scope.formData = {};
        $scope.formData.purchase_price_1 = $scope.PriceOffer_rec.price_offered;
    }

    $scope.PriceOffershowVolDiscListing = function () {
        $scope.isVolumeDiscForm = false;
        $scope.isVolumeDiscListing = true;
        $scope.formData = {};
    }


    $scope.show_price_one = function () {
        var price = 0;
        var final_price = 0;
        var final_price_one = 0;

        price = $scope.formData.purchase_price_1;

        var f_id = this.formData.supplier_type_1.id;

        if (f_id == 1) {
            final_price_one = (parseFloat($scope.formData.discount_value_1)) * (parseFloat(price)) / 100;
            final_price = (parseFloat(price)) - (parseFloat(final_price_one));
        } else if (f_id == 2) {
            final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value_1));
        }

        $scope.formData.discount_price_1 = Math.round(final_price * 100) / 100;
    }

    $scope.volume_type = 0;

    $scope.onChange_vol_1_PriceOffer = function (drpdown) {
        var id = 0;
        var volume = '';

        if (drpdown[0] != undefined)
            id = drpdown[0].id;
        else
            id = drpdown.id;

        if (id >= 0)
            return;

        $scope.formData.volume_1 = '';
        $scope.formData_vol_1 = {};

        $scope.list_unit_category = [];
        $scope.list_unit_category.push($scope.PriceOffer_rec.unit_of_measures);
        $scope.formData_vol_1.unit_category = $scope.list_unit_category[0];

        volume = 'Volume 1';
        var category = 1;
        $scope.title_type = 'Add Volume';
        $scope.formData_vol_1.type = volume;
        $scope.formData_vol_1.category = category;
        angular.element('.add_volume_disc').modal({
            show: true
        });
    }

    $scope.volCounter = 0;
    $scope.add_vol1_type = function (formData_vol_1) {
        var addvolumeUrl_item = $scope.$root.pr + "srm/srm/add-srm-offer-volume";

        if (formData_vol_1.quantity_from == undefined && formData_vol_1.quantity_from == null) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Quantity From']));
            return false;
        }

        if (formData_vol_1.quantity_to == undefined && formData_vol_1.quantity_to == null) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Quantitiy To']));
            return false;
        }

        if (Number(formData_vol_1.quantity_from) > Number(formData_vol_1.quantity_to)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(301));
            return false;
        }

        if (Number($scope.formData_vol_1.quantity_from) < Number($scope.PriceOffer_rec.min_order_qty)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(302, [$scope.PriceOffer_rec.min_order_qty]));
            //$scope.formData_vol_1.quantity_from = null;
            return false;
        }
        if (Number($scope.formData_vol_1.quantity_to) > Number($scope.PriceOffer_rec.max_order_qty)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(303, [$scope.PriceOffer_rec.max_order_qty]));
            //$scope.formData_vol_1.quantity_to = null;
            return false;
        }


        formData_vol_1.token = $scope.$root.token;
        formData_vol_1.item_id = $scope.PriceOffer_rec.product_id;
        formData_vol_1.type = 1;

        if ($scope.PriceOffer_rec.id > 0 || $scope.formData.id > 0) {
            formData_vol_1.srm_id = $scope.$stateParams.id;
            formData_vol_1.supplier_price_info_id = $scope.PriceOffer_rec.id;
            formData_vol_1.unit_categorys = $scope.formData_vol_1.unit_category !== undefined ? $scope.formData_vol_1.unit_category.id : 0;
        } else {
            formData_vol_1.srm_id = $scope.$stateParams.id;
            formData_vol_1.supplier_price_info_id = $scope.arrIds[$scope.volCounter];
            formData_vol_1.unit_categorys = $scope.formData_vol_1.unit_category !== undefined ? $scope.formData_vol_1.unit_category.id : 0;
        }


        $http
            .post(addvolumeUrl_item, formData_vol_1)
            .then(function (res) {

                if (res.data.ack == true) {

                    if ($scope.PriceOffer_rec.id > 0 || $scope.formData.id > 0) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        angular.element('.add_volume_disc').modal('hide');
                        $scope.get_item_voume_list(res.data.id);
                        return;
                    }

                    if ($scope.PriceOffer_rec.cust_prod_type != undefined && $scope.PriceOffer_rec.cust_prod_type.id == 1) {

                        if ($scope.arrIds.length != ($scope.volCounter + 1)) {
                            $scope.volCounter++;
                        } else {
                            toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                            angular.element('.add_volume_disc').modal('hide');
                            $scope.get_item_voume_list(res.data.id);
                        }
                    } else if ($scope.PriceOffer_rec.cust_prod_type != undefined && $scope.PriceOffer_rec.cust_prod_type.id == 2) {

                        if ($scope.arrIds.length != ($scope.volCounter + 1)) {
                            $scope.volCounter++;
                        } else {
                            toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                            angular.element('.add_volume_disc').modal('hide');
                            $scope.get_item_voume_list(res.data.id);
                        }
                    } else {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        angular.element('.add_volume_disc').modal('hide');
                        $scope.get_item_voume_list(res.data.id);
                    }
                } else
                    toaster.pop('error', 'info', 'Already Exists.');
            });
    }

    $scope.show_price_one = function () {
        var price = 0;
        var final_price = 0;
        var final_price_one = 0;

        price = $scope.formData.purchase_price_1;

        var f_id = this.formData.supplier_type_1.id;

        if (f_id == 1) {
            final_price_one = (parseFloat($scope.formData.discount_value_1)) * (parseFloat(price)) / 100;
            final_price = (parseFloat(price)) - (parseFloat(final_price_one));
        } else if (f_id == 2) {
            final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value_1));
        }

        $scope.formData.discount_price_1 = Math.round(final_price * 100) / 100;
    }

    $scope.count = 0;
    $scope.addVolumeDiscountPriceOffer = function (formData) {

        if (formData.volume_1 == undefined) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Volume']));
            return false;
        }
        var updateUrl = $scope.$root.pr + "srm/srm/add-srm-price-offer-volume";

        formData.product_type_id = 1;

        formData.srm_id = $stateParams.id;

        formData.token = $scope.$root.token;
        formData.price_volume_disc = 1;
        formData.item_id = $scope.rec.product_id;

        if ($scope.PriceOffer_rec.id > 0 || $scope.formData.id > 0) {
            formData.volume_1s = formData.volume_1.id;
            formData.quantity_from = formData.volume_1.quantity_from;
            formData.quantity_to = formData.volume_1.quantity_to;
            formData.supplier_price_info_id = formData.volume_1.supplier_price_info_id;
        } else {
            formData.volume_1s = formData.volume_1[$scope.count].id;
            formData.quantity_from = formData.volume_1[$scope.count].quantity_from;
            formData.quantity_to = formData.volume_1[$scope.count].quantity_to;
            formData.supplier_price_info_id = formData.volume_1[$scope.count].supplier_price_info_id;
        }

        formData.supplier_type_1s = formData.supplier_type_1 !== undefined ? formData.supplier_type_1.id : 0;
        // formData.item_id = $stateParams.id;

        if (formData.id > 0)
            var updateUrl = $scope.$root.pr + "srm/srm/update-srm-price-offer-volume";

        $http
            .post(updateUrl, formData)
            .then(function (res) {
                if (res.data.ack == 1) {

                    if ($scope.PriceOffer_rec.id > 0 || $scope.formData.id > 0) {
                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                        formData.volume_1 = null;
                        $scope.getVolDiscouts_PriceOffer();
                        $scope.count = 0;
                    } else {
                        if (formData.volume_1.length != ($scope.count + 1)) {
                            $scope.count++;
                            $scope.addVolumeDiscountPriceOffer(formData);
                        } else {
                            toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                            formData.volume_1 = null;
                            $scope.isBtnVolNew = false;
                            $scope.getVolDiscouts_PriceOffer();
                            $scope.count = 0;
                        }
                    }
                    $scope.isFristTime = false;
                }

                if (res.data.ack == 0 && res.data.edit == 1)
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(102));

                if (res.data.ack == 2)
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(107));
            });
    }

    $scope.editVolDiscPriceOffer = function (id) {

        $scope.isVolumeDiscListing = false;
        $scope.isVolumeDiscForm = true;
        $scope.check_volume_readonly = false;

        var postUrl = $scope.$root.pr + "srm/srm/volume-discount-by-id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };

        $http
            .post(postUrl, postViewBankData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.arrVolumeForms = [];
                    $scope.formData = res.data.response;

                    angular.forEach($scope.list_type, function (obj) {
                        if (obj.id == $scope.formData.discount_type)
                            $scope.formData.supplier_type_1 = obj;
                    });

                    $scope.formData.discount_value_1 = $scope.formData.discount;
                    $scope.formData.discount_price_1 = $scope.formData.discounted_price;
                    $scope.formData.purchase_price_1 = $scope.formData.price;
                    $scope.formData.start_date1 = $scope.formData.start_date;
                    $scope.formData.end_date1 = $scope.formData.end_date;
                    $scope.formData.volume_1_id = $scope.formData.id;

                    $scope.get_item_voume_list($scope.formData.volume_id);
                } else
                    $scope.formData = {};
            });
    }

    var constUrl = $scope.$root.setup + "ledger-group/get-predefine-by-type";
    var currencyUrl = $scope.$root.setup + "general/currency-list";

    var volumeUrl_item = $scope.$root.stock + "unit-measure/get-sale-offer-volume-by-type";
    var addvolumeUrl_item = $scope.$root.stock + "unit-measure/add-sale-offer-volume";

    var get_unit_setup_category = $scope.$root.stock + "unit-measure/get-unit-setup-list-category";
    var get_rec_url = $scope.$root.stock + "unit-measure/get-unit-record-popup";
    var add_unitUrl_item = $scope.$root.stock + "unit-measure/add-unit-record-popup";


    var volumeUrl_service = $scope.$root.setup + "service/products-listing/get-price-offer-volume-by-type";
    var addvolumeUrl_service = $scope.$root.setup + "service/products-listing/add-service-price-offer-volumes";

    var unitUrl_service = $scope.$root.setup + "service/unit-measure/get-all-unit";
    var add_unitUrl_service = $scope.$root.setup + "service/unit-measure/add-unit";

    $scope.items = {};
    $scope.services = {};
    $scope.showItms = true;
    $scope.showServ = true;
    var prodApi_setup = $scope.$root.stock + "products-listing/get-products-popup";
    //	var prodApi_setup  = $scope.$root.stock + "products-listing/get-products-setup-list";

    $scope.getProduct = function () {

        if ($scope.rec.update_id != undefined) {
            if ($scope.rec.type == 1)
                $scope.getProductListing();
            if ($scope.rec.type == 2)
                $scope.getServices();
        } else
            $scope.getProductListing();
        angular.element('#itemServModal').modal({
            show: true
        });
    }

    $scope.getProductListing = function () {
        $scope.title = 'Items';
        $scope.rec.type = 1;
        // var prodApi = $scope.$root.stock + "products-listing/get-purchase-products-popup";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
            'suppler_id': $stateParams.id
        };
        $http
            .post(prodApi_setup, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.items = res.data.response;
                }
            });
    }

    $scope.getServices = function () {
        $scope.title = 'Services';
        $scope.rec.type = 2;
        var prodApi = $scope.$root.setup + "service/products-listing/get-products-popup";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
        };
        $http
            .post(prodApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.services = res.data.response;
                }
            });
    }

    $scope.addItem = function (item, type) {

        $scope.product_description = item.description;
        $scope.rec.type = type;
        $scope.rec.product_id = item.id;
        $scope.rec.product_code = $scope.product_code;
        $scope.rec.product_description = $scope.product_description;

        if (type == 1) {
            $scope.product_code = item.product_code;
            $scope.get_item_voume_list(1, $scope.rec.product_id);
        }

        if (type == 2) {
            $scope.product_code = item.code;
            $scope.get_service_voume_list(1);
        }

        $scope.rec.list_category_check = type;

        //console.log(item.unit_price);
        if (item.unit_price == null)
            $scope.rec.volume_1_price = $scope.rec.volume_2_price = $scope.rec.volume_3_price = item.standard_price;
        else
            $scope.rec.volume_1_price = $scope.rec.volume_2_price = $scope.rec.volume_3_price = item.unit_price;

        angular.element('#itemServModal').modal('hide');
    }

    $scope.get_item_voume_list = function (arg, item_id) {
        ////console.log(item_id);

        $http
            .post(volumeUrl_item, {
                type: 'Volume 1',
                category: arg,
                'item_id': item_id,
                'token': $scope.$root.token
            })
            .then(function (vol_data) {

                if (arg == 1) {
                    $scope.arr_volume_1 = vol_data.data.response;

                    if ($scope.arr_volume_1.length == 0) {
                        $scope.arr_volume_1.push({
                            'id': '-1',
                            'name': '++ Add New ++'
                        });
                    } else if ($scope.arr_volume_1.length > 0) {
                        if ($scope.user_type == 1)
                            $scope.arr_volume_1.push({
                                'id': '-1',
                                'name': '++ Add New ++'
                            });
                    }
                } else if (arg == 2) {
                    $scope.arr_volume_purchase_1 = vol_data.data.response;

                    if ($scope.arr_volume_purchase_1.length == 0) {
                        $scope.arr_volume_purchase_1.push({
                            'id': '-1',
                            'name': '++ Add New ++'
                        });
                    } else if ($scope.arr_volume_purchase_1.length > 0) {
                        if ($scope.user_type == 1)
                            $scope.arr_volume_purchase_1.push({
                                'id': '-1',
                                'name': '++ Add New ++'
                            });
                    }
                }
            });

        $http
            .post(volumeUrl_item, {
                type: 'Volume 2',
                category: arg,
                'item_id': item_id,
                'token': $scope.$root.token
            })
            .then(function (vol_data) {

                if (arg == 1) {
                    $scope.arr_volume_2 = vol_data.data.response;
                    if ($scope.arr_volume_2.length == 0) {
                        $scope.arr_volume_2.push({
                            'id': '-1',
                            'name': '++ Add New ++'
                        });
                    } else if ($scope.arr_volume_2.length > 0) {
                        if ($scope.user_type == 1)
                            $scope.arr_volume_2.push({
                                'id': '-1',
                                'name': '++ Add New ++'
                            });
                    }
                } else if (arg == 2) {
                    $scope.arr_volume_purchase_2 = vol_data.data.response;
                    if ($scope.arr_volume_purchase_2.length == 0) {
                        $scope.arr_volume_purchase_2.push({
                            'id': '-1',
                            'name': '++ Add New ++'
                        });
                    } else if ($scope.arr_volume_purchase_2.length > 0) {
                        if ($scope.user_type == 1)
                            $scope.arr_volume_purchase_2.push({
                                'id': '-1',
                                'name': '++ Add New ++'
                            });
                    }
                }
            });

        $http
            .post(volumeUrl_item, {
                type: 'Volume 3',
                category: arg,
                'item_id': item_id,
                'token': $scope.$root.token
            })
            .then(function (vol_data) {

                if (arg == 1) {
                    $scope.arr_volume_3 = vol_data.data.response;
                    if ($scope.arr_volume_3.length == 0) {
                        $scope.arr_volume_3.push({
                            'id': '-1',
                            'name': '++ Add New ++'
                        });
                    } else if ($scope.arr_volume_3.length > 0) {
                        if ($scope.user_type == 1)
                            $scope.arr_volume_3.push({
                                'id': '-1',
                                'name': '++ Add New ++'
                            });
                    }
                } else if (arg == 2) {
                    $scope.arr_volume_purchase_3 = vol_data.data.response;
                    if ($scope.arr_volume_purchase_3.length == 0) {
                        $scope.arr_volume_purchase_3.push({
                            'id': '-1',
                            'name': '++ Add New ++'
                        });
                    } else if ($scope.arr_volume_purchase_3.length > 0) {
                        if ($scope.user_type == 1)
                            $scope.arr_volume_purchase_3.push({
                                'id': '-1',
                                'name': '++ Add New ++'
                            });
                    }
                }
            });
    }


    $scope.get_service_voume_list = function (arg) {

        $http
            .post(volumeUrl_service, {
                type: 'Volume 1',
                'token': $scope.$root.token
            })
            .then(function (vol_data) {

                if (arg == 1) {
                    $scope.arr_volume_1 = vol_data.data.response;

                    if ($scope.arr_volume_1.length == 0) {
                        $scope.arr_volume_1.push({
                            'id': '-1',
                            'name': '++ Add New ++'
                        });
                    } else if ($scope.arr_volume_1.length > 0) {
                        if ($scope.user_type == 1)
                            $scope.arr_volume_1.push({
                                'id': '-1',
                                'name': '++ Add New ++'
                            });
                    }
                } else if (arg == 2) {
                    $scope.arr_volume_purchase_1 = vol_data.data.response;

                    if ($scope.arr_volume_purchase_1.length == 0) {
                        $scope.arr_volume_purchase_1.push({
                            'id': '-1',
                            'name': '++ Add New ++'
                        });
                    } else if ($scope.arr_volume_purchase_1.length > 0) {
                        if ($scope.user_type == 1)
                            $scope.arr_volume_purchase_1.push({
                                'id': '-1',
                                'name': '++ Add New ++'
                            });
                    }
                }
            });

        $http
            .post(volumeUrl_service, {
                type: 'Volume 2',
                'token': $scope.$root.token
            })
            .then(function (vol_data) {

                if (arg == 1) {
                    $scope.arr_volume_2 = vol_data.data.response;

                    if ($scope.arr_volume_2.length == 0) {
                        $scope.arr_volume_2.push({
                            'id': '-1',
                            'name': '++ Add New ++'
                        });
                    } else if ($scope.arr_volume_2.length > 0) {
                        if ($scope.user_type == 1)
                            $scope.arr_volume_2.push({
                                'id': '-1',
                                'name': '++ Add New ++'
                            });
                    }
                } else if (arg == 2) {
                    $scope.arr_volume_purchase_2 = vol_data.data.response;

                    if ($scope.arr_volume_purchase_2.length == 0) {
                        $scope.arr_volume_purchase_2.push({
                            'id': '-1',
                            'name': '++ Add New ++'
                        });
                    } else if ($scope.arr_volume_purchase_2.length > 0) {
                        if ($scope.user_type == 1)
                            $scope.arr_volume_purchase_2.push({
                                'id': '-1',
                                'name': '++ Add New ++'
                            });
                    }
                }
            });

        $http
            .post(volumeUrl_service, {
                type: 'Volume 3',
                'token': $scope.$root.token
            })
            .then(function (vol_data) {

                if (arg == 1) {
                    $scope.arr_volume_3 = vol_data.data.response;

                    if ($scope.arr_volume_3.length == 0) {
                        $scope.arr_volume_3.push({
                            'id': '-1',
                            'name': '++ Add New ++'
                        });
                    } else if ($scope.arr_volume_3.length > 0) {
                        if ($scope.user_type == 1)
                            $scope.arr_volume_3.push({
                                'id': '-1',
                                'name': '++ Add New ++'
                            });
                    }
                } else if (arg == 2) {
                    $scope.arr_volume_purchase_3 = vol_data.data.response;

                    if ($scope.arr_volume_purchase_3.length == 0) {
                        $scope.arr_volume_purchase_3.push({
                            'id': '-1',
                            'name': '++ Add New ++'
                        });
                    } else if ($scope.arr_volume_purchase_3.length > 0) {
                        if ($scope.user_type == 1)
                            $scope.arr_volume_purchase_3.push({
                                'id': '-1',
                                'name': '++ Add New ++'
                            });
                    }
                }
            });

        $http
            .post(unitUrl_service, {
                'token': $scope.$root.token
            })
            .then(function (unit_data) {
                $scope.arr_unit_of_measure = unit_data.data.response;
                // $scope.arr_unit_of_measure.push({'id': '-1', 'name': '++ Add New ++'});
            });
    }

    $scope.formData_vol_1 = {};
    $scope.get_category_list = function () {
        var pard_id = $scope.rec.product_id;

        if ($scope.rec.product_id == undefined) {
            var pard_id = $scope.selectedItems[0].id;
        }

        $scope.list_unit_category = [];
        $http
            .post(get_unit_setup_category, {
                'token': $scope.$root.token,
                'product_id': pard_id
            })
            .then(function (vol_data) {
                $scope.list_unit_category = vol_data.data.response;
            });

    }

    $scope.onChange_vol_1 = function (arg_id, arg_name) {
        $scope.formData_vol_1 = {};

        var id = '';
        var volume = '';
        var category = 0;

        if (arg_id == 1) {
            id = this.rec.volume_1s.id;
            $scope.number_close = 7;
            volume = 'Volume 1';
            category = 1;
            $scope.title_type = 'Add Sale Volume 1 ';
        } else if (arg_id == 2) {
            id = this.rec.volume_2s.id;
            $scope.number_close = 8;
            volume = 'Volume 2';
            category = 1;
            $scope.title_type = 'Add Sale Volume 2 ';
        } else if (arg_id == 3) {
            id = this.rec.volume_3s.id;
            $scope.number_close = 9;
            volume = 'Volume 3';
            category = 1;
            $scope.title_type = 'Add Sale Volume 3 ';
        }

        if (arg_id == 11) {
            id = this.rec.volume_1_purchase.id;
            $scope.number_close = 10;
            volume = 'Volume 1';
            category = 2;
            $scope.title_type = 'Add Purchase   Volume 1 ';
        } else if (arg_id == 22) {
            id = this.rec.volume_2_purchase.id;
            $scope.number_close = 11;
            volume = 'Volume 2';
            category = 2;
            $scope.title_type = 'Add Purchase   Volume 2 ';
        } else if (arg_id == 33) {
            id = this.rec.volume_3_purchase.id;
            $scope.number_close = 12;
            volume = 'Volume 3';
            category = 2;
            $scope.title_type = 'Add Purchase   Volume 3 ';
        }


        $scope.rec.volume = volume;
        $scope.rec.title_type = $scope.title_type;

        $scope.rec.ref_service_type = arg_id;
        $scope.formData_vol_1.type = arg_id;
        $scope.formData_vol_1.category = category;

        if ($scope.rec.type == 2) {
            angular.element('#model_vol_3').modal({
                show: true
            });
            return;
        }

        if ($scope.rec.type == 1) {

            if (id == -1) {
                $scope.get_category_list();
                angular.element('#model_vol_1').modal({
                    show: true
                });
            }
        }
    }

    $scope.add_vol3_service = function (formData_vol_1) {
        $scope.formData_vol_1.token = $scope.$root.token;
        $scope.formData_vol_1.parent_id = 0;
        $scope.formData_vol_1.type = $scope.rec.ref_service_type;

        $http
            .post(addvolumeUrl_service, formData_vol_1)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Add', 'Record  Inserted.');
                    angular.element('#model_vol_3').modal('hide');

                    $http
                        .post(volumeUrl_service, {
                            type: 'Volume ' + $scope.rec.ref_service_type,
                            'token': $scope.$root.token
                        })
                        .then(function (vol_data) {

                            if ($scope.rec.ref_service_type == 1) {
                                $scope.arr_volume_1 = vol_data.data.response;

                                if ($scope.arr_volume_1.length == 0) {
                                    $scope.arr_volume_1.push({
                                        'id': '-1',
                                        'name': '++ Add New ++'
                                    });
                                } else if ($scope.arr_volume_1.length > 0) {
                                    if ($scope.user_type == 1)
                                        $scope.arr_volume_1.push({
                                            'id': '-1',
                                            'name': '++ Add New ++'
                                        });
                                }


                                angular.forEach($scope.arr_volume_1, function (elem) {
                                    if (elem.name == $scope.formData_vol_1.description)
                                        $scope.rec.volume_1s = elem;
                                });
                            }

                            if ($scope.rec.ref_service_type == 2) {
                                $scope.arr_volume_2 = vol_data.data.response;


                                if ($scope.arr_volume_2.length == 0) {
                                    $scope.arr_volume_2.push({
                                        'id': '-1',
                                        'name': '++ Add New ++'
                                    });
                                } else if ($scope.arr_volume_2.length > 0) {
                                    if ($scope.user_type == 1)
                                        $scope.arr_volume_2.push({
                                            'id': '-1',
                                            'name': '++ Add New ++'
                                        });
                                }

                                angular.forEach($scope.arr_volume_2, function (elem) {
                                    if (elem.name == $scope.formData_vol_1.description)
                                        $scope.rec.volume_2s = elem;
                                });

                            }

                            if ($scope.rec.ref_service_type == 3) {
                                $scope.arr_volume_3 = vol_data.data.response;

                                if ($scope.arr_volume_3.length == 0) {
                                    $scope.arr_volume_3.push({
                                        'id': '-1',
                                        'name': '++ Add New ++'
                                    });
                                } else if ($scope.arr_volume_3.length > 0) {
                                    if ($scope.user_type == 1)
                                        $scope.arr_volume_3.push({
                                            'id': '-1',
                                            'name': '++ Add New ++'
                                        });
                                }

                                angular.forEach($scope.arr_volume_3, function (elem) {
                                    if (elem.name == $scope.formData_vol_1.description)
                                        $scope.rec.volume_3s = elem;
                                });
                            }
                        });

                } else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
            });
    }


    $scope.addNewVolumePopup = function (drpdown, type, title) {
        $scope.rec.type;

        if ($scope.rec.type == 1) {
            var consnt_add = addvolumeUrl_item;
            var const_list = volumeUrl_item;
        } else {
            var consnt_add = addvolumeUrl_service;
            var const_list = volumeUrl_service;
        }


        var id = drpdown.id;
        if (id > 0)
            return false;

        $scope.popup_title = title;
        $scope.pedefined = {};

        ngDialog.openConfirm({
            template: 'app/views/product_values/add_vol_3.html',
            className: 'ngdialog-theme-default-custom-large',
            scope: $scope
        }).then(function (pedefined) {
            pedefined.token = $scope.$root.token;
            pedefined.type = type;

            $http
                .post(consnt_add, pedefined)
                .then(function (ress) {
                    if (ress.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        // var constUrl = $scope.$root.sales+"crm/crm/get-price-offer-volume-by-type";
                        $http
                            .post(const_list, {
                                'token': $scope.$root.token,
                                type: type
                            })
                            .then(function (res) {
                                if (res.data.ack == true) {

                                    if (type == 'Volume 1') {
                                        $scope.arr_volume_1 = res.data.response;
                                        $scope.arr_volume_1.push({
                                            'id': '-1',
                                            'name': '++ Add New ++'
                                        });
                                    }

                                    if (type == 'Volume 2') {
                                        $scope.arr_volume_2 = res.data.response;
                                        $scope.arr_volume_2.push({
                                            'id': '-1',
                                            'name': '++ Add New ++'
                                        });

                                        angular.forEach($scope.arr_volume_2, function (elem) {
                                            if (elem.id == ress.data.id)
                                                $scope.rec.volume_2s = elem;
                                        });
                                    }

                                    if (type == 'Volume 3') {
                                        $scope.arr_volume_3 = res.data.response;
                                        $scope.arr_volume_3.push({
                                            'id': '-1',
                                            'name': '++ Add New ++'
                                        });

                                        angular.forEach($scope.arr_volume_3, function (elem) {
                                            if (elem.id == ress.data.id)
                                                $scope.rec.volume_3s = elem;
                                        });
                                    }
                                }
                            });
                    }
                });

        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.addNewUnitPopup = function (drpdown, type, title) {
        $scope.rec.type;
        //console.log($scope.rec.type);
        if ($scope.rec.type == 1) {
            consnt_add = add_unitUrl_item;
            const_list = unitUrl_item;

        } else {
            consnt_add = add_unitUrl_service;
            const_list = unitUrl_service;
        }

        var id = drpdown.id;
        if (id > 0)
            return false;
        var indx = $scope.arr_unit_of_measure.indexOf('-1');
        $scope.arr_unit_of_measure.splice(indx, 1);
        $scope.popup_title = title;
        $scope.pedefined = {};

        ngDialog.openConfirm({
            template: 'app/views/p_offer/add_new_unit.html',
            className: 'ngdialog-theme-default-custom-large',
            scope: $scope
        }).then(function (pedefined) {

            pedefined.token = $scope.$root.token;
            pedefined.parent_id = pedefined.parent_ids != undefined ? pedefined.parent_ids.id : 0;
            var postUrl = $scope.$root.stock + "unit-measure/add-unit";

            $http
                .post(consnt_add, pedefined)
                .then(function (ress) {
                    if (ress.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        var constUrl = $scope.$root.stock + "unit-measure/get-all-unit";
                        $http
                            .post(const_list, {
                                'token': $scope.$root.token
                            })
                            .then(function (res) {
                                if (res.data.ack == true) {
                                    $scope.arr_unit_of_measure = res.data.response;
                                    $scope.arr_unit_of_measure.push({
                                        'id': '-1',
                                        'title': '++ Add New ++'
                                    });

                                    angular.forEach($scope.arr_unit_of_measure, function (elem) {
                                        if (elem.id == ress.data.id) {
                                            if (type == 'Volume 1')
                                                $scope.rec.unit_of_measure_1s = elem;
                                            if (type == 'Volume 2')
                                                $scope.rec.unit_of_measure_2s = elem;
                                            if (type == 'Volume 3')
                                                $scope.rec.unit_of_measure_3s = elem;
                                        }
                                    });
                                }
                            });
                    }
                });

        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }


    $scope.formData = {};

    $scope.get_empl_list = function (arg) {
        // console.log(arg);
        $scope.showLoader = true;
        $scope.columns_pr = [];
        $scope.record_pr = {};
        $scope.searchKeyword_offered = {};
        $scope.title = 'Recieved By';
        $scope.empListType = 'general';

        if (arg == 'purchaser_code') {
            $scope.title = 'Employee List';
            $scope.empListType = 'purchaser_code';
        }

        var empUrl = $scope.$root.hr + "employee/listings";

        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'limit': 9999
        };

        $http
            .post(empUrl, postData)
            .then(function (res) {

                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.columns_pr = [];
                    $scope.record_pr = {};
                    $scope.record_pr = res.data.response;


                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_pr.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.element('#_SrmEmplisting_model').modal({
                        show: true
                    });
                    return;
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });
    }

    $scope.confirm_employeeList = function (result, emptype) {
        if (emptype == 'general') {
            $scope.PriceOffer_rec.recieved_by = result.name;
            $scope.PriceOffer_rec.recieved_by_id = result.id;
        } else if (emptype == 'purchaser_code') {

            $scope.rec.purchaser_code = result.name;
            $scope.rec.purchaser_code_id = result.id;
        }

        angular.element('#_SrmEmplisting_model').modal('hide');
    }
    $scope.getOffer = function (arg) {
        $scope.columns_ship = [];
        $scope.record_ship = {};
        var new_template = '';

        if (arg == 'emp') {

            $scope.title = "Employees";
            var empUrl = $scope.$root.hr + "employee/listings";
            new_template = 'app/views/srm/_listing_employee.html';

        } else if (arg == 'prd') {

            $scope.title = "";
            template: new_template = 'app/views/srm/_listing_product_modal.html';

        } else if (arg == 'price') {

            $scope.title = "Price Offer List";
            var empUrl = $scope.$root.pr + "srm/srm/srm-price-offer-volume-list";
            new_template = 'app/views/srm/_listing_modal_new.html';
        }


        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
        };
        $http
            .post(empUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.columns_ship = [];
                    $scope.record_ship = {};
                    $scope.record_ship = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_ship.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });

        ngDialog.openConfirm({
            template: new_template,
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (result) {

            if (arg == 'emp') {
                $scope.rec_area.offered_by = result.name;
                $scope.rec_area.offered_by_id = result.id;

            } else if (arg == 'prd') {

                $scope.rec.product_id = result.id;
                $scope.rec.product_code = result.product_code;
                $scope.rec.product_description = result.description;

            } else if (arg == 'price') {

                $scope.formData.price_list_id = result.id;
                $scope.formData.product_id = result.id;
                $scope.formData.product_id = result.product_id;
                $scope.formData.product_code = result.product_code;
                $scope.formData.product_description = result.item_description;

                $scope.get_item_voume_list(1, $scope.formData.product_id);

                if (result.volume_1 != undefined) {
                    angular.forEach($scope.arr_volume_1, function (elem) {
                        if (elem.id == result.volume_1) {
                            $scope.formData.volume_1 = elem;
                        }
                    });
                }

                if (result.volume_2 != undefined) {
                    angular.forEach($scope.arr_volume_2, function (elem) {
                        if (elem.id == result.volume_2) {
                            $scope.$root.$apply(function () {
                                $scope.formData.volume_2 = elem;
                            });
                        }
                    });
                }

                if (result.volume_3 != undefined) {
                    angular.forEach($scope.arr_volume_3, function (elem) {
                        if (elem.id == result.volume_3) {
                            $scope.$root.$apply(function () {
                                $scope.formData.volume_3 = elem;
                            });
                        }
                    });
                }

                if (result.volume_1_price != undefined) {
                    $scope.formData.purchase_price_1 = result.volume_1_price;
                }

                if (result.volume_2_price != undefined) {
                    $scope.formData.purchase_price_2 = result.volume_2_price;
                }

                if (result.volume_3_price != undefined) {
                    $scope.formData.purchase_price_3 = result.volume_3_price;
                }
            }
        },
            function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
    }
    
    $scope.clear_purchase_offer = function () {
        $scope.check_readonly = false;
        $scope.rec.type = '';
        $scope.showItms = true;
        $scope.showServ = true;

        $scope.product_code = '';
        $scope.product_description = '';
        $scope.rec.offered_by = '';
        $scope.rec.offer_date = '';
        $scope.rec.offer_valid_date = '';
        $scope.rec.offer_method_ids = '';
        $scope.rec.volume_1_price = '';
        $scope.rec.unit_of_measure_1s = '';
        $scope.rec.volume_1s = '';
        $scope.rec.volume_2_price = '';
        $scope.rec.unit_of_measure_2s = '';
        $scope.rec.volume_2s = '';
        $scope.rec.volume_3_price = '';
        $scope.rec.unit_of_measure_3s = '';
        $scope.rec.volume_3s = '';
        $scope.rec.offered_date = $scope.$root.get_current_date();
        $scope.pOfferListingListingShow = false;
        $scope.pOfferListingFormShow = true;
    }

    $scope.get_price_list = function () {
        // $scope.$root.breadcrumbs[3].name = 'Price List';

        $scope.pOfferListingListingShow = true;
        $scope.pOfferListingFormShow = false;
        $scope.showLoader = true;
        var API = $scope.$root.pr + "srm/srm/srm-price-offer-listings";
        $scope.postData = {};

        $scope.postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.item_paging.spage
        };
        $http
            .post(API, $scope.postData)
            .then(function (res) {

                $scope.price_data = [];
                $scope.columns = [];
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.price_data = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
                $scope.showLoader = false;
            });
    }

    $scope.add_form_price_list = function () {
        $scope.check_readonly = false;
        $scope.rec.type = '';
        $scope.showItms = true;
        $scope.showServ = true;

        $scope.clear_purchase_offer();
        $scope.rec.offered_date = $scope.$root.get_current_date();
        $scope.pOfferListingListingShow = false;
        $scope.pOfferListingFormShow = true;
    }


    $scope.edit_form_price_list = function (id) {
        $scope.clear_purchase_offer();
        $scope.check_readonly = true;

        //$scope.rec = {};
        $scope.pOfferListingListingShow = false;
        $scope.pOfferListingFormShow = true;

        var altcontUrl = $scope.$root.pr + "srm/srm/get-srm-price-offer-by-id";
        var postViewData = {
            'token': $scope.$root.token,
            'id': id
        };

        $http
            .post(altcontUrl, postViewData)
            .then(function (res) {

                $scope.rec = res.data.response;
                $scope.rec.id = res.data.response.id;
                $scope.rec.update_id = res.data.response.id;
                $scope.rec.offered_by = res.data.response.offered_by;

                angular.forEach($scope.price_method_list, function (obj) {
                    if (obj.id == res.data.response.offer_method_id) {
                        $scope.rec.offer_method_ids = obj;
                    }
                });


                $scope.wordsLength = res.data.response.comment.length;

                if (res.data.response.primary == 'One_Four_Pallet') {
                    $scope.isPalletSet = 1;
                }

                if (res.data.response.primary == 'Half_Load') {
                    $scope.isHalfSet = 1;
                }

                if (res.data.response.primary == 'Full_Load') {
                    $scope.isFullSet = 1;
                }


                if ($scope.rec.offer_date == 0)
                    $scope.rec.offer_date = null;
                else
                    $scope.rec.offer_date = $scope.$root.convert_unix_date_to_angular($scope.rec.offer_date);

                if ($scope.rec.offer_valid_date == 0)
                    $scope.rec.offer_valid_date = null;
                else
                    $scope.rec.offer_valid_date = $scope.$root.convert_unix_date_to_angular($scope.rec.offer_valid_date);


                angular.forEach($scope.arr_OfferMethod, function (elem) {
                    if (elem.id == res.data.response.offer_method_id) {
                        $scope.rec.offer_method_ids = elem;
                    }
                });

                var empUrl = $scope.$root.pr + "srm/srm/get-alt-contact";
                $http
                    .post(empUrl, {
                        id: res.data.response.offered_by_id,
                        'token': $scope.$root.token
                    })
                    .then(function (emp_data) {
                        $scope.rec.offered_by = emp_data.data.response.contact_name;
                    });


                if (res.data.response.type == 1) {

                    $scope.showItms = true;
                    $scope.showServ = false;
                    $http
                        .post(ProductDetailsURL, {
                            product_id: res.data.response.product_id,
                            'token': $scope.$root.token
                        })
                        .then(function (prod_data) {
                            $scope.product_description = prod_data.data.response.description;
                            $scope.product_code = prod_data.data.response.product_code;
                        });

                    $scope.get_item_voume_list(1, res.data.response.product_id);
                }

                if (res.data.response.type == 2) {

                    $scope.showItms = false;
                    $scope.showServ = true;
                    var prodUrl = $scope.$root.setup + "service/products-listing/product-details";
                    $http
                        .post(prodUrl, {
                            product_id: res.data.response.product_id,
                            'token': $scope.$root.token
                        })
                        .then(function (prod_data) {
                            $scope.product_description = prod_data.data.response.description;
                            //$scope.product_barcode	= prod_data.data.response.prd_bar_code;
                            $scope.product_code = prod_data.data.response.code;
                        });


                    $http
                        .post(volumeUrl_service, {
                            type: 'Volume 1',
                            'token': $scope.$root.token
                        })
                        .then(function (vol_data) {
                            $scope.arr_volume_1 = vol_data.data.response;
                            $scope.arr_volume_1.push({
                                'id': '-1',
                                'description': '++ Add New ++'
                            });
                        });

                    $http
                        .post(volumeUrl_service, {
                            type: 'Volume 2',
                            'token': $scope.$root.token
                        })
                        .then(function (vol_data) {
                            $scope.arr_volume_2 = vol_data.data.response;
                            $scope.arr_volume_2.push({
                                'id': '-1',
                                'description': '++ Add New ++'
                            });
                        });

                    $http
                        .post(volumeUrl_service, {
                            type: 'Volume 3',
                            'token': $scope.$root.token
                        })
                        .then(function (vol_data) {
                            $scope.arr_volume_3 = vol_data.data.response;
                            $scope.arr_volume_3.push({
                                'id': '-1',
                                'description': '++ Add New ++'
                            });
                        });

                    $http
                        .post(unitUrl_service, {
                            'token': $scope.$root.token
                        })
                        .then(function (unit_data) {
                            $scope.arr_unit_of_measure = unit_data.data.response;
                            $scope.arr_unit_of_measure.push({
                                'id': '-1',
                                'title': '++ Add New ++'
                            });
                        });

                }

                angular.forEach($scope.arr_OfferMethod, function (elem) {
                    if (elem.id == res.data.response.offer_method_id) {
                        $scope.rec.offer_method_ids = elem;
                    }
                });

                angular.forEach($scope.arr_volume_1, function (elem) {
                    if (elem.id == res.data.response.volume_1) {
                        $scope.rec.volume_1s = elem;
                    }
                });

                angular.forEach($scope.arr_volume_2, function (elem) {
                    if (elem.id == res.data.response.volume_2) {
                        $scope.rec.volume_2s = elem;
                    }
                });

                angular.forEach($scope.arr_volume_3, function (elem) {
                    if (elem.id == res.data.response.volume_3) {
                        $scope.rec.volume_3s = elem;
                    }
                });

                angular.forEach($scope.arr_unit_of_measure, function (elem) {
                    if (elem.id == res.data.response.unit_of_measure_1) {
                        $scope.rec.unit_of_measure_1s = elem;
                    }
                    if (elem.id == res.data.response.unit_of_measure_2) {
                        $scope.rec.unit_of_measure_2s = elem;
                    }
                    if (elem.id == res.data.response.unit_of_measure_3) {
                        $scope.rec.unit_of_measure_3s = elem;
                    }
                });
            });
    }

    $scope.delete_price_list = function (id, index, arr_data) {
        var delUrl = $scope.$root.pr + "srm/srm/delete-srm-price-offer-listing";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };

    //----------------  Price List      ------------------------

    // ------------- 	 Supplier 	 ----------------------------------------

    $scope.selected = 0;
    $scope.total = 0;
    $scope.selected_count = 0;
    $scope.show_symbol = false;
    $scope.list_type = [{
        name: 'Percentage',
        id: 1
    }, {
        name: 'Value',
        id: 2
    }];

    $scope.onChange_volume = function (arg_id, arg_name) {
        $scope.formData_vol_1 = {};

        var id = '';
        var volume = '';
        var category = '';

        if (arg_id == 1) {
            id = this.formData.volume_1.id;
            volume = 'Volume 1';
            category = 1;
            $scope.title_type = 'Add Price Offer Volume 1 ';

        } else if (arg_id == 2) {
            id = this.formData.volume_2.id;
            volume = 'Volume 2';
            category = 1;
            $scope.title_type = 'Add Price Offer Volume 2 ';

        } else if (arg_id == 3) {
            id = this.formData.volume_3.id;
            volume = 'Volume 3';
            category = 1;
            $scope.title_type = 'Add Price Offer Volume 3 ';
        }

        if (arg_id == 11) {
            id = this.rec.volume_1_purchase.id;
            volume = 'Volume 1';
            category = 2;
            $scope.title_type = 'Add Purchase Offer Volume 1 ';

        } else if (arg_id == 22) {
            id = this.rec.volume_2_purchase.id;
            volume = 'Volume 2';
            category = 2;
            $scope.title_type = 'Add Purchase Offer Volume 1 ';

        } else if (arg_id == 33) {
            id = this.rec.volume_3_purchase.id;
            volume = 'Volume 3';
            category = 2;
            $scope.title_type = 'Add Purchase Offer Volume 1 ';
        }

        $scope.rec.volume = volume;
        $scope.rec.title_type = $scope.title_type;
        $scope.rec.ref_service_type = arg_id;
        $scope.formData_vol_1.type = arg_id;
        $scope.formData_vol_1.category = category;

        if (id == -1) {
            angular.element('#model_vol_1').modal({
                show: true
            });
            $scope.get_category_list();
        }
    }

    $scope.onChange_vol_2 = function () {

        var id = this.formData.volume_2.id;

        if (id == -1) {
            $scope.show_vol_2_pop = true;
            angular.element('#model_btn_vol_2').click();
        }

        angular.element("#name").val('');
        angular.element("#description").val('');
        $scope.name = '';
        $scope.description = '';
    }

    $scope.add_vol2_type = function (formData_vol_2) {

        $scope.formData_vol_2.token = $scope.$root.token;
        $scope.formData_vol_2.type = 2;

        $http
            .post(add_saleUrl, formData_vol_2)
            .then(function (res) {
                if (res.data.ack == true) {

                    toaster.pop('success', 'Add', 'Record  Inserted.');
                    $scope.show_vol_2_pop = false;

                    $http
                        .post(volumeUrl, {
                            type: 'Volume 2',
                            'token': $scope.$root.token
                        })
                        .then(function (vol_data) {
                            $scope.arr_volume_2 = vol_data.data.response;
                            if ($scope.user_type == 1) {
                                $scope.arr_volume_2.push({
                                    id: '-1',
                                    description: '++ Add New ++'
                                });
                            }
                        });
                } else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
            });
    }

    $scope.onChange_vol_3 = function () {
        var id = this.formData.volume_3.id;

        if (id == -1) {
            $scope.show_vol_3_pop = true;
            angular.element('#model_btn_vol_3').click();
        }

        angular.element("#name").val('');
        angular.element("#description").val('');
        $scope.name = '';
        $scope.description = '';
    }

    $scope.add_vol3_type = function (formData_vol_1) {
        $scope.formData_vol_3.token = $scope.$root.token;

        $http
            .post(add_unitUrl_service, formData_vol_1)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Add', 'Record  Inserted.');

                    $http
                        .post(unitUrl_service, {
                            type: 'Volume 3',
                            'token': $scope.$root.token
                        })
                        .then(function (vol_data) {
                            angular.element('#model_vol_3').modal('hide');
                            $scope.arr_volume_3 = vol_data.data.response;
                            if ($scope.user_type == 1) {
                                $scope.arr_volume_3.push({
                                    id: '-1',
                                    description: '++ Add New ++'
                                });
                            }
                        });
                } else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
            });
    }

    $scope.show_volume_list = function () {

        $http
            .post(volumeUrl_item, {
                type: 'Volume 1',
                'token': $scope.$root.token
            })
            .then(function (vol_data) {
                $scope.arr_volume_1 = vol_data.data.response;
                if ($scope.user_type == 1) {
                    $scope.arr_volume_1.push({
                        id: '-1',
                        description: '++ Add New ++'
                    });
                }
            });

        $http
            .post(volumeUrl_item, {
                type: 'Volume 2',
                'token': $scope.$root.token
            })
            .then(function (vol_data) {
                $scope.arr_volume_2 = vol_data.data.response;
                if ($scope.user_type == 1) {
                    $scope.arr_volume_2.push({
                        id: '-1',
                        description: '++ Add New ++'
                    });
                }
            });

        $http
            .post(volumeUrl_item, {
                type: 'Volume 3',
                'token': $scope.$root.token
            })
            .then(function (vol_data) {
                $scope.arr_volume_3 = vol_data.data.response;
                if ($scope.user_type == 1) {
                    $scope.arr_volume_3.push({
                        id: '-1',
                        description: '++ Add New ++'
                    });
                }
            });
    }


    var postUrl = $scope.$root.pr + "srm/srm/supplier_list";
    $scope.getsupplier = function () {

        // $scope.$root.breadcrumbs[3].name = 'Volume';

        $scope.show_supplier_list_voume = true;
        $scope.show_supp_form = false;

        $scope.perreadonly = true;
        $scope.check_item_readonly = false;

        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'srm_id': $scope.$root.srm_id,
            'page': $scope.item_paging.spage
        };
        $http
            .post(postUrl, $scope.postData)
            .then(function (res) {

                $scope.supplier_list = [];
                $scope.columns = [];
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;


                    $scope.supplier_list = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    $scope.showLoader = false;
                }
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400)); 
            });
    }

    $scope.fn_supplier_Form = function () {
        $scope.show_volume_list();
        $scope.show_supp_form = true;
        $scope.show_supplier_list = false;

        $scope.formData = {};
        $scope.purchase_price_1 = $scope.formData.standard_price;

        $scope.purchase_price_2 = $scope.formData.standard_price;

        $scope.purchase_price_3 = $scope.formData.standard_price;


        angular.element("#sp_id").val('');
        $scope.sp_id = '';

        $scope.formData.volume_1 = '';
        $scope.formData.supplier_type_1 = '';
        $scope.formData.discount_value_1 = '';
        $scope.formData.discount_price_1 = 0;

        $scope.formData.volume_2 = '';
        $scope.formData.supplier_type_2 = '';
        $scope.formData.discount_value_2 = '';
        $scope.formData.discount_price_2 = 0;
        $scope.formData.volume_3 = '';
        $scope.formData.supplier_type_3 = '';
        $scope.formData.discount_value_3 = '';
        $scope.formData.discount_price_3 = 0;

        $scope.formData.start_date = '';
        $scope.formData.end_date = '';
    }

    $scope.add_supplier = function (formData) {
        var updateUrl = $scope.$root.pr + "srm/srm/update_product_values";
        $scope.formData.product_id = $scope.$root.srm_id;
        $scope.formData.token = $scope.$root.token;
        $scope.formData.tab_id_2 = 4;
        $scope.formData.sp_id = $scope.sp_id;

        $scope.formData.volume_ids = $scope.formData.volume_id !== undefined ? $scope.formData.volume_id.id : 0;
        $scope.formData.supplier_types = $scope.formData.supplier_type_11 !== undefined ? $scope.formData.supplier_type_11.id : 0;

        $scope.formData.volume_1s = $scope.formData.volume_1 !== undefined ? $scope.formData.volume_1.id : 0;
        $scope.formData.supplier_type_1s = $scope.formData.supplier_type_1 !== undefined ? $scope.formData.supplier_type_1.id : 0;

        $scope.formData.volume_2s = $scope.formData.volume_2 !== undefined ? $scope.formData.volume_2.id : 0;
        $scope.formData.supplier_type_2s = $scope.formData.supplier_type_2 !== undefined ? $scope.formData.supplier_type_2.id : 0;

        $scope.formData.volume_3s = $scope.formData.volume_3 !== undefined ? $scope.formData.volume_3.id : 0;
        $scope.formData.supplier_type_3s = $scope.formData.supplier_type_3 !== undefined ? $scope.formData.supplier_type_3.id : 0;


        if ($scope.formData.sp_id == "") {
            if (($scope.formData.volume_2s == '-1') || ($scope.formData.volume_3s == '-1')) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Volumes']));
                return;
            }
        }


        var errorFlag = false;


        if ($scope.formData.sp_id == "") {
            angular.element('#dpval ul').hide();
            if ($scope.formData.discount_value_1 != "") {
                if ($scope.formData.discount_price_1 <= 0) {
                    angular.element('#parsley-id-dp1530').show();
                    errorFlag = true;
                } else {
                    angular.element('#parsley-id-dp1530').hide();
                }
            }

            if ($scope.formData.volume_2 != "" || $scope.formData.supplier_type_2 != "" || ($scope.formData.discount_value_2 != undefined && $scope.formData.discount_value_2 != "")) {
                if ($scope.formData.discount_price_2 <= 0) {
                    angular.element('#parsley-id-dp2530').show();
                    errorFlag = true;
                } else {
                    angular.element('#parsley-id-dp2530').hide();
                }
            }

            if ($scope.formData.volume_3 != "" || $scope.formData.supplier_type_3 != "" || ($scope.formData.discount_value_3 != undefined && $scope.formData.discount_value_3 != "")) {
                if ($scope.formData.discount_price_3 <= 0) {
                    angular.element('#parsley-id-dp3530').show();
                    errorFlag = true;
                } else {
                    angular.element('#parsley-id-dp3530').hide();
                }
            }
        } else {
            if ($scope.formData.discount_value_11 != "") {
                if ($scope.formData.discount_price_11 <= 0) {
                    angular.element('#dpval ul').hide();
                    angular.element('#parsley-id-dppop0530').show();
                    errorFlag = true;
                } else {
                    angular.element('#parsley-id-dppop0530').hide();
                }
            }
        }

        if (errorFlag)
            return;

        $http
            .post(updateUrl, $scope.formData)
            .then(function (res) {
                if (res.data.ack == true) {
                    if (res.data.tab_change == 'tab_supplier') {
                        $scope.getsupplier();
                        // $scope.show_supplier_pop= false; 
                        angular.element('#model_btn_supplier').modal('hide');
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    }
                } else {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                }
            });
    }

    $scope.show_sp_edit_form = function (id) {

        var postUrl = $scope.$root.pr + "srm/srm/supplier_by_id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };
        $scope.formData.sp_id = id;
        $scope.sp_id = id;

        $http
            .post(postUrl, postViewBankData)
            .then(function (res) {

                if (res.data.response.start_date == 0)
                    $scope.formData.start_date = null;
                else
                    $scope.rec.start_date = $scope.$root.convert_unix_date_to_angular(res.data.response.start_date);

                if (res.data.response.end_date == 0)
                    $scope.formData.end_date = null;
                else
                    $scope.rec.end_date = $scope.$root.convert_unix_date_to_angular(res.data.response.end_date);

                $scope.formData.discount_value = res.data.response.discount_value;


                angular.forEach($scope.list_type, function (obj) {
                    if (obj.id == res.data.response.supplier_type) {
                        $scope.formData.supplier_type = obj;
                    }
                });

                $scope.get_item_voume_list(1, res.data.response.product_id);

                angular.forEach($scope.arr_volume_1, function (obj) {
                    //console.log(obj.id == res.data.response.volume_1);
                    if (obj.id == res.data.response.volume_1) {
                        $scope.formData.volume_1 = obj;
                    }
                });


                angular.forEach($scope.arr_volume_2, function (obj) {
                    if (obj.id == res.data.response.volume_2) {
                        $scope.formData.volume_2 = obj;
                    }
                });

                angular.forEach($scope.arr_volume_3, function (obj) {
                    if (obj.id == res.data.response.volume_3) {
                        $scope.formData.volume_3 = obj;
                    }
                });
            });
    }

    $scope.delete_sp = function (id, index, arr_data) {

        var delUrl = $scope.$root.pr + "srm/srm/delete_sp_id";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    $scope.supplier_pop = function (id, pid) {

        angular.element('#model_btn_supplier').modal({
            show: true
        });
        $scope.get_item_voume_list(1, pid);

        var postUrl = $scope.$root.pr + "srm/srm/supplier_by_id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };

        $scope.formData.sp_id = id;
        $scope.sp_id = id;

        $http
            .post(postUrl, postViewBankData)
            .then(function (res) {
                $scope.formData.purchase_price_1 = res.data.response.purchase_price;
                $scope.formData.discount_price_1 = res.data.response.discount_price;
                $scope.formData.discount_value = res.data.response.discount_value;
                $scope.formData.volume_1 = res.data.response.volume_1;
                $scope.formData.volume_2 = res.data.response.volume_2;
                $scope.formData.volume_3 = res.data.response.volume_3;

                $scope.formData.purchase_price_11 = res.data.response.purchase_price;
                $scope.formData.discount_value_11 = res.data.response.discount_value;
                $scope.formData.discount_price_11 = res.data.response.discount_price;


                angular.forEach($scope.list_type, function (obj) {
                    if (obj.id == res.data.response.supplier_type) {
                        $scope.formData.supplier_type_11 = obj;
                    }
                });

                angular.forEach($scope.arr_volume_1, function (obj) {
                    if (obj.id == res.data.response.volume_id) {
                        $scope.formData.volume_id = obj;
                    }
                });

                angular.forEach($scope.arr_volume_2, function (obj) {
                    if (obj.id == res.data.response.volume_id) {
                        $scope.formData.volume_id = obj;
                    }
                });

                angular.forEach($scope.arr_volume_3, function (obj) {
                    if (obj.id == res.data.response.volume_id) {
                        $scope.formData.volume_id = obj;
                    }
                });
            });
    }

    $scope.show_price_one_pop = function () {
        var price = 0;
        var final_price = 0;

        price = $scope.formData.purchase_price_11;
        var f_id = this.formData.supplier_type_11.id;

        if (f_id == 1) {
            final_price_one = (parseFloat($scope.formData.discount_value_11)) * (parseFloat(price)) / 100;
            final_price = (parseFloat(price)) - (parseFloat(final_price_one));

        } else if (f_id == 2) {
            final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value_11));
        }

        $scope.formData.discount_price_11 = final_price;
    }

    $scope.setSymbol_pop = function (div_id) {
        var id = angular.element('#type_' + div_id).val();

        if (id == 0)
            angular.element('#date_msg_' + div_id).show();
        else
            angular.element('#date_msg_' + div_id).hide();
    }


    //--------------------   Supplier End--------------------	


    //////////////////////Empleyees//////////////////////////////////////////
    $scope.searchKeyword = {};
    $scope.gethr_list = function (item_paging, sort_column, sortform) {

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        if (item_paging == 1) $scope.item_paging.spage = 1;
        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        $scope.postData.searchKeyword = $scope.searchKeyword.$;
        $scope.postData.deprtments = $scope.searchKeyword.deprtment !== undefined ? $scope.searchKeyword.deprtment.id : 0;
        $scope.postData.emp_types = $scope.searchKeyword.emp_type !== undefined ? $scope.searchKeyword.emp_type.id : 0;
        $scope.postData.filter_status = $scope.searchKeyword.status !== undefined ? $scope.searchKeyword.status.id : "";
        $scope.postData.job_titles = $scope.searchKeyword.job_title !== undefined ? $scope.searchKeyword.job_title.id : 0;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_ship = {};
        }


        //sort by column

        if ((sort_column != undefined) && (sort_column != null)) {
            console.log(sort_column);
            $scope.postData.sort_column = sort_column;
            $scope.postData.sortform = sortform;

            $rootScope.sortform = sortform;
            $rootScope.reversee = ('desc' === $rootScope.sortform) ? !$rootScope.reversee : false;
            $rootScope.sort_column = sort_column;

            $rootScope.save_single_value($rootScope.sort_column, 'hrsort_name');
        }

        var HrApi = $scope.$root.hr + "employee/listings";

        $scope.showLoader = true;

        $http
            .post(HrApi, $scope.postData)
            .then(function (res) {
                $scope.columns = [];
                $scope.record_data = {};
                if (res.data.ack == true) {

                    $scope.columns_pr = [];
                    $scope.record_pr = {};
                    $scope.record_pr = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_pr.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    $scope.showLoader = false;
                } else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                    $scope.showLoader = false;
                }
            });
    }

    $scope.searchAreas = {};
    $scope.search_covered_areas = function (item_paging, sort_column, sortform) {
        //console.log($scope.searchAreas);
        if ($scope.searchAreas.$ == "" || $scope.searchAreas.$ == undefined) {
            toaster.pop('error', 'Info', 'Must Enter Search Keyword');
            $scope.showLoader = false;
            return;
        } else if ($scope.searchAreas.$.length < 3) {
            toaster.pop('error', 'Info', 'Enter 3 Search Keyword Atleast');
            $scope.showLoader = false;
            return;
        }

        //console.log($scope.searchAreas);
        $scope.record_areas = {};
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        if (item_paging == 1) $scope.item_paging.spage = 1;
        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        $scope.postData.searchAreas = $scope.searchAreas.$;
        $scope.postData.country = $scope.searchAreas.country !== undefined ? $scope.searchAreas.country.country : 0;


        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchAreas = {};
            $scope.record_areas = {};
        }

        var HrApi = $scope.$root.pr + "srm/srm/search-covered-areas";
        // new_template = 'app/views/srm/_listing_employee.html';

        $scope.showLoader = true;

        $http
            .post(HrApi, $scope.postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.columns_areas = [];
                    $scope.record_areas = {};
                    $scope.record_areas = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        if (isNaN(index)) {
                            $scope.columns_areas.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }
                    });
                    $scope.showLoader = false;
                } else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                    $scope.showLoader = false;
                }
            });
    }

    $scope.get_location_from = function () {

        var prodApi = $scope.$root.pr + "srm/srm/get-warehouses-and-company-addresses";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
        };

        return $http
            .post(prodApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.$root.location_from = res.data.response;
                    return 1;
                }
                else
                    return 0;
            });

    }

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function () {
        console.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.setItemsPerPage = function (num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1; //reset to first paghe
    }



    // $scope.get_covered_areas = function () {
    //     angular.element('#_areaModal').modal({
    //         show: true
    //     });
    //     $scope.rec_area.valid_to = result.name + ' - ' + result.postcode + ' - ' + result.county + ' - ' + result.region + ' - ' + result.country;
    //     $scope.rec_area.valid_to_id = result.id;
        
    //     // ngDialog.openConfirm({
    //     //     template: 'app/views/srm/_listing_areas.html',
    //     //     className: 'ngdialog-theme-default',
    //     //     scope: $scope
    //     // }).then(function (result) {

    //     //     $scope.rec_area.valid_to = result.name + ' - ' + result.postcode + ' - ' + result.county + ' - ' + result.region + ' - ' + result.country;
    //     //     $scope.rec_area.valid_to_id = result.id;
    //     // },
    //     //     function (reason) {
    //     //         console.log('Modal promise rejected. Reason: ', reason);
    //     //     });
    // }



    $scope.get_item_voume_list = function (id) {

        var volumeUrl_item = $scope.$root.pr + "srm/srm/get-srm-offer-volume-by-type";
        var addvolumeUrl_item = $scope.$root.pr + "srm/srm/add-srm-offer-volume";
        var arIds = [];

        arIds.push($scope.PriceOffer_rec.id);

        var isAdded = false;
        if ($scope.isAdded && !$scope.formData.id)
            isAdded = true;

        $scope.volCounter = 0;
        $http
            .post(volumeUrl_item, {
                isAdded: isAdded,
                supplier_price_info_id: arIds,
                'token': $scope.$root.token
            })
            .then(function (vol_data) {

                $scope.arr_volume_1 = [];
                $scope.select_volume_1 = [];

                ////console.log(vol_data);
                if (vol_data.data.ack > 0) {

                    $scope.arr_volume_1.push({
                        'id': '0',
                        'name': ''
                    });

                    if ($scope.PriceOffer_rec.id > 0 || $scope.formData.id > 0) {

                        angular.forEach(vol_data.data.response, function (obj) {
                            $scope.arr_volume_1.push(obj);
                        });

                        angular.forEach($scope.arr_volume_1, function (obj) {
                            if (id == obj.id)
                                $scope.formData.volume_1 = obj;
                        });
                    } else {
                        angular.forEach(vol_data.data.response, function (obj) {
                            $scope.arr_volume_1.push(obj);
                            $scope.select_volume_1.push(obj);
                        });

                        $scope.formData.volume_1 = $scope.select_volume_1;
                    }
                    $scope.arr_volume_1.push({
                        'id': '-1',
                        'name': '++ Add New ++'
                    });
                } else
                    $scope.arr_volume_1.push({
                        'id': '-1',
                        'name': '++ Add New ++'
                    });
            });
    }


    //---------------- Rebate    ------------------------


    //$scope.$root.load_date_picker('srm');


    $scope.item_paging = {};
    $scope.itemselectPage = function (pageno) {
        $scope.item_paging.spage = pageno;
    };


    $scope.$root.set_document_internal($scope.$root.srm_general_tab_module);

    $scope.row_id = $stateParams.id;
    $scope.module_id = 105;
    $scope.subtype = 3;
    $scope.module = "Purchases & SRM";
    $scope.module_name = "SRM";
    //$scope.module_code= $scope.$root.model_code ;
    //console.log( $scope.module_id+'call'+$scope.module+'call'+$scope.module_name+'call'+$scope.module_code);
    $scope.$root.$broadcast("image_module", $scope.row_id, $scope.module, $scope.module_id, $scope.module_name, $scope.module_code, $scope.subtype, $scope.$root.tab_id);


}



/*************************************************
// Common tabs in Srm & Supplier Controller Start
/*************************************************/

myApp.controller('CommonSrmSupplierController', function CommonSrmSupplierController($scope, $filter, $http, $state, $resource, ngDialog, toaster, $timeout, $rootScope, $stateParams, Upload, SubmitContactLoc, SubmitPrice,jsreportService) {
    'use strict';


    // console.log($stateParams.isPriceOffer);

    // reload Setup global data
    $rootScope.get_global_data(1);

    $scope.module = $stateParams.module;
	// $scope.searchKeyword = {};
	// $scope.dontShowModal = false;
	

    $scope.supplierPrice = true;

    $scope.offeredByColumnsShowSrm = [
        "name", "job_title", "direct_line"
    ]

    if ($stateParams.isPriceOffer != undefined)
        $scope.isPriceOffer = 1;
    else
        $scope.isPriceOffer = 0;

    $scope.searchKeyword = {};

    /////////////// contact ////////////////////
    $scope.edit_contact_form = function (id, mode) {
        $scope.altContacFormShow = true;
        $scope.altContacListingShow = false;

        $scope.reset_contact_Form();
        $scope.showLoader = true;

        if (id > 0) {

            $scope.selected_data_loc_contact = [{
                id: ''
            }];

            $scope.record_data_contact = [];

            $scope.check_contact_readonly = true;
            var altcontUrl = $scope.$root.pr + "srm/srm/get-alt-contact-by-id";
            angular.element('.accordion-toggle').trigger('click');

            $http
                .post(altcontUrl, {
                    'id': id,
                    'module_type': 2,
                    'token': $scope.$root.token
                })
                .then(function (res) {

                    if (res.data.ack == true) {

                        $scope.rec_contact = {};
                        $scope.rec_contact = res.data.response;
                        $scope.rec_contact.id = res.data.response.id;

                        $scope.record_data_contact = res.data.response.loc;
                        $scope.selected_data_loc_contact = res.data.response.ContactLoc;

                        $scope.rec_contact.showdata2 = 0;

                        if ($scope.record_data_contact != undefined && $scope.selected_data_loc_contact != undefined) {
                            angular.forEach($scope.record_data_contact, function (obj) {
                                obj.chk = false;

                                angular.forEach($scope.selected_data_loc_contact, function (obj2) {
                                    if (obj.id == obj2.id) {
                                        obj.chk = true;
                                        $scope.rec_contact.showdata2++;
                                    }
                                });
                            });
                        }

                        // console.log($scope.record_data_contact);

                        angular.forEach($rootScope.country_type_arr, function (obj) {
                            if (obj.id == res.data.response.country)
                                $scope.rec_contact.alt_country_id = obj;
                        });

                        angular.forEach($rootScope.arr_pref_method_comm, function (obj) {
                            if (obj.id == res.data.response.pref_method_of_communication)
                                $scope.drp.pref_mthod_of_comm = obj;
                        });
                        // angular.forEach($scope.arr_pref_method_comm, function (obj) {
                        //     if (obj.id == res.data.response.pref_method_of_communication)
                        //         $scope.drp.pref_mthod_of_comm = obj;
                        // });

                        $scope.tempSocialMedia = [];

                        angular.forEach($rootScope.social_medias, function (obj) {

                            if (obj.id == res.data.response.socialmedia1 && res.data.response.socialmedia1 != 0) {
                                obj.value = res.data.response.socialmedia1_value;
                                $scope.tempSocialMedia.push(obj);
                            }
                            if (obj.id == res.data.response.socialmedia2 && res.data.response.socialmedia2 != 0) {
                                obj.value = res.data.response.socialmedia2_value;
                                $scope.tempSocialMedia.push(obj);
                            }
                            if (obj.id == res.data.response.socialmedia3 && res.data.response.socialmedia3 != 0) {
                                obj.value = res.data.response.socialmedia3_value;
                                $scope.tempSocialMedia.push(obj);
                            }
                            if (obj.id == res.data.response.socialmedia4 && res.data.response.socialmedia4 != 0) {
                                obj.value = res.data.response.socialmedia4_value;
                                $scope.tempSocialMedia.push(obj);
                            }
                            if (obj.id == res.data.response.socialmedia5 && res.data.response.socialmedia5 != 0) {
                                obj.value = res.data.response.socialmedia5_value;
                                $scope.tempSocialMedia.push(obj);
                            }
                        });
                        if ($scope.tempSocialMedia.length) {
                            $scope.socialMediasContactArr = {};
                            $scope.socialMediasContactArr['socialMediasContact'] = $scope.tempSocialMedia;
                        }
                        // $scope.rec_contact.showdata2 = res.data.response.showdata;
                    }
                    $scope.showLoader = false;
                });

            if (mode == 1)
                $scope.check_contact_readonly = true;
            else if (mode == 0)
                $scope.check_contact_readonly = false;

        } else {

            $scope.rec_contact = {};
            $scope.check_contact_readonly = false;
            $scope.rec_contact.showdata2 = 0;
            $scope.showLoader = false;
        }
    }

    $scope.loc_columns = [];
    $scope.loc_record_data = {};

    $scope.showLocationListing = function () {
        $scope.altDepotListingShow = true;
        $scope.altDepotFormShow = false;
    }

    $scope.reset_contact_Form = function (rec_contact) {
        $scope.rec_contact = {};

        $scope.rec_contact.alitcotact_scoial = [{ id: '' }];
        $scope.selected_data_loc_contact = [{ id: '' }];

        $scope.tempSocialMedia = [];
        $scope.socialMediasContactArr = {};
        $rootScope.social_medias_contact_form = [];
        angular.forEach($rootScope.social_medias, function (element) {
            if (element.value != undefined && element.value.length > 0)
                delete element.value;
        });
        angular.copy($rootScope.social_medias, $rootScope.social_medias_contact_form);
        angular.element("#alt_contact").parsley().reset();

        angular.forEach($rootScope.country_type_arr, function (elem) {
            if (elem.id == $scope.$root.defaultCountry)
                $scope.rec_contact.alt_country_id = elem;
        });
        $scope.reset_loc_Form();
    }

    $scope.reset_loc_Form = function () {

        $scope.rec_loc = {};
        $scope.drp = {};

        $scope.rec_loc.loccaiontiming = {}
        $scope.rec_loc.addcontactslisting = {}
        $scope.rec_loc.addcontactslisting = [{
            id: ''
        }];
        $scope.record_data_contact_list = {};
        // //console.log($scope.rec_loc);
        angular.element("#alt_location").parsley().reset();

        angular.forEach($rootScope.country_type_arr, function (elem) {
            if (elem.id == $scope.$root.defaultCountry)
                $scope.rec_loc.depo_country_id = elem;
        });

        $scope.isselectcontactlocchk = false;

        $scope.selected_data_loc_contact = [{
            id: ''
        }];
    }

    $scope.SetDetailEmptyOnUncheck = function () {
        if (angular.element('#locis_delivery_collection_address').is(':checked') == false) {
            $scope.rec_loc.is_delivery_collection_address = 0;
            $scope.EmptyDeliveryDetailRec();
        }
    }

    $scope.EmptyDeliveryDetailRec = function () {
        $scope.rec_loc.booking_contact = "";
        $scope.rec_loc.booking_job_title = "";
        $scope.rec_loc.booking_direct_line = "";
        $scope.rec_loc.booking_mobile = "";
        $scope.rec_loc.booking_telephone = "";
        $scope.rec_loc.booking_fax = "";
        $scope.rec_loc.booking_email = "";
        $scope.drp.booking_pref_mthod_of_comm = "";


        $scope.rec_loc.monday_start_time = "";
        $scope.rec_loc.monday_end_time = "";
        $scope.rec_loc.monday_notes = "";

        $scope.rec_loc.tuesday_start_time = "";
        $scope.rec_loc.tuesday_end_time = "";
        $scope.rec_loc.tuesday_notes = "";

        $scope.rec_loc.wednesday_start_time = "";
        $scope.rec_loc.wednesday_end_time = "";
        $scope.rec_loc.wednesday_notes = "";

        $scope.rec_loc.thursday_start_time = "";
        $scope.rec_loc.thursday_end_time = "";
        $scope.rec_loc.thursday_notes = "";

        $scope.rec_loc.friday_start_time = "";
        $scope.rec_loc.friday_end_time = "";
        $scope.rec_loc.friday_notes = "";

        $scope.rec_loc.saturday_start_time = "";
        $scope.rec_loc.saturday_end_time = "";
        $scope.rec_loc.saturday_notes = "";

        $scope.rec_loc.sunday_start_time = "";
        $scope.rec_loc.sunday_end_time = "";
        $scope.rec_loc.sunday_notes = "";
    }

    $scope.showEditForm_contact = function () {
        $scope.check_contact_readonly = false;
    }

    $scope.getAltContacts = function (arg) {
        $scope.showLoader = true;
        $scope.altContacFormShow = false;
        $scope.altContacListingShow = false;
     
        // $scope.$root.breadcrumbs[3].name = 'Other Contacts';
        var ApiAjax = $scope.$root.pr + "srm/srm/alt-contacts";
        $scope.postData = {
            'module_type': 2,
            'acc_id': $stateParams.id,
            token: $scope.$root.token
        }

        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res) {
                $scope.loc_columns = [];
                $scope.columns_contact = [];
                $scope.record_data_contact = [];
                if (res.data.record.ack == true) {

                    $scope.record_data_contact = res.data.record.result;

                    if (arg != undefined) {

                        //object was not defined at time of contact assigning to location 
                        $scope.rec_contact = {};

                        $scope.get_contact_location_dropdown($scope.rec_loc.id, 1);

                    } else {
                        $scope.record_ContactLoc = res.data.record.result;
                    }

                    angular.forEach($scope.record_data_contact[0], function (val, index) {
                        if (index != 'chk' && index != 'id') {
                            $scope.loc_columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                            $scope.columns_contact.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }
                    });
                    $scope.showLoader = false;
                }
                $scope.altContacListingShow = true;
                $scope.showLoader = false;
            });
    }

    $scope.EmptyDeliveryDetailRec = function () {
        $scope.rec_loc.booking_contact = "";
        $scope.rec_loc.booking_job_title = "";
        $scope.rec_loc.booking_direct_line = "";
        $scope.rec_loc.booking_mobile = "";
        $scope.rec_loc.booking_telephone = "";
        $scope.rec_loc.booking_fax = "";
        $scope.rec_loc.booking_email = "";
        $scope.drp.booking_pref_mthod_of_comm = "";


        $scope.rec_loc.monday_start_time = "";
        $scope.rec_loc.monday_end_time = "";
        $scope.rec_loc.monday_notes = "";

        $scope.rec_loc.tuesday_start_time = "";
        $scope.rec_loc.tuesday_end_time = "";
        $scope.rec_loc.tuesday_notes = "";

        $scope.rec_loc.wednesday_start_time = "";
        $scope.rec_loc.wednesday_end_time = "";
        $scope.rec_loc.wednesday_notes = "";

        $scope.rec_loc.thursday_start_time = "";
        $scope.rec_loc.thursday_end_time = "";
        $scope.rec_loc.thursday_notes = "";

        $scope.rec_loc.friday_start_time = "";
        $scope.rec_loc.friday_end_time = "";
        $scope.rec_loc.friday_notes = "";

        $scope.rec_loc.saturday_start_time = "";
        $scope.rec_loc.saturday_end_time = "";
        $scope.rec_loc.saturday_notes = "";

        $scope.rec_loc.sunday_start_time = "";
        $scope.rec_loc.sunday_end_time = "";
        $scope.rec_loc.sunday_notes = "";
    }

    $scope.loc_editForm = function (id, mode) {

        $scope.showLoader = true;
        $scope.altDepotFormShow = true;
        $scope.altDepotListingShow = false;
        
        if (id > 0) {

            $scope.reset_loc_Form();

            var altdepotUrl = $scope.$root.pr + "srm/srm/get-alt-depot";

            $http
                .post(altdepotUrl, {
                    'id': id,
                    'module_type': 2,
                    'acc_id': $stateParams.id,
                    'token': $scope.$root.token
                })
                .then(function (res) {

                    if (res.data.ack == true) {

                        console.log('res: ', res);
                        $scope.rec_loc = res.data.response;
                        $scope.rec_loc.id = res.data.response.id;

                        angular.forEach($rootScope.country_type_arr, function (elem) {
                            if (elem.id == res.data.response.country)
                                $scope.rec_loc.depo_country_id = elem;
                        });

                        angular.forEach($rootScope.arr_pref_method_comm, function (elem) {
                            if (elem.id == res.data.response.pref_method_of_communication)
                                $scope.drp.pref_mthod_of_comm = elem;

                            if (elem.id == res.data.response.clpref_method_of_communication)
                                $scope.drp.booking_pref_mthod_of_comm = elem;
                        });

                        /* angular.forEach($scope.arr_pref_method_comm, function (elem) {
                            if (elem.id == res.data.response.pref_method_of_communication)
                                $scope.drp.pref_mthod_of_comm = elem;

                            if (elem.id == res.data.response.clpref_method_of_communication)
                                $scope.drp.booking_pref_mthod_of_comm = elem;
                        }); */

                        $scope.rec_loc.showdata2 = 0;


                        $scope.record_ContactLoc = res.data.loc_contact;
                        $scope.record_data_contact = res.data.loc_contact;
                        $scope.selected_data_loc_contact = res.data.response.ContactLoc;

                        if ($scope.record_data_contact != undefined && $scope.selected_data_loc_contact != undefined) {
                            angular.forEach($scope.record_data_contact, function (obj) {
                                obj.chk = false;

                                angular.forEach($scope.selected_data_loc_contact, function (obj2) {
                                    if (obj.id == obj2.id) {
                                        obj.chk = true;
                                        $scope.rec_loc.showdata2++;
                                    }
                                });
                            });
                        }

                        if (res.data.loc_contact != undefined) {
                            angular.forEach(res.data.loc_contact, function (obj) {
                                if (obj.id == res.data.response.alt_contact_id)
                                    $scope.rec_loc.booking_contact = obj;
                            });
                        }

                        $scope.rec_loc.booking_job_title = res.data.response.cljob_title;
                        $scope.rec_loc.booking_direct_line = res.data.response.cldirect_line;
                        $scope.rec_loc.booking_mobile = res.data.response.clmobile;
                        $scope.rec_loc.booking_email = res.data.response.clemail;
                        $scope.rec_loc.booking_telephone = res.data.response.clphone;
                        $scope.rec_loc.booking_fax = res.data.response.clfax;

                        if (res.data.response.gen_office_phone)
                            $scope.rec_loc.phone = res.data.response.gen_office_phone;
                        else
                            $scope.rec_loc.phone = res.data.response.telephone;

                        // $scope.rec_loc.showdata2 = res.data.response.showdata;

                    }
                    $scope.showLoader = false;

                }).catch(function (message) {
                    throw new Error(message.data);
                });

            if (mode == 1)
                $scope.check_alt_depot_readonly = true;
            else if (mode == 0)
                $scope.check_alt_depot_readonly = false;

        } else {            
            $scope.getAltContacts();
            $scope.rec_loc = {};
            $scope.reset_loc_Form();
            $scope.check_alt_depot_readonly = false;
            $scope.rec_loc.showdata2 = 0;
            // $scope.$root.breadcrumbs[3].name = 'Other Locations';
            //$scope.showLoader = false;
        }
    }

    $scope.delete_contact = function (id) {

        var delUrl = $scope.$root.pr + "srm/srm/delete-alt-contact";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: id,
                    acc_id: $stateParams.id,
                    module_type: 2,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () {
                            $scope.getAltContacts();
                        }, 1500)
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.delete_location = function (id) {
        var delUrl = $scope.$root.pr + "srm/srm/delete-alt-depot";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: id,
                    acc_id: $stateParams.id,
                    module_type: 2,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () {
                            $scope.getAltLocation();
                        }, 1500)
                    } else
                        toaster.pop('error', 'Deleted', 'Record cannot be deleted!');

                });
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });

    }

    $scope.isCheced = false;

    $scope.showEditForm_loc = function () {
        $scope.check_alt_depot_readonly = false;
    }

    $scope.record_data_contact = {};
    $scope.getAltLocation = function (arg) {
        $scope.showLoader = true;
        $scope.loc_columns = [];
        $scope.columns_Loc = [];
        $scope.record_data_contact = {};
        // $scope.$root.breadcrumbs[3].name = 'Other Locations';

        var ApiAjax = $scope.$root.pr + "srm/srm/alt-depots";
        $scope.postData = {
            'module_type': '2',
            'acc_id': $stateParams.id,
            token: $scope.$root.token
        }

        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res) {

                $scope.showLoader = false;
                $scope.altDepotListingShow = true;
                $scope.altDepotFormShow = false;

                $scope.loc_record_data = {};
                if (res.data.record.ack == true) {

                    $scope.loc_record_data = res.data.record.result;

                    if (arg != undefined) {
                        $scope.record_data_contact = res.data.record.result;
                        $scope.get_contact_location_dropdown($scope.rec_contact.id, 2);
                    }

                    angular.forEach($scope.loc_record_data[0], function (val, index) {
                        if (index != 'chk' && index != 'id') {
                            $scope.loc_columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });

                            $scope.columns_Loc.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }
                    });
                }
            });
    }

    $scope.add_contact = function (rec_contact, drp) {

        rec_contact.acc_id = $scope.$root.srm_id;
        rec_contact.module_type = $rootScope.SRMType;
        rec_contact.social_media_arr_contact = $scope.socialMediasContactArr.socialMediasContact;

        // console.log($scope.selected_data_loc_contact);

        SubmitContactLoc.contact(rec_contact, drp, $scope.record_data_contact, $scope.selected_data_loc_contact)
            .then(function (result) {
                //console.log(result);
                if (result == true) {
                    $scope.getAltContacts();
                }
            }, function (error) {
                console.log(error);
            });

        return;
    }

    $scope.add_location = function (rec_loc, drp) {
       
        // testingtimings
        let monday_startTime = new Date("11/22/2022 " + $scope.rec_loc.monday_start_time);
        let monday_endTime = new Date("11/22/2022 " + $scope.rec_loc.monday_end_time);
        
        let tuesday_startTime = new Date("11/22/2022 " + $scope.rec_loc.tuesday_start_time);
        let tuesday_endTime = new Date("11/22/2022 " + $scope.rec_loc.tuesday_end_time);

        let wednesday_startTime = new Date("11/22/2022 " + $scope.rec_loc.wednesday_start_time);
        let wednesday_endTime = new Date("11/22/2022 " + $scope.rec_loc.wednesday_end_time);

        let thursday_startTime = new Date("11/22/2022 " + $scope.rec_loc.thursday_start_time);
        let thursday_endTime = new Date("11/22/2022 " + $scope.rec_loc.thursday_end_time);

        let friday_startTime = new Date("11/22/2022 " + $scope.rec_loc.friday_start_time);
        let friday_endTime = new Date("11/22/2022 " + $scope.rec_loc.friday_end_time);

        let saturday_startTime = new Date("11/22/2022 " + $scope.rec_loc.saturday_start_time);
        let saturday_endTime = new Date("11/22/2022 " + $scope.rec_loc.saturday_end_time);

        let sunday_startTime = new Date("11/22/2022 " + $scope.rec_loc.sunday_start_time);
        let sunday_endTime = new Date("11/22/2022 " + $scope.rec_loc.sunday_end_time);

        if (rec_loc.is_primary > 0 && !rec_loc.address && !rec_loc.postcode){
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(652));
            return false;
        }


        if (monday_startTime > monday_endTime || 
            tuesday_startTime > tuesday_endTime ||
            wednesday_startTime > wednesday_endTime ||
            thursday_startTime > thursday_endTime ||
            friday_startTime > friday_endTime ||
            saturday_startTime > saturday_endTime ||
            sunday_startTime > sunday_endTime            
            ){
             toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(648));
         } else {
            rec_loc.acc_id = $scope.$root.srm_id;
            rec_loc.module_type = $rootScope.SRMType;

            if (rec_loc.is_billing_address || rec_loc.is_invoice_address) {
                // api to check dublication address
                var ApiAddressdublication = $scope.$root.sales + "crm/crm/checkAddressDuplication";
                $scope.postDublicationData = {
                    token: $scope.$root.token,
                    rec: rec_loc
                }

                $http
                    .post(ApiAddressdublication, $scope.postDublicationData)
                    .then(function (res) {
                        var templateName = "";
                        if (res.data.billing == 1 && res.data.payment == 1) {
                            templateName = "modalBillingPaymentDialogId";
                        }
                        else if (res.data.billing == 1) {
                            templateName = "modalBillingDialogId";

                        }
                        else if (res.data.payment == 1) {
                            templateName = "modalPaymentDialogId";
                        }
                        if (templateName) {
                            $scope.showLoader = true;
                            var updateDuplicationAddressUrl = $scope.$root.sales + "crm/crm/updateDuplicationAddress";
                            ngDialog.openConfirm({
                                template: templateName,
                                className: 'ngdialog-theme-default-custom'
                            }).then(function (value) {
                                $http
                                    .post(updateDuplicationAddressUrl, {
                                        reccheckaddress: res.data,
                                        rec: rec_loc,
                                        'token': $scope.$root.token
                                    })
                                    .then(function (res) {
                                        SubmitContactLoc.location(rec_loc, drp, $scope.record_data_contact, $scope.selected_data_loc_contact)
                                            .then(function (result) {
                                                if (result == true)
                                                    $scope.getAltLocation();
                                                $scope.showLoader = false;
                                            }, function (error) {
                                                console.log(error);
                                            });
                                    });
                            }, function (reason) {
                                    $scope.showLoader = false;
                                //console.log('Modal promise rejected. Reason: ', reason);
                            }).catch(function (e) {
                                throw new Error(e.data);
                            });
                        }
                        else {
                            SubmitContactLoc.location(rec_loc, drp, $scope.record_data_contact, $scope.selected_data_loc_contact)
                                .then(function (result) {
                                    if (result == true)
                                        $scope.getAltLocation();
                                }, function (error) {
                                    console.log(error);
                                });
                        }




                    }).catch(function (message) {

                        console.log(message.data);
                    });

                // ends here
                return;
            }

            SubmitContactLoc.location(rec_loc, drp, $scope.record_data_contact, $scope.selected_data_loc_contact)
                .then(function (result) {
                    if (result == true)
                        $scope.getAltLocation();
                }, function (error) {
                    console.log(error);
                });

         }

       
        return;
    }

    $scope.rec_loc = {};
    $scope.rec_loc.loccaiontiming = {};
    $scope.columnalitcotact_scoial = [];

    $scope.set_contact_infolocation = function (val) {
        $scope.rec_loc.booking_job_title = val.job_title;
        $scope.rec_loc.booking_direct_line = val.direct_line;
        $scope.rec_loc.booking_mobile = val.mobile;
        $scope.rec_loc.booking_telephone = val.phone;
        $scope.rec_loc.booking_fax = val.fax;
        $scope.rec_loc.booking_email = val.email;
        $scope.drp.booking_pref_mthod_of_comm = $scope.$root.get_obj_frm_arry($rootScope.arr_pref_method_comm, val.pref_method_of_communication);
        // $scope.drp.booking_pref_mthod_of_comm = $scope.$root.get_obj_frm_arry($scope.arr_pref_method_comm, val.pref_method_of_communication);
    }

    $scope.get_contact_location_dropdown = function (id, type) {
        $scope.typeconloc = type;

        if (type == 1) {
            $scope.page_title = "Assign Contact(s)";
            $scope.altContacFormShow = false;
            angular.element('#popup_add_contactinternal').modal({
                show: true
            });
        } else {
            $scope.page_title = "Assign Location(s)";
            $scope.altDepotFormShow = false;
            angular.element('#popup_add_locationtinternal').modal({
                show: true
            });
        }

        if (type == 2 && $scope.rec_contact.addcontactslisting != undefined && $scope.rec_contact.addcontactslisting.length > 0) {

            angular.forEach($scope.record_data_contact, function (obj) {
                obj.chk = false;

                angular.forEach($scope.selected_data_loc_contact, function (obj2) {
                    if (obj.id == obj2.id || obj.id == id)
                        obj.chk = true;
                });

            });
        } else if (type == 1 && $scope.rec_loc.addcontactslisting != undefined && $scope.rec_loc.addcontactslisting.length > 0) {

            angular.forEach($scope.record_data_contact, function (obj) {
                obj.chk = false;

                angular.forEach($scope.selected_data_loc_contact, function (obj2) {
                    if (obj.id == obj2.id || obj.id == id)
                        obj.chk = true;
                });
            });

        } else {

            if (id !== undefined) {

                var urlSRMSocialMedias = $scope.$root.pr + "srm/srm/get-list-contact-location";

                $http
                    .post(urlSRMSocialMedias, {
                        'token': $scope.$root.token,
                        'acc_id': $scope.$root.srm_id,
                        'module_type': 2,
                        rec_id: id,
                        type: type
                    })
                    .then(function (res) {
                        if (res.data.ack == true) {

                            if ($scope.rec_contact == undefined) $scope.rec_contact = {};
                            if ($scope.rec_loc == undefined) $scope.rec_loc = {};

                            $scope.rec_contact.addcontactslisting = res.data.response;
                            $scope.rec_loc.addcontactslisting = res.data.response;
                            $scope.selected_data_loc_contact = res.data.response;

                            if (type == 2) {

                                angular.forEach($scope.record_data_contact, function (obj) {
                                    obj.chk = false;

                                    angular.forEach($scope.selected_data_loc_contact, function (obj2) {
                                        // console.log(obj2);
                                        if (obj.id == obj2.location_id || obj.id == id) {
                                            obj.chk = true;
                                            obj2.id = obj2.location_id;
                                        }
                                    });
                                });

                            } else if (type == 1) {

                                angular.forEach($scope.record_data_contact, function (obj) {
                                    obj.chk = false;

                                    angular.forEach($scope.selected_data_loc_contact, function (obj2) {
                                        if (obj.id == obj2.contact_id || obj.id == id) {
                                            obj.chk = true;
                                            obj2.id = obj2.contact_id;
                                        }
                                    });
                                });
                            }
                            //console.log($scope.record_data_contact);
                        } else {
                            $scope.rec_contact.addcontactslisting = [{
                                id: ''
                            }];
                            $scope.rec_loc.addcontactslisting = [{
                                id: ''
                            }];
                            $scope.selected_data_loc_contact = [{
                                id: ''
                            }];
                        }
                    });
            } else {
                $scope.rec_contact.addcontactslisting = [{
                    id: ''
                }];
                $scope.rec_loc.addcontactslisting = [{
                    id: ''
                }];
                $scope.selected_data_loc_contact = [{
                    id: ''
                }];
            }
        }
    }

    $scope.PendingSelectedContactLoc = [];

    $scope.submitPendingContactLoc = function () {
        $scope.PendingSelectedContactLoc = [];
        $scope.rec_contact.showdata2 = 0;
        $scope.rec_loc.showdata2 = 0;

        for (var i = 0; i < $scope.record_data_contact.length; i++) {

            if ($scope.record_data_contact[i].chk == true) {
                $scope.rec_contact.showdata2++;
                $scope.rec_loc.showdata2++;
                $scope.PendingSelectedContactLoc.push($scope.record_data_contact[i]);
            }
        }

        console.log($scope.PendingSelectedContactLoc);

        $scope.selected_data_loc_contact = $scope.PendingSelectedContactLoc;
        angular.element('#popup_add_contactinternal').modal('hide');
        angular.element('#popup_add_locationtinternal').modal('hide');
    }

    $scope.clearPendingContactLoc = function () {
        $scope.PendingSelectedContactLoc = [];
        angular.element('#popup_add_contactinternal').modal('hide');
        angular.element('#popup_add_locationtinternal').modal('hide');
    }

    $scope.selectedAll = false;
    $scope.check_loc_value = function (val) {
        let selection_filter = $filter('filter');
        let filtered = selection_filter($scope.record_data_contact, $scope.searchKeyword.search);
        
        $scope.PendingSelectedContactLoc = [];
        $scope.isselectcontactloc = [];

        if (val == true) {
            //$scope.isSalePerersonChanged = true;
            angular.forEach(filtered, function (obj) {
                obj.chk = val;
                $scope.PendingSelectedContactLoc.push(obj);
            });

            // for (var i = 0; i < $scope.record_data_contact.length; i++) {
            //     $scope.record_data_contact[i].chk = true;
            //     // $scope.record_data_contact[i].chk_value = true;
            //     $scope.PendingSelectedContactLoc.push($scope.record_data_contact[i]);
            // }
        } else {
            for (var i = 0; i < $scope.record_data_contact.length; i++) {
                $scope.record_data_contact[i].chk = false;
                //$scope.record_data_contact[i].chk_value = false;
            }
            $scope.PendingSelectedContactLoc = [];
        }
    }

    $scope.selectloccontact = function (sp, isPrimary, sel_type) {
        $scope.isselectcontactlocchk = true;
        $scope.PendingSelectedContactLoc = [];

        if (sp.chk == true)
            $scope.PendingSelectedContactLoc.push(sp);
        else
            $scope.PendingSelectedContactLoc.splice(sp, 1);
        return;
    }


    //----------------------- Price offer -------------------------//

    $scope.searchKeyword_priceOffer = {};
    //open Price Offer listing
    $scope.priceOfferTableData = {};
    $scope.getPriceOffer = function (cp_type) {
        $scope.showLoader = true;

        //$scope.getOffer_PriceOffer(1);
        $scope.breadcrumbs = [{
            'name': 'Purchase & Supplier',
            'url': '#',
            'style': ''
        }, {
            'name': 'Supplier',
            'url': 'app.supplier',
            'style': ''
        }, {
            'name': $scope.$root.bdname,
            'url': '#',
            'isActive': false
        }, {
            'name': 'Price / Price Offer',
            'url': '#',
            'isActive': false
        }];

        $scope.getAltContacts();

        if ($rootScope.prooduct_arr != undefined)
        {
            for (var i = 0; i < $rootScope.prooduct_arr.length; i++) {
                $rootScope.prooduct_arr[i].chk = false;
                $rootScope.prooduct_arr[i].disableCheck = 0;
            }
        }

        //$scope.breadcrumbs[3].name = 'Price / Price Offer';

        $scope.PriceOffer_rec = {};
        $scope.formData = {};

        $scope.inPriceOffer = 1;

        $scope.PriceOffer_rec.moduleID = $stateParams.id;
        $scope.PriceOffer_rec.moduleType = 2;
        $scope.PriceOffer_rec.priceType = '1,3';
        $scope.$root.priceCP_type = cp_type;

        $scope.SRMPriceInfoFormShow = false;
        $scope.SRMPriceInfoListingShow = true;

        $scope.SRMPricelistInfoFormShow = false;
        $scope.SRMPricelistInfoListingShow = true;

        var ApiAjax = $scope.$root.sales + "crm/crm/price-offer-listing";

        $scope.postData = {
            'moduleID': $stateParams.id,
            'moduleType': $scope.PriceOffer_rec.moduleType,
            'priceType': $scope.PriceOffer_rec.priceType,
            'searchKeyword': $scope.searchKeyword_priceOffer,
            'token': $scope.$root.token
        };

        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res) {
                $scope.price_info_columns = [];
                $scope.price_info_record_data = {};
                $scope.priceOfferTableData = res;

                if (res.data.ack == true) {
                    // //console.log(res.data.response);

                    $scope.price_info_record_data = res.data.response;

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record;

                    /* angular.forEach($scope.price_info_record_data[0], function (val, index) {
                        if (index != 'chk' && index != 'id') {
                            $scope.price_info_columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }
                    }); */
                }
                $scope.showLoader = false;
            });

      //  $scope.PriceOffer_rec.priceType = 1;
    }

    $scope.priceListType = '';

    //open Price Offer Form in edit mode
    $scope.OpenPriceOfferForm = function (event, id, mode) {
        // console.log($scope.PriceOffer_rec);
        //to retain value of type
        $scope.showLoader = true;
        $scope.resetPriceOfferForm();

        $scope.priceListType = 'offer';

        $scope.list_type = [{
            'name': 'Percentage',
            'id': 1
        }, {
            'name': 'Value',
            'id': 2
        }];

        var p_id = (Number(id) > 0) ? id : 0;
        $scope.tempProdArr = [];

        var itemListingApi = $scope.$root.stock + "products-listing/item-popup";
        
        $scope.showLoader = true;

        $http
        .post(itemListingApi, { 'token': $scope.$root.token, 'price_id':p_id })
        .then(function (res) {
            if (res.data.ack == true) {
                angular.forEach(res.data.response, function (value, key) {
                    if (key != "tbl_meta_data") {
                        $scope.tempProdArr.push(value);
                    }
                });                
        
                // if($scope.tempProdArr.length == 0)
                //     $scope.tempProdArr.push({'id':0});
                
                $scope.showLoader = false;
            }
            else
            {
                // $scope.tempProdArr.push({'id':0});
                $scope.showLoader = false;
            }
        });


        $scope.SRMPriceInfoFormShow = true;
        $scope.SRMPriceInfoListingShow = false;

        $scope.deletebtn = false;

        if (id != undefined) {

            if (mode == 1)
                $scope.PriceOffer_check_readonly = true;
            else if (mode == 0)
                $scope.PriceOffer_check_readonly = false;

            var pOfferUrl = $scope.$root.sales + "crm/crm/get-price-data";
            $scope.PriceOffer_rec = {};

            $http
                .post(pOfferUrl, {
                    'id': id,
                    'moduleID': $stateParams.id,
                    'moduleType': 2,
                    'priceType': '1,3',
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.PriceOffer_rec = res.data.response;
                        $scope.PriceOffer_rec.crm_id = $stateParams.id;
                        $scope.PriceOffer_rec.offer_date = res.data.response.start_date;
                        $scope.PriceOffer_rec.offer_valid_date = res.data.response.end_date;
                        $scope.PriceOffer_rec.id = res.data.response.id;

                        // console.log($rootScope.supp_current_edit_currency);

                        var currency_id = 0;

                        /* if (res.data.response.currencyID > 0)
                            currency_id = res.data.response.currencyID;
                        else  */
                        {
                            if ($rootScope.supp_current_edit_currency)
                                currency_id = $rootScope.supp_current_edit_currency.id;
                            else
                                currency_id = $scope.$root.defaultCurrency;
                        }

                        //console.log($scope.PriceOffer_rec.items);

                        if (currency_id != $scope.$root.defaultCurrency) {

                            var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
                            $http
                                .post(currencyURL, {
                                    'id': currency_id,
                                    'token': $scope.$root.token
                                })
                                .then(function (res) {
                                    if (res.data.ack == true) {
                                        if (res.data.response.conversion_rate == null) {
                                            toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                                            return;
                                        }
                                        $scope.currencyConversionRate = parseFloat(res.data.response.conversion_rate);
                                        $scope.assignPriceOfferItemData($scope.PriceOffer_rec.items, currency_id, $scope.PriceOffer_rec.id);
                                    } else {
                                        toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                                        return;
                                    }
                                });
                        } else {
                            $scope.currencyConversionRate = 1;
                            $scope.assignPriceOfferItemData($scope.PriceOffer_rec.items, currency_id, $scope.PriceOffer_rec.id);
                        }

                        angular.forEach($rootScope.arr_currency, function (obj) {
                            if (obj.id == currency_id)
                                $scope.PriceOffer_rec.currencys = obj;
                        });

                        if (res.data.response.OfferMethod != undefined) {
                            $scope.arr_OfferMethod = res.data.response.OfferMethod;

                            angular.forEach($scope.arr_OfferMethod, function (obj) {
                                if (obj.id == res.data.response.offerMethodID)
                                    $scope.PriceOffer_rec.offer_method_ids = obj;
                            });
                        }
                        $scope.PriceOffer_rec.offered_by = res.data.response.first_name + ' ' + res.data.response.last_name;
                    }
                    $scope.showLoader = false;
                });
        } else {

            // pre data api call for price add form 
            $scope.arr_OfferMethod = [];
            $scope.arr_OfferLocation = [];

            var pricePreDataUrl = $scope.$root.pr + "srm/srm/price-form-predata";
            $http
                .post(pricePreDataUrl, {
                    'token': $scope.$root.token,
                    'module_type': 2
                })
                .then(function (res) {
                    if (res.data.ack == true)
                        $scope.arr_OfferMethod = res.data.response.OfferMethod;
                });

            // 1 type for price offer
            $scope.PriceOffer_rec.priceType = 1;
            $scope.deletebtn = true;
            $scope.showLoader = false;
            $scope.PriceOffer_check_readonly = false;
        }
    }
    $scope.assignPriceOfferItemData = function (itemsdata, currency_id, price_id) {
        $scope.tbl_records = {
            'headers': {
                'top_header': ['Item', 'Description', 'Category', 'UOM', 'StdPrice', 'priceoffer', 'lCY', 'Min', 'Max'],
                'inner_header': ['Min', 'Discount', 'Price', 'actualDiscount', 'priceOfferLCY'],
                'additional_cost_header': ['LandingCost', 'Price', 'Currency', 'SelectedGL']
            },
            'data': []
        };
        angular.forEach(itemsdata, function (obj) {
            $scope.singleSelectedItem = {};
            $scope.directiveSelectedPriceItems = [];
            var newPrice = "";
            var newMaxPurchasePrice = "";

            
            obj.arr_unit_of_measure = obj.arr_units;

            var standard_price = (obj.standard_price != undefined && obj.standard_price != null) ? obj.standard_price : 0;
            // var standard_price = (obj.purchase_price != undefined && obj.purchase_price != null) ? obj.purchase_price : 0;
            var maxPurchasePrice = (obj.min_max_price != undefined && obj.min_max_price != null) ? obj.min_max_price : 0;


            if (obj.arr_unit_of_measure != undefined) {
                if (obj.arr_unit_of_measure[0].unit_id != obj.arr_unit_of_measure[0].ref_unit_id) {
                    newPrice = parseFloat(obj.itemOfferPrice) / obj.arr_unit_of_measure[0].ref_quantity;
                    newMaxPurchasePrice = parseFloat(maxPurchasePrice) / obj.arr_unit_of_measure[0].ref_quantity;
                }
                else {
                    newPrice = parseFloat(obj.itemOfferPrice) / obj.arr_unit_of_measure[0].quantity;
                    newMaxPurchasePrice = parseFloat(maxPurchasePrice) / obj.arr_unit_of_measure[0].quantity;

                }

            } else {
                newPrice = parseFloat(obj.itemOfferPrice);
                newMaxPurchasePrice = parseFloat(maxPurchasePrice);
            }


            if (currency_id != $scope.$root.defaultCurrency) {
                newPrice = parseFloat(newPrice) / parseFloat($scope.currencyConversionRate);
                newMaxPurchasePrice = parseFloat(newMaxPurchasePrice) * parseFloat($scope.currencyConversionRate);
            }

            obj.ItemConvertedAmount = parseFloat(newPrice).toFixed(4);
            obj.ItemConvMaxPurchasePrice = parseFloat(newMaxPurchasePrice).toFixed(4);

            //console.log($scope.currencyConversionRate);
            $scope.singleSelectedItem.Item = obj.Item_Code;
            $scope.singleSelectedItem.arr_unit_of_measure = obj.arr_units;
            $scope.singleSelectedItem.StdPrice = parseFloat(standard_price);
            $scope.singleSelectedItem.StdPricelCY = parseFloat(standard_price); //obj.ItemConvertedAmount;
            
            // $scope.singleSelectedItem.StdPrice2 = parseFloat(standard_price);
            // $scope.singleSelectedItem.StdPricelCY2 = parseFloat(standard_price);

            $scope.singleSelectedItem.maxPurchasePriceLCY = parseFloat(maxPurchasePrice);

            $scope.singleSelectedItem.uomID = parseFloat(obj.uomID);

            $scope.singleSelectedItem.module = 2; // srm and supplier
            $scope.singleSelectedItem.min_max_price = obj.min_max_price;
            $scope.singleSelectedItem.minAllowedQty = obj.minAllowedQty;
            $scope.singleSelectedItem.maxAllowedQty = obj.maxAllowedQty;
            $scope.singleSelectedItem.Category = obj.category;

            $scope.singleSelectedItem.priceoffer = parseFloat(obj.itemOfferPrice); //Number(obj.ItemConvertedAmount); //
            $scope.singleSelectedItem.lCY = obj.ItemConvertedAmount; //parseFloat(obj.standard_price); //

            $scope.singleSelectedItem.maxPurchasePriceoffer = Number(obj.ItemConvMaxPurchasePrice);
            $scope.singleSelectedItem.priceID = obj.priceID;

            if (obj.minQty > 0) {
                $scope.singleSelectedItem.Min = Number(obj.minQty);
                $scope.singleSelectedItem.prev_Min = Number(obj.minQty);
            }
            else {
                $scope.singleSelectedItem.Min = '';
                $scope.singleSelectedItem.prev_Min = '';
            }

            if (obj.maxQty > 0) {
                $scope.singleSelectedItem.Max = Number(obj.maxQty);
                $scope.singleSelectedItem.prev_Max = Number(obj.maxQty);
            }
            else {
                $scope.singleSelectedItem.Max = '';
                $scope.singleSelectedItem.prev_Max = '';
            }
            $scope.singleSelectedItem.Description = obj.Item_Description;
            $scope.singleSelectedItem.id = obj.id;
            $scope.singleSelectedItem.ItemID = obj.itemID;
            $scope.singleSelectedItem.price_id = price_id;

            // $scope.singleSelectedItem.UOM = obj.arr_unit_of_measure[0];
            if (obj.arr_unit_of_measure != undefined)
                $scope.singleSelectedItem.UOM = obj.arr_unit_of_measure[0];
            else
                $scope.singleSelectedItem.UOM = '';

            $scope.directiveSelectedPriceItems.itemData = $scope.singleSelectedItem;
            $scope.directiveSelectedPriceItems.discountDetails = [];
            $scope.directiveSelectedPriceItems.discountDetails.rows = [];
            $scope.directiveSelectedPriceItems.discountType = [];

            $scope.directiveSelectedPriceItems.additionalCosts = [];
            $scope.directiveSelectedPriceItems.additionalCosts.rows = [];

            var volumeDiscountType = 0

            if (obj.itemsVolume.length > 0) {

                $scope.directiveSelectedPriceItems.discountDetails.isDiscountAvailable = 1;

                angular.forEach(obj.itemsVolume, function (obj1) {

                    $scope.singleSelectedvolume = {};
                    var netvolumepercentage = "";
                    var netvolumeprice = "";

                    if (obj1.discountType == 1) {
                        netvolumepercentage = ((parseFloat(obj1.discount)) / 100) * parseFloat(obj.itemOfferPrice);
                        netvolumeprice = parseFloat(obj.itemOfferPrice) - parseFloat(netvolumepercentage);
                        $scope.singleSelectedvolume.priceOfferLCY = (netvolumeprice / $scope.currencyConversionRate).toFixed(2);
                        $scope.singleSelectedvolume.actualDiscount = netvolumepercentage;
                    }
                    else if (obj1.discountType == 2) {
                        netvolumeprice = parseFloat(obj.itemOfferPrice) - parseFloat(obj1.discount);;
                        $scope.singleSelectedvolume.priceOfferLCY = (netvolumeprice / $scope.currencyConversionRate).toFixed(2);;
                        $scope.singleSelectedvolume.actualDiscount = obj1.discount;
                    }

                    $scope.singleSelectedvolume.Price = (netvolumeprice).toFixed(2);

                    $scope.singleSelectedvolume.discount = Number(obj1.discount);
                    $scope.singleSelectedvolume.id = obj1.id;
                    volumeDiscountType = obj1.discountType;
                    $scope.singleSelectedvolume.Min = Number(obj1.min);
                    $scope.directiveSelectedPriceItems.discountDetails.rows.push($scope.singleSelectedvolume);
                });
            }

            // console.log(obj.itemsAdditionalCost);

            if (obj.itemsAdditionalCost.length > 0) {

                angular.forEach(obj.itemsAdditionalCost, function (obj2) {

                    $scope.singleSelectedAdditionalCosts = {};

                    $scope.singleSelectedAdditionalCosts.description = obj2.description;
                    $scope.singleSelectedAdditionalCosts.id = obj2.id;
                    $scope.singleSelectedAdditionalCosts.iacid = obj2.iacid;
                    $scope.singleSelectedAdditionalCosts.cost = obj2.cost;
                    $scope.singleSelectedAdditionalCosts.currencyID = obj2.currencyID;
                    $scope.singleSelectedAdditionalCosts.currencyCode = obj2.currencyCode;
                    $scope.singleSelectedAdditionalCosts.cost_gl_code_id = obj2.cost_gl_code_id;
                    $scope.singleSelectedAdditionalCosts.cost_gl_code = obj2.cost_gl_code;
                    $scope.directiveSelectedPriceItems.additionalCosts.rows.push($scope.singleSelectedAdditionalCosts);
                });
            }

            if (volumeDiscountType == 2)
                $scope.directiveSelectedPriceItems.discountType = $scope.list_type[1];
            else
                $scope.directiveSelectedPriceItems.discountType = $scope.list_type[0];

            /* var item = $filter("filter")($rootScope.prooduct_arr, {
                id: obj.itemID
            });

            var idx = $rootScope.prooduct_arr.indexOf(item[0]);

            if ($rootScope.prooduct_arr[idx] != undefined) {
                $rootScope.prooduct_arr[idx].disableCheck = 1;
                $rootScope.prooduct_arr[idx].chk = true;
            } */
            // $scope.directiveSelectedPriceItems.discountDetails.rows.sort(predicateBy("Min"));
            $scope.tbl_records.data.push($scope.directiveSelectedPriceItems);
        });
    }

    // select for add Items in price module.
    $scope.searchKeywordItem = {};
    $scope.selectedRecFromModalsItem = [];
    $scope.selectPriceItems = function (item_paging,sort_column,sortform) {
    
        if (item_paging){
            $scope.searchKeywordItem = {};
            $scope.selectedRecFromModalsItem = [];
        }
        if ($scope.PriceOffer_rec.offer_date == '' || $scope.PriceOffer_rec.offer_valid_date == '') {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Start Date and End Date']));
            return;
        }

        /* if (Number(PriceOffer_rec.offeredByID == 0))// || PriceOffer_rec.offered_by.length == 0) 
        {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Offered By']));
            return false;
        } */

        if (!$scope.PriceOffer_rec.id > 0)
            $scope.addPriceOffer($scope.PriceOffer_rec);

        $scope.showLoader = true;

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.postData.start_date = $scope.PriceOffer_rec.offer_date;
        $scope.postData.end_date = $scope.PriceOffer_rec.offer_valid_date;
        $scope.postData.price_type = 2;
        $scope.productsArr = [];
        
        if (item_paging == 1)
            $scope.$root.item_paging.spage = 1

        $scope.postData.page = $scope.$root.$root.item_paging.spage;

        $scope.postData.searchKeyword = $scope.searchKeywordItem;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeywordItem = {};
            $scope.record_data = {};
        }

        var itemListingApi = $scope.$root.stock + "products-listing/item-popup";
        // $scope.itemPOTableData ={};
        $scope.showLoader = true;
        $http
        .post(itemListingApi, $scope.postData )
        .then(function (res) {
            $scope.itemPOTableData = res;
            $scope.productsArr = [];
            // $scope.selectedRecFromModalsItem = [];
            $scope.PendingSelectedItems = [];

            if (res.data.ack == true) {
                $scope.total = res.data.total;
                $scope.item_paging.total_pages = res.data.total_pages;
                $scope.item_paging.cpage = res.data.cpage;
                $scope.item_paging.ppage = res.data.ppage;
                $scope.item_paging.npage = res.data.npage;
                $scope.item_paging.pages = res.data.pages;

                $scope.total_paging_record = res.data.total_paging_record;
                
                $scope.record_data = $scope.tempProdArr;

                angular.forEach(res.data.response, function (value, key) {
                    if (key != "tbl_meta_data") {
                        $scope.productsArr.push(value);
                    }
                });
                
                angular.element('#PriceItemsModal').modal({
                    show: true
                });
                $scope.showLoader = false;

                var getPurchasePriceUrl = $scope.$root.stock + "products-listing/get-recomended-purchase-price";
                $scope.purchasePriceArr = [];

                $http
                    .post(getPurchasePriceUrl, { 'token': $scope.$root.token, 'orderDate': $scope.PriceOffer_rec.offer_date })
                    .then(function (res) {

                        $scope.showLoader = false;

                        if (res.data.ack == true) {
                            $scope.purchasePriceArr = res.data.response;
                            // $scope.UOMArr = res.data.responseUOM;

                            angular.forEach($scope.purchasePriceArr, function (obj) {
                                var item = $filter("filter")($scope.productsArr, { id: obj.product_id });
                                var idx = $scope.productsArr.indexOf(item[0]);
                                if (idx != -1) {
                                    $scope.productsArr[idx].standard_purchase_cost = obj.standard_price;
                                    $scope.productsArr[idx].maxPurchasePrice = obj.MaxPrice;
                                    $scope.productsArr[idx].minPurchaseQty = obj.min_qty;
                                    $scope.productsArr[idx].maxPurchaseQty = obj.max_qty;
                                    $scope.productsArr[idx].purchaseUOMid = obj.uom_id;

                                    /* angular.forEach($scope.UOMArr, function (obj2) {

                                        if(obj2.product_id == obj.product_id && obj.uom_id == obj2.cat_id && obj2.cat_id != obj2.ref_unit_id && obj2.ref_quantity ){

                                            $scope.productsArr[idx].standard_purchase_cost = parseFloat(obj.standard_price)/parseFloat(obj2.ref_quantity);
                                            $scope.productsArr[idx].standard_price = parseFloat(obj.standard_price)/parseFloat(obj2.ref_quantity);
                                            $scope.productsArr[idx].standard_price1 = parseFloat(obj.standard_price)/parseFloat(obj2.ref_quantity);

                                        }

                                    }); */
                                }
                            });
                        }

                        /* angular.element('#PriceItemsModal').modal({
                            show: true
                        }); */
                    }).catch(function (message) {
                        $scope.showLoader = false;
                        
                        throw new Error(message.data);
                        console.log(message.data);
                    });

            }
            else {
                $scope.showLoader = false;
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            }
        });

        /* $scope.filterPriceItem = {};
        $scope.tempProdArr = [];
        $scope.tempProdArr = $rootScope.prooduct_arr;
        // angular.copy($rootScope.prooduct_arr, $scope.tempProdArr);

        for (var i = 0; i < $scope.tempProdArr.length; i++) {
            $scope.tempProdArr[i].standard_price = $scope.tempProdArr[i].purchase_price; // in case of supplier
            $scope.tempProdArr[i].disableCheck = 0;
            $scope.tempProdArr[i].chk = false;

            angular.forEach($scope.tbl_records.data, function (obj) {
                if (obj.itemData.ItemID == $scope.tempProdArr[i].id) {
                    $scope.tempProdArr[i].disableCheck = 1;
                    $scope.tempProdArr[i].chk = true;
                }
            });

        }
        */

    }

    //ADD/Edit Price Offer Form Record
    $scope.addPriceOffer = function (PriceOffer_rec, param, discardOption) {

        if (PriceOffer_rec.name == undefined || PriceOffer_rec.name == "") {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Name']));
            return false;
        }

        if (PriceOffer_rec.offer_date == undefined || PriceOffer_rec.offer_date == "") {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Start Date']));
            return false;
        }

        if (PriceOffer_rec.offer_valid_date == undefined || PriceOffer_rec.offer_valid_date == "") {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['End Date']));
            return false;
        }

        if (PriceOffer_rec.name == "" || PriceOffer_rec.offer_date == "" || PriceOffer_rec.offer_valid_date == "")
        {
            return false;
        }
        
        PriceOffer_rec.moduleID = $stateParams.id;
        PriceOffer_rec.moduleType = 2;
        PriceOffer_rec.items = [];

        if(PriceOffer_rec.offeredByArr){
            PriceOffer_rec.offered_by = PriceOffer_rec.offeredByArr.name;
            PriceOffer_rec.Offered_By = PriceOffer_rec.offeredByArr.name;
        }

        /* if (Number(PriceOffer_rec.offeredByID == 0) && $scope.record_data_contact.length > 0)// || PriceOffer_rec.offered_by.length == 0) 
        {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Offered By']));
            return false;
        } */


        var min_max_qty_error = '';
        var discount_details_error = '';
        angular.forEach($scope.tbl_records.data, function (obj_item) {
            if ((Number(obj_item.itemData.Min) > 0 && Number(obj_item.itemData.Max) == 0) || (Number(obj_item.itemData.Min) == 0 && Number(obj_item.itemData.Max) > 0)) {
                min_max_qty_error += obj_item.itemData.Item + ', ';
            }

            if (obj_item.discountDetails.rows.length > 0) {
                angular.forEach(obj_item.discountDetails.rows, function (discount) {
                    if (Number(discount.Min) == 0) {
                        if (!discount_details_error.includes(obj_item.itemData.Item))
                            discount_details_error += obj_item.itemData.Item + ', ';
                    }
                });

            }
        });
        if (min_max_qty_error.length > 0) {
            min_max_qty_error = min_max_qty_error.slice(0, -2);
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(595, [min_max_qty_error]));
            return false;
        }
        if (discount_details_error.length > 0) {
            discount_details_error = discount_details_error.slice(0, -2);
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(596, [discount_details_error]));
            return false;
        }
        
        angular.forEach($scope.tbl_records.data, function (item) {
            if (item.discountDetails.rows.length > 0) {
                item.itemData.discountDetails = item.discountDetails.rows;
                item.itemData.type = 1;
                item.itemData.discountType = item.discountType.id;
            }

            PriceOffer_rec.items.push(item.itemData);
        });

        if ($scope.tbl_records.data.length == 0 && discardOption == 1) {

            ngDialog.openConfirm({
                template: 'modalDiscardPriceOfferEmptyItemDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                // remove complete price offer
                // $scope.priceOfferRec

                if (PriceOffer_rec.id == undefined) {
                    $scope.getPriceOffer(1);
                    return false;
                }

                SubmitPrice.deletePriceOffer(PriceOffer_rec)
                    .then(function (result) {
                        if (result.ack == true) {
                            if (param == 1)
                                $scope.getPriceOffer(1);
                        }
                    }, function (error) {
                        console.log(error);
                    });
            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
            return false;
        }

        if (PriceOffer_rec.priceType != 3 && PriceOffer_rec.priceType != 2)
            PriceOffer_rec.priceType = 1;

        SubmitPrice.addPrice(PriceOffer_rec, $scope.selectedCRMLoc)
            .then(function (result) {
                if (result.ack == true) {
                    if (PriceOffer_rec.id > 0) {
                        $scope.formData.price_list_id = PriceOffer_rec.id;
                    } else {
                        $scope.formData.price_list_id = result.id;
                        $scope.PriceOffer_rec.id = result.id;
                    }
                    if (param == 1) {
                        // $scope.getPriceOffer(1);
                        $scope.getPriceOffer();
                        // $scope.PriceOffer_check_readonly = true;
                    }
                }
            }, function (error) {
                console.log(error);
            });
    }

    $scope.PendingSelectedPriceItems = [];

    $scope.checkedPriceItem = function (priceitem) {
        $scope.selectedAllPriceItem = false;

        for (var i = 0; i < $rootScope.prooduct_arr.length; i++) {

            if (priceitem == $rootScope.prooduct_arr[i].id) {
                if ($rootScope.prooduct_arr[i].chk == true)
                    $rootScope.prooduct_arr[i].chk = false;
                else
                    $rootScope.prooduct_arr[i].chk = true;
            }
        }
    }

    $scope.checkAllPriceItem = function (val, category, brand, unit) {
         var selection_filter = $filter('filter');
        var filtered = selection_filter($scope.tempProdArr, $scope.filterPriceItem.search);
        var filtered2 = selection_filter(filtered, category);
        var filtered3 = selection_filter(filtered2, brand);
        var filtered4 = selection_filter(filtered3, unit);

        $scope.PendingSelectedPriceItems = [];

        if (val == true) {
            angular.forEach(filtered4, function (obj) {

                obj.chk = false;

                if (category != undefined && category == obj.category_id && brand != undefined && brand == obj.brand_id && unit != undefined && unit == obj.unit_id) {
                    obj.chk = true;
                } else if (category != undefined && category == obj.category_id && brand != undefined && brand == obj.brand_id) {
                    obj.chk = true;
                } else if (category != undefined && category == obj.category_id && unit != undefined && unit == obj.unit_id) {
                    obj.chk = true;
                } else if (brand != undefined && brand == obj.brand_id && unit != undefined && unit == obj.unit_id) {
                    obj.chk = true;
                } else if (category != undefined && category == obj.category_id) {
                    obj.chk = true;
                } else if (brand != undefined && brand == obj.brand_id) {
                    obj.chk = true;
                } else if (unit != undefined && unit == obj.unit_id) {
                    obj.chk = true;
                } else if (category == undefined && brand == undefined && unit == undefined) {
                    obj.chk = true;
                }
                $scope.PendingSelectedPriceItems.push(obj);
            });
        } else {
            angular.forEach($scope.tempProdArr, function (obj) {
                if (!obj.disableCheck)
                    obj.chk = false;
            });
            $scope.PendingSelectedPriceItems = [];
        }
    }

    $scope.tbl_records = {
        'headers': {
            'top_header': ['Item', 'Description', 'Category', 'UOM', 'StdPrice', 'priceoffer', 'lCY', 'Min', 'Max'],
            'inner_header': ['Min', 'Discount', 'Price', 'actualDiscount', 'priceOfferLCY'],
            'additional_cost_header': ['LandingCost', 'Price', 'Currency', 'SelectedGL']
        },
        'data': []
    }

    $scope.adddirectiveSelectedPriceItems = function (obj) {
        $scope.singleSelectedItem = {};
        $scope.directiveSelectedPriceItems = {};

        var newPrice = "";
        var newMaxPurchasePrice = "";
        obj.arr_unit_of_measure = obj.arr_units.response;

        var standard_price = (obj.standard_price != undefined && obj.standard_price != null) ? obj.standard_price : 0;
        // console.log(obj.purchase_price);
        // var standard_price = (obj.purchase_price != undefined && obj.purchase_price != null) ? obj.purchase_price : 0;
        var maxPurchasePrice = (obj.min_max_price != undefined && obj.min_max_price != null) ? obj.min_max_price : 0;

        if (obj.arr_unit_of_measure != undefined) {
            if (obj.arr_unit_of_measure[0].unit_id != obj.arr_unit_of_measure[0].ref_unit_id) {
                newPrice = parseFloat(standard_price) / obj.arr_unit_of_measure[0].ref_quantity;
                newMaxPurchasePrice = parseFloat(maxPurchasePrice) / obj.arr_unit_of_measure[0].ref_quantity;
            }
            else {
                newPrice = parseFloat(standard_price) / obj.arr_unit_of_measure[0].quantity;
                newMaxPurchasePrice = parseFloat(maxPurchasePrice) / obj.arr_unit_of_measure[0].quantity;
            }
        } else {
            newPrice = parseFloat(standard_price);
            newMaxPurchasePrice = parseFloat(maxPurchasePrice);
        }


        if ($scope.PriceOffer_rec.currencys.id != $scope.$root.defaultCurrency) {
            newPrice = parseFloat(newPrice) * parseFloat($scope.currencyConversionRate);
            newMaxPurchasePrice = parseFloat(newMaxPurchasePrice) * parseFloat($scope.currencyConversionRate);
        }


        obj.ItemConvertedAmount = parseFloat(newPrice).toFixed(4);
        obj.ItemConvMaxPurchasePrice = parseFloat(newMaxPurchasePrice).toFixed(4);

        $scope.singleSelectedItem.Item = obj.product_code;
        $scope.singleSelectedItem.arr_unit_of_measure = obj.arr_units.response; 
        $scope.singleSelectedItem.StdPrice = parseFloat(standard_price);
        $scope.singleSelectedItem.StdPricelCY = parseFloat(standard_price); //obj.ItemConvertedAmount;
        $scope.singleSelectedItem.maxPurchasePriceLCY = parseFloat(maxPurchasePrice); //obj.ItemConvertedAmount;
        $scope.singleSelectedItem.priceoffer = Number(obj.ItemConvertedAmount);
        $scope.singleSelectedItem.maxPurchasePriceoffer = Number(obj.ItemConvMaxPurchasePrice);
        $scope.singleSelectedItem.module = 2; // srm or supplier
        $scope.singleSelectedItem.min_max_price = obj.min_max_price;
        $scope.singleSelectedItem.minAllowedQty = obj.minAllowedQty;
        $scope.singleSelectedItem.maxAllowedQty = obj.maxAllowedQty;

        $scope.singleSelectedItem.Category = obj.category_name;

        $scope.singleSelectedItem.lCY = parseFloat(standard_price);
        $scope.singleSelectedItem.Min = '';
        $scope.singleSelectedItem.Max = '';
        $scope.singleSelectedItem.Description = obj.description;
        $scope.singleSelectedItem.ItemID = obj.id;
        $scope.singleSelectedItem.UOM = (obj.arr_unit_of_measure != undefined) ? obj.arr_unit_of_measure[0] : '';
        $scope.directiveSelectedPriceItems.itemData = $scope.singleSelectedItem;
        $scope.directiveSelectedPriceItems.discountDetails = [];
        $scope.directiveSelectedPriceItems.discountDetails.rows = [];


        $scope.directiveSelectedPriceItems.additionalCosts = [];
        $scope.directiveSelectedPriceItems.additionalCosts.rows = [];

        /* console.log('Before pushing into data');
        console.log($scope.directiveSelectedPriceItems); */
        $scope.tbl_records.data.push($scope.directiveSelectedPriceItems);
    }
 
    $scope.addPendingPriceItems = function () {

        // $scope.tbl_records.data = [];
        $scope.PendingSelectedPriceItems = [];
        $scope.temp_PendingSelectedPriceItems = [];

        var selected_items_codes = '';
        var selected_items = '';
        var already_added_items = '';
        /* angular.forEach($rootScope.prooduct_arr, function (obj) {
            if (obj.chk == true) {
                $scope.temp_PendingSelectedPriceItems.push(obj);
                selected_items_codes += obj.product_code + ', ';
                selected_items += obj.id + ', ';
            }
        }); */
        angular.forEach($scope.selectedRecFromModalsItem, function (obj, key) {
            if(obj)
            {

                var item = $filter("filter")($scope.tempProdArr, { id: obj.key });
                if(item.length > 0)
                already_added_items += item[0].product_code + ', ';
            }
        });

        if(already_added_items.length > 0)
        {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(548, [already_added_items.substring(0, already_added_items.length - 2)]));
            return;
        }
        angular.forEach($scope.selectedRecFromModalsItem, function (obj, key) {
            if(obj)
            {

                // var item = $filter("filter")($scope.productsArr, { id: obj.key }, true);
                
                // $scope.tempProdArr.push(item[0]);
                
                $scope.temp_PendingSelectedPriceItems.push(obj.record);
                selected_items_codes += obj.value + ', ';
                selected_items += obj.key + ', ';
            }
        });

        selected_items += '0';

        // here should be the HTTP call for check
        var checkPriceApi = $rootScope.sales + "crm/crm/get-item-sales-prices-in-date-range";

        var postData = {};
        postData.token = $scope.$root.token;
        postData.selected_items = selected_items;
        postData.date_from = $scope.PriceOffer_rec.offer_date;
        postData.date_to = $scope.PriceOffer_rec.offer_valid_date;
        postData.type = 2;
        var no_prices_products = '';
        $http
            .post(checkPriceApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.product_prices = res.data.response;

                    angular.forEach($scope.temp_PendingSelectedPriceItems, function (obj) {
                        if(Number(obj.id) > 0)
                        {

                            var needle = $filter("filter")($scope.product_prices, { product_id: obj.id });
                            if (needle.length > 0) {
                                obj.min_max_price = needle[0].min_max_sale_price;
                                obj.minAllowedQty = needle[0].min_qty;
                                obj.maxAllowedQty = needle[0].max_qty;
                                obj.standard_price = needle[0].standard_price;

                                /* angular.forEach(needle[0].productUOM,function(obj2){
                                    if(obj2.cat_id == needle[0].uom_id && obj2.cat_id != obj2.ref_unit_id){
                                        obj.standard_price = parseFloat(needle[0].standard_price)/parseFloat(obj2.ref_quantity);
                                    }
                                }); */
                                $scope.PendingSelectedPriceItems.push(obj);
                                $scope.tempProdArr.push(obj);
                            }
                            else 
                            {
                                /* var _item = $filter("filter")($scope.prooduct_arr, { id: obj.id });
                                if (_item.length > 0) {
                                    _item[0].chk = false;
                                    _item[0].disableCheck = 0;
                                } */
                                
                                no_prices_products += obj.product_code + ', ';
                            }
                        }
                    });
                    /* if (no_prices_products.length > 0) {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(597, [no_prices_products.substring(0, no_prices_products.length - 2)]));
                    } */
                    if (no_prices_products.length > 0){
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(620, [no_prices_products.substring(0, no_prices_products.length - 2), 'Purchase Information']));
                        // return false;
                    }


                /* ============================================================ */

                // check for currency conversion rate if its not in base currency.

                var currency_id = "";

                if ($scope.PriceOffer_rec.currencys != undefined)
                    currency_id = $scope.PriceOffer_rec.currencys.id;

                if (!currency_id > 0) {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Currency']));
                    return;
                }

                if (currency_id != $scope.$root.defaultCurrency) {


                    var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
                    $http
                        .post(currencyURL, {
                            'id': $scope.PriceOffer_rec.currencys.id,
                            'token': $scope.$root.token
                        })
                        .then(function (res) {
                            if (res.data.ack == true) {
                                if (res.data.response.conversion_rate == null) {
                                    toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                                    return;
                                }

                                $scope.currencyConversionRate = parseFloat(res.data.response.conversion_rate);
                                //console.log($scope.currencyConversionRate);
                            } else {
                                toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                                return;
                            }

                            $scope.selectedPriceItems = $scope.PendingSelectedPriceItems;

                            if ($scope.tbl_records.data != undefined) {
                                if ($scope.tbl_records.data.length > 0) {

                                    angular.forEach($scope.selectedPriceItems, function (obj) {
                                        var isContains = false;

                                        angular.forEach($scope.tbl_records.data, function (obj2) {
                                            //console.log(obj2.itemData.ItemID);

                                            if (obj.id == obj2.itemData.ItemID) {
                                                isContains = true;
                                            }
                                        });

                                        if (!isContains) {
                                            $scope.adddirectiveSelectedPriceItems(obj);
                                        }
                                    });
                                } else {
                                    angular.forEach($scope.selectedPriceItems, function (obj) {
                                        $scope.adddirectiveSelectedPriceItems(obj);
                                    });
                                }
                            } else {
                                angular.forEach($scope.selectedPriceItems, function (obj) {
                                    $scope.adddirectiveSelectedPriceItems(obj);
                                });
                            }
                        });
                } else {
                    $scope.selectedPriceItems = $scope.PendingSelectedPriceItems;

                    if ($scope.tbl_records.data != undefined) {
                        if ($scope.tbl_records.data.length > 0) {

                            angular.forEach($scope.selectedPriceItems, function (obj) {
                                var isContains = false;

                                angular.forEach($scope.tbl_records.data, function (obj2) {
                                    //console.log(obj2.itemData.ItemID);

                                    if (obj.id == obj2.itemData.ItemID) {
                                        isContains = true;
                                    }
                                });

                                if (!isContains) {
                                    $scope.adddirectiveSelectedPriceItems(obj);
                                }
                            });
                        } else {
                            angular.forEach($scope.selectedPriceItems, function (obj) {
                                $scope.adddirectiveSelectedPriceItems(obj);
                            });
                        }
                    } else {
                        angular.forEach($scope.selectedPriceItems, function (obj) {
                            $scope.adddirectiveSelectedPriceItems(obj);
                        });
                    }
                }
            }
            else {
                    if (selected_items.length > 1)
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(620, [selected_items_codes.substring(0, selected_items_codes.length - 2), 'Purchase Information']));

                    


                    angular.forEach($rootScope.prooduct_arr, function (obj) {
                        obj.chk = false;
                        obj.disableCheck = 0;
                    });
                return;
            }
        });
        /* ============================================================ */

        //console.log($scope.PendingSelectedPriceItems);
        //console.log($scope.tbl_records.data);

        angular.element('#PriceItemsModal').modal('hide');
    }

    $scope.clearPendingPriceItems = function () {
        $scope.PendingSelectedPriceItems = [];
        angular.element('#PriceItemsModal').modal('hide');
    }

    $scope.openPriceItemVolume = function (itemData) {

        //console.log(itemData);
        angular.element('#PriceVolumeModal').modal({
            show: true
        });
    }






    $scope.clear_salesperson_filter = function () {
        $scope.searchKeyword_offered = {};
    }

    $scope.searchKeyword_offered = {};
    $scope.selectedSalespersons = $rootScope.salesperson_arr;
    $scope.getOffer_PriceOffer = function (isShow, item_paging) {

        $scope.showLoader = true;
        $scope.columns_pr = [];
        $scope.record_pr = {};
        $scope.searchKeyword_offered = {};
        $scope.title = 'Offered By';

        var GenSalePersonUrl = $scope.$root.sales + "crm/crm/get-crm-salesperson-ForOppCycle";

        var GenSalePersonPostData = {
            'id': $stateParams.id,
            'type': 2,
            'token': $scope.$root.token
        };

        $http
            .post(GenSalePersonUrl, GenSalePersonPostData)
            .then(function (res) {

                if (res.data.ack == true) {

                    $scope.record_pr = res.data.response;
                    $scope.showLoader = false;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_pr.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.element('#_CustPriceInfoEmplisting_model').modal({
                        show: true
                    });
                    return;
                } else {
                    $scope.record_pr = $rootScope.salesperson_arr;
                    $scope.showLoader = false;
                    angular.forEach($rootScope.salesperson_arr[0], function (val, index) {
                        $scope.columns_pr.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.element('#_CustPriceInfoEmplisting_model').modal({
                        show: true
                    });
                    return;
                }
            });
    }

    $scope.confirmOffer_PriceOffer = function (result) {

        $scope.PriceOffer_rec.offered_by = result.name;
        $scope.PriceOffer_rec.offeredByID = result.id;

        angular.element('#_CustPriceInfoEmplisting_model').modal('hide');
    }

    $scope.getCurrencyCode = function () {
        $scope.currency_code = this.rec.currency_ids.name;
    }

    $scope.showSRMPriceInfoEditForm = function () {
        // //console.log("here");
        $scope.PriceOffer_check_readonly = false;
    }

    $scope.showSRMPriceInfoListing = function () {
        $scope.SRMPriceInfoFormShow = false;
        $scope.SRMPriceInfoListingShow = true;
    }

    //Reset Price Offer Form
    $scope.resetPriceOfferForm = function (PriceOffer_rec) {
        $scope.PriceOffer_check_readonly = false;
        $scope.formData = {};
        $scope.PriceOffer_rec = {};
        $scope.PriceOffer_volume_discdata = {};
        $scope.counter = 0;
        $scope.arrVolumeForms = [1];
        $scope.formData.volume_1_id = 0;
        $scope.formData.volume_2_id = 0;
        $scope.formData.volume_3_id = 0;
        $scope.isPanelExpand = false;
        $scope.isClone = false;
        $scope.PriceOffer_rec.offered_by = '';//$rootScope.defaultUserName;
        $scope.PriceOffer_rec.offeredByID = 0;//$rootScope.userId;
        $scope.tbl_records.data = [];

        if ($rootScope.supp_current_edit_currency) {
            $scope.PriceOffer_rec.currencys = $rootScope.supp_current_edit_currency;
        } else {
            $scope.PriceOffer_rec.currencys = $scope.$root.defaultCurrency;
        }

        $scope.isAdded = false;

        $scope.PriceOffer_rec.offer_date = $scope.$root.get_current_date();
        $scope.PriceOffer_rec.offer_valid_date = '';
        $scope.PriceOffer_rec.name = '';
    }

    /*&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&*/

    // convert to price list start
    //---------------------------------------------------------------

    $scope.moveToPriceList = function (id) {

        var pOfferUrl = $scope.$root.sales + "crm/crm/convertion-price-list";

        $http
            .post(pOfferUrl, {
                'id': id,
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(621));
                    //$scope.getPriceOfferList();
                    $scope.getPriceOffer();
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(346));
            });
    }

    // convert to price list End
    //---------------------------------------------------------------

    $scope.validateQtyItem = function (field, min, max, item) {

        if (field == 'min' && (Number(min) > Number(max))) {
            toaster.pop('error', 'Info', 'Minimum Qty must be less than Maximum Qty.');
            item.minOrderQty = null;
            return;
        }

        if (field == 'max' && (Number(max) < Number(min))) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(347));
            item.maxOrderQty = null;
            return;
        }
    }

    $scope.PriceOffer_validatePrice = function (price, item) {
        console.log(price);
        console.log(item);

        if (price == undefined)
            return;

        var price_a = 0;
        var currency_id = 0;

        if (price != undefined)
            price_a = price;


        if ($scope.PriceOffer_rec.currencys != undefined)
            currency_id = $scope.PriceOffer_rec.currencys.id;

        if (currency_id == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Currency']));
            item.price_offered = null;
            return;
        }

        if (currency_id == $scope.$root.defaultCurrency) {
            item.price_offered = Number(price_a);

            var newPrice = 0;

            if (item.unit_of_measures != undefined) {

                if (item.unit_of_measures.unit_id != item.unit_id) {

                    if (item.unit_of_measures.unit_id != item.unit_of_measures.ref_unit_id)
                        newPrice = Number(price) / item.unit_of_measures.ref_quantity;
                    else
                        newPrice = Number(price) / item.unit_of_measures.quantity;
                } else
                    newPrice = Number(price);
            } else
                newPrice = Number(price);

            item.converted_price = Number(newPrice).toFixed(2);
        } else {
            var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
            $http
                .post(currencyURL, {
                    'id': $scope.PriceOffer_rec.currencys.id,
                    token: $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        if (res.data.response.conversion_rate == null) {
                            toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                            item.price_offered = null;
                            item.converted_price = null;
                            return;
                        }

                        var new_price = "";

                        if (item.unit_of_measures != undefined) {

                            if (item.unit_of_measures.unit_id != item.unit_id) {
                                if (item.unit_of_measures.unit_id != item.unit_of_measures.ref_unit_id)
                                    new_price = Number(price) / item.unit_of_measures.ref_quantity;
                                else
                                    new_price = Number(price) / item.unit_of_measures.quantity;
                            } else
                                new_price = Number(price);
                        } else
                            new_price = Number(price);

                        if ($scope.PriceOffer_rec.currencys != undefined) {

                            if ($scope.PriceOffer_rec.currencys.id != $scope.$root.defaultCurrency)
                                newPrice = Number(new_price) / Number(res.data.response.conversion_rate);
                            else
                                newPrice = Number(new_price);
                        }

                        item.converted_price = Number(newPrice).toFixed(2);
                    } else {
                        toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                        item.price_offered = null;
                        item.converted_price = null;
                    }
                });
        }
    }

    $scope.PriceOfferValItemsPrice = function (selectedPriceItems) {

        if ($scope.PriceOffer_rec.currencys != undefined)
            var currency_id = $scope.PriceOffer_rec.currencys.id;

        if (currency_id == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Currency']));
            item.price_offered = null;
            return;
        }

        if (currency_id == $scope.$root.defaultCurrency) {

            angular.forEach(selectedPriceItems, function (item) {

                if (item.price_offered > 0) {
                    var price = item.price_offered;

                    var price_a = 0;
                    var currency_id = 0;

                    if (price != undefined)
                        price_a = price;

                    item.price_offered = parseFloat(price_a);
                    var newPrice = 0;

                    if (item.unit_of_measures != undefined) {

                        if (item.unit_of_measures.unit_id != item.unit_id) {

                            if (item.unit_of_measures.unit_id != item.unit_of_measures.ref_unit_id)
                                newPrice = parseFloat(price) / item.unit_of_measures.ref_quantity;
                            else
                                newPrice = parseFloat(price) / item.unit_of_measures.quantity;
                        } else
                            newPrice = parseFloat(price);
                    } else
                        newPrice = parseFloat(price);

                    item.converted_price = parseFloat(newPrice).toFixed(2);
                }
            });
        } else {
            var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
            $http
                .post(currencyURL, {
                    'id': $scope.PriceOffer_rec.currencys.id,
                    token: $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        if (res.data.response.conversion_rate == null) {
                            toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                            item.price_offered = null;
                            item.converted_price = null;
                            return;
                        }
                        angular.forEach(selectedPriceItems, function (item) {

                            if (item.price_offered > 0) {
                                var price = item.price_offered;

                                var price_a = 0;
                                var currency_id = 0;

                                if (price != undefined)
                                    price_a = price;

                                var new_price = "";

                                if (item.unit_of_measures != undefined) {

                                    if (item.unit_of_measures.unit_id != item.unit_id) {
                                        if (item.unit_of_measures.unit_id != item.unit_of_measures.ref_unit_id)
                                            new_price = parseFloat(price) / item.unit_of_measures.ref_quantity;
                                        else
                                            new_price = parseFloat(price) / item.unit_of_measures.quantity;
                                    } else
                                        new_price = parseFloat(price);
                                } else
                                    new_price = parseFloat(price);

                                if ($scope.PriceOffer_rec.currencys != undefined) {

                                    if ($scope.PriceOffer_rec.currencys.id != $scope.$root.defaultCurrency)
                                        newPrice = parseFloat(new_price) / parseFloat(res.data.response.conversion_rate);
                                    else
                                        newPrice = parseFloat(new_price);
                                }
                                item.converted_price = parseFloat(newPrice).toFixed(2);
                            }
                        });
                    } else {
                        toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                        item.price_offered = null;
                        item.converted_price = null;
                    }
                });
        }
    }



    $scope.SRMPricelistInfoFormShow = false;
    $scope.SRMPricelistInfoListingShow = true;

    //open Price List listing.
    $scope.searchKeyword_priceList = {};
    $scope.priceListTableData = {};
    $scope.getPriceOfferList = function (cp_type) {

        $scope.showLoader = true;
        $scope.PriceOffer_rec = {};

        $scope.breadcrumbs = [{
            'name': 'Purchase & Supplier',
            'url': '#',
            'style': ''
        }, {
            'name': 'Supplier',
            'url': 'app.supplier',
            'style': ''
        }, {
            'name': $scope.$root.bdname,
            'url': '#',
            'isActive': false
        }, {
            'name': 'Price / Price List',
            'url': '#',
            'isActive': false
        }];

        $scope.getAltContacts();
        $scope.inPriceOffer = 0;

        $scope.PriceOffer_rec.moduleID = $stateParams.id;
        $scope.PriceOffer_rec.moduleType = 2;
        $scope.PriceOffer_rec.priceType = '2,3';

        $scope.$root.priceCP_type = cp_type;

        $scope.SRMPricelistInfoFormShow = false;
        $scope.SRMPricelistInfoListingShow = true;
        $scope.SRMPriceInfoFormShow = false;
        $scope.SRMPriceInfoListingShow = true;

        var ApiAjax = $scope.$root.sales + "crm/crm/price-offer-listing";

        $scope.postData = {
            moduleID: $stateParams.id,
            moduleType: $scope.PriceOffer_rec.moduleType,
            priceType: $scope.PriceOffer_rec.priceType,
            searchKeyword: $scope.searchKeyword_priceList,
            token: $scope.$root.token
        };

        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res) {
                $scope.price_list_record_data = {};

                if (res.data.ack == true) {
                    $scope.priceListTableData = res;

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record;

                    // $scope.price_list_record_data = res.data.record.result;
                    $scope.price_list_record_data = res.data.response;
                }
                $scope.showLoader = false;
            });
    }

    $scope.showSRMPricelistEditForm = function () {
        $scope.PriceList_check_readonly = false;
    }

    if ($scope.isPriceOffer == 1)
        $scope.getPriceOfferList(2);

    //open Price List Form in edit mode.
    $scope.OpenPriceListForm = function (event, id, mode) {
        $scope.viewmode = 0;

        $scope.priceListType = 'List';

        $scope.list_type = [{
            'name': 'Percentage',
            'id': 1
        }, {
            'name': 'Value',
            'id': 2
        }];

        $scope.deletebtn = false;

        $scope.resetPriceOfferForm();

        var p_id = (Number(id) > 0) ? id : 0;
        $scope.tempProdArr = [];

        var itemListingApi = $scope.$root.stock + "products-listing/item-popup";

        $scope.showLoader = true;

        $http
        .post(itemListingApi, { 'token': $scope.$root.token, 'price_id':p_id })
        .then(function (res) {
            if (res.data.ack == true) {
                angular.forEach(res.data.response, function (value, key) {
                    if (key != "tbl_meta_data") {
                        $scope.tempProdArr.push(value);
                    }
                });                
        
                // if($scope.tempProdArr.length == 0)
                //     $scope.tempProdArr.push({'id':0});
                
                $scope.showLoader = false;
            }
            else
            {
                // $scope.tempProdArr.push({'id':0});
                $scope.showLoader = false;
            }
        });



        // console.log($state.current.name);

        $scope.SRMPricelistInfoFormShow = true;
        $scope.SRMPricelistInfoListingShow = false;

        if (id != undefined) {

            /* if (mode == 1)
                $scope.PriceList_check_readonly = true;
            else if (mode == 0)
                $scope.PriceList_check_readonly = false; */

            if (mode == 1)
                $scope.PriceOffer_check_readonly = true;
            else if (mode == 0)
                $scope.PriceOffer_check_readonly = false;

            var pOfferUrl = $scope.$root.sales + "crm/crm/get-price-data";
            $scope.PriceOffer_rec = {};

            $http
                .post(pOfferUrl, {
                    'id': id,
                    'moduleID': $stateParams.id,
                    'moduleType': 2,
                    'priceType': '2,3',
                    'token': $scope.$root.token
                })
                .then(function (res) {

                    $scope.arrIds = [];
                    if (res.data.ack == true) {
                        $scope.PriceOffer_rec = res.data.response;
                        $scope.PriceOffer_rec.crm_id = $stateParams.id;
                        $scope.PriceOffer_rec.offer_date = res.data.response.start_date;
                        $scope.PriceOffer_rec.offer_valid_date = res.data.response.end_date;

                        $scope.PriceOffer_rec.id = res.data.response.id;
                        $scope.arrIds.push(res.data.response.id);

                        var currency_id = 0;

                        if (res.data.response.currencyID > 0)
                            currency_id = res.data.response.currencyID;
                        else {
                            if ($rootScope.supp_current_edit_currency)
                                currency_id = $rootScope.supp_current_edit_currency;
                            else
                                currency_id = $scope.$root.defaultCurrency;
                        }

                        if (currency_id != $scope.$root.defaultCurrency) {

                            var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
                            $http
                                .post(currencyURL, {
                                    'id': currency_id,
                                    'token': $scope.$root.token
                                })
                                .then(function (res) {
                                    if (res.data.ack == true) {
                                        if (res.data.response.conversion_rate == null) {
                                            toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                                            return;
                                        }
                                        $scope.currencyConversionRate = parseFloat(res.data.response.conversion_rate);
                                        $scope.assignPriceOfferItemData($scope.PriceOffer_rec.items, currency_id, $scope.PriceOffer_rec.id);
                                    } else {
                                        toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                                        return;
                                    }
                                });
                        } else {
                            // console.log($scope.PriceOffer_rec.items);
                            $scope.currencyConversionRate = 1;
                            $scope.assignPriceOfferItemData($scope.PriceOffer_rec.items, currency_id, $scope.PriceOffer_rec.id);
                        }

                        angular.forEach($rootScope.arr_currency, function (obj) {
                            if (obj.id == currency_id)
                                $scope.PriceOffer_rec.currencys = obj;
                        });

                        if (res.data.response.OfferMethod != undefined) {
                            $scope.arr_OfferMethod = res.data.response.OfferMethod;

                            angular.forEach($scope.arr_OfferMethod, function (obj) {
                                //console.log(obj);
                                if (obj.id == res.data.response.offerMethodID)
                                    $scope.PriceOffer_rec.offer_method_ids = obj;
                            });
                        }
                        $scope.PriceOffer_rec.offered_by = res.data.response.first_name + ' ' + res.data.response.last_name;
                    }
                    $scope.showLoader = false;
                });
        }
        else {
            $scope.arr_OfferLocation = [];
            $scope.deletebtn = true;

            $scope.PriceOffer_rec.priceType = 2;

            var pricePreDataUrl = $scope.$root.pr + "srm/srm/price-form-predata";
            $http
                .post(pricePreDataUrl, {
                    'token': $scope.$root.token,
                    'module_type': 2
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.arr_OfferMethod = res.data.response.OfferMethod;
                    }
                });
            $scope.showLoader = false;
            //$scope.PriceList_check_readonly = false;
            $scope.PriceOffer_check_readonly = false;
        }
    }

    $scope.deletePriceOffer = function (rec) {
        // delete_type = 1-> Price Offer, 2-> Price List

        /* if (!(rec.id > 0)) {
            if (rec.priceType == 1)
                $scope.getPriceOffer();
            else if (rec.priceType == 2)
                $scope.getPriceOfferList();
        } */

        if (!(rec.id > 0)) {
            if (rec.priceType == 2 || rec.priceType == 3)
                $scope.getPriceOfferList();
            else
                $scope.getPriceOffer();
            return;
        }
        /* if (!(rec.id > 0))
            return; */

        $scope.priceOfferRec = {};
        $scope.priceOfferRec.id = rec.id;


        ngDialog.openConfirm({
            template: 'modalDiscardPriceOfferDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            // remove complete price offer
            SubmitPrice.deletePriceOffer($scope.priceOfferRec)
                .then(function (result) {
                    if (result.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () {
                            if ($scope.inPriceOffer == 1)
                            $scope.getPriceOffer(1);
                             else
                            $scope.getPriceOfferList(1);
                        }, 1500)                        
                    }
                }, function (error) {
                    console.log(error);
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    //ADD/Edit Price List Form Record

    $scope.addPriceList = function (PriceOffer_rec, param, discardOption) {

        if (PriceOffer_rec.name == undefined || PriceOffer_rec.name == "") {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Name']));
            return false;
        }

        if (PriceOffer_rec.offer_date == undefined || PriceOffer_rec.offer_date == "") {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Start Date']));
            return false;
        }

        if (PriceOffer_rec.offer_valid_date == undefined || PriceOffer_rec.offer_valid_date == "") {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['End Date']));
            return false;
        }


        if (PriceOffer_rec.name == "" || PriceOffer_rec.offer_date == "" || PriceOffer_rec.offer_valid_date == "") {
            return false;
        }
        PriceOffer_rec.moduleID = $stateParams.id;
        PriceOffer_rec.moduleType = 2;

        if(PriceOffer_rec.offeredByArr){
            PriceOffer_rec.offered_by = PriceOffer_rec.offeredByArr.name;
            PriceOffer_rec.Offered_By = PriceOffer_rec.offeredByArr.name;
        }

        // console.log(PriceOffer_rec.id+' =='+param);

        /* if (Number(PriceOffer_rec.offeredByID == 0) && $scope.record_data_contact.length > 0)// || PriceOffer_rec.offered_by.length == 0)
        {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Offered By']));
            return false;
        } */


        var min_max_qty_error = '';
        var discount_details_error = '';
        angular.forEach($scope.tbl_records.data, function (obj_item) {
            if ((Number(obj_item.itemData.Min) > 0 && Number(obj_item.itemData.Max) == 0) || (Number(obj_item.itemData.Min) == 0 && Number(obj_item.itemData.Max) > 0)) {
                min_max_qty_error += obj_item.itemData.Item + ', ';
            }

            if (obj_item.discountDetails.rows.length > 0) {
                angular.forEach(obj_item.discountDetails.rows, function (discount) {
                    if (Number(discount.Min) == 0) {
                        if (!discount_details_error.includes(obj_item.itemData.Item))
                            discount_details_error += obj_item.itemData.Item + ', ';
                    }
                });

            }
        });
        if (min_max_qty_error.length > 0) {
            min_max_qty_error = min_max_qty_error.slice(0, -2);
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(595, [min_max_qty_error]));
            return false;
        }
        if (discount_details_error.length > 0) {
            discount_details_error = discount_details_error.slice(0, -2);
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(596, [discount_details_error]));
            return false;
        }


        // if (PriceOffer_rec.priceType != 3)
        //     PriceOffer_rec.priceType = 2;

        $scope.PendingSelectedPriceItems = [];
        $scope.temp_PendingSelectedPriceItems = [];

        var selected_items = '';
        /* angular.forEach($rootScope.prooduct_arr, function (obj) {
            if (obj.chk == true) {
                $scope.temp_PendingSelectedPriceItems.push(obj);
                selected_items += obj.id + ', ';
            }
        }); */

        angular.forEach($scope.tempProdArr, function (obj) {
                // var item = $filter("filter")($scope.productsArr, { id: obj.id }, true);
                if(obj.id != undefined)
                {
                    $scope.temp_PendingSelectedPriceItems.push(obj);
                    selected_items += obj.id + ', ';
                }
        });


        selected_items += '0';

        // here should be the HTTP call for check
        var checkPriceApi = $rootScope.sales + "crm/crm/get-item-sales-prices-in-date-range";

        var postData = {};
        postData.token = $scope.$root.token;
        postData.selected_items = selected_items;
        postData.date_from = $scope.PriceOffer_rec.offer_date;
        postData.date_to = $scope.PriceOffer_rec.offer_valid_date;
        postData.type = 2;
        var no_prices_products = '';
        $http
            .post(checkPriceApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.product_prices = res.data.response;

                    angular.forEach($scope.temp_PendingSelectedPriceItems, function (obj) {
                        if(Number(obj.id) > 0)
                        {
                            var needle = $filter("filter")($scope.product_prices, { product_id: obj.id });
                            if (needle.length > 0) {
                                obj.min_max_price = needle[0].min_max_sale_price;
                                obj.minAllowedQty = needle[0].min_qty;
                                obj.maxAllowedQty = needle[0].max_qty;
                                obj.standard_price = needle[0].standard_price;

                                /* angular.forEach(needle[0].productUOM,function(obj2){
                                    if(obj2.cat_id == needle[0].uom_id && obj2.cat_id != obj2.ref_unit_id){
                                        obj.standard_price = parseFloat(needle[0].standard_price)/parseFloat(obj2.ref_quantity);
                                    }
                                }); */

                                $scope.PendingSelectedPriceItems.push(obj);
                            }
                            else {
                                no_prices_products += obj.product_code + ', ';
                                /* var _item = $filter("filter")($scope.tempProdArr, { id: obj.id });
                                if (_item.length > 0) {
                                    _item[0].chk = false;
                                    _item[0].disableCheck = 0;
                                } */
                            }
                        }
                    });
                    if (no_prices_products.length > 0) {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(597, [no_prices_products.substring(0, no_prices_products.length - 2)]));
                    }

                    PriceOffer_rec.items = [];
                    angular.forEach($scope.tbl_records.data, function (item) {

                        if (item.discountDetails.rows.length > 0) {
                            item.itemData.discountDetails = item.discountDetails.rows;
                            item.itemData.type = 1;
                            item.itemData.discountType = item.discountType.id;
                        }

                        // console.log(item.additionalCosts);

                        if (item.additionalCosts.rows.length > 0) {
                            item.itemData.additionalCosts = item.additionalCosts.rows;
                        }

                        PriceOffer_rec.items.push(item.itemData);
                    });

                    /* if ($scope.tbl_records.data.length == 0 && discardOption == 1) {
                        ngDialog.openConfirm({
                            template: 'modalDiscardPriceOfferEmptyItemDialogId',
                            className: 'ngdialog-theme-default-custom',
                        }).then(function (value) {
                            // remove complete price offer

                            if (PriceOffer_rec.id == undefined) {
                            if (PriceOffer_rec.priceType==1)
                                $scope.getPriceOffer(1);
                            else 
                                $scope.getPriceOfferList(1);
                                return false;
                            }

                            SubmitPrice.deletePriceOffer(PriceOffer_rec)
                                .then(function (result) {
                                    if (result.ack == true) {
                                        if (param == 1)
                                            $scope.getPriceOfferList(1);
                                    }
                                }, function (error) {
                                    console.log(error);
                                });
                        }, function (reason) {
                            console.log('Modal promise rejected. Reason: ', reason);
                        });
                        return false;
                    } */

                    SubmitPrice.addPrice(PriceOffer_rec)
                        .then(function (result) {
                            if (result.ack == true) {
                                
                                if (PriceOffer_rec.id > 0) {
                                    $scope.formData.price_list_id = PriceOffer_rec.id;
                                    toaster.pop('success', 'Info', $rootScope.getErrorMessageByCode(102));
                                    
                                } else {
                                    $scope.formData.price_list_id = result.id;
                                    $scope.PriceOffer_rec.id = result.id;
                                }
                                if (param == 1) {

                                    // $scope.SRMPriceInfoFormShow = false;
                                    // $scope.SRMPriceInfoListingShow = true;

                                    // $scope.SRMPricelistInfoFormShow = false;
                                    // $scope.SRMPricelistInfoListingShow = false;

                                    if (PriceOffer_rec.priceType == 1 || ($scope.SRMPriceInfoFormShow == true && $scope.SRMPriceInfoListingShow == false))
                                        $scope.getPriceOffer(1);
                                    else
                                        $scope.getPriceOfferList(1);
                                
                                    // $scope.getPriceOffer(1);
                                    // $scope.getPriceOfferList(1);
                                    // $scope.PriceOffer_check_readonly = true;
                                // $scope.getPriceOfferList(1);
                                }
                            }
                        }, function (error) {
                            console.log(error);
                        });
                }
                else {
                    if (selected_items.length > 1)
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(620, [no_prices_products.substring(0, no_prices_products.length - 2), 'Purchase Information']));


                    else
                        toaster.pop('error', 'Error', 'No Item Selected');
                        

                    angular.forEach($rootScope.prooduct_arr, function (obj) {
                        obj.chk = false;
                        obj.disableCheck = 0;
                    });
                    return;
                }
            });
    }

    //close Price List Form and display listing.
    $scope.showSRMPricelistInfoListing = function () {
        $scope.SRMPricelistInfoFormShow = false;
        $scope.SRMPricelistInfoListingShow = true;
    }

    $scope.ClonePriceList = function (PriceOffer_rec_clone) {
        $scope.PriceOffer_check_readonly = false;
        $scope.formData = {};
        $scope.PriceOffer_rec = PriceOffer_rec_clone;
        $scope.PriceOffer_rec.id = 0;
        $scope.PriceOffer_volume_discdata = {};
        $scope.counter = 0;
        $scope.arrVolumeForms = [1];
        $scope.formData.volume_1_id = 0;
        $scope.formData.volume_2_id = 0;
        $scope.formData.volume_3_id = 0;
        $scope.isPanelExpand = false;
        $scope.isClone = true;
        $scope.PriceOffer_rec.priceType = 2;

        $scope.PriceOffer_rec.priceOfferedBy = '';
        $scope.PriceOffer_rec.offeredByID = '';
        $scope.PriceOffer_rec.offer_method_ids = '';
        $scope.deletebtn = false;
        // $scope.PriceOffer_rec.offered_by = $rootScope.defaultUserName;
        // $scope.PriceOffer_rec.offeredByID = $rootScope.userId;

        // $scope.tbl_records.data = [];
        angular.forEach($scope.tbl_records.data, function (item) {
            angular.forEach(item.discountDetails.rows, function (discount) {
                discount.id = 0;
            });

            angular.forEach(item.additionalCosts.rows, function (addCost) {
                addCost.id = 0;
            });

            item.itemData.id = 0;
        });

        if ($rootScope.supp_current_edit_currency) {
            $scope.PriceOffer_rec.currencys = $rootScope.supp_current_edit_currency;
        } else {
            $scope.PriceOffer_rec.currencys = $scope.$root.defaultCurrency;
        }

        $scope.isAdded = false;

        $scope.PriceOffer_rec.offer_date = '';
        $scope.PriceOffer_rec.offer_valid_date = '';
        $scope.PriceOffer_rec.name = '';

    }

    $scope.sendEmailPriceList = function (PriceOffer_recEmail) {     

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.postData.mainRec = PriceOffer_recEmail;
        $scope.postData.company_name = $rootScope.company_name;
        // $scope.postData.company_logo_url = $scope.company_logo_url;
        
        let currentUrl = window.location.href;
        $scope.postData.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;

        $scope.showLoader = true;     

        var priceListEmailApi = $scope.$root.pr + "srm/srm/price-list-email";        
        $http
            .post(priceListEmailApi, $scope.postData)
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.total = res.data.total; 
                    toaster.pop('success', 'Info', 'Email sent successfully');               
                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            }); 
    }

    $scope.downloadPDFPriceList = function (PriceOffer_recEmail) {     

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.postData.mainRec = PriceOffer_recEmail;
        $scope.postData.company_name = $rootScope.company_name;

        let currentUrl = window.location.href;
        $scope.postData.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;
        $scope.showLoader = true;     

        var priceListEmailApi = $scope.$root.pr + "srm/srm/price-list-PDF-download";        
        $http
            .post(priceListEmailApi, $scope.postData)
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {

                    var pdf = res.data.file_url;
                    var hiddenElement = document.createElement('a');
                    hiddenElement.href = pdf;
                    // hiddenElement.target = '_blank'; // open in new tab
                    hiddenElement.download = 'priceList.pdf';//pdf
                    // hiddenElement.download = params.downloadName; // download
                    document.body.appendChild(hiddenElement);
                    hiddenElement.click();
                    document.body.removeChild(hiddenElement);

                    // toaster.pop('success', 'Info', 'PDF Download successfully');               
                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            }); 
    }

    // ----------------Rebate  -----------------------------------------

    /* $scope.$root.tabHide = 0;
    $scope.$root.lblButton = 'Add New';
    $scope.check_readonly = 0;
    $scope.rec.type = 1; */

    $scope.rebateFormShow = false;
    $scope.rebateListingShow = true;

    $scope.searchKeyword = {};

    $scope.arr_rebate_types = [{ 'id': 1, 'name': 'Universal Rebate to Supplier' },
    { 'id': 2, 'name': 'Separate Rebate for Category(ies)' },
    { 'id': 3, 'name': 'Separate Rebate for Items' }];

    /* $scope.arr_rebate_universal = [{ 'id': 1, 'name': 'Universal Rebate' },
    { 'id': 2, 'name': 'Volume Based Rebate' },
    { 'id': 3, 'name': 'Revenue Based Rebate' }]; */

    $scope.arr_rebate_universal = [{ 'id': 1, 'name': 'Universal Rebate' }];

    $scope.showRebateEditForm = function () {
        $scope.rebate_chk_readonly = false;

        if ($scope.volumeBasedRebate != undefined) {
            $scope.volumeBasedRebate.push({
                'revenue_volume_from': '',
                'rebate_types': '',
                'rebate': '',
                'id': '',
                'mode': 0,
                'editchk': 0
            });
        }
    }

    $scope.onChangeRebateType = function () {
        $scope.resetItemsRebate();
        // $scope.Rebate_rec.universal_types = '';
    }

    //  Rebate category code start 
    $scope.columns = [];
    $scope.Categoriesarray = [];
    $scope.selectedCats = [];
    $scope.PendingSelcategory = [];
    $scope.selCRMrebateCategoriesTooltip = "";

    $scope.getCategories = function () {

        $scope.title = 'Categories';
        $scope.showLoader = true;
        $scope.searchKeyword = {};

        $scope.columns = [];
        $scope.Categoriesarray = [];

        if ($rootScope.cat_prodcut_arr.length > 0) {

            angular.copy($rootScope.cat_prodcut_arr, $scope.Categoriesarray);
            angular.copy($rootScope.cat_prodcut_arr, $scope.columns);

            if ($scope.selectedCats.length > 0) {
                angular.forEach($scope.Categoriesarray, function (obj) {
                    obj.chk = false;
                    angular.forEach($scope.selectedCats, function (obj2) {
                        if (obj2.id == obj.id)
                            obj.chk = true;
                    });
                });
            }
            else {
                angular.forEach($scope.Categoriesarray, function (obj) {
                    obj.chk = false;
                });
            }
            // console.log($scope.columns);

            angular.element('#_rebateCategoryModal').modal({ show: true });
        }
        else
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

        $scope.showLoader = false;
    }

    $scope.selectcategorieschk = function (cat) {

        $scope.selectedAll = false;

        for (var i = 0; i < $scope.Categoriesarray.length; i++) {

            if (cat.id == $scope.Categoriesarray[i].id) {

                if ($scope.Categoriesarray[i].chk == true)
                    $scope.Categoriesarray[i].chk = false;
                else
                    $scope.Categoriesarray[i].chk = true;
            }
        }
    }

    $scope.checkAllcategories = function (val) {

        var selection_filter = $filter('filter');
        var filtered = selection_filter($scope.Categoriesarray, $scope.searchKeyword.search);
        
        $scope.PendingSelcategory = [];

        if (val == true) {
            
			angular.forEach(filtered, function (obj) {
				obj.chk = true;
				$scope.PendingSelcategory.push(obj);
			})

            // for (var i = 0; i < $scope.Categoriesarray.length; i++) {
            //     $scope.Categoriesarray[i].chk = true;
            //     $scope.PendingSelcategory.push($scope.Categoriesarray[i]);
            // }
        } else {
            for (var i = 0; i < $scope.Categoriesarray.length; i++) {
                $scope.Categoriesarray[i].chk = false;
            }

            $scope.PendingSelcategory = [];
        }
    }

    $scope.submitPendingSelcategories = function () {

        $scope.PendingSelcategory = [];
        $scope.PendingSelcategoryTooltip = "";

        for (var i = 0; i < $scope.Categoriesarray.length; i++) {

            if ($scope.Categoriesarray[i].chk == true) {
                $scope.PendingSelcategory.push($scope.Categoriesarray[i]);
                $scope.PendingSelcategoryTooltip = $scope.PendingSelcategoryTooltip + $scope.Categoriesarray[i].title + "; ";
            }
        }

        $scope.PendingSelcategoryTooltip = $scope.PendingSelcategoryTooltip.slice(0, -2);

        $scope.selectedCats = $scope.PendingSelcategory;
        $scope.selCRMrebateCategoriesTooltip = $scope.PendingSelcategoryTooltip;

        angular.element('#_rebateCategoryModal').modal('hide');
    }

    $scope.clearPendingSelcategories = function () {
        $scope.PendingSelcategory = [];
        $scope.PendingSelcategoryTooltip = "";
        angular.element('#_rebateCategoryModal').modal('hide');
    }

    //  Rebate category code end 


    $scope.changeItemsRebate = function () {
        $scope.selectedItems = [];
        $scope.selCRMrebateItemsTooltip = "";
        $scope.selectedRecFromModalsItem = [];
    }

    //  Rebate Items code start 
    $scope.columns = [];
    $scope.tempProdArr = [];
    $scope.selectedItems = [];
    $scope.volumeBasedRebate = [];
    $scope.revenueBasedRebate = [];
    $scope.PendingSelectedRebateItems = [];
    $scope.selCRMrebateItemsTooltip = "";
    $scope.filterRebateItem = {};

    $scope.searchKeywordRebateItem = {};
    $scope.selectedRecFromModalsItem = [];

    $scope.clearFiltersAndSelectItems = function () {		
			$scope.searchKeywordRebateItem = {};
			$scope.getItemsRebate();
	}

    $scope.getItemsRebate = function (item_paging,sort_column,sortform) {

        if (($scope.Rebate_rec.universal_types != undefined && $scope.Rebate_rec.universal_types.id != 3) || ($scope.Rebate_rec.universal_types == undefined)) {

            if (!$scope.Rebate_rec.uoms) {
                $scope.products_rebate = [];
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));
                return false;
            }
        }

        $scope.showLoader = true;

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.moduleType = 'ItemDetail';

        $scope.tempProdArr = [];
        $scope.tempProdArr2 = []
        $scope.tempProdArr2.response = [];

        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.searchKeyword = $scope.searchKeywordRebateItem;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeywordRebateItem = {};
            $scope.record_data = {};
        }

        if($scope.Rebate_rec.uoms && $scope.Rebate_rec.uoms.name)
            $scope.postData.searchKeyword.unit_name = $scope.Rebate_rec.uoms.name;

        if($scope.Rebate_rec.universal_types && $scope.Rebate_rec.universal_types.id != 2)
            $scope.postData.searchKeyword.unit_name = '';

        if ((sort_column != undefined) && (sort_column != null)) {
            //sort by column
            $scope.postData.sort_column = sort_column;
            $scope.postData.sortform = sortform;

            $rootScope.sortform = sortform;
            $rootScope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;
            $rootScope.sort_column = sort_column;

            $rootScope.save_single_value($rootScope.sort_column, 'srmsort_name');
        }

        // $scope.postData.cond = 'Detail';
        // $scope.filterPurchaseItem = {};

        $scope.postData.cond = 'setupDetail';
        $scope.postData.srm_id = 1;
        $scope.postData.orderDate = $scope.$root.get_current_date();

        // var itemListingApi = $scope.$root.reports + "module/item-data-for-report";
        var itemListingApi = $scope.$root.stock + "products-listing/item-details-price-qty";

        $scope.showLoader = true;
        $http
            .post(itemListingApi, $scope.postData)
            .then(function (res) {
                $scope.tableDataItmList = res;
                $scope.columns = [];
                $scope.record_data = {};
                $scope.recordArray = [];
                $scope.showLoader = false;
                $scope.PendingSelectedItems = [];

                if (res.data.ack == true) {
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.record_data = res.data.response;
                    $scope.tempProdArr = res.data;

                    angular.forEach($scope.tempProdArr, function (value, key) {
                        if (key != "tbl_meta_data") {
                            $scope.recordArray.push(value);
                        }
                    });

                    for (var i = 0; i < $scope.tempProdArr.length; i++) {

                        $scope.tempProdArr[i].chk = false;
                        $scope.tempProdArr[i].calc_current_stock = Number($scope.tempProdArr[i].allocated_stock) + Number($scope.tempProdArr[i].available_stock);
                    }
                    angular.forEach($scope.tableDataItmList.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });

                    if ($scope.tempProdArr.response)
                        angular.element('#itemRebatModal').modal({ show: true });
                        // angular.element('#productModal').modal({ show: true });

                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            }); 
    }

    $scope.addPendingRebateItems = function () {

        $scope.items_array = [];
        $scope.showPostBtn = true;
        $scope.showLoader = true;

        angular.copy($scope.tempProdArr.response, $scope.items_array);

        var selItemList = [];
        $scope.selectedItems = [];

        angular.forEach($scope.selectedRecFromModalsItem, function (obj) {
            selItemList.push(obj.record);
		});
		
		angular.forEach(selItemList, function (prodData) {

			try {
                $scope.selectedItems.push(prodData);

            } catch (error) {
                $scope.showLoader = false;
            }
        });
        $scope.showLoader = false;
        angular.element('#itemRebatModal').modal('hide');
    }

    $scope.clearPendingRebateItems = function () {
        $scope.PendingSelectedRebateItems = [];
        $scope.PendingSelRebateTooltip = "";
        $scope.PendingSelectedPurchaseItems = [];
        $scope.PendingSelectedItems = [];
        angular.element('#itemRebatModal').modal('hide');
    }

    //  Rebate Items code end 
    $scope.Rebate_rec = {};
    $scope.Rebate_rec.universal_types = $scope.arr_rebate_universal[0];
    
    $scope.resetFormRebate = function (rec) {

        $scope.Rebate_rec = {};
        $scope.Rebate_rec.universal_types = $scope.arr_rebate_universal[0];
        $scope.items = [];
        $scope.categories = [];
        $scope.Rebate_rec.type = 1;
        $scope.isCat = false;
        $scope.isItem = false;
        $scope.selectedItems = [];
        $scope.selectedCats = [];
        $scope.Rebate_rec.created_by = $rootScope.defaultUserName;
        $scope.Rebate_rec.rebate_date = $scope.$root.get_current_date();
        $scope.selCRMrebateItemsTooltip = "";
        $scope.selCRMrebateCategoriesTooltip = "";
    }

    $scope.resetItemsRebate = function () {
        $scope.selectedItems = [];
        $scope.selectedCats = [];

        $scope.selCRMrebateItemsTooltip = "";
        $scope.selCRMrebateCategoriesTooltip = "";

        $scope.volumeBasedRebate = [];
        $scope.revenueBasedRebate = [];

        $scope.viewRevenueRebate = false;
        $scope.viewVolumeRebate = false;
        $scope.rebateTypeDisable = false;

        if ($scope.Rebate_rec.universal_types) {

            if ($scope.Rebate_rec.universal_types.id == 2) {
                $scope.volumeBasedRebate.push({
                    'revenue_volume_from': '',
                    'rebate_types': '',
                    'rebate': '',
                    'id': '',
                    'mode': 0,
                    'editchk': 0
                });
            }
            else if ($scope.Rebate_rec.universal_types.id == 3) {

                $scope.revenueBasedRebate.push({
                    'revenue_volume_from': '',
                    'rebate_types': '',
                    'rebate': '',
                    'id': '',
                    'mode': 0,
                    'editchk': 0
                });

                $scope.Rebate_rec.rebate_price_types = $scope.list_type[0];
                $scope.rebateTypeDisable = true;
            }
            else if ($scope.Rebate_rec.universal_types.id == 1 && $scope.list_type != undefined) {
                $scope.Rebate_rec.rebate_price_types = $scope.list_type[0];
                $scope.rebateTypeDisable = true;
            }            
        }

        $scope.Rebate_rec.created_by = $rootScope.defaultUserName;
        $scope.Rebate_rec.rebate_date = $scope.$root.get_current_date();
    }

    $scope.data = [];
    $scope.dataRebate = [];

    $scope.searchKeyword = {};

    $scope.getRebate = function (item_paging, sort_column, sortform) {
        // $scope.breadcrumbs[3].name = 'Rebate';

        if (item_paging == 1) $scope.item_paging.spage = 1;
        $scope.postData.page = $scope.item_paging.spage;

        // $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        $scope.postData.searchKeyword = $scope.searchKeyword;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }

        // var ApiAjax = $scope.$root.sales + "crm/crm/crm-rebate-listings";
        var ApiAjax = $scope.$root.sales + "crm/crm/rebate-listings";

        $scope.dataRebate = [];
        $scope.showLoader = true;
        // Rebate_rec.moduleID = $scope.$root.crm_id;
        // Rebate_rec.moduleType = 1;

        /* var postData = {
            'column': 'crm_id',
            'value': $scope.$root.crm_id,
            'token': $scope.$root.token
        } */
        var postData = {
            'moduleType': 2,
            'moduleID': $stateParams.id,
            'token': $scope.$root.token,
            'searchKeyword': $scope.searchKeyword
        }

        $http
            .post(ApiAjax, postData)
            .then(function (res) {
                $scope.tableData = res;
                $scope.showLoader = false;

                if (res.data.ack == true) {

                    angular.forEach($scope.tableData.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event != undefined && obj.event.delete != undefined) {
                            if (typeof eval(obj.event.delete) == "function")
                                obj.event.delete = eval(obj.event.delete);
                            else
                                $scope.tableData.data.response.tbl_meta_data.response.colMeta.splice(index, 1);
                        }
                        if (obj.event != undefined && obj.event.edit != undefined) {
                            if (typeof eval(obj.event.edit) == "function")
                                obj.event.edit = eval(obj.event.edit);
                            else
                                $scope.tableData.data.response.tbl_meta_data.response.colMeta.splice(index, 1);
                        }
                    })


                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.record_data = res.data.response;
                    $scope.dataRebate = res.data.response;
                }

            }).catch(function (message) {
                $scope.showLoader = false;
                
                throw new Error(message.data);
                console.log(message.data);
            });
        $scope.rebateFormShow = false;
        $scope.rebateListingShow = true;
    }

    // Show Rebate Form in Add/Edit Mode.
    $scope.OpenRebateForm = function (event, id, mode) {
        if (event)
            event.stopPropagation();
        $scope.showLoader = true;
        $scope.items = [];
        $scope.products_rebate = [];
        $scope.selectedItems = [];
        $scope.categories = [];
        $scope.selectedCats = [];
        $scope.selectedRecFromModalsItem = [];
        $scope.selCRMrebateItemsTooltip = "";
        $scope.selCRMrebateCategoriesTooltip = "";

        $scope.Rebate_rec.rebate_date = $scope.$root.get_current_date();
        $scope.Rebate_rec.created_by = $rootScope.defaultUserName;

        $scope.rebateFormShow = true;
        $scope.rebateListingShow = false;
        $scope.rebate_chk_readonly = false;

        $scope.list_type = [{ 'name': 'Percentage', 'id': 1 }, { 'name': 'Value', 'id': 2 }];
        var RebateUrl = $scope.$root.sales + "crm/crm/get-rebate";

        if (id > 0) {
            if (mode == 1)
                $scope.rebate_chk_readonly = true;
            else if (mode == 0)
                $scope.rebate_chk_readonly = false;

            $http
                .post(RebateUrl, {
                    'id': id,
                    'token': $scope.$root.token
                })
                .then(function (res) {

                    if (res.data.ack == true) {
                        $scope.Rebate_rec = res.data.response;
                        $scope.Rebate_rec.rebate_price = parseFloat($scope.Rebate_rec.rebate_price);
                        $scope.Rebate_rec.id = res.data.response.id;
                        $scope.Rebate_rec.universal_types = res.data.response.universal_type;
                        $scope.Rebate_rec.rebate_date = res.data.response.created_date;
                        $scope.Rebate_rec.type = res.data.response.rebate_type;

                        if ($scope.Rebate_rec.type == 2 && res.data.response.categories != undefined) {

                            $scope.Categoriesarray = $rootScope.cat_prodcut_arr;

                            angular.forEach($scope.Categoriesarray, function (obj) {
                                angular.forEach(res.data.response.categories.response, function (obj1) {

                                    if (obj1.category_id == obj.id) {
                                        obj.chk = true;
                                        $scope.selectedCats.push(obj);
                                        $scope.selCRMrebateCategoriesTooltip = $scope.selCRMrebateCategoriesTooltip + obj.name + "; ";
                                    }
                                });
                            });
                        }

                        if (($scope.Rebate_rec.type == 3 || $scope.Rebate_rec.universal_type == 2 || $scope.Rebate_rec.universal_type == 3) && res.data.response.items != undefined) {

                            /* $scope.tempProdArr = $rootScope.prooduct_arr;

                            angular.forEach($scope.tempProdArr, function (obj) {
                                angular.forEach(res.data.response.items.response, function (obj1) {

                                    if (obj1.item_id == obj.id) {
                                        obj.chk = true;
                                        $scope.selectedItems.push(obj);
                                        $scope.selCRMrebateCategoriesTooltip = $scope.selCRMrebateCategoriesTooltip + obj.description + "; ";
                                    }
                                });
                            }); */

                            angular.forEach(res.data.response.items.response, function (recData) {
                                
                                var selRecord = {};
                                selRecord.key = recData.id;
                                selRecord.record = recData;
                                selRecord.value = recData.product_code;							

                                $scope.selectedItems.push(recData); 
                                $scope.selectedRecFromModalsItem.push(selRecord);
                                $scope.selCRMrebateCategoriesTooltip = $scope.selCRMrebateCategoriesTooltip + recData.description + "; ";
                            });
                        }

                        angular.forEach($scope.arr_rebate_types, function (elem) {
                            if (elem.id == res.data.response.rebate_type)
                                $scope.Rebate_rec.types = elem;
                        });

                        angular.forEach($scope.arr_rebate_universal, function (elem) {
                            if (elem.id == res.data.response.universal_type)
                                $scope.Rebate_rec.universal_types = elem;
                        });

                        if (res.data.response.rebate_price_type > 0) {

                            angular.forEach($scope.list_type, function (obj1) {
                                if (obj1.id == res.data.response.rebate_price_type)
                                    $scope.Rebate_rec.rebate_price_types = obj1;
                            });
                        }

                        if (res.data.response.uom > 0) {

                            angular.forEach($rootScope.uni_prooduct_arr, function (obj1) {
                                if (obj1.id == res.data.response.uom)
                                    $scope.Rebate_rec.uoms = obj1;
                            });
                        }

                        $scope.volumeBasedRebate = [];
                        $scope.revenueBasedRebate = [];

                        if (res.data.response.universal_type == 2 || res.data.response.universal_type == 3) {

                            if(res.data.response.universal_type == 2){

                                if (res.data.response.revenueVolume && res.data.response.revenueVolume.length > 0) {

                                    angular.forEach(res.data.response.revenueVolume, function (obj1) {

                                        angular.forEach($scope.list_type, function (obj2) {
                                            if (obj2.id == obj1.rebate_type)
                                                obj1.rebate_types = obj2;
                                        });
                                        $scope.volumeBasedRebate.push(obj1);
                                    });
                                }
                                else {
                                    $scope.volumeBasedRebate.push({
                                        'revenue_volume_from': '',
                                        'rebate_types': '',
                                        'rebate': '',
                                        'id': '',
                                        'mode': 0,
                                        'editchk': 0
                                    });
                                }
                            }

                            if(res.data.response.universal_type == 3){

                                if (res.data.response.revenueVolume && res.data.response.revenueVolume.length > 0) {

                                    angular.forEach(res.data.response.revenueVolume, function (obj1) {

                                        angular.forEach($scope.list_type, function (obj2) {

                                            if (obj2.id == obj1.rebate_type)
                                                obj1.rebate_types = obj2;
                                        });
                                        $scope.revenueBasedRebate.push(obj1);
                                    });
                                }
                                else {
                                    $scope.revenueBasedRebate.push({
                                        'revenue_volume_from': '',
                                        'rebate_types': '',
                                        'rebate': '',
                                        'id': '',
                                        'mode': 0
                                    });
                                }
                            }
                        }
                    }
                }).catch(function (message) {
                    $scope.showLoader = false;
                    
                    throw new Error(message.data);
                    console.log(message.data);
                });
            $scope.showLoader = false;
        } else {
            $scope.resetFormRebate();
            $scope.showLoader = false;
        }
    }

    // Add/Edit Rebate
    $scope.addRebate = function (Rebate_rec) {

        //console.log(Rebate_rec);
        //console.log($scope.selectedItems);
        //  return false;

        $scope.showLoader = true;

        Rebate_rec.moduleID = $stateParams.id;
        Rebate_rec.moduleType = 2;
        Rebate_rec.token = $scope.$root.token;

        Rebate_rec.type = Rebate_rec.types != undefined ? Rebate_rec.types.id : 0;
        Rebate_rec.universal_type = Rebate_rec.universal_types != undefined ? Rebate_rec.universal_types.id : 0;
        Rebate_rec.rebate_price_type = Rebate_rec.rebate_price_types != undefined ? Rebate_rec.rebate_price_types.id : 0;
        Rebate_rec.uom = Rebate_rec.uoms != undefined ? Rebate_rec.uoms.id : 0;

        // if (Rebate_rec.type == 1 && (Rebate_rec.universal_type == 0 || Rebate_rec.universal_type == undefined || Rebate_rec.universal_type == '')){
        if (!Rebate_rec.universal_type){
            $scope.showLoader = false;
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Universal Type']));
            return;
        }
        //Rebate_rec.type == 3 ||         
        if (Rebate_rec.universal_type == 2 || Rebate_rec.universal_type == 3) {
            Rebate_rec.items = $scope.selectedItems;
            if (!$scope.selectedItems || !(Rebate_rec.items.length > 0)) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Item(s)']));
                return;
            }
        }


        if (Rebate_rec.rebate_price_type == 0) {
            $scope.showLoader = false;
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Rebate Type']));
            return;
        }

        if (!Rebate_rec.offer_date || Rebate_rec.offer_date ==0) {
            $scope.showLoader = false;
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Start Date']));
            return false;
        }

        if (!Rebate_rec.offer_valid_date || Rebate_rec.offer_valid_date ==0) {
            $scope.showLoader = false;
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['End Date']));
            return false;
        }

        if (Rebate_rec.offer_date && Rebate_rec.offer_valid_date) {

            var startDate, endDate;

            startDate = Rebate_rec.offer_date.split("/")[2] + "-" + Rebate_rec.offer_date.split("/")[1] + "-" + Rebate_rec.offer_date.split("/")[0];
            endDate = Rebate_rec.offer_valid_date.split("/")[2] + "-" + Rebate_rec.offer_valid_date.split("/")[1] + "-" + Rebate_rec.offer_valid_date.split("/")[0];

            if (startDate != null || endDate != null) {

                var startDate1, endDate1;
                startDate1 = new Date(startDate.replace(/\s/g, ''));
                endDate1 = new Date(endDate.replace(/\s/g, ''));

                var fDate, lDate;
                fDate = Date.parse(startDate1);
                lDate = Date.parse(endDate1);

                if (fDate > lDate) {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(361, ['End Date','Start Date']));
                    return false;
                }
            }
        }

        /* if ((Rebate_rec.type == 3 || (Rebate_rec.type == 1 && Rebate_rec.universal_type == 2)) && Rebate_rec.uom == 0) {
            $scope.showLoader = false;
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));
            return;
        }

        if ((Rebate_rec.type == 2 && Rebate_rec.rebate_price_type == 2) && Rebate_rec.uom == 0) {
            $scope.showLoader = false;
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));
            return;
        } */

        // console.log($scope.revenueBasedRebate);
        // console.log($scope.volumeBasedRebate);

        if (Rebate_rec.universal_type == 3) {

            var revVolerror = 0;
            var revenueVolFromReqError = 0;
            var revenueVolToReqError = 0;
            var revenueVolFromError = 0;
            var revenueVolToError = 0;
            var revenueVolFromZeroError = 0;
            var revenueVolToZeroError = 0;
            // var revenueLength = $scope.revenueBasedRebate.length;

            angular.forEach($scope.revenueBasedRebate, function (obj, index) {
                // console.log(obj);
                obj.rebate_types = Rebate_rec.rebate_price_types;
                
                if (!isNaN(parseFloat(obj.mode))) {
                    if (!(obj.mode > 0))
                        revVolerror++;
                }

                if (Math.abs(obj.revenue_volume_from) > 0 || Math.abs(obj.rebate) > 0) {

                    if (parseFloat(obj.revenue_volume_from) == 0) {
                        revenueVolFromZeroError++;
                        return false;
                    }

                    if (!(parseFloat(obj.revenue_volume_from) > 0)) {
                        revenueVolFromReqError++;
                        return false;
                    } 

                    if (!(parseFloat(obj.rebate) > 0)) {
                        revVolerror++;
                        return false;
                    }

                    if ($scope.Rebate_rec.rebate_price_types.id == 1) {

                        if (parseFloat(obj.rebate) >= 100) {
                            $scope.showLoader = false;
                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(619, [rec.rebate]));
                            revVolerror++;
                            return false;
                        }

                        if (parseFloat(obj.rebate) <= 0) {
                            $scope.showLoader = false;
                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Rebate', '0']));
                            revVolerror++;
                            return false;
                        }
                    }

                    angular.forEach($scope.revenueBasedRebate, function (rec, recIndex) {
                        if (rec.qtyID && obj.qtyID) {
                            if (parseFloat(rec.revenue_volume_from) == obj.revenue_volume_from && rec.qtyID != obj.qtyID)
                                revenueVolFromError++;
                        }
                        else {
                            if (parseFloat(rec.revenue_volume_from) == obj.revenue_volume_from && index != recIndex)
                                revenueVolFromError++;
                        }
                    });

                    /* angular.forEach($scope.revenueBasedRebate, function (rec, recIndex) {
                        if (rec.qtyID != undefined && obj.qtyID != undefined) {

                            if (parseFloat(rec.revenue_volume_from) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_from) <= obj.revenue_volume_to && rec.qtyID != obj.qtyID)
                                revenueVolFromError++;

                            if (parseFloat(rec.revenue_volume_to) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) <= obj.revenue_volume_to && rec.qtyID != obj.qtyID)
                                revenueVolToError++;

                            if (parseFloat(rec.revenue_volume_from) < obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) > obj.revenue_volume_to && rec.qtyID != obj.qtyID)
                                revenueVolToError++;
                        }
                        else {
                            if (parseFloat(rec.revenue_volume_from) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_from) <= obj.revenue_volume_to && index != recIndex)
                                revenueVolFromError++;

                            if (parseFloat(rec.revenue_volume_to) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) <= obj.revenue_volume_to && index != recIndex)
                                revenueVolToError++;

                            if (parseFloat(rec.revenue_volume_from) < obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) > obj.revenue_volume_to && index != recIndex)
                                revenueVolToError++;
                        }
                    }); */
                }
            });

            if (revenueVolFromZeroError > 0) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Revenue From', '0']));
                revVolerror++;
                return false;
            }

            /* if (revenueVolToZeroError > 0) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Revenue To', '0']));
                revVolerror++;
                return false;
            } */

            if (revenueVolFromReqError > 0) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Revenue From']));
                return false;
            }

            /* if (revenueVolToReqError > 0) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Revenue To']));
                return false;
            } */
            
            if (revenueVolFromError > 0) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', 'Revenue From is overlapping!');
                return false;
            }

            /* if (revenueVolToError > 0) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', 'Revenue To is overlapping!');
                return false;
            } */

            if (revVolerror > 1) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(347));
                return;
            }

            Rebate_rec.recVolumeRevenue = $scope.revenueBasedRebate;
        }
        else if (Rebate_rec.universal_type == 2) {

            var revVolerror = 0;
            var revenueVolFromError = 0;
            var revenueVolToError = 0;
            var revenueVolFromReqError = 0;
            var revenueVolToReqError = 0;
            var revenueVolFromZeroError = 0;
            var revenueVolToZeroError = 0;

            angular.forEach($scope.volumeBasedRebate, function (obj, index) {
                // console.log(obj);
                obj.rebate_types = Rebate_rec.rebate_price_types;
                if (!isNaN(parseFloat(obj.mode))) {
                    if (!(obj.mode > 0))
                        revVolerror++;
                }

                if (Math.abs(obj.revenue_volume_from) > 0 || Math.abs(obj.rebate) > 0) {

                    if (parseFloat(obj.revenue_volume_from) == 0) {
                        revenueVolFromZeroError++;
                        return false;
                    }

                    if (!(parseFloat(obj.revenue_volume_from) > 0)) {
                        revenueVolFromReqError++;
                        return false;
                    }

                    if (!(parseFloat(obj.rebate) > 0)) {
                        revVolerror++;
                        return false;
                    }

                    if ($scope.Rebate_rec.rebate_price_types.id == 1) {

                        if (parseFloat(obj.rebate) >= 100) {
                            $scope.showLoader = false;
                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(619, [rec.rebate]));
                            revVolerror++;
                            return false;
                        }

                        if (parseFloat(obj.rebate) <= 0) {
                            $scope.showLoader = false;
                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Rebate', '0']));
                            revVolerror++;
                            return false;
                        }
                    }

                    angular.forEach($scope.volumeBasedRebate, function (rec, recIndex) {
                        if (rec.qtyID && obj.qtyID) {
                            if (parseFloat(rec.revenue_volume_from) == obj.revenue_volume_from && rec.qtyID != obj.qtyID)
                                revenueVolFromError++;
                        }
                        else {
                            if (parseFloat(rec.revenue_volume_from) == obj.revenue_volume_from && index != recIndex)
                                revenueVolFromError++;
                        }
                    });

                    /* angular.forEach($scope.volumeBasedRebate, function (rec, recIndex) {

                        if (rec.qtyID != undefined && obj.qtyID != undefined) {

                            if (parseFloat(rec.revenue_volume_from) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_from) <= obj.revenue_volume_to && rec.qtyID != obj.qtyID)
                                revenueVolFromError++;

                            if (parseFloat(rec.revenue_volume_to) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) <= obj.revenue_volume_to && rec.qtyID != obj.qtyID)
                                revenueVolToError++;

                            if (parseFloat(rec.revenue_volume_from) < obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) > obj.revenue_volume_to && rec.qtyID != obj.qtyID)
                                revenueVolToError++;
                        }
                        else {
                            if (parseFloat(rec.revenue_volume_from) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_from) <= obj.revenue_volume_to && index != recIndex)
                                revenueVolFromError++;

                            if (parseFloat(rec.revenue_volume_to) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) <= obj.revenue_volume_to && index != recIndex)
                                revenueVolToError++;

                            if (parseFloat(rec.revenue_volume_from) < obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) > obj.revenue_volume_to && index != recIndex)
                                revenueVolToError++;
                        }
                    }); */
                }
            });


            if (revenueVolFromZeroError > 0) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Volume From', '0']));
                revVolerror++;
                return false;
            }

            /* if (revenueVolToZeroError > 0) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Volume To', '0']));
                revVolerror++;
                return false;
            } */

            if (revenueVolFromReqError > 0) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Volume From']));
                return false;
            }

            /* if (revenueVolToReqError > 0) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Volume To']));
                return false;
            } */

            if (revenueVolFromError > 0) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(555, ['Volume From']));
                return false;
            }

            /* if (revenueVolToError > 0) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(555, ['Volume To']));
                return false;
            } */

            if (revVolerror > 1) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(554));
                return;
            }
            Rebate_rec.recVolumeRevenue = $scope.volumeBasedRebate;
        }

        // return false;

        var addUrl = $scope.$root.sales + "crm/crm/add-rebate";

        if (Rebate_rec.id != undefined)
            addUrl = $scope.$root.sales + "crm/crm/update-rebate";

        if (Rebate_rec.universal_type != 2 && Rebate_rec.universal_type != 3 && Rebate_rec.rebate_price_types.id == 1) {

            if (Rebate_rec.rebate_price >= 100) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(598, [Rebate_rec.rebate_price]));
                return;
            }

            if (Rebate_rec.rebate_price <= 0 || Rebate_rec.rebate_price == undefined) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(238, ['Rebate ', '0']));
                return;
            }
        }

        // console.log(Rebate_rec);

        $http
            .post(addUrl, Rebate_rec)
            .then(function (res) {

                $scope.showLoader = false;

                if (res.data.ack == true || res.data.edit == true) {

                    if (Rebate_rec.id > 0)
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    else {
                        Rebate_rec.id = res.data.id;
                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                    }

                    $scope.getRebate(1);

                } else {

                    if (Rebate_rec.id > 0)
                        toaster.pop('error', 'Edit', res.data.error);
                    else
                        toaster.pop('error', 'Add', res.data.error);
                }
            }).catch(function (message) {
                $scope.showLoader = false;
                
                throw new Error(message.data);
                console.log(message.data);
            });

    }

    $scope.delete_rebate = function (event, id, index, arr_data) {
        var delUrl = $scope.$root.sales + "crm/crm/delete-rebate";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    'id': id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $scope.getRebate(1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.rebateTypeDisable = false;


    $scope.addVolumeRebate = function (rec, editmode, recIndex) {

        $scope.rebateTypeChk = 0;

        if (parseFloat(rec.revenue_volume_from) == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Volume From', '0']));
            return false;
        }

        /* if (parseFloat(rec.revenue_volume_to) == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Volume To', '0']));
            return false;
        } */

        if (!(parseFloat(rec.revenue_volume_from) > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Volume From']));
            return false;
        }

        /* if (!(parseFloat(rec.revenue_volume_to) > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Volume To']));
            return false;
        } */


        rec.rebate_types = {};

        if ($scope.Rebate_rec.rebate_price_types != undefined) {
            if (!($scope.Rebate_rec.rebate_price_types.id > 0)) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Rebate Type']));
                return false;
            }
        } else {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Rebate Type']));
            return false;
        }
        rec.rebate_types.id = $scope.Rebate_rec.rebate_price_types.id;

        if (!(rec.rebate > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Rebate']));
            return false;
        }

        /* if (parseFloat(rec.revenue_volume_from) > parseFloat(rec.revenue_volume_to)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(301));
            return false;
        } */

        // if (rec.rebate_types.id == 1) {
        if ($scope.Rebate_rec.rebate_price_types.id == 1) {

            if (parseFloat(rec.rebate) >= 100) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(598, [rec.rebate]));
                return false;
            }

            if (parseFloat(rec.rebate) <= 0) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(238, ['Rebate ', '0']));
                return false;
            }
        }
        var revenueVolFromError = 0;
        var revenueVolToError = 0;

        /* angular.forEach($scope.volumeBasedRebate, function (obj, index) {

            if (rec.qtyID != undefined && obj.qtyID != undefined) {

                if (parseFloat(rec.revenue_volume_from) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_from) <= obj.revenue_volume_to && rec.qtyID != obj.qtyID)
                    revenueVolFromError++;

                if (parseFloat(rec.revenue_volume_to) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) <= obj.revenue_volume_to && rec.qtyID != obj.qtyID)
                    revenueVolToError++;

                if (parseFloat(rec.revenue_volume_from) < obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) > obj.revenue_volume_to && rec.qtyID != obj.qtyID)
                    revenueVolToError++;
            }
            else {
                if (parseFloat(rec.revenue_volume_from) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_from) <= obj.revenue_volume_to && index != recIndex)
                    revenueVolFromError++;

                if (parseFloat(rec.revenue_volume_to) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) <= obj.revenue_volume_to && index != recIndex)
                    revenueVolToError++;

                if (parseFloat(rec.revenue_volume_from) < obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) > obj.revenue_volume_to && index != recIndex)
                    revenueVolToError++;
            }

            if (rec.revenue_volume_to.length > 0 || rec.revenue_volume_from.length > 0 || rec.rebate.length > 0) {
                $scope.rebateTypeChk++;
            }
        }); */

        angular.forEach($scope.volumeBasedRebate, function (obj, index) {
            if (rec.qtyID && obj.qtyID) {
                if (parseFloat(rec.revenue_volume_from)  == obj.revenue_volume_from && rec.qtyID != obj.qtyID)
                    revenueVolFromError++;
            }
            else {
                if (parseFloat(rec.revenue_volume_from)  == obj.revenue_volume_from && index != recIndex)
                    revenueVolFromError++;
            }

            if (rec.revenue_volume_from.length > 0 || rec.rebate.length > 0) {
                $scope.rebateTypeChk++;
            }
        });

        if (revenueVolFromError > 0) {
            toaster.pop('error', 'Info', 'Qunatity From is overlapping!');
            return false;
        }

        /* if (revenueVolToError > 0) {
            toaster.pop('error', 'Info', 'Qunatity To is overlapping!');
            return false;
        } */

        if ($scope.rebateTypeChk > 0)
            $scope.rebateTypeDisable = true;
        // if ($scope.Rebate_rec.id == undefined)
        //     $scope.saveRebate(rec);
        // console.log(editmode);

        rec.mode = 1;

        if (editmode > 0) {
            if ($scope.volumeBasedRebate[$scope.volumeBasedRebate.length - 1].editchk > 0) {
                $scope.volumeBasedRebate.push({
                    'revenue_volume_from': '',
                    'rebate_types': '',
                    'rebate': '',
                    'id': '',
                    'mode': 0,
                    'editchk': 0
                });
            }
            rec.editchk = 0;
        }
        else {
            $scope.volumeBasedRebate.push({
                'revenue_volume_from': '',
                'rebate_types': '',
                'rebate': '',
                'id': '',
                'mode': 0,
                'editchk': 0
            });
        }
    }

    $scope.editVolumeRebate = function (rec, recIndex) {
        rec.editchk = 1;
        rec.mode = 0;
    }

    $scope.addRevenueRebate = function (rec, editmode, recIndex) {

        $scope.rebateTypeChk = 0;

        if (parseFloat(rec.revenue_volume_from) == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Revenue From', '0']));
            return false;
        }

        /* if (parseFloat(rec.revenue_volume_to) == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Revenue To', '0']));
            return false;
        } */

        if (!(parseFloat(rec.revenue_volume_from) > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Revenue']));
            return false;
        }

        /* if (!(parseFloat(rec.revenue_volume_to) > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Revenue']));
            return false;
        } */



        rec.rebate_types = {};

        if ($scope.Rebate_rec.rebate_price_types != undefined) {
            if (!($scope.Rebate_rec.rebate_price_types.id > 0)) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Rebate Type']));
                return false;
            }
        } else {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Rebate Type']));
            return false;
        }
        
        rec.rebate_types.id = $scope.Rebate_rec.rebate_price_types.id;

        if (!(parseFloat(rec.rebate) > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Rebate']));
            return false;
        }

        /* if (parseFloat(rec.revenue_volume_from) > parseFloat(rec.revenue_volume_to)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(237, ['Revenue ', 'Revenue To']));
            return false;
        } */

        // if (rec.rebate_types.id == 1) {
        if ($scope.Rebate_rec.rebate_price_types.id == 1) {

            if (parseFloat(rec.rebate) >= 100) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(598, [rec.rebate]));
                return false;
            }

            if (parseFloat(rec.rebate) <= 0) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(238, ['Rebate ', '0']));
                return false;
            }
        }

        var revenueVolFromError = 0;
        var revenueVolToError = 0;

        angular.forEach($scope.revenueBasedRebate, function (obj, index) {
            if (rec.qtyID != undefined && obj.qtyID != undefined) {
                if (parseFloat(rec.revenue_volume_from)  == obj.revenue_volume_from && rec.qtyID != obj.qtyID)
                    revenueVolFromError++;
            }
            else {
                if (parseFloat(rec.revenue_volume_from)  == obj.revenue_volume_from && index != recIndex)
                    revenueVolFromError++;
            }

            if (rec.revenue_volume_from.length > 0 || rec.rebate.length > 0) {
                $scope.rebateTypeChk++;
            }
        });


        if (revenueVolFromError > 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(555, ['Revenue From']));
            return false;
        }

        /* if (revenueVolToError > 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(555, ['Revenue To']));
            return false;
        } */

        if ($scope.rebateTypeChk > 0)
            $scope.rebateTypeDisable = true;

        rec.mode = 1;
        // console.log(editmode);

        if (editmode > 0) {

            if ($scope.revenueBasedRebate[$scope.revenueBasedRebate.length - 1].editchk > 0) {
                $scope.revenueBasedRebate.push({
                    'revenue_volume_from': '',
                    'rebate_types': '',
                    'rebate': '',
                    'id': '',
                    'mode': 0,
                    'editchk': 0
                });
            }
            rec.editchk = 0;
        }
        else {
            $scope.revenueBasedRebate.push({
                'revenue_volume_from': '',
                'rebate_types': '',
                'rebate': '',
                'id': '',
                'mode': 0,
                'editchk': 0
            });
        }
    }

    $scope.editRevenueRebate = function (rec, recIndex) {
        rec.editchk = 1;
        rec.mode = 0;
    }

    $scope.deleteRevenueRebate = function (index, revenueBasedRebate) {
        revenueBasedRebate.splice(index, 1);
        /* if (!(arr_data[arr_data.length - 1].id > 0))
            arr_data.splice(-1, 1); */
    }

    $scope.deleteVolumeRebate = function (index, volumeBasedRebate) {
        volumeBasedRebate.splice(index, 1);
    }

    //---------------- Haulier Database    ------------------------

    $scope.arealistingShow = true;
    $scope.arealistingShowForm = false;

    $scope.get_location_from = function () {

        var prodApi = $scope.$root.pr + "srm/srm/get-warehouses-and-company-addresses";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
        };

        return $http
            .post(prodApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.$root.location_from = res.data.response;
                    return 1;
                }
                else
                    return 0;
            });
    }

    $scope.getHaulierListing = function () {

        $scope.arealistingShow = true;
        $scope.arealistingShowForm = false;


        $scope.showLoader = true;
        var API = $scope.$root.pr + "srm/srm/get-haulier-listing";
        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'srmID': $scope.$root.srm_id
        };
        $http
            .post(API, $scope.postData)
            .then(function (res) {

                $scope.area_data = [];
                $scope.columns = [];
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.area_data = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
                $scope.showLoader = false;
            });
    }

    $scope.area_add_Form = function () {
        $scope.rec_area = {};
        $scope.arealistingShow = false;
        $scope.arealistingShowForm = true;
        $scope.haulierFormReadonly = false;

        $scope.areasLocTo = [];
        $scope.selectedRecFromModalsCoveredAreaTo = [];

        $scope.rec_area.currency_id = $scope.$root.get_obj_frm_arry($scope.$root.arr_currency, $scope.$root.defaultCurrency);

        $scope.rec_area.price_received_by_name = $rootScope.defaultUserName;
        $scope.rec_area.price_received_by = $rootScope.userId;

        $scope.haulierShippmentMethodsArray = [{ 'name': 'Dedicated', 'id': 1 },
        { 'name': 'Container', 'id': 2 },
        { 'name': 'Backload', 'id': 3 },
        { 'name': 'Pallet Distribution', 'id': 4 },
        { 'name': 'Groupage', 'id': 5 }
        ];

        $scope.locOptionsType = [{ 'name': 'Company Warehouse', 'id': 1 }, { 'name': 'Other Locations', 'id': 2 }];
        $scope.rec_area.locOption = $scope.locOptionsType[0];
        $scope.rec_area.locOptionTo = $scope.locOptionsType[1];
        $scope.rec_area.status = $scope.status_list[0];
        $scope.rec_area.priceDate = $scope.$root.get_current_date();

        angular.forEach($rootScope.uni_prooduct_arr, function (obj) {

            if (obj.title == 'Pallet' || obj.title == 'pallet')
                $scope.rec_area.unit_id = obj;
        });

        $scope.get_location_from();
        // $scope.get_offer_methods();
        // $scope.get_covered_country();
    }


    $scope.searchKeywordEmpArea = {};
    $scope.selectedRecFromModalsEmpArea = [];

    $scope.moduleType = '';

    $scope.selectAreaEmployees = function (item_paging, sort_column, sortform) {

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.moduleType = 'EmpAreaCovered';


        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.searchKeyword = $scope.searchKeywordEmpArea;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeywordEmp = {};
            $scope.record_data = {};
        }

        if ((sort_column != undefined) && (sort_column != null)) {
            //sort by column
            $scope.postData.sort_column = sort_column;
            $scope.postData.sortform = sortform;

            $rootScope.sortform = sortform;
            $rootScope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;
            $rootScope.sort_column = sort_column;

            $rootScope.save_single_value($rootScope.sort_column, 'srmsort_name');
        }

        $scope.showLoader = true;
        $scope.postData.cond = 'CoveredAreaEmp';
        $scope.empListingModalTitle = 'Employee';

        var empListingApi = $scope.$root.reports + "module/employee-list-without-admin";

        $http
            .post(empListingApi, $scope.postData)
            .then(function (res) {
                $scope.tableDataArea = res;
                $scope.columns = [];
                $scope.record_data = {};
                $scope.recordArray = [];
                $scope.tempEmployeesArr2 = [];

                if (res.data.ack == true) {
                    //console.log(res.data);
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.record_data = res.data.response;
                    $scope.tempEmployeesArr2 = res.data;

                    angular.forEach(res.data.response, function (value, key) {
                        if (key != "tbl_meta_data") {
                            $scope.recordArray.push(value);
                        }
                    });
                    $scope.showLoader = false;
                    angular.element('#_coveredAreaEmpModal').modal({ show: true });

                }
                else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }

            });
    }

    $scope.clearAreaEmp = function () {
        angular.element('#_coveredAreaEmpModal').modal('hide');
    }

    $scope.addAreaEmp = function (result) {

        // $scope.rec_area.offered_by_id = result.id;
        // $scope.rec_area.offered_by = result.user_code;

        $scope.rec_area.price_received_by_name = result.name;//user_code;
        $scope.rec_area.price_received_by = result.id;

        angular.element('#_coveredAreaEmpModal').modal('hide');
    }

    $scope.addNewLocation = function () {

        $scope.formNewLoc = {};
        // $scope.newLocListType = [{ 'name': 'Region', 'id': 1 }, { 'name': 'County', 'id': 2 }, { 'name': 'Area', 'id': 3}];
        angular.element('#modal_addNewLoc').modal({ show: true });
    }

    $scope.saveNewLoc = function (formNewLoc) {

        if (!formNewLoc.region || formNewLoc.region.length == 0) {
            toaster.pop('error', 'Info', "Region is required.");
            return;
        }

        if (!formNewLoc.county || formNewLoc.county.length == 0) {
            toaster.pop('error', 'Info', "County is required.");
            return;
        }

        if (!formNewLoc.area || formNewLoc.area.length == 0) {
            toaster.pop('error', 'Info', "Area is required.");
            return;
        }

        formNewLoc.token = $scope.$root.token;

        var addNewLocUrl = $scope.$root.pr + "srm/srm/add-new-loc";

        $http
            .post(addNewLocUrl, formNewLoc)
            .then(function (res) {

                if (res.data.ack == true) {
                    toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                    angular.element('#modal_addNewLoc').modal('hide');
                } else
                    toaster.pop('error', 'Info', res.data.error);
            });
    }

    $scope.changeLocOptionFrom = function (rec) {
        if (rec == 1)
            $scope.rec_area.haulierLoc_from_level1 = $scope.rec_area.haulierLoc_from_level2 = $scope.rec_area.haulierLoc_from_level3 = '';
        else if (rec == 2)
            $scope.rec_area.valid_from = '';
    }

    $scope.changeLocOptionTo = function (rec) {
        // console.log(rec);

        if (rec == 1) {
            $scope.areasLocTo = [];
            $scope.selectedRecFromModalsCoveredAreaTo = [];
            $scope.searchKeywordCoveredAreaTo = {};
        }
        else if (rec == 2)
            $scope.rec_area.validTo = '';
    }

    $scope.addHaulier = function (rec_area) {

        // rec_area.shipping_method = $scope.rec_area.shipping_methods !== undefined ? $scope.rec_area.shipping_methods.id : 0;
        $scope.haulierFormReadonly = true;

        if (rec_area.price_received_by_name.length == 0) {
            toaster.pop('error', 'Info', "Price Received By");
            $scope.haulierFormReadonly = false;
            return;
        }

        if (rec_area.locOption.id == 1 && (!rec_area.valid_from || !(rec_area.valid_from.id > 0))) {
            toaster.pop('error', 'Info', "Location From is required.");
            $scope.haulierFormReadonly = false;
            return;
        }

        if (rec_area.locOption.id == 2 && (!$scope.rec_area.haulierLoc_from_level3 || $scope.rec_area.haulierLoc_from_level3.length == 0)) {//$scope.areasLocFrom.length == 0
            toaster.pop('error', 'Info', "Location From is required.");
            $scope.haulierFormReadonly = false;
            return;
        }

        if (rec_area.locOptionTo.id == 1 && (!rec_area.validTo || !(rec_area.validTo.id > 0))) {
            toaster.pop('error', 'Info', "Location To is required.");
            $scope.haulierFormReadonly = false;
            return;
        }

        if (rec_area.locOptionTo.id == 2 && (!$scope.areasLocTo || $scope.areasLocTo.length == 0)) {
            toaster.pop('error', 'Info', "Location To is required.");
            $scope.haulierFormReadonly = false;
            return;
        }

        /*  if (!rec_area.shipQtyMin || !rec_area.shipQtyMax) {
             toaster.pop('error', 'Info', "Shipping Quantity is required.");
             $scope.haulierFormReadonly = false;
             return;
         }
 
         if (parseFloat(rec_area.shipQtyMin) > parseFloat(rec_area.shipQtyMax)) {
             toaster.pop('error', 'Info', "Invalid Shipping Quantities.");
             $scope.haulierFormReadonly = false;
             return;
         }
 
         if (!rec_area.priceDate) {
             toaster.pop('error', 'Info', "Price Date is required.");
             $scope.haulierFormReadonly = false;
             return;
         }
 
         if (!rec_area.price) {
             toaster.pop('error', 'Info', "Price is required.");
             $scope.haulierFormReadonly = false;
             return;
         }
 
         if (!rec_area.currency_id || !(rec_area.currency_id.id > 0)) {
             toaster.pop('error', 'Info', "Currency is required.");
             $scope.haulierFormReadonly = false;
             return;
         }
 
         if (!rec_area.unit_id || !(rec_area.unit_id.id > 0)) {
             toaster.pop('error', 'Info', "U.O.M is required.");
             $scope.haulierFormReadonly = false;
             return;
         }        
 
         if (!rec_area.currency_history_id || !(rec_area.currency_history_id > 0)) {
             toaster.pop('error', 'Info', "Currency Conversion Rate is required.");
             $scope.haulierFormReadonly = false;
             return;
         }
         
 
         if (!rec_area.haulierShippingMethod_Name || rec_area.haulierShippingMethod_Name.length == 0) {
             toaster.pop('error', 'Info', "Shipping Method is required.");
             $scope.haulierFormReadonly = false;
             return;
         } */

        if (!rec_area.status || (rec_area.status.id != 0 && rec_area.status.id != 1)) {
            toaster.pop('error', 'Info', "Status is required.");
            $scope.haulierFormReadonly = false;
            return;
        }

        rec_area.srm_id = $scope.$root.srm_id;
        rec_area.token = $scope.$root.token;

        // rec_area.areasLocFrom = $scope.areasLocFrom;
        rec_area.areasLocTo = $scope.areasLocTo;

        // rec_area.unit_measure_id = rec_area.uom !== undefined ? $scope.rec_area.uom.id : 0;
        rec_area.currency = (rec_area.currency_id && rec_area.currency_id.id) ? rec_area.currency_id.id : 0;
        rec_area.currency_history = (rec_area.currency_history_id && rec_area.currency_history_id.id) ? rec_area.currency_history_id.id : 0;
        rec_area.shipQtyMin = (rec_area.shipQtyMin) ? rec_area.shipQtyMin : 0;
        rec_area.shipQtyMax = (rec_area.shipQtyMax) ? rec_area.shipQtyMax : 0;

        rec_area.haulierLocType_fromID = (rec_area.locOption && rec_area.locOption.id) ? rec_area.locOption.id : 0;
        rec_area.haulierLocType_from_name = (rec_area.locOption && rec_area.locOption.id) ? rec_area.locOption.name : 0;
        rec_area.haulierLocType_toID = (rec_area.locOptionTo && rec_area.locOptionTo.id) ? rec_area.locOptionTo.id : 0;
        rec_area.haulierLocType_to_name = (rec_area.locOptionTo && rec_area.locOptionTo.id) ? rec_area.locOptionTo.name : 0;
        rec_area.statusID = (rec_area.status && rec_area.status.id) ? rec_area.status.id : 0;
        rec_area.haulierShippingMethod = (rec_area.haulierShippingMethod_Name && rec_area.haulierShippingMethod_Name.id) ? rec_area.haulierShippingMethod_Name.name : '';

        rec_area.warehouseLocfromID = (rec_area.valid_from && rec_area.valid_from.id) ? rec_area.valid_from.id : 0;
        rec_area.warehouseLocToID = (rec_area.validTo && rec_area.validTo.id) ? rec_area.validTo.id : 0;

        rec_area.warehouseLocFromType = (rec_area.valid_from && rec_area.valid_from.type) ? rec_area.valid_from.type : 0;
        rec_area.warehouseLocToType = (rec_area.validTo && rec_area.validTo.type) ? rec_area.validTo.type : 0;

        rec_area.uomId = (rec_area.unit_id && rec_area.unit_id.id) ? rec_area.unit_id.id : 0;

        var addNewHaulierUrl = $scope.$root.pr + "srm/srm/add-new-haulier";

        $http
            .post(addNewHaulierUrl, rec_area)
            .then(function (res) {

                if (res.data.ack == true) {

                    if (rec_area.id > 0)
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    else
                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                    $scope.haulierFormReadonly = false;

                    $timeout(function () {
                        $scope.getHaulierListing();
                    }, 1000);

                } else {
                    if (rec_area.id == 0)
                        toaster.pop('error', 'Edit', res.data.error);
                    else
                        toaster.pop('error', 'Info', res.data.error);

                    $scope.haulierFormReadonly = false;
                }
            });

    }

    $scope.edit_area = function (id) {

        $scope.get_location_from();
        // $scope.get_offer_methods();
        // $scope.get_covered_country();


        $scope.haulierFormReadonly = true;
        $scope.showLoader = true;

        $scope.arealistingShow = false;
        $scope.arealistingShowForm = true;

        $scope.areasLocTo = [];
        $scope.selectedRecFromModalsCoveredAreaTo = [];

        var altcontUrl = $scope.$root.pr + "srm/srm/get-haulier-listing-by-id";

        var postViewData = {
            'token': $scope.$root.token,
            'id': id
        };
        $http
            .post(altcontUrl, postViewData)
            .then(function (res) {

                // $scope.haulierFormReadonly = false;

                if (res.data.ack == true) {

                    $scope.rec_area = {};
                    $scope.rec_area = res.data.response;
                    $scope.rec_area.id = res.data.response.id;
                    $scope.rec_area.update_id = res.data.response.id;

                    $scope.rec_area.currency_id = $scope.$root.get_obj_frm_arry($scope.$root.arr_currency, res.data.response.currency_id);
                    $scope.rec_area.uom = $scope.$root.get_obj_frm_arry($scope.$root.uni_prooduct_arr, res.data.response.unit_measure_id);
                    $scope.rec_area.offer_methods = $scope.$root.get_obj_frm_arry($scope.arr_offer_method, res.data.response.offer_method);
                    $scope.rec_area.valid_from = $scope.$root.get_obj_frm_arry($scope.$root.location_from, res.data.response.valid_from_id);

                    $scope.rec_area.price_received_by_name = res.data.response.received_by;
                    $scope.rec_area.price_received_by = res.data.response.PriceAddedByEmployeeID;

                    $scope.haulierShippmentMethodsArray = [{ 'name': 'Dedicated', 'id': 1 },
                    { 'name': 'Container', 'id': 2 },
                    { 'name': 'Backload', 'id': 3 },
                    { 'name': 'Pallet Distribution', 'id': 4 },
                    { 'name': 'Groupage', 'id': 5 }
                    ];

                    $scope.locOptionsType = [{ 'name': 'Company Warehouse', 'id': 1 }, { 'name': 'Other Locations', 'id': 2 }];
                    $scope.rec_area.locOption = $scope.locOptionsType[0];
                    $scope.rec_area.locOptionTo = $scope.locOptionsType[0];

                    angular.forEach($scope.locOptionsType, function (obj) {
                        if (obj.name == res.data.response.haulierLocType_from_name)
                            $scope.rec_area.locOption = obj;

                        if (obj.name == res.data.response.haulierLocType_to_name)
                            $scope.rec_area.locOptionTo = obj;
                    });

                    angular.forEach($rootScope.uni_prooduct_arr, function (obj) {

                        if (obj.title == 'Pallet' || obj.title == 'pallet')
                            $scope.rec_area.unit_id = obj;

                        if (obj.id == res.data.response.units_of_measure_id)
                            $scope.rec_area.unit_id = obj;

                    });

                    angular.forEach($scope.status_list, function (obj) {
                        if (obj.id == res.data.response.STATUS)
                            $scope.rec_area.status = obj;
                    });

                    angular.forEach($scope.haulierShippmentMethodsArray, function (obj) {
                        if (obj.name == res.data.response.haulierShippingMethod_Name)
                            $scope.rec_area.haulierShippingMethod_Name = obj;
                    });

                    // $scope.rec_area.haulierShippingMethod_Name = $scope.$root.get_obj_frm_arry($scope.haulierShippmentMethodsArray, res.data.response.shipping_method);

                    if (res.data.response.haulierLocType_to_name == 'Other Locations') {

                        angular.forEach(res.data.areasLocTo, function (recData) {

                            var selRecord = {};
                            selRecord.key = recData.id;
                            selRecord.record = recData;
                            selRecord.value = recData.level3;

                            $scope.selectedRecFromModalsCoveredAreaTo.push(selRecord);

                            recData.title = recData.level3;
                            recData.areaID = recData.id;
                            $scope.areasLocTo.push(recData);
                        });
                    }

                    $scope.get_location_from()
                        .then(function (result) {
                            // console.log(result);
                            if (res.data.response.haulierLocType_from_name == 'Company Warehouse') {
                                angular.forEach($scope.location_from, function (obj) {
                                    if (obj.id == res.data.response.haulierLoc_from_warehouse_id)
                                        $scope.rec_area.valid_from = obj;
                                });
                            }

                            if (res.data.response.haulierLocType_to_name == 'Company Warehouse') {
                                angular.forEach($scope.location_from, function (obj) {
                                    if (obj.id == res.data.response.haulierLoc_to_warehouse_id)
                                        $scope.rec_area.validTo = obj;
                                });
                            }

                            $scope.showLoader = false;
                        }).catch(function (message) {
                            $scope.showLoader = false;
                            throw new Error(message.data);
                            console.log(message.data);
                        });



                    // $scope.rec_area.valid_from_id = res.data.response.valid_from_id;
                    // $scope.rec_area.valid_to_id = res.data.response.valid_to_id;
                    // $scope.rec_area.valid_to = res.data.response.valid_to;
                }
                else
                    $scope.showLoader = false;
            });
    }

    $scope.gotoeditHaulierForm = function () {
        $scope.haulierFormReadonly = false;
    }

    $scope.deleteHaulier = function (id) {

        var delUrl = $scope.$root.pr + "srm/srm/delete-haulier";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    'id': id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                        $timeout(function () {
                            $scope.getHaulierListing();
                        }, 1000);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };



    $scope.searchKeywordCoveredAreaFrom = {};
    $scope.searchKeywordCoveredAreaTo = {};
    $scope.selectedRecFromModalsCoveredAreaFrom = [];
    $scope.selectedRecFromModalsCoveredAreaTo = [];
    // $scope.areasLocFrom = [];
    $scope.areasLocTo = [];

    $scope.getHaulierLoc = function (haulierLocType, item_paging, sort_column, sortform) {

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.moduleType = 'coveredArea';

        $scope.haulierLocType = haulierLocType;
        $scope.postData.haulierLocType = haulierLocType;

        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        if ($scope.haulierLocType == 1)
            $scope.postData.searchKeyword = $scope.searchKeywordCoveredAreaFrom;
        else if ($scope.haulierLocType == 2)
            $scope.postData.searchKeyword = $scope.searchKeywordCoveredAreaTo;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeywordBg = {};
            $scope.record_data = {};
        }

        if ((sort_column != undefined) && (sort_column != null)) {
            //sort by column
            $scope.postData.sort_column = sort_column;
            $scope.postData.sortform = sortform;

            $rootScope.sortform = sortform;
            $rootScope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;
            $rootScope.sort_column = sort_column;

            $rootScope.save_single_value($rootScope.sort_column, 'srmsort_name');
        }

        var salepersonsListingApi = $scope.$root.pr + "srm/srm/get-haulier-loc";

        $scope.showLoader = true;
        $http
            .post(salepersonsListingApi, $scope.postData)
            .then(function (res) {
                $scope.tableData_areas = res;
                $scope.columns = [];
                $scope.record_data = {};
                $scope.recordArray = [];
                $scope.tempSuppliersArr2 = [];

                if (res.data.ack == true) {
                    //console.log(res.data);
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.record_data = res.data.response;
                    $scope.tempSuppliersArr2 = res.data;

                    angular.forEach(res.data.response, function (value, key) {
                        if (key != "tbl_meta_data") {
                            $scope.recordArray.push(value);
                        }
                    });

                    angular.element('#_areaModal').modal({ show: true });

                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
                $scope.showLoader = false;
            });
    }

    $scope.clearFilterHaulierLoc = function () {
        $scope.searchKeywordCoveredAreaFrom = {};
        $scope.searchKeywordCoveredAreaTo = {};

        $scope.getHaulierLoc($scope.haulierLocType);
    }

    $scope.addAreasFrom = function (rec) {

        // console.log(rec);
        $scope.rec_area.haulierLoc_from_level1 = rec.level1;
        $scope.rec_area.haulierLoc_from_level2 = rec.level2;
        $scope.rec_area.haulierLoc_from_level3 = rec.level3;
        angular.element('#_areaModal').modal('hide');
    }

    $scope.addAreas = function () {

        var selAreaList = [];



        if ($scope.haulierLocType == 1) {

            /* angular.forEach($scope.selectedRecFromModalsCoveredAreaFrom, function (obj) {
                selAreaList.push(obj.record);
            });

            $scope.areasLocFrom = [];

            angular.forEach(selAreaList, function (recData) {
                recData.title = recData.level3;
                recData.areaID = recData.id;
                $scope.areasLocFrom.push(recData);
            }); */

        }
        else if ($scope.haulierLocType == 2) {

            angular.forEach($scope.selectedRecFromModalsCoveredAreaTo, function (obj) {
                selAreaList.push(obj.record);
            });

            if (selAreaList && selAreaList.length > 5) {
                toaster.pop('error', 'Info', 'Max number of Location selection limit is upto 5!');
                return false;
            }

            $scope.areasLocTo = [];

            angular.forEach(selAreaList, function (recData) {

                if (recData.level1 == 'ALL')
                    recData.title = 'ALL';
                else if (recData.level2 == 'ALL')
                    recData.title = recData.level1;
                else if (recData.level3 == 'ALL')
                    recData.title = recData.level2;
                else
                    recData.title = recData.level3;

                recData.areaID = recData.id;
                $scope.areasLocTo.push(recData);
            });
        }


        angular.element('#_areaModal').modal('hide');
    }

    $scope.clearAreas = function () {

        // $scope.PendingSelectedTerritorys = [];
        angular.element('#_areaModal').modal('hide');
    }


    $scope.validConvrate = function (price, currency_id, date) {
        var converted_price = 0;

        if (!currency_id || !price || !date)
            return true;

        if (currency_id == $scope.$root.defaultCurrency) {
            $scope.rec_area.price_lcy = parseFloat(price);
            $scope.rec_area.currency_history_id = currency_id;
            $scope.rec_area.currency_history_conversion_rate = 1;
            return;
        } else {

            var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
            $http
                .post(currencyURL, {
                    'id': currency_id,
                    'token': $scope.$root.token,
                    'or_date': date
                })
                .then(function (res) {
                    if (res.data.ack == true) {

                        if (res.data.response.conversion_rate == null) {
                            $scope.rec_area.price_lcy = null;
                            $scope.rec_area.currency_history_id = 0;
                            $scope.rec_area.currency_history_conversion_rate = 0;

                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Currency Conversion Rate']));
                            return;
                        } else {

                            var newPrice = parseFloat(price) / parseFloat(res.data.response.conversion_rate);
                            $scope.rec_area.price_lcy = parseFloat(newPrice).toFixed(2);
                            $scope.rec_area.currency_history_conversion_rate = res.data.response.conversion_rate;
                            $scope.rec_area.currency_history_id = res.data.response.conversion_rate;

                        }
                    } else {
                        $scope.rec_area.price_lcy = null;
                        $scope.rec_area.currency_history_id = 0;
                        $scope.rec_area.currency_history_conversion_rate = 0;
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Conversion Rate in Setup']));
                        return;
                    }

                });
        }
    }


    //---------------- Search Haulier Database    ------------------------   
    if ($scope.module == 'search') {

        // moduleTracker.updateName("srm");
        // moduleTracker.updateRecord("");

        $scope.$root.breadcrumbs = [ //{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
            {
                'name': 'Purchases',
                'url': '#',
                'isActive': false
            },
            {
                'name': 'Haulier Database',
                'url': '#',
                'isActive': false
            }
        ];
        $scope.filterHaulierDatabase = {};

        $scope.filterHaulierDatabase.haulierShippmentMethodsArray = [{ 'name': 'Dedicated', 'id': 1 },
        { 'name': 'Container', 'id': 2 },
        { 'name': 'Backload', 'id': 3 },
        { 'name': 'Pallet Distribution', 'id': 4 },
        { 'name': 'Groupage', 'id': 5 }
        ];

        $scope.filterHaulierDatabase.locOptionsType = [{ 'name': 'Company Warehouse', 'id': 1 }, { 'name': 'Other Locations', 'id': 2 }];
        $scope.filterHaulierDatabase.locOption = $scope.filterHaulierDatabase.locOptionsType[0];
        $scope.filterHaulierDatabase.locOptionTo = $scope.filterHaulierDatabase.locOptionsType[1];

        /* angular.forEach($rootScope.uni_prooduct_arr, function (obj) {

            if (obj.title == 'Pallet' || obj.title == 'pallet')
                $scope.filterHaulierDatabase.unit_id = obj;
        }); */

        // $scope.get_location_from();
        $scope.get_location_from()
            .then(function (result) {
                $scope.filterHaulierDatabase.location_from = $rootScope.location_from;

                // $scope.showLoader = false;
            }).catch(function (message) {
                $scope.showLoader = false;
                throw new Error(message.data);
                console.log(message.data);
            });



        $scope.getHaulierDatabaseListing = function (filterHaulierDatabase) {

            $scope.showLoader = true;
            var postFilterHaulierDatabase = {};

            if (filterHaulierDatabase.locOption.id == 1 && (!filterHaulierDatabase.locFrom || !(filterHaulierDatabase.locFrom.id > 0))) {
                toaster.pop('error', 'Info', "Location From is required.");
                $scope.showLoader = false;
                return;
            }

            if (filterHaulierDatabase.locOption.id == 2 && (!$scope.filterHaulierDatabase.haulierLoc_from_level3 || $scope.filterHaulierDatabase.haulierLoc_from_level3.length == 0)) {
                toaster.pop('error', 'Info', "Location From is required.");
                $scope.showLoader = false;
                return;
            }

            if (filterHaulierDatabase.locOptionTo.id == 1 && (!filterHaulierDatabase.locTo || !(filterHaulierDatabase.locTo.id > 0))) {
                toaster.pop('error', 'Info', "Location To is required.");
                $scope.showLoader = false;
                return;
            }

            //(!$scope.filterHaulierDatabase.haulierLoc_to_level3 || $scope.filterHaulierDatabase.haulierLoc_to_level3.length == 0)

            if (filterHaulierDatabase.locOptionTo.id == 2 && (!$scope.areasHaulierLocTo || $scope.areasHaulierLocTo.length == 0)) {
                toaster.pop('error', 'Info', "Location To is required.");
                $scope.showLoader = false;
                return;
            }

            postFilterHaulierDatabase.haulierLocType_fromID = (filterHaulierDatabase.locOption && filterHaulierDatabase.locOption.id) ? filterHaulierDatabase.locOption.id : 0;
            postFilterHaulierDatabase.haulierLoc_fromID = (filterHaulierDatabase.locFrom && filterHaulierDatabase.locFrom.id) ? filterHaulierDatabase.locFrom.id : 0;
            postFilterHaulierDatabase.haulierLoc_fromType = (filterHaulierDatabase.locFrom && filterHaulierDatabase.locFrom.type) ? filterHaulierDatabase.locFrom.type : 0;


            postFilterHaulierDatabase.haulierLocType_toID = (filterHaulierDatabase.locOptionTo && filterHaulierDatabase.locOptionTo.id) ? filterHaulierDatabase.locOptionTo.id : 0;
            postFilterHaulierDatabase.haulierLoc_toID = (filterHaulierDatabase.locTo && filterHaulierDatabase.locTo.id) ? filterHaulierDatabase.locTo.id : 0;
            postFilterHaulierDatabase.haulierLoc_toType = (filterHaulierDatabase.locTo && filterHaulierDatabase.locTo.type) ? filterHaulierDatabase.locTo.type : 0;

            postFilterHaulierDatabase.haulierShippingMethod = (filterHaulierDatabase.haulierShippingMethod_Name && filterHaulierDatabase.haulierShippingMethod_Name.id) ? filterHaulierDatabase.haulierShippingMethod_Name.name : 0;

            postFilterHaulierDatabase.haulierShippingMethodID = (filterHaulierDatabase.haulierShippingMethod_Name && filterHaulierDatabase.haulierShippingMethod_Name.id) ? filterHaulierDatabase.haulierShippingMethod_Name.id : 0;

            postFilterHaulierDatabase.qty = filterHaulierDatabase.qty;

            postFilterHaulierDatabase.haulierLoc_from_level1 = filterHaulierDatabase.haulierLoc_from_level1;
            postFilterHaulierDatabase.haulierLoc_from_level2 = filterHaulierDatabase.haulierLoc_from_level2;
            postFilterHaulierDatabase.haulierLoc_from_level3 = filterHaulierDatabase.haulierLoc_from_level3;
            postFilterHaulierDatabase.haulierLoc_to_level1 = filterHaulierDatabase.haulierLoc_to_level1;
            postFilterHaulierDatabase.haulierLoc_to_level2 = filterHaulierDatabase.haulierLoc_to_level2;
            postFilterHaulierDatabase.haulierLoc_to_level3 = filterHaulierDatabase.haulierLoc_to_level3;

            postFilterHaulierDatabase.areasHaulierLocTo = $scope.areasHaulierLocTo;

            var API = $scope.$root.pr + "srm/srm/get-haulier-database-listing";
            $scope.postData = {};

            $scope.postData.token = $scope.$root.token;
            $scope.postData.filter = postFilterHaulierDatabase;

            $http
                .post(API, $scope.postData)
                .then(function (res) {

                    $scope.haulierDatabaseRecords = [];
                    $scope.columns = [];
                    if (res.data.ack == true) {

                        $scope.total = res.data.total;
                        $scope.item_paging.total_pages = res.data.total_pages;
                        $scope.item_paging.cpage = res.data.cpage;
                        $scope.item_paging.ppage = res.data.ppage;
                        $scope.item_paging.npage = res.data.npage;
                        $scope.item_paging.pages = res.data.pages;

                        $scope.haulierDatabaseRecords = res.data.response;

                        angular.forEach(res.data.response[0], function (val, index) {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
                    }
                    else {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                    }

                    $scope.showLoader = false;
                });
        }

        // $scope.getHaulierDatabaseListing();

        $scope.clearHaulierDatabaseListingFilter = function () {
            $scope.filterHaulierDatabase.haulierShippingMethod_Name = '';
            $scope.filterHaulierDatabase.qty = '';
            $scope.filterHaulierDatabase.haulierLoc_from_level1 = $scope.filterHaulierDatabase.haulierLoc_from_level2 = $scope.filterHaulierDatabase.haulierLoc_from_level3 = '';
            $scope.filterHaulierDatabase.locFrom = '';

            $scope.filterHaulierDatabase.haulierLoc_to_level1 = $scope.filterHaulierDatabase.haulierLoc_to_level2 = $scope.filterHaulierDatabase.haulierLoc_to_level3 = '';
            $scope.filterHaulierDatabase.locTo = '';

            $scope.areasHaulierLocTo = [];
            $scope.haulierDatabaseRecords = [];

            $scope.filterHaulierDatabase.locOption = $scope.filterHaulierDatabase.locOptionsType[0];
            $scope.filterHaulierDatabase.locOptionTo = $scope.filterHaulierDatabase.locOptionsType[1];

            // $scope.searchKeywordCoveredAreaFrom = {};
            // $scope.searchKeywordCoveredAreaTo = {};
            $scope.selectedRecFromModalsCoveredAreaFrom = [];
            $scope.selectedRecFromModalsCoveredAreaTo = [];
        }

        $scope.searchKeywordCoveredAreaFrom = {};
        $scope.searchKeywordCoveredAreaTo = {};
        $scope.selectedRecFromModalsCoveredAreaFrom = [];
        $scope.selectedRecFromModalsCoveredAreaTo = [];

        $scope.getHaulierLocSearch = function (haulierLocType, item_paging, sort_column, sortform) {

            $scope.postData = {};
            $scope.postData.token = $scope.$root.token;
            $scope.moduleType = 'coveredArea';

            $scope.haulierLocType = haulierLocType;
            $scope.postData.haulierLocType = haulierLocType;

            if (item_paging == 1)
                $scope.item_paging.spage = 1

            $scope.postData.page = $scope.item_paging.spage;

            if ($scope.haulierLocType == 1)
                $scope.postData.searchKeyword = $scope.searchKeywordCoveredAreaFrom;
            else if ($scope.haulierLocType == 2)
                $scope.postData.searchKeyword = $scope.searchKeywordCoveredAreaTo;

            if ($scope.postData.pagination_limits == -1) {
                $scope.postData.page = -1;
                $scope.searchKeywordBg = {};
                $scope.record_data = {};
            }

            if ((sort_column != undefined) && (sort_column != null)) {
                //sort by column
                $scope.postData.sort_column = sort_column;
                $scope.postData.sortform = sortform;

                $rootScope.sortform = sortform;
                $rootScope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;
                $rootScope.sort_column = sort_column;

                $rootScope.save_single_value($rootScope.sort_column, 'srmsort_name');
            }

            var salepersonsListingApi = $scope.$root.pr + "srm/srm/get-haulier-loc";

            $scope.showLoader = true;
            $http
                .post(salepersonsListingApi, $scope.postData)
                .then(function (res) {
                    $scope.tableData_areas = res;
                    $scope.columns = [];
                    $scope.record_data = {};
                    $scope.recordArray = [];
                    $scope.tempSuppliersArr2 = [];

                    if (res.data.ack == true) {
                        //console.log(res.data);
                        $scope.total = res.data.total;
                        $scope.item_paging.total_pages = res.data.total_pages;
                        $scope.item_paging.cpage = res.data.cpage;
                        $scope.item_paging.ppage = res.data.ppage;
                        $scope.item_paging.npage = res.data.npage;
                        $scope.item_paging.pages = res.data.pages;

                        $scope.total_paging_record = res.data.total_paging_record;

                        $scope.record_data = res.data.response;
                        $scope.tempSuppliersArr2 = res.data;

                        angular.forEach(res.data.response, function (value, key) {
                            if (key != "tbl_meta_data") {
                                $scope.recordArray.push(value);
                            }
                        });

                        angular.element('#_haulierLocSearchModal').modal({ show: true });

                    }
                    else {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                    }
                    $scope.showLoader = false;
                });
        }

        $scope.clearFilterHaulierLocSearch = function () {
            $scope.searchKeywordCoveredAreaFrom = {};
            $scope.searchKeywordCoveredAreaTo = {};
            $scope.getHaulierLocSearch($scope.haulierLocType);
        }

        $scope.addHaulierLocFrom = function (rec) {

            // console.log(rec);
            $scope.filterHaulierDatabase.haulierLoc_from_level1 = rec.level1;
            $scope.filterHaulierDatabase.haulierLoc_from_level2 = rec.level2;
            $scope.filterHaulierDatabase.haulierLoc_from_level3 = rec.level3;
            angular.element('#_haulierLocSearchModal').modal('hide');
        }

        /* $scope.addHaulierLocTo = function (rec) {

            // console.log(rec);
            $scope.filterHaulierDatabase.haulierLoc_to_level1 = rec.level1;
            $scope.filterHaulierDatabase.haulierLoc_to_level2 = rec.level2;
            $scope.filterHaulierDatabase.haulierLoc_to_level3 = rec.level3;
            angular.element('#_haulierLocSearchModal').modal('hide');
        } */

        $scope.addHaulierLocTo = function () {

            var selAreaList = [];

            if ($scope.haulierLocType == 2) {

                angular.forEach($scope.selectedRecFromModalsCoveredAreaTo, function (obj) {
                    selAreaList.push(obj.record);
                });

                if (selAreaList && selAreaList.length > 5) {
                    toaster.pop('error', 'Info', 'Max number of Location selection limit is upto 5!');
                    return false;
                }

                $scope.areasHaulierLocTo = [];

                angular.forEach(selAreaList, function (recData) {

                    if (recData.level1 == 'ALL')
                        recData.title = 'ALL';
                    else if (recData.level2 == 'ALL')
                        recData.title = recData.level1;
                    else if (recData.level3 == 'ALL')
                        recData.title = recData.level2;
                    else
                        recData.title = recData.level3;

                    recData.areaID = recData.id;
                    $scope.areasHaulierLocTo.push(recData);
                });
            }

            angular.element('#_haulierLocSearchModal').modal('hide');
        }

        $scope.cancelHaulierLoc = function () {
            angular.element('#_haulierLocSearchModal').modal('hide');
        }

        $scope.changeHaulierDatabaseLocOptionFrom = function (rec) {
            if (rec == 1)
                $scope.filterHaulierDatabase.haulierLoc_from_level1 = $scope.filterHaulierDatabase.haulierLoc_from_level2 = $scope.filterHaulierDatabase.haulierLoc_from_level3 = '';
            else if (rec == 2)
                $scope.filterHaulierDatabase.locFrom = '';
        }

        $scope.changeHaulierDatabaseLocOptionTo = function (rec) {
            // console.log(rec);

            if (rec == 1) {
                // $scope.areasLocTo = [];
                // $scope.selectedRecFromModalsCoveredAreaTo = [];

                $scope.filterHaulierDatabase.haulierLoc_to_level1 = $scope.filterHaulierDatabase.haulierLoc_to_level2 = $scope.filterHaulierDatabase.haulierLoc_to_level3 = '';
            }
            else if (rec == 2)
                $scope.filterHaulierDatabase.locTo = '';
        }

        $scope.showPdfModal = function (_reportType = "pdf", filterHaulierDatabase) {

            $scope.printPdfVals = {};

            // $scope.filterReport.token = $rootScope.token;
            $rootScope.printinvoiceFlag = false;

            $scope.showLoader = true;
            var postFilterHaulierDatabase = {};

            if (filterHaulierDatabase.locOption.id == 1 && (!filterHaulierDatabase.locFrom || !(filterHaulierDatabase.locFrom.id > 0))) {
                toaster.pop('error', 'Info', "Location From is required.");
                $scope.showLoader = false;
                return;
            }

            if (filterHaulierDatabase.locOption.id == 2 && (!$scope.filterHaulierDatabase.haulierLoc_from_level3 || $scope.filterHaulierDatabase.haulierLoc_from_level3.length == 0)) {
                toaster.pop('error', 'Info', "Location From is required.");
                $scope.showLoader = false;
                return;
            }

            if (filterHaulierDatabase.locOptionTo.id == 1 && (!filterHaulierDatabase.locTo || !(filterHaulierDatabase.locTo.id > 0))) {
                toaster.pop('error', 'Info', "Location To is required.");
                $scope.showLoader = false;
                return;
            }

            //(!$scope.filterHaulierDatabase.haulierLoc_to_level3 || $scope.filterHaulierDatabase.haulierLoc_to_level3.length == 0)

            if (filterHaulierDatabase.locOptionTo.id == 2 && (!$scope.areasHaulierLocTo || $scope.areasHaulierLocTo.length == 0)) {
                toaster.pop('error', 'Info', "Location To is required.");
                $scope.showLoader = false;
                return;
            }

            postFilterHaulierDatabase.haulierLocType_fromID = (filterHaulierDatabase.locOption && filterHaulierDatabase.locOption.id) ? filterHaulierDatabase.locOption.id : 0;
            postFilterHaulierDatabase.haulierLoc_fromID = (filterHaulierDatabase.locFrom && filterHaulierDatabase.locFrom.id) ? filterHaulierDatabase.locFrom.id : 0;
            postFilterHaulierDatabase.haulierLoc_fromType = (filterHaulierDatabase.locFrom && filterHaulierDatabase.locFrom.type) ? filterHaulierDatabase.locFrom.type : 0;


            postFilterHaulierDatabase.haulierLocType_toID = (filterHaulierDatabase.locOptionTo && filterHaulierDatabase.locOptionTo.id) ? filterHaulierDatabase.locOptionTo.id : 0;
            postFilterHaulierDatabase.haulierLoc_toID = (filterHaulierDatabase.locTo && filterHaulierDatabase.locTo.id) ? filterHaulierDatabase.locTo.id : 0;
            postFilterHaulierDatabase.haulierLoc_toType = (filterHaulierDatabase.locTo && filterHaulierDatabase.locTo.type) ? filterHaulierDatabase.locTo.type : 0;

            postFilterHaulierDatabase.haulierShippingMethod = (filterHaulierDatabase.haulierShippingMethod_Name && filterHaulierDatabase.haulierShippingMethod_Name.id) ? filterHaulierDatabase.haulierShippingMethod_Name.name : 0;

            postFilterHaulierDatabase.haulierShippingMethodID = (filterHaulierDatabase.haulierShippingMethod_Name && filterHaulierDatabase.haulierShippingMethod_Name.id) ? filterHaulierDatabase.haulierShippingMethod_Name.id : 0;

            postFilterHaulierDatabase.qty = filterHaulierDatabase.qty;

            postFilterHaulierDatabase.haulierLoc_from_level1 = filterHaulierDatabase.haulierLoc_from_level1;
            postFilterHaulierDatabase.haulierLoc_from_level2 = filterHaulierDatabase.haulierLoc_from_level2;
            postFilterHaulierDatabase.haulierLoc_from_level3 = filterHaulierDatabase.haulierLoc_from_level3;
            postFilterHaulierDatabase.haulierLoc_to_level1 = filterHaulierDatabase.haulierLoc_to_level1;
            postFilterHaulierDatabase.haulierLoc_to_level2 = filterHaulierDatabase.haulierLoc_to_level2;
            postFilterHaulierDatabase.haulierLoc_to_level3 = filterHaulierDatabase.haulierLoc_to_level3;

            postFilterHaulierDatabase.areasHaulierLocTo = $scope.areasHaulierLocTo;

            var API = $scope.$root.pr + "srm/srm/get-haulier-database-listing";
            $scope.postData = {};

            $scope.postData.token = $scope.$root.token;
            $scope.postData.filter = postFilterHaulierDatabase;

            $http
                .post(API, $scope.postData)
                .then(function (res) {

                    $scope.haulierDatabaseRecords = [];
                    $scope.columns = [];
                    if (res.data.ack == true) {

                        $scope.total = res.data.total;
                        $scope.item_paging.total_pages = res.data.total_pages;
                        $scope.item_paging.cpage = res.data.cpage;
                        $scope.item_paging.ppage = res.data.ppage;
                        $scope.item_paging.npage = res.data.npage;
                        $scope.item_paging.pages = res.data.pages;

                        $scope.haulierDatabaseRecords = res.data.response;

                        $scope.printPdfVals.reportsDataArr = res.data.response;
                        $scope.printPdfVals.columns = [];

                        $scope.printPdfVals.reportName = 'haulierDatabase';//haulier

                        angular.forEach(res.data.response[0], function (val, index) {
                            $scope.printPdfVals.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });

                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });

                        $scope.printPdfVals.currentDate = $scope.$root.get_current_date();
                        // $scope.printPdfVals.dateFrom = $scope.filterReport.dateFrom;
                        // $scope.printPdfVals.dateTo = $scope.filterReport.dateTo;
                        $scope.printPdfVals.company_name = $rootScope.company_name;
                        $scope.printPdfVals.company_logo_url = $scope.company_logo_url;

                        let currentUrl = window.location.href;
                        $scope.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;
                        $scope.printPdfVals._reportType = _reportType;

                        if (_reportType == 'xlsx') {
                            $scope.showLoader = true;
                            jsreportService.downloadXlsx($scope.printPdfVals, "B1gdgmO0IS").success(function (data) {
                                $scope.showLoader = false;
                                let file = new Blob([data], { type: 'application/xlsx' });
                                saveAs(file, $scope.printPdfVals.reportName + ".xlsx");
                            })
                        } else if (($scope.module == 'detail' || $scope.module == 'detail2') && _reportType == 'xlsx') {
                            $scope.showLoader = true;
                            jsreportService.downloadXlsx($scope.printPdfVals, "rkxrqWEZ_E").success(function (data) {
                                $scope.showLoader = false;
                                let file = new Blob([data], { type: 'application/xlsx' });
                                saveAs(file, $scope.printPdfVals.reportName + ".xlsx");
                            })
                        } else {


                            /* var invoicePdfModal = ModalService.showModal({
                                templateUrl: 'app/views/reports/trialBalncreportsModal.html',
                                controller: 'pdfPrintModalController',
                                inputs: {
                                    printPdfVals: $scope.printPdfVals
                                }
                            });

                            invoicePdfModal.then(function (res) {
                                res.element.modal();
                            }); */
                        }


                    }
                    else {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                    }

                    $scope.showLoader = false;
                });
        }
    }
    // console.log($scope.module);

});
