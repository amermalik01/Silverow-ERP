CurrencyController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.currency', {
        url: '/currency',
        title: 'Currency',
        templateUrl: helper.basepath('currency/currency.html'),
        resolve: helper.resolveFor('ngTable')
    })
	.state('app.addcurrency', {
        url: '/currency/add',
        title: 'Add Currency ',
        templateUrl: helper.basepath('add.html'),
		controller: 'CurrencyAddController'
    })
	.state('app.viewcurrency', {
		url: '/currency/:id/view',
        title: 'View Currency ',
        templateUrl: helper.basepath('view.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'CurrencyViewController'
	  })
	  .state('app.editcurrency', {
		url: '/currency/:id/edit',
        title: 'Edit Currency ',
        templateUrl: helper.basepath('edit.html'),
		controller: 'CurrencyEditController'
	  })
	  .state('app.conversion-rate', {
		url: '/currency/:id/conversion-rate',
        title: 'Currency Conversion Rate ',
        templateUrl: helper.basepath('edit.html'),
		controller: 'ConversionRateController'
	  })
  
 }]);

myApp.controller('CurrencyController', CurrencyController);
myApp.controller('CurrencyAddController', CurrencyAddController);
myApp.controller('CurrencyViewController', CurrencyViewController);
myApp.controller('CurrencyEditController', CurrencyEditController);
myApp.controller('ConversionRateController', ConversionRateController);

function CurrencyController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http) {
    'use strict';
	
    // required for inner references
	$scope.class = 'inline_block'; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'General','url':'#','isActive':false},
		 {'name':'Currency','url':'#','isActive':false}];

  		 
    var vm = this;
    var Api = $scope.$root.setup+"general/currencies";
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
 			ngDataService.getData( $defer, params, Api,$filter,$scope,postData);
        }
    });

}

function CurrencyAddController($scope, $stateParams, $http, $state,toaster){
	$scope.formTitle = 'Currency';
	$scope.btnCancelUrl = 'app.currency';  
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'General','url':'#','isActive':false},
		 {'name':'Currency','url':'app.currency','isActive':false},
		 {'name':'Add','url':'#','isActive':false}];

	$scope.formUrl = function() {
		return "app/views/currency/_form.html";
	  }


	  
	$scope.rec = {};
	var postUrl = $scope.$root.setup+"general/add-currency";
	var checkCurrency = $scope.$root.setup+"general/get-currency-by-code";

	$scope.add = function(rec){
	 rec.company_id = 1;
	 rec.token = $scope.$root.token;
	 			 
	 $http
      .post(checkCurrency, {'token':$scope.$root.token,'code':rec.code})
      .then(function (rese) {
      	if(rese.data.ack == true){
        	$http
		      .post(postUrl, rec)
		      .then(function (res) {
		        	if(res.data.ack == true){
						 toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(102));
						 $timeout(function(){ $state.go('app.currency'); }, 3000);
					}
					else
						toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
		      });
		  }
		  else
			toaster.pop('error', 'Info', 'Currency already exist against this code"!');
      });
  }
}

function CurrencyViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster){
	$scope.formTitle = 'Currency';
	$scope.btnCancelUrl = 'app.currency'; 
	$scope.showLoader = true; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'General','url':'#','isActive':false},
		 {'name':'Currency','url':'app.currency','isActive':false}];

		 
	
		
	$scope.gotoEdit = function(){
	  $state.go("app.editcurrency",{id:$stateParams.id});
	};

	$scope.actionUrl = function() {
		return "app/views/currency/_action.html";
	}
	

		 
  	$scope.rec = {};
	var postUrl = $scope.$root.setup+"general/get-currency";
	var delUrl = $scope.$root.setup+"general/delete-currency";
	var historyUrl = $scope.$root.setup+"general/conversion-rate-history";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id };

	$http
      .post(postUrl, postData)
      .then(function (res) {
      	$scope.rec = res.data.response;
      	$scope.formUrl = function() {
			return "app/views/currency/_form.html";
		}
		$scope.showLoader = false; 
      });


	//Currency Conversion Rate History
    $scope.histData = {};
    $scope.title = "Currency Exchange Rate History";
    $scope.history = function () {
		$http
	      .post(historyUrl, postData)
	      .then(function (res) {
	      	$scope.histData = res.data.response;
	      });
	    ngDialog.openConfirm({
	      template: 'historyDialogId',
	      className: 'ngdialog-theme-default',
	      scope:$scope
	    })
	
	};
	 
	//Delete Currency
 	$scope.delete = function () {
	    ngDialog.openConfirm({
	      template: 'modalDeleteDialogId',
	      className: 'ngdialog-theme-default-custom'
	    }).then(function (value) {
	      $http
			  .post(delUrl, postData)
			  .then(function (res) {
					if(res.data.ack == true){
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
						 $timeout(function(){ $state.go('app.currency'); }, 3000);
					}
					else{
						toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
						 $timeout(function(){ $state.go('app.currency'); }, 3000);
					}
			  });
	    }, function (reason) {
	      console.log('Modal promise rejected. Reason: ', reason);
		});
	
	};

	
};

