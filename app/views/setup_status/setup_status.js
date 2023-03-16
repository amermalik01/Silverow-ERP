ListstatusController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster"];
 
 
 myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.setup-status', {
        url: '/setup_status',
        title: 'Status',
        templateUrl: helper.basepath('setup_status/setup_status.html'),
     resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.addstatus', {
        url: '/setup_status/add',
        title: 'Add Status',
        templateUrl: helper.basepath('add.html'),
		controller: 'AddStatusController'
    })
	.state('app.viewStatus', {
		url: '/setup_status/:id/view',
        title: 'View Status',
        templateUrl: helper.basepath('view.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'ViewStatuscontroller'
	  })
	  .state('app.editstatus', {
		url: '/setup_status/:id/edit',
        title: 'Edit Status',
        templateUrl: helper.basepath('edit.html'),
		controller: 'EditStatusController'
	  })
  
 }]);

myApp.controller('ListstatusController', ListstatusController);
myApp.controller('AddStatusController', AddStatusController);
myApp.controller('ViewStatuscontroller', ViewStatuscontroller);
myApp.controller('EditStatusController', EditStatusController);


	
function ListstatusController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster) {	
	
	$scope.module_table = 'unit_list';
	$scope.class = 'inline_block'; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Stock','url':'#','isActive':false},
		 {'name':'Status','url':'#','isActive':false}];
		 
    var vm = this;
	var Api = $scope.$root.stock+"product-status/get-status"; 
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
	
	
	
	
 $scope.delete = function (id,index,arr_data_ret) {  
		var delUrl = $scope.$root.stock+"product-status/delete-status-list";
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
						toaster.pop('error', 'Info', "Record cann't Deleted.");
					}
			  });
	    },
		 function (reason) {
	      console.log('Modal promise rejected. Reason: ', reason);
		});
	};
 


}

function AddStatusController($scope, $stateParams, $http, $state,toaster,$timeout){
	
	$scope.btnCancelUrl = 'app.setup-status';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Stock','url':'#','isActive':false},
		 {'name':'Status','url':'app.setup-status','isActive':false},
		 {'name':'Add','url':'#', 'isActive':false}];

	$scope.formUrl = function() {
		return "app/views/setup_status/_form.html";
	  }
	
	var postUrl = $scope.$root.stock+"product-status/add-status-list";
	$scope.rec = {};
	$scope.unit_list = {};
	$scope.unit_list =	[{'name':'Product Purchase Information','id':1},{'name':'SRM','id':2}];
	
	$scope.arr_status = {};
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'inActive','value':0}];
	
	$scope.add = function(rec){
	 	 rec.token = $scope.$root.token;
		 rec.type = $scope.rec.unit_id !== undefined?$scope.rec.unit_id.id:0; 
		 rec.status = $scope.rec.statuss  !== undefined ? $scope.rec.statuss.value:0;
		  
		 $http
	      .post(postUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
					 toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
					 $timeout(function(){ $state.go('app.setup-status'); }, 3000);
				}
				else
					toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(105));
	      });
  }
}

function ViewStatuscontroller($scope, $stateParams, $http, $state, $resource,ngDialog,toaster,$timeout){
	$scope.btnCancelUrl = 'app.setup-status';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Stock','url':'#','isActive':false},
		 {'name':'Status','url':'app.setup-status','isActive':false}];
		 
	$scope.formUrl = function() {
		return "app/views/setup_status/_form.html";
	  }
	  		
	$scope.gotoEdit = function(){
	  $state.go("app.editstatus",{id:$stateParams.id});
	};
	
		 $scope.rec = {};
	$scope.unit_list = {};
	$scope.unit_list =	[{'name':'Product Purchase Information','id':1},{'name':'SRM','id':2}];
	$scope.arr_status = {};
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'inActive','value':0}];
	
	 	 
	var getURL = $scope.$root.stock+"product-status/get-status-list-by-id";
	var postData = {
	    'token': $scope.$root.token,
	    'id': $stateParams.id
  	}; 
			
	//$timeout(function(){
		$http
	      .post(getURL, postData)
	      .then(function (res) {
	      			$scope.rec = res.data.response;
		      
					$.each($scope.arr_status,function(index,obj){ 
					if(obj.value == res.data.response.status){
						$scope.rec.statuss = $scope.arr_status[index]; 
						
					}});
							
				$.each($scope.unit_list,function(index,obj){
					if(obj.id == res.data.response.type){
						$scope.rec.unit_id = $scope.unit_list[index]; 
					}
				});
				
				
	      });
//	}, 3000);


 
} 

function EditStatusController($scope, $stateParams, $http, $state, $resource,toaster,$timeout){

	$scope.btnCancelUrl = 'app.setup-status';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Stock','url':'#','isActive':false},
		 {'name':'Status','url':'app.setup-status','isActive':false},
		 {'name':'Edit','url':'#', 'isActive':false}];
	
 	
	$scope.formUrl = function() {
		return "app/views/setup_status/_form.html";
	}
	
	$scope.rec = {};
	$scope.unit_list = {};
	$scope.unit_list =	[{'name':'Product Purchase Information','id':1},{'name':'SRM','id':2}];
	$scope.arr_status = {};
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'inActive','value':0}];
	
	 	 
	var getURL = $scope.$root.stock+"product-status/get-status-list-by-id";
	var postData = {
	    'token': $scope.$root.token,
	    'id': $stateParams.id
  	}; 
			
	//$timeout(function(){
		$http
	      .post(getURL, postData)
	      .then(function (res) {
	      			$scope.rec = res.data.response;
		      
					$.each($scope.arr_status,function(index,obj){ 
					if(obj.value == res.data.response.status){
						$scope.rec.statuss = $scope.arr_status[index]; 
						
					}});
							
				$.each($scope.unit_list,function(index,obj){
					if(obj.id == res.data.response.type){
						$scope.rec.unit_id = $scope.unit_list[index]; 
					}
				});
				
				
	      });
//	}, 3000);



	var updateUrl = $scope.$root.stock+"product-status/update-status-list";
	$scope.update = function(rec){
	 	 rec.token = $scope.$root.token;
		 rec.type = $scope.rec.unit_id !== undefined?$scope.rec.unit_id.id:0; 
		 rec.status = $scope.rec.statuss  !== undefined ? $scope.rec.statuss.value:0;
		 
		 $http
	      .post(updateUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
				toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 $timeout(function(){ $state.go('app.setup-status'); }, 3000);
			}
			else
				toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 //	$timeout(function(){ $state.go('app.setup-status'); }, 3000);
      });
  	}
  
  
	
}

