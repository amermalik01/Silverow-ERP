
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {

        /* specific routes here (see file config.js) */
        $stateProvider
                .state('app.services', {
                    url: '/services',
                    title: 'services',
                    templateUrl: helper.basepath('services/products_listing.html'),
                    resolve: helper.resolveFor('ngTable', "ngDialog")
                })
                .state('app.add_services', {
                    url: '/add_services',
                    title: 'Add Services',
                    templateUrl: helper.basepath('services/add_tab.html'),
                    resolve: helper.resolveFor('ngTable', "ngDialog"), 
                    controller: 'ServicesEditValuesController'
                })

                .state('app.services_values', {
                    url: '/service_values',
                    title: 'Add Services',
                    templateUrl: helper.basepath('services/tab.html'),
                    resolve: helper.resolveFor('ngTable', "ngDialog"),
                    controller: 'ServicesEditValuesController'
                })

                .state('app.view_services', {
                    url: '/view_services/:id/view/:tab',
                    title: 'View Services ',
                    templateUrl: helper.basepath('services/tab.html'),
                    resolve: helper.resolveFor('ngTable', "ngDialog"),
                    controller: 'ServicesEditValuesController' 
                })


                .state('app.edit_services', {
                    url: '/:id/edit_services',
                    title: 'Edit Services',
                    templateUrl: helper.basepath('services/tab.html'),
                    resolve: helper.resolveFor('ngTable', "ngDialog"),
                    controller: 'ServicesEditValuesController'
                })

    }]);
 
ServicesListingController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout",
    "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.controller('ServicesListingController', ServicesListingController);

