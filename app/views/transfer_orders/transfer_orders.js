TransferOrdersController.$inject = ["$scope", "$state", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];

myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',

    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {



        $stateProvider

            .state('app.transfer-orders', {

                url: '/transfer-orders',

                title: 'Inventory',

                templateUrl: helper.basepath('transfer_orders/transfer_orders.html'),

                resolve: helper.resolveFor('ngTable', 'ngDialog')

            })

            .state('app.transfer-orders-posted', {

                url: '/posted-transfer-orders',

                title: 'Inventory',

                templateUrl: helper.basepath('transfer_orders/transfer_orders.html'),

                resolve: helper.resolveFor('ngTable', 'ngDialog')

            })

            .state('app.view-transfer-order', {

                url: '/view-transfer-orders/:id/view',

                title: 'Inventory',

                templateUrl: helper.basepath('transfer_orders/_form.html'),

                resolve: helper.resolveFor('ngDialog'),

                controller: 'TransferOrdersAddController'

            })

            .state('app.add-transfer-orders', {

                url: '/add-transfer-orders',

                title: 'Inventory',

                templateUrl: helper.basepath('transfer_orders/_form.html'),

                resolve: helper.resolveFor('ngDialog'),

                controller: 'TransferOrdersAddController'

            })

    }]);



myApp.controller('TransferOrdersController', TransferOrdersController);

myApp.controller('TransferOrdersAddController', TransferOrdersAddController);



