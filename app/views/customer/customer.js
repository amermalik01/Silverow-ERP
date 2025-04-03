myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
<<<<<<< HEAD
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
=======
    function($stateProvider, $locationProvider, $urlRouterProvider, helper) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.customer', {
                url: '/customer/:filter_id',
                title: 'Sales',
                templateUrl: helper.basepath('customer/customer.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.add-customer', {
                url: '/customer/add',
                title: 'Sales',
                templateUrl: helper.basepath('addTabs.html'),
                controller: 'CustomerEditController',
                resolve: helper.resolveFor('ngTable', 'ngDialog', 'ui.select')

            })
            .state('app.editCustomer', {
                url: '/customer/:id/edit?isPriceOffer?isOppCycle',
                title: 'Sales',
                templateUrl: helper.basepath('addTabs.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog', 'ui.select'),
                controller: 'CustomerEditController'
            })

<<<<<<< HEAD
    }]);

myApp.controller('CustomerController', CustomerController);
=======
    }
]);

myApp.controller('CustomerController', CustomerController);

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
function CustomerController($scope, $filter, $resource, $timeout, $http, ngDialog, toaster, $rootScope, moduleTracker) {
    'use strict';

    moduleTracker.updateName("customer");
    moduleTracker.updateRecord("");

<<<<<<< HEAD
    $scope.$root.breadcrumbs =
        [{ 'name': 'Sales', 'url': '#', 'isActive': false },
        { 'name': 'Customers', 'url': '#', 'isActive': true }
        ];
=======
    $scope.$root.breadcrumbs = [{ 'name': 'Sales', 'url': '#', 'isActive': false },
        { 'name': 'Customers', 'url': '#', 'isActive': true }
    ];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    var vm = this;
    var Api = $scope.$root.sales + "customer/customer/listings";

    $scope.postData = {
        'token': $scope.$root.token,
        'all': "1",
        'more_fields': 'type'
    };


    //sort by column
    /* $scope.sortform = 'desc';
     $scope.reversee = true;
     $scope.sort_column='';*/
    $scope.searchKeyword = {};
<<<<<<< HEAD
    $scope.getcrm_list = function (item_paging, sort_column, sortform) {
=======
    $scope.getcrm_list = function(item_paging, sort_column, sortform) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        //pass in API
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;

        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;
        $scope.postData.searchKeyword = $scope.searchKeyword;
        $scope.postData.segments = $scope.searchKeyword.segment !== undefined ? $scope.searchKeyword.segment.id : 0;
        $scope.postData.regions = $scope.searchKeyword.region !== undefined ? $scope.searchKeyword.region.id : 0;
        $scope.postData.buying_groups = $scope.searchKeyword.buying_group !== undefined ? $scope.searchKeyword.buying_group.id : 0;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }
        $scope.postData.searchKeyword = $scope.searchKeyword;
        if ((sort_column != undefined) && (sort_column != null)) {
            //sort by column
            $scope.postData.sort_column = sort_column;
            $scope.postData.sortform = sortform;

            $rootScope.sortform = sortform;
            $rootScope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;
            $rootScope.sort_column = sort_column;

            $rootScope.save_single_value($rootScope.sort_column, 'crmsort_name')

            /*$scope.sortform=sortform;
             $scope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;
             $scope.sort_column=sort_column;
             */
        }

        $scope.showLoader = true;

        $http
            .post(Api, $scope.postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.record_data = res.data.response;
<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (index != 'chk' && index != 'id') {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }

                    });

                    $scope.showLoader = false;

                }
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                else $scope.showLoader = false;
            });
    }

    var col = '';
    col = $rootScope.get_single_value('crmsort_name');
    // $scope.getcrm_list(1, col, 'Desc');
    $scope.$root.itemselectPage(1);
}

myApp.controller('CustomerEditController', CustomerEditController);
<<<<<<< HEAD
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
function CustomerEditController($scope, $filter, $http, $state, $resource, ngDialog, toaster, $timeout, $rootScope, $stateParams, Upload, moduleTracker) {
    'use strict';

    moduleTracker.updateName("customer");
    moduleTracker.updateRecord($stateParams.id);

    $scope.moduleForPermissions = "customer";

    $scope.addCompetitorsPermission = $rootScope.allowadd_cust_competetor_tab;
    $scope.editCompetitorsPermission = $rootScope.allowedit_cust_competetor_tab;
    $scope.viewCompetitorsPermission = $rootScope.allowview_crm_competetor_tab;
    $scope.deleteCompetitorsPermission = $rootScope.allowdelete_cust_competetor_tab;
    $scope.convertPriceTabPermission = $rootScope.allowconvert_cust_price_tab;


<<<<<<< HEAD
    $scope.addPriceTabPermission = $rootScope.allowadd_cust_price_tab;    
=======
    $scope.addPriceTabPermission = $rootScope.allowadd_cust_price_tab;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    $scope.editPriceTabPermission = $rootScope.allowedit_cust_price_tab;
    $scope.viewPriceTabPermission = $rootScope.allowview_cust_price_tab;
    $scope.deletePriceTabPermission = $rootScope.allowdelete_cust_price_tab;

    $scope.addOppCyclePermission = $rootScope.allowadd_cust_oop_cycle_tab;
    $scope.editOppCyclePermission = $rootScope.allowedit_cust_oop_cycle_tab;
    $scope.viewOppCyclePermission = $rootScope.allowview_cust_oop_cycle_tab;
    $scope.deleteOppCyclePermission = $rootScope.allowdelete_cust_oop_cycle_tab;

    $scope.addContactPermission = $rootScope.allowadd_cust_contact_tab;
    $scope.editContactPermission = $rootScope.allowedit_cust_contact_tab;
    $scope.viewContactPermission = $rootScope.allowview_cust_contact_tab;
    $scope.deleteContactPermission = $rootScope.allowdelete_cust_contact_tab;

    $scope.addLocationPermission = $rootScope.allowadd_cust_location_tab;
    $scope.editLocationPermission = $rootScope.allowedit_cust_location_tab;
    $scope.viewLocationPermission = $rootScope.allowview_cust_location_tab;
    $scope.deleteLocationPermission = $rootScope.allowdelete_cust_location_tab;

<<<<<<< HEAD
    $scope.$root.breadcrumbs =
        [{ 'name': 'Sales', 'url': '#', 'style': '' },
        { 'name': 'Customers', 'url': 'app.customer', 'style': '' }];

    $scope.formUrl = function () {
=======
    $scope.$root.breadcrumbs = [{ 'name': 'Sales', 'url': '#', 'style': '' },
        { 'name': 'Customers', 'url': 'app.customer', 'style': '' }
    ];

    $scope.formUrl = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        //$scope.$root.$broadcast("goToComment", {row_id: $stateParams.id,module_id:19});
        return "app/views/customer/_form.html";
    }

    $scope.offeredByColumnsShow = [
        "name", "job_title", "dep_name"
    ]

    if ($stateParams.isPriceOffer != undefined) {
        $scope.isPriceOffer = 1;
<<<<<<< HEAD
    }
    else
=======
    } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.isPriceOffer = 0;


    if ($stateParams.isOppCycle != undefined) {
        $scope.isOppCycle = $stateParams.isOppCycle;
<<<<<<< HEAD
    }
    else
=======
    } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.isOppCycle = 0;


    $scope.check_cust_readonly = false;
    if ($stateParams.id > 0)
        $scope.check_cust_readonly = true;


<<<<<<< HEAD
    $scope.showEditCRMForm = function () {
=======
    $scope.showEditCRMForm = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.check_cust_readonly = false;
    }

    $scope.$root.tabHide = 0;
    $scope.$root.lblButton = 'Add New';
<<<<<<< HEAD
    
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    $scope.crmRebateFormShow = false;
    $scope.crmRebateListingShow = true;
    /*$scope.oppCycleFormShow = false;
    $scope.oppCycleListingShow = true;
    $scope.crmPromotionFormShow = false;
    $scope.crmPromotionListingShow = true;*/
    $scope.showProducts = false;
    $scope.crmDocumentFormShow = false;
    $scope.crmDocumentListingShow = true;
    $scope.arr_turnover = [];
    $scope.arr_segment = [];
    $scope.arr_buying_group = [];
    $scope.arr_regions = [];
    $scope.arr_sources_of_crm = [];
    // $scope.arr_ownership = [];
    $scope.arr_crm_status = [];
    $scope.selectedSalespersons = [];

    $scope.rec = {};

    $scope.socialMediasGeneral = {};
    $scope.socialMediasContactGeneral = {};
    $scope.socialMediasContactArr = {};
    $scope.tempSocialMedia = [];
    $rootScope.social_medias_general_form = [];
    $rootScope.social_medias_contact_form = [];

<<<<<<< HEAD
    var refreshId = setInterval(function () {
=======
    var refreshId = setInterval(function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (($rootScope.social_medias != undefined && $rootScope.social_medias.length > 0)) {
            angular.copy($rootScope.social_medias, $rootScope.social_medias_general_form);
            angular.copy($rootScope.social_medias, $rootScope.social_medias_contact_form);
            clearInterval(refreshId);
        }
    }, 500);
<<<<<<< HEAD
    
    
=======


>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

    $scope.qty = 5;
    $scope.defaultOption = 2;

    // $rootScope.tempSocialMedia = [];
    // $rootScope.socialMediasGeneral = {};
    // $rootScope.socialMediasContactGeneral = {};

    $scope.rec.type = 3;
    /*$scope.rec.is_billing_address = 1;
     $scope.rec.is_shipping_address = 1;
     $scope.rec.is_invoice_address = 1;*/

    $scope.rec.searchKeywordsl = '';
    $scope.drp = {};
    $scope.status_list = [];
    // $scope.rec.arr_crm_status = [{'id': '1', 'title': 'Active'}, {'id': '0', 'title': 'Inactive'}];

    // $scope.defualt_arr = [];
    // $scope.defualt_arr = [{'title': 'Active', 'id': 1}, {'title': 'Inactive', 'id': 0}];


    $scope.crm_no = '';
    $scope.drp.crm_segment_id = [];
    var crm_name = '';
    var id = $stateParams.id;
    $scope.$root.crm_id = id;
    $scope.$root.bdname = '';


    $scope.disableClass = 1;

<<<<<<< HEAD
    $scope.changeToAddButton = function () {
=======
    $scope.changeToAddButton = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.$root.lblButton = 'Add New';
    }
    $scope.code = '';


    //$scope.$root.lblButton = 'Detail';

    $scope.class = 'block';
    //  $scope.rec = {};
    $scope.rec.id = 0;

    $scope.drp = {};
    $scope.customer_no = '';
    $scope.$root.crm_id = id;
    var table = 'Customer';

    $scope.showLoader = true;

    function get_customer_last_order(_customerId) {

        var get_customer_last_order_url = $scope.$root.sales + "customer/order/last-order";
        $scope.postData_cust = {};
        $scope.postData_cust.token = $scope.$root.token;
        $scope.postData_cust.customerId = _customerId;

        $http
<<<<<<< HEAD
            .post(get_customer_last_order_url,$scope.postData_cust )
            .then(function (res) {
=======
            .post(get_customer_last_order_url, $scope.postData_cust)
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.lastCustomerActivity = res.data.response[0];
                } else {
                    $scope.lastCustomerActivity = false;
                }
            });

    }
<<<<<<< HEAD
    $scope.get_empl_list = function (arg) {
=======
    $scope.get_empl_list = function(arg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // console.log(arg);
        $scope.showLoader = true;
        $scope.columns_pr = [];
        $scope.record_pr = {};
        $scope.searchKeyword_offered = {};
        $scope.title = 'Recieved By';
        $scope.empListType = 'general';

        if (arg == 'saleperson_code') {
            $scope.title = 'Employee List';
            $scope.empListType = 'saleperson_code';
        }

        var empUrl = $scope.$root.hr + "employee/listings";

        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.crm_id,
            'limit': 9999
        };

        $http
            .post(empUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.columns_pr = [];
                    $scope.record_pr = {};
                    $scope.record_pr = res.data.response;


<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columns_pr.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.element('#_CrmEmplisting_model').modal({
                        show: true
                    });
                    return;
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });
    }

<<<<<<< HEAD
    $scope.confirm_employeeList = function (result, emptype) {
=======
    $scope.confirm_employeeList = function(result, emptype) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (emptype == 'general') {
            $scope.PriceOffer_rec.recieved_by = result.name;
            $scope.PriceOffer_rec.recieved_by_id = result.id;
        } else if (emptype == 'saleperson_code') {

            $scope.rec.saleperson_code = result.name;
            $scope.rec.saleperson_code_id = result.id;
        }

        angular.element('#_CrmEmplisting_model').modal('hide');
    }
