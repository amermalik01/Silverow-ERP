CrmController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.crm', {
        url: '/crm',
        title: 'CRM',
        templateUrl: helper.basepath('crm/crm.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.add-crm', {
        url: '/crm/add',
        title: 'Add CRM',
        templateUrl: helper.basepath('crm/_form.html'),
		controller: 'CrmAddController'
    })
	.state('app.view-crm', {
		url: '/crm/:id/view',
        title: 'View ',
        templateUrl: helper.basepath('crm/_form.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'CrmViewController'
	  })
	  .state('app.edit-crm', {
		url: '/crm/:id/edit',
        title: 'Edit CRM',
        templateUrl: helper.basepath('crm/_form.html'),
		controller: 'CrmEditController'
	  })
  
 }]);

myApp.controller('CrmController', CrmController);
myApp.controller('CrmAddController', CrmAddController);
myApp.controller('CrmViewController', CrmViewController);
myApp.controller('CrmEditController', CrmEditController);

function CrmController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster) {
    'use strict';

	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'CRM','url':'#','isActive':false}];
		 
 	var vm = this;
    var Api = $scope.$root.sales+"crm/crm/listings";
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
 			$scope.checkData = ngDataService.getData( $defer, params, Api,$filter,$scope,postData);
        }
    });


    $scope.$data = {};
    $scope.delete = function (id,index,$data) {
    	var delUrl = $scope.$root.setup+"crm/delete-payment-method";
	    ngDialog.openConfirm({
	      template: 'modalDeleteDialogId',
	      className: 'ngdialog-theme-default-custom'
	    }).then(function (value) {
	      $http
			  .post(delUrl, {id:id,'token': $scope.$root.token})
			  .then(function (res) {
					if(res.data.ack == true){
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
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

function CrmAddController($scope, $stateParams, $http, $state,toaster,$rootScope){

	 $scope.formTitle = 'CRM';
	 $scope.btnCancelUrl = 'app.crm';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'CRM','url':'app.crm','isActive':false},
		 {'name':'Add','url':'#','isActive':false}];

	  $scope.arr_combo = [];
	  $scope.formData = {};
	  $scope.tab_module_id = 0;

	$scope.getComboValue = function(field_id){
		var combo_id = this.formData[field_id].value.id;
		angular.forEach($scope.arr_combo[field_id],function(elem, index){
			if(combo_id == elem.id){
				$scope.formData[field_id].value = $scope.arr_combo[field_id][index];
			}
		});
	}
	
	var tabsUrl = $scope.$root.setup+"crm/crm-tabs";
	$http
      .post(tabsUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true){
        		$scope.getTabForm(res.data.response[0].id);
        		console.log(res.data.response[0].module_id);
        		$rootScope.tab_module_id = res.data.response[0].module_id;
        		$scope.arrTabs = res.data.response;
        	}
      });
	
	$scope.getTabForm = function(tab_id,tab_module_id){
		$rootScope.tab_module_id = tab_module_id;
		$scope.tab_module_id = tab_module_id;
		$scope.arrFields = {};
		$scope.formData = {};
		var fieldsUrl = $scope.$root.setup+"crm/get-crm-tab-field-by-tab-id";
		$http
	      .post(fieldsUrl, {tab_id:tab_id,'token':$scope.$root.token})
	      .then(function (res) {
	        	if(res.data.ack == true){
	        		$scope.arrFields = res.data.response;

		        $timeout(function(){
		        		angular.forEach($scope.arrFields,function(obj,index){
						$scope.formData[obj.id] = obj;
						/*if(obj.module_id != null){
							angular.forEach($scope.arr_combo[obj.field_id],function(elem, index2){
								if(obj.value == elem.id){
									$scope.formData[obj.field_id].value = $scope.arr_combo[obj.field_id][index2];
								}
							});
						}*/

					});
	        	},3000);
	         }
	      });

	}

	$scope.fillCombo = function(module_id,field_id){
		var arr_temp = {};
		var arr_temp2 = [];

		angular.forEach($scope.arrFields,function(obj,index){
			if(obj.id == field_id) arr_temp = obj;
		});
		
		var fillComboUrl = $scope.$root.setup+"general/fill-combo";
		
		$timeout(function(){
		$http
	      .post(fillComboUrl, {'module_id':module_id,'token':$scope.$root.token})
	      .then(function (res) {
	        	if(res.data.ack == true){
	        		//console.log(res.data.response);
					angular.forEach(res.data.response,function(obj,index){
								arr_temp3 = {};
								arr_temp3.column = arr_temp.column;
								arr_temp3.field_id = arr_temp.id;
								arr_temp3.is_required = arr_temp.is_required;
								arr_temp3.label = arr_temp.label;
								arr_temp3.field_name = arr_temp.field_name;
								arr_temp3.module_id = arr_temp.module_id;
								arr_temp3.tab_id = arr_temp.tab_id;
								arr_temp3.type = arr_temp.type;
								arr_temp3.name = obj.name;
								arr_temp3.id = obj.id; 
								arr_temp2.push(arr_temp3);
					});
					
					$scope.arr_combo[field_id] = arr_temp2;
					if(arr_temp2[0].field_name == 'country'){
						angular.forEach(arr_temp2,function(obj1,index1){
							if(obj1.id == $rootScope.defaultCountry){
								$scope.formData[field_id].value = obj1;
							}
						});
					}

					if(arr_temp2[0].field_name == 'currency'){
						angular.forEach(arr_temp2,function(obj1,index1){
							if(obj1.id == $rootScope.defaultCurrency){
								$scope.formData[field_id].value = obj1;
							}
						});
					}
					
				}

	      });
	    },3000);

	}
	
	var postUrl = $rootScope.sales+"crm/crm/add-crm";
	 $scope.add = function(formData){
		 formData.tab_module_id = $rootScope.tab_module_id;	
		 formData.token = $scope.$root.token;
		 formData.crm_id = $rootScope.crm_id;
		 $http
	      .post(postUrl, formData)
	      .then(function (res) {
	        	if(res.data.ack == true){
	        		$rootScope.crm_id = res.data.id;
					 toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					 //$timeout(function(){ $state.go('app.crm'); }, 3000);
				}
				else
					toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(104));
	      });
  	}
}

function CrmViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster,$rootScope){
	$scope.check_readonly = true;	
	
	$scope.gotoEdit = function(){
	  $state.go("app.edit-crm",{id:$stateParams.id});
	};
	
    $scope.formTitle = 'CRM';
	$scope.btnCancelUrl = 'app.crm';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'CRM','url':'app.crm','isActive':false},
		 {'name':'View','url':'#','isActive':false}];

	  $scope.arr_combo = [];
	  $scope.formData = {};
	  $scope.rec = {};
	  $scope.tab_module_id = 0;


	$scope.fillCombo = function(module_id,field_id){
		var arr_temp = {};
		var arr_temp2 = [];

		angular.forEach($scope.arrFields,function(obj,index){
			if(obj.id == field_id) arr_temp = obj;
		});
		
		var fillComboUrl = $scope.$root.setup+"general/fill-combo";
		
		$timeout(function(){
		$http
	      .post(fillComboUrl, {'module_id':module_id,'token':$scope.$root.token})
	      .then(function (res) {
	        	if(res.data.ack == true){
					angular.forEach(res.data.response,function(obj,index){
								arr_temp3 = {};
								arr_temp3.column = arr_temp.column;
								arr_temp3.field_id = arr_temp.id;
								arr_temp3.is_required = arr_temp.is_required;
								arr_temp3.label = arr_temp.label;
								arr_temp3.field_name = arr_temp.field_name;
								arr_temp3.module_id = arr_temp.module_id;
								arr_temp3.tab_id = arr_temp.tab_id;
								arr_temp3.type = arr_temp.type;
								arr_temp3.name = obj.name;
								arr_temp3.id = obj.id; 
								arr_temp2.push(arr_temp3);
					});
					
					$scope.arr_combo[field_id] = arr_temp2;

					
				}

	      });
	    },3000);

	}  

	$scope.getComboValue = function(field_id){
		var combo_id = this.formData[field_id].value.id;
		angular.forEach($scope.arr_combo[field_id],function(elem, index){
			if(combo_id == elem.id){
				$scope.formData[field_id].value = $scope.arr_combo[field_id][index];
			}
		});
	}
	
	var tabsUrl = $scope.$root.setup+"crm/crm-tabs";
	$http
      .post(tabsUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true){
        		$scope.getTabForm(res.data.response[0].id);
        		$rootScope.tab_module_id = res.data.response[0].module_id;
        		$scope.arrTabs = res.data.response;
        	}
      });
	
	$scope.getTabForm = function(tab_id,tab_module_id){
		

		$rootScope.tab_module_id = tab_module_id;
		$scope.tab_module_id = tab_module_id;
		$scope.arrFields = {};
		$scope.formData = {};
		$scope.tempFormData = {};
		$scope.rec = {};
		var fieldsUrl = $scope.$root.setup+"crm/get-crm-tab-field-by-tab-id";

		var crmUrl = $rootScope.sales+"crm/crm/get-crm";
		 $http
	      .post(crmUrl, {token:$rootScope.token,id:$stateParams.id})
	      .then(function (res) {
	        	if(res.data.ack == true){
	        		$scope.showFormLoader = true;
		
	        		$scope.rec = res.data.response;
	        		$http
				      .post(fieldsUrl, {tab_id:tab_id,'token':$scope.$root.token})
				      .then(function (res1) {
				        	if(res.data.ack == true){
				        		$scope.arrFields = res1.data.response;
				        		$scope.showLoader = true;
				        	    angular.forEach($scope.arrFields,function(obj,index){
				        	    	angular.forEach($scope.rec,function(field_value,field){
					        				if(obj.field_name == field){
					        					if(obj.module_id > 0){
					        						obj.field_value = field_value;
					        					}
					        					else
					        						obj.value = field_value;
					        				}
					        			});
										$scope.formData[obj.id] = obj;
									});
					        		$timeout(function(){
						        		angular.forEach($scope.arrFields,function(obj,index){
											if(obj.module_id > 0){
												angular.forEach($scope.arr_combo[obj.id],function(elem, index2){
													if(obj.field_value == elem.id){
														$scope.formData[obj.id].value = $scope.arr_combo[obj.id][index2];
													}
												});
											}
									    });
										    $scope.$apply(function () {
									            $scope.formData;
									            $scope.showLoader = false;
									        });
								    },10000);
									$scope.showFormLoader = false;
					        		
				         }
				      });
					
				}
				else
					toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
	      }); 

		

	}
	
};

