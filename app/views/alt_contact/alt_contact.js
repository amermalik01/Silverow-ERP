AltContactController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];

myApp.controller('AltContactController', AltContactController);
myApp.controller('AltContactAddController', AltContactAddController);


function AltContactController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams) {
    'use strict';

    $scope.$root.conv

    $scope.module_id = 68;
    $scope.filter_id = 105;
    $scope.module_table = 'crm_alt_contact';
    $scope.more_fields = 'null';
    $scope.condition = 0;

    if ($scope.$root.crm_id > 0)
        $scope.postData = {'column': 'crm_alt_contact.crm_id', 'value': $scope.$root.crm_id, token: $scope.$root.token}

    $scope.MainDefer = null;
    $scope.mainParams = null;
    $scope.mainFilter = null;
    $scope.more_fields = 'crm_id';


    $scope.count = 1;
    $scope.sendRequest = false;
    var vm = this;

    var ApiAjax = $scope.$root.sales + "crm/crm/alt-contacts";

    $scope.$on("myAltContEventReload", function (event, args) {
        $scope.sendRequest = true;
        if (args != undefined) {
            if (args[1] != undefined)
                $scope.detail(args[1]);
            $scope.postData = {'column': 'crm_alt_contact.crm_id', 'value': args[0], token: $scope.$root.token}
            $scope.$root.crm_id = args[0];
        }
        $scope.count = $scope.count + 1;

        // ngDataService.getDataCustomAjax($scope.MainDefer, $scope.mainParams, ApiAjax, $scope.mainFilter, $scope, 'doreload' + $scope.count, $scope.postData);

        //  $scope.table.tableParams5.reload();

        $scope.get_contact();

    });


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
            /*  if ($scope.$root.crm_id > 0 && $scope.sendRequest == true)
             ngDataService.getDataCustomAjax($defer, params, ApiAjax, $filter, $scope, 'alt_contact', $scope.postData);
             $scope.MainDefer = $defer;
             $scope.mainParams = params;
             $scope.mainFilter = $filter;*/
            $scope.get_contact();
        }
    });


    $scope.get_contact = function () {

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
        var delUrl = $scope.$root.sales + "crm/crm/delete-alt-contact";
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
                     } else {
                         toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                     }
                 });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    $scope.detail = function (id) {
        $timeout(function () {
            if ($scope.$root.lblButton == 'Add New') {
                $scope.$root.lblButton = 'Edit';
            }
        }, 100);

        $scope.$root.tabHide = 0;
        $scope.$root.$broadcast("openAltContactFormEvent", {'edit': false, id: id});
    }

    $scope.editForm = function (id) {
        $scope.$root.$broadcast("openAltContactFormEvent", {'edit': true, id: id});
    }

}