<<<<<<< HEAD
    
    $scope.last_selected_bucket= 0;
    $scope.get_crm_data_by_id = function () {
=======

    $scope.last_selected_bucket = 0;
    $scope.get_crm_data_by_id = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        //  var getCrmUrl = $scope.$root.sales + "customer/customer/get-customer";
        var getCrmUrl = $scope.$root.sales + "crm/crm/get-crm";

        get_customer_last_order($scope.$root.crm_id);

        $scope.showLoader = true;
        $scope.bucket_selected_array = [];
        $scope.selectedSalespersons = [];

        $scope.moduleCodeType = 1;

        $http
<<<<<<< HEAD
            .post(getCrmUrl, { id: $scope.$root.crm_id, 'token': $scope.$root.token, customer: 'customer','defaultCurrency':$scope.$root.defaultCurrency })
            .then(function (res) {
                if(res.data.ack != undefined)
                {
=======
            .post(getCrmUrl, { id: $scope.$root.crm_id, 'token': $scope.$root.token, customer: 'customer', 'defaultCurrency': $scope.$root.defaultCurrency })
            .then(function(res) {
                if (res.data.ack != undefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.showLoader = false;
                }

                $scope.rec = res.data.response;
                $scope.moduleCodeType = res.data.moduleCodeType;

                $scope.rec.arr_crm_status = [{
                    'id': '1',
                    'title': 'Active'
                }, {
                    'id': '0',
                    'title': 'Inactive'
                }];
                // saleperson
<<<<<<< HEAD
                if(res.data.response.crmSalesPerson){
=======
                if (res.data.response.crmSalesPerson) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.rec.saleperson_code = res.data.response.crmSalesPerson.name;
                    $scope.rec.saleperson_code_id = res.data.response.crmSalesPerson.id;
                }
                moduleTracker.updateRecordName(res.data.response.name);
                $scope.check_cust_readonly = true;
                $scope.allowChangeBucket = false;

<<<<<<< HEAD
                
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.response.RouteToMarket != undefined && res.data.response.RouteToMarket.ack == 1) {
                    $scope.RTMCrmList = res.data.response.RouteToMarket.response.RTMCrmList;
                    $scope.LinkedRTMCrmList = res.data.response.RouteToMarket.response.LinkedRTMCrmList;
                    // $scope.selectedRouteToMarkets = res.data.response.RouteToMarket.response.LinkedRTMCrmString; // did in the next loop
                    $scope.selectedRouteToMarkets = "";
<<<<<<< HEAD
                    angular.forEach($scope.RTMCrmList, function (crm) {
                        crm.chk = false;
                        crm.is_prefered = false;
                        angular.forEach($scope.LinkedRTMCrmList, function (link_rtm) {
=======
                    angular.forEach($scope.RTMCrmList, function(crm) {
                        crm.chk = false;
                        crm.is_prefered = false;
                        angular.forEach($scope.LinkedRTMCrmList, function(link_rtm) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (crm.id == link_rtm.crm_id) {
                                crm.chk = true;
                                $scope.selectedRouteToMarkets += crm.code + ', ';
                                if (Number(link_rtm.is_prefered) > 0) {
                                    var found_is_prefered = true;
                                    crm.is_prefered = 1;
                                }
                            }
                        });
                    });

                    if ($scope.selectedRouteToMarkets.length > 0) {
                        $scope.selectedRouteToMarkets = $scope.selectedRouteToMarkets.substring(0, $scope.selectedRouteToMarkets.length - 2);
                    }
                }
                // $scope.rec.fax = parseFloat(res.data.response.fax);
                // $scope.rec.phone = parseFloat(res.data.response.phone);

                // $scope.rec.credit_limit = parseFloat(res.data.response.credit_limit);
                // $scope.rec.emp_no = parseFloat(res.data.response.emp_no);
                // $scope.rec.turnover = parseFloat(res.data.response.turnover);
                $scope.rec.credit_limit = (parseFloat(res.data.response.credit_limit) > 0) ? parseFloat(res.data.response.credit_limit) : 0.00; // according to Osama
                $scope.rec.emp_no = (parseFloat(res.data.response.emp_no) > 0) ? parseFloat(res.data.response.emp_no) : null;
                $scope.rec.turnover = (parseFloat(res.data.response.turnover) > 0) ? parseFloat(res.data.response.turnover) : 0.00; // according to Osama

                $scope.dynamic_socialmedia = {};
<<<<<<< HEAD
                $scope.customer_balance = res.data.response.customer_balance;                
                $scope.balanceInCustomerCurrency = res.data.response.balanceInCustomerCurrency;             
                $scope.custAvgPaymentDays = (res.data.response.custAvgPaymentDays) ? res.data.response.custAvgPaymentDays : 0;

                $scope.tempSocialMedia = [];
                angular.forEach($rootScope.social_medias_general_form, function (obj2) {
=======
                $scope.customer_balance = res.data.response.customer_balance;
                $scope.balanceInCustomerCurrency = res.data.response.balanceInCustomerCurrency;
                $scope.custAvgPaymentDays = (res.data.response.custAvgPaymentDays) ? res.data.response.custAvgPaymentDays : 0;

                $scope.tempSocialMedia = [];
                angular.forEach($rootScope.social_medias_general_form, function(obj2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

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

                if ($scope.tempSocialMedia.length) {
                    $scope.socialMediasGeneral = {};
                    $scope.socialMediasGeneral['customerSM'] = $scope.tempSocialMedia;
                }

                if ($scope.rec.currency_id) {
                    $rootScope.cust_current_edit_currency = $scope.$root.get_obj_frm_arry($rootScope.arr_currency, $scope.rec.currency_id);
<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $rootScope.cust_current_edit_currency = $scope.$root.defaultCurrencyCode;
                }

                $scope.customerCurrencyCode = $rootScope.cust_current_edit_currency.code;

                if ($scope.rec.contact_person != undefined) {
                    if ($scope.rec.contact_person.length > 0)
                        $scope.rec.contactCollapse = false;
                    else
                        $scope.rec.contactCollapse = true;
                }

                // $scope.rec.id = res.data.response.id;
                $scope.$root.bdname = res.data.response.name + '( ' + res.data.response.customer_code + ' )';

                $scope.module_code = res.data.response.name;

                if ($scope.rec.anonymous_customer == 1)
                    $scope.rec.anonymous_customer1 = true;
<<<<<<< HEAD
                else 
=======
                else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.rec.anonymous_customer1 = false;


                $scope.rec.customer_no = res.data.response.customer_no;
                $scope.module_code = $scope.$root.bdname;
                $scope.rec.old_status = res.data.response.status;
                $scope.rec.old_contact = $scope.rec.contact_person;
                $scope.rec.credit_rating_old = $scope.rec.credit_rating;


                if ($scope.rec.crm_segment_id != undefined && $rootScope.segment_customer_arr != undefined)
                    $scope.drp.crm_segment_id = $scope.$root.get_obj_frm_arry($rootScope.segment_customer_arr, $scope.rec.crm_segment_id);

                if ($scope.rec.buying_grp != undefined && $rootScope.bying_group_customer_arr != undefined)
                    $scope.drp.buying_grp_id = $scope.$root.get_obj_frm_arry($rootScope.bying_group_customer_arr, $scope.rec.buying_grp);

                if ($scope.rec.region_id != undefined && $scope.rec.region_id != undefined)
                    $scope.rec.region_id = $scope.$root.get_obj_frm_arry($rootScope.region_customer_arr, $scope.rec.region_id);

                if ($scope.rec.status != undefined && $scope.rec.arr_crm_status != undefined)
                    $scope.drp.status_id = $scope.$root.get_obj_frm_arry($scope.rec.arr_crm_status, $scope.rec.status);

                if ($scope.rec.source_of_crm != undefined && $scope.rec.arr_sources_of_crm != undefined)
                    $scope.drp.sources_of_crm_id = $scope.$root.get_obj_frm_arry($scope.rec.arr_sources_of_crm, $scope.rec.source_of_crm);

                if ($scope.rec.customer_classification != undefined && $rootScope.arr_customer_classification != undefined)
                    $scope.drp.customer_classification = $scope.$root.get_obj_frm_arry($rootScope.arr_customer_classification, $scope.rec.customer_classification);

                if ($scope.rec.credit_rating != undefined && $scope.rec.credit_rating != undefined)
                    $scope.rec.credit_rating = $scope.$root.get_obj_frm_arry($scope.rec.arr_crm_credit_rating, $scope.rec.credit_rating);

                if ($scope.rec.ownership_type != undefined && $rootScope.arr_type_of_Business != undefined)
                    $scope.rec.ownership_type = $scope.$root.get_obj_frm_arry($rootScope.arr_type_of_Business, $scope.rec.ownership_type);

<<<<<<< HEAD
                
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.rec.arr_crm_type = [{
                    'id': '1',
                    'title': 'Standard'
                }, {
                    'id': '2',
                    'title': 'Route To Market'
                }, {
                    'id': '3',
                    'title': 'Indirect'
                }];
                //if ($scope.rec.country_id != undefined && $rootScope.country_type_arr != undefined) $scope.drp.country_id = $scope.$root.get_obj_frm_arry($rootScope.country_type_arr, $scope.rec.country_id);

                if ($scope.rec.currency_id != undefined && $rootScope.arr_currency != undefined)
                    $scope.drp.currency = $scope.$root.get_obj_frm_arry($rootScope.arr_currency, $scope.rec.currency_id);

                if ($scope.rec.crm_type != undefined && $scope.rec.arr_crm_type != undefined)
<<<<<<< HEAD
                        $scope.drp.crm_type = $scope.$root.get_obj_frm_arry($scope.rec.arr_crm_type, $scope.rec.crm_type);

                angular.forEach($rootScope.social_medias, function (obj2) {
=======
                    $scope.drp.crm_type = $scope.$root.get_obj_frm_arry($scope.rec.arr_crm_type, $scope.rec.crm_type);

                angular.forEach($rootScope.social_medias, function(obj2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    if (obj2.id == $scope.rec.socialmedia1)
                        $scope.rec.socialmedia1 = obj2;

                    if (obj2.id == $scope.rec.socialmedia2)
                        $scope.rec.socialmedia2 = obj2;

                    if (obj2.id == $scope.rec.socialmedia3)
                        $scope.rec.socialmedia3 = obj2;

                    if (obj2.id == $scope.rec.socialmedia4)
                        $scope.rec.socialmedia4 = obj2;

                    if (obj2.id == $scope.rec.socialmedia5)
                        $scope.rec.socialmedia5 = obj2;
                });

                if (res.data.response.socialmedia1 == 0)
                    $scope.rec.socialmedia1 = null;

                if (res.data.response.socialmedia2 == 0)
                    $scope.rec.socialmedia2 = null;

                if (res.data.response.socialmedia3 == 0)
                    $scope.rec.socialmedia3 = null;

                if (res.data.response.socialmedia4 == 0)
                    $scope.rec.socialmedia4 = null;

                if (res.data.response.socialmedia5 == 0)
                    $scope.rec.socialmedia5 = null;


                if ($scope.$root.breadcrumbs.length == 2) {
<<<<<<< HEAD
                    $scope.$root.breadcrumbs.push(
                        { 'name': $scope.$root.bdname, 'url': '#', 'isActive': false });
=======
                    $scope.$root.breadcrumbs.push({ 'name': $scope.$root.bdname, 'url': '#', 'isActive': false });
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                }

                if ($scope.rec.socialmedia1_value.length > 0 || $scope.rec.socialmedia2_value.length > 0 || $scope.rec.socialmedia3_value.length > 0 || $scope.rec.socialmedia4_value.length > 0 || $scope.rec.socialmedia5_value.length > 0)
                    $scope.rec.generalSocialMediaCollapse = false;
                else
                    $scope.rec.generalSocialMediaCollapse = true;

                $scope.getAltContact_genral($scope.rec, 1);
                $scope.getAltLocationfrmGeneral($scope.rec, 1);
                // $scope.showLoader = false;

                $scope.bucket_array = [];

<<<<<<< HEAD
               
            }).catch(function (message) {
=======

            }).catch(function(message) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                throw new Error(message.data);
                console.log(message.data);
            });

    }

<<<<<<< HEAD
    
    $scope.ShowRouteToMarketList = function (crm_type) {
=======

    $scope.ShowRouteToMarketList = function(crm_type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.searchKeyword_rmt = {};
        var type = 0;
        if (crm_type == 2) // (from RTM to indirect)
        {
            $scope.title = "Indirect List";
            $scope.route_to_market_type = 1;
            type = 1;
<<<<<<< HEAD
        }
        else if (crm_type == 3) // (from indirect to RTM)
=======
        } else if (crm_type == 3) // (from indirect to RTM)
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        {
            $scope.title = "Route to Market List"
            type = 2;
            $scope.route_to_market_type = 2;
<<<<<<< HEAD
        }
        else {
            return;
        }
        
        angular.forEach($scope.RTMCrmList, function (crm) {
=======
        } else {
            return;
        }

        angular.forEach($scope.RTMCrmList, function(crm) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            crm.chk = false;
        });
        var crm_id = ($scope.$root.crm_id != undefined) ? $scope.$root.crm_id : 0;
        var postData = {
            'type': type,
            'crm_id': crm_id,
            token: $scope.$root.token
        }
        var ApiAjax = $scope.$root.sales + "crm/crm/get-all-route-to-market";
        $scope.RTMCrmListTemp = [];
        angular.copy($scope.RTMCrmList, $scope.RTMCrmListTemp);
        var found_is_prefered = false;
        $scope.showLoader = true;
        $http
            .post(ApiAjax, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {

                    $scope.RTMCrmList = res.data.response.RTMCrmList;
                    $scope.LinkedRTMCrmList = res.data.response.LinkedRTMCrmList;
                    $scope.selectedRouteToMarkets = '';
<<<<<<< HEAD
                    angular.forEach($scope.RTMCrmList, function (crm) {
                        crm.chk = false;
                        crm.is_prefered = false;
                        angular.forEach($scope.LinkedRTMCrmList, function (link_rtm) {
=======
                    angular.forEach($scope.RTMCrmList, function(crm) {
                        crm.chk = false;
                        crm.is_prefered = false;
                        angular.forEach($scope.LinkedRTMCrmList, function(link_rtm) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (crm.id == link_rtm.crm_id) {
                                crm.chk = true;
                                $scope.selectedRouteToMarkets += crm.code + ', ';
                                if (Number(link_rtm.is_prefered) > 0) {
                                    found_is_prefered = true;
                                    crm.is_prefered = 1;
                                }
                            }
                        });


                    });
                    $scope.checkSingleRMT(true);
                    angular.element('#customer_route_to_market_modal').modal('show');
                    if ($scope.selectedRouteToMarkets.length > 0)
                        $scope.selectedRouteToMarkets = $scope.selectedRouteToMarkets.slice(0, -2);
<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (type == 1)
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(232, ['Indirect CRMs']));
                    else
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(232, ['Route to Market']));

                }

                if (res.data.ack != undefined) {
<<<<<<< HEAD
                    angular.forEach($scope.RTMCrmList, function (crm) {
                        angular.forEach($scope.RTMCrmListTemp, function (selected_rtm) {
=======
                    angular.forEach($scope.RTMCrmList, function(crm) {
                        angular.forEach($scope.RTMCrmListTemp, function(selected_rtm) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (crm.id == selected_rtm.id && !crm.chk && selected_rtm.chk) {
                                crm.chk = true;
                                $scope.selectedRouteToMarkets += crm.code + ', ';
                                if (found_is_prefered == false && Number(selected_rtm.is_prefered) > 0)
                                    crm.is_prefered = 1;
                            }
                        });
                    });
                    $scope.showLoader = false;
                }
            });

    }
<<<<<<< HEAD
    $scope.ShowIndirectCustomers = function (crm_id) {
=======
    $scope.ShowIndirectCustomers = function(crm_id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        console.log(crm_id);
        $scope.searchKeyword_rmt_sub = {};
        var postUrl = $scope.$root.sales + "crm/crm/get-route-to-market-associated-indirect-crm";
        $scope.showLoader = true;
        $http
            .post(postUrl, {
                crm_id: crm_id,
                'token': $scope.$root.token
            })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.RTMCrmList_sub = res.data.response;
                    angular.element('#customer_route_to_market_modal_sub').modal('show');
                    $scope.showLoader = false;
                } else {
                    toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(233));
                    $scope.showLoader = false;
                }
            });
    }
<<<<<<< HEAD
    $scope.CheckAllRMT = function (flg) {
        var chk_is_prefered = 0;
        angular.forEach($scope.RTMCrmList, function (obj) {
=======
    $scope.CheckAllRMT = function(flg) {
        var chk_is_prefered = 0;
        angular.forEach($scope.RTMCrmList, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            obj.chk = flg;

            if (flg == false && obj.is_prefered == true)
                obj.is_prefered = false;

            if (flg == true && obj.is_prefered == true)
                chk_is_prefered = 1;
        });

        if (flg == true && chk_is_prefered == 0)
            $scope.RTMCrmList[0].is_prefered = true;
    }

<<<<<<< HEAD
    $scope.CheckPreferedRMT = function (rec) {
        angular.forEach($scope.RTMCrmList, function (obj) {
=======
    $scope.CheckPreferedRMT = function(rec) {
        angular.forEach($scope.RTMCrmList, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            obj.is_prefered = false;
            if (obj.id == rec.id) {
                obj.is_prefered = true;
                obj.chk = true;
            }
        });
    }

<<<<<<< HEAD
    $scope.checkSingleRMT = function (rec) {
        if (rec.chk == false) {
            rec.is_prefered = false;
            $scope.searchKeyword_rmt.chk = false;
        }
        else {
=======
    $scope.checkSingleRMT = function(rec) {
        if (rec.chk == false) {
            rec.is_prefered = false;
            $scope.searchKeyword_rmt.chk = false;
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (rec.crm_type == 1) {
                ngDialog.openConfirm({
                    template: 'modalConvertCRMToIndirect',
                    className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
                }).then(function (value) {
                    console.log('checked');
                }, function (reason) {
=======
                }).then(function(value) {
                    console.log('checked');
                }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    //console.log('Modal promise rejected. Reason: ', reason);
                    rec.chk = false;
                });
            }
            var flg = true;
<<<<<<< HEAD
            angular.forEach($scope.RTMCrmList, function (obj) {
=======
            angular.forEach($scope.RTMCrmList, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (obj.chk == false) {
                    flg = false;
                }
            });

            if (flg) // all true
                $scope.searchKeyword_rmt.chk = true;
            else
                $scope.searchKeyword_rmt.chk = false;

        }
    }

<<<<<<< HEAD
    $scope.AddRTM = function (isSave) {
=======
    $scope.AddRTM = function(isSave) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var str = '';
        var selected_rows = [];
        if ($scope.drp.crm_type.id == 1)
            $scope.RTMCrmList = [];

<<<<<<< HEAD
        angular.forEach($scope.RTMCrmList, function (crm) {
=======
        angular.forEach($scope.RTMCrmList, function(crm) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (crm.chk == true) {
                str += crm.code + ', ';
                selected_rows.push(crm);
            }
        });
        $scope.selectedRouteToMarkets = str.slice(0, -2);
        angular.element('#customer_route_to_market_modal').modal('hide');
        if (isSave == 1) {
            var postData = {
                'crm_id': $scope.$root.crm_id,
                'crm_code': $scope.rec.crm_code,
                'rmt_list': selected_rows,
                'type': $scope.drp.crm_type.id,
                token: $scope.$root.token
            }

            var ApiAjax = $scope.$root.sales + "crm/crm/update-route-to-market";
            $http
                .post(ApiAjax, postData)
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        if (str.length > 0)
                            $scope.selectedRouteToMarkets = str.slice(0, -2);

                        angular.element('#customer_route_to_market_modal').modal('hide');
<<<<<<< HEAD
                    }
                    else
=======
                    } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(106));
                });
        }
    }
    if ($stateParams.id !== undefined)
        $scope.get_crm_data_by_id();

    $scope.recnew = {};
    $scope.recnew.crmid = 0;

    if ($stateParams.id !== undefined)
        $scope.recnew.crmid = id;

    $scope.product_type = true;
    $scope.count_result = 0;

    var getCodeUrl = $scope.$root.stock + "products-listing/get-code";

<<<<<<< HEAD
    $scope.getCode = function (rec) {
=======
    $scope.getCode = function(rec) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        //var getCodeUrl = $scope.$root.sales+"customer/customer/get-crm-code";

        var name = $scope.$root.base64_encode('customer');
        var no = $scope.$root.base64_encode('customer_no');

        var module_category_id = 2;
        /*if( $scope.formData.brand_ids != 0)  module_category_id=1;
         if( $scope.formData.brand_ids == 0)
         {
         if( $scope.formData.category_ids != 0) module_category_id=3;
         }*/

        $http
            .post(getCodeUrl, {
                'is_increment': 1,
                'token': $scope.$root.token,
                'tb': name,
                'm_id': 9,
                'no': no,
                'category': '',
                'brand': '',
                'module_category_id': module_category_id,
                'type': '2,3',
                'status': ''
            })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (res.data.ack == 1) {

                    $scope.rec.customer_code = res.data.code;
                    $scope.rec.customer_no = res.data.nubmer;
<<<<<<< HEAD
                    $scope.rec.code_type = module_category_id;//res.data.code_type;
=======
                    $scope.rec.code_type = module_category_id; //res.data.code_type;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.count_result++;


                    if (res.data.type == 1) {
                        $scope.product_type = false;
<<<<<<< HEAD
                    }
                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.product_type = true;
                    }

                    if ($scope.count_result > 0) {
                        //console.log($scope.count_result);
                        return true;
<<<<<<< HEAD
                    }
                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        //console.log($scope.count_result + 'd');
                        return false;
                    }

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

    /*if ($stateParams.id == undefined)
     $scope.getCode();*/

    // $scope.showLoader = false;

<<<<<<< HEAD
    $scope.generate_unique_id = function () {
=======
    $scope.generate_unique_id = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.$root.crm_id = null;
        $scope.moduleCodeType = 1;

        var getUrl = $scope.$root.sales + "customer/customer/get-unique-id";
        $scope.showLoader = true;

        $http
            .post(getUrl, { 'token': $scope.$root.token, type: 3, customer: 'customer' })
<<<<<<< HEAD
            .then(function (res) {
                $scope.showLoader = false;
                
=======
            .then(function(res) {
                $scope.showLoader = false;

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                // alert($scope.showLoader);  //return;

                if (res.data.ack == 1) {

                    $scope.rec = res.data.response;
                    $scope.moduleCodeType = res.data.moduleCodeType;

                    $scope.allowChangeBucket = true;
<<<<<<< HEAD
                   
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    // $scope.rec.unique_id = res.data.unique_id;
                    $scope.rec.id = res.data.id;
                    $scope.$root.crm_id = res.data.id;
                    $scope.rec.type = 3;

                    // $scope.rec.social_mediascrm = [{id: ''}];
                    //  $scope.rec.social_mediasconatctcrm = [{id: ''}];
                    $scope.rec.is_billing_address = 1;
                    $scope.rec.is_delivery_collection_address = 1;
                    $scope.rec.is_invoice_address = 1;

                    $scope.rec.anonymous_customer = 0;

                    $scope.rec.primary_is_billing_address = 1;
                    $scope.rec.primary_is_invoice_address = 1;
                    $scope.rec.primary_is_delivery_collection_address = 1;

                    $scope.drp.currency = $scope.$root.get_obj_frm_arry($scope.$root.arr_currency, $scope.$root.defaultCurrency);

                    $scope.drp.country_id = $scope.$root.get_obj_frm_arry($scope.$root.country_type_arr, $scope.$root.defaultCountry);

                    //$scope.rec.arr_crm_status = [{'id': '1', 'title': 'Active'}, {'id': '0', 'title': 'Inactive'}];
                    $scope.rec.arr_crm_status = [{
                        'id': '1',
                        'title': 'Active'
                    }, {
                        'id': '0',
                        'title': 'Inactive'
                    }];
                    $scope.rec.arr_crm_type = [{
                        'id': '1',
                        'title': 'Standard'
                    }, {
                        'id': '2',
                        'title': 'Route To Market'
                    }, {
                        'id': '3',
                        'title': 'Indirect'
                    }];
                    $scope.drp.crm_type = $scope.rec.arr_crm_type[0];
                    $scope.drp.status_id = $scope.rec.arr_crm_status[0];

                    $scope.rec.generalSocialMediaCollapse = true;
                    $scope.rec.contactCollapse = true;
                    $scope.rec.primaryConSocialMediaCollapse = true;

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

    if ($stateParams.id == undefined)
        $scope.generate_unique_id();

    $scope.$root.crm_id = $stateParams.id;

<<<<<<< HEAD
    $scope.add_general = function (rec, drp) {
=======
    $scope.add_general = function(rec, drp) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if (drp.status_id == undefined || drp.status_id == '') {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Status']));
            return false;
        }

<<<<<<< HEAD
        if (rec.credit_limit && (isNaN(rec.credit_limit) || (rec.credit_limit != Math.floor(rec.credit_limit)))){
=======
        if (rec.credit_limit && (isNaN(rec.credit_limit) || (rec.credit_limit != Math.floor(rec.credit_limit)))) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(646, ['Credit Limit']));
            return false;
        }

        rec.country = (drp.country_id != undefined && drp.country_id != '') ? drp.country_id.id : 0;
        rec.country_id = (drp.country_id != undefined && drp.country_id != '') ? drp.country_id.id : 0;
        rec.status = (drp.status_id != undefined && drp.status_id != '') ? drp.status_id.id : 0;

        rec.region_ids = (rec.region_id != undefined && rec.region_id != '') ? rec.region_id.id : 0;
        rec.pref_method_of_communication = (drp.pref_mthod_of_comm != undefined && drp.pref_mthod_of_comm != '') ? drp.pref_mthod_of_comm.id : 0;
        rec.buying_grp = (drp.buying_grp_id != undefined && drp.buying_grp_id != '') ? drp.buying_grp_id.id : 0;
        rec.source_of_crm = (drp.sources_of_crm_id != undefined && drp.sources_of_crm_id != '') ? drp.sources_of_crm_id.id : 0;
        rec.currency_id = (drp.currency != undefined && drp.currency != '' && rec.currency != '0') ? drp.currency.id : 0;
        rec.customer_classification = (drp.customer_classification != undefined && drp.customer_classification != '') ? drp.customer_classification.id : 0;
        rec.credit_ratings = (rec.credit_rating != undefined && rec.credit_rating != '') ? rec.credit_rating.id : 0;
        rec.ownership_types = (rec.ownership_type != undefined && rec.ownership_type != '') ? rec.ownership_type.id : 0;
        rec.crm_segment_id = (drp.crm_segment_id != undefined && drp.crm_segment_id != '') ? drp.crm_segment_id.id : 0;
        rec.crm_type = (drp.crm_type != undefined && drp.crm_type != '') ? drp.crm_type.id : 0;

        rec.socialmedia1s = (rec.socialmedia1 != undefined && rec.socialmedia1 != '' && rec.socialmedia1 != '0') ? rec.socialmedia1.id : 0;
        rec.socialmedia2s = (rec.socialmedia2 != undefined && rec.socialmedia2 != '' && rec.socialmedia2 != '0') ? rec.socialmedia2.id : 0;
        rec.socialmedia3s = (rec.socialmedia3 != undefined && rec.socialmedia3 != '' && rec.socialmedia3 != '0') ? rec.socialmedia3.id : 0;
        rec.socialmedia4s = (rec.socialmedia4 != undefined && rec.socialmedia4 != '' && rec.socialmedia4 != '0') ? rec.socialmedia4.id : 0;
        rec.socialmedia5s = (rec.socialmedia5 != undefined && rec.socialmedia5 != '' && rec.socialmedia5 != '0') ? rec.socialmedia5.id : 0;

        if (rec.currency_id == 0) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Currency']));
            return false;
        }

        if (rec.web_address != undefined && rec.web_address.length > 0)
            rec.web_address = (rec.web_address.indexOf('://') === -1) ? 'http://' + rec.web_address : rec.web_address;

        if (angular.element('#genis_billing_address').is(':checked') == false)
            rec.is_billing_address = 0;

        /*if (angular.element('#genis_shipping_address').is(':checked') == false)
         rec.is_shipping_address = 0;*/
        if (angular.element('#genis_delivery_collection_address').is(':checked') == false)
            rec.is_delivery_collection_address = 0;
        // else
        //     toaster.pop('warning', 'info', "Contact and Delivery Hours can be added on Other Location(s) tab.");

        if (angular.element('#genis_invoice_address').is(':checked') == false)
            rec.is_invoice_address = 0;

        if (angular.element('#general_anonymous_customer').is(':checked') == false)
            rec.anonymous_customer = 0;

        if (rec.anonymous_customer == true)
            rec.anonymous_customer = 1;

        rec.type = 3;
        rec.token = $scope.$root.token;


<<<<<<< HEAD
        if ($scope.rec.customer_code != undefined){
=======
        if ($scope.rec.customer_code != undefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            // if (rec.is_delivery_collection_address != 0)
            //     toaster.pop('warning', 'info', "Contact and Delivery Hours can be added on Other Locations tab.");
            $scope.UpdateForm(rec);

<<<<<<< HEAD
        }            
        else {

            $scope.showLoader = true;
            rec.crmModuleType = 2; 
=======
        } else {

            $scope.showLoader = true;
            rec.crmModuleType = 2;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.recDupChk = rec;

            var duplicationChkUrl = $scope.$root.sales + "crm/crm/duplication-chk-crm";

            $http
                .post(duplicationChkUrl, rec)
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    if (res.data.ack == true) {
                        $scope.showLoader = false;

                        $scope.errorMsg = res.data.error;

                        ngDialog.openConfirm({
                            template: 'app/views/crm/duplicationChkModal.html',
                            className: 'ngdialog-theme-default-custom',
                            scope: $scope
<<<<<<< HEAD
                        }).then(function (value) { 
=======
                        }).then(function(value) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                            /* code to get Customer code Start */
                            if (rec.is_delivery_collection_address != 0)
                                toaster.pop('warning', 'info', "Contact and Delivery Hours can be added on Other Locations tab.");

                            var name = $scope.$root.base64_encode('customer');
                            var no = $scope.$root.base64_encode('customer_no');

                            var module_category_id = 2;

                            $http
                                .post(getCodeUrl, {
                                    'is_increment': 1,
                                    'token': $scope.$root.token,
                                    'tb': name,
                                    'm_id': 9,
                                    'no': no,
                                    'category': '',
                                    'brand': '',
                                    'module_category_id': module_category_id,
                                    'type': '2,3',
                                    'status': ''
                                })
<<<<<<< HEAD
                                .then(function (coderes) {
=======
                                .then(function(coderes) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                                    if (coderes.data.ack == 1) {
                                        // $scope.showLoader = false;

                                        $scope.rec.customer_code = coderes.data.code;
                                        $scope.rec.customer_no = coderes.data.nubmer;
                                        $scope.rec.code_type = module_category_id; //res.data.code_type;
                                        $scope.count_result++;

                                        if (coderes.data.type == 1) {
                                            $scope.product_type = false;
                                        } else {
                                            $scope.product_type = true;
                                        }


                                        if ($scope.rec.customer_code != undefined) {

                                            /* code to add Customer Start */

                                            $scope.UpdateForm(rec);

                                            /* code to add Customer End */

<<<<<<< HEAD
                                        }
                                        else toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Customer Code']));
=======
                                        } else toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Customer Code']));
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


                                    } else {
                                        toaster.pop('error', 'info', coderes.data.error);
                                        return false;
                                    }
                                });

                            /* code to get Customer code End */

<<<<<<< HEAD
                            }, function (reason) {
                                $scope.showLoader = false;
                                console.log('Modal promise rejected. Reason: ', reason);
                            });
=======
                        }, function(reason) {
                            $scope.showLoader = false;
                            console.log('Modal promise rejected. Reason: ', reason);
                        });
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    } else {
                        /* code to get Customer code Start */
                        if (rec.is_delivery_collection_address != 0)
                            toaster.pop('warning', 'info', "Contact and Delivery Hours can be added on Other Locations tab.");

                        var name = $scope.$root.base64_encode('customer');
                        var no = $scope.$root.base64_encode('customer_no');

                        var module_category_id = 2;

                        $http
                            .post(getCodeUrl, {
                                'is_increment': 1,
                                'token': $scope.$root.token,
                                'tb': name,
                                'm_id': 9,
                                'no': no,
                                'category': '',
                                'brand': '',
                                'module_category_id': module_category_id,
                                'type': '2,3',
                                'status': ''
                            })
<<<<<<< HEAD
                            .then(function (coderes) {
=======
                            .then(function(coderes) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                                if (coderes.data.ack == 1) {
                                    // $scope.showLoader = false;

                                    $scope.rec.customer_code = coderes.data.code;
                                    $scope.rec.customer_no = coderes.data.nubmer;
                                    $scope.rec.code_type = module_category_id; //res.data.code_type;
                                    $scope.count_result++;

                                    if (coderes.data.type == 1) {
                                        $scope.product_type = false;
                                    } else {
                                        $scope.product_type = true;
                                    }


                                    if ($scope.rec.customer_code != undefined) {

                                        /* code to add Customer Start */

                                        $scope.UpdateForm(rec);

                                        /* code to add Customer End */

<<<<<<< HEAD
                                    }
                                    else toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Customer Code']));
=======
                                    } else toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Customer Code']));
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


                                } else {
                                    toaster.pop('error', 'info', coderes.data.error);
                                    return false;
                                }
                            });

<<<<<<< HEAD
                            /* code to get Customer code End */
                    }

                }).catch(function (message) {
=======
                        /* code to get Customer code End */
                    }

                }).catch(function(message) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
<<<<<<< HEAD
                }); 
=======
                });
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        }

    }
    $scope.selectedSalesBucket = {};

    ///* Function to Update Customer General Form*/
<<<<<<< HEAD
    $scope.UpdateForm = function (rec) {
=======
    $scope.UpdateForm = function(rec) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        // for primary contact crm

        /* if (rec.social_mediasconatctcrm != undefined) {

            if (rec.social_mediasconatctcrm[0] != undefined && rec.social_mediasconatctcrm[0] != '') {
                if (rec.social_mediasconatctcrm[0].csocialmedia != undefined) {
                    rec.csocialmedia1 = rec.social_mediasconatctcrm[0].csocialmedia.id;
                    rec.csocialmedia1_value = rec.social_mediasconatctcrm[0].csocialmedia_value;
                }
            }

            if (rec.social_mediasconatctcrm[1] != undefined) {
                if (rec.social_mediasconatctcrm[1].csocialmedia != undefined) {
                    rec.csocialmedia2 = rec.social_mediasconatctcrm[1].csocialmedia.id;
                    rec.csocialmedia2_value = rec.social_mediasconatctcrm[1].csocialmedia_value;
                }
            }

            if (rec.social_mediasconatctcrm[2] != undefined) {
                if (rec.social_mediasconatctcrm[2].csocialmedia != undefined) {
                    rec.csocialmedia3 = rec.social_mediasconatctcrm[2].csocialmedia.id;
                    rec.csocialmedia3_value = rec.social_mediasconatctcrm[2].csocialmedia_value;
                }
            }

            if (rec.social_mediasconatctcrm[3] != undefined) {
                if (rec.social_mediasconatctcrm[3].csocialmedia != undefined) {
                    rec.csocialmedia4 = rec.social_mediasconatctcrm[3].csocialmedia.id;
                    rec.csocialmedia4_value = rec.social_mediasconatctcrm[3].csocialmedia_value;
                }
            }

            if (rec.social_mediasconatctcrm[4] != undefined) {
                if (rec.social_mediasconatctcrm[4].csocialmedia != undefined) {
                    rec.csocialmedia5 = rec.social_mediasconatctcrm[4].csocialmedia.id;
                    rec.csocialmedia5_value = rec.social_mediasconatctcrm[4].csocialmedia_value;
                }
            }
        } */



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
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(231, ['Address line 1', 'Post Code']));
            $scope.showLoader = false;
            return;
        }
        if ($scope.rec.customer_code != undefined) {
            //console.log($scope.$root.crm_id);

            // var addcrmUrl = $scope.$root.sales + "customer/customer/add-customer";
            //if ($scope.$root.crm_id > 0)
<<<<<<< HEAD
                var addcrmUrl = $scope.$root.sales + "customer/customer/update-customer";
=======
            var addcrmUrl = $scope.$root.sales + "customer/customer/update-customer";
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            if ($scope.rec.contact_person != undefined) {
                if ($scope.rec.contact_person.length > 0) {
                    $scope.add_alt_contact(rec, 2);
                    rec.contact = $scope.addContactData;
                }
            }

<<<<<<< HEAD
            
            if ($scope.rec.address_1) {// != undefined
                if ($scope.rec.address_1.length > 0) {
                    $scope.addAltlocationfromGeneral(rec);
                    rec.loc = $scope.addLocdata;
                }
                else if ($scope.rec.postcode && $scope.rec.postcode.length > 0) {// != undefined
                    $scope.addAltlocationfromGeneral(rec);
                    rec.loc = $scope.addLocdata;
                }
                else
                    rec.loc = {};
            } else if ($scope.rec.postcode) {// != undefined
=======

            if ($scope.rec.address_1) { // != undefined
                if ($scope.rec.address_1.length > 0) {
                    $scope.addAltlocationfromGeneral(rec);
                    rec.loc = $scope.addLocdata;
                } else if ($scope.rec.postcode && $scope.rec.postcode.length > 0) { // != undefined
                    $scope.addAltlocationfromGeneral(rec);
                    rec.loc = $scope.addLocdata;
                } else
                    rec.loc = {};
            } else if ($scope.rec.postcode) { // != undefined
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if ($scope.rec.postcode.length > 0) {
                    $scope.addAltlocationfromGeneral(rec);
                    rec.loc = $scope.addLocdata;
                }
<<<<<<< HEAD
            }
            else
                rec.loc = {};

            if (!(rec.loc.depot) && rec.alt_loc_id > 0) {// == undefined
=======
            } else
                rec.loc = {};

            if (!(rec.loc.depot) && rec.alt_loc_id > 0) { // == undefined
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.showLoader = false;
                toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(378, ['Primary Location']));
                return false;
            }

            if ($scope.rec.currency_id) {
                $rootScope.cust_current_edit_currency = $scope.$root.get_obj_frm_arry($rootScope.arr_currency, $scope.rec.currency_id);
<<<<<<< HEAD
            }
            else {
=======
            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $rootScope.cust_current_edit_currency = $scope.$root.defaultCurrency;
            }

            /* if ($scope.selectedSalesBucket.obj != undefined && $scope.selectedSalesBucket.obj.id) {
                rec.selectedSalesBucket = $scope.selectedSalesBucket.obj;
            } */

            rec.name = rec.name.replace("'", "`");
            rec.social_media_arr = $scope.socialMediasGeneral.customerSM;

            if (rec.anonymous_customer1 == true)
                rec.anonymous_customer = 1;
<<<<<<< HEAD
            else 
=======
            else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                rec.anonymous_customer = 0;

            //rec.last_selected_bucket  = $scope.last_selected_bucket;
            $scope.showLoader = true;
            $http
                .post(addcrmUrl, rec)
<<<<<<< HEAD
                .then(function (res) {
                    if (res.data.ack == true) {
                        
                         if ($scope.$root.crm_id == undefined)  
                            $scope.$root.crm_id = res.data.crm_id;

                         if(!$scope.rec.alt_loc_id && res.data.alt_loc_id) 
                            $scope.rec.alt_loc_id = res.data.alt_loc_id;

                         if(!$scope.rec.alt_contact_id && res.data.alt_contact_id) 
                            $scope.rec.alt_contact_id = res.data.alt_contact_id;                         
=======
                .then(function(res) {
                    if (res.data.ack == true) {

                        if ($scope.$root.crm_id == undefined)
                            $scope.$root.crm_id = res.data.crm_id;

                        if (!$scope.rec.alt_loc_id && res.data.alt_loc_id)
                            $scope.rec.alt_loc_id = res.data.alt_loc_id;

                        if (!$scope.rec.alt_contact_id && res.data.alt_contact_id)
                            $scope.rec.alt_contact_id = res.data.alt_contact_id;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        if ($scope.RTMCrmList != undefined && $scope.RTMCrmList.length > 0)
                            $scope.AddRTM(1);

                        if ($stateParams.id != undefined)
                            toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                        else
                            toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));

                        $scope.$root.lblButton = 'Add New';


                        if ($scope.$root.crm_id === undefined)
                            return;


                        $scope.notClickAllow = '';

                        rec.contact_name = rec.contact_person;
                        rec.web_add = rec.web_address;

                        if ($scope.rec.old_status != rec.status)
                            $scope.add_status_history($scope.$root.crm_id, rec);

                        if ($scope.rec.credit_rating != undefined) {

                            if ($scope.rec.credit_rating_old != rec.credit_rating.id)
                                $scope.add_credit_rating_history($scope.$root.crm_id, rec);
                        }

                        /* if ($scope.isBucketChanged)
                            $scope.add_bucket(rec.id);

                        if ($scope.isSalePerersonChanged) {
                            $scope.add_salespersons($scope.$root.crm_id, 2);
                            $scope.add_salespersons_history($scope.$root.crm_id);
                        } */

                        $scope.isSubmitting = false;

                        if ($stateParams.id === undefined)
<<<<<<< HEAD
                            $timeout(function () {
=======
                            $timeout(function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                $state.go("app.editCustomer", {
                                    id: $scope.$root.crm_id
                                });
                            }, 1500)
<<<<<<< HEAD
                        else
                        {
=======
                        else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.check_cust_readonly = true;
                            $scope.showLoader = false;
                        }

                        if (res.data.validBucket == 0) {
                            $scope.selectedSalesBucket = {};
                            toaster.pop('warning', 'info', 'The filters in the selected View Bucket do not match this record!');
<<<<<<< HEAD
                        }
                        else if (res.data.validBucket && res.data.bucketAdded) {
=======
                        } else if (res.data.validBucket && res.data.bucketAdded) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.selectedSalesBucket.obj = {};
                            toaster.pop('success', 'Add', 'View Bucket and Salepersons Added Successfully');
                            $scope.get_crm_data_by_id();
                        }


<<<<<<< HEAD
                    }
                    else if (res.data.ack == 2) {
                        $scope.showLoader = false;
                        toaster.pop('warning', 'Edit', res.data.error);
                    }
                    else {
=======
                    } else if (res.data.ack == 2) {
                        $scope.showLoader = false;
                        toaster.pop('warning', 'Edit', res.data.error);
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.showLoader = false;
                        if ($stateParams.id > 0)
                            toaster.pop('error', 'Edit', res.data.error);
                        else
                            toaster.pop('error', 'Add', res.data.error);

                    }
                });
        } else toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Customer Code']));
    }

<<<<<<< HEAD
    $scope.add_credit_rating_history = function (id, rec) {
=======
    $scope.add_credit_rating_history = function(id, rec) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


        var excUrl = $scope.$root.sales + "crm/crm/add-credit-rating-log";
        var post = {};
        post.id = id;
        post.credit_rating = rec.credit_rating.id;
        post.currency_id = rec.currency_id;
        post.token = $scope.$root.token;

        //console.log(post);
        $http
            .post(excUrl, post)
<<<<<<< HEAD
            .then(function (res) {
            });
    }

    $scope.set_link = function () {
=======
            .then(function(res) {});
    }

    $scope.set_link = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if ($scope.rec.web_address != undefined && $scope.rec.web_address.length > 0)
            $scope.rec.web_address = ($scope.rec.web_address.indexOf('://') === -1) ? 'http://' + $scope.rec.web_address : $scope.rec.web_address;
    }

<<<<<<< HEAD
    $scope.deleteCustomer = function () {
=======
    $scope.deleteCustomer = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var delUrl = $scope.$root.sales + "crm/crm/delete-crm";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
        }).then(function (value) {
            $scope.showLoader = true;
            $http
                .post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $scope.showLoader = false;
                        
                        $timeout(function () {
                            $state.go('app.customer')
                        }, 1500);
                    }
                    else {
=======
        }).then(function(value) {
            $scope.showLoader = true;
            $http
                .post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token })
                .then(function(res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $scope.showLoader = false;

                        $timeout(function() {
                            $state.go('app.customer')
                        }, 1500);
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        toaster.pop('error', 'Error', res.data.error);
                        $scope.showLoader = false;
                    }
                });
<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            //console.log('Modal promise rejected. Reason: ', reason);
        });

    };

<<<<<<< HEAD
    

    $scope.convert = function () {
=======


    $scope.convert = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


        ngDialog.openConfirm({
            template: 'app/views/customer/_confirm_convert_modal.html',
            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
        }).then(function (value) {
=======
        }).then(function(value) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


            $scope.product_type = true;
            $scope.count_result = 0;
            var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
            var name = $scope.$root.base64_encode('crm');
            var no = $scope.$root.base64_encode('crm_no');

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
                    'type': '2,3'
<<<<<<< HEAD
                    //'status': '18'
                })
                .then(function (res) {
=======
                        //'status': '18'
                })
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    if (res.data.ack == true) {


                        var convUrl = $scope.$root.sales + "crm/crm/convert";
                        $http
                            .post(convUrl, {
                                id: id,
                                'module': 2,
                                'token': $scope.$root.token,
                                'crm_no': res.data.nubmer,
                                'crm_code': res.data.code
                            })
<<<<<<< HEAD
                            .then(function (res) {
=======
                            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                // $data.splice(index, 1);

                                if (res.data.ack == true) {
                                    $state.go("app.editCrm", { id: id });
                                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(229, ['CRM']));
                                } else
                                    toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(235, ['to CRM']));

<<<<<<< HEAD
                            }).catch(function (message) { 
                                $scope.showLoader = false;
                                
=======
                            }).catch(function(message) {
                                $scope.showLoader = false;

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                throw new Error(message.data);
                                console.log(message.data);
                            });


                    } else {
                        toaster.pop('error', 'info', res.data.error);
                        return false;
                    }
