SrmShipmentMethodsController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		/* specific routes here (see file config.js) */
		$stateProvider
			.state('app.srm-shipment-methods', {
				url: '/srm-shipment',/* -methods */
				title: 'Setup',
				templateUrl: helper.basepath('srm_shipment_methods/srm_shipment_methods.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.add-srm-shipment-methods', {
				url: '/srm-shipment/add',/* -methods */
				title: 'Setup',
				templateUrl: helper.basepath('add.html'),
				controller: 'SrmShipmentMethodsAddController'
			})
			.state('app.view-srm-shipment-methods', {
				url: '/srm-shipment/:id/view',
				title: 'Setup',
				templateUrl: helper.basepath('view.html'),
				resolve: angular.extend(helper.resolveFor('ngDialog'), {
					tpl: function () { return { path: helper.basepath('ngdialog-template.html') }; }
				}),
				controller: 'SrmShipmentMethodsViewController'
			})
			.state('app.edit-srm-shipment-methods', {
				url: '/srm-shipment/:id/edit',
				title: 'Setup',
				templateUrl: helper.basepath('edit.html'),
				controller: 'SrmShipmentMethodsEditController'
			})

	}]);

myApp.controller('SrmShipmentMethodsController', SrmShipmentMethodsController);
myApp.controller('SrmShipmentMethodsAddController', SrmShipmentMethodsAddController);
myApp.controller('SrmShipmentMethodsViewController', SrmShipmentMethodsViewController);
myApp.controller('SrmShipmentMethodsEditController', SrmShipmentMethodsEditController);

function SrmShipmentMethodsController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
	'use strict';

	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
			{ 'name': 'Shipment Methods', 'url': '#', 'isActive': false }];/* Methods */

	var vm = this;
	var Api = $scope.$root.setup + "srm/shipment-methods";
	var postData = {
		'token': $scope.$root.token,
		'all': "1"
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
				//$scope.checkData = ngDataService.getData( $defer, params, Api,$filter,$scope,postData);
				ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);
			}
		});


	$scope.$data = {};
	$scope.delete = function (id, index, $data) {
		var delUrl = $scope.$root.setup + "srm/delete-shipment-method";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { id: id, 'token': $scope.$root.token })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						$data.splice(index, 1);
					}
					else {
						toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
					}
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});

	};

}

function SrmShipmentMethodsAddController($scope, $stateParams, $http, $state, toaster, $timeout) {

	$scope.formTitle = 'Shipment';/* Methods */
	$scope.btnCancelUrl = 'app.srm-shipment-methods';
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
			{ 'name': 'Shipment Methods', 'url': 'app.srm-shipment-methods', 'isActive': false }];
	//  {'name':'Add','url':'#','isActive':false}];

	$scope.formUrl = function () {
		return "app/views/srm_shipment_methods/_form.html";
	}

	$scope.rec = {};
	var postUrl = $scope.$root.setup + "srm/add-shipment-method";


	$scope.add = function (rec) {
		rec.token = $scope.$root.token;
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					$timeout(function () { $state.go('app.srm-shipment-methods'); }, 1000);
				}
				else
					toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
			});
	}
}

function SrmShipmentMethodsViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
	$scope.formTitle = 'Shipment ';/* Methods */
	$scope.btnCancelUrl = 'app.srm-shipment-methods';
	$scope.hideDel = false;
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
			{ 'name': 'Shipment Methods', 'url': 'app.srm-shipment-methods', 'isActive': false }];
	//  {'name':'Detail','url':'#','isActive':false}];

	$scope.formUrl = function () {
		return "app/views/srm_shipment_methods/_form.html";
	};

	$scope.gotoEdit = function () {
		$state.go("app.edit-srm-shipment-methods", { id: $stateParams.id });
	};
	$scope.delete = function (id, rec, $data) {
		var delUrl = $scope.$root.setup + "srm/delete-shipment-method";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						//$data.splice(index,1);
						$timeout(function () {
							$state.go('app.srm-shipment-methods');
						}, 1000);
					}
					else {
						toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
					}
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});

	};

	$scope.rec = {};
	var postUrl = $scope.$root.setup + "srm/get-shipment-method";
	var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

	$http
		.post(postUrl, postData)
		.then(function (res) {
			$scope.rec = res.data.response;
		});




};

function SrmShipmentMethodsEditController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {

	$scope.formTitle = 'Shipment';/* Methods */
	$scope.btnCancelUrl = 'app.srm-shipment-methods';
	$scope.hideDel = false;
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
			{ 'name': 'Shipment Methods', 'url': 'app.srm-shipment-methods', 'isActive': false }];
	//  {'name':'Edit','url':'#','isActive':false}];	

	$scope.formUrl = function () {
		return "app/views/srm_shipment_methods/_form.html";
	};
	$scope.delete = function (id, rec, $data) {
		var delUrl = $scope.$root.setup + "srm/delete-shipment-method";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						//$data.splice(index,1);
						$timeout(function () {
							$state.go('app.srm-shipment-methods');
						}, 3000);
					}
					else {
						toaster.pop('error', 'Deleted', res.data.error);
					}
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});

	};
	$scope.rec = {};
	var postUrl = $scope.$root.setup + "srm/get-shipment-method";
	var updateUrl = $scope.$root.setup + "srm/update-shipment-method";
	var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

	$http
		.post(postUrl, postData)
		.then(function (res) {
			$scope.rec = res.data.response;
			$scope.rec.deletePerm = 1;
		});


	$scope.update = function (rec) {
		rec.token = $scope.$root.token;
		$http
			.post(updateUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					$timeout(function () { $state.go('app.srm-shipment-methods'); }, 3000);
				}
				else
					toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
			});
	}

}