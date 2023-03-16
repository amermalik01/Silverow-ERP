ShippMeasurmentController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.shipping-measurments', {
        url: '/shipping-measurments',
        title: 'Shipping Measurment',
        templateUrl: helper.basepath('shipping_measurment/shipping-measurment.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.add-shipping-measurment', {
        url: '/shipping-measurment/add',
        title: 'Add Shipping Measurment',
        templateUrl: helper.basepath('add.html'),
		controller: 'ShippMeasurmentAddController'
    })
	.state('app.view-shipping-measurment', {
		url: '/shipping-measurments/:id/view',
        title: 'View ',
        templateUrl: helper.basepath('view.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'ShippMeasurmentViewController'
	  })
	  .state('app.edit-shipping-measurment', {
		url: '/shipping-measurment/:id/edit',
        title: 'Edit Shipping Measurment',
        templateUrl: helper.basepath('edit.html'),
		controller: 'ShippMeasurmentEditController'
	  })
  
 }]);

myApp.controller('ShippMeasurmentController', ShippMeasurmentController);
myApp.controller('ShippMeasurmentAddController', ShippMeasurmentAddController);
myApp.controller('ShippMeasurmentViewController', ShippMeasurmentViewController);
myApp.controller('ShippMeasurmentEditController', ShippMeasurmentEditController);

function ShippMeasurmentController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster) {
    'use strict';

	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Supplier','url':'#','isActive':false},
		 {'name':'Shipping Measurments','url':'#','isActive':false}];
		 
 	var vm = this;
    var Api = $scope.$root.setup+"supplier/shipping-measurments";
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
 			ngDataService.getDataCustom( $defer, params, Api,$filter,$scope,postData);
			
			//$scope.checkData = ngDataService.getData( $defer, params, Api,$filter,$scope,postData);
        }
    });



    $scope.delete = function (id,arr_data) {
    	var delUrl = $scope.$root.setup+"supplier/delete-shipping-measurment";
	    ngDialog.openConfirm({
	      template: 'modalDeleteDialogId',
	      className: 'ngdialog-theme-default-custom'
	    }).then(function (value) {
	      $http
			  .post(delUrl, {id:id,'token': $scope.$root.token})
			  .then(function (res) {
					if(res.data.ack == true){
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						 var index = arr_data.indexOf(id);
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

function ShippMeasurmentAddController($scope, $stateParams, $http, $state,toaster,$timeout){

	 $scope.formTitle = 'Shipping Measurement';
	 $scope.btnCancelUrl = 'app.shipping-measurments';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Supplier','url':'#','isActive':false},
		 {'name':'Shipping Measurments','url':'app.shipping-measurments','isActive':false},
		 {'name':'Add','url':'#','isActive':false}];

	$scope.formUrl = function() {
		return "app/views/shipping_measurment/_form.html";
	  }
	  
	$scope.rec = {};
	var postUrl = $scope.$root.setup+"supplier/add-shipping-measurment";


	 $scope.add = function(rec){
	 rec.token = $scope.$root.token;
	 $http
      .post(postUrl, rec)
      .then(function (res) {
        	if(res.data.ack == true){
				 toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
				 $timeout(function(){ $state.go('app.shipping-measurments'); }, 3000);
			}
			else
				toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
      });
  	}
}

function ShippMeasurmentViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster,$timeout){
	 $scope.formTitle = 'Shipping Measurement';
	 $scope.btnCancelUrl = 'app.shipping-measurments';
	 $scope.hideDel = false;
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Supplier','url':'#','isActive':false},
		 {'name':'Shipping Measurments','url':'app.shipping-measurments','isActive':false}];
		 
	$scope.formUrl = function() {
		return "app/views/shipping_measurment/_form.html";
	  }
		
	$scope.gotoEdit = function(){
	  $state.go("app.edit-shipping-measurment",{id:$stateParams.id});
	};
	
		 
  	$scope.rec = {};
	var postUrl = $scope.$root.setup+"supplier/get-shipping-measurment";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id };

	$http
      .post(postUrl, postData)
      .then(function (res) {
      	$scope.rec = res.data.response;
      });
		 
	
 	
	
};

function ShippMeasurmentEditController($scope, $stateParams, $http, $state, $resource,toaster,$timeout){

	$scope.formTitle = 'Shipping Measurement';
	 $scope.btnCancelUrl = 'app.shipping-measurments';
	 $scope.hideDel = false; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Supplier','url':'#','isActive':false},
		 {'name':'Shipping Measurments','url':'app.shipping-measurments','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];	
	
	$scope.formUrl = function() {
		return "app/views/shipping_measurment/_form.html";
	  }

 	$scope.rec = {};
	var postUrl = $scope.$root.setup+"supplier/get-shipping-measurment";
	var updateUrl = $scope.$root.setup+"supplier/update-shipping-measurment";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id};

	$http
      .post(postUrl, postData)
      .then(function (res) {
      	$scope.rec = res.data.response;
      });

	
	$scope.update = function(rec){
	 	 rec.token = $scope.$root.token;
		 $http
	      .post(updateUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
				toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 $timeout(function(){ $state.go('app.shipping-measurments'); }, 3000);
			}
			else
				toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
      });
  	}
	
}


