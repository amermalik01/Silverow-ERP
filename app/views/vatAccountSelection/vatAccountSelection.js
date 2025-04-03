vatAccountSelectionController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$rootScope"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

		$stateProvider
			.state('app.vat-account-selection', {
				url: '/vat-account-selection',
				title: 'Setup',
				templateUrl: helper.basepath('vatAccountSelection/vatAccountSelection.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
	}]);

myApp.controller('vatAccountSelectionController', vatAccountSelectionController);

function vatAccountSelectionController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $rootScope) {
	'use strict';

	$scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
	{ 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '2' },
	{ 'name': 'VAT Report Posting Account', 'url': '#', 'isActive': false }];

	var vm = this;
	$scope.company_id = $rootScope.defaultCompany;
	console.log('company_id');
	console.log($scope.company_id);
	$scope.vatPostingReadonly = true;

	$scope.btnCancelUrl = 'app.setup';

	$scope.gotoEdit = function () {
		$scope.vatPostingReadonly = false;
	}

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

	if($scope.company_id==133){
		var Api = $scope.$root.gl + "chart-accounts/get-vat-posting-account_new";
	}else{
		var Api = $scope.$root.gl + "chart-accounts/get-vat-posting-account";
	}
	

	$http
		.post(Api, $scope.postData)
		.then(function (res) {
			$scope.showLoader = false;
			if (res.data.ack == true && $scope.company_id==133) {
				$scope.vatPostingAccount_sale = res.data.VatPosting_gl_account_sale;
				$scope.vatPostingAccount_code_sale = res.data.vatPostingAccount_code_sale;

				$scope.vatPostingAccount_purchase = res.data.VatPosting_gl_account_purchase;
				$scope.vatPostingAccount_code_purchase = res.data.vatPostingAccount_code_purchase;

				$scope.vatPostingAccount_imp = res.data.VatPosting_gl_account_imp;
				$scope.vatPostingAccount_code_imp = res.data.vatPostingAccount_code_imp;

				$scope.vatPostingAccount_pay = res.data.VatPosting_gl_account_pay;
				$scope.vatPostingAccount_code_pay = res.data.vatPostingAccount_code_pay;
			}
			else if (res.data.ack == true && $scope.company_id!=133) {
				$scope.vatPostingAccount = res.data.VatPosting_gl_account;
				$scope.vatPostingAccount_code = res.data.VatPosting_gl_account_code;
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
		showAllGLAccountCodeSetup

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


	$scope.getGLAccountCode = function (val_type = '') {
		$scope.val_type = val_type;
		// var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";
		if($scope.company_id==133){
			var postUrl_cat = $scope.$root.gl + "chart-accounts/get-all-gl-accounts";
		}else{
			var postUrl_cat = $scope.$root.gl + "chart-accounts/get-gl-accounts-heading-by-name";
		}

		$scope.postData = {};

		$scope.title = 'Select G/L No.';
		// Heading

		$scope.postData.token = $scope.$root.token;
		$scope.showLoader = true;
		$scope.showall = false;
		$scope.showAllOption = true;
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

		// if ($scope.pendingSelGL_Account.code == '' || $scope.pendingSelGL_Account.code == undefined) {
		// 	toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['G/L Account']));
		// 	return false;
		// } 

		// $scope.vatPostingAccount_code = $scope.pendingSelGL_Account.code + " - " + $scope.pendingSelGL_Account.name;
		// $scope.vatPostingAccount = $scope.pendingSelGL_Account.id;
		// $scope.pendingSelGL_Account = {};

		$scope.vatPostingAccount_code = gl_data.code + " - " + gl_data.name;
		$scope.vatPostingAccount = gl_data.id;
		// angular.element('#inventorySetupGL_account_modal').modal('hide');
		angular.element('#finance_set_gl_account').modal('hide');
	}

	$scope.assignCodes_new = function (gl_data,val_type) {

		// if ($scope.pendingSelGL_Account.code == '' || $scope.pendingSelGL_Account.code == undefined) {
		// 	toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['G/L Account']));
		// 	return false;
		// } 

		// $scope.vatPostingAccount_code = $scope.pendingSelGL_Account.code + " - " + $scope.pendingSelGL_Account.name;
		// $scope.vatPostingAccount = $scope.pendingSelGL_Account.id;
		// $scope.pendingSelGL_Account = {};
		if(val_type=='sale'){
			$scope.vatPostingAccount_code_sale = gl_data.code + " - " + gl_data.name;
			$scope.vatPostingAccount_sale = gl_data.id;
		}
		if(val_type=='purchase'){
			$scope.vatPostingAccount_code_purchase = gl_data.code + " - " + gl_data.name;
			$scope.vatPostingAccount_purchase = gl_data.id;
		}
		if(val_type=='imp'){
			$scope.vatPostingAccount_code_imp = gl_data.code + " - " + gl_data.name;
			$scope.vatPostingAccount_imp = gl_data.id;
		}
		if(val_type=='pay'){
			$scope.vatPostingAccount_code_pay = gl_data.code + " - " + gl_data.name;
			$scope.vatPostingAccount_pay = gl_data.id;
		}

		$scope.vatPostingAccount_code = gl_data.code + " - " + gl_data.name;
		$scope.vatPostingAccount = gl_data.id;
		// angular.element('#inventorySetupGL_account_modal').modal('hide');
		angular.element('#finance_set_gl_account').modal('hide');
	}


	$scope.saveGLCode = function () {//assignCodes

		// console.log(gl_data);

		$scope.vatPostingAccount_code = $scope.vatPostingAccount_code;
		$scope.vatPostingAccount = $scope.vatPostingAccount;

		var postUrl_cat = $scope.$root.gl + "chart-accounts/change-vat-posting-account";

		$scope.postData.token = $scope.$root.token;
		$scope.postData.vatPostingAccount = $scope.vatPostingAccount;

		$http
			.post(postUrl_cat, $scope.postData)
			.then(function (res) {
				$scope.showLoader = false;

				if (res.data.ack == true) {
					$scope.vatPostingReadonly = true;
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
				}
				else
					toaster.pop('error', 'Info', res.data.error);

			}).catch(function (message) {
				$scope.showLoader = false;
				// toaster.pop('error', 'info', 'Server is not Acknowledging');
				throw new Error(message.data);
			});
	}

	$scope.saveGLCode_new = function () {//assignCodes

			// console.log(gl_data);

			var postUrl_cat = $scope.$root.gl + "chart-accounts/change-vat-posting-account_new";

			$scope.postData.token = $scope.$root.token;
			$scope.postData.vatPostingAccount_sale = $scope.vatPostingAccount_sale;
			$scope.postData.vatPostingAccount_purchase = $scope.vatPostingAccount_purchase;
			$scope.postData.vatPostingAccount_imp = $scope.vatPostingAccount_imp;
			$scope.postData.vatPostingAccount_pay = $scope.vatPostingAccount_pay;

			$http
				.post(postUrl_cat, $scope.postData)
				.then(function (res) {
					$scope.showLoader = false;

					if (res.data.ack == true) {
						$scope.vatPostingReadonly = true;
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
					}
					else
						toaster.pop('error', 'Info', res.data.error);

				}).catch(function (message) {
					$scope.showLoader = false;
					// toaster.pop('error', 'info', 'Server is not Acknowledging');
					throw new Error(message.data);
				});
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
}
