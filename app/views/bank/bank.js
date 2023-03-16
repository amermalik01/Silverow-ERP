BankController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];

myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		/* specific routes here (see file config.js) */
		$stateProvider
			.state('app.bank', {
				url: '/bank',
				title: 'Bank',
				templateUrl: helper.basepath('bank/bank.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.addBank', {
				url: '/bank/add',
				title: 'Add bank ',
				templateUrl: helper.basepath('add.html'),
				controller: 'BankAddController',
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.viewBank', {
				url: '/bank/:id/view',
				title: 'View bank ',
				templateUrl: helper.basepath('view.html'),
				resolve: angular.extend(helper.resolveFor('ngDialog'), {
					tpl: function () { return { path: helper.basepath('ngdialog-template.html') }; }
				}),
				controller: 'BankViewController'
			})
			.state('app.editBank', {
				url: '/bank/:id/edit',
				title: 'Edit bank ',
				templateUrl: helper.basepath('edit.html'),
				controller: 'BankEditController',
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})

	}]);

myApp.controller('BankController', BankController);
myApp.controller('BankAddController', BankAddController);
myApp.controller('BankViewController', BankViewController);
myApp.controller('BankEditController', BankEditController);


function BankController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
	'use strict';

	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': '#', 'isActive': false },
			{ 'name': 'General', 'url': '#', 'isActive': false },
			{ 'name': 'Bank', 'url': 'app.bank', 'isActive': false }];

	var vm = this;
	var Api = $scope.$root.setup + "general/bank-accounts-all";
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
				//console.log($scope.checkData );
			}
		});



	//  $scope.$data = {};
	$scope.delete = function (id, index, $data) {

		var delUrl = $scope.$root.setup + "general/delete-bank-account";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { id: id, 'token': $scope.$root.token })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
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
function BankAddController($scope, $stateParams, $http, $state, $resource, toaster, $timeout) {
	//function BankAddController($scope, $stateParams, $http, $state,toaster,$resource,ngDialog){
	$scope.formTitle = 'Bank';
	$scope.btnCancelUrl = 'app.bank';
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': '#', 'isActive': false },
			{ 'name': 'General', 'url': '#', 'isActive': false },
			{ 'name': 'Bank', 'url': 'app.bank', 'isActive': false },
			{ 'name': 'Add', 'url': '#', 'isActive': false }];
	$scope.formUrl = function () {
		return "app/views/bank/_form.html";
	}

	$scope.rec = {};
	$scope.countries = {};
	$scope.currencies = {};
	$scope.arr_status = {};
	$scope.account_list = {};

	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'inActive', 'value': 0 }];

	var postUrl = $scope.$root.setup + "general/get-bank-account";
	var countryUrl = $scope.$root.setup + "general/countries";
	var currencyUrl = $scope.$root.setup + "general/currency-list";

	$http
		.post(countryUrl, { 'token': $scope.$root.token })
		.then(function (res) {
			if (res.data.ack == true)
				$scope.countries = res.data.response;
			else
				toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(232, ['Country']));
		});

	$http
		.post(currencyUrl, { 'token': $scope.$root.token })
		.then(function (res) {
			if (res.data.ack == true)
				$scope.currencies = res.data.response;
			else
				toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(232, ['Currency']));
		});



	var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";
	$http
		.post(postUrl_cat, { 'token': $scope.$root.token, 'cat_id': 2, 'display_id': 2 })
		.then(function (res) {
			if (res.data.ack == true)
				$scope.account_list = res.data.response_account;
			else
				toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(232, ['Account']));
			//console.log($scope.account_list);
		});


	$scope.add = function (rec) {
		//var postUrl = $scope.$root.setup+"general/add-bank-account";
		var postUrl = $scope.$root.setup + "general/update-bank-account";

		//rec.company_id = $scope.$root.company_id;
		// if(rec.id !== undefined)postUrl = $scope.$root.setup+"general/update-bank-account";

		rec.token = $scope.$root.token;
		rec.country_id = $scope.rec.country != undefined ? $scope.rec.country.id : 0;
		rec.currency_id = $scope.rec.currency != undefined ? $scope.rec.currency.id : 0;
		rec.account_no = $scope.rec.account_nos != undefined ? $scope.rec.account_nos.id : 0;
		rec.statuss = $scope.rec.status != undefined ? $scope.rec.status.value : 0;

		//console.log(rec); return;
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					$timeout(function () { $state.go('app.bank'); }, 1000);
				}
				else {
					toaster.pop('success', 'Edit', res.data.error);
				}


			});
	}
}

function BankViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
	$scope.formTitle = 'Bank';
	$scope.btnCancelUrl = 'app.bank';
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': '#', 'isActive': false },
			{ 'name': 'General', 'url': '#', 'isActive': false },
			{ 'name': 'Bank ', 'url': 'app.bank', 'isActive': false }];


	$scope.gotoEdit = function () {
		$state.go("app.editBank", { id: $stateParams.id });
	};

	$scope.formUrl = function () {
		return "app/views/bank/_form.html";
	}
	$scope.rec = {};
	$scope.countries = {};
	$scope.currencies = {};
	$scope.showLoader = true;
	var postUrl = $scope.$root.setup + "general/get-bank-account";
	var updateUrl = $scope.$root.setup + "general/update-bank-account";
	var countryUrl = $scope.$root.setup + "general/countries";
	var currencyUrl = $scope.$root.setup + "general/currency-list";
	var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

	$http
		.post(countryUrl, { 'token': $scope.$root.token })
		.then(function (res) {
			if (res.data.ack == true)
				$scope.countries = res.data.response;
			else
				toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(232, ['Country']));
		});

	$http
		.post(currencyUrl, { 'token': $scope.$root.token })
		.then(function (res) {
			if (res.data.ack == true)
				$scope.currencies = res.data.response;
			else
				toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(232, ['Currency']));
		});


	var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";
	$http
		.post(postUrl_cat, { 'token': $scope.$root.token, 'cat_id': 2, 'display_id': 2 })
		.then(function (res) {
			if (res.data.ack == true)
				$scope.account_list = res.data.response_account;
			else
				toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(232, ['Account']));
			//console.log($scope.account_list);
		});

	$scope.arr_status = {};
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'inActive', 'value': 0 }];

	$timeout(function () {
		$http
			.post(postUrl, postData)
			.then(function (res) {
				$scope.rec = res.data.response;
				$.each($scope.countries, function (index, obj) {
					if (obj.id == res.data.response.country_id) {
						$scope.rec.country = $scope.countries[index];
					}
				});

				$.each($scope.currencies, function (index, obj) {
					if (obj.id == res.data.response.currency_id) {
						$scope.rec.currency = $scope.currencies[index];
					}
				});

				$.each($scope.account_list, function (index, obj) {
					if (obj.id == res.data.response.account_no) {
						$scope.rec.account_nos = $scope.account_list[index];
					}
				});

				$.each($scope.arr_status, function (index, obj) {
					if (obj.value == res.data.response.status) {
						$scope.rec.status = $scope.arr_status[index];
					}
				});

			});
		$scope.showLoader = false;
	}, 1000);
};

function BankEditController($scope, $stateParams, $http, $state, $resource, toaster, $timeout) {

	$scope.formTitle = 'Bank';
	$scope.btnCancelUrl = 'app.bank';
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': '#', 'isActive': false },
			{ 'name': 'General', 'url': '#', 'isActive': false },
			{ 'name': 'Bank', 'url': 'app.bank', 'isActive': false },
			{ 'name': 'Edit', 'url': '#', 'isActive': false }];

	$scope.formUrl = function () {
		return "app/views/bank/_form.html";
	}
	$scope.rec = {};
	$scope.countries = {};
	$scope.currencies = {};
	$scope.showLoader = true;
	var postUrl = $scope.$root.setup + "general/get-bank-account";
	var updateUrl = $scope.$root.setup + "general/update-bank-account";
	var countryUrl = $scope.$root.setup + "general/countries";
	var currencyUrl = $scope.$root.setup + "general/currency-list";
	var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

	$http
		.post(countryUrl, { 'token': $scope.$root.token })
		.then(function (res) {
			if (res.data.ack == true)
				$scope.countries = res.data.response;
			else
				toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(232, ['Country']));
		});

	$http
		.post(currencyUrl, { 'token': $scope.$root.token })
		.then(function (res) {
			if (res.data.ack == true)
				$scope.currencies = res.data.response;
			else
				toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(232, ['Currency']));
		});


	var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";
	$http
		.post(postUrl_cat, { 'token': $scope.$root.token, 'cat_id': 2, 'display_id': 2 })
		.then(function (res) {
			if (res.data.ack == true)
				$scope.account_list = res.data.response_account;
			else
				toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(232, ['Account']));
			//console.log($scope.account_list);
		});

	$scope.arr_status = {};
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'inActive', 'value': 0 }];

	$timeout(function () {
		$http
			.post(postUrl, postData)
			.then(function (res) {
				$scope.rec = res.data.response;
				$.each($scope.countries, function (index, obj) {
					if (obj.id == res.data.response.country_id) {
						$scope.rec.country = $scope.countries[index];
					}
				});

				$.each($scope.currencies, function (index, obj) {
					if (obj.id == res.data.response.currency_id) {
						$scope.rec.currency = $scope.currencies[index];
					}
				});

				$.each($scope.account_list, function (index, obj) {
					if (obj.id == res.data.response.account_no) {
						$scope.rec.account_nos = $scope.account_list[index];
					}
				});

				$.each($scope.arr_status, function (index, obj) {
					if (obj.id == res.data.response.status) {
						$scope.rec.status = $scope.arr_status[index];
					}
				});

			});
		$scope.showLoader = false;
	}, 1000);

	$scope.update = function (rec) {
		rec.token = $scope.$root.token;
		rec.country_id = $scope.rec.country != undefined ? $scope.rec.country.id : 0;
		rec.currency_id = $scope.rec.currency != undefined ? $scope.rec.currency.id : 0;
		rec.account_no = $scope.rec.account_nos != undefined ? $scope.rec.account_nos.id : 0;
		rec.statuss = $scope.rec.status != undefined ? $scope.rec.status.value : 0;
		$http
			.post(updateUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					$timeout(function () { $state.go('app.bank'); }, 1000);
				}
				else {
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				}
			});
	}
}
