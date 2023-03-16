CompetitorleftController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster"];

myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.competitors', {
        url: '/competitor',
        title: 'Competitor',
        templateUrl: helper.basepath('competitor_left/competitor.html'),
        resolve: helper.resolveFor('ngTable'),
    })
	.state('app.AddCompetitors', {
        url: '/competitor/add',
        title: 'Add Competitor',
        templateUrl: helper.basepath('add.html'),
		resolve: helper.resolveFor('ngDialog'),
		controller: 'CompetitorAddController'
    })
	.state('app.ViewCompetitors', {
		url: '/competitor/:id/view',
        title: 'View Competitors ',
        templateUrl: helper.basepath('view.html'),
		resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
		controller: 'CompetitorsViewController'
	  })
	  .state('app.editCompetitors', {
		url: '/competitor/:id/edit',
        title: 'Edit Competitors ',
        templateUrl: helper.basepath('edit.html'),
		controller: 'CompetitorsEditController'
	  })
  
 }]);

myApp.controller('CompetitorleftController', CompetitorleftController);
myApp.controller('CompetitorAddController', CompetitorAddController);
myApp.controller('CompetitorsViewController', CompetitorsViewController);
myApp.controller('CompetitorsEditController', CompetitorsEditController);

function CompetitorleftController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http) {
	
    'use strict';
	
    // required for inner references
	$scope.module_id = 91;
	$scope.module_table = 'competitor';
	$scope.class = 'inline_block'; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','style':''},
		 {'name':'Sales','url':'#','style':''},
		 {'name':'Competitors','url':'#','style':'color:#515253;'}];
		 
    var vm = this;
	
	// For one time fetching data	
   // var Api = $resource('api/company/get_listing/:module_id/:module_table');

	// On Filter Dropdown change	
    var ApiAjax = $resource('api/company/get_listing_ajax/:module_id/:module_table/:filter_id');
	
    $scope.$watch("MyCustomeFilters", function () {
        if($scope.MyCustomeFilters && $scope.table.tableParams5){
            $scope.table.tableParams5.reload();
        }
    }, true);
    $scope.MyCustomeFilters = {
    }
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
            $scope.$root.count = $scope.$root.count+1;
			ngDataService.getDataCustomAjax( $defer, params, ApiAjax,$filter,$scope,'competitor'+$scope.$root.count);



        }
    });

}

function CompetitorAddController($scope, $stateParams , $http, $state,toaster,$resource,$upload,ngDialog){
	
	$scope.class = 'block'; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','style':''},
		 {'name':'Sales','url':'#','style':''},
		 {'name':'Competitors','url':'app.competitors','style':''},
		 {'name':'Add','url':'#','style':'color:#515253;'}];

	$scope.formUrl = function() {
		return "app/views/competitor_left/_form.html";
	  }
	
	$resource('api/company/fill_combo/:table/:label/:value/:condition/:order_by/:selected/:is_company')
	.get({table:'catagory',label:'name',value:'id',condition:0,order_by:'name',selected:0,is_company:1},function(data){
		$scope.arr_category = data.combo_data;
	});
	
	/*$scope.brand_id = 0;
	$scope.setBrandValue = function(){
		$scope.brand_id = this.brands.value;
	}
*/

$scope.resetForm = function(rec){
		$scope.files = [];
		$scope.str_files = [];
		$scope.temp_files = [];
		$scope.comp_files = [];
		$scope.check_file = 0;
		$scope.check_files = 0;
		document.getElementById("uploadFile").value = '';
		$scope.rec = {};
		$scope.brands = '';
		angular.element("input[type='file']").val(null);
	}
	
	// force download file
	var content = 'file content';
	var blob = new Blob([ content ], { type : '*' });
	$scope.url = (window.URL || window.webkitURL).createObjectURL( blob );	

$scope.rec = {}; 

