RolesController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster","$state"];


myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',


function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
/* $stateProvider	  
	state('app.hr_roles', {
        url: '/hr_roles',
        title: 'HR Roles',
        templateUrl: helper.basepath('hr_roles/hr_roles.html'), 
		 resolve: helper.resolveFor('ngTable','ngDialog')
    })
	..state('app.addHRTabCol', {
        url: '/hr_roles/add',
        title: 'Add HR Roles',
        templateUrl: helper.basepath('add.html'),
		controller: 'HRTabColAddController'
    })
	
	
	.state('app.viewHRTabsCol', {
		url: '/hr_roles/:id/view',
        title: 'View HR Tab Columns',
        templateUrl: helper.basepath('view.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'HRTabsColViewController'
	  })
	  .state('app.editHRTabCol', {
		url: '/hr_roles/:id/edit',
        title: 'Edit HR Tab Column',
        templateUrl: helper.basepath('edit.html'),
		controller: 'HRTabColEditController'
	  })
  */
 }]);

myApp.controller('RolesController', RolesController);
myApp.controller('HRTabColAddController', HRTabColAddController);
myApp.controller('HRTabsColViewController', HRTabsColViewController);
myApp.controller('HRTabColEditController', HRTabColEditController);


 
function RolesController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster,$state) {
    'use strict';
	

	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'HR','url':'#','isActive':false},
		 {'name':'HR Tab Columns','url':'#','isActive':false}];
		 
    var vm = this;
	 
	var Api = $scope.$root.hr+"hr_roles";
	
     var columns_data = {
	    'token': $scope.$root.token,
	    'all': "1"
  	};
    
	$scope.columns = [];
	$scope.hr_columns_data = {};
	$scope.db_column = [];
	
    $scope.$watch("MyCustomeFilters", function () {
        if($scope.MyCustomeFilters && $scope.table.tableParams5){
            $scope.table.tableParams5.reload();
        }
    }, true);
    $scope.MyCustomeFilters = {}
    

    	vm.tableParams5 = new ngParams({
        page: 1,            // show first page
        count: 2,           // count per page
        filter: {
            name: '',
            age: ''
        }
    }, {
        total: 0,           // length of data
        counts: [],         // hide page counts control

        getData: function($defer, params) {
 		//	ngDataService.getDataCustom( $defer, params, Api,$filter,$scope,columns_data);
        }
    });
	
		
	  
	function toTitleCase(str){
        var title = str.replace('_',' ');
        return title.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
	
	 $scope.tab_id = '';
 	 $scope.showLoader = true;
 
	   	$scope.get_tab_data = function(tab_id){
		
       if(tab_id == undefined)
     	 Id = this.tabs.id;
    	 else
  		var Id = $scope.get_tab_id;
		var colUrl_2 = $scope.$root.hr+"hr_roles/get_column_byid";
	   	   		 $http
				  .post(colUrl_2, {Id:Id,'token': $scope.$root.token})
	      		 .then(function (res) {
	     		  		if(res.data.ack == true){
					 
					$scope.hr_columns_data = res.data.response;
				
					 $scope.showLoader = false;
				}
				else{
						$scope.showLoader = false;
				}
	      });
    }
	
		
	
	
	 $http
      .post(Api, columns_data)
      .then(function (res) {
        		if(res.data.ack == true){
				 $scope.hr_columns_data = res.data.response;	
					angular.forEach(res.data.response[0],function(val,index){
						  $scope.db_column.push({
							'title':toTitleCase(index),
							'field':index,
							'visible':true
						  }); 
					  }); 
					// console.log(res.data.columns);
				 $scope.showLoader = false;
			}
			else{
				$scope.showLoader = false;
			}
      
	  });
	  
	  
	  	$scope.tab_name = {};
		var tabUrl = $scope.$root.hr+"hr-tabs/get-all-tabs";
	
		$http
      .post(tabUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true){
				$scope.tab_name = res.data.response;
				$scope.get_tab_id = $scope.tab_name[0];
//  				  columns_data.tab_id = $scope.tabs.id;
			}
			 else 	toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
   	 });
	
	
	
	  $scope.sorting_tab_fields = function(id,sort_id,str,index,t_id){
    		 var sorUrl = $scope.$root.hr+"hr_roles/sort-tab-col";
	   	    $http 
			    .post(sorUrl, {id:id,str:str,sort_id:sort_id,index:index,t_id:t_id,'token': $scope.$root.token})
			  .then(function (res) {
				  
					if(res.data.ack == true){
					 toaster.pop('success', 'Add', 'Record sort ');
					  
					  $scope.get_tab_data(t_id);
				}
				else 	toaster.pop('error', 'Info', res.data.error );
			  });
  }
  
	   
 	   	$scope.delete = function (id,index,arr_data) {
    	var delUrl = $scope.$root.hr+"hr_roles/delete-tab-col";
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
						 // $timeout(function(){ $state.go('app.hr_roles'); }, 3000);
					}
					else{ 
						toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(108));
					}
			  });
	    }, function (reason) {
	      console.log('Modal promise rejected. Reason: ', reason);
		});
	
	};
	
}


