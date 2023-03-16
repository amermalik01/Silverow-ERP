PostingSetupController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","toaster","ngDialog"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
 $stateProvider	  
	.state('app.posting-setup', {
        url: '/posting-setup',
        title: 'PostingSetup',
        templateUrl: helper.basepath('posting_setup/posting_setup.html'),
        resolve: helper.resolveFor('ngTable','ngDialog')
    })
	.state('app.add-posting-setup', {
        url: '/posting-setup/add',
        title: 'Add Posting Setup',
        templateUrl: helper.basepath('add.html'),
         resolve: helper.resolveFor('ngDialog'),
		controller: 'PostingSetupAddController'
    })
	  .state('app.edit-posting-setup', {
		url: '/posting-setup/:id/edit',
        title: 'Edit Posting Setup',
        templateUrl: helper.basepath('edit.html'),
		controller: 'PostingSetupEditController',
		resolve: helper.resolveFor('ngTable','ngDialog')
	  })
	  .state('app.view-posting-setup', {
		url: '/posting-setup/:id/view',
        title: 'View Posting Setup',
        templateUrl: helper.basepath('view.html'),
		controller: 'PostingSetupEditController',
		resolve: helper.resolveFor('ngTable','ngDialog')
	  })
  
 }]);

myApp.controller('PostingSetupController', PostingSetupController);
myApp.controller('PostingSetupAddController', PostingSetupAddController);
myApp.controller('PostingSetupEditController', PostingSetupEditController); 

