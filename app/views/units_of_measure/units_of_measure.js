UnitsOfMeasureController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "toaster", "ngDialog", "$rootScope"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		/* specific routes here (see file config.js) */
		$stateProvider
			.state('app.units_of_measure', {
				url: '/units_of_measure',
				title: 'Setup',
				templateUrl: helper.basepath('units_of_measure/units_of_measure.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.addUnitsOfMeasure', {
				url: '/units_of_measure/add',
				title: 'Add Unit Of Measure',
				templateUrl: helper.basepath('add.html'),
				controller: 'UnitsOfMeasureAddController'
			})
			.state('app.viewUnitsOfMeasure', {
				url: '/units_of_measure/:id/view',
				title: 'Setup',
				templateUrl: helper.basepath('view.html'),
				resolve: angular.extend(helper.resolveFor('ngDialog'), {
					tpl: function () { return { path: helper.basepath('ngdialog-template.html') }; }
				}),
				controller: 'UnitsOfMeasureViewController'
			})
			.state('app.editUnitsOfMeasure', {
				url: '/units_of_measure/:id/edit',
				title: 'Setup',
				templateUrl: helper.basepath('edit.html'),
				resolve: angular.extend(helper.resolveFor('ngDialog'), {
					tpl: function () { return { path: helper.basepath('ngdialog-template.html') }; }
				}),
				controller: 'UnitsOfMeasureEditController'
			})

	}]);

myApp.controller('UnitsOfMeasureController', UnitsOfMeasureController);
myApp.controller('UnitsOfMeasureAddController', UnitsOfMeasureAddController);
myApp.controller('UnitsOfMeasureViewController', UnitsOfMeasureViewController);
myApp.controller('UnitsOfMeasureEditController', UnitsOfMeasureEditController);

function UnitsOfMeasureController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, toaster, ngDialog, $rootScope) {
	'use strict';

	// required for inner references
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Inventory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
		{ 'name': 'Unit Of Measure', 'url': '#', 'isActive': false }];

	var vm = this;

	// For one time fetching data	
	//var Api = $resource('api/company/get_listing/:module_id/:module_table');

	// On Filter Dropdown change	

	var Api = $scope.$root.stock + "unit-measure/units";


	//console.log ( 'URL='+Api );
	//return false;
	$scope.searchKeyword = {};

	var postData = {
		'token': $scope.$root.token,
		'all': "1"
	};


	$scope.$watch("MyCustomeFilters", function () {
		if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
			$scope.table.tableParams5.reload();
		}
	}, true);
	$scope.MyCustomeFilters = {
	}

	//$scope.reload();

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
		});

	$scope.$data = {};
	$scope.deleteUnit = function (id, index, $data) {
		var delUrl = $scope.$root.stock + "unit-measure/delete-unit";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { 'token': $scope.$root.token, id: id })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
						$data.splice(index, 1);
					}
					else {
						toaster.pop('error', 'Info', "This category is used by another module!");
					}
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});

	};

	$scope.delete = function () {
		var delUrl = $scope.$root.stock + "unit-measure/delete-unit";

		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, postData)
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
						$timeout(function () { $state.go('app.units_of_measure'); }, 1500);
					}
					else {
						toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
						$timeout(function () { $state.go('app.units_of_measure'); }, 1500);
					}
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});

		//if(popupService.showPopup('Would you like to delete?')) {

		//  }*/
	};

}

function UnitsOfMeasureAddController($scope, $stateParams, $http, $state, toaster, $timeout, $rootScope) {
	//alert("Here");
	$scope.btnCancelUrl = 'app.units_of_measure';

	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Inventory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
		{ 'name': 'Unit Of Measure', 'url': '#', 'isActive': false }];
	// { 'name': 'Add', 'url': '#', 'isActive': false }

	$scope.formUrl = function () {
		return "app/views/units_of_measure/_form.html";
	}

	var postUrl = $scope.$root.stock + "unit-measure/add-unit";
	var unitUrl = $scope.$root.stock + "unit-measure/get-all-unit";

	$scope.rec = {};
	// $scope.unit_measures = {};
	$scope.parent_id = {};

	$scope.unit_measures = [];
	angular.copy($rootScope.uni_prooduct_arr, $scope.unit_measures);

	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

	angular.forEach($scope.arr_status, function (obj) {
		if (obj.value == 1)
			$scope.rec.status = obj;
	});
	/* $http
		.post(unitUrl, { 'token': $scope.$root.token })
		.then(function (res) {
			if (res.data.ack == true) {
				$scope.unit_measures = res.data.response;
				//$scope.country = $scope.countries[data.selected_comp]; 
			}
			else
				toaster.pop('error', 'Error', "No country found!");
		}); */

	$scope.add = function (rec) {
		rec.token = $scope.$root.token;
		rec.parent_id = 0;
		// rec.parent_id = $scope.rec.parent_id != undefined?$scope.rec.parent_id.id:0;
		rec.statuss = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;
		if (rec.title.length > 15) {
			toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
			return;
		}
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					$timeout(function () { $state.go('app.units_of_measure'); }, 1000);
				}
				else
					toaster.pop('error', 'info', res.data.error);
			});
	}
}

function UnitsOfMeasureViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout, $rootScope) {
	$scope.btnCancelUrl = 'app.units_of_measure';
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Inventory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
		{ 'name': 'Unit Of Measure', 'url': 'app.units_of_measure', 'isActive': false }];
	// $rootScope.currentSetupTab = 6;	 
	$scope.gotoEdit = function () {
		$state.go("app.editUnitsOfMeasure", { id: $stateParams.id });
	};

	$scope.rec = {};
	$scope.status = {};
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

	/* $scope.unit_measures = {};
	var unitUrl = $scope.$root.stock + "unit-measure/get-all-unit";

	$http
		.post(unitUrl, { 'token': $scope.$root.token })
		.then(function (res) {
			if (res.data.ack == true) {
				$scope.unit_measures = res.data.response;
			}
		}); */
	$scope.unit_measures = [];
	angular.copy($rootScope.uni_prooduct_arr, $scope.unit_measures);

	var postUrl = $scope.$root.stock + "unit-measure/get-unit";
	var postData = {
		'token': $scope.$root.token,
		'id': $stateParams.id
	};

	$scope.delete = function () {
		var delUrl = $scope.$root.stock + "unit-measure/delete-unit";

		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, postData)
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
						$timeout(function () { $state.go('app.units_of_measure'); }, 1500);
					}
					else {
						toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
						$timeout(function () { $state.go('app.units_of_measure'); }, 1500);
					}
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});

		//if(popupService.showPopup('Would you like to delete?')) {

		//  }*/
	};

	$http
		.post(postUrl, postData)
		.then(function (res) {
			$scope.rec = res.data.response;

			$.each($scope.unit_measures, function (index, obj) {
				if (obj.id == res.data.response.parent_id) {
					$scope.rec.parent_id = $scope.unit_measures[index];
				}
			});

			$.each($scope.arr_status, function (index, obj) {
				if (obj.value == res.data.response.status) {
					$scope.rec.status = $scope.arr_status[index];
				}
			});
		});

	$scope.formUrl = function () {
		return "app/views/units_of_measure/_form.html";
	}
}

function UnitsOfMeasureEditController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout, $rootScope) {

	$scope.btnCancelUrl = 'app.units_of_measure';
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Inventory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
		{ 'name': 'Unit Of Measure', 'url': 'app.units_of_measure', 'isActive': false }];
	// $rootScope.currentSetupTab = 6;

	$scope.rec = {};
	$scope.status = {};
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

	/* $scope.unit_measures = {};
	var unitUrl = $scope.$root.stock + "unit-measure/get-all-unit";

	$http
		.post(unitUrl, { 'token': $scope.$root.token })
		.then(function (res) {
			if (res.data.ack == true) {
				$scope.unit_measures = res.data.response;
			}
		}); */
	$scope.unit_measures = [];
	angular.copy($rootScope.uni_prooduct_arr, $scope.unit_measures);


	var postUrl = $scope.$root.stock + "unit-measure/get-unit";
	var postData = {
		'token': $scope.$root.token,
		'id': $stateParams.id
	};

	$scope.delete = function () {
		var delUrl = $scope.$root.stock + "unit-measure/delete-unit";

		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { 'token': $scope.$root.token, 'id': $stateParams.id })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Deleted', res.data.success);
						$timeout(function () { $state.go('app.units_of_measure'); }, 1500);
					}
					else {
						toaster.pop('error', 'Deleted', res.data.error);
					}
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});

		//if(popupService.showPopup('Would you like to delete?')) {

		//  }*/
	};

	$http
		.post(postUrl, postData)
		.then(function (res) {
			$scope.rec = res.data.response;
			$scope.rec.deletePerm = 1;

			$.each($scope.unit_measures, function (index, obj) {
				if (obj.id == res.data.response.parent_id) {
					$scope.rec.parent_id = $scope.unit_measures[index];
				}
			});

			$.each($scope.arr_status, function (index, obj) {
				if (obj.value == res.data.response.status) {
					$scope.rec.status = $scope.arr_status[index];
				}
			});
		});

	$scope.formUrl = function () {
		return "app/views/units_of_measure/_form.html";
	}

	var updateUrl = $scope.$root.stock + "unit-measure/update-unit";
	$scope.update = function (rec) {
		rec.token = $scope.$root.token;
		rec.parent_id = 0;
		// rec.parent_id = $scope.rec.parent_id != undefined?$scope.rec.parent_id.id:0;
		rec.status = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;
		if (rec.title.length > 15) {
			toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
			return;
		}
		$http
			.post(updateUrl, rec)
			.then(function (res) {
				if (res.data.ack == 1) {
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					$timeout(function () { $state.go('app.units_of_measure'); }, 1500);
				} else if (res.data.ack == 2) {
					toaster.pop('error', 'Edit', res.data.error);
				} else if (res.data.ack == 0) {
					toaster.pop('error', 'Edit', res.data.error);
				}
			});
	}
}