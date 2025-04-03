
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.supplier-status', {
        url: '/supplier-status',
        title: 'Supplier Status',
        templateUrl: helper.basepath('supplier_status/supplier_status.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.add-supplier-status', {
        url: '/supplier-status/add',
        title: 'Add Supplier Status ',
        templateUrl: helper.basepath('edit.html'),
		controller: 'SupplierStatusEditController'
    }) 
	  .state('app.edit-supplier-status', {
		url: '/supplier-status/:id/edit',
        title: 'Edit Supplier Status ',
        templateUrl: helper.basepath('edit.html'),
		controller: 'SupplierStatusEditController'
	  })
  
  
 }]);
SupplierStatusController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster","$rootScope"];
myApp.controller('SupplierStatusController', SupplierStatusController);
myApp.controller('SupplierStatusEditController', SupplierStatusEditController);

function SupplierStatusController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster,$rootScope) {
    'use strict';

	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Supplier Status','url':'#','isActive':false}];
		 
 	var vm = this;
  //  var Api = $scope.$root.sales+"crm/crm/all-status";
	var Api = $rootScope.setup + "general/all-status-list";
    var postData = {
	    'token': $scope.$root.token,
	    'all': "1",
		'tbl':  $rootScope.base64_encode('supplier_status') ,
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
    	//var delUrl = $scope.$root.sales+"crm/crm/delete-supplier-status";
		 var delUrl = $scope.$root.setup +"general/delete-status";
		 
	
	    ngDialog.openConfirm({
	      template: 'modalDeleteDialogId',
	      className: 'ngdialog-theme-default-custom'
	    }).then(function (value) {
	      $http
			  .post(delUrl, {id:id,'token': $scope.$root.token,'tbl':$rootScope.base64_encode('supplier_status')})
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

function SupplierStatusEditController($scope, $stateParams, $http, $state, $resource,toaster,$rootScope,$timeout){

	$scope.formTitle = 'Supplier Status';
	 $scope.btnCancelUrl = 'app.supplier-status';
	 $scope.hideDel = false; 
	
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Supplier Status','url':'app.supplier-status','isActive':false},
		 {'name':'ADd','url':'#','isActive':false}];	
	
	 if($stateParams.id!==undefined)	 {
			 	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Supplier Status','url':'app.supplier-status','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];	
	
			 
		 }

 	$scope.rec = {};
 	$scope.predefine_types = {};
	
     $scope.formUrl = function() {return "app/views/supplier_status/_form.html"; }
		  
	 $scope.status = {};
	 $scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	
	 if($stateParams.id!==undefined)	 {	
	 	var postUrl = $scope.$root.sales+"crm/crm/get-supplier-status";
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
	
	rec.tbl = $rootScope.base64_encode('supplier_status');
	rec.token = $scope.$root.token;
	
	rec.statuss = $scope.rec.status  !== undefined ? $scope.rec.status.value:0;
	
	 var updateUrl = $scope.$root.setup +"general/add-status";
	  if($stateParams.id!==undefined) 	var updateUrl = $scope.$root.setup +"general/update-status";
	 
	// var updateUrl = $scope.$root.sales+"crm/crm/add-supplier-status";
	// if($stateParams.id!==undefined) 	var updateUrl = $scope.$root.sales+"crm/crm/update-supplier-status";
	 
		 $http
	      .post(updateUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
				toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 $timeout(function(){ $state.go('app.supplier-status'); }, 3000);
			}
						else toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 
      });
  	}
	
	
}