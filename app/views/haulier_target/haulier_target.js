HaulierTargetController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		/* specific routes here (see file config.js) */
		$stateProvider
			.state('app.haulier-target', {
				url: '/haulier-target',
				title: 'Setup',
				templateUrl: helper.basepath('haulier_target/haulier_target.html'),
				resolve: helper.resolveFor('ngTable', 'ngDialog')
			})
			.state('app.add-haulier-target', {
				url: '/haulier-target/add',
				title: 'Setup',
				templateUrl: helper.basepath('add.html'),
				controller: 'HaulierTargetAddController'
			})
			.state('app.view-haulier-target', {
				url: '/haulier-target/:id/view',
				title: 'Setup',
				templateUrl: helper.basepath('view.html'),
				resolve: angular.extend(helper.resolveFor('ngDialog'), {
					tpl: function () { return { path: helper.basepath('ngdialog-template.html') }; }
				}),
				controller: 'HaulierTargetViewController'
			})
			.state('app.edit-haulier-target', {
				url: '/haulier-target/:id/edit',
				title: 'Setup',
				templateUrl: helper.basepath('edit.html'),
				resolve: angular.extend(helper.resolveFor('ngDialog'), {
					tpl: function () { return { path: helper.basepath('ngdialog-template.html') }; }
				}),
				controller: 'HaulierTargetEditController'
			})

	}]);

myApp.controller('HaulierTargetController', HaulierTargetController);
myApp.controller('HaulierTargetAddController', HaulierTargetAddController);
myApp.controller('HaulierTargetViewController', HaulierTargetViewController);
myApp.controller('HaulierTargetEditController', HaulierTargetEditController);

function HaulierTargetController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
	'use strict';

	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
			{ 'name': 'Haulier Target Price', 'url': '#', 'isActive': false }];

	var vm = this;
	var Api = $scope.$root.setup + "crm/haulier-targets";
	var postData = {
		'token': $scope.$root.token,
		'all': "1"
	};

	$scope.$watch("MyCustomeFilters", function () {
		if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
			$scope.table.tableParams5.reload();
		}
	}, true);

	$scope.MyCustomeFilters = {};

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
}

