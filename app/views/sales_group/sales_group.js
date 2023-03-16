
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	  
	.state('app.sales-group', {
        url: '/sales_group',
        title: 'Sales Group',
        templateUrl: helper.basepath('sales_group/sales_group.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
 	.state('app.add-sales-group', {
        url: '/add_sales_target',
        title: 'Add Sales Group',
        templateUrl: helper.basepath('add.html'),
		resolve: helper.resolveFor('ngDialog'),
		controller: 'SalesGroupAddController'
    })
	.state('app.view-sales-group', {
		url: '/:id/viewsalegroup',
        title: 'View Sales Group ',
        templateUrl: helper.basepath('view.html'), 
	resolve: helper.resolveFor('ngDialog'),
		controller: 'SalesGroupViewController'
	  })
	  .state('app.edit-sales-group', {
		url: '/:id/editsalegroup',
        title: 'Edit Sales Group',
        templateUrl: helper.basepath('edit.html'),
		resolve: helper.resolveFor('ngDialog'),
		controller: 'SalesGroupEditController'
	  }) 
  
 }]);

myApp.controller('SalesGroupListController', SalesGroupListController); 
myApp.controller('SalesGroupAddController', SalesGroupAddController);
myApp.controller('SalesGroupViewController', SalesGroupViewController);
myApp.controller('SalesGroupEditController', SalesGroupEditController);


SalesGroupListController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster"];

function SalesGroupListController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster) {
    'use strict';
		var vm = this; 
	$scope.class = 'inline_block'; 
	 $scope.$root.breadcrumbs =
                [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
                {'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex':'1'},
                {'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex':'3'},
                {'name': 'Sale-Group', 'url': '#', 'isActive': false} ];

	  var Api = $scope.$root.sales+"customer/sale-group/get-sale-group-list"; 
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

    vm.tableParams5 = new ngParams({
        page: 1,            // show first page
       count: $scope.$root.pagination_limit,           // count per page
       sorting: {Code: 'Desc'},
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
	 var delUrl = $scope.$root.sales+"customer/sale-group/delete-sale-group-list"; 
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
						toaster.pop('error', 'Info', 'Record cannot be Deleted.');
					}
			  });
	    },
		 function (reason) {
	      console.log('Modal promise rejected. Reason: ', reason);
		});
	};





}

