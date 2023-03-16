CrmOpportunityCycleController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
CrmOppDocumentsController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];

myApp.controller('CrmOppDocumentsController', CrmOppDocumentsController);
myApp.controller('CrmOppDocumentsAddController', CrmOppDocumentsAddController);
myApp.controller('CrmOpportunityCycleController', CrmOpportunityCycleController);
myApp.controller('CrmOpportunityCycleAddController', CrmOpportunityCycleAddController);


function CrmOpportunityCycleController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams) {
    'use strict';

    $scope.module_id = 49;
    $scope.filter_id = 38;
    $scope.module_table = 'crm_opportunity_cycle_main';
    $scope.more_fields = 'null';
    $scope.condition = 0;
    $scope.sendRequest = false;

    if ($scope.$root.crm_id > 0)
        $scope.postData = { 'column': 'crm_id', 'value': $scope.$root.crm_id, token: $scope.$root.token, 'more_fields': 'crm_id*current_status' }

    $scope.MainDefer = null;
    $scope.mainParams = null;
    $scope.mainFilter = null;
    $scope.more_fields = 'crm_id*current_status';
    $scope.count = 1;
    var vm = this;
    //var Api = $resource('api/company/get_listing/:module_id/:module_table');
    var ApiAjax = $scope.$root.sales + "crm/crm/opportunity-cycles";

    $scope.$on("myOpportunityCycleEventReload", function (event, args) {
        $scope.sendRequest = true;
        if (args != undefined) {
            if (args[1] != undefined)
                $scope.details(args[1]);
            $scope.postData = { 'column': 'crm_id', 'value': args[0], token: $scope.$root.token, 'more_fields': $scope.more_fields }
            $scope.$root.crm_id = args[0];
        }
        $scope.count = $scope.count + 1;


        //var ApiAjax = $resource('api/company/get_listing_ajax/:module_id/:module_table/:filter_id/:more_fields/:condition');
        //  ngDataService.getDataCustomAjax($scope.MainDefer, $scope.mainParams, ApiAjax, $scope.mainFilter, $scope, 'doreload' + $scope.count, $scope.postData);
        // $scope.table.tableParams5.reload();

        $scope.get_list_opp_cyscle();

    });

    $scope.recoddata = {};

    $scope.get_list_opp_cyscle = function () {
        $scope.oppCycleFormShow = false;
        $scope.oppCycleListingShow = true;

        $http
            .post(ApiAjax, $scope.postData)
            .then(function (res) {
                $scope.columns = [];
                $scope.record_data = {};
                if (res.data.record.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.recoddata = res.data.record.result;


                    angular.forEach($scope.recoddata[0], function (val, index) {
                        if (index != 'chk' && index != 'id') {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }

                    });

                }
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });
    }

    $scope.get_list_opp_cyscle();
    $scope.details = function (id, status) {
        $timeout(function () {
            if ($scope.$root.lblButton == 'Add New') {
                $scope.$root.lblButton = 'Edit';
            }
        }, 100);

        $scope.$root.tabHide = 0;
        $scope.$root.$broadcast("openOpportunityCycleFormEvent", { 'edit': false, id: id, 'status': status });
        // $scope.$root.$broadcast("showTasksEvent", id);
    }

    $scope.editForm = function (id, status) {
        $scope.$root.$broadcast("openOpportunityCycleFormEvent", { 'edit': true, id: id, 'status': status });
        // $scope.$root.$broadcast("showTasksEvent", id);

    }


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
                //            if ($scope.$root.crm_id > 0 && $scope.sendRequest == true)
                //                ngDataService.getDataCustomAjax($defer, params, ApiAjax, $filter, $scope, 'crm_opportunity_cycle', $scope.postData);
                //            $scope.MainDefer = $defer;
                //            $scope.mainParams = params;
                //            $scope.mainFilter = $filter;

                $scope.get_list_opp_cyscle();

            }
        });

    $scope.$data = {};
    $scope.delete = function (id, index, $data) {
        var delUrl = $scope.$root.sales + "crm/crm/delete-crm-opportunity-cycle";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $data.splice(index, 1);
                    }
                    else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

}

