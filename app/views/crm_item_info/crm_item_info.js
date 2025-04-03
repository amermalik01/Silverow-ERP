CRMItemInfoController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$stateParams"];
CRMItemInfoAddController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$stateParams", "$rootScope"];

myApp.controller('CRMItemInfoController', CRMItemInfoController);
myApp.controller('CRMItemInfoAddController', CRMItemInfoAddController);


function CRMItemInfoController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams) {
    'use strict';
    $scope.frmStdItemData = {};
    $scope.module_id = 74;
    $scope.filter_id = 119;
    $scope.module_table = 'crm_price_offer';
    $scope.more_fields = 'is_listed*volume_1_price*volume_2_price*volume_3_price';
    $scope.condition = 0;
    $scope.sendRequest = false;

    if ($scope.$root.crm_id > 0)
        $scope.postData = {
            'column': 'product_id',
            'value': $stateParams.id,
            token: $scope.$root.token,
            'more_fields': $scope.more_fields
        }

    $scope.MainDefer = null;
    $scope.mainParams = null;
    $scope.mainFilter = null;

    $scope.count = 1;
    var vm = this;

    $scope.arr_cust_prod_type = [];
    var custPodTypeUrl = $scope.$root.setup + "general/all-customer-product-type";
    $http
        .post(custPodTypeUrl, {'token': $scope.$root.token})
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.arr_cust_prod_type = res.data.response;
            }
        });

    var ApiAjax = $scope.$root.sales + "crm/crm/customer-items-info";
    $scope.arrCRMIds = [];

    $scope.$on("myCRMItemInfoEventReload", function (event, args) {

        $scope.arrCRMIds.push(args.id);
        if (args.company_type != undefined)
            $scope.arrCRMIds.push(args.company_type);
        if (args.region_id != undefined)
            $scope.arrCRMIds.push(args.region_id);
        if (args.buying_grp != undefined)
            $scope.arrCRMIds.push(args.buying_grp);
        $scope.sendRequest = true;

        $scope.$root.price_type = args.price_type;
        $scope.crm_id = $stateParams.id;

        if (args != undefined) {
            $scope.postData = {
                'crm_ids': $scope.crm_id,
                /*'crm_ids': $scope.arrCRMIds,*/
                token: $scope.$root.token,
                price_type: $scope.$root.price_type,
                'more_fields': $scope.more_fields
            }
            $scope.$root.crm_id = args[0];
        }
        $scope.count = $scope.count + 1;

        ngDataService.getDataCustom($scope.MainDefer, $scope.mainParams, ApiAjax, $scope.mainFilter, $scope, $scope.postData);
        $scope.table.tableParams5.reload();

    });


    $scope.search_data = '';
    $scope.getPricing = function (parm) {
        if (parm != undefined) {
            $scope.postData = {
                'crm_ids': $scope.arrCRMIds,
                token: $scope.$root.token,
                'more_fields': $scope.more_fields
            }
            $scope.cust_types = '';
            $scope.search_data = '';
        }
        else {
            var type_id = $scope.cust_types != undefined ? $scope.cust_types.id : '';
            $scope.postData = {
                'crm_ids': $scope.arrCRMIds,
                'type_id': type_id,
                'search_data': $scope.search_data,
                token: $scope.$root.token,
                'more_fields': $scope.more_fields
            }
        }

        ngDataService.getDataCustom($scope.MainDefer, $scope.mainParams, ApiAjax, $scope.mainFilter, $scope, $scope.postData);
        $scope.table.tableParams5.reload();

    }


    $scope.$watch("MyCustomeFilters", function () {
        if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
            $scope.table.tableParams5.reload();
        }
    }, true);

    $scope.MyCustomeFilters = {}

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
            if ($scope.$root.crm_id > 0 && $scope.sendRequest == true)
                ngDataService.getDataCustom($defer, params, ApiAjax, $filter, $scope, $scope.postData);
            $scope.MainDefer = $defer;
            $scope.mainParams = params;
            $scope.mainFilter = $filter;
        }
    });

    $scope.detail = function (id) {
        $timeout(function () {
            if ($scope.$root.lblButton == 'Add New') {
                $scope.$root.lblButton = 'Edit';
            }
        }, 100);

        $scope.$root.tabHide = 0;
        $scope.$root.$broadcast("openCRMItemInfoFormEvent", {'edit': false, id: id});
    }

    $scope.editForm = function (id) {
        $scope.$root.$broadcast("openCRMItemInfoFormEvent", {'edit': true, id: id});
    }

    $scope.$data = {};
    $scope.delete = function (id, index, $data) {
        var delUrl = $scope.$root.sales + "customer/customer/delete-customer-item-info";
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


    $scope.getExcCustomers = function (id) {
        $scope.modal_title = "Excluded Customers";
        $scope.columns = [];
        $scope.arr_customers = [];
        var postData = {id: id, 'token': $scope.$root.token, 'all': "1"};
        var custUrl = $scope.$root.sales + "customer/customer/sale-excluded-customers";
        /*if(isShow == 'all'){
         $scope.cust_types = '';
         $scope.search_data = '';
         }
         else if(isShow == 2){
         var type_id = cust_types != undefined?cust_types.id:'';
         var postData = {'type_id':type_id,'search_data':search_data,token:$scope.$root.token}
         }*/

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
                    /*if($scope.selectedGroups.length > 0){
                     $.each($scope.selectedGroups,function(indx,obj2){
                     if(obj.id == obj2.id)
                     obj.chk = true;
                     });
                     }*/
                    $scope.arr_customers.push(obj);
                });
            });
        angular.element('#custInfoModal3').modal({show: true});
    }


    $scope.sale_price = 0;
    $scope.$on('setStandarItemPrice', function (event, prodData) {
        $scope.sale_price = prodData.standard_price;
    });

    $scope.temp_rec = {};
    $scope.getGroupOfCustomers = function (rec) {
        $scope.modal_title = "Customers";
        /*rec.detail.columns = [];
         rec.detail.customers = {};*/
        $scope.temp_rec = rec;
        $scope.columns = [];
        $scope.arr_customers = [];
        var postData = {
            type: rec.type,
            customer_item_info_id: rec.id,
            price_offered: rec.price_offered,
            sale_price: $scope.sale_price,
            'token': $scope.$root.token,
            'all': "1"
        };
        var custUrl = $scope.$root.sales + "customer/customer/get-group-of-customers";

        if (rec.type < 3)
            return;

        if (rec.type == 3) {
            postData.column = 'region_id';
            postData.value = rec.crm_id;
        }
        if (rec.type == 4) {
            postData.column = 'company_type';
            postData.value = rec.crm_id;
        }
        if (rec.type == 5) {
            postData.column = 'buying_grp';
            postData.value = rec.crm_id;
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
                    $scope.arr_customers = res.data.response;

                    /*$timeout(function(){
                     $scope.$root.$apply(function(){
                     rec.detail;
                     });*/
                    //angular.element("#tbl_detail_"+rec.id).toggle('slow');
                    /*},2000);*/

                }
                //angular.element("#tbl_detail_"+rec.id).toggle('slow');
                angular.element('#detialModal').modal({show: true});


            });
    }

    $scope.getProductsCustomers = function (rec) {

        console.log(rec);
        $scope.columns = [];
        $scope.arr_detail = {};
        var custUrl = $scope.$root.sales + "customer/customer/get-sale-products-customers";
        var priceStrategyUrl = $scope.$root.setup + "general/get-pricing-strategy";
        $http
            .post(priceStrategyUrl, {'token': $scope.$root.token})
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.priceStrategy = res.data.response;

                    var postData = {
                        customer_item_info_id: rec.id,
                        customer_product_type_id: rec.customer_product_type_id,
                        product_id: rec.product_id,
                        price_strategy_type: $scope.priceStrategy[1].id,
                        price_strategy: $scope.priceStrategy[2].id,
                        discount_type: $scope.lstPromotion.discount_type,
                        discount: $scope.lstPromotion.discount,
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

                    console.log($scope.priceStrategy[1].id);


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

            });
    }
    $scope.$root.load_date_picker('Customer_item_info');
}

