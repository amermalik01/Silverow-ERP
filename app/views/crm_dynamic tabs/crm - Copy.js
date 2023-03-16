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

function CrmAddController($scope, $stateParams, $http, $state,toaster){

	 $scope.formTitle = 'CRM';
	 $scope.btnCancelUrl = 'app.crm';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'CRM','url':'app.crm','isActive':false},
		 {'name':'Add','url':'#','isActive':false}];

	/*$scope.formUrl = function() {
		return "app/views/crm/_form.html";
	  }*/
	  $scope.arr_combo = [];
	  $scope.formData = {};
	  $scope.rec = [
				{'tab_id':1,'field_id':1,'type':'text','field_name':'name','label':'Name','is_required':true,'column':false,'module_id':null,'value':'Imran'},
				{'tab_id':1,'field_id':2,'type':'text','field_name':'address_1','label':'Address ','is_required':false,'column':false,'module_id':null,'value':'Software Engineer'},
				{'tab_id':1,'field_id':3,'type':'text','field_name':'address_2','label':'Address 2','is_required':false,'column':false,'module_id':null,'value':'321321'},
				{'tab_id':1,'field_id':4,'type':'text','field_name':'city','label':'City','is_required':false,'column':false,'module_id':null,'value':'2352342'},
				{'tab_id':1,'field_id':5,'type':'text','field_name':'county','label':'County','is_required':false,'column':true,'module_id':null,'value':'2342342'},
				{'tab_id':1,'field_id':6,'type':'text','field_name':'postcode','label':'Postcode','is_required':false,'column':true,'module_id':null,'value':'23423'},
				{'tab_id':1,'field_id':7,'type':'select','field_name':'country','label':'Country','is_required':false,'column':true,'module_id':67,'value':'235'}
			];

	
	
			
	$scope.getComboValue = function(field_id){
		var combo_id = this.formData[field_id].value.id;
		angular.forEach($scope.arr_combo[field_id],function(elem, index){
			if(combo_id == elem.id){
				$scope.formData[field_id].value = $scope.arr_combo[field_id][index];
			}
		});
	}
	
	var postUrl = $scope.$root.setup+"crm/add-payment-method";
	$scope.arrTabs = [
		{'tab_id':1,'tab_heading':'General'},
		{'tab_id':2,'tab_heading':'Alt. Contact'},
		{'tab_id':3,'tab_heading':'Alt. Depot'},
		{'tab_id':4,'tab_heading':'Competitors'},
		{'tab_id':5,'tab_heading':'Price Offer'},
		{'tab_id':6,'tab_heading':'Opportunity Cycle'},
		{'tab_id':7,'tab_heading':'Promotion'},
		{'tab_id':8,'tab_heading':'Documents'}
	]

	$scope.arrFields = [
		{'tab_id':1,'field_id':1,'type':'text','field_name':'name','label':'Name','is_required':true,'column':false,'module_id':null},
		{'tab_id':1,'field_id':2,'type':'text','field_name':'address_1','label':'Address ','is_required':false,'column':false,'module_id':null},
		{'tab_id':1,'field_id':3,'type':'text','field_name':'address_2','label':'Address 2','is_required':false,'column':false,'module_id':null},
		{'tab_id':1,'field_id':4,'type':'text','field_name':'city','label':'City','is_required':false,'column':false,'module_id':null},
		{'tab_id':1,'field_id':5,'type':'text','field_name':'county','label':'County','is_required':false,'column':true,'module_id':null},
		{'tab_id':1,'field_id':6,'type':'text','field_name':'postcode','label':'Postcode','is_required':false,'column':true,'module_id':null},
		{'tab_id':1,'field_id':7,'type':'select','field_name':'country','label':'Country','is_required':false,'column':true,'module_id':67}
	]
	
	$scope.getTabForm = function(tab_id){
		$scope.arrFields = {};
		if(tab_id == 1){
			$scope.arrFields = [
				{'tab_id':1,'field_id':1,'type':'text','field_name':'name','label':'Name','is_required':true,'column':false,'module_id':null},
				{'tab_id':1,'field_id':2,'type':'text','field_name':'address_1','label':'Address ','is_required':false,'column':false,'module_id':null},
				{'tab_id':1,'field_id':3,'type':'text','field_name':'address_2','label':'Address 2','is_required':false,'column':false,'module_id':null},
				{'tab_id':1,'field_id':4,'type':'text','field_name':'city','label':'City','is_required':false,'column':false,'module_id':null},
				{'tab_id':1,'field_id':5,'type':'text','field_name':'county','label':'County','is_required':false,'column':true,'module_id':null},
				{'tab_id':1,'field_id':6,'type':'text','field_name':'postcode','label':'Postcode','is_required':false,'column':true,'module_id':null},
				{'tab_id':1,'field_id':7,'type':'select','field_name':'country','label':'Country','is_required':false,'column':true,'module_id':67}
			];


		
			angular.forEach($scope.rec,function(obj,index){
				$scope.formData[obj.field_id] = obj;
				if(obj.module_id != null){
					angular.forEach($scope.arr_combo[obj.field_id],function(elem, index2){
						if(obj.value == elem.id){
							$scope.formData[obj.field_id].value = $scope.arr_combo[obj.field_id][index2];
						}
					});
				}
			});
		
		}
		if(tab_id == 2){
			$scope.arrFields = [
				{'tab_id':2,'field_id':7,'type':'text','field_name':'contact_name','label':'Contact Name','is_required':true},
				{'tab_id':2,'field_id':8,'type':'text','field_name':'job_title','label':'Job Title','is_required':false},
				{'tab_id':2,'field_id':9,'type':'text','field_name':'direct_line','label':'Direct Line','is_required':false},
				{'tab_id':2,'field_id':10,'type':'text','field_name':'mobile','label':'Mobile','is_required':false},
				{'tab_id':2,'field_id':11,'type':'text','field_name':'fax','label':'Fax','is_required':false},
				{'tab_id':2,'field_id':12,'type':'text','field_name':'telephone','label':'Telephone','is_required':false}
			]
		}
	}

	$scope.fillCombo = function(module_id,field_id){
		var arr_temp = {};
		var arr_temp2 = [];
		angular.forEach($scope.arrFields,function(obj,index){
			if(obj.field_id == field_id) arr_temp = obj;
		});
		
		var fillComboUrl = $scope.$root.setup+"general/fill-combo";
		
		$http
	      .post(fillComboUrl, {'module_id':module_id,'token':$scope.$root.token})
	      .then(function (res) {
	        	if(res.data.ack == true){
					angular.forEach(res.data.response,function(obj,index){
								arr_temp3 = {};
								arr_temp3.column = arr_temp.column;
								arr_temp3.field_id = arr_temp.field_id;
								arr_temp3.is_required = arr_temp.is_required;
								arr_temp3.label = arr_temp.label;
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

	}

	
	//	console.log('here===>>');
		angular.forEach($scope.rec,function(obj,index){
			$scope.formData[obj.field_id] = obj;
			if(obj.module_id != null){
			$timeout(function(){
				angular.forEach($scope.arr_combo[obj.field_id],function(elem, index2){
					if(obj.value == elem.id){
						$scope.formData[obj.field_id].value = elem;
					}
				});
			},1000);
			}
		});
	

	//$timeout(function(){
	/*	$scope.formUrl = function() {
			return "app/views/crm/fields.html";
		  }*/
	//},2000);
	


	 $scope.add = function(formData,tab_id){
	 	
	 formData.token = $scope.$root.token;
	 formData.tab_id = tab_id;
	 console.log(formData);
	 	return;
	 $http
      .post(postUrl, rec)
      .then(function (res) {
        	if(res.data.ack == true){
				 toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
				 $timeout(function(){ $state.go('app.crm'); }, 3000);
			}
			else
				toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(104));
      });
  	}
}

function CrmViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster){
	 $scope.formTitle = 'CRM';
	 $scope.btnCancelUrl = 'app.crm';
	 $scope.hideDel = false;
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'CRM','url':'app.crm','isActive':false}];
		 
	$scope.formUrl = function() {
		return "app/views/crm/_form.html";
	  }
		
	$scope.gotoEdit = function(){
	  $state.go("app.edit-crm",{id:$stateParams.id});
	};
	
		 
  	$scope.rec = {};
	var postUrl = $scope.$root.setup+"crm/get-payment-method";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id };

	$http
      .post(postUrl, postData)
      .then(function (res) {
      	$scope.rec = res.data.response;
      });
		 
	
 	
	
};

function CrmEditController($scope, $stateParams, $http, $state, $resource,toaster){

	$scope.formTitle = 'CRM';
	 $scope.btnCancelUrl = 'app.crm';
	 $scope.hideDel = false; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'Sales','url':'#','isActive':false},
		 {'name':'CRM','url':'app.crm','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];	
	
	$scope.formUrl = function() {
		return "app/views/crm/_form.html";
	  }

 	$scope.rec = {};
	var postUrl = $scope.$root.setup+"crm/get-payment-method";
	var updateUrl = $scope.$root.setup+"crm/update-payment-method";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id};

	$http
      .post(postUrl, postData)
      .then(function (res) {
      	$scope.rec = res.data.response;
      });

	
	$scope.update = function(rec){
	 	 rec.token = $scope.$root.token;
		 $http
	      .post(updateUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
				toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				 $timeout(function(){ $state.go('app.crm'); }, 3000);
			}
			else
				toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
      });
  	}
	
}


