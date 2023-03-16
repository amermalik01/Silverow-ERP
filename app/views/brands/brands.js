BrandsController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "toaster", "ngDialog"];
BrandsFileController.$inject = ["$scope", "Upload", "$timeout"];

myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		/* specific routes here (see file config.js) */
		$stateProvider
			.state('app.brands', {
				url: '/brands',
				title: 'Setup',
				templateUrl: helper.basepath('brands/brands.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.addBrands', {
				url: '/brands/add',
				title: 'Setup',
				templateUrl: helper.basepath('add.html'),
				controller: 'BrandsAddController'
			})
			.state('app.viewBrands', {
				url: '/brands/:id/view',
				title: 'Setup',
				templateUrl: helper.basepath('view.html'),
				resolve: angular.extend(helper.resolveFor('ngDialog'), {
					tpl: function () { return { path: helper.basepath('ngdialog-template.html') }; }
				}),
				controller: 'BrandsViewController'
			})
			.state('app.editBrands', {
				url: '/brands/:id/edit',
				title: 'Setup',
				templateUrl: helper.basepath('edit.html'),
				resolve: angular.extend(helper.resolveFor('ngDialog'), {
					tpl: function () { return { path: helper.basepath('ngdialog-template.html') }; }
				}),
				controller: 'BrandsEditController'
			})
	}]);

myApp.controller('BrandsFileController', BrandsFileController);
myApp.controller('BrandsController', BrandsController);
myApp.controller('BrandsAddController', BrandsAddController);
myApp.controller('BrandsViewController', BrandsViewController);
myApp.controller('BrandsEditController', BrandsEditController);

function BrandsFileController($scope, Upload, $timeout) {
	$scope.uploadFiles = function (file, errFiles) {
		$scope.f = file;
		$scope.errFile = errFiles && errFiles[0];
		var postUrl = $scope.$root.stock + "brands/upload-image";

		if (file) {
			file.upload = Upload.upload({
				url: postUrl,
				data: { file: file, image_token: $scope.$root.token }
			});

			file.upload.then(function (response) {
				$timeout(function () {
					//$scope.get_response = response.data.response;
					$scope.rec.brandlogo = response.data.response;
					file.result = response.data;
				});
			}, function (response) {
				if (response.status > 0)
					$scope.errorMsg = response.status + ': ' + response.data;
			}, function (evt) {
				file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			});
		}
	}
}

function BrandsController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, toaster, ngDialog) {
	'use strict';

	// required for inner references
	$scope.showLoader = true;
	$scope.module_table = 'brand';
	$scope.class = 'inline_block';
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Inventory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
		{ 'name': 'Brands', 'url': '#', 'isActive': false }];

	var vm = this;

	// For one time fetching data	
	//var Api = $resource('api/company/get_listing/:module_id/:module_table');

	// On Filter Dropdown change	

	var Api = $scope.$root.stock + "brands";

	var postData = {
		'token': $scope.$root.token,
		'all': "1"
	};

	// var $data = [];
	$scope.record = [];
	$scope.columns = [];

	$http
		.post(Api, postData)
		.then(function (res) {
			if (res.data.ack == true) {
				// toaster.pop('success', 'Deleted', 'Record Deleted ');
				$scope.record = res.data.response;
				// $scope.columns = res.data.response;

				angular.forEach($scope.record, function (val) {
					// console.log(val.categories);
					// $scope.record.category = val.name;
					$scope.category = '';
					angular.forEach(val.categories, function (val2) {

						$scope.category += val2.name + ', ';
					});

					$scope.category = $scope.category.substring(0, $scope.category.length - 2);
					val.category = $scope.category;
				});
				// console.log($scope.record);
				
				angular.forEach(res.data.response[0], function (val, index) {
					$scope.columns.push({
						'title': toTitleCase(index),
						'field': index,
						'visible': true
					});
				});

			}
				$scope.showLoader = false;
		});


	/* $scope.$watch("MyCustomeFilters", function () {
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
	}, {
			total: 0,           // length of data
			counts: [],         // hide page counts control

			getData: function ($defer, params) {
				ngDataService.getDataCustom($defer, params, Api, $filter, $scope, postData);
			}
		}); */

	var delUrl = $scope.$root.stock + "brands/delete-brand";
	$scope.$data = {};
	$scope.deleteBrand = function (id, index, $data) {
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { 'token': $scope.$root.token, id: id })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Deleted', 'Record Deleted ');
						$data.splice(index, 1);
					}
					else {
						toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(106));

					}
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});

		//if(popupService.showPopup('Would you like to delete?')) {

		//  }*/
	};

}

