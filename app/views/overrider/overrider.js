OverriderController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.overrider', {
        url: '/overrider',
        title: 'Overrider',
        templateUrl: helper.basepath('overrider/overrider.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.add-overrider', {
        url: '/overrider/add',
        title: 'Add Overrider',
        templateUrl: helper.basepath('add.html'),
		controller: 'OverriderAddController'
    })
	.state('app.view-overrider', {
		url: '/overrider/:id/view',
        title: 'View ',
        templateUrl: helper.basepath('view.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'OverriderViewController'
	  })
	  .state('app.edit-overrider', {
		url: '/overrider/:id/edit',
        title: 'Edit Overrider',
        templateUrl: helper.basepath('edit.html'),
		controller: 'OverriderEditController'
	  })
  
 }]);

myApp.controller('OverriderController', OverriderController);
myApp.controller('OverriderAddController', OverriderAddController);
myApp.controller('OverriderViewController', OverriderViewController);
myApp.controller('OverriderEditController', OverriderEditController);

function OverriderController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster) {
    'use strict';

	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1'},
         {'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3'},
		 {'name':'Overrider','url':'#','isActive':false}];
		 
 	var vm = this;
    var Api = $scope.$root.setup+"crm/overrider";
    var postData = {
	    'token': $scope.$root.token,
	    'all': "1",
	    'column':'type',
	    'value':2
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
	//	$scope.checkData = ngDataService.getDataCustom( $defer, params, Api,$filter,$scope,postData);
        }
    });


    $scope.$data = {};
    $scope.delete = function (id,index,$data) {
    	var delUrl = $scope.$root.setup+"crm/delete-overrider";
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



function OverriderAddController($scope, $stateParams, $http, $state,toaster,$timeout){

	 $scope.formTitle = 'Overrider';
	 $scope.btnCancelUrl = 'app.overrider';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1'},
         {'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3'},
		 {'name':'Overrider','url':'app.overrider','isActive':false},
		 {'name':'Add','url':'#','isActive':false}];

	$scope.formUrl = function() {
		return "app/views/overrider/_form.html";
	  }
	  
	$scope.rec = {};
	var postUrl = $scope.$root.setup+"crm/add-overrider";


	 $scope.add = function(rec){
	 rec.token = $scope.$root.token;
	 rec.discount_type = $scope.discount_type_id != undefined?$scope.discount_type_id.id:0;
	 $http
      .post(postUrl, rec)
      .then(function (res) {
        	if(res.data.ack == true){
				 toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
				 $timeout(function(){ $state.go('app.overrider'); }, 3000);
			}
			else
				toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
      });
  	}

  	$scope.show_symbol = false;
	 $scope.setSymbol = function(){
	 	var id = this.rec.discount_type_id.id;
	 	if(id == 'Percentage')
	 		$scope.show_symbol = true;
	 	else
	 		$scope.show_symbol = false;
	 }

	var getCrmCodeUrl = $scope.$root.setup+"crm/get-insurance-charge-code";
    $scope.getCode = function(rec){
	    $http
	      .post(getCrmCodeUrl, {'module_id':53,'is_increment':1,'token':$scope.$root.token})
	      .then(function (res) {
			$scope.code = res.data.code;
			//$scope.rec.crm_no = res.data.number;
	   });
		return false;
	}
}

function OverriderViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster,$timeout){
	 $scope.formTitle = 'Overrider';
	 $scope.btnCancelUrl = 'app.overrider';
	 $scope.hideDel = false;
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1'},
         {'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3'},
		 {'name':'Overrider','url':'app.overrider','isActive':false}];
		 
	$scope.formUrl = function() {
		return "app/views/overrider/_form.html";
	  }
		
	$scope.gotoEdit = function(){
	  $state.go("app.edit-overrider",{id:$stateParams.id});
	};
	
		 
  	$scope.rec = {};
	var postUrl = $scope.$root.setup+"crm/get-overrider";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id };

	$http
      .post(postUrl, postData)
      .then(function (res) {
      	$scope.rec = res.data.response;
      	if(res.data.response.discount_type == 'Percentage')
 			$scope.show_symbol = true;

 		$.each($scope.arr_discount_type,function(index,elem){if(elem.id == res.data.response.discount_type){
					$scope.rec.discount_type_id = elem;}});

 		/*if(res.data.response.crm_no  == null){
			$scope.code = 'FC001';
			//$scope.rec.crm_no = 1;
		}*/
		if(res.data.response.id < 10)
			$scope.code = 'IC00'+res.data.response.id;
		else if(res.data.response.crm_no > 10 && res.data.response.id < 100)
			$scope.code = 'IC0'+res.data.response.id;
		else
			$scope.code = 'IC'+res.data.response.id;

			/*if(res.data.response.crm_no  != null){
				//$scope.rec.crm_no = res.data.response.crm_no;
				$scope.code = 'FC'+res.data.response.crm_no;
			}*/
      });
     
		 
	
 	
	
};

function OverriderEditController($scope, $stateParams, $http, $state, $resource,toaster,$timeout){

	$scope.formTitle = 'Overrider';
	 $scope.btnCancelUrl = 'app.overrider';
	 $scope.hideDel = false; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1'},
         {'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3'},
		 {'name':'Overrider','url':'app.overrider','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];	
	
	$scope.formUrl = function() {
		return "app/views/overrider/_form.html";
    }

 	$scope.rec = {};
	var postUrl = $scope.$root.setup+"crm/get-overrider";
	var updateUrl = $scope.$root.setup+"crm/update-overrider";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id};

	$http
      .post(postUrl, postData)
      .then(function (res) {
      	$scope.rec = res.data.response;
      	if(res.data.response.discount_type == 'Percentage')
 			$scope.show_symbol = true;

 		$.each($scope.arr_discount_type,function(index,elem){if(elem.id == res.data.response.discount_type){
					$scope.rec.discount_type_id = elem;}});

 		if(res.data.response.id < 10)
			$scope.code = 'IC00'+res.data.response.id;
		else if(res.data.response.crm_no > 10 && res.data.response.id < 100)
			$scope.code = 'IC0'+res.data.response.id;
		else
			$scope.code = 'IC'+res.data.response.id;
      });

	
	$scope.update = function(rec){
	 	 rec.token = $scope.$root.token;
	 	 rec.discount_type = rec.discount_type_id != undefined?rec.discount_type_id.id:0;
		 $http
	      .post(updateUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
				toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 $timeout(function(){ $state.go('app.overrider'); }, 3000);
			}
			else
				toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
      });
  	}

  	$scope.show_symbol = false;
	 $scope.setSymbol = function(){
	 	var id = this.rec.discount_type_id.id;
	 	if(id == 'Percentage')
	 		$scope.show_symbol = true;
	 	else
	 		$scope.show_symbol = false;
	 }
	
}


