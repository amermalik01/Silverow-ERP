glAccountsSetupOpeningBalncController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

		$stateProvider
			.state('app.gl-accounts-setup-opening-balnc-list', {
				url: '/gl-accounts-setup-opening-balnc-list',
				title: 'Setup',
				templateUrl: helper.basepath('glAccountsSetupOpeningBalnc/glAccountsSetupOpeningBalnc.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.gl-accounts-setup-opening-balnc', {
				url: '/gl-accounts-setup-opening-balnc',
				title: 'Setup',
				templateUrl: helper.basepath('glAccountsSetupOpeningBalnc/_form.html'),
				resolve: helper.resolveFor('ngDialog'),
				controller: 'glAccountsSetupOpeningBalncAddController'
			})
	}]);

myApp.controller('glAccountsSetupOpeningBalncController', glAccountsSetupOpeningBalncController);
myApp.controller('glAccountsSetupOpeningBalncAddController', glAccountsSetupOpeningBalncAddController);

function glAccountsSetupOpeningBalncController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
	'use strict';
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '2' },
		{ 'name': 'G/L Account(s) for Opening Balances Setup', 'url': '#', 'isActive': false }];

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

function glAccountsSetupOpeningBalncAddController($scope, $stateParams, $http, $state, $resource, toaster, ngDialog, $timeout) {

	$scope.formTitle = 'G/L Account(s) Setup for Opening Balances';
	$scope.btnCancelUrl = 'app.setup';
	// console.log($stateParams.id);
	$scope.openingBalncGLReadonly = true;

	$scope.status = {};
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '2' },
		{ 'name': 'G/L Account(s) for Opening Balances', 'url': '#', 'isActive': false }];

	/* $scope.formUrl = function () {
		return "app/views/glAccountsSetupOpeningBalnc/_form.html";
	} */

	$scope.gotoEdit = function () {
		$scope.openingBalncGLReadonly = false;
	}

	$scope.rec = {};
	var postData = {};
	postData.token = $scope.$root.token;

	var Api = $scope.$root.gl + "chart-accounts/get-opening-balance-setup-account";

	$http
		.post(Api, postData)
		.then(function (res) {
			$scope.showLoader = false;

			if (res.data.ack == true) {
				$scope.rec.stockAccountGL = res.data.stock_gl_account;
				$scope.rec.stockAccountGL_code = res.data.stock_gl_account_code;

				$scope.rec.openingBalanceAccountGL = res.data.opening_balance_gl_account;
				$scope.rec.openingBalanceAccountGL_code = res.data.opening_balance_gl_account_code;
			}
			else
				toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

		}).catch(function (message) {
			$scope.showLoader = false;
			// toaster.pop('error', 'info', 'Server is not Acknowledging');
			throw new Error(message.data);
		});


	$scope.add = function (rec) {
		// console.log(rec);
		$scope.postData = {};
		var postUrl_cat = $scope.$root.gl + "chart-accounts/change-opening-balance-setup-account";

		$scope.postData.stock_gl_account = rec.stockAccountGL;
		$scope.postData.opening_balance_gl_account = rec.openingBalanceAccountGL;
		$scope.postData.token = $scope.$root.token;

		$http
			.post(postUrl_cat, $scope.postData)
			.then(function (res) {
				$scope.showLoader = false;
				$scope.openingBalncGLReadonly = true;

				if (res.data.ack == true)
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
				else
					toaster.pop('error', 'Info', res.data.error);

			}).catch(function (message) {
				$scope.showLoader = false;
				// toaster.pop('error', 'info', 'Server is not Acknowledging');
				throw new Error(message.data);
			});
	}

	$scope.getGLcode = function (type) {

		var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";
		$scope.postData = {};
		// $scope.postData.cat_id = [];
		// $scope.postData.cat_id = [3];
		$scope.title = 'G/L Accounts';
		$scope.postData.token = $scope.$root.token;
		// $scope.searchKeyword2 = "";
		$scope.searchKeyword2 = {};

		$scope.showLoader = true;
		$scope.gl_type = type;
		$scope.showAllOption = true;

		$http
			.post(postUrl_cat, $scope.postData)
			.then(function (res) {
				//console.log(res);
				$scope.gl_account = [];
				$scope.showLoader = false;

				if (res.data.ack == true) {
					$scope.gl_account = res.data.response;
					angular.element('#finance_set_gl_account').modal({ show: true });
				}
				else
					toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
			});
	}


	$scope.assignCodes = function (gl_data) {

		if ($scope.gl_type == 1) //Stock Account
		{
			$scope.rec.stockAccountGL_code = gl_data.code + " - " + gl_data.name;
			$scope.rec.stockAccountGL = gl_data.id;
		}
		else if ($scope.gl_type == 2) //opening Balance Account
		{
			$scope.rec.openingBalanceAccountGL_code = gl_data.code + " - " + gl_data.name;
			$scope.rec.openingBalanceAccountGL = gl_data.id;
		}

		angular.element('#finance_set_gl_account').modal('hide');
	}
}