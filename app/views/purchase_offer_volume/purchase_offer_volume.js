PurchaseOfferVolumeController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.purchase_offer_volume', {
        url: '/purchase_offer_volume',
        title: 'purchase_offer_volume',
        templateUrl: helper.basepath('purchase_offer_volume/purchase_offer_volume.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.add_purchase_offer_volume', {
        url: '/purchase_offer_volume/add',
        title: 'Add Purchase ',
        templateUrl: helper.basepath('add.html'),
		controller: 'PurchaseOfferVolumeAddController'
    })
	.state('app.view_purchase_offer_volume', {
		url: '/purchase_offer_volume/:id/view',
        title: 'View Purchase ',
        templateUrl: helper.basepath('view.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'PurchaseOfferVolumeViewController'
	  })
	  .state('app.edit_purchase_offer_volume', {
		url: '/purchase_offer_volume/:id/edit',
        title: 'Edit Purchase ',
        templateUrl: helper.basepath('edit.html'),
		controller: 'PurchaseOfferVolumeEditController'
	  })
  
 }]);

myApp.controller('PurchaseOfferVolumeController', PurchaseOfferVolumeController);
myApp.controller('PurchaseOfferVolumeAddController', PurchaseOfferVolumeAddController);
myApp.controller('PurchaseOfferVolumeViewController', PurchaseOfferVolumeViewController);
myApp.controller('PurchaseOfferVolumeEditController', PurchaseOfferVolumeEditController);

function PurchaseOfferVolumeController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster) {
    'use strict';

	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		
		 {'name':'Supplier','url':'#','isActive':false},
		 {'name':'purchase_offer_volume','url':'#','isActive':false}];
		 
 	 

  var vm = this;
	
	// For one time fetching data	
    //var Api = $resource('api/company/get_listing/:module_id/:module_table');

	// On Filter Dropdown change	 
   var Api =  $scope.$root.setup+"supplier/purchase_offer_volumes"; 
	
     var postData = {
	    'token': $scope.$root.token,
	    'all': "1"
  	};
    

    $scope.$watch("MyCustomeFilters", function () {
        if($scope.MyCustomeFilters && $scope.table.tableParams5){
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

        getData: function($defer, params) {
 			ngDataService.getDataCustom( $defer, params, Api,$filter,$scope,postData);
        }
    });
	
	
	
	
	
    $scope.delete = function (id,rec,arr_data) {
    	var delUrl =  $scope.$root.setup+"supplier/delete_purchase_offer_volume";
	    ngDialog.openConfirm({
	      template: 'modalDeleteDialogId',
	      className: 'ngdialog-theme-default-custom'
	    }).then(function (value) {
	      $http
			  .post(delUrl, {id:id,'token': $scope.$root.token})
			  .then(function (res) {
					if(res.data.ack == true){
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
						 var index = arr_data.indexOf(rec.id);
						 arr_data.splice(index,1);
					}
					else{
						toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
					}
			  });
	    }, function (reason) {
	      console.log('Modal promise rejected. Reason: ', reason);
		});
	
	};

}

function PurchaseOfferVolumeAddController($scope, $stateParams, $http, $state,toaster,$timeout){
	
	 $scope.formTitle = 'Price Offer Volume';
	 $scope.btnCancelUrl = 'app.purchase_offer_volume';
	 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		
		 {'name':'Supplier','url':'#','isActive':false},
		 {'name':'Purchase','url':'app.purchase_offer_volume','isActive':false},
		 {'name':'Add','url':'#','isActive':false}];

	$scope.formUrl = function() {
		return "app/views/purchase_offer_volume/_form.html";
	  }
	  
	$scope.rec = {};
	var postUrl =  $scope.$root.setup+"supplier/add_purchase_offer_volume";
	 $scope.add = function(rec){
	 rec.token = $scope.$root.token;
	 rec.type = $scope.rec.type_id != undefined ? $scope.rec.type_id.value:0;
	 $http
      .post(postUrl, rec)
      .then(function (res) {
        	if(res.data.ack == true){
				 toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
				 $timeout(function(){ $state.go('app.purchase_offer_volume'); }, 3000);
			}
			else
				toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(104));
      });
  	}
}

function PurchaseOfferVolumeViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster,$timeout){
	$scope.formTitle = 'Price Offer Volume';
	 $scope.btnCancelUrl = 'app.purchase_offer_volume';
	 $scope.hideDel = false; 
	 $scope.showLoader = true;
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Supplier','url':'#','isActive':false},
		 {'name':'Price Offer Volume','url':'app.purchase_offer_volume','isActive':false}];
		 
	
		
	$scope.gotoEdit = function(){
	  $state.go("app.edit_purchase_offer_volume",{id:$stateParams.id});
	};
	
		 
  	$scope.rec = {};
	var postUrl =  $scope.$root.setup+"supplier/get_purchase_offer_volume";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id };

 	$timeout(function(){
		$http
	      .post(postUrl, postData)
	      .then(function (res) {
	      	$scope.rec = res.data.response;
	      	$.each($scope.$root.arr_volume_type,function(index,obj){
				if(obj.value == res.data.response.type){
					$scope.rec.type_id = obj; 
				}
			});
	      });
		$scope.formUrl = function() {
			return "app/views/purchase_offer_volume/_form.html";
		  }	
		  $scope.showLoader = false;
	},3000); 
	
 	
	
};

function PurchaseOfferVolumeEditController($scope, $stateParams, $http, $state, $resource,toaster,$timeout){

	$scope.formTitle = 'Price Offer Volume';
	 $scope.btnCancelUrl = 'app.purchase_offer_volume';
	 $scope.hideDel = false; 
	 $scope.showLoader = true; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		
		 {'name':'Supplier','url':'#','isActive':false},
		 
		 {'name':'Price Offer Volume','url':'app.purchase_offer_volume','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];	
	
	

 	$scope.rec = {};
 	$scope.predefine_types = {};
	var postUrl =  $scope.$root.setup+"supplier/get_purchase_offer_volume";
	 var updateUrl =  $scope.$root.setup+"supplier/update_purchase_offer_volume";
	 
	var postData = {'token': $scope.$root.token,'id': $stateParams.id };


    $timeout(function(){
		$http
	      .post(postUrl, postData)
	      .then(function (res) {
	      	$scope.rec = res.data.response;
	      	$.each($scope.$root.arr_volume_type,function(index,obj){
				if(obj.value == res.data.response.type){
					$scope.rec.type_id = obj; 
				}
			});
	      });
	      $scope.formUrl = function() {
			return "app/views/purchase_offer_volume/_form.html";
		  }
		  $scope.showLoader = false;
	},3000);
	
	$scope.update = function(rec){
	 	 rec.token = $scope.$root.token;
	 	rec.type = $scope.rec.type_id != undefined ? $scope.rec.type_id.value:0;
		 $http
	      .post(updateUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
				toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 $timeout(function(){ $state.go('app.purchase_offer_volume'); }, 3000);
			}
			else{
							toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				$timeout(function(){ $state.go('app.purchase_offer_volume'); }, 3000);
			}
      });
  	}
	
}


