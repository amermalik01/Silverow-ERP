HRTabsController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster","$state"];

myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.hr_tabs', {
        url: '/hr_tabs',
        title: 'Human Resource Tabs',
        templateUrl: helper.basepath('hr_tabs/hr_tabs.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.addHRTab', {
        url: '/hr_tabs/add',
        title: 'Add Human Resource  Tab',
        templateUrl: helper.basepath('add.html'),
		controller: 'hrTabAddController'
    })
	.state('app.hrViewController', {
		url: '/hr_tabs/:id/view',
        title: 'View Human Resource  Tabs',
        templateUrl: helper.basepath('view.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'hrTabsViewController'
	  })
	  .state('app.edithrTab', {
		url: '/hr_tabs/:id/edit',
        title: 'Edit Human Resource  Tab',
        templateUrl: helper.basepath('edit.html'),
		controller: 'hrTabEditController'
	  })
  
 }]);

myApp.controller('HRTabsController', HRTabsController);
myApp.controller('hrTabAddController', hrTabAddController);
myApp.controller('hrTabsViewController', hrTabsViewController);
myApp.controller('hrTabEditController', hrTabEditController);


function HRTabsController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster,$state) {
	
    'use strict';

	$scope.module_table = 'hrs_tabs';
	$scope.class = 'inline_block';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Human Resource Tabs ','url':'#','isActive':false} ];
		 
    var vm = this;

	var Api = $scope.$root.hr+"hr-tabs";
	
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
    },
	 {
        total: 0,           // length of data
        counts: [],         // hide page counts control

        getData: function($defer, params) {
 			ngDataService.getDataCustom( $defer, params, Api,$filter,$scope,postData);
        }
    });
 
	  
		$scope.sorting_tabs = function(id,sort_id,str,index){
    	 var sorUrl = $scope.$root.hr+"hr-tabs/sort-tab";
	
	   	    $http
			 .post(sorUrl, {id:id,str:str,sort_id:sort_id,index:index,'token': $scope.$root.token})
			  .then(function (res) {
				  
					if(res.data.ack == true){
					 toaster.pop('success', 'Add', 'Record sort ');
					// $timeout(function(){ $state.go('app.hr_tabs'); }, 1000);
					 // window.location.reload(true);
					  $state.reload();
					 // $state.go("app.hr_tabs"); 
				}
				else
					toaster.pop('error', 'Info', res.data.error );
			  });
  	}
  
  



 $scope.delete = function (id,index,arr_data) {
    	var delUrl = $scope.$root.hr+"hr-tabs/delete-tab";
	   
	    ngDialog.openConfirm({
	      template: 'modalDeleteDialogId',
	      className: 'ngdialog-theme-default-custom'
	    }).then(function (value) {
	      $http
			  .post(delUrl, {id:id,'token': $scope.$root.token})
			  .then(function (res) {
				  
					if(res.data.ack == true){
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
						 arr_data.splice(index,1);
						 // $timeout(function(){ $state.go('app.hr_tabs'); }, 3000);
					}
					else{ 
						toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(108));
					}
			  });
	    },
		 function (reason) {
	      console.log('Modal promise rejected. Reason: ', reason);
		});
	};

} 

function hrTabAddController($scope, $stateParams, $http, $state,toaster,$timeout){
  
  
	$scope.btnCancelUrl = 'app.hr_tabs'; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false}, 
		 {'name':'Human Resource  Tabs','url':'app.hr_tabs','isActive':false},
		 {'name':'Add','url':'#', 'isActive':false}];

	$scope.formUrl = function() {
		return "app/views/hr_tabs/_form.html";
	  }
	
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	$scope.rec = {};
	$scope.status = {};
	
	var postUrl = $scope.$root.hr+"hr-tabs/add-tab";
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
					 $timeout(function(){ $state.go('app.hr_tabs'); }, 3000);
				}
				else
					toaster.pop('error', 'Info', res.data.error );
	      });
  }
}

function hrTabsViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster,$timeout){
	$scope.btnCancelUrl = 'app.hr_tabs';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false}, 
		 {'name':'Human Resource  Tabs','url':'app.hr_tabs','isActive':false}];
		 
	
	$scope.formUrl = function() {
		return "app/views/hr_tabs/_form.html";
	  }
	  		
	$scope.gotoEdit = function(){
	  $state.go("app.edithrTab",{id:$stateParams.id});
	};
	
		 
  	$scope.rec = {};
	$scope.status = {};
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'inActive','value':0}];
	
	var postUrl = $scope.$root.hr+"hr-tabs/get-tab";
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
};

function hrTabEditController($scope, $stateParams, $http, $state, $resource,toaster,$timeout){

	$scope.btnCancelUrl = 'app.hr_tabs';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false}, 
		 {'name':'Human Resource  Tabs','url':'app.hr_tabs','isActive':false},
		 {'name':'Edit','url':'#', 'isActive':false}];	
	
 	$scope.rec = {};
	$scope.status = {};
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'inActive','value':0}];
	
	var postUrl = $scope.$root.hr+"hr-tabs/get-tab";
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
				//console.log($scope.rec.status);
			}
		});
      });
	
	$scope.formUrl = function() {
		return "app/views/hr_tabs/_form.html";
	  }
	
	var postUrl = $scope.$root.hr+"hr-tabs/update-tab"; 
	 $scope.update = function(rec){
	 	 rec.token = $scope.$root.token;
	 	 rec.status = $scope.rec.status.value !== undefined ? $scope.rec.status.value:0;
		 
		 $http
	      .post(postUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
					 toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					 $timeout(function(){ $state.go('app.hr_tabs'); }, 3000);
				}
				else
					//toaster.pop('success', 'Edit', '  no changes!');
					toaster.pop('error', 'Edit', 'Record can\'t be changes!');
				 	$timeout(function(){ $state.go('app.hr_tabs'); }, 3000);
	      });
  } 
}

 