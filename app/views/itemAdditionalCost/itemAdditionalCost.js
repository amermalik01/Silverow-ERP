itemAdditionalCostController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

		$stateProvider
			.state('app.item-additional-cost', {
				url: '/item-additional-cost',
				title: 'Item Additional Cost',
				templateUrl: helper.basepath('itemAdditionalCost/itemAdditionalCost.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.add-item-additional-cost', {
				url: '/item-additional-cost/add',
				title: 'Add Item Additional Cost',
				templateUrl: helper.basepath('add.html'),
				controller: 'itemAdditionalCostAddController'
			})
			.state('app.view-item-additional-cost', {
				url: '/item-additional-cost/:id/view',
				title: 'View Item Additional Cost',
				templateUrl: helper.basepath('view.html'),
				controller: 'itemAdditionalCostAddController'
			})
			.state('app.edit-item-additional-cost', {
				url: '/item-additional-cost/:id/edit',
				title: 'Edit Item Additional Cost',
				templateUrl: helper.basepath('edit.html'),
				controller: 'itemAdditionalCostAddController'
			})
	}]);

myApp.controller('itemAdditionalCostController', itemAdditionalCostController);
myApp.controller('itemAdditionalCostAddController', itemAdditionalCostAddController);

function itemAdditionalCostController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
	'use strict';

	$scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
	{ 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
	{ 'name': 'Item Additional Cost', 'url': '#', 'isActive': false }];

	var vm = this;
	var Api = $scope.$root.setup + "ledger-group/get-all-item-additional-cost";
	var postData = {
		'token': $scope.$root.token,
		'type': 1,
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

function itemAdditionalCostAddController($scope, $stateParams, $http, $state, $resource, toaster, ngDialog, $timeout) {

	$scope.formTitle = 'Item Additional Cost';
	$scope.btnCancelUrl = 'app.item-additional-cost';
	// console.log($stateParams.id);

	$scope.status = {};
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

	$scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
	{ 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
	{ 'name': 'Item Additional Cost', 'url': 'app.item-additional-cost', 'isActive': false }];

	$scope.formUrl = function () {
		return "app/views/itemAdditionalCost/_form.html";
	}

	$scope.rec = {};

	if ($stateParams.id != undefined) {
		// $scope.check_readonly = true;
		var postUrl = $scope.$root.setup + "ledger-group/get-item-additional-cost";
		var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

		$http
			.post(postUrl, postData)
			.then(function (res) {
				if (res.data.ack == true) {
					$scope.rec = res.data.response;
					$scope.rec.deletePerm = 1;

					angular.forEach($scope.arr_status, function (obj) {
						console.log(obj.label);
						if (obj.value == res.data.response.status) {
							$scope.rec.status = obj;
						}
					});
				}
				else
					toaster.pop('warning', 'Info', "No item additional cost Exist!");
			});
		$scope.hideDel = false;
	} else {

		$scope.rec.status = $scope.arr_status[0];
		$scope.check_readonly = false;
	}

	$scope.gotoEdit = function () {
		$scope.check_readonly = false;
		// 
		// $state.go('app.vat-setup');
		var recid = $stateParams.id;
		$state.go("app.edit-item-additional-cost", { id: $stateParams.id });
	}

	$scope.delete = function () {

		var delUrl = $scope.$root.setup + "ledger-group/delete-item-additional-cost";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token, type: 'AddCost' })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						/* var index = arr_data.indexOf(rec.id);
						arr_data.splice(index, 1); */
						$timeout(function () {
							$state.go('app.item-additional-cost');
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
		// console.log(rec);
		// console.log(rec.status.value);
		rec.statusid = ($scope.rec.status !== undefined && $scope.rec.status != '') ? $scope.rec.status.value : 0;
		rec.type = 1;
		var postUrl = $scope.$root.setup + "ledger-group/update-item-additional-cost";
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

					$timeout(function () {
						$state.go('app.item-additional-cost');
					}, 2000);
				}
				else
					toaster.pop('error', 'Error', res.data.error);
				// toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
			});
	}

	$scope.update = function (rec) {
		rec.token = $scope.$root.token;
		// console.log(rec);
		// console.log(rec.status.value);
		rec.statusid = ($scope.rec.status !== undefined && $scope.rec.status != '') ? $scope.rec.status.value : 0;

		var postUrl = $scope.$root.setup + "ledger-group/update-item-additional-cost";
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					$timeout(function () {
						$state.go('app.item-additional-cost');
					}, 1000);
				} else if (res.data.ack == 2) {
					toaster.pop('success', 'Edit', 'Record Update with no changes');
					$timeout(function () {
						$state.go('app.item-additional-cost');
					}, 1000);
				}
				else
					toaster.pop('error', 'Error', res.data.error);
				// toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
			});
	}

}