function BrandsAddController($scope, $stateParams, $http, $state, toaster, $timeout, $rootScope, $filter) {

	$scope.btnCancelUrl = 'app.brands';
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Inventory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
		{ 'name': 'Brands', 'url': '#', 'isActive': false }];
	// { 'name': 'Add', 'url': '#', 'isActive': false }];

	$scope.formUrl = function () {
		return "app/views/brands/_form.html";
	}

	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];
	$scope.rec = {};
	$scope.status = {};
	$scope.categorySelArray = [];
	$scope.rec.status = $scope.arr_status[0];
	var postUrl = $scope.$root.stock + "brands/add-brand";

	$scope.add = function (rec) {
		$scope.showLoader = true;
		rec.token = $scope.$root.token;
		rec.statusid = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;
		rec.categorySelArray = $scope.categorySelArray;

		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
					$scope.$root.updateSelectedGlobalData("brand");
					$scope.$root.updateSelectedGlobalData("category");
					$timeout(function () { $state.go('app.brands'); }, 1000);
				}
				else
					toaster.pop('error', 'Info', res.data.error);

					$scope.showLoader = false;
			});
	}

	$scope.getCategories = function () {

		$scope.title = 'Categories';
		$scope.showLoader = true;
		$scope.columns = [];
		$scope.Categoriesarray = [];

		if ($rootScope.cat_prodcut_arr != undefined) {

			if ($rootScope.cat_prodcut_arr.length > 0) {

				$scope.Categoriesarray = $rootScope.cat_prodcut_arr;
				$scope.columns = $rootScope.cat_prodcut_arr;

				angular.forEach($scope.Categoriesarray, function(obj){
					obj.chk = false;
				});

				angular.element('#CategoriesModal').modal({ show: true });
			}
			else
				toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
		}
		else
			toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));


		$scope.showLoader = false;
	}


	$scope.selectcategorieschk = function (cat) {

		$scope.selectedAll = false;

		for (var i = 0; i < $scope.Categoriesarray.length; i++) {

			if (cat.id == $scope.Categoriesarray[i].id) {

				if ($scope.Categoriesarray[i].chk == true)
					$scope.Categoriesarray[i].chk = false;
				else
					$scope.Categoriesarray[i].chk = true;
			}
		}
	}
	$scope.searchKeyword = {};
	$scope.checkAllcategories = function (val) {
		var selection_filter = $filter('filter');
		var filtered = selection_filter($scope.Categoriesarray, $scope.searchKeyword.search);
		
		$scope.PendingSelcategory = [];

		if (val == true) {
			angular.forEach(filtered, function (obj) {
				obj.chk = true;
				$scope.PendingSelcategory.push(obj);
			})
		} else {
			for (var i = 0; i < $scope.Categoriesarray.length; i++) {
				$scope.Categoriesarray[i].chk = false;
			}

			$scope.PendingSelcategory = [];
		}
	}

	$scope.submitPendingSelcategories = function () {

		$scope.PendingSelcategory = [];
		$scope.PendingSelcategoryTooltip = "";

		for (var i = 0; i < $scope.Categoriesarray.length; i++) {

			if ($scope.Categoriesarray[i].chk == true) {
				$scope.PendingSelcategory.push($scope.Categoriesarray[i]);
				$scope.PendingSelcategoryTooltip = $scope.PendingSelcategoryTooltip + $scope.Categoriesarray[i].title + "; ";
			}
		}

		$scope.PendingSelcategoryTooltip = $scope.PendingSelcategoryTooltip.slice(0, -2);

		$scope.categorySelArray = $scope.PendingSelcategory;
		$scope.SelcategoryTooltip = $scope.PendingSelcategoryTooltip;

		angular.element('#CategoriesModal').modal('hide');
	}

	$scope.clearPendingSelcategories = function () {
		$scope.PendingSelcategory = [];
		$scope.PendingSelcategoryTooltip = "";
		angular.element('#CategoriesModal').modal('hide');
	}
}

function BrandsViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout, $rootScope) {
	$scope.btnCancelUrl = 'app.brands';
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Inventory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
		{ 'name': 'Brands', 'url': 'app.brands', 'isActive': false }];

		$scope.showLoader = true;
	$scope.formUrl = function () {
		return "app/views/brands/_form.html";
	}

	$scope.gotoEdit = function () {
		$state.go("app.editBrands", { id: $stateParams.id });
	};

	$scope.rec = {};
	$scope.status = {};
	$scope.categorySelArray = [];
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

	var postUrl = $scope.$root.stock + "brands/get-brand";
	var postData = {
		'token': $scope.$root.token,
		'id': $stateParams.id
	};

	$http
		.post(postUrl, postData)
		.then(function (res) {

			if (res.data.ack == true) {
				$scope.rec.id = res.data.id;
				$scope.rec.brandcode = res.data.brand_code;
				$scope.rec.brandname = res.data.brand_name;

				if ($rootScope.cat_prodcut_arr.length > 0) {

					angular.forEach($rootScope.cat_prodcut_arr, function (obj) {
						obj.chk = false;

						if (res.data.categories.length > 0) {

							angular.forEach(res.data.categories, function (obj2) {
								if (obj.id == obj2.categoryID) {
									obj.chk = true;
									$scope.categorySelArray.push(obj);
								}
							});
						}
					});
				}

				angular.forEach($scope.arr_status, function (obj) {
					if (obj.value == res.data.status) {
						$scope.rec.status = obj;
					}
				});
			}
				$scope.showLoader = false;
		});


	var delUrl = $scope.$root.stock + "brands/delete-brand";

	$scope.delete = function () {
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, postData)
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Deleted', 'Record Deleted ');
						$timeout(function () { $state.go('app.brands'); }, 1500);
					}
					else {
						// toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(106));
						toaster.pop('error', 'Can\'t be deleted', res.data.error);
						$timeout(function () { $state.go('app.brands'); }, 1500);
					}
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});

	};
};