function ServicesListingController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
    'use strict';








    // required for inner references
    $scope.module_id = 32;
    $scope.module_table = 'services';
    $scope.class = 'inline_block';
    $scope.$root.breadcrumbs =
            [//{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
                {'name': 'Setup', 'url': '#', 'isActive': false},
                {'name': 'Services', 'url': '#', 'isActive': false}, {'name': 'Manage', 'url': 'app.services', 'isActive': false}];

    var vm = this;
    var API = $scope.$root.setup + "service/products-listing";
    var delUrl = $scope.$root.setup + "service/products-listing/delete-value";

   $scope.postData={};

    $scope.postData = {
        'token': $scope.$root.token,
        'all': "1"
    };

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
        filter: {
            name: '',
            age: ''
        }
    }, {
        total: 0, // length of data
        counts: [], // hide page counts control

        getData: function ($defer, params) {
            ngDataService.getDataCustom($defer, params, API, $filter, $scope,  $scope.postData);
        }
    });

 function toTitleCase(str){
        var title = str.replace('_',' ');
        return title.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
	
	
	$scope.getItem = function(parm){
    	$scope.rec.token = $scope.$root.token;
    	//$scope.rec.warehouse_id = $scope.rec.warehouse !=undefined? $scope.rec.warehouse.id:'';
    	//$scope.rec.category_id = $scope.rec.category !=undefined? $scope.rec.category.id:'';
    	if(parm == 'all'){
    		$scope.rec = {};
    		$scope.rec.token = $scope.$root.token;
    	}
    	$scope.postData = $scope.rec;
    	 $scope.$root.$broadcast("myReload"); 
    }
	
	$scope.$on("myReload", function (event) {
		//var ApiAjax = $resource('api/company/get_listing_ajax/:module_id/:module_table/:filter_id/:more_fields/:condition');
			
			 // ngDataService.getDataCustom( $scope.MainDefer, $scope.mainParams, Api,$scope.mainFilter,$scope,$scope.postData);
			// ngDataService.getDataCustom($defer, params, Api, $filter, $scope, $scope.postData);
 			 $scope.table.tableParams5.reload();
			//return;
    });
    $scope.delete = function (id, index, arr_data) {
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                    .post(delUrl, {id: id, 'token': $scope.$root.token})
                    .then(function (res) {

                        if (res.data.ack == true) {
                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                            arr_data.splice(index, 1);
                            // $timeout(function(){ $state.go('app.services'); }, 1000);
                        } else {
                            toaster.pop('error', 'Info', 'Record cannot be Deleted.');
                        }
                    });
        }, function (reason) {
            // console.log('Modal promise rejected. Reason: ', reason);
        });

    };

}

 
myApp.controller('ServicesEditValuesController', ServicesEditValuesController);
function ServicesEditValuesController($scope, $stateParams, $http, $state, $resource, toaster, Calendar, $window, ngDialog) {






	if($stateParams.id >0)
	{
		$scope.check_srv_readonly = true; 
	//	$scope.perreadonly = false;
	}
	//else $scope.perreadonly = true;
	
	$scope.showEditForm = function () 
	{
		$scope.check_srv_readonly = false;
		//$scope.perreadonly = true;
	}
	






    var vm = this;
    $scope.datePicker = Calendar.get_caledar();


    $scope.class = 'inline_block';
    $scope.btnCancelUrl = 'app.services';
    $scope.showLoader = true;

    $scope.formFields = {};
    $scope.formData = {};
    $scope.formData1 = {};
    $scope.formData2 = {};
    $scope.formData3 = {};
    $scope.formData4 = {};
    $scope.formData5 = {};
    $scope.formData6 = {};
    $scope.category = [];
    $scope.countries = [];
    $scope.brandnames = [];
    $scope.unit_measures = [];
    $scope.costing_method = [];
    $scope.purchase_unit_measures = [];
    $scope.vat_method = [];
    $scope.status_data = [];

    $scope.formData_customer = {};
    $scope.category_list_filter = {};
    $scope.list_type = [];
    $scope.arr_volume_1 = [];
    $scope.arr_volume_2 = [];
    $scope.arr_volume_3 = [];
    $scope.formData_vol_1 = {};
    $scope.formData_vol_2 = {};
    $scope.formData_vol_3 = {};


    $scope.status_data = [{'label': 'Active', 'value': 1}, {'label': 'Inactive', 'value': 0}];
    $scope.costing_method = [{'label': 'FIFO', 'id': 1}, {'label': 'Average', 'id': 2}, {'label': 'LIFO', 'id': 3}, {'label': 'Standard', 'id': 4}, {'label': 'Specific', 'id': 5}];

    var _service = $scope.$root.setup + "service/products-listing";

    var categoryUrl = $scope.$root.setup + "service/categories/get-all-categories";
    var unitUrl = $scope.$root.setup + "service/unit-measure/get-all-unit";
    var addunitUrl = $scope.$root.setup + "service/unit-measure/add-unit";
    var countriesUrl = $scope.$root.hr + "hr_values/get-countries";
    var vatUrl = $scope.$root.hr + "hr_values/get-vat";
    //var brandsUrl = $scope.$root.setup+"brands/get-all-brands"; 

    $timeout(function () {
        $http
                .post(categoryUrl, {'token': $scope.$root.token})
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.category = res.data.response;

                        if ($scope.user_type == 1)
                        {
                            $scope.category.push({'id': '-1', 'name': '++ Add New ++'});
                        }
                    } else
                        toaster.pop('error', 'Error', "No category found!");
                });
        /*$http
         .post(brandsUrl, {'token':$scope.$root.token})
         .then(function (res) {
         if(res.data.ack == true){
         $scope.brandnames = res.data.response;
         
         //	console.log($scope.user_type);
         if($scope.user_type==1)
         {
         $scope.brandnames.push({'id':'-1','name':'++ Add New ++'});
         }
         
         }
         //else 	toaster.pop('error', 'Error', "No brand found!");
         });*/
        $http
                .post(unitUrl, {'token': $scope.$root.token})
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.unit_measures = res.data.response;
                       
                    } else
                        toaster.pop('error', 'Error', "No unit of measure found!");
						
						 if ($scope.user_type == 1)
                            $scope.unit_measures.push({id: '-1', name: '++Add New++'});
                });

        $http
                .post(unitUrl, {'token': $scope.$root.token})
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.purchase_unit_measures = res.data.response; 

                    } else
                        toaster.pop('error', 'Error', "No unit of measure found!");
						
							 if ($scope.user_type == 1)
                            $scope.purchase_unit_measures.push({id: '-1', name: '++Add New++'});
                });


        $http
                .post(countriesUrl, {'token': $scope.$root.token})
                .then(function (res) {
                    if (res.data.ack == true) {

                        $scope.countries = res.data.response;
                        $.each($scope.countries, function (index, elem) {
                            if (elem.id == $scope.$root.defaultCountry)
                                $scope.formData.prd_country_origin = elem;
                        });

                        if ($scope.user_type == 1)
                            $scope.countries.push({'id': '-1', 'name': '++ Add New ++'});


                    }
                });
        $http
                .post(vatUrl, {'token': $scope.$root.token})
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.vat_method = res.data.response;
                    }
                });

    }, 1000);
    //--------------------- start General   ------------------------------------------

	$scope.product_type = true; 	$scope.count_result=0;
    $scope.getCode = function (rec) { 
	
	
      //   var getCodeUrl = $scope.$root.setup + "service/products-listing/get-code";
	var getCodeUrl  = $scope.$root.stock + "products-listing/get-code";
	var name = $scope.$root.base64_encode('services');
	var no = $scope.$root.base64_encode('srv_no');
      
	var module_category_id=2;
	/*if( $scope.formData.brand_ids != 0)  module_category_id=1;
	if( $scope.formData.brand_ids == 0)
	{
		if( $scope.formData.category_ids != 0) module_category_id=3;
	}*/
	
	$http
	.post(getCodeUrl , {'is_increment': 1, 'token': $scope.$root.token, 'tb': name, 'm_id':54,'no':no,'category':$scope.formData.category_ids,'brand':$scope.formData.brand_ids,'module_category_id':module_category_id})
         .then(function (res) {
			 	
					if(res.data.ack==1)	{
							   $scope.formData.srv_code = res.data.code;
                   	 		 $scope.formData.srv_no = res.data.number; 
						
							  $scope.formData.code_type=module_category_id;//res.data.code_type;
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
	 if ($stateParams.id === undefined)   $scope.getCode();
	

        if ($stateParams.id !== undefined) {

            var ProductDetailsURL = $scope.$root.setup + "service/products-listing/product-details";

				$timeout(function () {
						$http
                    .post(ProductDetailsURL, {'token': $scope.$root.token, 'product_id': $stateParams.id})
                    .then(function (res) {
                        if (res.data.ack == true) {
                            $scope.formData = res.data.response;
                        
						     $scope.$root.model_code = res.data.response.srv_code;
							$scope.module_code= $scope.$root.model_code ;
                           
						   
						    $scope.formData.sale_unit_cost = $scope.formData.standard_price;
                            $scope.formData.sale_selling_price = $scope.formData.standard_price;

                            $scope.sale_unit_cost = $scope.formData.standard_price;

                            $scope.formData.purchase_price_1 = parseFloat($scope.formData.standard_price);
                            $scope.purchase_price_1 = parseFloat($scope.formData.standard_price);

                            $scope.formData.purchase_price_2 = parseFloat($scope.formData.standard_price);
                            $scope.purchase_price_2 = parseFloat($scope.formData.standard_price);

                            $scope.formData.purchase_price_3 = parseFloat($scope.formData.standard_price);
                            $scope.purchase_price_3 = parseFloat($scope.formData.standard_price);


                            $scope.formData.p_price_1 = parseFloat($scope.formData.unit_cost);
                            $scope.p_price_1 = parseFloat($scope.formData.unit_cost);

                            $scope.formData.p_price_2 = parseFloat($scope.formData.unit_cost);
                            $scope.p_price_2 = parseFloat($scope.formData.unit_cost);

                            $scope.formData.p_price_3 = parseFloat($scope.formData.unit_cost);
                            $scope.p_price_3 = parseFloat($scope.formData.unit_cost);





                            $.each($scope.category, function (index, obj) {
                                if (res.data.response.category_id) {
                                    if (obj.id == res.data.response.category_id) {
                                        // console.log(obj.id); console.log(res.data.response.category_id);
                                        $scope.formData.category_id = $scope.category[index];
                                    }
                                }
                            });


                            $.each($scope.countries, function (index, obj) {
                                //    console.log(res.data.response.country);
                                if (obj.id == res.data.response.prd_country_origin) {
                                    $scope.formData.prd_country_origin = $scope.countries[index];
                                }
                            });

                            $.each($scope.vat_method, function (index, obj) {
                                if (res.data.response.vat_rate_id) {
                                    if (obj.id == res.data.response.vat_rate_id) {

                                        //  console.log(obj.id); console.log(res.data.response.vat_rate_id);
                                        $scope.formData.vat_rate_id = $scope.vat_method[index];
                                    }
                                }
                            });

                            /*	$.each($scope.brandnames,function(index,obj){
                             if(res.data.response.brand_id){	
                             if( obj.id == res.data.response.brand_id ){
                             // console.log(obj.id); console.log(res.data.response.category_id);
                             $scope.formData.brand_id = $scope.brandnames[index];
                             }
                             }
                             });*/

                            $.each($scope.unit_measures, function (index, obj) {
                                if (res.data.response.unit_id) {
                                    if (obj.id == res.data.response.unit_id) { 
                                        $scope.formData.unit_id = $scope.unit_measures[index];
                                    }
                                }
                            });


                            $.each($scope.status_data, function (index, obj) {
                                if (res.data.response.status) {
                                    if (obj.value == res.data.response.status) {
                                        //console.log(obj.value); console.log(res.data.response.category_id);
                                        $scope.formData.status = $scope.status_data[index];
                                    }
                                }
                            });


                            $.each($scope.costing_method, function (index, obj) {
                                if (res.data.response.costing_method_id) {
                                    if (obj.id == res.data.response.costing_method_id) {
                                        $scope.formData.costing_method_id = $scope.costing_method[index];
                                    }
                                }
                            });



                            $.each($scope.purchase_unit_measures, function (index, obj) {
                                if (res.data.response.purchase_measure) {
                                    if (obj.id == res.data.response.purchase_measure) {
                                        $scope.formData.purchase_measure = $scope.purchase_unit_measures[index];
                                    }
                                }
                            });

  $scope.formData.unit_cost = parseFloat(res.data.response.unit_cost);
                        $scope.formData.average_cost_id = parseFloat(res.data.response.average_cost_id);
                        $scope.formData.standard_price = parseFloat(res.data.response.standard_price);
                        $scope.formData.average_price = parseFloat(res.data.response.average_price);

                        }

                    });
		  $scope.showLoader = false;
			}, 1000);
        }
      

    $scope.showLoader = false;

    $scope.$root.breadcrumbs =
            [//{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
                {'name': 'Setup', 'url': '#', 'isActive': false}, {'name': 'Services', 'url': '#', 'isActive': false},
                {'name': 'Manage', 'url': 'app.services', 'isActive': false},
                {'name':  $scope.$root.model_code, 'url': '#', 'isActive': false},
                {'name': 'General', 'url': '#', 'isActive': false}];

    $scope.generalInformation = function () {
        $scope.$root.breadcrumbs =
                [//{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
                    {'name': 'Setup', 'url': '#', 'isActive': false}, {'name': 'Services', 'url': '#', 'isActive': false},
                    {'name': 'Manage', 'url': 'app.services', 'isActive': false},
                    {'name':  $scope.$root.model_code, 'url': '#', 'isActive': false},
                    {'name': 'General ', 'url': '#', 'isActive': false}];
    }


    var updateUrl = $scope.$root.setup + "service/products-listing/update-values";
    $scope.addGeneral = function (formData) {

        $scope.formData = formData;
        $scope.formData.product_id = $stateParams.id;
//$scope.formData.product_id = $scope.$root.product_id;
//$scope.formData.data = $scope.formData;
        $scope.formData.tab_id_2 = 1;
        $scope.formData.token = $scope.$root.token;
        $scope.formData.category_ids = $scope.formData.category_id !== undefined ? $scope.formData.category_id.id : 0;
//$scope.formData.brand_ids = $scope.formData.brand_id !== undefined ? $scope.formData.brand_id.id:0;
        $scope.formData.unit_ids = $scope.formData.unit_id !== undefined ? $scope.formData.unit_id.id : 0;
        $scope.formData.statuss = $scope.formData.status !== undefined ? $scope.formData.status.value : 0;


        $http
                .post(updateUrl, $scope.formData)
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.$root.product_id = res.data.product_id;
                        toaster.pop('success', res.data.info, res.data.msg);
                        if (res.data.info == 'Add')
                            $timeout(function () {
                                $state.go("app.edit_services", {id: res.data.product_id});
                            }, 2000);

                    } else
                        toaster.pop('error', 'Error', res.data.error);
                });
    }



    $scope.get_parent = function () {

        var id = this.formData.category_ids.id;
        //var cid =document.getElementById("category_ids").value; 
        /* var postUrl_parent = $scope.$root.gl+"chart-accounts/get_parent"; 
         $http
         .post(postUrl_parent, {'token': $scope.$root.token,'id': id})
         .then(function (res) { 
         if(res.data.ack == true){ 
         $scope.formData.gl_category_id = res.data.response.code; 
         $scope.parent_show= true;   
         }
         }); */
        //	console.log(id);
        //	console.log(cid);		
        //console.log($scope.type_id);

        var purchase_url = $scope.$root.gl + "chart-accounts/gl-type";
        $http
                .post(purchase_url, {'token': $scope.$root.token, 'type_id': id})
                .then(function (res) {

                    if (res.data.ack == true) {
                        $scope.column_gl = [];
                        $scope.record_gl = {};

                        $scope.record_gl = res.data.response;
                        angular.forEach(res.data.response[0], function (val, index) {
                            $scope.column_gl.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
                    }

                });
    }

    $scope.getpurchaseGL = function (arg) {

        if (arg == 'saleperson') {
            $scope.type_id = 1;
        }
        if (arg == 'sale') {
            $scope.type_id = 2;
        }

        $scope.category_list = {};
        var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";
        $http
                .post(postUrl_cat, {'token': $scope.$root.token})
                .then(function (res) {
                    if (res.data.ack == true)
                        $scope.category_list = res.data.response;
                    $scope.record_gl = res.data.response_account;
                    //else
                    //toaster.pop('error', 'Error', "No GL Category is found!");
                });
        //	$scope.columns = [];$scope.record = {};

//					var purchase_url = $scope.$root.gl+"chart-accounts/gl-type";
//				  $http
//				   .post(purchase_url, {'token':$scope.$root.token,'type_id': 1})
//				  .then(function (res) {
//						if(res.data.ack == true){
//							$scope.column_gl = [];$scope.record_gl  = {};
//							
//							 $scope.record_gl = res.data.response;
//							// console.log($scope.record_gl );
//							 angular.forEach(res.data.response[0],function(val,index){
//									  $scope.column_gl.push({
//										'title':toTitleCase(index),
//										'field':index,
//										'visible':true
//									  }); 
//								  });
//						}
//					
//				  });


        ngDialog.openConfirm({
            template: 'modalDialogId_GL',
            // templateUrl: 'app/views/_listing_modal.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (result) {
            if (arg == 'saleperson')
            {
                //	console.log(result);
                $scope.formData.purchase_code = result.number;
                $scope.formData.purchase_code_id = result.id;
            }
            if (arg == 'sale')
            {
                $scope.formData.sales_code = result.number;
                $scope.formData.sales_code_id = result.id;
            }

        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    //--------------------- End General   ------------------------------------------



// ---------------- invoice   	 -----------------------------------------

    $scope.getinvoice = function () {
        $scope.$root.breadcrumbs = [//{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
            {'name': 'Setup', 'url': '#', 'isActive': false}, {'name': 'Services', 'url': '#', 'isActive': false}
            , {'name': 'Manage', 'url': 'app.services', 'isActive': false},
            {'name':  $scope.$root.model_code, 'url': '#', 'isActive': false},
            {'name': 'Invoices', 'url': '#', 'isActive': false}];
        $scope.check_readonly = true;

    }

    $scope.addinvoice = function (formData) {

        $scope.formData.product_id = $scope.$root.product_id;
        $scope.formData.token = $scope.$root.token;
        $scope.formData.data = $scope.formFields;
        $scope.formData.tab_id_2 = 3;
        $scope.formData.prd_country_origins = $scope.formData.prd_country_origin !== undefined ? $scope.formData.prd_country_origin.id : 0;



        $http
                .post(updateUrl, $scope.formData)
                .then(function (res) {

                    if (res.data.ack == true) {
                        toaster.pop('success', res.data.info, res.data.msg);

                    } else
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    // toaster.pop('error', 'Error', res.data.error );
                });





    }

    //---------------- invoice    ------------------------


// ---------------- Detail   ----------------------------------------


    $scope.getdetail = function () {

        $scope.check_readonly = true;

        $scope.$root.breadcrumbs = [//{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
            {'name': 'Setup', 'url': '#', 'isActive': false}
            , {'name': 'Services', 'url': '#', 'isActive': false}
            , {'name': 'Manage', 'url': 'app.services', 'isActive': false},
            {'name':  $scope.$root.model_code, 'url': '#', 'isActive': false},
            {'name': 'Details', 'url': '#', 'isActive': false}];
    }

    $scope.adddetail = function (formData) {


        $scope.formData.product_id = $scope.$root.product_id;
        $scope.formData.token = $scope.$root.token;
        $scope.formData.tab_id_2 = 2;
        if ($scope.formData.costing_method_id != null)
            $scope.formData.costing_method_ids = $scope.formData.costing_method_id !== undefined ? $scope.formData.costing_method_id.id : 0;
        if ($scope.formData.vat_rate_id != null)
            $scope.formData.vat_rate_ids = $scope.formData.vat_rate_id !== undefined ? $scope.formData.vat_rate_id.id : 0;
        if ($scope.formData.purchase_measure != null)
            $scope.formData.purchase_measures = $scope.formData.purchase_measure !== undefined ? $scope.formData.purchase_measure.id : 0;

        $scope.formData.sale_unit_cost = $scope.formData.standard_price;
        $scope.formData.sale_selling_price = $scope.formData.standard_price;

        $scope.formData.purchase_price_1 = $scope.formData.standard_price;
        $scope.formData.purchase_price_2 = $scope.formData.standard_price;
        $scope.formData.purchase_price_3 = $scope.formData.standard_price;
        $scope.formData.p_price_1 = $scope.formData.unit_cost;
        $scope.formData.p_price_2 = $scope.formData.unit_cost;
        $scope.formData.p_price_3 = $scope.formData.unit_cost;

        $http
                .post(updateUrl, $scope.formData)
                .then(function (res) {

                    if (res.data.ack == true) {
                        toaster.pop('success', res.data.info, res.data.msg);

                    } else
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    // toaster.pop('error', 'Error', res.data.error );
                });
    }

    //---------------- Detail   End ------------------------


// ------------- 	Sale	 ----------------------------------------
    $scope.category_list_filter = [{value: 'address', id: 'address'}, {value: 'city', id: 'city'}, {value: 'postcode', id: 'postcode'}];

    $scope.list_discount_on = [];
    $scope.list_discount_on = [{value: 'Customer  Individual Price', id: 0}, {value: 'Standand Selling Price', id: 1}];

    $scope.ourTeamCategories = [];
    $scope.ourTeamCategories = [
        {"value": 'Segment', id: 1},
        {"value": 'Buying group', id: 2},
        {"value": 'Both', id: 3},
    ]
    $scope.selected_discount_on = false;
    $scope.promotion_price = true;
    $scope.required_checked = false;
    $scope.chk = false;
    var customer_url = $scope.$root.setup + "service/products-listing/customer-sale-list";
    var filer_customer_url = $scope.$root.setup + "service/products-listing/customer-sale-list-filter";

    $scope.show_price = function () {


        //	$scope.formData.sale_unit_cost =$scope.formData.standard_price ;
        $scope.formData.sale_selling_price = $scope.formData.standard_price;
        // console.log($scope.formData.sale_selling_price);

        if ($scope.formData.sale_selling_check) {  // when checked
            $scope.sale_price = true;
            $scope.promotion_price = false;
        } else {
            $scope.sale_price = false;
            $scope.promotion_price = true;
        }
    }

    $scope.show_price_calculate = function () {
        var price = 0;
        var final_price = 0;
        var id = this.formData.sale_selling_check.id;
        if (id == 1) {


            price = $scope.formData.sale_selling_price;
            var f_id = this.formData.supplier_type.id;
            if (f_id == 1)
            {

                final_price_one = (parseFloat($scope.formData.discount_value)) * (parseFloat(price)) / 100;
                final_price = (parseFloat(price)) - (parseFloat(final_price_one));
            } else if (f_id == 2)
            {
                final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value));

            }

            var final_new = (Math.round(final_price * 100) / 100).toFixed(2);
            if (final_new != 'NaN')
                $scope.formData.discount_price = final_new;

        }
    }

    $scope.discount_check = function () {

        var id = this.formData.sale_selling_check.id;


        $scope.selected_discount_on = false;
        $scope.required_checked = false;
        if (id == 1)
        {
            $scope.selected_discount_on = true;
            $scope.required_checked = true;
        }


        $scope.formData.sale_selling_price = $scope.formData.standard_price;

    }

    $scope.mySortFunction = function (item) {
        if (isNaN(item[$scope.sortExpression]))
            return item[$scope.sortExpression];
        return parseInt(item[$scope.sortExpression]);
    }

    $scope.get_filter_list = function () {

        var category_id = this.formData.category_id.name;
        $scope.sortExpression = category_id;
        // reverseSort = !reverseSort

        /* if($scope.MyCustomeFilters && $scope.tableParams5){
         $scope.tableParams5.reload();
         }	 */
        /*$scope.postData = {'condition':'namelike_*'+category_id+'@urllike_*'+category_id,'all': "1",token:$scope.$root.token};		
         ngDataService.getDataCustomAjax( $scope.MainDefer, $scope.mainParams, Api,$scope.mainFilter,$scope,'doreload'+$scope.count ,$scope.postData);
         $scope.table.tableParams5.reload();
         */

    }

    $scope.get_filter_select = function (agr) {

        if (agr == 1) {
            $scope.formData_customer.sale_customer_id = '';
        }

        /*	var category_idd = this.select_1.value;
         console.log(category_idd);
         */
        var category_id = document.getElementById("select_1").value;


        postData_sale = {
            'token': $scope.$root.token,
            'id': $scope.formData_customer.sale_customer_id,
            'type': category_id,
            'product_id': $stateParams.id
        };
        $http
                .post(customer_url, postData_sale)
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.selection_record = {};
                        $scope.columnss = [];

                        $scope.selection_record = res.data.response;
                        $scope.total = res.data.total;
                        $scope.selected_count = res.data.selected_count;

                        $scope.formData_customer.discount_type2 = res.data.discount_type2;
                        $scope.formData_customer.discount_value2 = res.data.discount_value2;
                        $scope.formData_customer.discounted_price2 = res.data.discounted_price2;


                        angular.forEach(res.data.response[0], function (val, index) {

                            $scope.columnss.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });

                        $timeout(function () {
                            angular.forEach(res.data.response, function (value, key) {
                                if (value.checked == 1)
                                    //  console.log('#selected_'+value.id);
                                    angular.element('#selected_' + value.id).click();
                                //	 $(".selected_"+value.id).click(); 
                            });
                        }, 1000);
                    }
                });

    }

    $scope.setSymbol = function (div_id) {
        //var id = this.formData.div_id.id; 
        // var id =document.getElementById("type_"+div_id).value; 
        var id = $('#type_' + div_id).val();
        // console.log(id); console.log("#type_"+div_id); console.log(div_id);

        if (id == 0)
            //$scope.show_symbol = true;
            $('#date_msg_' + div_id).show();
        else
            //$scope.show_symbol = false;
            $('#date_msg_' + div_id).hide();
    }

    $scope.submit_sales = function () {

        $scope.selectedList = $scope.record.filter(function (namesDataItem) {
            return namesDataItem.checked;
        });
        //  console.log($scope.selectedList);

        //	 $scope.sale_name.push({'id':'-1','name':'++ Add New ++' }); //selectedList.name

        $.each($scope.selectedList, function (index, obj) {

            for (var i = 0; i < $scope.record.length; i++) {
                var object = $scope.record[i];
                //	console.log(object.id ==obj.id);
                if (object.id == obj.id) {
                    //$scope.sale_name.push(i, 1); //selectedList.name
                    $scope.sale_name = $scope.selectedList[index];
                }
            }

            //}

        });
        var values = [];
        $(".list_values:checked").each(function () {
            values.push($(this).val());
        });
        var selected;
        selected = values.join(',') + ",";
        alert("You have selected " + values);
        $scope.model_sales = false;

    }

    $scope.getcustomer = function (arg) {
        $scope.titile_2 = 'Customer';

        postData = {
            'token': $scope.$root.token,
            'get_id': 1,
            'product_id': $stateParams.id
        };
        $http
                .post(customer_url, postData)
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.record = {};
                        $scope.columnss = [];
                        $scope.total = 0;

                        $scope.record = res.data.response;
                        $scope.total = res.data.total;

                        angular.forEach(res.data.response[0], function (val, index) {
                            $scope.columnss.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
                    }
                });

        ngDialog.openConfirm({
            template: 'modalSaleDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (result) {
            if (arg == 'saleperson') {
                $scope.selectedAll = '';
                $scope.selectedList = '';
                $scope.selectedList = $scope.record.filter(function (namesDataItem) {
                    return namesDataItem.Selected;
                });

                var test_name = '';
                var test_id = '';
                var customer_price = '';
                $.each($scope.selectedList, function (index, obj) {

                    for (var i = 0; i < $scope.record.length; i++) {
                        var object = $scope.record[i];
                        if (object.name == obj.name) {
                            test_name += obj.name + ",";
                        }

                        if (object.id == obj.id) {
                            test_id += obj.id + ",";
                        }
                        if (object.price == obj.price) {
                            customer_price += obj.price + ",";
                        }


                    }

                    $scope.formData.sale_name = test_name;
                    document.getElementById("display_record").innerHTML = test_name;
                    $scope.formData.sale_name_id = test_id;
                    $scope.formData.customer_price = customer_price;
                    //	console.log(customer_price);


                });
            }
        },
                function (reason) {
                    console.log('Modal promise rejected. Reason: ', reason);
                });
    }

    $scope.get_all_list_customer = function (id) {

        $scope.selection_record_get = {};
        $scope.columnss_get = [];

        $scope.formData.select_1 = '';
        $scope.formData.category_id = '';
        $scope.formData.searchKeyword = '';

        angular.element('#model_btn_cs_first').modal({
            show: true
        });

        $scope.formData_customer.sale_customer_id = id;

        postData = {
            'token': $scope.$root.token,
            'get_id': id,
            'product_id': $stateParams.id
        };
        $http
                .post(customer_url, postData)
                .then(function (res) {
                    if (res.data.ack == true) {

                        $scope.selection_record_get = {};
                        $scope.columnss_get = [];

                        $scope.selection_record_get = res.data.response;
                        $scope.total = res.data.total;
                        $scope.selected_count = res.data.selected_count;

                        $scope.formData_customer.discount_type2 = res.data.discount_type2;
                        $scope.formData_customer.discount_value2 = res.data.discount_value2;
                        $scope.formData_customer.discounted_price2 = res.data.discounted_price2;
                        angular.forEach(res.data.response[0], function (val, index) {

                            $scope.columnss_get.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });

                    }
                });
    }

    $scope.postData = {};
    $scope.get_match_result = function (id) {

        if (id == 'all') {
            //	$scope.postData = {'all': "1",token:$scope.$root.token};	
            $scope.formData.select_1 = '';
            $scope.formData.category_id = '';
            $scope.formData.searchKeyword = '';

            $scope.select_1 = '';
            $scope.category_id = '';
            $scope.searchKeyword = '';
        }



        $scope.postData.product_id = $stateParams.id;
        $scope.postData.token = $scope.$root.token;
        $scope.postData.get_id = id;
        $scope.postData.select_1s = $scope.formData.select_1 !== undefined ? $scope.formData.select_1.id : '';//document.getElementById("select_1").value; 

        $scope.postData.cat_ids = $scope.formData.category_id !== undefined ? $scope.formData.category_id.id : '';//document.getElementById("category_id").value; 

        $scope.postData.type = $scope.formData.select_1 !== undefined ? $scope.formData.select_1.id : ''; //document.getElementById("category_id").value; 

        //$scope.postData.id= $scope.formData_customer.sale_customer_id;

        $scope.postData.searchKeyword = document.getElementById("searchKeyword").value;
        //$scope.searchKeyword;
        $scope.postData.id = $scope.formData_customer.sale_customer_id;
        // console.log($scope.formData_customer.sale_customer_id=id );return;
        $http
                .post(filer_customer_url, $scope.postData)
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.selection_record_get = {};
                        $scope.columnss_get = [];

                        $scope.selection_record_get = res.data.response;
                        $scope.total = res.data.total;
                        $scope.selected_count = res.data.selected_count;

                        $scope.formData_customer.discount_type2 = res.data.discount_type2;
                        $scope.formData_customer.discount_value2 = res.data.discount_value2;
                        $scope.formData_customer.discounted_price2 = res.data.discounted_price2;


                        angular.forEach(res.data.response[0], function (val, index) {
                            $scope.columnss_get.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
                        $scope.columnss = [];
                        $scope.selection_record = {};
                        $scope.selection_record = res.data.response;
                        angular.forEach(res.data.response[0], function (val, index) {
                            $scope.columnss.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });

                        $timeout(function () {
                            angular.forEach(res.data.response, function (value, key) {
                                if (value.checked == 1)
                                    //  console.log('#selected_'+value.id);
                                    angular.element('#selected_' + value.id).click();
                                //	 $(".selected_"+value.id).click(); 
                            });
                        }, 1000);
                    }
                });

    };

