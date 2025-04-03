CrmTabsFieldsController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.crm-tabs-fields', {
        url: '/crm-tabs-fields',
        title: 'CRM Tabs Fields',
        templateUrl: helper.basepath('crm_tabs_fields/crm_tabs_fields.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.add-crm-tabs-fields', {
        url: '/crm-tabs-fields/add',
        title: 'Add CRM Tabs Fields',
        templateUrl: helper.basepath('add.html'),
		controller: 'CrmTabsFieldsAddController'
    })
	.state('app.view-crm-tabs-fields', {
		url: '/crm-tabs-fields/:id/view',
        title: 'View ',
        templateUrl: helper.basepath('view.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'CrmTabsFieldsViewController'
	  })
	  .state('app.edit-crm-tabs-fields', {
		url: '/crm-tabs-fields/:id/edit',
        title: 'Edit CRM Tabs Fields',
        templateUrl: helper.basepath('edit.html'),
		controller: 'CrmTabsFieldsEditController'
	  })
  
 }]);

myApp.controller('CrmTabsFieldsController', CrmTabsFieldsController);
myApp.controller('CrmTabsFieldsAddController', CrmTabsFieldsAddController);
myApp.controller('CrmTabsFieldsViewController', CrmTabsFieldsViewController);
myApp.controller('CrmTabsFieldsEditController', CrmTabsFieldsEditController);

