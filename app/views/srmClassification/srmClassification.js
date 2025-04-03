srmClassificationController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

		$stateProvider
			.state('app.srm-supplier-classification', {
				url: '/srm-classification',
				title: 'Setup',
				templateUrl: helper.basepath('srmClassification/srm_supplier_Classification.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.add-srm-classification', {
				url: '/srm-classification/add',
				title: 'Setup',
				templateUrl: helper.basepath('add.html'),
				controller: 'srmClassificationAddController'
			})
			.state('app.view-srm-classification', {
				url: '/srm-classification/:id/view',
				title: 'Setup',
				templateUrl: helper.basepath('view.html'),
				controller: 'srmClassificationAddController'
			})
			.state('app.edit-srm-classification', {
				url: '/srm-classification/:id/edit',
				title: 'Setup',
				templateUrl: helper.basepath('edit.html'),
				controller: 'srmClassificationAddController'
			})
	}]);
/* .state('app.srm-classification', {
				url: '/srm-classification',
				title: 'srm Classification Setup',
				templateUrl: helper.basepath('srmClassification/srmClassification.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			}) */
myApp.controller('srmClassificationController', srmClassificationController);
myApp.controller('srmClassificationAddController', srmClassificationAddController);

function srmClassificationController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
	'use strict';

	$scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
	{ 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
	{ 'name': 'Classification', 'url': '#', 'isActive': false }];

	var vm = this;
	var Api = $scope.$root.setup + "ledger-group/get-all-classification";
	var postData = {
		'token': $scope.$root.token,
		'type': "3, 34"
	};

	$scope.$watch("MyCustomeFilters", function () {
		if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
			$scope.table.tableParams5.reload();
		}
	}, true);

	$scope.rec = {};

	$scope.rec.Serachkeyword = '';

	$scope.columns = [];

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

function srmClassificationAddController($scope, $stateParams, $http, $state, $resource, toaster, ngDialog, $timeout) {

	$scope.formTitle = 'srm Classification';
	$scope.btnCancelUrl = 'app.srm-classification';

	$scope.status = {};
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];
	$scope.showStatus = [{ 'label': 'Enable', 'value': 1 }, { 'label': 'Disable', 'value': 0 }];

	$scope.classification_type = [{ 'label': 'SRM', 'value': 3 }, { 'label': 'srm', 'value': 4 }];

	$scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
	{ 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
	{ 'name': 'SRM Classification', 'url': 'app.srm-classification', 'isActive': false }];

	$scope.formUrl = function () {
		return "app/views/srmClassification/_form.html";
	}

	$scope.rec = {};

	if ($stateParams.id != undefined) {

		var postUrl = $scope.$root.setup + "ledger-group/get-classification";
		var postData = { 'token': $scope.$root.token, 'id': $stateParams.id,'type': 3 };

		$http
			.post(postUrl, postData)
			.then(function (res) {
				if (res.data.ack == true) {
					$scope.rec = res.data.response;
					// $scope.rec.ref_id = 1;// do not allow to delelte, Mo

					/* angular.forEach($scope.classification_type, function (obj) {
						if (obj.value == res.data.response.type) {
							$scope.rec.classification_type = obj;
						}
					}); */

					angular.forEach($scope.arr_status, function (obj) {
						if (obj.value == res.data.response.status) {
							$scope.rec.status = obj;
						}
					});

					if (res.data.response.bstatus > 0)
						$scope.rec.showStatus = $scope.showStatus[0];
					else
						$scope.rec.showStatus = $scope.showStatus[1];

					/* angular.forEach($scope.showStatus, function (obj) {
						if (obj.value == res.data.response.status) {
							$scope.rec.showStatus = obj;
						}
					}); */
				}
				else
					toaster.pop('warning', 'Info', "No VAT Rate Exist!");
			});
		$scope.hideDel = false;
	}
	else {
		$scope.rec.status = $scope.arr_status[0];
		$scope.rec.showStatus = $scope.showStatus[0];
		// $scope.rec.classification_type = $scope.classification_type[0];
		$scope.check_readonly = false;
	}

	$scope.gotoEdit = function () {
		$scope.check_readonly = false;

		var recid = $stateParams.id;
		$state.go("app.edit-srm-classification", { id: $stateParams.id });
	}

	$scope.delete = function () {

		var delUrl = $scope.$root.setup + "ledger-group/delete-classification";
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
							$state.go('app.srm-classification');
						}, 2000);
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
		rec.showStatusid = ($scope.rec.showStatus !== undefined && $scope.rec.showStatus != '') ? $scope.rec.showStatus.value : 0;
		// rec.type = ($scope.rec.classification_type !== undefined && $scope.rec.classification_type != '') ? $scope.rec.classification_type.value : 0;
		rec.type = 3;

		var postUrl = $scope.$root.setup + "ledger-group/update-Classification";
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					$scope.$root.updateSelectedGlobalData("srmclassification");

					$timeout(function () {
						$state.go('app.srm-classification');
					}, 1000);
				}
				else
					toaster.pop('error', 'Add', res.data.error);
			});
	}


	$scope.update = function (rec) {
		rec.token = $scope.$root.token;
		// console.log(rec);
		// console.log(rec.status.value);
		rec.statusid = ($scope.rec.status !== undefined && $scope.rec.status != '') ? $scope.rec.status.value : 0;
		rec.showStatusid = ($scope.rec.showStatus !== undefined && $scope.rec.showStatus != '') ? $scope.rec.showStatus.value : 0;
		// rec.type = ($scope.rec.classification_type !== undefined && $scope.rec.classification_type != '') ? $scope.rec.classification_type.value : 0;
		rec.type = 3;

		var postUrl = $scope.$root.setup + "ledger-group/update-Classification";
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					$scope.$root.updateSelectedGlobalData("srmclassification");

					$timeout(function () {
						$state.go('app.srm-classification');
					}, 2000);
				}
				else
					toaster.pop('error', 'Add', res.data.error);
			});
	}
}