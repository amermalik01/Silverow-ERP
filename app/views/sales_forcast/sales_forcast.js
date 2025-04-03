
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		/* specific routes here (see file config.js) */
		$stateProvider
			.state('app.sales-forcast', {
				url: '/sales_forcast',
				title: 'Sales Forecast',
				templateUrl: helper.basepath('sales_forcast/sales_forcast.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
	}]);


SaleForcastListController.$inject = ["$scope", "$filter", "$state", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.controller('SaleForcastListController', SaleForcastListController);
function SaleForcastListController($scope, $filter, $state, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams) {

	'use strict';
	$scope.$root.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': '#', 'isActive': false },
			{ 'name': 'Sales', 'url': 'app.sales-forcast', 'isActive': false },
			{ 'name': 'Sale Forecast', 'url': '#', 'isActive': false }];


	var vm = this;
	var Api = $scope.$root.sales + "customer/sale-target/get-sale-list";
	var Api_forecat = $scope.$root.sales + "customer/sale-forcast/get-sale-forcast-list";
	var postData = {
		'token': $scope.$root.token
	};

	$scope.searchKeyword = "";

	$scope.previous_year = new Date().getFullYear() - 1;
	$scope.current_year = new Date().getFullYear();
	$scope.next_year = new Date().getFullYear() + 1;

	$scope.rec = {};
	$scope.rec.year = $scope.current_year;
	$scope.rec.saleperson_id = $scope.$root.userId;
	$scope.showLoader = true;
	$scope.sales_persons = [];
	var Api = $scope.$root.reports + "module/saleperson-data-for-report";
	$http
		.post(Api, postData)
		.then(function (res) {
			$scope.showLoader = false;
			angular.forEach(res.data.response, function (value, key) {
				if (key != "tbl_meta_data") {
					$scope.sales_persons.push(value);
				}
			});
		});

	$scope.forcast_data = [];
	$scope.forcast_data_total = {};
	$scope.reset_forecast_data = function () {
		$scope.forcast_data = [
			{ 'month': "1", 'month_name': 'Jan', 'status': 1, 'target': 0, 'forecast': 0, 'orders': 0, 'acheived': 0, 'target_acheived_percentage': 0, 'forecast_acheived_percentage': 0 },
			{ 'month': "2", 'month_name': 'Feb', 'status': 1, 'target': 0, 'forecast': 0, 'orders': 0, 'acheived': 0, 'target_acheived_percentage': 0, 'forecast_acheived_percentage': 0 },
			{ 'month': "3", 'month_name': 'Mar', 'status': 1, 'target': 0, 'forecast': 0, 'orders': 0, 'acheived': 0, 'target_acheived_percentage': 0, 'forecast_acheived_percentage': 0 },
			{ 'month': "4", 'month_name': 'Apr', 'status': 1, 'target': 0, 'forecast': 0, 'orders': 0, 'acheived': 0, 'target_acheived_percentage': 0, 'forecast_acheived_percentage': 0 },
			{ 'month': "5", 'month_name': 'May', 'status': 1, 'target': 0, 'forecast': 0, 'orders': 0, 'acheived': 0, 'target_acheived_percentage': 0, 'forecast_acheived_percentage': 0 },
			{ 'month': "6", 'month_name': 'Jun', 'status': 1, 'target': 0, 'forecast': 0, 'orders': 0, 'acheived': 0, 'target_acheived_percentage': 0, 'forecast_acheived_percentage': 0 },
			{ 'month': "7", 'month_name': 'Jul', 'status': 1, 'target': 0, 'forecast': 0, 'orders': 0, 'acheived': 0, 'target_acheived_percentage': 0, 'forecast_acheived_percentage': 0 },
			{ 'month': "8", 'month_name': 'Aug', 'status': 1, 'target': 0, 'forecast': 0, 'orders': 0, 'acheived': 0, 'target_acheived_percentage': 0, 'forecast_acheived_percentage': 0 },
			{ 'month': "9", 'month_name': 'Sep', 'status': 1, 'target': 0, 'forecast': 0, 'orders': 0, 'acheived': 0, 'target_acheived_percentage': 0, 'forecast_acheived_percentage': 0 },
			{ 'month': "10", 'month_name': 'Oct','status': 1,  'target': 0, 'forecast': 0, 'orders': 0, 'acheived': 0, 'target_acheived_percentage': 0, 'forecast_acheived_percentage': 0 },
			{ 'month': "11", 'month_name': 'Nov','status': 1,  'target': 0, 'forecast': 0, 'orders': 0, 'acheived': 0, 'target_acheived_percentage': 0, 'forecast_acheived_percentage': 0 },
			{ 'month': "12", 'month_name': 'Dec','status': 1,  'target': 0, 'forecast': 0, 'orders': 0, 'acheived': 0, 'target_acheived_percentage': 0, 'forecast_acheived_percentage': 0 },
		];
		$scope.forcast_data_total = {'target_total':0, 'forecast_total':0, 'orders_total': 0, 'acheived_total': 0, 'target_acheived_percentage_total': 0, 'forecast_acheived_percentage_total': 0};
	}
	$scope.getSalesForecast = function (sale_person_id, year) {
		var postData = {
			'token': $scope.$root.token,
			'sale_person_id': sale_person_id,
			'year': year,

		};
		$scope.showLoader = true;
		var salesForecastApi = $scope.$root.sales + 'customer/customer/get-sales-forecast';
		$http
			.post(salesForecastApi, postData)
			.then(function (res) {
				$scope.showLoader = false;
				$scope.reset_forecast_data();

				angular.forEach($scope.forcast_data, function (obj, key) {
					var fc = $filter("filter")(res.data.response, { month: obj.month }, true);
					if (fc.length > 0) {
						obj.id = fc[0].id;
						obj.status = fc[0].status;
						obj.target = fc[0].target;
						obj.forecast = fc[0].forecast;
						obj.orders = fc[0].orders;
						obj.acheived = fc[0].acheived;
						obj.target_acheived_percentage = fc[0].target_acheived_percentage;
						obj.forecast_acheived_percentage = fc[0].forecast_acheived_percentage;

						$scope.forcast_data_total.target_total 	+= Number(fc[0].target);
						$scope.forcast_data_total.forecast_total+= Number(fc[0].forecast);
						$scope.forcast_data_total.orders_total  += Number(fc[0].orders);
						$scope.forcast_data_total.acheived_total+= Number(fc[0].acheived);
					}
				});
				
				$scope.forcast_data_total.target_total 	= Number($scope.forcast_data_total.target_total).toFixed(2);
				$scope.forcast_data_total.forecast_total= Number($scope.forcast_data_total.forecast_total).toFixed(2);
				$scope.forcast_data_total.orders_total  = Number($scope.forcast_data_total.orders_total).toFixed(2);
				$scope.forcast_data_total.acheived_total= Number($scope.forcast_data_total.acheived_total).toFixed(2);
				$scope.forcast_data_total.target_acheived_percentage_total = (Number($scope.forcast_data_total.target_total) > 0) ? (Number($scope.forcast_data_total.acheived_total)/ Number($scope.forcast_data_total.target_total)* 100).toFixed(2) : '0.00';
				$scope.forcast_data_total.forecast_acheived_percentage_total = (Number($scope.forcast_data_total.forecast_total) > 0) ? (Number($scope.forcast_data_total.acheived_total)/ Number($scope.forcast_data_total.forecast_total)* 100).toFixed(2) : '0.00';
			});
	}
	$scope.getSalesForecast($scope.rec.saleperson_id, $scope.rec.year);
	$scope.getTarget = function (row) {
		
		$scope.rec.id = row.id;
		$scope.rec.status = row.status;
		$scope.rec.target = Number(row.target);
		$scope.selected_month = row.month_name;
		$scope.selected_month_id = row.month;
		var sp = $filter("filter")($scope.sales_persons, { id: $scope.rec.saleperson_id });
		$scope.selected_sale_person = sp[0];
		if($scope.selected_sale_person.line_manager_name_id != $scope.$root.userId && $scope.$root.user_type > 2)
		{
			toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(667));
			return;
		}
		angular.element('#_sales_target').modal({ show: true });
	}

	$scope.save_target = function () {
		var saveTargetApi = $scope.$root.sales + 'customer/customer/save-sales-target';

		var postData = {
			'token': $scope.$root.token,
			'id': $scope.rec.id,
			'sale_person_id': $scope.selected_sale_person.id,
			'month': $scope.selected_month_id,
			'year': $scope.rec.year,
			'value': $scope.rec.target
		};
		$scope.showLoader = true;
		$http
			.post(saveTargetApi, postData)
			.then(function (res) {
				if (res.data.ack == true) {
					$scope.showLoader = false;
					angular.element('#_sales_target').modal('hide');
					$scope.getSalesForecast($scope.selected_sale_person.id, $scope.rec.year);
				}
				else {
					$scope.showLoader = false;
					angular.element('#_sales_target').modal('hide');
					toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(104));
				}
			});
	}
	$scope.searchKeyword_cust = {};
	$scope.getCustomerForSalesForecast = function (item_paging) {
		var getForecastApi = $scope.$root.sales + 'customer/customer/get-customer-forecast';


		if (item_paging) {
			$scope.searchKeyword_cust = {};
		}

		$scope.postData = {};
		$scope.postData.token = $scope.$root.token;
		$scope.postData.month = $scope.selected_month_id;
		$scope.postData.year = $scope.rec.year;
		$scope.postData.sale_person_id = $scope.selected_sale_person.id;

		$scope.postData.searchKeyword = $scope.searchKeyword_cust;

		if ($scope.postData.pagination_limits == -1) {
			$scope.postData.page = -1;
			$scope.searchKeyword_cust = {};
			$scope.record_data = {};
		}

		$scope.showLoader = true;
		$http
			.post(getForecastApi, $scope.postData)
			.then(function (res) {
				$scope.salesForecastTableData = res;
				if (res.data.ack == true) {
					$scope.showLoader = false;
					angular.element('#_sales_forecast').modal({ show: true });

				}
				else {
					$scope.showLoader = false;
					toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
				}
			});
	}

	$scope.edit_forecast_form = function()
	{
		$scope.cust_forecast_readonly = false;
	}
	$scope.getForecast = function (row) {

		if(row.id == undefined || row.id == 0)
		{
			toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Target']));
			return;
		}

		$scope.show_forecast_listing = true;
		
		$scope.rec.id = row.id;
		$scope.rec.status = row.status;
		$scope.rec.target = Number(row.target);
		$scope.selected_month = row.month_name;
		$scope.selected_month_id = row.month;
		var sp = $filter("filter")($scope.sales_persons, { id: $scope.rec.saleperson_id });
		$scope.selected_sale_person = sp[0];

		$scope.getCustomerForSalesForecast();
	}

	$scope.customer_forecast_detail = [];
	$scope.getCustomerForecastDetails = function (row) {
		$scope.selected_forecast_customer_row = row;
		$scope.show_forecast_listing = false;
		$scope.selected_customer = row;
		$scope.cust_forecast_readonly = true;

		var getForecastApi = $scope.$root.sales + 'customer/customer/get-customer-forecast-details';


		var postData = {
			'token': $scope.$root.token,
			'sale_person_id': $scope.selected_sale_person.id,
			'month': $scope.selected_month_id,
			'year': $scope.rec.year,
			'customer_id': $scope.selected_customer.id,
			'customer_posting_group': $scope.selected_customer.customer_posting_group
		};
		$scope.customer_forecast_detail = [];

		$scope.showLoader = true;
		$http
			.post(getForecastApi, postData)
			.then(function (res) {
				if (res.data.ack == true) {
					$scope.customer_forecast_detail = res.data.response;
					$scope.arr_vat_post_grp_sales = res.data.arr_vat_post_grp_sales;
					$scope.showLoader = false;
				}
				else {
					$scope.showLoader = false;
					// toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
				}
			});
	}

	$scope.tempProdArr = [];

	$scope.selectedRecFromModalsItem = [];
	$scope.searchKeywordItem = {};

	$scope.selectItem = function (item_paging, sort_column, sortform) {
		if (item_paging) {
			$scope.selectedRecFromModalsItem = [];
			$scope.searchKeywordItem = {};
		}

		$scope.filterSalesItem = {};

		$scope.postData = {};
		$scope.postData.token = $scope.$root.token;
		$scope.postData.order_date = $scope.rec.offer_date;
		$scope.postData.customer_id = $scope.rec.sell_to_cust_id;

		$scope.productsArr = [];

		$scope.postData.searchKeyword = $scope.searchKeywordItem;


		var itemListingApi = $scope.$root.stock + "products-listing/item-popup";
		// $scope.itemTableData ={};
		$scope.showLoader = true;
		$http
			.post(itemListingApi, $scope.postData)
			.then(function (res) {
				$scope.itemTableData = res;
				$scope.columns = [];
				$scope.record_data = {};
				$scope.recordArray = [];
				$scope.showLoader = false;
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

					angular.forEach($scope.itemTableData.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
						if (obj.event && obj.event.name && obj.event.trigger) {
							obj.generatedEvent = $scope[obj.event.name];
						}
					});
					angular.element('#productModal').modal({ show: true });

					$scope.showLoader = false;

				}
				else {
					toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
				}
			});
	}

	$scope.selectedRecFromModalsItem = [];
	$scope.addProduct = function () {

		angular.forEach($scope.selectedRecFromModalsItem, function (obj, key) {
			if (obj) {
				key = obj.key;
				var prodData = obj.record;

				var temp_item = $filter("filter")($scope.tempProdArr, { id: key }, true);
				if (temp_item.length == 0)
					$scope.tempProdArr.push(prodData);

				prodData.item_id = prodData.id;
				prodData.item_code = prodData.product_code;
				prodData.item_name = prodData.description;
				prodData.uom_id = prodData.uomSetupID;
				prodData.uom_name = prodData.unit_name;
				prodData.unit_price = (Number(prodData.standard_price) > 0) ? Number(prodData.standard_price) : 0;
				prodData.qty = 1;

				angular.forEach($scope.arr_vat_post_grp_sales, function (obj1) {
					if (obj1.id == prodData.vat_rate_id) {
						prodData.vat_name = obj1.name;
						prodData.vat_value = obj1.vat_value;
						prodData.vat_id = obj1.id;

					}
				});

				prodData.id = 0;
				$scope.customer_forecast_detail.push(prodData);
			}
		});

		angular.element('#productModal').modal('hide');
	}

	$scope.net_total = function () {
		var total = 0;
		angular.forEach($scope.customer_forecast_detail, function (obj, key) {
			total += Number(obj.qty) * Number(obj.unit_price);
		});
		total = total.toFixed(2);
        total = Number(total);
		return total;
	}

	$scope.vat_total = function () {
		var vat_total = 0;
		angular.forEach($scope.customer_forecast_detail, function (obj, key) {

			angular.forEach($scope.arr_vat_post_grp_sales, function (obj1) {
				if (obj1.id == obj.vat_id) {
					vat_total += (Number(obj1.vat_value) / 100) * (Number(obj.qty) * Number(obj.unit_price));
				}
			});
		});
		vat_total = vat_total.toFixed(2);
        vat_total = Number(vat_total);
		return vat_total;
	}

	$scope.rowVat = function (item) {
		var vat_row = 0;
		return vat_row;
		
		angular.forEach($scope.arr_vat_post_grp_sales, function (obj1) {
			if (obj1.id == item.vat_id) {
				vat_row += (Number(obj1.vat_value) / 100) * (Number(item.qty) * Number(item.unit_price));
			}

		});
		vat_row = vat_row.toFixed(2);
		vat_row = Number(vat_row);
		
		item.vat_amount = vat_row;
		return vat_row;
	}
	$scope.cancle_forecast_details = function () {
		$scope.show_forecast_listing = true;
		$scope.itemTableData = {};
		$scope.selectedRecFromModalsItem = [];
		$scope.customer_forecast_detail = [];
		$scope.selected_customer = {};
	}

	$scope.delete_customer_forecast_item = function (item, index) {

		if($scope.rec.status == 0 || $scope.cust_forecast_readonly) return;

		if (item.id > 0) {
			ngDialog.openConfirm({
				template: 'modalDeleteDialogId',
				className: 'ngdialog-theme-default-custom'
			}).then(function (value) {
				var deleteForecastApi = $scope.$root.sales + 'customer/customer/delete-customer-forecast-details';

				var postData = {
					'token': $scope.$root.token,
					'id': item.id
				};

				$scope.showLoader = true;
				$http
					.post(deleteForecastApi, postData)
					.then(function (res) {
						if (res.data.ack == true) {
							$scope.showLoader = false;
							$scope.customer_forecast_detail.splice(index, 1);
							toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						}
						else {
							$scope.showLoader = false;
							toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(108));
						}
					});
			}, function (reason) {
				console.log('Modal promise rejected. Reason: ', reason);
			});
		}
		else {
			$scope.customer_forecast_detail.splice(index, 1);
		}
	}

	$scope.save_customer_forecast_details = function () {
		var saveForecastApi = $scope.$root.sales + 'customer/customer/save-customer-forecast-details';

		var postData = {
			'token': $scope.$root.token,
			'sale_person_id': $scope.selected_sale_person.id,
			'month': $scope.selected_month_id,
			'year': $scope.rec.year,
			'customer_id': $scope.selected_customer.id,
			'forecast_data': $scope.customer_forecast_detail,
		};

		$scope.showLoader = true;
		$http
			.post(saveForecastApi, postData)
			.then(function (res) {
				if (res.data.ack == true) {
					$scope.showLoader = false;
					$scope.selected_forecast_customer_row.forecast = $scope.net_total();
					$scope.selected_forecast_customer_row.outstanding = ($scope.net_total() - $scope.selected_forecast_customer_row.achieved).toFixed(2);
					$scope.getCustomerForecastDetails($scope.selected_forecast_customer_row);

					toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(102));
				}
				else {
					$scope.showLoader = false;
					toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(104));
				}
			});
	}

	$scope.lock_forecast = function(status)
	{
		var saveForecastApi = $scope.$root.sales + 'customer/customer/lock-customer-forecast';

		var postData = {
			'token': $scope.$root.token,
			'id':$scope.rec.id,
			'sale_person_name': $scope.selected_sale_person.name,
			'sale_person_email': $scope.selected_sale_person.email,
			'line_manager_name_id': $scope.selected_sale_person.line_manager_name_id,
			'month': $scope.selected_month,
			'year': $scope.rec.year,
			'status': status
		};

		$scope.showLoader = true;
		$http
			.post(saveForecastApi, postData)
			.then(function (res) {
				if (res.data.ack == true) {
					$scope.showLoader = false;	
					$scope.rec.status = status;				
					toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(102));
				}
				else {
					$scope.showLoader = false;
					toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(104));
				}
			});
	}

	$scope.getFilteredOrders = function(row, type)
	{
		$scope.selected_month_id = row.month;

		var start_date1 = new Date($scope.rec.year, $scope.selected_month_id - 1, 1);
		var end_date1 = new Date($scope.rec.year, $scope.selected_month_id, 0);

		var leading_zero = ((start_date1.getMonth() + 1) < 10) ? '0' : '';

		var start_date = "0"+start_date1.getDate()+"/"+leading_zero+(start_date1.getMonth() + 1)+"/"+start_date1.getFullYear();
		var end_date = end_date1.getDate()+"/"+leading_zero+(end_date1.getMonth() + 1)+"/"+end_date1.getFullYear();

		var sp = $filter("filter")($scope.sales_persons, { id: $scope.rec.saleperson_id });
		$scope.selected_sale_person = sp[0];

		var query_string = window.btoa(String(start_date)+'^^^^'+String(end_date)+'^^^^'+String($scope.selected_sale_person.name));
		
		var url = "";
        
		if(type == 1) // orders
		{
			url = $state.href("app.orders", ({ query_filter: query_string }));
		}
		else // invoices
		{
			url = $state.href("app.sale-invoice", ({ query_filter: query_string }));
		}
		window.open(url, '_blank');
	}
}