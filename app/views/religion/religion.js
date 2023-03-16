ReligionController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.religion', {
        url: '/religion',
        title: 'Religion',
        templateUrl: helper.basepath('religion/religion.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
 	.state('app.add_religion', {
        url: '/religionadd',
        title: 'Add Religion',
        templateUrl: helper.basepath('add.html'),
		controller: 'ReligionAddController'
    })
	.state('app.view-religion', {
		url: '/religion:id/view',
        title: 'View Religion ',
        templateUrl: helper.basepath('view.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'ReligionViewController'
	  })
	  .state('app.edit-religion', {
		url: '/religion:id/edit',
        title: 'Edit Religion',
        templateUrl: helper.basepath('edit.html'),
		controller: 'ReligionEdit'
	  }) 
  
 }]);

myApp.controller('ReligionController', ReligionController);
myApp.controller('ReligionAddController', ReligionAddController);
myApp.controller('ReligionViewController', ReligionViewController);
myApp.controller('ReligionEdit', ReligionEdit);

function ReligionController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster) {
    'use strict';
		var vm = this; 
	$scope.class = 'inline_block'; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Human Resources','url':'#','isActive':false},
		 {'name':'Religion','url':'#','isActive':false}];
		  
	  var Api = $scope.$root.hr+"hr_religion/get-religion"; 
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
 
	  
	 
 $scope.delete = function (id,index,arr_data_ret) {  
	 var delUrl = $scope.$root.hr+"hr_religion/delete-religion"; 
	    ngDialog.openConfirm({
	      template: 'modalDeleteDialogId',
	      className: 'ngdialog-theme-default-custom'
	    }).then(function (value) {
	      $http
			  .post(delUrl, {id:id,'token': $scope.$root.token})
			  .then(function (res) {
				  
					if(res.data.ack == true){
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
						 arr_data_ret.splice(index,1); 
					}
					else{ 
						toaster.pop('error', 'Info', 'Record cannot be Deleted.');
					}
			  });
	    },
		 function (reason) {
	      console.log('Modal promise rejected. Reason: ', reason);
		});
	};

}

function ReligionAddController($scope, $stateParams, $http, $state,toaster,$timeout){

	 $scope.formTitle = 'Religion';
	 $scope.btnCancelUrl = 'app.religion';
	 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Human Resources','url':'#','isActive':false},
		 {'name':'Religion','url':'app.religion','isActive':false},
		 {'name':'Add','url':'#','isActive':false}];

	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	$scope.rec = {};
	$scope.status = {};
	
	$scope.formUrl = function() {
  return "app/views/religion/_form.html";
	  }
	
	var postUrl = $scope.$root.hr+"hr_religion/add_religion"; 
	$scope.add = function(rec){
	 	 rec.token = $scope.$root.token; 
		  rec.status = $scope.rec.statuss.value !== undefined ? $scope.rec.statuss.value:0;
		 
		 $http
	      .post(postUrl, rec)
	      .then(function (res) {  
				if(res.data.ack == true){
					 toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
							 $timeout(function(){ $state.go('app.religion'); }, 3000);
				}
				else
					toaster.pop('error', 'Info', res.data.error );
	      });
  }
  
   
}

function ReligionViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster,$timeout){
	$scope.formTitle = 'Religion';
	 $scope.btnCancelUrl = 'app.religion';
	 $scope.hideDel = false; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'HR','url':'#','isActive':false},
		 {'name':'Religion','url':'app.religion','isActive':false}];
		 
	$scope.formUrl = function() {
		  return "app/views/religion/_form.html";
	  }
	  
		
	$scope.gotoEdit = function(){
	  $state.go("app.edit-religion",{id:$stateParams.id});
	};
	
	$scope.rec = {};
	$scope.status = {};
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'inActive','value':0}];
	 
	var postUrl = $scope.$root.hr+"hr_religion/get_religion_by_id";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id };

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

	
};

function ReligionEdit($scope, $stateParams, $http, $state, $resource,toaster,$timeout){

	$scope.formTitle = 'Religion';
	 $scope.btnCancelUrl = 'app.religion';
	 $scope.hideDel = false;  
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 	 {'name':'HR','url':'#','isActive':false},
		 {'name':'Religion','url':'app.religion','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];	
	
	$scope.formUrl = function() {
		  return "app/views/religion/_form.html";
	  }

 	$scope.rec = {};
	$scope.status = {};
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'inActive','value':0}];
	
	var postUrl = $scope.$root.hr+"hr_religion/get_religion_by_id";  
	var postData = {'token': $scope.$root.token,'id': $stateParams.id }; 
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

	var updateUrl = $scope.$root.hr+"hr_religion/add_religion"; 
	$scope.update = function(rec){
	 	 rec.token = $scope.$root.token;
		  rec.status = $scope.rec.statuss.value !== undefined ? $scope.rec.statuss.value:0;
		 
		 $http
	      .post(updateUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
				toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 $timeout(function(){ $state.go('app.religion'); }, 3000);
			}
			else{
							toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
			}
				
      });
  	}
	
}


