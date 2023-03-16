myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
             .state('app.document', {
                 url: '/document',
                 title: 'Documents',
                 templateUrl: helper.basepath('documents/document.html'),
                 resolve: helper.resolveFor('ngTable', 'ngDialog'),
                 controller: 'docController'
             })
             .state('app.adddocument', {
                 url: '/document/add',
                 title: 'Add Documents',
                 templateUrl: helper.basepath('edit.html'), //('add.html'),
                 resolve: helper.resolveFor('ngTable', 'ngDialog'),
                 controller: 'editdocController'
                      //controller: 'addocController'
             })
             .state('app.viewDocCol', {
                 url: '/document/:id/view',
                 title: 'View Documents',
                 templateUrl: helper.basepath('edit.html'), //('documents/_form.html')
                 resolve: helper.resolveFor('ngTable', 'ngDialog'),
                 controller: 'editdocController'
             })
             .state('app.editDoc', {
                 url: '/document/:id/edit',
                 title: 'Edit Documents',
                 templateUrl: helper.basepath('edit.html'), //('documents/_form.html')
                 resolve: helper.resolveFor('ngTable', 'ngDialog'),
                 controller: 'editdocController'
             })

    }]);
//myApp.angular.module('myApp', ['infinite-scroll']);


 
myApp.controller('docController', docController);
function docController($scope, $filter, $resource, $timeout, $http, ngDialog, toaster, $state, $rootScope, dataService, $routeParams) {
    'use strict';
    
    $scope.$root.breadcrumbs =
         [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
             {'name': 'Documents', 'url': '#', 'isActive': false}];
    var vm = this;
    var Api = $scope.$root.com + "document_list";
    var postData = {
        'token': $scope.$root.token,
        'deparment': $scope.$root.deparment,
        'user_id': $scope.$root.userId
    };
    $scope.columns = [];
    $scope.$data = {};
    $scope.get_main_Document = function (limitStart) {

        $scope.limitStarts = 0;
        if (limitStart > 0)
            $scope.limitStarts = limitStart;
        var postData = {
            'token': $scope.$root.token,
            'deparment': $scope.$root.deparment,
            'user_id': $scope.$root.userId,
            //'limitStart':limitStart
            'limitStart': $scope.limitStarts
        };
        console.log(limitStart);
        $scope.showLoader = true;
        $timeout(function () {
            $http
                 .post(Api, postData)
                 .then(function (res) {
                     if (res.data.ack == true) {
                         $scope.$data = res.data.response;
                         // if( $scope.limitStarts !=$scope.$data.length)
                         $scope.limitStarts = $scope.$data.length;
                         /* for (var i = 0; i < $scope.$data.length+1; i++) {
                          $scope.$data.push($scope.$data[i]);
                          }*/


                         angular.forEach(res.data.response[0], function (val, index) {
                             $scope.columns.push({
                                 'title': toTitleCase(index),
                                 'field': index,
                                 'visible': true
                             });
                         });
                     }
                     // else  toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));
                 });
            $scope.showLoader = false;
        }, 1000);
    }



    function load(page) {

        var postData = {
            'token': $scope.$root.token,
            'deparment': $scope.$root.deparment,
            'user_id': $scope.$root.userId,
            //'limitStart':limitStart
            //'limitStart': $scope.limitStarts,
            'limitStart': page

        };
        console.log(page);
        var isTerminal = $scope.pagination && $scope.pagination.current_page >= $scope.pagination.total_pages && $scope.pagination.current_page <= 1;
        // Determine if there is a need to load a new page
        if (!isTerminal) {
            // Flag loading as started
            $scope.loading = true;
            // Make an API request
            $http.post(Api, postData)
                 .success(function (data, status, headers) {
                     // Parse pagination data from the response header
                     $scope.pagination = angular.fromJson(headers('x-pagination'));
                     // Create an array if not already created
                     $scope.$data = $scope.$data || {};
                     $timeout(function () {

                         // Append new items (or prepend if loading previous pages)

                         if ($scope.$data.length > 0)
                             $scope.$data.push.apply($scope.$data, data.response); //$scope.$data.push( data.response);
                         else
                             $scope.$data = data.response;
                         // console.log($scope.$data);

                     }, 2000);
                 })
                 .finally(function () {
                     // Flag loading as complete
                     $scope.loading = false;
                 });
        }

    }

    // Register event handler
//     $scope.$on('endlessScroll:next', function () {
//     // Determine which page to load
//     var page = $scope.pagination ? $scope.pagination.current_page + 1 : 1;
//          // Load page
//          load(page);
//     });
    // Load initial page (first page or from query param)
    //  load($routeParams.page ? parseInt($routeParams.page, 10) : 1);
    $scope.search_data = '';



    $scope.delete = function (id, index, arr_data) {
        var delUrl = $scope.$root.com + "document/delete-tab-col";
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
                         // $timeout(function(){ $state.go('app.hr_tabs'); }, 3000);
                     }
                     else {
                         toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(108));
                     }
                 });
        },
             function (reason) {
                 console.log('Modal promise rejected. Reason: ', reason);
             });
    };
    $scope.arr_shared = {};
    $scope.arr_shared = [{'label': 'Department', 'id': 2}, {'label': 'Users', 'id': 1}];
    $scope.isSalePerersonChanged = false;
    $scope.selectedSalespersons = [];
    $scope.searchKeyword = {};
    $scope.columns_general = [];
    $scope.general = {};
    $scope.formData = [];
    $scope.getALLFolder = function (arg) {

        $scope.display_sub = false;
        var postData_folder = {
            'token': $scope.$root.token,
            'module_id': $scope.module_id,
            'deparment': $scope.$root.deparment,
            'user_id': $scope.$root.userId
        };
        var postUrl_parent = $scope.$root.com + "document/get-folder-list-from-permision";
        $scope.showLoader = true;
        // $timeout(function () {
        console.log(postUrl_parent)
        $http
             .post(postUrl_parent, postData_folder)
             .then(function (res) {
                 if (res.data.ack == true) {
                     $scope.arr_folder = [];
                     $scope.arr_folder = res.data.response;
                     console.log($scope.arr_folder);

                     angular.forEach(res.data.response[0], function (val, index) {
                         $scope.columns_general.push({
                             'title': toTitleCase(index),
                             'field': index,
                             'visible': true
                         });
                     });
                 }
                 // else  toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));
             });
        $scope.showLoader = false;
        //  }, 1000);
    }
   $scope.getALLFolder();

    $scope.set_popup_data = function (id) {
        $scope.formData = {};
        $scope.formData.test_main = 1;
        $scope.formData.is_shared = 1;
        $scope.formData.folder_id = id;
        $scope.selectedSalespersons = [];
        $scope.salepersons = [];
        $scope.columns = [];
        //  $scope.getPersons(0);
        angular.element('#type_model').modal({show: true});
    }


    $scope.getPersons_public = function (rid, sid, item_paging) {

        $scope.formData = {};
        //$scope.formData.test_main = 1;
        //$scope.formData.is_shared = 1;

        //$scope.formData.folder_id =id;
        $scope.selectedSalespersons2 = [];
        $scope.salepersons2 = [];
        $scope.columns2 = [];
        $scope.formData.rid = rid;
        $scope.formData.is_shared = sid;
        $scope.columns2 = [];
        $scope.salepersons2 = [];
        if ($scope.formData.is_shared.id == 1)
            var postUrl = $scope.$root.hr + "employee/listings";
        else
            var postUrl = $scope.$root.hr + "hr_department/get-all-department";
        if ($scope.formData.is_shared.id == 1)
            $scope.title = "User";
        else
            $scope.title = "Department";
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.postData.all = 1;
        if (item_paging == 1)
            $rootScope.item_paging.spage = 1;
        $scope.postData.page = $rootScope.item_paging.spage;
        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;
        $scope.postData.searchKeyword = $scope.searchKeyword.$;
        if ($scope.searchKeyword.emp_type !== undefined && $scope.searchKeyword.emp_type !== null) {
            $scope.postData.emp_types = $scope.searchKeyword.emp_type.id;
        }

        if ($scope.searchKeyword.department !== undefined && $scope.searchKeyword.department !== null)
            $scope.postData.deprtments = $scope.searchKeyword.department.id;
        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data2 = {};
        }

        $http
             .post(postUrl, $scope.postData)
             .then(function (res) {
                 if (res.data.ack == true) {
                     $scope.total = res.data.total;
                     $scope.item_paging.total_pages = res.data.total_pages;
                     $scope.item_paging.cpage = res.data.cpage;
                     $scope.item_paging.ppage = res.data.ppage;
                     $scope.item_paging.npage = res.data.npage;
                     $scope.item_paging.pages = res.data.pages;
                     $scope.total_paging_record = res.data.total_paging_record;
                     /*$.each(res.data.response, function (indx, obj) {
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
                      });*/
                     //$scope.salepersons2=res.data.response;


                     $.each(res.data.response, function (indx, obj) {
                         obj.chk = false;
                         obj.isPrimary = false;
                         if ($scope.selectedSalespersons2.length > 0) {

                             $.each($scope.selectedSalespersons2, function (indx, obj2) {
                                 if (obj.id == obj2.id) {
                                     obj.chk = true;
                                     obj.permisions = obj2.permisions;
                                     if (obj2.permisions.length > 0) {
                                         var permision_arr = obj2.permisions.split(',');
                                         for (var i = 0; i < permision_arr.length; i++) {
                                             if (permision_arr[i] == 1)
                                                 obj.allowuright_add = true;
                                             if (permision_arr[i] == 2)
                                                 obj.allowuright_edit = true;
                                             if (permision_arr[i] == 3)
                                                 obj.allowuright_view = true;
                                             if (permision_arr[i] == 4)
                                                 obj.allowuright_delete = true;
                                         }
                                     }
                                     //if (obj2.is_primary == 1)  obj.isPrimary = true;

                                 }
                             });
                         }
                         $scope.salepersons2.push(obj);
                     });
                     if ($scope.formData.is_shared.id == 1) {

                         for (var i = 0; i < $scope.salepersons2.length; i++) {
                             var object = $scope.salepersons2[i];
                             if (object.id == $rootScope.userId)
                                 $scope.salepersons2.splice(i, 1);
                         }

                     }

                     angular.forEach(res.data.response[0], function (val, index) {
                         if (index != 'chk' && index != 'id') {
                             $scope.columns2.push({
                                 'title': toTitleCase(index),
                                 'field': index,
                                 'visible': true
                             });
                         }
                     });
                     angular.element('#listing_public').modal({show: true});
                     $scope.getSalePersons_edit_public($scope.formData.rid);
                 }
                 else
                     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
             });
    }

    $scope.getSalePersons_edit_public = function (id) {

        if ($scope.formData.is_shared.id == 1)
            var type = 7;
        else
            type = 8;
        //var salepersonUrl = $scope.$root.sales + "crm/crm/get-crm-salesperson";
        var salepersonUrl = $scope.$root.com + "document/get-folder-permision";
        $http
             .post(salepersonUrl, {id: id, 'token': $scope.$root.token, 'type': type})
             .then(function (emp_data) {

                 if (emp_data.data.ack == true) {
                     var permision_arr = '';
                     $timeout(function () {
                         $scope.$root.$apply(function () {
                             $.each($scope.salepersons2, function (indx, obj) {
                                 obj.chk = false;
                                 obj.isPrimary = false;
                                 $.each(emp_data.data.response, function (indx, obj2) {
                                     if (obj.id == obj2.salesperson_id) {
                                         obj.chk = true;
                                         obj.permisions = obj2.permisions;
                                         if (obj2.permisions.length > 0) {
                                             permision_arr = obj2.permisions.split(',');
                                             for (var i = 0; i < permision_arr.length; i++) {
                                                 if (permision_arr[i] == 1)
                                                     obj.allowuright_add = true;
                                                 if (permision_arr[i] == 2)
                                                     obj.allowuright_edit = true;
                                                 if (permision_arr[i] == 3)
                                                     obj.allowuright_view = true;
                                                 if (permision_arr[i] == 4)
                                                     obj.allowuright_delete = true;
                                             }
                                         }
                                         //if (obj2.is_primary == 1)  obj.isPrimary = true;

                                         $scope.selectedSalespersons2.push(obj);
                                     }
                                 });
                             });
                         });
                     }, 1000);
                 }
             });
    }


    $scope.getPersons = function (isShow, item_paging, clr) {

        $scope.columns = [];
        $scope.salepersons = [];
        if ($scope.formData.is_shared.id == 1)
            var postUrl = $scope.$root.hr + "employee/listings";
        else
            var postUrl = $scope.$root.hr + "hr_department/get-all-department";
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.postData.all = 1;
        if (item_paging == 1)
            $rootScope.item_paging.spage = 1;
        $scope.postData.page = $rootScope.item_paging.spage;
        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;
        $scope.postData.searchKeyword = $scope.searchKeyword.$;
        if ($scope.searchKeyword.emp_type !== undefined && $scope.searchKeyword.emp_type !== null) {
            $scope.postData.emp_types = $scope.searchKeyword.emp_type.id;
        }

        if ($scope.searchKeyword.department !== undefined && $scope.searchKeyword.department !== null)
            $scope.postData.deprtments = $scope.searchKeyword.department.id;
        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }
        if (clr == 77)
            $scope.searchKeyword = {};
        $http
             .post(postUrl, $scope.postData)
             .then(function (res) {
                 if (res.data.ack == true) {
                     $scope.total = res.data.total;
                     $scope.item_paging.total_pages = res.data.total_pages;
                     $scope.item_paging.cpage = res.data.cpage;
                     $scope.item_paging.ppage = res.data.ppage;
                     $scope.item_paging.npage = res.data.npage;
                     $scope.item_paging.pages = res.data.pages;
                     $scope.total_paging_record = res.data.total_paging_record;
                     /*$.each(res.data.response, function (indx, obj) {
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
                      });*/
                     //$scope.salepersons=res.data.response;


                     $.each(res.data.response, function (indx, obj) {
                         obj.chk = false;
                         obj.isPrimary = false;
                         if ($scope.selectedSalespersons.length > 0) {

                             $.each($scope.selectedSalespersons, function (indx, obj2) {
                                 if (obj.id == obj2.id) {
                                     obj.chk = true;
                                     obj.permisions = obj2.permisions;
                                     if (obj2.permisions.length > 0) {
                                      var    permision_arr = obj2.permisions.split(',');
                                         for (var i = 0; i < permision_arr.length; i++) {
                                             if (permision_arr[i] == 1)
                                                 obj.allowuright_add = true;
                                             if (permision_arr[i] == 2)
                                                 obj.allowuright_edit = true;
                                             if (permision_arr[i] == 3)
                                                 obj.allowuright_view = true;
                                             if (permision_arr[i] == 4)
                                                 obj.allowuright_delete = true;
                                         }
                                     }
                                     //if (obj2.is_primary == 1)  obj.isPrimary = true;

                                 }
                             });
                         }
                         $scope.salepersons.push(obj);
                     });
                     if ($scope.formData.is_shared.id == 1) {

                         for (var i = 0; i < $scope.salepersons.length; i++) {
                             var object = $scope.salepersons[i];
                             if (object.id == $rootScope.userId)
                                 $scope.salepersons.splice(i, 1);
                         }

                     }

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
        if ($scope.formData.allowpop == true)
            angular.element('#listing_public').modal({show: true});
        $scope.getSalePersons_edit($scope.formData.folder_id);
    }

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

        //$timeout(function(){
        $scope.$root.$apply(function () {
            $scope.selectedSalespersons;
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
                    $.each($scope.selectedSalespersons, function (indx, obj) {
                        if (obj != undefined) {
                            if (obj.id == sp.id)
                                $scope.selectedSalespersons.splice(indx, 1);
                        }
                    });
                } else {

                    // console.log('i==>>'+i);
                    if (isPrimary == 1 || $scope.selectedSalespersons.length == 0) {
                        var isExist = false;
                        $scope.salepersons[i].isPrimary = true;
                        $.each($scope.selectedSalespersons, function (indx, obj) {
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

        if ($scope.formData.is_shared.id == 1)
            var type = 7;
        else if ($scope.formData.is_shared.id == 2)
            var type = 8;
        else
            type = 1

        //var salepersonUrl = $scope.$root.sales + "crm/crm/get-crm-salesperson";
        var salepersonUrl = $scope.$root.com + "document/get-folder-permision";
        $http
             .post(salepersonUrl, {id: id, 'token': $scope.$root.token, 'type': type})
             .then(function (emp_data) {

                 if (emp_data.data.ack == true) {
                     var permision_arr = '';
                     $timeout(function () {
                         $scope.$root.$apply(function () {
                             $.each($scope.salepersons, function (indx, obj) {
                                 obj.chk = false;
                                 obj.isPrimary = false;
                                 $.each(emp_data.data.response, function (indx, obj2) {
                                     if (obj.id == obj2.salesperson_id) {
                                         obj.chk = true;
                                         obj.permisions = obj2.permisions;
                                         if (obj2.permisions.length > 0) {
                                             permision_arr = obj2.permisions.split(',');
                                             for (var i = 0; i < permision_arr.length; i++) {
                                                 if (permision_arr[i] == 1)
                                                     obj.allowuright_add = true;
                                                 if (permision_arr[i] == 2)
                                                     obj.allowuright_edit = true;
                                                 if (permision_arr[i] == 3)
                                                     obj.allowuright_view = true;
                                                 if (permision_arr[i] == 4)
                                                     obj.allowuright_delete = true;
                                             }
                                         }
                                         //if (obj2.is_primary == 1)  obj.isPrimary = true;

                                         $scope.selectedSalespersons.push(obj);
                                     }
                                 });
                             });
                         });
                     }, 1000);
                 }
             });
    }

    $scope.add_doc = function (id) {
        //var excUrl = $scope.$root.sales + "crm/crm/add-crm-salesperson";
        var excUrl = $scope.$root.com + "document/add-folder-permision";
        var post = {};
        var temp = []; //selectedSalespersons
        var permision = '';
        $.each($scope.salepersons, function (index, obj) {
            $scope.List = '';
            if (obj.allowuright_add == true)
                $scope.List += 1 + ',';
            if (obj.allowuright_edit == true)
                $scope.List += 2 + ',';
            if (obj.allowuright_view == true)
                $scope.List += 3 + ',';
            if (obj.allowuright_delete == true)
                $scope.List += 4 + ',';
            permision = $scope.List.substring(0, $scope.List.length - 1);
            if (obj.chk)
                temp.push({id: obj.id, isPrimary: obj.isPrimary, permisions: permision});
        })

        /*var List='';
         var selectedList='';
         if($scope.formData.allowuright_add == true) List += 1+',';
         if($scope.formData.allowuright_edit == true) List += 2+',';
         if($scope.formData.allowuright_view == true) List += 3+',';
         if($scope.formData.allowuright_delete  == true)List += 4+',';
         
         selectedList =	List.substring(0,List.length - 1);
         post.permisions = selectedList;*/
        //if( $scope.formData.is_shared.id==1) var type=7;
        //else var type=8;

        post.module = id; //$scope.formData.folder_id;
        post.selected = temp;
        post.type = 1;
        post.token = $scope.$root.token;
        $http
             .post(excUrl, post)
             .then(function (res) {
                 if (res.data.ack == true) {
                     toaster.pop('success', 'info', $scope.$root.getErrorMessageByCode(102));
                     $('#type_model').modal('hide');
                 }
                 else
                     toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(106));
             });
    }

    $scope.columns_folder = [];
    $scope.general_folder = {};
    $scope.display_sub = false;
    $scope.formData.allowuright_edit2 = false;
    $scope.formData.allowuright_view2 = false;
    $scope.formData.allowuright_delete2 = false;
    $scope.folder_date = null;
    var name='';
    
    $scope.get_folder_document = function (id, permisions, item) {

        $scope.columns_folder = [];
        $scope.general_folder = {};
        $scope.display_sub = true;
    
        if (name === undefined)
            $scope.folder_name = 'Private ';
        else
            $scope.folder_name = ' ' + item.name; //Public
        
        $scope.folder_date = item.date;
        $scope.permisions = permisions;
        var Api2 = $scope.$root.com + "document/document_list_module";
        $scope.postData = {};
        var postData = {
            'module': id,
            'token': $scope.$root.token,
            'deparment': $scope.$root.deparment,
            'user_id': $scope.$root.userId,
            //'limitStart':limitStart
            'limitStart': $scope.limitStarts
        };
        /*	$scope.limitStarts=0;
         if(limitStart>0) $scope.limitStarts=limitStart;
         console.log(limitStart);*/

        $scope.showLoader = true;
        $timeout(function () {
            $http
                 .post(Api2, postData)
                 .then(function (res) {
                     if (res.data.ack == true) {
                         $scope.general_folder = res.data.response;
                         angular.forEach(res.data.response[0], function (val, index) {
                             $scope.columns_folder.push({
                                 'title': toTitleCase(index),
                                 'field': index,
                                 'visible': true
                             });
                         });
                         //$('#folder_document_list').modal({show: true});

                     }
                     else
                         toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));
                 });
            $scope.showLoader = false;
        }, 1000);
    }


    //--------------------     Folder  --------------------
    var postData_folder = {
        'token': $scope.$root.token,
        'module_id': $scope.module_id
    };
    var postUrl_child = $scope.$root.com + "document/document_sub_folder";
    var postUrl_parent = $scope.$root.com + "document/get_document_folder_main";
    //var postUrl = $scope.$root.hr+"hr_values/document_parent_child_folder";
    $scope.chk_check_readonly = false;
    $scope.arr_folder_sub = [];
    $scope.arr_folder_sub.push({id: ' ', name: ' '});
    $scope.formData2 = {};
    $scope.list_folder_parent_main = function (arg) {

        $http
             .post(postUrl_parent, postData_folder)
             .then(function (res) {

                 $scope.arr_folder_sub = [];
                 if (res.data.ack == true)
                     $scope.arr_folder_sub = res.data.response;
                 else
                     toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(400));
             });
    }

    $scope.onChange_folder_main = function () {

        $scope.formData2.folder_id = '';
        $scope.formData2.name = '';
        $scope.list_folder_parent_main(1);
        $('#folder_pop').modal({show: true});
    }

    $scope.add_folder_main = function (formData2) {

        $scope.formData2.token = $scope.$root.token;
        $scope.formData2.data = $scope.formFields;
        $scope.formData2.module_id = $scope.module_id;
        $scope.formData2.main_module_doc = 2;
        $scope.formData2.folder_ids = $scope.formData2.folder_id !== undefined ? $scope.formData2.folder_id.id : 0;
        var submit_url = $scope.$root.com + "document/submit_folder_form";
        $http
             .post(submit_url, $scope.formData2)
             .then(function (res) {
                 if (res.data.ack == true) {

                     var insert_id = res.data.id;
                     toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                     $('#folder_pop').modal('hide');
                     $http
                          .post(postUrl_parent, postData_folder)
                          .then(function (res) {
                              $scope.arr_folder = [];
                              if (res.data.ack == true)
                                  $scope.arr_folder = res.data.response;
                          });
                 }
                 else
                     toaster.pop('error', 'Add', res.data.error);
             });
    };
    //--------------------     Folder  --------------------


    $scope.check_nested = function (level_index, id, classs) {

        for (var i = 0; i < $scope.salepersons.length; i++) {
            if (level_index == [i]) {
                // if (angular.element('.'+classs+'_'+$scope.salepersons[i].name).is(':checked') == true)

                if (classs == 'del') {
                    if ($scope.salepersons[i].allowuright_delete == true)
                        $scope.enable_check([i], true, 1);
                    else
                        $scope.enable_check([i], false, 5)
                }
                else if (classs == 'edit') {
                    if ($scope.salepersons[i].allowuright_edit == true)
                        $scope.enable_check([i], true, 2);
                    else
                        $scope.enable_check([i], false, 5)
                }
                else if (classs == 'view') {
                    if ($scope.salepersons[i].allowuright_view == true)
                        $scope.enable_check([i], true, 3);
                    else
                        $scope.enable_check([i], false, 5)
                }
                else if (classs == 'add') {
                    if ($scope.salepersons[i].allowuright_add == true)
                        $scope.enable_check([i], true, 4);
                    else
                        $scope.enable_check([i], false, 5)
                }

            }
        }
    }



    // $scope.inputText = ser1;	console.log($scope.inputText);
    $scope.data = dataService.dataObj; //console.log($scope.data);
    $scope.set_folder = function (id) {
        //$scope.formData.folder_id_send=id;
        //	ser1=id;
        $scope.data.id = id;
        /*$scope.$root.$broadcast("get_folder_in_add",$scope.formData.folder_id_send);*/
        $timeout(function () {
            $scope.$root.$apply(function () {
                $state.go("app.adddocument");
            });
        }, 2000);
    }


//     $scope.enable_check = function ([i], val, arg) {
//
//     if ((arg == 1) || (arg == 5)) {
//     $scope.salepersons[i].chk = val;
//          $scope.salepersons[i].allowuright_add = val;
//          $scope.salepersons[i].allowuright_view = val;
//          $scope.salepersons[i].allowuright_edit = val;
//          $scope.salepersons[i].allowuright_delete = val;
//     }
//     else if (arg == 2) {
//     $scope.salepersons[i].chk = val;
//          $scope.salepersons[i].allowuright_add = val;
//          $scope.salepersons[i].allowuright_view = val;
//          $scope.salepersons[i].allowuright_edit = val;
//          $scope.salepersons[i].allowuright_delete = false;
//     }
//     else if (arg == 3) {
//     $scope.salepersons[i].chk = val;
//          $scope.salepersons[i].allowuright_add = val;
//          $scope.salepersons[i].allowuright_view = val;
//          $scope.salepersons[i].allowuright_edit = false;
//          $scope.salepersons[i].allowuright_delete = false;
//     }
//     else if (arg == 4) {
//     $scope.salepersons[i].chk = val;
//          $scope.salepersons[i].allowuright_add = val;
//          $scope.salepersons[i].allowuright_view = false;
//          $scope.salepersons[i].allowuright_edit = false;
//          $scope.salepersons[i].allowuright_delete = false;
//     }
//
//
//     }

}


myApp.controller('editdocController', editdocController);
function editdocController($scope, $resource, $http, toaster, $state, $rootScope, ser1, dataService, $stateParams) {



    /* $scope.$on("get_folder_in_add", function (event,image) {
     $scope.formData.folder_id=image;
     
     console.log(image);
     console.log($scope.formData);
     });*/
    $scope.formData = {};
//$scope.inputText = ser1;	console.log($scope.inputText);
    $scope.data = dataService.dataObj;
    console.log($scope.data);
    $scope.formData.folder_add_type = 1;
    if ($stateParams.id !== undefined)
        $scope.formData.folder_add_type = 0;
    if ($stateParams.id !== undefined)
        $scope.data = {};
    $scope.btnCancelUrl = 'app.document';
    $scope.$root.breadcrumbs =
         [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
             {'name': 'Documents', 'url': 'app.document', 'isActive': false}];
    if ($stateParams.id !== undefined) {
        $scope.$root.breadcrumbs =
             [//{'name':'Dashboard','url':'app.dashboard','isActive':false},
                 {'name': 'Documents', 'url': 'app.document', 'isActive': false},
                 {'name': 'Add', 'url': '#', 'isActive': false}];
    }

    $scope.formUrl = function () {
        return "app/views/documents/_form.html";
    }


    $scope.status = {};
    $scope.arr_status = [{'label': 'Active', 'value': 1}, {'label': 'Inactive', 'value': 0}];
    $scope.formData.status = $scope.arr_status[0];
    $scope.arr_is_public = {};
    $scope.arr_is_public = [{'label': 'Public', 'id': 2}, {'label': 'Private', 'id': 1}];
    $scope.arr_shared = {};
    $scope.arr_shared = [{'label': 'Department', 'id': 2}, {'label': 'Users', 'id': 1}];
    $scope.$on("get_single_image", function (event, image) {
        $scope.formData.document_path = image;
    });
    $scope.update = function (formData) {

        $scope.formData.token = $scope.$root.token;
        //if($scope.formData.status !=undefined) $scope.formData.statuss = $scope.formData.status  !== undefined ? $scope.formData.status.value:0;
        if ($scope.formData.folder_id != undefined)
            $scope.formData.folder_ids = $scope.formData.folder_id.id !== undefined ? $scope.formData.folder_id.id : 0;
        if ($scope.formData.is_public != undefined)
            $scope.formData.is_publics = $scope.formData.is_public.id !== undefined ? $scope.formData.is_public.id : 0;
        if ($scope.formData.is_shared != undefined)
            $scope.formData.is_shareds = $scope.formData.is_shared.id !== undefined ? $scope.formData.is_shared.id : 0;
        /*
         $scope.List='';
         if($scope.formData.allowuright_add == true) $scope.List  += 1+',';
         if($scope.formData.allowuright_edit == true) $scope.List += 2+',';
         if($scope.formData.allowuright_view == true) $scope.List += 3+',';
         if($scope.formData.allowuright_delete  == true)$scope.List  += 4+',';
         $scope.formData.permisions=   $scope.List.substring(0, $scope.List.length - 1);
         */
        var postUrl = $scope.$root.com + "document/add-tab-col";
        $http
             .post(postUrl, $scope.formData)
             .then(function (res) {
                 if (res.data.ack == true) {
                     toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                     $timeout(function () {
                         $state.go('app.document');
                     }, 1000);
                 }
                 else
                     toaster.pop('error', 'Info', res.data.error);
                 if ($stateParams.id === undefined) {
                     if ($scope.isSalePerersonChanged) {
                         if ($scope.selectedSalespersons.length > 0)
                             $scope.add_salespersons(res.data.id);
                     }
                 }
             });
    }

    $scope.set_popup_data = function () {

        //	if( $scope.formData.is_shared.id != $scope.formData.is_shared_old)
        $scope.selectedSalespersons = [];
        $scope.getSalePersons(0);
    }

    $scope.remove_image = function (index, update_id) {
        //console.log(index);
        var delUrl = $scope.$root.com + "document/delete-image";
        if (update_id == undefined)
            $scope.items.splice(index, 1);
        else {
            ngDialog.openConfirm({
                template: 'modalcontinueid',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                $http
                     .post(del_sub_exp, {id: update_id, 'token': $scope.$root.token})
                     .then(function (res) {
                         if (res.data.ack == true) {
                             //$scope.items.splice(index);
                             $scope.get_srm_order_items();
                             toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                         }
                         else
                             toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(108));
                     });
            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }
    }

    $scope.formData.disable_user_readonly = true;
    if ($stateParams.id !== undefined) {
        var postUrl = $scope.$root.com + "document/get-doc-by-id";
        $http
             .post(postUrl, {'token': $scope.$root.token, 'id': $stateParams.id})
             .then(function (res) {
                 $scope.showLoader = true;
                 if (res.data.ack == true) {
                     $scope.formData.id = res.data.response.id;
                     $scope.formData.document_title = res.data.response.title;
                     $scope.formData.document_code = res.data.response.document_code;
                     $scope.formData.document_path = res.data.response.name;
                     $scope.formData.FileType = res.data.response.FileType;
                     $scope.formData.is_shared_old = res.data.response.is_shared;
                     /*	$.each($scope.arr_status,function(index,obj){
                      if(res.data.response.status!=undefined) 	{
                      if(obj.value == res.data.response.status)
                      $scope.formData.status = obj
                      }
                      });*/

                     $.each($scope.arr_is_public, function (index, obj) {
                         if (res.data.response.is_public != undefined) {
                             if (obj.id == res.data.response.is_public)
                                 $scope.formData.is_public = obj;
                         }
                     });
                     $.each($scope.arr_shared, function (index, obj) {
                         if (res.data.response.is_shared != undefined) {
                             if (obj.id == res.data.response.is_shared)
                                 $scope.formData.is_shared = obj;
                         }
                     });
                     /*if(res.data.response.permisions.length>0){
                      permision_arr = res.data.response.permisions.split(',');
                      for(var i = 0; i < permision_arr.length; i++){
                      if(permision_arr[i]==1)	$scope.formData.allowuright_add  = true;
                      if(permision_arr[i]==2)	$scope.formData.allowuright_edit  = true;
                      if(permision_arr[i]==3)	$scope.formData.allowuright_view  = true;
                      if(permision_arr[i]==4)	$scope.formData.allowuright_delete  = true;
                      }}*/

                     if (res.data.response.name)
                         $scope.$root.$broadcast("get_single_image_edit", res.data.response.name);
                     if (res.data.response.user_id == $rootScope.userId)
                         $scope.formData.disable_user_readonly = true;
                     else
                         $scope.formData.disable_user_readonly = false;
                     $timeout(function () {
                         $.each($scope.arr_folder, function (index, obj) {
                             if (res.data.response.folder_id != undefined) {
                                 if (obj.id == res.data.response.folder_id)
                                     $scope.formData.folder_id = obj;
                             }
                         });
                         if ($scope.formData.disable_user_readonly) {

                             if (res.data.response.is_public == 2) {
                                 $scope.getSalePersons(1);
                                 $scope.getSalePersons_edit(res.data.response.id);
                             }

                         }
                     }, 1000);
                     $scope.showLoader = false;
                 }
                 else
                     $scope.showLoader = false;
             });
    }


    $scope.isSalePerersonChanged = false;
    $scope.selectedSalespersons = [];
    $scope.searchKeyword = {};
    $scope.getSalePersons = function (isShow, item_paging, clr) {
        $scope.isSalePerersonChanged = true;
        $scope.columns = [];
        $scope.salepersons = [];
        if ($scope.formData.is_shared.id == 1)
            var postUrl = $scope.$root.hr + "employee/listings";
        else
            var postUrl = $scope.$root.hr + "hr_department/get-all-department";
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.postData.all = 1;
        if (item_paging == 1)
            $rootScope.item_paging.spage = 1;
        $scope.postData.page = $rootScope.item_paging.spage;
        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;
        $scope.postData.searchKeyword = $scope.searchKeyword.$;
        if ($scope.searchKeyword.emp_type !== undefined && $scope.searchKeyword.emp_type !== null) {
            $scope.postData.emp_types = $scope.searchKeyword.emp_type.id;
        }

        if ($scope.searchKeyword.department !== undefined && $scope.searchKeyword.department !== null)
            $scope.postData.deprtments = $scope.searchKeyword.department.id;
        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }
        if (clr == 77)
            $scope.searchKeyword = {};
        $http
             .post(postUrl, $scope.postData)
             .then(function (res) {
                 if (res.data.ack == true) {
                     $scope.total = res.data.total;
                     $scope.item_paging.total_pages = res.data.total_pages;
                     $scope.item_paging.cpage = res.data.cpage;
                     $scope.item_paging.ppage = res.data.ppage;
                     $scope.item_paging.npage = res.data.npage;
                     $scope.item_paging.pages = res.data.pages;
                     $scope.total_paging_record = res.data.total_paging_record;
                     $.each(res.data.response, function (indx, obj) {
                         obj.chk = false;
                         obj.isPrimary = false;
                         if ($scope.selectedSalespersons.length > 0) {

                             $.each($scope.selectedSalespersons, function (indx, obj2) {
                                 if (obj.id == obj2.id) {
                                     obj.chk = true;
                                     obj.permisions = obj2.permisions;
                                     if (obj2.permisions.length > 0) {
                                         permision_arr = obj2.permisions.split(',');
                                         for (var i = 0; i < permision_arr.length; i++) {
                                             if (permision_arr[i] == 1)
                                                 obj.allowuright_add = true;
                                             if (permision_arr[i] == 2)
                                                 obj.allowuright_edit = true;
                                             if (permision_arr[i] == 3)
                                                 obj.allowuright_view = true;
                                             if (permision_arr[i] == 4)
                                                 obj.allowuright_delete = true;
                                         }
                                     }
                                     //if (obj2.is_primary == 1)  obj.isPrimary = true;

                                 }
                             });
                         }
                         $scope.salepersons.push(obj);
                     });
                     if ($scope.formData.is_shared.id == 1) {

                         for (var i = 0; i < $scope.salepersons.length; i++) {
                             var object = $scope.salepersons[i];
                             if (object.id == $rootScope.userId)
                                 $scope.salepersons.splice(i, 1);
                         }

                     }

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
        if (isShow === 0)
            angular.element('#type_model').modal({show: true});
    }

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

        //$timeout(function(){
        $scope.$root.$apply(function () {
            $scope.selectedSalespersons;
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
                    $.each($scope.selectedSalespersons, function (indx, obj) {
                        if (obj != undefined) {
                            if (obj.id == sp.id)
                                $scope.selectedSalespersons.splice(indx, 1);
                        }
                    });
                } else {

                    // console.log('i==>>'+i);
                    if (isPrimary == 1 || $scope.selectedSalespersons.length == 0) {
                        var isExist = false;
                        $scope.salepersons[i].isPrimary = true;
                        $.each($scope.selectedSalespersons, function (indx, obj) {
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

        if ($scope.formData.is_shared.id == 1)
            var type = 7;
        else
            var type = 8;
        //var salepersonUrl = $scope.$root.sales + "crm/crm/get-crm-salesperson";
        var salepersonUrl = $scope.$root.com + "document/get-folder-permision";
        $http
             .post(salepersonUrl, {id: id, 'token': $scope.$root.token, 'type': type})
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
                                         obj.permisions = obj2.permisions;
                                         if (obj2.permisions.length > 0) {
                                             permision_arr = obj2.permisions.split(',');
                                             for (var i = 0; i < permision_arr.length; i++) {
                                                 if (permision_arr[i] == 1)
                                                     obj.allowuright_add = true;
                                                 if (permision_arr[i] == 2)
                                                     obj.allowuright_edit = true;
                                                 if (permision_arr[i] == 3)
                                                     obj.allowuright_view = true;
                                                 if (permision_arr[i] == 4)
                                                     obj.allowuright_delete = true;
                                             }
                                         }
                                         //if (obj2.is_primary == 1)  obj.isPrimary = true;

                                         $scope.selectedSalespersons.push(obj);
                                     }
                                 });
                             });
                         });
                     }, 1000);
                 }
             });
    }

    $scope.add_salespersons = function (id) {
        //var excUrl = $scope.$root.sales + "crm/crm/add-crm-salesperson";
        var excUrl = $scope.$root.com + "document/add-folder-permision";
        var post = {};
        var temp = [];
        var permision = '';
        $.each($scope.salepersons, function (index, obj) {

            $scope.List = '';
            if (obj.allowuright_add == true)
                $scope.List += 1 + ',';
            if (obj.allowuright_edit == true)
                $scope.List += 2 + ',';
            if (obj.allowuright_view == true)
                $scope.List += 3 + ',';
            if (obj.allowuright_delete == true)
                $scope.List += 4 + ',';
            permision = $scope.List.substring(0, $scope.List.length - 1);
            if (obj.chk)
                temp.push({id: obj.id, isPrimary: obj.isPrimary, permisions: permision});
        })

        if ($scope.formData.is_shared.id == 1)
            var type = 7;
        else
            var type = 8;
        post.module = id;
        post.selected = temp;
        post.type = type;
        post.token = $scope.$root.token;
        $http
             .post(excUrl, post)
             .then(function (res) {

             });
    }


    //--------------------     Folder  --------------------
    $scope.display_sub = false;
    var postData_folder = {
        'token': $scope.$root.token,
        'module_id': $scope.module_id,
        'deparment': $scope.$root.deparment,
        'user_id': $scope.$root.userId
    };
    var postUrl_parent = $scope.$root.com + "document/get-folder-list-from-permision";
    var postUrl_child = $scope.$root.com + "document/document_sub_folder";
    //var postUrl_parent = $scope.$root.com+"document/document_folder";
    //var postUrl = $scope.$root.hr+"hr_values/document_parent_child_folder";
    $scope.chk_check_readonly = false;
    $scope.arr_folder = [];
    $scope.arr_folder.push({id: ' ', name: ' '});
    $scope.formData2 = {};
    $scope.formData22 = {};
    $scope.loader = {loading: false};
    $scope.list_folder_parent_main = function (arg) {


        $http
             .post(postUrl_parent, postData_folder)
             .then(function (res) {

                 if (arg == 1)
                     $scope.arr_folder = [];
                 else if (arg == 2)
                     $scope.arr_folder_sub = [];
                 if (res.data.ack == true) {
                     if (arg == 1)
                         $scope.arr_folder = res.data.response;
                     else if (arg == 2)
                         $scope.arr_folder_sub = res.data.response;
                 }
                 //if ($scope.user_type == 1)
                 if (arg == 1)
                     $scope.arr_folder.push({'id': '-1', 'name': '++ Add New ++'});
                 // if(arg==1)$scope.arr_folder.push({'id': '-11', 'name': '++ Edit++'});

                 if (arg == 1) {
                     /* $scope.chk_check_readonly=false;
                      $.each($scope.arr_folder, function (index, elem) {
                      if (Number(elem.user_id) !==  Number($rootScope.userId) )
                      {
                      $scope.chk_check_readonly=true;
                      return;
                      }
                      });*/
                 }

                 //$timeout(function(){$scope.$root.$apply(function(){
                 if ($scope.formData.folder_add_type == 1) {
                     $scope.formData.folder_id = $scope.data.id;
                     $.each($scope.arr_folder, function (index, obj) {
                         if (obj.id == $scope.formData.folder_id)
                             $scope.formData.folder_id = obj;
                     });
                 }
                 //	});	},1000);


             });
    }

    $scope.list_folder_parent_main(1);
    $scope.onChange_folder_main = function () {
        if (this.formData.folder_id.id == -1) {
            $scope.list_folder_parent_main(2);
            $scope.formData2.folder_id = '';
            $scope.formData2.name = '';
            $('#folder_pop').modal({show: true});
            $scope.show_folder_pop = true;
        }

        if (this.formData.folder_id.id == -11) {
            $scope.list_folder_parent_main(2);
            $scope.formData22.name = '';
            $scope.formData22.folder_id = '';
            $('#folder_pop_type_edit').modal({show: true});
        }
    }

    $scope.add_folder_main = function (formData2) {


        $scope.formData2.token = $scope.$root.token;
        $scope.formData2.data = $scope.formFields;
        $scope.formData2.module_id = $scope.module_id;
        $scope.formData2.main_module_doc = 2;
        $scope.formData2.folder_ids = $scope.formData2.folder_id !== undefined ? $scope.formData2.folder_id.id : 0;
        var submit_url = $scope.$root.com + "document/submit_folder_form";
        $http
             .post(submit_url, $scope.formData2)
             .then(function (res) {
                 if (res.data.ack == true) {

                     var insert_id = res.data.id;
                     toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                     $('#folder_pop').modal('hide');
                     // $scope.list_folder_parent_main(1);
                     //$scope.list_folder_parent_main(2);

                     $http
                          .post(postUrl_parent, postData_folder)
                          .then(function (res) {
                              $scope.arr_folder = [];
                              if (res.data.ack == true) {
                                  $scope.arr_folder.push({id: ' ', name: ' '});
                                  $scope.arr_folder = res.data.response;
                                  $.each($scope.arr_folder, function (index, elem) {
                                      //   if (elem.id == insert_id)  $scope.formData.folder_id = elem;
                                      if (elem.name == $scope.formData2.name)
                                          $scope.formData.folder_id = elem;
                                  });
                              }
                              //if ($scope.user_type == 1)
                              $scope.arr_folder.push({'id': '-1', 'name': '++ Add New ++'});
                              // if(arg==1)$scope.arr_folder.push({'id': '-11', 'name': '++ Edit++'});

                          });
                 }
                 else
                     toaster.pop('error', 'Add', res.data.error);
             });
    };


    $scope.add_folder_edit_main = function (formData22) {

        $scope.formData22.token = $scope.$root.token;
        $scope.formData22.data = $scope.formFields;
//        $scope.list_folder[0];
        $scope.formData22.folder_ids = $scope.formData22.folder_id !== undefined ? $scope.formData22.folder_id.id : 0;
        //var f_id = this.formData22.folder_id.id;


        if ($scope.arr_folder_sub[0].id == $scope.formData22.folder_ids) {
            toaster.pop('error', 'Info', "Parent name can't be change");
            return;
        }


        var submit_url = $scope.$root.com + "document/update-folder";
        $http
             .post(submit_url, $scope.formData22)
             .then(function (res) {
                 if (res.data.ack == true) {

                     toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(102));
                     $('#folder_pop_type_edit').modal('hide');
                     $http
                          .post(postUrl_parent, postData_folder)
                          .then(function (res) {
                              if (res.data.ack == true) {
                                  $scope.arr_folder = [];
                                  $scope.arr_folder.push({id: ' ', name: ' '});
                                  $scope.arr_folder = res.data.response;
                                  $.each($scope.arr_folder, function (index, elem) {
                                      if (elem.name == $scope.formData22.name)
                                          $scope.formData.folder_id = elem;
                                  });
                              }
                              //if ($scope.user_type == 1)
                              $scope.arr_folder.push({'id': '-1', 'name': '++ Add New ++'});
                              // $scope.arr_folder.push({'id': '-11', 'name': '++ Edit++'});

                          });
                 }
                 else
                     toaster.pop('error', 'Deleted', res.data.error);
             });
    };
    //--------------------     Folder  --------------------


    $scope.check_nested = function (level_index, id, classs) {

        for (var i = 0; i < $scope.salepersons.length; i++) {
            if (level_index == [i]) {
                // if (angular.element('.'+classs+'_'+$scope.salepersons[i].name).is(':checked') == true)

                if (classs == 'del') {
                    if ($scope.salepersons[i].allowuright_delete == true)
                        $scope.enable_check([i], true, 1);
                    else
                        $scope.enable_check([i], false, 5)
                }
                else if (classs == 'edit') {
                    if ($scope.salepersons[i].allowuright_edit == true)
                        $scope.enable_check([i], true, 2);
                    else
                        $scope.enable_check([i], false, 5)
                }
                else if (classs == 'view') {
                    if ($scope.salepersons[i].allowuright_view == true)
                        $scope.enable_check([i], true, 3);
                    else
                        $scope.enable_check([i], false, 5)
                }
                else if (classs == 'add') {
                    if ($scope.salepersons[i].allowuright_add == true)
                        $scope.enable_check([i], true, 4);
                    else
                        $scope.enable_check([i], false, 5)
                }

            }
        }
    }

    $scope.enable_check = function ([i], val, arg) {

        if ((arg == 1) || (arg == 5)) {
            $scope.salepersons[i].chk = val;
            $scope.salepersons[i].allowuright_add = val;
            $scope.salepersons[i].allowuright_view = val;
            $scope.salepersons[i].allowuright_edit = val;
            $scope.salepersons[i].allowuright_delete = val;
        }
        else if (arg == 2) {
            $scope.salepersons[i].chk = val;
            $scope.salepersons[i].allowuright_add = val;
            $scope.salepersons[i].allowuright_view = val;
            $scope.salepersons[i].allowuright_edit = val;
            $scope.salepersons[i].allowuright_delete = false;
        }
        else if (arg == 3) {
            $scope.salepersons[i].chk = val;
            $scope.salepersons[i].allowuright_add = val;
            $scope.salepersons[i].allowuright_view = val;
            $scope.salepersons[i].allowuright_edit = false;
            $scope.salepersons[i].allowuright_delete = false;
        }
        else if (arg == 4) {
            $scope.salepersons[i].chk = val;
            $scope.salepersons[i].allowuright_add = val;
            $scope.salepersons[i].allowuright_view = false;
            $scope.salepersons[i].allowuright_edit = false;
            $scope.salepersons[i].allowuright_delete = false;
        }


    }


}