<<<<<<< HEAD
                }).catch(function (message) {
                    $scope.showLoader = false;
                    
=======
                }).catch(function(message) {
                    $scope.showLoader = false;

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    throw new Error(message.data);
                    console.log(message.data);
                });


<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    };


    // sync location  primary record with general start
<<<<<<< HEAD
    $scope.getAltLocationfrmGeneral = function (arr, type) {
=======
    $scope.getAltLocationfrmGeneral = function(arr, type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if (type != undefined) {
            if (arr) {

                $scope.rec.address_1 = $scope.rec.primary_address_1;
                $scope.rec.address_2 = $scope.rec.primary_address_2;
                $scope.rec.city = $scope.rec.primary_city;
                $scope.rec.county = $scope.rec.primary_county;
                $scope.rec.postcode = $scope.rec.primary_postcode;

                $scope.rec.alt_loc_id = $scope.rec.primary_id;


                /* if ($scope.rec.primary_country != undefined && $rootScope.country_type_arr != undefined)
                    $scope.drp.country_id = $scope.$root.get_obj_frm_arry($rootScope.country_type_arr, $scope.rec.primary_country); */

<<<<<<< HEAD
                angular.forEach($rootScope.country_type_arr, function (obj) {
=======
                angular.forEach($rootScope.country_type_arr, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    if ($scope.rec.primary_country > 0) {
                        if (obj.id == $scope.rec.primary_country)
                            $scope.drp.country_id = obj;
<<<<<<< HEAD
                    }
                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (obj.id == $scope.$root.defaultCountry)
                            $scope.drp.country_id = obj;
                    }
                });


                /* if ($scope.rec.primary_is_billing_address == 1)
                    $scope.rec.is_billing_address = 1;
                else $scope.rec.is_billing_address = 0;

                if ($scope.rec.primary_is_invoice_address == 1)
                    $scope.rec.is_invoice_address = 1;
                else $scope.rec.is_invoice_address = 0;

                if ($scope.rec.primary_is_delivery_collection_address == 1)
                    $scope.rec.is_delivery_collection_address = 1;
                else $scope.rec.is_delivery_collection_address = 0; */

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

<<<<<<< HEAD
            }
            else {
=======
            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                $scope.rec.address_1 = null;
                $scope.rec.address_2 = null;
                $scope.rec.city = null;
                $scope.rec.county = null;
                $scope.rec.postcode = null;
                $scope.rec.alt_loc_id = null;

                $scope.rec.is_billing_address = 0;
                $scope.rec.is_delivery_collection_address = 0;
                $scope.rec.is_invoice_address = 0;

<<<<<<< HEAD
                angular.forEach($rootScope.country_type_arr, function (obj) {
=======
                angular.forEach($rootScope.country_type_arr, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id == $scope.$root.defaultCountry)
                        $scope.drp.country_id = obj;
                });
            }
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


            $scope.postData = {
                'value': $scope.$root.crm_id,
                token: $scope.$root.token,
                'module_type': $rootScope.CRMType,
                is_primary: 1
            }

            var ApiAjax = $scope.$root.sales + "crm/crm/alt-depots";
            $http
                .post(ApiAjax, $scope.postData)
<<<<<<< HEAD
                .then(function (alt_res) {
=======
                .then(function(alt_res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (alt_res.data.record.ack == true) {

                        $scope.rec.address_1 = alt_res.data.record.result[0].address_1;
                        $scope.rec.address_2 = alt_res.data.record.result[0].address_2;
                        $scope.rec.city = alt_res.data.record.result[0].city;
                        $scope.rec.county = alt_res.data.record.result[0].county;
                        $scope.rec.postcode = alt_res.data.record.result[0].postcode;

                        $scope.rec.alt_loc_id = alt_res.data.record.result[0].id;


                        if (alt_res.data.record.result[0].primary_country != undefined && $rootScope.country_type_arr != undefined)
                            $scope.drp.country_id = $scope.$root.get_obj_frm_arry($rootScope.country_type_arr, alt_res.data.record.result[0].primary_country);


                        if (alt_res.data.record.result[0].is_billing_address == 1)
                            $scope.rec.is_billing_address = 1;
                        else $scope.rec.is_billing_address = 0;

                        if (alt_res.data.record.result[0].is_delivery_collection_address == 1)
                            $scope.rec.is_delivery_collection_address = 1;
                        else $scope.rec.is_delivery_collection_address = 0;

                        if (alt_res.data.record.result[0].is_invoice_address == 1)
                            $scope.rec.is_invoice_address = 1;
                        else $scope.rec.is_invoice_address = 0;

<<<<<<< HEAD
                    }
                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        $scope.rec.address_1 = null;
                        $scope.rec.address_2 = null;
                        $scope.rec.city = null;
                        $scope.rec.county = null;
                        $scope.rec.postcode = null;
                        $scope.rec.alt_loc_id = null;

                        $scope.rec.is_billing_address = 0;
                        $scope.rec.is_delivery_collection_address = 0;
                        $scope.rec.is_invoice_address = 0;

<<<<<<< HEAD
                        angular.forEach($rootScope.country_type_arr, function (obj) {
=======
                        angular.forEach($rootScope.country_type_arr, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (obj.id == $scope.$root.defaultCountry)
                                $scope.drp.country_id = obj;
                        });
                    }
                });
        }

    }

<<<<<<< HEAD
    $scope.addAltlocationfromGeneral = function (rec) {
=======
    $scope.addAltlocationfromGeneral = function(rec) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var rec2 = {};
        rec2.token = $scope.$root.token;
        rec2.contact_name = rec.contact_person;
        rec2.is_primary = 1;
<<<<<<< HEAD
        rec2.depot = rec.name;//'General Location';
=======
        rec2.depot = rec.name; //'General Location';
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        rec2.role = rec.job_title;
        rec2.phone = rec.phone;
        rec2.email = rec.email;
        rec2.is_primary = 1;
        rec2.is_general = 0;
        rec2.address = rec.address_1;
        rec2.address_2 = rec.address_2;
        rec2.city = rec.city;
        rec2.county = rec.county;
        rec2.postcode = rec.postcode;
        rec2.alt_loc_id = rec.alt_loc_id;
        rec2.crm_id = $scope.$root.crm_id;
        rec2.region_ids = rec.region_ids;
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

        if (angular.element('#general_anonymous_customer').is(':checked') == false)
            rec2.anonymous_customer = 0;
        else rec2.anonymous_customer = 1;

        $scope.addLocdata = rec2;
    }

    $scope.rec.loccaiontiming = {};

<<<<<<< HEAD
    $scope.selectrecordedit_general = function () {

        if ($scope.rec.addcontactslisting !== undefined) {
            angular.forEach($scope.rec.addcontactslisting, function (obj2) {
                angular.forEach($scope.record_data_contact, function (elem) {
=======
    $scope.selectrecordedit_general = function() {

        if ($scope.rec.addcontactslisting !== undefined) {
            angular.forEach($scope.rec.addcontactslisting, function(obj2) {
                angular.forEach($scope.record_data_contact, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (elem.id == obj2.contact_id)
                        obj2.contact_id = elem;
                });
            });
        }
    }

<<<<<<< HEAD
    $scope.add_multicontact_location_dropdown_general = function (location_id, contact_id) {

        var post = {};

        post.crm_id = $rootScope.crm_id;
        post.location_id = location_id;
        post.contact_id = contact_id;
        post.token = $rootScope.token;
        post.module_type = $rootScope.CRMType;

        var postUrl = $rootScope.sales + "crm/crm/add-list-contact-location-general";
        $http
            .post(postUrl, post)
            .then(function (ress) {

            });
    }
    // sync location  primary record with general finish
=======
    $scope.add_multicontact_location_dropdown_general = function(location_id, contact_id) {

            var post = {};

            post.crm_id = $rootScope.crm_id;
            post.location_id = location_id;
            post.contact_id = contact_id;
            post.token = $rootScope.token;
            post.module_type = $rootScope.CRMType;

            var postUrl = $rootScope.sales + "crm/crm/add-list-contact-location-general";
            $http
                .post(postUrl, post)
                .then(function(ress) {

                });
        }
        // sync location  primary record with general finish
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


    // Requests to other controllers
    var args = [];
    args[0] = $scope.$root.crm_id;
    args[1] = undefined;

    // sync contact  primary record with general start
<<<<<<< HEAD
    $scope.getAltContact_genral = function (arr, type) {
=======
    $scope.getAltContact_genral = function(arr, type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


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

                if ($scope.rec.primaryc_pref_method_of_communication != undefined)
                    $scope.drp.cpref_method_of_communication = $scope.$root.get_obj_frm_arry($rootScope.arr_pref_method_comm, $scope.rec.primaryc_pref_method_of_communication);

                /* $scope.rec.csocialmedia1_value = $scope.rec.primaryc_socialmedia1_value;
                $scope.rec.csocialmedia2_value = $scope.rec.primaryc_socialmedia2_value;
                $scope.rec.csocialmedia3_value = $scope.rec.primaryc_socialmedia3_value;
                $scope.rec.csocialmedia4_value = $scope.rec.primaryc_socialmedia4_value;
                $scope.rec.csocialmedia5_value = $scope.rec.primaryc_socialmedia5_value;
                 */

                if ($scope.rec.csocialmedia1_value != "" || $scope.rec.csocialmedia2_value != "" || $scope.rec.csocialmedia3_value != "" || $scope.rec.csocialmedia4_value != "" || $scope.rec.csocialmedia5_value != "")
                    $scope.rec.primaryConSocialMediaCollapse = false;
                else
                    $scope.rec.primaryConSocialMediaCollapse = true;

                /* 
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
                });
                */

                $scope.tempContactSocialMedia = [];
<<<<<<< HEAD
                angular.forEach($rootScope.social_medias_contact_form, function (obj) {
=======
                angular.forEach($rootScope.social_medias_contact_form, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

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
                    $scope.socialMediasContactGeneral['primaryContactSM'] = $scope.tempContactSocialMedia;
                }
<<<<<<< HEAD
            }
            else {
=======
            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            $scope.postData = {
                'crm_id': $scope.$root.crm_id,
                'module_type': $rootScope.CRMType,
                token: $scope.$root.token,
                is_primary: 1
            }

            var ApiAjax = $scope.$root.sales + "crm/crm/get-alt-contacts-list";
            $http
                .post(ApiAjax, $scope.postData)
<<<<<<< HEAD
                .then(function (alt_res) {
=======
                .then(function(alt_res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

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

<<<<<<< HEAD
                            angular.forEach($rootScope.arr_pref_method_comm, function (elem) {
=======
                            angular.forEach($rootScope.arr_pref_method_comm, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (elem.id == alt_res.data.response[0].pref_method_of_communication) {
                                    $scope.drp.cpref_method_of_communication = elem;
                                }
                            });
                        }

                        $scope.rec.csocialmedia1_value = alt_res.data.response[0].socialmedia1_value;
                        $scope.rec.csocialmedia2_value = alt_res.data.response[0].socialmedia2_value;
                        $scope.rec.csocialmedia3_value = alt_res.data.response[0].socialmedia3_value;
                        $scope.rec.csocialmedia4_value = alt_res.data.response[0].socialmedia4_value;
                        $scope.rec.csocialmedia5_value = alt_res.data.response[0].socialmedia5_value;

<<<<<<< HEAD
                        angular.forEach($rootScope.social_medias, function (elem) {
=======
                        angular.forEach($rootScope.social_medias, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

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

<<<<<<< HEAD
                    }
                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

<<<<<<< HEAD
    $scope.add_alt_contact = function (rec) {
=======
    $scope.add_alt_contact = function(rec) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var rec2 = {};
        rec2.token = $scope.$root.token;
        rec2.module_type = $rootScope.CRMType;

        rec2.alt_contact_id = rec.alt_contact_id;
        rec2.crm_id = $scope.$root.crm_id;
        rec2.contact_name = rec.contact_person;
        rec2.is_primary = 1;
<<<<<<< HEAD
        rec2.depot = $scope.rec.contact_person;//Main office';
=======
        rec2.depot = $scope.rec.contact_person; //Main office';
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        rec2.job_title = $scope.rec.cjob_title;
        rec2.direct_line = $scope.rec.cdirect_line;
        rec2.mobile = $scope.rec.cmobile;
        rec2.email = $scope.rec.cemail;
        rec2.phone = $scope.rec.cphone;
        rec2.fax = $scope.rec.cfax;
        rec2.booking_instructions = $scope.rec.cbooking_instructions;
        rec2.notes = rec.primaryc_notes;

        rec2.pref_method_of_communication = ($scope.drp.cpref_method_of_communication != undefined && $scope.drp.cpref_method_of_communication != '') ? $scope.drp.cpref_method_of_communication.id : 0;

        /* rec2.socialmedia1s = rec.csocialmedia1 != undefined ? rec.csocialmedia1.id : 0;
        rec2.socialmedia2s = rec.csocialmedia2 != undefined ? rec.csocialmedia2.id : 0;
        rec2.socialmedia3s = rec.csocialmedia3 != undefined ? rec.csocialmedia3.id : 0;
        rec2.socialmedia4s = rec.csocialmedia4 != undefined ? rec.csocialmedia4.id : 0;
        rec2.socialmedia5s = rec.csocialmedia5 != undefined ? rec.csocialmedia5.id : 0;

        rec2.socialmedia1_value = rec.csocialmedia1_value;
        rec2.socialmedia2_value = rec.csocialmedia2_value;
        rec2.socialmedia3_value = rec.csocialmedia3_value;
        rec2.socialmedia4_value = rec.csocialmedia4_value;
        rec2.socialmedia5_value = rec.csocialmedia5_value; */

        rec2.social_media_arr_contact = $scope.socialMediasContactGeneral.primaryContactSM;

        $scope.addContactData = rec2;
    }


    // sync contact  primary record with general end


<<<<<<< HEAD
    $scope.add_credit_limit_history = function (id, rec) {
=======
    $scope.add_credit_limit_history = function(id, rec) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var excUrl = $scope.$root.sales + "crm/crm/add-credit-limit-log";
        var post = {};
        post.id = id;
        post.credit_limit = rec.credit_rating;
        post.currency_id = rec.currency_id;
        post.token = $scope.$root.token;
        $http
            .post(excUrl, post)
<<<<<<< HEAD
            .then(function (res) {
            });
    }

    $scope.add_status_history = function (id, rec) {
=======
            .then(function(res) {});
    }

    $scope.add_status_history = function(id, rec) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var excUrl = $scope.$root.sales + "crm/crm/add-status-log";
        var post = {};
        post.id = id;
        post.status_id = rec.status;
        post.token = $scope.$root.token;
        $http
            .post(excUrl, post)
<<<<<<< HEAD
            .then(function (res) {
            });
=======
            .then(function(res) {});
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    }


    /////////////// CRM Social Media ////////////////////


    //$scope.rec.social_mediascrm = {};

    if ($stateParams.id == undefined)
        $scope.rec.social_mediascrm = [{ id: '' }];


    $scope.crm_social_medias = [];
    $scope.columns_crm_social = [];
    $scope.crmMediaForm = {};
    $scope.socialForm = {};


    //////// Alt-Contact Social Media////////


    $scope.rec.social_mediasconatctcrm = {};
    $scope.columns_crm_socialcontact = [];

    if ($stateParams.id == undefined)
        $scope.rec.social_mediasconatctcrm = [{ id: '' }];

    ////////// End Alt. Contact Social Media//


    //general tab bucket
<<<<<<< HEAD
    $scope.getbucketList_signle = function () {
=======
    $scope.getbucketList_signle = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.columns_bucket = [];
        $scope.record_bucket = {};
        $scope.rec.token = $scope.$root.token;
        //$scope.rec.bucket_id = id;
        $scope.title = 'Sales bucket';
        var bucketApi = $scope.$root.sales + "customer/sale-bucket/get-sale-bucket-customize-list";
        $http
            .post(bucketApi, postData)

<<<<<<< HEAD
            .then(function (res) {

                $scope.record_bucket = res.data.response;
                angular.forEach(res.data.response[0], function (val, index) {
                    $scope.columns_bucket.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                });
            });
=======
        .then(function(res) {

            $scope.record_bucket = res.data.response;
            angular.forEach(res.data.response[0], function(val, index) {
                $scope.columns_bucket.push({
                    'title': toTitleCase(index),
                    'field': index,
                    'visible': true
                });
            });
        });
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        ngDialog.openConfirm({
            template: 'modalBucketDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
<<<<<<< HEAD
        }).then(function (result) {

            angular.forEach(result, function (elem) {
=======
        }).then(function(result) {

            angular.forEach(result, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (index == 'Code')
                    $scope.rec.code = elem;

                if (index == 'Name') {
                    $scope.rec.name = elem;
                    $scope.rec.bucket_id = result.id;
                }


            });
            $scope.rec.bucket_id = result.id;
            $scope.rec.bucket = result.name;
            ////console.log(result.id+"-"+result.name);

<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.bucket_selected_array = [];
    $scope.bucket_array = [];
    $scope.isBucketChanged = true;

<<<<<<< HEAD
    $scope.getbucket_array = function (isShow) {
=======
    $scope.getbucket_array = function(isShow) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.title = 'Bucket';
        $scope.columns = [];
        $scope.bucket_array = [];

        var bucketApi = $scope.$root.sales + "customer/sale-bucket/get-sale-bucket-list";

        $http
<<<<<<< HEAD
            .post(bucketApi, { 'token': $scope.$root.token }).then(function (res) {
                if (res.data.ack == true) {

                    angular.forEach(res.data.response, function (obj) {
                        obj.chk = false;
                        obj.isPrimary = false;
                        if ($scope.bucket_selected_array.length > 0) {
                            angular.forEach($scope.bucket_selected_array, function (obj2) {
=======
            .post(bucketApi, { 'token': $scope.$root.token }).then(function(res) {
                if (res.data.ack == true) {

                    angular.forEach(res.data.response, function(obj) {
                        obj.chk = false;
                        obj.isPrimary = false;
                        if ($scope.bucket_selected_array.length > 0) {
                            angular.forEach($scope.bucket_selected_array, function(obj2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (obj.id == obj2.id) {
                                    obj.chk = true;
                                    if (obj2.isPrimary)
                                        obj.isPrimary = true;
                                }
                            });
                        }
                        $scope.bucket_array.push(obj);
                    });

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (index != 'chk' && index != 'id' && index != 'isPrimary') {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }
                    });

                    if (!isShow)
                        angular.element('#Bucket_selectedModal').modal({ show: true });
<<<<<<< HEAD
                }
                else toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
=======
                } else toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.showLoader = false;
            });
    }

<<<<<<< HEAD
    $scope.submitPendingSelBucket = function () {
=======
    $scope.submitPendingSelBucket = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.PendingSelBucket = [];
        $scope.PendingSelBucketTooltip = "";
        var isPrimary = false;
        //console.log($scope.bucket_array);

        for (var i = 0; i < $scope.bucket_array.length; i++) {
            //console.log($scope.bucket_array[i]);
            if ($scope.bucket_array[i].chk == true) {
                $scope.PendingSelBucket.push($scope.bucket_array[i]);
                $scope.PendingSelBucketTooltip = $scope.PendingSelBucketTooltip + $scope.bucket_array[i].name + "; ";
            }
        }
        $scope.PendingSelBucketTooltip = $scope.PendingSelBucketTooltip.slice(0, -2);

        $scope.bucket_selected_array = $scope.PendingSelBucket;
        $scope.SelBucketTooltip = $scope.PendingSelBucketTooltip;

        toaster.pop('warning', 'Info', "The Bucket list has Updated now. Please select Saleperson(s) again.");
        $scope.selectedSalespersons = [];
        $scope.SelSalePerGenTooltip = '';

        angular.element('#Bucket_selectedModal').modal('hide');
    }

<<<<<<< HEAD
    $scope.clearPendingSelBucket = function () {
=======
    $scope.clearPendingSelBucket = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.PendingSelBucket = [];
        $scope.PendingSelBucketTooltip = "";
        angular.element('#Bucket_selectedModal').modal('hide');
    }

<<<<<<< HEAD
    $scope.checkAllBucket = function (val) {
=======
    $scope.checkAllBucket = function(val) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.PendingSelBucket = [];

        if (val == true) {

            $scope.isBucketChanged = true;
            var isPrimary = false;

            for (var i = 0; i < $scope.bucket_array.length; i++) {
                if ($scope.bucket_array[i].isPrimary)
                    isPrimary = true;
                $scope.bucket_array[i].chk = true;
                $scope.PendingSelBucket.push($scope.bucket_array[i]);
            }
            if (!isPrimary) {
                $scope.bucket_array[0].isPrimary = true;
                $scope.PendingSelBucket[0].isPrimary = true;
            }

        } else {
            for (var i = 0; i < $scope.bucket_array.length; i++) {
                $scope.bucket_array[i].chk = false;
                $scope.bucket_array[i].isPrimary = false;
            }
            $scope.PendingSelBucket = [];
        }
    }

<<<<<<< HEAD
    $scope.selectbucket_chk = function (bucket) {
=======
    $scope.selectbucket_chk = function(bucket) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.isBucketChanged = true;
        $scope.selectedAll = false;

        for (var i = 0; i < $scope.bucket_array.length; i++) {

            if (bucket.id == $scope.bucket_array[i].id) {

                if ($scope.bucket_array[i].chk == true)
                    $scope.bucket_array[i].chk = false;
                else
                    $scope.bucket_array[i].chk = true;
            }
        }
    }

<<<<<<< HEAD
    $scope.getbucket_array_edit = function (id, bucket_id) {
=======
    $scope.getbucket_array_edit = function(id, bucket_id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var bucketApi = $scope.$root.sales + "customer/sale-bucket/get-crm-bucket";
        $http
            .post(bucketApi, { module_id: id, 'token': $scope.$root.token, 'type': 1 })
<<<<<<< HEAD
            .then(function (emp_data) {

                if (emp_data.data.ack == true) {

                    $scope.$root.$apply(function () {

                        angular.forEach($scope.bucket_array, function (obj) {
                            obj.chk = false;
                            obj.isPrimary = false;

                            angular.forEach(emp_data.data.response, function (obj2) {
=======
            .then(function(emp_data) {

                if (emp_data.data.ack == true) {

                    $scope.$root.$apply(function() {

                        angular.forEach($scope.bucket_array, function(obj) {
                            obj.chk = false;
                            obj.isPrimary = false;

                            angular.forEach(emp_data.data.response, function(obj2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (obj.id == obj2.bucket_id) {
                                    obj.chk = true;

                                    if (obj2.is_primary == 1)
                                        obj.isPrimary = true;

                                    $scope.bucket_selected_array.push(obj);
                                }
                            });
                            //  $scope.bucket_array.push(obj);
                        });
                        $scope.getSalePersons(1);
                        $scope.getSalePersons_edit(id);
                    });
                }
            });
    }

<<<<<<< HEAD
    $scope.add_bucket = function (id) {
=======
    $scope.add_bucket = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var check = false;
        var bucketApi = $scope.$root.sales + "customer/sale-bucket/add-crm-bucket";
        var post = {};
        var temp = [];

<<<<<<< HEAD
        angular.forEach($scope.bucket_selected_array, function (obj) {
=======
        angular.forEach($scope.bucket_selected_array, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            temp.push({ bucket_id: obj.id, isPrimary: obj.isPrimary });
        });

        post.type = 1;
        post.module_id = id;
        post.salesbucket = temp;
        post.token = $scope.$root.token;
        $http
            .post(bucketApi, post)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true)
                    check = true;
            });
        return check;
    }

    $scope.selct_from_oop = false;
    //general tab salesperson
    $scope.PendingSelectedSpGeneral = [];
    $scope.PendingSelSalePerGenTooltip = "";

<<<<<<< HEAD
    $scope.submitPendingSelectedSpGeneral = function () {
=======
    $scope.submitPendingSelectedSpGeneral = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.PendingSelectedSpGeneral = [];
        $scope.PendingSelSalePerGenTooltip = "";
        var isPrimary = false;
        var isPrimary_flag = false;

        for (var i = 0; i < $scope.SalesPersonGen_arr.length; i++) {

            if ($scope.SalesPersonGen_arr[i].isPrimary)
                isPrimary_flag = true;

            if ($scope.SalesPersonGen_arr[i].chk == true) {
                $scope.PendingSelectedSpGeneral.push($scope.SalesPersonGen_arr[i]);
                $scope.PendingSelSalePerGenTooltip = $scope.PendingSelSalePerGenTooltip + $scope.SalesPersonGen_arr[i].name + "; ";
            }

        }
        if (isPrimary_flag == false) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(236, ['Primary']));
            return false;
        }



        $scope.PendingSelSalePerGenTooltip = $scope.PendingSelSalePerGenTooltip.slice(0, -2);

        $scope.selectedSalespersons = $scope.PendingSelectedSpGeneral;
        $scope.SelSalePerGenTooltip = $scope.PendingSelSalePerGenTooltip;

        angular.element('#_CRMSalepersonModal').modal('hide');
    }

<<<<<<< HEAD
    $scope.clearPendingSelectedSpGeneral = function () {
=======
    $scope.clearPendingSelectedSpGeneral = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.PendingSelectedSpGeneral = [];
        $scope.PendingSelSalePerGenTooltip = "";
        angular.element('#_CRMSalepersonModal').modal('hide');
    }

<<<<<<< HEAD
    $scope.ClearSalesPerGenFilter = function () {
        $scope.searchKeyword_SalePersons = {};
    }
    $scope.getSalePersons_general = function (isShow) {
=======
    $scope.ClearSalesPerGenFilter = function() {
        $scope.searchKeyword_SalePersons = {};
    }
    $scope.getSalePersons_general = function(isShow) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        /* if (isShow == 0 && $scope.bucket_selected_array.length == 0) {
           
            return;
        } */
        $scope.title = 'Salesperson';
        $scope.columns_sp = [];
        $scope.record = {};
        $scope.searchKeyword_SalePersons = {};
        //console.log($scope.bucket_selected_array.length);

        if ($scope.bucket_selected_array.length > 0) {

            /* start  */

            var BucpostUrl = $scope.$root.sales + "customer/sale-bucket/get-sales-person-bucket";

            var BucpostData = {
                'bucket_selected_array': $scope.bucket_selected_array,
                'module_id': $scope.rec.id,
                'token': $scope.$root.token
            };

            $http
                .post(BucpostUrl, BucpostData)
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        var ids = 0;
                        var ids2 = 0;
                        $scope.SalesPersonGen_arr = [];

<<<<<<< HEAD
                        angular.forEach(res.data.response, function (obj) {
=======
                        angular.forEach(res.data.response, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            ids = obj.id.split('.')[0];
                            obj.chk = false;
                            obj.isPrimary = false;

                            if ($scope.selectedSalespersons.length > 0) {

<<<<<<< HEAD
                                angular.forEach($scope.selectedSalespersons, function (obj2) {
=======
                                angular.forEach($scope.selectedSalespersons, function(obj2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    ids2 = obj2.id.split('.')[0];
                                    if (ids == ids2 || $scope.selct_from_oop) {
                                        obj.chk = true;
                                        if (obj2.isPrimary)
                                            obj.isPrimary = true;
                                    }
                                });
                            }
                            $scope.SalesPersonGen_arr.push(obj);
                        });

                        // $scope.SalesPersonGen_arr = res.data.response;
                        $scope.record = $scope.SalesPersonGen_arr;

<<<<<<< HEAD
                        angular.forEach(res.data.response[0], function (val, index) {
=======
                        angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (index != 'chk' && index != 'id') {
                                $scope.columns_sp.push({
                                    'title': toTitleCase(index),
                                    'field': index,
                                    'visible': true
                                });
                            }
                        });

<<<<<<< HEAD
                    }
                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        var ids = 0;
                        var ids2 = 0;
                        $scope.SalesPersonGen_arr = [];

<<<<<<< HEAD
                        angular.forEach($rootScope.salesperson_arr, function (obj) {
=======
                        angular.forEach($rootScope.salesperson_arr, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            ids = obj.id.split('.')[0];
                            obj.chk = false;
                            obj.isPrimary = false;

                            if ($scope.selectedSalespersons.length > 0) {

<<<<<<< HEAD
                                angular.forEach($scope.selectedSalespersons, function (obj2) {
=======
                                angular.forEach($scope.selectedSalespersons, function(obj2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    ids2 = obj2.id.split('.')[0];
                                    if (ids == ids2 || $scope.selct_from_oop) {
                                        obj.chk = true;
                                        if (obj2.isPrimary)
                                            obj.isPrimary = true;
                                    }
                                });
                            }
                            $scope.SalesPersonGen_arr.push(obj);
                        });

                        // $scope.SalesPersonGen_arr = $rootScope.salesperson_arr;
                        $scope.record = $scope.SalesPersonGen_arr;


<<<<<<< HEAD
                        angular.forEach($rootScope.salesperson_arr[0], function (val, index) {
=======
                        angular.forEach($rootScope.salesperson_arr[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.columns_sp.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
                    }
                });

            /* end  */


<<<<<<< HEAD
        }
        else {

            $scope.SalesPersonGen_arr = $rootScope.salesperson_arr;
            $scope.record = $scope.SalesPersonGen_arr;
            angular.forEach($rootScope.salesperson_arr[0], function (val, index) {
=======
        } else {

            $scope.SalesPersonGen_arr = $rootScope.salesperson_arr;
            $scope.record = $scope.SalesPersonGen_arr;
            angular.forEach($rootScope.salesperson_arr[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.columns_sp.push({
                    'title': toTitleCase(index),
                    'field': index,
                    'visible': true
                });
            });

        }


        angular.element('#_CRMSalepersonModal').modal({ show: true });
        return;
    }

    $scope.columns_sp = [];
    $scope.selectedSalespersons = [];


<<<<<<< HEAD
    $scope.selectSaleperson_general = function (sp, isPrimary) {
=======
    $scope.selectSaleperson_general = function(sp, isPrimary) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.isSalePerersonChanged = true;
        $scope.selectedAll = false;

        // console.log(sp);

        for (var i = 0; i < $scope.SalesPersonGen_arr.length; i++) {

            if (isPrimary == 1)
                $scope.SalesPersonGen_arr[i].isPrimary = false;

            if (sp.id == $scope.SalesPersonGen_arr[i].id) {

                if ($scope.SalesPersonGen_arr[i].chk == true && isPrimary == 0) {

                    $scope.SalesPersonGen_arr[i].chk = false;
                    $scope.SalesPersonGen_arr[i].isPrimary = false;

                } else {
                    // || $scope.selectedSalespersons.length == 0
                    if (isPrimary == 1)
                        $scope.SalesPersonGen_arr[i].isPrimary = true;

                    $scope.SalesPersonGen_arr[i].chk = true;
                }
            }
        }
        // console.log($scope.PendingSelectedSpGeneral);
    }

<<<<<<< HEAD
    $scope.checkAllSalesperson = function (val) {
=======
    $scope.checkAllSalesperson = function(val) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.PendingSelectedSpGeneral = [];

        if (val == true) {

            $scope.isSalePerersonChanged = true;
            var isPrimary = false;

            for (var i = 0; i < $scope.SalesPersonGen_arr.length; i++) {
                if ($scope.SalesPersonGen_arr[i].isPrimary)
                    isPrimary = true;

                $scope.SalesPersonGen_arr[i].chk = true;
                $scope.PendingSelectedSpGeneral.push($scope.SalesPersonGen_arr[i]);
            }

            if (!isPrimary) {
                $scope.SalesPersonGen_arr[0].isPrimary = true;
                $scope.PendingSelectedSpGeneral[0].isPrimary = true;
            }

        } else {
            for (var i = 0; i < $scope.SalesPersonGen_arr.length; i++) {
                $scope.SalesPersonGen_arr[i].chk = false;
                $scope.SalesPersonGen_arr[i].isPrimary = false;
            }
            $scope.PendingSelectedSpGeneral = [];
        }
    }


    // END of Customer General Page

<<<<<<< HEAD
    $scope.getSalePersons_edit = function (id) {
=======
    $scope.getSalePersons_edit = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var salepersonUrl = $scope.$root.sales + "crm/crm/get-crm-salesperson";
        $http
            .post(salepersonUrl, { id: id, 'token': $scope.$root.token, 'type': 2 })
<<<<<<< HEAD
            .then(function (emp_data) {

                if (emp_data.data.ack == true) {

                    $scope.$root.$apply(function () {
                        var ids = 0;
                        angular.forEach($scope.salepersons, function (obj) {
=======
            .then(function(emp_data) {

                if (emp_data.data.ack == true) {

                    $scope.$root.$apply(function() {
                        var ids = 0;
                        angular.forEach($scope.salepersons, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            ids = obj.id.split('.')[0];
                            obj.chk = false;
                            obj.isPrimary = false;

<<<<<<< HEAD
                            angular.forEach(emp_data.data.response, function (obj2) {
=======
                            angular.forEach(emp_data.data.response, function(obj2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (ids == obj2.salesperson_id) {
                                    obj.chk = true;
                                    if (obj2.is_primary == 1)
                                        obj.isPrimary = true;
                                    $scope.selectedSalespersons.push(obj);
                                }
                            });
                            //  $scope.salepersons.push(obj);
                        });
                    });
                }
            });
    }

<<<<<<< HEAD
    $scope.add_salespersons = function (id, type) {
=======
    $scope.add_salespersons = function(id, type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var check = false;
        var excUrl = $scope.$root.sales + "crm/crm/add-crm-salesperson";
        var post = {};
        var temp = [];

<<<<<<< HEAD
        angular.forEach($scope.selectedSalespersons, function (obj) {
=======
        angular.forEach($scope.selectedSalespersons, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (obj.chk)
                temp.push({ id: obj.id, isPrimary: obj.isPrimary, bucket_id: obj.bucket_id });
        });

        post.type = type;
        // post.bucket_id = $scope.rec.bucket_id;
        post.id = id;
        post.salespersons = temp;
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
                }
            });
        return check;
    }

<<<<<<< HEAD
    $scope.add_salespersons_history = function (id) {
=======
    $scope.add_salespersons_history = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var excUrl = $scope.$root.sales + "crm/crm/add-crm-salesperson-log";
        var post = {};
        var temp = [];

<<<<<<< HEAD
        angular.forEach($scope.selectedSalespersons, function (obj) {
=======
        angular.forEach($scope.selectedSalespersons, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            temp.push({ id: obj.id, isPrimary: obj.isPrimary });
        });

        post.type = 2;
        post.id = id;
        post.salespersons = temp;
        post.token = $scope.$root.token;
        $http.post(excUrl, post)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                //$scope.add_salespersons_log(id);
            });
    }


    $scope.isBtnPredefined = false;
<<<<<<< HEAD
    $scope.checkPredefinedValue = function (val) {
=======
    $scope.checkPredefinedValue = function(val) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (!angular.isString(val)) {
            $scope.isBtnPredefined = false;
        } else {
            var value = val.replace(/^\s+|\s+$/g, '');
            if (value !== '')
                $scope.isBtnPredefined = true;
            else
                $scope.isBtnPredefined = false;
        }
    }

<<<<<<< HEAD
    $scope.addNewPredefinedPopup = function (drpdown, type, title, drp) {
=======
    $scope.addNewPredefinedPopup = function(drpdown, type, title, drp) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        return;
    }


<<<<<<< HEAD
    $scope.addNewCurrencyPopup = function (drp) {
=======
    $scope.addNewCurrencyPopup = function(drp) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var id = drp.currency != undefined ? drp.currency.id : 0;
        if (id > 0)
            return false;
        $scope.fnDatePicker();
        $scope.currency = {};
        ngDialog.openConfirm({
            template: 'app/views/company/add_new_currency.html',
            className: 'ngdialog-theme-default-custom-large',
            scope: $scope
<<<<<<< HEAD
        }).then(function (currency) {
=======
        }).then(function(currency) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            var addCurrencyUrl = $scope.$root.setup + "general/add-currency";
            currency.token = $scope.$root.token;
            currency.company_id = $scope.$root.defaultCompany;
            currency.status = $scope.currency.c_status !== undefined ? $scope.currency.c_status.value : 0;
            $http
                .post(addCurrencyUrl, currency)
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', res.data.msg);
                        var currencyUrl = $scope.$root.setup + "general/currency-list";
                        $http
                            .post(currencyUrl, {
                                'company_id': $scope.$root.defaultCompany,
                                'token': $scope.$root.token
                            })
<<<<<<< HEAD
                            .then(function (res1) {
=======
                            .then(function(res1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (res1.data.ack == true) {
                                    //   $scope.$root.$apply(function () {
                                    $rootScope.arr_currency = res1.data.response;
                                    $rootScope.arr_currency.push({ 'id': '-1', 'name': '++ Add New ++' });

<<<<<<< HEAD
                                    angular.forEach($rootScope.arr_currency, function (elem) {
=======
                                    angular.forEach($rootScope.arr_currency, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        if (elem.id == res.data.id)
                                            drp.currency = elem;
                                    });
                                }
                            });
                    } else if (res.data.ack == false) {
                        toaster.pop('warning', 'Info', res.data.msg);
                    } else
                        toaster.pop('warning', 'Info', res.data.msg);
                });
<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    }

<<<<<<< HEAD
    $scope.addNewPaymentTerm = function (drpdown, type, title, drp) {
=======
    $scope.addNewPaymentTerm = function(drpdown, type, title, drp) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var id = drpdown.id;
        if (Number(id) > 0 || Number(id) == 0)
            return false;
        else {
            $scope.popup_title = title;
            $scope.pedefined = {};

            ngDialog.openConfirm({
                template: 'app/views/payment_terms/add_payment_term.html',
                className: 'ngdialog-theme-default',
                scope: $scope
<<<<<<< HEAD
            }).then(function (pedefined) {
=======
            }).then(function(pedefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                /*//console.log(pedefined);
                 return false;*/

                pedefined.token = $scope.$root.token;
                var postUrl = $scope.$root.setup + "crm/add-payment-term";

                $http
                    .post(postUrl, pedefined)
<<<<<<< HEAD
                    .then(function (ress) {
=======
                    .then(function(ress) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (ress.data.ack == true) {
                            toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                            var constUrl = $scope.$root.setup + "crm/payment-terms";

                            $http
                                .post(constUrl, { 'token': $scope.$root.token, 'all': 1 })
<<<<<<< HEAD
                                .then(function (res) {
                                    $rootScope.arr_payment_terms = res.data.response;
                                    $rootScope.arr_payment_terms.push({ 'id': '-1', 'Description': '++ Add New ++' });

                                    angular.forEach($rootScope.arr_payment_terms, function (elem) {
=======
                                .then(function(res) {
                                    $rootScope.arr_payment_terms = res.data.response;
                                    $rootScope.arr_payment_terms.push({ 'id': '-1', 'Description': '++ Add New ++' });

                                    angular.forEach($rootScope.arr_payment_terms, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        if (elem.id == ress.data.id)
                                            drp.payment_terms_ids = elem;
                                    });
                                });
<<<<<<< HEAD
                        }
                        else {
=======
                        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            toaster.pop('error', 'Info', ress.data.error);
                            drp.payment_terms_ids = '';
                        }
                    });


<<<<<<< HEAD
            }, function (reason) {
=======
            }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                //console.log('Modal promise rejected. Reason: ', reason);
                drp.payment_terms_ids = '';
            });
        }
    }

<<<<<<< HEAD
    $scope.addNewPaymentMethod = function (drpdown, type, title, drp) {
=======
    $scope.addNewPaymentMethod = function(drpdown, type, title, drp) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var id = drpdown.id;
        if (Number(id) > 0 || Number(id) == 0)
            return false;
        else {
            $scope.popup_title = title;
            $scope.pedefined = {};

            ngDialog.openConfirm({
                template: 'app/views/payment_methods/add_payment_method.html',
                className: 'ngdialog-theme-default',
                scope: $scope
<<<<<<< HEAD
            }).then(function (pedefined) {
=======
            }).then(function(pedefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                /*//console.log(pedefined);
                 return false;*/

                pedefined.token = $scope.$root.token;
                var postUrl = $scope.$root.setup + "crm/add-payment-method";

                $http
                    .post(postUrl, pedefined)
<<<<<<< HEAD
                    .then(function (ress) {
=======
                    .then(function(ress) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (ress.data.ack == true) {
                            toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                            var constUrl = $scope.$root.setup + "crm/payment-methods";

                            $http
                                .post(constUrl, { 'token': $scope.$root.token, 'all': 1 })
<<<<<<< HEAD
                                .then(function (res) {
                                    $rootScope.arr_payment_methods = res.data.response;
                                    $rootScope.arr_payment_methods.push({ 'id': '-1', 'Description': '++ Add New ++' });

                                    angular.forEach($rootScope.arr_payment_methods, function (elem) {
=======
                                .then(function(res) {
                                    $rootScope.arr_payment_methods = res.data.response;
                                    $rootScope.arr_payment_methods.push({ 'id': '-1', 'Description': '++ Add New ++' });

                                    angular.forEach($rootScope.arr_payment_methods, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        if (elem.id == ress.data.id)
                                            drp.payment_method_ids = elem;
                                    });
                                });
<<<<<<< HEAD
                        }
                        else {
=======
                        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            toaster.pop('error', 'Info', ress.data.error);
                            drp.payment_method_ids = '';
                        }
                    });


<<<<<<< HEAD
            }, function (reason) {
=======
            }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                drp.payment_method_ids = '';
                //console.log('Modal promise rejected. Reason: ', reason);
            });
        }
    }

<<<<<<< HEAD
    $scope.confirm = function (btc) {
=======
    $scope.confirm = function(btc) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.recfinance.bill_to_customer = btc.name;
        $scope.recfinance.bill_to_customer_id = btc.id;
        ////console.log($scope.recfinance.bill_to_customer_name +"- "+$scope.recfinance.bill_to_customer);
        angular.element('#model_Bill_Finance_Customer').modal('hide');
    }


    //////////Customer Finance//

    $scope.constants = [];
    $scope.customer = [];
    $scope.general = [];
    // $rootScope.arr_payment_methods= [];
    // $rootScope.arr_payment_terms = [];
    $scope.generate = [];

<<<<<<< HEAD
    $scope.gotoEdit = function () {
=======
    $scope.gotoEdit = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.check_readonly = false;
    }

    $scope.type_id = 0;
<<<<<<< HEAD
    $scope.getpurchaseGL = function (arg) {
        $scope.category_list = [];
=======
    $scope.getpurchaseGL = function(arg) {
        $scope.category_list = [];
        $scope.postData = {};
        $scope.postData.cat_id = [];

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (arg == 'saleperson') {
            $scope.type_id = 1;
            $scope.title = 'GL Sales Account';
            //var cat_id = 13;
            //var cat_id = 4;
            $scope.postData.cat_id = [4];
        }
        if (arg == 'sale') {
            $scope.type_id = 2;
            $scope.title = 'GL Account Receivable';
            //var cat_id = 2;
            // var cat_id = 1;
            $scope.postData.cat_id = [1];
        }

        $scope.postData.token = $scope.$root.token;

<<<<<<< HEAD
        var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";//{'token': $scope.$root.token, cat_id: cat_id}
        $http
            .post(postUrl_cat, $scope.postData)
            .then(function (res) {
                if (res.data.ack == true)
                    $scope.category_list = res.data.response;//response_account;
=======
        var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name"; //{'token': $scope.$root.token, cat_id: cat_id}
        $http
            .post(postUrl_cat, $scope.postData)
            .then(function(res) {
                if (res.data.ack == true)
                    $scope.category_list = res.data.response; //response_account;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                else
                    $scope.category_list = [];
            });
        angular.element('#financePurchase').modal({ show: true });
    };

<<<<<<< HEAD
    $scope.assignCodes = function (gl_data) {
=======
    $scope.getGLcode = function() {

        var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";
        $scope.postData = {};
        $scope.title = 'G/L Accounts';
        $scope.postData.token = $scope.$root.token;
        $scope.searchKeyword2 = {};

        $scope.type_id = 2;

        $scope.showLoader = true;
        $scope.showAllOption = true;

        $http
            .post(postUrl_cat, $scope.postData)
            .then(function(res) {
                $scope.gl_account = [];
                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.gl_account = res.data.response;
                    angular.element('#finance_set_gl_account').modal({ show: true });
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });
    }

    $scope.assignCodes = function(gl_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        /*if ($scope.type_id == 1) {
         $scope.recfinance.purchase_code_number = number;
         } else {
         $scope.recfinance.account_payable_number = number;
         }*/

        if ($scope.type_id == 1) {

<<<<<<< HEAD
            $scope.recfinance.purchase_code_number = gl_data.name + " " + gl_data.code;
=======
            $scope.recfinance.purchase_code_number = gl_data.code + " - " + gl_data.name; //gl_data.name + " " + gl_data.code;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.recfinance.purchase_code_id = gl_data.id;

        } else if ($scope.type_id == 2) {

<<<<<<< HEAD
            $scope.recfinance.account_payable_number = gl_data.name + " " + gl_data.code;
            $scope.recfinance.account_payable_id = gl_data.id;
        }
        angular.element('#financePurchase').modal('hide');
=======
            $scope.recfinance.account_payable_number = gl_data.code + " - " + gl_data.name;
            $scope.recfinance.account_payable_id = gl_data.id;
        }
        angular.element('#financePurchase').modal('hide');
        angular.element('#finance_set_gl_account').modal('hide');
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    };


    $scope.columns_customer = [];
    $scope.result = {};
<<<<<<< HEAD
    $scope.getCustomers = function () {
=======
    $scope.getCustomers = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.title = 'Customers';

        var custUrl = $scope.$root.sales + "customer/customer/listings";
        var custUrl2 = $scope.$root.sales + "customer/customer/check-customer-limit";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
            'more_fields': "currency_id*credit_limit*address_2*fax*email*city*county*postcode*phone"
        };
        $http
            .post(custUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    /* $scope.columns_customer = [];
                     $scope.result = {};*/

                    $scope.result = res.data.response;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columns_customer.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.element('#model_Bill_Finance_Customer').modal({ show: true });

<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    //console.log('dd');
                    $scope.columns = [];
                    $scope.result = [];
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            });

    }

<<<<<<< HEAD
    $scope.getCharges = function (arg) {
=======
    $scope.getCharges = function(arg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var postData = "";
        if (arg == 'finance')
            var getChargesUrl = $scope.$root.setup + "crm/finance-charges";
        else
            var getChargesUrl = $scope.$root.setup + "crm/insurance-charges";
        postData = {
            'token': $scope.$root.token,
            'all': "1",
        };
        $http
            .post(getChargesUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                //$scope.columns = [];
                //$scope.columns = res.data.columns;
                $scope.record = res.data.response;


<<<<<<< HEAD
                angular.forEach(res.data.response[0], function (val, index) {
=======
                angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.columns.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                });


            });

        ngDialog.openConfirm({
            template: 'modalCustDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
<<<<<<< HEAD
        }).then(function (result) {
            if (arg == 'finance') {
                $scope.finance_charges_value = result['Description'];
                $scope.recfinance.finance_charges_id = result.id;
            }
            else {
=======
        }).then(function(result) {
            if (arg == 'finance') {
                $scope.finance_charges_value = result['Description'];
                $scope.recfinance.finance_charges_id = result.id;
            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.insurance_charges_value = result['Description'];
                $scope.recfinance.insurance_charges_id = result.id;
            }

<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    }

<<<<<<< HEAD
    $scope.getPaymentTerms = function (arg) {
=======
    $scope.getPaymentTerms = function(arg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var getTermUrl = $scope.$root.setup + "crm/payment-terms";
        var postData = "";
        postData = {
            'token': $scope.$root.token,
            'all': "1",
        };
        $http
            .post(getTermUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.columns = [];
                //$scope.columns = res.data.columns;

                $scope.record = res.data.response;


<<<<<<< HEAD
                angular.forEach(res.data.response[0], function (val, index) {
=======
                angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.columns.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                });

            });

        ngDialog.openConfirm({
            template: 'modalCustDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
<<<<<<< HEAD
        }).then(function (result) {
            $scope.payment_term = result['Description'];
            $scope.recfinance.payment_terms_id = result.id;
        }, function (reason) {
=======
        }).then(function(result) {
            $scope.payment_term = result['Description'];
            $scope.recfinance.payment_terms_id = result.id;
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    }


<<<<<<< HEAD
    $scope.getBankAccount = function (arg) {
        console.log("getting banks: ", $scope.check_cfinance_readonly);
        if(!$scope.check_cfinance_readonly){
        $scope.title = 'Payable Bank';
        var getBankUrl = $scope.$root.setup + "general/bank-accounts";

        //arr_bank

        var postData = { 'token': $scope.$root.token, 'filter_id': 152 };
        $http
            .post(getBankUrl, postData)
            .then(function (res) {
                $scope.columns = [];
                //	$scope.columns = res.data.columns;
                $scope.record = res.data.response;


                angular.forEach(res.data.response[0], function (val, index) {
                    $scope.columns.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                });


                angular.element('#_model_modal_bank_order').modal({ show: true });

            });
=======
    $scope.getBankAccount = function(arg) {
        console.log("getting banks: ", $scope.check_cfinance_readonly);
        if (!$scope.check_cfinance_readonly) {
            $scope.title = 'Payable Bank';
            var getBankUrl = $scope.$root.setup + "general/bank-accounts";

            //arr_bank

            var postData = { 'token': $scope.$root.token, 'filter_id': 152 };
            $http
                .post(getBankUrl, postData)
                .then(function(res) {
                    $scope.columns = [];
                    //	$scope.columns = res.data.columns;
                    $scope.record = res.data.response;


                    angular.forEach(res.data.response[0], function(val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });


                    angular.element('#_model_modal_bank_order').modal({ show: true });

                });
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        }

    }


<<<<<<< HEAD
    $scope.confirm_bank = function (btc) {
=======
    $scope.confirm_bank = function(btc) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // $scope.bank_name = btc.name;//elem['Account_Name'];
        console.log(btc);
        $scope.bank_name = btc.bank_name;
        $scope.recfinance.bank_name = btc.bank_name;
        $scope.recfinance.bank_account_id = btc.id;
        // $scope.rec.bill_to_bank_name = btc.account_name;
        // $scope.rec.bill_to_bank_id = btc.id;
        angular.element('#_model_modal_bank_order').modal('hide');
    }
<<<<<<< HEAD
    $scope.setGenerate = function (id) {
=======
    $scope.setGenerate = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        for (var i = 0; i < $scope.arr_generate.length; i++) {
            if (id == $scope.arr_generate[i].id) {
                if ($scope.arr_generate[i].chk == true)
                    $scope.arr_generate[i].chk = false
                else
                    $scope.arr_generate[i].chk = true
            }
        }
    }

<<<<<<< HEAD
    $scope.getfinancecustomer = function () {

        $scope.arr_generate = [{ 'id': '1', 'name': 'E-Reminder', 'chk': false },
        { 'id': '2', 'name': 'E-Statement', 'chk': false },
        { 'id': '3', 'name': 'E-Invoice', 'chk': false }];
=======
    $scope.getfinancecustomer = function() {

        $scope.arr_generate = [{ 'id': '1', 'name': 'E-Reminder', 'chk': false },
            { 'id': '2', 'name': 'E-Statement', 'chk': false },
            { 'id': '3', 'name': 'E-Invoice', 'chk': false }
        ];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        // var constUrl = $scope.$root.setup + "ledger-group/get-predefine-by-type";

        var getFinance = $scope.$root.sales + 'customer/customer/get-customer-finance'
        $scope.recfinance = {};

        $scope.recfinance.bill_to_customer = $scope.$root.customer_code;
        $scope.showLoader = true;

        $http
            .post(getFinance, { 'token': $scope.$root.token, 'customer_id': $stateParams.id })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.check_cfinance_readonly = true;
                    $scope.recfinance = res.data.response;
                    $scope.recfinance.update_id = res.data.response.id;
                    $scope.recfinance.finance_chk = (res.data.response.finance_check == 1) ? true : 0;
                    $scope.recfinance.insurance_chk = (res.data.response.insurance_check == 1) ? true : 0;
                    $scope.recfinance.e_archive_chk = (res.data.response.e_archive_chk == 1) ? true : 0;

                    $scope.bank_name = res.data.bank_details.bank_name;
                    $scope.payment_term = res.data.response.payment_term;

                    $scope.recfinance.phone = res.data.response.fphone;
                    $scope.recfinance.fax = res.data.response.ffax;

                    $scope.recfinance.bill_to_customer_id = $stateParams.id;

                    if (res.data.response.generate) {
                        var arrGen = res.data.response.generate.split(',');
<<<<<<< HEAD
                        angular.forEach($scope.arr_generate, function (elem, index) {
=======
                        angular.forEach($scope.arr_generate, function(elem, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            var indx = arrGen.indexOf(elem.id) == -1;
                            if (!indx) {
                                $scope.arr_generate[index].chk = true;
                            }
                        });
                    }

                    if ($scope.recfinance.payment_method_id != undefined && $rootScope.arr_payment_methods != undefined)
                        $scope.drp.payment_method_ids = $scope.$root.get_obj_frm_arry($rootScope.arr_payment_methods, $scope.recfinance.payment_method_id);

                    if ($scope.recfinance.payment_terms_id != undefined && $rootScope.arr_payment_terms != undefined)
                        $scope.drp.payment_terms_ids = $scope.$root.get_obj_frm_arry($rootScope.arr_payment_terms, $scope.recfinance.payment_terms_id);

                    // if ($scope.recfinance.finance_charges_id != undefined && $scope.recfinance.arr_finance_charges != undefined)
                    //     $scope.drp.finance_charges_ids = $scope.$root.get_obj_frm_arry($scope.recfinance.arr_finance_charges, $scope.recfinance.finance_charges_id);

                    // if ($scope.recfinance.insurance_charges_id != undefined && $scope.recfinance.arr_insurance_charges != undefined)
                    //     $scope.drp.insurance_charges_ids = $scope.$root.get_obj_frm_arry($scope.recfinance.arr_insurance_charges, $scope.recfinance.insurance_charges_id);

                    $scope.recfinance.fincharges = parseFloat(res.data.response.fincharges);
                    $scope.recfinance.finchargetype = res.data.response.finchargetype;
                    $scope.recfinance.inscharges = parseFloat(res.data.response.inscharges);
                    $scope.recfinance.inschargetype = res.data.response.inschargetype;


                    $scope.drp.email_1 = res.data.response.reminder_email;
                    $scope.drp.email_2 = res.data.response.statement_email;
                    $scope.drp.email_3 = res.data.response.invoice_email;

<<<<<<< HEAD
                    angular.forEach($rootScope.postingGroups, function (elem2) {
=======
                    angular.forEach($rootScope.postingGroups, function(elem2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (elem2.id == res.data.response.posting_group_id)
                            $scope.drp.posting_group_ids = elem2;
                    });

                    // if ($scope.recfinance.posting_group_id != undefined && $rootScope.arr_posting_group_ids != undefined) 
                    //     $scope.drp.posting_group_ids = $scope.$root.get_obj_frm_arry($rootScope.arr_posting_group_ids, $scope.recfinance.posting_group_id);
<<<<<<< HEAD
                }
                else {
                    $scope.recfinance = {};//res.data.response;
=======
                } else {
                    $scope.recfinance = {}; //res.data.response;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.recfinance.finance_check = false;
                    $scope.recfinance.insurance_check = false;
                    $scope.check_cfinance_readonly = false;
                }
            });
    }


    $scope.recfinance = {};
<<<<<<< HEAD
    $scope.addcust_finance = function (recfinance, drp) {
=======
    $scope.addcust_finance = function(recfinance, drp) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var addFinance = $scope.$root.sales + 'customer/customer/add-finance';
        //recfinance.generate = $scope.drp.generate != undefined?$scope.drp.generate.id:0;
        recfinance.gen_bus_posting_group = $scope.drp.gen_bus_posting_group != undefined ? $scope.drp.gen_bus_posting_group.id : 0;
        recfinance.vat_bus_posting_group = $scope.drp.vat_bus_posting_group != undefined ? $scope.drp.vat_bus_posting_group.id : 0;
        recfinance.customer_posting_group = $scope.drp.customer_posting_group != undefined ? $scope.drp.customer_posting_group.id : 0;
        recfinance.payment_method_id = $scope.drp.payment_method_ids != undefined ? $scope.drp.payment_method_ids.id : 0;
        recfinance.finance_charges_id = $scope.drp.finance_charges_ids != undefined ? $scope.drp.finance_charges_ids.id : 0;
        recfinance.insurance_charges_id = $scope.drp.insurance_charges_ids != undefined ? $scope.drp.insurance_charges_ids.id : 0;
        recfinance.payment_terms_id = $scope.drp.payment_terms_ids != undefined ? $scope.drp.payment_terms_ids.id : 0;
        recfinance.posting_group_id = $scope.drp.posting_group_ids != undefined ? $scope.drp.posting_group_ids.id : 0;
        recfinance.finance_check = (recfinance.finance_chk == true) ? 1 : 0;
        recfinance.insurance_check = (recfinance.insurance_chk == true) ? 1 : 0;
        recfinance.e_archive_chk = (recfinance.e_archive_chk == true) ? 1 : 0;

        recfinance.type = 'customer';
        recfinance.customer_id = $scope.$root.crm_id;
        recfinance.token = $scope.$root.token;
        if (recfinance.update_id > 0) {
            addFinance = $scope.$root.sales + 'customer/customer/update-finance';
            recfinance.id = recfinance.update_id;
        }

        recfinance.reminder_email = drp.email_1;
        recfinance.statement_email = drp.email_2;
        recfinance.invoice_email = drp.email_3;

        var strGen = [];
        for (var i = 0; i < $scope.arr_generate.length; i++) {
            if ($scope.arr_generate[i].chk == true)
                strGen.push($scope.arr_generate[i].id);
        }

        recfinance.generate = strGen.toString();

        $http
            .post(addFinance, recfinance)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    if (recfinance.update_id > 0) {
                        $scope.check_cfinance_readonly = true;
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
<<<<<<< HEAD
                    }
                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.check_cfinance_readonly = true;
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        recfinance.update_id = res.data.id;
                    }

                    //$scope.$root.$broadcast("myEventReload", {});
<<<<<<< HEAD
                }
                else
=======
                } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(105));
            });
    }

    if ($stateParams.id > 0)
        $scope.check_cfinance_readonly = true;

<<<<<<< HEAD
    $scope.showEditCFinanceForm = function () {
=======
    $scope.showEditCFinanceForm = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.check_cfinance_readonly = false;
    }


    //Avtivity   
    $scope.balance_entry_type = 'Customer';
    $scope.module_type_account = 2;
    $scope.doc_type = 1;


    angular.element('.blance_payment').removeClass('dont-click');

    if ($stateParams.tab != undefined && $stateParams.tab == 'blance_payment')
        angular.element('.blance_payment a').click();


    $scope.isSalePerersonChanged = false;
    $scope.ReciptInvoiceModalarr = [];
    $scope.ReciptInvoiceModalSelectarr = [];
    $scope.balance_payed = 0;
    $scope.cust_id = 0;
    $scope.final_amount = 0;
    $scope.doc_type = 0;

    $scope.item_detail = {};
    $scope.Recipt_payed = [];
    $scope.title_payed = '';
    $scope.invoice_sub = {};
    $scope.receipt_sub_list = {};

    $scope.searchKeyword = {};

<<<<<<< HEAD
    $scope.get_balance_info = function (id, item_paging) {
        if (id == undefined){
=======
    $scope.get_balance_info = function(id, item_paging) {
        if (id == undefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            id = $scope.rec.id;
        }
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        if (item_paging == 1)
            $scope.item_paging.spage = 1;
        $scope.postData.page = $rootScope.item_paging.spage;

        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        //$scope.postData.searchKeyword = $scope.searchKeyword.$;
        // if(  $scope.searchKeyword.brand !== undefined && $scope.searchKeyword.brand!==  null)$scope.postData.deprtments = $scope.searchKeyword.deprtment !== undefined ? $scope.searchKeyword.deprtment.id : 0;
        $scope.postData.cust_id = id;
        $scope.postData.module_type = $scope.module_type_account;
        $scope.postData.external_module = 1;

        $scope.postData.defaultCurrency = $scope.$root.defaultCurrency;
<<<<<<< HEAD
        $scope.postData.customerCurrencyID = $rootScope.cust_current_edit_currency.id;//$scope.drp.currency.id;
=======
        $scope.postData.customerCurrencyID = $rootScope.cust_current_edit_currency.id; //$scope.drp.currency.id;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            // $scope.searchKeyword = {};
            // $scope.record_data = {};
        }

        $scope.cust_id = id;


        if (!$scope.searchKeyword.totalRecords)
            $scope.searchKeyword.totalRecords = 50;
        $scope.postData.searchKeyword = $scope.searchKeyword;

        var getUrl = $scope.$root.gl + "chart-accounts/get-jl-journal-receipt-payment-customer";
        $scope.showLoader = true;

        $http
            .post(getUrl, $scope.postData)
<<<<<<< HEAD
            .then(function (res) {
                $scope.receipt_sub_list = [];
                if (res.data.ack == true) {
                    $scope.tableData = res;
                    angular.forEach(res.data.response, function(obj,index){
=======
            .then(function(res) {
                $scope.receipt_sub_list = [];
                if (res.data.ack == true) {
                    $scope.tableData = res;
                    angular.forEach(res.data.response, function(obj, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        obj.on_hold = obj.on_hold == 1 ? true : false
                    });
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.customer_balance = (res.data.customer_balance != undefined) ? res.data.customer_balance : 0;

                    $scope.balanceInCustomerCurrency = res.data.balanceInCustomerCurrency;
                    $scope.customerCurrencyCode = $rootScope.cust_current_edit_currency.code;
                    $scope.custAvgPaymentDays = (res.data.custAvgPaymentDays != undefined) ? res.data.custAvgPaymentDays : 0;

                    // if (res.data.response.length > 0)
<<<<<<< HEAD
                        $scope.receipt_sub_list = res.data.response;
                    angular.forEach($scope.tableData.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });                    
                }
                if(res.data.ack != undefined)
                    $scope.showLoader = false;
                //$scope.receipt_sub_list.push({'id':'' ,currency_id:$scope.array_submit_jurnal.currency_id });
                //  else   toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            });        
=======
                    $scope.receipt_sub_list = res.data.response;
                    angular.forEach($scope.tableData.data.response.tbl_meta_data.response.colMeta, function(obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });
                }
                if (res.data.ack != undefined)
                    $scope.showLoader = false;
                //$scope.receipt_sub_list.push({'id':'' ,currency_id:$scope.array_submit_jurnal.currency_id });
                //  else   toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            });
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $('#ReciptInvoiceModal').modal('hide');
        // $scope.getinvoice_all(id, item_paging);
    }

<<<<<<< HEAD
    
   

    $scope.$root.itemselectPage(1);
    $scope.cust_id = 0;
    $scope.getinvoice_all = function (id, item_paging) {


        $scope.postData_cust = {};
        $scope.postData_cust.sell_to_cust_id = id;//item.account_id;
=======



    $scope.$root.itemselectPage(1);
    $scope.cust_id = 0;
    $scope.getinvoice_all = function(id, item_paging) {


        $scope.postData_cust = {};
        $scope.postData_cust.sell_to_cust_id = id; //item.account_id;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.postData_cust.token = $scope.$root.token;
        $scope.postData_cust.more_fields = 1;

        if ($scope.module_type_account == 2)
            var postUrl = $scope.$root.sales + "customer/order/listings";

        if ($scope.module_type_account == 3)
            var postUrl = $scope.$root.pr + "srm/srminvoice/listings";

        $scope.postData_cust.parent_id = $scope.parent_id;
<<<<<<< HEAD
        $scope.postData_cust.cust_id = id;//item.account_id;
=======
        $scope.postData_cust.cust_id = id; //item.account_id;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.postData_cust.doc_type = 1;
        //	$scope.postData.parent_id=80;
        $scope.postData_cust.type = 2;
        //	$scope.postData.blance=1;
        if (item_paging == 1)
            $scope.item_paging.spage = 1;
        $scope.postData_cust.page = $scope.item_paging.spage;

        $scope.postData_cust.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        //$scope.postData.searchKeyword = $scope.searchKeyword.$;
        // $scope.postData.deprtments = $scope.searchKeyword.deprtment !== undefined ? $scope.searchKeyword.deprtment.id : 0;


        if ($scope.postData_cust.pagination_limits == -1) {
            $scope.postData_cust.page = -1;
            // $scope.searchKeyword = {};
            // $scope.record_data = {};
        }


        $http
            .post(postUrl, $scope.postData_cust)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {

                    $scope.invoice_sub = res.data.response;

                }
                //    else   toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });
    }
    $scope.final_amount = 0;

<<<<<<< HEAD
    $scope.getInvoiceList = function (arry, id, index, p_id) {
=======
    $scope.getInvoiceList = function(arry, id, index, p_id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.cust_id = id;
        $scope.final_amount = arry.final_amount;
        $scope.cnv_rate = arry.cnv_rate;
        $scope.current_currency_id = {};

        $scope.select_curency_id = arry.currency_id;
        $scope.doc_type_main = 1;


        $scope.module_type = {};
        $scope.module_type.value = arry.module_type;
        $scope.posting_groupmain = arry.posting_group_id;
        $scope.balance_id_main = arry.balance_id;
<<<<<<< HEAD
        $scope.parent_account_id = arry.parent_id;
        ;
=======
        $scope.parent_account_id = arry.parent_id;;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.columns = [];
        $scope.ReciptInvoiceModalarr = [];
        //$scope.title = 'Balance Payment';
        $scope.doc_type = 1;
        $scope.curent_cust_index = index;


        if (id === undefined) {
            toaster.pop('error', 'info', 'Select Account Type or Customer ');
            return;
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            $scope.postData = {};


<<<<<<< HEAD
            $scope.postData.sell_to_cust_id = id;//item.account_id;
=======
            $scope.postData.sell_to_cust_id = id; //item.account_id;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.postData.token = $scope.$root.token;
            $scope.postData.more_fields = 1;

            if ($scope.module_type_account == 2) {
<<<<<<< HEAD
                $scope.postData.title_invoice = 'Customer Payment';//('+item.account_code+')';
                var postUrl = $scope.$root.sales + "customer/order/listings";
            }
            if ($scope.module_type_account == 3) {
                $scope.postData.title_invoice = 'Supplier Payment';//('+item.account_code+')';
                var postUrl = $scope.$root.pr + "srm/srminvoice/listings";
            }
            $scope.postData.parent_id = $scope.parent_id;
            $scope.postData.cust_id = id;//item.account_id;
=======
                $scope.postData.title_invoice = 'Customer Payment'; //('+item.account_code+')';
                var postUrl = $scope.$root.sales + "customer/order/listings";
            }
            if ($scope.module_type_account == 3) {
                $scope.postData.title_invoice = 'Supplier Payment'; //('+item.account_code+')';
                var postUrl = $scope.$root.pr + "srm/srminvoice/listings";
            }
            $scope.postData.parent_id = $scope.parent_id;
            $scope.postData.cust_id = id; //item.account_id;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            $scope.postData.doc_type = 1;
            //	$scope.postData.parent_id=80;
            $scope.postData.type = 2;
            //	$scope.postData.blance=1;


            $http
                .post(postUrl, $scope.postData)
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        //	$scope.balance_payed = res.data.balance_payed;

                        $scope.total = res.data.total;
                        $scope.item_paging.total_pages = res.data.total_pages;
                        $scope.item_paging.cpage = res.data.cpage;
                        $scope.item_paging.ppage = res.data.ppage;
                        $scope.item_paging.npage = res.data.npage;

                        $scope.item_paging.pages = res.data.pages;
                        $scope.total_paging_record = res.data.total_paging_record;

                        $scope.ReciptInvoiceModalarr = res.data.response;

                        angular.element('#ReciptInvoiceModal').modal({ show: true });
<<<<<<< HEAD
                    }
                    else
=======
                    } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                });
        }
    }

<<<<<<< HEAD
    $scope.openDocumentLink = function(record){
=======
    $scope.openDocumentLink = function(record) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        var url;
<<<<<<< HEAD
        if (record.docType == 'Sales Invoice'){
            url = $state.href("app.viewOrder", ({ id: record.order_id, isInvoice: 1 }));
        }
        else if (record.docType == 'Credit Note'){
            url = $state.href("app.viewReturnOrder", ({ id: record.order_id, isInvoice: 1 }));
        }
        else if (record.docType == 'Customer Payment'){
            url = $state.href("app.view-receipt-journal-gl-cust", ({id:record.order_id}));
        }
        else if (record.docType == 'Customer Refund'){
            url = $state.href("app.view-receipt-journal-gl-cust", ({ id: record.order_id }));
        }
        else if (record.docType == 'General Journal'){
            url = $state.href("app.view-receipt-journal-gl", ({id: record.order_id }));
        }
        else if (record.docType == 'Opening Balance Invoice') {
            url = $state.href("app.openingBalances", ({ module: 'customer' }));
        }
        else if (record.docType == 'Opening Balance Credit Note') {
            url = $state.href("app.openingBalances", ({ module: 'customer' }));
        }
        else if (record.docType == 'Bank Opening Balance Payment') {
            url = $state.href("app.openingBalances", ({ module: 'bank' }));
        }
        else if (record.docType == 'Bank Opening Balance Refund') {
=======
        if (record.docType == 'Sales Invoice') {
            url = $state.href("app.viewOrder", ({ id: record.order_id, isInvoice: 1 }));
        } else if (record.docType == 'Credit Note') {
            url = $state.href("app.viewReturnOrder", ({ id: record.order_id, isInvoice: 1 }));
        } else if (record.docType == 'Customer Payment') {
            url = $state.href("app.view-receipt-journal-gl-cust", ({ id: record.order_id }));
        } else if (record.docType == 'Customer Refund') {
            url = $state.href("app.view-receipt-journal-gl-cust", ({ id: record.order_id }));
        } else if (record.docType == 'General Journal') {
            url = $state.href("app.view-receipt-journal-gl", ({ id: record.order_id }));
        } else if (record.docType == 'Opening Balance Invoice') {
            url = $state.href("app.openingBalances", ({ module: 'customer' }));
        } else if (record.docType == 'Opening Balance Credit Note') {
            url = $state.href("app.openingBalances", ({ module: 'customer' }));
        } else if (record.docType == 'Bank Opening Balance Payment') {
            url = $state.href("app.openingBalances", ({ module: 'bank' }));
        } else if (record.docType == 'Bank Opening Balance Refund') {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            url = $state.href("app.openingBalances", ({ module: 'bank' }));
        }
        window.open(url, '_blank');

    }

<<<<<<< HEAD
    $scope.ValidateAllocationDate = function(record){
    
        var date_parts = record.allocation_date.trim().split('/');
        var doc_to_alloc_date_parts = record.invoice_date.trim().split('/');
        var doc_from_alloc_date_parts = $scope.posting_date.trim().split('/');
               
        var alloc_date = new Date(date_parts[2], date_parts[1] - 1, date_parts[0]);    
        var doc_to_alloc_date = new Date(doc_to_alloc_date_parts[2], doc_to_alloc_date_parts[1] - 1, doc_to_alloc_date_parts[0]);
        var doc_from_alloc_date = new Date(doc_from_alloc_date_parts[2], doc_from_alloc_date_parts[1] - 1, doc_from_alloc_date_parts[0]);
        
        if (doc_from_alloc_date >= doc_to_alloc_date && alloc_date < doc_from_alloc_date)
        {
            toaster.pop('error', 'Error', 'Allocation date cannot be earlier than ' + $scope.posting_date);
            record.allocation_date = $scope.posting_date;
        }
        else if (doc_to_alloc_date >= doc_from_alloc_date && alloc_date < doc_to_alloc_date)
        {
=======
    $scope.ValidateAllocationDate = function(record) {

        var date_parts = record.allocation_date.trim().split('/');
        var doc_to_alloc_date_parts = record.invoice_date.trim().split('/');
        var doc_from_alloc_date_parts = $scope.posting_date.trim().split('/');

        var alloc_date = new Date(date_parts[2], date_parts[1] - 1, date_parts[0]);
        var doc_to_alloc_date = new Date(doc_to_alloc_date_parts[2], doc_to_alloc_date_parts[1] - 1, doc_to_alloc_date_parts[0]);
        var doc_from_alloc_date = new Date(doc_from_alloc_date_parts[2], doc_from_alloc_date_parts[1] - 1, doc_from_alloc_date_parts[0]);

        if (doc_from_alloc_date >= doc_to_alloc_date && alloc_date < doc_from_alloc_date) {
            toaster.pop('error', 'Error', 'Allocation date cannot be earlier than ' + $scope.posting_date);
            record.allocation_date = $scope.posting_date;
        } else if (doc_to_alloc_date >= doc_from_alloc_date && alloc_date < doc_to_alloc_date) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            toaster.pop('error', 'Error', 'Allocation date cannot be earlier than ' + record.invoice_date);
            record.allocation_date = record.invoice_date;
        }
    }
    $scope.amount_total = 0;
    $scope.allocated_amount = 0;
<<<<<<< HEAD
    $scope.getPaymentEntries = function (record, type, index) {
=======
    $scope.getPaymentEntries = function(record, type, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        if (record.docType == 'Sales Invoice')
            type = 1;
        if (record.docType == 'Credit Note')
            type = 2;
        if (record.docType == 'Customer Payment')
            type = 5;
        if (record.docType == 'Customer Refund')
            type = 6;
        if (record.docType == 'General Journal') {
            if (record.debitAmount > 0) {
                type = 6;
            }
            if (record.creditAmount > 0) {
                type = 5;
            }
        }
        if (record.docType == 'Opening Balance Invoice')
            type = 7;
        if (record.docType == 'Opening Balance Credit Note')
            type = 8;
        if (record.docType == 'Bank Opening Balance Payment')
            type = 11;
        if (record.docType == 'Bank Opening Balance Refund')
            type = 12;
<<<<<<< HEAD
        if(record.on_hold)
        {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(349));
        }
        else
        {
=======
        if (record.on_hold) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(349));
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.disable_save = false;
            var id = record.order_id;
            var detail_id = record.detail_id;
            var amount = Math.abs(record.remaining_amount);
            $scope.moduleName = 'customer';

            var postData = {};

<<<<<<< HEAD
            $scope.entry_type = type; 
=======
            $scope.entry_type = type;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            // 1=> sales invoice 2=> credit note, 5=>Payment, 6=> Refund, 7=> Customer opening balance invoice, 8=> Customer opening balance Credit Note, 
            // 9=> Supplier opening balance invoice, 10=> Supplier opening balance Credit Note, 11=> Customer Opening balance Payment (bank),
            // 12=> Customer Opening balance Refund (bank), 13=> Supplier Opening balance Payment (bank), 14=> Supplier Opening balance Refund (bank) 

            $scope.amount_total = Number(amount);
            $scope.module_type = {};
            if ($scope.entry_type == 1 || $scope.entry_type == 6 || $scope.entry_type == 7 || $scope.entry_type == 12) {
                $scope.module_type.value = 2;
                $scope.doc_type = 1; // sale invoice
<<<<<<< HEAD
                $scope.postData.title = 'Allocation of '+record.docType+' ('+record.invoice_code+')';
                var postUrl = $scope.$root.sales + "customer/order/invoice-for-payment-listings";
            }
            else if ($scope.entry_type == 2 || $scope.entry_type == 5 || $scope.entry_type == 8 || $scope.entry_type == 11) {
                $scope.module_type.value = 2;
                $scope.doc_type = 2; // credit note
                $scope.postData.title = 'Allocation of  '+record.docType+' ('+record.invoice_code+')';
                var postUrl = $scope.$root.sales + "customer/order/invoice-for-refund-listings";
            }

            if($scope.entry_type == 1 || $scope.entry_type == 2 || $scope.entry_type == 7 || $scope.entry_type == 8 || $scope.entry_type == 11 || $scope.entry_type == 12)
            {
=======
                $scope.postData.title = 'Allocation of ' + record.docType + ' (' + record.invoice_code + ')';
                var postUrl = $scope.$root.sales + "customer/order/invoice-for-payment-listings";
            } else if ($scope.entry_type == 2 || $scope.entry_type == 5 || $scope.entry_type == 8 || $scope.entry_type == 11) {
                $scope.module_type.value = 2;
                $scope.doc_type = 2; // credit note
                $scope.postData.title = 'Allocation of  ' + record.docType + ' (' + record.invoice_code + ')';
                var postUrl = $scope.$root.sales + "customer/order/invoice-for-refund-listings";
            }

            if ($scope.entry_type == 1 || $scope.entry_type == 2 || $scope.entry_type == 7 || $scope.entry_type == 8 || $scope.entry_type == 11 || $scope.entry_type == 12) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.invoice_id = id;

                $scope.payment_id = 0;
                $scope.payment_detail_id = 0;
                postData.parent_id = 0;
<<<<<<< HEAD
            
            }
            else if($scope.entry_type == 5 || $scope.entry_type == 6)
            {
=======

            } else if ($scope.entry_type == 5 || $scope.entry_type == 6) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.payment_id = id;
                $scope.payment_detail_id = detail_id;
                postData.parent_id = id;

                $scope.invoice_id = 0;
            }
            $scope.current_payment_index = index;
            $scope.posting_date = record.posting_date;
            $scope.from_entry_currency_rate = record.currency_rate;
<<<<<<< HEAD
            
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            postData.token = $scope.$root.token;
            postData.account_id = $scope.$root.crm_id;
            postData.currency_id = record.currency_id;
            postData.posting_date = $scope.posting_date;
            $scope.showLoader = true;

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
                        $scope.ReciptInvoiceModalarr = res.data.response;
                        $scope.currency_code = res.data.response[0].currency_code;
                        $scope.showLoader = false;
<<<<<<< HEAD
            
                        angular.element('#InvoicesForPayments').modal({ show: true });
                    }
                    else
                    {
=======

                        angular.element('#InvoicesForPayments').modal({ show: true });
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.showLoader = false;
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                    }
                });
        }
    }
<<<<<<< HEAD
    $scope.getPaidEntries = function (record, type, index) {
=======
    $scope.getPaidEntries = function(record, type, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        if (record.docType == 'Sales Invoice')
            type = 1;
        if (record.docType == 'Credit Note')
            type = 2;
        if (record.docType == 'Customer Payment')
            type = 5;
        if (record.docType == 'Customer Refund' || record.docType == 'General Journal')
            type = 6;
        if (record.docType == 'General Journal') {
            if (record.debitAmount > 0) {
                type = 6;
            }
            if (record.creditAmount > 0) {
                type = 5;
            }
        }
        if (record.docType == 'Opening Balance Invoice')
            type = 7;
        if (record.docType == 'Opening Balance Credit Note')
            type = 8;
        if (record.docType == 'Bank Opening Balance Payment')
            type = 11;
        if (record.docType == 'Bank Opening Balance Refund')
            type = 12;
        var id = record.order_id;
        var detail_id = record.detail_id;
        var amount = Math.abs(record.remaining_amount);
        $scope.moduleName = 'customer';


        var postData = {};

<<<<<<< HEAD
        $scope.entry_type = type; 
=======
        $scope.entry_type = type;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // 1=> sales invoice 2=> credit note, 5=>Payment, 6=> Refund, 7=> Customer opening balance invoice, 8=> Customer opening balance Credit Note, 
        // 9=> Supplier opening balance invoice, 10=> Supplier opening balance Credit Note, 11=> Customer Opening balance Payment (bank),
        // 12=> Customer Opening balance Refund (bank), 13=> Supplier Opening balance Payment (bank), 14=> Supplier Opening balance Refund (bank) 

        $scope.amount_total = Number(amount);
        $scope.module_type = {};
        if ($scope.entry_type == 1 || $scope.entry_type == 6 || $scope.entry_type == 7 || $scope.entry_type == 12) {
            $scope.module_type.value = 2;
            $scope.doc_type = 1; // sale invoice
<<<<<<< HEAD
            $scope.postData.title = 'Allocation details for '+record.docType+' ('+record.invoice_code+')';
            var postUrl = $scope.$root.sales + "customer/order/invoice-for-payment-listings-paid";
        }
        else if ($scope.entry_type == 2 || $scope.entry_type == 5 || $scope.entry_type == 8 || $scope.entry_type == 11) {
            $scope.module_type.value = 2;
            $scope.doc_type = 2; // credit note
            $scope.postData.title = 'Allocation details for  '+record.docType+' ('+record.invoice_code+')';
            var postUrl = $scope.$root.sales + "customer/order/invoice-for-refund-listings-paid";
        }

        if($scope.entry_type == 1 || $scope.entry_type == 2 || $scope.entry_type == 7 || $scope.entry_type == 8 || $scope.entry_type == 11 || $scope.entry_type == 12)
        {
=======
            $scope.postData.title = 'Allocation details for ' + record.docType + ' (' + record.invoice_code + ')';
            var postUrl = $scope.$root.sales + "customer/order/invoice-for-payment-listings-paid";
        } else if ($scope.entry_type == 2 || $scope.entry_type == 5 || $scope.entry_type == 8 || $scope.entry_type == 11) {
            $scope.module_type.value = 2;
            $scope.doc_type = 2; // credit note
            $scope.postData.title = 'Allocation details for  ' + record.docType + ' (' + record.invoice_code + ')';
            var postUrl = $scope.$root.sales + "customer/order/invoice-for-refund-listings-paid";
        }

        if ($scope.entry_type == 1 || $scope.entry_type == 2 || $scope.entry_type == 7 || $scope.entry_type == 8 || $scope.entry_type == 11 || $scope.entry_type == 12) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.invoice_id = id;

            $scope.payment_id = 0;
            $scope.payment_detail_id = 0;
            postData.parent_id = 0;
<<<<<<< HEAD
        
        }
        else if($scope.entry_type == 5 || $scope.entry_type == 6)
        {
=======

        } else if ($scope.entry_type == 5 || $scope.entry_type == 6) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.payment_id = id;
            $scope.payment_detail_id = detail_id;
            postData.parent_id = id;

            $scope.invoice_id = 0;
        }
        $scope.current_payment_index = index;
        postData.token = $scope.$root.token;
        postData.account_id = $scope.$root.crm_id;
        postData.invoice_id = id;
<<<<<<< HEAD
        postData.detail_id  = detail_id;
=======
        postData.detail_id = detail_id;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        postData.invoice_type = $scope.entry_type;

        $scope.total_amount = 0;
        $scope.total_setteled = 0;
        $scope.currency_code = '';
<<<<<<< HEAD
        
        $scope.showLoader = true;
        $http
            .post(postUrl, postData)
            .then(function (res) {
=======

        $scope.showLoader = true;
        $http
            .post(postUrl, postData)
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
                    $scope.ReciptInvoiceModalarrPaid = res.data.response;

                    $scope.total_amount = Math.abs(Number(record.grand_total));
                    $scope.currency_code = record.currency_code;

                    $scope.total_setteled = 0;
<<<<<<< HEAD
                    angular.forEach($scope.ReciptInvoiceModalarrPaid, function(obj){
                        $scope.total_setteled += Number(obj.paid_amount);
                    });
                    $scope.showLoader = false;
                    
                    angular.element('#InvoicesForAllocatedPayments').modal({ show: true });
                }
                else
                {
=======
                    angular.forEach($scope.ReciptInvoiceModalarrPaid, function(obj) {
                        $scope.total_setteled += Number(obj.paid_amount);
                    });
                    $scope.showLoader = false;

                    angular.element('#InvoicesForAllocatedPayments').modal({ show: true });
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.showLoader = false;
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });
    }

<<<<<<< HEAD
    $scope.netTotal = function () {
        var ctotal = 0;
        angular.forEach($scope.ReciptInvoiceModalarr, function (item) {
=======
    $scope.netTotal = function() {
        var ctotal = 0;
        angular.forEach($scope.ReciptInvoiceModalarr, function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (item.amount >= 0)
                ctotal += Number(item.amount);
            // ctotal += Number(item.paid_amount);
        });
        $scope.amount_left = Number(Number($scope.amount_total.toFixed(2)) - Number(ctotal.toFixed(2)) - Number($scope.allocated_amount).toFixed(2)).toFixed(2);
        return $scope.amount_left;
    }

    /* $scope.setremianrefund = function (item) {

        if (angular.element('#checkremaingamountrefund_' + item.id).is(':checked') == true)
            item.amount = item.outstanding_amount;
        else if (Number(item.amount) > Number(item.outstanding_amount))
            item.amount = item.outstanding_amount;
        //else  if(item.amount !=undefined  ) item.amount=item.outstanding_amount;


        if ($scope.amount_total < item.amount)
            item.amount = $scope.amount_total;


        //save conversion price in RECEIPt Journal for  Profit & Loss Accounts
        item.converted_price = (Number(item.amount) / Number(item.currency_rate)) - (Number(item.amount) / Number($scope.cnv_rate));
    } */


<<<<<<< HEAD
    $scope.AddPaymentAllocation = function (module_type, doc_type) {
=======
    $scope.AddPaymentAllocation = function(module_type, doc_type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.disable_save = true;
        var postData = {};
        postData.token = $scope.$root.token;
        postData.transaction_type = 1;
        postData.payment_id = $scope.payment_id;
        postData.invoice_id = $scope.invoice_id;
        postData.payment_detail_id = $scope.payment_detail_id;
        postData.IsFinalPayment = 1;
        postData.module_type = 1; //customer
        postData.entry_type = $scope.entry_type;
        postData.posting_date = $scope.posting_date;
        postData.from_entry_currency_rate = $scope.from_entry_currency_rate;
<<<<<<< HEAD
       
        if (doc_type == 1)// sales invoice
        {
            postData.document_type = 1;
            postData.transaction_type = 1;
        }
        else if (doc_type == 2)// credit  invoice
=======

        if (doc_type == 1) // sales invoice
        {
            postData.document_type = 1;
            postData.transaction_type = 1;
        } else if (doc_type == 2) // credit  invoice
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        {
            postData.document_type = 2;
            postData.transaction_type = 2;
        }
<<<<<<< HEAD
       
        var selected_items = [];
        var negative_amount_check = 0;

        angular.forEach($scope.ReciptInvoiceModalarr, function (obj) {
            if (obj.amount < 0) {
                negative_amount_check = 1;
            }
            else if (obj.amount != undefined && Number(obj.amount) > 0)
            {    var invoice_type = 0;
=======

        var selected_items = [];
        var negative_amount_check = 0;

        angular.forEach($scope.ReciptInvoiceModalarr, function(obj) {
            if (obj.amount < 0) {
                negative_amount_check = 1;
            } else if (obj.amount != undefined && Number(obj.amount) > 0) {
                var invoice_type = 0;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (obj.payment_type == "Sales Invoice")
                    invoice_type = 1;
                else if (obj.payment_type == "Credit Note")
                    invoice_type = 2;
                else if (obj.payment_type == "Payment")
                    invoice_type = 5;
                else if (obj.payment_type == "Refund")
                    invoice_type = 6;
                else if (obj.payment_type == "Opening Balance Invoice")
                    invoice_type = 7;
                else if (obj.payment_type == "Opening Balance Credit Note")
                    invoice_type = 8;
                else if (obj.payment_type == "Bank Opening Balance Payment")
                    invoice_type = 11;
                else if (obj.payment_type == "Bank Opening Balance Refund")
                    invoice_type = 12;
<<<<<<< HEAD
                
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                selected_items.push({
                    'invoice_id': obj.order_id,
                    'amount_allocated': obj.amount,
                    'invoice_type': invoice_type,
                    'cust_payment_id': obj.cust_payment_id,
                    'currency_id': obj.currency_id,
                    'currency_rate': obj.currency_rate,
                    'converted_currency_id': obj.converted_currency_id,
                    'posting_date': obj.invoice_date,
                    'allocation_date': obj.allocation_date
                });
            }
        });

<<<<<<< HEAD
        if(negative_amount_check > 0)
        {
=======
        if (negative_amount_check > 0) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(350));
            return;
        }
        postData.items = selected_items;
        var allocation_url = $scope.$root.gl + "chart-accounts/add-payment-allocation-customer";

        $http
            .post(allocation_url, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    angular.element('#InvoicesForPayments').modal('hide');
                    $scope.get_balance_info($scope.$root.crm_id);
                    // $scope.receipt_sub_list[$scope.current_payment_index].remaining_amount = Number($scope.receipt_sub_list[$scope.current_payment_index].remaining_amount)- Number(res.data.total_allocated);
<<<<<<< HEAD
                }
                else
                {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.disable_save = false;
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(105));
                    angular.element('#InvoicesForPayments').modal('hide');
                }
            });
    }


<<<<<<< HEAD
    $scope.edit_on_hold = function (rec, idx) {
=======
    $scope.edit_on_hold = function(rec, idx) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.on_hold_selected_data = {};

        $scope.on_hold_selected_data.id = rec.id;
        $scope.on_hold_selected_data.comments = rec.comments;
        $scope.on_hold_selected_data.index = idx;
    }

<<<<<<< HEAD
    $scope.submit_on_hold = function()
    {
=======
    $scope.submit_on_hold = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var updateUrl = $scope.$root.gl + "chart-accounts/add-comment-on-for-invoice-hold";
        // module_type = 1-> customer
        // module_type = 2-> supplier
        var postData = {
            'token': $scope.$root.token,
            'id': $scope.on_hold_selected_data.id,
            'comments': $scope.on_hold_selected_data.comments,
            'invoice_id': $scope.on_hold_invoice_id,
            'invoice_type': $scope.on_hold_invoice_type,
            'status': $scope.on_hold_selected_data.on_hold_invoice,
            'module_type': 1
        }
        $scope.showLoader = true;
        $http
            .post(updateUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
                if (res.data.ack == true) {
                    if ($scope.on_hold_selected_data.id == undefined)
                    {
=======
            .then(function(res) {
                if (res.data.ack == true) {
                    if ($scope.on_hold_selected_data.id == undefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.showLoader = false;
                        toaster.pop('success', 'Success', 'Comment Added Successfully');
                        $scope.receipt_sub_list[$scope.on_hold_invoice_index].on_hold = (Number($scope.on_hold_selected_data.on_hold_invoice) > 0 ? 0 : 1);
                        $scope.on_hold_selected_data.on_hold_invoice = ($scope.on_hold_selected_data.on_hold_invoice == 0) ? 1 : 0;
<<<<<<< HEAD
                    }
                    else
                    {
                        $scope.showLoader = false;
                        toaster.pop('success', 'Success', 'Comment Updated Successfully');
                    }
                        
                    // $scope.receipt_sub_list[$scope.on_hold_invoice_index].on_hold_message = $scope.on_hold_selected_data.comments;
                    
=======
                    } else {
                        $scope.showLoader = false;
                        toaster.pop('success', 'Success', 'Comment Updated Successfully');
                    }

                    // $scope.receipt_sub_list[$scope.on_hold_invoice_index].on_hold_message = $scope.on_hold_selected_data.comments;

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.on_hold_selected_data.id = undefined;
                    $scope.on_hold_selected_data.comments = '';

                    $scope.on_hold_data = '';
                    var updateUrl = $scope.$root.gl + "chart-accounts/get-on-hold-status";
                    $http
                        .post(updateUrl, { invoice_id: $scope.on_hold_invoice_id, invoice_type: $scope.on_hold_invoice_type, 'token': $scope.$root.token, 'status': 0, module_type: 1 })
<<<<<<< HEAD
                        .then(function (res) {
                            if (res.data.ack == true) {
                                $scope.on_hold_data = res.data.response;
                            }
                            else
=======
                        .then(function(res) {
                            if (res.data.ack == true) {
                                $scope.on_hold_data = res.data.response;
                            } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(400));

                        });
                    // angular.element('#on_hold_comment').modal('hide');
<<<<<<< HEAD
                }
                else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(106));
            });
    }
    $scope.CheckOnHold = function(record)
    {
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        record.on_hold = record.on_hold ? 1:0;
=======
                } else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(106));
            });
    }
    $scope.CheckOnHold = function(record) {
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        record.on_hold = record.on_hold ? 1 : 0;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.on_hold_selected_data = {};
        $scope.on_hold_invoice_id = 0;
        $scope.on_hold_invoice_index = mainRecord.index;
        $scope.on_hold_invoice_type = record.docType;
        $scope.on_hold_selected_data.on_hold_invoice = record.on_hold;

        if (record.docType == 'Customer Payment' || record.docType == 'Customer Refund' || record.docType == 'General Journal') {
            $scope.on_hold_invoice_id = record.detail_id;
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.on_hold_invoice_id = record.order_id;
        }
        $scope.on_hold_data = '';
        var updateUrl = $scope.$root.gl + "chart-accounts/get-on-hold-status";
        $http
            .post(updateUrl, { invoice_id: $scope.on_hold_invoice_id, invoice_type: $scope.on_hold_invoice_type, 'token': $scope.$root.token, 'status': 0, module_type: 1 })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.on_hold_data = res.data.response;
                }
                // else
                //     toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(400));

            });

        angular.element('#on_hold_comment').modal({ show: true });

        /* if(!record.on_hold)
        {
            $rootScope.modalChangeOnHoldStatusMessage = "Are you sure to want to remove on hold from this entry?";
            ngDialog.openConfirm({
            template: 'modalChangeOnHoldStatus',
            className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                var updateUrl = $scope.$root.gl + "chart-accounts/change-on-hold-status";
                // module_type = 1-> customer
                // module_type = 2-> supplier
                var id = 0;
                if (record.docType == 'Customer Payment' || record.docType == 'Customer Refund' || record.docType == 'General Journal')
                {
                    id = record.detail_id;
                }
                else
                {
                    id = record.order_id;
                }
                $http
                    .post(updateUrl, { invoice_id: id, invoice_type:record.docType, 'token': $scope.$root.token, 'status':0, module_type:1 })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            record.on_hold = false;
                            record.on_hold_check = false;
                            record.on_hold_message = '';
                        }
                        else
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(106));

                    });
            }, function (reason) {
                //console.log('Modal promise rejected. Reason: ', reason);
                record.on_hold = true;
                record.on_hold_check = true;
            });
        }
        else
        {
            $scope.on_hold_comment = {};
                            
            $rootScope.modalChangeOnHoldStatusMessage = "Are you sure to want to make this entry on hold?";
            ngDialog.openConfirm({
            template: 'modalChangeOnHoldStatus',
            className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                
                var updateUrl = $scope.$root.gl + "chart-accounts/change-on-hold-status";
                // module_type = 1-> customer
                // module_type = 2-> supplier
                var id = 0;
                if (record.docType == 'Customer Payment' || record.docType == 'Customer Refund' || record.docType == 'General Journal')
                {
                    id = record.detail_id;
                }
                else
                {
                    id = record.order_id;
                }
                $http
                    .post(updateUrl, { invoice_id: id, invoice_type:record.docType, 'token': $scope.$root.token, 'status':1, module_type:1 })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            angular.element('#on_hold_comment').modal({ show: true });
                            
                            record.on_hold = true;
                            record.on_hold_check = true;
                
                            $scope.on_hold_comment.invoice_id = id;
                            $scope.on_hold_comment.invoice_type = record.docType;
                            $scope.on_hold_comment.module_type = 1;
                            $scope.on_hold_comment.index = index;
                            $scope.on_hold_comment.token = $scope.$root.token;
            
                        }
                        else
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(106));
                    });
            }, function (reason) {
                record.on_hold = false;
                record.on_hold_check = false;
                
                //console.log('Modal promise rejected. Reason: ', reason);
            });
        } */
    }
<<<<<<< HEAD
    $scope.clearOnHold = function()
    {
        $scope.on_hold_selected_data = {};
    }
    $scope.addOnHoldComment = function()
    {
        
        if($scope.on_hold_comment.comments != undefined && $scope.on_hold_comment.comments.length)
        {
=======
    $scope.clearOnHold = function() {
        $scope.on_hold_selected_data = {};
    }
    $scope.addOnHoldComment = function() {

        if ($scope.on_hold_comment.comments != undefined && $scope.on_hold_comment.comments.length) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            var updateUrl = $scope.$root.gl + "chart-accounts/add-comment-on-for-invoice-hold";
            // module_type = 1-> customer
            // module_type = 2-> supplier
            $scope.showLoader = true;
            $http
                .post(updateUrl, $scope.on_hold_comment)
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        $scope.showLoader = false;
                        toaster.pop('success', 'Success', 'Comment Added Successfully');
                        $scope.receipt_sub_list[$scope.on_hold_comment.index].on_hold_message = $scope.on_hold_comment.comments;
                        angular.element('#on_hold_comment').modal('hide');
<<<<<<< HEAD
                    }
                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(106));
                        $scope.showLoader = false;
                    }
                });
<<<<<<< HEAD
        }
        else
        {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(247, ['Comments']));
        }
    }
    $scope.postfianancedata = {};
<<<<<<< HEAD
    $scope.get_finance_entry_account = function () {
=======
    $scope.get_finance_entry_account = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var getaccountcompany = $scope.$root.setup + "general/get-financial-setting";
        $http
            .post(getaccountcompany, { 'token': $scope.$root.token, 'id': $scope.$root.defaultCompany })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true)
                    $scope.postfianancedata = res.data.response;
                else
                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(245, ['G/L Account(s) Setup for Foreign Currency Movement']));
            });
    }


<<<<<<< HEAD
    $scope.setremainingamount = function (item, param) {
        var amount2 = 0;
         
        if (item.is_infull == true) {
            var tempAmount = item.amount;
            if ((item.grand_total - item.paid_amount) == 0)
            {   
                item.amount = item.grand_total;
            }
            else if (item.grand_total - item.paid_amount > 0)
            {
                item.amount = (item.grand_total - item.paid_amount);
            }

            if ($scope.amount_left < item.amount)
            {
           
                if (tempAmount != undefined && tempAmount !='')
                {
                
                item.amount = Number($scope.amount_left) + tempAmount;
                }
                else{
             
                item.amount = Number($scope.amount_left);
                }
            }
          

        }
        else if (item.amount != undefined) {
           
=======
    $scope.setremainingamount = function(item, param) {
        var amount2 = 0;

        if (item.is_infull == true) {
            var tempAmount = item.amount;
            if ((item.grand_total - item.paid_amount) == 0) {
                item.amount = item.grand_total;
            } else if (item.grand_total - item.paid_amount > 0) {
                item.amount = (item.grand_total - item.paid_amount);
            }

            if ($scope.amount_left < item.amount) {

                if (tempAmount != undefined && tempAmount != '') {

                    item.amount = Number($scope.amount_left) + tempAmount;
                } else {

                    item.amount = Number($scope.amount_left);
                }
            }


        } else if (item.amount != undefined) {

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if ((item.grand_total - item.paid_amount) == 0)
                item.amount = 0;
            else if (item.grand_total - item.paid_amount > 0)
                amount2 = (item.grand_total - item.paid_amount);

            if (item.amount > Number(amount2))
                item.amount = Number(amount2);

        }

<<<<<<< HEAD
        if(param != undefined && param == 1)
        {
=======
        if (param != undefined && param == 1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (item.is_infull == false)
                item.amount = '';

        }
        // if ($scope.amount_left < item.amount)
        //     item.amount = Number($scope.amount_left);

<<<<<<< HEAD
        if(Number(item.amount) > 0)
        {
=======
        if (Number(item.amount) > 0) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            item.amount = item.amount.toFixed(2);
            item.amount = Number(item.amount);
        }

    }

<<<<<<< HEAD
    $scope.get_payed_list = function (item) {
=======
    $scope.get_payed_list = function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.Recipt_payed = [];
        $scope.title_payed = 'Invoice Payment';
        $scope.item_detail = item;
        $scope.postData = {};
<<<<<<< HEAD
        $scope.postData.invoice = item.id;//item.account_id;
=======
        $scope.postData.invoice = item.id; //item.account_id;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.postData.token = $scope.$root.token;
        $scope.postData.more_fields = 1;
        var personUrledit = $scope.$root.gl + "chart-accounts/get-invoice-receipt-payment";

        $http
            .post(personUrledit, $scope.postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.Recipt_payed = res.data.response;
                    //         angular.element('#RecptAccountpop').modal({show: true});
                    angular.element('#RecptAccountpop_payed_list').modal({ show: true });
<<<<<<< HEAD
                }

                else
=======
                } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });
    }

<<<<<<< HEAD
    $scope.deletepayedlist = function (id, index, arry) {
=======
    $scope.deletepayedlist = function(id, index, arry) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
        }).then(function (value) {
=======
        }).then(function(value) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            var delUrl = $scope.$root.gl + "chart-accounts/delete-invoice-receipt-payment";

            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        arry.splice(index, 1);

<<<<<<< HEAD
                    }
                    else
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));

                });
        }, function (reason) {
=======
                    } else
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));

                });
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            //console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    $scope.current_currency_id = {};
    $scope.array_receipt_gl_form = {};
    $scope.array_receipt_gl_form.type = 1;
    //Balance Reciept Account Finish


    $scope.history_salespersons = {};
    $scope.columns_history = [];
    $scope.history_title = "";
    $scope.history_type = "";
<<<<<<< HEAD
    $scope.historytype = function (type) {
=======
    $scope.historytype = function(type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.history_type = type;

        $scope.showLoader = true;

        var Url = $scope.$root.sales + "crm/crm/crm-history";
        if (type == "Salespersons") {
            $scope.history_title = "Salesperson History";
        } else if (type == "CreditLimit") {
            $scope.history_title = "Credit Range History";
        } else if (type == "Status") {
            $scope.history_title = "Status History";
        }

        var postData = {
            'token': $scope.$root.token,
            'crm_id': $scope.$root.crm_id,
            'type': type
        };
        $http
            .post(Url, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (res.data.ack == true) {

                    $scope.crm_history = {};
                    $scope.columns_history = [];
                    $scope.crm_history = res.data.response;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columns_history.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    $('#history_modal').modal({ show: true });
                } else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                    $scope.crm_history = {};
                }

                $scope.showLoader = false;

            });
    };


    $scope.$root.load_date_picker('customer');

    $scope.item_paging = {};
<<<<<<< HEAD
    $scope.itemselectPage = function (pageno) {
=======
    $scope.itemselectPage = function(pageno) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.item_paging.spage = pageno;
    };
    $scope.$root.set_document_internal($scope.$root.hr_general_module);

<<<<<<< HEAD
    $scope.row_id = 0;//$stateParams.id;
=======
    $scope.row_id = 0; //$stateParams.id;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    $scope.module_id = 19;
    $scope.subtype = 1;
    $scope.module = "Sales & Customer";
    $scope.module_name = "Customer";
    //$scope.$root.model_code  =
    //alert($scope.showLoader);  return;
    $scope.$root.$broadcast("image_module", $scope.row_id, $scope.module, $scope.module_id, $scope.module_name, $scope.module_code, $scope.subtype, $scope.$root.tab_id);


<<<<<<< HEAD
}
=======
}
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
