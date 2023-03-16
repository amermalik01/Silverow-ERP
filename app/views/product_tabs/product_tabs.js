ProductTabsController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http",
"ngDialog","toaster","$state"];

myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.item_tabs', {
        url: '/item_tabs',
        title: 'Item Tabs',
        templateUrl: helper.basepath('product_tabs/product_tabs.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.addProductTab', {
        url: '/item_tabs/add',
        title: 'Add Product Tab',
        templateUrl: helper.basepath('add.html'),
		controller: 'ProductTabAddController'
    })
	.state('app.viewProductTabs', {
		url: '/item_tabs/:id/view',
        title: 'View Item Tabs',
        templateUrl: helper.basepath('view.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'ProductTabsViewController'
	  })
	  .state('app.editProductTab', {
		url: '/item_tabs/:id/edit',
        title: 'Edit Item Tabs',
        templateUrl: helper.basepath('edit.html'),
		controller: 'ProductTabEditController'
	  })
  
 }]);

myApp.controller('ProductTabsController', ProductTabsController);
myApp.controller('ProductTabAddController', ProductTabAddController);
myApp.controller('ProductTabsViewController', ProductTabsViewController);
myApp.controller('ProductTabEditController', ProductTabEditController);


function ProductTabsController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster,$state) {
	
    'use strict';
 
	//console.log("here in product tabs ======= >");
    // required for inner references
	
	$scope.module_table = 'products_tabs';
	$scope.class = 'inline_block';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Stock','url':'#','isActive':false},
		 {'name':'Item Tabs','url':'#','isActive':false}];
		 
    var vm = this;
	
	// For one time fetching data	
    //var Api = $resource('api/company/get_listing/:module_id/:module_table');

	// On Filter Dropdown change	
    
	var Api = $scope.$root.stock+"product-tabs";
	
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
    var delUrl = $scope.$root.stock+"product-tabs/delete-tab";
    $scope.deleteProdTab = function (id,index,$data) {
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
	
	
	$scope.$data = {};
    var sortUrl = $scope.$root.stock+"product-tabs/sort-tab";
    $scope.sortUpProdTab = function (id,sort_id, index, $data) {
     
      $http
		  .post(sortUrl, {'token':$scope.$root.token,id:id, 'sort_id':sort_id, 'sort_type': 'asc'})
		  .then(function (res) {
				if(res.data.ack == true){
					toaster.pop('success', 'Info', 'Sorting applied.');
					 $data.splice(index,1);
				}
				else{
					toaster.pop('error', 'Info', "Something went wrong!");
				}
		  });
	};
	
	$scope.$data = {};
    var sortUrl = $scope.$root.stock+"product-tabs/sort-tab";
    $scope.sortDownProdTab = function (id, sort_id, index, $data) {
     
      $http
		  .post(sortUrl, {'token':$scope.$root.token,id:id, 'sort_id':sort_id, 'sort_type': 'desc'})
		  .then(function (res) {
				if(res.data.ack == true){
					toaster.pop('success', 'Info', 'Sorting applied.');
					 $data.splice(index,1);
				}
				else{
					toaster.pop('error', 'Info', "Something went wrong!");
				}
		  });
	};




  	$scope.sorting = function(id,sort_id,str,index){
    	// var sorUrl = $scope.$root.hr+"hr-tabs/sort-tab";
		 var sortUrl = $scope.$root.stock+"product-tabs/sort-tab";
	
	   	    $http
			 .post(sortUrl, {id:id,str:str,sort_id:sort_id,index:index,'token': $scope.$root.token})
			  .then(function (res) {
				  
					if(res.data.ack == true){
					// toaster.pop('success', 'Add', 'Record sort ');
					//  $timeout(function(){ $state.go('app.item_tabs'); }, 1000);
					    window.location.reload(true);
					 // $state.reload();
					 // $state.go("app.hr_tabs"); 
				}
				//else //toaster.pop('error', 'Info', res.data.error );
			  });
  	} 
  
}