DocUploadDocument_single.$inject = ["$scope", "Upload", "$timeout", "toaster"];
myApp.controller('DocUploadDocument_single', DocUploadDocument_single);
function DocUploadDocument_single($scope, Upload, $timeout, toaster) {
    $scope.formData = {};
    $scope.formDataExpense = {};
    $scope.choices = {};
    $scope.addEvent = {};
    $scope.loader = {loading: false};
    $scope.$on("get_single_image_edit", function (event, image) {
        $scope.formData.document_path = image;
        $scope.formData.emp_picture = image;
    });
    $scope.$on("get_expense_image_edit", function (event, image) {
        $scope.formDataExpense.exp_image = image;
    });
    $scope.uploadFiles = function (file, errFiles) {
        $scope.showLoader = true;
        $('#pic_block').attr("disabled", true);
        //$scope.formData={};
        //$scope.choices={};
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        var postUrl = $scope.$root.com + "document/upload_doc";
        $scope.showLoader = true;
        $scope.loader_pop = true;
        $timeout(function () {


        if (file) {
            file.upload = Upload.upload({
                url: postUrl,
                data: {file: file, image_token: $scope.$root.token, "eid": $scope.formData.employee_id}
            });
            file.upload.then(function (response) {

                    if (response.data.ack == true) {
                        $scope.formData.emp_picture = response.data.response;
                        $scope.formData.document_path = response.data.response;
                        $scope.formData.FileType = response.data.FileType;
                        $scope.formData.photo = response.data.response;
                        $scope.formData.t_image = response.data.response;
                        $scope.addEvent.newFileName = response.data.response;
                        $scope.formDataExpense.exp_image = response.data.response;
                        $scope.$root.$broadcast("get_single_image", response.data.response);
                        $scope.$root.$broadcast("get_single_image_expence", response.data.response);
                        file.result = response.data;
                        toaster.pop('success', 'Add', 'Uploaded Successfully ');
                        $scope.showLoader = false;
                    }
                    else {
                        $scope.showLoader = false;
                        toaster.pop('error', 'Info', response.data.response);
                        $('#pic_block').attr("disabled", false);
                    }


            },
                 function (response) {  $scope.showLoader = false;

                     if (response.status > 0)
                         $scope.errorMsg = response.status + ': ' + response.data;
                     $('#pic_block').attr("disabled", false);
                 },
                 function (evt) {
                     file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                 });
        }
        }, 1000);
    }

}

