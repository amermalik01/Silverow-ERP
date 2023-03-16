VatSetupController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

		$stateProvider
			.state('app.vat-setup', {
				url: '/vat-setup',
				title: 'Setup',
				templateUrl: helper.basepath('vat_setup/vat_setup.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.add-vat-setup', {
				url: '/vat-setup/add',
				title: 'Setup',
				templateUrl: helper.basepath('add.html'),
				controller: 'VatSetupAddController'
			})
			.state('app.view-vat-setup', {
				url: '/vat-setup/:id/view',
				title: 'Setup',
				templateUrl: helper.basepath('view.html'),
				controller: 'VatSetupAddController'
			})
			.state('app.edit-vat-setupRate', {
				url: '/vat-setup/:id/edit',
				title: 'Setup',
				templateUrl: helper.basepath('edit.html'),
				controller: 'VatSetupAddController'
			})
	}]);

myApp.controller('VatSetupController', VatSetupController);
myApp.controller('VatSetupAddController', VatSetupAddController);
// myApp.controller('VatSetupViewController', VatSetupViewController);
// myApp.controller('VatSetupEditController', VatSetupEditController);

function VatSetupController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
	'use strict';
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '2' },
		{ 'name': 'VAT Rates', 'url': '#', 'isActive': false }];

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

function VatSetupAddController($scope, $stateParams, $http, $state, $resource, toaster, ngDialog, $timeout) {

	$scope.formTitle = 'Vat Setup';
	$scope.btnCancelUrl = 'app.vat-setup';
	// console.log($stateParams.id);

	$scope.status = {};
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '2' },
		{ 'name': 'VAT Rates', 'url': 'app.vat-setup', 'isActive': false }];

	$scope.formUrl = function () {
		return "app/views/vat_setup/_form.html";
	}

	$scope.rec = {};



	if ($stateParams.id != undefined) {

		$scope.showLoader = true;
		// $scope.check_readonly = true;
		var postUrl = $scope.$root.setup + "ledger-group/get-vat";
		var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

		$http
			.post(postUrl, postData)
			.then(function (res) {
				if (res.data.ack == true) {


					$scope.rec = res.data.response;
					$scope.rec.vat_value = Number(res.data.response.vat_value);
					$scope.rec.deletePerm = 1;

					angular.forEach($scope.arr_status, function (obj) {
						if (obj.label == res.data.response.status) {
							$scope.rec.status = obj;
						}
					});
				}
				else
					toaster.pop('warning', 'Info', "No VAT Rate Exist!");

				$scope.showLoader = false;
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
		$state.go("app.edit-vat-setupRate", { id: $stateParams.id });
	}

	$scope.delete = function () {

		var delUrl = $scope.$root.setup + "ledger-group/delete-VatRate";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						/* var index = arr_data.indexOf(rec.id);
						arr_data.splice(index, 1); */
						$timeout(function () {
							$state.go('app.vat-setup');
						}, 1500);
					}
					else {
						toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
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

		var postUrl = $scope.$root.setup + "ledger-group/update-VatRate";
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

					$timeout(function () {
						$state.go('app.vat-setup');
					}, 1000);
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

		var postUrl = $scope.$root.setup + "ledger-group/update-VatRate";
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));

					$timeout(function () {
						$state.go('app.vat-setup');
					}, 1500);
				}
				else
					toaster.pop('error', 'Error', res.data.error);
					// toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
			});
	}

}