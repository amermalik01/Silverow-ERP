CrmTabsController.$inject = ["$state","$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.crm-tabs', {
        url: '/crm-tabs',
        title: 'CRM Tabs',
        templateUrl: helper.basepath('crm_tabs/crm_tabs.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.add-crm-tabs', {
        url: '/crm-tabs/add',
        title: 'Add CRM Tabs',
        templateUrl: helper.basepath('add.html'),
		controller: 'CrmTabsAddController'
    })
	.state('app.view-crm-tabs', {
		url: '/crm-tabs/:id/view',
        title: 'View ',
        templateUrl: helper.basepath('view.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'CrmTabsViewController'
	  })
	  .state('app.edit-crm-tabs', {
		url: '/crm-tabs/:id/edit',
        title: 'Edit CRM Tabs',
        templateUrl: helper.basepath('edit.html'),
		controller: 'CrmTabsEditController'
	  })
  
 }]);

myApp.controller('CrmTabsController', CrmTabsController);
myApp.controller('CrmTabsAddController', CrmTabsAddController);
myApp.controller('CrmTabsViewController', CrmTabsViewController);
myApp.controller('CrmTabsEditController', CrmTabsEditController);

function CrmTabsController($state,$scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster) {
    'use strict';

	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'CRM Tabs','url':'#','isActive':false}];
		 
    var Api = $scope.$root.setup+"crm/crm-tabs";
    var postData = {
	    'token': $scope.$root.token,
	    'all': "1"
  	};

  	$scope.data = {};
    $scope.columns  =[];
	$http
      .post(Api,postData)
      .then(function (res) {
      	angular.forEach(res.data.response[0],function(val,index){
              $scope.columns.push({
                'title':toTitleCase(index),
                'field':index,
                'visible':true
              }); 
          });
		$scope.data = res.data.response;
      });

     var move = function (origin, destination) {
        var temp = $scope.data[destination];
        $scope.data[destination] = $scope.data[origin];
        $scope.data[origin] = temp;

        var sortUrl = $scope.$root.setup+"crm/sort-tab";
   	    $http
		  .post(sortUrl, {'record':$scope.data, 'token':$scope.$root.token})
		  .then(function (res) {			  
		  });
	};

	$scope.moveUp = function(index){			
			move(index, index - 1);
	};

	$scope.moveDown = function(index){					
			move(index, index + 1);
	};

     $scope.delete = function (id,index,data) {
    	var delUrl = $scope.$root.setup+"crm/delete-crm-tab";
	    ngDialog.openConfirm({
	      template: 'modalDeleteDialogId',
	      className: 'ngdialog-theme-default-custom'
	    }).then(function (value) {
	      $http
			  .post(delUrl, {id:id,'token': $scope.$root.token})
			  .then(function (res) {
					if(res.data.ack == true){
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						 data.splice(index,1);
					}
					else{
						toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
					}
			  });
	    }, function (reason) {
	      console.log('Modal promise rejected. Reason: ', reason);
		});
	
	};

	function toTitleCase(str){
        var title = str.replace('_',' ');
        return title.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

}

function CrmTabsAddController($scope, $stateParams, $http, $state,toaster){

	 $scope.formTitle = 'CRM Tabs';
	 $scope.btnCancelUrl = 'app.crm-tabs';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'CRM Tabs','url':'app.crm-tabs','isActive':false},
		 {'name':'Add','url':'#','isActive':false}];

	$scope.formUrl = function() {
		return "app/views/crm_tabs/_form.html";
	  }

	var moduleUrl = $scope.$root.setup+"general/modules-codes";
	$http
      .post(moduleUrl, {'token':$scope.$root.token,'all':1})
      .then(function (res) {
        	if(res.data.ack == true){
				$scope.arr_modules = res.data.response;
			}
    });

	$scope.is_defaults = 0;
    $scope.setDefault = function(value){
    	$scope.is_defaults = value;
    }  
	$scope.rec = {};
	var postUrl = $scope.$root.setup+"crm/add-crm-tab";
    $scope.add = function(rec){
	 	 rec.status = $scope.rec.tab_status != undefined? $scope.rec.tab_status.value:1;
	 	 rec.module_id = $scope.rec.tab_module_id != undefined? $scope.rec.tab_module_id.id:0
		 rec.token = $scope.$root.token;
		 rec.is_defaults = $scope.is_defaults;

		 $http
	      .post(postUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
	        		$scope.is_defaults = 0;
					 toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					 $timeout(function(){ $state.go('app.crm-tabs'); }, 3000);
				}
				else
					toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
	      });
  	}
}

function CrmTabsViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster){
	 $scope.formTitle = 'CRM Tabs';
	 $scope.btnCancelUrl = 'app.crm-tabs';
	 $scope.hideDel = false;
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'CRM Tabs','url':'app.crm-tabs','isActive':false}];
		 
	$scope.formUrl = function() {
		return "app/views/crm_tabs/_form.html";
	  }
		
	$scope.gotoEdit = function(){
	  $state.go("app.edit-crm-tabs",{id:$stateParams.id});
	};
	
		 
  	$scope.rec = {};
	var postUrl = $scope.$root.setup+"crm/get-crm-tab";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id };

	var moduleUrl = $scope.$root.setup+"general/modules-codes";
	$http
      .post(moduleUrl, {'token':$scope.$root.token,'all':1})
      .then(function (res) {
        	if(res.data.ack == true){
				$scope.arr_modules = res.data.response;
			}
    });

	$http
      .post(postUrl, postData)
      .then(function (res) {
      	$scope.rec = res.data.response;
      	$scope.is_defaults = res.data.response.is_default;
      	angular.forEach($scope.$root.arr_status,function(obj,index){
      		if(obj.value == res.data.response.status){$scope.rec.tab_status = obj};
      	});
      	angular.forEach($scope.arr_modules,function(obj,index){
      		if(obj.id == res.data.response.module_id){$scope.rec.tab_module_id = obj};
      	});
      });
		 
	
 	
	
};

function CrmTabsEditController($scope, $stateParams, $http, $state, $resource,toaster){

	$scope.formTitle = 'CRM Tabs';
	 $scope.btnCancelUrl = 'app.crm-tabs';
	 $scope.hideDel = false; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'CRM Tabs','url':'app.crm-tabs','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];	
	
	$scope.formUrl = function() {
		return "app/views/crm_tabs/_form.html";
	  }

 	$scope.rec = {};
	var postUrl = $scope.$root.setup+"crm/get-crm-tab";
	var updateUrl = $scope.$root.setup+"crm/update-crm-tab";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id};

	var moduleUrl = $scope.$root.setup+"general/modules-codes";
	$http
      .post(moduleUrl, {'token':$scope.$root.token,'all':1})
      .then(function (res) {
        	if(res.data.ack == true){
				$scope.arr_modules = res.data.response;
			}
    });
      
    $scope.is_defaults = 0;
	$http
      .post(postUrl, postData)
      .then(function (res) {
      	$scope.rec = res.data.response;
      	$scope.is_defaults = res.data.response.is_default;
      	angular.forEach($scope.$root.arr_status,function(obj,index){
      		if(obj.value == res.data.response.status){$scope.rec.tab_status = obj};
      	});
      	angular.forEach($scope.arr_modules,function(obj,index){
      		if(obj.id == res.data.response.module_id){$scope.rec.tab_module_id = obj};
      	});
      });

    $scope.setDefault = function(value){
    	$scope.is_defaults = value;
    }  
	
	$scope.update = function(rec){
		 rec.status = $scope.rec.tab_status != undefined? $scope.rec.tab_status.value:1;
		 rec.module_id = $scope.rec.tab_module_id != undefined? $scope.rec.tab_module_id.id:0
	 	 rec.token = $scope.$root.token;
	 	 rec.is_defaults = $scope.is_defaults;
		 $http
	      .post(updateUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
				toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 $timeout(function(){ $state.go('app.crm-tabs'); }, 3000);
			}
			else
				toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
      });
  	}
	
}


