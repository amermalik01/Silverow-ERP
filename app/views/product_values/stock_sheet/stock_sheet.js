

myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

        $stateProvider 
			 .state('app.stock-sheet', {
					url: '/stock-sheet',
					title: 'Stock Sheet',
					templateUrl: helper.basepath('stock_sheet/stock_sheet.html'),
					resolve: helper.resolveFor('ngTable','ngDialog')
				}) 
			
    }]); 

StockSheetController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http",
    "ngDialog", "toaster"];
myApp.controller('StockSheetController', StockSheetController);

function StockSheetController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams) {
    'use strict';

  $scope.breadcrumbs = 
		 [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
		 {'name':'Inventory','url':'#','isActive':false},
		 {'name':'Stock Sheet','url':'#','isActive':false}];

    var vm = this;
    
    
	$scope.rec = {};
	$scope.record = {};
	
		
	$scope.MainDefer = null;
	$scope.mainParams = null;
	$scope.mainFilter = null;
	$scope.more_fields = '';	
	
	$scope.count = 1;
	$scope.sendRequest = false;
    var vm = this;
	
	
	 $scope.arr_warehouse=[];
	 var whUrl = $scope.$root.setup+"warehouse/get-all-list";
	 $http
	    .post(whUrl, {'token':$scope.$root.token})
	    .then(function (res) {
	    if(res.data.ack == true){
	     $scope.arr_warehouse = res.data.response;
	    } 
	  });
	$scope.arr_categories=[];
	var getListUrl = $scope.$root.sales+"stock/categories";
	     $http
	     .post(getListUrl, {all:1,'token': $scope.$root.token})
	     .then(function (res) {
	     if (res.data.ack == true) {
	     	$scope.arr_categories = res.data.response;
	     }
	});
	
	
	
	$scope.SalePrefix = '';
	var getCrmCodeUrl = $scope.$root.sales+"customer/order/get-order-code";
    $http
      .post(getCrmCodeUrl, {'is_increment':0,type:1,'token':$scope.$root.token})
      .then(function (res) {
		$scope.SalePrefix = res.data.prefix;
   });
   
	$scope.status_data={};
   $scope.status_data = [{'label': 'Show All', 'value': 0},{'label': 'Available', 'value': 1}];
	$scope.rec.status  = $scope.status_data[1];
	 
	
    var Api = $scope.$root.stock + "products-listing/get-product-stock-sheet";
	$scope.postData={};
	$scope.postData = {token:$scope.$root.token,statuss:$scope.rec.status.value}
 
    $scope.$watch("MyCustomeFilters", function () {
        if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
            $scope.table.tableParams5.reload();
        }
    }, true);
    $scope.MyCustomeFilters = {
    }

    vm.tableParams5 = new ngParams({
        page: 1, // show first page
        count: $scope.$root.pagination_limit, // count per page
	  // sorting: {code:'desc'},
	    sorting: {id:'desc'},
        filter: {
            name: '',
            age: ''
        }
    },
   {
		total: 0, // length of data
		counts: [], // hide page counts control

		getData: function ($defer, params) {
			
			ngDataService.getDataCustom($defer, params, Api, $filter, $scope, $scope.postData);
	
	  
		$scope.MainDefer = $defer;
		$scope.mainParams = params;
		$scope.mainFilter = $filter;
		
		//console.log($defer);
		//$defer.resolve(data);
		
		}
	});


 	 
	 $scope.getStock = function(parm){
		
    	$scope.rec.token = $scope.$root.token;
    	$scope.rec.warehouse_id = $scope.rec.warehouse !=undefined? $scope.rec.warehouse.id:'';
    	$scope.rec.category_id = $scope.rec.category !=undefined? $scope.rec.category.id:'';
    	
		if(parm == 'all'){
    		$scope.rec = {};
    		$scope.rec.token = $scope.$root.token;
    	}
    	$scope.postData = $scope.rec;
    	$scope.$root.$broadcast("myReload");
		
    }
	
	
    	 
	$scope.status_data={};
   $scope.status_data = [{'label': 'Show All', 'value': 0},{'label': 'Available', 'value': 1}];
	$scope.rec.status  = $scope.status_data[1];
	 
		$scope.getItem = function(parm){
			
    	$scope.rec.token = $scope.$root.token; 
    	if(parm == 'all'){
    		$scope.rec = {};
    		$scope.rec.token = $scope.$root.token;
    	}
		
    	$scope.postData = $scope.rec;
		$scope.postData.statuss = $scope.rec.status !== undefined ? $scope.rec.status.value : 0;
		
    	 $scope.$root.$broadcast("myReload"); 
    }
	
		$scope.$on("myReload", function (event) {
			$scope.$data = {};	  $scope.columns = [];
 			 $scope.table.tableParams5.reload();
  		  });
		
	 
	 function toTitleCase(str){
        var title = str.replace('_',' ');
        return title.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
	
	
	//shahzada
	$scope.type_array={};
   $scope.type_array = [
   {'name': 'Purchase Order', 'id': '1-2'},
   {'name': 'Purchase Invoice', 'id': '1-3'},
   {'name': 'Purchase Return', 'id': '1-1'},
   {'name': 'Sales Order', 'id': '2-2'},
   {'name': 'Sales Invoice', 'id': '2-3'},
   {'name': 'Sales Return', 'id': '2-1'}];
		$scope.arr_by={};
   $scope.arr_by = [
   {'name': 'Date Received', 'id': '1'},
   {'name': 'Use by Date', 'id': '2'}];
	//popup
 $scope.columns_general = [];
    $scope.general = {};
	$scope.getProduct = function(id,title,show,type_pass,code){
		
    	$scope.rec.token = $scope.$root.token;
		$scope.rec.product_id = id;
		
		
    	if(type_pass==22){
		$scope.rec.warehouse_id = $scope.rec.warehouse !=undefined? $scope.rec.warehouse.id:'';
		$scope.rec.category_id = $scope.rec.category !=undefined? $scope.rec.category.id:'';
		$scope.rec.type_id = $scope.rec.type !=undefined? $scope.rec.type.id:'';
		$scope.rec.by_id = $scope.rec.by !=undefined? $scope.rec.by.id:'';
		$scope.rec.date_from;
		$scope.rec.date_to;
	
		if($scope.rec.by_id!=undefined){
			if($scope.rec.date_from=='' && $scope.rec.date_to==''){
		
				toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Date']));
				}
				
		}
		
		if($scope.rec.date_from && $scope.rec.date_to){
			if($scope.rec.by==''){
				toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Date By']));
			}
		}
		
		}
		else
		{
				 $scope.rec.warehouse= '';
		  $scope.rec.warehouse_id = '';
            $scope.rec.category_id = '';
            $scope.rec.type = '';
            $scope.rec.by = '';
			$scope.rec.type_id = '';
            $scope.rec.by_id = '';
            $scope.rec.date_from = '';
            $scope.rec.date_to = '';
		}
		//$scope.rec.type;
		
    	 
	/*	if($scope.rec.date_from==undefined){
			$scope.rec.date_from=null;
		}
		if($scope.rec.date_to==undefined){
			$scope.rec.date_to=null;
		}*/
		
		
	//console.log("t "+$scope.rec.type+ " _ " + $scope.rec.warehouse_id);
		
		/*if(parm == 'all'){
    		$scope.rec = {};
    		$scope.rec.token = $scope.$root.token;
    	}*/
    	var postDatastock = $scope.rec;
    	
		$scope.title=title;
		$scope.pcode=code;
		
		
		var  stockApi = $scope.$root.stock+"products-listing/stock-sheet";
        $http
                .post(stockApi, postDatastock)
                .then(function (res) {

                    if (res.data.ack == true) {
						
                        $scope.columns_general = [];
                        $scope.general = {};

                        $scope.general = res.data.response;
						 angular.forEach(res.data.response[0], function (val, index) {
                            $scope.columns_general.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
						//console.log(res.data.response.QTY._sold);
						
						if(show==1){
							
						angular.element('#model_status_product').modal({show: true});
						}
                    } 
					else { 
                        $scope.columns_general = [];
                        $scope.general = [];
						 toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                    }

                });
			
    }

	$scope.getTotalSold = function(int) {
    var totalSold = 0;
    angular.forEach($scope.general, function(el) {
        totalSold =Number(totalSold) + Number(el[int]);
    });
    return totalSold;
};
$scope.getTotalRemaining = function(int) {
    var totalRemaining = 0;
    angular.forEach($scope.general, function(el) {
        totalRemaining =Number(totalRemaining)+Number(el[int]);
    });
    return totalRemaining;
};
	 
	
	
$scope.$root.load_date_picker('stock_sheet');
}
 