function HaulierTargetAddController($scope, $stateParams, $http, $state, toaster, $timeout) {

	$scope.formTitle = 'Haulier Target Price';
	$scope.btnCancelUrl = 'app.haulier-target';
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
			{ 'name': 'Haulier Target Price', 'url': 'app.haulier-target', 'isActive': false }];
	//  {'name':'Add','url':'#','isActive':false}];

	$scope.formUrl = function () {
		return "app/views/haulier_target/_form.html";
    }    
    /* $scope.haulierShippmentMethodsArray = [{ 'name': 'Dedicated', 'id': 1 },
        { 'name': 'Container', 'id': 2 },
        { 'name': 'Backload', 'id': 3 },
        { 'name': 'Pallet Distribution', 'id': 4 },
        { 'name': 'Groupage', 'id': 5 }
        ]; */
        /* angular.forEach($scope.haulierShippmentMethodsArray, function (obj) {
            if (obj.name == res.data.response.haulierShippingMethod_Name)
                $scope.rec.haulierShippingMethod_Name = obj;
        }); */
        $scope.status_list = [{
            'id': '1',
            'title': 'Active'
        }, {
            'id': '0',
            'title': 'Inactive'
        }];
        
    $scope.get_location_from = function () {
        $scope.rec = {};        
        $scope.rec.currency_id = $scope.$root.get_obj_frm_arry($scope.$root.arr_currency, $scope.$root.defaultCurrency);
        $scope.rec.currency = ($scope.rec.currency_id && $scope.rec.currency_id.id) ? $scope.rec.currency_id.id : 0;
        var prodApi = $scope.$root.pr + "srm/srm/get-warehouses-for-target-price";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
        };

        return $http
            .post(prodApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.$root.location_from = res.data.response;

                    angular.forEach($scope.status_list, function (obj) {
                        if (obj.id == 1)
                            $scope.rec.status = obj;
                    });
                    return 1;
                }
                else
                    return 0;
            });

    }
    $scope.get_location_from();

     // area covered popup start
     $scope.searchKeyword_areaCovered = {}; 
     $scope.getAreaCovered = function (item_paging) {
         if (item_paging){
             $scope.searchKeyword_areaCovered = {};
         }
         $scope.postData = {};
         $scope.postData.token = $scope.$root.token;
         $scope.postData.account_type = 1;
         $scope.title = 'Area Covered';
         $scope.postData.searchKeyword = $scope.searchKeyword_areaCovered;

             if ($scope.postData.pagination_limits == -1) {
                 $scope.postData.page = -1;
                 $scope.searchKeyword_areaCovered = {};
                 $scope.record_data = {};
             }
            // angular.element('#area_covered_modal').modal('hide');
             var customerListingApi = $scope.$root.setup + "crm/get-area-covered";

             $scope.showLoader = true;
             
             $http
             .post(customerListingApi, $scope.postData)
             .then(function (res) {
                 $scope.areaCoveredTableData = res;
                 console.log($scope.areaCoveredTableData);
                 if (res.data.ack == true) {            
             
                     angular.element('#area_covered_modal').modal({ show: true });

                     $scope.showLoader = false;
                 }
                 else
                 {
                     $scope.showLoader = false;
                 }
             });
     }

     $scope.confirmArea = function (result) {
         console.log(result);
         $scope.rec.area_covered = result.area_code+'-'+result.area_covered;
         $scope.rec.to_location_id = result.id;
         angular.element('#area_covered_modal').modal('hide');
         
     }
      // area covered popup end

    // shipment methods start
    $scope.get_shipment_methods = function () {
        var prodApi = $scope.$root.setup + "crm/shipment-methods";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
        };

        return $http
            .post(prodApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.haulierShippmentMethodsArray = res.data.response;
                    return 1;
                }
                else
                    return 0;
            });

    }
    $scope.get_shipment_methods();
    // shipment methods end

	$scope.add = function (rec) {

        if (!rec.from_location_id || rec.from_location_id.length == 0) {
            toaster.pop('error', 'Info', "Location From is required.");
            return;
        }

        if (!rec.area_covered || rec.area_covered.length == 0) {
            toaster.pop('error', 'Info', "Area covered is required.");
            return;
        }

        if (!rec.price || rec.price=='') {
            toaster.pop('error', 'Info', "Price is required.");
            return;
        }else if(!angular.isNumber(parseInt(rec.price))){
            toaster.pop('error', 'Info', "Price is invalid.");
            return;
        }
        rec.token = $scope.$root.token;
        var postUrl = $scope.$root.setup + "crm/add-haulier-target";
		$http
			.post(postUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
					$timeout(function () { $state.go('app.haulier-target'); }, 1000);
				} else
					toaster.pop('error', 'Info', res.data.error);
			});
	}
}

function HaulierTargetViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
	$scope.formTitle = 'Haulier Target Price';
	$scope.btnCancelUrl = 'app.haulier-target';
	$scope.hideDel = false;
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
			{ 'name': 'Haulier Target Price', 'url': 'app.haulier-target', 'isActive': false }];
	//  {'name':'Detail','url':'#','isActive':false}];
    $scope.haulierFormReadonly=true;
	$scope.formUrl = function () {
		return "app/views/haulier_target/_form.html";
    }

    /* $scope.haulierShippmentMethodsArray = [{ 'name': 'Dedicated', 'id': 1 },
        { 'name': 'Container', 'id': 2 },
        { 'name': 'Backload', 'id': 3 },
        { 'name': 'Pallet Distribution', 'id': 4 },
        { 'name': 'Groupage', 'id': 5 }
        ]; */

        $scope.status_list = [{
            'id': '1',
            'title': 'Active'
        }, {
            'id': '0',
            'title': 'Inactive'
        }];
 
	$scope.gotoEdit = function () {
		$state.go("app.edit-haulier-target", { id: $stateParams.id });
    };
    
    // area covered popup start
    $scope.searchKeyword_areaCovered = {}; 
    $scope.getAreaCovered = function (item_paging) {
        if (item_paging){
            $scope.searchKeyword_areaCovered = {};
        }
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.postData.account_type = 1;
        $scope.title = 'Area Covered';
        $scope.postData.searchKeyword = $scope.searchKeyword_areaCovered;

            if ($scope.postData.pagination_limits == -1) {
                $scope.postData.page = -1;
                $scope.searchKeyword_areaCovered = {};
                $scope.record_data = {};
            }
           // angular.element('#area_covered_modal').modal('hide');
            var customerListingApi = $scope.$root.setup + "crm/get-area-covered";

            $scope.showLoader = true;
            
            $http
            .post(customerListingApi, $scope.postData)
            .then(function (res) {
                $scope.areaCoveredTableData = res;
                console.log($scope.areaCoveredTableData);
                if (res.data.ack == true) {            
            
                    angular.element('#area_covered_modal').modal({ show: true });

                    $scope.showLoader = false;
                }
                else
                {
                    $scope.showLoader = false;
                }
            });
    }

    $scope.confirmArea = function (result) {
        console.log(result);
        $scope.rec.area_covered = result.area_code+'-'+result.area_covered;
        $scope.rec.to_location_id = result.id;
        angular.element('#area_covered_modal').modal('hide');
        
    }
     // area covered popup end

	$scope.rec = {};
    var postUrl = $scope.$root.setup + "crm/get-haulier-target";
	var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

	$http
		.post(postUrl, postData)
		.then(function (res) {
            $scope.rec = res.data.response;

            $scope.haulierShippmentMethodsArray =  res.data.response.shipment_methods;;
            angular.forEach($scope.haulierShippmentMethodsArray, function (obj) {
                if (obj.name == res.data.response.shipping_method_name)
                    $scope.rec.haulierShippingMethod_Name = obj;
            });
            
			angular.forEach($scope.$root.arr_currency, function (obj) {
				if (obj.id == res.data.response.currency_id)
				$scope.rec.currency_id = obj;
            });
            
            $scope.location_from =  res.data.response.location_from;;
            angular.forEach($scope.location_from, function (obj) {
                if (obj.id == res.data.response.from_location_id)
                $scope.rec.from_location_id = obj;
            });

            $scope.rec.area_covered_arr = res.data.response.areaCovered;
            $scope.rec.area_covered = res.data.response.areaCovered.area_code+'-'+res.data.response.areaCovered.area_covered;

            angular.forEach($scope.status_list, function (obj) {
                if (obj.id == res.data.response.STATUS)
                    $scope.rec.status = obj;
            });


        });




}

