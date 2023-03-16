Emplyee_type.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		/* specific routes here (see file config.js) */
		$stateProvider
			.state('app.employee_type', {
				url: '/employee_type',
				title: 'Setup',
				templateUrl: helper.basepath('employee_type/employee_type.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.addemployee_type', {
				url: '/employee_type/add',
				title: 'Setup',
				templateUrl: helper.basepath('add.html'),
				controller: 'EmptypeAddController'
			})
			.state('app.view_employee_type', {
				url: '/employee_type/:id/view',
				title: 'Setup',
				templateUrl: helper.basepath('view.html'),
				resolve: angular.extend(helper.resolveFor('ngDialog'), {
					tpl: function () { return { path: helper.basepath('ngdialog-template.html') }; }
				}),
				controller: 'EmployeeViewController'
			})
			.state('app.edit_employee_type', {
				url: '/employee_type/:id/edit',
				title: 'Setup',
				templateUrl: helper.basepath('edit.html'),
				resolve: angular.extend(helper.resolveFor('ngDialog'), {
					tpl: function () { return { path: helper.basepath('ngdialog-template.html') }; }
				}),
				controller: 'EmployeeEditController'
			})

	}]);

myApp.controller('Emplyee_type', Emplyee_type);
myApp.controller('EmptypeAddController', EmptypeAddController);
myApp.controller('EmployeeViewController', EmployeeViewController);
myApp.controller('EmployeeEditController', EmployeeEditController);

function Emplyee_type($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
	'use strict';
	var vm = this;
	$scope.class = 'inline_block';
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Human Resources', 'url': 'app.setup', 'tabIndex': '7' },
			{ 'name': 'Employment Type', 'url': '#', 'isActive': false }];

	var Api = $scope.$root.hr + "hr_employee_type/get_employee_type";
	var postData = {
		'token': $scope.$root.token,
		fromSetup :true,
		'all': "1"
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



	$scope.delete = function (id, index, arr_data) {
		var delUrl = $scope.$root.hr + "hr_employee_type/delete_employee_type";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {

			$http
				.post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token })
				.then(function (res) {

					if (res.data.ack == true) {
						toaster.pop('success', 'Deleted', 'Record deleted successfully');
						$timeout(function () { $state.go('app.employee_type'); }, 3000);
					}
					else {
						toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(108));
					}
				});
		},
			function (reason) {
				console.log('Modal promise rejected. Reason: ', reason);
			});
	};

}

function EmptypeAddController($scope, $stateParams, $http, $state, toaster, $timeout) {

	$scope.formTitle = 'Employment Type';
	$scope.btnCancelUrl = 'app.employee_type';

	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Human Resources', 'url': 'app.setup', 'tabIndex': '7' },
			{ 'name': 'Employment Type', 'url': '#', 'isActive': false }];
	//  {'name':'Add','url':'#','isActive':false}

	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];
	$scope.rec = {};
	$scope.status = {};

	$scope.formUrl = function () {
		return "app/views/employee_type/_form.html";
	}

	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

	angular.forEach($scope.arr_status, function (obj) {
		if (obj.value == 1)
			$scope.rec.status = obj;
	});

	var postUrl = $scope.$root.hr + "hr_employee_type/add_employee_type";
	$scope.add = function (rec) {
		rec.token = $scope.$root.token;
		rec.status = $scope.arr_status[0].value;

		// rec.status = $scope.rec.status.value !== undefined ? $scope.rec.status.value:0;

		$http
			.post(postUrl, rec)
			.then(function (res) {
				//	 console.log(rec);
				if (res.data.ack == true) {
					toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
					$timeout(function () { $state.go('app.employee_type'); }, 1000);
				}
				else
					toaster.pop('error', 'Info', res.data.error);
			});
	}


}

function EmployeeViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
	$scope.formTitle = 'Employment Type';
	$scope.btnCancelUrl = 'app.employee_type';
	$scope.hideDel = false;
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Human Resources', 'url': 'app.setup', 'tabIndex': '7' },
			{ 'name': 'Employment Type', 'url': 'app.employee_type', 'isActive': false }];
	//  {'name':'Detail','url':'#','isActive':false}];

	$scope.formUrl = function () {
		return "app/views/employee_type/_form.html";
	}

	$scope.gotoEdit = function () {
		$state.go("app.edit_employee_type", { id: $stateParams.id });
	};

	$scope.delete = function (id, index, arr_data) {
		var delUrl = $scope.$root.hr + "hr_employee_type/delete_employee_type";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {

			$http
				.post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token })
				.then(function (res) {

					if (res.data.ack == true) {
						toaster.pop('success', 'Deleted', 'Record deleted successfully');
						$timeout(function () { $state.go('app.employee_type'); }, 1500);
					}
					else {
						toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(108));
					}
				});
		},
			function (reason) {
				console.log('Modal promise rejected. Reason: ', reason);
			});
	};


	$scope.rec = {};
	$scope.status = {};
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'inActive', 'value': 0 }];

	var postUrl = $scope.$root.hr + "hr_employee_type/get_employee_type_by_id";
	var postData = { 'token': $scope.$root.token, 
					 'id': $stateParams.id,
					 fromSetup :true};

	$http
		.post(postUrl, postData)
		.then(function (res) {
			$scope.rec = res.data.response;


			$.each($scope.arr_status, function (index, obj) {
				if (obj.value == res.data.response.status) {
					$scope.rec.status = $scope.arr_status[index];

				}
			});
		});


};

function EmployeeEditController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {

	$scope.formTitle = 'Employment Type';
	$scope.btnCancelUrl = 'app.employee_type';
	$scope.hideDel = false;
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Human Resources', 'url': 'app.setup', 'tabIndex': '7' },
			{ 'name': 'Employment Type', 'url': 'app.employee_type', 'isActive': false }];
	//  {'name':'Edit','url':'#','isActive':false}];	

	$scope.formUrl = function () {
		return "app/views/employee_type/_form.html";
	}

	$scope.rec = {};
	$scope.status = {};
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'inActive', 'value': 0 }];

	var postUrl = $scope.$root.hr + "hr_employee_type/get_employee_type_by_id";
	var postData = { 'token': $scope.$root.token,
					 'id': $stateParams.id,
					  fromSetup :true};
	$http
		.post(postUrl, postData)
		.then(function (res) {
			$scope.rec = res.data.response;
			$scope.rec.deletePerm = 1;

			$.each($scope.arr_status, function (index, obj) {
				if (obj.value == res.data.response.status) {
					$scope.rec.status = $scope.arr_status[index];

				}
			});
		});

	var updateUrl = $scope.$root.hr + "hr_employee_type/add_employee_type";
	$scope.update = function (rec) {
		rec.token = $scope.$root.token;
		rec.status = $scope.arr_status[0].value;

		$http
			.post(updateUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					$timeout(function () { $state.go('app.employee_type'); }, 1500);
				}
				else {
					toaster.pop('error', 'Info', res.data.error);
					//toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					//$timeout(function () { $state.go('app.employee_type'); }, 1500);
				}

			});
	}

	$scope.delete = function (id, index, arr_data) {
		var delUrl = $scope.$root.hr + "hr_employee_type/delete_employee_type";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {

			$http
				.post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token })
				.then(function (res) {

					if (res.data.ack == true) {
						toaster.pop('success', 'Deleted', 'Record deleted successfully');
						$timeout(function () { $state.go('app.employee_type'); }, 1500);
					}
					else {
						toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(108));
					}
				});
		},
			function (reason) {
				console.log('Modal promise rejected. Reason: ', reason);
			});
	};



}


