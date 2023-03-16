PriceAdjustmentController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$stateParams"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.priceAdjustment', {
                url: '/price-adjustment',
                title: 'Price Adjustment',
                templateUrl: helper.basepath('price_adjustment/_listing.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.addPriceAdjustment', {
                url: '/price-adjustment/add/:id',
                title: 'Add Price Adjustment',
                templateUrl: helper.basepath('price_adjustment_form.html'),
                controller: 'PriceAdjustmentAddController',
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
    }]);

myApp.controller('PriceAdjustmentController', PriceAdjustmentController);
myApp.controller('PriceAdjustmentAddController', PriceAdjustmentAddController);


function PriceAdjustmentController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams) {
    'use strict';

    $scope.breadcrumbs =
        [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
            {'name': 'Setup', 'url': '#', 'isActive': false},
            {'name': 'Sales', 'url': '#', 'isActive': false},
            // {'name':'Customer','url':'app.customer','isActive':false},
            {'name': 'Price Adjustment', 'url': '#', 'isActive': false}];

    $scope.module_id = 74;
    $scope.filter_id = 119;
    $scope.module_table = 'crm_price_offer';
    $scope.more_fields = 'is_listed*volume_1_price*volume_2_price*volume_3_price';
    $scope.condition = 0;
    $scope.sendRequest = false;
    $scope.isDetail = [];

    $scope.postData = {token: $scope.$root.token}

    $scope.MainDefer = null;
    $scope.mainParams = null;
    $scope.mainFilter = null;

    $scope.arr_promotions = [];
    $scope.priceStrategy = {};
    $scope.increase_decrease = '';


    $scope.count = 1;
    var vm = this;

    var ApiAjax = $scope.$root.sales + "customer/customer/price-adjustments";
    //var ApiAjax = $scope.$root.sales+"customer/customer/price-adjustment-detail";

    /*$http
     .post(promoUrl, {'token': $scope.$root.token})
     .then(function (res) {
     if(res.data.ack == true){
     $scope.arr_promotions = res.data.response;
     $scope.lstPromotion = $scope.arr_promotions[0];
     if($scope.lstPromotion.increase_decrease == 1)
     $scope.increase_decrease = 'Increase';
     else
     $scope.increase_decrease = 'Decrease';
     $scope.getPromotions();
     }

     });*/


    $scope.getPromotions = function () {
        $scope.postData.sale_promotion_id = $scope.lstPromotion.id;
        $scope.$root.$broadcast("myPriceAdjustmentEventReload");
    }

    //$scope.postData.sale_promotion_id = $scope.lstPromotion.id;


    $scope.$on("myPriceAdjustmentEventReload", function (event, args) {

        $scope.count = $scope.count + 1;

        ngDataService.getDataCustom($scope.MainDefer, $scope.mainParams, ApiAjax, $scope.mainFilter, $scope, $scope.postData);
        $scope.table.tableParams5.reload();

    });

    $scope.detail = function (id) {
        $timeout(function () {
            if ($scope.$root.lblButton == 'Add New') {
                $scope.$root.lblButton = 'Edit';
            }
        }, 100);

        $scope.$root.tabHide = 0;
        $scope.$root.$broadcast("openSalePromotionFormEvent", {'edit': false, id: id});
    }

    $scope.editForm = function (id) {
        $scope.$root.$broadcast("openSalePromotionFormEvent", {'edit': true, id: id});
    }


    $scope.$watch("MyCustomeFilters", function () {
        if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
            $scope.table.tableParams5.reload();
        }
    }, true);

    $scope.MyCustomeFilters = {}
    vm.tableParams5 = new ngParams({
        page: 1,            // show first page
        count: 5000,           // count per page
        filter: {
            name: '',
            age: ''
        }
    }, {
        total: 0,           // length of data
        counts: [],         // hide page counts control

        getData: function ($defer, params) {
            ngDataService.getDataCustom($defer, params, ApiAjax, $filter, $scope, $scope.postData);
            $scope.MainDefer = $defer;
            $scope.mainParams = params;
            $scope.mainFilter = $filter;
        }
    });


    $scope.$data = {};
    $scope.delete = function (rec, index, $data) {
        var delUrl = $scope.$root.sales + "customer/customer/delete-price-adjustment";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: rec.id,
                    product_id: rec.product_id,
                    price_adjustment_id: rec.price_adjustment_id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    /*if(res.data.ack == 1){
                     toaster.pop('error', 'Info', 'Record exist in sale order.');
                     }
                     else if(res.data.ack == 2){
                     toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                     $data.splice(index,1);
                     }
                     else if(res.data.ack == 3){
                     toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                     $data.splice(index,1);
                     location.reload();*/
                    if (res.data.ack == 1) {
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

    $scope.getExcCustomers = function (rec) {

        $scope.modal_title = "Excluded Customers";
        $scope.columns = [];
        $scope.arr_customers = [];
        var postData = {id: rec.id, 'token': $scope.$root.token, 'all': "1"};
        var custUrl = $scope.$root.sales + "customer/customer/sale-price_adjustment-excluded-customers";
        if (rec.customer_product_type_id == 3) {
            postData.column = 'region_id';
            postData.value = rec.crm_id;
        }
        if (rec.customer_product_type_id == 4) {
            postData.column = 'company_type';
            postData.value = rec.crm_id;
        }
        if (rec.customer_product_type_id == 5) {
            postData.column = 'buying_grp';
            postData.value = rec.crm_id;
        }


        $http
            .post(custUrl, postData)
            .then(function (res) {
                angular.forEach(res.data.response[0], function (val, index) {
                    if (index != 'chk' && index != 'id') {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    }
                });

                $scope.arr_customers = res.data.response;
                /*$.each(res.data.response,function(indx,obj){
                 obj.chk = false;
                 if($scope.selectedGroups.length > 0){
                 $.each($scope.selectedGroups,function(indx,obj2){
                 if(obj.id == obj2.id)
                 obj.chk = true;
                 });
                 }
                 $scope.arr_customers.push(obj);
                 });*/
            });
        angular.element('#custInfoModal3').modal({show: true});
    }

    $scope.getExcProducts = function (id) {
        $scope.columns = [];
        $scope.products = [];

        $scope.title = 'Products';
        var postUrl = $scope.$root.sales + "stock/products-listing/get-price-adjustment-excluded-products";
        var postData = {sale_promotion_id: id, 'token': $scope.$root.token, 'all': "1"};


        $http
            .post(postUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $.each(res.data.response, function (indx, obj) {
                        obj.chk = false;
                        $scope.products.push(obj);
                    });
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
                else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }

            });
        angular.element('#excludeProductModal').modal({show: true});
    }

    $scope.temp_rec = {};

    $scope.getProductsCustomers = function (rec) {
        return false;
        /*if(angular.element("#tbl_detail_"+rec.id).css('display') == 'block'){
         angular.element("#tbl_detail_"+rec.id).toggle('slow');
         return;
         }*/
        //$scope.isDetail[rec.id] = true;
        /*rec.detail.columns = [];
         rec.detail.data = {};*/

        $scope.temp_rec = rec;
        $scope.columns = [];
        $scope.arr_detail = {};
        var custUrl = $scope.$root.sales + "customer/customer/get-price-adjustment-products-customers";
        var start_date = $scope.$root.convert_numeric_date_to_string($scope.lstPromotion.start_date);
        var end_date = $scope.$root.convert_numeric_date_to_string($scope.lstPromotion.end_date);
        var postData = {
            sale_promotion_id: rec.id,
            customer_product_type_id: rec.customer_product_type_id,
            product_promotion_type_id: rec.product_promotion_type_id,
            price_strategy_type: $scope.lstPromotion.strategy_type_id,
            price_strategy: $scope.lstPromotion.strategy_id,
            discount_type: $scope.lstPromotion.discount_type,
            discount: $scope.lstPromotion.discount,
            increase_decrease: $scope.lstPromotion.increase_decrease,
            start_date: start_date,
            end_date: end_date,
            'token': $scope.$root.token,
            'all': "1"
        };

        if (rec.customer_product_type_id < 3) {
            postData.column = 'id';
            postData.value = rec.crm_id;
        }
        if (rec.customer_product_type_id == 3) {
            postData.column = 'region_id';
            postData.value = rec.crm_id;
        }
        if (rec.customer_product_type_id == 4) {
            postData.column = 'company_type';
            postData.value = rec.crm_id;
        }
        if (rec.customer_product_type_id == 5) {
            postData.column = 'buying_grp';
            postData.value = rec.crm_id;
        }

        if (rec.product_promotion_type_id == 1) {
            postData.prod_column = 'category_id';
            postData.prod_value = rec.product_id;
        }
        if (rec.product_promotion_type_id == 2) {
            postData.prod_column = 'brand_id';
            postData.prod_value = rec.product_id;
        }
        if (rec.product_promotion_type_id == 3) {
            postData.prod_column = 'id';
            postData.prod_value = rec.product_id;
        }


        $http
            .post(custUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    angular.forEach(res.data.response[0], function (val, index) {
                        if (index != 'chk' && index != 'id') {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }
                    });
                    $scope.arr_detail = res.data.response;

                    /*$timeout(function(){
                     $scope.$root.$apply(function(){
                     rec.detail;
                     });*/
                    //angular.element("#tbl_detail_"+rec.id).toggle('slow');
                    /*},2000);*/

                }
                // $scope.isDetail[rec.id] = false;
                //angular.element("#tbl_detail_"+rec.id).toggle('slow');
                angular.element('#detailModal').modal({show: true});

            });

    }


}