DocUploadControllerMulti.$inject = ["$scope", "$rootScope", "Upload", "$timeout", "toaster"];
myApp.controller('DocUploadControllerMulti', DocUploadControllerMulti);
function DocUploadControllerMulti($scope, $rootScope, Upload, $timeout, toaster, $stateParams) {

    $scope.formData = [];
    $scope.formData_images_data_opp_cycle = [];
    $scope.formData.fileName = [];
    $scope.loader = {loading: false};
    //empty in edit case  call event with deferent name
    $scope.$on("multi_image_empty_pre", function (event, array_image2) {
        $scope.formData_images_data_opp_cycle = [];
    });
    $scope.uploadFiles = function (file, errFiles) {
        $scope.showLoader = true;
        $('#pic_block').attr("disabled", true);
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        var postUrl = $scope.$root.com + "document/upload_doc";
        $scope.showLoader = true;
        $scope.loader_pop = true;
        $timeout(function () {
            if (file) {
            file.upload = Upload.upload({
                url: postUrl,
                data: {file: file, image_token: $scope.$root.token}
            });
            file.upload.then(function (response) {

                    if (response.data.ack == true) {
                        toaster.pop('success', 'Add', 'Uploaded Successfully ');
                        // $scope.formData.document_path = response.data.response;
                        //$scope.formData.FileType = response.data.FileType;
                        // file.result = response.data;

                        //$scope.formData.fileName.push(response.data);

                        $scope.formData_images_data_opp_cycle.push(response.data);
                        $scope.$root.$broadcast("multi_image2", $scope.formData_images_data_opp_cycle);
                        $scope.showLoader = false;
                    }
                    else {
                        $scope.showLoader = false;
                        toaster.pop('error', 'Info', response.data.response);
                        $('#pic_block').attr("disabled", false);
                    }


            }, function (response) {  $scope.showLoader = false;
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
                $('#pic_block').attr("disabled", false);
            },
                 function (evt) {
                     // ngProgress.complete();
                     file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                 });
        }
    }, 1000);
    }

}

