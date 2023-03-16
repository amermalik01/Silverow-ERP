CurrencyMovementSetupController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

		$stateProvider
			.state('app.currency-movement', {
				url: '/currency-movement',
				title: 'Setup',
				templateUrl: helper.basepath('currency_movement/currency_movement.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.add-currency-movement', {
				url: '/add-currency-movement',
				title: 'Setup',
				// templateUrl: helper.basepath('add.html'),
				templateUrl: helper.basepath('currency_movement/_form.html'),
				resolve: helper.resolveFor('ngDialog'),
				controller: 'CurrencyMovementAddController'
			})
	}]);

myApp.controller('CurrencyMovementSetupController', CurrencyMovementSetupController);
myApp.controller('CurrencyMovementAddController', CurrencyMovementAddController);

function CurrencyMovementSetupController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
	'use strict';
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '2' },
		{ 'name': 'Currency Movement', 'url': '#', 'isActive': false }];

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

function CurrencyMovementAddController($scope, $stateParams, $http, $state, $resource, toaster, ngDialog, $timeout) {

	$scope.formTitle = 'Currency Movement Setup';
	$scope.btnCancelUrl = 'app.setup';
	// console.log($stateParams.id);

	$scope.status = {};
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

	$scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
	{ 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '2' },
	{ 'name': 'G/L Account(s) Setup for Foreign Currency Movement', 'url': '#', 'isActive': false }];

	$scope.formUrl = function () {
		return "app/views/currency_movement/_form.html";
	}

	$scope.currencyMovementReadonly = true;

	$scope.gotoEdit = function () {
		$scope.currencyMovementReadonly = false;
	}

	$scope.rec = {};
	var postData = {};

	$scope.showLoader = true;
	postData.token = $scope.$root.token;
	var postUrl = $scope.$root.gl + "chart-accounts/get-currency-movements";
	$http
		.post(postUrl, postData)
		.then(function (res) {

			$scope.showLoader = false;

			if (res.data.ack == true) {
				$scope.currencyMovementReadonly = true;
				$scope.rec = res.data.response[0];
				$scope.rec.realised_gain_gl_display_name = $scope.rec.realised_gain_gl_code + ' - ' + $scope.rec.realised_gain_gl_name;
				$scope.rec.realised_loss_gl_display_name = $scope.rec.realised_loss_gl_code + ' - ' + $scope.rec.realised_loss_gl_name;
				$scope.rec.unrealised_gain_gl_display_name = $scope.rec.unrealised_gain_gl_code + ' - ' + $scope.rec.unrealised_gain_gl_name;
				$scope.rec.unrealised_loss_gl_display_name = $scope.rec.unrealised_loss_gl_code + ' - ' + $scope.rec.unrealised_loss_gl_name;

			}
			// else
			// 	toaster.pop('error', 'Add', 'Currency movements not found!');
		});


	$scope.add = function (rec) {

		if ($scope.rec.realised_gain_gl_id == undefined || $scope.rec.realised_loss_gl_id == undefined ||
			$scope.rec.unrealised_gain_gl_id == undefined || $scope.rec.unrealised_loss_gl_id == undefined) {
			toaster.pop('error', 'Error', 'Please specify all the G/L accounts');
			return;
		}
		rec.token = $scope.$root.token;
		$scope.showLoader = true;

		var postUrl = $scope.$root.gl + "chart-accounts/update-currency-movements";
		$http
			.post(postUrl, rec)
			.then(function (res) {
				$scope.showLoader = false;
				if (res.data.ack == true) {
					$scope.currencyMovementReadonly = true;
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));

					$timeout(function () {
						$scope.$root.currentSetupTab = 2;
						$state.go('app.setup');
					}, 1000);
				}
				else
					toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
			});
	}


	$scope.getGLcode = function (type) { //item_paging
		// console.log("here");
		var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";

		$scope.postData = {};
		$scope.postData.cat_id = [];
		$scope.postData.cat_id = [13];

		$scope.postData.token = $scope.$root.token;

		$scope.Serachkeyword = {};

        /* if (item_paging == 1)
            $rootScope.item_paging.spage = 1;
        $scope.postData.page = $rootScope.item_paging.spage;

        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0; */
		// $scope.postData.pagination_limits = 25;

		$scope.postData.searchKeyword = "";

		if ($scope.postData.pagination_limits == -1) {
			$scope.postData.page = -1;
			$scope.searchKeyword = {};
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

		if (type == 1) //Realised Currency Gain
		{
			$scope.rec.realised_gain_gl_id = gl_data.id;
			$scope.rec.realised_gain_gl_name = gl_data.name;
			$scope.rec.realised_gain_gl_code = gl_data.code;
			$scope.rec.realised_gain_gl_display_name = gl_data.code + ' - ' + gl_data.name;
		}
		else if (type == 2) //Realised Currency Loss
		{
			$scope.rec.realised_loss_gl_id = gl_data.id;
			$scope.rec.realised_loss_gl_name = gl_data.name;
			$scope.rec.realised_loss_gl_code = gl_data.code;
			$scope.rec.realised_loss_gl_display_name = gl_data.code + ' - ' + gl_data.name;
		}
		else if (type == 3) //Un-Realised Currency Gain
		{
			$scope.rec.unrealised_gain_gl_id = gl_data.id;
			$scope.rec.unrealised_gain_gl_name = gl_data.name;
			$scope.rec.unrealised_gain_gl_code = gl_data.code;
			$scope.rec.unrealised_gain_gl_display_name = gl_data.code + ' - ' + gl_data.name;
		}
		else if (type == 4) //Un-Realised Currency Loss
		{
			$scope.rec.unrealised_loss_gl_id = gl_data.id;
			$scope.rec.unrealised_loss_gl_name = gl_data.name;
			$scope.rec.unrealised_loss_gl_code = gl_data.code;
			$scope.rec.unrealised_loss_gl_display_name = gl_data.code + ' - ' + gl_data.name;
		}
		angular.element('#gl_account_popup').modal('hide');
	}
}