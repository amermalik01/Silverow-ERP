myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		/* specific routes here (see file config.js) */
		$stateProvider
			.state('app.sales-target', {
				url: '/sales-target',
				title: 'Sales Target',
				templateUrl: helper.basepath('sales_target/sales_target.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.add-sales-target', {
				url: '/sales-target/add',
				title: 'Add Sales Target',
				templateUrl: helper.basepath('sales_target/_form.html'),
				resolve: helper.resolveFor('ngDialog'),
				controller: 'SalesTargetEditController'
			})
			.state('app.view-sales-target', {//url: '/:id/viewsales_target',				
				url: '/sales-target/:id/view',
				title: 'View Sales Target',
				templateUrl: helper.basepath('sales_target/_form.html'),
				resolve: helper.resolveFor('ngDialog'),
				controller: 'SalesTargetEditController'
			})
			.state('app.edit-sales-target', {// url: '/:id/editsales_target',
				url: '/sales-target/:id/view',
				title: 'Edit Sales Target',
				templateUrl: helper.basepath('sales_target/_form.html'),
				resolve: helper.resolveFor('ngDialog'),
				controller: 'SalesTargetEditController'
			})
	}]);

myApp.controller('SalesTargetListController', ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", function SalesTargetListController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
	'use strict';

	var vm = this;
	$scope.class = 'inline_block';

	$scope.$root.breadcrumbs = [{ 'name': 'Sales', 'url': '#', 'isActive': false }, 
								{ 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
								{ 'name': 'Sales Target', 'url': 'app.sales-target', 'isActive': false }];

	var Api = $scope.$root.sales + "customer/sale-target/get-sale-list";
	var Api_forecat = $scope.$root.sales + "customer/sale-forcast/get-sale-forcast-list";
	var postData = {
		'token': $scope.$root.token,
		'all': "1"
	};

	$scope.$watch("MyCustomeFilters", function () {
		if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
			$scope.table.tableParams5.reload();
		}
	}, true);

	$scope.MyCustomeFilters = {
	}

	vm.tableParams5 = new ngParams({
		page: 1,            // show first page
		count: $scope.$root.pagination_limit,          // count per page
		sorting: { Code: 'Desc' },
		filter: {
			name: '',
			age: ''
		}
	},
		{
			total: 0,           // length of data
			counts: [],         // hide page counts control
			getData: function ($defer, params) {
				//$scope.checkData = ngDataService.getData( $defer, params, Api,$filter,$scope,postData);
				ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);
			}
		});

	$scope.columns_general = [];
	$scope.general = {};
	$scope.counter_approve = 0;
	$scope.grandtotal = 0;
	$scope.grandpercentage = 0;
	$scope.disable_app = false;

	$scope.historytype = function (id) {

		var postData = { 'token': $scope.$root.token, 'id': id };
		$http
			.post(Api_forecat, postData)
			.then(function (res) {
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

					$scope.counter_approve = 0;
					$scope.grandtotal = 0;
					$scope.grandpercentage = 0;

					angular.forEach($scope.general, function (obj2) {
						if (obj2.status == 'Approved') {
							$scope.counter_approve++;
							$scope.grandtotal += Number(obj2.forecast);
						}
					});

					$scope.grandpercentage = Number($scope.grandtotal * 100) / $scope.general[0].target
					$scope.disable_app = false;

					if ($scope.counter_approve == $scope.general.length)
						$scope.disable_app = true;

					angular.element('#sale_target_pop').modal({ show: true });
				}
				else
					toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));
			});
	}

	$scope.selectedAprovalTo = [];
	angular.element(document).on('click', '.checkAll_aproval', function () {
		$scope.selectedAprovalTo = [];
		if (angular.element('.checkAll_aproval').is(':checked') == true) {
			$scope.isSalePerersonChanged = true;
			// var isPrimary = false;
			for (var i = 0; i < $scope.general.length; i++) {
				//   if($scope.general[i].isPrimary)  isPrimary = true;

				$scope.general[i].chk = true;
				$scope.selectedAprovalTo.push($scope.general[i]);
			}
			/* if(!isPrimary){
				 $scope.general[0].isPrimary = true;
				 $scope.selectedAprovalTo[0].isPrimary = true;
			 }*/
		}
		else {
			for (var i = 0; i < $scope.general.length; i++) {
				$scope.general[i].chk = false;
				// $scope.general[i].isPrimary = false;
			}
			$scope.selectedAprovalTo = [];
		}

		$scope.$root.$apply(function () {
			$scope.selectedAprovalTo;
		});

	});

	$scope.selectToAproval = function (sp, isPrimary) {
		$scope.isSalePerersonChanged = true;
		for (var i = 0; i < $scope.general.length; i++) {
			if (isPrimary == 1) $scope.general[i].isPrimary = false;

			if (sp.id == $scope.general[i].id) {
				if ($scope.general[i].chk == true && isPrimary == 0) {
					$scope.general[i].chk = false;
					$scope.general[i].isPrimary = false;
					$.each($scope.selectedAprovalTo, function (indx, obj) {
						if (obj != undefined) {
							if (obj.id == sp.id)
								$scope.selectedAprovalTo.splice(indx, 1);
						}
					});
				} else {

					// console.log('i==>>'+i);
					if (isPrimary == 1 || $scope.selectedAprovalTo.length == 0) {
						var isExist = false;
						$scope.general[i].isPrimary = true;
						$.each($scope.selectedAprovalTo, function (indx, obj) {
							if (obj != undefined) {
								$scope.selectedAprovalTo[indx].isPrimary = false;
								if (obj.id == sp.id) {
									isExist = true;
									$scope.selectedAprovalTo[indx].isPrimary = true;
								}

							}
						});
						if (!isExist) {
							$scope.general[i].chk = true;
							$scope.selectedAprovalTo.push($scope.general[i]);
						}

					}
					else {
						$scope.general[i].chk = true;
						$scope.selectedAprovalTo.push($scope.general[i]);
					}
				}

			}
		}
	}

	$scope.add_aproval = function (type) {

		var check = false;
		var excUrl = $scope.$root.sales + "customer/sale-forcast/add-multiple-approval";
		var post = {};
		var temp = [];

		var custUrl = $scope.$root.sales + "customer/sale-target/get-customer-crm-sale-person-id";
		var postData = {
			'token': $scope.$root.token,
			'sale_person_id': $scope.general[0].sid
		};
		var count_name = '';
		var count = 0;

		post.type = type;
		post.salespersons = temp;
		post.token = $scope.$root.token;

		$.each($scope.general, function (index, obj2) {
			if (obj2.chk) temp.push({ id: obj2.id, comment: obj2.comment });
		})

		$http
			.post(excUrl, post)
			.then(function (res) {
				if (res.data.ack == true)
					toaster.pop('Success', 'info', $scope.$root.getErrorMessageByCode(102));
				else
					toaster.pop('error', 'info', count_name + 'Record is Not Updated Convert into Customer');
			});
	}

	var target = 0;
	$scope.get_alt_sale_detail = function (id) {
		target = id;

		var urlCRMSocialMedias = $scope.$root.sales + "customer/sale-target/get-sale-detail-list";
		$http
			.post(urlCRMSocialMedias, { 'token': $scope.$root.token, 'crm_sale_target_id': id, 'type': 1 })
			.then(function (res) {
				if (res.data.response.length > 0) {
					$scope.alt_sale_detail = [];
					$scope.columns_alt_sale_detail = [];
					$scope.alt_sale_detail = res.data.response;

					angular.forEach(res.data.response[0], function (val, index) {
						$scope.columns_alt_sale_detail.push({
							'title': toTitleCase(index),
							'field': index,
							'visible': true
						});
					});
					angular.element('#get_alt_sale_detail').modal({ show: true });
				}
				else
					toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));
			});
	}

	$scope.get_alt_sale_detail_level = function (level_id, id) {
		var id = target;

		var urlCRMSocialMedias = $scope.$root.sales + "customer/sale-target/get-sale-detail-list";
		$http
			.post(urlCRMSocialMedias, { 'level_id': level_id, 'token': $scope.$root.token, 'crm_sale_target_id': id, 'type': 2 })
			.then(function (res) {
				if (res.data.response.length > 0) {

					$scope.level_record = [];
					$scope.columns_level_record = [];
					$scope.level_record = res.data.response;

					angular.forEach(res.data.response[0], function (val, index) {
						$scope.columns_level_record.push({
							'title': toTitleCase(index),
							'field': index,
							'visible': true
						});
					});

					angular.element('#get_alt_sale_detail_level').modal({ show: true });
				}
				else
					oaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));
			});
	}
}]);

