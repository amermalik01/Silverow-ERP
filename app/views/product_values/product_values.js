myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        $stateProvider
            .state('app.item', {
                url: '/item',
                title: 'Inventory',
                templateUrl: helper.basepath('product_values/products_listing.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog")
            })
            .state('app.add-item', {
                url: '/add-item',
                title: 'Inventory',
                templateUrl: helper.basepath('product_values/_form.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'ProductValuesController'
            })
            .state('app.edit-item', {
                url: '/item/:id/edit?isSalesPrice',
                title: 'Inventory',
                templateUrl: helper.basepath('product_values/_form.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'ProductValuesController'
            })
    }]);

myApp.controller('ProductsListingController', ProductsListingController);
ProductsListingController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "ngTableDataService", "$http", "ngDialog", "toaster", "$rootScope", "moduleTracker"];

function ProductsListingController($scope, $filter, ngParams, $resource, ngDataService, $http, ngDialog, toaster, $rootScope, moduleTracker) {
    'use strict';

    moduleTracker.updateName("items");
    moduleTracker.updateRecord("");

    // required for inner references
    $scope.module_id = 32;
    $scope.module_table = 'products';
    $scope.class = 'inline_block';

    $scope.$root.breadcrumbs = [{ 'name': 'Inventory', 'url': '#', 'isActive': false }, { 'name': 'Items', 'url': '#', 'isActive': false }];

    $scope.type_array = {};
    $scope.type_array = [{ 'name': 'Purchase Order', 'id': '1-2' }, { 'name': 'Purchase Invoice', 'id': '1-3' }, { 'name': 'Purchase Return', 'id': '1-1' }, { 'name': 'Sales Order', 'id': '2-2' }, { 'name': 'Sales Invoice', 'id': '2-3' }, { 'name': 'Sales Return', 'id': '2-1' }];

    $scope.arr_by = {};
    $scope.arr_by = [{ 'name': 'Date Received', 'id': '1' }, { 'name': 'Use by Date', 'id': '2' }];

    var vm = this;
    var Api = $scope.$root.stock + "products-listing";

    $scope.rec = {};
    $scope.columns_general = [];
    $scope.general = {};

    $scope.getProduct = function (id, title, show, type_pass, code) {

        $scope.rec.token = $scope.$root.token;
        $scope.rec.product_id = id;

        if (type_pass == 22) {
            $scope.rec.warehouse_id = $scope.rec.warehouse != undefined ? $scope.rec.warehouse.id : '';
            $scope.rec.category_id = $scope.rec.category != undefined ? $scope.rec.category.id : '';
            $scope.rec.type_id = $scope.rec.type != undefined ? $scope.rec.type.id : '';
            $scope.rec.by_id = $scope.rec.by != undefined ? $scope.rec.by.id : '';
            $scope.rec.date_from;
            $scope.rec.date_to;

            if ($scope.rec.by_id != undefined) {
                if ($scope.rec.date_from == '' && $scope.rec.date_to == '')
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Date']));
            }

            if ($scope.rec.date_from && $scope.rec.date_to) {
                if ($scope.rec.by == '')
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Date By']));
            }
        }
        else {
            $scope.rec.warehouse = '';
            $scope.rec.warehouse_id = '';
            $scope.rec.category_id = '';
            $scope.rec.type = '';
            $scope.rec.by = '';
            $scope.rec.type_id = '';
            $scope.rec.by_id = '';
            $scope.rec.date_from = '';
            $scope.rec.date_to = '';
        }

        var postDatastock = $scope.rec;
        $scope.title = title;
        $scope.pcode = code;

        $scope.showLoader = true;

        var stockApi = $scope.$root.stock + "products-listing/stock-sheet";
        $http
            .post(stockApi, postDatastock)
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.columns_general = [];
                    $scope.general = {};

                    $scope.general = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_general.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    if (show == 1)
                        angular.element('#model_status_product').modal({ show: true });
                }
                else {
                    $scope.columns_general = [];
                    $scope.general = [];
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            });
    }

    $scope.getTotalSold = function (int) {
        var totalSold = 0;
        angular.forEach($scope.general, function (el) {
            totalSold = Number(totalSold) + Number(el[int]);
        });
        return totalSold;
    }

    $scope.getTotalRemaining = function (int) {
        var totalRemaining = 0;
        angular.forEach($scope.general, function (el) {
            totalRemaining = Number(totalRemaining) + Number(el[int]);
        });
        return totalRemaining;
    }

    $scope.getStock = function (parm) {
        $scope.rec.token = $scope.$root.token;
        $scope.rec.warehouse_id = $scope.rec.warehouse != undefined ? $scope.rec.warehouse.id : '';
        $scope.rec.category_id = $scope.rec.category != undefined ? $scope.rec.category.id : '';

        if (parm == 'all') {
            $scope.rec = {};
            $scope.rec.token = $scope.$root.token;
        }
        $scope.postData = $scope.rec;
        $scope.$root.$broadcast("myReload");
    }

    $scope.checkAll_list = function (selection_record) {
        var bool = angular.element("#selecctall").is(':checked');

        angular.forEach(selection_record, function (item) {
            angular.element('#selected__del' + item.id).prop('checked', bool);
        });
    }

    $scope.display_report = false;

    $scope.on_change_show = function () {
        var bool = angular.element(".checkshow").is(':checked');
        $scope.display_report = bool;
    }

    $scope.searchKeyword = {};
    $scope.getitem_list = function (item_paging, sort_column, sortform) {
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token

        if (item_paging == 1)
            $scope.item_paging.spage = 1;

        $scope.postData.page = $scope.item_paging.spage;
        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        if ($scope.searchKeyword.brand !== undefined && $scope.searchKeyword.brand !== null)
            $scope.postData.brands = $scope.searchKeyword.brand.id;

        if ($scope.searchKeyword.unit !== undefined && $scope.searchKeyword.unit !== null)
            $scope.postData.units = $scope.searchKeyword.unit.id;

        if ($scope.searchKeyword.cat_type !== undefined && $scope.searchKeyword.cat_type !== null)
            $scope.postData.cat_types = $scope.searchKeyword.cat_type.id;

        if ($scope.searchKeyword.status !== undefined && $scope.searchKeyword.status !== null)
            $scope.postData.filter_status = $scope.searchKeyword.status.id;

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
            $rootScope.save_single_value($rootScope.sort_column, 'product_sort_name');
        }

        $scope.showLoader = true;
        $http
            .post(Api, $scope.postData)
            .then(function (res) {

                $scope.tableData = res;
                $scope.columns = [];
                $scope.record_data = {};
                if (res.data.ack == true) {
                    $scope.showLoader = false;
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record;
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
                else
                    $scope.showLoader = false;
            });
    }

    var col = '';
    col = $rootScope.get_single_value('product_sort_name');
    // $scope.getitem_list(1, col, 'Desc');
    $scope.$root.itemselectPage(1);

    $scope.product_status_list = [];
    // $rootScope.get_status_list('product_status');
    // $scope.product_status_list = $rootScope.status_list;

    $scope.product_status_list = [{
        'id': '1',
        'title': 'Active'
    }, {
        'id': '0',
        'title': 'Inactive'
    }];
}

myApp.controller('ProductValuesController', ProductValuesController);
function ProductValuesController($scope, $stateParams, $http, $state, $timeout, $resource, toaster, $filter, $window, ngDialog, $rootScope, moduleTracker) {
    'use strict';

    moduleTracker.updateName("items");
    moduleTracker.updateRecord($stateParams.id);

    $scope.recnew = 0;

    if ($stateParams.id > 0) {
        $scope.check_item_readonly = true;
        $scope.check_add_modal_readonly = true;
        $scope.recnew = $stateParams.id;
    }
    else {
        // Delete button fix.
        $scope.hideDelete = true;
    }

    // //$rootScope.updateSelectedGlobalData('item');
    $rootScope.getInventorySetupGlobalData(0);


    $scope.itemAdditionalDetail = [];

    if ($scope.itemAdditionalDetail.length == 0) {
        $scope.itemAdditionalDetail.push({
            value: ''
        });
    }

    $scope.setNewField = function () {
        if ($scope.itemAdditionalDetail.length == 5) return;
        $scope.itemAdditionalDetail.push({
            value: ''
        });
    }
    $scope.deleteField = function (index) {
        $scope.itemAdditionalDetail.splice(index, 1);
    }

    $scope.showEditForm = function () {
        $scope.check_item_readonly = false;
        $scope.warehouse_loc_add_cost_FormShow = false;
        $scope.prod_warehouse_loc_add_cost_buttons_Show = false;
        $scope.warehouse_loc_add_cost_List_Show = true;
    }

    $scope.showAddModalEditForm = function () {
        $scope.check_add_modal_readonly = false;
    }

    if ($stateParams.isSalesPrice != undefined) {
        $scope.isSalesPrice = 1;
        $timeout(function () {
            $scope.generalInformation(isSalesPrice);
        }, 4000);
    }
    else
        $scope.isSalesPrice = 0;

    $scope.showEditForm_detail = function () {
        $scope.check_item_detail_readonly = false;
    }

    /* $scope.tbl_records = {
            'headers': {
                'top_header': ['Item', 'Description', 'UOM', 'StdPrice', 'priceoffer', 'lCY', 'Min', 'Max'],
                'inner_header': ['Min', 'Discount', 'Price', 'actualDiscount', 'priceOfferLCY'],
            },
            'data': []
        }; */
    var vm = this;
    $scope.class = 'inline_block';
    $scope.btnCancelUrl = 'app.item';

    $scope.formData = {};
    $scope.formData1 = {};
    $scope.formData2 = {};
    $scope.formData3 = {};
    $scope.formData4 = {};
    $scope.formData5 = {};
    $scope.formData6 = {};

    $scope.costing_method = [];
    $scope.costing_method = [{ 'label': 'First In First Out (FIFO)', 'id': 1 }, { 'label': 'Standard', 'id': 3 }];
    // $scope.costing_method = [{ 'label': 'First In First Out (FIFO)', 'id': 1 }, { 'label': 'Moving Average', 'id': 2 }, { 'label': 'Standard', 'id': 3 }];
    // {  'label': 'Last in First Out (LIFO)', 'id': 3    }, {'label': 'Specific', 'id': 5} 

    $scope.unit_measures_category_record = { 'table_headers': ['UOM', 'quantity', 'refUOM', 'ref_quantity'], 'data': [] };

    $scope.updateBrandList = function (category) {
        $scope.brandarray = [];
        $scope.selCatarray = [];
        $scope.formData.brand_id = '';
        if (category.brands != 0) {
            angular.forEach($rootScope.brand_prodcut_arr, function (obj2) {

                angular.forEach(category.brands, function (val) {
                    if (obj2.id == val.brandID) {
                        $scope.brandarray.push(obj2);//$rootScope.brand_prodcut_arr[index2]
                    }
                });
            });
        }
    }


    $scope.chkForBrand = function (brand) {

        if (brand > 0) {

            $scope.prevProductCode = '';
            $scope.prevBrandID = 0;

            var chkForBrandUrl = $scope.$root.stock + "products-listing/chk-for-brand";

            $http
                .post(chkForBrandUrl, { 'token': $scope.$root.token, 'product_id': $stateParams.id, 'brand': brand })
                .then(function (res) {

                    if (res.data.ack == 1) {

                        var moduleType = res.data.moduleType;
                        $scope.prevProductCode = res.data.prevProductCode;
                        $scope.prevBrandID = res.data.prevBrandID;

                        if (moduleType == 1) {
                            $scope.product_type = false;
                            $scope.itemModuleCode = 'external';
                            $scope.formData.product_code = '';
                        }
                        else {
                            $scope.product_type = true;
                            $scope.itemModuleCode = 'internal';
                            $scope.formData.product_code = '';
                            // toaster.pop('warning', 'Info', 'Item No. is ma');
                        }

                        if ($scope.prevBrandID > 0 && $scope.prevBrandID == brand) {
                            $scope.formData.product_code = $scope.prevProductCode;
                        }
                    }
                    /* else {
                        toaster.pop('error', 'Error', res.data.error);
                        return false;
                    } */
                });
        }
    }

    $scope.status_data = [];

    $scope.status_data = [{
        'id': '1',
        'title': 'Active'
    }, {
        'id': '0',
        'title': 'Inactive'
    }];


    // $rootScope.get_status_list('product_status');

    // if ($scope.status_data === 'undefined' || $scope.status_data === null || $scope.status_data.length == 0)
    //     $scope.status_data = $rootScope.status_list;

    if ($stateParams.id === undefined) {

        $scope.formData.prd_country_origin = $scope.$root.get_obj_frm_arry($scope.$root.country_type_arr, $scope.$root.defaultCountry);

        $scope.formData.arr_status = [{
            'id': '1',
            'title': 'Active'
        }, {
            'id': '0',
            'title': 'Inactive'
        }];
        $scope.formData.status = $scope.formData.arr_status[0];
    }
    // $scope.formData.status = $scope.status_data[0];

    $scope.product_type = true;
    $scope.count_result = 0;

    $scope.getCode = function (rec) {

        var name = $scope.$root.base64_encode('product');
        var no = $scope.$root.base64_encode('product_no');
        var module_category_id = 2;

        if ($scope.formData.brand_ids != 0)
            module_category_id = 1;

        if ($scope.formData.brand_ids == 0) {
            if ($scope.formData.category_ids != 0)
                module_category_id = 3;
        }

        var getCodeUrl = $scope.$root.stock + "products-listing/get-code";

        $http
            .post(getCodeUrl, {
                'is_increment': 1,
                'token': $scope.$root.token,
                'tb': name,
                'm_id': 90,
                'no': no,
                'category': $scope.formData.category_ids,
                'brand': $scope.formData.brand_ids,
                'module_category_id': module_category_id
            })
            .then(function (res) {
                if (res.data.ack == 1) {
                    $scope.formData.product_code = res.data.code;
                    // $scope.formData.product_no = res.data.nubmer;
                    /* $scope.formData.code_type = module_category_id;

                    if (res.data.type == 1) {
                        $scope.product_type = false;
                    }
                    else {
                        $scope.product_type = true;
                    }

                    $scope.count_result++;

                    if ($scope.count_result > 0) {
                        console.log($scope.count_result);
                        return true;
                    }
                    else {
                        console.log($scope.count_result + 'd');
                        return false;
                    } */
                }
                else toaster.pop('error', 'Error', res.data.error);
            });
        //return;
    }
    $scope.lowStock = false;
    $scope.generate_unique_id = function (rec) {

        var getUrl = $scope.$root.stock + "products-listing/get-unique-id";
        $scope.showLoader = true;
        $http
            .post(getUrl, { 'token': $scope.$root.token })
            .then(function (res) {

                if (res.data.ack == 1) {
                    $scope.formData.product_unique_id = res.data.product_unique_id;
                    $scope.formData.id = res.data.id;
                    $scope.formData.product_id = res.data.id;
                    $scope.showLoader = false;
                    $scope.itemModuleCode = res.data.moduleCodeData;
                }
                else {
                    toaster.pop('error', 'Error', res.data.error);
                    return false;
                }
            });
    }


    //--------------------- start General   ------------------------------------------

    $scope.$root.breadcrumbs = [{ 'name': 'Inventory', 'url': '#', 'isActive': false }, { 'name': 'Items', 'url': 'app.item', 'isActive': false }];

    $scope.$root.model_code = '';

    $scope.get_product_data_by_id = function () {

        $scope.showLoader = true;
        $scope.disable_unit_check = false;

        var DetailsURL = $scope.$root.stock + "products-listing/get-product-by-id";

        $http
            .post(DetailsURL, { 'token': $scope.$root.token, 'product_id': $stateParams.id })
            .then(function (res) {

                $scope.itemAdditionalDetail = [];

                if (res.data.ack == true) {
                    moduleTracker.updateRecordName(res.data.response.description);
                    $scope.formData = {};
                    $scope.formData = res.data.response;
                    $scope.first_array = res.data.response;

                    if (res.data.response.itemAdditionalDetail1_value && res.data.response.itemAdditionalDetail1_value.length > 0)
                        $scope.itemAdditionalDetail.push({ value: res.data.response.itemAdditionalDetail1_value });

                    if (res.data.response.itemAdditionalDetail2_value && res.data.response.itemAdditionalDetail2_value.length > 0)
                        $scope.itemAdditionalDetail.push({ value: res.data.response.itemAdditionalDetail2_value });

                    if (res.data.response.itemAdditionalDetail3_value && res.data.response.itemAdditionalDetail3_value.length > 0)
                        $scope.itemAdditionalDetail.push({ value: res.data.response.itemAdditionalDetail3_value });

                    if (res.data.response.itemAdditionalDetail4_value && res.data.response.itemAdditionalDetail4_value.length > 0)
                        $scope.itemAdditionalDetail.push({ value: res.data.response.itemAdditionalDetail4_value });

                    if (res.data.response.itemAdditionalDetail5_value && res.data.response.itemAdditionalDetail5_value.length > 0)
                        $scope.itemAdditionalDetail.push({ value: res.data.response.itemAdditionalDetail5_value });


                    if ($scope.itemAdditionalDetail.length == 0) {
                        $scope.itemAdditionalDetail.push({
                            value: ''
                        });
                    }

                    $scope.check_item_readonly = true;
                    if ($scope.formData.unit_id != 0)
                        $scope.disable_unit_check = true;
                    else
                        $scope.disable_unit_check = false;

                    // $scope.$root.model_code = res.data.response.description + '( ' + res.data.response.product_code + ' )';
                    $rootScope.model_code = res.data.response.description + '( ' + res.data.response.product_code + ' )';
                    // $scope.module_code = $scope.$root.model_code;
                    $scope.module_code = $rootScope.model_code;

                    $scope.selectedsubitems = "";
                    var selectedsubitems_name = "";
                    $scope.selectedSubItemsArr = [];
                    $scope.selectedRecFromModalsItem = [];
                    angular.forEach(res.data.response.substituteProducts, function (subItems) {
                        //console.log(subItems);
                        $scope.selectedRecFromModalsItem.push({ key: subItems.id, value: subItems.product_code, record: subItems })
                        selectedsubitems_name += subItems.description + "(" + subItems.product_code + ");  ";
                        $scope.selectedSubItemsArr.push(subItems);
                    });

                    // Raw Material End Product List

                    $scope.selectedRawMaterialItemsArr = [];
                    $scope.selectedRecFromModalsEndItem = [];

                    angular.forEach(res.data.response.rawMaterialEndProducts, function (endItems) {
                        endItems.product_name = endItems.description;
                        endItems.product_id = endItems.finished_item_id;
                        endItems.category = endItems.category_name;
                        // endItems.uom = endItems.unit_name;
                        endItems.raw_material_qty = Number(endItems.raw_material_qty);

                        if ($scope.formData.unit_name)
                            endItems.rawMaterialItemUom = $scope.formData.unit_name;
                        // endItems.raw_material_product_id = endItems.id;

                        // $scope.selectedRecFromModalsEndItem.push(endItems);

                        endItems.uom = endItems.unit_name;

                        // if(endItems.unit_name)
                        //     endItems.rawMaterialItemUom = endItems.unit_name;

                        if (endItems.arr_units) {

                            if (endItems.arr_units.response)
                                endItems.arr_units = endItems.arr_units.response;
                            else
                                endItems.arr_units = '';

                            /* if (endItems.arr_units.length[0])
                                endItems.units = endItems.arr_units[0];
                            else
                                endItems.units = ''; */

                            angular.forEach(endItems.arr_units, function (obj) {
                                if (obj.name == endItems.uom)
                                    endItems.units = obj;
                            });
                        }
                        else {
                            endItems.arr_units = '';
                            endItems.units = '';
                        }

                        $scope.selectedRawMaterialItemsArr.push(endItems);
                        $scope.selectedRecFromModalsEndItem.push({ key: endItems.finished_item_id, value: endItems.product_code, record: endItems });
                    });

                    $scope.selectedsubitems = selectedsubitems_name.substring(0, selectedsubitems_name.length - 2);

                    if ($rootScope.breadcrumbs.length == 2) {
                        $rootScope.breadcrumbs.push({ 'name': $rootScope.model_code, 'url': '#', 'isActive': false });
                    }

                    /* if ($scope.formData.warehouseCount > 0){
                        $scope.formData.stock_check = 1;
                    } */

                    if ($scope.formData.stock_check > 0) {
                        // $scope.check_item_readonly = false;
                        $scope.formData.stock_check = true;

                        // angular.element('#stock_check').click();

                        // $timeout(function () {
                        //     $scope.check_item_readonly = true;
                        // }, 1000);
                    }
                    // else
                    //     $scope.check_item_readonly = true;

                    // $scope.formRec.rawMaterialProduct = $scope.formData.rawMaterialProduct = res.data.rawMaterialProduct;

                    if ($scope.formData.rawMaterialProduct > 0) {
                        $scope.formData.rawMaterialProduct = true;
                    }

                    $scope.formData.raw_material_gl_id = res.data.response.raw_material_gl_id;

                    if ($scope.formData.raw_material_gl_id > 0) {
                        $scope.formData.raw_material_gl_codes = res.data.response.raw_material_gl_code;
                        $scope.formData.raw_material_gl_name = res.data.response.raw_material_gl_name;
                        $scope.formData.raw_material_gl = res.data.response.raw_material_gl_code + " - " + res.data.response.raw_material_gl_name;
                    }

                    /* if ($scope.rec.primary_is_billing_address == 1)
                        $scope.rec.is_billing_address = true;
                    else
                        $scope.rec.is_billing_address = false; */

                    // $scope.$root.product_id = res.data.response.id;
                    $rootScope.product_id = res.data.response.id;
                    $scope.formData.product_id = res.data.response.id;

                    $rootScope.product_no = res.data.response.product_no;
                    $scope.formData.sale_unit_cost = $scope.formData.standard_price;
                    $scope.formData.sale_selling_price = $scope.formData.standard_price;
                    $scope.sale_unit_cost = $scope.formData.standard_price;
                    $scope.formData.ChangedOn = res.data.response.ChangedOn;

                    // low stock flag

                    if ($scope.formData.available_stock <= $scope.formData.reorder_quantity && $scope.formData.reorder_quantity != '' && $scope.formData.reorder_quantity != null && $scope.formData.reorder_quantity != 0) {
                        $scope.lowStock = true;
                    } else {
                        $scope.lowStock = false;
                    }

                    if (res.data.response.category_id > 0) {
                        angular.forEach($rootScope.cat_prodcut_arr, function (obj) {
                            if (res.data.response.category_id) {
                                if (obj.id == res.data.response.category_id) {
                                    $scope.formData.category_id = obj;
                                }
                            }
                        });

                        $scope.brandarray = [];
                        $scope.selCatarray = [];

                        if ($scope.formData.category_id.brands != 0) {
                            angular.forEach($rootScope.brand_prodcut_arr, function (obj2) {

                                angular.forEach($scope.formData.category_id.brands, function (obj) {

                                    if (obj2.id == obj.brandID) {
                                        $scope.brandarray.push(obj2);
                                    }
                                });
                            });
                            angular.forEach($scope.brandarray, function (obj) {
                                if (res.data.response.brand_id) {
                                    if (obj.id == res.data.response.brand_id) {
                                        $scope.formData.brand_id = obj;
                                    }
                                }
                            });
                        }
                    }

                    angular.forEach($rootScope.uni_prooduct_arr, function (obj) {
                        if (res.data.response.unit_id) {
                            if (obj.id == res.data.response.unit_id)
                                $scope.formData.unit_id = obj;
                        }
                    });

                    angular.forEach($scope.status_data, function (obj) {
                        if (obj.id == res.data.response.status)
                            $scope.formData.status = obj;
                    });

                    if (res.data.response.vat_rate_id) {
                        angular.forEach($rootScope.arr_vat, function (obj) {

                            if (obj.id == res.data.response.vat_rate_id)
                                $scope.formData.vat_rate_id = obj;
                        });
                    }

                    if (res.data.response.prd_country_origin > 0) {
                        angular.forEach($rootScope.country_type_arr, function (obj) {
                            if (obj.id == res.data.response.prd_country_origin)
                                $scope.formData.prd_country_origin = obj;
                        });
                    }
                    else {
                        angular.forEach($rootScope.country_type_arr, function (obj) {
                            if (obj.id == $rootScope.defaultCountry)
                                $scope.formData.prd_country_origin = obj;
                        });
                    }

                    if (res.data.response.reorder_quantity != 0)
                        $scope.formData.reorder_quantity = Number(res.data.response.reorder_quantity);
                    else
                        $scope.formData.reorder_quantity = '';

                    if (res.data.response.max_quantity != 0)
                        $scope.formData.max_quantity = Number(res.data.response.max_quantity);
                    else
                        $scope.formData.max_quantity = '';

                    if (res.data.response.min_quantity != 0)
                        $scope.formData.min_quantity = Number(res.data.response.min_quantity);
                    else
                        $scope.formData.min_quantity = '';

                    if (res.data.response.avg_cost_sdate == 0)
                        $scope.formData.avg_cost_sdate = null;
                    else
                        $scope.formData.avg_cost_sdate = res.data.response.avg_cost_sdate;

                    if (res.data.response.avg_cost_edate == 0)
                        $scope.formData.avg_cost_edate = null;
                    else
                        $scope.formData.avg_cost_edate = res.data.response.avg_cost_edate;

                    $scope.formData.purchase_price = $rootScope.number_format($scope.formData.standard_price, $scope.decimal_range);

                    $scope.showdatac = false;

                    if (res.data.response.uom_setup_status > 0)
                        $scope.showdatac = true;
                }
                $scope.showLoader = false;
                // $scope.getItemSalesInfo();
                $scope.get_setup_unit_data($scope.formData.unit_id.id);
            });
    }


    $scope.showdatac = false;

    if ($stateParams.id !== undefined)
        $scope.get_product_data_by_id();


    $scope.generalInformation = function (flg) {
        // $scope.$root.breadcrumbs[3].name = 'General';
        $scope.get_product_data_by_id(flg);
    }

    /* $scope.handleKeyPress = function( ev ){
        if (ev.key == " ") 
        $scope.get_all_substitute_product();   
    } */

    // $scope.items = [];

    $scope.searchKeywordItem = {};
    $scope.searchKeywordEndItem = {};
    $scope.selectedRecFromModalsItem = [];
    $scope.selectedRecFromModalsEndItem = [];
    $scope.itemModalCond = '';

    $scope.moduleType = '';
    $scope.clearAndSearchItems = function (arg) {

        // $scope.selectedRecFromModalsItem = [];
        $scope.itemModalCond = arg;

        if ($scope.itemModalCond == 'endItems') {
            $scope.searchKeywordEndItem = {};
        } else {
            $scope.searchKeywordItem = {};
        }

        $scope.selectItem();
    }

    $scope.selectItem = function (item_paging, sort_column, sortform) {

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.moduleType = 'ItemDetail';

        $scope.tempProdArr = [];
        $scope.tempProdArr2 = []
        $scope.tempProdArr2.response = [];

        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        if ($scope.itemModalCond == 'endItems') {
            $scope.postData.searchKeyword = $scope.searchKeywordEndItem;

            $scope.postData.subsituteItemID = $stateParams.id;
            $scope.postData.itemModalCond = $scope.itemModalCond;

            if ($scope.postData.pagination_limits == -1) {
                $scope.postData.page = -1;
                $scope.searchKeywordEndItem = {};
                $scope.record_data = {};
            }
        } else {
            $scope.postData.searchKeyword = $scope.searchKeywordItem;

            $scope.postData.subsituteItemID = $stateParams.id;

            if ($scope.postData.pagination_limits == -1) {
                $scope.postData.page = -1;
                $scope.searchKeywordItem = {};
                $scope.record_data = {};
            }
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

        $scope.postData.cond = 'Detail';
        var itemListingApi = $scope.$root.stock + "products-listing/item-popup";

        $scope.showLoader = true;
        $http
            .post(itemListingApi, $scope.postData)
            .then(function (res) {
                $scope.tableData = res;
                $scope.columns = [];
                $scope.record_data = {};
                $scope.recordArray = [];
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
                    $scope.tempProdArr = res.data;

                    angular.forEach($scope.tempProdArr, function (value, key) {
                        if (key != "tbl_meta_data") {
                            $scope.recordArray.push(value);
                        }
                    });

                    if ($scope.tempProdArr.response)
                        angular.element('#productModal').modal({ show: true });

                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            });
    }

    $scope.clearPendingPurchaseItems = function () {
        $scope.PendingSelectedPurchaseItems = [];
        $scope.PendingSelectedItems = [];
        $scope.itemModalCond = '';
        angular.element('#productModal').modal('hide');
    }

    $scope.addProduct = function () {

        $scope.items_array = [];
        $scope.showPostBtn = true;
        $scope.PendingSelectedPurchaseItems = [];
        $scope.PendingSelectedItems = [];
        $scope.selectedSubItemsArr = [];
        // $scope.selectedRawMaterialItemsArr = [];
        angular.copy($scope.tempProdArr.response, $scope.items_array);

        $scope.selectedsubitems = "";
        var selectedsubitems_name = "";

        if ($scope.itemModalCond == 'endItems') {

            angular.forEach($scope.selectedRecFromModalsEndItem, function (data, key) {
                var resRec = data.record;
                if (resRec) {

                    var item2 = $filter("filter")($scope.selectedRawMaterialItemsArr, { finished_item_id: resRec.finished_item_id });
                    var idx2 = $scope.selectedRawMaterialItemsArr.indexOf(item2[0]);

                    // console.log(idx2);

                    if (idx2 == -1) {

                        var prodData = resRec;
                        // console.log(resRec);

                        prodData.product_name = prodData.description;
                        prodData.product_id = prodData.id;
                        prodData.finished_item_id = prodData.id;
                        prodData.category = prodData.category_name;
                        // prodData.uom = prodData.unit_name;
                        prodData.raw_material_qty = 0;
                        prodData.id = 0;

                        if ($scope.formData.unit_name)
                            prodData.rawMaterialItemUom = $scope.formData.unit_name;

                        if (prodData.arr_units) {

                            if (prodData.arr_units.response)
                                prodData.arr_units = prodData.arr_units.response;
                            else
                                prodData.arr_units = '';

                            if (prodData.arr_units[0])
                                prodData.units = prodData.arr_units[0];
                            else
                                prodData.units = '';
                        }
                        else {
                            prodData.arr_units = '';
                            prodData.units = '';
                        }

                        // prodData.item_id = $stateParams.id;
                        $scope.selectedRawMaterialItemsArr.push(prodData);
                    }
                }
            });

            var itemUnitOfMeasureApi = $scope.$root.stock + "products-listing/get-item-unit-of-measure";
            $scope.postData.items = $scope.selectedRawMaterialItemsArr;

            $scope.showLoader = true;
            $http
                .post(itemUnitOfMeasureApi, $scope.postData)
                .then(function (res) {
                    $scope.showLoader = false;

                    if (res.data.ack == true) {

                        console.log(res.data.response);
                        console.log($scope.selectedRawMaterialItemsArr);

                        angular.forEach(res.data.response, function (obj) {

                            var item = $filter("filter")($scope.selectedRawMaterialItemsArr, { product_id: obj.product_id });//product_id

                            var idx = $scope.selectedRawMaterialItemsArr.indexOf(item[0]);
                            if (idx != -1) {
                                $scope.selectedRawMaterialItemsArr[idx].arr_units = obj.arr_units.response;

                                if ($scope.selectedRawMaterialItemsArr[idx].units) {
                                    angular.forEach($scope.selectedRawMaterialItemsArr[idx].arr_units, function (obj) {
                                        if (obj.name == $scope.selectedRawMaterialItemsArr[idx].uom)
                                            $scope.selectedRawMaterialItemsArr[idx].units = obj;
                                    });

                                    /* angular.forEach($scope.selectedRawMaterialItemsArr[idx].arr_units, function (obj2) {
                                        if(obj2.id == obj.units){

                                        }

                                    }); */
                                }

                            }

                        });

                    }
                    else {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                    }
                });
        }
        else {
            angular.forEach($scope.selectedRecFromModalsItem, function (data, key) {
                var resRec = data.record;
                if (resRec) {
                    var prodData = resRec;

                    selectedsubitems_name += prodData.description + "(" + prodData.product_code + "); ";

                    $scope.selectedsubitems = selectedsubitems_name.substring(0, selectedsubitems_name.length - 2);

                    $scope.PendingSelectedPurchaseItems.push(prodData);
                    $scope.PendingSelectedItems.push(prodData);

                    prodData.product_name = prodData.description;
                    prodData.product_id = prodData.id;
                    prodData.substitute_product_id = prodData.id;

                    $scope.selectedSubItemsArr.push(prodData);
                }
            });
        }
        angular.element('#productModal').modal('hide');
    }

    /* $scope.get_all_substitute_product = function () {

        $scope.tempProdArr = [];
        $scope.filterSubstituteItem = {};

        angular.forEach($rootScope.prooduct_arr, function (obj2) {
            obj2.chk = false;

            angular.forEach($scope.selectedSubItemsArr, function (obj) {

                if (obj.substitute_product_id == obj2.id)
                    obj2.chk = true;
            });

            if (obj2.id != $stateParams.id)
                $scope.tempProdArr.push(obj2);
        });

        angular.element('#itemSubstituteModal').modal({ show: true });
    } */

    /* $scope.PendingSelectedSubItems = [];

    $scope.checkedSubstituteItem = function (priceitem) {
        $scope.selectedAllSubstituteItem = false;

        for (var i = 0; i < $rootScope.prooduct_arr.length; i++) {
            if (priceitem == $rootScope.prooduct_arr[i].id) {
                if ($rootScope.prooduct_arr[i].chk == true)
                    $rootScope.prooduct_arr[i].chk = false;
                else
                    $rootScope.prooduct_arr[i].chk = true;
            }
        }
    }

    $scope.checkAllSubstituteItem = function (val, category, brand, unit) {
        var selection_filter = $filter('filter');
        var filtered = selection_filter($scope.tempProdArr, $scope.filterSubstituteItem.search);
        var filtered2 = selection_filter(filtered, category);
        var filtered3 = selection_filter(filtered2, brand);
        var filtered4 = selection_filter(filtered3, unit);
        $scope.PendingSelectedSubItems = [];

        if (val == true) {
            angular.forEach(filtered4, function (obj) {
                obj.chk = false;
                if (category != undefined && category == obj.category_id && brand != undefined && brand == obj.brand_id && unit != undefined && unit == obj.unit_id) {
                    obj.chk = true;
                }
                else if (category != undefined && category == obj.category_id && brand != undefined && brand == obj.brand_id) {
                    obj.chk = true;
                }
                else if (category != undefined && category == obj.category_id && unit != undefined && unit == obj.unit_id) {
                    obj.chk = true;
                }
                else if (brand != undefined && brand == obj.brand_id && unit != undefined && unit == obj.unit_id) {
                    obj.chk = true;
                }
                else if (category != undefined && category == obj.category_id) {
                    obj.chk = true;
                }
                else if (brand != undefined && brand == obj.brand_id) {
                    obj.chk = true;
                }
                else if (unit != undefined && unit == obj.unit_id) {
                    obj.chk = true;
                }
                else if (category == undefined && brand == undefined && unit == undefined) {
                    obj.chk = true;
                }
                $scope.PendingSelectedSubItems.push(obj);
            });
        } else {
            angular.forEach($scope.tempProdArr, function (obj) {
                if (!obj.disableCheck)
                    obj.chk = false;
            });
            $scope.PendingSelectedSubItems = [];
        }
    }

    $scope.clearPendingSubstituteItems = function () {
        $scope.PendingSelectedSubItems = [];
        angular.element('#itemSubstituteModal').modal('hide');
    }

    $scope.addPendingSubstituteItems = function () {
        $scope.selectedSubItemsArr = [];
        $scope.PendingSelectedSubItems = [];

        $scope.selectedsubitems = "";
        var selectedsubitems_name = "";

        angular.forEach($rootScope.prooduct_arr, function (obj) {
            if (obj.chk == true) {
                $scope.substitueobj = {};
                $scope.substitueobj.description = obj.description;
                $scope.substitueobj.product_id = $scope.formData.product_id;
                $scope.substitueobj.rec_id = obj.id;
                $scope.substitueobj.substitute_product_id = obj.id;
                $scope.substitueobj.product_code = obj.product_code;
                $scope.PendingSelectedSubItems.push($scope.substitueobj);
                selectedsubitems_name += obj.description + "(" + obj.product_code + "); ";
            }
        });

        $scope.selectedsubitems = selectedsubitems_name.substring(0, selectedsubitems_name.length - 2);
        $scope.selectedSubItemsArr = $scope.PendingSelectedSubItems;
        angular.element('#itemSubstituteModal').modal('hide');
    }
    */

    $scope.addGeneral = function (formData) {

        var updateUrl = $scope.$root.stock + "products-listing/add-product";
        var var_msg = 'Add';
        var var_error = 'Inserted .';

        if ($scope.formData.id !== undefined)
            updateUrl = $scope.$root.stock + "products-listing/update-product";

        if (parseFloat($scope.formData.min_quantity) > parseFloat($scope.formData.max_quantity)) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(321, ['Minimum Order', 'Maximum Order']));
            return;
        }

        $scope.counter_detail = 0;
        $scope.formData.token = $scope.$root.token;
        $scope.formData.category_ids = $scope.formData.category_id !== undefined ? $scope.formData.category_id.id : 0;
        $scope.formData.brand_ids = $scope.formData.brand_id !== undefined ? $scope.formData.brand_id.id : 0;
        $scope.formData.unit_ids = $scope.formData.unit_id !== undefined ? $scope.formData.unit_id.id : 0;
        $scope.formData.statuss = $scope.formData.status !== undefined ? $scope.formData.status.id : 0;
        $scope.formData.substituteItems = $scope.selectedSubItemsArr;
        $scope.formData.locations = $scope.formData.location !== undefined ? $scope.formData.location.id : 0;

        if (angular.element('#stock_check').is(':checked') == false) {
            $scope.formData.stock_checks = 0;
            $scope.formData.stock_check = 0;
        }

        /* if (angular.element('#rawMaterialProduct').is(':checked') == false) {
            $scope.formData.rawMaterialProduct = 0;
        } */

        if (angular.element('#rawMaterialProduct').is(':checked') == false)
            $scope.formData.rawMaterialProduct = 0;

        if (this.formData.prd_country_origin != undefined)
            $scope.formData.prd_country_origins = $scope.formData.prd_country_origin !== undefined ? $scope.formData.prd_country_origin.id : 0;

        if ($scope.formData.vat_rate_id != null)
            $scope.formData.vat_rate_ids = $scope.formData.vat_rate_id !== undefined ? $scope.formData.vat_rate_id.id : 0;

        $scope.formData.reoder_point_unit_ids = $scope.formData.reoder_point_unit_id != undefined ? $scope.formData.reoder_point_unit_id.id : 0;
        $scope.formData.min_order_unit_ids = $scope.formData.min_order_unit_id != undefined ? $scope.formData.min_order_unit_id.id : 0;
        $scope.formData.max_order_unit_ids = $scope.formData.max_order_unit_id != undefined ? $scope.formData.max_order_unit_id.id : 0;

        if ($scope.formData.unit_ids == 0 || $scope.formData.unit_ids == undefined) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Base U.O.M']));
            return;
        }

        if ($scope.formData.vat_rate_ids == 0 || $scope.formData.vat_rate_ids == undefined) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['VAT Rate']));
            return;
        }

        var name = $scope.$root.base64_encode('product');
        var no = $scope.$root.base64_encode('product_no');

        var module_category_id = 2;

        if ($scope.formData.brand_ids != 0)
            module_category_id = 1;

        if ($scope.formData.brand_ids == 0) {
            if ($scope.formData.category_ids != 0)
                module_category_id = 3;
        }

        if ($scope.itemAdditionalDetail[0].value)
            $scope.formData.itemAdditionalDetail = $scope.itemAdditionalDetail;

        var getCodeUrl = $scope.$root.stock + "products-listing/get-code";

        // $where_code_number = $attr['module_category_id'];

        /* $http
            .post(getCodeUrl, {
                'is_increment': 1,
                'token': $scope.$root.token,
                'tb': name,
                'm_id': 90,
                'no': no,
                'category': $scope.formData.category_ids,
                'brand': $scope.formData.brand_ids,
                'module_category_id': module_category_id
            })
            .then(function (res) {

                if (res.data.ack == 1) {

                    if (res.data.code != null)
                        $scope.formData.product_code = res.data.code; */


        // $scope.formData.product_no = res.data.nubmer;
        // $scope.formData.code_type = res.data.code_type;
        // $scope.formData.code_internal_external = res.data.code_internal_external;

        $scope.formData.code_type = module_category_id;
        $scope.formData.code_internal_external = 0;

        /* if (res.data.type == 1)
            $scope.product_type = false;
        else
            $scope.product_type = true; */

        // if ($scope.formData.product_code != undefined) 
        {
            $http
                .post(updateUrl, $scope.formData)
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.$root.product_id = res.data.id;
                        toaster.pop('success', var_msg, 'Record ' + var_error);

                        if (res.data.id > 0) {
                            $scope.check_item_readonly = true;
                            $scope.recnew = res.data.id;

                            $stateParams.id = res.data.id;
                        }

                        if ($stateParams.id !== undefined)
                            $scope.get_product_data_by_id();

                        //$rootScope.updateSelectedGlobalData('item');
                        $state.go("app.edit-item", {
                            id: $scope.$root.product_id
                        });
                    } else toaster.pop('error', var_msg, res.data.error);
                });
        }
        // else
        //     toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Product Code']));
        /* }
            else
                toaster.pop('error', 'Error', res.data.error);
        }); */
    }

    $scope.updateGeneral = function (formData) {

        var updateUrl = $scope.$root.stock + "products-listing/update-product";
        var var_msg = 'Edit';
        var var_error = 'updated successfully';

        if (parseFloat($scope.formData.min_quantity) > parseFloat($scope.formData.max_quantity)) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(321, ['Minimum Order', 'Maximum Order']));
            return;
        }

        if ($scope.formData.status == undefined || $scope.formData.status == null || $scope.formData.status == '' || $scope.formData.status == 0) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Status']));
            return;
        }

        $scope.formData.token = $scope.$root.token;

        // console.log($scope.itemAdditionalDetail);

        if ($scope.itemAdditionalDetail[0].value)
            $scope.formData.itemAdditionalDetail = $scope.itemAdditionalDetail;

        /* angular.forEach($scope.itemAdditionalDetail,function(obj,idx){
            if(obj.value.length>0)
                $scope.formData.name = obj.value;

        }); */

        $scope.formData.category_ids = ($scope.formData.category_id != undefined && $scope.formData.category_id != null) ? $scope.formData.category_id.id : 0;
        $scope.formData.brand_ids = ($scope.formData.brand_id != undefined && $scope.formData.brand_id != null) ? $scope.formData.brand_id.id : 0;
        $scope.formData.unit_ids = ($scope.formData.unit_id != undefined && $scope.formData.unit_id != null) ? $scope.formData.unit_id.id : 0;
        $scope.formData.statuss = ($scope.formData.status != undefined && $scope.formData.status != null) ? $scope.formData.status.id : 0;
        // $scope.formData.locations = $scope.formData.location !== undefined ? $scope.formData.location.id : 0;

        // console.log($scope.selectedSubItemsArr);
        if (angular.element('#stock_check').is(':checked') == false)
            $scope.formData.stock_check = 0;

        if (angular.element('#rawMaterialProduct').is(':checked') == false)
            $scope.formData.rawMaterialProduct = 0;

        $scope.formData.substituteItems = $scope.selectedSubItemsArr;

        if (this.formData.prd_country_origin != undefined)
            $scope.formData.prd_country_origins = $scope.formData.prd_country_origin !== undefined ? $scope.formData.prd_country_origin.id : 0;

        if ($scope.formData.vat_rate_id != null)
            $scope.formData.vat_rate_ids = $scope.formData.vat_rate_id !== undefined ? $scope.formData.vat_rate_id.id : 0;

        $scope.formData.reoder_point_unit_ids = $scope.formData.reoder_point_unit_id != undefined ? $scope.formData.reoder_point_unit_id.id : 0;
        $scope.formData.min_order_unit_ids = $scope.formData.min_order_unit_id != undefined ? $scope.formData.min_order_unit_id.id : 0;
        $scope.formData.max_order_unit_ids = $scope.formData.max_order_unit_id != undefined ? $scope.formData.max_order_unit_id.id : 0;

        if ($scope.formData.unit_ids == 0 || $scope.formData.unit_ids == undefined) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Base U.O.M']));
            return;
        }

        if ($scope.formData.vat_rate_ids == 0 || $scope.formData.vat_rate_ids == undefined) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['VAT Rate']));
            return;
        }

        // console.log($scope.formData.reorder_quantity);
        if ($scope.formData.available_stock <= $scope.formData.reorder_quantity && $scope.formData.reorder_quantity != '' && $scope.formData.reorder_quantity != null && $scope.formData.reorder_quantity != 0) {
            $scope.lowStock = true;
        } else {
            $scope.lowStock = false;
        }

        //console.log($scope.formData);
        $http
            .post(updateUrl, $scope.formData)
            .then(function (res) {
                if (res.data.ack == true) {

                    $scope.$root.product_id = res.data.id;

                    if (res.data.productCode) {

                        $scope.formData.productCode = res.data.productCode;

                        $rootScope.model_code = $scope.formData.description + '( ' + res.data.productCode + ' )';
                        $scope.module_code = $rootScope.model_code;

                        if ($rootScope.breadcrumbs.length == 2) {
                            $rootScope.breadcrumbs.push({ 'name': $rootScope.model_code, 'url': '#', 'isActive': false });
                        }
                    }


                    toaster.pop('success', var_msg, 'Record ' + var_error);
                    if (res.data.id > 0) {
                        $scope.check_item_readonly = true;
                        $scope.recnew = res.data.id;
                    }
                    //$rootScope.updateSelectedGlobalData('item');
                }
                else
                    toaster.pop('error', var_msg, res.data.error);
            });
    }

    $scope.addItemRawMaterialInfo = function (selectedRawMaterialItemsArr) {

        var validationchk = 0;
        $scope.showLoader = true;

        angular.forEach(selectedRawMaterialItemsArr, function (obj) {

            if (!(obj.raw_material_qty) || !(obj.raw_material_qty > 0)) {

                if (obj.raw_material_qty < 0) {
                    toaster.pop('error', 'Error', 'Negative Qty. Entered');
                    validationchk++;
                    return;
                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Quantity']));
                    validationchk++;
                    return;
                }
            }

            if (obj.units && obj.units.id) {
                obj.uom = obj.units.name;
                obj.uomID = obj.units.id;
                obj.uomQty = obj.units.quantity;
            }
            else {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Unit of Measure']));
                validationchk++;
                return;
            }
        });

        if (validationchk > 0) {
            $scope.showLoader = false;
            return;
        }
        // return false;
        var updateUrl = $scope.$root.stock + "products-listing/insert-raw-material-item";

        $scope.formRec = {};
        $scope.formRec.token = $scope.$root.token;
        $scope.formRec.itemID = $scope.$root.product_id;
        $scope.formRec.selectedRawMaterialItemsArr = selectedRawMaterialItemsArr;//$scope.

        if (angular.element('#rawMaterialProduct').is(':checked') == false)
            $scope.formData.rawMaterialProduct = 0;

        $scope.formRec.rawMaterialProduct = $scope.formData.rawMaterialProduct;
        $scope.formRec.raw_material_gl_codes = $scope.formData.raw_material_gl_codes;
        $scope.formRec.raw_material_gl_name = $scope.formData.raw_material_gl_name;
        $scope.formRec.raw_material_gl = $scope.formData.raw_material_gl;
        $scope.formRec.raw_material_gl_id = $scope.formData.raw_material_gl_id;

        if ($scope.formData.rawMaterialProduct == 1 && (!$scope.formRec.raw_material_gl_id || $scope.formRec.raw_material_gl_id == '0')) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['G/L No. for Raw Material Product']));
            $scope.showLoader = false;
            return;
        }

        //console.log($scope.formRec);
        $http
            .post(updateUrl, $scope.formRec)
            .then(function (res) {

                $scope.showLoader = false;
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $scope.check_item_readonly = true;

                    // Raw Material End Product List

                    $scope.selectedRawMaterialItemsArr = [];
                    $scope.selectedRecFromModalsEndItem = [];

                    angular.forEach(res.data.response, function (endItems) {
                        endItems.product_name = endItems.description;
                        endItems.product_id = endItems.finished_item_id;
                        endItems.category = endItems.category_name;
                        // endItems.uom = endItems.unit_name;
                        endItems.raw_material_qty = Number(endItems.raw_material_qty);

                        if ($scope.formData.unit_name)
                            endItems.rawMaterialItemUom = $scope.formData.unit_name;

                        endItems.uom = endItems.unit_name;
                        // if(endItems.unit_name)
                        //     endItems.rawMaterialItemUom = endItems.unit_name;

                        if (endItems.arr_units) {

                            if (endItems.arr_units.response)
                                endItems.arr_units = endItems.arr_units.response;
                            else
                                endItems.arr_units = '';

                            /* if (endItems.arr_units.length[0])
                                endItems.units = endItems.arr_units[0];
                            else
                                endItems.units = ''; */

                            angular.forEach(endItems.arr_units, function (obj) {
                                if (obj.name == endItems.uom)
                                    endItems.units = obj;
                            });
                        }
                        else {
                            endItems.arr_units = '';
                            endItems.units = '';
                        }

                        $scope.selectedRawMaterialItemsArr.push(endItems);
                        $scope.selectedRecFromModalsEndItem.push({ key: endItems.finished_item_id, value: endItems.product_code, record: endItems });
                    });
                }
                else
                    toaster.pop('error', 'Error', res.data.error);
            });
    }

    $scope.deleteRawMaterialItem = function (id, finishedItemID, index) {
        if (Number(id) > 0) {
            var delUrl = $scope.$root.stock + "products-listing/delete-raw-material-item";

            ngDialog.openConfirm({
                template: 'modalDeleteDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {

                $scope.showLoader = true;
                $http
                    .post(delUrl, { 'id': id, 'token': $scope.$root.token })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                            $scope.selectedRawMaterialItemsArr.splice(index, 1);

                            var item2 = $filter("filter")($scope.selectedRecFromModalsEndItem, { key: finishedItemID });
                            var idx2 = $scope.selectedRecFromModalsEndItem.indexOf(item2[0]);

                            if (idx2 != -1) {
                                $scope.selectedRecFromModalsEndItem.splice(idx2, 1);
                            }
                        }
                        else {
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                        }

                        $scope.showLoader = false;
                    }).catch(function (e) {
                        $scope.showLoader = false;
                        throw new Error(e.data);
                    });

            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
        else {
            $scope.selectedRawMaterialItemsArr.splice(index, 1);

            var item2 = $filter("filter")($scope.selectedRecFromModalsEndItem, { key: finishedItemID });
            var idx2 = $scope.selectedRecFromModalsEndItem.indexOf(item2[0]);

            if (idx2 != -1) {
                $scope.selectedRecFromModalsEndItem.splice(idx2, 1);
            }
        }
    }

    $scope.getItemFinishedGoodsInfo = function () {

        $scope.showLoader = true;

        var updateUrl = $scope.$root.stock + "products-listing/get-finished-goods-info";

        $scope.formRec = {};
        $scope.formRec.token = $scope.$root.token;
        $scope.formRec.itemID = $scope.$root.product_id;
        //console.log($scope.formRec);
        $http
            .post(updateUrl, $scope.formRec)
            .then(function (res) {

                $scope.showLoader = false;
                if (res.data.ack == true) {
                    // toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $scope.check_item_readonly = true;

                    // Raw Material End Product List

                    $scope.selectedRawMaterialItemsArr = [];
                    $scope.selectedRecFromModalsEndItem = [];

                    angular.forEach(res.data.response, function (endItems) {
                        endItems.product_name = endItems.description;
                        endItems.product_id = endItems.finished_item_id;
                        endItems.category = endItems.category_name;
                        // endItems.uom = endItems.unit_name;
                        endItems.raw_material_qty = Number(endItems.raw_material_qty);

                        endItems.raw_material_qty = Number(endItems.raw_material_qty);

                        if ($scope.formData.unit_name)
                            endItems.rawMaterialItemUom = $scope.formData.unit_name;

                        endItems.uom = endItems.unit_name;
                        // if(endItems.unit_name)
                        //     endItems.rawMaterialItemUom = endItems.unit_name;

                        if (endItems.arr_units) {

                            if (endItems.arr_units.response)
                                endItems.arr_units = endItems.arr_units.response;
                            else
                                endItems.arr_units = '';

                            /* if (endItems.arr_units.length[0])
                                endItems.units = endItems.arr_units[0];
                            else
                                endItems.units = ''; */

                            angular.forEach(endItems.arr_units, function (obj) {
                                if (obj.name == endItems.uom)
                                    endItems.units = obj;
                            });

                        }
                        else {
                            endItems.arr_units = '';
                            endItems.units = '';
                        }

                        $scope.selectedRawMaterialItemsArr.push(endItems);
                        $scope.selectedRecFromModalsEndItem.push({ key: endItems.finished_item_id, value: endItems.product_code, record: endItems });
                    });

                    // if (angular.element('#rawMaterialProduct').is(':checked') == false)
                    //     $scope.formData.rawMaterialProduct = 0;


                    $scope.formRec.rawMaterialProduct = $scope.formData.rawMaterialProduct = res.data.rawMaterialProduct;

                    if ($scope.formData.rawMaterialProduct > 0) {
                        $scope.formData.rawMaterialProduct = true;
                    }

                    $scope.formRec.raw_material_gl_codes = $scope.formData.raw_material_gl_codes = res.data.raw_material_gl_code;
                    $scope.formRec.raw_material_gl_name = $scope.formData.raw_material_gl_name = res.data.raw_material_gl_name;
                    $scope.formRec.raw_material_gl = $scope.formData.raw_material_gl = res.data.raw_material_gl_code + " - " + res.data.raw_material_gl_name;
                    $scope.formRec.raw_material_gl_id = $scope.formData.raw_material_gl_id = res.data.raw_material_gl_id;
                }
                // else
                //     toaster.pop('error', 'Error', res.data.error);
            });
    }

    $scope.changeUOMrawMaterialItem = function (selectedRawMaterialItem) {

        if (selectedRawMaterialItem.units && selectedRawMaterialItem.units.name)
            selectedRawMaterialItem.uom = selectedRawMaterialItem.units.name;
    }

    $scope.historytype = function (id) {

        var Url = $scope.$root.stock + "products-listing/get-status-history";
        var postData = {
            'token': $scope.$root.token,
            'id': id
        };
        $http
            .post(Url, postData)
            .then(function (res) {

                if (res.data.ack == true) {
                    $scope.columns_general = [];
                    $scope.general = [];
                    $scope.general = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_general.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.element('#model_status').modal({ show: true });
                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                    $scope.columns_general = [];
                    $scope.general = [];
                }
            });
    }

    //------------------     End General   ------------------------------------------

    // ----------------      Detail start  ------------------------------------------

    $scope.unit_record_list = [];
    $scope.bar_code = '';

    $scope.getdetail = function () {
        /* $scope.get_substitute_product(1);
         $scope.get_del_product(1);*/

        $scope.check_item_detail_readonly = false;

        // $scope.$root.breadcrumbs[3].name = 'Details';

        $scope.get_unit_level_list();

        var Url = $scope.$root.stock + "products-listing/get-product-detail-by-id";


        $http
            .post(Url, { 'token': $scope.$root.token, 'product_id': $stateParams.id })
            .then(function (res) {
                $scope.unit_record_list = [];
                $scope.obj_rec = [];
                if (res.data.ack == true) {
                    //if (res.data.response.response != null)
                    //angular.element("button").attr("aria-expanded", "true");

                    angular.forEach(res.data.response, function (obj_rec) {

                        if (obj_rec.prd_height != undefined && obj_rec.prd_height != 0)
                            obj_rec.prd_height = Number(obj_rec.prd_height);
                        else
                            obj_rec.prd_height = 0;

                        if (obj_rec.prd_width != undefined && obj_rec.prd_width != 0)
                            obj_rec.prd_width = Number(obj_rec.prd_width);
                        else
                            obj_rec.prd_width = 0;

                        if (obj_rec.prd_length != undefined && obj_rec.prd_length != 0)
                            obj_rec.prd_length = Number(obj_rec.prd_length);
                        else
                            obj_rec.prd_length = 0;

                        if (obj_rec.volume != undefined && obj_rec.volume != 0)
                            obj_rec.volume = Number(obj_rec.volume);
                        else
                            obj_rec.volume = parseFloat(obj_rec.prd_height) * parseFloat(obj_rec.prd_width) * parseFloat(obj_rec.prd_length);

                        /* if (obj_rec.prd_weight != 0)
                            obj_rec.volume = Number(obj_rec.prd_weight);
                        else
                            obj_rec.prd_weight = '';

                        // pkg weight
                        if (obj_rec.prd_pkg_weight != 0)
                            obj_rec.volume = Number(obj_rec.prd_pkg_weight);
                        else
                            obj_rec.prd_pkg_weight = ''; */

                        angular.forEach($scope.unit_level_list, function (obj) {
                            if (obj.id == obj_rec.prd_dimension_unit)
                                obj_rec.prd_dimension_unit = obj;
                        });

                        angular.forEach($scope.unit_level_weight_list, function (obj) {
                            if (obj.id == obj_rec.prd_weight_unit)
                                obj_rec.prd_weight_unit = obj;
                        });

                        angular.forEach($scope.unit_level_weight_list, function (obj) {
                            if (obj.id == obj_rec.prd_net_weight_unit)
                                obj_rec.prd_net_weight_unit = obj;
                        });

                        angular.forEach($scope.volume_list, function (obj) {
                            if (obj.id == obj_rec.volume_unit)
                                obj_rec.volume_unit = obj;
                        });

                        //pkg unit
                        angular.forEach($scope.unit_level_weight_list, function (obj) {
                            if (obj.id == obj_rec.prd_pkg_weight_unit)
                                obj_rec.prd_pkg_weight_unit = obj;
                        });

                        $scope.unit_record_list.push(obj_rec);
                    });

                    if (Number(res.data.selected_counter) > 0)
                        $scope.check_item_detail_readonly = true;
                }
                else $scope.showLoader = false;
            });
    }

    $scope.add_detail = function (unit_record_list) {

        var rec = {};
        rec.token = $scope.$root.token;
        rec.id = 0;
        rec.product_id = $stateParams.id;
        rec.data = $scope.unit_record_list;
        var update = $scope.$root.stock + "products-listing/add-product-detail";

        // var result_return = makeEan13Barcode('11223344556654');
        // if(result_return.length>0) console.log(result_return);

        //3456erty4
        var total_rec = 0;

        angular.forEach($scope.unit_record_list, function (item) {
            if (item.prd_bar_code != undefined && item.prd_bar_code != '') {
                var result_return = makeEan13Barcode(item.prd_bar_code);
                if (Number(result_return) == 0) {
                    total_rec++;
                }
            }
        });
        //console.log(total_rec);return;

        if (total_rec > 0) {
            angular.element('html, body').animate({ scrollTop: 0 }, 800);
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(516));
            return;
        }

        $http
            .post(update, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.check_item_detail_readonly = true;
                    toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                }
                else
                    toaster.pop('error', 'Add', res.data.error);
            });
    }

    // ----------------      Detail End    -----------------------------------------

    // ----------------      Purchase Information start      ------------------------------------------
    $scope.OnChangeCostingMethod = function (costing_method_id) {
        if (costing_method_id == 1) {
            if (Number($scope.formData.fifo_cost) > 0)
                $scope.formData.overall_avg_cost = Number($scope.formData.fifo_cost).toFixed(3);
            else
                $scope.formData.overall_avg_cost = '';
        }
        else if (costing_method_id == 2) {
            // $scope.formData.overall_avg_cost = Number($scope.formData.ma_cost).toFixed(2);
            if (Number($scope.formData.ma_cost) > 0)
                $scope.formData.overall_avg_cost = Number($scope.formData.ma_cost).toFixed(3);
            else
                $scope.formData.overall_avg_cost = '';
        }
        else if (costing_method_id == 3) {
            // $scope.formData.overall_avg_cost = Number($scope.formData.temp_overall_avg_cost).toFixed(2);
            if (Number($scope.formData.temp_overall_avg_cost) > 0)
                $scope.formData.overall_avg_cost = Number($scope.formData.temp_overall_avg_cost).toFixed(3);
            else
                $scope.formData.overall_avg_cost = '';
        }
    }


    $scope.getItemPurchaseInfo = function () {

        // $scope.$root.breadcrumbs[3].name = 'Purchase Information';
        $scope.showLoader = true;
        $scope.get_setup_unit_data($scope.formData.unit_id.id);
        var ItemPurchaseInfoURL = $scope.$root.stock + "products-listing/get-item-purchase-info";
        $http
            .post(ItemPurchaseInfoURL, {
                'token': $scope.$root.token,
                'product_id': $stateParams.id
            })
            .then(function (res) {
                $scope.formData.overall_avg_cost = '';

                if (res.data.ack == true) {
                    // console.log(res.data.response);
                    $scope.check_item_readonly = true;
                    if (res.data.response.avg != null) {
                        $scope.formData.overall_avg_cost = $scope.$root.number_format(res.data.response.avg, $scope.decimal_range);
                        $scope.formData.temp_overall_avg_cost = $scope.$root.number_format(res.data.response.avg, $scope.decimal_range);
                    }
                    // console.log(parseFloat(res.data.response.avg).toFixed(2));

                    // $scope.formData.overall_avg_cost = (parseFloat(res.data.response.avg)).toFixed(2);
                    $scope.formData.item_transactions = res.data.response.item_transactions;

                    $scope.formData.avg_cost_sdate = res.data.response.avg_cost_sdate;
                    $scope.formData.avg_cost_edate = res.data.response.avg_cost_edate;
                    if (res.data.response.purchase_price.response.length > 0)
                        $scope.PurchasePriceList = res.data.response.purchase_price.response;
                    else {
                        $scope.PurchasePriceList = [];
                        $scope.pushNewPriceOffer(2);
                    }
                    $scope.formData.fifo_cost = res.data.response.fifo_cost;
                    $scope.formData.ma_cost = res.data.response.ma_cost;

                    if (res.data.response.costing_method_id) {
                        angular.forEach($scope.costing_method, function (obj) {
                            if (obj.id == res.data.response.costing_method_id)
                                $scope.formData.costing_method_id = obj;
                        });

                        if (res.data.response.costing_method_id == 1) {
                            $scope.formData.overall_avg_cost = Number($scope.formData.fifo_cost).toFixed(3);
                        }
                        else if (res.data.response.costing_method_id == 2) {
                            $scope.formData.overall_avg_cost = Number($scope.formData.ma_cost).toFixed(3);
                        }
                    }
                    $scope.formData.purchaseItemAdditionalCost = res.data.response.purchaseItemAdditionalCost;
                    if (res.data.response.vat_chk == 1)
                        $scope.formData.vat_chk = true;
                    else
                        $scope.formData.vat_chk = false;

                    if (parseFloat(res.data.response.standard_purchase_cost) > 0)
                        $scope.formData.standard_purchase_cost = res.data.response.standard_purchase_cost;

                    if (res.data.response.pi_is_last_used) {
                        $scope.formData.pi_is_last_used = true;
                        $scope.formData.pi_id = res.data.response.pi_id;
                        $scope.formData.pi_code = res.data.response.pi_code;
                        $scope.formData.pi_invoice_date = res.data.response.pi_invoice_date;
                        $scope.formData.pi_ptype = res.data.response.pi_ptype;
                        $scope.formData.pi_supplier_code = res.data.response.pi_supplier_code;
                        $scope.formData.pi_supplier_id = res.data.response.pi_supplier_id;
                        $scope.formData.pi_supplier_name = res.data.response.pi_supplier_name;
                        $scope.formData.pi_unit_price = res.data.response.pi_unit_price;

                    } else {
                        $scope.formData.pi_is_last_used = false;
                    }

                    angular.forEach($scope.PurchasePriceList, function (element) {

                        if (!Number(element.uom_id))
                            element.uom_id = $scope.formData.unit_id;
                        else {
                            angular.forEach($scope.refUOMList, function (obj) {
                                if (obj.id == element.uom_id)
                                    element.uom_id = obj;
                            });
                        }

                        if (parseFloat(element.standard_price) > 0)
                            element.standard_price = parseFloat(element.standard_price);
                        else
                            element.standard_price = '';


                        if (parseFloat(element.min_max_sale_price) > 0)
                            element.min_max_sale_price = parseFloat(element.min_max_sale_price);
                        else
                            element.min_max_sale_price = '';


                        if (parseFloat(element.min_qty) > 0)
                            element.min_qty = parseFloat(element.min_qty);
                        else
                            element.min_qty = '';

                        if (parseFloat(element.max_qty) > 0)
                            element.max_qty = parseFloat(element.max_qty);
                        else
                            element.max_qty = '';

                    });

                    if ($scope.PurchasePriceList.length > 0)
                        $scope.GetSupplierPrices($scope.PurchasePriceList[0], 1);
                }
                $scope.showLoader = false;
                $scope.$applyAsync();
            });

        /* item purchase cost start */
        $scope.get_product_cost($stateParams.id);
        /* item purchase cost end */
    }


    /* Item cost functions */
    $scope.get_product_cost = function (product_id) {
        var itemCost_arr_url = $scope.$root.stock + "item-cost/get-cost-description";
        var itemCost_arr_postData = {};
        itemCost_arr_postData.token = $scope.$root.token;

        $scope.itemCost_arr = [];
        $scope.item_costs = [];

        $http
            .post(itemCost_arr_url, itemCost_arr_postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.itemCost_arr = res.data.response;

                    var itemPurchaseCostUrl = $scope.$root.stock + "products-listing/get-product-purchase-cost";
                    var postData = {};
                    postData.product_id = product_id;
                    postData.token = $scope.$root.token;
                    postData.defaultCurrency = $rootScope.defaultCurrency;

                    $http
                        .post(itemPurchaseCostUrl, postData)
                        .then(function (res) {

                            if (res.data.ack == true) {
                                $scope.item_costs = res.data.response;
                                angular.forEach($scope.item_costs, function (element) {

                                    if (!Number(element.uom_id))
                                        element.uom_id = $scope.formData.unit_id;
                                    else {
                                        angular.forEach($scope.refUOMList, function (obj) {
                                            if (obj.id == element.uom_id)
                                                element.uom_id = obj;
                                        });
                                    }

                                    if (!Number(element.cost_id))
                                        element.marginal_analysis_id = '';
                                    else {
                                        angular.forEach($scope.itemCost_arr, function (obj) {
                                            if (obj.id == element.cost_id)
                                                element.cost_id = obj;
                                        });
                                    }

                                    if (!Number(element.currency_id))
                                        element.currency_id = '';
                                    else {
                                        angular.forEach($rootScope.arr_currency, function (obj) {
                                            if (obj.id == element.currency_id)
                                                element.currency_id = obj;
                                        });
                                    }

                                    element.amount = (Number(element.amount) > 0) ? Number(element.amount) : '';
                                });
                            }
                            else {
                                $scope.pushNewItemCost(1);
                            }

                        });
                }
                /* else
                    toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(232, ['Purchase Cost'])); */
            });
    }

    $scope.OnChangeItemCost = function (cost_item, index) {
        var isValid = 1;
        angular.forEach($scope.item_costs, function (obj, idx) {
            if (idx != index) {
                if (obj.cost_id != undefined && cost_item == obj.cost_id)
                    isValid = 0;
            }
        });
        if (isValid == 0) {
            toaster.pop('error', 'Error', 'Already selected');
            $scope.item_costs[index].cost_id = {};
        }
    }

    $scope.pushNewItemCost = function (fresh) {
        var currency = {};
        fresh = (fresh == undefined || fresh == 0) ? 0 : 1;
        angular.forEach($rootScope.arr_currency, function (obj) {
            if (obj.id == $rootScope.defaultCurrency)
                currency = obj;
        });
       
        if (fresh == 1) {
            $scope.item_costs.push({
                id: 0,
                uom_id: $scope.formData.unit_id.id,
                cost_id: $scope.itemCost_arr[0],
                currency_id: currency,
                amount: '',
                amount_conv:0
            });
        }
        else {
            $scope.item_costs.push({
                id: 0,
                uom_id: $scope.formData.unit_id.id,
                cost_id: 0,
                currency_id: currency,
                amount: '',
                amount_conv:0
            });
        }
   }

    $scope.deleteItemCost = function (id, index) {
        var deleteitemItemPCostUrl = $scope.$root.stock + "products-listing/delete-product-purchase-cost";
        var postData = {};
        postData.id = id;
        postData.token = $scope.$root.token;
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            if (id == 0) {
                toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                $scope.item_costs.splice(index, 1);
                return;
            }
            $http
                .post(deleteitemItemPCostUrl, postData)
                .then(function (res) {

                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $scope.item_costs.splice(index, 1);
                    }
                    else {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.OnChangeCurrency = function (currencydata, index) {
       
        if(currencydata.id !=$rootScope.defaultCurrency){
        var getCurrencyConUrl = $scope.$root.stock + "item-cost/get-convertion-rate";
        var postData = { 'token': $scope.$root.token, 'currency_id': currencydata.id };
		//$scope.showLoader = true;
		$http
			.post(getCurrencyConUrl, postData)
			.then(function (res) {
				if (res.data.ack == true) {
                    var conRate = res.data.response.conRate;                    
                        $scope.item_costs[index].amount_conv = ($scope.item_costs[index].amount / conRate).toFixed(2);
				}
				else
					toaster.pop('warning', 'Info', "No Convertion rate exist!");
            });
        }else{
                $scope.item_costs[index].amount_conv = ($scope.item_costs[index].amount).toFixed(2);
            }
    }

    $scope.calculateConvAmount = function (index) {
       var currency_id = $scope.item_costs[index].currency_id.id;
      
       if(currency_id!=$rootScope.defaultCurrency){
        var getCurrencyConUrl = $scope.$root.stock + "item-cost/get-convertion-rate";
        var postData = { 'token': $scope.$root.token, 'currency_id': currency_id };
		$http
			.post(getCurrencyConUrl, postData)
			.then(function (res) {
				if (res.data.ack == true) {
                    var conRate = res.data.response.conRate;
                        $scope.item_costs[index].amount_conv = ($scope.item_costs[index].amount / conRate).toFixed(2);
				}
				else
					toaster.pop('warning', 'Info', "No Convertion rate exist!");
            });
        }else{
            $scope.item_costs[index].amount_conv = ($scope.item_costs[index].amount).toFixed(2);
        }
    }
    
    $scope.totalPurchaseCost = function () {
        var totalPurchaseCost = 0;
        if ($scope.item_costs) {
            angular.forEach($scope.item_costs, function (item) {
                totalPurchaseCost = parseFloat(totalPurchaseCost) + parseFloat(item.amount_conv);
            });
        }
        return parseFloat(totalPurchaseCost).toFixed(2);
    }

    /* functions end */

    $scope.addItemPurchaseInfo = function () {

        var addItemPurchaseInfoURL = $scope.$root.stock + "products-listing/add-item-purchase-Info";
        var postData = {};
        postData.product_id = $stateParams.id;
        postData.token = $scope.$root.token;
        //console.log($scope.formData);return false;

        var isValid = true;
        var isValidCost = true;
        var isValidCostAmount = true;
        angular.forEach($scope.PurchasePriceList, function (obj) {
            if (obj.start_date == '' || obj.end_date == '')
                isValid = false;
        });

        angular.forEach($scope.item_costs, function (obj) {
            if (obj.cost_id.id == undefined || Number(obj.cost_id.id) == 0) {               
                isValidCost = false; 
            }
        });
        angular.forEach($scope.item_costs, function (obj) {
            if (obj.amount == 'undefined' || Number(obj.amount) == 0) {               
                isValidCostAmount = false; 
            }
        });

        if (!isValid) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Start Date and End Date']));
            return false;
        }

        if (!isValidCost) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Cost Description for all entries']));
            return false;
        }
        if (!isValidCostAmount) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Purchase amount for all entries']));
            return false;
        }

        if ($scope.formData.costing_method_id != null)
            postData.costing_method_ids = $scope.formData.costing_method_id !== undefined ? $scope.formData.costing_method_id.id : 0;

        if ($scope.formData.overall_avg_cost > 0)
            postData.overall_avg_costs = $scope.$root.number_format_remove($scope.formData.overall_avg_cost, $scope.decimal_range);
        else
            postData.overall_avg_costs = 0;

        if (angular.element('#vat_chk').is(':checked') == false)
            postData.vat_chk = 0;
        else
            postData.vat_chk = 1;

        if (postData.costing_method_ids == 0 || postData.costing_method_ids == undefined) {
            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(230, ['Item Costing Method']));
            return false;
        }


        if (angular.element('#confidential').is(':checked') == false)
            postData.confidential = 0;
        else
            postData.confidential = 1;

        postData.price_items = $scope.PurchasePriceList;
        // item purchase costs
        postData.item_costs = $scope.item_costs;
        postData.type = 2;
        $http
            .post(addItemPurchaseInfoURL, postData)
            .then(function (res) {

                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    //$rootScope.updateSelectedGlobalData('item');
                    $scope.getItemPurchaseInfo();
                    $scope.check_item_readonly = true;
                }
                else {
                    $scope.check_item_readonly = true;
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                }
                //toaster.pop('error', 'Edit', res.data.error);
            });


    }

    // ----------------      Purchase Information End        ------------------------------------------

    // ---------------       Item Margin Analysis          ------------------------------------------

    $scope.showEditItemMarginalAnalysisForm = function () {
        $scope.checkitemMarginalAnalysisReadonly = false;
    }
    $scope.getItemMarginalAnalysis = function () {

        var marginal_arr_url = $scope.$root.setup + "ledger-group/get-all-item-additional-cost";
        var marginal_arr_postData = {};
        marginal_arr_postData.token = $scope.$root.token;
        marginal_arr_postData.type = 2;

        $scope.marginal_analysis_arr = [];
        $scope.marginal_analysis = [];


        $http
            .post(marginal_arr_url, marginal_arr_postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.marginal_analysis_arr = res.data.response;

                    var itemMarginalAnalysisUrl = $scope.$root.stock + "products-listing/get-item-marginal-analysis";
                    var postData = {};
                    postData.product_id = $stateParams.id;
                    postData.token = $scope.$root.token;
                    $scope.checkitemMarginalAnalysisReadonly = true;

                    $http
                        .post(itemMarginalAnalysisUrl, postData)
                        .then(function (res) {

                            if (res.data.ack == true) {
                                $scope.marginal_analysis = res.data.response;
                                angular.forEach($scope.marginal_analysis, function (element) {

                                    if (!Number(element.uom_id))
                                        element.uom_id = $scope.formData.unit_id;
                                    else {
                                        angular.forEach($scope.refUOMList, function (obj) {
                                            if (obj.id == element.uom_id)
                                                element.uom_id = obj;
                                        });
                                    }

                                    if (!Number(element.marginal_analysis_id))
                                        element.marginal_analysis_id = '';
                                    else {
                                        angular.forEach($scope.marginal_analysis_arr, function (obj) {
                                            if (obj.id == element.marginal_analysis_id)
                                                element.marginal_analysis_id = obj;
                                        });
                                    }

                                    if (!Number(element.currency_id))
                                        element.currency_id = '';
                                    else {
                                        angular.forEach($rootScope.arr_currency, function (obj) {
                                            if (obj.id == element.currency_id)
                                                element.currency_id = obj;
                                        });
                                    }

                                    element.amount = (Number(element.amount) > 0) ? Number(element.amount) : '';
                                });
                                $scope.checkitemMarginalAnalysisReadonly = true;
                            }
                            else {
                                $scope.pushNewMarginalAnalysis(1);
                            }

                        });
                }
                else
                    toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(232, ['Margin Analysis']));
            });
    }
    $scope.OnChangeMarginAnalysis = function (margin_item, index) {
        var isValid = 1;
        angular.forEach($scope.marginal_analysis, function (obj, idx) {
            if (idx != index) {
                if (obj.marginal_analysis_id.id != undefined && margin_item.id == obj.marginal_analysis_id.id)
                    isValid = 0;
            }
        });
        if (isValid == 0) {
            toaster.pop('error', 'Error', 'Already selected');
            $scope.marginal_analysis[index].marginal_analysis_id = {};
        }
    }
    $scope.pushNewMarginalAnalysis = function (fresh) {
        var currency = {};
        fresh = (fresh == undefined || fresh == 0) ? 0 : 1;
        angular.forEach($rootScope.arr_currency, function (obj) {
            if (obj.id == $rootScope.defaultCurrency)
                currency = obj;
        });
        if (fresh == 1) {
            $scope.marginal_analysis.push({
                id: 0,
                uom_id: $scope.formData.unit_id,
                marginal_analysis_id: $scope.marginal_analysis_arr[0],
                currency_id: currency,
                amount: ''
            });
        }
        else {
            $scope.marginal_analysis.push({
                id: 0,
                uom_id: $scope.formData.unit_id,
                marginal_analysis_id: 0,
                currency_id: currency,
                amount: ''
            });
        }

    }
    $scope.addItemMarginalAnalysis = function () {
        var isValid = true;

        angular.forEach($scope.marginal_analysis, function (obj) {
            if (obj.marginal_analysis_id.id == undefined || Number(obj.marginal_analysis_id.id) == 0) {
                isValid = false;
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Additional Cost type for all entries']));
            }
        });
        if (isValid) {
            var itemMarginalAnalysisUrl = $scope.$root.stock + "products-listing/add-item-marginal-analysis";
            var postData = {};
            postData.product_id = $stateParams.id;
            postData.token = $scope.$root.token;
            postData.items = $scope.marginal_analysis;

            $http
                .post(itemMarginalAnalysisUrl, postData)
                .then(function (res) {

                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        $scope.checkitemMarginalAnalysisReadonly = true;
                        $scope.getItemMarginalAnalysis();
                    }

                });
        }
    }

    $scope.deleteItemMarginAnalysis = function (id, index) {
        var deleteitemMarginalAnalysisUrl = $scope.$root.stock + "products-listing/delete-item-marginal-analysis";
        var postData = {};
        postData.id = id;
        postData.token = $scope.$root.token;
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            if (id == 0) {
                toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                $scope.marginal_analysis.splice(index, 1);
                return;
            }
            $http
                .post(deleteitemMarginalAnalysisUrl, postData)
                .then(function (res) {

                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $scope.marginal_analysis.splice(index, 1);
                    }
                    else {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(108));
                    }

                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }
    // ----------------      Sale Information start      ------------------------------------------

    $scope.checkItemSalesReadonly = true;

    $scope.getItemSalesInfo = function () {

        // $scope.$root.breadcrumbs[3].name = 'Sales Information';

        $scope.showLoader = true;
        $scope.SalePriceList = [];
        $scope.get_setup_unit_data($scope.formData.unit_id.id);
        $scope.SalePriceList.discountDetails = [];
        $scope.checkItemSalesReadonly = true;
        var ItemPurchaseInfoURL = $scope.$root.stock + "products-listing/get-item-sales-info";
        var postData = {};
        postData.token = $scope.$root.token;
        postData.product_id = $stateParams.id;
        postData.type = 1
        $http
            .post(ItemPurchaseInfoURL, postData)
            .then(function (res) {

                if (res.data.ack == true) {
                    $scope.SalePriceList = res.data.response;
                    angular.forEach($scope.SalePriceList, function (element) {

                        if (!Number(element.uom_id))
                            element.uom_id = $scope.formData.unit_id;
                        else {
                            angular.forEach($scope.refUOMList, function (obj) {
                                if (obj.id == element.uom_id)
                                    element.uom_id = obj;
                            });
                        }


                        if (parseFloat(element.standard_price) > 0)
                            element.standard_price = parseFloat(element.standard_price);
                        else
                            element.standard_price = '';


                        if (parseFloat(element.min_max_sale_price) > 0)
                            element.min_max_sale_price = parseFloat(element.min_max_sale_price);
                        else
                            element.min_max_sale_price = '';


                        if (parseFloat(element.min_qty) > 0)
                            element.min_qty = parseFloat(element.min_qty);
                        else
                            element.min_qty = '';

                        if (parseFloat(element.max_qty) > 0)
                            element.max_qty = parseFloat(element.max_qty);
                        else
                            element.max_qty = '';

                        if (element.volume_discount_arr.length > 0) {
                            element.show_volume_discount = true;
                            element.volume_discount_arr.sort(predicateBy("min_qty"));
                            angular.forEach($scope.list_type, function (obj) {
                                if (obj.id == element.discount_type) {
                                    element.discount_type = obj;
                                }
                            });

                            element.show_vol_discount = true;
                            // $scope.onChangeCalculateDiscounts();

                        }
                        else {
                            element.show_vol_discount = false;
                            element.discount_type = $scope.list_type[0];
                        }
                    });
                    $scope.inFocusItem = $scope.SalePriceList[0];
                    $scope.selectedRow = 0;
                    if ($scope.inFocusItem.volume_discount_arr.length > 0)
                        $scope.onChangeCalculateDiscounts();
                }
                else {
                    $scope.SalePriceList = [];
                    $scope.pushNewPriceOffer(1);
                }

                $scope.showLoader = false;
            });
    }
    $scope.onFocusPriceItem = function (price_item, index) {
        $scope.inFocusItem = price_item;
        $scope.selectedRow = index;
        if ($scope.inFocusItem.volume_discount_arr.length > 0)
            $scope.onChangeCalculateDiscounts();
    }
    $scope.pushNewPriceOffer = function (attr) {
        if (attr == 1) {
            $scope.SalePriceList.push({
                id: 0,
                uom_id: $scope.formData.unit_id,
                start_date: '',
                end_date: '',
                volume_discount_arr: []
            });
            $scope.inFocusItem = $scope.SalePriceList[$scope.SalePriceList.length - 1];
            $scope.inFocusItem.discount_type = $scope.list_type[0];
        }
        else {
            $scope.PurchasePriceList.push({
                id: 0,
                uom_id: $scope.formData.unit_id,
                start_date: '',
                end_date: '',
                volume_discount_arr: []
            });
        }
    }

    $scope.ValidateDate = function (price_item, attr, type) {
        if (price_item.start_date.length > 0 && price_item.end_date.length > 0) {
            var startDate = price_item.start_date.trim().split('/');
            startDate = new Date(startDate[2], startDate[1] - 1, startDate[0]);

            var endDate = price_item.end_date.trim().split('/');
            endDate = new Date(endDate[2], endDate[1] - 1, endDate[0]);

            if (endDate < startDate) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(333, ['End Date ', 'Start Date']));

                if (attr == 1)
                    price_item.start_date = "";
                else
                    price_item.end_date = "";

                return;
            }
            if (type == 1) //sales
            {
                var invalid = 0;
                angular.forEach($scope.SalePriceList, function (elem) {
                    if (elem != price_item && invalid == 0) {
                        var check_startDate = elem.start_date.trim().split('/');
                        check_startDate = new Date(check_startDate[2], check_startDate[1] - 1, check_startDate[0]);

                        var check_endDate = elem.end_date.trim().split('/');
                        check_endDate = new Date(check_endDate[2], check_endDate[1] - 1, check_endDate[0]);

                        if (startDate >= check_startDate && startDate <= check_endDate ||
                            check_startDate >= startDate && check_startDate <= endDate) {
                            // toaster.pop('error', 'Error', "Invalid start date"); 
                            price_item.start_date = "";
                            invalid = 1;
                        }
                        if (endDate >= check_startDate && endDate <= check_endDate ||
                            check_endDate >= endDate && check_endDate <= endDate
                        ) {
                            // toaster.pop('error', 'Error', "Invalid end date"); 
                            price_item.end_date = "";
                            invalid = 1;
                        }

                        if (invalid == 1) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(517));
                            return;
                        }
                    }
                });
            }
            else {
                var invalid = 0;
                angular.forEach($scope.PurchasePriceList, function (elem) {
                    if (elem != price_item && invalid == 0) {
                        var check_startDate = elem.start_date.trim().split('/');
                        check_startDate = new Date(check_startDate[2], check_startDate[1] - 1, check_startDate[0]);

                        var check_endDate = elem.end_date.trim().split('/');
                        check_endDate = new Date(check_endDate[2], check_endDate[1] - 1, check_endDate[0]);

                        if (startDate >= check_startDate && startDate <= check_endDate ||
                            check_startDate >= startDate && check_startDate <= endDate) {
                            // toaster.pop('error', 'Error', "Invalid start date"); 
                            price_item.start_date = "";
                            invalid = 1;
                        }
                        if (endDate >= check_startDate && endDate <= check_endDate ||
                            check_endDate >= endDate && check_endDate <= endDate
                        ) {
                            // toaster.pop('error', 'Error', "Invalid end date"); 
                            price_item.end_date = "";
                            invalid = 1;
                        }

                        if (invalid == 1) {
                            // toaster.pop('error', 'Error', "Invalid date");
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(518));
                            return;
                        }
                    }
                });
            }
        }
    }

    $scope.deletePriceItem = function (id, index, type) {
        if (Number(id) > 0) {
            var delUrl = $scope.$root.stock + "products-listing/delete-item-price-offer";
            ngDialog.openConfirm({
                template: 'modalDeleteDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                $http
                    .post(delUrl, { id: id, 'token': $scope.$root.token })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                            if (type == 1)
                                $scope.SalePriceList.splice(index, 1);
                            else if (type == 2)
                                $scope.PurchasePriceList.splice(index, 1);

                        }
                        else {
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                        }
                    });
            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
        else {
            if (type == 1)
                $scope.SalePriceList.splice(index, 1);
            else if (type == 2)
                $scope.PurchasePriceList.splice(index, 1);
        }
    }

    $scope.pushNewVolumeDiscount = function () {

        for (var i = 0; i < $scope.inFocusItem.volume_discount_arr.length; i++) {
            if (Number($scope.inFocusItem.volume_discount_arr[i].discount) == 0 || Number($scope.inFocusItem.volume_discount_arr[i].min_qty) == 0) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(519));
                return;
            }
        }
        $scope.inFocusItem.volume_discount_arr.push({
            'discount': '',
            'min_qty': '',
            'id': 0
        });
    }
    $scope.onChangeCalculateDiscounts = function () {
        angular.forEach($scope.inFocusItem.volume_discount_arr, function (obj) {
            if ($scope.CalculateDiscount(obj))
                $scope.SaveItemVolumeDiscount(obj);
        });
    }
    $scope.CalculateDiscount = function (DiscountItem) {
        var netvolumeprice = 0;
        var netvolumepercentage = 0;
        var Discount = DiscountItem.discount;
        if (Discount == undefined || Discount == '0' || Discount == '' || $scope.inFocusItem.discount_type.id == undefined) {
            DiscountItem.actualDiscount = 0;
            DiscountItem.discountedPrice = 0;
            return false;
        }
        if ($scope.inFocusItem.discount_type.id == 1) {
            netvolumepercentage = ((parseFloat(Discount)) / 100) * $scope.inFocusItem.standard_price;
            netvolumeprice = parseFloat($scope.inFocusItem.standard_price) - parseFloat(netvolumepercentage);
            DiscountItem.actualDiscount = netvolumepercentage;
        }
        else if ($scope.inFocusItem.discount_type.id == 2) {
            netvolumeprice = parseFloat($scope.inFocusItem.standard_price) - parseFloat(Discount);
            DiscountItem.actualDiscount = parseFloat(Discount);
        }
        DiscountItem.actualDiscount = DiscountItem.actualDiscount.toFixed(2); // change it to default (set by user)
        DiscountItem.discountedPrice = netvolumeprice.toFixed(2); // change it to default (set by user)
        if (DiscountItem.discountedPrice > 0) {
            if (parseFloat(DiscountItem.discountedPrice) < parseFloat($scope.inFocusItem.min_max_sale_price)) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(578, [$scope.inFocusItem.min_max_sale_price]));

                DiscountItem.discount = '';
                DiscountItem.actualDiscount = '';
                DiscountItem.discountedPrice = '';
                return false;
            }
            return true;
        }
        else {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(316, ['Discounted Price ', '0']));
            DiscountItem.discount = '';
            DiscountItem.actualDiscount = '';
            DiscountItem.discountedPrice = '';
            return false;
        }
    }

    function predicateBy(prop) {
        return function (a, b) {
            if (parseFloat(a[prop]) > parseFloat(b[prop])) {
                return 1;
            } else if (parseFloat(a[prop]) < parseFloat(b[prop])) {
                return -1;
            }
            return 0;
        }
    }
    $scope.ValidatePriceOffers = function (current_discount_item) {

        var show_percentage = ($scope.inFocusItem.discount_type.id == 1) ? '%' : '';

        if ($scope.inFocusItem.min_qty == '' || $scope.inFocusItem.max_qty == '') {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(520));
            current_discount_item.min_qty = '';
            current_discount_item.discountedPrice = '';
            current_discount_item.actualDiscount = '';

            return false;
        }
        if (parseFloat(current_discount_item.min_qty) != '' && (parseFloat(current_discount_item.min_qty) <= parseFloat($scope.inFocusItem.min_qty) != '' || parseFloat(current_discount_item.min_qty) >= parseFloat($scope.inFocusItem.max_qty))) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(579, [$scope.inFocusItem.min_qty, $scope.inFocusItem.max_qty]));
            current_discount_item.min_qty = '';
            current_discount_item.discountedPrice = '';
            current_discount_item.actualDiscount = '';

            return false;
        }
        if ($scope.inFocusItem.volume_discount_arr.length <= 2) {
            for (var i = 0; i < $scope.inFocusItem.volume_discount_arr.length; i++) {
                if ($scope.inFocusItem.volume_discount_arr[i].min_qty == '' || $scope.inFocusItem.volume_discount_arr[i].min_qty == 0) {
                    // toaster.pop('error', 'Error', 'Please provide a minimum order quantity value at discount ' + (i + 1));
                    return false;
                }
                else if ($scope.inFocusItem.volume_discount_arr[i].discount == '') {
                    // toaster.pop('error', 'Error', 'Please provide a discount at discount ' + (i + 1));
                    return false;
                }
            }
            if ($scope.inFocusItem.volume_discount_arr.length == 2) {
                if (parseFloat($scope.inFocusItem.volume_discount_arr[1].min_qty) == parseFloat($scope.inFocusItem.volume_discount_arr[0].min_qty)) {
                    $scope.inFocusItem.volume_discount_arr[1].min_qty = '';
                    $scope.inFocusItem.volume_discount_arr[1].discount = '';
                    $scope.inFocusItem.volume_discount_arr[1].actualDiscount = '0';
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(521));
                    return false;
                }
                else if (parseFloat($scope.inFocusItem.volume_discount_arr[1].min_qty) >= parseFloat($scope.inFocusItem.volume_discount_arr[0].min_qty)) {
                    if (parseFloat($scope.inFocusItem.volume_discount_arr[1].discount) < parseFloat($scope.inFocusItem.volume_discount_arr[0].discount)) {
                        $scope.inFocusItem.volume_discount_arr[1].discount = '';
                        $scope.inFocusItem.volume_discount_arr[1].actualDiscount = '0';
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(580, [$scope.inFocusItem.volume_discount_arr[0].discount + show_percentage]));
                        return false;
                    }
                }
                else if (parseFloat($scope.inFocusItem.volume_discount_arr[1].min_qty) <= parseFloat($scope.inFocusItem.volume_discount_arr[0].min_qty)) {
                    if (parseFloat($scope.inFocusItem.volume_discount_arr[1].discount) > parseFloat($scope.inFocusItem.volume_discount_arr[0].discount)) {
                        $scope.inFocusItem.volume_discount_arr[1].discount = '';
                        $scope.inFocusItem.volume_discount_arr[1].actualDiscount = '0';
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(581, [$scope.inFocusItem.volume_discount_arr[0].discount + show_percentage]));
                        return false;
                    }
                }
            }
        }
        else if ($scope.inFocusItem.volume_discount_arr.length > 2) {

            for (var i = $scope.inFocusItem.volume_discount_arr.length - 1; i >= 0; i--) {
                for (var j = 0; j < i; j++) {
                    if (parseFloat($scope.inFocusItem.volume_discount_arr[j].min_qty) == parseFloat($scope.inFocusItem.volume_discount_arr[i].min_qty)) {
                        $scope.inFocusItem.volume_discount_arr[i].min_qty = '';
                        $scope.inFocusItem.volume_discount_arr[i].discount = '';
                        $scope.inFocusItem.volume_discount_arr[i].actualDiscount = '0';
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(521));
                        return false;
                    }
                }
            }

            var currentDiscountVal = current_discount_item.discount;
            var currentMinOrderVal = current_discount_item.min_qty;
            var currrentIndex = $scope.inFocusItem.volume_discount_arr.indexOf(current_discount_item);

            var tempArr = $scope.inFocusItem.volume_discount_arr.slice();

            var closest_lesser_min_order = '0';
            var closest_higher_min_order = '100000';
            var lesser_min_order_index = '';
            var higher_min_order_index = '';
            var message = '';

            for (var i = 0; i < tempArr.length; i++) {
                if (parseFloat(tempArr[i].min_qty) < parseFloat(currentMinOrderVal)) {
                    if (parseFloat(tempArr[i].min_qty) > parseFloat(closest_lesser_min_order)) {
                        closest_lesser_min_order = tempArr[i].min_qty;
                        lesser_min_order_index = i;
                    }
                }
                else if (parseFloat(tempArr[i].min_qty) > parseFloat(currentMinOrderVal)) {
                    if (parseFloat(tempArr[i].min_qty) < parseFloat(closest_higher_min_order)) {
                        closest_higher_min_order = tempArr[i].min_qty;
                        higher_min_order_index = i;
                    }
                }
            }

            if (closest_lesser_min_order == '0') {
                closest_lesser_min_order = currentMinOrderVal;
                lesser_min_order_index = currrentIndex;
            }
            else if (closest_higher_min_order == '100000') {
                closest_higher_min_order = currentMinOrderVal;
                higher_min_order_index = currrentIndex;
            }
            if (currrentIndex != lesser_min_order_index && currrentIndex != higher_min_order_index) {
                if (parseFloat(currentDiscountVal) <= parseFloat(tempArr[lesser_min_order_index].discount) || parseFloat(currentDiscountVal) >= parseFloat(tempArr[higher_min_order_index].discount)) {
                    message = "Discount should be range " + tempArr[lesser_min_order_index].discount + show_percentage + " and " + tempArr[higher_min_order_index].discount + show_percentage + " at discount offer " + (currrentIndex + 1);
                    $scope.inFocusItem.volume_discount_arr[currrentIndex].discount = '';
                    $scope.inFocusItem.volume_discount_arr[currrentIndex].actualDiscount = '0';
                    toaster.pop('error', 'Error', message);
                    return false;
                }
            }
            else {
                if (currrentIndex == lesser_min_order_index && parseFloat(currentDiscountVal) >= parseFloat(tempArr[higher_min_order_index].discount)) {
                    message = "Discount should be less than " + tempArr[higher_min_order_index].discount + show_percentage + " at discount offer " + (currrentIndex + 1);
                    $scope.inFocusItem.volume_discount_arr[currrentIndex].discount = '';
                    $scope.inFocusItem.volume_discount_arr[currrentIndex].actualDiscount = '0';
                    toaster.pop('error', 'Error', message);
                    return false;
                }
                else if (currrentIndex == higher_min_order_index && parseFloat(currentDiscountVal) <= parseFloat(tempArr[lesser_min_order_index].discount)) {
                    message = "Discount should be greater than " + tempArr[lesser_min_order_index].discount + show_percentage + " at discount offer " + (currrentIndex + 1);
                    $scope.inFocusItem.volume_discount_arr[currrentIndex].discount = '';
                    $scope.inFocusItem.volume_discount_arr[currrentIndex].actualDiscount = '0';
                    toaster.pop('error', 'Error', message);
                    return false;
                }
                return true;
            }
        }
        return true;
    }

    $scope.SaveItemVolumeDiscount = function (discountItem) {
        return; // don't need to save indivisually
        discountItem.discountType = $scope.inFocusItem.discount_type.id;
        discountItem.itemID = $scope.formData.id;
        discountItem.type = 2;

        discountItem.price_id = $scope.inFocusItem.id;
        discountItem.token = $rootScope.token;
        var submitUrl = $rootScope.stock + "products-listing/add-product-price-volume";

        var httpPromise = $http
            .post(submitUrl, discountItem)
            .then(function (res) {
                if (res.data.ack > 0) {
                    discountItem.id = res.data.id;
                } else {
                    // toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(104));
                }
            });
    }
    $scope.OnBlurVolumeItem = function (discountItem) {
        if ($scope.ValidatePriceOffers(discountItem)) {
            if ($scope.CalculateDiscount(discountItem)) {
                $scope.SaveItemVolumeDiscount(discountItem);
                // $scope.inFocusItem.volume_discount_arr.sort(predicateBy("min_qty"));
            }
        }
    }

    $scope.removePriceItemVolume = function (index, volItemID) {
        if (volItemID == 0) {
            $scope.inFocusItem.volume_discount_arr.splice(index, 1);
            return;
        }
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {

            var itemRec = {};
            itemRec.token = $rootScope.token;
            itemRec.id = volItemID;
            var submitUrl = $rootScope.stock + "products-listing/delete-product-price-volume";

            var httpPromise = $http
                .post(submitUrl, itemRec)
                .then(function (res) {
                    if (res.data.ack > 0) {
                        $scope.inFocusItem.volume_discount_arr.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(108));
                    }
                });
            /* SubmitPrice.deletePriceOfferVolumeItem(volItemID)
                .then(function (result) {
                    if (result.ack == true) {
                        //item.id = result.id;
                    }
                }, function (error) {
                    console.log(error);
                }); */
            /* ================ */

        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }
    $scope.showEditItemSalesForm = function () {
        $scope.checkItemSalesReadonly = false;
    }

    $scope.stopSaving = false;

    $scope.ValidateMinSalesPrice = function (price_item, attr, type) {
        if (type == 1) //sale
        {
            if (parseFloat(price_item.min_max_sale_price) > parseFloat(price_item.standard_price)) {
                if (attr == 1)
                    price_item.standard_price = '';
                else if (attr == 2)
                    price_item.min_max_sale_price = '';
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(522));
                $scope.stopSaving = true;
                return;
            }
            else {
                $scope.stopSaving = false;

            }
        }
        else {
            if (parseFloat(price_item.min_max_sale_price) < parseFloat(price_item.standard_price)) {
                if (attr == 1)
                    price_item.standard_price = '';
                else if (attr == 2)
                    price_item.min_max_sale_price = '';
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(360, ['Max Purchase Price', 'Standard Price']));
                $scope.stopSaving = true;
                return;
            }
            else {
                $scope.stopSaving = false;
            }
        }
    }
    $scope.ValidateMaxPurchasePrice = function (attr) {
        if (parseFloat($scope.formData.minimum_purchase_cost) < parseFloat($scope.formData.standard_purchase_cost)) {
            if (attr == 1)
                $scope.formData.minimum_purchase_cost = '';
            else if (attr == 2)
                $scope.formData.standard_purchase_cost = '';
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(360, ['Max Purchase Price', 'Standard Price']));
            return;
        }
        // else
        //     $scope.addItemSalesInfo(1);

    }
    $scope.validateMinMaxRange = function (priceitem, attr, type) {
        if (type == 1) {
            if (parseFloat(priceitem.min_qty) > parseFloat(priceitem.max_qty)) {
                if (attr == 1)
                    priceitem.min_qty = '';
                else if (attr == 2)
                    priceitem.max_qty = '';
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(322, ['Minimum Order', 'Maximum Order']));
                return;
            }
        }
        else if (type == 2) {
            if (parseFloat($scope.formData.minPurchaseQty) > parseFloat($scope.formData.maxPurchaseQty)) {
                if (attr == 1)
                    $scope.formData.minPurchaseQty = '';
                else if (attr == 2)
                    $scope.formData.maxPurchaseQty = '';
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(322, ['Minimum Order', 'Maximum Order']));
                return;
            }
        }

    }

    $scope.GetSupplierPrices = function (priceitem, flg) {
        var getSupplierPrices = $scope.$root.stock + "products-listing/get-supplier-prices-for-item";
        $scope.supplier_prices = [];

        var postData = {
            'token': $scope.$root.token,
            'product_id': priceitem.product_id,
            'start_date': priceitem.start_date,
            'end_date': priceitem.end_date
        };

        if (flg == undefined)
            $scope.showLoader = true;
        $http
            .post(getSupplierPrices, postData)
            .then(function (res) {

                if (res.data.ack == true) {
                    $scope.showLoader = false;
                    $scope.supplier_prices = res.data.response;
                }
                else {
                    $scope.showLoader = false;
                    if (flg == undefined)
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            });
    }

    $scope.addItemSalesInfo = function (flg) {
        if ($scope.stopSaving) {
            return;
        }
        var isValid = true;
        angular.forEach($scope.SalePriceList, function (obj) {
            if (obj.start_date == '' || obj.end_date == '')
                isValid = false;
        });
        /* 
                if (parseFloat($scope.salesFormData.absolute_minimum_price) > parseFloat($scope.salesFormData.standard_price)){
                    toaster.pop('error', 'Error', 'Min Sale Price should be less than Standard Price');
                    return;
                }
        
                
                console.log("called");
                if (flg == undefined)
                    $scope.onChangeCalculateDiscounts();q
        */
        if (!isValid) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Start Date and End Date']));
            return;
        }
        var addItemSalesInfoURL = $scope.$root.stock + "products-listing/add-item-sales-Info";


        //console.log($scope.salesFormData);//return false;
        var postData = {};
        postData.token = $scope.$root.token;
        postData.product_id = $stateParams.id;
        postData.type = 1;
        postData.price_items = $scope.SalePriceList;

        $http
            .post(addItemSalesInfoURL, postData)
            .then(function (res) {

                if (res.data.ack == true) {
                    if (flg == undefined) {
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                        //$rootScope.updateSelectedGlobalData('item');
                        $scope.getItemSalesInfo();
                        $scope.checkItemSalesReadonly = true;
                    }
                }
                else {
                    if (flg == undefined) {
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                        $scope.checkItemSalesReadonly = true;
                        $scope.getItemSalesInfo();
                    }
                }
            });
    }

    // ----------------      Sale Information start      ------------------------------------------

    // ----------------      Warehouse allocation start 	 -----------------------------------------

    $scope.warehouse_status_list = [];
    $scope.make_default = [];
    // $scope.make_default = [{'label': 'Yes', 'value': 1}, {'label': 'No', 'value': 0}];
    $scope.make_default = [{ value: 'Yes', id: '1' }, { value: 'No', id: '0' }];

    $scope.prod_warehouse_loc_add_cost_buttons_Show = false;

    $scope.warehouse_status_list = [{ value: 'Active', id: '1' }, { value: 'Inactive', id: '2' }];

    $scope.searchKeyword = {};
    $scope.searchKeyword.status_ids = $scope.warehouse_status_list[0];

    $scope.warehouse_location = function (search) {

        if (search == undefined)
            search = 1;
        else if (search == 2)
            search = 2;


        // $scope.$root.breadcrumbs[3].name = 'Warehouse Location';

        $scope.warehouse_loc_ListingShow = true;
        $scope.warehouse_loc_FormShow = false;

        $scope.warehouse_loc_add_cost_FormShow = false;
        $scope.warehouse_loc_add_cost_List_Show = false;

        $scope.item_warehouse_loc_add_cost_setup_Show = false;

        $scope.showLoader = true;

        var postUrl = $scope.$root.setup + "warehouse/get-prod-warehouse-loc";

        $http
            .post(postUrl, { 'token': $scope.$root.token, 'prod_id': $scope.$root.product_id, 'status_id': search })
            .then(function (res) {

                $scope.showLoader = false;
                $scope.columns = [];
                $scope.prod_warehouse_loc_data = [];

                if (res.data.ack == true) {

                    $scope.prod_warehouse_loc_data = res.data.response;

                    //console.log($scope.prod_warehouse_loc_data);
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }

            });
    }

    $scope.warehouse_loc_add_Form = function () {

        $scope.check_item_readonly = false;
        $scope.showdataaddcost = false;

        $scope.rec2 = {};
        $scope.warehouse_loc_ListingShow = false;
        $scope.warehouse_loc_FormShow = true;
        $scope.rec2.loc_warehouse = 0;
        $scope.warehouse_loc_add_cost_setup_Show = false;

        $scope.cost_types = [];

        $scope.rec2.status_ids = $scope.warehouse_status_list[0];
        $scope.rec2.default_warehouse = $scope.make_default[1];

        $scope.warehouse_loc_add_cost_FormShow = false;
        $scope.warehouse_loc_add_cost_List_Show = false;

        $scope.showLoader = true;

        //console.log($scope.formData.unit_id.id);

        $scope.cost_types = [
            { title: 'Fixed', id: '1' },
            { title: 'Daily', id: '2' },
            { title: 'Weekly', id: '3' },
            { title: 'Monthly', id: '4' },
            { title: 'Annually', id: '5' }];

        var whUrl = $scope.$root.setup + "warehouse/warehouse-predata";//'unit_id': $scope.formData.unit_id.id
        $http
            .post(whUrl, { 'token': $scope.$root.token, 'product_id': $stateParams.id })
            .then(function (res) {
                $scope.arr_warehouse = [];

                if (res.data.ack == true) {
                    $scope.additional_cost_title = [];
                    $scope.arr_warehouse = res.data.response;
                    $scope.additional_cost_title = res.data.additionalCostTitle;
                    $scope.additional_cost_title.push({ 'id': '-1', 'title': '++ Add New ++' });
                }
                else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(641));

                $scope.showLoader = false;
            });
    }

    $scope.get_loc_in_warehouse = function (wrh_id) {
        // console.log(wrh_id);
        $scope.rec2.loc_warehouse = 0;
        $scope.rec2.location = "";
        $scope.loc_list = [];
        //$scope.showLoader = true;

        // var postUrl = $scope.$root.setup + "warehouse/alt-bin-location";
        var postUrl = $scope.$root.setup + "warehouse/get-loc-by-warehouse-id-in-item";
        //, 'unit_id': $scope.formData.unit_id.id 
        $http
            .post(postUrl, { 'token': $scope.$root.token, 'wrh_id': wrh_id, 'product_id': $stateParams.id })
            .then(function (res) {

                if (res.data.ack == true) { // && res.data.response.stockcheck>0

                    $scope.rec2.loc_warehouse = 1;
                    $scope.loc_list = res.data.response;

                }
                /* else if (res.data.response.stockcheck == 0) {
                    // angular.element()
                    angular.element(document.querySelector(".general_information")).click();                    
                } */
                else {
                    $scope.rec2.warehouse = "";
                    $scope.rec2.location = "";
                    $scope.rec2.dimension = "";
                    $scope.rec2.cost = "";
                    $scope.rec2.currency = "";
                    $scope.rec2.cost_type = "";
                    $scope.rec2.loc_warehouse = 0;

                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(523));
                }
                //$scope.showLoader = false;
            });
    }

    $scope.get_cost_uom_in_warehouse = function (wrh_loc_id) {
        //$scope.showLoader = true;
        $scope.check_item_warehouse_readonly = true;

        if (wrh_loc_id > 0) {

            var cost_uom_by_itemid_postUrl = $scope.$root.setup + "warehouse/get-warehouse-loc-cost-uom-by-itemid";

            $http
                .post(cost_uom_by_itemid_postUrl, {
                    'token': $scope.$root.token,
                    'prod_id': $scope.$root.product_id,
                    'location_id': wrh_loc_id
                })
                .then(function (res) {
                    // console.log(res.data.response);

                    //if (res.data.add_cost_chk > 0) {

                    if (res.data.ack == true) {

                        $scope.rec2.cost = res.data.response.Cost;

                        if (res.data.response.currency > 0) {
                            angular.forEach($rootScope.arr_currency, function (elem) {
                                if (elem.id == res.data.response.currency)
                                    $scope.rec2.currency = elem;
                            });
                        }
                        else {
                            angular.forEach($rootScope.arr_currency, function (elem) {
                                if (elem.id == $scope.$root.defaultCurrency)
                                    $scope.rec2.currency = elem;
                            });
                        }

                        angular.forEach($rootScope.uni_prooduct_arr, function (elem) {
                            if (elem.id == res.data.response.uom_id)
                                $scope.rec2.dimension = elem;
                        });

                        angular.forEach($scope.cost_types, function (elem) {
                            if (elem.id == res.data.response.cost_type_id)
                                $scope.rec2.cost_type = elem;
                        });

                        $scope.rec2.description = res.data.response.description;
                        $scope.rec2.warehouse_loc_sdate = res.data.response.warehouse_loc_sdate;
                        $scope.showLoader = false;
                    }
                    else {
                        $scope.rec2.location = "";
                        $scope.rec2.dimension = "";
                        $scope.rec2.cost = "";
                        $scope.rec2.currency = "";
                        $scope.rec2.cost_type = "";
                        $scope.rec2.description = "";
                        $scope.rec2.warehouse_loc_sdate = "";
                        //$scope.showLoader = false;
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(524));
                    }
                    // }
                    // else {
                    //     // $scope.rec2.location = "";
                    //     $scope.rec2.dimension = "";
                    //     $scope.rec2.cost = "";
                    //     $scope.rec2.currency = "";
                    //     $scope.rec2.cost_type = "";
                    //     $scope.rec2.description = res.data.description;
                    //     $scope.rec2.warehouse_loc_sdate = res.data.warehouse_loc_sdate;
                    //     //$scope.showLoader = false;
                    // }
                });
        }
    }

    $scope.add_warehouse_location = function (rec2) {

        rec2.token = $scope.$root.token;
        rec2.product_id = $scope.$root.product_id;

        if (rec2.warehouse !== undefined)
            rec2.warehouse_id = rec2.warehouse.id;

        if (!(rec2.warehouse_id > 0)) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Warehouse']));
            return false;
        }

        if (rec2.default_warehouse !== undefined)
            rec2.default_warehouse_id = rec2.default_warehouse.id;

        if (rec2.location !== undefined)
            rec2.location_id = rec2.location.id;

        if (!(rec2.location_id > 0)) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Storage Location']));
            return false;
        }

        if (rec2.status_ids !== undefined)
            rec2.status = rec2.status_ids.id;

        if (rec2.currency !== undefined)
            rec2.currency_id = rec2.currency.id;

        if (rec2.dimension !== undefined)
            rec2.dimensions_id = rec2.dimension.id;

        if (rec2.cost_type !== undefined)
            rec2.cost_type_id = rec2.cost_type.id;

        var altAddUrl = $scope.$root.setup + "warehouse/add-prod-warehouse-loc";

        if (rec2.id != undefined)
            var altAddUrl = $scope.$root.setup + "warehouse/update-prod-warehouse-loc";

        //console.log(rec2); return;
        $http
            .post(altAddUrl, rec2)
            .then(function (res) {

                if (res.data.ack == true) {

                    $scope.columns2 = [];
                    $scope.prod_warehouse_loc_add_cost_data = [];
                    $scope.check_item_readonly = true;
                    $scope.check_item_warehouse_readonly = true;
                    $scope.item_warehouse_loc_add_cost_setup_Show = true;
                    $scope.warehouse_loc_add_cost_FormShow = false;
                    $scope.warehouse_loc_add_cost_List_Show = true;

                    $scope.warehouse_loc_id = res.data.id;

                    if (rec2.id > 0) {
                        rec2.loc_id = rec2.location_id;
                        // $scope.edit_warehouse_location(rec2);
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                        $scope.warehouse_location();
                    }
                    else {
                        rec2.id = res.data.id;
                        $scope.warehouse_loc_add_cost_FormShow = false;
                        $scope.warehouse_loc_add_cost_List_Show = true;

                        //get bin loc additional cost for product module start
                        var bin_loc_add_cost_Url = $scope.$root.setup + "warehouse/alt-bin-loc-add-cost";

                        $http
                            .post(bin_loc_add_cost_Url, {
                                'token': $scope.$root.token,
                                'wrh_id': rec2.warehouse_id,
                                'bin_loc_wrh_id': rec2.location_id
                            })
                            .then(function (res) {
                                if (res.data.response != null) {
                                    $scope.columns1 = [];
                                    $scope.bin_loc_add_cost_data = [];
                                    $scope.bin_loc_add_cost_data = res.data.response;

                                    angular.forEach(res.data.response[0], function (val, index) {
                                        $scope.columns1.push({
                                            'title': toTitleCase(index),
                                            'field': index,
                                            'visible': true
                                        });
                                    });
                                    $scope.warehouse_loc_add_cost_setup_Show = true;
                                }
                            });
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    }
                    // update items global data array with updated warehouse listing
                    //$rootScope.updateSelectedGlobalData('item');
                }
                else {
                    if (rec2.id > 0)
                        toaster.pop('error', 'Edit', res.data.error);
                    else
                        toaster.pop('error', 'Error', res.data.error);
                }
            });
    }

    $scope.showWarehouseAddCostSetupShow = function () {
        angular.element('#warehouseAdditionalCostSetup').modal({ show: true });
    }

    /* $scope.edit_warehouse_location = function (rec) {
        //console.log(rec);
        var id = rec.id;
        var bin_loc_id = rec.loc_id;
        var warehouse_id = rec.warehouse_id;

        $scope.check_item_readonly = true;
        $scope.check_item_warehouse_readonly = true;
        $scope.showLoader = true;

        $scope.warehouse_loc_ListingShow = false;
        $scope.warehouse_loc_FormShow = true;

        $scope.prod_warehouse_loc_add_cost_buttons_Show = false;


        var prod_warehouse_loc_Url = $scope.$root.setup + "warehouse/get-prod-warehouse-loc-byid";
        var postViewData = {
            'token': $scope.$root.token,
            'id': id
        };

        $http
            .post(prod_warehouse_loc_Url, postViewData)
            .then(function (res1) {
                if (res1.data.ack == true) {
                    $scope.rec2 = res1.data.response;
                    $scope.rec2.id = res1.data.response.id;

                    $scope.arr_warehouse = [];
                    $scope.cost_types = [];
                    //$scope.arr_dimension = [];

                    $scope.cost_types = [{ title: 'Fixed', id: '1' }, { title: 'Daily', id: '2' }, {
                        title: 'Weekly',
                        id: '3'
                    }, { title: 'Monthly', id: '4' }, { title: 'Annually', id: '5' }];

                    var whUrl = $scope.$root.setup + "warehouse/get-all-list";

                    $http
                        .post(whUrl, { 'token': $scope.$root.token })
                        .then(function (res2) {
                            if (res2.data.ack == true)
                                $scope.arr_warehouse = res2.data.response;

                            var ref_dimension_Url = $scope.$root.stock + "unit-measure/get-all-unit";
                            $http
                                .post(ref_dimension_Url, { 'token': $scope.$root.token })
                                .then(function (res3) {

                                    if (res3.data.ack == true)
                                        $scope.arr_dimension = res3.data.response;

                                    if (res1.data.response.currency_id > 0) {

                                        angular.forEach($rootScope.arr_currency, function (elem) {
                                            if (elem.id == res1.data.response.currency_id)
                                                $scope.rec2.currency = elem;
                                        });
                                    }
                                    else {

                                        angular.forEach($rootScope.arr_currency, function (elem) {
                                            if (elem.id == $scope.$root.defaultCurrency)
                                                $scope.rec2.currency = elem;
                                        });
                                    }


                                    $scope.loc_list = [];

                                    //var postUrl = $scope.$root.setup + "warehouse/alt-bin-location";
                                    var postUrl = $scope.$root.setup + "warehouse/get-loc-by-warehouse-id-in-item";

                                    $http
                                        .post(postUrl, {
                                            'token': $scope.$root.token,
                                            'wrh_id': res1.data.response.warehouse_id
                                        })
                                        .then(function (res5) {
                                            if (res5.data.ack == true) {
                                                $scope.rec2.loc_warehouse = 1;
                                                $scope.loc_list = res5.data.response;

                                                angular.forEach($scope.loc_list, function (elem) {
                                                    if (elem.id == res1.data.response.warehouse_loc_id)
                                                        $scope.rec2.location = elem;
                                                });
                                            }
                                        });


                                    angular.forEach($scope.arr_warehouse, function (obj) {
                                        if (obj.id == res1.data.response.warehouse_id)
                                            $scope.rec2.warehouse = obj;
                                    });


                                    angular.forEach($scope.make_default, function (obj) {
                                        if (obj.id == res1.data.response.default_warehouse)
                                            $scope.rec2.default_warehouse = obj;
                                    });

                                    angular.forEach($scope.warehouse_status_list, function (obj) {
                                        if (obj.id == res1.data.response.status)
                                            $scope.rec2.status_ids = obj;
                                    });

                                    angular.forEach($scope.arr_dimension, function (elem) {
                                        if (elem.id == res1.data.response.uom_id)
                                            $scope.rec2.dimension = elem;
                                    });

                                    angular.forEach($scope.cost_types, function (elem) {
                                        if (elem.id == res1.data.response.cost_type_id)
                                            $scope.rec2.cost_type = elem;
                                    });

                                    // if (res1.data.response.cost > 0) {
                                    $scope.item_warehouse_loc_add_cost_setup_Show = true;
                                    $scope.warehouse_loc_add_cost_setup_Show = true;
                                    // }
                                    $scope.showLoader = false;
                                });

                        });
                }
                $scope.showLoader = false;
            });

        $scope.warehouse_loc_add_cost_FormShow = false;
        $scope.warehouse_loc_add_cost_List_Show = true;

        $scope.warehouse_loc_id = id;

        //get bin loc additional cost for product module start

        // var bin_loc_add_cost_Url = $scope.$root.setup + "warehouse/get-bin-loc-add-cost-for-product";
        var bin_loc_add_cost_Url = $scope.$root.setup + "warehouse/alt-bin-loc-add-cost";

        $http
            .post(bin_loc_add_cost_Url, {
                'token': $scope.$root.token,
                'wrh_id': warehouse_id,
                'bin_loc_wrh_id': bin_loc_id
            })
            .then(function (res) {
                if (res.data.response != null) {
                    $scope.columns1 = [];
                    $scope.bin_loc_add_cost_data = [];
                    $scope.bin_loc_add_cost_data = res.data.response;
                    //console.log(res.data.response);
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns1.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    $scope.warehouse_loc_add_cost_setup_Show = true;
                }
            });

        //get bin loc additional cost for product module end

        //get product loc additional cost start

        var prod_warehouse_loc_add_cost_Url = $scope.$root.setup + "warehouse/alt-prod-warehouse-loc-add-cost";

        $http
            .post(prod_warehouse_loc_add_cost_Url, {
                'token': $scope.$root.token,
                'prod_id': $scope.$root.product_id,
                'warehouse_loc_id': $scope.warehouse_loc_id
            })
            .then(function (res) {
                if (res.data.response != null) {
                    $scope.columns2 = [];
                    $scope.prod_warehouse_loc_add_cost_data = [];
                    $scope.prod_warehouse_loc_add_cost_data = res.data.response;
                    //console.log(res.data.response);

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns2.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
            });

        //get product loc additional cost end
    } */

    $scope.edit_warehouse_location = function (rec) {
        //console.log(rec);
        var id = rec.id;
        var bin_loc_id = rec.loc_id;
        var warehouse_id = rec.warehouse_id;

        $scope.check_item_readonly = true;
        $scope.check_item_warehouse_readonly = true;
        $scope.showLoader = true;

        $scope.warehouse_loc_ListingShow = false;
        $scope.warehouse_loc_FormShow = true;

        $scope.prod_warehouse_loc_add_cost_buttons_Show = false;

        $scope.arr_warehouse = [];
        $scope.cost_types = [];
        $scope.loc_list = [];

        $scope.cost_types = [
            { title: 'Fixed', id: '1' },
            { title: 'Daily', id: '2' },
            { title: 'Weekly', id: '3' },
            { title: 'Monthly', id: '4' },
            { title: 'Annually', id: '5' }];

        var prod_warehouse_loc_Url = $scope.$root.setup + "warehouse/get-prod-warehouse-loc-byid";
        var postViewData = {
            'token': $scope.$root.token,
            'id': id,
            'wrh_id': warehouse_id,
            'bin_loc_wrh_id': bin_loc_id,
            'prod_id': $stateParams.id,
            'warehouse_loc_id': id
        };

        $http
            .post(prod_warehouse_loc_Url, postViewData)
            .then(function (res1) {
                if (res1.data.ack == true) {
                    //console.log(res1.data.response); return false;

                    $scope.rec2 = res1.data.response;
                    $scope.rec2.id = res1.data.response.id;
                    $scope.arr_warehouse = res1.data.response.arr_warehouse;

                    angular.forEach($scope.arr_warehouse, function (obj) {
                        if (obj.id == res1.data.response.warehouse_id)
                            $scope.rec2.warehouse = obj;
                    });

                    if (res1.data.response.currency_id > 0) {

                        angular.forEach($rootScope.arr_currency, function (elem) {
                            if (elem.id == res1.data.response.currency_id)
                                $scope.rec2.currency = elem;
                        });
                    }
                    else {

                        angular.forEach($rootScope.arr_currency, function (elem) {
                            if (elem.id == $scope.$root.defaultCurrency)
                                $scope.rec2.currency = elem;
                        });
                    }

                    angular.forEach($scope.make_default, function (obj) {
                        if (obj.id == res1.data.response.default_warehouse)
                            $scope.rec2.default_warehouse = obj;
                    });

                    angular.forEach($scope.warehouse_status_list, function (obj) {
                        if (obj.id == res1.data.response.status)
                            $scope.rec2.status_ids = obj;
                    });

                    angular.forEach($rootScope.uni_prooduct_arr, function (elem) {
                        if (elem.id == res1.data.response.uom_id)
                            $scope.rec2.dimension = elem;
                    });

                    angular.forEach($scope.cost_types, function (elem) {
                        if (elem.id == res1.data.response.cost_type_id)
                            $scope.rec2.cost_type = elem;
                    });

                    if (res1.data.response.WarehouseLocations != null) {
                        $scope.loc_list = res1.data.response.WarehouseLocations;

                        $scope.rec2.loc_warehouse = 1;

                        angular.forEach($scope.loc_list, function (elem) {
                            if (elem.id == res1.data.response.warehouse_loc_id)
                                $scope.rec2.location = elem;
                        });

                        $scope.item_warehouse_loc_add_cost_setup_Show = true;
                        $scope.warehouse_loc_add_cost_setup_Show = true;
                    }

                    $scope.warehouse_loc_add_cost_FormShow = false;
                    $scope.warehouse_loc_add_cost_List_Show = true;

                    $scope.warehouse_loc_id = id;

                    //get bin loc additional cost for product module start

                    if (res1.data.response.warehouse_loc_add_cost_setup_Show.length > 0) {
                        $scope.columns1 = [];
                        $scope.bin_loc_add_cost_data = [];
                        $scope.bin_loc_add_cost_data = res1.data.response.warehouse_loc_add_cost_setup_Show;

                        //console.log(res1.data.response.warehouse_loc_add_cost_setup_Show);

                        angular.forEach(res1.data.response.warehouse_loc_add_cost_setup_Show[0], function (val, index) {
                            $scope.columns1.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
                        $scope.warehouse_loc_add_cost_setup_Show = true;
                    }
                    //get bin loc additional cost for product module end

                    //get product loc additional cost start

                    if (res1.data.response.prodWarehouseLocAddCostSetup.length > 0) {

                        $scope.columns2 = [];
                        $scope.prod_warehouse_loc_add_cost_data = [];
                        $scope.prod_warehouse_loc_add_cost_data = res1.data.response.prodWarehouseLocAddCostSetup;
                        //console.log(res.data.response);

                        angular.forEach(res1.data.response.prodWarehouseLocAddCostSetup[0], function (val, index) {
                            $scope.columns2.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
                    }
                    //get product loc additional cost end

                    $scope.additional_cost_title = res1.data.response.additionalCostTitle;
                    // $scope.additional_cost_title.push({ 'id': '-1', 'title': '++ Add New ++' });

                    $scope.showLoader = false;
                }
            });
    }

    $scope.delete_warehouse_location = function (id, index, arr_data) {
        var delUrl = $scope.$root.setup + "warehouse/delete-prod-warehouse-loc";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', res.data.success);
                        $timeout(function () {
                            $scope.warehouse_location();
                        }, 1000);
                    } else {
                        toaster.pop('error', 'Deleted', res.data.error);
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.prod_warehouse_loc_History = function (id, rec) {

        var postUrl = $scope.$root.setup + "warehouse/alt-prod-warehouse-loc-History";
        $scope.add_cost_del_chk = 0;

        $http
            .post(postUrl, { 'token': $scope.$root.token, 'wrh_loc_id': id })
            .then(function (res2) {

                $scope.columns2 = [];
                $scope.warehouse_loc_History = [];

                if (res2.data.ack == true) {
                    $scope.warehouse_loc_History = res2.data.response;
                    // console.log($scope.warehouse_loc_History);
                    //$scope.add_cost_del_chk = 1;

                    $scope.cost_modal_title = rec.warehouse + " - Product Warehouse Location & Cost History ";

                    angular.forEach(res2.data.response[0], function (val, index) {
                        $scope.columns2.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    // angular.element('#cost_history_modal').modal({show: true});
                    angular.element('#cost_modal').modal({ show: true });
                }
                else {
                    toaster.pop('error', 'Error', 'No History Exists. ');
                    // angular.element('#cost_history_modal').modal('hide');
                    angular.element('#cost_modal').modal({ show: true });
                }

            });
    }

    $scope.delete_warehouse_loc_History = function (id, index, arr_data) {

        var delUrl = $scope.$root.setup + "warehouse/delete-prod-warehouse-loc-History";

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
    }

    $scope.additional_cost_History_modal = function (id, title) {

        var postUrl = $scope.$root.setup + "warehouse/alt-prod-warehouse-loc-add-cost-History";

        $scope.cost_modal_title = "";
        $scope.add_cost_del_chk = 0;

        $http
            .post(postUrl, { 'token': $scope.$root.token, 'wrh_loc_id': id })
            .then(function (res4) {

                $scope.columns4 = [];
                $scope.warehouse_loc_History = [];

                if (res4.data.ack == true) {
                    $scope.warehouse_loc_History = res4.data.response;

                    $scope.cost_modal_title = "Additional Cost History ";
                    //$scope.add_cost_del_chk = 1;

                    angular.forEach(res4.data.response[0], function (val, index) {
                        $scope.columns4.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    angular.element('#additional_cost_history_modal').modal({ show: true });
                }
                else {
                    toaster.pop('error', 'Error', 'No History Exists. ');
                    angular.element('#additional_cost_history_modal').modal('hide');
                }
            });
    }

    $scope.delete_additional_cost_History = function (id, index, arr_data) {

        var delUrl = $scope.$root.setup + "warehouse/delete-prod-warehouse-loc-add-cost-History";

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
    }

    $scope.show_add_cost_pop = function (id) {

        var product_warehouse_loc_add_cost_Url = $scope.$root.setup + "warehouse/alt-prod-warehouse-loc-add-cost";

        $scope.cost_modal_title = "";

        $http
            .post(product_warehouse_loc_add_cost_Url, {
                'token': $scope.$root.token,
                'prod_id': $scope.$root.product_id,
                'warehouse_loc_id': id
            })
            .then(function (res2) {
                $scope.columns2 = [];
                $scope.warehouse_loc_History = [];

                if (res2.data.ack == true) {

                    //console.log(res.data.response);

                    $scope.warehouse_loc_History = res2.data.response;
                    $scope.cost_modal_title = "Product Warehouse Additional Cost";

                    angular.forEach(res2.data.response[0], function (val, index) {
                        $scope.columns2.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    angular.element('#cost_modal').modal({ show: true });

                } else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(525));
                    angular.element('#cost_modal').modal('hide');
                }
            });
    }

    // ---------------- Warehouse allocation End  	 -----------------------------------------

    // ---------------- Warehouse allocation Additional cost start 	 -----------------------------------------

    $scope.prod_warehouse_loc_add_cost_Form = function (bin_loc_id) {

        $scope.warehouse_loc_add_cost_FormShow = true;
        $scope.warehouse_loc_add_cost_List_Show = false;
        $scope.check_item_readonly = true;
        $scope.check_add_modal_readonly = false;

        $scope.prod_warehouse_loc_add_cost_buttons_Show = true;
        $scope.rec3 = {};
        $scope.showLoader = true;

        var whAddCostUrl = $scope.$root.setup + "warehouse/get-warehouse-loc-additional-cost-title";
        $http
            .post(whAddCostUrl, { 'token': $scope.$root.token, 'product_id': $stateParams.id })
            .then(function (res) {

                if (res.data.ack == true) {
                    $scope.additional_cost_title = [];
                    $scope.additional_cost_title = res.data.response;
                    $scope.additional_cost_title.push({ 'id': '-1', 'title': '++ Add New ++' });
                }
                else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(232, ['Warehouse']));
                $scope.showLoader = false;
            });

        /* $scope.check_item_readonly = false; */
        $scope.rec3.status_ids = $scope.warehouse_status_list[0];
        $scope.rec3.additional_cost_sdate = $scope.rec2.warehouse_loc_sdate;

        angular.element('#itemWarehouseCostSetupModal').modal({ show: true });
    }

    $scope.warehouse_loc_add_cost_popup = function (loc_id) {
        $scope.rec3 = {};
        // console.log(loc_id);

        //  $scope.popup_title = $scope.rec.name + " : " + $scope.rec2.title + "  ";

        $scope.warehouse_loc_add_cost_FormShow = false;
        $scope.warehouse_loc_add_cost_List_Show = true;

        $scope.warehouse_loc_id = loc_id;
        $scope.showLoader = true;

        var prod_warehouse_loc_add_cost_Url = $scope.$root.setup + "warehouse/alt-prod-warehouse-loc-add-cost";

        $http
            .post(prod_warehouse_loc_add_cost_Url, {
                'token': $scope.$root.token,
                'prod_id': $scope.$root.product_id,
                'warehouse_loc_id': $scope.warehouse_loc_id
            })
            .then(function (res) {
                if (res.data.response != null) {
                    $scope.columns2 = [];
                    $scope.prod_warehouse_loc_add_cost_data = [];
                    $scope.prod_warehouse_loc_add_cost_data = res.data.response;

                    //console.log(res.data.response);

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns2.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }


                angular.element('#prod_warehouse_loc_add_cost_modal').modal({ show: true });
            });

        $scope.showLoader = false;
    }

    $scope.general_warehouse_loc_add_cost = function () {


        var warehouse_loc_add_cost_Url = $scope.$root.setup + "warehouse/alt-prod-warehouse-loc-add-cost";
        $scope.rec3 = {};

        $http
            .post(warehouse_loc_add_cost_Url, {
                'token': $scope.$root.token,
                'prod_id': $scope.$root.product_id,
                'warehouse_loc_id': $scope.warehouse_loc_id
            })
            .then(function (res) {
                if (res.data.response != null) {
                    $scope.columns2 = [];
                    $scope.prod_warehouse_loc_add_cost_data = [];
                    $scope.prod_warehouse_loc_add_cost_data = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns2.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
            });
        $scope.warehouse_loc_add_cost_FormShow = false;
        $scope.warehouse_loc_add_cost_List_Show = true;
    }

    $scope.add_warehouse_loc_add_cost = function (rec3) {

        rec3.prod_id = $scope.$root.product_id;
        rec3.token = $scope.$root.token;
        rec3.warehouse_loc_id = $scope.warehouse_loc_id;



        /* if (rec3.title == undefined || rec3.cost == undefined){
            return false;            
        } */

        if (rec3.title !== undefined) {
            rec3.title_id = rec3.title.id;
        }
        else {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Title']));
            return false;
        }

        if (rec3.status_ids !== undefined)
            rec3.status = rec3.status_ids.id;
        else {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Status']));
            return false;
        }

        // console.log($scope.rec2.dimension);

        rec3.dimension = $scope.rec2.dimension;
        rec3.cost_type = $scope.rec2.cost_type;

        if (rec3.dimension !== undefined)
            rec3.dimensions_id = rec3.dimension.id;
        else {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));
            return false;
        }

        if (rec3.cost_type !== undefined)
            rec3.cost_type_id = rec3.cost_type.id;
        else {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Cost Frequency']));
            return false;
        }

        if (!rec3.cost > 0) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Cost']));
            return false;
        }

        $scope.showLoader = true;

        var add_warehouse_loc_add_cost_Url = $scope.$root.setup + "warehouse/add-prod-warehouse-loc-add-cost";

        if (rec3.id != undefined)
            var add_warehouse_loc_add_cost_Url = $scope.$root.setup + "warehouse/update-prod-warehouse-loc-add-cost";

        /* console.log(rec3);
        return false; */

        $http
            .post(add_warehouse_loc_add_cost_Url, rec3)
            .then(function (res) {

                if (res.data.ack == true) {
                    $scope.general_warehouse_loc_add_cost();

                    $scope.prod_warehouse_loc_add_cost_buttons_Show = false;

                    if (rec3.id > 0)
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    else {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    }
                    $scope.showLoader = false;
                    $scope.showdataaddcost = true;
                    $scope.check_add_modal_readonly = true;
                    angular.element('#itemWarehouseCostSetupModal').modal('hide');
                }
                else {
                    if (rec3.id > 0)
                        toaster.pop('error', 'Edit', res.data.error);
                    else
                        toaster.pop('error', 'Error', res.data.error);

                    $scope.showLoader = false;
                }
            });
    }

    $scope.edit_warehouse_loc_add_cost = function (id) {

        $scope.check_item_readonly = true;
        $scope.showLoader = true;
        $scope.check_add_modal_readonly = true;
        $scope.rec3 = {};

        $scope.rec3.prod_id = $scope.$root.product_id;
        $scope.rec3.warehouse_loc_id = $scope.warehouse_loc_id;

        // var prod_warehouse_loc_Url = $scope.$root.setup + "warehouse/get-prod-warehouse-loc-add-cost-by-id";
        var prod_warehouse_loc_Url = $scope.$root.setup + "warehouse/get-item-warehouse-loc-add-cost-by-id";
        var postViewData = {
            'token': $scope.$root.token,
            'id': id,
            'warehouse_loc_id': $scope.warehouse_loc_id
        };

        $http
            .post(prod_warehouse_loc_Url, postViewData)
            .then(function (res3) {

                if (res3.data.ack == true) {
                    $scope.rec3 = res3.data.response;
                    $scope.rec3.id = res3.data.response.id;
                    $scope.additional_cost_title = res3.data.additionalCostTitle;

                    $scope.rec3.cost = parseFloat(res3.data.response.cost);

                    angular.forEach($scope.warehouse_status_list, function (obj) {
                        if (obj.id == res3.data.response.status)
                            $scope.rec3.status_ids = obj;
                    });

                    angular.forEach($rootScope.uni_prooduct_arr, function (elem) {
                        if (elem.id == res3.data.response.dimensions_id)
                            $scope.rec3.dimension = elem;
                    });

                    angular.forEach($scope.cost_types, function (elem) {
                        if (elem.id == res3.data.response.cost_type_id)
                            $scope.rec3.cost_type = elem;
                    });

                    angular.forEach($scope.additional_cost_title, function (elem) {
                        if (elem.id == res3.data.response.add_cost_title_id)
                            $scope.rec3.title = elem;
                    });

                    $scope.warehouse_loc_add_cost_FormShow = true;
                    $scope.warehouse_loc_add_cost_List_Show = false;
                    $scope.prod_warehouse_loc_add_cost_buttons_Show = true;
                    angular.element('#itemWarehouseCostSetupModal').modal({ show: true });
                }
                $scope.showLoader = false;
            });
    }

    $scope.delete_warehouse_loc_add_cost = function (id, index, arr_data) {
        var delUrl = $scope.$root.setup + "warehouse/delete-prod-warehouse-loc-add-cost";
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
                        angular.element('#itemWarehouseCostSetupModal').modal('hide');
                    } else {
                        toaster.pop('error', 'Deleted', res.data.error);
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    }

    $scope.getTotal_additional_cost = function (int) {

        var Total_additional_cost = 0;

        angular.forEach($scope.prod_warehouse_loc_add_cost_data, function (el) {
            Total_additional_cost = Number(Total_additional_cost) + Number(el.Cost);
        });

        return Total_additional_cost;
    }

    $scope.check_conversion_rate = function (currency) {
        // console.log(currency);
        if (currency != $scope.$root.defaultCurrency) {
            var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
            // var currencyURL = $scope.$root.setup + "general/get-currency";
            $http
                .post(currencyURL, { 'id': currency, token: $scope.$root.token })
                .then(function (res) {
                    // console.log(res);
                    if (res.data.ack == true) {

                        if (res.data.response.conversion_rate == null) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Currency Conversion Rate']));
                            $scope.rec2.currency = "";
                            return;
                        }
                    } else {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Currency Conversion Rate']));
                        $scope.rec2.currency = "";
                        return;
                    }
                });
        } else return true;
    }

    // ---------------- Warehouse allocation Additional cost End 	 -----------------------------------------

    //--------------------   Warehouse Additional Cost Title --------------------
    $scope.additional_cost_Data = {};

    $scope.onChange_additional_cost_title = function () {

        var id = this.rec3.title.id;
        //console.log(id );

        if (id == -1)
            angular.element('#model_additional_cost_title').modal({ show: true });

        angular.element("#title").val('');
        $scope.additional_cost_Data.title = '';
    }

    $scope.add_additional_cost_title = function (additional_cost_Data) {

        var add_additional_cost_title_Url = $scope.$root.setup + "warehouse/add-warehouse-loc-additional-cost-title";
        var additional_cost_title_Url = $scope.$root.setup + "warehouse/get-warehouse-loc-additional-cost-title";

        $scope.additional_cost_Data.token = $scope.$root.token;
        //$scope.additional_cost_Data.title = $scope.additional_cost_Data.title;

        if ($scope.additional_cost_Data.title == "" || $scope.additional_cost_Data.title == null) {
            return false;
        }

        $http
            .post(add_additional_cost_title_Url, additional_cost_Data)
            .then(function (res) {
                if (res.data.ack == true) {

                    toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));

                    angular.element('#model_additional_cost_title').modal('hide');

                    $http
                        .post(additional_cost_title_Url, { 'token': $scope.$root.token })
                        .then(function (res) {
                            if (res.data.ack == true) {
                                $scope.additional_cost_title.push({ 'id': '', 'title': '' });
                                $scope.additional_cost_title = res.data.response;

                                angular.forEach($scope.additional_cost_title, function (elem) {
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

    $scope.closeAdditionalCostTitle = function () {
        angular.element('#model_additional_cost_title').modal('hide');
    }

    //--------------------   Warehouse end --------------------






    $scope.order_category_list = function (title, arg) {

        $http
            .post(get_unit_setup_category, {
                'token': $scope.$root.token,
                'product_id': $scope.formData.product_id,
                'product_code': $scope.formData.product_code
            })
            .then(function (vol_data) {
                $scope.list_category = [];
                if (vol_data.data.ack == true) {

                    $scope.list_category = vol_data.data.response;

                    if (arg == 1) {
                        angular.forEach($scope.list_category, function (obj) {
                            if (obj.name == title)
                                $scope.formData.reoder_point_unit_id = obj;
                        });
                    }
                    else {
                        angular.forEach($scope.list_category, function (obj) {
                            if (obj.id == $scope.formData.reoder_point_unit_id)
                                $scope.formData.reoder_point_unit_id = obj;
                        });
                    }


                    if (arg == 1) {
                        angular.forEach($scope.list_category, function (obj) {
                            if (obj.name == title)
                                $scope.formData.max_order_unit_id = obj;
                        });
                    }
                    else {

                        angular.forEach($scope.list_category, function (obj) {
                            if (obj.id == $scope.formData.max_order_unit_id)
                                $scope.formData.max_order_unit_id = obj;
                        });

                    }


                    if (arg == 1) {
                        angular.forEach($scope.list_category, function (obj) {
                            if (obj.name == title)
                                $scope.formData.min_order_unit_id = obj;
                        });
                    }
                    else {
                        angular.forEach($scope.list_category, function (obj) {
                            if (obj.id == $scope.formData.min_order_unit_id)
                                $scope.formData.min_order_unit_id = obj;
                        });
                    }
                }
                //  else toaster.pop('error', 'Error', 'Base UOM is not Set up.');
            });
    }


    //image Upload //imran Code  with image upload after submit

    var content = 'file content';
    var blob = new Blob([content], { type: '*' });
    $scope.url = (window.URL || window.webkitURL).createObjectURL(blob);

    $scope.check_file = 0;
    $scope.new_files_title = [];

    $scope.onFileSelect = function ($files) {

        $scope.str_files = [];
        angular.forEach($files, function (file, key) {
            $scope.files.push(file);
            $scope.check_files = 1;
            //$scope.str_files.push({name:file.name,index:key});
            /*$scope.comp_files.push({file:file.name,index:key});
             $scope.temp_files.push(file.name);*/

        });
    }

    $scope.removeFile = function (index) {
        $scope.files.splice(index, 1);
        if ($scope.files.length < 1)
            $scope.check_file = 0;
    }

    //image Upload //imran Code  with image upload after submit




    $scope.selected_count = 0;
    $scope.searchKeyword_del = {};
    $scope.get_all_del_product = function (arg, item_paging, chk) {
        $scope.title = ' List of Deleted Items(s)';
        var postData_sale = {};
        $scope.showLoader = true;
        /*var postData_sale = {
         'token': $scope.$root.token,
         'edit_id': arg,
         'product_id': $scope.formData.product_id
         };*/

        postData_sale.token = $scope.$root.token;
        postData_sale.product_id = $scope.formData.product_id;
        postData_sale.edit_id = arg;

        if (item_paging == 1)
            $rootScope.item_paging.spage = 1;

        postData_sale.page = $rootScope.item_paging.spage;

        postData_sale.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;

        if (postData_sale.pagination_limits == -1) {
            postData_sale.page = -1;
            $scope.selection_record = {};
        }

        //		postData_sale.searchBox = $scope.searchKeyword.searchBox;

        if (chk == 77) {
            $scope.searchKeyword_del = {};
        }

        if ($scope.searchKeyword_del.units != null)
            postData_sale.unitss = $scope.searchKeyword_del.units !== undefined ? $scope.searchKeyword_del.units.id : 0;

        if ($scope.searchKeyword_del.brand_name != null)
            postData_sale.brand_names = $scope.searchKeyword_del.brand_name !== undefined ? $scope.searchKeyword_del.brand_name.id : 0;

        if ($scope.searchKeyword_del.category_name != null)
            postData_sale.category_names = $scope.searchKeyword_del.category_name !== undefined ? $scope.searchKeyword_del.category_name.id : 0;

        if ($scope.searchKeyword_del.searchBox != '')
            postData_sale.searchBox = $scope.searchKeyword_del.searchBox;


        var getdelUrl = $scope.$root.stock + "products-listing/get-delete-product-list";
        $http
            .post(getdelUrl, postData_sale)
            .then(function (res) {
                $scope.selection_record_del = {};
                $scope.columnss = [];

                if (res.data.ack == true) {
                    $scope.selected_count = res.data.selected_count;
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.selection_record_del = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {

                        $scope.columnss.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    var test_name = '';
                    angular.forEach(res.data.response, function (value) {
                        if (value.checked == 1) {
                            test_name += value.description + ";";
                            angular.element('#selected__del' + value.id).click();
                            angular.element('.pic_block_del_list').attr("disabled", false);
                        }
                    });

                    $scope.display_del_record = test_name.substring(0, test_name.length - 1);
                    // document.getElementById("display_del_record").innerHTML = test_name.substring(0, test_name.length - 1);
                    // document.getElementById("display_del_once").value = test_name.substring(0, test_name.length - 5);
                    $scope.selected_del_link_items = test_name.substring(0, test_name.length - 5);
                    $scope.showLoader = false;
                }
                else
                    $scope.showLoader = false;
                //toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            });

        if ((arg == 2)) {//&& ($scope.selected_count ==0
            angular.element('#model_product_del_list').modal({
                show: true
            });
        }
    }

    $scope.add_product_list = function (item) {
        $scope.rec = {};

        $scope.selectedList_del = [];

        angular.forEach($scope.selection_record_del, function (obj) {
            if (angular.element('#selected__del' + index.id).prop('checked'))
                $scope.selectedList_del.push(obj);
        });

        var test_name = '';
        var test_id = '';

        angular.forEach($scope.selectedList_del, function (obj) {
            for (var i = 0; i < $scope.selection_record_del.length; i++) {
                var object = $scope.selection_record_del[i];

                if (object.id == obj.id) {
                    test_id += obj.id + ",";
                    test_name += obj.description + ";";
                }
            }
            $scope.rec.del_name = test_name;
            $scope.rec.del_product_id = test_id;
        });

        // console.log(test_name);	return;

        //single
        //	 $scope.rec.del_product_id= item.id +",";
        //	 $scope.rec.del_name = item.description+",";
        // 	$scope.formData.link_name =item.description;

        $scope.display_del_record = test_name.substring(0, $scope.rec.del_name.length - 1);
        $scope.selected_del_link_items = test_name.substring(0, $scope.rec.del_name.length - 5);


        $scope.rec.product_id = $scope.formData.product_id;
        $scope.rec.token = $scope.$root.token;
        $scope.rec.sale_selling_checks = $scope.rec.sale_selling_check !== undefined ? $scope.rec.sale_selling_check.id : 0;

        var addUrl = $scope.$root.stock + "products-listing/add-delete-product-list";
        var var_msg = 'Add';
        var var_error = 'Record Inserted Successfully .';

        $http
            .post(addUrl, $scope.rec)
            .then(function (res) {
                if (res.data.ack == true) {

                    toaster.pop('success', var_msg, var_error);
                    angular.element('#model_product_del_list').modal('hide');
                }
                else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(106));
            });
    }

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
    }


    $scope.checksingle_del_list_edit = function (classname) {
        angular.element('.pic_block_del_list').attr("disabled", false);
        angular.element(".new_button_" + classname).hide();
        angular.element(".replace_button_" + classname).show();
        var count = 0;

        angular.forEach($scope.selection_record_del, function (item) {
            var bool = angular.element("#selected__del" + item.id).is(':checked');
            if (bool)
                count++;
            else
                angular.element('#selecctall').prop('checked', false);
        });
    }

    $scope.calculate_total_del_list = function () {
        var count = 0;

        angular.forEach($scope.selection_record_del, function (value) {
            if (angular.element('#selected__del' + value.id).prop('checked'))
                count++;
        });

        if (count != 0) {
            angular.element('#from_selected').hide();
            angular.element('#from_ch_selected').show();
        }
        else {
            angular.element('#from_selected').show();
            angular.element('#from_ch_selected').hide();
        }

        return count;
    }

    $scope.get_del_product = function (arg) {


        var postData_sale = {
            'token': $scope.$root.token,
            'edit_id': arg,
            'product_id': $scope.formData.product_id
        };

        var getdelUrl = $scope.$root.stock + "products-listing/get-delete-product-list";
        $http
            .post(getdelUrl, postData_sale)
            .then(function (res) {
                $scope.selection_record_del = [];
                $scope.columns_del = [];
                if (res.data.ack == true) {

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_del.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    $scope.selected_count = res.data.selected_count;

                    angular.forEach(res.data.response, function (catObj) {
                        if (catIndex.checked == 1)
                            $scope.selection_record_del.push(catObj);
                    });

                    angular.element('#model_record_list_delete').modal({ show: true });
                }
                else toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            });
    }

    $scope.delete_del_product = function (id, index, arr_data) {
        var delUrl = $scope.$root.stock + "products-listing/delete-del-single";

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
                        $scope.get_all_del_product(1);
                    } else {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            // console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.searchKeyword_sub = {};

    $scope.display_sub_record = "";



    $scope.add_product_substitute_list = function (item) {

        $scope.rec = {};
        $scope.selectedList = [];

        angular.forEach($scope.selection_record, function (obj) {
            if (angular.element('#selected_subs_' + obj.id).prop('checked'))
                $scope.selectedList.push(obj);
        });


        var test_name = '';
        var test_id = '';
        angular.forEach($scope.selectedList, function (obj) {
            for (var i = 0; i < $scope.selection_record.length; i++) {
                var object = $scope.selection_record[i];
                if (object.id == obj.id) {
                    test_id += obj.id + ",";
                    test_name += obj.description + "; ";
                }
            }
            $scope.rec.del_name = test_name;
            $scope.rec.del_product_id = test_id;
        });

        $scope.display_sub_record = test_name.substring(0, test_name.length - 1);
        $scope.selectedsubitems = test_name.substring(0, test_name.length - 1);


        $scope.rec.product_id = $scope.formData.product_id;
        $scope.rec.token = $scope.$root.token;
        $scope.rec.sale_selling_checks = $scope.rec.sale_selling_check !== undefined ? $scope.rec.sale_selling_check.id : 0;

        var addUrl = $scope.$root.stock + "products-listing/add-substitute-product-list";
        var var_msg = 'Add';
        var var_error = 'Record Inserted Successfully .';

        $http
            .post(addUrl, $scope.rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', var_msg, var_error);
                    angular.element('#model_product_substittue_list').modal('hide');
                }
                else toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(106));
            });
    }

    /* $scope.checkAll_subs_list = function () {
        $scope.selectedList = '';
        $scope.Selected = '';

        var bool = angular.element("#selecctall_subs").is(':checked');
        if (!bool)
            angular.element('.pic_block_sub_list').attr("disabled", true);
        else
            angular.element('.pic_block_sub_list').attr("disabled", false);

        // alert(bool);
        angular.forEach($scope.selection_record, function (item) {
            angular.element('#selected_subs_' + item.id).prop('checked', bool);
        });
    }

    $scope.checksingle_subs_list_edit = function (classname) {
        angular.element('.pic_block_sub_list').attr("disabled", false);

        angular.element(".new_button_" + classname).hide();
        angular.element(".replace_button_" + classname).show();
        var count = 0;
        angular.forEach($scope.selection_record, function (item) {
            var bool = angular.element("#selected_subs_" + item.id).is(':checked');
            if (bool) {
                count++;
            } else {
                angular.element('#selecctall_subs').prop('checked', false);
            }
        });
    }; */

    $scope.calculate_total_subs_list = function () {
        var count = 0;
        angular.forEach($scope.selection_record, function (value) {
            if (angular.element('#selected_subs_' + value.id).prop('checked'))
                count++;
        });

        if (count != 0) {
            angular.element('#from_selected_subs').hide();
            angular.element('#from_ch_selected_subs').show();
        } else {
            angular.element('#from_selected_subs').show();
            angular.element('#from_ch_selected_subs').hide();
        }

        return count;
    }

    $scope.get_substitute_product = function (arg) {

        var postData_sale = {
            'token': $scope.$root.token,
            'edit_id': arg,
            'product_id': $scope.formData.product_id
        };

        var getdelUrl = $scope.$root.stock + "products-listing/get-sel-substitute-product-list";
        $http
            .post(getdelUrl, postData_sale)
            .then(function (res) {
                $scope.selection_record_subs = [];
                $scope.columns_subs = [];
                if (res.data.ack == true) {

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_subs.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    $scope.selected_count = res.data.selected_count;
                    // $scope.selection_record_subs = res.data.response;
                    var selectedsubitems_name = "";

                    angular.forEach(res.data.response, function (catObj) {
                        if (catObj.checked == 1) {
                            $scope.selection_record_subs.push(catObj);
                            selectedsubitems_name += catObj.description + "; ";
                        }
                    });

                    $scope.selectedsubitems = selectedsubitems_name.substring(0, selectedsubitems_name.length - 1);

                    angular.element('#model_record_list_subs').modal({ show: true });
                }
                else toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            });
    }

    $scope.delete_setup_substitite = function (id, index, arr_data) {
        var delUrl = $scope.$root.stock + "products-listing/delete-substitute-single";

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
                        $scope.get_all_substitute_product(1);
                    } else {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            // console.log('Modal promise rejected. Reason: ', reason);
        });


    };


    $scope.get_parent = function () {

        var id = this.formData.category_ids.id;


        var purchase_url = $scope.$root.gl + "chart-accounts/gl-type";
        $http
            .post(purchase_url, { 'token': $scope.$root.token, 'type_id': id })
            .then(function (res) {
                $scope.column_gl = [];
                $scope.record_gl = {};


                if (res.data.ack == true) {
                    $scope.record_gl = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.column_gl.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }

            });
    }

    $scope.getpurchaseGL = function (arg) {

        if (arg == 'saleperson') {
            $scope.type_id = 1;
        }
        if (arg == 'sale') {
            $scope.type_id = 2;
        }

        $scope.category_list = {};
        var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";
        $http
            .post(postUrl_cat, { 'token': $scope.$root.token })
            .then(function (res) {
                $scope.category_list = [];
                if (res.data.ack == true)
                    $scope.category_list = res.data.response;
                else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(232, ['G/L Category']));
            });
        //	$scope.category_list = [];$scope.record = {};

        var purchase_url = $scope.$root.gl + "chart-accounts/gl-type";
        $http
            .post(purchase_url, { 'token': $scope.$root.token, 'type_id': 1 })
            .then(function (res) {
                $scope.column_gl = [];
                $scope.record_gl = {};

                if (res.data.ack == true) {
                    $scope.record_gl = res.data.response;
                    // console.log($scope.record_gl );
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.column_gl.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }

            });


        ngDialog.openConfirm({
            // template: 'modalDialogId_GL',
            templateUrl: 'app/views/product_values/glcode_listing_modal.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (result) {
            if (arg == 'saleperson') {
                //	console.log(result);
                $scope.formData.purchase_code = result.number;
                $scope.formData.purchase_code_id = result.id;
            }
            if (arg == 'sale') {
                $scope.formData.sales_code = result.number;
                $scope.formData.sales_code_id = result.id;
            }

        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }







    // ---------------- Accounts Activity Start 	 -----------------------------------------

    $scope.openDocumentLink = function (record) {
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        var url;
        if (record.docType == 'Sales Order') {
            url = $state.href("app.editOrder", ({ id: record.order_id }));
        }
        else if (record.docType == 'Sales Invoice') {
            url = $state.href("app.viewOrder", ({ id: record.order_id, isInvoice: 1 }));
        }
        else if (record.docType == 'Credit Note') {
            url = $state.href("app.viewReturnOrder", ({ id: record.order_id, isInvoice: 1 }));
        }
        else if (record.docType == 'Purchase Order') {
            url = $state.href("app.viewsrmorder", ({ id: record.order_id }));
        }
        else if (record.docType == 'Purchase Invoice') {
            url = $state.href("app.viewsrminvoice", ({ id: record.order_id }));
        }
        else if (record.docType == 'Debit Note') {
            url = $state.href("app.viewsrmorderreturninvoice", ({ id: record.order_id }));
        }
        else if (record.docType == 'Item Journal') {
            url = $state.href("app.view-receipt-journal-gl-item", ({ id: record.order_id }));
        }
        else if (record.docType == 'Transfer Stock') {
            url = $state.href("app.view-transfer-order", ({ id: record.order_id }));
        }
        else if (record.docType == 'Stock Opening Balance') {
            url = $state.href("app.openingBalances", ({ module: 'stock' }));
        }
        else {
            return;
        }
        window.open(url, '_blank');

    }

    $scope.searchKeyword = {};

    $scope.account_activity = function (item_paging) {
        $scope.showLoader = true;
        // $scope.$root.breadcrumbs[3].name = 'Activity';//$scope.$root.product_id
        var get_account_activity_url = $scope.$root.gl + "chart-accounts/get-jl-journal-receipt-payment-item";
        $scope.postData = {};

        if (item_paging == 1) $scope.item_paging.spage = 1;

        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        $scope.postData.token = $scope.$root.token;
        $scope.postData.product_id = $stateParams.id;

        if ($scope.formData.rawMaterialProduct == true) {
            $scope.postData.rawMaterialProductChk = 1;
        }

        if (!$scope.searchKeyword.totalRecords)
            $scope.searchKeyword.totalRecords = 50;

        $scope.postData.searchKeyword = $scope.searchKeyword;

        $http
            .post(get_account_activity_url, $scope.postData)
            .then(function (res) {
                //console.log(res);
                $scope.account_activity_data = [];

                if (res.data.ack == true) {
                    $scope.tableData = res;
                    $scope.columns = [];
                    $scope.account_activity_data = res.data.response;

                    angular.forEach($scope.tableData.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    })

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

    // ---------------- Accounts Activity End 	     -----------------------------------------

    //barcode

    function makeEan13Barcode(s) {
        s = 0 + s;

        if (!/^[a-zA-Z0-9\-_]{0,50}$/.test(s))
            return 0; //throw; "Text must be 14 digits long";


        var table0 = ["LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG", "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL"];
        var table1 = ["11001", "10011", "10110", "00001", "01110", "00111", "01000", "00010", "00100", "11010"];
        var result = [];
        appendDigits(result, "010");  // Start
        var leftCtrl = table0[parseInt(s.charAt(0), 10)];  // Leading digit
        for (var i = 1; i < 7; i++) {  // Left remaining half
            var code = "1" + table1[parseInt(s.charAt(i), 10)] + "0";
            if (leftCtrl.charAt(i - 1) == "G") {
                var newCode = "";  // Reversed
                for (var j = code.length - 1; j >= 0; j--)
                    newCode += code.charAt(j);
                code = invertBits(newCode);
            }
            appendDigits(result, code);
        }
        appendDigits(result, "10101");  // Center
        for (var i = 7; i < 14; i++)  // Right remaining half
            appendDigits(result, invertBits("1" + table1[parseInt(s.charAt(i), 10)] + "0"));
        appendDigits(result, "010");  // End
        return result;
    }


    /*---- Shared utility functions ----*/

    // e.g. array = [1, 1]; appendDigits(arrlay, "001"); array equals [1, 1, 0, 0, 1].
    function appendDigits(arr, str) {
        for (var i = 0; i < str.length; i++)
            arr.push(+str.charAt(i));  // Abuses JavaScript weak type coercion
    }

    // e.g. array = []; appendRepeat(array, 1, 3); array equals [1,1,1].
    function appendRepeat(arr, digit, rep) {
        for (var i = 0; i < rep; i++)
            arr.push(digit);
    }


    // e.g. "001101" -> "110010".
    function invertBits(s) {
        return s.replace(/./g, function (d) {
            return (1 - d) + "";
        });  // Abuses JavaScript weak type coercion
    }


    // e.g. addCheckDigit(7, "3216548") -> "32165487".
    function addCheckDigit(len, s) {
        if (!/^\d*$/.test(s) || s.length != len)
            throw "Text must be " + len + " digits long";
        var sum = 0;
        for (var i = 0; i < s.length; i++) {
            var weight = i % 2 == 0 ? 3 : 1;  // Rightmost digit has weight of 3, then alternate 1 and 3
            sum += parseInt(s.charAt(s.length - 1 - i), 10) * weight;
        }
        return s + (10 - sum % 10) % 10;
    }


    // ---------------- invoice    	 -----------------------------------------

    $scope.getinvoice = function () {
        // $scope.$root.breadcrumbs[3].name = 'Invoicing';
        $scope.check_readonly = true;
    }

    $scope.addinvoice = function (formData) {

        var update = $scope.$root.stock + "products-listing/add-invoice";

        var var_msg = 'Add';

        if ($stateParams.id !== undefined)
            var var_msg = 'Edit';

        $scope.formData.product_id = $scope.$root.product_id;
        $scope.formData.token = $scope.$root.token;


        //console.log($scope.formData);//return false;
        //console.log($scope.formData.purchase_item_gl_codes);

        if ($scope.formData.purchase_item_gl_codes !== undefined && $scope.formData.purchase_item_gl_codes != 0) {
            var purchase_item_gl_code_full = $scope.formData.purchase_item_gl_codes;

            purchase_item_gl_code_full = purchase_item_gl_code_full.split(' - ');
            var purchase_item_gl_code = purchase_item_gl_code_full[0];
            // var item_gl_description = item_gl_code_full[1];

            $scope.formData.purchase_item_gl_code = purchase_item_gl_code;
        }
        //console.log($scope.formData.purchase_item_gl_code);


        if ($scope.formData.costing_method_id != null)
            $scope.formData.costing_method_ids = $scope.formData.costing_method_id !== undefined ? $scope.formData.costing_method_id.id : 0;

        $scope.formData.overall_avg_costs = $scope.$root.number_format_remove($scope.formData.overall_avg_cost, $scope.decimal_range);

        $http
            .post(update, $scope.formData)
            .then(function (res) {

                if (res.data.ack == true) {
                    toaster.pop('success', var_msg, $scope.$root.getErrorMessageByCode(102));

                } else
                    toaster.pop('error', var_msg, $scope.$root.getErrorMessageByCode(102));
            });
    }

    // ----------------         purchase info 	 --------------------------------------

    $scope.formData.standard_purchase_cost = '';
    $scope.checked_value = false;

    $scope.get_standard_price_purchase = function () {
        $scope.priceFormData.unit_price = '';
        $scope.checked_value = false;

        if (angular.element('#is_same_as_standard_purchase').is(':checked') == true) {
            $scope.priceFormData.unit_price = $scope.formData.standard_purchase_cost;

            $scope.priceFormData.purchase_measure = $scope.list_unit_item[0];
            $scope.change_unit_price();
            $scope.chkPrice();
            $scope.checked_value = true;
        }
    }

    $scope.st_price_change_purchase = function () {
        var rec2 = {};

        var addUrl = $scope.$root.stock + "products-listing/change-standard-purchase-info";
        rec2.product_id = $stateParams.id;
        rec2.token = $scope.$root.token;
        rec2.unit_price = $scope.formData.standard_purchase_cost;

        $http
            .post(addUrl, rec2)
            .then(function (res) {
                if (res.data.ack == true) {
                    //toaster.pop('success', 'Info', 'Price updated.');
                    $scope.get_purchase_sale_price(2);
                }
                //else toaster.pop('error', 'Error', 'Price  Not Updated .');
            });
    }


    $scope.showEditPurchase_form = function () {
        $scope.check_item_readonly_purchase = false;
        ////$scope.!check_item_readonly_purchase = true;
        $scope.check_item_readonly_purchase2 = true;

        $scope.priceFormData.average_cost = $scope.$root.number_format_remove($scope.priceFormData.average_cost, $scope.decimal_range);
        $scope.priceFormData.average_cost = $scope.priceFormData.average_cost;//.toFixed(2)

        $scope.priceFormData.unit_price = $scope.$root.number_format_remove($scope.priceFormData.unit_price, $scope.decimal_range);
        $scope.priceFormData.unit_price = $scope.priceFormData.unit_price;//.toFixed(2)
    }



    /* $scope.get_avg_overall_po = function () {
       // console.log($scope.show_price_sale_form);

         if ($scope.show_price_sale_form == true) {
            if ($scope.formData.avg_cost_sdate != null) {
                $scope.formData.finicial_year_start = angular.element("#ck_sdate1").val().split("/")[0] + "/" + angular.element("#ck_sdate1").val().split("/")[1] + "/" + angular.element("#ck_sdate1").val().split("/")[2];
            }
            if ($scope.formData.avg_cost_edate != null) {
                $scope.formData.finicial_year_end = angular.element("#ck_edate1").val().split("/")[0] + "/" + angular.element("#ck_edate1").val().split("/")[1] + "/" + angular.element("#ck_edate1").val().split("/")[2];
            }
        } 

        if ($scope.formData.avg_cost_sdate == 0 ||
            $scope.formData.avg_cost_sdate == null ||
            $scope.formData.avg_cost_sdate == 'undefined/undefined/' ||
            $scope.formData.avg_cost_edate == 0 ||
            $scope.formData.avg_cost_edate == null ||
            $scope.formData.avg_cost_edate == 'undefined/undefined/') {

            var get_finicial_year_url = $scope.$root.setup + "general/get-financial-setting";
            $http
                .post(get_finicial_year_url, { 'token': $scope.$root.token, 'id': $scope.$root.defaultCompany })
                .then(function (res) {

                    if (res.data.ack == true) {

                        $scope.formData.avg_cost_sdate = $scope.$root.convert_unix_date_to_angular(res.data.response.year_start_date);
                        $scope.formData.avg_cost_edate = $scope.$root.convert_unix_date_to_angular(res.data.response.year_end_date);

                         if ($scope.formData.avg_cost_sdate == null) 
                            $scope.formData.avg_cost_sdate = $scope.$root.convert_unix_date_to_angular(res.data.response.year_start_date);
                        
                        if ($scope.formData.avg_cost_edate == null) 
                            $scope.formData.avg_cost_edate = $scope.$root.convert_unix_date_to_angular(res.data.response.year_end_date); 

                        //$scope.formData.finicial_year_start=res.data.response.year_start_date.split("-")[2] + "/" + res.data.response.year_start_date.split("-")[1] + "/" + res.data.response.year_start_date.split("-")[0] ;
                        //$scope.formData.finicial_year_end=res.data.response.year_end_date.split("-")[2] + "/" + res.data.response.year_end_date.split("-")[1] + "/" + res.data.response.year_end_date.split("-")[0] ;

                        // $scope.formData.finicial_year_start= res.data.response.year_start_date;
                        //  $scope.formData.finicial_year_end= res.data.response.year_end_date;
                    }
                    //  else toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                });
        }
             ,
                'fsdate': $scope.formData.finicial_year_start,
                'fedate': $scope.formData.finicial_year_end 

        var get_avg = $scope.$root.stock + "products-listing/get-item-avg-overall-po";
        $http
            .post(get_avg, {
                'token': $scope.$root.token,
                'product_id': $stateParams.id,
                'sdate': $scope.formData.avg_cost_sdate,
                'edate': $scope.formData.avg_cost_edate
            })
            .then(function (res) {
                $scope.formData.overall_avg_cost = '';

                if (res.data.ack == true) {
                    if (res.data.avg != null)
                        $scope.formData.overall_avg_cost = $scope.$root.number_format(res.data.avg, $scope.decimal_range);
                }
                // $scope.formData.overall_avg_cost  =$scope.$root.number_format(1000000.00 ,$scope.decimal_range);
                //  else toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                angular.element('#model_avg_purchase_date').modal('hide');
            });
    } */

    $scope.get_avg_price_purchase_info = function (supplier_id) {

        var get_avg = $scope.$root.stock + "products-listing/get-item-avg-purchase-info";
        $http
            .post(get_avg, {
                'token': $scope.$root.token, 'product_id': $stateParams.id, 'supplier_id': supplier_id
                , 'sdate': $scope.priceFormData.average_year_start, 'edate': $scope.priceFormData.average_year_end
            })
            .then(function (res) {
                $scope.priceFormData.average_cost = '';

                if (res.data.ack == true) {
                    if (res.data.avg != null) {
                        // if($scope.priceFormData.update_id!=undefined)
                        $scope.priceFormData.average_cost = $scope.$root.number_format(res.data.avg, $scope.decimal_range);
                        // else  $scope.priceFormData.average_cost=  res.data.avg;
                    }
                }
                // else toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            });
    }

    $scope.open_date_form = function () {
        $scope.title = 'Date';
        //  if ($scope.cid == -1)
        angular.element('#model_avg_purchase_date').modal({ show: true });
    }


    $scope.end_after_start_date = function (arg) {

        if (arg == 1)
            $scope.priceFormData.average_year_end = $scope.priceFormData.average_year_start;
        else if (arg == 2)
            $scope.priceFormData.end_date = $scope.priceFormData.start_date;
        //	angular.element(".ck_angedate").val() = angular.element(".ck_angsdate").val().split("/")[0] + "-" + angular.element(".ck_angsdate").val().split("/")[1] + "-" + angular.element(".ck_angsdate").val().split("/")[2];
    }

    $scope.priceFormData = {};
    $scope.price_sale_user = "";
    $scope.type = 1;

    $scope.get_volume_price_sale = function (arg, supp_id) {

        var volumeUrl = $scope.$root.stock + "unit-measure/get-sale-offer-volume-by-type";
        $http
            .post(volumeUrl, {
                type: 'Volume 1',
                category: arg,
                'product_id': $stateParams.id,
                'supp_id': supp_id,
                'token': $scope.$root.token
            })
            .then(function (res) {
                $scope.arr_volume_1 = [];
                $scope.arr_volume_1.push({ 'id': '', 'name': '' });

                if (res.data.ack == true)
                    $scope.arr_volume_1 = res.data.response;

                if ($scope.user_type == 1)
                    $scope.arr_volume_1.push({ 'id': '-1', 'name': '++ Add New ++' });
                else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            });

        $http
            .post(volumeUrl, {
                type: 'Volume 2',
                category: arg,
                'product_id': $stateParams.id,
                'supp_id': supp_id,
                'token': $scope.$root.token
            })
            .then(function (res) {
                $scope.arr_volume_2 = [];
                $scope.arr_volume_2.push({ 'id': '', 'name': '' });

                if (res.data.ack == true)
                    $scope.arr_volume_2 = res.data.response;

                if ($scope.user_type == 1)
                    $scope.arr_volume_2.push({ 'id': '-1', 'name': '++ Add New ++' });
                else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            });

        $http
            .post(volumeUrl, {
                type: 'Volume 3',
                category: arg,
                'product_id': $stateParams.id,
                'supp_id': supp_id,
                'token': $scope.$root.token
            })
            .then(function (res) {
                $scope.arr_volume_3 = [];
                $scope.arr_volume_3.push({ 'id': '', 'name': '' });

                if (res.data.ack == true)
                    $scope.arr_volume_3 = res.data.response;

                if ($scope.user_type == 1)
                    $scope.arr_volume_3.push({ 'id': '-1', 'name': '++ Add New ++' });
                else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            });
    }

    $scope.list_unit_item = [];
    $scope.get_category_list_volume = function (pard_id, type) {

        $http
            .post(get_unit_setup_category, { 'token': $scope.$root.token, 'product_id': pard_id })
            .then(function (vol_data) {

                if (type == 1) {
                    $scope.list_unit_category = [];
                    $scope.list_unit_category = vol_data.data.response;
                }

                if (type == 2) {

                    $scope.list_unit_item = vol_data.data.response;
                    //console.log("12345");
                    angular.forEach($scope.list_unit_item, function (elem) {
                        if (elem.name == $scope.formData.unit_id.title)
                            $scope.priceFormData.purchase_measure = elem;
                    });
                }
            });
    }


    $scope.fn_purchase_add_form = function (type) {

        $scope.columns_sale = [];
        $scope.supplier_list = [];
        $scope.last_po_date = '';
        $scope.check_item_readonly_purchase = false;
        $scope.check_item_readonly_purchase2 = false;

        ////$scope.!check_item_readonly_purchase = true;

        $scope.hide_status_info = true;
        $scope.count = 0;
        angular.element('.pic_block').attr("disabled", false);
        $scope.priceFormData = {};
        $scope.formData_price_data = {};
        $scope.show_price_sale_form = true;
        $scope.show_price_sale_list = false;

        $scope.priceFormData.type = type;

        angular.element('.display_record').html('');
        $scope.priceFormData.sale_name_id = '';

        $scope.form_before_edit = false;
        $scope.form_after_edit = true;
        //$scope.show_first_button = true;
        $scope.show_supp_form = true;

        $scope.current_date = $scope.$root.get_current_date();
        $scope.priceFormData.start_date = $scope.$root.get_current_date();
        $scope.priceFormData.end_date = $scope.$root.get_end_date();

        $scope.priceFormData.status_date = $scope.$root.get_current_date();
        //console.log($scope.formData.unit_id.id);
        //$scope.priceFormData.purchase_measure=$scope.formData.unit_id.title;

        $scope.get_category_list_volume($stateParams.id, 2);
        $scope.clear_date();
        $scope.currency_list();
        //$scope.product_status_list();

        $scope.product_status_list = [];
        // $rootScope.get_status_list('product_status');
        // $scope.product_status_list = $rootScope.status_list;

        $scope.product_status_list = [{
            'id': '1',
            'title': 'Active'
        }, {
            'id': '0',
            'title': 'Inactive'
        }];

        $scope.priceFormData.status_id = $scope.product_status_list[0];


        /* angular.forEach($scope.list_unit_item, function (index, elem) {

         if (elem.id == $scope.formData.unit_id.id)
         $scope.priceFormData.purchase_measure = elem;
         });*/

        $scope.formData_price_data.product_id = $stateParams.id;

        $scope.value_counter = 0;


        //	$scope.get_price_sale($scope.priceFormData.sale_id);
        $scope.price_volume_form = false;
        $scope.price_volume_list = true;

    };
    $scope.get_last_po_date = function (product_id, supplier_id, type) {
        // to fill the form get last fill record

        var get_avg = $scope.$root.stock + "products-listing/get-last-po-date";
        $http
            .post(get_avg, { 'token': $scope.$root.token, 'product_id': product_id, 'supplier_id': supplier_id })
            .then(function (res) {
                if (res.data.ack == true) {

                    if (Number(type) == 1) {

                        $scope.last_po_date = $scope.$root.convert_unix_date_to_angular(res.data.last_po_date);


                        $scope.priceFormData.supplier_item_name = res.data.response.supplier_item_name;

                        // $scope.priceFormData.lead_time = Number(res.data.response.lead_time);

                        $scope.priceFormData.min_quantity = Number(res.data.response.min_quantity);

                        $scope.priceFormData.max_quantity = Number(res.data.response.max_quantity);

                        $scope.priceFormData.unit_price = $scope.$root.number_format_remove(res.data.response.unit_price, $scope.decimal_range);

                        $scope.priceFormData.start_date = $scope.$root.get_current_date();

                        if (res.data.response.average_year_start == 0) $scope.priceFormData.average_year_start = null;
                        else $scope.priceFormData.average_year_start = $scope.$root.convert_unix_date_to_angular(res.data.response.average_year_start);
                        if (res.data.response.average_year_end == 0) $scope.priceFormData.average_year_end = null;
                        else $scope.priceFormData.average_year_end = $scope.$root.convert_unix_date_to_angular(res.data.response.average_year_end);

                        var id = 0;
                        if (res.data.response.currency_id > 0) id = res.data.response.currency_id;
                        else id = $scope.$root.defaultCurrency;

                        angular.forEach($rootScope.arr_currency, function (elem) {
                            if (elem.id == id)
                                $scope.priceFormData.currency_id = elem;
                        });

                        $scope.priceFormData.sale_currency = $scope.priceFormData.currency_id.code;

                        angular.forEach($scope.product_status_list, function (obj) {
                            if (obj.id == res.data.response.status_id) {
                                $scope.priceFormData.status_id = obj;
                            }
                        });

                        angular.forEach($scope.list_unit_item, function (obj) {
                            if (obj.id == res.data.response.uom_id) {
                                $scope.priceFormData.purchase_measure = obj;
                            }
                        });

                        angular.forEach($scope.lead_types, function (obj) {
                            if (obj.value == res.data.response.lead_type) {
                                $scope.priceFormData.lead_type = obj;
                            }
                        });
                    }
                }
                else {

                    $scope.hide_status_info = true;
                    $scope.count = 0;
                    angular.element('.pic_block').attr("disabled", false);

                    $scope.formData_price_data = {};

                    // $scope.priceFormData = {};
                    $scope.priceFormData.supplier_item_name = '';
                    //	$scope.priceFormData.status_id='';
                    //	$scope.priceFormData.status_date='';
                    //	$scope.priceFormData.start_date='';
                    $scope.priceFormData.end_date = '';
                    $scope.priceFormData.purchase_measure = '';
                    $scope.priceFormData.unit_price = '';
                    $scope.priceFormData.converted_price = '';
                    //	$scope.priceFormData.currency_id='';
                    $scope.priceFormData.lead_time = '';
                    $scope.priceFormData.lead_type = '';
                    $scope.last_po_date = '';
                    $scope.priceFormData.min_quantity = '';
                    $scope.priceFormData.max_quantity = '';
                    $scope.priceFormData.purchase_message = '';

                    angular.element('.display_record').html('');
                    $scope.priceFormData.sale_name_id = '';

                    $scope.form_before_edit = false;
                    $scope.form_after_edit = true;
                    $scope.show_supp_form = true;

                    $scope.current_date = $scope.$root.get_current_date();
                    $scope.priceFormData.start_date = $scope.$root.get_current_date();
                    $scope.priceFormData.end_date = $scope.$root.get_end_date();
                    $scope.formData_price_data.start_date = $scope.$root.get_current_date();

                    $scope.value_counter = 0;
                    $scope.clear_date();
                }
            });


        $scope.get_category_list_volume($stateParams.id, 2);
    }

    $scope.get_sattus_list = function (pard_id, type) {
        /*$scope.product_status_list = [];

         var getodeUrl = $scope.$root.stock + "product-status/get-status";
         $http
         .post(getodeUrl, {'token': $scope.$root.token, 'type': 1})
         .then(function (res) {
         if (res.data.ack == 1) {
         $scope.product_status_list = res.data.response;
         }
         // else toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
         $scope.priceFormData.status_id = $scope.product_status_list[0];
         });*/

        $scope.product_status_list = [];
        var statusUrl = $scope.$root.setup + "general/all-status-list";
        $http
            .post(statusUrl, {
                'type': 1,
                'tbl': $scope.$root.base64_encode('product_status'),
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == 1) {

                    $scope.product_status_list.push({ 'id': '1', 'title': 'Active' });
                    $scope.product_status_list.push({ 'id': '0', 'title': 'Inactive' });

                    angular.forEach(res.data.response, function (obj) {
                        $scope.product_status_list.push(obj);
                    });

                    //$scope.product_status_list.push({'id': '-1', 'title': '++ Add New ++'});
                }
                $scope.priceFormData.status_id = $scope.product_status_list[0];
            });

        /*$scope.product_status_list = {};
         $scope.product_status_list = [{'name': 'Active', 'id': 1}, {
         'name': 'Inactive',
         'id': 2
         }, {'name': 'Deleted', 'id': 0}, {'name': 'Deleted Temp', 'id': 4}, {
         'name': 'Discontinued',
         'id': 3
         }];

         $scope.priceFormData.status_id = $scope.product_status_list[0];*/
    }


    $scope.hide_status_info = true;

    $scope.check_status = function (id, name) {
        //console.log(name);
        //if(id!=1)
        //$scope.price_volume_list=true;

        $scope.hide_status_info = true;
        if (name != 'Active') {
            //$scope.hide_status_info=false;
            //$scope.price_volume_form=false;
            //$scope.price_volume_list=false;
        }
    }

    $scope.change_unit_price = function () {
        $scope.formData_price_data.purchase_price = $scope.priceFormData.unit_price;
        /*$scope.data={};
         angular.forEach($scope.choices, function (val, index) {
         $scope.data.purchase_price  = $scope.priceFormData.unit_price ;
         //$scope.choices.push($scope.data);
         });*/
    }

    $scope.clear_date_validation = function () {

        angular.element('#date_block_start_new').attr("disabled", false);
        //angular.element('.date_block_start_validation').attr("disabled", false);
        angular.element('.date_block_end').attr("disabled", false);
        //angular.element('.date_block_end_validation').attr("disabled", false);
    }

    $scope.isAdded = false;
    $scope.check_dates = function (rem, formData_price_data) {

        $scope.clear_date_validation();
        $scope.isAdded = false;

        var from = dmyToDate(angular.element(".ck_sdate").val());
        from.setHours(0);
        var to = dmyToDate(angular.element(".ck_edate").val());
        to.setHours(0);

        if (rem == 1) {
            var msg = 'Start Date .';
            var check = dmyToDate(angular.element("#vl_sdate").val());//new Date(this.formData_price_data.start_date);
            check.setHours(0);
            if (!((Date.parse(check) >= Date.parse(from)) && (Date.parse(check) <= Date.parse(to)))) {
                $scope.isAdded = true;
                toaster.pop('error', 'Error', 'Invalid ' + msg);
                angular.element('#date_block_start_new').attr("disabled", true);
                // angular.element('.date_block_start_validation').attr("disabled", true);
            }
        }

        if (rem == 2) {

            var msg = 'End Date .';
            var check = dmyToDate(angular.element("#vl_edate").val());
            new Date(this.formData_price_data.end_date);
            check.setHours(0);
            //var check = dmyToDate(angular.element("#vl_edate").val());

            /*var diffDaysfrom = check.getDate() - from.getDate();
             var diffDaysto = check.getDate() - to.getDate();
             console.log(diffDaysfrom);
             console.log(diffDaysto);
             */
            /*if ( diffDaysfrom > 0  )
             */
            //if ( check  >= from.getTime()    && check < to.getTime() )
            if (!((Date.parse(check) >= Date.parse(from)) && (Date.parse(check) <= Date.parse(to))))
            //if ( (check  >=from) && (check <= to ) )
            {
                $scope.isAdded = true;
                toaster.pop('error', 'Error', 'Invalid ' + msg);
                //angular.element('.date_block_end_validation').attr("disabled", true);
                angular.element('.date_block_end').attr("disabled", true);
            }
        }

        console.log(check);
        console.log(from);
        console.log(to);
    }


    function dmyToDate(date) {
        //console.log(date.split("/")[2] + "-" + date.split("/")[1] + "-" +date.split("/")[0]);
        return new Date(date.split("/")[2] + "-" + date.split("/")[1] + "-" + date.split("/")[0]);
    }

    $scope.change_discount_price = function () {/*

     //console.log($scope.formData_price_data.discount_price_1);
     var counter=0;

     if($scope.formData_price_data.discount_price_1!=undefined && $scope.formData_price_data.discount_price_2!=undefined)
     counter++;
     if($scope.formData_price_data.discount_price_1!=undefined && $scope.formData_price_data.discount_price_3!=undefined)
     counter++;
     if($scope.formData_price_data.discount_price_2!=undefined && $scope.formData_price_data.discount_price_3!=undefined)
     counter++;

     if(counter) 	{

     if( ($scope.formData_price_data.discount_price_1 == $scope.formData_price_data.discount_price_2  ) ||($scope.formData_price_data.discount_price_1 == $scope.formData_price_data.discount_price_3  ) || ($scope.formData_price_data.discount_price_2 == $scope.formData_price_data.discount_price_3  ))
     {
     toaster.pop('error', 'Error', 'please review Discounted Price.');

     angular.element('.pic_block').attr("disabled", true);
     }
     else angular.element('.pic_block').attr("disabled", false);
     }

     */
    }

    $scope.clear_date = function () {

        angular.element('.date_block_1').attr("disabled", false);
        angular.element('.date_block_11').attr("disabled", false);
        angular.element('.date_block_2').attr("disabled", false);
        angular.element('.date_block_22').attr("disabled", false);
        angular.element('.date_block_3').attr("disabled", false);
        angular.element('.date_block_33').attr("disabled", false);

    }

    $scope.check_min_max_order = function (arg) {
        if (arg == 1) angular.element('.picc_block').attr("disabled", false);
        if (arg == 2) angular.element('.max_block').attr("disabled", false);
        if (arg == 3) angular.element('.max_qau').attr("disabled", false);
        if (arg == 3) angular.element('.cat_block').attr("disabled", false);
        return;

        var counter = 0;

        if (arg == 1) {

            if ($scope.formData.min_quantity != undefined && $scope.formData.max_quantity != undefined) counter++;

            if (counter) {
                //	console.log(angular.element("#min_quantity").val());console.log(angular.element("#max_quantity").val());
                //console.log($scope.formData.min_quantity >= $scope.formData.max_quantity);
                //$scope.result = angular.equals($scope.user1, $scope.user2);
                //	if( (angular.element("#min_quantity").val() >= angular.element("#mix_quantity").val()) )
                if (Number($scope.formData.min_quantity) >= Number($scope.formData.max_quantity)) {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(321, ['Min order ', 'Max order']));
                    angular.element('.picc_block').attr("disabled", true);
                    return;
                }
                else angular.element('.picc_block').attr("disabled", false);
            }
        }
        else if (arg == 2) {

            if ($scope.priceFormData.min_quantity != undefined && $scope.priceFormData.max_quantity != undefined)
                counter++;
            if (counter) {
                //console.log(angular.element("#p_min_quantity").val());	console.log(angular.element("#p_max_quantity").val());
                //	console.log($scope.priceFormData.min_quantity >= $scope.priceFormData.max_quantity);
                //$scope.result = angular.equals($scope.user1, $scope.user2);
                //	if( (angular.element("#p_min_quantity").val() >= angular.element("#p_max_quantity").val()) )
                if (Number($scope.priceFormData.min_quantity) >= Number($scope.priceFormData.max_quantity)) {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(321, ['Min order ', 'Max order']));
                    angular.element('.max_block').attr("disabled", true);
                    return;
                }
                else angular.element('.max_block').attr("disabled", false);
            }
        }
    }

    $scope.change_number_format = function (id) {

        /*	//var str = "110 000,23";
         var str = number;
         // var num = parseFloat(str.replace(/\s/g, "").replace(",", ""));
         var num = parseFloat(str.replace(',', "").replace(",", ""));
         //	alert(num.toFixed(dec_length));
         num = num.toFixed(dec_length );
         // alert(number.split(",") + "");
         // alert( Math.round(number).toFixed(2)) ;
         return num;*/


    }

    $scope.lead_types = [];
    $scope.lead_types = [{ 'label': 'Hours', 'value': 1 }, { 'label': 'Days', 'value': 2 }, {
        'label': 'Weeks',
        'value': 3
    }, { 'label': 'Months', 'value': 4 }];

    $scope.form_before_edit = false;
    $scope.form_after_edit = false;

    $scope.get_purchase_sale_price = function (type) {
        $scope.check_item_readonly_purchase = false;
        ////$scope.!check_item_readonly_purchase = false;
        $scope.check_item_readonly_purchase2 = true;

        // $scope.$root.breadcrumbs[3].name = 'Purchase Information';
        $scope.showLoader = true;

        if (type == 1) {
            $scope.price_sale_user = "Purchase ";
        } else {
            $scope.price_sale_user = "Supplier ";
        }

        $scope.type = type;
        $scope.show_price_sale_form = false;
        $scope.show_price_sale_list = true;

        $scope.show_supp_form = false;
        $scope.show_supp_form = false;
        $scope.show_supplier_list = false;

        var API = $scope.$root.stock + "products-listing/purchase-info-listing";
        $scope.postData = {};

        $scope.postData = {
            'token': $scope.$root.token,
            'product_id': $scope.formData.product_id,
            'type': type,
            'get_data': 1,
            'page': $scope.item_paging.spage,
            //'country_keyword': angular.element('#search_sale_listing_data').val()
        };

        $http
            .post(API, $scope.postData)
            .then(function (res) {
                $scope.sale_records = [];
                $scope.columns = [];

                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.sale_records = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
                //else     toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                $scope.showLoader = false;
            });

        $scope.price_volume_form = false;
        $scope.price_volume_list = false;
    };


    //$scope.searchKeyword_sup={};

    $scope.searchKeyword = {};
    $scope.searchKeyword_sup = {};

    $scope.get_all_list_customers = function (id, item_paging) {

        $scope.formData.searchKeyword = '';
        var sale_Url = $scope.$root.stock + "products-listing/get-customer-supplier-list";

        //$scope.formData_customer.sale_id = id;

        /*  var postData = {
         'token': $scope.$root.token,
         'get_id': id,
         'product_id': $scope.formData.product_id,
         'type': $scope.type
         //	'price_check':$scope.formData.sale_selling_check.id
         };*/

        $scope.columns = [];
        $scope.record = {};

        // var postData = {};

        $scope.postData = {};
        $scope.showLoader = true;
        $scope.selection_record = {};

        $scope.postData.token = $scope.$root.token;
        $scope.postData.get_id = id;
        $scope.postData.product_id = $scope.formData.product_id;
        $scope.postData.type = $scope.type;

        if (item_paging == 1) $rootScope.item_paging.spage = 1;

        $scope.postData.page = $rootScope.item_paging.spage;
        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;
        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.selection_record = {};
        }

        /*if ($scope.searchKeyword_sup.segment != null)
         postData.segments = $scope.searchKeyword_sup.segment !== undefined ? $scope.searchKeyword_sup.segment.id : 0;
         if ($scope.searchKeyword_sup.country != null)
         postData.countrys = $scope.searchKeyword_sup.country !== undefined ? $scope.searchKeyword_sup.country.id : 0;

         if ($scope.searchKeyword_sup.$ != '')postData.searchBox = $scope.searchKeyword_sup.$;*/

        $scope.postData.searchKeyword = $scope.searchKeyword_sup.$;


        if ($scope.searchKeyword_sup.segment !== undefined && $scope.searchKeyword_sup.segment !== null)
            $scope.postData.segments = $scope.searchKeyword_sup.segment.id;
        else $scope.postData.segments = "";

        if ($scope.searchKeyword_sup.country_type !== undefined && $scope.searchKeyword_sup.country_type !== null)
            $scope.postData.country_types = $scope.searchKeyword_sup.country_type.id;

        else $scope.postData.country_types = "";

        /*if(clr==2){
         $scope.searchKeyword_sup={};
         }*/


        $http
            .post(sale_Url, $scope.postData)
            .then(function (res) {
                $scope.selection_record_get = {};
                $scope.columnss_get = [];

                $scope.columns = [];
                $scope.record = {};

                if (res.data.ack == true) {

                    // $scope.selection_record_get = res.data.response;
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;
                    $scope.showLoader = false;
                    //  $scope.selected_count = res.data.selected_count;

                    /*  $scope.formData_customer.discount_type2 = res.data.discount_type2;
                     $scope.formData_customer.discount_value2 = res.data.discount_value2;
                     $scope.formData_customer.discounted_price2 = res.data.discounted_price2;
                     */
                    $scope.record = res.data.response;
                    //$scope.record_invoice = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        if (index != "country" && index != "purchase_code") {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }

                        // if (index != 'price') {
                        /*$scope.columnss_get.push({
                         'title': toTitleCase(index),
                         'field': index,
                         'visible': true
                         });*/
                        // }
                    });

                }
                else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            });

        angular.element('#price_sale_list_modal').modal({
            show: true
        });
    };


    $scope.add_sale_list_single = function (item) {
        $scope.priceFormData.sale_id = item.id;
        $scope.priceFormData.sale_name = item.name;
        $scope.priceFormData.sale_code = item.code;

        $scope.get_last_po_date($stateParams.id, $scope.priceFormData.sale_id, 1);
        $scope.get_avg_price_purchase_info($scope.priceFormData.sale_id);
        angular.element('#price_sale_list_modal').modal('hide');
    };

    $scope.show_purchase_info_edit_form = function (id, type) {
        ////$scope.!check_item_readonly_purchase = false;
        $scope.check_item_readonly_purchase = true;
        $scope.check_item_readonly_purchase2 = true;

        $scope.count = 0;
        angular.element('.pic_block').attr("disabled", false);

        $scope.priceFormData = {};
        $scope.formData_price_data = {};

        $scope.last_po_date = '';
        $scope.show_price_sale_form = true;
        $scope.show_price_sale_list = false;

        $scope.show_supplier_list = false;
        $scope.show_supp_form = false;

        var getUrl = $scope.$root.stock + "products-listing/get-purchase-info-by-id";
        var postViewData = {
            'token': $scope.$root.token,
            'id': id
        };

        $scope.get_category_list_volume($stateParams.id, 2);
        $scope.clear_date();
        //$scope.get_sattus_list();
        $scope.product_status_list = [];
        // $rootScope.get_status_list('product_status');
        // $scope.product_status_list = $rootScope.status_list;

        $scope.product_status_list = [{
            'id': '1',
            'title': 'Active'
        }, {
            'id': '0',
            'title': 'Inactive'
        }];

        $scope.priceFormData.status_id = $scope.product_status_list[0];


        $http
            .post(getUrl, postViewData)
            .then(function (res) {

                $scope.priceFormData = res.data.response;
                $scope.priceFormData.item_order_check = res.data.item_order_check;
                $scope.priceFormData.update_id = res.data.response.id;
                $scope.priceFormData.type = res.data.response.type;
                $scope.formData_price_data.product_id = $stateParams.id;
                $scope.formData_price_data.product_code = $scope.formData.product_code;
                $scope.formData_price_data.item_description = $scope.formData.description;

                $scope.formData_price_data.vat_chk = res.data.response.vat_chk;


                $scope.priceFormData.unit_price = $scope.$root.number_format(res.data.response.unit_price, $scope.decimal_range);

                //$scope.formData_price_data.purchase_price  =$scope.$root.number_format($scope.priceFormData.unit_price ,$scope.decimal_range);

                $scope.formData_price_data.purchase_price = res.data.response.unit_price;

                if (res.data.response.max_quantity != 0) $scope.formData_price_data.max_quantity = Number(res.data.response.max_quantity);
                if (res.data.response.max_quantity != 0) $scope.formData_price_data.max_quantity = Number(res.data.response.max_quantity);
                if (res.data.response.lead_time != 0) $scope.formData_price_data.lead_time = Number(res.data.response.lead_time);


                if (res.data.response.start_date == 0) $scope.priceFormData.start_date = null;
                else $scope.priceFormData.start_date = $scope.$root.convert_unix_date_to_angular(res.data.response.start_date);

                if (res.data.response.end_date == 0) $scope.priceFormData.end_date = null;
                else $scope.priceFormData.end_date = $scope.$root.convert_unix_date_to_angular(res.data.response.end_date);

                if (res.data.response.status_date == 0) $scope.priceFormData.status_date = null;
                else $scope.priceFormData.status_date = $scope.$root.convert_unix_date_to_angular(res.data.response.status_date);


                if (res.data.response.average_year_start == 0) $scope.priceFormData.average_year_start = null;
                else $scope.priceFormData.average_year_start = $scope.$root.convert_unix_date_to_angular(res.data.response.average_year_start);
                if (res.data.response.average_year_end == 0) $scope.priceFormData.average_year_end = null;
                else $scope.priceFormData.average_year_end = $scope.$root.convert_unix_date_to_angular(res.data.response.average_year_end);


                $scope.price_volume_form = false;
                $scope.price_volume_list = true;
                $scope.hide_status_info = true;

                angular.forEach($scope.list_unit_item, function (obj) {
                    if (obj.id == res.data.response.uom_id)
                        $scope.priceFormData.purchase_measure = obj;
                });

                var id = 0;
                if (res.data.response.currency_id > 0) id = res.data.response.currency_id;
                else id = $scope.$root.defaultCurrency;
                angular.forEach($rootScope.arr_currency, function (elem) {
                    if (elem.id == id)
                        $scope.priceFormData.currency_id = elem;
                });

                $scope.priceFormData.sale_currency = $scope.priceFormData.currency_id.code;


                angular.forEach($scope.product_status_list, function (obj) {
                    if (obj.id == res.data.response.status_id) {
                        $scope.priceFormData.status_id = obj;
                    }
                });

                angular.forEach($scope.lead_types, function (index, obj) {
                    if (obj.value == res.data.response.lead_type) {
                        $scope.priceFormData.lead_type = $scope.lead_types[index];
                    }
                });

                $scope.get_price_sale_volume($scope.priceFormData.sale_id);

                //	$scope.get_last_po_date($stateParams.id ,$scope.priceFormData.sale_id,2);
                $scope.get_avg_price_purchase_info($scope.priceFormData.sale_id);
                $scope.clear_date_validation();
            });


    };

    $scope.add_purchase_info = function (type) {


        $scope.priceFormData.token = $scope.$root.token;
        $scope.priceFormData.id = 0;

        $scope.priceFormData.product_id = $scope.formData.product_id;
        //$scope.priceFormData.product_code = $scope.formData.product_code;
        //$scope.priceFormData.item_description =$scope.formData.description;


        $scope.priceFormData.type = type;

        $scope.priceFormData.lead_typess = $scope.priceFormData.lead_type !== undefined ? $scope.priceFormData.lead_type.value : 0;
        $scope.priceFormData.currency_ids = $scope.priceFormData.currency_id !== undefined ? $scope.priceFormData.currency_id.id : 0;
        $scope.priceFormData.status_ids = $scope.priceFormData.status_id !== undefined ? $scope.priceFormData.status_id.id : 0;

        $scope.priceFormData.uom_id = $scope.priceFormData.purchase_measure !== undefined ? $scope.priceFormData.purchase_measure.id : 0;
        $scope.priceFormData.uom_name = $scope.priceFormData.purchase_measure !== undefined ? $scope.priceFormData.purchase_measure.name : 0;

        if ($scope.priceFormData.average_cost != undefined)
            $scope.priceFormData.average_costs = $scope.$root.number_format_remove($scope.priceFormData.average_cost, $scope.decimal_range);

        if ($scope.priceFormData.unit_price != undefined)
            $scope.priceFormData.unit_prices = $scope.$root.number_format_remove($scope.priceFormData.unit_price, $scope.decimal_range);

        $scope.formData_price_data.tab_id_2 = 4;
        $scope.formData_price_data.sp_id = $scope.sp_id;


        $scope.priceFormData.prd_max_quantity = $scope.formData.max_quantity;
        $scope.priceFormData.prd_min_quantity = $scope.formData.min_quantity;

        if ($scope.priceFormData.min_order_unit_id != undefined)
            $scope.priceFormData.min_order_unit_ids = $scope.priceFormData.min_order_unit_id;
        if ($scope.formData.max_order_unit_id != undefined)
            $scope.priceFormData.max_order_unit_ids = $scope.priceFormData.max_order_unit_id;

        if ($scope.priceFormData.min_quantity != undefined || $scope.priceFormData.max_quantity != undefined) {

            if ($scope.priceFormData.uom_id == undefined) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));
                angular.element('.cat_block ').attr("disabled", true);
                return;
            }
            else {

                if (Number($scope.priceFormData.min_quantity) > Number($scope.priceFormData.max_quantity)) {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(321, ['Min Order ', 'Max Order']));
                    angular.element('.max_block').attr("disabled", true);
                    return;
                }
                else angular.element('.max_block').attr("disabled", false);


                /*	var not_exit=0;
                 var count_total= 0;
                 angular.element('.cat_block').attr("disabled", false);
                 //	if(not_exit>0)
                 console.log($scope.priceFormData.prd_min_quantity);
                 console.log($scope.priceFormData.prd_max_quantity);

                 var new_min =Number($scope.priceFormData.prd_min_quantity/$scope.priceFormData.purchase_measure.ref_quantity) ;
                 var new_max =Number($scope.priceFormData.prd_max_quantity/$scope.priceFormData.purchase_measure.ref_quantity) ;

                 if( ( ((Number($scope.priceFormData.min_quantity) * $scope.priceFormData.purchase_measure.ref_quantity) )  >= (Number($scope.priceFormData.prd_min_quantity)) )
                 && ( (Number($scope.priceFormData.min_quantity * $scope.priceFormData.purchase_measure.ref_quantity))   <= (Number($scope.priceFormData.prd_max_quantity)) ) )
                 {angular.element('.max_block').attr("disabled", false);}
                 else {
                 toaster.pop('error', 'Error', 'Minimum Quantity between '+ new_min + ' AND ' + new_max
                 +'('+$scope.priceFormData.prd_min_quantity+' '+ $scope.formData.unit_id.title+')' );
                 angular.element('.max_block').attr("disabled", true); return;
                 }

                 if( ( ((Number($scope.priceFormData.max_quantity) * $scope.priceFormData.purchase_measure.ref_quantity) )  >= (Number($scope.priceFormData.prd_min_quantity)) ) && ( (Number($scope.priceFormData.max_quantity * $scope.priceFormData.purchase_measure.ref_quantity))     <= (Number($scope.priceFormData.prd_max_quantity)) ) )	{angular.element('.max_block').attr("disabled", false);}
                 else {
                 toaster.pop('error', 'Error', 'Maximum Quantity between '+ new_min + ' AND ' + new_max
                 +'('+$scope.priceFormData.prd_max_quantity+' '+ $scope.formData.unit_id.title+')' );
                 angular.element('.max_block').attr("disabled", true); return;
                 }*/

            }
        }


        var msg = 'Inserted.';
        var updateUrl_purchase = $scope.$root.stock + "products-listing/add-purchase-info";
        if ($scope.priceFormData.update_id != undefined) {
            var msg = 'Updated.';
            var updateUrl_purchase = $scope.$root.stock + "products-listing/update-purchase-info";
        }
        //	console.log($scope.priceFormData);

        $http
            .post(updateUrl_purchase, $scope.priceFormData)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Add', 'Record ' + msg);
                    $scope.show_purchase_info_edit_form(res.data.id, type);

                    //angular.element('#model_btn_sale_price').modal('hide');
                }
                else
                    toaster.pop('error', 'Error', res.data.error);

            });
    };

    $scope.delete_sale_price = function (id, index, arr_data) {
        var delUrl = $scope.$root.stock + "products-listing/delete-purchase-info";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        //  $scope.show_price_price(remander_id);

                        arr_data.splice(index, 1);
                    }
                    else
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));

                });
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });

    };


    $scope.chkPrice = function () {
        if ($scope.priceFormData.unit_price == undefined)
            return;
        $scope.validatePrice($scope.priceFormData.unit_price);
    }

    $scope.validatePrice = function (price) {
        var isValide = true;
        if (Number($scope.priceFormData.unit_price) == undefined || $scope.priceFormData.purchase_measure == undefined || $scope.priceFormData.currency_id == undefined) {
            toaster.pop('error', 'Error', 'Please set the  U.O.M  ,Purchase Cost.');
            angular.element('.cur_block').attr("disabled", false);
            isValide = false;
            return;
        }


        var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
        $http
            .post(currencyURL, { 'id': $scope.priceFormData.currency_id.id, token: $scope.$root.token })
            .then(function (res) {

                if (res.data.ack == true) {

                    if (res.data.response.conversion_rate == null) {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Currency Conversion Rate']));
                        $scope.priceFormData.unit_price = null;
                        $scope.priceFormData.converted_price = null;
                        return;
                    }

                    console.log($scope.priceFormData.purchase_measure.ref_quantity);

                    var newPrice1 = Number($scope.priceFormData.unit_price);
                    var newPrice = 0;
                    if ($scope.priceFormData.purchase_measure.unit_id != $scope.formData.unit_id.id) {

                        if ($scope.priceFormData.purchase_measure.ref_unit_id != $scope.formData.unit_id.id) {
                            // get the quatity according to base unit id
                            // console.log('hello111111==>');
                            newPrice1 = ($scope.priceFormData.unit_price) / ($scope.priceFormData.purchase_measure.ref_quantity);
                        }
                        else {
                            // console.log('hello2222222222==>');
                            newPrice1 = ($scope.priceFormData.unit_price) / ($scope.priceFormData.purchase_measure.quantity);
                        }
                    }

                    if ($scope.priceFormData.currency_id.id != $scope.$root.defaultCurrency)
                        newPrice = Number(newPrice1) / Number(res.data.response.conversion_rate);
                    else
                        newPrice = Number(newPrice1);

                    /*if ($scope.priceFormData.vat_rate_id != undefined && $scope.priceFormData.vat_rate_id.vat_value > 0) {
                     //console.log($scope.priceFormData.vat_rate_id);

                     var vat_value = $scope.priceFormData.vat_rate_id.vat_value;

                     var vatnewPrice;
                     var vatnewPrice1;

                     vatnewPrice = newPrice * (vat_value / 100);
                     newPrice = newPrice + vatnewPrice;

                     vatnewPrice1 = newPrice1 * (vat_value / 100);
                     newPrice1 = newPrice1 + vatnewPrice1;

                     // newPrice1 = newPrice1 * (vat_value / 100);
                     // newPrice = newPrice * (vat_value / 100);

                     }*/


                    if (newPrice1 > 0) $scope.priceFormData.converted_price = Number(newPrice1).toFixed(2);
                    else newPrice = 0;
                    if (newPrice > 0) $scope.priceFormData.converted_price = Number(newPrice).toFixed(2);
                    else newPrice = 0;

                    angular.element('.cur_block').attr("disabled", false);

                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Currency Conversion Rate']));
                    angular.element('.cur_block').attr("disabled", true);
                    $scope.priceFormData.unit_price = null;
                    $scope.priceFormData.converted_price = null;
                    return;
                }
            });


        // return isValide;
    }

    $scope.currency_list = function (val) {

        var id = 0;
        if (val > 0)
            id = $scope.priceFormData.currency_id.id;
        else
            id = $scope.$root.defaultCurrency;

        angular.forEach($rootScope.arr_currency, function (elem) {
            if (elem.id == id)
                $scope.priceFormData.currency_id = elem;
        });
        if ($scope.priceFormData.currency_id == undefined)
            $scope.priceFormData.sale_currency = $scope.priceFormData.currency_id.code;
    };


    $scope.showEditPurchasevolume_form = function () {
        $scope.check_item_readonly_volume = false;
        ////$scope.!check_item_readonly_purchase_volume = true;


        $scope.formData_price_data.purchase_price = $scope.$root.number_format_remove($scope.formData_price_data.purchase_price, $scope.decimal_range);
        $scope.formData_price_data.discount_value = $scope.$root.number_format_remove($scope.formData_price_data.discount_value, $scope.decimal_range);
        $scope.formData_price_data.discount_price = $scope.$root.number_format_remove($scope.formData_price_data.discount_price, $scope.decimal_range);

    }

    $scope.get_price_sale_volume_pop = function (p_id, id, product_id) {

        var postUrl = $scope.$root.pr + "srm/srm/supplier_list";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
            'purchase_info_id': p_id,
            'supplier_id': id,
            'product_id': product_id///$stateParams.id
        };

        $http
            .post(postUrl, postData)
            .then(function (res) {
                $scope.supplier_list = [];
                $scope.columns_sale = [];
                $scope.clear_date();
                $scope.current_date = $scope.$root.get_current_date();

                if (res.data.ack == true) {

                    if (Number(res.data.total) > 0) $scope.count = res.data.total;

                    $scope.supplier_list = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_sale.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                }
                //  else   toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            });

        angular.element('#model_purcase_info').modal({ show: true });
    }

    $scope.show_popup_purchase_volume = function (type) {

        // $scope.$root.breadcrumbs[3].name = 'Purchase Information';

        $scope.showLoader = true;
        if (type == 1) {
            $scope.price_sale_user = "Purchase ";
        } else {
            $scope.price_sale_user = "Supplier ";
        }

        $scope.type = type;
        $scope.show_price_sale_form = false;
        $scope.show_price_sale_list = true;

        $scope.show_supp_form = false;
        $scope.show_supp_form = false;
        $scope.show_supplier_list = false;

        var API = $scope.$root.stock + "products-listing/purchase-info-listing";
        $scope.postData = {};

        $scope.postData = {
            'token': $scope.$root.token,
            'product_id': $scope.formData.product_id,
            'type': type,
            'get_data': 1,
            'page': $scope.item_paging.spage,
            //'country_keyword': angular.element('#search_sale_listing_data').val()
        };


        $http
            .post(API, $scope.postData)
            .then(function (res) {
                $scope.sale_records = [];
                $scope.columns = [];
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;


                    $scope.sale_records = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });


                    $scope.showLoader = false;
                }
                //else     toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            });

        $scope.showLoader = false;


        $scope.price_volume_form = false;
        $scope.price_volume_list = false;
    };

    $scope.get_price_sale_volume = function (id) {

        $scope.price_volume_form = false;
        $scope.price_volume_list = true;

        var postUrl = $scope.$root.pr + "srm/srm/supplier_list";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
            'purchase_info_id': $scope.priceFormData.update_id,
            'supplier_id': id,
            'product_id': $stateParams.id
        };

        $http
            .post(postUrl, postData)
            .then(function (res) {
                $scope.supplier_list = [];
                $scope.columns_sale = [];
                $scope.clear_date();
                $scope.current_date = $scope.$root.get_current_date();

                if (res.data.ack == true) {

                    if (Number(res.data.total) > 0) $scope.count = res.data.total;

                    $scope.supplier_list = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_sale.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                }
                //  else   toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            });


    }

    $scope.fn_volume_Form = function () {

        $scope.check_item_readonly_volume = false;
        ////$scope.!check_item_readonly_purchase_volume = true;

        $scope.clear_date_validation();
        $scope.formData_price_data = {};
        $scope.clear_date();

        $scope.change_unit_price();
        // $scope.formData_price_data_start_date =  $scope.$root.get_current_date();

        $scope.price_volume_form = true;
        $scope.price_volume_list = false;
        $scope.get_volume_all(2, $scope.priceFormData.sale_id);

        $scope.formData_price_data.purchase_price =
            $scope.$root.number_format_remove($scope.formData_price_data.purchase_price, $scope.decimal_range);
    };

    $scope.add_purchase_info_volume = function (type, formData_price_data) {


        $scope.formData_price_data.purchase_prices = $scope.$root.number_format_remove($scope.formData_price_data.purchase_price, $scope.decimal_range);
        $scope.formData_price_data.discount_values = $scope.$root.number_format_remove($scope.formData_price_data.discount_value, $scope.decimal_range);
        $scope.formData_price_data.discount_prices = $scope.$root.number_format_remove($scope.formData_price_data.discount_price, $scope.decimal_range);

        $scope.formData_price_data.ck_start_date = dmyToDate(angular.element("#ck_sdate").val());// $scope.priceFormData.start_date;
        $scope.formData_price_data.ck_end_date = dmyToDate(angular.element("#ck_edate").val());//$scope.priceFormData.end_date;


        $scope.formData_price_data.start_date1 = angular.element("#vl_sdate").val().split("/")[0] + "-" + angular.element("#vl_sdate").val().split("/")[1] + "-" + angular.element("#vl_sdate").val().split("/")[2];

        $scope.formData_price_data.end_date1 = angular.element("#vl_edate").val().split("/")[0] + "-" + angular.element("#vl_edate").val().split("/")[1] + "-" + angular.element("#vl_edate").val().split("/")[2];


        var volume_id_chk = $scope.formData_price_data.volume_id !== undefined ? $scope.formData_price_data.volume_id.id : 0;
        console.log(volume_id_chk);


        if ((volume_id_chk == '-1')) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Volume']));
            return;
        }

        $scope.formData_price_data.token = $scope.$root.token;
        $scope.formData_price_data.type = type;
        $scope.formData_price_data.product_id = $scope.formData.product_id;
        $scope.formData_price_data.supplier_id = $scope.priceFormData.sale_id;
        $scope.formData_price_data.purchase_info_id = $scope.priceFormData.update_id;

        var updateUrl_purchase = $scope.$root.stock + "products-listing/add-purchase-info-volume";
        if ($scope.formData_price_data.update_id != undefined)
            var updateUrl_purchase = $scope.$root.stock + "products-listing/update-purchase-info-volume";


        $http
            .post(updateUrl_purchase, $scope.formData_price_data)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                    $scope.get_price_sale_volume($scope.priceFormData.sale_id);
                    //angular.element('#model_btn_sale_price').modal('hide');
                    //$scope.show_purchase_info_edit_form (res.data.id ,type);
                }
                else
                    toaster.pop('error', 'Error', res.data.error);

            });


    }

    $scope.purchase_info_edit_volume = function (id, pid) {

        $scope.check_item_readonly_volume = true;
        ////$scope.!check_item_readonly_purchase_volume = false;

        //  $scope.get_item_voume_list(1, pid);
        var postUrl = $scope.$root.pr + "srm/srm/supplier_by_id";
        var postData = {
            'token': $scope.$root.token,
            'id': id
        };
        $scope.clear_date_validation();
        $scope.get_volume_all(2, $scope.priceFormData.sale_id);
        $scope.formData_price_data.update_id = id;

        $http
            .post(postUrl, postData)
            .then(function (res) {


                $scope.formData_price_data.purchase_price = $scope.$root.number_format(res.data.response.purchase_price, $scope.decimal_range);
                $scope.formData_price_data.discount_value = $scope.$root.number_format(res.data.response.discount_value, $scope.decimal_range);
                $scope.formData_price_data.discount_price = $scope.$root.number_format(res.data.response.discount_price, $scope.decimal_range);


                $scope.formData_price_data.volume_id = res.data.response.volume_id;

                if (res.data.response.start_date == 0) $scope.formData_price_data.start_date = null;
                else $scope.formData_price_data.start_date = $scope.$root.convert_unix_date_to_angular(res.data.response.start_date);
                if (res.data.response.end_date == 0) $scope.formData_price_data.end_date = null;
                else $scope.formData_price_data.end_date = $scope.$root.convert_unix_date_to_angular(res.data.response.end_date);


                angular.forEach($scope.list_type, function (obj) {
                    if (obj.id == res.data.response.supplier_type) {
                        $scope.formData_price_data.supplier_type = obj;
                    }
                });

                angular.forEach($scope.arr_volume_id, function (obj) {
                    if (obj.id == res.data.response.volume_id) {
                        $scope.formData_price_data.volume_id = obj;
                    }
                });

            });

        $scope.price_volume_form = true;
        $scope.price_volume_list = false;
    }

    var volumeUrl_item = $scope.$root.stock + "unit-measure/get-sale-offer-volume-by-type";
    var addvolumeUrl_item = $scope.$root.stock + "unit-measure/add-sale-offer-volume";

    $scope.onChange_volume_price = function (a, as, volume_type) {
        var volume_type = '';
        $scope.formData_vol_1 = {};

        var id = '';
        var volume = '';
        var category = '';

        id = this.formData_price_data.volume_id.id;
        volume = 'Volume  ' + volume_type;
        category = volume_type;
        $scope.title_type = 'Add Volume ' + volume_type;


        $scope.formData_vol_1.volume = volume;
        $scope.formData_vol_1.title_type = $scope.title_type;
        $scope.formData_vol_1.ref_service_type = volume_type;

        $scope.formData_vol_1.type = volume_type;
        $scope.formData_vol_1.category = 2; //category;

        if (id == -1) {

            if ($scope.priceFormData.purchase_measure != undefined) {
                angular.element('#model_vol_price').modal({ show: true });

                $scope.list_unit_category = [];
                $scope.list_unit_category = [{
                    'id': $scope.priceFormData.purchase_measure.id,
                    'name': $scope.priceFormData.purchase_measure.name
                }];

                $scope.formData_vol_1.unit_category = $scope.list_unit_category[0];

            }
            else toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));
        }
    }


    $scope.get_volume_all = function (arg, supp_id) {


        $http
            .post(volumeUrl_purchase, {
                category: arg,
                'purchase_info_id': $scope.priceFormData.update_id,
                'product_id': $stateParams.id,
                'supplier_id': supp_id,
                'token': $scope.$root.token
            })
            .then(function (res) {
                $scope.arr_volume_id = [];
                $scope.arr_volume_id.push({ 'id': '', 'name': '' });
                if (res.data.ack == true) $scope.arr_volume_id = res.data.response;


                // else 	toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                if ($scope.user_type == 1) $scope.arr_volume_id.push({ 'id': '-1', 'name': '++ Add New ++' });

            });


    }

    var volumeUrl_purchase = $scope.$root.stock + "unit-measure/get-unit-srm-purchase-info";
    var addvolumeUrl_purchase = $scope.$root.stock + "unit-measure/add-unit-srm-purchase-info";

    $scope.add_vol_type_price = function (formData_vol_1) {


        $scope.formData_vol_1.supplier_id = $scope.priceFormData.sale_id;
        $scope.formData_vol_1.product_id = $stateParams.id;
        $scope.formData_vol_1.purchase_info_id = $scope.priceFormData.update_id;

        $scope.formData_vol_1.token = $scope.$root.token;
        $scope.formData_vol_1.unit_categorys = $scope.formData_vol_1.unit_category !== undefined ? $scope.formData_vol_1.unit_category.id : 0;

        if (Number($scope.formData_vol_1.quantity_from) > Number($scope.formData_vol_1.quantity_to)) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(526));
            return;
        }


        if (((Number($scope.formData_vol_1.quantity_from)) >= (Number($scope.priceFormData.min_quantity)))
            && ((Number($scope.formData_vol_1.quantity_from)) <= (Number($scope.priceFormData.max_quantity)))) {
            angular.element('.max_qau').attr("disabled", false);
        }
        else {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(527, ['Minimum Quantity']));
            angular.element('.max_qau').attr("disabled", true);
            return;
        }


        if (((Number($scope.formData_vol_1.quantity_to)) >= (Number($scope.priceFormData.min_quantity)))
            && ((Number($scope.formData_vol_1.quantity_to)) <= (Number($scope.priceFormData.max_quantity)))) {
            angular.element('.max_qau').attr("disabled", false);
        }
        else {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(527, ['Maximum Quantity']));
            angular.element('.max_qau').attr("disabled", true);
            return;
        }


        $http
            .post(addvolumeUrl_purchase, formData_vol_1)
            .then(function (res) {
                if (res.data.ack == true) {
                    var id_new = res.data.id;
                    toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                    angular.element('#model_vol_price').modal('hide');

                    ;
                    $http
                        .post(volumeUrl_purchase, {
                            category: $scope.formData_vol_1.category,
                            'product_id': $stateParams.id,
                            'token': $scope.$root.token,
                            'supplier_id': $scope.formData_vol_1.supplier_id,
                            'purchase_info_id': $scope.priceFormData.update_id
                        })
                        .then(function (vol_data) {
                            $scope.arr_volume_id = vol_data.data.response;

                            if ($scope.arr_volume_id.length == 0) {
                                $scope.arr_volume_id.push({ 'id': '-1', 'name': '++ Add New ++' });
                            } else if ($scope.arr_volume_id.length > 0)
                                if ($scope.user_type == 1)
                                    $scope.arr_volume_id.push({ 'id': '-1', 'name': '++ Add New ++' });

                            angular.forEach($scope.arr_volume_id, function (elem) {
                                if (elem.id == id_new)
                                    $scope.formData_price_data.volume_id = elem;
                                //	$scope.choices[index]['volume_id']  = $scope.arr_volume_id[index];
                            });

                        });
                }
                else toaster.pop('error', 'Error', 'Volume Already Exists');
            });
    }

    $scope.show_price_price = function (arg, formData_price_data) {

        var price = 0;
        var final_price = 0;
        var final_price_one = 0;

        //  if (arg == 1) {
        price = this.formData_price_data.purchase_price;
        var f_id = this.formData_price_data.supplier_type.id;

        if (f_id == 1) {
            var final_price_one = (parseFloat(this.formData_price_data.discount_value)) * (parseFloat(price)) / 100;

            final_price = (parseFloat(price)) - (parseFloat(final_price_one));

        } else if (f_id == 2) {
            final_price = (parseFloat(price)) - (parseFloat(this.formData_price_data.discount_value));
        }

        var final_new = (Math.round(final_price * 100) / 100).toFixed(2);
        if (final_new != 'NaN') this.formData_price_data.discount_price = final_new;
        // }

    }

    $scope.delete_volume = function (id, index, arr_data) {

        if ($scope.priceFormData.item_order_check > 0) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(528));

            return;
        }

        var delUrl = $scope.$root.pr + "srm/srm/delete_sp_id";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                        //	$scope.get_price_sale_volume($scope.formData_price_data.sp_id );
                        /*  var lastItem = $scope.choices.length-1;
                         $scope.choices.splice(lastItem);*/
                        arr_data.splice(index, 1);
                    }
                    else toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));

                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };


    $scope.count = 0;
    $scope.change_add_new = function () {
        $scope.count++;
        // var bool = angular.element("#buttons").is(':click'); console.log(bool);
        //document.getElementById('buttons').onclick = function() {$scope.count++;};

        //console.log($scope.count);
        if ($scope.count == 1) $scope.display_1 = true;
        if ($scope.count == 2) $scope.display_2 = true;
        if ($scope.count == 3) $scope.display_3 = true;

    }

    $scope.addNewVolume = function () {
        if ($scope.arrVolumeForms.length < 3) {
            if ($scope.arrVolumeForms.indexOf(1) == -1)
                $scope.arrVolumeForms.push(1);
            if ($scope.arrVolumeForms.indexOf(2) == -1)
                $scope.arrVolumeForms.push(2);
            if ($scope.arrVolumeForms.indexOf(3) == -1)
                $scope.arrVolumeForms.push(3);
            //$scope.arrVolumeForms.push($scope.arrVolumeForms.length + 1);
        }
    }


    $scope.add_item_info_single = function (type) {


        //$scope.check_min_max_order(2);
        var counter = 0;
        if ($scope.priceFormData.min_quantity != undefined && $scope.priceFormData.max_quantity != undefined)
            counter++;

        if (counter) {
            //console.log(angular.element("#p_min_quantity").val());	console.log(angular.element("#p_max_quantity").val());
            //	console.log($scope.priceFormData.min_quantity >= $scope.priceFormData.max_quantity);
            //$scope.result = angular.equals($scope.user1, $scope.user2);
            //	if( (angular.element("#p_min_quantity").val() >= angular.element("#p_max_quantity").val()) )
            if (Number($scope.priceFormData.min_quantity) >= Number($scope.priceFormData.max_quantity)) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(529));
                angular.element('.max_block').attr("disabled", true);
                return;
            }
            else angular.element('.max_block').attr("disabled", false);
        }


        $scope.priceFormData.token = $scope.$root.token;
        $scope.priceFormData.id = 0;

        $scope.priceFormData.product_id = $scope.formData.product_id;
        $scope.priceFormData.product_code = $scope.formData.product_code;
        $scope.priceFormData.item_description = $scope.formData.description;

        $scope.priceFormData.type = type;

        if ($scope.priceFormData.purchase_measure != undefined)
            $scope.priceFormData.uom_id = $scope.priceFormData.purchase_measure.id;
        if ($scope.priceFormData.purchase_measure != undefined)
            $scope.priceFormData.uom_name = $scope.priceFormData.purchase_measure.name;

        $scope.priceFormData.lead_typess = $scope.priceFormData.lead_type !== undefined ? $scope.priceFormData.lead_type.value : 0;
        $scope.priceFormData.currency_ids = $scope.priceFormData.currency_id !== undefined ? $scope.priceFormData.currency_id.id : 0;
        $scope.priceFormData.status_ids = $scope.priceFormData.status_id !== undefined ? $scope.priceFormData.status_id.id : 0;


        //volumes

        //var updateUrl = $scope.$root.pr + "srm/srm/update_product_values";
        // $scope.formData_price_data.product_id = $scope.$root.crm_id;
        // $scope.formData_price_data.token = $scope.$root.token;
        $scope.formData_price_data.tab_id_2 = 4;
        $scope.formData_price_data.sp_id = $scope.sp_id;

        $scope.formData_price_data.volume_ids = $scope.formData_price_data.volume_id !== undefined ? $scope.formData_price_data.volume_id.id : 0;
        $scope.formData_price_data.supplier_types = $scope.formData_price_data.supplier_type_11 !== undefined ? $scope.formData_price_data.supplier_type_11.id : 0;

        $scope.formData_price_data.volume_1s = $scope.formData_price_data.volume_1 !== undefined ? $scope.formData_price_data.volume_1.id : 0;
        $scope.formData_price_data.supplier_type_1s = $scope.formData_price_data.supplier_type_1 !== undefined ? $scope.formData_price_data.supplier_type_1.id : 0;

        $scope.formData_price_data.volume_2s = $scope.formData_price_data.volume_2 !== undefined ? $scope.formData_price_data.volume_2.id : 0;
        $scope.formData_price_data.supplier_type_2s = $scope.formData_price_data.supplier_type_2 !== undefined ? $scope.formData_price_data.supplier_type_2.id : 0;

        $scope.formData_price_data.volume_3s = $scope.formData_price_data.volume_3 !== undefined ? $scope.formData_price_data.volume_3.id : 0;
        $scope.formData_price_data.supplier_type_3s = $scope.formData_price_data.supplier_type_3 !== undefined ? $scope.formData_price_data.supplier_type_3.id : 0;


        if ($scope.formData_price_data.volume_1s > 0) {
            if ($scope.formData_price_data.discount_price_1 <= 0 || $scope.formData_price_data.discount_price_1 == undefined) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(530));
                return false;
            }


            if ($scope.formData_price_data.start_date_1 <= undefined || $scope.formData_price_data.end_date_1 == undefined) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(531));
                return false;
            }

        }
        if ($scope.formData_price_data.volume_2s > 0) {
            if ($scope.formData_price_data.discount_price_2 <= 0 || $scope.formData_price_data.discount_price_2 == undefined) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(532));
                return false;
            }
            if ($scope.formData_price_data.start_date_2 <= undefined || $scope.formData_price_data.end_date_2 == undefined) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(533));
                return false;
            }
        }
        if ($scope.formData_price_data.volume_3s > 0) {
            if ($scope.formData_price_data.discount_price_3 <= 0 || $scope.formData_price_data.discount_price_3 == undefined) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(534));
                return false;
            }
            if ($scope.formData_price_data.start_date_3 <= undefined || $scope.formData_price_data.end_date_3 == undefined) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(535));
                return false;
            }
        }

        $scope.formData_price_data.sp_id = "";
        if ($scope.priceFormData.update_id == "") {
            if (($scope.formData_price_data.volume_2s == '-1') || ($scope.formData_price_data.volume_3s == '-1')) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Volumes']));
                return;
            }
        }

        $scope.priceFormData.volume_data = $scope.formData_price_data;

        //console.log($scope.priceFormData);return;

        var updateUrl = $scope.$root.stock + "products-listing/add-purchase-info";
        if ($scope.priceFormData.update_id != undefined)
            var updateUrl_purchase = $scope.$root.stock + "products-listing/update-purchase-info";


        $http
            .post(updateUrl_purchase, $scope.priceFormData)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                    $scope.get_sale_price(type);
                    //angular.element('#model_btn_sale_price').modal('hide');
                    //$scope.show_price_sale_edit_form (res.data.id ,type);
                }
                else
                    toaster.pop('error', 'Error', res.data.error);

            });
    }

    $scope.add_price_sale = function (formData_price_data) {
        var updateUrl = $scope.$root.pr + "srm/srm/update_product_values";
        // $scope.formData_price_data.product_id = $scope.$root.crm_id;
        $scope.formData_price_data.token = $scope.$root.token;
        $scope.formData_price_data.tab_id_2 = 4;
        $scope.formData_price_data.sp_id = $scope.sp_id;

        $scope.formData_price_data.volume_ids = $scope.formData_price_data.volume_id !== undefined ? $scope.formData_price_data.volume_id.id : 0;
        $scope.formData_price_data.supplier_types = $scope.formData_price_data.supplier_type_11 !== undefined ? $scope.formData_price_data.supplier_type_11.id : 0;

        $scope.formData_price_data.volume_1s = $scope.formData_price_data.volume_1 !== undefined ? $scope.formData_price_data.volume_1.id : 0;
        $scope.formData_price_data.supplier_type_1s = $scope.formData_price_data.supplier_type_1 !== undefined ? $scope.formData_price_data.supplier_type_1.id : 0;

        $scope.formData_price_data.volume_2s = $scope.formData_price_data.volume_2 !== undefined ? $scope.formData_price_data.volume_2.id : 0;
        $scope.formData.supplier_type_2s = $scope.formData_price_data.supplier_type_2 !== undefined ? $scope.formData_price_data.supplier_type_2.id : 0;

        $scope.formData_price_data.volume_3s = $scope.formData_price_data.volume_3 !== undefined ? $scope.formData_price_data.volume_3.id : 0;
        $scope.formData_price_data.supplier_type_3s = $scope.formData_price_data.supplier_type_3 !== undefined ? $scope.formData_price_data.supplier_type_3.id : 0;


        if ($scope.formData_price_data.sp_id == "") {
            if (($scope.formData_price_data.volume_2s == '-1') || ($scope.formData_price_data.volume_3s == '-1')) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Volumes']));
                return;
            }
        }

        // console.log("DiscountVal::"+$scope.formData_price_data);

        var errorFlag = false;

        if ($scope.formData_price_data.sp_id == "") {
            angular.element('#dpval ul').hide();
            if ($scope.formData_price_data.discount_value_1 != "") {
                if ($scope.formData_price_data.discount_price_1 <= 0) {
                    angular.element('#parsley-id-dp1530').show();
                    errorFlag = true;
                } else {
                    angular.element('#parsley-id-dp1530').hide();
                }
            }

            if ($scope.formData_price_data.volume_2 != "" || $scope.formData_price_data.supplier_type_2 != "" || ($scope.formData_price_data.discount_value_2 != undefined && $scope.formData_price_data.discount_value_2 != "")) {
                if ($scope.formData_price_data.discount_price_2 <= 0) {
                    angular.element('#parsley-id-dp2530').show();
                    errorFlag = true;
                } else {
                    angular.element('#parsley-id-dp2530').hide();
                }
            }

            if ($scope.formData_price_data.volume_3 != "" || $scope.formData_price_data.supplier_type_3 != "" || ($scope.formData_price_data.discount_value_3 != undefined && $scope.formData_price_data.discount_value_3 != "")) {
                if ($scope.formData_price_data.discount_price_3 <= 0) {
                    angular.element('#parsley-id-dp3530').show();
                    errorFlag = true;
                } else {
                    angular.element('#parsley-id-dp3530').hide();
                }
            }
        } else {
            if ($scope.formData_price_data.discount_value_11 != "") {
                if ($scope.formData_price_data.discount_price_11 <= 0) {
                    angular.element('#dpval ul').hide();
                    angular.element('#parsley-id-dppop0530').show();
                    errorFlag = true;
                } else {
                    angular.element('#parsley-id-dppop0530').hide();
                }
            }
        }

        if (errorFlag) {
            return;
        }

        $http
            .post(updateUrl, $scope.formData_price_data)
            .then(function (res) {
                if (res.data.ack == true) {
                    if (res.data.tab_change == 'tab_supplier') {
                        $scope.get_price_sale($scope.formData_price_data.product_id);
                        angular.element('#model_btn_supplier_price').modal('hide');
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    }
                } else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(102));
                }
            });
    }

    $scope.show_price_one_pop_price = function () {
        var price = 0;
        var final_price = 0;
        var final_price_one = 0;

        price = $scope.formData_price_data.purchase_price_11;

        var f_id = this.formData_price_data.supplier_type_11.id;

        if (f_id == 1) {
            final_price_one = (parseFloat($scope.formData_price_data.discount_value_11)) * (parseFloat(price)) / 100;

            final_price = (parseFloat(price)) - (parseFloat(final_price_one));

        } else if (f_id == 2) {
            final_price = (parseFloat(price)) - (parseFloat($scope.formData_price_data.discount_value_11));
        }

        $scope.formData_price_data.discount_price_11 = final_price;
    }

    $scope.check_dates_single = function (rem_id) {

        // angular.element('#start_date_2').click();
        // angular.element('#end_date_2').click();

        var start_date_1 = new Date(angular.element("#start_date_1").val().split("/")[2] + "-" + angular.element("#start_date_1").val().split("/")[1] + "-" + angular.element("#start_date_1").val().split("/")[0]);
        var end_date_1 = new Date(angular.element("#end_date_1").val().split("/")[2] + "-" + angular.element("#end_date_1").val().split("/")[1] + "-" + angular.element("#end_date_1").val().split("/")[0]);
        var start_date_2 = new Date(angular.element("#start_date_2").val().split("/")[2] + "-" + angular.element("#start_date_2").val().split("/")[1] + "-" + angular.element("#start_date_2").val().split("/")[0]);
        var end_date_2 = new Date(angular.element("#end_date_2").val().split("/")[2] + "-" + angular.element("#end_date_2").val().split("/")[1] + "-" + angular.element("#end_date_2").val().split("/")[0]);

        var start_date_3 = new Date(angular.element("#start_date_3").val().split("/")[2] + "-" + angular.element("#start_date_3").val().split("/")[1] + "-" + angular.element("#start_date_3").val().split("/")[0]);
        var end_date_3 = new Date(angular.element("#end_date_3").val().split("/")[2] + "-" + angular.element("#end_date_3").val().split("/")[1] + "-" + angular.element("#end_date_3").val().split("/")[0]);
        //priceFormData.start_date
        //priceFormData.end_date

        //var start_date_2 = document.getElementById("start_date_2").value;
        //var end_date_2 = document.getElementById("end_date_2").value ;
        //var start_date_1 = new Date($scope.formData_price_data.start_date_1);
        //var end_date_1 = new Date($scope.formData_price_data.end_date_1);
        //var start_date_2 = new Date($scope.formData_price_data.start_date_2);
        //var end_date_2 = new Date($scope.formData_price_data.end_date_2);
        //var start_date_3 = new Date($scope.formData_price_data.start_date_3);
        //var end_date_3 = new Date($scope.formData_price_data.end_date_3);
        var counter = 0;

        console.log(rem_id);

        if (Number(rem_id) == 1) {
            // if(start_date_1!=undefined && end_date_1!=undefined)
            // {
            //console.log(start_date_1);   console.log(start_date_2); console.log(end_date_2);
            if (
                (Date.parse(start_date_1) >= Date.parse(start_date_2)) && ((Date.parse(start_date_1) <= Date.parse(end_date_2)))
                || (Date.parse(start_date_1) >= Date.parse(start_date_3)) && ((Date.parse(start_date_1) <= Date.parse(end_date_3)))
            )
                counter++;

            if (
                (Date.parse(end_date_1) >= Date.parse(start_date_2)) && ((Date.parse(end_date_1) <= Date.parse(end_date_2)))
                || (Date.parse(end_date_1) >= Date.parse(start_date_3)) && ((Date.parse(end_date_1) <= Date.parse(end_date_3)))
            )
                counter++;

            // }
        }

        if (Number(rem_id) == 2) {
            // if(start_date_1!=undefined && end_date_1!=undefined)
            // {
            if (
                (Date.parse(start_date_2) >= Date.parse(start_date_1)) && ((Date.parse(start_date_2) <= Date.parse(end_date_1)))
                || (Date.parse(start_date_2) >= Date.parse(start_date_3)) && ((Date.parse(start_date_2) <= Date.parse(end_date_3)))

            )
                counter++;

            if (
                (Date.parse(end_date_2) >= Date.parse(start_date_1)) && ((Date.parse(end_date_2) <= Date.parse(end_date_1)))
                || (Date.parse(end_date_2) >= Date.parse(start_date_3)) && ((Date.parse(end_date_2) <= Date.parse(end_date_3)))
            )
                counter++;

            // }
        }

        if (Number(rem_id) == 3) {
            // if(start_date_1!=undefined && end_date_1!=undefined)
            // {
            if (
                (Date.parse(start_date_3) >= Date.parse(start_date_1)) && ((Date.parse(start_date_3) <= Date.parse(end_date_1)))
                || (Date.parse(start_date_3) >= Date.parse(start_date_2)) && ((Date.parse(start_date_3) <= Date.parse(end_date_2)))

            )
                counter++;

            if (
                (Date.parse(end_date_3) >= Date.parse(start_date_1)) && ((Date.parse(end_date_3) <= Date.parse(end_date_1)))
                || (Date.parse(end_date_3) >= Date.parse(start_date_2)) && ((Date.parse(end_date_3) <= Date.parse(end_date_2)))
            )
                counter++;
            // }
        }

        /* 	console.log(counter);
         if(counter>0) { toaster.pop('error', 'Error', 'Please review dates.');   angular.element('.pic_block').attr("disabled", true);}
         else angular.element('.pic_block').attr("disabled", false);*/
    }

    $scope.add_sale_list = function () {
        var selected_sales = "";
        var sale_currency = "";
        var selected_sales_ids = "";

        angular.forEach($scope.selection_record_get, function (val, index) {
            if (angular.element('#selected_' + $scope.selection_record_get[index]['id']).is(':checked')) {
                selected_sales += $scope.selection_record_get[index]['name'] + ",";
                sale_currency += $scope.selection_record_get[index]['sale_currency'] + ",";
                selected_sales_ids += $scope.selection_record_get[index]['id'] + ",";
            }
        });
        angular.element('.display_record').html(selected_sales);
        $scope.priceFormData.sale_ids = selected_sales_ids;
        $scope.priceFormData.sale_names = selected_sales;
        $scope.priceFormData.sale_currency = sale_currency;
        angular.element('#price_sale_list_modal').modal('hide');
    };

    $scope.checkAll_price = function () {

        $scope.selectedList = '';
        $scope.Selected = '';

        var bool = angular.element("#selecctall_2").is(':checked');
        if (!bool) {
            angular.element('.pic_block').attr("disabled", true);
        } else {
            angular.element('.pic_block').attr("disabled", false);
        }

        angular.forEach($scope.selection_record_get, function (item) {
            angular.element('#selected_' + item.id).prop('checked', bool);

        });
    };

    $scope.shownew_get_price = function (classname) {
        angular.element(".new_button_" + classname).hide();
        angular.element(".replace_button_" + classname).show();
        var count = 0;

        angular.forEach($scope.selection_record_get, function (item) {
            var bool = angular.element("#selected_" + item.id).is(':checked');
            if (bool) {
                count++;
            } else {
                angular.element('#selecctall_2').prop('checked', false);
            }
        });
        if (count == 0) {
            angular.element('.pic_block').attr("disabled", true);
        } else {
            angular.element('.pic_block').attr("disabled", false);
        }
    };

    $scope.calculate_price = function () {


        var count = 0;
        angular.forEach($scope.selection_record_get, function (value) {

            if (angular.element('#selected_' + value.id).prop('checked'))
                count++;
        });
        if (count != 0) {
            angular.element('#from_selected').hide();
            angular.element('#from_ch_selected').show();
        } else {
            angular.element('#from_selected').show();
            angular.element('#from_ch_selected').hide();
        }
        /* if(count!=0){
         count= count+ $scope.selected_count;
         }*/
        return count;
    };


    //dynamic volumes
    $scope.choices = {};
    $scope.choices = [{ volume_type: '1' }];

    $scope.addNewChoice = function () {
        jQuery("html, body").animate({
            scrollTop: '+=1000px'
        });
        var newItemNo = $scope.choices.length + 1;
        $scope.choices.push({ 'volume_type': '' + newItemNo, 'purchase_price': '' + $scope.priceFormData.unit_price });
    };


    // ----------------   Customer Price    -----------------------------------------

    $scope.getCustItemInfo22 = function () {

        $scope.module_id = 74;
        $scope.filter_id = 119;
        $scope.module_table = 'crm_price_offer';
        $scope.more_fields = 'is_listed*volume_1_price*volume_2_price*volume_3_price';
        $scope.condition = 0;
        $scope.sendRequest = false;

        if ($scope.$root.crm_id > 0)
            $scope.postData = {
                'column': 'crm_id',
                'value': $scope.$root.crm_id,
                token: $scope.$root.token,
                'more_fields': $scope.more_fields
            }

        $scope.MainDefer = null;
        $scope.mainParams = null;
        $scope.mainFilter = null;


        $scope.count = 1;
        var vm = this;

        var ApiAjax = $scope.$root.sales + "customer/customer/customer-items-info";

        $scope.$on("myCustItemInfoEventReload", function (event, args) {
            $scope.sendRequest = true;
            if (args != undefined) {
                if (args[1] != undefined)
                    $scope.detail(args[1]);
                $scope.postData = {
                    'column': 'crm_id',
                    'value': $scope.$root.crm_id,
                    token: $scope.$root.token,
                    'more_fields': $scope.more_fields
                }
                $scope.$root.crm_id = args[0];
            }
            $scope.count = $scope.count + 1;

            ngDataService.getDataCustom($scope.MainDefer, $scope.mainParams, ApiAjax, $scope.mainFilter, $scope, $scope.postData);
            $scope.table.tableParams5.reload();

        });

        $scope.detail = function (id) {
            if ($scope.$root.lblButton == 'Add New') {
                $scope.$root.lblButton = 'Edit';
            }

            $scope.$root.tabHide = 0;
            $scope.$root.$broadcast("openCustItemInfoFormEvent", { 'edit': false, id: id });
        }

        $scope.editForm = function (id) {
            $scope.$root.$broadcast("openCustItemInfoFormEvent", { 'edit': true, id: id });
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


    };


    // ----------------   Price    -----------------------------------------

    $scope.category_list_filter = [
        { value: 'code', id: 'customer_no' }, { value: 'city', id: 'city' }
        , { value: 'postcode', id: 'postcode' }, { value: 'name', id: 'name' }
        , { value: 'city', id: 'city' }, { value: 'address', id: 'address_1' }
        , { value: 'segment', id: 'segment' }, { value: 'Buying group', id: 'Buying group' }];

    $scope.list_discount_on = [];
    $scope.list_discount_on = [{ value: 'Customer  Individual Price', id: 0 }, { value: 'Standand Selling Price', id: 1 }];

    $scope.ourTeamCategories = [];
    $scope.ourTeamCategories = [
        { "value": 'Segment', id: 1 },
        { "value": 'Buying group', id: 2 },
        { "value": 'Both', id: 3 },
    ]
    $scope.selected_discount_on = false;
    $scope.promotion_price = true;
    $scope.required_checked = false;
    $scope.chk = false;

    $scope.show_price = function () {


        //	$scope.formData.sale_unit_cost =$scope.formData.standard_price ;
        $scope.formData.sale_selling_price = $scope.formData.standard_price;
        // console.log($scope.formData.sale_selling_price);

        if ($scope.formData.sale_selling_check) {  // when checked
            $scope.sale_price = true;
            $scope.promotion_price = false;
        } else {
            $scope.sale_price = false;
            $scope.promotion_price = true;
        }
    }

    $scope.show_price_calculate = function () {
        var price = 0;
        var final_price = 0;
        var id = this.formData.sale_selling_check.id;
        if (id == 1) {
            price = $scope.formData.sale_selling_price;
            var f_id = this.formData.supplier_type.id;
            if (f_id == 1) {

                var final_price_one = (parseFloat($scope.formData.discount_value)) * (parseFloat(price)) / 100;
                final_price = (parseFloat(price)) - (parseFloat(final_price_one));
            } else if (f_id == 2) {
                final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value));

            }

            var final_new = (Math.round(final_price * 100) / 100).toFixed(2);

            if (final_new != 'NaN')
                $scope.formData.discount_price = final_new;


        }
    }

    $scope.discount_check = function () {

        var id = this.formData.sale_selling_check.id;

        $scope.selected_discount_on = false;
        $scope.required_checked = false;
        if (id == 1) {
            $scope.selected_discount_on = true;
            $scope.required_checked = true;
        }


        $scope.formData.sale_selling_price = $scope.formData.standard_price;

    }

    $scope.mySortFunction = function (item) {
        if (isNaN(item[$scope.sortExpression]))
            return item[$scope.sortExpression];
        return parseInt(item[$scope.sortExpression]);
    }

    $scope.get_filter_list = function () {

        var category_id = this.formData.category_id.name;
        $scope.sortExpression = category_id;
        // reverseSort = !reverseSort

        /* if($scope.MyCustomeFilters && $scope.tableParams5){
         $scope.tableParams5.reload();
         }	 */
        /*$scope.postData = {'condition':'namelike_*'+category_id+'@urllike_*'+category_id,'all': "1",token:$scope.$root.token};
         ngDataService.getDataCustomAjax( $scope.MainDefer, $scope.mainParams, Api,$scope.mainFilter,$scope,'doreload'+$scope.count ,$scope.postData);
         $scope.table.tableParams5.reload();
         */

    }

    var sale_Url = $scope.$root.stock + "product-tab-values/customer_sale_list";
    $scope.get_filter_select = function (agr) {

        if (agr == 1) {
            $scope.formData_customer.sale_customer_id = '';
        }

        var category_id = document.getElementById("select_1").value;

        var postData_sale = {
            'token': $scope.$root.token,
            'id': $scope.formData_customer.sale_customer_id,
            'type': category_id,
            'product_id': $scope.formData.product_id
        };
        $http
            .post(sale_Url, postData_sale)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.selection_record = {};
                    $scope.columnss = [];

                    $scope.selection_record = res.data.response;
                    $scope.total = res.data.total;
                    $scope.selected_count = res.data.selected_count;

                    $scope.formData_customer.discount_type2 = res.data.discount_type2;
                    $scope.formData_customer.discount_value2 = res.data.discount_value2;
                    $scope.formData_customer.discounted_price2 = res.data.discounted_price2;


                    angular.forEach(res.data.response[0], function (val, index) {

                        $scope.columnss.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    angular.forEach(res.data.response, function (value, key) {
                        if (value.checked == 1)
                            //  console.log('#selected_'+value.id);
                            angular.element('#selected_' + value.id).click();
                        //	 angular.element(".selected_"+value.id).click();
                    });
                }
            });

    }

    $scope.setSymbol = function (div_id) {

        $scope.curency_sign = false;
        $scope.percentage_sign = false;

        //var id = this.formData.div_id.id;
        // var id =document.getElementById("type_"+div_id).value;
        var id = angular.element('#type_' + div_id).val();
        // if (id == 0)  angular.element('#date_msg_' + div_id).show();
        // else  angular.element('#date_msg_' + div_id).hide();

        if (div_id === 1) id = this.formData_price_data.supplier_type.id;
        if (div_id === 11) id = this.formData.supplier_type.id;


        if (id === 1) $scope.percentage_sign = true;
        else if (id === 2) $scope.curency_sign = true;
    }

    $scope.submit_sales = function () {


        $scope.selectedList = $scope.record.filter(function (namesDataItem) {
            return namesDataItem.checked;
        });
        //  console.log($scope.selectedList);

        //	 $scope.sale_name.push({'id':'-1','name':'++ Add New ++' }); //selectedList.name

        angular.forEach($scope.selectedList, function (index, obj) {

            for (var i = 0; i < $scope.record.length; i++) {
                var object = $scope.record[i];
                //	console.log(object.id ==obj.id);
                if (object.id == obj.id) {
                    //$scope.sale_name.push(i, 1); //selectedList.name
                    $scope.sale_name = $scope.selectedList[index];
                }
            }

        });
        var values = [];
        angular.element(".list_values:checked").each(function () {
            values.push(angular.element(this).val());
        });
        var selected;
        selected = values.join(',') + ",";
        alert("You have selected " + values);
        $scope.model_sales = false;

    }

    $scope.getcustomer = function (arg) {
        $scope.titile_2 = 'Customer';

        // var empUrl = $scope.$root.sales+"customer/customer/listings";
        var empUrl = $scope.$root.stock + "product-tab-values/customer_sale_list";
        var postData = {
            'token': $scope.$root.token,
            'get_id': 1,
            'product_id': $scope.formData.product_id
        };
        $http
            .post(empUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
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
                } else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            });

        ngDialog.openConfirm({
            template: 'modalSaleDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (result) {
            if (arg == 'saleperson') {
                $scope.selectedAll = '';
                $scope.selectedList = '';
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
                        if (object.price == obj.price) {
                            customer_price += obj.price + ",";
                        }


                    }

                    $scope.formData.sale_name = test_name;
                    document.getElementById("display_record").innerHTML = test_name;
                    $scope.formData.sale_name_id = test_id;
                    $scope.formData.customer_price = customer_price;
                    //	console.log(customer_price);


                });
            }
        },
            function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
    }

    $scope.checkDiscountOn = function () {

        if (angular.element('#saleSellingCheckId').val() == 1) {
            return true
        } else {
            return false;
        }
    };


    $scope.get_match_result = function (id) {

        $scope.postData = {};

        if (id == 'all') {
            //	$scope.postData = {'all': "1",token:$scope.$root.token};
            $scope.formData.select_1 = '';
            $scope.formData.category_id = '';
            $scope.formData.searchKeyword = '';

            $scope.select_1 = '';
            $scope.category_id = '';
            $scope.searchKeyword = '';
        }

        var sale_Url = $scope.$root.stock + "product-tab-values/get_customer_sale_list_filter";

        $scope.postData.price_check = $scope.formData.sale_selling_check.id;
        $scope.postData.product_id = $scope.formData.product_id;
        $scope.postData.token = $scope.$root.token;
        $scope.postData.get_id = id;
        $scope.postData.select_1s = $scope.formData.select_1 !== undefined ? $scope.formData.select_1.id : '';//document.getElementById("select_1").value;

        $scope.postData.cat_ids = $scope.formData.category_id !== undefined ? $scope.formData.category_id.id : '';//document.getElementById("category_id").value;

        $scope.postData.type = $scope.formData.select_1 !== undefined ? $scope.formData.select_1.id : ''; //document.getElementById("category_id").value;

        //$scope.postData.id= $scope.formData_customer.sale_customer_id;

        $scope.postData.searchKeyword = document.getElementById("searchKeyword").value;
        //$scope.searchKeyword;
        $scope.postData.id = $scope.formData_customer.sale_customer_id;
        // console.log($scope.formData_customer.sale_customer_id=id );return;
        $http
            .post(sale_Url, $scope.postData)
            .then(function (res) {
                $scope.selection_record_get = {};
                $scope.columnss_get = [];

                if (res.data.ack == true) {
                    $scope.selection_record_get = res.data.response;
                    $scope.total = res.data.total;
                    $scope.selected_count = res.data.selected_count;

                    $scope.formData_customer.discount_type2 = res.data.discount_type2;
                    $scope.formData_customer.discount_value2 = res.data.discount_value2;
                    $scope.formData_customer.discounted_price2 = res.data.discounted_price2;


                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columnss_get.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    $scope.columnss = [];
                    $scope.selection_record = {};
                    $scope.selection_record = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columnss.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    angular.forEach(res.data.response, function (value, key) {
                        if (value.checked == 1)
                            //  console.log('#selected_'+value.id);
                            angular.element('#selected_' + value.id).click();
                        //	 angular.element(".selected_"+value.id).click();
                    });
                }
                else toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            });
    }

    $scope.checkAll = function () {

        //$scope.selectedAll = '';
        $scope.selectedList = '';
        $scope.Selected = '';

        // var bool = document.getElementById("selecctall").checked;
        var bool = angular.element("#selecctall").is(':checked');
        if (!bool) {
            angular.element('.pic_block_del_list').attr("disabled", true);
        } else {
            angular.element('.pic_block_del_list').attr("disabled", false);
        }
        // alert(bool);
        angular.forEach($scope.selection_record, function (item) {
            //  angular.element('#selected_'+item.id).click();
            if (item.price != null || $scope.getDiscountOnValue()) {
                angular.element('#selected_' + item.id).prop('checked', bool);
            }

        });


    };

    $scope.check_total_edit = function (classname) {

        // $scope.add_row_table = false;
        angular.element(".new_button_" + classname).hide();
        angular.element(".replace_button_" + classname).show();
        //   angular.element(".new_" + classname).removeAttr("disabled");
        var count = 0;
        // alert(bool);
        angular.forEach($scope.selection_record, function (item) {

            //  angular.element('#selected_'+item.id).click();
            if (item.price != null || $scope.getDiscountOnValue()) {
                //var bool = document.getElementById("selected_" + item.id).checked;
                var bool = angular.element("#selected_" + item.id).is(':checked');
                if (bool) {
                    count++;
                } else {
                    angular.element('#selecctall').prop('checked', false);
                }
            }
        });
        /* if (count == 0)
         //  angular.element('.pic_block').attr("disabled", true);
         else
         //  angular.element('.pic_block').attr("disabled", false);
         */
    };

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

    $scope.checkDiscountOnValue = false;

    $scope.setDiscountOn = function (discount) {
        if (discount == "NA") {
            $scope.checkDiscountOnValue = false;
        } else {
            $scope.checkDiscountOnValue = true;
        }
    };

    $scope.getDiscountOnValue = function () {
        return $scope.checkDiscountOnValue;
    };

    $scope.checkAll_cancel = function () {

        $scope.selectedList = '';
        $scope.Selected = '';
        // var bool = document.getElementById("selecctall_2").checked;
        var bool = angular.element("#selecctall_2").is(':checked');
        if (!bool) {
            angular.element('.pic_block').attr("disabled", true);
        } else {
            angular.element('.pic_block').attr("disabled", false);
        }

        angular.forEach($scope.selection_record_get, function (item) {
            //  angular.element('#selected_'+item.id).click();
            if (item.price != null || $scope.checkDiscountOn()) {
                angular.element('#selected_' + item.id).prop('checked', bool);
            }

        });
    };

    $scope.calculateCheckedEdit_cancel = function () {


        var count = 0;
        angular.forEach($scope.selection_record_get, function (value) {

            if (value.price != null || $scope.checkDiscountOn()) {
                if (angular.element('#selected_' + value.id).prop('checked'))
                    count++;
            }

        });
        if (count != 0) {
            angular.element('#from_selected').hide();
            angular.element('#from_ch_selected').show();
        } else {
            angular.element('#from_selected').show();
            angular.element('#from_ch_selected').hide();
        }
        /* if(count!=0){
         count= count+ $scope.selected_count;
         }*/
        return count;
    };

    $scope.calculateCheckedEdit = function () {


        var count = 0;
        angular.forEach($scope.selection_record, function (value) {

            if (value.price != null || $scope.getDiscountOnValue()) {

                if (angular.element('#selected_' + value.id).prop('checked'))
                    count++;
            }

        });
        if (count != 0) {
            angular.element('#from_selected').hide();
            angular.element('#from_ch_selected').show();
        } else {
            angular.element('#from_selected').show();
            angular.element('#from_ch_selected').hide();
        }
        /* if(count!=0){
         count= count+ $scope.selected_count;
         }*/

        return count;
    };

    $scope.add_customer = function (formData_customer) {


        var updateUrl = $scope.$root.stock + "products-listing/update-sale-promotion";

        var count = 0;
        $scope.selectedList = $scope.selection_record.filter(function (namesDataItem) {
            return namesDataItem.Selected;
            count++;
        });
        if (count > 0) {
            angular.element('.pic_block').attr("disabled", true);
            toaster.pop('error', 'Error', 'Please select at least one customer.');
        }

        var test_name = '';
        var test_id = '';
        var customer_price = '';
        var discount_type = '';
        var discounted_price2 = '';

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

                if (object.discount_type == obj.discount_type) {
                    discount_type = obj.discount_type + ",";
                }

                if (object.discounted2 == obj.discounted2) {
                    //console.log(discounted_price2);	console.log(obj.discounted2);
                    if (obj.discounted2 === null)
                        discounted_price2 = obj.discounted2;
                    else
                        discounted_price2 = discounted_price2 + ',' + obj.discounted2;
                    // discounted_price2  = obj.discounted2+ ",";
                }
            }


            $scope.formData_customer.sale_name2 = test_name;
            $scope.formData_customer.sale_name_id2 = test_id;
            $scope.formData_customer.customer_price2 = customer_price;
            //document.getElementById("display_record").innerHTML = test_name;
            $scope.formData_customer.discounted_customer_price = discounted_price2.substr(1);
        });

        $scope.formData_customer.product_id = $scope.formData.product_id;
        $scope.formData_customer.token = $scope.$root.token;
        $scope.formData_customer.tab_id_2 = 66;
        $scope.formData.sale_selling_checks = $scope.formData.sale_selling_check !== undefined ? $scope.formData.sale_selling_check.id : 0;

        $http
            .post(updateUrl, formData_customer)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', res.data.info, res.data.msg);

                    if (res.data.tab_change == 'tab_sale_cancel') {
                        $scope.get_sale();
                        angular.element('#model_btn_cs').modal('hide');
                    }
                } else {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                }
            });
    }

    $scope.supplier_list_add = false;
    $scope.supplier_list_edit = false;

    $scope.get_customer_add_list = function (id) {


        $scope.formData.select_1 = '';
        $scope.formData.category_id = '';
        $scope.formData.searchKeyword = '';

        $scope.formData.category_id = $scope.category_list_filter[3];
        $scope.formData_customer.sale_customer_id = id;


        var postData = {
            'token': $scope.$root.token,
            'get_id': id,
            'product_id': $scope.formData.product_id
            //	'price_check':$scope.formData.sale_selling_check.id
        };
        $http
            .post(sale_Url, postData)
            .then(function (res) {
                $scope.selection_record_get = {};
                $scope.columnss_get = [];

                if (res.data.ack == true) {

                    $scope.selection_record_get = res.data.response;
                    $scope.total = res.data.total;
                    $scope.selected_count = res.data.selected_count;

                    $scope.formData_customer.discount_type2 = res.data.discount_type2;
                    $scope.formData_customer.discount_value2 = res.data.discount_value2;
                    $scope.formData_customer.discounted_price2 = res.data.discounted_price2;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columnss_get.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                }
                else toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            });

        angular.element('#model_btn_cs_first').modal({
            show: true
        });
    }

    $scope.add_list = function () {

        $scope.selectedList = $scope.selection_record_get.filter(function (namesDataItem) {
            return namesDataItem.Selected;
        });

        var test_name = '';
        var test_id = '';
        var customer_price = '';
        var discount_type = '';

        angular.forEach($scope.selectedList, function (obj) {
            for (var i = 0; i < $scope.selection_record_get.length; i++) {
                var object = $scope.selection_record_get[i];
                if (object.name == obj.name) {
                    test_name += obj.name + ",";
                }

                if (object.id == obj.id) {
                    test_id += obj.id + ",";
                }

                if (object.price == obj.price) {
                    customer_price += obj.price + ",";
                }

                if (object.discount_type == obj.discount_type) {
                    discount_type = obj.discount_type + ",";
                }
            }

            $scope.formData.sale_name2 = test_name;
            $scope.formData.sale_name_id2 = test_id;
            $scope.formData.customer_price2 = customer_price;

            //document.getElementById("display_record").innerHTML = test_name;
            //document.getElementById("display_record").innerHTML = test_name.substr(1);
            // $scope.formData_customer.discounted_customer_price = discounted_price2.substr(1);

        });
        document.getElementById("display_record").innerHTML = test_name.substring(0, test_name.length - 1);

        angular.element('#model_btn_cs_first').modal('hide');
    }

    $scope.check_total_add = function (classname) {

        angular.element(".new_button_" + classname).hide();
        angular.element(".replace_button_" + classname).show();
        var count = 0;
        // console.log( $scope.formData.sale_selling_check.id);
        angular.forEach($scope.selection_record_get, function (item) {
            //  angular.element('#selected_'+item.id).click();
            //if (item.price != null || $scope.checkDiscountOn()) {
            if ($scope.formData.sale_selling_check.id == 1) {

                var bool = angular.element("#selected_" + item.id).is(':checked');
                if (bool) count++;
                else angular.element('#selecctall_2').prop('checked', false);
            }
            else {
                if (item.price != null) {
                    //var bool = document.getElementById("selected_" + item.id).checked;
                    var bool = angular.element("#selected_" + item.id).is(':checked');
                    if (bool) count++;
                    else angular.element('#selecctall_2').prop('checked', false);

                }
            }
        });

    }


    $scope.get_customer_edit_list = function (id) {

        $scope.formData.select_1 = '';
        $scope.formData.category_id = '';
        $scope.formData.searchKeyword = '';
        $scope.formData.category_id = $scope.category_list_filter[3];

        $scope.formData_customer.sale_customer_id = id;
        var postData_sale = {
            'token': $scope.$root.token,
            'id': id,
            'get_id': 1,
            'product_id': $scope.formData.product_id
        };
        // var sale_Url = $scope.$root.stock + "product-tab-values/get_customer_sale";

        $http
            .post(sale_Url, postData_sale)
            .then(function (res) {
                $scope.selection_record = {};
                $scope.columnss = [];
                if (res.data.ack == true) {
                    $scope.selection_record = res.data.response;
                    $scope.total = res.data.total;
                    $scope.selected_count = res.data.selected_count;

                    $scope.formData_customer.discount_type2 = res.data.discount_type2;
                    $scope.formData_customer.discount_value2 = res.data.discount_value2;
                    $scope.formData_customer.discounted_price2 = res.data.discounted_price2;


                    angular.forEach(res.data.response[0], function (val, index) {

                        $scope.columnss.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.forEach(res.data.response, function (value, key) {
                        if (value.checked == 1) {
                            angular.element('#selected_' + value.id).click();
                            angular.element('.pic_block').attr("disabled", false);
                        }
                    });
                }
                else toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            });


        //	angular.element('#from_selected').show();
        angular.element('#model_btn_cs').modal({
            show: true
        });
    }

    $scope.edit_list = function () {

        $scope.selectedList = $scope.selection_record.filter(function (namesDataItem) {
            return namesDataItem.Selected;
        });

        var test_name = '';
        var test_id = '';
        var customer_price = '';
        var discount_type = '';

        angular.forEach($scope.selectedList, function (index, obj) {
            for (var i = 0; i < $scope.selection_record.length; i++) {
                var object = $scope.selection_record[i];

                if (object.name == obj.name) test_name += obj.name + ",";
                if (object.id == obj.id) test_id += obj.id + ",";
                if (object.price == obj.price) customer_price += obj.price + ",";
                if (object.discount_type == obj.discount_type) discount_type = obj.discount_type + ",";
            }

            $scope.formData.sale_name2 = test_name;
            $scope.formData.sale_name_id2 = test_id;
            $scope.formData.customer_price2 = customer_price;
            //document.getElementById("display_record").innerHTML = test_name;
            //document.getElementById("display_record").innerHTML = test_name.substr(1);
            // $scope.formData_customer.discounted_customer_price = discounted_price2.substr(1);

        });
        document.getElementById("display_recordd").innerHTML = test_name.substring(0, test_name.length - 1);

        angular.element('#model_btn_cs').modal('hide');
    }

    $scope.check_total_edit = function (classname) {

        // $scope.add_row_table = false;
        angular.element(".new_button_" + classname).hide();
        angular.element(".replace_button_" + classname).show();
        //   angular.element(".new_" + classname).removeAttr("disabled");
        var count = 0;
        // alert(bool);
        angular.forEach($scope.selection_record, function (item) {

            //  angular.element('#selected_'+item.id).click();
            if (item.price != null || $scope.getDiscountOnValue()) {
                //var bool = document.getElementById("selected_" + item.id).checked;
                var bool = angular.element("#selected_" + item.id).is(':checked');
                if (bool) {
                    count++;
                } else {
                    angular.element('#selecctall').prop('checked', false);
                }
            }
        });
        /* if (count == 0)
         //  angular.element('.pic_block').attr("disabled", true);
         else
         //  angular.element('.pic_block').attr("disabled", false);
         */
    }

    $scope.get_sale = function () {


        // $scope.$root.breadcrumbs[3].name = 'Sales Promotion';

        $scope.sale_selling_check = $scope.list_discount_on[0];
        var product_id = $scope.formData.product_id;

        $scope.show_sale_list = true;
        $scope.show_sale_form = false;
        angular.forEach($scope.list_discount_on, function (obj) {
            if (obj.value == 'Customer  Individual Price') {
                $scope.formData.sale_selling_check = obj;
            }
        });

        var API = $scope.$root.stock + "products-listing/get-sale-promotion-list";
        $scope.postData = {};

        $scope.postData = {
            'token': $scope.$root.token,
            'type': "1",
            'product_id': product_id,
            'page': $scope.item_paging.spage
            //'country_keyword': angular.element('#search_sale_listing_data').val()
        };
        $http
            .post(API, $scope.postData)
            .then(function (res) {
                $scope.sale_list = [];
                $scope.columns = [];
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;


                    $scope.sale_list = res.data.response;


                    angular.forEach(res.data.response, function (val, index) {
                        $scope.sale_list[index]['start_date'] = $scope.$root.convert_unix_date_to_angular(val.start_date);
                        $scope.sale_list[index]['end_date'] = $scope.$root.convert_unix_date_to_angular(val.end_date);
                    });

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
                //	else     toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            });

        $scope.showLoader = false;
    };

    $scope.fn_sale_Form = function () {


        $scope.supplier_list_add = true;
        $scope.supplier_list_edit = false;

        $scope.formData.s_start_date = $scope.$root.get_current_date();
        angular.element('.pic_block').attr("disabled", false);
        $scope.customers_list = true;

        $scope.formData.sale_promotion_id = '';
        $scope.formData.sale_selling_check = '';
        $scope.formData.sale_selling_price = '';
        $scope.formData.supplier_type = '';
        $scope.formData.discount_value = '';
        $scope.formData.discount_price = '';
        $scope.formData.s_end_date = '';

        $scope.formData.sale_name = '';
        document.getElementById("display_record").innerHTML = '';
        $scope.formData.sale_name_id = '';
        $scope.show_sale_form = true;
        $scope.show_sale_list = false;

        /*//$scope.!check_item_readonly = true;
         $scope.check_item_readonly = false;
         */

        //	 angular.element("#event_date").val(''); angular.element("#event_name").val(''); angular.element("#event_code").val(''); angular.element("#event_description").val('');
    }

    $scope.showOrderTrail = function (item, type) {
        $scope.searchKeyword_2 = {};
        var stock_trail_url = $scope.$root.setup + "warehouse/sale-stock-trial";
        // type ===== 1-> Current Stock, 2-> Available stock, 3-> Allocated Stock

        var postData = {
            'token': $scope.$root.token,
            'from_item': '1',
            'prod_id': item.id
        };

        if (type == 1) {
            $scope.stock_activity_title = 'Current Stock';
            $scope.list_type = 'current_stock';
            postData.list_type = 'current_stock';
        }
        else if (type == 2) {
            $scope.stock_activity_title = 'Available Stock';
            $scope.list_type = 'available_stock';
            postData.list_type = 'available_stock';
        }
        else if (type == 3) {
            $scope.stock_activity_title = 'Allocated Stock';
            $scope.list_type = 'allocated_stock';
            postData.list_type = 'allocated_stock';
        }

        $scope.prod_warehouse_trail_data = [];
        $scope.showLoader = false;
        $http
            .post(stock_trail_url, postData)
            .then(function (res) {

                $scope.columns2 = [];


                if (res.data.response != null) {
                    $scope.showLoader = false;
                    $scope.prod_warehouse_trail_data = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns2.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.element('#order_trail_modal').modal({ show: true });
                }
                else {
                    $scope.showLoader = false;
                }

            });
        $scope.searchKeyword_2 = {};
    }


    $scope.show_sale_edit_form = function (id) {
        angular.element('.pic_block').attr("disabled", false);
        $scope.customers_list = false;

        $scope.show_sale_form = true;
        $scope.show_sale_list = false;
        $scope.required_checked = false;


        /*	$scope.check_item_readonly = false;
         //$scope.!check_item_readonly = true;
         */

        var postUrl = $scope.$root.stock + "products-listing/get-sale-promotion-by-id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };

        $scope.formData.sale_promotion_id = id;
        $scope.supplier_list_add = false;
        $scope.supplier_list_edit = true;

        console.log($scope.supplier_list_add);

        $http
            .post(postUrl, postViewBankData)
            .then(function (res) {

                document.getElementById("display_recordd").innerHTML = res.data.response.customer_name;

                $scope.formData.sale_name2 = res.data.response.customer_name;
                $scope.formData.sale_name_id2 = res.data.response.customer_ids;
                $scope.formData.chk = res.data.response.sale_selling_check;

                $scope.formData.sale_selling_check = res.data.response.sale_selling_check;
                $scope.formData.sale_selling_price = res.data.response.sale_selling_price;

                angular.forEach($scope.list_type, function (obj) {
                    if (obj.id == res.data.response.type) {
                        $scope.formData.supplier_type = obj;
                    }
                });

                angular.forEach($scope.list_discount_on, function (obj) {
                    if (obj.id == res.data.response.sale_selling_check) {
                        $scope.formData.sale_selling_check = obj;
                    }
                });

                $scope.formData.discount_value = parseFloat(res.data.response.discount_value);
                $scope.formData.discount_price = res.data.response.discount_price;

                $scope.required_checked = false;
                $scope.selected_discount_on = false;

                if ($scope.formData.sale_selling_check == 1) {
                    $scope.selected_discount_on = true;
                    $scope.required_checked = true;
                }

                if (res.data.response.start_date == 0) $scope.formData.s_start_date = null;
                else $scope.formData.s_start_date = $scope.$root.convert_unix_date_to_angular(res.data.response.start_date);

                if (res.data.response.end_date == 0)
                    $scope.formData.s_end_date = null;
                else
                    $scope.formData.s_end_date = $scope.$root.convert_unix_date_to_angular(res.data.response.end_date);

            });
    }

    $scope.add_sale = function (formData) {


        $scope.formData.product_id = $scope.$root.product_id;
        $scope.formData.token = $scope.$root.token;
        $scope.formData.tab_id_2 = 6;
        $scope.formData.sale_selling_checks = $scope.formData.sale_selling_check !== undefined ? $scope.formData.sale_selling_check.id : 0;
        $scope.formData.supplier_types = $scope.formData.supplier_type !== undefined ? $scope.formData.supplier_type.id : 0;

        if ($scope.formData.sale_selling_check.id == 1) {

            var errorFlag = false;
            if ($scope.formData.discount_price <= 0) {
                angular.element('#dpval ul').hide();
                angular.element('#parsley-id-dp0530').show();
                errorFlag = true;
            } else {
                angular.element('#parsley-id-dp0530').hide();
            }
        }

        if ($scope.formData.sale_name2 == "" || $scope.formData.sale_name_id2 == "" || $scope.formData.customer_price2 == "") {
            angular.element('#parsley-id-cs0530').show();
            errorFlag = true;
        }
        else angular.element('#parsley-id-cs0530').hide();


        if (errorFlag) {
            return;
        }

        var updateUrl = $scope.$root.stock + "products-listing/add-sale-promotion";
        var var_msg = 'Add';
        var var_error = 'Record Inserted Successfully .';
        if ($scope.formData.sale_promotion_id > 0) {
            var updateUrl = $scope.$root.stock + "products-listing/update-sale-promotion";
            var_msg = 'Edit';
            var_error = $scope.$root.getErrorMessageByCode(102);
        }

        $http
            .post(updateUrl, $scope.formData)
            .then(function (res) {
                if (res.data.ack == true) {

                    toaster.pop('success', var_msg, var_error);
                    // if (res.data.tab_change == 'tab_sale') {
                    $scope.get_sale();
                    //}
                }
                else toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(106));
            });
    }

    $scope.delete_sale = function (id, index, arr_data) {

        var delUrl = $scope.$root.stock + "products-listing/delete-sale-promotion";
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
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };


    // ------------- 	 Supplier 	 ----------------------------------------

    $scope.showEditvolume_form = function () {
        $scope.check_item__volume = false;
        ////$scope.!check_item_readonly__volume = true;

        //$scope.formData.purchase_price  =$scope.$root.number_format_remove($scope.formData.purchase_price,$scope.decimal_range);
        $scope.formData.discount_value = $scope.$root.number_format_remove($scope.formData.discount_value, $scope.decimal_range);
        $scope.formData.discount_price = $scope.$root.number_format_remove($scope.formData.discount_price, $scope.decimal_range);

    }


    $scope.get_sals_price = function () {
        if ($stateParams.id !== undefined) {
            var DetailsURL = $scope.$root.stock + "products-listing/get-product-by-id";

            $http
                .post(DetailsURL, { 'token': $scope.$root.token, 'product_id': $stateParams.id })
                .then(function (res) {
                    if (res.data.ack == true) {
                        if (res.data.response.standard_price != 0)
                            $scope.formData.purchase_price
                                = $scope.$root.number_format_remove(res.data.response.standard_price, $scope.decimal_range);
                        else $scope.formData.purchase_price = '';
                        $scope.formData.vat_chk = res.data.response.vat_chk;
                    }

                    //else   toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                });
        }
    }

    $scope.list_type = [{ 'name': 'Percentage', 'id': 1 }, { 'name': 'Value', 'id': 2 }];

    $scope.selected = 0;
    $scope.total = 0;
    $scope.selected_count = 0;
    $scope.show_symbol = false;

    var volumeUrl = $scope.$root.stock + "unit-measure/get-sale-offer-volume-by-type";
    var add_saleUrl = $scope.$root.stock + "unit-measure/add-sale-offer-volume";
    var get_unit_setup_category = $scope.$root.stock + "unit-measure/get-unit-setup-list-category";
    $scope.list_unit_category = {};
    $scope.formData_vol_1 = {};

    $scope.get_category_list = function () {

        $scope.list_unit_category = [];
        $http
            .post(get_unit_setup_category, { 'token': $scope.$root.token, 'product_id': $stateParams.id })
            .then(function (vol_data) {
                $scope.list_unit_category = [];
                if (vol_data.data.ack == true) {

                    $scope.list_unit_category = vol_data.data.response;

                    if ($scope.formData.unit_id !== undefined) {
                        ref_quantity
                        angular.forEach($scope.list_unit_category, function (obj) {
                            if (obj.name == $scope.formData.unit_id.title) {
                                $scope.formData_vol_1.unit_category = obj;
                            }
                        });
                    }

                    /* $scope.formData_vol_1.unit_category=$scope.formData.unit_id.id;
                     $scope.formData_vol_1.unitName=$scope.formData.unit_id.title;*/

                }
                else toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['U.O.M']));
            });
    }

    $scope.get_volume_list_single = function (arg) {


        $http
            .post(volumeUrl_purchase, { category: arg, 'product_id': $stateParams.id, 'token': $scope.$root.token })
            .then(function (res) {
                $scope.arr_volume_id = [];
                $scope.arr_volume_id.push({ 'id': '', 'name': '' });
                if (res.data.ack == true) $scope.arr_volume_id = res.data.response;
                // else 	toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                if ($scope.user_type == 1) $scope.arr_volume_id.push({ 'id': '-1', 'name': '++ Add New ++' });
            });


        $http
            .post(volumeUrl, {
                type: 'Volume 1',
                category: arg,
                'product_id': $scope.formData.product_id,
                'token': $scope.$root.token
            })
            .then(function (vol_data) {


                $scope.arr_volume_1 = [];
                $scope.arr_volume_1.push({ 'id': '', 'name': '' });
                if (arg == 1) {
                    if (vol_data.data.ack == true) $scope.arr_volume_1 = vol_data.data.response;

                    // else 	toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                    if ($scope.user_type == 1) $scope.arr_volume_1.push({ 'id': '-1', 'name': '++ Add New ++' });
                }
            });

        /*   $scope.arr_volume_1.push({'id': '', 'name': ''});
         if(arg==1)
         {   $scope.arr_volume_1 = vol_data.data.response;

         if($scope.arr_volume_1.length ==0)
         { $scope.arr_volume_1.push({'id': '-1', 'name': '++ Add New ++'});}

         else if($scope.arr_volume_1.length >0)
         if ($scope.user_type == 1)   $scope.arr_volume_1.push({'id': '-1', 'name': '++ Add New ++'});

         }
         else if(arg==2)
         {  $scope.arr_volume_purchase_1.push({'id': '', 'name': ''});
         $scope.arr_volume_purchase_1 = vol_data.data.response;

         if($scope.arr_volume_purchase_1.length ==0)
         { $scope.arr_volume_purchase_1.push({'id': '-1', 'name': '++ Add New ++'});}

         else if($scope.arr_volume_purchase_1.length >0)
         if ($scope.user_type == 1)   $scope.arr_volume_purchase_1.push({'id': '-1', 'name': '++ Add New ++'});

         }


         }	*/

        $http
            .post(volumeUrl, {
                type: 'Volume 2',
                category: arg,
                'product_id': $scope.formData.product_id,
                'token': $scope.$root.token
            })
            .then(function (vol_data) {
                $scope.arr_volume_2 = [];
                $scope.arr_volume_2.push({ 'id': '', 'name': '' });
                if (arg == 1) {
                    if (vol_data.data.ack == true) $scope.arr_volume_2 = vol_data.data.response;

                    // else 	toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                    if ($scope.user_type == 1) $scope.arr_volume_2.push({ 'id': '-1', 'name': '++ Add New ++' });
                }
            });

        /*if(arg==1)
         {$scope.arr_volume_2.push({'id': '', 'name': ''});
         $scope.arr_volume_2 = vol_data.data.response;


         if($scope.arr_volume_2.length ==0)
         { $scope.arr_volume_2.push({'id': '-1', 'name': '++ Add New ++'});}

         else if($scope.arr_volume_2.length >0)
         if ($scope.user_type == 1)   $scope.arr_volume_2.push({'id': '-1', 'name': '++ Add New ++'});

         }
         else if(arg==2)
         {  $scope.arr_volume_purchase_2.push({'id': '', 'name': ''});
         $scope.arr_volume_purchase_2 = vol_data.data.response;


         if($scope.arr_volume_purchase_2.length ==0)
         { $scope.arr_volume_purchase_2.push({'id': '-1', 'name': '++ Add New ++'});}

         else if($scope.arr_volume_purchase_2.length >0)
         if ($scope.user_type == 1)   $scope.arr_volume_purchase_2.push({'id': '-1', 'name': '++ Add New ++'});


         } 
         */


        $http
            .post(volumeUrl, {
                type: 'Volume 3',
                category: arg,
                'product_id': $scope.formData.product_id,
                'token': $scope.$root.token
            })
            .then(function (vol_data) {

                $scope.arr_volume_3 = [];
                $scope.arr_volume_3.push({ 'id': '', 'name': '' });
                if (arg == 1) {
                    if (vol_data.data.ack == true) $scope.arr_volume_3 = vol_data.data.response;

                    // else 	toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                    if ($scope.user_type == 1) $scope.arr_volume_3.push({ 'id': '-1', 'name': '++ Add New ++' });
                }

            });

    }


    $scope.get_volume_list = function (arg) {

        $http
            .post(volumeUrl_item, { category: arg, 'product_id': $stateParams.id, 'token': $scope.$root.token })
            .then(function (res) {
                $scope.arr_volume_id = [];
                $scope.arr_volume_id.push({ 'id': '', 'name': '' });
                if (res.data.ack == true) $scope.arr_volume_id = res.data.response;
                // else 	toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                if ($scope.user_type == 1) $scope.arr_volume_id.push({ 'id': '-1', 'name': '++ Add New ++' });
            });


    }

    $scope.onChange_vol_1 = function (arg_id, arg_name, volume_type) {

        $scope.formData_vol_1 = {};

        var id = 0;
        var volume = '';
        var category = 0;

        id = this.formData.volume_id.id;
        volume = 'Volume  ' + volume_type;
        category = volume_type;
        $scope.title_type = 'Add Volume ';//+volume_type;


        $scope.formData_vol_1.volume = volume;
        $scope.formData_vol_1.title_type = $scope.title_type;
        $scope.formData_vol_1.ref_service_type = volume_type;
        $scope.formData_vol_1.type = volume_type;
        $scope.formData_vol_1.category = 2; //category;

        if (arg_name == 'sale') {
            $scope.get_category_list();		//$scope.get_volume_list(1);
            if (id == -1) {

                if ($scope.formData.unit_id != undefined) {
                    // $scope.list_unit_category =[];
                    //  $scope.list_unit_category = [{'id': $scope.formData.unit_id.id,'name': $scope.formData.unit_id.title}];
                    //	$scope.formData_vol_1.unit_category =  $scope.list_unit_category[0];

                    angular.element('#model_vol_1').modal({ show: true });
                }
                else toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));
            }
        }
        $scope.formData_vol_1.type = volume;
        $scope.formData_vol_1.category = category;
        $scope.formData.ref_service_type = arg_id;
    }

    $scope.add_volume_standard = function (formData_vol_1) {

        $scope.formData_vol_1.token = $scope.$root.token;
        $scope.formData_vol_1.product_id = $scope.formData.product_id;
        $scope.formData_vol_1.unit_categorys = $scope.formData_vol_1.unit_category !== undefined ? $scope.formData_vol_1.unit_category.id : 0;

        if (Number($scope.formData_vol_1.quantity_from) > Number($scope.formData_vol_1.quantity_to)) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(526));
            return;
        }


        $http
            .post(add_saleUrl, formData_vol_1)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));

                    angular.element('#model_vol_1').modal('hide');
                    angular.element('#model_vol_purchase_1').modal('hide');

                    var id_new = res.data.id;
                    //  $scope.get_volume_list($scope.formData_vol_1.category);

                    $http
                        .post(volumeUrl, {
                            category: $scope.formData_vol_1.category,
                            'product_id': $stateParams.id,
                            'token': $scope.$root.token
                        }).then(function (vol_data) {
                            $scope.arr_volume_id = [];
                            $scope.arr_volume_id.push({ 'id': '', 'name': '' });

                            $scope.arr_volume_id = vol_data.data.response;

                            // if ($scope.arr_volume_id.length == 0)

                            if ($scope.user_type == 1) $scope.arr_volume_id.push({
                                'id': '-1',
                                'name': '++ Add New ++'
                            });
                            angular.forEach($scope.arr_volume_id, function (elem) {
                                if (elem.id == id_new)
                                    $scope.formData.volume_id = elem;
                                //	$scope.choices[index]['volume_id']  = $scope.arr_volume_id[index];
                            });

                        });

                }
                else toaster.pop('error', 'Error', 'Volume Already Exists');
            });
    }

    $scope.convert_show_discount_price = function (arg) {

        var price = 0;
        var final_price = 0;
        var final_price_one = 0;

        //  if (arg == 1) {
        price = this.formData.purchase_price;
        var f_id = this.formData.supplier_type.id;

        if (f_id == 1) {
            var final_price_one = (parseFloat(this.formData.discount_value)) * (parseFloat(price)) / 100;

            final_price = (parseFloat(price)) - (parseFloat(final_price_one));

        } else if (f_id == 2) {
            final_price = (parseFloat(price)) - (parseFloat(this.formData.discount_value));
        }

        var final_new = (Math.round(final_price * 100) / 100).toFixed(2);
        if (final_new != 'NaN') this.formData.discount_price = final_new;
        // }

    }

    $scope.clear_standard_supplier_data = function () {

        $scope.btnCancelUrl_get = 'getsupplier()';

        $scope.formData.sp_id = '';
        $scope.formData.volume_id = '';
        $scope.formData.supplier_type = '';
        $scope.formData.discount_value = '';
        $scope.formData.discount_price = '';
        $scope.formData.start_date_1 = '';
        $scope.formData.end_date_1 = '';
        $scope.formData.start_date = '';
        $scope.formData.end_date = '';
        $scope.formData.sale_volume_item_gl_codes = '';
        $scope.formData.sale_volume_item_gl_id = '';


        $scope.formData.purchase_price = $scope.$root.number_format_remove($scope.formData.standard_price, $scope.decimal_range);

        //$scope.formData.start_date_1 = $scope.$root.get_current_date();
        //$scope.formData.end_date_1 =  $scope.formData.end_date_1 =  $scope.formData.end_date_1 = '';

    }


    $scope.getsupplier = function () {

        // $scope.$root.breadcrumbs[3].name = 'Standard Sales Volume Discount';

        var product_id = $scope.formData.product_id;

        $scope.show_supplier_list = true;
        $scope.show_supp_form = false;

        // //$scope.!check_item_readonly = true;
        // $scope.check_item_readonly = false;
        $scope.unitTitle = $scope.formData.unit_id.title;
        var postUrl = $scope.$root.stock + "products-listing/get-product-standard-volume-list";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
            'product_id': product_id
        };


        $http
            .post(postUrl, postData)
            .then(function (res) {
                $scope.supplier_list = {};
                $scope.columns = [];

                if (res.data.ack == true) {
                    $scope.supplier_list = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
                //	else   toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            });

        // $scope.get_volume_list(1);
    };

    $scope.fn_standard_sale_Form = function () {
        $scope.check_item__volume = false;
        ////$scope.!check_item_readonly__volume = true;


        /*//$scope.!check_item_readonly = true;
         $scope.check_item_readonly = false;
         */

        $scope.clear_standard_supplier_data();

        $scope.show_supp_form = true;
        $scope.show_supplier_list = false;

        $scope.get_volume_list(1);
        $scope.get_sals_price();

        //	 angular.element("#event_date").val(''); angular.element("#event_name").val(''); angular.element("#event_code").val(''); angular.element("#event_description").val('');
    }

    $scope.show_sp_edit_form = function (id, pid) {
        /*	$scope.check_item_readonly = false;
         //$scope.!check_item_readonly = true;
         */

        $scope.check_item__volume = true;
        ////$scope.!check_item_readonly__volume = false;


        $scope.clear_standard_supplier_data();

        $scope.show_supp_form = true;
        $scope.show_supplier_list = false;

        $scope.get_volume_list(1);


        var postUrl = $scope.$root.stock + "products-listing/get-product-standard-volume-by-id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };
        $scope.formData.sp_id = id;

        $http
            .post(postUrl, postViewBankData)
            .then(function (res) {


                $scope.get_sals_price();
                $scope.formData.purchase_price = $scope.$root.number_format($scope.formData.standard_price, $scope.decimal_range);

                //$scope.formData.purchase_price  =$scope.$root.number_format(res.data.response.purchase_price,$scope.decimal_range);
                $scope.formData.discount_value = $scope.$root.number_format(res.data.response.discount_value, $scope.decimal_range);
                $scope.formData.discount_price = $scope.$root.number_format(res.data.response.discount_price, $scope.decimal_range);

                $scope.formData.volume_id = res.data.response.volume_id;

                $scope.formData.sale_volume_item_gl_codes = res.data.response.sale_volume_item_gl_codes;
                $scope.formData.sale_volume_item_gl_id = res.data.response.sale_volume_item_gl_id;

                if (res.data.response.start_date == 0) $scope.formData.start_date = null;
                else $scope.formData.start_date = $scope.$root.convert_unix_date_to_angular(res.data.response.start_date);
                if (res.data.response.end_date == 0) $scope.formData.end_date = null;
                else $scope.formData.end_date = $scope.$root.convert_unix_date_to_angular(res.data.response.end_date);


                angular.forEach($scope.list_type, function (obj) {
                    if (obj.id == res.data.response.supplier_type) {
                        $scope.formData.supplier_type = obj;
                    }
                });

                angular.forEach($scope.arr_volume_id, function (obj) {
                    if (obj.id == res.data.response.volume_id) {
                        $scope.formData.volume_id = obj;
                    }
                });
            });

        /* angular.element('#model_btn_supplier_price').modal({
         show: true
         });*/
    }

    $scope.add_standard_supplier = function (formData) {


        var updateUrl = $scope.$root.stock + "products-listing/add-product-standard-volume-list";
        // if($scope.formData.sp_id!=undefined)
        // var updateUrl = $scope.$root.stock + "products-listing/product-supplier-update";
        $scope.formData.token = $scope.$root.token;

        // console.log(formData);

        $scope.formData.product_id = $scope.formData.product_id;
        $scope.formData.volume_ids = $scope.formData.volume_id !== undefined ? $scope.formData.volume_id.id : 0;
        $scope.formData.supplier_types = $scope.formData.supplier_type !== undefined ? $scope.formData.supplier_type.id : 0;


        if (formData.sale_volume_item_gl_codes !== undefined && formData.sale_volume_item_gl_codes != 0) {


            var sale_volume_item_gl_code_full = formData.sale_volume_item_gl_codes;

            sale_volume_item_gl_code_full = sale_volume_item_gl_code_full.split(' - ');
            formData.sale_volume_item_gl_code = sale_volume_item_gl_code_full[0];
        }


        if ($scope.formData.volume_1s > 0) {
            if ($scope.formData.discount_price_1 <= 0 || $scope.formData.discount_price_1 == undefined) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(530));
                return false;
            }

            if ($scope.formData.start_date_1 <= undefined || $scope.formData.end_date_1 == undefined) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(531));
                return false;
            }
        }

        if ($scope.formData.absolute_minimum_price != undefined) {
            // console.log(   Number( $scope.formData.discount_price) > Number($scope.formData.absolute_minimum_price) );
            if (Number($scope.formData.discount_price) < Number($scope.formData.absolute_minimum_price)) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(237, ['Discount Price ', 'Min. Absolute Price']));
                return false;
            }
        }
        else {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(527, ['Min. Absolute Price']));
            return false;
        }


        //console.log($scope.formData.sale_volume_item_gl_code);

        /*
         $scope.formData.start_date1 = angular.element("#st_vl_sdate").val().split("/")[0] + "-" + angular.element("#st_vl_sdate").val().split("/")[1] + "-" + angular.element("#st_vl_sdate").val().split("/")[2];

         $scope.formData.end_date1 = angular.element("#st_vl_edate").val().split("/")[0] + "-" + angular.element("#st_vl_edate").val().split("/")[1] + "-" + angular.element("#st_vl_edate").val().split("/")[2];
         */

        //console.log($scope.formData);return false;
        $http
            .post(updateUrl, $scope.formData)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Add', 'Record' + res.data.msg);
                    $scope.getsupplier();

                    // if (res.data.tab_change == 'tab_supplier') {
                    // $scope.show_supplier_pop = false;
                    // angular.element('#model_btn_supplier').modal('hide');
                    // }
                }
                else toaster.pop('error', 'Error', res.data.error);
            });
    }

    $scope.delete_sp = function (id, index, arr_data) {

        var delUrl = $scope.$root.stock + "products-listing/delete-product-standard-volume-list";
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
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    $scope.formData.pr_id = "";
    $scope.formData.sp_id = "";

    $scope.resetSPID = function () {
        $scope.formData.sp_id = "";
    };

    $scope.resetPRID = function () {
        $scope.formData.pr_id = "";
    };

    $scope.show_price_one_pop = function () {
        var price = 0;
        var final_price = 0;
        var final_price_one = 0;

        price = $scope.formData.purchase_price_11;

        var f_id = this.formData.supplier_type_11.id;

        if (f_id == 1) {
            final_price_one = (parseFloat($scope.formData.discount_value_11)) * (parseFloat(price)) / 100;

            final_price = (parseFloat(price)) - (parseFloat(final_price_one));

        } else if (f_id == 2) {
            final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value_11));
        }

        //  console.log( final_price);
        $scope.formData.discount_price_11 = final_price;
    }

    $scope.setSymbol_pop = function (div_id) {
        //var id = this.formData.div_id.id;
        // var id =document.getElementById("type_"+div_id).value;
        var id = angular.element('#type_' + div_id).val();
        // console.log(id); console.log("#type_"+div_id); console.log(div_id);

        if (id == 0)
            //$scope.show_symbol = true;
            angular.element('#date_msg_' + div_id).show();
        else
            //$scope.show_symbol = false;
            angular.element('#date_msg_' + div_id).hide();
    }

    $scope.supplier_pop = function (id) {

        angular.element('#model_btn_supplier').modal({
            show: true
        });


        $scope.get_volume_list(1);
        $scope.formData.sp_id = id;
        $scope.sp_id = id;
        var postUrl = $scope.$root.stock + "products-listing/product-supplier-by-id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };
        $http
            .post(postUrl, postViewBankData)
            .then(function (res) {
                $scope.formData.volume_1 = res.data.response.volume_1;
                $scope.formData.volume_2 = res.data.response.volume_2;
                $scope.formData.volume_3 = res.data.response.volume_3;

                $scope.formData.purchase_price_11 = res.data.response.purchase_price;
                $scope.formData.discount_value_11 = parseFloat(res.data.response.discount_value);
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

    // ------------- 	 Purchase  	 ----------------------------------------


    $scope.show_purchase_one = function (arg) {

        var price = 0;
        var final_price = 0;
        var final_price_one = 0;

        if (arg == 1) {
            price = $scope.formData.p_price_1;
            var f_id = this.formData.purchase_type_1.id;
            if (f_id == 1) {
                final_price_one = (parseFloat($scope.formData.p_discount_value_1)) * (parseFloat(price)) / 100;
                final_price = (parseFloat(price)) - (parseFloat(final_price_one))

            } else if (f_id == 2) {
                final_price = (parseFloat(price)) - (parseFloat($scope.formData.p_discount_value_1))
            }

            var final_new = (Math.round(final_price * 100) / 100).toFixed(2);
            if (final_new != 'NaN')
                $scope.formData.discount_p_1 = final_new;
        }

        if (arg == 2) {
            price = $scope.formData.p_price_2;
            var f_id = this.formData.purchase_type_2.id;
            if (f_id == 1) {
                final_price_one = (parseFloat($scope.formData.p_discount_value_2)) * (parseFloat(price)) / 100;
                final_price = (parseFloat(price)) - (parseFloat(final_price_one))

            } else if (f_id == 2) {
                final_price = (parseFloat(price)) - (parseFloat($scope.formData.p_discount_value_2))
            }

            var final_new = (Math.round(final_price * 100) / 100).toFixed(2);
            if (final_new != 'NaN')
                $scope.formData.discount_p_2 = final_new;
        }

        if (arg == 3) {
            price = $scope.formData.p_price_3;
            var f_id = this.formData.purchase_type_3.id;

            if (f_id == 1) {
                final_price_one = (parseFloat($scope.formData.p_discount_value_3)) * (parseFloat(price)) / 100;
                final_price = (parseFloat(price)) - (parseFloat(final_price_one))

            } else if (f_id == 2) {
                final_price = (parseFloat(price)) - (parseFloat($scope.formData.p_discount_value_3))
            }

            var final_new = (Math.round(final_price * 100) / 100).toFixed(2);
            if (final_new != 'NaN')
                $scope.formData.discount_p_3 = final_new;


        }

    }

    $scope.getpurchase = function () {


        // $scope.$root.breadcrumbs[3].name = 'Purchase Volume Discount';


        var product_id = $scope.formData.product_id;


        $scope.show_purchase_list = true;
        $scope.show_purchase_form = false;

        // //$scope.!check_item_readonly = true;
        /*	$scope.check_item_readonly = false;
         //$scope.!check_item_readonly = true;
         */

        $scope.columns_p = [];
        var postData = {};

        var vm = this;
        var postUrl = $scope.$root.stock + "product-tab-values/purchase_list";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
            'product_id': product_id
        };

        $scope.showLoader = true;
        $http
            .post(postUrl, postData)
            .then(function (res) {
                $scope.purchase_list = {};
                $scope.columns_p = [];
                if (res.data.response != null) {
                    $scope.purchase_list = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_p.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
            });
        $scope.showLoader = false;
        $scope.get_volume_list(2);
    };

    $scope.fn_purchase_Form = function () {

        $scope.show_purchase_list = false;
        $scope.show_purchase_form = true;

        $scope.get_volume_list(2);
        $scope.p_price_1 = $scope.formData.unit_cost;
        $scope.p_price_2 = $scope.formData.unit_cost;
        $scope.p_price_3 = $scope.formData.unit_cost;

        angular.element("#pr_id").val('');
        $scope.pr_id = '';

        $scope.formData.volume_1_purchase = '';
        $scope.formData.purchase_type_1 = '';
        $scope.formData.discount_value_1 = '';
        $scope.formData.discount_p_1 = 0;

        $scope.formData.volume_2_purchase = '';
        $scope.formData.purchase_type_2 = '';
        $scope.formData.discount_value_2 = '';
        $scope.formData.discount_p_2 = 0;

        $scope.formData.volume_3_purchase = '';
        $scope.formData.purchase_type_3 = '';
        $scope.formData.discount_value_3 = '';
        $scope.formData.discount_p_3 = 0;

        $scope.formData.p_start_date = '';
        $scope.formData.p_end_date = '';
    }

    $scope.add_purchase = function (formData) {
        $scope.rec = {};

        $scope.rec.product_id = $scope.formData.product_id;//$scope.$root.product_id;
        $scope.rec.token = $scope.$root.token;
        $scope.rec.tab_id_2 = 5;
        $scope.rec.pr_id = $scope.pr_id;

        $scope.rec.volume_1s = $scope.formData.volume_id !== undefined ? $scope.formData.volume_id.id : 0;
        $scope.rec.purchase_types = $scope.formData.purchase_type11 !== undefined ? $scope.formData.purchase_type11.id : 0;
        $scope.rec.purchase_price_11 = $scope.formData.purchase_price_11;
        $scope.rec.discount_value_11 = $scope.formData.discount_value_11;
        $scope.rec.discount_price_11 = $scope.formData.discount_price_11;


        $scope.rec.volume_1_purchases = $scope.formData.volume_1_purchase !== undefined ? $scope.formData.volume_1_purchase.id : 0;
        $scope.rec.purchase_type_1s = $scope.formData.purchase_type_1 !== undefined ? $scope.formData.purchase_type_1.id : 0;
        $scope.rec.p_price_1 = $scope.formData.p_price_1;
        $scope.rec.discount_p_1 = $scope.formData.discount_p_1;
        $scope.rec.p_discount_value_1 = $scope.formData.p_discount_value_1;


        $scope.rec.volume_2_purchases = $scope.formData.volume_2_purchase !== undefined ? $scope.formData.volume_2_purchase.id : 0;
        $scope.rec.purchase_type_2s = $scope.formData.purchase_type_2 !== undefined ? $scope.formData.purchase_type_2.id : 0;
        $scope.rec.p_price_2 = $scope.formData.p_price_2;
        $scope.rec.discount_p_2 = $scope.formData.discount_p_2;
        $scope.rec.p_discount_value_2 = $scope.formData.p_discount_value_2;

        $scope.rec.volume_3_purchases = $scope.formData.volume_3_purchase !== undefined ? $scope.formData.volume_3_purchase.id : 0;
        $scope.rec.purchase_type_3s = $scope.formData.purchase_type_3 !== undefined ? $scope.formData.purchase_type_3.id : 0;
        $scope.rec.p_price_3 = $scope.formData.p_price_3;
        $scope.rec.discount_p_3 = $scope.formData.discount_p_3;
        $scope.rec.p_discount_value_3 = $scope.formData.p_discount_value_3;

        $scope.rec.volume_1_purchase = $scope.formData.volume_1_purchase;
        $scope.rec.volume_2_purchase = $scope.formData.volume_2_purchase;
        $scope.rec.volume_3_purchase = $scope.formData.volume_3_purchase;

        $scope.rec.p_start_date = $scope.formData.p_start_date;
        $scope.rec.p_end_date = $scope.formData.p_end_date;

        if ($scope.formData.pr_id == "") {

            if (($scope.formData.volume_2_purchases == '-1') || ($scope.formData.volume_3_purchases == '-1')) {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Volumes']));
                return;
            }
        }

        var errorFlag = false;
        if ($scope.formData.pr_id == "") {
            angular.element('#dpval ul').hide();
            if ($scope.formData.p_discount_value_1 != "") {
                if ($scope.formData.discount_p_1 <= 0) {
                    angular.element('#parsley-id-dpp1530').show();
                    errorFlag = true;
                } else {
                    angular.element('#parsley-id-dpp1530').hide();
                }
            }

            if ($scope.formData.volume_2_purchase != "" || $scope.formData.purchase_type_2 != "" || ($scope.formData.p_discount_value_2 != undefined && $scope.formData.p_discount_value_2 != "")) {
                if ($scope.formData.discount_p_2 <= 0) {
                    angular.element('#parsley-id-dpp2530').show();
                    errorFlag = true;
                } else {
                    angular.element('#parsley-id-dpp2530').hide();
                }
            }

            if ($scope.formData.volume_3_purchase != "" || $scope.formData.purchase_type_3 != "" || ($scope.formData.p_discount_value_3 != undefined && $scope.formData.p_discount_value_3 != "")) {
                if ($scope.formData.discount_p_3 <= 0) {
                    angular.element('#parsley-id-dpp3530').show();
                    errorFlag = true;
                } else {
                    angular.element('#parsley-id-dpp3530').hide();
                }
            }
        }
        else {
            if ($scope.formData.discount_value_11 != "") {
                if ($scope.formData.discount_price_11 <= 0) {
                    angular.element('#dpval ul').hide();
                    angular.element('#parsley-id-dpppop1530').show();
                    errorFlag = true;
                } else {
                    angular.element('#parsley-id-dpppop1530').hide();
                }
            }
        }
        if (errorFlag) {
            return;
        }

        $http
            .post(updateUrl, $scope.rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', res.data.info, res.data.msg);
                    if (res.data.tab_change == 'tab_purchaser') {

                        //	 $scope.show_purchase_pop= false;
                        angular.element('#model_btn_purchase').modal('hide');
                    }
                    $scope.getpurchase();
                } else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(102));
                }
            });
    }

    $scope.show_purchase_edit_form = function (id) {

        $scope.show_purchase_list = true;
        $scope.show_purchase_form = true;

        var postUrl = $scope.$root.stock + "product-tab-values/purchase_by_id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };

        $scope.formData.pr_id = id;
        $scope.pr_id = id;

        $http
            .post(postUrl, postViewBankData)
            .then(function (res) {
                $scope.formData.discount_value = parseFloat(res.data.response.discount_value);

                if (res.data.response.p_start_date == 0) {
                    $scope.formData.p_start_date = null;
                } else {
                    $scope.formData.p_start_date = $scope.$root.convert_unix_date_to_angular(res.data.response.p_start_date);
                }

                if (res.data.response.p_end_date == 0) {
                    $scope.formData.p_end_date = null;
                } else {
                    $scope.formData.p_end_date = $scope.$root.convert_unix_date_to_angular(res.data.response.p_end_date);
                }

                angular.forEach($scope.list_type, function (obj) {
                    if (obj.id == res.data.response.purchase_type) {
                        $scope.formData.purchase_type = obj;
                    }
                });

                angular.forEach($scope.arr_volume_purchase_1, function (obj) {
                    if (obj.id == res.data.response.volume_1) {
                        $scope.formData.volume_1 = obj;
                    }
                });

                angular.forEach($scope.arr_volume_purchase_2, function (obj) {
                    if (obj.id == res.data.response.volume_2) {
                        $scope.formData.volume_2 = obj;
                    }
                });

                angular.forEach($scope.arr_volume_purchase_3, function (obj) {
                    if (obj.id == res.data.response.volume_3) {
                        $scope.formData.volume_3 = obj;
                    }
                });
            });
    }

    $scope.delete_purchase = function (id, index, arr_data) {

        var delUrl = $scope.$root.stock + "product-tab-values/purchase_delete_id";
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
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.show_price_one_pop_purchase = function () {
        var price = 0;
        var final_price = 0;
        var final_price_one = 0;

        price = $scope.formData.purchase_price_11;
        var f_id = this.formData.purchase_type11.id;

        if (f_id == 1) {
            final_price_one = (parseFloat($scope.formData.discount_value_11)) * (parseFloat(price)) / 100;
            final_price = (parseFloat(price)) - (parseFloat(final_price_one));

        } else if (f_id == 2) {
            final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value_11));
        }
        $scope.formData.discount_price_11 = final_price;
    }

    $scope.purchase_pop = function (id) {

        angular.element('#model_btn_purchase').modal({
            show: true
        });
        $scope.get_volume_list(2);

        $scope.formData.pr_id = id;
        $scope.pr_id = id;
        var postUrl = $scope.$root.stock + "product-tab-values/purchase_by_id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };


        $http
            .post(postUrl, postViewBankData)
            .then(function (res) {
                $scope.formData.discount_value = parseFloat(res.data.response.discount_value);
                $scope.formData.volume_1 = res.data.response.volume_1;
                $scope.formData.volume_2 = res.data.response.volume_2;
                $scope.formData.volume_3 = res.data.response.volume_3;

                $scope.formData.purchase_price_11 = res.data.response.purchase_price;
                $scope.formData.discount_value_11 = parseFloat(res.data.response.discount_value);
                $scope.formData.discount_price_11 = res.data.response.discount_price;

                angular.forEach($scope.list_type, function (obj) {
                    if (obj.id == res.data.response.purchase_type) {
                        $scope.formData.purchase_type11 = obj;
                    }
                });

                angular.forEach($scope.arr_volume_purchase_1, function (obj) {
                    if (obj.id == res.data.response.volume_id) {
                        $scope.formData.volume_id = obj;
                    }
                });

                angular.forEach($scope.arr_volume_purchase_2, function (obj) {
                    if (obj.id == res.data.response.volume_id) {
                        $scope.formData.volume_id = obj;
                    }
                });

                angular.forEach($scope.arr_volume_purchase_3, function (obj) {
                    if (obj.id == res.data.response.volume_id) {
                        $scope.formData.volume_id = obj;
                    }
                });
            });
    }

    //ng-click="reload_popup(1,'model_btn_purchase')" //modaladdevent
    $scope.reload_popup = function (div_id, div_model) {

        angular.element('#' + div_model).modal('hide');
        //  $scope.show_p_unit_pop = false;


        if (div_id == 1) {
            $scope.formData.purchase_measure = $scope.purchase_unit_measures[0];

        } else if (div_id == 2) {
            $scope.formData.unit_id = $scope.unit_measures[0];
        } else if (div_id == 3) {
            $scope.formData.brand_id = $rootScope.brand_prodcut_arr[0];

        } else if (div_id == 4) {
            $scope.formData.category_id = $rootScope.cat_prodcut_arr[0];
        } else if (div_id == 5) {

        } else if (div_id == 6) {

        } else if (div_id == 7) {
            // if($scope.arr_volume_1.length==1)   $scope.arr_volume_1.push({'id': '', 'name': ''});
            $scope.formData.volume_1 = $scope.arr_volume_1[0];
        } else if (div_id == 8) {
            // if($scope.arr_volume_2.length==1) $scope.arr_volume_2.push({'id': '', 'name': ''});
            $scope.formData.volume_2 = $scope.arr_volume_2[0];
        } else if (div_id == 9) {
            // if($scope.arr_volume_3.length==1) $scope.arr_volume_3.push({'id': '', 'name': ''});
            $scope.formData.volume_3 = $scope.arr_volume_3[0];

        } else if (div_id == 10) {
            // if($scope.arr_volume_purchase_1.length==1) $scope.arr_volume_purchase_1.push({'id': '', 'name': ''});
            $scope.formData.volume_1_purchase = $scope.arr_volume_purchase_1[0];
        } else if (div_id == 11) {
            //if($scope.arr_volume_purchase_2.length==1)$scope.arr_volume_purchase_2.push({'id': '', 'name': ''});
            $scope.formData.volume_2_purchase = $scope.arr_volume_purchase_2[0];

        } else if (div_id == 12) {
            //if($scope.arr_volume_purchase_3.length==1)$scope.arr_volume_purchase_3.push({'id': '', 'name': ''});
            $scope.formData.volume_3_purchase = $scope.arr_volume_purchase_3[0];

        } else if (div_id == 13) {
            $scope.formData.prd_country_origin = $rootScope.country_type_arr[0];
        }

    }

    //--------------------   Unit  Setup --------------------

    var get_rec_url = $scope.$root.stock + "unit-measure/get-unit-record-popup";


    $scope.check_value_volume = function (from, to) {

        if (from > to) {
            angular.element('.pic_block').attr("disabled", true);
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(237, ['From Quantity', 'To Quantity']));
        }
        else angular.element('.pic_block').attr("disabled", false);
    }

    $scope.categories_selected = [];

    /* $scope.check_duplicate = function (drp, type) {
        console.log(drp);

        var counter = 0;
        var vol_counter = 0;
        //if(id>0)  counter=1;

        angular.forEach($scope.unit_measures_category_record, function (catIndex, catObj) {

            if (catObj.cat_id != undefined && catObj.cat_id != 0) {
                if (type == 1) {
                    if (catObj.cat_id == drp) {
                        counter++;
                    }
                }
            }

            if (catObj.quantity != undefined && catObj.quantity != 0) {
                if (type == 2) {
                    if ((catObj.quantity == drp.quantity))   ////&& (catObj.quantity == drp.ref_quantity)
                    {
                        vol_counter++;
                    }
                }
            }
        });

        angular.element('.cat_duplicate').attr("disabled", false);
        angular.element('.cat_duplicate_quant').attr("disabled", false);

        if (counter > 1) {
            angular.element('.cat_duplicate').attr("disabled", true);
            toaster.pop('error', 'Error', 'Category already Exists');
            return;
        }
        else {	//if ($.inArray($scope.categories_selected, drp)==-1)

            $scope.categories_selected.push(drp);

        }
        //console.log(vol_counter);
        if (vol_counter > 1) {
            angular.element('.cat_duplicate_quant').attr("disabled", true);
            toaster.pop('error', 'Error', 'Quantity already Exists');
            return;
        }
        if (undefined != drp.ref_unit_id)
            $scope.check_duplicate_ref(drp);
    }
 */
    $scope.array_submit_unit = {};
    $scope.ref_unit_measures = [];
    $scope.unit_measures_category_record.data = [];

    $scope.check_duplicate_ref = function (drp, type) {
        var ref_counter = 0;
        var ref_cat_counter = 0;
        var target_cat_id = 0;

        angular.element('.block_ref').attr("disabled", false);

        if ($scope.array_submit_unit.ref_unit_id === undefined) {
            angular.element('.block_ref').attr("disabled", true);
            // toaster.pop('error', 'Error', 'Ref U.O.M is not Select ');
            return;
        }

        if ($scope.array_submit_unit.ref_unit_id !== undefined) {
            if (drp.cat_id.id == drp.ref_unit_id.id) {
                angular.element('.block_ref').attr("disabled", true);
                // toaster.pop('error', 'Error', 'Ref U.O.M Can not be Same');
                return;
            }
        }
        /* if ($scope.unit_measures_category_record.length > 1) {
            angular.forEach($scope.unit_measures_category_record, function (outer) {
                if (outer.cat_id.id == $scope.array_submit_unit.cat_id.id && outer.ref_unit_id.id == $scope.array_submit_unit.ref_unit_id.id) {
                    $scope.array_submit_unit.id = outer.rec_id;
                    if (outer.quantity == $scope.array_submit_unit.quantity) {
                        angular.element('.block_ref').attr("disabled", true);
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(107));
                        return;
                    }
                }
            });
        }
 */
        /* angular.forEach($scope.unit_measures_category_record, function (catObj) {
            if (catObj.cat_id.id == $scope.array_submit_unit.ref_unit_id.id) {
                $scope.array_submit_unit.ref_quantity =
                    (parseFloat(catObj.ref_quantity) * parseFloat($scope.array_submit_unit.quantity)).toFixed(2);
                return;
            }
        }); */
    }
    function predicateBy(prop) {
        return function (a, b) {
            if (parseFloat(a[prop]) > parseFloat(b[prop])) {
                return 1;
            } else if (parseFloat(a[prop]) < parseFloat(b[prop])) {
                return -1;
            }
            return 0;
        }
    }

    $scope.length_unit_arr = [
        { 'id': '1', 'title': 'Height', 'name': 'height', selectable: false },
        { 'id': '2', 'title': 'Width', 'name': 'width', selectable: false },
        { 'id': '3', 'title': 'Depth', 'name': 'depth', selectable: false },
        { 'id': '4', 'title': 'Length', 'name': 'length', selectable: false },
    ];
    $scope.get_setup_unit_data = function (id) {
        if (id == undefined)
            return;
        $scope.edit_readonly = false;

        $scope.array_submit_unit = {};
        $scope.ref_unit_measures = [];

        var get_rec_url = $scope.$root.stock + "unit-measure/get-unit-record-popup";

        $http
            .post(get_rec_url, {
                'token': $scope.$root.token,
                'unit_id': id,
                'product_id': $scope.formData.product_id,
                'product_code': $scope.formData.product_code
            })
            .then(function (res) {
                $scope.default_value_readonly = false;
                if (res.data.ack == true) {

                    if (res.data.response.length) {
                        $scope.unit_measures_category_record.data = [];
                        $scope.refUOMList = [];
                        angular.forEach(res.data.response, function (obj_rec, index) {
                            if (index == 0)
                                obj_rec.ref_quantity = 1;

                            if (obj_rec.rem_id > 0) {
                                obj_rec.Dimensions = {};
                                obj_rec.UOM = $rootScope.uni_prooduct_arr;
                                obj_rec.refUOM = $scope.refUOMList;
                                obj_rec.DimensionType = (obj_rec.DimensionType != '0') ? obj_rec.DimensionType : '';
                                obj_rec.quantity = parseFloat(obj_rec.quantity);
                                obj_rec.barcode = obj_rec.barcode;

                                obj_rec.Dimensions.d1_type = (obj_rec.Dimension1 != '0') ? obj_rec.Dimension1 : '';
                                obj_rec.Dimensions.d1_val = parseFloat(parseFloat(obj_rec.Dimension1_value).toFixed(2));
                                obj_rec.Dimensions.d1_unit = obj_rec.Dimension1_unit;

                                obj_rec.Dimensions.d2_type = (obj_rec.Dimension2 != '0') ? obj_rec.Dimension2 : '';
                                obj_rec.Dimensions.d2_val = parseFloat(parseFloat(obj_rec.Dimension2_value).toFixed(2));
                                obj_rec.Dimensions.d2_unit = obj_rec.Dimension2_unit;

                                obj_rec.Dimensions.d3_type = (obj_rec.Dimension3 != '0') ? obj_rec.Dimension3 : '';
                                obj_rec.Dimensions.d3_val = parseFloat(parseFloat(obj_rec.Dimension3_value).toFixed(2));
                                obj_rec.Dimensions.d3_unit = obj_rec.Dimension3_unit;

                                obj_rec.netweight = parseFloat(parseFloat(obj_rec.netweight).toFixed(2));
                                obj_rec.packagingWeight = parseFloat(parseFloat(obj_rec.packagingWeight).toFixed(2));

                                angular.forEach($scope.status_data, function (obj) {
                                    if (obj.id == res.data.response.status)
                                        $scope.formData.status = obj;
                                });

                                angular.forEach($rootScope.uni_prooduct_arr, function (obj) {
                                    if (obj.id == obj_rec.cat_id) {
                                        obj_rec.cat_id = obj;
                                        $scope.ref_unit_measures.push({
                                            'id': obj.id,
                                            'ref_quantity': obj_rec.ref_quantity,
                                            'title': obj.title
                                        });

                                        $scope.refUOMList.push(obj);
                                    }

                                    if (obj.id == obj_rec.ref_unit_id)
                                        obj_rec.ref_unit_id = obj;
                                });
                                obj_rec.isCustomCalculated = Number(obj_rec.customDimension) > 0 ? true : false;
                                $scope.unit_measures_category_record.data.push(obj_rec);
                            }
                        });
                    }
                    $scope.order_category_list($scope.formData.unit_id.title, 1);
                }
                else {

                    $scope.refUOMList = [];
                    var item = $rootScope.uni_prooduct_arr.filter(function (obj) {
                        return obj.id === $scope.formData.unit_id.id;
                    })[0];

                    $scope.refUOMList.push(item);
                    if ($scope.unit_measures_category_record.data.length == 0)
                        $scope.unit_measures_category_record.data.push({
                            'UOM': $rootScope.uni_prooduct_arr,
                            'cat_id': $scope.formData.unit_id,
                            'quantity': 1,
                            'refUOM': $scope.refUOMList,
                            'ref_unit_id': $scope.formData.unit_id,
                            'ref_quantity': 1,
                            'barcode': '',
                            'DimensionType': '',
                            'isCustomCalculated': false,
                            'Dimensions': { 'd1_type': '', 'd1_val': 0, 'd1_unit': '', 'd2_type': '', 'd2_val': 0, 'd2_unit': '', 'd3_type': '', 'd3_val': 0, 'd3_unit': '' },
                            'volume': 0,
                            'volume_unit': '0',
                            'net_weight_unit': '0',
                            'netweight': 0,
                            'packagingWeight': 0,
                            'gross_weight': 0,
                            'isDeleteAllowed': false
                        });
                }
            });
    }

    $scope.delete_setup_single = function (item, index, arr_data) {
        var delUrl = $scope.$root.stock + "unit-measure/delete-setup-single";
        var get_rec_url = $scope.$root.stock + "unit-measure/get-unit-record-popup";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: item.rec_id, 'unit_id': item.cat_id, 'token': $scope.$root.token })
                .then(function (res) {

                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $http
                            .post(get_rec_url, {
                                'token': $scope.$root.token,
                                'unit_id': $scope.formData.unit_id.id,
                                'product_id': $scope.formData.product_id,
                                'product_code': $scope.formData.product_code
                            })
                            .then(function (res) {
                                if (res.data.ack == true) {

                                    toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

                                    arr_data.splice(index, 1);
                                    //  $scope.getsubexpenses_final_list($scope.formData.expense_id);

                                    return;
                                    $scope.unit_measures_category_first = [];
                                    $scope.unit_measures_category_record = [];
                                    $scope.prodData = {};
                                    $scope.ref_unit_measures = [];
                                    $scope.categories_selected = [];
                                    $scope.unit_measures_category_record = res.data.response;

                                    angular.forEach(res.data.response, function (obj_rec) {
                                        if (obj_rec.rem_id > 0) {
                                            obj_rec.id = obj_rec.id;
                                            obj_rec.cat_id = obj_rec.cat_id;
                                            obj_rec.check_id = obj_rec.check_id;
                                            obj_rec.quantity = obj_rec.quantity;
                                            obj_rec.title = obj_rec.title;

                                            angular.forEach($rootScope.uni_prooduct_arr, function (obj) {
                                                if (obj.id == obj_rec.cat_id) {
                                                    obj_rec.cat_id = obj;
                                                    $scope.categories_selected.push(obj);
                                                }

                                                if (obj.id == obj_rec.ref_unit_id) obj_rec.ref_unit_id = obj;
                                            });
                                        }
                                    });

                                    angular.forEach(res.data.response, function (obj_rec) {
                                        if (obj_rec.rem_id == 0) {
                                            obj_rec.id = obj_rec.id;
                                            obj_rec.title = obj_rec.title;
                                        }
                                    });
                                }
                                //  else 	toaster.pop('error', 'Error', "No Unit of measure found!");
                            });
                    } else toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(108));
                });
        }, function (reason) {
            // console.log('Modal promise rejected. Reason: ', reason);
        });
    };

    $scope.onChangUnittype = function (ids) {
        // console.log(ids);

        if ($scope.formData.unit_id != undefined) {

            var id = this.formData.unit_id.id;
            var name = this.formData.unit_id.title;
            var name = this.formData.unit_id.title;

            $scope.list_category = [];
            $scope.list_category.push({ 'id': '', 'name': name });

            $scope.formData.reoder_point_unit_id = $scope.list_category[0];//name;//$scope.list_category[index];
            $scope.formData.min_order_unit_id = $scope.list_category[0];// name;//$scope.list_category[index];
            $scope.formData.max_order_unit_id = $scope.list_category[0];//name;//$scope.list_category[index];

            if (!$scope.unit_measures_category_record.data.length) {

            }

            if (id == -1) {
                angular.element('#model_unit').modal({ show: true });
                $scope.formData4.title = '';
            }
            else if (ids == 1) {

                $scope.formData4.unit_id = id;
                $scope.formData4.unit_name = name;
                $scope.get_setup_unit_data(id);
                angular.element('#add_unit_category').modal({ show: true });
            }
        }
        else toaster.pop('error', 'Error', "Select Primary U.O.M !");
    }

    // ############ purchase-cost-detail start ##############

    $scope.select_prod_cost_value = function () {

        $scope.showLoader = true;
        $scope.enable_purchase_cost_form = 0;
        $scope.get_purchase_cost_detail();
    }

    $scope.enable_purchase_cost_form = 0;

    $scope.open_purchase_cost_form = function () {
        $scope.enable_purchase_cost_form = 1;
    }

    $scope.close_purchase_cost_form = function () {
        $scope.enable_purchase_cost_form = 0;
    }

    $scope.add_purchase_cost_detail = function () {

        if ($scope.array_purchase_cost.title == undefined || $scope.array_purchase_cost.cost == undefined || $scope.array_purchase_cost.landing_cost_gl == undefined || $scope.array_purchase_cost.landing_cost_currency == undefined) {
            return false;
        }

        $scope.array_purchase_cost.landing_cost_currencys = $scope.array_purchase_cost.landing_cost_currency !== undefined ? $scope.array_purchase_cost.landing_cost_currency.id : 0;
        $scope.array_purchase_cost.landing_cost_unit_of_measures = $scope.array_purchase_cost.landing_cost_unit_of_measure !== undefined ? $scope.array_purchase_cost.landing_cost_unit_of_measure.id : 0;

        var add_purchase_cost_rec_url = $scope.$root.stock + "products-listing/add-purchase-cost-detail";
        var rec = {};
        rec = $scope.array_purchase_cost;

        var edit_id = $scope.array_purchase_cost.id;

        if ($scope.priceFormData.sale_id == "" || $scope.priceFormData.sale_id == undefined) {
            // angular.element('#add_purchase_cost_detail').modal('hide');
            toaster.pop('error', "Error", "Select Supplier First");
            angular.element('#add_purchase_cost_detail').modal('hide');
            return false;
        }

        if (edit_id > 0) {
            var add_purchase_cost_rec_url = $scope.$root.stock + "products-listing/edit-purchase-cost-detail";
        }

        rec.token = $scope.$root.token;
        rec.product_id = $scope.formData.product_id;
        rec.supp_id = $scope.priceFormData.sale_id;

        $http
            .post(add_purchase_cost_rec_url, rec)
            .then(function (res) {

                if (res.data.ack == true) {
                    toaster.pop('success', res.data.msg, 'Record  ' + res.data.msg);
                    $scope.get_purchase_cost_detail();
                    $scope.enable_purchase_cost_form = 0;
                }
                else toaster.pop('error', res.data.msg, res.data.error);
            });
    }

    $scope.edit_purchase_cost_detail = function (rec_id) {

        var get_purchase_cost_byid_url = $scope.$root.stock + "products-listing/get-purchase-cost-detail-byid";
        var rec = {};
        //console.log(rec_id);
        $scope.enable_purchase_cost_form = 1;

        rec.token = $scope.$root.token;
        rec.product_id = $scope.formData.product_id;
        rec.id = rec_id;

        $http
            .post(get_purchase_cost_byid_url, rec)
            .then(function (res) {
                // console.log(res.data.response);

                if (res.data.ack == true) {

                    angular.forEach(res.data.response, function (purchase_detail_rec) {

                        $scope.array_purchase_cost.id = purchase_detail_rec.id;
                        $scope.array_purchase_cost.title = purchase_detail_rec.title;
                        $scope.array_purchase_cost.cost = purchase_detail_rec.cost;
                        $scope.array_purchase_cost.landing_cost_gl_code = purchase_detail_rec.account_code + " - " + purchase_detail_rec.name;
                        $scope.array_purchase_cost.landing_cost_gl = purchase_detail_rec.gl;
                        $scope.array_purchase_cost.landing_conversion_cost = purchase_detail_rec.landing_conversion_cost;

                        if (purchase_detail_rec.landing_cost_currency > 0) {

                            angular.forEach($rootScope.arr_currency, function (obj) {
                                if (obj.id == purchase_detail_rec.landing_cost_currency) {
                                    $scope.array_purchase_cost.landing_cost_currency = obj;
                                }
                            });

                        } else {
                            angular.forEach($rootScope.arr_currency, function (obj) {
                                if (obj.id == $scope.$root.defaultCurrency) {
                                    $scope.array_purchase_cost.landing_cost_currency = obj;
                                }
                            });
                        }

                        if (purchase_detail_rec.landing_cost_unit_of_measure > 0) {

                            angular.forEach($scope.arr_unit_of_measure, function (obj) {
                                if (obj.id == purchase_detail_rec.landing_cost_unit_of_measure) {
                                    $scope.array_purchase_cost.landing_cost_unit_of_measure = obj;
                                }
                            });
                        } else {
                            angular.forEach($scope.arr_unit_of_measure, function (obj) {
                                if (obj.unit_id == $scope.formData.unit_id.id)
                                    $scope.array_purchase_cost.landing_cost_unit_of_measure = obj;
                            });
                        }
                    });
                }
                else toaster.pop('error', res.data.msg, res.data.error);
            });
    }

    $scope.delete_purchase_cost_detail = function (rec_id) {

        var del_purchase_cost_url = $scope.$root.stock + "products-listing/del-purchase-cost-detail";
        var rec = {};
        //console.log(rec_id);

        rec.token = $scope.$root.token;
        rec.id = rec_id;

        $http
            .post(del_purchase_cost_url, rec)
            .then(function (res) {
                // console.log(res.data.response);

                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                    $scope.get_purchase_cost_detail();
                }
                else toaster.pop('error', res.data.msg, res.data.error);
            });
    }

    $scope.get_purchase_cost_detail = function () {
        $scope.edit_readonly = false;
        $scope.total_landing_cost = "";

        $scope.array_purchase_cost = {};
        $scope.showLoader = false;

        if ($scope.priceFormData.sale_id == "" || $scope.priceFormData.sale_id == undefined) {
            toaster.pop('error', "Error", "Select Supplier First");
            return false;
        }

        var get_purchase_cost_rec_url = $scope.$root.stock + "products-listing/get-purchase-cost-detail-list";
        $scope.purchase_cost_detail_record = [];

        $http
            .post(get_purchase_cost_rec_url, {
                'token': $scope.$root.token,
                'product_id': $scope.formData.product_id,
                'supp_id': $scope.priceFormData.sale_id
            })
            .then(function (res) {
                $scope.default_value_readonly = false;

                if (res.data.ack == true) {
                    $scope.total_landing_cost = res.data.sum;

                    angular.forEach(res.data.response, function (obj_rec) {
                        obj_rec.rec_id = obj_rec.id;
                        $scope.purchase_cost_detail_record.push(obj_rec);
                    });
                }
            });

        angular.forEach($rootScope.arr_currency, function (obj) {
            if (obj.id == $scope.$root.defaultCurrency) {
                $scope.array_purchase_cost.landing_cost_currency = obj;
            }
        });


        $scope.arr_unit_of_measure = [];

        var unitUrl = $scope.$root.stock + "unit-measure/get-unit-setup-list-category";
        $http
            .post(unitUrl, { product_id: $scope.formData.product_id, 'token': $scope.$root.token })
            .then(function (unit_data) {

                $scope.arr_unit_of_measure = [];

                if (unit_data.data.ack == true) {
                    $scope.arr_unit_of_measure = unit_data.data.response;

                    angular.forEach($scope.arr_unit_of_measure, function (obj) {
                        if (obj.unit_id == $scope.formData.unit_id.id)
                            $scope.array_purchase_cost.landing_cost_unit_of_measure = obj;
                    });

                }
            });


        /*var total_landing_cost_Url = $scope.$root.stock + "products-listing/get-purchase-cost-detail-total";
         $http
         .post(total_landing_cost_Url, {
         product_id: $scope.formData.product_id,
         supp_id: $scope.priceFormData.sale_id,
         'token': $scope.$root.token
         })
         .then(function (total_landing_cost_data) {

         if (total_landing_cost_data.data.ack == true) {

         // console.log(total_landing_cost_data.data.response);
         $scope.total_landing_cost = total_landing_cost_data.data.response.total;
         }
         });*/


        // console.log($scope.formData.unit_id.title);


        angular.element('#add_purchase_cost_detail').modal({ show: true });
    }


    // ############ Show-landing-cost-setup-modal ##############

    $scope.show_landing_cost_detail = function (rec_id, suppler_id, prod_id) {

        $scope.showLoader = true;
        $scope.total_landing_cost = "";

        var get_purchase_cost_rec_url = $scope.$root.stock + "products-listing/get-purchase-cost-detail-list";

        $scope.purchase_cost_detail_record = [];

        $http
            .post(get_purchase_cost_rec_url, {
                'token': $scope.$root.token,
                'product_id': prod_id,
                'supp_id': suppler_id
            })
            .then(function (res) {
                $scope.default_value_readonly = false;

                if (res.data.ack == true) {
                    //console.log(res.data.sum);
                    $scope.total_landing_cost = res.data.sum;

                    angular.forEach(res.data.response, function (obj_rec) {
                        obj_rec.rec_id = obj_rec.id;
                        $scope.purchase_cost_detail_record.push(obj_rec);
                    });

                    $scope.showLoader = false;
                }
            });

        angular.element('#product_landing_cost_setup').modal({ show: true });
    }

    // ############ ADD GL code for purchase-cost-detail ##############


    $scope.getGL_account_code = function (arg) {

        // console.log(arg);
        // console.log(inventory_type);
        /*return false;*/


        var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";

        $scope.postData = {};
        // $scope.postData.cat_id = [];
        $scope.searchKeyword2 = {};

        $scope.title = ' Chart of Accounts';
        $scope.postData.token = $scope.$root.token;

        // console.log($scope.gl_arg);

        if (arg == "purchase_item_gl_id") {

            if ($scope.gl_arg == undefined || $scope.gl_arg != "purchase_item_gl_id") {

                /*Item GL*/
                $scope.postData.cat_id = [8];

                $http
                    .post(postUrl_cat, $scope.postData)
                    .then(function (res) {
                        // console.log(res);
                        $scope.gl_account = [];

                        if (res.data.ack == true) {
                            $scope.gl_arg = arg;
                            $scope.gl_account_type_for = $scope.type_id;

                            angular.forEach(res.data.response, function (obj, index) {
                                $scope.gl_account[index] = obj;
                            });
                        }
                        else toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

                        angular.element('#item_gl_account_modal').modal({ show: true });
                    });
            } else {
                angular.element('#item_gl_account_modal').modal({ show: true });
            }
        }
        else if (arg == "sale_item_gl") {//sale_volume_item_gl

            if ($scope.gl_arg == undefined || $scope.gl_arg != "sale_item_gl") {

                $scope.postData.cat_id = [8];
                $http
                    .post(postUrl_cat, $scope.postData)
                    .then(function (res) {
                        // console.log(res);
                        $scope.gl_account = [];

                        if (res.data.ack == true) {
                            $scope.gl_arg = arg;
                            $scope.gl_account_type_for = $scope.type_id;

                            angular.forEach(res.data.response, function (obj, index) {
                                $scope.gl_account[index] = obj;
                            });
                        }
                        else toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

                        angular.element('#item_gl_account_modal').modal({ show: true });
                    });
            } else {
                angular.element('#item_gl_account_modal').modal({ show: true });
            }
        }
        else if (arg == "raw_material_item_gl_id") {//Raw Material Product

            $scope.title = 'G/L Accounts';

            if ($scope.gl_arg == undefined || $scope.gl_arg != "raw_material_item_gl_id") {

                $http
                    .post(postUrl_cat, $scope.postData)
                    .then(function (res) {

                        $scope.gl_account = [];

                        if (res.data.ack == true) {
                            $scope.gl_arg = arg;
                            $scope.gl_account_type_for = $scope.type_id;

                            angular.forEach(res.data.response, function (obj, index) {
                                $scope.gl_account[index] = obj;
                            });
                        }
                        else toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

                        angular.element('#item_gl_account_modal').modal({ show: true });
                    });
            } else {
                angular.element('#item_gl_account_modal').modal({ show: true });
            }
        }
        else {

            if ($scope.gl_arg == undefined) {
                /*Landing GL*/
                $scope.postData.cat_id = [8];
                $http
                    .post(postUrl_cat, $scope.postData)
                    .then(function (res) {
                        // console.log(res);

                        $scope.gl_account = [];

                        if (res.data.ack == true) {
                            $scope.gl_arg = arg;
                            $scope.gl_account_type_for = $scope.type_id;

                            angular.forEach(res.data.response, function (obj, index) {
                                $scope.gl_account[index] = obj;
                            });
                        }
                        else
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

                        angular.element('#finance_set_gl_account').modal({ show: true });
                    });
            } else
                angular.element('#finance_set_gl_account').modal({ show: true });
        }
    }

    $scope.assignCodes = function (gl_data) {

        if ($scope.gl_arg == "purchase_item_gl_id") {
            $scope.formData.purchase_item_gl_codes = gl_data.code + " - " + gl_data.name;
            $scope.formData.purchase_item_gl_id = gl_data.id;
            angular.element('#item_gl_account_modal').modal('hide');
        }
        else if ($scope.gl_arg == "sale_item_gl") {
            $scope.salesFormData.sale_item_gl_codes = gl_data.code + " - " + gl_data.name;
            $scope.salesFormData.sale_item_gl_id = gl_data.id;
            angular.element('#item_gl_account_modal').modal('hide');
        }

        else if ($scope.gl_arg == "raw_material_item_gl_id") {
            $scope.formData.raw_material_gl_codes = gl_data.code;
            $scope.formData.raw_material_gl_name = gl_data.name;
            $scope.formData.raw_material_gl = gl_data.code + " - " + gl_data.name;
            $scope.formData.raw_material_gl_id = gl_data.id;
            angular.element('#item_gl_account_modal').modal('hide');
        }
        /* else if ($scope.gl_arg == "sale_volume_item_gl") {
            $scope.formData.sale_volume_item_gl_codes = gl_data.code + " - " + gl_data.name;
            $scope.formData.sale_volume_item_gl_id = gl_data.id;
            angular.element('#item_gl_account_modal').modal('hide');
        } */
        else {
            $scope.array_purchase_cost.landing_cost_gl_code = gl_data.code + " - " + gl_data.name;
            $scope.array_purchase_cost.landing_cost_gl = gl_data.id;
            angular.element('#finance_set_gl_account').modal('hide');
        }
    }

    $scope.chkPrice_conversion = function () {

        if ($scope.array_purchase_cost.cost == undefined)
            return;

        var price = $scope.array_purchase_cost.cost;

        var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
        $http
            .post(currencyURL, { 'id': $scope.array_purchase_cost.landing_cost_currency.id, token: $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {
                    if (res.data.response.conversion_rate == null) {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Currency Conversion Rate']));
                        $scope.array_purchase_cost.cost = null;
                        $scope.array_purchase_cost.landing_conversion_cost = null;
                        return;
                    }

                    if ($scope.array_purchase_cost.landing_cost_unit_of_measure != undefined) {
                        if ($scope.array_purchase_cost.landing_cost_unit_of_measure.unit_id != $scope.formData.unit_id.id) {
                            if ($scope.array_purchase_cost.landing_cost_unit_of_measure.unit_id != $scope.array_purchase_cost.landing_cost_unit_of_measure.ref_unit_id) {
                                var new_price = Number(price) / $scope.array_purchase_cost.landing_cost_unit_of_measure.ref_quantity;
                            } else {
                                var new_price = Number(price) / $scope.array_purchase_cost.landing_cost_unit_of_measure.quantity;
                            }
                        }
                        else var new_price = price;
                    }
                    else var new_price = price;
                    //console.log(new_price);

                    if ($scope.array_purchase_cost.landing_cost_currency != undefined) {
                        if ($scope.array_purchase_cost.landing_cost_currency.id != $scope.$root.defaultCurrency)
                            var newPrice2 = Number(new_price) / Number(res.data.response.conversion_rate);
                        else
                            var newPrice2 = Number(new_price);
                    }
                    $scope.array_purchase_cost.landing_conversion_cost = Number(newPrice2).toFixed(2);
                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Currency Conversion Rate']));
                    $scope.array_purchase_cost.cost = null;
                    $scope.array_purchase_cost.landing_conversion_cost = null;
                    return;
                }
            });
    }

    // ############ purchase-cost-detail end ##############

    $scope.edit_readonly = false;
    $scope.edit_sale_unit_setup = function (id) {

        var editUrl = $scope.$root.stock + "unit-measure/get-setup-data-by-id";
        $scope.array_submit_unit = {};

        $http
            .post(editUrl, { 'token': $scope.$root.token, id: id })
            .then(function (res) {

                if (res.data.ack == true) {
                    // $scope.edit_readonly = true;
                    $scope.array_submit_unit = res.data.response;

                    angular.forEach($rootScope.uni_prooduct_arr, function (obj) {
                        if (obj.id == $scope.array_submit_unit.cat_id)
                            $scope.array_submit_unit.cat_id = obj;
                    });

                    angular.forEach($scope.ref_unit_measures, function (obj) {
                        if (obj.id == $scope.array_submit_unit.ref_unit_id)
                            $scope.array_submit_unit.ref_unit_id = obj;
                    });
                }
            });
    }

    $scope.add_unit_setup = function () {
        //console.log($scope.unit_measures_category_record);
        var addunitUrl = $scope.$root.stock + "unit-measure/add-unit-record-popup";
        var rec = {};
        rec = $scope.unit_measures_category_record;
        rec.token = $scope.$root.token;
        rec.product_id = $scope.formData.product_id;
        rec.product_code = $scope.formData.product_code;
        rec.unit_id = $scope.formData.unit_id;

        var isValidCat = true;
        var isQtyCat = true;
        angular.forEach(rec.data, function (obj) {
            if (obj.cat_id == undefined || obj.cat_id == "" || obj.cat_id == 0 || Number(obj.cat_id.id) == 0 || obj.ref_unit_id == undefined || obj.ref_unit_id == "" || Number(obj.ref_unit_id.id) == 0) {
                isValidCat = false;
            }
            if (Number(obj.quantity) == 0) {
                isQtyCat = false;
            }
        });

        if (!isValidCat) {
            toaster.pop('error', 'Error', 'Please specify U.O.M for each line in the hierarchy');
            return;
        }
        if (!isQtyCat) {
            toaster.pop('error', 'Error', 'Please specify quantity for each line in the hierarchy');
            return;
        }
        /* var rec = {};
        rec = $scope.array_submit_unit;

        if (rec.ref_quantity == undefined)
            rec.ref_quantity = 1;

        rec.token = $scope.$root.token;
        rec.product_id = $scope.formData.product_id;
        rec.unit_id = $scope.formData4.unit_id;
        rec.product_code = $scope.formData.product_code;

        var msg = '';
        var msgs = '';
        var counter_cat = 0;
        var counter_quan = 0;
        var total_rec = 0;
        var total_count_qua = 0;
        var total_base_category = 0;
        var ref_cat_counter = 0;
        var rec_counter = 0;
        var title = $scope.formData.unit_id.title;
        msg = 'Ref Category Must be Selected Base UOM.';

        angular.element('.pic_block').attr("disabled", false);

        if ($scope.array_submit_unit.quantity == undefined || $scope.array_submit_unit.cat_id == undefined || $scope.array_submit_unit.ref_unit_id == undefined) {
            angular.element('.blocksubmit').attr("disabled", true);
            toaster.pop('error', 'Error', 'Data is Empty');
            return;
        }
        else
            angular.element('.blocksubmit').attr("disabled", false);
 */
        $http
            .post(addunitUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', res.data.msg, 'Record  ' + res.data.msg);

                    if ($scope.formData.unit_id != 0)
                        $scope.disable_unit_check = true;
                    else
                        $scope.disable_unit_check = false;

                    // $scope.get_setup_unit_data(rec.unit_id.id);
                    angular.element('#add_unit_category').modal('hide');
                }
                else
                    toaster.pop('error', res.data.msg, res.data.error);
            });
    }


    // ------------- 	 uni levels in detail    	 ----------------------------------------


    var uni_levels_url = $scope.$root.stock + "dimention/get-dimention";
    var add_levels_url = $scope.$root.stock + "unit-list/update-unit-level";
    $scope.unit_level_list = [];
    $scope.unit_level_weight_list = [];
    $scope.volume_list = [];

    $scope.get_unit_level_list = function () {
        $scope.unit_level_list = [];
        $scope.unit_level_weight_list = [];
        $scope.volume_list = [];
        $http
            .post(uni_levels_url, { 'token': $scope.$root.token, 'get_code_name': 1 })
            .then(function (res) {

                if (res.data.ack == true) {
                    angular.forEach(res.data.response, function (catObj) {
                        if (catObj.types == 1)
                            $scope.unit_level_list.push(catObj);
                        else if (catObj.types == 2)
                            $scope.unit_level_weight_list.push(catObj);
                        else if (catObj.types == 3)
                            $scope.volume_list.push(catObj);
                    });
                }
            });
    }

    $scope.CalculateVolume = function (index) {
        $scope.unit_record_list[index].volume = $scope.unit_record_list[index].prd_height * $scope.unit_record_list[index].prd_width * $scope.unit_record_list[index].prd_length;
    }

    $scope.CalculateGrossWeight = function (index) {
        if ($scope.unit_record_list[index].prd_pkg_weight != undefined && $scope.unit_record_list[index].prd_pkg_weight != '' && $scope.unit_record_list[index].prd_pkg_weight != '0')
            $scope.unit_record_list[index].prd_weight = $scope.unit_record_list[index].prd_net_weight * $scope.unit_record_list[index].prd_pkg_weight;
        else
            $scope.unit_record_list[index].prd_weight = $scope.unit_record_list[index].prd_net_weight;
    }

    $scope.onChanglist = function (formData_rec, index, type) {

        formData_rec.volume_unit = $scope.volume_list[0];
        /* $scope.cid = 1;//formData_rec.prd_net_weight_unit.id; //-1;
        $scope.track_index = index;
        $scope.title = 'Unit Type';

        if ($scope.cid == -1) angular.element('#model_unit_list').modal({ show: true });

        $scope.formData6.name = '';
        $scope.formData6.type = type; */
    }

    $scope.add_unit_pop = function (formData6) {

        $scope.formData6.token = $scope.$root.token;
        $scope.formData6.data = $scope.formFields;
        $http
            .post(add_levels_url, formData6)
            .then(function (res) {
                var cid = res.data.id;
                if (res.data.ack == true) {
                    toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                    angular.element('#model_unit_list').modal('hide');

                    $http
                        .post(uni_levels_url, { 'token': $scope.$root.token })
                        .then(function (res) {
                            if (res.data.ack == true) {

                                angular.forEach(res.data.response, function (catObj) {
                                    if (catObj.type == 1) {
                                        $scope.unit_level_list = [];
                                        $scope.unit_level_list.push(catObj);
                                    }
                                    else if (catObj.type == 2) {
                                        angular.forEach($scope.unit_level_weight_list, function (elem) {
                                            if (elem.id == cid)
                                                formData_rec.prd_net_weight_unit == elem;
                                        });
                                        $scope.unit_level_weight_list = [];
                                        $scope.unit_level_weight_list.push(catObj);
                                    }
                                });

                                if ($scope.user_type == 1) {
                                    $scope.unit_level_list.push({ id: '-1', name: '++Add New++' });
                                    $scope.unit_level_weight_list.push({ id: '-1', name: '++Add New++' });
                                }
                            }
                            else toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                        });
                } else
                    toaster.pop('error', 'Add', res.data.error);
            });
    }

    $scope.change_array = function (formData_rec) {

        /*angular.forEach($scope.unit_record_list, function(item){
         item.prd_comidity_code==formData_rec.prd_comidity_code;
         item.prd_country_origin==formData_rec.prd_country_origin;
         });*/
        //console.log(formData_rec.prd_comidity_code); console.log(formData_rec.prd_country_origin);

        angular.forEach($scope.unit_record_list, function (obj_rec) {

            //obj_rec.prd_width_unit=obj_rec.prd_length_unit=	obj_rec.prd_height_unit=formData_rec.prd_height_unit;

            //obj_rec.prd_comidity_code = formData_rec.prd_comidity_code;
            //	obj_rec.prd_country_origin=formData_rec.prd_country_origin;
            //$scope.unit_record_list.push(obj_rec);
        });
    }


    $scope.delete_product = function () {
        if ($scope.formData.product_id !== undefined) {
            var delUrl = $scope.$root.stock + "products-listing/delete-product";

            ngDialog.openConfirm({
                template: 'modalDeleteDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                $http
                    .post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token })
                    .then(function (res) {

                        if (res.data.ack == true) {
                            toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));

                            $timeout(function () {
                                $state.go('app.item');
                            }, 1500);
                        } else
                            toaster.pop('error', 'Error', res.data.error);

                    });
            }, function (reason) {
                // console.log('Modal promise rejected. Reason: ', reason);
            });
        }
    }

    $scope.first_array = {};
    $scope.cancal_msg = function (first_array, second_array, redirect, state_val, remandr_id) {
        var counter = 0;
        var length = 1;

        if (counter > 1) {
            ngDialog.openConfirm({
                template: 'modalleaveid',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                if (value == 1) {
                    //console.log(redirect);
                    if (state_val == 1)
                        $state.go($scope.$root.base64_decode(redirect));
                    else if (state_val == 2)
                        $scope.get_purchase_sale_price(2);// $scope.$root.base64_decode(redirect);
                }
            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
    }

    var originalFormData = angular.element('form_check#input').serialize();
    $scope.checkFormChanged = function () {

        var form_has_been_modified = 0;
        console.log(originalFormData + 'org');
        console.log(angular.element('#form_check#input').serialize() + 'chg');

        if (originalFormData !== angular.element('form_check#input').serialize()) {
            form_has_been_modified = 1;
        }
        console.log(form_has_been_modified);
    }

    $scope.getFormFields = function ($tab_id) {
        $scope.tab_id_2 = $tab_id;

        var ColsUrl = $scope.$root.stock + "product-col/get-cols-by-tab-col";
        var ColPostData = {
            'token': $scope.$root.token,
            'all': "1",
            'tab_id': $tab_id
        };
        $http
            .post(ColsUrl, ColPostData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.fields_rec = res.data.response;
                }
                //  else
                //	toaster.pop('error', 'Error', "No column found!");
            });
        // Get selected values against this tab, in case of edit mode.
        if ($scope.formData.product_id !== undefined) {
            $scope.$root.product_id = $scope.formData.product_id;

            var selTabValuesUrl = $scope.$root.stock + "product-tab-values/get_pr_value_by_undefined";
            $http
                .post(selTabValuesUrl, {
                    'token': $scope.$root.token,
                    'product_id': $scope.formData.product_id,
                    "tab_id": $tab_id
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.formData.fields_data = res.data.response;
                    }
                });
        }
    }

    if ($stateParams.id == undefined) {
        $scope.formData.stock_check = 1;
        $scope.formData.rawMaterialProduct = 0;
    }


    /* Stock sheet Start */

    $scope.searchKeywordTotalStock = {};
    $scope.searchKeywordAvailableStock = {};
    $scope.searchKeywordAllocatedStock = {};

    $scope.StockSheetActivityParam = {};

    $scope.clearFiltersAndGetTotalStockSheet = function (prd) {
        $scope.searchKeywordTotalStock = {};
        $scope.getTotalStockSheet(prd);
    }

    $scope.getTotalStockSheet = function (prd) {// show, type_pass,		

        $scope.postDatastock = {};
        $scope.showLoader = true;

        // if (item_paging == undefined)
        // 	$scope.item_paging.spage = 1;

        if (prd != undefined)
            $rootScope.item_paging.spage = 1;

        $scope.postDatastock.page = $rootScope.item_paging.spage;

        if ($scope.postDatastock.pagination_limits == -1)
            $scope.postDatastock.page = -1;

        $scope.postDatastock.searchKeyword = $scope.searchKeywordTotalStock;

        $scope.stockTitle = 'Stock Sheet';
        $scope.activityType = 'totalStock';

        var productID = 0;
        var productDesc = '';
        var productCode = '';

        if (prd != undefined) {

            var RecordData = prd;//.record;
            productID = RecordData.id;
            productDesc = RecordData.description;
            productCode = RecordData.product_code;
        }

        if (productID > 0) {
            $scope.postDatastock.product_id = productID;
            $scope.StockSheetActivityParam.product_id = productID;
        }
        else
            $scope.postDatastock.product_id = $stateParams.id;

        if (productDesc != undefined && productDesc.length > 0)
            $scope.StockSheetActivityParam.title = productDesc;

        if (productCode != undefined && productCode.length > 0)
            $scope.StockSheetActivityParam.pcode = productCode;

        $scope.postDatastock.token = $scope.$root.token;

        var stockApi = $scope.$root.stock + "products-listing/stock-sheet";
        $http
            .post(stockApi, $scope.postDatastock)
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {

                    $scope.general = res;

                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    angular.forEach($scope.general.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });

                    angular.element('#model_status_product').modal({ show: true });
                }
                else {
                    $scope.columns_general = [];
                    $scope.general = [];
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            }).catch(function (message) {
                $scope.showLoader = false;
                throw new Error(message.data);
            });
    }

    $scope.clearFiltersAndGetAvailableStock = function (prd) {
        $scope.searchKeywordAvailableStock = {};
        $scope.getAvailableStock(prd);
    }

    $scope.getAvailableStock = function (prd) {// show, type_pass

        $scope.postDatastock = {};
        $scope.showLoader = true;

        // if (item_paging == undefined)
        // 	$scope.item_paging.spage = 1;

        if (prd != undefined)
            $rootScope.item_paging.spage = 1;

        $scope.postDatastock.page = $rootScope.item_paging.spage;

        if ($scope.postDatastock.pagination_limits == -1)
            $scope.postDatastock.page = -1;

        $scope.postDatastock.searchKeyword = $scope.searchKeywordAvailableStock;

        $scope.stockTitle = 'Available Stock';
        $scope.activityType = 'AvailableStock';

        var productID = 0;
        var productDesc = '';
        var productCode = '';

        if (prd != undefined) {

            var RecordData = prd;//.record;

            productID = RecordData.id;
            productDesc = RecordData.description;
            productCode = RecordData.product_code;
        }

        if (productID > 0) {
            $scope.postDatastock.product_id = productID;
            $scope.StockSheetActivityParam.product_id = productID;
        }
        else
            $scope.postDatastock.product_id = $stateParams.id;//$scope.StockSheetActivityParam.product_id;

        if (productDesc != undefined && productDesc.length > 0)
            $scope.StockSheetActivityParam.title = productDesc;

        if (productCode != undefined && productCode.length > 0)
            $scope.StockSheetActivityParam.pcode = productCode;


        $scope.postDatastock.token = $scope.$root.token;

        var stockApi = $scope.$root.stock + "products-listing/stock-sheet-available";
        $http
            .post(stockApi, $scope.postDatastock)
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.general = res;

                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    angular.forEach($scope.general.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });

                    angular.element('#model_status_product').modal({ show: true });
                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            }).catch(function (message) {
                $scope.showLoader = false;
                throw new Error(message.data);
            });
    }

    $scope.clearFiltersAndGetAllocatedStock = function (prd) {
        $scope.searchKeywordAllocatedStock = {};
        $scope.getAllocatedStock(prd);
    }

    $scope.getAllocatedStock = function (prd) {// show, type_pass

        $scope.postDatastock = {};
        $scope.showLoader = true;

        // if (item_paging == 1)
        // 	$scope.item_paging.spage = 1;

        if (prd != undefined)
            $rootScope.item_paging.spage = 1;

        $scope.postDatastock.page = $rootScope.item_paging.spage;

        if ($scope.postDatastock.pagination_limits == -1)
            $scope.postDatastock.page = -1;

        $scope.postDatastock.searchKeyword = $scope.searchKeywordAllocatedStock;

        $scope.stockTitle = 'Allocated Stock';
        $scope.activityType = 'AllocatedStock';

        var productID = 0;
        var productDesc = '';
        var productCode = '';

        if (prd != undefined) {

            var RecordData = prd;//.record;

            productID = RecordData.id;
            productDesc = RecordData.description;
            productCode = RecordData.product_code;
        }

        if (productID > 0) {
            $scope.postDatastock.product_id = productID;
            $scope.StockSheetActivityParam.product_id = productID;
        }
        else
            $scope.postDatastock.product_id = $stateParams.id;//$scope.StockSheetActivityParam.product_id;

        if (productDesc != undefined && productDesc.length > 0)
            $scope.StockSheetActivityParam.title = productDesc;

        if (productCode != undefined && productCode.length > 0)
            $scope.StockSheetActivityParam.pcode = productCode;


        $scope.postDatastock.token = $scope.$root.token;

        var stockApi = $scope.$root.stock + "products-listing/stock-sheet-allocated";
        $http
            .post(stockApi, $scope.postDatastock)
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {

                    $scope.general = res;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;


                    angular.forEach($scope.general.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });

                    angular.element('#model_status_product').modal({ show: true });
                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            }).catch(function (message) {
                $scope.showLoader = false;
                throw new Error(message.data);
            });
    }

    $scope.clearFiltersAndGetOnRouteStock = function (prd) {
        $scope.searchKeywordOnRouteStock = {};
        $scope.getOnRouteStock(prd);
    }

    $scope.getOnRouteStock = function (prd) {// show, type_pass

        $scope.postDatastock = {};
        $scope.showLoader = true;

        // if (item_paging == 1)
        // 	$scope.item_paging.spage = 1;

        if (prd != undefined)
            $rootScope.item_paging.spage = 1;

        $scope.postDatastock.page = $rootScope.item_paging.spage;

        if ($scope.postDatastock.pagination_limits == -1)
            $scope.postDatastock.page = -1;

        $scope.postDatastock.searchKeyword = $scope.searchKeywordOnRouteStock;

        $scope.stockTitle = 'OnRoute Stock';
        $scope.activityType = 'AllocatedStock';

        var productID = 0;
        var productDesc = '';
        var productCode = '';

        if (prd != undefined) {

            var RecordData = prd;//.record;

            productID = RecordData.id;
            productDesc = RecordData.description;
            productCode = RecordData.product_code;
        }

        if (productID > 0) {
            $scope.postDatastock.product_id = productID;
            $scope.StockSheetActivityParam.product_id = productID;
        }
        else
            $scope.postDatastock.product_id = $stateParams.id;//$scope.StockSheetActivityParam.product_id;

        if (productDesc != undefined && productDesc.length > 0)
            $scope.StockSheetActivityParam.title = productDesc;

        if (productCode != undefined && productCode.length > 0)
            $scope.StockSheetActivityParam.pcode = productCode;


        $scope.postDatastock.token = $scope.$root.token;

        var stockApi = $scope.$root.stock + "products-listing/stock-sheet-onRoute";
        $http
            .post(stockApi, $scope.postDatastock)
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {

                    $scope.general = res;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;


                    angular.forEach($scope.general.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });

                    angular.element('#model_status_product').modal({ show: true });
                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            }).catch(function (message) {
                $scope.showLoader = false;
                throw new Error(message.data);
            });
    }


    $scope.openDocumentLink = function (record) {

        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;

        var url;
        if (record.docType == 'Sales Invoice') {
            url = $state.href("app.viewOrder", ({ id: record.order_id, isInvoice: 1 }));
        }
        else if (record.docType == 'Sales Order') {
            url = $state.href("app.viewOrder", ({ id: record.order_id }));
        }
        else if (record.docType == 'Credit Note') {
            url = $state.href("app.viewReturnOrder", ({ id: record.order_id }));
        }
        else if (record.docType == 'Credit Note Invoice') {
            url = $state.href("app.viewReturnOrder", ({ id: record.order_id, isInvoice: 1 }));
        }
        else if (record.docType == 'Purchase Invoice' || record.docType == 'PI Finished Good') {
            url = $state.href("app.viewsrmorder", ({ id: record.order_id }));
        }
        else if (record.docType == 'Purchase Order' || record.docType == 'PO Finished Good') {
            url = $state.href("app.viewsrmorder", ({ id: record.order_id }));
        }
        else if (record.docType == 'Debit Note') {
            url = $state.href("app.viewsrmorderreturn", ({ id: record.order_id }));
        }
        else if (record.docType == 'Debit Note Invoice') {
            url = $state.href("app.viewsrmorderreturn", ({ id: record.order_id }));
        }
        else if (record.docType == 'Item Ledger In' || record.docType == 'Item Journal') {
            url = $state.href("app.view-receipt-journal-gl-item", ({ id: record.order_id }));
        }
        else if (record.docType == 'Item Ledger Out') {
            url = $state.href("app.view-receipt-journal-gl-item", ({ id: record.order_id }));
        }
        else if (record.docType == 'Stock Opening Balance') {
            url = $state.href("app.openingBalances", ({ module: 'stock' }));
            // url = $state.href("app.openingBalances", ({ module: 'bank' }));
        }
        else if (record.docType == 'Transfer Stock') {
            url = $state.href("app.view-transfer-order", ({ id: record.order_id }));
        }
        else if (record.docType == 'Transfer Stock') {
            url = $state.href("app.view-transfer-order", ({ id: record.order_id }));
        }

        window.open(url, '_blank');

    }

    /* Stock sheet End */

    //--------------------   call event for image document & caments module --------------------


    $scope.$root.load_date_picker('item');

    $scope.$root.set_document_internal($scope.$root.item_gneral_tab_module);

    $scope.row_id = $stateParams.id;
    $scope.module_id = 29;
    $scope.subtype = 2;
    $scope.module = "Inventory";
    $scope.module_name = "items";
    //$scope.module_code= $scope.$root.model_code ;
    //console.log( $scope.module_id+'call'+$scope.module+'call'+$scope.module_name+'call'+$scope.module_code);
    $scope.$root.$broadcast("image_module", $scope.row_id, $scope.module, $scope.module_id, $scope.module_name, $scope.module_code, 2, $scope.$root.tab_id);

}