function CrmOpportunityCycleAddController($scope, $stateParams, $http, $state, $resource, toaster, $timeout, $filter, ngDialog, $rootScope) {


    $scope.rec = {};
    $scope.detail = {};
    $scope.arr_win_lost_outcome = [{ id: 1, 'name': 'Won' }, { id: 2, 'name': 'Lost' }]
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
    $scope.showOppCycleListing = function () {
        $scope.$root.$broadcast("showOppCycleListing");
    }

    $scope.showOppCycleEditForm = function () {
        $scope.check_readonly = false;
        $scope.btn_complete = true;
        $scope.selectedSalespersons_oop = [];
    }

    $scope.showAddOppCycleDocForm = function () {
        $scope.show_opp_doc_form = true;
        $scope.show_opp_doc_listing = false;
        $scope.btn_complete = true;
        $scope.$root.$broadcast("showAddCrmOppDocumentForm");
    }

    // get tabs
    $scope.$on("showAddOppCycleDocForm", function () {
        $scope.show_opp_doc_form = true;
        $scope.show_opp_doc_listing = false;
    });
    $scope.$on("showOppCycleDocListing", function () {
        $scope.show_opp_doc_form = false;
        $scope.show_opp_doc_listing = true;
    });
    $scope.showLoader = true;
    $scope.$on("showAddOppCycleForm", function () {
        $scope.btn_complete = true;
        $scope.check_readonly = false;
        $scope.showLoader = true;
        $scope.resetForm();
        $scope.rec = {};
        $scope.detail = {};
        $scope.parent_id = 0;
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        ;
        var day = d.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        ;
        $scope.loadFromData();
        $http
            .post(oppUrl, { 'token': $scope.$root.token, is_opp_cyle: 1, opp_cycle_limit: $scope.$root.opp_cycle_limit })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.arr_tabs = res.data.response;
                    $scope.current_status = $scope.type = res.data.response[0].id;
                }
            });
        $timeout(function () {
            angular.element('#crm-opp-cycle ul li').addClass('dont-click');
            angular.element('#crm-opp-cycle ul li:first').removeClass('dont-click');
            angular.element('#crm-opp-cycle .dropdown-menu li').removeClass('dont-click');
            angular.element('#crm-opp-cycle ul li:first a').trigger('click');
            $scope.showLoader = false;
            angular.element('.date-picker').datepicker({ dateFormat: $scope.$root.dateFormats[$scope.$root.defaultDateFormat] });
            if ($rootScope.defaultDateFormat == $rootScope.dtYMD)
                $scope.start_date = year + "/" + month + "/" + day;
            if ($rootScope.defaultDateFormat == $rootScope.dtMDY)
                $scope.start_date = month + "/" + day + "/" + year;
            if ($rootScope.defaultDateFormat == $rootScope.dtDMY)
                $scope.start_date = day + "/" + month + "/" + year;
            $scope.detail.temp_start_date = $scope.start_date; //$filter('date')($scope.start_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);

        }, 1000);
    });
    $scope.arr_roles1 = [];
    $scope.arr_roles2 = [];
    $scope.arr_roles3 = [];
    $scope.arr_testroles = [];
    $scope.loadFromData = function () {

        var altContactUrl = $scope.$root.sales + "crm/crm/get-alt-contacts-list";
        var postData = { 'crm_id': $scope.$root.crm_id, token: $scope.$root.token, type: 2 }
        $http
            .post(altContactUrl, postData)
            .then(function (res) {

                $scope.arr_alt_contacts = [];
                $scope.arr_alt_contacts.push({ 'id': '', 'name': '' });
                if (res.data.ack == true)
                    $scope.arr_alt_contacts = res.data.response;
                // else 	toaster.pop('error', 'Error', "No Role found!");



                // if ($scope.user_type == 1)  $scope.arr_alt_contacts.push({'id': '-1', 'name': '++ Add New ++'});
                $scope.arr_alt_contacts.push({ 'id': '', 'name': '' });
            });
        $http
            .post(processUrl, { 'token': $scope.$root.token })
            .then(function (res) {
                $scope.arr_process_of_decision = [];
                $scope.arr_process_of_decision.push({ id: ' ', name: ' ' });
                if (res.data.ack == true)
                    $scope.arr_process_of_decision = res.data.response;
                //  $scope.arr_process_of_decision.push({'id': '-1', 'name': '++ Add New ++'});
                $scope.arr_process_of_decision.push({ 'id': '', 'name': '' });
            });
        $scope.arr_roles1 = [];
        $scope.arr_roles2 = [];
        $scope.arr_roles3 = [];
        $scope.arr_testroles = [];
        $http
            .post(roleUrl, { 'token': $scope.$root.token, type: 2 })
            .then(function (res) {

                if (res.data.ack == true) {
                    $scope.arr_testroles = res.data.response; //res.data.record.result;
                    $timeout(function () {
                        $scope.arr_roles1 = $scope.arr_testroles;
                        $scope.arr_roles2 = $scope.arr_testroles;
                        $scope.arr_roles3 = $scope.arr_testroles;

                        if ($scope.user_type == 1) {
                            // $scope.arr_roles1.push({'id': '-1', 'title': '++ Add New ++'});
                            // $scope.arr_roles1.push({'id': ' ', 'title': ' '});

                            //$scope.arr_roles2.push({'id': '-1', 'title': '++ Add New ++'});
                            // $scope.arr_roles2.push({'id': ' ', 'title': ' '});

                            // $scope.arr_roles3.push({'id': '-1', 'title': '++ Add New ++'});
                            // $scope.arr_roles3.push({'id': ' ', 'title': ' '});
                        }
                    }, 1000);
                }
            });
    }



    $scope.validConvrate = function (price_a, currency_id, date) {

        if (currency_id != undefined)
            currency_id = $scope.rec.currency_id.id;

        var isValide = true;
        if ((Number(price_a) === undefined || Number(price_a) === 0) || currency_id == undefined) {
            $scope.rec.convert_amount = null;

            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(231, ['Currency', 'Amount']));
            $('.cur_block').attr("disabled", false);
            isValide = false;
            return;
        }

        if (currency_id == $scope.$root.defaultCurrency) {
            $scope.rec.convert_amount = Number(price_a);
            return;
        }
        else {

            var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
            $http
                .post(currencyURL, { 'id': currency_id, token: $scope.$root.token, or_date: date })
                .then(function (res) {
                    if (res.data.ack == true) {

                        if (res.data.response.conversion_rate == null) {
                            $scope.rec.convert_amount = null;

                            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Currency Conversion Rate']));
                            $('.cur_block').attr("disabled", true);
                            return;
                        }
                        else {

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


                            $scope.rec.convert_amount = converted_price;

                            $('.cur_block').attr("disabled", false);
                        }
                    }
                    else {
                        $scope.rec.convert_amount = null;
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Conversion Rate in Setup']));
                        $('.cur_block').attr("disabled", true);
                        return;
                    }

                });
        }
    }


    //if($state.current.name == 'app.view-crm')
    $scope.check_readonly = true;
    $scope.$on("openOpportunityCycleFormEvent", function (event, arg) {
        $http
            .post(oppUrl, { 'token': $scope.$root.token, is_opp_cyle: 1, opp_cycle_limit: $scope.$root.opp_cycle_limit })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.arr_tabs = res.data.response;
                    $scope.current_status = $scope.type = res.data.response[0].id;
                }
            });
        $scope.loadFromData();
        $timeout(function () {

            var id = arg.id;
            var status = arg.status;
            $scope.parent_id = id;
            $scope.$root.opp_cycle_id = id;
            if (arg.edit == false)
                $scope.check_readonly = true;
            else
                $scope.check_readonly = false;
            $scope.btn_complete = true;
            $scope.$root.$broadcast("showOppCycleForm");
            var args = [];
            args[0] = $scope.$root.opp_cycle_id;
            args[1] = undefined;
            $scope.$root.$broadcast("myCrmOppDocumentsEventReload", args);
            angular.element('#crm-opp-cycle ul li').removeClass('dont-click');
            if (status != undefined) {
                $timeout(function () {
                    angular.element('#' + status + ' a').trigger('click');
                }, 2000);
            }



            /*var oppUrl = $scope.$root.sales+"crm/crm/get-crm-opportunity-cycle";
             var oppCycleUrl = $scope.$root.sales+"crm/crm/get-crm-opportunity-cycle-by-type";
             
             $http
             .post(oppUrl, {id:id,'token':$scope.$root.token})
             .then(function (res) {
             if(res.data.ack == true){
             $scope.rec = res.data.response;
             $scope.rec.id = res.data.response.id;
             $scope.parent_id = res.data.response.id;
             $scope.wordsLength = res.data.response.description.length;
             $.each($scope.arr_process_of_decision, function(index,elem){
             if(res.data.response.process_of_decision == elem.id){
             $scope.rec.process_of_decisions = elem;
             }
             });
             
             $.each($scope.arr_alt_contacts, function(index,elem){
             if(res.data.response.contact_person_1 == elem.id){
             $scope.rec.contact_person_one = elem;
             }
             });
             $.each($scope.arr_alt_contacts, function(index,elem){
             if(res.data.response.contact_person_2 == elem.id){
             $scope.rec.contact_person_two = elem;
             }
             });
             $.each($scope.arr_alt_contacts, function(index,elem){
             if(res.data.response.contact_person_3 == elem.id){
             $scope.rec.contact_person_three = elem;
             }
             });
             
             $.each($scope.arr_roles, function(index,elem){
             if(res.data.response.role_1 == elem.id){
             $scope.rec.role_one = elem;
             }
             });
             $.each($scope.arr_roles, function(index,elem){
             if(res.data.response.role_2 == elem.id){
             $scope.rec.role_two = elem;
             }
             });
             $.each($scope.arr_roles, function(index,elem){
             if(res.data.response.role_3 == elem.id){
             $scope.rec.role_three = elem;
             }
             });
             
             console.log('hello i am here==l>>');
             $http
             .post(oppCycleUrl, {parent_id:id,tab_id:res.data.response.current_status,'token':$scope.$root.token})
             .then(function (res) {
             if(res.data.ack == true){
             console.log('now ere==>>');
             //$scope.detail = res.data.response;
             //console.log(res.data.response.end_date);
             $scope.$root.$storage.setItem("start_date",res.data.response.end_date);
             console.log($scope.$root.$storage.getItem("start_date"));
             if(res.data.response.is_complete)
             $scope.btn_complete = true;
             $scope.detail.id = res.data.response.id;
             if(res.data.response.probability_type == 'Percentage')
             $scope.show_symbol = true;
             
             /*$.each($scope.$root.arr_discount_type, function(index,elem){
             if(res.data.response.probability_type == elem.id){
             $scope.detail.probability_type_id = elem;
             }
             });*
             
             
             
             
             }
             });
             }
             });*/


        }, 100);
    });
    $scope.starteDate = function (startDate) {
        var newdate = startDate;
        $scope.newD = $scope.newD ? null : newdate; //$filter('date')(newdate, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
        $scope.starteDate = false;
    }





    $scope.onTabSelect = function (status, parent_id) {
        tab_id_number = status;
        console.log(tab_id_number);

        //$scope.btn_complete = true;
        angular.element('.date-picker').datepicker({ changeMonth: true, changeYear: true, dateFormat: $scope.$root.dateFormats[$scope.$root.defaultDateFormat] });
        $scope.rec = {};
        $scope.coment_data = {};
        var oppUrl = $scope.$root.sales + "crm/crm/get-crm-opportunity-cycle";
        var oppCycleUrl = $scope.$root.sales + "crm/crm/get-crm-opportunity-cycle-by-type";
        $scope.getSalePerson_oop(1);
        $http
            .post(oppUrl, { id: parent_id, 'token': $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {
                    $timeout(function () {
                        $scope.rec = res.data.response;
                        $scope.rec.id = res.data.response.id;
                        $scope.wordsLength = res.data.response.description.length;
                        $.each($scope.arr_process_of_decision, function (index, elem) {
                            if (res.data.response.process_of_decision == elem.id) {
                                $scope.rec.process_of_decisions = elem;
                            }
                        });
                        $.each($scope.arr_win_lost_outcome, function (index, elem) {
                            if (res.data.response.outcome == elem.id) {
                                $scope.rec.win_lost_outcome = elem;
                            }
                        });
                        $.each($scope.arr_alt_contacts, function (index, elem) {
                            if (res.data.response.contact_person_1 == elem.id) {
                                $scope.rec.contact_person_one = elem;
                            }
                        });
                        $.each($scope.arr_alt_contacts, function (index, elem) {
                            if (res.data.response.contact_person_2 == elem.id) {
                                $scope.rec.contact_person_two = elem;
                            }
                        });
                        $.each($scope.arr_alt_contacts, function (index, elem) {
                            if (res.data.response.contact_person_3 == elem.id) {
                                $scope.rec.contact_person_three = elem;
                            }
                        });
                        $.each($scope.arr_roles1, function (index, elem) {
                            if (res.data.response.role_1 == elem.id)
                                $scope.rec.role_one = elem;
                        });
                        $.each($scope.arr_roles2, function (index, elem) {
                            if (res.data.response.role_2 == elem.id)
                                $scope.rec.role_two = elem;
                        });
                        $.each($scope.arr_roles3, function (index, elem) {
                            if (res.data.response.role_3 == elem.id)
                                $scope.rec.role_three = elem;
                        });

                        $.each($rootScope.arr_currency, function (index, elem) {
                            if (res.data.response.currency_id == elem.id)
                                $scope.rec.currency_id = elem;
                        });

                        $.each($scope.arr_tabs, function (index, elem) {
                            if (res.data.response.current_status == elem.id)
                                $scope.rec.current_status = elem;
                        });
                    }, 1000);
                }

                $scope.current_status = status;
                if (parent_id > 0) {
                    $http
                        .post(oppCycleUrl, { parent_id: parent_id, type: status, 'token': $scope.$root.token })
                        .then(function (res) {
                            if (res.data.ack == true) {
                                $scope.detail = {};
                                $scope.detail = res.data.response;
                                $scope.detail.start_date = $scope.$root.convert_numeric_date_to_string(res.data.response.start_date);
                                $scope.detail.end_date = $scope.$root.convert_numeric_date_to_string(res.data.response.end_date);
                                $scope.detail.expected_close_date = $scope.$root.convert_numeric_date_to_string(res.data.response.expected_close_date);
                                /*$scope.detail.start_date = $filter('date')($scope.$root.convert_numeric_date_to_string(res.data.response.start_date), $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
                                 $scope.detail.end_date = $filter('date')($scope.$root.convert_numeric_date_to_string(res.data.response.end_date), $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
                                 $scope.detail.expected_close_date = $filter('date')($scope.$root.convert_numeric_date_to_string(res.data.response.expected_close_date), $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
                                 console.log($scope.detail.expected_close_date);*/
                                $scope.detail.temp_start_date = $scope.detail.end_date;
                                $scope.detail.temp_close_date = $scope.detail.expected_close_date;
                                if (res.data.response.is_complete)
                                    $scope.btn_complete = true;
                                $scope.detail.id = res.data.response.id;
                                if (res.data.response.probability_type == 'Percentage')
                                    $scope.show_symbol = true;
                                /*$.each($scope.$root.arr_discount_type, function(index,elem){
                                 if(res.data.response.probability_type == elem.id){
                                 $scope.detail.probability_type_id = elem;
                                 }
                                 });*/


                                $scope.getSalePersons_edit(res.data.response.id);
                                /*	var salepersonUrl = $scope.$root.sales + "crm/crm/get-opp-cycle-salesperson";
                                 $http
                                 .post(salepersonUrl, {id: res.data.response.id, 'token': $scope.$root.token})
                                 .then(function (emp_data) {
                                 $scope.selectedSalespersons_oop = [];
                                 if (emp_data.data.ack == true) {
                                 $.each($scope.arr_salepersons, function (indx, obj) {
                                 obj.chk = false;
                                 obj.isPrimary = false;
                                 $.each(emp_data.data.response, function (indx, obj2) {
                                 if (obj.id == obj2.salesperson_id) {
                                 obj.chk = true;
                                 if (obj2.is_primary == 1)
                                 obj.isPrimary = true;
                                 
                                 $scope.selectedSalespersons_oop.push(obj);
                                 }
                                 }); 
                                 });
                                 }
                                 });*/

                                //$scope.getComments();

                            }
                            else {
                                /*console.log($scope.$root.$storage.getItem("start_date"));
                                 $scope.detail.start_date = $scope.$root.$storage.getItem("start_date");*/
                                $scope.detail.id = 0;
                                $scope.detail.end_date = $scope.detail.probability = '';
                                $scope.detail.start_date = $scope.detail.temp_start_date;
                                $scope.detail.expected_close_date = $scope.detail.temp_close_date;
                                /*$scope.detail.start_date = $filter('date')($scope.start_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
                                 $scope.detail.expected_close_date = $filter('date')($scope.close_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);*/

                            }

                            $scope.type = status;
                            $scope.showLoader = false;
                        });
                }
                else {
                    /*$timeout(function(){
                     $scope.detail.start_date = $scope.start_date;//$filter('date')($scope.start_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
                     $scope.detail.end_date = $scope.start_date;
                     $scope.detail.expected_close_date = $scope.start_date;
                     },4000);*/
                }

            });
    }

    $scope.resetForm = function (rec, detail) {
        $scope.rec = {};
        $scope.detail = {};
    }
    $scope.convertToDateObject = function (str_date) {

        if (!str_date)
            return;

        //console.log(isNaN(Date.parse(str_date)));

        if (str_date && /\/.*\//.test(str_date)) {
            var s = str_date.split('/');
            if (s[2] == undefined) {
                var strDate = $rootScope.convert_unix_date_to_angular(str_date);
                var s = strDate.split('/');
                var dateObj = new Date(Number(s[2]), Number(s[1]) - 1, Number(s[0]));
            }
            else {
                var dateObj = new Date(Number(s[2]), Number(s[1]) - 1, Number(s[0]));
            }
        }
        else {
            var dateObj = new Date(str_date);
            //var dateObj = str_date;
            dateObj.setHours(00);
        }

        /*console.log(str_date);
         console.log(dateObj);
         console.log('-------------');*/
        return dateObj;

    }

    $scope.is_complete = 0;
    $scope.complete_date = 'Null';
    $scope.tab_id = '';
    $scope.btn_complete = true;
    $scope.isComplete = function (tab_id) {
        $scope.is_complete = 1;
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        $scope.complete_data = year + '-' + month + '-' + day;
        $scope.tab_id = tab_id;
        tab_id_number = tab_id;
    }
    var tab_id_number = '';
    $scope.add_oop_data = function (rec, detail) {

        var addCycleUrl = $scope.$root.sales + "crm/crm/add-crm-opportunity-cycle";
        var addDetailCycleUrl = $scope.$root.sales + "crm/crm/add-crm-opportunity-cycle-details";
        rec.current_status = $scope.current_status;
        rec.process_of_decision = rec.process_of_decisions != undefined ? rec.process_of_decisions.id : 0;
        rec.outcome = rec.win_lost_outcome != undefined ? rec.win_lost_outcome.id : 0;
        rec.contact_person_1 = rec.contact_person_one != undefined ? rec.contact_person_one.id : 0;
        rec.contact_person_2 = rec.contact_person_two != undefined ? rec.contact_person_two.id : 0;
        rec.contact_person_3 = rec.contact_person_three != undefined ? rec.contact_person_three.id : 0;
        rec.role_1 = rec.role_one != undefined ? rec.role_one.id : 0;
        rec.role_2 = rec.role_two != undefined ? rec.role_two.id : 0;
        rec.role_3 = rec.role_three != undefined ? rec.role_three.id : 0;
        rec.crm_id = $scope.$root.crm_id;
        rec.token = $scope.$root.token;
        var start_date = $scope.convertToDateObject(detail.start_date);
        var end_date = $scope.convertToDateObject(detail.end_date);
        var expected_close_date = $scope.convertToDateObject(detail.expected_close_date);
        if (end_date < start_date) {
            toaster.pop('warning', 'Warning', 'Stage End Date must be later than Stage Start Date!');
            $scope.detail.end_date = null;
            return false;
        }
        if (expected_close_date <= end_date) {
            toaster.pop('warning', 'Warning', 'Expected Deal Close Date must be later than Stage End Date!');
            $scope.detail.expected_close_date = null;
            return false;
        }
        if ((rec.contact_person_1 == -1) || (rec.contact_person_2 == -1) || (rec.contact_person_3 == -1)) {
            toaster.pop('error', 'info', 'Contact Person  Sholud Not be Add new ');
            return false;
        }


        if ((rec.contact_person_1 !== 0) && (rec.contact_person_3 !== 0)) {

            if ((rec.contact_person_1 == rec.contact_person_3)) {
                toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(246, ['Contact Person 1']));
                return false;
            }

        }

        if ((rec.contact_person_2 !== 0) && (rec.contact_person_1 !== 0)) {

            if ((rec.contact_person_1 == rec.contact_person_2)) {
                toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(246, ['Contact Person 2']));
                return false;
            }

        }

        if ((rec.contact_person_2 !== 0) && (rec.contact_person_3 !== 0)) {

            if ((rec.contact_person_2 == rec.contact_person_3)) {
                toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(246, ['Contact Person 3']));
                return false;
            }

        }



        if (rec.id > 0)
            addCycleUrl = $scope.$root.sales + "crm/crm/update-crm-opportunity-cycle";
        $http
            .post(addCycleUrl, rec)
            .then(function (res1) {
                var parent_id = '';
                if (res1.data.ack == true && res1.data.edit == false) {
                    parent_id = res1.data.id;
                    $scope.rec.id = res1.data.id;
                }

                if (!parent_id)
                    parent_id = rec.id;
                $scope.$root.opp_cycle_id = parent_id;
                detail.parent_id = parent_id;
                detail.is_complete = $scope.is_complete;
                detail.complete_date = $scope.complete_data;
                detail.token = $scope.$root.token;
                detail.type = $scope.type;
                $scope.parent_id = parent_id;
                if (detail.id > 0)
                    addDetailCycleUrl = $scope.$root.sales + "crm/crm/update-crm-opportunity-cycle-details";
                $http
                    .post(addDetailCycleUrl, detail)
                    .then(function (res2) {
                        //$scope.resetForm(rec,detail);
                        $scope.detail.is_complete = $scope.is_complete;
                        if (res1.data.ack == true || res2.data.ack == true || $scope.isSalespersonUpdated) {

                            if (res1.data.edit == true && res2.data.edit == true) {
                                toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                                if ($scope.is_complete == 1) {
                                    $timeout(function () {
                                        angular.element('#' + $scope.type).next().find('a').trigger('click');
                                        $scope.is_complete = 0;
                                    }, 1000);
                                }
                            }
                            else {
                                if (res2.data.id > 0)
                                    $scope.detail.id = res2.data.id;
                                toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                                //$scope.$root.$broadcast("showOppCycleListing");
                                angular.element('#crm-opp-cycle ul li').removeClass('dont-click');
                            }

                            if ($scope.isSalespersonUpdated) {
                                if ($scope.selectedSalespersons_oop.length > 0) {
                                    $scope.add_salespersons($scope.detail.id, detail.parent_id, detail.tab_id);
                                    $scope.add_salespersons_history($scope.detail.id, detail.parent_id, detail.tab_id);
                                }
                            }


                            var args = [];
                            args[0] = $scope.$root.crm_id;
                            args[1] = undefined;
                            $scope.$root.$broadcast("myOpportunityCycleEventReload", args);
                            $scope.detail.temp_start_date = $filter('date')(detail.end_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
                            $scope.detail.temp_close_date = $filter('date')(detail.expected_close_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
                            //$scope.btn_complete = false;
                            /*$timeout(function(){
                             //angular.element('#'+$scope.type).next().find('a').trigger('click');
                             $scope.detail.start_date = $filter('date')(detail.end_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
                             $scope.detail.expected_close_date = $filter('date')(detail.expected_close_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
                             },1000);*/
                            $scope.showcomentbeforedoc = true;
                        }
                        else {
                            if (res1.data.edit == true || res2.data.edit == true)
                                toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
                            else
                                toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
                        }

                        /*$timeout(function() {
                         angular.element('.accordion-toggle').trigger('click');
                         }, 100);*/
                    });
            });
    }

    $scope.closeTab = function () {
        $scope.$root.tabHide = 1;
    }
    $scope.togleTab = function (rec, detail) {
        $scope.resetForm(rec, detail);
        $scope.$root.lblButton = 'Add New';
        $scope.$root.tabHide = 0;
        $timeout(function () {
            angular.element('.accordion-toggle').trigger('click');
        }, 100);
    }

    $scope.delete = function (id) {
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post('api/company/delete', { id: id, table: 'crm_opportunity_cycle_main' })
                .then(function (res) {
                    if (res.data == true) {
                        $scope.$root.tabHide = 1;
                        $timeout(function () {
                            $scope.rec = {};
                            angular.element('.accordion-toggle').trigger('click');
                        }, 100);
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        var args = [];
                        args[0] = $scope.$root.crm_id;
                        args[1] = undefined;
                        $scope.$root.$broadcast("myOpportunityCycleEventReload", args);
                    }
                    else
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
        //if(popupService.showPopup('Would you like to delete?')) {

        //  }*/
    };
    $scope.show_symbol = false;
    $scope.setSymbol = function () {
        var id = this.detail.probability_type_id.id;
        if (id == 'Percentage')
            $scope.show_symbol = true;
        else
            $scope.show_symbol = false;
    }

    $scope.showWordsLimits = function () {
        $scope.wordsLength = $scope.rec.description.length;
    }


    $scope.addNewTabPopup = function () {

        var oppUrl = $scope.$root.setup + "crm/opportunity-cycle-tabs";
        $http
            .post(oppUrl, {
                id: id, 'token': $scope.$root.token, is_opp_cyle: 1
                , opp_cycle_limit: $scope.$root.opp_cycle_limit
            })
            .then(function (ress) {
                if (ress.data.ack == true)
                    $scope.arr_tabs_option = ress.data.response;
            });
        var postUrl = $scope.$root.setup + "crm/add-opportunity-cycle-tab";
        $scope.after_befor_tab_id = 0;
        $scope.position = 1;
        ngDialog.openConfirm({
            template: 'app/views/crm_opportunity_cycle/add_new_tab.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (tab) {


            tab.status = tab.tab_status != undefined ? tab.tab_status.value : 1;
            $scope.after_befor_tab_id = tab.after_befor_tab != undefined ? tab.after_befor_tab.id : 1;
            //rec.module_id = $scope.rec.tab_module_id != undefined? $scope.rec.tab_module_id.id:0
            tab.token = $scope.$root.token;
            $scope.position = tab.position;
            tab.array_tab = $scope.arr_tabs_option;
            tab.crm_id = $scope.$root.crm_id;
            $http
                .post(postUrl, tab)
                .then(function (res) {
                    if (res.data.ack == true) {
                        //$scope.is_defaults = 0;
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        var oppUrl = $scope.$root.setup + "crm/opportunity-cycle-tabs";
                        $http
                            .post(oppUrl, {
                                id: id, 'token': $scope.$root.token, is_opp_cyle: 1
                                , opp_cycle_limit: $scope.$root.opp_cycle_limit
                            })
                            .then(function (ress) {
                                if (ress.data.ack == true) {

                                    //$scope.$root.$apply(function(){
                                    $scope.arr_temps = [];
                                    $scope.arr_temp = ress.data.response;
                                    $.each($scope.arr_temp, function (index, obj1) {
                                        if (obj1.id == $scope.after_befor_tab_id) {

                                            if ($scope.position == 2)
                                                $scope.arr_temps.push(obj1);
                                            $.each($scope.arr_temp, function (index, obj2) {
                                                if (obj2.id == res.data.id)
                                                    $scope.arr_temps.push(obj2);
                                            });
                                            if ($scope.position == 1)
                                                $scope.arr_temps.push(obj1);
                                        }
                                        else if (obj1.id != res.data.id)
                                            $scope.arr_temps.push(obj1);
                                    });
                                    var sortUrl = $scope.$root.setup + "crm/sort-opportunity-cycle-tabs";
                                    $http
                                        .post(sortUrl, { 'record': $scope.arr_temps, 'token': $scope.$root.token })
                                        .then(function (res) {
                                        });
                                    $scope.arr_tabs = $scope.arr_temps;
                                    $timeout(function () {
                                        angular.element('#' + $scope.arr_tabs[0].id).removeClass('dont-click');
                                        angular.element('#' + $scope.arr_tabs[0].id + ' a').trigger('click');
                                    }, 2000);
                                    //},2000);

                                }
                            });
                        //$timeout(function(){ $state.go('app.opportunity-cycle-tabs'); }, 1000);
                    }
                    else
                        toaster.pop('error', 'info', res.data.error);
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.show_tasks = function () {
        $scope.$root.$broadcast("showTasksEvent", $scope.$root.opp_cycle_id);

        /*angular.element('#redactor_content').redactor( {
         
         //imageUpload: '<?php //echo base_url("asset/redactor-js-master/demo/scripts/image_upload.php")  ?>',
         // fileUpload: '<?php //echo base_url("asset/redactor-js-master/demo/scripts/file_upload.php")  ?>',
         //  imageUpload: "adminpanel/AdminJobs/editer_image_upload",
         // fileUpload: 'adminpanel/AdminJobs/editer_file_upload',
         
         } );*/

    }

    $scope.addNewRolePopup = function (drpdown, type, rec) {
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
            var postUrl = $scope.$root.setup + "hr/add-job-title";
            $http
                .post(postUrl, pedefined)
                .then(function (ress) {
                    if (ress.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        var roleUrl = $scope.$root.setup + "hr/job-title";
                        $http
                            .post(roleUrl, { 'token': $scope.$root.token })
                            .then(function (res) {

                                if (type == 1) {
                                    $scope.arr_roles1 = res.data.response;
                                    $scope.arr_roles1.push({ 'id': '-1', 'title': '++ Add New ++' });
                                    $timeout(function () {
                                        $.each($scope.arr_roles1, function (index, elem) {
                                            if (elem.id == ress.data.id)
                                                rec.role_one = elem;
                                        });
                                    }, 1000);
                                }
                                if (type == 2) {
                                    $scope.arr_roles2 = res.data.response;
                                    $scope.arr_roles2.push({ 'id': '-1', 'title': '++ Add New ++' });
                                    $timeout(function () {
                                        $.each($scope.arr_roles2, function (index, elem) {
                                            if (elem.id == ress.data.id)
                                                rec.role_two = elem;
                                        });
                                    }, 1000);
                                }
                                if (type == 3) {
                                    $scope.arr_roles3 = res.data.response;
                                    $scope.arr_roles3.push({ 'id': '-1', 'title': '++ Add New ++' });
                                    $timeout(function () {
                                        $.each($scope.arr_roles3, function (index, elem) {
                                            if (elem.id == ress.data.id)
                                                rec.role_three = elem;
                                        });
                                    }, 1000);
                                }

                            });
                    }

                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.addNewProcessPopup = function () {
        var id = $scope.rec.process_of_decisions != undefined ? $scope.rec.process_of_decisions.id : 0;
        if (!(id == -1))
            return false;
        $scope.pedefined = {};
        ngDialog.openConfirm({
            template: 'app/views/process_of_decision/add_process_of_decision.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (pedefined) {
            /*console.log(pedefined);
             return false;*/

            pedefined.token = $scope.$root.token;
            var postUrl = $scope.$root.setup + "general/add-process-of-decision";
            $http
                .post(postUrl, pedefined)
                .then(function (ress) {
                    if (ress.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));;
                        var roleUrl = $scope.$root.setup + "general/process-of-decision";
                        $http
                            .post(roleUrl, { 'token': $scope.$root.token })
                            .then(function (res) {
                                $scope.arr_process_of_decision = res.data.response;
                                //   $scope.arr_process_of_decision.push({'id': '-1', 'name': '++ Add New ++'});
                                $timeout(function () {
                                    $.each($scope.arr_process_of_decision, function (index, elem) {
                                        if (elem.id == ress.data.id)
                                            $scope.rec.process_of_decisions = elem;
                                    });
                                }, 1000);
                            });
                    }

                });
        }, function (reason) {
            $scope.rec.process_of_decisions = '';
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.pipeline = {};
    $scope.add_to_pipeline = function (rec, detail, tab_id) {
        tab_id_number = tab_id;
        var postUrl = $scope.$root.setup + "crm/add-sales-pipeline-target";
        $scope.pipeline = {
            code: 'SAL' + new Date().getTime(),
            start_period: detail.start_date,
            end_period: detail.end_date,
            description: rec.description,
            opp_cycle_id: rec.id,
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
                }
                else {
                    if (res.data.edit == false)
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(104));
                    else
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(106));
                }

            });
    }

    $scope.columns = [];
    $scope.selectedSalespersons_oop = [];
    $scope.getSalePerson_oop = function (isShow) {
        $scope.columns = [];
        $scope.salepersons = [];
        $scope.title = 'Salesperson';
        var postUrl = $scope.$root.hr + "employee/listings";
        var postData = { 'token': $scope.$root.token, 'all': "1" };
        $http
            .post(postUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {

                    $.each(res.data.response, function (indx, obj) {
                        obj.chk = false;
                        obj.isPrimary = false;
                        if ($scope.selectedSalespersons_oop.length > 0) {
                            $.each($scope.selectedSalespersons_oop, function (indx, obj2) {
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
                }
                else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });
        if (!isShow)
            angular.element('#salesPersonOppCycleModal').modal({ show: true });
    }

    angular.element(document).on('click', '.checkAllSalesperson', function () {
        $scope.selectedSalespersons_oop = [];
        if (angular.element('.checkAllSalesperson').is(':checked') == true) {
            $scope.isSalePerersonChanged = true;
            var isPrimary = false;
            for (var i = 0; i < $scope.salepersons.length; i++) {
                if ($scope.salepersons[i].isPrimary)
                    isPrimary = true;
                $scope.salepersons[i].chk = true;
                $scope.selectedSalespersons_oop.push($scope.salepersons[i]);
            }
            if (!isPrimary) {
                $scope.salepersons[0].isPrimary = true;
                $scope.selectedSalespersons_oop[0].isPrimary = true;
            }

        } else {
            for (var i = 0; i < $scope.salepersons.length; i++) {
                $scope.salepersons[i].chk = false;
                $scope.salepersons[i].isPrimary = false;
            }
            $scope.selectedSalespersons_oop = [];
        }

        //$timeout(function(){
        $scope.$apply(function () {
            $scope.selectedSalespersons_oop;
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
                    $.each($scope.selectedSalespersons_oop, function (indx, obj) {
                        if (obj != undefined) {
                            if (obj.id == sp.id)
                                $scope.selectedSalespersons_oop.splice(indx, 1);
                        }
                    });
                } else {

                    // console.log('i==>>'+i);
                    if (isPrimary == 1 || $scope.selectedSalespersons_oop.length == 0) {
                        var isExist = false;
                        $scope.salepersons[i].isPrimary = true;
                        $.each($scope.selectedSalespersons_oop, function (indx, obj) {
                            if (obj != undefined) {
                                $scope.selectedSalespersons_oop[indx].isPrimary = false;
                                if (obj.id == sp.id) {
                                    isExist = true;
                                    $scope.selectedSalespersons_oop[indx].isPrimary = true;
                                }

                            }
                        });
                        if (!isExist) {
                            $scope.salepersons[i].chk = true;
                            $scope.selectedSalespersons_oop.push($scope.salepersons[i]);
                        }

                    } else {
                        $scope.salepersons[i].chk = true;
                        $scope.selectedSalespersons_oop.push($scope.salepersons[i]);
                    }
                }

            }

        }
    }

    $scope.getSalePersons_edit = function (id) {

        var salepersonUrl = $scope.$root.sales + "crm/crm/get-crm-salesperson";
        $http
            .post(salepersonUrl, { id: id, 'token': $scope.$root.token, 'type': 4 })
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
                                $scope.selectedSalespersons_oop.push(obj);
                            }
                        });
                        $scope.salepersons.push(obj);
                    });
                }
                //else  toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));

            });
    }

    $scope.add_salespersons = function (id) {
        var check = false;
        var excUrl = $scope.$root.sales + "crm/crm/add-crm-salesperson";
        var post = {};
        var temp = [];
        $.each($scope.selectedSalespersons_oop, function (index, obj) {
            temp.push({ id: obj.id, isPrimary: obj.isPrimary });
        })
        post.type = 4;
        post.id = id;
        post.salespersons = temp;
        post.token = $scope.$root.token;
        $http
            .post(excUrl, post)
            .then(function (res) {
                if (res.data.ack == true) {
                    //$scope.add_salespersons_log(id);
                    check = true;
                }
            });
        return check;
    }

    $scope.add_salespersons_history = function (id) {
        var excUrl = $scope.$root.sales + "crm/crm/add-crm-salesperson-log";
        var post = {};
        var temp = [];
        $.each($scope.selectedSalespersons_oop, function (index, obj) {
            temp.push({ id: obj.id, isPrimary: obj.isPrimary });
        })
        post.type = 4;
        post.id = id;
        post.salespersons = temp;
        post.token = $scope.$root.token;
        $http
            .post(excUrl, post)
            .then(function (res) {
                //$scope.add_salespersons_log(id);
            });
    }








    $scope.tabsDetil = {};
    $scope.arr_selectedSalespersons2 = [];
    $scope.arr_selectedSalespersons3 = [];
    $scope.showPreviousTabs = function () {

        $scope.arr_selectedSalespersons3 = [];
        $scope.arr_selectedSalespersons2 = [];
        var postUrl = $scope.$root.sales + "crm/crm/get-crm-opportunity-cycle-detail";
        var post = {};
        post.token = $rootScope.token;
        post.id = $scope.rec.id;
        $http
            .post(postUrl, post)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.tabsDetil = res.data.response;
                    $.each(res.data.response, function (mIndex, mObj) {
                        var salepersonUrl = $scope.$root.sales + "crm/crm/get-opp-cycle-salesperson";
                        $http
                            .post(salepersonUrl, { id: mObj.id, 'token': $scope.$root.token })
                            .then(function (emp_data) {
                                if (emp_data.data.ack == true) {
                                    $scope.arr_selectedSalespersons2 = [];
                                    $.each($scope.arr_salepersons, function (indx, obj) {
                                        obj.chk = false;
                                        obj.isPrimary = false;
                                        $.each(emp_data.data.response, function (indx, obj2) {
                                            if (obj.id == obj2.salesperson_id) {
                                                obj.chk = true;
                                                if (obj2.is_primary == 1)
                                                    obj.isPrimary = true;
                                                $scope.arr_selectedSalespersons2.push(obj);
                                            }
                                        });
                                    });
                                    $scope.arr_selectedSalespersons3[mIndex] = $scope.arr_selectedSalespersons2;
                                }
                            });
                    });
                }


            });
        $timeout(function () {
            $rootScope.$apply(function () {
                $scope.arr_selectedSalespersons3;
            });
        }, 2000);
        angular.element('#prevTabDetailModal').modal({ show: true });
    }






    /////////////////////  Comments ///////////////////////

    $scope.formData_images_data_opp_cycle = [];
    $scope.$on("multi_image2", function (event, array_image2) {
        $scope.formData_images_data_opp_cycle = array_image2;
    });
    $scope.coment_data = {};
    $scope.coment_data.checkTitle = false;
    $scope.row_id = $scope.$root.crm_id;
    $scope.module_ids = tab_id_number; //$scope.detail.id;//$scope.rec.id; 

    $scope.addcomment = function (coment_data) {

        $scope.coment_data.row_id = $scope.row_id;
        $scope.coment_data.module_id = tab_id_number;
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
                    $scope.getComments();
                    $scope.wordsLength = 0;
                }
                else
                    toaster.pop('error', 'info', res.data.msg);
            });
    }

    $scope.wordsLength = 0;
    $scope.showWordsLimits = function () {
        $scope.wordsLength = $scope.coment_data.description.length;
    }
    $scope.getComments = function () {

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
        $timeout(function () {
            var API = $scope.$root.com + "document/comments-listings";
            var postData = {
                'token': $scope.$root.token,
                'row_id': $scope.row_id,
                'module_id': tab_id_number, ///0,
                'sub_type': 0, //6,
                'page': $scope.item_paging.spage,
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

                    /* $timeout(function(){
                     $rootScope.$digest();
                     },1000);*/
                    //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400)); 
                });
        }, 1000);
    }

    $scope.showEditFormComent = function (id) {

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
                .post(delUrl, { id: id, 'token': $scope.$root.token })
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
    $scope.show_coments_list = false;
    $scope.show_coments_form = false;
    $scope.show_add_comment_form = function () {
        $scope.show_coments_list = false;
        $scope.show_coments_form = true;
    }






    $scope.module_id_doc = $scope.rec.id; //$scope.detail.id;
    $scope.subtype = $scope.$root.opp_cycle_id; //1;



    $scope.showEditForm = function () {
        $scope.check_hrvalues_readonly = false;
        $scope.perreadonly = true;
    }

    $scope.formData2 = {};
    $scope.formData22 = {};
    var postData = {
        'token': $scope.$root.token,
        'module_id': $scope.module_id_doc
    };
    var postData_folder = {
        'token': $scope.$root.token,
        'module_id': $scope.module_id_doc
    };
    //----------- 	 Document 	 ----------------------------------------

    //--------------------     Folder  --------------------

    var postUrl_child = $scope.$root.com + "document/document_sub_folder";
    var postUrl_parent = $scope.$root.com + "document/document_folder";
    //var postUrl = $scope.$root.hr+"hr_values/document_parent_child_folder"; 



    $scope.list_folder_parent = function (arg) {


        $http
            .post(postUrl_parent, postData_folder)
            .then(function (res) {

                if (res.data.ack == true) {
                    if (arg == 1) {

                        $scope.list_folder = [];
                        if (res.data.response != null)
                            $scope.list_folder = res.data.response;
                        $scope.list_folder.push({ id: ' ', name: ' ' });
                        if ($scope.user_type == 1) {
                            $scope.list_folder.push({ 'id': '-1', 'name': '++ Add New ++' });
                            $scope.list_folder.push({ 'id': '-11', 'name': '++ Edit++' });
                        }

                    }
                    else if (arg == 2) {

                        $scope.list_folder_sub = [];
                        if (res.data.response != null)
                            $scope.list_folder_sub = res.data.response;
                        $scope.list_folder_sub.push({ 'id': '', 'name': '' });
                    }
                }
                else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                /*
                 $.each($scope.list_folder, function (index, elem) {
                 if (elem.name == $scope.formData2.name)
                 $scope.formData.folder_id = elem;
                 });
                 
                 $.each($scope.list_folder, function (index, elem) {
                 if (elem.id == insert_id)
                 $scope.formData.folder_id = elem;
                 });*/
            });
    }

    $scope.onChange_folder = function () {
        //	var f_id =document.getElementById('case_folder').value; 

        var f_id = this.formData.folder_id.id;
        if (f_id == -1) {
            $scope.list_folder_parent(2);
            $scope.formData2.folder_id = '';
            $scope.formData2.name = '';
            $('#add_folder_sub').modal({ show: true });
        }

        if (f_id == -11) {
            $scope.list_folder_parent(2);
            $scope.formData22.name = '';
            $scope.formData22.folder_id = '';
            $('#add_folder_sub_edit').modal({ show: true });
        }
    }

    $scope.add_folder = function (formData2) {

        $scope.formData2.token = $scope.$root.token;
        $scope.formData2.data = $scope.formFields;
        $scope.formData2.module_id = $scope.module_id_doc;
        $scope.formData2.folder_ids = $scope.formData2.folder_id !== undefined ? $scope.formData2.folder_id.id : 0;
        var submit_url = $scope.$root.com + "document/submit_folder_form";
        $http
            .post(submit_url, $scope.formData2)
            .then(function (res) {
                if (res.data.ack == true) {

                    var insert_id = res.data.id;
                    toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                    $('#add_folder_sub').modal('hide');
                    $scope.list_folder_parent(1);
                    $scope.list_folder_parent(2);
                    $timeout(function () {
                        $.each($scope.list_folder, function (index, elem) {
                            console.log(elem.id == insert_id);
                            if (elem.id == insert_id)
                                $scope.formData.folder_id = elem;
                        });
                    }, 1000);
                }
                else
                    toaster.pop('error', 'Add', res.data.error);
            });
    };
    $scope.add_folder_edit = function (formData22) {

        $scope.formData22.token = $scope.$root.token;
        $scope.formData22.data = $scope.formFields;
        $scope.list_folder[0];
        $scope.formData22.folder_ids = $scope.formData22.folder_id !== undefined ? $scope.formData22.folder_id.id : 0;
        //var f_id = this.formData22.folder_id.id;

        if ($scope.list_folder_sub[0].id == $scope.formData22.folder_ids) {
            toaster.pop('error', 'Info', "parent name can't be change");
            return;
        }

        var submit_url = $scope.$root.com + "document/update-folder";
        $http
            .post(submit_url, $scope.formData22)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(102));
                    $('#add_folder_sub_edit').modal('hide');
                    $http
                        .post(postUrl_parent, postData_folder)
                        .then(function (res) {
                            $scope.list_folder = [];
                            if (res.data.ack == true) {
                                $scope.list_folder = res.data.response;
                                //  $timeout(function () {
                                /*
                                 $.each($scope.list_folder, function (index, elem) {
                                 if (elem.name == $scope.formData2.name)
                                 $scope.formData.folder_id = elem;
                                 });
                                 
                                 $.each($scope.list_folder, function (index, elem) {
                                 if (elem.id == insert_id)
                                 $scope.formData.folder_id = elem;
                                 });*/

                                // }, 1000);
                            }
                            if ($scope.user_type == 1) {
                                $scope.list_folder.push({ 'id': '-1', 'name': '++ Add New ++' });
                                $scope.list_folder.push({ 'id': '-11', 'name': '++ Edit++' });
                            }
                        });
                }
                else
                    toaster.pop('error', 'Deleted', res.data.error);
            });
    };
    /*$scope.formData.fileName=[]; 
     $scope.$on("multi_image", function (event,array_image) {
     $scope.formData.fileName=  array_image;
     });*/

    $scope.item_paging = {};
    $scope.itemselectPage = function (pageno) {
        $scope.item_paging.spage = pageno;
    };
    $scope.getDocuments = function () {
        return;

        $scope.showcomentbeforedoc = false;
        $scope.check_readonly = true;
        /*$scope.$root.breadcrumbs =
         [//{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
         {'name':  $scope.module, 'url': '#', 'isActive': false},
         {'name': $scope.module_name, 'url': redirect, 'isActive': false},
         {'name': $scope.module_code, 'url': '#', 'isActive': false},
         {'name': 'Documents', 'url': '#', 'isActive': false}];
         */
        $scope.showdocumentlist = true;
        $scope.showdoc = false;
        var API = $scope.$root.com + "document/document_list";
        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'all': "1",
            'column': 'company_id',
            'module_id': $scope.$root.opp_cycle_id, //$scope.rec.id,
            'subtype': $scope.$root.opp_cycle_id,
            'employee_id': $scope.row_id,
            'page': $scope.item_paging.spage,
            //'country_keyword': angular.element('#search_sale_listing_data').val()
        };
        $http
            .post(API, $scope.postData)
            .then(function (res) {
            $scope.showdoc = false;
                $scope.documentlist = [];
                $scope.columns = [];
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.documentlist = res.data.response;
                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    $scope.showLoader = false;
                }
                //	else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400)); 
            });
    }

    $scope.fnDocForm = function () {
        //$scope.formData.fileName=[];var fileName=[];
        //$scope.$root.$broadcast("multi_image2",fileName);
        $scope.formData_images_data_opp_cycle = [];
        $scope.uploadConShow = true;
        $("#document_id").val('');
        $scope.formData.document_id = '';
        $scope.document_id = '';
        $scope.formData.folder_id = '';
        $scope.formData.document_title = '';
        $scope.formData.document_code = '';
        $scope.formData.document_path = '';
        $scope.showdoc = true;
        $scope.showdocumentlist = false;
        $scope.perreadonly = true;
        /*$scope.perreadonly = true;
         $scope.check_hrvalues_readonly = false;
         */


        $scope.list_folder_parent(1);
        var postUrl_code = $scope.$root.com + "document/doc_code";
        $http
            .post(postUrl_code, { 'token': $scope.$root.token, 'employee_id': $scope.row_id, 'module_id': $scope.module_id })
            .then(function (res) {
                //  if (res.data.ack == true) {
                $scope.formData.document_code = res.data.response.code;
                // $scope.document_code = res.data.response.code;
                //  console.log(res.data.response.code);
                // }
            });
    }

    $scope.adddocument_opp = function (formData) {


        $scope.formData.token = $scope.$root.token;
        $scope.formData.tab_id_2 = 4;
        $scope.formData.employee_id = $scope.row_id;
        $scope.formData.module_id = $scope.$root.opp_cycle_id; //$scope.module_id_doc;
        $scope.formData.subtype = $scope.$root.opp_cycle_id; //1;
        $scope.formData.document_id = $scope.document_id;
        $scope.formData.folder_ids = $scope.formData.folder_id !== undefined ? $scope.formData.folder_id.id : 0;
        if ($scope.formData.folder_ids == -1 || $scope.formData.folder_ids == -11) {
            toaster.pop('error', 'Info', "Select Folder Name");
            return;
        }
        //$scope.formData.fileName1 =$scope.formData_images_data;

        $scope.formData.fileName1 = $scope.formData_images_data_opp_cycle;
        var updatedoc = $scope.$root.com + "document/update_documents";
        $http
            .post(updatedoc, $scope.formData)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', res.data.info, res.data.msg);
                    $timeout(function () {
                        $scope.getDocuments();
                    }, 1000);
                } else
                    toaster.pop('error', 'Info', res.data.error);
            });
    }

    $scope.display_error_doc = true;
    $scope.showdocEditForm = function (id) {
        //$scope.formData.fileName=[];var fileName=[];
        //$scope.$root.$broadcast("multi_image2",fileName);
        $scope.formData_images_data_opp_cycle = [];
        $scope.uploadConShow = true;
        $scope.showdoc = true;
        $scope.showdocumentlist = false;
        /*	 $scope.check_hrvalues_readonly = false;
         $scope.perreadonly = true;*/
        $scope.perreadonly = true;
        $scope.list_folder_parent(1);
        var getBankUrl = $scope.$root.com + "document/document_by_id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };
        $scope.formData.document_id = id;
        $scope.document_id = id;
        $scope.showLoader = true;
        $timeout(function () {
            $http
                .post(getBankUrl, postViewBankData)
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
                        $.each($scope.list_folder, function (index, obj) {
                            if (res.data.response.folder_id != undefined || res.data.response.folder_id != null) {
                                if (obj.id == res.data.response.folder_id) {
                                    $scope.formData.folder_id = $scope.list_folder[index];
                                }
                            }
                        });
                    }

                });
            $scope.showLoader = false;
        }, 1000);
    }

    $scope.delete_document = function (id, index, arr_data) {
        var delUrl = $scope.$root.com + "document/delete_document";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
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
}

