CompanyInfoController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.companyInfo', {
        url: '/company-info',
        title: 'Company Info',
        templateUrl: helper.basepath('company_info/company_info.html'),
        resolve: helper.resolveFor('ngTable')
    })
	.state('app.addCompanyInfo', {
        url: '/company-info/add',
        title: 'Add Company Info',
        templateUrl: helper.basepath('add.html'),
		controller: 'CompanyInfoAddController'
    })
	.state('app.viewCompanyInfo', {
		url: '/company-info/:id/view',
        title: 'View Company Info',
        templateUrl: helper.basepath('view.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'CompanyInfoViewController'
	  })
	  .state('app.editCompanyInfo', {
		url: '/company-info/:id/edit',
        title: 'Edit Company Info',
        templateUrl: helper.basepath('edit.html'),
		controller: 'CompanyInfoEditController'
	  })
  
 }]);

myApp.controller('CompanyInfoController', CompanyInfoController);
myApp.controller('CompanyInfoAddController', CompanyInfoAddController);
myApp.controller('CompanyInfoViewController', CompanyInfoViewController);
myApp.controller('CompanyInfoEditController', CompanyInfoEditController);

function CompanyInfoController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http) {
    'use strict';
	
    // required for inner references
	$scope.module_id = 25;
	$scope.module_table = 'company';
	$scope.class = 'inline_block'; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'app.setup','isActive':false, 'tabIndex':'1'},
		 {'name':'General','url':'app.setup','isActive':false, 'tabIndex':'1'},
		 {'name':'Company Info','url':'#','isActive':false}];
		 
    var vm = this;
    var Api = $scope.$root.setup+"general/companies";
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
	$scope.checkData ={};
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
    });


}

function CompanyInfoAddController($scope, $stateParams, $http, $state,$resource,toaster){
	$scope.date = new Date();

	$scope.class = 'block'; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'app.setup','isActive':false, 'tabIndex':'1'},
		 {'name':'General','url':'app.setup','isActive':false, 'tabIndex':'1'},
		 {'name':'Company Info','url':'app.companyInfo','isActive':false},
		 {'name':'Add','url':'#','isActive':false}];
	
	$scope.formUrl = function() {
		return "app/views/company_info/_form.html";
	  }
	  
/*	$resource('api/company/timezone/:selected/:is_company')
	 .get({selected:0,is_company:1},function(data){
	  $scope.timezone = data.combo_data;
	 });
*/	 

	$scope.rec = {};
	$scope.countries = {};
	var postUrl = $scope.$root.setup+"general/add-company";
	var countryUrl = $scope.$root.setup+"general/countries";
	var currencyUrl = $scope.$root.setup+"general/currencies";

	$http
      .post(countryUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true)
				$scope.countries = res.data.response;
			else
				toaster.pop('error', 'Error', "No country record found!");
      });

      $http
      .post(currencyUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true)
				$scope.currencies = res.data.response;
			else
				toaster.pop('error', 'Error', "No currency record found!");
      });
	
	 /*$resource('api/company/fill_combo/:table/:label/:value/:condition/:order_by/:selected/:is_company')
	 .get({table:'currency',label:'code',value:'id',condition:'0',order_by:'code',selected:0,is_company:1},function(data){
	  $scope.currency = data.combo_data;
	  $scope.currency_id = $scope.currency[data.selected_comp]; 
	 });
		

	$scope.rec = {};
	$resource('api/company/get_countries').get(function(data){
		$scope.countries = data.countries;
		$scope.country = $scope.countries[data.selected_comp]; 
	});*/
	

	//Save Company Data
	$scope.add = function(rec){
		rec.country_id = $scope.country.id !== undefined ? $scope.country.id:0;
		rec.currency_id = $scope.currency.id !== undefined ? $scope.currency.id:0;
		rec.token = $scope.$root.token;
		 
	 $http
      .post('api/company/add', rec)
      .then(function (res) {
      	$scope.$root.count = $scope.$root.count+1;
        	if(res.data == true){
				 toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
				 $timeout(function(){ $state.go('app.companyInfo'); }, 3000);
			}
			else
				toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
      });
  }
}
function CompanyInfoViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster){
	//View Company Data
	$scope.btnCancelUrl = 'app.companyInfo'; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'app.setup','isActive':false, 'tabIndex':'1'},
		 {'name':'General','url':'app.setup','isActive':false, 'tabIndex':'1'},
		 {'name':'Company Info','url':'app.companyInfo','isActive':false}];
	
	$scope.showLoader = true;
	$scope.rec = {};
	$scope.countries = {};
	$scope.currencies = {};
	var postUrl = $scope.$root.setup+"general/add-company";
	var countryUrl = $scope.$root.setup+"general/countries";
	var currencyUrl = $scope.$root.setup+"general/currencies";

	$http
      .post(countryUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true)
				$scope.countries = res.data.response;
			else
				toaster.pop('error', 'Error', "No country record found!");
      });

      $http
      .post(currencyUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true)
				$scope.currencies = res.data.response;
			else
				toaster.pop('error', 'Error', "No currency record found!");
      });
	
	var postUrl = $scope.$root.setup+"general/get-company";
	var postData = {
	    'token': $scope.$root.token,
	    'id': $stateParams.id
  	};
  	$timeout(function(){
		$http
	      .post(postUrl, postData)
	      .then(function (res) {
	      	$scope.rec = res.data.response;
		      	$.each($scope.countries,function(index,obj){
					if(obj.id == res.data.response.country_id){
						$scope.rec.country = $scope.countries[index]; 
					}
				});
				$.each($scope.currencies,function(index,obj){
					if(obj.id == res.data.response.country_id){
						$scope.rec.currency = $scope.currencies[index]; 
					}
				});
	      });
	      $scope.formUrl = function() {
				return "app/views/company_info/_form.html";
			  }
	      $scope.showLoader = false;
	}, 3000);
	
	
		
	$scope.gotoEdit = function(){
	  $state.go("app.editCompanyInfo",{id:$stateParams.id});
	};
	
