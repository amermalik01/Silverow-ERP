QuotesController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];

myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.quotes', {
                url: '/quotes',
                title: 'quotes',
                templateUrl: helper.basepath('quotes/quotes.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.addQuote', {
                url: '/quotes/add',
                title: 'Add Quote',
                templateUrl: helper.basepath('quotes/_form.html'),
                controller: 'QuoteEditController',
                resolve: helper.resolveFor('ngTable', 'ngDialog')

            })
            .state('app.viewQuote', {
                url: '/quotes/:id/view',
                title: 'View Quote',
                templateUrl: helper.basepath('quotes/_form.html'),
                controller: 'QuoteEditController'
            })
            .state('app.editQuote', {
                url: '/quotes/:id/edit',
                title: 'Edit Quote',
                templateUrl: helper.basepath('quotes/_form.html'),
                resolve: angular.extend(helper.resolveFor('ngDialog'), {
                    tpl: function () {
                        return {path: helper.basepath('ngdialog-template.html')};
                    }
                }),
                controller: 'QuoteEditController'
            })
    }]);

myApp.controller('QuotesController', QuotesController);
myApp.controller('QuoteEditController', QuoteEditController);
myApp.controller('QuoteTabController', QuoteTabController);


function QuotesController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams) {
    'use strict';
    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            {'name': 'Setup', 'url': '#', 'isActive': false},
            {'name': 'Sales', 'url': '#', 'isActive': false},
            {'name': 'Customer', 'url': 'app.customer', 'isActive': false},
            {'name': 'Quotes', 'url': '#', 'isActive': false}];

    var vm = this;
    var Api = $scope.$root.sales + "customer/quote/listings";


    $scope.rec = {};
    $scope.data = {};
    $scope.getrecord = function (item_paging, sort_column, sortform) {

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        if (item_paging == 1)
            $scope.item_paging.spage = 1;
        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        //  $scope.postData.searchKeyword = $scope.searchKeyword.$;
        // $scope.postData.deprtments = $scope.searchKeyword.deprtment !== undefined ? $scope.searchKeyword.deprtment.id : 0;
        // $scope.postData.emp_types = $scope.searchKeyword.emp_type !== undefined ? $scope.searchKeyword.emp_type.id : 0;
        //  $scope.postData.filter_status = $scope.searchKeyword.status !== undefined ? $scope.searchKeyword.status.id : "";
        //  $scope.postData.job_titles = $scope.searchKeyword.job_title !== undefined ? $scope.searchKeyword.job_title.id : 0;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.data = {};
        }


        $scope.showLoader = true;
        $timeout(function () {
            $http
                .post(Api, $scope.postData)
                .then(function (res) {
                    $scope.columns = [];
                    $scope.data = {};
                    if (res.data.ack == true) {

                        $scope.total = res.data.total;
                        $scope.item_paging.total_pages = res.data.total_pages;
                        $scope.item_paging.cpage = res.data.cpage;
                        $scope.item_paging.ppage = res.data.ppage;
                        $scope.item_paging.npage = res.data.npage;
                        $scope.item_paging.pages = res.data.pages;

                        $scope.total_paging_record = res.data.total_paging_record;

                        $scope.data = res.data.response;

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
                    //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                });

            $scope.showLoader = false;
        }, 1000);


    }
    $scope.getrecord(1);
    $scope.$root.itemselectPage(1);


    $scope.$data = {};
    $scope.delete = function (id, index, $data) {
        var delUrl = $scope.$root.sales + "customer/quote/delete-quote";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {id: id, 'token': $scope.$root.token})
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
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

function QuoteEditController($scope, $stateParams, $http, $state, $resource, toaster, ngDialog, $rootScope, $timeout) {


    if ($stateParams.id > 0)
        $scope.check_readonly = true;

    $scope.showEditForm = function () {
        $scope.check_readonly = false;
        $scope.show_recieve_list = false;
    }


    $scope.submit_show_invoicee = true;

    $scope.rec = {};
    $scope.rec.crm_id = false;
    $scope.rec.id = $stateParams.id;
    $scope.rec.crm_id = $stateParams.id;


    if ($stateParams.id != undefined)
        angular.element('#quotes_tabs ul li').removeClass('dont-click');


    // $rootScope.get_currency_list();
    $scope.arr_sublistcurrency = {};

    $scope.arr_sublistcurrency = $rootScope.arr_currency;


    if (($stateParams.id == undefined))
        $scope.rec.currency_id = $rootScope.get_obj_frm_arry($scope.arr_sublistcurrency, $scope.$root.defaultCurrency);


    //	$rootScope.get_country_list();
    // $rootScope.get_country_list();


    $scope.arrSalesperson = [];
    $scope.$on("myEvent", function (event, args) {
        if (args.order_id != undefined)
            $stateParams.id = args.order_id;
        if (args.arr_contact != undefined) {
            $scope.rec.bill_to_contact_no = args.arr_contact.sell_to_contact_no;
            $scope.rec.bill_to_contact_id = args.arr_contact.contact_id;
        }
        if (args.objCust != undefined) {
            $scope.rec.id = args.objCust.order_id;
            $scope.rec.bill_to_cust_no = args.objCust.sell_to_cust_no;
            $scope.rec.bill_to_cust_id = args.objCust.bill_to_cust_id;
            $scope.rec.bill_to_name = args.objCust.bill_to_customer;
            $scope.rec.bill_to_address = args.objCust.bill_to_address;
            $scope.rec.bill_to_address2 = args.objCust.bill_to_address2;
            $scope.rec.bill_to_city = args.objCust.bill_to_city;
            $scope.rec.bill_to_county = args.objCust.bill_to_county;
            $scope.rec.bill_to_post_code = args.objCust.bill_to_post_code;
            /// shipping
            $scope.rec.ship_to_name = args.objCust.bill_to_customer;
            $scope.rec.ship_to_address = args.objCust.bill_to_address;
            $scope.rec.ship_to_address2 = args.objCust.bill_to_address2;
            $scope.rec.ship_to_city = args.objCust.bill_to_city;
            $scope.rec.ship_to_county = args.objCust.bill_to_county;
            $scope.rec.ship_to_post_code = args.objCust.bill_to_post_code;
        }
        return false;
    });
    $scope.class = 'block';
    //$scope.check_readonly = false;


    $scope.$root.quote_id = $stateParams.id;
    $scope.arr_payment_terms = {};
    $scope.arr_payment_terms = $rootScope.arr_payment_terms;
    $scope.arr_payment_methods = $rootScope.arr_payment_methods;

    /*var getPaymentTerms = $scope.$root.setup + "crm/get-payment-terms-list";
     var getPaymentMethods = $scope.$root.setup + "crm/get-payment-methods-list";

     $http
     .post(getPaymentTerms, {token: $scope.$root.token})
     .then(function (res) {
     $scope.arr_payment_terms = res.data.response;
     });
     $http
     .post(getPaymentMethods, {token: $scope.$root.token})
     .then(function (res) {
     $scope.arr_payment_methods = res.data.response;
     });
     */


    $scope.getCustomer3 = function () {
        $scope.columns = [];
        $scope.record = {};
        var custUrl = $scope.$root.sales + "customer/customer/listings";
        var custUrl2 = $scope.$root.sales + "customer/customer/check-customer-limit";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
            'more_fields': "currency_id*credit_limit*address_2*fax*email"
        };
        $http
            .post(custUrl, postData)
            .then(function (res) {
                $scope.columns = res.data.columns;
                $scope.record = res.data.record.result;
            });

        $scope.animationsEnabled = true;


        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'customerModalDialogId',
            controller: 'ModalInstanceCtrl',
            resolve: {
                columns: function () {
                    return $scope.columns;
                },
                record: function () {
                    return $scope.record;
                }
            }
        });
    }

    $scope.arrSalesperson = [];


    $scope.searchKeyword_cust = {};
    $scope.getCustomer = function (item_paging) {
//$scope.showLoader = true;
        $scope.title = 'Customer Listing';
        //  $scope.columns = [];
        $scope.record = {};
        var custUrl = $scope.$root.sales + "customer/customer/popup-listing";
        /* var custUrl2 = $scope.$root.sales + "customer/customer/check-customer-limit";
         var postData = {
         'token': $scope.$root.token,
         'all': "1",
         'type':"99"
         };*/
        $scope.postData = {};


        $scope.postData.token = $scope.$root.token;
        $scope.postData.all = 1;
        $scope.postData.type = 99;

        if (item_paging == 1)
            $rootScope.item_paging.spage = 1;

        $scope.postData.page = $rootScope.item_paging.spage;
        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;
        $scope.postData.searchKeyword_cust = $scope.searchKeyword_cust.$;

        if ($scope.searchKeyword_cust.region !== undefined && $scope.searchKeyword_cust.region !== null) {
            $scope.postData.regions = $scope.searchKeyword.region.id;
        }

        if ($scope.searchKeyword_cust.segment !== undefined && $scope.searchKeyword_cust.segment !== null)
            $scope.postData.segments = $scope.searchKeyword_cust.segment.id;

        if ($scope.searchKeyword_cust.buying_group !== undefined && $scope.searchKeyword_cust.buying_group !== null)
            $scope.postData.buying_groups = $scope.searchKeyword_cust.buying_group.id;


        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword_cust = {};
            $scope.record_data = {};
        }


        $scope.showLoader = true;
        $timeout(function () {
            $http
                .post(custUrl, $scope.postData)
                .then(function (res) {
                    $scope.columns = [];
                    // $scope.columns = res.data.columns;
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record;
                    //$scope.showLoader = false;

                    $scope.record = res.data.response;
                    angular.element('#customer_modal_single').modal({show: true});
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                });

            $scope.showLoader = false;
        }, 1000);


    }

    $scope.confirmCustomer = function (result) {
        angular.element('#customer_modal_single').modal('hide');

//        $scope.arrSalesperson = [];
//        $scope.arrSalesperson.push(result.internal_sales);
//        $scope.arrSalesperson.push(result.salesperson_id);
//        $scope.arrSalesperson.push(result.support_person);
//        $scope.rec.sale_person_id = result.salesperson_id;
//        //console.log(result.salesperson_id);
//        var empUrl = $scope.$root.hr + "employee/get-employee";
//        if (result.salesperson_id > 0) {
//            $http
//                 .post(empUrl, {id: result.salesperson_id, 'token': $scope.$root.token})
//                 .then(function (emp_data) {
//                     if (emp_data.data.ack == true)
//                         $scope.rec.sale_person = emp_data.data.response.first_name + ' ' + emp_data.data.response.last_name;
//                 });
//        }
        //console.log(result);
        var objCust = {};
        angular.forEach(result, function (index, elem) {
            console.log(elem);

            if (index == 'code')
                $scope.rec.sell_to_cust_no = objCust.sell_to_cust_no = elem;

            if (index == 'title')
                $scope.rec.sell_to_cust_name = objCust.bill_to_customer = elem;

            $scope.$root.$broadcast("myEvent", {bill_to_customer: elem});

            if (index == 'address_2')
                $scope.rec.sell_to_address = objCust.bill_to_address = elem;
            if (index == 'address_2')
                $scope.rec.sell_to_address2 = objCust.bill_to_address2 = elem;
            if (index == 'city')
                $scope.rec.sell_to_city = objCust.bill_to_city = elem;
            if (index == 'county')
                $scope.rec.sell_to_county = objCust.bill_to_county = elem;
            if (index == 'postcode')
                $scope.rec.sell_to_post_code = objCust.bill_to_post_code = elem;
            /*if(index == 'phone')
             $scope.rec.cust_phone= objCust.cust_phone  = elem;
             if(index == 'fax')
             $scope.rec.cust_fax= objCust.cust_fax  = elem;
             if(index == 'email')
             $scope.rec.cust_email = objCust.cust_email = elem;*/

            if (index == 'currency_id') {

                $scope.rec.currency_id = $rootScope.get_obj_frm_arry($scope.arr_sublistcurrency, elem);
            }


            if (index == 'country_id') {
                console.log(elem);

                $scope.rec.country_ids = $rootScope.get_obj_frm_arry($rootScope.country_type_arr, elem);

            }

        });
        $scope.rec.sell_to_cust_id = objCust.bill_to_cust_id = result.id;
        //console.log(result.id);
        // $scope.getAltContactByCustomer(result.id);

//     /   $scope.$root.$broadcast("myEvent", {objCust: objCust});

        // console.log(result.alldata);

        $rootScope.rec.account_payable_number = result.alldata.account_payable_number;
        $rootScope.rec.account_payable_id = result.alldata.account_payable_id;

        $scope.$root.$broadcast("setBillToCustomer", {bill_to_cust: objCust.bill_to_customer, id: result.id});
        /* var finUrl = $scope.$root.sales + "customer/customer/get-finance-by-customer-id";
         $http
         .post(finUrl, {customer_id: result.id, token: $scope.$root.token})
         .then(function (fres) {
         $scope.rec.account_payable_number = fres.data.response.account_payable_number;
         $scope.rec.account_payable_id = fres.data.response.account_payable_id;
         });

         */

    }


    $scope.getAltContactByCustomer = function (crm_id) {
//	console.log('crm_id ============>>'+$scope.$root.crm_id);
        $scope.postData = {'crm_id': crm_id, token: $scope.$root.token}
        var ApiAjax = $scope.$root.sales + "crm/crm/get-alt-contacts-list";
        $http
            .post(ApiAjax, $scope.postData)
            .then(function (alt_res) {
                if (alt_res.data.ack == true) {
                    $scope.rec.sell_to_contact_no = alt_res.data.response[0].name;
                    $scope.rec.cust_phone = alt_res.data.response[0].phone;
                    $scope.rec.cust_fax = alt_res.data.response[0].fax;
                    $scope.rec.cust_email = alt_res.data.response[0].email;
                    $scope.rec.sell_to_contact_id = alt_res.data.response[0].id;
                }
            });

    }

    $scope.getCustomers = function () {
        $scope.title = 'Customer Listing';

        var custUrl = $scope.$root.sales + "customer/customer/listings";
        var custUrl2 = $scope.$root.sales + "customer/customer/check-customer-limit";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
            'more_fields': "currency_id*credit_limit*address_2*fax*email*city*county*postcode*phone"
        };
        $http
            .post(custUrl, postData)
            .then(function (res) {
                $scope.columns = res.data.columns;
                $scope.record = res.data.record.result;
            });

        ngDialog.openConfirm({
            template: 'modalDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope,
            size: 'lg'
        }).then(function (result) {
            //var check = checkCreditLimit(result.id);
            //if( check == 1){
            $.each(result, function (index, elem) {
                if (index == 'Code')
                    $scope.rec.bill_to_cust_no = elem;
                if (index == 'Name')
                    $scope.rec.bill_to_customer = elem;
                if (index == 'Address 1')
                    $scope.rec.bill_to_address = elem;
                if (index == 'address_2')
                    $scope.rec.bill_to_address2 = elem;
                if (index == 'City')
                    $scope.rec.bill_to_city = elem;
                if (index == 'County')
                    $scope.rec.bill_to_county = elem;
                if (index == 'Postcode')
                    $scope.rec.bill_to_post_code = elem;
            });
            $scope.rec.bill_to_cust_id = result.id;
            /*}
             else if(check == 2){
             toaster.pop('error', 'Error', 'Customer credit limit has not been set!');			
             }*/
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.getAltDepot = function () {
        $scope.title = 'Alt Depot';

        var ApiAjax = $scope.$root.sales + "crm/crm/alt-depots";
        var postData = {
            'column': 'crm_id', 'value': $scope.rec.bill_to_cust_id, token: $scope.$root.token,
            'more_fields': 'address*address_2*city,county,postcode'
        }

        $http
            .post(ApiAjax, postData)
            .then(function (res) {
                $scope.columns = res.data.columns;
                $scope.record = res.data.record.result;
            });
        ngDialog.openConfirm({
            template: 'modalDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (result) {
            $.each(result, function (index, elem) {
                if (index == 'Location Name')
                    $scope.rec.ship_to_name = elem;
                if (index == 'address')
                    $scope.rec.ship_to_address = elem;
                if (index == 'address_2')
                    $scope.rec.ship_to_address2 = elem;
                if (index == 'city')
                    $scope.rec.ship_to_city = elem;
                if (index == 'county')
                    $scope.rec.ship_to_county = elem;
                if (index == 'postcode')
                    $scope.rec.ship_to_post_code = elem;
            });
            $scope.rec.alt_depo_id = result.id;
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.getShipmentMethods = function () {
        $scope.title = 'Shipment Methods';
        var ApiAjax = $scope.$root.setup + "crm/shipment-methods";
        var postData = {token: $scope.$root.token}

        $http
            .post(ApiAjax, postData)
            .then(function (res) {
                $scope.columns = res.data.columns;
                $scope.record = res.data.record.result;
            });
        ngDialog.openConfirm({
            template: 'modalDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (result) {
            $.each(result, function (index, elem) {
                if (index == 'Description')
                    $scope.rec.shipment_method_code = elem;
            });
            $scope.rec.shipment_method_id = result.id;
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.getShippingAgents = function () {
        $scope.title = 'Shipping Agents';
        var ApiAjax = $scope.$root.setup + "crm/shipping-agents";
        var postData = {token: $scope.$root.token}

        $http
            .post(ApiAjax, postData)
            .then(function (res) {
                $scope.columns = res.data.columns;
                $scope.record = res.data.record.result;
            });
        ngDialog.openConfirm({
            template: 'modalDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (result) {
            $.each(result, function (index, elem) {
                if (index == 'Name')
                    $scope.rec.shipping_agent_code = elem;
            });
            $scope.rec.shipping_agent_id = result.id;
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    var checkCreditLimit = function (id) {
        $resource('api/company/check_customer_limit/:id')
            .get({id: id}, function (data) {
                if (data == false) {
                    return 1;
                }
                else {
                    $scope.credit_limit = data.credit_limit;
                    $scope.balance = data.balance;
                }
            });

        ngDialog.openConfirm({
            template: 'checkCreditLimit',
            className: 'ngdialog-theme-default',
            scope: $scope,
            size: 'lg'
        }).then(function (result) {
            return 2;
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
            return 3;
        });
    }

    $scope.getAltContact = function () {
        $scope.columns = [];
        $scope.record = {};
        var altContactUrl = $scope.$root.sales + "crm/crm/alt-contacts";
        $scope.title = 'Alt Contact';
        var id = $scope.rec.sell_to_cust_id;
        var postAltCData = {
            'column': 'crm_id',
            'value': $scope.rec.sell_to_cust_id != undefined ? $scope.rec.sell_to_cust_id : '0',
            'token': $scope.$root.token,
            'more_fields': 'phone*fax'
        }
        $http
            .post(altContactUrl, postAltCData)
            .then(function (res) {
                $scope.columns = res.data.columns;
                $scope.record = res.data.record.result;
            });
        ngDialog.openConfirm({
            template: 'modalDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (result) {
            var arr_contact = {};
            $.each(result, function (index, elem) {
                /*if(index == 'Code')
                 $scope.sell_to_contact_no = arr_contact.sell_to_contact_no = elem;*/
                if (index == 'Contact Name') {
                    $scope.rec.sell_to_contact_no = arr_contact.sell_to_contact_no = elem;
                    arr_contact.contact_person = elem;
                }
                if (index == 'Email')
                    $scope.rec.cust_email = arr_contact.email = elem;
                if (index == 'phone')
                    $scope.rec.cust_phone = arr_contact.phone = elem;
                if (index == 'fax')
                    $scope.rec.cust_fax = arr_contact.fax = elem;

                arr_contact.contact_id = result.id;
                $scope.$root.$broadcast("myEvent", {arr_contact: arr_contact});
            });
            $scope.rec.sell_to_contact_id = result.id;
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }


    $scope.columns = [];
    $scope.getSalePerson = function (arg) {
        $scope.columns = [];
        $scope.record = {};
        $scope.title = 'Salesperson';
        var empUrl = $scope.$root.hr + "employee/listings";
        postData = {
            'token': $scope.$root.token,
            'all': "1",
            'ids': $scope.arrSalesperson
        };
        $http
            .post(empUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.columns = [];
                    $scope.record = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
                else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });

        ngDialog.openConfirm({
            template: 'modalDialogId2',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (result) {
            $scope.rec.sale_person = result.first_name + ' ' + result.last_name;
            $scope.rec.sale_person_id = result.id;
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }


    $scope.getCode_Quote = function (rec) {
        var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
        var name = $scope.$root.base64_encode('quotations');
        var no = $scope.$root.base64_encode('quotation_no');

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
                'type': '',
                'status': ''
            })
            .then(function (res) {

                if (res.data.ack == 1) {
                    $scope.showLoader = false;
                    $scope.rec.quotation_code = res.data.code;
                    $scope.rec.quotation_no = res.data.nubmer;

                    $scope.count_result++;


                    if ($scope.count_result > 0) {
                        //  console.log($scope.count_result);
                        return true;
                    } else {
                        //    console.log($scope.count_result + 'd');
                        return false;
                    }

                } else {
                    toaster.pop('error', 'info', res.data.error);
                    return false;
                }
            });


    }
    if ($stateParams.id == undefined)
        $scope.getCode_Quote();


    if ($scope.rec.quote_date == undefined)
        $scope.rec.quote_date = $scope.$root.get_current_date();

    $scope.$root.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            // {'name':'Setup','url':'#','isActive':false},
            {'name': 'Sales', 'url': '#', 'isActive': false},
            {'name': 'Quotes', 'url': 'app.quotes', 'isActive': false}];

//    $scope.formUrl = function () {
//        return "app/views/quotes/_form.html";
//    }

    $scope.code = '';
    var id = $stateParams.id;

    $scope.getQuotedata = function () {

        var getQuoteUrl = $scope.$root.sales + "customer/quote/get-quote";
        $http
            .post(getQuoteUrl, {'id': id, 'token': $scope.$root.token})
            .then(function (res) {
                $scope.rec = res.data.response;
                //  console.log(res.data.response);

                //+$scope.getQuoteNo(res.data.response.quotation_no);
                /* var getCrmUrl = $scope.$root.sales + "customer/customer/get-customer";
                 $http
                 .post(getCrmUrl, {id: res.data.response.sell_to_cust_id, 'token': $scope.$root.token})
                 .then(function (result) {
                 $scope.arrSalesperson = [];
                 $scope.arrSalesperson.push(result.data.response.internal_sales);
                 $scope.arrSalesperson.push(result.data.response.salesperson_id);
                 $scope.arrSalesperson.push(result.data.response.support_person);
                 });

                 if (res.data.response.purchase_order_id != null) {
                 var getQuoteUrl = $scope.$root.pr + "srm/srminvoice/get-invoice";
                 $http
                 .post(getQuoteUrl, {id: res.data.response.purchase_order_id, token: $scope.$root.token})
                 .then(function (pRes) {
                 if (pRes.data.response.quotation_no < 10)
                 $scope.rec.purchase_order = 'PO00' + pRes.data.response.quotation_no;
                 else if (pRes.data.response.quotation_no > 10 && pRes.data.response.quotation_no < 100)
                 $scope.rec.purchase_order = 'PO0' + pRes.data.response.quotation_no;
                 else
                 $scope.rec.purchase_order = 'PO' + pRes.data.response.quotation_no;
                 $scope.rec.purchase_order_id = pRes.data.response.id;
                 });
                 }*/

                $scope.$root.crm_id = res.data.response.sell_to_cust_id;

                $scope.$root.model_code = res.data.response.quotation_code;
                $scope.module_code = $scope.$root.model_code;

                $scope.$root.breadcrumbs.push({'name': $scope.$root.model_code, 'url': '#', 'isActive': false},
                    {'name': 'General', 'url': '#', 'isActive': false});


                if (res.data.response.posting_date == 0)
                    $scope.rec.posting_date = null;
                else
                    $scope.rec.posting_date = $scope.$root.convert_unix_date_to_angular(res.data.response.posting_date);

                if (res.data.response.offer_date == 0)
                    $scope.rec.order_date = null;
                else
                    $scope.rec.offer_date = $scope.$root.convert_unix_date_to_angular(res.data.response.offer_date);

                if (res.data.response.order_date == 0)
                    $scope.rec.order_date = null;
                else
                    $scope.rec.order_date = $scope.$root.convert_unix_date_to_angular(res.data.response.order_date);


                if (res.data.response.requested_delivery_date == 0)
                    $scope.rec.requested_delivery_date = null;
                else
                    $scope.rec.requested_delivery_date = $scope.$root.convert_unix_date_to_angular(res.data.response.requested_delivery_date);

                if (res.data.response.delivery_date == 0)
                    $scope.rec.delivery_date = null;
                else
                    $scope.rec.delivery_date = $scope.$root.convert_unix_date_to_angular(res.data.response.delivery_date);

                if (res.data.response.due_date == 0)
                    $scope.rec.due_date = null;
                else
                    $scope.rec.due_date = $scope.$root.convert_unix_date_to_angular(res.data.response.due_date);

                if (res.data.response.shipment_date == 0)
                    $scope.rec.shipment_date = null;
                else
                    $scope.rec.shipment_date = $scope.$root.convert_unix_date_to_angular(res.data.response.shipment_date);
                /*  if (res.data.response.bill_to_contact_id != undefined)
                 $scope.rec.bill_to_contact_no = $scope.Contprefix + $scope.getOrderNo(res.data.response.bill_to_contact_id);*/
                if (res.data.response.quote_date == 0)
                    $scope.rec.quote_date = null;
                else
                    $scope.rec.quote_date = $scope.$root.convert_unix_date_to_angular(res.data.response.quote_date);


//                         if (res.data.response.bill_to_contact_id != undefined)
//                             $scope.rec.bill_to_contact_no = $scope.Contprefix + $scope.getQuoteNo(res.data.response.bill_to_contact_id);

                $scope.rec.currency_id = $rootScope.get_obj_frm_arry($scope.arr_sublistcurrency, $scope.rec.currency_id);
                $scope.rec.payment_terms_codes = $rootScope.get_obj_frm_arry($rootScope.arr_payment_terms, res.data.response.payment_terms_code);
                $scope.rec.payment_method_ids = $rootScope.get_obj_frm_arry($rootScope.arr_payment_methods, res.data.response.payment_method_id);
                $scope.rec.country_ids = $rootScope.get_obj_frm_arry($rootScope.country_type_arr, res.data.response.country_id);
                $scope.$root.customer_country = $scope.rec.country_ids;


                $scope.$root.$broadcast("quoteTabEvent", res.data.response.comment);

                $scope.rec.type2 = $scope.rec.type;


                $scope.$root.currency_id = res.data.response.currency_id;
                $scope.$root.posting_date = res.data.response.quote_date;

//                 if ($scope.rec.type2 == 3) {
//                     link_order = 'app.sale-invoice';
//                     name_link = 'Invoice';
//                 }

                //     console.log($scope.rec.items);

                if ($scope.rec.items[0])
                    $scope.$root.$broadcast("quotesDetail", $scope.rec.items);


            });


    }
    if ($stateParams.id != undefined)
        $scope.getQuotedata();


    $scope.general_information = function () {
        $scope.$root.breadcrumbs[3].name = 'General';
    }

    $scope.invoice_information = function () {
        console.log($scope.$root.breadcrumbs)
        $scope.$root.breadcrumbs[3].name = 'Invoice';
    }
    $scope.shiping_information = function () {
        $scope.$root.breadcrumbs[3].name = 'Shipping';
    }


    $scope.add_general = function (rec) {

        if ($stateParams.id != undefined)
            var addQuoteUrl = $scope.$root.sales + "customer/quote/update-quote";
        else
            var addQuoteUrl = $scope.$root.sales + "customer/quote/add-quote";

        rec.token = $scope.$root.token;
        rec.id = $stateParams.id;
        rec.type = 1;
        rec.payment_terms_code = rec.payment_terms_codes != undefined ? rec.payment_terms_codes.id : 0;
        rec.payment_method_id = rec.payment_method_ids != undefined ? rec.payment_method_ids.id : 0;
        rec.country_id = rec.country_ids != undefined ? rec.country_ids.id : 0;
        rec.currency_ids = rec.currency_id != undefined ? rec.currency_id.id : 0;

        $scope.$root.currency_id = rec.currency_ids;
        $scope.$root.posting_date = rec.quote_date;

        /*
         $scope.$root.$broadcast("shift1",rec.bill_to_cust_no,rec.ship_to_name,rec.invoice_date,rec.requested_delivery_date
         ,rec.comm_book_in_no,rec.type,rec.order_code,rec.payable_number,rec.purchase_number);
         */


        $http
            .post(addQuoteUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $scope.$root.crm_id = rec.sell_to_cust_id;
                    //console.log( res.data.id);
                    angular.element('#quotes_tabs ul li').removeClass('dont-click');
                    if ($stateParams.id == undefined)
                        $state.go("app.editQuote", {id: res.data.id});
                }
                else {
                    toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
                }
            });


    }

    $scope.pOrders = [];
    $scope.getPurchaseOrders = function () {
        var ordrUrl = $scope.$root.pr + "srm/srminvoice/listings";
        $http
            .post(ordrUrl, {'all': 1, type: 3, token: $scope.$root.token})
            .then(function (res) {
                $scope.pOrders = res.data.response;
            });
        angular.element('#purchaseOrderModal').modal({show: true});
    }

    $scope.addPurchaseOrder = function (ordr) {
        $scope.rec.purchase_order = ordr.code;
        $scope.rec.purchase_order_id = ordr.id;
        angular.element('#purchaseOrderModal').modal('hide');
    }


    $scope.$root.load_date_picker('sale order');
}


function QuoteTabController($scope, $rootScope, $stateParams, $http, $state, $resource, toaster, ngDialog, $timeout, myService) {


    if ($stateParams.id > 0)
        $scope.check_readonly = true;

    $scope.showEditForm = function () {
        $scope.check_readonly = false;
        $scope.show_recieve_list = false;
    }


    $scope.submit_show_invoicee = true;

    //  { 'label': 'Service(s)', 'value': 2   },
    $scope.arrItems = [{'label': ' ', 'value': 3}, {'label': 'Item(s)', 'value': 0}, {
        'label': 'G/L Account',
        'value': 1
    }];


    $scope.default_currency_code = $rootScope.defaultCurrencyCode;
    $scope.company_name = $rootScope.company_name;
    $scope.currency_code = '';
    $scope.products = [];
    $scope.items = [];
    $scope.arr_categories = {};
    $scope.recs = {};

    $scope.wordsLength = 0;
    $scope.enable_btn_submit = false;
    $scope.rec.item_types = $scope.arrItems[0];

//    $scope.$on("quoteTabEvent", function (event, comment) {
//        $scope.rec.note = comment;
//        $scope.wordsLength = comment.length;
//    });
    $scope.arr_units = [];
    $scope.arr_service_units = [];
    /* var unitUrl = $scope.$root.sales + "stock/unit-measure/units";
     $http
     .post(unitUrl, {'token': $scope.$root.token})
     .then(function (res) {
     if (res.data.ack == true) {
     $scope.arr_units = res.data.response;
     }
     });*/

    /*  var unitsUrl = $scope.$root.setup + "service/unit-measure/units";
     $http
     .post(unitsUrl, {'token': $scope.$root.token})
     .then(function (res) {
     if (res.data.ack == true) {
     $scope.arr_service_units = res.data.response;
     }
     });*/

    /*  $scope.arr_warehouse = [];
     var whUrl = $scope.$root.sales + "warehouse/get-all-list";
     $http
     .post(whUrl, {'token': $scope.$root.token})
     .then(function (res) {
     if (res.data.ack == true) {
     $scope.arr_warehouse = res.data.response;
     }
     });
     */


    $scope.arr_vat = $rootScope.arr_vat;


    //Edit and View

    var counter = 1;
    $scope.check_order_complete = $scope.check_readonly;

    //$scope.$on("QuoteTabEvent", function (event, args) {
    //if(counter == 1){
    if ($scope.$root.order_status == 'ORDER_COMPLETED')
        $scope.check_order_complete = 0;

    /*$resource('api/company/get_currency_code/:id')
     .get({id:$scope.$root.cust_currency_id},function(data){
     $scope.currency_code = data.code;
     });*/

    $scope.search_data = '';
    var drpCat = null;
    $scope.searchKeyword_pro = {};

    $scope.getProducts = function (recs, parm, item_paging, clr) {
        var cat_id = '';
        $scope.postData = {};

        $scope.showLoader = true;

        if (parm != '') {
            //$scope.postData = {'all': "1", token: $scope.$root.token, 'crm_id': $scope.$root.crm_id};
            $scope.postData.token = $scope.$root.token;
            $scope.postData.all = 1;
            $scope.postData.crm_id = $scope.$root.crm_id;
            recs.category = '';
            recs.search_data = '';
        }
        else {
            cat_id = recs.category != null ? recs.category.id : '';
            $scope.search_data = recs.search_data;
            /*  $scope.postData = {
             'search_string': $scope.search_data,
             'category_id': cat_id,
             'all': "1",
             token: $scope.$root.token,
             'crm_id': $scope.$root.crm_id
             };*/
            $scope.postData.crm_id = $scope.$root.crm_id;
            $scope.postData.token = $scope.$root.token;
            $scope.postData.category_id = cat_id;
            $scope.postData.search_string = $scope.search_data;
            $scope.postData.all = 1;

        }


        if (item_paging == 1)
            $rootScope.item_paging.spage = 1;

        $scope.postData.page = $rootScope.item_paging.spage;
        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;

        $scope.postData.searchKeyword_pro = $scope.searchKeyword_pro.$;

        if ($scope.searchKeyword_pro.category_name !== undefined && $scope.searchKeyword_pro.category_name !== null) {
            $scope.postData.category_names = $scope.searchKeyword_pro.category_name.id;
        }

        if ($scope.searchKeyword_pro.brand_name !== undefined && $scope.searchKeyword_pro.brand_name !== null)
            $scope.postData.brand_names = $scope.searchKeyword_pro.brand_name.id;

        if ($scope.searchKeyword_pro.unit !== undefined && $scope.searchKeyword_pro.unit !== null)
            $scope.postData.units = $scope.searchKeyword_pro.unit.id;


        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword_fin = {};
            $scope.record_data = {};
        }
        if (clr == 1) {
            $scope.searchKeyword_pro = {};
        }
        $scope.record = {};
        console.log($rootScope.prooduct_arr);
        //  var prodApi = $scope.$root.sales + "stock/products-listing/get-purchased-products-popup";
        /*  var prodApi = $scope.$root.stock + "products-listing/get-products-setup-list";
         $timeout(function () {
         $http
         .post(prodApi, $scope.postData)
         .then(function (res) {
         if (res.data.ack == true) {*/
        $scope.products = [];
        /* $scope.total = res.data.total;
         $scope.item_paging.total_pages = res.data.total_pages;
         $scope.item_paging.cpage = res.data.cpage;
         $scope.item_paging.ppage = res.data.ppage;
         $scope.item_paging.npage = res.data.npage;
         $scope.item_paging.pages = res.data.pages;
         $scope.total_paging_record = res.data.total_paging_record;*/
        $.each($rootScope.prooduct_arr, function (index, obj) {
            obj.chk = false;
            $scope.products[index] = obj;
        });

        /* }
         else {
         $scope.products = [];
         $scope.showLoader = false;
         }
         });*/
        $scope.showLoader = false;
        /*     }, 1000);*/

    }

    angular.element(document).on('click', '.checkAll', function () {
        if (angular.element('.checkAll').is(':checked') == true) {
            for (var i = 0; i < $scope.products.length; i++) {
                $scope.products[i].chk = true;
            }
        }
        else {
            for (var i = 0; i < $scope.products.length; i++) {
                $scope.products[i].chk = false;
            }
        }
        $scope.$root.$apply(function () {
            $scope.products;
        })
    });

    $scope.selectProd = function (id) {
        for (var i = 0; i < $scope.products.length; i++) {
            if (id == $scope.products[i].id) {
                if ($scope.products[i].chk == true)
                    $scope.products[i].chk = false
                else
                    $scope.products[i].chk = true
            }
        }
    }


    $scope.getServices = function (recs, parm) {
        var cat_id = '';
        if (parm != '') {
            $scope.postData = {'all': "1", token: $scope.$root.token};
            recs.category = '';
            recs.search_data = '';
        }
        else {
            cat_id = recs.category != null ? recs.category.id : '';
            $scope.search_data = recs.search_data;
            $scope.postData = {
                'search_string': $scope.search_data,
                'category_id': cat_id,
                'all': "1",
                token: $scope.$root.token
            };
        }

        $scope.record = {};
        var prodApi = $scope.$root.setup + "service/products-listing/get-products-popup";
        $http
            .post(prodApi, $scope.postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.products = [];
                    $.each(res.data.response, function (index, obj) {
                        obj.chk = false;
                        $scope.products[index] = obj;
                    });
                }
                else {
                    $scope.products = [];
                }
            });


    }


//------------- Gereral Ledgere -----------------

    $scope.category_list_final = {};
    $scope.category_sub = {};
    $scope.category_list_data_one = {};
    $scope.category_list_data_second = {};
    $scope.category_list_data_third = {};
    var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";

    $scope.selectItem = function (rec) {
        $scope.item_type = rec.item_types.value;
        if ($scope.item_type == 0) {
            var getListUrl = $scope.$root.sales + "stock/categories";
            $http
                .post(getListUrl, {'token': $scope.$root.token})
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.arr_categories = {};
                        $scope.arr_categories = res.data.response;
                    }
                });
            $scope.getProducts('', 'all');
            angular.element('#productModal').modal({show: true});
        }
        else if ($scope.item_type == 1) {
            $scope.gl_accounts(1, 77);
            angular.element('#accthead_modal').modal({show: true});

        }
        else if ($scope.item_type == 2) {
            var getListUrl = $scope.$root.setup + "service/categories/get-all-categories";
            $http
                .post(getListUrl, {'token': $scope.$root.token})
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.arr_categories = {};
                        $scope.arr_categories = res.data.response;
                    }
                });
            $scope.getServices('', 'all');
            angular.element('#serviceModal').modal({show: true});
        }
    }
    $scope.searchKeyword_sup_gl_code = {};

    $scope.gl_accounts = function (item_paging, clr) {
        //console.log($scope.item_type);
        $scope.showLoader = true;
        $scope.postData = {};

        //{'token': $scope.$root.token, 'display_id': 10}

        $scope.postData.token = $scope.$root.token;
        $scope.postData.display_id = 10;

        if (item_paging == 1)
            $rootScope.item_paging.spage = 1;
        $scope.postData.page = $rootScope.item_paging.spage;

        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;

        $scope.postData.searchKeyword = "";

        $scope.postData.searchKeyword = $scope.searchKeyword_sup_gl_code.$;
        if (clr == 77) {
            $scope.searchKeyword_sup_gl_code = {};
        }

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }
        var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";
        $timeout(function () {
            $http
                .post(postUrl_cat, $scope.postData)
                .then(function (res) {
                    if (res.data.ack == true)
                        $scope.gl_account = res.data.response;
                    $scope.category_sub = res.data.response_new;
                    $scope.category_list_data_one = res.data.response_account;
                    $scope.category_list_data_second = res.data.response_account;
                    $scope.category_list_data_third = res.data.response_account;
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record;
                });
            $scope.showLoader = false;
        }, 1000);
    }

    $scope.show_add_pop = function (id) {

        var DetailsURL = $scope.$root.gl + "chart-accounts/get-account-heads";
        $http
            .post(DetailsURL, {'token': $scope.$root.token, 'gl_id': id})
            .then(function (res) {
                if (res.data.ack == true) {

                    $scope.acItem = {};
                    $scope.acItem.item_code = res.data.response.number;
                    $scope.acItem.description = res.data.response.name;
                    $scope.acItem.item_type = 1;
                    $scope.acItem.qty = 1;
                    $scope.acItem.Price = 0;
                    $scope.acItem.Vat = res.data.response.vat_list_id;

                    $.each($rootScope.arr_vat, function (index, obj) {
                        if (obj.id == $scope.acItem.Vat)
                            $scope.acItem.vats = obj;
                    });

                    $scope.items.push($scope.acItem);
                    ///$scope.$root.return_status = true;
                }
            });

        $('#accthead_modal').modal('hide');

    };


    $scope.add_gl_account_values = function (gl_data) {


        $scope.acItem = {};
        $scope.acItem.product_id = gl_data.id;
        $scope.acItem.id = gl_data.id;
        $scope.acItem.product_code = gl_data.code;
        $scope.acItem.description = gl_data.name;
        $scope.acItem.product_name = gl_data.name;
        $scope.acItem.item_type = 1;
        $scope.acItem.qty = 1;
        $scope.acItem.Price = "";
        //$scope.acItem.arr_vat = "";

        $scope.acItem.arr_units = [];
        var gl_unitUrl_item = $scope.$root.setup + "general/get-all-gl-units-of-measure";
        $http
            .post(gl_unitUrl_item, {'token': $scope.$root.token})
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.acItem.arr_units = res.data.response;
                }
            });

        $.each($rootScope.arr_vat, function (index, obj) {
            if (obj.id == gl_data.vat_id)
                $scope.acItem.vats = obj;
        });

        // console.log($scope.acItem);
        $scope.items.push($scope.acItem);
        $scope.show_recieve_list = false;

        angular.element('#accthead_modal').modal('hide');
    };

    $scope.showWordsLimits_invoice = function () {
        $scope.wordsLength = $scope.rec.note.length;
    }


    $scope.addProduct = function () {
        //var return_value;
        if ($scope.rec.item_types.value == 0) {

            $.each($scope.products, function (index, prodData) {
                if (prodData.chk == true) {


                    if ($scope.$root.crm_id == 0) {
                        toaster.pop('error', 'Error', 'Please select customer first!');
                        //return false;
                        $scope.$root.return_status = false;
                    }


                    prodData.item_type = $scope.rec.item_types.value;
                    //prodData.arr_units = [];
                    /*     var finApi = $scope.$root.sales + "customer/customer/get-finance-by-customer-id";
                     $http
                     .post(finApi, {'customer_id': $scope.$root.crm_id, token: $rootScope.token})
                     .then(function (res) {
                     if (res.data.ack == true) {
                     */

                    /*   var vatApi = $scope.$root.setup + "ledger-group/get-vat";
                     $http
                     .post(vatApi, {token: $rootScope.token, 'id': prodData.vat_rate_id})
                     .then(function (vtData) {*/


                    /*   prodData.vat = $rootScope.arr_vat.vat_name;
                     prodData.vat_value = $rootScope.arr_vat.vat_value;
                     prodData.vat_id =  $rootScope.arr_vat.id;*/
                    prodData.qty = 1;
                    prodData.sale_unit_id = prodData.unit_id;
                    prodData.purchase_unit_id = prodData.purchase_measure;
                    //prodData.unit_parent = umData.data.response.parent_id;
                    /*prodData.arr_units = prodData.arr_units.response;
                    prodData.arr_warehouse = prodData.arr_warehouse.response;*/

                    prodData.arr_units = [];
                    var unitUrl_item = $scope.$root.stock + "unit-measure/get-unit-setup-list-category";
                    $http
                        .post(unitUrl_item, {
                            'token': $scope.$root.token,
                            'product_id': prodData.id
                        })
                        .then(function (res) {
                            if (res.data.ack == true) {
                                prodData.arr_units = res.data.response;
                                // prodData.units = $scope.arr_units[0];
                            }
                        });

                    prodData.prod_default_warehouse = 0;

                    prodData.arr_prod_warehouse = [];
                    var prod_whUrl = $scope.$root.setup + "warehouse/get-all-product-warehouses";

                    $http
                        .post(prod_whUrl, {
                            'token': $scope.$root.token,
                            'prod_id': prodData.id
                        })
                        .then(function (res) {
                            if (res.data.ack == true) {
                                prodData.arr_prod_warehouse = res.data.response;
                                prodData.prod_default_warehouse = res.data.default_wh;

                                angular.forEach(prodData.arr_prod_warehouse, function (obj) {
                                    if (obj.id == prodData.prod_default_warehouse)
                                        prodData.warehouses = obj;
                                });
                            } else
                                toaster.pop('error', 'info', 'Please assign Warehouse Storage location to this Item first.');

                        });
                    // $scope.arr_warehouse = prodData.arr_warehouse.response;


                    /*  prodData.arr_units = [];
                     var unitUrl_item = $scope.$root.sales + "stock/unit-measure/get-unit-setup-list-category";
                     $http
                     .post(unitUrl_item, {'token': $scope.$root.token, 'item_id': prodData.id})
                     .then(function (res) {
                     if (res.data.ack == true) {
                     prodData.arr_units = res.data.response;
                     }
                     });*/

                    /*
                     $timeout(function () {
                     $scope.$root.$apply(function () {*/

                    var count = $scope.items.length - 1;
                    /*	$.each(prodData.arr_units, function(index,obj){
                     if(obj.id == prodData.unit_measure_id)
                     $scope.items[detIndex].units = obj;
                     });*/

                    // prodData.units = prodData.arr_units[0];
                    // $scope.items[count].units = prodData.arr_units[0];

                    prodData.primary_unit_of_measure_id = prodData.unit_id;
                    prodData.primary_unit_of_measure_name = prodData.unit_of_measure_name;


                    //  $scope.items[count].units = prodData.arr_units[0];
                    // $scope.items[count].default_units = prodData.arr_units[0];
                   // prodData.units = $rootScope.get_obj_frm_arry(prodData.arr_units, prodData.unit_id);

                    // console.log(prodData.units);
                    prodData.vats = $rootScope.get_obj_frm_arry($rootScope.arr_vat, prodData.vat_rate_id);

                   // prodData.warehouses = $rootScope.get_obj_frm_arry(prodData.arr_warehouse, prodData.location);

                    /*$.each($rootScope.arr_vat, function (index, obj) {
                     if (obj.id == prodData.vat_id)
                     prodData.vats = obj;
                     });*/

                    /*  $.each($scope.arr_warehouse, function (index, obj) {
                     if (obj.id == prodData.location)
                     prodData.warehouses = obj;
                     });
                     */
                    prodData.discount_type_id = $rootScope.get_obj_frm_arry($scope.arr_discount_type, prodData.discount_type);

                    /*$.each($scope.arr_discount_type, function (index, obj) {
                     if (obj.id == prodData.discount_type)
                     prodData.discount_type_id = obj;
                     });*/


                    console.log(prodData);


                    prodData.stock_check = prodData.stock_check;

                    $scope.items.push(prodData);
                    $scope.$root.return_status = true;

                    /* }
                     else {
                     toaster.pop('error', 'Info', 'Please insert the record in customer finance tab!');
                     }*/

                }
            });
            $scope.rec.item_types = $scope.arrItems[0];
            //if($scope.$root.return_status == true)
            angular.element('#productModal').modal('hide');

        }
        else if ($scope.rec.item_types.value == 2) {

            console.log($scope.rec.item_types.value);
            $.each($scope.products, function (index, prodData) {
                if (prodData.chk == true) {
                    if ($scope.$root.crm_id == 0) {
                        toaster.pop('error', 'Error', 'Please select customer first!');
                        //return false;
                        $scope.$root.return_status = false;
                    }


                    prodData.item_type = $scope.rec.item_types.value;

                    var finApi = $scope.$root.sales + "customer/customer/get-finance-by-customer-id";
                    $http
                        .post(finApi, {'customer_id': $scope.$root.crm_id, token: $rootScope.token})
                        .then(function (res) {
                            if (res.data.ack == true) {
                                /*if(res.data.response.vat_bus_posting_group == undefined){
                                 toaster.pop('error','Error','Vat Bus. Posting Group is not defined!');
                                 $scope.$root.return_status = false;
                                 }
                                 else if(prodData.v_product_positing == undefined){
                                 toaster.pop('error','Error','Vat Prod. Posting Group is not defined!');
                                 $scope.$root.return_status = false;
                                 }
                                 else{*/
                                var vatApi = $scope.$root.setup + "ledger-group/get-vat";
                                $http
                                    .post(vatApi, {token: $rootScope.token, 'id': prodData.vat_rate_id})
                                    .then(function (vtData) {
                                        /*if(vtData.data.ack != true){
                                         toaster.pop('error','Info','Please set the VAT first!');
                                         $scope.$root.return_status = false;
                                         }
                                         else{*/

                                        var catUnit = $scope.$root.setup + "service/cat-unit/get-cat-unit-by-cat-nd-unit_id";
                                        $http
                                            .post(catUnit, {
                                                'category_id': prodData.category_id,
                                                'unit_id': prodData.unit_id,
                                                token: $rootScope.token
                                            })
                                            .then(function (cumData) {
                                                if (cumData.data.ack != true) {
                                                    toaster.pop('error', 'Info', 'Please set the record in category units of measure for ' + prodData.description + '!');
                                                    $scope.$root.return_status = false;
                                                    //return false;
                                                }
                                                else {
                                                    var umUrl = $scope.$root.setup + "service/unit-measure/get-unit";
                                                    $http
                                                        .post(umUrl, {id: prodData.unit_id, token: $rootScope.token})
                                                        .then(function (umData) {
                                                            if (umData.data.ack != true) {
                                                                toaster.pop('error', 'Info', 'Please set the record in units of measure for ' + prodData.description + '!');
                                                                $scope.$root.return_status = false;
                                                                //return false;
                                                            }
                                                            else {
                                                                if (umData.data.response.parent_id !== '0') {
                                                                    $http
                                                                        .post(catUnit, {
                                                                            'category_id': prodData.category_id,
                                                                            'unit_id': umData.data.response.parent_id,
                                                                            token: $rootScope.token
                                                                        })
                                                                        .then(function (c2umData) {
                                                                            if (c2umData.data.ack != true) {
                                                                                toaster.pop('error', 'Error2', 'Please set the record in category units of measure for ' + prodData.description + '!');
                                                                                $scope.$root.return_status = false;
                                                                                //return false;

                                                                            }
                                                                            else
                                                                                prodData.sale_unit_qty = c2umData.data.response.value;
                                                                        });
                                                                }
                                                                else {
                                                                    prodData.sale_unit_qty = cumData.data.response.value;

                                                                }
                                                            }

                                                            //$timeout(function(){
                                                            /*console.log('chec2==>>'+$scope.$root.return_status);
                                                             if($scope.$root.return_status == false){
                                                             return false;
                                                             }*/
                                                            prodData.item_code = prodData.code;
                                                            prodData.vat = vtData.data.response.vat_name;
                                                            prodData.vat_value = vtData.data.response.vat_value;
                                                            prodData.vat_id = vtData.data.response.id;
                                                            prodData.qty = 1;
                                                            prodData.sale_unit_id = prodData.unit_id;
                                                            prodData.purchase_unit_id = prodData.purchase_measure;
                                                            prodData.unit_parent = umData.data.response.parent_id;

                                                            $.each($rootScope.arr_vat, function (index, obj) {
                                                                if (obj.id == prodData.vat_id)
                                                                    prodData.vats = obj;
                                                            });

                                                            $.each($scope.arr_units, function (index, obj) {
                                                                if (obj.id == prodData.sale_unit_id)
                                                                    prodData.units = obj;
                                                            });

                                                            /*var umUrl = $scope.$root.stock+"unit-measure/get-unit";
                                                             $http
                                                             .post(umUrl, {customer_id:$scope.$root.crm_id,product_id:prodData.id,token:$rootScope.token})
                                                             .then(function (promoData) {
                                                             if(promoData.data.ack == true){
                                                             console.log('add promotion record');
                                                             }
                                                             else
                                                             console.log('no promotion record');
                                                             });*/

                                                            $scope.items.push(prodData);

                                                            $scope.$root.return_status = true;
                                                            //},2000);

                                                        });

                                                }
                                            });

                                        //}
                                    });

                                //}
                            }
                            else {
                                toaster.pop('error', 'Info', 'Please insert the record in finance tab!');
                            }
                        });
                }
            });
            $scope.rec.item_types = $scope.arrItems[0];
            //if($scope.$root.return_status == true)
            angular.element('#serviceModal').modal('hide');

        }
        else {

            var acItem = {};
            if (prodData.account_type != 1) {
                toaster.pop('error', 'Error', 'Account Type must be posting!');
                return false;
            }
            var accUrl = $scope.$root.setup + "ledger-group/get-ledger-posting";
            $http
                .post(accUrl, {
                    'account': prodData.number,
                    'order_type': prodData.account_type,
                    token: $rootScope.token
                })
                .then(function (acData) {
                    if (acData.data.ack == false) {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                        $scope.$root.return_status = false;
                    }
                    else {
                        var ledgEntryUrl = $scope.$root.setup + "ledger-group/get-general-ledger-entry";
                        $http
                            .post(ledgEntryUrl, {
                                'business_posting_title': acData.result.vat_bus_posting,
                                'product_posting_title': acData.result.vat_prod_posting,
                                token: $rootScope.token
                            })
                            .then(function (gData) {
                                if (gData.data.ack == false) {
                                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                                    $scope.$root.return_status = false;
                                }
                                else {

                                    var vatsetpUrl = $scope.$root.setup + "ledger-group/get-account-head";
                                    $http
                                        .post(vatsetpUrl, {
                                            'customer': gData.result.business_posting,
                                            'product': gData.result.product_posting,
                                            token: $rootScope.token
                                        })
                                        .then(function (vtData) {
                                            if (gData.data.ack == false) {
                                                toaster.pop('error', 'Error', 'Please set the VAT first!');
                                                $scope.$root.return_status = false;
                                            }
                                            else {

                                                var vatsetpUrl = $scope.$root.setup + "ledger-group/get-account-head";
                                                $http
                                                    .post(vatsetpUrl, {
                                                        'number': prodData.number,
                                                        'account_type': 'Posting',
                                                        token: $rootScope.token
                                                    })
                                                    .then(function (acHead) {
                                                        acItem.Code = prodData.number;
                                                        acItem.Description = acHead.data.response.name;
                                                        acItem.item_type = $scope.item_type;
                                                        acItem.qty = 1;
                                                        acItem.Price = 0;
                                                        acItem.Vat = vtData.data.response.vat;
                                                        $scope.items.push(acItem);
                                                        $scope.$root.return_status = true;
                                                    });
                                            }
                                        });
                                }
                            });
                    }

                });

        }
        /*$timeout(function(){
         return $scope.$root.return_status;
         },2000);*/

        $scope.rec.item_types = $scope.arrItems[0];
    }

    $scope.add_gl_account_values = function (gl_data) {

        // gl_data.id;
        /* console.log(gl_data.code);
         console.log(gl_data.name);*/

        $scope.acItem = {};
        $scope.acItem.product_id = gl_data.id;
        $scope.acItem.id = gl_data.id;
        $scope.acItem.product_code = gl_data.code;
        $scope.acItem.description = gl_data.name;
        $scope.acItem.product_name = gl_data.name;
        $scope.acItem.item_type = 1;
        $scope.acItem.qty = 1;
        $scope.acItem.Price = "";
        //$scope.acItem.arr_vat = "";


        $.each($rootScope.arr_vat, function (index, obj) {
            if (obj.id == gl_data.vat_id)
                $scope.acItem.vats = obj;
        });

        $scope.items.push($scope.acItem);

        $scope.show_recieve_list = false;
        angular.element('#accthead_modal').modal('hide');

        $scope.rec.item_types = $scope.arrItems[0];
        /*var gl_table="";

         var DetailsURL = $scope.$root.gl + "chart-accounts/get-account-heads";
         $http
         .post(DetailsURL, {'token': $scope.$root.token, 'gl_id': id})
         .then(function (res) {
         if (res.data.ack == true) {

         $scope.acItem = {};
         $scope.acItem.product_code = res.data.response.number;
         $scope.acItem.description = res.data.response.name;
         $scope.acItem.item_type = 1;
         $scope.acItem.qty = 1;
         $scope.acItem.Price = 0;
         $scope.acItem.Vat = res.data.response.vat_list_id;

         $.each($scope.arr_vat, function (index, obj) {
         if (obj.id == $scope.acItem.Vat)
         $scope.acItem.vats = obj;
         });

         $scope.items.push($scope.acItem);
         ///$scope.$root.return_status = true;
         }
         });

         $('#accthead_modal').modal('hide');*/

    };


    $scope.rowTotal = function (item) {

        //console.log(item.item_type);

        var total = 0;

        if (item.item_type != 1) {

            if (item.units != undefined)
                total = item.qty * item.standard_price * item.units.quantity;
            else
                total = item.qty * Number(item.standard_price);

        } else {
            if (item.qty > 0)
                total = item.qty * Number(item.standard_price);
            else
                total = Number(item.standard_price);
        }


        /*if(item.sale_unit_id !== item.purchase_unit_id){
         if(item.unit_parent !== '0'){
         total = subtotal * item.sale_unit_qty;
         }
         else{
         total = subtotal / item.sale_unit_qty;	
         }
         }
         else{
         total = subtotal;
         }*/
        //if (item.item_type == 1)
        // var total =  item.standard_price;


        if (item.discount_type_id != undefined && item.discount > 0) {
            if (item.discount_type_id.id == 'Percentage')
                total = total - (total * item.discount / 100);
            else
                total = total - item.discount;
        }

        return total;
    }

    $scope.netTotal = function () {
        var total = 0;
        angular.forEach($scope.items, function (item) {

            if (item.item_type != 1) {

                if (item.units != undefined)
                    var subtotal = item.qty * item.standard_price * item.units.quantity;
                else
                    var subtotal = item.qty * Number(item.standard_price);

            } else {
                if (item.qty > 0)
                    var subtotal = item.qty * Number(item.standard_price);
                else
                    var subtotal = Number(item.standard_price);
            }


            /*if (item.units != undefined)
             var subtotal = item.qty * item.standard_price * item.units.quantity;
             else
             var subtotal = item.qty * item.standard_price;*/


            //if (item.item_type == 1)
            //  var subtotal =  item.standard_price;
            /*if(item.sale_unit_id !== item.purchase_unit_id){
             if(item.unit_parent !== '0'){
             total += subtotal * item.sale_unit_qty;
             }
             else{
             total += subtotal / item.sale_unit_qty;	
             }
             }
             else{
             total += subtotal;
             }*/
            total += Number(subtotal);
            if (item.discount_type_id != undefined && item.discount > 0) {
                if (item.discount_type_id.id == 'Percentage')
                    total = total - (total * item.discount / 100);
                else
                    total = total - item.discount;
            }
        });
        return total;
    }

    $scope.calcVat = function () {
        var arrVat = [];
        var arrTotalVat = [];
        var TotalVat = 0;
        var total = 0;
        if ($scope.items.length > 0) {

            angular.forEach($scope.items, function (item) {

                if (item.vats != undefined && item.vats.vat_value > 0) {
                    //calculate Vat for Each Item sepratly
                    /*if (item.units != undefined)
                     var subtotal = item.qty * item.standard_price * item.units.quantity;
                     else
                     var subtotal = item.qty * item.standard_price;*/

                    if (item.item_type != 1) {

                        if (item.units != undefined)
                            var subtotal = item.qty * item.standard_price * item.units.quantity;
                        else
                            var subtotal = item.qty * Number(item.standard_price);

                    } else {
                        if (item.qty > 0)
                            var subtotal = item.qty * Number(item.standard_price);
                        else
                            var subtotal = Number(item.standard_price);
                    }

                    //if (item.item_type == 1)
                    //	var subtotal =  item.standard_price;
                    /*if(item.sale_unit_id !== item.purchase_unit_id){
                     if(item.unit_parent !== '0')  total += subtotal * item.sale_unit_qty;
                     else  total += subtotal / item.sale_unit_qty;
                     }
                     else  total += subtotal;
                     */
                    var total = 0;
                    total += Number(subtotal);
                    if (item.discount_type_id != undefined && item.discount > 0) {
                        if (item.discount_type_id.id == 'Percentage')
                            total = total - (total * item.discount / 100);
                        else
                            total = total - item.discount;
                    }


                    var price = total;
                    var vat_value = item.vats.vat_value;

                    if (arrVat[vat_value] != undefined && arrVat[vat_value].length > 0)
                        arrVat[vat_value] = arrVat[vat_value] + price;
                    else if (vat_value > 0)
                        arrVat[vat_value] = price;

                    //console.log(arrVat[vat_value]);
                    //console.log(vat_value);

                    if (Number(Math.round(((vat_value / 100) * arrVat[vat_value])).toFixed(2)) > 0)
                        TotalVat += Number((Math.round((vat_value / 100) * arrVat[vat_value])).toFixed(2));

                    //arrTotalVat[vat_value] = Math.round(arrVat[vat_value] * (vat_value/ 100 )).toFixed(2);
                }

            });

            /* for (var i = 0; i < arrVat.length; i++) {
             value = arrVat[i];	//console.log(value);
             index = arrVat.indexOf(value, i);//console.log(index);


             if (arrTotalVat[index] > 0 && arrTotalVat[index]!=undefined)
             TotalVat += Number(Math.round( arrTotalVat[index] ).toFixed(2));

             //if (Number(index) > 0)  TotalVat = Math.round( TotalVat +index ).toFixed(2);
             } */

        }
        return TotalVat;
    }

    $scope.grandTotal = function () {
        return ($scope.netTotal() + $scope.calcVat()) /*- $scope.calcDiscount()*/;
    }


    $scope.$watch(function () {
        var chk = true;
        if ($scope.items.length == 0)
            chk = false;
        $.each($scope.items, function (index, elem) {
            if (elem.total_price <= 0 || isNaN(elem.total_price)) {
                chk = false;
            }
        });
        $scope.enable_btn_submit = chk;
    });

    /*$scope.calcDiscount = function(){
     var arrDiscount = [];
     var arrTotalDiscount = [];
     var TotalDiscount = 0;
     var total = 0;
     if($scope.items.length > 0){
     angular.forEach($scope.items,function(item){
     var subtotal = item.qty * item.standard_price;
     if(item.sale_unit_id !== item.purchase_unit_id){
     if(item.unit_parent !== '0'){
     total += subtotal * item.sale_unit_qty;
     }
     else{
     total += subtotal / item.sale_unit_qty;	
     }
     }
     else{
     total += subtotal;
     }

     if (item.discount > 0 ){
     var price = total;
     var disc_value  =    item.discount;

     if (arrDiscount[disc_value] != undefined && arrDiscount[disc_value].length > 0){
     arrDiscount[disc_value] = Number(arrDiscount[disc_value]) + Number(price) ;
     }
     else if (disc_value > 0)
     arrDiscount[disc_value] = price;

     if(item.discount_type_id != undefined && item.discount_type_id.id =='Percentage')
     arrTotalDiscount[disc_value] = arrDiscount[disc_value] * (disc_value / 100);
     else
     arrTotalDiscount[disc_value] = disc_value;
     }
     });

     for (var i = 0; i < arrDiscount.length; i++ ){
     value = arrDiscount[i];
     index = arrDiscount.indexOf(value , i); 
     if (index > 0){
     TotalDiscount = Number(TotalDiscount) + Number(arrTotalDiscount[index]);
     }
     }

     }
     return TotalDiscount;
     }*/


    $scope.delete = function (index, update_id) {

        if (update_id == undefined)
            $scope.items.splice(index, 1);
        else {
            ngDialog.openConfirm({
                template: 'modalDeleteDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                var quoteUrl = $scope.$root.sales + "customer/quote/delete-quote-item";
                $http
                    .post(quoteUrl, {id: update_id, token: $scope.$root.token})
                    .then(function (res) {
                        if (res.data.ack == true) {
                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                            $scope.items.splice(index, 1);
                        }
                        else {
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                        }
                    });
            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
    }


    var rec2 = {};
    $scope.add_sublist = function (rec2) {
        var rec2 = {};
        //||$scope.items.length==0
        if ($scope.$root.posting_date == undefined || $scope.$root.posting_date == null) {
            toaster.pop('error', 'info', 'Invoice Date is Not Defined');
            return;
        }

        rec2.net_amount = $scope.netTotal();
        rec2.tax_amount = $scope.calcVat();
        rec2.grand_total = $scope.grandTotal();
        rec2.order_date = $scope.$root.posting_date;
        console.log($scope.$root.currency_id);

        if ($scope.$root.currency_id.id == $scope.$root.defaultCurrency) {
            rec2.net_amount_converted = Number(rec2.net_amount);
            rec2.tax_amount_converted = Number(rec2.tax_amount);
            rec2.grand_total_converted = Number(rec2.grand_total);

            $scope.addsublist(rec2);
        }
        else {
            //  $rootScope.get_currency_list($scope.$root.posting_date);

            var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
            $scope.items_converted_arr = [];
            $http
                .post(currencyURL, {
                    'id': $scope.$root.currency_id.id,
                    token: $scope.$root.token,
                    or_date: $scope.$root.posting_date
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        if (res.data.response.conversion_rate != null) {

                            $scope.showLoader = true;
                            $timeout(function () {

                                $scope.showLoader = false;

                                rec2.net_amount_converted = Number(rec2.net_amount) / Number(res.data.response.conversion_rate);
                                rec2.tax_amount_converted = Number(rec2.tax_amount) / Number(res.data.response.conversion_rate);
                                rec2.grand_total_converted = Number(rec2.grand_total) / Number(res.data.response.conversion_rate);

                                if (rec2.net_amount_converted <= 0 || rec2.net_amount_converted == undefined || rec2.tax_amount_converted == undefined || rec2.tax_amount_converted == undefined || rec2.grand_total_converted == undefined || rec2.grand_total_converted == undefined) {
                                    toaster.pop('error', 'Info', 'Please Select Currency Rate.');
                                    isValide = false;
                                    return;
                                } else
                                    $scope.addsublist(rec2);


                            }, 2000);

                        }
                    } else
                        toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                }
            );


        }
    }

    $scope.addsublist = function (rec2) {
        var quoteUrl = $scope.$root.sales + "customer/quote/add-quote-items";
        //$timeout(function () {
        $scope.showLoader = true;
        rec2.items = $scope.items;
        rec2.order_id = $scope.$root.order_id
        rec2.order_date = $scope.$root.posting_date;
        rec2.currency_id = $scope.$root.currency_id;
        rec2.token = $rootScope.token;
        rec2.comment = rec2.note;
        rec2.quote_id = $scope.$root.quote_id


        $http
            .post(quoteUrl, rec2)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.showLoader = false;
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $scope.items = [];
                    $scope.getQuotedata();
                    $scope.check_readonly = true;
                } else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(104));
                }
            });

    }

    $scope.$on("quotesDetail", function (event, itemsData) {


        //console.log(itemsData);
        var total_rec_recvie = total_rec_invice = 0;

        $scope.items = [];


        angular.forEach(itemsData, function (elem, detIndex) {
            var detail = {};

            detail.arr_units = [];

            detail.arr_units = elem.arr_units.response;
            detail.arr_warehouse = elem.arr_warehouse.response;
            detail.update_id = elem.id;
            detail.id = elem.item_id;
            detail.description = elem.item_name;
            detail.item_code = elem.item_no;
            /*detail.vat = elem.vat;
             detail.vat_value = elem.vat_value;
             detail.vat_id = elem.vat_id;*/
            detail.standard_price = elem.unit_price;
            detail.qty = Number(elem.qty);
            detail.unit_of_measure_name = elem.unit_measure;
            detail.unit_id = elem.unit_measure_id;
            detail.unit_parent = elem.unit_parent_id;
            detail.sale_unit_qty = elem.unit_qty;
            detail.category_id = elem.cat_id;
            detail.item_type = elem.type;
            detail.discount = Number(elem.discount) > 0 ? Number(elem.discount) : '';
            detail.sale_unit_id = elem.sale_unit_id;
            detail.purchase_unit_id = elem.purchase_unit_id;


            angular.forEach($rootScope.arr_vat, function (index, obj) {
                if (obj.id == elem.vat_id)
                    detail.vats = obj;
            });
            detail.discount_type_id = $rootScope.get_obj_frm_arry($scope.arr_discount_type, elem.discount_type);

            detail.vats = $rootScope.get_obj_frm_arry($rootScope.arr_vat, elem.vat_id);

            detail.warehouses = $rootScope.get_obj_frm_arry(detail.arr_warehouse, elem.warehouse_id);
            /*angular.forEach($scope.arr_warehouse, function (index, obj) {
             if (obj.id == elem.warehouse_id)
             detail.warehouses = obj;
             });
             */

            if (elem.type == 2) {
                angular.forEach($scope.arr_service_units, function (index, obj) {
                    if (obj.id == elem.unit_measure_id)
                        detail.units = obj;
                });
            }
            if (detail.item_type == 0) {







                /* var unitUrl_item = $scope.$root.sales + "stock/unit-measure/get-unit-setup-list-category";
                 $http
                 .post(unitUrl_item, {'token': $scope.$root.token, 'item_id': detail.id})
                 .then(function (res) {
                 if (res.data.ack == true)
                 detail.arr_units = res.data.response;

                 });*/

                detail.units = $rootScope.get_obj_frm_arry(detail.arr_units, elem.unit_measure_id);
                angular.forEach(detail.arr_units, function (index, obj) {
                    if (obj.id == elem.default_unit_measure_id)
                        $scope.items[detIndex].default_units = obj;
                });
                /*  var count = $scope.items.length - 1;
                 $.each(detail.arr_units, function (index, obj) {
                 if (obj.id == elem.unit_measure_id)
                 detail.units = obj;
                 });
                 */
                /*   angular.forEach(detail.arr_units, function (index, obj) {
                 if (obj.id == elem.default_unit_measure_id)
                 $scope.items[detIndex].default_units = obj;
                 });
                 */


                /* if (detail.sale_status == 1 )total_rec_recvie++;
                 if (detail.sale_status == 2 )total_rec_invice++;
                 if (detail.sale_status == 3) {
                 total_rec_recvie++;
                 total_rec_invice++;
                 }
                 if(detail.item_type ==1) total_rec_invice++;
                 */

                total_rec_recvie++;
                total_rec_invice++;

            }
            if (detail.item_type == 1) {

                detail.units = $rootScope.get_obj_frm_arry($rootScope.gl_arr_units, elem.unit_measure_id);
                var count = $scope.items.length - 1;

                console.log(detail.units);
                total_rec_invice++;
            }

            $scope.items.push(detail);
        });

    });

    /*$scope.getQuotesDetail = function () {

     var getQuoteProduct = $scope.$root.sales + 'customer/quote/get-quote-items'
     $http
     .post(getQuoteProduct, {quote_id: $scope.$root.quote_id, token: $scope.$root.token})
     .then(function (rsQtItem) {
     if (rsQtItem.data.ack == true) {
     angular.forEach(rsQtItem.data.response, function (elem, detIndex) {
     var detail = {};
     /!*if(rsQtItem.data.response.type == 0){
     myService.getPrefix(elem.item_id,'product').success(function(prx){
     detail.Code = prx.code;
     $resource('api/company/get_record/:id/:table')
     .get({id:elem.item_id,table:'product'},function(prod){
     detail.g_product_positing = prod.g_product_positing != undefined ? prod.g_product_positing :0;
     detail.v_product_positing = prod.v_product_positing != undefined ? prod.v_product_positing :0;
     detail.inventory_positing = prod.inventory_positing != undefined ? prod.inventory_positing :0;
     });
     });
     }
     else{
     detail.Code = elem.item_id;
     }
     *!/
     detail.update_id = elem.id;
     detail.id = elem.item_id;
     detail.description = elem.item_name;
     detail.item_code = elem.item_no;
     /!*detail.vat = elem.vat;
     detail.vat_value = elem.vat_value;
     detail.vat_id = elem.vat_id;*!/
     detail.standard_price = elem.unit_price;
     detail.qty = Number(elem.qty);
     detail.unit_of_measure_name = elem.unit_measure;
     detail.unit_id = elem.unit_measure_id;
     detail.unit_parent = elem.unit_parent_id;
     detail.sale_unit_qty = elem.unit_qty;
     detail.category_id = elem.cat_id;
     detail.item_type = elem.type;
     detail.discount = Number(elem.discount) > 0 ? Number(elem.discount) : '';
     detail.sale_unit_id = elem.sale_unit_id;
     detail.purchase_unit_id = elem.purchase_unit_id;

     detail.arr_units = [];
     var unitUrl_item = $scope.$root.sales + "stock/unit-measure/get-unit-setup-list-category";
     $http
     .post(unitUrl_item, {'token': $scope.$root.token, 'item_id': detail.id})
     .then(function (res) {
     if (res.data.ack == true) {
     detail.arr_units = res.data.response;
     }
     });

     $.each($scope.arr_discount_type, function (index, obj) {
     if (obj.id == elem.discount_type)
     detail.discount_type_id = obj;
     });
     $.each($rootScope.arr_vat, function (index, obj) {
     if (obj.id == elem.vat_id)
     detail.vats = obj;
     });
     if (elem.type == 2) {
     $.each($scope.arr_service_units, function (index, obj) {
     if (obj.id == elem.unit_measure_id)
     detail.units = obj;
     });
     }
     $.each($scope.arr_warehouse, function (index, obj) {
     if (obj.id == elem.warehouse_id)
     detail.warehouses = obj;
     });
     /!*$resource('api/company/get_record_where/:table/:condition')
     .get({table:'finance',condition:'customer_id*'+$scope.$root.crm_id+'@type*customer'},function(cust){
     detail.g_customer_positing = cust.result.gen_bus_posting_group != undefined ? cust.result.gen_bus_posting_group : 0;
     detail.vat_customer_positing = cust.vat_bus_posting_group != undefined ? cust.vat_bus_posting_group :0;
     detail.customer_positing = cust.customer_posting_group != undefined ? cust.customer_posting_group:0;
     });*!/


     $scope.items.push(detail);


     var count = $scope.items.length - 1;
     $.each(detail.arr_units, function (index, obj) {
     console.log(obj.id + '==' + elem.unit_measure_id);
     if (obj.id == elem.unit_measure_id)
     $scope.items[detIndex].units = obj;
     });
     $.each(detail.arr_units, function (index, obj) {
     if (obj.id == elem.default_unit_measure_id)
     $scope.items[detIndex].default_units = obj;
     });




     });
     }
     /!*else{
     var detail = {};
     detail.update_id =  orderDetail.result.id;
     detail.id = orderDetail.result.item_id;
     detail.Description = orderDetail.result.item_name;
     detail.Vat = orderDetail.result.vat;
     detail.Price = orderDetail.result.unit_price;
     detail.qty = orderDetail.result.qty;
     detail['Unit Measure'] = orderDetail.result.unit_measure;
     detail.unit_measure_id = orderDetail.result.unit_measure_id;
     detail.unit_parent = orderDetail.result.unit_parent_id;
     detail.qtyunit = orderDetail.result.unit_qty;
     detail.category_id = orderDetail.result.cat_id;
     detail.item_type = orderDetail.result.type;

     if(orderDetail.result.type == 0){
     myService.getPrefix(orderDetail.result.item_id,'product').success(function(prx){
     detail.Code = prx.code;
     });

     $resource('api/company/get_record/:id/:table')
     .get({id:orderDetail.result.item_id,table:'product'},function(prod){
     detail.g_product_positing = prod.g_product_positing != undefined ? prod.g_product_positing:0;
     detail.v_product_positing = prod.v_product_positing != undefined ? prod.v_product_positing :0;
     detail.inventory_positing = prod.inventory_positing != undefined ? prod.inventory_positing :0;

     });
     }
     else{
     detail.Code = orderDetail.result.item_id;
     $resource('api/company/get_record_where/:table/:condition')
     .get({table:'general_ledger_posting',condition:'account_head*'+orderDetail.result.item_id},function(gen){
     detail.g_product_positing = gen.result.gen_prod_posting != undefined ? gen.result.gen_prod_posting :0;
     detail.v_product_positing = gen.vat_prod_posting != undefined ? gen.vat_prod_posting :0;
     detail.inventory_positing = 0;
     });
     }

     $resource('api/company/get_record_where/:table/:condition')
     .get({table:'finance',condition:'customer_id*'+$scope.$root.crm_id+'@type*customer'},function(cust){
     detail.g_customer_positing = cust.result.gen_bus_posting_group != undefined ? cust.result.gen_bus_posting_group : 0;
     detail.vat_customer_positing = cust.vat_bus_posting_group != undefined ? cust.vat_bus_posting_group : 0;
     detail.customer_positing = cust.customer_posting_group != undefined ? cust.customer_posting_group : 0;
     });

     $timeout(function(){
     $scope.items.push(detail);
     },5000);


     }*!/
     //}
     });

     }*/


    $scope.orderCompete = function () {
        var completeOrder = [];
        angular.forEach($scope.items, function (elem, index) {
            var cmpOrder = {};
            cmpOrder.product_id = elem.id;
            cmpOrder.type = elem.item_type;
            cmpOrder.g_product_positing = elem.g_product_positing;
            cmpOrder.v_product_positing = elem.v_product_positing;
            cmpOrder.inventory_positing = elem.inventory_positing;
            cmpOrder.g_customer_positing = elem.g_customer_positing;
            cmpOrder.vat_customer_positing = elem.vat_customer_positing;
            cmpOrder.customer_positing = elem.customer_positing;
            cmpOrder.unit_mesure = elem.unit_measure_id;
            cmpOrder.amount = $scope.rowTotal(elem);
            cmpOrder.vat = elem.Vat;
            cmpOrder.qty = elem.qty;
            cmpOrder.posting_date = $scope.$root.posting_date;
            cmpOrder.cust_id = $scope.$root.crm_id;
            cmpOrder.order_id = $scope.$root.order_id;
            cmpOrder.order_no = $scope.$root.order_no;
            completeOrder.push(cmpOrder);
        });

        $http
            .post('api/chart_of_accounts/general_ledger_entry', completeOrder)
            .then(function (result) {
                if (result.data == '0') {
                    toaster.pop("error", "Error", "Order can't be completed! Product head is not set!");
                }
                else {
                    toaster.pop("success", "Completed", "Order completed.");
                    $scope.check_order_complete = 0;
                }
            });

    }

    $scope.postOrder = function () {

        ngDialog.openConfirm({
            // template: 'app/views/_confirm_modal.html',
            template: 'modalcontinueid',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
                $timeout(function () {
                    $scope.showLoader = true;

                    /////////////////////////////////////////////////////////////////////////////////////////
                    /////////////////////////CHECK CURRENCY RATE AVAILABILITY///////////////////////////////


                    var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
                    var name = $scope.$root.base64_encode('orders');
                    var no = $scope.$root.base64_encode('sale_order_no');

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
                            'm_id': 110,
                            'no': no,
                            'category': '',
                            'brand': '',
                            'module_category_id': module_category_id,
                            'type': '1,2'
                        })
                        .then(function (res) {

                            if (res.data.ack == 1) {


                                ///  $scope.rec.sale_order_code = res.data.code;
                                // $scope.rec.sale_order_no = res.data.nubmer;
                                //  $scope.rec.code_type = module_category_id;//res.data.code_type;
                                //  $scope.count_result++;
                                // if (res.data.type == 1)    $scope.product_type = false;


                                var postOrderUrl = $scope.$root.sales + "customer/quote/convert-to-order";
                                $http
                                    .post(postOrderUrl, {
                                        quote_id: $scope.$root.quote_id,
                                        token: $scope.$root.token,
                                        sale_order_code: res.data.code,
                                        sale_order_no: res.data.nubmer,
                                        type: 1,
                                        status: 1,
                                        convert_from_forcast: 2
                                    })
                                    .then(function (result) {
                                        if (result.data.ack == true) {
                                            toaster.pop("success", "Info", "Order posted successfully.");
                                            $state.go("app.orders");

                                            // angular.element("#goToNewQuote").click();
                                        }
                                        else
                                            toaster.pop("error", "Error", "Order can't be posted .");
                                    });


                            }
                            else {
                                toaster.pop('error', 'info', res.data.error);
                                return false;
                            }
                        });


                    $scope.showLoader = false;
                }, 1000);

            },
            function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });


    }

    $scope.checkDuplWHItem = function (item, index) {
        var chk = true;
        var count = 0;
        $.each($scope.items, function (indx, itm) {
            if ((item.warehouses.id == itm.warehouses.id) && (itm.id == item.id) && indx != index) {
                toaster.pop('warning', 'Info', 'This item has already been allocated in this location!');
                $scope.items[index].warehouses = 0;
                chk = false;
            }
            count++;
        });

        if ($scope.items.length == count) {
            if (chk == true) {
                $scope.checkStock(item, index);
            }
        }

    }


    $scope.checkStock = function (item, index) {
        var chkStockUrl = $scope.$root.sales + 'customer/order/get-warehouse-avail-stock';
        $http
            .post(chkStockUrl, {
                'warehouse_id': item.warehouses.id,
                type: 1,
                item_id: item.id,
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    if (res.data.avail_qty < item.qty) {
                        toaster.pop('warning', 'Info', 'Available quantity is less than item quantity!');
                        $scope.items[index].warehouses = 0;
                        return false;
                    }
                }
                else {
                    toaster.pop('warning', 'Info', 'No stock availabe!');
                    $scope.items[index].warehouses = 0;
                    return false;
                }
            });
    }


    $scope.$root.load_date_picker('Quotation');
}