//	$scope.checkAll = function () {
//		
//		//$scope.selectedAll = '';  
//		$scope.selectedList='';
//		$scope.Selected='';
//	
//				 var bool = document.getElementById("selecctall").checked;
//      				// alert(bool);
//   				 angular.forEach($scope.selection_record, function (item) {
//			//  angular.element('#selected_'+item.id).click();
//				
//				 item.Selected =  bool;
//				/*if(item.Selected==true){
//		 		 
//				  item.Selected =  false;
//				 
//				}
//				else{
//					 item.Selected =  bool;
//					  
//					 }*/
//        });	
//		
//		
//		
//			};

    $scope.calculateChecked = function () {
        var count = 0;
        //item.Selected
        angular.forEach($scope.record, function (value) {
            //  console.log(value.Selected);
            if (value.Selected)
                count++;
        });

        return count;
    };

    $scope.add_list = function () {

        $scope.selectedList = $scope.selection_record_get.filter(function (namesDataItem) {
            return namesDataItem.Selected;
        });

        var test_name = '';
        var test_id = '';
        var customer_price = '';
        var discount_type = '';
        $.each($scope.selectedList, function (index, obj) {

            for (var i = 0; i < $scope.selection_record_get.length; i++) {
                var object = $scope.selection_record_get[i];
                if (object.name == obj.name) {
                    test_name += obj.name + ",";
                }

                if (object.id == obj.id) {
                    test_id += obj.id + ",";
                }

                if (object.customer_price == obj.customer_price) {
                    customer_price += obj.customer_price + ",";
                }

                if (object.discount_type == obj.discount_type) {
                    discount_type = obj.discount_type + ",";
                }
            }

            $scope.formData_customer.sale_name2 = test_name;
            //document.getElementById("display_record").innerHTML = test_name;
            $scope.formData_customer.sale_name_id2 = test_id;
            $scope.formData_customer.customer_price2 = customer_price;

            $scope.formData.sale_name = test_name;
            //document.getElementById("display_record").innerHTML = test_name.substr(1);

            $scope.formData.sale_name_id = test_id;
            $scope.formData.customer_price = customer_price;

        });
        document.getElementById("display_record").innerHTML = test_name.substring(0, test_name.length - 1);


        $('#model_btn_cs_first').modal('hide');
    }


    $scope.viewAllCustomers = function (id) {
        $scope.selection_record = {};
        $scope.columnss = [];

        $scope.formData.select_1 = '';
        $scope.formData.category_id = '';
        $scope.formData.searchKeyword = '';

        angular.element('#from_selected').show();
        $('#model_btn_cs').modal({
            show: true
        });


        $scope.formData_customer.sale_customer_id = id;
        postData_sale = {
            'token': $scope.$root.token,
            'id': id,
            'product_id': $stateParams.id
        };
        $http
                .post(customer_url, postData_sale)
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.selection_record = {};
                        $scope.columnss = [];

                        $scope.selection_record = res.data.response;
                        $scope.total = res.data.total;
                        $scope.selected_count = res.data.selected_count;

                        $scope.formData_customer.discount_type2 = res.data.discount_type2;
                        $scope.formData_customer.discount_value2 = res.data.discount_value2;
                        $scope.formData_customer.discounted_price2 = res.data.discounted_price2;


                        angular.forEach(res.data.response[0], function (val, index) {

                            $scope.columnss.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });

                        $timeout(function () {
                            angular.forEach(res.data.response, function (value, key) {
                                if (value.checked == 1)
                                        //  console.log('#selected_'+value.id);
                                        {
                                            angular.element('#selected_' + value.id).click();
                                            angular.element('.pic_block').attr("disabled", false);
                                        }

                                //	 $(".selected_"+value.id).click(); 
                            });
                        }, 1000);
                    }
                });
    };

    $scope.checkAll_cancel = function () {

        $scope.selectedList = '';
        $scope.Selected = '';
        // var bool = document.getElementById("selecctall_2").checked;
        var bool = angular.element("#selecctall_2").is(':checked');
        if (!bool) {
            angular.element('.pic_block').attr("disabled", true);
        } else {
            angular.element('.pic_block').attr("disabled", false);
        }

        angular.forEach($scope.selection_record_get, function (item) {
            //  angular.element('#selected_'+item.id).click();
            if (item.price != null || $scope.checkDiscountOn()) {
                angular.element('#selected_' + item.id).prop('checked', bool);
            }

        });
    };

    $scope.checkAll = function () {

        //$scope.selectedAll = '';  
        $scope.selectedList = '';
        $scope.Selected = '';

        // var bool = document.getElementById("selecctall").checked;
        var bool = angular.element("#selecctall").is(':checked');
        if (!bool) {
            $('.pic_block').attr("disabled", true);
        } else {
            $('.pic_block').attr("disabled", false);
        }
        // alert(bool);
        angular.forEach($scope.selection_record, function (item) {
            //  angular.element('#selected_'+item.id).click();
            if (item.price != null || $scope.getDiscountOnValue()) {
                angular.element('#selected_' + item.id).prop('checked', bool);
            }

        });



    };

    $scope.checkDiscountOn = function () {

        if (angular.element('#saleSellingCheckId').val() == 1) {
            return true
        } else {
            return false;
        }
    };

    $scope.calculateCheckedEdit_cancel = function () {


        var count = 0;
        angular.forEach($scope.selection_record_get, function (value) {

            if (value.price != null || $scope.checkDiscountOn()) {
                if (angular.element('#selected_' + value.id).prop('checked'))
                    count++;
            }

        });
        if (count != 0) {
            angular.element('#from_selected').hide();
            angular.element('#from_ch_selected').show();
        } else {
            angular.element('#from_selected').show();
            angular.element('#from_ch_selected').hide();
        }
        /* if(count!=0){
         count= count+ $scope.selected_count;
         }*/
        return count;
    };


    $scope.calculateCheckedEdit = function () {


        var count = 0;
        angular.forEach($scope.selection_record, function (value) {

            if (value.price != null || $scope.getDiscountOnValue()) {

                if (angular.element('#selected_' + value.id).prop('checked'))
                    count++;
            }

        });
        if (count != 0) {
            angular.element('#from_selected').hide();
            angular.element('#from_ch_selected').show();
        } else {
            angular.element('#from_selected').show();
            angular.element('#from_ch_selected').hide();
        }
        /* if(count!=0){
         count= count+ $scope.selected_count;
         }*/

        return count;
    };

