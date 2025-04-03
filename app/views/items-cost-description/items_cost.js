ListItemsCostcontroller.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];


myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		/* specific routes here (see file config.js) */
		$stateProvider
			.state('app.item-cost-description', {
				url: '/item-cost-description',
				title: 'Setup',
				templateUrl: helper.basepath('items-cost-description/items_cost.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.add-item-cost-description', {
				url: '/item-cost-description/add',
				title: 'Setup',
				templateUrl: helper.basepath('items-cost-description/_form.html'),
				controller: 'itemsCostAddcontroller'
			})
			.state('app.view-item-cost-description', {
				url: '/item-cost-description/:id/view',
				title: 'Setup',
				templateUrl: helper.basepath('items-cost-description/_form.html'),
				controller: 'itemsCostAddcontroller'
			})
			.state('app.edit-item-cost-description', {
				url: '/item-cost-description/:id/edit',
				title: 'Setup',
				templateUrl: helper.basepath('items-cost-description/_form.html'),
				controller: 'itemsCostAddcontroller'
			})
	}]);

myApp.controller('ListItemsCostcontroller', ListItemsCostcontroller);
 myApp.controller('itemsCostAddcontroller', itemsCostAddcontroller);


function ListItemsCostcontroller($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {

	$scope.module_table = 'unit_list';
	$scope.class = 'inline_block';
	$scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
	{ 'name': 'Inventory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
	{ 'name': 'Item Cost Description ', 'url': '#', 'isActive': false }];
	$scope.readonly = true;
	$scope.itemCosts = [];
	$scope.getItemsCostlist = function () {
		$scope.showLoader = true;
		var url = $scope.$root.stock + "item-cost/get-cost-description";
		$http.post(url, { token: $scope.$root.token,})
			.then(function (res) {
				if (res.data.ack == true) {
					$scope.itemCosts = res.data;
					$scope.showLoader = false;
				} else {
					toaster.pop('warning', 'Info', "No data found!");

					$scope.showLoader = false;
					
				}
			})
			.catch(function (error) {
				// alert('Setup Widgets Error: \n' + error);
			});
			
	}

	//$scope.getItemsCostlist();

	$scope.showEditForm = function () {
		$scope.readonly = false;
	}
	var vm = this;
	var Api = $scope.$root.stock + "item-cost/get-cost-description";
	var postData = {
		'token': $scope.$root.token
	};
	$scope.$watch("MyCustomeFilters", function () {
		if ($scope.MyCustomeFilters && $scope.table.tableParams7) {
			$scope.table.tableParams7.reload();
		}
	}, true);

	$scope.MyCustomeFilters = {};

	vm.tableParams7 = new ngParams({
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
}

function itemsCostAddcontroller($scope, $stateParams, $http, $state, $resource, toaster, ngDialog, $timeout) {

	$scope.formTitle = 'Item Cost Description';
	$scope.btnCancelUrl = 'app.item-cost-description';
	// console.log($stateParams.id);

	$scope.check_readonly = true;

	$scope.status = {};
	$scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

	$scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
	{ 'name': 'Inventory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
	{ 'name': 'Item Cost Description', 'url': 'app.item-cost-description', 'isActive': false }];

	/* $scope.formUrl = function () {
		return "app/views/item_marginal_analysis/_form.html";
	}
 */
	$scope.rec = {};

	if ($stateParams.id != undefined) {
		// $scope.check_readonly = true;
		var postUrl =$scope.$root.stock + "item-cost/edit-cost-description";
		var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };
		$scope.showLoader = true;
		$http
			.post(postUrl, postData)
			.then(function (res) {
				if (res.data.ack == true) {
					$scope.rec = res.data.response;
					console.log($scope.rec);
					angular.forEach($scope.arr_status, function (obj) {
						console.log(obj.label);
						if (obj.value == res.data.response.status) {
							$scope.rec.status = obj;
						}
					});
				}
				else
					toaster.pop('warning', 'Info', "No Item Margin Analysis Exist!");

					$scope.showLoader = false;
			});
			
		$scope.hideDel = false;
		$scope.check_readonly = true;
	} else {

		$scope.rec.status = $scope.arr_status[0];
		$scope.check_readonly = false;
	}

	$scope.gotoEdit = function () {
		$scope.check_readonly = false;
	}

	$scope.delete = function () {

		var delUrl = $scope.$root.stock + "item-cost/delete-cost-description";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token, type: 'MarginAnal' })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						/* var index = arr_data.indexOf(rec.id);
						arr_data.splice(index, 1); */
						$timeout(function () {
							$state.go('app.item-cost-description');
						}, 1500);
					} else {
						toaster.pop('error', 'Deleted', res.data.error);
					}
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});
	}


	$scope.update = function (rec) {
		rec.token = $scope.$root.token;
		// console.log(rec);
		// console.log(rec.status.value);
		$scope.showLoader = true;
		rec.statusid = ($scope.rec.status !== undefined && $scope.rec.status != '') ? $scope.rec.status.value : 0;
		rec.type = 2;

		var postUrl = $scope.$root.stock + "item-cost/update-cost-description";
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

					$timeout(function () {
						$state.go('app.item-cost-description');
					}, 2000);
				}
				else
					toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));

					$scope.showLoader = false;
			});
	}

}