function CrmEditController($scope, $stateParams, $http, $state, $resource,toaster,$rootScope){
	$scope.check_readonly = false;	
	
	$scope.gotoEdit = function(){
	  $state.go("app.edit-crm",{id:$stateParams.id});
	};
	
    $scope.formTitle = 'CRM';
	$scope.btnCancelUrl = 'app.crm';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'CRM','url':'app.crm','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];

	  $scope.arr_combo = [];
	  $scope.formData = {};
	  $scope.rec = {};
	  $scope.tab_module_id = 0;
	  $rootScope.crm_id = $stateParams.id;

	$scope.fillCombo = function(module_id,field_id){
		var arr_temp = {};
		var arr_temp2 = [];

		angular.forEach($scope.arrFields,function(obj,index){
			if(obj.id == field_id) arr_temp = obj;
		});
		
		var fillComboUrl = $scope.$root.setup+"general/fill-combo";
		
		$timeout(function(){
		$http
	      .post(fillComboUrl, {'module_id':module_id,'token':$scope.$root.token})
	      .then(function (res) {
	        	if(res.data.ack == true){
					angular.forEach(res.data.response,function(obj,index){
								arr_temp3 = {};
								arr_temp3.column = arr_temp.column;
								arr_temp3.field_id = arr_temp.id;
								arr_temp3.is_required = arr_temp.is_required;
								arr_temp3.label = arr_temp.label;
								arr_temp3.field_name = arr_temp.field_name;
								arr_temp3.module_id = arr_temp.module_id;
								arr_temp3.tab_id = arr_temp.tab_id;
								arr_temp3.type = arr_temp.type;
								arr_temp3.name = obj.name;
								arr_temp3.id = obj.id; 
								arr_temp2.push(arr_temp3);
					});
					
					$scope.arr_combo[field_id] = arr_temp2;
					if(arr_temp2[0].field_name == 'country'){
						angular.forEach(arr_temp2,function(obj1,index1){
							if(obj1.id == $rootScope.defaultCountry){
								$scope.formData[field_id].value = obj1;
							}
						});
					}

					if(arr_temp2[0].field_name == 'currency'){
						angular.forEach(arr_temp2,function(obj1,index1){
							if(obj1.id == $rootScope.defaultCurrency){
								$scope.formData[field_id].value = obj1;
							}
						});
					}

					
				}

	      });
	    },3000);

	}  

	$scope.getComboValue = function(field_id){
		var combo_id = this.formData[field_id].value.id;
		angular.forEach($scope.arr_combo[field_id],function(elem, index){
			if(combo_id == elem.id){
				$scope.formData[field_id].value = $scope.arr_combo[field_id][index];
			}
		});
	}
	
	var tabsUrl = $scope.$root.setup+"crm/crm-tabs";
	$http
      .post(tabsUrl, {'token':$scope.$root.token})
      .then(function (res) {
        	if(res.data.ack == true){
        		$scope.getTabForm(res.data.response[0].id,res.data.response[0].module_id,0);
        		$scope.arrTabs = res.data.response;
        	}
      });
	
	$scope.getTabForm = function(tab_id,tab_module_id,index){
		

		$rootScope.tab_module_id = tab_module_id;
		$scope.tab_module_id = tab_module_id;
		$scope.arrFields = {};
		$scope.formData = {};
		$scope.tempFormData = {};
		$scope.rec = {};
		var fieldsUrl = $scope.$root.setup+"crm/get-crm-tab-field-by-tab-id";

		var crmUrl = $rootScope.sales+"crm/crm/get-crm";
		 $http
	      .post(crmUrl, {token:$rootScope.token,id:$stateParams.id})
	      .then(function (res) {
	        	if(res.data.ack == true){
	        		$scope.showFormLoader = true;
					
					if(index == 0)
	        		    $scope.rec = res.data.response;
	        		
	        		$http
				      .post(fieldsUrl, {tab_id:tab_id,'token':$scope.$root.token})
				      .then(function (res1) {
				        	if(res.data.ack == true){
				        		$scope.arrFields = res1.data.response;
				        		$scope.showLoader = true;
				        	    angular.forEach($scope.arrFields,function(obj,index){
				        	    	angular.forEach($scope.rec,function(field_value,field){
				        	    		console.log(obj.field_name +'==='+field_value+'=='+ field);
					        				if(obj.field_name == field){
					        					if(obj.module_id > 0){
					        						obj.field_value = field_value;
					        					}
					        					else
					        						obj.value = field_value;
					        				}
					        			});
										$scope.formData[obj.id] = obj;
									});
					        		$timeout(function(){
						        		angular.forEach($scope.arrFields,function(obj,index){
											if(obj.module_id > 0){
												angular.forEach($scope.arr_combo[obj.id],function(elem, index2){
													if(obj.field_value == elem.id){
														$scope.formData[obj.id].value = $scope.arr_combo[obj.id][index2];
													}
												});
											}
									    });
										    $scope.$apply(function () {
									            $scope.formData;
									            $scope.showLoader = false;
									        });
								    },10000);
									$scope.showFormLoader = false;
					        		
				         }
				      });
					
				}
				else
					toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
	      }); 
	}

	var editUrl = $rootScope.sales+"crm/crm/update-crm";
	 $scope.add = function(formData,index){
	 	 formData.tab_module_id = $rootScope.tab_module_id;	
		 formData.token = $scope.$root.token;
		 var id = angular.element('.hdn_id').val();
		 	console.log(id);
		 	return;
		 if(index > 0){
		 	formData.crm_id = $stateParams.id;
		 	
		 	formData.id = $stateParams.id;
		 }
		 else
		 	formData.id = $stateParams.id;

		 $http
	      .post(editUrl, formData)
	      .then(function (res) {
	        	if(res.data.ack == true){
					 toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					 //$timeout(function(){ $state.go('app.crm'); }, 3000);
				}
				else
					toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(104));
	      });
  	}
}


