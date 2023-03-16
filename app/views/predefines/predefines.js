PredefinesController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.predefines', {
        url: '/predefines',
        title: 'Predefines',
        templateUrl: helper.basepath('predefines/predefines.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.add-predefine', {
        url: '/predefines/add',
        title: 'Add Predefine ',
        templateUrl: helper.basepath('add.html'),
		controller: 'PredefinesAddController'
    })
	.state('app.view-predefine', {
		url: '/predefines/:id/view',
        title: 'View Predefine ',
        templateUrl: helper.basepath('view.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'PredefinesViewController'
	  })
	  .state('app.edit-predefine', {
		url: '/predefines/:id/edit',
        title: 'Edit Predefine ',
        templateUrl: helper.basepath('edit.html'),
		controller: 'PredefinesEditController'
	  })
  
 }]);

myApp.controller('PredefinesController', PredefinesController);
myApp.controller('PredefinesAddController', PredefinesAddController);
myApp.controller('PredefinesViewController', PredefinesViewController);
myApp.controller('PredefinesEditController', PredefinesEditController);

function PredefinesController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster) {
    'use strict';

	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Ledger Group','url':'#','isActive':false},
		 {'name':'Predefines','url':'#','isActive':false}];
		 
 	var vm = this;
    var Api = $scope.$root.setup+"ledger-group/predefines";
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
 			//$scope.checkData = ngDataService.getData( $defer, params, Api,$filter,$scope,postData);
			ngDataService.getDataCustom( $defer, params, Api,$filter,$scope,postData);
        }
    });



    $scope.delete = function (id,rec,arr_data) {
    	var delUrl = $scope.$root.setup+"ledger-group/delete-predefine";
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

function PredefinesAddController($scope, $stateParams, $http, $state,toaster,$timeout){
	
	 $scope.formTitle = 'Predefine';
	 $scope.btnCancelUrl = 'app.predefines';
	 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex':'1'},
         {'name': 'Purchase & SRM', 'url': 'app.setup', 'isActive': false, 'tabIndex':'4'},
		 {'name':'Coverage Areas','url':'app.predefines','isActive':false},
		 {'name':'Add','url':'#','isActive':false}];

	$scope.formUrl = function() {
		return "app/views/predefines/_form.html";
	  }
	  
	$scope.rec = {};
	$scope.predefine_types = {};
	var postUrl = $scope.$root.setup+"ledger-group/add-predefine";
	var typeUrl = $scope.$root.setup+"ledger-group/get-predefine-types";

	$http
      .post(typeUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true)
				$scope.predefine_types = res.data.response;
			else
				toaster.pop('error', 'Error', "No Predefine Type is found!");
      });


	 $scope.add = function(rec){
	 rec.token = $scope.$root.token;
	 rec.type = $scope.rec.predefine_type != undefined ? $scope.rec.predefine_type.value:0;
	 $http
      .post(postUrl, rec)
      .then(function (res) {
        	if(res.data.ack == true){
				 toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
				 $timeout(function(){ $state.go('app.predefines'); }, 3000);
			}
			else
				toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(104));
      });
  	}
}

function PredefinesViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster,$timeout){
	$scope.formTitle = 'Predefine';
	 $scope.btnCancelUrl = 'app.predefines';
	 $scope.hideDel = false; 
	 $scope.showLoader = true;
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Supplier','url':'#','isActive':false},
		 {'name':'Ledger Group','url':'app.predefines','isActive':false}];
		 
	
		
	$scope.gotoEdit = function(){
	  $state.go("app.edit-predefine",{id:$stateParams.id});
	};
	
		 
  	$scope.rec = {};
  	$scope.predefine_types = {};
	var postUrl = $scope.$root.setup+"ledger-group/get-predefine";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id };
	var typeUrl = $scope.$root.setup+"ledger-group/get-predefine-types";

	$http
      .post(typeUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true)
				$scope.predefine_types = res.data.response;
			else
				toaster.pop('error', 'Error', "No Predefine Type is found!");
      });

 	$timeout(function(){
		$http
	      .post(postUrl, postData)
	      .then(function (res) {
	      	$scope.rec = res.data.response;
	      	$.each($scope.predefine_types,function(index,obj){
				if(obj.value == res.data.response.type){
					$scope.rec.predefine_type = $scope.predefine_types[index]; 
				}
			});
	      });
		$scope.formUrl = function() {
			return "app/views/predefines/_form.html";
		  }	
		  $scope.showLoader = false;
	},3000); 
	
 	
	
};

function PredefinesEditController($scope, $stateParams, $http, $state, $resource,toaster,$timeout){

	$scope.formTitle = 'Predefines';
	 $scope.btnCancelUrl = 'app.predefines';
	 $scope.hideDel = false; 
	 $scope.showLoader = true; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Ledger Group','url':'#','isActive':false},
		 {'name':'Predefines','url':'app.predefines','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];	
	
	

 	$scope.rec = {};
 	$scope.predefine_types = {};
	var postUrl = $scope.$root.setup+"ledger-group/get-predefine";
	var updateUrl = $scope.$root.setup+"ledger-group/update-predefine";
	var typeUrl = $scope.$root.setup+"ledger-group/get-predefine-types";

	var postData = {'token': $scope.$root.token,'id': $stateParams.id };
	$http
      .post(typeUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true)
				$scope.predefine_types = res.data.response;
			else
				toaster.pop('error', 'Error', "No Predefine Type is found!");
      });


    $timeout(function(){
		$http
	      .post(postUrl, postData)
	      .then(function (res) {
	      	$scope.rec = res.data.response;
	      	$.each($scope.predefine_types,function(index,obj){
				if(obj.value == res.data.response.type){
					$scope.rec.predefine_type = $scope.predefine_types[index]; 
				}
			});
	      });
	      $scope.formUrl = function() {
			return "app/views/predefines/_form.html";
		  }
		  $scope.showLoader = false;
	},3000);
	
	$scope.update = function(rec){
	 	 rec.token = $scope.$root.token;
	 	 rec.type = $scope.rec.predefine_type != undefined ? $scope.rec.predefine_type.value:0;
		 $http
	      .post(updateUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
				toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 $timeout(function(){ $state.go('app.predefines'); }, 3000);
			}
			else{
							toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				$timeout(function(){ $state.go('app.predefines'); }, 3000);
			}
      });
  	}
	
}