function HaulierTargetEditController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {

	$scope.formTitle = 'Haulier Target Price';
	$scope.btnCancelUrl = 'app.haulier-target';
	$scope.hideDel = false;
	$scope.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
			{ 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
			{ 'name': 'Haulier Target Price', 'url': 'app.haulier-target', 'isActive': false }];
	//  {'name':'Edit','url':'#','isActive':false}];	
    $scope.haulierFormReadonly=false;
	$scope.formUrl = function () {
		return "app/views/haulier_target/_form.html";
    }
    
    /* $scope.haulierShippmentMethodsArray = [{ 'name': 'Dedicated', 'id': 1 },
        { 'name': 'Container', 'id': 2 },
        { 'name': 'Backload', 'id': 3 },
        { 'name': 'Pallet Distribution', 'id': 4 },
        { 'name': 'Groupage', 'id': 5 }
        ]; */

        $scope.status_list = [{
            'id': '1',
            'title': 'Active'
        }, {
            'id': '0',
            'title': 'Inactive'
        }];

	     // area covered popup start
         $scope.searchKeyword_areaCovered = {}; 
         $scope.getAreaCovered = function (item_paging) {
             if (item_paging){
                 $scope.searchKeyword_areaCovered = {};
             }
             $scope.postData = {};
             $scope.postData.token = $scope.$root.token;
             $scope.postData.account_type = 1;
             $scope.title = 'Area Covered';
             $scope.postData.searchKeyword = $scope.searchKeyword_areaCovered;
    
                 if ($scope.postData.pagination_limits == -1) {
                     $scope.postData.page = -1;
                     $scope.searchKeyword_areaCovered = {};
                     $scope.record_data = {};
                 }
                 //angular.element('#area_covered_modal').modal('hide');
                 var customerListingApi = $scope.$root.setup + "crm/get-area-covered";
    
                 $scope.showLoader = true;
                 
                 $http
                 .post(customerListingApi, $scope.postData)
                 .then(function (res) {
                     $scope.areaCoveredTableData = res;
                     console.log($scope.areaCoveredTableData);
                     if (res.data.ack == true) {            
                 
                         angular.element('#area_covered_modal').modal({ show: true });
    
                         $scope.showLoader = false;
                     }
                     else
                     {
                         $scope.showLoader = false;
                     }
                 });
         }
    
         $scope.confirmArea = function (result) {
             console.log(result);
             $scope.rec.area_covered = result.area_code+'-'+result.area_covered;
             $scope.rec.to_location_id = result.id;
             angular.element('#area_covered_modal').modal('hide');
             
         }
          // area covered popup end

	$scope.rec = {};
	var postUrl = $scope.$root.setup + "crm/get-haulier-target";
	var updateUrl = $scope.$root.setup + "crm/update-haulier-target";
	var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

	$http
		.post(postUrl, postData)
		.then(function (res) {
            $scope.rec = res.data.response;
            
            $scope.haulierShippmentMethodsArray =  res.data.response.shipment_methods;;
            angular.forEach($scope.haulierShippmentMethodsArray, function (obj) {
                if (obj.name == res.data.response.shipping_method_name)
                    $scope.rec.haulierShippingMethod_Name = obj;
            });
            
            angular.forEach($scope.$root.arr_currency, function (obj) {
				if (obj.id == res.data.response.currency_id)
				$scope.rec.currency_id = obj;
            });
            
			$scope.location_from =  res.data.response.location_from;;
            angular.forEach($scope.location_from, function (obj) {
                if (obj.id == res.data.response.from_location_id)
                $scope.rec.from_location_id = obj;
            });

            $scope.rec.area_covered_arr = res.data.response.areaCovered;
            $scope.rec.area_covered = res.data.response.areaCovered.area_code+'-'+res.data.response.areaCovered.area_covered;

            angular.forEach($scope.status_list, function (obj) {
                if (obj.id == res.data.response.STATUS)
                    $scope.rec.status = obj;
            });
			$scope.rec.deletePerm = 1;
		});

	$scope.delete = function (id, index, $data) {
		var delUrl = $scope.$root.setup + "crm/delete-haulier-target";
		ngDialog.openConfirm({
			template: 'modalDeleteDialogId',
			className: 'ngdialog-theme-default-custom'
		}).then(function (value) {
			$http
				.post(delUrl, { id: $stateParams.id, 'token': $scope.$root.token })
				.then(function (res) {
					if (res.data.ack == true) {
						toaster.pop('success', 'Deleted', res.data.success);
						$timeout(function () {
							$state.go('app.haulier-target');
						}, 1500);
					} else {
						toaster.pop('error', 'Deleted', res.data.error);
					}
				});
		}, function (reason) {
			console.log('Modal promise rejected. Reason: ', reason);
		});

	};


	$scope.update = function (rec) {

        if (!rec.from_location_id || rec.from_location_id.length == 0) {
            toaster.pop('error', 'Info', "Location From is required.");
            return;
        }

        if (!rec.area_covered || rec.area_covered.length == 0) {
            toaster.pop('error', 'Info', "Area covered is required.");
            return;
        }

        if (!rec.price || rec.price=='') {
            toaster.pop('error', 'Info', "Price is required.");
            return;
        }else if(!angular.isNumber(parseInt(rec.price))){
            toaster.pop('error', 'Info', "Price is invalid.");
            return;
        }

		rec.token = $scope.$root.token;
		$http
			.post(updateUrl, rec)
			.then(function (res) {
				if (res.data.ack == true) {
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					$timeout(function () { $state.go('app.haulier-target'); }, 1000);
				} else if (res.data.ack == 2) {
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					$timeout(function () { $state.go('app.haulier-target'); }, 1000);
				}
				else
					toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
			});
	}

}