/*CatUnitsOfMeasureController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService"];


*/
CatUnitsOfMeasureController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster"];
 
 
 myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.cat_units_of_measure', {
        url: '/cat_units_of_measure',
        title: 'Categories Unit of Measure',
        templateUrl: helper.basepath('cat_units_of_measure/cat_units_of_measure.html'),
     resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.addCatUnitsOfMeasure', {
        url: '/cat_units_of_measure/add',
        title: 'Add Category Unit of Measure',
        templateUrl: helper.basepath('add.html'),
		controller: 'CatUnitsOfMeasureAddController'
    })
	.state('app.viewCatUnitsOfMeasure', {
		url: '/cat_units_of_measure/:id/view',
        title: 'View Category Unit of Measure',
        templateUrl: helper.basepath('view.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'CatUnitsOfMeasureViewController'
	  })
	  .state('app.editCatUnitsOfMeasure', {
		url: '/cat_units_of_measure/:id/edit',
        title: 'Edit Category Unit of Measure',
        templateUrl: helper.basepath('edit.html'),
		controller: 'CatUnitsOfMeasureEditController'
	  })
  
 }]);

myApp.controller('CatUnitsOfMeasureController', CatUnitsOfMeasureController);
myApp.controller('CatUnitsOfMeasureAddController', CatUnitsOfMeasureAddController);
myApp.controller('CatUnitsOfMeasureViewController', CatUnitsOfMeasureViewController);
myApp.controller('CatUnitsOfMeasureEditController', CatUnitsOfMeasureEditController);


	
function CatUnitsOfMeasureController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster) {
	
	
	
    // required for inner references
	
	$scope.module_table = 'category_units_of_measure';
	$scope.class = 'inline_block'; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Inventory','url':'app.setup','isActive':false},
		 {'name':'Category Unit of Measure','url':'#','isActive':false}];
		 
    var vm = this;
	
	// For one time fetching data	
    //var Api = $resource('api/company/get_listing/:module_id/:module_table');

	// On Filter Dropdown change	
    
	var Api = $scope.$root.stock+"cat-unit";
	
	
	//console.log ( 'URL='+Api );
	//return false;
	
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
	
	
	
	
 $scope.delete = function (id,index,arr_data_ret) {  
		var delUrl = $scope.$root.stock+"cat-unit/delete-cat-unit";
	    ngDialog.openConfirm({
	      template: 'modalDeleteDialogId',
	      className: 'ngdialog-theme-default-custom'
	    }).then(function (value) {
	      $http
			  .post(delUrl, {id:id,'token': $scope.$root.token})
			  .then(function (res) {
				  
					if(res.data.ack == true){
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
						 arr_data_ret.splice(index,1); 
					}
					else{ 
						toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(108));
					}
			  });
	    },
		 function (reason) {
	      console.log('Modal promise rejected. Reason: ', reason);
		});
	};
 


}

function CatUnitsOfMeasureAddController($scope, $stateParams, $http, $state,toaster){
	
	$scope.btnCancelUrl = 'app.cat_units_of_measure';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Inventory','url':'app.setup','isActive':false},
		 {'name':'Category Unit of Measure','url':'app.cat_units_of_measure','isActive':false},
		 {'name':'Add','url':'#', 'isActive':false}];

	$scope.formUrl = function() {
		return "app/views/cat_units_of_measure/_form.html";
	  }
	
	var postUrl = $scope.$root.stock+"cat-unit/add-cat-unit";
	var unitUrl = $scope.$root.stock+"unit-measure/get-all-unit";
	var categoryUrl = $scope.$root.stock+"categories/get-all-categories";
	
	$scope.rec = {};
	$scope.unit_measures = {};
	//$scope.category = {};
	
	$http
      .post(unitUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true){
				$scope.unit_measures = res.data.response;
			}
			else
				toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
    });
	
	$http
      .post(categoryUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true){
				$scope.category = res.data.response;
			}
			else
				toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
    });
	  
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'inActive','value':0}];
	$scope.add = function(rec){
	 	 rec.token = $scope.$root.token;
		 rec.category_ids = $scope.rec.category_id !== undefined?$scope.rec.category_id.id:0;
		 rec.unit_ids = $scope.rec.unit_id !== undefined?$scope.rec.unit_id.id:0;
		 rec.status = $scope.rec.statuss  !== undefined ? $scope.rec.statuss.value:0;
		  
		 $http
	      .post(postUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
					 toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
					 $timeout(function(){ $state.go('app.cat_units_of_measure'); }, 3000);
				}
				else
					toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(105));
	      });
  }
}

function CatUnitsOfMeasureViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster){
	$scope.btnCancelUrl = 'app.cat_units_of_measure';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Inventory','url':'app.setup','isActive':false},
		 {'name':'Category Unit of Measure','url':'app.cat_units_of_measure','isActive':false}];
		 
	$scope.unit_measures = {};
	$scope.category = {};
	
	var unitUrl = $scope.$root.stock+"unit-measure/get-all-unit";
	var categoryUrl = $scope.$root.stock+"categories/get-all-categories";
	
	$http
      .post(unitUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true){
				$scope.unit_measures = res.data.response;
			}
			else
				toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
    });
	$http
      .post(categoryUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true){
				$scope.category = res.data.response;
			}
			else
				toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
    });
	

	$scope.formUrl = function() {
		return "app/views/cat_units_of_measure/_form.html";
	  }
	  		
	$scope.gotoEdit = function(){
	  $state.go("app.editCatUnitsOfMeasure",{id:$stateParams.id});
	};
	
		 
  	$scope.rec = {};
	var postUrl = $scope.$root.stock+"cat-unit/get-cat-unit";
	
	
	var postData = {
	    'token': $scope.$root.token,
	    'id': $stateParams.id
  	};

	$scope.arr_status =	[{'label':'Active','value':1},{'label':'inActive','value':0}];
	
  	//$timeout(function(){
		$http
	      .post(postUrl, postData)
	      .then(function (res) {
			  
	      	$scope.rec = res.data.response;
		      	$.each($scope.unit_measures,function(index,obj){
			 
					if(obj.id == res.data.response.unit_id){
						$scope.rec.unit_id = $scope.unit_measures[index]; 
					}
				});
				$.each($scope.arr_status,function(index,obj){ 
							if(obj.value == res.data.response.status){
								$scope.rec.statuss = $scope.arr_status[index]; 
								
							}});
							
				$.each($scope.category,function(index,obj){
					if(obj.id == res.data.response.category_id){
						$scope.rec.category_id = $scope.category[index]; 
					}
				});
				
				
	      
		  
		  });
	//}, 3000); 
} 

function CatUnitsOfMeasureEditController($scope, $stateParams, $http, $state, $resource,toaster){

	$scope.btnCancelUrl = 'app.cat_units_of_measure';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Inventory','url':'app.setup','isActive':false},
		 
		 {'name':'Category Unit of Measure','url':'app.cat_units_of_measure','isActive':false},
		 {'name':'Edit','url':'#', 'isActive':false}];
	
 	
	$scope.formUrl = function() {
		return "app/views/cat_units_of_measure/_form.html";
	}
	
	$scope.unit_measures = {};
	$scope.category = {};
	
	var unitUrl = $scope.$root.stock+"unit-measure/get-all-unit";
	var categoryUrl = $scope.$root.stock+"categories/get-all-categories";
	
	$http
      .post(unitUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true){
				$scope.unit_measures = res.data.response;
			}
			else
				toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
    });
	$http
      .post(categoryUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true){
				$scope.category = res.data.response;
			}
			else
				toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
    });
	
	$scope.rec = {};
	var postUrl = $scope.$root.stock+"cat-unit/get-cat-unit";
	var updateUrl = $scope.$root.stock+"cat-unit/update-cat-unit";
	
	var postData = {
	    'token': $scope.$root.token,
	    'id': $stateParams.id
  	};
	
	
		$scope.arr_status =	[{'label':'Active','value':1},{'label':'inActive','value':0}];
			
	//$timeout(function(){
		$http
	      .post(postUrl, postData)
	      .then(function (res) {
	      	$scope.rec = res.data.response;
		      	$.each($scope.unit_measures,function(index,obj){
				//	console.log(res.data.response.unit_id);
					if(obj.id == res.data.response.unit_id){
						$scope.rec.unit_id = $scope.unit_measures[index]; 
					}
				});
				$.each($scope.arr_status,function(index,obj){ 
							if(obj.value == res.data.response.status){
								$scope.rec.statuss = $scope.arr_status[index]; 
								
							}});
							
				$.each($scope.category,function(index,obj){
					if(obj.id == res.data.response.category_id){
						$scope.rec.category_id = $scope.category[index]; 
					}
				});
				
				
	      });
//	}, 3000);


	$scope.update = function(rec){
	 	 rec.token = $scope.$root.token;
		 rec.category_ids = $scope.rec.category_id != undefined?$scope.rec.category_id.id:0;
		 rec.unit_ids = $scope.rec.unit_id != undefined?$scope.rec.unit_id.id:0;
		 rec.status = $scope.rec.statuss !== undefined ? $scope.rec.statuss.value:0;
		 
		 $http
	      .post(updateUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
				toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 $timeout(function(){ $state.go('app.cat_units_of_measure'); }, 3000);
			}
			else
				toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 //	$timeout(function(){ $state.go('app.cat_units_of_measure'); }, 3000);
      });
  	}
  
  
	
}

