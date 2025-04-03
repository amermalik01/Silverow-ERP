FilterController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.filters', {
        url: '/filters',
        title: 'Filters',
        templateUrl: helper.basepath('modules_filters/filter.html'),
        resolve: helper.resolveFor('ngTable')
    })
	.state('app.addfilter', {
        url: '/filter/:mid/:md/add',
        title: 'Add filter ',
        templateUrl: helper.basepath('add.html'),
		controller: 'FilterAddController',
		resolve: helper.resolveFor('nestable')		
    })
	.state('app.viewfilter', {
		url: '/filter/:id/view',
        title: 'View filter ',
        templateUrl: helper.basepath('view.html'),
        resolve: helper.resolveFor('nestable','ngDialog'),
		controller: 'FilterViewController'
			
	  })
	  .state('app.editfilter', {
		url: '/filter/:id/:md/edit',
        title: 'Edit filter ',
        templateUrl: helper.basepath('edit.html'),
		controller: 'FilterEditController',
		resolve: helper.resolveFor('nestable')	
	  })
  
 }]);
myApp.controller('FilterController', FilterController);
myApp.controller('FilterAddController', FilterAddController);
myApp.controller('FilterViewController', FilterViewController);
myApp.controller('FilterEditController', FilterEditController);

function FilterController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http) {
    'use strict';
	
    // required for inner references
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'General','url':'#','isActive':false},
		 {'name':'Filter','url':'#','isActive':false}];
		 
     var vm = this;
    var Api = $scope.$root.setup+"general/modules-filters";
     var postData = {
	    'token': $scope.$root.token 
  	};

    $scope.$watch("MyCustomeFilters", function () {
        if($scope.MyCustomeFilters && $scope.table.tableParams5){
            $scope.table.tableParams5.reload();
        }
    }, true);
    $scope.MyCustomeFilters = {
    }

    vm.tableParams5 = new ngParams({
        page: 1,            // show first page
     count: $scope.$root.pagination_limit,          // count per page
        filter: {
            name: '',
            age: ''
        }
    },
	 {
        total: 0,           // length of data
        counts: [],         // hide page counts control

        getData: function($defer, params) { 
			ngDataService.getDataCustom( $defer, params, Api,$filter,$scope,postData);
        }
    });
	
	
	 $scope.delete = function (id,index,arr_data_ret) {  
	 var delUrl = $scope.$root.sales+"customer/sale-target/delete-sale-list"; 
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
					else toaster.pop('error', 'Info', 'Record cannot be Deleted.');
					
			  });
	    },
		 function (reason) {
	      console.log('Modal promise rejected. Reason: ', reason);
		});
	};
	
	
	
}

