ShippingListingController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http",
"ngDialog","toaster","$state"];

myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.purchase_shipping_agents', {
        url: '/purchase_shipping_agents',
        title: 'Purchase Shipping Agents',
        templateUrl: helper.basepath('purchase_shipping_agents/purchase_shipping_agents.html'),
        resolve: helper.resolveFor('ngTable','ngDialog'),
		controller: 'ShippingListingController'
    })
	.state('app.addshipping', {
        url: '/purchase_shipping_agents/add',
        title: 'Add Shipping agents',
        templateUrl: helper.basepath('add.html'),
		controller: 'ShppingAddController'
    })
	.state('app.viewshipping', {
		url: '/purchase_shipping_agents/:id/view',
        title: 'View Purchase Shipping Agents',
        templateUrl: helper.basepath('view.html'),
		/*resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),*/
		controller: 'ShippingViewController'
	  })
	  .state('app.editshipping', {
		url: '/purchase_shipping_agents/:id/edit',
        title: 'Edit Purchase Shipping Agents',
        templateUrl: helper.basepath('edit.html'),
		controller: 'ShippingEditController'
	  })
  
 }]);

myApp.controller('ShippingListingController', ShippingListingController);
myApp.controller('ShppingAddController', ShppingAddController);
myApp.controller('ShippingViewController', ShippingViewController);
myApp.controller('ShippingEditController', ShippingEditController);


function ShippingListingController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster,$state) {
	
    'use strict';
 
	//console.log("here in product tabs ======= >");
    // required for inner references
	
	$scope.module_table ='shipping_agent';
	$scope.class = 'inline_block';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Purchase','url':'#','isActive':false},
		 {'name':'Purchase Shipping Agents','url':'#','isActive':false}];
		 
    var vm = this;
	
 
	var Api = $scope.$root.pr+"shipping-agents";
	
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
	$scope.showLoader = false;  
			
   
   
    $scope.$data = {};
    $scope.delete = function (id,index,$data) {
		
    var delUrl = $scope.$root.pr+"shipping-agents/delete-shipping-agent";
      ngDialog.openConfirm({
      template: 'modalDeleteDialogId',
      className: 'ngdialog-theme-default-custom'
    }).then(function (value) {
      $http
		  .post(delUrl, {'token':$scope.$root.token,id:id})
		  .then(function (res) {
				if(res.data.ack == true){
					toaster.pop('success', 'Deleted', 'Record Deleted ');
					 $data.splice(index,1);
				}
				else{ 	toaster.pop('error', 'Info', "Record can't be Deleted."); }
		  });
    }, function (reason) {
      console.log('Modal promise rejected. Reason: ', reason);
    });
 
	};
	
}

function ShppingAddController($scope, $stateParams, $http, $state,toaster,$timeout){

	$scope.btnCancelUrl = 'app.purchase_shipping_agents'; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		
		 {'name':'Purchase','url':'app.purchase_shipping_agents','isActive':false},
		 {'name':'Purchase Shipping Agents','url':'app.purchase_shipping_agents','isActive':false},
		 {'name':'Add','url':'#', 'isActive':false}];

	$scope.formUrl = function() {
		return "app/views/purchase_shipping_agents/_form.html";
	  }
	
	$scope.rec = {};$scope.cover_list = {};$scope.status = {};
	
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	$scope.cover_list =	[{label:'Area',id:1},{label:'Test',id:0}];
	
	var postUrl = $scope.$root.pr+"shipping-agents/add-shipping-agent";
	$scope.add = function(rec){
		  rec.token = $scope.$root.token;
	 	 rec.status = $scope.rec.statuss != undefined ? $scope.rec.statuss.value:0;
		  rec.coverage_area = $scope.rec.coverage_areass != undefined ? $scope.rec.coverage_areas.id:0;
		
		 $http
	      .post(postUrl, rec)
	      .then(function (res) {
			  if(res.data.ack == true){
					 toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
					 $timeout(function(){ $state.go('app.purchase_shipping_agents'); }, 3000);
				}
				else
					toaster.pop('error', 'Info', res.data.error);
	      });
  }
  
}

function ShippingViewController($scope, $stateParams, $http, $state, $resource,toaster,$timeout){
	$scope.btnCancelUrl = 'app.purchase_shipping_agents';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Purchase','url':'app.purchase_shipping_agents','isActive':false},
		 {'name':'Purchase Shipping Agents','url':'app.purchase_shipping_agents','isActive':false},
		 {'name':'View','url':'#', 'isActive':false}];
		 
	
	$scope.formUrl = function() {
		return "app/views/purchase_shipping_agents/_form.html";
	  }
	  		
	$scope.gotoEdit = function(){
	  $state.go("app.editshipping",{id:$stateParams.id});
	};
	
		 
  	$scope.rec = {};$scope.cover_list = {};$scope.status = {};
	
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	$scope.cover_list =	[{label:'Area',id:1},{label:'Test',id:0}];
	
	var postUrl = $scope.$root.pr+"shipping-agents/get-shipping-agents";
	var postData = {
	    'token': $scope.$root.token,
	    'id': $stateParams.id
  	};

	$http
      .post(postUrl, postData)
      .then(function (res) { 
      		$scope.rec = res.data.response;
			$.each($scope.arr_status,function(index,obj){
			if(obj.value == res.data.response.status){
				$scope.rec.statuss = $scope.arr_status[index]; 
			}
		});
			$.each($scope.cover_list,function(index,obj){
			if(obj.id == res.data.response.coverage_area){
				$scope.rec.coverage_areas = $scope.cover_list[index]; 
			}
		});
		
      });
}

function ShippingEditController($scope, $stateParams, $http, $state, $resource,toaster,$timeout){

	$scope.btnCancelUrl = 'app.purchase_shipping_agents';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Purchase','url':'app.purchase_shipping_agents','isActive':false},
		 {'name':'Purchase Shipping Agents','url':'app.purchase_shipping_agents','isActive':false},
		 {'name':'Edit','url':'#', 'isActive':false}];	
	
 	 
	
	$scope.formUrl = function() {
		return "app/views/purchase_shipping_agents/_form.html";
	  }
	
	$scope.rec = {};$scope.cover_list = {};$scope.status = {};
	
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	$scope.cover_list =	[{label:'Area',id:1},{label:'Test',id:0}];
	
	var postUrl = $scope.$root.pr+"shipping-agents/get-shipping-agents";
	var postData = {
	    'token': $scope.$root.token,
	    'id': $stateParams.id
  	};
	$http
      .post(postUrl, postData)
      .then(function (res) { 
      		$scope.rec = res.data.response;
			$.each($scope.arr_status,function(index,obj){
			if(obj.value == res.data.response.status){
				$scope.rec.statuss = $scope.arr_status[index]; 
			}
		});
			$.each($scope.cover_list,function(index,obj){
			if(obj.id == res.data.response.coverage_area){
				$scope.rec.coverage_areas = $scope.cover_list[index]; 
			}
		});
		
      });
	  
	  
	var postUrl = $scope.$root.pr+"shipping-agents/update-shipping-agent";
	 $scope.update = function(rec){
	 	 rec.token = $scope.$root.token;
	 	 rec.status = $scope.rec.statuss != undefined ? $scope.rec.statuss.value:0;
		  rec.coverage_area = $scope.rec.coverage_areass != undefined ? $scope.rec.coverage_areas.id:0;
		 $http
	      .post(postUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
					 toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					 $timeout(function(){ $state.go('app.purchase_shipping_agents'); }, 3000);
				}
				else
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 $timeout(function(){ $state.go('app.purchase_shipping_agents'); }, 3000);
	      });
  } 
}

