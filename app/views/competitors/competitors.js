CompetitorsController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];

myApp.controller('CompetitorsController', CompetitorsController);
myApp.controller('CompetitorsAddController', CompetitorsAddController);


function CompetitorsController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams) {
    'use strict';

    $scope.module_id = 71;
    $scope.filter_id = 76;
    $scope.module_table = 'crm_competitor';
    $scope.more_fields = 'category_type*crm_id';
    $scope.condition = 0;
    $scope.sendRequest = false;

    if ($scope.$root.crm_id > 0)
        $scope.postData = {
            'column': 'crm_id',
            'value': $scope.$root.crm_id,
            token: $scope.$root.token,
            'more_fields': $scope.more_fields
        }


    $scope.MainDefer = null;
    $scope.mainParams = null;
    $scope.mainFilter = null;


    $scope.count = 1;
    var vm = this;

    //var Api = $resource('api/company/get_listing/:module_id/:module_table');
    var ApiAjax = $scope.$root.sales + "crm/crm/crm-competitors";

    $scope.$on("myCompetitorsEventReload", function (event, args) {
        $scope.sendRequest = true;
        // console.log(args + 'evenrt');

        if (args != undefined) {
            if (args[1] != undefined)
                $scope.detail(args[1]);
            $scope.postData = {
                'column': 'crm_id',
                'value': args[0],
                token: $scope.$root.token,
                'more_fields': $scope.more_fields
            }
            $scope.$root.crm_id = args[0];
        }

        $scope.count = $scope.count + 1;
        // ngDataService.getDataCustomAjax($scope.MainDefer, $scope.mainParams, ApiAjax, $scope.mainFilter, $scope, 'doreload' + $scope.count, $scope.postData);

        /* ngDataService.getDataCustom($scope.MainDefer, $scope.mainParams, ApiAjax, $scope.mainFilter, $scope, $scope.postData);
         
         $scope.table.tableParams5.reload();*/
        $scope.get_compeitor();
    });

    $scope.detail = function (id) {
        $timeout(function () {
            if ($scope.$root.lblButton == 'Add New') {
                $scope.$root.lblButton = 'Edit';
            }
        }, 100);

        $scope.$root.tabHide = 0;
        $scope.$root.$broadcast("openCompetitorsFormEvent", {'edit': false, id: id});
    }

    $scope.editForm = function (id) {
        $scope.$root.$broadcast("openCompetitorsFormEvent", {'edit': true, id: id});
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

            /*   $scope.MainDefer = $defer;
             $scope.mainParams = params;
             $scope.mainFilter = $filter;
             ngDataService.getDataCustom($defer, params, ApiAjax, $scope.mainFilter, $scope, $scope.postData);
             */
            $scope.get_compeitor();
        }
    });


    $scope.get_compeitor = function () {

        $http
             .post(ApiAjax, $scope.postData)
             .then(function (res) {
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

                     $scope.record_data = res.data.response;//res.data.record.result ;

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
        var delUrl = $scope.$root.sales + "crm/crm/delete-crm-competitor";
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


}

function CompetitorsAddController($scope, $stateParams, $http, $state, $resource, toaster, $timeout, ngDialog, Upload, $rootScope, $filter) {

    $scope.$root.tabHide = 0;
    $scope.$root.lblButton = 'Add New';
    $scope.check_readonly = 0;
    $scope.rec = {};
    $scope.check_files = 0;
    $scope.files = [];
    $scope.wordsLength = 0;
    $scope.showItemCat = true;
    $scope.showServiceCat = true;
    // $scope.datePicker = Calendar.get_caledar();
    $scope.arr_category = [];
    //  $scope.price_unit = ($scope.rec.unit_id != undefined) ? $scope.$root.defaultCurrencyCode+"/"+$scope.rec.unit_id.title : $scope.$root.defaultCurrencyCode+"/null";

    //$rootScope.get_category_list();

    var catUrl = $rootScope.stock + "categories";

    $scope.showCrmCompListing = function () {
        $scope.$root.$broadcast("showCrmCompListing");
    }

    ///////////////// Start UOM By Mudassir //////////////////

    var unitUrl = $rootScope.stock + "unit-measure/units";
    $http
         .post(unitUrl, {'token': $scope.$root.token})
         .then(function (res) {
             $scope.unit_measures = [];
             $scope.unit_measures.push({'id': '', 'title': ''});

             if (res.data.ack == true)
                 $scope.unit_measures = res.data.response;

             // else 	toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

             if ($scope.user_type == 1)
                 $scope.unit_measures.push({'id': '-1', 'title': '++ Add New ++'});

         });


    var getUrllead = $scope.$root.sales + "crm/crm/get-all-competitor-volume";
    $http
         .post(getUrllead, {'token': $scope.$root.token})
         .then(function (res) {


             $scope.lead_types = [];
             $scope.lead_types.push({'id': '', 'title': ''});

             if (res.data.ack == true)
                 $scope.lead_types = res.data.response;

             // else 	toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));

             if ($scope.user_type == 1)
                 $scope.lead_types.push({'id': '-1', 'title': '++ Add New ++'});

         });

    //$scope.lead_types = [{'label': 'Hours', 'title': 1}, {'label': 'Days', 'title': 2}, {'label': 'Weeks', 'title': 3}, {'label': 'Months', 'title': 4}];




    $scope.showCrmCompEditForm = function () {
        $scope.check_readonly = false;
    }

    $scope.$on("showAddCrmCompForm", function () {
        $scope.check_readonly = false;
        $scope.showItemCat = true;
        $scope.showServiceCat = true;

        $scope.resetForm();
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

        if ($rootScope.defaultDateFormat == $rootScope.dtYMD)
            $scope.created_date = year + "/" + month + "/" + day;
        if ($rootScope.defaultDateFormat == $rootScope.dtMDY)
            $scope.created_date = month + "/" + day + "/" + year;
        if ($rootScope.defaultDateFormat == $rootScope.dtDMY)
            $scope.created_date = day + "/" + month + "/" + year;

        /*$http
         .post(catUrl, {token:$scope.$root.token})
         .then(function (res) {
         $scope.arr_category = res.data.response;
         $scope.arr_category.push({'id':'-1','name':'++ Add New ++'});
         });*/

        $scope.rec.created_date = $filter('date')($scope.created_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);

    });


    //if($state.current.name == 'app.view-crm')
    //$scope.check_readonly = true;


    $scope.$on("openCompetitorsFormEvent", function (event, arg) {
        $timeout(function () {
            //	conosle.log(arg+'ss')
            var id = arg.id;
            if (arg.edit == false)
                $scope.check_readonly = true;
            else {
                $scope.check_readonly = false;
                $scope.wordsLength = 0;
            }
            $scope.wordsLength = 0;
            angular.element('.accordion-toggle').trigger('click');
            $scope.$root.$broadcast("showCrmCompForm");
            $scope.crmCompFormShow = false;
            $scope.crmCompListingShow = true;
            var competitorUrl = $scope.$root.sales + "crm/crm/get-crm-competitor";
            var fileUrl = $scope.$root.sales + "crm/crm/get-crm-competitor-files";
            $scope.rec = {};

            //$scope.comp_files = [];
            //$scope.files = [];
            $http
                 .post(competitorUrl, {id: id, 'token': $scope.$root.token})
                 .then(function (res) {

                     $scope.rec = res.data.response;
                     $scope.rec.id = res.data.response.id;
                     /////Mudassir////
                     $.each($scope.unit_measures, function (index, obj) {
                         if (res.data.response.unit_id) {
                             if (obj.id == res.data.response.unit_id) {
                                 $scope.rec.unit_id = $scope.unit_measures[index];
                                 $scope.drp.unit_id = $scope.unit_measures[index];
                             }
                         }
                     });
                     $.each($scope.unit_measures, function (index, obj) {
                         if (res.data.response.vol_unit) {
                             if (obj.id == res.data.response.vol_unit) {
                                 $scope.rec.vol_unit_id = $scope.unit_measures[index];
                             }
                         }
                     });
                     $.each($scope.lead_types, function (index, obj) {
                         if (res.data.response.lead_type) {
                             if (obj.id == res.data.response.lead_type) {
                                 $scope.rec.lead_type = $scope.lead_types[index];
                                 $scope.drp.lead_type = $scope.lead_types[index];
                             }
                         }
                     });
                     //console.log(res.data.response.lead_type);
                     ////Mudassir////
                     $scope.wordsLength = res.data.response.note.length;
                     if (res.data.response.category_type == 1) {
                         $scope.showItemCat = true;
                         $scope.showServiceCat = false;

                         var prodCat = $rootScope.stock + "categories";
                         $http
                              .post(prodCat, {id: res.data.response.category_id, token: $scope.$root.token})
                              .then(function (ress) {
                                  if (res.data.ack == true) {
                                      //$timeout(function(){
                                      //$scope.$root.$apply(function(){
                                      $scope.rec.category_name = ress.data.response.name;
                                      //});
                                      //},3000);
                                  }
                              });
                     }
                     if (res.data.response.category_type == 2) {
                         $scope.showItemCat = false;
                         $scope.showServiceCat = true;
                         var servCat = $scope.$root.setup + 'service/categories/get-category'
                         $http
                              .post(servCat, {id: res.data.response.category_id, token: $scope.$root.token})
                              .then(function (res) {
                                  if (res.data.ack == true)
                                      $scope.rec.category_name = res.data.response.name;
                              });
                     }
                     /*$.each($scope.arr_category,function(index,elem){if(elem.id == res.data.response.category_id){
                      $scope.rec.category_ids = elem;}});*/

                     $http
                          .post(fileUrl, {'module_id': 71, 'row_id': res.data.response.id, token: $scope.$root.token})
                          .then(function (res) {
                              if (res.data.ack == true) {
                                  //$scope.comp_files = res.data.response;
                                  $scope.files = res.data.response;
                                  $scope.check_files = 2;
                                  //$scope.check_file = 0;
                              }
                          });
                 });

        }, 100);

    });


    $scope.resetForm = function (rec) {
        $scope.files = [];
        $scope.str_files = [];
        $scope.temp_files = [];
        $scope.comp_files = {};
        $scope.check_file = 0;
        $scope.check_files = 0;
        /*document.getElementById("uploadFile").value = '';*/
        $scope.rec = {};
        $scope.brands = '';
        angular.element("input[type='file']").val(null);
    }

    // force download file
    var content = 'file content';
    var blob = new Blob([content], {type: '*'});
    $scope.url = (window.URL || window.webkitURL).createObjectURL(blob);


    $scope.check_file = 0;
    $scope.new_files_title = [];

    $scope.onFileSelect = function ($files) {

        //$scope.files = $files;
        //console.log($scope.files);
        $scope.str_files = [];

        $timeout(function () {
            angular.forEach($files, function (file, key) {
                $scope.files.push(file);
                $scope.check_files = 1;
                //$scope.str_files.push({name:file.name,index:key});
                /*$scope.comp_files.push({file:file.name,index:key});
                 $scope.temp_files.push(file.name);*/

            });
            //document.getElementById("uploadFile").value = $scope.temp_files; 		
        }, 100)
    };

    $scope.removeFile = function (index) {
        $scope.files.splice(index, 1);
        //$scope.str_files.splice(index,1);
        /*$scope.comp_files.splice(index,1);
         $scope.temp_files.splice(index,1);
         document.getElementById("uploadFile").value = $scope.temp_files; */
        if ($scope.files.length < 1)
            $scope.check_file = 0;
    }


    $scope.add_comp = function (rec) {

        console.log(rec);
        var addCompetitor = $scope.$root.sales + "crm/crm/add-crm-competitor";
        //var fileCheckUrl = $scope.$root.sales+"crm/crm/get-crm-competitor-file";
        rec.crm_id = $scope.$root.crm_id;
        rec.token = $scope.$root.token;
        rec.vol_unit = rec.vol_unit_id != undefined ? rec.vol_unit_id.id : '';
        /* rec.unit_id = rec.unit_id != undefined ? rec.unit_id.id : '';
         rec.lead_type = rec.lead_type != undefined ? rec.lead_type.id : '';*/
        rec.unit_id = $scope.drp.unit_id != undefined ? $scope.drp.unit_id.id : '';
        rec.lead_type = $scope.drp.lead_type != undefined ? $scope.drp.lead_type.id : '';
        //console.log(rec);

        if (rec.id != undefined)
            addCompetitor = $scope.$root.sales + "crm/crm/update-crm-competitor";

        $scope.new_files_title = [];
        angular.forEach($scope.files, function (file, key) {
            if (file.row_id == undefined)
                $scope.new_files_title[key] = file.title;
        });
        rec.new_file_titles = $scope.new_files_title;

        $scope.upload = Upload.upload({
            url: addCompetitor,
            method: 'POST',
            headers: {'header-key': '83c238df1650bccb2d1aa4495723c63f07672ee8'},
            withCredentials: true,
            data: rec,
            file: $scope.files != undefined ? $scope.files : '',
        }).progress(function (evt) {
            // console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        }).success(function (res, status, headers, config) {

            if (res.ack == true || res.edit == true) {

                $scope.$root.lblButton = 'Add New';
                if (rec.id > 0) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $scope.$root.$broadcast("openCompetitorsFormEvent", {'edit': true, id: rec.id});
                } else {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $scope.$root.$broadcast("showCrmCompListing");
                    $scope.resetForm(rec);
                }
                var args = [];
                args[0] = $scope.$root.crm_id;
                args[1] = undefined;
                $scope.$root.$broadcast("myCompetitorsEventReload", args);


                $timeout(function () {
                    $scope.showCrmCompListing();
                }, 1000);
                /*$timeout(function() {
                 angular.element('.accordion-toggle').trigger('click');
                 }, 100);*/
            }
            else {
                if (rec.id > 0)
                    toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
                else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
            }
        });


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


    $scope.deleteFile = function (index, id) {
        var delUrl = $scope.$root.sales + "crm/crm/delete-crm-competitor-file";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                 .post(delUrl, {id: id, token: $scope.$root.token})
                 .then(function (res) {
                     $scope.$root.count = $scope.$root.count + 1;
                     if (res.data.ack == true) {
                         $scope.files.splice(index, 1);
                         if ($scope.files.length < 1) {
                             $scope.check_files = 0;
                         }
                         toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                     } else {
                         toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                     }
                 });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };

    $scope.viewFile = function (id) {
        window.open(
             'api/crm_competitor_doc_view.php?id=' + id,
             '_blank' // <- This is what makes it open in a new window.
             );
    }

    $scope.showWordsLimits = function () {
        $scope.wordsLength = $scope.rec.note.length;
    }


    $scope.addNewCategoryPopup = function (rec) {
        var id = rec.category_ids != undefined ? rec.category_ids.id : 0;
        if (id > 0)
            return false;

        $scope.cat = {};
        ngDialog.openConfirm({
            template: 'app/views/competitors/add_category.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (cat) {
            var postUrl = $scope.$root.stock + "categories/add-category";
            cat.token = $scope.$root.token;
            cat.status = $scope.cat.status.value !== undefined ? $scope.cat.status.value : 0;

            $http
                 .post(postUrl, cat)
                 .then(function (ress) {
                     if (ress.data.ack == true) {
                         toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                         var catUrl = $rootScope.stock + "categories";
                         $http
                              .post(catUrl, {token: $scope.$root.token})
                              .then(function (res) {

                                  if (res.data.ack == true) {
                                      //$scope.$root.$apply(function(){
                                      $scope.arr_category = res.data.response;
                                      $scope.arr_category.push({'id': '-1', 'name': '++ Add New ++'});
                                      $timeout(function () {
                                          $.each($scope.arr_category, function (index, elem) {
                                              if (elem.id == ress.data.id)
                                                  rec.category_ids = elem;
                                          });
                                      }, 3000);
                                      //});
                                  }

                              });
                     } else if (res.data.ack == false) {
                         toaster.pop('warning', 'Info', res.data.msg);
                     } else
                         toaster.pop('warning', 'Info', res.data.msg);

                 });

        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }
    $scope.addNewPopup = function (drpdown, type, title, drp) {
        $scope.isBtnPredefined = true;

        //  console.log(drpdown.id);
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
                              .post(getUrl, {'token': $scope.$root.token, type: type})
                              .then(function (res) {
                                  if (res.data.ack == true) {

                                      if (type == 'UNIT') {
                                          $scope.unit_measures = res.data.response;
                                          if ($scope.user_type == 1)
                                              $scope.unit_measures.push({'id': '-1', 'title': '++ Add New ++'});
                                          $.each($scope.unit_measures, function (index, elem) {
                                              if (elem.id == ress.data.id)
                                                  drp.unit_id = elem;
                                          });
                                      }


                                      if (type == 'LEAD') {
                                          $scope.lead_types = res.data.response;
                                          if ($scope.user_type == 1)
                                              $scope.lead_types.push({'id': '-1', 'title': '++ Add New ++'});
                                          // $timeout(function () {
                                          $.each($scope.lead_types, function (index, elem) {
                                              if (elem.id == ress.data.id)
                                                  drp.lead_type = elem;
                                          });
                                          //  }, 1000);
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

    $scope.isFileExist = function (path, file_name) {
        var result = false;
        $http
             .post($scope.$root.setup + 'general/is-file-exist', {
                 'token': $scope.$root.token,
                 path: path,
                 file_name: file_name
             })
             .then(function (res) {
                 if (res.data == true)
                     result = true;
             });
        return result;
    }


    $scope.addCategory = function () {
        $scope.rec2.name = '';
        $scope.record = {};
        /*     if ($scope.rec.id != undefined) {
         if ($scope.rec.category_type == 2) {
         $scope.getServicesCats();
         }
         if ($scope.rec.category_type == 1) {
         $scope.itemCats();
         }
         } else {
         $scope.itemCats();
         }*/
        $scope.itemCats();

        angular.element('#compCatModal').modal({show: true});
    }

    $scope.itemCats = function () {
        var catApi =$rootScope.stock + "categories";
        postData = {
            'token': $scope.$root.token,
            'all': "1",
        };
        $http
             .post(catApi, postData)
             .then(function (res) {
                 if (res.data.ack == true) {
                     $scope.record = {};
                     $scope.record = res.data.response;

                 }

             });
    }
    $scope.servicesCats = {};
    $scope.getServicesCats = function () {
        $scope.rec.category_type = 2;
        var catApi = $scope.$root.setup + "service/categories/get-all-categories";
        $scope.servicesCats = {};
        postData = {
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

    $scope.addCat = function (cat, type) {
        $scope.rec.category_name = cat.name;
        $scope.rec.category_id = cat.id;
        $scope.rec.category_type = type;
        angular.element('#compCatModal').modal('hide');
    }

    $scope.setItem = function () {
        $scope.rec.category_type = 1;
    }


    $scope.rec2 = {};
    $scope.add_cat = function () {
        var rec2 = {};
        var addcatUrl = $scope.$root.stock + "categories/add-category";
        rec2.token = $scope.$root.token;
        rec2.name = $scope.rec2.name;

        if ($scope.rec2.name == undefined || $scope.rec2.name == '') {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230,['Category Name']));
            return;
        }
        else {

            $http
                 .post(addcatUrl, rec2)
                 .then(function (res) {
                     if (res.data.ack == true) {
                         toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                         $('#compCatModal').modal('hide');
                         $scope.itemCats();


                         $timeout(function () {
                             $.each($scope.record, function (index, elem) {
                                 if (elem.name == rec2.name) {
                                     $scope.rec.category_name = elem.name;
                                     $scope.rec.category_id = elem.id;
                                 }
                             });
                         }, 1000);


                     }
                     else
                         toaster.pop('error', 'info', res.data.error);
                 });
        }
    }


}