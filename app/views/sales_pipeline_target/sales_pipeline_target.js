SalesPipelineTargetController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.sales-pipeline-target', {
        url: '/sales-pipeline-target',
        title: 'Sales Pipeline Target',
        templateUrl: helper.basepath('sales_pipeline_target/sales_pipeline_target.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.add-sales-pipeline-target', {
        url: '/sales-pipeline-target/add',
        title: 'Add Sales Pipeline Target',
        templateUrl: helper.basepath('add.html'),
        resolve: helper.resolveFor('ngDialog'),
		controller: 'SalesPipelineTargetAddController'
    })
	.state('app.view-sales-pipeline-target', {
		url: '/sales-pipeline-target/:id/view',
        title: 'View ',
        templateUrl: helper.basepath('view.html'),
		resolve: helper.resolveFor('ngDialog'),
		controller: 'SalesPipelineTargetViewController'
	  })
	  .state('app.edit-sales-pipeline-target', {
		url: '/sales-pipeline-target/:id/edit',
        title: 'Edit Sales Pipeline Target',
        templateUrl: helper.basepath('edit.html'),
        resolve: helper.resolveFor('ngDialog'),
		controller: 'SalesPipelineTargetEditController'
	  })
  
 }]);

myApp.controller('SalesPipelineTargetController', SalesPipelineTargetController);
myApp.controller('SalesPipelineTargetAddController', SalesPipelineTargetAddController);
myApp.controller('SalesPipelineTargetViewController', SalesPipelineTargetViewController);
myApp.controller('SalesPipelineTargetEditController', SalesPipelineTargetEditController);