function SalesGroupAddController($scope, $stateParams, $http, $state,toaster,ngDialog,$rootScope,$timeout){

	 $scope.formTitle = 'Sales Group';
	 $scope.btnCancelUrl = 'app.sales-group';
	 
		 $scope.$root.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		{'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex':'1'},
        {'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex':'3'},
		{'name': 'Sale-Group', 'url': 'app.sales-group', 'isActive': false},
		{'name': 'Add', 'url': '#', 'isActive': false}];
		
				
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'Inactive','value':0}];
	$scope.rec = {};
	$scope.status = {};
	
	$scope.formUrl = function() {
  return "app/views/sales_group/_form.html";
	  }
	
	

	
	$scope.add = function(rec){
		var postUrl = $scope.$root.sales+"customer/sale-group/add-sale-group-list"; 
	 	 rec.token = $scope.$root.token; 
		  rec.statuss = $scope.rec.status.value !== undefined ? $scope.rec.status.value:0;
		 
		 $http
	      .post(postUrl, rec)
	      .then(function (res) {  
				if(res.data.ack == true){
					 toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
					 
					 // if($scope.isSalePerersonChanged){
                        if ($scope.selectedSalespersons.length > 0) {
                            $scope.add_salespersons(res.data.id); 
                        }
                   // }
				   
				   
					 $timeout(function(){ $state.go('app.sales-group'); }, 1000);
				}
				 else toaster.pop('error', 'info', res.data.error);
	      }); 
 }
 
 
 
 

  
	$scope.product_type = true;  $scope.count_result=0;
    $scope.getCode = function (rec) { 
 var getCodeUrl  = $scope.$root.stock + "products-listing/get-code";
 var name = $scope.$root.base64_encode('crm_sale_group');
 var no = $scope.$root.base64_encode('sale_no');
      
 var module_category_id=2;
 $http
 .post(getCodeUrl , {'is_increment': 1, 'token': $scope.$root.token, 'tb': name, 'm_id':9,'no':no,'category':'','brand':'','module_category_id':module_category_id,'type': '','status': ''})
         .then(function (res) {
    				 if(res.data.ack==1) {
     	 
     	 $scope.showLoader = false;
         $scope.rec.sale_code = res.data.code;
         $scope.rec.sale_no = res.data.nubmer;
         $scope.rec.code_type=module_category_id;//res.data.code_type;
        $scope.count_result++;
       
       if(res.data.type==1)  {$scope.product_type = false;}
       else  {$scope.product_type = true;}
       
       if($scope.count_result>0) {console.log($scope.count_result);  return true; }
       else { console.log($scope.count_result+'d');return false; }
       
      }
						else  { 
		   toaster.pop('error', 'info', res.data.error);  
			return false;
		   }
                });
				
    } 
	$scope.getCode();
	
	    
	 
	 $scope.isSalePerersonChanged = false;
	 $scope.selectedSalespersons = [];
     $scope.searchKeyword={};
	 $scope.getSalePersons = function (isShow,item_paging,clr) {
        $scope.columns = [];
        $scope.salepersons = [];
        $scope.title = 'Salesperson';
        var postUrl = $scope.$root.hr + "employee/listings";
      //  var postData = {'token': $scope.$root.token, 'all': "1"};
 			$scope.postData={}; 
		$scope.postData.token =$scope.$root.token;
		$scope.postData.all =1;
		if(item_paging==1)$rootScope.item_paging.spage=1;
		$scope.postData.page= $rootScope.item_paging.spage;
		
		$scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id:0;
		
		 $scope.postData.searchKeyword = $scope.searchKeyword.$;
		
		if(  $scope.searchKeyword.emp_type !== undefined && $scope.searchKeyword.emp_type!==  null)
		{$scope.postData.emp_types = $scope.searchKeyword.emp_type.id; }
		
		if(  $scope.searchKeyword.department !== undefined &&  $scope.searchKeyword.department!==  null)
		$scope.postData.deprtments = $scope.searchKeyword.department.id;
	
		
		if($scope.postData.pagination_limits==-1) 
		{   $scope.postData.page=-1;
			$scope.searchKeyword={};
			$scope.record_data = {};
		}
		if(clr==77)
		{
			$scope.searchKeyword={};
		}
		
		
        $http
                .post(postUrl, $scope.postData)
                .then(function (res) {
                    if (res.data.ack == true) {
						$scope.total = res.data.total; 
                        $scope.item_paging.total_pages = res.data.total_pages;
                        $scope.item_paging.cpage = res.data.cpage;
                        $scope.item_paging.ppage = res.data.ppage;
                        $scope.item_paging.npage = res.data.npage;
                        $scope.item_paging.pages = res.data.pages;

						$scope.total_paging_record = res.data.total_paging_record;
                        $.each(res.data.response, function (indx, obj) {
                            obj.chk = false;
                            obj.isPrimary = false;
                            if ($scope.selectedSalespersons.length > 0) {
                                $.each($scope.selectedSalespersons, function (indx, obj2) {
                                    if (obj.id == obj2.id) {
                                        obj.chk = true;
                                        if (obj2.isPrimary)
                                            obj.isPrimary = true;

                                    }
                                });
                            }
                            $scope.salepersons.push(obj);
                        });
                        angular.forEach(res.data.response[0], function (val, index) {
                            if (index != 'chk' && index != 'id') {
                                $scope.columns.push({
                                    'title': toTitleCase(index),
                                    'field': index,
                                    'visible': true
                                });
                            }
                        });
                    } else {
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                    }

                });
        if (!isShow)
            angular.element('#salesPersonModal').modal({show: true});
    } 
	 
	 
    angular.element(document).on('click', '.checkAllSalesperson', function () {
        $scope.selectedSalespersons = [];
        if (angular.element('.checkAllSalesperson').is(':checked') == true) {
            $scope.isSalePerersonChanged = true;
            var isPrimary = false;
            for (var i = 0; i < $scope.salepersons.length; i++) {
                if($scope.salepersons[i].isPrimary)
                    isPrimary = true;

                $scope.salepersons[i].chk = true;
                $scope.selectedSalespersons.push($scope.salepersons[i]);
            }
            if(!isPrimary){
                $scope.salepersons[0].isPrimary = true;
                $scope.selectedSalespersons[0].isPrimary = true;
            }

        } else {
            for (var i = 0; i < $scope.salepersons.length; i++) {
                $scope.salepersons[i].chk = false;
                $scope.salepersons[i].isPrimary = false;
            }
            $scope.selectedSalespersons = [];
        }

        //$timeout(function(){
        $scope.$root.$apply(function () {
            $scope.selectedSalespersons;
        });
        //},500);

    });

    $scope.selectSaleperson = function (sp, isPrimary) {
        $scope.isSalePerersonChanged = true;
        for (var i = 0; i < $scope.salepersons.length; i++) {
            if (isPrimary == 1)
                $scope.salepersons[i].isPrimary = false;
            if (sp.id == $scope.salepersons[i].id) {
                if ($scope.salepersons[i].chk == true && isPrimary == 0) {
                    $scope.salepersons[i].chk = false;
                    $scope.salepersons[i].isPrimary = false;
                    $.each($scope.selectedSalespersons, function (indx, obj) {
                        if (obj != undefined) {
                            if (obj.id == sp.id)
                                $scope.selectedSalespersons.splice(indx, 1);
                        }
                    });
                } else {

                   // console.log('i==>>'+i);
                    if (isPrimary == 1 || $scope.selectedSalespersons.length == 0) {
                        var isExist = false;
                        $scope.salepersons[i].isPrimary = true;
                        $.each($scope.selectedSalespersons, function (indx, obj) {
                            if (obj != undefined) {
                                $scope.selectedSalespersons[indx].isPrimary = false;
                                if (obj.id == sp.id) {
                                    isExist = true;
                                    $scope.selectedSalespersons[indx].isPrimary = true;
                                }

                            }
                        });
                        if (!isExist) {
                            $scope.salepersons[i].chk = true;
                            $scope.selectedSalespersons.push($scope.salepersons[i]);
                        }

                    } else {
                        $scope.salepersons[i].chk = true;
                        $scope.selectedSalespersons.push($scope.salepersons[i]);
                    }
                }

            }

        }
    }
 
 	$scope.getSalePersons_edit =  function (id) {
		 
				 var salepersonUrl = $scope.$root.sales + "crm/crm/get-crm-salesperson";
                    $http
                            .post(salepersonUrl, {id: id, 'token': $scope.$root.token, 'type': 1})
                            .then(function (emp_data) {
								
								
                                if (emp_data.data.ack == true) {
                                    $.each($scope.salepersons, function (indx, obj) {
                                        obj.chk = false;
                                        obj.isPrimary = false;
                                        $.each(emp_data.data.response, function (indx, obj2) {
                                            if (obj.id == obj2.salesperson_id) {
                                                obj.chk = true;
                                                if (obj2.is_primary == 1)
                                                    obj.isPrimary = true;
 
                                                $scope.selectedSalespersons.push(obj);
                                            }
                                        });
                                        $scope.salepersons.push(obj);
                                    });
                                }
                            });
		 }
	
	 $scope.add_salespersons = function (id) {
        var excUrl = $scope.$root.sales + "crm/crm/add-crm-salesperson";
        var post = {};
        var temp = [];
        $.each($scope.selectedSalespersons, function (index, obj) {
          
		    if(obj.chk)    temp.push({id: obj.id, isPrimary: obj.isPrimary});
        })

        post.id = id;
        post.salespersons = temp;
		post.type = 1;
        post.token = $scope.$root.token;
        $http
                .post(excUrl, post)
                .then(function (res) {

                });
    }
	 
	 
	 

}

