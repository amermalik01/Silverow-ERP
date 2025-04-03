PostingDateRangeSetupController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

		$stateProvider
			.state('app.add-posting-date-range', {
				url: '/posting-date-range/view',
				title: 'Setup',
				templateUrl: helper.basepath('view.html'),
				resolve: helper.resolveFor('ngDialog'),
				controller: 'PostingDateRangeAddController'
			})
			.state('app.view-posting-date-range', {
				url: '/posting-date-range/view',
				title: 'Setup',
				templateUrl: helper.basepath('view.html'),
				controller: 'PostingDateRangeAddController'
			})
			.state('app.edit-posting-date-range', {
				url: '/posting-date-range/edit',
				title: 'Setup',
				templateUrl: helper.basepath('edit.html'),
				controller: 'PostingDateRangeAddController'
			})
	}]);

myApp.controller('PostingDateRangeSetupController', PostingDateRangeSetupController);
myApp.controller('PostingDateRangeAddController', PostingDateRangeAddController);
// myApp.controller('VatSetupViewController', VatSetupViewController);
// myApp.controller('VatSetupEditController', VatSetupEditController);

function PostingDateRangeSetupController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
	'use strict';
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '2' },
		{ 'name': 'Posting Date Range', 'url': '#', 'isActive': false }];

	/* var vm = this;
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
 */
}

PostingDateRangeAddController.$inject = ["$scope", "$stateParams", "$http", "$state", "$resource", "toaster", "$timeout"];

function PostingDateRangeAddController($scope, $stateParams, $http, $state, $resource, toaster, $timeout) {

	$scope.formTitle = 'Posting Date Range Setup';
	$scope.btnCancelUrl = 'app.setup';
	// console.log($stateParams.id);

	$scope.status = {};
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '2' },
		{ 'name': 'Posting Date Range', 'url': '#', 'isActive': false }];

	$scope.formUrl = function () {
		return "app/views/posting_date_range/_form.html";
	}

	$scope.check_readonly = true;
	if ($state.current.name == "app.edit-posting-date-range") {
		$scope.check_readonly = false;
	}

	$scope.gotoEdit = function () {
		$scope.check_readonly = false;
		var recid = $stateParams.id;
		$state.go("app.edit-posting-date-range", { id: $stateParams.id });

	}

	$scope.rec = {};
	var postData = {};
	postData.token = $scope.$root.token;
	var postUrl = $scope.$root.gl + "chart-accounts/get-posting-date-range";
	$http
		.post(postUrl, postData)
		.then(function (res) {
			if (res.data.ack == true) {
				$scope.rec = res.data.response;
			}
			else
				toaster.pop('error', 'Add', 'Posting Date Ranges not found!');
		});


	$scope.update = function (rec) {

		var startDate = $scope.rec.start_date.trim().split('/');
		startDate = new Date(startDate[2], startDate[1] - 1, startDate[0]);

		var endDate = $scope.rec.end_date.trim().split('/');
		endDate = new Date(endDate[2], endDate[1] - 1, endDate[0]);

		if (endDate < startDate) {
			toaster.pop('error', 'Info', "End Date is earlier than Start Date");
			return;
		}


		rec.token = $scope.$root.token;

		var postUrl = $scope.$root.gl + "chart-accounts/update-posting-date-range";
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
					$timeout(function () {
						$state.go("app.view-posting-date-range", { id: $stateParams.id });
					}, 1000)
				}
				else
					toaster.pop('error', 'Error', res.data.error);
				// toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
			});
	}
}