AltDepotController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.controller('AltDepotController', AltDepotController);
function AltDepotController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams) {
    'use strict';


    $scope.module_id = 69;
    $scope.filter_id = 106;
    $scope.module_table = 'crm_alt_depot';
    $scope.more_fields = 'null';
    $scope.condition = 0;
    $scope.sendRequest = false;
    $scope.showSaleperson = false;

    if ($scope.$root.crm_id > 0)
        $scope.postData = {'column': 'crm_id', 'value': $scope.$root.crm_id, token: $scope.$root.token}

    $scope.MainDefer = null;
    $scope.mainParams = null;
    $scope.mainFilter = null;
    $scope.more_fields = 'crm_id';

    $scope.count = 1;
    var vm = this;

    //var Api = $resource('api/company/get_listing/:module_id/:module_table');
    var ApiAjax = $scope.$root.sales + "crm/crm/alt-depots";
    $scope.bucket_id = 0;
    $scope.$on("myAltDepotEventReload", function (event, args) {

        var crm_id = args.id;//args[0]
        $scope.bucket_id = args.bucket_id;

        if (crm_id == undefined) {
            var crm_id = args[0];
        }
        $scope.sendRequest = true;
        if (args != undefined) {
            if (args[1] != undefined) {
                $scope.detail(args[1]);
                $scope.showSaleperson = true;
            }
            $scope.postData = {'column': 'crm_id', 'value': crm_id, token: $scope.$root.token}
            $scope.$root.crm_id = crm_id;

        }
        $scope.count = $scope.count + 1;

        //var ApiAjax = $resource('api/company/get_listing_ajax/:module_id/:module_table/:filter_id/:more_fields/:condition');
        //  ngDataService.getDataCustomAjax($scope.MainDefer, $scope.mainParams, ApiAjax, $scope.mainFilter, $scope, 'doreload' + $scope.count, $scope.postData);
        //  $scope.table.tableParams5.reload();
        $scope.get_location();
    });

    $scope.detail = function (id) {
        $timeout(function () {
            if ($scope.$root.lblButton == 'Add New') {
                $scope.$root.lblButton = 'Edit';
            }
        }, 100);

        $scope.$root.tabHide = 0;
        $scope.$root.$broadcast("openAltDepotFormEvent", {
            'edit': true,
            id: id,
            'cust': $scope.showSaleperson,
            'bucket': $scope.bucket
        });
    }

    $scope.editForm = function (id) {

        $scope.$root.$broadcast("openAltDepotFormEvent", {
            'edit': true, id: id, 'cust': $scope.showSaleperson
            , 'bucket': $scope.bucket_id
        });
    }

    $scope.$watch("MyCustomeFilters", function () {
        if ($scope.MyCustomeFilters && $scope.table.tableParams5) {
            $scope.table.tableParams5.reload();
        }
    }, true);

    $scope.MyCustomeFilters = {}

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
            /* if ($scope.$root.crm_id > 0 && $scope.sendRequest == true)
             ngDataService.getDataCustomAjax($defer, params, ApiAjax, $filter, $scope, 'alt_depot', $scope.postData);
             $scope.MainDefer = $defer;
             $scope.mainParams = params;
             $scope.mainFilter = $filter;*/
            $scope.get_location();
        }
    });


    $scope.get_location = function () {

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

                     $scope.record_data = res.data.record.result;

                     angular.forEach($scope.record_data[0], function (val, index) {
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


    $scope.$data = {};
    $scope.delete = function (id, index, $data) {
        var delUrl = $scope.$root.sales + "crm/crm/delete-alt-depot";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                 .post(delUrl, {id: id, 'token': $scope.$root.token})
                 .then(function (res) {
                     if (res.data.ack == true) {
                         toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                         $data.splice(index, 1);
                     }
                     else
                         toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));

                 });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };


}