//	 $scope.checkAll_cancel = function () {
//		
//		$scope.selectedList='';
//		$scope.Selected='';
//		 var bool = document.getElementById("selecctall_2").checked;
//      			
//		//	console.log(bool);
// 	/*var bool = true;
//    if ($scope.selectedAll==false) {
//      bool = false;
//    }*/
//    	  /*angular.forEach($scope.selection_record, function (item) {
//			//  angular.element('#selected_'+item.id).click();
//				if(item.Selected==true){
//		 		 
//				  item.Selected =  false;
//				 
//				}
//				else{
//					 item.Selected =  bool;
//					  
//					 }
//        });	*/
//		
//			
//				
//		 angular.forEach($scope.selection_record_get, function (item) {
//			//  angular.element('#selected_'+item.id).click();
//				
//				 item.Selected =  bool;
//				/*if(item.Selected==true){
//		 		 
//				  item.Selected =  false;
//				 
//				}
//				else{
//					 item.Selected =  bool;
//					  
//					 }*/
//        });	 
//		};

//	 $scope.calculateCheckedEdit_cancel = function() {
//	
//	 
//    	  var count = 0;
//    	angular.forEach($scope.selection_record_get, function(value) {
//			
//        if(value.Selected)
//          count++;
//      });
//	  if(count!=0){
//	     angular.element('#from_selected').hide();
//	    angular.element('#from_ch_selected').show();
//	  }
//	else{
//	   angular.element('#from_selected').show();
//	    angular.element('#from_ch_selected').hide();
//	 }
//	/* if(count!=0){
//		count= count+ $scope.selected_count;
//	 }*/
//  	    return count;
//   };
// 	
//	 $scope.calculateCheckedEdit = function() {
//	
//	 
//    	  var count = 0;
//    	angular.forEach($scope.selection_record, function(value) {
//			
//        if(value.Selected)
//          count++;
//      });
//	  if(count!=0){
//	     angular.element('#from_selected').hide();
//	    angular.element('#from_ch_selected').show();
//	  }
//	else{
//	   angular.element('#from_selected').show();
//	    angular.element('#from_ch_selected').hide();
//	 }
//	/* if(count!=0){
//		count= count+ $scope.selected_count;
//	 }*/
//  	    return count;
//   };
// 	 
    $scope.add_customer = function (formData_customer) {

        $scope.selectedList = $scope.selection_record.filter(function (namesDataItem) {
            return namesDataItem.Selected;
        });

        var test_name = '';
        var test_id = '';
        var customer_price = '';
        var discount_type = '';
        var discounted_price2 = '';

        $.each($scope.selectedList, function (index, obj) {

            for (var i = 0; i < $scope.selection_record.length; i++) {
                var object = $scope.selection_record[i];
                if (object.name == obj.name) {
                    test_name += obj.name + ",";
                }

                if (object.id == obj.id) {
                    test_id += obj.id + ",";
                }

                if (object.customer_price == obj.customer_price) {
                    customer_price += obj.customer_price + ",";
                }

                if (object.discount_type == obj.discount_type) {
                    discount_type = obj.discount_type + ",";
                }


                if (object.discounted2 == obj.discounted2) {
                    //console.log(discounted_price2);	console.log(obj.discounted2);
                    if (obj.discounted2 === null)
                        discounted_price2 = obj.discounted2;
                    else
                        discounted_price2 = discounted_price2 + ',' + obj.discounted2;
                    // discounted_price2  = obj.discounted2+ ","; 
                }


            }

            // $scope.record_id=record_id;
            $scope.formData_customer.sale_name2 = test_name;
            //document.getElementById("display_record").innerHTML = test_name;
            $scope.formData_customer.sale_name_id2 = test_id;
            $scope.formData_customer.customer_price2 = customer_price;
            $scope.formData_customer.discounted_customer_price = discounted_price2.substr(1);
            //	console.log(discounted_price2.substr(1));

        });

        $scope.formData_customer.product_id = $stateParams.id;
        $scope.formData_customer.token = $scope.$root.token;
        $scope.formData_customer.tab_id_2 = 66;
        $scope.formData.sale_selling_checks = $scope.formData.sale_selling_check !== undefined ? $scope.formData.sale_selling_check.id : 0;


        //
        //  console.log(formData_customer);	return;
        $http
                .post(updateUrl, formData_customer)
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', res.data.info, res.data.msg);

                        if (res.data.tab_change == 'tab_sale_cancel') {
                            $scope.get_sale();
                            // $scope.sale_list_cancel= false;   
                            $('#model_btn_cs').modal('hide');
                        }
                    } else {
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    }
                });
    };
    $scope.checkDiscountOnValue = false;
    $scope.setDiscountOn = function (discount) {
        if (discount == "NA") {
            $scope.checkDiscountOnValue = false;
        } else {
            $scope.checkDiscountOnValue = true;
        }
    };

    $scope.getDiscountOnValue = function () {
        return $scope.checkDiscountOnValue;
    };
    $scope.shownew = function (classname) {
        //  console.log(classname);

        // $scope.add_row_table = false;
        $(".new_button_" + classname).hide();
        $(".replace_button_" + classname).show();
        //   $(".new_" + classname).removeAttr("disabled");
        var count = 0;
        // alert(bool);
        angular.forEach($scope.selection_record, function (item) {

            //  angular.element('#selected_'+item.id).click();
            if (item.price != null || $scope.getDiscountOnValue()) {
                //var bool = document.getElementById("selected_" + item.id).checked;
                var bool = angular.element("#selected_" + item.id).is(':checked');
                if (bool) {
                    count++;
                } else {
                    angular.element('#selecctall').prop('checked', false);
                }
            }
        });
        if (count == 0) {
            $('.pic_block').attr("disabled", true);
        } else {
            $('.pic_block').attr("disabled", false);
        }
    };

    $scope.shownew_get = function (classname) {
        //  console.log(classname);
        // $scope.add_row_table = false;
        $(".new_button_" + classname).hide();
        $(".replace_button_" + classname).show();
        //   $(".new_" + classname).removeAttr("disabled");
        var count = 0;
        // alert(bool);
        angular.forEach($scope.selection_record_get, function (item) {
            //  angular.element('#selected_'+item.id).click();
            if (item.price != null || $scope.checkDiscountOn()) {

                //var bool = document.getElementById("selected_" + item.id).checked;
                var bool = angular.element("#selected_" + item.id).is(':checked');

                if (bool) {
                    count++;
                } else {
                    angular.element('#selecctall_2').prop('checked', false);
                }
            }
        });
        if (count == 0) {
            $('.pic_block').attr("disabled", true);
        } else {
            $('.pic_block').attr("disabled", false);
        }
    };


    $scope.get_sale = function () {


        //	$scope.sale_selling_check = $scope.list_discount_on[0];
        //	$scope.formData.sale_unit_cost =	$scope.sale_unit_cost ;	 
        //	console.log($scope.sale_selling_check); 

        $.each($scope.list_discount_on, function (index, obj) {
            //	console.log(obj.value == 'Customer  Individual Price'); 
            if (obj.value == 'Customer  Individual Price') {
                $scope.formData.sale_selling_check = $scope.list_discount_on[index];
            }
        });

        $scope.customers_list = true;
        $("#sale_id").val('');
        $scope.sale_id = '';
        $scope.formData.sale_id = '';
        $scope.formData.s_start_date = '';
        $scope.formData.s_end_date = '';

        $scope.formData.sale_selling_check = '';
        $scope.formData.sale_selling_price = '';
        $scope.formData.supplier_type = '';
        $scope.formData.discount_value = '';
        $scope.formData.discount_price = '';

        $scope.formData.sale_name = '';
        document.getElementById("display_record").innerHTML = '';
        $scope.formData.sale_name_id = '';


        $scope.$root.breadcrumbs =
                [//{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
                    {'name': 'Setup', 'url': '#', 'isActive': false}, {'name': 'Services', 'url': '#', 'isActive': false}, {'name': 'Manage', 'url': 'app.services', 'isActive': false},
                    {'name':  $scope.$root.model_code, 'url': '#', 'isActive': false},
                    {'name': 'Promotion Discount', 'url': '#', 'isActive': false}];

        $scope.sale_selling_check = $scope.list_discount_on[0];
        var product_id = $stateParams.id;

        $scope.show_sale_list = true;
        $scope.show_sale_form = true;


        $scope.columns = [];
        var postData = {};
        var postUrl = $scope.$root.setup + "service/products-listing/sale-list";
        postData = {
            'token': $scope.$root.token,
            'all': "1",
            'product_id': product_id
        };
        $http
                .post(postUrl, postData)
                .then(function (res) {
                    if (res.data.response != null) {
                        $scope.sale_list = res.data.response;

                        angular.forEach(res.data.response[0], function (val, index) {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
                    }

                });
    }

    $scope.fn_sale_Form = function () {
        $scope.customers_list = true;
        $("#sale_id").val('');
        $scope.sale_id = '';
        $scope.formData.sale_id = '';
        $scope.formData.sale_code = '';
        $scope.formData.sale_name = '';
        $scope.formData.discount_value = '';
        $scope.formData.s_start_date = '';
        $scope.formData.s_end_date = '';
        $scope.formData.sale_selling_check = '';
        $scope.formData.sale_selling_price = '';
        $scope.formData.discount_value = '';
        $scope.formData.discount_price = '';

        $scope.show_sale_form = true;
        $scope.show_sale_list = false;

        /*$scope.perreadonly = true;
         $scope.check_item_readonly = false;
         */

        //	 $("#event_date").val(''); $("#event_name").val(''); $("#event_code").val(''); $("#event_description").val('');
    }

    $scope.add_sale = function (formData) {

        $scope.formData.product_id = $scope.$root.product_id;
        $scope.formData.token = $scope.$root.token;
        $scope.formData.tab_id_2 = 6;
        $scope.formData.sale_id = $scope.sale_id;
        $scope.formData.sale_selling_checks = $scope.formData.sale_selling_check !== undefined ? $scope.formData.sale_selling_check.id : 0;

        $scope.formData.supplier_types = $scope.formData.supplier_type !== undefined ? $scope.formData.supplier_type.id : 0;
        //	console.log($scope.formData);return;	 
        $http
                .post(updateUrl, $scope.formData)
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', res.data.info, res.data.msg);
                        if (res.data.tab_change == 'tab_sale') {
                            $scope.get_sale();
                        }
                    } else {
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    }
                });
    }

    $scope.show_sale_edit_form = function (id) {
        $scope.customers_list = false;
        $scope.showLoader = true;

        $scope.show_sale_form = true;
        $scope.show_sale_list = true;
        $scope.required_checked = false;



        /*	$scope.check_item_readonly = false;
         $scope.perreadonly = true; 
         */

        var postUrl = $scope.$root.setup + "service/products-listing/sale-by-id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };

        $scope.formData.sale_id = id;
        $scope.sale_id = id;
        $timeout(function () {
            $http
                    .post(postUrl, postViewBankData)
                    .then(function (res) {
                        //$scope.formData = res.data.response; 

                        document.getElementById("display_record").innerHTML = res.data.response.supplier_name;


                        if (res.data.response.start_date == 0)
                        {
                            $scope.formData.s_start_date = null;
                        } else
                        {
                            $scope.formData.s_start_date = $scope.$root.convert_unix_date_to_angular(res.data.response.start_date);
                        }


                        if (res.data.response.end_date == 0)
                        {
                            $scope.formData.s_end_date = null;
                        } else
                        {
                            $scope.formData.s_end_date = $scope.$root.convert_unix_date_to_angular(res.data.response.end_date);
                        }



                        $scope.formData.chk = res.data.response.sale_selling_check;

                        $scope.formData.sale_selling_check = res.data.response.sale_selling_check;
                        $scope.formData.sale_selling_price = res.data.response.sale_selling_price;
                        $scope.formData.sale_unit_cost = res.data.response.supplier_unit_cost;
                        $.each($scope.list_type, function (index, obj) {
                            if (obj.id == res.data.response.supplier_type) {
                                $scope.formData.supplier_type = $scope.list_type[index];
                            }
                        });


                        $.each($scope.list_discount_on, function (index, obj) {
                            if (obj.id == res.data.response.sale_selling_check) {
                                $scope.formData.sale_selling_check = $scope.list_discount_on[index];
                            }
                        });


                        $scope.formData.discount_value = parseFloat(res.data.response.discount_value);
                        $scope.formData.discount_price = res.data.response.discount_price;

                        $scope.required_checked = false;
                        //	console.log($scope.formData.sale_selling_check);
                        if ($scope.formData.sale_selling_check == 1)
                        {
                            $scope.selected_discount_on = true;
                            $scope.required_checked = true;
                        }
                        //$scope.selected_discount_on  = false;
                        //	$scope.required_checked = false;


                    });

            $scope.showLoader = false;
        }, 1000);


    }

    $scope.delete_sale = function (id, index, arr_data) {

        var delUrl = $scope.$root.setup + "service/products-listing/delete-sale";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                    .post(delUrl, {id: id, 'token': $scope.$root.token})
                    .then(function (res) {
                        if (res.data.ack == true) {
                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                            arr_data.splice(index, 1);
                        } else {
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                        }
                    });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

// ------------- 	 Sale	 ----------------------------------------



// ------------- 	   add  volume pop type   	 ----------------------------------------

    var volumeUrl = $scope.$root.setup + "service/products-listing/get-price-offer-volume-by-type";
    var add_saleUrl = $scope.$root.setup + "service/products-listing/add-service-price-offer-volumes";

    $scope.onChange_vol_1 = function () {

        var id = this.formData.volume_1.id;
        //console.log(id );
        if (id == -1)
        {
            // $scope.show_vol_1_pop= true;   
            // angular.element('#model_btn_vol_1').click();  
            $('#model_vol_1').modal({show: true});
        }

        $("#name").val('');
        $("#description").val('');
        $scope.formData_vol_purchase_1.name = '';
        $scope.formData_vol_purchase_1.description = '';
    }
    $scope.add_vol1_type = function (formData_vol_1) {

        $scope.formData_vol_1.token = $scope.$root.token;
        $scope.formData_vol_1.type = 1;

        $http
                .post(add_saleUrl, formData_vol_1)
                .then(function (res) {
                    if (res.data.ack == true) {

                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                        // $scope.show_vol_1_pop = false; 

                        $('#model_vol_1').modal('hide');
                        $http
                                .post(volumeUrl, {type: 'Volume 1', 'token': $scope.$root.token})
                                .then(function (vol_data) {

                                    $scope.arr_volume_1 = vol_data.data.response;

                                    $.each($scope.arr_volume_1, function (index, elem) {
                                        if (elem.description == formData_vol_1.description)
                                            $scope.formData.volume_1 = elem;
                                    });
                                    if ($scope.user_type == 1)
                                        $scope.arr_volume_1.push({'id': '-1', 'description': '++ Add New ++'});

                                });

                    } else
                        toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
                });
    }

    $scope.onChange_vol_2 = function () {
        var id = this.formData.volume_2.id;

        if (id == -1)
        {
            //	 $scope.show_vol_2_pop= true;   
            //	 angular.element('#model_btn_vol_2').click();   
            $('#model_vol_2').modal({show: true});
        }

        $("#name").val('');
        $("#description").val('');
        $scope.formData_vol_purchase_2.name = '';
        $scope.formData_vol_purchase_2.description = '';
    }
    $scope.add_vol2_type = function (formData_vol_2) {

        $scope.formData_vol_2.token = $scope.$root.token;
        $scope.formData_vol_2.type = 2;

        $http
                .post(add_saleUrl, formData_vol_2)
                .then(function (res) {
                    if (res.data.ack == true) {

                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                        //  $scope.show_vol_2_pop = false; 
                        $('#model_vol_2').modal('hide');
                        $http
                                .post(volumeUrl, {type: 'Volume 2', 'token': $scope.$root.token})
                                .then(function (vol_data) {
                                    $scope.arr_volume_2 = vol_data.data.response;

                                    $.each($scope.arr_volume_2, function (index, elem) {
                                        if (elem.description == formData_vol_2.description)
                                            $scope.formData.volume_2 = elem;
                                    });
                                    if ($scope.user_type == 1)
                                        $scope.arr_volume_2.push({'id': '-1', 'description': '++ Add New ++'});

                                });
                    } else
                        toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
                });
    }

    $scope.onChange_vol_3 = function () {

        var id = this.formData.volume_3.id;
        //console.log(id );
        if (id == -1)
        {
            // $scope.show_vol_3_pop= true;   
            // angular.element('#model_btn_vol_3').click();  
            $('#model_vol_3').modal({show: true});
        }

        $("#name").val('');
        $("#description").val('');
        $scope.formData_vol_purchase_3.name = '';
        $scope.formData_vol_purchase_3.description = '';
    }
    $scope.add_vol3_type = function (formData_vol_3) {

        $scope.formData_vol_3.token = $scope.$root.token;
        $scope.formData_vol_3.type = 3;

        $http
                .post(add_saleUrl, formData_vol_3)
                .then(function (res) {
                    if (res.data.ack == true) {

                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                        //  $scope.show_vol_3_pop = false; 
                        $('#model_vol_3').modal('hide');
                        $http
                                .post(volumeUrl, {type: 'Volume 3', 'token': $scope.$root.token})
                                .then(function (vol_data) {

                                    $scope.arr_volume_3 = vol_data.data.response;

                                    $.each($scope.arr_volume_3, function (index, elem) {
                                        if (elem.description == formData_vol_3.description)
                                            $scope.formData.volume_3 = elem;
                                    });
                                    if ($scope.user_type == 1)
                                        $scope.arr_volume_3.push({'id': '-1', 'description': '++ Add New ++'});


                                });

                    } else
                        toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
                });
    }

// ------------- 	   add  volume pop type   	 ----------------------------------------

// ------------- 	 Supplier Tab	 ----------------------------------------

    $scope.arr_volume_1 = [];
    $scope.arr_volume_2 = [];
    $scope.arr_volume_3 = [];
    $scope.selected = 0;
    $scope.total = 0;
    $scope.selected_count = 0;
    $scope.show_symbol = false;


    $scope.list_type = [{name: 'Percentage', id: 1}, {name: 'Value', id: 2}];

    $http
            .post(volumeUrl, {type: 'Volume 1', 'token': $scope.$root.token})
            .then(function (vol_data) {
                $scope.arr_volume_1 = vol_data.data.response;
                if ($scope.user_type == 1)
                {
                    $scope.arr_volume_1.push({'id': '-1', 'description': '++ Add New ++'});
                }
                //	$scope.arr_volume_1.push(vol_data.data.response);
            });

    $http
            .post(volumeUrl, {type: 'Volume 2', 'token': $scope.$root.token})
            .then(function (vol_data) {
                $scope.arr_volume_2 = vol_data.data.response;
                if ($scope.user_type == 1)
                {
                    $scope.arr_volume_2.push({'id': '-1', 'description': '++ Add New ++'});
                }
            });

    $http
            .post(volumeUrl, {type: 'Volume 3', 'token': $scope.$root.token})
            .then(function (vol_data) {
                $scope.arr_volume_3 = vol_data.data.response;
                if ($scope.user_type == 1)
                {
                    $scope.arr_volume_3.push({'id': '-1', 'description': '++ Add New ++'});
                }
            });

    $scope.show_price_one = function (arg) {

        var price = 0;
        var final_price = 0;

        if (arg == 1) {
            price = $scope.formData.purchase_price_1;

            var f_id = this.formData.supplier_type_1.id;

            if (f_id == 1)
            {
                final_price_one = (parseFloat($scope.formData.discount_value_1)) * (parseFloat(price)) / 100;

                final_price = (parseFloat(price)) - (parseFloat(final_price_one));

            } else if (f_id == 2)
            {
                final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value_1));
            }

            var final_new = (Math.round(final_price * 100) / 100).toFixed(2);
            if (final_new != 'NaN')
                $scope.formData.discount_price_1 = final_new;
        }

        if (arg == 2) {
            price = $scope.formData.purchase_price_2;
            var f_id = this.formData.supplier_type_2.id;
            if (f_id == 1)
            {
                final_price_one = (parseFloat($scope.formData.discount_value_2)) * (parseFloat(price)) / 100;

                final_price = (parseFloat(price)) - (parseFloat(final_price_one));
            } else if (f_id == 2)
            {
                final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value_2));
            }

            var final_new = (Math.round(final_price * 100) / 100).toFixed(2);
            if (final_new != 'NaN')
                $scope.formData.discount_price_2 = final_new;

        }

        if (arg == 3) {
            price = $scope.formData.purchase_price_3;
            var f_id = this.formData.supplier_type_3.id;


            if (f_id == 1)
            {
                final_price_one = (parseFloat($scope.formData.discount_value_3)) * (parseFloat(price)) / 100;
                final_price = (parseFloat(price)) - (parseFloat(final_price_one));
            } else if (f_id == 2)
            {
                final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value_3));
            }
            var final_new = (Math.round(final_price * 100) / 100).toFixed(2);
            if (final_new != 'NaN')
                $scope.formData.discount_price_3 = final_new;

        }

    }

    $scope.getsupplier = function () {


        $scope.purchase_price_1 = $scope.formData.standard_price;
        $scope.purchase_price_2 = $scope.formData.standard_price;
        $scope.purchase_price_3 = $scope.formData.standard_price;
        $("#display_record").val('');

        $("#sp_id").val('');
        $scope.sp_id = '';

        $scope.formData.volume_1 = '';
        $scope.formData.supplier_type_1 = '';
        $scope.formData.discount_value_1 = '';
        $scope.formData.discount_price_1 = 0;

        $scope.formData.volume_2 = '';
        $scope.formData.supplier_type_2 = '';
        $scope.formData.discount_value_2 = '';
        $scope.formData.discount_price_2 = 0;
        $scope.formData.volume_3 = '';
        $scope.formData.supplier_type_3 = '';
        $scope.formData.discount_value_3 = '';
        $scope.formData.discount_price_3 = 0;

        $scope.formData.start_date = '';
        $scope.formData.end_date = '';

        $scope.$root.breadcrumbs =
                [//{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
                    {'name': 'Setup', 'url': '#', 'isActive': false}, {'name': 'Services', 'url': '#', 'isActive': false}, {'name': 'Manage', 'url': 'app.services', 'isActive': false},
                    {'name':  $scope.$root.model_code, 'url': '#', 'isActive': false},
                    {'name': 'Sales Volume Discount', 'url': '#', 'isActive': false}];

        var product_id = $stateParams.id;

        $scope.show_supplier_list = true;
        $scope.show_supp_form = true;

        $scope.perreadonly = true;
        $scope.check_item_readonly = false;

        $scope.columns = [];
        var postData = {};

        var postUrl = $scope.$root.setup + "service/products-listing/supplier-list";
        postData = {
            'token': $scope.$root.token,
            'all': "1",
            'product_id': product_id
        };

        $http
                .post(postUrl, postData)
                .then(function (res) {
                    if (res.data.response != null) {
                        $scope.supplier_list = res.data.response;
                        angular.forEach(res.data.response[0], function (val, index) {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
                    }
                });

    }

    $scope.fn_supplier_Form = function () {

        $scope.show_supp_form = true;
        $scope.show_supplier_list = false;

        /*$scope.perreadonly = true;
         $scope.check_item_readonly = false;
         */
        $scope.purchase_price_1 = $scope.formData.standard_price;

        $scope.purchase_price_2 = $scope.formData.standard_price;

        $scope.purchase_price_3 = $scope.formData.standard_price;


        $("#sp_id").val('');
        $scope.sp_id = '';

        $scope.formData.volume_1 = '';
        $scope.formData.supplier_type_1 = '';
        $scope.formData.discount_value_1 = '';
        $scope.formData.discount_price_1 = 0;

        $scope.formData.volume_2 = '';
        $scope.formData.supplier_type_2 = '';
        $scope.formData.discount_value_2 = '';
        $scope.formData.discount_price_2 = 0;
        $scope.formData.volume_3 = '';
        $scope.formData.supplier_type_3 = '';
        $scope.formData.discount_value_3 = '';
        $scope.formData.discount_price_3 = 0;

        $scope.formData.start_date = '';
        $scope.formData.end_date = '';
        //	 $("#event_date").val(''); $("#event_name").val(''); $("#event_code").val(''); $("#event_description").val('');
    }

    $scope.add_supplier = function (formData) {

        $scope.formData.product_id = $scope.$root.product_id;
        $scope.formData.token = $scope.$root.token;
        $scope.formData.tab_id_2 = 4;
        $scope.formData.sp_id = $scope.sp_id;

        $scope.formData.volume_ids = $scope.formData.volume_id !== undefined ? $scope.formData.volume_id.id : 0;
        $scope.formData.supplier_types = $scope.formData.supplier_type_11 !== undefined ? $scope.formData.supplier_type_11.id : 0;

        $scope.formData.volume_1s = $scope.formData.volume_1 !== undefined ? $scope.formData.volume_1.id : 0;
        $scope.formData.supplier_type_1s = $scope.formData.supplier_type_1 !== undefined ? $scope.formData.supplier_type_1.id : 0;

        $scope.formData.volume_2s = $scope.formData.volume_2 !== undefined ? $scope.formData.volume_2.id : 0;
        $scope.formData.supplier_type_2s = $scope.formData.supplier_type_2 !== undefined ? $scope.formData.supplier_type_2.id : 0;

        $scope.formData.volume_3s = $scope.formData.volume_3 !== undefined ? $scope.formData.volume_3.id : 0;
        $scope.formData.supplier_type_3s = $scope.formData.supplier_type_3 !== undefined ? $scope.formData.supplier_type_3.id : 0;


        $http
                .post(updateUrl, $scope.formData)
                .then(function (res) {
                    if (res.data.ack == true) {

                        if (res.data.tab_change == 'tab_supplier') {
                            $scope.getsupplier();
                            // $scope.show_supplier_pop= false;  
                            angular.element('#model_btn_supplier').modal('hide');
                            toaster.pop('success', res.data.info, res.data.msg);
                        }
                    } else {
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    }
                });
    }

    $scope.show_sp_edit_form = function (id) {


        $scope.show_supp_form = true;
        $scope.show_supplier_list = true;

        /*	$scope.check_item_readonly = false;
         $scope.perreadonly = true; 
         */

        var postUrl = $scope.$root.setup + "service/products-listing/supplier-by-id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };

        $scope.formData.sp_id = id;
        $scope.sp_id = id;

        $http
                .post(postUrl, postViewBankData)
                .then(function (res) {

                    if (res.data.response.start_date == 0)
                    {
                        $scope.formData.start_date = null;
                    } else
                    {
                        $scope.formData.start_date = $scope.$root.convert_unix_date_to_angular(res.data.response.start_date);
                    }


                    if (res.data.response.end_date == 0)
                    {
                        $scope.formData.end_date = null;
                    } else
                    {
                        $scope.formData.end_date = $scope.$root.convert_unix_date_to_angular(res.data.response.end_date);
                    }

                    $scope.formData.discount_value = res.data.response.discount_value;

                    $.each($scope.list_type, function (index, obj) {
                        if (obj.id == res.data.response.supplier_type) {
                            $scope.formData.supplier_type = $scope.list_type[index];
                        }
                    });



                    $.each($scope.arr_volume_1, function (index, obj) {
                        if (obj.id == res.data.response.volume_1) {
                            $scope.formData.volume_1 = $scope.arr_volume_1[index];
                        }
                    });


                    $.each($scope.arr_volume_2, function (index, obj) {
                        if (obj.id == res.data.response.volume_2) {
                            $scope.formData.volume_2 = $scope.arr_volume_2[index];
                        }
                    });

                    $.each($scope.arr_volume_3, function (index, obj) {
                        if (obj.id == res.data.response.volume_3) {
                            $scope.formData.volume_3 = $scope.arr_volume_3[index];
                        }
                    });



                });
    }

    $scope.delete_sp = function (id, index, arr_data) {

        var delUrl = $scope.$root.setup + "service/products-listing/delete-sp";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                    .post(delUrl, {id: id, 'token': $scope.$root.token})
                    .then(function (res) {
                        if (res.data.ack == true) {
                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                            arr_data.splice(index, 1);
                        } else {
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                        }
                    });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    $scope.show_price_one_pop = function () {
        var price = 0;
        var final_price = 0;

        price = $scope.formData.purchase_price_11;

        var f_id = this.formData.supplier_type_11.id;

        if (f_id == 1)
        {
            final_price_one = (parseFloat($scope.formData.discount_value_11)) * (parseFloat(price)) / 100;

            final_price = (parseFloat(price)) - (parseFloat(final_price_one));

        } else if (f_id == 2)
        {
            final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value_11));
        }

        //  console.log( final_price);
        $scope.formData.discount_price_11 = final_price;
    }

    $scope.setSymbol_pop = function (div_id) {
        //var id = this.formData.div_id.id; 
        // var id =document.getElementById("type_"+div_id).value; 
        var id = $('#type_' + div_id).val();
        // console.log(id); console.log("#type_"+div_id); console.log(div_id);

        if (id == 0)
            //$scope.show_symbol = true;
            $('#date_msg_' + div_id).show();
        else
            //$scope.show_symbol = false;
            $('#date_msg_' + div_id).hide();
    }

    $scope.supplier_pop = function (id) {

        $scope.list_type = [{'name': 'Percentage', 'id': 1}, {'name': 'Value', 'id': 2}];

        // $scope.show_supplier_pop= true;   
        /* angular.element('#model_btn_supplier_id').click();
         */
        // console.log( id);
        $('#model_btn_supplier').modal({
            show: true
        });

        var postUrl = $scope.$root.setup + "service/products-listing/supplier-by-id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };

        $scope.formData.sp_id = id;
        $scope.sp_id = id;

        $http
                .post(postUrl, postViewBankData)
                .then(function (res) {

                    $scope.formData.volume_1 = res.data.response.volume_1;
                    $scope.formData.volume_2 = res.data.response.volume_2;
                    $scope.formData.volume_3 = res.data.response.volume_3;

                    $scope.formData.purchase_price_11 = res.data.response.purchase_price;
                    $scope.formData.discount_value_11 = parseFloat(res.data.response.discount_value);
                    $scope.formData.discount_price_11 = res.data.response.discount_price;

                    //	console.log(discount_value);

                    /*	if(res.data.response.start_date ==0)
                     { $scope.formData.start_date=null;   }
                     else
                     {  	$scope.formData.start_date= $scope.$root.convert_unix_date_to_angular(res.data.response.start_date);   }
                     
                     
                     if(res.data.response.end_date ==0)
                     { $scope.formData.end_date=null;   }
                     else
                     {  	$scope.formData.end_date= $scope.$root.convert_unix_date_to_angular(res.data.response.end_date);   }
                     */

                    $.each($scope.list_type, function (index, obj) {
                        if (obj.id == res.data.response.supplier_type) {
                            $scope.formData.supplier_type_11 = $scope.list_type[index];
                        }
                    });

                    $.each($scope.arr_volume_1, function (index, obj) {
                        if (obj.id == res.data.response.volume_id) {
                            $scope.formData.volume_id = $scope.arr_volume_1[index];
                            //	console.log($scope.formData.volume_id);
                        }
                    });

                    $.each($scope.arr_volume_2, function (index, obj) {
                        if (obj.id == res.data.response.volume_id) {
                            $scope.formData.volume_id = $scope.arr_volume_2[index];
                        }
                    });

                    $.each($scope.arr_volume_3, function (index, obj) {
                        if (obj.id == res.data.response.volume_id) {
                            $scope.formData.volume_id = $scope.arr_volume_3[index];
                        }
                    });

                });


    }


//--------------------   Supplier End--------------------



    // ------------- 	 Purchase  	 ----------------------------------------


    $scope.arr_volume_purchase_1 = [];
    $scope.arr_volume_purchase_2 = [];
    $scope.arr_volume_purchase_3 = [];

    $scope.formData_vol_purchase_1 = {};
    $scope.formData_vol_purchase_2 = {};
    $scope.formData_vol_purchase_3 = {};

//--------------------   add Purchase volume pop type --------------------

    var volumepurchase_Url = $scope.$root.setup + "service/products-listing/get-purchase-offer-volume-by-type";
    var add_purchaseUrl = $scope.$root.setup + "service/products-listing/add-purchase-offer-volume";

    $scope.onChange_vol_purchase_1 = function () {

        var id = this.formData.volume_1_purchase.id;

        if (id == -1)
        {
            // $scope.show_vol_purchase_1_pop= true;   
            // angular.element('#model_btn_vol_purchase_1').click();  
            $('#model_vol_purchase_1').modal({show: true});
        }


        $("#name").val('');
        $("#description").val('');
        $scope.formData_vol_purchase_1.name = '';
        $scope.formData_vol_purchase_1.description = '';
    }
    $scope.add_vol_purchase_type_1 = function (formData_vol_purchase_1) {

        $scope.formData_vol_purchase_1.token = $scope.$root.token;
        $scope.formData_vol_purchase_1.type = 1;

        $http
                .post(add_purchaseUrl, $scope.formData_vol_purchase_1)
                .then(function (res) {
                    if (res.data.ack == true) {


                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                        $('#model_vol_purchase_1').modal('hide');
                        //  $scope.show_vol_purchase_1_pop = false; 

                        $http
                                .post(volumepurchase_Url, {type: 'Volume 1', 'token': $scope.$root.token})
                                .then(function (vol_data) {
                                    $scope.arr_volume_purchase_1 = vol_data.data.response;
                                    $.each($scope.arr_volume_purchase_1, function (index, elem) {
                                        if (elem.description == formData_vol_purchase_1.description)
                                            $scope.formData.volume_1_purchase = elem;
                                    });
                                    if ($scope.user_type == 1)
                                        $scope.arr_volume_purchase_1.push({'id': '-1', 'description': '++ Add New ++'});

                                });

                    } else
                        toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
                });
    }

    $scope.onChange_vol_purchase_2 = function () {

        var id = this.formData.volume_2_purchase.id;
        //console.log(id );
        if (id == -1)
        {
            // $scope.show_vol_purchase_2_pop= true;   
            //	 angular.element('#model_btn_vol_purchase_2').click();  
            $('#model_vol_purchase_2').modal({show: true});
        }


        $("#name").val('');
        $("#description").val('');
        $scope.formData_vol_purchase_2.name = '';
        $scope.formData_vol_purchase_2.description = '';
    }
    $scope.add_vol_purchase_type_2 = function (formData_vol_purchase_2) {


        $scope.formData_vol_purchase_2.token = $scope.$root.token;
        $scope.formData_vol_purchase_2.type = 2;

        $http
                .post(add_purchaseUrl, formData_vol_purchase_2)
                .then(function (res) {
                    if (res.data.ack == true) {


                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                        //  $scope.show_vol_purchase_2_pop = false; 
                        $('#model_vol_purchase_2').modal('hide');

                        $http
                                .post(volumepurchase_Url, {type: 'Volume 2', 'token': $scope.$root.token})
                                .then(function (vol_data) {
                                    $scope.arr_volume_purchase_2 = [];
                                    $scope.arr_volume_purchase_2 = vol_data.data.response;

                                    $.each($scope.arr_volume_purchase_2, function (index, elem) {
                                        if (elem.description == formData_vol_purchase_2.description)
                                            $scope.formData.volume_2_purchase = elem;
                                    });
                                    if ($scope.user_type == 1)
                                        $scope.arr_volume_purchase_2.push({'id': '-1', 'description': '++ Add New ++'});

                                });

                    } else
                        toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
                });
    }

    $scope.onChange_vol_purchase_3 = function () {

        var id = this.formData.volume_3_purchase.id;
        //console.log(id );
        if (id == -1)
        {
            // $scope.show_vol_purchase_3_pop= true;   
            // angular.element('#model_btn_vol_purchase_3').click();  
            $('#model_vol_purchase_3').modal({show: true});
        }


        $("#name").val('');
        $("#description").val('');
        $scope.formData_vol_purchase_3.name = '';
        $scope.formData_vol_purchase_3.description = '';
    }
    $scope.add_vol_purchase_type_3 = function (formData_vol_purchase_3) {


        $scope.formData_vol_purchase_3.token = $scope.$root.token;
        $scope.formData_vol_purchase_3.type = 3;

        $http
                .post(add_purchaseUrl, formData_vol_purchase_3)
                .then(function (res) {
                    if (res.data.ack == true) {


                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                        // $scope.show_vol_purchase_3_pop = false; 
                        $('#model_vol_purchase_3').modal('hide');

                        $http
                                .post(volumepurchase_Url, {type: 'Volume 3', 'token': $scope.$root.token})
                                .then(function (vol_data) {
                                    $scope.arr_volume_purchase_3 = [];
                                    $scope.arr_volume_purchase_3 = vol_data.data.response;
                                    $.each($scope.arr_volume_purchase_3, function (index, elem) {
                                        if (elem.description == formData_vol_purchase_3.description)
                                            $scope.formData.volume_3_purchase = elem;
                                    });
                                    if ($scope.user_type == 1)
                                        $scope.arr_volume_purchase_3.push({'id': '-1', 'description': '++ Add New ++'});

                                });

                    } else
                        toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
                });
    }


// ------------- 	   add Purchase volume pop type   	 ----------------------------------------

    $scope.arr_volume_purchase_1 = [];
    $scope.arr_volume_purchase_2 = [];
    $scope.arr_volume_purchase_3 = [];

    $http
            .post(volumepurchase_Url, {type: 'Volume 1', 'token': $scope.$root.token})
            .then(function (vol_data) {
                $scope.arr_volume_purchase_1 = vol_data.data.response;
                if ($scope.user_type == 1)
                {
                    $scope.arr_volume_purchase_1.push({'id': '-1', 'description': '++ Add New ++'});
                }
            });

    $http
            .post(volumepurchase_Url, {type: 'Volume 2', 'token': $scope.$root.token})
            .then(function (vol_data) {
                $scope.arr_volume_purchase_2 = vol_data.data.response;
                if ($scope.user_type == 1)
                {
                    $scope.arr_volume_purchase_2.push({'id': '-1', 'description': '++ Add New ++'});
                }
            });

    $http
            .post(volumepurchase_Url, {type: 'Volume 3', 'token': $scope.$root.token})
            .then(function (vol_data) {
                $scope.arr_volume_purchase_3 = vol_data.data.response;
                if ($scope.user_type == 1)
                {
                    $scope.arr_volume_purchase_3.push({'id': '-1', 'description': '++ Add New ++'});
                }
            });


    $scope.show_purchase_one = function (arg) {
        console.log("Purchase Form Data::");
console.log($scope.formData);
        var price = 0;
        var final_price = 0;

        if (arg == 1) {
            price = $scope.formData.p_price_1;
            var f_id = this.formData.purchase_type_1.id;
            if (f_id == 1)
            {
                final_price_one = (parseFloat($scope.formData.p_discount_value_1)) * (parseFloat(price)) / 100;
                final_price = (parseFloat(price)) - (parseFloat(final_price_one))

            } else if (f_id == 2)
            {
                final_price = (parseFloat(price)) - (parseFloat($scope.formData.p_discount_value_1))
            }

            var final_new = (Math.round(final_price * 100) / 100).toFixed(2);
            if (final_new != 'NaN')
                $scope.formData.discount_p_1 = final_new;
        }

        if (arg == 2) {
            price = $scope.formData.p_price_2;
            var f_id = this.formData.purchase_type_2.id;
            if (f_id == 1)
            {
                final_price_one = (parseFloat($scope.formData.p_discount_value_2)) * (parseFloat(price)) / 100;
                final_price = (parseFloat(price)) - (parseFloat(final_price_one))

            } else if (f_id == 2)
            {
                final_price = (parseFloat(price)) - (parseFloat($scope.formData.p_discount_value_2))
            }

            var final_new = (Math.round(final_price * 100) / 100).toFixed(2);
            if (final_new != 'NaN')
                $scope.formData.discount_p_2 = final_new;
        }

        if (arg == 3) {
            price = $scope.formData.p_price_3;
            var f_id = this.formData.purchase_type_3.id;

            if (f_id == 1)
            {
                final_price_one = (parseFloat($scope.formData.p_discount_value_3)) * (parseFloat(price)) / 100;
                final_price = (parseFloat(price)) - (parseFloat(final_price_one))

            } else if (f_id == 2)
            {
                final_price = (parseFloat(price)) - (parseFloat($scope.formData.p_discount_value_3))
            }

            var final_new = (Math.round(final_price * 100) / 100).toFixed(2);
            if (final_new != 'NaN')
                $scope.formData.discount_p_3 = final_new;


        }

    }


    $scope.getpurchase = function () {


        $scope.p_price_1 = $scope.formData.unit_cost;
        $scope.p_price_2 = $scope.formData.unit_cost;
        $scope.p_price_3 = $scope.formData.unit_cost;

        $("#pr_id").val('');
        $scope.pr_id = '';

        $scope.formData.volume_1_purchase = '';
        $scope.formData.purchase_type_1 = '';
        $scope.formData.discount_value_1 = '';
        $scope.formData.discount_p_1 = 0;

        $scope.formData.volume_2_purchase = '';
        $scope.formData.purchase_type_2 = '';
        $scope.formData.discount_value_2 = '';
        $scope.formData.discount_p_2 = 0;

        $scope.formData.volume_3_purchase = '';
        $scope.formData.purchase_type_3 = '';
        $scope.formData.discount_value_3 = '';
        $scope.formData.discount_p_3 = 0;

        $scope.formData.p_start_date = '';
        $scope.formData.p_end_date = '';

        $scope.$root.breadcrumbs =
                [//{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
                    {'name': 'Setup', 'url': '#', 'isActive': false}, {'name': 'Services', 'url': '#', 'isActive': false}
                    , {'name': 'Manage', 'url': 'app.services', 'isActive': false},
                    {'name':  $scope.$root.model_code, 'url': '#', 'isActive': false},
                    {'name': 'Purchase Volume Discount', 'url': '#', 'isActive': false}];


        var product_id = $stateParams.id;

        $scope.showLoader = true;

        $scope.show_purchase_list = true;
        $scope.show_purchase_form = true;

        $scope.perreadonly = true;
        /*	$scope.check_item_readonly = false;
         $scope.perreadonly = true; 
         */

        $scope.columns_p = [];
        var postData = {};

        var vm = this;
        var postUrl = $scope.$root.setup + "service/products-listing/purchase-list";
        postData = {
            'token': $scope.$root.token,
            'all': "1",
            'product_id': product_id
        };

        //	$timeout(function(){

        $http
                .post(postUrl, postData)
                .then(function (res) {
                    if (res.data.response != null) {
                        $scope.purchase_list = res.data.response;

                        angular.forEach(res.data.response[0], function (val, index) {
                            $scope.columns_p.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
                    }
                });
        $scope.showLoader = false;
        // }, 1000);
    }

    $scope.fn_purchase_Form = function () {


        $scope.list_type = [{'name': 'Percentage', 'id': 1}, {'name': 'Value', 'id': 2}];

        $scope.show_purchase_list = true;
        $scope.show_purchase_form = false;

        $scope.perreadonly = true;
        /*	$scope.check_item_readonly = false;
         $scope.perreadonly = true; 
         */

        // unit_cost
        $scope.p_price_1 = $scope.formData.unit_cost;
        $scope.p_price_2 = $scope.formData.unit_cost;
        $scope.p_price_3 = $scope.formData.unit_cost;



        $("#pr_id").val('');
        $scope.pr_id = '';

        $scope.formData.volume_1_purchase = '';
        $scope.formData.purchase_type_1 = '';
        $scope.formData.discount_value_1 = '';
        $scope.formData.discount_p_1 = '';

        $scope.formData.volume_2_purchase = '';
        $scope.formData.purchase_type_2 = '';
        $scope.formData.discount_value_2 = '';
        $scope.formData.discount_p_2 = '';

        $scope.formData.volume_3_purchase = '';
        $scope.formData.purchase_type_3 = '';
        $scope.formData.discount_value_3 = '';
        $scope.formData.discount_p_3 = '';

        $scope.formData.p_start_date = '';
        $scope.formData.p_end_date = '';
        //	 $("#event_date").val(''); $("#event_name").val(''); $("#event_code").val(''); $("#event_description").val('');
    }

    $scope.add_purchase = function (formData) {
//	$scope.rec = {}; 
//	
//	
//								
//		  
//$scope.rec.product_id = $stateParams.id ;//$scope.$root.product_id;
//$scope.rec.token = $scope.$root.token; 
//$scope.rec.tab_id_2 = 5;
//$scope.rec.pr_id = $scope.pr_id;
//
//$scope.rec.volume_1s = $scope.formData.volume_id  !== undefined ? $scope.formData.volume_id.id :0;
//$scope.rec.purchase_types = $scope.formData.purchase_type11 !== undefined ? $scope.formData.purchase_type11.id:0;	
//$scope.rec.purchase_price_11 = $scope.formData.purchase_price_11 ;
//$scope.rec.discount_value_11 = $scope.formData.discount_value_11 ;
//$scope.rec.discount_price_11 = $scope.formData.discount_price_11 ;
//
//
//$scope.rec.volume_1_purchases = $scope.formData.volume_1_purchase  !== undefined ? $scope.formData.volume_1_purchase.id :0;
//$scope.rec.purchase_type_1s = $scope.formData.purchase_type_1 !== undefined ? $scope.formData.purchase_type_1.id:0;	
//$scope.rec.p_price_1 = $scope.formData.p_price_1 ;
//$scope.rec.discount_p_1 = $scope.formData.discount_p_1 ;
//$scope.rec.p_discount_value_1 = $scope.formData.p_discount_value_1 ;
//
//
//$scope.rec.volume_2_purchases = $scope.formData.volume_2_purchase !== undefined ? $scope.formData.volume_2_purchase.id:0;
//$scope.rec.purchase_type_2s = $scope.formData.purchase_type_2 !== undefined ? $scope.formData.purchase_type_2.id:0;	
//$scope.rec.p_price_2 = $scope.formData.p_price_2 ;
//$scope.rec.discount_p_2 = $scope.formData.discount_p_2 ;
//$scope.rec.p_discount_value_2 = $scope.formData.p_discount_value_2 ;
//
//$scope.rec.volume_3_purchases = $scope.formData.volume_3_purchase !== undefined ? $scope.formData.volume_3_purchase.id:0;
//$scope.rec.purchase_type_3s = $scope.formData.purchase_type_3!== undefined ? $scope.formData.purchase_type_3.id:0;		
//$scope.rec.p_price_3 = $scope.formData.p_price_3 ;
//$scope.rec.discount_p_3 = $scope.formData.discount_p_3 ;
//$scope.rec.p_discount_value_3 = $scope.formData.p_discount_value_3 ;
//
//
//			 $http
//		      .post(updateUrl, $scope.rec)
//		      .then(function (res) {
//		        	if(res.data.ack == true){
//					 if(res.data.tab_change=='tab_purchaser'){    
//							$scope.getpurchase(); 
//						//	 $scope.show_purchase_pop= false;    
//								$('#model_btn_purchase').modal('hide'); 
//								toaster.pop('success', res.data.info,res.data.msg);   
//					 }    
//				}
//				else{ toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));	}
//	      }); 

        $scope.rec = {};




        $scope.rec.product_id = $stateParams.id;//$scope.$root.product_id;
        $scope.rec.token = $scope.$root.token;
        $scope.rec.tab_id_2 = 5;
        $scope.rec.pr_id = $scope.pr_id;

        $scope.rec.volume_1s = $scope.formData.volume_id !== undefined ? $scope.formData.volume_id.id : 0;
        $scope.rec.purchase_types = $scope.formData.purchase_type11 !== undefined ? $scope.formData.purchase_type11.id : 0;
        $scope.rec.purchase_price_11 = $scope.formData.purchase_price_11;
        $scope.rec.discount_value_11 = $scope.formData.discount_value_11;
        $scope.rec.discount_price_11 = $scope.formData.discount_price_11;


        $scope.rec.volume_1_purchases = $scope.formData.volume_1_purchase !== undefined ? $scope.formData.volume_1_purchase.id : 0;
        $scope.rec.purchase_type_1s = $scope.formData.purchase_type_1 !== undefined ? $scope.formData.purchase_type_1.id : 0;
        $scope.rec.p_price_1 = $scope.formData.p_price_1;
        $scope.rec.discount_p_1 = $scope.formData.discount_p_1;
        $scope.rec.p_discount_value_1 = $scope.formData.p_discount_value_1;


        $scope.rec.volume_2_purchases = $scope.formData.volume_2_purchase !== undefined ? $scope.formData.volume_2_purchase.id : 0;
        $scope.rec.purchase_type_2s = $scope.formData.purchase_type_2 !== undefined ? $scope.formData.purchase_type_2.id : 0;
        $scope.rec.p_price_2 = $scope.formData.p_price_2;
        $scope.rec.discount_p_2 = $scope.formData.discount_p_2;
        $scope.rec.p_discount_value_2 = $scope.formData.p_discount_value_2;

        $scope.rec.volume_3_purchases = $scope.formData.volume_3_purchase !== undefined ? $scope.formData.volume_3_purchase.id : 0;
        $scope.rec.purchase_type_3s = $scope.formData.purchase_type_3 !== undefined ? $scope.formData.purchase_type_3.id : 0;
        $scope.rec.p_price_3 = $scope.formData.p_price_3;
        $scope.rec.discount_p_3 = $scope.formData.discount_p_3;
        $scope.rec.p_discount_value_3 = $scope.formData.p_discount_value_3;


        $scope.rec.p_start_date = $scope.formData.p_start_date;
        $scope.rec.p_end_date = $scope.formData.p_end_date;


        //	console.log($scope.rec);	


        $http
                .post(updateUrl, $scope.rec)
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', res.data.info, res.data.msg);
                        if (res.data.tab_change == 'tab_purchaser') {
                            $scope.getpurchase();
                            //	 $scope.show_purchase_pop= false;    
                            $('#model_btn_purchase').modal('hide');
                        }
                    } else {
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    }
                });
    };

    $scope.show_purchase_edit_form = function (id) {

        $scope.list_type = [{'name': 'Percentage', 'id': 1}, {'name': 'Value', 'id': 2}];

        $scope.showLoader = true;

        $scope.show_purchase_list = true;
        $scope.show_purchase_form = true;

        /*	$scope.check_item_readonly = false;
         $scope.perreadonly = true; 
         */

        var postUrl = $scope.$root.setup + "service/products-listing/purchase-by-id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };

        $scope.formData.pr_id = id;
        $scope.pr_id = id;

        //$timeout(function(){
        $http
                .post(postUrl, postViewBankData)
                .then(function (res) {
                    $scope.formData.discount_value = parseFloat(res.data.response.discount_value);

                    if (res.data.response.p_start_date == 0)
                    {
                        $scope.formData.p_start_date = null;
                    } else
                    {
                        $scope.formData.p_start_date = $scope.$root.convert_unix_date_to_angular(res.data.response.p_start_date);
                    }


                    if (res.data.response.p_end_date == 0)
                    {
                        $scope.formData.p_end_date = null;
                    } else
                    {
                        $scope.formData.p_end_date = $scope.$root.convert_unix_date_to_angular(res.data.response.p_end_date);
                    }


                    $.each($scope.list_type, function (index, obj) {
                        if (obj.id == res.data.response.purchase_type) {
                            $scope.formData.purchase_type = $scope.list_type[index];
                        }
                    });

                    $.each($scope.arr_volume_purchase_1, function (index, obj) {
                        if (obj.id == res.data.response.volume_1) {
                            $scope.formData.volume_1 = $scope.arr_volume_purchase_1[index];
                        }
                    });


                    $.each($scope.arr_volume_purchase_2, function (index, obj) {
                        if (obj.id == res.data.response.volume_2) {
                            $scope.formData.volume_2 = $scope.arr_volume_purchase_2[index];
                        }
                    });

                    $.each($scope.arr_volume_purchase_3, function (index, obj) {
                        if (obj.id == res.data.response.volume_3) {
                            $scope.formData.volume_3 = $scope.arr_volume_purchase_3[index];
                        }
                    });



                });

        $scope.showLoader = false;
        // }, 1000);


    }

    $scope.delete_purchase = function (id, index, arr_data) {

        var delUrl = $scope.$root.setup + "service/products-listing/delete-pr";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                    .post(delUrl, {id: id, 'token': $scope.$root.token})
                    .then(function (res) {
                        if (res.data.ack == true) {
                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                            arr_data.splice(index, 1);
                        } else {
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                        }
                    });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    $scope.show_price_one_pop_purchase = function () {
        var price = 0;
        var final_price = 0;

        price = $scope.formData.purchase_price_11;

        var f_id = this.formData.purchase_type11.id;

        if (f_id == 1)
        {
            final_price_one = (parseFloat($scope.formData.discount_value_11)) * (parseFloat(price)) / 100;

            final_price = (parseFloat(price)) - (parseFloat(final_price_one));

        } else if (f_id == 2)
        {
            final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value_11));
        }

        //  console.log( final_price);
        $scope.formData.discount_price_11 = final_price;
    }

    $scope.purchase_pop = function (id) {

        $scope.list_type = [{'name': 'Percentage', 'id': 1}, {'name': 'Value', 'id': 2}];

        // $scope.show_purchase_pop= true;   
        // angular.element('#model_btn_purchase_id').click();
        $('#model_btn_purchase').modal({
            show: true
        });


        $scope.list_type = [{'name': 'Percentage', 'id': 1}, {'name': 'Value', 'id': 2}];

        /*	$scope.check_item_readonly = false;
         $scope.perreadonly = true; 
         */

        var postUrl = $scope.$root.setup + "service/products-listing/purchase-by-id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };

        $scope.formData.pr_id = id;
        $scope.pr_id = id;

        $http
                .post(postUrl, postViewBankData)
                .then(function (res) {
                    $scope.formData.discount_value = parseFloat(res.data.response.discount_value);
                    $scope.formData.volume_1 = res.data.response.volume_1;
                    $scope.formData.volume_2 = res.data.response.volume_2;
                    $scope.formData.volume_3 = res.data.response.volume_3;

                    $scope.formData.purchase_price_11 = res.data.response.purchase_price;
                    $scope.formData.discount_value_11 = parseFloat(res.data.response.discount_value);
                    $scope.formData.discount_price_11 = res.data.response.discount_price;




                    //	console.log(discount_value);
                    /*	if(res.data.response.p_start_date ==0)	{ $scope.formData.p_start_date=null;   }
                     else	{  
                     $scope.formData.p_start_date= $scope.$root.convert_unix_date_to_angular(res.data.response.p_start_date); 				  }
                     
                     if(res.data.response.p_end_date ==0)	{ $scope.formData.p_end_date=null;   }
                     else	{  	$scope.formData.p_end_date= $scope.$root.convert_unix_date_to_angular(res.data.response.p_end_date);   }*/


                    $.each($scope.list_type, function (index, obj) {
                        if (obj.id == res.data.response.purchase_type) {
                            $scope.formData.purchase_type11 = $scope.list_type[index];
                        }
                    });


                    $.each($scope.arr_volume_purchase_1, function (index, obj) {
                        if (obj.id == res.data.response.volume_id) {
                            $scope.formData.volume_id = $scope.arr_volume_purchase_1[index];
                        }
                    });

                    $.each($scope.arr_volume_purchase_2, function (index, obj) {
                        if (obj.id == res.data.response.volume_id) {
                            $scope.formData.volume_id = $scope.arr_volume_purchase_2[index];
                        }
                    });

                    $.each($scope.arr_volume_purchase_3, function (index, obj) {
                        if (obj.id == res.data.response.volume_id) {
                            $scope.formData.volume_id = $scope.arr_volume_purchase_3[index];
                        }
                    });





                });
    }