$scope.check_file = 0;	
$scope.onFileSelect = function($files) {
	$scope.check_file = 1;
	$scope.files=[];
	$scope.files = $files;
	$scope.str_files = [];
	$scope.temp_files = [];
	$timeout(function(){
		angular.forEach($scope.files,function(file,key){
			$scope.str_files.push({name:file.name,index:key});
			$scope.temp_files.push(file.name);
			 
		});
	document.getElementById("uploadFile").value = $scope.temp_files; 		
	},100)
 };
 
  $scope.removeFile = function(index){
		$scope.files.splice(index,1);
		$scope.str_files.splice(index,1);
		$scope.temp_files.splice(index,1);
		document.getElementById("uploadFile").value = $scope.temp_files; 
		if($scope.temp_files.length < 1)
			$scope.check_file = 0;	
	}
  
  	
$scope.add = function(rec){
	 rec.category_id = rec.category_id != undefined?rec.category_id.value:0;
	 rec.table = 'competitor';
	 rec.is_company = 1;
	 	
	 $http
      .post('api/company/add', rec)
      .then(function (res) {
        	if(res.data > 0){
				var id = res.data;
				if($scope.files.length > 0){
					angular.forEach($scope.files,function(file,index){
							$scope.upload = $upload.upload({
							url: 'api/company/upload_competitor',
							method: 'POST', 
							headers: {'header-key': '83c238df1650bccb2d1aa4495723c63f07672ee8'}, 
							withCredentials: true, 
							data: {comp_id:id,table:'competitor_files',folder_name:'competitor'},
							file: file, 
						  }).progress(function(evt) {
							console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
						  }).success(function(data, status, headers, config) {});
					});
				}
				toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
				$scope.resetForm(rec);
				$timeout(function(){ $state.go('app.competitors'); }, 3000);
   		}
		else{
				toaster.pop('error', 'Edit', 'Add', $scope.$root.getErrorMessageByCode(104));
		}
      });
  }
 
 $scope.deleteFile = function(index,id) { 
    ngDialog.openConfirm({
      template: 'modalDeleteDialogId',
      className: 'ngdialog-theme-default-custom'
    }).then(function (value) {
      $http
		  .post('api/company/delete', {id:id,table:'competitor_files',folder_name:'competitor',field_name:'file'})
		  .then(function (res) {
				if(res.data == true){
					$scope.comp_files.splice(index,1);
					if($scope.comp_files.length < 1){
						$scope.check_files = 0;
						}
					toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
				}
				else{
					toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
				}
		  });
    }, function (reason) {
      console.log('Modal promise rejected. Reason: ', reason);
    });
 }; 
 
  $scope.viewFile = function(id){
	 window.open(
	  'http://navson.com/demo1/api/company/view_competitor_doc/'+id,
	  '_blank' // <- This is what makes it open in a new window.
	);
 }
  
}