myApp.controller('AltDepotAddController', AltDepotAddController);
function AltDepotAddController($scope, $stateParams, $http, $state, $resource, toaster, sharedProperties, $timeout, ngDialog, $rootScope) {

    $scope.$root.tabHide = 0;
    $scope.$root.lblButton = 'Add New';
    $scope.check_readonly = 0;
    $scope.wordsLength = 0;
    $scope.countries = [];
    $scope.rec = {};
    $scope.showSaleperson = false;
    $scope.arr_loc_regions = [];
    $scope.arr_contacts = [];
    $scope.arr_address_type = [];
    $scope.arr_pref_method_comm = [];


    $scope.arr_types = [{'id': '1', 'name': "Primary"}, {'id': '2', 'name': "Other"}];

    $scope.showAltDepotListing = function () {
        $scope.$root.$broadcast("showAltDepotListing");
    }

    $scope.showAltDepotEditForm = function () {
        $scope.check_readonly = false;
    }

    $scope.getAddressTypes = function () {
        var addressTypeUrl = $scope.$root.sales + "crm/crm/get-all-address-types";
        $http
             .post(addressTypeUrl, {'token': $scope.$root.token})
             .then(function (res) {
                 $scope.arr_address_type = res.data.response;
                 $scope.arr_address_type.push({'id': '-1', 'title': '++ Add New ++'});
             });
    }
    if ($stateParams.id == undefined)
    {

        $rootScope.get_country_list();

        $timeout(function () {
            $.each($rootScope.country_type_arr, function (index, elem) {
                if (elem.id == $scope.$root.defaultCountry)
                    $scope.rec.depo_country_id = elem;
            });
        }, 1000);

    }



    $scope.getContacts = function () {
        var contactUrl = $scope.$root.sales + "crm/crm/alt-contacts";
        $http
             .post(contactUrl, {
                 'column': 'crm_alt_contact.crm_id',
                 'value': $scope.$root.crm_id,
                 token: $scope.$root.token
             })
             .then(function (res) {
                 $scope.arr_contacts = res.data.record.result;
             });
    }
    //  $scope.getContacts();
    $scope.getAddressTypes();

    var prefMethodUrl = $scope.$root.sales + "crm/crm/pref-method-of-comm";
    $http
         .post(prefMethodUrl, {'token': $scope.$root.token})
         .then(function (res) {
             $scope.arr_pref_method_comm = res.data.response;
             $scope.arr_pref_method_comm.push({'id': '-1', 'title': '++ Add New ++'});
         });

    $scope.$on("showAddAltDepotForm", function (event, arg) {

        if (arg != undefined)
            $scope.showSaleperson = true;
        else
            $scope.showSaleperson = false;

        $scope.check_readonly = false;
        $scope.resetForm();
        // $scope.getContacts();
        $scope.rec.sales_persons = '';
        $scope.rec.salesperson_id = '';
        //$scope.rec.depot ='Main office';
        $.each($rootScope.country_type_arr, function (index, elem) {
            if (elem.id == $scope.$root.defaultCountry)
                $scope.rec.depo_country_id = elem;
        });

    });



///////////Mudassir//////////
    var custUrl = $scope.$root.setup + "crm/region-list";
    var postData = {'token': $scope.$root.token, 'all': "1"};
    $scope.regions = {};
    $http
         .post(custUrl, postData)
         .then(function (res) {
             if (res.data.ack == true) {
                 $scope.regions = res.data.response;
                 $timeout(function () {
                     if ($scope.user_type == 1) {
                         $scope.regions.push({'id': '-1', 'title': '++ Add New ++'});
                     }
                 }, 5000);
             } else {
                 toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
             }

         });

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

    //edit status
    $scope.addNewPredefinedPopup = function (drpdown, type, title, drp) {
        $scope.isBtnPredefined = false;

        var id = drpdown.id;


        if (Number(id) > 0 || Number(id) == 0)
            return false;
        else {

            $scope.popup_title = title;

            $scope.pedefined = {};


            ngDialog.openConfirm({
                template: 'app/views/crm/add_predefined.html',
                className: 'ngdialog-theme-default-custom-large',
                scope: $scope
            }).then(function (pedefined) {


                pedefined.token = $scope.$root.token;
                pedefined.type = type;
                pedefined.crm_id = $scope.$root.crm_id;

                var postUrl = $scope.$root.setup + "ledger-group/add-predefine";
                if (type == 'REGION')
                    var postUrl = $scope.$root.setup + "crm/add-region";
                if (type == 'SEGMENT')
                    var postUrl = $scope.$root.setup + "crm/add-segment";
                if (type == 'BUYING_GROUP')
                    var postUrl = $scope.$root.setup + "crm/add-buying-group";
                if (type == 'PREFER_METHOD')
                    var postUrl = $scope.$root.sales + "crm/crm/add-pref-method-of-comm";
                if (type == 'STATUS')
                    var postUrl = $scope.$root.sales + "crm/crm/add-crm-status";
                if (type == 'CREDIT_RATING')
                    var postUrl = $scope.$root.sales + "crm/crm/add-crm-credit-rating";
                if (type == 'CRM_CLASSIFICATION')
                    var postUrl = $scope.$root.sales + "crm/crm/add-crm-classification";
                if (type == 'OWNER')
                    var postUrl = $scope.$root.sales + "crm/crm/add-crm-owner";


                $http
                     .post(postUrl, pedefined)
                     .then(function (ress) {
                         if (ress.data.ack == true) {
                             toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));

                             var getUrl = $scope.$root.setup + "ledger-group/get-predefine-by-type";
                             if (type == 'REGION')
                                 var getUrl = $scope.$root.setup + "crm/region-list";
                             if (type == 'SEGMENT')
                                 var getUrl = $scope.$root.setup + "crm/segment-list";
                             if (type == 'BUYING_GROUP')
                                 var getUrl = $scope.$root.setup + "crm/buying-group-list";
                             if (type == 'PREFER_METHOD')
                                 var getUrl = $scope.$root.sales + "crm/crm/pref-method-of-comm";
                             if (type == 'STATUS')
                                 var getUrl = $scope.$root.sales + "crm/crm/all-status";
                             if (type == 'CREDIT_RATING')
                                 var getUrl = $scope.$root.sales + "crm/crm/crm-credit-ratings";
                             if (type == 'CRM_CLASSIFICATION')
                                 var getUrl = $scope.$root.sales + "crm/crm/crm-classifications";
                             if (type == 'OWNER')
                                 var getUrl = $scope.$root.sales + "crm/crm/all-owner";
                             //, 'crm_id': $scope.$root.crm_id
                             $http
                                  .post(getUrl, {'token': $scope.$root.token, type: type})
                                  .then(function (res) {
                                      if (res.data.ack == true) {
                                          console.log(type);
                                          if (type == 'CUST_STATUS') {
                                              $scope.arr_cust_status = res.data.response;
                                              //   if ($scope.user_type == 1)   $scope.arr_cust_status.push({'id': '-1', 'name': '++ Add New ++'});
                                              $timeout(function () {
                                                  $.each($scope.arr_status, function (index, elem) {
                                                      if (elem.id == ress.data.id)
                                                          drp.status_id = elem;
                                                  });
                                              }, 1000);
                                          }
                                          if (type == 'TURNOVER') {
                                              $scope.arr_turnover = res.data.response;
                                              if ($scope.user_type == 1) {
                                                  //  console.log("DDDD");
                                                  $timeout(function () {
                                                      if ($scope.user_type == 1)
                                                          $scope.arr_turnover.push({'id': '-1', 'name': '++ Add New ++'});
                                                  }, 500);

                                              }
                                              $timeout(function () {
                                                  $.each($scope.arr_turnover, function (index, elem) {
                                                      if (elem.id == ress.data.id)
                                                          drp.turnover_id = elem;
                                                  });
                                              }, 1000);
                                          }
                                          if (type == 'SEGMENT') {
                                              $scope.arr_segment = res.data.response;
                                              if ($scope.user_type == 1) {
                                                  $timeout(function () {
                                                      if ($scope.user_type == 1)
                                                          $scope.arr_segment.push({'id': '-1', 'title': '++ Add New ++'});
                                                  }, 500);
                                              }
                                              $timeout(function () {
                                                  $.each($scope.arr_segment, function (index, elem) {
                                                      if (elem.id == ress.data.id)
                                                          drp.company_type_id = elem;
                                                  });
                                              }, 1000);
                                          }
                                          if (type == 'BUYING_GROUP') {
                                              $scope.arr_buying_group = res.data.response;
                                              if ($scope.user_type == 1) {
                                                  $timeout(function () {
                                                      if ($scope.user_type == 1)
                                                          $scope.arr_buying_group.push({
                                                              'id': '-1',
                                                              'title': '++ Add New ++'
                                                          });
                                                  }, 500);
                                              }
                                              $timeout(function () {
                                                  $.each($scope.arr_buying_group, function (index, elem) {
                                                      if (elem.id == ress.data.id)
                                                          drp.buying_grp_id = elem;
                                                  });
                                              }, 1000);
                                          }
                                          if (type == 'REGION') {
                                              $scope.arr_regions = res.data.response;
                                              if ($scope.user_type == 1) {
                                                  $timeout(function () {
                                                      if ($scope.user_type == 1)
                                                          $scope.arr_regions.push({'id': '-1', 'title': '++ Add New ++'});
                                                  }, 500);
                                              }
                                              $timeout(function () {
                                                  $.each($scope.arr_regions, function (index, elem) {
                                                      if (elem.id == ress.data.id)
                                                          drp.region = elem;
                                                  });
                                              }, 1000);
                                          }
                                          if (type == 'SOURCES_OF_CRM') {
                                              $scope.arr_sources_of_crm = res.data.response;
                                              if ($scope.user_type == 1)
                                                  $scope.arr_sources_of_crm.push({'id': '-1', 'name': '++ Add New ++'});
                                              $timeout(function () {
                                                  $.each($scope.arr_sources_of_crm, function (index, elem) {
                                                      if (elem.id == ress.data.id)
                                                          drp.sources_of_crm_id = elem;
                                                  });
                                              }, 1000);
                                          }
                                          if (type == 'PREFER_METHOD') {
                                              $scope.arr_pref_method_comm = res.data.response;
                                              if ($scope.user_type == 1)
                                                  $scope.arr_pref_method_comm.push({'id': '-1', 'title': '++ Add New ++'});
                                              $timeout(function () {
                                                  $.each($scope.arr_pref_method_comm, function (index, elem) {
                                                      if (elem.id == ress.data.id)
                                                          drp.pref_mthod_of_comm = elem;
                                                  });
                                              }, 1000);
                                          }
                                          if (type == 'STATUS') {
                                              $scope.arr_crm_status = res.data.response;
                                              //  if ($scope.user_type == 1)   $scope.arr_crm_status.push({'id': '-1', 'title': '++ Add New ++'});
                                              $timeout(function () {
                                                  $.each($scope.arr_crm_status, function (index, elem) {
                                                      if (elem.id == ress.data.id)
                                                          drp.status_id = elem;
                                                  });
                                              }, 1000);
                                          }

                                          if (type == 'OWNER') {
                                              $scope.arr_ownership = res.data.response;
                                              if ($scope.user_type == 1)
                                                  $scope.arr_ownership.push({'id': '-1', 'title': '++ Add New ++'});
                                              $timeout(function () {
                                                  $.each($scope.arr_ownership, function (index, elem) {
                                                      if (elem.id == ress.data.id)
                                                          drp.ownership_type = elem;
                                                  });

                                              }, 1000);
                                          }
                                          if (type == 'CRM_CLASSIFICATION') {
                                              $scope.arr_crm_classification = res.data.response;
                                              if ($scope.user_type == 1)
                                                  $scope.arr_crm_classification.push({'id': '-1', 'title': '++ Add New ++'});
                                              $timeout(function () {
                                                  $.each($scope.arr_crm_classification, function (index, elem) {
                                                      if (elem.id == ress.data.id)
                                                          drp.crm_classification = elem;
                                                  });
                                              }, 1000);
                                          }
                                          if (type == 'CREDIT_RATING') {
                                              $scope.arr_crm_credit_rating = [];
                                              $scope.arr_crm_credit_rating = res.data.response;
                                              if ($scope.user_type == 1)
                                                  $scope.arr_crm_credit_rating.push({'id': '-1', 'title': '++ Add New ++'});
                                              $timeout(function () {
                                                  $.each($scope.arr_crm_credit_rating, function (index, elem) {
                                                      if (elem.id == ress.data.id)
                                                          drp.credit_rating = elem;
                                                  });
                                              }, 1000);
                                          }

                                      }


                                  });
                         }
                         else
                             toaster.pop('error', 'Info', ress.data.error)


                     });

            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
    }




    $scope.bucket_id = 0;
    $scope.$on("openAltDepotFormEvent", function (event, arg) {

        //  $scope.selectedLocRegions = []; $scope.salepersons= [];$scope.selectedSalespersons_loc= [];

        var id = arg.id;
        $scope.alt_id = arg.id;
        $scope.bucket_id = arg.bucket_id;

        if (arg.edit == false)
            $scope.check_readonly = true;
        else
            $scope.check_readonly = false;

        if (arg.cust == true)
            $scope.showSaleperson = true;
        else
            $scope.showSaleperson = false;

        $scope.$root.$broadcast("showAltDepotForm");
        $scope.altDepotFormShow = false;
        $scope.altDepotListingShow = true;
        var altdepotUrl = $scope.$root.sales + "crm/crm/get-alt-depot";
        angular.element('.accordion-toggle').trigger('click');
        $scope.rec = {};

        $scope.getSalePersons(1);
        $http
             .post(altdepotUrl, {id: id, 'token': $scope.$root.token})
             .then(function (res) {
                 $timeout(function () {

                     $scope.rec = res.data.response;
                     //$scope.rec.depot ='Main office';
                     $scope.rec.id = res.data.response.id;
                     $scope.wordsLength = res.data.response.booking_instructions.length;

                     $.each($scope.regions, function (index, elem) {
                         if (elem.id == res.data.response.region_id) {
                             $scope.rec.region = elem;
                         }
                     });
                     //    var regionUrl = $scope.$root.sales + "crm/crm/get-alt-location-regions";
//                        $http
//                                .post(regionUrl, {id: res.data.response.id, 'token': $scope.$root.token})
//                                .then(function (res_reg) {
//                                    if (res_reg.data.ack == true) {
//                                        $.each($scope.arr_loc_regions, function (indx, obj) {
//                                            obj.chk = false;
//                                            $.each(res_reg.data.response, function (indx, obj2) {
//                                                if (obj.id == obj2) {
//                                                    obj.chk = true;
//                                                    $scope.selectedLocRegions.push(obj);
//                                                }
//                                            });
//                                            $scope.arr_loc_regions.push(obj);
//                                        });
//                                    }
//                                });

                     /*      var empUrl = $scope.$root.hr + "employee/get-employee";
                      if (res.data.response.salesperson_id > 0) {
                      $http
                      .post(empUrl, {id: res.data.response.salesperson_id, 'token': $scope.$root.token})
                      .then(function (emp_data) {
                      if (emp_data.data.ack == true)
                      $scope.rec.sales_persons = emp_data.data.response.first_name + ' ' + emp_data.data.response.last_name;
                      });
                      }
                      else    $scope.rec.sales_persons = '';
                      
                      */


                     $scope.getSalePersons_edit(res.data.response.id);

                     $scope.getComments();
                     $scope.getRegions(1);




                     $.each($rootScope.country_type_arr, function (index, elem) {
                         if (elem.id == $scope.rec.country)
                             $scope.rec.depo_country_id = elem;
                     });


                     $.each($scope.arr_contacts, function (index, elem) {
                         if (elem.id == res.data.response.contact_id)
                             $scope.rec.contact = elem;
                     });
                     $.each($scope.arr_types, function (index, elem) {
                         if (elem.id == res.data.response.type)
                             $scope.rec.types = elem;
                     });
                     $.each($scope.arr_address_type, function (index, elem) {
                         if (elem.id == res.data.response.address_type)
                             $scope.rec.address_types = elem;
                     });
                     $.each($scope.arr_pref_method_comm, function (index, elem) {
                         if (elem.id == res.data.response.pref_method_of_communication) {
                             $scope.drp.pref_mthod_of_comm = elem;
                         }
                     });
                 }, 1000);
             });

    });

    $scope.resetForm = function (rec) {
        $scope.rec = {};
        $scope.selectedLocRegions = [];
        $scope.salepersons = [];
        $scope.selectedSalespersons_loc = [];

    }

    $scope.add_location = function (rec, drp) {

        var altAddUrl = $scope.$root.sales + "crm/crm/add-alt-depot";

        rec.country = rec.depo_country_id != undefined ? rec.depo_country_id.id : 0;
        rec.region_id = rec.region != undefined ? rec.region.id : 0;
        rec.contact_id = rec.contact != undefined ? rec.contact.id : 0;
        rec.address_type = rec.address_types != undefined ? rec.address_types.id : 0;
        rec.pref_method_of_communication = drp.pref_mthod_of_comm != undefined ? drp.pref_mthod_of_comm.id : 0;
        rec.booking_pref_method_of_communication = drp.booking_pref_mthod_of_comm != undefined ? drp.booking_pref_mthod_of_comm.id : 0;
        rec.type = rec.types != undefined ? rec.types.id : 0;
        rec.crm_id = $scope.$root.crm_id;
        rec.token = $scope.$root.token;

        if (rec.id != undefined)
            altAddUrl = $scope.$root.sales + "crm/crm/update-alt-depot";

        $http
             .post(altAddUrl, rec)
             .then(function (res) {

                 var newId = 0;
                 if (rec.id)
                     newId = rec.id;
                 else
                     newId = res.data.id;
                 /*if ($scope.selectedLocRegions.length > 0)
                  $scope.add_loc_regions(newId);*/

                 $scope.$root.count = $scope.$root.count + 1;
                 if (res.data.ack == true || res.data.edit == true) {


                     // if (rec.id > 0)  {
                     if ($scope.isSalePerersonChanged) {
                         $scope.add_salespersons(res.data.id);

                     }
                     $scope.add_salespersons_history(res.data.id);
                     //}


                     if (rec.id > 0)
                         toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                     else {
                         $scope.addAltContact(rec);

                         // $scope.addAltContactBooking(rec);
                         toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                         $scope.resetForm(rec);
                         $scope.$root.$broadcast("showAltDepotListing");
                     }

                     var args = [];
                     args[0] = $scope.$root.crm_id;
                     args[1] = undefined;
                     $scope.$root.$broadcast("myAltDepotEventReload", args);

                     $timeout(function () {
                         $scope.showAltDepotListing();
                     }, 1000);

                     //$scope.altDepotFormShow=false;
                     //$scope.altDepotListingShow=true;
                 }
                 else if (res.data.ack == 2)
                     toaster.pop('error', 'info', res.data.error);


                 else {
                     if (rec.id > 0)
                         toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                     else
                         toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                 }
             });
    }

    $scope.addAltContact = function (rec) {

        rec.address_1 = rec.address;
        rec.job_title = rec.role;
        rec.phone = rec.telephone;

        var altAddUrl = $scope.$root.sales + "crm/crm/add-alt-contact";
        $http
             .post(altAddUrl, rec)
             .then(function (res) {
             });
    }

    $scope.addAltContactBooking = function (rec) {
        var temp_rec = {};
        temp_rec.token = $scope.$root.token;
        temp_rec.crm_id = $scope.$root.crm_id;
        temp_rec.contact_name = rec.booking_contact;
        temp_rec.job_title = rec.booking_job_title;
        temp_rec.direct_line = rec.booking_direct_line;
        temp_rec.mobile = rec.booking_mobile;
        temp_rec.phone = rec.booking_telephone;
        temp_rec.fax = rec.booking_fax;
        temp_rec.email = rec.booking_email;
        temp_rec.pref_method_of_communication = rec.booking_pref_method_of_communication;

        var altAddUrl = $scope.$root.sales + "crm/crm/add-alt-contact";
        $http
             .post(altAddUrl, temp_rec)
             .then(function (res) {
             });
    }

    $scope.add_loc_regions = function (id) {
        var postUrl = $scope.$root.sales + "crm/crm/add-alt-location-region";
        var post = {};
        var temp = [];
        $.each($scope.selectedLocRegions, function (index, obj) {
            temp.push({id: obj.id});
        })

        post.id = id;
        post.regions = temp;
        post.token = $scope.$root.token;
        $http
             .post(postUrl, post)
             .then(function (res) {
             });
    }


    $scope.showWordsLimits_dept = function () {
        $scope.wordsLength = $scope.rec.booking_instructions.length;
    }

    function toTitleCase(str) {
        var title = str.replace('_', ' ');
        return title.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    $scope.getSalePerson = function () {
        $scope.columns = [];
        $scope.record = {};
        $scope.title = 'Salesperson';
        var empUrl = $scope.$root.hr + "employee/listings";
        postData = {
            'token': $scope.$root.token,
            'all': "1",
        };
        $http
             .post(empUrl, postData)
             .then(function (res) {
                 if (res.data.ack == true) {
                     $scope.columns = [];
                     $scope.record = res.data.response;
                     angular.forEach(res.data.response[0], function (val, index) {
                         $scope.columns.push({
                             'title': toTitleCase(index),
                             'field': index,
                             'visible': true
                         });
                     });
                 } else {
                     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                 }
             });

        ngDialog.openConfirm({
            template: 'modalDialogId2',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (result) {
            $scope.rec.sales_persons = result.first_name + ' ' + result.last_name;
            $scope.rec.salesperson_id = result.id;
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }
    $scope.isCheced = false;
    $scope.sameAsGeneral = function () {
        if ($scope.isCheced == false) {
            $scope.$root.$broadcast('getGeneralData');
            $scope.$on('setGeneralData', function (event, data) {
                $scope.$root.$apply(function () {
                    $scope.rec.contact_name = data.contact_person;
                    $scope.rec.role = data.job_title;
                    $scope.rec.direct_line = data.direct_line;
                    $scope.rec.mobile = data.mobile;
                    $scope.rec.telephone = data.phone;
                    $scope.rec.fax = data.fax;
                    $scope.rec.email = data.email;
                    $scope.isCheced = true;
                });
            });
        } else {
            $scope.rec.contact_name = null;
            $scope.rec.role = null;
            $scope.rec.direct_line = null;
            $scope.rec.mobile = null;
            $scope.rec.telephone = null;
            $scope.rec.fax = null;
            $scope.rec.email = null;
            $scope.isCheced = false;
        }
    }


    // Select Regions, Segments and Buying goups
//-------------------------------------------------------------

    $scope.getRegions = function (isShow) {
        $scope.columns = [];
        $scope.arr_loc_regions = [];
        //$scope.selectedGroups = [];
        $scope.title = 'Regions';
        var custUrl = $scope.$root.setup + "crm/region-list";
        var postData = {'token': $scope.$root.token, 'all': "1"};

        $http
             .post(custUrl, postData)
             .then(function (res) {
                 if (res.data.ack == true) {
                     $.each(res.data.response, function (indx, obj) {
                         obj.chk = false;
                         if ($scope.selectedLocRegions.length > 0) {
                             $.each($scope.selectedLocRegions, function (indx, obj2) {
                                 if (obj.id == obj2.id)
                                     obj.chk = true;
                             });
                         }
                         $scope.arr_loc_regions.push(obj);

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

                     /*if($scope.selectedGroups.length == res.data.response.length){
                      $timeout(function(){
                      $scope.$root.$apply(function(){
                      angular.element('.checkAll').prop('checked',true);
                      });
                      },500);
                      }*/
                 } else {
                     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                 }

             });

        if (!isShow)
            angular.element('#regionLocModal').modal({show: true});
    }

    angular.element(document).on('click', '.checkAllRegions', function (event) {
        //event.preventDefault();
        $scope.selectedLocRegions = [];
        if (angular.element('.checkAllRegions').is(':checked') == true) {
            for (var i = 0; i < $scope.arr_loc_regions.length; i++) {
                $scope.arr_loc_regions[i].chk = true;
                $scope.selectedLocRegions.push($scope.arr_loc_regions[i]);
            }
        } else {
            for (var i = 0; i < $scope.arr_loc_regions.length; i++) {
                $scope.arr_loc_regions[i].chk = false;
                $scope.selectedLocRegions = [];
            }
        }

        $scope.$root.$apply(function () {
            $scope.selectedLocRegions;
        });

    });

    $scope.selectRegion = function (cust) {
        for (var i = 0; i < $scope.arr_loc_regions.length; i++) {
            if (cust.id == $scope.arr_loc_regions[i].id) {
                if ($scope.arr_loc_regions[i].chk == true) {
                    $scope.arr_loc_regions[i].chk = false;
                    $.each($scope.selectedLocRegions, function (indx, obj) {
                        if (obj != undefined) {
                            if (obj.id == cust.id)
                                $scope.selectedLocRegions.splice(indx, 1);
                        }
                    });
                } else {
                    $scope.arr_loc_regions[i].chk = true;
                    $scope.selectedLocRegions.push($scope.arr_loc_regions[i]);

                }

            }

        }
        /*if($scope.selectedGroups.length == $scope.customer_groups.length){
         $timeout(function(){
         $scope.$root.$apply(function(){
         angular.element('.checkAll').prop('checked',true);
         });
         },500);
         }
         else{
         $timeout(function(){
         $scope.$root.$apply(function(){
         angular.element('.checkAll').prop('checked',false);
         });
         },500);
         }*/
        /*angular.element('#custInfoModal').modal('hide');*/
    }

//------------------------------------------------------------


///////////////////// Add Comments ///////////////////////

    $scope.row_id = $scope.$root.crm_id;
    $scope.module_ids = $scope.rec.id;

    $scope.coment_data = {};
    $scope.coment_data.checkTitle = false;

    $scope.addcomment = function (coment_data) {

        $scope.coment_data.row_id = $scope.row_id;
        $scope.coment_data.module_id = $scope.rec.id;
        $scope.coment_data.type = 1;
        $scope.coment_data.sub_type = 6;
        $scope.coment_data.token = $scope.$root.token;
        $scope.coment_data.coment_id = $scope.coment_data.coment_id;
        //  console.log(coment_data);return;
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
                'module_id': $scope.rec.id,
                'sub_type': 6,
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
                 .post(delUrl, {id: id, 'token': $scope.$root.token})
                 .then(function (res) {
                     if (res.data.ack == true) {
                         toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                         arr_data.splice(index, 1);
                     }
                     else
                         toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));

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

    /*	$scope.getSalePersons_dept = function(arg){
     var empUrl = $scope.$root.hr+"employee/listings";
     if(arg == 'saleperson')
     $scope.title = 'Salespersons';
     if(arg == 'internal')
     $scope.title = 'Alt. Salesperson';
     if(arg == 'support_person')
     $scope.title = 'Support Salesperson';
     
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
     if(arg == 'saleperson'){
     $scope.sales_person = result.first_name+' '+result.last_name;
     $scope.rec.salesperson_id = result.id;
     }
     if(arg == 'internal'){
     $scope.internal_sales = result.first_name+' '+result.last_name;
     $scope.rec.internal_sales = result.id;
     }
     if(arg == 'support_person'){
     $scope.support_person = result.first_name+' '+result.last_name;
     $scope.rec.support_person = result.id;
     }
     }, function (reason) {
     console.log('Modal promise rejected. Reason: ', reason);
     });
     }*/
    $scope.bucket_id = 0;
    $scope.get_crm_data = function (id) {
//
//        var getCrmUrl = $scope.$root.sales + "customer/customer/get-customer";
//        $http
//             .post(getCrmUrl, {id: id, 'token': $scope.$root.token})
//             .then(function (res) {
//                 // console.log(res.data.response);
//                 //$scope.bucket_id = res.data.response.bucket_id;
//
//             });
    }
    $scope.get_crm_data($scope.$root.crm_id);


    $scope.columns = [];
    $scope.selectedLocRegions = [];
    $scope.salepersons = [];
    $scope.selectedSalespersons_loc = [];
    $scope.getSalePersons_dept = function (isShow) {
        $scope.get_crm_data($scope.$root.crm_id);

        $scope.columns = [];
        $scope.salepersons = [];

        $scope.title = 'Salesperson';
        //var postUrl = $scope.$root.hr + "employee/listings";
        //  var postUrl = $scope.$root.hr + "employee/get-Sale-Person-by-Bucket";
        var postUrl = $scope.$root.sales + "customer/sale-group/get-sale-group-list-by-group-id";
        var postData = {'g_id': $scope.bucket_id, 'type': 3, 'token': $scope.$root.token};
        $http
             .post(postUrl, postData)
             .then(function (res) {
                 if (res.data.ack == true) {
                     $.each(res.data.response, function (indx, obj) {
                         obj.chk = false;
                         obj.isPrimary = false;
                         if ($scope.selectedSalespersons_loc.length > 0) {
                             $.each($scope.selectedSalespersons_loc, function (indx, obj2) {
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
            angular.element('#salesPersonModal_location').modal({show: true});
    }
    $scope.isPrimary = '';

    angular.element(document).on('click', '.checkAllSalesperson', function () {
        $scope.selectedSalespersons_loc = [];
        if (angular.element('.checkAllSalesperson').is(':checked') == true) {
            $scope.isSalePerersonChanged = true;
            var isPrimary = false;
            for (var i = 0; i < $scope.salepersons.length; i++) {
                if ($scope.salepersons[i].isPrimary)
                    isPrimary = true;

                $scope.salepersons[i].chk = true;
                $scope.selectedSalespersons_loc.push($scope.salepersons[i]);
            }
            if (!isPrimary) {
                $scope.salepersons[0].isPrimary = true;
                $scope.selectedSalespersons_loc[0].isPrimary = true;
            }

        } else {
            for (var i = 0; i < $scope.salepersons.length; i++) {
                $scope.salepersons[i].chk = false;
                $scope.salepersons[i].isPrimary = false;
            }
            $scope.selectedSalespersons_loc = [];
        }

        //$timeout(function(){
        $scope.$apply(function () {
            $scope.selectedSalespersons_loc;
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
                    $.each($scope.selectedSalespersons_loc, function (indx, obj) {
                        if (obj != undefined) {
                            if (obj.id == sp.id)
                                $scope.selectedSalespersons_loc.splice(indx, 1);
                        }
                    });
                } else {

                    // console.log('i==>>'+i);
                    if (isPrimary == 1 || $scope.selectedSalespersons_loc.length == 0) {
                        var isExist = false;
                        $scope.salepersons[i].isPrimary = true;
                        $.each($scope.selectedSalespersons_loc, function (indx, obj) {
                            if (obj != undefined) {
                                $scope.selectedSalespersons_loc[indx].isPrimary = false;
                                if (obj.id == sp.id) {
                                    isExist = true;
                                    $scope.selectedSalespersons_loc[indx].isPrimary = true;
                                }

                            }
                        });
                        if (!isExist) {
                            $scope.salepersons[i].chk = true;
                            $scope.selectedSalespersons_loc.push($scope.salepersons[i]);
                        }

                    } else {
                        $scope.salepersons[i].chk = true;
                        $scope.selectedSalespersons_loc.push($scope.salepersons[i]);
                    }
                }

            }

        }
    }

    $scope.getSalePersons_edit = function (id) {

        var salepersonUrl = $scope.$root.sales + "crm/crm/get-crm-salesperson";
        $http
             .post(salepersonUrl, {id: id, 'token': $scope.$root.token, 'type': 3})
             .then(function (emp_data) {

                 if (emp_data.data.ack == true) {


                     $timeout(function () {
                         $scope.$root.$apply(function () {

                             $.each($scope.salepersons, function (indx, obj) {
                                 obj.chk = false;
                                 obj.isPrimary = false;
                                 $.each(emp_data.data.response, function (indx, obj2) {
                                     if (obj.id == obj2.salesperson_id) {
                                         obj.chk = true;
                                         if (obj2.is_primary == 1)
                                             obj.isPrimary = true;

                                         $scope.selectedSalespersons_loc.push(obj);
                                     }
                                 });
                                 $scope.salepersons.push(obj);
                             });
                         });
                     }, 1000);


                 }
                 //else  toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));

             });
    }

    $scope.add_salespersons = function (id) {
        var check = false;
        var excUrl = $scope.$root.sales + "crm/crm/add-crm-salesperson";
        var post = {};
        var temp = [];
        $.each($scope.selectedSalespersons_loc, function (index, obj) {
            temp.push({id: obj.id, isPrimary: obj.isPrimary});
        })
        post.type = 3;
        post.bucket_id = bucket_id;
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
        $.each($scope.selectedSalespersons_loc, function (index, obj) {
            temp.push({id: obj.id, isPrimary: obj.isPrimary});
        })
        post.type = 3;
        post.id = id;
        post.salespersons = temp;
        post.token = $scope.$root.token;
        $http
             .post(excUrl, post)
             .then(function (res) {
                 //$scope.add_salespersons_log(id);
             });
    }

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


    $scope.history_salespersons = {};
    $scope.columns_history = [];
    $scope.history_title = "";
    $scope.history_type = "";
    $scope.historytype_dept = function (type) {
        $scope.history_type = type;
        var Url = $scope.$root.sales + "crm/crm/crm-history";
        if (type == "Salespersons") {
            $scope.history_title = "Salesperson History";
        } else if (type == "CreditLimit") {
            $scope.history_title = "Credit Limit History";
        } else if (type == "Status") {
            $scope.history_title = "Status History";
        }

        var postData = {
            'token': $scope.$root.token,
            'crm_id': $scope.rec.id, //$scope.$root.crm_id,
            'type': type
        };
        $http
             .post(Url, postData)
             .then(function (res) {

                 if (res.data.ack == true) {

                     $scope.crm_history = {};
                     $scope.columns_history = [];
                     $scope.crm_history = res.data.response;
                     console.log($scope.crm_history);

                     angular.forEach(res.data.response[0], function (val, index) {
                         $scope.columns_history.push({
                             'title': toTitleCase(index),
                             'field': index,
                             'visible': true
                         });
                     });

                     $('#history_modal').modal({show: true});
                 }
                 else
                     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

             });
    };

    if ($stateParams.id > 0) {
        $scope.check_alt_depot_readonly = true;
        // $scope.perreadonly = false;
    }
    //else $scope.perreadonly = true;

    $scope.showEditForm = function () {
        $scope.check_alt_depot_readonly = false;
        //$scope.perreadonly = true;
    }

}