/*$scope.delete = function () {
    ngDialog.openConfirm({
      template: 'modalDeleteDialogId',
      className: 'ngdialog-theme-default-custom'
    }).then(function (value) {
      $http
		  .post('api/company/delete', {id:id,table:table})
		  .then(function (res) {
		  	$scope.$root.count = $scope.$root.count+1;
				if(res.data > 0){
					toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
					 $timeout(function(){ $state.go('app.companyInfo'); }, 3000);
				}
				else{
					toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
					 $timeout(function(){ $state.go('app.companyInfo'); }, 3000);
				}
		  });
    }, function (reason) {
      console.log('Modal promise rejected. Reason: ', reason);
    });*/
 
	//if(popupService.showPopup('Would you like to delete?')) {
		
	//  }*/
 };
	


function CompanyInfoEditController($scope, $stateParams, $http, $state, $resource,toaster){
	//Edit Company Data

$scope.class = 'block'; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'app.setup','isActive':false, 'tabIndex':'1'},
		 {'name':'General','url':'app.setup','isActive':false, 'tabIndex':'1'},
		 {'name':'Company Info','url':'app.companyInfo','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];

	$scope.showLoader = true;
	$scope.rec = {};
	$scope.countries = {};
	$scope.currencies = {};
	var postUrl = $scope.$root.setup+"general/add-company";
	var countryUrl = $scope.$root.setup+"general/countries";
	var currencyUrl = $scope.$root.setup+"general/currencies";

	$http
      .post(countryUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true)
				$scope.countries = res.data.response;
			else
				toaster.pop('error', 'Error', "No country record found!");
      });

      $http
      .post(currencyUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true)
				$scope.currencies = res.data.response;
			else
				toaster.pop('error', 'Error', "No currency record found!");
      });
	
	var postUrl = $scope.$root.setup+"general/get-company";
	var postData = {
	    'token': $scope.$root.token,
	    'id': $stateParams.id
  	};
  	$timeout(function(){
		$http
	      .post(postUrl, postData)
	      .then(function (res) {
	      	$scope.rec = res.data.response;
		      	$.each($scope.countries,function(index,obj){
					if(obj.id == res.data.response.country_id){
						$scope.rec.country = $scope.countries[index]; 
					}
				});
				$.each($scope.currencies,function(index,obj){
					if(obj.id == res.data.response.country_id){
						$scope.rec.currency = $scope.currencies[index]; 
					}
				});
	      });
	      $scope.formUrl = function() {
				return "app/views/company_info/_form.html";
			  }
	      $scope.showLoader = false;
	}, 3000);

	
	$scope.update = function(rec){
 	 	 rec.token = $scope.$root.token;
	 	 rec.country_id = $scope.rec.country.id != undefined ? $scope.rec.country.id :0; 
	 	 rec.currency_id = $scope.rec.currency.id != undefined ? $scope.rec.currency.id :0;

		 $http
	      .post(updateUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
				toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 $timeout(function(){ $state.go('app.companyInfo'); }, 3000);
			}
			else{
				 toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 $timeout(function(){ $state.go('app.companyInfo'); }, 3000);
				}
      });
  }
	
}


