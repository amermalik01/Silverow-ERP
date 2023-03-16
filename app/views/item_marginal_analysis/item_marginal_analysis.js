itemMarginalAnalysisController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

		$stateProvider
			.state('app.item-marginal-analysis', {
				url: '/item-marginal-analysis',
				title: 'Setup',
				templateUrl: helper.basepath('item_marginal_analysis/item_marginal_analysis.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.add-item-marginal-analysis', {
				url: '/item-marginal-analysis/add',
				title: 'Setup',
				templateUrl: helper.basepath('item_marginal_analysis/_form.html'),
				controller: 'itemMarginalAnalysisAddController'
			})
			.state('app.view-item-marginal-analysis', {
				url: '/item-marginal-analysis/:id/view',
				title: 'Setup',
				templateUrl: helper.basepath('item_marginal_analysis/_form.html'),
				controller: 'itemMarginalAnalysisAddController'
			})
			.state('app.edit-item-marginal-analysis', {
				url: '/item-marginal-analysis/:id/edit',
				title: 'Setup',
				templateUrl: helper.basepath('item_marginal_analysis/_form.html'),
				controller: 'itemMarginalAnalysisAddController'
			})
	}]);

myApp.controller('itemMarginalAnalysisController', itemMarginalAnalysisController);
myApp.controller('itemMarginalAnalysisAddController', itemMarginalAnalysisAddController);

function itemMarginalAnalysisController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
	'use strict';

	$scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
	{ 'name': 'Inventory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
	{ 'name': 'Item Margin Analysis', 'url': '#', 'isActive': false }];

	var vm = this;
	var Api = $scope.$root.setup + "ledger-group/get-all-item-additional-cost";

	var postData = {
		'token': $scope.$root.token,
		'type': 2,
		'notAllowed':1
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

function itemMarginalAnalysisAddController($scope, $stateParams, $http, $state, $resource, toaster, ngDialog, $timeout) {

	$scope.formTitle = 'Item Margin Analysis';
	$scope.btnCancelUrl = 'app.item-marginal-analysis';
	// console.log($stateParams.id);

	$scope.check_readonly = true;

	$scope.status = {};
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

	$scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
	{ 'name': 'Inventory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
	{ 'name': 'Item Margin Analysis', 'url': 'app.item-marginal-analysis', 'isActive': false }];

	/* $scope.formUrl = function () {
		return "app/views/item_marginal_analysis/_form.html";
	}
 */
	$scope.rec = {};

	if ($stateParams.id != undefined) {
		// $scope.check_readonly = true;
		var postUrl = $scope.$root.setup + "ledger-group/get-item-additional-cost";
		var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };
		$scope.showLoader = true;
		$http
			.post(postUrl, postData)
			.then(function (res) {
				if (res.data.ack == true) {
					$scope.rec = res.data.response;
					console.log($scope.rec);
					angular.forEach($scope.arr_status, function (obj) {
						console.log(obj.label);
						if (obj.value == res.data.response.status) {
							$scope.rec.status = obj;
						}
					});
				}
				else
					toaster.pop('warning', 'Info', "No Item Margin Analysis Exist!");

					$scope.showLoader = false;
			});
			
		$scope.hideDel = false;
		$scope.check_readonly = true;
	} else {

		$scope.rec.status = $scope.arr_status[0];
		$scope.check_readonly = false;
	}

	$scope.gotoEdit = function () {
		$scope.check_readonly = false;
		// 
		// $state.go('app.vat-setup');
		// var recid = $stateParams.id;
		// $state.go("app.edit-item-marginal-analysis", { id: $stateParams.id });
	}

	$scope.delete = function () {

		var delUrl = $scope.$root.setup + "ledger-group/delete-item-additional-cost";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token, type: 'MarginAnal' })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						/* var index = arr_data.indexOf(rec.id);
						arr_data.splice(index, 1); */
						$timeout(function () {
							$state.go('app.item-marginal-analysis');
						}, 1500);
					} else {
						toaster.pop('error', 'Deleted', res.data.error);
					}
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});
	}


	$scope.add = function (rec) {
		rec.token = $scope.$root.token;
		$scope.showLoader = true;
		// console.log(rec);
		// console.log(rec.status.value);
		rec.statusid = ($scope.rec.status !== undefined && $scope.rec.status != '') ? $scope.rec.status.value : 0;
		rec.type = 2;
		var postUrl = $scope.$root.setup + "ledger-group/update-item-additional-cost";
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

					$timeout(function () {
						$state.go('app.item-marginal-analysis');
					}, 2000);
				}
				else
					toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));

					$scope.showLoader = false;
			});
	}

	$scope.update = function (rec) {
		rec.token = $scope.$root.token;
		// console.log(rec);
		// console.log(rec.status.value);
		$scope.showLoader = true;
		rec.statusid = ($scope.rec.status !== undefined && $scope.rec.status != '') ? $scope.rec.status.value : 0;
		rec.type = 2;

		var postUrl = $scope.$root.setup + "ledger-group/update-item-additional-cost";
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

					$timeout(function () {
						$state.go('app.item-marginal-analysis');
					}, 2000);
				}
				else
					toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));

					$scope.showLoader = false;
			});
	}

}