function PostingSetupController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,toaster,ngDialog) {
    'use strict';

	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'General','url':'#','isActive':false},
		 {'name':'Posting Setup','url':'#','isActive':false}];

	var vm = this;
	$scope.columns = [];
	$scope.postingData = {};
    var Api = $scope.$root.setup+"ledger-group/posting-setup-listing";
    var deletePostingSetup = $scope.$root.setup+"ledger-group/delete-posting-setup";
    var postData = {
	    'token': $scope.$root.token,
	    'all': "1",
	    'column':'general_ledger_setup.type',
	    'more_fields':'status*customer*product'
  	};

	if($scope.$root.posting_setup_type_filter_id == 98)
		postData.value = 'General';
	if($scope.$root.posting_setup_type_filter_id == 146)
		postData.value = 'VAT'; 
	if($scope.$root.posting_setup_type_filter_id == 147)
		postData.value = 'Customer';
	if($scope.$root.posting_setup_type_filter_id == 148)
		postData.value = 'Supplier';

    $scope.getPostSetup = function(){
    	$scope.postingData = {};
    	$scope.filter_id = this.selected.value;
    	postData.filter_id = $scope.filter_id;

    	if($scope.filter_id == 98)
    		postData.value = 'General';
    	if($scope.filter_id == 146)
    		postData.value = 'VAT'; 
    	if($scope.filter_id == 147)
    		postData.value = 'Customer';
    	if($scope.filter_id == 148)
    		postData.value = 'Supplier';

	    $http
	      .post(Api, postData)
	      .then(function (res) {
	        	if(res.data.record.result != null && res.data.record.result.length > 0){
					 $scope.postingData = res.data.record.result;
					 //$scope.columns = res.data.columns;
				
					 angular.forEach(res.data.record.result[0], function (val, index) {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
						
					 $scope.options = res.data.filters_dropdown.dropdown;
					 $.each($scope.options,function(index,obj){
							if(obj.value == $scope.filter_id){
								$scope.selected = $scope.options[index]; 
							}
						});
					 $scope.showLoader = false;
				}
				else{
					$scope.showLoader = false;
				}
	      });
    }

    $http
      .post(Api, postData)
      .then(function (res) {
        	if(res.data.record.result != null && res.data.record.result.length > 0){
        		$scope.columns = [];
				 $scope.postingData = res.data.record.result;
				 //$scope.columns = res.data.columns;
				  angular.forEach(res.data.record.result[0], function (val, index) {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
				 $scope.options = res.data.filters_dropdown.dropdown;
				 $.each($scope.options,function(index,obj){
						if(obj.value == $scope.$root.posting_setup_type_filter_id){
							$scope.selected = $scope.options[index]; 
						}
					});
				 $scope.showLoader = false;
			}
			else{
				$scope.showLoader = false;
			}
      });




      $scope.deletePostingSetup = function (id,index,postingData) {
	    ngDialog.openConfirm({
	      template: 'modalDeleteDialogId',
	      className: 'ngdialog-theme-default-custom'
	    }).then(function (value) {
	      $http
			  .post(deletePostingSetup, {id:id,'token': $scope.$root.token})
			  .then(function (res) {
					if(res.data.ack == true){
						toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
						 postingData.splice(index,1);
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

function PostingSetupAddController($scope, $stateParams, $http, $state,toaster, $resource,ngDialog,$timeout){

	$scope.formTitle = 'Posting Setup';
	$scope.btnCancelUrl = 'app.posting-setup';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'General','url':'#','isActive':false},
		 {'name':'Posting Setup','url':'app.posting-setup','isActive':false},
		 {'name':'Add','url':'#','isActive':false}];

	$scope.formUrl = function() {
		return "app/views/posting_setup/_form.html";
	  }
	  
	  $scope.rec = {}; 
	  $scope.lbl_business_posting = 'Business Posting';
	 $scope.lbl_product_posting ='Product Posting';
	 $scope.lbl_sales_account = 'Sales Account';
 	 $scope.lbl_purchase_account = 'Purchase Account';
 	 $scope.chck_type = 1;
 	 $scope.check_readonly = 0;
	$scope.check_disabled = 0;


      $scope.arr_types = [
      	{'value':'1','label':'General'},
      	{'value':'2','label':'VAT'},
      	{'value':'3','label':'Customer Posting'},
      	{'value':'4','label':'Supplier Posting'}
      ];


 	$scope.getData = function(){
	 	$scope.arr_customer_posting_group = [];
		$scope.arr_product_posting_group = [];
	 	
 		var type = $scope.chck_type = $scope.rec.types.value;
 		var strType = '';

 		if(type == 1){
 			$scope.lbl_sales_account = 'Sales Account';
 			$scope.lbl_purchase_account = 'Purchase Account';
 			strType = 'General';
 		}
 		if(type == 2){
 			$scope.lbl_sales_account = 'VAT Sales Account';
 			$scope.lbl_purchase_account = 'VAT Sales Account';
 			strType = 'VAT';
 		}
 		if(type == 3){
 			$scope.lbl_sales_account = 'Debtors Account';
 			strType = 'Customer';
 		}
 		if(type == 4){
 			$scope.lbl_sales_account = 'Credit account';
 			strType = 'Supplier';
 		}


	/*	$resource('api/posting_setup/get_customer_dropdown/:type').get({type:strType},function(data){
			$scope.lbl_business_posting = data.dropdowntitle;
			if(data.arrCustomerPostingType != null){
				angular.forEach(data.arrCustomerPostingType,function(elem,id){
				$scope.arr_customer_posting_group.push({id:id,label:elem}) ;
			});
			}
		})*/;

		var getCustomerPosting = $scope.$root.setup+"ledger-group/get-customer-dropdown";
		$http
	      .post(getCustomerPosting, {'type':strType, 'token':$scope.$root.token})
	      .then(function (res) {
	        	$scope.lbl_business_posting = res.data.dropdowntitle;
				if(res.data.arrCustomerPostingType != null){
					angular.forEach(res.data.arrCustomerPostingType,function(elem,id){
					$scope.arr_customer_posting_group.push({id:id,label:elem}) ;
				});
				}
	      });

		if(type != 4){
			var getProductPosting = $scope.$root.setup+"ledger-group/get-product-dropdown";
			$http
		      .post(getProductPosting, {'type':strType, 'token':$scope.$root.token})
		      .then(function (res) {
		        	$scope.lbl_product_posting = res.data.dropdowntitle;
					if(res.data.arrProductPostingType != null){
						angular.forEach(res.data.arrProductPostingType,function(elem,id){
						$scope.arr_product_posting_group.push({id:id,label:elem}) ;
					});
					}
		      });
	 }
  	}

  	$scope.accountChart = function(field){
			// For one time fetching data	
	    $scope.parent = {};
		$scope.child = {};
		$scope.total = {};
		var table = 'account_heads';
		var order_by = 'number';
		$scope.child_html = '';
		$scope.part_html = '';
		
		var getChartOfAccount = $scope.$root.setup+"ledger-group/get-chart-of-accounts";
		$http
	      .post(getChartOfAccount, {'token':$scope.$root.token})
	      .then(function (res) {
	      	
	      
			$scope.parent = res.data.parent;
			$scope.child = res.data.child;
			$scope.total = res.data.total;
			$scope.grand_total = 0;
			$scope.chk_array = [];
			$scope.arrCatTotal = [];
			$scope.totals = 0;
			$scope.chk = 0;
			var account_type = 0;
			var c1_account_type = 0;
			var c2_account_type = 0;
			
			//console.log($scope.parent);
			$scope.part_html = '<ul class="main-ul">';
			$.each($scope.parent, function(id, arrValue) 
			{
				if(arrValue != null){
				if ($.inArray(id, $scope.chk_array) == -1)
				{
					if (arrValue['category_id'] == 0)
						$scope.chk = id;
					get_total(arrValue);
					//console.log(arrValue['account_type'])
					if(arrValue['account_type'] == 'Posting')
						account_type = 1;
					if(arrValue['account_type'] == 'Heading')
						account_type = 2;
					if(arrValue['account_type'] == 'Begin-Total')
						account_type = 3;
					if(arrValue['account_type'] == 'End-Total')
						account_type = 4;

					$scope.child_html = '<li class="lite-col one" style="margin-top:4px;" >';
					$scope.child_html = $scope.child_html+'<a  ng-click="confirm({number:'+arrValue['number']+',account_type:'+account_type+', field:'+field+'})">'+arrValue['number']+' '+arrValue['name']+'</a>';
					print_total(arrValue);
					$scope.child_html = $scope.child_html+'</li>';		
					$scope.child_html = $scope.child_html+'<ul>';
					$.each($scope.child[id], function(tempId, arrChdValue) 
					{
						get_total(arrChdValue);
						var ntempId = arrChdValue['id'];
						if(arrChdValue['account_type'] == 'Posting')
							c1_account_type = 1;
						if(arrChdValue['account_type'] == 'Heading')
							c1_account_type = 2;
						if(arrChdValue['account_type'] == 'Begin-Total')
							c1_account_type = 3;
						if(arrChdValue['account_type'] == 'End-Total')
							c1_account_type = 4;
						
						$scope.child_html = $scope.child_html+'<li class="lite-col two" style="margin-top:4px;"><a  ng-click="confirm({number:'+arrChdValue['number']+', account_type:'+c1_account_type+', field:'+field+'})">';
						$scope.child_html = $scope.child_html+arrChdValue['number']+' '+arrChdValue['name']+'</a>';
						print_total(arrChdValue);
						$scope.child_html = $scope.child_html+'</li>';						
						$scope.chk_array[ntempId] = ntempId;
						if (arrChdValue['is_partent'] == 1)
							get_child(ntempId);
					});
					$scope.child_html = $scope.child_html+'</ul>';
					$scope.part_html = $scope.part_html+$scope.child_html;
				}
				$scope.chk_array[id] = id;
				}
			});
			
			$scope.part_html = $scope.part_html+'</ul>';
			
			
			function get_child(id)
			{
				
				if($scope.child[id] != undefined){
					$scope.child_html = $scope.child_html+'<ul>';
					$.each($scope.child[id], function(tempId, arrChdValue) 
					{
						get_total(arrChdValue);
						var inTemp = arrChdValue['id'];	
						if(arrChdValue['account_type'] == 'Posting')
							c2_account_type = 1;
						if(arrChdValue['account_type'] == 'Heading')
							c2_account_type = 2;
						if(arrChdValue['account_type'] == 'Begin-Total')
							c2_account_type = 3;
						if(arrChdValue['account_type'] == 'End-Total')
							c2_account_type = 4;

						$scope.chk_array[inTemp] = inTemp;
						$scope.child_html = $scope.child_html+'<li class="lite-col three" style="margin-top:4px;" )"><a  ng-click="confirm({number:'+arrChdValue['number']+', account_type:'+c2_account_type+',field:'+field+'})">';	
						$scope.child_html = $scope.child_html+arrChdValue['number']+' '+arrChdValue['name']+'</a>';
						print_total(arrChdValue);
						$scope.child_html = $scope.child_html+'</li>';
						if (arrChdValue['is_partent'] == 1)
								get_child(inTemp);			
					});
					$scope.child_html = $scope.child_html+'</ul>';	
				}
		   }
	   		
			function print_total(arrTemp)
			{
				$scope.child_html = $scope.child_html;
				var id = arrTemp['id'];
				var number = arrTemp['number'];
				if (arrTemp['account_type'] == 'Posting' && $scope.totals > 0)
				{
					$scope.child_html = $scope.child_html+'<a  ng-click="getAccoutDetails('+number+')"><div style="float:right; padding-right:30px;">'+$scope.totals+'</div></a>';
				}
				if (arrTemp['account_type'] == 'End-Total' && $scope.chk == arrTemp['category_id'] && $scope.grand_total > 0)
				{
					$scope.child_html = $scope.child_html+'<div style="float:right; padding-right:30px;">'+$scope.grand_total+"</div>"
				}
				else if (arrTemp['account_type'] == 'End-Total' && $scope.totals > 0)
					$scope.child_html = $scope.child_html+'<div style="float:right; padding-right:30px;">'+$scope.totals+"</div>"
			}
			
			function get_total(arrTemp)
			{
				
				$scope.totals = 0;
				var cat_id = arrTemp['category_id'];
				var number = arrTemp['number'];
				if(arrTemp['account_type'] == 'Heading' && arrTemp['category_id'] == '0')
					$scope.grand_total = 0;
				if(arrTemp['account_type'] == 'Posting' && $scope.total[number] > 0)
				{
					$scope.totals = $scope.total[number];
					
					if ($scope.arrCatTotal[cat_id] > 0 && $scope.totals > 0 )	
						$scope.arrCatTotal[cat_id] = $scope.arrCatTotal[cat_id] + $scope.totals;
					else if ($scope.totals > 0)
						$scope.arrCatTotal[cat_id] = $scope.totals;
				}
				if(arrTemp['account_type'] == 'End-Total')
				{
					if ($scope.arrCatTotal[cat_id] > 0)
						$scope.totals = $scope.arrCatTotal[cat_id];

					if ($scope.grand_total > 0 && $scope.totals > 0)		
						$scope.grand_total = $scope.grand_total + $scope.totals;
					else if ( $scope.totals > 0 ) $scope.grand_total = $scope.totals;
					
				}			
			}
			$scope.snippet = $scope.part_html ;
	        $scope.deliberatelyTrustDangerousSnippet = function() {
	              return $sce.trustAsHtml($scope.snippet);
	          };
		});

			  	
		
  	}
  
  	$scope.getSaleAccount = function(field){
		$scope.accountChart(field);

		ngDialog.openConfirm({
		    template: 'modalAccountDialogId',
		    className: 'ngdialog-theme-default',
			scope: $scope
		    }).then(function (data) {
	
		    	if (data.account_type !== 1) {
		    		toaster.pop('error','Error','Account Type must be Posting!')
		    		return false;
		    	};


		    	if (data.field === 1) 
		    		$scope.rec.account = data.number;
		    	if (data.field === 2) 
		    		$scope.rec.account_2 = data.number;
		    	if (data.field === 3) 
		    		$scope.rec.cogs_account = data.number;
		    	if (data.field === 4) 
		    		$scope.rec.inventory_account = data.number;
		      
		    }, function (reason) {
		      console.log('Modal promise rejected. Reason: ', reason);
		    
  	});
}

$scope.drp_error_type = 0;
$scope.drp_error_prod_group = 0;
$scope.drp_error_cust_group = 0;



	 $scope.add = function(rec){

	 	var type = '';
	 	var product_id = '';
	 	if($scope.rec.types == undefined){
    		$scope.drp_error_type = 1;
    		return false;
	 	}
	 	else
	 		$scope.drp_error_type = 0;

	 	if($scope.rec.customers == undefined){
	 		$scope.drp_error_cust_group = 1;
	 		return false;
	 	}
	 	else
	 		$scope.drp_error_cust_group = 0;

	 	if($scope.rec.products != undefined){
	 			product_id = '@product*'+$scope.rec.products.id;
	 			$scope.drp_error_prod_group = 0;
	 		}
	 	else if($scope.rec.types.value == 1 || $scope.rec.types.value == 2){
	 		$scope.drp_error_prod_group = 1;
	 		return false;
	 	}

	 	if($scope.rec.types.value == 1)
    		type = 'General';
    	if($scope.rec.types.value == 2)
    		type = 'VAT';
    	if($scope.rec.types.value == 3)
    		type = 'Customer';
    	if($scope.rec.types.value == 4)
    		type = 'Supplier';


    	var postparam = {
    		'type':type,
    		'customer':$scope.rec.customers.id,
    		'product':$scope.rec.products != undefined? $scope.rec.products.id:0,
    		'token':$scope.$root.token
    	}
	 	


    	var getLedgerSetupByType = $scope.$root.setup+"ledger-group/get-ledger-setup-by-type";
    	var addPostingSetup = $scope.$root.setup+"ledger-group/add-posting-setup";
		$http
	      .post(getLedgerSetupByType, postparam)
	      .then(function (res) {
			if(res.data.ack == true){
		 		toaster.pop('error','Error','Posting already exist!');
		 		return false;
			 }

		 	rec.type = $scope.rec.types != undefined? $scope.rec.types.value:0;
		 	rec.customer = $scope.rec.customers != undefined? $scope.rec.customers.id:0;
		 	rec.product = $scope.rec.products != undefined? $scope.rec.products.id:0;
		 	rec.token = $scope.$root.token;

			 $http
		      .post(addPostingSetup, rec)
		      .then(function (res) {
		      		$scope.$root.count = $scope.$root.count+1;
		        	if(res.data.ack == true){
		        		if(rec.type == 1)
				    		$scope.$root.posting_setup_type_filter_id = 98;
				    	if(rec.type == 2)
				    		$scope.$root.posting_setup_type_filter_id = 146;
				    	if(rec.type == 3)
				    		$scope.$root.posting_setup_type_filter_id = 147;
				    	if(rec.type == 4)
				    		$scope.$root.posting_setup_type_filter_id = 148;
						 	toaster.pop('success', 'Add', 'Record added.');
						 $timeout(function(){ $state.go('app.posting-setup'); }, 3000);
					}
					else{
							toaster.pop('error', 'Add', 'Record can\'t be added!');
					}
		      });

	      });
	  }

	  
}

function PostingSetupEditController($scope, $stateParams, $http, $state,toaster, $resource,ngDialog,$timeout){

	$scope.formTitle = 'Posting Setup';
	$scope.btnCancelUrl = 'app.posting-setup';
	$scope.breadcrumbs = 
		[//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Setup','url':'#','isActive':false},
		 {'name':'General','url':'#','isActive':false},
		 {'name':'Posting Setup','url':'app.posting-setup','isActive':false},
		 {'name':'Edit','url':'#','isActive':false}];

	$scope.arr_types = [
      	{'value':'General','label':'General'},
      	{'value':'VAT','label':'VAT'},
      	{'value':'Customer','label':'Customer Posting'},
      	{'value':'Supplier','label':'Supplier Posting'}
      ];

	$scope.formUrl = function() {
		return "app/views/posting_setup/_form.html";
	  }
	  
	  $scope.rec = {}; 
	  $scope.check_readonly = 0;
 	  $scope.check_disabled = 1;
	 

  	$scope.accountChart = function(field){
			// For one time fetching data	
	    $scope.parent = {};
		$scope.child = {};
		$scope.total = {};
		$scope.child_html = '';
		$scope.part_html = '';

	 	var getChartOfAccount = $scope.$root.setup+"ledger-group/get-chart-of-accounts";
		$http
	      .post(getChartOfAccount, {'token':$scope.$root.token})
	      .then(function (res) {

			$scope.parent = res.data.parent;
			$scope.child = res.data.child;
			$scope.total = res.data.total;
			$scope.grand_total = 0;
			$scope.chk_array = [];
			$scope.arrCatTotal = [];
			$scope.totals = 0;
			$scope.chk = 0;
			var account_type = 0;
			var c1_account_type = 0;
			var c2_account_type = 0;
			
			//console.log($scope.parent);
			$scope.part_html = '<ul class="main-ul">';
			$.each($scope.parent, function(id, arrValue) 
			{
				if(arrValue != null){
				if ($.inArray(id, $scope.chk_array) == -1)
				{
					if (arrValue['category_id'] == 0)
						$scope.chk = id;
					get_total(arrValue);
					//console.log(arrValue['account_type'])
					if(arrValue['account_type'] == 'Posting')
						account_type = 1;
					if(arrValue['account_type'] == 'Heading')
						account_type = 2;
					if(arrValue['account_type'] == 'Begin-Total')
						account_type = 3;
					if(arrValue['account_type'] == 'End-Total')
						account_type = 4;

					$scope.child_html = '<li class="lite-col one" style="margin-top:4px;" >';
					$scope.child_html = $scope.child_html+'<a  ng-click="confirm({number:'+arrValue['number']+',account_type:'+account_type+', field:'+field+'})">'+arrValue['number']+' '+arrValue['name']+'</a>';
					print_total(arrValue);
					$scope.child_html = $scope.child_html+'</li>';		
					$scope.child_html = $scope.child_html+'<ul>';
					$.each($scope.child[id], function(tempId, arrChdValue) 
					{
						get_total(arrChdValue);
						var ntempId = arrChdValue['id'];
						if(arrChdValue['account_type'] == 'Posting')
							c1_account_type = 1;
						if(arrChdValue['account_type'] == 'Heading')
							c1_account_type = 2;
						if(arrChdValue['account_type'] == 'Begin-Total')
							c1_account_type = 3;
						if(arrChdValue['account_type'] == 'End-Total')
							c1_account_type = 4;
						
						$scope.child_html = $scope.child_html+'<li class="lite-col two" style="margin-top:4px;"><a  ng-click="confirm({number:'+arrChdValue['number']+', account_type:'+c1_account_type+', field:'+field+'})">';
						$scope.child_html = $scope.child_html+arrChdValue['number']+' '+arrChdValue['name']+'</a>';
						print_total(arrChdValue);
						$scope.child_html = $scope.child_html+'</li>';						
						$scope.chk_array[ntempId] = ntempId;
						if (arrChdValue['is_partent'] == 1)
							get_child(ntempId);
					});
					$scope.child_html = $scope.child_html+'</ul>';
					$scope.part_html = $scope.part_html+$scope.child_html;
				}
				$scope.chk_array[id] = id;
				}
			});
			
			$scope.part_html = $scope.part_html+'</ul>';
			
			
			function get_child(id)
			{
				
				if($scope.child[id] != undefined){
					$scope.child_html = $scope.child_html+'<ul>';
					$.each($scope.child[id], function(tempId, arrChdValue) 
					{
						get_total(arrChdValue);
						var inTemp = arrChdValue['id'];	
						if(arrChdValue['account_type'] == 'Posting')
							c2_account_type = 1;
						if(arrChdValue['account_type'] == 'Heading')
							c2_account_type = 2;
						if(arrChdValue['account_type'] == 'Begin-Total')
							c2_account_type = 3;
						if(arrChdValue['account_type'] == 'End-Total')
							c2_account_type = 4;

						$scope.chk_array[inTemp] = inTemp;
						$scope.child_html = $scope.child_html+'<li class="lite-col three" style="margin-top:4px;" )"><a  ng-click="confirm({number:'+arrChdValue['number']+', account_type:'+c2_account_type+',field:'+field+'})">';	
						$scope.child_html = $scope.child_html+arrChdValue['number']+' '+arrChdValue['name']+'</a>';
						print_total(arrChdValue);
						$scope.child_html = $scope.child_html+'</li>';
						if (arrChdValue['is_partent'] == 1)
								get_child(inTemp);			
					});
					$scope.child_html = $scope.child_html+'</ul>';	
				}
		   }
	   		
			function print_total(arrTemp)
			{
				$scope.child_html = $scope.child_html;
				var id = arrTemp['id'];
				var number = arrTemp['number'];
				if (arrTemp['account_type'] == 'Posting' && $scope.totals > 0)
				{
					$scope.child_html = $scope.child_html+'<a  ng-click="getAccoutDetails('+number+')"><div style="float:right; padding-right:30px;">'+$scope.totals+'</div></a>';
				}
				if (arrTemp['account_type'] == 'End-Total' && $scope.chk == arrTemp['category_id'] && $scope.grand_total > 0)
				{
					$scope.child_html = $scope.child_html+'<div style="float:right; padding-right:30px;">'+$scope.grand_total+"</div>"
				}
				else if (arrTemp['account_type'] == 'End-Total' && $scope.totals > 0)
					$scope.child_html = $scope.child_html+'<div style="float:right; padding-right:30px;">'+$scope.totals+"</div>"
			}
			
			function get_total(arrTemp)
			{
				
				$scope.totals = 0;
				var cat_id = arrTemp['category_id'];
				var number = arrTemp['number'];
				if(arrTemp['account_type'] == 'Heading' && arrTemp['category_id'] == '0')
					$scope.grand_total = 0;
				if(arrTemp['account_type'] == 'Posting' && $scope.total[number] > 0)
				{
					$scope.totals = $scope.total[number];
					
					if ($scope.arrCatTotal[cat_id] > 0 && $scope.totals > 0 )	
						$scope.arrCatTotal[cat_id] = $scope.arrCatTotal[cat_id] + $scope.totals;
					else if ($scope.totals > 0)
						$scope.arrCatTotal[cat_id] = $scope.totals;
				}
				if(arrTemp['account_type'] == 'End-Total')
				{
					if ($scope.arrCatTotal[cat_id] > 0)
						$scope.totals = $scope.arrCatTotal[cat_id];

					if ($scope.grand_total > 0 && $scope.totals > 0)		
						$scope.grand_total = $scope.grand_total + $scope.totals;
					else if ( $scope.totals > 0 ) $scope.grand_total = $scope.totals;
					
				}			
			}
			$scope.snippet = $scope.part_html ;
	        $scope.deliberatelyTrustDangerousSnippet = function() {
	              return $sce.trustAsHtml($scope.snippet);
	          };
		});

			  	
		
  	}
  
  	$scope.getSaleAccount = function(field){
		$scope.accountChart(field);

		ngDialog.openConfirm({
		    template: 'modalAccountDialogId',
		    className: 'ngdialog-theme-default',
			scope: $scope
		    }).then(function (data) {
	
		    	if (data.account_type !== 1) {
		    		toaster.pop('error','Error','Account Type must be Posting!')
		    		return false;
		    	};


		    	if (data.field === 1) 
		    		$scope.rec.account = data.number;
		    	if (data.field === 2) 
		    		$scope.rec.account_2 = data.number;
		    	if (data.field === 3) 
		    		$scope.rec.cogs_account = data.number;
		    	if (data.field === 4) 
		    		$scope.rec.inventory_account = data.number;
		      
		    }, function (reason) {
		      console.log('Modal promise rejected. Reason: ', reason);
		    
  	});
}

     /*$scope.arr_types = []; 
 	$resource('api/company/get_enum_values/general_ledger_setup/type').get(function(data){
		$scope.arr_types = data.result;
	});*/
	



 var id = $stateParams.id;
$scope.arr_customer_posting_group = [];
$scope.arr_product_posting_group = [];
var getPostingSetup = $scope.$root.setup+"ledger-group/get-posting-setup";
$http
  .post(getPostingSetup, {'token':$scope.$root.token,'id':id})
  .then(function (res) {
	$scope.rec = res.data.response;
	$scope.rec.update_id = res.data.response.id;
	var type = res.data.response.type;
	 $scope.lbl_business_posting = 'Business Posting';
	 $scope.lbl_product_posting ='Product Posting';
	 $scope.lbl_sales_account = 'Sales Account';
 	 $scope.lbl_purchase_account = 'Purchase Account';
	 	
 		if(type == 'General'){
		 	$scope.chck_type = 1;
 			$scope.lbl_sales_account = 'Sales Account';
 			$scope.lbl_purchase_account = 'Purchase Account';
 		}
 		if(type == 'VAT'){
		 	$scope.chck_type = 2;
 			$scope.lbl_sales_account = 'VAT Sales Account';
 			$scope.lbl_purchase_account = 'VAT Sales Account';
 		}
 		if(type == 'Customer'){
		 	$scope.chck_type = 3;
 			$scope.lbl_sales_account = 'Debtors Account';
 		}
 		if(type == "Supplier"){
		 	$scope.chck_type = 4;
 			$scope.lbl_sales_account = 'Credit account';
 		}

 		$timeout(function(){
 			$.each($scope.arr_types,function(index,elem){
 				if(elem.value == res.data.response.type){$scope.rec.types = elem;}});
 		},300);

 		var getCustomerPosting = $scope.$root.setup+"ledger-group/get-customer-dropdown";
		$http
	      .post(getCustomerPosting, {'type':type, 'token':$scope.$root.token})
	      .then(function (cusres) {
	        	$scope.lbl_business_posting = cusres.data.dropdowntitle;
				if(cusres.data.arrCustomerPostingType != null){
					angular.forEach(cusres.data.arrCustomerPostingType,function(elem,id){
					$scope.arr_customer_posting_group.push({id:id,label:elem}) ;
					$.each($scope.arr_customer_posting_group,function(index,elem){
						if(elem.id == res.data.response.customer){$scope.rec.customers = elem;}});
				});
				}
	      });

	      
		if(type != 4){
			var getProductPosting = $scope.$root.setup+"ledger-group/get-product-dropdown";
			$http
		      .post(getProductPosting, {'type':type, 'token':$scope.$root.token})
		      .then(function (prodres) {
		        	$scope.lbl_product_posting = prodres.data.dropdowntitle;
					if(prodres.data.arrProductPostingType != null){
						angular.forEach(prodres.data.arrProductPostingType,function(elem,id){
						$scope.arr_product_posting_group.push({id:id,label:elem}) ;
						$.each($scope.arr_product_posting_group,function(index,elem){if(elem.id == res.data.response.product){$scope.rec.products = elem;}});	
					});
					}
		      });
	 	}
	
	
});



$scope.drp_error_type = 0;
$scope.drp_error_prod_group = 0;
$scope.drp_error_cust_group = 0;

	
	$scope.rec = {};

	 $scope.update = function(rec){

	 	var type = '';
	 	var product_id = '';
	 	if($scope.rec.types == undefined){
    		$scope.drp_error_type = 1;
    		return false;
	 	}
	 	else
	 		$scope.drp_error_type = 0;

	 	if(rec.customer == undefined){
	 		$scope.drp_error_cust_group = 1;
	 		return false;
	 	}
	 	else
	 		$scope.drp_error_cust_group = 0;

	 	if($scope.rec.products != undefined){
	 			product_id = '@product*'+$scope.rec.products.id;
	 			$scope.drp_error_prod_group = 0;
	 		}
	 	else if($scope.rec.types.value == 1 || $scope.rec.types.value == 2){
	 		$scope.drp_error_prod_group = 1;
	 		return false;
	 	}

	 	if($scope.rec.types.value == 1)
    		type = 'General';
    	if($scope.rec.types.value == 2)
    		type = 'VAT';
    	if($scope.rec.types.value == 3)
    		type = 'Customer';
    	if($scope.rec.types.value == 4)
    		type = 'Supplier';

    	var postparam = {
    		'type':type,
    		'customer':$scope.rec.customers.id,
    		'product':$scope.rec.products != undefined? $scope.rec.products.id:0,
    		'token':$scope.$root.token
    	}

    	var getLedgerSetupByType = $scope.$root.setup+"ledger-group/get-ledger-setup-by-type";
    	var updatePostingSetup = $scope.$root.setup+"ledger-group/update-posting-setup";
		$http
	      .post(getLedgerSetupByType, postparam)
	      .then(function (res) {
			if(res.data.ack == true){
		 		toaster.pop('error','Error','Posting already exist!');
		 		return false;
			 }

		 	rec.type = $scope.rec.types != undefined? $scope.rec.types.value:0;
		 	rec.customer = $scope.rec.customers != undefined? $scope.rec.customers.id:0;
		 	rec.product = $scope.rec.products != undefined? $scope.rec.products.id:0;
		 	rec.token = $scope.$root.token;
		 	rec.id = id;

		 	/*console.log(rec);
		 	return;*/
		 	
			 $http
		      .post(updatePostingSetup, rec)
		      .then(function (res) {
		      		$scope.$root.count = $scope.$root.count+1;
		        	if(res.data.ack == true){
		        		if(rec.type == 'General')
				    		$scope.$root.posting_setup_type_filter_id = 98;
				    	if(rec.type == 'VAT')
				    		$scope.$root.posting_setup_type_filter_id = 146;
				    	if(rec.type == 'Customer')
				    		$scope.$root.posting_setup_type_filter_id = 147;
				    	if(rec.type == 'Supplier')
				    		$scope.$root.posting_setup_type_filter_id = 148;

				    	console.log($scope.$root.posting_setup_type_filter_id);

						 	toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
							 $timeout(function(){ $state.go('app.posting-setup'); }, 3000);
						}
						else{
							toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(106));
						}
		      });

	      });
	  }

	  
}

 
