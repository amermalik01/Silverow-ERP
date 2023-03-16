inventorySetupController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$rootScope"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

		$stateProvider
			.state('app.inventory-setup', {
				url: '/inventory-setup',
				title: 'Setup',
				templateUrl: helper.basepath('inventorySetup/inventorySetup.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.add-inventory-setup', {
				url: '/inventory-setup/add',
				title: 'Setup',
				templateUrl: helper.basepath('add.html'),
				controller: 'inventorySetupAddController'
			})
			.state('app.view-inventory-setup', {
				url: '/inventory-setup/:id/view',
				title: 'Setup',
				templateUrl: helper.basepath('view.html'),
				controller: 'inventorySetupAddController'
			})
			.state('app.edit-inventory-setup', {
				url: '/inventory-setup/:id/edit',
				title: 'Setup',
				templateUrl: helper.basepath('edit.html'),
				controller: 'inventorySetupAddController'
			})
	}]);

myApp.controller('inventorySetupController', inventorySetupController);
myApp.controller('inventorySetupAddController', inventorySetupAddController);

function inventorySetupController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $rootScope) {
	'use strict';

	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '2' },
		{ 'name': 'Inventory Setup', 'url': '#', 'isActive': false }];

	var vm = this;
	var Api = $scope.$root.setup + "ledger-group/get-all-inventory-setup";
	var postData = {
		'token': $scope.$root.token,
		'inventorySetupSystemType':$rootScope.inventorySetupSystemType
	};

	$scope.inventoryCatType = [{ 'name': 'Perpetual Inventory System', 'id': 1 }, { 'name': 'Periodic Inventory System', 'id': 2 }];

	$scope.showLoader = true;

	$scope.mainRecords = [];
	$scope.allPostingGroup = [];
	$scope.mainRecords2 = [];
	$scope.columns = [];
	$scope.columns2 = [];
	$scope.cattype = '';
	$scope.vat_lieability_receve_gl_account_code = '';
	$scope.postData = {};
	$rootScope.inventorySetupSystemType = '';

	$scope.addMoreBtn = false;

	$http
		.post(Api, postData)
		.then(function (res) {

			$scope.showLoader = false;
			if (res.data.ack == true) {

				$scope.mainRecords = res.data.salesResponse;
				$scope.allPostingGroup = res.data.postingGroup;

				if (res.data.salesResponse) {
					angular.forEach(res.data.salesResponse[0], function (val, index) {
						$scope.columns.push({
							'title': toTitleCase(index),
							'field': index,
							'visible': true
						});
					});
				}

				$scope.mainRecords2 = res.data.purchaseResponse;
				if (res.data.purchaseResponse) {
					angular.forEach(res.data.purchaseResponse[0], function (val, index) {
						$scope.columns2.push({
							'title': toTitleCase(index),
							'field': index,
							'visible': true
						});
					});
				}

				if ($scope.allPostingGroup.length > 0 && 
					(($scope.mainRecords !=undefined && $scope.allPostingGroup.length > $scope.mainRecords.length) ||
					 ($scope.mainRecords == undefined) || 
					($scope.mainRecords2 != undefined && $scope.allPostingGroup.length > $scope.mainRecords2.length) ||
					 ($scope.mainRecords2 == undefined))) {
					$scope.addMoreBtn = true;

					/* angular.forEach(res.data.purchaseResponse, function (obj1) {

						angular.forEach(res.data.purchaseResponse, function (obj2) {
							if (obj1.posting_group == obj2.posting_group) {
								$scope.addMoreBtn= true;
							}
						});

						angular.forEach(res.data.salesResponse, function (obj3) {
							if (obj1.posting_group == obj3.posting_group) {
								$scope.addMoreBtn = true;
							}
						});
					}); */
				}

				$scope.vat_lieability_receve_gl_account_code = res.data.vat_lieability_receve_gl_account_code;
				$scope.vat_sales_type = res.data.vat_sales_type;
				$rootScope.inventorySetupSystemType = res.data.vat_sales_type;

				angular.forEach($scope.inventoryCatType, function (obj) {
					if (obj.id == res.data.vat_sales_type)
						$scope.cattype = obj;
				});
			}
		}).catch(function (message) {
			$scope.showLoader = false;
			
			throw new Error(message.data);
		});


	$scope.pendingSelGL_Account = {};

	// show all gl accounts VAT liabilty
	$scope.showAllGLAccountCodeSetup = function (showall) {
		// console.log(showall);

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

					angular.forEach($scope.gl_account, function (obj) {
						obj.selchk = 0;
					});
				}
				else
					toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

			}).catch(function (message) {
				$scope.showLoader = false;
				
				throw new Error(message.data);
			});
	}

	$scope.getGLAccountCodeVAT_liabilty = function () {
		
		var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";

		$scope.title = 'G/L Accounts For Inventory Setups';
		$scope.postData = {};
		$scope.postData.cat_id = 5;
		$scope.postData.token = $scope.$root.token;
		// console.log($scope.postData);
		$scope.showLoader = true;
		$scope.filter = {};	

		$http
			.post(postUrl_cat, $scope.postData)
			.then(function (res) {
				$scope.gl_account = [];
				$scope.showLoader = false;

				if (res.data.ack == true) {
					// $scope.gl_arg = arg;
					// $scope.gl_account_type_for = $scope.type_id;
					$scope.gl_account = res.data.response;

					angular.forEach($scope.gl_account, function (obj) {
						obj.selchk = 0;
					});
					// console.log($scope.gl_account);
					angular.element('#inventorySetupGL_account_modal').modal({ show: true });
				}
				else
					toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

			}).catch(function (message) {
				$scope.showLoader = false;
				
				throw new Error(message.data);
			});
	}

	$scope.selectGL_Account = function (gl_data) {
		$scope.pendingSelGL_Account = gl_data;

		angular.forEach($scope.gl_account, function (obj) {
			obj.selchk = 0;
		});

		gl_data.selchk = 1;
	}

	$scope.cancelGL_Account = function () {
		$scope.pendingSelGL_Account = {};
		angular.element('#inventorySetupGL_account_modal').modal('hide');
	}

	$scope.assignCodesGL_Account = function () {

		if ($scope.pendingSelGL_Account.code == '' || $scope.pendingSelGL_Account.code == undefined) {
			toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['G/L Account']));
			return false;
		}

		$scope.vat_lieability_receve_gl_account_code = $scope.pendingSelGL_Account.code + " - " + $scope.pendingSelGL_Account.name;
		$scope.vat_lieability_receve_gl_account = $scope.pendingSelGL_Account.id;

		var postUrl_cat = $scope.$root.gl + "chart-accounts/change-vat-liability-account";

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
				
				throw new Error(message.data);
			});


		$scope.pendingSelGL_Account = {};
		angular.element('#inventorySetupGL_account_modal').modal('hide');
	}

	if ($rootScope.inventorySetupcond > 0) {

		$timeout(function () {
			toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Inventory Setup Type']));
		}, 1000);
		$rootScope.inventorySetupcond = 0;
	}

	$scope.changeInventorySetupType = function (cattype) {

		// console.log(cattype);
		var postUrl_cat = $scope.$root.gl + "chart-accounts/change-inventory-setup-type";

		$scope.postData.token = $scope.$root.token;
		$scope.postData.cattype = (cattype !== undefined && cattype != '') ? cattype.id : 0;

		ngDialog.openConfirm({
			template: 'modalConfirmInventorySetupDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(postUrl_cat, $scope.postData)
				.then(function (res) {
					$scope.showLoader = false;

					if (res.data.ack == true) {
						$rootScope.inventorySetupSystemType = $scope.postData.cattype;
						$rootScope.inventorySetup = $scope.postData.cattype;
						$scope.vat_sales_type = $scope.postData.cattype;
						toaster.pop('success', 'Info', 'Record is updated');
					}
					else {
						toaster.pop('error', 'Info', res.data.error);
					}

				}).catch(function (message) {
					$scope.showLoader = false;
					
					throw new Error(message.data);
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
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

				// console.log($scope.vat_scheme_not_registered);
			}).catch(function (message) {
				$scope.showLoader = false;
				throw new Error(message.data);
			});
	}

	$scope.getCompanyVatScheme();
}

inventorySetupAddController.$inject = ["$scope", "$filter", "$resource", "$timeout", "$http", "ngDialog", "toaster", "$rootScope", "$state", "$stateParams"];

function inventorySetupAddController($scope, $filter, $resource, $timeout, $http, ngDialog, toaster, $rootScope, $state, $stateParams) {

	$scope.formTitle = 'Inventory Setup';
	$scope.btnCancelUrl = 'app.inventory-setup';
	// console.log($stateParams.id);
	// console.log($scope.vat_sales_type);
	// console.log($rootScope.inventorySetupSystemType);

	$rootScope.inventorySetupcond = 0;

	if (!($rootScope.inventorySetupSystemType > 0)) {
		$rootScope.inventorySetupcond = 1;
		$state.go('app.inventory-setup');
		return false;
	}

	$scope.inventorySetupType = [{ 'name': 'Sales Invoice & Credit Note', 'id': 1 }, { 'name': 'Purchase Invoice & Debit Note', 'id': 2 }];

	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Finance', 'url': 'app.setup', 'isActive': false, 'tabIndex': '2' },
		{ 'name': 'Inventory Setup', 'url': 'app.inventory-setup', 'isActive': false }];

	$scope.postingGroup = [];

	$scope.formUrl = function () {
		return "app/views/inventorySetup/_form.html";
	}

	if ($stateParams.id != undefined) {
		// $scope.check_readonly = true;

		$scope.showLoader = true;
		var postUrl = $scope.$root.setup + "ledger-group/get-inventory-setup";
		var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

		$http
			.post(postUrl, postData)
			.then(function (res) {
				$scope.rec = {};
				$scope.showLoader = false;
				if (res.data.ack == true) {
					$scope.rec = res.data.response;
					$scope.postingGroup = res.data.postingGrp.response;
					$scope.rec.deletePerm = 1;

					angular.forEach($scope.postingGroup, function (obj) {
						if (obj.id == res.data.response.postingGroup) {
							$scope.rec.postingGroup = obj;
						}
					});

					angular.forEach($scope.inventorySetupType, function (obj) {
						if (obj.id == res.data.response.type) {
							$scope.rec.type = obj;
						}
					});

					// $scope.rec.vat = Number(res.data.response.vat);
				}
				else
					toaster.pop('warning', 'Info', "No VAT Rate Exist!");

			}).catch(function (message) {
				$scope.showLoader = false;
				
				throw new Error(message.data);
			});

		$scope.hideDel = false;
	} else {
		$scope.rec = {};
		$scope.showLoader = true;

		var postUrl1 = $scope.$root.setup + "ledger-group/get-inventory-setup-predata";
		var postData1 = { 'token': $scope.$root.token };

		$http
			.post(postUrl1, postData1)
			.then(function (res) {

				$scope.showLoader = false;

				if (res.data.ack == true) {

					// console.log(res.data);
					$scope.postingGroup = res.data.postingGroup;
					// $scope.vatRate = res.data.vatRate.response;
				}
				else
					toaster.pop('warning', 'Info', "No Posting Group Exist!");
			}).catch(function (message) {
				$scope.showLoader = false;
				
				throw new Error(message.data);
			});
		$scope.check_readonly = false;
	}

	$scope.gotoEdit = function () {
		$scope.check_readonly = false;
		var recid = $stateParams.id;
		$state.go("app.edit-inventory-setup", { id: $stateParams.id });
	}

	$scope.delete = function () {

		var delUrl = $scope.$root.setup + "ledger-group/delete-inventory-setup";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						$timeout(function () {
							$state.go('app.inventory-setup');
						}, 1000);
					}
					else {
						toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
					}
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});
	}

	$scope.add = function (rec) {
		rec.token = $scope.$root.token;
		// console.log(rec);
		rec.posting_grpid = ($scope.rec.postingGroup !== undefined && $scope.rec.postingGroup != '') ? $scope.rec.postingGroup.id : 0;
		rec.typeid = ($scope.rec.type !== undefined && $scope.rec.type != '') ? $scope.rec.type.id : 0;

		var postUrl = $scope.$root.setup + "ledger-group/update-inventory-setup";
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

					$timeout(function () {
						$state.go('app.inventory-setup');
					}, 2000);
				}
				else
					toaster.pop('error', 'Add', res.data.error);
			});
	}

	$scope.update = function (rec) {
		rec.token = $scope.$root.token;
		// console.log(rec);
		rec.posting_grpid = ($scope.rec.postingGroup !== undefined && $scope.rec.postingGroup != '') ? $scope.rec.postingGroup.id : 0;
		rec.typeid = ($scope.rec.type !== undefined && $scope.rec.type != '') ? $scope.rec.type.id : 0;

		var postUrl = $scope.$root.setup + "ledger-group/update-inventory-setup";
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));

					$timeout(function () {
						$state.go('app.inventory-setup');
					}, 2000);
				}
				else
					toaster.pop('error', 'Add', res.data.error);
			});
	}

	// show all gl accounts
	$scope.showAllGLAccountCode = function (showall) {
		// console.log(showall);

		var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";
		$scope.postData = {};
		console.log($scope.glAccountType);

		if (showall == false) {

			if ($scope.glAccountType == 'salesAccountDebators' || $scope.glAccountType == 'salesAccountStock') {
				$scope.postData.cat_id = 3;
			}
			else if ($scope.glAccountType == 'salesAccountSalesDiscount' || $scope.glAccountType == 'salesAccountSales') {
				$scope.postData.cat_id = 9;
			}
			else if ($scope.glAccountType == 'salesAccountSalesVAT' || $scope.glAccountType == 'purchaseAccountPurchasesVAT' || $scope.glAccountType == 'purchaseAccountCreditors') {
				$scope.postData.cat_id = 5;
			}
			else if ($scope.glAccountType == 'salesAccountCostOfGoodsSold') {
				$scope.postData.cat_id = 12;
			}
			else if ($scope.glAccountType == 'purchaseAccountStock') {
				if ($scope.inventory_type == 1)
					$scope.postData.cat_id = 3;
				else
					$scope.postData.cat_id = 12;
			}
			else if ($scope.glAccountType == 'purchaseAccountPurchasesDisc') {
				// $scope.postData.cat_id = 12;//3;
				if ($rootScope.inventorySetupSystemType == 1)
					$scope.postData.cat_id = 3;//[3];
				else
					$scope.postData.cat_id = 12;
			}
			else if ($scope.glAccountType == 'vat_lieability_receve_gl_account') {
				$scope.postData.cat_id = 5;
			}
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
				
				throw new Error(message.data);
			});
	}


	$scope.getGLAccountCode = function (arg, inventory_type) {
		$scope.searchKeyword2 = {};

		//  console.log(arg);
		// console.log(inventory_type);
		// return false; 
		$scope.showall = false;

		if (angular.element('#showAllGLAccountCode').is(':checked') == true){
			angular.element('#showAllGLAccountCode').click();
		}
		
		$scope.glAccountType = arg;
		$scope.inventory_type = inventory_type;
		var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";

		$scope.postData = {};
		// $scope.postData.cat_id = [];

		$scope.title = 'G/L Accounts For Inventory Setups';

		if (arg == 'salesAccountDebators' || arg == 'salesAccountStock') {
			$scope.postData.cat_id = 3;//[3];
		}
		else if (arg == 'salesAccountSalesDiscount' || arg == 'salesAccountSales') {
			$scope.postData.cat_id = 9;//[7];
		}
		else if (arg == 'salesAccountSalesVAT' || arg == 'purchaseAccountPurchasesVAT' || arg == 'purchaseAccountCreditors') {
			$scope.postData.cat_id = 5;//[8];
		}
		else if (arg == 'salesAccountCostOfGoodsSold') {
			$scope.postData.cat_id = 12;//[12];
		}
		/* else if (arg == 'purchaseAccountCreditors') {
			$scope.postData.cat_id = [3];
		} */
		else if (arg == 'purchaseAccountStock') {
			if (inventory_type == 1)
				$scope.postData.cat_id = 3;//[3];
			else
				$scope.postData.cat_id = 12;//[12];
		}
		else if (arg == 'purchaseAccountPurchasesDisc') {
			// $scope.postData.cat_id = 12;//3;//[8];
			if ($rootScope.inventorySetupSystemType == 1)
				$scope.postData.cat_id = 3;//[3];
			else
				$scope.postData.cat_id = 12;
		}
		else if (arg == 'vat_lieability_receve_gl_account') {
			$scope.postData.cat_id = 5;//[8];
		}

		$scope.postData.token = $scope.$root.token;
		// console.log($scope.postData);
		$scope.showLoader = true;

		$http
			.post(postUrl_cat, $scope.postData)
			.then(function (res) {
				$scope.gl_account = [];
				$scope.showLoader = false;

				if (res.data.ack == true) {
					// $scope.gl_arg = arg;
					// $scope.gl_account_type_for = $scope.type_id;
					$scope.gl_account = res.data.response;
					// console.log($scope.gl_account);
					angular.element('#finance_set_gl_account').modal({ show: true });
				}
				else
					toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

			}).catch(function (message) {
				$scope.showLoader = false;
				
				throw new Error(message.data);
			});
	}

	$scope.assignCodes = function (gl_data) {
		// console.log(gl_data);
		// console.log($scope.glAccountType);

		if ($scope.glAccountType == 'salesAccountDebators') {

			$scope.rec.salesAccountDebatorsCode = gl_data.code + " - " + gl_data.name;
			$scope.rec.salesAccountDebators = gl_data.id;

		} else if ($scope.glAccountType == 'salesAccountSales') {

			$scope.rec.salesAccountSalesCode = gl_data.code + " - " + gl_data.name;
			$scope.rec.salesAccountSales = gl_data.id;

		} else if ($scope.glAccountType == 'salesAccountSalesDiscount') {

			$scope.rec.salesAccountSalesDiscountCode = gl_data.code + " - " + gl_data.name;
			$scope.rec.salesAccountSalesDiscount = gl_data.id;

		} else if ($scope.glAccountType == 'salesAccountSalesVAT') {

			$scope.rec.salesAccountSalesVATCode = gl_data.code + " - " + gl_data.name;
			$scope.rec.salesAccountSalesVAT = gl_data.id;

		} else if ($scope.glAccountType == 'salesAccountCostOfGoodsSold') {

			$scope.rec.salesAccountCostOfGoodsSoldCode = gl_data.code + " - " + gl_data.name;
			$scope.rec.salesAccountCostOfGoodsSold = gl_data.id;

		} else if ($scope.glAccountType == 'salesAccountStock') {

			$scope.rec.salesAccountStockCode = gl_data.code + " - " + gl_data.name;
			$scope.rec.salesAccountStock = gl_data.id;

		} else if ($scope.glAccountType == 'purchaseAccountCreditors') {

			$scope.rec.purchaseAccountCreditorsCode = gl_data.code + " - " + gl_data.name;
			$scope.rec.purchaseAccountCreditors = gl_data.id;

		} else if ($scope.glAccountType == 'purchaseAccountStock') {

			$scope.rec.purchaseAccountStockCode = gl_data.code + " - " + gl_data.name;
			$scope.rec.purchaseAccountStock = gl_data.id;

		} else if ($scope.glAccountType == 'purchaseAccountPurchasesDisc') {

			$scope.rec.purchaseAccountPurchasesDiscCode = gl_data.code + " - " + gl_data.name;
			$scope.rec.purchaseAccountPurchasesDisc = gl_data.id;

		} else if ($scope.glAccountType == 'purchaseAccountPurchasesVAT') {

			$scope.rec.purchaseAccountPurchasesVATCode = gl_data.code + " - " + gl_data.name;
			$scope.rec.purchaseAccountPurchasesVAT = gl_data.id;

		} else if ($scope.glAccountType == 'vat_lieability_receve_gl_account') {

			$scope.rec.vat_lieability_receve_gl_account_code = gl_data.code + " - " + gl_data.name;
			$scope.rec.vat_lieability_receve_gl_account = gl_data.id;

		}

		angular.element('#finance_set_gl_account').modal('hide');
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