function PriceAdjustmentAddController($scope, $filter, $state, $timeout, $http, ngDialog, toaster, $stateParams, $rootScope) {

    $scope.breadcrumbs =
        [
            {'name': 'Sales', 'url': '#', 'isActive': false},
            // {'name':'Customer','url':'app.customer','isActive':false},
            {'name': 'Price Adjustment', 'url': 'app.priceAdjustment', 'isActive': false},
            {'name': 'Add', 'url': '#', 'isActive': false}];


    if ($stateParams.id !== undefined) {

        $scope.breadcrumbs =
            [
                {'name': 'Sales', 'url': '#', 'isActive': false},
                // {'name':'Customer','url':'app.customer','isActive':false},
                {'name': 'Price Adjustment', 'url': 'app.priceAdjustment', 'isActive': false},
                {'name': 'Edit', 'url': '#', 'isActive': false}];

    }


    $scope.formTitle = 'Price Adjustment';
    $scope.$root.tabHide = 0;
    $scope.$root.lblButton = 'Add New';
    $scope.check_readonly = 0;
    $scope.rec = {};
    $scope.formData = {};
    $scope.isPanelExpand = false;
    $scope.wordsLength = 0;
    $scope.arr_volume_1 = [];
    $scope.arr_volume_2 = [];
    $scope.arr_volume_3 = [];
    $scope.arr_unit_of_measure = [];
    $scope.arr_OfferMethod = [];
    $scope.time_types = [];
    $scope.formData.volume_1_id = 0;
    $scope.formData.volume_2_id = 0;
    $scope.formData.volume_3_id = 0;
    $scope.customers = [];
    $scope.arr_currency = [];
    $scope.arr_cust_prod_type = [];
    $scope.arr_prod_promo_type = [];
    $scope.arr_promotion_type = [];
    $scope.arr_strategy_type = [];
    $scope.arr_strategy = [];
    $scope.selectedCustomers = [];
    $scope.selectedProducts = [];
    $scope.selectedCatsBrands = [];
    $scope.cust_div_readonly = false;
    $scope.arrVolumeForms = [1];
    $scope.arr_customers = [];
    $scope.arr_regions = [];
    $scope.arr_segments = [];
    $scope.arr_buying_groups = [];
    $scope.isVolumeDiscForm = false;
    $scope.isVolumeDiscListing = false;
    $scope.isSubmitting = false;
    $scope.btnCancelUrl = 'app.priceAdjustment';
    $scope.$data = {};
    $scope.arr_volume_1.push({'id': '-1', 'name': '++ Add New ++'});
    $scope.arr_disc_type = [{'name': 'Percentage', 'id': 1}, {'name': 'Value', 'id': 2}];
    $scope.arr_increase_decrease = [{'name': 'Increase', 'id': 1}, {'name': 'Decrease', 'id': 2}];
    var constUrl = $scope.$root.setup + "ledger-group/get-predefine-by-type";

    $timeout(function () {
        angular.element('.date-picker').datepicker({dateFormat: $scope.$root.dateFormats[$scope.$root.defaultDateFormat]});
    }, 2000);

    /*$scope.formUrl = function() {
     return "app/views/price_adjustment/_form.html";
     }*/

    //if($stateParams.id == undefined){
    $timeout(function () {
        $scope.$root.$apply(function () {
            $scope.rec.disc_type = $scope.arr_disc_type[0];
        });
    }, 2000);
    //}

    $scope.showSalePromotionListing = function () {
        $scope.$root.$broadcast("showSalePromotionListing");
        var args = [];
        args[0] = $stateParams.id;
        args[1] = undefined;
        $scope.$root.$broadcast("myPriceAdjustmentEventReload", args);
    }

    $scope.showSalePromotionEditForm = function () {
        $scope.check_readonly = false;
    }

    var currencyUrl = $scope.$root.setup + "general/currency-list";
    $http
        .post(currencyUrl, {'token': $scope.$root.token})
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.arr_currency = res.data.response;
                $.each($scope.arr_currency, function (index, elem) {
                    if (elem.id == $scope.$root.defaultCurrency)
                        $scope.rec.currency = elem;
                });
                //$scope.arr_currency.push({'id':'-1','name':'++ Add New ++'});
            }
        });

    var custPodTypeUrl = $scope.$root.setup + "general/all-customer-product-type";
    $http
        .post(custPodTypeUrl, {'token': $scope.$root.token})
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.arr_cust_prod_type = res.data.response;
            }
        });

    var custPodTypeUrl = $scope.$root.setup + "general/pricing-strategy-types";
    $http
        .post(custPodTypeUrl, {'token': $scope.$root.token})
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.arr_strategy_type = res.data.response[1];
                $scope.arr_strategy = res.data.response[2];
            }
        });

    $scope.arr_cust_prod_types = [];
    var custPodTypeUrl = $scope.$root.setup + "general/all-customer-product-type";
    $http
        .post(custPodTypeUrl, {'token': $scope.$root.token})
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.arr_cust_prod_type = res.data.response;
                $.each(res.data.response, function (indx, obj) {
                    if (obj.id != 1 && obj.id != 2)
                        $scope.arr_cust_prod_types.push(obj);
                })
            }
        });

    /*var promotionTypeUrl = $scope.$root.sales+"customer/customer/all-promotion-types";
     $http
     .post(promotionTypeUrl, {'token':$scope.$root.token})
     .then(function (res) {
     if(res.data.ack == true){
     $scope.arr_promotion_type = res.data.response;
     var priceStrategyUrl = $scope.$root.setup+"general/get-pricing-strategy";
     $http
     .post(priceStrategyUrl, {'token': $scope.$root.token})
     .then(function (res) {
     if(res.data.ack == true){
     $.each($scope.arr_promotion_type, function(indx,obj){
     if(obj.id == res.data.response[1].id)
     $scope.rec.promotion_types = obj;
     });
     }

     });
     }
     });*/

    var promoProdTypeUrl = $scope.$root.sales + "customer/customer/all-product-promotion-types";
    $http
        .post(promoProdTypeUrl, {'token': $scope.$root.token})
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.arr_prod_promo_type = res.data.response;
            }
        });


    $scope.onProdChangeType = function (type) {
        $scope.selectedCatsBrands = [];
        $scope.selectedProducts = [];
    }

    $scope.onChangeType = function (type) {
        $scope.selectedGroups = [];
        $scope.selectedCustomers = [];
        $scope.selectedLocations = [];
        if (type == 1 || type == 2) {
            if ($scope.arr_customers.length > 0)
                return;

            var custUrl = $scope.$root.sales + "customer/customer/get-customers-for-popup";
            $http
                .post(custUrl, {'token': $scope.$root.token})
                .then(function (res) {
                    $scope.arr_customers = res.data.response;
                });
        }
        if (type == 3) {
            if ($scope.arr_regions.length > 0)
                return;

            var regionUrl = $scope.$root.setup + "crm/region-list";
            $http
                .post(regionUrl, {'token': $scope.$root.token})
                .then(function (res) {
                    $scope.arr_regions = res.data.response;
                    $scope.arr_regions.push({'id': '-1', 'title': '++ Add New ++'});
                });
        }
        if (type == 4) {
            if ($scope.arr_segments.length > 0)
                return;

            var segmentUrl = $scope.$root.setup + "crm/segment-list";
            $http
                .post(segmentUrl, {'token': $scope.$root.token})
                .then(function (res) {
                    $scope.arr_segments = res.data.response;
                    $scope.arr_segments.push({'id': '-1', 'title': '++ Add New ++'});
                });
        }
        if (type == 5) {
            if ($scope.arr_buying_groups.length > 0)
                return;

            var bgroupUrl = $scope.$root.setup + "crm/buying-group-list";
            $http
                .post(bgroupUrl, {'token': $scope.$root.token})
                .then(function (res) {
                    $scope.arr_buying_groups = res.data.response;
                    $scope.arr_buying_groups.push({'id': '-1', 'title': '++ Add New ++'});
                });
        }

    }

// Alt Locations
//--------------------------------------------------
    /*$scope.selectAltLocation = function() {
     $scope.arr_alt_location = [];
     var ApiAjax = $scope.$root.sales+"crm/crm/alt-depots";
     $http
     .post(ApiAjax, {'column':'crm_id','value':$scope.rec.customer_id,token:$scope.$root.token})
     .then(function (res) {
     $scope.arr_alt_location = res.data.record.result;
     if($scope.rec.id > 0 && $scope.arr_alt_location.length > 0){
     $.each($scope.arr_alt_location,function(index,elem){
     console.log(elem.id +'=='+ $scope.rec.crm_alt_location_id);
     if(elem.id == $scope.rec.crm_alt_location_id)
     $scope.rec.alt_location = elem;
     });
     }
     });
     angular.element('#groupInfoModal').modal({show: true});
     }*/

    $scope.getAltLocations = function (isShow) {
        $scope.arr_alt_location = [];
        $scope.columns = [];
        var ApiAjax = $scope.$root.sales + "crm/crm/alt-depots";
        $http
            .post(ApiAjax, {'column': 'crm_id', 'value': $scope.rec.customer_id, token: $scope.$root.token})
            .then(function (res) {
                $scope.columns = res.data.columns;
                $.each(res.data.record.result, function (index, obj) {
                    obj.chk = false;
                    if ($scope.selectedLocations.length > 0) {
                        $.each($scope.selectedLocations, function (indx, obj2) {
                            if (obj.id == obj2.id)
                                obj.chk = true;
                        });
                    }
                    $scope.arr_alt_location.push(obj);
                    if ($scope.rec.id > 0) {
                        if (obj.id == $scope.rec.crm_alt_location_id) {
                            $scope.selectedLocations.push(obj);
                        }
                    }
                });
            });

        if (!isShow)
            angular.element('#altLocationInfoModal').modal({show: true});
    }


    angular.element(document).on('click', '.checkAllLocations', function () {
        $scope.selectedLocations = [];
        if (angular.element('.checkAllLocations').is(':checked') == true) {
            for (var i = 0; i < $scope.arr_alt_location.length; i++) {
                $scope.arr_alt_location[i].chk = true;
                $scope.selectedLocations.push($scope.arr_alt_location[i]);
            }
        }
        else {
            for (var i = 0; i < $scope.arr_alt_location.length; i++) {
                $scope.arr_alt_location[i].chk = false;
            }
            $scope.selectedLocations = [];
        }

        $scope.$root.$apply(function () {
            $scope.selectedLocations;
        });

    });

    $scope.selectLocation = function (cust) {
        for (var i = 0; i < $scope.arr_alt_location.length; i++) {
            if (cust.id == $scope.arr_alt_location[i].id) {
                if ($scope.arr_alt_location[i].chk == true) {
                    $scope.arr_alt_location[i].chk = false;
                    $.each($scope.selectedLocations, function (indx, obj) {
                        if (obj != undefined) {
                            if (obj.id == cust.id)
                                $scope.selectedLocations.splice(indx, 1);
                        }
                    });
                }
                else {
                    $scope.arr_alt_location[i].chk = true;
                    $scope.selectedLocations.push($scope.arr_alt_location[i]);
                }

            }

        }
        /*angular.element('#custInfoModal').modal('hide');*/
    }
