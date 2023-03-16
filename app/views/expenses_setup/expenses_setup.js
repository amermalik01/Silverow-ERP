ExpenseSetupSetupController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

		$stateProvider
			/* .state('app.expenses-setup', {
				url: '/expenses-setup1',
				title: 'Expense Setup',
				templateUrl: helper.basepath('expenses_setup/expenses_setup.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			}) */
			.state('app.add-expenses-setup', {
				url: '/add-expenses-setup',
				title: 'Setup',
				templateUrl: helper.basepath('expenses_setup/_form.html'),
				resolve: helper.resolveFor('ngDialog'),
				controller: 'ExpenseSetupAddController'
			})
	}]);

myApp.controller('ExpenseSetupSetupController', ExpenseSetupSetupController);
myApp.controller('ExpenseSetupAddController', ExpenseSetupAddController);

function ExpenseSetupSetupController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
	'use strict';
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
		{ 'name': 'Expense Setup', 'url': '#', 'isActive': false }];

	var vm = this;
	var Api = $scope.$root.setup + "ledger-group/get-all-vatRate";
	var postData = {
		'token': $scope.$root.token
	};

	$scope.$watch("MyCustomeFilters", function () {
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
		});

}

function ExpenseSetupAddController($scope, $stateParams, $http, $state, $resource, toaster, ngDialog, $timeout) {

	$scope.formTitle = 'Expense Setup';
	$scope.btnCancelUrl = 'app.setup';
	// console.log($stateParams.id);

	$scope.status = {};
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

	$scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
	{ 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
	{ 'name': 'Expense Setup', 'url': '#', 'isActive': false }];

	/* $scope.formUrl = function () {
		return "app/views/expenses_setup/_form.html";
	} */

	$scope.rec = {};
	var postData = {};
	postData.token = $scope.$root.token;
	var postUrl = $scope.$root.hr + "hr_values/get-expenses-setup";
	$scope.showLoader = true;
	$scope.setup_expense_readonly = true;
	$http
		.post(postUrl, postData)
		.then(function (res) {

			if (res.data.ack == true) {
				$scope.rec = res.data.response;
				$scope.rec.supplier_display_name = $scope.rec.supplier_code + ' - ' + $scope.rec.supplier_name;
				$scope.rec.accomodation_gl_display_name = $scope.rec.accomodation_gl_code + ' - ' + $scope.rec.accomodation_gl_name;
				$scope.rec.travel_gl_display_name = $scope.rec.travel_gl_code + ' - ' + $scope.rec.travel_gl_name;
				$scope.rec.communication_gl_display_name = $scope.rec.communication_gl_code + ' - ' + $scope.rec.communication_gl_name;
				$scope.rec.entertainment_gl_display_name = $scope.rec.entertainment_gl_code + ' - ' + $scope.rec.entertainment_gl_name;
				$scope.rec.food_gl_display_name = $scope.rec.food_gl_code + ' - ' + $scope.rec.food_gl_name;
				$scope.rec.misc_gl_display_name = $scope.rec.misc_gl_code + ' - ' + $scope.rec.misc_gl_name;
				$scope.rec.millage_gl_display_name = $scope.rec.millage_gl_code + ' - ' + $scope.rec.millage_gl_name;
				$scope.showLoader = false;
			}
			else
			{
				$scope.showLoader = false;
				// toaster.pop('error', 'Add', 'Expense Setups not found!');
			}
		});


	$scope.showEditForm = function()
	{
		$scope.setup_expense_readonly = false;
	}
	$scope.add = function (rec) {

		if ($scope.rec.supplier_id == undefined || $scope.rec.accomodation_gl_id == undefined ||
			$scope.rec.travel_gl_id == undefined || $scope.rec.communication_gl_id == undefined ||
			$scope.rec.entertainment_gl_id == undefined || $scope.rec.food_gl_id == undefined ||
			$scope.rec.misc_gl_id == undefined || $scope.rec.millage_gl_id == undefined) {
			toaster.pop('error', 'Error', 'Please specify all the fields');
			return;
		}
		rec.token = $scope.$root.token;

		var postUrl = $scope.$root.hr + "hr_values/update-expenses-setup";
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					$scope.setup_expense_readonly = true;
					/* $timeout(function () {
						$scope.$root.currentSetupTab = 4;
						$state.go('app.setup');
					}, 1000); */
				}
				else
					toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
			});
	}


	$scope.getGLcode = function (type) { //item_paging
		// console.log("here");
		// var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";
		var postUrl_cat = $scope.$root.gl + "chart-accounts/get-gl-accounts-heading-by-cat-id";

		$scope.postData = {};
		$scope.postData.cat_id = [];
		$scope.postData.cat_id = [];

		$scope.postData.token = $scope.$root.token;

		$scope.Searchkeyword = {};

        /* if (item_paging == 1)
            $rootScope.item_paging.spage = 1;
        $scope.postData.page = $rootScope.item_paging.spage;

        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0; */
		// $scope.postData.pagination_limits = 25;

		$scope.postData.Searchkeyword = "";

		if ($scope.postData.pagination_limits == -1) {
			$scope.postData.page = -1;
			$scope.Searchkeyword = {};
			$scope.record_data = {};
		}

		$scope.showLoader = true;

		$http
			.post(postUrl_cat, $scope.postData)
			.then(function (res) {
				//console.log(res);
				$scope.column_gl = [];
				$scope.record_gl = {};
				$scope.gl_account = [];
				$scope.gl_type = type;
				$scope.showLoader = false;

				if (res.data.ack == true) {
					$scope.total = res.data.total;
					$scope.total_paging_record = res.data.total_paging_record;

					$scope.record = res.data.response;
					$scope.record_data = res.data.response;

					$scope.category_list = res.data.response;

					$scope.record_gl = res.data.response_account;

					$.each(res.data.response, function (index, obj) {
						$scope.gl_account[index] = obj;
					});

					angular.element('#gl_account_popup').modal({ show: true });
				}
				else
					toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
			});
	}

	$scope.assignCodes = function (gl_data, type) {
		console.log(gl_data['id']);
		console.log(type);
		if (type == 1) //Realised accomodation_gl_id
		{
			$scope.rec.accomodation_gl_id = gl_data['id'];
			$scope.rec.accomodation_gl_name = gl_data['G/L Name'];
			$scope.rec.accomodation_gl_code = gl_data['G/L No.'];
			$scope.rec.accomodation_gl_display_name = gl_data['G/L No.'] + ' - ' + gl_data['G/L Name'];
		}
		else if (type == 2) //travel_gl_id
		{
			$scope.rec.travel_gl_id = gl_data['id'];
			$scope.rec.travel_gl_name = gl_data['G/L Name'];
			$scope.rec.travel_gl_code = gl_data['G/L No.'];
			$scope.rec.travel_gl_display_name = gl_data['G/L No.'] + ' - ' + gl_data['G/L Name'];
		}
		else if (type == 3) //communication_gl_id
		{
			$scope.rec.communication_gl_id = gl_data['id'];
			$scope.rec.communication_gl_name = gl_data['G/L Name'];
			$scope.rec.communication_gl_code = gl_data['G/L No.'];
			$scope.rec.communication_gl_display_name = gl_data['G/L No.'] + ' - ' + gl_data['G/L Name'];
		}
		else if (type == 4) //entertainment_gl_id
		{
			$scope.rec.entertainment_gl_id = gl_data['id'];
			$scope.rec.entertainment_gl_name = gl_data['G/L Name'];
			$scope.rec.entertainment_gl_code = gl_data['G/L No.'];
			$scope.rec.entertainment_gl_display_name = gl_data['G/L No.'] + ' - ' + gl_data['G/L Name'];
		}
		else if (type == 5) //entertainment_gl_id
		{
			$scope.rec.food_gl_id = gl_data['id'];
			$scope.rec.food_gl_name = gl_data['G/L Name'];
			$scope.rec.food_gl_code = gl_data['G/L No.'];
			$scope.rec.food_gl_display_name = gl_data['G/L No.'] + ' - ' + gl_data['G/L Name'];
		}
		else if (type == 6) //misc_gl_id
		{
			$scope.rec.misc_gl_id = gl_data['id'];
			$scope.rec.misc_gl_name = gl_data['G/L Name'];
			$scope.rec.misc_gl_code = gl_data['G/L No.'];
			$scope.rec.misc_gl_display_name = gl_data['G/L No.'] + ' - ' + gl_data['G/L Name'];
		}
		else if (type == 7) //millage_gl_id
		{
			$scope.rec.millage_gl_id = gl_data['id'];
			$scope.rec.millage_gl_name = gl_data['G/L Name'];
			$scope.rec.millage_gl_code = gl_data['G/L No.'];
			$scope.rec.millage_gl_display_name = gl_data['G/L No.'] + ' - ' + gl_data['G/L Name'];
		}
		angular.element('#gl_account_popup').modal('hide');
	}
	/* getSupplierList */
	$scope.item_paging = {};
	$scope.searchKeywordSupp = {};

	$scope.get_supplier = function(item_paging)
	{
		$scope.title = 'Supplier Listing';

		$scope.postData = {};
		$scope.postData.token = $scope.$root.token;
		$scope.postData.type = 1;
		
		if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;
        $scope.postData.searchKeyword = $scope.searchKeywordSupp;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeywordSupp = {};
            $scope.record_data = {};
        }
		$scope.showLoader = true;
		var supplierUrl = $scope.$root.pr + "supplier/supplier/supplierListings";
		
		$http
            .post(supplierUrl, $scope.postData)
            .then(function (res) {
                $scope.columns = [];
                $scope.record = {};
                $scope.showLoader = false;
                $scope.supplierTableData = res;

                if (res.data.ack == true) {
                    /* $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record; */

                    angular.element('#listing_sp_single_Modal').modal({ show: true });

                    /* $scope.record = res.data.response;
                    $scope.record_invoice = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
                        if (index != "country" && index != "purchase_code") {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }
                    }); */
                }
                else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
			});
	}
	$scope.confirm_supp_single = function (result) {
		$scope.rec.supplier_id = result.id;
		$scope.rec.supplier_code = result.code;
		$scope.rec.supplier_display_name = result.code+'- '+result.name;
		
		angular.element('#listing_sp_single_Modal').modal('hide');
    }

}