function CrmOppDocumentsController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams) {
    'use strict';
    $scope.module_id = 12;
    $scope.filter_id = 114;
    $scope.module_table = 'document';
    $scope.more_fields = 'null';
    $scope.condition = 0;
    if ($scope.$root.crm_id > 0)
        $scope.postData = { 'crm_id': $scope.$root.opp_cycle_id, token: $scope.$root.token, more_fields: 'module_id*create_date*user_name*path*name' }

    $scope.MainDefer = null;
    $scope.mainParams = null;
    $scope.mainFilter = null;
    $scope.more_fields = 'module_id*create_date*user_name*path*name';
    $scope.count = 1;
    var vm = this;
    var ApiAjax = $scope.$root.sales + "crm/crm/crm-opp-documents";
    $scope.$on("myCrmOppDocumentsEventReload", function (event, args) {
        if (args != undefined) {
            if (args[1] != undefined)
                $scope.detail(args[1]);
            $scope.postData = { 'crm_id': args[0], token: $scope.$root.token, more_fields: 'module_id*create_date*user_name*path*name' }
            $scope.$root.opp_cycle_id = args[0];
        }
        $scope.count = $scope.count + 1;
        //var ApiAjax = $resource('api/company/get_listing_ajax/:module_id/:module_table/:filter_id/:more_fields/:condition');
        ngDataService.getDataCustomAjax($scope.MainDefer, $scope.mainParams, ApiAjax, $scope.mainFilter, $scope, 'doreload' + $scope.count, $scope.postData);
        $scope.table.tableParams5.reload();
    });
    $scope.detail = function (id) {
        $timeout(function () {
            if ($scope.$root.lblButton == 'Add New') {
                $scope.$root.lblButton = 'Edit';
            }
        }, 100);
        $scope.$root.tabHide = 0;
        $scope.$root.$broadcast("openCrmOppDocumentsFormEvent", { 'edit': false, id: id });
    }

    $scope.editForm = function (id) {
        $scope.$root.$broadcast("openCrmOppDocumentsFormEvent", { 'edit': true, id: id });
    }


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
                if ($scope.$root.opp_cycle_id > 0)
                    ngDataService.getDataCustomAjax($defer, params, ApiAjax, $filter, $scope, 'crm_documents', $scope.postData);
                $scope.MainDefer = $defer;
                $scope.mainParams = params;
                $scope.mainFilter = $filter;
            }
        });
    $scope.$data = {};
    $scope.delete = function (id, index, $data) {
        var delUrl = $scope.$root.sales + "crm/crm/delete-crm-opp-document";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        $data.splice(index, 1);
                    }
                    else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };
    $scope.viewFile = function (id) {
        window.open(
            'api/crm_document_doc_view.php?id=' + id,
            '_blank' // <- This is what makes it open in a new window.
        );
    }

    // force download file
    var content = 'file content';
    var blob = new Blob([content], { type: '*' });
    $scope.url = (window.URL || window.webkitURL).createObjectURL(blob);
}