function SalesGroupViewController($scope, $stateParams, $http, $state, $resource,ngDialog,toaster,ngDialog,$timeout){
	
	$scope.formTitle = 'Sales Group';
	 $scope.btnCancelUrl = 'app.sales-group';
	 $scope.hideDel = false; 
	 $scope.$root.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		{'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex':'1'},
        {'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex':'3'},
		{'name': 'Sale-Group', 'url': 'app.sales-group', 'isActive': false},
		{'name': 'View', 'url': '#', 'isActive': false}];
		 
	$scope.formUrl = function() {
		  return "app/views/sales_group/_form.html";
	  }
	  
		
	$scope.gotoEdit = function(){
	  $state.go("app.edit-sales-group",{id:$stateParams.id});
	};
	
	$scope.rec = {};
	$scope.arr_status = [];
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'inActive','value':0}];
	 
	var postUrl = $scope.$root.sales+"customer/sale-group/get-sale-group-list-by-id";
	var postData = {'token': $scope.$root.token,'id': $stateParams.id };

	$http
      .post(postUrl, postData)
      .then(function (res) {
    			  	$scope.rec = res.data.response; 
				
						$.each($scope.arr_status,function(index,obj){ 
						if(obj.value == res.data.response.status) $scope.rec.status = obj; 
						});
						 
					  $scope.getSalePersons(1);
						$scope.getSalePersons_edit(res.data.response.id);
      });

 
	
	 
	 $scope.isSalePerersonChanged = false;
	 $scope.selectedSalespersons = [];
     
	 $scope.getSalePersons = function (isShow) {
        $scope.columns = [];
        $scope.salepersons = [];
        $scope.title = 'Salesperson';
        var postUrl = $scope.$root.hr + "employee/listings";
        var postData = {'token': $scope.$root.token, 'all': "1"};

        $http
                .post(postUrl, postData)
                .then(function (res) {
                    if (res.data.ack == true) {
                        $.each(res.data.response, function (indx, obj) {
                            obj.chk = false;
                            obj.isPrimary = false;
                            if ($scope.selectedSalespersons.length > 0) {
                                $.each($scope.selectedSalespersons, function (indx, obj2) {
                                    if (obj.id == obj2.id) {
                                        obj.chk = true;
                                        if (obj2.isPrimary)
                                            obj.isPrimary = true;

                                    }
                                });
                            }
                            $scope.salepersons.push(obj);
                        });
                        angular.forEach(res.data.response[0], function (val, index) {
                            if (index != 'chk' && index != 'id') {
                                $scope.columns.push({
                                    'title': toTitleCase(index),
                                    'field': index,
                                    'visible': true
                                });
                            }
                        });
                    } else {
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                    }

                });
        if (!isShow)
            angular.element('#salesPersonModal').modal({show: true});
    } 
	
	 
    angular.element(document).on('click', '.checkAllSalesperson', function () {
        $scope.selectedSalespersons = [];
        if (angular.element('.checkAllSalesperson').is(':checked') == true) {
            $scope.isSalePerersonChanged = true;
            var isPrimary = false;
            for (var i = 0; i < $scope.salepersons.length; i++) {
                if($scope.salepersons[i].isPrimary)
                    isPrimary = true;

                $scope.salepersons[i].chk = true;
                $scope.selectedSalespersons.push($scope.salepersons[i]);
            }
            if(!isPrimary){
                $scope.salepersons[0].isPrimary = true;
                $scope.selectedSalespersons[0].isPrimary = true;
            }

        } else {
            for (var i = 0; i < $scope.salepersons.length; i++) {
                $scope.salepersons[i].chk = false;
                $scope.salepersons[i].isPrimary = false;
            }
            $scope.selectedSalespersons = [];
        }

        //$timeout(function(){
        $scope.$root.$apply(function () {
            $scope.selectedSalespersons;
        });
        //},500);

    });

    $scope.selectSaleperson = function (sp, isPrimary) {
        $scope.isSalePerersonChanged = true;
        for (var i = 0; i < $scope.salepersons.length; i++) {
            if (isPrimary == 1)
                $scope.salepersons[i].isPrimary = false;
            if (sp.id == $scope.salepersons[i].id) {
                if ($scope.salepersons[i].chk == true && isPrimary == 0) {
                    $scope.salepersons[i].chk = false;
                    $scope.salepersons[i].isPrimary = false;
                    $.each($scope.selectedSalespersons, function (indx, obj) {
                        if (obj != undefined) {
                            if (obj.id == sp.id)
                                $scope.selectedSalespersons.splice(indx, 1);
                        }
                    });
                } else {

                   // console.log('i==>>'+i);
                    if (isPrimary == 1 || $scope.selectedSalespersons.length == 0) {
                        var isExist = false;
                        $scope.salepersons[i].isPrimary = true;
                        $.each($scope.selectedSalespersons, function (indx, obj) {
                            if (obj != undefined) {
                                $scope.selectedSalespersons[indx].isPrimary = false;
                                if (obj.id == sp.id) {
                                    isExist = true;
                                    $scope.selectedSalespersons[indx].isPrimary = true;
                                }

                            }
                        });
                        if (!isExist) {
                            $scope.salepersons[i].chk = true;
                            $scope.selectedSalespersons.push($scope.salepersons[i]);
                        }

                    } else {
                        $scope.salepersons[i].chk = true;
                        $scope.selectedSalespersons.push($scope.salepersons[i]);
                    }
                }

            }

        }
    }
 
 	$scope.getSalePersons_edit =  function (id) {
		 
				 var salepersonUrl = $scope.$root.sales + "crm/crm/get-crm-salesperson";
                    $http
                            .post(salepersonUrl, {id: id, 'token': $scope.$root.token, 'type': 1})
                            .then(function (emp_data) {
								
								
                                if (emp_data.data.ack == true) {
									
									$timeout(function(){$scope.$root.$apply(function(){
										
                                    $.each($scope.salepersons, function (indx, obj) {
                                        obj.chk = false;
                                        obj.isPrimary = false;
                                        $.each(emp_data.data.response, function (indx, obj2) {
                                            if (obj.id == obj2.salesperson_id) {
                                                obj.chk = true;
                                                if (obj2.is_primary == 1)
                                                    obj.isPrimary = true;
 
                                                $scope.selectedSalespersons.push(obj);
                                            }
                                        });
                                    });
									
									
									  });	},1000);
                                }
                            });
		 }
	
	 $scope.add_salespersons = function (id) {
        var excUrl = $scope.$root.sales + "crm/crm/add-crm-salesperson";
        var post = {};
        var temp = [];
        $.each($scope.selectedSalespersons, function (index, obj) {
          
		    if(obj.chk)    temp.push({id: obj.id, isPrimary: obj.isPrimary});
        })

        post.id = id;
        post.salespersons = temp;
		post.type = 1;
        post.token = $scope.$root.token;
        $http
                .post(excUrl, post)
                .then(function (res) {

                });
    }
	 
	   
	 
	  
};

