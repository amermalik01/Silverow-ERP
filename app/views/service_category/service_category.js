ServiceCategoryController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","toaster","ngDialog"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.service_category', {
        url: '/servicecategory',
        title: 'Category',
        templateUrl: helper.basepath('service_category/category.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.addServiceCategory', {
        url: '/servicecategory/add',
        title: 'Add Category',
        templateUrl: helper.basepath('add.html'),
		controller: 'ServiceCategoryAddController'
    })
	.state('app.viewServiceCategory', {
		url: '/service/categories/:id/view',
        title: 'View Categories',
        templateUrl: helper.basepath('view.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'ServiceCategoryViewController'
	  })
	
	    .state('app.editServiceCategory', {
		url: '/service/categories/:id/edit',
        title: 'Edit Category',
        templateUrl: helper.basepath('edit.html'),
		controller: 'ServiceCategoryEditController'
	  })
	  
  
 }]);

myApp.controller('ServiceCategoryController', ServiceCategoryController);
myApp.controller('ServiceCategoryAddController', ServiceCategoryAddController);
myApp.controller('ServiceCategoryViewController', ServiceCategoryViewController);
myApp.controller('ServiceCategoryEditController', ServiceCategoryEditController);

function ServiceCategoryController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,toaster,ngDialog) {
    'use strict';
	
    // required for inner references
	
	$scope.breadcrumbs = 
	[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
	{'name':'Setup','url':'#','isActive':false},
	{'name':'Services','url':'#','isActive':false},
	{'name':'Category','url':'#','isActive':false}];
	
	
		
			
    var vm = this;
	 
	var Api = $scope.$root.setup+"service/categories/categories";
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
	$scope.checkData ={};
	//console.log($scope);	 
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

    $scope.$data = {};
   
    $scope.deleteCategory = function (id,index,$data) {
		 var delUrl = $scope.$root.setup+"service/categories/delete-category";
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
				else{
					toaster.pop('error', 'Info', "This category is used by another module!");
				}
		  });
    }, function (reason) {
      console.log('Modal promise rejected. Reason: ', reason);
    });
 
	};

}

function ServiceCategoryAddController($scope, $stateParams, $http, $state,toaster){

	$scope.btnCancelUrl = 'app.service_category'; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Services','url':'#','isActive':false},
		 {'name':'Category','url':'app.service_category','isActive':false},
		 {'name':'Add','url':'#', 'isActive':false}];

	$scope.formUrl = function() {
		return "app/views/category/_form.html";
	  }
	
	var postUrl = $scope.$root.setup+"service/categories/add-category";
	//alert(postUrl);
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	$scope.rec = {};
	$scope.status = {};
	
	 $scope.add = function(rec){
	 	 rec.token = $scope.$root.token;
	 	 rec.status = $scope.rec.status.value !== undefined ? $scope.rec.status.value:0;
	 	 
		 $http
	      .post(postUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
					 toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
					 $timeout(function(){ $state.go('app.service_category'); }, 3000);
				}
				else
					toaster.pop('error', 'Info', res.data.error);
	      });
  }
}

function ServiceCategoryViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster){
	$scope.btnCancelUrl = 'app.service_category'; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Services','url':'#','isActive':false},
		 {'name':'Category','url':'app.service_category','isActive':false}];
	
	$scope.formUrl = function() {
		return "app/views/category/_form.html";
	  }
	  		
	$scope.gotoEdit = function(){
	  $state.go("app.editServiceCategory",{id:$stateParams.id});
	};
	
	
  	$scope.rec = {};
	$scope.status = {};
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	
	var postUrl = $scope.$root.setup+"service/categories/get-category";
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
 	
		 
var delUrl = $scope.$root.setup+"service/categories/delete-category";

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
					 $timeout(function(){ $state.go('app.service_category'); }, 3000);
				}
				else{
					toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
					 $timeout(function(){ $state.go('app.service_category'); }, 3000);
				}
		  });
    }, function (reason) {
      console.log('Modal promise rejected. Reason: ', reason);
    });
 
	//if(popupService.showPopup('Would you like to delete?')) {
		
	//  }*/
 };
	
};

function ServiceCategoryEditController($scope, $stateParams, $http, $state, $resource,toaster){

	$scope.btnCancelUrl = 'app.service_category'; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Services','url':'#','isActive':false},
		 {'name':'Category','url':'app.service_category','isActive':false},
		 {'name':'Edit','url':'#', 'isActive':false}];
	
 	$scope.rec = {};
	$scope.status = {};
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	
	var postUrl = $scope.$root.setup+"service/categories/get-category";
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
		return "app/views/category/_form.html";
	  }
	
	var postUrl = $scope.$root.setup+"service/categories/update-category";
	$scope.rec = {};
	 $scope.update = function(rec){
	 	 rec.token = $scope.$root.token;
	 	 rec.status = $scope.rec.status.value !== undefined ? $scope.rec.status.value:0;
		 $http
	      .post(postUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == 1){
					 toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					 $timeout(function(){ $state.go('app.service_category'); }, 3000);
				} else if(res.data.ack == 2){
					 toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106)');
					// $timeout(function(){ $state.go('app.service_category'); }, 3000);
				} else if(res.data.ack == 0){
					toaster.pop('success', 'Edit', 'Record Updated with no Updated  .');
				 	$timeout(function(){ $state.go('app.service_category'); }, 3000);
				}
	      });
  }
	
}