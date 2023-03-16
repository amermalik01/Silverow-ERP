ServicePriceOfferVolumeController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.service_price_offer_volume', {
        url: '/service_price_offer_volume',
        title: ' price offer volume',
        templateUrl: helper.basepath('service_price_offer_volume/service_price_offer_volume.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.add_service_price_offer_volume', {
        url: '/service_service_price_offer_volume/add',
        title: 'Add Predefine ',
        templateUrl: helper.basepath('add.html'),
		controller: 'ServicePriceOfferVolumeAddController'
    })
	.state('app.view_service_price_offer_volume', {
		url: '/service_service_price_offer_volume/:id/view',
        title: 'View Predefine ',
        templateUrl: helper.basepath('view.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'ServicePriceOfferVolumeViewController'
	  })
	  .state('app.edit_service_price_offer_volume', {
		url: '/service_service_price_offer_volume/:id/edit',
        title: 'Edit Predefine ',
        templateUrl: helper.basepath('edit.html'),
		controller: 'ServicePriceOfferVolumeEditController'
	  })
  
 }]);

myApp.controller('ServicePriceOfferVolumeController', ServicePriceOfferVolumeController);
myApp.controller('ServicePriceOfferVolumeAddController', ServicePriceOfferVolumeAddController);
myApp.controller('ServicePriceOfferVolumeViewController', ServicePriceOfferVolumeViewController);
myApp.controller('ServicePriceOfferVolumeEditController', ServicePriceOfferVolumeEditController);

function ServicePriceOfferVolumeController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster) {
    'use strict';

	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		
		 {'name':'Services','url':'#','isActive':false},
		 {'name':' price offer volume','url':'#','isActive':false}];
	


  var vm = this;
	
	 
   var Api = $scope.$root.setup+"service/products-listing/price-offer-volumes";
	
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
    	var delUrl = $scope.$root.setup+"service/products-listing/delete-service-price-offer-volumes";
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

function ServicePriceOfferVolumeAddController($scope, $stateParams, $http, $state,toaster){
	
	 $scope.formTitle = 'Price Offer Volume';
	 $scope.btnCancelUrl = 'app.service_price_offer_volume';
	 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		
		 {'name':'Services','url':'app.service_price_offer_volume','isActive':false},
		 {'name':'Add','url':'#','isActive':false}];

	$scope.formUrl = function() {
		return "app/views/service_price_offer_volume/_form.html";
	  }
	  
	$scope.rec = {};
	var postUrl = $scope.$root.setup+"service/products-listing/add-service-price-offer-volumes";
	 $scope.add = function(rec){
	 rec.token = $scope.$root.token;
	 rec.type = $scope.rec.type_id != undefined ? $scope.rec.type_id.value:0;
	 $http
      .post(postUrl, rec)
      .then(function (res) {
        	if(res.data.ack == true){
						toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
				 $timeout(function(){ $state.go('app.service_price_offer_volume'); }, 3000);
			}
			else
				toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(105));
      });
  	}
}

function ServicePriceOfferVolumeViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster){
	$scope.formTitle = 'Price Offer Volume';
	 $scope.btnCancelUrl = 'app.service_price_offer_volume';
	 $scope.hideDel = false; 
	 $scope.showLoader = true;
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		
		 {'name':'Services','url':'#','isActive':false},
		 {'name':'Price Offer Volue','url':'app.service_price_offer_volume','isActive':false}];
		 
	
		
	$scope.gotoEdit = function(){
	  $state.go("app.edit_service_price_offer_volume",{id:$stateParams.id});
	};
	
		 
  	$scope.rec = {};
	var postUrl = $scope.$root.setup+"service/products-listing/get-service-price-offer-volumes";
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
			return "app/views/service_price_offer_volume/_form.html";
		  }	
		  $scope.showLoader = false;
	},3000); 
	
 	
	
};

function ServicePriceOfferVolumeEditController($scope, $stateParams, $http, $state, $resource,toaster){

	$scope.formTitle = 'Price Offer Volume';
	 $scope.btnCancelUrl = 'app.service_price_offer_volume';
	 $scope.hideDel = false; 
	 $scope.showLoader = true; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		
		 {'name':'Services','url':'#','isActive':false},
		 {'name':'Price Offer Volue','url':'app.service_price_offer_volume','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];	
	
	

 	$scope.rec = {};
 	$scope.predefine_types = {};
	var postUrl = $scope.$root.setup+"service/products-listing/get-service-price-offer-volumes";
	var updateUrl = $scope.$root.setup+"service/products-listing/update-service-price-offer-volumes";
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
			return "app/views/service_price_offer_volume/_form.html";
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
				 $timeout(function(){ $state.go('app.service_price_offer_volume'); }, 3000);
			}
			else{
							toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				$timeout(function(){ $state.go('app.service_price_offer_volume'); }, 3000);
			}
      });
  	}
	
}


