ShipmentMethodsController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		/* specific routes here (see file config.js) */
		$stateProvider
			.state('app.shipment-methods', {
				url: '/shipment',/* -methods */
				title: 'Setup',
				templateUrl: helper.basepath('shipment_methods/shipment_methods.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.add-shipment-methods', {
				url: '/shipment/add',/* -methods */
				title: 'Setup',
				templateUrl: helper.basepath('add.html'),
				controller: 'ShipmentMethodsAddController'
			})
			.state('app.view-shipment-methods', {
				url: '/shipment/:id/view',
				title: 'Setup',
				templateUrl: helper.basepath('view.html'),
				resolve: angular.extend(helper.resolveFor('ngDialog'), {
					tpl: function () { return { path: helper.basepath('ngdialog-template.html') }; }
				}),
				controller: 'ShipmentMethodsViewController'
			})
			.state('app.edit-shipment-methods', {
				url: '/shipment/:id/edit',
				title: 'Setup',
				templateUrl: helper.basepath('edit.html'),
				controller: 'ShipmentMethodsEditController'
			})

	}]);

myApp.controller('ShipmentMethodsController', ShipmentMethodsController);
myApp.controller('ShipmentMethodsAddController', ShipmentMethodsAddController);
myApp.controller('ShipmentMethodsViewController', ShipmentMethodsViewController);
myApp.controller('ShipmentMethodsEditController', ShipmentMethodsEditController);

function ShipmentMethodsController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
	'use strict';

	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
			{ 'name': 'Shipment Methods', 'url': '#', 'isActive': false }];/* Methods */

	var vm = this;
	var Api = $scope.$root.setup + "crm/shipment-methods";
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
		var delUrl = $scope.$root.setup + "crm/delete-shipment-method";
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
						toaster.pop('error', 'Deleted', res.data.error);
					}
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});

	};

}

function ShipmentMethodsAddController($scope, $stateParams, $http, $state, toaster, $timeout) {

	$scope.formTitle = 'Shipment ';/* Methods */
	$scope.btnCancelUrl = 'app.shipment-methods';
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
			{ 'name': 'Shipment Methods', 'url': 'app.shipment-methods', 'isActive': false }];/* Methods */
	//  {'name':'Add','url':'#','isActive':false}];

	$scope.formUrl = function () {
		return "app/views/shipment_methods/_form.html";
	}

	$scope.rec = {};
	var postUrl = $scope.$root.setup + "crm/add-shipment-method";


	$scope.add = function (rec) {
		rec.token = $scope.$root.token;
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					$timeout(function () { $state.go('app.shipment-methods'); }, 1000);
				}
				else
					toaster.pop('error', 'Error', res.data.error);
			});
	}
}

function ShipmentMethodsViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
	$scope.formTitle = 'Shipment';/* Methods */
	$scope.btnCancelUrl = 'app.shipment-methods';
	$scope.hideDel = false;
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
			{ 'name': 'Shipment Methods', 'url': 'app.shipment-methods', 'isActive': false }];
	//  {'name':'Detail','url':'#','isActive':false}];/* Methods */

	$scope.formUrl = function () {
		return "app/views/shipment_methods/_form.html";
	}

	$scope.gotoEdit = function () {
		$state.go("app.edit-shipment-methods", { id: $stateParams.id });
	};
	$scope.delete = function (id, rec, $data) {
		var delUrl = $scope.$root.setup + "crm/delete-shipment-method";
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
							$state.go('app.shipment-methods');
						}, 500);
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
	var postUrl = $scope.$root.setup + "crm/get-shipment-method";
	var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

	$http
		.post(postUrl, postData)
		.then(function (res) {
			$scope.rec = res.data.response;
		});




};

function ShipmentMethodsEditController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {

	$scope.formTitle = 'Shipment ';/* Methods */
	$scope.btnCancelUrl = 'app.shipment-methods';
	$scope.hideDel = false;
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
			{ 'name': 'Shipment Methods', 'url': 'app.shipment-methods', 'isActive': false }];
	//  {'name':'Edit','url':'#','isActive':false}];/* Methods */

	$scope.formUrl = function () {
		return "app/views/shipment_methods/_form.html";
	}
	$scope.delete = function (id, rec, $data) {
		var delUrl = $scope.$root.setup + "crm/delete-shipment-method";
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
							$state.go('app.shipment-methods');
						}, 500);
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
	var postUrl = $scope.$root.setup + "crm/get-shipment-method";
	var updateUrl = $scope.$root.setup + "crm/update-shipment-method";
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
					$timeout(function () { $state.go('app.shipment-methods'); }, 1000);
				} else if (res.data.ack == 2) {
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					$timeout(function () { $state.go('app.shipment-methods'); }, 1000);
				}
				else
					toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
			});
	}

}


