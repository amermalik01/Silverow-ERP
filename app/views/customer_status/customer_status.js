
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.customer-status', {
        url: '/customer-status',
        title: 'Customer Status',
        templateUrl: helper.basepath('customer_status/customer_status.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.add-customer-status', {
        url: '/customer-status/add',
        title: 'Add Customer Status ',
        templateUrl: helper.basepath('edit.html'),
		controller: 'CustomerStatusEditController'
    }) 
	  .state('app.edit-customer-status', {
		url: '/customer-status/:id/edit',
        title: 'Edit Customer Status ',
        templateUrl: helper.basepath('edit.html'),
		controller: 'CustomerStatusEditController'
	  })
  
  
 }]);
CustomerStatusController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster","$rootScope"];
myApp.controller('CustomerStatusController', CustomerStatusController);
myApp.controller('CustomerStatusEditController', CustomerStatusEditController);

function CustomerStatusController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster,$rootScope) {
    'use strict';

	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Customer Status','url':'#','isActive':false}];
		 
 	var vm = this;
  //  var Api = $scope.$root.sales+"crm/crm/all-status";
	var Api = $rootScope.setup + "general/all-status-list";
    var postData = {
	    'token': $scope.$root.token,
	    'all': "1",
		'tbl':  $rootScope.base64_encode('customer_status') ,
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
        }
    });



    $scope.delete = function (id,rec,arr_data) {
    	//var delUrl = $scope.$root.sales+"crm/crm/delete-customer-status";
		 var delUrl = $scope.$root.setup +"general/delete-status";
		 
	
	    ngDialog.openConfirm({
	      template: 'modalDeleteDialogId',
	      className: 'ngdialog-theme-default-custom'
	    }).then(function (value) {
	      $http
			  .post(delUrl, {id:id,'token': $scope.$root.token,'tbl':$rootScope.base64_encode('customer_status')})
			  .then(function (res) {
					if(res.data.ack == true){
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
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

function CustomerStatusEditController($scope, $stateParams, $http, $state, $resource,toaster,$rootScope){

	$scope.formTitle = 'Customer Status';
	 $scope.btnCancelUrl = 'app.customer-status';
	 $scope.hideDel = false; 
	
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Customer Status','url':'app.customer-status','isActive':false},
		 {'name':'ADd','url':'#','isActive':false}];	
	
	 if($stateParams.id!==undefined)	 {
			 	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Customer Status','url':'app.customer-status','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];	
	
			 
		 }

 	$scope.rec = {};
 	$scope.predefine_types = {};
	
     $scope.formUrl = function() {return "app/views/crm_status/_form.html"; }
		  
	 $scope.status = {};
	 $scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	
	 if($stateParams.id!==undefined)	 {	
	 	var postUrl = $scope.$root.sales+"crm/crm/get-customer-status";
		var postData = {'token': $scope.$root.token,'id': $stateParams.id };
	
			$http
		  .post(postUrl, postData)
		  .then(function (res) {
			$scope.rec = res.data.response;
			
			$.each($scope.arr_status,function(index,obj){
					if(res.data.response.status!=undefined) 	{
							if(obj.value == res.data.response.status)
							$scope.rec.status = obj
						}
					});
		  });
		  
	 }
			  
	$scope.update = function(rec){
	
	rec.tbl = $rootScope.base64_encode('customer_status');
	rec.token = $scope.$root.token;
	
	rec.statuss = $scope.rec.status  !== undefined ? $scope.rec.status.value:0;
	
	 var updateUrl = $scope.$root.setup +"general/add-status";
	  if($stateParams.id!==undefined) 	var updateUrl = $scope.$root.setup +"general/update-status";
	 
	// var updateUrl = $scope.$root.sales+"crm/crm/add-customer-status";
	// if($stateParams.id!==undefined) 	var updateUrl = $scope.$root.sales+"crm/crm/update-customer-status";
	 
		 $http
	      .post(updateUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
				toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 $timeout(function(){ $state.go('app.customer-status'); }, 3000);
			}
						else toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 
      });
  	}
	
	
}