function CompetitorsViewController($scope, $stateParams, $http, $state, $resource,$timeout,ngDialog,toaster){
	
	
	
	$scope.class = 'block'; 
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','style':''},
		 {'name':'Sales','url':'#','style':''},
		 {'name':'Competitors ','url':'app.competitors','style':''}];
		 
	$scope.disableClass = 1 ;	 
		 
	$scope.formUrl = function() {
		return "app/views/competitor_left/_form.html";
	  }
	
	$scope.rec = {};
	 var id = $stateParams.id;
	 var table = 'competitor';
  
  
	
	$resource('api/company/fill_combo/:table/:label/:value/:condition/:order_by/:selected/:is_company')
	.get({table:'catagory',label:'name',value:'id',condition:0,order_by:'name',selected:0,is_company:1},function(data){
		$scope.arr_category = data.combo_data;
		$scope.comp_files = [];
		 $scope.rec = {};
	var id = $stateParams.id;
	var table = 'competitor';
     $resource('api/company/get_record/:id/:table').get({id:id,table:table},function(data){
		$scope.rec = data;
		$scope.rec.update_id = data.id;
		$.each($scope.arr_category,function(index,elem){if(elem.value == data.category_id){
			$scope.rec.category_id = elem;}});
			$resource('api/company/get_record_where/:table/:condition')
			.get({table:'competitor_files',condition:'competitor_id*'+data.id},function(data){

				if(data.result != null){
					if(data.result[0] != undefined)
						$scope.comp_files = data.result;
					else
						$scope.comp_files[0] = data.result;
					$scope.check_files =1;
					$scope.check_file = 0;
				}
			});
	});
	});
	

	$scope.gotoEdit = function(){
	  $state.go("app.editCompetitors",{id:$stateParams.id});
	};
	
	// force download file
	var content = 'file content';
	var blob = new Blob([ content ], { type : '*' });
	$scope.url = (window.URL || window.webkitURL).createObjectURL( blob );
	
	$scope.delete = function(id) {
		var id = $stateParams.id;
    ngDialog.openConfirm({
      template: 'modalDeleteDialogId',
      className: 'ngdialog-theme-default'
    }).then(function (value) {
      $http
		  .post('api/company/delete', {id:id,table:'competitor',folder_name:'competitor',field_name:'file'})
		  .then(function (res) {
				if(res.data == true){
					$scope.$root.tabHide = 1;
					$timeout(function() {
						$scope.rec = {};
						angular.element('.accordion-toggle').trigger('click');
					  }, 100);
					toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
					 $timeout(function(){ $state.go('app.competitors'); }, 3000);
					 var args = [];
					args[0] = $scope.$root.crm_id;
					args[1] = undefined;

					$scope.$root.$broadcast("myAltDepotEventReload", args);
				}
				else{
					toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
				}
		  });
    }, function (reason) {
      console.log('Modal promise rejected. Reason: ', reason);
    });
 };
 
 $scope.deleteFile = function(index,id) { 
    ngDialog.openConfirm({
      template: 'modalDeleteDialogId',
      className: 'ngdialog-theme-default'
    }).then(function (value) {
      $http
		  .post('api/company/delete', {id:id,table:'competitor_files',folder_name:'competitor',field_name:'file'})
		  .then(function (res) {
				if(res.data == true){
					$scope.comp_files.splice(index,1);
					if($scope.comp_files.length < 1){
						$scope.check_files = 0;
						}
					toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
				}
				else{
					toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
				}
		  });
    }, function (reason) {
      console.log('Modal promise rejected. Reason: ', reason);
    });
 }; 

$scope.viewFile = function(id){
	 window.open(
	  'http://navson.com/demo1/api/company/view_competitor_doc/'+id,
	  '_blank' // <- This is what makes it open in a new window.
	);
 } 

};
function CompetitorsEditController($scope, $stateParams, $http, $state, $resource,toaster,$upload, $timeout ){

		$scope.class = 'block'; 
		$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','style':''},
		 {'name':'Sales','url':'#','style':''},
		 {'name':'Competitors','url':'app.competitors','style':''},
		 {'name':'Edit','url':'#','style':'color:#515253;'}];	

	$resource('api/company/fill_combo/:table/:label/:value/:condition/:order_by/:selected/:is_company')
	.get({table:'catagory',label:'name',value:'id',condition:0,order_by:'name',selected:0,is_company:1},function(data){
		$scope.arr_category = data.combo_data;
		 $scope.rec = {};
		 $scope.comp_files = [];
	var id = $stateParams.id;
	var table = 'competitor';
     $resource('api/company/get_record/:id/:table').get({id:id,table:table},function(data){
		$scope.rec = data;
		$scope.rec.update_id = data.id;
		$.each($scope.arr_category,function(index,elem){if(elem.value == data.category_id){
			$scope.rec.category_id = elem;}});
		
		$resource('api/company/get_record_where/:table/:condition')
			.get({table:'competitor_files',condition:'competitor_id*'+data.id},function(data){
				if(data.result != null){
					if(data.result[0] != undefined)
						$scope.comp_files = data.result;
					else
						$scope.comp_files[0] = data.result;
					$scope.check_files =1;
					$scope.check_file = 0;
				}
			});
	});
	});
	

	
 	$scope.rec = {};
	
	var id = $stateParams.id;
	var table = 'competitor';
    $resource('api/company/get_record/:id/:table').get({id:id,table:table},function(data){
		$scope.rec = data;
		$scope.rec.update_id = data.id;
	//	console.log($scope.rec.update_id)
		
	});

	$scope.formUrl = function() {
		return "app/views/competitor_left/_form.html";
	  }
	  
	$scope.brand_id = 0;
	$scope.setBrandValue = function(){
		$scope.brand_id = this.brands.value;
	}

	$scope.resetForm = function(rec){
		$scope.files = [];
		$scope.str_files = [];
		$scope.temp_files = [];
		$scope.comp_files = [];
		$scope.check_file = 0;
		$scope.check_files = 0;
		document.getElementById("uploadFile").value = '';
		$scope.rec = {};
		$scope.brands = '';
		angular.element("input[type='file']").val(null);
	}
	
	// force download file
	var content = 'file content';
	var blob = new Blob([ content ], { type : '*' });
	$scope.url = (window.URL || window.webkitURL).createObjectURL( blob );
	
	
