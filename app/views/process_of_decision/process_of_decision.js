ProcessOfDecisionController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		/* specific routes here (see file config.js) */
		$stateProvider
			.state('app.process-of-decision', {
				url: '/process-of-decision',
				title: 'Setup',
				templateUrl: helper.basepath('process_of_decision/process_of_decision.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.add-process-of-decision', {
				url: '/process-of-decision/add',
				title: 'Setup',
				templateUrl: helper.basepath('add.html'),
				controller: 'ProcessOfDecisionAddController'
			})
			.state('app.view-process-of-decision', {
				url: '/process-of-decision/:id/view',
				title: 'Setup ',
				templateUrl: helper.basepath('view.html'),
				resolve: angular.extend(helper.resolveFor('ngDialog'), {
					tpl: function () { return { path: helper.basepath('ngdialog-template.html') }; }
				}),
				controller: 'ProcessOfDecisionViewController'
			})
			.state('app.edit-process-of-decision', {
				url: '/process-of-decision/:id/edit',
				title: 'Setup',
				templateUrl: helper.basepath('edit.html'),
				controller: 'ProcessOfDecisionEditController'
			})

	}]);

myApp.controller('ProcessOfDecisionController', ProcessOfDecisionController);
myApp.controller('ProcessOfDecisionAddController', ProcessOfDecisionAddController);
myApp.controller('ProcessOfDecisionViewController', ProcessOfDecisionViewController);
myApp.controller('ProcessOfDecisionEditController', ProcessOfDecisionEditController);

function ProcessOfDecisionController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
	'use strict';
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
			{ 'name': 'Opportunity Approval Process', 'url': '#', 'isActive': false }];

	var vm = this;
	var Api = $scope.$root.setup + "general/process-of-decision";
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
				$scope.checkData = ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);
			}
		});

	$scope.$data = {};
	



}

function ProcessOfDecisionAddController($scope, $stateParams, $http, $state, toaster, $timeout) {

	$scope.formTitle = 'Opportunity Approval Process';
	$scope.btnCancelUrl = 'app.process-of-decision';

	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
			{ 'name': 'Opportunity Approval Process', 'url': 'app.process-of-decision', 'isActive': false }];
	//  {'name':'Add','url':'#','isActive':false}];

	$scope.formUrl = function () {
		return "app/views/process_of_decision/_form.html";
	}

	$scope.rec = {};
	var postUrl = $scope.$root.setup + "general/add-process-of-decision";


	$scope.add = function (rec) {
		rec.token = $scope.$root.token;
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					$timeout(function () { $state.go('app.process-of-decision'); }, 1000);
				}
				else
					toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
			});
	}
}

function ProcessOfDecisionViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
	$scope.formTitle = 'Opportunity Approval Process';
	$scope.btnCancelUrl = 'app.process-of-decision';
	$scope.hideDel = false;
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
			{ 'name': 'Opportunity Approval Process', 'url': 'app.process-of-decision', 'isActive': false }];
	//  {'name':'Detail','url':'#','isActive':false}

	$scope.formUrl = function () {
		return "app/views/process_of_decision/_form.html";
	}

	$scope.gotoEdit = function () {
		$state.go("app.edit-process-of-decision", { id: $stateParams.id });
	};


	$scope.rec = {};
	var postUrl = $scope.$root.setup + "general/get-process-of-decision";
	var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

	$http
		.post(postUrl, postData)
		.then(function (res) {
			$scope.rec = res.data.response;
		});


};

function ProcessOfDecisionEditController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {

	$scope.formTitle = 'Opportunity Approval Process';
	$scope.btnCancelUrl = 'app.process-of-decision';
	$scope.hideDel = false;
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
			{ 'name': 'Opportunity Approval Process', 'url': 'app.process-of-decision', 'isActive': false }];
	//  {'name':'Edit','url':'#','isActive':false}	

	$scope.formUrl = function () {
		return "app/views/process_of_decision/_form.html";
	}

	$scope.rec = {};
	var postUrl = $scope.$root.setup + "general/get-process-of-decision";
	var updateUrl = $scope.$root.setup + "general/update-process-of-decision";
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
					$timeout(function () { $state.go('app.process-of-decision'); }, 2000);
				}
				else {
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					$timeout(function () { $state.go('app.process-of-decision'); }, 2000);
				}

			});
	}

	$scope.delete = function (id) { // , index, $data
		var delUrl = $scope.$root.setup + "general/delete-process-of-decision";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { id: id, 'token': $scope.$root.token })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						// $data.splice(index, 1);
						$state.go('app.process-of-decision');
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


