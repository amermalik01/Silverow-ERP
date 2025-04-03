vatPostingGroupSetupController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

		$stateProvider
			.state('app.vat-posting-grp-setup', {
				url: '/vat-posting-group',
				title: 'Setup',
				templateUrl: helper.basepath('vatPostingGroupSetup/vatPostingGroupSetup.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.add-vat-posting-group', {
				url: '/vat-posting-group/add',
				title: 'Setup',
				templateUrl: helper.basepath('add.html'),
				controller: 'vatPostingGroupSetupAddController'
			})
			.state('app.view-vat-posting-group', {
				url: '/vat-posting-group/:id/view',
				title: 'Setup',
				templateUrl: helper.basepath('view.html'),
				controller: 'vatPostingGroupSetupAddController'
			})
			.state('app.edit-vat-posting-group', {
				url: '/vat-posting-group/:id/edit',
				title: 'Setup',
				templateUrl: helper.basepath('edit.html'),
				controller: 'vatPostingGroupSetupAddController'
			})
	}]);

myApp.controller('vatPostingGroupSetupController', vatPostingGroupSetupController);
myApp.controller('vatPostingGroupSetupAddController', vatPostingGroupSetupAddController);

function vatPostingGroupSetupController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
	'use strict';

	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '2' },
		{ 'name': 'VAT Posting Setup', 'url': '#', 'isActive': false }];

	var vm = this;
	var Api = $scope.$root.setup + "ledger-group/get-all-vat-posting-grp-setup";
	var postData = {
		'token': $scope.$root.token
	};

	$scope.mainRecords = [];
	$scope.columns = [];
	$http
		.post(Api, postData)
		.then(function (res) {
			if (res.data.ack == true) {
				// console.log(res.data);
				$scope.mainRecords = res.data.response;

				angular.forEach(res.data.response[0], function (val, index) {
					$scope.columns.push({
						'title': toTitleCase(index),
						'field': index,
						'visible': true
					});
				});
			}
		});

	/* $scope.$watch("MyCustomeFilters", function () {
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
		}); */
}

function vatPostingGroupSetupAddController($scope, $stateParams, $http, $state, $resource, toaster, ngDialog, $timeout) {

	$scope.formTitle = 'VAT Posting Group Setup';
	$scope.btnCancelUrl = 'app.vat-posting-grp-setup';
	// console.log($stateParams.id);

	// $scope.status = {};
	// $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];
	
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '2' },
		{ 'name': 'VAT Posting Setup', 'url': 'app.vat-posting-grp-setup', 'isActive': false }];

	$scope.postingGroup = [];
	$scope.vatRate = [];

	$scope.formUrl = function () {
		return "app/views/vatPostingGroupSetup/_form.html";
	}

	if ($stateParams.id != undefined) {
		// $scope.check_readonly = true;
		var postUrl = $scope.$root.setup + "ledger-group/get-vat-posting-grp-setup";
		var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

		$http
			.post(postUrl, postData)
			.then(function (res) {
				$scope.rec = {};
				if (res.data.ack == true) {
					$scope.rec = res.data.response;
					$scope.rec.deletePerm = 1;
					$scope.vatRate = res.data.vatRate.response;
					$scope.postingGroup = res.data.postingGrp.response;

					angular.forEach($scope.postingGroup, function (obj) {
						if (obj.id == res.data.response.postingGrpID) {
							$scope.rec.posting_grp = obj;
						}
					});

					angular.forEach($scope.vatRate, function (obj) {
						if (obj.id == res.data.response.vatRateID) {
							$scope.rec.vat_rate = obj;
						}
					});

					$scope.rec.vat = Number(res.data.response.vat);
				}
				else
					toaster.pop('warning', 'Info', "No VAT Rate Exist!");
			});
		$scope.hideDel = false;
	} else {
		$scope.rec = {};

		var postUrl1 = $scope.$root.setup + "ledger-group/get-vat-posting-grp-setup-predata";
		var postData1 = { 'token': $scope.$root.token };

		$http
			.post(postUrl1, postData1)
			.then(function (res) {
				if (res.data.ack == true) {

					// console.log(res.data);
					$scope.postingGroup = res.data.postingGroup;
					$scope.vatRate = res.data.vatRate.response;
				}
				else
					toaster.pop('warning', 'Info', "No VAT Rate Exist!");
			});
		$scope.check_readonly = false;
	}

	$scope.gotoEdit = function () {
		$scope.check_readonly = false;
		var recid = $stateParams.id;
		$state.go("app.edit-vat-posting-group", { id: $stateParams.id });
	}

	$scope.delete = function () {

		var delUrl = $scope.$root.setup + "ledger-group/delete-vat-posting-grp-setup";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						$timeout(function () {
							$state.go('app.vat-posting-grp-setup');
						}, 1000);
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
		rec.posting_grpid = ($scope.rec.posting_grp !== undefined && $scope.rec.posting_grp != '') ? $scope.rec.posting_grp.id : 0;
		rec.vat_rateid = ($scope.rec.vat_rate !== undefined && $scope.rec.vat_rate != '') ? $scope.rec.vat_rate.id : 0;

		if (Number($scope.rec.vat) > 100) {
			$scope.rec.vat = '';
			toaster.pop('error', 'Error', 'VAT % should not be greater than 100');
		}

		var postUrl = $scope.$root.setup + "ledger-group/update-vat-posting-grp-setup";
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

					$timeout(function () {
						$state.go('app.vat-posting-grp-setup');
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
		rec.posting_grpid = ($scope.rec.posting_grp !== undefined && $scope.rec.posting_grp != '') ? $scope.rec.posting_grp.id : 0;
		rec.vat_rateid = ($scope.rec.vat_rate !== undefined && $scope.rec.vat_rate != '') ? $scope.rec.vat_rate.id : 0;

		if (Number($scope.rec.vat) > 100) {
			$scope.rec.vat = '';
			toaster.pop('error', 'Error', 'VAT % should not be greater than 100');
		}

		var postUrl = $scope.$root.setup + "ledger-group/update-vat-posting-grp-setup";
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));

					$timeout(function () {
						$state.go('app.vat-posting-grp-setup');
					}, 2000);
				}
				else
					toaster.pop('error', 'Error', res.data.error);
					// toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
			});
	}
}