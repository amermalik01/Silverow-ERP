PriceOfferVolumeController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.price-offer-volume', {
        url: '/price-offer-volume',
        title: 'price-offer-volume',
        templateUrl: helper.basepath('price_offer_volume/price_offer_volume.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.add-price-offer-volume', {
        url: '/price-offer-volume/add',
        title: 'Add Predefine ',
        templateUrl: helper.basepath('add.html'),
		controller: 'PriceOfferVolumeAddController'
    })
	.state('app.view-price-offer-volume', {
		url: '/price-offer-volume/:id/view',
        title: 'View Predefine ',
        templateUrl: helper.basepath('view.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'PriceOfferVolumeViewController'
	  })
	  .state('app.edit-price-offer-volume', {
		url: '/price-offer-volume/:id/edit',
        title: 'Edit Predefine ',
        templateUrl: helper.basepath('edit.html'),
		controller: 'PriceOfferVolumeEditController'
	  })
  
 }]);

myApp.controller('PriceOfferVolumeController', PriceOfferVolumeController);
myApp.controller('PriceOfferVolumeAddController', PriceOfferVolumeAddController);
myApp.controller('PriceOfferVolumeViewController', PriceOfferVolumeViewController);
myApp.controller('PriceOfferVolumeEditController', PriceOfferVolumeEditController);

function PriceOfferVolumeController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster) {
    'use strict';

	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'price-offer-volume','url':'#','isActive':false}];
		 
 	/*var vm = this;
    var Api = $scope.$root.sales+"crm/crm/price-offer-volumes";
    var postData = {
	    'token': $scope.$root.token,
	    'all': "1"
  	};

    $scope.$watch("MyCustomeFilters", function () {
        if($scope.MyCustomeFilters && $scope.table.tableParams5){
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

        getData: function($defer, params) {
 			 $scope.checkData = ngDataService.getData( $defer, params, Api,$filter,$scope,postData); 
        }
    });*/



  var vm = this;
	
	// For one time fetching data	
    //var Api = $resource('api/company/get_listing/:module_id/:module_table');

	// On Filter Dropdown change	 
   var Api = $scope.$root.sales+"crm/crm/price-offer-volumes";
	
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
    	var delUrl = $scope.$root.sales+"crm/crm/delete-price-offer-volume";
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

function PriceOfferVolumeAddController($scope, $stateParams, $http, $state,toaster,$timeout){
	
	 $scope.formTitle = 'Price Offer Volume';
	 $scope.btnCancelUrl = 'app.price-offer-volume';
	 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Sales','url':'app.price-offer-volume','isActive':false},
		 {'name':'Add','url':'#','isActive':false}];

	$scope.formUrl = function() {
		return "app/views/price_offer_volume/_form.html";
	  }
	  
	$scope.rec = {};
	var postUrl = $scope.$root.sales+"crm/crm/add-price-offer-volume";
	 $scope.add = function(rec){
	 rec.token = $scope.$root.token;
	 rec.type = $scope.rec.type_id != undefined ? $scope.rec.type_id.value:0;
	 $http
      .post(postUrl, rec)
      .then(function (res) {
        	if(res.data.ack == true){
				 toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
				 $timeout(function(){ $state.go('app.price-offer-volume'); }, 3000);
			}
			else
				toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(104));
      });
  	}
}

function PriceOfferVolumeViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster,$timeout){
	$scope.formTitle = 'Price Offer Volume';
	 $scope.btnCancelUrl = 'app.price-offer-volume';
	 $scope.hideDel = false; 
	 $scope.showLoader = true;
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Price Offer Volue','url':'app.price-offer-volume','isActive':false}];
		 
	
		
	$scope.gotoEdit = function(){
	  $state.go("app.edit-price-offer-volume",{id:$stateParams.id});
	};
	
		 
  	$scope.rec = {};
	var postUrl = $scope.$root.sales+"crm/crm/get-price-offer-volume";
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
			return "app/views/price_offer_volume/_form.html";
		  }	
		  $scope.showLoader = false;
	},3000); 
	
 	
	
};

function PriceOfferVolumeEditController($scope, $stateParams, $http, $state, $resource,toaster,$timeout){

	$scope.formTitle = 'Price Offer Volume';
	 $scope.btnCancelUrl = 'app.price-offer-volume';
	 $scope.hideDel = false; 
	 $scope.showLoader = true; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Price Offer Volue','url':'app.price-offer-volume','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];	
	
	

 	$scope.rec = {};
 	$scope.predefine_types = {};
	var postUrl = $scope.$root.sales+"crm/crm/get-price-offer-volume";
	var updateUrl = $scope.$root.sales+"crm/crm/update-price-offer-volume";
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
			return "app/views/price_offer_volume/_form.html";
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
				 $timeout(function(){ $state.go('app.price-offer-volume'); }, 3000);
			}
			else{
							toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				$timeout(function(){ $state.go('app.price-offer-volume'); }, 3000);
			}
      });
  	}
	
}