$scope.check_file = 0;	
$scope.onFileSelect = function($files) {
	console.log($scope.$files);
	$scope.check_file = 1;
	$scope.files=[];
	$scope.files = $files;
	$scope.str_files = [];
	$scope.temp_files = [];
	$timeout(function(){
		angular.forEach($scope.files,function(file,key){
			$scope.str_files.push({name:file.name,index:key});
			$scope.temp_files.push(file.name);
			 
		});
	document.getElementById("uploadFile").value = $scope.temp_files; 		
	},100)
 };
 
 $scope.removeFile = function(index){
		$scope.files.splice(index,1);
		$scope.str_files.splice(index,1);
		$scope.temp_files.splice(index,1);
		document.getElementById("uploadFile").value = $scope.temp_files; 
		if($scope.temp_files.length < 1)
			$scope.check_file = 0;	
	}
	
	
   $scope.rec = {};
   
   $scope.update = function(rec){
	 rec.category_id = rec.category_id != undefined?rec.category_id.value:0;
	 rec.table = 'competitor';
	 rec.is_company = 1;
	 $http
      .post('api/company/add', rec)
      .then(function (res) {
        	if(res.data == 'edit' || $scope.files.length > 0){
				var id = rec.update_id;
				if($scope.files.length > 0){
					angular.forEach($scope.files,function(file,index){
							$scope.upload = $upload.upload({
							url: 'api/company/upload_competitor',
							method: 'POST', 
							headers: {'header-key': '83c238df1650bccb2d1aa4495723c63f07672ee8'}, 
							withCredentials: true, 
							data: {comp_id:id,table:'competitor_files',folder_name:'competitor'},
							file: file, 
						  }).progress(function(evt) {
							console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
						  }).success(function(data, status, headers, config) {});
					});
				}
				toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				$scope.resetForm(rec);
				$timeout(function(){ $state.go('app.competitors'); }, 3000);
   		}
		else{
				toaster.pop('error', 'Edit', 'Add', $scope.$root.getErrorMessageByCode(104));
		}
      });
  }
 
 $scope.deleteFile = function(index,id) { 
    ngDialog.openConfirm({
      template: 'modalDeleteDialogId',
      className: 'ngdialog-theme-default'
    }).then(function (value) {
      $http
		  .post('api/company/delete', {id:id,table:'competitor_files',folder_name:'competitor',field_name:'file'})
		  .then(function (res) {
				if(res.data == true){
					$scope.comp_files.splice(index,1);
					if($scope.comp_files.length < 1){
						$scope.check_files = 0;
						}
					toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
				}
				else{
					toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
				}
		  });
    }, function (reason) {
      console.log('Modal promise rejected. Reason: ', reason);
    });
 }; 

$scope.viewFile = function(id){
	 window.open(
	  'http://navson.com/demo1/api/company/view_competitor_doc/'+id,
	  '_blank' // <- This is what makes it open in a new window.
	);
 }
	
}