function CrmTabsFieldsController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster) {
    'use strict';

	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'CRM Tabs Fields','url':'#','isActive':false}];
	var postData = {
	    'token': $scope.$root.token,
	    'all': "1"
  	};
		 
    var Api = $scope.$root.setup+"crm/crm-tabs-fields";
    var tabUrl = $scope.$root.setup+"crm/crm-tabs";
	$scope.arr_tabs = {};
	$scope.showLoader = true;
	$scope.tab_id = $scope.$root.$storage.getItem("tab_id");

	$http
      .post(tabUrl, {'token':$scope.$root.token,'all':1})
      .then(function (res) {
        	if(res.data.ack == true){
				$scope.arr_tabs = res.data.response;
				$scope.tabs = $scope.arr_tabs[0];
				if($scope.tab_id == undefined){
						postData.tab_id = $scope.tabs.id;
				}else{
					angular.forEach($scope.arr_tabs ,function(obj,index){
						if($scope.tab_id == obj.id){$scope.tabs = obj};
					});
					postData.tab_id = $scope.tab_id;
				}

			}
			else
				toaster.pop('error', 'Error', "No tab found!");
    });

      //console.log($scope.$root.tab_id);
    $scope.getTabFields = function(tab_id){
    	if(tab_id == undefined){
    		postData.tab_id = this.tabs.id;
    		$scope.$root.$storage.setItem("tab_id",this.tabs.id);
    	}
    	else
    		postData.tab_id = tab_id;

		$http
	      .post(Api,postData)
	      .then(function (res) {
			$scope.data = res.data.response;
	      });

    }  
    
    $timeout(function(){
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
	      $scope.showLoader = false;
    },3000);

    
	var move = function (origin, destination,tab_id) {
        var temp = $scope.data[destination];
        $scope.data[destination] = $scope.data[origin];
        $scope.data[origin] = temp;

        var sortUrl = $scope.$root.setup+"crm/sort-tab-fields";
   	    $http
		  .post(sortUrl, {'record':$scope.data, 'token':$scope.$root.token,tab_id:tab_id})
		  .then(function (res) {			  
		  });
	};

	$scope.moveUp = function(index,tab_id){			
			move(index, index - 1,tab_id);
	};

	$scope.moveDown = function(index,tab_id){					
			move(index, index + 1,tab_id);
	};


    
    $scope.delete = function (id,index,data) {
    	var delUrl = $scope.$root.setup+"crm/delete-crm-tab-field";
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

function CrmTabsFieldsAddController($scope, $stateParams, $http, $state,toaster){

	 $scope.formTitle = 'CRM Tabs Fields';
	 $scope.btnCancelUrl = 'app.crm-tabs-fields';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'CRM Tabs Fields','url':'app.crm-tabs-fields','isActive':false},
		 {'name':'Add','url':'#','isActive':false}];

	$scope.formUrl = function() {
		return "app/views/crm_tabs_fields/_form.html";
	  }
	  
	$scope.rec = {};
	var postUrl = $scope.$root.setup+"crm/add-crm-tab-field";
	$scope.arr_tabs = {};
	$scope.arr_modules = {};
	$scope.show_module_list = false;
	var tabUrl = $scope.$root.setup+"crm/crm-tabs";
	
	$http
      .post(tabUrl, {'token':$scope.$root.token,'all':1})
      .then(function (res) {
        	if(res.data.ack == true){
				$scope.arr_tabs = res.data.response;
			}
			else
				toaster.pop('error', 'Error', "No tab found!");
    });

    $scope.setFieldName = function(text){
    	if(text != undefined && text != '')
    		$scope.rec.field_name = fieldName(text);
    }

    function fieldName(Text){
    	return Text.toLowerCase().replace(/ /g,'_').replace(/[-]+/g, '_').replace(/[^\w-]+/g,'');
	}

	$scope.checkFieldName = function(rec){
    	var tab_id = rec.field_tab != undefined?rec.field_tab.id:undefined;
    	var field_name = rec.field_name;
    	var checkFieldUrl = $scope.$root.setup+"crm/get-crm-tab-field-by-name";

    	if(tab_id != undefined && field_name != undefined){
			$http
		      .post(checkFieldUrl, {'token':$scope.$root.token,'tab_id':tab_id,field_name:field_name})
		      .then(function (res) {
		        	if(res.data.ack == true){
						toaster.pop('error', 'Info', "Field Name already exist in this tab!");
						angular.element('#field_name').val('');
						angular.element('#field_name').trigger('focus');
						rec.field_name = '';
					}
					
		    });
		  }
		  
    }  

    $scope.getModules = function(){
    	var type = this.rec.field_type.id;
    	if(type == 'select'){
	    	var moduleUrl = $scope.$root.setup+"general/modules-codes";
			$http
		      .post(moduleUrl, {'token':$scope.$root.token,'all':1})
		      .then(function (res) {
		        	if(res.data.ack == true){
						$scope.arr_modules = res.data.response;
					}
					
		    });
		  $scope.show_module_list = true;
		 }
		else{
			$scope.show_module_list = false;
		}
    }  

    $scope.column = 'Left';
    $scope.is_required = 0;
    $scope.is_defaults = 0;
    $scope.setRequired = function(value){
    	$scope.is_required = value;
    }
    $scope.setColumn = function(value){
    	$scope.column = value;
    }
    $scope.setDefault = function(value){
    	$scope.is_defaults = value;
    }
	$scope.add = function(rec){
	 	 rec.status = $scope.rec.field_status != undefined? $scope.rec.field_status.value:1
	 	 rec.tab_id = $scope.rec.field_tab != undefined? $scope.rec.field_tab.id:0
	 	 rec.type = $scope.rec.field_type != undefined? $scope.rec.field_type.id:'text'
	 	 rec.module_id = $scope.rec.field_module_id != undefined? $scope.rec.field_module_id.id:0
	 	 rec.column = $scope.column;
	 	 rec.is_required = $scope.is_required;
	 	 rec.is_defaults = $scope.is_defaults;
		 rec.token = $scope.$root.token;
		 $http
	      .post(postUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
	        		$scope.rec = {};
	        		$scope.column = 'Left';
   					$scope.is_required = 0;
   					$scope.is_defaults = 0;
   					$scope.show_module_list = false;
					 toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					 //$timeout(function(){ $state.go('app.crm-tabs-fields'); }, 3000);
				}
				else
					toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
	      });
  	}
}

function CrmTabsFieldsViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster){
	 $scope.formTitle = 'CRM Tabs Fields';
	 $scope.btnCancelUrl = 'app.crm-tabs-fields';
	 $scope.hideDel = false;
	 $scope.show_module_list = false;
	 $scope.showLoader = true;
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'CRM Tabs Fields','url':'app.crm-tabs-fields','isActive':false}];
		 
	
		
	$scope.gotoEdit = function(){
	  $state.go("app.edit-crm-tabs-fields",{id:$stateParams.id});
	};
	
		 
  	$scope.rec = {};
	var postUrl = $scope.$root.setup+"crm/get-crm-tab-field";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id };
	var tabUrl = $scope.$root.setup+"crm/crm-tabs";
	var moduleUrl = $scope.$root.setup+"general/modules-codes";
	$scope.arr_tabs = {};
	$scope.arr_modules = {};

	$scope.getModules = function(module_id){
		$http
	      .post(moduleUrl, {'token':$scope.$root.token,'all':1})
	      .then(function (res) {
	        	if(res.data.ack == true){
					$scope.arr_modules = res.data.response;
			      		angular.forEach($scope.arr_modules,function(obj,index){
			      			if(obj.id == module_id){
			      				$scope.rec.field_module_id = obj};
			      			});
		      		$scope.show_module_list = true;
				}
	    });
    }
	

	$http
      .post(tabUrl, {'token':$scope.$root.token,'all':1})
      .then(function (res) {
        	if(res.data.ack == true){
				$scope.arr_tabs = res.data.response;
			}
			else
				toaster.pop('error', 'Error', "No tab found!");
    });

    $timeout(function(){
		$http
	      .post(postUrl, postData)
	      .then(function (res) {
	      	$scope.rec = res.data.response;
	      	$scope.is_required = res.data.response.is_required;
	      	$scope.is_defaults = res.data.response.is_default;
	      	$scope.column = res.data.response.column;

		      	angular.forEach($scope.$root.arr_status,function(obj,index){
		      		if(obj.value == res.data.response.status){$scope.rec.field_status = obj};
		      	});
		      	angular.forEach($scope.arr_tabs,function(obj,index){
		      		if(obj.id == res.data.response.tab_id){$scope.rec.field_tab = obj};
		      	});
		      	angular.forEach($scope.$root.arr_field_type,function(obj,index){
		      		if(obj.id == res.data.response.type){$scope.rec.field_type = obj};
		      	});
		      	if(res.data.response.type == 'select'){
		      		$scope.getModules(res.data.response.module_id);
		      	}
	      });
			$scope.formUrl = function() {
				return "app/views/crm_tabs_fields/_form.html";
			  }
			  $scope.showLoader = false;
		},3000);
};

