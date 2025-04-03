SalePromotionController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$stateParams"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.salePromotion', {
                url: '/sale-promotion',
                title: 'Sales',
                templateUrl: helper.basepath('sale_promotion/_listing.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.addSalePromotion', {
                url: '/sale-promotion/add/',
                title: 'Sales',
                templateUrl: helper.basepath('addTabs.html'),
                controller: 'SalePromotionAddController',
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.editSalePromotion', {
                url: '/sale-promotion/add/:id/edit',
                title: 'Sales',
                templateUrl: helper.basepath('addTabs.html'),
                controller: 'SalePromotionAddController',
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
    }]);
myApp.controller('SalePromotionController', SalePromotionController);
myApp.controller('SalePromotionAddController', SalePromotionAddController);



SalePromotionController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
function SalePromotionController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams) {
    'use strict';

    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            { 'name': 'Sales', 'url': '#', 'isActive': false },
            { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
            { 'name': 'Sales Promotion', 'url': '#', 'isActive': false },

        ];


    var vm = this;
    var Api = $scope.$root.sales + "customer/customer/sale-promotions";
    var postData = {
        'token': $scope.$root.token,
        'all': "1",
        'type': 2
    };
    $scope.promotion_list = [];
    $http
        .post(Api, postData)
        .then(function (res) {
            if (res.data.ack == 1)
                $scope.promotion_list = res.data.response;
            else
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
        });
    /* 
    $scope.$watch("MyCustomeFilters", function () {
        if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
            $scope.table.tableParams5.reload();
        }
    }, true);

    $scope.MyCustomeFilters = {};

    /* vm.tableParams5 = new ngParams({
        page: 1, // show first page
        count: $scope.$root.pagination_limit, // count per page
        sorting: { id: 'Desc' },
        filter: {
            name: '',
            age: ''
        }
    }, {
            total: 0, // length of data
            counts: [], // hide page counts control

            getData: function ($defer, params) {

                // ngDataService.getData( $defer, params, Api,$filter,$scope,postData);
                ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);
            }
        }); 
        

    $scope.getItem = function (parm) {
        $scope.rec.token = $scope.$root.token;
        //$scope.rec.warehouse_id = $scope.rec.warehouse !=undefined? $scope.rec.warehouse.id:'';
        //$scope.rec.category_id = $scope.rec.category !=undefined? $scope.rec.category.id:'';
        if (parm == 'all') {
            $scope.rec = {};
            $scope.rec.token = $scope.$root.token;
        }
        $scope.rec.type = 2;
        $scope.postData = $scope.rec;

        $scope.$root.$broadcast("myReload");
    }

    $scope.$on("myReload", function (event) {
        //var ApiAjax = $resource('api/company/get_listing_ajax/:module_id/:module_table/:filter_id/:more_fields/:condition');

        // ngDataService.getDataCustom( $scope.MainDefer, $scope.mainParams, Api,$scope.mainFilter,$scope,$scope.postData);
        // ngDataService.getDataCustom($defer, params, Api, $filter, $scope, $scope.postData);
        $scope.table.tableParams5.reload();
        //return;
    });

    */

}


