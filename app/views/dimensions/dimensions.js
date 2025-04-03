ListDimensionscontroller.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];


myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		/* specific routes here (see file config.js) */
		$stateProvider
			.state('app.dimensions', {
				url: '/dimensions',
				title: 'Setup',
				templateUrl: helper.basepath('dimensions/dimensions.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.addDimensions', {
				url: '/dimensions/add',
				title: 'Setup',
				templateUrl: helper.basepath('add.html'),
				controller: 'AddDimensionsController'
			})
			.state('app.viewDimensions', {
				url: '/dimensions/:id/view',
				title: 'Setup',
				templateUrl: helper.basepath('view.html'),
				resolve: angular.extend(helper.resolveFor('ngDialog'), {
					tpl: function () { return { path: helper.basepath('ngdialog-template.html') }; }
				}),
				controller: 'ViewDimensionsController'
			})
			.state('app.editdimensions', {
				url: '/dimensions/:id/edit',
				title: 'Setup',
				templateUrl: helper.basepath('edit.html'),
				controller: 'EditDimensionsController'
			})

	}]);

myApp.controller('ListDimensionscontroller', ListDimensionscontroller);
myApp.controller('AddDimensionsController', AddDimensionsController);
myApp.controller('ViewDimensionsController', ViewDimensionsController);
myApp.controller('EditDimensionsController', EditDimensionsController);