function CrmOppDocumentsAddController($scope, $stateParams, $http, $state, $resource, toaster, sharedProperties, $timeout, Upload, ngDialog) {


    $scope.rec = {};
    $scope.$root.tabHide = 0;
    $scope.$root.lblButton = 'Add New';
    $scope.arr_folders = {};
    $scope.folder = {};
    var getFolderUrl = $scope.$root.sales + "crm/crm/opp-cycle-folders";
    $scope.showCrmOppDocumentListing = function () {
        $scope.$root.$broadcast("showOppCycleDocListing");
    }

    $scope.showCrmOppDocumentEditForm = function () {
        $scope.check_readonly = false;
    }

    $scope.$on("showAddCrmOppDocumentForm", function () {
        $scope.check_file = false;
        $scope.check_files = false;
        $scope.show_opp_doc_listing = false;
        $scope.check_readonly = false;
        $scope.resetForm();
        var getDocUrl = $scope.$root.sales + "crm/crm/get-document-code";
        $http
            .post(getDocUrl, { is_increment: 1, 'token': $scope.$root.token })
            .then(function (res) {
                $scope.rec.document_code = '';
                $scope.rec.document_code = res.data.code;
            });
    });
    $http
        .post(getFolderUrl, { 'token': $scope.$root.token })
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.arr_folders = res.data.response;
                //$scope.arr_folders.push({'id':'-1','name':'++ Add New ++'});
            }

        });
    /*$scope.select = function(row){
     
     $scope.selected.title = row.title;
     $scope.selected.id = row.id;
     if($scope.selected.id > 0){
     $scope.isSelect = false;
     }
     
     if($scope.selected.id < 0){
     $scope.addFolderPopup();
     }
     console.log($scope.selected.id);
     $scope.folder.folder_id = $scope.selected.id;
     
     }  */


    $scope.$on("openCrmOppDocumentsFormEvent", function (event, arg) {
        return;
        $timeout(function () {
            var id = arg.id;
            if (arg.edit == false)
                $scope.check_readonly = true;
            else
                $scope.check_readonly = false;


            $scope.$root.$broadcast("showAddOppCycleDocForm");
            /*	 var altContactUrl = $scope.$root.sales+"crm/crm/alt-contacts";
             var postData = {'column':'crm_id','value':$scope.$root.crm_id,token:$scope.$root.token}
             $http
             .post(altContactUrl, postData)
             .then(function (res) {
             $scope.arr_alt_contacts = res.data.record.result;
             });*/

            //angular.element('.accordion-toggle').trigger('click');
            var getDocUrl = $scope.$root.sales + "crm/crm/get-crm-opp-document-by-id";
            $scope.rec = {};
            $scope.comp_files = [];
            var table = 'document';
            $http
                .post(getDocUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        $scope.rec = res.data.response;
                        $scope.rec.update_id = res.data.response.id;
                        $scope.rec.old_file = res.data.response.name;
                        $scope.rec.file_size = res.data.response.file_size;
                        $.each($scope.arr_folders, function (index, elem) {
                            if (elem.id == res.data.response.folder_id)
                                $scope.rec.folders = elem;
                        });
                        if (res.data.response.name != '') {
                            $scope.comp_files[0] = { file: res.data.response.name };
                            $scope.check_files = 1;
                            $scope.check_file = 0;
                        }
                    }
                });
        }, 100);
    });
    $scope.resetForm = function (rec) {
        $scope.files = [];
        $scope.str_files = [];
        $scope.temp_files = {};
        $scope.comp_files = {};
        $scope.check_file = 0;
        $scope.check_files = 0;
        document.getElementById("uploadCrmDocFile").value = '';
        $scope.rec = {};
        $scope.brands = '';
        /*angular.element("input[type='file']").val(null);*/
    }

    // force download file
    var content = 'file content';
    var blob = new Blob([content], { type: '*' });
    $scope.url = (window.URL || window.webkitURL).createObjectURL(blob);
    $scope.check_file = 0;
    $scope.onFileSelect = function ($files) {
        $scope.check_file = 1;
        $scope.files = [];
        $scope.files = $files;
        $scope.str_files = [];
        $scope.temp_files = [];
        $timeout(function () {
            angular.forEach($scope.files, function (file, key) {
                $scope.str_files.push({ name: file.name, index: key });
                $scope.temp_files.push(file.name);
            });
            /*document.getElementById("uploadCrmDocFile").value = $scope.temp_files; */
        }, 100)
    };
    $scope.removeFile = function (index) {
        $scope.files.splice(index, 1);
        $scope.str_files.splice(index, 1);
        $scope.temp_files.splice(index, 1);
        /*document.getElementById("uploadCrmDocFile").value = $scope.temp_files; */
        if ($scope.temp_files.length < 1)
            $scope.check_file = 0;
    }


    $scope.rec = {};
    $scope.add = function (rec) {
        var addUrl = $scope.$root.sales + "crm/crm/add-crm-opp-document";
        rec.folder_name = 'document';
        rec.row_id = $scope.$root.opp_cycle_id;
        rec.token = $scope.$root.token;
        rec.folder_id = $scope.rec.folders.id > 0 ? $scope.rec.folders.id : 0;
        if (rec.update_id != undefined)
            addUrl = $scope.$root.sales + "crm/crm/update-crm-opp-document";
        $scope.upload = Upload.upload({
            url: addUrl,
            method: 'POST',
            headers: { 'header-key': '83c238df1650bccb2d1aa4495723c63f07672ee8' },
            withCredentials: true,
            data: rec,
            file: $scope.files != undefined ? $scope.files[0] : '',
        }).progress(function (evt) {
            console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        }).success(function (res, status, headers, config) {
            if (res.ack == true || res.edit == true) {

                $scope.$root.lblButton = 'Add New';
                if (rec.update_id > 0)
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                else {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $scope.$root.$broadcast("showOppCycleDocListing");
                    $scope.resetForm(rec);
                }
                $scope.check_file = 0;
                $scope.check_files = 0;
                var args = [];
                args[0] = $scope.$root.opp_cycle_id;
                args[1] = undefined;
                $scope.$root.$broadcast("myCrmOppDocumentsEventReload", args);
                /*$timeout(function() {
                 angular.element('.accordion-toggle').trigger('click');
                 }, 100);*/
            }
            else {
                if (rec.update_id > 0)
                    toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
                else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
            }
        });
    }

    $scope.resetForm = function (rec) {
        $scope.rec = {};
        angular.element("input[type='file']").val(null);
    }

    $scope.closeTab = function (rec) {
        $scope.$root.tabHide = 1;
        $scope.resetForm(rec);
    }
    $scope.togleTab = function (rec) {
        $scope.resetForm(rec);
        $scope.$root.lblButton = 'Add New';
        $scope.$root.tabHide = 0;
        $timeout(function () {
            angular.element('.accordion-toggle').trigger('click');
        }, 100);
    }



    $scope.viewFile = function (id) {
        window.open(
            'api/crm_document_doc_view.php?id=' + id,
            '_blank' // <- This is what makes it open in a new window.
        );
    }

    $scope.addFolderPopup = function () {
        var id = $scope.rec.folders.id;
        if (id > 0)
            return false;
        /*var index = $scope.arr_folders.indexOf('-1');
         $scope.arr_folders.splice(index,1);*/

        ngDialog.openConfirm({
            template: 'app/views/crm_opportunity_cycle/add_folder.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (folder) {
            var foldUrl = $scope.$root.sales + "crm/crm/add-opp-cycle-folder"
            folder.token = $scope.$root.token;
            folder.row_id = $scope.$root.opp_cycle_id;
            folder.module_id = 49;
            folder.folder_id = folder.folders != undefined ? folder.folders.id : 0;
            $http
                .post(foldUrl, folder)
                .then(function (res1) {
                    if (res1.data.ack == true) {
                        var getFolderUrl = $scope.$root.sales + "crm/crm/opp-cycle-folders";
                        $http
                            .post(getFolderUrl, { 'all': '1', 'token': $scope.$root.token })
                            .then(function (res) {
                                if (res.data.ack == true) {

                                    $scope.arr_folders = res.data.response;
                                    //$scope.arr_folders.push({'id':'-1','name':'++ Add New ++'});
                                    $timeout(function () {
                                        $.each($scope.arr_folders, function (index, elem) {
                                            if (elem.id == res1.data.id) {
                                                $scope.$root.$apply(function () {
                                                    $scope.rec.folders = elem;
                                                });
                                            }
                                        });
                                    }, 1000);
                                }
                            });
                        // angular.element("#close-modal").click();

                    }



                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    /*angular.element(document).on('click','.dropdown-title',function(){
     angular.element('.dropdown-content').show();
     });
     
     angular.element(document).on('click','.dropdown-content ul li span',function(e){
     e.preventDefault();
     angular.element('.dropdown-content').hide();
     });
     
     angular.element(document).on('mousedown',".dropdown-content", function(e) { 
     if( (e.which == 3) ) {
     angular.element('.dropdown-content').hide();
     }
     e.preventDefault();
     }).on('contextmenu', function(e){
     e.preventDefault();
     });
     
     angular.element(document).mouseup(function (e)
     {
     var container = angular.element(".dropdown-content");
     
     if (!container.is(e.target) 
     && container.has(e.target).length === 0)
     {
     container.hide();
     }
     });*/










}