//Generic Funtionality in  Main Module
ImgUploadController.$inject = ["$scope", "$stateParams", "$http", "$state", "$resource", "toaster", "$filter", "$window", "ngDialog", "$timeout", "$rootScope", "Upload", "$interval"];
myApp.controller('ImgUploadController', ImgUploadController);
function ImgUploadController($scope, $stateParams, $http, $state, $resource, toaster, $filter, $window, ngDialog, $timeout, $rootScope, Upload, $interval) {
    'use strict';
    $scope.uploadFiles = function (file, errFiles) {

        $('#pic_block').attr("disabled", true);
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        var postUrl = $scope.$root.com + "document/upload_doc";
        $scope.showLoader = true;
        $scope.loader_pop = true;
        $timeout(function () {
            if (file) {

                file.upload = Upload.upload({
                    url: postUrl,
                    data: {file: file, image_token: $scope.$root.token}
                });
                file.upload.then(function (response) {


                        if (response.data.ack == true) {
                            toaster.pop('success', 'Add', 'Uploaded Successfully ');
                            $scope.showLoader = false;
                            // $scope.formData.document_path = response.data.response;
                            //$scope.formData.FileType = response.data.FileType;
                            $scope.formData_images_data.push(response.data);
                            //$scope.formData.fileName.push(response.data);
                            //$scope.$root.$broadcast("multi_image",$scope.formData.fileName);
                            //$scope.formData.document_path;
                        }
                        else {
                            $scope.showLoader = false;
                            toaster.pop('error', 'Info', response.data.response);
                            $('#pic_block').attr("disabled", false);
                        }


                }, function (response) {  $scope.showLoader = false;

                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                    // $('#pic_block').attr("disabled", false);
                },
                     function (evt) {
                         file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                     });
            }
        }, 1000);
    }

    var redirect = '';
    // $scope.call_event = function () {
    $scope.$on("image_module", function (event, row_id, module, module_id, module_name, module_code, sub_type, tab_id) {

        $scope.row_id = row_id; //$stateParams.id;
        $scope.module = module;
        $scope.module_id = module_id;
        $scope.module_name = module_name;
        $scope.module_code = module_code;
        $scope.sub_type = sub_type;
        $scope.tab_id = tab_id;
        $scope.tab_ids = tab_id;
        // if(sub_type==0){ $scope.getComments();	counter++;}

    });
    //};

    if ($scope.module_id == 29)
        redirect = 'app.item';
    else if ($scope.module_id == 36)
        redirect = 'app.hr_listing';
    else if ($scope.module_id == 105)
        redirect = 'app.srm';
    else if ($scope.module_id == 54)
        redirect = 'app.supplier';
    else if ($scope.module_id == 110)
        redirect = 'app.srmorder';
    else if ($scope.module_id == 111)
        redirect = 'app.srminvoice';
    else if ($scope.module_id == 112)
        redirect = 'app.srm_order_return';
    else if ($scope.module_id == 113)
        redirect = 'app.warehouse';
    else if ($scope.module_id == 114)
        redirect = 'app.services';
    else
        redirect = 'app.crm'; //if($scope.module_id==19)


    $scope.formData2 = {};
    $scope.formData22 = {};
    var postData = {
        'token': $scope.$root.token,
        'module_id': $scope.module_id
    };
    var postData_folder = {
        'token': $scope.$root.token,
        'module_id': $scope.module_id
    };
//----------- 	 Document 	 ----------------------------------------

    //--------------------     Folder  --------------------

    var postUrl_child = $scope.$root.com + "document/document_sub_folder";
    var postUrl_parent = $scope.$root.com + "document/document_folder";
    //var postUrl = $scope.$root.hr+"hr_values/document_parent_child_folder";


    $scope.add_folder_edit = function (formData22) {

        $scope.formData22.token = $scope.$root.token;
        $scope.formData22.data = $scope.formFields;
        $scope.list_folder[0];
        $scope.formData22.folder_ids = $scope.formData22.folder_id !== undefined ? $scope.formData22.folder_id.id : 0;
        //var f_id = this.formData22.folder_id.id;

        //console.log($scope.formData22);return;
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
                     $('#folder_pop_type_edit').modal('hide');
                     $http
                          .post(postUrl_parent, postData_folder)
                          .then(function (res) {
                              if (res.data.ack == true) {
                                  $scope.list_folder = [];
                                  $scope.list_folder.push({id: ' ', name: ' '});
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
                              //if ($scope.user_type == 1)
                              $scope.list_folder.push({'id': '-1', 'name': '++ Add New ++'});
                              // $scope.list_folder.push({'id': '-11', 'name': '++ Edit++'});

                          });
                 }
                 else
                     toaster.pop('error', 'Deleted', res.data.error);
             });
    };
    $scope.list_folder_parent = function (arg) {


        $http
             .post(postUrl_parent, postData_folder)
             .then(function (res) {

                 if (res.data.ack == true) {
                     if (arg == 1) {

                         $scope.list_folder = [];
                         $scope.list_folder.push({id: ' ', name: ' '});
                         $scope.list_folder = res.data.response;
                         //	if ($scope.user_type == 1)
                         $scope.list_folder.push({'id': '-1', 'name': '++ Add New ++'});
                         // $scope.list_folder.push({'id': '-11', 'name': '++ Edit++'});


                     }
                     else if (arg == 2) {

                         $scope.list_folder_sub = [];
                         $scope.list_folder_sub = res.data.response;
                     }
                 }
                 // else toaster.pop('error', 'Info', "No Record  Found");


             });
    }

    $scope.onChange_folder = function () {
        //	var f_id =document.getElementById('case_folder').value;

        var f_id = this.formData.folder_id.id;
        console.log(f_id);
        if (f_id == -1) {
            $scope.list_folder_parent(2);
            $scope.formData2.folder_id = '';
            $scope.formData2.name = '';
            angular.element('#folder_pop').click();
            $scope.show_folder_pop = true;
        }

        if (f_id == -11) {
            $scope.list_folder_parent(2);
            $scope.formData22.name = '';
            $scope.formData22.folder_id = '';
            $('#folder_pop_type_edit').modal({show: true});
        }
    }

    $scope.add_folder = function (formData2) {

        $scope.formData2.token = $scope.$root.token;
        $scope.formData2.data = $scope.formFields;
        $scope.formData2.module_id = $scope.module_id;
        $scope.formData2.folder_ids = $scope.formData2.folder_id !== undefined ? $scope.formData2.folder_id.id : 0;
        var submit_url = $scope.$root.com + "document/submit_folder_form";
        $http
             .post(submit_url, $scope.formData2)
             .then(function (res) {
                 if (res.data.ack == true) {

                     var insert_id = res.data.id;
                     toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                     $('#folder_pop_type').modal('hide');
                     $scope.list_folder_parent(1);
                     $scope.list_folder_parent(2);
                     /*
                      $.each($scope.list_folder, function (index, elem) {
                      if (elem.name == $scope.formData2.name)
                      $scope.formData.folder_id = elem;
                      });
                      */
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
    //--------------------     Folder  --------------------


    $scope.item_paging = {};
    $scope.itemselectPage = function (pageno) {
        $scope.item_paging.spage = pageno;
    };
    $scope.documentlist_all = [];
    $scope.columns_all = [];
    $scope.getDocuments_all = function () {
        $scope.formData = {};
        //if(all_tab=='hr') tab_ids;

        /*$scope.$root.breadcrumbs =
         [//{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
         {'name':  $scope.module, 'url': '#', 'isActive': false},
         {'name': $scope.module_name, 'url': redirect, 'isActive': false},
         {'name': $scope.module_code, 'url': '#', 'isActive': false},
         {'name': 'Documents', 'url': '#', 'isActive': false}];
         */
        $scope.breadcrumbs[3].name = 'Documents';
        $scope.showdocumentlist_all = true;
        var API = $scope.$root.com + "document/document_list_all_tabs";
        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'all': "1",
            'column': 'company_id',
            'module_id': $scope.module_id,
            'employee_id': $scope.row_id,
            'tab_ids': $scope.tab_id,
            'page': $scope.item_paging.spage,
            //'country_keyword': angular.element('#search_sale_listing_data').val()
        };
        $scope.showLoader = true;
        // $timeout(function(){
        $http
             .post(API, $scope.postData)
             .then(function (res) {
                 $scope.documentlist_all = [];
                 $scope.columns_all = [];
                 if (res.data.ack == true) {

                     $scope.total = res.data.total;
                     $scope.item_paging.total_pages = res.data.total_pages;
                     $scope.item_paging.cpage = res.data.cpage;
                     $scope.item_paging.ppage = res.data.ppage;
                     $scope.item_paging.npage = res.data.npage;
                     $scope.item_paging.pages = res.data.pages;
                     $scope.documentlist_all = res.data.response;
                     angular.forEach(res.data.response[0], function (val, index) {
                         $scope.columns_all.push({
                             'title': toTitleCase(index),
                             'field': index,
                             'visible': true
                         });
                     });
                     $scope.showLoader = false;
                 }
                 else {
                     $scope.showLoader = false; //toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                 }
             });
        //	  }, 2000);

    }

    $scope.getDocuments = function () {

        /*$scope.$root.breadcrumbs =
         [//{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
         {'name':  $scope.module, 'url': '#', 'isActive': false},
         {'name': $scope.module_name, 'url': redirect, 'isActive': false},
         {'name': $scope.module_code, 'url': '#', 'isActive': false},
         {'name': 'Documents', 'url': '#', 'isActive': false}];
         
         */		//$scope.breadcrumbs[3].name = 'Documents';
        $scope.showdocumentlist = true;
        $scope.showdoc = true; //false;
        var API = $scope.$root.com + "document/document_list";
        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'all': "1",
            'column': 'company_id',
            'module_id': $scope.module_id,
            'employee_id': $scope.row_id,
            'tab_id': $scope.tab_id,
            'page': $scope.item_paging.spage,
            //'country_keyword': angular.element('#search_sale_listing_data').val()
        };
        $scope.showLoader = true;
        $http
             .post(API, $scope.postData)
             .then(function (res) {
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
                 else {
                     $scope.showLoader = false; //toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                 }
             });
    }

    $scope.fnDocForm = function () {
        //$scope.formData.fileName=[];var fileName=[];
        //$scope.$root.$broadcast("multi_image2",fileName);
        $scope.formData_images_data = [];
        $("#document_id").val('');
        $scope.formData.document_id = '';
        $scope.document_id = '';
        $scope.formData.folder_id = '';
        $scope.formData.document_title = '';
        $scope.formData.document_code = '';
        $scope.formData.document_path = '';
        $scope.showdoc = true;
        $scope.showdocumentlist = false;
        $scope.check_doc_readonly = false;
        $scope.list_folder_parent(1);
        var postUrl_code = $scope.$root.com + "document/doc_code";
        $http
             .post(postUrl_code, {
                 'token': $scope.$root.token,
                 'employee_id': $scope.row_id,
                 'module_id': $scope.module_id
             })
             .then(function (res) {
                 //  if (res.data.ack == true) {
                 $scope.formData.document_code = res.data.response.code;
                 // $scope.document_code = res.data.response.code;
                 //  console.log(res.data.response.code);
                 // }
             });
    }

    $scope.adddocument = function (formData) {

        $scope.formData.employee_id = $scope.row_id;
        $scope.formData.tab_id = $scope.tab_id;
        $scope.formData.token = $scope.$root.token;
        $scope.formData.tab_id_2 = 4;
        $scope.formData.module_id = $scope.module_id;
        $scope.formData.document_id = $scope.document_id;
        $scope.formData.folder_ids = $scope.formData.folder_id !== undefined ? $scope.formData.folder_id.id : 0;
        if ($scope.formData.folder_ids == -1 || $scope.formData.folder_ids == -11) {
            toaster.pop('error', 'Info', "Select Folder Name");
            return;
        }
        $scope.formData.fileName1 = $scope.formData_images_data;
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
        $scope.formData_images_data = [];
        $scope.showdoc = true;
        $scope.showdocumentlist = true; //false;

        $scope.check_doc_readonly = true;
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

                         //$scope.$root.$broadcast("multi_image2",res.data.response2);
                         $scope.formData_images_data = res.data.response2;
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
    $scope.formData_images_data = [];
    $scope.uploadConShow_defult = true;
//	 console.log($scope.uploadConShow_defult);

    $scope.showcomentbeforedoc = false;
// ------------- 	 Images 	 ----------------------------------------
    $scope.formData_images = {};
    $scope.showEditForm_document_general = function () {
        $scope.check_doc_readonly = false;
    }

    var postUrl_parent_img = $scope.$root.com + "document/image-folder";
    var postUrl_child_img = $scope.$root.com + "document/image-sub-folder";
    //--------------------     Folder  --------------------

    $scope.list_folder = [];
    $scope.list_folder.push({id: ' ', name: ' '});
    $scope.list_folder_parent_image = function (arg) {


        $http
             .post(postUrl_parent_img, postData_folder)
             .then(function (res) {


                 if (res.data.ack == true) {
                     if (arg == 1)
                         $scope.list_folder = res.data.response;
                     else if (arg == 2)
                         $scope.list_folder_sub = res.data.response;
                 }
                 else
                     toaster.pop('error', 'Info', "No Record  Found");
                 //	if ($scope.user_type == 1)
                 $scope.list_folder.push({'id': '-1', 'name': '++ Add New ++'});
                 // $scope.list_folder.push({'id': '-11', 'name': '++ Edit++'});


             });
    }

    $scope.onChange_folder_image = function () {

        var f_id = this.formData_images.folder_id.id;
        console.log(f_id);
        $scope.formData2.name = [];
        $scope.formData22 = [];
        $scope.list_folder_parent_image(2);
        if (f_id == -1) {
            $('#show_add_folder_image').modal({show: true});
            $scope.show_add_folder_image = true;
        }

        if (f_id == -11) {
            $('#show_edit_folder_image').modal({show: true});
            $scope.show_edit_folder_image = true;
        }
    }

    $scope.add_folder_image = function (formData2) {

        $scope.formData2.token = $scope.$root.token;
        $scope.formData2.module_id = $scope.module_id;
        $scope.formData2.folder_ids = $scope.formData2.folder_id !== undefined ? $scope.formData2.folder_id.id : 0;
        var submit_url = $scope.$root.com + "document/add-image-folder";
        $http
             .post(submit_url, $scope.formData2)
             .then(function (res) {
                 if (res.data.ack == true) {

                     var insert_id = res.data.id;
                     toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                     $('#show_add_folder_image').modal('hide');
                     $scope.list_folder_parent_image(1);
                     $scope.list_folder_parent_image(2);
                     $timeout(function () {
                         $.each($scope.list_folder, function (index, elem) {
                             if (elem.id == insert_id)
                                 $scope.formData_images.folder_id = obj;
                         });
                     }, 1000);
                 }
                 else
                     toaster.pop('error', 'Add', res.data.error);
             });
    };
    $scope.edit_folder_image = function (formData22) {

        $scope.formData22.token = $scope.$root.token;
        $scope.list_folder[0];
        $scope.formData22.folder_ids = $scope.formData22.folder_id !== undefined ? $scope.formData22.folder_id.id : 0;
        if ($scope.list_folder_sub[0].id == $scope.formData22.folder_ids) {
            toaster.pop('error', 'Info', "parent name can't be change");
            return;
        }

        var submit_url = $scope.$root.com + "document/edit-image-folder";
        $http
             .post(submit_url, $scope.formData22)
             .then(function (res) {
                 if (res.data.ack == true) {

                     toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(102));
                     $('#show_edit_folder_image').modal('hide');
                     $http
                          .post(postUrl_parent_img, postData_folder)
                          .then(function (res) {
                              $scope.list_folder = [];
                              $scope.list_folder.push({id: ' ', name: ' '});
                              if (res.data.ack == true)
                                  $scope.list_folder = res.data.response;
                              //if ($scope.user_type == 1)
                              $scope.list_folder.push({'id': '-1', 'name': '++ Add New ++'});
                              // $scope.list_folder.push({'id': '-11', 'name': '++ Edit++'});

                          });
                 }
                 else
                     toaster.pop('error', 'Deleted', res.data.error);
             });
    };
    $scope.get_image = function () {

        $scope.$root.breadcrumbs =
             [//{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
                 {'name': $scope.module, 'url': '#', 'isActive': false},
                 {'name': $scope.module_name, 'url': redirect, 'isActive': false},
                 {'name': $scope.module_code, 'url': '#', 'isActive': false},
                 {'name': 'Images', 'url': '#', 'isActive': false}];
        $scope.breadcrumbs[3].name = 'Images';
        $scope.show_image_list = true;
        $scope.show_image_form = false;
        var API = $scope.$root.com + "document/image-list";
        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'module_id': $scope.module_id,
            'row_id': $scope.row_id,
            'page': $scope.item_paging.spage,
            //'country_keyword': angular.element('#search_sale_listing_data').val()
        };
        $scope.showLoader = true;
        $http
             .post(API, $scope.postData)
             .then(function (res) {
                 $scope.imagelist = {};
                 $scope.imagecolumns = [];
                 if (res.data.ack == true) {

                     $scope.total = res.data.total;
                     $scope.item_paging.total_pages = res.data.total_pages;
                     $scope.item_paging.cpage = res.data.cpage;
                     $scope.item_paging.ppage = res.data.ppage;
                     $scope.item_paging.npage = res.data.npage;
                     $scope.item_paging.pages = res.data.pages;
                     //$scope.df = res.data.df;
                     //console.log(res.data.df);

                     $scope.imagelist = res.data.response;
                     angular.forEach(res.data.response[0], function (val, index) {
                         $scope.imagecolumns.push({
                             'title': toTitleCase(index),
                             'field': index,
                             'visible': true
                         });
                     });
                     $scope.showLoader = false;
                 }
                 else {
                     $scope.showLoader = false;
                     // toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                 }
             });
    }

    $scope.set_default_image = function (imgId, r_id, refImg) {

        var setUrl = $scope.$root.com + "document/set-default-image";
        $http
             .post(setUrl, {id: imgId, rid: r_id, rfImg: refImg, 'token': $scope.$root.token})
             .then(function (res) {
                 if (res.data.ack == true) {

                     toaster.pop('success', 'Update', $scope.$root.getErrorMessageByCode(102));
                     $scope.get_image();
                 } else {
                     toaster.pop('error', 'Update', $scope.$root.getErrorMessageByCode(106));
                 }
             });
    }

    $scope.fnImageForm = function () {
        // $scope.formData.fileName=[];var fileName=[];
        //$scope.$root.$broadcast("multi_image2",fileName);
        $scope.formData_images_data = [];
        $("#document_id").val('');
        $scope.formData_images = {};
        $scope.show_image_form = true;
        $scope.show_image_list = false;
        $scope.check_doc_readonly = false;
        /*$scope.perreadonly = true;
         $scope.check_hrvalues_readonly = false;
         */

        $scope.list_folder_parent_image(1);
        var postUrl_code = $scope.$root.com + "document/image-code";
        $http
             .post(postUrl_code, {'token': $scope.$root.token, 'row_id': $scope.row_id, 'module_id': $scope.module_id})
             .then(function (res) {
                 //  if (res.data.ack == true) {
                 $scope.formData_images.document_code = res.data.response.code;
                 //  console.log(res.data.response.code);
                 // }
             });
    }

    $scope.add_image = function (formData_images) {

        $scope.formData_images.row_id = $scope.row_id;
        $scope.formData_images.token = $scope.$root.token;
        $scope.formData_images.module_id = $scope.module_id;
        $scope.formData_images.document_id = $scope.document_id;
        $scope.formData_images.folder_ids = $scope.formData_images.folder_id !== undefined ? $scope.formData_images.folder_id.id : 0;
        if ($scope.formData_images.folder_ids == -1 || $scope.formData_images.folder_ids == -11) {
            toaster.pop('error', 'Info', "Select Folder Name");
            return;
        }

        $scope.formData_images.fileName1 = $scope.formData_images_data;
        var updatedoc = $scope.$root.com + "document/update-image";
        $http
             .post(updatedoc, $scope.formData_images)
             .then(function (res) {
                 if (res.data.ack == true) {
                     toaster.pop('success', res.data.info, res.data.msg);
                     $timeout(function () {
                         $scope.get_image();
                     }, 1000);
                 } else
                     toaster.pop('error', 'Info', res.data.error);
             });
    }

    $scope.display_error = true;
    $scope.showImageEditForm = function (id) {
        //$scope.formData.fileName=[];var fileName=[];
        //$scope.$root.$broadcast("multi_image2",fileName);
        $scope.formData_images = {};
        $scope.formData_images_data = {};
        $scope.show_image_form = true;
        $scope.show_image_list = false;
        $scope.check_doc_readonly = true;
        $scope.list_folder_parent_image(1);
        var getxUrl = $scope.$root.com + "document/image-by-id";
        var postViewData = {
            'token': $scope.$root.token,
            'id': id
        };
        $scope.showLoader = true;
        $timeout(function () {
            $http
                 .post(getxUrl, postViewData)
                 .then(function (res) {
                     if (res.data.ack == true) {
                         $scope.display_error = false;
                         // $scope.formData_images.document_path = res.data.response.name;
                         // $scope.formData_images.FileType = res.data.response.FileType;

                         $.each($scope.list_folder, function (index, obj) {
                             if (obj.id == res.data.response.folder_id)
                                 $scope.formData_images.folder_id = obj;
                         });
                         // $scope.formData_images = res.data.response;
                         $scope.formData_images.id = res.data.response.id;
                         $scope.formData_images.document_title = res.data.response.title;
                         $scope.formData_images.document_code = res.data.response.document_code;
                         //$scope.$root.$broadcast("multi_image2",res.data.response2);

                         $scope.formData_images_data = res.data.response2;
                         $scope.formData.document_path = 1;
                     }
                 });
            $scope.showLoader = false;
        }, 1000);
    }

    $scope.deleteImage = function (id, index, arr_data) {

        var delUrl = $scope.$root.com + "document/delete-image";
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
    // ------------- 	 Comments 	 ----------------------------
    $scope.coment_data = {};
    $scope.coment_data.checkTitle = false;
    $scope.showWordsLimits = function () {
        $scope.wordsLength = $scope.coment_data.description.length;
    }
    $scope.getComments = function () {
        $scope.coment_data.checkTitle = false;
        $scope.wordsLength = 0;
        $scope.coment_data = {};
        $scope.$root.breadcrumbs =
             [//{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
                 {'name': $scope.module, 'url': '#', 'isActive': false},
                 {'name': $scope.module_name, 'url': redirect, 'isActive': false},
                 {'name': $scope.module_code, 'url': '#', 'isActive': false},
                 {'name': 'Comments', 'url': '#', 'isActive': false}];
        $scope.breadcrumbs[3].name = 'Comments';
        $scope.show_coments_list = true;
        $scope.show_coments_form = false;
        $scope.perreadonly = true;
        $scope.coment_data.create_date = $scope.$root.get_current_date();
        var API = $scope.$root.com + "document/comments-listings";
        var postData = {
            'token': $scope.$root.token,
            'row_id': $scope.row_id,
            'module_id': $scope.module_id,
            'sub_type': $scope.sub_type,
            'page': $scope.item_paging.spage,
            //'country_keyword': angular.element('#search_sale_listing_data').val()
        };
        $scope.showLoader = true;
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
                 else {
                     $scope.showLoader = false; // toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                 }
             });
    }

    $scope.showEditFormComent = function (id) {
        $scope.coment_data.checkTitle = true;
        $scope.show_coments_list = false;
        $scope.show_coments_form = true;
        $scope.check_doc_readonly = true;
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

    $scope.addcomment = function (coment_data) {

        $scope.coment_data.row_id = $scope.row_id;
        $scope.coment_data.module_id = $scope.module_id;
        $scope.coment_data.type = 1;
        $scope.coment_data.sub_type = $scope.sub_type;
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
        $scope.check_doc_readonly = false;
    }




}