function SalesGroupEditController($scope, $stateParams, $http, $state, $resource,toaster,ngDialog,$rootScope,$timeout){

	$scope.formTitle = 'Sales Group';
	 $scope.btnCancelUrl = 'app.sales-group';
	 $scope.hideDel = false;  
	
	 $scope.$root.breadcrumbs =
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		{'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex':'1'},
        {'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex':'3'},
		{'name': 'Sale-Group', 'url': 'app.sales-group', 'isActive': false}];
		
	$scope.formUrl = function() {
		  return "app/views/sales_group/_form.html";
	  }

 	$scope.rec = {};
	$scope.arr_status = [];
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'inActive','value':0}];
	
	var get = $scope.$root.sales+"customer/sale-group/get-sale-group-list-by-id";  
	var postData = {'token': $scope.$root.token,'id': $stateParams.id }; 
	
	$http
      .post(get, postData)
      .then(function (res) {
    			  		$scope.rec = res.data.response; 
				
						$.each($scope.arr_status,function(index,obj){ 
						if(obj.value == res.data.response.status) $scope.rec.status = obj; 
						});
						
					  $scope.getSalePersons(1);
						$scope.getSalePersons_edit(res.data.response.id);
      });  

	
	$scope.update = function(rec){
		var updateUrl = $scope.$root.sales+"customer/sale-group/update-sale-group-list"; 
	 	 rec.token = $scope.$root.token;
		  rec.statuss = $scope.rec.status.value !== undefined ? $scope.rec.status.value:0;
		 
		 $http
	      .post(updateUrl, rec)
	      .then(function (res) {
	        	if(res.data.ack == true){
				toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				
				// if($scope.isSalePerersonChanged){
                        if ($scope.selectedSalespersons.length > 0) 
						   $scope.add_salespersons(res.data.id); 
                        
                   // }
				
				 $timeout(function(){ $state.go('app.sales-group'); }, 1000);
			
			
			}
			else toaster.pop('error', 'info', res.data.error);
			
				
      });
  	} 
	 
	 
	 
	 
	
	
	 $scope.isSalePerersonChanged = false;
	 $scope.selectedSalespersons = [];
     
 $scope.searchKeyword={};
	 $scope.getSalePersons = function (isShow,item_paging,clr) {
        $scope.columns = [];
        $scope.salepersons = [];
        $scope.title = 'Salesperson';
        var postUrl = $scope.$root.hr + "employee/listings";
     $scope.postData={}; 
		$scope.postData.token =$scope.$root.token;
		$scope.postData.all =1;
		if(item_paging==1)$rootScope.item_paging.spage=1;
		$scope.postData.page= $rootScope.item_paging.spage;
		
		$scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id:0;
		
		 $scope.postData.searchKeyword = $scope.searchKeyword.$;
		
		if(  $scope.searchKeyword.emp_type !== undefined && $scope.searchKeyword.emp_type!==  null)
		{$scope.postData.emp_types = $scope.searchKeyword.emp_type.id; }
		
		if(  $scope.searchKeyword.department !== undefined &&  $scope.searchKeyword.department!==  null)
		$scope.postData.deprtments = $scope.searchKeyword.department.id;
	
		
		if($scope.postData.pagination_limits==-1) 
		{   $scope.postData.page=-1;
			$scope.searchKeyword={};
			$scope.record_data = {};
		}
		if(clr==77)
		{
			$scope.searchKeyword={};
		}
        $http
                .post(postUrl, $scope.postData)
                .then(function (res) {
                    if (res.data.ack == true) {
						$scope.total = res.data.total; 
                        $scope.item_paging.total_pages = res.data.total_pages;
                        $scope.item_paging.cpage = res.data.cpage;
                        $scope.item_paging.ppage = res.data.ppage;
                        $scope.item_paging.npage = res.data.npage;
                        $scope.item_paging.pages = res.data.pages;

						$scope.total_paging_record = res.data.total_paging_record;
                        $.each(res.data.response, function (indx, obj) {
                            obj.chk = false;
                            obj.isPrimary = false;
                            if ($scope.selectedSalespersons.length > 0) {
                                $.each($scope.selectedSalespersons, function (indx, obj2) {
                                    if (obj.id == obj2.id) {
                                        obj.chk = true;
                                        if (obj2.isPrimary)
                                            obj.isPrimary = true;

                                    }
                                });
                            }
                            $scope.salepersons.push(obj);
                        });
                        angular.forEach(res.data.response[0], function (val, index) {
                            if (index != 'chk' && index != 'id') {
                                $scope.columns.push({
                                    'title': toTitleCase(index),
                                    'field': index,
                                    'visible': true
                                });
                            }
                        });
                    } else {
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                    }

                });
        if (!isShow)
            angular.element('#salesPersonModal').modal({show: true});
    } 
	
    angular.element(document).on('click', '.checkAllSalesperson', function () {
        $scope.selectedSalespersons = [];
        if (angular.element('.checkAllSalesperson').is(':checked') == true) {
            $scope.isSalePerersonChanged = true;
            var isPrimary = false;
            for (var i = 0; i < $scope.salepersons.length; i++) {
                if($scope.salepersons[i].isPrimary)
                    isPrimary = true;

                $scope.salepersons[i].chk = true;
                $scope.selectedSalespersons.push($scope.salepersons[i]);
            }
            if(!isPrimary){
                $scope.salepersons[0].isPrimary = true;
                $scope.selectedSalespersons[0].isPrimary = true;
            }

        } else {
            for (var i = 0; i < $scope.salepersons.length; i++) {
                $scope.salepersons[i].chk = false;
                $scope.salepersons[i].isPrimary = false;
            }
            $scope.selectedSalespersons = [];
        }

        //$timeout(function(){
        $scope.$root.$apply(function () {
            $scope.selectedSalespersons;
        });
        //},500);

    });

    $scope.selectSaleperson = function (sp, isPrimary) {
        $scope.isSalePerersonChanged = true;
        for (var i = 0; i < $scope.salepersons.length; i++) {
            if (isPrimary == 1)
                $scope.salepersons[i].isPrimary = false;
            if (sp.id == $scope.salepersons[i].id) {
                if ($scope.salepersons[i].chk == true && isPrimary == 0) {
                    $scope.salepersons[i].chk = false;
                    $scope.salepersons[i].isPrimary = false;
                    $.each($scope.selectedSalespersons, function (indx, obj) {
                        if (obj != undefined) {
                            if (obj.id == sp.id)
                                $scope.selectedSalespersons.splice(indx, 1);
                        }
                    });
                } else {

                   // console.log('i==>>'+i);
                    if (isPrimary == 1 || $scope.selectedSalespersons.length == 0) {
                        var isExist = false;
                        $scope.salepersons[i].isPrimary = true;
                        $.each($scope.selectedSalespersons, function (indx, obj) {
                            if (obj != undefined) {
                                $scope.selectedSalespersons[indx].isPrimary = false;
                                if (obj.id == sp.id) {
                                    isExist = true;
                                    $scope.selectedSalespersons[indx].isPrimary = true;
                                }

                            }
                        });
                        if (!isExist) {
                            $scope.salepersons[i].chk = true;
                            $scope.selectedSalespersons.push($scope.salepersons[i]);
                        }

                    } else {
                        $scope.salepersons[i].chk = true;
                        $scope.selectedSalespersons.push($scope.salepersons[i]);
                    }
                }

            }

        }
    }
 
 	$scope.getSalePersons_edit =  function (id) {
		 
				 var salepersonUrl = $scope.$root.sales + "crm/crm/get-crm-salesperson";
                    $http
                            .post(salepersonUrl, {id: id, 'token': $scope.$root.token, 'type': 1})
                            .then(function (emp_data) {
								
								
                                if (emp_data.data.ack == true) {
								 	$timeout(function(){$scope.$root.$apply(function(){
                                    $.each($scope.salepersons, function (indx, obj) {
                                        obj.chk = false;
                                        obj.isPrimary = false;
                                        $.each(emp_data.data.response, function (indx, obj2) {
                                            if (obj.id == obj2.salesperson_id) {
                                                obj.chk = true;
                                                if (obj2.is_primary == 1)
                                                    obj.isPrimary = true;
 
                                                $scope.selectedSalespersons.push(obj);
                                            }
                                        });
                                       
                                    });
									});	},1000);
                                }
                            });
		 }
	
	 $scope.add_salespersons = function (id) {
        var excUrl = $scope.$root.sales + "crm/crm/add-crm-salesperson";
        var post = {};
        var temp = [];
        $.each($scope.selectedSalespersons, function (index, obj) {
          
		    if(obj.chk)    temp.push({id: obj.id, isPrimary: obj.isPrimary});
        })

        post.id = id;
        post.salespersons = temp;
		post.type = 1;
        post.token = $scope.$root.token;
        $http
                .post(excUrl, post)
                .then(function (res) {

                });
    }
	 
	 
	 

} 