myApp.controller('SalesTargetEditController', ["$scope", "$filter", "$resource", "$timeout", "$http", "ngDialog", "toaster", "$stateParams", "$state", "$rootScope", function SalesTargetEditController($scope, $filter, $resource, $timeout, $http, ngDialog, toaster, $stateParams, $state, $rootScope) {
	'use strict';

	$scope.saleTargetReadonly = false;

	if ($stateParams.id > 0) {
		$scope.saleTargetReadonly = true;
		//	$scope.perreadonly = false;
	}
	//else $scope.perreadonly = true;

	$scope.showEditForm = function () {
		$scope.saleTargetReadonly = false;
		//$scope.perreadonly = true;
	}
	// console.log($scope.saleTargetReadonly);
	// console.log($rootScope.defaultCurrencyCode);

	$scope.$root.breadcrumbs = [{ 'name': 'Sales', 'url': '#', 'isActive': false }, 
								{ 'name': 'Customers', 'url': 'app.customer', 'isActive': false },
								{ 'name': 'Sales Target', 'url': 'app.sales-target', 'isActive': false }];

	$scope.formTitle = 'Sales Target';
	$scope.btnCancelUrl = 'app.sales-target';
	$scope.hideDel = false;

	$scope.rec = {};
	$scope.rec.monthlySpreadArr = {};

	$scope.startMonthArr = [{ 'id': 1, 'title': 'January' },
	{ 'id': 2, 'title': 'February' },
	{ 'id': 3, 'title': 'March' },
	{ 'id': 4, 'title': 'April' },
	{ 'id': 5, 'title': 'May' },
	{ 'id': 6, 'title': 'June' },
	{ 'id': 7, 'title': 'July' },
	{ 'id': 8, 'title': 'August' },
	{ 'id': 9, 'title': 'September' },
	{ 'id': 10, 'title': 'October' },
	{ 'id': 11, 'title': 'November' },
	{ 'id': 12, 'title': 'December' }];

	$scope.startMonthSelectionArr = [{ 'id': 1, 'title': 'January' },
	{ 'id': 2, 'title': 'February' },
	{ 'id': 3, 'title': 'March' },
	{ 'id': 4, 'title': 'April' },
	{ 'id': 5, 'title': 'May' },
	{ 'id': 6, 'title': 'June' },
	{ 'id': 7, 'title': 'July' },
	{ 'id': 8, 'title': 'August' },
	{ 'id': 9, 'title': 'September' },
	{ 'id': 10, 'title': 'October' },
	{ 'id': 11, 'title': 'November' },
	{ 'id': 12, 'title': 'December' }];

	$scope.rec.id = 0;
	$scope.arr_type = [];
	$scope.arr_type = [{ id: 1, name: 'Individual' }, { 'id': 2, name: 'Group' }];

	$scope.arr_type_commision = [];
	$scope.arr_type_commision = [{ id: 1, name: 'Yes' }, { 'id': 2, name: 'No' }];

	$scope.arr_type_bonus = [];
	$scope.arr_type_bonus = [{ id: 1, name: 'Yes' }, { 'id': 2, name: 'No' }];

	$scope.rec.commission_type = 2;//$scope.arr_type_commision[1];
	$scope.rec.bonus_type = 2;//$scope.arr_type_bonus[1];

	$scope.target_type_array_commison = [];
	$scope.target_type_array_commison = [{ id: 1, name: 'Accumulative' }, { 'id': 2, name: 'Independent' }];

	$scope.arr_fix_target_type = [];
	$scope.arr_fix_target_type = [{ id: 1, name: 'Amount' }, { 'id': 2, name: 'Quantity' }];

	$scope.arrDataType = [];
	$scope.arrDataType = [{ 'id': 1, name: 'Product' }, { 'id': 2, name: 'Customer' }, { 'id': 3, name: 'Product/Customer ' }];

	$scope.arr_status = [];
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'inActive', 'value': 0 }];
	$scope.rec.status = $scope.arr_status[0];

	angular.forEach($rootScope.arr_currency, function (elem) {
		if (elem.id == $scope.$root.defaultCurrency)
			$scope.rec.currency_id = elem;
	});

	var price = 0;
	var currency_id = 0;
	var converted_price = 0;

	/* $scope.$root.sale_target_id = $stateParams.id;
	$scope.generate_unique_id = function () {

		var getUrl = $scope.$root.sales + "customer/sale-target/get-unique-id";

		$http
			.post(getUrl, { 'token': $scope.$root.token })
			.then(function (res) {

				if (res.data.ack == 1) {
					$scope.rec.unique_id = res.data.product_unique_id;
					$scope.rec.id = res.data.id;
					$scope.$root.sale_target_id = res.data.id;;
					//  toaster.pop('success', 'info', res.data.error);   
				}
				else {
					toaster.pop('error', 'info', res.data.error);
					return false;
				}
			});
	}
	if ($scope.$root.sale_target_id === undefined)
		$scope.generate_unique_id();
	
	$scope.getCode = function (rec) {
		var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
		var name = $scope.$root.base64_encode('crm_sale_target');
		var no = $scope.$root.base64_encode('sale_no');

		var module_category_id = 2;
		$http
			.post(getCodeUrl, { 'is_increment': 1, 'token': $scope.$root.token, 'tb': name, 'm_id': 9, 'no': no, 'category': '', 'brand': '', 'module_category_id': module_category_id, 'type': '', 'status': '' })
			.then(function (res) {

				if (res.data.ack == 1) {

					$scope.showLoader = false;
					$scope.rec.sale_code = res.data.code;
					$scope.rec.sale_no = res.data.nubmer;
					$scope.rec.code_type = module_category_id;//res.data.code_type;
					$scope.count_result++;

					if (res.data.type == 1) { $scope.product_type = false; }
					else { $scope.product_type = true; }

					if ($scope.count_result > 0) { console.log($scope.count_result); return true; }
					else { console.log($scope.count_result + 'd'); return false; }

				}
				else {
					toaster.pop('error', 'info', res.data.error);
					return false;
				}
			});

	}

	if ($scope.$root.sale_target_id === undefined)
		$scope.getCode(); */




	//------------ Get Currency Rate -----------------------------------------------
	/* $scope.arr_currency = [];
	var currencyUrl = $scope.$root.setup + "general/currency-list";
	$http
		.post(currencyUrl, { 'token': $scope.$root.token })
		.then(function (res) {
			$scope.arr_currency = [];
			if (res.data.ack == true) {
				$scope.arr_currency = res.data.response;

				$.each($scope.arr_currency, function (index, elem) {
					if (elem.id == $scope.$root.defaultCurrency) $scope.rec.currency_id = elem;
				});

			}
		}); */


	$scope.validatePrice = function (price, type) {

		if (type == 'level_1') {
			price = $scope.rec.target_amount;
			currency_id = $scope.rec.currency_id.id;
		}

		var isValide = true;
		if (Number(price) == undefined || currency_id == undefined) {
			toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Currency']));
			angular.element('.cur_block').attr("disabled", false);
			isValide = false;
			return;
		}

		var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
		$http
			.post(currencyURL, { 'id': currency_id, 'token': $scope.$root.token })
			.then(function (res) {
				if (res.data.ack == true) {

					if (res.data.response.conversion_rate == null) {

						if (type == 'level_1')
							$scope.rec.converted_price = null;

						toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
						angular.element('.cur_block').attr("disabled", true);
						return;
					}

					var newPrice1 = Number(price);
					var newPrice = 0;

					if (currency_id != $scope.$root.defaultCurrency)
						newPrice = Number(newPrice1) / Number(res.data.response.conversion_rate);
					else
						newPrice = Number(newPrice1);


					if (newPrice1 > 0)
						converted_price = Number(newPrice1).toFixed(2);
					else
						newPrice = 0;
					if (newPrice > 0)
						converted_price = Number(newPrice).toFixed(2);
					else
						newPrice = 0;

					if (type == 'level_1')
						$scope.rec.converted_price = converted_price;

					angular.element('.cur_block').attr("disabled", false);
				}
			});
	}

	// if ($scope.$root.sale_target_id !== undefined) {

	if ($stateParams.id > 0) {

		$scope.showLoader = true;

		var get = $scope.$root.sales + "customer/sale-target/get-sale-list-by-id";
		// var postData = { 'token': $scope.$root.token, 'id': $scope.$root.sale_target_id };
		var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

		$http
			.post(get, postData)
			.then(function (res) {

				$scope.showLoader = false;

				if (res.data.ack == true) {
					$scope.rec = res.data.response;
					$scope.rec.increment = parseFloat(res.data.response.increment);

					$scope.$root.breadcrumbs.push({ 'name': $scope.rec.sale_code, 'url': '#', 'isActive': false });

					if (res.data.response.starting_date == 0)
						$scope.rec.starting_date = null;
					else
						$scope.rec.starting_date = $scope.$root.convert_unix_date_to_angular(res.data.response.starting_date);

					if (res.data.response.ending_date == 0)
						$scope.rec.ending_date = null;
					else
						$scope.rec.ending_date = $scope.$root.convert_unix_date_to_angular(res.data.response.ending_date);


					angular.forEach($scope.arrDataType, function (obj) {
						if (obj.id == res.data.response.dataType)
							$scope.rec.data_type = obj;
					});

					angular.forEach($scope.arr_sale_type, function (obj) {
						if (obj.id == res.data.response.target_type)
							$scope.rec.target_type = obj;
					});

					angular.forEach($scope.arr_prod_promo_type, function (obj) {
						if (obj.id == $scope.rec.product_promotion_type_id)
							$scope.rec.product_promotion_type_id = obj;
					});

					angular.forEach($scope.arr_fix_target_type, function (obj) {
						if (obj.id == $scope.rec.fix_target_type)
							$scope.rec.fix_target_type = obj;
					});

					$scope.tempProdArr = [];
					$scope.selectedProducts = [];

					angular.copy($rootScope.prooduct_arr, $scope.tempProdArr);


					$scope.selectedSaleTargetItemsTooltip = "";

					angular.forEach($scope.tempProdArr, function (obj) {
						angular.forEach(res.data.response.targetProducts, function (obj2) {
							// console.log(obj2);
							if (obj.id == obj2) {
								// $scope.selectedSaleTargetItemsTooltip = obj2.de+ $scope.tempSaleItems[i].title + ";  ";
								$scope.selectedProducts.push(obj);
							}
						});
					});

					$scope.tempcustomer_arr = [];
					$scope.selectedGroups = [];

					angular.copy($rootScope.customer_arr, $scope.tempcustomer_arr);

					// console.log($rootScope.customer_arr);

					angular.forEach($scope.tempcustomer_arr, function (obj) {
						angular.forEach(res.data.response.targetCustomer, function (obj2) {
							// console.log(obj2);
							if (obj.id == obj2) {
								// $scope.selectedSaleTargetItemsTooltip = obj2.de+ $scope.tempSaleItems[i].title + ";  ";
								$scope.selectedGroups.push(obj);
							}
						});
					});

					// console.log($scope.selectedGroups);

					// $scope.selectedSaleTargetItemsTooltip = $scope.selectedSaleTargetItemsTooltip.slice(0, -2);

					/*  not related ones start*/

					angular.forEach($scope.arr_status, function (obj) {
						if (obj.value == res.data.response.status)
							$scope.rec.status = obj;
					});

					angular.forEach($scope.arr_type, function (obj) {
						if (obj.id == res.data.response.sale_type)
							$scope.rec.sale_type = obj;
					});



					/* $.each($scope.arr_target_uom, function (indx, obj) {
						if (obj.id == $scope.rec.target_uom) $scope.rec.target_uom = obj;
	
					}); */
					angular.forEach($rootScope.uni_prooduct_arr, function (obj) {
						if (obj.id == $scope.rec.target_uom)
							$scope.rec.target_uom = obj;
					});

					/* $.each($scope.arr_currency, function (index, elem) {
						if (elem.id == $scope.rec.currency_id) $scope.rec.currency_id = elem;
					}); */
					angular.forEach($rootScope.arr_currency, function (elem) {
						if (elem.id == $scope.rec.currency_id)
							$scope.rec.currency_id = elem;
					});

					/*  not related ones start*/

					// $scope.getSalePerson_for_each_group();

					// if ($scope.rec.product_promotion_type_id !== undefined) {

					// 	$scope.getProduct_sale_target_edit(res.data.response.id, $scope.rec.product_promotion_type_id.id);
					// 	$scope.getProducts(1, $scope.rec.product_promotion_type_id.id);
					// }

					// if ($scope.rec.target_type !== undefined) {

					// 	$scope.get_targettype_sale_target_edit(res.data.response.id, $scope.rec.target_type.id);
					// 	$scope.getGroups(1, $scope.rec.target_type.id);
					// }



					$scope.showdatac = false;

					if (res.data.response.comsion_status > 0)
						$scope.showdatac = true;

					$scope.showdatab = false;
					if (res.data.response.bonus_status > 0)
						$scope.showdatab = true;
				}
			});
	}

	$scope.showdatac = false;
	$scope.showdatab = false;

	$scope.update_main = function (rec) {

		$scope.showLoader = true;

		$scope.rec.selectedProducts = $scope.selectedProducts;
		$scope.rec.selectedExcludedProd = $scope.selectedExcludedProd;
		// $scope.rec.selectedGroups = $scope.selectedGroups;
		$scope.rec.selectedCustomers = $scope.selectedGroups;
		$scope.rec.selectedExcludedCUST = $scope.selectedExcludedCUST;

		$scope.rec.data_types = ($scope.rec.data_type != undefined && $scope.rec.data_type != '') ? $scope.rec.data_type.id : 0;
		$scope.rec.target_types = ($scope.rec.target_type != undefined && $scope.rec.target_type != '') ? $scope.rec.target_type.id : 0;
		$scope.rec.product_promotion_type_ids = ($scope.rec.product_promotion_type_id != undefined && $scope.rec.product_promotion_type_id != '') ? $scope.rec.product_promotion_type_id.id : 0;

		$scope.rec.commission_types = $scope.rec.commission_type;
		$scope.rec.bonus_types = $scope.rec.bonus_type;

		$scope.rec.statuss = ($scope.rec.status != undefined && $scope.rec.status != '') ? $scope.rec.status.value : 0;
		$scope.rec.sale_types = ($scope.rec.sale_type != undefined && $scope.rec.sale_type != '') ? $scope.rec.sale_type.id : 0;

		$scope.rec.fix_target_types = ($scope.rec.fix_target_type != undefined && $scope.rec.fix_target_type != '') ? $scope.rec.fix_target_type.id : 0;
		$scope.rec.target_uoms = ($scope.rec.target_uom != undefined && $scope.rec.target_uom != '') ? $scope.rec.target_uom.id : 0;
		$scope.rec.currency_ids = ($scope.rec.currency_id != undefined && $scope.rec.currency_id != '') ? $scope.rec.currency_id.id : 0;

		

		// console.log($scope.rec);

		if ($scope.rec.sale_code != undefined) {
			$scope.UpdateForm($scope.rec);
		}
		else {
			var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
			var name = $scope.$root.base64_encode('crm_sale_target');

			$http
				.post(getCodeUrl, {
					'token': $scope.$root.token,
					'tb': name,
					'category': '',
					'brand': ''
				})
				.then(function (res) {

					if (res.data.ack == 1) {
						$scope.rec.sale_code = res.data.code;
						$scope.UpdateForm($scope.rec);
					}
					else {
						$scope.showLoader = false;
						toaster.pop('error', 'info', res.data.error);
					}

					// if ($scope.rec.starting_date )
					

				}).catch(function (message) {
					$scope.showLoader = false;
					// toaster.pop('error', 'info', 'Server is not Acknowledging');
					throw new Error(message.data);
				});
		}
	}

	$scope.UpdateForm = function (rec) {

		var updateUrl = $scope.$root.sales + "customer/sale-target/add-sale-list";

		if ($scope.$root.sale_target_id > 0)
			var updateUrl = $scope.$root.sales + "customer/sale-target/update-sale-list";

		rec.token = $scope.$root.token;

		$http
			.post(updateUrl, rec)
			.then(function (res) {

				$scope.showLoader = false;

				if (res.data.ack == true) {
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					$scope.$root.sale_target_id = res.data.id;

					// 	if ($scope.isSalePerersonChanged)
					// 		$scope.add_linkto($scope.$root.sale_target_id);

					// 	if ($scope.isProductChanged)
					// 		$scope.add_Product_sale_target($scope.$root.sale_target_id, $scope.rec.product_promotion_type_id.id);

					// 	if ($scope.isregionChanged)
					// 		$scope.add_targettype_sale_target($scope.$root.sale_target_id, $scope.rec.target_type.id);

					// 	if ($scope.$root.sale_target_id === undefined)
					// 		$scope.add_sale_detail_from_target(res.data.id);
				}
				else toaster.pop('error', 'info', res.data.error);
			});
	}


	$scope.getSalePerson_single = function (arg) {

		$scope.title = 'Salesperson';
		$scope.SalesPersonGen_arr = [];
		$scope.columns_pr = [];
		$scope.record_pr = {};
		$scope.searchKeyword = {};
		$scope.empListType = 0;

		$scope.SalesPersonGen_arr = $rootScope.salesperson_arr;
		$scope.record_pr = $scope.SalesPersonGen_arr;
		// console.log($rootScope.salesperson_arr);

		angular.forEach($rootScope.salesperson_arr[0], function (val, index) {
			$scope.columns_pr.push({
				'title': toTitleCase(index),
				'field': index,
				'visible': true
			});
		});

		angular.element('#_SrmEmplisting_model').modal({ show: true });
	}

	$scope.confirm_employeeList = function (result, emptype) {

		if (emptype == 0) {
			$scope.rec.sale_person_name = result.name;
			$scope.rec.sale_person_id = result.id;
		}
		angular.element('#_SrmEmplisting_model').modal('hide');
	}

	/* $scope.getSalePerson_for_each_group = function () {

		$scope.record_salepersongroup = {};
		var getempUrl = $scope.$root.sales + "customer/sale-group/get-sale-group-list-by-group-id";

		var postData = {
			'token': $scope.$root.token,
			'g_id': $scope.rec.sale_person_id,
		};

		$http
			.post(getempUrl, postData)
			.then(function (res) {
				if (res.data.ack == true)
					$scope.record_salepersongroup = res.data.response;
			});
	} */


	//-----------------Products ,Category,Brand  ------------------------------------------

	$scope.isProductChanged = false;
	$scope.products = [];
	$scope.selectedProducts = [];
	$scope.arr_prod_promo_type = [];
	$scope.arr_prod_promo_type = [{ 'id': 3, name: 'Product' }, { id: 1, name: 'Category' }, { 'id': 2, name: 'Brand' }];
	//$scope.rec.product_promotion_type_id=$scope.arr_prod_promo_type[0];

	$scope.onProdChangeType = function (type) {

		$scope.products = [];
		$scope.selectedProducts = [];
		$scope.selectedProductsTooltip = "";
	}

	$scope.searchKeyword_product = {};
	$scope.getProducts = function (isShow, type, item_paging) {

		$scope.columns = [];
		$scope.columns_detail = [];
		$scope.columns_level = [];

		$scope.type = type;
		$scope.products = [];

		$scope.showLoader = true;

		if (type == undefined)
			var type = $scope.rec.product_promotion_type_id.id;

		if (type == 1) {
			$scope.title = 'Categories';
			$scope.searchKeyword_product = {};

			$scope.tempSaleItems = [];
			angular.copy($rootScope.cat_prodcut_arr, $scope.tempSaleItems);

			for (var i = 0; i < $scope.tempSaleItems.length; i++) {

				// if ($scope.tempSaleItems[i].chk)
				// 	$scope.tempSaleItems[i].disableCheck = 1;
				$scope.tempSaleItems[i].chk = false;

				angular.forEach($scope.selectedProducts, function (obj) {
					if (obj.id == $scope.tempSaleItems[i].id) {
						$scope.tempSaleItems[i].chk = 1;
						// $scope.tempSaleItems[i].disableCheck = 1;
					}
				});
			}
			$scope.showLoader = false;
			angular.element('#productModal2').modal({ show: true });
		}


		if (type == 2) {
			$scope.title = 'Brands';
			$scope.searchKeyword_product = {};

			$scope.tempSaleItems = [];
			angular.copy($rootScope.brand_prodcut_arr, $scope.tempSaleItems);

			for (var i = 0; i < $scope.tempSaleItems.length; i++) {

				// if ($scope.tempSaleItems[i].chk)
				// 	$scope.tempSaleItems[i].disableCheck = 1;
				$scope.tempSaleItems[i].chk = false;

				angular.forEach($scope.selectedProducts, function (obj) {
					if (obj.id == $scope.tempSaleItems[i].id) {
						$scope.tempSaleItems[i].chk = 1;
						// $scope.tempSaleItems[i].disableCheck = 1;
					}
				});
			}
			$scope.showLoader = false;
			angular.element('#productModal2').modal({ show: true });
		}


		if (type == 3) {
			$scope.title = 'Products';
			// var postUrl = $scope.$root.sales + "stock/products-listing/get-all-products";

			$scope.filterPurchaseItem = {};

			$rootScope.updateSelectedGlobalData("item");
			$scope.tempProdArr = [];
			angular.copy($rootScope.prooduct_arr, $scope.tempProdArr);

			for (var i = 0; i < $scope.tempProdArr.length; i++) {

				/* if ($scope.tempProdArr[i].chk)
					$scope.tempProdArr[i].disableCheck = 1; */
				$scope.tempProdArr[i].chk = false;

				angular.forEach($scope.selectedProducts, function (obj) {
					if (obj.id == $scope.tempProdArr[i].id) {
						$scope.tempProdArr[i].chk = 1;
						// $scope.tempProdArr[i].disableCheck = 1;
					}
				});
			}
			$scope.showLoader = false;

			angular.element('#productModal').modal({ show: true });
		}
	}

	/* Start Category, Brand selection */

	$scope.PendingSelectedSaleTargetItems = [];

	$scope.checkedSaleTargetItem = function (priceitem) {
		$scope.selectedAllSaleTargetItem = false;

		for (var i = 0; i < $scope.tempSaleItems.length; i++) {

			if (priceitem == $scope.tempSaleItems[i].id) {
				if ($scope.tempSaleItems[i].chk == true)
					$scope.tempSaleItems[i].chk = false;
				else
					$scope.tempSaleItems[i].chk = true;
			}
		}
	}

	$scope.checkAllSaleTargetItem = function (val) {
		$scope.PendingSelectedSaleTargetItems = [];

		if (val == true) {
			angular.forEach($scope.tempSaleItems, function (obj) {

				obj.chk = false;
				$scope.PendingSelectedSaleTargetItems.push(obj);
			});
		} else {
			angular.forEach($scope.tempSaleItems, function (obj) {
				if (!obj.disableCheck)
					obj.chk = false;
			});
			$scope.PendingSelectedSaleTargetItems = [];
		}
	}

	$scope.clearPendingSaleTargetItems = function () {
		$scope.PendingSelectedSaleTargetItems = [];
		angular.element('#productModal2').modal('hide');
	}

	$scope.addSaleTargetItems = function () {

		$scope.PendingSelectedSaleTargetItems = [];
		$scope.selectedSaleTargetItemsTooltip = "";

		for (var i = 0; i < $scope.tempSaleItems.length; i++) {

			if ($scope.tempSaleItems[i].chk == true) {
				$scope.PendingSelectedSaleTargetItems.push($scope.tempSaleItems[i]);
				$scope.selectedSaleTargetItemsTooltip = $scope.selectedSaleTargetItemsTooltip + $scope.tempSaleItems[i].title + ";  ";
			}
		}

		$scope.selectedSaleTargetItemsTooltip = $scope.selectedSaleTargetItemsTooltip.slice(0, -2);
		$scope.selectedProducts = $scope.PendingSelectedSaleTargetItems;
		angular.element('#productModal2').modal('hide');
	}

	/* End Category, Brand selection */

	/* Start product selection */

	$scope.PendingSelectedPurchaseItems = [];


	$scope.checkedPurchaseItem = function (priceitem) {
		$scope.selectedAllPurchaseItem = false;

		for (var i = 0; i < $scope.tempProdArr.length; i++) {

			if (priceitem == $scope.tempProdArr[i].id) {
				if ($scope.tempProdArr[i].chk == true)
					$scope.tempProdArr[i].chk = false;
				else
					$scope.tempProdArr[i].chk = true;
			}
		}
	}

	$scope.checkAllPurchaseItem = function (val, category, brand, unit) {
		$scope.PendingSelectedPurchaseItems = [];

		if (val == true) {
			angular.forEach($scope.tempProdArr, function (obj) {

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
				$scope.PendingSelectedPurchaseItems.push(obj);
			});
		} else {
			angular.forEach($scope.tempProdArr, function (obj) {
				if (!obj.disableCheck)
					obj.chk = false;
			});
			$scope.PendingSelectedPurchaseItems = [];
		}
	}

	$scope.clearPendingPurchaseItems = function () {
		$scope.PendingSelectedPurchaseItems = [];
		angular.element('#productModal').modal('hide');
	}

	$scope.addProduct = function () {

		$scope.PendingSelectedPurchaseItems = [];
		$scope.selectedProductsTooltip = "";

		for (var i = 0; i < $scope.tempProdArr.length; i++) {

			if ($scope.tempProdArr[i].chk == true) {
				$scope.PendingSelectedPurchaseItems.push($scope.tempProdArr[i]);
				$scope.selectedProductsTooltip = $scope.selectedProductsTooltip + $scope.tempProdArr[i].description + "(" + $scope.tempProdArr[i].product_code + ");  ";
			}
		}

		$scope.selectedProductsTooltip = $scope.selectedProductsTooltip.slice(0, -2);
		$scope.selectedProducts = $scope.PendingSelectedPurchaseItems;
		angular.element('#productModal').modal('hide');
	}


	/* End product selection */

	$scope.selectedExcludedProd = [];

	$scope.monthLookup = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov"];
	$scope.generateTargetGraph = function () {
		var updateUrl = $scope.$root.sales + "customer/customer/generate-graph-for-targets";
		var myChart = {};
		var rec2 = {};
		var today = new Date();
		$scope.actualValues = Array(12);
		$scope.targetValues = Array(12);
		var revenue = "1." + $scope.rec.increment;
		$scope.targetsChk = false;
	// 	$scope.showLoader = true;
		var targetDateObj = new Date($scope.rec.starting_date.replace( /(\d{2})\/(\d{2})\/(\d{4})/, "$3/$2/$1"));
		
		// if (convertedDate.getMonth() > today.getMonth()){
		// 	toaster.pop('error', 'info', 'Start Month must be in past');
		// 	return;	
		// }


		rec2.token = $scope.$root.token;
		rec2.selectItems = $scope.selectedProducts;
		rec2.salesperson_id = $scope.rec.sale_person_id;
		// historicTargetDateObj.setDate(targetDateObj.getFullYear() - 1);
		rec2.starting_date = targetDateObj.getTime() / 1000;
		rec2.interval = today.getMonth() - targetDateObj.getMonth() + 1;
		$http.post(updateUrl, rec2)
			.then(function (res) {

				if (res.data.ack == true) {
					for (var i = 0; i < 12; i++) {
						$scope.actualValues[i] = 0;
						$scope.targetValues[i] = 0;
					}

					var formattedDate = $scope.rec.starting_date.split("/");
					$scope.month = formattedDate[1];

					res.data.response.forEach(function (total) {
						var index = total.Month - $scope.month;
						index = index < 0 ? 12 + index : index;
						// $scope.actualValues[index] = Number(total.Value);
						$scope.targetValues[index] = Number(total.Value) * Number(revenue);
					});

					res.data.response2.forEach(function (total) {
						var index = total.Month - $scope.month;
						index = index < 0 ? 12 + index : index;
						$scope.actualValues[index] = Number(total.Value);
						// $scope.targetValues[index] = Number(total.Value) * Number(revenue);
					});

					$scope.monthSeries = [];

					for (var i = 0; i < 12; i++) {
						$scope.monthSeries.push($scope.month % 12);
						$scope.month++;
					}

					$scope.targetValues = $scope.targetValues.map(function (elem) {
						return Math.round(elem);
					});

					myChartObj.data.datasets[0].data = $scope.targetValues;
					myChartObj.data.datasets[1].data = $scope.actualValues;

					myChartObj.data.labels = $scope.monthSeries.map(function (index) {
						return $scope.monthLookup[index];
					});

					console.log(myChartObj);
					var ctx = document.getElementById("myChartJs").getContext('2d');
					var myChart = new Chart(ctx, myChartObj);
					$scope.dataSets = myChart.config.data.datasets;
					console.log(myChart);

					$scope.updateChart = function () {
						myChart.update();
					}
					
					$scope.targetsChk = true;
				}
				else {
					toaster.pop('error', 'info', 'No Data found');
				}
			})
			.catch(function (error) {
				alert('Error In Generate Target: ', error);
			});
	}
	var todaysDate = new Date();
	var todaysMonth = (todaysDate.getMonth() + 1) % 12;

	var myChartObj = {
		type: 'bar',
		data: {
			datasets: [{
				label: 'Targets',
				data: [],
				fill: true,
				backgroundColor: "#41c4ff",
				borderWidth: 0,
				hoverBackgroundColor: '#04a9f4',
			},
			{
				label: 'Actual',
				data: [],
				fill: true,
				barBorderRadius: 10,
				backgroundColor: "#5dd662",
				borderWidth: 0,
				hoverBackgroundColor: '#4aab4e',
			}]
		},
		options: {
			scales: {
				xAxes: [{
					gridLines: {
						display: false,
					},
					stacked: false,
				}],
				yAxes: [{
					gridLines: {
						display: true,
					},
					ticks: {
						beginAtZero: true
					},
					stacked: false
				}],
			},
			tooltips: {
				cornerRadius: 0,
			},
			annotation: {
				annotations: [
					{
						type: "line",
						mode: "vertical",
						scaleID: "x-axis-0",
						value: $scope.monthLookup[todaysMonth],
						borderColor: "red",
						borderWidth: 2,
						label: {
							enabled: true,
							position: "top"
						}
					}
				]
			},
			legend: {
				display: true,
			}
		}

	};

	

	// $scope.generateTarget = function (rec) {
	// 	// console.log(sale_person_id);
	// 	var rec2 = {};
	// 	rec2.token = $scope.$root.token;
	// 	rec2.sale_person_id = rec.sale_person_id;


	// 	rec2.data_type_id = (rec.data_type != undefined && rec.data_type != '') ? rec.data_type.id : 0;
	// 	rec2.productType = (rec.product_promotion_type_id != undefined && rec.product_promotion_type_id != '') ? rec.product_promotion_type_id.id : 0;
	// 	rec2.customerType = (rec.target_type != undefined && rec.target_type != '') ? rec.target_type.id : 0;

	// 	if (rec2.data_type_id > 0) {

	// 		if (rec2.data_type_id == 1) {
	// 			console.log($scope.selectedProducts.length);

	// 			if (!($scope.selectedProducts.length > 0) && rec2.productType > 0) {
	// 				if (rec2.productType == 3) {
	// 					toaster.pop('error', 'info', 'Select Products First!');
	// 					return;
	// 				}
	// 				else if (rec2.productType == 2) {
	// 					toaster.pop('error', 'info', 'Select Brands First!');
	// 					return;
	// 				}
	// 				else if (rec2.productType == 1) {
	// 					toaster.pop('error', 'info', 'Select Categories First!');
	// 					return;
	// 				}
	// 			}
	// 			else if (!(rec2.productType > 0)) {
	// 				toaster.pop('error', 'info', 'Select Product Type First!');
	// 				return;
	// 			}

	// 			if (rec2.productType == 3) {
	// 				rec2.targetType = (rec.fix_target_type != undefined && rec.fix_target_type != '') ? rec.fix_target_type.id : 0;

	// 				if (!(rec2.targetType > 0)) {
	// 					toaster.pop('error', 'info', 'Target Type is not Selected!');
	// 					return;
	// 				}
	// 			}

	// 		} else if (rec2.data_type_id == 2) {

	// 			if (!($scope.selectedGroups.length > 0) && rec2.customerType > 0) {

	// 				if (rec2.customerType == 4) {
	// 					toaster.pop('error', 'info', 'Select Region First!');
	// 					return;
	// 				}
	// 				else if (rec2.customerType == 5) {
	// 					toaster.pop('error', 'info', 'Select Segment First!');
	// 					return;
	// 				}
	// 				else if (rec2.customerType == 6) {
	// 					toaster.pop('error', 'info', 'Select Buying Group First!');
	// 					return;
	// 				}
	// 				else if (rec2.customerType == 7) {
	// 					toaster.pop('error', 'info', 'Select Customers First!');
	// 					return;
	// 				}
	// 			}
	// 			else if (!(rec2.customerType > 0)) {
	// 				toaster.pop('error', 'info', 'Select Customer Type First!');
	// 				return;
	// 			}

	// 		} else if (rec2.data_type_id == 3) {

	// 			if (!($scope.selectedGroups.length > 0) && rec2.customerType > 0) {

	// 				if (rec2.customerType == 4) {
	// 					toaster.pop('error', 'info', 'Select Region First!');
	// 					return;
	// 				}
	// 				else if (rec2.customerType == 5) {
	// 					toaster.pop('error', 'info', 'Select Segment First!');
	// 					return;
	// 				}
	// 				else if (rec2.customerType == 6) {
	// 					toaster.pop('error', 'info', 'Select Buying Group First!');
	// 					return;
	// 				}
	// 				else if (rec2.customerType == 7) {
	// 					toaster.pop('error', 'info', 'Select Customers First!');
	// 					return;
	// 				}
	// 			}
	// 			else if (!(rec2.customerType > 0)) {
	// 				toaster.pop('error', 'info', 'Select Customer Type First!');
	// 				return;
	// 			}

	// 			if (!($scope.selectedProducts.length > 0) && rec2.productType > 0) {
	// 				if (rec2.productType == 3) {
	// 					toaster.pop('error', 'info', 'Select Products First!');
	// 					return;
	// 				}
	// 				else if (rec2.productType == 2) {
	// 					toaster.pop('error', 'info', 'Select Brands First!');
	// 					return;
	// 				}
	// 				else if (rec2.productType == 1) {
	// 					toaster.pop('error', 'info', 'Select Categories First!');
	// 					return;
	// 				}
	// 			}
	// 			else if (!(rec2.productType > 0)) {
	// 				toaster.pop('error', 'info', 'Select Product Type First!');
	// 				return;
	// 			}

	// 			if (rec2.productType == 3) {
	// 				rec2.targetType = (rec.fix_target_type != undefined && rec.fix_target_type != '') ? rec.fix_target_type.id : 0;

	// 				if (!(rec2.targetType > 0)) {
	// 					toaster.pop('error', 'info', 'Target Type is not Selected!');
	// 					return;
	// 				}
	// 			}
	// 		}
	// 	}
	// 	else {
	// 		toaster.pop('error', 'info', 'Select Data Type First!');
	// 		return;
	// 	}

	// 	rec2.selectedProducts = [];
	// 	rec2.selectedExcludedProd = [];
	// 	rec2.selectedGroups = [];
	// 	rec2.selectedExcludedCUST = [];

	// 	angular.forEach($scope.selectedProducts, function (obj) {
	// 		rec2.selectedProducts.push(obj.id);
	// 	});

	// 	angular.forEach($scope.selectedExcludedProd, function (obj) {
	// 		rec2.selectedExcludedProd.push(obj.id);
	// 	});

	// 	angular.forEach($scope.selectedGroups, function (obj) {
	// 		rec2.selectedGroups.push(obj.id);
	// 	});

	// 	angular.forEach($scope.selectedExcludedCUST, function (obj) {
	// 		rec2.selectedExcludedCUST.push(obj.id);
	// 	});

	// 	// rec2.selectedProducts = $scope.selectedProducts;
	// 	// rec2.selectedExcludedProd = $scope.selectedExcludedProd;
	// 	// rec2.selectedGroups = $scope.selectedGroups;
	// 	// rec2.selectedExcludedCUST = $scope.selectedExcludedCUST;

	// 	var increment = rec.increment;
	// 	$scope.showLoader = true;

	// 	$scope.rec.amountArray = [];
	// 	$scope.rec.monthArray = [];
	// 	$scope.rec.incrementedAmountArray = [];

	// 	var getYearlySpread = $scope.$root.sales + "customer/sale-target/generate-target";

	// 	$http
	// 		.post(getYearlySpread, rec2)
	// 		.then(function (res) {

	// 			$scope.showLoader = false;

	// 			if (res.data.ack == true) {
	// 				console.log(res.data.response);

	// 				angular.forEach(res.data.response, function (obj) {

	// 					var result = (parseFloat(increment) / 100) * parseFloat(obj.grand_total);

	// 					$scope.rec.amountArray.push(obj.grand_total);
	// 					$scope.rec.monthArray.push(obj.reqMonth);

	// 					var incrementvalue = parseFloat(obj.grand_total) + parseFloat(result);
	// 					$scope.rec.incrementedAmountArray.push(parseFloat(incrementvalue).toFixed(2));
	// 				});

	// 				console.log($scope.rec.amountArray);
	// 				console.log($scope.rec.monthArray);
	// 				console.log($scope.rec.incrementedAmountArray);
	// 			}
	// 			else toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));
	// 		});
	// }

	$scope.clearDataTypeArray = function (dataType) {
		// console.log(dataType);
		if (dataType == 1) {
			$scope.selectedGroups = [];
			$scope.selectedExcludedCUST = [];
			$scope.rec.target_type = '';
			$scope.rec.selectedCustomerGroupTooltip = '';
			$scope.rec.selectedExcludedCUSTTooltip = '';
		}
		else if (dataType == 2) {
			$scope.selectedProducts = [];
			$scope.selectedExcludedProd = [];
			$scope.rec.product_promotion_type_id = '';
			$scope.rec.selectedProductsTooltip = '';
			$scope.rec.selectedSaleTargetItemsTooltip = '';
			$scope.rec.selectedExcludedProdTooltip = '';
		}
	}

	/* Start Excluded product selection */

	$scope.getExcludedProd = function () {
		$scope.showLoader = true;

		$scope.title = 'Products';
		$scope.filterPurchaseItem = {};

		console.log($scope.selectedProducts.length);
		console.log($scope.rec.product_promotion_type_id.id);

		if ($scope.rec.product_promotion_type_id.id == 1 && $scope.selectedProducts.length < 1) {
			toaster.pop('error', 'Info', 'Select categories first!');
			$scope.showLoader = false;
			return;
		}

		if ($scope.rec.product_promotion_type_id.id == 2 && $scope.selectedProducts.length < 1) {
			toaster.pop('error', 'Info', 'Select brands first!');
			$scope.showLoader = false;
			return;
		}

		console.log($scope.selectedProducts);
		// console.log($rootScope.prooduct_arr);

		$rootScope.updateSelectedGlobalData("item");
		$scope.tempExcludedProd = [];

		if ($scope.rec.product_promotion_type_id.id == 1)
			angular.copy($rootScope.prooduct_arr, $scope.tempExcludedProd);

		// $scope.tempExcludedProd = $scope.tempExcludedProd | filterMultiple : ({ 'category_id':$scope.selectedProducts });

		console.log($scope.tempExcludedProd);
		$scope.showLoader = false;
		return false;


		for (var i = 0; i < $scope.tempExcludedProd.length; i++) {

			/* if ($scope.tempExcludedProd[i].chk)
				$scope.tempExcludedProd[i].disableCheck = 1; */
			$scope.tempExcludedProd[i].chk = false;

			angular.forEach($scope.selectedExcludedProd, function (obj) {
				if (obj.id == $scope.tempExcludedProd[i].id) {
					$scope.tempExcludedProd[i].chk = 1;
					// $scope.tempExcludedProd[i].disableCheck = 1;
				}
			});
		}
		$scope.showLoader = false;
		angular.element('#excludedProdModal').modal({ show: true });
	}

	$scope.PendingSelectedExcludedProd = [];


	$scope.checkedExcludedProd = function (priceitem) {
		$scope.selectedAllPurchaseItem = false;

		for (var i = 0; i < $scope.tempExcludedProd.length; i++) {

			if (priceitem == $scope.tempExcludedProd[i].id) {
				if ($scope.tempExcludedProd[i].chk == true)
					$scope.tempExcludedProd[i].chk = false;
				else
					$scope.tempExcludedProd[i].chk = true;
			}
		}
	}

	$scope.checkAllExcludedProd = function (val, category, brand, unit) {
		$scope.PendingSelectedExcludedProd = [];

		if (val == true) {
			angular.forEach($scope.tempExcludedProd, function (obj) {

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

				$scope.PendingSelectedExcludedProd.push(obj);
			});
		} else {
			angular.forEach($scope.tempExcludedProd, function (obj) {
				if (!obj.disableCheck)
					obj.chk = false;
			});
			$scope.PendingSelectedExcludedProd = [];
		}
	}

	$scope.clearPendingExcludedProd = function () {
		$scope.PendingSelectedExcludedProd = [];
		angular.element('#excludedProdModal').modal('hide');
	}

	$scope.addExcludedProd = function () {

		$scope.PendingSelectedExcludedProd = [];
		$scope.selectedExcludedProdTooltip = "";

		for (var i = 0; i < $scope.tempExcludedProd.length; i++) {

			if ($scope.tempExcludedProd[i].chk == true) {
				$scope.PendingSelectedExcludedProd.push($scope.tempExcludedProd[i]);
				$scope.selectedExcludedProdTooltip = $scope.selectedExcludedProdTooltip + $scope.tempExcludedProd[i].description + "(" + $scope.tempExcludedProd[i].product_code + ");  ";
			}
		}

		$scope.selectedExcludedProdTooltip = $scope.selectedExcludedProdTooltip.slice(0, -2);
		$scope.selectedExcludedProd = $scope.PendingSelectedExcludedProd;
		angular.element('#excludedProdModal').modal('hide');
	}

	/* Start Excluded product selection */

	//------------ Select Customer Region Segment------------------------------------------------

	$scope.isregionChanged = false;
	$scope.arr_regions = [];
	$scope.selectedGroups = [];
	$scope.selectedExcludedCUST = [];
	$scope.arr_sale_type = [];
	$scope.arr_sale_type = [{ 'id': 7, name: 'Customer Specific' }, { id: 4, name: 'Region' }, { 'id': 5, name: 'Segment' }, { 'id': 6, name: 'Buying Group' }];
	//$scope.rec.target_type=$scope.arr_sale_type[0];

	$scope.onChangeType = function (type) {
		$scope.arr_regions = [];
		$scope.selectedGroups = [];
		$scope.arr_regions_all_detail = [];
		$scope.selectedGroups_detail = [];
	}


	$scope.getGroups = function (isShow, type, item_paging) {

		$scope.columns = [];
		$scope.columns_detail = [];
		$scope.columns_rg_level = [];
		$scope.arr_regions = [];
		$scope.customerGroup = [];

		if (type == undefined)
			var type = $scope.rec.target_type.id;

		$scope.showLoader = true;
		$scope.searchKeyword_target = {};
		$scope.ret_postData = {};

		if (type == 4) {
			$scope.title = 'Region';
			$scope.ret_postData = $rootScope.region_customer_arr;

			angular.forEach($scope.ret_postData, function (obj) {
				obj.chk = false;

				if ($scope.selectedGroups.length > 0) {
					angular.forEach($scope.selectedGroups, function (obj2) {
						if (obj.id == obj2.id) {
							obj.chk = true;
						}
					});
				}
				$scope.customerGroup.push(obj);
			});
			$scope.showLoader = false;

			angular.element('#groupInfoModal').modal({ show: true });
		}

		if (type == 5) {
			$scope.title = 'Segment';
			$scope.ret_postData = $rootScope.segment_customer_arr;

			angular.forEach($scope.ret_postData, function (obj) {
				obj.chk = false;

				if ($scope.selectedGroups.length > 0) {
					angular.forEach($scope.selectedGroups, function (obj2) {
						if (obj.id == obj2.id) {
							obj.chk = true;
						}
					});
				}
				$scope.customerGroup.push(obj);
			});
			$scope.showLoader = false;

			angular.element('#groupInfoModal').modal({ show: true });
		}

		if (type == 6) {
			$scope.title = 'Buying Group';
			$scope.ret_postData = $rootScope.bying_group_customer_arr;

			angular.forEach($scope.ret_postData, function (obj) {
				obj.chk = false;

				if ($scope.selectedGroups.length > 0) {
					angular.forEach($scope.selectedGroups, function (obj2) {
						if (obj.id == obj2.id) {
							obj.chk = true;
						}
					});
				}
				$scope.customerGroup.push(obj);
			});
			$scope.showLoader = false;
			angular.element('#groupInfoModal').modal({ show: true });
		}

		if (type == 7) {
			$scope.title = 'Customer Specific';
			$scope.ret_postData = $rootScope.customer_arr;

			angular.forEach($scope.ret_postData, function (obj) {
				obj.chk = false;

				if ($scope.selectedGroups.length > 0) {
					angular.forEach($scope.selectedGroups, function (obj2) {
						if (obj.id == obj2.id) {
							obj.chk = true;
						}
					});
				}
				$scope.customerGroup.push(obj);
			});
			$scope.showLoader = false;
			angular.element('#groupInfoModal').modal({ show: true });
		}
	}

	$scope.PendingSelectedCustomerGroup = [];

	$scope.checkedCustomerGroup = function (priceitem) {
		$scope.selectedAllCustomerGroup = false;

		for (var i = 0; i < $scope.customerGroup.length; i++) {

			if (priceitem == $scope.customerGroup[i].id) {
				if ($scope.customerGroup[i].chk == true)
					$scope.customerGroup[i].chk = false;
				else
					$scope.customerGroup[i].chk = true;
			}
		}
	}

	$scope.checkAllCustomerGroup = function (val) {
		$scope.PendingSelectedCustomerGroup = [];

		if (val == true) {
			angular.forEach($scope.customerGroup, function (obj) {
				obj.chk = true;
				$scope.PendingSelectedCustomerGroup.push(obj);
			});
		} else {
			angular.forEach($scope.customerGroup, function (obj) {
				if (!obj.disableCheck)
					obj.chk = false;
			});
			$scope.PendingSelectedCustomerGroup = [];
		}
	}

	$scope.clearPendingcustomerGroup = function () {
		$scope.PendingSelectedCustomerGroup = [];
		angular.element('#groupInfoModal').modal('hide');
	}

	$scope.addSalecustomerGroup = function () {

		$scope.PendingSelectedCustomerGroup = [];
		$scope.selectedCustomerGroupTooltip = "";

		if ($scope.rec.target_type.id == 7) {

			for (var i = 0; i < $scope.customerGroup.length; i++) {

				if ($scope.customerGroup[i].chk == true) {
					$scope.PendingSelectedCustomerGroup.push($scope.customerGroup[i]);
					$scope.selectedCustomerGroupTooltip = $scope.selectedCustomerGroupTooltip + $scope.customerGroup[i].name + "(" + $scope.customerGroup[i].customer_code + ");  ";
				}
			}
		} else {
			for (var i = 0; i < $scope.customerGroup.length; i++) {

				if ($scope.customerGroup[i].chk == true) {
					$scope.PendingSelectedCustomerGroup.push($scope.customerGroup[i]);
					$scope.selectedCustomerGroupTooltip = $scope.selectedCustomerGroupTooltip + $scope.customerGroup[i].title;
				}
			}
		}

		$scope.selectedCustomerGroupTooltip = $scope.selectedCustomerGroupTooltip.slice(0, -2);
		$scope.selectedGroups = $scope.PendingSelectedCustomerGroup;
		angular.element('#groupInfoModal').modal('hide');
	}

	/* Start Excluded Customer */

	$scope.getExcludedCust = function () {

		$scope.excludedCUST = [];

		$scope.showLoader = true;
		$scope.searchKeyword_target = {};
		$scope.ret_postData = [];

		$scope.title = 'Exclude Customer(s)';
		$scope.ret_postData = $rootScope.customer_arr;

		angular.forEach($scope.ret_postData, function (obj) {
			obj.chk = false;

			if ($scope.selectedExcludedCUST.length > 0) {
				angular.forEach($scope.selectedExcludedCUST, function (obj2) {
					if (obj.id == obj2.id) {
						obj.chk = true;
					}
				});
			}
			$scope.excludedCUST.push(obj);
		});

		$scope.showLoader = false;
		angular.element('#excludedCustModal').modal({ show: true });
	}

	$scope.PendingSelectedExcludedCUST = [];

	$scope.checkedExcludedCust = function (priceitem) {
		$scope.selectedAllExcludedCust = false;

		for (var i = 0; i < $scope.excludedCUST.length; i++) {

			if (priceitem == $scope.excludedCUST[i].id) {
				if ($scope.excludedCUST[i].chk == true)
					$scope.excludedCUST[i].chk = false;
				else
					$scope.excludedCUST[i].chk = true;
			}
		}
	}

	$scope.checkAllExcludedCust = function (val) {
		$scope.PendingSelectedExcludedCUST = [];

		if (val == true) {
			angular.forEach($scope.excludedCUST, function (obj) {
				obj.chk = true;
				$scope.PendingSelectedExcludedCUST.push(obj);
			});
		} else {
			angular.forEach($scope.excludedCUST, function (obj) {
				if (!obj.disableCheck)
					obj.chk = false;
			});
			$scope.PendingSelectedExcludedCUST = [];
		}
	}

	$scope.clearPendingExcludedCust = function () {
		$scope.PendingSelectedExcludedCUST = [];
		angular.element('#excludedCustModal').modal('hide');
	}

	$scope.addSaleExcludedCust = function () {

		$scope.PendingSelectedExcludedCUST = [];
		$scope.selectedExcludedCUSTTooltip = "";

		for (var i = 0; i < $scope.excludedCUST.length; i++) {

			if ($scope.excludedCUST[i].chk == true) {
				$scope.PendingSelectedExcludedCUST.push($scope.excludedCUST[i]);
				$scope.selectedExcludedCUSTTooltip = $scope.selectedExcludedCUSTTooltip + $scope.excludedCUST[i].name + "(" + $scope.excludedCUST[i].customer_code + ");  ";
			}
		}

		$scope.selectedExcludedCUSTTooltip = $scope.selectedExcludedCUSTTooltip.slice(0, -2);
		$scope.selectedExcludedCUST = $scope.PendingSelectedExcludedCUST;
		angular.element('#excludedCustModal').modal('hide');
	}

	/* End Excluded Customer */


	/* Start Equal Spread */

	$scope.setEqualSpread = function () {
		//console.log(frequency_id);

		/* if (frequency_id != $scope.rec.dbFrequencyID) {
			$scope.rec.equalSpread = 0;
			// if (!$scope.rec.equalSpread > 0)
		} */

		/* if (frequency_id == 1) {
	
			$scope.title = "Frequency (Annual)";
			$scope.rec.firstquartermonth = $scope.rec.secondquartermonth = $scope.rec.thirdquartermonth = "";
			// $scope.EnableSpread = false;
	
		} else if (frequency_id == 2) {
	
			$scope.title = "Frequency ( Quarterly)"; */

		$scope.title = "Frequency Spread";

		// $scope.rec.monthlySpreadArr.January = $scope.rec.monthlySpreadArr.February = $scope.rec.monthlySpreadArr.March =
		// 	$scope.rec.monthlySpreadArr.April = $scope.rec.monthlySpreadArr.May = $scope.rec.monthlySpreadArr.June =
		// 	$scope.rec.monthlySpreadArr.July = $scope.rec.monthlySpreadArr.August = $scope.rec.monthlySpreadArr.September =
		// 	$scope.rec.monthlySpreadArr.October = $scope.rec.monthlySpreadArr.November = $scope.rec.monthlySpreadArr.December = "";

		// $scope.EnableSpread = false;

		//}

		if (!(Number($scope.rec.target_amount) > 0)) {
			toaster.pop('error', 'Info', 'Please input Amount. ');
			return;
		}

		angular.element('#saleTargetFrequencyModal').modal({
			show: true
		});
	}

	$scope.addSpreadFrequency = function (rec) {
		console.log(rec);

		/* if (angular.element('#equalSpread').is(':checked') == false)
		   rec.equalSpread = 0; */

		var totalFrequency = Number(rec.monthlySpreadArr.January) +
			Number(rec.monthlySpreadArr.February) +
			Number(rec.monthlySpreadArr.March) +
			Number(rec.monthlySpreadArr.April) +
			Number(rec.monthlySpreadArr.May) +
			Number(rec.monthlySpreadArr.June) +
			Number(rec.monthlySpreadArr.July) +
			Number(rec.monthlySpreadArr.August) +
			Number(rec.monthlySpreadArr.September) +
			Number(rec.monthlySpreadArr.October) +
			Number(rec.monthlySpreadArr.November) +
			Number(rec.monthlySpreadArr.December);

		console.log(totalFrequency);

		if (totalFrequency.toFixed(1) != Number($scope.rec.converted_price).toFixed(1)) {

			toaster.pop('error', 'Info', 'Frequency total must be equal to Forecast Local Currency Amount. ');
			return;

		} else {
			rec.startmonths = $scope.start_month;
			// $scope.rec = rec;
			$scope.EnableSpread = true;
			angular.element('#saleTargetFrequencyModal').modal('hide');
			console.log($scope.rec);
		}
	}

	$scope.toggleEqualSpread = function (equalSpread) {
		if (equalSpread == true)
			$scope.rec.equalSpread = 0;
	}

	$scope.changesaleTargetMonthSequence = function () {
		$scope.start_month = $scope.rec.startmonth.id;
	}

	$scope.equalSpreadFrequency = function (equalSpread) {
		//console.log(equalSpread);
		if (equalSpread == true) {

			$scope.rec.monthlySpreadArr.January = $scope.rec.monthlySpreadArr.February =
				$scope.rec.monthlySpreadArr.March = $scope.rec.monthlySpreadArr.April =
				$scope.rec.monthlySpreadArr.May = $scope.rec.monthlySpreadArr.June =
				$scope.rec.monthlySpreadArr.July = $scope.rec.monthlySpreadArr.August =
				$scope.rec.monthlySpreadArr.September = $scope.rec.monthlySpreadArr.October =
				$scope.rec.monthlySpreadArr.November = $scope.rec.monthlySpreadArr.December =
				parseFloat(($scope.rec.converted_price / 12).toFixed(2));

		} else {

			$scope.rec.monthlySpreadArr.January = $scope.rec.monthlySpreadArr.February =
				$scope.rec.monthlySpreadArr.March = $scope.rec.monthlySpreadArr.April =
				$scope.rec.monthlySpreadArr.May = $scope.rec.monthlySpreadArr.June =
				$scope.rec.monthlySpreadArr.July = $scope.rec.monthlySpreadArr.August =
				$scope.rec.monthlySpreadArr.September = $scope.rec.monthlySpreadArr.October =
				$scope.rec.monthlySpreadArr.November = $scope.rec.monthlySpreadArr.December = "";
		}
	}


	/* End Equal Spread */

	//--------------------   Commission -------------------

	$scope.array_submit_comision = {};
	$scope.discount_type_array = {};
	$scope.discount_type_array = [{ value: '1', name: 'Value' }, { value: '2', name: 'Percentage' }];
	$scope.sale_type_array = {};
	$scope.sale_type_array = [{ value: '1', name: 'Amount' }, { value: '2', name: 'Quantity' }];

	$scope.type_define = 0;
	$scope.show_popup_commision = function (type, target_type) {

		$scope.type_define = type;
		$scope.comsion_target_type = false;
		$scope.bonus_target_type = false;

		if (target_type == undefined) {
			toaster.pop('error', 'info', 'First Select sale target type!');
			return;
		}

		var add = '';
		if ($scope.type_define == 3 || $scope.type_define == 5 || $scope.type_define == 4 || $scope.type_define == 6)
			add = 'Additional';

		if ($scope.type_define == 1 || $scope.type_define == 3 || $scope.type_define == 5) {
			$scope.title = add + 'Commission';
			$scope.comsion_target_type = true;
			$scope.bonus_target_type = false;
		}
		else if ($scope.type_define == 2 || $scope.type_define == 4 || $scope.type_define == 6) {
			$scope.title = add + 'Bonus';
			$scope.comsion_target_type = false;
			$scope.bonus_target_type = true;
		}

		$scope.get_commision_data($scope.type_define);
		$('#comision_pop').modal({ show: true });
	}

	$scope.get_commision_data = function (type) {

		$scope.array_submit_comision = {};
		if (type == 1 || type == 2)
			var mid = $scope.$root.sale_target_id;
		else if (type == 3 || type == 4)
			var mid = $scope.altContactMediaForm.id;
		else if (type == 5 || type == 6)
			var mid = $scope.formDatalevel.id;

		$scope.get_privous_data(type, mid);

		var postData = {
			'token': $scope.$root.token,
			'type': type,
			'module_id': mid
		};
		var getexpUrl = $scope.$root.sales + "customer/sale-target/get-sale-comision";
		$http
			.post(getexpUrl, postData)
			.then(function (res) {
				$scope.array_commision = {};
				if (res.data.ack == true) {
					$scope.array_commision = res.data.response;

					angular.forEach($scope.array_commision, function (obj_rec) {

						obj_rec.id = obj_rec.id;
						obj_rec.discount_value = obj_rec.discount_value;
						obj_rec.value_from = obj_rec.value_from;
						obj_rec.value_to = obj_rec.value_to;

						angular.forEach($scope.discount_type_array, function (obj) {
							if (obj.value == obj_rec.discount_type)
								obj_rec.discount_type = obj;
						});

						angular.forEach($scope.sale_type_array, function (obj) {
							if (obj.value == obj_rec.sale_type)
								obj_rec.sale_type = obj;
						});
					});
				}
			});
	}

	$scope.change_values = function () {

		$('.check_frm_to').attr("disabled", false);

		if (Number($scope.array_submit_comision.value_from) > Number($scope.array_submit_comision.value_to)) {
			$('.check_frm_to').attr("disabled", true);
			toaster.pop('error', 'info', 'From will be less then To '); return;
		}
	}

	$scope.submit_commision = function () {

		var updateUrlcommision = $scope.$root.sales + "customer/sale-target/add-sale-comision";

		if ($scope.array_submit_comision.discount_value == undefined || $scope.array_submit_comision.value_to == undefined) {
			toaster.pop('error', 'info', 'Form is empty ');
			return;
		}

		if ($scope.type_define == 1 || $scope.type_define == 3 || $scope.type_define == 5) {
			angular.element('.check_frm_to').attr("disabled", false);

			if (Number($scope.array_submit_comision.value_from) > Number($scope.array_submit_comision.value_to)) {
				angular.element('.check_frm_to').attr("disabled", true);
				toaster.pop('error', 'info', 'From will be less then To ');
				return;
			}
		}

		var rec = {};
		rec = $scope.array_submit_comision;
		// rec.data = $scope.array_commision;
		rec.token = $scope.$root.token;
		rec.type = $scope.type_define;

		if ($scope.type_define == 1 || $scope.type_define == 2)
			rec.module_id = $scope.$root.sale_target_id;
		else if ($scope.type_define == 3 || $scope.type_define == 4)
			rec.module_id = $scope.altContactMediaForm.id;
		else if ($scope.type_define == 5 || $scope.type_define == 6)
			rec.module_id = $scope.formDatalevel.id;

		$http
			.post(updateUrlcommision, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Add', res.data.error);
					$scope.get_commision_data($scope.type_define);
					// $('#comision_pop').modal('hide');
				}
				else
					toaster.pop('error', 'info', res.data.error);
			});
	}

	$scope.edit_sale_comision = function (id) {

		var editUrlcommision = $scope.$root.sales + "customer/sale-target/get-sale-comision-by-id";
		$scope.array_submit_comision = {};

		$http
			.post(editUrlcommision, { 'token': $scope.$root.token, id: id })
			.then(function (res) {

				if (res.data.ack == true) {

					$scope.array_submit_comision = res.data.response;
					$scope.array_submit_comision.edit_flag_value = res.data.response.discount_value;


					$.each($scope.discount_type_array, function (index, obj) {
						if (obj.value == $scope.array_submit_comision.discount_type)
							$scope.array_submit_comision.discount_type = obj;
					});

					$.each($scope.sale_type_array, function (index, obj) {
						if (obj.value == $scope.array_submit_comision.sale_type)
							$scope.array_submit_comision.sale_type = obj;
					});

					$.each($scope.target_type_array_commison, function (index, obj) {
						if (obj.id == $scope.array_submit_comision.target_type_comsion)
							$scope.array_submit_comision.target_type_comsion = obj;
					});

				}
				// else 	toaster.pop('error', 'Error', "No Record Found. ");

			});


	}

	$scope.delete_sale_comision = function (id, index, array_commision, discount_value) {

		// if (discount_value > 0)    

		var delUrlcommision = $scope.$root.sales + "customer/sale-target/delete-sale-comision";

		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrlcommision, { id: id, 'token': $scope.$root.token })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));

						array_commision.splice(index, 1);
						//  $scope.getsubexpenses_final_list($scope.formData.expense_id);
					} else toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));

				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});




		/*  var lastItem = $scope.choices.length-1;
		 $scope.choices.splice(lastItem);*/
	}

	$scope.disable_pre_data = false;
	$scope.disable_pre_data_from_value = false;
	$scope.get_privous_data = function (type, mid) {

		if ($scope.rec.fix_target_type !== undefined) {
			if ($scope.rec.fix_target_type.id == 1)
				$scope.array_submit_comision.sale_type = $scope.sale_type_array[0];
			else if ($scope.rec.fix_target_type.id == 2)
				$scope.array_submit_comision.sale_type = $scope.sale_type_array[1];
		}

		var getpre = $scope.$root.sales + "customer/sale-target/get-prevoius-data";
		var postData = {
			'token': $scope.$root.token,
			'type': type,
			'module_id': mid
		};

		$http
			.post(getpre, postData)
			.then(function (res) {

				if (res.data.ack == true) {
					//$scope.array_submit_comision = res.data.response; 

					$.each($scope.discount_type_array, function (index, obj) {
						if (obj.value == res.data.response[0].dtype)
							$scope.array_submit_comision.discount_type = obj;
					});

					$.each($scope.target_type_array_commison, function (index, obj) {
						if (obj.id == res.data.response[0].atype)
							$scope.array_submit_comision.target_type_comsion = obj;
					});

					$scope.disable_pre_data_from_value = false;
					if (res.data.response[0].atype == 1) {
						$scope.array_submit_comision.value_from = res.data.response[0].value_from;
						$scope.disable_pre_data_from_value = true;
					}
					$scope.disable_pre_data = true;
				}
				else {
					$scope.disable_pre_data_from_value = false;
					$scope.disable_pre_data = false;
				}
			});
	}

	$scope.add_Product_sale_target = function (id, type) {
		//,$scope.selectedProducts[$scope.counter].id
		var check = false;
		var excUrl = $scope.$root.sales + "customer/sale-target/add-prodcuts-sale-target";
		var post = {};
		var temp = [];
		$.each($scope.selectedProducts, function (index, obj) {
			temp.push({ id: obj.id, isPrimary: obj.isPrimary });
		})
		post.type = type;
		post.module_id = id;
		post.salespersons = temp;
		post.token = $scope.$root.token;
		$http
			.post(excUrl, post)
			.then(function (res) {
				if (res.data.ack == true) check = true;
			});

		//  return check;
	}

	/* angular.element(document).on('click', '.checkAllProducts', function () {
	
		$scope.selectedProducts = [];
		if (angular.element('.checkAllProducts').is(':checked') == true) {
			$scope.isProductChanged = true;
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
	
	});
	$scope.selectProduct = function (prod) {
		$scope.isProductChanged = true;
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
	}
	
	
	$scope.getProduct_sale_target_edit = function (id, type) {
	
		var salepersonUrl = $scope.$root.sales + "customer/sale-target/get-prodcuts-sale-target";
		$http
			.post(salepersonUrl, { module_id: id, 'token': $scope.$root.token, 'type': type })
			.then(function (emp_data) {
	
				if (emp_data.data.ack == true) {
					$scope.$root.$apply(function () {
						$.each($scope.products, function (indx, obj) {
							obj.chk = false;
							// obj.isPrimary = false;
							$.each(emp_data.data.response, function (indx, obj2) {
								if (obj.id == obj2.id) {
									obj.chk = true;
									//  if (obj2.is_primary == 1) obj.isPrimary = true;
	
									$scope.selectedProducts.push(obj);
								}
							});
							$scope.products.push(obj);
						});
					});
				}
				//else  toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));
			});
	} */



	/* angular.element(document).on('click', '.checkAll_region', function () {
		$scope.selectedGroups = [];
		if (angular.element('.checkAll_region').is(':checked') == true) {
			$scope.isregionChanged = true;
			for (var i = 0; i < $scope.arr_regions.length; i++) {
				$scope.arr_regions[i].chk = true;
				$scope.selectedGroups.push($scope.arr_regions[i]);
			}
		}
		else {
			for (var i = 0; i < $scope.arr_regions.length; i++) {
				$scope.arr_regions[i].chk = false;
			}
			$scope.selectedGroups = [];
		}
	
		$scope.$root.$apply(function () {
			$scope.selectedGroups;
		});
	
	}); */

	/* $scope.selectGroup = function (cust) {
		$scope.isregionChanged = true;
		for (var i = 0; i < $scope.arr_regions.length; i++) {
			if (cust.id == $scope.arr_regions[i].id) {
				if ($scope.arr_regions[i].chk == true) {
					$scope.arr_regions[i].chk = false;
					$.each($scope.selectedGroups, function (indx, obj) {
						if (obj != undefined) {
							if (obj.id == cust.id)
								$scope.selectedGroups.splice(indx, 1);
						}
					});
				}
				else {
					$scope.arr_regions[i].chk = true;
					$scope.selectedGroups.push($scope.arr_regions[i]);
				}
	
			}
	
		}
	
		angular.element('#custInfoModal').modal('hide');
	} */

	$scope.add_targettype_sale_target = function (id, type) {
		//,$scope.selectedProducts[$scope.counter].id
		var check = false;
		var excUrl = $scope.$root.sales + "customer/sale-target/add-targettype-sale-target";
		var post = {};
		var temp = [];
		$.each($scope.selectedGroups, function (index, obj) {
			temp.push({ id: obj.id, isPrimary: obj.isPrimary });
		})
		post.type = type;
		post.module_id = id;
		post.salespersons = temp;
		post.token = $scope.$root.token;
		$http
			.post(excUrl, post)
			.then(function (res) {
				if (res.data.ack == true) check = true;
			});

		//  return check;
	}

	$scope.get_targettype_sale_target_edit = function (id, type) {

		var salepersonUrl = $scope.$root.sales + "customer/sale-target/get-targettype-sale-target";
		$http
			.post(salepersonUrl, { module_id: id, 'token': $scope.$root.token, 'type': type })
			.then(function (emp_data) {

				if (emp_data.data.ack == true) {
					$timeout(function () {
						$scope.$root.$apply(function () {
							$.each($scope.arr_regions, function (indx, obj) {
								obj.chk = false;
								//obj.isPrimary = false;
								$.each(emp_data.data.response, function (indx, obj2) {
									if (obj.id == obj2.id) {
										obj.chk = true;
										//  if (obj2.is_primary == 1) obj.isPrimary = true;

										$scope.selectedGroups.push(obj);
									}
								});
								$scope.arr_regions.push(obj);
							});

						});
					}, 2000);
					// console.log($scope.selectedGroups);	console.log($scope.arr_regions);

				}
				//else  toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));
			});
	}

	//-----------------   Products ,Category,Brand  Detail-------------------------------------------

	$scope.get_pre_list_product = function (isShow, type) {
		$scope.columns = [];
		$scope.selectedProducts_detail = [];
		$scope.products_detail_all = [];

		if (type == undefined)
			var type = $scope.altContactMediaForm.product_promotion_type_id.id;

		if (type == 1) $scope.title = 'Categories';
		if (type == 2) $scope.title = 'Brands';
		if (type == 3) $scope.title = 'Products';


		var postUrl = $scope.$root.sales + "customer/sale-target/get-crm-sale-target-type-all";
		var postData = { 'token': $scope.$root.token, type: type, module_id: $scope.$root.sale_target_id };
		$http
			.post(postUrl, postData)
			.then(function (res) {
				if (res.data.ack == true) {

					$.each(res.data.response, function (indx, obj) {
						obj.chk = false;
						// obj.isPrimary = false;
						// if ($scope.selectedProducts_detail.length > 0) {
						//    $.each($scope.selectedProducts_detail, function (indx, obj2) {
						// if (obj.id == obj2.id) {
						obj.chk = true;
						$scope.selectedProducts_detail.push(obj);
						//   if (obj2.isPrimary)  obj.isPrimary = true;

						// }
						//  });
						//  }
						$scope.products_detail_all.push(obj);
					});

				}
				// else toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
			});

	}
	$scope.isProductChanged_detail = false;

	$scope.products_detail_all = [];
	$scope.selectedProducts_detail = [];

	$scope.columns_detail = [];
	$scope.getProducts_detail = function (isShow, type) {

		$scope.columns = [];
		$scope.columns_detail = [];
		$scope.columns_level = [];

		$scope.selectedProducts_detail = [];
		$scope.type = type;
		$scope.products_detail_all = [];

		if (type == undefined)
			var type = $scope.altContactMediaForm.product_promotion_type_id.id;

		if (type == 1) $scope.title = 'Additional  Categories';
		if (type == 2) $scope.title = 'Additional  Brands';
		if (type == 3) $scope.title = 'Additional  Products';
		var postUrl = $scope.$root.sales + "customer/sale-target/get-crm-sale-target-type-all";

		var postData = { 'token': $scope.$root.token, type: type, module_id: $scope.$root.sale_target_id };
		$http
			.post(postUrl, postData)
			.then(function (res) {
				if (res.data.ack == true) {

					$.each(res.data.response, function (indx, obj) {
						obj.chk = false;
						// obj.isPrimary = false;
						if ($scope.selectedProducts_detail.length > 0) {
							$.each($scope.selectedProducts_detail, function (indx, obj2) {
								if (obj.id == obj2.id) {
									obj.chk = true;
									//   if (obj2.isPrimary)  obj.isPrimary = true;

								}
							});
						}
						$scope.products_detail_all.push(obj);
					});

					angular.forEach(res.data.response[0], function (val, index) {
						if (index != 'chk' && index != 'id') {
							$scope.columns_detail.push({
								'title': toTitleCase(index),
								'field': index,
								'visible': true
							});
						}
					});
					//_detail
					if (!isShow) angular.element('#productModal').modal({ show: true });


				}
				// else toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
			});

	}
	angular.element(document).on('click', '.checkAllProducts_detail', function () {
		$scope.selectedProducts_detail = [];


		if (angular.element('.checkAllProducts_detail').is(':checked') == true) {
			$scope.isProductChanged_detail = true;
			for (var i = 0; i < $scope.products_detail_all.length; i++) {
				$scope.products_detail_all[i].chk = true;
				$scope.selectedProducts_detail.push($scope.products_detail_all[i]);
			}
		}
		else {
			for (var i = 0; i < $scope.products_detail_all.length; i++) {
				$scope.products_detail_all[i].chk = false;
			}
			$scope.selectedProducts_detail = [];
		}

		$timeout(function () {
			$scope.$root.$apply(function () {
				$scope.selectedProducts_detail;
			});
		}, 500);

	});
	$scope.selectProduct_detail = function (prod) {
		$scope.isProductChanged_detail = true;
		for (var i = 0; i < $scope.products_detail_all.length; i++) {
			if (prod.id == $scope.products_detail_all[i].id) {
				if ($scope.products_detail_all[i].chk == true) {
					$scope.products_detail_all[i].chk = false;
					$.each($scope.selectedProducts_detail, function (indx, obj) {
						if (obj != undefined) {
							if (obj.id == prod.id)
								$scope.selectedProducts_detail.splice(indx, 1);
						}
					});
				}
				else {
					$scope.products_detail_all[i].chk = true;
					$scope.selectedProducts_detail.push($scope.products_detail_all[i]);
				}

			}

		}
		angular.element('#custInfoModal').modal('hide');
	}
	$scope.add_Product_sale_target_detail = function (id, type) {
		//,$scope.selectedProducts[$scope.counter].id
		var check = false;
		var excUrl = $scope.$root.sales + "customer/sale-target/add-crm-sale-target-type-detail";
		var post = {};
		var temp = [];
		$.each($scope.selectedProducts_detail, function (index, obj) {
			temp.push({ id: obj.id, isPrimary: obj.isPrimary });
		})
		post.type = type;
		post.module_id = id;
		post.salespersons = temp;
		post.token = $scope.$root.token;
		$http
			.post(excUrl, post)
			.then(function (res) {
				if (res.data.ack == true) check = true;
			});

		//  return check;
	}

	$scope.getProduct_sale_target_edit_detail = function (id, type) {

		var salepersonUrl = $scope.$root.sales + "customer/sale-target/get-crm-sale-target-type-detail";
		$http
			.post(salepersonUrl, { module_id: id, 'token': $scope.$root.token, 'type': type })
			.then(function (emp_data) {

				if (emp_data.data.ack == true) {
					$timeout(function () {
						$scope.$root.$apply(function () {

							$.each($scope.products_detail_all, function (indx, obj) {
								obj.chk = false;
								// obj.isPrimary = false;
								$.each(emp_data.data.response, function (indx, obj2) {
									if (obj.id == obj2.id) {
										obj.chk = true;
										//  if (obj2.is_primary == 1) obj.isPrimary = true;

										$scope.selectedProducts_detail.push(obj);
									}
								});
								$scope.products_detail_all.push(obj);
							});


						});
					}, 1000);


				}
				//else  toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));

			});

	}


	//---- -- Customer  ,Region,Segemnt Detail------ ------------------------------------

	$scope.get_pre_list_target = function (isShow, type) {
		$scope.columns = [];
		$scope.selectedGroups_detail = [];
		$scope.arr_regions_all_detail = [];

		if (type == undefined)
			var type = $scope.altContactMediaForm.target_type.id;


		if (type == 4) $scope.title = 'Region';
		if (type == 5) $scope.title = 'Segment';
		if (type == 6) $scope.title = 'Buying Group';
		if (type == 7) $scope.title = 'Customer Specific';

		var postUrl = $scope.$root.sales + "customer/sale-target/get-crm-sale-target-type-all";
		var postData = { 'token': $scope.$root.token, type: type, module_id: $scope.$root.sale_target_id };

		$http
			.post(postUrl, postData)
			.then(function (res) {
				if (res.data.ack == true) {

					$.each(res.data.response, function (indx, obj) {
						obj.chk = false;
						// obj.isPrimary = false;
						//if ($scope.selectedGroups_detail.length > 0) {
						//  $.each($scope.selectedGroups_detail, function (indx, obj2) {
						//  if (obj.id == obj2.id) {
						obj.chk = true;
						//   if (obj2.isPrimary)  obj.isPrimary = true;

						//  //   }
						//  });
						// }
						$scope.selectedGroups_detail.push(obj);
						$scope.arr_regions_all_detail.push(obj);
					});

				}
				// else toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

			});



	}

	$scope.isregionChanged_detail = false;

	$scope.arr_regions_all_detail = [];
	$scope.selectedGroups_detail = [];


	$scope.getGroups_detail = function (isShow, type) {

		$scope.columns = [];
		$scope.columns_detail = [];
		$scope.columns_rg_level = [];

		$scope.arr_regions_all_detail = [];

		if (type == undefined)
			var type = $scope.altContactMediaForm.target_type.id;


		if (type == 4) $scope.title = 'Region';
		if (type == 5) $scope.title = 'Segment';
		if (type == 6) $scope.title = 'Buying Group';
		if (type == 7) $scope.title = 'Customer Specific';

		var postUrl = $scope.$root.sales + "customer/sale-target/get-crm-sale-target-type-all";
		var postData = { 'token': $scope.$root.token, type: type, module_id: $scope.$root.sale_target_id };

		$http
			.post(postUrl, postData)
			.then(function (res) {
				if (res.data.ack == true) {

					$.each(res.data.response, function (indx, obj) {
						obj.chk = false;
						// obj.isPrimary = false;
						if ($scope.selectedGroups_detail.length > 0) {
							$.each($scope.selectedGroups_detail, function (indx, obj2) {
								if (obj.id == obj2.id) {
									obj.chk = true;
									//   if (obj2.isPrimary)  obj.isPrimary = true;

								}
							});
						}
						$scope.arr_regions_all_detail.push(obj);
					});


					angular.forEach(res.data.response[0], function (val, index) {
						if (index != 'chk' && index != 'id') {
							$scope.columns_detail.push({
								'title': toTitleCase(index),
								'field': index,
								'visible': true
							});
						}
					});
					//groupInfoModal_detail
					if (!isShow) angular.element('#groupInfoModal').modal({ show: true });


				}
				// else toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));


			});

	}

	angular.element(document).on('click', '.checkAll_region', function () {
		$scope.selectedGroups_detail = [];
		if (angular.element('.checkAll_region').is(':checked') == true) {
			$scope.isregionChanged_detail = true;
			for (var i = 0; i < $scope.arr_regions_all_detail.length; i++) {
				$scope.arr_regions_all_detail[i].chk = true;
				$scope.selectedGroups_detail.push($scope.arr_regions_all_detail[i]);
			}
		}
		else {
			for (var i = 0; i < $scope.arr_regions_all_detail.length; i++) {
				$scope.arr_regions_all_detail[i].chk = false;
			}
			$scope.selectedGroups_detail = [];
		}

		$scope.$root.$apply(function () {
			$scope.selectedGroups_detail;
		});

	});

	$scope.selectGroup_detail = function (cust) {
		$scope.isregionChanged_detail = true;

		for (var i = 0; i < $scope.arr_regions_all_detail.length; i++) {
			if (cust.id == $scope.arr_regions_all_detail[i].id) {
				if ($scope.arr_regions_all_detail[i].chk == true) {
					$scope.arr_regions_all_detail[i].chk = false;
					$.each($scope.selectedGroups_detail, function (indx, obj) {
						if (obj != undefined) {
							if (obj.id == cust.id)
								$scope.selectedGroups_detail.splice(indx, 1);
						}
					});
				}
				else {
					$scope.arr_regions_all_detail[i].chk = true;
					$scope.selectedGroups_detail.push($scope.arr_regions_all_detail[i]);
				}

			}

		}
		if ($scope.selectedGroups_detail.length == $scope.arr_regions_all_detail.length) {
			$timeout(function () {
				$scope.$root.$apply(function () {
					angular.element('.checkAll').prop('checked', true);
				});
			}, 500);
		}
		else {
			$timeout(function () {
				$scope.$root.$apply(function () {
					angular.element('.checkAll').prop('checked', false);
				});
			}, 500);
		}
		/*angular.element('#custInfoModal').modal('hide');*/
	}

	$scope.add_targettype_sale_target_detail = function (id, type) {


		//,$scope.selectedProducts[$scope.counter].id
		var check = false;
		var excUrl = $scope.$root.sales + "customer/sale-target/add-crm-sale-target-type-detail-second";
		var post = {};
		var temp = [];
		$.each($scope.selectedGroups_detail, function (index, obj) {
			temp.push({ id: obj.id, isPrimary: obj.isPrimary });
		})
		post.type = type;
		post.module_id = id;
		post.salespersons = temp;
		post.token = $scope.$root.token;
		$http
			.post(excUrl, post)
			.then(function (res) {
				if (res.data.ack == true) check = true;
			});


	}

	$scope.get_targettype_sale_target_edit_detail = function (id, type) {


		var salepersonUrl = $scope.$root.sales + "customer/sale-target/get-crm-sale-target-type-detail";
		$http
			.post(salepersonUrl, { module_id: id, 'token': $scope.$root.token, 'type': type })
			.then(function (emp_data) {

				if (emp_data.data.ack == true) {
					$timeout(function () {
						$scope.$root.$apply(function () {
							$.each($scope.arr_regions_all_detail, function (indx, obj) {
								obj.chk = false;
								// obj.isPrimary = false;
								$.each(emp_data.data.response, function (indx, obj2) {
									if (obj.id == obj2.id) {
										obj.chk = true;
										//  if (obj2.is_primary == 1) obj.isPrimary = true;

										$scope.selectedGroups_detail.push(obj);
									}
								});
								$scope.arr_regions_all_detail.push(obj);
							});
						});
					}, 1000);
				}


			});


	}




	//------------  Level Next  -----------------------------------------------

	$scope.testdate_between_two_dates_by_am = function (ck_startDate, ck_end_date, test_date, div_id) {
		var from, to, check;

		// from=ck_startDate;
		// to =ck_end_date;
		// check = test_date;

		from = ck_startDate.split("/")[2] + "-" + ck_startDate.split("/")[1] + "-" + ck_startDate.split("/")[0];
		to = ck_end_date.split("/")[2] + "-" + ck_end_date.split("/")[1] + "-" + ck_end_date.split("/")[0];
		check = test_date.split("/")[2] + "-" + test_date.split("/")[1] + "-" + test_date.split("/")[0];

		//	console.log(from);	console.log(to);console.log(check);

		if (from != null && to != null && check != null) {

			var from1, to1, check1;
			from1 = new Date(from.replace(/\s/g, ''));
			to1 = new Date(to.replace(/\s/g, ''));
			check1 = new Date(check.replace(/\s/g, ''));

			//console.log(from1);	console.log(to1);console.log(check1);

			var fDate, lDate, cDate;
			fDate = Date.parse(from1);
			lDate = Date.parse(to1);
			cDate = Date.parse(check1);

			if ((cDate > fDate) && (cDate < lDate)) {
				$('#' + div_id).hide();
				$('.b_' + div_id).attr("disabled", false);
				//  return false;
			}
			else {
				$('#' + div_id).show();
				$('.b_' + div_id).attr("disabled", true);
				//  return true;

			}
		}

	}

	$scope.check_sale_target_readonly_level = false;

	$scope.showEditForm_level = function () {
		$scope.check_sale_target_readonly_level = false;
	}
	$scope.formDatalevel = {};
	$scope.level_all_list = true;
	$scope.level_add_form = true;
	var level_id = 0;
	var level_sale_person_id = 0;
	var level_sdate = 0;
	var level_edate = 0;
	var level_total_target_amount_check = 0;
	var level_target_uom = 0;
	var level_target_amount = 0;
	var level_product_promotion_type_id = 0;
	var level_target_type = 0;
	var level_fix_target_type = 0;
	var level_sale_person_name = 0;

	$scope.open_level_pop = function (recs) {

		level_id = recs.id;
		level_sale_person_id = recs.sid;
		level_sale_person_name = recs.sale_person_name;
		level_target_amount = recs.target_amount;

		//level_fix_target_type=recs.fix_target_type;
		level_target_uom = recs.target_uom;;
		level_product_promotion_type_id = $scope.rec.product_promotion_type_id;//recs.product_promotion_type_id;
		level_target_type = $scope.rec.target_type;//recs.target_type;

		level_sdate = recs.start_date;
		level_edate = recs.end_date;

		angular.element('#level_pop').modal({ show: true });
		//angular.element('#custInfoModal').modal('hide');
		$scope.level_add_form = true;
		//  $scope.level_all_list = true;
		$scope.get_level_detail();
	}

	$scope.showadd_level_form = function () {
		$scope.level_add_form = true;
		//  $scope.level_all_list = true;
		$scope.check_sale_target_readonly_level = false;
		$scope.formDatalevel = {};
		$scope.level_calculate_remaining();

		$scope.formDatalevel.status = $scope.arr_status[0];
		//$scope.formDatalevel.fix_target_type=level_fix_target_type;
		$scope.formDatalevel.start_date = level_sdate;
		$scope.formDatalevel.end_date = level_edate;
		$scope.formDatalevel.level_check_sdate = level_sdate;
		$scope.formDatalevel.level_check_edate = level_edate;
		$scope.formDatalevel.sale_person_name = level_sale_person_name;
		$scope.formDatalevel.target_uom = $scope.rec.target_uom;
		//$scope.formDatalevel.target_uom=level_target_uom;
		$scope.formDatalevel.product_promotion_type_id = level_product_promotion_type_id;
		$scope.formDatalevel.target_type = level_target_type;
		//$scope.formDatalevel.product_promotion_type_id=$scope.arr_prod_promo_type[0];
		//$scope.formDatalevel.target_type=$scope.arr_sale_type[0];
		$scope.formDatalevel.created_date = $scope.$root.get_current_date();

		$scope.formDatalevel.commission_type = 2;//$scope.arr_type_commision[1];
		$scope.formDatalevel.bonus_type = 2;//$scope.arr_type_bonus[1];

		console.log($scope.formDatalevel);

		var getUrl = $scope.$root.sales + "customer/sale-target/get-unique-id-detail";
		$http
			.post(getUrl, { 'token': $scope.$root.token, type: 2, 'level_id': level_id })
			.then(function (res) {

				if (res.data.ack == 1) $scope.formDatalevel.id = res.data.id;

				else {
					toaster.pop('error', 'info', res.data.error);
					return false;
				}
			});



		$timeout(function () {
			$scope.$root.$apply(function () {

				if ($scope.formDatalevel.product_promotion_type_id !== undefined)
					$scope.get_pre_list_product_level($scope.formDatalevel.product_promotion_type_id);

				if ($scope.formDatalevel.target_type !== undefined)
					$scope.get_pre_list_target_level($scope.formDatalevel.target_type);

			});
		}, 1000);


		$scope.showdata_levelc = false;
		$scope.showdata_levelb = false;
	};

	$scope.hideadd_level_form = function () {
		$scope.level_add_form = false;
		// $scope.level_all_list = true;
		$scope.formDatalevel = {};
		$scope.get_level_detail();
	}

	$scope.level_calculate_remaining = function () {
		var getUrl = $scope.$root.sales + "customer/sale-target/calculate-level-remaining";
		$http
			.post(getUrl, { 'token': $scope.$root.token, t_id: $scope.$root.sale_target_id, level_id: level_id })
			.then(function (res) {
				if (res.data.ack == true) {

					level_total_target_amount_check = Number(level_target_amount) - Number(res.data.total_target_amount);


					if (level_total_target_amount_check > 0) $scope.formDatalevel.target_amount = level_total_target_amount_check;
					else $scope.formDatalevel.target_amount = 0;

					// $scope.level.total_comunication =  Number(res.data.total_comunication); 
					//  $scope.level.total_comunication_target =  Number(res.data.total_comunication_target);

				}
				else {
					level_total_target_amount_check = level_target_amount;
					$scope.formDatalevel.target_amount = level_total_target_amount_check;
				}

			});


	}

	$scope.grandtotal_level = 0;
	$scope.total_grand_show_level = true;

	$scope.get_level_detail = function () {
		$scope.level_add_form = false;
		// $scope.level_all_list = true;
		$scope.formDatalevel = {};

		var urlCRMSocialMedias = $scope.$root.sales + "customer/sale-target/get-sale-detail-list";

		$http
			.post(urlCRMSocialMedias, { 'level_id': level_id, 'token': $scope.$root.token, 'crm_sale_target_id': $scope.$root.sale_target_id, 'type': 2 })
			.then(function (res) {
				$scope.level_record = [];
				$scope.columns_level_record = [];
				$scope.level_record = res.data.response;

				angular.forEach(res.data.response[0], function (val, index) {
					$scope.columns_level_record.push({
						'title': toTitleCase(index),
						'field': index,
						'visible': true
					});
				});
				$scope.grandtotal_level = 0;
				$scope.total_grand_show_level = true;

				$.each($scope.level_record, function (index, obj2) {
					$scope.grandtotal_level += Number(obj2.target_amount);
				});

				if (level_target_amount <= $scope.grandtotal_level)
					$scope.total_grand_show_level = false;
				else
					$scope.total_grand_show_level = true;
			});
	};

	$scope.add_level = function () {

		//$scope.$root.testdate_between_two_dates_by_angular_model(level_sdate,level_edate,$scope.formDatalevel.start_date,'date_blocksl');
		if ($scope.formDatalevel.target_amount == undefined || level_sale_person_id == undefined) {
			toaster.pop('error', 'Info', 'Form is empty . ');
			return;
		}

		if ($scope.formDatalevel.edit_flag == 1)
			level_total_target_amount_check = Number(level_total_target_amount_check + 1) + Number($scope.formDatalevel.target_amount);

		if (Number(level_total_target_amount_check) < Number($scope.formDatalevel.target_amount) || Number(level_total_target_amount_check) < Number($scope.formDatalevel.target_amount)) {
			toaster.pop('error', 'Info', 'Target Amount is Exceed . ');
			return;
		}

		$scope.formDatalevel.token = $scope.$root.token;
		$scope.formDatalevel.sale_target_id = $scope.rec.id;

		if ($scope.formDatalevel.status !== undefined)
			$scope.formDatalevel.statuss = $scope.formDatalevel.status !== undefined ? $scope.formDatalevel.status.value : 0;

		if ($scope.formDatalevel.target_type !== undefined)
			$scope.formDatalevel.target_types = $scope.formDatalevel.target_type !== undefined ? $scope.formDatalevel.target_type.id : 0;

		if ($scope.formDatalevel.product_promotion_type_id !== undefined)
			$scope.formDatalevel.product_promotion_type_ids = $scope.formDatalevel.product_promotion_type_id !== undefined ? $scope.formDatalevel.product_promotion_type_id.id : 0;

		$scope.formDatalevel.sale_group_id = $scope.rec.sale_person_id;

		if ($scope.formDatalevel.target_uom !== undefined)
			$scope.formDatalevel.target_uoms = $scope.formDatalevel.target_uom.id !== undefined ? $scope.formDatalevel.target_uom.id : 0;


		if ($scope.formDatalevel.id > 0) var postUrl = $scope.$root.sales + "customer/sale-target/update-sale-detail";
		else var postUrl = $scope.$root.sales + "customer/sale-target/add-sale-detail";


		$scope.formDatalevel.level_id = level_id;
		$scope.formDatalevel.type = 2;
		$scope.formDatalevel.sale_person_id = level_sale_person_id;
		$scope.formDatalevel.sale_person_name = level_sale_person_name;

		$http
			.post(postUrl, $scope.formDatalevel)
			.then(function (ress) {
				if (ress.data.ack == true) {

					toaster.pop('success', "Info", $scope.$root.getErrorMessageByCode(101));

					if ($scope.isProductChanged_level)
						$scope.add_product_level(ress.data.id, $scope.formDatalevel.product_promotion_type_id.id);

					if ($scope.isregionChanged_rg_level)
						$scope.add_targettype_rg_level(ress.data.id, $scope.formDatalevel.target_type.id);
					$scope.get_level_detail();

					$scope.level_add_form = false;
				}
				else toaster.pop('error', 'Info', ress.data.error);
			});
	}

	$scope.edit_level = function (id) {

		$scope.check_sale_target_readonly_level = true;
		$scope.level_add_form = true;
		$scope.formDatalevel = {};
		$scope.formDatalevel = [];
		//$scope.calculate_total_target_ammount($scope.rec.id);

		var urlCRMSocialMedias = $scope.$root.sales + "customer/sale-target/get-sale-detail-list-by-id";

		$http
			.post(urlCRMSocialMedias, { 'token': $scope.$root.token, id: id, type: '3' })
			.then(function (res) {
				if (res.data.ack == true) {

					$scope.formDatalevel = res.data.response;
					$scope.formDatalevel.level_check_sdate = level_sdate;
					$scope.formDatalevel.level_check_edate = level_edate;

					$scope.formDatalevel.old_target_amount = res.data.response.target_amount;

					if (res.data.response.starting_date == 0)
						$scope.formDatalevel.start_date = null;
					else
						$scope.formDatalevel.start_date = $scope.$root.convert_unix_date_to_angular(res.data.response.start_date);

					if (res.data.response.end_date == 0)
						$scope.formDatalevel.end_date = null;
					else
						$scope.formDatalevel.end_date = $scope.$root.convert_unix_date_to_angular(res.data.response.end_date);

					$.each($scope.arr_status, function (index, obj) {
						if (obj.value == res.data.response.status) $scope.formDatalevel.status = obj;
					});

					/* $.each($scope.arr_target_uom, function (indx, obj) {
						if (obj.id == res.data.response.target_uom) $scope.formDatalevel.target_uom = obj;
					}); */
					angular.forEach($rootScope.uni_prooduct_arr, function (obj) {
						if (obj.id == res.data.response.target_uom)
							$scope.formDatalevel.target_uom = obj;
					});
					/* $.each($scope.arr_type_commision,function(index,obj){ 
						if(obj.id == res.data.response.commission_type) $scope.formDatalevel.commission_type = obj; 
					});
					
					 $.each($scope.arr_type_bonus,function(index,obj){ 
						if(obj.id == res.data.response.bonus_type) $scope.formDatalevel.bonus_type = obj; 
					});*/

					$.each($scope.arr_sale_type, function (index, obj) {
						if (obj.id == res.data.response.target_type) $scope.formDatalevel.target_type = obj;
					});

					$.each($scope.arr_prod_promo_type, function (indx, obj) {
						if (obj.id == res.data.response.product_promotion_type_id) $scope.formDatalevel.product_promotion_type_id = obj;
					});

					//  $scope.formDatalevel.product_promotion_type_id=$scope.rec.product_promotion_type_id;
					//$scope.formDatalevel.target_type=$scope.rec.target_type;

					if ($scope.formDatalevel.product_promotion_type_id !== undefined) {

						$scope.getProduct_level_edit(id, $scope.rec.product_promotion_type_id.id);
						$scope.getProducts_level(1, $scope.formDatalevel.product_promotion_type_id.id);

					}

					if ($scope.formDatalevel.target_type !== undefined) {

						$scope.get_targettype_rg_level_edit(id, $scope.formDatalevel.target_type.id);
						$scope.getGroups_rg_level(1, $scope.formDatalevel.target_type.id);

					}


					$scope.showdata_levelc = false;
					if (res.data.response.comsion_status > 0) $scope.showdata_levelc = true;
					$scope.showdata_levelb = false;
					if (res.data.response.bonus_status > 0) $scope.showdata_levelb = true;


				}

			});


	};
	$scope.showdata_levelc = false;
	$scope.showdata_levelb = false;

	$scope.delete_level = function (id) {
		var postUrl = $scope.$root.sales + "customer/sale-target/delete-sale-detail";

		$http
			.post(postUrl, { 'id': id, 'token': $scope.$root.token })
			.then(function (ress) {
				if (ress.data.ack == true) {
					toaster.pop('success', "info", $scope.$root.getErrorMessageByCode(103));

					$scope.get_level_detail();
				} else toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(108));

			});
	};

	$scope.testdate_between_two_dates_by_angular_model = function (ck_startDate, ck_end_date, test_date, div_id) {
		var from, to, check;

		from = ck_startDate;
		to = ck_end_date;
		check = test_date;

		if (from != null && to != null && check != null) {

			var from1, to1, check1;
			from1 = new Date(from);
			to1 = new Date(to);
			check1 = new Date(check);
			var fDate, lDate, cDate;
			fDate = Date.parse(from1);
			lDate = Date.parse(to1);
			cDate = Date.parse(check1);

			if ((cDate > fDate) && (cDate < lDate)) {
				$('#' + div_id).hide();
				$('.b_' + div_id).attr("disabled", false);
				//  return false;
			}
			else {
				$('#' + div_id).show();
				$('.b_' + div_id).attr("disabled", true);
				//  return true;

			}
		}
	}




	//-----------------Products ,Category,Brand     level------------------------------------------

	$scope.get_pre_list_product_level = function (isShow, type) {

		$scope.columns_level = [];
		$scope.selectedProducts_level = [];
		$scope.products_list_level = [];

		if (type == undefined) var type = $scope.formDatalevel.product_promotion_type_id.id;
		if (type == 1) $scope.title = 'Categories';
		if (type == 2) $scope.title = 'Brands';
		if (type == 3) $scope.title = 'Products';

		//$scope.$root.sale_target_id
		var postUrl = $scope.$root.sales + "customer/sale-target/get-crm-sale-target-type-all-level";
		var postData = { 'token': $scope.$root.token, type: type, module_id: level_id };
		$http
			.post(postUrl, postData)
			.then(function (res) {
				if (res.data.ack == true) {


					$.each(res.data.response, function (indx, obj) {
						obj.chk = false;
						// obj.isPrimary = false;
						// if ($scope.selectedProducts_level.length > 0) {
						//    $.each($scope.selectedProducts_level, function (indx, obj2) {
						// if (obj.id == obj2.id) {
						obj.chk = true;
						$scope.selectedProducts_level.push(obj);
						//   if (obj2.isPrimary)  obj.isPrimary = true;

						// }
						//  });
						//  }
						$scope.products_list_level.push(obj);
					});

				}
				// else toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
			});


	}
	$scope.isProductChanged_level = false;
	$scope.products_list_level = [];
	$scope.selectedProducts_level = [];

	$scope.getProducts_level = function (isShow, type) {

		$scope.columns = [];
		$scope.columns_detail = [];
		$scope.columns_level = [];

		$scope.type = type;
		$scope.columns_level = [];
		$scope.products_list_level = [];
		if (type == undefined) var type = $scope.formDatalevel.product_promotion_type_id.id;

		if (type == 1) $scope.title = 'Additional  Level Categories';
		else if (type == 2) $scope.title = 'Additional  Level Brands';
		else if (type == 3) $scope.title = 'Additional  Level Products';

		var postUrl = $scope.$root.sales + "customer/sale-target/get-crm-sale-target-type-all-level";
		//var postUrl = $scope.$root.sales+"customer/sale-target/get-crm-sale-target-type-all";
		//$scope.$root.sale_target_id
		var postData = { 'token': $scope.$root.token, type: type, module_id: level_id };
		$http
			.post(postUrl, postData)
			.then(function (res) {
				if (res.data.ack == true) {

					$.each(res.data.response, function (indx, obj) {
						obj.chk = false;
						if ($scope.selectedProducts_level.length > 0) {
							$.each($scope.selectedProducts_level, function (indx, obj2) {
								if (obj.id == obj2.id) obj.chk = true;
							});
						}
						$scope.products_list_level.push(obj);
					});
					angular.forEach(res.data.response[0], function (val, index) {
						if (index != 'chk' && index != 'id') {
							$scope.columns_level.push({
								'title': toTitleCase(index),
								'field': index,
								'visible': true
							});
						}
					});

					if (!isShow) angular.element('#productModal').modal({ show: true });

				}
				// else toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
			});
	}

	angular.element(document).on('click', '.checkAllProducts_list_level', function () {
		$scope.selectedProducts_level = [];

		if (angular.element('.checkAllProducts_list_level').is(':checked') == true) {
			$scope.isProductChanged_level = true;
			for (var i = 0; i < $scope.products_list_level.length; i++) {
				$scope.products_list_level[i].chk = true;
				$scope.selectedProducts_level.push($scope.products_list_level[i]);
			}
		}
		else {
			for (var i = 0; i < $scope.products_list_level.length; i++) {
				$scope.products_list_level[i].chk = false;
			}
			$scope.selectedProducts_level = [];
		}

		$timeout(function () {
			$scope.$root.$apply(function () {
				$scope.selectedProducts_level;
			});
		}, 500);

	});
	$scope.selectProduct_level = function (prod) {
		$scope.isProductChanged_level = true;
		for (var i = 0; i < $scope.products_list_level.length; i++) {
			if (prod.id == $scope.products_list_level[i].id) {
				if ($scope.products_list_level[i].chk == true) {
					$scope.products_list_level[i].chk = false;
					$.each($scope.selectedProducts_level, function (indx, obj) {
						if (obj != undefined) {
							if (obj.id == prod.id)
								$scope.selectedProducts_level.splice(indx, 1);
						}
					});
				}
				else {
					$scope.products_list_level[i].chk = true;
					$scope.selectedProducts_level.push($scope.products_list_level[i]);
				}
			}
		}
		angular.element('#custInfoModal').modal('hide');
	}

	$scope.add_product_level = function (id, type) {

		var check = false;
		var excUrl = $scope.$root.sales + "customer/sale-target/add-crm-sale-target-type-detail";
		var post = {};
		var temp = [];

		$.each($scope.selectedProducts_level, function (index, obj) {
			temp.push({ id: obj.id, isPrimary: obj.isPrimary });
		});

		post.type = type;
		post.module_id = id;
		post.salespersons = temp;
		post.token = $scope.$root.token;
		$http
			.post(excUrl, post)
			.then(function (res) {
				if (res.data.ack == true) check = true;
			});
		//  return check;
	}

	$scope.getProduct_level_edit = function (id, type) {

		var salepersonUrl = $scope.$root.sales + "customer/sale-target/get-crm-sale-target-type-detail";
		$http
			.post(salepersonUrl, { module_id: id, 'token': $scope.$root.token, 'type': type })
			.then(function (emp_data) {

				if (emp_data.data.ack == true) {
					$timeout(function () {
						$scope.$root.$apply(function () {

							$.each($scope.products_list_level, function (indx, obj) {
								obj.chk = false;
								$.each(emp_data.data.response, function (indx, obj2) {
									if (obj.id == obj2.id) {
										obj.chk = true;
										$scope.selectedProducts_level.push(obj);
									}
								});
								//  $scope.products_list_level.push(obj);
							});

						});
					}, 1000);
				}
				//else  toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));
			});
	}

	//---- -- Customer ,Region,Segment  level------ ------------------------------------

	$scope.get_pre_list_target_level = function (isShow, type) {
		$scope.columns_rg_level = [];
		$scope.selectedGroups_rg_level = [];
		$scope.arr_regions_list_level = [];

		if (type == undefined)
			var type = $scope.formDatalevel.target_type.id;

		if (type == 4)
			$scope.title = 'Region';

		if (type == 5)
			$scope.title = 'Segment';

		if (type == 6)
			$scope.title = 'Buying Group';

		if (type == 7)
			$scope.title = 'Customer Specific';

		//var postUrl = $scope.$root.sales+"customer/sale-target/get-crm-sale-target-type-all";
		var postUrl = $scope.$root.sales + "customer/sale-target/get-crm-sale-target-type-all-level";
		var postData = { 'token': $scope.$root.token, type: type, module_id: level_id };
		//$scope.$root.sale_target_id
		$http
			.post(postUrl, postData)
			.then(function (res) {
				if (res.data.ack == true) {

					$.each(res.data.response, function (indx, obj) {
						obj.chk = false;
						// obj.isPrimary = false;
						//if ($scope.selectedGroups_rg_level.length > 0) {
						//  $.each($scope.selectedGroups_rg_level, function (indx, obj2) {
						//  if (obj.id == obj2.id) {
						obj.chk = true;
						//   if (obj2.isPrimary)  obj.isPrimary = true;

						//  //   }
						//  });
						// }
						$scope.selectedGroups_rg_level.push(obj);
						$scope.arr_regions_list_level.push(obj);
					});
				}
				// else toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
			});
	}

	$scope.isregionChanged_rg_level = false;
	$scope.arr_regions_list_level = [];
	$scope.selectedGroups_rg_level = [];

	$scope.getGroups_rg_level = function (isShow, type) {
		$scope.columns = [];
		$scope.columns_detail = [];
		$scope.columns_rg_level = [];
		$scope.arr_regions_list_level = [];

		if (type == undefined)
			var type = $scope.formDatalevel.target_type.id;

		if (type == 4)
			$scope.title = 'Region';

		if (type == 5)
			$scope.title = 'Segment';

		if (type == 6)
			$scope.title = 'Buying Group';

		if (type == 7)
			$scope.title = 'Customer Specific';
		//var postUrl = $scope.$root.sales+"customer/sale-target/get-crm-sale-target-type-all"; 
		var postUrl = $scope.$root.sales + "customer/sale-target/get-crm-sale-target-type-all-level";
		var postData = { 'token': $scope.$root.token, type: type, module_id: level_id };
		//$scope.$root.sale_target_id
		$http
			.post(postUrl, postData)
			.then(function (res) {
				if (res.data.ack == true) {

					$.each(res.data.response, function (indx, obj) {
						obj.chk = false;
						// obj.isPrimary = false;
						if ($scope.selectedGroups_rg_level.length > 0) {
							$.each($scope.selectedGroups_rg_level, function (indx, obj2) {
								if (obj.id == obj2.id) {
									obj.chk = true;
									//   if (obj2.isPrimary)  obj.isPrimary = true;

								}
							});
						}

						$scope.arr_regions_list_level.push(obj);
					});

					angular.forEach(res.data.response[0], function (val, index) {
						if (index != 'chk' && index != 'id') {
							$scope.columns_rg_level.push({
								'title': toTitleCase(index),
								'field': index,
								'visible': true
							});
						}
					});

					if (!isShow)
						angular.element('#groupInfoModal').modal({ show: true });
				}
				// else toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
			});
	}

	angular.element(document).on('click', '.checkAll_rg_level', function () {
		$scope.selectedGroups_rg_level = [];
		if (angular.element('.checkAll_rg_level').is(':checked') == true) {
			$scope.isregionChanged_rg_level = true;
			for (var i = 0; i < $scope.arr_regions_list_level.length; i++) {
				$scope.arr_regions_list_level[i].chk = true;
				$scope.selectedGroups_rg_level.push($scope.arr_regions_list_level[i]);
			}
		}
		else {
			for (var i = 0; i < $scope.arr_regions_list_level.length; i++) {
				$scope.arr_regions_list_level[i].chk = false;
			}
			$scope.selectedGroups_rg_level = [];
		}

		$scope.$root.$apply(function () {
			$scope.selectedGroups_rg_level;
		});
	});

	$scope.selectGroup_region_level = function (cust) {
		$scope.isregionChanged_rg_level = true;

		for (var i = 0; i < $scope.arr_regions_list_level.length; i++) {
			if (cust.id == $scope.arr_regions_list_level[i].id) {
				if ($scope.arr_regions_list_level[i].chk == true) {
					$scope.arr_regions_list_level[i].chk = false;
					$.each($scope.selectedGroups_rg_level, function (indx, obj) {
						if (obj != undefined) {
							if (obj.id == cust.id)
								$scope.selectedGroups_rg_level.splice(indx, 1);
						}
					});
				}
				else {
					$scope.arr_regions_list_level[i].chk = true;
					$scope.selectedGroups_rg_level.push($scope.arr_regions_list_level[i]);
				}
			}
		}

		if ($scope.selectedGroups_rg_level.length == $scope.arr_regions_list_level.length) {
			$timeout(function () {
				$scope.$root.$apply(function () {
					angular.element('.checkAll').prop('checked', true);
				});
			}, 500);
		}
		else {
			$timeout(function () {
				$scope.$root.$apply(function () {
					angular.element('.checkAll').prop('checked', false);
				});
			}, 500);
		}
		/*angular.element('#custInfoModal').modal('hide');*/
	}

	$scope.add_targettype_rg_level = function (id, type) {
		var check = false;
		var excUrl = $scope.$root.sales + "customer/sale-target/add-crm-sale-target-type-detail-second";
		var post = {};
		var temp = [];

		$.each($scope.selectedGroups_rg_level, function (index, obj) {
			temp.push({ id: obj.id, isPrimary: obj.isPrimary });
		});

		post.type = type;
		post.module_id = id;
		post.salespersons = temp;
		post.token = $scope.$root.token;

		$http
			.post(excUrl, post)
			.then(function (res) {
				if (res.data.ack == true)
					check = true;
			});
	}

	$scope.get_targettype_rg_level_edit = function (id, type) {

		var salepersonUrl = $scope.$root.sales + "customer/sale-target/get-crm-sale-target-type-detail";
		$http
			.post(salepersonUrl, { module_id: id, 'token': $scope.$root.token, 'type': type })
			.then(function (emp_data) {

				if (emp_data.data.ack == true) {
					$timeout(function () {
						$scope.$root.$apply(function () {
							$.each($scope.arr_regions_list_level, function (indx, obj) {
								obj.chk = false;
								// obj.isPrimary = false;
								$.each(emp_data.data.response, function (indx, obj2) {
									if (obj.id == obj2.id) {
										obj.chk = true;
										//  if (obj2.is_primary == 1) obj.isPrimary = true;

										$scope.selectedGroups_rg_level.push(obj);
									}
								});
								$scope.arr_regions_list_level.push(obj);
							});
						});
					}, 1000);
				}
			});
	}

	//------------ Link To -----------------------------------------------

	var salepostUrl = $scope.$root.sales + "customer/sale-target/get-sale-list";

	$scope.isSalePerersonChanged = false;
	$scope.columns = [];
	$scope.selectedLinktopersons = [];
	$scope.selectedLocRegions = [];
	$scope.allLinkto = [];
	$scope.selectedLinkTo = [];

	$scope.getLinkTo_dept = function (isShow) {
		$scope.columns = [];
		$scope.allLinkto = [];
		$scope.title = 'Targets';
		var postData = { 'token': $scope.$root.token, 'thisid': $scope.$root.sale_target_id };

		$scope.showLoader = true;

		$http
			.post(salepostUrl, postData)
			.then(function (res) {
				if (res.data.ack == true) {

					$.each(res.data.response, function (indx, obj) {
						obj.chk = false;
						obj.isPrimary = false;
						if ($scope.selectedLinkTo.length > 0) {
							$.each($scope.selectedLinkTo, function (indx, obj2) {
								if (obj.id == obj2.id) {
									obj.chk = true;
									//  if (obj2.isPrimary)   obj.isPrimary = true;

								}
							});
						}
						$scope.allLinkto.push(obj);
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

					$scope.showLoader = false;
					if (!isShow) angular.element('#salesPersonModal_location').modal({ show: true });
				}
				else {
					$scope.showLoader = false;
					toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
				}
			});

	}

	angular.element(document).on('click', '.checkAllSalesperson', function () {



		$scope.selectedLinkTo = [];
		if (angular.element('.checkAllSalesperson').is(':checked') == true) {
			$scope.isSalePerersonChanged = true;
			var isPrimary = false;
			for (var i = 0; i < $scope.allLinkto.length; i++) {
				if ($scope.allLinkto[i].isPrimary)
					isPrimary = true;

				$scope.allLinkto[i].chk = true;
				$scope.selectedLinkTo.push($scope.allLinkto[i]);
			}
			if (!isPrimary) {
				$scope.allLinkto[0].isPrimary = true;
				$scope.selectedLinkTo[0].isPrimary = true;
			}

		}
		else {
			for (var i = 0; i < $scope.allLinkto.length; i++) {
				$scope.allLinkto[i].chk = false;
				$scope.allLinkto[i].isPrimary = false;
			}
			$scope.selectedLinkTo = [];
		}

		//$timeout(function(){
		$scope.$root.$apply(function () {
			$scope.selectedLinkTo;
		});
		//},500);

	});

	$scope.selectLinkTo = function (sp, isPrimary) {
		$scope.isSalePerersonChanged = true;
		for (var i = 0; i < $scope.allLinkto.length; i++) {
			if (isPrimary == 1)
				$scope.allLinkto[i].isPrimary = false;
			if (sp.id == $scope.allLinkto[i].id) {
				if ($scope.allLinkto[i].chk == true && isPrimary == 0) {
					$scope.allLinkto[i].chk = false;
					$scope.allLinkto[i].isPrimary = false;
					$.each($scope.selectedLinkTo, function (indx, obj) {
						if (obj != undefined) {
							if (obj.id == sp.id)
								$scope.selectedLinkTo.splice(indx, 1);
						}
					});
				} else {

					// console.log('i==>>'+i);
					if (isPrimary == 1 || $scope.selectedLinkTo.length == 0) {
						var isExist = false;
						$scope.allLinkto[i].isPrimary = true;
						$.each($scope.selectedLinkTo, function (indx, obj) {
							if (obj != undefined) {
								$scope.selectedLinkTo[indx].isPrimary = false;
								if (obj.id == sp.id) {
									isExist = true;
									$scope.selectedLinkTo[indx].isPrimary = true;
								}

							}
						});
						if (!isExist) {
							$scope.allLinkto[i].chk = true;
							$scope.selectedLinkTo.push($scope.allLinkto[i]);
						}

					} else {
						$scope.allLinkto[i].chk = true;
						$scope.selectedLinkTo.push($scope.allLinkto[i]);
					}
				}

			}

		}
	}

	$scope.add_linkto = function (id) {
		var check = false;
		var excUrl = $scope.$root.sales + "crm/crm/add-crm-salesperson";
		var post = {};
		var temp = [];
		$.each($scope.selectedLinkTo, function (index, obj) {
			temp.push({ id: obj.id, isPrimary: obj.isPrimary });
		})
		post.type = 5;
		post.id = id;
		post.salespersons = temp;
		post.token = $scope.$root.token;
		$http
			.post(excUrl, post)
			.then(function (res) {
				if (res.data.ack == true) {
					//$scope.add_linkto_log(id);
					check = true;
				}
			});

		return check;
	}

	$scope.getLinkTo_edit = function (id) {

		var salepersonUrl = $scope.$root.sales + "crm/crm/get-crm-salesperson";
		$http
			.post(salepersonUrl, { id: id, 'token': $scope.$root.token, 'type': 5 })
			.then(function (emp_data) {
				if (emp_data.data.ack == true) {
					$.each($scope.allLinkto, function (indx, obj) {
						obj.chk = false;
						obj.isPrimary = false;
						$.each(emp_data.data.response, function (indx, obj2) {
							if (obj.id == obj2.salesperson_id) {
								obj.chk = true;
								//  if (obj2.is_primary == 1)     obj.isPrimary = true;

								$scope.selectedLinkTo.push(obj);
							}
						});
						$scope.allLinkto.push(obj);
					});
				}
				//else  toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));

			});
	}

	$scope.isAdded = false;
	$scope.counter = 0;
	$scope.prodCounter = 0;
	$scope.arrIds = [];
	$scope.read_type2 = true;
	$scope.product_type = true;
	$scope.count_result = 0;



	$scope.searchKeyword = '';
	$scope.count_filter_item = function (arry) {

		console.log(arry);

		var brand = '';
		var cat = '';

		if ($scope.searchKeyword.brand_name != undefined)
			brand = $scope.searchKeyword.brand_name;

		if ($scope.searchKeyword.category_name != undefined)
			cat = $scope.searchKeyword.category_name;

		var count = 0;
		var match_b = 0;
		var match_c = 0;

		var count = 0;
		angular.forEach(arry, function (value) {
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

		return Number(count);
	}
}]);