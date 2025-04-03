FinanceChargesController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		/* specific routes here (see file config.js) */
		$stateProvider
			.state('app.finance-charges', {
				url: '/finance-charges',
				title: 'Finance Charges',
				templateUrl: helper.basepath('finance_charges/finance_charges.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.add-finance-charges', {
				url: '/finance-charges/add',
				title: 'Add Finance Charges',
				templateUrl: helper.basepath('add.html'),
				controller: 'FinanceChargesAddController'
			})
			.state('app.view-finance-charges', {
				url: '/finance-charges/:id/view',
				title: 'View ',
				templateUrl: helper.basepath('view.html'),
				resolve: angular.extend(helper.resolveFor('ngDialog'), {
					tpl: function () { return { path: helper.basepath('ngdialog-template.html') }; }
				}),
				controller: 'FinanceChargesViewController'
			})
			.state('app.edit-finance-charges', {
				url: '/finance-charges/:id/edit',
				title: 'Edit Finance Charges',
				templateUrl: helper.basepath('edit.html'),
				controller: 'FinanceChargesEditController'
			})

	}]);

myApp.controller('FinanceChargesController', FinanceChargesController);
myApp.controller('FinanceChargesAddController', FinanceChargesAddController);
myApp.controller('FinanceChargesViewController', FinanceChargesViewController);
myApp.controller('FinanceChargesEditController', FinanceChargesEditController);

function FinanceChargesController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
	'use strict';

	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
			{ 'name': 'Finance Charges', 'url': '#', 'isActive': false }];

	var vm = this;
	var Api = $scope.$root.setup + "crm/finance-charges";
	var postData = {
		'token': $scope.$root.token,
		'all': "1",
		'column': 'type',
		'value': 1
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


	$scope.$data = {};
	$scope.delete = function (id, index, $data) {
		var delUrl = $scope.$root.setup + "crm/delete-finance-charges";
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



function FinanceChargesAddController($scope, $stateParams, $http, $state, toaster, $timeout) {

	$scope.formTitle = 'Finance Charges';
	$scope.btnCancelUrl = 'app.finance-charges';
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
			{ 'name': 'Finance Charges', 'url': 'app.finance-charges', 'isActive': false }];
			// { 'name': 'Add', 'url': '#', 'isActive': false }];

	$scope.formUrl = function () {
		return "app/views/finance_charges/_form.html";
	}

	$scope.rec = {};
	var postUrl = $scope.$root.setup + "crm/add-finance-charges";


	$scope.add = function (rec) {

		if (parseFloat(rec.value) > 100) {
			toaster.pop('error', 'Info', "Finance charge can not be more than 100!");
			return false;
		}

		rec.token = $scope.$root.token;
		rec.discount_type = $scope.discount_type_id != undefined ? $scope.discount_type_id.id : 0;
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					$timeout(function () { $state.go('app.finance-charges'); }, 3000);
				}
				else
					toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
			});
	}

	$scope.show_symbol = false;
	$scope.setSymbol = function () {
		var id = this.rec.discount_type_id.id;
		if (id == 'Percentage')
			$scope.show_symbol = true;
		else
			$scope.show_symbol = false;
	}

	var getCrmCodeUrl = $scope.$root.setup + "crm/get-finance-charge-code";
	$scope.getCode = function (rec) {
		$http
			.post(getCrmCodeUrl, { 'module_id': 52, 'is_increment': 1, 'token': $scope.$root.token })
			.then(function (res) {
				$scope.code = res.data.code;
				//$scope.rec.crm_no = res.data.number;
			});
		return false;
	}
}

function FinanceChargesViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
	$scope.formTitle = 'Finance Charges';
	$scope.btnCancelUrl = 'app.finance-charges';
	$scope.hideDel = false;
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
			{ 'name': 'Finance Charges', 'url': 'app.finance-charges', 'isActive': false }];
			// { 'name': 'Detail', 'url': '#', 'isActive': false }];

	$scope.formUrl = function () {
		return "app/views/finance_charges/_form.html";
	}

	$scope.gotoEdit = function () {
		$state.go("app.edit-finance-charges", { id: $stateParams.id });
	};


	$scope.rec = {};
	var postUrl = $scope.$root.setup + "crm/get-finance-charges";
	var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

	$http
		.post(postUrl, postData)
		.then(function (res) {
			$scope.rec = res.data.response;
			if (res.data.response.discount_type == 'Percentage')
				$scope.show_symbol = true;

			$.each($scope.arr_discount_type, function (index, elem) {
				if (elem.id == res.data.response.discount_type) {
					$scope.rec.discount_type_id = elem;
				}
			});

 		/*if(res.data.response.crm_no  == null){
			$scope.code = 'FC001';
			//$scope.rec.crm_no = 1;
		}*/
			if (res.data.response.id < 10)
				$scope.code = 'FC00' + res.data.response.id;
			else if (res.data.response.crm_no > 10 && res.data.response.id < 100)
				$scope.code = 'FC0' + res.data.response.id;
			else
				$scope.code = 'FC' + res.data.response.id;

			/*if(res.data.response.crm_no  != null){
				//$scope.rec.crm_no = res.data.response.crm_no;
				$scope.code = 'FC'+res.data.response.crm_no;
			}*/
		});




};

function FinanceChargesEditController($scope, $stateParams, $http, $state, $resource, toaster, $timeout) {

	$scope.formTitle = 'Finance Charges';
	$scope.btnCancelUrl = 'app.finance-charges';
	$scope.hideDel = false;
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
			{ 'name': 'Finance Charges', 'url': 'app.finance-charges', 'isActive': false }];
			// { 'name': 'Edit', 'url': '#', 'isActive': false }];

	$scope.formUrl = function () {
		return "app/views/finance_charges/_form.html";
	}

	$scope.rec = {};
	var postUrl = $scope.$root.setup + "crm/get-finance-charges";
	var updateUrl = $scope.$root.setup + "crm/update-finance-charges";
	var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

	$http
		.post(postUrl, postData)
		.then(function (res) {
			$scope.rec = res.data.response;
			if (res.data.response.discount_type == 'Percentage')
				$scope.show_symbol = true;

			$.each($scope.arr_discount_type, function (index, elem) {
				if (elem.id == res.data.response.discount_type) {
					$scope.rec.discount_type_id = elem;
				}
			});

			if (res.data.response.id < 10)
				$scope.code = 'FC00' + res.data.response.id;
			else if (res.data.response.crm_no > 10 && res.data.response.id < 100)
				$scope.code = 'FC0' + res.data.response.id;
			else
				$scope.code = 'FC' + res.data.response.id;

		});


	$scope.update = function (rec) {

		if (parseFloat(rec.value) > 100) {
			toaster.pop('error', 'Info', "Finance charge can not be more than 100!");
			return false;
		}

		rec.token = $scope.$root.token;
		rec.discount_type = rec.discount_type_id != undefined ? rec.discount_type_id.id : 0;
		$http
			.post(updateUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					$timeout(function () { $state.go('app.finance-charges'); }, 3000);
				}
				else
					toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
			});
	}

	$scope.show_symbol = false;
	$scope.setSymbol = function () {
		var id = this.rec.discount_type_id.id;
		if (id == 'Percentage')
			$scope.show_symbol = true;
		else
			$scope.show_symbol = false;
	}

}