//--------------------   Purchase End-------------------- 


    //--------------------   category type --------------------

    $scope.onChangeCategorytype = function () {

        var id = this.formData.category_id.id;
        //console.log(id );
        if (id == -1)
        {
            $scope.show_cat_pop = true;
            angular.element('#model_btn_new').click();
        }

        $("#name").val('');
        $scope.name = '';
    }

    $scope.add_cat_type = function (formData2) {

        var addcatUrl = $scope.$root.setup + "service/categories/add-category";

        $scope.formData2.token = $scope.$root.token;
        $scope.formData2.data = $scope.formFields;

        $http
                .post(addcatUrl, formData2)
                .then(function (res) {
                    if (res.data.ack == true) {

                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                        $('#model_cat').modal('hide');
                        //$scope.reload_category(); 
                        //  $scope.show_cat_pop = false; 

                        $http
                                .post(categoryUrl, {'token': $scope.$root.token})
                                .then(function (res) {
                                    if (res.data.ack == true) {

                                        $scope.category = res.data.response;
                                        $.each($scope.category, function (index, elem) {
                                            if (elem.name == formData2.name)
                                                $scope.formData.category_id = elem;
                                        });
                                        if ($scope.user_type == 1)
                                            $scope.category.push({'id': '-1', 'name': '++ Add New ++'});

                                    } else
                                        toaster.pop('error', 'Error', "No category found!");
                                });


                    } else
                        toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
                });
    }


