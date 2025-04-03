SourceOfCrmController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		/* specific routes here (see file config.js) */
		$stateProvider
			.state('app.source-of-crm', {
				url: '/source-of-crm',
				title: 'Setup',
				templateUrl: helper.basepath('source_of_crm/source_of_crm.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.add-source-of-crm', {
				url: '/source-of-crm/add',
				title: 'Setup',
				templateUrl: helper.basepath('add.html'),
				controller: 'SourceOfCrmAddController'
			})
			.state('app.view-source-of-crm', {
				url: '/source-of-crm/:id/view',
				title: 'Setup',
				templateUrl: helper.basepath('view.html'),
				resolve: angular.extend(helper.resolveFor('ngDialog'), {
					tpl: function () { return { path: helper.basepath('ngdialog-template.html') }; }
				}),
				controller: 'SourceOfCrmViewController'
			})
			.state('app.edit-source-of-crm', {
				url: '/source-of-crm/:id/edit',
				title: 'Setup',
				templateUrl: helper.basepath('edit.html'),
				controller: 'SourceOfCrmEditController'
			})

	}]);

myApp.controller('SourceOfCrmController', SourceOfCrmController);
myApp.controller('SourceOfCrmAddController', SourceOfCrmAddController);
myApp.controller('SourceOfCrmViewController', SourceOfCrmViewController);
myApp.controller('SourceOfCrmEditController', SourceOfCrmEditController);

function SourceOfCrmController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
	'use strict';

	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
			{ 'name': 'Source Of CRM', 'url': '#', 'isActive': false }];

	var vm = this;
	var Api = $scope.$root.setup + "ledger-group/predefines";
	var postData = {
		'token': $scope.$root.token,
		'all': "1",
		'column': 'type',
		'value': 'SOURCES_OF_CRM'
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



	$scope.delete = function (id, rec, arr_data) {
		var delUrl = $scope.$root.setup + "ledger-group/delete-predefine";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { id: id, 'token': $scope.$root.token })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						//var index = arr_data.indexOf(rec.id);
						$timeout(function () { $state.go('app.source-of-crm'); }, 1000);
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

function SourceOfCrmAddController($scope, $stateParams, $http, $state, toaster, $timeout) {

	$scope.formTitle = 'Source Of CRM';
	$scope.btnCancelUrl = 'app.source-of-crm';

	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
			{ 'name': 'Source Of CRM', 'url': 'app.source-of-crm', 'isActive': false }];
	//  {'name':'Add','url':'#','isActive':false}];

	$scope.formUrl = function () {
		return "app/views/source_of_crm/_form.html";
	}

	$scope.rec = {};
	$scope.predefine_types = {};
	var postUrl = $scope.$root.setup + "ledger-group/add-predefine";

	$scope.add = function (rec) {
		rec.token = $scope.$root.token;
		rec.type = 'SOURCES_OF_CRM';
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					$timeout(function () { $state.go('app.source-of-crm'); }, 1000);
				}
				else
					toaster.pop('error', 'Add', res.data.error);
			});
	}
}

function SourceOfCrmViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
	$scope.formTitle = 'Source Of CRM';
	$scope.btnCancelUrl = 'app.source-of-crm';
	$scope.hideDel = false;
	$scope.showLoader = true;
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
			{ 'name': 'Source Of CRM', 'url': 'app.source-of-crm', 'isActive': false }];
	//  {'name':'Detail','url':'#','isActive':false}];



	$scope.gotoEdit = function () {
		$state.go("app.edit-source-of-crm", { id: $stateParams.id });
	};

	$scope.delete = function (id, rec, arr_data) {
		var delUrl = $scope.$root.setup + "ledger-group/delete-predefine";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						//var index = arr_data.indexOf(rec.id);
						$timeout(function () { $state.go('app.source-of-crm'); }, 1000);
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
	$scope.predefine_types = {};
	var postUrl = $scope.$root.setup + "ledger-group/get-predefine";
	var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

	$timeout(function () {
		$http
			.post(postUrl, postData)
			.then(function (res) {
				$scope.rec = res.data.response;
			});
		$scope.formUrl = function () {
			return "app/views/source_of_crm/_form.html";
		}
		$scope.showLoader = false;
	}, 3000);



};

function SourceOfCrmEditController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {

	$scope.formTitle = 'Source Of CRM';
	$scope.btnCancelUrl = 'app.source-of-crm';
	$scope.hideDel = false;
	$scope.showLoader = true;
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
			{ 'name': 'Source Of CRM', 'url': 'app.source-of-crm', 'isActive': false }];
	//  {'name':'Edit','url':'#','isActive':false}];	



	$scope.rec = {};
	$scope.predefine_types = {};
	var postUrl = $scope.$root.setup + "ledger-group/get-predefine";
	var updateUrl = $scope.$root.setup + "ledger-group/update-predefine";
	var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

	// $timeout(function () {
	$http
		.post(postUrl, postData)
		.then(function (res) {
			$scope.rec = res.data.response;
			$scope.rec.deletePerm = 1;
		});
	$scope.formUrl = function () {
		return "app/views/source_of_crm/_form.html";
	}
	$scope.showLoader = false;
	// }, 3000);

	$scope.delete = function (id, rec, arr_data) {
		var delUrl = $scope.$root.setup + "ledger-group/delete-predefine";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token, type: 'SOURCES_OF_CRM' })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						//var index = arr_data.indexOf(rec.id);
						$timeout(function () { $state.go('app.source-of-crm'); }, 1000);
					}
					else {
						toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
					}
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});

	};

	$scope.update = function (rec) {
		rec.token = $scope.$root.token;
		rec.type = 'SOURCES_OF_CRM';
		$http
			.post(updateUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					$timeout(function () { $state.go('app.source-of-crm'); }, 1000);
				} else if (res.data.ack == 2) {
					toaster.pop('success', 'Edit', res.data.error);
					$timeout(function () { $state.go('app.source-of-crm'); }, 1000);
				}
				else {
					toaster.pop('success', 'Edit', res.data.error);
				}
			});
	}

}


