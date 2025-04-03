
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  /* specific routes here (see file config.js) */
 $stateProvider	
	.state('app.urights-list', {
        url: '/user_rights',
        title: 'User Rights List',
        templateUrl: helper.basepath('user_rights/user_rights.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
 	.state('app.add-urights', {
        url: '/adduser_rights',
        title: 'Add User Rights',
       templateUrl: helper.basepath('user_rights/_form.html'),
		resolve: helper.resolveFor('ngDialog'),
		controller: 'UserRightsEditController'
    }) 
	  .state('app.edit-urights', {
		 url: '/:id/edituser_rights',
        title: 'Edit User Rights',
        templateUrl: helper.basepath('user_rights/_form.html'),
		resolve: helper.resolveFor('ngDialog'),
		controller: 'UserRightsEditController'
	  }) 
  
 }]);


myApp.controller('UserrightListController', UserrightListController); 
UserrightListController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster","$state"];
function UserrightListController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster,$state) {
    'use strict';
		var vm = this; 
	
		$scope.class = 'inline_block'; 
		 $scope.$root.breadcrumbs =
                [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
                {'name': 'Setup', 'url': '#', 'isActive': false}, 
                {'name': 'Permision', 'url': '#', 'isActive': false} ];

	  var Api = $scope.$root.hr+"roles/user-rights-list"; 
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
 
	  
	 
}

   
UserRightsEditController.$inject = ["$scope", "$filter", "$resource", "$timeout","$http","ngDialog","toaster","$state","$rootScope","$stateParams"];
myApp.controller('UserRightsEditController', UserRightsEditController); 
function UserRightsEditController($scope, $filter,$resource,$timeout, $http,ngDialog,toaster,$state,$rootScope,$stateParams ){
    'use strict';
	 
	 
	 
	if($stateParams.id >0)
	{
		$scope.check_permison_readonly = true;  
	} 
	
	$scope.showEditForm = function () 
	{
		$scope.check_permison_readonly = false; 
	}
	
	$scope.formTitle = 'Permision List';
	 $scope.btnCancelUrl = 'app.urights-list';
 	$scope.rec = {};
	$scope.rec.id = 0;
	$scope.$root.uright_id=$stateParams.id;
	 
	$scope.arr_status = [];
	$scope.arr_status =	[{'label':'Active','value':1},{'label':'inActive','value':0}];
	$scope.rec.status = $scope.arr_status[0]; 
	
	 $scope.$root.breadcrumbs =
			[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
			{'name': 'Setup', 'url': '#', 'isActive': false},
			{'name': 'User Rights', 'url': 'app.urights-list', 'isActive': false}
		];
		
		$scope.role_arry=[];
	var roleUrl = $scope.$root.hr+"roles/roles";
	$http
	.post(roleUrl, {'token': $scope.$root.token})
	.then(function (res) {	
			$scope.role_arry=[];
			if (res.data.ack == true)  $scope.role_arry = res.data.response; 
			// if ($scope.user_type == 1)  $scope.role_arry.push({id: '-1', role: '++Add New++'});
	}); 
	
		
	//add-user-rights-module-data  
	  var postUrl_cat = $scope.$root.hr+"roles/get-user-rights-module-data"; 
	  $http
      .post(postUrl_cat, {'token':$scope.$root.token,'display_id':0})
      .then(function (res) {
        			if(res.data.ack == true)	{
				
				$scope.list_data_all = res.data.response;
				
				//$scope.list_data_one = res.data.response_one;
				//$scope.list_data_second= res.data.response_second;
				//$scope.list_data_third = res.data.response_third;
				
				/*
					 //	$.each(res.data.response,function(catIndex, catObj){
			//	$scope.account_list.push(catObj);
			
				//$.each(res.data.response_new,function(sCatIndex, sCatObj){
					//if(sCatObj.parent_id == catObj.id){
					//	 $scope.account_list.push(sCatObj);
						
						//$.each(res.data.response_account,function(accIndex, accObj){
							//if(accObj.parent_id == sCatObj.id){
								//$scope.account_list.push(accObj);
								
							//	$.each(res.data.response_account,function(accIndex2, accObj2){
								//	if(accObj2.parent_id == accObj.id){
									//	$scope.account_list.push(accObj2);
									
										$.each(res.data.response_account,function(accIndex3, accObj3){
									//		if(accObj3.parent_id == accObj2.id){
												$scope.account_list.push(accObj3);
									//		}
										});
										//net_change
								//	}
							//	});
							//}
						//});
					//}
				//});
		//	});
				*/
		
				/*
					$.each(res.data.response,function(catIndex, catObj){
				$scope.account_list.push(catObj);
			
				$.each(res.data.response_new,function(sCatIndex, sCatObj){
					if(sCatObj.parent_id == catObj.id){
						 $scope.account_list.push(sCatObj);
						
						$.each(res.data.response_account,function(accIndex, accObj){
							if(accObj.parent_id == sCatObj.id){
								$scope.account_list.push(accObj);
								
								/*$.each(res.data.response_account,function(accIndex2, accObj2){
									if(accObj2.parent_id == accObj.id){
										$scope.account_list.push(accObj2);
									
										$.each(res.data.response_account,function(accIndex3, accObj3){
											if(accObj3.parent_id == accObj2.id){
												$scope.account_list.push(accObj3);
											}
										});
									}
								});
								
							}
						});
					}
				});
			});
				*/
			
			}
					else 	toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
  	  });
	
	
	  $scope.delete = function (id,index,arr_data_ret) {
		  
	 var delUrl = $scope.$root.hr+"roles/delete-user-rights"; 
	    ngDialog.openConfirm({
	      template: 'modalDeleteDialogId',
	      className: 'ngdialog-theme-default-custom'
	    }).then(function (value) {
	      $http
			  .post(delUrl, {id:id,'token': $scope.$root.token})
			  .then(function (res) {
				  
					if(res.data.ack == true){
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
						
						$state.go("app.urights-list");
						// arr_data_ret.splice(index,1); 
					}
					else toaster.pop('error', 'Info', 'Record cannot be Deleted.');
					
			  });
	    },
		 function (reason) {
	      console.log('Modal promise rejected. Reason: ', reason);
		});
	};

	 if($scope.$root.uright_id!== undefined ) 	{

			var get = $scope.$root.hr+"roles/get-user-rights-by-id";  
			var postData = {'token': $scope.$root.token,'id': $scope.$root.uright_id }; 
	
			$http
      		.post(get, postData)
      		.then(function (res) {
    		$scope.rec = res.data.response;  
			//$scope.$root.breadcrumbs.push({'name': $scope.rec.sale_bk_code, 'url': '#', 'isActive': false} );
			
			
			
			$.each($scope.role_arry,function(index,obj){ 
				if(obj.id == res.data.response.role_id) $scope.rec.role = obj; 
			});
				
				
				//console.log($scope.rec);
			
   		 	 });  
	
	 }
	 
	$scope.update_main = function(rec){
		
	
		var updateUrl = $scope.$root.hr+"roles/add-user-rights"; 
	 if($scope.$root.uright_id>0)
		var updateUrl = $scope.$root.hr+"roles/update-user-rights"; 
	 	
			$scope.rec.token = $scope.$root.token; 
			if($scope.rec.status!==undefined)
			$scope.rec.statuss = $scope.rec.status.value !== undefined ? $scope.rec.status.value:0;
				 
		 $http
	      .post(updateUrl, $scope.rec)
	      .then(function (res) { 
	   		  		  if(res.data.ack == true){
						toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
						$scope.$root.uright_id=res.data.id;
					 if($stateParams.id===undefined) 	 $state.go("app.urights-list", {id: res.data.id});
				 
			}
					else 	toaster.pop('error', 'info', res.data.error); 
   		   });
	  
	  
  	}
	
	

			
	//colapse display - and plus sign
	angular.element(document).on('click','.pls_mins_sign',function(event){
					//document.getElementById('pls_mins_sign_'+name+'_'+id).className += 'fa-plus'
					
				event.preventDefault();
				if($(this).hasClass('fa-plus')){
					$(this).removeClass('fa-plus');
					$(this).addClass('fa-minus');
				}
				else{
						$(this).removeClass('fa-minus');
						$(this).addClass('fa-plus');
				}
			});
	angular.element(document).on('click','.pls_mins_sign_second',function(event){
				event.preventDefault();

				if($(this).hasClass('fa-plus')){

					$(this).removeClass('fa-plus');
					$(this).addClass('fa-minus');
				}
				else{
					$(this).removeClass('fa-minus');
					$(this).addClass('fa-plus');
				}
			});
	angular.element(document).on('click','.pls_mins_sign_third',function(event){
				event.preventDefault();
				if($(this).hasClass('fa-plus')){
					$(this).removeClass('fa-plus');
					$(this).addClass('fa-minus');
				}
				else{
					$(this).removeClass('fa-minus');
					$(this).addClass('fa-plus');
				}
			});
	angular.element(document).on('click','.pls_mins_sign_fourth',function(event){
				event.preventDefault();
				if($(this).hasClass('fa-plus')){
					$(this).removeClass('fa-plus');
					$(this).addClass('fa-minus');
				}
				else{
					$(this).removeClass('fa-minus');
					$(this).addClass('fa-plus');
				}
			});






   $scope.$root.load_date_picker('sale bucket');
   
}