// ------------- 	   category type   	 ----------------------------------------

//--------------------   Brand type --------------------

    $scope.onChangBrandtype = function () {

        var id = this.formData.brand_id.id;
        // console.log(id );
        if (id == -1)
        {
            $scope.show_brand_pop = true;
            angular.element('#model_btn_brand').click();
        }

        $("#name").val('');
        $scope.name = '';
    }

    $scope.add_brand_type = function (formData3) {

        var addbrandUrl = $scope.$root.stock + "brands/add-brand";

        $scope.formData3.token = $scope.$root.token;
        $scope.formData3.data = $scope.formFields;

        $http
                .post(addbrandUrl, formData3)
                .then(function (res) {
                    if (res.data.ack == true) {

                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                        //  $scope.show_brand_pop = false; 
                        $('#model_brand').modal('hide');
                        // $scope.reload_brand(); 

                        $http
                                .post(brandsUrl, {'token': $scope.$root.token})
                                .then(function (res) {
                                    if (res.data.ack == true) {
                                        $scope.brandnames = res.data.response;

                                        $.each($scope.brandnames, function (index, elem) {
                                            if (elem.name == formData3.name)
                                                $scope.formData.brand_id = elem;
                                        });
                                        if ($scope.user_type == 1)
                                            $scope.brandnames.push({'id': '-1', 'description': '++ Add New ++'});


                                    } else
                                        toaster.pop('error', 'Error', "No brand found!");
                                });
                    } else
                        toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
                });
    }


