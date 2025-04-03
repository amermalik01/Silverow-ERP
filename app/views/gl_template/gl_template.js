
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.gl-template', {
        url: '/gl-template',
        title: 'Gl Template',
        templateUrl: helper.basepath('gl_template/gl_template.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.add-gl-template', {
        url: '/gl-template/add',
        title: 'Add Gl Template ',
          templateUrl: helper.basepath('gl_template/_form.html'),
		controller: 'GlTemplateEditController'
    }) 
	  .state('app.edit-gl-template', {
		url: '/gl-template/:id/edit',
        title: 'Edit Gl Template ',
          templateUrl: helper.basepath('gl_template/_form.html'),
		controller: 'GlTemplateEditController'
	  })
  
  
 }]);
GlTemplateController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster","$rootScope"];
myApp.controller('GlTemplateController', GlTemplateController);
myApp.controller('GlTemplateEditController', GlTemplateEditController);

function GlTemplateController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster,$rootScope) {
    'use strict';

	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		{'name':'Setup','url':'app.setup','isActive':false, 'tabIndex':'1'},
		{'name':'Finance','url':'app.setup','isActive':false, 'tabIndex':'2'}, 
		{'name':'General Journal Template','url':'#','isActive':false}];
		 
 	var vm = this;
 
	var Api = $rootScope.gl + "chart-accounts/get-template-gl-list";
    var postData = {  'token': $scope.$root.token 	};

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
		 var delUrl = $scope.$root.gl +"chart-accounts/delete-template-gl";
		 
	
	    ngDialog.openConfirm({
	      template: 'modalDeleteDialogId',
	      className: 'ngdialog-theme-default-custom'
	    }).then(function (value) {
	      $http
			  .post(delUrl, {id:id,'token': $scope.$root.token })
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

function GlTemplateEditController($scope, $stateParams, $http, $state, $resource,toaster,$rootScope,$timeout){

	$scope.formTitle = 'Gl Template';
	 $scope.btnCancelUrl = 'app.gl-template';
	 $scope.hideDel = false; 
	
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'app.setup','isActive':false, 'tabIndex':'1'},
		 {'name':'Finance','url':'app.setup','isActive':false, 'tabIndex':'2'}, 
		 {'name':'General Journal Template','url':'app.gl-template','isActive':false}];
		//  {'name':'ADD','url':'#','isActive':false}];	
	
	 if($stateParams.id!==undefined)	 {
			 	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'app.setup','isActive':false, 'tabIndex':'1'},
		 {'name':'Finance','url':'app.setup','isActive':false, 'tabIndex':'2'},
		 {'name':'General Journal Template','url':'app.gl-template','isActive':false}];
		//  {'name':'Edit','url':'#','isActive':false}];	
	
		 }

 	$scope.rec = {};
    // $scope.formUrl = function() {return "app/views/gl_template/_from.html"; }
		  
	 $scope.status = {};
	 $scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	
	 if($stateParams.id!==undefined)	 {	
	 	var postUrl = $scope.$root.gl +"chart-accounts/get-template-gl-by-id";
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
	
	rec.token = $scope.$root.token;
	rec.statuss = $scope.rec.status  !== undefined ? $scope.rec.status.value:0;
	
	 var updateUrl = $scope.$root.gl +"chart-accounts/add-template-gl";
	  if($stateParams.id!==undefined) 	var updateUrl = $scope.$root.gl +"chart-accounts/update-template-gl";
	  
		 $http
	      .post(updateUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
				toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 $timeout(function(){ $state.go('app.gl-template'); }, 3000);
			}
						else toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 
      });
  	}
	
	
}