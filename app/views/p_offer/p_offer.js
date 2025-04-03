POfferController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster"];

myApp.controller('POfferController', POfferController);
myApp.controller('POfferAddController', POfferAddController);


function POfferController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster, $stateParams) {
    'use strict';
	
	$scope.module_id = 74;
	$scope.filter_id = 119;
	$scope.module_table = 'crm_price_offer';
	$scope.more_fields = 'is_listed*volume_1_price*volume_2_price*volume_3_price';
	$scope.condition = 0;
	$scope.sendRequest = false;

	if($scope.$root.crm_id > 0)
		$scope.postData = {'column':'crm_id','value':$scope.$root.crm_id,token:$scope.$root.token,'more_fields':$scope.more_fields}

	$scope.MainDefer = null;
	$scope.mainParams = null;
	$scope.mainFilter = null;
	
		
	$scope.count = 1;
    var vm = this;
	
   var ApiAjax = $scope.$root.sales+"crm/crm/price-offers";
    
	$scope.$on("myPOfferEventReload", function (event, args) {
		$scope.sendRequest = true;
		if(args != undefined){
			if(args[1] != undefined)
				$scope.detail(args[1]);
			$scope.postData = {'column':'crm_id','value':$scope.$root.crm_id,token:$scope.$root.token,'more_fields':$scope.more_fields}
			$scope.$root.crm_id = args[0];
		}
		$scope.count = $scope.count+1;
				
		ngDataService.getDataCustom( $scope.MainDefer, $scope.mainParams, ApiAjax,$scope.mainFilter,$scope,$scope.postData);
		$scope.table.tableParams5.reload();

    });
	
	$scope.detail = function(id){
		 $timeout(function() {
			if($scope.$root.lblButton == 'Add New'){
				$scope.$root.lblButton = 'Edit';
			}
		}, 100);
		
		$scope.$root.tabHide = 0;
		$scope.$root.$broadcast("openPOfferFormEvent", {'edit':false,id:id});
	}

	$scope.editForm = function(id){
		$scope.$root.$broadcast("openPOfferFormEvent", {'edit':true,id:id});
	}
	

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
        	if($scope.$root.crm_id > 0 && $scope.sendRequest == true)
					ngDataService.getDataCustom($defer, params, ApiAjax,$filter,$scope,$scope.postData);
			$scope.MainDefer = $defer;
			$scope.mainParams = params;
			$scope.mainFilter = $filter;
        }
    });


    $scope.$data = {};
    $scope.delete = function (id,index,$data) {
    	var delUrl = $scope.$root.sales+"crm/crm/delete-price-offer";
	    ngDialog.openConfirm({
	      template: 'modalDeleteDialogId',
	      className: 'ngdialog-theme-default-custom'
	    }).then(function (value) {
	      $http
			  .post(delUrl, {id:id,'token': $scope.$root.token})
			  .then(function (res) {
					if(res.data.ack == true){
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
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

	$scope.moveToPriceList = function(id){

	//console.log(rec);
		var pOfferUrl = $scope.$root.sales+"crm/crm/get-price-offer";
			
			var rec = {};
			var table = 'crm_price_offer';
			 $http
		      .post(pOfferUrl, {id:id,'token':$scope.$root.token})
		      .then(function (res) {
		      		var addUrl = $scope.$root.sales+"crm/crm/add-crm-price-offer-listing";
		      		rec = res.data.response;
		      		rec.token = $scope.$root.token;
					 $http
				      .post(addUrl, rec)
				      .then(function (res1) {
				      	if(res1.data.ack == true){
				      		toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(621));
				      		var args = [];
							 args[0] = $scope.$root.crm_id;
							 args[1] = undefined;
							 $scope.$root.$broadcast("myCrmPriceOfferListingEventReload", args);

							 var addUrl = $scope.$root.sales+"crm/crm/update-price-offer";
							 rec.is_listed = 1;
								 $http
							      .post(addUrl, rec)
							      .then(function (res) {
							      	$scope.$root.$broadcast("myPOfferEventReload", args);
							      });
				      	}

				      });

		      });

	}

}

function POfferAddController($scope, $stateParams, $http, $state,$resource,toaster, $timeout, ngDialog,$rootScope,$filter){
	$scope.$root.tabHide = 0;
	$scope.$root.lblButton = 'Add New';
	$scope.check_readonly = 0;
	$scope.rec = {};
	$scope.wordsLength = 0;	
	$scope.arr_volume_1 = [];
	$scope.arr_volume_2 = [];
	$scope.arr_volume_3 = [];
	$scope.arr_unit_of_measure = [];
	$scope.arr_OfferMethod = [];
	$scope.arr_currency ={};
	var constUrl = $scope.$root.setup+"ledger-group/get-predefine-by-type";
	
    var currencyUrl = $scope.$root.setup+"general/currency-list";


	 $scope.showPOfferListing = function(){
	  	$scope.$root.$broadcast("showPOfferListing");
	  }

	  $scope.showPOfferEditForm = function(){
	  	$scope.check_readonly = false;
	  }

	  
		
	  $scope.$on("showAddPOfferForm", function () {
		$scope.check_readonly = false;
		$scope.showItms = true;
		$scope.showServ = true;

		$scope.resetForm();
		var d=new Date();
		var year=d.getFullYear();
		var month=d.getMonth()+1;
		if (month<10){
		month="0" + month;
		};
		var day=d.getDate();
		if (day<10){
		day="0" + day;
		};

        if($rootScope.defaultDateFormat == $rootScope.dtYMD)
                  $scope.offered_date= year + "/" + month + "/" + day;
        if($rootScope.defaultDateFormat == $rootScope.dtMDY)
                  $scope.offered_date= month + "/" + day + "/" + year;
        if($rootScope.defaultDateFormat == $rootScope.dtDMY)
                  $scope.offered_date= day + "/" + month + "/" + year;

  		$scope.offer_date = $filter('date')($scope.offered_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
  		$scope.rec.offer_date = $filter('date')($scope.offered_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);

  		$http
		  .post(constUrl, {'token':$scope.$root.token, type:'OFFER_METHOD'})
		  .then(function (res) {
		    	if(res.data.ack == true){
					$scope.arr_OfferMethod = res.data.response;
					
				}
				$scope.arr_OfferMethod.push({'id':'-1','name':'++ Add New ++'});
		  });
		

	   
	    /*$http
	      .post(currencyUrl, {'token':$scope.$root.token})
	      .then(function (res) {
	        	if(res.data.ack == true){
					$scope.arr_currency = res.data.response;
					$scope.arr_currency.push({'id':'-1','name':'++ Add New ++'});
					$scope.currency_code = $scope.currency_id.name;
					$.each($scope.arr_currency,function(index,elem){
						if(elem.id == $scope.$root.defaultCurrency)
							$scope.rec.currency_ids = elem;
					});
				}
				
	    });*/
	});


	  // if($state.current.name == 'app.view-crm')
	   		//$scope.check_readonly = true;
	
	//$scope.AddTab.open = true;
	//toggleOpen();

	$scope.datePicker = {};

	/************** Calendar *********************/
	$scope.starteDate = function(startDate){
			var newdate = startDate;
			$scope.newD = $scope.newD ? null : newdate;
			$scope.starteDate= false;
		}


	$scope.datePicker = (function () {

	   var method = {};
	   method.instances = [];
	  	$scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
  		};
        $scope.toggleMin();
	    
	   method.open = function ($event, instance) {
		$event.preventDefault();
		$event.stopPropagation();
	  
		var old_instance = $scope.$root.$storage.getItem('old_instance');
	  	if(old_instance != null)
	  		method.instances[old_instance] = false;

		method.instances[instance] = true;
		$scope.$root.$storage.setItem('old_instance',instance);

	   };
	  
	   method.options = {
		'show-weeks': false,
		startingDay: 0
	   };

	   method.format = $scope.$root.dateFormats[$scope.$root.defaultDateFormat];
	  
	   return method;
	  }());  
	 /******************************************/ 

	$scope.$on("openPOfferFormEvent", function (event, arg) {
		
	    $http
		  .post(constUrl, {'token':$scope.$root.token, type:'OFFER_METHOD'})
		  .then(function (res) {
		    	if(res.data.ack == true){
					$scope.arr_OfferMethod = res.data.response;
					
				}
				$scope.arr_OfferMethod.push({'id':'-1','name':'++ Add New ++'});
		  });

		$timeout(function() {
			var id = arg.id;
	   		if(arg.edit == false)
	   			$scope.check_readonly = true;
	   		else
	   			$scope.check_readonly = false;
			angular.element('.accordion-toggle').trigger('click');
			$scope.$root.$broadcast("showPOfferForm");
			 /*$scope.pOfferFormShow = false;
     		 $scope.pOfferListingShow = true;*/
			var pOfferUrl = $scope.$root.sales+"crm/crm/get-price-offer";
			
			$scope.rec = {};
			var table = 'crm_price_offer';
			 $http
		      .post(pOfferUrl, {id:id,'token':$scope.$root.token})
		      .then(function (res) {
		      	$scope.loadDropDownsData(res.data.response.product_id,res.data.response.type);
				$scope.rec = res.data.response;
				$scope.rec.id = res.data.response.id;
  				$scope.offer_date = $filter('date')(res.data.response.created_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
				$scope.wordsLength = res.data.response.comment.length;
				if(res.data.response.primary == 'One_Four_Pallet'){$scope.isPalletSet = 1;}
				if(res.data.response.primary == 'Half_Load'){$scope.isHalfSet = 1;}
				if(res.data.response.primary == 'Full_Load'){$scope.isFullSet = 1;}

				var empUrl = $scope.$root.hr+"employee/get-employee";
				$http
			      .post(empUrl, {id:res.data.response.offered_by_id,'token':$scope.$root.token})
			      .then(function (emp_data) {
			      	//console.log(emp_data);
					$scope.rec.offered_by	= emp_data.data.response.first_name+' '+emp_data.data.response.last_name;
				});
				
				if(res.data.response.type == 1){
					$scope.showItms = true;
					$scope.showServ = false;

					var prodUrl = $scope.$root.sales+"stock/products-listing/product_details";
					$http
				      .post(prodUrl, {product_id:res.data.response.product_id,'token':$scope.$root.token})
				      .then(function (prod_data) {
						$scope.product_description	= prod_data.data.response.description;
						//$scope.product_barcode	= prod_data.data.response.prd_bar_code;
						$scope.product_code = prod_data.data.response.item_code;
					});
				 }
				 if(res.data.response.type == 2){
				 	$scope.showItms = false;
					$scope.showServ = true;
					var prodUrl = $scope.$root.setup+"service/products-listing/product-details";
					$http
				      .post(prodUrl, {product_id:res.data.response.product_id,'token':$scope.$root.token})
				      .then(function (prod_data) {
						$scope.product_description	= prod_data.data.response.description;
						//$scope.product_barcode	= prod_data.data.response.prd_bar_code;
						$scope.product_code = prod_data.data.response.code;
					});
				 }
				
				$timeout(function(){
					$scope.$root.$apply(function(){
						$.each($scope.arr_OfferMethod,function(index,elem){if(elem.id == res.data.response.offer_method_id){$scope.rec.offer_method_ids = elem;}});
						//$.each($scope.arr_currency,function(index,elem){if(elem.id == res.data.response.currency_id){$scope.rec.currency_ids = elem;}});
						$.each($scope.arr_volume_1,function(index,elem){if(elem.id == res.data.response.volume_1){$scope.rec.volume_1s = elem;}});
						$.each($scope.arr_volume_2,function(index,elem){if(elem.id == res.data.response.volume_2){$scope.rec.volume_2s = elem;}});
						$.each($scope.arr_volume_3,function(index,elem){if(elem.id == res.data.response.volume_3){$scope.rec.volume_3s = elem;}});
						$.each($scope.arr_unit_of_measure,function(index,elem){
							if(elem.id == res.data.response.unit_of_measure_1){$scope.rec.unit_of_measure_1s = elem;}
							if(elem.id == res.data.response.unit_of_measure_2){$scope.rec.unit_of_measure_2s = elem;}
							if(elem.id == res.data.response.unit_of_measure_3){$scope.rec.unit_of_measure_3s = elem;}
						});
					});
				},2000);
				//console.log($scope.arr_currency);
				/*var prodUrl = $scope.$root.stock+"products-lis	ting/product_details";
				$http
			      .post(prodUrl, {id:res.data.response.product_id,'token':$scope.$root.token})
			      .then(function (prod_data) {
				$resource('api/company/get_prefix/:table/:number').get({table:'product',number:data.product_id},function(data){
					$scope.product_code = data.code;
				});*/
				
			});
		  }, 100);
	
		   
		 
    });
	
	
	

	$scope.getCurrencyCode = function(){
		$scope.currency_code = this.rec.currency_ids.name;
	}

	$scope.columns = [];
$scope.getOffer = function(arg){
	$scope.title = 'Offered By';
	var empUrl = $scope.$root.hr+"employee/listings";
	 postData = {
		    'token': $scope.$root.token,
		    'all': "1",
	  	};
    $http
      .post(empUrl, postData)
      .then(function (res) {
        	if(res.data.ack == true){
        		$scope.columns = [];
				 $scope.record = res.data.response;
                     angular.forEach(res.data.response[0],function(val,index){
                          $scope.columns.push({
                            'title':toTitleCase(index),
                            'field':index,
                            'visible':true
                          }); 
                      });
			}
			else{
				toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
			}
      });
	
	 ngDialog.openConfirm({
      template: 'modalDialogId2',
      className: 'ngdialog-theme-default',
	  scope: $scope
    }).then(function (result) {
    		$scope.rec.offered_by = result.first_name+' '+result.last_name;
			$scope.rec.offered_by_id = result.id;
		}, function (reason) {
      	console.log('Modal promise rejected. Reason: ', reason);
    });
}


function toTitleCase(str){
        var title = str.replace('_',' ');
        return title.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

$scope.loadDropDownsData = function(item_id,type){
	$scope.arr_volume_1 = [];
	$scope.arr_volume_2 = [];
	$scope.arr_volume_3 = [];
	$scope.arr_unit_of_measure = [];
	

	if(type == 1){
		var volumeUrl = $scope.$root.sales + "stock/unit-measure/get-sale-offer-volume-by-type";
		var unitUrl = $scope.$root.sales + "stock/unit-measure/get-unit-setup-list-category";
	}
	if(type == 2){
		var volumeUrl = $scope.$root.setup+"service/products-listing/price-offer-volumes";
		var unitUrl = $scope.$root.setup+"service/unit-measure/get-all-unit";
	}


		$http
	      .post(volumeUrl, {type:'Volume 1',category: 1,'item_id':item_id ,'token':$scope.$root.token})
	      .then(function (vol_data) {
	      	$scope.arr_volume_1.push({'id':'0','name':''});
	      	$.each(vol_data.data.response,function(index,obj){
				$scope.arr_volume_1.push(obj);
			});
			$scope.arr_volume_1.push({'id':'-1','name':'++ Add New ++'});
		});

		$http
	      .post(volumeUrl, {type:'Volume 2',category: 1,'item_id':item_id ,'token':$scope.$root.token})
	      .then(function (vol_data) {
	      	$scope.arr_volume_2.push({'id':'0','name':''});
	      	$.each(vol_data.data.response,function(index,obj){
				$scope.arr_volume_2.push(obj);
			});
			$scope.arr_volume_2.push({'id':'-1','name':'++ Add New ++'});
		});

		$http
	      .post(volumeUrl, {type:'Volume 3',category: 1,'item_id':item_id ,'token':$scope.$root.token})
	      .then(function (vol_data) {
			$scope.arr_volume_3.push({'id':'0','name':''});
	      	$.each(vol_data.data.response,function(index,obj){
				$scope.arr_volume_3.push(obj);
			});
			$scope.arr_volume_3.push({'id':'-1','name':'++ Add New ++'});
		});

	    $http
	      .post(unitUrl, {item_id:item_id,'token':$scope.$root.token})
	      .then(function (unit_data) {
	      	$scope.arr_unit_of_measure.push({'id':'0','name':''});
	      	$.each(unit_data.data.response,function(index,obj){
				$scope.arr_unit_of_measure.push(obj);
			});
			//$scope.arr_unit_of_measure.push({'id':'-1','title':'++ Add New ++'});
		});

	    
}

$scope.items = {};
$scope.services = {};

$scope.getProduct= function(){
	$timeout(function(){
	  if($scope.rec.id != undefined){
	  	if($scope.rec.type == 1)
	  		angular.element("#pOfferItems a").click();
	  	if($scope.rec.type == 2)
	  		angular.element("#pOfferServices a").click();
	  }
	  else
	  		angular.element("#pOfferItems a").click();
	},2000);
      angular.element('#itemServModal').modal({show: true});
	}

$scope.getProductListing = function(){
	if($scope.rec.id == undefined)
		$scope.loadDropDownsData(1);
	$scope.title = 'Items';
	$scope.rec.type = 1;
	//var prodApi = $scope.$root.stock+"products-listing/get-products-popup";
	var prodApi = $scope.$root.sales + "stock/products-listing/get-products-setup-list";
	 postData = {
		    'token': $scope.$root.token,
		    'all': "1",
		    'crm_id':$scope.$root.crm_id
	  	};
    $http
      .post(prodApi, postData)
      .then(function (res) {
        	if(res.data.ack == true){
				 $scope.items = res.data.response;
			}
      });
}
$scope.getServices= function(){
	if($scope.rec.id == undefined)
		$scope.loadDropDownsData(2);
	$scope.title = 'Items';
	$scope.rec.type = 2;
	var prodApi = $scope.$root.setup+"service/products-listing/get-products-popup";
	 postData = {
		    'token': $scope.$root.token,
		    'all': "1",
	  	};
    $http
      .post(prodApi, postData)
      .then(function (res) {
        	if(res.data.ack == true){
				 $scope.services = res.data.response;
           	}
      });
}

$scope.addItem = function(item,type){
	if(type == 1){
		$scope.product_code = item.item_code;
		$scope.loadDropDownsData(item.id,1);
	}
	if(type == 2)
		$scope.product_code = item.code;

	$scope.product_description = item.description;
	$scope.rec.type = type;
	$scope.rec.product_id = item.id;
	$scope.rec.volume_1_price = $scope.rec.volume_2_price = $scope.rec.volume_3_price = item.standard_price;
	angular.element('#itemServModal').modal('hide');
}

//$scope.isSet = 0;
	$scope.setPrimary = function(val,rec){
		if(val == 1){
			if($scope.rec.volume_1 == undefined || $scope.rec.volume_1.id <= 0){
				toaster.pop('error', 'Error', 'Please select volume.');
				//document.getElementById('one_four_pallet').focus();
				return false;
			}
			else{
				$scope.isPalletSet = 1;
				$scope.isHalfSet = 0;
				$scope.isFullSet = 0;
			}
		}
		if(val == 2){
			if($scope.rec.volume_2 == undefined || $scope.rec.volume_2.id <= 0){
				toaster.pop('error', 'Error', 'Please select volume.');
				//document.getElementById('half_load').focus();
				return false;
			}
			else{
				$scope.isPalletSet = 0;
				$scope.isHalfSet = 1;
				$scope.isFullSet = 0;
			}
		}
		if(val == 3){
			if($scope.rec.volume_3 == undefined || $scope.rec.volume_3.id <= 0){
				toaster.pop('error', 'Error', 'Please select volume.');
				//document.getElementById('full_load').focus();
				return false;
			}
			else{
				$scope.isPalletSet = 0;
				$scope.isHalfSet = 0;
				$scope.isFullSet = 1;
			}
		}
		
		$scope.rec.primary = val;
	}

	var check_primary = function(rec){
		if((rec.one_four_pallet != '' || rec.one_four_pallet > 0 ) || 
			(rec.half_load != '' || rec.half_load > 0) ||
			(rec.full_load != '' || rec.full_load > 0)){

			if(rec.primary === null)
				return false;
			else
				return true;
		}
		else
			return true;

	}
	
	$scope.resetForm = function(rec){
		$scope.rec = {};
		$scope.offer_method_id='';
		$scope.offered_by = '';
		$scope.product_code = '';
		$scope.product_description = '';
		$scope.product_barcode = '';
		$scope.isPalletSet = 0;
		$scope.isHalfSet = 0;
		$scope.isFullSet = 0;
		$scope.arr_volume_1=$scope.arr_volume_2=$scope.arr_volume_3=$scope.arr_unit_of_measure=[];
		/*$http
	      .post(currencyUrl, {'token':$scope.$root.token})
	      .then(function (res) {
	        	if(res.data.ack == true){
					$scope.arr_currency = res.data.response;
					$.each($scope.arr_currency,function(index,elem){
						if(elem.id == $scope.$root.defaultCurrency)
							$scope.currency_id = elem;
					});
					$scope.currency_code = $scope.currency_id.name;
				}
				
	    });*/
		
	}
  $scope.offer_method_id = {};
  $scope.currency_id = {};
  $scope.add = function(rec){
  	var addUrl = $scope.$root.sales+"crm/crm/add-price-offer";
  	/*console.log(rec);
  	return;*/

  	/*if(!check_primary(rec)){
  			toaster.pop('error', 'Error', 'Please select primary!');
  			return false;
  		}

	  $scope.date1=rec.offer_date;
		$scope.date2=rec.offer_valid_date;
		if($scope.date2 < $scope.date1){
			toaster.pop('error', 'Invalid Date', 'Please Select a valid date', '');
			}
			else{*/
	 rec.offer_method_id = $scope.rec.offer_method_ids !=undefined?$scope.rec.offer_method_ids.id:0;				
	 //rec.currency_id = $scope.rec.currency_ids != undefined? $scope.rec.currency_ids.id:0;
	 rec.volume_1 = $scope.rec.volume_1s != undefined? $scope.rec.volume_1s.id:0;
	 rec.volume_2 = $scope.rec.volume_2s != undefined? $scope.rec.volume_2s.id:0;
	 rec.volume_3 = $scope.rec.volume_3s != undefined? $scope.rec.volume_3s.id:0;
	 rec.unit_of_measure_1 = $scope.rec.unit_of_measure_1s != undefined? $scope.rec.unit_of_measure_1s.id:0;
	 rec.unit_of_measure_2 = $scope.rec.unit_of_measure_2s != undefined? $scope.rec.unit_of_measure_2s.id:0;
	 rec.unit_of_measure_3 = $scope.rec.unit_of_measure_3s != undefined? $scope.rec.unit_of_measure_3s.id:0;
	 rec.crm_id = $scope.$root.crm_id;
	 rec.token = $scope.$root.token;
	 if(rec.id != undefined)
	 	 addUrl = $scope.$root.sales+"crm/crm/update-price-offer";
	 	
	 $http
      .post(addUrl, rec)
      .then(function (res) {
		  $scope.$root.count = $scope.$root.count+1;
	      $scope.$root.count = $scope.$root.count+1;

        	if(res.data.ack == true || res.data.edit == true){
        		
				
				
				$scope.$root.lblButton = 'Add New';
				if(rec.id > 0)
				 	toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				else{
				 	toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
				 	 $scope.$root.$broadcast("showPOfferListing");
				 	 $scope.resetForm(rec);
				 }
				 var args = [];
				 args[0] = $scope.$root.crm_id;
				 args[1] = undefined;
				 $scope.$root.$broadcast("myPOfferEventReload", args);
				
				 /*$timeout(function() {
					angular.element('.accordion-toggle').trigger('click');
				  }, 100);*/
				 
			}
			else{
				
				if(rec.id > 0)
				 	toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(104));
				else
				 	toaster.pop('error', 'Add',$scope.$root.getErrorMessageByCode(104));
			}
      });

  }
  $scope.closeTab = function(rec){
			  $scope.$root.tabHide = 1;
			  $scope.resetForm(rec);
		   }
  $scope.togleTab = function(rec){
	  			$scope.resetForm(rec);
	  			$scope.$root.lblButton = 'Add New';
				$scope.$root.tabHide = 0;
				 $timeout(function() {
					angular.element('.accordion-toggle').trigger('click');
				  }, 100);
		   }
	  
  $scope.delete = function(id) {
    ngDialog.openConfirm({
      template: 'modalDeleteDialogId',
      className: 'ngdialog-theme-default-custom'
    }).then(function (value) {
      $http
		  .post('api/company/delete', {id:id,table:'crm_price_offer'})
		  .then(function (res) {
		  $scope.$root.count = $scope.$root.count+1;

				if(res.data == true){
					/*$scope.$root.tabHide = 1;*/
					$timeout(function() {
						 $scope.resetForm($scope.rec);
						angular.element('.accordion-toggle').trigger('click');
					  }, 100);
					toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
					var args = [];
					args[0] = $scope.$root.crm_id;
					args[1] = undefined;
					$scope.$root.$broadcast("myPOfferEventReload", args);
				}	
				else{
					toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
				}
		  });
    }, function (reason) {
      console.log('Modal promise rejected. Reason: ', reason);
    });
 
 };

 $scope.showWordsLimits = function(){
 	$scope.wordsLength = $scope.rec.comment.length;
 } 


 $scope.fnDatePicker = function(){

  		$scope.datePicker = {};

	$scope.datePicker = (function () {

	   var method = {};
	   method.instances = [];
	  	$scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
  		};
        $scope.toggleMin();
	    
	   method.open = function ($event, instance) {
		$event.preventDefault();
		$event.stopPropagation();
	  
		var old_instance = $scope.$root.$storage.getItem('old_instance');
	  	if(old_instance != null)
	  		method.instances[old_instance] = false;

		method.instances[instance] = true;
		$scope.$root.$storage.setItem('old_instance',instance);
	   };
	  
	   method.options = {
		'show-weeks': false,
		startingDay: 0
	   };

	   method.format = $scope.$root.dateFormats[$scope.$root.defaultDateFormat];
	  
	   return method;
	  }());  
	 /******************************************/ 


  	}


$scope.addNewCurrencyPopup = function(){
 	var id = $scope.rec.currency_ids != undefined?$scope.rec.currency_ids.id:0;
 	if(id > 0)
 		return false;

 	$scope.fnDatePicker();
 	$scope.currency = {};
 	 ngDialog.openConfirm({
      template: 'app/views/company/add_new_currency.html',
      className: 'ngdialog-theme-default-custom-large',
	  scope: $scope
    }).then(function (currency) {
    	var addCurrencyUrl = $scope.$root.setup+"general/add-currency";
		 currency.token = $scope.$root.token;
		 currency.company_id = $scope.$root.defaultCompany;
		 currency.status = $scope.currency.c_status !== undefined ? $scope.currency.c_status.value:0;
		
	     $http
	      .post(addCurrencyUrl, currency)
	      .then(function (res) {
	        	if(res.data.ack == true){
					 toaster.pop('success','Info', res.data.msg);
					 var currencyUrl = $scope.$root.setup+"general/currency-list";
					    $http
					      .post(currencyUrl, {'company_id':$scope.$root.defaultCompany,'token':$scope.$root.token})
					      .then(function (res1) {
					        	if(res1.data.ack == true){
					        		//$scope.$root.$apply(function(){
										$scope.arr_currency = res1.data.response;
										$scope.arr_currency.push({'id':'-1','name':'++ Add New ++'});
										$timeout(function(){
											$.each($scope.arr_currency,function(index,elem){
												if(elem.id == res.data.id)
													$scope.rec.currency_ids = elem;
											});
										},3000);
									//});
								}

					    });
				}
				else if(res.data.ack == false){
					 toaster.pop('warning', 'Info', res.data.msg);
				}
				else
					toaster.pop('warning', 'Info', res.data.msg);
				
	      });

		}, function (reason) {
      console.log('Modal promise rejected. Reason: ', reason);
    });
}

$scope.addNewPredefinedPopup = function(drpdown,type,title,drp){
		
 	var id = drpdown.id;
 	if(id > 0)
 		return false;

 	$scope.popup_title = title;
 	$scope.pedefined = {};

 	 ngDialog.openConfirm({
      template: 'app/views/crm/add_predefined.html',
      className: 'ngdialog-theme-default-custom-large',
	  scope: $scope
    }).then(function (pedefined) {
    	/*console.log(pedefined);
    	return false;*/

     pedefined.token = $scope.$root.token;
	 pedefined.type = type;
	 	var postUrl = $scope.$root.setup+"ledger-group/add-predefine";
	 $http
      .post(postUrl, pedefined)
           .then(function (ress) {
	        	if(ress.data.ack == true){
							toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					 var constUrl = $scope.$root.setup+"ledger-group/get-predefine-by-type";
				     $http
				      .post(constUrl, {'token':$scope.$root.token, type:type})
				      .then(function (res) {
				        	if(res.data.ack == true){

				        		if(type == 'OFFER_METHOD'){
									$scope.arr_OfferMethod = res.data.response;
									$scope.arr_OfferMethod.push({'id':'-1','name':'++ Add New ++'});
									//$timeout(function(){
										$.each($scope.arr_OfferMethod,function(index,elem){
											if(elem.id == ress.data.id)
												$scope.rec.offer_method_ids = elem;
										});
									//},3000);
								}

							}
								
				      });
				  }
				  else{
				  	$scope.rec.offer_method_ids = '';
						toaster.pop('error','Info',ress.data.error)
					}
				
	      });

		}, function (reason) {
			$scope.rec.offer_method_ids = '';
      console.log('Modal promise rejected. Reason: ', reason);
    });
}

$scope.addNewVolumePopup = function(drpdown,type,title){
		
 	var id = drpdown.id;
 	if(id > 0)
 		return false;

 	$scope.popup_title = title;
 	$scope.pedefined = {};

 	 ngDialog.openConfirm({
      template: 'app/views/p_offer/add_new_volume.html',
      className: 'ngdialog-theme-default-custom-large',
	  scope: $scope
    }).then(function (pedefined) {
    	/*console.log(pedefined);
    	return false;*/

     pedefined.token = $scope.$root.token;
	 pedefined.type = type;
	 if($scope.rec.type == 1)
	 	var postUrl = $scope.$root.sales+"crm/crm/add-price-offer-volume";
	 if($scope.rec.type == 2)
	 	var postUrl = $scope.$root.setup+"service/products-listing/add-service-price-offer-volumes";
	 $http
      .post(postUrl, pedefined)
           .then(function (ress) {
	        	if(ress.data.ack == true){
							toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					 if($scope.rec.type == 1)
						 var constUrl = $scope.$root.sales+"crm/crm/get-price-offer-volume-by-type";
					 if($scope.rec.type == 2)
					 	 var constUrl = $scope.$root.setup+"service/products-listing/get-price-offer-volume-by-type";
				     $http
				      .post(constUrl, {'token':$scope.$root.token, type:type})
				      .then(function (res) {
				        	if(res.data.ack == true){

				        		if(type == 'Volume 1'){
									$scope.arr_volume_1 = res.data.response;
									$scope.arr_volume_1.push({'id':'-1','name':'++ Add New ++'});
									$timeout(function(){
										$.each($scope.arr_volume_1,function(index,elem){
											if(elem.id == ress.data.id)
												$scope.rec.volume_1s = elem;
										});
									},3000);
								}
								if(type == 'Volume 2'){
									$scope.arr_volume_2 = res.data.response;
									$scope.arr_volume_2.push({'id':'-1','name':'++ Add New ++'});
									$timeout(function(){
										$.each($scope.arr_volume_2,function(index,elem){
											if(elem.id == ress.data.id)
												$scope.rec.volume_2s = elem;
										});
									},3000);
								}
								if(type == 'Volume 3'){
									$scope.arr_volume_3 = res.data.response;
									$scope.arr_volume_3.push({'id':'-1','name':'++ Add New ++'});
									$timeout(function(){
										$.each($scope.arr_volume_3,function(index,elem){
											if(elem.id == ress.data.id)
												$scope.rec.volume_3s = elem;
										});
									},3000);
								}

							}
								
				      });
				  }
				
	      });

		}, function (reason) {
      console.log('Modal promise rejected. Reason: ', reason);
    });
}

$scope.addNewUnitPopup = function(drpdown,type,title){
		
 	var id = drpdown.id;
 	if(id > 0)
 		return false;
 	var indx = $scope.arr_unit_of_measure.indexOf('-1');
 	$scope.arr_unit_of_measure.splice(indx,1);
 	$scope.popup_title = title;
 	$scope.pedefined = {};

 	 ngDialog.openConfirm({
      template: 'app/views/p_offer/add_new_unit.html',
      className: 'ngdialog-theme-default-custom-large',
	  scope: $scope
    }).then(function (pedefined) {
    	/*console.log(pedefined);
    	return false;*/

     pedefined.token = $scope.$root.token;
	 pedefined.parent_id = pedefined.parent_ids != undefined? pedefined.parent_ids.id:0;
	 if($scope.rec.type == 1)
	 	var postUrl = $scope.$root.sales+"stock/unit-measure/add-unit";
	 if($scope.rec.type == 2)
	 	var postUrl = $scope.$root.setup+"service/unit-measure/add-unit";
	 $http
      .post(postUrl, pedefined)
           .then(function (ress) {
	        	if(ress.data.ack == true){
							toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					 if($scope.rec.type == 1)
					 	var constUrl = $scope.$root.sales+"stock/unit-measure/get-all-unit";
					 if($scope.rec.type == 2)
					 	var constUrl = $scope.$root.setup+"service/unit-measure/get-all-unit";

				     $http
				      .post(constUrl, {'token':$scope.$root.token})
				      .then(function (res) {
				        	if(res.data.ack == true){
				        		$scope.arr_unit_of_measure = res.data.response;
								$scope.arr_unit_of_measure.push({'id':'-1','title':'++ Add New ++'});
									$timeout(function(){
										$.each($scope.arr_unit_of_measure,function(index,elem){
											if(elem.id == ress.data.id){
												if(type == 'Volume 1')
													$scope.rec.unit_of_measure_1s = elem;
												if(type == 'Volume 2')
													$scope.rec.unit_of_measure_2s = elem;
												if(type == 'Volume 3')
													$scope.rec.unit_of_measure_3s = elem;

											}
										});
									},3000);

							}
								
				      });
				  }
				
	      });

		}, function (reason) {
      console.log('Modal promise rejected. Reason: ', reason);
    });
}
  var unitUrl_item = $scope.$root.sales + "stock/unit-measure/get-unit-setup-list-category";
var volumeUrl_item = $scope.$root.sales + "stock/unit-measure/get-sale-offer-volume-by-type";
   var addvolumeUrl_item = $scope.$root.sales + "stock/unit-measure/add-sale-offer-volume";

  $scope.valume = 0; 
$scope.onChange_vol_1 = function (arg_id,arg_name) { 
	 $scope.formData_vol_1= {}; 
	 $scope.valume = arg_id;
		 
		 $scope.get_category_list();
		 var id='';var volume='';
		 
      if(arg_id==1) 
	  {  id = this.rec.volume_1s.id;    
	  	volume = 'Volume 1'; category=1;
	   $scope.title_type='Add Price Offer Volume 1 ';
	   }
	  else if(arg_id==2)  {
		   id = this.rec.volume_2s.id; 
		    	volume = 'Volume 2'; 	category=1; 
				 $scope.title_type='Add Price Offer Volume 2 ';
				 }
	  else  if(arg_id==3) { 
	   id = this.rec.volume_3s.id;
	    volume = 'Volume 3';category=1; 
		 $scope.title_type='Add Price Offer Volume 3 ';
	  }
	  
	    
      
	   if(arg_name=='sale')  {  
	    if (id == -1) $('#model_vol_1').modal({show: true});
	   }
	   
	    if(arg_name=='purchase'){  
	    if (id == -1) $('#model_vol_purchase_1').modal({show: true});
	   }
       
	   $scope.formData_vol_1.type =  volume;
	   $scope.formData_vol_1.category =  category;
		
    }

    $scope.add_vol1_type = function (formData_vol_1) {
		
		$scope.formData_vol_1.token = $scope.$root.token;
		//$scope.formData_vol_1.type = 'Volume 1';
		//$scope.formData_vol_1.category = 1;
		$scope.formData_vol_1.item_id = $scope.rec.product_id ;

		$scope.formData_vol_1.unit_categorys = $scope.formData_vol_1.unit_category !== undefined ? $scope.formData_vol_1.unit_category.id : 0;
		//  console.log(  formData_vol_1);return;
		// console.log(  $scope.rec.product_id);return;

			 $http
		        .post(addvolumeUrl_item, formData_vol_1)
		        .then(function (res) {
		            if (res.data.ack == true) {
									toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
		                //  $scope.show_vol_1_pop = false; 
		                $('#model_vol_1').modal('hide');
						 $('#model_vol_purchase_1').modal('hide');
						 
						  $scope.get_new_item_voume_list($scope.formData_vol_1.category,$scope.rec.product_id,$scope.valume,res.data.id);
						  
		            } 
					else  toaster.pop('error', 'info', 'already Exists');
		        });
    }

    $scope.get_item_voume_list = function (arg,item_id) {
	//console.log(item_id);
	
        $http
	       	.post(volumeUrl_item, {type: 'Volume 1',category: arg,'item_id':item_id , 'token': $scope.$root.token})
	        .then(function (vol_data) {
                   
		   if(arg==1)
			{   
				$scope.arr_volume_1 = []; 
				$scope.arr_volume_1.push({'id':'0','name':''});
			      	$.each(vol_data.data.response,function(index,obj){
						$scope.arr_volume_1.push(obj);
					});
                
				if($scope.arr_volume_1.length ==0)
					 { $scope.arr_volume_1.push({'id': '-1', 'name': '++ Add New ++'});}
				  
				 else if($scope.arr_volume_1.length >0)
				  if ($scope.user_type == 1)   
				  		$scope.arr_volume_1.push({'id': '-1', 'name': '++ Add New ++'});
			}
       });

        $http
              	.post(volumeUrl_item, {type: 'Volume 2',category: arg,'item_id':item_id , 'token': $scope.$root.token})
                .then(function (vol_data) {
                    
				if(arg==1)
				{
					$scope.arr_volume_2 = []; 
					$scope.arr_volume_2.push({'id':'0','name':''});
				      	$.each(vol_data.data.response,function(index,obj){
							$scope.arr_volume_2.push(obj);
						});
            
			 
			 if($scope.arr_volume_2.length ==0)
					 { $scope.arr_volume_2.push({'id': '-1', 'name': '++ Add New ++'});}
				  
				 else if($scope.arr_volume_2.length >0)
				  if ($scope.user_type == 1)   $scope.arr_volume_2.push({'id': '-1', 'name': '++ Add New ++'});
				
				
				
				}
				
            });

        $http
                	.post(volumeUrl_item, {type: 'Volume 3',category: arg,'item_id':item_id , 'token': $scope.$root.token})
                .then(function (vol_data) {
                  
				if(arg==1)
				{
					$scope.arr_volume_3 = []; 
				$scope.arr_volume_3.push({'id':'0','name':''});
			      	$.each(vol_data.data.response,function(index,obj){
						$scope.arr_volume_3.push(obj);
					});
             
			  if($scope.arr_volume_3.length ==0)
					 { $scope.arr_volume_3.push({'id': '-1', 'name': '++ Add New ++'});}
				  
				 else if($scope.arr_volume_3.length >0)
				  if ($scope.user_type == 1)   $scope.arr_volume_3.push({'id': '-1', 'name': '++ Add New ++'});
				
				
				
				}
				             
                });

        $http
				 .post(unitUrl_item, {'token': $scope.$root.token,'item_id':item_id })
                .then(function (unit_data) {
                    $scope.arr_unit_of_measure.push({'id':'0','name':''});
				      	$.each(unit_data.data.response,function(index,obj){
							$scope.arr_unit_of_measure.push(obj);
						});
                   // $scope.arr_unit_of_measure.push({'id': '-1', 'name': '++ Add New ++'});
                });
    }

    $scope.get_new_item_voume_list = function (arg,item_id,vlume,id) {
	//console.log(item_id);
		if(vlume == 1){
	        $http
		       	.post(volumeUrl_item, {type: 'Volume 1',category: arg,'item_id':item_id , 'token': $scope.$root.token})
		        .then(function (vol_data) {
		        	if(vol_data.data.ack == 1){
						   $scope.arr_volume_1 = []; 
							$scope.arr_volume_1.push({'id':'0','name':''});
						      	$.each(vol_data.data.response,function(index,obj){
									$scope.arr_volume_1.push(obj);
								});
						   $.each(vol_data.data.response,function(index,obj){
						   		if(obj.id == id)
						   			$scope.rec.volume_1s = obj;
						   });
							if($scope.arr_volume_1.length ==0)
								 $scope.arr_volume_1.push({'id': '-1', 'name': '++ Add New ++'});
						 else if($scope.arr_volume_1.length >0){
						  if ($scope.user_type == 1)   
						  		$scope.arr_volume_1.push({'id': '-1', 'name': '++ Add New ++'});
					  	}
				}
	       });
		}
		

		if(vlume == 2){
        	$http
              	.post(volumeUrl_item, {type: 'Volume 2',category: arg,'item_id':item_id , 'token': $scope.$root.token})
                .then(function (vol_data) {
                	if(vol_data.data.ack == 1){
	                	$scope.arr_volume_2 = []; 
						$scope.arr_volume_2.push({'id':'0','name':''});
					      	$.each(vol_data.data.response,function(index,obj){
								$scope.arr_volume_2.push(obj);
							});
                		 $.each(vol_data.data.response,function(index,obj){
					   		if(obj.id == id)
					   			$scope.rec.volume_2s = obj;
					   });
						 if($scope.arr_volume_2.length ==0)
						 		$scope.arr_volume_2.push({'id': '-1', 'name': '++ Add New ++'});
						 else if($scope.arr_volume_2.length >0){
							  if ($scope.user_type == 1)   
							  		$scope.arr_volume_2.push({'id': '-1', 'name': '++ Add New ++'});
							}
						}
				
            });
        }

        if(vlume == 3){
        	$http
                .post(volumeUrl_item, {type: 'Volume 3',category: arg,'item_id':item_id , 'token': $scope.$root.token})
                .then(function (vol_data) {
                	if(vol_data.data.ack == 1){
                		$scope.arr_volume_3 = []; 
						$scope.arr_volume_3.push({'id':'0','name':''});
					      	$.each(vol_data.data.response,function(index,obj){
								$scope.arr_volume_3.push(obj);
							});
		                 $.each(vol_data.data.response,function(index,obj){
						   		if(obj.id == id)
						   			$scope.rec.volume_3s = obj;
						   });
						  if($scope.arr_volume_3.length ==0)
								 $scope.arr_volume_3.push({'id': '-1', 'name': '++ Add New ++'});
						 else if($scope.arr_volume_3.length >0){
						  if ($scope.user_type == 1)   
						  			$scope.arr_volume_3.push({'id': '-1', 'name': '++ Add New ++'});
						  	}
						}
				             
                });
          }
    }

    $scope.list_unit_category= [];

    $scope.get_category_list =function () {
        	var get_unit_setup_category = $scope.$root.sales + "stock/unit-measure/get-unit-setup-list-category";
           $scope.list_unit_category= [];
            $http
                    .post(get_unit_setup_category, {'token': $scope.$root.token,'item_id':$scope.rec.product_id })
                    .then(function (vol_data) {
                        $scope.list_unit_category = vol_data.data.response;
                    });
        			
    }




 
}