function HRTabColAddController($scope, $stateParams, $http, $state,toaster,$timeout){

	$scope.btnCancelUrl = 'app.hr_roles'; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'HR','url':'#','isActive':false},
		 {'name':'HR Tab Columns','url':'app.hr_roles','isActive':false},
		 {'name':'Add','url':'#', 'isActive':false}];

	$scope.formUrl = function() {
		return "app/views/hr_roles/_form.html";
	  }
	
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	$scope.rec = {};
	$scope.status = {};
	$scope.tab_name = {};
	
	var postUrl = $scope.$root.hr+"hr_roles/add-tab-col";
	var tabUrl = $scope.$root.hr+"hr-tabs/get-all-tabs";
	
	$http
      .post(tabUrl, {'token':$scope.$root.token})
      .then(function (res) {
		 // alert(res);
        	if(res.data.ack == true){
			//	  console.log(res.data.response);//return;
				$scope.tab_name = res.data.response;
				//$scope.country = $scope.countries[data.selected_comp]; 
			}
			else
				toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
    });
	
	
	$scope.add = function(rec){
	 	 rec.token = $scope.$root.token;
	 	 rec.status = $scope.rec.status.value !== undefined ? $scope.rec.status.value:0;
		 rec.tab_id = $scope.rec.get_tab_id != undefined?$scope.rec.get_tab_id.id:0;
		 	 
		 $http
	      .post(postUrl, rec)
	      .then(function (res) {
				if(res.data.ack == true){
					 toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
					 $timeout(function(){ $state.go('app.hr_roles'); }, 3000);
				}
				else
					toaster.pop('error', 'Info', res.data.error );
	      });
  }
}

function HRTabsColViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster,$timeout){
	$scope.btnCancelUrl = 'app.hr_roles';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'HR','url':'#','isActive':false},
		 {'name':'HR Tab Columns','url':'app.hr_roles','isActive':false},
		 {'name':'view','url':'#', 'isActive':false}];
		 
	
	$scope.formUrl = function() {
		return "app/views/hr_roles/_form.html";
	  }
	  		
	$scope.gotoEdit = function(){
	  $state.go("app.editHRTabCol",{id:$stateParams.id});
	};
	
		 
  	$scope.rec = {};
	$scope.status = {};
//	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	
	
	var tabUrl = $scope.$root.hr+"hr-tabs/get-all-tabs"; 
	$http
      .post(tabUrl, {'token':$scope.$root.token})
      .then(function (res) {
		  
        	if(res.data.ack == true){
				$scope.tab_name = res.data.response;
			}
			else
				toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
    });
	
	
	var postUrl = $scope.$root.hr+"hr_roles/get-tab-col";
	var postData = {
	    'token': $scope.$root.token,
	    'id': $stateParams.id
  	};

	$http
      .post(postUrl, postData)
      .then(function (res) {
		  
      	$scope.rec = res.data.response;
			
			$.each($scope.tab_name,function(index,obj){
			//console.log(obj.id == res.data.response.tab_id);
			if(obj.id == res.data.response.tab_id){
				$scope.rec.get_tab_id = $scope.tab_name[index]; 
			}
		});
		
			$.each($scope.arr_status,function(index,obj){
		//console.log(obj.value +"=="+ res.data.response.status);
			if(obj.label == res.data.response.status){
				$scope.rec.status = $scope.arr_status[index]; 
			//	console.log("Response =>"+$scope.rec.status);
				
			}
		});
		
		
		
      });
 	 
};

function HRTabColEditController($scope, $stateParams, $http, $state, $resource,toaster,$timeout){

	$scope.btnCancelUrl = 'app.hr_roles';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'HR','url':'#','isActive':false},
		 {'name':'HR Tab Columns','url':'app.hr_roles','isActive':false},
		 {'name':'Edit','url':'#', 'isActive':false}];	
	
 	$scope.rec = {};
	$scope.status = {};
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	
	var tabUrl = $scope.$root.hr+"hr-tabs/get-all-tabs"; 
	$http
      .post(tabUrl, {'token':$scope.$root.token})
      .then(function (res) {
		  
        	if(res.data.ack == true){
				//  console.log(res.data.response);//return;
				$scope.tab_name = res.data.response;
				//$scope.country = $scope.countries[data.selected_comp]; 
			}
			else
				toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
    });
	
	
	var postUrlg = $scope.$root.hr+"hr_roles/get-tab-col";
	var postData = {
	    'token': $scope.$root.token,
	    'id': $stateParams.id
  	};

	$http
      .post(postUrlg, postData)
      .then(function (res) {
		  
      	$scope.rec = res.data.response;
			
			$.each($scope.tab_name,function(index,obj){
			//console.log(obj.id == res.data.response.tab_id);
			if(obj.id == res.data.response.tab_id){
				$scope.rec.get_tab_id = $scope.tab_name[index]; 
			}
		});
		
			$.each($scope.arr_status,function(index,obj){
		//console.log(obj.value +"=="+ res.data.response.status);
			if(obj.label == res.data.response.status){
				$scope.rec.status = $scope.arr_status[index]; 
			//	console.log("Response =>"+$scope.rec.status);
				
			}
		});
		
		
		
      });
	  
	   
	$scope.formUrl = function() {
		return "app/views/hr_roles/_form.html";
	  }
	
	var postUrl = $scope.$root.hr+"hr_roles/update-tab-col";
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	$scope.rec = {};
	$scope.status = {};
	
	 $scope.update = function(rec){
	 	 rec.token = $scope.$root.token;
	 	 rec.status = $scope.rec.status.value !== undefined ? $scope.rec.status.value:0;
		 rec.tab_id = $scope.rec.get_tab_id != undefined?$scope.rec.get_tab_id.id:0;
		 
		 $http
	      .post(postUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
					 toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
					 $timeout(function(){ $state.go('app.hr_roles'); }, 3000);
				}
				else
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 	$timeout(function(){ $state.go('app.hr_roles'); }, 3000);
	      });
  }
	
}

