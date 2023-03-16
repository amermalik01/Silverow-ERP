goodsReceivedAccountController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$rootScope"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

		$stateProvider
			.state('app.goods-received-account', {
				url: '/goods-received-gl-account',
				title: 'Setup',
				templateUrl: helper.basepath('goodsReceivedAccount/goodsReceivedAccount.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
	}]);

myApp.controller('goodsReceivedAccountController', goodsReceivedAccountController);

function goodsReceivedAccountController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $rootScope) {
	'use strict';

	$scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
	{ 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '2' },
	{ 'name': ' G/L Account for Goods Received Not Invoiced', 'url': '#', 'isActive': false }];

	var vm = this;

	$scope.goodsReceivedReadonly = true;

	$scope.btnCancelUrl = 'app.setup';

	$scope.gotoEdit = function () {
		$scope.goodsReceivedReadonly = false;
	}


	$scope.vat_scheme_not_registered = false;

	$scope.getCompanyVatScheme = function () {
		var chk_company_vat_scheme_Url = $scope.$root.setup + "general/chk-company-vat-scheme";

		$http
			.post(chk_company_vat_scheme_Url, {
				'token': $scope.$root.token
			})
			.then(function (res) {

				if (res.data.ack == true && res.data.vat_scheme == 2)
					$scope.vat_scheme_not_registered = true;
				else
					$scope.vat_scheme_not_registered = false;

			}).catch(function (message) {
				$scope.showLoader = false;
				throw new Error(message.data);
			});
	}

	$scope.getCompanyVatScheme();

	var postData = {
		'token': $scope.$root.token
	};


	$scope.showLoader = true;

	$scope.mainRecords = [];
	$scope.mainRecords2 = [];
	$scope.columns = [];
	$scope.columns2 = [];
	$scope.cattype = '';

	$scope.postData = {};
	$scope.postData.token = $scope.$root.token;

	var Api = $scope.$root.gl + "chart-accounts/get-goods-received-account";

	$http
		.post(Api, $scope.postData)
		.then(function (res) {
			$scope.showLoader = false;

			if (res.data.ack == true) {
				$scope.goodsReceivedAccount = res.data.goods_received_gl_account;
				$scope.goodsReceivedAccount_code = res.data.goods_received_gl_account_code;
			}
			else
				toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

		}).catch(function (message) {
			$scope.showLoader = false;
			// toaster.pop('error', 'info', 'Server is not Acknowledging');
			throw new Error(message.data);
		});

	$scope.pendingSelGL_Account = {};

	// show all gl accounts
	$scope.showAllGLAccountCode = function (showall) {
		// console.log(showall);
		//showAllGLAccountCodeSetup
		$scope.searchKeyword2 = {};

		var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";
		$scope.postData = {};

		if (showall == false) {
			$scope.postData.cat_id = 5;
		}

		$scope.postData.token = $scope.$root.token;

		$http
			.post(postUrl_cat, $scope.postData)
			.then(function (res) {
				$scope.gl_account = [];
				$scope.showLoader = false;

				if (res.data.ack == true) {
					$scope.gl_account = res.data.response;
				}
				else
					toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

			}).catch(function (message) {
				$scope.showLoader = false;
				// toaster.pop('error', 'info', 'Server is not Acknowledging');
				throw new Error(message.data);
			});
	}


	$scope.getGLAccountCode = function () {

		var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";

		$scope.postData = {};
		$scope.searchKeyword2 = {};

		$scope.title = 'Chart Of Accounts';

		$scope.postData.cat_id = 5;//[8];
		$scope.postData.token = $scope.$root.token;
		$scope.showLoader = true;
		$scope.showall = false;
		// $scope.searchKeyword2 = '';
		$scope.filter = {};	

		$http
			.post(postUrl_cat, $scope.postData)
			.then(function (res) {
				$scope.gl_account = [];
				$scope.showLoader = false;

				if (res.data.ack == true) {
					$scope.gl_account = res.data.response;
					// angular.element('#inventorySetupGL_account_modal').modal({ show: true });
					angular.element('#finance_set_gl_account').modal({ show: true });
				}
				else
					toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

			}).catch(function (message) {
				$scope.showLoader = false;
				// toaster.pop('error', 'info', 'Server is not Acknowledging');
				throw new Error(message.data);
			});
	}

	/* $scope.selectGL_Account = function (gl_data) {
		$scope.pendingSelGL_Account = gl_data;

		angular.forEach($scope.gl_account, function (obj) {
			obj.selchk = 0;
		});

		gl_data.selchk = 1;
	} */

	$scope.cancelGL_Account = function () {
		$scope.pendingSelGL_Account = {};
		// angular.element('#inventorySetupGL_account_modal').modal('hide');
		angular.element('#finance_set_gl_account').modal('hide');
	}

	// $scope.assignCodesGL_Account = function () {
	$scope.assignCodes = function (gl_data) {

		/* if ($scope.pendingSelGL_Account.code == '' || $scope.pendingSelGL_Account.code == undefined){
			toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['G/L Account']));
			return false;
		} */

		// $scope.goodsReceivedAccount_code = $scope.pendingSelGL_Account.code + " - " + $scope.pendingSelGL_Account.name;
		// $scope.goodsReceivedAccount = $scope.pendingSelGL_Account.id;

		$scope.goodsReceivedAccount_code = gl_data.code + " - " + gl_data.name;
		$scope.goodsReceivedAccount = gl_data.id;

		/* var postUrl_cat = $scope.$root.gl + "chart-accounts/change-vat-liability-account";

		$scope.postData.token = $scope.$root.token;
		$scope.postData.vat_lieability_receve_gl_account = $scope.pendingSelGL_Account.id;

		$http
			.post(postUrl_cat, $scope.postData)
			.then(function (res) {
				$scope.showLoader = false;

				if (res.data.ack == true)
					toaster.pop('success', 'Info', 'VAT Liability /Receivable Account is updated');
				else
					toaster.pop('error', 'Info', res.data.error);

			}).catch(function (message) {
				$scope.showLoader = false;
				toaster.pop('error', 'info', 'Server is not Acknowledging');
				throw new Error(message.data);
			}); */


		// $scope.pendingSelGL_Account = {};
		// angular.element('#inventorySetupGL_account_modal').modal('hide');
		angular.element('#finance_set_gl_account').modal('hide');
	}


	$scope.saveGLCode = function () {//assignCodes

		// console.log(gl_data);

		$scope.goodsReceivedAccount_code = $scope.goodsReceivedAccount_code;
		$scope.goodsReceivedAccount = $scope.goodsReceivedAccount;

		var postUrl_cat = $scope.$root.gl + "chart-accounts/change-goods-received-account";

		$scope.postData.token = $scope.$root.token;
		$scope.postData.goodsReceivedAccount = $scope.goodsReceivedAccount;

		$http
			.post(postUrl_cat, $scope.postData)
			.then(function (res) {
				$scope.showLoader = false;

				if (res.data.ack == true){
					$scope.goodsReceivedReadonly = true;
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));					
				}
				else
					toaster.pop('error', 'Info', res.data.error);

			}).catch(function (message) {
				$scope.showLoader = false;
				// toaster.pop('error', 'info', 'Server is not Acknowledging');
				throw new Error(message.data);
			});

		// angular.element('#finance_set_gl_account').modal('hide');
	}
}
