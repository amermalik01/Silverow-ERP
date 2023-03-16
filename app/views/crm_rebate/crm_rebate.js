CrmRebateController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster"];

myApp.controller('CrmRebateController', CrmRebateController);
myApp.controller('CrmRebateAddController', CrmRebateAddController);


function CrmRebateController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster, $stateParams) {
    'use strict';
	
	$scope.module_id = 74;
	$scope.filter_id = 119;
	$scope.module_table = 'crm_price_offer';
	$scope.more_fields = 'null';
	$scope.condition = 0;
	$scope.sendRequest = false;

	if($scope.$root.crm_id > 0)
		$scope.postData = {'column':'crm_id','value':$scope.$root.crm_id,token:$scope.$root.token}

	$scope.MainDefer = null;
	$scope.mainParams = null;
	$scope.mainFilter = null;
	$scope.more_fields = 'crm_id';	
	
		
	$scope.count = 1;
    var vm = this;
	

   var ApiAjax = $scope.$root.sales+"crm/crm/crm-rebate-listings";
    
	$scope.$on("myCrmRebateEventReload", function (event, args) {
		$scope.sendRequest = true;
		if(args != undefined){
			if(args[1] != undefined)
				$scope.detail(args[1]);
			$scope.postData = {'column':'crm_id','value':args[0],token:$scope.$root.token}
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
		$scope.$root.$broadcast("openCrmRebateFormEvent", {'edit':false,id:id});
	}

	$scope.editForm = function(id){
		$scope.$root.$broadcast("openCrmRebateFormEvent", {'edit':true,id:id});
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
    	var delUrl = $scope.$root.sales+"crm/crm/delete-crm-rebate";
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

}

function CrmRebateAddController($scope, $stateParams, $http, $state,$resource,toaster, $timeout, ngDialog,$rootScope,$filter){
	$scope.$root.tabHide = 0;
	$scope.$root.lblButton = 'Add New';
	$scope.check_readonly = 0;
	$scope.rec = {};
	$scope.wordsLength = 0;
	$scope.isCat = false;
	$scope.isItem = false;
	$scope.rec.type = 1;
	$scope.arr_rebate_types = [{'id':1,'name':'Universal Rebate for the Customer'},{'id':2,'name':'Separate Rebate for Category(ies)'},{'id':3,'name':'Separate Rebate for Item(s) / Service(s)'}];	
	$scope.arr_rebate_universal = [{'id':0,'name':''},{'id':1,'name':'Universal Rebate'},{'id':2,'name':'Volume Based Rebate'},{'id':3,'name':'Revenue Based Rebate'}];	

	$scope.arr_rebt_volume_1 = [];
	$scope.arr_rebt_volume_2 = [];
	$scope.arr_rebt_volume_3 = [];
	$scope.arr_revenue_1 = [];
	$scope.arr_revenue_2 = [];
	$scope.arr_revenue_3 = [];
	$scope.selectedItems = [];
	$scope.selectedCats = [];
	$scope.showLoader = false;

	

	 $scope.showCrmRebateListing = function(){
	 	$scope.rec = {};
	  	$scope.$root.$broadcast("showCrmRebateListing");
	  }

	  $scope.showCrmRebateEditForm = function(){
	  	$scope.check_readonly = false;
	  }

	 $scope.setType = function(val){
	 	if(val == 1){
	 		$scope.isItem = false;
	 		$scope.isCat = false;
	 	}
	 	if(val == 2){
	 		$scope.isItem = false;
	 		$scope.isCat = true;
	 	}
	 	if(val == 3){
	 		$scope.isItem = true;
	 		$scope.isCat = false;
	 	}

 		$scope.rec.type = val;

  	}

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

	$scope.$on("showAddCrmRebateForm", function () {
		$scope.check_readonly = false;
		$scope.selectServ = true;
		$scope.selectItm = true;
		$scope.selectServCat = true;
	    $scope.selectItmCat = true;
		$scope.resetForm();
		$scope.rec.universal_types = $scope.arr_rebate_universal[0];
		$scope.rec.types = $scope.arr_rebate_types[0];
			$scope.selectedItems = [];
			$scope.selectedCats = [];
			//$scope.loadFormData();
  		$scope.rebate_date = $filter('date')($scope.offered_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
  		
	});

	/*$timeout(function(){
  			$scope.rec.offer_date = $filter('date')($scope.offered_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
  		},10000);*/

$scope.loadFormData=function(item_id,type,universal_type){

	console.log(item_id+'---'+type+'---'+universal_type);
	$scope.arr_rebt_volume_1 = [];
	$scope.arr_rebt_volume_2 = [];
	$scope.arr_rebt_volume_2 = [];

	if(universal_type == 2){
		if(type == 1)
			var volumeUrl = $scope.$root.sales + "stock/unit-measure/get-sale-offer-volume-by-type";
		if(type == 2)
			var volumeUrl = $scope.$root.setup+"service/products-listing/price-offer-volumes";

		$http
	      .post(volumeUrl, {type:'Volume 1',category: 1,'item_id':item_id ,'token':$scope.$root.token})
	      .then(function (vol_data) {
	      	$scope.arr_rebt_volume_1 = []; 
			$scope.arr_rebt_volume_1.push({'id':'0','name':''});
	      	$.each(vol_data.data.response,function(index,obj){
				$scope.arr_rebt_volume_1.push(obj);
			});
			$scope.arr_rebt_volume_1.push({'id':'-1','name':'++ Add New ++'});
			$scope.rec.offer_date = $filter('date')($scope.offered_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
		});

		$http
	      .post(volumeUrl, {type:'Volume 2',category: 1,'item_id':item_id ,'token':$scope.$root.token})
	      .then(function (vol_data) {
			$scope.arr_rebt_volume_2 = []; 
			$scope.arr_rebt_volume_2.push({'id':'0','name':''});
	      	$.each(vol_data.data.response,function(index,obj){
				$scope.arr_rebt_volume_2.push(obj);
			});
			$scope.arr_rebt_volume_2.push({'id':'-1','name':'++ Add New ++'});
		});

		$http
	      .post(volumeUrl, {type:'Volume 3',category: 1,'item_id':item_id ,'token':$scope.$root.token})
	      .then(function (vol_data) {
			$scope.arr_rebt_volume_3 = []; 
			$scope.arr_rebt_volume_3.push({'id':'0','name':''});
	      	$.each(vol_data.data.response,function(index,obj){
				$scope.arr_rebt_volume_3.push(obj);
			});
			$scope.arr_rebt_volume_3.push({'id':'-1','name':'++ Add New ++'});
		});
	  }
	  else{
	// if($scope.rec.universal_types != undefined && $scope.rec.universal_types.id == 3){
	 	/*if(type == 1)
	 		var volumeUrl = $scope.$root.pr + "srm/srm/get-sale-offer-rev-by-type";
	 	if(type == 2)*/
	 	$scope.arr_revenue_1 = [];
  		$scope.arr_revenue_2 = [];
  		$scope.arr_revenue_3 = [];

		var constUrl = $scope.$root.setup+"ledger-group/get-predefine-by-type";
		$http
	      .post(constUrl, {'token':$scope.$root.token, type:'TURNOVER'})
	      .then(function (res) {
	      		$scope.arr_revenue_1.push({'id':'0','name':''});
	      		$scope.arr_revenue_2.push({'id':'0','name':''});
	      		$scope.arr_revenue_3.push({'id':'0','name':''});
	        	if(res.data.ack == true){
			      	$.each(res.data.response,function(index,obj){
						$scope.arr_revenue_1.push(obj);
						$scope.arr_revenue_2.push(obj);
						$scope.arr_revenue_3.push(obj);
					});
				}
				$scope.arr_revenue_1.push({'id':'-1','name':'++ Add New ++'});
				$scope.arr_revenue_2.push({'id':'-1','name':'++ Add New ++'});
				$scope.arr_revenue_3.push({'id':'-1','name':'++ Add New ++'});
	      });
	 	/*$http
	      .post(constUrl, {'token':$scope.$root.token, type:'TURNOVER'})
	      .then(function (res) {
	      		$scope.arr_revenue_1.push({'id':'0','name':''});
	        	if(res.data.ack == true){
			      	$.each(res.data.response,function(index,obj){
						$scope.arr_revenue_1.push(obj);
					});
				}
				$scope.arr_revenue_1.push({'id':'-1','name':'++ Add New ++'});
	      });
	    $http
	      .post(constUrl, {'token':$scope.$root.token, type:'TURNOVER'})
	      .then(function (res) {
	      	$scope.arr_revenue_2.push({'id':'0','name':''});
	        	if(res.data.ack == true){
			      	$.each(res.data.response,function(index,obj){
						$scope.arr_revenue_2.push(obj);
					});
				}
				$scope.arr_revenue_2.push({'id':'-1','name':'++ Add New ++'});
	      });
	    $http
	      .post(constUrl, {'token':$scope.$root.token, type:'TURNOVER'})
	      .then(function (res) {
	      		$scope.arr_revenue_3.push({'id':'0','name':''});
	        	if(res.data.ack == true){
			      	$.each(res.data.response,function(index,obj){
						$scope.arr_revenue_3.push(obj);
					});
				}
				$scope.arr_revenue_3.push({'id':'-1','name':'++ Add New ++'});
	      });*/
	  }
}

$scope.loadVolFormData=function(item_id,type,id,vol_type){

	console.log(item_id+'---'+type+'---'+vol_type);
		if(type == 1)
			var volumeUrl = $scope.$root.pr + "srm/srm/get-sale-offer-volume-by-type";
		if(type == 2)
			var volumeUrl = $scope.$root.setup+"service/products-listing/price-offer-volumes";

		if(vol_type == 1){
			$http
		      .post(volumeUrl, {type:'Volume 1',srm_id:$scope.$root.crm_id,category: 2,'item_id':item_id ,'token':$scope.$root.token})
		      .then(function (vol_data) {
		      	$scope.arr_rebt_volume_1 = []; 
				$scope.arr_rebt_volume_1.push({'id':'0','name':''});
		      	$.each(vol_data.data.response,function(index,obj){
					$scope.arr_rebt_volume_1.push(obj);
				});

				if(id != undefined){
					$.each(vol_data.data.response,function(index,obj){
				   		if(obj.id == id)
				   			$scope.rec.volume_1s = obj;
				   });
				}
				$scope.arr_rebt_volume_1.push({'id':'-1','name':'++ Add New ++'});
				
				$scope.rec.offer_date = $filter('date')($scope.offered_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
			});
		}

		if(vol_type == 2){
			$http
		      .post(volumeUrl, {type:'Volume 2',srm_id:$scope.$root.crm_id,category: 2,'item_id':item_id ,'token':$scope.$root.token})
		      .then(function (vol_data) {
				$scope.arr_rebt_volume_2 = []; 
				$scope.arr_rebt_volume_2.push({'id':'0','name':''});
		      	$.each(vol_data.data.response,function(index,obj){
					$scope.arr_rebt_volume_2.push(obj);
				});
				if(id != undefined){
					$.each(vol_data.data.response,function(index,obj){
				   		if(obj.id == id)
				   			$scope.rec.volume_2s = obj;
				   });
				}
				$scope.arr_rebt_volume_2.push({'id':'-1','name':'++ Add New ++'});
			});
		}

		if(vol_type == 3){
			$http
		      .post(volumeUrl, {type:'Volume 3',srm_id:$scope.$root.crm_id,category: 2,'item_id':item_id ,'token':$scope.$root.token})
		      .then(function (vol_data) {
				$scope.arr_rebt_volume_3 = []; 
				$scope.arr_rebt_volume_3.push({'id':'0','name':''});
		      	$.each(vol_data.data.response,function(index,obj){
					$scope.arr_rebt_volume_3.push(obj);
				});
				if(id != undefined){
					$.each(vol_data.data.response,function(index,obj){
				   		if(obj.id == id)
				   			$scope.rec.volume_3s = obj;
				   });
				}
				$scope.arr_rebt_volume_3.push({'id':'-1','name':'++ Add New ++'});
			});
		  }
	  }
	 



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
	

	

	$scope.$on("openCrmRebateFormEvent", function (event, arg) {
		//$scope.loadFormData();
		//$timeout(function() {
			$scope.showLoader = true;
			    $scope.items = [];
				$scope.selectedItems = [];
				$scope.categories = [];
				$scope.selectedCats = [];

			var id = arg.id;
	   		if(arg.edit == false)
	   			$scope.check_readonly = true;
	   		else
	   			$scope.check_readonly = false;
			angular.element('.accordion-toggle').trigger('click');
			$scope.$root.$broadcast("showCrmRebateForm");
			 /*$scope.CrmRebateFormShow = false;
     		 $scope.CrmRebateListingShow = true;*/
			var CrmRebateUrl = $scope.$root.sales+"crm/crm/get-crm-rebate";
			
			
			var table = 'crm_price_offer';
			 $http
		      .post(CrmRebateUrl, {id:id,'token':$scope.$root.token})
		      .then(function (res) {
				$scope.rec = res.data.response;
				$scope.rec.id = res.data.response.id;
				$scope.rec.universal_types = res.data.response.universal_type;
				$scope.rec.type = res.data.response.type;
				if($scope.rec.universal_type == 3)
						$scope.loadFormData();
				
		  		$scope.rebate_date = $filter('date')(res.data.response.created_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
		
				if($scope.rec.type == 3 || $scope.rec.universal_type == 2 || $scope.rec.universal_type == 3){
					
					if($scope.rec.item_type == 1){
						$scope.selectServ = false;
						$scope.selectItm = true;
						var prodApi = $scope.$root.sales + "stock/products-listing/get-products-setup-list";
						 postData = {'token': $scope.$root.token, 'all': "1",};
					    $http
					      .post(prodApi, postData)
					      .then(function (res) {
									$.each(res.data.response,function(index,obj){
										obj.chk = false;
										$scope.items[index] = obj;
									});
					      });
					}

					if($scope.rec.item_type == 2){
						$scope.selectServ = true;
						$scope.selectItm = false;
						var prodApi = $scope.$root.setup+"service/products-listing/get-products-popup";
						 postData = {
							    'token': $scope.$root.token,
							    'all': "1",
						  	};
					    $http
					      .post(prodApi, postData)
					      .then(function (res) {
					        	if(res.data.ack == true){
									$.each(res.data.response,function(index,obj){
										obj.chk = false;
										$scope.items[index] = obj;
									});
								}
					      });
					}

					 $timeout(function(){
					      var prodRebItems = $scope.$root.sales+"crm/crm/get-rebate-items";
					      $http
					      .post(prodRebItems, {'rebate_id':$scope.rec.id,'token': $scope.$root.token})
					      .then(function (res) {
									$.each($scope.items,function(index,obj){
											$.each(res.data.response,function(index1,obj1){
												if(obj1.item_id == obj.id){
													obj.chk = true;
													$scope.selectedItems.push(obj);
													if($scope.rec.universal_type == 2)
														$scope.loadFormData(obj.id,$scope.rec.type,$scope.rec.universal_type);
												}
											});
									});

					      });
				     },2000);
			   }
			   if($scope.rec.type == 2){
			   	 if($scope.rec.category_type == 1){
			   	 	$scope.selectServCat = false;
					$scope.selectItmCat = true;
			   		var catUrl = $scope.$root.sales+"stock/categories";
					$http
					  .post(catUrl, {all:'1','token': $scope.$root.token})
					  .then(function (res) {
							$.each(res.data.response,function(index,obj){
								obj.chk = false;
								$scope.categories[index] = obj;
							});
				  		});
				  }

				  if($scope.rec.category_type == 2){
				  		$scope.selectServCat = true;
						$scope.selectItmCat = false;
				  		var catApi = $scope.$root.setup+"service/categories/get-all-categories";
						 postData = {
							    'token': $scope.$root.token,
							    'all': "1",
						  	};
					    $http
					      .post(catApi, postData)
					      .then(function (res) {
					        	$.each(res.data.response,function(index,obj){
									obj.chk = false;
									$scope.categories[index] = obj;
								});
								
					      });
				  }
				  $timeout(function(){
					  var prodRebCats = $scope.$root.sales+"crm/crm/get-rebate-categories";
				      $http
				      .post(prodRebCats, {'rebate_id':$scope.rec.id,'token': $scope.$root.token})
				      .then(function (res) {
								$.each($scope.categories,function(index,obj){
										$.each(res.data.response,function(index1,obj1){
											if(obj1.category_id == obj.id){
												obj.chk = true;
												$scope.selectedCats.push(obj);
											}
										});
								});

				      });
				  },2000);
			   }

			   $timeout(function(){
			   		$scope.$root.$apply(function(){
			   			$scope.selectedItems;
			   			$scope.selectedCats;
			   		

					   	$.each($scope.arr_rebt_volume_1, function(index,elem){
							if(elem.id == res.data.response.volume_1)
									$scope.rec.volume_1s = elem;
						});
						$.each($scope.arr_rebt_volume_2, function(index,elem){
							if(elem.id == res.data.response.volume_2)
									$scope.rec.volume_2s = elem;
						});
						$.each($scope.arr_rebt_volume_3, function(index,elem){
							if(elem.id == res.data.response.volume_3)
									$scope.rec.volume_3s = elem;
						});

						$.each($scope.arr_revenue_1, function(index,elem){
							if(elem.id == res.data.response.revenue_1)
									$scope.rec.revenue_1s = elem;
						});

						$.each($scope.arr_revenue_2, function(index,elem){
							if(elem.id == res.data.response.revenue_2)
									$scope.rec.revenue_2s = elem;
						});
						$.each($scope.arr_revenue_3, function(index,elem){
							if(elem.id == res.data.response.revenue_3)
									$scope.rec.revenue_3s = elem;
						});

						$.each($scope.arr_rebate_types, function(index,elem){
							if(elem.id == res.data.response.type)
									$scope.rec.types = elem;
						});

						$.each($scope.arr_rebate_universal, function(index,elem){
							if(elem.id == res.data.response.universal_type)
									$scope.rec.universal_types = elem;
						});
					});
				},4000);
			});
		  //}, 1000);
	
		   $scope.showLoader = false;
		 
    });
	
	
	

	$scope.getCurrencyCode = function(){
		$scope.currency_code = this.rec.currency_ids.name;
	}

$scope.columns = [];
$scope.getOffer = function(arg){
	$scope.title = 'Offered By';
	var empUrl = $scope.$root.sales+"get-alt-contacts-list";
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

$scope.items = [];
$scope.getItems= function(){
//$scope.items = [];
if($scope.rec.id == undefined){
		$scope.selectedItems = [];
		$scope.items = [];
}
$timeout(function(){
	if($scope.rec.id != undefined){
		if($scope.rec.item_type == 1)
			angular.element("#rebatItemTab a").click();
		if($scope.rec.item_type == 2)
			angular.element("#rebatServiceTab a").click();
	}
	else{
		angular.element("#rebatItemTab a").click();
	}
},2000);

	angular.element('#itemServRebatModal').modal({show: true});

	$scope.loadFormData();
}

$scope.getItemsList= function(){

	if($scope.rec.id == undefined){
		$scope.selectedItems = [];
		$scope.items = [];
		$scope.rec.item_type = 1;
	

		var prodApi = $scope.$root.sales + "stock/products-listing/get-products-setup-list";
		 postData = {
			    'token': $scope.$root.token,
			    'all': "1",
		  	};
	    $http
	      .post(prodApi, postData)
	      .then(function (res) {
	        	if(res.data.ack == true){
					$.each(res.data.response,function(index,obj){
						obj.chk = false;
						$scope.items[index] = obj;
					});

	                    
				}
	      });
	}
}

$scope.getServices= function(){
	$scope.title = 'Items';
	if($scope.rec.id == undefined){
		$scope.selectedItems = [];
		$scope.items = [];
		$scope.rec.item_type = 2;
	
	var prodApi = $scope.$root.setup + "service/products-listing/get-products-popup";
	 postData = {
		    'token': $scope.$root.token,
		    'all': "1",
	  	};
    $http
      .post(prodApi, postData)
      .then(function (res) {
        	if(res.data.ack == true){
				$.each(res.data.response,function(index,obj){
					obj.chk = false;
					$scope.items[index] = obj;
				});
			}
      });
    }
}




angular.element(document).on('click','.checkAll',function(){
	$scope.selectedItems = [];
	if(angular.element('.checkAll').is(':checked') == true){
		for(var i = 0; i < $scope.items.length; i++){
		 $scope.items[i].chk = true;
		 $scope.selectedItems.push($scope.items[i]);
		}
	}
	else{
		for(var i = 0; i < $scope.items.length; i++){
		 $scope.items[i].chk = false;
		}
		$scope.selectedItems = [];
	}
	$scope.$root.$apply(function(){
		$scope.selectedItems;
	})

});


$scope.selectItem = function(itm,type){
		for(var i=0; i < $scope.items.length; i++){
			console.log(itm.id +'=='+ $scope.items[i].id);
			if(itm.id == $scope.items[i].id){
				if($scope.items[i].chk == true){
					$scope.items[i].chk = false;
					var indx = $scope.selectedItems.indexOf($scope.items[i]);
					$scope.selectedItems.splice(indx,1);
				}
				else{
					if($scope.rec.universal_types.id == 2){
						$scope.items[i].chk = true;
						$scope.items[i].type = type;
						$scope.selectedItems.push($scope.items[i]);	
					}
					else{
						$scope.items[i].chk = true;
						$scope.items[i].type = type;
						$scope.selectedItems.push($scope.items[i]);
					}
					
				}
			}
		}
		if($scope.rec.universal_types.id == 2){
			$scope.loadFormData(itm.id,type,$scope.rec.universal_types.id);
			angular.element('#itemServRebatModal').modal('hide');
		}
}


$scope.categories = [];
$scope.getCategories= function(){
	if($scope.rec.id == undefined){
		$scope.selectedCats = [];
		$scope.categories = [];
	}
	$timeout(function(){
	if($scope.rec.id != undefined){
		if($scope.rec.category_type == 1)
			angular.element("#rebatItemCatTab a").click();
		if($scope.rec.category_type == 2)
			angular.element("#rebatServiceCatTab a").click();
	}
	else{
		angular.element("#rebatItemCatTab a").click();
	}
},2000);

    angular.element('#itemServCatRebatModal').modal({show: true});
}

$scope.getCategoriesList= function(){
	if($scope.rec.id == undefined){
		$scope.selectedCats = [];
		$scope.categories = [];
		$scope.rec.category_type = 1;	

		var catUrl = $scope.$root.sales+"stock/categories";
		$http
		  .post(catUrl, {all:'1','token': $scope.$root.token})
		  .then(function (res) {
		  		$scope.categories = res.data.response;
					$.each(res.data.response,function(index,obj){
						obj.chk = false;
						$scope.categories[index] = obj;
					});
		  		});
	}


}

$scope.getServicesCats = function(){
	if($scope.rec.id == undefined){
		$scope.selectedCats = [];
		$scope.categories = [];
		$scope.rec.category_type = 2;

		var catApi = $scope.$root.setup+"service/categories/get-all-categories";
		 postData = {
			    'token': $scope.$root.token,
			    'all': "1",
		  	};
	    $http
	      .post(catApi, postData)
	      .then(function (res) {
	        	if(res.data.ack == true){
					 $scope.categories = res.data.response;
				}
				
	      });
	 }

}

angular.element(document).on('click','.checkCatAll',function(){
	$scope.selectedCats = [];
	if(angular.element('.checkCatAll').is(':checked') == true){
		for(var i = 0; i < $scope.categories.length; i++){
		 $scope.categories[i].chk = true;
		 $scope.selectedCats.push($scope.categories[i]);
		}
	}
	else{
		for(var i = 0; i < $scope.categories.length; i++){
		 $scope.categories[i].chk = false;
		}
		$scope.selectedCats = [];
	}
	$scope.$root.$apply(function(){
		$scope.selectedCats;
	})
});


$scope.selectCat = function(id){
		for(var i=0; i < $scope.categories.length; i++){
		if(id == $scope.categories[i].id){
			if($scope.categories[i].chk == true){
				$scope.categories[i].chk = false;
				var indx = $scope.selectedCats.indexOf($scope.categories[i]);
				$scope.selectedCats.splice(indx,1);
			}
			else{
				$scope.categories[i].chk = true;
				$scope.selectedCats.push($scope.categories[i]);
			}
		}
		}
}


	
	$scope.resetForm = function(rec){
		$scope.rec = {};
		$scope.items = [];
		$scope.categories = [];
		$scope.rec.type = 1;
		$scope.isCat = false;
		$scope.isItem = false;
		$scope.selectedItems = [];
		$scope.selectedCats = [];
	}

	$scope.resetItems = function(){
		$scope.selectedItems = [];
		$scope.selectedCats = [];

	}

	$scope.onChangeRebateType = function(){
		$scope.resetItems();
		$scope.rec.universal_types = '';
	}


  $scope.offer_method_id = {};
  $scope.currency_id = {};

  $scope.add = function(rec){
  	var addUrl = $scope.$root.sales+"crm/crm/add-crm-rebate";
	 
	 rec.crm_id = $scope.$root.crm_id;
	 rec.token = $scope.$root.token;

	 rec.type = rec.types != undefined?rec.types.id:0;
	 rec.universal_type = rec.universal_types != undefined?rec.universal_types.id:0;
	 rec.volume_1 = rec.volume_1s != undefined?rec.volume_1s.id:0;
	 rec.volume_2 = rec.volume_2s != undefined?rec.volume_2s.id:0;
	 rec.volume_3 = rec.volume_3s != undefined?rec.volume_3s.id:0;

	 rec.revenue_1 = rec.revenue_1s != undefined?rec.revenue_1s.id:0;
	 rec.revenue_2 = rec.revenue_2s != undefined?rec.revenue_2s.id:0;
	 rec.revenue_3 = rec.revenue_3s != undefined?rec.revenue_3s.id:0;

	 if(rec.type == 3 || rec.universal_type == 2 || rec.universal_type == 3){
	 	rec.items = $scope.items;
	 	if($scope.items.length == 0){
				toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Item(s)']));
	 		return;
	 	}
	 }

	 if(rec.type == 2){
	 	rec.categories = $scope.categories;
	 	if($scope.categories.length == 0){
				toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Category(ies)']));
	 		return;
	 	}
	 }

	 if(rec.id != undefined)
	 	 addUrl = $scope.$root.sales+"crm/crm/update-crm-rebate";

	 if(rec.price_offered >= 100){
	 	toaster.pop('error','Info',"Rebate "+rec.price_offered+"% is not allowed.");
	 	return;
	 }
	 if(rec.price_offered <= 0){
		 toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(238, ['Rebate','0']));
	 	return;
	 }
	 	
	 	

	 $http
      .post(addUrl, rec)
      .then(function (res) {
        	if(res.data.ack == true || res.data.edit == true){
		
			if(rec.id > 0)
				 	toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				else{
				 	toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
				 	 $scope.$root.$broadcast("showCrmRebateListing");
				 	 $scope.resetForm(rec);
				 }
				 var args = [];
				 args[0] = $scope.$root.crm_id;
				 args[1] = undefined;
				 $scope.$root.$broadcast("myCrmRebateEventReload", args);

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


/*$scope.addNewVolumePopup = function(){
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
}*/

/*$scope.addNewPredefinedPopup = function(drpdown,type,title,drp){
		
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
    	return false;*

     pedefined.token = $scope.$root.token;
	 pedefined.type = type;
	 	var postUrl = $scope.$root.setup+"ledger-group/add-predefine";
	 $http
      .post(postUrl, pedefined)
           .then(function (ress) {
	        	if(ress.data.ack == true){
					 var constUrl = $scope.$root.setup+"ledger-group/get-predefine-by-type";
				     $http
				      .post(constUrl, {'token':$scope.$root.token, type:type})
				      .then(function (res) {
				        	if(res.data.ack == true){

				        		if(type == 'OFFER_METHOD'){
									$scope.arr_OfferMethod = res.data.response;
									$scope.arr_OfferMethod.push({'id':'-1','name':'++ Add New ++'});
									$timeout(function(){
										$.each($scope.arr_OfferMethod,function(index,elem){
											if(elem.id == ress.data.id)
												$scope.rec.offer_method_ids = elem;
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
*/
$scope.addNewRebVolumePopup = function(drpdown,type,title){
		
 	var id = drpdown.id;
 	if(id > 0)
 		return false;

 	if(type == '1'){
	 	var indx = $scope.arr_rebt_volume_1.indexOf('-1');
	 	$scope.arr_rebt_volume_1.splice(indx,1);
 	}
 	if(type == '2'){
	 	var indx = $scope.arr_rebt_volume_2.indexOf('-1');
	 	$scope.arr_rebt_volume_2.splice(indx,1);
 	}
 	if(type == '3'){
	 	var indx = $scope.arr_rebt_volume_3.indexOf('-1');
	 	$scope.arr_rebt_volume_3.splice(indx,1);
 	}

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
	 	var postUrl = $scope.$root.sales+"crm/crm/add-rebate-volume";
	 $http
      .post(postUrl, pedefined)
           .then(function (ress) {
	        	if(ress.data.ack == true){
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					 var constUrl = $scope.$root.sales+"crm/crm/rebate-volumes";
				     $http
				      .post(constUrl, {'token':$scope.$root.token})
				      .then(function (res) {
				        	if(res.data.ack == true){
								
				        		if(type == '1'){
								$scope.arr_rebt_volume_1 = res.data.response;
	 								$scope.arr_rebt_volume_1.push({'id':'-1','name':'++ Add New ++'});
									$timeout(function(){
										$.each($scope.arr_rebt_volume_1,function(index,elem){
											if(elem.id == ress.data.id)
												$scope.rec.volume_1s = elem;
										});
									},3000);
								}
								if(type == '2'){
								$scope.arr_rebt_volume_2 = res.data.response;
									$scope.arr_rebt_volume_2.push({'id':'-1','name':'++ Add New ++'});
									$timeout(function(){
										$.each($scope.arr_rebt_volume_2,function(index,elem){
											if(elem.id == ress.data.id)
												$scope.rec.volume_2s = elem;
										});
									},3000);
								}
								if(type == '3'){
									$scope.arr_rebt_volume_3 = res.data.response;
									$scope.arr_rebt_volume_3.push({'id':'-1','name':'++ Add New ++'});
									$timeout(function(){
										$.each($scope.arr_rebt_volume_3,function(index,elem){
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

$scope.addNewRevenuePopup = function(drpdown,type,title){
		

 	var id = drpdown.id;
 	if(id >= 0)
 		return false;

 	if(type == '1'){
	 	var indx = $scope.arr_revenue_1.indexOf('-1');
	 	$scope.arr_revenue_1.splice(indx,1);
 	}
 	if(type == '2'){
	 	var indx = $scope.arr_revenue_2.indexOf('-1');
	 	$scope.arr_revenue_2.splice(indx,1);
 	}
 	if(type == '3'){
	 	var indx = $scope.arr_revenue_3.indexOf('-1');
	 	$scope.arr_revenue_3.splice(indx,1);
 	}

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
     pedefined.type = 'TURNOVER';
	 var postUrl = $scope.$root.setup+"ledger-group/add-predefine";
	 $http
      .post(postUrl, pedefined)
           .then(function (ress) {
	        	if(ress.data.ack == true){
					toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
					 var constUrl = $scope.$root.setup+"ledger-group/get-predefine-by-type";
				     $http
				      .post(constUrl, {'token':$scope.$root.token,'type':'TURNOVER'})
				      .then(function (res) {
				        	if(res.data.ack == true){
								
				        		if(type == '1'){
				        			$scope.arr_revenue_1 = [];
									$scope.arr_revenue_1.push({'id':'0','name':''});
							      	$.each(res.data.response,function(index,obj){
										$scope.arr_revenue_1.push(obj);
									});
	 								$scope.arr_revenue_1.push({'id':'-1','name':'++ Add New ++'});
									//$timeout(function(){
										$.each($scope.arr_revenue_1,function(index,elem){
											if(elem.id == ress.data.id)
												$scope.rec.revenue_1s = elem;
										});
									//},3000);
								}
								if(type == '2'){
									$scope.arr_revenue_2 = [];
								$scope.arr_revenue_2.push({'id':'0','name':''});
							      	$.each(res.data.response,function(index,obj){
										$scope.arr_revenue_2.push(obj);
									});
									$scope.arr_revenue_2.push({'id':'-1','name':'++ Add New ++'});
									//$timeout(function(){
										$.each($scope.arr_revenue_2,function(index,elem){
											if(elem.id == ress.data.id)
												$scope.rec.revenue_2s = elem;
										});
									//},3000);
								}
								if(type == '3'){
									$scope.arr_revenue_3 = [];
									$scope.arr_revenue_3.push({'id':'0','name':''});
							      	$.each(res.data.response,function(index,obj){
										$scope.arr_revenue_3.push(obj);
									});
									$scope.arr_revenue_3.push({'id':'-1','name':'++ Add New ++'});
									//$timeout(function(){
										$.each($scope.arr_revenue_3,function(index,elem){
											if(elem.id == ress.data.id)
												$scope.rec.revenue_3s = elem;
										});
									//},3000);
								}

							}
								
				      });
				  }
				  else{
						toaster.pop('error','Info',ress.data.error)
					}
				
	      });

		}, function (reason) {
      	console.log('Modal promise rejected. Reason: ', reason);
    });
}


$scope.volume = 0;

$scope.onChange_vol_1 = function (arg_id,arg_name) {

	 $scope.formData_vol_1= {}; 
	 $scope.volume = arg_id;
		 
		 $scope.get_category_list();
		 var id='';var volume='';
	if($scope.rec.universal_types.id == 2){
      if(arg_id==1) 
	  {  id = this.rec.volume_1s.id;    
	  	volume = 'Volume 1'; category=1;
	   $scope.title_type='Add Rebate Volume 1 ';
	   }
	  else if(arg_id==2)  {
		   id = this.rec.volume_2s.id; 
		    	volume = 'Volume 2'; 	category=1; 
				 $scope.title_type='Add Rebate Volume 2 ';
				 }
	  else  if(arg_id==3) { 
	   id = this.rec.volume_3s.id;
	    volume = 'Volume 3';category=1; 
		 $scope.title_type='Add Rebate Volume 3 ';
	  }
	  
	    if(arg_id==11) { 
		 id = this.rec.volume_1_purchase.id;    	volume = 'Volume 1'; category=2;
		  $scope.title_type='Add Purchase Offer Volume 1 ';
		  }
	  else if(arg_id==22)  { 
	  id = this.rec.volume_2_purchase.id;  
	  	volume = 'Volume 2'; category=2;
		 $scope.title_type='Add Purchase Offer Volume 1 ';
	  }
	  else  if(arg_id==33) {
		    id = this.rec.volume_3_purchase.id;
			 volume = 'Volume 3'; category=2;
			  $scope.title_type='Add Purchase Offer Volume 1 ';
			  }
      
	   if(arg_name=='sale')  {  
	    if (id == -1) $('#rebateVolume').modal({show: true});
	   }
	   
	    if(arg_name=='purchase'){  
	    if (id == -1) $('#model_vol_purchase_1').modal({show: true});
	   }
       
	   $scope.formData_vol_1.type =  volume;
	   $scope.formData_vol_1.category =  category;
	}

	if($scope.rec.universal_types.id == 3){
      if(arg_id==1) 
	  {  id = this.rec.revenue_1s.id;    
	  	volume = 'Volume 1'; category=2;
	   $scope.title_type='Add Rebate Revenue 1 ';
	   }
	  else if(arg_id==2)  {
		   id = this.rec.revenue_2s.id; 
		    	volume = 'Volume 2'; 	category=2; 
				 $scope.title_type='Add Rebate Revenue 2 ';
				 }
	  else  if(arg_id==3) { 
	   id = this.rec.revenue_3s.id;
	    volume = 'Volume 3';category=2; 
		 $scope.title_type='Add Rebate Revenue 3 ';
	  }
	  
	    if(arg_id==11) { 
		 id = this.rec.volume_1_purchase.id;    	volume = 'Volume 1'; category=2;
		  $scope.title_type='Add Purchase Offer Volume 1 ';
		  }
	  else if(arg_id==22)  { 
	  id = this.rec.volume_2_purchase.id;  
	  	volume = 'Volume 2'; category=2;
		 $scope.title_type='Add Purchase Offer Volume 1 ';
	  }
	  else  if(arg_id==33) {
		    id = this.rec.volume_3_purchase.id;
			 volume = 'Volume 3'; category=2;
			  $scope.title_type='Add Purchase Offer Volume 1 ';
			  }
      
	   if(arg_name=='sale')  {  
	    if (id == -1) $('#rebateVolume').modal({show: true});
	   }
	   
	    if(arg_name=='purchase'){  
	    if (id == -1) $('#model_vol_purchase_1').modal({show: true});
	   }
       
	   $scope.formData_vol_1.type =  volume;
	   $scope.formData_vol_1.category =  category;
		
    }
 }

    $scope.add_vol1_rebate = function (formData_vol_1) {
	if($scope.rec.universal_types.id == 2)
		var addvolumeUrl_rebate = $scope.$root.pr + "srm/srm/add-sale-offer-volume";
	if($scope.rec.universal_types.id == 3)
		var addvolumeUrl_rebate = $scope.$root.pr + "srm/srm/add-sale-offer-rev";

	$scope.formData_vol_1.token = $scope.$root.token;
	$scope.formData_vol_1.item_id = $scope.selectedItems[0].id ;
	 $scope.formData_vol_1.srm_id = $scope.$root.crm_id;
	$scope.formData_vol_1.unit_categorys = $scope.formData_vol_1.unit_category !== undefined ? $scope.formData_vol_1.unit_category.id : 0;
	$scope.formData_vol_1.category = 2;
       	 $http
                .post(addvolumeUrl_rebate, $scope.formData_vol_1)
                .then(function (res) {
                	console.log(res);
                    if (res.data.ack == true) {
											toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
						 $('#rebateVolume').modal('hide');
						 
						   $scope.loadVolFormData($scope.selectedItems[0].id,$scope.selectedItems[0].type,res.data.id,$scope.volume);
						  
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
					$scope.arr_rebt_volume_1 = []; 
					$scope.arr_rebt_volume_1.push({'id':'0','name':''});
			      	$.each(vol_data.data.response,function(index,obj){
						$scope.arr_rebt_volume_1.push(obj);
					});
                
				if($scope.arr_rebt_volume_1.length ==0)
					 { $scope.arr_rebt_volume_1.push({'id': '-1', 'name': '++ Add New ++'});}
				  
				 else if($scope.arr_rebt_volume_1.length >0)
				  if ($scope.user_type == 1)   $scope.arr_rebt_volume_1.push({'id': '-1', 'name': '++ Add New ++'});
				
				
				
			}
			else if(arg==2)
				{
					 $scope.arr_volume_purchase_1 = vol_data.data.response; 
					
					if($scope.arr_volume_purchase_1.length ==0)
					 { $scope.arr_volume_purchase_1.push({'id': '-1', 'name': '++ Add New ++'});}
				  
				 else if($scope.arr_volume_purchase_1.length >0)
				  if ($scope.user_type == 1)   $scope.arr_volume_purchase_1.push({'id': '-1', 'name': '++ Add New ++'});
				
				} 
			
				
				
                });

        $http
              	.post(volumeUrl_item, {type: 'Volume 2',category: arg,'item_id':item_id , 'token': $scope.$root.token})
                .then(function (vol_data) {
                    
				if(arg==1)
				{
                	$scope.arr_rebt_volume_2 = []; 
					$scope.arr_rebt_volume_2.push({'id':'0','name':''});
			      	$.each(vol_data.data.response,function(index,obj){
						$scope.arr_rebt_volume_2.push(obj);
					});
             
			 
			 if($scope.arr_rebt_volume_2.length ==0)
					 { $scope.arr_rebt_volume_2.push({'id': '-1', 'name': '++ Add New ++'});}
				  
				 else if($scope.arr_rebt_volume_2.length >0)
				  if ($scope.user_type == 1)   $scope.arr_rebt_volume_2.push({'id': '-1', 'name': '++ Add New ++'});
				
				
				
				}
				else if(arg==2)
				{
					 $scope.arr_volume_purchase_2 = vol_data.data.response;
              
			  
			   if($scope.arr_volume_purchase_2.length ==0)
					 { $scope.arr_volume_purchase_2.push({'id': '-1', 'name': '++ Add New ++'});}
				  
				 else if($scope.arr_volume_purchase_2.length >0)
				  if ($scope.user_type == 1)   $scope.arr_volume_purchase_2.push({'id': '-1', 'name': '++ Add New ++'});
				
				
				}
            
                });

        	$http
                .post(volumeUrl_item, {type: 'Volume 3',category: arg,'item_id':item_id , 'token': $scope.$root.token})
                .then(function (vol_data) {
                  
				if(arg==1)
				{
                	$scope.arr_rebt_volume_3 = []; 
					$scope.arr_rebt_volume_3.push({'id':'0','name':''});
			      	$.each(vol_data.data.response,function(index,obj){
						$scope.arr_rebt_volume_3.push(obj);
					});
             
			  if($scope.arr_rebt_volume_3.length ==0)
					 { $scope.arr_rebt_volume_3.push({'id': '-1', 'name': '++ Add New ++'});}
				  
				 else if($scope.arr_rebt_volume_3.length >0)
				  if ($scope.user_type == 1)   $scope.arr_rebt_volume_3.push({'id': '-1', 'name': '++ Add New ++'});
				
				
				
				}
				else if(arg==2)
				{
					 $scope.arr_volume_purchase_3 = vol_data.data.response;
               
			   
			    if($scope.arr_volume_purchase_3.length ==0)
					 { $scope.arr_volume_purchase_3.push({'id': '-1', 'name': '++ Add New ++'});}
				  
				 else if($scope.arr_volume_purchase_3.length >0)
				  if ($scope.user_type == 1)   $scope.arr_volume_purchase_3.push({'id': '-1', 'name': '++ Add New ++'});
				
				
				
				}
             
                });

        	$http
				 .post(unitUrl_item, {'token': $scope.$root.token,'item_id':item_id })
                .then(function (unit_data) {
                    $scope.arr_unit_of_measure = unit_data.data.response;
                   // $scope.arr_unit_of_measure.push({'id': '-1', 'name': '++ Add New ++'});
                });
    }

    $scope.get_category_list =function () {
        	var get_unit_setup_category = $scope.$root.sales + "stock/unit-measure/get-unit-setup-list-category";
           $scope.list_unit_category= [];
            $http
                    .post(get_unit_setup_category, {'token': $scope.$root.token,'item_id':$scope.selectedItems[0].id})
                    .then(function (vol_data) {
                        $scope.list_unit_category = vol_data.data.response;
                    });
        			
    }

   
    
 
}



