CoverageController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		/* specific routes here (see file config.js) */
		$stateProvider
			.state('app.coverage-areas', {
				url: '/coverage-areas',
				title: 'Setup',
				templateUrl: helper.basepath('coverage_areas/coverage_areas.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.add-coverage-areas', {
				url: '/coverage-areas/add',
				title: 'Setup',
				templateUrl: helper.basepath('add.html'),
				controller: 'CoverageAddController'
			})
			.state('app.view-coverage-areas', {
				url: '/coverage-areas/:id/view',
				title: 'Setup',
				templateUrl: helper.basepath('view.html'),
				resolve: angular.extend(helper.resolveFor('ngDialog'), {
					tpl: function () { return { path: helper.basepath('ngdialog-template.html') }; }
				}),
				controller: 'CoverageViewController'
			})
			.state('app.edit-coverage-areas', {
				url: '/coverage-areas/:id/edit',
				title: 'Setup',
				templateUrl: helper.basepath('edit.html'),
				controller: 'CoverageEditController'
			})

	}]);

myApp.controller('CoverageController', CoverageController);
myApp.controller('CoverageAddController', CoverageAddController);
myApp.controller('CoverageViewController', CoverageViewController);
myApp.controller('CoverageEditController', CoverageEditController);

function CoverageController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
	'use strict';


	var vm = this;

	$scope.class = 'inline_block';
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
			{ 'name': 'Coverage Areas', 'url': '#', 'isActive': false }];

	var Api = $scope.$root.setup + "supplier/coverage-areas";
	var postData = {
		'token': $scope.$root.token
	};


	$scope.$watch("MyCustomeFilters", function () {
		if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
			$scope.table.tableParams5.reload();
		}
	}, true);
	$scope.MyCustomeFilters = {
	}

	vm.tableParams5 = new ngParams({
		page: 1,            // show first page
		count: $scope.$root.pagination_limit,           // count per page
		filter: {
			name: '',
			age: ''
		}
	},
		{
			total: 0,           // length of data
			counts: [],         // hide page counts control

			getData: function ($defer, params) {
				ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);
			}
		});





	$scope.delete = function (id, arr_data) {
		var delUrl = $scope.$root.setup + "supplier/delete-coverage-area";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { id: id, 'token': $scope.$root.token })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						var index = arr_data.indexOf(id);
						arr_data.splice(index, 1);
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

function CoverageAddController($scope, $stateParams, $http, $timeout, $state, toaster) {

	$scope.formTitle = 'Coverage Areas';
	$scope.btnCancelUrl = 'app.coverage-areas';

	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
			{ 'name': 'Coverage Areas', 'url': 'app.coverage-areas', 'isActive': false }];
	//  {'name':'Add','url':'#','isActive':false}];

	$scope.formUrl = function () {
		return "app/views/coverage_areas/_form.html";
	}

	$scope.rec = {};
	var postUrl = $scope.$root.setup + "supplier/add-coverage-area";

	$scope.list_folder = {}; $scope.formData = {}; $scope.status = {};
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];


	$scope.add = function (rec) {
		rec.token = $scope.$root.token;
		rec.status = $scope.rec.statuss != undefined ? $scope.rec.statuss.value : 1;
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					$timeout(function () { $state.go('app.coverage-areas'); }, 1000);
				}
				else
					toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
			});
	}
}

function CoverageViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster) {
	$scope.formTitle = 'Coverage Areas';
	$scope.btnCancelUrl = 'app.coverage-areas';
	$scope.hideDel = false;
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
			{ 'name': 'Coverage Areas', 'url': 'app.coverage-areas', 'isActive': false }];
	//  {'name':'Detail','url':'#','isActive':false}];

	$scope.formUrl = function () {
		return "app/views/coverage_areas/_form.html";
	}

	$scope.gotoEdit = function () {
		$state.go("app.edit-coverage-areas", { id: $stateParams.id });
	};

	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

	$scope.rec = {};
	var postUrl = $scope.$root.setup + "supplier/get-coverage-area";
	var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

	$http
		.post(postUrl, postData)
		.then(function (res) {
			$scope.rec = res.data.response;
			$.each($scope.arr_status, function (index, obj) {
				if (obj.value == res.data.response.status) {
					$scope.rec.statuss = $scope.arr_status[index];
				}
			});
		});




};

function CoverageEditController($scope, $stateParams, $http, $state, $timeout, $resource, toaster, ngDialog) {

	$scope.formTitle = 'Coverage Areas';
	$scope.btnCancelUrl = 'app.coverage-areas';
	$scope.hideDel = false;
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Purchases', 'url': 'app.setup', 'isActive': false, 'tabIndex': '4' },
			{ 'name': 'Coverage Areas', 'url': 'app.coverage-areas', 'isActive': false }];
	//  {'name':'Edit','url':'#','isActive':false}];	

	$scope.formUrl = function () {
		return "app/views/coverage_areas/_form.html";
	}
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

	$scope.rec = {};
	var postUrl = $scope.$root.setup + "supplier/get-coverage-area";
	var updateUrl = $scope.$root.setup + "supplier/update-coverage-area";
	var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

	$http
		.post(postUrl, postData)
		.then(function (res) {
			$scope.rec = res.data.response;
			$scope.rec.deletePerm = 1;
			$.each($scope.arr_status, function (index, obj) {
				if (obj.value == res.data.response.status) {
					$scope.rec.statuss = $scope.arr_status[index];
				}
			});
		});


	$scope.update = function (rec) {
		rec.status = $scope.rec.statuss != undefined ? $scope.rec.statuss.value : 1;
		rec.token = $scope.$root.token;
		$http
			.post(updateUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					$timeout(function () { $state.go('app.coverage-areas'); }, 1000);
				}
				else {
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					$timeout(function () { $state.go('app.coverage-areas'); }, 1000);
				}

			});
	}

	$scope.delete = function (id, arr_data) {
		var delUrl = $scope.$root.setup + "supplier/delete-coverage-area";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$scope.showLoader = true;
			$http
				.post(delUrl, { id: id, 'token': $scope.$root.token })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						$timeout(function () { $state.go('app.coverage-areas'); }, 1000);
					}
					else {
						toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
					}
					$scope.showLoader = false;
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});

	};

}