function CRMItemInfoAddController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams, $rootScope) {
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
    $scope.arr_location = [];
    $scope.time_types = [];
    $scope.formData.volume_1_id = 0;
    $scope.formData.volume_2_id = 0;
    $scope.formData.volume_3_id = 0;
    $scope.customers = [];
    $scope.arr_currency = [];
    $scope.arr_cust_prod_type = [];
    $scope.selectedCustomers = [];
    $scope.cust_div_readonly = false;
    $scope.arrVolumeForms = [1];
    $scope.arr_customers = [];
    $scope.arr_regions = [];
    $scope.arr_segments = [];
    $scope.arr_buying_groups = [];
    $scope.isVolumeDiscForm = false;
    $scope.isVolumeDiscListing = false;
    $scope.$data = {};
    $scope.margin = {};
    $scope.isBtnSubmit = false;
    $scope.isBtnVolNew = true;
    $scope.$data = {};
    $scope.isFristTime = true;
    $scope.search_data = '';
    $scope.cust_types = 0;
    $scope.time_types = [{'label': 'Hours', 'value': 1}, {'label': 'Days', 'value': 2}, {
        'label': 'Weeks',
        'value': 3
    }, {'label': 'Months', 'value': 4}];
    $scope.arr_volume_1.push({'id': '-1', 'name': '++ Add New ++'});
    var constUrl = $scope.$root.setup + "ledger-group/get-predefine-by-type";

    $scope.showCRMItemInfoListing = function () {
        $scope.$root.$broadcast("showCRMItemInfoListing");
        /*var args = [];
         args[0] = $stateParams.id;
         args[1] = undefined;
         $scope.$root.$broadcast("myCRMItemInfoEventReload", args);*/
    }

    $scope.showCRMItemInfoEditForm = function () {
        $scope.check_readonly = false;
    }

    var currencyUrl = $scope.$root.setup + "general/currency-list";
    $http
        .post(currencyUrl, {'token': $scope.$root.token})
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.arr_currency = res.data.response;
                //$scope.arr_currency.push({'id':'-1','name':'++ Add New ++'});
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

    $scope.onChangeType = function (type) {
        $scope.selectedGroups = [];
        $scope.selectedCustomers = [];
        $scope.selectedLocations = [];
        if (type == 2) {
            if ($scope.arr_customers.length > 0)
                return;

            var custUrl = $scope.$root.sales + "customer/customer/popup-listing";
            $http
                .post(custUrl, {'token': $scope.$root.token})
                .then(function (res) {
                    $scope.arr_customers = res.data.record.result;
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


    angular.element(document).on('click', '.checkAll', function () {
        $scope.selectedLocations = [];
        if (angular.element('.checkAll').is(':checked') == true) {
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
        $scope.getlocation();


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

    $scope.getOfferMethods = function () {
        var offerMethodUrl = $scope.$root.setup + "crm/offer-method-list";
        $http
            .post(offerMethodUrl, {'token': $scope.$root.token})
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.arr_OfferMethod = res.data.response;

                }
                $scope.arr_OfferMethod.push({'id': '-1', 'title': '++ Add New ++'});
            });
    }

    $scope.crm_id = $stateParams.id;

    $scope.getlocation = function () {
        var getlocationUrl = $scope.$root.sales + "crm/crm/get-location-list";
        $http
            .post(getlocationUrl, {'token': $scope.$root.token,'crm_id': $scope.crm_id})
            .then(function (res) {
                if (res.data.ack == true) {
                    console.log(res.data);
                    $scope.arr_location = res.data.response;
                }
                // $scope.arr_location.push({'id': '-1', 'title': '++ Add New ++'});
            });
    }


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

   

   
   
   
    $scope.$on("openCRMItemInfoFormEvent", function (event, arg) {
        $scope.arrIds = [];
        $scope.getOfferMethods();
        $scope.getlocation();
        $scope.resetForm();
        $scope.selectedCustomers = [];
        $scope.selectedGroups = [];
        $scope.selectedLocations = [];
        $scope.cust_div_readonly = true;
        $scope.isVolumeDiscListing = true;
        $timeout(function () {

            var id = arg.id;
            if (arg.edit == false)
                $scope.check_readonly = true;
            else
                $scope.check_readonly = false;
            $scope.$root.$broadcast("showCRMItemInfoForm");

            //

            var pOfferUrl = $scope.$root.sales + "crm/crm/get-customer-item-info";
            $scope.rec = {};

            $http
                .post(pOfferUrl, {id: id, price_type: $scope.$root.price_type,'token': $scope.$root.token})
                .then(function (res) {
                    $scope.rec = res.data.response;
                    //console.log(res);

                    $scope.rec.crm_id = arg.id;

                    $scope.onChangeType(res.data.response.customer_product_type_id);
                    $scope.loadDropDownsData(res.data.response.product_id, res.data.response.type);

                    $scope.rec.offer_date = res.data.response.start_date;
                    $scope.rec.offer_valid_date = res.data.response.end_date;
                    /*$scope.rec.offer_date = $rootScope.convert_numeric_date_to_string(res.data.response.start_date);
                     $scope.rec.offer_valid_date = $rootScope.convert_numeric_date_to_string(res.data.response.end_date);*/


                    $scope.rec.id = res.data.response.id;
                    $scope.arrIds.push(res.data.response.id);
                    var empUrl = $scope.$root.hr + "employee/get-employee";
                    $http
                        .post(empUrl, {id: res.data.response.offered_by_id, 'token': $scope.$root.token})
                        .then(function (emp_data) {

                            /*console.log(emp_data.data.response.first_name);
                            console.log(emp_data.data.response.last_name);*/

                            if (emp_data.data.response.first_name != undefined) {
                                $scope.rec.offered_by = emp_data.data.response.first_name + ' ' + emp_data.data.response.last_name;
                            }

                        });


                    $timeout(function () {
                        $scope.$root.$apply(function () {
                            $.each($scope.arr_OfferMethod, function (index, elem) {
                                if (elem.id == res.data.response.offer_method_id) {
                                    $scope.rec.offer_method_ids = elem;
                                }
                            });

                            $.each($scope.arr_location, function (index, elem) {
                                if (elem.id == res.data.response.crm_alt_location_id) {
                                    $scope.rec.location_ids = elem;
                                }
                            });

                            $.each($scope.arr_currency, function (index, elem) {
                                if (elem.id == res.data.response.currency_id) {
                                    $scope.rec.currencys = elem;
                                }
                            });
                            $.each($scope.arr_cust_prod_type, function (index, elem) {
                                if (elem.id == res.data.response.customer_product_type_id) {
                                    $scope.rec.cust_prod_type = elem;
                                }
                            });
                            $.each($scope.arr_unit_of_measure, function (index, elem) {
                                if (elem.id == res.data.response.unit_of_measure_id) {
                                    $scope.rec.unit_of_measures = elem;
                                }
                            });


                            $scope.formData.purchase_price_1 = res.data.response.price_offered;
                            /*$scope.formData.purchase_price_2 = res.data.response.price_offered;
                             $scope.formData.purchase_price_3 = res.data.response.price_offered;*/


                        });
                    }, 2000);


                    // volume discount form
                    $scope.selectedCustomers = [];
                    var getCrmUrl = $scope.$root.sales + "customer/customer/get-customer";
                    $http
                        .post(getCrmUrl, {id: res.data.response.crm_id, 'token': $scope.$root.token})
                        .then(function (cutsRes) {
                            cutsRes.data.response.Name = cutsRes.data.response.name;
                            $scope.selectedCustomers.push(cutsRes.data.response);
                        });

                    $scope.formData.purchase_price_1 = $scope.rec.price_offered;
                    $scope.formData.price_list_id = id;
                    $scope.formData.item_id = $scope.rec.product_id;
                    $scope.item_code = $scope.rec.product_code;
                    $scope.item_description = $scope.rec.product_name;
                    /*$scope.loadDropDownsData2($stateParams.id,res.data.response.crm_id,res.data.response.customer_product_type_id);*/
                    //$scope.supplier_pop(id);
                    $scope.getVolumeDiscouts();
                    $scope.get_item_voume_list();
                    $scope.arr_volume_1 = [];
                    $scope.arr_volume_1.push({'id': '-1', 'name': '++ Add New ++'});

                    var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
                    $http
                        .post(currencyURL, {'id': res.data.response.currency_id, token: $scope.$root.token})
                        .then(function (resCurr) {
                            if (resCurr.data.ack == true) {
                                if (resCurr.data.response.conversion_rate == null) {
                                    toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                                    $scope.rec.price_offered = null;
                                    $scope.rec.converted_price = null;
                                    return;
                                }
                                var newPrice = Number(res.data.response.price_offered) / Number(resCurr.data.response.conversion_rate);
                                if (res.data.response.currency_id != $scope.$root.defaultCurrency)
                                    $scope.rec.converted_price = Number(newPrice).toFixed(2);
                                else
                                    $scope.rec.converted_price = Number(res.data.response.price_offered).toFixed(2);
                            }
                        });

                });
        }, 100);

    });


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
       // console.log("here unit of measure");
        $scope.arr_unit_of_measure = [];
        var unitUrl = $scope.$root.sales + "stock/unit-measure/get-unit-setup-list-category";
        $http
            .post(unitUrl, {item_id: item_id, 'token': $scope.$root.token})
            .then(function (unit_data) {
                //$scope.arr_unit_of_measure.push({'id':'0','name':''});
                $.each(unit_data.data.response, function (index, obj) {
                    $scope.arr_unit_of_measure.push(obj);
                });
                //$scope.arr_unit_of_measure.push({'id':'-1','title':'++ Add New ++'});
            });
    }

    $scope.items = {};

    $scope.getCustomers = function (isShow, cust_types, search_data) {

        $scope.columns = [];
        $scope.customers = [];
        //$scope.selectedCustomers = [];
        $scope.title = 'Customers';
        var postData = {'token': $scope.$root.token, 'all': "1"};
        var custUrl = $scope.$root.sales + "customer/customer/get-customers-for-popup";


        /*console.log(cust_types);
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
                    if ($scope.rec.id == undefined) {
                        if ($scope.selectedCustomers.length > 0) {
                            $.each($scope.selectedCustomers, function (indx, obj2) {
                                if (obj.id == obj2.id)
                                    obj.chk = true;
                            });
                        }
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
                    $timeout(function () {
                        $scope.selectedCustomers;
                    }, 3000);
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

    /*================      customer item info form  start   ==================*/


    /*    $scope.$on("showPOfferForm", function () {
     $scope.pOfferFormShow = true;
     $scope.pOfferListingShow = false;
     });
     $scope.showPOfferForm = function () {
     $scope.pOfferFormShow = true;
     $scope.pOfferListingShow = false;
     $scope.$root.$broadcast("showAddPOfferForm");
     }*/

    /*$scope.$on("showCustomerItemInfoForm", function () {

     console.log("here2");
     $scope.CRMItemInfoFormShow = true;
     $scope.CRMItemInfoListingShow = false;
     });
     $scope.showCustomerItemInfoForm = function () {

     console.log("here");
     $scope.CRMItemInfoFormShow = true;
     $scope.CRMItemInfoListingShow = false;
     //$scope.$root.$broadcast("showAddCustomerItemInfoForm");
     }*/
    /*================      customer item info form  end   ==================*/

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
    angular.element('#groupInfoModal').modal({show: true});
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
        $scope.isBtnSubmit = false;
        $scope.isBtnVolNew = true;
        $scope.$data = {};
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

        /*if($rootScope.defaultDateFormat == $rootScope.dtYMD)
         $scope.offered_date= year + "/" + month + "/" + day;
         if($rootScope.defaultDateFormat == $rootScope.dtMDY)
         $scope.offered_date= month + "/" + day + "/" + year;
         if($rootScope.defaultDateFormat == $rootScope.dtDMY)
         $scope.offered_date= day + "/" + month + "/" + year;*/

        //$scope.discount_date = $filter('date')(d, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
        $scope.current_date = d;
        $scope.rec.offer_date = $filter('date')(d, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);

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

        $scope.getSaleInvoiceDate();
        $scope.arr_volume_1 = [];
        $scope.arr_volume_1.push({'id': '-1', 'name': '++ Add New ++'});

    }


    $scope.isAdded = false;
    $scope.counter = 0;
    $scope.arrIds = [];
    $scope.rec = {};
    $scope.add = function (rec) {

        var addUrl = $scope.$root.sales + "crm/crm/add-customer-item-info";

        rec.offer_method_id = rec.offer_method_ids != undefined ? rec.offer_method_ids.id : 0;
        rec.location_id = rec.location_ids != undefined ? rec.location_ids.id : 0;
        rec.unit_of_measure = rec.unit_of_measures != undefined ? rec.unit_of_measures.id : 0;
        rec.currency_id = rec.currencys != undefined ? rec.currencys.id : 0;
        rec.price_type = $scope.$root.price_type;

        if (Number(rec.min_order_qty) > Number(rec.max_order_qty)) {
            toaster.pop('error', 'Info', 'Minimum Qty must be less than Maximum Qty.');
            return;
        }

        rec.crm_id = $stateParams.id;
        rec.token = $scope.$root.token;


        if ($scope.formData.volume_1 != undefined)
            rec.is_sales_vol_disc = 1;

        if (rec.id != undefined || $scope.isAdded == true) {
            addUrl = $scope.$root.sales + "crm/crm/update-customer-item-info";
            if ($scope.isAdded)
                rec.id = $scope.arrIds[$scope.counter];
        }


        var newObj = {};
        angular.extend(newObj,rec);
       // console.log(newObj);

        $http
            .post(addUrl, newObj)
            .then(function (res) {

                var args = [];
                args[0] = $stateParams.id;
                args[1] = undefined;
                var id = 0;
                if (rec.id > 0) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $scope.formData.price_list_id = rec.id;
                    id = rec.id;

                    $scope.$root.$broadcast("showCRMItemInfoListing");

                }
                else {

                    id = res.data.id;
                    $scope.arrIds.push(id);
                    $scope.formData.price_list_id = res.data.id;

                    /*================      customer item info Add form changes start   ==================*/

                    toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                    //$scope.$root.$broadcast("myCRMItemInfoEventReload", args);
                    $scope.$root.$broadcast("showCRMItemInfoListing");
                    isAdded = true;
                    $scope.counter = 0;
                    $scope.getVolumeDiscouts();

                    /*================      customer item info Add form changes end   ==================*/
                }


                //$scope.$root.$broadcast("showCustItemInfoListing");
            });

    }


    $scope.add_excluded_customers = function (id, grp_id) {
        var excUrl = $scope.$root.sales + "customer/customer/add-excluded-customers";
        var rec = {};
        rec.product_id = $stateParams.id;
        rec.customers = $scope.selectedCustomers;
        if ($scope.rec.cust_prod_type.id == 3)
            rec.region_id = grp_id;
        if ($scope.rec.cust_prod_type.id == 4)
            rec.segment_id = grp_id;
        if ($scope.rec.cust_prod_type.id == 5)
            rec.buying_group_id = grp_id;
        rec.customer_item_info_id = id;
        rec.token = $scope.$root.token;
        $http
            .post(excUrl, rec)
            .then(function (res) {
            });
    }

    $scope.count = 0;
    $scope.addVolumeDiscount = function (formData) {
        if (formData.volume_1.id == undefined || formData.volume_1.id == 0 || formData.volume_1.id < 0) {
            toaster.pop('error', 'Info', 'Please select volume.');
            return false;
        }
        var updateUrl = $scope.$root.sales + "crm/crm/add-product-values";
        /*if ($scope.rec.cust_prod_type.id == 1)
            formData.crm_id = $scope.selectedCustomers[$scope.count].id;
        if ($scope.rec.cust_prod_type.id == 2)
            formData.crm_id = $scope.selectedLocations[$scope.count].id;
        if ($scope.rec.cust_prod_type.id > 2)
            formData.crm_id = $scope.selectedGroups[$scope.count].id;*/

        //console.log(formData);

        formData.customer_product_type_id = 1;
        // formData.customer_product_type_id = $scope.rec.cust_prod_type.id;
        formData.crm_id = $stateParams.id;

        formData.token = $scope.$root.token;

        if ($scope.rec.id > 0 || $scope.formData.id > 0) {
            formData.volume_1s = formData.volume_1.id;
            formData.quantity_from = formData.volume_1.quantity_from;
            formData.quantity_to = formData.volume_1.quantity_to;
            formData.customer_item_info_id = formData.volume_1.customer_item_info_id;
        }
        else {
            formData.volume_1s = formData.volume_1[$scope.count].id;
            formData.quantity_from = formData.volume_1[$scope.count].quantity_from;
            formData.quantity_to = formData.volume_1[$scope.count].quantity_to;
            formData.customer_item_info_id = formData.volume_1[$scope.count].customer_item_info_id;
        }

        formData.supplier_type_1s = formData.supplier_type_1 !== undefined ? formData.supplier_type_1.id : 0;
        formData.item_id = $stateParams.id;
        if (formData.id > 0)
            var updateUrl = $scope.$root.sales + "crm/crm/update-product-values";

        $http
            .post(updateUrl, formData)
            .then(function (res) {
                if (res.data.ack == 1) {

                    if ($scope.rec.id > 0 || $scope.formData.id > 0) {
                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                        formData.volume_1 = null;
                        $scope.getVolumeDiscouts();
                        $scope.count = 0;
                    }
                    else {
                        if (formData.volume_1.length != ($scope.count + 1)) {
                            $scope.count++;
                            $scope.addVolumeDiscount(formData);
                        }
                        else {
                            toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                            formData.volume_1 = null;
                            $scope.isBtnVolNew = false;
                            $scope.getVolumeDiscouts();
                            $scope.count = 0;
                        }

                    }
                    $scope.isFristTime = false;
                }
                if (res.data.ack == 0 && res.data.edit == 1) {
                    toaster.pop('error', 'Info', 'Record  updated with no changes.');
                }
                if (res.data.ack == 2) {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(107));
                }

            });
    }


    $scope.editVolDisc = function (id) {

        $scope.isVolumeDiscListing = false;
        $scope.isVolumeDiscForm = true;
        //$scope.list_type= [{'name':'Percentage','id':1},{'name':'Value','id':2}];

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

                    $scope.formData = res.data.response;
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

                    $.each($scope.list_type, function (index, obj) {
                        if (obj.id == $scope.formData.discount_type) {
                            $scope.formData.supplier_type_1 = obj;
                        }
                    });

                    $scope.formData.discount_value_1 = $scope.formData.discount;
                    $scope.formData.discount_price_1 = $scope.formData.discounted_price;
                    $scope.formData.purchase_price_1 = $scope.formData.price;

                    $scope.formData.start_date1 = $scope.formData.start_date;

                    $scope.formData.end_date1 = $scope.formData.end_date;

                    /*$scope.formData.start_date1 = $filter('date')($scope.convertToDateObject($scope.$root.convert_numeric_date_to_string($scope.formData.start_date)), $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);

                    $scope.formData.end_date1 = $filter('date')($scope.convertToDateObject($scope.$root.convert_numeric_date_to_string($scope.formData.end_date)), $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
                    *///$scope.discount_date = $scope.$root.convert_numeric_date_to_string(elem.date_added);
                    $scope.formData.volume_1_id = $scope.formData.id;
                    $timeout(function () {
                        $scope.get_item_voume_list($scope.formData.volume_id);
                    }, 2000);
                    //$scope.setPrice();
                }
                else {
                    $scope.formData = {};
                }

            });


    }

    $scope.addNewPredefinedPopup = function (drpdown, type, title, rec) {
        $scope.isBtnPredefined = false;
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
                                    if (type == 'Location') {
                                        $scope.arr_location = res.data.response;
                                        //$scope.arr_location.push({'id': '-1', 'title': '++ Add New ++'});
                                        $.each($scope.arr_location, function (index, elem) {
                                            if (elem.id == ress.data.id)
                                                $scope.rec.location_ids = elem;
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


    $scope.show_price_one = function () {
        var price = 0;
        var final_price = 0;

        price = $scope.formData.purchase_price_1;

        var f_id = this.formData.supplier_type_1.id;

        if (f_id == 1) {
            final_price_one = (parseFloat($scope.formData.discount_value_1)) * (parseFloat(price)) / 100;

            final_price = (parseFloat(price)) - (parseFloat(final_price_one));

        }
        else if (f_id == 2) {
            final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value_1));
        }

        //  console.log( final_price);
        //$scope.formData.discount_price_1 =final_price;
        $scope.formData.discount_price_1 = Math.round(final_price * 100) / 100;
    }

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
        if (drpdown[0] != undefined)
            id = drpdown[0].id;
        else
            id = drpdown.id;
        if (id >= 0)
            return;

        $scope.formData.volume_1 = '';
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

        if (formData_vol_1.quantity_from == undefined && formData_vol_1.quantity_from == null) {
            toaster.pop('error', 'Info', 'Please enter quantity from.');
            //$scope.formData_vol_1.quantity_from = null;
            return false;
        }
        if (formData_vol_1.quantity_to == undefined && formData_vol_1.quantity_to == null) {
            toaster.pop('error', 'Info', 'Please enter quantity to.');
            //$scope.formData_vol_1.quantity_to = null;
            return false;
        }

        if (Number(formData_vol_1.quantity_from) > Number(formData_vol_1.quantity_to)) {
            toaster.pop('error', 'Info', 'Quantity From must be less than Quantity To.');
            //$scope.formData_vol_1.quantity_to = null;
            return false;
        }

        if (Number($scope.formData_vol_1.quantity_from) < Number($scope.rec.min_order_qty)) {
            toaster.pop('error', 'Info', 'From Quantity must be greater than or equal to ' + $scope.rec.min_order_qty);
            //$scope.formData_vol_1.quantity_from = null;
            return false;
        }
        if (Number($scope.formData_vol_1.quantity_to) > Number($scope.rec.max_order_qty)) {
            toaster.pop('error', 'Info', 'To Quantity must be less than or equal to ' + $scope.rec.max_order_qty);
            //$scope.formData_vol_1.quantity_to = null;
            return false;
        }


        formData_vol_1.token = $scope.$root.token;
        formData_vol_1.item_id = $scope.$stateParams.id;
        formData_vol_1.type = $scope.rec.cust_prod_type.id;
        if ($scope.rec.id > 0 || $scope.formData.id > 0) {
            console.log($scope.rec);
            formData_vol_1.crm_id = $scope.rec.crm_id;
            formData_vol_1.customer_item_info_id = $scope.rec.id;
            formData_vol_1.unit_categorys = $scope.formData_vol_1.unit_category !== undefined ? $scope.formData_vol_1.unit_category.id : 0;
        }
        else {
            if ($scope.rec.cust_prod_type.id == 1)
                formData_vol_1.crm_id = $scope.selectedCustomers[$scope.volCounter].id;
            if ($scope.rec.cust_prod_type.id == 2)
                formData_vol_1.crm_id = $scope.selectedLocations[$scope.volCounter].id;
            if ($scope.rec.cust_prod_type.id > 2)
                formData_vol_1.crm_id = $scope.selectedGroups[$scope.volCounter].id;
            formData_vol_1.customer_item_info_id = $scope.arrIds[$scope.volCounter];
            formData_vol_1.unit_categorys = $scope.formData_vol_1.unit_category !== undefined ? $scope.formData_vol_1.unit_category.id : 0;
        }


        $http
            .post(addvolumeUrl_item, formData_vol_1)
            .then(function (res) {
                if (res.data.ack == true) {

                    if ($scope.rec.id > 0 || $scope.formData.id > 0) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        $('.add_volume_disc').modal('hide');
                        $scope.get_item_voume_list(res.data.id);
                        return;
                    }

                    if ($scope.rec.cust_prod_type.id == 1) {
                        if ($scope.arrIds.length != ($scope.volCounter + 1)) {
                            $scope.volCounter++;
                            $scope.add_vol1_type(formData_vol_1);
                        }
                        else {
                            toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                            $('.add_volume_disc').modal('hide');
                            $scope.get_item_voume_list(res.data.id);
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
                            $scope.get_item_voume_list(res.data.id);
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
                            $scope.get_item_voume_list(res.data.id);
                        }
                    }
                    else {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        $('.add_volume_disc').modal('hide');
                        $scope.get_item_voume_list(res.data.id);
                    }

                }
                else  toaster.pop('error', 'info', 'Already Exists.');
            });
    }

    $scope.get_item_voume_list = function (id) {
        var arIds = [];
        /*console.log($scope.formData.id);
        
         console.log($scope.formData.customer_item_info_id);*/
        if ($scope.formData.id != undefined && $scope.formData.id > 0)
            arIds.push($scope.formData.customer_item_info_id);
        else
            arIds = $scope.arrIds;
        var isAdded = false;
        if ($scope.isAdded && !$scope.formData.id)
            isAdded = true;

        $scope.volCounter = 0;
        $http
            .post(volumeUrl_item, {isAdded: isAdded, customer_item_info_id: arIds, 'token': $scope.$root.token})
            .then(function (vol_data) {
                $scope.arr_volume_1 = [];
                $scope.select_volume_1 = [];
                $scope.arr_volume_1.push({'id': '0', 'name': ''});
                if ($scope.rec.id > 0 || $scope.formData.id > 0) {
                    $.each(vol_data.data.response, function (index, obj) {
                        $scope.arr_volume_1.push(obj);
                    });
                    $.each($scope.arr_volume_1, function (index, obj) {
                        if (id == obj.id)
                            $scope.formData.volume_1 = obj;
                    });
                }
                else {
                    $.each(vol_data.data.response, function (index, obj) {
                        $scope.arr_volume_1.push(obj);
                        $scope.select_volume_1.push(obj);
                    });
                    $scope.formData.volume_1 = $scope.select_volume_1;
                }
                $scope.arr_volume_1.push({'id': '-1', 'name': '++ Add New ++'});
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


// Volume Discount Listing
//---------------------------------------------------------------
    var ApiAjax = $scope.$root.sales + "crm/crm/supplier_by_id";

    $scope.getVolumeDiscouts = function () {

        $data = {};
        $scope.isVolumeDiscForm = false;
        $scope.isVolumeDiscListing = true;
        $scope.formData = {};

        $scope.postData = {id: $scope.arrIds, token: $scope.$root.token}
        ngDataService.getDataCustom($scope.MainDefer, $scope.mainParams, ApiAjax, $scope.mainFilter, $scope, $scope.postData);
        $scope.tableParams5.reload();

    };


    $scope.$watch("MyCustomeFilters", function () {
        if ($scope.MyCustomeFilters && $scope.tableParams5) {
            $scope.tableParams5.reload();
        }
    }, true);

    $scope.MyCustomeFilters = {}

    $scope.tableParams5 = new ngParams({
        page: 1,            // show first page
        count: $scope.$root.pagination_limit,           // count per page
        sorting: {Volume: 'Desc'},
        filter: {
            name: '',
            age: ''
        }
    }, {
        total: 0,           // length of data
        counts: [],         // hide page counts control

        getData: function ($defer, params) {
            if ($scope.$root.crm_id > 0 && $scope.sendRequest == true)
                ngDataService.getDataCustom($defer, params, ApiAjax, $filter, $scope, $scope.postData);
            $scope.MainDefer = $defer;
            $scope.mainParams = params;
            $scope.mainFilter = $filter;
        }
    });

    $scope.detail = function (id) {
        $timeout(function () {
            if ($scope.$root.lblButton == 'Add New') {
                $scope.$root.lblButton = 'Edit';
            }
        }, 100);

        $scope.$root.tabHide = 0;
        $scope.$root.$broadcast("openCRMItemInfoFormEvent", {'edit': false, id: id});
    }

    $scope.editForm = function (id) {
        $scope.$root.$broadcast("openCRMItemInfoFormEvent", {'edit': true, id: id});
    }

    /*================      customer item info Add form  start   ==================*/
    $scope.addForm = function (rec) {
        $scope.$root.$broadcast("openCRMItemInfoFormEvent", {'edit': true});
    }

    var prodApi_setup = $scope.$root.stock + "products-listing/get-products-popup";


    $scope.getproducts = function (arg) {
        $scope.columns = [];
        $scope.record = {};
        $scope.title = 'Products';
        // var empUrl = $scope.$root.hr + "employee/listings";
        postData = {
            'token': $scope.$root.token,
            'product_id': 0,//$scope.product_id,
            'type': 2//$scope.product_id
            /*'all': "1",*/
        };
        $http
            .post(prodApi_setup, postData)
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
            /*$scope.rec.offered_by = result.first_name + ' ' + result.last_name;
             $scope.rec.offered_by_id = result.id;*/
            //console.log(result);
            $scope.rec.Item_Code = result.product_code;
            $scope.rec.Item_Description = result.description;
            $scope.rec.product_id = result.id;
            var restype=1;
            $scope.loadDropDownsData(result.id, restype);
            //$scope.loadDropDownsData(res.data.response.product_id, res.data.response.type);


        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    /*================      customer item info Add form  end   ==================*/


    $scope.delete = function (id, index, $data) {
        var delUrl = $scope.$root.sales + "crm/crm/delete_sp_id";
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

    $scope.showVolumeDiscForm = function () {
        if ($scope.isAdded) {
            $scope.arr_volume_1 = [];
            $scope.arr_volume_1.push({'id': '-1', 'name': '++ Add New ++'});
        }
        $scope.isVolumeDiscForm = true;
        $scope.isVolumeDiscListing = false;
        $scope.formData = {};
        $scope.formData.purchase_price_1 = $scope.rec.price_offered;
    }

    $scope.showVolumeDiscListing = function () {
        $scope.isVolumeDiscForm = false;
        $scope.isVolumeDiscListing = true;
        $scope.formData = {};
    }

    $scope.checkValues = function (formData_vol_1, field) {
        console.log('from==>>' + formData_vol_1.quantity_from);
        console.log('to==>>' + formData_vol_1.quantity_to);
        console.log(Number(formData_vol_1.quantity_from) < Number(formData_vol_1.quantity_to));

        if ((formData_vol_1.quantity_from != undefined && formData_vol_1.quantity_to != undefined) && (formData_vol_1.quantity_from != null && formData_vol_1.quantity_to != null) && (Number(formData_vol_1.quantity_from) < Number(formData_vol_1.quantity_to))) {
            console.log('==>>true');
            console.log('field==>>' + field);
            console.log('checkVolQty==>>' + $scope.checkVolQty(field));
            //$timeout(function(){
            if ($scope.checkVolQty(field))
                $scope.isBtnSubmit = true;
            else
                $scope.isBtnSubmit = false;
            //},100);
        }
        else
            $scope.isBtnSubmit = false;
    }

//------- Standar Item Price ---------------
//------------------------------------------
    $scope.frmStdItemData = {};
    $scope.minOrderQty = 0;
    $scope.maxOrderQty = 0;
    $scope.$on('setStandarItemPrice', function (event, prodData) {
        $scope.minOrderQty = prodData.min_quantity;
        $scope.maxOrderQty = prodData.max_quantity;
        $scope.prod_currency = prodData.unit_id.title;
        var itemURL = $scope.$root.stock + "products-listing/get-product-by-id";
        $http
            .post(itemURL, {'token': $scope.$root.token, 'product_id': $stateParams.id})
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.frmStdItemData = res.data.response;
                    $scope.getSaleMargin();
                }
            });
        var get_avg = $scope.$root.sales + "stock/products-listing/get-item-avg";
        $http
            .post(get_avg, {'token': $scope.$root.token, 'product_id': $stateParams.id})
            .then(function (res) {
                if (res.data.ack == true) {
                    $timeout(function () {
                        $scope.$root.$apply(function () {
                            $scope.frmStdItemData.average_sale_price = res.data.avg;
                        });
                    }, 3000);
                }
            });

    });

    $scope.getSaleInvoiceDate = function () {
        var getSaleDate = $scope.$root.sales + "stock/products-listing/get-last-invoice-date";
        $http
            .post(getSaleDate, {'token': $scope.$root.token, 'product_id': $stateParams.id})
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.rec.last_so_date = $scope.convert_numeric_date_to_string(res.data.order_date);
                }
            });
    }

    $scope.getSaleMargin = function () {
        var marginURL = $scope.$root.sales + "stock/products-listing/get-sale-margin";
        $scope.margin.token = $scope.$root.token;
        $scope.margin.product_id = $stateParams.id;
        $scope.margin.margin_start_date = $scope.frmStdItemData.margin_start_date;
        $scope.margin.margin_end_date = $scope.frmStdItemData.margin_end_date;
        $scope.margin.standard_price = $scope.frmStdItemData.standard_price;
        $http
            .post(marginURL, $scope.margin)
            .then(function (res) {
                $timeout(function () {
                    $scope.$root.$apply(function () {
                        $scope.frmStdItemData.overall_margin = res.data.overall_margin;
                        $scope.frmStdItemData.start_date = $scope.convert_numeric_date_to_string(res.data.margin_start_date);
                        $scope.frmStdItemData.end_date = $scope.convert_numeric_date_to_string(res.data.margin_end_date);
                    });
                }, 3000);
            });
    }

    $scope.setMarginDate = function () {
        var itemURL = $scope.$root.stock + "products-listing/get-product-by-id";
        $http
            .post(itemURL, {'token': $scope.$root.token, 'product_id': $stateParams.id})
            .then(function (res) {
                if (res.data.ack == true) {
                    if (res.data.response.margin_start_date > 0 && res.data.response.margin_end_date > 0) {
                        $scope.margin.margin_start_date = $scope.convert_numeric_date_to_string(res.data.response.margin_start_date);
                        $scope.margin.margin_end_date = $scope.convert_numeric_date_to_string(res.data.response.margin_end_date);
                        $scope.checkMargin($scope.margin);
                    }
                    else {
                        $scope.margin.margin_start_date = $filter('date')(new Date(), $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
                        $scope.margin.margin_end_date = null;
                    }
                }
            });
        angular.element('#marginDateModal').modal({show: true});
    }

    $scope.addMarginDate = function (margin) {
        var itemURL = $scope.$root.sales + "stock/products-listing/update-product";
        margin.token = $scope.$root.token;
        margin.product_id = $stateParams.id;
        $http
            .post(itemURL, margin)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.frmStdItemData.margin_start_date = margin.margin_start_date;
                    $scope.frmStdItemData.margin_end_date = margin.margin_end_date;
                    toaster.pop('success', 'Info', 'Record has been saved.');
                    $scope.getSaleMargin();
                    angular.element('#marginDateModal').modal('hide');
                }
            });
    }

    $scope.isBtnMargin = false;
    $scope.checkMargin = function (margin) {
        if (margin.margin_start_date == null || margin.margin_end_date == null)
            $scope.isBtnMargin = false;
        else
            $scope.isBtnMargin = true;
    }

    $scope.updateStandarItemPrice = function (frmStdItemData) {
        var itemURL = $scope.$root.sales + "stock/products-listing/update-product";
        frmStdItemData.token = $scope.$root.token;
        frmStdItemData.product_id = $stateParams.id;
        $http
            .post(itemURL, frmStdItemData)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
                }
                else {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
                }
            });
    }

    $scope.checkQty = function (field) {
        if (field == 'min' && Number($scope.rec.min_order_qty) > Number($scope.rec.max_order_qty)) {
            toaster.pop('error', 'Info', 'Minimum Qty must be less than Maximum Qty.');
            $scope.rec.min_order_qty = null;
            return;
        }
        if (field == 'max' && Number($scope.rec.max_order_qty) < Number($scope.min_order_qty)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(347));
            $scope.rec.max_order_qty = null;
            return;
        }
    }

    $scope.checkVolQty = function (field) {
        if (field == 'min' && Number($scope.formData_vol_1.quantity_from) < Number($scope.rec.min_order_qty)) {
            toaster.pop('error', 'Info', 'Qty must be greater than or equal to ' + $scope.rec.min_order_qty);
            $scope.formData_vol_1.quantity_from = null;
            //$scope.checkValues($scope.formData_vol_1);
            return false;
        }

        if (field == 'max' && Number($scope.formData_vol_1.quantity_to) > Number($scope.rec.max_order_qty)) {
            toaster.pop('error', 'Info', 'Qty must be less than or equal to ' + $scope.rec.max_order_qty);
            $scope.formData_vol_1.quantity_to = null;
            //$scope.checkValues($scope.formData_vol_1);
            return false;
        }


    }

    $scope.onCurrencyChange = function () {
        $scope.validatePrice($scope.rec.price_offered);
    }

    $scope.chkPrice = function (price) {
        if ($scope.rec.price_offered == undefined)
            return;
        $scope.validatePrice($scope.rec.price_offered);
    }

    $scope.validatePrice = function (price) {
        if (Number($scope.frmStdItemData.absolute_minimum_price) == 0) {
            toaster.pop('error', 'Info', 'Minimum Price must be greater than zero.');
            $scope.rec.price_offered = null;
            return;
        }

        var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
        $http
            .post(currencyURL, {'id': $scope.rec.currencys.id, token: $scope.$root.token})
            .then(function (res) {
                if (res.data.ack == true) {
                    if (res.data.response.conversion_rate == null) {
                        toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                        $scope.rec.price_offered = null;
                        $scope.rec.converted_price = null;
                        return;
                    }
                    var newPrice = Number(price) / Number(res.data.response.conversion_rate);
                    if ($scope.rec.currencys.id != $scope.$root.defaultCurrency)
                        $scope.rec.converted_price = Number(newPrice).toFixed(2);
                    else
                        $scope.rec.converted_price = Number(price).toFixed(2);
                    /*		        	console.log(res.data.response.conversion_rate);
                     console.log(price);
                     console.log(newPrice);
                     console.log($scope.rec.converted_price);*/
                    if (Number($scope.rec.converted_price) < Number($scope.frmStdItemData.absolute_minimum_price)) {
                        toaster.pop('error', 'Info', 'Price must greater than Minimum Price (' + $scope.frmStdItemData.absolute_minimum_price + ')');
                        $scope.rec.price_offered = null;
                        return;
                    }
                }
                else {
                    toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                    $scope.rec.price_offered = null;
                    $scope.rec.converted_price = null;
                    return;
                }
            });
    }

    $scope.chkVolDiscPrice = function (price) {
        if (Number($scope.frmStdItemData.absolute_minimum_price) == 0) {
            toaster.pop('error', 'Info', 'Minimum Price must be greater than zero.');
            $scope.formData.discount_price_1 = null;
            return;
        }
        if (Number(price) < Number($scope.frmStdItemData.absolute_minimum_price)) {
            toaster.pop('error', 'Info', 'Discounted Price must greater than Minimum Price (' + $scope.frmStdItemData.absolute_minimum_price + ')');
            $scope.formData.discount_price_1 = null;
            $scope.formData.discount_value_1 = null;
            return;
        }
    }

    $scope.isBtnPredefined = false;
    $scope.checkPredefinedValue = function (val) {
        if (!angular.isString(val)) {
            $scope.isBtnPredefined = false;
        }
        else {
            var value = val.replace(/^\s+|\s+$/g, '');
            if (value !== '')
                $scope.isBtnPredefined = true;
            else
                $scope.isBtnPredefined = false;
        }
    }


    $scope.$root.load_date_picker('Customer_item_info');
}

/*myApp.filter('trim', function () {
 return function(value) {
 if(!angular.isString(value)) {
 return value;
 }
 return value.replace(/^\s+|\s+$/g, ''); // you could use .trim, but it's not going to work in IE<9
 };
 });*/

