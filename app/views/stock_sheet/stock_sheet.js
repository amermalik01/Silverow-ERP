myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		$stateProvider
			.state('app.stock-sheet', {
				url: '/stock-sheet',
				title: 'Inventory',
				templateUrl: helper.basepath('stock_sheet/stock_sheet.html'),
				controller: 'StockSheetController'
			})
	}]);

myApp.controller('StockSheetController', ["$scope","$timeout",  "$http", "ngDialog", "toaster", "$stateParams", "$state", "$rootScope", function StockSheetController($scope, $timeout, $http, ngDialog, toaster, $stateParams, $state, $rootScope) {
	'use strict';

	$scope.breadcrumbs = [{ 'name': 'Inventory', 'url': '#', 'isActive': false }, { 'name': 'Stock Sheet', 'url': '#', 'isActive': false }];

	var vm = this;
	$scope.rec = {};
	$scope.record = {};
	$scope.MainDefer = null;
	$scope.mainParams = null;
	$scope.mainFilter = null;
	$scope.more_fields = '';
	$scope.count = 1;
	$scope.sendRequest = false;
	$scope.searchKeyword = {};
	$scope.searchKeywordHistory = {};
	$scope.tempProdArr = {};	

	$scope.showStockSheetPage = function (item_paging) {		

		$scope.productListing = {};
		$scope.productListing.token = $rootScope.token;

		if (item_paging == 1)
			$scope.item_paging.spage = 1;

		$scope.productListing.page = $rootScope.item_paging.spage;

		// $scope.productListing.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

		// $scope.productListing.item_paging = $scope.item_paging;
		if ($scope.productListing.pagination_limits == -1) {
			$scope.productListing.page = -1;
			// $scope.searchKeyword = {};
			// $scope.record_data = {};
		}
		$scope.productListing.searchKeyword = $scope.searchKeyword;

		
		$scope.showLoader = true;

		// var productListingApi = $scope.$root.stock + "products-listing/get-product-listing";
		var productListingApi = $scope.$root.stock + "products-listing/get-stock-sheet-listing";
		$http
			.post(productListingApi, $scope.productListing)
			.then(function (res) {
				$scope.showLoader = false;

				if (res.data.ack == true) {
					// $scope.tempProdArr = res.data.response;
					$scope.tempProdArr = res;

					// $scope.tempProdArr.data = res.data.response;
					// $scope.tempProdArr2 = res.data;
					// $scope.total = res.data.total;
					$scope.item_paging.total_pages = res.data.total_pages;
					$scope.item_paging.cpage = res.data.cpage;
					$scope.item_paging.ppage = res.data.ppage;
					$scope.item_paging.npage = res.data.npage;
					$scope.item_paging.pages = res.data.pages;

					$scope.total_paging_record = res.data.total_paging_record;
					// $scope.customer_balance = res.data.customer_balance;

					// if (res.data.response.length > 0)
					// $scope.receipt_sub_list = res.data.response;
					angular.forEach($scope.tempProdArr.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
						if (obj.event && obj.event.name && obj.event.trigger) {
							obj.generatedEvent = $scope[obj.event.name];
						}
					});
				}
				else {
					toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
				}
			});
	}


	// $scope.showStockSheetPage();

	// console.log($scope.tempProdArr);

	$scope.status_data = {};
	$scope.status_data = [{ 'label': 'Show All', 'value': 0 }, { 'label': 'Available', 'value': 1 }];
	$scope.rec.status = $scope.status_data[1];

	function toTitleCase(str) {
		var title = str.replace('_', ' ');
		return title.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
	}

	$scope.type_array = {};
	$scope.type_array = [{ 'name': 'Purchase Order', 'id': '1-2' },
	{ 'name': 'Purchase Invoice', 'id': '1-3' },
	{ 'name': 'Debit Note', 'id': '1-1' },
	{ 'name': 'Sales Order', 'id': '2-2' },
	{ 'name': 'Sales Invoice', 'id': '2-3' },
	{ 'name': 'Credit Note', 'id': '2-1' }];

	$scope.arr_by = {};
	$scope.arr_by = [{ 'name': 'Date Received', 'id': '1' }, { 'name': 'Use by Date', 'id': '2' }];

	$scope.columns_general = [];
	$scope.general = {};
	$scope.arr_uom = [];
	$scope.stockTitle = '';
	$scope.activityType = '';

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

			var RecordData = prd.record;
			productID = RecordData.id;
			productDesc = RecordData.description;
			productCode = RecordData.product_code;
		}

		if (productID > 0){
			$scope.postDatastock.product_id = productID;
			$scope.StockSheetActivityParam.product_id = productID;
		}
		else
			$scope.postDatastock.product_id = $scope.StockSheetActivityParam.product_id;

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

		if(prd != undefined){

			var RecordData = prd.record;

			productID = RecordData.id;
			productDesc = RecordData.description;
			productCode = RecordData.product_code;
		}

		if (productID>0){
			$scope.postDatastock.product_id = productID;
			$scope.StockSheetActivityParam.product_id = productID;
		}			
		else
			$scope.postDatastock.product_id = $scope.StockSheetActivityParam.product_id;

		if (productDesc != undefined && productDesc.length> 0)
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

			var RecordData = prd.record;

			productID = RecordData.id;
			productDesc = RecordData.description;
			productCode = RecordData.product_code;
		}

		if (productID > 0){
			$scope.postDatastock.product_id = productID;
			$scope.StockSheetActivityParam.product_id = productID;
		}
		else
			$scope.postDatastock.product_id = $scope.StockSheetActivityParam.product_id;

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
		else if (record.docType == 'Purchase Invoice') {
			url = $state.href("app.viewsrmorder", ({ id: record.order_id }));
		}
		else if (record.docType == 'Purchase Order') {
			url = $state.href("app.viewsrmorder", ({ id: record.order_id }));
		}
		else if (record.docType == 'Debit Note') {
			url = $state.href("app.viewsrmorderreturn", ({ id: record.order_id }));
		}
		else if (record.docType == 'Debit Note Invoice') {
			url = $state.href("app.viewsrmorderreturn", ({ id: record.order_id }));
		}
		else if (record.docType == 'Item Ledger In') {
			url = $state.href("app.view-receipt-journal-gl-item", ({ id: record.order_id }));
		}
		else if (record.docType == 'Item Ledger Out') {
			url = $state.href("app.view-receipt-journal-gl-item", ({ id: record.order_id }));
		}
		else if (record.docType == 'Stock Opening Balances') {
			url = $state.href("app.openingBalances", ({ module: 'stock' }));
			// url = $state.href("app.openingBalances", ({ module: 'bank' }));
		}
		else if (record.docType == 'Stock Transfer Out') {
			url = $state.href("app.view-transfer-order", ({ id: record.order_id }));
		}		
		else if (record.docType == 'Stock Transfer In') {
			url = $state.href("app.view-transfer-order", ({ id: record.order_id }));
		}

		window.open(url, '_blank');

	}

}]);