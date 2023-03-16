myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.prospect', {
                url: '/prospect/:filter_id',
                title: 'Sales',
                templateUrl: helper.basepath('crm/crm.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.crm', {
                url: '/crm/:filter_id',
                title: 'Sales',
                templateUrl: helper.basepath('crm/crm.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.crm_retailer', {
                url: '/crm_retailer',
                title: 'Sales',
                templateUrl: helper.basepath('crm/crm.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.add-crm', {
                url: '/crm/add',
                title: 'Sales',
                templateUrl: helper.basepath('addTabs.html'),
                controller: 'CrmEditController',
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.editCrm', {
                url: '/crm/:id/edit?isOppCycle',
                title: 'Sales',
                templateUrl: helper.basepath('addTabs.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'CrmEditController'
            })
            .state('app.add-prospect', {
                url: '/prospect/add',
                title: 'Sales',
                templateUrl: helper.basepath('addTabs.html'),
                controller: 'CrmEditController',
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.editprospect', {
                url: '/prospect/:id/edit?isOppCycle',
                title: 'Sales',
                templateUrl: helper.basepath('addTabs.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'CrmEditController'
            })
            .state('app.opportunity-cycles', {
                url: '/opportunity_cycles',
                title: 'Opportunity Cycle',
                templateUrl: helper.basepath('crm/opp_cycle_all.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'OpportunityCycleController'
            })
    }
]);

// factory function to catch the exception and show messages
/*myApp.factory("$exceptionHandler", function () {
 return function (exception, cause) {
 console.log("Exception cause " + exception);
 } 
 });*/

myApp.controller('CrmController', CrmController);

function CrmController($scope, $filter, $resource, $timeout, $state, $http, ngDialog, toaster, $rootScope, moduleTracker) {
    'use strict';

    moduleTracker.updateName("crm");
    moduleTracker.updateRecord("");

    if ($state.current.name.match("app.crm_retailer")) {
        $scope.$root.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
            // {'name': 'Setup', 'url': '#', 'isActive': false},
            {
                'name': 'Sales',
                'url': '#',
                'isActive': false
            },
            {
                'name': 'Retailer CRM',
                'url': '#',
                'isActive': false
            }
        ];
        $scope.$root.retailer = 1;
        moduleTracker.updateName("crm_retailer");
        moduleTracker.updateRecord("");
    }
    else if ($state.current.name.match("app.prospect")) {
        $scope.$root.breadcrumbs = [ 
            {
                'name': 'Sales',
                'url': '#',
                'isActive': false
            },
            {
                'name': 'Prospect',
                'url': '#',
                'isActive': false
            }
        ];
        $scope.$root.retailer = 2;
    }
    else
    {
        $scope.$root.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
            // {'name': 'Setup', 'url': '#', 'isActive': false},
            {
                'name': 'Sales',
                'url': '#',
                'isActive': false
            },
            {
                'name': 'CRM',
                'url': '#',
                'isActive': false
            }
        ];
        $scope.$root.retailer = 0;
    }

    var vm = this;
    var Api = $scope.$root.sales + "crm/crm/listings";
    var postData = {
        'token': $scope.$root.token,
        'all': "1"
    };

    //sort by column
    /* $scope.sortform = 'desc';
     $scope.reversee = true;
     $scope.sort_column='';*/
    $scope.searchKeyword = {};

    $scope.checkCheckbox = function(data){
        console.table(data);
        ngDialog.openConfirm({
            template: 'testConfirmDialog',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            console.log('checked');
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
            console.log('undo checked');
            var match = false;
                angular.forEach($scope.record_data, function(obj, index){
                    if (!match && obj && obj.id == data.id){
                        match = true;
                        obj[data.field_name.key] = !data.field_name.value;
                    }
                })
        });
        
    }
    $scope.selectedFlexiRecords = {};
    $scope.getcrm_list = function (item_paging, sort_column, sortform) {

        //pass in API


        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;

        if ($scope.$root.retailer == 1) {
            $scope.postData.retailer = 1;
        }
        else if ($scope.$root.retailer == 2) {
            $scope.postData.retailer = 2;
        }

        
        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        $scope.postData.segments = $scope.searchKeyword.segment !== undefined ? $scope.searchKeyword.segment.id : 0;
        $scope.postData.regions = $scope.searchKeyword.region !== undefined ? $scope.searchKeyword.region.id : 0;
        $scope.postData.buying_groups = $scope.searchKeyword.buying_group !== undefined ? $scope.searchKeyword.buying_group.id : 0;
        $scope.postData.filter_status = $scope.searchKeyword.status_id !== undefined ? $scope.searchKeyword.status_id.id : 0;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }


        $scope.postData.searchKeyword = $scope.searchKeyword;
        $scope.postData.city = $scope.searchKeyword.city;

        if ((sort_column != undefined) && (sort_column != null)) {
            //sort by column
            $scope.postData.sort_column = sort_column;
            $scope.postData.sortform = sortform;

            $rootScope.sortform = sortform;
            $rootScope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;
            $rootScope.sort_column = sort_column;

            $rootScope.save_single_value($rootScope.sort_column, 'crmsort_name')

            /*$scope.sortform=sortform;
             $scope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;
             $scope.sort_column=sort_column;
             */
        }

        $scope.showLoader = true;
        $http
            .post(Api, $scope.postData)
            .then(function (res) {
                $scope.tableData = res;
                $scope.showLoader = false;
                $scope.columns = [];
                $scope.record_data = {};
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.record_data = res.data.response;
                    angular.forEach($scope.record_data.tbl_meta_data.response.colMeta, function(obj,index){
                        if (obj.event && obj.event.name && obj.event.trigger){
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    })
                    // angular.forEach(res.data.response[0], function (val, index) {
                    //     if (index != 'chk' && index != 'id') {
                    //         $scope.columns.push({
                    //             'title': toTitleCase(index),
                    //             'field': index,
                    //             'visible': true
                    //         });
                    //     }
                    // });
                }
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.getprospect_list = function (item_paging, sort_column, sortform) {

        //pass in API


        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;

        if ($scope.$root.retailer == 1) {
            $scope.postData.retailer = 1;
        }
        else if ($scope.$root.retailer == 2) {
            $scope.postData.retailer = 2;
        }

        
        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        $scope.postData.segments = $scope.searchKeyword.segment !== undefined ? $scope.searchKeyword.segment.id : 0;
        $scope.postData.regions = $scope.searchKeyword.region !== undefined ? $scope.searchKeyword.region.id : 0;
        $scope.postData.buying_groups = $scope.searchKeyword.buying_group !== undefined ? $scope.searchKeyword.buying_group.id : 0;
        $scope.postData.filter_status = $scope.searchKeyword.status_id !== undefined ? $scope.searchKeyword.status_id.id : 0;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }


        $scope.postData.searchKeyword = $scope.searchKeyword;
        $scope.postData.city = $scope.searchKeyword.city;

        if ((sort_column != undefined) && (sort_column != null)) {
            //sort by column
            $scope.postData.sort_column = sort_column;
            $scope.postData.sortform = sortform;

            $rootScope.sortform = sortform;
            $rootScope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;
            $rootScope.sort_column = sort_column;

            $rootScope.save_single_value($rootScope.sort_column, 'crmsort_name')

            /*$scope.sortform=sortform;
             $scope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;
             $scope.sort_column=sort_column;
             */
        }

        $scope.showLoader = true;
        $http
            .post(Api, $scope.postData)
            .then(function (res) {
                $scope.tableData = res;
                $scope.showLoader = false;
                $scope.columns = [];
                $scope.record_data = {};
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.record_data = res.data.response;
                    angular.forEach($scope.record_data.tbl_meta_data.response.colMeta, function(obj,index){
                        if (obj.event && obj.event.name && obj.event.trigger){
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    })
                    // angular.forEach(res.data.response[0], function (val, index) {
                    //     if (index != 'chk' && index != 'id') {
                    //         $scope.columns.push({
                    //             'title': toTitleCase(index),
                    //             'field': index,
                    //             'visible': true
                    //         });
                    //     }
                    // });
                }
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    var col = '';
    col = $rootScope.get_single_value('crmsort_name');
    // $scope.getcrm_list(1, col, 'Desc');
    $scope.$root.itemselectPage(1);

    $scope.arr_crm_status = [{
        id: '1',
        title: 'Active'
    }, {
        id: '0',
        title: 'Inactive'
    }];
}

myApp.controller('CrmEditController', CrmEditController);

function CrmEditController($scope, $filter, $http, $state, $resource, ngDialog, toaster, $timeout, $rootScope, $stateParams, Upload, moduleTracker) {
    'use strict';

    moduleTracker.updateName("crm");
    moduleTracker.updateRecord($stateParams.id);

    $scope.moduleForPermissions = "crm";

    // reload Setup global data
    $rootScope.get_global_data(1);



    if ($stateParams.isOppCycle != undefined) {
        $scope.isOppCycle = $stateParams.isOppCycle;
    }
    else
        $scope.isOppCycle = 0;

    $scope.addCompetitorsPermission = $rootScope.allowadd_crm_competetor_tab;
    $scope.editCompetitorsPermission = $rootScope.allowedit_crm_competetor_tab;
    $scope.viewCompetitorsPermission = $rootScope.allowview_crm_competetor_tab;
    $scope.deleteCompetitorsPermission = $rootScope.allowdelete_crm_competetor_tab;

    $scope.addPriceTabPermission = $rootScope.allowadd_crm_price_tab;
    $scope.editPriceTabPermission = $rootScope.allowedit_crm_price_tab;
    $scope.viewPriceTabPermission = $rootScope.allowview_crm_price_tab;
    $scope.deletePriceTabPermission = $rootScope.allowdelete_crm_price_tab;
    $scope.convertPriceTabPermission = $rootScope.allowconvert_crm_price_tab;

    $scope.addOppCyclePermission = $rootScope.allowadd_crm_oop_cycle_tab;
    $scope.editOppCyclePermission = $rootScope.allowedit_crm_oop_cycle_tab;
    $scope.viewOppCyclePermission = $rootScope.allowview_crm_oop_cycle_tab;
    $scope.deleteOppCyclePermission = $rootScope.allowdelete_crm_oop_cycle_tab;

    $scope.addContactPermission = $rootScope.allowadd_crm_contact_tab;
    $scope.editContactPermission = $rootScope.allowedit_crm_contact_tab;
    $scope.viewContactPermission = $rootScope.allowview_crm_contact_tab;
    $scope.deleteContactPermission = $rootScope.allowdelete_crm_contact_tab;

    $scope.addLocationPermission = $rootScope.allowadd_crm_location_tab;
    $scope.editLocationPermission = $rootScope.allowedit_crm_location_tab;
    $scope.viewLocationPermission = $rootScope.allowview_crm_location_tab;
    $scope.deleteLocationPermission = $rootScope.allowdelete_crm_location_tab;



    //console.log($rootScope.CRMType);
    if($scope.$root.retailer == 1)
    {
        $scope.$root.breadcrumbs = [{
            'name': 'Sales',
            'url': '#',
            'style': ''
        },
        {
            'name': 'Retailer CRM',
            'url': 'app.crm_retailer',
            'style': ''
        }
        ];
    }
    else if($scope.$root.retailer == 2)
    {
        $scope.$root.breadcrumbs = [{
            'name': 'Sales',
            'url': '#',
            'style': ''
        },
        {
            'name': 'Prospect',
            'url': 'app.prospect',
            'style': ''
        }
        ];
    }
    else
    {
        $scope.$root.breadcrumbs = [{
            'name': 'Sales',
            'url': '#',
            'style': ''
        },
        {
            'name': 'CRM',
            'url': 'app.crm',
            'style': ''
        }
        ];
    }

    if ($stateParams.id > 0)
        $scope.check_crm_readonly = true;

    $scope.showEditForm = function () {
        $scope.check_crm_readonly = false;
    }

    $scope.formUrl = function () {
        return "app/views/crm/_form.html";
    }


    $scope.$root.tabHide = 0;
    $scope.$root.lblButton = 'Add New';
    $scope.altContacFormShow = false;
    $scope.altContacListingShow = true;
    $scope.altDepotFormShow = false;
    $scope.altDepotListingShow = true;
    $scope.crmCompFormShow = false;
    $scope.crmCompListingShow = true;
    $scope.pOfferFormShow = false;
    $scope.pOfferListingShow = true;
    $scope.rebateFormShow = false;
    $scope.rebateListingShow = true;
    $scope.pOfferListingFormShow = false;
    $scope.pOfferListingListingShow = true;
    $scope.crmPromotionFormShow = false;
    $scope.crmPromotionListingShow = true;
    $scope.showProducts = false;
    $scope.crmDocumentFormShow = false;
    $scope.crmDocumentListingShow = true;
    $scope.arr_turnover = [];
    $scope.selectedSalespersons = [];
    $scope.customer_groups = [];
    $scope.selectedSegments = [];
    $scope.selectedRegions = [];
    $scope.selectedBuyingGroups = [];
    // $scope.arr_ownership = [{'id':1,'title':'Soletrader'},{'id':2,'title':'Partnership'},{'id':3,'title':'Ltd'},{'id':4,'title':'Plc'}]
    $scope.rec = {};
    $scope.rec.type = 1;

    $scope.socialMediasGeneral = {};
    $scope.socialMediasContactGeneral = {};
    $scope.socialMediasContactArr = {};
    $scope.tempSocialMedia = [];
    $rootScope.social_medias_general_form = [];
    $rootScope.social_medias_contact_form = [];

    angular.forEach($rootScope.social_medias, function (element) {
        if (element.value != undefined && element.value.length > 0)
            delete element.value;
    });

    
    var refreshId = setInterval(function () {
        if (($rootScope.social_medias != undefined && $rootScope.social_medias.length > 0)) {
            angular.copy($rootScope.social_medias, $rootScope.social_medias_general_form);
            angular.copy($rootScope.social_medias, $rootScope.social_medias_contact_form);
            clearInterval(refreshId);
        }
    }, 500);
    
    $scope.qty = 5;
    $scope.defaultOption = 2;

    $scope.offeredByColumnsShow = [
        "name", "job_title", "dep_name"
    ]

    // $rootScope.tempSocialMedia = [];
    // $rootScope.socialMediasGeneral = {};
    // $rootScope.socialMediasContactGeneral = {};

    $scope.rec.searchKeywordsl = '';
    $scope.drp = {};

    $scope.rec.arr_crm_status = [];

    $scope.isSalePerersonChanged = false;

    $scope.disableClass = 1;

    $scope.changeToAddButton = function () {
        $scope.$root.lblButton = 'Add New';
    }

    $scope.get_empl_list = function (arg) {
        // console.log(arg);
        $scope.showLoader = true;
        $scope.columns_pr = [];
        $scope.record_pr = {};
        $scope.searchKeyword_offered = {};
        $scope.title = 'Recieved By';
        $scope.empListType = 'general';

        if (arg == 'saleperson_code') {
            $scope.title = 'Employee List';
            $scope.empListType = 'saleperson_code';
        }

        var empUrl = $scope.$root.hr + "employee/listings";

        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.crm_id,
            'limit': 9999
        };

        $http
            .post(empUrl, postData)
            .then(function (res) {

                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.columns_pr = [];
                    $scope.record_pr = {};
                    $scope.record_pr = res.data.response;


                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_pr.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.element('#_CrmEmplisting_model').modal({
                        show: true
                    });
                    return;
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });
    }

    $scope.confirm_employeeList = function (result, emptype) {
        if (emptype == 'general') {
            $scope.PriceOffer_rec.recieved_by = result.name;
            $scope.PriceOffer_rec.recieved_by_id = result.id;
        } else if (emptype == 'saleperson_code') {

            $scope.rec.saleperson_code = result.name;
            $scope.rec.saleperson_code_id = result.id;
        }

        angular.element('#_CrmEmplisting_model').modal('hide');
    }

    $scope.class = 'block';
    $scope.rec.arr_crm_credit_rating = {};



    $scope.crm_no = '';
    $scope.drp.crm_segment_id = "";
    var crm_name = '';
    var id = $stateParams.id;
    $scope.$root.crm_id = id;

    $scope.$root.bdname = '';
    $scope.last_selected_bucket=0;
    $scope.get_crm_data_by_id = function () {
        $scope.isCrm = false;
        $scope.isSrm = false;

        $scope.showLoader = true;
        $scope.bucket_selected_array = [];
        $scope.selectedSalespersons = [];
        $scope.moduleCodeType = 1;
        // window.open("app/views/invoice_templates/sales_order.html", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
        
        var getCrmUrl = $scope.$root.sales + "crm/crm/get-crm";
        $http
            .post(getCrmUrl, {
                'id': $stateParams.id,
                'is_retailer': $scope.$root.retailer,
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == 1) {
                    //console.log( $scope.rec);
                    moduleTracker.updateRecordName(res.data.response.name);
                    $scope.rec = res.data.response;
                    $scope.moduleCodeType = res.data.moduleCodeType;
                    $scope.check_crm_readonly = true;

                    // saleperson
                    if(res.data.response.crmSalesPerson){
                        $scope.rec.saleperson_code = res.data.response.crmSalesPerson.name;
                        $scope.rec.saleperson_code_id = res.data.response.crmSalesPerson.id;
                    }

                    //is crm check
                    $scope.$root.retailer = 0;
                    if ($scope.rec.type == 1)
                        $scope.isCrm = true;
                    else if ($scope.rec.type == 0){

                        $scope.isCrm = true;
                        $scope.$root.retailer = 2;
                    }
                    else if($scope.rec.type == 4)
                    {
                        $scope.isCrm = true;
                        $scope.$root.breadcrumbs = [{
                                'name': 'Sales',
                                'url': '#',
                                'style': ''
                            },
                            {
                                'name': 'Retailer CRM',
                                'url': 'app.crm_retailer',
                                'style': ''
                            }
                        ];
                        $scope.$root.retailer = 1;
                    }
                    else
                        $scope.isCrm = false;

                   

                    if (res.data.response.RouteToMarket != undefined && res.data.response.RouteToMarket.ack == 1) {
                        $scope.RTMCrmList = res.data.response.RouteToMarket.response.RTMCrmList;
                        $scope.LinkedRTMCrmList = res.data.response.RouteToMarket.response.LinkedRTMCrmList;
                        // $scope.selectedRouteToMarkets = res.data.response.RouteToMarket.response.LinkedRTMCrmString; // did in the next loop
                        $scope.selectedRouteToMarkets = "";
                        var found_is_prefered = false;
                        
                        angular.forEach($scope.RTMCrmList, function (crm) {
                            crm.chk = false;
                            crm.is_prefered = false;
                            angular.forEach($scope.LinkedRTMCrmList, function (link_rtm) {
                                if (crm.id == link_rtm.crm_id) {
                                    crm.chk = true;
                                    $scope.selectedRouteToMarkets += crm.code + ', ';
                                    if (Number(link_rtm.is_prefered) > 0) {
                                        found_is_prefered = true;
                                        crm.is_prefered = 1;
                                    }
                                }
                            });
                        });

                        if ($scope.selectedRouteToMarkets.length > 0)
                        {
                            $scope.selectedRouteToMarkets = $scope.selectedRouteToMarkets.substring(0, $scope.selectedRouteToMarkets.length - 2);
                        }
                    }
                    // $scope.rec.crm_no = res.data.response.crm_no;
                    $scope.rec.id = res.data.response.id;
                    $scope.$root.bdname = res.data.response.name + '( ' + res.data.response.crm_code + ' )'; //res.data.response.crm_code;
                    $scope.module_code = $scope.$root.bdname;
                    $scope.rec.old_status = res.data.response.status;
                    $scope.rec.old_contact = $scope.rec.contact_person;
                    $scope.rec.credit_rating_old = $scope.rec.credit_rating;


                    // $scope.rec.credit_limit = parseFloat(res.data.response.credit_limit);
                    $scope.rec.emp_no = (parseFloat(res.data.response.emp_no) > 0) ? parseFloat(res.data.response.emp_no) : null ;
                    $scope.rec.turnover = (parseFloat(res.data.response.turnover) > 0) ? parseFloat(res.data.response.turnover) : null;

                    if ($scope.rec.crm_segment_id != undefined && $rootScope.segment_customer_arr != undefined)
                        $scope.drp.crm_segment_id = $scope.$root.get_obj_frm_arry($rootScope.segment_customer_arr, $scope.rec.crm_segment_id);
                    //console.log($scope.drp.crm_segment_id);

                    if ($scope.rec.buying_grp != undefined && $rootScope.bying_group_customer_arr != undefined)
                        $scope.drp.buying_grp_id = $scope.$root.get_obj_frm_arry($rootScope.bying_group_customer_arr, $scope.rec.buying_grp);

                    if ($scope.rec.region_id != undefined && $scope.rec.region_id != undefined)
                        $scope.rec.region_id = $scope.$root.get_obj_frm_arry($rootScope.region_customer_arr, $scope.rec.region_id);

                    angular.forEach($rootScope.postingGroups, function (elem2) {
                        if (elem2.id == res.data.response.crm_posting_group_id)
                            $scope.drp.posting_group_ids = elem2;
                    });
                    
                    $scope.rec.arr_crm_status = [{
                        'id': '1',
                        'title': 'Active'
                    }, {
                        'id': '0',
                        'title': 'Inactive'
                    }];

                    $scope.rec.arr_crm_type = [{
                        'id': '1',
                        'title': 'Standard'
                    }, {
                        'id': '2',
                        'title': 'Route To Market'
                    }, {
                        'id': '3',
                        'title': 'Indirect'
                    }];


                    if ($scope.rec.status != undefined && $scope.rec.arr_crm_status != undefined)
                        $scope.drp.status_id = $scope.$root.get_obj_frm_arry($scope.rec.arr_crm_status, $scope.rec.status);

                    if ($scope.rec.crm_type != undefined && $scope.rec.arr_crm_type != undefined)
                        $scope.drp.crm_type = $scope.$root.get_obj_frm_arry($scope.rec.arr_crm_type, $scope.rec.crm_type);

                    if ($scope.rec.source_of_crm != undefined && $scope.rec.arr_sources_of_crm != undefined)
                        $scope.drp.sources_of_crm_id = $scope.$root.get_obj_frm_arry($scope.rec.arr_sources_of_crm, $scope.rec.source_of_crm);

                    $scope.disable_classification = false;
                    if ($scope.rec.crm_classification != undefined && $rootScope.arr_crm_classification != undefined) {
                        $scope.drp.crm_classification = $scope.$root.get_obj_frm_arry($rootScope.arr_crm_classification, $scope.rec.crm_classification);
                        if ($scope.drp.crm_classification.title == 'Customer' && $scope.rec.customer_code != null) {
                            $scope.disable_classification = true;
                        }
                    }

                    if ($scope.rec.credit_rating != undefined && $scope.rec.credit_rating != undefined)
                        $scope.rec.credit_rating = $scope.$root.get_obj_frm_arry($scope.rec.arr_crm_credit_rating, $scope.rec.credit_rating);

                    if ($scope.rec.ownership_type != undefined && $rootScope.arr_type_of_Business != undefined)
                        $scope.rec.ownership_type = $scope.$root.get_obj_frm_arry($rootScope.arr_type_of_Business, $scope.rec.ownership_type);

                    if ($scope.rec.currency_id != undefined && $rootScope.arr_currency != undefined)
                        $scope.drp.currency = $scope.$root.get_obj_frm_arry($rootScope.arr_currency, $scope.rec.currency_id);

                    if ($scope.rec.unsubscribeEmail == 1)
                        $scope.rec.unsubscribeEmail_address = 1;
                    else
                        $scope.rec.unsubscribeEmail_address = 0;

                    if ($scope.rec.verified == 1)
                        $scope.rec.verified_chk = 1;
                    else
                        $scope.rec.verified_chk = 0;

                    /* angular.forEach($rootScope.social_medias, function (obj2) {
    
                        if (obj2.id == res.data.response.socialmedia1)
                            $scope.rec.socialmedia1 = obj2;
    
                        if (obj2.id == res.data.response.socialmedia2)
                            $scope.rec.socialmedia2 = obj2;
    
                        if (obj2.id == res.data.response.socialmedia3)
                            $scope.rec.socialmedia3 = obj2;
    
                        if (obj2.id == res.data.response.socialmedia4)
                            $scope.rec.socialmedia4 = obj2;
    
                        if (obj2.id == res.data.response.socialmedia5)
                            $scope.rec.socialmedia5 = obj2;
                    }); 
    
                    if (res.data.response.socialmedia1 == 0)
                        $scope.rec.socialmedia1 = null;
    
                    if (res.data.response.socialmedia2 == 0)
                        $scope.rec.socialmedia2 = null;
    
                    if (res.data.response.socialmedia3 == 0)
                        $scope.rec.socialmedia3 = null;
    
                    if (res.data.response.socialmedia4 == 0)
                        $scope.rec.socialmedia4 = null;
    
                    if (res.data.response.socialmedia5 == 0)
                        $scope.rec.socialmedia5 = null;
                    */

                    $scope.tempSocialMedia = [];
                    angular.forEach($rootScope.social_medias_general_form, function (obj2) {

                        if (obj2.id == res.data.response.socialmedia1 && res.data.response.socialmedia1 != 0) {
                            obj2.value = res.data.response.socialmedia1_value;
                            $scope.tempSocialMedia.push(obj2);
                        }
                        if (obj2.id == res.data.response.socialmedia2 && res.data.response.socialmedia2 != 0) {
                            obj2.value = res.data.response.socialmedia2_value;
                            $scope.tempSocialMedia.push(obj2);
                        }
                        if (obj2.id == res.data.response.socialmedia3 && res.data.response.socialmedia3 != 0) {
                            obj2.value = res.data.response.socialmedia3_value;
                            $scope.tempSocialMedia.push(obj2);
                        }
                        if (obj2.id == res.data.response.socialmedia4 && res.data.response.socialmedia4 != 0) {
                            obj2.value = res.data.response.socialmedia4_value;
                            $scope.tempSocialMedia.push(obj2);
                        }
                        if (obj2.id == res.data.response.socialmedia5 && res.data.response.socialmedia5 != 0) {
                            obj2.value = res.data.response.socialmedia5_value;
                            $scope.tempSocialMedia.push(obj2);
                        }

                    });

                    if ($scope.rec.contact_person != undefined) {
                        if ($scope.rec.contact_person.length > 0)
                            $scope.rec.contactCollapse = false;
                        else
                            $scope.rec.contactCollapse = true;
                    }

                    if ($scope.tempSocialMedia.length) {
                        $scope.socialMediasGeneral = {};
                        $scope.socialMediasGeneral['crmSM'] = $scope.tempSocialMedia;
                    }

                    if ($scope.rec.currency_id) {
                        $rootScope.cust_current_edit_currency = $scope.$root.get_obj_frm_arry($rootScope.arr_currency, $scope.rec.currency_id);
                    } else {
                        $rootScope.cust_current_edit_currency = $scope.$root.defaultCurrencyCode;
                    }

                    if ($scope.$root.breadcrumbs.length == 2) {
                        $scope.$root.breadcrumbs.push({
                            'name': $scope.$root.bdname,
                            'url': '#',
                            'isActive': false
                        });
                    }

                    $scope.getAltContact_genral($scope.rec, 1);
                    $scope.getAltLocationfrmGeneral($scope.rec, 1);

                    //  console.log($scope.rec);

                }
                $scope.showLoader = false;

            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });

    }

    if ($stateParams.id !== undefined)
        $scope.get_crm_data_by_id();


    $scope.recnew = {};
    $scope.recnew.crmid = 0;
    if ($stateParams.id !== undefined)
        $scope.recnew.crmid = id;

    $scope.product_type = true;
    $scope.count_result = 0;

    var getCodeUrl = $scope.$root.stock + "products-listing/get-code";

    $scope.getCode = function (rec) {

        //var getCodeUrl = $scope.$root.sales+"customer/customer/get-crm-code";

        var name = $scope.$root.base64_encode('crm');
        var no = $scope.$root.base64_encode('crm_no');
        var module_category_id = 2;

        $http
            .post(getCodeUrl, {
                'is_increment': 1,
                'token': $scope.$root.token,
                'tb': name,
                'm_id': 9,
                'no': no,
                'category': '',
                'brand': '',
                'module_category_id': module_category_id,
                'type': '1,2',
                'status': ''
            })
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data.ack == 1) {

                    $scope.rec.crm_code = res.data.code;
                    $scope.rec.crm_no = res.data.nubmer;
                    $scope.rec.code_type = module_category_id; //res.data.code_type;
                    $scope.count_result++;
                    if (res.data.type == 1) {
                        $scope.product_type = false;
                    } else {
                        $scope.product_type = true;
                    }

                    if ($scope.count_result > 0) {
                        //  //console.log($scope.count_result);
                        return true;
                    } else {
                        //    //console.log($scope.count_result + 'd');
                        return false;
                    }


                } else {
                    toaster.pop('error', 'info', res.data.error);
                    return false;
                }
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }
    /*if ($stateParams.id == undefined)
     $scope.getCode();*/

    $scope.generate_unique_id = function () {

        $scope.$root.crm_id = null;
        $scope.moduleCodeType = 1;

        var getUrl = $scope.$root.sales + "crm/crm/get-unique-id";
        $scope.showLoader = true;
        $http
            .post(getUrl, {
                'token': $scope.$root.token,
                type: 1
            })
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data.ack == 1) {
                    $scope.allowChangeBucket = true;
                    
                    $scope.rec = res.data.response;
                    // $scope.rec.unique_id = res.data.unique_id;
                    $scope.rec.id = res.data.id;
                    $scope.$root.crm_id = res.data.id;
                    $scope.rec.type = 1;
                    $scope.moduleCodeType = res.data.moduleCodeType;

                    $scope.rec.is_billing_address = 1;
                    $scope.rec.is_delivery_collection_address = 1;
                    $scope.rec.is_invoice_address = 1;

                    $scope.rec.primary_is_billing_address = 1;
                    $scope.rec.primary_is_invoice_address = 1;
                    $scope.rec.primary_is_delivery_collection_address = 1;

                    // $scope.rec.social_mediascrm = [{id: ''}];
                    //  $scope.rec.social_mediasconatctcrm = [{id: ''}];

                    $scope.drp.currency = $scope.$root.get_obj_frm_arry($scope.$root.arr_currency, $scope.$root.defaultCurrency);

                    $scope.drp.country_id = $scope.$root.get_obj_frm_arry($scope.$root.country_type_arr, $scope.$root.defaultCountry);

                    $scope.rec.arr_crm_status = [{
                        'id': '1',
                        'title': 'Active'
                    }, {
                        'id': '0',
                        'title': 'Inactive'
                    }];
                    $scope.rec.arr_crm_type = [{
                        'id': '1',
                        'title': 'Standard'
                    }, {
                        'id': '2',
                        'title': 'Route To Market'
                    }, {
                        'id': '3',
                        'title': 'Indirect'
                    }];
                    $scope.drp.crm_type = $scope.rec.arr_crm_type[0];
                    $scope.drp.status_id = $scope.rec.arr_crm_status[0];

                    $scope.rec.contactCollapse = true;
                    $scope.rec.primaryConSocialMediaCollapse = true;

                } else {
                    toaster.pop('error', 'info', res.data.error);
                    return false;
                }
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });

    }

    $scope.checkBucketValidity = function (bucket) {
        //console.log($scope.selectedSalesBucket);
        //$scope.selectedSalesBucket = angular.copy(bucket);
        //console.log(bucket);
    }

    if ($stateParams.id === undefined)
        $scope.generate_unique_id();

    $scope.add_general = function (rec, drp) {
        if (drp.status_id == undefined || drp.status_id == '') {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Status']));
            return false;
        }

        rec.country = (drp.country_id != undefined && drp.country_id != '') ? drp.country_id.id : 0;
        rec.country_id = (drp.country_id != undefined && drp.country_id != '') ? drp.country_id.id : 0;
        rec.status = (drp.status_id != undefined && drp.status_id != '') ? drp.status_id.id : 0;
        rec.region_ids = (rec.region_id != undefined && rec.region_id != '') ? rec.region_id.id : 0;
        rec.pref_method_of_communication = (drp.pref_mthod_of_comm != undefined && drp.pref_mthod_of_comm != '') ? drp.pref_mthod_of_comm.id : 0;
        rec.buying_grp = (drp.buying_grp_id != undefined && drp.buying_grp_id != '') ? drp.buying_grp_id.id : 0;
        rec.source_of_crm = (drp.sources_of_crm_id != undefined && drp.sources_of_crm_id != '') ? drp.sources_of_crm_id.id : 0;
        rec.currency_id = (drp.currency != undefined && drp.currency != '') ? drp.currency.id : 0;
        rec.crm_classification = (drp.crm_classification != undefined && drp.crm_classification != '') ? drp.crm_classification.id : 0;
        rec.credit_ratings = (rec.credit_rating != undefined && rec.credit_rating != '') ? rec.credit_rating.id : 0;
        rec.ownership_types = (rec.ownership_type != undefined && rec.ownership_type != '') ? rec.ownership_type.id : 0;
        rec.crm_segment_id = (drp.crm_segment_id != undefined && drp.crm_segment_id != '') ? drp.crm_segment_id.id : 0;
        rec.crm_type = (drp.crm_type != undefined && drp.crm_type != '') ? drp.crm_type.id : 0;
        rec.crm_bank_account_id = (rec.crm_bank_account_id != undefined && rec.crm_bank_account_id != '') ? rec.crm_bank_account_id : 0;
        rec.crm_posting_group_id = (drp.posting_group_ids != undefined && drp.posting_group_ids != '') ? drp.posting_group_ids.id : 0;
        
        
        if (rec.currency_id == 0) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Currency']));
            return false;
        }

        /* rec.socialmedia1 = (rec.socialmedia1 != undefined && rec.socialmedia1 != '') ? rec.socialmedia1 : 0;
        rec.socialmedia2 = (rec.socialmedia2 != undefined && rec.socialmedia2 != '') ? rec.socialmedia2 : 0;
        rec.socialmedia3 = (rec.socialmedia3 != undefined && rec.socialmedia3 != '') ? rec.socialmedia3 : 0;
        rec.socialmedia4 = (rec.socialmedia4 != undefined && rec.socialmedia4 != '') ? rec.socialmedia4 : 0;
        rec.socialmedia5 = (rec.socialmedia5 != undefined && rec.socialmedia5 != '') ? rec.socialmedia5 : 0; */

        rec.socialmedia1s = (rec.socialmedia1 != undefined && rec.socialmedia1 != '') ? rec.socialmedia1.id : 0;
        rec.socialmedia2s = (rec.socialmedia2 != undefined && rec.socialmedia2 != '') ? rec.socialmedia2.id : 0;
        rec.socialmedia3s = (rec.socialmedia3 != undefined && rec.socialmedia3 != '') ? rec.socialmedia3.id : 0;
        rec.socialmedia4s = (rec.socialmedia4 != undefined && rec.socialmedia4 != '') ? rec.socialmedia4.id : 0;
        rec.socialmedia5s = (rec.socialmedia5 != undefined && rec.socialmedia5 != '') ? rec.socialmedia5.id : 0;


        // if (rec.web_address != undefined)
        if (rec.web_address != undefined && rec.web_address.length > 0)
            rec.web_address = (rec.web_address.indexOf('://') === -1) ? 'http://' + rec.web_address : rec.web_address;

        if (angular.element('#genis_billing_address').is(':checked') == false)
            rec.is_billing_address = 0;

        if (angular.element('#genis_delivery_collection_address').is(':checked') == false)
            rec.is_delivery_collection_address = 0;


        if (angular.element('#genis_invoice_address').is(':checked') == false)
            rec.is_invoice_address = 0;

        // Location address or postcode is mandatory if you want tad phone or email
        if ($scope.rec.phone != undefined && $scope.rec.phone != "" || $scope.rec.email != undefined && $scope.rec.email != "") {
            var addresscheck = false;
            var postcodecheck = false;
            if ($scope.rec.address_1 == null || $scope.rec.address_1 == "" || $scope.rec.address_1 == undefined) {
                addresscheck = true;
            }
            if ($scope.rec.postcode == null || $scope.rec.postcode == "" || $scope.rec.postcode == undefined) {
                postcodecheck = true;
            }
        }
        if (addresscheck && postcodecheck) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(231, ['Address Line 1', 'Postcode']));
            return;
        }

        if (!(rec.id > 0))
            rec.type = 1;

        rec.token = $scope.$root.token;

        if ($scope.rec.crm_code != undefined) {
            // if (rec.is_delivery_collection_address != 0)
            //     toaster.pop('warning', 'info', "Contact and Delivery Hours can be added on Other Locations tab.");

            $scope.UpdateForm(rec);
        }
        else {

            $scope.showLoader = true;
            rec.crmModuleType = 1;  
            $scope.recDupChk = rec;

            var duplicationChkUrl = $scope.$root.sales + "crm/crm/duplication-chk-crm";

            $http
                .post(duplicationChkUrl, rec)
                .then(function (res) {

                    if (res.data.ack == true) {
                        $scope.showLoader = false;

                        $scope.errorMsg = res.data.error;

                        ngDialog.openConfirm({
                            template: 'app/views/crm/duplicationChkModal.html',
                            className: 'ngdialog-theme-default-custom',
                            scope: $scope
                        }).then(function (value) {

                            /* code to get CRM code Start */

                            if (rec.is_delivery_collection_address != 0)
                                toaster.pop('warning', 'info', "Contact and Delivery Hours can be added on Other Locations tab.");

                            var name = $scope.$root.base64_encode('crm');
                            var no = $scope.$root.base64_encode('crm_no');
                            var module_category_id = 2;

                            $scope.showLoader = true;

                            $http
                                .post(getCodeUrl, {
                                    'is_increment': 1,
                                    'token': $scope.$root.token,
                                    'tb': name,
                                    'm_id': 9,
                                    'no': no,
                                    'category': '',
                                    'brand': '',
                                    'module_category_id': module_category_id,
                                    'type': '1,2',
                                    'status': ''
                                })
                                .then(function (coderes) {

                                    if (coderes.data.ack == 1) {
                                        // $scope.showLoader = false;

                                        $scope.rec.crm_code = coderes.data.code;
                                        $scope.rec.crm_no = coderes.data.nubmer;
                                        $scope.rec.code_type = module_category_id; //res.data.code_type;
                                        $scope.count_result++;

                                        if (coderes.data.type == 1) {
                                            $scope.product_type = false;
                                        } else {
                                            $scope.product_type = true;
                                        }

                                        if ($scope.rec.crm_code != undefined) {

                                            /* code to add CRM Start */
                                            $scope.UpdateForm(rec);
                                            /* code to add CRM End */

                                        } else toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(231, ['CRM No.']));
                                    } else {
                                        toaster.pop('error', 'info', coderes.data.error);
                                        return false;
                                    }
                                }).catch(function (message) {
                                    $scope.showLoader = false;

                                    throw new Error(message.data);
                                    console.log(message.data);
                                });
                            /* code to get CRM code End */

                        }, function (reason) {
                            $scope.showLoader = false;
                            console.log('Modal promise rejected. Reason: ', reason);
                        });

                    } else {
                        /* code to get CRM code Start */

                        if (rec.is_delivery_collection_address != 0)
                            toaster.pop('warning', 'info', "Contact and Delivery Hours can be added on Other Locations tab.");

                        var name = $scope.$root.base64_encode('crm');
                        var no = $scope.$root.base64_encode('crm_no');
                        var module_category_id = 2;

                        $scope.showLoader = true;

                        $http
                            .post(getCodeUrl, {
                                'is_increment': 1,
                                'token': $scope.$root.token,
                                'tb': name,
                                'm_id': 9,
                                'no': no,
                                'category': '',
                                'brand': '',
                                'module_category_id': module_category_id,
                                'type': '1,2',
                                'status': ''
                            })
                            .then(function (coderes) {

                                if (coderes.data.ack == 1) {
                                    // $scope.showLoader = false;

                                    $scope.rec.crm_code = coderes.data.code;
                                    $scope.rec.crm_no = coderes.data.nubmer;
                                    $scope.rec.code_type = module_category_id; //res.data.code_type;
                                    $scope.count_result++;

                                    if (coderes.data.type == 1) {
                                        $scope.product_type = false;
                                    } else {
                                        $scope.product_type = true;
                                    }

                                    if ($scope.rec.crm_code != undefined) {

                                        /* code to add CRM Start */
                                        $scope.UpdateForm(rec);
                                        /* code to add CRM End */

                                    } else toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(231, ['CRM No.']));
                                } else {
                                    toaster.pop('error', 'info', coderes.data.error);
                                    return false;
                                }
                            }).catch(function (message) {
                                $scope.showLoader = false;

                                throw new Error(message.data);
                                console.log(message.data);
                            });
                        /* code to get CRM code End */
                    }

                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
                });
        }
    }

    //$scope.selectedSalesBucket = {};

    ///* Function to Update CRM General Form*/
    $scope.UpdateForm = function (rec) {
        console.log("inside update form");
        // for primary contact crm

        /* if (rec.social_mediasconatctcrm != undefined) {

            if (rec.social_mediasconatctcrm[0] != undefined) {
                if (rec.social_mediasconatctcrm[0].csocialmedia != undefined) {
                    rec.csocialmedia1 = rec.social_mediasconatctcrm[0].csocialmedia.id;
                    rec.csocialmedia1_value = rec.social_mediasconatctcrm[0].csocialmedia_value;
                }
            }

            if (rec.social_mediasconatctcrm[1] != undefined) {
                if (rec.social_mediasconatctcrm[1].csocialmedia != undefined) {
                    rec.csocialmedia2 = rec.social_mediasconatctcrm[1].csocialmedia.id;
                    rec.csocialmedia2_value = rec.social_mediasconatctcrm[1].csocialmedia_value;
                }
            }

            if (rec.social_mediasconatctcrm[2] != undefined) {
                if (rec.social_mediasconatctcrm[2].csocialmedia != undefined) {
                    rec.csocialmedia3 = rec.social_mediasconatctcrm[2].csocialmedia.id;
                    rec.csocialmedia3_value = rec.social_mediasconatctcrm[2].csocialmedia_value;
                }
            }

            if (rec.social_mediasconatctcrm[3] != undefined) {
                if (rec.social_mediasconatctcrm[3].csocialmedia != undefined) {
                    rec.csocialmedia4 = rec.social_mediasconatctcrm[3].csocialmedia.id;
                    rec.csocialmedia4_value = rec.social_mediasconatctcrm[3].csocialmedia_value;
                }
            }

            if (rec.social_mediasconatctcrm[4] != undefined) {
                if (rec.social_mediasconatctcrm[4].csocialmedia != undefined) {
                    rec.csocialmedia5 = rec.social_mediasconatctcrm[4].csocialmedia.id;
                    rec.csocialmedia5_value = rec.social_mediasconatctcrm[4].csocialmedia_value;
                }
            }
        } */

        if ($scope.rec.crm_code != undefined) {
            // var addcrmUrl = $scope.$root.sales + "crm/crm/add-crm";
            //if ($scope.$root.crm_id > 0)
            var addcrmUrl = $scope.$root.sales + "crm/crm/update-crm";

            if (rec.currency_id) {
                $rootScope.cust_current_edit_currency = $scope.$root.get_obj_frm_arry($rootScope.arr_currency, rec.currency_id);
            } else {
                $rootScope.cust_current_edit_currency = $scope.$root.defaultCurrency;
            }


            if ($scope.rec.contact_person != undefined) {
                if ($scope.rec.contact_person.length > 0) {
                    $scope.add_alt_contact(rec, 2);
                    rec.contact = $scope.addContactData;
                }
            }

            if ($scope.rec.address_1 != undefined) {
                if ($scope.rec.address_1.length > 0) {
                    $scope.addAltlocationfromGeneral(rec);
                    rec.loc = $scope.addLocdata;
                } else if ($scope.rec.postcode != undefined && $scope.rec.postcode.length > 0) {
                    $scope.addAltlocationfromGeneral(rec);
                    rec.loc = $scope.addLocdata;
                }
                else
                    rec.loc = {};
            } else if ($scope.rec.postcode != undefined) {
                if ($scope.rec.postcode.length > 0) {
                    $scope.addAltlocationfromGeneral(rec);
                    rec.loc = $scope.addLocdata;
                }
            }
            else
                rec.loc = {};

            if (rec.loc.depot == undefined && rec.alt_loc_id > 0) {
                $scope.showLoader = false;
                toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(378, ['Primary Location']));
                return false;
            }

            // if no bucket is there in this CRM record, it'll allow the user to select the sales bucket
            /* if ($scope.selectedSalesBucket.obj != undefined && $scope.selectedSalesBucket.obj.id) {
                rec.selectedSalesBucket = $scope.selectedSalesBucket.obj;
            } */

            if (angular.element('#verified').is(':checked') == false)
                rec.verified_chk = 0;
            else rec.verified_chk = 1;

            rec.retailer = $scope.$root.retailer;
            //rec.last_selected_bucket  = $scope.last_selected_bucket;
            rec.social_media_arr = $scope.socialMediasGeneral.crmSM;
            $scope.showLoader = true;
            $http
                .post(addcrmUrl, rec)
                .then(function (res) {

                    if (res.data.ack == true) {
                        // $scope.showLoader = false;
                        
                        //console.log("here:"+$stateParams.id);

                        // $scope.$root.crm_id = res.data.crm_id;

                        if ($scope.$root.crm_id == undefined)  
                            $scope.$root.crm_id = res.data.crm_id;

                         if(!$scope.rec.alt_loc_id && res.data.alt_loc_id) 
                            $scope.rec.alt_loc_id = res.data.alt_loc_id;

                         if(!$scope.rec.alt_contact_id && res.data.alt_contact_id) 
                            $scope.rec.alt_contact_id = res.data.alt_contact_id;   

                         
                        if ($scope.RTMCrmList != undefined && $scope.RTMCrmList.length > 0)
                            $scope.AddRTM(1);
                        if ($stateParams.id != undefined)
                            toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                        else
                            toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));

                        $scope.$root.lblButton = 'Add New';

                        if ($scope.$root.crm_id === undefined)
                            return;

                        rec.contact_name = rec.contact_person;
                        rec.web_add = rec.web_address;

                        // if ($scope.rec.old_contact != $scope.rec.contact_person)

                        if ($scope.rec.old_status != rec.status)
                            $scope.add_status_history($scope.$root.crm_id, rec);

                        if ($scope.rec.credit_rating != undefined) {
                            if ($scope.rec.credit_rating_old != rec.credit_rating.id)
                                $scope.add_credit_rating_history($scope.$root.crm_id, rec);
                        }

                        // if ($scope.isBucketChanged)
                        //     $scope.add_bucket($scope.$root.crm_id);

                        // if ($scope.isSalePerersonChanged) {
                        //     $scope.add_salespersons($scope.$root.crm_id, 2);
                        //     $scope.add_salespersons_history($scope.$root.crm_id);
                        // }

                        $scope.isSubmitting = false;

                        if ($stateParams.id === undefined)
                            $timeout(function () {
                                $state.go("app.editCrm", {
                                    id: $scope.$root.crm_id
                                });
                            }, 1500)

                        else
                        {
                            $scope.check_crm_readonly = true;
                            $scope.showLoader = false;
                        }

                        /* if (res.data.validBucket == 0) {
                            $scope.selectedSalesBucket = {};
                            toaster.pop('warning', 'info', 'The filters in the selected View Bucket do not match this record!');
                        }
                        else if (res.data.validBucket && res.data.bucketAdded) {
                            $scope.selectedSalesBucket = {};
                            toaster.pop('success', 'Add', 'View Bucket and Salepersons Added Successfully');
                            if ($stateParams.id !== undefined)
                                $scope.get_crm_data_by_id();
                        } */
                    } else {
                        $scope.showLoader = false;
                        if ($stateParams.id > 0)
                            toaster.pop('error', 'Edit', res.data.error);
                        else
                            toaster.pop('error', 'Add', res.data.error);
                    }
                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
                });

        } else toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(231, ['CRM No.']));

    }

    $scope.ShowRouteToMarketList = function (crm_type) {
        $scope.searchKeyword_rmt = {};
        var type = 0;
        if (crm_type == 2) // (from RTM to indirect)
        {
            $scope.title = "Indirect List";
            $scope.route_to_market_type = 1;
            type = 1;
        }
        else if (crm_type == 3) // (from indirect to RTM)
        {
            $scope.title = "Route to Market List"
            type = 2;
            $scope.route_to_market_type = 2;
        }
        else {
            return;
        }
        angular.forEach($scope.RTMCrmList, function (crm) {
            crm.chk = false;
        });
        var crm_id = ($scope.$root.crm_id != undefined) ? $scope.$root.crm_id : 0;
        var postData = {
            'type': type,
            'crm_id': crm_id,
            token: $scope.$root.token
        }
        var ApiAjax = $scope.$root.sales + "crm/crm/get-all-route-to-market";
        $scope.RTMCrmListTemp = [];
        angular.copy($scope.RTMCrmList, $scope.RTMCrmListTemp);
        var found_is_prefered = false;
        $scope.showLoader = true;
        $http
            .post(ApiAjax, postData)
            .then(function (res) {
                if (res.data.ack == true) {

                    $scope.RTMCrmList = res.data.response.RTMCrmList;
                    $scope.LinkedRTMCrmList = res.data.response.LinkedRTMCrmList;
                    $scope.selectedRouteToMarkets = '';
                    angular.forEach($scope.RTMCrmList, function (crm) {
                        crm.chk = false;
                        crm.is_prefered = false;
                        angular.forEach($scope.LinkedRTMCrmList, function (link_rtm) {
                            if (crm.id == link_rtm.crm_id) {
                                crm.chk = true;
                                $scope.selectedRouteToMarkets += crm.code + ', ';
                                if (Number(link_rtm.is_prefered) > 0) {
                                    found_is_prefered = true;
                                    crm.is_prefered = 1;
                                }
                            }
                        });


                    });
                    $scope.checkSingleRMT(true);
                    angular.element('#customer_route_to_market_modal').modal('show');
                    if ($scope.selectedRouteToMarkets.length > 0)
                        $scope.selectedRouteToMarkets = $scope.selectedRouteToMarkets.slice(0, -2);
                }
                else {
                    if (type == 1)
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(232, ['Direct CRMs']));
                    else
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(232, ['Route To Market']));

                }

                if (res.data.ack != undefined) {
                    angular.forEach($scope.RTMCrmList, function (crm) {
                        angular.forEach($scope.RTMCrmListTemp, function (selected_rtm) {
                            if (crm.id == selected_rtm.id && !crm.chk && selected_rtm.chk) {
                                crm.chk = true;
                                $scope.selectedRouteToMarkets += crm.code + ', ';
                                if (found_is_prefered == false && Number(selected_rtm.is_prefered) > 0)
                                    crm.is_prefered = 1;
                            }
                        });
                    });
                    $scope.showLoader = false;
                }
            });

    }
    $scope.ShowIndirectCustomers = function (crm_id) {
        console.log(crm_id);
        $scope.searchKeyword_rmt_sub = {};
        var postUrl = $scope.$root.sales + "crm/crm/get-route-to-market-associated-indirect-crm";
        $scope.showLoader = true;
        $http
            .post(postUrl, {
                crm_id: crm_id,
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.RTMCrmList_sub = res.data.response;
                    angular.element('#customer_route_to_market_modal_sub').modal('show');
                    $scope.showLoader = false;
                } else {
                    toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(233));
                    $scope.showLoader = false;
                }
            });
    }
    $scope.CheckAllRMT = function (flg) {
        var chk_is_prefered = 0;
        angular.forEach($scope.RTMCrmList, function (obj) {
            obj.chk = flg;

            if (flg == false && obj.is_prefered == true)
                obj.is_prefered = false;

            if (flg == true && obj.is_prefered == true)
                chk_is_prefered = 1;
        });

        if (flg == true && chk_is_prefered == 0)
            $scope.RTMCrmList[0].is_prefered = true;
    }

    $scope.CheckPreferedRMT = function (rec) {
        angular.forEach($scope.RTMCrmList, function (obj) {
            obj.is_prefered = false;
            if (obj.id == rec.id) {
                obj.is_prefered = true;
                obj.chk = true;
            }
        });
    }

    $scope.checkSingleRMT = function (rec) {
        if (rec.chk == false) {
            rec.is_prefered = false;
            $scope.searchKeyword_rmt.chk = false;
        }
        else {
            if (rec.crm_type == 1) {
                ngDialog.openConfirm({
                    template: 'modalConvertCRMToIndirect',
                    className: 'ngdialog-theme-default-custom'
                }).then(function (value) {
                    console.log('checked');
                }, function (reason) {
                    //console.log('Modal promise rejected. Reason: ', reason);
                    rec.chk = false;
                });
            }
            var flg = true;
            angular.forEach($scope.RTMCrmList, function (obj) {
                if (obj.chk == false) {
                    flg = false;
                }
            });

            if (flg) // all true
                $scope.searchKeyword_rmt.chk = true;
            else
                $scope.searchKeyword_rmt.chk = false;

        }
    }

    $scope.AddRTM = function (isSave) {
        var str = '';
        var selected_rows = [];

        if ($scope.drp.crm_type.id == 1)
            $scope.RTMCrmList = [];

        angular.forEach($scope.RTMCrmList, function (crm) {
            if (crm.chk == true) {
                str += crm.code + ', ';
                selected_rows.push(crm);
            }
        });
        $scope.selectedRouteToMarkets = str.slice(0, -2);
        angular.element('#customer_route_to_market_modal').modal('hide');
        if (isSave == 1) {
            var postData = {
                'crm_id': $scope.$root.crm_id,
                'crm_code': $scope.rec.crm_code,
                'rmt_list': selected_rows,
                'type': $scope.drp.crm_type.id,
                token: $scope.$root.token
            }

            var ApiAjax = $scope.$root.sales + "crm/crm/update-route-to-market";
            $http
                .post(ApiAjax, postData)
                .then(function (res) {
                    if (res.data.ack == true) {
                        if (str.length > 0)
                            $scope.selectedRouteToMarkets = str.slice(0, -2);

                        angular.element('#customer_route_to_market_modal').modal('hide');
                    }
                    else
                        toaster.pop('error', 'Deleted', toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(106)));
                });
        }
    }

    $scope.getBankAccount = function (arg) {
        
        if(!$scope.check_crm_readonly){
        $scope.title = 'Payable Bank';
        var getBankUrl = $scope.$root.setup + "general/bank-accounts";

        //arr_bank

        var postData = { 'token': $scope.$root.token, 'filter_id': 152 };
        $http
            .post(getBankUrl, postData)
            .then(function (res) {
                $scope.columns = [];
                //	$scope.columns = res.data.columns;
                $scope.record = res.data.response;


                angular.forEach(res.data.response[0], function (val, index) {
                    $scope.columns.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                });


                angular.element('#_model_modal_bank_order').modal({ show: true });

            });
        }

    }


    $scope.confirm_bank = function (btc) {
        
        $scope.rec.crm_bank_name = btc.bank_name;
        $scope.rec.crm_bank_account_id = btc.id;
        angular.element('#_model_modal_bank_order').modal('hide');
    }
    


    $scope.set_link = function () {
        if ($scope.rec.web_address != undefined && $scope.rec.web_address.length > 0)
            $scope.rec.web_address = ($scope.rec.web_address.indexOf('://') === -1) ? 'http://' + $scope.rec.web_address : $scope.rec.web_address;
    }

    $scope.deleteCRM = function () {
        var delUrl = $scope.$root.sales + "crm/crm/delete-crm";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $scope.showLoader = true;
            $http
                .post(delUrl, {
                    id: $stateParams.id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $scope.showLoader = false;
                        $timeout(function () {
                            if($scope.$root.retailer==1)
                            $state.go('app.crm_retailer')
                            else
                            $state.go('app.crm')
                        }, 1500);
                    } else {
                        toaster.pop('error', 'Deleted', res.data.error);
                        $scope.showLoader = false;
                    }
                });
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    };

    $scope.convert = function () {

        if ($scope.rec.crm_type == 3) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(234, ['Indirect CRM','Customer']));
        }
        else {
            ngDialog.openConfirm({
                template: 'app/views/crm/_confirm_convert_modal.html',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                var customerModuleCodeType = 1;
                
                var checkformodulecode = $scope.$root.sales + "customer/customer/check_for_module_code";
                $http
                    .post(checkformodulecode, {
                        'token': $scope.$root.token
                    })
                    .then(function (res) {
                        if (res.data.ack == true) {

                            customerModuleCodeType = res.data.moduleCodeType;
                            if (customerModuleCodeType == 0) {
                                $scope.product_type = true;
                                $scope.count_result = 0;
                                var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
                                var name = $scope.$root.base64_encode('customer');
                                var no = $scope.$root.base64_encode('customer_no');

                                var module_category_id = 2;


                                $http
                                    .post(getCodeUrl, {
                                        'is_increment': 1,
                                        'token': $scope.$root.token,
                                        'tb': name,
                                        'm_id': 54,
                                        'no': no,
                                        'category': '',
                                        'brand': '',
                                        'module_category_id': module_category_id,
                                        'type': '2,3'
                                        //'status': '18'
                                    })
                                    .then(function (res) {

                                        if (res.data.ack == true) {


                                            var convUrl = $scope.$root.sales + "crm/crm/convert";
                                            $http
                                                .post(convUrl, {
                                                    id: id,
                                                    'module': 1,
                                                    'token': $scope.$root.token,
                                                    'cust_no': res.data.nubmer,
                                                    'cust_code': res.data.code
                                                })
                                                .then(function (res) {
                                                    // $data.splice(index, 1);

                                                    if (res.data.ack == true) {
                                                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(229, ['Customer']));
                                                        $timeout(function () {
                                                            $state.go("app.crm");
                                                        }, 1500);
                                                    } else
                                                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(235, ['Customer']));

                                                }).catch(function (message) {
                                                    $scope.showLoader = false;

                                                    throw new Error(message.data);
                                                    console.log(message.data);
                                                });


                                        } else {
                                            toaster.pop('error', 'info', res.data.error);
                                            return false;
                                        }
                                    }).catch(function (message) {
                                        $scope.showLoader = false;

                                        throw new Error(message.data);
                                        console.log(message.data);
                                    });

                            }
                        else {
                            var convUrl = $scope.$root.sales + "crm/crm/convert";
                            $http
                                .post(convUrl, {
                                    id: id,
                                    'module': 1,
                                    'customerModuleCodeType': 1,
                                    'token': $scope.$root.token
                                })
                                .then(function (res) {
                                    // $data.splice(index, 1);

                                    if (res.data.ack == true) {
                                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(229, ['Customer']));
                                        $timeout(function () {
                                            $state.go("app.crm");
                                        }, 1500);
                                    } else
                                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(235, ['Customer']));

                                }).catch(function (message) {
                                    $scope.showLoader = false;

                                    throw new Error(message.data);
                                    console.log(message.data);
                                });
                        }
                    }


                    });

                


                


            }, function (reason) {
                //console.log('Modal promise rejected. Reason: ', reason);
            });
        }
    };

    $scope.convertToCRM = function () {

        if ($scope.rec.crm_type == 3) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(234, ['Indirect CRM','Customer']));
        }
        else {
            ngDialog.openConfirm({
                template: 'app/views/crm/_confirm_convert_modal2.html',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {

                var customerModuleCodeType = 1;
                
                var convUrl = $scope.$root.sales + "crm/crm/convert-to-crm";
                $http
                    .post(convUrl, {
                        'id': id,
                        'module': 1,
                        'customerModuleCodeType': 1,
                        'token': $scope.$root.token
                    })
                    .then(function (res) {

                        if (res.data.ack == true) {
                            toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(229, ['CRM']));
                            $timeout(function () {
                                $state.go("app.crm");
                            }, 1500);
                        } else
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(235, ['CRM']));

                    }).catch(function (message) {
                        $scope.showLoader = false;

                        throw new Error(message.data);
                        console.log(message.data);
                    });
                            
          
            }, function (reason) {
                //console.log('Modal promise rejected. Reason: ', reason);
            });
        }
    };

    $scope.unsubscribeEmail = function (param) {

        if (param == true) {
            ngDialog.openConfirm({
                template: 'unsubscribeEmailFromCRM',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                // console.log(param);

                $scope.rec.unsubscribeEmail_address = 1;

                /* var convUrl = $scope.$root.sales + "crm/crm/unsubscribe-email-from-CRM";
                $http
                    .post(convUrl, {
                        'CRMID': id,
                        'token': $scope.$root.token
                    })
                    .then(function (res) {

                        if (res.data.ack == true) {
                           // $state.go("app.editCustomer", { id: id });
                            toaster.pop('success', 'Info', 'Converted to Customer.');
                        } else
                            toaster.pop('error', 'Deleted', 'Can\'t converted to Customer'); 

                    }).catch(function (message) {
                        $scope.showLoader = false;
                        throw new Error(message.data);
                        console.log(message.data);
                    }); */
            }, function (reason) {
                $scope.rec.unsubscribeEmail_address = 0;
                $scope.rec.unsubscribeEmail = 0;
            });

        } else {
            $scope.rec.unsubscribeEmail = 0;
            $scope.rec.unsubscribeEmail_address = 0;
        }
    }


    // sync location  primary record with general start
    $scope.getAltLocationfrmGeneral = function (arr, type) {
        if (type != undefined) {
            if (arr) {
                $scope.rec.address_1  = $scope.rec.primary_address_1;
                $scope.rec.address_2  = $scope.rec.primary_address_2;
                $scope.rec.city       = $scope.rec.primary_city;
                $scope.rec.county     = $scope.rec.primary_county;
                $scope.rec.postcode   = $scope.rec.primary_postcode;
                $scope.rec.alt_loc_id = $scope.rec.primary_id;

                if ($scope.rec.primary_country != undefined && $rootScope.country_type_arr != undefined)
                    $scope.drp.country_id = $scope.$root.get_obj_frm_arry($rootScope.country_type_arr, $scope.rec.primary_country);

                /* if ($scope.rec.primary_is_billing_address == 1)
                    $scope.rec.is_billing_address = 1;
                else
                    $scope.rec.is_billing_address = 0;

                if ($scope.rec.primary_is_invoice_address == 1)
                    $scope.rec.is_invoice_address = 1;
                else
                    $scope.rec.is_invoice_address = 0;

                if ($scope.rec.primary_is_delivery_collection_address == 1)
                    $scope.rec.is_delivery_collection_address = 1;
                else
                    $scope.rec.is_delivery_collection_address = 0; */

                if ($scope.rec.primary_is_billing_address == 1)
                    $scope.rec.is_billing_address = true;
                else
                    $scope.rec.is_billing_address = false;

                if ($scope.rec.primary_is_invoice_address == 1)
                    $scope.rec.is_invoice_address = true;
                else
                    $scope.rec.is_invoice_address = false;

                if ($scope.rec.primary_is_delivery_collection_address == 1)
                    $scope.rec.is_delivery_collection_address = true;
                else
                    $scope.rec.is_delivery_collection_address = false;

            } else {

                $scope.rec.address_1 = null;
                $scope.rec.address_2 = null;
                $scope.rec.city = null;
                $scope.rec.county = null;
                $scope.rec.postcode = null;
                $scope.rec.alt_loc_id = null;

                $scope.rec.is_billing_address = 0;
                $scope.rec.is_delivery_collection_address = 0;
                $scope.rec.is_invoice_address = 0;

                angular.forEach($rootScope.country_type_arr, function (elem) {
                    if (elem.id == $scope.$root.defaultCountry)
                        $scope.drp.country_id = elem;
                });
            }
        } else {

            $scope.postData = {
                'value': $scope.$root.crm_id,
                token: $scope.$root.token,
                'module_type': $rootScope.CRMType,
                is_primary: 1
            }
            var ApiAjax = $scope.$root.sales + "crm/crm/alt-depots";

            $http
                .post(ApiAjax, $scope.postData)
                .then(function (alt_res) {
                    if (alt_res.data.record.ack == true) {

                        $scope.rec.address_1 = alt_res.data.record.result[0].address_1;
                        $scope.rec.address_2 = alt_res.data.record.result[0].address_2;
                        $scope.rec.city = alt_res.data.record.result[0].city;
                        $scope.rec.county = alt_res.data.record.result[0].county;
                        $scope.rec.postcode = alt_res.data.record.result[0].postcode;

                        $scope.rec.alt_loc_id = alt_res.data.record.result[0].id;

                        if ($scope.rec.country_id != undefined && $rootScope.country_type_arr != undefined)
                            $scope.drp.country_id = $scope.$root.get_obj_frm_arry($rootScope.country_type_arr, alt_res.data.record.result[0].country);

                        if (alt_res.data.record.result[0].is_billing_address == 1)
                            $scope.rec.is_billing_address = 1;
                        else $scope.rec.is_billing_address = 0;

                        if (alt_res.data.record.result[0].is_delivery_collection_address == 1)
                            $scope.rec.is_delivery_collection_address = 1;
                        else $scope.rec.is_delivery_collection_address = 0;

                        if (alt_res.data.record.result[0].is_invoice_address == 1)
                            $scope.rec.is_invoice_address = 1;
                        else $scope.rec.is_invoice_address = 0;
                    } else {
                        $scope.rec.address_1 = null;
                        $scope.rec.address_2 = null;
                        $scope.rec.city = null;
                        $scope.rec.county = null;
                        $scope.rec.postcode = null;
                        $scope.rec.alt_loc_id = null;

                        $scope.rec.is_billing_address = 0;
                        $scope.rec.is_delivery_collection_address = 0;
                        $scope.rec.is_invoice_address = 0;

                        angular.forEach($rootScope.country_type_arr, function (elem) {
                            if (elem.id == $scope.$root.defaultCountry)
                                $scope.drp.country_id = elem;
                        });
                    }
                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
                });
        }
    }

    $scope.addAltlocationfromGeneral = function (rec) {

        var rec2 = {};
        rec2.token = $scope.$root.token;
        rec2.module_type = $rootScope.CRMType;
        rec2.contact_name = rec.contact_person;
        rec2.is_primary = 1;
        rec2.depot = rec.name;//'General Location';
        rec2.role = rec.job_title;
        rec2.phone = rec.phone;
        rec2.email = rec.email;
        rec2.is_primary = 1;
        rec2.is_general = 0;
        rec2.address = rec.address_1;
        rec2.address_2 = rec.address_2;
        rec2.city = rec.city;
        rec2.county = rec.county;
        rec2.postcode = rec.postcode;
        rec2.alt_loc_id = rec.alt_loc_id;
        rec2.crm_id = $scope.$root.crm_id;
        rec2.region_ids = rec.region_ids;
        rec2.country = ($scope.drp.country_id != undefined && $scope.drp.country_id != '') ? $scope.drp.country_id.id : 0;

        if (angular.element('#genis_billing_address').is(':checked') == false)
            rec2.is_billing_address = 0;
        else rec2.is_billing_address = 1;

        if (angular.element('#genis_delivery_collection_address').is(':checked') == false)
            rec2.is_delivery_collection_address = 0;
        else rec2.is_delivery_collection_address = 1;

        if (angular.element('#genis_invoice_address').is(':checked') == false)
            rec2.is_invoice_address = 0;
        else rec2.is_invoice_address = 1;

        $scope.addLocdata = rec2;
    }

    $scope.selectrecordedit_general = function () {

        //console.log($scope.rec.addcontactslisting);
        //console.log($scope.record_data_contact);

        if ($scope.rec.addcontactslisting !== undefined) {
            angular.forEach($scope.rec.addcontactslisting, function (obj2) {
                angular.forEach($scope.record_data_contact, function (elem) {
                    if (elem.id == obj2.contact_id)
                        obj2.contact_id = elem;
                });
            });
        }
    }

    $scope.add_multicontact_location_dropdown_general = function (location_id, contact_id) {

        var post = {};

        post.crm_id = $rootScope.crm_id;
        post.location_id = location_id;
        post.contact_id = contact_id;
        post.token = $rootScope.token;
        post.module_type = $rootScope.CRMType;

        var postUrl = $rootScope.sales + "crm/crm/add-list-contact-location-general";
        $http
            .post(postUrl, post)
            .then(function (ress) {

            });
    }
    // sync location  primary record with general finish


    // Requests to other controllers
    var args = [];
    args[0] = $scope.$root.crm_id;
    args[1] = undefined;
    // sync contact  primary record with general start
    $scope.getAltContact_genral = function (arr, type) {


        if (type != undefined) {
            if (arr) {
                // angular.forEach(arr, function (obj, index) {

                $scope.rec.contact_person = $scope.rec.primaryc_name;
                $scope.rec.cjob_title = $scope.rec.primaryc_job_title;
                $scope.rec.cdirect_line = $scope.rec.primaryc_direct_line;
                $scope.rec.cmobile = $scope.rec.primaryc_mobile;
                $scope.rec.cphone = $scope.rec.primaryc_phone;
                $scope.rec.cfax = $scope.rec.primaryc_fax;
                $scope.rec.cemail = $scope.rec.primaryc_email;
                $scope.rec.cbooking_instructions = $scope.rec.primaryc_booking_instructions;
                $scope.rec.alt_contact_id = $scope.rec.primaryc_id;

                if ($scope.rec.primaryc_pref_method_of_communication != undefined)
                    $scope.drp.cpref_method_of_communication = $scope.$root.get_obj_frm_arry($rootScope.arr_pref_method_comm, $scope.rec.primaryc_pref_method_of_communication);

                /* $scope.rec.csocialmedia1_value = $scope.rec.primaryc_socialmedia1_value;
                $scope.rec.csocialmedia2_value = $scope.rec.primaryc_socialmedia2_value;
                $scope.rec.csocialmedia3_value = $scope.rec.primaryc_socialmedia3_value;
                $scope.rec.csocialmedia4_value = $scope.rec.primaryc_socialmedia4_value;
                $scope.rec.csocialmedia5_value = $scope.rec.primaryc_socialmedia5_value;

                angular.forEach($rootScope.social_medias, function (obj2) {

                    if (obj2.id == $scope.rec.primaryc_socialmedia1)
                        $scope.rec.csocialmedia1 = obj2;

                    if (obj2.id == $scope.rec.primaryc_socialmedia2)
                        $scope.rec.csocialmedia2 = obj2;

                    if (obj2.id == $scope.rec.primaryc_socialmedia3)
                        $scope.rec.csocialmedia3 = obj2;

                    if (obj2.id == $scope.rec.primaryc_socialmedia4)
                        $scope.rec.csocialmedia4 = obj2;

                    if (obj2.id == $scope.rec.primaryc_socialmedia5)
                        $scope.rec.csocialmedia5 = obj2;
                }); */

                $scope.tempContactSocialMedia = [];
                angular.forEach($rootScope.social_medias_contact_form, function (obj) {

                    if (obj.id == $scope.rec.primaryc_socialmedia1 && $scope.rec.primaryc_socialmedia1 != 0) {
                        obj.value = $scope.rec.primaryc_socialmedia1_value;
                        $scope.tempContactSocialMedia.push(obj);
                    }
                    if (obj.id == $scope.rec.primaryc_socialmedia2 && $scope.rec.primaryc_socialmedia2 != 0) {
                        obj.value = $scope.rec.primaryc_socialmedia2_value;
                        $scope.tempContactSocialMedia.push(obj);
                    }
                    if (obj.id == $scope.rec.primaryc_socialmedia3 && $scope.rec.primaryc_socialmedia3 != 0) {
                        obj.value = $scope.rec.primaryc_socialmedia3_value;
                        $scope.tempContactSocialMedia.push(obj);
                    }
                    if (obj.id == $scope.rec.primaryc_socialmedia4 && $scope.rec.primaryc_socialmedia4 != 0) {
                        obj.value = $scope.rec.primaryc_socialmedia4_value;
                        $scope.tempContactSocialMedia.push(obj);
                    }
                    if (obj.id == $scope.rec.primaryc_socialmedia5 && $scope.rec.primaryc_socialmedia5 != 0) {
                        obj.value = $scope.rec.primaryc_socialmedia5_value;
                        $scope.tempContactSocialMedia.push(obj);
                    }
                });
                if ($scope.tempContactSocialMedia.length) {
                    $scope.socialMediasContactGeneral = {};
                    $scope.socialMediasContactGeneral['CRMprimaryContactSM'] = $scope.tempContactSocialMedia;
                }
            } else {
                $scope.rec.contact_person = null;
                $scope.rec.cjob_title = null;
                $scope.rec.cdirect_line = null;
                $scope.rec.cmobile = null;
                $scope.rec.cphone = null;
                $scope.rec.cfax = null;
                $scope.rec.cnotes = null;
                $scope.rec.cemail = null;
                $scope.rec.alt_contact_id = null;

                $scope.rec.csocialmedia1_value = null;
                $scope.rec.csocialmedia2_value = null;
                $scope.rec.csocialmedia3_value = null;
                $scope.rec.csocialmedia4_value = null;
                $scope.rec.csocialmedia5_value = null;

                $scope.rec.csocialmedia1 = null;
                $scope.rec.csocialmedia2 = null;
                $scope.rec.csocialmedia3 = null;
                $scope.rec.csocialmedia4 = null;
                $scope.rec.csocialmedia5 = null;
            }
        } else {

            $scope.postData = {
                'crm_id': $scope.$root.crm_id,
                'module_type': $rootScope.CRMType,
                'token': $scope.$root.token,
                'is_primary': 1
            }
            var ApiAjax = $scope.$root.sales + "crm/crm/get-alt-contacts-list";
            $http
                .post(ApiAjax, $scope.postData)
                .then(function (alt_res) {

                    if (alt_res.data.ack == true) {

                        $scope.rec.contact_person = alt_res.data.response[0].name;
                        $scope.rec.cjob_title = alt_res.data.response[0].job_title;
                        $scope.rec.cdirect_line = alt_res.data.response[0].direct_line;
                        $scope.rec.cmobile = alt_res.data.response[0].mobile;
                        $scope.rec.cphone = alt_res.data.response[0].phone;
                        $scope.rec.cfax = alt_res.data.response[0].fax;
                        $scope.rec.cemail = alt_res.data.response[0].email;
                        $scope.rec.cbooking_instructions = alt_res.data.response[0].booking_instructions;
                        $scope.rec.alt_contact_id = alt_res.data.response[0].id;

                        if (alt_res.data.response[0].pref_method_of_communication != undefined) {

                            angular.forEach($rootScope.arr_pref_method_comm, function (elem) {
                                if (elem.id == alt_res.data.response[0].pref_method_of_communication) {
                                    $scope.drp.cpref_method_of_communication = elem;
                                }
                            });
                        }

                        $scope.rec.csocialmedia1_value = alt_res.data.response[0].socialmedia1_value;
                        $scope.rec.csocialmedia2_value = alt_res.data.response[0].socialmedia2_value;
                        $scope.rec.csocialmedia3_value = alt_res.data.response[0].socialmedia3_value;
                        $scope.rec.csocialmedia4_value = alt_res.data.response[0].socialmedia4_value;
                        $scope.rec.csocialmedia5_value = alt_res.data.response[0].socialmedia5_value;

                        angular.forEach($rootScope.social_medias, function (elem) {

                            if (elem.id == alt_res.data.response[0].socialmedia1)
                                $scope.rec.csocialmedia1 = elem;

                            if (elem.id == alt_res.data.response[0].socialmedia2)
                                $scope.rec.csocialmedia2 = elem;

                            if (elem.id == alt_res.data.response[0].socialmedia3)
                                $scope.rec.csocialmedia3 = elem;

                            if (elem.id == alt_res.data.response[0].socialmedia4)
                                $scope.rec.csocialmedia4 = elem;

                            if (elem.id == alt_res.data.response[0].socialmedia5)
                                $scope.rec.csocialmedia5 = elem;
                        });

                        //$scope.get_alt_contact_social_media_list($scope.rec.alt_contact_id);

                    } else {
                        $scope.rec.contact_person = null;
                        $scope.rec.cjob_title = null;
                        $scope.rec.cdirect_line = null;
                        $scope.rec.cmobile = null;
                        $scope.rec.cphone = null;
                        $scope.rec.cfax = null;
                        $scope.rec.cnotes = null;
                        $scope.rec.cemail = null;
                        $scope.rec.alt_contact_id = null;

                        /*$scope.rec.social_mediasconatctcrm = {};
                         $scope.rec.social_mediasconatctcrm = [{id: ''}];*/

                        $scope.rec.csocialmedia1_value = null;
                        $scope.rec.csocialmedia2_value = null;
                        $scope.rec.csocialmedia3_value = null;
                        $scope.rec.csocialmedia4_value = null;
                        $scope.rec.csocialmedia5_value = null;

                        $scope.rec.csocialmedia1 = null;
                        $scope.rec.csocialmedia2 = null;
                        $scope.rec.csocialmedia3 = null;
                        $scope.rec.csocialmedia4 = null;
                        $scope.rec.csocialmedia5 = null;

                    }
                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
                });
        }
        // $scope.$root.breadcrumbs[3].name = 'General';
    }

    // get assigned location listings assigned to primary contact.
    $scope.getGenAssinLoc = function (primaryContID) {

        $scope.page_title = "Assigned Locations";

        $scope.loc_columns = [];
        $scope.locationRecord = {};

        var ApiAjax = $scope.$root.sales + "crm/crm/get-PrimaryContact-Loc-Assign";
        $scope.postData = {
            'primaryc_id': primaryContID,
            'token': $scope.$root.token
        }

        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res) {
                $scope.loc_columns = [];
                $scope.locationRecord = {};

                if (res.data.ack == true) {
                    $scope.locationRecord = res.data.response;

                    angular.forEach($scope.locationRecord[0], function (val, index) {
                        if (index != 'chk' && index != 'id') {
                            $scope.loc_columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }
                    });

                    $scope.loadingprimaryLocModal = false;
                    angular.element('#primaryAssignedlocmodal').modal({
                        show: true
                    });
                } else
                    $scope.loadingprimaryLocModal = false;
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }


    $scope.add_alt_contact = function (rec, general) {

        var rec2 = {};
        rec2.token = $scope.$root.token;
        rec2.module_type = $rootScope.CRMType;

        rec2.alt_contact_id = rec.alt_contact_id;
        rec2.crm_id = $scope.$root.crm_id;
        rec2.contact_name = rec.contact_person;
        rec2.is_primary = 1;
        rec2.depot = $scope.rec.contact_person; //Main office';
        rec2.job_title = $scope.rec.cjob_title;
        rec2.direct_line = $scope.rec.cdirect_line;
        rec2.mobile = $scope.rec.cmobile;
        rec2.email = $scope.rec.cemail;
        rec2.phone = $scope.rec.cphone;
        rec2.fax = $scope.rec.cfax;
        rec2.booking_instructions = $scope.rec.cbooking_instructions;
        rec2.notes = rec.primaryc_notes;

        rec2.pref_method_of_communication = $scope.drp.cpref_method_of_communication != undefined ? $scope.drp.cpref_method_of_communication.id : 0;

        rec2.socialmedia1s = rec.csocialmedia1 != undefined ? rec.csocialmedia1.id : 0;
        rec2.socialmedia2s = rec.csocialmedia2 != undefined ? rec.csocialmedia2.id : 0;
        rec2.socialmedia3s = rec.csocialmedia3 != undefined ? rec.csocialmedia3.id : 0;
        rec2.socialmedia4s = rec.csocialmedia4 != undefined ? rec.csocialmedia4.id : 0;
        rec2.socialmedia5s = rec.csocialmedia5 != undefined ? rec.csocialmedia5.id : 0;

        rec2.socialmedia1_value = rec.csocialmedia1_value;
        rec2.socialmedia2_value = rec.csocialmedia2_value;
        rec2.socialmedia3_value = rec.csocialmedia3_value;
        rec2.socialmedia4_value = rec.csocialmedia4_value;
        rec2.socialmedia5_value = rec.csocialmedia5_value;
        rec2.social_media_arr_contact = $scope.socialMediasContactGeneral.CRMprimaryContactSM;

        $scope.addContactData = rec2;
    }


    // sync contact  primary record with general end


    $scope.add_segments = function (id) {
        var postUrl = $scope.$root.sales + "crm/crm/add-crm-segment";
        var post = {};
        var temp = [];
        angular.forEach($scope.selectedSegments, function (obj) {
            temp.push({
                id: obj.id
            });
        })

        post.id = id;
        post.segments = temp;
        post.token = $scope.$root.token;
        $http
            .post(postUrl, post)
            .then(function (res) { });
    }

    $scope.add_regions = function (id) {
        var postUrl = $scope.$root.sales + "crm/crm/add-crm-region";
        var post = {};
        var temp = [];
        angular.forEach($scope.selectedRegions, function (obj) {
            temp.push({
                id: obj.id
            });
        })

        post.id = id;
        post.regions = temp;
        post.token = $scope.$root.token;
        $http
            .post(postUrl, post)
            .then(function (res) { });
    }

    $scope.add_buying_groups = function (id) {
        var postUrl = $scope.$root.sales + "crm/crm/add-crm-buying-group";
        var post = {};
        var temp = [];
        angular.forEach($scope.selectedBuyingGroups, function (obj) {
            temp.push({
                id: obj.id
            });
        })

        post.id = id;
        post.buying_groups = temp;
        post.token = $scope.$root.token;
        $http
            .post(postUrl, post)
            .then(function (res) { });
    }

    $scope.add_credit_rating_history = function (id, rec) {


        var excUrl = $scope.$root.sales + "crm/crm/add-credit-rating-log";
        var post = {};
        post.id = id;
        post.credit_rating = rec.credit_rating.id;
        post.currency_id = rec.currency_id;
        post.token = $scope.$root.token;

        //console.log(post);
        $http
            .post(excUrl, post)
            .then(function (res) { });
    }

    /*$scope.add_credit_limit_history = function (id, rec) {
     var excUrl = $scope.$root.sales + "crm/crm/add-credit-limit-log";
     var post = {};
     post.id = id;
     post.credit_limit = rec.credit_rating;
     post.currency_id = rec.currency_id;
     post.token = $scope.$root.token;
     $http
     .post(excUrl, post)
     .then(function (res) {
     });
     }*/

    $scope.add_status_history = function (id, rec) {
        var excUrl = $scope.$root.sales + "crm/crm/add-status-log";
        var post = {};
        post.id = id;
        post.status_id = rec.status;
        post.token = $scope.$root.token;
        $http
            .post(excUrl, post)
            .then(function (res) { });
    }

    $scope.add_excluded_customers = function (groupIds, cust_prod_type_ids) {
        var pricingUrl = $scope.$root.sales + "customer/customer/get-customer-pricing";
        $http
            .post(pricingUrl, {
                'crm_ids': groupIds,
                cust_prod_type_id: cust_prod_type_ids,
                token: $scope.$root.token
            })
            .then(function (resPricing) {
                if (resPricing.data.ack == 1) {
                    angular.forEach(resPricing.data.response, function (saleItem, index) {
                        var excUrl = $scope.$root.sales + "customer/customer/add-excluded-customers";
                        var rec = {};
                        var selectedCustomers = [];
                        rec.product_id = saleItem.product_id;
                        selectedCustomers.push({
                            'id': $scope.$root.crm_id
                        });
                        rec.customers = selectedCustomers;

                        if (saleItem.customer_product_type_id == 3)
                            rec.region_id = saleItem.crm_id;
                        if (saleItem.customer_product_type_id == 4)
                            rec.segment_id = saleItem.crm_id;
                        if (saleItem.customer_product_type_id == 5)
                            rec.buying_group_id = saleItem.crm_id;

                        rec.customer_item_info_id = saleItem.id;
                        rec.token = $scope.$root.token;
                        rec.add_customer = '1';
                        $http
                            .post(excUrl, rec)
                            .then(function (res) { });
                    });
                }


            });
    }

    $scope.add_promo_excluded_customers = function (groupIds) {
        var promoUrl = $scope.$root.sales + "customer/customer/get-promotions";
        $http
            .post(promoUrl, {
                'crm_ids': groupIds,
                token: $scope.$root.token
            })
            .then(function (resPricing) {
                if (resPricing.data.ack == 1) {
                    angular.forEach(resPricing.data.response, function (prom, index) {

                        var excUrl = $scope.$root.sales + "customer/customer/add-promotion-excluded-customers";
                        var rec = {};
                        rec.product_id = 0;
                        var selectedCustomers = [];
                        selectedCustomers.push({
                            'id': $scope.$root.crm_id
                        });
                        rec.customers = selectedCustomers;

                        if (prom.customer_product_type_id == 3)
                            rec.region_id = prom.crm_id;
                        if (prom.customer_product_type_id == 4)
                            rec.segment_id = prom.crm_id;
                        if (prom.customer_product_type_id == 5)
                            rec.buying_group_id = prom.crm_id;

                        rec.sale_promotion_id = prom.id;
                        rec.token = $scope.$root.token;
                        rec.add_customer = '1';
                        $http
                            .post(excUrl, rec)
                            .then(function (res) { });
                    });
                }


            });
    }


    /////////////// CRM Social Media ////////////////////


    //$scope.rec.social_mediascrm = {};

    if ($stateParams.id == undefined)
        $scope.rec.social_mediascrm = [{
            id: ''
        }];


    $scope.crm_social_medias = [];
    $scope.columns_crm_social = [];
    $scope.crmMediaForm = {};
    $scope.socialForm = {};


    /////// End CRM Social Media///////////


    //////// Alt-Contact Social Media////////


    $scope.rec.social_mediasconatctcrm = {};
    $scope.columns_crm_socialcontact = [];

    if ($stateParams.id == undefined)
        $scope.rec.social_mediasconatctcrm = [{
            id: ''
        }];


    ////////// End Alt. Contact Social Media//


    //general tab bucket
    $scope.getbucketList_signle = function () {
        $scope.columns_bucket = [];
        $scope.record_bucket = {};
        $scope.rec.token = $scope.$root.token;
        //$scope.rec.bucket_id = id;
        $scope.title = 'Sales bucket';
        var bucketApi = $scope.$root.sales + "customer/sale-bucket/get-sale-bucket-customize-list";
        $http
            .post(bucketApi, postData)

            .then(function (res) {

                $scope.record_bucket = res.data.response;
                angular.forEach(res.data.response[0], function (val, index) {
                    $scope.columns_bucket.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                });
            });
        ngDialog.openConfirm({
            template: 'modalBucketDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (result) {

            angular.forEach(result, function (elem) {

                if (index == 'Code')
                    $scope.rec.code = elem;
                if (index == 'Name') {
                    $scope.rec.name = elem;
                    $scope.rec.bucket_id = result.id;
                }

            });
            $scope.rec.bucket_id = result.id;
            $scope.rec.bucket = result.name;
            ////console.log(result.id+"-"+result.name);

        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.bucket_selected_array = [];
    $scope.bucket_array = [];
    $scope.isBucketChanged = true;

    $scope.PendingSelBucket = [];
    $scope.PendingSelBucketTooltip = "";

    $scope.getbucket_array = function (isShow) {
        $scope.title = 'Bucket';
        /*if (!isShow)
         angular.element('#Bucket_selectedModal').modal({show: true});*/

        // if ($scope.bucket_array.length > 0) return;
        $scope.showLoader = true;
        $scope.columns = [];
        $scope.bucket_array = [];

        //var bucketApi = $scope.$root.sales + "customer/sale-bucket/get-sale-bucket-customize-list";


        var bucketApi = $scope.$root.sales + "customer/sale-bucket/get-sale-bucket-list";
        // var postData = {'g_id': bucket_id, 'type': "6", 'token': $scope.$root.token};
        $http
            .post(bucketApi, {
                'token': $scope.$root.token
            }).then(function (res) {
                if (res.data.ack == true) {

                    angular.forEach(res.data.response, function (obj) {
                        obj.chk = false;
                        obj.isPrimary = false;
                        if ($scope.bucket_selected_array.length > 0) {
                            angular.forEach($scope.bucket_selected_array, function (obj2) {
                                if (obj.id == obj2.id) {
                                    obj.chk = true;
                                    if (obj2.isPrimary)
                                        obj.isPrimary = true;
                                }
                            });
                        }
                        $scope.bucket_array.push(obj);
                    });
                    angular.forEach(res.data.response[0], function (val, index) {
                        if (index != 'chk' && index != 'id' && index != 'isPrimary') {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }
                    });

                    if (!isShow)
                        angular.element('#Bucket_selectedModal').modal({
                            show: true
                        });
                } else toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                $scope.showLoader = false;
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });

    }

    $scope.submitPendingSelBucket = function () {

        $scope.PendingSelBucket = [];
        $scope.PendingSelBucketTooltip = "";
        var isPrimary = false;
        //console.log($scope.bucket_array);

        for (var i = 0; i < $scope.bucket_array.length; i++) {
            //console.log($scope.bucket_array[i]);
            if ($scope.bucket_array[i].chk == true) {
                $scope.PendingSelBucket.push($scope.bucket_array[i]);
                $scope.PendingSelBucketTooltip = $scope.PendingSelBucketTooltip + $scope.bucket_array[i].name + "; ";
            }
        }
        $scope.PendingSelBucketTooltip = $scope.PendingSelBucketTooltip.slice(0, -2);

        $scope.bucket_selected_array = $scope.PendingSelBucket;
        $scope.SelBucketTooltip = $scope.PendingSelBucketTooltip;

        toaster.pop('warning', 'Info', "The Bucket list has updated now. Please select Salepersons again.");
        $scope.selectedSalespersons = [];
        $scope.SelSalePerGenTooltip = '';

        angular.element('#Bucket_selectedModal').modal('hide');
    }

    $scope.clearPendingSelBucket = function () {
        $scope.PendingSelBucket = [];
        $scope.PendingSelBucketTooltip = "";
        angular.element('#Bucket_selectedModal').modal('hide');
    }



    $scope.checkAllBucket = function (val) {
        $scope.PendingSelBucket = [];

        if (val == true) {

            $scope.isBucketChanged = true;
            var isPrimary = false;

            for (var i = 0; i < $scope.bucket_array.length; i++) {
                if ($scope.bucket_array[i].isPrimary)
                    isPrimary = true;
                $scope.bucket_array[i].chk = true;
                $scope.PendingSelBucket.push($scope.bucket_array[i]);
            }
            if (!isPrimary) {
                $scope.bucket_array[0].isPrimary = true;
                $scope.PendingSelBucket[0].isPrimary = true;
            }

        } else {
            for (var i = 0; i < $scope.bucket_array.length; i++) {
                $scope.bucket_array[i].chk = false;
                $scope.bucket_array[i].isPrimary = false;
            }
            $scope.PendingSelBucket = [];
        }
    }


    $scope.selectbucket_chk = function (bucket) {
        $scope.isBucketChanged = true;
        $scope.selectedAll = false;

        /*console.log(bucket);
         console.log($scope.bucket_array);*/

        for (var i = 0; i < $scope.bucket_array.length; i++) {

            if (bucket.id == $scope.bucket_array[i].id) {

                //console.log($scope.bucket_array[i].chk);

                if ($scope.bucket_array[i].chk == true)
                    $scope.bucket_array[i].chk = false;
                else
                    $scope.bucket_array[i].chk = true;
            }
        }
    }

    $scope.getbucket_array_edit = function (id, bucket_id) {

        var bucketApi = $scope.$root.sales + "customer/sale-bucket/get-crm-bucket";
        $http
            .post(bucketApi, {
                module_id: id,
                'token': $scope.$root.token,
                'type': 1
            })
            .then(function (emp_data) {

                if (emp_data.data.ack == true) {

                    $scope.$root.$apply(function () {

                        angular.forEach($scope.bucket_array, function (obj) {
                            obj.chk = false;
                            obj.isPrimary = false;
                            angular.forEach(emp_data.data.response, function (obj2) {
                                if (obj.id == obj2.bucket_id) {
                                    obj.chk = true;
                                    if (obj2.is_primary == 1)
                                        obj.isPrimary = true;
                                    $scope.bucket_selected_array.push(obj);
                                }
                            });
                            //  $scope.bucket_array.push(obj);
                        });
                        //$scope.getSalePersons(1);
                        $scope.getSalePersons_general(1);
                        $scope.getSalePersons_edit(id);
                    });
                }
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.add_bucket = function (id) {
        var check = false;
        var bucketApi = $scope.$root.sales + "customer/sale-bucket/add-crm-bucket";
        var post = {};
        var temp = [];

        angular.forEach($scope.bucket_selected_array, function (obj) {
            temp.push({
                bucket_id: obj.id,
                isPrimary: obj.isPrimary
            });
        });

        post.type = 1;
        post.module_id = id;
        post.salesbucket = temp;
        post.token = $scope.$root.token;
        $http
            .post(bucketApi, post)
            .then(function (res) {
                if (res.data.ack == true)
                    check = true;
            });
        return check;
    }

    $scope.selct_from_oop = false;
    //general tab salesperson
    $scope.PendingSelectedSpGeneral = [];
    $scope.PendingSelSalePerGenTooltip = "";

    $scope.submitPendingSelectedSpGeneral = function () {

        $scope.PendingSelectedSpGeneral = [];
        $scope.PendingSelSalePerGenTooltip = "";
        var isPrimary = false;
        var isPrimary_flag = false;

        for (var i = 0; i < $scope.SalesPersonGen_arr.length; i++) {

            if ($scope.SalesPersonGen_arr[i].isPrimary)
                isPrimary_flag = true;

            if ($scope.SalesPersonGen_arr[i].chk == true) {
                $scope.PendingSelectedSpGeneral.push($scope.SalesPersonGen_arr[i]);
                $scope.PendingSelSalePerGenTooltip = $scope.PendingSelSalePerGenTooltip + $scope.SalesPersonGen_arr[i].name + "; ";
            }
        }

        if (isPrimary_flag == false) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(236, ['Primary']));
            return false;
        }

        $scope.PendingSelSalePerGenTooltip = $scope.PendingSelSalePerGenTooltip.slice(0, -2);

        $scope.selectedSalespersons = $scope.PendingSelectedSpGeneral;
        $scope.SelSalePerGenTooltip = $scope.PendingSelSalePerGenTooltip;

        angular.element('#_CRMSalepersonModal').modal('hide');
    }

    $scope.clearPendingSelectedSpGeneral = function () {
        $scope.PendingSelectedSpGeneral = [];
        $scope.PendingSelSalePerGenTooltip = "";
        angular.element('#_CRMSalepersonModal').modal('hide');
    }

    $scope.ClearSalesPerGenFilter = function () {
        $scope.searchKeyword_SalePersons = {};
    }

    $scope.getSalePersons_general = function (isShow) {
        /* if (isShow == 0 && $scope.bucket_selected_array.length == 0) {
            toaster.pop('error', 'Error', 'Please populate you view bucket');
            return;
        } */
        $scope.title = 'Salesperson';
        // $scope.showLoader = true;
        $scope.columns_sp = [];
        $scope.record = {};
        $scope.searchKeyword_SalePersons = {};
        //console.log($scope.bucket_selected_array.length);

        /* if ($scope.bucket_selected_array.length > 0) {



            var BucpostUrl = $scope.$root.sales + "customer/sale-bucket/get-sales-person-bucket";

            var BucpostData = {
                'bucket_selected_array': $scope.bucket_selected_array,
                'module_id': $scope.rec.id,
                'token': $scope.$root.token
            };

            $http
                .post(BucpostUrl, BucpostData)
                .then(function (res) {
                    if (res.data.ack == true) {
                        var ids = 0;
                        var ids2 = 0;
                        $scope.SalesPersonGen_arr = [];

                        angular.forEach(res.data.response, function (obj) {
                            ids = obj.id.split('.')[0];
                            obj.chk = false;
                            obj.isPrimary = false;
                            // todo: nullifying the selectedSalesPersons array on every response might fix the issue
                            // by ahmad
                            if ($scope.selectedSalespersons.length > 0) {

                                angular.forEach($scope.selectedSalespersons, function (obj2) {
                                    ids2 = obj2.id.split('.')[0];
                                    if (ids == ids2 || $scope.selct_from_oop) {
                                        obj.chk = true;
                                        if (obj2.isPrimary)
                                            obj.isPrimary = true;
                                    }
                                });
                            }
                            $scope.SalesPersonGen_arr.push(obj);
                        });

                        // $scope.SalesPersonGen_arr = res.data.response;
                        $scope.record = $scope.SalesPersonGen_arr;

                        angular.forEach(res.data.response[0], function (val, index) {
                            if (index != 'chk' && index != 'id') {
                                $scope.columns_sp.push({
                                    'title': toTitleCase(index),
                                    'field': index,
                                    'visible': true
                                });
                            }
                        });

                    } else {

                        var ids = 0;
                        var ids2 = 0;
                        $scope.SalesPersonGen_arr = [];

                        angular.forEach($rootScope.salesperson_arr, function (obj) {
                            ids = obj.id.split('.')[0];
                            obj.chk = false;
                            obj.isPrimary = false;

                            if ($scope.selectedSalespersons.length > 0) {

                                angular.forEach($scope.selectedSalespersons, function (obj2) {
                                    console.log(obj2);
                                    ids2 = obj2.id.split('.')[0];
                                    if (ids == ids2 || $scope.selct_from_oop) {
                                        obj.chk = true;
                                        if (obj2.isPrimary)
                                            obj.isPrimary = true;
                                    }
                                });
                            }
                            $scope.SalesPersonGen_arr.push(obj);
                        });

                        // $scope.SalesPersonGen_arr = $rootScope.salesperson_arr;
                        $scope.record = $scope.SalesPersonGen_arr;
                        $scope.showLoader = false;
                        angular.forEach($rootScope.salesperson_arr[0], function (val, index) {
                            $scope.columns_sp.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });

                    }

                    $scope.showLoader = false;
                }).catch(function (message) {
                    $scope.showLoader = false;
                    
                    throw new Error(message.data);
                    console.log(message.data);
                });




        } else {
            $scope.SalesPersonGen_arr = $rootScope.salesperson_arr;
            $scope.record = $scope.SalesPersonGen_arr;
            $scope.showLoader = false;
            angular.forEach($rootScope.salesperson_arr[0], function (val, index) {
                $scope.columns_sp.push({
                    'title': toTitleCase(index),
                    'field': index,
                    'visible': true
                });
            });
        } */
        var tempArr = [];
        /* angular.forEach($scope.salepersons, function(obj,i){
            var tempObj = {
                id: obj.id,
                spid: obj.spid,
                name: obj.name,
                job_title: obj.job_title,
                department: obj.dep_name
            }
            $scope.salepersons.splice(i,1);
            $scope.salepersons.push(tempObj);
        }) */

        $scope.SalesPersonGen_arr = $scope.salepersons;
        $scope.record = $scope.salepersons;
        $scope.showLoader = false;
        angular.forEach($scope.SalesPersonGen_arr[0], function (val, index) {
            $scope.columns_sp.push({
                'title': toTitleCase(index),
                'field': index,
                'visible': true
            });
        });

        angular.element('#_CRMSalepersonModal').modal({ show: true });
        return;
    }

    $scope.columns_sp = [];
    $scope.selectedSalespersons = [];


    $scope.selectSaleperson_general = function (sp, isPrimary) {
        $scope.isSalePerersonChanged = true;
        $scope.selectedAll = false;

        //console.log(sp);

        for (var i = 0; i < $scope.SalesPersonGen_arr.length; i++) {

            if (isPrimary == 1)
                $scope.SalesPersonGen_arr[i].isPrimary = false;

            if (sp.id == $scope.SalesPersonGen_arr[i].id) {

                if ($scope.SalesPersonGen_arr[i].chk == true && isPrimary == 0) {

                    $scope.SalesPersonGen_arr[i].chk = false;
                    $scope.SalesPersonGen_arr[i].isPrimary = false;

                } else {
                    // || $scope.selectedSalespersons.length == 0
                    if (isPrimary == 1)
                        $scope.SalesPersonGen_arr[i].isPrimary = true;

                    $scope.SalesPersonGen_arr[i].chk = true;
                }
            }
        }
        // console.log($scope.PendingSelectedSpGeneral);
    }


    $scope.checkAllSalesperson = function (val) {
        $scope.PendingSelectedSpGeneral = [];

        if (val == true) {

            $scope.isSalePerersonChanged = true;
            var isPrimary = false;

            for (var i = 0; i < $scope.SalesPersonGen_arr.length; i++) {
                if ($scope.SalesPersonGen_arr[i].isPrimary)
                    isPrimary = true;

                $scope.SalesPersonGen_arr[i].chk = true;
                $scope.PendingSelectedSpGeneral.push($scope.SalesPersonGen_arr[i]);
            }

            if (!isPrimary) {
                $scope.SalesPersonGen_arr[0].isPrimary = true;
                $scope.PendingSelectedSpGeneral[0].isPrimary = true;
            }

        } else {
            for (var i = 0; i < $scope.SalesPersonGen_arr.length; i++) {
                $scope.SalesPersonGen_arr[i].chk = false;
                $scope.SalesPersonGen_arr[i].isPrimary = false;
            }
            $scope.PendingSelectedSpGeneral = [];
        }
    }


    $scope.getSalePersons_edit = function (id) {

        var salepersonUrl = $scope.$root.sales + "crm/crm/get-crm-salesperson";
        $http
            .post(salepersonUrl, {
                id: id,
                'token': $scope.$root.token,
                'type': 2
            })
            .then(function (emp_data) {

                if (emp_data.data.ack == true) {

                    $scope.$root.$apply(function () {
                        var ids = 0;
                        angular.forEach($scope.salepersons, function (obj) {
                            ids = obj.id.split('.')[0];
                            obj.chk = false;
                            obj.isPrimary = false;
                            angular.forEach(emp_data.data.response, function (obj2) {
                                if (ids == obj2.salesperson_id) {
                                    obj.chk = true;
                                    if (obj2.is_primary == 1)
                                        obj.isPrimary = true;
                                    $scope.selectedSalespersons.push(obj);
                                }
                            });
                            //  $scope.salepersons.push(obj);
                        });
                    });

                }
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.add_salespersons = function (id, type) {
        var check = false;
        var excUrl = $scope.$root.sales + "crm/crm/add-crm-salesperson";
        var post = {};
        var temp = [];

        angular.forEach($scope.selectedSalespersons, function (obj) {
            if (obj.chk)
                temp.push({
                    id: obj.id,
                    isPrimary: obj.isPrimary,
                    bucket_id: obj.bucket_id
                });
        })
        post.type = type;
        // post.bucket_id = $scope.rec.bucket_id;
        post.id = id;
        post.salespersons = temp;
        post.token = $scope.$root.token;
        $http
            .post(excUrl, post)
            .then(function (res) {
                if (res.data.ack == true) {

                    check = true;
                }
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
        return check;
    }


    $scope.add_salespersons_history = function (id) {
        var excUrl = $scope.$root.sales + "crm/crm/add-crm-salesperson-log";
        var post = {};
        var temp = [];
        angular.forEach($scope.selectedSalespersons, function (obj) {
            temp.push({
                id: obj.id,
                isPrimary: obj.isPrimary
            });
        })
        post.type = 2;
        post.id = id;
        post.salespersons = temp;
        post.token = $scope.$root.token;
        $http.post(excUrl, post)
            .then(function (res) {
                //$scope.add_salespersons_log(id);
            });
    }


    $scope.isBtnPredefined = false;
    $scope.checkPredefinedValue = function (val) {
        if (!angular.isString(val)) {
            $scope.isBtnPredefined = false;
        } else {
            var value = val.replace(/^\s+|\s+$/g, '');
            if (value !== '')
                $scope.isBtnPredefined = true;
            else
                $scope.isBtnPredefined = false;
        }
    }



    $scope.addNewCurrencyPopup = function (drp) {
        var id = drp.currency != undefined ? drp.currency.id : 0;
        if (id > 0)
            return false;
        $scope.fnDatePicker();
        $scope.currency = {};
        ngDialog.openConfirm({
            template: 'app/views/company/add_new_currency.html',
            className: 'ngdialog-theme-default-custom-large',
            scope: $scope
        }).then(function (currency) {
            var addCurrencyUrl = $scope.$root.setup + "general/add-currency";
            currency.token = $scope.$root.token;
            currency.company_id = $scope.$root.defaultCompany;
            currency.status = $scope.currency.c_status !== undefined ? $scope.currency.c_status.value : 0;
            $http
                .post(addCurrencyUrl, currency)
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', res.data.msg);
                        var currencyUrl = $scope.$root.setup + "general/currency-list";
                        $http
                            .post(currencyUrl, {
                                'company_id': $scope.$root.defaultCompany,
                                'token': $scope.$root.token
                            })
                            .then(function (res1) {
                                if (res1.data.ack == true) {

                                    $rootScope.arr_currency = res1.data.response;
                                    $rootScope.arr_currency.push({
                                        'id': '-1',
                                        'name': '++ Add New ++'
                                    });

                                    angular.forEach($rootScope.arr_currency, function (elem) {
                                        if (elem.id == res.data.id)
                                            drp.currency = elem;
                                    });

                                }

                            });
                    } else if (res.data.ack == false) {
                        toaster.pop('warning', 'Info', res.data.msg);
                    } else
                        toaster.pop('warning', 'Info', res.data.msg);
                });
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.addNewPaymentTerm = function (drpdown, type, title, drp) {

        var id = drpdown.id;
        if (Number(id) > 0 || Number(id) == 0)
            return false;
        else {
            $scope.popup_title = title;
            $scope.pedefined = {};

            ngDialog.openConfirm({
                template: 'app/views/payment_terms/add_payment_term.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            }).then(function (pedefined) {
                /*//console.log(pedefined);
                 return false;*/

                pedefined.token = $scope.$root.token;
                var postUrl = $scope.$root.setup + "crm/add-payment-term";

                $http
                    .post(postUrl, pedefined)
                    .then(function (ress) {
                        if (ress.data.ack == true) {
                            toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                            var constUrl = $scope.$root.setup + "crm/payment-terms";

                            $http
                                .post(constUrl, {
                                    'token': $scope.$root.token,
                                    'all': 1
                                })
                                .then(function (res) {
                                    $scope.arr_payment_terms = res.data.response;
                                    $scope.arr_payment_terms.push({
                                        'id': '-1',
                                        'Description': '++ Add New ++'
                                    });

                                    angular.forEach($scope.arr_payment_terms, function (elem) {
                                        if (elem.id == ress.data.id)
                                            drp.payment_terms_ids = elem;
                                    });

                                });
                        } else {
                            toaster.pop('error', 'Info', ress.data.error);
                            drp.payment_terms_ids = '';
                        }
                    });


            }, function (reason) {
                //console.log('Modal promise rejected. Reason: ', reason);
                drp.payment_terms_ids = '';
            });
        }
    }

    $scope.addNewPaymentMethod = function (drpdown, type, title, drp) {

        var id = drpdown.id;
        if (Number(id) > 0 || Number(id) == 0)
            return false;
        else {
            $scope.popup_title = title;
            $scope.pedefined = {};

            ngDialog.openConfirm({
                template: 'app/views/payment_methods/add_payment_method.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            }).then(function (pedefined) {
                /*//console.log(pedefined);
                 return false;*/

                pedefined.token = $scope.$root.token;
                var postUrl = $scope.$root.setup + "crm/add-payment-method";

                $http
                    .post(postUrl, pedefined)
                    .then(function (ress) {
                        if (ress.data.ack == true) {
                            toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                            var constUrl = $scope.$root.setup + "crm/payment-methods";

                            $http
                                .post(constUrl, {
                                    'token': $scope.$root.token,
                                    'all': 1
                                })
                                .then(function (res) {
                                    $scope.paymentmet = res.data.response;
                                    $scope.paymentmet.push({
                                        'id': '-1',
                                        'Description': '++ Add New ++'
                                    });

                                    angular.forEach($scope.paymentmet, function (elem) {
                                        if (elem.id == ress.data.id)
                                            drp.payment_method_ids = elem;
                                    });
                                });
                        } else {
                            toaster.pop('error', 'Info', ress.data.error);
                            drp.payment_method_ids = '';
                        }
                    });


            }, function (reason) {
                drp.payment_method_ids = '';
                //console.log('Modal promise rejected. Reason: ', reason);
            });
        }
    }

    $scope.confirm = function (btc) {

        $scope.recfinance.bill_to_customer = btc.name;
        $scope.recfinance.bill_to_customer_id = btc.id;
        ////console.log($scope.recfinance.bill_to_customer_name +"- "+$scope.recfinance.bill_to_customer);
        angular.element('#model_Bill_Finance_Customer').modal('hide');
    }

    /****************************************/
    // Tasks
    /****************************************/

    $scope.opp_task_data = {};
    $scope.opp_cycle_id = 0;
    //    $scope.$on("showTasksEvent", function (event, opp_cycle_id) {
    //        $scope.opp_cycle_id = opp_cycle_id;
    //        //$scope.tasks();
    //    });
    $scope.status_data = {};
    $scope.status_data = [{
        label: 'Active',
        id: '1'
    }, {
        label: 'Inactive',
        id: '0'
    }];
    $scope.task_status = {};
    $scope.task_status = [{
        label: 'Flag',
        id: '1'
    }, {
        label: 'Schedule',
        id: '2'
    }];
    $scope.formData = {};
    $scope.edit_task = function (tdid, popup) {
        $scope.datePicker = Calendar.get_caledar();
        $scope.titile = 'View Task';
        $scope.perreadonly = false;
        $scope.check_task_readonly = true;
        $scope.formData = {};
        $scope.hide_cancel = false;
        $scope.add_task_new = true;
        //  //console.log( $scope.add_task_new);
        var postUrl = $scope.$root.com + "task/get_task";
        var postData = {
            'token': $scope.$root.token,
            'id': tdid
        };
        $http
            .post(postUrl, postData)
            .then(function (res) {
                // $scope.formData = res.data.response;
                $scope.formData.id = res.data.response.id;
                $scope.formData.t_title = res.data.response.t_title;
                $scope.formData.t_time = res.data.response.t_time;
                $scope.formData.t_image = res.data.response.t_image;
                $scope.formData.t_description = res.data.response.t_description;
                //  $scope.formData.t_description= $scope.$root.base64_decode(res.data.response.t_description);
                // angular.element('#redactor_content').val(res.data.response.t_description);


                if (res.data.response.t_date == 0) {
                    $scope.formData.t_date = null;
                } else {
                    $scope.formData.t_date = $scope.$root.convert_numeric_date_to_string(res.data.response.t_date);
                }

                angular.forEach($scope.status_data, function (obj, index) {
                    if (obj.id == res.data.response.status) {
                        $scope.formData.status = $scope.status_data[index];
                    }
                });

                angular.forEach($scope.task_status, function (obj, index) {
                    if (obj.id == res.data.response.t_status) {
                        $scope.formData.t_status = $scope.task_status[index];
                    }
                });

                if (popup != undefined) {
                    $scope.hide_cancel = true;
                    angular.element('#model_btn_task').modal({
                        show: true,
                    });
                }


            });
        angular.element('#t_time').timepicker({
            showLeadingZero: true,
            showPeriod: true,
            //   onSelect: tpStartSelect,
            maxTime: {
                hour: 24,
                minute: 60
            }
        });
    };
    $scope.tasks = function () {
        $scope.task_data = {};
        $scope.opp_task_data = {};
        var Api = $scope.$root.com + "task/task_list";
        $scope.task_data = {};
        $http
            .post(Api, {
                opp_cycle_id: $scope.opp_cycle_id,
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.task_data = res.data.response;
                    if ($scope.opp_cycle_id > 0)
                        $scope.opp_task_data = res.data.response;
                    ////console.log($scope.task_data);

                }
            });
        $scope.showLoader = false;
    }

    $scope.delete = function (id, index, opp_task_data) {
        var delUrl = $scope.$root.com + "task/delete_task";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        //  var index = arr_data.indexOf(rec.id);
                        opp_task_data.splice(index, 1);
                        // $state.go("app.task") ;
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    };
    $scope.submit_add_task = function (formData) {
        var postUrl = $scope.$root.com + "task/add_task";
        formData.t_time = angular.element('#t_time').val();
        formData.t_description = angular.element('#redactor_content').val();
        formData.token = $scope.$root.token;
        formData.opp_cycle_id = $scope.opp_cycle_id;
        $http
            .post(postUrl, formData)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    // $state.go("app.task") ;

                    $scope.tasks();
                    $scope.add_task();
                    angular.element('#model_btn_task').modal('hide');
                } else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
            });
    };
    $scope.hide_cancel = true;
    $scope.add_tasks = function () {
        $scope.titile = 'Add Task';
        $scope.datePicker = Calendar.get_caledar();
        $scope.formData = {};
        $scope.add_task_new = true;
        $scope.perreadonly = true;
        angular.element('#t_time').timepicker({
            showLeadingZero: true,
            showPeriod: true,
            //   onSelect: tpStartSelect,
            maxTime: {
                hour: 24,
                minute: 60
            }
        });

        angular.element('#model_btn_task').modal({
            show: true,
        });
    }

    $scope.add_task = function () {
        $scope.add_task_new = true;
        $scope.perreadonly = true;
        $scope.check_task_readonly = false;
        $scope.formData = {};
    };


    // Select Regions, Segments and Buying goups
    //-------------------------------------------------------------
    $scope.group_type = 0;
    $scope.getGroups = function (type, isShow) { };

    angular.element(document).on('click', '.checkAll', function (event) {
        //event.preventDefault();
        if ($scope.group_type == 1)
            $scope.selectedSegments = [];
        if ($scope.group_type == 2)
            $scope.selectedRegions = [];
        if ($scope.group_type == 3)
            $scope.selectedBuyingGroups = [];
        if (angular.element('.checkAll').is(':checked') == true) {
            if ($scope.group_type == 1)
                $scope.customer_groups = $rootScope.segment_customer_arr;
            if ($scope.group_type == 2)
                $scope.customer_groups = $rootScope.region_customer_arr;
            if ($scope.group_type == 3)
                $scope.customer_groups = $rootScope.bying_group_customer_arr;
            for (var i = 0; i < $scope.customer_groups.length; i++) {
                if ($scope.group_type == 1) {
                    $scope.$rootScope.segment_customer_arr[i].chk = true;
                    $scope.selectedSegments.push($rootScope.segment_customer_arr[i]);
                }
                if ($scope.group_type == 2) {
                    $rootScope.region_customer_arr[i].chk = true;
                    $scope.selectedRegions.push($rootScope.region_customer_arr[i]);
                }
                if ($scope.group_type == 3) {
                    $rootScope.bying_group_customer_arr[i].chk = true;
                    $scope.selectedBuyingGroups.push($rootScope.bying_group_customer_arr[i]);
                }
            }
        } else {
            for (var i = 0; i < $scope.customer_groups.length; i++) {

                if ($scope.group_type == 1)
                    $rootScope.segment_customer_arr[i].chk = false;
                if ($scope.group_type == 2)
                    $rootScope.region_customer_arr[i].chk = false;
                if ($scope.group_type == 3)
                    $rootScope.bying_group_customer_arr[i].chk = false;
            }
            if ($scope.group_type == 1)
                $scope.selectedSegments = [];
            if ($scope.group_type == 2)
                $scope.selectedRegions = [];
            if ($scope.group_type == 3)
                $scope.selectedBuyingGroups = [];
        }

        if ($scope.group_type == 1)
            $scope.selectedSegments;

        if ($scope.group_type == 2)
            $scope.selectedRegions;

        if ($scope.group_type == 3)
            $scope.selectedBuyingGroups;
    });

    $scope.selectGroup = function (cust) {
        if ($scope.group_type == 1)
            $scope.customer_groups = $rootScope.segment_customer_arr;
        if ($scope.group_type == 2)
            $scope.customer_groups = $rootScope.region_customer_arr;
        if ($scope.group_type == 3)
            $scope.customer_groups = $rootScope.bying_group_customer_arr;

        for (var i = 0; i < $scope.customer_groups.length; i++) {
            if (cust.id == $scope.customer_groups[i].id) {
                if ($scope.customer_groups[i].chk == true) {

                    if ($scope.group_type == 1) {
                        $rootScope.segment_customer_arr[i].chk = false;
                        angular.forEach($scope.selectedSegments, function (obj, indx) {
                            if (obj != undefined) {
                                if (obj.id == cust.id)
                                    $scope.selectedSegments.splice(indx, 1);
                            }
                        });
                    }
                    if ($scope.group_type == 2) {
                        $rootScope.region_customer_arr[i].chk = false;

                        angular.forEach($scope.selectedRegions, function (obj, indx) {
                            if (obj != undefined) {
                                if (obj.id == cust.id)
                                    $scope.selectedRegions.splice(indx, 1);
                            }
                        });
                    }
                    if ($scope.group_type == 3) {
                        $rootScope.bying_group_customer_arr[i].chk = false;

                        angular.forEach($scope.selectedBuyingGroups, function (obj, indx) {
                            if (obj != undefined) {
                                if (obj.id == cust.id)
                                    $scope.selectedBuyingGroups.splice(indx, 1);
                            }
                        });
                    }
                } else {
                    if ($scope.group_type == 1) {
                        $rootScope.segment_customer_arr[i].chk = true;
                        $scope.selectedSegments.push($rootScope.segment_customer_arr[i]);
                    }
                    if ($scope.group_type == 2) {
                        $rootScope.region_customer_arr[i].chk = true;
                        $scope.selectedRegions.push($rootScope.region_customer_arr[i]);
                    }
                    if ($scope.group_type == 3) {
                        $rootScope.bying_group_customer_arr[i].chk = true;
                        $scope.selectedBuyingGroups.push($rootScope.bying_group_customer_arr[i]);
                    }
                }

            }

        }
    }

    //------------------------------------------------------------


    //--------------------   add supplier volume pop type --------------------
    $scope.arr_volume_1 = [];
    $scope.arr_volume_2 = [];
    $scope.arr_volume_3 = [];
    $scope.formData = {};
    // $scope.datePicker = Calendar.get_caledar();
    var volumeUrl = $scope.$root.sales + "crm/crm/get-price-offer-volume-by-type";
    var add_saleUrl = $scope.$root.sales + "crm/crm/add-price-offer-volume";
    $scope.formData_vol_1 = {};
    $scope.onChange_vol_111 = function () {

        var id = this.formData.volume_1.id;
        ////console.log(id );
        if (id == -1) {
            $scope.show_vol_1_pop = true;
            angular.element('#model_btn_vol_1').click();
        }

        angular.element("#name").val('');
        angular.element("#description").val('');
        $scope.name = '';
        $scope.description = '';
    }



    $scope.formData_vol_2 = {};
    $scope.onChange_vol_2 = function () {

        var id = this.formData.volume_2.id;
        ////console.log(id );
        if (id == -1) {
            $scope.show_vol_2_pop = true;
            angular.element('#model_btn_vol_2').click();
        }

        angular.element("#name").val('');
        angular.element("#description").val('');
        $scope.name = '';
        $scope.description = '';
    }
    $scope.add_vol2_type = function (formData_vol_2) {

        $scope.formData_vol_2.token = $scope.$root.token;
        $scope.formData_vol_2.type = 2;
        $http
            .post(add_saleUrl, formData_vol_2)
            .then(function (res) {
                if (res.data.ack == true) {

                    toaster.pop('success', 'Add', 'Record Successfully insert!');
                    $scope.show_vol_2_pop = false;
                    $http
                        .post(volumeUrl, {
                            type: 'Volume 2',
                            'token': $scope.$root.token
                        })
                        .then(function (vol_data) {
                            $scope.arr_volume_2 = vol_data.data.response;
                            if ($scope.user_type == 1) {
                                $scope.arr_volume_2.push({
                                    'id': '-1',
                                    'description': '++ Add New ++'
                                });
                            }
                        });
                } else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
            });
    }


    $scope.formData_vol_3 = {};
    $scope.onChange_vol_3 = function () {

        var id = this.formData.volume_3.id;
        ////console.log(id );
        if (id == -1) {
            $scope.show_vol_3_pop = true;
            angular.element('#model_btn_vol_3').click();
        }

        angular.element("#name").val('');
        angular.element("#description").val('');
        $scope.name = '';
        $scope.description = '';
    }
    $scope.add_vol3_type = function (formData_vol_3) {

        $scope.formData_vol_3.token = $scope.$root.token;
        $scope.formData_vol_3.type = 3;
        $http
            .post(add_saleUrl, formData_vol_3)
            .then(function (res) {
                if (res.data.ack == true) {

                    toaster.pop('success', 'Add', 'Record Successfully insert!');
                    $scope.show_vol_3_pop = false;
                    $http
                        .post(volumeUrl, {
                            type: 'Volume 3',
                            'token': $scope.$root.token
                        })
                        .then(function (vol_data) {
                            $scope.arr_volume_3 = vol_data.data.response;
                            if ($scope.user_type == 1) {
                                $scope.arr_volume_3.push({
                                    'id': '-1',
                                    'description': '++ Add New ++'
                                });
                            }
                        });
                } else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
            });
    }


    // -------------     Supplier Tab    ----------------------------------------

    $scope.list_type = [{
        'name': 'Percentage',
        'id': 1
    }, {
        'name': 'Value',
        'id': 2
    }];
    $scope.loadDropDownsData = function (item_id, type) {
        $scope.arr_volume_1 = [];
        $scope.arr_volume_2 = [];
        $scope.arr_volume_3 = [];
        $scope.arr_unit_of_measure = [];
        if (type == 1) {
            var volumeUrl = $scope.$root.sales + "stock/unit-measure/get-sale-offer-volume-by-type";
            var unitUrl = $scope.$root.sales + "stock/unit-measure/get-unit-setup-list-category";
        }
        if (type == 2) {
            var volumeUrl = $scope.$root.setup + "service/products-listing/price-offer-volumes";
            var unitUrl = $scope.$root.setup + "service/unit-measure/get-all-unit";
        }


        $http
            .post(volumeUrl, {
                type: 'Volume 1',
                category: 1,
                'item_id': item_id,
                'token': $scope.$root.token
            })
            .then(function (vol_data) {
                $scope.arr_volume_1 = vol_data.data.response;
                $scope.arr_volume_1.push({
                    'id': '-1',
                    'name': '++ Add New ++'
                });
            });
        $http
            .post(volumeUrl, {
                type: 'Volume 2',
                category: 1,
                'item_id': item_id,
                'token': $scope.$root.token
            })
            .then(function (vol_data) {
                $scope.arr_volume_2.push({
                    'id': '0',
                    'name': ' '
                });
                angular.forEach(vol_data.data.response, function (obj) {
                    $scope.arr_volume_2.push(obj);
                });
                $scope.arr_volume_2.push({
                    'id': '-1',
                    'name': '++ Add New ++'
                });
            });
        $http
            .post(volumeUrl, {
                type: 'Volume 3',
                category: 1,
                'item_id': item_id,
                'token': $scope.$root.token
            })
            .then(function (vol_data) {
                $scope.arr_volume_3.push({
                    'id': '0',
                    'name': ' '
                });
                angular.forEach(vol_data.data.response, function (obj) {
                    $scope.arr_volume_3.push(obj);
                });
                $scope.arr_volume_3.push({
                    'id': '-1',
                    'name': '++ Add New ++'
                });
            });
    }


    $scope.show_price_one = function () {
        var price = 0;
        var final_price = 0;
        var final_price_one = 0;
        price = $scope.formData.purchase_price_1;
        var f_id = this.formData.supplier_type_1.id;
        if (f_id == 1) {
            final_price_one = (parseFloat($scope.formData.discount_value_1)) * (parseFloat(price)) / 100;
            final_price = (parseFloat(price)) - (parseFloat(final_price_one));
        } else if (f_id == 2) {
            final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value_1));
        }

        //  //console.log( final_price);
        //$scope.formData.discount_price_1 =final_price;
        $scope.formData.discount_price_1 = Math.round(final_price * 100) / 100;
    }

    $scope.show_price_second = function () {
        var price = 0;
        var final_price = 0;
        var final_price_one = 0;

        price = $scope.formData.purchase_price_2;
        var f_id = this.formData.supplier_type_2.id;
        if (f_id == 1) {
            final_price_one = (parseFloat($scope.formData.discount_value_2)) * (parseFloat(price)) / 100;
            final_price = (parseFloat(price)) - (parseFloat(final_price_one));
        } else if (f_id == 2) {
            final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value_2));
        }

        $scope.formData.discount_price_2 = Math.round(final_price * 100) / 100;
    }

    $scope.show_price_third = function () {
        var price = 0;
        var final_price = 0;
        var final_price_one = 0;
        price = $scope.formData.purchase_price_3;
        var f_id = this.formData.supplier_type_3.id;
        if (f_id == 1) {
            final_price_one = (parseFloat($scope.formData.discount_value_3)) * (parseFloat(price)) / 100;
            final_price = (parseFloat(price)) - (parseFloat(final_price_one));
        } else if (f_id == 2) {
            final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value_3));
        }
        $scope.formData.discount_price_3 = Math.round(final_price * 100) / 100;
    }


    $scope.getsupplier = function () {

        // $scope.$root.breadcrumbs[3].name = 'Volume Discount';


        angular.element("#sp_id").val('');
        $scope.sp_id = '';
        $scope.formData.volume_1 = '';
        $scope.formData.supplier_type_1 = '';
        $scope.formData.discount_value_1 = '';
        $scope.formData.discount_price_1 = '';
        $scope.formData.volume_2 = '';
        $scope.formData.supplier_type_2 = '';
        $scope.formData.discount_value_2 = '';
        $scope.formData.discount_price_2 = '';
        $scope.formData.volume_3 = '';
        $scope.formData.supplier_type_3 = '';
        $scope.formData.discount_value_3 = '';
        $scope.formData.discount_price_3 = '';
        $scope.formData.start_date = '';
        $scope.formData.end_date = '';


        var product_id = $stateParams.id;
        $scope.showLoader = true;
        $scope.show_supplier_list = true;
        $scope.show_supp_form = false;
        $scope.perreadonly = true;
        $scope.check_item_readonly = false;
        $scope.columns = [];
        var postData = {};
        var vm = this;
        var postUrl = $scope.$root.sales + "crm/crm/supplier_list";
        postData = {
            'token': $scope.$root.token,
            'all': "1",
            'crm_id': product_id
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
        $scope.showLoader = false;
    }

    $scope.fn_supplier_Form = function () {

        $scope.show_supp_form = true;
        $scope.show_supplier_list = false;
        $scope.itme_code = '';
        $scope.item_description = '';
        $scope.formData.price_list_id = '';
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        };
        var day = d.getDate();
        if (day < 10) {
            day = "0" + day;
        };
        if ($rootScope.defaultDateFormat == $rootScope.dtYMD)
            $scope.discounted_date = year + "/" + month + "/" + day;
        if ($rootScope.defaultDateFormat == $rootScope.dtMDY)
            $scope.discounted_date = month + "/" + day + "/" + year;
        if ($rootScope.defaultDateFormat == $rootScope.dtDMY)
            $scope.discounted_date = day + "/" + month + "/" + year;
        $scope.discount_date = $filter('date')($scope.discounted_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
        $scope.formData.purchase_price_1 = 0;
        $scope.formData.purchase_price_2 = 0;
        $scope.formData.purchase_price_3 = 0;
        angular.element("#sp_id").val('');
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
    }

    $scope.add_supplier = function (formData) {
        var updateUrl = $scope.$root.sales + "crm/crm/update_product_values";
        $scope.formData.product_id = $scope.$root.crm_id;
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
        if ($scope.formData.volume_1s > 0 && formData.discount_price_1 <= 0)
            return false;
        if ($scope.formData.volume_2s > 0 && formData.discount_price_2 <= 0)
            return false;
        if ($scope.formData.volume_3s > 0 && formData.discount_price_3 <= 0)
            return false;
        $http
            .post(updateUrl, $scope.formData)
            .then(function (res) {
                if (res.data.ack == true) {
                    if (res.data.tab_change == 'tab_supplier') {

                        $scope.getsupplier();
                        // $scope.show_supplier_pop= false;
                        angular.element('#model_btn_supplier').modal('hide');
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    }
                } else {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                }
            });
    }

    $scope.show_sp_edit_form = function (id) {


        $scope.showLoader = true;
        $scope.show_supp_form = true;
        $scope.show_supplier_list = true;
        /*  $scope.check_item_readonly = false;
         $scope.perreadonly = true;
         */

        var postUrl = $scope.$root.sales + "crm/crm/supplier_by_id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };
        $scope.formData.sp_id = id;
        $scope.sp_id = id;

        $http
            .post(postUrl, postViewBankData)
            .then(function (res) {

                $scope.formData.discount_value = res.data.response.discount_value;

                if (res.data.response.start_date == 0) {
                    $scope.formData.start_date = null;
                } else {
                    $scope.formData.start_date = $scope.$root.convert_numeric_date_to_string(res.data.response.start_date);
                }


                if (res.data.response.end_date == 0) {
                    $scope.formData.end_date = null;
                } else {
                    $scope.formData.end_date = $scope.$root.convert_numeric_date_to_string(res.data.response.end_date);
                }

                ////console.log($scope.formData.end_date);

                angular.forEach($scope.list_type, function (obj, index) {
                    if (obj.id == res.data.response.supplier_type) {
                        $scope.formData.supplier_type = $scope.list_type[index];
                    }
                });

                angular.forEach($scope.arr_volume_1, function (obj, index) {
                    if (obj.id == res.data.response.volume_1) {
                        $scope.formData.volume_1 = $scope.arr_volume_1[index];
                    }
                });

                angular.forEach($scope.arr_volume_2, function (obj, index) {
                    if (obj.id == res.data.response.volume_2) {
                        $scope.formData.volume_2 = $scope.arr_volume_2[index];
                    }
                });

                angular.forEach($scope.arr_volume_3, function (obj, index) {
                    if (obj.id == res.data.response.volume_3) {
                        $scope.formData.volume_3 = $scope.arr_volume_3[index];
                    }
                });
            });
        $scope.showLoader = false;

    }

    $scope.delete_sp = function (id, index, arr_data) {

        var delUrl = $scope.$root.sales + "crm/crm/delete_sp_id";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    };

    //--------------------   Supplier End--------------------
    $scope.columns = [];
    $scope.record = {};
    $scope.getProductList = function () {
        $scope.columns = [];
        $scope.record = {};
        $scope.title = "Price List";
        var ApiAjax = $scope.$root.sales + "crm/crm/crm-price-offer-listings";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
            'more_fields': 'volume_1*volume_2*volume_3*volume_1_price*volume_2_price*volume_3_price',
            'column': 'crm_id',
            'value': $scope.$root.crm_id
        };
        $http
            .post(ApiAjax, postData)
            .then(function (res) {
                $scope.record = res.data.response;
                angular.forEach(res.data.response[0], function (val, index) {
                    $scope.columns.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                });
            });
        angular.element('#modalPriceListModal').modal({
            show: true
        });

    }

    $scope.addPriceListing = function (result) {
        $scope.loadDropDownsData(result['item_id'], result['Type']);
        $scope.itme_code = result['Item Code'];
        $scope.item_description = result['Item Description'];
        //$scope.formData.purchase_price_1 = $scope.formData.purchase_price_2 = $scope.formData.purchase_price_3 = result['Offer Price'];
        $scope.formData.price_list_id = result.id;
        $scope.formData.item_id = result['item_id'];
        $scope.formData.type = result['Type'];
        if (result.volume_1_price != undefined) {
            $scope.formData.purchase_price_1 = result.volume_1_price;
        }
        if (result.volume_2_price != undefined) {
            $scope.formData.purchase_price_2 = result.volume_2_price;
        }
        if (result.volume_3_price != undefined) {
            $scope.formData.purchase_price_3 = result.volume_3_price;
        }


        if (result.volume_1 != undefined) {
            angular.forEach($scope.arr_volume_1, function (elem) {
                if (elem.id == result.volume_1)
                    $scope.formData.volume_1 = elem;
            });
        }

        if (result.volume_2 != undefined) {
            angular.forEach($scope.arr_volume_2, function (elem) {
                if (elem.id == result.volume_2)
                    $scope.formData.volume_2 = elem;
            });
        }

        if (result.volume_3 != undefined) {
            angular.forEach($scope.arr_volume_3, function (elem) {
                if (elem.id == result.volume_3)
                    $scope.formData.volume_3 = elem;
            });
        }
        angular.element('#modalPriceListModal').modal('hide');
    }


    var volumeUrl_item = $scope.$root.sales + "stock/unit-measure/get-sale-offer-volume-by-type";
    var addvolumeUrl_item = $scope.$root.sales + "stock/unit-measure/add-sale-offer-volume";

    $scope.onChange_vol_1 = function (arg_id, arg_name) {
        $scope.formData_vol_1 = {};
        $scope.get_category_list();
        var id = '';
        var volume = '';
        var category = 0;
        if (arg_id == 1) {
            id = this.formData.volume_1.id;
            volume = 'Volume 1';
            category = 1;
            $scope.title_type = 'Add Price Offer Volume 1 ';
        } else if (arg_id == 2) {
            id = this.formData.volume_2.id;
            volume = 'Volume 2';
            category = 1;
            $scope.title_type = 'Add Price Offer Volume 2 ';
        } else if (arg_id == 3) {
            id = this.formData.volume_3.id;
            volume = 'Volume 3';
            category = 1;
            $scope.title_type = 'Add Price Offer Volume 3 ';
        }

        if (arg_id == 11) {
            id = this.rec.volume_1_purchase.id;
            volume = 'Volume 1';
            category = 2;
            $scope.title_type = 'Add Purchase Offer Volume 1 ';
        } else if (arg_id == 22) {
            id = this.rec.volume_2_purchase.id;
            volume = 'Volume 2';
            category = 2;
            $scope.title_type = 'Add Purchase Offer Volume 1 ';
        } else if (arg_id == 33) {
            id = this.rec.volume_3_purchase.id;
            volume = 'Volume 3';
            category = 2;
            $scope.title_type = 'Add Purchase Offer Volume 1 ';
        }

        if (arg_name == 'sale') {
            if (id == -1)
                angular.element('#add_volume_disc').modal({
                    show: true
                });
        }

        if (arg_name == 'purchase') {
            if (id == -1)
                angular.element('#model_vol_purchase_1').modal({
                    show: true
                });
        }

        $scope.formData_vol_1.type = volume;
        $scope.formData_vol_1.category = category;
    }

    $scope.add_vol1_type = function (formData_vol_1) {

        formData_vol_1.token = $scope.$root.token;
        //$scope.formData_vol_1.type = 'Volume 1';
        //$scope.formData_vol_1.category = 1;
        formData_vol_1.item_id = $scope.formData.item_id;
        formData_vol_1.unit_categorys = $scope.formData_vol_1.unit_category !== undefined ? $scope.formData_vol_1.unit_category.id : 0;
        console.log(formData_vol_1);
        // //console.log(  $scope.rec.product_id);return;

        $http
            .post(addvolumeUrl_item, formData_vol_1)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    //  $scope.show_vol_1_pop = false;
                    angular.element('#add_volume_disc').modal('hide');
                    angular.element('#model_vol_purchase_1').modal('hide');
                    $scope.get_item_voume_list($scope.formData_vol_1.category, $scope.formData.item_id);
                } else
                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(107));
            });
    }

    $scope.get_item_voume_list = function (arg, item_id) {
        ////console.log(item_id);

        $http
            .post(volumeUrl_item, {
                type: 'Volume 1',
                category: arg,
                'item_id': item_id,
                'token': $scope.$root.token
            })
            .then(function (vol_data) {

                if (arg == 1) {
                    $scope.arr_volume_1 = vol_data.data.response;
                    if ($scope.arr_volume_1.length == 0) {
                        $scope.arr_volume_1.push({
                            'id': '-1',
                            'name': '++ Add New ++'
                        });
                    } else if ($scope.arr_volume_1.length > 0)
                        if ($scope.user_type == 1)
                            $scope.arr_volume_1.push({
                                'id': '-1',
                                'name': '++ Add New ++'
                            });
                } else if (arg == 2) {
                    $scope.arr_volume_purchase_1 = vol_data.data.response;
                    if ($scope.arr_volume_purchase_1.length == 0) {
                        $scope.arr_volume_purchase_1.push({
                            'id': '-1',
                            'name': '++ Add New ++'
                        });
                    } else if ($scope.arr_volume_purchase_1.length > 0)
                        if ($scope.user_type == 1)
                            $scope.arr_volume_purchase_1.push({
                                'id': '-1',
                                'name': '++ Add New ++'
                            });
                }


            });
        $http
            .post(volumeUrl_item, {
                type: 'Volume 2',
                category: arg,
                'item_id': item_id,
                'token': $scope.$root.token
            })
            .then(function (vol_data) {

                if (arg == 1) {
                    $scope.arr_volume_2 = vol_data.data.response;
                    if ($scope.arr_volume_2.length == 0) {
                        $scope.arr_volume_2.push({
                            'id': '-1',
                            'name': '++ Add New ++'
                        });
                    } else if ($scope.arr_volume_2.length > 0)
                        if ($scope.user_type == 1)
                            $scope.arr_volume_2.push({
                                'id': '-1',
                                'name': '++ Add New ++'
                            });
                } else if (arg == 2) {
                    $scope.arr_volume_purchase_2 = vol_data.data.response;
                    if ($scope.arr_volume_purchase_2.length == 0) {
                        $scope.arr_volume_purchase_2.push({
                            'id': '-1',
                            'name': '++ Add New ++'
                        });
                    } else if ($scope.arr_volume_purchase_2.length > 0)
                        if ($scope.user_type == 1)
                            $scope.arr_volume_purchase_2.push({
                                'id': '-1',
                                'name': '++ Add New ++'
                            });
                }

            });
        $http
            .post(volumeUrl_item, {
                type: 'Volume 3',
                category: arg,
                'item_id': item_id,
                'token': $scope.$root.token
            })
            .then(function (vol_data) {

                if (arg == 1) {
                    $scope.arr_volume_3 = vol_data.data.response;
                    if ($scope.arr_volume_3.length == 0) {
                        $scope.arr_volume_3.push({
                            'id': '-1',
                            'name': '++ Add New ++'
                        });
                    } else if ($scope.arr_volume_3.length > 0)
                        if ($scope.user_type == 1)
                            $scope.arr_volume_3.push({
                                'id': '-1',
                                'name': '++ Add New ++'
                            });
                } else if (arg == 2) {
                    $scope.arr_volume_purchase_3 = vol_data.data.response;
                    if ($scope.arr_volume_purchase_3.length == 0) {
                        $scope.arr_volume_purchase_3.push({
                            'id': '-1',
                            'name': '++ Add New ++'
                        });
                    } else if ($scope.arr_volume_purchase_3.length > 0)
                        if ($scope.user_type == 1)
                            $scope.arr_volume_purchase_3.push({
                                'id': '-1',
                                'name': '++ Add New ++'
                            });
                }

            });
        /*$http
         .post(unitUrl_item, {'token': $scope.$root.token,'item_id':item_id })
         .then(function (unit_data) {
         $scope.arr_unit_of_measure = unit_data.data.response;
         // $scope.arr_unit_of_measure.push({'id': '-1', 'name': '++ Add New ++'});
         });*/
    }

    $scope.list_unit_category = [];
    $scope.get_category_list = function () {
        var get_unit_setup_category = $scope.$root.sales + "stock/unit-measure/get-unit-setup-list-category";
        $scope.list_unit_category = [];
        $http
            .post(get_unit_setup_category, {
                'token': $scope.$root.token,
                'item_id': $scope.formData.item_id
            })
            .then(function (vol_data) {
                $scope.list_unit_category = vol_data.data.response;
            });
    }
    $scope.setCountryCode = function () {
        return;
        var countryId = $scope.drp.country_id.id;
        var phoneNo = $scope.rec.phone;
        //if(phoneNo == undefined){return;}
        $scope.newFormat;
        $scope.error_msg;
        if (countryId == 225) { //UK
            $scope.newFormat = "/^\\+?\\d{2}[- ]?\\d{2}[- ]?\\d{4}[- ]?\\d{4}$/";
            $scope.error_msg = 'Please match pattern [+44 20 7123 4567 || 44 20 7123 4567]';
        } else if (countryId == 226) { //US
            $scope.newFormat = "/^\\+?\\d{1}[- ]?\d{3}[- ]?\\d{3}[- ]?\\d{4}$/";
            $scope.error_msg = 'Please match pattern [+1-541-754-3010 || 1-541-754-3010]';
        } else if (countryId == 162) { //PK
            $scope.newFormat = "/^\\+?\\d{2}[- ]?\\d{3}[- ]?\\d{7}$/";
            $scope.error_msg = 'Please match pattern [+92-333-7865809 || 92-333-7865809]';
        }

    }


    $scope.turnFormData = {};

    $scope.list_turnover = [];
    $scope.isTurnFormValid = false;

    $scope.turnoverPopup = function (drpdown) {
        $scope.isTurnFormValid = false;
        var id = drpdown.id;

        if (id > 0)
            return false;

        $scope.turnFormData = {};
        ngDialog.openConfirm({
            template: 'app/views/crm/turnover.html',
            className: 'ngdialog-theme-default-custom-large',
            scope: $scope
        }).then(function (turnFormData) {

            turnFormData.token = $scope.$root.token;
            var postUrl = $scope.$root.sales + "crm/crm/add-crm-turnover";
            if (turnFormData.turn_from < turnFormData.turn_to) {
                $scope.isTurnFormValid = true;
                $http
                    .post(postUrl, turnFormData)
                    .then(function (ress) {
                        if (ress.data.ack == true) {
                            toaster.pop('success', "Info", $scope.$root.getErrorMessageByCode(101));
                            $scope.get_turnover_list();

                            angular.forEach($scope.list_turnover, function (obj, index) {
                                if (obj.id == ress.data.id) {
                                    $scope.drp.turnover_id = $scope.list_turnover[index];
                                }
                            });

                        } else {
                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(104));
                        }
                    });
            } else {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(237, ['From','To']));
            }

        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    };

    $scope.checkTurnoverPredefinedValue = function () {
        var turn_from = $scope.turnFormData.turn_from;
        var turn_to = $scope.turnFormData.turn_to;
        if (!angular.isString(turn_from) || !angular.isString(turn_to)) {
            $scope.isTurnFormValid = false;
        } else {

            var from_value = turn_from.replace(/^\s+|\s+$/g, '');
            var to_value = turn_to.replace(/^\s+|\s+$/g, '');
            if (from_value < 0 || to_value < 0) {
                $scope.isTurnFormValid = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(238, ['Turnover value', '0']));
            } else if (from_value > to_value) {
                $scope.isTurnFormValid = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(237, ['From', 'To']));
            } else if (from_value !== '' && to_value != '')
                $scope.isTurnFormValid = true;
            else
                $scope.isTurnFormValid = false;
        }
    };

    $scope.get_turnover_list = function () {

        var urlCRMTurnovers = $scope.$root.sales + "crm/crm/crm-turnovers";
        $scope.list_turnover = [];
        $http
            .post(urlCRMTurnovers, {
                'token': $scope.$root.token
            })
            .then(function (res) {
                $scope.list_turnover = res.data.response;

                if ($scope.user_type == 1) {
                    $scope.list_turnover.push({
                        'id': '-1',
                        'turns': '++ Add New ++'
                    });
                }
            });
    };

    $scope.history_salespersons = {};

    $scope.columns_history = [];

    $scope.history_title = "";
    $scope.history_type = "";

    $scope.historytype = function (type) {
        $scope.history_type = type;

        var Url = $scope.$root.sales + "crm/crm/crm-history";

        if (type == "Salespersons")
            $scope.history_title = "Salesperson History";
        else if (type == "CreditLimit")
            $scope.history_title = "Credit Rating History";
        else if (type == "Status")
            $scope.history_title = "Status History";

        $scope.searchKeyword_price = {};

        var postData = {
            'token': $scope.$root.token,
            'crm_id': $scope.$root.crm_id,
            'type': type
        };
        $http
            .post(Url, postData)
            .then(function (res) {

                if (res.data.ack == true) {

                    $scope.crm_history = {};
                    $scope.columns_history = [];
                    $scope.crm_history = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_history.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    angular.element('#history_modal').modal({
                        show: true
                    });
                } else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                    $scope.crm_history = {};
                }

            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    };


    //$scope.rec.social_mediascrm = {};

    if ($stateParams.id == undefined)
        $scope.rec.social_mediascrm = [{
            id: ''
        }];


    $scope.crm_social_medias = [];
    $scope.columns_crm_social = [];
    $scope.crmMediaForm = {};
    $scope.socialForm = {};

    /////// End CRM Social Media///////////


    //////// Alt-Contact Social Media////////


    $scope.rec.social_mediasconatctcrm = {};
    $scope.columns_crm_socialcontact = [];

    if ($stateParams.id == undefined)
        $scope.rec.social_mediasconatctcrm = [{
            id: ''
        }];

    ////////// End Alt. Contact Social Media//


    //general tab bucket
    $scope.getbucketList_signle = function () {
        $scope.columns_bucket = [];
        $scope.record_bucket = {};
        $scope.rec.token = $scope.$root.token;
        //$scope.rec.bucket_id = id;
        $scope.title = 'Sales bucket';
        var bucketApi = $scope.$root.sales + "customer/sale-bucket/get-sale-bucket-customize-list";
        $http
            .post(bucketApi, postData)

            .then(function (res) {

                $scope.record_bucket = res.data.response;
                angular.forEach(res.data.response[0], function (val, index) {
                    $scope.columns_bucket.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                });
            });
        ngDialog.openConfirm({
            template: 'modalBucketDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (result) {

            angular.forEach(result, function (elem) {
                if (index == 'Code')
                    $scope.rec.code = elem;

                if (index == 'Name') {
                    $scope.rec.name = elem;
                    $scope.rec.bucket_id = result.id;
                }
            });

            $scope.rec.bucket_id = result.id;
            $scope.rec.bucket = result.name;
            ////console.log(result.id+"-"+result.name);

        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.bucket_selected_array = [];
    $scope.bucket_array = [];
    $scope.isBucketChanged = true;

    // if ($stateParams.id == undefined) $scope.getbucket_array();

    $scope.getbucket_array_edit = function (id, bucket_id) {

        var bucketApi = $scope.$root.sales + "customer/sale-bucket/get-crm-bucket";
        $http
            .post(bucketApi, {
                module_id: id,
                'token': $scope.$root.token,
                'type': 1
            })
            .then(function (emp_data) {

                if (emp_data.data.ack == true) {

                    $scope.$root.$apply(function () {

                        angular.forEach($scope.bucket_array, function (obj) {
                            obj.chk = false;
                            obj.isPrimary = false;
                            angular.forEach(emp_data.data.response, function (obj2) {
                                if (obj.id == obj2.bucket_id) {
                                    obj.chk = true;
                                    if (obj2.is_primary == 1)
                                        obj.isPrimary = true;
                                    $scope.bucket_selected_array.push(obj);
                                }
                            });
                            //  $scope.bucket_array.push(obj);
                        });
                        $scope.getSalePersons(1);
                        $scope.getSalePersons_edit(id);
                    });
                }
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.add_bucket = function (id) {
        var check = false;
        var bucketApi = $scope.$root.sales + "customer/sale-bucket/add-crm-bucket";
        var post = {};
        var temp = [];

        angular.forEach($scope.bucket_selected_array, function (obj) {
            temp.push({
                bucket_id: obj.id,
                isPrimary: obj.isPrimary
            });
        })
        post.type = 1;
        post.module_id = id;
        post.salesbucket = temp;
        post.token = $scope.$root.token;
        $http
            .post(bucketApi, post)
            .then(function (res) {
                if (res.data.ack == true)
                    check = true;
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
        return check;
    }

    $scope.selct_from_oop = false;
    //general tab salesperson
    $scope.getSalePersons = function (isShow) {
        $scope.title = 'Salesperson';
        if ($scope.bucket_selected_array === undefined) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Bucket']));
            return;
        }

        if (!isShow)
            angular.element('#salesPersonModal').modal({
                show: true
            });

        // if ($scope.salepersons.length > 0 && $scope.bucket_selected_array.length == 0) return;

        $scope.columns = [];
        $scope.salepersons = [];

        //var postUrl = $scope.$root.hr + "employee/listings";
        //var postUrl = $scope.$root.hr + "employee/get-Sale-Person-by-Bucket";
        //var postUrl = $scope.$root.sales + "customer/sale-group/get-sale-group-list-by-group-id";
        var postUrl = $scope.$root.sales + "customer/sale-bucket/get-sales-person-bucket";
        var postData = {
            'bucket_selected_array': $scope.bucket_selected_array,
            module_id: $scope.rec.id,
            'token': $scope.$root.token
        };
        $http
            .post(postUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    var ids = 0;
                    var ids2 = 0;
                    angular.forEach(res.data.response, function (obj) {
                        ids = obj.id.split('.')[0];
                        obj.chk = false;
                        obj.isPrimary = false;
                        if ($scope.selectedSalespersons.length > 0) {
                            angular.forEach($scope.selectedSalespersons, function (obj2) {
                                ids2 = obj2.id.split('.')[0];
                                if (ids == ids2 || $scope.selct_from_oop) {
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
                    if (!isShow)
                        angular.element('#salesPersonModal').modal({
                            show: true
                        });
                }
                //else   toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }
    // if ($stateParams.id == undefined) $scope.getSalePersons(1);
    //$scope.columns = [];
    //$scope.selectedSalespersons = [];
    angular.element(document).on('click', '.checkAllSalesperson', function () {
        $scope.selectedSalespersons = [];
        if (angular.element('.checkAllSalesperson').is(':checked') == true) {
            $scope.isSalePerersonChanged = true;
            var isPrimary = false;
            for (var i = 0; i < $scope.salepersons.length; i++) {
                if ($scope.salepersons[i].isPrimary)
                    isPrimary = true;
                $scope.salepersons[i].chk = true;
                $scope.selectedSalespersons.push($scope.salepersons[i]);
            }
            if (!isPrimary) {
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

        $scope.$apply(function () {
            $scope.selectedSalespersons;
        });

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

                    angular.forEach($scope.selectedSalespersons, function (obj, indx) {
                        if (obj != undefined) {
                            if (obj.id == sp.id)
                                $scope.selectedSalespersons.splice(indx, 1);
                        }
                    });
                } else {

                    // //console.log('i==>>'+i);
                    if (isPrimary == 1 || $scope.selectedSalespersons.length == 0) {
                        var isExist = false;
                        $scope.salepersons[i].isPrimary = true;

                        angular.forEach($scope.selectedSalespersons, function (obj, indx) {
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

    $scope.getSalePersons_edit = function (id) {

        var salepersonUrl = $scope.$root.sales + "crm/crm/get-crm-salesperson";
        $http
            .post(salepersonUrl, {
                id: id,
                'token': $scope.$root.token,
                'type': 2
            })
            .then(function (emp_data) {

                if (emp_data.data.ack == true) {

                    $scope.$root.$apply(function () {
                        var ids = 0;
                        angular.forEach($scope.salepersons, function (obj) {
                            ids = obj.id.split('.')[0];
                            obj.chk = false;
                            obj.isPrimary = false;

                            angular.forEach(emp_data.data.response, function (obj2) {
                                if (ids == obj2.salesperson_id) {
                                    obj.chk = true;
                                    if (obj2.is_primary == 1)
                                        obj.isPrimary = true;
                                    $scope.selectedSalespersons.push(obj);
                                }
                            });
                            //  $scope.salepersons.push(obj);
                        });
                    });
                }
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.add_salespersons = function (id, type) {
        var check = false;
        var excUrl = $scope.$root.sales + "crm/crm/add-crm-salesperson";
        var post = {};
        var temp = [];
        angular.forEach($scope.selectedSalespersons, function (obj) {
            if (obj.chk)
                temp.push({
                    id: obj.id,
                    isPrimary: obj.isPrimary,
                    bucket_id: obj.bucket_id
                });
        })
        post.type = type;
        // post.bucket_id = $scope.rec.bucket_id;
        post.id = id;
        post.salespersons = temp;
        post.token = $scope.$root.token;
        $http
            .post(excUrl, post)
            .then(function (res) {
                if (res.data.ack == true) {

                    check = true;
                }
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
        return check;
    }

    $scope.add_salespersons_history = function (id) {
        var excUrl = $scope.$root.sales + "crm/crm/add-crm-salesperson-log";
        var post = {};
        var temp = [];
        angular.forEach($scope.selectedSalespersons, function (obj) {
            temp.push({
                id: obj.id,
                isPrimary: obj.isPrimary
            });
        })
        post.type = 2;
        post.id = id;
        post.salespersons = temp;
        post.token = $scope.$root.token;
        $http.post(excUrl, post)
            .then(function (res) {
                //$scope.add_salespersons_log(id);
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }


    $scope.isBtnPredefined = false;
    $scope.checkPredefinedValue = function (val) {
        if (!angular.isString(val)) {
            $scope.isBtnPredefined = false;
        } else {
            var value = val.replace(/^\s+|\s+$/g, '');
            if (value !== '')
                $scope.isBtnPredefined = true;
            else
                $scope.isBtnPredefined = false;
        }
    }



    $scope.addNewCurrencyPopup = function (drp) {
        var id = drp.currency != undefined ? drp.currency.id : 0;
        if (id > 0)
            return false;
        $scope.fnDatePicker();
        $scope.currency = {};
        ngDialog.openConfirm({
            template: 'app/views/company/add_new_currency.html',
            className: 'ngdialog-theme-default-custom-large',
            scope: $scope
        }).then(function (currency) {
            var addCurrencyUrl = $scope.$root.setup + "general/add-currency";
            currency.token = $scope.$root.token;
            currency.company_id = $scope.$root.defaultCompany;
            currency.status = $scope.currency.c_status !== undefined ? $scope.currency.c_status.value : 0;
            $http
                .post(addCurrencyUrl, currency)
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', res.data.msg);
                        var currencyUrl = $scope.$root.setup + "general/currency-list";
                        $http
                            .post(currencyUrl, {
                                'company_id': $scope.$root.defaultCompany,
                                'token': $scope.$root.token
                            })
                            .then(function (res1) {
                                if (res1.data.ack == true) {

                                    $rootScope.arr_currency = res1.data.response;
                                    $rootScope.arr_currency.push({
                                        'id': '-1',
                                        'name': '++ Add New ++'
                                    });

                                    angular.forEach($rootScope.arr_currency, function (elem) {
                                        if (elem.id == res.data.id)
                                            drp.currency = elem;
                                    });

                                }

                            });
                    } else if (res.data.ack == false) {
                        toaster.pop('warning', 'Info', res.data.msg);
                    } else
                        toaster.pop('warning', 'Info', res.data.msg);
                });
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    }


    /****************************************/
    // Tasks
    /****************************************/

    $scope.opp_task_data = {};
    $scope.opp_cycle_id = 0;
    //    $scope.$on("showTasksEvent", function (event, opp_cycle_id) {
    //        $scope.opp_cycle_id = opp_cycle_id;
    //        //$scope.tasks();
    //    });
    $scope.status_data = {};
    $scope.status_data = [{
        label: 'Active',
        id: '1'
    }, {
        label: 'Inactive',
        id: '0'
    }];
    $scope.task_status = {};
    $scope.task_status = [{
        label: 'Flag',
        id: '1'
    }, {
        label: 'Schedule',
        id: '2'
    }];
    $scope.formData = {};
    $scope.edit_task = function (tdid, popup) {
        $scope.datePicker = Calendar.get_caledar();
        $scope.titile = 'View Task';
        $scope.perreadonly = false;
        $scope.check_task_readonly = true;
        $scope.formData = {};
        $scope.hide_cancel = false;

        $scope.add_task_new = true;
        //  //console.log( $scope.add_task_new);
        var postUrl = $scope.$root.com + "task/get_task";
        var postData = {
            'token': $scope.$root.token,
            'id': tdid
        };
        $http
            .post(postUrl, postData)
            .then(function (res) {
                // $scope.formData = res.data.response;
                $scope.formData.id = res.data.response.id;
                $scope.formData.t_title = res.data.response.t_title;
                $scope.formData.t_time = res.data.response.t_time;
                $scope.formData.t_image = res.data.response.t_image;
                $scope.formData.t_description = res.data.response.t_description;
                //  $scope.formData.t_description= $scope.$root.base64_decode(res.data.response.t_description);
                // angular.element('#redactor_content').val(res.data.response.t_description);


                if (res.data.response.t_date == 0) {
                    $scope.formData.t_date = null;
                } else {
                    $scope.formData.t_date = $scope.$root.convert_numeric_date_to_string(res.data.response.t_date);
                }

                angular.forEach($scope.status_data, function (obj, index) {
                    if (obj.id == res.data.response.status) {
                        $scope.formData.status = $scope.status_data[index];
                    }
                });

                angular.forEach($scope.task_status, function (obj, index) {
                    if (obj.id == res.data.response.t_status) {
                        $scope.formData.t_status = $scope.task_status[index];
                    }
                });

                if (popup != undefined) {
                    $scope.hide_cancel = true;
                    angular.element('#model_btn_task').modal({
                        show: true,
                    });
                }


            });
        angular.element('#t_time').timepicker({
            showLeadingZero: true,
            showPeriod: true,
            //   onSelect: tpStartSelect,
            maxTime: {
                hour: 24,
                minute: 60
            }
        });
    };

    $scope.tasks = function () {
        $scope.task_data = {};
        $scope.opp_task_data = {};
        var Api = $scope.$root.com + "task/task_list";
        $scope.task_data = {};
        $http
            .post(Api, {
                opp_cycle_id: $scope.opp_cycle_id,
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.task_data = res.data.response;
                    if ($scope.opp_cycle_id > 0)
                        $scope.opp_task_data = res.data.response;
                    ////console.log($scope.task_data);

                }
            });
        $scope.showLoader = false;
    }

    $scope.delete = function (id, index, opp_task_data) {
        var delUrl = $scope.$root.com + "task/delete_task";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        //  var index = arr_data.indexOf(rec.id);
                        opp_task_data.splice(index, 1);
                        // $state.go("app.task") ;       
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    };
    $scope.submit_add_task = function (formData) {
        var postUrl = $scope.$root.com + "task/add_task";
        formData.t_time = angular.element('#t_time').val();
        formData.t_description = angular.element('#redactor_content').val();
        formData.token = $scope.$root.token;
        formData.opp_cycle_id = $scope.opp_cycle_id;
        $http
            .post(postUrl, formData)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    // $state.go("app.task") ;

                    $scope.tasks();
                    $scope.add_task();
                    angular.element('#model_btn_task').modal('hide');
                } else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
            });
    };
    $scope.hide_cancel = true;
    $scope.add_tasks = function () {
        $scope.titile = 'Add Task';
        $scope.datePicker = Calendar.get_caledar();
        $scope.formData = {};
        $scope.add_task_new = true;
        $scope.perreadonly = true;
        angular.element('#t_time').timepicker({
            showLeadingZero: true,
            showPeriod: true,
            //   onSelect: tpStartSelect,
            maxTime: {
                hour: 24,
                minute: 60
            }
        });

        angular.element('#model_btn_task').modal({
            show: true,
        });
    }

    $scope.add_task = function () {
        $scope.add_task_new = true;
        $scope.perreadonly = true;
        $scope.check_task_readonly = false;
        $scope.formData = {};
    };


    //$scope.rec.social_mediascrm = {};

    if ($stateParams.id == undefined)
        $scope.rec.social_mediascrm = [{
            id: ''
        }];


    $scope.crm_social_medias = [];
    $scope.columns_crm_social = [];
    $scope.crmMediaForm = {};
    $scope.socialForm = {};


    /////// End CRM Social Media///////////


    //////// Alt-Contact Social Media////////


    $scope.rec.social_mediasconatctcrm = {};
    $scope.columns_crm_socialcontact = [];

    if ($stateParams.id == undefined)
        $scope.rec.social_mediasconatctcrm = [{
            id: ''
        }];


    ////////// End Alt. Contact Social Media//


    //general tab bucket
    $scope.getbucketList_signle = function () {
        $scope.columns_bucket = [];
        $scope.record_bucket = {};
        $scope.rec.token = $scope.$root.token;
        //$scope.rec.bucket_id = id;
        $scope.title = 'Sales bucket';
        var bucketApi = $scope.$root.sales + "customer/sale-bucket/get-sale-bucket-customize-list";
        $http
            .post(bucketApi, postData)
            .then(function (res) {

                $scope.record_bucket = res.data.response;
                angular.forEach(res.data.response[0], function (val, index) {
                    $scope.columns_bucket.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                });
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });

        ngDialog.openConfirm({
            template: 'modalBucketDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (result) {

            angular.forEach(result, function (elem, index) {

                if (index == 'Code')
                    $scope.rec.code = elem;

                if (index == 'Name') {
                    $scope.rec.name = elem;
                    $scope.rec.bucket_id = result.id;
                }
            });

            $scope.rec.bucket_id = result.id;
            $scope.rec.bucket = result.name;
            ////console.log(result.id+"-"+result.name);

        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.bucket_selected_array = [];
    $scope.bucket_array = [];
    $scope.isBucketChanged = true;


    $scope.getbucket_array_edit = function (id, bucket_id) {

        var bucketApi = $scope.$root.sales + "customer/sale-bucket/get-crm-bucket";
        $http
            .post(bucketApi, {
                module_id: id,
                'token': $scope.$root.token,
                'type': 1
            })
            .then(function (emp_data) {

                if (emp_data.data.ack == true) {

                    $scope.$root.$apply(function () {

                        angular.forEach($scope.bucket_array, function (obj) {
                            obj.chk = false;
                            obj.isPrimary = false;
                            angular.forEach(emp_data.data.response, function (obj2) {
                                if (obj.id == obj2.bucket_id) {
                                    obj.chk = true;
                                    if (obj2.is_primary == 1)
                                        obj.isPrimary = true;
                                    $scope.bucket_selected_array.push(obj);
                                }
                            });
                            //  $scope.bucket_array.push(obj);
                        });
                        $scope.getSalePersons(1);
                        $scope.getSalePersons_edit(id);
                    });
                }
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.add_bucket = function (id) {
        var check = false;
        var bucketApi = $scope.$root.sales + "customer/sale-bucket/add-crm-bucket";
        var post = {};
        var temp = [];

        angular.forEach($scope.bucket_selected_array, function (obj) {
            temp.push({
                bucket_id: obj.id,
                isPrimary: obj.isPrimary
            });
        });

        post.type = 1;
        post.module_id = id;
        post.salesbucket = temp;
        post.token = $scope.$root.token;
        $http
            .post(bucketApi, post)
            .then(function (res) {
                if (res.data.ack == true)
                    check = true;
            });
        return check;
    }

    $scope.selct_from_oop = false;


    $scope.isBtnPredefined = false;
    $scope.checkPredefinedValue = function (val) {
        if (!angular.isString(val)) {
            $scope.isBtnPredefined = false;
        } else {
            var value = val.replace(/^\s+|\s+$/g, '');
            if (value !== '')
                $scope.isBtnPredefined = true;
            else
                $scope.isBtnPredefined = false;
        }
    }

    $scope.addNewPredefinedPopup = function (drpdown, type, title, drp) {
        return;
    }


    $scope.addNewCurrencyPopup = function (drp) {
        var id = drp.currency != undefined ? drp.currency.id : 0;
        if (id > 0)
            return false;
        $scope.fnDatePicker();
        $scope.currency = {};
        ngDialog.openConfirm({
            template: 'app/views/company/add_new_currency.html',
            className: 'ngdialog-theme-default-custom-large',
            scope: $scope
        }).then(function (currency) {
            var addCurrencyUrl = $scope.$root.setup + "general/add-currency";
            currency.token = $scope.$root.token;
            currency.company_id = $scope.$root.defaultCompany;
            currency.status = $scope.currency.c_status !== undefined ? $scope.currency.c_status.value : 0;
            $http
                .post(addCurrencyUrl, currency)
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', res.data.msg);
                        var currencyUrl = $scope.$root.setup + "general/currency-list";
                        $http
                            .post(currencyUrl, {
                                'company_id': $scope.$root.defaultCompany,
                                'token': $scope.$root.token
                            })
                            .then(function (res1) {
                                if (res1.data.ack == true) {

                                    $rootScope.arr_currency = res1.data.response;
                                    $rootScope.arr_currency.push({
                                        'id': '-1',
                                        'name': '++ Add New ++'
                                    });

                                    angular.forEach($rootScope.arr_currency, function (elem) {
                                        if (elem.id == res.data.id)
                                            drp.currency = elem;
                                    });
                                }
                            });

                    } else if (res.data.ack == false) {
                        toaster.pop('warning', 'Info', res.data.msg);
                    } else
                        toaster.pop('warning', 'Info', res.data.msg);
                });
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    }


    /****************************************/
    // Tasks
    /****************************************/

    $scope.opp_task_data = {};
    $scope.opp_cycle_id = 0;
    //    $scope.$on("showTasksEvent", function (event, opp_cycle_id) {
    //        $scope.opp_cycle_id = opp_cycle_id;
    //        //$scope.tasks();
    //    });
    $scope.status_data = {};
    $scope.status_data = [{
        label: 'Active',
        id: '1'
    }, {
        label: 'Inactive',
        id: '0'
    }];
    $scope.task_status = {};
    $scope.task_status = [{
        label: 'Flag',
        id: '1'
    }, {
        label: 'Schedule',
        id: '2'
    }];
    $scope.formData = {};
    $scope.edit_task = function (tdid, popup) {
        $scope.datePicker = Calendar.get_caledar();
        $scope.titile = 'View Task';
        $scope.perreadonly = false;
        $scope.check_task_readonly = true;
        $scope.formData = {};
        $scope.hide_cancel = false;
        $scope.add_task_new = true;
        //  //console.log( $scope.add_task_new);
        var postUrl = $scope.$root.com + "task/get_task";
        var postData = {
            'token': $scope.$root.token,
            'id': tdid
        };
        $http
            .post(postUrl, postData)
            .then(function (res) {
                // $scope.formData = res.data.response;
                $scope.formData.id = res.data.response.id;
                $scope.formData.t_title = res.data.response.t_title;
                $scope.formData.t_time = res.data.response.t_time;
                $scope.formData.t_image = res.data.response.t_image;
                $scope.formData.t_description = res.data.response.t_description;
                //  $scope.formData.t_description= $scope.$root.base64_decode(res.data.response.t_description);
                // angular.element('#redactor_content').val(res.data.response.t_description);


                if (res.data.response.t_date == 0) {
                    $scope.formData.t_date = null;
                } else {
                    $scope.formData.t_date = $scope.$root.convert_numeric_date_to_string(res.data.response.t_date);
                }

                angular.forEach($scope.status_data, function (obj, index) {
                    if (obj.id == res.data.response.status) {
                        $scope.formData.status = $scope.status_data[index];
                    }
                });

                angular.forEach($scope.task_status, function (obj, index) {
                    if (obj.id == res.data.response.t_status) {
                        $scope.formData.t_status = $scope.task_status[index];
                    }
                });
                if (popup != undefined) {
                    $scope.hide_cancel = true;
                    angular.element('#model_btn_task').modal({
                        show: true,
                    });
                }


            });
        angular.element('#t_time').timepicker({
            showLeadingZero: true,
            showPeriod: true,
            //   onSelect: tpStartSelect,
            maxTime: {
                hour: 24,
                minute: 60
            }
        });
    };

    $scope.tasks = function () {
        $scope.task_data = {};
        $scope.opp_task_data = {};
        var Api = $scope.$root.com + "task/task_list";
        $scope.task_data = {};
        $http
            .post(Api, {
                opp_cycle_id: $scope.opp_cycle_id,
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.task_data = res.data.response;
                    if ($scope.opp_cycle_id > 0)
                        $scope.opp_task_data = res.data.response;
                    ////console.log($scope.task_data);

                }
            });
        $scope.showLoader = false;
    }

    $scope.delete = function (id, index, opp_task_data) {
        var delUrl = $scope.$root.com + "task/delete_task";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        //  var index = arr_data.indexOf(rec.id);
                        opp_task_data.splice(index, 1);
                        // $state.go("app.task") ;     
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    };
    $scope.submit_add_task = function (formData) {
        var postUrl = $scope.$root.com + "task/add_task";
        formData.t_time = angular.element('#t_time').val();
        formData.t_description = angular.element('#redactor_content').val();
        formData.token = $scope.$root.token;
        formData.opp_cycle_id = $scope.opp_cycle_id;
        $http
            .post(postUrl, formData)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    // $state.go("app.task") ;

                    $scope.tasks();
                    $scope.add_task();
                    angular.element('#model_btn_task').modal('hide');
                } else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
            });
    };
    $scope.hide_cancel = true;
    $scope.add_tasks = function () {
        $scope.titile = 'Add Task';
        $scope.datePicker = Calendar.get_caledar();
        $scope.formData = {};
        $scope.add_task_new = true;
        $scope.perreadonly = true;
        angular.element('#t_time').timepicker({
            showLeadingZero: true,
            showPeriod: true,
            //   onSelect: tpStartSelect,
            maxTime: {
                hour: 24,
                minute: 60
            }
        });
        /*angular.element('#redactor_content').redactor( {

         //imageUpload: '<?php //echo base_url("asset/redactor-js-master/demo/scripts/image_upload.php")  ?>',          // fileUpload: '<?php //echo base_url
         ("asset/redactor-js-master/demo/scripts/file_upload.php")  ?>',          //  imageUpload: "adminpanel/AdminJobs/editer_image_upload",
         // fileUpload: 'adminpanel/AdminJobs/editer_file_upload',

         } );*/

        angular.element('#model_btn_task').modal({
            show: true,
        });
    }

    $scope.add_task = function () {
        $scope.add_task_new = true;
        $scope.perreadonly = true;
        $scope.check_task_readonly = false;
        $scope.formData = {};
    };

    $scope.$root.load_date_picker('crm');

    $scope.item_paging = {};
    $scope.itemselectPage = function (pageno) {
        $scope.item_paging.spage = pageno;
    };
    $scope.$root.set_document_internal($scope.$root.crm_general_tab_module);
    $scope.row_id = $stateParams.id; //$scope.$root.crm_id
    $scope.module_id = 0;
    $scope.subtype = 1;
    $scope.module = "Sales & CRM";
    $scope.module_name = "CRM";
    // $scope.model_code=$scope.$root.bdname;

    $scope.$root.$broadcast("image_module", $scope.row_id, $scope.module, $scope.module_id, $scope.module_name, $scope.module_code, $scope.subtype, $scope.$root.tab_id);

}


myApp.controller('nexttabcrmcontroller', nexttabcrmcontroller);

function nexttabcrmcontroller($scope, $filter, $http, $state, $resource, ngDialog, toaster, $timeout, $rootScope, $stateParams, Upload, SubmitContactLoc, SubmitPrice, moduleTracker) {
    'use strict';


    $scope.supplierPrice = false;

    /****************************************/
    // CRM Contact Area Start
    /****************************************/

    $scope.socialMediasContactArr = {};
    $scope.tempSocialMedia = [];
    $scope.qty = 5;
    $scope.defaultOption = 2;

    $scope.showAltContListing = function () {
        $scope.altContacFormShow = false;
        $scope.altContacListingShow = true;
    }

    // reload Setup global data
    $rootScope.get_global_data(1);

    $scope.columns_contact = [];
    $scope.record_data_contact = {};
    $scope.getAltContacts = function (arg, showdata2) {

        if (showdata2 == 0 && $scope.check_alt_depot_readonly == true) {
            toaster.pop('warning', 'info', 'There is no contact assigned!'); return;
        }

        $scope.altContacFormShow = false;
        $scope.altContacListingShow = true;
        $scope.showLoader = true;
        // $scope.$root.breadcrumbs[3].name = 'Other Contacts';
        var ApiAjax = $scope.$root.sales + "crm/crm/alt-contacts";
        $scope.postData = {
            'column': 'crm_alt_contact.crm_id',
            'value': $stateParams.id,
            'module_type': $rootScope.CRMType,
            token: $scope.$root.token
        }

        console.log('arg:', arg);

        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res) {
                $scope.loc_columns = [];
                $scope.columns_contact = [];
                $scope.record_data_contact = {};
                $scope.showLoader = false;
                if (res.data.record.ack == true) {

                    /*$scope.total = res.data.total;

                     $scope.item_paging.total_pages = res.data.total_pages;
                     $scope.item_paging.cpage = res.data.cpage;
                     $scope.item_paging.ppage = res.data.ppage;
                     $scope.item_paging.npage = res.data.npage;
                     $scope.item_paging.pages = res.data.pages;

                     $scope.total_paging_record = res.data.total_paging_record;*/

                    $scope.record_data_contact = res.data.record.result;


                    if (arg != undefined) {
                        // $scope.record_data_contact = res.data.record.result;

                        //$scope.record_AddContactLoc = res.data.record.result;
                        //if (arg == 1) $scope.record_data_contact.push({id: '-1', name: "Mian Office"});

                        $scope.get_contact_location_dropdown($scope.rec_loc.id, 1);

                    } else {
                        $scope.record_ContactLoc = res.data.record.result;
                        // console.log($scope.record_ContactLoc);
                    }

                    angular.forEach($scope.record_data_contact[0], function (val, index) {
                        if (index != 'chk' && index != 'id') {
                            $scope.loc_columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                            $scope.columns_contact.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }
                    });
                } else {

                    if (arg == 1) {

                        toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Contact']));

                        // $scope.messageType = 'location';                      
                        // ngDialog.openConfirm({
                        //     template: 'noticationloc',
                        //     // template: 'app/views/_conform_leave.html',
                        //     className: 'ngdialog-theme-default',
                        //     scope: $scope
                        // }).then(function (result) {

                        // }, function (reason) {
                        //     console.log('Modal promise rejected. Reason: ', reason);
                        // });
                    }

                    //if (arg != undefined) {
                    //    if (arg == 1) $scope.record_data_contact = [{id: '-1', name: "Mian Office"}];
                    //}
                }

            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.edit_contact_form = function (id, mode) {
        $scope.altContacFormShow = true;
        $scope.altContacListingShow = false;

        $scope.reset_contact_Form();
        $scope.showLoader = true;

        if (id > 0) {

            var altcontUrl = $scope.$root.sales + "crm/crm/get-alt-contact-by-id";
            angular.element('.accordion-toggle').trigger('click');

            $http
                .post(altcontUrl, {
                    id: id,
                    'module_type': $rootScope.CRMType,
                    'token': $scope.$root.token
                })
                .then(function (res) {

                    if (res.data.ack == true) {

                        $scope.rec_contact = {};
                        $scope.rec_contact = res.data.response;
                        $scope.rec_contact.id = res.data.response.id;

                        angular.forEach($rootScope.country_type_arr, function (obj) {
                            if (obj.id == res.data.response.country)
                                $scope.rec_contact.alt_country_id = obj;
                        });
                        angular.forEach($rootScope.arr_pref_method_comm, function (obj) {
                            if (obj.id == res.data.response.pref_method_of_communication)
                                $scope.drp.pref_mthod_of_comm = obj;
                        });

                        $scope.rec_contact.showdata2 = 0;
                        $scope.record_data_contact = res.data.response.loc;
                        $scope.selected_data_loc_contact = res.data.response.ContactLoc;

                        if ($scope.record_data_contact != undefined && $scope.selected_data_loc_contact != undefined) {
                            angular.forEach($scope.record_data_contact, function (obj) {
                                obj.chk = false;

                                angular.forEach($scope.selected_data_loc_contact, function (obj2) {
                                    if (obj.id == obj2.id) {
                                        obj.chk = true;
                                        $scope.rec_contact.showdata2++;
                                    }
                                });
                            });
                        }

                        // Retriving social media names.

                        /* angular.forEach($rootScope.social_medias, function (obj) {
                            if (obj.id == res.data.response.socialmedia1)
                                $scope.rec_contact.socialmedia1 = obj;

                            if (obj.id == res.data.response.socialmedia2)
                                $scope.rec_contact.socialmedia2 = obj;

                            if (obj.id == res.data.response.socialmedia3)
                                $scope.rec_contact.socialmedia3 = obj;

                            if (obj.id == res.data.response.socialmedia4)
                                $scope.rec_contact.socialmedia4 = obj;

                            if (obj.id == res.data.response.socialmedia5)
                                $scope.rec_contact.socialmedia5 = obj;
                        });


                        if (res.data.response.socialmedia1 == 0)
                            $scope.rec_contact.socialmedia1 = null;

                        if (res.data.response.socialmedia2 == 0)
                            $scope.rec_contact.socialmedia2 = null;

                        if (res.data.response.socialmedia3 == 0)
                            $scope.rec_contact.socialmedia3 = null;

                        if (res.data.response.socialmedia4 == 0)
                            $scope.rec_contact.socialmedia4 = null;

                        if (res.data.response.socialmedia5 == 0)
                            $scope.rec_contact.socialmedia5 = null;
                        */

                        $scope.tempSocialMedia = [];
                        angular.forEach($rootScope.social_medias, function (obj) {

                            if (obj.id == $scope.rec_contact.socialmedia1 && $scope.rec_contact.socialmedia1 != 0) {
                                obj.value = $scope.rec_contact.socialmedia1_value;
                                $scope.tempSocialMedia.push(obj);
                            }
                            if (obj.id == $scope.rec_contact.socialmedia2 && $scope.rec_contact.socialmedia2 != 0) {
                                obj.value = $scope.rec_contact.socialmedia2_value;
                                $scope.tempSocialMedia.push(obj);
                            }
                            if (obj.id == $scope.rec_contact.socialmedia3 && $scope.rec_contact.socialmedia3 != 0) {
                                obj.value = $scope.rec_contact.socialmedia3_value;
                                $scope.tempSocialMedia.push(obj);
                            }
                            if (obj.id == $scope.rec_contact.socialmedia4 && $scope.rec_contact.socialmedia4 != 0) {
                                obj.value = $scope.rec_contact.socialmedia4_value;
                                $scope.tempSocialMedia.push(obj);
                            }
                            if (obj.id == $scope.rec_contact.socialmedia5 && $scope.rec_contact.socialmedia5 != 0) {
                                obj.value = $scope.rec_contact.socialmedia5_value;
                                $scope.tempSocialMedia.push(obj);
                            }

                        });
                        if ($scope.tempSocialMedia.length) {
                            $scope.socialMediasContactArr = {};
                            $scope.socialMediasContactArr['socialMediasContact'] = $scope.tempSocialMedia;
                        }

                        // $scope.rec_contact.showdata2 = res.data.response.showdata;
                    }

                    $scope.showLoader = false;
                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
                });


            if (mode == 1)
                $scope.check_contact_readonly = true;
            else if (mode == 0)
                $scope.check_contact_readonly = false;
        } else {
            $scope.rec_contact = {};
            // $scope.socialMediasContactArr ={};
            $scope.check_contact_readonly = false;
            $scope.rec_contact.showdata2 = 0;
            $scope.showLoader = false;
        }
    }

    $scope.showEditForm_contact = function () {
        $scope.check_contact_readonly = false;
    }

    $scope.delete_contact = function (id) {

        var delUrl = $scope.$root.sales + "crm/crm/delete-alt-contact";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: id,
                    crm_id: $stateParams.id,
                    'module_type': $rootScope.CRMType,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () {
                            $scope.getAltContacts();
                        }, 1500)
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    };

    $scope.isCheced = false;

    $scope.sameAsGeneral_contact = function () {
        if ($scope.isCheced == false) {
            $scope.rec_contact.depot = 'Main office';
            $scope.rec_contact.address_1 = $scope.rec.address_1;
            $scope.rec_contact.address_2 = $scope.rec.address_2;
            $scope.rec_contact.city = $scope.rec.city;
            $scope.rec_contact.county = $scope.rec.county;
            $scope.rec_contact.postcode = $scope.rec.postcode;

            angular.forEach($rootScope.country_type_arr, function (elem) {
                if (elem.id == $scope.$root.defaultCountry)
                    $scope.rec_contact.alt_country_id = elem;
            });

            $scope.isCheced = true;
        } else {
            $scope.rec_contact.depot = null;
            $scope.rec_contact.address_1 = null;
            $scope.rec_contact.address_2 = null;
            $scope.rec_contact.city = null;
            $scope.rec_contact.county = null;
            $scope.rec_contact.postcode = null;

            angular.forEach($rootScope.country_type_arr, function (elem) {
                if (elem.id == $scope.$root.defaultCountry)
                    $scope.rec_contact.alt_country_id = elem;
            });
            $scope.isCheced = false;
        }
    }

    $scope.reset_contact_Form = function (rec_contact) {
        $scope.rec_contact = {};
        $scope.rec_contact.alitcotact_scoial = [{
            id: ''
        }];
        $scope.selected_data_loc_contact = [{
            id: ''
        }];
        $scope.tempSocialMedia = [];
        $scope.socialMediasContactArr = {};

        $rootScope.social_medias_contact_form = [];
        angular.forEach($rootScope.social_medias, function (element) {
            if (element.value != undefined && element.value.length > 0)
                delete element.value;
        });
        angular.copy($rootScope.social_medias, $rootScope.social_medias_contact_form);
        //angular.element("#contact_name").parsley().reset();
        angular.element("#alt_contact").parsley().reset();


        angular.forEach($rootScope.country_type_arr, function (elem) {
            if (elem.id == $scope.$root.defaultCountry)
                $scope.rec_contact.alt_country_id = elem;
        });
        $scope.reset_loc_Form();
    }
    $scope.rec_contact = {};

    $scope.add_contact = function (rec_contact, drp) {

        rec_contact.acc_id = $scope.$root.crm_id;
        rec_contact.module_type = $rootScope.CRMType;
        rec_contact.social_media_arr_contact = $scope.socialMediasContactArr.socialMediasContact;

        SubmitContactLoc.contact(rec_contact, drp, $scope.record_data_contact, $scope.selected_data_loc_contact)
            .then(function (result) {
                //console.log(result);
                if (result == true) {
                    $scope.getAltContacts();
                }
            }, function (error) {
                console.log(error);
            });

        return;
    }

    $scope.addLocationfromcontact = function (rec_contact) {
        var altAddUrl = $scope.$root.sales + "crm/crm/add-alt-depot";

        rec_contact.address = rec_contact.address_1;
        rec_contact.role = rec_contact.job_title;
        rec_contact.telephone = rec_contact.phone;
        rec_contact.is_primary = 1;
        rec_contact.module_type = $rootScope.CRMType;
        rec_contact.token = $scope.$root.token;


        $http
            .post(altAddUrl, rec_contact)
            .then(function (res) {

            })
    }

    /*=========================================================*/
    /*              contact social media                       */
    /*=========================================================*/

    $scope.rec_contact.alitcotact_scoial = {};
    $scope.columnalitcotact_scoial = [];

    // Not in use start
    $scope.getcolumnalitcotact_scoial_list = function () {

        var urlCRMSocialMedias = $scope.$root.sales + "crm/crm/alt-contact-social-medias";

        $http
            .post(urlCRMSocialMedias, {
                'token': $scope.$root.token,
                'crm_id': $scope.$root.crm_id,
                'alt_contact_id': $scope.rec_contact.id
            })
            .then(function (res) {
                if (res.data.ack == true) {

                    $scope.rec_contact.alitcotact_scoial = res.data.response;

                    $scope.$root.$apply(function () {
                        angular.forEach($scope.rec_contact.alitcotact_scoial, function (obj2) {
                            // obj2.media_id = '';
                            angular.forEach($rootScope.social_medias, function (elem) {
                                if (elem.id == obj2.media_id)
                                    obj2.media_id = elem;
                            });
                        });
                    });
                } else
                    $scope.rec_contact.alitcotact_scoial = [{
                        id: ''
                    }];
            });
    };


    $scope.addcolumnalitcotact_scoial_list = function (rec_contact, id) {


        rec_contact.crm_id = $scope.$root.crm_id;
        rec_contact.alt_contact_id = id;
        // rec_contact.social_mediasconatctcrmset = $scope.rec_contact.alitcotact_scoial;

        var postUrl = $scope.$root.sales + "crm/crm/add-alt-contact-social-media";
        $http
            .post(postUrl, rec_contact)
            .then(function (ress) {
               
            });


    }
    // Not in use End


    /****************************************/
    // CRM Contact Area End
    /****************************************/
    $scope.toggleButton = function () {
        $scope.toggle = !$scope.toggle;
    }

    /****************************************/
    // CRM Location Area Start
    /****************************************/
    $scope.loc_columns = [];
    $scope.loc_record_data = {};
    $scope.showLocationListing = function () {
        $scope.altDepotListingShow = true;
        $scope.altDepotFormShow = false;
    }

    $scope.showEditForm_loc = function () {

        $scope.check_alt_depot_readonly = false;
    }
    $scope.record_data_contact = {};

    $scope.getAltLocation = function (arg, showdata2) {

        if (showdata2 == 0 && $scope.check_contact_readonly == true) {
            toaster.pop('warning', 'info', 'There is no location assigned!');
            return;
        }
        $scope.altDepotListingShow = true;
        $scope.altDepotFormShow = false;
        $scope.showLoader = true;

        $scope.loc_columns = [];
        $scope.columns_Loc = [];
        $scope.record_data_contact = {};
        $scope.loc_record_data = {};

        // $scope.$root.breadcrumbs[3].name = 'Other Locations';

        var ApiAjax = $scope.$root.sales + "crm/crm/alt-depots";
        $scope.postData = {
            'column': 'crm_id',
            'value': $stateParams.id,
            'module_type': $rootScope.CRMType,
            token: $scope.$root.token
        }

        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res) {
                $scope.loc_columns = [];
                $scope.columns_Loc = [];
                $scope.record_data_contact = {};
                $scope.loc_record_data = {};
                $scope.showLoader = false;
                if (res.data.record.ack == true) {

                    $scope.loc_record_data = res.data.record.result;

                    if (arg != undefined) {
                        $scope.record_data_contact = res.data.record.result;
                        // $scope.record_AddLocContact = res.data.record.result;
                        //if (arg == 1) $scope.record_data_contact.push({id: '-1', name: "Mian Office"});

                        $scope.get_contact_location_dropdown($scope.rec_contact.id, 2);
                    }

                    angular.forEach($scope.loc_record_data[0], function (val, index) {
                        if (index != 'chk' && index != 'id') {
                            $scope.loc_columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });

                            $scope.columns_Loc.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }
                    });
                } else {

                    if (arg == 1) {
                        toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Location']));
                    }
                }
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.loc_editForm = function (id, mode) {

        // $scope.getAltContacts();
        $scope.showLoader = true;
        $scope.altDepotFormShow = true;
        $scope.altDepotListingShow = false;

        $scope.reset_loc_Form();
        if (id > 0) {

            var altdepotUrl = $scope.$root.sales + "crm/crm/get-alt-depot";
            // angular.element('.accordion-toggle').trigger('click');

            // console.log('asdasdasdasd');
            $http
                .post(altdepotUrl, {
                    id: id,
                    crm_id: $stateParams.id,
                    'module_type': $rootScope.CRMType,
                    'token': $scope.$root.token
                })
                .then(function (res) {

                    if (res.data.ack == true) {


                        $scope.rec_loc = res.data.response;
                        $scope.rec_loc.id = res.data.response.id;


                        angular.forEach($rootScope.country_type_arr, function (elem) {
                            if (elem.id == res.data.response.country)
                                $scope.rec_loc.depo_country_id = elem;
                        });

                        angular.forEach($rootScope.arr_pref_method_comm, function (elem) {
                            if (elem.id == res.data.response.pref_method_of_communication)
                                $scope.drp.pref_mthod_of_comm = elem;

                            /*if (elem.id == res.data.response.booking_pref_method_of_communication)
                             $scope.drp.booking_pref_mthod_of_comm = elem;*/

                            if (elem.id == res.data.response.clpref_method_of_communication)
                                $scope.drp.booking_pref_mthod_of_comm = elem;
                        });

                        if (res.data.response.region_id > 0) {
                            angular.forEach($rootScope.region_customer_arr, function (elem) {
                                if (elem.id == res.data.response.region_id)
                                    $scope.rec_loc.region_id = elem;
                            });
                        } else {
                            res.data.response.region_id = '';
                        }


                        //return get_contact_listings();
                        $scope.rec_loc.showdata2 = 0;

                        $scope.record_ContactLoc = res.data.loc_contact;
                        $scope.record_data_contact = res.data.loc_contact;
                        $scope.selected_data_loc_contact = res.data.response.ContactLoc;

                        if ($scope.record_data_contact != undefined && $scope.selected_data_loc_contact != undefined) {
                            angular.forEach($scope.record_data_contact, function (obj) {
                                obj.chk = false;

                                angular.forEach($scope.selected_data_loc_contact, function (obj2) {
                                    if (obj.id == obj2.id) {
                                        obj.chk = true;
                                        $scope.rec_loc.showdata2++;
                                    }
                                });
                            });
                        }

                        if (res.data.loc_contact != undefined) {
                            angular.forEach(res.data.loc_contact, function (obj) {
                                if (obj.id == res.data.response.alt_contact_id)
                                    $scope.rec_loc.booking_contact = obj;
                            });
                        }

                        $scope.rec_loc.booking_job_title = res.data.response.cljob_title;
                        $scope.rec_loc.booking_direct_line = res.data.response.cldirect_line;
                        $scope.rec_loc.booking_mobile = res.data.response.clmobile;
                        $scope.rec_loc.booking_email = res.data.response.clemail;
                        $scope.rec_loc.booking_telephone = res.data.response.clphone;
                        $scope.rec_loc.booking_fax = res.data.response.clfax;
                        $scope.rec_loc.email = res.data.response.gen_email_address;
                        // $scope.rec_loc.phone = res.data.response.gen_office_phone;
                        angular.forEach($rootScope.crm_shippment_methods_arr, function (elem) {
                            if (elem.id == res.data.response.shipment_method)
                            $scope.rec_loc.shipment_method = elem;
                        });
                        $scope.rec_loc.target_amount = res.data.response.target_amount;
                          
                        if (res.data.response.gen_office_phone)
                            $scope.rec_loc.phone = res.data.response.gen_office_phone;
                        else
                            $scope.rec_loc.phone = res.data.response.telephone;
                        // $scope.rec_loc.showdata2 = res.data.response.showdata;

                    }
                    $scope.showLoader = false;

                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
                });
            //$scope.get_contact_location_dropdown(id, 1);

            if (mode == 1)
                $scope.check_alt_depot_readonly = true;
            else if (mode == 0)
                $scope.check_alt_depot_readonly = false;
        } else {
            $scope.getAltContacts();
            $scope.check_alt_depot_readonly = false;
            $scope.rec_loc.showdata2 = 0;
            // $scope.$root.breadcrumbs[3].name = 'Other Locations';
            $scope.showLoader = false;
        }
    }

    $scope.reset_loc_Form = function () {

        $scope.rec_loc = {};
        $scope.drp = {};

        /*angular.element("#depot").parsley().reset();
         angular.element("#postcode").parsley().reset();*/
        angular.element("#alt_location").parsley().reset();

        $scope.rec_loc.addcontactslisting = {}
        $scope.rec_loc.addcontactslisting = [{
            id: ''
        }];
        $scope.record_data_contact_list = {};
        // //console.log($scope.rec_loc);
        angular.forEach($rootScope.country_type_arr, function (elem) {
            if (elem.id == $scope.$root.defaultCountry)
                $scope.rec_loc.depo_country_id = elem;
        });

        $scope.isselectcontactlocchk = false;

        $scope.selected_data_loc_contact = [{
            id: ''
        }];
        /*$scope.rec_loc.is_billing_address = 1;
         $scope.rec_loc.is_delivery_collection_address = 1;
         $scope.rec_loc.is_invoice_address = 1;*/


    }


    $scope.SetDetailEmptyOnUncheck = function () {
        if (angular.element('#locis_delivery_collection_address').is(':checked') == false) {
            $scope.rec_loc.is_delivery_collection_address = 0;
            $scope.EmptyDeliveryDetailRec();
        }
    }

    $scope.EmptyDeliveryDetailRec = function () {
        $scope.rec_loc.booking_contact = "";
        $scope.rec_loc.booking_job_title = "";
        $scope.rec_loc.booking_direct_line = "";
        $scope.rec_loc.booking_mobile = "";
        $scope.rec_loc.booking_telephone = "";
        $scope.rec_loc.booking_fax = "";
        $scope.rec_loc.booking_email = "";
        $scope.drp.booking_pref_mthod_of_comm = "";


        $scope.rec_loc.monday_start_time = "";
        $scope.rec_loc.monday_end_time = "";
        $scope.rec_loc.monday_notes = "";

        $scope.rec_loc.tuesday_start_time = "";
        $scope.rec_loc.tuesday_end_time = "";
        $scope.rec_loc.tuesday_notes = "";

        $scope.rec_loc.wednesday_start_time = "";
        $scope.rec_loc.wednesday_end_time = "";
        $scope.rec_loc.wednesday_notes = "";

        $scope.rec_loc.thursday_start_time = "";
        $scope.rec_loc.thursday_end_time = "";
        $scope.rec_loc.thursday_notes = "";

        $scope.rec_loc.friday_start_time = "";
        $scope.rec_loc.friday_end_time = "";
        $scope.rec_loc.friday_notes = "";

        $scope.rec_loc.saturday_start_time = "";
        $scope.rec_loc.saturday_end_time = "";
        $scope.rec_loc.saturday_notes = "";

        $scope.rec_loc.sunday_start_time = "";
        $scope.rec_loc.sunday_end_time = "";
        $scope.rec_loc.sunday_notes = "";
    }

    $scope.add_location = function (rec_loc, drp) {
      
        let monday_startTime = new Date("11/22/2022 " + $scope.rec_loc.monday_start_time);
        let monday_endTime = new Date("11/22/2022 " + $scope.rec_loc.monday_end_time);

        let tuesday_startTime = new Date("11/22/2022 " + $scope.rec_loc.tuesday_start_time);
        let tuesday_endTime = new Date("11/22/2022 " + $scope.rec_loc.tuesday_end_time);

        let wednesday_startTime = new Date("11/22/2022 " + $scope.rec_loc.wednesday_start_time);
        let wednesday_endTime = new Date("11/22/2022 " + $scope.rec_loc.wednesday_end_time);

        let thursday_startTime = new Date("11/22/2022 " + $scope.rec_loc.thursday_start_time);
        let thursday_endTime = new Date("11/22/2022 " + $scope.rec_loc.thursday_end_time);

        let friday_startTime = new Date("11/22/2022 " + $scope.rec_loc.friday_start_time);
        let friday_endTime = new Date("11/22/2022 " + $scope.rec_loc.friday_end_time);

        let saturday_startTime = new Date("11/22/2022 " + $scope.rec_loc.saturday_start_time);
        let saturday_endTime = new Date("11/22/2022 " + $scope.rec_loc.saturday_end_time);

        let sunday_startTime = new Date("11/22/2022 " + $scope.rec_loc.sunday_start_time);
        let sunday_endTime = new Date("11/22/2022 " + $scope.rec_loc.sunday_end_time);

        if (rec_loc.is_primary > 0 && !rec_loc.address && !rec_loc.postcode) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(652));
            return false;
        }

        // if (monday_startTime > monday_endTime ||
        //     tuesday_startTime > tuesday_endTime ||
        //     wednesday_startTime > wednesday_endTime ||
        //     thursday_startTime > thursday_endTime ||
        //     friday_startTime > friday_endTime ||
        //     saturday_startTime > saturday_endTime ||
        //     sunday_startTime > sunday_endTime
        // ) {
        //     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(648));
        // } else {
        rec_loc.acc_id = $scope.$root.crm_id;
        rec_loc.module_type = $rootScope.CRMType;

            if (rec_loc.is_billing_address || rec_loc.is_invoice_address) {
                // api to check dublication address
                var ApiAddressdublication = $scope.$root.sales + "crm/crm/checkAddressDuplication";
                $scope.postDublicationData = {
                    token: $scope.$root.token,
                    rec: rec_loc
                }

                $http
                    .post(ApiAddressdublication, $scope.postDublicationData)
                    .then(function (res) {
                        var templateName = "";
                        if (res.data.billing == 1 && res.data.payment == 1) {
                            templateName = "modalBillingPaymentDialogId";
                        }
                        else if (res.data.billing == 1) {
                            templateName = "modalBillingDialogId";

                        }
                        else if (res.data.payment == 1) {
                            templateName = "modalPaymentDialogId";
                        }
                        if (templateName){
                            $scope.showLoader = true;
                            var updateDuplicationAddressUrl = $scope.$root.sales + "crm/crm/updateDuplicationAddress";
                            ngDialog.openConfirm({
                                template: templateName,
                                className: 'ngdialog-theme-default-custom'
                            }).then(function (value) {
                                $http
                                    .post(updateDuplicationAddressUrl, {
                                        reccheckaddress: res.data,
                                        rec: rec_loc,
                                        'token': $scope.$root.token
                                    })
                                    .then(function (res) {
                                        SubmitContactLoc.location(rec_loc, drp, $scope.record_data_contact, $scope.selected_data_loc_contact)
                                            .then(function (result) {
                                                if (result == true)
                                                    $scope.getAltLocation();
                                                    $scope.showLoader = false;
                                            }, function (error) {
                                                console.log(error);
                                            });
                                    });
                            }, function (reason) {
                                $scope.showLoader = false;
                                //console.log('Modal promise rejected. Reason: ', reason);
                            }).catch(function (e) {
                                $scope.showLoader = false;
                                throw new Error(e.data);
                            });
                        }
                        else{
                            SubmitContactLoc.location(rec_loc, drp, $scope.record_data_contact, $scope.selected_data_loc_contact)
                                .then(function (result) {
                                    if (result == true)
                                        $scope.getAltLocation();
                                }, function (error) {
                                    console.log(error);
                                });
                        }

                        


                    }).catch(function (message) {

                        console.log(message.data);
                    });

                // ends here
                return;
            }

        SubmitContactLoc.location(rec_loc, drp, $scope.record_data_contact, $scope.selected_data_loc_contact)
            .then(function (result) {
                if (result == true)
                    $scope.getAltLocation();
            }, function (error) {
                console.log(error);
            });
       // }
        return;
    }


    $scope.set_contact_infolocation = function (val) {


        $scope.rec_loc.booking_job_title = val.job_title;
        $scope.rec_loc.booking_direct_line = val.direct_line;
        $scope.rec_loc.booking_mobile = val.mobile;
        $scope.rec_loc.booking_telephone = val.phone;
        $scope.rec_loc.booking_fax = val.fax;
        $scope.rec_loc.booking_email = val.email;

        angular.forEach($rootScope.arr_pref_method_comm, function (obj) {
            if (obj.id == val.pref_method_of_communication)
                $scope.drp.booking_pref_mthod_of_comm = obj;
        });
    }

    $scope.delete_location = function (id) {
        var delUrl = $scope.$root.sales + "crm/crm/delete-alt-depot";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: id,
                    crm_id: $stateParams.id,
                    'module_type': $rootScope.CRMType,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () {
                            $scope.getAltLocation();
                        }, 1500)
                    } else
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));

                });
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });

    };


    $scope.rec_loc = {};
    $scope.columnalitcotact_scoial = [];

    //add location and contact dropdown from tabs

    $scope.rec_loc.addcontactslisting = {};
    $scope.add_contact_location_dropdown = function (id, type) {
        var rec_temp = {};

        rec_temp.crm_id = $scope.$root.crm_id;
        rec_temp.rec_id = id;
        rec_temp.type = type;
        rec_temp.token = $scope.$root.token;
        rec_temp.module_type = $rootScope.CRMType;
        //if(type==1)
        rec_temp.addcontactslisting = $scope.rec_loc.addcontactslisting;
        // rec_temp.addcontactslisting = type;
        var postUrl = $scope.$root.sales + "crm/crm/add-list-contact-location";
        $http
            .post(postUrl, rec_temp)
            .then(function (ress) {
               
            });

    }

    $scope.selected_data_loc_contact = [];
    $scope.record_data_contact_list = {};

    $scope.isselectcontactlocchk = false;
    $scope.page_title = "";
    $scope.typeconloc = "";

    $scope.get_contact_location_dropdown = function (id, type) {
        $scope.typeconloc = type;

        if (type == 1) {
            $scope.page_title = "Assign Contacts";
            $scope.altContacFormShow = false;
            angular.element('#popup_add_contactinternal').modal({
                show: true
            });
        } else {
            $scope.page_title = "Assign Locations";
            $scope.altDepotFormShow = false;
            angular.element('#popup_add_locationtinternal').modal({
                show: true
            });
        }

        /*console.log(id);
         return false;*/
        /*console.log($scope.record_data_contact);
         */

        //console.log(type);
        //console.log($scope.rec_loc.addcontactslisting[0].id);
        // console.log($scope.rec_loc.addcontactslisting);
        //console.log($scope.rec_contact.addcontactslisting.length);
        //console.log($scope.selected_data_loc_contact);
        if (type == 2 && $scope.rec_contact.addcontactslisting != undefined && $scope.rec_contact.addcontactslisting.length > 0) {

            angular.forEach($scope.record_data_contact, function (obj) {
                obj.chk = false;

                angular.forEach($scope.selected_data_loc_contact, function (obj2) {
                    if (obj.id == obj2.id || obj.id == id)
                        obj.chk = true;
                });

            });
        } else if (type == 1 && $scope.rec_loc.addcontactslisting != undefined && $scope.rec_loc.addcontactslisting.length > 0) {

            angular.forEach($scope.record_data_contact, function (obj) {
                obj.chk = false;

                angular.forEach($scope.selected_data_loc_contact, function (obj2) {
                    if (obj.id == obj2.id || obj.id == id)
                        obj.chk = true;
                });
            });

        } else {

            if (id !== undefined) {

                var urlCRMSocialMedias = $scope.$root.sales + "crm/crm/get-list-contact-location";

                $http
                    .post(urlCRMSocialMedias, {
                        'token': $scope.$root.token,
                        'crm_id': $scope.$root.crm_id,
                        'module_type': $rootScope.CRMType,
                        rec_id: id,
                        type: type
                    })
                    .then(function (res) {
                        if (res.data.ack == true) {

                            if ($scope.rec_contact == undefined) $scope.rec_contact = {};
                            if ($scope.rec_loc == undefined) $scope.rec_loc = {};

                            $scope.rec_contact.addcontactslisting = res.data.response;
                            $scope.rec_loc.addcontactslisting = res.data.response;
                            $scope.selected_data_loc_contact = res.data.response;

                            //console.log(res.data.response);

                            if (type == 2) {


                                angular.forEach($scope.record_data_contact, function (obj) {

                                    obj.chk = false;

                                    angular.forEach($scope.selected_data_loc_contact, function (obj2) {
                                        // console.log(obj2);
                                        if (obj.id == obj2.location_id || obj.id == id) {
                                            obj.chk = true;
                                            // obj.chk_value = true;
                                            obj2.id = obj2.location_id;
                                        }
                                    });
                                });

                            } else if (type == 1) {

                                angular.forEach($scope.record_data_contact, function (obj) {
                                    obj.chk = false;
                                    angular.forEach($scope.selected_data_loc_contact, function (obj2) {
                                        if (obj.id == obj2.contact_id || obj.id == id) {
                                            obj.chk = true;
                                            // obj.chk_value = true;
                                            obj2.id = obj2.contact_id;
                                        }

                                    });
                                });
                            }
                            //console.log($scope.record_data_contact);
                        } else {
                            $scope.rec_contact.addcontactslisting = [];
                            $scope.rec_loc.addcontactslisting = [];
                            $scope.selected_data_loc_contact = [];
                        }

                    }).catch(function (message) {
                        $scope.showLoader = false;

                        throw new Error(message.data);
                        console.log(message.data);
                    });

            } else {
                $scope.rec_contact.addcontactslisting = [{
                    id: ''
                }];
                $scope.rec_loc.addcontactslisting = [{
                    id: ''
                }];
                $scope.selected_data_loc_contact = [{
                    id: ''
                }];
            }
        }
    };

    $scope.rec_contact.showdata2 = 0;
    $scope.rec_loc.showdata2 = 0;
    $scope.selectedAll = false;

    $scope.PendingSelectedContactLoc = [];

    $scope.submitPendingContactLoc = function () {

        $scope.PendingSelectedContactLoc = [];
        $scope.rec_contact.showdata2 = 0;
        $scope.rec_loc.showdata2 = 0;

        for (var i = 0; i < $scope.record_data_contact.length; i++) {

            if ($scope.record_data_contact[i].chk == true) {
                $scope.rec_contact.showdata2++;
                $scope.rec_loc.showdata2++;
                $scope.PendingSelectedContactLoc.push($scope.record_data_contact[i]);
            }
        }

        $scope.selected_data_loc_contact = $scope.PendingSelectedContactLoc;
        angular.element('#popup_add_contactinternal').modal('hide');
        angular.element('#popup_add_locationtinternal').modal('hide');
    }

    $scope.clearPendingContactLoc = function () {
        $scope.PendingSelectedContactLoc = [];
        angular.element('#popup_add_contactinternal').modal('hide');
        angular.element('#popup_add_locationtinternal').modal('hide');
    }

    $scope.selectedAll = false;

    $scope.check_loc_value = function (val) {
        let selection_filter = $filter('filter');
        let  filtered = selection_filter($scope.record_data_contact, $scope.searchKeyword.search);

        $scope.PendingSelectedContactLoc = [];
        $scope.isselectcontactloc = [];

        if (val == true) {
            angular.forEach(filtered, function (obj) {
                obj.chk = val;
                $scope.PendingSelectedContactLoc.push(obj);
            });

            // for (var i = 0; i < $scope.record_data_contact.length; i++) {
            //     $scope.record_data_contact[i].chk = true;
            //     $scope.PendingSelectedContactLoc.push($scope.record_data_contact[i]);
            // }

        } else {
            for (var i = 0; i < $scope.record_data_contact.length; i++) {
                $scope.record_data_contact[i].chk = false;
            }
            $scope.PendingSelectedContactLoc = [];
        }
    }

    $scope.selectloccontact = function (sp, isPrimary, sel_type) {
        $scope.isselectcontactlocchk = true;
        /* console.log(sp);
         console.log(sel_type);*/

        $scope.PendingSelectedContactLoc = [];

        if (sp.chk == true)
            $scope.PendingSelectedContactLoc.push(sp);
        else
            $scope.PendingSelectedContactLoc.splice(sp, 1);
    }

    $scope.add_multicontact_location_dropdown = function (id, type) {
        /*console.log($scope.isselectcontactlocchk);
         console.log(type);*/

        if ($scope.isselectcontactlocchk == false)
            return;

        var post = {};
        var temp = [];

        angular.forEach($scope.selected_data_loc_contact, function (obj) {
            temp.push({
                id: obj.id
            });
        });

        post.addcontactslisting = temp;
        post.crm_id = $scope.$root.crm_id;
        post.rec_id = id;
        post.type = type;
        post.token = $scope.$root.token;
        post.module_type = $rootScope.CRMType;

        var postUrl = $scope.$root.sales + "crm/crm/add-list-contact-location";
        $http
            .post(postUrl, post)
            .then(function (ress) {
                if (type == 1)
                    angular.element('#popup_add_location').modal('hide');
                else
                    angular.element('#popup_add_location2').modal('hide');

               
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    /****************************************/
    // CRM Location Area End
    /****************************************/

    /****************************************/
    // CRM Notes Area Start
    /****************************************/
    $scope.notes_columns = [];
    $scope.notes_record_data = {};

    $scope.showNotesListing = function () {
        $scope.altNotesListingShow = true;
        $scope.altNotesFormShow = false;
    }

    $scope.check_crm_notes_readonly = true;

    $scope.showEditForm_notes = function () {
        $scope.check_crm_notes_readonly = false;
    }

    $scope.coment_notes_data = {};
    $scope.coment_notes_data.checkTitle = false;

    $scope.showWordsLimits = function () {
        $scope.wordsLength = $scope.coment_notes_data.description.length;
    }

    $scope.searchKeyword = {};
    $scope.item_paging = {};
    $scope.filterObject = {};

    $scope.resetPageAndGetComments = (lastAllRecords) => {
        $scope.filterObject.selectedPage = 1;
        $scope.getAltNotes(lastAllRecords);
    }

    $scope.clearFilterAndGetComments = () => {
        $scope.filterObject = {};
        $scope.getAltNotes();
    }

    $scope.getAltNotes = function (all_records, countOnly) {

        $scope.altNotesListingShow = true;
        $scope.altNotesFormShow = false;
        $scope.showLoader = true;

        $scope.lastAllRecords = all_records;
        $scope.bringingAllRecords = all_records ? true : false;
        $scope.bringingLimitedRecords = !$scope.bringingAllRecords;


        $scope.coment_notes_data.checkTitle = false;
        $scope.wordsLength = 0;
        $scope.coment_notes_data = {};
        $scope.show_coments_list = true;
        $scope.show_coments_form = false;
        $scope.perreadonly = true;
        $scope.coment_notes_data.create_date = $scope.$root.get_current_date();
        var API = $scope.$root.com + "document/comments-listings";

        $scope.request_module_name = $scope.moduleForPermissions;//'crm';//moduleTracker.module.name;
        $scope.request_module_record = all_records ? "" : $stateParams.id;

        var postData = {
            module_name: $scope.request_module_name,
            record_id: $scope.request_module_record,
            token: $rootScope.token,
            countOnly: countOnly,
            searchKeyword: $scope.filterObject
        }

        /* $scope.formatComment = function(input){
            if (input == undefined){
                return '';
            }
            return $sce.trustAsHtml(input.replace(/(?:\r\n|\r|\n)/g, '<br>'));
        } */

        if (countOnly == undefined) $scope.showLoader = true;

        $http
            .post(API, postData)
            .then(function (res) {
                $scope.notes_columns = [];
                $scope.record_coments_crm = [];
                $scope.focused = {};
                $scope.total = res.data.total ? res.data.total : 0;
                if (res.data.ack == true) {
                    if (countOnly == undefined) {
                        if ($scope.total == 0 && $scope.filterObject.selectedPage != 1) {
                            $scope.resetPageAndGetComments();
                        }
                        $scope.item_paging.total_pages = res.data.total_pages;
                        $scope.item_paging.cpage = res.data.cpage;
                        $scope.item_paging.ppage = res.data.ppage;
                        $scope.item_paging.npage = res.data.npage;
                        $scope.item_paging.pages = res.data.pages;
                        $scope.total = res.data.total;
                        $scope.record_coments_crm = res.data.response;
                        $scope.focused = angular.copy($scope.record_coments_crm[0]);
                        angular.forEach(res.data.response[0], function (val, index) {
                            $scope.notes_columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
                    }

                    $scope.showLoader = false;
                }
                else {
                    $scope.showLoader = false;
                }
            });
    }

    $scope.editThisNote = function (id) {
        angular.forEach($scope.record_coments_crm, function (comment) {
            if (comment.id == id) {
                $scope.coment_notes_data = comment;
                $scope.addNote = true;
                $scope.editMode = true;
            }
        });

        $scope.altNotesListingShow = false;
        $scope.altNotesFormShow = true;
        $scope.check_crm_notes_readonly = true;

        $scope.selectedNotesCRM = $scope.moduleForPermissions;// = "crm";"crm"

        $scope.selectedNotesRecord = {};
        $scope.selectedNotesRecord.id = $stateParams.id;
        $scope.selectedNotesRecord.name = $scope.$root.bdname;
    }

    $scope.clearNotesVarsCRM = function () {
        $scope.addNote = false;
        $scope.editMode = false;
        $scope.selectedNotesModule = "";
        $scope.request_module_name = "";
        if ($scope.allNames) $scope.allNames.length = 0;

        if ($scope.selectedNotesRecord) {
            Object.keys($scope.selectedNotesRecord).forEach(function (prop) {
                delete $scope.selectedNotesRecord[prop];
            });
        }
        $scope.resetPageAndGetComments($scope.lastAllRecords);

    }

    $scope.showNoteAddForm = function () {
        $scope.editMode = false;
        if ($scope.addNote) {
            $scope.addNote = false;
            $scope.clearNotesVarsCRM();
        }
        else {
            $scope.addNote = true;
        }

        $scope.altNotesListingShow = false;
        $scope.altNotesFormShow = true;
        $scope.check_crm_notes_readonly = false;

        $scope.selectedNotesCRM = $scope.moduleForPermissions;//"crm";

        $scope.selectedNotesRecord = {};
        $scope.selectedNotesRecord.id = $stateParams.id;
        $scope.selectedNotesRecord.name = $scope.$root.bdname;
    }

    $scope.updateNotesRecord = function (val) {
        $scope.selectedNotesRecord = val;
    }

    $scope.updateFocusedNote = function (note) {
        $scope.focused = note;
    }

    $scope.addCRMcomment = function (coment_notes_data) {

        $scope.commentsData = coment_notes_data;

        if ($scope.commentsData.subject.length > 100) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(331, ['subject', '100']), null, null, null, 3);
            return;
        }

        if ($scope.commentsData.description.length > 1000) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(331, ['comment', '1000']), null, null, null, 3);
            return;
        }

        if (coment_notes_data.id == undefined) {

            $scope.module_type = 4;

            if($scope.moduleForPermissions == 'customer') $scope.moduleName = "Customer";
            else $scope.moduleName = "CRM";
            

            $scope.coment_notes_data.sub_type = $scope.module_type;
            $scope.coment_notes_data.moduleName = $scope.moduleName;

            $scope.coment_notes_data.row_id = $scope.selectedNotesRecord.id;
            $scope.coment_notes_data.recordName = $scope.selectedNotesRecord.name;
            $scope.coment_notes_data.type = 1;
        }

        $scope.coment_notes_data.token = $scope.$root.token;
        $scope.commentsData.token = $scope.$root.token;
        //  console.log(coment_notes_data);return;
        var add_comet_url = $scope.$root.com + "document/update-comments";
        $scope.showLoader = true;
        $http
            .post(add_comet_url, $scope.commentsData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    toaster.pop('success', res.data.info, res.data.msg);
                    $scope.clearNotesVarsCRM();
                    $scope.wordsLength = 0;
                }
                else
                    toaster.pop('error', 'info', res.data.msg);
            });
    }

    $scope.deleteCRMcomment = function (id) {

        var delUrl = $scope.$root.com + "document/delete-comments";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103), null, null, null, 3);
                        $scope.clearNotesVarsCRM();
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108), null, null, null, 3);
                        $scope.getAltNotes($scope.lastAllRecords);
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };

    $scope.show_coments_list = true;
    $scope.show_coments_form = false;

    /****************************************/
    // CRM Notes Area End
    /****************************************/

    /****************************************/
    // CRM Tasks Area Start
    /****************************************/

    $scope.notes_columns = [];
    $scope.notes_record_data = {};

    $scope.formDataTask = {};
    $scope.uiselectHandler = {};

    $scope.verifyRangeFilters = function (ck_startDate, ck_end_date, div_id, type) {
        if (type == "date") {
            from = $("#" + ck_startDate).val().split("/")[2] + "-" + $("#" + ck_startDate).val().split("/")[1] + "-" + $("#" + ck_startDate).val().split("/")[0];
            to = $("#" + ck_end_date).val().split("/")[2] + "-" + $("#" + ck_end_date).val().split("/")[1] + "-" + $("#" + ck_end_date).val().split("/")[0];
            if (from != null && to != null) {
                var from1, to1, check1;
                from1 = new Date(from.replace(/\s/g, ''));
                to1 = new Date(to.replace(/\s/g, ''));
                var fDate, lDate, cDate;
                fDate = Date.parse(from1);
                lDate = Date.parse(to1);

            }
        }
        else if (type == "number") {
            from = $("#" + ck_startDate).val();
            to = $("#" + ck_end_date).val();
            if (from && to) {
                fDate = parseFloat(from); lDate = parseFloat(to);
            }
        }
        if (fDate > lDate) {
            toaster.pop('error', 'Error', div_id);
        }
    }

    $scope.prepareToSubmit = function () {

        if ($scope.uiselectHandler.selectedMainModule != undefined)
            $scope.formDataTask.module = $scope.uiselectHandler.selectedMainModule.val;
        if ($scope.uiselectHandler.selectedRecord != undefined)
            $scope.formDataTask.record = $scope.uiselectHandler.selectedRecord.id;


        if ($scope.formDataTask.subject == undefined || $scope.formDataTask.subject == '') {
            toaster.pop('error', 'info', $rootScope.getErrorMessageByCode(230, ['Subject']), null, null, null, 4);
            return;
        }
        if ($scope.formDataTask.date == undefined || $scope.formDataTask.date == '') {
            toaster.pop('error', 'info', $rootScope.getErrorMessageByCode(230, ['Due Date']), null, null, null, 4);
            return;
        }
        if ($scope.formDataTask.time == undefined || $scope.formDataTask.time == '') {
            toaster.pop('error', 'Info', $rootScope.getErrorMessageByCode(230, ['Due Time']), null, null, null, 4);
            return;
        }
        $scope.showLoader = true;
        $scope.submit({ formData: $scope.formDataTask }).then(function (resp) {
            $scope.clearVars();
            $scope.bringRecords();
            $scope.$root.setNotifications();
            $scope.showLoader = false;
        })
    }

    $scope.clearVars = function () {
        $scope.compose = false;
        $scope.formDataTask = {};
        $scope.uiselectHandler.selectedMainModule = null;
        $scope.uiselectHandler.selectedEmployee = null;
        $scope.uiselectHandler.selectedRecord = null;
        $scope.uiselectHandler.selectedSubModule = null;
        $scope.selectedTab = null;
    }

    $scope.tabArr = [false, false, false, false, false];

    $scope.getSelectedTab = function () {
        var obj = {};
        for (var i = 0; i < $scope.tabArr.length; i++) {
            if ($scope.tabArr[i] == true) {
                obj.selectedTabIndex = i;
                switch (i) {
                    case 0: obj.msg = "all modules"; break;
                    case 1: obj.msg = "one mdule"; break;
                    case 2: obj.msg = "module record"; break;
                    case 3: obj.msg = "tab name"; break;
                    case 4: obj.msg = "tab records"; break;
                }
            }
        }
        return obj;
    }

    $scope.updateFocused = function (record) {
        $scope.focused = record;
        angular.forEach($scope.allEmployees, function (obj) {
            if (obj.id == $scope.focused.assign_to) {
                $scope.focused.assign_to = obj;
            }
        });
    }

    $scope.showCompose = function () {
        $scope.formDataTask.recurrenceUnit = 1;
        $scope.formDataTask.reminderUnit = 1;
        $scope.formDataTask.recurrence = 0;
        $scope.formDataTask.reminder = 0;
        $scope.formDataTask.priority = "";
        $scope.formDataTask.status = 1;
    }

    $scope.refreshListing = function () {
        angular.forEach($scope.allRecords, function (obj) {

            if (obj.status == "3") obj.completed = true;
            else obj.completed = false;

            var reminderSeconds = 0;
            if (obj.reminder && obj.reminderUnit) {
                if (obj.reminderUnit == "1") {
                    reminderSeconds = obj.reminder * 60;
                }
                else if (obj.reminderUnit == "2") {
                    reminderSeconds = obj.reminder * 60 * 60;
                }
                else if (obj.reminderUnit == "3") {
                    reminderSeconds = obj.reminder * 60 * 60 * 24;
                }
            }

            var reminderUnix = parseInt(obj.date) + parseInt(obj.time2seconds) - reminderSeconds;

            var currentTime = (Date.now() / 1000 | 0);

            // var tempDate = new Date(Date.UTC(obj.reminderTime * 1000));
            if ((reminderUnix - currentTime) > 0 && !obj.completed) {
                obj.condition = "due";
            }
            else if (obj.completed) {
                // old
                obj.condition = "old";
            }
            else if ((reminderUnix - currentTime) < 0 && !obj.completed) {
                obj.condition = "overdue";
            }

            obj.tempDate = new Date(obj.date * 1000);
            obj.tempDate = obj.tempDate.getDate() + "/" + (parseInt(obj.tempDate.getMonth()) + 1) + "/" + obj.tempDate.getFullYear();
        });
    }

    $scope.markCompleted = function (task) {
        if (task.status == 3) {
            task.status = 2;
        }
        else {
            task.status = 3;
        }

        var Api = $scope.$root.com + "task/markChecked";
        $http
            .post(Api, { task: task, token: scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.refreshListing();
                }
            });
    }

    $scope.bringRecords = function (countOnly) {
        $scope.showLoader = true;
        var postData = {};
        postData.token = $scope.$root.token;
        var selectedTab = $scope.getSelectedTab();

        // $scope.request_module_name = $scope.moduleForPermissions;//'crm';//moduleTracker.module.name;
        // $scope.request_module_record = all_records ? "" : $stateParams.id;

        if (selectedTab.selectedTabIndex == 0) {
        }
        else if (selectedTab.selectedTabIndex == 1) {
            postData.module_name = $scope.moduleForPermissions;
        }
        else if (selectedTab.selectedTabIndex == 2) {
            postData.module_name = $scope.moduleForPermissions;
            postData.record_id = $stateParams.id;
        }
        else if (selectedTab.selectedTabIndex == 3) {
            postData.module_name = $scope.moduleForPermissions;
            postData.record_id = $stateParams.id;
            postData.tab = moduleTracker.module.tab;
        }
        else if (selectedTab.selectedTabIndex == 4 || countOnly) {
            postData.module_name = $scope.moduleForPermissions;
            postData.record_id = $stateParams.id;
            postData.tab = moduleTracker.module.tab;
            postData.tab_id = moduleTracker.module.tabId;
        }
        postData.countOnly = countOnly;
        /* $scope.getRecords({ q: postData }).then(function (data) {
            if(postData.record_id){
            $scope.total = data.total;
            }
            if (!countOnly){
                $scope.allRecords = data.response;
                $scope.filteredRecords = scope.allRecords;
                $scope.refreshListing();
                $scope.showLoader = false;
                $scope.focused = $scope.allRecords[0];
            }
        }) */
    }

    $scope.conditionalUpperCase = function (val, limit) {
        if (val == "N/A") {
            return val;
        }
        if (val) {
            if (val.length <= limit) {
                val = val.toUpperCase();
            }
            else {
                str = val.replace('_', ' ');
                var splitStr = str.split(' ');
                for (var i = 0; i < splitStr.length; i++) {
                    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
                }
                str = splitStr.join(' ');
                val = str;
            }
            return val;
        }
    }

    $scope.deleteCRMtask = function (id) {
        $scope.showLoader = true;
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $scope.delete({ id: id }).then(function (res) {
                $scope.showLoader = false;
                if (res.ack == true) {
                    toaster.pop('success', 'Deleted', $rootScope.getErrorMessageByCode(103), null, null, null, 3);
                    $scope.clearVars();
                    $scope.bringRecords();
                    $scope.$root.setNotifications();
                } else {
                    toaster.pop('error', 'Deleted', $rootScope.getErrorMessageByCode(108), null, null, null, 3);
                    $scope.clearVars();
                    $scope.bringRecords();
                    $scope.$root.setNotifications();
                }
            })
        }, function (reason) {
            $scope.showLoader = false;
            console.log('Modal promise rejected. Reason: ', reason);
        });
        
    }

    $scope.date2UNIX = function (date) {
        var year = date.split("/")[2];
        var month = parseInt(date.split("/")[1]) - 1;
        var day = date.split("/")[0];
        var UNIXDate = new Date(year, month, day);
        return date ? ((UNIXDate.getTime()) / 1000) : "";
    }

    $scope.searchDate = {};

    $scope.$watch("[searchDate.start, searchDate.end]", function () {

        if ($scope.searchDate.start)
            var start = $scope.date2UNIX($scope.searchDate.start);
        if ($scope.searchDate.end)
            var end = $scope.date2UNIX($scope.searchDate.end);

        if ($scope.allRecords == undefined) {
            return;
        }
        if (!start && !end) {
            $scope.filteredRecords = $scope.allRecords.filter(function (obj) {
                return 1;
            });
        }
        else if (start && end) {
            $scope.filteredRecords = $scope.allRecords.filter(function (obj) {
                return (start <= obj.date && end >= obj.date);
            });
        }
        else if (start && !end) {
            $scope.filteredRecords = $scope.allRecords.filter(function (obj) {
                return (start <= obj.date);
            });
        }
        else if (!start && end) {
            $scope.filteredRecords = $scope.allRecords.filter(function (obj) {
                return (end >= obj.date);
            });
        }

        angular.forEach($scope.filteredRecords, function (obj2) {
        });

    });

    /* $scope.getMainRecordNames = '';


    $scope.modules = [
        {name: "CRM", val: "crm", getter: $scope.getMainRecordNames, type: 1},
        {name: "Customer", val: "customer", getter: $scope.getMainRecordNames, type: 2},
        {name: "SRM", val: "srm", getter: $scope.getMainRecordNames, type: 1},
        {name: "Supplier", val: "supplier", getter: $scope.getMainRecordNames, type: 1},
        {name: "HR", val: "hr", getter: $scope.getMainRecordNames, type: 1}
    ]; */

    $scope.selectTab = function (tabNo) {
        for (var i = 0; i < $scope.tabArr.length; i++) {
            $scope.tabArr[i] = false;
        }
        $scope.tabArr[tabNo] = true;
    }

    $scope.getAltTasks = function (countOnly) {
        $scope.showLoader = true;
        if ($scope.moduleForPermissions == "") {
            // no module is selected, show all records
            $scope.selectTab(0);
        }
        if ($scope.moduleForPermissions) {
            /* angular.forEach($scope.modules, function (obj) {
                if (obj.val == $scope.moduleForPermissions) {
                    $scope.uiselectHandler.selectedMainModule = obj;
                    $scope.uiselectHandler.selectedMainModule.getter($scope.uiselectHandler.selectedMainModule.val).then(function (resp) {
                        $scope.mainModuleRecords = resp;
                        angular.forEach($scope.mainModuleRecords, function (obj2) {                                    
                            if (moduleTracker.module.record && obj2.id == moduleTracker.module.record) {
                                $scope.uiselectHandler.selectedRecord = obj2;
                                $scope.formData.sell_to_cust_no = obj2.name;
                                $scope.formData.record = obj2.id;
                            }
                        });
                        $scope.showLoader = false;
                    });
                    return false;
                }
            }) */

            let obj2 = {};
            obj2.additional = '';
            obj2.id = $stateParams.id;
            obj2.name = $scope.$root.bdname;

            $scope.uiselectHandler.selectedRecord = obj2;
            $scope.formDataTask.sell_to_cust_no = $scope.$root.bdname;
            $scope.formDataTask.record = $stateParams.id;
            $scope.showLoader = false;

            // only module name is what we know
            $scope.selectTab(1);
        }
        if (moduleTracker.module.record) {
            // module name + record Id
            $scope.selectTab(2);
        }
        if (moduleTracker.module.tab) {
            // module name + record Id + tab name
            $scope.selectTab(3);
        }
        if (moduleTracker.module.tabId) {
            // module name + record Id + tab name + tab Id
            $scope.selectTab(4);
        }
        $scope.bringRecords(countOnly);
        $scope.showTasksListing();
        // this will open the modal on press of the button..
        /* if (countOnly == undefined) {
            angular.element('#sidebar-tasks').modal({
                show: true
            });
        } */
    }

    $scope.editThis2 = function (task) {

        var now = (Date.now() / 1000).toFixed();
        if (parseInt(task.date) < parseInt(now)) {
            task.oldTask = true;
        }
        else{
            task.oldTask = false;
        }

        $scope.showLoader = true;
        $scope.formDataTask = task;
        $scope.formDataTask.reminder = parseInt(task.reminder);
        $scope.formDataTask.recurrence = parseInt(task.recurrence);
        $scope.formDataTask.sell_to_cust_no =task.linkedRecordName;

        angular.forEach($scope.modules, function (obj) {
            if (obj.val == task.module) {
                $scope.uiselectHandler.selectedMainModule = obj;
                $scope.uiselectHandler.selectedMainModule.getter($scope.uiselectHandler.selectedMainModule.val).then(function (resp) {
                    $scope.mainModuleRecords = resp;
                    angular.forEach($scope.mainModuleRecords, function (obj) {
                        if (obj.id == task.record) {
                            $scope.uiselectHandler.selectedRecord = obj;
                            $scope.showLoader = false;
                        }
                    })
                });
            }
        });

        $scope.showLoader = false;
        $scope.compose = true;
    }

    

    $scope.updateMainModule = function (selectedModule) {
        $scope.formDataTask.sell_to_cust_no = '';
        $scope.formDataTask.record = '';
        $scope.uiselectHandler.selectedMainModule = selectedModule;
        $scope.showLoader = true;
        $scope.uiselectHandler.selectedMainModule.getter($scope.uiselectHandler.selectedMainModule.val).then(function (resp) {
            $scope.mainModuleRecords = resp;
            $scope.showLoader = false;
        });
        $scope.uiselectHandler.selectedRecord = '';
    }

    $scope.showTasksListing = function () {
        $scope.altTasksListingShow = true;
        $scope.altTasksFormShow = false;
    }

    $scope.check_crm_tasks_readonly = true;

    $scope.showEditForm_Tasks = function () {
        $scope.check_crm_tasks_readonly = false;
    }

    $scope.coment_notes_data = {};
    $scope.coment_notes_data.checkTitle = false;

    $scope.showWordsLimits = function () {
        $scope.wordsLength = $scope.coment_notes_data.description.length;
    }

    $scope.searchKeyword_tasks = {};
    $scope.item_paging = {};
    $scope.filterObject = {};

    /* $scope.resetPageAndGetComments = (lastAllRecords) => {
        $scope.filterObject.selectedPage = 1;
        $scope.getAltNotes(lastAllRecords);
    }

    $scope.clearFilterAndGetComments = () => {
        $scope.filterObject = {};
        $scope.getAltNotes();
    }

    $scope.getAltNotes = function (all_records, countOnly) {

        $scope.altTasksListingShow = true;
        $scope.altTasksFormShow = false;
        $scope.showLoader = true;

        $scope.lastAllRecords = all_records;
        $scope.bringingAllRecords = all_records ? true : false;
        $scope.bringingLimitedRecords = !$scope.bringingAllRecords;


        $scope.coment_notes_data.checkTitle = false;
        $scope.wordsLength = 0;
        $scope.coment_notes_data = {};
        $scope.show_coments_list = true;
        $scope.show_coments_form = false;
        $scope.perreadonly = true;
        $scope.coment_notes_data.create_date = $scope.$root.get_current_date();
        var API = $scope.$root.com + "document/comments-listings";

        $scope.request_module_name = $scope.moduleForPermissions;//'crm';//moduleTracker.module.name;
        $scope.request_module_record = all_records ? "" : $stateParams.id;

        var postData = {
            module_name: $scope.request_module_name,
            record_id: $scope.request_module_record,
            token: $rootScope.token,
            countOnly: countOnly,
            searchKeyword: $scope.filterObject
        }


        if (countOnly == undefined) $scope.showLoader = true;

        $http
            .post(API, postData)
            .then(function (res) {
                $scope.notes_columns = [];
                $scope.record_coments_crm = [];
                $scope.focused = {};
                $scope.total = res.data.total ? res.data.total : 0;
                if (res.data.ack == true) {
                    if (countOnly == undefined) {
                        if ($scope.total == 0 && $scope.filterObject.selectedPage != 1) {
                            $scope.resetPageAndGetComments();
                        }
                        $scope.item_paging.total_pages = res.data.total_pages;
                        $scope.item_paging.cpage = res.data.cpage;
                        $scope.item_paging.ppage = res.data.ppage;
                        $scope.item_paging.npage = res.data.npage;
                        $scope.item_paging.pages = res.data.pages;
                        $scope.total = res.data.total;
                        $scope.record_coments_crm = res.data.response;
                        $scope.focused = angular.copy($scope.record_coments_crm[0]);
                        angular.forEach(res.data.response[0], function (val, index) {
                            $scope.notes_columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });
                    }

                    $scope.showLoader = false;
                }
                else {
                    $scope.showLoader = false;
                }
            });
    }

    $scope.editThisNote = function (id) {
        angular.forEach($scope.record_coments_crm, function (comment) {
            if (comment.id == id) {
                $scope.coment_notes_data = comment;
                $scope.addNote = true;
                $scope.editMode = true;
            }
        });

        $scope.altTasksListingShow = false;
        $scope.altTasksFormShow = true;
        $scope.check_crm_tasks_readonly = true;

        $scope.selectedNotesCRM = $scope.moduleForPermissions;// = "crm";"crm"

        $scope.selectedNotesRecord = {};
        $scope.selectedNotesRecord.id = $stateParams.id;
        $scope.selectedNotesRecord.name = $scope.$root.bdname;
    }

    $scope.clearNotesVarsCRM = function () {
        $scope.addNote = false;
        $scope.editMode = false;
        $scope.selectedNotesModule = "";
        $scope.request_module_name = "";
        if ($scope.allNames) $scope.allNames.length = 0;

        if ($scope.selectedNotesRecord) {
            Object.keys($scope.selectedNotesRecord).forEach(function (prop) {
                delete $scope.selectedNotesRecord[prop];
            });
        }
        $scope.resetPageAndGetComments($scope.lastAllRecords);

    }

    $scope.showNoteAddForm = function () {
        $scope.editMode = false;
        if ($scope.addNote) {
            $scope.addNote = false;
            $scope.clearNotesVarsCRM();
        }
        else {
            $scope.addNote = true;
        }

        $scope.altTasksListingShow = false;
        $scope.altTasksFormShow = true;
        $scope.check_crm_tasks_readonly = false;

        $scope.selectedNotesCRM = $scope.moduleForPermissions;//"crm";

        $scope.selectedNotesRecord = {};
        $scope.selectedNotesRecord.id = $stateParams.id;
        $scope.selectedNotesRecord.name = $scope.$root.bdname;
    }

    $scope.updateNotesRecord = function (val) {
        $scope.selectedNotesRecord = val;
    }

    $scope.updateFocusedNote = function (note) {
        $scope.focused = note;
    }

    $scope.addCRMtasks = function (coment_notes_data) {

        $scope.commentsData = coment_notes_data;

        if ($scope.commentsData.subject.length > 100) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(331, ['subject', '100']), null, null, null, 3);
            return;
        }

        if ($scope.commentsData.description.length > 1000) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(331, ['comment', '1000']), null, null, null, 3);
            return;
        }

        if (coment_notes_data.id == undefined) {

            $scope.module_type = 4;

            if($scope.moduleForPermissions == 'customer') $scope.moduleName = "Customer";
            else $scope.moduleName = "CRM";
            

            $scope.coment_notes_data.sub_type = $scope.module_type;
            $scope.coment_notes_data.moduleName = $scope.moduleName;

            $scope.coment_notes_data.row_id = $scope.selectedNotesRecord.id;
            $scope.coment_notes_data.recordName = $scope.selectedNotesRecord.name;
            $scope.coment_notes_data.type = 1;
        }

        $scope.coment_notes_data.token = $scope.$root.token;
        $scope.commentsData.token = $scope.$root.token;
        //  console.log(coment_notes_data);return;
        var add_comet_url = $scope.$root.com + "document/update-comments";
        $scope.showLoader = true;
        $http
            .post(add_comet_url, $scope.commentsData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    toaster.pop('success', res.data.info, res.data.msg);
                    $scope.clearNotesVarsCRM();
                    $scope.wordsLength = 0;
                }
                else
                    toaster.pop('error', 'info', res.data.msg);
            });
    }

    $scope.deleteCRMcomment = function (id) {

        var delUrl = $scope.$root.com + "document/delete-comments";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103), null, null, null, 3);
                        $scope.clearNotesVarsCRM();
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108), null, null, null, 3);
                        $scope.getAltNotes($scope.lastAllRecords);
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }; */

    // $scope.show_coments_list = true;
    // $scope.show_coments_form = false;


    /****************************************/
    // CRM Tasks Area End
    /****************************************/


    /****************************************/
    // CRM Competetor start
    /****************************************/
    $scope.check_files = 0;
    $scope.files = [];
    $scope.wordsLength = 0;
    $scope.showItemCat = true;
    $scope.showServiceCat = true;
    $scope.columns_cmp = [];
    $scope.record_data_cmp = {};

    $scope.searchKeyword_competitors = {};
    $scope.getCompetitor = function () {
        // $scope.$root.breadcrumbs[3].name = 'Competitors';

        $scope.showLoader = true;

        //   $scope.$root.$broadcast("myCompetitorsEventReload", args);
        var ApiAjax = $scope.$root.sales + "crm/crm/crm-competitors";
        $scope.postData = {
            'column': 'crm_id',
            'value': $scope.$root.crm_id,
            token: $scope.$root.token,
            'more_fields': $scope.more_fields
        }

        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res) {
                moduleTracker.updateTabId("");
                $scope.columns_cmp = [];
                $scope.record_data_cmp = {};
                $scope.showLoader = false;
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record;
                    $scope.record_data_cmp = res.data.response; //res.data.record.result ;

                    // brand array for the filter
                    $scope.competitorBrandsArr = res.data.competitorProperties.response.brandsArr;

                    angular.forEach($scope.record_data_cmp[0], function (val, index) {
                        if (index != 'chk' && index != 'id') {
                            $scope.columns_cmp.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }

                    });
                }
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });

        $scope.crmCompFormShow = false;
        $scope.crmCompListingShow = true;
    }


    $scope.showCrmCompetitorForm = function () {
        $scope.crmCompFormShow = true;
        $scope.crmCompListingShow = false;

        $scope.check_readonly_cmp = false;
        $scope.showItemCat_cmp = true;
        $scope.showServiceCat_cmp = true;
        $scope.resetForm_cmp();
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        };
        var day = d.getDate();
        if (day < 10) {
            day = "0" + day;
        };
        if ($rootScope.defaultDateFormat == $rootScope.dtYMD)
            $scope.created_date = year + "/" + month + "/" + day;
        if ($rootScope.defaultDateFormat == $rootScope.dtMDY)
            $scope.created_date = month + "/" + day + "/" + year;
        if ($rootScope.defaultDateFormat == $rootScope.dtDMY)
            $scope.created_date = day + "/" + month + "/" + year;

        $scope.arr_cmp.created_date = $filter('date')($scope.created_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);

        $scope.lead_types = [];
        $scope.lead_types = [{
            'id': 1,
            'title': 'Days'
        }, {
            'id': 2,
            'title': 'Weeks'
        }, {
            'id': 3,
            'title': 'Months'
        }, {
            'id': 4,
            'title': 'Years'
        }]


        // written by Ahmad, this function will get Competitor Names, Brands and Item Names from Setup
        $scope.getCompetitorProperties = function () {
            $scope.showLoader = true;
            var ApiUrl = $scope.$root.setup + "competitors/getCompetitorPropertyListingAllowed";
            var postData = {
                'token': $scope.$root.token,
                'all': "1",
            };
            $http
                .post(ApiUrl, postData)
                .then(function (res) {
                    if (res.data.ack == true) {

                        $scope.competitorNamesArr = res.data.response.namesArr;
                        $scope.competitorBrandsArr = res.data.response.brandsArr;
                        $scope.competitorItemsArr = res.data.response.itemsArr;
                        $scope.competitorVolumesArr = res.data.response.volumesArr;

                        $scope.showLoader = false;
                    }
                });
        }

        $scope.getCompetitorProperties();


    }

    $scope.resetForm_cmp = function (arr_cmp) {
        $scope.files = [];
        $scope.str_files = [];
        $scope.temp_files = [];
        $scope.comp_files = {};
        $scope.check_file = 0;
        $scope.check_files = 0;
        /*document.getElementById("uploadFile").value = '';*/
        $scope.arr_cmp = {};
        $scope.drp = {}; //.unit_id
        $scope.brands = '';
        angular.element("input[type='file']").val(null);
    }

    /* $scope.addCategory = function () {
        $scope.rec2_cmp.name = '';
        //$scope.record_cats = {};

        //$scope.itemCats();
        //$scope.record_cats = $rootScope.cat_prodcut_arr;
        //console.log($scope.record_cats);

        $scope.showLoader = true;
        angular.element('#compCatModal').modal({ show: true });
        $scope.showLoader = false;
    } */

    // not in use from competitors tab any more
    $scope.itemCats = function () {
        $scope.showLoader = true;
        var catApi = $rootScope.stock + "categories";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
        };
        $http
            .post(catApi, postData)
            .then(function (res_cats) {
                if (res_cats.data.ack == true) {
                    $scope.record_cats = {};
                    $scope.record_cats = res_cats.data.response;

                    $scope.showLoader = false;
                    angular.element('#compCatModal').modal({
                        show: true
                    });
                }
            });
    }

    $scope.servicesCats = {};
    $scope.getServicesCats = function () {
        $scope.arr_cmp.category_type = 2;
        var catApi = $scope.$root.setup + "service/categories/get-all-categories";
        $scope.servicesCats = {};
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
        };
        $http
            .post(catApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.servicesCats = {};
                    $scope.servicesCats = res.data.response;
                }
            });
    }
    /* $scope.addCat = function (cat, type) {
        $scope.arr_cmp.category_name = cat.name;
        $scope.arr_cmp.category_id = cat.id;
        $scope.arr_cmp.category_type = type;
        angular.element("#category_name").parsley().reset();
        angular.element('#compCatModal').modal('hide');
    } */

    $scope.setItem = function () {
        $scope.arr_cmp.category_type = 1;
    }

    $scope.rec2_cmp = {};

    $scope.add_cat = function () {
        var rec2_cmp = {};
        var addcatUrl = $scope.$root.stock + "categories/add-category";
        rec2_cmp.token = $scope.$root.token;
        rec2_cmp.name = $scope.rec2_cmp.name;
        if ($scope.rec2_cmp.name == undefined || $scope.rec2_cmp.name == '') {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Category Name']));
            return;
        } else {

            $http
                .post(addcatUrl, rec2_cmp)
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                        angular.element('#compCatModal').modal('hide');
                        $scope.itemCats();

                        $scope.$root.$apply(function () {
                            angular.forEach($scope.record, function (elem) {
                                if (elem.name == rec2_cmp.name) {
                                    $scope.arr_cmp.category_name = elem.name;
                                    $scope.arr_cmp.category_id = elem.id;
                                }
                            });
                        });
                    } else
                        toaster.pop('error', 'info', res.data.error);
                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
                });
        }
    }

    $scope.check_readonly_cmp = true;
    $scope.showCrmCompEditForm = function () {
        $scope.check_readonly_cmp = false;
    }

    $scope.loadcompdata = function () {


        /*var unitUrl = $rootScope.stock + "unit-measure/units";
         $http
         .post(unitUrl, {'token': $scope.$root.token})
         .then(function (res) {
         $scope.unit_measures = [];
         $scope.unit_measures.push({'id': '', 'title': ''});
         if (res.data.ack == true)
         $scope.unit_measures = res.data.response;

         if ($scope.user_type == 1)
         $scope.unit_measures.push({'id': '-1', 'title': '++ Add New ++'});
         });*/


        /*var getUrllead = $scope.$root.sales + "crm/crm/get-all-competitor-volume";
         $http
         .post(getUrllead, {'token': $scope.$root.token})
         .then(function (res) {

         $scope.lead_types = [];
         $scope.lead_types.push({'id': '', 'title': ''});
         if (res.data.ack == true)
         $scope.lead_types = res.data.response;

         if ($scope.user_type == 1)
         $scope.lead_types.push({'id': '-1', 'title': '++ Add New ++'});
         });*/


        /*$scope.lead_types = [];
         $scope.lead_types = [{'id': 1, 'title': 'Days'}, {'id': 2, 'title': 'Weeks'}, {
         'id': 3,
         'title': 'Months'
         }, {'id': 4, 'title': 'Years'}]*/
    }

    $scope.addNewPopup = function (drpdown, type, title, drp) {
        $scope.isBtnPredefined = true;
        //  //console.log(drpdown.id);
        if (!(drpdown.id == -1))
            return false;
        $scope.popup_title = title;
        $scope.pedefined = {};
        ngDialog.openConfirm({
            template: 'app/views/crm/add_predefined.html',
            className: 'ngdialog-theme-default-custom-large',
            scope: $scope
        }).then(function (pedefined) {

            pedefined.token = $scope.$root.token;
            pedefined.type = type;
            if (type == 'UNIT')
                var postUrl = $scope.$root.stock + "unit-measure/add-unit";
            if (type == 'LEAD')
                var postUrl = $scope.$root.sales + "crm/crm/add-all-competitor-volume";
            $http
                .post(postUrl, pedefined)
                .then(function (ress) {
                    if (ress.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        if (type == 'UNIT')
                            var getUrl = $scope.$root.stock + "unit-measure/get-all-unit";
                        if (type == 'LEAD')
                            var getUrl = $scope.$root.sales + "crm/crm/get-all-competitor-volume";
                        $http
                            .post(getUrl, {
                                'token': $scope.$root.token,
                                type: type
                            })
                            .then(function (res) {
                                if (res.data.ack == true) {

                                    if (type == 'UNIT') {
                                        $scope.unit_measures = res.data.response;
                                        if ($scope.user_type == 1)
                                            $scope.unit_measures.push({
                                                'id': '-1',
                                                'title': '++ Add New ++'
                                            });
                                        angular.forEach($scope.unit_measures, function (elem) {
                                            if (elem.id == ress.data.id)
                                                drp.unit_id = elem;
                                        });
                                    }


                                    if (type == 'UNIT2') {
                                        $scope.unit_measures = res.data.response;
                                        if ($scope.user_type == 1)
                                            $scope.unit_measures.push({
                                                'id': '-1',
                                                'title': '++ Add New ++'
                                            });
                                        angular.forEach($scope.unit_measures, function (elem) {
                                            if (elem.id == ress.data.id)
                                                arr_cmp.vol_unit_id = elem;
                                        });
                                    }


                                    if (type == 'LEAD') {
                                        $scope.lead_types = res.data.response;
                                        if ($scope.user_type == 1)
                                            $scope.lead_types.push({
                                                'id': '-1',
                                                'title': '++ Add New ++'
                                            });

                                        angular.forEach($scope.lead_types, function (elem) {
                                            if (elem.id == ress.data.id)
                                                drp.lead_type = elem;
                                        });
                                    }
                                }

                            });
                    } else
                        toaster.pop('error', 'Info', ress.data.error)


                });
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.updateBrandList = function (category) {

        $scope.brandarray = [];
        $scope.selCatarray = [];

        angular.forEach($rootScope.brand_prodcut_arr, function (obj) {
            if (obj.categories != 0) {
                angular.forEach(obj.categories, function (obj2) {
                    if (obj2.categoryID == category && !($scope.selCatarray.indexOf(obj.id) > 0)) {
                        $scope.brandarray.push(obj);
                        $scope.selCatarray.push(obj.id);
                    }
                });
            }
        });
    }


    $scope.add_comp = function (arr_cmp) {

        //console.log(arr_cmp.category_name);
        /* arr_cmp.category_name = arr_cmp.category.name;
        arr_cmp.category_id = arr_cmp.category.id; */

        if (arr_cmp.supplier_name == undefined) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Competitor Name']));
            return;
        }

        arr_cmp.category_name = (arr_cmp.category != undefined && arr_cmp.category != '') ? arr_cmp.category.name : 0;
        arr_cmp.category_id = (arr_cmp.category != undefined && arr_cmp.category != '') ? arr_cmp.category.id : 0;
        arr_cmp.brand_id = (arr_cmp.brand != undefined && arr_cmp.brand != '') ? arr_cmp.brand.id : 0;
        arr_cmp.item_notes_id = (arr_cmp.item_notes != undefined && arr_cmp.item_notes != '') ? arr_cmp.item_notes.id : 0;
        arr_cmp.supplier_name_id = (arr_cmp.supplier_name != undefined && arr_cmp.supplier_name != '') ? arr_cmp.supplier_name.id : 0;
        arr_cmp.volume_id = (arr_cmp.volume != undefined && arr_cmp.volume != '') ? arr_cmp.volume.id : 0;
        if (arr_cmp.volume_id != 0) {
            if (arr_cmp.vol_unit_id == undefined || arr_cmp.vol_unit_id == '') {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['U.O.M']));
                return false;
            }
        }

        arr_cmp.category_type = 1;

        var addCompetitor = $scope.$root.sales + "crm/crm/add-crm-competitor";
        //var fileCheckUrl = $scope.$root.sales+"crm/crm/get-crm-competitor-file";
        arr_cmp.crm_id = $scope.$root.crm_id;
        arr_cmp.token = $scope.$root.token;
        arr_cmp.vol_unit = (arr_cmp.vol_unit_id != undefined && arr_cmp.vol_unit_id != '') ? arr_cmp.vol_unit_id.id : 0;
        arr_cmp.unit_id = ($scope.drp.unit_id != undefined && $scope.drp.unit_id != '') ? $scope.drp.unit_id.id : 0;
        arr_cmp.lead_type = ($scope.drp.lead_type != undefined && $scope.drp.lead_type != '') ? $scope.drp.lead_type.id : 0;

        if (arr_cmp.lead_type == 0 || !arr_cmp.lead_time)
        {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(647)); 
            return
        }


        if (angular.element('#purchase_price_vat_chk').is(':checked') == false)
            arr_cmp.purchase_price_vat_chk = 0;

        if (angular.element('#wholesale_price_vat_chk').is(':checked') == false)
            arr_cmp.wholesale_price_vat_chk = 0;

        if (arr_cmp.id != undefined && arr_cmp.cloneCompetitor != 1)
            addCompetitor = $scope.$root.sales + "crm/crm/update-crm-competitor";

        $scope.new_files_title = [];
        angular.forEach($scope.files, function (file, key) {
            if (file.row_id == undefined)
                $scope.new_files_title[key] = file.title;
        });

        arr_cmp.new_file_titles = $scope.new_files_title;

        $scope.upload = Upload.upload({
            url: addCompetitor,
            method: 'POST',
            headers: {
                'header-key': '83c238df1650bccb2d1aa4495723c63f07672ee8'
            },
            withCredentials: true,
            data: arr_cmp,
            file: $scope.files != undefined ? $scope.files : ''

        }).progress(function (evt) {

            console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));

        }).success(function (res, status, headers, config) {
            if (res.ack == true || res.edit == true) {

                $scope.$root.lblButton = 'Add New';
                if (arr_cmp.id > 0)
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                else {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $scope.resetForm_cmp(arr_cmp);
                }

                $scope.getCompetitor();
            } else {
                toaster.pop('error', 'Edit', res.error);
                /* if (arr_cmp.id > 0)
                    toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
                else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104)); */
            }

        });
    }

    $scope.onFileSelect = function ($files) {

        $scope.str_files = [];
        angular.forEach($files, function (file, key) {
            $scope.files.push(file);
            $scope.check_files = 1;
        });

        //$scope.str_files.push({name:file.name,index:key});
        /*$scope.comp_files.push({file:file.name,index:key});
         $scope.temp_files.push(file.name);*/
        //console.log($scope.files);
        //document.getElementById("uploadFile").value = $scope.temp_files;

    };

    $scope.removeFile = function (index) {
        $scope.files.splice(index, 1); //$scope.str_files.splice(index,1);
        /*$scope.comp_files.splice(index,1);
         $scope.temp_files.splice(index,1);
         document.getElementById("uploadFile").value = $scope.temp_files; */
        if ($scope.files.length < 1)
            $scope.check_file = 0;
    }


    $scope.edit_cmp = function (arg, mode, clone) {
        moduleTracker.updateTabId(arg);
        $scope.lead_types = [];
        $scope.lead_types = [{
            'id': 1,
            'title': 'Days'
        }, {
            'id': 2,
            'title': 'Weeks'
        }, {
            'id': 3,
            'title': 'Months'
        }, {
            'id': 4,
            'title': 'Years'
        }];


        var id = arg;
        /* if (arg > 1)
            $scope.check_readonly_cmp = true; */


        if (mode == 1)
            $scope.check_readonly_cmp = true;
        else if (mode == 0)
            $scope.check_readonly_cmp = false;

        $scope.crmCompFormShow = true;
        $scope.crmCompListingShow = false;
        $scope.showLoader = true;
        var competitorUrl = $scope.$root.sales + "crm/crm/get-crm-competitor";
        //var fileUrl = $scope.$root.sales + "crm/crm/get-crm-competitor-files";
        $scope.arr_cmp = {};
        $scope.drp = {};

        $http
            .post(competitorUrl, {
                'id': id,
                'value': $scope.$root.crm_id,
                'token': $scope.$root.token
            })
            .then(function (res) {
                $scope.showLoader = false;
                $scope.arr_cmp = res.data.response;
                $scope.arr_cmp.id = res.data.response.id;
                $scope.arr_cmp.price = parseFloat(res.data.response.price);
                $scope.arr_cmp.sale_price = parseFloat(res.data.response.sale_price);
                $scope.arr_cmp.volume = parseFloat(res.data.response.volume);
                $scope.arr_cmp.lead_time = parseFloat(res.data.response.lead_time);

                $scope.arr_cmp.cloneCompetitor = clone;

                $scope.competitorBrandsArr = res.data.competitorProperties.response.brandsArr;
                $scope.competitorItemsArr = res.data.competitorProperties.response.itemsArr;
                $scope.competitorNamesArr = res.data.competitorProperties.response.namesArr;
                $scope.competitorVolumesArr = res.data.competitorProperties.response.volumesArr;

                if (res.data.response.lead_time == 0)
                    $scope.arr_cmp.lead_time = "";

                /*$scope.arr_cmp.category_name=res.data.response.categories_rec;*/
                //$scope.unit_measures = res.data.response.uom_rec;

                // angular.forEach(res.data.response.uom_rec, function (obj, index) {
                angular.forEach($rootScope.uni_prooduct_arr, function (obj, index) {

                    if (res.data.response.unit_id) {
                        if (obj.id == res.data.response.unit_id)
                            $scope.drp.unit_id = obj;
                    }
                    if (res.data.response.vol_unit) {
                        if (obj.id == res.data.response.vol_unit)
                            $scope.arr_cmp.vol_unit_id = obj;
                    }
                });

                if (res.data.response.category_type == 1) {
                    $scope.showItemCat = true;
                    $scope.showServiceCat = false;

                    //angular.forEach(res.data.response.categories_rec, function (obj, index) {
                    angular.forEach($rootScope.cat_prodcut_arr, function (obj, index) {
                        if (res.data.response.category_id) {
                            if (obj.id == res.data.response.category_id)
                                $scope.arr_cmp.category = obj;

                            //$scope.arr_cmp.category_name = obj.name;
                        }
                    });

                    $scope.brandarray = [];
                    $scope.selCatarray = [];

                    angular.forEach($rootScope.brand_prodcut_arr, function (obj) {
                        if (obj.categories != 0) {
                            angular.forEach(obj.categories, function (obj2) {
                                if (obj2.categoryID == res.data.response.category_id && !($scope.selCatarray.indexOf(obj.id) > 0)) {
                                    $scope.brandarray.push(obj);
                                    $scope.selCatarray.push(obj.id);
                                }
                            });
                        }
                    });

                    if (res.data.response.brand) {
                        angular.forEach($scope.competitorBrandsArr, function (obj2) {
                            if (obj2.id == res.data.response.brand)
                                $scope.arr_cmp.brand = obj2;
                        });
                    }
                    if (res.data.response.item_notes) {
                        angular.forEach($scope.competitorItemsArr, function (obj2) {
                            if (obj2.id == res.data.response.item_notes)
                                $scope.arr_cmp.item_notes = obj2;
                        });
                    }
                    if (res.data.response.supplier_name) {
                        angular.forEach($scope.competitorNamesArr, function (obj2) {
                            if (obj2.id == res.data.response.supplier_name)
                                $scope.arr_cmp.supplier_name = obj2;
                        });
                    }
                    if (res.data.response.volume) {
                        angular.forEach($scope.competitorVolumesArr, function (obj2) {
                            if (obj2.id == res.data.response.volume)
                                $scope.arr_cmp.volume = obj2;
                        });
                    }
                }

                if (res.data.response.lead_type) {
                    angular.forEach($scope.lead_types, function (obj, index) {
                        if (obj.id == res.data.response.lead_type) {
                            $scope.arr_cmp.lead_type = $scope.lead_types[index];
                            //$scope.drp.lead_type = $scope.lead_types[index];
                            $scope.drp.lead_type = obj;
                        }
                    });
                }


                /*if (res.data.response.image_file) {
                 $scope.files = res.data.response.image_file;
                 $scope.check_files = 2;
                 }*/

            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.delete_comp = function (id) {
        var delUrl = $scope.$root.sales + "crm/crm/delete-crm-competitor";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: id,
                    'value': $scope.$root.crm_id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () {
                            $scope.getCompetitor();
                        }, 1500)
                    } else {
                        toaster.pop('error', 'Error', res.data.error);
                    }
                });
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    };
    /****************************************/
    // CRM Competetor End
    /****************************************/


    /****************************************/
    // CRM Promotion start
    /****************************************/


    $scope.getPromotion = (function () {
        //$scope.$root.breadcrumbs[3].name = 'Promotion';
        //  $scope.$root.$broadcast("myCrmPromotionEventReload", args);

        var ApiAjax = $scope.$root.sales + "crm/crm/promotions";
        $scope.sendRequest = true;
        $scope.showLoader = true;

        $scope.postData = {
            'column': 'crm_id',
            'value': $scope.$root.crm_id,
            token: $scope.$root.token
        }

        $scope.count = $scope.count + 1;
        //ngDataService.getDataCustom(  $scope.MainDefer, $scope.mainParams, ApiAjax,$scope.mainFilter,$scope,$scope.postData);

        //$scope.table.tableParams5.reload();
        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res) {
                $scope.columns_promo = [];
                $scope.record_data_promo = {};
                $scope.showLoader = false;
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record;
                    $scope.record_data_promo = res.data.response; //res.data.record.result ;

                    angular.forEach($scope.record_data_promo[0], function (val, index) {
                        if (index != 'chk' && index != 'id') {
                            $scope.columns_promo.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }

                    });
                }
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });

        $scope.crmPromotionFormShow = false;
        $scope.crmPromotionListingShow = true;
        $scope.crmPromotionSelectedShow = false;
    });

    $scope.showAddCrmPromotionForm = function () {
        $scope.check_readonly_promo = false;
        $scope.showItms = true;
        $scope.showServ = true;
        $scope.products = null;
        $scope.resetForm_promo();
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        };
        var day = d.getDate();
        if (day < 10) {
            day = "0" + day;
        };
        /*if($rootScope.defaultDateFormat == $rootScope.dtYMD)
         $scope.rec.starting_date= year + "/" + month + "/" + day;          if($rootScope.defaultDateFormat == $rootScope.dtMDY)
         $scope.rec.starting_date= month + "/" + day + "/" + year;
         if($rootScope.defaultDateFormat == $rootScope.dtDMY)
         $scope.rec.starting_date= day + "/" + month + "/" + year;*/

    }

    $scope.showCrmPromotionForm = function () {
        $scope.crmPromotionFormShow = true;
        $scope.crmPromotionListingShow = false;
        $scope.crmPromotionSelectedShow = false;
        $scope.showProducts = false;
        $scope.showAddCrmPromotionForm();
    }

    $scope.files = [];
    $scope.resetForm_promo = function () {
        $scope.files = [];
        $scope.str_files = [];
        $scope.temp_files = [];
        $scope.comp_files = [];
        $scope.check_file = 0;
        $scope.check_files = 0;
        // $scope.rec.discount_type_id = '';
        $scope.rec_promo = {};

        angular.element("#crm_promotion").parsley().reset();
        //document.getElementById("uploadCrmPromotionFile").value = '';
        // $scope.rec = {};
        $scope.brands = '';
        //$scope.products = {};
        angular.forEach($rootScope.prooduct_arr, function (obj1, indx1) {
            $rootScope.prooduct_arr[indx1].chk = false;
        });
        /*<!--angular.element("input[type='file']").val(null);-->*/
    }

    $scope.rec_promo = {};
    $scope.check_readonly_promo = true;
    $scope.showCrmPromotionreadonly = function () {
        $scope.check_readonly_promo = false;
    }


    $scope.arr2_discount_type = [{
        'name': 'Percentage',
        'id': 1
    }, {
        'name': 'Value',
        'id': 2
    }];


    $scope.uploadFiles = function (file, errFiles) {
        $scope.showLoader = true;
        angular.element('#pic_block').attr("disabled", true);
        //$scope.formData={};
        //$scope.choices={};
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        var postUrl = $scope.$root.sales + "crm/crm/add-promotion";
        if (file) {
            //console.log(postUrl);
            file.upload = Upload.upload({
                url: postUrl,
                data: {
                    file: file,
                    image_token: $scope.$root.token
                }
            });
            file.upload.then(function (response) {


                if (response.data.ack == true) {
                    //console.log(response);
                    file.result = response.data;
                    toaster.pop('success', 'Add', 'Uploaded Successfully ');
                    $scope.showLoader = false;
                } else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Info', response.data.response);
                    angular.element('#pic_block').attr("disabled", false);
                }
            },
                function (response) {

                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                    angular.element('#pic_block').attr("disabled", false);
                },
                function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
        }
    }


    $scope.$on("get_single_image", function (event, image) {
        $scope.formData.emp_picture = image;
        $scope.formDataExpense.exp_image = image;
    });

    $scope.formData = {};
    $scope.addPromo = function (rec_promo) {
        var addUrl = $scope.$root.sales + "crm/crm/add-promotion";


        rec_promo.discount_type = rec_promo.discount_type_id != undefined ? rec_promo.discount_type_id.name : 0;
        //rec_promo.discount_type = rec_promo.discount_type_id != undefined ? rec_promo.discount_type_id.id : 0;

        rec_promo.crm_id = $scope.$root.crm_id;
        rec_promo.token = $scope.$root.token;


        if (rec_promo.promo_image != undefined) {
            rec_promo.promo_image = $scope.formData.emp_picture;
            rec_promo.emp_picture = $scope.formData.emp_picture;
        }
        //console.log(rec_promo);
        /* $http.post(addUrl, rec_promo)
            .then(function (res) {
                //console.log('test here');

            }); */

        if (rec_promo.discount <= 0)
            return false;
        if (rec_promo.update_id != undefined)
            addUrl = $scope.$root.sales + "crm/crm/update-promotion";

        $scope.upload = Upload.upload({
            url: addUrl,
            method: 'POST',
            headers: {
                'header-key': '83c238df1650bccb2d1aa4495723c63f07672ee8'
            },
            withCredentials: true,
            data: rec_promo
        }).progress(function (evt) {
            //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        }).success(function (res, status, headers, config) {
            if (res.ack == true || res.edit == true) {

                $scope.$root.lblButton = 'Add New';
                if (rec_promo.update_id != undefined)
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                else {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $scope.rec_promo.update_id = res.id;
                    $scope.rec_promo.id = res.id;

                }
                $scope.check_readonly_promo = true;
            } else {
                if (rec_promo.update_id != undefined)
                    toaster.pop('error', 'Edit', res.data.error);
                //toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
                else
                    toaster.pop('error', 'Add', res.data.error);
                //toaster.pop('error', 'Add',$scope.$root.getErrorMessageByCode(104));
            }

        });
    }

    $scope.editForm_promo = function (arg, mode) {
        //console.log(arg);
        $scope.check_readonly_promo = true;
        $scope.showLoader = true;
        $scope.showItms = true;
        $scope.showServ = true;
        $scope.resetForm_promo();
        var id = arg;

        if (id > 0) {
            $scope.crmPromotionFormShow = true;
            $scope.crmPromotionListingShow = false;
            $scope.crmPromotionSelectedShow = false;
            $scope.showProducts = true;
            $scope.check_readonly = true;

            if (mode == 1)
                $scope.check_readonly_promo = true;
            else if (mode == 0)
                $scope.check_readonly_promo = false;

        }

        var promoUrl = $scope.$root.sales + "crm/crm/get-promotion";
        $scope.rec = {};
        $http
            .post(promoUrl, {
                id: id,
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.rec_promo = res.data.response;
                    $scope.wordsLength = res.data.response.description.length;
                    //                     if (res.data.response.discount_type_id == 'Percentage')
                    //                         $scope.show_symbol = true;
                    $scope.rec_promo.update_id = res.data.response.id;
                    $scope.rec_promo.old_file = res.data.response.file;

                    /*if (res.data.response.file) {
                     $scope.files[0] = {
                     id: res.data.response.id,
                     file_title: res.data.response.file_title,
                     file: res.data.response.file
                     };
                     $scope.check_files = 1;
                     $scope.check_file = 0;
                     }*/


                    angular.forEach($scope.arr2_discount_type, function (elem) {
                        //console.log(res.data.response.discount_type);
                        if (elem.name == res.data.response.discount_type)
                            $scope.rec_promo.discount_type_id = elem;

                    });

                    angular.forEach($rootScope.prooduct_arr, function (obj1, indx1) {
                        $rootScope.prooduct_arr[indx1].chk = false;
                    });

                    if (res.data.response.promotion_products.response) {
                        angular.forEach($rootScope.prooduct_arr, function (obj1, indx1) {

                            angular.forEach(res.data.response.promotion_products.response, function (obj2) {
                                if (obj1.id == obj2.id)
                                    $rootScope.prooduct_arr[indx1].chk = true;
                            });
                        });
                    }

                    // promotion products

                    if (res.data.response.type == 1) {
                        $scope.showItms = true;
                        $scope.showServ = false;
                        $scope.addProducts_promo(1);
                    }
                }

                $scope.showLoader = false;

            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.showCrmPromotionListing = function () {
        $scope.crmPromotionFormShow = false;
        $scope.crmPromotionListingShow = true;
        $scope.crmPromotionSelectedShow = false;
        $scope.showProducts = false;
        $scope.check_readonly = true;
        $scope.resetForm_promo();
    }

    $scope.delete_promo = function (id, index, $data) {
        var delUrl = $scope.$root.sales + "crm/crm/delete-promotion";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        }).catch(function (e) {
            throw new Error(e.data);
        });
    };

    $scope.products = {};

    $scope.addProducts_promo = function (ishow) {

        if ($scope.rec.type != 2)
            $scope.rec.type = 1;

        $scope.rec_promo.type = $scope.rec.type;

        if ($scope.rec.type == 1)
            angular.element("#crmPromoItems a").click();
        else if ($scope.rec.type == 2)
            angular.element("#crmPromoService a").click();
        else
            angular.element("#crmPromoItems a").click();


        $scope.title = "Add Products";

        if (!ishow)
            angular.element('#productModal').modal({
                show: true
            });

        // $scope.load_dataPromo($scope.rec_promo.id, $scope.rec_promo.type);

    }
    $scope.clear_prod_filter = function () {
        $scope.searchKeyword_price = {};
    }

    $scope.clear_competitors_filter = function () {
        $scope.searchKeyword_competitors = {};
    }

    $scope.load_dataPromo = function (id, type) {


        //console.log($rootScope.prooduct_arr);

        if (id > 0) {

            var promoProdUrl = $scope.$root.sales + "crm/crm/get-promotion-products";
            $http
                .post(promoProdUrl, {
                    id: id,
                    type: type,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        angular.forEach($rootScope.prooduct_arr, function (obj1, indx1) {
                            angular.forEach(res.data.response, function (obj2) {
                                if (obj1.id == obj2.id)
                                    $rootScope.prooduct_arr[indx1].chk = true;
                            });
                        });
                    }
                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
                });
        }
    }

    $scope.prod = {};

    $scope.selectProd = function (id) {
        for (var i = 0; i < $scope.prooduct_arr.length; i++) {
            if (id == $scope.prooduct_arr[i].id) {

                console.log($scope.prooduct_arr[i].chk);

                if ($scope.prooduct_arr[i].chk == true) {
                    $scope.prooduct_arr[i].chk = false;
                } else {
                    var price = 0;
                    if ($scope.rec_promo.discount_type == 'Percentage')
                        price = $scope.prooduct_arr[i].standard_price - ($scope.prooduct_arr[i].standard_price * $scope.rec_promo.discount / 100);

                    if ($scope.rec_promo.discount_type != 'Percentage')
                        price = $scope.prooduct_arr[i].standard_price - $scope.rec_promo.discount;

                    if (price > 0) {
                        $scope.prooduct_arr[i].chk = true;
                    } else {
                        $scope.prooduct_arr[i].chk = false;
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(240));
                    }
                }
            }
        }
    }

    $scope.addPromoProd_promo = function () {
        var addPromoProdUrl = $scope.$root.sales + "crm/crm/add-promotion-product";
        var updateUrl = $scope.$root.sales + "crm/crm/update-crm-promotion";
        var prod = {};
        prod.promotion_id = $scope.rec_promo.id;
        // prod.promotion_product = $scope.products;
        // $scope.products = $scope.prooduct_arr;
        prod.promotion_product = $scope.prooduct_arr;
        prod.token = $scope.$root.token;
        $scope.rec_promo.token = $scope.$root.token;
        //        $http.post(updateUrl, $scope.rec_promo)
        //            .then(function (res) {
        //            });
        $http.post(addPromoProdUrl, prod)
            .then(function (res) { });
        angular.element('#productModal').modal('hide');
    };
    /****************************************/
    // CRM Promotion end
    /****************************************/


    /****************************************/
    // CRM opp cycle    Start
    /****************************************/

    $scope.allStagesCompleted = false;

    $scope.getCode_oop_cycle = function (rec) {

        var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
        var name = $scope.$root.base64_encode('crm_opportunity_cycle_main');
        var no = $scope.$root.base64_encode('oop_no');
        var module_category_id = 2;
        /*if( $scope.formData.brand_ids != 0)  module_category_id=1;
         if( $scope.formData.brand_ids == 0)
         {
         if( $scope.formData.category_ids != 0) module_category_id=3;
         }*/

        $http
            .post(getCodeUrl, {
                'is_increment': 1,
                'token': $scope.$root.token,
                'tb': name,
                'm_id': 9,
                'no': no,
                'category': '',
                'brand': '',
                'module_category_id': module_category_id,
                'type': 0,
                'status': ''
            })
            .then(function (res) {

                if (res.data.ack == 1) {
                    $scope.showLoader = false;
                    $scope.rec_oop.oop_code = res.data.code;
                    $scope.rec_oop.oop_no = res.data.nubmer;
                    $scope.rec_oop.code_type = module_category_id; //res.data.code_type;
                    $scope.count_result++;
                    if (res.data.type == 1) {
                        $scope.product_type = false;
                    } else {
                        $scope.product_type = true;
                    }

                    if ($scope.count_result > 0) {
                        //  //console.log($scope.count_result);
                        return true;
                    } else {
                        //    /*console.log($scope.count_result + 'd');
                        return false;
                    }
                } else {
                    toaster.pop('error', 'info', res.data.error);
                    return false;
                }
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.rec_oop = {};
    $scope.detail = {};
    $scope.arr_win_lost_outcome = [{
        id: 1,
        'name': 'Won'
    }, {
        id: 2,
        'name': 'Lost'
    }]
    $scope.wordsLength = 0;
    $scope.show_opp_doc_listing = true;
    $scope.show_opp_doc_form = false;
    $scope.$root.tabHide = 0;
    $scope.btn_complete = 0;
    $scope.detail.temp_start_date = '';
    $scope.detail.temp_close_date = '0';

    var oppUrl = $scope.$root.setup + "crm/opportunity-cycle-tabs";
    var roleUrl = $scope.$root.setup + "hr/job-title";

    $scope.arr_process_of_decision = [];
    var processUrl = $scope.$root.setup + "general/process-of-decision";

    $scope.arr_salepersons = [];
    $scope.isSalespersonUpdated = false;
    $scope.arr_tabs = {};
    $scope.$root.lblButton = 'Add New';
    $scope.columns_oop = [];
    $scope.record_data_oop = {};
    $scope.arr_tabspostion = {};
    $scope.arr_tabspostion = [{
        'name': 'Won',
        'id': 1
    }, {
        'name': 'Lost',
        'id': 2
    }];

    $scope.getOpportunityCycleDirect = function (open_code) {
        if (open_code != 0)
        {
            var dec = window.atob(open_code);
            var vals = dec.split('^^^');
            var record = {};
            record.id = vals[0];
            record.child_id = vals[1];
            record.crm_id = vals[2];

            $scope.editForm_oop(record, 1, 1);
        }
    }
    $scope.getOpportunityCycle = function () {
        var ApiAjax = $scope.$root.sales + "crm/crm/opportunity-cycles";
        $scope.oppCycleFormShow = false;
        $scope.oppCycleListingShow = true;
        $scope.showLoader = true;
        // $scope.$root.breadcrumbs[3].name = 'Opportunity Cycle';
        //$scope.$root.$broadcast("myOpportunityCycleEventReload", args);
        // $scope.more_fields = 'crm_id*current_status';
        $scope.more_fields = 'crm_id*stage_id';

        $scope.recFrequency = {};
        $scope.start_month = 1;
        $scope.recFrequency.monthlySpreadArr = {};

        $scope.startMonthArr = [{
            'id': 1,
            'title': 'January'
        },
        {
            'id': 2,
            'title': 'February'
        },
        {
            'id': 3,
            'title': 'March'
        },
        {
            'id': 4,
            'title': 'April'
        },
        {
            'id': 5,
            'title': 'May'
        },
        {
            'id': 6,
            'title': 'June'
        },
        {
            'id': 7,
            'title': 'July'
        },
        {
            'id': 8,
            'title': 'August'
        },
        {
            'id': 9,
            'title': 'September'
        },
        {
            'id': 10,
            'title': 'October'
        },
        {
            'id': 11,
            'title': 'November'
        },
        {
            'id': 12,
            'title': 'December'
        }
        ];

        $scope.startMonthSelectionArr = [{
            'id': 1,
            'title': 'January'
        },
        {
            'id': 2,
            'title': 'February'
        },
        {
            'id': 3,
            'title': 'March'
        },
        {
            'id': 4,
            'title': 'April'
        },
        {
            'id': 5,
            'title': 'May'
        },
        {
            'id': 6,
            'title': 'June'
        },
        {
            'id': 7,
            'title': 'July'
        },
        {
            'id': 8,
            'title': 'August'
        },
        {
            'id': 9,
            'title': 'September'
        },
        {
            'id': 10,
            'title': 'October'
        },
        {
            'id': 11,
            'title': 'November'
        },
        {
            'id': 12,
            'title': 'December'
        }
        ];

        $scope.postData = {
            'column': 'crm_id',
            'value': $stateParams.id,
            token: $scope.$root.token,
            'more_fields': $scope.more_fields
        }

        $scope.oppCycleFormShow = false;
        $scope.oppCycleListingShow = true;
        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res) {
                $scope.columns_oop = [];
                $scope.record_data_oop = {};
                if (res.data.record.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record;
                    $scope.record_data_oop = res.data.record.result;
                    angular.forEach($scope.record_data_oop[0], function (val, index) {
                        if (index != 'chk' && index != 'id') {
                            $scope.columns_oop.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }

                    });
                }
                $scope.showLoader = false;
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.OnChangeOutComeLastStage = function () {
        if ($scope.rec_oop.final_step.name != undefined) {
            if ($scope.rec_oop.final_step.name == 'Won')
                $scope.detail.probability = 100;
            else if ($scope.rec_oop.final_step.name == 'Lost')
                $scope.detail.probability = 0;
        }
        else
            $scope.detail.probability = 0;
    }

    $scope.oppCycleListingShow = true;
    $scope.oppCycleFormShow = false;

    $scope.showOppCycleForm = function () {
        $scope.NEW_FREQUENCY = true;
        $scope.check_readonly_opp = false;
        $scope.check_readonly_opp_name = false;
        $scope.checkReadonlyOppParentName = false;

        $scope.recFrequency = {};
        $scope.recFrequency.monthlySpreadArr = {};

        $scope.recFrequency.startmonth = $rootScope.get_obj_frm_arry($scope.startMonthSelectionArr, $rootScope.oppCycleFreqstartmonth);
        $scope.start_month = $scope.recFrequency.startmonth.id;

        $scope.arrFrequency = [{
            'id': 1,
            'title': 'Annual'
        },
        {
            'id': 2,
            'title': 'Quarterly'
        },
        {
            'id': 3,
            'title': 'Monthly'
        },
        {
            'id': 4,
            'title': 'Weekly'
        },
        {
            'id': 5,
            'title': 'One-off'
        }
        ];

        //angular.element("#subject").parsley().reset();
        angular.element("#opportunity_cycle").parsley().reset();

        $scope.showLoader = true;

        $scope.oppCycleFormShow = true;
        $scope.oppCycleListingShow = false;

        $scope.selectedSpOopCycle = [];
        $scope.selectedsupportstaff = [];

        $scope.detail = {};
        $scope.rec_oop = {};
        $scope.btn_complete = true;
        $scope.check_readonly = false;
        //$scope.resetForm_oop();

        $scope.stage_record_id = 0;

        angular.forEach($rootScope.arr_currency, function (elem) {
            if ($scope.$root.defaultCurrency == elem.id)
                $scope.rec_oop.currency_id = elem;
        });


        $scope.arr_roles1 = [];
        $scope.arr_roles2 = [];
        $scope.arr_roles3 = [];
        $scope.arr_testroles = [];
        $scope.arr_alt_contacts = [];

        // $scope.arr_alt_contacts.push({
        //     'id': '',
        //     'name': ''
        // });
        // $scope.arr_testroles.push({
        //     'id': '',
        //     'title': ''
        // });
        // load pre add data
        var LoadPreDataUrl = $scope.$root.sales + "crm/crm/get-crm-opp-cycle-pre-data";

        // console.log( LoadPreDataUrl);
        // decode table name for code generation

        $http.post(LoadPreDataUrl, {
            'is_opp_cyle': 1,
            'token': $scope.$root.token,
            'tb': name,
            'opp_cycle_limit': $scope.$root.opp_cycle_limit,
            'crm_id': $scope.$root.crm_id,
            'type': 2,
            'status': 1

        }).then(function (res) {

            if (res.data.ack == 1) {

                // console.log(res.data);
                $scope.showLoader = false;
                // $scope.rec_oop.oop_code = res.data.code.code;

                //-----------stages-----------------//
                $scope.arr_tabs = res.data.stages.response;
                // $scope.rec_oop.current_status = $scope.type = res.data.stages.response[0];
                $scope.rec_oop.stage_id = $scope.type = res.data.stages.response[0];

                /* angular.forEach($scope.arr_tabs, function (elem) {
                    if (elem.id == $scope.rec_oop.stage_id.id) {
                        elem.stagestatus = 3;
                    }
                }); */

                if(res.data.job_titles && res.data.job_titles.oppCycleFreqstartmonth >0){

                    $scope.recFrequency.startmonth = $rootScope.get_obj_frm_arry($scope.startMonthSelectionArr, res.data.job_titles.oppCycleFreqstartmonth);
                    $scope.start_month = $scope.recFrequency.startmonth.id;
                }

                // console.log($scope.rec_oop.stage_id.id);

                angular.forEach($scope.arr_tabs, function (elem) {
                    if (elem.id == $scope.rec_oop.stage_id.id)
                        elem.activestagestatus = 1;
                    else
                        elem.activestagestatus = 0;
                });

                if ($scope.rec_oop.stage_id != undefined)
                    $scope.detail.probability = $scope.rec_oop.stage_id.percentage;
                else
                    $scope.detail.probability = '';

                /* if (Number($scope.stage_record_id) > 0)
                 $scope.onTabSelect($scope.rec_oop.current_status.id, $scope.stage_record_id, $scope.rec_oop.current_status);
                 */
                //----------contacts-------------//
                //console.log(res.data.alt_contacts);
                //$scope.arr_alt_contacts = res.data.alt_contacts.response;
                // $scope.arr_alt_contacts = res.data.alt_contacts.record.result;
                angular.forEach(res.data.alt_contacts.response, function (elem) {
                    //console.log(elem);
                    $scope.arr_alt_contacts.push(elem);
                });

                //----------Process of Decision-----------//
                $scope.arr_process_of_decision = res.data.process_of_decission.response;
                /*if ($scope.user_type == 1)
                     $scope.arr_process_of_decision.push({
                        'id': '-1',
                        'name': '++ Add New ++'
                    }); */

                //-------------job titles-----------//
                // $scope.arr_testroles = res.data.job_titles.response; //res.data.record.result;

                angular.forEach(res.data.job_titles.response, function (elem) {
                    //console.log(elem);
                    $scope.arr_testroles.push(elem);
                });

                $scope.arr_roles1 = $scope.arr_testroles;
                $scope.arr_roles2 = $scope.arr_testroles;
                $scope.arr_roles3 = $scope.arr_testroles;
                /* $scope.arr_testroles.push({
                    'id': '-1',
                    'title': '++ Add New ++'
                }); */
                $scope.generalSalesPersonArr = res.data.crmsaleperson.response;
                if (res.data.crmsaleperson.response != "") {
                    angular.forEach(res.data.crmsaleperson.response, function (obj) {
                        if (obj.is_primary == 1) {
                            obj.isPrimary = true;
                            $scope.selectedSpOopCycle.push(obj);

                        }
                    });
                }
                // console.log(res.data);

            } else {
                toaster.pop('error', 'info', res.data.error);
                return false;
            }
            $scope.showLoader = false;
            $scope.allStagesCompleted = false;

        }).catch(function (message) {
            $scope.showLoader = false;

            throw new Error(message.data);
            console.log(message.data);
        });


        //$scope.getCode_oop_cycle();
        $scope.stage_record_id = 0;
        $scope.stage_change = 1;
        $scope.tabsDetil = {};

        $scope.rec_oop.date_added = $scope.$root.get_current_date();
        $scope.detail.start_date = $scope.$root.get_current_date();
        $scope.detail.end_date = $scope.$root.get_current_date();
    }

    $scope.stage_change = 1;
    $scope.child_id = 0;

    $scope.editForm_oop_detail = function (arr) {
        //console.log(arr);

        $scope.arr_testroles = [];
        $scope.arr_alt_contacts = [];

        var oppUrl = $scope.$root.sales + "crm/crm/get-crm-opportunity-cycle";

        $scope.showLoader = true;

        $http
            .post(oppUrl, {
                'id': arr.ids,
                'token': $scope.$root.token,
                'crm_id': $stateParams.id,
                'tab_id': arr.tab_id,
                'child_id': arr.child_id,
                'status': 1
            })
            .then(function (res) {
                $scope.showLoader = false;
                $scope.selectedSpOopCycle = [];
                $scope.selectedsupportstaff = [];

                $scope.allStagesCompleted = false;

                if (res.data.ack == true) {

                    //console.log(res.data.response);

                    if (Number(res.data.response.is_complete) == 1)
                        $scope.check_readonly_opp = true;
                    else
                        $scope.check_readonly_opp = false;


                    $scope.check_readonly_opp_name = true;

                    $scope.rec_oop.is_complete = res.data.response.is_complete;

                    $scope.rec_oop.crm_opportunity_cycle_id = res.data.response.crm_opportunity_cycle_id;
                    $scope.rec_oop.subject = res.data.response.subject;
                    $scope.rec_oop.forecast_amount = parseFloat(res.data.response.forecast_amount);
                    $scope.rec_oop.convert_amount = parseFloat(res.data.response.convert_amount);
                    $scope.rec_oop.date_added = res.data.response.date_added;

                    $scope.rec_oop.id = res.data.response.id;
                    $scope.rec_oop.oop_code = res.data.response.oop_code;
                    $scope.rec_oop.notes = res.data.response.notes;
                    $scope.arr_alt_contacts = res.data.response.alt_contacts.response;
                    //console.log($scope.arr_alt_contacts);

                    $scope.arr_process_of_decision = res.data.response.process_of_decission.response;

                    $scope.arr_roles1 = [];
                    $scope.arr_roles2 = [];
                    $scope.arr_roles3 = [];

                    $scope.arr_testroles = res.data.response.job_titles.response;

                    $scope.arr_roles1 = $scope.arr_testroles;
                    $scope.arr_roles2 = $scope.arr_testroles;
                    $scope.arr_roles3 = $scope.arr_testroles;

                    if (res.data.response.tabsDetail.response.length > 0 && res.data.response.tabsDetail.response != undefined)
                        $scope.tabsDetil = res.data.response.tabsDetail.response;

                    if (res.data.response.process_of_decision)
                        $scope.rec_oop.process_of_decisions = $rootScope.get_obj_frm_arry($scope.arr_process_of_decision, res.data.response.process_of_decision);

                    if (res.data.response.final_step)
                        $scope.rec_oop.final_step = $rootScope.get_obj_frm_arry($scope.arr_tabspostion, res.data.response.final_step);

                    //if (res.data.response.contact_person_1) {

                    // angular.forEach($scope.arr_alt_contacts, function (elem) {
                    //     if (res.data.response.contact_person_1 == elem.id)
                    //         $scope.rec_oop.contact_person_one = elem;
                    //     if (res.data.response.contact_person_2 == elem.id)
                    //         $scope.rec_oop.contact_person_two = elem;
                    //     if (res.data.response.contact_person_3 == elem.id)
                    //         $scope.rec_oop.contact_person_three = elem;
                    // });
                    // }

                    //if (res.data.response.role_1) {
                    /* angular.forEach($scope.arr_roles1, function (elem) {
                        if (res.data.response.role_1 == elem.id)
                            $scope.rec_oop.role_one = elem;
                        if (res.data.response.role_2 == elem.id)
                            $scope.rec_oop.role_two = elem;
                        if (res.data.response.role_3 == elem.id)
                            $scope.rec_oop.role_three = elem;
                    }); */
                    // }

                    // if (res.data.response.currency_id)
                    //     $scope.rec_oop.currency_id = $rootScope.get_obj_frm_arry($rootScope.arr_currency, res.data.response.currency_id);

                    $scope.arr_tabs = res.data.response.stages.response;

                    if (res.data.response.tabsDetail.response.length > 0 && res.data.response.tabsDetail.response != undefined) {

                        $scope.tabsDetil = res.data.response.tabsDetail.response;


                        $scope.selTabDetailData = {};

                        if ($scope.arr_tabs.length > 0) {

                            angular.forEach($scope.tabsDetil, function (obj) {
                                angular.forEach($scope.arr_tabs, function (obj2) {
                                    if (obj.stagename == obj2.name) {
                                        obj.stageNumber = obj2.stage_number;
                                    }
                                });
                            });

                            angular.forEach($scope.tabsDetil, function (obj) {
                                if (obj.stage_id == res.data.response.stage_id) {
                                    $scope.selTabDetailData = obj;
                                }
                            });

                            // if ($scope.selTabDetailData) {//.length > 0
                            if (Object.getOwnPropertyNames($scope.selTabDetailData).length !== 0) {

                                /* $scope.rec_oop.contact_person_one = {};
                                $scope.rec_oop.contact_person_two = {};
                                $scope.rec_oop.contact_person_three = {};
                                $scope.rec_oop.role_one = {};
                                $scope.rec_oop.role_two = {};
                                $scope.rec_oop.role_three = {};
                                $scope.rec_oop.currency_id = {}; */

                                angular.forEach($scope.arr_alt_contacts, function (elem) {
                                    if ($scope.selTabDetailData.contact_person_1 == elem.id)
                                        $scope.rec_oop.contact_person_one = elem;

                                    if ($scope.selTabDetailData.contact_person_2 == elem.id)
                                        $scope.rec_oop.contact_person_two = elem;

                                    if ($scope.selTabDetailData.contact_person_3 == elem.id)
                                        $scope.rec_oop.contact_person_three = elem;
                                });

                                angular.forEach($scope.arr_roles1, function (elem) {
                                    if ($scope.selTabDetailData.role_1 == elem.id)
                                        $scope.rec_oop.role_one = elem;

                                    if ($scope.selTabDetailData.role_2 == elem.id)
                                        $scope.rec_oop.role_two = elem;

                                    if ($scope.selTabDetailData.role_3 == elem.id)
                                        $scope.rec_oop.role_three = elem;
                                });

                                if ($scope.selTabDetailData.currency_id)
                                    $scope.rec_oop.currency_id = $rootScope.get_obj_frm_arry($rootScope.arr_currency, $scope.selTabDetailData.currency_id);
                            }
                            else {
                                angular.forEach($scope.arr_alt_contacts, function (elem) {
                                    if (res.data.response.contact_person_1 == elem.id)
                                        $scope.rec_oop.contact_person_one = elem;
                                    if (res.data.response.contact_person_2 == elem.id)
                                        $scope.rec_oop.contact_person_two = elem;
                                    if (res.data.response.contact_person_3 == elem.id)
                                        $scope.rec_oop.contact_person_three = elem;
                                });

                                angular.forEach($scope.arr_roles1, function (elem) {
                                    if (res.data.response.role_1 == elem.id)
                                        $scope.rec_oop.role_one = elem;
                                    if (res.data.response.role_2 == elem.id)
                                        $scope.rec_oop.role_two = elem;
                                    if (res.data.response.role_3 == elem.id)
                                        $scope.rec_oop.role_three = elem;
                                });

                                if (res.data.response.currency_id)
                                    $scope.rec_oop.currency_id = $rootScope.get_obj_frm_arry($rootScope.arr_currency, res.data.response.currency_id);
                            }
                        }
                    }

                    $scope.rec_oop.stagesStatus = res.data.response.stagesStatus.response;

                    // console.log(res.data.response.stage_id);

                    angular.forEach($scope.arr_tabs, function (elem) {
                        if (elem.id == res.data.response.stage_id)
                            elem.activestagestatus = 1;
                        else
                            elem.activestagestatus = 0;
                    });

                    var lastStageID = $scope.arr_tabs[$scope.arr_tabs.length-1].id;

                    angular.forEach($scope.rec_oop.stagesStatus, function (obj) {
                        if (obj.stage_id == lastStageID && obj.is_complete == 1) {
                            $scope.allStagesCompleted = true;
                            $scope.check_readonly_opp = true;
                        }
                    });

                    var stageCounter = 0;
                    var lastStageCounter = 0;

                    if ($scope.rec_oop.stagesStatus != undefined)
                        var intializeStagesNo = $scope.rec_oop.stagesStatus.length;

                    angular.forEach($scope.arr_tabs, function (elem) {

                        if (elem.stagestatus != 1 && stageCounter < intializeStagesNo)
                            elem.stagestatus = 4;

                        angular.forEach($scope.rec_oop.stagesStatus, function (obj) {

                            if (elem.stagestatus == undefined || elem.stagestatus == 2 || elem.stagestatus == 4) {

                                if (elem.id == obj.stage_id && obj.is_complete == 1) {
                                    elem.stagestatus = 1;
                                    lastStageCounter = stageCounter + 1;

                                } else if (elem.id == obj.stage_id && obj.activeRec == 1 && obj.is_complete == 0) {
                                    elem.stagestatus = 2;
                                    lastStageCounter = stageCounter + 1;
                                }
                            }

                            if (obj.is_complete == 1)
                                $scope.check_readonly_opp_name = true;
                        });

                        stageCounter++;
                    });

                    var activeStageCounter = 0;

                    angular.forEach($scope.arr_tabs, function (elem) {

                        if ((parseInt(activeStageCounter) < parseInt(lastStageCounter)) && elem.stagestatus == undefined) {
                            elem.stagestatus = 4;
                        }
                        activeStageCounter++;
                    });


                    // $scope.rec_oop.current_status = $scope.type = res.data.response.tab_id;
                    $scope.rec_oop.stage_id = $scope.type = res.data.response.tab_id;
                    $scope.detail.probability = res.data.response.percentage_stage;

                    $scope.detail.start_date = res.data.response.start_date;
                    $scope.detail.end_date = res.data.response.end_date;
                    $scope.detail.expected_close_date = res.data.response.expected_close_date;

                    $scope.detail.temp_start_date = $scope.detail.end_date;
                    $scope.detail.temp_close_date = $scope.detail.expected_close_date;

                    if (res.data.response.is_complete)
                        $scope.btn_complete = true;

                    $scope.detail.id = res.data.response.id;

                    if (Number(res.data.response.stage_change) == 0) {
                        $scope.stage_change = 0;
                        //$scope.rec_oop.current_status = $scope.stage_data = $rootScope.get_obj_frm_arry($scope.arr_tabs, res.data.response.current_status);
                        $scope.rec_oop.stage_id = $scope.stage_data = $rootScope.get_obj_frm_arry($scope.arr_tabs, res.data.response.stage_id);
                    } else
                        $scope.stage_change = 1;


                    if (res.data.response.crmsaleperson.response != "") {
                        if (res.data.response.saleperson.response != "") {

                            angular.forEach(res.data.response.crmsaleperson.response, function (obj) {

                                obj.chk = false;
                                obj.isPrimary = false;

                                angular.forEach(res.data.response.saleperson.response, function (obj2) {

                                    if (obj.id == obj2.salesperson_id) {
                                        obj.chk = true;
                                        if (obj2.is_primary == 1)
                                            obj.isPrimary = true;
                                        $scope.selectedSpOopCycle.push(obj);
                                    }
                                });
                            });
                        }
                    }

                    if (res.data.response.employees.response != "") {
                        if (res.data.response.supportperson.response != "") {

                            angular.forEach(res.data.response.employees.response, function (obj) {

                                obj.chk = false;

                                angular.forEach(res.data.response.supportperson.response, function (obj2) {

                                    if (obj.id == obj2.employee_id) {
                                        obj.chk = true;
                                        $scope.selectedsupportstaff.push(obj);
                                    }
                                });
                            });
                        }
                    }

                    /*if (Number(res.data.response.stage_change) == 0)
                     $scope.rec_oop.current_status = recstage;*/

                    if (Number(res.data.response.probability) > 0)
                        $scope.detail.probability = res.data.response.probability;
                    /*else
                     $scope.detail.probability = recstage.percentage;*/
                }
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.setFrequencyDetail = function (frequency_id) {
        //console.log(frequency_id);

        $scope.frequency = frequency_id;

        if (frequency_id != $scope.recFrequency.dbFrequencyID) {
            $scope.recFrequency.equalSpread = 0;
            // if (!$scope.recFrequency.equalSpread > 0)
        }
        $scope.actualtotalamount = 0;

        if (frequency_id == 1) {

            $scope.title = "Annual Frequency";
            $scope.recFrequency.firstquartermonth = $scope.recFrequency.secondquartermonth = $scope.recFrequency.thirdquartermonth = "";
            // $scope.EnableSpread = false;

        } else if (frequency_id == 2) {

            $scope.title = "Quarterly Frequency";

            $scope.recFrequency.monthlySpreadArr.January = $scope.recFrequency.monthlySpreadArr.February = $scope.recFrequency.monthlySpreadArr.March =
                $scope.recFrequency.monthlySpreadArr.April = $scope.recFrequency.monthlySpreadArr.May = $scope.recFrequency.monthlySpreadArr.June =
                $scope.recFrequency.monthlySpreadArr.July = $scope.recFrequency.monthlySpreadArr.August = $scope.recFrequency.monthlySpreadArr.September =
                $scope.recFrequency.monthlySpreadArr.October = $scope.recFrequency.monthlySpreadArr.November = $scope.recFrequency.monthlySpreadArr.December = "";

            // $scope.EnableSpread = false;

        }

        if (!(Number($scope.rec_oop.convert_amount) > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Forecast Amount']));
            return;
        }

        angular.element('#OopCycleFrequencyModal').modal({
            show: true
        });
    }

    $scope.add_OopCycleFrequency = function (recFrequency) {
        console.log(recFrequency);

        /* if (angular.element('#equalSpread').is(':checked') == false)
           recFrequency.equalSpread = 0; */

        if ($scope.frequency == 1) {

            var totalFrequency = Number(recFrequency.monthlySpreadArr.January) +
                Number(recFrequency.monthlySpreadArr.February) +
                Number(recFrequency.monthlySpreadArr.March) +
                Number(recFrequency.monthlySpreadArr.April) +
                Number(recFrequency.monthlySpreadArr.May) +
                Number(recFrequency.monthlySpreadArr.June) +
                Number(recFrequency.monthlySpreadArr.July) +
                Number(recFrequency.monthlySpreadArr.August) +
                Number(recFrequency.monthlySpreadArr.September) +
                Number(recFrequency.monthlySpreadArr.October) +
                Number(recFrequency.monthlySpreadArr.November) +
                Number(recFrequency.monthlySpreadArr.December);

            console.log(totalFrequency.toFixed() + '-' + Number($scope.rec_oop.convert_amount).toFixed());

            //totalFrequency.toFixed(1) larger forcasting may forcasting rounding error with toFixed parameter let it blank for accuracy.
            if (totalFrequency.toFixed() != Number($scope.rec_oop.convert_amount).toFixed()) {

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(337));
                return;

            } else {

                recFrequency.startmonths = $scope.start_month; //(recFrequency.startmonth != undefined && recFrequency.startmonth != '') ? recFrequency.startmonth.id : 0;

                $scope.rec_oop.recfrequeny = recFrequency;
                $scope.EnableSpread = true;
                angular.element('#OopCycleFrequencyModal').modal('hide');
                // console.log($scope.rec_oop.recfrequeny);
            }

        } else if ($scope.frequency == 2) {

            var totalFrequency = Number(recFrequency.firstquartermonth) + Number(recFrequency.secondquartermonth) + Number(recFrequency.thirdquartermonth);

            console.log(totalFrequency);

            if (totalFrequency.toFixed(1) != Number($scope.rec_oop.convert_amount).toFixed(1)) {

                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(337));

                return;

            } else {

                $scope.rec_oop.recfrequeny = recFrequency;
                $scope.EnableSpread = true;
                angular.element('#OopCycleFrequencyModal').modal('hide');
                //console.log($scope.rec_oop.recfrequeny);
            }
        }
    }

    $scope.toggleEqualSpread = function (equalSpread, monthTitle) {
        if ($scope.recFrequency.ChangedMonths !== undefined) {


            if ($scope.recFrequency.ChangedMonths.indexOf(monthTitle) == -1) {
                $scope.recFrequency.ChangedMonths.push(monthTitle)
            }
        }
        else {
            $scope.recFrequency.ChangedMonths = [];
            $scope.recFrequency.ChangedMonths.push(monthTitle);
        }

        if (equalSpread == true)
            $scope.recFrequency.equalSpread = 0;
    }
    $scope.changeOppCycleMonthSequence = function () {
        $scope.start_month = $scope.recFrequency.startmonth.id;
    }
    /* $scope.equalSpreadFrequency = function (equalSpread) {

        console.log(equalSpread);

        if ($scope.frequency == 1) {

            if (equalSpread == true) {

                $scope.recFrequency.monthlySpreadArr.January = $scope.recFrequency.monthlySpreadArr.February =
                    $scope.recFrequency.monthlySpreadArr.March = $scope.recFrequency.monthlySpreadArr.April =
                    $scope.recFrequency.monthlySpreadArr.May = $scope.recFrequency.monthlySpreadArr.June =
                    $scope.recFrequency.monthlySpreadArr.July = $scope.recFrequency.monthlySpreadArr.August =
                    $scope.recFrequency.monthlySpreadArr.September = $scope.recFrequency.monthlySpreadArr.October =
                    $scope.recFrequency.monthlySpreadArr.November = $scope.recFrequency.monthlySpreadArr.December =
                    parseFloat(($scope.rec_oop.convert_amount / 12).toFixed(2));

            } else {

                $scope.recFrequency.monthlySpreadArr.January = $scope.recFrequency.monthlySpreadArr.February =
                    $scope.recFrequency.monthlySpreadArr.March = $scope.recFrequency.monthlySpreadArr.April =
                    $scope.recFrequency.monthlySpreadArr.May = $scope.recFrequency.monthlySpreadArr.June =
                    $scope.recFrequency.monthlySpreadArr.July = $scope.recFrequency.monthlySpreadArr.August =
                    $scope.recFrequency.monthlySpreadArr.September = $scope.recFrequency.monthlySpreadArr.October =
                    $scope.recFrequency.monthlySpreadArr.November = $scope.recFrequency.monthlySpreadArr.December = "";
            }

        } else if ($scope.frequency == 2) {
            if (equalSpread == true) {

                $scope.recFrequency.firstquartermonth = $scope.recFrequency.secondquartermonth = $scope.recFrequency.thirdquartermonth = parseFloat(($scope.rec_oop.convert_amount / 3).toFixed(2));

            } else {

                $scope.recFrequency.firstquartermonth = $scope.recFrequency.secondquartermonth = $scope.recFrequency.thirdquartermonth = "";

            }
        }
    } */

    $scope.equalSpreadFrequency = function (equalSpread) {

        // console.log(equalSpread);
        $scope.actualtotalamount = 0;

        if ($scope.frequency == 1) {

            $scope.recFrequency.monthlySpreadArr.January = $scope.recFrequency.monthlySpreadArr.February =
                $scope.recFrequency.monthlySpreadArr.March = $scope.recFrequency.monthlySpreadArr.April =
                $scope.recFrequency.monthlySpreadArr.May = $scope.recFrequency.monthlySpreadArr.June =
                $scope.recFrequency.monthlySpreadArr.July = $scope.recFrequency.monthlySpreadArr.August =
                $scope.recFrequency.monthlySpreadArr.September = $scope.recFrequency.monthlySpreadArr.October =
                $scope.recFrequency.monthlySpreadArr.November = $scope.recFrequency.monthlySpreadArr.December =
                parseFloat(($scope.rec_oop.convert_amount / 12).toFixed(2));

        } else if ($scope.frequency == 2) {

            $scope.recFrequency.firstquartermonth = $scope.recFrequency.secondquartermonth = $scope.recFrequency.thirdquartermonth = parseFloat(($scope.rec_oop.convert_amount / 3).toFixed(2));
        }
        if ($scope.recFrequency.ChangedMonths == undefined) {
            $scope.recFrequency.ChangedMonths = [];
        }
    }

    $scope.clearFields = function () {
        $scope.recFrequency.firstquartermonth = 0;
        $scope.recFrequency.secondquartermonth = 0;
        $scope.recFrequency.thirdquartermonth = 0;
        console.table($scope.recFrequency);
        if ($scope.recFrequency && $scope.recFrequency.monthlySpreadArr) {
            for (var k in $scope.recFrequency.monthlySpreadArr) {
                if ($scope.recFrequency.monthlySpreadArr.hasOwnProperty(k))
                    $scope.recFrequency.monthlySpreadArr[k] = 0;
            }
        }
    }

    $scope.equalSpreadRemainingFrequency = function () {

        // console.log($scope.recFrequency);

        var currentAmount = 0;
        $scope.chkarray = [];
        var counter = 0;

        if ($scope.frequency == 1) {

            if (!($scope.actualtotalamount > 0))
                $scope.actualtotalamount = parseFloat(($scope.rec_oop.convert_amount / 12).toFixed(2));
            // console.log($scope.actualtotalamount);

            angular.forEach($scope.recFrequency.monthlySpreadArr, function (obj, index) {
                obj = (obj != undefined && obj != "" && obj != null) ? obj : 0;
                if (parseFloat(obj) != $scope.actualtotalamount && parseFloat(obj) != undefined && parseFloat(obj) != 0 && parseFloat(obj) != null) {
                    if ($scope.recFrequency.ChangedMonths.indexOf(index) !== -1) {
                        $scope.chkarray.push(index);
                        currentAmount = currentAmount + parseFloat(obj);
                        counter++;
                    }
                }
            });

            //  console.log(currentAmount);
            counter = 12 - parseInt(counter);

            if (counter > 0) {

                var remainingAmount = parseFloat($scope.rec_oop.convert_amount) - parseFloat(currentAmount);
                var currentAmountTotal = parseFloat((remainingAmount / counter).toFixed(2));

                if (!(currentAmountTotal > 0)) {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(337));
                    return;
                }

                $scope.actualtotalamount = currentAmountTotal;

                angular.forEach($scope.startMonthArr, function (obj, index) {
                    var abc = $scope.chkarray.indexOf(obj.title);

                    if (abc < 0) {
                        $scope.recFrequency.monthlySpreadArr[obj.title] = currentAmountTotal;
                    }
                });
            }
        }
        else if ($scope.frequency == 2) {

            if (!($scope.actualtotalamount > 0))
                $scope.actualtotalamount = parseFloat(($scope.rec_oop.convert_amount / 3).toFixed(2));
            // console.log($scope.actualtotalamount);

            $scope.recFrequency.firstquartermonth = ($scope.recFrequency.firstquartermonth != undefined && $scope.recFrequency.firstquartermonth != "" && $scope.recFrequency.firstquartermonth != null) ? $scope.recFrequency.firstquartermonth : 0;
            $scope.recFrequency.secondquartermonth = ($scope.recFrequency.secondquartermonth != undefined && $scope.recFrequency.secondquartermonth != "" && $scope.recFrequency.secondquartermonth != null) ? $scope.recFrequency.secondquartermonth : 0;
            $scope.recFrequency.thirdquartermonth = ($scope.recFrequency.thirdquartermonth != undefined && $scope.recFrequency.thirdquartermonth != "" && $scope.recFrequency.thirdquartermonth != null) ? $scope.recFrequency.thirdquartermonth : 0;


            if (parseFloat($scope.recFrequency.firstquartermonth) != $scope.actualtotalamount && parseFloat($scope.recFrequency.firstquartermonth) != undefined && parseFloat($scope.recFrequency.firstquartermonth) != 0 && parseFloat($scope.recFrequency.firstquartermonth) != null) {
                $scope.chkarray.push('firstquartermonth');
                currentAmount = currentAmount + parseFloat($scope.recFrequency.firstquartermonth);
                counter++;
            }

            if (parseFloat($scope.recFrequency.secondquartermonth) != $scope.actualtotalamount && parseFloat($scope.recFrequency.secondquartermonth) != undefined && parseFloat($scope.recFrequency.secondquartermonth) != 0 && parseFloat($scope.recFrequency.secondquartermonth) != null) {
                $scope.chkarray.push('secondquartermonth');
                currentAmount = currentAmount + parseFloat($scope.recFrequency.secondquartermonth);
                counter++;
            }

            if (parseFloat($scope.recFrequency.thirdquartermonth) != $scope.actualtotalamount && parseFloat($scope.recFrequency.thirdquartermonth) != undefined && parseFloat($scope.recFrequency.thirdquartermonth) != 0 && parseFloat($scope.recFrequency.thirdquartermonth) != null) {
                $scope.chkarray.push('thirdquartermonth');
                currentAmount = currentAmount + parseFloat($scope.recFrequency.thirdquartermonth);
                counter++;
            }

            counter = 3 - parseInt(counter);

            if (counter > 0) {

                var remainingAmount = parseFloat($scope.rec_oop.convert_amount) - parseFloat(currentAmount);
                var currentAmountTotal = parseFloat((remainingAmount / counter).toFixed(2));

                if (!(currentAmountTotal > 0)) {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(337));
                    return;
                }

                $scope.actualtotalamount = currentAmountTotal;
                // console.log($scope.chkarray);
                // console.log($scope.chkarray.indexOf('firstquartermonth'));
                // console.log(($scope.chkarray.indexOf('firstquartermonth') < 0));
                // console.log($scope.chkarray.indexOf('secondquartermonth'));
                // console.log(($scope.chkarray.indexOf('secondquartermonth') < 0));
                // console.log($scope.chkarray.indexOf('thirdquartermonth'));
                // console.log(($scope.chkarray.indexOf('thirdquartermonth') < 0));

                if ($scope.chkarray.indexOf('firstquartermonth') < 0)
                    $scope.recFrequency.firstquartermonth = currentAmountTotal;

                if ($scope.chkarray.indexOf('secondquartermonth') < 0)
                    $scope.recFrequency.secondquartermonth = currentAmountTotal;

                if ($scope.chkarray.indexOf('thirdquartermonth') < 0)
                    $scope.recFrequency.thirdquartermonth = currentAmountTotal;
            }
        }
        if ($scope.recFrequency.ChangedMonths == undefined) {
            $scope.recFrequency.ChangedMonths = [];
        }
    }

    $scope.editForm_oop = function (arr, status, mode) {
        //console.log(arr);

        $scope.oppCycleFormShow = true;
        $scope.oppCycleListingShow = false;
        $scope.btn_complete = true;

        $scope.stage_record_id = arr.id;
        $scope.child_id = arr.child_id;
        $scope.$root.opp_cycle_id = arr.id;

        $scope.recFrequency = {};
        $scope.recFrequency.monthlySpreadArr = {};


        $scope.arrFrequency = [{
            'id': 1,
            'title': 'Annual'
        },
        {
            'id': 2,
            'title': 'Quarterly'
        },
        {
            'id': 3,
            'title': 'Monthly'
        },
        {
            'id': 4,
            'title': 'Weekly'
        },
        {
            'id': 5,
            'title': 'One-off'
        }
        ];


        $scope.selectedSpOopCycle = [];

        if (arr.history)
            $scope.stage_record_id = arr.ids;

        var args = [];
        args[0] = $scope.$root.opp_cycle_id;
        args[1] = undefined;

        $scope.arr_tabs = [];
        $scope.LoadOppCycleData(arr, mode);

        $scope.stage_change = 0;

    }

    $scope.add_oop_data = function (rec_oop, detail) {
        /*console.log($scope.selectedSpOopCycle);
         return;*/

        if (rec_oop.name == undefined || rec_oop.name == '' || rec_oop.name == null) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Name']));
            return false;
        }

        if (rec_oop.forecast_amount == undefined || rec_oop.forecast_amount == '' || rec_oop.forecast_amount == null) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Forecast Amount']));
            return false;
        }

        if (rec_oop.convert_amount == undefined || rec_oop.convert_amount == '' || rec_oop.convert_amount == null) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Converted Amount']));
            return false;
        }

        if ((parseFloat(detail.probability) < 1 || parseFloat(detail.probability) > 100) && (rec_oop.final_step == undefined || rec_oop.final_step == "")) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(338));
            return false;
        }

        if (rec_oop.currency_id == undefined || rec_oop.currency_id == '' || rec_oop.currency_id == null){
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Currency']));
            return false;
        }

        $scope.showLoader = true;

        //rec_oop.current_status = $scope.rec_oop.current_status;
        rec_oop.stage_id = $scope.rec_oop.stage_id;
        //rec_oop.current_statuss = rec_oop.current_status != undefined ? rec_oop.current_status.id : 0;
        rec_oop.stage_ids = (rec_oop.stage_id != undefined && rec_oop.stage_id != '') ? rec_oop.stage_id.id : 0;
        rec_oop.process_of_decision = (rec_oop.process_of_decisions != undefined && rec_oop.process_of_decisions != '') ? rec_oop.process_of_decisions.id : 0;
        rec_oop.outcome = (rec_oop.win_lost_outcome != undefined && rec_oop.win_lost_outcome != '') ? rec_oop.win_lost_outcome.id : 0;
        rec_oop.contact_person_1 = (rec_oop.contact_person_one != undefined && rec_oop.contact_person_one != '') ? rec_oop.contact_person_one.id : 0;
        rec_oop.contact_person_2 = (rec_oop.contact_person_two != undefined && rec_oop.contact_person_two != '') ? rec_oop.contact_person_two.id : 0;
        rec_oop.contact_person_3 = (rec_oop.contact_person_three != undefined && rec_oop.contact_person_three != '') ? rec_oop.contact_person_three.id : 0;
        rec_oop.role_1 = (rec_oop.role_one != undefined && rec_oop.role_one != '') ? rec_oop.role_one.id : 0;
        rec_oop.role_2 = (rec_oop.role_two != undefined && rec_oop.role_two != '') ? rec_oop.role_two.id : 0;
        rec_oop.role_3 = (rec_oop.role_three != undefined && rec_oop.role_three != '') ? rec_oop.role_three.id : 0;
        rec_oop.convert_amount = (rec_oop.convert_amount != undefined && rec_oop.convert_amount != '') ? rec_oop.convert_amount : 0;
        

        rec_oop.final_steps = (rec_oop.final_step != undefined && rec_oop.final_step != '') ? rec_oop.final_step.id : 0;
        rec_oop.frequency_ids = (rec_oop.frequency_id != undefined && rec_oop.frequency_id != '') ? rec_oop.frequency_id.id : 0;

        //$scope.rec_oop.recfrequeny;

        if (angular.element('#equalSpread').is(':checked') == false)
            rec_oop.equalSpreads = 0;

        if ((detail.start_date != undefined && detail.start_date.length > 0) && 
            (detail.end_date != undefined && detail.end_date.length > 0)) {

            // var start_date          = $scope.convertToDateObject(detail.start_date);
            // var end_date            = $scope.convertToDateObject(detail.end_date);
            // var expected_close_date = $scope.convertToDateObject(detail.expected_close_date);

            var start_date_parts = detail.start_date.trim().split('/');
            var end_date_parts = detail.end_date.trim().split('/');

            $scope.rec.prev_start_date = start_date_parts[0].toString() + '/' + start_date_parts[1].toString() + '/' + (start_date_parts[2] - 1).toString();
            $scope.rec.prev_end_date = end_date_parts[0].toString() + '/' + end_date_parts[1].toString() + '/' + (end_date_parts[2] - 1).toString();

            var d_start_date = new Date(start_date_parts[2], start_date_parts[1] - 1, start_date_parts[0]);
            var d_end_date = new Date(end_date_parts[2], end_date_parts[1] - 1, end_date_parts[0]);

            if (d_start_date > d_end_date) {
                toaster.pop('warning', 'Warning', 'Stage End Date must be later than Stage Start Date!');
                $scope.detail.end_date = null;
                $scope.showLoader = false;
                return false;
            }
        }

        if ((detail.expected_close_date != undefined && detail.expected_close_date.length > 0) && 
            (detail.end_date != undefined && detail.end_date.length > 0)) {

            var start_date_parts = detail.end_date.trim().split('/');
            var end_date_parts = detail.expected_close_date.trim().split('/');

            $scope.rec.prev_start_date = start_date_parts[0].toString() + '/' + start_date_parts[1].toString() + '/' + (start_date_parts[2] - 1).toString();
            $scope.rec.prev_end_date = end_date_parts[0].toString() + '/' + end_date_parts[1].toString() + '/' + (end_date_parts[2] - 1).toString();

            var d_start_date = new Date(start_date_parts[2], start_date_parts[1] - 1, start_date_parts[0]);
            var d_end_date = new Date(end_date_parts[2], end_date_parts[1] - 1, end_date_parts[0]);

            if (d_start_date > d_end_date) {
                toaster.pop('warning', 'Warning', 'Expected Deal Close Date must be later than Stage End Date!');
                $scope.detail.expected_close_date = null;
                $scope.showLoader = false;
                return false;
            }
        }



        // if (expected_close_date && expected_close_date <= end_date) {
        //     toaster.pop('warning', 'Warning', 'Expected Deal Close Date must be later than Stage End Date!');
        //     $scope.detail.expected_close_date = null;
        //     $scope.showLoader = false;
        //     return false;
        // }

        if ((rec_oop.contact_person_1 == -1) || (rec_oop.contact_person_2 == -1) || (rec_oop.contact_person_3 == -1)) {
            toaster.pop('error', 'info', 'Contact Person  Sholud Not be Add new ');
            $scope.showLoader = false;
            return false;
        }

        if ((rec_oop.contact_person_1 !== 0) && (rec_oop.contact_person_3 !== 0)) {

            if ((rec_oop.contact_person_1 == rec_oop.contact_person_3)) {
                toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(246, ['Contact Person 1']));
                $scope.showLoader = false;
                return false;
            }
        }

        if ((rec_oop.contact_person_2 !== 0) && (rec_oop.contact_person_1 !== 0)) {

            if ((rec_oop.contact_person_1 == rec_oop.contact_person_2)) {
                toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(246, ['Contact Person 2']));
                $scope.showLoader = false;
                return false;
            }
        }

        if ((rec_oop.contact_person_2 !== 0) && (rec_oop.contact_person_3 !== 0)) {

            if ((rec_oop.contact_person_2 == rec_oop.contact_person_3)) {
                toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(246, ['Contact Person 3']));
                $scope.showLoader = false;
                return false;
            }
        }

        if ($scope.selectedSpOopCycle.length > 0)
            rec_oop.salespersons = $scope.selectedSpOopCycle;

        if ($scope.selectedsupportstaff.length > 0)
            rec_oop.salespersons_support = $scope.selectedsupportstaff;


        rec_oop.crm_id = $stateParams.id; //$scope.$root.crm_id;
        rec_oop.token = $scope.$root.token;

        var addCycleUrl = '';
        var addDetailCycleUrl = '';

        if ($scope.stage_record_id == 0) {

            addCycleUrl = $scope.$root.sales + "crm/crm/add-crm-opportunity-cycle";
            var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
            var name = $scope.$root.base64_encode('crm_opportunity_cycle_main');

        } else if (rec_oop.id > 0 && $scope.stage_record_id > 0 && $scope.stage_change == 0) {

            addDetailCycleUrl = $scope.$root.sales + "crm/crm/update-crm-opportunity-cycle-details";
            $scope.add_opportunity_cycle_child(addDetailCycleUrl, rec_oop, detail);

        } else if ($scope.stage_change == 1) {

            addDetailCycleUrl = $scope.$root.sales + "crm/crm/add-crm-opportunity-cycle-details";
            $scope.add_opportunity_cycle_child(addDetailCycleUrl, rec_oop, detail);
        }

        if (addCycleUrl != '') {

            rec_oop.did = detail.id;
            rec_oop.probability = detail.probability;
            rec_oop.end_date = detail.end_date;
            rec_oop.start_date = detail.start_date;
            rec_oop.expected_close_date = detail.expected_close_date;
            rec_oop.is_complete = $scope.rec_oop.is_complete;
            rec_oop.crm_opportunity_cycle_id = $scope.stage_record_id;
            //rec_oop.parent_id = $scope.stage_record_id;

            $http.post(getCodeUrl, {
                'token': $scope.$root.token,
                'tb': name,
                'opp_cycle_limit': $scope.$root.opp_cycle_limit,
                'crm_id': $stateParams.id

            }).then(function (autocode) {

                if (autocode.data.ack == 1) {

                    $scope.rec_oop.oop_code = autocode.data.code;
                    rec_oop.oop_code = autocode.data.code;

                    $http
                        .post(addCycleUrl, rec_oop)
                        .then(function (res1) {

                            var crm_opportunity_cycle_id = '';
                            if ((res1.data.ack) == true) { //&& res1.data.edit == false

                                if ($scope.stage_record_id == 0) {
                                    crm_opportunity_cycle_id = res1.data.id;
                                    $scope.rec_oop.id = res1.data.id;

                                    if (!crm_opportunity_cycle_id)
                                        crm_opportunity_cycle_id = rec_oop.id;

                                    /*console.log(res1.data);
                                     console.log($scope.selectedSpOopCycle);*/

                                    $scope.$root.opp_cycle_id = crm_opportunity_cycle_id;
                                    detail.crm_opportunity_cycle_id = crm_opportunity_cycle_id;
                                    $scope.rec_oop.is_complete = $scope.is_complete;
                                    detail.complete_date = $scope.complete_data;
                                    detail.token = $scope.$root.token;
                                    detail.type = $scope.type;
                                    $scope.stage_record_id = crm_opportunity_cycle_id;

                                    $scope.rec_oop.stagesStatus = res1.data.stagesStatus.response;

                                    // console.log($scope.rec_oop.stage_id.id);

                                    angular.forEach($scope.arr_tabs, function (elem) {
                                        if (elem.id == $scope.rec_oop.stage_id.id)
                                            elem.activestagestatus = 1;
                                        else
                                            elem.activestagestatus = 0;
                                    });

                                    var stageCounter = 0;
                                    var lastStageCounter = 0;

                                    if ($scope.rec_oop.stagesStatus != undefined)
                                        var intializeStagesNo = $scope.rec_oop.stagesStatus.length;

                                    angular.forEach($scope.arr_tabs, function (elem) {

                                        if (elem.stagestatus != 1 && stageCounter < intializeStagesNo)
                                            elem.stagestatus = 4;

                                        angular.forEach($scope.rec_oop.stagesStatus, function (obj) {

                                            if (elem.stagestatus == undefined || elem.stagestatus == 2 || elem.stagestatus == 4) {

                                                if (elem.id == obj.stage_id && obj.is_complete == 1) {
                                                    elem.stagestatus = 1;
                                                    lastStageCounter = stageCounter + 1;

                                                } else if (elem.id == obj.stage_id && obj.activeRec == 1 && obj.is_complete == 0) {
                                                    elem.stagestatus = 2;
                                                    lastStageCounter = stageCounter + 1;
                                                }
                                            }

                                            if (obj.is_complete == 1)
                                                $scope.check_readonly_opp_name = true;
                                        });

                                        stageCounter++;
                                    });

                                    var activeStageCounter = 0;

                                    angular.forEach($scope.arr_tabs, function (elem) {

                                        if (parseInt(activeStageCounter) < parseInt(lastStageCounter) && elem.stagestatus == undefined) {
                                            elem.stagestatus = 4;
                                        }
                                        activeStageCounter++;
                                    });

                                    if (res1.data.edit == true) {
                                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                                    } else if (res1.data.id > 0 && res1.data.child > 0) {

                                        $scope.detail.id = res1.data.id;
                                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                                    }
                                }

                                $scope.check_readonly_opp = true;
                                $scope.checkCompleteOpp = 1;
                                $scope.stage_change = 0;
                            }
                            // $scope.check_readonly_opp_name = true;

                            $scope.checkReadonlyOppParentName = true;

                        }).catch(function (message) {
                            $scope.showLoader = false;

                            throw new Error(message.data);
                            console.log(message.data);
                        });
                }


                $scope.showLoader = false;

            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
        }
    }

    $scope.add_opportunity_cycle_child = function (addDetailCycleUrl, rec_oop, detail) {

        if ($scope.stage_record_id > 0 && $scope.$root.opp_cycle_id > 0) {
            var salesperson_opp = [];
            var salesperson_support = [];
            rec_oop.did = detail.id;
            rec_oop.probability = detail.probability;
            rec_oop.end_date = detail.end_date;
            rec_oop.start_date = detail.start_date;
            rec_oop.expected_close_date = detail.expected_close_date;
            rec_oop.is_complete = $scope.rec_oop.is_complete;
            rec_oop.crm_opportunity_cycle_id = $scope.stage_record_id;
            rec_oop.crm_id = $stateParams.id;
            // rec_oop.parent_id = $scope.stage_record_id;


            $scope.showLoader = true;


            /* if ($scope.selectedSalespersons.length > 0)
               rec_oop.salespersons = $scope.selectedSalespersons; */


            /* if ($scope.isSalespersonstaff)
             rec_oop.salespersons_support = $scope.selectedsupport_salespeson_oop; */


            $http
                .post(addDetailCycleUrl, rec_oop)
                .then(function (res2) {
                    //$scope.resetForm(rec_oop,detail);
                    $scope.rec_oop.is_complete = $scope.is_complete;
                    if (res2.data.ack == true || $scope.isSalespersonUpdated || $scope.isSalespersonstaff) {


                        if (res2.data.edit == true) {
                            toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));

                            $scope.rec_oop.stagesStatus = res2.data.stagesStatus.response;

                            // console.log(res.data.response.stage_id);

                            angular.forEach($scope.arr_tabs, function (elem) {
                                if (elem.id == res.data.response.stage_id)
                                    elem.activestagestatus = 1;
                                else
                                    elem.activestagestatus = 0;
                            });

                            var stageCounter = 0;
                            var lastStageCounter = 0;

                            if ($scope.rec_oop.stagesStatus != undefined)
                                var intializeStagesNo = $scope.rec_oop.stagesStatus.length;

                            angular.forEach($scope.arr_tabs, function (elem) {

                                if (elem.stagestatus != 1 && stageCounter < intializeStagesNo)
                                    elem.stagestatus = 4;

                                angular.forEach($scope.rec_oop.stagesStatus, function (obj) {

                                    if (elem.stagestatus == undefined || elem.stagestatus == 2 || elem.stagestatus == 4) {

                                        if (elem.id == obj.stage_id && obj.is_complete == 1) {
                                            elem.stagestatus = 1;
                                            lastStageCounter = stageCounter + 1;

                                        } else if (elem.id == obj.stage_id && obj.activeRec == 1 && obj.is_complete == 0) {
                                            elem.stagestatus = 2;
                                            lastStageCounter = stageCounter + 1;
                                        }
                                    }

                                    if (obj.is_complete == 1)
                                        $scope.check_readonly_opp_name = true;
                                });

                                stageCounter++;
                            });

                            var activeStageCounter = 0;

                            angular.forEach($scope.arr_tabs, function (elem) {

                                if (parseInt(activeStageCounter) < parseInt(lastStageCounter) && elem.stagestatus == undefined) {
                                    elem.stagestatus = 4;
                                }
                                activeStageCounter++;
                            });


                        } else {
                            if (res2.data.id > 0)
                                $scope.detail.id = res2.data.id;
                            toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

                            $scope.rec_oop.stagesStatus = res2.data.stagesStatus.response;

                            // console.log($scope.rec_oop.stage_id.id);

                            angular.forEach($scope.arr_tabs, function (elem) {
                                if (elem.id == $scope.rec_oop.stage_id.id)
                                    elem.activestagestatus = 1;
                                else
                                    elem.activestagestatus = 0;
                            });

                            var stageCounter = 0;
                            var lastStageCounter = 0;

                            if ($scope.rec_oop.stagesStatus != undefined)
                                var intializeStagesNo = $scope.rec_oop.stagesStatus.length;

                            angular.forEach($scope.arr_tabs, function (elem) {

                                if (elem.stagestatus != 1 && stageCounter < intializeStagesNo)
                                    elem.stagestatus = 4;

                                angular.forEach($scope.rec_oop.stagesStatus, function (obj) {

                                    if (elem.stagestatus == undefined || elem.stagestatus == 2 || elem.stagestatus == 4) {

                                        if (elem.id == obj.stage_id && obj.is_complete == 1) {
                                            elem.stagestatus = 1;
                                            lastStageCounter = stageCounter + 1;

                                        } else if (elem.id == obj.stage_id && obj.activeRec == 1 && obj.is_complete == 0) {
                                            elem.stagestatus = 2;
                                            lastStageCounter = stageCounter + 1;
                                        }
                                    }

                                    if (obj.is_complete == 1)
                                        $scope.check_readonly_opp_name = true;
                                });

                                stageCounter++;
                            });

                            var activeStageCounter = 0;

                            angular.forEach($scope.arr_tabs, function (elem) {

                                if (parseInt(activeStageCounter) < parseInt(lastStageCounter) && elem.stagestatus == undefined) {
                                    elem.stagestatus = 4;
                                }
                                activeStageCounter++;
                            });
                        }

                        // $scope.add_sale_opp_history($scope.detail.id, detail.crm_opportunity_cycle_id, detail.tab_id);

                        //$scope.$root.$broadcast("myOpportunityCycleEventReload", args);
                        $scope.detail.temp_start_date = $filter('date')(detail.end_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
                        $scope.detail.temp_close_date = $filter('date')(detail.expected_close_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);

                        $scope.showcomentbeforedoc = true;

                        /* if ($scope.selectedSpOopCycle.length > 0) {

                            $scope.addSalePersonsOopCycle(res2.data.id, rec_oop, 2);
                            $scope.addSupportStaffOopCycle(res2.data.id, rec_oop, 2);
                            // $scope.addSalePersonsOopCycleHistory(res2.data.id, rec_oop);
                        } */
                        $scope.checkCompleteOpp = 1;
                        $scope.check_readonly_opp = true;
                        $scope.check_readonly_oppStage = true;
                        $scope.stage_change = 0;

                    } else {
                        if (res2.data.edit == true)
                            toaster.pop('error', 'Edit', res2.data.error);//$scope.$root.getErrorMessageByCode(106)
                        else
                            toaster.pop('error', 'Add', res2.data.error);//$scope.$root.getErrorMessageByCode(104)

                        if (res2.data.error == 'Record Updated Successfully') {
                            $scope.check_readonly_opp = true;
                            $scope.check_readonly_oppStage = true;
                        }
                    }

                    $scope.showLoader = false;
                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
                });
        }

    }
    $scope.showOppCycleEditForm = function () {
        $scope.NEW_FREQUENCY = false;
        $scope.check_readonly_opp = false;
    }

    $scope.check_readonly_oppStage = true;
    $scope.check_readonly_oppStageedit_btn = true;

    $scope.showOppCyclestageactiveForm = function () {
        $scope.check_readonly_oppStage = false;
        $scope.check_readonly_oppStageedit_btn = false;
        
    }



    $scope.delete_oop = function (id) {

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            var delUrl = $scope.$root.sales + "crm/crm/delete-crm-opportunity-cycle";
            $http
                .post(delUrl, {
                    id: id,
                    'token': $scope.$root.token,
                    'crm_id': $stateParams.id
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () {
                            $scope.getOpportunityCycle();
                        }, 1500)
                    } else
                        toaster.pop('error', 'Deleted', 'Record cannot be deleted!');
                });
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    };


    $scope.convertToDateObject = function (str_date) {

        if (!str_date)
            return;
        ////console.log(isNaN(Date.parse(str_date)));

        if (str_date && /\/.*\//.test(str_date)) {
            var s = str_date.split('/');
            if (s[2] == undefined) {
                var strDate = $rootScope.convert_unix_date_to_angular(str_date);
                var s = strDate.split('/');
                var dateObj = new Date(Number(s[2]), Number(s[1]) - 1, Number(s[0]));
            } else {
                var dateObj = new Date(Number(s[2]), Number(s[1]) - 1, Number(s[0]));
            }
        } else {
            var dateObj = new Date(str_date);
            //var dateObj = str_date;
            dateObj.setHours('00');
        }

        /*//console.log(str_date);
         //console.log(dateObj);
         //console.log('-------------');*/
        return dateObj;
    }

    $scope.starteDate = function (startDate) {
        var newdate = startDate;
        $scope.newD = $scope.newD ? null : newdate;
        //$filter('date')(newdate, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
        $scope.starteDate = false;
    }

    $scope.resetForm_oop = function (rec_oop, detail) {
        $scope.rec_oop = {};
        $scope.detail = {};
    }

    $scope.arr_roles1 = [];
    $scope.arr_roles2 = [];
    $scope.arr_roles3 = [];
    $scope.arr_testroles = [];

    $scope.checkCompleteOpp = 0;
    $scope.LoadOppCycleData = function (arr, mode) {

        var crm_opportunity_cycle_id = arr.id;

        // if (crm_opportunity_cycle_id > 0)
        $scope.selct_from_oop = true;

        //  $scope.getSalePersons(1);
        // $scope.getSalePerson_oop(1);
        //$scope.getsupport_salespeson_oop_cycle_staff(1);

        $scope.tabsDetil = {};

        $scope.stage_record_id = crm_opportunity_cycle_id;

        if (crm_opportunity_cycle_id == undefined || $scope.stage_record_id == undefined)
            return;
        else {
            // console.log(arr);

            tab_id_number = arr.stage_id;
            $scope.showLoader = true;

            $scope.EnableSpread = false;

            $scope.rec_oop = {};
            $scope.recFrequency = {};
            $scope.recFrequency.monthlySpreadArr = {};
            $scope.detail = {};
            $scope.coment_data = {};
            var oppUrl = $scope.$root.sales + "crm/crm/get-crm-opportunity-cycle";

            $http
                .post(oppUrl, {
                    'id': crm_opportunity_cycle_id,
                    'token': $scope.$root.token,
                    'crm_id': $stateParams.id,
                    'tab_id': arr.stage_id,
                    'child_id': arr.child_id,
                    'status': 1
                })
                .then(function (res) {
                    $scope.showLoader = false;

                    $scope.selectedSpOopCycle = [];
                    $scope.selectedsupportstaff = [];

                    $scope.allStagesCompleted = false;

                    if (res.data.ack == true) {

                        // console.log(res.data.response);
                        $scope.checkCompleteOpp = 1;

                        if (Number(res.data.response.is_complete) == 1) {
                            $scope.check_readonly_opp = true;
                            $scope.checkReadonlyOppParentName = false;
                        } else {
                            $scope.check_readonly_opp_name = false;
                            // $scope.check_readonly_opp = false;
                            $scope.checkReadonlyOppParentName = true;

                            if (mode == 1)
                                $scope.check_readonly_opp = true;
                            else if (mode == 0)
                                $scope.check_readonly_opp = false;
                        }

                        $scope.rec_oop.is_complete = res.data.response.is_complete;

                        $scope.rec_oop.crm_opportunity_cycle_id = res.data.response.crm_opportunity_cycle_id;
                        // $scope.rec_oop.parent_id = res.data.response.parent_id;
                        // $scope.rec_oop.subject = res.data.response.subject;
                        $scope.rec_oop.name = res.data.response.name;
                        $scope.rec_oop.forecast_amount = parseFloat(res.data.response.forecast_amount);
                        $scope.rec_oop.convert_amount = parseFloat(res.data.response.convert_amount);
                        $scope.rec_oop.date_added = res.data.response.date_added;


                        $scope.rec_oop.id = res.data.response.id;
                        $scope.rec_oop.oop_code = res.data.response.oop_code;
                        $scope.rec_oop.notes = res.data.response.notes;

                        if (res.data.response.frequencyID) {
                            $scope.rec_oop.frequency_id = $rootScope.get_obj_frm_arry($scope.arrFrequency, res.data.response.frequencyID);
                        }

                        $scope.recFrequency.dbFrequencyID = res.data.response.frequencyID;


                        $scope.recFrequency.equalSpread = res.data.response.equalSpread;

                        $scope.recFrequency.monthlySpreadArr.January = parseFloat(res.data.response.freqJanuary);
                        $scope.recFrequency.monthlySpreadArr.February = parseFloat(res.data.response.freqFebruary);
                        $scope.recFrequency.monthlySpreadArr.March = parseFloat(res.data.response.freqMarch);
                        $scope.recFrequency.monthlySpreadArr.April = parseFloat(res.data.response.freqApril);

                        $scope.recFrequency.monthlySpreadArr.May = parseFloat(res.data.response.freqMay);
                        $scope.recFrequency.monthlySpreadArr.June = parseFloat(res.data.response.freqJune);
                        $scope.recFrequency.monthlySpreadArr.July = parseFloat(res.data.response.freqJuly);
                        $scope.recFrequency.monthlySpreadArr.August = parseFloat(res.data.response.freqAugust);

                        $scope.recFrequency.monthlySpreadArr.September = parseFloat(res.data.response.freqSeptember);
                        $scope.recFrequency.monthlySpreadArr.October = parseFloat(res.data.response.freqOctober);
                        $scope.recFrequency.monthlySpreadArr.November = parseFloat(res.data.response.freqNovember);
                        $scope.recFrequency.monthlySpreadArr.December = parseFloat(res.data.response.freqDecember);

                        $scope.recFrequency.startmonths = res.data.response.freqStartmonth;
                        if (res.data.response.freqStartmonth != "0") {
                            $scope.recFrequency.startmonth = $rootScope.get_obj_frm_arry($scope.startMonthArr, res.data.response.freqStartmonth);
                        } else {

                            if(res.data.response.job_titles && res.data.response.job_titles.oppCycleFreqstartmonth >0){

                                $scope.recFrequency.startmonth = $rootScope.get_obj_frm_arry($scope.startMonthArr, res.data.response.job_titles.oppCycleFreqstartmonth);
                            }

                            // $scope.recFrequency.startmonth = $rootScope.get_obj_frm_arry($scope.startMonthArr, $rootScope.oppCycleFreqstartmonth);
                        }
                        $scope.start_month = $scope.recFrequency.startmonth.id;

                        $scope.recFrequency.firstquartermonth = parseFloat(res.data.response.freqFirstQuartermonth);
                        $scope.recFrequency.secondquartermonth = parseFloat(res.data.response.freqSecondQuartermonth);
                        $scope.recFrequency.thirdquartermonth = parseFloat(res.data.response.freqThirdQuartermonth);

                        //console.log($scope.recFrequency);
                        if ($scope.recFrequency.monthlySpreadArr.January != 0 || $scope.recFrequency.monthlySpreadArr.February != 0 || $scope.recFrequency.monthlySpreadArr.March != 0 ||
                            $scope.recFrequency.monthlySpreadArr.April != 0 || $scope.recFrequency.monthlySpreadArr.May != 0 || $scope.recFrequency.monthlySpreadArr.June != 0 ||
                            $scope.recFrequency.monthlySpreadArr.July != 0 || $scope.recFrequency.monthlySpreadArr.August != 0 || $scope.recFrequency.monthlySpreadArr.September != 0 ||
                            $scope.recFrequency.monthlySpreadArr.October != 0 || $scope.recFrequency.monthlySpreadArr.November != 0 || $scope.recFrequency.monthlySpreadArr.December != 0 ||
                            $scope.recFrequency.firstquartermonth != 0 || $scope.recFrequency.secondquartermonth != 0 || $scope.recFrequency.thirdquartermonth != 0) {

                            $scope.EnableSpread = true;
                        }

                        $scope.rec_oop.recfrequeny = $scope.recFrequency;


                        $scope.arr_alt_contacts = res.data.response.alt_contacts.response;
                        $scope.arr_process_of_decision = res.data.response.process_of_decission.response;

                        /*if ($scope.user_type == 1)
                             $scope.arr_process_of_decision.push({
                                'id': '-1',
                                'name': '++ Add New ++'
                            }); */


                        $scope.arr_roles1 = [];
                        $scope.arr_roles2 = [];
                        $scope.arr_roles3 = [];
                        $scope.arr_testroles = {};
                        $scope.arr_testroles = res.data.response.job_titles.response;

                        $scope.arr_roles1 = $scope.arr_testroles;
                        $scope.arr_roles2 = $scope.arr_testroles;
                        $scope.arr_roles3 = $scope.arr_testroles;

                        // $scope.rec_oop = res.data.response;

                        // $scope.wordsLength = res.data.response.description.length;
                        if (res.data.response.process_of_decision) {
                            $scope.rec_oop.process_of_decisions = $rootScope.get_obj_frm_arry($scope.arr_process_of_decision, res.data.response.process_of_decision);
                        }


                        $scope.generalSalesPersonArr = res.data.response.crmsaleperson.response;
                        if (res.data.response.crmsaleperson.response != "") {
                            if (res.data.response.saleperson.response != "") {

                                angular.forEach(res.data.response.crmsaleperson.response, function (obj) {

                                    obj.chk = false;
                                    obj.isPrimary = false;

                                    angular.forEach(res.data.response.saleperson.response, function (obj2) {

                                        if (obj.id == obj2.salesperson_id) {
                                            obj.chk = true;
                                            if (obj2.is_primary == 1)
                                                obj.isPrimary = true;
                                            $scope.selectedSpOopCycle.push(obj);
                                        }

                                    });
                                    //  $scope.salepersons.push(obj);
                                });
                            }
                        }


                        if (res.data.response.employees.response != "") {
                            if (res.data.response.supportperson.response != "") {

                                angular.forEach(res.data.response.employees.response, function (obj) {

                                    obj.chk = false;

                                    angular.forEach(res.data.response.supportperson.response, function (obj2) {

                                        if (obj.id == obj2.employee_id) {
                                            obj.chk = true;
                                            $scope.selectedsupportstaff.push(obj);
                                        }

                                    });
                                });
                            }
                        }

                        if (res.data.response.final_step)
                            $scope.rec_oop.final_step = $rootScope.get_obj_frm_arry($scope.arr_tabspostion, res.data.response.final_step);


                        if (res.data.response.contact_person_1) {
                            angular.forEach($scope.arr_alt_contacts, function (elem) {
                                if (res.data.response.contact_person_1 == elem.id)
                                    $scope.rec_oop.contact_person_one = elem;

                                if (res.data.response.contact_person_2 == elem.id)
                                    $scope.rec_oop.contact_person_two = elem;

                                if (res.data.response.contact_person_3 == elem.id)
                                    $scope.rec_oop.contact_person_three = elem;
                            });
                        }

                        if (res.data.response.role_1) {
                            angular.forEach($scope.arr_roles1, function (elem) {
                                if (res.data.response.role_1 == elem.id)
                                    $scope.rec_oop.role_one = elem;
                                if (res.data.response.role_2 == elem.id)
                                    $scope.rec_oop.role_two = elem;
                                if (res.data.response.role_3 == elem.id)
                                    $scope.rec_oop.role_three = elem;
                            });
                        }

                        if (res.data.response.currency_id)
                            $scope.rec_oop.currency_id = $rootScope.get_obj_frm_arry($rootScope.arr_currency, res.data.response.currency_id);

                        $scope.arr_tabs = res.data.response.stages.response;                      


                        if (res.data.response.tabsDetail.response.length > 0 && res.data.response.tabsDetail.response != undefined) {
                            $scope.tabsDetil = res.data.response.tabsDetail.response;
                            if ($scope.arr_tabs.length > 0) {
                                angular.forEach($scope.tabsDetil, function (obj) {
                                    angular.forEach($scope.arr_tabs, function (obj2) {
                                        if (obj.stagename == obj2.name) {
                                            obj.stageNumber = obj2.stage_number;
                                        }
                                    });
                                });
                            }
                        }
                        $scope.rec_oop.stagesStatus = res.data.response.stagesStatus.response;

                        var lastStageID = $scope.arr_tabs[$scope.arr_tabs.length -1].id;

                        angular.forEach($scope.rec_oop.stagesStatus,function(obj){
                            if (obj.stage_id == lastStageID && obj.is_complete == 1){
                                $scope.allStagesCompleted = true;
                                $scope.check_readonly_opp = true;
                            }
                        });

                        var stageCounter = 0;
                        var stageActiveCounter = 0;
                        var lastStageCounter = 0;

                        if ($scope.rec_oop.stagesStatus != undefined)
                            var intializeStagesNo = $scope.rec_oop.stagesStatus.length;

                        angular.forEach($scope.arr_tabs, function (elem) {

                            if (elem.stagestatus != 1 && stageCounter < intializeStagesNo)
                                elem.stagestatus = 4;

                            angular.forEach($scope.rec_oop.stagesStatus, function (obj) {

                                if (elem.stagestatus == undefined || elem.stagestatus == 2 || elem.stagestatus == 4) {

                                    if (elem.id == obj.stage_id && obj.is_complete == 1) {
                                        elem.stagestatus = 1;
                                        lastStageCounter = stageCounter + 1;

                                    } else if (elem.id == obj.stage_id && obj.activeRec == 1 && obj.is_complete == 0) {
                                        elem.stagestatus = 2;
                                        lastStageCounter = stageCounter + 1;
                                    }
                                }

                                if (obj.is_complete == 1)
                                    $scope.check_readonly_opp_name = true;
                            });
                            stageCounter++;

                            if (elem.stagestatus > 0)
                                stageActiveCounter++;
                        });

                        //$scope.arr_alt_contacts.push(elem);
                        // $scope.rec_oop.current_status = $scope.type = res.data.response.tab_id; //.id;
                        $scope.rec_oop.stage_id = $scope.type = res.data.response.tab_id; //.id;
                        $scope.detail.probability = res.data.response.percentage_stage;
                        //$scope.detail = {};
                        // $scope.detail = res.data.response;
                        // $scope.detail.id = res.data.response.probability;
                        /*$scope.detail.start_date = $scope.$root.convert_numeric_date_to_string(res.data.response.start_date);
                         $scope.detail.end_date = $scope.$root.convert_numeric_date_to_string(res.data.response.end_date);
                         $scope.detail.expected_close_date = $scope.$root.convert_numeric_date_to_string(res.data.response.expected_close_date);*/

                        $scope.detail.start_date = res.data.response.start_date;
                        $scope.detail.end_date = res.data.response.end_date;
                        $scope.detail.expected_close_date = res.data.response.expected_close_date;

                        $scope.detail.temp_start_date = $scope.detail.end_date;
                        $scope.detail.temp_close_date = $scope.detail.expected_close_date;

                        if (res.data.response.is_complete)
                            $scope.btn_complete = true;

                        $scope.detail.id = res.data.response.id;

                        if (Number(res.data.response.stage_change) == 0) {
                            $scope.stage_change = 0;

                            //$scope.rec_oop.current_status = $scope.stage_data = $rootScope.get_obj_frm_arry($scope.arr_tabs, res.data.response.current_status);
                            $scope.rec_oop.stage_id = $scope.stage_data = $rootScope.get_obj_frm_arry($scope.arr_tabs, res.data.response.stage_id);

                        } else
                            $scope.stage_change = 1;

                        /*if (Number(res.data.response.stage_change) == 0)
                         $scope.rec_oop.current_status = recstage;*/

                        if (Number(res.data.response.probability) > 0)
                            $scope.detail.probability = res.data.response.probability;
                        /*else
                         $scope.detail.probability = recstage.percentage;*/

                        var activeStageCounter = 0;
                        var stageInitialize = 0;

                        if ($scope.arr_tabs[stageActiveCounter] != undefined && $scope.arr_tabs[stageActiveCounter].id != undefined) {

                            // console.log($scope.arr_tabs[stageActiveCounter - 1]);
                            // console.log($scope.arr_tabs[stageActiveCounter]);

                            angular.forEach($scope.arr_tabs, function (elem) {
                                if (elem.stagestatus == 2) {
                                    elem.activestagestatus = 1;
                                    stageInitialize = 1;
                                    $scope.set_stage_change(elem.id, res.data.response.crm_opportunity_cycle_id, mode);
                                }
                                else if (elem.id == $scope.arr_tabs[stageActiveCounter].id && stageInitialize == 0) {
                                    elem.activestagestatus = 1;
                                    $scope.set_stage_change($scope.arr_tabs[stageActiveCounter].id, res.data.response.crm_opportunity_cycle_id, mode);
                                }
                                else
                                    elem.activestagestatus = 0;

                                if (parseInt(activeStageCounter) < parseInt(lastStageCounter) && elem.stagestatus == undefined) {
                                    elem.stagestatus = 4;
                                }
                                activeStageCounter++;
                            });

                        }
                    }
                    else {
                        if (mode == 1)
                            $scope.check_readonly_opp = true;
                        else if (mode == 0)
                            $scope.check_readonly_opp = false;
                    }
                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
                });
        }
    }

    $scope.check_readonly_opp = false;
    //OOP cycle tab salesperson start

    $scope.selectedSpOopCycle = [];

    $scope.handleKeyPress = function (ev, param) {
        if (ev.key == " ") {
            if (param == 1)
                $scope.getSalePersonsOopCycle();
            else if (param == 2)
                $scope.getSupportStaffOopCycle();

            ev.preventDefault();
        }
    }

    $scope.getSalePersonsOopCycle = function () { //isShow
        $scope.title = 'Salesperson';

        $scope.columnsOopCycle = [];
        $scope.recordOopCycle = [];
        $scope.salepersonsOopCycle = [];
        $scope.PendingSelectedSpOopCycle = [];
        $scope.searchKeyword_SalePersons = {};

        console.log($scope.selectedSpOopCycle);
        if ($scope.generalSalesPersonArr.length > 0) {
            angular.forEach($scope.generalSalesPersonArr, function (obj) {

                obj.chk = false;
                obj.isPrimary = false;

                // if ($scope.selectedSpOopCycle != undefined) {
                if ($scope.selectedSpOopCycle.length > 0) {

                    angular.forEach($scope.selectedSpOopCycle, function (obj2) {
                        if (obj.id == obj2.id) { //|| $scope.selct_from_oop
                            obj.chk = true;

                            if (obj2.is_primary)
                                obj.isPrimary = true;
                        }
                    });
                }
                // }
                $scope.salepersonsOopCycle.push(obj);
            });

            $scope.recordOopCycle = $scope.salepersonsOopCycle;
            // $scope.PendingSelectedSpOopCycle = $scope.selectedSpOopCycle;

            angular.forEach($scope.generalSalesPersonArr[0], function (val, index) {
                if (index != 'chk' && index != 'id') {
                    $scope.columnsOopCycle.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                }
            });
            angular.element('#salesPersonOopCycleModal').modal({
                show: true
            });
        } else
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(339));

        /* 
                var GenSalePersonUrl = $scope.$root.sales + "crm/crm/get-crm-salesperson-ForOppCycle";
        
                var GenSalePersonPostData = {
                    'id': $stateParams.id,
                    'type': 2,
                    'token': $scope.$root.token
                };
        
                $http
                    .post(GenSalePersonUrl, GenSalePersonPostData)
                    .then(function (emp_data) {
                        if (emp_data.data.ack == true) {
        
                            angular.forEach(emp_data.data.response, function (obj) {
        
                                obj.chk = false;
                                obj.isPrimary = false;
        
                                // if ($scope.selectedSpOopCycle != undefined) {
                                if ($scope.selectedSpOopCycle.length > 0) {
        
                                    angular.forEach($scope.selectedSpOopCycle, function (obj2) {
                                        if (obj.id == obj2.id) { //|| $scope.selct_from_oop
                                            obj.chk = true;
        
                                            if (obj2.isPrimary)
                                                obj.isPrimary = true;
                                        }
                                    });
                                }
                                // }
                                $scope.salepersonsOopCycle.push(obj);
                            });
        
                            $scope.recordOopCycle = $scope.salepersonsOopCycle;
                            // $scope.PendingSelectedSpOopCycle = $scope.selectedSpOopCycle;
        
                            angular.forEach(emp_data.data.response[0], function (val, index) {
                                if (index != 'chk' && index != 'id') {
                                    $scope.columnsOopCycle.push({
                                        'title': toTitleCase(index),
                                        'field': index,
                                        'visible': true
                                    });
                                }
                            });
                            angular.element('#salesPersonOopCycleModal').modal({
                                show: true
                            });
                        } else
                            toaster.pop('error', 'Info', 'No Salepersons is Assigned to this CRM.');
                    }); */
    }


    $scope.PendingSelectedSpOopCycle = [];

    $scope.selectSalepersonOopCycle = function (sp, isPrimary) {
        $scope.isSalePerersonChanged = true;
        $scope.selectedAll = false;

        // console.log($scope.selectedSpOopCycle);

        //$scope.PendingSelectedSpOopCycle = $scope.selectedSpOopCycle;

        for (var i = 0; i < $scope.salepersonsOopCycle.length; i++) {

            if (isPrimary == 1)
                $scope.salepersonsOopCycle[i].isPrimary = false;

            if (sp.id == $scope.salepersonsOopCycle[i].id) {

                if ($scope.salepersonsOopCycle[i].chk == true && isPrimary == 0) {

                    $scope.salepersonsOopCycle[i].chk = false;
                    $scope.salepersonsOopCycle[i].isPrimary = false;

                } else { // || $scope.selectedSpOopCycle.length == 0
                    if (isPrimary == 1)
                        $scope.salepersonsOopCycle[i].isPrimary = true;

                    $scope.salepersonsOopCycle[i].chk = true;

                    /*if (isPrimary == 1 || $scope.selectedSpOopCycle.length == 0) {
     
                     var isExist = false;
                     $scope.salepersonsOopCycle[i].isPrimary = true;
     
                     angular.forEach($scope.PendingSelectedSpOopCycle, function (obj, indx) {
                     if (obj != undefined) {
                     $scope.PendingSelectedSpOopCycle[indx].isPrimary = false;
                     if (obj.id == sp.id) {
                     isExist = true;
                     $scope.PendingSelectedSpOopCycle[indx].isPrimary = true;
                     }
                     }
                     });
     
                     if (!isExist) {
                     $scope.salepersonsOopCycle[i].chk = true;
                     $scope.PendingSelectedSpOopCycle.push($scope.salepersonsOopCycle[i]);
                     }
     
                     } else {
                     $scope.salepersonsOopCycle[i].chk = true;
                     $scope.PendingSelectedSpOopCycle.push($scope.salepersonsOopCycle[i]);
                     }*/
                }
            }
        }
        //console.log($scope.PendingSelectedSpOopCycle);
    }

    $scope.submitPendingSelectedSpOopCycle = function () {

        $scope.PendingSelectedSpOopCycle2 = [];
        var isPrimary = false;

        for (var i = 0; i < $scope.salepersonsOopCycle.length; i++) {

            /*if ($scope.salepersonsOopCycle[i].isPrimary)
             isPrimary = true;*/

            if ($scope.salepersonsOopCycle[i].chk == true)
                $scope.PendingSelectedSpOopCycle2.push($scope.salepersonsOopCycle[i]);
        }

        //console.log($scope.PendingSelectedSpOopCycle2);

        $scope.selectedSpOopCycle = $scope.PendingSelectedSpOopCycle2;
        angular.element('#salesPersonOopCycleModal').modal('hide');
    }

    $scope.clearPendingSelectedSpOopCycle = function () {
        $scope.PendingSelectedSpOopCycle2 = [];
        angular.element('#salesPersonOopCycleModal').modal('hide');
    }

    $scope.checkAllSalespersonOopCycle = function (val) {
        $scope.PendingSelectedSpOopCycle = [];

        if (val == true) {
            $scope.isSalePerersonChanged = true;
            var isPrimary = false;

            for (var i = 0; i < $scope.salepersonsOopCycle.length; i++) {
                if ($scope.salepersonsOopCycle[i].isPrimary)
                    isPrimary = true;

                $scope.salepersonsOopCycle[i].chk = true;
                $scope.PendingSelectedSpOopCycle.push($scope.salepersonsOopCycle[i]);
            }

            if (!isPrimary) {
                $scope.salepersonsOopCycle[0].isPrimary = true;
                $scope.PendingSelectedSpOopCycle[0].isPrimary = true;
            }

        } else {
            for (var i = 0; i < $scope.salepersonsOopCycle.length; i++) {
                $scope.salepersonsOopCycle[i].chk = false;
                $scope.salepersonsOopCycle[i].isPrimary = false;
            }
            $scope.PendingSelectedSpOopCycle = [];
        }
    }


    $scope.addSalePersonsOopCycle = function (id, rec2, type) {
        var check = false;
        var excUrl = $scope.$root.sales + "crm/crm/add-opp-cycle-salesperson";
        var post = {};
        var temp = [];
        /*console.log(id);
         console.log(rec2);*/

        if (id == undefined)
            id = rec2.id;

        angular.forEach($scope.selectedSpOopCycle, function (obj) {
            if (obj.chk)
                temp.push({
                    id: obj.id,
                    isPrimary: obj.isPrimary
                });
        });

        post.type = type;
        // post.bucket_id = $scope.rec.bucket_id;
        post.id = id;
        post.salespersons = temp;
        post.token = $scope.$root.token;
        post.crm_id = rec2.crm_id;
        post.opp_cycle_id = rec2.crm_opportunity_cycle_id;
        //post.opp_cycle_id = rec2.parent_id;

        //console.log(post);
        $http
            .post(excUrl, post)
            .then(function (res) {
                if (res.data.ack == true) {
                    check = true;
                }
            });
        return check;
    }

    $scope.addSupportStaffOopCycle = function (id, rec2, type) {
        var check = false;
        var excUrl = $scope.$root.sales + "crm/crm/add-opp-cycle-SupportStaff";
        var post = {};
        var temp = [];
        /*console.log(id);
         console.log(rec2);*/

        if (id == undefined)
            id = rec2.id;

        angular.forEach($scope.selectedsupportstaff, function (obj) {
            if (obj.chk)
                temp.push({
                    id: obj.id,
                    isPrimary: 0
                });
        });

        post.type = type;
        // post.bucket_id = $scope.rec.bucket_id;
        post.id = id;
        post.supportstaff = temp;
        post.token = $scope.$root.token;
        post.crm_id = rec2.crm_id;
        post.opp_cycle_id = rec2.crm_opportunity_cycle_id;
        //post.opp_cycle_id = rec2.parent_id;

        //console.log(post);
        $http
            .post(excUrl, post)
            .then(function (res) {
                if (res.data.ack == true) {
                    check = true;
                }
            });
        return check;
    }

    /*$scope.addSalePersonsOopCycleHistory = function (id, rec) {
     var excUrl = $scope.$root.sales + "crm/crm/add-opp-cycle-salesperson-log";
     var post = {};
     var temp = [];
     // console.log(rec);
     // crm_id: $stateParams.id,
     angular.forEach($scope.selectedSpOopCycle, function (obj) {
     temp.push({id: obj.id, isPrimary: obj.isPrimary});
     });
     post.type = 2;
     post.id = id;
     post.salespersons = temp;
     post.token = $scope.$root.token;
     $http.post(excUrl, post)
     .then(function (res) {
     //$scope.add_salespersons_log(id);
     });
     }*/

    //OOP cycle tab salesperson End

    //OOP cycle tab support staff start

    $scope.selectedsupportstaff = [];

    $scope.getSupportStaffOopCycle = function () { //isShow

        $scope.title = 'Support Staff';



        var chkAllTrue = 1;

        var postUrl = $scope.$root.hr + "employee/listings";
        var postData = {
            'token': $scope.$root.token
        };
        $http
            .post(postUrl, postData)
            .then(function (emp_data) {

                $scope.columnsstaff = [];
                $scope.recordsupportstaff = [];
                $scope.supportOopCycle = [];
                $scope.PendingSelectedsupportOopCycle = [];

                if (emp_data.data.ack == true) {

                    angular.forEach(emp_data.data.response, function (obj) {

                        obj.chk = false;
                        obj.isPrimary = false;
                        if ($scope.selectedsupportstaff.length > 0) {

                            angular.forEach($scope.selectedsupportstaff, function (obj2) {
                                if (obj.id == obj2.id) { //|| $scope.selct_from_oop
                                    obj.chk = true;

                                    if (obj2.isPrimary)
                                        obj.isPrimary = true;
                                }
                            });

                            if (obj.chk == false) {
                                chkAllTrue = 0;
                            }
                        }
                        else {
                            chkAllTrue = 0;
                        }

                        $scope.supportOopCycle.push(obj);
                    });

                    if (chkAllTrue == 1)
                        $scope.selectedAll = true;

                    $scope.recordsupportstaff = $scope.supportOopCycle;
                    //

                    // console.log($scope.supportOopCycle);

                    angular.forEach(emp_data.data.response[0], function (val, index) {
                        if (index != 'chk' && index != 'id') {
                            $scope.columnsstaff.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }
                    });
                    $scope.searchKeyword = {};
                    angular.element('#salesPersonOppstaff').modal({
                        show: true
                    });
                }
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }


    $scope.PendingSelectedsupportOopCycle2 = [];

    $scope.selectstaffperson = function (sp) {
        $scope.isSalePerersonChanged = true;

        console.log($scope.selectedAll);

        $scope.selectedAll = false;


        // $scope.PendingSelectedsupportOopCycle = $scope.selectedsupportstaff;

        for (var i = 0; i < $scope.supportOopCycle.length; i++) {


            if (sp.id == $scope.supportOopCycle[i].id) {
                //&& isPrimary == 0
                if ($scope.supportOopCycle[i].chk == true) {
                    $scope.supportOopCycle[i].chk = false;

                    /*angular.forEach($scope.PendingSelectedsupportOopCycle, function (obj, indx) {
                     if (obj != undefined) {
                     if (obj.id == sp.id)
                     $scope.PendingSelectedsupportOopCycle.splice(indx, 1);
                     }
                     });*/
                } else {

                    /*if ($scope.PendingSelectedsupportOopCycle.length == 0) {
     
                     var isExist = false;*/
                    /* $scope.salepersonsOopCycle[i].isPrimary = true;*/

                    /*angular.forEach($scope.PendingSelectedSpOopCycle, function (obj, indx) {
                     if (obj != undefined) {
                     // $scope.PendingSelectedSpOopCycle[indx].isPrimary = false;
                     if (obj.id == sp.id) {
                     isExist = true;
                     $scope.PendingSelectedSpOopCycle[indx].isPrimary = true;
                     }
                     }
                     });*/

                    /*    if (!isExist) {
                     $scope.supportOopCycle[i].chk = true;
                     $scope.PendingSelectedsupportOopCycle.push($scope.supportOopCycle[i]);
                     }
     
                     } else {
                     $scope.supportOopCycle[i].chk = true;
                     $scope.PendingSelectedsupportOopCycle.push($scope.supportOopCycle[i]);
                     }*/
                    $scope.supportOopCycle[i].chk = true;
                }
            }
        }
        //console.log($scope.PendingSelectedsupportOopCycle);
    }

    $scope.submitPendingSelectedStaffOopCycle = function () {

        $scope.PendingSelectedsupportOopCycle2 = [];

        for (var i = 0; i < $scope.supportOopCycle.length; i++) {
            if ($scope.supportOopCycle[i].chk == true)
                $scope.PendingSelectedsupportOopCycle2.push($scope.supportOopCycle[i]);
        }

        $scope.selectedsupportstaff = $scope.PendingSelectedsupportOopCycle2;
        angular.element('#salesPersonOppstaff').modal('hide');
    }

    $scope.clearPendingSelectedStaffOopCycle = function () {
        $scope.PendingSelectedsupportOopCycle2 = [];
        angular.element('#salesPersonOppstaff').modal('hide');
    }

    $scope.checkAllStaffOopCycle = function (val) {
        $scope.PendingSelectedsupportOopCycle2 = [];

        if (val == true) {
            $scope.isSalePerersonChanged = true;
            // var isPrimary = false;

            for (var i = 0; i < $scope.supportOopCycle.length; i++) {
                /*if ($scope.supportOopCycle[i].isPrimary)
                 isPrimary = true;*/

                $scope.supportOopCycle[i].chk = true;
                //$scope.PendingSelectedsupportOopCycle.push($scope.supportOopCycle[i]);
            }

        } else {
            for (var i = 0; i < $scope.supportOopCycle.length; i++) {
                $scope.supportOopCycle[i].chk = false;
                // $scope.supportOopCycle[i].isPrimary = false;
            }
            // $scope.PendingSelectedsupportOopCycle = [];

        }
    }

    $scope.NEW_FREQUENCY = false;
    $scope.validConvrate = function (price_a, currency_id, date, _formStatus) {
        if (!$scope.NEW_FREQUENCY){
            $scope.NEW_FREQUENCY = true;
            toaster.pop('warning', 'Info', $scope.$root.getErrorMessageByCode(651));
            $scope.recFrequency = {};
            $scope.recFrequency.monthlySpreadArr = {};
        }
        


        var converted_price = 0;
        if (currency_id != undefined)
            currency_id = $scope.rec_oop.currency_id.id;
        var isValide = true;
        if ((Number(price_a) === undefined || Number(price_a) === 0) || currency_id == undefined) {
            $scope.rec_oop.convert_amount = null;
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(231, ['Currency','Amount']));
            angular.element('.cur_block').attr("disabled", false);
            isValide = false;
            return;
        }

        if (currency_id == $scope.$root.defaultCurrency) {
            $scope.rec_oop.convert_amount = Number(price_a);
            return;
        } else {

            var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
            $http
                .post(currencyURL, {
                    'id': currency_id,
                    token: $scope.$root.token,
                    or_date: date
                })
                .then(function (res) {
                    if (res.data.ack == true) {

                        if ($scope.rec_oop.frequency_id != undefined) {
                            if ($scope.rec_oop.frequency_id.id > 0) {
                                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(340));
                                $scope.rec_oop.recfrequeny = $scope.recFrequency = {};
                                $scope.recFrequency.monthlySpreadArr = {};
                            }
                        }

                        if (res.data.response.conversion_rate == null) {
                            $scope.rec_oop.convert_amount = null;
                            toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                            angular.element('.cur_block').attr("disabled", true);
                            return;
                        } else {

                            var newPrice1 = Number(price_a);
                            var newPrice = 0;
                            if (currency_id != $scope.$root.defaultCurrency)
                                newPrice = Number(newPrice1) / Number(res.data.response.conversion_rate);
                            else
                                newPrice = Number(newPrice1);
                            if (newPrice > 0)
                                converted_price = Number(newPrice).toFixed(2);
                            else
                                newPrice = 0;
                            $scope.rec_oop.convert_amount = converted_price;
                            angular.element('.cur_block').attr("disabled", false);
                        }
                    } else {
                        $scope.rec_oop.convert_amount = null;
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Conversion Rate in Setup']));
                        angular.element('.cur_block').attr("disabled", true);
                        return;
                    }

                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
                });
        }
    }

    $scope.set_percentage = function (probability, current_status_stage, start_end) {
        var end_limit = 99;
        if (start_end == 2)
            end_limit = 100;

        if (Number(probability) < 1 || Number(probability) > end_limit) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(338));
            return false;
            /* Can\'t be greater than 100*/
        }
    }


    /////////////////////  Comments opp cycle ///////////////////////

    $scope.formData_images_data_opp_cycle = [];
    $scope.$on("multi_image2", function (event, array_image2) {
        $scope.formData_images_data_opp_cycle = array_image2;
    });
    $scope.coment_data = {};
    $scope.coment_data.checkTitle = false;
    $scope.row_id = $scope.$root.crm_id;
    $scope.module_ids = tab_id_number; //$scope.detail.id;//$scope.rec.id;

    $scope.addcommentoop = function (coment_data) {

        $scope.coment_data.row_id = $scope.row_id;
        // $scope.coment_data.module_id = $scope.rec_oop.current_status.id;
        $scope.coment_data.module_id = $scope.rec_oop.stage_id.id;
        $scope.coment_data.type = 1;
        $scope.coment_data.sub_type = $scope.$root.opp_cycle_id;
        $scope.coment_data.token = $scope.$root.token;
        $scope.coment_data.coment_id = $scope.coment_data.coment_id;
        $scope.coment_data.fileName1 = $scope.formData_images_data_opp_cycle;

        var add_comet_url = $scope.$root.com + "document/update-comments";
        $http
            .post(add_comet_url, coment_data)
            .then(function (res) {

                if (res.data.ack == true) {

                    toaster.pop('success', res.data.info, res.data.msg);
                    // $scope.getCommentsoop();
                    $scope.wordsLength = 0;
                } else
                    toaster.pop('error', 'info', res.data.msg);
            });
    }

    $scope.getCommentsoop = function () {
        return;

        $scope.formData_images_data_opp_cycle = [];
        $scope.$root.$broadcast("multi_image_empty_pre", $scope.formData_images_data_opp_cycle);
        $scope.showcomentbeforedoc = true;
        $scope.wordsLength = 0;
        $scope.coment_data = {};
        /*$scope.$root.breadcrumbs =
         [//{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
         {'name':  $scope.module, 'url': '#', 'isActive': false},
         {'name': $scope.module_name, 'url': redirect, 'isActive': false},
         {'name': $scope.module_code, 'url': '#', 'isActive': false},
         {'name': 'Comments', 'url': '#', 'isActive': false}];*/

        $scope.show_coments_list = true;
        $scope.show_coments_form = false;
        $scope.perreadonly = true;
        $scope.coment_data.create_date = $scope.$root.get_current_date();

        var API = $scope.$root.com + "document/comments-listings";
        var postData = {
            'token': $scope.$root.token,
            'row_id': $scope.row_id,
            /*'module_id': $scope.rec_oop.current_status.id,*/
            'module_id': $scope.rec_oop.stage_id.id, ///0,
            'sub_type': 6,
            'page': $scope.item_paging.spage,
            'tabname': 1
            //'country_keyword': angular.element('#search_sale_listing_data').val()
        };
        $http
            .post(API, postData)
            .then(function (res) {
                $scope.columns = [];
                $scope.recod_coments = [];
                if (res.data.ack == true) {


                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.recod_coments = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    $scope.showLoader = false;
                }


                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });

    }

    $scope.showEditFormComentopp = function (id) {

        $scope.coment_data.checkTitle = true;
        $scope.show_coments_list = false;
        $scope.show_coments_form = true;
        /* $scope.showdoc = true;
         $scope.showdocumentlist = true;
         */

        var getUrl = $scope.$root.com + "document/get-comments";
        var postViewData = {
            'token': $scope.$root.token,
            'id': id
        };
        $scope.coment_data.coment_id = id;
        $http
            .post(getUrl, postViewData)
            .then(function (res) {
                $scope.coment_data = res.data.response;
                $scope.coment_data.coment_id = res.data.response.id;
                $scope.coment_data.create_date = $scope.$root.convert_unix_date_to_angular(res.data.response.create_date);
            });
    }

    $scope.delete_coment = function (id, index, arr_data) {
        var delUrl = $scope.$root.com + "document/delete-comments";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    };

    $scope.show_coments_list = false;
    $scope.show_coments_form = false;

    $scope.show_add_comment_form = function () {
        $scope.show_coments_list = false;
        $scope.show_coments_form = true;
    }

    /////////////////////  Comments opp  cycle ///////////////////////


    //----------- 	 opp cycle Document 	 ----------------------------------------
    $scope.module_id_doc = $scope.$root.crm_id; //$scope.detail.id;
    $scope.subtype = $scope.stage_record_id; //$scope.$root.opp_cycle_id; //1;
    $scope.stage_id = $scope.stage_change;
    $scope.row_id = $stateParams.id;
    $scope.$root.opp_cycle_id = $scope.stage_record_id;
    //;


    $scope.formData = {};
    $scope.formData2 = {};
    $scope.formData22 = {};
    $scope.uploadConShow = true;
    $scope.columnsoop = [];

    $scope.flag_history = false;


    $scope.getDocuments_opp = function (tab, stage_id, recordhis) { //return;


        if (recordhis != undefined) {

            if (Number(recordhis.history) == 1) $scope.flag_history = false; //recordhis.ids;


        } else $scope.flag_history = true;
        $scope.$root.$broadcast("multi_image_empty_pre", '');

        $scope.formData = {};
        $scope.showcomentbeforedoc = false;
        $scope.uploadConShow = true;
        $scope.showdocumentlist = true;
        $scope.showdoc = false;
        var API = $scope.$root.com + "document/document_list";
        $scope.formData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'tab_id': tab,
            'module_id': $scope.$root.opp_cycle_id, //$scope.rec.id,
            'subtype': stage_id,
            'employee_id': $scope.row_id,
            'page': $scope.item_paging.spage,
            //'country_keyword': angular.element('#search_sale_listing_data').val()
        };
        $scope.showLoader = false;
        $http
            .post(API, $scope.postData)
            .then(function (res) {
                $scope.showLoader = false;
                $scope.documentlist = [];
                $scope.columnsoop = [];

                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.documentlist = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columnsoop.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                }
                //	else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });

        angular.element('#dcoument_oop').modal({
            show: true
        });

    }

    $scope.adddocument_opp = function (formData, stage_id) {


        $scope.formData.token = $scope.$root.token;
        // $scope.formData.tab_id_2 = 4;
        $scope.formData.tab_id = $scope.$root.crm_oop_cycle_tab_module;
        $scope.formData.employee_id = $scope.row_id;
        $scope.formData.module_id = $scope.$root.opp_cycle_id; //$scope.module_id_doc;
        $scope.formData.subtype = stage_id; //1;
        $scope.formData.document_id = $scope.document_id;

        $scope.formData.fileName1 = $scope.formData_images_data_opp_cycle;

        var updatedoc = $scope.$root.com + "document/update_documents";
        $http
            .post(updatedoc, $scope.formData)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', res.data.info, res.data.msg);
                    $scope.getDocuments_opp($scope.$root.crm_oop_cycle_tab_module, stage_id);

                } else
                    toaster.pop('error', 'Info', res.data.error);
            });
    }

    $scope.showdocEditForm_opp = function (id) {

        $scope.$root.$broadcast("multi_image_empty_pre", '');
        //$scope.formData.fileName=[];var fileName=[];
        //$scope.$root.$broadcast("multi_image2",fileName);

        // $scope.$root.$broadcast("multi_image2", $scope.formData_images_data_opp_cycle);

        $scope.formData_images_data_opp_cycle = [];
        $scope.uploadConShow = true;
        $scope.showdoc = true;
        $scope.showdocumentlist = false;
        /*	 $scope.check_hrvalues_readonly = false;
         $scope.perreadonly = true;*/
        $scope.perreadonly = true;
        //$scope.list_folder_parent(1);
        var getUrl = $scope.$root.com + "document/document_by_id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };
        $scope.formData.document_id = id;
        $scope.document_id = id;
        $scope.showLoader = true;

        $http
            .post(getUrl, postViewBankData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.display_error_doc = false; //$scope.formData = res.data.response;
                    $scope.formData.document_id = res.data.response.id;
                    $scope.formData.document_title = res.data.response.title;
                    $scope.formData.document_code = res.data.response.document_code;
                    // $scope.formData.document_path = res.data.response.name;
                    // $scope.formData.FileType = res.data.response.FileType;

                    $scope.$root.$broadcast("multi_image2", res.data.response2);
                    $scope.formData_images_data_opp_cycle = res.data.response2;
                    $scope.formData.document_path = 1;
                }

            });
        $scope.showLoader = false;

    }

    $scope.delete_document_opp = function (id, index, arr_data) {
        var delUrl = $scope.$root.com + "document/delete_document";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    };


    //----------- 	 opp cycle Document 	 ----------------------------------------


    // sales person opp  cycle
    $scope.columns = [];
    $scope.selectedSalespersons_oop = [];
    $scope.salepersons_oop = [];

    $scope.getSalePerson_oop = function (isShow) {
        $scope.columns = [];
        $scope.salepersons_oop = [];
        $scope.title = 'Salesperson';
        var postUrl = $scope.$root.hr + "employee/listings";
        var postData = {
            'token': $scope.$root.token,
            deprtment_type: 2
        };
        $http
            .post(postUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {

                    angular.forEach(res.data.response, function (obj) {
                        obj.chk = false;
                        obj.isPrimary = false;

                        if ($scope.selectedSalespersons_oop.length > 0) {
                            angular.forEach($scope.selectedSalespersons_oop, function (obj2) {
                                if (obj.id == obj2.id) {
                                    obj.chk = true;
                                    if (obj2.isPrimary)
                                        obj.isPrimary = true;
                                }
                            });
                        }
                        $scope.salepersons_oop.push(obj);
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
                    if (!isShow)
                        angular.element('#salesPersonModal_oop').modal({
                            show: true
                        });
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    angular.element(document).on('click', '.checkAll_oop', function () {
        $scope.selectedSalespersons_oop = [];
        if (angular.element('.checkAll_oop').is(':checked') == true) {
            $scope.isSalespersonUpdated = true;
            var isPrimary = false;
            for (var i = 0; i < $scope.salepersons_oop.length; i++) {
                if ($scope.salepersons_oop[i].isPrimary)
                    isPrimary = true;
                $scope.salepersons_oop[i].chk = true;
                $scope.selectedSalespersons_oop.push($scope.salepersons_oop[i]);
            }
            if (!isPrimary) {
                $scope.salepersons_oop[0].isPrimary = true;
                $scope.selectedSalespersons_oop[0].isPrimary = true;
            }

        } else {
            for (var i = 0; i < $scope.salepersons_oop.length; i++) {
                $scope.salepersons_oop[i].chk = false;
                $scope.salepersons_oop[i].isPrimary = false;
            }
            $scope.selectedSalespersons_oop = [];
        }
        $scope.$apply(function () {
            $scope.selectedSalespersons_oop;
        });
    });

    $scope.selectSaleperson_oop = function (sp, isPrimary) {

        $scope.isSalespersonUpdated = true;
        for (var i = 0; i < $scope.salepersons_oop.length; i++) {
            if (isPrimary == 1)
                $scope.salepersons_oop[i].isPrimary = false;
            if (sp.id == $scope.salepersons_oop[i].id) {
                if ($scope.salepersons_oop[i].chk == true && isPrimary == 0) {
                    $scope.salepersons_oop[i].chk = false;
                    $scope.salepersons_oop[i].isPrimary = false;

                    angular.forEach($scope.selectedSalespersons_oop, function (obj, indx) {
                        if (obj != undefined) {
                            if (obj.id == sp.id)
                                $scope.selectedSalespersons_oop.splice(indx, 1);
                        }
                    });
                } else {

                    // //console.log('i==>>'+i);
                    if (isPrimary == 1 || $scope.selectedSalespersons_oop.length == 0) {
                        var isExist = false;
                        $scope.salepersons_oop[i].isPrimary = true;

                        angular.forEach($scope.selectedSalespersons_oop, function (obj, indx) {
                            if (obj != undefined) {
                                $scope.selectedSalespersons_oop[indx].isPrimary = false;
                                if (obj.id == sp.id) {
                                    isExist = true;
                                    $scope.selectedSalespersons_oop[indx].isPrimary = true;
                                }

                            }
                        });
                        if (!isExist) {
                            $scope.salepersons_oop[i].chk = true;
                            $scope.selectedSalespersons_oop.push($scope.salepersons_oop[i]);
                        }

                    } else {
                        $scope.salepersons_oop[i].chk = true;
                        $scope.selectedSalespersons_oop.push($scope.salepersons_oop[i]);
                    }
                }

            }
        }
    }

    $scope.getSalePersons_edit_oop = function (id) {

        var salepersonUrl = $scope.$root.sales + "crm/crm/get-crm-salesperson";
        $http
            .post(salepersonUrl, {
                id: id,
                'token': $scope.$root.token,
                'type': 4
            })
            .then(function (emp_data) {
                if (emp_data.data.ack == true) {
                    angular.forEach($scope.salepersons_oop, function (obj) {
                        obj.chk = false;
                        obj.isPrimary = false;

                        angular.forEach(emp_data.data.response, function (obj2) {
                            if (obj.id == obj2.salesperson_id) {
                                obj.chk = true;
                                if (obj2.is_primary == 1)
                                    obj.isPrimary = true;
                                $scope.selectedSalespersons_oop.push(obj);
                            }
                        });
                        $scope.salepersons_oop.push(obj);
                    });
                }
                //else  toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));

            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.add_sale_opp = function (id) {
        var check = false;
        var excUrl = $scope.$root.sales + "crm/crm/add-crm-salesperson";
        var post = {};
        var temp = [];

        angular.forEach($scope.selectedSalespersons_oop, function (obj) {
            temp.push({
                id: obj.id,
                isPrimary: obj.isPrimary
            });
        });

        post.type = 4;
        post.id = id;
        post.salespersons = temp;
        post.token = $scope.$root.token;
        $http
            .post(excUrl, post).then(function (res) {
                if (res.data.ack == true) {
                    //$scope.add_sale_opp_log(id);
                    check = true;
                }
            });
        return check;
    }

    $scope.add_sale_opp_history = function (id) {
        var excUrl = $scope.$root.sales + "crm/crm/add-crm-salesperson-log";
        var post = {};
        var temp = [];

        angular.forEach($scope.selectedSalespersons_oop, function (obj) {
            temp.push({
                id: obj.id,
                isPrimary: obj.isPrimary
            });
        });

        post.type = 4;
        post.id = id;
        post.salespersons = temp;
        post.token = $scope.$root.token;
        $http
            .post(excUrl, post)
            .then(function (res) {
                //$scope.add_sale_opp_log(id);
            });
    }


    $scope.tabsDetil = {};
    $scope.arr_selectedSalespersons2 = [];
    $scope.arr_selectedSalespersons3 = [];


    $scope.showCompletedTabsRec = function (id) {

        $scope.arr_selectedSalespersons3 = [];
        $scope.arr_selectedSalespersons2 = [];
        var postUrl = $scope.$root.sales + "crm/crm/get-crm-opportunity-cycle-detail";
        var post = {};
        post.token = $rootScope.token;
        post.id = id; //$scope.rec_oop.id;
        post.history = 'history';
        post.crm_id = $stateParams.id;
        $http
            .post(postUrl, post)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.tabsDetil = res.data.response;
                    angular.forEach($scope.tabsDetil, function (obj) {
                        angular.forEach($scope.arr_tabs, function (obj2) {
                            if (obj.stagename == obj2.name) {
                                obj.stageNumber = obj2.stage_number;
                            }
                        });
                    });
                }
                // else  toaster.pop('error', 'Info', 'Record  Not Found');
            });
    }

    $scope.show_symbol = false;
    $scope.setSymbol = function () {
        var id = this.detail.probability_type_id.id;
        if (id == 'Percentage')
            $scope.show_symbol = true;
        else
            $scope.show_symbol = false;
    }

    $scope.addNewRolePopup = function (drpdown, type, rec_oop) {
        var id = drpdown != undefined ? drpdown.id : 0;
        if (!(id == -1))
            return false;

        $scope.popup_title = 'Add Role';
        $scope.pedefined = {};

        ngDialog.openConfirm({
            template: 'app/views/job_title/add_job_title.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (pedefined) {

            pedefined.token = $scope.$root.token;
            pedefined.types = 2;

            var postUrl = $scope.$root.setup + "hr/add-job-title";
            $http
                .post(postUrl, pedefined)
                .then(function (ress) {
                    if (ress.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        var roleUrl = $scope.$root.setup + "hr/job-title";
                        $http
                            .post(roleUrl, {
                                'token': $scope.$root.token
                            })
                            .then(function (res) {

                                if (type == 1) {
                                    $scope.arr_roles1 = res.data.response;
                                    $scope.arr_roles1.push({
                                        'id': '-1',
                                        'title': '++ Add New ++'
                                    });

                                    angular.forEach($scope.arr_roles1, function (elem) {
                                        if (elem.id == ress.data.id)
                                            rec_oop.role_one = elem;
                                    });
                                }
                                if (type == 2) {
                                    $scope.arr_roles2 = res.data.response;
                                    $scope.arr_roles2.push({
                                        'id': '-1',
                                        'title': '++ Add New ++'
                                    });

                                    angular.forEach($scope.arr_roles2, function (elem) {
                                        if (elem.id == ress.data.id)
                                            rec_oop.role_two = elem;
                                    });
                                }
                                if (type == 3) {
                                    $scope.arr_roles3 = res.data.response;
                                    $scope.arr_roles3.push({
                                        'id': '-1',
                                        'title': '++ Add New ++'
                                    });

                                    angular.forEach($scope.arr_roles3, function (elem) {
                                        if (elem.id == ress.data.id)
                                            rec_oop.role_three = elem;
                                    });
                                }

                            });
                    } else
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                });
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.addNewProcessPopup = function () {
        var id = $scope.rec_oop.process_of_decisions != undefined ? $scope.rec_oop.process_of_decisions.id : 0;

        // console.log(id);

        if (!(id == -1))
            return false;

        $scope.pedefined = {};
        ngDialog.openConfirm({
            template: 'app/views/process_of_decision/add_process_of_decision.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (pedefined) {
            /*//console.log(pedefined);
             return false;*/

            pedefined.token = $scope.$root.token;
            var postUrl = $scope.$root.setup + "general/add-process-of-decision";
            $http
                .post(postUrl, pedefined)
                .then(function (ress) {
                    if (ress.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        var roleUrl = $scope.$root.setup + "general/process-of-decision";
                        $http
                            .post(roleUrl, {
                                'token': $scope.$root.token
                            })
                            .then(function (res) {
                                if (ress.data.ack == true) {
                                    $scope.arr_process_of_decision = res.data.response;
                                    /*  $scope.arr_process_of_decision.push({
                                         'id': '-1',
                                         'name': '++ Add New ++'
                                     }); */

                                    angular.forEach($scope.arr_process_of_decision, function (elem) {
                                        if (elem.id == ress.data.id)
                                            $scope.rec_oop.process_of_decisions = elem;
                                    });
                                }
                            });
                    } else
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(107));
                });
        }, function (reason) {
            $scope.rec_oop.process_of_decisions = '';
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.pipeline = {};
    $scope.add_to_pipeline = function (rec_oop, detail, tab_id) {
        // console.log(rec_opp);

        $scope.showLoader = true;
        tab_id_number = tab_id;

        var postUrl = $scope.$root.setup + "crm/add-sales-pipeline-target";

        $scope.pipeline = {
            code: 'SAL' + new Date().getTime(),
            start_period: detail.start_date,
            end_period: detail.end_date,
            description: rec_oop.description,
            opp_cycle_id: $scope.stage_record_id, //rec_oop.id,
            tab_id: tab_id,
            token: $scope.$root.token
        };

        tab_id_number = tab_id;
        $http
            .post(postUrl, $scope.pipeline)
            .then(function (res) {
                if (res.data.ack == true) {
                    if (res.data.edit == false)
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    else
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
                } else {
                    if (res.data.edit == false)
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(104));
                    else
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(106));
                }
                $scope.showLoader = false;
            });
    }

    $scope.is_complete = 0;
    $scope.complete_date = 'Null';
    $scope.tab_id = '';
    $scope.btn_complete = true;
    // $scope.checkCompleteOpp = 0;

    $scope.isComplete = function (tab_id, stage_record_id, stage_start_end) {
        $scope.NEW_FREQUENCY = false;
        //$scope.rec_oop.id ==undefined || $scope.rec_oop.id

        $scope.detail.end_date = $scope.$root.get_current_date();

        if ((parseFloat($scope.detail.probability) < 1 || parseFloat($scope.detail.probability) > 100) && 
            ($scope.rec_oop.final_step == undefined || $scope.rec_oop.final_step == "")) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(338));
            return false;
        }

        if ($scope.stage_record_id == 0) {
            if (parseFloat($scope.rec_oop.probability) < 1 || parseFloat($scope.rec_oop.probability) > 100) {
                toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(338));
                return false;
            }

            $scope.add_oop_data($scope.rec_oop, detail);
        }

        if (stage_start_end == 2 && ($scope.rec_oop.final_step == undefined || $scope.rec_oop.final_step == "")) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(341));
            return;
        }
        else {
            $scope.showLoader = true;

            ngDialog.openConfirm({
                template: 'modalcompleteDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {

                var excUrl = $scope.$root.sales + "crm/crm/complete-crm-opportunity-cycle";

                $scope.complete_data = $scope.$root.get_current_date();
                $scope.tab_id = tab_id;
                tab_id_number = tab_id;

                var post = {};
                post.tab_id = tab_id;
                post.crm_id = $stateParams.id;
                post.id = stage_record_id;
                post.token = $scope.$root.token;
                post.end_date = $scope.detail.end_date;

                $http
                    .post(excUrl, post)
                    .then(function (res) {
                        if (res.data.ack == true) {

                            $scope.showCompletedTabsRec($scope.stage_record_id);

                            $scope.rec_oop.is_complete = 1;
                            $scope.check_readonly_opp = true;
                            $scope.check_readonly_oppStage = true;
                            $scope.check_readonly_oppStageedit_btn = true;

                            toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));

                            $scope.rec_oop.stagesStatus = res.data.stagesStatus.response;

                            //console.log(res.data.response);

                            // condition to move to next stage after completion of a stage.
                            $scope.nextStageID = "";
                            $scope.chkNextStageID = false;

                            angular.forEach($scope.arr_tabs, function (obj) {

                                $scope.rec_oop.stage_id = obj.id;

                                if ($scope.chkNextStageID == false) {

                                    // console.log('here#############');

                                    if (obj.id == tab_id) {
                                        $scope.chkNextStageID = true;

                                        var stageCounter = 0;
                                        var lastStageCounter = 0;

                                        if ($scope.rec_oop.stagesStatus != undefined)
                                            var intializeStagesNo = $scope.rec_oop.stagesStatus.length;

                                        angular.forEach($scope.arr_tabs, function (elem) {

                                            if (elem.stagestatus != 1 && stageCounter < intializeStagesNo)
                                                elem.stagestatus = 4;

                                            angular.forEach($scope.rec_oop.stagesStatus, function (obj) {

                                                if (elem.stagestatus == undefined || elem.stagestatus == 2 || elem.stagestatus == 4) {

                                                    if (elem.id == obj.stage_id && obj.is_complete == 1) {
                                                        elem.stagestatus = 1;
                                                        lastStageCounter = stageCounter + 1;

                                                    } else if (elem.id == obj.stage_id && obj.activeRec == 1 && obj.is_complete == 0) {
                                                        elem.stagestatus = 2;
                                                        lastStageCounter = stageCounter + 1;
                                                    }
                                                }

                                                if (obj.is_complete == 1)
                                                    $scope.check_readonly_opp_name = true;
                                            });

                                            stageCounter++;
                                        });
                                    }

                                } else {
                                    $scope.nextStageID = obj.id;
                                    $scope.set_stage_change(obj.id, stage_record_id);
                                    $scope.chkNextStageID = false;
                                }
                            });


                            /* angular.forEach($scope.rec_oop.stagesStatus, function (obj) {
                                angular.forEach($scope.arr_tabs, function (elem) {
                                    if (elem.stagestatus == undefined) {

                                        if (elem.id == obj.stage_id && obj.is_complete == 1) {
                                            elem.stagestatus = 1;

                                        } else if (elem.id == obj.stage_id && obj.activeRec == 1 && obj.is_complete == 0) {
                                            elem.stagestatus = 2; //&& elem.id == res.data.response.stage_id

                                        } else if (elem.id == obj.stage_id && obj.activeRec == 0 && obj.is_complete == 0) {
                                            elem.stagestatus = 4; //&& elem.id != res.data.response.stage_id

                                        }
                                    }

                                });
                            }); */

                        } else
                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(106));

                        $scope.showLoader = false;
                    }).catch(function (message) {
                        $scope.showLoader = false;

                        throw new Error(message.data);
                        console.log(message.data);
                    });

            }, function (reason) {
                //console.log('Modal promise rejected. Reason: ', reason);
                $scope.showLoader = false;
            });
        }
    }


    $scope.set_stage_change = function (status_id, stage_record_id, mode) {

        if (status_id == undefined || stage_record_id == undefined)
            return;
        else {
            if (stage_record_id == "")
                return false;
            $scope.showLoader = true;
            $scope.EnableSpread = false;

            $scope.allStagesCompleted = false;

            $scope.recFrequency = {};
            $scope.recFrequency.monthlySpreadArr = {};

            var oppUrl = $scope.$root.sales + "crm/crm/get-crm-opportunity-cycle-by-stageid";
            $http
                .post(oppUrl, {
                    'crm_opportunity_cycle_id': stage_record_id,
                    /*'parent_id': stage_record_id,*/
                    'token': $scope.$root.token,
                    'crm_id': $stateParams.id,
                    'stage_id': status_id
                })
                .then(function (res) {
                    $scope.showLoader = false;
                    $scope.checkCompleteOpp = 0;

                    if (res.data.ack == true) {

                        //console.log(res.data.response);
                        $scope.checkCompleteOpp = 1;

                        if (Number(res.data.response.is_complete) == 1) {
                            $scope.check_readonly_opp = true;
                            $scope.checkReadonlyOppParentName = false;
                        } else {

                            if (mode == 1)
                                $scope.check_readonly_opp = true;
                            else if (mode == 0)
                                $scope.check_readonly_opp = false;

                            // $scope.check_readonly_opp = false;
                            $scope.check_readonly_opp_name = false;
                            $scope.checkReadonlyOppParentName = true;
                        }


                        $scope.rec_oop.is_complete = res.data.response.is_complete;
                        $scope.rec_oop.crm_opportunity_cycle_id = res.data.response.crm_opportunity_cycle_id;
                        //$scope.rec_oop.parent_id = res.data.response.parent_id;
                        $scope.rec_oop.subject = res.data.response.subject;
                        $scope.rec_oop.forecast_amount = parseFloat(res.data.response.forecast_amount);
                        $scope.rec_oop.convert_amount = parseFloat(res.data.response.convert_amount);
                        $scope.rec_oop.date_added = res.data.response.date_added;

                        $scope.rec_oop.id = res.data.response.id;
                        $scope.rec_oop.oop_code = res.data.response.oop_code;
                        $scope.rec_oop.notes = res.data.response.notes;

                        if (res.data.response.frequencyID) {
                            $scope.rec_oop.frequency_id = $rootScope.get_obj_frm_arry($scope.arrFrequency, res.data.response.frequencyID);
                        }

                        $scope.recFrequency.dbFrequencyID = res.data.response.frequencyID;
                        $scope.recFrequency.equalSpread = res.data.response.equalSpread;

                        $scope.recFrequency.monthlySpreadArr.January = parseFloat(res.data.response.freqJanuary);
                        $scope.recFrequency.monthlySpreadArr.February = parseFloat(res.data.response.freqFebruary);
                        $scope.recFrequency.monthlySpreadArr.March = parseFloat(res.data.response.freqMarch);
                        $scope.recFrequency.monthlySpreadArr.April = parseFloat(res.data.response.freqApril);

                        $scope.recFrequency.monthlySpreadArr.May = parseFloat(res.data.response.freqMay);
                        $scope.recFrequency.monthlySpreadArr.June = parseFloat(res.data.response.freqJune);
                        $scope.recFrequency.monthlySpreadArr.July = parseFloat(res.data.response.freqJuly);
                        $scope.recFrequency.monthlySpreadArr.August = parseFloat(res.data.response.freqAugust);

                        $scope.recFrequency.monthlySpreadArr.September = parseFloat(res.data.response.freqSeptember);
                        $scope.recFrequency.monthlySpreadArr.October = parseFloat(res.data.response.freqOctober);
                        $scope.recFrequency.monthlySpreadArr.November = parseFloat(res.data.response.freqNovember);
                        $scope.recFrequency.monthlySpreadArr.December = parseFloat(res.data.response.freqDecember);

                        $scope.recFrequency.startmonths = res.data.response.freqStartmonth;

                        if (res.data.response.freqStartmonth>0) {
                            $scope.recFrequency.startmonth = $rootScope.get_obj_frm_arry($scope.startMonthArr, res.data.response.freqStartmonth);
                        }
                        else{
                            if(res.data.response.job_titles && res.data.response.job_titles.oppCycleFreqstartmonth >0){

                                $scope.recFrequency.startmonth = $rootScope.get_obj_frm_arry($scope.startMonthArr, res.data.response.job_titles.oppCycleFreqstartmonth);
                            }
                        }

                        $scope.start_month = $scope.recFrequency.startmonth.id;

                        $scope.recFrequency.firstquartermonth = parseFloat(res.data.response.freqFirstQuartermonth);
                        $scope.recFrequency.secondquartermonth = parseFloat(res.data.response.freqSecondQuartermonth);
                        $scope.recFrequency.thirdquartermonth = parseFloat(res.data.response.freqThirdQuartermonth);

                        // console.log($scope.recFrequency);
                        $scope.rec_oop.recfrequeny = $scope.recFrequency;

                        if ($scope.recFrequency.monthlySpreadArr.January != 0 || $scope.recFrequency.monthlySpreadArr.February != 0 || $scope.recFrequency.monthlySpreadArr.March != 0 ||
                            $scope.recFrequency.monthlySpreadArr.April != 0 || $scope.recFrequency.monthlySpreadArr.May != 0 || $scope.recFrequency.monthlySpreadArr.June != 0 ||
                            $scope.recFrequency.monthlySpreadArr.July != 0 || $scope.recFrequency.monthlySpreadArr.August != 0 || $scope.recFrequency.monthlySpreadArr.September != 0 ||
                            $scope.recFrequency.monthlySpreadArr.October != 0 || $scope.recFrequency.monthlySpreadArr.November != 0 || $scope.recFrequency.monthlySpreadArr.December != 0 ||
                            $scope.recFrequency.firstquartermonth != 0 || $scope.recFrequency.secondquartermonth != 0 || $scope.recFrequency.thirdquartermonth != 0) {

                            $scope.EnableSpread = true;
                        }

                        $scope.arr_alt_contacts = res.data.response.alt_contacts.response;
                        $scope.arr_process_of_decision = res.data.response.process_of_decission.response;

                        $scope.arr_roles1 = [];
                        $scope.arr_roles2 = [];
                        $scope.arr_roles3 = [];
                        $scope.arr_testroles = {};
                        $scope.arr_testroles = res.data.response.job_titles.response;

                        $scope.arr_roles1 = $scope.arr_testroles;
                        $scope.arr_roles2 = $scope.arr_testroles;
                        $scope.arr_roles3 = $scope.arr_testroles;

                        if (res.data.response.tabsDetail.response.length > 0 && res.data.response.tabsDetail.response != undefined)
                            $scope.tabsDetil = res.data.response.tabsDetail.response;

                        // $scope.rec_oop = res.data.response;

                        if (res.data.response.process_of_decision)
                            $scope.rec_oop.process_of_decisions = $rootScope.get_obj_frm_arry($scope.arr_process_of_decision, res.data.response.process_of_decision);

                        if (res.data.response.final_step)
                            $scope.rec_oop.final_step = $rootScope.get_obj_frm_arry($scope.arr_tabspostion, res.data.response.final_step);

                        $scope.arr_tabs = res.data.response.stages.response;

                        if (res.data.response.tabsDetail.response.length > 0 && res.data.response.tabsDetail.response != undefined) {
                            $scope.tabsDetil = res.data.response.tabsDetail.response;


                            $scope.selTabDetailData = {};

                            if ($scope.arr_tabs.length > 0) {
                                angular.forEach($scope.tabsDetil, function (obj) {
                                    angular.forEach($scope.arr_tabs, function (obj2) {
                                        if (obj.stagename == obj2.name) {
                                            obj.stageNumber = obj2.stage_number;
                                        }
                                    });
                                });

                                angular.forEach($scope.tabsDetil, function (obj) {
                                    if (obj.stage_id == status_id) {
                                        $scope.selTabDetailData = obj;
                                    }
                                });
                                //$scope.selTabDetailData != undefined 

                                if (Object.getOwnPropertyNames($scope.selTabDetailData).length !== 0) {

                                    /* $scope.rec_oop.contact_person_one = {};
                                    $scope.rec_oop.contact_person_two = {};
                                    $scope.rec_oop.contact_person_three = {};
                                    $scope.rec_oop.role_one = {};
                                    $scope.rec_oop.role_two = {};
                                    $scope.rec_oop.role_three = {}; 
                                    $scope.rec_oop.currency_id = {};*/

                                    angular.forEach($scope.arr_alt_contacts, function (elem) {
                                        if ($scope.selTabDetailData.contact_person_1 == elem.id)
                                            $scope.rec_oop.contact_person_one = elem;

                                        if ($scope.selTabDetailData.contact_person_2 == elem.id)
                                            $scope.rec_oop.contact_person_two = elem;

                                        if ($scope.selTabDetailData.contact_person_3 == elem.id)
                                            $scope.rec_oop.contact_person_three = elem;
                                    });

                                    angular.forEach($scope.arr_roles1, function (elem) {
                                        if ($scope.selTabDetailData.role_1 == elem.id)
                                            $scope.rec_oop.role_one = elem;

                                        if ($scope.selTabDetailData.role_2 == elem.id)
                                            $scope.rec_oop.role_two = elem;

                                        if ($scope.selTabDetailData.role_3 == elem.id)
                                            $scope.rec_oop.role_three = elem;
                                    });

                                    if ($scope.selTabDetailData.currency_id)
                                        $scope.rec_oop.currency_id = $rootScope.get_obj_frm_arry($rootScope.arr_currency, $scope.selTabDetailData.currency_id);
                                }
                                else {
                                    angular.forEach($scope.arr_alt_contacts, function (elem) {
                                        if (res.data.response.contact_person_1 == elem.id)
                                            $scope.rec_oop.contact_person_one = elem;
                                        if (res.data.response.contact_person_2 == elem.id)
                                            $scope.rec_oop.contact_person_two = elem;
                                        if (res.data.response.contact_person_3 == elem.id)
                                            $scope.rec_oop.contact_person_three = elem;
                                    });

                                    angular.forEach($scope.arr_roles1, function (elem) {
                                        if (res.data.response.role_1 == elem.id)
                                            $scope.rec_oop.role_one = elem;
                                        if (res.data.response.role_2 == elem.id)
                                            $scope.rec_oop.role_two = elem;
                                        if (res.data.response.role_3 == elem.id)
                                            $scope.rec_oop.role_three = elem;
                                    });

                                    if (res.data.response.currency_id)
                                        $scope.rec_oop.currency_id = $rootScope.get_obj_frm_arry($rootScope.arr_currency, res.data.response.currency_id);
                                }
                            }
                        }

                        angular.forEach($scope.arr_tabs, function (elem) {
                            if (elem.id == status_id)
                                elem.activestagestatus = 1;
                            else
                                elem.activestagestatus = 0;
                        });

                        var stageCounter = 0;
                        var lastStageCounter = 0;

                        if ($scope.rec_oop.stagesStatus != undefined)
                            var intializeStagesNo = $scope.rec_oop.stagesStatus.length;

                        angular.forEach($scope.arr_tabs, function (elem) {

                            if (elem.stagestatus != 1 && stageCounter < intializeStagesNo)
                                elem.stagestatus = 4;

                            angular.forEach($scope.rec_oop.stagesStatus, function (obj) {

                                if (elem.stagestatus == undefined || elem.stagestatus == 2 || elem.stagestatus == 4) {

                                    if (elem.id == obj.stage_id && obj.is_complete == 1) {
                                        elem.stagestatus = 1;
                                        lastStageCounter = stageCounter + 1;

                                    } else if (elem.id == obj.stage_id && obj.activeRec == 1 && obj.is_complete == 0) {
                                        elem.stagestatus = 2;
                                        lastStageCounter = stageCounter + 1;
                                    }
                                }

                                if (obj.is_complete == 1)
                                    $scope.check_readonly_opp_name = true;
                            });

                            stageCounter++;
                        });

                        var activeStageCounter = 0;

                        angular.forEach($scope.arr_tabs, function (elem) {

                            if (parseInt(activeStageCounter) < parseInt(lastStageCounter) && elem.stagestatus == undefined) {
                                elem.stagestatus = 4;
                            }
                            activeStageCounter++;
                        });

                        var lastStageID = $scope.arr_tabs[$scope.arr_tabs.length - 1].id;

                        angular.forEach($scope.rec_oop.stagesStatus, function (obj) {
                            if (obj.stage_id == lastStageID && obj.is_complete == 1) {
                                $scope.allStagesCompleted = true;
                                $scope.check_readonly_opp = true;
                            }
                        });

                        // $scope.rec_oop.current_status = $scope.type = res.data.response.tab_id;
                        $scope.rec_oop.stage_id = $scope.type = res.data.response.tab_id;
                        $scope.detail.probability = res.data.response.percentage_stage;

                        $scope.detail.start_date = res.data.response.start_date;
                        $scope.detail.end_date = res.data.response.end_date;
                        $scope.detail.expected_close_date = res.data.response.expected_close_date;

                        $scope.detail.temp_start_date = $scope.detail.end_date;
                        $scope.detail.temp_close_date = $scope.detail.expected_close_date;

                        /*if (res.data.response.is_complete)
                         $scope.btn_complete = true;*/

                        $scope.detail.id = res.data.response.id;

                        if (Number(res.data.response.stage_change) == 0) {
                            $scope.stage_change = 0;
                            //$scope.rec_oop.current_status = $scope.stage_data = $rootScope.get_obj_frm_arry($scope.arr_tabs, res.data.response.current_status);
                            $scope.rec_oop.stage_id = $scope.stage_data = $rootScope.get_obj_frm_arry($scope.arr_tabs, res.data.response.stage_id);
                        } else
                            $scope.stage_change = 1;

                        if (Number(res.data.response.probability) > 0)
                            $scope.detail.probability = res.data.response.probability;

                    } else {

                        if (mode == 1)
                            $scope.check_readonly_opp = true;
                        else if (mode == 0)
                            $scope.check_readonly_opp = false;

                        // $scope.check_readonly_opp = false;
                        $scope.check_readonly_opp_name = false;
                        $scope.checkReadonlyOppParentName = true;

                        // to load from stage graphics                        

                        $scope.rec_oop.stage_id = $scope.stage_data = $rootScope.get_obj_frm_arry($scope.arr_tabs, status_id);

                        angular.forEach($scope.arr_tabs, function (obj) {
                            if (obj.id == status_id)
                                $scope.detail.probability = obj.Probability;
                        });


                        $scope.rec_oop.forecast_amount = parseFloat(res.data.response2.forecast_amount);
                        $scope.rec_oop.convert_amount = parseFloat(res.data.response2.convert_amount);


                        if (res.data.response2.frequencyID) {
                            $scope.rec_oop.frequency_id = $rootScope.get_obj_frm_arry($scope.arrFrequency, res.data.response2.frequencyID);
                        }

                        $scope.recFrequency.dbFrequencyID = res.data.response2.frequencyID;

                        $scope.recFrequency.equalSpread = res.data.response2.equalSpread;

                        $scope.recFrequency.monthlySpreadArr.January = parseFloat(res.data.response2.freqJanuary);
                        $scope.recFrequency.monthlySpreadArr.February = parseFloat(res.data.response2.freqFebruary);
                        $scope.recFrequency.monthlySpreadArr.March = parseFloat(res.data.response2.freqMarch);
                        $scope.recFrequency.monthlySpreadArr.April = parseFloat(res.data.response2.freqApril);

                        $scope.recFrequency.monthlySpreadArr.May = parseFloat(res.data.response2.freqMay);
                        $scope.recFrequency.monthlySpreadArr.June = parseFloat(res.data.response2.freqJune);
                        $scope.recFrequency.monthlySpreadArr.July = parseFloat(res.data.response2.freqJuly);
                        $scope.recFrequency.monthlySpreadArr.August = parseFloat(res.data.response2.freqAugust);

                        $scope.recFrequency.monthlySpreadArr.September = parseFloat(res.data.response2.freqSeptember);
                        $scope.recFrequency.monthlySpreadArr.October = parseFloat(res.data.response2.freqOctober);
                        $scope.recFrequency.monthlySpreadArr.November = parseFloat(res.data.response2.freqNovember);
                        $scope.recFrequency.monthlySpreadArr.December = parseFloat(res.data.response2.freqDecember);

                        $scope.recFrequency.startmonths = res.data.response2.freqStartmonth;

                        if (res.data.response2.freqStartmonth) {
                            $scope.recFrequency.startmonth = $rootScope.get_obj_frm_arry($scope.startMonthArr, res.data.response2.freqStartmonth);
                        }
                        else{
                            if(res.data.response2.job_titles && res.data.response2.job_titles.oppCycleFreqstartmonth >0){

                                $scope.recFrequency.startmonth = $rootScope.get_obj_frm_arry($scope.startMonthArr, res.data.response2.job_titles.oppCycleFreqstartmonth);
                            }
                        }

                        $scope.start_month = $scope.recFrequency.startmonth.id;

                        $scope.recFrequency.firstquartermonth = parseFloat(res.data.response2.freqFirstQuartermonth);
                        $scope.recFrequency.secondquartermonth = parseFloat(res.data.response2.freqSecondQuartermonth);
                        $scope.recFrequency.thirdquartermonth = parseFloat(res.data.response2.freqThirdQuartermonth);

                        // console.log($scope.recFrequency);
                        $scope.rec_oop.recfrequeny = $scope.recFrequency;

                        if ($scope.recFrequency.monthlySpreadArr.January != 0 || $scope.recFrequency.monthlySpreadArr.February != 0 || $scope.recFrequency.monthlySpreadArr.March != 0 ||
                            $scope.recFrequency.monthlySpreadArr.April != 0 || $scope.recFrequency.monthlySpreadArr.May != 0 || $scope.recFrequency.monthlySpreadArr.June != 0 ||
                            $scope.recFrequency.monthlySpreadArr.July != 0 || $scope.recFrequency.monthlySpreadArr.August != 0 || $scope.recFrequency.monthlySpreadArr.September != 0 ||
                            $scope.recFrequency.monthlySpreadArr.October != 0 || $scope.recFrequency.monthlySpreadArr.November != 0 || $scope.recFrequency.monthlySpreadArr.December != 0 ||
                            $scope.recFrequency.firstquartermonth != 0 || $scope.recFrequency.secondquartermonth != 0 || $scope.recFrequency.thirdquartermonth != 0) {

                            $scope.EnableSpread = true;
                        }
                        // console.log(status_id);

                        angular.forEach($scope.arr_alt_contacts, function (elem) {
                            if (res.data.response2.contact_person_1 == elem.id)
                                $scope.rec_oop.contact_person_one = elem;

                            if (res.data.response2.contact_person_2 == elem.id)
                                $scope.rec_oop.contact_person_two = elem;

                            if (res.data.response2.contact_person_3 == elem.id)
                                $scope.rec_oop.contact_person_three = elem;
                        });

                        angular.forEach($scope.arr_roles1, function (elem) {
                            if (res.data.response2.role_1 == elem.id)
                                $scope.rec_oop.role_one = elem;

                            if (res.data.response2.role_2 == elem.id)
                                $scope.rec_oop.role_two = elem;

                            if (res.data.response2.role_3 == elem.id)
                                $scope.rec_oop.role_three = elem;
                        });

                        if (res.data.response2.currency_id)
                            $scope.rec_oop.currency_id = $rootScope.get_obj_frm_arry($rootScope.arr_currency, res.data.response2.currency_id);

                        angular.forEach($scope.arr_tabs, function (elem) {

                            if (elem.id == status_id)
                                elem.activestagestatus = 1;
                            else
                                elem.activestagestatus = 0;
                        });

                        var stageCounter = 0;
                        var lastStageCounter = 0;

                        if ($scope.rec_oop.stagesStatus != undefined)
                            var intializeStagesNo = $scope.rec_oop.stagesStatus.length;

                        angular.forEach($scope.arr_tabs, function (elem) {

                            if (elem.stagestatus != 1 && stageCounter < intializeStagesNo)
                                elem.stagestatus = 4;

                            angular.forEach($scope.rec_oop.stagesStatus, function (obj) {

                                // console.log(obj);

                                if (elem.stagestatus == undefined || elem.stagestatus == 2 || elem.stagestatus == 4) {

                                    if (elem.id == obj.stage_id && obj.is_complete == 1) {
                                        elem.stagestatus = 1;
                                        lastStageCounter = stageCounter + 1;

                                    } else if (elem.id == obj.stage_id && obj.activeRec == 1 && obj.is_complete == 0) {
                                        elem.stagestatus = 2;
                                        lastStageCounter = stageCounter + 1;

                                    } 
                                }

                                if (obj.is_complete == 1)
                                    $scope.check_readonly_opp_name = true;
                            });

                            stageCounter++;
                        });

                        var activeStageCounter = 0;

                        angular.forEach($scope.arr_tabs, function (elem) {

                            if (parseInt(activeStageCounter) < parseInt(lastStageCounter) && elem.stagestatus == undefined) {
                                elem.stagestatus = 4;
                            }
                            activeStageCounter++;
                        });

                        var lastStageID = $scope.arr_tabs[$scope.arr_tabs.length - 1].id;

                        angular.forEach($scope.rec_oop.stagesStatus, function (obj) {
                            if (obj.stage_id == lastStageID && obj.is_complete == 1) {
                                $scope.allStagesCompleted = true;
                                $scope.check_readonly_opp = true;
                            }
                        });
                    }
                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
                });
        }

        $scope.stage_change = 1;
        $scope.rec_oop.is_complete = 0;
        $scope.check_readonly_opp = false;
        $scope.detail.end_date = '';
        $scope.detail.probability = $scope.rec_oop.stage_id.percentage;
        $scope.detail.start_date = $scope.$root.get_current_date();
        $scope.detail.end_date = $scope.$root.get_current_date();
        $scope.rec_oop.notes = '';

        $scope.check_readonly_opp_name = true;
    }


    var tab_id_number = '';
    $scope.closeTab = function () {
        $scope.$root.tabHide = 1;
    }

    $scope.togleTab = function (rec_oop, detail) {
        $scope.resetForm(rec_oop, detail);
        $scope.$root.lblButton = 'Add New';
        $scope.$root.tabHide = 0;
        angular.element('.accordion-toggle').trigger('click');
    }


    /****************************************/
    // CRM opp cycle    end
    /****************************************/


    /*   Price Offer Module start       */


    /*   Price Offer Module start       */

    var isAdded = false;

    $scope.CRMPriceInfoFormShow = false;
    $scope.CRMPriceInfoListingShow = true;

    $scope.isVolumeDiscForm = false;
    $scope.isVolumeDiscListing = false;




    //open Price history listing modal
    $scope.getPriceHistory = function (id) {
        $scope.showLoader = true;
        $scope.history_title = "Price Offer History";
        $scope.PriceOffer_rec_history = {};

        //var ApiAjax = $scope.$root.sales + "crm/crm/get-customer-price-history";
        var ApiAjax = $scope.$root.sales + "crm/crm/get-price-history";

        $scope.postData = {
            token: $scope.$root.token,
            id: id
        }

        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res) {
                $scope.price_history_info_columns = [];
                $scope.price_history_info_record_data = {};

                if (res.data.ack == true)
                    $scope.price_history_info_record_data = res.data.response;

                $scope.showLoader = false;
                angular.element('#_CustPriceHistory_modal').modal({
                    show: true
                });
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }
    $scope.searchKeyword_priceOffer = {};

    //open Price Offer listing
    $scope.priceOfferTableData = {};
    $scope.getPriceOffer = function (cp_type) {
        
        $scope.showLoader = true;

        $scope.breadcrumbs = [{
            'name': 'Sales & Customer',
            'url': '#',
            'style': ''
        }, {
            'name': 'Customer',
            'url': 'app.customer',
            'style': ''
        }, {
            'name': $scope.$root.bdname,
            'url': '#',
            'isActive': false
        }, {
            'name': 'Price / Price Offer',
            'url': '#',
            'isActive': false
        }];

        /* if ($rootScope.prooduct_arr != undefined && $rootScope.prooduct_arr.length > 0) {
            for (var i = 0; i < $rootScope.prooduct_arr.length; i++) {
                $rootScope.prooduct_arr[i].chk = false;
                $rootScope.prooduct_arr[i].disableCheck = 0;
            }
        } */

        //$scope.breadcrumbs[3].name = 'Price / Price Offer';

        $scope.PriceOffer_rec = {};
        $scope.formData = {};

        $scope.PriceOffer_rec.moduleID = $stateParams.id;
        $scope.PriceOffer_rec.moduleType = 1;
        $scope.PriceOffer_rec.priceType = '1,3';
        $scope.$root.priceCP_type = cp_type;

        if (cp_type == 2) {
            $scope.CRMPricelistInfoFormShow = false;
            $scope.CRMPricelistInfoListingShow = true;
        }
        else {
            $scope.CRMPriceInfoFormShow = false;
            $scope.CRMPriceInfoListingShow = true;
        }

        $scope.price_offer_clicked = true;
        // $scope.CRMPriceInfoFormShow = false;
        /* if(cp_type == 1) // price offer
        {
            $scope.CRMPriceInfoFormShow = false;
            $scope.CRMPriceInfoListingShow = true;
        }
        else if(cp_type == 2)
        {
            
        } */

        var ApiAjax = $scope.$root.sales + "crm/crm/price-offer-listing";

        $scope.postData = {
            moduleID: $stateParams.id,
            moduleType: 1,
            priceType: '1,3',
            searchKeyword: $scope.searchKeyword_priceOffer,
            token: $scope.$root.token
        };

        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res) {
                $scope.price_info_columns = [];
                $scope.price_info_record_data = {};

                if (res.data.ack == true) {
                    // //console.log(res.data.response);
                    $scope.priceOfferTableData = res;

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.price_info_record_data = res.data.response;

                    /* angular.forEach($scope.price_info_record_data[0], function (val, index) {
                        if (index != 'chk' && index != 'id') {
                            $scope.price_info_columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }
                    }); */
                }
                $scope.showLoader = false;
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.priceListType = '';

    //open Price Offer Form in edit mode
    $scope.OpenPriceOfferForm = function (event, id, mode) {

        $scope.showLoader = true;
        $scope.resetPriceOfferForm();

        $scope.priceListType = 'offer';

        $scope.list_type = [{
            'name': 'Percentage',
            'id': 1
        }, {
            'name': 'Value',
            'id': 2
        }];

        var p_id = (Number(id) > 0) ? id : 0;
        $scope.tempProdArr = [];

        var itemListingApi = $scope.$root.stock + "products-listing/item-popup";

        $scope.showLoader = true;

        $http
        .post(itemListingApi, { 'token': $scope.$root.token, 'price_id':p_id })
        .then(function (res) {
            if (res.data.ack == true) {
                angular.forEach(res.data.response, function (value, key) {
                    if (key != "tbl_meta_data") {
                        $scope.tempProdArr.push(value);
                    }
                });                
        
                // if($scope.tempProdArr.length == 0)
                //     $scope.tempProdArr.push({'id':0});
                
                $scope.showLoader = false;
            }
            else
            {
                // $scope.tempProdArr.push({'id':0});
                $scope.showLoader = false;
            }
        });


        $scope.CRMPriceInfoFormShow = true;
        $scope.CRMPriceInfoListingShow = false;
        $scope.deletebtn = false;

        if (id != undefined) {

            if (mode == 1)
                $scope.PriceOffer_check_readonly = true;
            else if (mode == 0)
                $scope.PriceOffer_check_readonly = false;


            //var pOfferUrl = $scope.$root.sales + "crm/crm/get-customer-price-info";
            var pOfferUrl = $scope.$root.sales + "crm/crm/get-price-data";
            $scope.PriceOffer_rec = {};
            $scope.showLoader = true;
            $http
                .post(pOfferUrl, {
                    'id': id,
                    'moduleID': $stateParams.id,
                    'moduleType': 1,
                    'priceType': '1,3',
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.PriceOffer_rec = res.data.response;
                        // console.log($scope.PriceOffer_rec);                       
                        $scope.PriceOffer_rec.priceOfferedBy = res.data.response.offeredByID;
                        $scope.PriceOffer_rec.crm_id = $stateParams.id;
                        $scope.PriceOffer_rec.offer_date = res.data.response.start_date;
                        $scope.PriceOffer_rec.offer_valid_date = res.data.response.end_date;
                        $scope.PriceOffer_rec.id = res.data.response.id;
                        if ($scope.PriceOffer_rec.priceType == 1)
                            $scope.priceCP_type = 0;
                        var currency_id = 0;

                        if (res.data.response.currencyID > 0)
                            currency_id = res.data.response.currencyID;
                        else {
                            if ($rootScope.cust_current_edit_currency)
                                currency_id = $rootScope.cust_current_edit_currency.id;
                            else
                                currency_id = $scope.$root.defaultCurrency;
                        }

                        //console.log($scope.PriceOffer_rec.items);

                        if (currency_id != $scope.$root.defaultCurrency) {

                            var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
                            $http
                                .post(currencyURL, {
                                    'id': currency_id,
                                    'token': $scope.$root.token
                                })
                                .then(function (res) {
                                    if (res.data.ack == true) {
                                        if (res.data.response.conversion_rate == null) {
                                            toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                                            return;
                                        }
                                        $scope.currencyConversionRate = parseFloat(res.data.response.conversion_rate);
                                        $scope.assignPriceOfferItemData($scope.PriceOffer_rec.items, currency_id, $scope.PriceOffer_rec.id);
                                    } else {
                                        toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                                        return;
                                    }
                                });
                        } else {
                            $scope.currencyConversionRate = 1;
                            // console.log($scope.PriceOffer_rec.items);
                            $scope.assignPriceOfferItemData($scope.PriceOffer_rec.items, currency_id, $scope.PriceOffer_rec.id);
                        }

                        angular.forEach($rootScope.arr_currency, function (obj) {
                            if (obj.id == currency_id)
                                $scope.PriceOffer_rec.currencys = obj;
                        });

                        if (res.data.response.OfferMethod != undefined) {
                            $scope.arr_OfferMethod = res.data.response.OfferMethod;

                            angular.forEach($scope.arr_OfferMethod, function (obj) {
                                //console.log(obj);
                                if (obj.id == res.data.response.offerMethodID)
                                    $scope.PriceOffer_rec.offer_method_ids = obj;
                            });
                        }
                        $scope.PriceOffer_rec.offered_by = res.data.response.first_name + ' ' + res.data.response.last_name;
                        $scope.showLoader = false;
                    }
                    else
                        $scope.showLoader = false;
                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
                });
        } else {

            // pre data api call for price add form 
            $scope.arr_OfferMethod = [];

            var pricePreDataUrl = $scope.$root.sales + "crm/crm/price-form-predata";
            $http
                .post(pricePreDataUrl, {
                    'token': $scope.$root.token,
                    'crm_id': $stateParams.id,
                    'module_type': 1
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.arr_OfferMethod = res.data.response.OfferMethod;
                        angular.forEach($rootScope.prooduct_arr, function (obj) {
                            obj.disableCheck = 0;
                            obj.chk = false;
                        });
                    }
                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
                });


            // 1 type for price offer
            $scope.PriceOffer_rec.priceType = 1;
            $scope.showLoader = false;
            $scope.deletebtn = true;
            $scope.PriceOffer_check_readonly = false;
        }
    }

    function predicateBy(prop) {
        return function (a, b) {
            if (parseFloat(a[prop]) > parseFloat(b[prop])) {
                return 1;
            } else if (parseFloat(a[prop]) < parseFloat(b[prop])) {
                return -1;
            }
            return 0;
        }
    }


    $scope.assignPriceOfferItemData = function (itemsdata, currency_id, price_id) {
        //console.log(itemsdata);
        //$scope.tbl_records.data
        $scope.tbl_records = {
            'headers': {
                'top_header': ['Item', 'Description','Category', 'UOM', 'StdPrice', 'priceoffer', 'lCY', 'Min', 'Max'],
                'inner_header': ['Min', 'Discount', 'Price', 'actualDiscount', 'priceOfferLCY'],
            },
            'data': []
        };
        angular.forEach($rootScope.prooduct_arr, function (obj) {

            obj.disableCheck = 0;
            obj.chk = false;
        });
        angular.forEach(itemsdata, function (obj) {
            $scope.singleSelectedItem = {};
            // $scope.directiveSelectedPriceItems = {};
            $scope.directiveSelectedPriceItems = [];
            var newPrice = "";
            // console.log(obj);
            var standard_price = (obj.standard_price != null) ? obj.standard_price : 0;
            obj.arr_unit_of_measure = obj.arr_units;

            if (obj.arr_unit_of_measure != undefined) {
                if (obj.arr_unit_of_measure[0].unit_id != obj.arr_unit_of_measure[0].ref_unit_id)
                    newPrice = parseFloat(obj.itemOfferPrice) / obj.arr_unit_of_measure[0].ref_quantity;
                else
                    newPrice = parseFloat(obj.itemOfferPrice) / obj.arr_unit_of_measure[0].quantity;
            } else
                newPrice = parseFloat(obj.itemOfferPrice);

            //console.log(newPrice);

            if (currency_id != $scope.$root.defaultCurrency)
                newPrice = parseFloat(newPrice) / parseFloat($scope.currencyConversionRate);
            //console.log(newPrice);

            obj.ItemConvertedAmount = parseFloat(newPrice).toFixed(2);
            //console.log($scope.currencyConversionRate);
            $scope.singleSelectedItem.Item = obj.Item_Code;
            $scope.singleSelectedItem.arr_unit_of_measure = obj.arr_units;
            $scope.singleSelectedItem.StdPrice = parseFloat(standard_price);

            $scope.singleSelectedItem.StdPrice2 = parseFloat(standard_price);
            $scope.singleSelectedItem.StdPricelCY2 = parseFloat(standard_price);

            $scope.singleSelectedItem.StdPricelCY = parseFloat(standard_price); //obj.ItemConvertedAmount;
            $scope.singleSelectedItem.priceoffer = parseFloat(obj.itemOfferPrice); //Number(obj.ItemConvertedAmount); //
            $scope.singleSelectedItem.lCY = obj.ItemConvertedAmount; //parseFloat(obj.standard_price); //
            $scope.singleSelectedItem.priceID = obj.priceID;

            $scope.singleSelectedItem.uomID = parseFloat(obj.uomID);

            if (obj.minQty > 0) {
                $scope.singleSelectedItem.Min = Number(obj.minQty);
                $scope.singleSelectedItem.prev_Min = Number(obj.minQty);
            }
            else {
                $scope.singleSelectedItem.Min = '';
                $scope.singleSelectedItem.prev_Min = '';
            }

            if (obj.maxQty > 0) {
                $scope.singleSelectedItem.Max = Number(obj.maxQty);
                $scope.singleSelectedItem.prev_Max = Number(obj.maxQty);
            }
            else {
                $scope.singleSelectedItem.Max = '';
                $scope.singleSelectedItem.prev_Max = '';
            }

            $scope.singleSelectedItem.module = 1; // crm and customer
            $scope.singleSelectedItem.min_max_price = obj.min_max_price;
            $scope.singleSelectedItem.minAllowedQty = obj.minAllowedQty;
            $scope.singleSelectedItem.maxAllowedQty = obj.maxAllowedQty;

            $scope.singleSelectedItem.Category = obj.category;

            $scope.singleSelectedItem.Description = obj.Item_Description;
            $scope.singleSelectedItem.id = obj.id;
            $scope.singleSelectedItem.ItemID = obj.itemID;
            $scope.singleSelectedItem.price_id = price_id;

            $scope.singleSelectedItem.UOM = (obj.arr_unit_of_measure != undefined) ? obj.arr_unit_of_measure[0] : ''; // it will be replaced if found

            angular.forEach(obj.arr_unit_of_measure, function (uom_obj) {
                if (obj.uomID == uom_obj.id)
                    $scope.singleSelectedItem.UOM = uom_obj;
            });
            $scope.directiveSelectedPriceItems.itemData = $scope.singleSelectedItem;
            $scope.directiveSelectedPriceItems.discountDetails = [];
            $scope.directiveSelectedPriceItems.discountDetails.rows = [];
            $scope.directiveSelectedPriceItems.discountType = [];
            /* console.log('Before pushing into data');
            console.log($scope.directiveSelectedPriceItems); */

            var volumeDiscountType = 0

            if (obj.itemsVolume.length > 0) {
                $scope.directiveSelectedPriceItems.discountDetails.isDiscountAvailable = obj.itemsVolume.length;

                angular.forEach(obj.itemsVolume, function (obj1) {
                    $scope.singleSelectedvolume = {};

                    var netvolumepercentage = 0;
                    var netvolumeprice = 0;
                    $scope.singleSelectedvolume.discount = Number(obj1.discount);

                    if (obj1.discountType == 1) {
                        netvolumepercentage = ((parseFloat(obj1.discount)) / 100) * parseFloat(obj.itemOfferPrice);
                        netvolumeprice = parseFloat(obj.itemOfferPrice) - parseFloat(netvolumepercentage);
                        $scope.singleSelectedvolume.actualDiscount = netvolumepercentage;
                    } else if (obj1.discountType == 2) {
                        netvolumeprice = parseFloat(obj.itemOfferPrice) - parseFloat(obj1.discount);
                        $scope.singleSelectedvolume.actualDiscount = parseFloat(obj1.discount);
                    }

                    $scope.singleSelectedvolume.actualDiscount = $scope.singleSelectedvolume.actualDiscount.toFixed(2); // change it to default (set by user)
                    netvolumeprice = netvolumeprice.toFixed(2); // change it to default (set by user)
                    $scope.singleSelectedvolume.Price = netvolumeprice;
                    if ($scope.currencyConversionRate != undefined)
                        $scope.singleSelectedvolume.priceOfferLCY = (netvolumeprice / $scope.currencyConversionRate);
                    else
                        $scope.singleSelectedvolume.priceOfferLCY = netvolumeprice;

                    $scope.singleSelectedvolume.id = obj1.id;
                    // $scope.singleSelectedvolume.discountType = obj1.discountType;

                    volumeDiscountType = obj1.discountType;

                    $scope.singleSelectedvolume.Min = Number(obj1.min);
                    $scope.directiveSelectedPriceItems.discountDetails.rows.push($scope.singleSelectedvolume);
                });
            }

            if (volumeDiscountType == 2)
                $scope.directiveSelectedPriceItems.discountType = $scope.list_type[1];
            else
                $scope.directiveSelectedPriceItems.discountType = $scope.list_type[0];

            /* var item = $filter("filter")($rootScope.prooduct_arr, {
                id: obj.itemID
            });
            var idx = $rootScope.prooduct_arr.indexOf(item[0]);
            if ($rootScope.prooduct_arr[idx] != undefined) {
                $rootScope.prooduct_arr[idx].disableCheck = 1;
                $rootScope.prooduct_arr[idx].chk = true;
            } */

            $scope.directiveSelectedPriceItems.discountDetails.rows.sort(predicateBy("Min"));
            $scope.tbl_records.data.push($scope.directiveSelectedPriceItems);
        });
    }

    // select for add Items in price module.

    $scope.searchKeywordItem = {};
    $scope.selectedRecFromModalsItem = [];
    $scope.selectPriceItems = function (item_paging,sort_column,sortform) {
        // $rootScope.updateSelectedGlobalData("item");
        if (item_paging){
            $scope.searchKeywordItem = {};
            $scope.selectedRecFromModalsItem = [];
        }

        if ($scope.PriceOffer_rec.offer_date == '' || $scope.PriceOffer_rec.offer_valid_date == '') {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Start Date and End Date']));
            return;
        }
        if (!$scope.PriceOffer_rec.id > 0) {
            $scope.addPriceOffer($scope.PriceOffer_rec);
        }

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.postData.start_date = $scope.PriceOffer_rec.offer_date;
        $scope.postData.end_date = $scope.PriceOffer_rec.offer_valid_date;
        $scope.postData.price_type = 1;
        $scope.productsArr = [];
        

        $scope.postData.searchKeyword = $scope.searchKeywordItem;

        var itemListingApi = $scope.$root.stock + "products-listing/item-popup";
        // $scope.itemPOTableData ={};
        $scope.showLoader = true;
        $http
        .post(itemListingApi, $scope.postData )
        .then(function (res) {
            $scope.itemPOTableData = res;
            $scope.productsArr = [];
            // $scope.selectedRecFromModalsItem = [];
            $scope.PendingSelectedItems = [];

            if (res.data.ack == true) {
                $scope.total = res.data.total;
                $scope.item_paging.total_pages = res.data.total_pages;
                $scope.item_paging.cpage = res.data.cpage;
                $scope.item_paging.ppage = res.data.ppage;
                $scope.item_paging.npage = res.data.npage;
                $scope.item_paging.pages = res.data.pages;

                $scope.total_paging_record = res.data.total_paging_record;
                
                $scope.record_data = $scope.tempProdArr;

                angular.forEach(res.data.response, function (value, key) {
                    if (key != "tbl_meta_data") {
                        $scope.productsArr.push(value);
                    }
                });
                
                angular.element('#PriceItemsModal').modal({
                    show: true
                });
                $scope.showLoader = false;

                /* var getProductUomUrl = $scope.$root.stock + "products-listing/get-product-uom";
                $scope.UOMArr = [];
                $scope.salePriceArr = [];

                $http
                    .post(getProductUomUrl, { 'token': $scope.$root.token,'start_date': $scope.postData.start_date,'end_date': $scope.postData.end_date })
                    .then(function (res) {

                        $scope.showLoader = false;

                        if (res.data.ack == true) {
                            $scope.salePriceArr = res.data.response;
                            $scope.UOMArr = res.data.responseUOM;

                            angular.forEach($scope.salePriceArr, function (obj) {
                                var item = $filter("filter")($scope.productsArr, { id: obj.product_id });
                                var idx = $scope.productsArr.indexOf(item[0]);
                                if (idx != -1) {
                                    $scope.productsArr[idx].standard_purchase_cost = obj.standard_price;
                                    $scope.productsArr[idx].maxPurchasePrice = obj.MaxPrice;
                                    $scope.productsArr[idx].minPurchaseQty = obj.min_qty;
                                    $scope.productsArr[idx].maxPurchaseQty = obj.max_qty;
                                    $scope.productsArr[idx].purchaseUOMid = obj.uom_id;

                                    angular.forEach($scope.UOMArr, function (obj2) {

                                        if(obj2.product_id == obj.product_id && obj.uom_id == obj2.cat_id && obj2.cat_id != obj2.ref_unit_id && obj2.ref_quantity ){

                                            $scope.productsArr[idx].standard_purchase_cost = parseFloat(obj.standard_price)/parseFloat(obj2.ref_quantity);
                                            $scope.productsArr[idx].standard_price = parseFloat(obj.standard_price)/parseFloat(obj2.ref_quantity);
                                            $scope.productsArr[idx].standard_price1 = parseFloat(obj.standard_price)/parseFloat(obj2.ref_quantity);

                                        }
                                    });
                                }
                            }); 
                        }
                    }).catch(function (message) {
                        $scope.showLoader = false;
                        
                        throw new Error(message.data);
                        console.log(message.data);
                    }); */

            }
            else {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            }
        });
        /* $scope.filterPriceItem = {};
        $scope.filterPriceItem.selectedAllPriceItem = true;
        $scope.tempProdArr = [];
        $scope.tempProdArr = $rootScope.prooduct_arr;
        for (var i = 0; i < $scope.tempProdArr.length; i++) {
            if ($scope.tempProdArr[i].chk) {
                $scope.tempProdArr[i].disableCheck = 1;
            }
            else {
                $scope.filterPriceItem.selectedAllPriceItem = false;
            }
        } */
    }

    //codemark
    //ADD/Edit Price Offer Form Record
    $scope.addPriceOffer = function (PriceOffer_rec, param, discardOption, moduleType) {
        if (PriceOffer_rec.name == undefined || PriceOffer_rec.name == "") {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Name']));
            return false;
        }

        if (PriceOffer_rec.offer_date == undefined || PriceOffer_rec.offer_date == "") {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Start Date']));
            return false;
        }

        if (PriceOffer_rec.offer_valid_date == undefined || PriceOffer_rec.offer_valid_date == "") {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['End Date']));
            return false;
        }

        if (PriceOffer_rec.currencys == undefined || PriceOffer_rec.currencys.id == undefined) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Currency']));
            return false;
        }

        //console.log("inside add price offer");
        PriceOffer_rec.moduleID = $stateParams.id;
        PriceOffer_rec.moduleType = 1;

        if(PriceOffer_rec.offeredByArr){
            PriceOffer_rec.offered_by = PriceOffer_rec.offeredByArr.name;
            PriceOffer_rec.Offered_By = PriceOffer_rec.offeredByArr.name;
        }

        /* if (Number(PriceOffer_rec.offeredByID == 0) && $scope.selectedSalespersons.length > 0)// || PriceOffer_rec.offered_by.length == 0) 
        {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Offered By']));
            return false;
        } */

        var min_max_qty_error = '';
        var discount_details_error = '';
        angular.forEach($scope.tbl_records.data, function (obj_item) {
            if ((Number(obj_item.itemData.Min) > 0 && Number(obj_item.itemData.Max) == 0) || (Number(obj_item.itemData.Min) == 0 && Number(obj_item.itemData.Max) > 0)) {
                min_max_qty_error += obj_item.itemData.Item + ', ';
            }

            if (obj_item.discountDetails.rows.length > 0) {
                angular.forEach(obj_item.discountDetails.rows, function (discount) {
                    if (Number(discount.Min) == 0) {
                        if (!discount_details_error.includes(obj_item.itemData.Item))
                            discount_details_error += obj_item.itemData.Item + ', ';
                    }
                });

            }
        });
        if (min_max_qty_error.length > 0) {
            min_max_qty_error = min_max_qty_error.slice(0, -2);
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(342) + min_max_qty_error);
            return false;
        }
        if (discount_details_error.length > 0) {
            discount_details_error = discount_details_error.slice(0, -2);
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(343, [discount_details_error]));
            return false;
        }
        

        /* else if(param==1 && (PriceOffer_rec.offeredByID == undefined || PriceOffer_rec.offeredByID == $rootScope.userId)){
            PriceOffer_rec.offeredByID == $rootScope.userId;
            PriceOffer_rec.offeredByID == $rootScope.userId;
        } */

        //$scope.PriceOffer_rec.offered_by = PriceOffer_rec.priceOfferedBy;
        //$scope.PriceOffer_rec.offeredByID = PriceOffer_rec.priceOfferedBy;
        // console.log($scope.tbl_records.data);
        PriceOffer_rec.items = [];
        angular.forEach($scope.tbl_records.data, function (item) {
            if (item.discountDetails.rows.length > 0) {
                item.itemData.discountDetails = item.discountDetails.rows;
                item.itemData.type = 1;
                item.itemData.discountType = item.discountType.id;
            }

            PriceOffer_rec.items.push(item.itemData);
        });

        /* console.log($scope.tbl_records.data);
        console.log($scope.tbl_records.data.length); */

        if ($scope.tbl_records.data.length == 0 && discardOption == 1) {

            ngDialog.openConfirm({
                template: 'modalDiscardPriceOfferEmptyItemDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                // remove complete price offer
                SubmitPrice.deletePriceOffer($scope.priceOfferRec)
                    .then(function (result) {
                        if (result.ack == true) {
                            if (param == 1) {
                                $scope.getPriceOffer(1);
                            }
                        }
                    }, function (error) {
                        console.log(error);
                    });
            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
            return false;
        }


        if (PriceOffer_rec.priceType != 3 && PriceOffer_rec.priceType != 2)
            PriceOffer_rec.priceType = 1;

        SubmitPrice.addPrice(PriceOffer_rec, $scope.selectedCRMLoc)
            .then(function (result) {
                if (result.ack == true) {
                    if (PriceOffer_rec.id > 0) {
                        $scope.formData.price_list_id = PriceOffer_rec.id;
                    } else {
                        $scope.formData.price_list_id = result.id;
                        $scope.PriceOffer_rec.id = result.id;
                    }
                    if (param == 1) {
                        $scope.getPriceOffer(moduleType);
                        // $scope.PriceOffer_check_readonly = true;
                    }

                    // $scope.PriceOffer_check_readonly = true;
                }
            }, function (error) {
                console.log(error);
            });
    }

    $scope.PendingSelectedPriceItems = [];

    $scope.checkedPriceItem = function (priceitem) {
        // $scope.selectedAllPriceItem = false;

        for (var i = 0; i < $rootScope.prooduct_arr.length; i++) {

            if (priceitem == $rootScope.prooduct_arr[i].id) {
                if ($rootScope.prooduct_arr[i].chk == true)
                    $rootScope.prooduct_arr[i].chk = false;
                else
                    $rootScope.prooduct_arr[i].chk = true;
            }
        }
    }

    $scope.checkAllPriceItem = function (val, category, brand, unit) {
        $scope.PendingSelectedPriceItems = [];
        /* console.log(category);
        console.log(brand);
        console.log(unit); */

        if (val == true) {
            angular.forEach($scope.tempProdArr, function (obj) {

                obj.chk = false;

                if (category != undefined && category == obj.category_id && brand != undefined && brand == obj.brand_id && unit != undefined && unit == obj.unit_id) {
                    obj.chk = true;
                } else if (category != undefined && category == obj.category_id && brand != undefined && brand == obj.brand_id) {
                    obj.chk = true;
                } else if (category != undefined && category == obj.category_id && unit != undefined && unit == obj.unit_id) {
                    obj.chk = true;
                } else if (brand != undefined && brand == obj.brand_id && unit != undefined && unit == obj.unit_id) {
                    obj.chk = true;
                } else if (category != undefined && category == obj.category_id) {
                    obj.chk = true;
                } else if (brand != undefined && brand == obj.brand_id) {
                    obj.chk = true;
                } else if (unit != undefined && unit == obj.unit_id) {
                    obj.chk = true;
                } else if (category == undefined && brand == undefined && unit == undefined) {
                    obj.chk = true;
                }
                $scope.PendingSelectedPriceItems.push(obj);
            });
        } else {
            angular.forEach($scope.tempProdArr, function (obj) {
                if (!obj.disableCheck)
                    obj.chk = false;
            });
            $scope.PendingSelectedPriceItems = [];
        }
    }

    $scope.tbl_records = {
        'headers': {
            'top_header': ['Item', 'Description', 'Category', 'UOM', 'StdPrice', 'priceoffer', 'lCY', 'Min', 'Max'],
            'inner_header': ['Min', 'Discount', 'Price', 'actualDiscount', 'priceOfferLCY'],
        },
        'data': []
    };

    $scope.adddirectiveSelectedPriceItems = function (obj) {
        console.log(obj);
        $scope.singleSelectedItem = {};
        $scope.directiveSelectedPriceItems = {};
        //$scope.priceItemConvertedAmount(obj);
        var standard_price = (obj.standard_price != null) ? obj.standard_price : 0;
        var newPrice = "";
        obj.arr_unit_of_measure = obj.arr_units.response;

        if (obj.arr_unit_of_measure != undefined) {
            if (obj.arr_unit_of_measure[0].unit_id != obj.arr_unit_of_measure[0].ref_unit_id)
                newPrice = parseFloat(standard_price) / obj.arr_unit_of_measure[0].ref_quantity;
            else
                newPrice = parseFloat(standard_price) / obj.arr_unit_of_measure[0].quantity;
        } else
            newPrice = parseFloat(standard_price);

        if ($scope.PriceOffer_rec.currencys.id != $scope.$root.defaultCurrency)
            newPrice = parseFloat(newPrice) * parseFloat($scope.currencyConversionRate);

        obj.ItemConvertedAmount = parseFloat(newPrice).toFixed(2);


        //console.log($scope.currencyConversionRate);        

        $scope.singleSelectedItem.Item = obj.product_code;
        $scope.singleSelectedItem.Min = '';//obj.minSaleQty;
        $scope.singleSelectedItem.prev_Min = '';//obj.minSaleQty;
        $scope.singleSelectedItem.Max = '';//obj.maxSaleQty;
        $scope.singleSelectedItem.prev_Max = '';//obj.maxSaleQty;
        $scope.singleSelectedItem.module = 1; // crm or customer
        $scope.singleSelectedItem.min_max_price = obj.min_max_price;
        $scope.singleSelectedItem.minAllowedQty = obj.minAllowedQty;
        $scope.singleSelectedItem.maxAllowedQty = obj.maxAllowedQty;
        $scope.singleSelectedItem.Category = obj.category_name;

        $scope.singleSelectedItem.arr_unit_of_measure = obj.arr_units.response;
        $scope.singleSelectedItem.StdPrice = parseFloat(standard_price);
        $scope.singleSelectedItem.StdPricelCY = parseFloat(standard_price); //obj.ItemConvertedAmount;
        $scope.singleSelectedItem.priceoffer = Number(obj.ItemConvertedAmount);
        $scope.singleSelectedItem.lCY = parseFloat(standard_price);
        // $scope.singleSelectedItem.Min = '';
        // $scope.singleSelectedItem.Max = '';
        $scope.singleSelectedItem.Description = obj.description;
        $scope.singleSelectedItem.ItemID = obj.id;
        if (obj.arr_unit_of_measure != undefined)
            $scope.singleSelectedItem.UOM = obj.arr_unit_of_measure[0];
        else
            $scope.singleSelectedItem.UOM = '';

        $scope.directiveSelectedPriceItems.itemData = $scope.singleSelectedItem;
        $scope.directiveSelectedPriceItems.discountDetails = [];
        $scope.directiveSelectedPriceItems.discountDetails.rows = [];
        /* console.log('Before pushing into data');
        console.log($scope.directiveSelectedPriceItems); */
        $scope.tbl_records.data.push($scope.directiveSelectedPriceItems);
    }

    $scope.addPendingPriceItems = function () {

        // $scope.tbl_records.data = [];
        $scope.PendingSelectedPriceItems = [];
        $scope.temp_PendingSelectedPriceItems = [];

        var selected_items_codes = '';
        var selected_items = '';
        var already_added_items = '';
        angular.forEach($scope.selectedRecFromModalsItem, function (obj, key) {
            if(obj)
            {

                var item = $filter("filter")($scope.tempProdArr, { key: obj.key });
                if(item.length > 0)
                already_added_items += item[0].value + ', ';
            }
        });

        if(already_added_items.length > 0)
        {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(548, [already_added_items.substring(0, already_added_items.length - 2)]));
            return;
        }


        angular.forEach($scope.selectedRecFromModalsItem, function (obj, key) {

            if(obj)
            {
                //  var item = $filter("filter")($scope.productsArr, { id: obj.key }, true);
                /*
                $scope.tempProdArr.push(item[0]); */

                $scope.temp_PendingSelectedPriceItems.push(obj.record);
                selected_items_codes += obj.value + ', ';
                selected_items += obj.key + ', ';
            }
        });
        selected_items += '0';

        // here should be the HTTP call for check
        var checkPriceApi = $rootScope.sales + "crm/crm/get-item-sales-prices-in-date-range";

        var postData = {};
        postData.token = $scope.$root.token;
        postData.selected_items = selected_items;
        postData.date_from = $scope.PriceOffer_rec.offer_date;
        postData.date_to = $scope.PriceOffer_rec.offer_valid_date;
        postData.type = 1;
        var no_prices_products = '';
        $http
            .post(checkPriceApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.product_prices = res.data.response;

                    angular.forEach($scope.temp_PendingSelectedPriceItems, function (obj) {
                        if(Number(obj.id) > 0)
                        {
                            var needle = $filter("filter")($scope.product_prices, { product_id: obj.id });
                            if (needle.length > 0) {
                                obj.min_max_price = needle[0].min_max_sale_price;
                                obj.minAllowedQty = needle[0].min_qty;
                                obj.maxAllowedQty = needle[0].max_qty;
                                obj.standard_price = needle[0].standard_price;

                                /* angular.forEach(needle[0].productUOM,function(obj2){
                                    if(obj2.cat_id == needle[0].uom_id && obj2.cat_id != obj2.ref_unit_id){
                                        obj.standard_price = parseFloat(needle[0].standard_price)/parseFloat(obj2.ref_quantity);
                                    }
                                }); */

                                $scope.PendingSelectedPriceItems.push(obj);
                                $scope.tempProdArr.push(obj);
                            }
                            else {
                                var _item = $filter("filter")($scope.selectedRecFromModalsItem, { key: obj.id });
                                if (_item.length > 0) {
                                    _item[0].chk = false;
                                    _item[0].disableCheck = 0;
                                }
                                no_prices_products += obj.product_code + ', ';
                            }
                        }
                    });
                    /* if (no_prices_products.length > 0) {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(344) + no_prices_products.substring(0, no_prices_products.length - 2));
                    } */

                    if (no_prices_products.length > 0) {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(620, [no_prices_products.substring(0, no_prices_products.length - 2), 'Sales Information']));
                        // return false;
                    }

                    /* ============================================================ */
                    // angular.copy($scope.temp_PendingSelectedPriceItems, $scope.PendingSelectedPriceItems);
                    // check for currency conversion rate if its not in base currency.


                    var currency_id = "";

                    if ($scope.PriceOffer_rec.currencys != undefined)
                        currency_id = $scope.PriceOffer_rec.currencys.id;

                    if (!currency_id > 0) {
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Currency']));
                        return;
                    }

                    if (currency_id != $scope.$root.defaultCurrency) {


                        var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
                        $http
                            .post(currencyURL, {
                                'id': $scope.PriceOffer_rec.currencys.id,
                                'token': $scope.$root.token
                            })
                            .then(function (res) {
                                if (res.data.ack == true) {
                                    if (res.data.response.conversion_rate == null) {
                                        toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                                        return;
                                    }

                                    $scope.currencyConversionRate = parseFloat(res.data.response.conversion_rate);
                                    //console.log($scope.currencyConversionRate);
                                } else {
                                    toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                                    return;
                                }

                                $scope.selectedPriceItems = $scope.PendingSelectedPriceItems;

                                if ($scope.tbl_records.data != undefined) {
                                    if ($scope.tbl_records.data.length > 0) {

                                        angular.forEach($scope.selectedPriceItems, function (obj) {
                                            var isContains = false;

                                            angular.forEach($scope.tbl_records.data, function (obj2) {
                                                //console.log(obj2.itemData.ItemID);

                                                if (obj.id == obj2.itemData.ItemID) {
                                                    isContains = true;
                                                }
                                            });

                                            if (!isContains) {
                                                $scope.adddirectiveSelectedPriceItems(obj);
                                            }
                                        });
                                    } else {
                                        angular.forEach($scope.selectedPriceItems, function (obj) {
                                            $scope.adddirectiveSelectedPriceItems(obj);
                                        });
                                    }
                                } else {
                                    angular.forEach($scope.selectedPriceItems, function (obj) {
                                        $scope.adddirectiveSelectedPriceItems(obj);
                                    });
                                }
                            }).catch(function (message) {
                                $scope.showLoader = false;

                                throw new Error(message.data);
                                console.log(message.data);
                            });
                    } else {
                        $scope.currencyConversionRate = 1;
                        $scope.selectedPriceItems = $scope.PendingSelectedPriceItems;

                        if ($scope.tbl_records.data != undefined) {
                            if ($scope.tbl_records.data.length > 0) {

                                angular.forEach($scope.selectedPriceItems, function (obj) {
                                    var isContains = false;

                                    angular.forEach($scope.tbl_records.data, function (obj2) {
                                        //console.log(obj2.itemData.ItemID);

                                        if (obj.id == obj2.itemData.ItemID) {
                                            isContains = true;
                                        }
                                    });

                                    if (!isContains) {
                                        $scope.adddirectiveSelectedPriceItems(obj);
                                    }
                                });
                            } else {
                                angular.forEach($scope.selectedPriceItems, function (obj) {
                                    $scope.adddirectiveSelectedPriceItems(obj);
                                });
                            }
                        } else {
                            angular.forEach($scope.selectedPriceItems, function (obj) {
                                $scope.adddirectiveSelectedPriceItems(obj);
                            });
                        }
                    }
                }
                else {$scope.$root.getErrorMessageByCode(230)
                    if (selected_items.length > 1)
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(620, [selected_items_codes.substring(0, selected_items_codes.length - 2), 'Sales Information']));
                    
                        
                        
                    angular.forEach($rootScope.prooduct_arr, function (obj) {
                        obj.chk = false;
                        obj.disableCheck = 0;
                    });
                    return;
                }
            });
        /* ============================================================ */

        //console.log($scope.PendingSelectedPriceItems);
        //console.log($scope.tbl_records.data);

        angular.element('#PriceItemsModal').modal('hide');
    }

    $scope.clearPendingPriceItems = function () {
        $scope.PendingSelectedPriceItems = [];
        angular.element('#PriceItemsModal').modal('hide');
    }

    $scope.openPriceItemVolume = function (itemData) {

        console.log(itemData);

        angular.element('#PriceVolumeModal').modal({
            show: true
        });
    }

    $scope.ShowAddPriceError = function () {
        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Price Offer']));
    }

    $scope.ShowVolRevenueRebateError = function () {
        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Volume Rebate']));
    }

    $scope.ShowVolRevenueRebateError = function () {
        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Revenue Rebate']));
    }

    $scope.loadDropDownsData_Price = function (item_id, type) {

        $scope.arr_unit_of_measure = [];

        var unitUrl = $scope.$root.stock + "unit-measure/get-unit-setup-list-category";
        $http
            .post(unitUrl, {
                product_id: item_id,
                'token': $scope.$root.token
            })
            .then(function (unit_data) {
                if (unit_data.data.ack == 1) {
                    angular.forEach(unit_data.data.response, function (obj) {

                        $scope.arr_unit_of_measure.push(obj);
                    });
                }
                //$scope.arr_unit_of_measure.push({'id':'-1','title':'++ Add New ++'});
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.getPriceVolDiscouts = function () {

        /* if ($scope.$root.price_type == 1)
            var ApiAjax = $scope.$root.sales + "crm/crm/get-cust-price-offer-volume-listing";
        else
            var ApiAjax = $scope.$root.sales + "crm/crm/get-cust-price-list-volume-listing"; */

        var ApiAjax = $scope.$root.sales + "crm/crm/get-price-volume-discount-listing";

        $scope.PriceOffer_volume_discdata = {};
        $scope.isVolumeDiscForm = false;
        $scope.isVolumeDiscListing = true;
        $scope.formData = {};

        //$scope.postData = { id: $scope.arrIds, price_volume_disc: 1, token: $scope.$root.token }
        $scope.postData = {
            id: $scope.PriceOffer_rec.id,
            token: $scope.$root.token
        }

        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res_price_vol) {
                ////console.log(res_price_vol);

                if (res_price_vol.data.ack == true) {
                    $scope.PriceOffer_volume_discdata = res_price_vol.data.response;
                }
            });

    };

    $scope.clear_salesperson_filter = function () {
        $scope.searchKeyword_offered = {};
    }

    $scope.searchKeyword_offered = {};
    $scope.getOffer_PriceOffer = function (isShow, item_paging) {

        $scope.showLoader = true;
        $scope.columns_pr = [];
        $scope.record_pr = {};
        $scope.searchKeyword_offered = {};
        $scope.title = 'Offered By';

        var GenSalePersonUrl = $scope.$root.sales + "crm/crm/get-crm-salesperson-ForOppCycle";

        var GenSalePersonPostData = {
            'id': $stateParams.id,
            'type': 2,
            'token': $scope.$root.token
        };

        $http
            .post(GenSalePersonUrl, GenSalePersonPostData)
            .then(function (res) {

                if (res.data.ack == true) {

                    $scope.record_pr = res.data.response;
                    $scope.showLoader = false;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_pr.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.element('#_CustPriceInfoEmplisting_model').modal({
                        show: true
                    });
                    return;
                } else {
                    $scope.record_pr = $rootScope.salesperson_arr;
                    $scope.showLoader = false;
                    angular.forEach($rootScope.salesperson_arr[0], function (val, index) {
                        $scope.columns_pr.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.element('#_CustPriceInfoEmplisting_model').modal({
                        show: true
                    });
                    return;
                }

            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    //codemark
    $scope.confirmOffer_PriceOffer = function (result) {

        $scope.PriceOffer_rec.offered_by = result.name;
        $scope.PriceOffer_rec.offeredByID = result.id;

        angular.element('#_CustPriceInfoEmplisting_model').modal('hide');
    }

    /*  Code for Multiple Location in Price Offer and Listings Start */

    $scope.selectedCRMLoc = [];
    $scope.arr_location = [];
    $scope.selCRMLocTooltip = "";
    $scope.isCRMLocChanged = false;

    $scope.getLocPriceOffer = function (item) {
        console.log("here 35464");
        // console.log(item);

        $scope.title = 'Locations';
        $scope.arr_location = [];

        if ($scope.arr_OfferLocation.length > 0) {

            angular.forEach($scope.arr_OfferLocation, function (obj) {
                obj.chk = false;

                if ($scope.selectedCRMLoc.length > 0) {
                    angular.forEach($scope.selectedCRMLoc, function (obj2) {
                        if (obj.id == obj2.id) {
                            obj.chk = true;
                        }
                    });
                }
                $scope.arr_location.push(obj);
            });

            angular.element('#CUSTLocModal').modal({
                show: true
            });
        } else {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
        }
    }

    $scope.checkAllCRMLoc = function (val) {

        if (val == true) {
            $scope.isCRMLocChanged = true;

            for (var i = 0; i < $rootScope.root_arr_location.length; i++) {
                $rootScope.root_arr_location[i].chk = true;
            }
        } else {
            for (var i = 0; i < $rootScope.root_arr_location.length; i++) {
                $rootScope.root_arr_location[i].chk = false;
            }
        }
    }

    $scope.selectCRMLoc = function (loc) {

        $scope.isCRMLocChanged = true;

        for (var i = 0; i < $rootScope.root_arr_location.length; i++) {

            if (loc.id == $rootScope.root_arr_location[i].id) {
                if ($rootScope.root_arr_location[i].chk == true) {
                    $rootScope.root_arr_location[i].chk = false;
                } else {
                    $rootScope.root_arr_location[i].chk = true;
                }
            }
        }
    }


    $scope.submitPendingSelectedCRMLoc = function () {

        $scope.PendingSelectedCRMLoc = [];

        angular.forEach($rootScope.root_arr_location, function (obj) {
            if (obj.chk == true) {
                $scope.PendingSelectedCRMLoc.push(obj);
            }
        });

        $scope.selectedCRMLoc = $scope.PendingSelectedCRMLoc;
        angular.element('#CUSTLocModal').modal('hide');
    }

    $scope.clearPendingSelectedCRMLoc = function () {
        $scope.PendingSelectedCRMLoc = [];
        //$scope.PendingselCRMLocTooltip = "";
        angular.element('#CUSTLocModal').modal('hide');
    }

    /*  Code for Multiple Location in Price Offer and Listings End */


    $scope.getCurrencyCode = function () {
        $scope.currency_code = this.rec.currency_ids.name;
    }

    $scope.showCRMPriceInfoEditForm = function () {
        $scope.PriceOffer_check_readonly = false;
    }

    $scope.showCRMPriceInfoListing = function () {
        $scope.CRMPriceInfoFormShow = false;
        $scope.CRMPriceInfoListingShow = true;
    }

    //Reset Price Offer Form
    $scope.resetPriceOfferForm = function (PriceOffer_rec) {
        $scope.PriceOffer_check_readonly = false;
        $scope.formData = {};
        $scope.PriceOffer_rec = {};
        $scope.PriceOffer_volume_discdata = {};
        $scope.counter = 0;
        $scope.arrVolumeForms = [1];
        $scope.formData.volume_1_id = 0;
        $scope.formData.volume_2_id = 0;
        $scope.formData.volume_3_id = 0;
        $scope.isPanelExpand = false;
        $scope.isClone = false;
        $scope.PriceOffer_rec.offered_by = '';//$rootScope.defaultUserName;
        $scope.PriceOffer_rec.offeredByID = 0;//$rootScope.userId;
        $scope.tbl_records.data = [];

        if ($rootScope.cust_current_edit_currency) {
            $scope.PriceOffer_rec.currencys = $rootScope.cust_current_edit_currency;
        } else {
            $scope.PriceOffer_rec.currencys = $scope.$root.defaultCurrency;
        }

        $scope.isAdded = false;

        $scope.PriceOffer_rec.offer_date = $scope.$root.get_current_date();
        $scope.PriceOffer_rec.offer_valid_date = '';
        $scope.PriceOffer_rec.name = '';
        //console.log($scope.PriceOffer_rec.currencys);
        /*          angular.forEach($rootScope.arr_currency, function (obj) {
                    if (obj.id == $rootScope.cust_current_edit_currency)
                        $scope.PriceOffer_rec.currencys = obj;
                });  */
    }

    /*&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&*/

    // convert to price list start
    //---------------------------------------------------------------

    $scope.moveToPriceList = function (id) {

        var pOfferUrl = $scope.$root.sales + "crm/crm/convertion-price-list";

        $http
            .post(pOfferUrl, {
                id: id,
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(621));
                    //$scope.getPriceOfferList();
                    $scope.getPriceOffer();
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(346));
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    // convert to price list End
    //---------------------------------------------------------------

    $scope.validateQtyItem = function (field, min, max, item) {

        if (field == 'min' && (Number(min) > Number(max))) {
            toaster.pop('error', 'Info', 'Minimum Qty must be less than Maximum Qty.');
            item.minOrderQty = null;
            return;
        }

        if (field == 'max' && (Number(max) < Number(min))) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(347));
            item.maxOrderQty = null;
            return;
        }
    }
    // not in use any more.
    $scope.checkQty_PriceOffer = function (field) {

        if (field == 'min' && (Number($scope.PriceOffer_rec.minOrderQty) > Number($scope.PriceOffer_rec.maxOrderQty))) {
            toaster.pop('error', 'Info', 'Minimum Qty must be less than Maximum Qty.');
            $scope.PriceOffer_rec.minOrderQty = null;
            return;
        }

        if (field == 'max' && (Number($scope.PriceOffer_rec.maxOrderQty) < Number($scope.PriceOffer_rec.minOrderQty))) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(347));
            $scope.PriceOffer_rec.maxOrderQty = null;
            return;
        }
    }

    $scope.checkVolQty = function (field) {

        if (field == 'min' && Number($scope.formData_vol_1.quantity_from) < Number($scope.PriceOffer_rec.minOrderQty)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(351) + $scope.PriceOffer_rec.minOrderQty);
            $scope.formData_vol_1.quantity_from = null;
            return false;
        }

        if (field == 'max' && Number($scope.formData_vol_1.quantity_to) > Number($scope.PriceOffer_rec.maxOrderQty)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(352) + $scope.PriceOffer_rec.maxOrderQty);
            $scope.formData_vol_1.quantity_to = null;
            return false;
        }
    }

    $scope.PriceOffer_validatePrice = function (price, item) {
        /* console.log(item.unit_of_measures);
         */
        console.log(price);
        console.log(item);

        if (price == undefined)
            return;

        var price_a = 0;
        var currency_id = 0;

        if (price != undefined)
            price_a = price;
        //price_a = $scope.PriceOffer_rec.credit_amount;

        /* if ($scope.PriceOffer_rec.old_price > 0) {
            if ($scope.PriceOffer_rec.old_price != Number(price)) {
    
                var priceupdateUrl = $scope.$root.sales + "crm/crm/update-price-volume-with-NewPrice";
    
                ngDialog.openConfirm({
                    template: 'ModalContinueUpdatePrice',
                    className: 'ngdialog-theme-default-custom'
                }).then(function (value) {
                    $http
                        .post(priceupdateUrl, {
                            'id': $scope.PriceOffer_rec.id,
                            'price': price,
                            token: $scope.$root.token
                        })
                        .then(function (res) {
    
                            if (res.data.ack == true) {
                                //$scope.getVolDiscouts_PriceOffer();
                                $scope.getPriceVolDiscouts();
                                
                            } else if (res.data.ack == 2) {
                                return true;
                            } else
                                toaster.pop('error', 'Update', 'Volume Discount Records can\'t be Updated!');
                        });
                }, function (reason) {
                    //console.log('Modal promise rejected. Reason: ', reason);
                });
            }
        } */


        if ($scope.PriceOffer_rec.currencys != undefined)
            currency_id = $scope.PriceOffer_rec.currencys.id;


        /*//console.log(currency_id + " Currency from form");
         //console.log(" Unit of measure from form:  " + $scope.PriceOffer_rec.unit_of_measures);
         //console.log(" Product Reference Unit of measure from form:  " +$scope.PriceOffer_rec.unit_of_measures.ref_unit_id);
         //console.log(" Product Base Unit of measure from form:  " +item.unit_id);
         //console.log(" Unit of measure Ref quantity from form:  " +$scope.PriceOffer_rec.unit_of_measures.ref_quantity);
         //console.log(" Unit of measure quantity from form:  " +$scope.PriceOffer_rec.unit_of_measures.quantity);*/

        //Number($scope.frmStdItemData.absolute_minimum_price) == 0 ||
        /*if ((Number(price_a) === undefined || Number(price_a) === 0) || currency_id == undefined) {
         toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(231, ['Currency','Amount']));
         $scope.PriceOffer_rec.price_offered = null;
         return;
         }*/

        // check if currency is not selected.
        //(Number(price_a) === undefined || Number(price_a) === 0) || currency_id == undefined

        if (currency_id == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Currency']));
            item.price_offered = null;
            return;
        }

        if (currency_id == $scope.$root.defaultCurrency) {
            item.price_offered = Number(price_a);

            var newPrice = 0;

            if (item.unit_of_measures != undefined) {

                if (item.unit_of_measures.unit_id != item.unit_id) {

                    if (item.unit_of_measures.unit_id != item.unit_of_measures.ref_unit_id)
                        newPrice = Number(price) / item.unit_of_measures.ref_quantity;
                    else
                        newPrice = Number(price) / item.unit_of_measures.quantity;
                } else
                    newPrice = Number(price);
            } else
                newPrice = Number(price);

            item.converted_price = Number(newPrice).toFixed(2);
        } else {
            var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
            $http
                .post(currencyURL, {
                    'id': $scope.PriceOffer_rec.currencys.id,
                    token: $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        if (res.data.response.conversion_rate == null) {
                            toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                            item.price_offered = null;
                            item.converted_price = null;
                            return;
                        }

                        var new_price = "";

                        if (item.unit_of_measures != undefined) {

                            if (item.unit_of_measures.unit_id != item.unit_id) {
                                if (item.unit_of_measures.unit_id != item.unit_of_measures.ref_unit_id)
                                    new_price = Number(price) / item.unit_of_measures.ref_quantity;
                                else
                                    new_price = Number(price) / item.unit_of_measures.quantity;
                            } else
                                new_price = Number(price);
                        } else
                            new_price = Number(price);

                        /*//console.log(" new price after unit of measure conversion:  " +new_price);
                         //console.log(" currency id from form:  " +$scope.PriceOffer_rec.currencys.id);
                         //console.log(" Company Default currency id:  " +$scope.$root.defaultCurrency);*/

                        if ($scope.PriceOffer_rec.currencys != undefined) {

                            if ($scope.PriceOffer_rec.currencys.id != $scope.$root.defaultCurrency)
                                newPrice = Number(new_price) / Number(res.data.response.conversion_rate);
                            else
                                newPrice = Number(new_price);
                        }

                        item.converted_price = Number(newPrice).toFixed(2);
                    } else {
                        toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                        item.price_offered = null;
                        item.converted_price = null;
                    }
                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
                });
        }
    }

    $scope.PriceOfferValItemsPrice = function (selectedPriceItems) {

        //console.log(selectedPriceItems);

        if ($scope.PriceOffer_rec.currencys != undefined)
            var currency_id = $scope.PriceOffer_rec.currencys.id;

        if (currency_id == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Currency']));
            item.price_offered = null;
            return;
        }

        if (currency_id == $scope.$root.defaultCurrency) {
            $scope.currencyConversionRate = 1;
        } else {
            var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
            $http
                .post(currencyURL, {
                    'id': $scope.PriceOffer_rec.currencys.id,
                    token: $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        if (res.data.response.conversion_rate == null) {
                            toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                            $scope.currencyConversionRate = 0;
                            return;
                        }
                        $scope.currencyConversionRate = res.data.response.conversion_rate;
                    } else {
                        toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                        $scope.currencyConversionRate = 0;
                    }
                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
                });
        }
    }

    /*   Price Offer Module End       */

    /*&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&*/
    /*&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&*/
    /*&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&*/
    /*&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&*/

    /*   Price List Module start       */



    $scope.CRMPricelistInfoFormShow = false;
    $scope.CRMPricelistInfoListingShow = true;

    //open Price List listing.
    $scope.searchKeyword_priceList = {};
    $scope.priceListTableData = {};
    $scope.getPriceOfferList = function (cp_type) {
        $scope.showLoader = true;
        $scope.PriceOffer_rec = {};

        $scope.breadcrumbs = [{
            'name': 'Sales & Customer',
            'url': '#',
            'style': ''
        }, {
            'name': 'Customer',
            'url': 'app.customer',
            'style': ''
        }, {
            'name': $scope.$root.bdname,
            'url': '#',
            'isActive': false
        }, {
            'name': 'Price / Price List',
            'url': '#',
            'isActive': false
        }];

        $scope.PriceOffer_rec.moduleID = $stateParams.id;
        $scope.PriceOffer_rec.moduleType = 1;
        $scope.PriceOffer_rec.priceType = '2,3';

        $scope.$root.priceCP_type = cp_type;

        $scope.CRMPricelistInfoFormShow = false;
        $scope.CRMPricelistInfoListingShow = true;

        $scope.CRMPriceInfoFormShow = false;
        $scope.CRMPriceInfoListingShow = false;
        
        if (cp_type == 2) {
            $scope.CRMPricelistInfoFormShow = false;
            $scope.CRMPricelistInfoListingShow = true;
        }
        else {
            $scope.CRMPriceInfoFormShow = false;
            $scope.CRMPriceInfoListingShow = true;
        }

        
        $scope.price_offer_clicked = false;

        var ApiAjax = $scope.$root.sales + "crm/crm/price-offer-listing";

        $scope.postData = {
            moduleID: $stateParams.id,
            moduleType: 1,
            priceType: '2,3',
            searchKeyword: $scope.searchKeyword_priceList,
            token: $scope.$root.token
        };

        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res) {
                $scope.price_list_record_data = {};

                if (res.data.ack == true) {
                    $scope.priceListTableData = res;

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record;

                    // $scope.price_list_record_data = res.data.record.result;
                    $scope.price_list_record_data = res.data.response;
                }
                $scope.showLoader = false;
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.showCRMPricelistEditForm = function () {
        $scope.PriceList_check_readonly = false;
    }

    //open Price List Form in edit mode.
    $scope.OpenPriceListForm = function (event, id, mode) {
        $scope.viewmode = 0;

        $scope.priceListType = 'List';

        $scope.list_type = [{
            'name': 'Percentage',
            'id': 1
        }, {
            'name': 'Value',
            'id': 2
        }];

        $scope.resetPriceOfferForm();

        var p_id = (Number(id) > 0) ? id : 0;
        $scope.tempProdArr = [];

        var itemListingApi = $scope.$root.stock + "products-listing/item-popup";

        $scope.showLoader = true;

        $http
        .post(itemListingApi, { 'token': $scope.$root.token, 'price_id':p_id })
        .then(function (res) {
            if (res.data.ack == true) {
                angular.forEach(res.data.response, function (value, key) {
                    if (key != "tbl_meta_data") {
                        $scope.tempProdArr.push(value);
                    }
                });                
        
                // if($scope.tempProdArr.length == 0)
                //     $scope.tempProdArr.push({'id':0});
                
                $scope.showLoader = false;
            }
            else
            {
                // $scope.tempProdArr.push({'id':0});
                $scope.showLoader = false;
            }
        });

        $scope.CRMPricelistInfoFormShow = true;
        $scope.CRMPricelistInfoListingShow = false;

        $scope.deletebtn = false;

        if (id != undefined) {

            /* if (mode == 1)
                $scope.PriceList_check_readonly = true;
            else if (mode == 0)
                $scope.PriceList_check_readonly = false; */

            if (mode == 1)
                $scope.PriceOffer_check_readonly = true;
            else if (mode == 0)
                $scope.PriceOffer_check_readonly = false;

            var pOfferUrl = $scope.$root.sales + "crm/crm/get-price-data";
            $scope.PriceOffer_rec = {};
            $scope.arrIds = [];
            $scope.showLoader = true;
            $http
                .post(pOfferUrl, {
                    'id': id,
                    'moduleID': $stateParams.id,
                    'moduleType': 1,
                    'priceType': '2,3',
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {

                        $scope.showLoader = false;
                        $scope.PriceOffer_rec = res.data.response;
                        $scope.PriceOffer_rec.crm_id = $stateParams.id;
                        $scope.PriceOffer_rec.offer_date = res.data.response.start_date;
                        $scope.PriceOffer_rec.offer_valid_date = res.data.response.end_date;

                        $scope.PriceOffer_rec.id = res.data.response.id;
                        $scope.arrIds.push(res.data.response.id);

                        var currency_id = 0;

                        /* if (res.data.response.currencyID > 0)
                            currency_id = res.data.response.currencyID;
                        else */
                        {
                            if ($rootScope.cust_current_edit_currency)
                                currency_id = $rootScope.cust_current_edit_currency.id;
                            else
                                currency_id = ($scope.$root.defaultCurrency.id != undefined) ? $scope.$root.defaultCurrency.id : $scope.$root.defaultCurrency;
                        }

                        if (currency_id != $scope.$root.defaultCurrency) {

                            var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
                            $http
                                .post(currencyURL, {
                                    'id': currency_id,
                                    'token': $scope.$root.token
                                })
                                .then(function (res) {
                                    if (res.data.ack == true) {
                                        if (res.data.response.conversion_rate == null) {
                                            toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                                            return;
                                        }
                                        $scope.currencyConversionRate = parseFloat(res.data.response.conversion_rate);
                                        $scope.assignPriceOfferItemData($scope.PriceOffer_rec.items, currency_id, $scope.PriceOffer_rec.id);
                                    } else {
                                        toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
                                        return;
                                    }
                                });
                        } else {
                            // console.log($scope.PriceOffer_rec.items);
                            $scope.assignPriceOfferItemData($scope.PriceOffer_rec.items, currency_id, $scope.PriceOffer_rec.id);
                        }

                        angular.forEach($rootScope.arr_currency, function (obj) {
                            if (obj.id == currency_id)
                                $scope.PriceOffer_rec.currencys = obj;
                        });

                        if (res.data.response.OfferMethod != undefined) {
                            $scope.arr_OfferMethod = res.data.response.OfferMethod;

                            angular.forEach($scope.arr_OfferMethod, function (obj) {
                                //console.log(obj);
                                if (obj.id == res.data.response.offerMethodID)
                                    $scope.PriceOffer_rec.offer_method_ids = obj;
                            });
                        }
                        var firstname = (res.data.response.first_name != null) ? res.data.response.first_name : '';
                        var lastname = (res.data.response.last_name != null) ? res.data.response.last_name : '';
                        $scope.PriceOffer_rec.offered_by = firstname + ' ' + lastname;

                    }
                    else
                        $scope.showLoader = false;
                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
                });
        }
        else {
            $scope.arr_OfferLocation = [];
            $scope.arr_OfferMethod = [];

            $scope.PriceOffer_rec.priceType = 2;

            var pricePreDataUrl = $scope.$root.sales + "crm/crm/price-form-predata";
            $http
                .post(pricePreDataUrl, {
                    'token': $scope.$root.token,
                    'crm_id': $stateParams.id,
                    'module_type': 1
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.arr_OfferMethod = res.data.response.OfferMethod;
                        angular.forEach($rootScope.prooduct_arr, function (obj) {
                            obj.disableCheck = 0;
                            obj.chk = false;
                        });
                        // $scope.arr_OfferLocation = res.data.response.OfferLocation;
                    }
                    /* if ($scope.user_type == 1)
                        $scope.arr_OfferMethod.push({
                            'id': '-1',
                            'title': '++ Add New ++'
                        }); */
                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
                });
            $scope.showLoader = false;
            $scope.deletebtn = true;
            $scope.PriceOffer_check_readonly = false;
        }
    }

    $scope.deletePriceOffer = function (rec) {
        console.log(rec);
        /* 
        return false; */
        // if (rec.name == undefined) {
        if (!(rec.id > 0)) {
            if (rec.priceType == 2)
                $scope.getPriceOfferList();
            else
                $scope.getPriceOffer();
            return;
        }

        /* if (!(rec.id > 0))
            return; */


        $scope.priceOfferRec = {};

        $scope.priceOfferRec.id = rec.id;

        ngDialog.openConfirm({
            template: 'modalDiscardPriceOfferDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            // remove complete price offer
            SubmitPrice.deletePriceOffer($scope.priceOfferRec)
                .then(function (result) {
                    if (result.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () {
                            if (rec.priceType == 1)
                            $scope.getPriceOffer();
                            else
                            $scope.getPriceOfferList();
                        }, 1500)    
                    }
                }, function (error) {
                    console.log(error);
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.addPriceList = function (PriceOffer_rec, param, discardOption, moduleType) {

        // if(!angular.element('#p_offer').parsley().validate())
        // return;

        if (PriceOffer_rec.name == undefined || PriceOffer_rec.name == "") {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Name']));
            return false;
        }

        if (PriceOffer_rec.offer_date == undefined || PriceOffer_rec.offer_date == "") {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Start Date']));
            return false;
        }

        if (PriceOffer_rec.offer_valid_date == undefined || PriceOffer_rec.offer_valid_date == "") {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['End Date']));
            return false;
        }

        if (PriceOffer_rec.currencys == undefined || PriceOffer_rec.currencys.id == undefined) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Currency']));
            return false;
        }

        if (PriceOffer_rec.name == "" || PriceOffer_rec.offer_date == "" || PriceOffer_rec.offer_valid_date == "") {
            return false;
        }


        PriceOffer_rec.moduleID = $stateParams.id;
        PriceOffer_rec.moduleType = 1;

        if(PriceOffer_rec.offeredByArr){
            PriceOffer_rec.offered_by = PriceOffer_rec.offeredByArr.name;
            PriceOffer_rec.Offered_By = PriceOffer_rec.offeredByArr.name;
        }

        /* if (Number(PriceOffer_rec.offeredByID == 0) && $scope.selectedSalespersons.length > 0)// || PriceOffer_rec.offered_by.length == 0)
        {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Offered By']));
            return false;
        }

        // if (PriceOffer_rec.priceType != 3)
        //     PriceOffer_rec.priceType = 2;

        if (param == 1 && $scope.selectedSalespersons.length > 0 && (PriceOffer_rec.offeredByID == undefined || PriceOffer_rec.offeredByID == '' || Number(PriceOffer_rec.offeredByID) == 0)) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Offered By']));
            return false;
        } */

        var min_max_qty_error = '';
        var discount_details_error = '';
        angular.forEach($scope.tbl_records.data, function(obj_item){
            if ((Number(obj_item.itemData.Min) > 0 && Number(obj_item.itemData.Max) == 0) || (Number(obj_item.itemData.Min) == 0 && Number(obj_item.itemData.Max) > 0))
            {
                min_max_qty_error += obj_item.itemData.Item+ ', ';
            }

            if (obj_item.discountDetails.rows.length > 0)
            {
                angular.forEach(obj_item.discountDetails.rows, function(discount){
                    if(Number(discount.Min) == 0)
                    {
                        if (!discount_details_error.includes(obj_item.itemData.Item))
                        discount_details_error += obj_item.itemData.Item + ', ';
                    }
                });
                 
            }
        });
        if(min_max_qty_error.length > 0)
        {
            min_max_qty_error = min_max_qty_error.slice(0, -2);
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(342) + min_max_qty_error);
            return false;
        }
        if (discount_details_error.length > 0)
        {
            discount_details_error = discount_details_error.slice(0, -2);
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(343, [discount_details_error]));
            return false;
        }
 
        $scope.PendingSelectedPriceItems = [];
        $scope.temp_PendingSelectedPriceItems = [];

        var selected_items = '';
        /* angular.forEach($rootScope.prooduct_arr, function (obj) {
            if (obj.chk == true) {
                $scope.temp_PendingSelectedPriceItems.push(obj);
                selected_items += obj.id + ', ';
            }
        }); */

        
        angular.forEach($scope.tempProdArr, function (obj) {
            // var item = $filter("filter")($scope.productsArr, { id: obj.id }, true);
            if(obj.id != undefined)
            {
                $scope.temp_PendingSelectedPriceItems.push(obj);
                selected_items += obj.id + ', ';
            }
        });


        selected_items += '0';

        // here should be the HTTP call for check
        var checkPriceApi = $rootScope.sales + "crm/crm/get-item-sales-prices-in-date-range";

        var postData = {};
        postData.token = $scope.$root.token;
        postData.selected_items = selected_items;
        postData.date_from = $scope.PriceOffer_rec.offer_date;
        postData.date_to = $scope.PriceOffer_rec.offer_valid_date;
        postData.type = 1;
        var no_prices_products = '';
        $http
            .post(checkPriceApi, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.product_prices = res.data.response;

                    angular.forEach($scope.temp_PendingSelectedPriceItems, function (obj) {
                        if(Number(obj.id) > 0)
                        {                            
                            var needle = $filter("filter")($scope.product_prices, { product_id: obj.id });
                            if (needle.length > 0) {
                                obj.min_max_price = needle[0].min_max_sale_price;
                                obj.minAllowedQty = needle[0].min_qty;
                                obj.maxAllowedQty = needle[0].max_qty;
                                obj.standard_price = needle[0].standard_price;

                                /* angular.forEach(needle[0].productUOM,function(obj2){
                                    if(obj2.cat_id == needle[0].uom_id && obj2.cat_id != obj2.ref_unit_id){
                                        obj.standard_price = parseFloat(needle[0].standard_price)/parseFloat(obj2.ref_quantity);
                                    }
                                }); */
                                
                                $scope.PendingSelectedPriceItems.push(obj);
                            }
                            else {
                            /* var _item = $filter("filter")($scope.prooduct_arr, { id: obj.id });
                            if (_item.length > 0) {
                                _item[0].chk = false;
                                _item[0].disableCheck = 0;
                            } */
                            
                            no_prices_products += obj.product_code + ', ';
                            }
                        }
                    });
                    if (no_prices_products.length > 0) {
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(345) + no_prices_products.substring(0, no_prices_products.length - 2));
                        return;
                    }


                    PriceOffer_rec.items = [];
                    angular.forEach($scope.tbl_records.data, function (item) {
                        if (item.discountDetails.rows.length > 0) {
                            item.itemData.discountDetails = item.discountDetails.rows;
                            item.itemData.type = 1;
                            item.itemData.discountType = item.discountType.id;
                        }
                        PriceOffer_rec.items.push(item.itemData);
                    });
                    /* if ($scope.tbl_records.data.length == 0 && discardOption == 1) {
            
                        ngDialog.openConfirm({
                            template: 'modalDiscardPriceOfferEmptyItemDialogId',
                            className: 'ngdialog-theme-default-custom'
                        }).then(function (value) {
            
                            if (PriceOffer_rec.id == undefined) {
                                if (PriceOffer_rec.priceType == 1)
                                    $scope.getPriceOffer(1);
                                else
                                    $scope.getPriceOfferList(1);
                                return false;
                            }
            
                            // remove complete price offer
                            SubmitPrice.deletePriceOffer($scope.priceOfferRec)
                                .then(function (result) {
                                    if (result.ack == true) {
                                        if (param == 1)
                                            $scope.getPriceOfferList(moduleType);
                                    }
                                }, function (error) {
                                    console.log(error);
                                });
                        }, function (reason) {
                            console.log('Modal promise rejected. Reason: ', reason);
                        });
                        return false;
                    } */

                    SubmitPrice.addPrice(PriceOffer_rec)
                        .then(function (result) {
                            if (result.ack == true) {
                                if (PriceOffer_rec.id > 0) {
                                    toaster.pop('success', 'Info', $rootScope.getErrorMessageByCode(102));
                                    $scope.formData.price_list_id = PriceOffer_rec.id;
                                } else {
                                    $scope.formData.price_list_id = result.id;
                                    $scope.PriceOffer_rec.id = result.id;
                                }
                                if (param == 1) {
                                    if (PriceOffer_rec.priceType == 1)
                                        $scope.getPriceOffer(1);
                                    else
                                        $scope.getPriceOfferList(1);
                                    $scope.PriceOffer_check_readonly = true;
                                }
                            }
                        }, function (error) {
                            console.log(error);
                        });
                }
                else {
                    if (selected_items.length > 1)
                        toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(620, [no_prices_products.substring(0, no_prices_products.length - 2), 'Sales Information']));


                    else
                        toaster.pop('error', 'Error', 'No Item Selected');

                    angular.forEach($rootScope.prooduct_arr, function (obj) {
                        obj.chk = false;
                        obj.disableCheck = 0;
                    });
                    return;
                }
            });
    }

    //close Price List Form and display listing.
    $scope.showCRMPricelistInfoListing = function () {
        $scope.CRMPricelistInfoFormShow = false;
        $scope.CRMPricelistInfoListingShow = true;
    }

    $scope.ClonePriceList = function (PriceOffer_rec_clone) {
        $scope.PriceOffer_check_readonly = false;
        $scope.formData = {};
        $scope.PriceOffer_rec = PriceOffer_rec_clone;
        $scope.PriceOffer_rec.id = 0;
        $scope.PriceOffer_volume_discdata = {};
        $scope.counter = 0;
        $scope.arrVolumeForms = [1];
        $scope.formData.volume_1_id = 0;
        $scope.formData.volume_2_id = 0;
        $scope.formData.volume_3_id = 0;
        $scope.isPanelExpand = false;
        $scope.isClone = true;
        $scope.PriceOffer_rec.priceType = 2;

        $scope.PriceOffer_rec.priceOfferedBy = '';
        $scope.PriceOffer_rec.offeredByID = '';
        $scope.PriceOffer_rec.offer_method_ids = '';
        $scope.deletebtn = false;
        // $scope.PriceOffer_rec.offered_by = $rootScope.defaultUserName;
        // $scope.PriceOffer_rec.offeredByID = $rootScope.userId;

        // $scope.tbl_records.data = [];
        angular.forEach($scope.tbl_records.data, function (item) {
            angular.forEach(item.discountDetails.rows, function (discount) {
                discount.id = 0;
            });
            item.itemData.id = 0;
        });

        if ($rootScope.cust_current_edit_currency) {
            $scope.PriceOffer_rec.currencys = $rootScope.cust_current_edit_currency;
        } else {
            $scope.PriceOffer_rec.currencys = $scope.$root.defaultCurrency;
        }

        $scope.isAdded = false;

        $scope.PriceOffer_rec.offer_date = '';
        $scope.PriceOffer_rec.offer_valid_date = '';
        $scope.PriceOffer_rec.name = '';

    }

    $scope.sendEmailPriceList = function (PriceOffer_recEmail) {     

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.postData.mainRec = PriceOffer_recEmail;
        $scope.postData.company_name = $rootScope.company_name;

        let currentUrl = window.location.href;
        $scope.postData.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;
                        
		// $scope.postData.company_logo_url = $rootScope.company_logo_url;
        $scope.showLoader = true;     

        var priceListEmailApi = $scope.$root.pr + "srm/srm/price-list-email";        
        $http
            .post(priceListEmailApi, $scope.postData)
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.total = res.data.total; 
                    toaster.pop('success', 'Info', 'Email sent successfully');               
                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            }); 
    }

    $scope.downloadPDFPriceList = function (PriceOffer_recEmail) {     

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.postData.mainRec = PriceOffer_recEmail;
        $scope.postData.company_name = $rootScope.company_name;

        let currentUrl = window.location.href;
        $scope.postData.company_logo_url = currentUrl.substring(0, currentUrl.indexOf('#')) + "upload/company_logo_temp/" + $rootScope.defaultLogo;
        $scope.showLoader = true;     

        var priceListEmailApi = $scope.$root.pr + "srm/srm/price-list-PDF-download";        
        $http
            .post(priceListEmailApi, $scope.postData)
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {

                    var pdf = res.data.file_url;
                    var hiddenElement = document.createElement('a');
                    hiddenElement.href = pdf;
                    // hiddenElement.target = '_blank'; // open in new tab
                    hiddenElement.download = pdf;
                    // hiddenElement.download = params.downloadName; // download
                    hiddenElement.click();

                    // toaster.pop('success', 'Info', 'PDF Download successfully');               
                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            }); 
    }
    /*   Price List Module End       */

    /*----------------------------------------------------------------------------------------------------------*/

    /*----------------------------------------Rebate ----------------------------------------------------------*/

    $scope.arr_rebate_types = [{ 'id': 1, 'name': 'Universal Rebate for the Customer' },
    { 'id': 2, 'name': 'Separate Rebate for Category(ies)' },
    { 'id': 3, 'name': 'Separate Rebate for Items' }];

    $scope.arr_rebate_universal = [{ 'id': 1, 'name': 'Universal Rebate' },
    { 'id': 2, 'name': 'Volume Based Rebate' },
    { 'id': 3, 'name': 'Revenue Based Rebate' }];

    //$scope.arr_rebate_universal = [{ 'id': 1, 'name': 'Universal Rebate' }];

    $scope.showRebateEditForm = function () {
        $scope.rebate_chk_readonly = false;

        if ($scope.volumeBasedRebate!=undefined){
            $scope.volumeBasedRebate.push({
                'revenue_volume_from': '',
                'revenue_volume_to': '',
                'rebate_types': '',
                'rebate': '',
                'id': '',
                'mode': 0,
                'editchk': 0
            });
        }

        if ($scope.revenueBasedRebate!=undefined){
            $scope.revenueBasedRebate.push({
                'revenue_volume_from': '',
                'revenue_volume_to': '',
                'rebate_types': '',
                'rebate': '',
                'id': '',
                'mode': 0,
                'editchk': 0
            });
        }
    }

    //  Rebate category code start 
    $scope.columns = [];
    $scope.Categoriesarray = [];
    $scope.selectedCats = [];
    $scope.PendingSelcategory = [];
    $scope.selCRMrebateCategoriesTooltip = "";

    $scope.getCategories = function () {

        $scope.title = 'Categories';
        $scope.showLoader = true;
        $scope.searchKeyword = {};

        $scope.columns = [];
        $scope.Categoriesarray = [];

        if ($rootScope.cat_prodcut_arr.length > 0) {

            angular.copy($rootScope.cat_prodcut_arr, $scope.Categoriesarray);
            angular.copy($rootScope.cat_prodcut_arr, $scope.columns);

            if ($scope.selectedCats.length > 0) {
                angular.forEach($scope.Categoriesarray, function (obj) {
                    obj.chk = false;
                    angular.forEach($scope.selectedCats, function (obj2) {
                        if (obj2.id == obj.id)
                            obj.chk = true;
                    });
                });
            }
            else {
                angular.forEach($scope.Categoriesarray, function (obj) {
                    obj.chk = false;
                });
            }
            angular.element('#_rebateCategoryModal').modal({ show: true });
        }
        else
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

        $scope.showLoader = false;
    }

    $scope.selectcategorieschk = function (cat) {

        $scope.selectedAll = false;

        for (var i = 0; i < $scope.Categoriesarray.length; i++) {

            if (cat.id == $scope.Categoriesarray[i].id) {

                if ($scope.Categoriesarray[i].chk == true)
                    $scope.Categoriesarray[i].chk = false;
                else
                    $scope.Categoriesarray[i].chk = true;
            }
        }
    }

    $scope.checkAllcategories = function (val) {

        $scope.PendingSelcategory = [];

        if (val == true) {

            for (var i = 0; i < $scope.Categoriesarray.length; i++) {
                $scope.Categoriesarray[i].chk = true;
                $scope.PendingSelcategory.push($scope.Categoriesarray[i]);
            }
        } else {
            for (var i = 0; i < $scope.Categoriesarray.length; i++) {
                $scope.Categoriesarray[i].chk = false;
            }

            $scope.PendingSelcategory = [];
        }
    }

    $scope.submitPendingSelcategories = function () {

        $scope.PendingSelcategory = [];
        $scope.PendingSelcategoryTooltip = "";

        for (var i = 0; i < $scope.Categoriesarray.length; i++) {

            if ($scope.Categoriesarray[i].chk == true) {
                $scope.PendingSelcategory.push($scope.Categoriesarray[i]);
                $scope.PendingSelcategoryTooltip = $scope.PendingSelcategoryTooltip + $scope.Categoriesarray[i].title + "; ";
            }
        }

        $scope.PendingSelcategoryTooltip = $scope.PendingSelcategoryTooltip.slice(0, -2);

        $scope.selectedCats = $scope.PendingSelcategory;
        $scope.selCRMrebateCategoriesTooltip = $scope.PendingSelcategoryTooltip;

        angular.element('#_rebateCategoryModal').modal('hide');
    }

    $scope.clearPendingSelcategories = function () {
        $scope.PendingSelcategory = [];
        $scope.PendingSelcategoryTooltip = "";
        angular.element('#_rebateCategoryModal').modal('hide');
    }

    //  Rebate category code end 

    $scope.changeItemsRebate = function () {
        $scope.selectedItems = [];
        $scope.selCRMrebateItemsTooltip = "";
        $scope.selectedRecFromModalsItem = [];
    }

    //  Rebate Items code start 
    $scope.columns = [];
    $scope.tempProdArr = [];
    $scope.selectedItems = [];
    $scope.volumeBasedRebate = [];
    $scope.revenueBasedRebate = [];
    $scope.PendingSelectedRebateItems = [];
    $scope.selCRMrebateItemsTooltip = "";
    $scope.filterRebateItem = {};


    $scope.searchKeywordRebateItem = {};
    $scope.selectedRecFromModalsItem = [];

    $scope.clearFiltersAndSelectItems = function () {		
			$scope.searchKeywordRebateItem = {};
			$scope.getItemsRebate();
	}

    $scope.getItemsRebate = function (item_paging,sort_column,sortform) {

        if (($scope.Rebate_rec.universal_types != undefined && $scope.Rebate_rec.universal_types.id != 3) || ($scope.Rebate_rec.universal_types == undefined)) {

            if (!$scope.Rebate_rec.uoms) {
                $scope.products_rebate = [];
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));
                return false;
            }
        }

        $scope.showLoader = true;

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.moduleType = 'ItemDetail';

        $scope.tempProdArr = [];
        $scope.tempProdArr2 = []
        $scope.tempProdArr2.response = [];

        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.searchKeyword = $scope.searchKeywordRebateItem;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeywordRebateItem = {};
            $scope.record_data = {};
        }        

        if($scope.Rebate_rec.uoms && $scope.Rebate_rec.uoms.name)
            $scope.postData.searchKeyword.unit_name = $scope.Rebate_rec.uoms.name;

        if($scope.Rebate_rec.universal_types && $scope.Rebate_rec.universal_types.id != 2)
            $scope.postData.searchKeyword.unit_name = '';

        if ((sort_column != undefined) && (sort_column != null)) {
            //sort by column
            $scope.postData.sort_column = sort_column;
            $scope.postData.sortform = sortform;

            $rootScope.sortform = sortform;
            $rootScope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;
            $rootScope.sort_column = sort_column;

            $rootScope.save_single_value($rootScope.sort_column, 'srmsort_name');
        }

        // $scope.postData.cond = 'Detail';
        // $scope.filterPurchaseItem = {};

        $scope.postData.cond = 'setupDetail';
        $scope.postData.srm_id = 1;
        $scope.postData.orderDate = $scope.$root.get_current_date();

        // var itemListingApi = $scope.$root.reports + "module/item-data-for-report";
        var itemListingApi = $scope.$root.stock + "products-listing/item-details-price-qty";

        $scope.showLoader = true;
        $http
            .post(itemListingApi, $scope.postData)
            .then(function (res) {
                $scope.tableDataItmList = res;
                $scope.columns = [];
                $scope.record_data = {};
                $scope.recordArray = [];
                $scope.showLoader = false;
                $scope.PendingSelectedItems = [];

                if (res.data.ack == true) {
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.record_data = res.data.response;
                    $scope.tempProdArr = res.data;

                    angular.forEach($scope.tempProdArr, function (value, key) {
                        if (key != "tbl_meta_data") {
                            $scope.recordArray.push(value);
                        }
                    });

                    for (var i = 0; i < $scope.tempProdArr.length; i++) {

                        $scope.tempProdArr[i].chk = false;
                        $scope.tempProdArr[i].calc_current_stock = Number($scope.tempProdArr[i].allocated_stock) + Number($scope.tempProdArr[i].available_stock);
                    }
                    angular.forEach($scope.tableDataItmList.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });

                    if ($scope.tempProdArr.response)
                        angular.element('#itemRebatModal').modal({ show: true });
                        // angular.element('#productModal').modal({ show: true });

                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            }); 
    }

    $scope.addPendingRebateItems = function () {

        $scope.items_array = [];
        $scope.showPostBtn = true;
        $scope.showLoader = true;

        angular.copy($scope.tempProdArr.response, $scope.items_array);

        var selItemList = [];
        $scope.selectedItems = [];

        angular.forEach($scope.selectedRecFromModalsItem, function (obj) {
            selItemList.push(obj.record);
		});
		
		angular.forEach(selItemList, function (prodData) {

			try {
                $scope.selectedItems.push(prodData);

            } catch (error) {
                $scope.showLoader = false;
            }
        });
        
        $scope.showLoader = false;

        angular.element('#itemRebatModal').modal('hide');
    }

    $scope.clearPendingRebateItems = function () {
        $scope.PendingSelectedRebateItems = [];
        $scope.PendingSelRebateTooltip = "";
        $scope.PendingSelectedPurchaseItems = [];
        $scope.PendingSelectedItems = [];

        angular.element('#itemRebatModal').modal('hide');
    }

    //  Rebate Items code end 

    // rebate Category code start
    $scope.columns = [];
    $scope.tempProdArr = [];
    $scope.selectedCategories = [];
    $scope.PendingSelectedRebateCats = [];
    $scope.selCRMrebateCatsTooltip = "";
    $scope.filterRebateCats = {};


    $scope.searchKeywordRebateCat = {};
    $scope.selectedRecFromModalsCat = [];

    $scope.clearFiltersAndSelectCategories = function () {		
			$scope.searchKeywordRebateCat = {};
			$scope.getCatsRebate();
	}

    $scope.getCatsRebate = function (item_paging,sort_column,sortform) {

        $scope.showLoader = true;

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.moduleType = 'CatsDetail';

        $scope.tempProdArr = [];
        $scope.tempProdArr2 = []
        $scope.tempProdArr2.response = [];

        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.searchKeyword = $scope.searchKeywordRebateCat;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeywordRebateCat = {};
            $scope.record_data = {};
        }       

        if ((sort_column != undefined) && (sort_column != null)) {
            //sort by column
            $scope.postData.sort_column = sort_column;
            $scope.postData.sortform = sortform;

            $rootScope.sortform = sortform;
            $rootScope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;
            $rootScope.sort_column = sort_column;

            $rootScope.save_single_value($rootScope.sort_column, 'srmsort_name');
        }

        // $scope.postData.cond = 'Detail';
        // $scope.filterPurchaseItem = {};

        $scope.postData.cond = 'setupDetail';
        $scope.postData.srm_id = 1;
        $scope.postData.orderDate = $scope.$root.get_current_date();

        // var itemListingApi = $scope.$root.reports + "module/item-data-for-report";
        var itemListingApi = $scope.$root.stock + "products-listing/get-categories";

        $scope.showLoader = true;
        $http
            .post(itemListingApi, $scope.postData)
            .then(function (res) {
                $scope.tableDataCatList = res;
                $scope.columns = [];
                $scope.record_data = {};
                $scope.recordArray = [];
                $scope.showLoader = false;
                $scope.PendingSelectedCats = [];

                if (res.data.ack == true) {
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.record_data = res.data.response;
                    $scope.tempProdArr = res.data;

                    angular.forEach($scope.tempProdArr, function (value, key) {
                        if (key != "tbl_meta_data") {
                            $scope.recordArray.push(value);
                        }
                    });

                    angular.forEach($scope.tableDataCatList.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });

                    if ($scope.tempProdArr.response)
                        angular.element('#_CategoryRebateModal_2').modal({ show: true });
                        // angular.element('#productModal').modal({ show: true });

                }
                else {
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            }); 
    }

    $scope.addPendingRebateCats = function () {

        $scope.items_array = [];
        $scope.showPostBtn = true;
        $scope.showLoader = true;

        angular.copy($scope.tempProdArr.response, $scope.items_array);

        var selCatList = [];
        $scope.selectedCategories = [];

        angular.forEach($scope.selectedRecFromModalsCat, function (obj) {
            selCatList.push(obj.record);
		});
		
		angular.forEach(selCatList, function (prodData) {

			try {
                $scope.selectedCategories.push(prodData);

            } catch (error) {
                $scope.showLoader = false;
            }
        });
        
        $scope.showLoader = false;

        angular.element('#_CategoryRebateModal_2').modal('hide');
    }

    $scope.clearPendingRebateCats = function () {
        $scope.PendingSelectedRebateCats = [];
        $scope.PendingSelRebateTooltip = "";
        $scope.PendingSelectedPurchaseCats = [];
        $scope.PendingSelectedCats = [];

        angular.element('#_CategoryRebateModal_2').modal('hide');
    }
    // rebate category code end

    // $scope.selectedItems = [];
    $scope.Rebate_rec = {};
    $scope.Rebate_rec.universal_types = $scope.arr_rebate_universal[0];


    $scope.data = [];
    $scope.dataRebate = [];

    $scope.searchKeyword = {};

    $scope.getRebate = function (item_paging, sort_column, sortform) {
        // $scope.breadcrumbs[3].name = 'Rebate';

        if (item_paging == 1) $scope.item_paging.spage = 1;
        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        $scope.postData.searchKeyword = $scope.searchKeyword;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }

        // var ApiAjax = $scope.$root.sales + "crm/crm/crm-rebate-listings";
        var ApiAjax = $scope.$root.sales + "crm/crm/rebate-listings";

        $scope.dataRebate = [];
        $scope.showLoader = true;
        // Rebate_rec.moduleID = $scope.$root.crm_id;
        // Rebate_rec.moduleType = 1;

        /* var postData = {
            'column': 'crm_id',
            'value': $scope.$root.crm_id,
            'token': $scope.$root.token
        } */
        var postData = {
            'moduleType': 1,
            'moduleID': $stateParams.id,
            'token': $scope.$root.token,
            'searchKeyword': $scope.searchKeyword
        }

        $http
            .post(ApiAjax, postData)
            .then(function (res) {
                $scope.tableData = res;
                $scope.showLoader = false;

                if (res.data.ack == true) {

                    angular.forEach($scope.tableData.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
                        if (obj.event != undefined && obj.event.delete != undefined) {
                            if (typeof eval(obj.event.delete) == "function")
                                obj.event.delete = eval(obj.event.delete);
                            else
                                $scope.tableData.data.response.tbl_meta_data.response.colMeta.splice(index, 1);
                        }
                        if (obj.event != undefined && obj.event.edit != undefined) {
                            if (typeof eval(obj.event.edit) == "function")
                                obj.event.edit = eval(obj.event.edit);
                            else
                                $scope.tableData.data.response.tbl_meta_data.response.colMeta.splice(index, 1);
                        }
                    })


                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.record_data = res.data.response;
                    $scope.dataRebate = res.data.response;
                }

            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
        $scope.rebateFormShow = false;
        $scope.rebateListingShow = true;
    }

    // Show Rebate Form in Add/Edit Mode.
    $scope.OpenRebateForm = function (event, id, mode) {
        if (event)
            event.stopPropagation();
        $scope.showLoader = true;
        $scope.items = [];
        $scope.products_rebate = [];
        $scope.selectedItems = [];
        $scope.selectedRecFromModalsCat = [];
        $scope.categories = [];
        $scope.selectedCategories = [];
        $scope.selCRMrebateItemsTooltip = "";
        $scope.selCRMrebateCategoriesTooltip = "";

        $scope.Rebate_rec.rebate_date = $scope.$root.get_current_date();
        $scope.Rebate_rec.created_by = $rootScope.defaultUserName;

        $scope.rebateFormShow = true;
        $scope.rebateListingShow = false;
        $scope.rebate_chk_readonly = false;

        $scope.list_type = [{ 'name': 'Percentage', 'id': 1 }, { 'name': 'Value', 'id': 2 }];
        var RebateUrl = $scope.$root.sales + "crm/crm/get-rebate";

        if (id > 0) {
            if (mode == 1)
                $scope.rebate_chk_readonly = true;
            else if (mode == 0)
                $scope.rebate_chk_readonly = false;

            $http
                .post(RebateUrl, {
                    'id': id,
                    'token': $scope.$root.token
                })
                .then(function (res) {

                    if (res.data.ack == true) {
                        $scope.Rebate_rec = res.data.response;
                        $scope.Rebate_rec.id = res.data.response.id;
                        $scope.Rebate_rec.universal_types = res.data.response.universal_type;
                        $scope.Rebate_rec.rebate_date = res.data.response.created_date;
                        $scope.Rebate_rec.type = res.data.response.rebate_type;
                        $scope.Rebate_rec.rebate_price = parseFloat(res.data.response.rebate_price);
                        if ($scope.Rebate_rec.type == 2 && res.data.response.categories != undefined) {

                            angular.forEach(res.data.response.categories.response, function (obj) {
                                        var selRecord = {};
                                        selRecord.key = obj.id;
                                        selRecord.record = obj;
                                        selRecord.value = obj.name;	
                                        $scope.selectedRecFromModalsCat.push(selRecord);
                                        $scope.selectedCategories.push(obj);                                       
                                        $scope.selCRMrebateCategoriesTooltip = $scope.selCRMrebateCategoriesTooltip + obj.name + "; ";
                                });                           
                        }

                        if (($scope.Rebate_rec.type == 3 || $scope.Rebate_rec.universal_type == 2 || $scope.Rebate_rec.universal_type == 3) && res.data.response.items) {
                            // != undefined

                            
                            
                            angular.forEach(res.data.response.items.response, function (recData) {
                                
                                var selRecord = {};
                                selRecord.key = recData.id;
                                selRecord.record = recData;
                                selRecord.value = recData.product_code;							

                                $scope.selectedItems.push(recData); 
                                $scope.selectedRecFromModalsItem.push(selRecord);
                                $scope.selCRMrebateCategoriesTooltip = $scope.selCRMrebateCategoriesTooltip + recData.description + "; ";
                            });

                            /* $scope.tempProdArr = $rootScope.prooduct_arr;

                            angular.forEach($scope.tempProdArr, function (obj) {
                                angular.forEach(res.data.response.items.response, function (obj1) {

                                    if (obj1.item_id == obj.id) {
                                        obj.chk = true;
                                        $scope.selectedItems.push(obj);
                                        $scope.selCRMrebateCategoriesTooltip = $scope.selCRMrebateCategoriesTooltip + obj.description + "; ";
                                    }
                                });
                            }); */
                        }

                        angular.forEach($scope.arr_rebate_types, function (elem) {
                            if (elem.id == res.data.response.rebate_type)
                                $scope.Rebate_rec.types = elem;
                        });

                        angular.forEach($scope.arr_rebate_universal, function (elem) {
                            if (elem.id == res.data.response.universal_type)
                                $scope.Rebate_rec.universal_types = elem;
                        });

                        if (res.data.response.rebate_price_type > 0) {

                            angular.forEach($scope.list_type, function (obj1) {
                                if (obj1.id == res.data.response.rebate_price_type)
                                    $scope.Rebate_rec.rebate_price_types = obj1;
                            });
                        }

                        if (res.data.response.uom > 0) {

                            angular.forEach($rootScope.uni_prooduct_arr, function (obj1) {
                                if (obj1.id == res.data.response.uom)
                                    $scope.Rebate_rec.uoms = obj1;
                            });
                        }
                        $scope.volumeBasedRebate = [];
                        $scope.revenueBasedRebate = [];

                        if (res.data.response.universal_type == 2 || res.data.response.universal_type == 3) {

                            if (res.data.response.universal_type == 2) {

                                if (res.data.response.revenueVolume && res.data.response.revenueVolume.length > 0) {

                                    angular.forEach(res.data.response.revenueVolume, function (obj1) {

                                        angular.forEach($scope.list_type, function (obj2) {
                                            if (obj2.id == obj1.rebate_type)
                                                obj1.rebate_types = obj2;
                                        });
                                        $scope.volumeBasedRebate.push(obj1);
                                    });
                                }
                                else {
                                    $scope.volumeBasedRebate.push({
                                        'revenue_volume_from': '',
                                        'rebate_types': '',
                                        'rebate': '',
                                        'id': '',
                                        'mode': 0,
                                        'editchk': 0
                                    });
                                }
                            }

                            if(res.data.response.universal_type == 3){

                                if (res.data.response.revenueVolume && res.data.response.revenueVolume.length > 0) {

                                    angular.forEach(res.data.response.revenueVolume, function (obj1) {

                                        angular.forEach($scope.list_type, function (obj2) {

                                            if (obj2.id == obj1.rebate_type)
                                                obj1.rebate_types = obj2;
                                        });
                                        $scope.revenueBasedRebate.push(obj1);
                                    });
                                }
                                else {
                                    $scope.revenueBasedRebate.push({
                                        'revenue_volume_from': '',
                                        'rebate_types': '',
                                        'rebate': '',
                                        'id': '',
                                        'mode': 0
                                    });
                                }
                            }
                        }
                    }
                }).catch(function (message) {
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
                });
            $scope.showLoader = false;
        } else {
            $scope.resetFormRebate();
            $scope.showLoader = false;
        }
    }

    $scope.delete_rebate = function (event, id, index, arr_data) {
        if (event)
            event.stopPropagation();
        var delUrl = $scope.$root.sales + "crm/crm/delete-rebate";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    'id': id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $scope.getRebate(1);
                    } else {
                        toaster.pop('error', 'Deleted', res.data.error);
                        // $scope.$root.getErrorMessageByCode(108)
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.onChangeRebateType = function () {
        $scope.resetItemsRebate();
        // $scope.Rebate_rec.universal_types = '';
    }

    $scope.resetFormRebate = function (rec) {
        $scope.Rebate_rec = {};
        $scope.Rebate_rec.universal_types = $scope.arr_rebate_universal[0];
        $scope.items = [];
        $scope.categories = [];
        $scope.Rebate_rec.type = 1;
        $scope.isCat = false;
        $scope.isItem = false;
        $scope.selectedItems = [];
        $scope.selectedCats = [];
        $scope.Rebate_rec.created_by = $rootScope.defaultUserName;
        $scope.Rebate_rec.rebate_date = $scope.$root.get_current_date();
        $scope.selCRMrebateItemsTooltip = "";
        $scope.selCRMrebateCategoriesTooltip = "";
    }

    $scope.resetItemsRebate = function () {
        $scope.selectedItems = [];
        $scope.selectedCats = [];

        $scope.selCRMrebateItemsTooltip = "";
        $scope.selCRMrebateCategoriesTooltip = "";

        $scope.volumeBasedRebate = [];
        $scope.revenueBasedRebate = [];

        $scope.viewRevenueRebate = false;
        $scope.viewVolumeRebate = false;

        $scope.rebateTypeDisable = false;

        if ($scope.Rebate_rec.universal_types) {

            if ($scope.Rebate_rec.universal_types.id == 2) {
                $scope.volumeBasedRebate.push({
                    'revenue_volume_from': '',
                    'rebate_types': '',
                    'rebate': '',
                    'id': '',
                    'mode': 0,
                    'editchk': 0
                });
            }
            else if ($scope.Rebate_rec.universal_types.id == 3) {

                $scope.revenueBasedRebate.push({
                    'revenue_volume_from': '',
                    'rebate_types': '',
                    'rebate': '',
                    'id': '',
                    'mode': 0,
                    'editchk': 0
                });

                $scope.Rebate_rec.rebate_price_types = $scope.list_type[0];
                $scope.rebateTypeDisable = true;
            }
            else if ($scope.Rebate_rec.universal_types.id == 1 && $scope.list_type != undefined) {
                $scope.Rebate_rec.rebate_price_types = $scope.list_type[0];
                $scope.rebateTypeDisable = true;
            }
        }

        $scope.Rebate_rec.created_by = $rootScope.defaultUserName;
        $scope.Rebate_rec.rebate_date = $scope.$root.get_current_date();
    }


    /* $scope.addVolumeRebate = function (rec, editmode,recIndex) {

        $scope.rebateTypeChk = 0;

        if (parseFloat(rec.revenue_volume_from) == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Volume From', '0']));
            return false;
        }

        if (!(parseFloat(rec.revenue_volume_from) > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Volume From']));
            return false;
        }

        if (!(parseFloat(rec.revenue_volume_to) > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Volume To']));
            return false;
        } 

        rec.rebate_types = {};        

        if ($scope.Rebate_rec.rebate_price_types != undefined) {

            rec.rebate_types.id = $scope.Rebate_rec.rebate_price_types.id;

            if (!($scope.Rebate_rec.rebate_price_types.id > 0)) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Rebate Type']));
                return false;
            }
        } else {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Rebate Type']));
            return false; 
        }

        if (!(rec.rebate > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Rebate']));
            return false;
        }

        if (parseFloat(rec.revenue_volume_from) > parseFloat(rec.revenue_volume_to)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(301));
            return false;
        }

        // if (rec.rebate_types.id == 1) {
        if ($scope.Rebate_rec.rebate_price_types.id == 1) {

            if (parseFloat(rec.rebate) >= 100) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(619, [rec.rebate])); 
                return false;
            }

            if (parseFloat(rec.rebate) <= 0) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Rebate', '0']));
                return false;
            }
        }

        var revenueVolFromError = 0;
        var revenueVolToError = 0;

        angular.forEach($scope.volumeBasedRebate, function (obj, index) {

            if (rec.qtyID != undefined && obj.qtyID != undefined){

                if (parseFloat(rec.revenue_volume_from) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_from) <= obj.revenue_volume_to && rec.qtyID != obj.qtyID)
                    revenueVolFromError++;

                if (parseFloat(rec.revenue_volume_to) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) <= obj.revenue_volume_to && rec.qtyID != obj.qtyID)
                    revenueVolToError++;

                if (parseFloat(rec.revenue_volume_from) < obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) > obj.revenue_volume_to && rec.qtyID != obj.qtyID)
                    revenueVolToError++;
            }
            else
            {
                if (parseFloat(rec.revenue_volume_from) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_from) <= obj.revenue_volume_to && index != recIndex)
                    revenueVolFromError++;

                if (parseFloat(rec.revenue_volume_to) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) <= obj.revenue_volume_to && index != recIndex)
                    revenueVolToError++;

                if (parseFloat(rec.revenue_volume_from) < obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) > obj.revenue_volume_to && index != recIndex)
                    revenueVolToError++;
            }         
        });

        if (revenueVolFromError > 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(555, ['Volume From']));//Qunatity
            return false;
        }

        if (revenueVolToError > 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(555, ['Volume To']));//Qunatity
            return false;
        }

        // if ($scope.Rebate_rec.id == undefined)
        //     $scope.saveRebate(rec);
        // console.log(editmode);

        rec.mode = 1;

        if (editmode > 0) {

            //$scope.volumeBasedRebate[$scope.volumeBasedRebate.length - 1].qtyID > 0 && 

            if ($scope.volumeBasedRebate[$scope.volumeBasedRebate.length - 1].editchk>0) {
                $scope.volumeBasedRebate.push({
                    'revenue_volume_from': '',
                    'revenue_volume_to': '',
                    'rebate_types': '',
                    'rebate': '',
                    'id': '',
                    'mode': 0,
                    'editchk': 0
                });
            }
            rec.editchk = 0;
        }
        else {
            $scope.volumeBasedRebate.push({
                'revenue_volume_from': '',
                'revenue_volume_to': '',
                'rebate_types': '',
                'rebate': '',
                'id': '',
                'mode': 0,
                'editchk': 0
            });
        }
    } */

    $scope.addVolumeRebate = function (rec, editmode, recIndex) {

        $scope.rebateTypeChk = 0;

        if (parseFloat(rec.revenue_volume_from) == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Volume From', '0']));
            return false;
        }

        if (!(parseFloat(rec.revenue_volume_from) > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Volume From']));
            return false;
        }

        rec.rebate_types = {};

        if ($scope.Rebate_rec.rebate_price_types != undefined) {
            if (!($scope.Rebate_rec.rebate_price_types.id > 0)) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Rebate Type']));
                return false;
            }
        } else {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Rebate Type']));
            return false;
        }
        rec.rebate_types.id = $scope.Rebate_rec.rebate_price_types.id;

        if (!(rec.rebate > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Rebate']));
            return false;
        }

        if ($scope.Rebate_rec.rebate_price_types.id == 1) {

            if (parseFloat(rec.rebate) >= 100) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(598, [rec.rebate]));
                return false;
            }

            if (parseFloat(rec.rebate) <= 0) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(238, ['Rebate ', '0']));
                return false;
            }
        }
        var revenueVolFromError = 0;
        var revenueVolToError = 0;

        angular.forEach($scope.volumeBasedRebate, function (obj, index) {
            if (rec.qtyID && obj.qtyID) {
                if (parseFloat(rec.revenue_volume_from)  == obj.revenue_volume_from && rec.qtyID != obj.qtyID)
                    revenueVolFromError++;
            }
            else {
                if (parseFloat(rec.revenue_volume_from)  == obj.revenue_volume_from && index != recIndex)
                    revenueVolFromError++;
            }

            if (rec.revenue_volume_from.length > 0 || rec.rebate.length > 0) {
                $scope.rebateTypeChk++;
            }
        });

        if (revenueVolFromError > 0) {
            toaster.pop('error', 'Info', 'Qunatity From is overlapping!');
            return false;
        }

        if ($scope.rebateTypeChk > 0)
            $scope.rebateTypeDisable = true;

        rec.mode = 1;

        if (editmode > 0) {
            if ($scope.volumeBasedRebate[$scope.volumeBasedRebate.length - 1].editchk > 0) {
                $scope.volumeBasedRebate.push({
                    'revenue_volume_from': '',
                    'rebate_types': '',
                    'rebate': '',
                    'id': '',
                    'mode': 0,
                    'editchk': 0
                });
            }
            rec.editchk = 0;
        }
        else {
            $scope.volumeBasedRebate.push({
                'revenue_volume_from': '',
                'rebate_types': '',
                'rebate': '',
                'id': '',
                'mode': 0,
                'editchk': 0
            });
        }
    }

    $scope.editVolumeRebate = function (rec, recIndex) {
        rec.editchk = 1;
        rec.mode = 0;
    }

    /* $scope.addRevenueRebate = function (rec, editmode, recIndex) {

        if (!(parseFloat(rec.revenue_volume_from) > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Revenue From']));
            return false;
        }

        if (!(parseFloat(rec.revenue_volume_to) > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Revenue To']));
            return false;
        }


        rec.rebate_types = {};

        if ($scope.Rebate_rec.rebate_price_types != undefined) {
            if (!($scope.Rebate_rec.rebate_price_types.id > 0)) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Rebate Type']));
                return false;
            }
        } else {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Rebate Type']));
            return false;
        }

        rec.rebate_types.id = $scope.Rebate_rec.rebate_price_types.id;

        if (!(parseFloat(rec.rebate) > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Rebate']));
            return false;
        }

        if (parseFloat(rec.revenue_volume_from) > parseFloat(rec.revenue_volume_to)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(320, ['Revenue From', 'Revenue To']));
            return false;
        }

        // if (rec.rebate_types.id == 1) {
        if ($scope.Rebate_rec.rebate_price_types.id == 1) {

            if (parseFloat(rec.rebate) >= 100) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(619, [rec.rebate])); 
                return false;
            }

            if (parseFloat(rec.rebate) <= 0) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Rebate', '0']));
                return false;
            }
        }

        var revenueVolFromError = 0;
        var revenueVolToError = 0;

        angular.forEach($scope.revenueBasedRebate, function (obj,index) {
            if (rec.qtyID != undefined && obj.qtyID != undefined) {

                if (parseFloat(rec.revenue_volume_from) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_from) <= obj.revenue_volume_to && rec.qtyID != obj.qtyID)
                    revenueVolFromError++;

                if (parseFloat(rec.revenue_volume_to) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) <= obj.revenue_volume_to && rec.qtyID != obj.qtyID)
                    revenueVolToError++;

                if (parseFloat(rec.revenue_volume_from) < obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) > obj.revenue_volume_to && rec.qtyID != obj.qtyID)
                    revenueVolToError++;
            }
            else {
                if (parseFloat(rec.revenue_volume_from) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_from) <= obj.revenue_volume_to && index != recIndex)
                    revenueVolFromError++;

                if (parseFloat(rec.revenue_volume_to) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) <= obj.revenue_volume_to && index != recIndex)
                    revenueVolToError++;

                if (parseFloat(rec.revenue_volume_from) < obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) > obj.revenue_volume_to && index != recIndex)
                    revenueVolToError++;
            }
        });

        if (revenueVolFromError > 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(555, ['Revenue From']));
            return false;
        }

        if (revenueVolToError > 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(555, ['Revenue To']));
            return false;
        }

        rec.mode = 1;

        // console.log(editmode);

        if (editmode > 0) {

            if ($scope.revenueBasedRebate[$scope.revenueBasedRebate.length - 1].editchk > 0) {
                $scope.revenueBasedRebate.push({
                    'revenue_volume_from': '',
                    'revenue_volume_to': '',
                    'rebate_types': '',
                    'rebate': '',
                    'id': '',
                    'mode': 0,
                    'editchk': 0
                });
            }

            rec.editchk = 0;
        }
        else {
            $scope.revenueBasedRebate.push({
                'revenue_volume_from': '',
                'revenue_volume_to': '',
                'rebate_types': '',
                'rebate': '',
                'id': '',
                'mode': 0,
                'editchk': 0
            });
        }
    } */

    $scope.addRevenueRebate = function (rec, editmode, recIndex) {

        $scope.rebateTypeChk = 0;

        if (parseFloat(rec.revenue_volume_from) == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Revenue From', '0']));
            return false;
        }

        if (!(parseFloat(rec.revenue_volume_from) > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Revenue']));
            return false;
        }
        rec.rebate_types = {};

        if ($scope.Rebate_rec.rebate_price_types != undefined) {
            if (!($scope.Rebate_rec.rebate_price_types.id > 0)) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Rebate Type']));
                return false;
            }
        } else {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Rebate Type']));
            return false;
        }
        
        rec.rebate_types.id = $scope.Rebate_rec.rebate_price_types.id;

        if (!(parseFloat(rec.rebate) > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Rebate']));
            return false;
        }

        if ($scope.Rebate_rec.rebate_price_types.id == 1) {

            if (parseFloat(rec.rebate) >= 100) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(598, [rec.rebate]));
                return false;
            }

            if (parseFloat(rec.rebate) <= 0) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(238, ['Rebate ', '0']));
                return false;
            }
        }

        var revenueVolFromError = 0;
        var revenueVolToError = 0;

        angular.forEach($scope.revenueBasedRebate, function (obj, index) {
            if (rec.qtyID != undefined && obj.qtyID != undefined) {
                if (parseFloat(rec.revenue_volume_from)  == obj.revenue_volume_from && rec.qtyID != obj.qtyID)
                    revenueVolFromError++;
            }
            else {
                if (parseFloat(rec.revenue_volume_from)  == obj.revenue_volume_from && index != recIndex)
                    revenueVolFromError++;
            }

            if (rec.revenue_volume_from.length > 0 || rec.rebate.length > 0) {
                $scope.rebateTypeChk++;
            }
        });


        if (revenueVolFromError > 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(555, ['Revenue From']));
            return false;
        }

        if ($scope.rebateTypeChk > 0)
            $scope.rebateTypeDisable = true;

        rec.mode = 1;

        if (editmode > 0) {

            if ($scope.revenueBasedRebate[$scope.revenueBasedRebate.length - 1].editchk > 0) {
                $scope.revenueBasedRebate.push({
                    'revenue_volume_from': '',
                    'rebate_types': '',
                    'rebate': '',
                    'id': '',
                    'mode': 0,
                    'editchk': 0
                });
            }
            rec.editchk = 0;
        }
        else {
            $scope.revenueBasedRebate.push({
                'revenue_volume_from': '',
                'rebate_types': '',
                'rebate': '',
                'id': '',
                'mode': 0,
                'editchk': 0
            });
        }
    }

    $scope.editRevenueRebate = function (rec, recIndex) {
        rec.editchk = 1;
        rec.mode = 0;
    }

    $scope.deleteRevenueRebate = function (index, revenueBasedRebate) {
        revenueBasedRebate.splice(index, 1);
        /* if (!(arr_data[arr_data.length - 1].id > 0))
            arr_data.splice(-1, 1); */
    }

    $scope.deleteVolumeRebate = function (index, volumeBasedRebate) {
        volumeBasedRebate.splice(index, 1);
    }


    //open Rebate history Modal
    $scope.getCustRebateHistory = function (id, type) {
        $scope.showLoader = true;
        $scope.history_title = "Rebate History";
        $scope.Rebate_rec_history = {};

        var ApiAjax = $scope.$root.sales + "crm/crm/get-customer-rebate-history";

        $scope.crm_id = $stateParams.id;

        $scope.postData = {
            crm_ids: $scope.crm_id,
            token: $scope.$root.token,
            id: id
        }

        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res) {
                // $scope.price_history_info_columns = [];
                $scope.Rebate_rec_history = {};


                if (res.data.ack == true)
                    $scope.Rebate_rec_history = res.data.response;

                $scope.showLoader = false;
                angular.element('#_CustRebateHistory_modal').modal({
                    show: true
                });
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }


    $scope.products_rebate = [];
    // $scope.selectedItems = [];
    $scope.searchKeyword_price = {};

    $scope.offer_method_id = {};
    $scope.currency_id = {};

    // Add/Edit Rebate
    $scope.addRebate = function (Rebate_rec) {

        //console.log(Rebate_rec);
        //console.log($scope.selectedItems);
        //  return false;

        $scope.showLoader = true;

        Rebate_rec.moduleID = $scope.$root.crm_id;
        Rebate_rec.moduleType = 1;
        Rebate_rec.token = $scope.$root.token;
        // Rebate_rec.uom = $scope.Rebate_rec_uom;$scope.Rebate_rec.uom.id

        Rebate_rec.type = Rebate_rec.types != undefined ? Rebate_rec.types.id : 0;
        Rebate_rec.universal_type = Rebate_rec.universal_types != undefined ? Rebate_rec.universal_types.id : 0;
        Rebate_rec.rebate_price_type = Rebate_rec.rebate_price_types != undefined ? Rebate_rec.rebate_price_types.id : 0;
        Rebate_rec.uom = Rebate_rec.uoms != undefined ? Rebate_rec.uoms.id : 0;

        if (!Rebate_rec.types || Rebate_rec.types=='') {
            $scope.showLoader = false;
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Category']));
            return;
        }

        // if (Rebate_rec.type == 1 && (Rebate_rec.universal_type == 0 || Rebate_rec.universal_type == undefined || Rebate_rec.universal_type == '')) {

        if (!Rebate_rec.universal_type){
            $scope.showLoader = false;
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Rebate Type']));//Universal
            return;
        }

        //Rebate_rec.type == 3 || 
        if (Rebate_rec.type == 3 || Rebate_rec.universal_type == 2 || Rebate_rec.universal_type == 3) {
            Rebate_rec.items = $scope.selectedItems;
            if (!$scope.selectedItems || !(Rebate_rec.items.length > 0)) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Item(s)']));
                return;
            }
        }

        if (Rebate_rec.type == 2) {
            Rebate_rec.categories = $scope.selectedCategories;
            if ($scope.selectedCategories == undefined || $scope.selectedCategories.length == 0) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Category(ies)']));
                return;
            }
        }

        if (Rebate_rec.rebate_price_type == 0) {
            $scope.showLoader = false;
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Rebate Type']));
            return;
        }

        if (!Rebate_rec.offer_date || Rebate_rec.offer_date ==0) {
            $scope.showLoader = false;
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Start Date']));
            return false;
        }

        if (!Rebate_rec.offer_valid_date || Rebate_rec.offer_valid_date ==0) {
            $scope.showLoader = false;
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['End Date']));
            return false;
        }

        if (Rebate_rec.offer_date && Rebate_rec.offer_valid_date) {

            var startDate, endDate;

            startDate = Rebate_rec.offer_date.split("/")[2] + "-" + Rebate_rec.offer_date.split("/")[1] + "-" + Rebate_rec.offer_date.split("/")[0];
            endDate = Rebate_rec.offer_valid_date.split("/")[2] + "-" + Rebate_rec.offer_valid_date.split("/")[1] + "-" + Rebate_rec.offer_valid_date.split("/")[0];

            if (startDate != null || endDate != null) {

                var startDate1, endDate1;
                startDate1 = new Date(startDate.replace(/\s/g, ''));
                endDate1 = new Date(endDate.replace(/\s/g, ''));

                var fDate, lDate;
                fDate = Date.parse(startDate1);
                lDate = Date.parse(endDate1);

                if (fDate > lDate) {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(361, ['End Date','Start Date']));
                    return false;
                }
            }
        }

        /* if ((Rebate_rec.type == 3 || (Rebate_rec.type == 1 && Rebate_rec.universal_type == 2)) && Rebate_rec.uom == 0) {
            $scope.showLoader = false;
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));
            return;
        }

        if ((Rebate_rec.type == 2 && Rebate_rec.rebate_price_type == 2) && Rebate_rec.uom == 0) {
            $scope.showLoader = false;
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));
            return;
        } */


        if (Rebate_rec.universal_type == 3) {

            var revVolerror = 0;
            var revenueVolFromReqError = 0;
            var revenueVolToReqError = 0;
            var revenueVolFromError = 0;
            var revenueVolToError = 0;
            var revenueVolFromZeroError = 0;
            var revenueVolToZeroError = 0;

            angular.forEach($scope.revenueBasedRebate, function (obj, index) {
                // console.log(obj);
                if (!isNaN(parseFloat(obj.mode))) {
                    if (!(obj.mode > 0))
                        revVolerror++;
                }

                if (Math.abs(obj.revenue_volume_from) > 0 || Math.abs(obj.rebate) > 0){                

                    if (!(parseFloat(obj.revenue_volume_from) > 0)) {
                        revenueVolFromReqError++;
                        return false;
                    }

                    if (parseFloat(obj.revenue_volume_from) == 0) {
                        revenueVolFromZeroError++;
                        return false;
                    }

                    if (!(parseFloat(obj.rebate) > 0)) {
                        revVolerror++;
                        return false;
                    }

                    if ($scope.Rebate_rec.rebate_price_types.id == 1) {

                        if (parseFloat(obj.rebate) >= 100) {
                            $scope.showLoader = false;
                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(619, [rec.rebate]));
                            revVolerror++;
                            return false;
                        }

                        if (parseFloat(obj.rebate) <= 0) {
                            $scope.showLoader = false;
                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Rebate', '0']));
                            revVolerror++;
                            return false;
                        }
                    }

                    angular.forEach($scope.revenueBasedRebate, function (rec, recIndex) {
                        if (rec.qtyID && obj.qtyID) {
                            if (parseFloat(rec.revenue_volume_from) == obj.revenue_volume_from && rec.qtyID != obj.qtyID)
                                revenueVolFromError++;
                        }
                        else {
                            if (parseFloat(rec.revenue_volume_from) == obj.revenue_volume_from && index != recIndex)
                                revenueVolFromError++;
                        }
                    });

                    /* angular.forEach($scope.revenueBasedRebate, function (rec, recIndex) {
                        if (rec.qtyID != undefined && obj.qtyID != undefined) {

                            if (parseFloat(rec.revenue_volume_from) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_from) <= obj.revenue_volume_to && rec.qtyID != obj.qtyID)
                                revenueVolFromError++;

                            if (parseFloat(rec.revenue_volume_to) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) <= obj.revenue_volume_to && rec.qtyID != obj.qtyID)
                                revenueVolToError++;

                            if (parseFloat(rec.revenue_volume_from) < obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) > obj.revenue_volume_to && rec.qtyID != obj.qtyID)
                                revenueVolToError++;
                        }
                        else {
                            if (parseFloat(rec.revenue_volume_from) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_from) <= obj.revenue_volume_to && index != recIndex)
                                revenueVolFromError++;

                            if (parseFloat(rec.revenue_volume_to) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) <= obj.revenue_volume_to && index != recIndex)
                                revenueVolToError++;

                            if (parseFloat(rec.revenue_volume_from) < obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) > obj.revenue_volume_to && index != recIndex)
                                revenueVolToError++;
                        }
                    }); */

                }
            });

            if (revenueVolFromReqError > 0) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Revenue From']));
                return false;
            }

            if (revenueVolFromZeroError >0) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Revenue From', '0']));
                revVolerror++;
                return false;
            }

            if (revenueVolFromError > 0) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', 'Revenue From is overlapping');
                return false;
            }

            /* if (revenueVolToError > 0) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', 'Revenue To is overlapping');
                return false;
            } */

            if (revVolerror > 1) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(347));
                return;
            }

            Rebate_rec.recVolumeRevenue = $scope.revenueBasedRebate;
        }
        else if (Rebate_rec.universal_type == 2) {

            var revVolerror = 0;
            var revenueVolFromError = 0;
            var revenueVolToError = 0;
            var revenueVolFromReqError = 0;
            var revenueVolToReqError = 0;
            var revenueVolFromZeroError = 0;
            var revenueVolToZeroError = 0;

            angular.forEach($scope.volumeBasedRebate, function (obj, index) {
                // console.log(obj);
                if (!isNaN(parseFloat(obj.mode))) {
                    if (!(obj.mode > 0))
                        revVolerror++;
                }

                if (Math.abs(obj.revenue_volume_from) > 0 || Math.abs(obj.rebate) > 0) {

                    if (!(parseFloat(obj.revenue_volume_from) > 0)) {
                        revenueVolFromReqError++;
                        return false;
                    }

                    if (!(parseFloat(obj.rebate) > 0)) {
                        revVolerror++;
                        return false;
                    }

                    if (parseFloat(obj.revenue_volume_from) == 0) {
                        revenueVolFromZeroError++;
                        return false;
                    }

                    if ($scope.Rebate_rec.rebate_price_types.id == 1) {

                        if (parseFloat(obj.rebate) >= 100) {
                            $scope.showLoader = false;
                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(619, [rec.rebate]));
                            revVolerror++;
                            return false;
                        }

                        if (parseFloat(obj.rebate) <= 0) {
                            $scope.showLoader = false;
                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Rebate', '0']));
                            revVolerror++;
                            return false;
                        }
                    }

                    angular.forEach($scope.volumeBasedRebate, function (rec, recIndex) {
                        if (rec.qtyID && obj.qtyID) {
                            if (parseFloat(rec.revenue_volume_from) == obj.revenue_volume_from && rec.qtyID != obj.qtyID)
                                revenueVolFromError++;
                        }
                        else {
                            if (parseFloat(rec.revenue_volume_from) == obj.revenue_volume_from && index != recIndex)
                                revenueVolFromError++;
                        }
                    });

                    /* angular.forEach($scope.volumeBasedRebate, function (rec, recIndex) {

                        if (rec.qtyID != undefined && obj.qtyID != undefined) {

                            if (parseFloat(rec.revenue_volume_from) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_from) <= obj.revenue_volume_to && rec.qtyID != obj.qtyID)
                                revenueVolFromError++;

                            if (parseFloat(rec.revenue_volume_to) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) <= obj.revenue_volume_to && rec.qtyID != obj.qtyID)
                                revenueVolToError++;

                            if (parseFloat(rec.revenue_volume_from) < obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) > obj.revenue_volume_to && rec.qtyID != obj.qtyID)
                                revenueVolToError++;
                        }
                        else {
                            if (parseFloat(rec.revenue_volume_from) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_from) <= obj.revenue_volume_to && index != recIndex)
                                revenueVolFromError++;

                            if (parseFloat(rec.revenue_volume_to) >= obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) <= obj.revenue_volume_to && index != recIndex)
                                revenueVolToError++;

                            if (parseFloat(rec.revenue_volume_from) < obj.revenue_volume_from && parseFloat(rec.revenue_volume_to) > obj.revenue_volume_to && index != recIndex)
                                revenueVolToError++;
                        }
                    }); */
                }
            });

            if (revenueVolFromReqError > 0) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Volume From']));
                return false;
            }

            if (revenueVolFromZeroError > 0) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Volume From', '0']));
                revVolerror++;
                return false;
            }

            if (revenueVolFromError > 0) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(555, ['Volume From']));
                return false;
            }

            if (revVolerror > 1) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(347));
                return;
            }
            Rebate_rec.recVolumeRevenue = $scope.volumeBasedRebate;
        }

        // return false;

        var addUrl = $scope.$root.sales + "crm/crm/add-rebate";

        if (Rebate_rec.id != undefined)
            addUrl = $scope.$root.sales + "crm/crm/update-rebate";

        /* if (Rebate_rec.universal_type == 1 && (Rebate_rec.rebate_price_types == undefined || Rebate_rec.rebate_price_types.id == undefined)) {
            $scope.showLoader = false;
            toaster.pop('error', 'Info', "Select rebate type.");
            return;
        } */
        if (Rebate_rec.universal_type != 2 && Rebate_rec.universal_type != 3 && Rebate_rec.rebate_price_types.id == 1) {

            if (Rebate_rec.rebate_price >= 100) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(619, [Rebate_rec.rebate_price])); 
                return;
            }

            if (Rebate_rec.rebate_price <= 0 || Rebate_rec.rebate_price == undefined) {
                $scope.showLoader = false;
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(319, ['Rebate', '0']));
                return;
            }
        }

        // console.log(Rebate_rec);

        $http
            .post(addUrl, Rebate_rec)
            .then(function (res) {

                $scope.showLoader = false;

                if (res.data.ack == true || res.data.edit == true) {

                    if (Rebate_rec.id > 0)
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    else {
                        Rebate_rec.id = res.data.id;
                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                    }

                    $scope.getRebate(1);

                } else {

                    if (Rebate_rec.id > 0)
                        toaster.pop('error', 'Edit', res.data.error);
                    else
                        toaster.pop('error', 'Add', res.data.error);
                }
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });

    }

    //Add Volume/Revenue Detail Option
    $scope.AddVolRevenueRebateDetail = function (formDataRebateVolRevenueDetail) {
        formDataRebateVolRevenueDetail.token = $scope.$root.token;
        //console.log(formDataRebateVolRevenueDetail);
        //console.log($scope.vol_revenue_rebate_type);
        //  return false;
        formDataRebateVolRevenueDetail.rebate_id = $scope.Rebate_rec.id;

        if ($scope.vol_revenue_rebate_type == 1) {
            $scope.RebateVolumeDetailData = [];
            formDataRebateVolRevenueDetail.type = 1;

            if (formDataRebateVolRevenueDetail.quantity_from == undefined && formDataRebateVolRevenueDetail.quantity_from == null) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Quantity From']));
                return false;
            }

            if (formDataRebateVolRevenueDetail.quantity_to == undefined && formDataRebateVolRevenueDetail.quantity_to == null) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Quantity To']));
                return false;
            }

            if (Number(formDataRebateVolRevenueDetail.quantity_from) > Number(formDataRebateVolRevenueDetail.quantity_to)) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(301));
                return false;
            }

            if (formDataRebateVolRevenueDetail.unit_category != undefined) {
                formDataRebateVolRevenueDetail.uom = formDataRebateVolRevenueDetail.unit_category.id;
            }

        } else if ($scope.vol_revenue_rebate_type == 2) {
            $scope.RebateRevenueDetailData = [];
            formDataRebateVolRevenueDetail.type = 2;

            if (formDataRebateVolRevenueDetail.quantity_from == undefined && formDataRebateVolRevenueDetail.quantity_from == null) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['From']));
                return false;
            }

            if (formDataRebateVolRevenueDetail.quantity_to == undefined && formDataRebateVolRevenueDetail.quantity_to == null) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['To']));
                return false;
            }

            if (Number(formDataRebateVolRevenueDetail.quantity_from) > Number(formDataRebateVolRevenueDetail.quantity_to)) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(320, ['From', 'To']));
                return false;
            }
        }


        var ApiAjax = $scope.$root.sales + "crm/crm/add-crm-rebate-volume-revenue-detail";

        $http
            .post(ApiAjax, formDataRebateVolRevenueDetail)
            .then(function (res) {
                if (res.data.ack == true) {

                    toaster.pop('success', 'Add', 'Record Successfully insert!');
                    //$scope.show_vol_1_pop = false;
                    var DetailApiAjax = $scope.$root.sales + "crm/crm/get-crm-rebate-volume-revenue-detail";
                    $scope.postData1 = {
                        rebate_id: $scope.Rebate_rec.id,
                        token: $scope.$root.token
                    };

                    $http
                        .post(DetailApiAjax, $scope.postData1)
                        .then(function (res_price_vol1) {

                            //console.log($scope.user_type);
                            // //console.log(res_price_vol1);
                            if (res_price_vol1.data.ack == true) {

                                if (formDataRebateVolRevenueDetail.type == 1) {
                                    $scope.RebateVolumeDetailData = res_price_vol1.data.response;
                                    if ($scope.user_type == 1) {
                                        $scope.RebateVolumeDetailData.push({
                                            'id': '-1',
                                            'name': '++ Add New ++'
                                        });
                                    }

                                } else if (formDataRebateVolRevenueDetail.type == 2) {
                                    $scope.RebateRevenueDetailData = res_price_vol1.data.response;
                                    if ($scope.user_type == 1) {
                                        $scope.RebateRevenueDetailData.push({
                                            'id': '-1',
                                            'name': '++ Add New ++'
                                        });
                                    }

                                }
                            } else {
                                if (formDataRebateVolRevenueDetail.type == 1) {
                                    if ($scope.user_type == 1) {
                                        $scope.RebateVolumeDetailData.push({
                                            'id': '-1',
                                            'description': '++ Add New ++'
                                        });
                                    }

                                } else if (formDataRebateVolRevenueDetail.type == 2) {
                                    if ($scope.user_type == 1) {
                                        $scope.RebateRevenueDetailData.push({
                                            'id': '-1',
                                            'description': '++ Add New ++'
                                        });
                                    }
                                }
                            }
                        }).catch(function (message) {
                            $scope.showLoader = false;

                            throw new Error(message.data);
                            console.log(message.data);
                        });

                    angular.element('#rebateVolume').modal('hide');
                } else
                    toaster.pop('error', 'Add', 'already Exists');
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    //Check Volume/Revenue Deatil Option if its -1 than add new option.
    $scope.onChange_vol_revenue_rebate = function (drpdown_rec, type) {

        if (type == 1) {
            $scope.title_type = 'Add Volume Detail';

        } else if (type == 2) {

            $scope.title_type = 'Add Revenue Detail';
        }

        $scope.vol_revenue_rebate_type = type;

        if (drpdown_rec >= 0)
            return;

        // //console.log($scope.Rebate_rec_uom);
        $scope.formDataRebateVolRevenueDetail = {};
        angular.element('#rebateVolume').modal({
            show: true
        });
    }

    //open Volume Revenue Rebate history Modal
    $scope.ShowVolRevenueRebateHistory = function (id, type) {

        if (type == 1)
            $scope.history_title = "Volume Rebate History";
        else
            $scope.history_title = "Revenue Rebate History";

        $scope.history_type = type;

        $scope.Rebate_rec_history = {};
        $scope.showLoader = true;

        var ApiAjax = $scope.$root.sales + "crm/crm/get-crm-rebate-volume-revenue-history";

        // $scope.crm_id = $stateParams.id;

        $scope.postData = {
            token: $scope.$root.token,
            id: id
        }

        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res) {
                $scope.RebateVolRevHistory = {};

                if (res.data.ack == true)
                    $scope.RebateVolRevHistory = res.data.response;

                $scope.showLoader = false;
                angular.element('#_CustRebateVolRevHistory_modal').modal({
                    show: true
                });
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    //open Price Volume history Modal
    $scope.ShowVolDiscPriceHistory = function (id, type) {

        $scope.history_title = "Price Volume Discount History";

        //$scope.history_type = type;

        $scope.Price_rec_history = {};
        $scope.showLoader = true;

        //var ApiAjax = $scope.$root.sales + "crm/crm/get-customer-price-volume-history";
        var ApiAjax = $scope.$root.sales + "crm/crm/get-price-volume-discount-history";

        $scope.postData = {
            token: $scope.$root.token,
            id: id
        }

        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res) {
                $scope.Price_rec_history = {};

                if (res.data.ack == true)
                    $scope.Price_rec_history = res.data.response;

                $scope.showLoader = false;
                angular.element('#_CustPriceVolHistory_modal').modal({
                    show: true
                });
            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    // delete price volume discount in CRM/Customer
    $scope.DeletePriceVolume = function (id, index, arr_data) {

        var delUrl = $scope.$root.sales + "crm/crm/delete-customer-price-volume";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, {
                    id: id,
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            //console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.recPortal = {};

    //Show Hide Password		 default

    $scope.inputType = 'password'; //'text';
    $scope.eye_symbol_close = 0

    $scope.hideShowPassword = function () {
        if ($scope.inputType == 'password') {
            $scope.inputType = 'text';
            $scope.eye_symbol_close = 1;
        }
        else {
            $scope.inputType = 'password';
            $scope.eye_symbol_close = 0;
        }
    }

    $scope.isPasswordTouched = false;
    $scope.isPasswordConfirm = false;

    $scope.checkPassword = function(){
        // console.log("comparison : ",$scope.recPortal.user_password);
        // console.log("with : ",$scope.recPortal.confirm_password );
        $scope.isPasswordTouched = true;
        if($scope.recPortal.user_password == $scope.recPortal.confirm_password){
            $scope.isPasswordConfirm = true;
        } else {
            $scope.isPasswordConfirm = false;
        }
    }

    $scope.updatePortalSettings = function (rec) {
        //  return;
        console.log(rec);

        if (!rec.user_email) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Login Email']));
            return false;
        }

        if (!rec.user_password) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Password']));
            return false;
        }

        if (!rec.custEmail) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Customer Email(s)']));
            return false;
        }
        rec.id = rec.portalID;

        rec.crm_id = $stateParams.id;
        rec.token = $scope.$root.token;
        $scope.showLoader = true;        

        var updatePortalSettingsUrl = $scope.$root.sales + "crm/crm/update-portal-settings";

        $http.post(updatePortalSettingsUrl, rec)
            .then(function (res) {

                if (res.data.ack == 1) {

                    // $scope.rec_oop.oop_code = autocode.data.code;
                    // rec_oop.oop_code = autocode.data.code;
                    $scope.recPortal.portalID = res.data.id;
                    $scope.checkPortalFormReadonly = true;
                    toaster.pop('success', 'info', $scope.$root.getErrorMessageByCode(102));
                }

                $scope.showLoader = false;

            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.checkPortalFormReadonly = true;

    $scope.getPortalSettings = function(){
        $scope.showLoader = true;
        var rec = {};
        rec.crm_id = $stateParams.id;
        rec.token = $scope.$root.token;

        $scope.recPortal = {};

        var getPortalSettingsUrl = $scope.$root.sales + "crm/crm/get-portal-settings";

        $http.post(getPortalSettingsUrl, rec)
            .then(function (res) {

                if (res.data.ack == 1) {

                    $scope.recPortal.user_email = res.data.response.user_email;
                    $scope.recPortal.user_password = res.data.response.user_password;
                    $scope.recPortal.confirm_password = res.data.response.user_password;
                    $scope.recPortal.custEmail = res.data.response.custEmail;
                    $scope.recPortal.portalID = res.data.response.id;
                }

                $scope.showLoader = false;

            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }

    $scope.showPortalSettingsForm = function(){
        $scope.checkPortalFormReadonly = false;
    }

    $scope.sendPortalLinkEmail = function (rec) {
        //  return;
        console.log(rec);

        if (!rec.user_email) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Login Email']));
            return false;
        }

        if (!rec.user_password) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Password']));
            return false;
        }

        if (!rec.custEmail) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Customer Email(s)']));
            return false;
        }

        $scope.showLoader = true;

        rec.id = rec.portalID;
        rec.crm_id = $stateParams.id;
        rec.token = $scope.$root.token;

        var sendPortalLinkEmailUrl = $scope.$root.sales + "crm/crm/send-portal-link-email";

        $http.post(sendPortalLinkEmailUrl, rec)
            .then(function (res) {

                if (res.data.ack == 1) {
                    $scope.recPortal.portalID = res.data.id;
                    toaster.pop('success', 'info', res.data.message);
                }

                $scope.showLoader = false;

            }).catch(function (message) {
                $scope.showLoader = false;

                throw new Error(message.data);
                console.log(message.data);
            });
    }
}



myApp.controller('OpportunityCycleController', OpportunityCycleController);
function OpportunityCycleController($scope, $filter, $http, $state, $resource, ngDialog, toaster, $timeout, $rootScope, $stateParams) {
    var apiUrl = $scope.$root.sales + "crm/crm/get-all-opportunity-cycle";
    $scope.all_opp_cyles = [];
    $scope.columns_oop = [];
    $http
        .post(apiUrl, {
            'token': $scope.$root.token
        })
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.all_opp_cyles = res.data.response;
                angular.forEach($scope.all_opp_cyles, function (val, index) {
                    val.open_code = window.btoa(val.id + '^^^' + val.child_id + '^^^' + val.crm_id);
                    // console.log(val.open_code);
                });
            } else {
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            }
        });
}
