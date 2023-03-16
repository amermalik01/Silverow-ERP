// BankReconciliationController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster"];

myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.bankReconciliation', {
        url: '/bank-reconciliation',
        title: 'Bank',
        templateUrl: helper.basepath('bank_reconciliation/bank_reconciliation.html'),
		resolve: helper.resolveFor('ngTable','ngDialog'),
		controller: 'BankReconciliationController'
	})
	
 }]);


myApp.controller('BankReconciliationController', ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$stateParams", "$state", "$rootScope", "ModalService", function RemittanceAdviceController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams, $state, $rootScope, ModalService) {
    'use strict';
	
	console.log('bank_reconciliation.html');
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '2' },
		{ 'name': 'Bank Reconciliation', 'url': '#', 'isActive': false }];

	$scope.bankStatements = [];
	$scope.columns = [];
	$scope.filterTransaction = {};
	$scope.BankArr = [];

	$scope.filterTransaction.postingDate = $scope.$root.get_current_date();
	$scope.getData = function () {

		$scope.filterTransaction.token = $rootScope.token;
		$scope.filterTransaction.BankArr = $scope.BankArr;
		$scope.filterTransaction.postingDate = $scope.filterTransaction.postingDate;
		$scope.filterTransaction.type = $scope.filterTransaction.type;

		var getUrl = $scope.$root.gl + "chart-accounts/sil-bank-statements";
		var postData = { 'token': $scope.$root.token };
		$scope.silBankStatements = [];
		$scope.silColumns = [];

		$http
			.post(getUrl, $scope.filterTransaction)
			.then(function (res) {
				if (res.data.ack == true) {
					$scope.silBankStatements = res.data.response;
					console.log('silBankStatements===============', $scope.silBankStatements);
						angular.forEach(res.data.response[0], function (val, index) {
							$scope.silColumns.push({
								'title': toTitleCase(index),
								'field': index,
								'visible': true
							});
						});
					console.log('silColumns===============', $scope.silColumns);
				}
				else
					toaster.pop('warning', 'Info', "No Bank Statements Exists!");
			});
	}

	$scope.clearFilter = function () {
		$scope.filterTransaction = {};
		$scope.bankStatements = [];
		$scope.BankArr = [];
		$scope.SelBankTooltip = '';

		$scope.filterTransaction.postingDate = $scope.$root.get_current_date();
	}

	$scope.selectBanks = function () {

		console.log(' selectBanks');
		$scope.filterSupplier = {};
		$scope.tempBankArr = [];
		$scope.tempBankArr2 = [];
		$scope.bankListing = {};
		$scope.bankListing.token = $rootScope.token;

		$scope.showLoader = true;

		var BankApi = $scope.$root.setup + "general/bank-accounts";
		$http
			.post(BankApi, $scope.bankListing)
			.then(function (res) {
				$scope.showLoader = false;
				$scope.tempBankArr = [];
				$scope.tempBankArr2 = [];

				if (res.data.ack == true) {
					$scope.tempBankArr = res.data.response;
					$scope.tempBankArr2 = res.data;
					console.log('$scope.tempBankArr: ', $scope.tempBankArr);
					console.log('$scope.tempBankArr2: ', $scope.tempBankArr2);

					angular.forEach($scope.tempBankArr2.response, function (obj1) {
						obj1.checkbox = false;

						angular.forEach($scope.BankArr, function (obj) {
							if (obj.id == obj1.id)
								obj1.checkbox = true;
						});

					console.log('$scope.BankArr: ', $scope.BankArr);
						
					});

					if ($scope.tempBankArr[0].id)
						angular.element('#_bankListModal').modal({ show: true });
				}
				else {
					toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
				}
			});
	}

	$scope.PendingSelectedBanks = [];
	$scope.clearBank = function () {
		$scope.PendingSelectedBanks = [];
		angular.element('#_bankListModal').modal('hide');
	}

	$scope.addBank = function () {

		angular.copy($scope.tempBankArr2.response, $scope.BankArr);

		angular.forEach($scope.BankArr, function (recData) {

			if (recData.checkbox == true) {
				recData.moduleNo = recData.customer_code;
				recData.title = recData.name;
				recData.custID = recData.id;
				$scope.BankArr.push(recData);
			}
		});

		angular.element('#_bankListModal').modal('hide');
	}
}]);