function CurrencyEditController($scope, $stateParams, $http, $state, $resource,toaster){
$scope.formTitle = 'Currency';
$scope.btnCancelUrl = 'app.currency'; 
$scope.showLoader = true; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'General','url':'#','isActive':false},
		 {'name':'Currency','url':'app.currency','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];	
	
	

 	$scope.rec = {};
	var postUrl = $scope.$root.setup+"general/get-currency";
	var updateUrl = $scope.$root.setup+"general/update-currency";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id };

	$http
      .post(postUrl, postData)
      .then(function (res) {
      	$scope.rec = res.data.response;
      	$scope.formUrl = function() {
			return "app/views/currency/_form.html";
		}
      	$scope.showLoader = false; 
      });


	$scope.update = function(rec){
	 	rec.token = $scope.$root.token;
	 	rec.id = $stateParams.id; 
 
		 $http
	      .post(updateUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
				toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 $timeout(function(){ $state.go('app.currency'); }, 3000);
			}
			else{
				toaster.pop('success', '', $scope.$root.getErrorMessageByCode(102));
				$timeout(function(){ $state.go('app.currency'); }, 3000);
			}
      });
		
	
};
}; 	

function ConversionRateController($scope, $stateParams, $http, $state, $resource,toaster, Calendar,$rootScope){
	$scope.formTitle = 'Currency';
	$scope.btnCancelUrl = 'app.currency'; 
	$scope.showLoader = true;  
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'General','url':'#','isActive':false},
		 {'name':'Currency','url':'app.currency','isActive':false},
		 {'name':'Conversion Rate','url':'#','isActive':false}];	
	
	

 	$scope.rec = {};
 	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	var postUrl = $scope.$root.setup+"general/get-conversion-rate";
	var addUrl = $scope.$root.setup+"general/update-conversion-rate";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id };

	$scope.starteDate = function(startDate){
			var newdate = startDate;
			$scope.newD = $scope.newD ? null : newdate;
			$scope.starteDate= false;
		}
	
	/************** Calendar *********************/

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
	  
		method.instances[instance] = true;
	   };
	  
	   method.options = {
		'show-weeks': false,
		startingDay: 0
	   };
	  
	   /*var formats = ['dd/MM/yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	   method.format = formats[0];*/

	   method.format = $rootScope.dateFormats[$rootScope.defaultDateFormat];
	  
	   return method;
	  }());  
	 /******************************************/ 

	$http
      .post(postUrl, postData)
      .then(function (res) {
      	if(res.data.response !== null){
	      	$scope.rec = res.data.response;
	      	$scope.rec.update_id = res.data.response.id;
	      	$.each($scope.arr_status,function(index,obj){
				if(obj.value == res.data.response.status){
					$scope.rec.status = $scope.arr_status[index]; 
				}
			});
       }
       else
       		$scope.rec.update_id = 0;

		$scope.formUrl = function() {
			return "app/views/currency/_conversion_rate_form.html";
		}
		$scope.showLoader = false; 
      });


	$scope.update = function(rec){
		if(rec.conversion_rate == 0){
			toaster.pop('error', '', 'Value must be greater than zero!');
			return false;
		}
	 	 rec.token = $scope.$root.token;
	 	 rec.status = $scope.rec.status !== undefined ? $scope.rec.status.value:0;
	 	 rec.emp_id = $scope.$root.userId;
	 	 rec.currency_id = $stateParams.id;
	 	 
		 $http
	      .post(addUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
				toaster.pop('success', '', $scope.$root.getErrorMessageByCode(102));
				 $timeout(function(){ $state.go('app.currency'); }, 3000);
			}
			else{
				toaster.pop('success', '', $scope.$root.getErrorMessageByCode(102));
				$timeout(function(){ $state.go('app.currency'); }, 3000);
		  }
      });
  	}
	
}; 	