// ------------- 	   Brand type   	 ----------------------------------------


//--------------------   Unit  type --------------------


    $scope.onChangUnittype = function () {

        var id = this.formData.unit_id.id;

        if (id == -1)
        {
            $scope.show_unit_pop = true;
            angular.element('#model_btn_unit').click();


        }

        $("#name").val('');
        $scope.name = '';
    }

    $scope.add_unit_type = function (formData4) {

        var addunitUrl = $scope.$root.stock + "unit-measure/add-unit";
        $scope.formData4.token = $scope.$root.token;
        $scope.formData4.data = $scope.formFields;
        $scope.formData4.parent_id = $scope.formData4.parent_id != undefined ? $scope.formData4.parent_id.id : 0;

        $http
                .post(addunitUrl, formData4)
                .then(function (res) {
                    if (res.data.ack == true) {

                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                        //  $scope.show_unit_pop = false; 
                        $('#model_unit').modal('hide');
                        // $scope.reload_unit(); 

                        $http
                                .post(unitUrl, {'token': $scope.$root.token})
                                .then(function (res) {
                                    if (res.data.ack == true) {
                                        $scope.unit_measures = res.data.response;

                                        $.each($scope.unit_measures, function (index, elem) {
                                            if (elem.name == formData4.name)
                                                $scope.formData.unit_id = elem;
                                        });
                                      
                                    }  if ($scope.user_type == 1)
                                            $scope.unit_measures.push({id: '-1', name: '++Add New++'});
                                });
                    } else
                        toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
                });
    }


    $scope.onChangpurchaseUnittype = function () {

        var id = this.formData.purchase_measure.id;
        //  console.log(id );
        if (id == -1)
        {
            $scope.show_p_unit_pop = true;
            angular.element('#model_btn_p_unit').click();
        }

        $("#name").val('');
        $scope.name = '';
    }

    $scope.add_unit_type_p = function (formData4) {

        var addunitUrl = $scope.$root.stock + "unit-measure/add-unit";
        $scope.formData4.token = $scope.$root.token;
        $scope.formData4.data = $scope.formFields;

        $http
                .post(addunitUrl, formData4)
                .then(function (res) {
                    if (res.data.ack == true) {

                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                        // $scope.show_p_unit_pop = false; 
                        $('#model_p_unit').modal('hide');
                        // $scope.reload_p_unit();   
                        $http
                                .post(unitUrl, {'token': $scope.$root.token})
                                .then(function (res) {
                                    if (res.data.ack == true) {
                                        $scope.purchase_unit_measures = res.data.response;

                                        $.each($scope.purchase_unit_measures, function (index, elem) {
                                            if (elem.name == formData4.name)
                                                $scope.formData.purchase_measure = elem;
                                        });
                                      
                                    }  if ($scope.user_type == 1)
                                            $scope.purchase_unit_measures.push({id: '-1', name: '++Add New++'});

                                });
                    } else
                        toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
                });
    }


