PaymentTermsController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];

myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		/* specific routes here (see file config.js) */
		$stateProvider
			.state('app.payment-terms', {
				url: '/payment-terms',
				title: 'Setup',
				templateUrl: helper.basepath('payment_terms/payment_terms.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.add-payment-terms', {
				url: '/payment-terms/add',
				title: 'Setup',
				templateUrl: helper.basepath('add.html'),
				controller: 'PaymentTermsAddController'
			})
			.state('app.view-payment-terms', {
				url: '/payment-terms/:id/view',
				title: 'Setup',
				templateUrl: helper.basepath('view.html'),
				resolve: angular.extend(helper.resolveFor('ngDialog'), {
					tpl: function () {
						return {
							path: helper.basepath('ngdialog-template.html')
						};
					}
				}),
				controller: 'PaymentTermsViewController'
			})
			.state('app.edit-payment-terms', {
				url: '/payment-terms/:id/edit',
				title: 'Setup',
				templateUrl: helper.basepath('edit.html'),
				controller: 'PaymentTermsEditController'
			})

	}
]);

myApp.controller('PaymentTermsController', PaymentTermsController);
myApp.controller('PaymentTermsAddController', PaymentTermsAddController);
myApp.controller('PaymentTermsViewController', PaymentTermsViewController);
myApp.controller('PaymentTermsEditController', PaymentTermsEditController);

function PaymentTermsController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
	'use strict';

	$scope.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
		{
			'name': 'Setup',
			'url': 'app.setup',
			'isActive': false,
			'tabIndex': '1'
		},
		{
			'name': 'Sales',
			'url': 'app.setup',
			'isActive': false,
			'tabIndex': '3'
		},
		{
			'name': 'Payment Terms',
			'url': '#',
			'isActive': false
		}
	];

	var vm = this;
	var Api = $scope.$root.setup + "crm/payment-terms";
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
		page: 1, // show first page
		count: $scope.$root.pagination_limit, // count per page
		filter: {
			name: '',
			age: ''
		}
	}, {
			total: 0, // length of data
			counts: [], // hide page counts control

			getData: function ($defer, params) {
				ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);

			}
		});


	$scope.$data = {};
	$scope.delete = function (id, index, $data) {
		var delUrl = $scope.$root.setup + "crm/delete-payment-term";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, {
					id: id,
					'token': $scope.$root.token
				})
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
						$data.splice(index, 1);
					} else {
						toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
					}
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});

	};

}

function PaymentTermsAddController($scope, $stateParams, $http, $state, toaster, $timeout) {

	$scope.formTitle = 'Payment Terms';
	$scope.btnCancelUrl = 'app.payment-terms';
	$scope.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
		{
			'name': 'Setup',
			'url': 'app.setup',
			'isActive': false,
			'tabIndex': '1'
		},
		{
			'name': 'Sales',
			'url': 'app.setup',
			'isActive': false,
			'tabIndex': '3'
		},
		{
			'name': 'Payment Terms',
			'url': 'app.payment-terms',
			'isActive': false
		}
	];
	//  {'name':'Add','url':'#','isActive':false}];

	$scope.formUrl = function () {
		return "app/views/payment_terms/_form.html";
	}

	$scope.rec = {};
	var postUrl = $scope.$root.setup + "crm/add-payment-term";


	$scope.add = function (rec) {

		if (isNaN(rec.days)) {
			toaster.pop('error', 'Error', 'Invalid days');
			return;
		}
		rec.token = $scope.$root.token;
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
					$timeout(function () {
						$state.go('app.payment-terms');
					}, 1000);
				} else if (res.data.ack == 2) {
					toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(107));
				} else {
					toaster.pop('error', 'Info', 'Record cannot be inserted!');
				}
			});
	}
}

function PaymentTermsViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
	$scope.formTitle = 'Payment Terms';
	$scope.btnCancelUrl = 'app.payment-terms';
	$scope.hideDel = false;
	$scope.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
		{
			'name': 'Setup',
			'url': 'app.setup',
			'isActive': false,
			'tabIndex': '1'
		},
		{
			'name': 'Sales',
			'url': 'app.setup',
			'isActive': false,
			'tabIndex': '3'
		},
		{
			'name': 'Payment Terms',
			'url': 'app.payment-terms',
			'isActive': false
		}
	];
	//  {'name':'Detail','url':'#','isActive':false}];

	$scope.formUrl = function () {
		return "app/views/payment_terms/_form.html";
	}

	$scope.gotoEdit = function () {
		$state.go("app.edit-payment-terms", {
			id: $stateParams.id
		});
	};


	$scope.rec = {};
	var postUrl = $scope.$root.setup + "crm/get-payment-term";
	var postData = {
		'token': $scope.$root.token,
		'id': $stateParams.id
	};

	$http
		.post(postUrl, postData)
		.then(function (res) {
			$scope.rec = res.data.response;
		});

	$scope.delete = function () {
		var delUrl = $scope.$root.setup + "crm/delete-payment-term";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, {
					'id': $stateParams.id,
					'token': $scope.$root.token
				})
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
						$timeout(function () {
							$state.go('app.payment-terms');
						}, 1000);
					} else {
						toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
					}
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});

	};




};

function PaymentTermsEditController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {

	$scope.formTitle = 'Payment Terms';
	$scope.btnCancelUrl = 'app.payment-terms';
	$scope.hideDel = false;
	$scope.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
		{
			'name': 'Setup',
			'url': 'app.setup',
			'isActive': false,
			'tabIndex': '1'
		},
		{
			'name': 'Sales',
			'url': 'app.setup',
			'isActive': false,
			'tabIndex': '3'
		},
		{
			'name': 'Payment Terms',
			'url': 'app.payment-terms',
			'isActive': false
		}
	];
	//  {'name':'Edit','url':'#','isActive':false}];	

	$scope.formUrl = function () {
		return "app/views/payment_terms/_form.html";
	}

	$scope.rec = {};
	var postUrl = $scope.$root.setup + "crm/get-payment-term";
	var updateUrl = $scope.$root.setup + "crm/update-payment-term";
	var postData = {
		'token': $scope.$root.token,
		'id': $stateParams.id
	};

	$http
		.post(postUrl, postData)
		.then(function (res) {
			$scope.rec = res.data.response;
			$scope.rec.deletePerm = 1;
		});


	$scope.update = function (rec) {
		if (isNaN(rec.days)) {
			toaster.pop('error', 'Error', 'Invalid days');
			return;
		}
		rec.token = $scope.$root.token;
		$http
			.post(updateUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					$timeout(function () {
						$state.go('app.payment-terms');
					}, 1000);
				} else if (res.data.ack == 2) {
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					$timeout(function () {
						$state.go('app.payment-terms');
					}, 1000);
				}
				else
					toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
			});
	}

	$scope.delete = function () {
		var delUrl = $scope.$root.setup + "crm/delete-payment-term";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, {
					'id': $stateParams.id,
					'token': $scope.$root.token
				})
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
						$timeout(function () {
							$state.go('app.payment-terms');
						}, 1000);
					} else {
						toaster.pop('error', 'Deleted', res.data.error);
					}
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});

	};
}