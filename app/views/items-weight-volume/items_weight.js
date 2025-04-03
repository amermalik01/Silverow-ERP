ListItemsWeightcontroller.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];


myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		/* specific routes here (see file config.js) */
		$stateProvider
		.state('app.item-volume-weight', {
			url: '/item-volume-weight',
			title: 'Setup',
			templateUrl: helper.basepath('items-weight-volume/items_weight.html'),
			resolve: helper.resolveFor('ngTable', 'ngDialog')
		})

	}]);

myApp.controller('ListItemsWeightcontroller', ListItemsWeightcontroller);


function ListItemsWeightcontroller($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {

	$scope.module_table = 'unit_list';
	$scope.class = 'inline_block';
	$scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
	{ 'name': 'Inventory', 'url': 'app.setup', 'isActive': false, 'tabIndex': '6' },
	{ 'name': 'Item Volume & Weight ', 'url': '#', 'isActive': false }];
	$scope.readonly = true;
	$scope.itemRoles = [];
	$scope.getItemsWeightlist = function () {
		$scope.showLoader = true;
		var url = $scope.$root.stock + "item-weight/get-item-weight";
		$http.post(url, { token: $scope.$root.token,})
			.then(function (res) {
				if (res.data.ack == true) {
					$scope.itemRoles = res.data.items_weight;
					$scope.itemRoles.forEach(function (d, dIndex) {
						var abs_index = dIndex;						
						$scope.itemRoles[abs_index].weight_permission = ($scope.itemRoles[abs_index].weight_permission == '1') ? true : false;
						$scope.itemRoles[abs_index].volume_permission = ($scope.itemRoles[abs_index].volume_permission == '1') ? true : false;
					});
					$scope.showLoader = false;
				} else {
					$scope.showLoader = false;
					toaster.pop('error', 'Info', res.data.error);
					
				}
			})
			.catch(function (error) {
				// alert('Setup Widgets Error: \n' + error);
			});
			
	}

	$scope.getItemsWeightlist();

	$scope.showEditForm = function () {
		$scope.readonly = false;
	}

	$scope.saveItemWeight = function(){
		$scope.showLoader = true;
                var url = $scope.$root.stock + "item-weight/save-item-weight";
                $http.post(url, { token: $scope.$root.token, 'itemRoles': $scope.itemRoles })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            $scope.showLoader = false;
                            toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));                            
							$scope.readonly = true;
							$scope.getItemsWeightlist();
                        } else {
                            $scope.showLoader = false;
                            toaster.pop('error', 'Info', res.data.error);
                        }
                    })
	}

	$scope.CheckAll = function (roleID, cond) {

		angular.forEach($scope.itemRoles, function (obj) {
			if (roleID == 1) {
				if (cond == true)
				obj.weight_permission = true;
				else
					obj.weight_permission = false;
			}

			if (roleID == 2) {
				if (cond == true)
				obj.volume_permission = true;
				else
					obj.volume_permission = false;
			}
		});
	}


}