function SalesPipelineTargetController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster) {
    'use strict';

	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Sales Pipeline Target','url':'#','isActive':false}];
		 
 	var vm = this;
    var Api = $scope.$root.setup+"crm/sales-pipeline-targets";
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
 			$scope.checkData = ngDataService.getDataCustom( $defer, params, Api,$filter,$scope,postData);
        }
    });


    $scope.$data = {};
    $scope.delete = function (id,index,$data) {
    	var delUrl = $scope.$root.setup+"crm/delete-sales-pipeline-target";
	    ngDialog.openConfirm({
	      template: 'modalDeleteDialogId',
	      className: 'ngdialog-theme-default-custom'
	    }).then(function (value) {
	      $http
			  .post(delUrl, {id:id,'token': $scope.$root.token})
			  .then(function (res) {
					if(res.data.ack == true){
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						 $data.splice(index,1);
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

function SalesPipelineTargetAddController($scope, $stateParams, $http, $state,toaster,ngDialog,$rootScope,$timeout){

	 $scope.formTitle = 'Sales Pipeline Target';
	 $scope.btnCancelUrl = 'app.sales-pipeline-target';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Sales Pipeline Target','url':'app.sales-pipeline-target','isActive':false},
		 {'name':'Add','url':'#','isActive':false}];

	$scope.formUrl = function() {
		return "app/views/sales_pipeline_target/_form.html";
	  }
	  
	$scope.rec = {};
	$scope.record = {};
	
	var postUrl = $scope.$root.setup+"crm/add-sales-pipeline-target";
	var getEmpUrl = $scope.$root.hr+"employee/listings";


	 $scope.add = function(rec){
	 rec.token = $scope.$root.token;
	 //rec.year = $scope.rec.years != undefined?$scope.rec.years.id:0;
	 $http
      .post(postUrl, rec)
      .then(function (res) {
        	if(res.data.ack == true){
				 toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
				 $timeout(function(){ $state.go('app.sales-pipeline-target'); }, 3000);
			}
			else
				toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
      });
  	}


  	$scope.getSalesPerson = function(){
  		$scope.columns  =[];
		$http
	      .post(getEmpUrl,{'token':$scope.$root.token,'all':1})
	      .then(function (res) {
	      	angular.forEach(res.data.response[0],function(val,index){
                  $scope.columns.push({
                    'title':toTitleCase(index),
                    'field':index,
                    'visible':true
                  }); 
              });
			$scope.record = res.data.response;
	      });

		 ngDialog.openConfirm({
	      template: 'modalDialogId',
	      className: 'ngdialog-theme-default',
		  scope: $scope
	    }).then(function (result) {
			$.each(result,function(index,elem){
				if(index == 'first_name')						
					$scope.sales_person_name = elem;
				if(index == 'last_name')
				   $scope.sales_person_name = $scope.sales_person_name+' '+elem;

				$scope.rec.sales_person = result.id;

			});
			}, function (reason) {
	      console.log('Modal promise rejected. Reason: ', reason);
	    });
	}

	function toTitleCase(str){
        var title = str.replace('_',' ');
        return title.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    $scope.datePicker = {};

		$scope.datePicker = (function () {

	   var method = {};
	   method.instances = [];
	  	$scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
  		};
        $scope.toggleMin();
	    
	   method.open = function ($event, instance) {
		$event.preventDefault();
		$event.stopPropagation();
	  
		var old_instance = $rootScope.$storage.getItem('old_instance');
	  	if(old_instance != null)
	  		method.instances[old_instance] = false;

		method.instances[instance] = true;
		$rootScope.$storage.setItem('old_instance',instance);
	   };
	  
	   method.options = {
		'show-weeks': false,
		startingDay: 0
	   };

	   method.format = $rootScope.dateFormats[$rootScope.defaultDateFormat];
	  
	   return method;
	  }());  
}

function SalesPipelineTargetViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster,$rootScope,$timeout){
	 $scope.formTitle = 'Sales Pipeline Target';
	 $scope.btnCancelUrl = 'app.sales-pipeline-target';
	 $scope.hideDel = false;
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Sales Pipeline Target','url':'app.sales-pipeline-target','isActive':false}];
		 
	$scope.formUrl = function() {
		return "app/views/sales_pipeline_target/_form.html";
	  }
		
	$scope.gotoEdit = function(){
	  $state.go("app.edit-sales-pipeline-target",{id:$stateParams.id});
	};
	
		 
  	$scope.rec = {};
	var postUrl = $scope.$root.setup+"crm/get-sales-pipeline-target";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id };

	$http
      .post(postUrl, postData)
      .then(function (res) {
      	$scope.rec = res.data.response;
      	//$scope.sales_person_name = res.data.response.salesperson_name;
      	/*angular.forEach($scope.$root.arr_years,function(obj,index){
      		if(obj.id == res.data.response.year){
      			$scope.rec.years = $scope.$root.arr_years[index];
      		}
      	});*/

      });
		 
	$scope.datePicker = {};

		$scope.datePicker = (function () {

	   var method = {};
	   method.instances = [];
	  	$scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
  		};
        $scope.toggleMin();
	    
	   method.open = function ($event, instance) {
		$event.preventDefault();
		$event.stopPropagation();
	  
		var old_instance = $rootScope.$storage.getItem('old_instance');
	  	if(old_instance != null)
	  		method.instances[old_instance] = false;

		method.instances[instance] = true;
		$rootScope.$storage.setItem('old_instance',instance);
	   };
	  
	   method.options = {
		'show-weeks': false,
		startingDay: 0
	   };

	   method.format = $rootScope.dateFormats[$rootScope.defaultDateFormat];
	  
	   return method;
	  }());  
 	
	
};

function SalesPipelineTargetEditController($scope, $stateParams, $http, $state, $resource,toaster,ngDialog,$rootScope,$timeout){

	$scope.formTitle = 'Sales Pipeline Target';
	 $scope.btnCancelUrl = 'app.sales-pipeline-target';
	 $scope.hideDel = false; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'Sales Pipeline Target','url':'app.sales-pipeline-target','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];	
	
	$scope.formUrl = function() {
		return "app/views/sales_pipeline_target/_form.html";
	  }

 	$scope.rec = {};
	var postUrl = $scope.$root.setup+"crm/get-sales-pipeline-target";
	var updateUrl = $scope.$root.setup+"crm/update-sales-pipeline-target";
	var getEmpUrl = $scope.$root.hr+"employee/listings";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id};

	$http
      .post(postUrl, postData)
      .then(function (res) {
      	$scope.rec = res.data.response;
      	/*$scope.sales_person_name = res.data.response.salesperson_name;
      	angular.forEach($scope.$root.arr_years,function(obj,index){
      		if(obj.id == res.data.response.year){
      			$scope.rec.years = $scope.$root.arr_years[index];
      		}
      	});*/

      });

	
	$scope.update = function(rec){
	 	 rec.token = $scope.$root.token;
	 	 //rec.year = $scope.rec.years != undefined?$scope.rec.years.id:0;
		 $http
	      .post(updateUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
				toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 $timeout(function(){ $state.go('app.sales-pipeline-target'); }, 3000);
			}
			else
				toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
      });
  	}


  	$scope.getSalesPerson = function(){
  		$scope.columns  = [];
		$http
	      .post(getEmpUrl,{'token':$scope.$root.token,'all':1})
	      .then(function (res) {
	      	angular.forEach(res.data.response[0],function(val,index){
                  $scope.columns.push({
                    'title':toTitleCase(index),
                    'field':index,
                    'visible':true
                  }); 
              });
			$scope.record = res.data.response;
	      });

		 ngDialog.openConfirm({
	      template: 'modalDialogId',
	      className: 'ngdialog-theme-default',
		  scope: $scope
	    }).then(function (result) {
			$.each(result,function(index,elem){
				if(index == 'first_name')						
					$scope.sales_person_name = elem;
				if(index == 'last_name')
				   $scope.sales_person_name = $scope.sales_person_name+' '+elem;

				$scope.rec.sales_person = result.id;

			});
			}, function (reason) {
	      console.log('Modal promise rejected. Reason: ', reason);
	    });
	}

	function toTitleCase(str){
        var title = str.replace('_',' ');
        return title.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    $scope.datePicker = {};

		$scope.datePicker = (function () {

	   var method = {};
	   method.instances = [];
	  	$scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
  		};
        $scope.toggleMin();
	    
	   method.open = function ($event, instance) {
		$event.preventDefault();
		$event.stopPropagation();
	  
		var old_instance = $rootScope.$storage.getItem('old_instance');
	  	if(old_instance != null)
	  		method.instances[old_instance] = false;

		method.instances[instance] = true;
		$rootScope.$storage.setItem('old_instance',instance);
	   };
	  
	   method.options = {
		'show-weeks': false,
		startingDay: 0
	   };

	   method.format = $rootScope.dateFormats[$rootScope.defaultDateFormat];
	  
	   return method;
	  }());  
	
}