function CrmTabsFieldsEditController($scope, $stateParams, $http, $state, $resource,toaster){

	$scope.formTitle = 'CRM Tabs Fields';
	 $scope.btnCancelUrl = 'app.crm-tabs-fields';
	 $scope.hideDel = false;
	 $scope.showLoader = true; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'CRM Tabs Fields','url':'app.crm-tabs-fields','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];	
	
	
 	$scope.rec = {};
	var postUrl = $scope.$root.setup+"crm/get-crm-tab-field";
	var updateUrl = $scope.$root.setup+"crm/update-crm-tab-field";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id };
	var tabUrl = $scope.$root.setup+"crm/crm-tabs";
	var moduleUrl = $scope.$root.setup+"general/modules-codes";

	$scope.arr_tabs = {};
	$scope.arr_modules = {};

	$scope.getModules = function(module_id){
		$http
	      .post(moduleUrl, {'token':$scope.$root.token,'all':1})
	      .then(function (res) {
	        	if(res.data.ack == true){
					$scope.arr_modules = res.data.response;
			      		angular.forEach($scope.arr_modules,function(obj,index){
			      			if(obj.id == module_id){
			      				$scope.rec.field_module_id = obj};
			      			});
		      		$scope.show_module_list = true;
				}
	    });
    }
	

	$http
      .post(tabUrl, {'token':$scope.$root.token,'all':1})
      .then(function (res) {
        	if(res.data.ack == true){
				$scope.arr_tabs = res.data.response;
			}
			else
				toaster.pop('error', 'Error', "No tab found!");
    });

    $scope.column = 'Left';
    $scope.is_required = 0;
    $scope.is_defaults = 0;

	$timeout(function(){
		$http
	      .post(postUrl, postData)
	      .then(function (res) {
	      	$scope.rec = res.data.response;
	      	$scope.is_required = res.data.response.is_required;
	      	$scope.is_defaults = res.data.response.is_default;
	      	$scope.column = res.data.response.column;

		      	angular.forEach($scope.$root.arr_status,function(obj,index){
		      		if(obj.value == res.data.response.status){$scope.rec.field_status = obj};
		      	});
		      	angular.forEach($scope.arr_tabs,function(obj,index){
		      		if(obj.id == res.data.response.tab_id){$scope.rec.field_tab = obj};
		      	});
		      	angular.forEach($scope.$root.arr_field_type,function(obj,index){
		      		if(obj.id == res.data.response.type){$scope.rec.field_type = obj};
		      	});
		      	if(res.data.response.type == 'select'){
		      		$scope.getModules(res.data.response.module_id);
		      	}
	      });
			$scope.formUrl = function() {
				return "app/views/crm_tabs_fields/_form.html";
			  }
			  $scope.showLoader = false;
		},3000);

	
    $scope.setRequired = function(value){
    	$scope.is_required = value;
    }

    $scope.setDefault = function(value){
    	$scope.is_defaults = value;
    }
    $scope.setColumn = function(value){
    	$scope.column = value;
    }

    $scope.setFieldName = function(text){
    	if(text != undefined && text != '')
    		$scope.rec.field_name = fieldName(text);
    }

    function fieldName(Text){
    	return Text.toLowerCase().replace(/ /g,'_').replace(/[-]+/g, '_').replace(/[^\w-]+/g,'');
	}

	$scope.checkFieldName = function(rec){
    	var tab_id = rec.field_tab != undefined?rec.field_tab.id:undefined;
    	var field_name = rec.field_name;
    	var checkFieldUrl = $scope.$root.setup+"crm/get-crm-tab-field-by-name";

    	if(tab_id != undefined && field_name != undefined){
			$http
		      .post(checkFieldUrl, {'token':$scope.$root.token,'tab_id':tab_id,field_name:field_name})
		      .then(function (res) {
		        	if(res.data.ack == true){
						toaster.pop('error', 'Error', "Field Name already exist in this tab!");
						angular.element('#field_name').val('');
						angular.element('#field_name').trigger('focus');
						rec.field_name = '';
					}
					
		    });
		  }
		  
    }  

    $scope.update = function(rec){
		 rec.status = $scope.rec.field_status != undefined? $scope.rec.field_status.value:1
	 	 rec.tab_id = $scope.rec.field_tab != undefined? $scope.rec.field_tab.id:0
	 	 rec.type = $scope.rec.field_type != undefined? $scope.rec.field_type.id:'text'
	 	 rec.module_id = $scope.rec.field_module_id != undefined? $scope.rec.field_module_id.id:0
	 	 rec.token = $scope.$root.token;
	 	 rec.is_required = $scope.is_required;
	 	 rec.is_defaults = $scope.is_defaults;
	 	 rec.column = $scope.column;
	 	 /*console.log(rec);
	 	 return;*/
		 $http
	      .post(updateUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
				toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 $timeout(function(){ $state.go('app.crm-tabs-fields'); }, 3000);
			}
			else
				toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
      });
  	}
	
}