function AltContactAddController($scope, $stateParams, $http, $state, $resource, toaster, $timeout, ngDialog, $rootScope) {
    $scope.rec = {};


    $scope.alt_id = '';
    $scope.arr_locations = [];
    $scope.arr_pref_method_comm = [];
    //$scope.AddTab.open = true;
    //toggleOpen();
    $scope.arr_types = [{'id': '1', 'name': "Primary"}, {'id': '2', 'name': "Other"}];
    $scope.$root.tabHide = 0;
    $scope.$root.lblButton = 'Add New';
    $scope.showAltContListing = function () {
        $scope.$root.$broadcast("showAltContListing");
    }

    $scope.showAltContEditForm = function (id) {
        $scope.check_readonly = false;
    }

    $scope.$on("showAddAltContForm", function () {
        $scope.check_readonly = false;
        $scope.resetForm();

    });


    //if($state.current.name == 'app.view-crm')
    $scope.check_readonly = true;

    if ($stateParams.id !== undefined)
    { $rootScope.get_country_list();

        $timeout(function () {
        $.each($rootScope.country_type_arr, function (index, elem) {
            if (elem.id == $scope.$root.defaultCountry)
                $scope.rec.alt_country_id = elem;
        });
        }, 1000);
        
    }

    var prefMethodUrl = $scope.$root.sales + "crm/crm/pref-method-of-comm";
    $http
         .post(prefMethodUrl, {'token': $scope.$root.token})
         .then(function (res) {
             if (res.data.ack == true)
                 $scope.arr_pref_method_comm = res.data.response;
             $scope.arr_pref_method_comm.push({'id': '-1', 'title': '++ Add New ++'});
         });

    $scope.$on("openAltContactFormEvent", function (event, arg) {

        $timeout(function () {
            var id = arg.id;
            $scope.alt_id = arg.id;

            if (arg.edit == false)
                $scope.check_readonly = true;
            else
                $scope.check_readonly = false;
            /*angular.element('.alt_contact a').trigger('click');*/
            $scope.$root.$broadcast("showAltContForm");
            /*$scope.altContacFormShow = false;
             $scope.altContacListingShow = true;*/
            var altcontUrl = $scope.$root.sales + "crm/crm/get-alt-contact-by-id";
            angular.element('.accordion-toggle').trigger('click');
            $scope.rec = {};
            $http
                 .post(altcontUrl, {id: id, 'token': $scope.$root.token})
                 .then(function (res) {


                     $scope.rec = res.data.response;
                     $scope.rec.id = res.data.response.id;

                     $.each($rootScope.country_type_arr, function (index, elem) {
                         if (elem.id == $scope.rec.country)
                             $scope.rec.alt_country_id = elem;
                     });


                     $.each($scope.arr_pref_method_comm, function (index, elem) {
                         if (elem.id == res.data.response.pref_method_of_communication) {
                             console.log('here in ==>>');
                             $scope.drp.pref_mthod_of_comm = elem;
                         }
                     });

                     /*$.each($scope.arr_locations, function (index, elem) {
                      if (elem.id == res.data.response.location_id)
                      $scope.rec.location = elem;
                      });*/
                     $.each($scope.arr_types, function (index, elem) {
                         if (elem.id == res.data.response.type)
                             $scope.rec.types = elem;
                     });

                     /*$timeout(function(){
                      $.each($scope.arr_pref_method_comm, function (index, elem) {
                      if (elem.id == res.data.response.pref_method_of_communication) {
                      $scope.$root.$apply(function(){
                      $scope.drp.pref_mthod_of_comm = elem;
                      });
                      }
                      });
                      },3000);*/

                     $scope.get_alt_contact_social_media_list();


                     /*$scope.row_id=arg.id;//$scope.alt_id;	//$scope.alt_id; 	//$stateParams.id;
                      $scope.module_id = 19;//68;
                      $scope.subtype = 6;
                      $scope.sub_module= 0;
                      $scope.module="Sales & CRM";
                      $scope.module_name="Contact";
                      //$scope.module_code= $scope.$root.model_code ;
                      //console.log( $scope.module_id+'call'+$scope.module+'call'+$scope.module_name+'call'+$scope.module_code);
                      $scope.$root.$broadcast("image_module",$scope.row_id,$scope.module,$scope.module_id,$scope.module_name,$scope.module_code,$scope.subtype,$scope.sub_module);*/

                     $scope.getComments();


                 });
        }, 500);

    });


    $scope.resetForm = function (rec) {
        $scope.rec = {};
        $.each($rootScope.country_type_arr, function (index, elem) {
            if (elem.id == $scope.$root.defaultCountry)
                $scope.rec.alt_country_id = elem;
        });
    }

    $scope.add_contact = function (rec, drp) {
        var altAddUrl = $scope.$root.sales + "crm/crm/add-alt-contact";
        rec.country = rec.alt_country_id != undefined ? rec.alt_country_id.id : 0;
        //rec.location_id = rec.location != undefined ? rec.location.id : 0;
        rec.type = rec.types != undefined ? rec.types.id : 0;
        rec.pref_method_of_communication = drp.pref_mthod_of_comm != undefined ? drp.pref_mthod_of_comm.id : 0;

        rec.crm_id = $scope.$root.crm_id;
        rec.token = $scope.$root.token;
        if (rec.id != undefined)
            altAddUrl = $scope.$root.sales + "crm/crm/update-alt-contact";

        $http
             .post(altAddUrl, rec)
             .then(function (res) {
                 $scope.$root.count = $scope.$root.count + 1;
                 if (res.data.ack == 2) {
                     toaster.pop('error', 'Error', 'Record already exist against Email ID.');
                     return;
                 }
                 if (res.data.ack == true || res.data.edit == true) {

                     $scope.$root.lblButton = 'Add New';
                     if (rec.id > 0) {
                         toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                     }
                     else {
                         toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                         $scope.$root.$broadcast("showAltContListing");
                         if (rec.depot != '')
                             $scope.addLocation(rec);

                         $scope.resetForm(rec);
                     }
                     var args = [];
                     args[0] = $scope.$root.crm_id;
                     args[1] = undefined;
                     $scope.$root.$broadcast("myAltContEventReload", args);

                     $timeout(function () {
                         $scope.showAltContListing();
                     }, 1000);


                 }
                 else if (res.data.ack == 2)
                     toaster.pop('error', 'info', 'Record  Already Exists.');

                 else {
                     if (rec.id > 0)
                         toaster.pop('error', 'info', 'Record saved with no changes!');
                     else
                         toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
                 }
             });
    }


    $scope.addLocation = function (rec) {
        var altAddUrl = $scope.$root.sales + "crm/crm/add-alt-depot";
        //   rec.address_type = rec.address_types != undefined ? rec.address_types.id : 0;
        rec.address = rec.address_1;
        rec.role = rec.job_title;
        rec.telephone = rec.phone;


        $http
             .post(altAddUrl, rec)
             .then(function (res) {

             })
    }


    $scope.alt_contact_social_medias = [];
    $scope.columns_alt_contact_social = [];
    $scope.altContactMediaForm = {};
    $scope.socialForm = {};
    $scope.isSocialFormValid = false;
    $scope.alt_contact_media_form = false;

    $scope.showAltContactMediaForm = function () {
        $scope.alt_contact_media_form = true;
        $scope.altContactMediaForm = {};
        $scope.get_social_media_list();
    };
    $scope.hideAltContactMediaForm = function () {
        $scope.alt_contact_media_form = false;
        $scope.altContactMediaForm = {};
    };

    $scope.delete_alt_contact_social_media = function (id) {

        var postUrl = $scope.$root.sales + "crm/crm/delete-alt-contact-social-media";
        $http
             .post(postUrl, {'id': id, 'token': $scope.$root.token})
             .then(function (ress) {
                 if (ress.data.ack == true) {
                     toaster.pop('success', "Add", $scope.$root.getErrorMessageByCode(103));
                     $scope.get_alt_contact_social_media_list();
                 } else
                     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(108));

             });
    };

    $scope.get_alt_contact_social_media_list = function () {

        var urlCRMSocialMedias = $scope.$root.sales + "crm/crm/alt-contact-social-medias";
        $scope.alt_contact_social_medias = [];
        $scope.columns_alt_contact_social = [];
        $http
             .post(urlCRMSocialMedias, {
                 'token': $scope.$root.token,
                 'crm_id': $scope.$root.crm_id,
                 'alt_contact_id': $scope.rec.id
             })
             .then(function (res) {
                 if (res.data.response == undefined)
                     return;
                 $scope.alt_contact_social_medias = res.data.response;

                 angular.forEach(res.data.response[0], function (val, index) {
                     $scope.columns_alt_contact_social.push({
                         'title': toTitleCase(index),
                         'field': index,
                         'visible': true
                     });
                 });
             });

    };


    $scope.get_social_media_list = function () {


        var urlCRMSocialMedias = $scope.$root.sales + "crm/crm/social-medias";
        $scope.social_medias = [];
        $http
             .post(urlCRMSocialMedias, {'token': $scope.$root.token})
             .then(function (res) {

                 if (res.data.ack == true) {

                     $scope.social_medias = res.data.response;

                     if ($scope.user_type == 1)
                         $scope.social_medias.push({'id': '-1', 'name': '++ Add New ++'});
                 }
                 //  else 	toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));


             });

    };

    $scope.add_alt_contact_social_media = function () {
        $scope.altContactMediaForm.token = $scope.$root.token;
        $scope.altContactMediaForm.crm_id = $scope.$root.crm_id;
        $scope.altContactMediaForm.alt_contact_id = $scope.rec.id;
        $scope.altContactMediaForm.media_id = ($scope.altContactMediaForm.media != undefined) ? $scope.altContactMediaForm.media.id : '';

        if ($scope.altContactMediaForm.media_id == "" || $scope.altContactMediaForm.address == undefined || $scope.altContactMediaForm.address == "") {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(104));
        } else {
            var postUrl = $scope.$root.sales + "crm/crm/add-alt-contact-social-media";
            $http
                 .post(postUrl, $scope.altContactMediaForm)
                 .then(function (ress) {
                     if (ress.data.ack == true) {
                         toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                         $scope.get_alt_contact_social_media_list();
                         $scope.alt_contact_media_form = false;
                     } else {
                         toaster.pop('error', 'Info', ress.data.error);
                     }
                 });
        }
    };

    $scope.delete = function (id) {
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                 .post('api/company/delete', {id: id, table: 'crm_alt_contact'})
                 .then(function (res) {
                     $scope.$root.count = $scope.$root.count + 1;

                     if (res.data == true) {
                         /*<!--$scope.$root.tabHide = 1;-->*/
                         $timeout(function () {
                             $scope.rec = {};
                             angular.element('.accordion-toggle').trigger('click');
                         }, 100);
                         toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                         var args = [];
                         args[0] = $scope.$root.crm_id;
                         args[1] = undefined;
                         $scope.$root.$broadcast("myAltContEventReload", args);
                     } else {
                         toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                     }
                 });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

        //if(popupService.showPopup('Would you like to delete?')) {

        //  }*/
    };


    $scope.add_social_popup = function (media, arg) {
        $scope.isSocialValid = false;
        $scope.isSocialFormValid = false;

        var id = media.id;
        if (id > 0)
            return false;

        $scope.socialForm = {};
        ngDialog.openConfirm({
            template: 'app/views/crm/social_media.html',
            className: 'ngdialog-theme-default-custom-large',
            scope: $scope
        }).then(function (socialForm) {

            socialForm.token = $scope.$root.token;
            var postUrl = $scope.$root.sales + "crm/crm/add-social-media";
            $scope.isSocialValid = true;

            if ($scope.socialForm.name == undefined) {
                toaster.pop('error', 'info', 'Empty not Allow');
                return false;
            }


            $http
                 .post(postUrl, socialForm)
                 .then(function (ress) {
                     if (ress.data.ack == true) {
                         toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                         $scope.get_social_media_list();

                         $timeout(function () {
                             angular.forEach($scope.social_medias, function (obj, index) {
                                 if (obj.id == ress.data.id) {
                                     if (arg == 1)
                                         $scope.crmMediaForm.media = $scope.social_medias[index];
                                     else if (arg == 2)
                                         $scope.altContactMediaForm.media = $scope.social_medias[index];

                                 }
                             });
                         }, 1000);

                     } else
                         toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(107));

                 });

        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    $scope.addNewPredefinedPopup = function (drpdown, type, title, drp) {
        $scope.isBtnPredefined = true;
        if (type == 'SEGMENT')
            var id = drpdown.id;
        else
            var id = drpdown.id;

        if (id > 0)
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

                                      if (type == 'CUST_STATUS') {
                                          $scope.arr_cust_status = res.data.response;
                                          if ($scope.user_type == 1)
                                              $scope.arr_cust_status.push({'id': '-1', 'name': '++ Add New ++'});
                                          $timeout(function () {
                                              $.each($scope.arr_status, function (index, elem) {
                                                  if (elem.value == ress.data.id)
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
                                          if ($scope.user_type == 1)
                                              $scope.arr_crm_status.push({'id': '-1', 'title': '++ Add New ++'});
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

        //$scope.$root.breadcrumbs =
        //  [//{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
        //  {'name':  $scope.module, 'url': '#', 'isActive': false},
        //  {'name': $scope.module_name, 'url': redirect, 'isActive': false},
        //  {'name': $scope.module_code, 'url': '#', 'isActive': false},
        //  {'name': 'Comments', 'url': '#', 'isActive': false}];

        $scope.show_coments_list = true;
        $scope.show_coments_form = false;
        $scope.perreadonly = true;

        $scope.coment_data.create_date = $scope.$root.get_current_date();


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

    }

    $scope.showEditFormComent = function (id) {
        $scope.coment_data.checkTitle = true;

        $scope.show_coments_list = false;
        $scope.show_coments_form = true;
        $scope.showdoc = true;
        $scope.showdocumentlist = true;


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


    $scope.isCheced = false;
    $scope.sameAsGeneral = function () {
        if ($scope.isCheced == false) {
            $scope.$root.$broadcast('getGeneralData');
            $scope.$on('setGeneralData', function (event, data) {

                $scope.rec.depot = 'Main office';

                $scope.$root.$apply(function () {
                    $scope.rec.address_1 = data.address_1;
                    $scope.rec.address_2 = data.address_2;
                    $scope.rec.city = data.city;
                    $scope.rec.county = data.county;
                    $scope.rec.postcode = data.postcode;
                    $.each($rootScope.country_type_arr, function (index, elem) {
                        if (elem.id == $scope.rec.country_id)
                            $scope.rec.alt_country_id = elem;
                    });
                    $scope.isCheced = true;
                });
            });
        }
        else {
            $scope.rec.address_1 = null;
            $scope.rec.address_2 = null;
            $scope.rec.city = null;
            $scope.rec.county = null;
            $scope.rec.postcode = null;
            $.each($rootScope.country_type_arr, function (index, elem) {
                if (elem.id == $scope.$root.defaultCountry)
                    $scope.rec.alt_country_id = elem;
            });
            $scope.isCheced = false;
        }
    }

    $scope.wordsLength = 0;
    $scope.showWordsLimits = function () {
        $scope.wordsLength = $scope.coment_data.description.length;
    }
    if ($stateParams.id > 0) {
        $scope.check_contact_readonly = true;
        // $scope.perreadonly = false;
    }
    //else $scope.perreadonly = true;

    $scope.showEditForm = function () {
        $scope.check_contact_readonly = false;
        //$scope.perreadonly = true;
    }
}



