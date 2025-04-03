RebateVolumeController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.rebate-volume', {
        url: '/rebate-volume',
        title: 'rebate-volume',
        templateUrl: helper.basepath('rebate_volume/rebate_volume.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.add-rebate-volume', {
        url: '/rebate-volume/add',
        title: 'Add Rebate Volume ',
        templateUrl: helper.basepath('add.html'),
		controller: 'RebateVolumeAddController'
    })
	.state('app.view-rebate-volume', {
		url: '/rebate-volume/:id/view',
        title: 'View Rebate Volume ',
        templateUrl: helper.basepath('view.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'RebateVolumeViewController'
	  })
	  .state('app.edit-rebate-volume', {
		url: '/rebate-volume/:id/edit',
        title: 'Edit Rebate Volume ',
        templateUrl: helper.basepath('edit.html'),
		controller: 'RebateVolumeEditController'
	  })
  
 }]);

myApp.controller('RebateVolumeController', RebateVolumeController);
myApp.controller('RebateVolumeAddController', RebateVolumeAddController);
myApp.controller('RebateVolumeViewController', RebateVolumeViewController);
myApp.controller('RebateVolumeEditController', RebateVolumeEditController);

function RebateVolumeController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster) {
    'use strict';

	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Rebate Volume','url':'#','isActive':false}];
		 
 	/*var vm = this;
    var Api = $scope.$root.sales+"crm/crm/rebate-volumes";
    var postData = {
	    'token': $scope.$root.token,
	    'all': "1"
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
 			 $scope.checkData = ngDataService.getData( $defer, params, Api,$filter,$scope,postData); 
        }
    });*/



  var vm = this;
	
	// For one time fetching data	
    //var Api = $resource('api/company/get_listing/:module_id/:module_table');

	// On Filter Dropdown change	 
   var Api = $scope.$root.sales+"crm/crm/rebate-volumes";
	
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
	
	//$scope.reload();
	
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
    	var delUrl = $scope.$root.sales+"crm/crm/delete-rebate-volume";
	    ngDialog.openConfirm({
	      template: 'modalDeleteDialogId',
	      className: 'ngdialog-theme-default-custom'
	    }).then(function (value) {
	      $http
			  .post(delUrl, {id:id,'token': $scope.$root.token})
			  .then(function (res) {
					if(res.data.ack == true){
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
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

function RebateVolumeAddController($scope, $stateParams, $http, $state,toaster,$timeout){
	
	 $scope.formTitle = 'Rebate Volume';
	 $scope.btnCancelUrl = 'app.rebate-volume';
	 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Rebate Volume','url':'app.rebate-volume','isActive':false},
		 {'name':'Add','url':'#','isActive':false}];

	$scope.formUrl = function() {
		return "app/views/rebate_volume/_form.html";
	  }
	  
	$scope.rec = {};
	var postUrl = $scope.$root.sales+"crm/crm/add-rebate-volume";
	 $scope.add = function(rec){
	 rec.token = $scope.$root.token;
	 $http
      .post(postUrl, rec)
      .then(function (res) {
        	if(res.data.ack == true){
				 toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
				 $timeout(function(){ $state.go('app.rebate-volume'); }, 3000);
			}
			else
				toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(104));
      });
  	}
}

function RebateVolumeViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster,$timeout){
	$scope.formTitle = 'Rebate Volume';
	 $scope.btnCancelUrl = 'app.rebate-volume';
	 $scope.hideDel = false; 
	 $scope.showLoader = true;
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Rebate Volume','url':'app.rebate-volume','isActive':false}];
		 
	
		
	$scope.gotoEdit = function(){
	  $state.go("app.edit-rebate-volume",{id:$stateParams.id});
	};
	
		 
  	$scope.rec = {};
	var postUrl = $scope.$root.sales+"crm/crm/get-rebate-volume";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id };

 	$timeout(function(){
		$http
	      .post(postUrl, postData)
	      .then(function (res) {
	      	$scope.rec = res.data.response;
	      });
		$scope.formUrl = function() {
			return "app/views/rebate_volume/_form.html";
		  }	
		  $scope.showLoader = false;
	},3000); 
	
 	
	
};

function RebateVolumeEditController($scope, $stateParams, $http, $state, $resource,toaster,$timeout){

	$scope.formTitle = 'Rebate Volume';
	 $scope.btnCancelUrl = 'app.rebate-volume';
	 $scope.hideDel = false; 
	 $scope.showLoader = true; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Rebate Volume','url':'app.rebate-volume','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];	
	
	

 	$scope.rec = {};
	var postUrl = $scope.$root.sales+"crm/crm/get-rebate-volume";
	var updateUrl = $scope.$root.sales+"crm/crm/update-rebate-volume";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id };


    $timeout(function(){
		$http
	      .post(postUrl, postData)
	      .then(function (res) {
	      	$scope.rec = res.data.response;
	      });
	      $scope.formUrl = function() {
			return "app/views/rebate_volume/_form.html";
		  }
		  $scope.showLoader = false;
	},3000);
	
	$scope.update = function(rec){
	 	 rec.token = $scope.$root.token;
		 $http
	      .post(updateUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
				toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 $timeout(function(){ $state.go('app.rebate-volume'); }, 3000);
			}
			else{
							toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				$timeout(function(){ $state.go('app.rebate-volume'); }, 3000);
			}
      });
  	}
	
}