function BrandsEditController($scope, $stateParams, $http, $state, $resource, toaster, $timeout, $rootScope, ngDialog, $filter) {

	$scope.btnCancelUrl = 'app.brands';
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Inventory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
		{ 'name': 'Brands', 'url': 'app.brands', 'isActive': false }];

	$scope.rec = {};
	$scope.status = {};
	$scope.categorySelArray = [];
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

	var postUrl = $scope.$root.stock + "brands/get-brand";
	var postData = {
		'token': $scope.$root.token,
		'id': $stateParams.id
	};

	$http
		.post(postUrl, postData)
		.then(function (res) {

			if (res.data.ack == true) {
				$scope.rec.id = res.data.id;
				$scope.rec.brandcode = res.data.brand_code;
				$scope.rec.brandname = res.data.brand_name;
				$scope.rec.deletePerm = 1;

				if ($rootScope.cat_prodcut_arr.length > 0) {

					angular.forEach($rootScope.cat_prodcut_arr, function (obj) {
						obj.chk = false;

						if (res.data.categories.length > 0) {

							angular.forEach(res.data.categories, function (obj2) {
								if (obj.id == obj2.categoryID) {
									obj.chk = true;
									$scope.categorySelArray.push(obj);
								}
							});
						}
					});
				}

				angular.forEach($scope.arr_status, function (obj) {
					if (obj.value == res.data.status) {
						$scope.rec.status = obj;
					}
				});
			}
		});

	$scope.formUrl = function () {
		return "app/views/brands/_form.html";
	}

	var delUrl = $scope.$root.stock + "brands/delete-brand";
	$scope.delete = function () {
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http.post(delUrl, postData)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Deleted', res.data.success);
					$timeout(function () { $state.go('app.brands'); }, 1500);
				} else {
					toaster.pop('error', 'Error', res.data.error);
				}
			});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});

	};

	var postUrl = $scope.$root.stock + "brands/update-brand";
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];
	$scope.rec = {};
	$scope.status = {};

	$scope.update = function (rec) {
		rec.token = $scope.$root.token;
		rec.id = $stateParams.id;
		rec.statusid = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;
		rec.categorySelArray = $scope.categorySelArray;
		$scope.showLoader = true;
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == 1) {
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));

					$rootScope.updateSelectedGlobalData("brand");
					$rootScope.updateSelectedGlobalData("category");

					$timeout(function () { $state.go('app.brands'); }, 1500);
				}
				else if (res.data.ack == 2) {
					toaster.pop('error', 'Edit', res.data.error);
					//$timeout(function(){ $state.go('app.brands'); }, 3000);
				} else if (res.data.ack == 0) {
					toaster.pop('success', 'Edit', res.data.error);
					$timeout(function () { $state.go('app.brands'); }, 1500);
				}
				$scope.showLoader = false;
			});
	}


	$scope.getCategories = function () {
		$scope.title = 'Categories';

		$scope.showLoader = true;
		$scope.columns = [];
		$scope.Categoriesarray = [];
		//console.log($rootScope.cat_prodcut_arr);

		/* if ($rootScope.cat_prodcut_arr.length > 0) {

			$scope.Categoriesarray = $rootScope.cat_prodcut_arr;
			$scope.columns = $rootScope.cat_prodcut_arr;

			angular.element('#CategoriesModal').modal({ show: true });
		}
		else toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
		$scope.showLoader = false; */

		if ($rootScope.cat_prodcut_arr != undefined) {

			if ($rootScope.cat_prodcut_arr.length > 0) {

				$scope.Categoriesarray = $rootScope.cat_prodcut_arr;
				$scope.columns = $rootScope.cat_prodcut_arr;
				angular.element('#CategoriesModal').modal({ show: true });
			}
			else
				toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
		}
		else
			toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));


		$scope.showLoader = false;



		/* var bucketApi = $scope.$root.sales + "customer/sale-bucket/get-sale-bucket-list";
		$http
			.post(bucketApi, { 'token': $scope.$root.token }).then(function (res) {
				if (res.data.ack == true) {

					angular.forEach(res.data.response, function (obj) {
						obj.chk = false;
						obj.isPrimary = false;
						if ($scope.categorySelArray.length > 0) {
							angular.forEach($scope.categorySelArray, function (obj2) {
								if (obj.id == obj2.id) {
									obj.chk = true;
									if (obj2.isPrimary)
										obj.isPrimary = true;
								}
							});
						}
						$scope.Categoriesarray.push(obj);
					});
					angular.forEach(res.data.response[0], function (val, index) {
						if (index != 'chk' && index != 'id') {
							$scope.columns.push({
								'title': toTitleCase(index),
								'field': index,
								'visible': true
							});
						}
					});


				}
				else toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
				$scope.showLoader = false;
			}); */

	}


	$scope.selectcategorieschk = function (cat) {

		$scope.selectedAll = false;

		for (var i = 0; i < $scope.Categoriesarray.length; i++) {

			if (cat.id == $scope.Categoriesarray[i].id) {

				if ($scope.Categoriesarray[i].chk == true)
					$scope.Categoriesarray[i].chk = false;
				else
					$scope.Categoriesarray[i].chk = true;
			}
		}
	}

	$scope.searchKeyword = {};
	$scope.checkAllcategories = function (val) {

		var selection_filter = $filter('filter');
		var filtered = selection_filter($scope.Categoriesarray, $scope.searchKeyword.search);
		$scope.PendingSelcategory = [];

		if (val == true) {
			angular.forEach(filtered, function (obj) {
				obj.chk = true;
				$scope.PendingSelcategory.push(obj);
			})
			// for (var i = 0; i < $scope.Categoriesarray.length; i++) {
			// 	$scope.Categoriesarray[i].chk = true;
			// 	$scope.PendingSelcategory.push($scope.Categoriesarray[i]);
			// }
		} else {
			for (var i = 0; i < $scope.Categoriesarray.length; i++) {
				$scope.Categoriesarray[i].chk = false;
			}

			$scope.PendingSelcategory = [];
		}
	}

	$scope.submitPendingSelcategories = function () {

		$scope.PendingSelcategory = [];
		$scope.PendingSelcategoryTooltip = "";

		for (var i = 0; i < $scope.Categoriesarray.length; i++) {

			if ($scope.Categoriesarray[i].chk == true) {
				$scope.PendingSelcategory.push($scope.Categoriesarray[i]);
				$scope.PendingSelcategoryTooltip = $scope.PendingSelcategoryTooltip + $scope.Categoriesarray[i].title + "; ";
			}
		}

		$scope.PendingSelcategoryTooltip = $scope.PendingSelcategoryTooltip.slice(0, -2);

		$scope.categorySelArray = $scope.PendingSelcategory;
		$scope.SelcategoryTooltip = $scope.PendingSelcategoryTooltip;

		angular.element('#CategoriesModal').modal('hide');
	}

	$scope.clearPendingSelcategories = function () {
		$scope.PendingSelcategory = [];
		$scope.PendingSelcategoryTooltip = "";
		angular.element('#CategoriesModal').modal('hide');
	}


}