function FilterAddController($scope, $stateParams, $http, $state,toaster, $resource,$timeout){
    $scope.ids;
	$scope.formTitle = 'Module Filters';
	$scope.btnCancelUrl = 'app.filters';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'General','url':'#','isActive':false},
		 {'name':'Filter','url':'app.filters','isActive':false},
		 {'name':'Add','url':'#','isActive':false}];

	$scope.formUrl = function() {
		return "app/views/modules_filters/_form.html";
	  }
	  
	  $scope.is_default  = false;
	   $scope.getDefault = function (values){
	   		$scope.is_default = values;
	   }
	  $scope.is_public  = false;
	  $scope.getPublic = function (values){
	   		$scope.is_public = values;
	   }

       $scope.selection = [];
	  $scope.myNestable2 = {};
	  $scope.myNestable2.onchange = function() {
		$scope.serialized = $scope.myNestable2.serialize();
	  };
	  
	  $scope.toggleSelection = function toggleSelection(fruitName) {
      var idx = $scope.selection.indexOf(fruitName);
     
     console.log(idx);
      // is currently selected
      if (idx > -1) {
        $scope.selection.splice(idx, 1);
      }
      
      // is newly selected
      else {
        $scope.selection.push(fruitName);
      }
    };

    $scope.rec = {};
	$scope.countries = {};
	var postUrl = $scope.$root.setup+"general/add-module-filter";
	var modulesUrl = $scope.$root.setup+"general/modules-codes";
	var fieldsUrl = $scope.$root.setup+"general/get-module-fields";
	var addFilterDetailUrl = $scope.$root.setup+"general/add-filter-details";
	
	
	  $scope.module_id = 0;
	  $scope.getId = function (){
       $scope.selection = [];
	   $scope.module_id =  this.module_codes.id;
	   
		$scope.fields = {}; 
		$http
	      .post(fieldsUrl, {'module_id':$scope.module_id,'token':$scope.$root.token})
	      .then(function (res){ 
	      		if(res.data.ack == true)
					$scope.fields = res.data.response;
				else
					toaster.pop('error', 'Error', "No country found!");
	    });
		
	  }  
	 $scope.rec = {}; 
	 $scope.accounts = {}; 
	 $http
      .post(modulesUrl, {'token':$scope.$root.token,'all':1})
      .then(function (res){ 
      		if(res.data.ack == true){
      			$scope.accounts = res.data.response;
				if ($stateParams.mid != '')
					$.each($scope.accounts,function(index,elem){if(elem.value == $stateParams.mid){$scope.module_codes = elem; $scope.getId();}})
      		}
			else
				toaster.pop('error', 'Error', "No country found!");
    });
 	

	 $scope.add = function(rec){
		 var filedStr = '';
		 angular.forEach($scope.selection, function(value, key) {
			 filedStr = filedStr + value + ',';
		 });
	 // console.log($scope.selection); 
	 rec.fields = filedStr.substring(0,filedStr.length-1);
	 rec.module_codes_id = $scope.module_id;
	 rec.token = $scope.$root.token;
	 if ($scope.is_default  == '1') $scope.rec.is_default = 'Yes'; 	else $scope.rec.is_default = 'No';
	 if ($scope.is_public == '1') 	$scope.rec.is_public = 'Yes';	else $scope.rec.is_public = 'No';

	 $http
      .post(postUrl, rec)
      .then(function (res) {
        	if(res.data.ack == true){
				angular.forEach($scope.selection, function(value, key) {
					rec_filed = {};
					rec_filed.filter_id = res.data.response;
					rec_filed.field_id = value;
					rec_filed.sequence = key;
					rec_filed.token = $scope.$root.token;
					$http.post(addFilterDetailUrl, rec_filed).then(function (res) { });
				});
				toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
				 //$scope.$root.$broadcast("myOppurtunityEventReload", {id:'test'});
				 $timeout(function(){
				 if ($stateParams.md != '')
						$state.go('app.'+$stateParams.md, {'filter_id':rec_filed.filter_id });
					else 
						$state.go('app.filters'); 
				}, 3000);
			}
			else
				toaster.pop('error', 'Add', 'Record can\'t be added!');
      });
  }
}

function FilterViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster,$timeout){
	$scope.formTitle = 'Module Filter';
	$scope.btnCancelUrl = 'app.filters';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'General','url':'#','isActive':false},
		 {'name':'Filter ','url':'app.filters','isActive':false}];
		 
	
	$scope.gotoEdit = function(){
	  $state.go("app.editfilter",{id:$stateParams.id});
	};
	
    $scope.rec = {}; 
	$scope.accounts = {}; 
	$scope.showLoader = true;
	var postUrl = $scope.$root.setup+"general/get-module-filter";
	var filterDetialsUrl = $scope.$root.setup+"general/get-filter-details";
	var modulesUrl = $scope.$root.setup+"general/modules-codes";
	var fieldsUrl = $scope.$root.setup+"general/get-module-fields";
	var deleteUrl = $scope.$root.setup+"general/delete-module-filter";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id };
	$scope.fields = {}; 
	$scope.selection = [];

	$timeout(function(){
		$http
	      .post(postUrl, postData)
	      .then(function (res) {
	      	$scope.rec = res.data.response;
	      	if ($scope.rec.is_default == 'Yes')
				$scope.is_default = true;
			if ($scope.rec.is_public == 'Yes')
				$scope.is_public = true;

			// get filter details
			$http
		      .post(filterDetialsUrl, {'filter_id':$stateParams.id,'token':$scope.$root.token})
		      .then(function (res) {
		        	if(res.data.ack == true){
						$.each(res.data.response,function(index,elem){
							$scope.selection.push(elem.field_id);
						})
					}
					else
						toaster.pop('error', 'Error', "No record in filter details!");
		    	});

		    // get modules
		    $http
		      .post(modulesUrl, {'token':$scope.$root.token,'all':1})
		      .then(function (res){ 
		      	//console.log(res.data.response);
		      		if(res.data.ack == true){
		      			$scope.accounts = res.data.response;
		      			$.each($scope.accounts,function(index,elem){if(elem.id == $scope.rec.module_codes_id){$scope.module_codes = elem;}})
						$scope.fields = {};
						$http
					      .post(fieldsUrl, {'module_id':$scope.rec.module_codes_id,'token':$scope.$root.token})
					      .then(function (res){ 
					      		if(res.data.ack == true){
									var counter = 100;
									$.each($scope.selection,function(index,elem){
										$scope.fields[counter] = {'id':elem,'description':res.data.response[elem].description} ;
										counter = counter + 1;
									})
									$.each(res.data.response,function(index,elem){
									 	if ($scope.selection.indexOf(index) < 0)
									 	{	
									 		$scope.fields[counter] = {'id':index,'description':elem.description} ;
									 		counter = counter + 1;
									 	}
									 })
								}
								else
									toaster.pop('error', 'Error', "No field found!");
					    });
						
		      		}
					else
						toaster.pop('error', 'Error', "No country found!");


		    });
		      	
	      });
	     $scope.formUrl = function() {
				return "app/views/modules_filters/_form.html";
			}
		$scope.showLoader = false;
			
	}, 3000);
	

 $scope.delete = function () {
    ngDialog.openConfirm({

      template: 'modalDeleteDialogId',
      className: 'ngdialog-theme-default'
    }).then(function (value) {
      $http
		  .post(deleteUrl, {id:$stateParams.id,'token':$scope.$root.token})
		  .then(function (res) {
				if(res.data.ack == true)
					toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
				else
					toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
				$timeout(function(){ $state.go('app.filters'); }, 3000);
		  });
    }, function (reason) {
      console.log('Modal promise rejected. Reason: ', reason);
    });
 
	//if(popupService.showPopup('Would you like to delete?')) {
		
	//  }*/
 };
	
};