function ProductTabAddController($scope, $stateParams, $http, $state,toaster,$timeout){

	$scope.btnCancelUrl = 'app.item_tabs'; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Stock','url':'#','isActive':false},
		 {'name':'Item Tabs','url':'app.item_tabs','isActive':false},
		 {'name':'Add','url':'#', 'isActive':false}];

	$scope.formUrl = function() {
		return "app/views/product_tabs/_form.html";
	  }
	
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	$scope.rec = {};
	$scope.status = {};
	
	var postUrl = $scope.$root.stock+"product-tabs/add-tab";
	
	$scope.add = function(rec){
	 	 rec.token = $scope.$root.token;
	 	 rec.status = $scope.rec.status.value !== undefined ? $scope.rec.status.value:0;
		 
		 $http
	      .post(postUrl, rec)
	      .then(function (res) {
			  //	console.log("Post response");
				//console.log(rec);
				if(res.data.ack == true){
					 toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
					 $timeout(function(){ $state.go('app.item_tabs'); }, 3000);
				}
				else
					toaster.pop('error', 'Info', res.data.error);
	      });
  }
  
  
  
  
}

function ProductTabsViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster,$timeout){
	$scope.btnCancelUrl = 'app.item_tabs';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Stock','url':'#','isActive':false},
		 {'name':'Item Tabs','url':'app.item_tabs','isActive':false}];
		 
	
	$scope.formUrl = function() {
		return "app/views/product_tabs/_form.html";
	  }
	  		
	$scope.gotoEdit = function(){
	  $state.go("app.editProductTab",{id:$stateParams.id});
	};
	
		 
  	$scope.rec = {};
	$scope.status = {};
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	
	var postUrl = $scope.$root.stock+"product-tabs/get-tab";
	var postData = {
	    'token': $scope.$root.token,
	    'id': $stateParams.id
  	};

	$http
      .post(postUrl, postData)
      .then(function (res) { 
      	$scope.rec = res.data.response;
		$.each($scope.arr_status,function(index,obj){
			//console.log(res.data.response.status);
			if(obj.value == res.data.response.status){
				$scope.rec.status = $scope.arr_status[index]; 
			}
		});
      });
 	
		 
var delUrl = $scope.$root.stock+"product-tabs/delete-tab";

 $scope.delete = function () {
    ngDialog.openConfirm({
      template: 'modalDeleteDialogId',
      className: 'ngdialog-theme-default'
    }).then(function (value) {
      $http
		  .post(delUrl, postData)
		  .then(function (res) {
				if(res.data.ack == true){
					toaster.pop('success', 'Deleted', 'Record Deleted ');
					 $timeout(function(){ $state.go('app.item_tabs'); }, 3000);
				}
				else{
					toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
					 $timeout(function(){ $state.go('app.item_tabs'); }, 3000);
				}
		  });
    }, function (reason) {
      console.log('Modal promise rejected. Reason: ', reason);
    });
 
	//if(popupService.showPopup('Would you like to delete?')) {
		
	//  }*/
 };
	
};

function ProductTabEditController($scope, $stateParams, $http, $state, $resource,toaster,$timeout){

	$scope.btnCancelUrl = 'app.item_tabs';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Stock','url':'#','isActive':false},
		 {'name':'Item Tabs','url':'app.item_tabs','isActive':false},
		 {'name':'Edit','url':'#', 'isActive':false}];	
	
 	$scope.rec = {};
	$scope.status = {};
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	
	var postUrl = $scope.$root.stock+"product-tabs/get-tab";
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
				$scope.rec.status = $scope.arr_status[index]; 
			}
		});
      });
	
	$scope.formUrl = function() {
		return "app/views/product_tabs/_form.html";
	  }
	
	var postUrl = $scope.$root.stock+"product-tabs/update-tab";
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	$scope.rec = {};
	$scope.status = {};
	
	 $scope.update = function(rec){
	 	 rec.token = $scope.$root.token;
	 	 rec.status = $scope.rec.status.value !== undefined ? $scope.rec.status.value:0;
		 
		 $http
	      .post(postUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
					 toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					 $timeout(function(){ $state.go('app.item_tabs'); }, 3000);
				}
				else
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 	$timeout(function(){ $state.go('app.item_tabs'); }, 3000);
	      });
  } 
}