//--------------------------------------------------------------------------------	  

    $scope.$on("showAddCustItemInfoForm", function () {
        $scope.cust_div_readonly = false;
        $scope.resetForm();
        $scope.arrIds = [];
        $scope.$data = [];

        $scope.getOfferMethods();
        $scope.arr_volume_1 = [];
        $scope.arr_volume_1.push({'id': '-1', 'name': '++ Add New ++'});

        $scope.formData = {};
        $scope.getVolumeDiscouts();
        var ProductDetailsURL = $scope.$root.stock + "products-listing/item_detail_by_id";
        $http
            .post(ProductDetailsURL, {'token': $scope.$root.token, 'product_id': $stateParams.id})
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.loadDropDownsData(res.data.response.id);
                    $scope.rec.product_name = res.data.response.description;
                    $scope.rec.product_id = res.data.response.id;
                    $scope.rec.product_code = res.data.response.item_code;
                    //$scope.loadDropDownsData2(res.data.response.id,1);
                    $scope.item_code = res.data.response.item_code;
                    $scope.item_description = res.data.response.description;
                    $scope.formData.item_id = res.data.response.id;
                }
            });

    });

    $scope.datePicker = {};

    /************** Calendar *********************/
    /*$scope.starteDate = function(startDate,type){
     if(isNaN(Date.parse(startDate))){
     var s = startDate.split('/');
     var dateObj = new Date(Number(s[2]),Number(s[1]) -1 ,Number(s[0]));
     dateObj.setDate(dateObj.getDate() + 1);
     }
     else{
     var dateObj = new Date();
     dateObj.setDate(startDate.getDate() + 1);
     }

     $scope.newD = $scope.newD ? null : dateObj;
     //$scope.starteDate= false;
     }*/

    $scope.setMinDate = function (mindate, calendr) {

        if (!mindate)
            return;

        console.log(Date.parse(mindate));
        console.log(mindate);
        console.log(calendr);
        console.log('-------------');

        if (isNaN(Date.parse(mindate))) {
            var s = mindate.split('/');
            if (s[2] == undefined) {
                var strDate = $rootScope.convert_numeric_date_to_string(mindate);
                var s = strDate.split('/');
                var dateObj = new Date(Number(s[2]), Number(s[1]) - 1, Number(s[0]));
            }
            else {
                var dateObj = new Date(Number(s[2]), Number(s[1]) - 1, Number(s[0]));
                dateObj.setDate(dateObj.getDate() + 1);
            }
        }
        else {
            var dateObj = new Date(mindate);
            dateObj.setDate(dateObj.getDate() + 1);
        }

        console.log(mindate);
        console.log(dateObj);
        console.log(calendr);
        console.log('-------------');
        if (calendr == 'offer_valid_date')
            $scope.offerValidMinDate = dateObj;
        if (calendr == 'start_date1')
            $scope.start1MinDate = dateObj;
        if (calendr == 'start_date2')
            $scope.start2MinDate = dateObj;
        if (calendr == 'start_date3')
            $scope.start3MinDate = dateObj;
        if (calendr == 'end_date1')
            $scope.end1MinDate = dateObj;
        if (calendr == 'end_date2')
            $scope.end2MinDate = dateObj;
    }

    $scope.convertToDateObject = function (str_date) {

        if (!str_date)
            return;

        if (isNaN(Date.parse(str_date))) {
            var s = str_date.split('/');
            if (s[2] == undefined) {
                var strDate = $rootScope.convert_numeric_date_to_string(str_date);
                var s = strDate.split('/');
                var dateObj = new Date(Number(s[2]), Number(s[1]) - 1, Number(s[0]));
            }
            else {
                var dateObj = new Date(Number(s[2]), Number(s[1]) - 1, Number(s[0]));
            }
        }
        else {
            var dateObj = new Date(str_date);
            dateObj.setHours(00);
        }

        /*console.log(mindate);
         console.log(dateObj);
         console.log(calendr);
         console.log('-------------');*/
        return dateObj;

    }


    $scope.checkDate = function (start_date, end_date, calendr) {
        if (start_date && /\/.*\//.test(start_date)) {
            var s = start_date.split('/');
            if (s[2] == undefined) {
                var strDate = $rootScope.convert_numeric_date_to_string(start_date);
                var s = strDate.split('/');
                var dateObj1 = new Date(Number(s[2]), Number(s[1]) - 1, Number(s[0]));
            }
            else {
                var dateObj1 = new Date(Number(s[2]), Number(s[1]) - 1, Number(s[0]));
            }
        }
        else {
            var dateObj1 = new Date(start_date);
        }


        if (end_date && /\/.*\//.test(end_date)) {
            var s = end_date.split('/');
            if (s[2] == undefined) {
                var strDate = $rootScope.convert_numeric_date_to_string(end_date);
                var s = strDate.split('/');
                var dateObj2 = new Date(Number(s[2]), Number(s[1]) - 1, Number(s[0]));
            }
            else {
                var dateObj2 = new Date(Number(s[2]), Number(s[1]) - 1, Number(s[0]));
            }
        }
        else {
            var dateObj2 = new Date(end_date);
        }

        if (dateObj2 < dateObj1) {
            if (dateObj2.getFullYear() == 1970)
                return;
            $scope.rec[calendr] = null;
            toaster.pop('error', 'Info', 'Start Date must be earlier than End Date.');
            return;
        }

    }

    /*$scope.checkRange = function(volume_id,mdlCalendar,calendr) {
     console.log(volume_id);
     console.log(mdlCalendar);
     console.log(calendr);
     console.log('-------------');
     if(volume_id == undefined){
     toaster.pop('error','Info','Please select volume.');
     $scope.formData[calendr] = null;
     return;
     }

     var 
     $http
     .post(pOfferUrl, {id:id,'token':$scope.$root.token})
     .then(function (res) {

     });	
     }*/

    $scope.datePicker = (function () {

        var method = {};
        method.instances = [];
        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        method.open = function ($event, instance) {
            $event.preventDefault();
            $event.stopPropagation();

            var old_instance = $scope.$root.$storage.getItem('old_instance');
            if (old_instance != null)
                method.instances[old_instance] = false;

            method.instances[instance] = true;
            $scope.$root.$storage.setItem('old_instance', instance);

        };

        method.options = {
            'show-weeks': false,
            startingDay: 0
        };

        method.format = $scope.$root.dateFormats[$scope.$root.defaultDateFormat];

        return method;
    }());
    /******************************************/

    $scope.showForm = true;

    $scope.getCustomerPriceAdjustmentDetail = function (id) {
        $scope.check_readonly = true;
        $scope.columns = [];
        $scope.arr_detail = [];
        var temp_arr = [];
        var custUrl = $scope.$root.sales + "customer/customer/get-customer-price-adjustment-detail";
        $http
            .post(custUrl, {id: id, token: $rootScope.token})
            .then(function (res) {
                if (res.data.ack == true) {
                    $.each(res.data.response, function (index, obj) {
                        $.each($scope.arr_increase_decrease, function (indx, elem) {
                            if (elem.id == obj.increase_decrease)
                                obj.increase_decrease_id = elem;
                        });
                        $.each($scope.arr_disc_type, function (indx, elem) {
                            if (elem.id == obj.discount_type)
                                obj.disc_type = elem;
                        });
                        obj.Customer_Name = obj.customer_name;
                        obj.Product_Code = obj.product_code;
                        obj.Product_Description = obj.product_description;
                        $scope.arr_detail.push(obj);
                    });


                }

            });
    }

    if ($stateParams.id != undefined && $stateParams.id > 0) {
        $scope.showForm = false;
        var id = $stateParams.id;
        $scope.getCustomerPriceAdjustmentDetail(id);

        /*return false;


         $scope.arrIds = [];
         //$scope.resetForm();
         $scope.selectedCustomers = [];
         $scope.selectedGroups = [];
         $scope.selectedLocations = [];
         $scope.cust_div_readonly = true;
         $scope.isVolumeDiscListing = true;
         //$timeout(function() {

         var id = $stateParams.id;
         var detail_id = $stateParams.detail_id;
         /*if(arg.edit == false)
         $scope.check_readonly = true;
         else
         $scope.check_readonly = false;*/
        //$scope.$root.$broadcast("showSalePromotionForm");
        /*$scope.pOfferFormShow = false;
         $scope.pOfferListingShow = true;*
         var pOfferUrl = $scope.$root.sales+"customer/customer/get-price-adjustment";
         $scope.rec = {};
         $http
         .post(pOfferUrl, {id:id,detail_id:detail_id,'token':$scope.$root.token})
         .then(function (res) {
         $scope.rec = res.data.response;

         $scope.onChangeType(res.data.response.customer_product_type_id);
         $scope.loadDropDownsData(res.data.response.product_id,res.data.response.type);



         if(res.data.response.product_promotion_type_id < 3)
         $scope.getCatsBrands(1,res.data.response.product_promotion_type_id);
         if(res.data.response.product_promotion_type_id == 3)
         $scope.getProducts(1,res.data.response.product_promotion_type_id);


         $timeout(function(){
         $scope.$root.$apply(function(){
         /*$.each($scope.arr_currency,function(index,elem){if(elem.id == res.data.response.currency_id){$scope.rec.currencys = elem;}});*
         $.each($scope.arr_cust_prod_type,function(index,elem){if(elem.id == res.data.response.customer_product_type_id){$scope.rec.cust_prod_type = elem;}});
         $.each($scope.arr_promotion_type,function(indx,obj){
         if(obj.id == $scope.rec.promotion_type_id)
         $scope.rec.promotion_types = obj;
         });
         $.each($scope.arr_prod_promo_type,function(indx,obj){
         if(obj.id == $scope.rec.product_promotion_type_id)
         $scope.rec.product_promotion = obj;
         });
         $.each($scope.arr_cust_prod_type,function(indx,obj){
         if(obj.id == $scope.rec.customer_product_type_id)
         $scope.rec.cust_prod_type = obj;
         });
         if(res.data.response.product_promotion_type_id < 3){
         $.each($scope.cats_brands,function(index,elem){
         if(elem.id == res.data.response.product_id)
         $scope.selectedCatsBrands.push(elem);
         });
         }
         if(res.data.response.product_promotion_type_id == 3){
         $.each($scope.products,function(index,elem){
         if(elem.id == res.data.response.product_id)
         $scope.selectedProducts.push(elem);
         });
         }
         $.each($scope.arr_disc_type,function(index,obj){
         if(obj.id == res.data.response.discount_type){
         $scope.rec.disc_type= obj; 
         }
         });
         $.each($scope.arr_increase_decrease,function(index,obj){
         if(obj.id == res.data.response.increase_decrease){
         $scope.rec.increase_decrease_id= obj; 
         }
         });
         });




         if(res.data.response.customer_product_type_id == 1){
         $.each($scope.arr_customers,function(index,elem){
         if(elem.id == res.data.response.crm_id){
         $scope.$root.$apply(function(){
         $scope.selectedCustomers.push(elem);
         });
         }
         });

         }

         if(res.data.response.customer_product_type_id == 2){
         $.each($scope.arr_customers,function(index,elem){
         if(elem.id == res.data.response.crm_id){
         $scope.rec.customer_name = elem.customer_name;
         $scope.rec.customer_id = elem.id;
         }
         });

         $scope.getAltLocations(1);

         }
         if(res.data.response.customer_product_type_id == 3){
         $.each($scope.arr_regions,function(index,elem){
         if(elem.id == res.data.response.crm_id)
         $scope.selectedGroups.push(elem);
         });
         $scope.getCustomers(1);
         }
         if(res.data.response.customer_product_type_id == 4){
         $.each($scope.arr_segments,function(index,elem){
         if(elem.id == res.data.response.crm_id)
         $scope.selectedGroups.push(elem);
         });
         $scope.getCustomers(1);
         }
         if(res.data.response.customer_product_type_id == 5){
         $.each($scope.arr_buying_groups,function(index,elem){
         if(elem.id == res.data.response.crm_id)
         $scope.selectedGroups.push(elem);
         });
         $scope.getCustomers(1);
         }

         //$scope.formData.purchase_price_1 = res.data.response.price_offered;
         /*$scope.formData.purchase_price_2 = res.data.response.price_offered;
         $scope.formData.purchase_price_3 = res.data.response.price_offered;*

         $scope.getCustomerPriceAdjustment($scope.rec);
         $scope.rec.start_date = $scope.convert_numeric_date_to_string(res.data.response.start_date);
         $scope.rec.end_date = $scope.convert_numeric_date_to_string(res.data.response.end_date);

         //});
         },2000);





         // volume discount form
         /*$scope.selectedCustomers = [];
         var getCrmUrl = $scope.$root.sales+"customer/customer/get-customer";
         $http
         .post(getCrmUrl, {id:res.data.response.crm_id,'token':$scope.$root.token})
         .then(function (cutsRes) {
         cutsRes.data.response.Name = cutsRes.data.response.name;
         $scope.selectedCustomers.push(cutsRes.data.response);
         });*/

        /*$scope.formData.purchase_price_1 = $scope.rec.price_offered;
         $scope.formData.price_list_id = id;
         $scope.formData.item_id = $scope.rec.product_id;
         $scope.item_code = $scope.rec.product_code;
         $scope.item_description = $scope.rec.product_name;
         $scope.loadDropDownsData2($stateParams.id,res.data.response.crm_id,res.data.response.customer_product_type_id);
         //$scope.supplier_pop(id);
         $scope.getVolumeDiscouts();*

         });
         //}, 100);*/

    }
    ;


    $scope.getOffer = function (arg) {
        $scope.columns = [];
        $scope.record = {};
        $scope.title = 'Offered By';
        var empUrl = $scope.$root.hr + "employee/listings";
        postData = {
            'token': $scope.$root.token,
            'all': "1",
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
            $scope.rec.offered_by = result.first_name + ' ' + result.last_name;
            $scope.rec.offered_by_id = result.id;
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }


    $scope.getCurrencyCode = function () {
        $scope.currency_code = this.rec.currency_ids.name;
    }


    function toTitleCase(str) {
        var title = str.replace('_', ' ');
        return title.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    $scope.loadDropDownsData = function (item_id, type) {
        /*$scope.arr_unit_of_measure = [];
         var unitUrl = $scope.$root.sales + "stock/unit-measure/get-unit-setup-list-category";
         $http
         .post(unitUrl, {item_id:item_id,'token':$scope.$root.token})
         .then(function (unit_data) {
         $scope.arr_unit_of_measure.push({'id':'0','name':''});
         $.each(unit_data.data.response,function(index,obj){
         $scope.arr_unit_of_measure.push(obj);
         });
         //$scope.arr_unit_of_measure.push({'id':'-1','title':'++ Add New ++'});
         });*/
    }

    $scope.items = {};


    $scope.getCustomers = function (isShow, cust_types, search_data) {
        $scope.columns = [];
        $scope.customers = [];
        //$scope.selectedCustomers = [];
        $scope.title = 'Customers';
        $scope.rec.type = 1;
        var postData = {'token': $scope.$root.token, 'all': "1"};
        var custUrl = $scope.$root.sales + "customer/customer/get-customers-for-popup";

        /*console.log(isShow);
         console.log(cust_types);
         console.log(search_data);*/
        if (isShow == 'all') {
            $scope.rec.cust_types = '';
            $scope.rec.search_data = '';
        }
        else if (isShow == 2) {
            var type_id = cust_types != undefined ? cust_types.id : '';
            var postData = {'type_id': type_id, 'search_data': search_data, token: $scope.$root.token}
        }
        if ($scope.rec.cust_prod_type.id == 3) {
            postData.column = 'region_id';
            postData.value = $scope.selectedGroups[0].id;
        }
        if ($scope.rec.cust_prod_type.id == 4) {
            postData.column = 'company_type';
            postData.value = $scope.selectedGroups[0].id;
        }
        if ($scope.rec.cust_prod_type.id == 5) {
            postData.column = 'buying_grp';
            postData.value = $scope.selectedGroups[0].id;
        }
        $http
            .post(custUrl, postData)
            .then(function (res) {
                angular.forEach(res.data.response[0], function (val, index) {
                    if (index != 'chk' && index != 'id') {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    }
                });
                $.each(res.data.response, function (indx, obj) {
                    obj.chk = false;
                    if ($scope.selectedCustomers.length > 0) {
                        $.each($scope.selectedCustomers, function (indx, obj2) {
                            if (obj.id == obj2.id)
                                obj.chk = true;
                        });
                    }
                    $scope.customers.push(obj);
                });

                if (res.data.response.length > 0 && $scope.rec.id > 0) {
                    if ($scope.rec.cust_prod_type.id > 2) {
                        var empUrl = $scope.$root.sales + "customer/customer/get-excluded-customers";
                        $http
                            .post(empUrl, {customer_item_info_id: $scope.rec.id, 'token': $scope.$root.token})
                            .then(function (resd) {
                                if (resd.data.ack == true) {
                                    //$timeout(function(){
                                    $.each($scope.customers, function (indx, obj) {
                                        $.each(resd.data.response, function (indx2, obj2) {
                                            if (obj.id == obj2)
                                                $scope.selectedCustomers.push(obj);
                                        });
                                    });

                                    //},3000);
                                    //$scope.selectedCustomers = resd.data.response;
                                }
                            });
                    }
                }
            });

        if (!isShow)
            angular.element('#custInfoModal').modal({show: true});
    }

    $scope.getExcCustomers = function (isShow, cust_types, search_data) {
        $scope.title = "Excluded Customers";
        $scope.columns = [];
        $scope.customers = [];
        /*if($scope.rec.id == undefined)
         $scope.selectedCustomers = [];*/

        var postData = {'token': $scope.$root.token, 'all': "1"};
        var custUrl = $scope.$root.sales + "customer/customer/popup-listing-for-groups";
        var groupIds = [];
        $.each($scope.selectedGroups, function (indx, elem) {
            groupIds.push(elem.id);
        });

        if (isShow == 'all') {
            $scope.rec.cust_types = '';
            $scope.rec.search_data = '';
        }
        else if (isShow == 2) {
            var type_id = cust_types != undefined ? cust_types.id : '';
            var postData = {'type_id': type_id, 'search_data': search_data, token: $scope.$root.token}
        }
        /*console.log(JSON.stringify(groupIds));
         var ids = JSON.stringify(groupIds);*/

        if ($scope.rec.cust_prod_type.id == 3) {
            postData.column = 'region_id';
            postData.value = groupIds;
        }
        if ($scope.rec.cust_prod_type.id == 4) {
            postData.column = 'company_type';
            postData.value = groupIds;
        }
        if ($scope.rec.cust_prod_type.id == 5) {
            postData.column = 'buying_grp';
            postData.value = groupIds;
        }
        $http
            .post(custUrl, postData)
            .then(function (res) {
                angular.forEach(res.data.response[0], function (val, index) {
                    if (index != 'chk' && index != 'id') {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    }
                });
                $.each(res.data.response, function (indx, obj) {
                    obj.chk = false;
                    if ($scope.selectedCustomers.length > 0) {
                        $.each($scope.selectedCustomers, function (indx, obj2) {
                            if (obj.id == obj2.id)
                                obj.chk = true;
                        });
                    }
                    $scope.customers.push(obj);
                    /*if($scope.rec.id != undefined && $scope.selectedCustomers.length > 0){
                     $.each($scope.selectedCustomers,function(indx2,obj2){
                     if(obj2.id == obj.id)
                     obj.chk = true;
                     });
                     }*/

                });
            });

        if (!isShow)
            angular.element('#custInfoForGrpsModal').modal({show: true});
    }

    angular.element(document).on('click', '.checkAllCust', function () {
        $scope.selectedCustomers = [];
        if (angular.element('.checkAllCust').is(':checked') == true) {
            for (var i = 0; i < $scope.customers.length; i++) {
                $scope.customers[i].chk = true;
                $scope.selectedCustomers.push($scope.customers[i]);
            }
        }
        else {
            for (var i = 0; i < $scope.customers.length; i++) {
                $scope.customers[i].chk = false;
            }
            $scope.selectedCustomers = [];
        }

        $scope.$root.$apply(function () {
            $scope.selectedCustomers;
        });

    });

    $scope.selectCustomer = function (cust) {
        for (var i = 0; i < $scope.customers.length; i++) {
            if (cust.id == $scope.customers[i].id) {
                if ($scope.customers[i].chk == true) {
                    $scope.customers[i].chk = false;
                    $.each($scope.selectedCustomers, function (indx, obj) {
                        if (obj != undefined) {
                            if (obj.id == cust.id)
                                $scope.selectedCustomers.splice(indx, 1);
                        }
                    });

                }
                else {
                    $scope.customers[i].chk = true;
                    $scope.selectedCustomers.push($scope.customers[i]);
                }

            }

        }
        /*angular.element('#custInfoModal').modal('hide');*/
    }

// Select Regions, Segments and Buying goups
//-------------------------------------------------------------

    $scope.getGroups = function () {
        $scope.columns = [];
        $scope.customer_groups = [];
        //$scope.selectedGroups = [];
        if ($scope.rec.cust_prod_type.id == 3) {
            $scope.title = 'Regions';
            var custUrl = $scope.$root.setup + "crm/region-list";
        }
        if ($scope.rec.cust_prod_type.id == 4) {
            $scope.title = 'Segments';
            var custUrl = $scope.$root.setup + "crm/segment-list";
        }
        if ($scope.rec.cust_prod_type.id == 5) {
            $scope.title = 'Buying Groups';
            var custUrl = $scope.$root.setup + "crm/buying-group-list";
        }

        var postData = {'token': $scope.$root.token, 'all': "1"};

        $http
            .post(custUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $.each(res.data.response, function (indx, obj) {
                        obj.chk = false;
                        if ($scope.selectedGroups.length > 0) {
                            $.each($scope.selectedGroups, function (indx, obj2) {
                                if (obj.id == obj2.id)
                                    obj.chk = true;
                            });
                        }
                        $scope.customer_groups.push(obj);
                    });
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
                else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }

            });
        angular.element('#groupInfoModal').modal({show: true});
    }
    angular.element(document).on('click', '.checkAll', function () {
        $scope.selectedGroups = [];
        if (angular.element('.checkAll').is(':checked') == true) {
            for (var i = 0; i < $scope.customer_groups.length; i++) {
                $scope.customer_groups[i].chk = true;
                $scope.selectedGroups.push($scope.customer_groups[i]);
            }
        }
        else {
            for (var i = 0; i < $scope.customer_groups.length; i++) {
                $scope.customer_groups[i].chk = false;
            }
            $scope.selectedGroups = [];
        }

        $scope.$root.$apply(function () {
            $scope.selectedGroups;
        });

    });

    $scope.selectGroup = function (cust) {
        for (var i = 0; i < $scope.customer_groups.length; i++) {
            if (cust.id == $scope.customer_groups[i].id) {
                if ($scope.customer_groups[i].chk == true) {
                    $scope.customer_groups[i].chk = false;
                    $.each($scope.selectedGroups, function (indx, obj) {
                        if (obj != undefined) {
                            if (obj.id == cust.id)
                                $scope.selectedGroups.splice(indx, 1);
                        }
                    });
                }
                else {
                    $scope.customer_groups[i].chk = true;
                    $scope.selectedGroups.push($scope.customer_groups[i]);
                }

            }

        }
        /*angular.element('#custInfoModal').modal('hide');*/
    }

