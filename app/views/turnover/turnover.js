TurnoverController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.turnover', {
        url: '/turnover',
        title: 'Turnover',
        templateUrl: helper.basepath('turnover/turnover.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.add-turnover', {
        url: '/turnover/add',
        title: 'Add Customer Status ',
        templateUrl: helper.basepath('add.html'),
		controller: 'TurnoverAddController'
    })
	.state('app.view-turnover', {
		url: '/turnover/:id/view',
        title: 'View Customer Status',
        templateUrl: helper.basepath('view.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'TurnoverViewController'
	  })
	  .state('app.edit-turnover', {
		url: '/turnover/:id/edit',
        title: 'Edit Customer Status ',
        templateUrl: helper.basepath('edit.html'),
		controller: 'TurnoverEditController'
	  })
  
 }]);

myApp.controller('TurnoverController', TurnoverController);
myApp.controller('TurnoverAddController', TurnoverAddController);
myApp.controller('TurnoverViewController', TurnoverViewController);
myApp.controller('TurnoverEditController', TurnoverEditController);

function TurnoverController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster) {
    'use strict';

	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex':'1'},
         {'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex':'3'},
		 {'name':'Turnover','url':'#','isActive':false}];
		 
 	var vm = this;
    var Api = $scope.$root.setup+"ledger-group/predefines";
    var postData = {
	    'token': $scope.$root.token,
	    'all': "1",
	    'column':'type',
	    'value':'TURNOVER'
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
 
			
			//$scope.checkData = ngDataService.getData( $defer, params, Api,$filter,$scope,postData);
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

function TurnoverAddController($scope, $stateParams, $http, $state,toaster,$timeout){
	
	 $scope.formTitle = 'Turnover';
	 $scope.btnCancelUrl = 'app.turnover';
	 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex':'1'},
         {'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex':'3'},
		 {'name':'Turnover','url':'app.turnover','isActive':false},
		 {'name':'Add','url':'#','isActive':false}];

	$scope.formUrl = function() {
		return "app/views/turnover/_form.html";
	  }
	  
	$scope.rec = {};
	$scope.predefine_types = {};
	var postUrl = $scope.$root.setup+"ledger-group/add-predefine";
	
	 $scope.add = function(rec){
	 rec.token = $scope.$root.token;
	 rec.type = 'TURNOVER';
	 $http
      .post(postUrl, rec)
      .then(function (res) {
        	if(res.data.ack == true){
				 toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
				 $timeout(function(){ $state.go('app.turnover'); }, 3000);
			}
			else
				toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
      });
  	}
}

function TurnoverViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster,$timeout){
	$scope.formTitle = 'Turnover';
	 $scope.btnCancelUrl = 'app.turnover';
	 $scope.hideDel = false; 
	 $scope.showLoader = true;
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex':'1'},
         {'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex':'3'},
		 {'name':'Turnover','url':'app.turnover','isActive':false}];
		 
	
		
	$scope.gotoEdit = function(){
	  $state.go("app.edit-turnover",{id:$stateParams.id});
	};
	
		 
  	$scope.rec = {};
  	$scope.predefine_types = {};
	var postUrl = $scope.$root.setup+"ledger-group/get-predefine";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id };
	
 	$timeout(function(){
		$http
	      .post(postUrl, postData)
	      .then(function (res) {
	      	$scope.rec = res.data.response;
	      });
		$scope.formUrl = function() {
			return "app/views/turnover/_form.html";
		  }	
		  $scope.showLoader = false;
	},3000); 
	
 	
	
};

function TurnoverEditController($scope, $stateParams, $http, $state, $resource,toaster,$timeout){

	$scope.formTitle = 'Turnover';
	 $scope.btnCancelUrl = 'app.turnover';
	 $scope.hideDel = false; 
	 $scope.showLoader = true; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex':'1'},
         {'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex':'3'},
		 {'name':'Turnover','url':'app.turnover','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];	
	
	

 	$scope.rec = {};
 	$scope.predefine_types = {};
	var postUrl = $scope.$root.setup+"ledger-group/get-predefine";
	var updateUrl = $scope.$root.setup+"ledger-group/update-predefine";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id };

    $timeout(function(){
		$http
	      .post(postUrl, postData)
	      .then(function (res) {
	      	$scope.rec = res.data.response;
	      });
	      $scope.formUrl = function() {
			return "app/views/turnover/_form.html";
		  }
		  $scope.showLoader = false;
	},3000);
	
	$scope.update = function(rec){
	 	 rec.token = $scope.$root.token;
	 	 rec.type = 'TURNOVER';
		 $http
	      .post(updateUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
				toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 $timeout(function(){ $state.go('app.turnover'); }, 3000);
			}
			else{
							toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				$timeout(function(){ $state.go('app.turnover'); }, 3000);
			}
      });
  	}
	
}