function FilterEditController($scope, $stateParams, $http, $state, $resource,toaster,$timeout){

	$scope.formTitle = 'Module Filter';
	$scope.btnCancelUrl = 'app.filters';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'General','url':'#','isActive':false},
		 {'name':'Filter','url':'app.filters','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];	
	
 	$scope.check_disabled = 1 ;
 	$scope.module_id = 0;
    $scope.rec = {}; 
    $scope.myNestable2 = {};
	$scope.accounts = {}; 
	$scope.serialized = [];
	$scope.showLoader = true;
	var postUrl = $scope.$root.setup+"general/get-module-filter";
	var updateUrl = $scope.$root.setup+"general/update-module-filter";
	var filterDetialsUrl = $scope.$root.setup+"general/get-filter-details";
	var modulesUrl = $scope.$root.setup+"general/modules-codes";
	var fieldsUrl = $scope.$root.setup+"general/get-module-fields";
	var delFilterDetailUrl = $scope.$root.setup+"general/delete-filter-details";
	var addFilterDetailUrl = $scope.$root.setup+"general/add-filter-details";	  
	var postData = {'token': $scope.$root.token,'id': $stateParams.id };
	$scope.fields = {}; 
	$scope.selection = [];
	$scope.is_default  = false;
	$scope.is_public  = false;
	$scope.getDefault = function (values){
	   		$scope.is_default = values;
	   }
	  
	$scope.getPublic = function (values){
	   		$scope.is_public = values;
	   }

	$timeout(function(){
		$http
	      .post(postUrl, postData)
	      .then(function (res) {
	      	$scope.rec = res.data.response;
	      	if ($scope.rec.is_default == 'Yes')
				$scope.is_default = true;
			if ($scope.rec.is_public == 'Yes')
				$scope.is_public = true;

			// get filter details
			$http
		      .post(filterDetialsUrl, {'filter_id':$stateParams.id,'token':$scope.$root.token})
		      .then(function (res) {

		        	if(res.data.ack == true){
						$.each(res.data.response,function(index,elem){

							$scope.selection.push(elem.field_id);

						});

					}
					else
						toaster.pop('error', 'Error', "No record in filter details!");
		    	});


		    // get modules
		    $http
		      .post(modulesUrl, {'token':$scope.$root.token,'all':1})
		      .then(function (res){ 
			      	//console.log(res.data.response);
		      		if(res.data.ack == true){
		      			$scope.accounts = res.data.response;
		      			$.each($scope.accounts,function(index,elem){if(elem.id == $scope.rec.module_codes_id){$scope.module_codes = elem;}})
						$scope.fields = {};
						$http
					      .post(fieldsUrl, {'module_id':$scope.rec.module_codes_id,'token':$scope.$root.token})
					      .then(function (res){ 
					      		if(res.data.ack == true){
									var counter = 100;
									$.each($scope.selection,function(index,elem){
										$scope.fields[counter] = {'id':elem,'description':res.data.response[elem].description} ;
										counter = counter + 1;
									})
									$.each(res.data.response,function(index,elem){
									 	if ($scope.selection.indexOf(index) < 0)
									 	{	
									 		$scope.fields[counter] = {'id':index,'description':elem.description} ;
									 		counter = counter + 1;
									 	}
									 })
								}
								else
									toaster.pop('error', 'Error', "No field found!");
					    });
						
		      		}
					else
						toaster.pop('error', 'Error', "No country found!");
		    });
		      	
	      });
	    
	    $scope.formUrl = function() {
			return "app/views/modules_filters/_form.html";
		}
	   $scope.showLoader = false;
	 
	}, 3000);

	 $scope.myNestable2.onchange = function() {
		$scope.serialized = $scope.myNestable2.serialize();
	  };
	  
			

	   $scope.toggleSelection = function toggleSelection(fruitName) {
	      var idx = $scope.selection.indexOf(fruitName);
	     
	      // is currently selected
	      if (idx > -1) {
	        $scope.selection.splice(idx, 1);
	      }
	      
	      // is newly selected
	      else {
	        $scope.selection.push(fruitName);
	      }

    };

    //console.log($scope.myNestable2);


	$scope.getId = function (){
	       $scope.selection = [];
		   $scope.module_id =  this.module_codes.id;
		   
			$scope.fields = {}; 
			$http
		      .post(fieldsUrl, {'module_id':$scope.module_id,'token':$scope.$root.token})
		      .then(function (res){ 
		      		if(res.data.ack == true)
						$scope.fields = res.data.response;
					else
						toaster.pop('error', 'Error', "No country found!");
		    });
		
	  }  


	$scope.search = function(nameKey, myArray){
	    angular.forEach($scope.selection, function(value, key) { if (value == nameKey) {$scope.isExit = 1; }});
	}

	
	$scope.update = function(rec){
		var filedStr = '';
		 angular.forEach($scope.selection, function(value, key) { filedStr = filedStr + value + ','; });
		 
		 rec.fields = filedStr.substring(0,filedStr.length-1);
		 rec.token = $scope.$root.token;
		 if($scope.module_id > 0)
		 	rec.module_codes_id = $scope.module_id;
		 else 
		 	rec.module_codes_id = $scope.module_codes.value;
		
		 if ($scope.is_default  == true) $scope.rec.is_default = 'Yes'; 	else $scope.rec.is_default = 'No';
		 if ($scope.is_public == true) 	$scope.rec.is_public = 'Yes';	else $scope.rec.is_public = 'No';
		    
		   
		$http
	      .post(updateUrl, rec) 
	      .then(function (res) {
				var id = $stateParams.id;
				var counter = 1;
				
				if ($scope.serialized !== undefined && $scope.serialized !== null && $scope.serialized.length > 0) {	
					$http.post(delFilterDetailUrl, {id:id,token:$scope.$root.token}).then(function (temp) {
						angular.forEach($scope.serialized, function(value, key) {
							
							$scope.isExit = 0;
							isExit = $scope.search(value.id, $scope.selection);
							if ($scope.isExit == 1 ) {
									
								rec_filed = {};
								rec_filed.filter_id = $stateParams.id;
								rec_filed.field_id = value.id;
								rec_filed.sequence = counter;
								rec_filed.token = $scope.$root.token;								
								counter = counter + 1;
								//console.log('counter here =====>>>>'+counter)
								//console.log(rec_filed);
								$http.post(addFilterDetailUrl, rec_filed).then(function (res) { });
							}
						});
					});
				}
				//
					toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				//$scope.$root.$broadcast("myOppurtunityEventReload", {id:'test'});
				$timeout(function(){
					$scope.selection = [];	

					if ($stateParams.md != '')
							$state.go('app.'+$stateParams.md, {'filter_id':$stateParams.id});
					else
						$state.go('app.filters');
				 }, 3000);
				//}
				//else
				//	toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
	      });
  }
	
}