//------------------------------------------------------------

// Select Categories, Brands
//-------------------------------------------------------------

    $scope.getCatsBrands = function (isShow, type) {
        $scope.columns = [];
        $scope.cats_brands = [];
        //$scope.selectedCatsBrands = [];
        if (type == undefined)
            var type = $scope.rec.product_promotion.id;
        if (type == 1) {
            $scope.title = 'Categories';
            var postUrl = $scope.$root.sales + "stock/products-listing/get-all-categories";
        }
        if (type == 2) {
            $scope.title = 'Brands';
            var postUrl = $scope.$root.sales + "stock/products-listing/get-all-brands";
        }

        var postData = {'token': $scope.$root.token, 'all': "1"};

        $http
            .post(postUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $.each(res.data.response, function (indx, obj) {
                        obj.chk = false;
                        if ($scope.selectedCatsBrands.length > 0) {
                            $.each($scope.selectedCatsBrands, function (indx, obj2) {
                                if (obj.id == obj2.id)
                                    obj.chk = true;
                            });
                        }
                        $scope.cats_brands.push(obj);
                    });
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
                else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }

            });

        if (!isShow)
            angular.element('#catsBrandsModal').modal({show: true});
    }

    angular.element(document).on('click', '.checkAllCatsBrands', function () {
        $scope.selectedCatsBrands = [];
        if (angular.element('.checkAllCatsBrands').is(':checked') == true) {
            for (var i = 0; i < $scope.cats_brands.length; i++) {
                $scope.cats_brands[i].chk = true;
                $scope.selectedCatsBrands.push($scope.cats_brands[i]);
            }
        }
        else {
            for (var i = 0; i < $scope.cats_brands.length; i++) {
                $scope.cats_brands[i].chk = false;
            }
            $scope.selectedCatsBrands = [];
        }

        $timeout(function () {
            $scope.$root.$apply(function () {
                $scope.selectedCatsBrands;
            });
        }, 500);

    });

    $scope.selectCatBrand = function (cust) {
        for (var i = 0; i < $scope.cats_brands.length; i++) {
            if (cust.id == $scope.cats_brands[i].id) {

                if ($scope.cats_brands[i].chk == true) {
                    $scope.cats_brands[i].chk = false;
                    $.each($scope.selectedCatsBrands, function (indx, obj) {
                        if (obj != undefined) {
                            if (obj.id == cust.id)
                                $scope.selectedCatsBrands.splice(indx, 1);
                        }
                    });
                }
                else {
                    $scope.cats_brands[i].chk = true;
                    $scope.selectedCatsBrands.push($scope.cats_brands[i]);
                }

            }

        }

    }

//------------------------------------------------------------


// Select Products
//-------------------------------------------------------------

    $scope.getProducts = function (isShow, type) {
        $scope.columns = [];
        $scope.products = [];
        //$scope.selectedProducts = [];

        $scope.title = 'Products';
        var postUrl = $scope.$root.sales + "stock/products-listing/get-all-products";
        var postData = {'token': $scope.$root.token, 'all': "1"};
        if (type == undefined)
            var type = $scope.rec.product_promotion.id;

        if (type == 1)
            postData.categories = $scope.selectedCatsBrands;
        if (type == 2)
            postData.brands = $scope.selectedCatsBrands;

        $http
            .post(postUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $.each(res.data.response, function (indx, obj) {
                        obj.chk = false;
                        if ($scope.selectedProducts.length > 0) {
                            $.each($scope.selectedProducts, function (indx, obj2) {
                                if (obj.id == obj2.id)
                                    obj.chk = true;
                            });
                        }
                        $scope.products.push(obj);
                    });
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
                else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }

            });
        if (!isShow)
            angular.element('#productModal').modal({show: true});
    }

    angular.element(document).on('click', '.checkAllProducts', function () {
        $scope.selectedProducts = [];
        if (angular.element('.checkAllProducts').is(':checked') == true) {
            for (var i = 0; i < $scope.products.length; i++) {
                $scope.products[i].chk = true;
                $scope.selectedProducts.push($scope.products[i]);
            }
        }
        else {
            for (var i = 0; i < $scope.products.length; i++) {
                $scope.products[i].chk = false;
            }
            $scope.selectedProducts = [];
        }

        $timeout(function () {
            $scope.$root.$apply(function () {
                $scope.selectedProducts;
            });
        }, 500);

    });

    $scope.selectProduct = function (prod) {
        for (var i = 0; i < $scope.products.length; i++) {
            if (prod.id == $scope.products[i].id) {
                if ($scope.products[i].chk == true) {
                    $scope.products[i].chk = false;
                    $.each($scope.selectedProducts, function (indx, obj) {
                        if (obj != undefined) {
                            if (obj.id == prod.id)
                                $scope.selectedProducts.splice(indx, 1);
                        }
                    });
                }
                else {
                    $scope.products[i].chk = true;
                    $scope.selectedProducts.push($scope.products[i]);
                }

            }

        }
        /*angular.element('#custInfoModal').modal('hide');*/
    }

