CompetitorVolumeController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "toaster", "ngDialog", "$rootScope"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		/* specific routes here (see file config.js) */
		$stateProvider
			.state('app.competitor_volume', {
				url: '/competitor_volume',
				title: 'Setup',
				templateUrl: helper.basepath('competitor_volume/competitor_volume.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.addCompetitorVolume', {
				url: '/competitor_volume/add',
				title: 'Setup',
				templateUrl: helper.basepath('add.html'),
				controller: 'CompetitorVolumeAddController'
			})
			.state('app.viewCompetitorVolume', {
				url: '/competitor_volume/:id/view',
				title: 'Setup',
				templateUrl: helper.basepath('view.html'),
				resolve: angular.extend(helper.resolveFor('ngDialog'), {
					tpl: function () { return { path: helper.basepath('ngdialog-template.html') }; }
				}),
				controller: 'CompetitorVolumeViewController'
			})
			.state('app.editCompetitorVolume', {
				url: '/competitor_volume/:id/edit',
				title: 'Setup',
				templateUrl: helper.basepath('edit.html'),
				resolve: angular.extend(helper.resolveFor('ngDialog'), {
					tpl: function () { return { path: helper.basepath('ngdialog-template.html') }; }
				}),
				controller: 'CompetitorVolumeEditController'
			})

	}]);

myApp.controller('CompetitorVolumeController', CompetitorVolumeController);
myApp.controller('CompetitorVolumeAddController', CompetitorVolumeAddController);
myApp.controller('CompetitorVolumeViewController', CompetitorVolumeViewController);
myApp.controller('CompetitorVolumeEditController', CompetitorVolumeEditController);

function CompetitorVolumeController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, toaster, ngDialog, $rootScope) {
	'use strict';

	// required for inner references
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
		{ 'name': 'Competitor Volume', 'url': '#', 'isActive': false }];

	var vm = this;

	// For one time fetching data	
	//var Api = $resource('api/company/get_listing/:module_id/:module_table');

	// On Filter Dropdown change	

	var Api = $scope.$root.setup + "competitors/getCompetitorPropertyListing";


	//console.log ( 'URL='+Api );
	//return false;
	$scope.searchKeyword = {};

	$scope.propertyType = 4;

	var postData = {
		'token': $scope.$root.token,
		'all': "1",
		'type': $scope.propertyType
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
		count: 100,           // count per page
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
		var delUrl = $scope.$root.setup + "competitors/deleteCompetitorProperty";
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
						toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(640));
					}
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});

	};

	$scope.delete = function () {
		var delUrl = $scope.$root.setup + "competitors/deleteCompetitorProperty";

		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, postData)
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
						$timeout(function () { $state.go('app.competitor_volume'); }, 1500);
					}
					else {
						toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
						$timeout(function () { $state.go('app.competitor_volume'); }, 1500);
					}
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});

		//if(popupService.showPopup('Would you like to delete?')) {

		//  }*/
	};

}

function CompetitorVolumeAddController($scope, $stateParams, $http, $state, toaster, $timeout, $rootScope) {
	//alert("Here");
	$scope.btnCancelUrl = 'app.competitor_volume';

	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
		{ 'name': 'Competitor Volume', 'url': '#', 'isActive': false }];
	// { 'name': 'Add', 'url': '#', 'isActive': false }

	$scope.propertyType = 4;
	$scope.formUrl = function () {
		return "app/views/competitor_volume/_form.html";
	}

	var postUrl = $scope.$root.setup + "competitors/addCompetitorProperty";
	var unitUrl = $scope.$root.setup + "competitors/getCompetitorPropertyListing";

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
				
		}); */

	$scope.add = function (rec) {
		rec.token = $scope.$root.token;
		rec.parent_id = 0;
		rec.type = $scope.propertyType;
		// rec.parent_id = $scope.rec.parent_id != undefined?$scope.rec.parent_id.id:0;
		rec.statuss = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					$timeout(function () { $state.go('app.competitor_volume'); }, 1000);
				}
				else
					toaster.pop('error', 'info', res.data.error);
			});
	}
}

function CompetitorVolumeViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout, $rootScope) {
	$scope.btnCancelUrl = 'app.competitor_volume';
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
		{ 'name': 'Competitor Volume', 'url': 'app.competitor_volume', 'isActive': false }];
	// $rootScope.currentSetupTab = 6;	 
	$scope.gotoEdit = function () {
		$state.go("app.editCompetitorVolume", { id: $stateParams.id });
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

	var postUrl = $scope.$root.setup + "competitors/getCompetitorPropertyById";
	var postData = {
		'token': $scope.$root.token,
		'id': $stateParams.id
	};

	$scope.delete = function () {
		var delUrl = $scope.$root.setup + "competitors/deleteCompetitorProperty";

		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, postData)
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
						$timeout(function () { $state.go('app.competitor_volume'); }, 1500);
					}
					else {
						toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
						$timeout(function () { $state.go('app.competitor_volume'); }, 1500);
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
		return "app/views/competitor_volume/_form.html";
	}
}

function CompetitorVolumeEditController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout, $rootScope) {

	$scope.btnCancelUrl = 'app.competitor_volume';
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
		{ 'name': 'Competitor Volume', 'url': 'app.competitor_volume', 'isActive': false }];
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


	var postUrl = $scope.$root.setup + "competitors/getCompetitorPropertyById";
	var postData = {
		'token': $scope.$root.token,
		'id': $stateParams.id
	};

	$scope.delete = function () {
		var delUrl = $scope.$root.setup + "competitors/deleteCompetitorProperty";

		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, postData)
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
						$timeout(function () { $state.go('app.competitor_volume'); }, 1500);
					}
					else {
						toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
						$timeout(function () { $state.go('app.competitor_volume'); }, 1500);
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
		return "app/views/competitor_volume/_form.html";
	}

	var updateUrl = $scope.$root.setup + "competitors/updateCompetitorProperty";
	$scope.update = function (rec) {
		rec.token = $scope.$root.token;
		rec.parent_id = 0;
		// rec.parent_id = $scope.rec.parent_id != undefined?$scope.rec.parent_id.id:0;
		rec.status = $scope.rec.status.value !== undefined ? $scope.rec.status.value : 0;
		$http
			.post(updateUrl, rec)
			.then(function (res) {
				if (res.data.ack == 1) {
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					$timeout(function () { $state.go('app.competitor_volume'); }, 1500);
				} else if (res.data.ack == 2) {
					toaster.pop('error', 'Edit', res.data.error);
				} else if (res.data.ack == 0) {
					toaster.pop('success', 'Edit', res.data.error);
				}
			});
	}
}