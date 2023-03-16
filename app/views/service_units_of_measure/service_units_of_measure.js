ServiceUnitsOfMeasureController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","toaster","ngDialog"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.service_units_of_measure', {
        url: '/service_units_of_measure',
        title: 'Unit of Measure',
        templateUrl: helper.basepath('service_units_of_measure/service_units_of_measure.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.addServiceUnitsOfMeasure', {
        url: '/service_units_of_measure/add',
        title: 'Add Unit of Measure',
        templateUrl: helper.basepath('add.html'),
		controller: 'ServiceUnitsOfMeasureAddController'
    })
	.state('app.viewServiceUnitsOfMeasure', {
		url: '/service_units_of_measure/:id/view',
        title: 'View Unit of Measure',
        templateUrl: helper.basepath('view.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'ServiceUnitsOfMeasureViewController'
	  })
	  .state('app.editServiceUnitsOfMeasure', {
		url: '/service_units_of_measure/:id/edit',
        title: 'Edit Unit of Measure',
        templateUrl: helper.basepath('edit.html'),
		controller: 'ServiceUnitsOfMeasureEditController'
	  })
  
 }]);

myApp.controller('ServiceUnitsOfMeasureController', ServiceUnitsOfMeasureController);
myApp.controller('ServiceUnitsOfMeasureAddController', ServiceUnitsOfMeasureAddController);
myApp.controller('ServiceUnitsOfMeasureViewController', ServiceUnitsOfMeasureViewController);
myApp.controller('ServiceUnitsOfMeasureEditController', ServiceUnitsOfMeasureEditController);

function ServiceUnitsOfMeasureController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,toaster,ngDialog) {
    'use strict';
	
    // required for inner references
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Services','url':'#','isActive':false},
		 {'name':'Unit of Measure','url':'#','isActive':false}];
		 
		 
	
	
    var vm = this;
	
	
	var Api = $scope.$root.setup+"service/unit-measure/units";

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

    $scope.$data = {};
    $scope.deleteUnit = function (id,index,$data) {
		 var delUrl = $scope.$root.setup+"service/unit-measure/delete-unit";
      ngDialog.openConfirm({
      template: 'modalDeleteDialogId',
      className: 'ngdialog-theme-default-custom'
    }).then(function (value) {
      $http
		  .post(delUrl, {'token':$scope.$root.token,id:id})
		  .then(function (res) {
				if(res.data.ack == true){
					toaster.pop('success', 'Deleted', 'Record Deleted ');
					 $data.splice(index,1);
				}
				else{
					toaster.pop('error', 'Info', "This category is used by another module!");
				}
		  });
    }, function (reason) {
      console.log('Modal promise rejected. Reason: ', reason);
    });
 
	};
	
	 $scope.delete = function () {
	 var delUrl = $scope.$root.setup+"service/unit-measure/delete-unit";

    ngDialog.openConfirm({
      template: 'modalDeleteDialogId',
      className: 'ngdialog-theme-default'
    }).then(function (value) {
      $http
		  .post(delUrl, postData)
		  .then(function (res) {
				if(res.data.ack == true){
					toaster.pop('success', 'Deleted', 'Record Deleted ');
					 $timeout(function(){ $state.go('app.service_units_of_measure'); }, 3000);
				}
				else{
					toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
					 $timeout(function(){ $state.go('app.service_units_of_measure'); }, 3000);
				}
		  });
    }, function (reason) {
      console.log('Modal promise rejected. Reason: ', reason);
    });
 
	//if(popupService.showPopup('Would you like to delete?')) {
		
	//  }*/
 };

}

function ServiceUnitsOfMeasureAddController($scope, $stateParams, $http, $state,toaster){
	//alert("Here");
	$scope.btnCancelUrl = 'app.service_units_of_measure';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Services','url':'#','isActive':false},
		 {'name':'Unit of Measure','url':'app.service_units_of_measure','isActive':false},
		 {'name':'Add','url':'#', 'isActive':false}];

	$scope.formUrl = function() {
		return "app/views/service_units_of_measure/_form.html";
	  }
	
	var postUrl = $scope.$root.setup+"service/unit-measure/add-unit";
	var unitUrl = $scope.$root.setup+"service/unit-measure/get-all-unit";
	
	$scope.rec = {};
	$scope.unit_measures = {};
	$scope.parent_id = {};
	
	$http
      .post(unitUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true){
				$scope.unit_measures = res.data.response;
				//$scope.country = $scope.countries[data.selected_comp]; 
			}
			else
				toaster.pop('error', 'Error', "No country found!");
    });
	  
	$scope.add = function(rec){
	 	 rec.token = $scope.$root.token;
		 rec.parent_id = $scope.rec.parent_id != undefined?$scope.rec.parent_id.id:0;
	 	 rec.status = $scope.rec.status.value !== undefined ? $scope.rec.status.value:0;
		 $http
	      .post(postUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
					 toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
					 $timeout(function(){ $state.go('app.service_units_of_measure'); }, 3000);
				}
				else
					toaster.pop('error', 'Info', res.data.error);
	      });
  }
}

function ServiceUnitsOfMeasureViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster){
	$scope.btnCancelUrl = 'app.service_units_of_measure';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Services','url':'#','isActive':false},
		 {'name':'Unit of Measure','url':'app.service_units_of_measure','isActive':false}];	 
		 
	$scope.gotoEdit = function(){
	  $state.go("app.editServiceUnitsOfMeasure",{id:$stateParams.id});
	};
	
		 
	$scope.rec = {};
	$scope.status = {};
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	
	$scope.unit_measures = {};
	var unitUrl = $scope.$root.setup+"service/unit-measure/get-all-unit";
	
	$http
      .post(unitUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true){
				$scope.unit_measures = res.data.response;
			}
			
      });
	
	 
	 var postUrl = $scope.$root.setup+"service/unit-measure/get-unit";
	var postData = {
	    'token': $scope.$root.token,
	    'id': $stateParams.id
  	};

	$http
      .post(postUrl, postData)
      .then(function (res) {
      			$scope.rec = res.data.response;
	
	 			$.each($scope.unit_measures,function(index,obj){
					if(obj.id == res.data.response.parent_id){
						$scope.rec.parent_id = $scope.unit_measures[index]; 
					}
				});
				
				$.each($scope.arr_status,function(index,obj){
			if(obj.value == res.data.response.status){
				$scope.rec.status = $scope.arr_status[index]; 
			}
		});
      });
	  
	  	$scope.formUrl = function() {
		return "app/views/service_units_of_measure/_form.html";
	}
		 

	
};

function ServiceUnitsOfMeasureEditController($scope, $stateParams, $http, $state, $resource,toaster){

	$scope.btnCancelUrl = 'app.service_units_of_measure';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Services','url':'#','isActive':false},
		 {'name':'Unit of Measure','url':'app.service_units_of_measure','isActive':false},
		 {'name':'Edit','url':'#', 'isActive':false}];
	$scope.rec = {};
	$scope.status = {};
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	
 	

	$scope.unit_measures = {};
	var unitUrl = $scope.$root.setup+"service/unit-measure/get-all-unit";
	
	$http
      .post(unitUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true){
				$scope.unit_measures = res.data.response;
				//console.log($scope.unit_measures);
			}
			
      });
	
	 
	 var postUrl = $scope.$root.setup+"service/unit-measure/get-unit";
	var postData = {
	    'token': $scope.$root.token,
	    'id': $stateParams.id
  	};

	$http
      .post(postUrl, postData)
      .then(function (res) {
      			$scope.rec = res.data.response;
	
	 			$.each($scope.unit_measures,function(index,obj){
					//console.log(obj.id == res.data.response.parent_id);
					if(obj.id == res.data.response.parent_id){
						$scope.rec.parent_id = $scope.unit_measures[index]; 
					}
				});
				
				$.each($scope.arr_status,function(index,obj){
			if(obj.value == res.data.response.status){
				$scope.rec.status = $scope.arr_status[index]; 
			}
		});
      });
	  
	  	$scope.formUrl = function() {
		return "app/views/service_units_of_measure/_form.html";
	}
	
	
	var updateUrl = $scope.$root.setup+"service/unit-measure/update-unit";
	$scope.update = function(rec){
	 	 rec.token = $scope.$root.token;
		 rec.parent_id = $scope.rec.parent_id != undefined?$scope.rec.parent_id.id:0;
	 	 rec.status = $scope.rec.status.value !== undefined ? $scope.rec.status.value:0;
		 $http
	      .post(updateUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == 1){
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 	$timeout(function(){ $state.go('app.service_units_of_measure'); }, 3000);
				} else if(res.data.ack == 2){
				 	toaster.pop('error', 'Edit', res.data.error);
				 	//$timeout(function(){ $state.go('app.service_units_of_measure'); }, 3000);
				} else if(res.data.ack == 0){
					toaster.pop('success', 'Edit', res.data.error);
				 //	$timeout(function(){ $state.go('app.service_units_of_measure'); }, 3000);
				}
      });
  	}
}