//------------------------------------------------------------

    $scope.getCustomer = function () {
        $scope.columns = [];
        $scope.arr_customers = [];
        $scope.rec.type = 1;
        var postData = {'token': $scope.$root.token, 'all': "1"};
        var custUrl = $scope.$root.sales + "customer/customer/popup-listing-for-alt-location";

        $http
            .post(custUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $.each(res.data.response, function (indx, obj) {
                        $scope.arr_customers.push(obj);
                    });
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
        angular.element('#custInfoModal2').modal({show: true});
    }

    $scope.addCustomer = function (cust) {
        $scope.rec.customer_name = cust.Name;
        $scope.rec.customer_id = cust.id;
        //$scope.selectAltLocation();
        angular.element('#custInfoModal2').modal('hide');
    }


    $scope.loadDropDownsData2 = function (item_id, crm_id, type) {
        $scope.arr_volume_1 = [];
        $scope.arr_volume_2 = [];
        $scope.arr_volume_3 = [];
        $scope.arr_unit_of_measure = [];

        //if(type == 1){
        var volumeUrl = $scope.$root.sales + "stock/unit-measure/get-sale-offer-volume-by-type";
        /*var unitUrl = $scope.$root.sales+"stock/unit-measure/get-unit-setup-list-category";
         }
         if(type == 2){
         var volumeUrl = $scope.$root.setup+"service/products-listing/price-offer-volumes";
         var unitUrl = $scope.$root.setup+"service/unit-measure/get-all-unit";
         }*/


        $http
            .post(volumeUrl, {type: type, crm_id: crm_id, 'item_id': item_id, 'token': $scope.$root.token})
            .then(function (vol_data) {
                $scope.arr_volume_1.push({'id': '0', 'name': ''});
                $.each(vol_data.data.response, function (index, obj) {
                    $scope.arr_volume_1.push(obj);
                });
                $scope.arr_volume_1.push({'id': '-1', 'name': '++ Add New ++'});
            });

        /*$http
         .post(volumeUrl, {type:'Volume 2',category: 1,'item_id':item_id ,'token':$scope.$root.token})
         .then(function (vol_data) {
         $scope.arr_volume_2.push({'id':'0','name':''});
         $.each(vol_data.data.response,function(index,obj){
         $scope.arr_volume_2.push(obj);
         });
         $scope.arr_volume_2.push({'id':'-1','name':'++ Add New ++'});
         });

         $http
         .post(volumeUrl, {type:'Volume 3',category: 1,'item_id':item_id ,'token':$scope.$root.token})
         .then(function (vol_data) {
         $scope.arr_volume_3.push({'id':'0','name':''});
         $.each(vol_data.data.response,function(index,obj){
         $scope.arr_volume_3.push(obj);
         });
         $scope.arr_volume_3.push({'id':'-1','name':'++ Add New ++'});
         });*/

    }

    $scope.setPrice = function () {
        $scope.formData.purchase_price_1 = $scope.rec.price_offered;
        $scope.formData.purchase_price_2 = $scope.rec.price_offered;
        $scope.formData.purchase_price_3 = $scope.rec.price_offered;
    }

    $scope.addItem = function (item, type) {
        $scope.loadDropDownsData(item.id);
        $scope.rec.product_name = item.description;
        $scope.rec.product_id = item.id;
        $scope.rec.product_code = item.item_code;
        //$scope.loadDropDownsData2(item.id,type);
        $scope.item_code = item.item_code;
        $scope.item_description = item.description;
        //$scope.formData.purchase_price_1 = $scope.formData.purchase_price_2 = $scope.formData.purchase_price_3 = result['Offer Price'];
        //$scope.formData.price_list_id = result.id;
        $scope.formData.item_id = item.id;
        $scope.formData.type = type;

        /*if(result.volume_1_price != undefined){
         $scope.formData.purchase_price_1 = result.volume_1_price;
         }
         if(result.volume_2_price != undefined){
         $scope.formData.purchase_price_2 = result.volume_2_price;
         }
         if(result.volume_3_price != undefined){
         $scope.formData.purchase_price_3 = result.volume_3_price;
         }*/

        /*$timeout(function(){

         if(result.volume_1 != undefined){
         $.each($scope.arr_volume_1, function(index,elem){
         console.log(elem.id +'=='+ result.volume_1);
         if(elem.id == result.volume_1){
         $scope.$root.$apply(function(){
         $scope.formData.volume_1 = elem;
         });
         }
         });
         }
         if(result.volume_2 != undefined){
         $.each($scope.arr_volume_2, function(index,elem){
         if(elem.id == result.volume_2){
         $scope.$root.$apply(function(){
         $scope.formData.volume_2 = elem;
         });
         }
         });
         }
         if(result.volume_3 != undefined){
         $.each($scope.arr_volume_3, function(index,elem){
         if(elem.id == result.volume_3){
         $scope.$root.$apply(function(){
         $scope.formData.volume_3 = elem;
         });
         }
         });
         }
         },3000);*/
        angular.element('#itemInfoModal').modal('hide');
    }

    $scope.resetForm = function (rec) {
        $scope.check_readonly = false;
        $scope.showItms = true;
        $scope.showServ = true;
        $scope.formData = {};
        $scope.rec = {};
        $scope.selectedCustomers = [];
        $scope.selectedGroups = [];
        $scope.selectedLocations = [];
        $scope.counter = 0;
        $scope.arrVolumeForms = [1];
        $scope.arr_customers = [];
        $scope.arr_alt_location = [];
        $scope.arr_regions = [];
        $scope.arr_segments = [];
        $scope.arr_buying_groups = [];
        $scope.formData.volume_1_id = 0;
        $scope.formData.volume_2_id = 0;
        $scope.formData.volume_3_id = 0;
        $scope.isPanelExpand = false;
        $scope.currencyCode = $scope.$root.defaultCurrencyCode;
        $scope.customers = [];
        $scope.isAdded = false;
        $scope.isSubmitting = false;
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        ;
        var day = d.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        ;

        if ($rootScope.defaultDateFormat == $rootScope.dtYMD)
            $scope.offered_date = year + "/" + month + "/" + day;
        if ($rootScope.defaultDateFormat == $rootScope.dtMDY)
            $scope.offered_date = month + "/" + day + "/" + year;
        if ($rootScope.defaultDateFormat == $rootScope.dtDMY)
            $scope.offered_date = day + "/" + month + "/" + year;

        //$scope.discount_date = $filter('date')(d, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
        $scope.current_date = d;
        $scope.rec.start_date = $scope.offered_date;//$filter('date')(d, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
        /*$scope.formData.start_date1 = $filter('date')(d, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);*/
        /*$scope.setMinDate($scope.rec.offer_date,'offer_valid_date');
         $scope.setMinDate($scope.rec.offer_date,'start_date1');*/
        /*console.log(d);
         console.log($scope.rec.offer_date);*/
        //console.log(Date.parse($scope.rec.offer_date));

        $.each($scope.arr_currency, function (index, elem) {
            if (elem.id == $scope.$root.defaultCurrency) {
                $scope.rec.currencys = elem;
            }
        });

        if (!angular.element("#btnPanelExpand").hasClass('collapsed')) {
            angular.element("#btnPanelExpand").click();
        }

    }

    $scope.resetForm();

    $scope.add = function (rec) {

        if (rec.product_promotion.id == 1) {
            if ($scope.selectedCatsBrands.length == 0) {
                toaster.pop('error', 'Info', 'Please select Category(ies).');
                return false;
            }
        }
        if (rec.product_promotion.id == 2) {
            if ($scope.selectedCatsBrands.length == 0) {
                toaster.pop('error', 'Info', 'Please select Brand(s).');
                return false;
            }
        }
        if (rec.product_promotion.id == 3) {
            if ($scope.selectedProducts.length == 0) {
                toaster.pop('error', 'Info', 'Please select Product(s).');
                return false;
            }
        }

        if (rec.cust_prod_type.id == 1) {
            if ($scope.selectedCustomers.length == 0) {
                toaster.pop('error', 'Info', 'Please select Customer(s).');
                return false;
            }
        }
        if (rec.cust_prod_type.id == 2) {
            rec.crm_id = rec.customer_id != undefined ? rec.customer_id : 0;
            if (rec.crm_id == 0) {
                toaster.pop('error', 'Info', 'Please select customer.');
                return false;
            }
            if ($scope.selectedLocations.length == 0) {
                toaster.pop('error', 'Info', 'Please select Alt. Location.');
                return false;
            }
        }

        if (rec.cust_prod_type.id == 3) {
            if ($scope.selectedGroups.length == 0) {
                toaster.pop('error', 'Info', 'Please select Region(s).');
                return false;
            }
        }
        if (rec.cust_prod_type.id == 4) {
            if ($scope.selectedGroups.length == 0) {
                toaster.pop('error', 'Info', 'Please select Segment(s).');
                return false;
            }
        }
        if (rec.cust_prod_type.id == 5) {
            if ($scope.selectedGroups.length == 0) {
                toaster.pop('error', 'Info', 'Please select Buying Group(s).');
                return false;
            }
        }
        if (rec.disc_type.id == 1) {
            if (rec.discount >= 100) {
                toaster.pop('error', 'Info', '100% adjustment is not allowed.');
                return false;
            }
        }

        $scope.isSubmitting = true;
        var addUrl = $scope.$root.sales + "customer/customer/add-price-adjustment";
        rec.strategy_type_id = rec.strategy_type != undefined ? rec.strategy_type.id : 0;
        rec.strategy_id = rec.strategy != undefined ? rec.strategy.id : 0;
        rec.discount_type = rec.disc_type != undefined ? rec.disc_type.id : 0;
        rec.increase_decrease = rec.increase_decrease_id != undefined ? rec.increase_decrease_id.id : 0;
        rec.currency_id = rec.currency != undefined ? rec.currency.id : 0;
        rec.token = $scope.$root.token;
        if (rec.id)
            addUrl = $scope.$root.sales + "customer/customer/update-price-adjustment";

        $http
            .post(addUrl, rec)
            .then(function (res) {
                var args = [];
                args[0] = $stateParams.id;
                args[1] = undefined;
                if (res.data.ack == true) {

                    if (rec.id) {
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                        //$scope.$root.$broadcast("mySalePromotionEventReload", args);
                        $timeout(function () {
                            $state.go('app.priceAdjustment');
                        }, 2000);
                        return;
                    }
                    rec.sale_promotion_id = res.data.id;
                    $scope.addDetail(rec);

                }
                else {
                    if (rec.id) {
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                        //$scope.$root.$broadcast("mySalePromotionEventReload", args);
                        $timeout(function () {
                            $state.go('app.priceAdjustment');
                        }, 2000);
                    }
                }
            });
    }


    $scope.isAdded = false;
    $scope.counter = 0;
    $scope.prodCounter = 0;
    $scope.arrIds = [];
    $scope.addDetail = function (rec) {

        var addUrl = $scope.$root.sales + "customer/customer/add-price-adjustment-detail";
        rec.promotion_type_id = rec.promotion_types != undefined ? rec.promotion_types.id : 0;
        rec.product_promotion_type_id = rec.product_promotion != undefined ? rec.product_promotion.id : 0;
        rec.customer_product_type_id = rec.cust_prod_type != undefined ? rec.cust_prod_type.id : 0;
        rec.discount_type = rec.disc_type != undefined ? rec.disc_type.id : 0;

        if (rec.cust_prod_type.id == 1) {
            rec.crm_id = $scope.selectedCustomers[$scope.counter].id;
            rec.crm_ids = $scope.selectedCustomers;
        }
        if (rec.cust_prod_type.id == 2) {
            rec.crm_id = rec.customer_id != undefined ? rec.customer_id : 0;
            rec.crm_alt_location_id = $scope.selectedLocations[$scope.counter].id;
        }
        if (rec.cust_prod_type.id > 2) {
            rec.crm_id = $scope.selectedGroups[$scope.counter].id;
            rec.crm_ids = $scope.selectedGroups;
        }
        if (rec.product_promotion_type_id < 3) {
            rec.product_id = $scope.selectedCatsBrands[$scope.prodCounter].id;
            rec.product_ids = $scope.selectedCatsBrands;
        }
        if (rec.product_promotion_type_id == 3) {
            rec.product_id = $scope.selectedProducts[$scope.prodCounter].id;
            rec.product_ids = $scope.selectedProducts;
        }

        rec.token = $scope.$root.token;

        if (rec.id != undefined) {
            addUrl = $scope.$root.sales + "customer/customer/update-price-adjustment-detail";
        }

        $http
            .post(addUrl, rec)
            .then(function (res) {

                //if(res.data.ack == true || res.data.edit == true){
                var args = [];
                args[0] = $stateParams.id;
                args[1] = undefined;
                var id = 0;
                if (rec.id > 0) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $scope.formData.price_list_id = rec.id;
                    id = rec.id;
                    if (rec.cust_prod_type.id > 2) {
                        if ($scope.selectedCustomers.length > 0 || $scope.selectedGroups.length > 0)
                            $scope.add_excluded_customers(id, $scope.selectedGroups[$scope.counter].id);

                    }
                    if (rec.product_promotion_type_id < 3) {
                        if ($scope.selectedCatsBrands.length > 0)
                            $scope.add_excluded_products(id, $scope.selectedCatsBrands[$scope.counter].id);

                    }
                    $scope.$root.$broadcast("myPriceAdjustmentEventReload", args);
                    /*if($scope.formData.volume_1 != undefined)
                     $scope.add_supplier(rec.crm_id,formData);*/
                }
                else {

                    id = res.data.id;
                    $scope.arrIds.push(id);
                    if (rec.cust_prod_type.id > 2) {
                        if ($scope.selectedCustomers.length > 0) {
                            $scope.add_excluded_customers(rec.sale_promotion_id, $scope.selectedGroups[$scope.counter].id);
                        }
                        /*if($scope.selectedGroups.length > 0 && $scope.selectedProducts.length > 0)
                         $scope.add_excluded_customers(id,$scope.selectedGroups[$scope.counter].id,$scope.selectedProducts[$scope.prodCounter].id);*/
                    }

                    if (rec.product_promotion_type_id < 3) {
                        if ($scope.selectedProducts.length > 0) {
                            $scope.add_excluded_products(rec.sale_promotion_id, $scope.selectedCatsBrands[$scope.prodCounter].id);
                        }
                    }

                    /*console.log($scope.selectedCustomers.length +'>='+ ($scope.counter + 1));
                     console.log($scope.selectedProducts.length +'!='+ ($scope.prodCounter + 1));*/

                    if (rec.cust_prod_type.id == 1) {
                        /*console.log($scope.selectedCustomers.length +'>='+ ($scope.counter + 1));
                         console.log($scope.selectedProducts.length +'!='+ ($scope.prodCounter + 1));*/
                        //console.log($scope.selectedCatsBrands.length +'!='+ ($scope.prodCounter + 1));
                        if ($scope.selectedCustomers.length >= ($scope.counter + 1)) {
                            if ($scope.selectedCustomers.length == ($scope.counter + 1)) {
                                if (rec.product_promotion_type_id < 3) {
                                    if ($scope.selectedCatsBrands.length != ($scope.prodCounter + 1)) {
                                        $scope.prodCounter++;
                                        $scope.counter = 0;
                                        $scope.addDetail(rec);
                                    }
                                    else {
                                        //toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                                        $scope.$root.$broadcast("myPriceAdjustmentEventReload", args);
                                        $scope.delete(rec.sale_promotion_id, rec, res.data.ack);
                                        /*$timeout(function(){
                                         $scope.isSubmitting = false; 
                                         //$state.go('app.priceAdjustment'); 
                                         $scope.getCustomerPriceAdjustment(rec);
                                         }, 3000);*/
                                        $scope.isAdded = true;
                                        $scope.counter = 0;
                                    }
                                }
                                if (rec.product_promotion_type_id == 3) {
                                    if ($scope.selectedProducts.length != ($scope.prodCounter + 1)) {
                                        $scope.prodCounter++;
                                        $scope.counter = 0;
                                        $scope.addDetail(rec);
                                    }
                                    else {
                                        //toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                                        $scope.delete(rec.sale_promotion_id, rec, res.data.ack);
                                        //$scope.delete(rec.sale_promotion_id,res.data.ack);
                                        /*$timeout(function(){
                                         $scope.isSubmitting = false; 
                                         //$state.go('app.priceAdjustment'); 
                                         $scope.getCustomerPriceAdjustment(rec);
                                         }, 3000);*/
                                        $scope.isAdded = true;
                                        $scope.counter = 0;

                                    }
                                }
                            }
                            else {
                                $scope.counter++;
                                $scope.addDetail(rec);
                            }
                        }
                        else {
                            //toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                            $scope.$root.$broadcast("myPriceAdjustmentEventReload", args);
                            $scope.delete(rec.sale_promotion_id, rec, res.data.ack);
                            /* $timeout(function(){
                             $scope.isSubmitting = false; 
                             //$state.go('app.priceAdjustment'); 
                             $scope.getCustomerPriceAdjustment(rec);
                             }, 3000);*/
                            $scope.isAdded = true;
                            $scope.counter = 0;
                        }
                    }
                    else if (rec.cust_prod_type.id == 2) {
                        if ($scope.selectedLocations.length >= ($scope.counter + 1)) {
                            if ($scope.selectedLocations.length == ($scope.counter + 1)) {
                                if (rec.product_promotion_type_id < 3) {
                                    if ($scope.selectedCatsBrands.length != ($scope.prodCounter + 1)) {
                                        $scope.prodCounter++;
                                        $scope.counter = 0;
                                        $scope.addDetail(rec);
                                    }
                                    else {
                                        //toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                                        $scope.$root.$broadcast("myPriceAdjustmentEventReload", args);
                                        $scope.delete(rec.sale_promotion_id, rec, res.data.ack);
                                        /*$timeout(function(){
                                         $scope.isSubmitting = false; 
                                         //$state.go('app.priceAdjustment'); 
                                         $scope.getCustomerPriceAdjustment(rec);
                                         }, 3000);*/
                                        $scope.isAdded = true;
                                        $scope.counter = 0;
                                    }
                                }
                                if (rec.product_promotion_type_id == 3) {
                                    if ($scope.selectedProducts.length != ($scope.prodCounter + 1)) {
                                        $scope.prodCounter++;
                                        $scope.counter = 0;
                                        $scope.addDetail(rec);
                                    }
                                    else {
                                        //toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                                        $scope.$root.$broadcast("myPriceAdjustmentEventReload", args);
                                        $scope.delete(rec.sale_promotion_id, rec, res.data.ack);
                                        /*$timeout(function(){
                                         $scope.isSubmitting = false; 
                                         //$state.go('app.priceAdjustment'); 
                                         $scope.getCustomerPriceAdjustment(rec);
                                         }, 3000);*/
                                        $scope.isAdded = true;
                                        $scope.counter = 0;
                                    }
                                }
                            }
                            else {
                                $scope.counter++;
                                $scope.addDetail(rec);
                            }
                        }
                        else {
                            //toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                            $scope.$root.$broadcast("myPriceAdjustmentEventReload", args);
                            $scope.delete(rec.sale_promotion_id, rec, res.data.ack);
                            /*$timeout(function(){
                             $scope.isSubmitting = false; 
                             //$state.go('app.priceAdjustment'); 
                             $scope.getCustomerPriceAdjustment(rec);
                             }, 3000);*/
                            $scope.isAdded = true;
                            $scope.counter = 0;
                        }
                    }
                    else if (rec.cust_prod_type.id > 2) {
                        if ($scope.selectedGroups.length >= ($scope.counter + 1)) {
                            if ($scope.selectedGroups.length == ($scope.counter + 1)) {
                                if (rec.product_promotion_type_id < 3) {
                                    if ($scope.selectedCatsBrands.length != ($scope.prodCounter + 1)) {
                                        $scope.prodCounter++;
                                        $scope.counter = 0;
                                        $scope.addDetail(rec);
                                    }
                                    else {
                                        //toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                                        $scope.$root.$broadcast("myPriceAdjustmentEventReload", args);
                                        $scope.delete(rec.sale_promotion_id, rec, res.data.ack);
                                        /* $timeout(function(){
                                         $scope.isSubmitting = false; 
                                         //$state.go('app.priceAdjustment'); 
                                         $scope.getCustomerPriceAdjustment(rec);
                                         }, 3000);*/
                                        $scope.isAdded = true;
                                        $scope.counter = 0;
                                    }
                                }
                                if (rec.product_promotion_type_id == 3) {
                                    if ($scope.selectedProducts.length != ($scope.prodCounter + 1)) {
                                        $scope.prodCounter++;
                                        $scope.counter = 0;
                                        $scope.addDetail(rec);
                                    }
                                    else {
                                        //toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                                        $scope.$root.$broadcast("myPriceAdjustmentEventReload", args);
                                        $scope.delete(rec.sale_promotion_id, rec, res.data.ack);
                                        /*$timeout(function(){
                                         $scope.isSubmitting = false; 
                                         //$state.go('app.priceAdjustment'); 
                                         $scope.getCustomerPriceAdjustment(rec);
                                         }, 3000);*/
                                        $scope.isAdded = true;
                                        $scope.counter = 0;
                                    }
                                }

                            }
                            else {
                                $scope.counter++;
                                $scope.addDetail(rec);
                            }
                        }
                        else {
                            $scope.isAdded = true;
                            $scope.counter = 0;
                            //toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                            $scope.$root.$broadcast("myPriceAdjustmentEventReload", args);
                            $scope.delete(rec.sale_promotion_id, rec, res.data.ack);
                            /*$timeout(function(){ $scope.isSubmitting = false;
                             //$state.go('app.priceAdjustment'); 
                             $scope.getCustomerPriceAdjustment(rec);
                             }, 3000);*/
                        }
                    }
                    else {
                        ///toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                        $scope.$root.$broadcast("myPriceAdjustmentEventReload", args);
                        $scope.delete(rec.sale_promotion_id, rec, res.data.ack);
                        /*$timeout(function(){
                         $scope.isSubmitting = false; 
                         //$state.go('app.priceAdjustment'); 
                         $scope.getCustomerPriceAdjustment(rec);
                         }, 3000);*/
                        isAdded = true;
                        $scope.counter = 0;
                    }
                }
            });

    }

    $scope.temp_rec = {};
    $scope.arr_detail = [];
    $scope.getCustomerPriceAdjustment = function (rec) {
        $scope.check_readonly = true;
        angular.element('html,body').animate({
                scrollTop: $("#adj_detail").offset().top
            },
            'slow');

        /*if(angular.element("#tbl_detail_"+rec.id).css('display') == 'block'){
         angular.element("#tbl_detail_"+rec.id).toggle('slow');
         return;
         }*/
        //$scope.isDetail[rec.id] = true;
        /*rec.detail.columns = [];
         rec.detail.data = {};*/

        $scope.temp_rec = rec;
        $scope.columns = [];
        $scope.arr_detail = [];
        var custUrl = $scope.$root.sales + "customer/customer/get-price-adjustment-products-customers";
        /*var start_date = $scope.$root.convert_numeric_date_to_string(rec.start_date);		
         var end_date = $scope.$root.convert_numeric_date_to_string(rec.end_date);*/
        var postData = {
            sale_promotion_id: rec.sale_promotion_id,
            customer_product_type_id: rec.customer_product_type_id,
            product_promotion_type_id: rec.product_promotion_type_id,
            price_strategy_type: rec.strategy_type_id,
            price_strategy: rec.strategy_id,
            discount_type: rec.discount_type,
            discount: rec.discount,
            increase_decrease: rec.increase_decrease,
            start_date: rec.start_date,
            end_date: rec.end_date,
            'token': $scope.$root.token,
            'all': "1"
        };

        if (rec.customer_product_type_id < 3) {
            postData.column = 'id';
            postData.value = rec.crm_ids;
        }
        if (rec.customer_product_type_id == 3) {
            postData.column = 'region_id';
            postData.value = rec.crm_ids;
        }
        if (rec.customer_product_type_id == 4) {
            postData.column = 'company_type';
            postData.value = rec.crm_ids;
        }
        if (rec.customer_product_type_id == 5) {
            postData.column = 'buying_grp';
            postData.value = rec.crm_ids;
        }

        if (rec.product_promotion_type_id == 1) {
            postData.prod_column = 'category_id';
            postData.prod_value = rec.product_ids;
        }
        if (rec.product_promotion_type_id == 2) {
            postData.prod_column = 'brand_id';
            postData.prod_value = rec.product_ids;
        }
        if (rec.product_promotion_type_id == 3) {
            postData.prod_column = 'id';
            postData.prod_value = rec.product_ids;
        }


        $http
            .post(custUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $.each(res.data.response, function (index, obj) {
                        $.each($scope.arr_increase_decrease, function (indx, elem) {
                            if (elem.id == obj.increase_decrease)
                                obj.increase_decrease_id = elem;
                        });
                        $.each($scope.arr_disc_type, function (indx, elem) {
                            if (elem.id == obj.discount_type)
                                obj.disc_type = elem;
                        });
                        obj.sale_promotion_id = rec.sale_promotion_id;
                        obj.show_red = false;

                        $scope.arr_detail.push(obj);
                    });
                    $scope.isSubmitting = false;
                }

            });
    }


    $scope.isButtonDisable = false;
    $scope.finalPrice = function (detail) {
        //console.log(detail);
        var final_disc_price = 0;
        if (detail.increase_decrease_id.id == 1) {
            if (detail.disc_type.id == 1)
                final_disc_price = Number(detail.price_offered) + (Number(detail.price_offered) * Number(detail.adjustment) / 100);
            else
                final_disc_price = Number(detail.price_offered) + Number(detail.adjustment);
        }
        else {
            if (detail.disc_type.id == 1)
                final_disc_price = Number(detail.price_offered) - (Number(detail.price_offered) * Number(detail.adjustment) / 100);
            else
                final_disc_price = Number(detail.price_offered) - Number(detail.adjustment);
        }

        if (final_disc_price < detail.absolute_minimum_price && detail.is_adjustment > 0) {
            //angular.element("#btnDetail").addClass("dont-click");
            //$scope.isButtonDisable = true;
            //console.log('1-->>'+$scope.isButtonDisable);
            detail.show_red = true;
        }
        if (final_disc_price > detail.absolute_minimum_price && detail.is_adjustment > 0) {
            //angular.element("#btnDetail").removeClass("dont-click");
            //$scope.isButtonDisable = false;
            //console.log('2-->>'+$scope.isButtonDisable);
            detail.show_red = false;
        }


        return final_disc_price;
        checkPrice();
        //console.log($scope.arr_detail[index].final_disc_price);
    }

    $scope.setAdjustment = function (price, index) {
        //console.log(detail);
        var adjustment = 0;
        if ($scope.arr_detail[index].increase_decrease_id.id == 1) {
            if ($scope.arr_detail[index].disc_type.id == 1)
                adjustment = 100 * (Number(price) - Number($scope.arr_detail[index].price_offered)) / Number($scope.arr_detail[index].price_offered);
            else
                adjustment = Number(price) - Number($scope.arr_detail[index].price_offered);
        }
        else {
            if ($scope.arr_detail[index].disc_type.id == 1)
                adjustment = 100 * (Number(price) + Number($scope.arr_detail[index].price_offered)) / Number($scope.arr_detail[index].price_offered);
            else
                adjustment = Number(price) + Number($scope.arr_detail[index].price_offered);
        }

        if ($scope.arr_detail[index].final_disc_price < $scope.arr_detail[index].absolute_minimum_price && $scope.arr_detail[index].is_adjustment > 0) {
            //angular.element("#btnDetail").addClass("dont-click");
            //$scope.isButtonDisable = true;
            //console.log('3-->>'+$scope.isButtonDisable);
            $scope.arr_detail[index].show_red = true;
        }
        if ($scope.arr_detail[index].final_disc_price > $scope.arr_detail[index].absolute_minimum_price && $scope.arr_detail[index].is_adjustment > 0) {
            //angular.element("#btnDetail").removeClass("dont-click");
            //$scope.isButtonDisable = false;
            //console.log('4-->>'+$scope.isButtonDisable);
            $scope.arr_detail[index].show_red = false;
        }

        $scope.arr_detail[index].adjustment = adjustment;
        checkPrice();
        //console.log($scope.arr_detail[index].final_disc_price);
    }

    function checkPrice() {
        var check = false;
        var count = 0;
        angular.forEach($scope.arr_detail, function (obj) {
            if (Number(obj.final_disc_price) < Number(obj.absolute_minimum_price)) {
                check = true;
            }
            count++;
        });

        if (count == $scope.arr_detail.length)
            $scope.isButtonDisable = check;
    }

    $rootScope.addCustPriceAdjustment = function (arr_detail) {
        var postUrl = $scope.$root.sales + "customer/customer/add-customer-price-adjustment";
        var postData = {};
        postData.token = $scope.$root.token;
        postData.adjustments = arr_detail;
        $http
            .post(postUrl, postData)
            .then(function (res) {
                toaster.pop('success', 'Info', 'Successfully Add.');
                $timeout(function () {
                    $state.go('app.priceAdjustment');
                }, 3000);
            });
    };


    $scope.delete = function (id, rec, status) {
        var delUrl = $scope.$root.sales + "customer/customer/check-nd-delete-price-adjustment";
        $http
            .post(delUrl, {id: id, 'token': $scope.$root.token})
            .then(function (res) {
                if (res.data.ack == 2) {
                    if (status == 2)
                        toaster.pop('error', 'Error', 'Already exist.');
                    if (status == 3)
                        toaster.pop('error', 'Error', 'Customer price is not set.');
                }
                else {

                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $timeout(function () {
                        //$state.go('app.priceAdjustment'); 
                        $scope.getCustomerPriceAdjustment(rec);
                    }, 3000);
                }

            });
    };


    $scope.add_excluded_customers = function (id, grp_id) {
        var excUrl = $scope.$root.sales + "customer/customer/add-price-adjustment-excluded-customers";
        var rec = {};
        rec.product_id = 0;
        rec.customers = $scope.selectedCustomers;
        if ($scope.rec.cust_prod_type.id == 3)
            rec.region_id = grp_id;
        if ($scope.rec.cust_prod_type.id == 4)
            rec.segment_id = grp_id;
        if ($scope.rec.cust_prod_type.id == 5)
            rec.buying_group_id = grp_id;
        rec.sale_promotion_id = id;
        rec.token = $scope.$root.token;
        $http
            .post(excUrl, rec)
            .then(function (res) {
            });
    }

    $scope.add_excluded_products = function (id, grp_id) {
        var excUrl = $scope.$root.sales + "stock/products-listing/add-price-adjustment-excluded-products";
        var rec = {};
        rec.products = $scope.selectedProducts;
        if ($scope.rec.product_promotion_type_id == 1)
            rec.category_id = grp_id;
        if ($scope.rec.product_promotion_type_id == 2)
            rec.brand_id = grp_id;
        rec.sale_promotion_id = id;
        rec.token = $scope.$root.token;
        $http
            .post(excUrl, rec)
            .then(function (res) {
            });
    }

    $scope.count = 0;
    $scope.addVolumeDiscount = function (formData) {
        var updateUrl = $scope.$root.sales + "crm/crm/add-product-values";
        if ($scope.rec.cust_prod_type.id == 1)
            formData.crm_id = $scope.selectedCustomers[$scope.count].id;
        if ($scope.rec.cust_prod_type.id == 2)
            formData.crm_id = $scope.selectedLocations[$scope.count].id;
        if ($scope.rec.cust_prod_type.id > 2)
            formData.crm_id = $scope.selectedGroups[$scope.count].id;

        formData.token = $scope.$root.token;

        formData.volume_1s = formData.volume_1[$scope.count].id;
        formData.supplier_type_1s = formData.supplier_type_1 !== undefined ? formData.supplier_type_1.id : 0;
        formData.customer_item_info_id = formData.volume_1[$scope.count].customer_item_info_id;
        formData.item_id = $stateParams.id;
        if (formData.id > 0)
            var updateUrl = $scope.$root.sales + "crm/crm/update-product-values";

        $http
            .post(updateUrl, formData)
            .then(function (res) {
                if (res.data.ack == 1) {
                    if (formData.volume_1.length != ($scope.count + 1)) {
                        $scope.count++;
                        $scope.addVolumeDiscount(formData);
                    }
                    else {
                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                        formData.volume_1 = null;
                        $scope.getVolumeDiscouts();
                        $scope.count = 0;
                    }

                }
                if (res.data.ack == 2) {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(107));
                }
            });
    }


    $scope.editVolDisc = function (id) {

        $scope.isVolumeDiscListing = false;
        $scope.isVolumeDiscForm = true;
        //$scope.arr_disc_type= [{'name':'Percentage','id':1},{'name':'Value','id':2}];

        /*$scope.show_supplier_pop= true;   
         angular.element('#model_btn_supplier_id').click();*/

        // $scope.show_supplier_pop= true;   
        /* angular.element('#model_btn_supplier_id').click();
         */
        // console.log( id);
        /*angular.element('#model_btn_supplier').modal({
         show: true
         });*/

        // console.log( id);


        //$scope.showLoader = true;


        var postUrl = $scope.$root.sales + "crm/crm/volume_discount_by_id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };

        // 	$timeout(function(){
        $http
            .post(postUrl, postViewBankData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.arrVolumeForms = [];
                    var elem = res.data.response;
                    $scope.arrIds = [];
                    $scope.arrIds.push(elem.customer_item_info_id);
                    console.log($scope.arrIds);
                    $scope.get_item_voume_list();
                    $scope.formData.id = elem.id;
                    //$scope.arrVolumeForms.push(1);
                    /*$timeout(function(){
                     $.each($scope.arr_volume_1,function(index,obj){
                     if(obj.id == elem.volume_id){
                     $scope.$root.$apply(function(){
                     $scope.formData.volume_1.push(obj); 
                     });
                     }
                     }); 
                     },2000);*/

                    $.each($scope.arr_disc_type, function (index, obj) {
                        if (obj.id == elem.discount_type) {
                            $scope.formData.supplier_type_1 = obj;
                        }
                    });

                    $scope.formData.discount_value_1 = elem.discount;
                    $scope.formData.discount_price_1 = elem.discounted_price;
                    $scope.formData.purchase_price_1 = elem.price;

                    $scope.formData.start_date1 = $filter('date')($scope.convertToDateObject($scope.$root.convert_numeric_date_to_string(elem.start_date)), $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);

                    $scope.formData.end_date1 = $filter('date')($scope.convertToDateObject($scope.$root.convert_numeric_date_to_string(elem.end_date)), $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
                    //$scope.discount_date = $scope.$root.convert_numeric_date_to_string(elem.date_added);
                    $scope.formData.volume_1_id = elem.id;
                    //$scope.setPrice();
                }
                else {
                    $scope.formData = {};
                }

            });


    }

    $scope.addNewPredefinedPopup = function (drpdown, type, title, rec) {

        var id = drpdown.id;
        if (id > 0)
            return false;

        $scope.popup_title = title;
        $scope.pedefined = {};

        ngDialog.openConfirm({
            template: 'app/views/crm/add_predefined.html',
            className: 'ngdialog-theme-default-custom-large',
            scope: $scope
        }).then(function (pedefined) {
            /*console.log(pedefined);
             return false;*/

            pedefined.token = $scope.$root.token;
            if (type == 'OFFER_METHOD')
                var postUrl = $scope.$root.setup + "crm/add-offer-method";
            if (type == 'REGION')
                var postUrl = $scope.$root.setup + "crm/add-region";
            if (type == 'SEGMENT')
                var postUrl = $scope.$root.setup + "crm/add-segment";
            if (type == 'BUYING_GROUP')
                var postUrl = $scope.$root.setup + "crm/add-buying-group";

            $http
                .post(postUrl, pedefined)
                .then(function (ress) {
                    if (ress.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        if (type == 'OFFER_METHOD')
                            var getUrl = $scope.$root.setup + "crm/offer-method-list";
                        if (type == 'REGION')
                            var getUrl = $scope.$root.setup + "crm/region-list";
                        if (type == 'SEGMENT')
                            var getUrl = $scope.$root.setup + "crm/segment-list";
                        if (type == 'BUYING_GROUP')
                            var getUrl = $scope.$root.setup + "crm/buying-group-list";

                        $http
                            .post(getUrl, {'token': $scope.$root.token, type: type})
                            .then(function (res) {
                                if (res.data.ack == true) {
                                    if (type == 'OFFER_METHOD') {
                                        $scope.arr_OfferMethod = res.data.response;
                                        $scope.arr_OfferMethod.push({'id': '-1', 'title': '++ Add New ++'});
                                        $.each($scope.arr_OfferMethod, function (index, elem) {
                                            if (elem.id == ress.data.id)
                                                $scope.rec.offer_method_ids = elem;
                                        });
                                    }
                                    if (type == 'REGION') {
                                        $scope.arr_regions = res.data.response;
                                        $scope.arr_regions.push({'id': '-1', 'title': '++ Add New ++'});
                                        $.each($scope.arr_regions, function (index, elem) {
                                            if (elem.id == ress.data.id)
                                                $scope.rec.region = elem;
                                        });
                                    }
                                    if (type == 'SEGMENT') {
                                        $scope.arr_segments = res.data.response;
                                        $scope.arr_segments.push({'id': '-1', 'title': '++ Add New ++'});
                                        $.each($scope.arr_segments, function (index, elem) {
                                            if (elem.id == ress.data.id)
                                                $scope.rec.segment = elem;
                                        });
                                    }
                                    if (type == 'BUYING_GROUP') {
                                        $scope.arr_buying_groups = res.data.response;
                                        $scope.arr_buying_groups.push({'id': '-1', 'title': '++ Add New ++'});
                                        $.each($scope.arr_buying_groups, function (index, elem) {
                                            if (elem.id == ress.data.id)
                                                $scope.rec.buying_group = elem;
                                        });
                                    }

                                }

                            });
                    }
                    else {

                        if (type == 'OFFER_METHOD')
                            $scope.rec.offer_method_ids = '';
                        if (type == 'REGION')
                            $scope.rec.region = '';
                        if (type == 'SEGMENT')
                            $scope.rec.segment = '';
                        if (type == 'BUYING_GROUP')
                            $scope.rec.buying_group = '';

                        toaster.pop('error', 'Info', ress.data.error)
                    }

                });

        }, function (reason) {
            if (type == 'OFFER_METHOD')
                $scope.rec.offer_method_ids = '';
            if (type == 'REGION')
                $scope.rec.region = '';
            if (type == 'SEGMENT')
                $scope.rec.segment = '';
            if (type == 'BUYING_GROUP')
                $scope.rec.buying_group = '';
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }


    $scope.addNewUnitPopup = function (drpdown, type, title) {

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
            /*console.log(pedefined);
             return false;*/

            pedefined.token = $scope.$root.token;
            pedefined.parent_id = pedefined.parent_ids != undefined ? pedefined.parent_ids.id : 0;
            if ($scope.rec.type == 1)
                var postUrl = $scope.$root.sales + "stock/unit-measure/add-unit";
            if ($scope.rec.type == 2)
                var postUrl = $scope.$root.setup + "service/unit-measure/add-unit";
            $http
                .post(postUrl, pedefined)
                .then(function (ress) {
                    if (ress.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        if ($scope.rec.type == 1)
                            var constUrl = $scope.$root.sales + "stock/unit-measure/get-all-unit";
                        if ($scope.rec.type == 2)
                            var constUrl = $scope.$root.setup + "service/unit-measure/get-all-unit";

                        $http
                            .post(constUrl, {'token': $scope.$root.token})
                            .then(function (res) {
                                if (res.data.ack == true) {
                                    $scope.arr_unit_of_measure = res.data.response;
                                    $scope.arr_unit_of_measure.push({'id': '-1', 'title': '++ Add New ++'});
                                    $timeout(function () {
                                        $.each($scope.arr_unit_of_measure, function (index, elem) {
                                            if (elem.id == ress.data.id) {
                                                if (type == 'Volume 1')
                                                    $scope.rec.unit_of_measure_1s = elem;
                                                if (type == 'Volume 2')
                                                    $scope.rec.unit_of_measure_2s = elem;
                                                if (type == 'Volume 3')
                                                    $scope.rec.unit_of_measure_3s = elem;

                                            }
                                        });
                                    }, 3000);

                                }

                            });
                    }

                });

        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.panelExpand = function () {
        if ($scope.isPanelExpand)
            $scope.isPanelExpand = false;
        else
            $scope.isPanelExpand = true;
    }


    /*$scope.show_price_one = function() 	{  
     var price=0;	var final_price=0;

     price =$scope.formData.purchase_price_1; 

     var f_id = this.formData.supplier_type_1.id;

     if(f_id ==1)
     { 
     final_price_one = (parseFloat($scope.formData.discount_value_1)) *(parseFloat(price))   /100 ;   

     final_price =  (parseFloat(price)) - (parseFloat(final_price_one)); 	

     } 
     else  if(f_id==2)
     {	
     final_price =  (parseFloat(price)) - (parseFloat($scope.formData.discount_value_1)); 
     } 

     //  console.log( final_price);
     //$scope.formData.discount_price_1 =final_price;
     $scope.formData.discount_price_1 = Math.round(final_price * 100) / 100;
     }*/

    $scope.show_price_second = function () {
        var price = 0;
        var final_price = 0;

        price = $scope.formData.purchase_price_2;
        var f_id = this.formData.supplier_type_2.id;


        if (f_id == 1) {
            final_price_one = (parseFloat($scope.formData.discount_value_2)) * (parseFloat(price)) / 100;

            final_price = (parseFloat(price)) - (parseFloat(final_price_one));
        }
        else if (f_id == 2) {
            final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value_2));
        }

        //  console.log( final_price);
        // $scope.formData.discount_price_2 =final_price;
        $scope.formData.discount_price_2 = Math.round(final_price * 100) / 100;
    }

    $scope.show_price_third = function () {
        var price = 0;
        var final_price = 0;

        price = $scope.formData.purchase_price_3;
        var f_id = this.formData.supplier_type_3.id;


        if (f_id == 1) {
            final_price_one = (parseFloat($scope.formData.discount_value_3)) * (parseFloat(price)) / 100;
            final_price = (parseFloat(price)) - (parseFloat(final_price_one));
        }
        else if (f_id == 2) {
            final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value_3));
        }

        // console.log( final_price);
        //$scope.formData.discount_price_3 =final_price;
        $scope.formData.discount_price_3 = Math.round(final_price * 100) / 100;
    }

    var volumeUrl_item = $scope.$root.sales + "stock/unit-measure/get-sale-offer-volume-by-type";
    var addvolumeUrl_item = $scope.$root.sales + "stock/unit-measure/add-sale-offer-volume";

    $scope.volume_type = 0;
    $scope.onChange_vol_1 = function (drpdown) {
        var id = 0;
        var volume = '';
        id = drpdown[0].id;
        if (id >= 0)
            return;

        $scope.formData_vol_1 = {};
        $scope.list_unit_category = [];
        $scope.list_unit_category.push($scope.rec.unit_of_measures);
        $scope.formData_vol_1.unit_category = $scope.list_unit_category[0];

        volume = 'Volume 1';
        category = 1;
        $scope.title_type = 'Add Volume';

        $scope.formData_vol_1.type = volume;
        $scope.formData_vol_1.category = category;

        $('.add_volume_disc').modal({show: true});

    }

    $scope.volCounter = 0;
    $scope.add_vol1_type = function (formData_vol_1) {

        formData_vol_1.token = $scope.$root.token;
        formData_vol_1.item_id = $scope.$stateParams.id;
        formData_vol_1.type = $scope.rec.cust_prod_type.id;
        if ($scope.rec.cust_prod_type.id == 1)
            formData_vol_1.crm_id = $scope.selectedCustomers[$scope.volCounter].id;
        if ($scope.rec.cust_prod_type.id == 2)
            formData_vol_1.crm_id = $scope.selectedLocations[$scope.volCounter].id;
        if ($scope.rec.cust_prod_type.id > 2)
            formData_vol_1.crm_id = $scope.selectedGroups[0].id;

        formData_vol_1.unit_categorys = $scope.formData_vol_1.unit_category !== undefined ? $scope.formData_vol_1.unit_category.id : 0;
        //  console.log(  formData_vol_1);return;
        // console.log(  $scope.rec.product_id);return;
        console.log($scope.arrIds);
        formData_vol_1.customer_item_info_id = $scope.arrIds[$scope.volCounter];

        $http
            .post(addvolumeUrl_item, formData_vol_1)
            .then(function (res) {
                if (res.data.ack == true) {

                    if ($scope.rec.cust_prod_type.id == 1) {
                        if ($scope.arrIds.length != ($scope.volCounter + 1)) {
                            $scope.volCounter++;
                            $scope.add_vol1_type(formData_vol_1);
                        }
                        else {
                            toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                            $('.add_volume_disc').modal('hide');
                            $scope.get_item_voume_list();
                        }
                    }
                    else if ($scope.rec.cust_prod_type.id == 2) {
                        if ($scope.arrIds.length != ($scope.volCounter + 1)) {
                            $scope.volCounter++;
                            $scope.add_vol1_type(formData_vol_1);
                        }
                        else {
                            toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                            $('.add_volume_disc').modal('hide');
                            $scope.get_item_voume_list();
                        }
                    }
                    else if ($scope.rec.cust_prod_type.id > 2) {
                        if ($scope.arrIds.length != ($scope.volCounter + 1)) {
                            $scope.volCounter++;
                            $scope.add_vol1_type(formData_vol_1);
                        }
                        else {
                            toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                            $('.add_volume_disc').modal('hide');
                            $scope.get_item_voume_list();
                        }
                    }
                    else {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        $('.add_volume_disc').modal('hide');
                        $scope.get_item_voume_list();
                    }

                }
                else  toaster.pop('error', 'info', 'Already Exists.');
            });
    }

    $scope.get_item_voume_list = function () {
        $scope.volCounter = 0;
        $http
            .post(volumeUrl_item, {customer_item_info_id: $scope.arrIds, 'token': $scope.$root.token})
            .then(function (vol_data) {
                $scope.arr_volume_1 = [];
                $scope.select_volume_1 = [];
                $scope.arr_volume_1.push({'id': '0', 'name': ''});
                $.each(vol_data.data.response, function (index, obj) {
                    $scope.arr_volume_1.push(obj);
                    $scope.select_volume_1.push(obj);
                });
                $scope.arr_volume_1.push({'id': '-1', 'name': '++ Add New ++'});
                $scope.formData.volume_1 = $scope.select_volume_1;
                /*$.each($scope.arr_volume_1,function(index,obj){
                 if(vol_id == obj.id)
                 $scope.formData.volume_1 = obj;
                 });*/

            });

    }

    $scope.list_unit_category = [];

    $scope.get_category_list = function () {
        var get_unit_setup_category = $scope.$root.sales + "stock/unit-measure/get-unit-setup-list-category";
        $scope.list_unit_category = [];
        $http
            .post(get_unit_setup_category, {'token': $scope.$root.token, 'item_id': $scope.formData.item_id})
            .then(function (vol_data) {
                //if($scope.rec.unit_of_measures.id == vol_data.data.response.id)
                $scope.list_unit_category = vol_data.data.response;

            });

    }

    $scope.addNewVolume = function () {
        if ($scope.rec.id > 0) {
            if ($scope.arrVolumeForms.length < 3) {
                if ($scope.arrVolumeForms.indexOf(1) == -1)
                    $scope.arrVolumeForms.push(1);
                if ($scope.arrVolumeForms.indexOf(2) == -1)
                    $scope.arrVolumeForms.push(2);
                if ($scope.arrVolumeForms.indexOf(3) == -1)
                    $scope.arrVolumeForms.push(3);
            }
        }
        else
            $scope.arrVolumeForms.push($scope.arrVolumeForms.length + 1);
    }

    $scope.addNewCurrencyPopup = function (rec) {
        var id = rec.currencys != undefined ? rec.currencys.id : 0;
        if (id > 0)
            return false;

        $scope.fnDatePicker();
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
                            .post(currencyUrl, {'company_id': $scope.$root.defaultCompany, 'token': $scope.$root.token})
                            .then(function (res1) {
                                if (res1.data.ack == true) {
                                    //$scope.$root.$apply(function(){
                                    $scope.arr_currency = res1.data.response;
                                    $scope.arr_currency.push({'id': '-1', 'name': '++ Add New ++'});
                                    $timeout(function () {
                                        $.each($scope.arr_currency, function (index, elem) {
                                            if (elem.id == res.data.id)
                                                rec.currencys = elem;
                                        });
                                    }, 3000);
                                    //});
                                }

                            });
                    }
                    else if (res.data.ack == false) {
                        toaster.pop('warning', 'Info', res.data.msg);
                    }
                    else
                        toaster.pop('warning', 'Info', res.data.msg);

                });

        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

}

/*myApp.filter('finalPrice', function($filter) {
 return function(detail,is_adjustsment) {
 if(is_adjustsment == null || is_adjustsment == 0)
 return '-';

 var final_disc_price = 0;
 if(detail.increase_decrease_id.id == 1){
 if(detail.disc_type.id == 1)
 final_disc_price = Number(detail.price_offered) + (Number(detail.price_offered)*Number(detail.adjustment)/100);
 else
 final_disc_price = Number(detail.price_offered) + Number(detail.adjustment); 
 }
 else{
 if(detail.disc_type.id == 1)
 final_disc_price = Number(detail.price_offered) - (Number(detail.price_offered)*Number(detail.adjustment)/100);
 else
 final_disc_price = Number(detail.price_offered) - Number(detail.adjustment); 
 }

 //console.log(final_disc_price);
 return final_disc_price; //$filter('number')(final_disc_price,fractionSize)+symbol;


 }
 });*/