function ListDimensionscontroller($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {

	$scope.module_table = 'unit_list';
	$scope.class = 'inline_block';
	$scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
	{ 'name': 'Inventory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
	{ 'name': 'Dimensions', 'url': '#', 'isActive': false }];

	/* var vm = this;
	var Api = $scope.$root.stock + "dimention/get-dimention";
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

	$scope.getDimensionslist = function () {

		var Api = $scope.$root.stock + "dimention/get-dimention";

		$scope.postData = {};
		$scope.postData = {
			'token': $scope.$root.token,
			'all': "1"
		};

		$scope.showLoader = true;
		$http
			.post(Api, $scope.postData)
			.then(function (res) {
				$scope.tableData = res;
				$scope.columns = [];
				$scope.$data = [];
				$scope.record_data = {};
				$scope.showLoader = false;

				if (res.data.ack == true) {

					$scope.total = res.data.total;
					$scope.item_paging.total_pages = res.data.total_pages;
					$scope.item_paging.cpage = res.data.cpage;
					$scope.item_paging.ppage = res.data.ppage;
					$scope.item_paging.npage = res.data.npage;
					$scope.item_paging.pages = res.data.pages;

					$scope.total_paging_record = res.data.total_paging_record;

					$scope.record_data = res.data.response;
					$scope.$data = res.data.response;
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
			});
	}

	$scope.getDimensionslist();




	$scope.delete = function (id, index, arr_data_ret) {
		var delUrl = $scope.$root.stock + "dimention/delete-dimention-list";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { id: id, 'token': $scope.$root.token })
				.then(function (res) {

					if (res.data.ack == true) {
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
						arr_data_ret.splice(index, 1);
					}
					else {
						toaster.pop('error', 'Info', "Record cann't Deleted.");
					}
				});
		},
			function (reason) {
				console.log('Modal promise rejected. Reason: ', reason);
			});
	};



}

function AddDimensionsController($scope, $stateParams, $http, $state, toaster, $timeout) {

	$scope.btnCancelUrl = 'app.dimensions';
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Inventory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
		{ 'name': 'Dimensions', 'url': '#', 'isActive': false }];
	//  {'name':'Add','url':'#', 'isActive':false}

	$scope.formUrl = function () {
		return "app/views/dimensions/_form.html";
	}

	var postUrl = $scope.$root.stock + "dimention/add-dimention-list";
	$scope.rec = {};
	$scope.unit_list = {};
	$scope.unit_list = [{ 'name': 'Height', 'id': 1 }, { 'name': 'Width', 'id': 2 }, { 'name': 'Length', 'id': 3 }];

	$scope.arr_status = {};
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];
	$scope.rec.statuss = $scope.arr_status[0];

	$scope.add = function (rec) {
		rec.token = $scope.$root.token;
		rec.type = $scope.rec.unit_id !== undefined ? $scope.rec.unit_id.id : 0;
		rec.status = $scope.rec.statuss !== undefined ? $scope.rec.statuss.value : 0;
		$scope.showLoader = true;
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
					$timeout(function () { $state.go('app.dimensions'); }, 1000);
				}
				else
					toaster.pop('error', 'Info', res.data.error);
					$scope.showLoader = false;
			});
	}
}

function ViewDimensionsController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
	$scope.btnCancelUrl = 'app.dimensions';
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Inventory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
		{ 'name': 'Dimensions', 'url': 'app.dimensions', 'isActive': false }];

	$scope.formUrl = function () {
		return "app/views/dimensions/_form.html";
	}

	$scope.gotoEdit = function () {
		$state.go("app.editdimensions", { id: $stateParams.id });
	};

	$scope.rec = {};
	$scope.unit_list = {};
	$scope.unit_list = [{ 'name': 'Height', 'id': 1 }, { 'name': 'Width', 'id': 2 }, { 'name': 'Length', 'id': 3 }];


	$scope.arr_status = {};
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

	$scope.showLoader = true;
	var getURL = $scope.$root.stock + "dimention/get-dimention-list-by-id";
	var postData = {
		'token': $scope.$root.token,
		'id': $stateParams.id
	};

	//$timeout(function(){
	$http
		.post(getURL, postData)
		.then(function (res) {
			$scope.rec = res.data.response;

			$.each($scope.arr_status, function (index, obj) {
				if (obj.value == res.data.response.status) {
					$scope.rec.statuss = $scope.arr_status[index];

				}
			});

			$.each($scope.unit_list, function (index, obj) {
				if (obj.id == res.data.response.type) {
					$scope.rec.unit_id = $scope.unit_list[index];
				}
			});
			$scope.showLoader = false;

		});
	//	}, 3000);



}

function EditDimensionsController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {

	$scope.btnCancelUrl = 'app.dimensions';
	$scope.breadcrumbs =
		[{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
		{ 'name': 'Inventory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
		{ 'name': 'Dimensions', 'url': 'app.dimensions', 'isActive': false }];


	$scope.formUrl = function () {
		return "app/views/dimensions/_form.html";
	}

	$scope.rec = {};
	$scope.unit_list = {};
	$scope.unit_list = [{ 'name': 'Height', 'id': 1 }, { 'name': 'Width', 'id': 2 }, { 'name': 'Length', 'id': 3 }];


	$scope.arr_status = {};
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];


	var getURL = $scope.$root.stock + "dimention/get-dimention-list-by-id";
	var postData = {
		'token': $scope.$root.token,
		'id': $stateParams.id
	};

	//$timeout(function(){
	$http
		.post(getURL, postData)
		.then(function (res) {
			$scope.rec = res.data.response;
			$scope.rec.deletePerm = 1;

			$.each($scope.arr_status, function (index, obj) {
				if (obj.value == res.data.response.status) {
					$scope.rec.statuss = $scope.arr_status[index];

				}
			});

			$.each($scope.unit_list, function (index, obj) {
				if (obj.id == res.data.response.type) {
					$scope.rec.unit_id = $scope.unit_list[index];
				}
			});


		});
	//	}, 3000);



	var updateUrl = $scope.$root.stock + "dimention/update-dimention-list";
	$scope.update = function (rec) {
		rec.token = $scope.$root.token;
		rec.type = $scope.rec.unit_id !== undefined ? $scope.rec.unit_id.id : 0;
		rec.status = $scope.rec.statuss !== undefined ? $scope.rec.statuss.value : 0;
		$scope.showLoader = true;
		$http
			.post(updateUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					$timeout(function () { $state.go('app.dimensions'); }, 1500);
				}
				else toaster.pop('error', 'Info', res.data.error);

				$scope.showLoader = false;
			});
	}

	$scope.delete = function (id) {
		var delUrl = $scope.$root.stock + "dimention/delete-dimention-list";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { id: id, 'token': $scope.$root.token })
				.then(function (res) {

					if (res.data.ack == true) {
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
						// arr_data_ret.splice(index, 1);
						$timeout(function () { $state.go('app.dimensions'); }, 1500);
					}
					else {
						toaster.pop('error', 'Info', "Record cann't Deleted.");
					}
				});
		},
			function (reason) {
				console.log('Modal promise rejected. Reason: ', reason);
			});
	};



}