function TransferOrdersController($scope, $state, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {

    'use strict';

   

    var vm = this;

    $scope.posted = 0;

    

    if ($state.current.name == 'app.transfer-orders-posted')

    {

        $scope.breadcrumbs =

            [

                { 'name': 'Inventory', 'url': '#', 'isActive': false },

                { 'name': 'Posted Transfer Stock', 'url': '#', 'isActive': false }];

        $scope.posted = 1;

    }

    else

    {

        $scope.breadcrumbs =

            [

                { 'name': 'Inventory', 'url': '#', 'isActive': false },

                { 'name': 'Transfer Stock', 'url': '#', 'isActive': false }];

        $scope.posted = 0;

    }

    var Api = $scope.$root.gl + "chart-accounts/get-all-transfer-orders";

    var postData = {

        'token': $scope.$root.token,

        'type': $scope.posted

    };

    

    $scope.transfer_orders = [];

    $scope.showLoader = true;

    $http

        .post(Api, postData)

        .then(function (res) {



            if (res.data.ack == true) {

                $scope.transfer_orders = res.data.response;

                $scope.showLoader = false;

            }

            else {

                $scope.showLoader = false;

                // toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

            }

        });



    /* $scope.$watch("MyCustomeFilters", function () {

        if ($scope.MyCustomeFilters && $scope.table.tableParams5) {

            $scope.table.tableParams5.reload();

        }

    }, true);



    $scope.MyCustomeFilters = {};



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

                //$scope.checkData = ngDataService.getData( $defer, params, Api,$filter,$scope,postData);

            }

        }); */



}



function TransferOrdersAddController($scope, $rootScope, $stateParams, $http, $state, $resource, toaster, ngDialog, $timeout, $filter) {



    $scope.formTitle = 'Transfer Orders';

    $scope.btnCancelUrl = 'app.setup';

    // console.log($stateParams.id);



    var type_str = ($stateParams.id != undefined && $stateParams.id > 0) ? 'Edit' : 'Add';

    $scope.status = {};

    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

    $scope.arr_transit_codes = [{ 'id': '1', 'value': 'Road' }, { 'id': '2', 'value': 'Air' }, { 'id': '3', 'value': 'Sea' }, { 'id': '4', 'value': 'Rail' }];



	/* $scope.formUrl = function () {

		return "app/views/transfer_orders/_form.html";

	} */



    $scope.rec = {};

    $scope.rec.type = 0;

    $scope.rec.code = '';



    $scope.rec.items = [];

    $scope.predata = {};

    var postData = {};



    $scope.volume = 0;

    $scope.weight = 0;

    $scope.volume_unit = '';

    $scope.weightunit = '';

    $scope.weight_permission = 0;

    $scope.volume_permission = 0;



    $scope.showVolumeWeight = 0;





    postData.token = $scope.$root.token;

    var postUrl = $scope.$root.gl + "chart-accounts/get-transfer-orders-pre-data";

    $scope.showLoader = true;

    

    $http

        .post(postUrl, postData)

        .then(function (res) {



            if (res.data.ack == true) {

                $scope.predata = res.data.response;

                if ($stateParams.id != undefined) {

                    $scope.transfer_orders_readonly = true;

                    var postUrl1 = $scope.$root.gl + "chart-accounts/get-transfer-order";

                    var postData1 = {};

                    postData1.token = $scope.$root.token;

                    postData1.id = $stateParams.id;

                    $http

                        .post(postUrl1, postData1)

                        .then(function (res) {

                            if (res.data.ack == true) {

                                $scope.showLoader = false;

                                $scope.rec = res.data.response;



                                if($scope.rec.type == 0)

                                {

                                    $scope.breadcrumbs = [{ 'name': 'Inventory', 'url': '#', 'isActive': false },

                                    { 'name': 'Transfer Stock', 'url': 'app.transfer-orders', 'isActive': false },

                                    { 'name': $scope.rec.code, 'url': '#', 'isActive': false }];

                                }

                                else

                                {

                                    $scope.breadcrumbs = [{ 'name': 'Inventory', 'url': '#', 'isActive': false },

                                    { 'name': 'Posted Transfer Stock', 'url': 'app.transfer-orders-posted', 'isActive': false },

                                    { 'name': $scope.rec.code, 'url': '#', 'isActive': false }];

                                }

                                angular.forEach($scope.predata, function(obj){

                                    if (obj.warehouse_id == $scope.rec.warehouse_from)

                                        $scope.rec.warehouse_from = obj;

                                    

                                    if (obj.warehouse_id == $scope.rec.warehouse_to)

                                        $scope.rec.warehouse_to = obj;



                                    angular.forEach($scope.rec.items, function(item){

                                        var loc_from = $filter("filter")(obj.location_arr, { location_id: item.location_from }, true);

                                        if(loc_from.length > 0)

                                            item.location_from = loc_from[0];



                                        var loc_to= $filter("filter")(obj.location_arr, { location_id: item.location_to }, true);

                                        if (loc_to.length > 0)

                                            item.location_to = loc_to[0];

                                    });



                                });



                                angular.forEach($scope.rec.items, function (item) {

                                    item.remainig_qty = Number(item.qty) - Number(item.allocated_stock);

                                });



                                angular.forEach($scope.arr_transit_codes, function (obj) {

                                    if ($scope.rec.in_transit_code == obj.id)

                                        $scope.rec.in_transit_codes = obj;

                                });

                                

                                /* if ($scope.rec.items.length == 0)

                                    $scope.AddNewItem(); */



                                $scope.volume = res.data.volume;

                                $scope.weight = res.data.weight;

                                $scope.volume_unit = res.data.volume_unit;

                                $scope.weightunit = res.data.weightunit;                    

                                $scope.weight_permission = res.data.weight_permission; 

                                $scope.volume_permission = res.data.volume_permission; 



                                // if($scope.weight_permission >0 || $scope.volume_permission>0)

                                //     $scope.showVolumeWeight = 1;

                                if(($scope.weight_permission >0 && $scope.weight && $scope.weight!=0) || ($scope.volume_permission>0 && $scope.volume && $scope.volume!=0))

                                    $scope.showVolumeWeight = 1;

                            }

                            else

                                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(104));

                        });

                }

                else

                {

                    $scope.breadcrumbs = [{ 'name': 'Inventory', 'url': '#', 'isActive': false },

                                            { 'name': 'Transfer Stock', 'url': 'app.transfer-orders', 'isActive': false }];

                    $scope.transfer_orders_readonly = false;

                    $scope.showLoader = false;

                    /* if ($scope.rec.items.length == 0)

                        $scope.AddNewItem(); */

                }

            }

            else {

                $scope.showLoader = false;

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(245, ['Transfer Stocks']));

            }

        });





    



    $scope.showEditForm = function () {

        $scope.transfer_orders_readonly = false;

    }

    $scope.add = function (rec) {



        if (rec.warehouse_from == undefined || Number(rec.warehouse_from.warehouse_id) == 0 || 

            rec.warehouse_to == undefined || Number(rec.warehouse_to.warehouse_id) == 0 || 

            rec.in_transit_codes == undefined || Number(rec.in_transit_codes.id) == 0)

        {

            toaster.pop('error', 'Error', 'Please specify all the mandatory fields');

            return;

        }

        rec.in_transit_code = (rec.in_transit_codes != undefined && rec.in_transit_codes.id != undefined && Number(rec.in_transit_codes.id) > 0) ? rec.in_transit_codes.id : 0;

        rec.warehouse_from_id = (rec.warehouse_from != undefined && rec.warehouse_from.warehouse_id != undefined && Number(rec.warehouse_from.warehouse_id) > 0) ? rec.warehouse_from.warehouse_id : 0;

        rec.warehouse_from_name = (rec.warehouse_from != undefined && rec.warehouse_from.warehouse_id != undefined && Number(rec.warehouse_from.warehouse_id) > 0) ? rec.warehouse_from.warehouse_name : '';

        rec.warehouse_from_address_1 = (rec.warehouse_from != undefined && rec.warehouse_from.warehouse_id != undefined && Number(rec.warehouse_from.warehouse_id) > 0) ? rec.warehouse_from.address_1 : '';

        rec.warehouse_from_address_2 = (rec.warehouse_from != undefined && rec.warehouse_from.warehouse_id != undefined && Number(rec.warehouse_from.warehouse_id) > 0) ? rec.warehouse_from.address_2 : '';

        rec.warehouse_from_city = (rec.warehouse_from != undefined && rec.warehouse_from.warehouse_id != undefined && Number(rec.warehouse_from.warehouse_id) > 0) ? rec.warehouse_from.city : '';

        rec.warehouse_from_county = (rec.warehouse_from != undefined && rec.warehouse_from.warehouse_id != undefined && Number(rec.warehouse_from.warehouse_id) > 0) ? rec.warehouse_from.county : '';



        rec.warehouse_to_id = (rec.warehouse_to != undefined && rec.warehouse_to.warehouse_id != undefined && Number(rec.warehouse_to.warehouse_id) > 0) ? rec.warehouse_to.warehouse_id : 0;

        rec.warehouse_to_name = (rec.warehouse_to != undefined && rec.warehouse_to.warehouse_id != undefined && Number(rec.warehouse_to.warehouse_id) > 0) ? rec.warehouse_to.warehouse_name : '';

        rec.warehouse_to_address_1 = (rec.warehouse_to != undefined && rec.warehouse_to.warehouse_id != undefined && Number(rec.warehouse_to.warehouse_id) > 0) ? rec.warehouse_to.address_1 : '';

        rec.warehouse_to_address_2 = (rec.warehouse_to != undefined && rec.warehouse_to.warehouse_id != undefined && Number(rec.warehouse_to.warehouse_id) > 0) ? rec.warehouse_to.address_2 : '';

        rec.warehouse_to_city = (rec.warehouse_to != undefined && rec.warehouse_to.warehouse_id != undefined && Number(rec.warehouse_to.warehouse_id) > 0) ? rec.warehouse_to.city : '';

        rec.warehouse_to_county = (rec.warehouse_to != undefined && rec.warehouse_to.warehouse_id != undefined && Number(rec.warehouse_to.warehouse_id) > 0) ? rec.warehouse_to.county : '';



        rec.token = $scope.$root.token;



        var postUrl = $scope.$root.gl + "chart-accounts/update-transfer-order";

        $http

            .post(postUrl, rec)

            .then(function (res) {

                if (res.data.ack == true) {

                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

                    $scope.transfer_orders_readonly = true;

                    if ($state.current.name == 'app.view-transfer-order')

                    {

                        location.reload();

                    }

                    else

                    {

                        $timeout(function () {

                            $state.go("app.view-transfer-order", { id: res.data.id });

                        }, 1000);

                    }

                }

                else

                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(104));

            });

    }



    $scope.OnChangeWarehouse = function(type)

    {

        return;

        if(type == 1) {

            if ($scope.rec.warehouse_to != undefined && $scope.rec.warehouse_from.warehouse_id ==  $scope.rec.warehouse_to.warehouse_id) {

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(550, ['Warehouse ', 'Warehouse To']));

                $scope.rec.warehouse_from = '';

            }

        }

        else if (type == 2) {

            if ($scope.rec.warehouse_from != undefined && $scope.rec.warehouse_from.warehouse_id == $scope.rec.warehouse_to.warehouse_id) {

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(550, ['Warehouse ', 'Warehouse From']));

                $scope.rec.warehouse_to = '';

            }

        }

    }



    $scope.OnChangeLocation = function (type, item) {



        if (type == 1) {

            if (item.location_to != undefined && item.location_from.location_id == item.location_to.location_id) {

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(550, ['Location ', 'Location To']));

                item.location_from = '';

            }

        }

        else if (type == 2) {

            if (item.location_from != undefined && item.location_from.location_id == item.location_to.location_id) {

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(550, ['Location ', 'Location From']));

                item.location_to = '';

            }

        }

    }



    $scope.AddNewItem = function()

    {

        $scope.rec.items.push({'item_code':'',

                                'item_name': '',

                                'qty': null,

                                'uom_name': '',

                                'uom_id' : '0',

                                'uom_setup_id' : '0',

                                'allocated_stock':0,

                                'location_from': '',

                                'location_to':''

                            });

    }



    $scope.DeleteItem = function(item, index)

    {

        if (item.id == undefined || Number(item.id) == 0)

        {

            $scope.rec.items.splice(index, 1);

            /* if($scope.rec.items.length == 0)

                $scope.AddNewItem(); */

            return;

        }

        ngDialog.openConfirm({

            template: 'modalDeleteDialogId',

            className: 'ngdialog-theme-default-custom'

        }).then(function (value) {



            var postUrl = $scope.$root.gl + "chart-accounts/delete-transfer-order-item";

            var postData = {};

            postData.order_id = $scope.rec.id;

            postData.id = item.id;

            postData.product_id = item.item_id;

            postData.token = $scope.$root.token;



            $http

                .post(postUrl, postData)

                .then(function (res) {

                    if (res.data.ack == true) {

                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(103));

                        $scope.rec.items.splice(index, 1);

                        /* if ($scope.rec.items.length == 0)

                            $scope.AddNewItem(); */

                    }

                    else

                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(108));

                });



        }, function (reason) {

            console.log('Modal promise rejected. Reason: ', reason);

        });

        

    }



    $scope.OnBlurItemQty = function(index)

    {

        var calculated_qty = 0;

        angular.forEach($scope.rec.items, function(obj){

            if (obj.item_id == $scope.rec.items[index]['item_id'])

            {

                calculated_qty +=  Number(obj.qty);

            }

        });



        if (Number(calculated_qty) > Number($scope.rec.items[index]['max_qty']))

        {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(587, [$scope.rec.items[index]['item_code'], $scope.rec.items[index]['max_qty']]));

            $scope.rec.items[index]['qty'] = null;

        }





        if ($scope.rec.items[index]['qty'] <= $scope.rec.items[index]['allocated_stock'] && $scope.rec.items[index]['allocated_stock'] > 0) {

            toaster.pop('warning', 'Info', String($scope.rec.items[index]['allocated_stock']) + ' quantity is already allocated for item ' + $scope.rec.items[index]['item_code']);

            $scope.rec.items[index]['qty'] = $scope.rec.items[index]['allocated_stock'];

            $scope.rec.items[index]['remainig_qty'] = 0;

            $scope.rec.items[index]['journal_status'] = 1;

            // return false;

        }

        else if ($scope.rec.items[index]['qty'] >= $scope.rec.items[index]['allocated_stock']) {

            $scope.rec.items[index]['remainig_qty'] = $scope.rec.items[index]['qty'] - $scope.rec.items[index]['allocated_stock'];

        }

    }

    $scope.getItems = function (index) { //item_paging

        

        if ($scope.rec.warehouse_from == undefined || Number($scope.rec.warehouse_from.id) == 0)

        {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Warehouse From']));

            return;

        }



        var postUrl_cat = $scope.$root.gl + "chart-accounts/get-items-by-warehouse-id";



        $scope.postData = {};

        $scope.postData.from_warehouse_id = $scope.rec.warehouse_from.warehouse_id;

        $scope.postData.to_warehouse_id = $scope.rec.warehouse_to.warehouse_id;

       

        $scope.postData.token = $scope.$root.token;

        $scope.showLoader = true;

        $scope.warehouse_items = [];

        $scope.current_index = index;

        $http

            .post(postUrl_cat, $scope.postData)

            .then(function (res) {

                //console.log(res);

                $scope.showLoader = false;



                if (res.data.ack == true) {

                    $scope.warehouse_items = res.data.response;

                    angular.element('#transfer_order_items_popup').modal({ show: true });

                }

                else

                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

            });

    }



    $scope.assignCodes = function (item) {



        $scope.rec.items[$scope.current_index]['item_id'] = item.item_id;

        $scope.rec.items[$scope.current_index]['item_code'] = item.code;

        $scope.rec.items[$scope.current_index]['item_name'] = item.name;

        $scope.rec.items[$scope.current_index]['qty'] = null;

        $scope.rec.items[$scope.current_index]['stock_check'] = item.stock_check;

        $scope.rec.items[$scope.current_index]['max_qty'] = item.qty;

        $scope.rec.items[$scope.current_index]['uom_id'] = item.uom_id;

        $scope.rec.items[$scope.current_index]['uom_setup_id'] = item.uom_setup_id;

        $scope.rec.items[$scope.current_index]['uom_name'] = item.uom_name;

        $scope.rec.items[$scope.current_index]['location_from'] = '';

        $scope.rec.items[$scope.current_index]['location_to'] = '';

        

        angular.element('#transfer_order_items_popup').modal('hide');

    }



    $scope.getPurchaseOrderList = function () {

        

        var purchase_orderUrl = $scope.$root.sales + "crm/crm/get-purchase-order-invoices";

        var postData = {};



        postData.token = $scope.$root.token;



        $scope.showLoader = true;

        $http

            .post(purchase_orderUrl, postData)

            .then(function (res) {



                if (res.data.ack == true) {

                    $scope.showLoader = false;

                    $scope.purchase_orders = res.data.response;

                    angular.element('#transfer_order_purchase_order_popup').modal({ show: true });

                }

                else

                {

                    $scope.showLoader = false;

                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

                }

            });

    }

    $scope.selectPurchaseOrder = function (result) {

        $scope.rec.purchase_order_id = result.id;

        $scope.rec.purchase_order_code = result.order_code;

        $scope.rec.shipping_agent_name = result.sell_to_cust_no + ' - ' + result.sell_to_cust_name;

        $scope.rec.shipping_charges = Number(result.grand_total);

        $scope.rec.currency_code = result.currency_code;

        $scope.rec.shipping_address_1 = result.sell_to_address;

        $scope.rec.shipping_address_2 = result.sell_to_address2;

        $scope.rec.shipping_phone = result.cust_phone;

        $scope.rec.shipping_ref_no = result.cust_order_no;



        angular.element('#transfer_order_purchase_order_popup').modal('hide');

    }

    $scope.removePurchaseOrder = function (result) {

        $scope.rec.purchase_order_id = 0;
        $scope.rec.purchase_order_code = '';
        $scope.rec.shipping_agent_name = '';
        $scope.rec.shipping_charges = 0;
        $scope.rec.currency_code = '';
        $scope.rec.shipping_address_1 = '';
        $scope.rec.shipping_address_2 = '';
        $scope.rec.shipping_phone = '';
        $scope.rec.shipping_ref_no = '';
        angular.element('#transfer_order_purchase_order_popup').modal('hide');
    }



    $scope.get_stock_allocation = function (item, index, p_id) {



        if (item.type == 1) {

            $rootScope.check_so_readonly = true;

            $rootScope.check_srm_readonly = true;

            $rootScope.hide_dispatch_btn = true;



            $scope.all_wh_stock = [];

            $scope.stock_item = item;

            $scope.stock_item.sale_status = 2;



            var warehouse_id = $scope.rec.warehouse_from.warehouse_id;

            var to_warehouse_id = $scope.rec.warehouse_to.warehouse_id;

            var from_location_id = item.location_from.location_id;

            var to_location_id = item.location_to.location_id;

            var item_id = item.item_id;

            var order_id = $scope.rec.id;

            var sale_order_detail_id = 0;

            $scope.allocation_title = $scope.rec.code;

            $scope.model_code = item.item_code;

            $scope.stock_item.product_code = item.item_code;

            $scope.stock_item.description = item.item_name;

            $scope.stock_item.warehouse_name = $scope.rec.warehouse_from.warehouse_name;

            $scope.stock_item.location_name = item.location_from.location_name;

            $scope.stock_item.to_location_name = item.location_to.location_name;

            $scope.stock_item.units = {};

            $scope.stock_item.units.name = item.uom_name;

            $scope.stock_item.unit_of_measure_name = item.uom_name;

            var isInvoice = $scope.rec.type;



            // var isInvoice = 0;



            // to show the add/delete stock button

            $scope.check_so_readonly = false;

            $scope.check_srm_readonly = false;

            $scope.hide_dispatch_btn = false;



            $scope.stock_item.qty = item.qty;

            $scope.remainig_qty = 0;



            $scope.order_qty = item.qty;

            $scope.current_stock = 0;

            $scope.showLoader = false;



            $scope.stock_item.item_journal = 1;

            var getStockUrl = $scope.$root.sales + "warehouse/get-purchase-stock-transfer-order";

            $http

                .post(getStockUrl, {

                    'warehouse_id': warehouse_id,

                    type: 1,

                    'transfer_order_detail_id': item.id,

                    'to_warehouse_id': to_warehouse_id,

                    'from_location_id': from_location_id,

                    'to_location_id': to_location_id,

                    item_id: item_id,

                    order_id: order_id,

                    isInvoice: isInvoice,

                    'token': $scope.$root.token

                })

                .then(function (res) {

                    //console.log(res.data.remaining_stock);

                    if (res.data.ack == true) {

                        $scope.all_wh_stock = res.data.response;

                        $scope.stock_item.total_available_qty = 0;

                        angular.forEach($scope.all_wh_stock, function (obj) {

                            $scope.stock_item.total_available_qty += Number(obj.avail_qty);

                        });

                        $scope.stock_allocate_detail(item_id, 0, warehouse_id, item.id);

                        $scope.current_stock_by_id(warehouse_id, item_id);

                        angular.element('#stockAllocationModal').modal({ show: true });

                    }

                    else {

                        $scope.all_wh_stock = [];

                        $scope.stock_item.total_available_qty = 0;

                        if (res.data.location_to_check != undefined && res.data.location_to_check == 1)

                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(588, [$scope.stock_item.to_location_name]));

                        else

                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(589, [$scope.stock_item.location_name]));

                    }

                });

        }

        else {

            if (Number(item.item_id) == 0) {

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Item']));

                return;

            }

            if (item.location_from == undefined || item.location_from == '' || item.location_from.location_id == undefined || Number(item.location_from.location_id) == 0) {

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['From Location']));

                return;

            }

            if (item.location_to == undefined || item.location_to == '' || item.location_to.location_id == undefined  || Number(item.location_to.location_id) == 0) {

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['To Location']));

                return;

            }

            if (item.qty == undefined || Number(item.qty) == 0) {

                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Quantity']));

                return;

            }





            $scope.disable_save = false;

            var singleSaveUrl = $scope.$root.gl + "chart-accounts/add-jl-transfer-order-item-single";

            var item_data = {};

            item_data.token = $scope.$root.token;





            if (item.module_type != undefined)

                item.transaction_type = item.module_type.value;

            else

                item.transaction_type = 0;



            if (item.doc_type != undefined)

                item.document_type = item.doc_type.id;

            else

                item.document_type = 0;





            item_data.item = item;

            item_data.order_id = $scope.rec.id;

            $scope.showLoader = true;

            $http

                .post(singleSaveUrl, item_data)

                .then(function (res) {

                    if (res.data.ack == true) {

                        $scope.backend_data = 1;

                        item.id = res.data.id;

                        item.parent_id = $scope.rec.id;

                        $scope.showLoader = true;



                        $scope.all_wh_stock = [];

                        $scope.stock_item = item;

                        if ($scope.transfer_orders_readonly == true)

                            $scope.stock_item.sale_status = 2; // for disabling the edit (used as a flag)

                        else

                            $scope.stock_item.sale_status = 1; // for disabling the edit



                        var warehouse_id = $scope.rec.warehouse_from.warehouse_id;

                        var to_warehouse_id = $scope.rec.warehouse_to.warehouse_id;

                        var from_location_id = item.location_from.location_id;

                        var to_location_id = item.location_to.location_id;

                        var item_id = item.item_id;

                        var order_id = $scope.rec.id;

                        var sale_order_detail_id = 0;

                        $scope.allocation_title = $scope.rec.code;

                        $scope.model_code = item.item_code;

                        $scope.stock_item.product_code = item.item_code;

                        $scope.stock_item.description = item.item_name;

                        $scope.stock_item.warehouse_name = $scope.rec.warehouse_from.warehouse_name;

                        $scope.stock_item.location_name = item.location_from.location_name;

                        $scope.stock_item.to_location_name = item.location_to.location_name;

                        $scope.stock_item.units = {};

                        $scope.stock_item.units.name = item.uom_name;

                        $scope.stock_item.unit_of_measure_name = item.uom_name;

                        var isInvoice = $scope.rec.type;



                        // to show the add/delete stock button

                        $scope.check_so_readonly = false;

                        $scope.check_srm_readonly = false;

                        $scope.hide_dispatch_btn = false;



                        $scope.stock_item.qty = item.qty;

                        $scope.remainig_qty = 0;



                        $scope.order_qty = item.qty;

                        $scope.current_stock = 0;

                        $scope.showLoader = false;

                        $scope.stock_item.item_journal = 1;

                        var getStockUrl = $scope.$root.sales + "warehouse/get-purchase-stock-transfer-order";

                        $http

                            .post(getStockUrl, {

                                'warehouse_id': warehouse_id,

                                'to_warehouse_id': to_warehouse_id,

                                'from_location_id': from_location_id,

                                'to_location_id': to_location_id,

                                type: 1,

                                'transfer_order_detail_id': item.id,

                                item_id: item_id,

                                order_id: order_id,

                                isInvoice: isInvoice,

                                'token': $scope.$root.token

                            })

                            .then(function (res) {

                                //console.log(res.data.remaining_stock);

                                if (res.data.ack == true) {

                                    $scope.all_wh_stock = res.data.response;

                                    $scope.stock_item.total_available_qty = 0;

                                    angular.forEach($scope.all_wh_stock, function (obj) {

                                        $scope.stock_item.total_available_qty += Number(obj.avail_qty);

                                    });

                                    $scope.stock_allocate_detail(item_id, 0, warehouse_id, item.id);

                                    $scope.current_stock_by_id(warehouse_id, item_id);

                                    angular.element('#stockAllocationModal').modal({ show: true });

                                }

                                else {

                                    $scope.all_wh_stock = [];

                                    $scope.stock_item.total_available_qty = 0;

                                    if (res.data.location_to_check != undefined && res.data.location_to_check == 1)

                                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(588, [$scope.stock_item.to_location_name]));

                                    else

                                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(589, [$scope.stock_item.location_name]));

                                }

                            });

                    }

                });

        }

    }

    $scope.stock_allocate_detail = function (item_id, show, warehouse_id, update_id) {

        $scope.all_order_stock = [];

        var getAllStockUrl = $scope.$root.sales + "warehouse/get-order-stock-allocation";

        $http

            .post(getAllStockUrl, {

                type: 5,

                item_id: item_id,

                order_id: $scope.rec.id,

                transfer_order: '1',

                'transfer_order_detail_id': update_id,

                wh_id: warehouse_id,

                'token': $scope.$root.token

            })

            .then(function (res) {

                if (res.data.ack == true) {

                    $scope.all_order_stock = res.data.response;

                    var ordqty = 0;

                    angular.forEach(res.data.response, function (elem) {

                        ordqty = Number(ordqty) + Number(elem.quantity);

                    });

                    if (ordqty > 0)

                        $scope.hide_btn_delete = true;

                    else

                        $scope.hide_btn_delete = false;



                    $scope.remainig_qty = Number($scope.order_qty) - Number(ordqty);

                    

                    if (show == 3) {

                        angular.forEach($scope.rec.items, function (obj, index) {

                            if (obj.item_id == item_id && ($scope.rec.warehouse_from.warehouse_id == warehouse_id) && obj.id == update_id) {

                                obj.remainig_qty = $scope.remainig_qty;

                                obj.journal_status = res.data.response[0].journal_status;

                            }

                        });



                    }

                }

                else {

                    $scope.all_order_stock = [];

                    $scope.hide_btn_delete = false;

                    $scope.remainig_qty = $scope.order_qty;

                    if (show == 3) {

                        angular.forEach($scope.rec.items, function (obj, index) {

                            if (obj.item_id == item_id && ($scope.rec.warehouse_from.warehouse_id == warehouse_id) && obj.id == update_id) {

                                obj.remainig_qty = $scope.order_qty;

                                obj.journal_status = 0;

                            }

                        });

                    }

                }

            });



        if (show == 1)

            angular.element('#stockAllocationDetailModal').modal({ show: true });

    }

    $scope.current_stock_by_id = function (warehouse_id, item_id, postiveParam) {

        $scope.all_order_stock = [];

        var getAllStockUrl = $scope.$root.sales + "warehouse/get-curent-stock-by-product-id-warehouse";

        return $http

            .post(getAllStockUrl, {

                'item_id': item_id,

                'warehouse_id': warehouse_id,

                'token': $scope.$root.token

            })

            .then(function (res) {

                if (res.data.ack == true)

                    $scope.current_stock = res.data.current_stock;



                if ((res.data.ack == false || $scope.current_stock == 0) && $scope.rec.type != 1 && postiveParam != 1)

                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(363));





            });



    }

    $scope.getAllocatStock = function (warehouse_id, item_id, order_id, transfer_order_detail_id) {

        var isInvoice = 0;

        if ($scope.rec.type == 1) {

            isInvoice = 1;

        }

        $scope.all_wh_stock = [];

        var getStockUrl = $scope.$root.sales + "warehouse/get-purchase-stock-transfer-order";



        var to_warehouse_id = $scope.rec.warehouse_to.warehouse_id;

        var from_location_id = item.location_from.location_id;

        var to_location_id = item.location_to.location_id;



        $http

            .post(getStockUrl, {

                'warehouse_id': warehouse_id,

                type: 1,

                'transfer_order_detail_id': transfer_order_detail_id,

                'to_warehouse_id': to_warehouse_id,

                'from_location_id': from_location_id,

                'to_location_id': to_location_id,

                item_id: item_id,

                order_id: order_id,

                isInvoice: isInvoice,

                'token': $scope.$root.token

            })

            .then(function (res) {

                //console.log(res.data.remaining_stock);

                if (res.data.ack == true) {

                    $scope.all_wh_stock = res.data.response;

                    $scope.stock_item.total_available_qty = 0;

                    angular.forEach($scope.all_wh_stock, function (obj) {

                        $scope.stock_item.total_available_qty += Number(obj.avail_qty);

                    });

                }

                else {

                    $scope.all_wh_stock = [];

                    $scope.stock_item.total_available_qty = 0;

                }

            });



    }

    $scope.OnFocusQty = function (stock_item) {

        stock_item.active_line = true;

    }

    $scope.OnBlurQty = function (stock_item) {

        stock_item.active_line = false;

    }





    $scope.addStockItem = function (stock, stock_item) {

        stock.active_line = false;



        if (Number(stock.req_qty) <= 0 || stock.req_qty == undefined) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(238, ['Quantity', '0']));

            return false;

        }

        if (Number(stock.req_qty) > Number(stock.avail_qty)) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(359));

            return false;

        }

        if (Number($scope.remainig_qty) == 0) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(510));

            return false;

        }

        if (Number(stock.req_qty) > Number($scope.remainig_qty)) {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(359));

            return false;

        }





        var addStockUrl = $scope.$root.sales + "warehouse/add-order-stock-allocation-transfer-order";

        stock.token = $scope.$root.token;

        // stock.source_type = stock.type;

        stock.type = 5;

        stock.transfer_order_detail_id = stock_item.id;

        stock.ledger_type = 2;



        stock.order_id = $scope.rec.id;

        stock.bl_shipment_no = stock.bl_shipment_no;

        stock.item_id = stock_item.item_id;

        // stock.warehouse_id = stock_item.warehouses.id;



        stock.from_warehouse_id = $scope.rec.warehouse_from.warehouse_id;

        stock.to_warehouse_id = $scope.rec.warehouse_to.warehouse_id;



        stock.from_location_id  = stock_item.location_from.location_id;

        stock.to_location_id    = stock_item.location_to.location_id;



        stock.order_date = stock.posting_date;

        stock.units = stock_item.units;

        stock.default_units = stock_item.default_units;

        stock.unit_measure_id = (stock_item.uom_id != undefined && stock_item.uom_id != '') ? stock_item.uom_id : 0;

        stock.uom_name = (stock_item.uom_name != undefined && stock_item.uom_name != '') ? stock_item.uom_name : 0;

        stock.primary_unit_id = stock.unit_measure_id;

        stock.primary_unit_name = stock.uom_name;

        stock.sale_return_status = 0;



        $http

            .post(addStockUrl, stock)

            .then(function (res) {



                if (res.data.ack == true) {



                    stock.active_line = true;

                    if (stock.id > 0) {

                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));

                        if ($rootScope.ConvertDateToUnixTimestamp(stock.use_by_date) < $rootScope.ConvertDateToUnixTimestamp($scope.$root.get_current_date()))

                            toaster.pop('warning', 'Warning', 'Used by date of allocated item has already passed');

                    }

                    else

                        toaster.pop('success', 'Add', 'Record  Inserted  .');



                    stock.allocated_qty = Number(stock.allocated_qty) + Number(stock.req_qty);

                    stock.currently_allocated_qty = Number(stock.currently_allocated_qty) + Number(stock.req_qty);

                    stock.avail_qty = Number(stock.avail_qty) - Number(stock.req_qty);

                    stock_item.total_available_qty = Number(stock_item.total_available_qty) - Number(stock.req_qty);

                    stock_item.allocated_stock = stock_item.allocated_stock + stock.req_qty;



                    // $scope.stock_allocate_detail(stock_item.id, 3, stock_item.warehouses, stock_item.update_id);



                    /* var selected_current_items = $filter("filter")($scope.items, { id: stock.item_id });

                    var global_items = $filter("filter")($scope.tempProdArr, { id: stock.item_id });



                    angular.forEach(selected_current_items, function (item, obj_index) {

                        var chk_item = $filter("filter")(item.arr_warehouse, { id: stock.warehouse_id });

                        var idx = item.arr_warehouse.indexOf(chk_item[0]);

                        item.arr_warehouse[idx].available_quantity = item.arr_warehouse[idx].available_quantity - stock.req_qty;

                    });



                    angular.forEach(global_items, function (item, obj_index) {

                        var arr_warehouse = (item.arr_warehouse != undefined && item.arr_warehouse.response != undefined) ? item.arr_warehouse.response : item.arr_warehouse;

                        var chk_item = $filter("filter")(arr_warehouse, { id: stock.warehouse_id });

                        var idx = arr_warehouse.indexOf(chk_item[0]);

                        arr_warehouse[idx].available_quantity = arr_warehouse[idx].available_quantity - stock.req_qty;

                    }); */

                    stock.req_qty = '';

                    $scope.stock_allocate_detail(stock_item.item_id, 3, $scope.rec.warehouse_from.warehouse_id, stock_item.id);

                    $scope.current_stock_by_id($scope.rec.warehouse_from.warehouse_id, stock_item.item_id, 1);



                }

                else {

                    // $scope.stock_allocate_detail(stock_item.id, 3, stock_item.warehouses, stock_item.update_id);



                    $scope.getAllocatStock($scope.rec.warehouse_from.warehouse_id, stock_item.item_id, $scope.rec.id, stock_item.id);

                    $scope.stock_allocate_detail(stock_item.item_id, 0, $scope.rec.warehouse_from.warehouse_id, stock_item.id);

                    $scope.current_stock_by_id($scope.rec.warehouse_from.warehouse_id, stock_item.item_id);



                    toaster.pop('error', 'Edit', res.data.error);

                }

            });

    }



    $scope.delStockItem = function (stock, stock_item) {

        stock.active_line = false;



        if (isNaN(stock.req_qty)) {

            stock.req_qty = 0;

            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(319, ['Quantity','0']));

            return;

        }



        if (Number(stock.req_qty) <= 0) {

            stock.req_qty = 0;

            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(319, ['Quantity','0']));

            return;

        }



        if (Number(stock.req_qty) > Number(stock.currently_allocated_qty)) {

            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(364));

            return;

        }



        var postData = stock;

        postData.order_id = $scope.rec.id;

        stock.transfer_order_detail_id = stock_item.id;

        stock.item_id = stock_item.id;

        // stock.source_type = stock.type;

        stock.ledger_type = 2 // will be zero when we allocate stock to sales order;



        stock.warehouse_from = $scope.rec.warehouse_from.warehouse_id;

        stock.warehouse_to = $scope.rec.warehouse_to.warehouse_id;

        

        stock.location_from = stock_item.location_from.location_id;

        stock.location_to = stock_item.location_to.location_id;

        

        

        postData.token = $scope.$root.token;

        if (stock.req_qty == stock.currently_allocated_qty)

            var delStockUrl = $scope.$root.sales + "warehouse/delete-item-transfer-order";

        else

            var delStockUrl = $scope.$root.sales + "warehouse/deallocate-item-transfer-order";

        /*console.log(stock);

         return;*/

        $http

            .post(delStockUrl, { 'postData': postData, 'token': $scope.$root.token })

            .then(function (res) {

                if (res.data.ack == true) {

                    stock.active_line = true;

                    stock.allocated_qty = Number(stock.allocated_qty) - Number(stock.req_qty);

                    stock.currently_allocated_qty = Number(stock.currently_allocated_qty) - Number(stock.req_qty);

                    stock.avail_qty = Number(stock.avail_qty) + Number(stock.req_qty);

                    stock_item.total_available_qty = Number(stock_item.total_available_qty) + Number(stock.req_qty);

                    stock_item.allocated_stock = stock_item.allocated_stock - Number(stock.req_qty);



                    stock.req_qty = '';

                    $scope.stock_allocate_detail(stock_item.item_id, 3, $scope.rec.warehouse_from.warehouse_id, stock_item.id);

                    $scope.current_stock_by_id($scope.rec.warehouse_from.warehouse_id, stock_item.item_id);



                }

                else {

                    $scope.getAllocatStock(stock_item.warehouses, stock_item.id, $scope.rec.id, stock_item.update_id);

                    $scope.stock_allocate_detail(stock_item.item_id, 0, $scope.rec.warehouse_from.warehouse_id, stock_item.id);

                    $scope.current_stock_by_id($scope.rec.warehouse_from.warehouse_id, stock_item.item_id);

                    toaster.pop('error', 'Edit', res.data.error);

                }



            });



    }



    

    $scope.AllocateInFull = function (stock, stock_item)

    {

        console.log(stock);

        console.log($scope.remainig_qty);

        

        var already_allocated = 0;

        /* angular.forEach($scope.all_wh_stock, function(obj){

            if(Number(obj.req_qty) > 0)

                already_allocated = already_allocated + Number(obj.req_qty);

        }); */

        

        if(stock.allocate_in_full)

        {

            if(Number($scope.remainig_qty - already_allocated) == 0)

            {

                toaster.pop('error', 'error', $scope.$root.getErrorMessageByCode(630));

                stock.allocate_in_full = false;

                return;

            }



            console.log('true');

            if(($scope.remainig_qty - already_allocated) <= stock.avail_qty)

            {

                stock.req_qty = Number($scope.remainig_qty - already_allocated);

                $scope.addStockItem(stock, stock_item);

            }

            else if(Number(stock.avail_qty) > 0)

            {

                stock.req_qty = Number(stock.avail_qty);

                $scope.addStockItem(stock, stock_item);

            }

            else

            {

                toaster.pop('error', 'error', $scope.$root.getErrorMessageByCode(630));

                stock.allocate_in_full = false;

            }

        }

        else

        {

            stock.req_qty = stock.currently_allocated_qty;

            $scope.delStockItem(stock, stock_item);

            console.log('false');

        }

    }

    

    $scope.PostTransferOrder = function()

    {

        if ($scope.rec.warehouse_from == undefined || Number($scope.rec.warehouse_from.warehouse_id) == 0 ||

            $scope.rec.warehouse_to == undefined || Number($scope.rec.warehouse_to.warehouse_id) == 0 ||

            Number($scope.rec.in_transit_code) == 0) {

            toaster.pop('error', 'Error', 'Please specify all the mandatory fields');

            return;

        }



        if (!($scope.rec.order_date.length > 0))

        {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Transfer Stock Date']));

            return;

        }



        var is_invalid = false;

        var is_invalid1 = false;



        angular.forEach($scope.rec.items, function(obj){

            if(obj.stock_check == 1)

            {

                if (obj.item_id == undefined || Number(obj.item_id) == 0 || 

                obj.item_name == undefined || obj.item_name == "" ||

                obj.qty == undefined || Number(obj.qty) == 0 ||

                obj.uom_id == undefined || Number(obj.uom_id) == 0 ||

                obj.uom_name == undefined || obj.uom_name == "" ||

                obj.location_from == undefined || obj.location_from == "" || isNaN(Number(obj.location_from.location_id)) || Number(obj.location_from.location_id) == 0 || 

                obj.location_to == undefined || obj.location_to == "" || isNaN(Number(obj.location_to.location_id)) || Number(obj.location_to.location_id) == 0)

                    is_invalid1 = true;

            }

            else

            {

                if (obj.item_id == undefined || Number(obj.item_id) == 0 || 

                obj.item_name == undefined || obj.item_name == "" ||

                obj.qty == undefined || Number(obj.qty) == 0 ||

                obj.uom_id == undefined || Number(obj.uom_id) == 0 ||

                obj.uom_name == undefined || obj.uom_name == "")

                    is_invalid1 = true;

            }

            

            if(obj.stock_check == 1 && Number(obj.remainig_qty) > 0)

                is_invalid = true;

        });





        if (is_invalid1)

        {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(654));

            return;

        }

        if (is_invalid)

        {

            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(551));

            return;

        }



        $rootScope.order_post_invoice_msg = "Are you sure you want to post this Transfer Stock?";

        ngDialog.openConfirm({

            template: '_confirm_order_invoice_modal',

            className: 'ngdialog-theme-default-custom'

        }).then(function (value) {



            var postData = {};

            postData.token = $scope.$root.token;

            postData.id = $scope.rec.id;



            var postUrl = $scope.$root.gl + "chart-accounts/post-transfer-order";

            $http

                .post(postUrl, postData)

                .then(function (res) {

                    if (res.data.ack == true) {



                        toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(626));

                        $timeout(function () {

                            $state.go("app.transfer-orders");

                        }, 500);

                    }

                    else

                        toaster.pop('error', 'Error', res.data.error);

                });



        }, function (reason) {

            console.log('Modal promise rejected. Reason: ', reason);

        });

        

    }



    /* $scope.showOrderTrail = function (stock, isSingleTrail, single_item) {

        $scope.searchKeyword_2 = {};

        var stock_trail_url = $scope.$root.setup + "warehouse/sale-stock-trial";

        if (single_item != undefined) {

            if (single_item == 1) {

                var postData = {

                    'token': $scope.$root.token,

                    'prod_id': stock,

                    'only_so': 1

                };

            }

        }

        else {

            var postData = {

                'token': $scope.$root.token,

                'prod_id': stock.product_id,

                'warehouse_id': stock.warehouse_id

            };

        }



        if (isSingleTrail) {

            postData.id = stock.id;

            postData.sale_return_status = stock.sale_return_status;

            postData.item_trace_unique_id = stock.item_trace_unique_id;

            postData.entry_type = stock.type;

            if (isSingleTrail == 1) // total qty => purchase orders

            {

                postData.type = 1;

            }

            else if (isSingleTrail == 2) // sold qty => sales orders

            {

                postData.type = 2;

                postData.sale_status = '2, 3';

            }

            else if (isSingleTrail == 3) // allocated qty => allocated orders

            {

                postData.type = 2;

                postData.sale_status = 1;

            }

            else if (isSingleTrail == 4) // returned qty => Credit Notes

            {

                postData.type = 1;

                postData.only_cn = 1;

            }

        }

        $scope.prod_warehouse_trail_data = [];



        $http

            .post(stock_trail_url, postData)

            .then(function (res) {



                $scope.columns2 = [];





                if (res.data.response != null) {

                    $scope.prod_warehouse_trail_data = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {

                        $scope.columns2.push({

                            'title': toTitleCase(index),

                            'field': index,

                            'visible': true

                        });

                    });

                }

            });

        $scope.searchKeyword_2 = {};

        angular.element('#order_trail_modal').modal({ show: true });

    } */



    $scope.showOrderTrail = function (stock, list_type, entries_type) {

        $scope.searchKeyword_2 = {};

        var stock_trail_url = $scope.$root.setup + "warehouse/sale-stock-trial";

        /*if (single_item != undefined) {

            if (single_item == 1) {

                var postData = {

                    'token': $scope.$root.token,

                    'prod_id': stock,

                    'only_so': 1

                }; 

            }

        }

        else { */

        var prod_id = (stock.product_id != undefined) ? stock.product_id : stock.id;

            var postData = {

                'token': $scope.$root.token,

                'prod_id': prod_id,

                'list_type': list_type,

                'entries_type': entries_type,

                

                'warehouse_id': stock.warehouse_id

            };

        // }



        if(list_type == 'current_stock')

        {

            $scope.stock_activity_title = 'Current Stock';

        }

        else if(list_type == 'available_stock')

        {

            $scope.stock_activity_title = 'Available Stock';

        }

        else if(list_type == 'allocated_stock')

        {

            $scope.stock_activity_title = 'Allocated Stock';

        }





        

        if (entries_type != undefined)

            postData.item_trace_unique_id = stock.item_trace_unique_id;

        /* if (isSingleTrail) {

            postData.id = stock.id;

            postData.sale_return_status = stock.sale_return_status;

            postData.item_trace_unique_id = stock.item_trace_unique_id;

            postData.entry_type = stock.type;

            if (isSingleTrail == 1) // total qty => purchase orders

            {

                postData.type = 1;

            }

            else if (isSingleTrail == 2) // sold qty => sales orders

            {

                postData.type = 2;

                postData.sale_status = '2, 3';

            }

            else if (isSingleTrail == 3) // allocated qty => allocated orders

            {

                postData.type = 2;

                postData.sale_status = 1;

            }

            else if (isSingleTrail == 4) // returned qty => Credit Notes

            {

                postData.type = 1;

                postData.only_cn = 1;

            }

        } */



        $scope.prod_warehouse_trail_data = [];

        

        $http

            .post(stock_trail_url, postData)

            .then(function (res) {



                $scope.columns2 = [];

                



                if (res.data.response != null) {

                    $scope.prod_warehouse_trail_data = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {

                        $scope.columns2.push({

                            'title': toTitleCase(index),

                            'field': index,

                            'visible': true

                        });

                    });

                }

            });

        $scope.searchKeyword_2 = {};

        angular.element('#order_trail_modal').modal({ show: true });

    }

    function sumArray(arrayName) {

        arrayName = arrayName.reduce(function (a, b) {

            return a + b;

        });

        return arrayName;

    };



    function findObjectByKey(array, key, value) {

        for (var i = 0; i < array.length; i++) {

            if (array[i][key] === value) {

                return i;

            }

        }

        return null;

    }



    $scope.viewTransferOrderPDF = function()

    {

        if($scope.rec.type == 0)

        {

            $scope.rec.warehouse_from_name = ($scope.rec.warehouse_from != undefined && $scope.rec.warehouse_from.warehouse_id != undefined && Number($scope.rec.warehouse_from.warehouse_id) > 0) ? $scope.rec.warehouse_from.warehouse_name : '';

            $scope.rec.warehouse_from_address_1 = ($scope.rec.warehouse_from != undefined && $scope.rec.warehouse_from.warehouse_id != undefined && Number($scope.rec.warehouse_from.warehouse_id) > 0) ? $scope.rec.warehouse_from.address_1 : '';

            $scope.rec.warehouse_from_address_2 = ($scope.rec.warehouse_from != undefined && $scope.rec.warehouse_from.warehouse_id != undefined && Number($scope.rec.warehouse_from.warehouse_id) > 0) ? $scope.rec.warehouse_from.address_2 : '';

            $scope.rec.warehouse_from_city = ($scope.rec.warehouse_from != undefined && $scope.rec.warehouse_from.warehouse_id != undefined && Number($scope.rec.warehouse_from.warehouse_id) > 0) ? $scope.rec.warehouse_from.city : '';

            $scope.rec.warehouse_from_county = ($scope.rec.warehouse_from != undefined && $scope.rec.warehouse_from.warehouse_id != undefined && Number($scope.rec.warehouse_from.warehouse_id) > 0) ? $scope.rec.warehouse_from.county : '';



            $scope.rec.warehouse_to_name = ($scope.rec.warehouse_to != undefined && $scope.rec.warehouse_to.warehouse_id != undefined && Number($scope.rec.warehouse_to.warehouse_id) > 0) ? $scope.rec.warehouse_to.warehouse_name : '';

            $scope.rec.warehouse_to_address_1 = ($scope.rec.warehouse_to != undefined && $scope.rec.warehouse_to.warehouse_id != undefined && Number($scope.rec.warehouse_to.warehouse_id) > 0) ? $scope.rec.warehouse_to.address_1 : '';

            $scope.rec.warehouse_to_address_2 = ($scope.rec.warehouse_to != undefined && $scope.rec.warehouse_to.warehouse_id != undefined && Number($scope.rec.warehouse_to.warehouse_id) > 0) ? $scope.rec.warehouse_to.address_2 : '';

            $scope.rec.warehouse_to_city = ($scope.rec.warehouse_to != undefined && $scope.rec.warehouse_to.warehouse_id != undefined && Number($scope.rec.warehouse_to.warehouse_id) > 0) ? $scope.rec.warehouse_to.city : '';

            $scope.rec.warehouse_to_county = ($scope.rec.warehouse_to != undefined && $scope.rec.warehouse_to.warehouse_id != undefined && Number($scope.rec.warehouse_to.warehouse_id) > 0) ? $scope.rec.warehouse_to.county : '';

        }

        

        var postUrl = $scope.$root.gl + "chart-accounts/transfer-order-pdf";

        var postData = {};

        postData.token = $scope.$root.token;

        postData.id = $scope.rec.id;



        $http

            .post(postUrl, postData)

            .then(function (res) {

                if (res.data.ack == true) {

                    $scope.rec.pdf_items = res.data.response;

                    $scope.rec.company_details = res.data.company_details;



                    $scope.volume_total = new Array();

                    $scope.weight_total = new Array();

                    $scope.volume = [];

                    $scope.volume_unit = [];

                    $scope.weight = [];

                    $scope.weightunit = [];

                    

                    angular.forEach($scope.rec.pdf_items, function(obj){

                        var item = $filter("filter")($scope.rec.items, { id: obj.transfer_order_detail_id });

                        if(item.length > 0)

                        {

                            

                            obj.item_code       = item[0].item_code;

                            obj.item_name       = item[0].item_name;

                            obj.uom_name        = item[0].uom_name;

                            obj.location_from   = item[0].location_from.location_name;

                            obj.location_to     = item[0].location_to.location_name;



                            $scope.volume.push(Number(obj.volume));

                            $scope.weight.push(Number(obj.weight));



                            $scope.volume_unit.push(obj.volume_unit);

                            $scope.weightunit.push(obj.weightunit);



                            idx2 = findObjectByKey($scope.volume_total, 'volume_unit', obj.volume_unit);

                            if (idx2 == null) {

                                $scope.volume_total.push({ 'volume_unit': obj.volume_unit, 'total_qty': 0 });

                                $scope.volume_total[findObjectByKey($scope.volume_total, 'volume_unit', obj.volume_unit)].total_qty += Number(obj.volume);

                            }

                            else

                                $scope.volume_total[idx2].total_qty += Number(obj.volume);



                            idx3 = findObjectByKey($scope.weight_total, 'weightunit', obj.weightunit);

                            if (idx3 == null) {

                                $scope.weight_total.push({ 'weightunit': obj.weightunit, 'total_qty': 0 });

                                $scope.weight_total[findObjectByKey($scope.weight_total, 'weightunit', obj.weightunit)].total_qty += Number(obj.weight);

                            }

                            else

                                $scope.weight_total[idx3].total_qty += Number(obj.weight);

                        }                        

                    });



                    $scope.volume = res.data.volume;

                    $scope.weight = res.data.weight;

                    $scope.volume_unit = res.data.volume_unit;

                    $scope.weightunit = res.data.weightunit;                    

                    $scope.weight_permission = res.data.weight_permission; 

                    $scope.volume_permission = res.data.volume_permission; 



                    // if($scope.weight_permission >0 || $scope.volume_permission>0)

                    //     $scope.showVolumeWeight = 1;

                    if(($scope.weight_permission >0 && $scope.weight && $scope.weight!=0) || ($scope.volume_permission>0 && $scope.volume && $scope.volume!=0))

                        $scope.showVolumeWeight = 1;



                    /* angular.forEach($scope.print_invoice_vals.doc_details_arr, function (obj1, index1) {

                            obj1.qty = [];

                            obj1.uom_qty = [];

                            obj1.total_pallet_qty = [];

                            obj1.uom_qty_total = new Array();

                            obj1.volume_total = new Array();

                            obj1.weight_total = new Array();



                            





                            angular.forEach(obj1, function (obj, index) {

                                obj1.qty.push(Number(obj.quantity));

                                obj1.uom_qty.push(Number(obj.uom_qty));

                                obj1.total_pallet_qty.push(Number(obj.pallet_qty));



                                



                                idx = findObjectByKey(obj1.uom_qty_total, 'uom', obj.uom);

                                if (idx == null) {

                                    obj1.uom_qty_total.push({ 'uom': obj.uom, 'total_qty': 0 });

                                    obj1.uom_qty_total[findObjectByKey(obj1.uom_qty_total, 'uom', obj.uom)].total_qty += Number(obj.quantity);

                                }

                                else

                                    obj1.uom_qty_total[idx].total_qty += Number(obj.quantity);



                                

                            });



                            obj1.totalQty = sumArray(obj1.qty);

                            obj1.totalUomQty = sumArray(obj1.uom_qty);

                            obj1.sumOfPallets = sumArray(obj1.total_pallet_qty);

                        }); */

                    angular.element('#transferOrderReport2').modal({ show: true });



                }

                else

                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

            });

    }



    $scope.generatePdf = function (reportName) {



        // var targetPdf = angular.element('#trialBalncReportPdf')[0].innerHTML;

		/* var targetPdf = '';

		targetPdf = angular.element('#' + reportName);

		targetPdf = targetPdf[ targetPdf.length-1].innerHTML; */

        var targetPdf = angular.element('#' + reportName)[0].innerHTML;

        var pdfReport = $scope.$root.setup + "general/print-pdf-invoice";

        $rootScope.printinvoiceFlag = false;

        $scope.showLoader = true;

        $scope.generatingPDF = true;



        $http

            .post(pdfReport, { 'dataPdf': targetPdf, 'attachmentsType': 6, 'filename': reportName, token: $scope.$root.token })

            .then(function (res) {

                if (res.data.ack == true) {

                    // console.log('Success');

                    $scope.showLoader = false;

					/* var url = 'app/views/invoice_templates_pdf/' + reportName + '.pdf';

					window.open(url, '_blank'); */

                    // win.focus();

                    $rootScope.printinvoiceFlag = true;

                    toaster.pop('success', 'Info', 'PDF Generated Successfully');

                    // angular.element('#displayPdf').click();

                    document.getElementById('displayPdf').click();

                }

                else {

                    console.log('Fail');

                }

                $scope.generatingPDF = false;

            });

    }

}

