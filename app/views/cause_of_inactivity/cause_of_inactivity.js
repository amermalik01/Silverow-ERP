CauseOfInactivityController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		/* specific routes here (see file config.js) */
		$stateProvider
			.state('app.cause-of-inactivity', {
				url: '/cause-of-inactivity',
				title: 'Setup',
				templateUrl: helper.basepath('cause_of_inactivity/cause_of_inactivity.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.add-cause-of-inactivity', {
				url: '/cause-of-inactivity/add',
				title: 'Setup',
				templateUrl: helper.basepath('add.html'),
				controller: 'CauseOfInactivityAddController'
			})
			.state('app.view-cause-of-inactivity', {
				url: '/cause-of-inactivity/:id/view',
				title: 'Setup',
				templateUrl: helper.basepath('view.html'),
				resolve: angular.extend(helper.resolveFor('ngDialog'), {
					tpl: function () { return { path: helper.basepath('ngdialog-template.html') }; }
				}),
				controller: 'CauseOfInactivityViewController'
			})
			.state('app.edit-cause-of-inactivity', {
				url: '/cause-of-inactivity/:id/edit',
				title: 'Setup',
				templateUrl: helper.basepath('edit.html'),
				resolve: angular.extend(helper.resolveFor('ngDialog'), {
					tpl: function () { return { path: helper.basepath('ngdialog-template.html') }; }
				}),
				controller: 'CauseOfInactivityEditController'
			})

	}]);

myApp.controller('CauseOfInactivityController', CauseOfInactivityController);
myApp.controller('CauseOfInactivityAddController', CauseOfInactivityAddController);
myApp.controller('CauseOfInactivityViewController', CauseOfInactivityViewController);
myApp.controller('CauseOfInactivityEditController', CauseOfInactivityEditController);

function CauseOfInactivityController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
	'use strict';
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex': '7' },
		{ 'name': 'Cause of Inactivity', 'url': '#', 'isActive': false }];

	var vm = this;
	var Api = $scope.$root.setup + "hr/cause-of-inactivity";
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



	$scope.delete = function (id, rec, arr_data) {
		var delUrl = $scope.$root.setup + "hr/delete-cause-of-inactivity";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { id: id, 'token': $scope.$root.token })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						var index = arr_data.indexOf(rec.id);
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

function CauseOfInactivityAddController($timeout, $scope, $stateParams, $http, $state, toaster) {

	$scope.formTitle = 'Cause of Inactivity';
	$scope.btnCancelUrl = 'app.cause-of-inactivity';

	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex': '7' },
		{ 'name': 'Cause of Inactivity', 'url': 'app.cause-of-inactivity', 'isActive': false }];
	// { 'name': 'Add', 'url': '#', 'isActive': false }];

	$scope.formUrl = function () {
		return "app/views/cause_of_inactivity/_form.html";
	}

	$scope.rec = {};
	var postUrl = $scope.$root.setup + "hr/add-cause-of-inactivity";


	$scope.add = function (rec) {
		rec.token = $scope.$root.token;
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					$timeout(function () { $state.go('app.cause-of-inactivity'); }, 1000);
				}
				else if (res.data.duplicate) {
					toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
				}
				else
					toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
			});
	}
}

function CauseOfInactivityViewController($timeout, $scope, $stateParams, $http, $state, $resource, ngDialog, toaster) {
	$scope.formTitle = 'Cause of Inactivity';
	$scope.btnCancelUrl = 'app.cause-of-inactivity';
	$scope.hideDel = false;

	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex': '7' },
		{ 'name': 'Cause of Inactivity', 'url': 'app.cause-of-inactivity', 'isActive': false }];
	// { 'name': 'Detail', 'url': '#', 'isActive': false }];

	$scope.formUrl = function () {
		return "app/views/cause_of_inactivity/_form.html";
	}

	$scope.gotoEdit = function () {
		$state.go("app.edit-cause-of-inactivity", { id: $stateParams.id });
	};


	$scope.rec = {};
	var postUrl = $scope.$root.setup + "hr/get-cause-of-inactivity";
	var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

	$http
		.post(postUrl, postData)
		.then(function (res) {
			$scope.rec = res.data.response;
		});

	$scope.delete = function (id, rec, arr_data) {
		if (!id) {
			id = $stateParams.id
		}
		var delUrl = $scope.$root.setup + "hr/delete-cause-of-inactivity";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { id: id, 'token': $scope.$root.token })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						$timeout(function () { $state.go('app.cause-of-inactivity'); }, 1500);
						var index = arr_data.indexOf(rec.id);
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


};

function CauseOfInactivityEditController($timeout, $scope, $stateParams, $http, $state, $resource, ngDialog, toaster) {

	$scope.formTitle = 'Cause of Inactivity';
	$scope.btnCancelUrl = 'app.cause-of-inactivity';
	$scope.hideDel = false;

	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex': '7' },
		{ 'name': 'Cause of Inactivity', 'url': 'app.cause-of-inactivity', 'isActive': false }];
	// { 'name': 'Edit', 'url': '#', 'isActive': false }];

	$scope.formUrl = function () {
		return "app/views/cause_of_inactivity/_form.html";
	}

	$scope.rec = {};
	var postUrl = $scope.$root.setup + "hr/get-cause-of-inactivity";
	var updateUrl = $scope.$root.setup + "hr/update-cause-of-inactivity";
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
					$timeout(function () { $state.go('app.cause-of-inactivity'); }, 1500);
				}
				else if (res.data.error == "Record Already Exists.") {
					toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(107));
					//$timeout(function () { $state.go('app.cause-of-inactivity'); }, 1500);
				}
				else {
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					$timeout(function () { $state.go('app.cause-of-inactivity'); }, 1500);
				}

			});
	}

	$scope.delete = function (id, rec, arr_data) {
		if (!id) {
			id = $stateParams.id
		}
		var delUrl = $scope.$root.setup + "hr/delete-cause-of-inactivity";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { id: id, 'token': $scope.$root.token })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						$timeout(function () { $state.go('app.cause-of-inactivity'); }, 1500);
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


