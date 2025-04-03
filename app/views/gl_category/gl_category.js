GlCategoryController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http",
"ngDialog","toaster","$state"];

myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.gl_category', {
        url: '/gl_category',
        title: 'Gl Category',
        templateUrl: helper.basepath('gl_category/gl_category.html'),
        resolve: helper.resolveFor('ngTable','ngDialog'),
		controller: 'GlCategoryController'
    })
	.state('app.addgl_category', {
        url: '/gl_category/add',
        title: 'Add GL Category',
        templateUrl: helper.basepath('add.html'),
		controller: 'GLAddCategoryController'
    })
	.state('app.viewgl_category', {
		url: '/gl_category/:id/view',
        title: 'View Gl Category',
        templateUrl: helper.basepath('view.html'),
		controller: 'GlViewCategoryController'
	  })
	  .state('app.editgl_category', {
		url: '/gl_category/:id/edit',
        title: 'Edit Gl Category',
        templateUrl: helper.basepath('edit.html'),
		controller: 'GlCategoryEditController'
	  })
  
 }]);

myApp.controller('GlCategoryController', GlCategoryController);
myApp.controller('GLAddCategoryController', GLAddCategoryController);
myApp.controller('GlViewCategoryController', GlViewCategoryController);
myApp.controller('GlCategoryEditController', GlCategoryEditController);


function GlCategoryController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster,$state) {
	
    'use strict';
 
	
	$scope.module_table ='gl_category';
	$scope.class = 'inline_block';
	 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Ledger Group','url':'#','isActive':false},
		 {'name':'Gl Category','url':'#','isActive':false}];
		 
    var vm = this;
	
 
	var Api = $scope.$root.setup+"ledger-group/gl-category-list";
	
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
		
    var delUrl = $scope.$root.setup+"ledger-group/delete-gl-category";
      ngDialog.openConfirm({
      template: 'modalDeleteDialogId',
      className: 'ngdialog-theme-default-custom'
    }).then(function (value) {
      $http
		  .post(delUrl, {'token':$scope.$root.token,id:id})
		  .then(function (res) {
				if(res.data.ack == true){
					toaster.pop('success', 'Deleted', 'Record Deleted');
					 $data.splice(index,1);
				}
				else{ 	toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(108)); }
		  });
    }, function (reason) {
      console.log('Modal promise rejected. Reason: ', reason);
    });
 
	};
	
}

function GLAddCategoryController($scope, $stateParams, $http, $state,toaster,$timeout){

	$scope.btnCancelUrl = 'app.gl_category'; 
 
		$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Ledger Group','url':'#','isActive':false},
		 {'name':'Gl Category','url':'app.gl_category','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];
		
	$scope.formUrl = function() {
		return "app/views/gl_category/_form.html";
	  }
	
	$scope.rec = {};$scope.cover_list = {};$scope.status = {};
	
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	
	var postUrl = $scope.$root.setup+"ledger-group/add-gl-category";
	$scope.add = function(rec){
		  rec.token = $scope.$root.token;
	 	 rec.statuss = $scope.rec.status != undefined ? $scope.rec.status.value:0;
		
		 $http
	      .post(postUrl, rec)
	      .then(function (res) {
			  if(res.data.ack == true){
					 toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
					 $timeout(function(){ $state.go('app.gl_category'); }, 3000);
				}
				else
					toaster.pop('error', 'Info', res.data.error);
	      });
  }
}

function GlViewCategoryController($scope, $stateParams, $http, $state, $resource,toaster,$timeout){
	$scope.btnCancelUrl = 'app.gl_category';
$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Ledger Group','url':'#','isActive':false},
		 {'name':'Gl Category','url':'app.gl_category','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];
			 
	
	$scope.formUrl = function() {
		return "app/views/gl_category/_form.html";
	  }
	  		
	$scope.gotoEdit = function(){
	  $state.go("app.editgl_category",{id:$stateParams.id});
	};
	
		 
  	$scope.rec = {};$scope.cover_list = {};$scope.status = {};
	
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	
	var postUrl = $scope.$root.setup+"ledger-group/get-gl-category-id";
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
}

function GlCategoryEditController($scope, $stateParams, $http, $state, $resource,toaster,$timeout){
 
	
 $scope.btnCancelUrl = 'app.gl_category';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Ledger Group','url':'#','isActive':false},
		 {'name':'Gl Category','url':'app.gl_category','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];
			 
	
	$scope.formUrl = function() {
		return "app/views/gl_category/_form.html";
	  }
	  		
	$scope.gotoEdit = function(){
	  $state.go("app.editgl_category",{id:$stateParams.id});
	};
	
		 
  	$scope.rec = {};$scope.cover_list = {};$scope.status = {};
	
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	
	var postUrl = $scope.$root.setup+"ledger-group/get-gl-category-id";
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
	  
	var postUrl = $scope.$root.setup+"ledger-group/update-gl-category";
	 $scope.update = function(rec){
		// console.log(rec);
	 	 rec.token = $scope.$root.token;
	 	 rec.statuss = $scope.rec.status != undefined ? $scope.rec.status.value:0;
		 $http
	      .post(postUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
					 toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					 $timeout(function(){ $state.go('app.gl_category'); }, 3000);
				}
				else
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				  $timeout(function(){ $state.go('app.gl_category'); }, 3000);
	      });
  } 
}