// SalePromotionAddController.$inject = ["$scope", "$filter", "ngTableParams", "$state", "$http", "ngDialog", "toaster",  "$stateParams", "$rootScope"];
function SalePromotionAddController($scope, $stateParams, $http, $state, $resource, toaster, ngDialog, $rootScope, $timeout, $filter) {

    $scope.breadcrumbs =
        [
            { 'name': 'Sales', 'url': '#', 'isActive': false },
            { 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
            { 'name': 'Sales Promotion', 'url': 'app.salePromotion', 'isActive': false }
        ];

    $scope.formUrl = function () {
        return "app/views/sale_promotion/_form.html";
    }


    $scope.formTitle = 'Sale Promotion';
    $scope.$root.lblButton = 'Add New';
    $scope.check_readonly = false;
    $scope.rec = {};
    $scope.formData = {};
    $scope.arr_strategy_type = [];
    $scope.arr_strategy = [];
    $scope.selectedCustomers = [];
    $scope.selectedProducts = [];
    $scope.arr_customers = [];
    $scope.tempProdArr = [];
    $scope.btnCancelUrl = 'app.salePromotion';
    $scope.$data = {};
    $scope.list_type = [{ 'name': 'Percentage', 'id': 1 }, { 'name': 'Value', 'id': 2 }];
    $scope.promotionShowCols = [
        "G/L No.", "G/L Name"
    ];
    
    $scope.showEditForm = function () {
        $scope.check_readonly = false;
    }
    /* var custPodTypeUrl = $scope.$root.setup + "general/pricing-strategy-types";
    $http
        .post(custPodTypeUrl, { 'token': $scope.$root.token })
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.arr_strategy_type = res.data.response[1];
                $scope.arr_strategy = res.data.response[2];
            }
        }); */

    $scope.arr_strategy_type = [
        { id: "1", name: "Standard and Customer Specific Price", type: "1" }];
    /*,
    { id: "2", name: "Standard Sales Price", type: "1" },
    { id: "3", name: "Customer Specific Price", type: "1" }
];*/

    $scope.arr_strategy = [
        { id: "1", name: "Volume Discount  Applies and Promotion only for Customers without Volume Discount", type: "2" }];
    /*,
    { id: "2", name: "Apply Promotion Only and Ignore Any Volume Discount", type: "2" },
    { id: "3", name: "Promotion Applies After Volume Discount", type: "2" },
    { id: "4", name: "Promotion Applies Before Volume  Discount", type: "2" }
]; */

    $scope.customers = [];
    $scope.searchKeywordCUST = {};
    $scope.selectedRecFromModalsCUST = [];
    $scope.customer_readonly = 0;
    $scope.clearFilterAndSelectCustomers = function (show_popup) {
        $scope.searchKeywordCUST = {};
        
        if($scope.rec.id > 0)
        {
            $scope.customer_readonly = 1;
            var cust_ids = "";
            if($scope.selectedCustomers_ids.length > 0)
            {
                angular.forEach($scope.selectedCustomers_ids, function (obj) {
                    cust_ids += obj+", ";
                });
                cust_ids += "0";
            }

            $scope.searchKeywordCUST.cid = cust_ids;
        }
        else
        {
            $scope.customer_readonly = 0;
        }
        $scope.selectCustomers(void 0, void 0, void 0, show_popup);
    }

    $scope.selectCustomers = function (item_paging, sort_column, sortform, show_popup) {
        /* $scope.selectedCustomers_ids = [];
        if ($scope.arr_customers.length > 0) {
            angular.forEach($scope.arr_customers, function (obj) {
                if (obj.chk == true)
                    $scope.selectedCustomers_ids.push(obj.id);
            });
        }
        $scope.arr_customers = [];
        angular.copy($rootScope.customer_arr, $scope.arr_customers);

        angular.forEach($scope.arr_customers, function (obj) {
            if ($scope.selectedCustomers_ids.indexOf(obj.id) != -1)
                obj.chk = true;
        });

        if (isShow)
            angular.element('#custInfoModal').modal({ show: true }); */


        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.moduleType = 'CUSTDetail';

        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.searchKeyword = $scope.searchKeywordCUST;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeywordCUST = {};
            $scope.record_data = {};
        }

        if ((sort_column != undefined) && (sort_column != null)) {
            //sort by column
            $scope.postData.sort_column = sort_column;
            $scope.postData.sortform = sortform;

            $rootScope.sortform = sortform;
            $rootScope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;
            $rootScope.sort_column = sort_column;

            $rootScope.save_single_value($rootScope.sort_column, 'crmsort_name');
        }
        $scope.postData.cond = 'Detail';
        

        var customerListingApi = $scope.$root.gl + "chart-accounts/customer-data-for-flexi-modal";

        $scope.showLoader = true;
        $http
            .post(customerListingApi, $scope.postData)
            .then(function (res) {
                $scope.tableData = res;
                $scope.columns = [];
                $scope.record_data = {};
                $scope.recordArray = [];
                $scope.tempCustomerArr2 = [];

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
                    $scope.tempCustomerArr2 = res.data;

                    angular.forEach(res.data.response, function (value, key) {
                        if (key != "tbl_meta_data") {
                            $scope.recordArray.push(value);
                        }
                    });

                    if(show_popup)
                        angular.element('#custInfoModal').modal({ show: true });
                    else
                    {
                        angular.forEach($scope.recordArray, function (obj) {
                            $scope.selectedCustomers.push(obj);
                        });
                    }

                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
                $scope.showLoader = false;
            });
    }


    /* $scope.selectCustomer = function (cust) {
        $scope.selectedCustomers = [];
        $scope.selectedCustomers_ids = [];
        angular.forEach($scope.arr_customers, function (obj) {
            if (obj.chk == true) {
                $scope.selectedCustomers.push(obj);
                $scope.selectedCustomers_ids.push(obj.id);
            }
        });
    }

    $scope.checkAllCustomers = function (chk_all_cust, _filter1) {
        let filtered;
        var selection_filter = $filter('filter');
        filtered = selection_filter($scope.arr_customers, _filter1);
        console.log("selected: ", filtered);
        if (chk_all_cust) {
            angular.forEach(filtered, function (obj) {
                obj.chk = chk_all_cust;
            });
        } else {
            angular.forEach($scope.arr_customers, function (obj) {
                obj.chk = false;
            });
        }

    } */

    
    $scope.clearCustomers = function () {
        angular.element('#custInfoModal').modal('hide');
    }

    $scope.addCustomers = function () {
        $scope.selectedCustomers = [];
        $scope.selectedCustomers_ids = [];
        angular.forEach($scope.selectedRecFromModalsCUST, function (obj) {
            $scope.selectedCustomers.push(obj.record);
            $scope.selectedCustomers_ids.push(obj.record.id);
        });

        $scope.CustomerArr = [];

        angular.element('#custInfoModal').modal('hide');
    }


    $scope.searchKeywordItem = {};
    $scope.selectedRecFromModalsItem = [];
    $scope.product_readonly = 0;
    
    $scope.clearAndSearchItems = function(show_popup){
        $scope.searchKeywordItem = {};
        // $scope.searchKeywordItem = {};
        $scope.selectedRecFromModalsItem = [];

        if($scope.rec.id > 0)
        {
            $scope.product_readonly = 1;
            var prod_ids = "";
            if($scope.selectedProducts_ids.length > 0)
            {
                angular.forEach($scope.selectedProducts_ids, function (obj) {
                    prod_ids += obj+", ";
                });
                prod_ids += "0";
            }

            $scope.searchKeywordItem.id = prod_ids;
        }
        else
        {
            $scope.product_readonly = 0;
        }

        $scope.selectItem(void 0, void 0, void 0, show_popup);
    }

    $scope.selectItem = function (item_paging, sort_column, sortform, show_popup) {

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.moduleType = 'ItemDetail';

        $scope.tempProdArr = [];
        $scope.tempProdArr2 = []
        $scope.tempProdArr2.response = [];

        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.searchKeyword = $scope.searchKeywordItem;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeywordItem = {};
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

        $scope.postData.cond = 'setupDetail';
        $scope.postData.srm_id = 1;
        $scope.postData.orderDate = $scope.$root.get_current_date();

        // var itemListingApi = $scope.$root.reports + "module/item-data-for-report";
        // var itemListingApi = $scope.$root.stock + "products-listing/item-popup";    
        var itemListingApi = $scope.$root.stock + "products-listing/item-details-price-qty";   

        $scope.showLoader = true;
        $http
            .post(itemListingApi, $scope.postData)
            .then(function (res) {
                $scope.tableData = res;
                $scope.columns = [];
                $scope.record_data = {};
                $scope.recordArray1 = [];
                $scope.showLoader = false;
                $scope.tempProdArr = [];
                $scope.PendingSelectedItems = [];

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
                    $scope.tempProdArr = res.data.response;

                    angular.forEach($scope.tempProdArr, function (value, key) {
                        if (key != "tbl_meta_data") {
                            $scope.recordArray1.push(value);
                        }
                    });

                    // if ($scope.tempProdArr[0].id)
                    if(show_popup)
                        angular.element('#productModal').modal({ show: true });
                    else
                    {
                        angular.forEach($scope.recordArray1, function (obj) {
                            $scope.selectedProducts.push(obj);
                        });
                    }

                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            });
    }

    $scope.clearPendingPurchaseItems = function () {
        $scope.PendingSelectedPurchaseItems = [];
        $scope.PendingSelectedItems = [];
        // $scope.searchKeywordItem = {};
        // $scope.selectedRecFromModalsItem = [];
        angular.element('#productModal').modal('hide');
    }

    $scope.addProduct = function () {

        $scope.selectedProducts = [];
        $scope.selectedProducts_ids = [];
        angular.forEach($scope.selectedRecFromModalsItem, function (obj) {
            $scope.selectedProducts_ids.push(obj.record.id);
            $scope.selectedProducts.push(obj.record);
		});
		
        angular.element('#productModal').modal('hide');
    }


    $scope.resetForm = function (rec) {
        $scope.check_readonly = false;
        $scope.formData = {};
        $scope.rec = {};
        $scope.rec.id = 0;
        $scope.rec.strategy_type = $scope.arr_strategy_type[0];
        $scope.rec.strategy = $scope.arr_strategy[0];

        $scope.selectedCustomers = [];
        $scope.arr_customers = [];
        $scope.currencyCode = $scope.$root.defaultCurrencyCode;
        $scope.rec.start_date = $scope.$root.get_current_date();

        angular.forEach($scope.arr_currency, function (elem) {
            if (elem.id == $scope.$root.defaultCurrency) {
                $scope.rec.currency = elem;
            }
        });

    }

    if ($stateParams.id == undefined)
        $scope.resetForm();
    else {
        $scope.check_readonly = true;

       var getUrl = $scope.$root.sales + "customer/customer/get-sale-promotion";
        $scope.rec = {};
        var postData = {
            'token': $rootScope.token,
            'id': $stateParams.id
        }
        $scope.showLoader = true;
        $http
            .post(getUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.rec = res.data.response;
                    $scope.rec.discount = Number($scope.rec.discount);
                    $scope.rec.display_promotion_gl_code = $scope.rec.promotion_gl_code + " - " + $scope.rec.promotion_gl_name;
                    $scope.gl_data = {
                        'G/L No.': $scope.rec.promotion_gl_code,
                        'G/L Name': $scope.rec.promotion_gl_name,
                        id: $scope.rec.promotion_gl_id
                    }

                    $scope.breadcrumbs.push({ 'name': $scope.rec.promotion_name + ' (' + $scope.rec.promotion_code + ')', 'url': '#', 'isActive': false });


                    angular.forEach($scope.list_type, function (obj) {
                        if (obj.id == $scope.rec.discount_type)
                            $scope.rec.disc_type = obj;
                    });

                    angular.forEach($scope.arr_strategy_type, function (obj) {
                        if (obj.id == $scope.rec.strategy_type_id)
                            $scope.rec.strategy_type = obj;
                    });

                    angular.forEach($scope.arr_strategy, function (obj) {
                        if (obj.id == $scope.rec.strategy_id)
                            $scope.rec.strategy = obj;
                    });

                    angular.forEach($scope.arr_currency, function (obj) {
                        if (obj.id == $scope.rec.currency_id)
                            $scope.rec.currency = obj;
                    });

                    $scope.selectedProducts = [];
                    $scope.selectedProducts_ids = [];
                    /* angular.forEach($scope.tempProdArr, function (obj) {
                        if ($scope.rec.product_list.indexOf(obj.id) != -1) {
                            $scope.selectedProducts_ids.push(obj.id);
                            $scope.selectedProducts.push(obj);
                            obj.chk = true;
                        }
                    }); */
                    angular.copy($scope.rec.product_list, $scope.selectedProducts_ids);

                    $scope.selectedCustomers = [];
                    $scope.selectedCustomers_ids = [];
                    /* angular.forEach($scope.arr_customers, function (obj) {
                        if ($scope.rec.customer_list.indexOf(obj.id) != -1) {
                            $scope.selectedCustomers.push(obj);
                            $scope.selectedCustomers_ids.push(obj.id);
                            obj.chk = true;
                        }
                    }); */

                    angular.copy($scope.rec.customer_list, $scope.selectedCustomers_ids);

                    $scope.clearFilterAndSelectCustomers(0);
                    $scope.clearAndSearchItems(0);

                }
                $scope.showLoader = false;
            });
    }

    /* $scope.getProducts = function () {
        $scope.filterPromotionItem = {
        };
        $rootScope.updateSelectedGlobalData("item");
        $scope.selectedProducts_ids = [];
        if ($scope.tempProdArr.length > 0) {
            angular.forEach($scope.tempProdArr, function (obj) {
                if (obj.chk == true)
                    $scope.selectedProducts_ids.push(obj.id);
            });
        }
        $scope.tempProdArr = [];
        angular.copy($rootScope.prooduct_arr, $scope.tempProdArr);

        angular.forEach($scope.tempProdArr, function (obj) {
            if ($scope.selectedProducts_ids.indexOf(obj.id) != -1)
                obj.chk = true;
        });
        angular.element('#productModal').modal({ show: true });
    }

    $scope.closeProductPopUp = function () {
        angular.element('#productModal').modal('hide');
    }

    var filtered;
    $scope.checkAllProducts = function (chk_all_prd, _brand, _units, _category) {

        var selection_filter = $filter('filter');
        filtered = selection_filter($scope.tempProdArr, $scope.filterPromotionItem.search);
        filtered = selection_filter(filtered, _brand);
        filtered = selection_filter(filtered, _units);
        filtered = selection_filter(filtered, _category);
        if (chk_all_prd) {
            angular.forEach(filtered, function (obj) {
                obj.chk = chk_all_prd;
            });
        } else {
            angular.forEach($scope.tempProdArr, function (obj) {
                obj.chk = false;
            });
        }

    }
    $scope.selectProducts = function () {
        $scope.selectedProducts = [];
        $scope.selectedProducts_ids = [];
        angular.forEach($scope.tempProdArr, function (obj) {
            if (obj.chk == true) {
                $scope.selectedProducts_ids.push(obj.id);
                $scope.selectedProducts.push(obj);
            }
        });

        angular.element('#productModal').modal('hide');
    } */



    $scope.getGL_account_code = function (arg) {
        var postUrl_cat = $scope.$root.gl + "chart-accounts/get-gl-accounts-heading-by-cat-id";
        $scope.postData = {};
        $scope.postData.cat_id = [];
        $scope.title = ' Chart of Accounts';
        $scope.postData.token = $scope.$root.token;
        if (arg == "promotion_gl_id") {
            $scope.postData.cat_id = [8, 11];
            $http
                .post(postUrl_cat, $scope.postData)
                .then(function (res) {
                    $scope.gl_accounts = res.data.response;
                    $scope.gl_account = [];
                    if (res.data.ack == true) {
                        $scope.gl_arg = arg;
                        $scope.gl_account_type_for = $scope.type_id;
                        angular.forEach(res.data.response, function (obj, index) {
                            delete obj.vat_id;
                            $scope.gl_account[index] = obj;
                        });
                    }
                    else toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

                    // angular.element('#item_gl_account_modal').modal({ show: true });
                });
        }

    };
    $scope.getGL_account_code('promotion_gl_id');



    $scope.assignCodes = function (gl_data) {

        $scope.rec.display_promotion_gl_code = gl_data['G/L No.'] + " - " + gl_data['G/L Name'];
        $scope.rec.promotion_gl_code = gl_data['G/L No.'];
        $scope.rec.promotion_gl_name = gl_data['G/L Name'];
        $scope.rec.promotion_gl_id = gl_data.id;
        //angular.element('#item_gl_account_modal').modal('hide');

    };

    $scope.getCode = function () {

        // var getCrmCodeUrl = $scope.$root.pr + "srm/srminvoice/get-quote-code";
        var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
        var name = $scope.$root.base64_encode('promotion');
        var module_category_id = 2;

        if ($stateParams.id === undefined) {

            $http
                .post(getCodeUrl, {
                    'is_increment': 1,
                    'token': $scope.$root.token,
                    'tb': name,
                    'category': '',
                    'brand': '',
                    'module_category_id': module_category_id,
                    'type': '1,2'
                })
                .then(function (res) {

                    if (res.data.ack == 1) {

                        $scope.rec.promotion_code = res.data.code;
                        $scope.update_sale_promo($scope.rec);
                    }
                    else {
                        toaster.pop('error', 'Error', res.data.error);
                        return false;
                    }
                });
        }

    }
    $scope.add_sale_promo = function (rec) {

        /* if (rec.id == undefined) {
            $scope.getCode();
        }
        else */
        $scope.update_sale_promo(rec);
    }

    $scope.update_sale_promo = function (rec) {

        rec.discount_type = (rec.disc_type.id != undefined) ? rec.disc_type.id : 0;
        rec.strategy_id = (rec.strategy != undefined && rec.strategy.id != undefined) ? rec.strategy.id : 0;
        rec.strategy_type_id = (rec.strategy_type != undefined && rec.strategy_type.id != undefined) ? rec.strategy_type.id : 0;
        rec.currency_id = rec.currency.id;

        var addUrl = $scope.$root.sales + "customer/customer/add-sale-promotion";
        rec.token = $rootScope.token;
        rec.product_list = $scope.selectedProducts_ids;
        rec.customer_list = $scope.selectedCustomers_ids;
        // rec.promotion_gl_code = $scope.rec.promotion_gl_code;
        // rec.promotion_gl_name = $scope.rec.promotion_gl_name;
        // rec.promotion_gl_id = $scope.rec.promotion_gl_id;

        var start_date = $rootScope.ConvertDateToUnixTimestamp(rec.start_date);
        var end_date = $rootScope.ConvertDateToUnixTimestamp(rec.end_date);

        if (rec.strategy_type_id == 0) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Strategy Type']));
            return;
        }
        if (rec.strategy_id == 0) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Strategy']));
            return;
        }
        if (start_date > end_date) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(333, ['Ending Date ', 'Start Date']));
            return;
        }

        if ($scope.selectedProducts_ids == undefined || $scope.selectedProducts_ids.length == 0) {
            toaster.pop('error', 'Error', "Please select items to the promotion");
            return;
        }

        if ($scope.selectedCustomers_ids == undefined || $scope.selectedCustomers_ids.length == 0) {
            toaster.pop('error', 'Error', "Please select customer to the promotion");
            return;
        }

        if ($scope.rec.promotion_gl_id == undefined || Number($scope.rec.promotion_gl_id) == 0) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['G/L Account']));
            return;
        }

        $rootScope.promotion_delete_error_msg = "Are you sure you want to apply this sales promotion as volume discount (if any) will not be applicable anymore to these customers for the selected period";

        ngDialog.openConfirm({
            template: '_confirm_promotion_delete_modal',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {

            $http
                .post(addUrl, rec)
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.rec.id = res.data.id;
                        $scope.rec.promotion_code = res.data.promotion_code;
                        toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(631, ['Promotion Saved']));
                        $scope.check_readonly = true;
                    }
                    else {
                        toaster.pop('error', 'Error', res.data.error);

                    }
                });

        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    }

    $scope.onChangeDiscount = function () {

        if ($scope.rec.disc_type.id != undefined) {

            if ($scope.rec.disc_type.id == '1') {
                if ($scope.rec.discount != '' && Number($scope.rec.discount) > 100) {
                    $scope.rec.discount = '';
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(515));
                }
            }
        }
    }
}