// ------------- 	   Unit type   	 ----------------------------------------


    // ------------- 	 Country    	 ----------------------------------------


    $scope.onChangCountry = function () {

        var id = this.formData.prd_country_origin.id;

        if (id == -1)
        {
            //  $scope.show_country_pop= true;   
            // angular.element('#model_btn_country').click();  
            $('#model_country').modal({
                show: true
            });
        }

        $("#name").val('');
        $scope.name = '';
    }

    $scope.add_country_pop = function (formData6) {

        var addcountriesUrl = $scope.$root.hr + "hr_values/add-countries";
        $scope.formData6.token = $scope.$root.token;
        $scope.formData6.data = $scope.formFields;
        $http
                .post(addcountriesUrl, formData6)
                .then(function (res) {
                    if (res.data.ack == true) {

                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                        $('#model_country').modal('hide');

                        $http
                                .post(countriesUrl, {'token': $scope.$root.token})
                                .then(function (res) {
                                    if (res.data.ack == true) {

                                        $scope.countries = res.data.response;
                                        $.each($scope.countries, function (index, elem) {
                                            if (elem.id == $scope.$root.defaultCountry)
                                                $scope.formData.prd_country_origin = elem;
                                        });

                                        if ($scope.user_type == 1)
                                            $scope.countries.push({'id': '-1', 'name': '++ Add New ++'});


                                    }
                                    //else 	toaster.pop('error', 'Error', "No brand found!");
                                });
                    } else
                        toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
                });
    }

    // ------------- 	Country    	 ---------------------------------------- 


    //ng-click="reload_popup(1,'model_btn_purchase')" //modaladdevent
    $scope.reload_popup = function (div_id, div_model) {

        $('#' + div_model).modal('hide');
        //  $scope.show_p_unit_pop = false;  
        if (div_id == 1)
        {
            $scope.formData.purchase_measure = $scope.purchase_unit_measures[0];

        } else if (div_id == 2)
        {
            $scope.formData.unit_id = $scope.unit_measures[0];
        } else if (div_id == 3)
        {
            $scope.formData.brand_id = $scope.brandnames[0];

        } else if (div_id == 4)
        {
            $scope.formData.category_id = $scope.category[0];
        } else if (div_id == 5)
        {

        } else if (div_id == 6)
        {

        } else if (div_id == 7)
        {
            $scope.formData.volume_1 = $scope.arr_volume_1[0];
        } else if (div_id == 8)
        {
            $scope.formData.volume_2 = $scope.arr_volume_2[0];
        } else if (div_id == 9)
        {
            $scope.formData.volume_3 = $scope.arr_volume_3[0];

        } else if (div_id == 10)
        {
            $scope.formData.volume_1 = $scope.arr_volume_purchase_1[0];
        } else if (div_id == 11)
        {
            $scope.formData.volume_2 = $scope.arr_volume_purchase_2[0];
        } else if (div_id == 12)
        {
            $scope.formData.volume_3 = $scope.arr_volume_purchase_3[0];
        } else if (div_id == 13)
        {
            $scope.formData.prd_country_origin = $scope.countries[0];
        }

    }
	
	
	
	
	
	
	
	

	$timeout(function () {
		  angular.element(document).ready(function () {
                    angular.element('.date-picker').datepicker({dateFormat:$("#date_format").val()});
            });
			console.log('date picker active');
    }, 1000);

	$scope.item_paging = {};
	$scope.itemselectPage = function (pageno) {
        $scope.item_paging.spage = pageno; 
    };
	//$timeout(function () {
		
	$scope.row_id=$stateParams.id;
	$scope.module_id = 114;
	$scope.subtype = 4;
	$scope.module="Setup";
	$scope.module_name="Manage";
	//$scope.module_code= $scope.$root.model_code ;
	//console.log( $scope.module_id+'call'+$scope.module+'call'+$scope.module_name+'call'+$scope.module_code);
	$scope.$root.$broadcast("image_module",$scope.row_id,$scope.module,$scope.module_id,$scope.module_name,$scope.module_code,$scope.subtype);

  //  }, 1000);
  
 

	
	
	
	
	
	
	
	
}





myApp.filter('strLimit', ['$filter', function ($filter) {
        return function (input, limit) {
            if (!input)
                return;
            if (input.length <= limit) {
                return input;
            }

            return $filter('limitTo')(input, limit) + '...';
        };
    }]);