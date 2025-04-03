myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
<<<<<<< HEAD
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
=======
    function($stateProvider, $locationProvider, $urlRouterProvider, helper) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $stateProvider
            .state('app.supplier', {
                url: '/supplier/:filter_id',
                title: 'Purchases',
                templateUrl: helper.basepath('supplier/supplier.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.add-supplier', {
                url: '/supplier/add',
                title: 'Purchases',
                templateUrl: helper.basepath('addTabs.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'SupplierEditController'
            })
            .state('app.view-supplier', {
                url: '/supplier/:id/view',
                title: 'Purchases',
                templateUrl: helper.basepath('addTabs.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'SupplierEditController'
            })
            .state('app.edit-supplier', {
                url: '/supplier/:id/edit?isPriceOffer',
                title: 'Purchases',
                templateUrl: helper.basepath('addTabs.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog', 'event-calendar', 'smart-search'),
                controller: 'SupplierEditController'
            })

<<<<<<< HEAD
    }]);

SupplierSrmController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService",
    "$http", "ngDialog", "toaster", "$rootScope", "$state", "moduleTracker"];
myApp.controller('SupplierSrmController', SupplierSrmController);
=======
    }
]);

SupplierSrmController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService",
    "$http", "ngDialog", "toaster", "$rootScope", "$state", "moduleTracker"
];
myApp.controller('SupplierSrmController', SupplierSrmController);

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
function SupplierSrmController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $rootScope, $state, moduleTracker) {
    'use strict';

    moduleTracker.updateName("supplier");
    moduleTracker.updateRecord("");

    $scope.$root.breadcrumbs = [{ 'name': 'Purchases', 'url': '#', 'isActive': false }, { 'name': 'Suppliers', 'url': '#', 'isActive': false }];

    var vm = this;
    var Api = $scope.$root.pr + "supplier/supplier/listings";
    $scope.postData = {};

    $scope.postData = {
        'token': $scope.$root.token,
        'all': "1"
    };
    $scope.searchKeyword = {};

<<<<<<< HEAD
    $scope.getsrm_list = function (item_paging, sort_column, sortform) {
=======
    $scope.getsrm_list = function(item_paging, sort_column, sortform) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.postData = {};
        $scope.postData.token = $scope.$root.token

        if (item_paging == 1)
            $scope.item_paging.spage = 1

        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.searchKeyword = $scope.searchKeyword;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
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

        $scope.showLoader = true;
        $http
            .post(Api, $scope.postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.tableData = res;
                $scope.columns = [];
                $scope.record_data = {};
                if (res.data.ack == true) {
                    //console.log(res.data);
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.record_data = res.data.response;
<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (index != 'chk' && index != 'id') {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }
                    });
                }
                $scope.showLoader = false;
            });
    }

    var col = '';
    col = $rootScope.get_single_value('srmsort_name');
    // $scope.getsrm_list(1, col, 'Desc');
    $scope.$root.itemselectPage(1);
}

<<<<<<< HEAD
myApp.controller('SupplierEditController', SupplierEditController);// $window, 
=======
myApp.controller('SupplierEditController', SupplierEditController); // $window, 
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
function SupplierEditController($scope, $filter, $resource, $timeout, $http, ngDialog, toaster, $stateParams, $state, $rootScope, moduleTracker) {
    'use strict';

    moduleTracker.updateName("supplier");
    moduleTracker.updateRecord($stateParams.id);


    $scope.addPriceTabPermission = $rootScope.allowadd_supplier_price_tab;
    $scope.editPriceTabPermission = $rootScope.allowedit_supplier_price_tab;
    $scope.viewPriceTabPermission = $rootScope.allowview_supplier_price_tab;
    $scope.deletePriceTabPermission = $rootScope.allowdelete_supplier_price_tab;
    $scope.convertPriceTabPermission = $rootScope.allowconvert_supplier_price_tab;


    $scope.addContactPermission = $rootScope.allowadd_supplier_contact_tab;
    $scope.editContactPermission = $rootScope.allowedit_supplier_contact_tab;
    $scope.viewContactPermission = $rootScope.allowview_supplier_contact_tab;
    $scope.deleteContactPermission = $rootScope.allowdelete_supplier_contact_tab;

    $scope.addLocationPermission = $rootScope.allowadd_supplier_location_tab;
    $scope.editLocationPermission = $rootScope.allowedit_supplier_location_tab;
    $scope.viewLocationPermission = $rootScope.allowview_supplier_location_tab;
    $scope.deleteLocationPermission = $rootScope.allowdelete_supplier_location_tab;

    $scope.addHaulierTabPermission = $rootScope.allowadd_supplier_haulier_tab;
    $scope.editHaulierTabPermission = $rootScope.allowedit_supplier_haulier_tab;
    $scope.viewHaulierTabPermission = $rootScope.allowview_supplier_haulier_tab;
    $scope.deleteHaulierTabPermission = $rootScope.allowdelete_supplier_haulier_tab;

    // reload Setup global data
    $rootScope.get_global_data(1);

    if ($stateParams.id > 0) {
        $scope.check_srm_readonly = true;
    }

<<<<<<< HEAD
    $scope.showEditForm = function () {
=======
    $scope.showEditForm = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.check_srm_readonly = false;
    }

    $scope.offeredByColumnsShow = [
        "name", "job_title", "Department"
    ]

<<<<<<< HEAD
    $scope.formUrl = function () {
=======
    $scope.formUrl = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        return "app/views/supplier/_form.html";
    }

    if ($stateParams.isPriceOffer != undefined)
        $scope.isPriceOffer = 1;
    else
        $scope.isPriceOffer = 0;

    var vm = this;
    $scope.class = 'block';

    $scope.rec = {};
    $scope.drp = {};
    $scope.crm_no = '';
    var crm_name = '';
    $scope.customer_no = '';
    var id = $stateParams.id;
    $scope.$root.srm_id = id;
    $scope.$root.supplier_id = id;

    $scope.recnew = {};
    $scope.recnew.supplier_id = 0;

    if ($stateParams.id !== undefined)
        $scope.recnew.supplier_id = id;
    var table = 'srm';

    $scope.socialMediasGeneral = {};
    $scope.socialMediasContactGeneral = {};
    $scope.socialMediasContactArr = {};
    $scope.tempSocialMedia = [];


    $rootScope.social_medias_general_form = [];
    $rootScope.social_medias_contact_form = [];
<<<<<<< HEAD
   
    var refreshId = setInterval(function () {
        if (($rootScope.social_medias != undefined && $rootScope.social_medias.length > 0)) {
            angular.copy($rootScope.social_medias, $rootScope.social_medias_general_form);
            angular.copy($rootScope.social_medias, $rootScope.social_medias_contact_form);        
            clearInterval(refreshId);
        }
    }, 500);
    
=======

    var refreshId = setInterval(function() {
        if (($rootScope.social_medias != undefined && $rootScope.social_medias.length > 0)) {
            angular.copy($rootScope.social_medias, $rootScope.social_medias_general_form);
            angular.copy($rootScope.social_medias, $rootScope.social_medias_contact_form);
            clearInterval(refreshId);
        }
    }, 500);

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    $scope.qty = 5;
    $scope.defaultOption = 2;
    $scope.shiping_list = [];
    $scope.shiping_list = [];
    $scope.price_method_list = [];
    $scope.formData_vol_1 = {};
    $scope.formData_vol_2 = {};
    $scope.formData_vol_3 = {};
    $scope.formData6 = {};
    $scope.columns = [];
    $scope.record = {};
    $scope.formData_customer = {};
    $scope.selected = 0;
    $scope.total = 0;
    $scope.selected_count = 0;
    $scope.bill_to_customer = "";

<<<<<<< HEAD
    $scope.delete = function () {
=======
    $scope.delete = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if ($stateParams.id == undefined)
            var recid = $scope.rec.srm_id;
        else
            var recid = $stateParams.id;

        var delUrl = $scope.$root.pr + "supplier/supplier/delete-supplier";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
        }).then(function (value) {
            $http
                .post(delUrl, { id: recid, 'token': $scope.$root.token })
                .then(function (res) {
=======
        }).then(function(value) {
            $http
                .post(delUrl, { id: recid, 'token': $scope.$root.token })
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $state.go('app.supplier');
                    } else {
                        toaster.pop('error', 'Error', res.data.error);
                    }
                });
<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };

<<<<<<< HEAD
    $scope.showEditfinanceForm = function () {
        $scope.check_srm_finance_readonly = false;
    }

    $scope.set_link = function () {
=======
    $scope.showEditfinanceForm = function() {
        $scope.check_srm_finance_readonly = false;
    }

    $scope.set_link = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if ($scope.rec.web_address != undefined && $scope.rec.web_address.length > 0)
            $scope.rec.web_address = ($scope.rec.web_address.indexOf('://') === -1) ? 'http://' + $scope.rec.web_address : $scope.rec.web_address;
    }

<<<<<<< HEAD
    $scope.get_empl_list = function (arg) {
=======
    $scope.get_empl_list = function(arg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // console.log(arg);
        $scope.showLoader = true;
        $scope.columns_pr = [];
        $scope.record_pr = {};
        $scope.searchKeyword_offered = {};
        $scope.title = 'Recieved By';
        $scope.empListType = 'general';

        if (arg == 'purchaser_code') {
            $scope.title = 'Employee List';
            $scope.empListType = 'purchaser_code';
        }

        var empUrl = $scope.$root.hr + "employee/listings";

        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'limit': 9999
        };

        $http
            .post(empUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    $scope.columns_pr = [];
                    $scope.record_pr = {};
                    $scope.record_pr = res.data.response;


<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columns_pr.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.element('#_SrmEmplisting_model').modal({
                        show: true
                    });
                    return;
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });
    }

<<<<<<< HEAD
    $scope.confirm_employeeList = function (result, emptype) {
=======

    $scope.getGLcode = function() {

        var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";
        $scope.postData = {};
        $scope.title = 'G/L Accounts';
        $scope.postData.token = $scope.$root.token;
        $scope.searchKeyword2 = {};

        $scope.type_id = 2;

        $scope.showLoader = true;
        $scope.showAllOption = true;

        $http
            .post(postUrl_cat, $scope.postData)
            .then(function(res) {
                $scope.gl_account = [];
                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.gl_account = res.data.response;
                    angular.element('#finance_set_gl_account').modal({ show: true });
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });
    }

    $scope.confirm_employeeList = function(result, emptype) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (emptype == 'general') {
            $scope.PriceOffer_rec.recieved_by = result.name;
            $scope.PriceOffer_rec.recieved_by_id = result.id;
        } else if (emptype == 'purchaser_code') {

            $scope.rec.purchaser_code = result.name;
            $scope.rec.purchaser_code_id = result.id;
        }
        angular.element('#_SrmEmplisting_model').modal('hide');
    }

    $scope.history_salespersons = {};
    $scope.columns_history = [];
    $scope.history_title = "";
    $scope.history_type = "";
<<<<<<< HEAD
    $scope.historytype = function (type) {
=======
    $scope.historytype = function(type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.history_type = type;
        var Url = $scope.$root.pr + "srm/srm/srm-history";

        if (type == "Salespersons") {
            $scope.history_title = "Salesperson History";
<<<<<<< HEAD
        }
        else if (type == "CreditLimit") {
            $scope.history_title = "Credit Limit History";
        }
        else if (type == "Status") {
=======
        } else if (type == "CreditLimit") {
            $scope.history_title = "Credit Limit History";
        } else if (type == "Status") {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.history_title = "Status History";
        }

        var postData = {
            'token': $scope.$root.token,
            'srm_id': $scope.$root.srm_id, // $stateParams.id
            'type': type
        };
        $http
            .post(Url, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (res.data.ack == true) {
                    $scope.crm_history = {};
                    $scope.columns_history = [];
                    $scope.crm_history = res.data.response;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columns_history.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    $('#history_modal').modal({ show: true });
<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                    $scope.crm_history = {};
                }
            });
    };

    $scope.drp = [];
<<<<<<< HEAD
    $scope.status_list = [];

    $rootScope.get_status_list('supplier_status');

    if ($scope.status_list === 'undefined' || $scope.status_list === null || $scope.status_list.length == 0)
        $scope.status_list = $rootScope.status_list;

    // get assigned location listings assigned to primary contact.
    $scope.getGenAssinLoc = function (primaryContID) {
=======

    $scope.status_list = [{
        'id': '1',
        'title': 'Active'
    }, {
        'id': '0',
        'title': 'Inactive'
    }];

    /* 
    $scope.status_list = [];
    $rootScope.get_status_list('supplier_status');

    if ($scope.status_list === 'undefined' || $scope.status_list === null || $scope.status_list.length == 0)
        $scope.status_list = $rootScope.status_list; */

    // get assigned location listings assigned to primary contact.
    $scope.getGenAssinLoc = function(primaryContID) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

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
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.loc_columns = [];
                $scope.locationRecord = {};

                if (res.data.ack == true) {
                    $scope.locationRecord = res.data.response;

<<<<<<< HEAD
                    angular.forEach($scope.locationRecord[0], function (val, index) {
=======
                    angular.forEach($scope.locationRecord[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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
            });
    }

<<<<<<< HEAD
    $scope.addNewPredefinedPopup = function (drpdown, type, title, drp) {
=======
    $scope.addNewPredefinedPopup = function(drpdown, type, title, drp) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.isBtnPredefined = true;
        var sel_id = drpdown[0].id;

        if (sel_id > 0)
            return false;

        if (drpdown.id > 0)
            return false;

        $scope.popup_title = title;
        $scope.pedefined = {};

        ngDialog.openConfirm({
            template: 'app/views/crm/add_predefined.html',
            className: 'ngdialog-theme-default-custom-large',
            scope: $scope
<<<<<<< HEAD
        }).then(function (pedefined) {
=======
        }).then(function(pedefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            var types = type;
            pedefined.token = $scope.$root.token;

            if (type == 'STATUS') {
                types = 2;
                pedefined.name = pedefined.title;
            }
            pedefined.type = types;
            pedefined.status = 1;

            var postUrl = $scope.$root.setup + "ledger-group/add-predefine";
            if (type == 'PREFER_METHOD')
                var postUrl = $scope.$root.pr + "srm/srm/add-pref-method-of-comm";
            if (type == 'STATUS')
                var postUrl = $scope.$root.stock + "product-status/add-status-list";

            if ((pedefined.title == undefined)) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Name']));
                return;
            }

            $http
                .post(postUrl, pedefined)
<<<<<<< HEAD
                .then(function (ress) {
=======
                .then(function(ress) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (ress.data.ack == true) {
                        var sid = ress.data.id;
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        var getUrl = $scope.$root.setup + "ledger-group/get-predefine-by-type";

                        if (type == 'PREFER_METHOD')
                            var getUrl = $scope.$root.pr + "srm/srm/get-all-pref-method-of-comm";
                        if (type == 'STATUS')
                            var getUrl = $scope.$root.stock + "product-status/get-status";

                        $http
                            .post(getUrl, { 'token': $scope.$root.token, type: types })
<<<<<<< HEAD
                            .then(function (res) {
=======
                            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (res.data.ack == true) {

                                    if (type == 'PREFER_METHOD') {
                                        $scope.arr_pref_method_comm = res.data.response;
<<<<<<< HEAD
                                        angular.forEach($scope.arr_pref_method_comm, function (elem) {
=======
                                        angular.forEach($scope.arr_pref_method_comm, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            if (elem.id == sid)
                                                drp.pref_mthod_of_comm = elem;
                                        });

                                        if ($scope.user_type == 1)
                                            $scope.arr_pref_method_comm.push({ 'id': '-1', 'title': '++ Add New ++' });
                                    }

                                    if (type == 'STATUS') {
                                        $scope.status_list = res.data.response;
<<<<<<< HEAD
                                        angular.forEach($scope.status_list, function (elem) {
=======
                                        angular.forEach($scope.status_list, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            if (elem.id == sid)
                                                drp.status_ids = elem;
                                        });
                                        //    if ($scope.user_type == 1)    $scope.status_list.push({'id': '-1', 'title': '++ Add New ++'});
                                    }

                                    if (type == 'SEGMENT') {
                                        $scope.arr_segment = res.data.response;

<<<<<<< HEAD
                                        angular.forEach($scope.arr_segment, function (elem) {
=======
                                        angular.forEach($scope.arr_segment, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            if (elem.id == sid)
                                                drp.company_type_id = elem;
                                        });

                                        if ($scope.user_type == 1)
                                            $scope.arr_segment.push({ 'id': '-1', 'name': '++ Add New ++' });
                                    }
                                    if (type == 'BUYING_GROUP') {
                                        $scope.arr_buying_group = res.data.response;

<<<<<<< HEAD
                                        angular.forEach($scope.arr_buying_group, function (elem) {
=======
                                        angular.forEach($scope.arr_buying_group, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            if (elem.id == sid)
                                                drp.buying_grp_id = elem;
                                        });
                                        if ($scope.user_type == 1)
                                            $scope.arr_buying_group.push({ 'id': '-1', 'name': '++ Add New ++' });

                                    }
                                }
                            });
<<<<<<< HEAD
                    }
                    else
                        toaster.pop('error', 'Info', ress.data.error);
                });

        }, function (reason) {
=======
                    } else
                        toaster.pop('error', 'Info', ress.data.error);
                });

        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    /*  //add currency
     $scope.addNewCurrencyPopup = function (drp) {
         var id = drp.currency != undefined ? drp.currency.id : 0;
         if (id > 0)
             return false;
 
         //	$scope.fnDatePicker();
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
                             .post(currencyUrl, { 'company_id': $scope.$root.defaultCompany, 'token': $scope.$root.token })
                             .then(function (res1) {
                                 if (res1.data.ack == true) {
                                     $rootScope.arr_currency = res1.data.response;
                                     angular.forEach($rootScope.arr_currency, function (elem) {
                                         if (elem.id == res.data.id)
                                             drp.currency = elem;
                                     });
                                 }
                             });
                     } else if (res.data.ack == false) {
                         toaster.pop('error', 'Info', res.data.msg);
                     } else
                         toaster.pop('error', 'Info', res.data.msg);
 
                 });
 
         }, function (reason) {
             console.log('Modal promise rejected. Reason: ', reason);
         });
     } */
    //--------------------- start General   ------------------------------------------

<<<<<<< HEAD
    $scope.generate_unique_id = function () {
=======
    $scope.generate_unique_id = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.moduleCodeType = 1;

        if ($stateParams.id === undefined) {
            var getUrl = $scope.$root.pr + "supplier/supplier/get-unique-id";

            $http
                .post(getUrl, { 'token': $scope.$root.token })
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    if (res.data.ack == 1) {

                        $scope.rec.unique_id = res.data.unique_id;
                        $scope.rec.id = res.data.id;
                        $scope.$root.srm_id = res.data.id;
                        $scope.moduleCodeType = res.data.moduleCodeType;

                        $scope.rec.is_billing_address = 1;
                        $scope.rec.is_delivery_collection_address = 1;
                        $scope.rec.is_invoice_address = 1;

                        $scope.rec.anonymous_supplier = 0;

                        // $scope.rec.purchaser_code = $rootScope.defaultUserName;
                        // $scope.rec.purchaser_code_id = $rootScope.userId;

<<<<<<< HEAD
                        angular.forEach($rootScope.country_type_arr, function (elem) {
=======
                        angular.forEach($rootScope.country_type_arr, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (elem.id == $scope.$root.defaultCountry)
                                $scope.drp.country_id = elem;
                        });

<<<<<<< HEAD
                        angular.forEach($rootScope.arr_currency, function (elem) {
=======
                        angular.forEach($rootScope.arr_currency, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (elem.id == $scope.$root.defaultCurrency)
                                $scope.drp.currency = elem;
                        });

                        $scope.drp.country_id = $scope.$root.get_obj_frm_arry($scope.$root.country_type_arr, $scope.$root.defaultCountry);

                        $scope.drp.status_ids = $scope.status_list[0];
                        //  toaster.pop('success', 'info', res.data.error);   
<<<<<<< HEAD
                    }
                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        toaster.pop('error', 'info', res.data.error);
                        return false;
                    }
                });
        }
    }

    if ($stateParams.id === undefined)
        $scope.generate_unique_id();

    $scope.product_type = true;
    $scope.count_result = 0;

    $scope.$root.breadcrumbs = [{ 'name': 'Purchases', 'url': '#', 'isActive': false }, { 'name': 'Suppliers', 'url': 'app.supplier', 'isActive': false }];


<<<<<<< HEAD
    $scope.show_status_date = function (status_sel) {
=======
    $scope.show_status_date = function(status_sel) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if (status_sel.name != "Active")
            $scope.status_change_date = 1;
        else
            $scope.status_change_date = 0;
    }

    $scope.$root.model_code = "";
    $scope.last_po_date = '';

<<<<<<< HEAD
    $scope.getSupplierDataByID = function () {
=======
    $scope.getSupplierDataByID = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.showLoader = true;
        $scope.moduleCodeType = 1;

        var DetailsURL = $scope.$root.pr + "srm/srm/get-srm";
        $http
<<<<<<< HEAD
            .post(DetailsURL, { 'token': $scope.$root.token, 'id': $stateParams.id, 'type': 'Supplier','defaultCurrency':$scope.$root.defaultCurrency })
            .then(function (res) {
=======
            .post(DetailsURL, { 'token': $scope.$root.token, 'id': $stateParams.id, 'type': 'Supplier', 'defaultCurrency': $scope.$root.defaultCurrency })
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    moduleTracker.updateRecordName(res.data.response.name);
                    $scope.rec = res.data.response;
                    $scope.moduleCodeType = res.data.moduleCodeType;

                    $scope.check_srm_readonly = true;
                    $scope.rec.id = res.data.response.id;
                    $scope.$root.bdname = res.data.response.name;
                    $scope.rec.old_status = res.data.response.status;
                    $scope.rec.old_contact = res.data.response.contact_person;
                    $scope.rec.old_location = res.data.response.address_1;
                    $scope.module_code = res.data.response.name;
                    $scope.rec.supplier_no = res.data.response.supplier_no;
                    $scope.rec.supplier_code = res.data.response.supplier_code;

                    $scope.supplier_balance = res.data.response.supplier_balance;
                    $scope.balanceInSupplierCurrency = res.data.response.balanceInSupplierCurrency;
                    $scope.supplierCurrencyCode = res.data.response.currency;

                    $scope.last_po_date = res.data.response.lastPODate;
                    $scope.rec.purchaser_code_id = res.data.response.salesperson_id;

                    $scope.$root.model_code = res.data.response.name + ' ( ' + res.data.response.supplier_code + ' )';

                    if ($scope.rec.anonymous_supplier == 1)
                        $scope.rec.anonymous_supplier1 = true;
                    else
                        $scope.rec.anonymous_supplier1 = false;

                    // $scope.$root.breadcrumbs[3].name = 'General';
                    if ($scope.$root.breadcrumbs.length == 2) {
                        $scope.$root.breadcrumbs.push({ 'name': $scope.$root.model_code, 'url': '#', 'isActive': false });
                    }

                    //console.log("here");
                    //$scope.get_mail_module_id =$stateParams.id;
                    //	$scope.get_mail_module_code =res.data.response.supplier_code;

                    $scope.status_list = [{
                        'id': '1',
                        'title': 'Active'
                    }, {
                        'id': '0',
                        'title': 'Inactive'
                    }];

                    $scope.new_list = true;
                    $scope.save_list = false;

<<<<<<< HEAD
                    angular.forEach($scope.arr_pref_method_comm, function (obj) {
=======
                    angular.forEach($scope.arr_pref_method_comm, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (obj.id == res.data.response.primaryc_pref_method_of_communication)
                            $scope.drp.pref_mthod_of_comm = obj;
                    });

<<<<<<< HEAD
                    angular.forEach($scope.status_list, function (obj) {
=======
                    angular.forEach($scope.status_list, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (obj.id == res.data.response.status)
                            $scope.drp.status_ids = obj;
                    });

<<<<<<< HEAD
                    angular.forEach($rootScope.country_type_arr, function (elem) {
=======
                    angular.forEach($rootScope.country_type_arr, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (elem.id == res.data.response.country_id)
                            $scope.drp.country_id = elem;
                    });

<<<<<<< HEAD
                    angular.forEach($scope.arr_supplier_classification, function (elem) {
=======
                    angular.forEach($scope.arr_supplier_classification, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (elem.id == res.data.response.supplier_classification)
                            $scope.drp.srm_classification = elem;
                    });

                    /* angular.forEach($scope.arr_srm_classification, function (elem) {
                        if (elem.id == res.data.response.srm_classification)
                            $scope.drp.srm_classification = elem;
                    }); */

<<<<<<< HEAD
                    angular.forEach($rootScope.arr_currency, function (elem) {
=======
                    angular.forEach($rootScope.arr_currency, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (elem.id == res.data.response.currency_id) {
                            $scope.drp.currency = elem;
                            $scope.$root.customerCurrencyCode = elem.name;
                            $scope.drp.currency = elem;
                        }
                    });

                    if ($scope.rec.currency_id) {
                        $rootScope.supp_current_edit_currency = $scope.$root.get_obj_frm_arry($rootScope.arr_currency, $scope.rec.currency_id);
                    } else {
                        $rootScope.supp_current_edit_currency = $scope.$root.defaultCurrency;
                    }

                    if (res.data.response.status_date == 0) {
                        res.data.response.status_date = null;
                        $scope.status_change_date = 0;
<<<<<<< HEAD
                    }
                    else {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.rec.status_date = $scope.$root.convert_unix_date_to_angular(res.data.response.status_date);
                        $scope.status_change_date = 1;
                    }

                    $scope.tempSocialMedia = [];
<<<<<<< HEAD
                    angular.forEach($rootScope.social_medias_general_form, function (obj) {
=======
                    angular.forEach($rootScope.social_medias_general_form, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                        if (obj.id == res.data.response.socialmedia1 && res.data.response.socialmedia1 != 0) {
                            obj.value = res.data.response.socialmedia1_value;
                            $scope.tempSocialMedia.push(obj);
                        }
                        if (obj.id == res.data.response.socialmedia2 && res.data.response.socialmedia2 != 0) {
                            obj.value = res.data.response.socialmedia2_value;
                            $scope.tempSocialMedia.push(obj);
                        }
                        if (obj.id == res.data.response.socialmedia3 && res.data.response.socialmedia3 != 0) {
                            obj.value = res.data.response.socialmedia3_value;
                            $scope.tempSocialMedia.push(obj);
                        }
                        if (obj.id == res.data.response.socialmedia4 && res.data.response.socialmedia4 != 0) {
                            obj.value = res.data.response.socialmedia4_value;
                            $scope.tempSocialMedia.push(obj);
                        }
                        if (obj.id == res.data.response.socialmedia5 && res.data.response.socialmedia5 != 0) {
                            obj.value = res.data.response.socialmedia5_value;
                            $scope.tempSocialMedia.push(obj);
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
                        $scope.socialMediasGeneral['supplierSM'] = $scope.tempSocialMedia;
                    }


                    if ($scope.rec.segment_id != undefined && $rootScope.segment_supplier_arr != undefined)
                        $scope.drp.segment_id = $scope.$root.get_obj_frm_arry($rootScope.segment_supplier_arr, $scope.rec.segment_id);

                    if ($scope.rec.selling_grp_id != undefined && $rootScope.selling_group_arr != undefined)
                        $scope.drp.selling_grp_id = $scope.$root.get_obj_frm_arry($rootScope.selling_group_arr, $scope.rec.selling_grp_id);

                    if ($scope.rec.region_id != undefined && $rootScope.region_supplier_arr != undefined)
                        $scope.drp.region_id = $scope.$root.get_obj_frm_arry($rootScope.region_supplier_arr, $scope.rec.region_id);

                    $scope.getAltContact_genral($scope.rec, 1);
                    $scope.getAltLocationfrmGeneral($scope.rec, 1);

                }
                $scope.showLoader = false;
            });

    }

    if ($stateParams.id !== undefined)
        $scope.getSupplierDataByID();

    // sync location primary record with general start
<<<<<<< HEAD
    $scope.getAltLocationfrmGeneral = function (arr, type) {
=======
    $scope.getAltLocationfrmGeneral = function(arr, type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (type != undefined) {
            if (arr) {

                $scope.rec.address_1 = $scope.rec.primary_address_1;
                $scope.rec.address_2 = $scope.rec.primary_address_2;
                $scope.rec.city = $scope.rec.primary_city;
                $scope.rec.county = $scope.rec.primary_county;
                $scope.rec.postcode = $scope.rec.primary_postcode;
                $scope.rec.alt_loc_id = $scope.rec.primary_id;

                if ($scope.rec.primary_country != undefined && $rootScope.country_type_arr != undefined)
                    $scope.drp.country_id = $scope.$root.get_obj_frm_arry($rootScope.country_type_arr, $scope.rec.primary_country);


<<<<<<< HEAD
                if ($scope.rec.primary_is_billing_address == 1){
                    // angular.element('#genis_billing_address').checked = true;
                    // document.getElementById("genis_billing_address").checked = true;
                    $scope.rec.is_billing_address = true;
                }                    
                else{
=======
                if ($scope.rec.primary_is_billing_address == 1) {
                    // angular.element('#genis_billing_address').checked = true;
                    // document.getElementById("genis_billing_address").checked = true;
                    $scope.rec.is_billing_address = true;
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    // angular.element('#genis_billing_address').checked = false;
                    // document.getElementById("genis_billing_address").checked = false;
                    $scope.rec.is_billing_address = false;
                }

<<<<<<< HEAD
                if ($scope.rec.primary_is_invoice_address == 1){
                    // angular.element("#genis_invoice_address").checked = true;
                    // document.getElementById("genis_invoice_address").checked = true;                    
                    $scope.rec.is_invoice_address = true;
                }
                else{
=======
                if ($scope.rec.primary_is_invoice_address == 1) {
                    // angular.element("#genis_invoice_address").checked = true;
                    // document.getElementById("genis_invoice_address").checked = true;                    
                    $scope.rec.is_invoice_address = true;
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    // angular.element("#genis_invoice_address").checked = false;
                    // document.getElementById("genis_invoice_address").checked = false;   
                    $scope.rec.is_invoice_address = false;
                }

<<<<<<< HEAD
                if ($scope.rec.primary_is_delivery_collection_address == 1){
                    // angular.element("#genis_delivery_collection_address").checked = true;
                    // document.getElementById("genis_delivery_collection_address").checked = true;   
                    $scope.rec.is_delivery_collection_address = true;
                }
                else{
=======
                if ($scope.rec.primary_is_delivery_collection_address == 1) {
                    // angular.element("#genis_delivery_collection_address").checked = true;
                    // document.getElementById("genis_delivery_collection_address").checked = true;   
                    $scope.rec.is_delivery_collection_address = true;
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    // angular.element("#genis_delivery_collection_address").checked = false;
                    // document.getElementById("genis_delivery_collection_address").checked = false;   
                    $scope.rec.is_delivery_collection_address = false;
                }

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

<<<<<<< HEAD
                angular.forEach($rootScope.country_type_arr, function (elem) {
=======
                angular.forEach($rootScope.country_type_arr, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (elem.id == $scope.$root.defaultCountry)
                        $scope.drp.country_id = elem;
                });
            }
        } else {

            $scope.postData = {
                'acc_id': $scope.$root.srm_id,
                'module_type': 2,
                'token': $scope.$root.token,
                'is_primary': 1
            }
            var ApiAjax = $scope.$root.pr + "srm/srm/alt-depots";
            $http
                .post(ApiAjax, $scope.postData)
<<<<<<< HEAD
                .then(function (alt_res) {
=======
                .then(function(alt_res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (alt_res.data.record.ack == true) {

                        $scope.rec.address_1 = alt_res.data.record.result[0].address_1;
                        $scope.rec.address_2 = alt_res.data.record.result[0].address_2;
                        $scope.rec.city = alt_res.data.record.result[0].city;
                        $scope.rec.county = alt_res.data.record.result[0].county;
                        $scope.rec.postcode = alt_res.data.record.result[0].postcode;
                        $scope.rec.alt_loc_id = alt_res.data.record.result[0].id;

                        if ($scope.rec.country_id != undefined && $rootScope.country_type_arr != undefined)
                            $scope.drp.country_id = $scope.$root.get_obj_frm_arry($rootScope.country_type_arr, alt_res.data.record.result[0].country);

                        //  $scope.get_alt_contact_social_media_list($scope.rec.alt_contact_id);

                        if (alt_res.data.record.result[0].is_billing_address == 1)
                            $scope.rec.is_billing_address = 1;
                        else
                            $scope.rec.is_billing_address = 0;

                        if (alt_res.data.record.result[0].is_delivery_collection_address == 1)
                            $scope.rec.is_delivery_collection_address = 1;
                        else
                            $scope.rec.is_delivery_collection_address = 0;

                        if (alt_res.data.record.result[0].is_invoice_address == 1)
                            $scope.rec.is_invoice_address = 1;
                        else
                            $scope.rec.is_invoice_address = 0;
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

<<<<<<< HEAD
                        angular.forEach($rootScope.country_type_arr, function (elem) {
=======
                        angular.forEach($rootScope.country_type_arr, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (elem.id == $scope.$root.defaultCountry)
                                $scope.drp.country_id = elem;
                        });
                    }
                });
        }
    }

<<<<<<< HEAD
    $scope.getAltContact_genral = function (arr, type) {
=======
    $scope.getAltContact_genral = function(arr, type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (type != undefined) {
            if (arr) {

                $scope.rec.contact_person = $scope.rec.primaryc_name;
                $scope.rec.cjob_title = $scope.rec.primaryc_job_title;
                $scope.rec.cdirect_line = $scope.rec.primaryc_direct_line;
                $scope.rec.cmobile = $scope.rec.primaryc_mobile;
                $scope.rec.cphone = $scope.rec.primaryc_phone;
                $scope.rec.cfax = $scope.rec.primaryc_fax;
                $scope.rec.cemail = $scope.rec.primaryc_email;
                $scope.rec.cbooking_instructions = $scope.rec.primaryc_booking_instructions;
                $scope.rec.alt_contact_id = $scope.rec.primaryc_id;

                if ($scope.rec.pref_method_of_communication != undefined)
                    $scope.drp.pref_mthod_of_comm = $scope.$root.get_obj_frm_arry($scope.arr_pref_method_comm, $scope.rec.primaryc_pref_method_of_communication);

                /*
                $scope.rec.csocialmedia1_value = $scope.rec.primaryc_socialmedia1_value;
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
<<<<<<< HEAD
                angular.forEach($rootScope.social_medias_contact_form, function (obj) {
=======
                angular.forEach($rootScope.social_medias_contact_form, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

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
                    $scope.socialMediasContactGeneral['SupplierPrimaryContactSM'] = $scope.tempContactSocialMedia;
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

                $scope.rec.socialmedia1_value = null;
                $scope.rec.socialmedia2_value = null;
                $scope.rec.socialmedia3_value = null;
                $scope.rec.socialmedia4_value = null;
                $scope.rec.socialmedia5_value = null;

                $scope.rec.socialmedia1 = null;
                $scope.rec.socialmedia2 = null;
                $scope.rec.socialmedia3 = null;
                $scope.rec.socialmedia4 = null;
                $scope.rec.socialmedia5 = null;
            }
        } else {

            $scope.postData = {
                'acc_id': $scope.$root.srm_id,
                'module_type': $rootScope.SRMType,
                'token': $scope.$root.token,
                'is_primary': 1
            }
            var ApiAjax = $scope.$root.pr + "srm/srm/get-alt-contacts-list";
            $http
                .post(ApiAjax, $scope.postData)
<<<<<<< HEAD
                .then(function (alt_res) {
=======
                .then(function(alt_res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

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

<<<<<<< HEAD
                            angular.forEach($scope.arr_pref_method_comm, function (elem) {
=======
                            angular.forEach($scope.arr_pref_method_comm, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (elem.id == alt_res.data.response[0].pref_method_of_communication) {
                                    $scope.drp.pref_mthod_of_comm = elem;
                                }
                            });
                        }

                        $scope.rec.csocialmedia1_value = alt_res.data.response[0].socialmedia1_value;
                        $scope.rec.csocialmedia2_value = alt_res.data.response[0].socialmedia2_value;
                        $scope.rec.csocialmedia3_value = alt_res.data.response[0].socialmedia3_value;
                        $scope.rec.csocialmedia4_value = alt_res.data.response[0].socialmedia4_value;
                        $scope.rec.csocialmedia5_value = alt_res.data.response[0].socialmedia5_value;

<<<<<<< HEAD
                        angular.forEach($rootScope.social_medias, function (elem) {
=======
                        angular.forEach($rootScope.social_medias, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

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
                });
        }
        // $scope.$root.breadcrumbs[3].name = 'General';
    }

<<<<<<< HEAD
    $scope.generalInformation = function () {
        $scope.getSupplierDataByID();
    }

    $scope.add_general_srm = function (rec, drp) {
=======
    $scope.generalInformation = function() {
        $scope.getSupplierDataByID();
    }

    $scope.add_general_srm = function(rec, drp) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if (drp.company_type_id != undefined) {
            var arrSeg = [];
            if (drp.company_type_id.length > 0) {
<<<<<<< HEAD
                angular.forEach(drp.company_type_id, function (elem) {
=======
                angular.forEach(drp.company_type_id, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    arrSeg.push(elem.id);
                });
                rec.segment_id = arrSeg.toString();
            }
        }

        if (drp.status_ids == undefined || drp.status_ids == '') {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Status']));
            return false;
        }

        rec.country_id = (drp.country_id != undefined && drp.country_id != '') ? drp.country_id.id : 0;
        rec.status = (drp.status_ids != undefined && drp.status_ids != '') ? drp.status_ids.id : 0;
        rec.selling_grp_id = (drp.selling_grp_id != undefined && drp.selling_grp_id != '') ? drp.selling_grp_id.id : 0;
        rec.segment_id = (drp.segment_id != undefined && drp.segment_id != '') ? drp.segment_id.id : 0;
        rec.region_id = (drp.region_id != undefined && drp.region_id != '') ? drp.region_id.id : 0;
        rec.pref_method_of_communication = (drp.pref_mthod_of_comm != undefined && drp.pref_mthod_of_comm != '') ? drp.pref_mthod_of_comm.id : 0;
        rec.supplier_classification = (drp.srm_classification != undefined && drp.srm_classification != '') ? drp.srm_classification.id : 0;
        rec.currency_id = (drp.currency != undefined && drp.currency != '') ? drp.currency.id : 0;
        rec.supplier_id = $scope.$root.supplier_id;

        if (rec.currency_id == 0) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Currency']));
            return false;
        }

<<<<<<< HEAD
        
=======

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if (rec.web_address != undefined && rec.web_address.length > 0)
            rec.web_address = (rec.web_address.indexOf('://') === -1) ? 'http://' + rec.web_address : rec.web_address;

        if (angular.element('#genis_billing_address').is(':checked') == false)
            rec.is_billing_address = 0;

        if (angular.element('#genis_delivery_collection_address').is(':checked') == false)
            rec.is_delivery_collection_address = 0;
        // else if ($stateParams.id == undefined)
        //     toaster.pop('warning', 'info', "Contact and Delivery Hours can be added on Other Locations tab.");

        if (angular.element('#genis_invoice_address').is(':checked') == false)
            rec.is_invoice_address = 0;


        if (angular.element('#general_anonymous_supplier').is(':checked') == false)
            rec.anonymous_supplier = 0;

        if (rec.anonymous_supplier == true)
            rec.anonymous_supplier = 1;

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
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(231, ['Address Line 1 ', 'Postcode']));
            $scope.showLoader = false;
            return;
        }

        rec.type = 3;
        rec.token = $scope.$root.token;
        $scope.showLoader = true;
<<<<<<< HEAD
        
        if ($scope.rec.supplier_code != undefined){
            if (rec.is_delivery_collection_address != 0 && $stateParams.id == undefined)
                toaster.pop('warning', 'info', "Contact and Delivery Hours can be added on Other Locations tab.");
            $scope.UpdateForm(rec);
        }            
        else {
            rec.srmModuleType = 2;  
=======

        if ($scope.rec.supplier_code != undefined) {
            if (rec.is_delivery_collection_address != 0 && $stateParams.id == undefined)
                toaster.pop('warning', 'info', "Contact and Delivery Hours can be added on Other Locations tab.");
            $scope.UpdateForm(rec);
        } else {
            rec.srmModuleType = 2;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.recDupChk = rec;

            var duplicationChkUrl = $scope.$root.pr + "srm/srm/duplication-chk-crm";

            $http
                .post(duplicationChkUrl, rec)
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    if (res.data.ack == true) {
                        $scope.showLoader = false;

                        $scope.errorMsg = res.data.error;

                        ngDialog.openConfirm({
                            template: 'app/views/crm/duplicationChkModal.html',
                            className: 'ngdialog-theme-default-custom',
                            scope: $scope
<<<<<<< HEAD
                        }).then(function (value) {

                            /* code to get Supplier code Start */
                            
=======
                        }).then(function(value) {

                            /* code to get Supplier code Start */

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (rec.is_delivery_collection_address != 0 && $stateParams.id == undefined)
                                toaster.pop('warning', 'info', "Contact and Delivery Hours can be added on Other Locations tab.");

                            var name = $scope.$root.base64_encode('supplier');
                            var no = $scope.$root.base64_encode('supplier_no');

                            var module_category_id = 2;
                            var getCodeUrl = $scope.$root.stock + "products-listing/get-code";

                            $http
                                .post(getCodeUrl, {
                                    'is_increment': 1,
                                    'token': $scope.$root.token,
                                    'tb': name,
                                    'm_id': 54,
                                    'no': no,
                                    'category': $scope.formData.category_ids,
                                    'brand': $scope.formData.brand_ids,
                                    'module_category_id': module_category_id,
                                    'type': '2,3',
                                    'status': '18'
                                })
<<<<<<< HEAD
                                .then(function (res) {
=======
                                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                                    if (res.data.ack == 1) {
                                        $scope.rec.supplier_code = res.data.code;
                                        $scope.rec.supplier_no = res.data.nubmer;
<<<<<<< HEAD
                                        $scope.rec.code_type = module_category_id;//res.data.code_type;
=======
                                        $scope.rec.code_type = module_category_id; //res.data.code_type;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        $scope.count_result++;

                                        if (res.data.type == 1) {
                                            $scope.product_type = false;
<<<<<<< HEAD
                                        }
                                        else {
=======
                                        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            $scope.product_type = true;
                                        }

                                        if ($scope.rec.supplier_code != undefined) {
                                            /* code to add Supplier Start */
                                            $scope.UpdateForm(rec);
                                            /* code to add Supplier End */
<<<<<<< HEAD
                                        }
                                        else {
                                            $scope.showLoader = false;
                                            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier Code']));
                                        }
                                    }
                                    else {
=======
                                        } else {
                                            $scope.showLoader = false;
                                            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier Code']));
                                        }
                                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        $scope.showLoader = false;
                                        toaster.pop('error', 'info', res.data.error);
                                        return false;
                                    }
                                });

                            /* code to get Supplier code End */

<<<<<<< HEAD
                        }, function (reason) {
=======
                        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            console.log('Modal promise rejected. Reason: ', reason);
                        });

                    } else {

                        /* code to get Supplier code Start */

                        if (rec.is_delivery_collection_address != 0 && $stateParams.id == undefined)
                            toaster.pop('warning', 'info', "Contact and Delivery Hours can be added on Other Locations tab.");

                        var name = $scope.$root.base64_encode('supplier');
                        var no = $scope.$root.base64_encode('supplier_no');

                        var module_category_id = 2;
                        var getCodeUrl = $scope.$root.stock + "products-listing/get-code";

                        $http
                            .post(getCodeUrl, {
                                'is_increment': 1,
                                'token': $scope.$root.token,
                                'tb': name,
                                'm_id': 54,
                                'no': no,
                                'category': $scope.formData.category_ids,
                                'brand': $scope.formData.brand_ids,
                                'module_category_id': module_category_id,
                                'type': '2,3',
                                'status': '18'
                            })
<<<<<<< HEAD
                            .then(function (res) {
=======
                            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                                if (res.data.ack == 1) {
                                    $scope.rec.supplier_code = res.data.code;
                                    $scope.rec.supplier_no = res.data.nubmer;
<<<<<<< HEAD
                                    $scope.rec.code_type = module_category_id;//res.data.code_type;
=======
                                    $scope.rec.code_type = module_category_id; //res.data.code_type;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    $scope.count_result++;

                                    if (res.data.type == 1) {
                                        $scope.product_type = false;
<<<<<<< HEAD
                                    }
                                    else {
=======
                                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        $scope.product_type = true;
                                    }

                                    if ($scope.rec.supplier_code != undefined) {
                                        /* code to add Supplier Start */
                                        $scope.UpdateForm(rec);
                                        /* code to add Supplier End */
<<<<<<< HEAD
                                    }
                                    else {
                                        $scope.showLoader = false;
                                        toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier Code']));
                                    }
                                }
                                else {
=======
                                    } else {
                                        $scope.showLoader = false;
                                        toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier Code']));
                                    }
                                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    $scope.showLoader = false;
                                    toaster.pop('error', 'info', res.data.error);
                                    return false;
                                }
                            });

                        /* code to get Supplier code End */
                    }

<<<<<<< HEAD
                }).catch(function (message) {
=======
                }).catch(function(message) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.showLoader = false;

                    throw new Error(message.data);
                    console.log(message.data);
                });
        }
    }

    ///* Function to Update Supplier General Form*/
<<<<<<< HEAD
    $scope.UpdateForm = function (rec) {
=======
    $scope.UpdateForm = function(rec) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if ($scope.rec.supplier_code != undefined) {

            var addcrmUrl = $scope.$root.pr + "supplier/supplier/add-supplier";
            if (rec.id != undefined)
                addcrmUrl = $scope.$root.pr + "supplier/supplier/update-supplier";

            if (rec.currency_id) {
                $rootScope.supp_current_edit_currency = $scope.$root.get_obj_frm_arry($rootScope.arr_currency, rec.currency_id);
            } else {
                $rootScope.supp_current_edit_currency = $scope.$root.defaultCurrency;
            }

            if ($scope.rec.contact_person != undefined) {
                $scope.add_contact_from_general(rec);
                rec.contact = $scope.addContactData;
            }

            if ($scope.rec.address_1 != undefined) {
                if ($scope.rec.address_1.length > 0) {
                    $scope.addAltlocationfromGeneral(rec);
                    rec.loc = $scope.addLocdata;
                } else if ($scope.rec.postcode != undefined && $scope.rec.postcode.length > 0) {
                    $scope.addAltlocationfromGeneral(rec);
                    rec.loc = $scope.addLocdata;
<<<<<<< HEAD
                }
                else
=======
                } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    rec.loc = {};
            } else if ($scope.rec.postcode != undefined && $scope.rec.postcode.length > 0) {
                $scope.addAltlocationfromGeneral(rec);
                rec.loc = $scope.addLocdata;
            } else
                rec.loc = {};

            if (rec.loc.depot == undefined && rec.alt_loc_id > 0) {
                $scope.showLoader = false;
                toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(378, ['Primary Location']));
                return false;
            }

            rec.acc_id = $scope.$root.srm_id;

            // console.log($scope.rec);

            rec.social_media_arr_contact = $scope.socialMediasGeneral.supplierSM;
            if (rec.anonymous_supplier1 == true)
                rec.anonymous_supplier = 1;
            else
                rec.anonymous_supplier = 0;
            $http
                .post(addcrmUrl, rec)
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                    $scope.showLoader = false;

                    if (res.data.ack == 1) {

                        if ($stateParams.id == undefined)
                            toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                        else
                            toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));

                        // console.log($scope.rec);

                        $scope.$root.rec_id = res.data.id;
                        $scope.rec.srm_id = res.data.id;

<<<<<<< HEAD
                        if(!$scope.rec.alt_loc_id && res.data.alt_loc_id) 
                            $scope.rec.alt_loc_id = res.data.alt_loc_id;

                         if(!$scope.rec.alt_contact_id && res.data.alt_contact_id) 
                            $scope.rec.alt_contact_id = res.data.alt_contact_id;  
=======
                        if (!$scope.rec.alt_loc_id && res.data.alt_loc_id)
                            $scope.rec.alt_loc_id = res.data.alt_loc_id;

                        if (!$scope.rec.alt_contact_id && res.data.alt_contact_id)
                            $scope.rec.alt_contact_id = res.data.alt_contact_id;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


                        $scope.rec.contact_name = $scope.rec.contact_person;
                        $scope.rec.web_add = rec.web_address;
                        // $scope.rec.country_ids = $scope.rec_contact.country_id != undefined ? $scope.rec_contact.country_id.id : 0;

                        // if ($scope.$root.srm_id === undefined)
                        //     return;

                        // console.log($scope.rec.old_status);
                        if ($scope.rec.old_status != rec.status)
                            $scope.add_status_history($scope.rec.srm_id, rec);

                        if ($stateParams.id == undefined)
                            $state.go("app.edit-supplier", {
                                id: res.data.id
                            });
                        else
                            $scope.check_srm_readonly = true;

                    } else {
                        if (rec.id > 0)
                            toaster.pop('error', 'Edit', res.data.error);
                        //toaster.pop('error', 'Edit', 'Record can\'t be  Saved!');
                        else
                            toaster.pop('error', 'Info', res.data.error);
                        //toaster.pop('error', 'Info', 'Record can\'t be  Saved!');
                    }
                });

        } else toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(230, ['Supplier Code']));
    }

<<<<<<< HEAD
    $scope.add_contact_from_general = function (rec) {
=======
    $scope.add_contact_from_general = function(rec) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var rec2 = {};
        $scope.addContactData = {};
        rec2.module_type = $rootScope.SRMType;

        // rec2.token = $scope.$root.token;

        rec2.alt_contact_id = rec.alt_contact_id;
        rec2.acc_id = $scope.$root.srm_id;
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

        rec2.pref_method_of_communication = $scope.drp.pref_mthod_of_comm != undefined ? $scope.drp.pref_mthod_of_comm.id : 0;

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
        rec2.social_media_arr_contact = $scope.socialMediasContactGeneral.SupplierPrimaryContactSM;

        $scope.addContactData = rec2;
    }

<<<<<<< HEAD
    $scope.addAltlocationfromGeneral = function (rec) {
=======
    $scope.addAltlocationfromGeneral = function(rec) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.addLocdata = {};

        var rec2 = {};
        // rec2.token = $scope.$root.token;
        rec2.contact_name = rec.contact_person;
        rec2.is_primary = 1;
<<<<<<< HEAD
        rec2.depot = rec.name;//'General Location'; //$scope.rec.contact_person;//
=======
        rec2.depot = rec.name; //'General Location'; //$scope.rec.contact_person;//
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        rec2.role = rec.job_title;
        rec2.telephone = rec.phone;
        rec2.is_primary = 1;
        rec2.is_general = 0;
        rec2.module_type = $rootScope.SRMType;

        rec2.address = rec.address_1;
        rec2.address_2 = rec.address_2;
        rec2.city = rec.city;
        rec2.county = rec.county;
        rec2.postcode = rec.postcode;
        rec2.alt_loc_id = rec.alt_loc_id;
        rec2.email = rec.email;
        rec2.phone = rec.phone;
        rec2.acc_id = $scope.$root.srm_id;
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

        if (angular.element('#general_anonymous_supplier').is(':checked') == false)
            rec2.anonymous_supplier = 0;
        else rec2.anonymous_supplier = 1;

        rec2.social_media_arr_contact = $scope.socialMediasContactGeneral.SRMprimaryContactSM;
        $scope.addLocdata = rec2;
    }

<<<<<<< HEAD
    $scope.add_location_from_general = function (id, rec) {
=======
    $scope.add_location_from_general = function(id, rec) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.rec.srm_id = id;
        $scope.rec.id = 0;
        $scope.rec.token = $scope.$root.token;
        $scope.rec.depot = 'Main office';
        $scope.rec.contact_name = $scope.rec.contact_person;
        $scope.rec.role = $scope.rec.job_title;
        $scope.rec.address = $scope.rec.address_1;
        $scope.rec.telephone = $scope.rec.phone;
        $scope.rec.web_add = $scope.rec.web_address;

        if ($scope.drp.country_id != undefined)
            $scope.rec.country_id = $scope.drp.country_id.id != undefined ? $scope.drp.country_id.id : 0;


        var altAddUrl = $scope.$root.pr + "srm/srm/add-alt-depot";
        $http
            .post(altAddUrl, rec)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                //    toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(102));

            });

    }

<<<<<<< HEAD
    $scope.convert = function (id, index, $data) {

        ngDialog.openConfirm({
            template: 'app/views/supplier/_confirm_convert_modal.html',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {


            $scope.product_type = true;
            $scope.count_result = 0;
            var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
            var name = $scope.$root.base64_encode('srm');
            var no = $scope.$root.base64_encode('srm_no');

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
                    'type': '2,3',
                    'status': '18'
                })
                .then(function (res) {

                    if (res.data.ack == 1) {
                        $scope.rec.srm_code = res.data.code;

                        $scope.code_type = module_category_id;
                        $scope.count_result++;

                        if (res.data.type == 1) $scope.product_type = false;
                        else $scope.product_type = true;


                        var convUrl = $scope.$root.pr + "srm/srm/convert";
                        $http
                            .post(convUrl, {
                                'id': $stateParams.id,
                                'type': 2,
                                'module': 2,
                                'token': $scope.$root.token,
                                'srm_code': res.data.code
                            })
                            .then(function (res) {
                                // $data.splice(index, 1);

                                if (res.data.ack == true) {
                                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(229, ['SRM']));
                                    // $state.go("app.edit-srm", { 'id': $stateParams.id });

                                    $timeout(function () {
                                        $state.go("app.edit-srm", { 'id': $stateParams.id });
                                    }, 1000);

                                } else
                                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(235, ['to SRM']));

                            });


                    } else {
                        toaster.pop('error', 'info', res.data.error);
                        return false;
                    }
                });


        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    }
    //--------------------- end General   ------------------------------------------

    $scope.gotoedit = function () {
=======
    $scope.convert = function(id, index, $data) {

            ngDialog.openConfirm({
                template: 'app/views/supplier/_confirm_convert_modal.html',
                className: 'ngdialog-theme-default-custom'
            }).then(function(value) {


                $scope.product_type = true;
                $scope.count_result = 0;
                var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
                var name = $scope.$root.base64_encode('srm');
                var no = $scope.$root.base64_encode('srm_no');

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
                        'type': '2,3',
                        'status': '18'
                    })
                    .then(function(res) {

                        if (res.data.ack == 1) {
                            $scope.rec.srm_code = res.data.code;

                            $scope.code_type = module_category_id;
                            $scope.count_result++;

                            if (res.data.type == 1) $scope.product_type = false;
                            else $scope.product_type = true;


                            var convUrl = $scope.$root.pr + "srm/srm/convert";
                            $http
                                .post(convUrl, {
                                    'id': $stateParams.id,
                                    'type': 2,
                                    'module': 2,
                                    'token': $scope.$root.token,
                                    'srm_code': res.data.code
                                })
                                .then(function(res) {
                                    // $data.splice(index, 1);

                                    if (res.data.ack == true) {
                                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(229, ['SRM']));
                                        // $state.go("app.edit-srm", { 'id': $stateParams.id });

                                        $timeout(function() {
                                            $state.go("app.edit-srm", { 'id': $stateParams.id });
                                        }, 1000);

                                    } else
                                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(235, ['to SRM']));

                                });


                        } else {
                            toaster.pop('error', 'info', res.data.error);
                            return false;
                        }
                    });


            }, function(reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });

        }
        //--------------------- end General   ------------------------------------------

    $scope.gotoedit = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.check_readonly = false;
    }


<<<<<<< HEAD
    $scope.add_status_history = function (id, rec) {
=======
    $scope.add_status_history = function(id, rec) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var excUrl = $scope.$root.pr + "srm/srm/add-status-log";
        var post = {};
        post.id = id;
        post.status_id = rec.status;
        post.token = $scope.$root.token;
        $http
            .post(excUrl, post)
<<<<<<< HEAD
            .then(function (res) {
            });
    }

    $scope.addNewPredefinedPopup = function (drpdown, type, title, drp) {
=======
            .then(function(res) {});
    }

    $scope.addNewPredefinedPopup = function(drpdown, type, title, drp) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.isBtnPredefined = true;

        // console.log(drpdown);

        var sel_id = drpdown.id


        if (sel_id > 0)
            return false;

        if (drpdown.id > 0)
            return false;

        $scope.popup_title = title;
        $scope.pedefined = {};

        ngDialog.openConfirm({
            template: 'app/views/crm/add_predefined.html',
            className: 'ngdialog-theme-default-custom-large',
            scope: $scope
<<<<<<< HEAD
        }).then(function (pedefined) {
=======
        }).then(function(pedefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            var types = type;
            pedefined.token = $scope.$root.token;
            if (type == 'STATUS') {
                types = 2;
                pedefined.name = pedefined.title;
            }
            pedefined.type = types;
            pedefined.status = 1;

            var postUrl = $scope.$root.setup + "ledger-group/add-predefine";
            if (type == 'PREFER_METHOD')
                var postUrl = $scope.$root.pr + "srm/srm/add-pref-method-of-comm";
            if (type == 'STATUS')
                var postUrl = $scope.$root.stock + "product-status/add-status-list";

            if ((pedefined.title == undefined)) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Name']));
                return;
            }

            $http
                .post(postUrl, pedefined)
<<<<<<< HEAD
                .then(function (ress) {
=======
                .then(function(ress) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (ress.data.ack == true) {
                        var sid = ress.data.id;


                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        var getUrl = $scope.$root.setup + "ledger-group/get-predefine-by-type";

                        if (type == 'PREFER_METHOD')
                            var getUrl = $scope.$root.pr + "srm/srm/get-all-pref-method-of-comm";
                        if (type == 'STATUS')
                            var getUrl = $scope.$root.stock + "product-status/get-status";


                        $http
                            .post(getUrl, { 'token': $scope.$root.token, type: types })
<<<<<<< HEAD
                            .then(function (res) {
=======
                            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (res.data.ack == true) {

                                    if (type == 'PREFER_METHOD') {
                                        $scope.arr_pref_method_comm = res.data.response;
<<<<<<< HEAD
                                        angular.forEach($scope.arr_pref_method_comm, function (elem) {
=======
                                        angular.forEach($scope.arr_pref_method_comm, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            if (elem.id == sid)
                                                drp.pref_mthod_of_comm = elem;
                                        });
                                        if ($scope.user_type == 1)
                                            $scope.arr_pref_method_comm.push({ 'id': '-1', 'title': '++ Add New ++' });
                                    }

                                    if (type == 'STATUS') {
                                        $scope.status_list = res.data.response;
<<<<<<< HEAD
                                        angular.forEach($scope.status_list, function (elem) {
=======
                                        angular.forEach($scope.status_list, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            if (elem.id == sid)
                                                drp.status_ids = elem;
                                        });
                                        //   if ($scope.user_type == 1)   $scope.status_list.push({'id': '-1', 'title': '++ Add New ++'});
                                    }

                                    if (type == 'SEGMENT') {
                                        $scope.arr_segment = res.data.response;

<<<<<<< HEAD
                                        angular.forEach($scope.arr_segment, function (elem) {
=======
                                        angular.forEach($scope.arr_segment, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            if (elem.id == sid)
                                                drp.company_type_id = elem;
                                        });

                                        if ($scope.user_type == 1)
                                            $scope.arr_segment.push({ 'id': '-1', 'name': '++ Add New ++' });
                                    }
                                    if (type == 'BUYING_GROUP') {
                                        $scope.arr_buying_group = res.data.response;

<<<<<<< HEAD
                                        angular.forEach($scope.arr_buying_group, function (elem) {
=======
                                        angular.forEach($scope.arr_buying_group, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            if (elem.id == sid)
                                                drp.buying_grp_id = elem;
                                        });

                                        if ($scope.user_type == 1)
                                            $scope.arr_buying_group.push({ 'id': '-1', 'name': '++ Add New ++' });

                                    }

                                }
                            });
<<<<<<< HEAD
                    }
                    else
                        toaster.pop('error', 'Info', ress.data.error);
                });

        }, function (reason) {
=======
                    } else
                        toaster.pop('error', 'Info', ress.data.error);
                });

        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    /*    //add currency
       $scope.addNewCurrencyPopup = function (drp) {
           var id = drp.currency != undefined ? drp.currency.id : 0;
           if (id > 0)
               return false;
   
           //	$scope.fnDatePicker();
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
                               .post(currencyUrl, { 'company_id': $scope.$root.defaultCompany, 'token': $scope.$root.token })
                               .then(function (res1) {
                                   if (res1.data.ack == true) {
                                       $rootScope.arr_currency = res1.data.response;
                                       angular.forEach($rootScope.arr_currency, function (elem) {
                                           if (elem.id == res.data.id)
                                               drp.currency = elem;
                                       });
                                   }
                               });
                       } else if (res.data.ack == false) {
                           toaster.pop('error', 'Info', res.data.msg);
                       } else
                           toaster.pop('error', 'Info', res.data.msg);
   
                   });
   
           }, function (reason) {
               console.log('Modal promise rejected. Reason: ', reason);
           });
       }
    */
    /////////////// SRM Social Media ////////////////////

    $scope.selected_count = 0;
    $scope.searchKeyword = {};
    $scope.searchKeyword_offered = {};

<<<<<<< HEAD
    $scope.get_purchase_code_emp = function (arg, item_paging) {
=======
    $scope.get_purchase_code_emp = function(arg, item_paging) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.title = ' Employess(s)';
        $scope.purchase_code = true;
        $scope.showLoader = true;
        var emp_Url = $scope.$root.hr + "hr_values/get-all-employee-purchase-code";

        $scope.columnss = [];
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        $scope.postData.edit_id = arg;
        $scope.postData.id = $stateParams.id;

        if (item_paging == 1)
            $rootScope.item_paging.spage = 1;
        $scope.postData.page = $rootScope.item_paging.spage;

        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;

        $scope.postData.searchKeyword = "";
        $scope.postData.departments = "";
        $scope.postData.employee_types = "";

        $scope.postData.searchKeyword = $scope.searchKeyword_offered.$;

        if ($scope.searchKeyword_offered.department !== undefined && $scope.searchKeyword_offered.department !== null) {
            $scope.postData.departments = $scope.searchKeyword_offered.department.id;
        }

        if ($scope.searchKeyword_offered.employee_type !== undefined && $scope.searchKeyword_offered.employee_type !== null)
            $scope.postData.employee_types = $scope.searchKeyword_offered.employee_type.id;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }

        $http
            .post(emp_Url, $scope.postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record;
                    $scope.record = res.data.response;
                    $scope.record_data = res.data.response;
                    $scope.selected_count = res.data.selected_count;
                    $scope.selection_record_del = res.data.response;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columnss.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    var test_name = '';
<<<<<<< HEAD
                    angular.forEach(res.data.response, function (value, key) {
=======
                    angular.forEach(res.data.response, function(value, key) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (value.checked == 1) {
                            test_name += value.name + ",";
                            angular.element('#selected__del' + value.id).click();
                            angular.element('.pic_block_del_list').attr("disabled", false);
                        }
                    });

                    document.getElementById("display_del_record").innerHTML = test_name.substring(0, test_name.length - 1);

                    $scope.showLoader = false;
                    if (arg)
                        $('#model_srm_purchase_code').modal({ show: true });
                }
            });
    }

<<<<<<< HEAD
    $scope.add_product_list = function (item) {
=======
    $scope.add_product_list = function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.rec_code = {};

        $scope.selectedList_del = [];

<<<<<<< HEAD
        angular.forEach($scope.selection_record_del, function (index, obj) {
=======
        angular.forEach($scope.selection_record_del, function(index, obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (angular.element('#selected__del' + index.id).prop('checked'))
                $scope.selectedList_del.push(index);
        });

        var test_name = '';
        var test_id = '';
<<<<<<< HEAD
        angular.forEach($scope.selectedList_del, function (obj) {
=======
        angular.forEach($scope.selectedList_del, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            for (var i = 0; i < $scope.selection_record_del.length; i++) {
                var object = $scope.selection_record_del[i];
                if (object.id == obj.id) {
                    test_id += obj.id + ",";
                    test_name += obj.name + ",";
                }
            }
            $scope.rec_code.del_name = test_name;
            $scope.rec_code.del_product_id = test_id;
        });

        document.getElementById("display_del_record").innerHTML = $scope.rec_code.del_name.substring(0, $scope.rec_code.del_name.length - 1);

        $scope.rec_code.emp_id = $scope.rec_code.del_product_id;
        $scope.rec_code.srm_id = $stateParams.id;
        $scope.rec_code.token = $scope.$root.token;
        $scope.rec_code.sale_selling_checks = $scope.rec_code.sale_selling_check !== undefined ? $scope.rec_code.sale_selling_check.id : 0;

        var addUrl = $scope.$root.hr + "hr_values/add-all-employee-purchase-code";
        var var_msg = 'Add';
        var var_error = 'Record Inserted Successfully .';

        $http
            .post(addUrl, $scope.rec_code)
<<<<<<< HEAD
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', var_msg, var_error);
                    $('#model_srm_purchase_code').modal('hide');
                }
                else
=======
            .then(function(res) {
                if (res.data.ack == true) {
                    toaster.pop('success', var_msg, var_error);
                    $('#model_srm_purchase_code').modal('hide');
                } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(106));
            });
    }

<<<<<<< HEAD
    $scope.checkAll_del_list = function () {
=======
    $scope.checkAll_del_list = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var bool = angular.element("#selecctall").is(':checked');
        if (!bool)
            $('.pic_block_del_list').attr("disabled", true);
        else
            $('.pic_block_del_list').attr("disabled", false);

<<<<<<< HEAD
        angular.forEach($scope.selection_record_del, function (item) {
=======
        angular.forEach($scope.selection_record_del, function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            angular.element('#selected__del' + item.id).prop('checked', bool);
        });
    }

<<<<<<< HEAD
    $scope.checksingle_del_list_edit = function (classname) {
=======
    $scope.checksingle_del_list_edit = function(classname) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $('.pic_block_del_list').attr("disabled", false);

        $(".new_button_" + classname).hide();
        $(".replace_button_" + classname).show();
        var count = 0;
<<<<<<< HEAD
        angular.forEach($scope.selection_record_del, function (item) {
=======
        angular.forEach($scope.selection_record_del, function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            var bool = angular.element("#selected__del" + item.id).is(':checked');
            if (bool)
                count++;
            else
                angular.element('#selecctall').prop('checked', false);
        });
    }

<<<<<<< HEAD
    $scope.calculate_total_del_list = function () {
        var count = 0;

        angular.forEach($scope.selection_record_del, function (value) {
=======
    $scope.calculate_total_del_list = function() {
        var count = 0;

        angular.forEach($scope.selection_record_del, function(value) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (angular.element('#selected__del' + value.id).prop('checked'))
                count++;
        });

        if (count != 0) {
            angular.element('#from_selected').hide();
            angular.element('#from_ch_selected').show();
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            angular.element('#from_selected').show();
            angular.element('#from_ch_selected').hide();
        }
        return count;
    }

    $scope.items = [];
    $scope.new_list = false;
    $scope.save_list = true;

<<<<<<< HEAD
    $scope.getItems = function () {
=======
    $scope.getItems = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.new_list = false;
        $scope.save_list = true;

        if ($scope.items.length == 0) {
            var postData = "";
            var prodApi = $scope.$root.hr + "employee/listings";
            postData = {
                'token': $scope.$root.token,
                'all': "1",
            };
            $http
                .post(prodApi, postData)
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        $scope.items = [];
                        var purchasedCodeId = "";
                        var purchasedCodes = [];

                        if ($scope.rec.purchase_code_id) {
                            purchasedCodeId = $scope.rec.purchase_code_id;
                            if (purchasedCodeId != "") {
                                purchasedCodes = purchasedCodeId.split(',');
                            }
                        }

<<<<<<< HEAD
                        angular.forEach(res.data.response, function (obj) {
=======
                        angular.forEach(res.data.response, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            obj.chk = false;
                            for (var i = 0; i < purchasedCodes.length; i++) {
                                if (obj.id == purchasedCodes[i]) {
                                    obj.chk = true;
                                }
                            }
                            $scope.items.push(obj);
                        });
                    } else
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                });
        }
        ngDialog.openConfirm({
            template: 'app/views/srm/_listing_employee_modal.html',
            className: 'ngdialog-theme-default',
            scope: $scope,
            size: 'lg'
<<<<<<< HEAD
        }).then(function (result) {
            $scope.selectedList = $scope.items.filter(function (namesDataItem) {
=======
        }).then(function(result) {
            $scope.selectedList = $scope.items.filter(function(namesDataItem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                return namesDataItem.Selected;
            });

            var test_name = '';
            var test_id = '';
            var customer_price = '';
            var discount_type = '';
<<<<<<< HEAD
            angular.forEach($scope.selectedList, function (obj) {
=======
            angular.forEach($scope.selectedList, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                for (var i = 0; i < $scope.items.length; i++) {
                    var object = $scope.items[i];
                    if (object.first_name == obj.first_name) {
                        test_name += obj.first_name + ",";
                    }

                    if (object.id == obj.id) {
                        test_id += obj.id + ",";
                    }
                }
                $scope.rec.purchase_code = test_name;
                $scope.rec.purchase_code_id = test_id;
            });

            console.log($scope.rec.purchase_code);

<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            // console.log('Modal promise rejected. Reason: ', reason);
        });
    }

<<<<<<< HEAD
    angular.element(document).on('click', '#checkAll', function () {
=======
    angular.element(document).on('click', '#checkAll', function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (angular.element('#checkAll').is(':checked') == true) {
            for (var i = 0; i < $scope.items.length; i++) {
                $scope.items[i].chk = true;
            }
        } else {
            for (var i = 0; i < $scope.items.length; i++) {
                $scope.items[i].chk = false;
            }
        }
<<<<<<< HEAD
        $scope.$root.$apply(function () {
=======
        $scope.$root.$apply(function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.items;
        })
    })

    //--------------------- end General   ------------------------------------------
    // ---------------- Contact   	 -----------------------------------------

<<<<<<< HEAD
    $scope.general_contact = function () {
=======
    $scope.general_contact = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // $scope.$root.breadcrumbs[3].name = 'Contact';

        $scope.altContacListingShow = true;
        $scope.altContacFormShow = false;


        $scope.showLoader = true;
        //$scope.check_readonly = true;  

        var API = $scope.$root.pr + "srm/srm/alt-contacts";
        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.item_paging.spage
        };
        $http
            .post(API, $scope.postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                $scope.contact_data = [];
                $scope.columns = [];
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.contact_data = res.data.response;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
                $scope.showLoader = false;
            });
    }

    $scope.check_readonly_contact = true;
<<<<<<< HEAD
    $scope.gotoeditcontact = function () {
=======
    $scope.gotoeditcontact = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.check_readonly_contact = false;
    }

    //---------------- Contact    ------------------------
    // ---------------- Location   	 -----------------------------------------

<<<<<<< HEAD
    $scope.general_location = function () {
=======
    $scope.general_location = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.$root.breadcrumbs[3].name = 'Location';
        $scope.altDepotListingShow = true;
        $scope.altDepotFormShow = false;
        $scope.showLoader = true;
        //$scope.check_readonly = true;  

        var API = $scope.$root.pr + "srm/srm/alt-depots";
        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.item_paging.spage,
            //'country_keyword': angular.element('#search_sale_listing_data').val()
        };
        $http
            .post(API, $scope.postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                $scope.location_data = [];
                $scope.columns = [];
                if (res.data.ack == true) {
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.location_data = res.data.response;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
                $scope.showLoader = false;
            });
    }

    //---------------- Location    ------------------------
    // ---------------- Shipping   	 -----------------------------------------

<<<<<<< HEAD
    $scope.getArea = function (arg, show_id) {
=======
    $scope.getArea = function(arg, show_id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.titile_2 = 'Area';
        $scope.title = 'Area';
        //	var empUrl = $scope.$root.pr+"supplier/supplier/get-coverage-all-areas"; 
        if (arg == 'sale_full')
            var empUrl = $scope.$root.pr + "srm/srm/get-coverage-all-areas";
        else if (arg == 'sale_half')
            var empUrl = $scope.$root.pr + "srm/srm/get-selected-area";
        $http
            .post(empUrl, { 'token': $scope.$root.token, 'id': $scope.$root.srm_id })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {

                    $scope.record_ship = {};
                    $scope.columns_ship = [];
                    $scope.record_ship = res.data.response;
<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columns_ship.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    $scope.record = {};
                    $scope.columnss = [];
                    $scope.total = 0;
                    $scope.record = res.data.response;
                    $scope.total = res.data.total;
<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columnss.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

            });

        if (arg == 'sale_full') {

            ngDialog.openConfirm({
                template: 'modalSaleDialogId',
                // templateUrl: 'app/views/_listing_modal.html',
                className: 'ngdialog-theme-default',
                scope: $scope
<<<<<<< HEAD
            }).then(function (result) {

                if (arg == 'sale_full') {

                    $scope.selectedList = $scope.record.filter(function (namesDataItem) {
                        return namesDataItem.Selected;
                    });
                    var test_name = '';
                    var test_id = '';
                    var customer_price = '';
                    angular.forEach($scope.selectedList, function (obj) {

                        for (var i = 0; i < $scope.record.length; i++) {
                            var object = $scope.record[i];
                            if (object.name == obj.name) {
                                test_name += obj.name + ",";
                            }

                            if (object.id == obj.id) {
                                test_id += obj.id + ",";
                            }
                        }
                        document.getElementById("display_area_record").innerHTML = test_name.substring(0, test_name.length - 1);
                        $scope.rec.coverage_area = test_name;
                        $scope.rec.coverage_area_id = test_id;
                    });
                }
            },
                function (reason) {
=======
            }).then(function(result) {

                    if (arg == 'sale_full') {

                        $scope.selectedList = $scope.record.filter(function(namesDataItem) {
                            return namesDataItem.Selected;
                        });
                        var test_name = '';
                        var test_id = '';
                        var customer_price = '';
                        angular.forEach($scope.selectedList, function(obj) {

                            for (var i = 0; i < $scope.record.length; i++) {
                                var object = $scope.record[i];
                                if (object.name == obj.name) {
                                    test_name += obj.name + ",";
                                }

                                if (object.id == obj.id) {
                                    test_id += obj.id + ",";
                                }
                            }
                            document.getElementById("display_area_record").innerHTML = test_name.substring(0, test_name.length - 1);
                            $scope.rec.coverage_area = test_name;
                            $scope.rec.coverage_area_id = test_id;
                        });
                    }
                },
                function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    console.log('Modal promise rejected. Reason: ', reason);
                });
        } else if (arg == 'sale_half') {

            ngDialog.openConfirm({
                template: 'app/views/srm/_listing_employee.html',
                className: 'ngdialog-theme-default',
                scope: $scope
<<<<<<< HEAD
            }).then(function (result) {

                if (show_id == 1) {
                    $scope.rec.valid_from = result.name;
                    $scope.rec.valid_from_id = result.id;
                }
                if (show_id == 2) {
                    $scope.rec.valid_to = result.name;
                    $scope.rec.valid_to_id = result.id;
                }
            },
                function (reason) {
=======
            }).then(function(result) {

                    if (show_id == 1) {
                        $scope.rec.valid_from = result.name;
                        $scope.rec.valid_from_id = result.id;
                    }
                    if (show_id == 2) {
                        $scope.rec.valid_to = result.name;
                        $scope.rec.valid_to_id = result.id;
                    }
                },
                function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    console.log('Modal promise rejected. Reason: ', reason);
                });

        }


    }

<<<<<<< HEAD
    $scope.calculateChecked = function () {
        var count = 0;
        //item.Selected
        angular.forEach($scope.record, function (value) {
=======
    $scope.calculateChecked = function() {
        var count = 0;
        //item.Selected
        angular.forEach($scope.record, function(value) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            //  console.log(value.Selected);
            if (value.Selected)
                count++;
        });

        return count;
    }

    //Area

    $scope.area = {};
    $scope.area.spage = 1;

<<<<<<< HEAD
    $scope.resetKeyword = function () {
        angular.element('#search_area_data').val('');
    }

    $scope.resetSaleKeyword = function () {
        angular.element('#search_sale_area_data').val('');
    }

    $scope.setSelectPage = function (pageno) {
        $scope.area.spage = pageno;
    }

    $scope.get_shipping_agent = function () {
=======
    $scope.resetKeyword = function() {
        angular.element('#search_area_data').val('');
    }

    $scope.resetSaleKeyword = function() {
        angular.element('#search_sale_area_data').val('');
    }

    $scope.setSelectPage = function(pageno) {
        $scope.area.spage = pageno;
    }

    $scope.get_shipping_agent = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.title = "Areas";
        $scope.showShipLoader = true;
        $scope.ship_sale_areas = [];
        $scope.checkedsale = 0;
        $scope.shipinglistingShow = true;
        $scope.shipinglistingShowForm = true;
        $scope.customers_list = true;
        $scope.btnCancelUrl = 'app.get_shipping_agent';


        var prodApi = $scope.$root.pr + "srm/srm/srm-areas";

        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.area.spage,
            'keyword': angular.element('#search_area_data').val()
        };
        $http
            .post(prodApi, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {

                    $scope.area.total_pages = res.data.total_pages;
                    $scope.area.cpage = res.data.cpage;
                    $scope.area.ppage = res.data.ppage;
                    $scope.area.npage = res.data.npage;
                    $scope.area.pages = res.data.pages;

                    $scope.ship_data = [];
                    $scope.ship_column = [];

                    $scope.ship_data = res.data.response;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.ship_column.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    $scope.showShipLoader = false;

                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });


    }

    $scope.areas_tab = "country";
    $scope.areas_listing_tab = "country";

<<<<<<< HEAD
    $scope.get_search_shipping_agent = function (search_agent) {
=======
    $scope.get_search_shipping_agent = function(search_agent) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (search_agent == 'listing') {
            if ($scope.areas_listing_tab == "country") {
                $scope.setShipCountrySelectPage(1);
                $scope.get_shipping_countries();
            } else if ($scope.areas_listing_tab == "region") {
                $scope.setShipRegionSelectPage(1);
                $scope.get_shipping_regions();
            } else if ($scope.areas_listing_tab == "county") {
                $scope.setShipCountySelectPage(1);
                $scope.get_shipping_counties();
            } else if ($scope.areas_listing_tab == "area") {
                $scope.setShipAreaSelectPage(1);
                $scope.get_shipping_areas();
            }
        } else if (search_agent == 'add_listing') {
            if ($scope.areas_tab == "country") {
                $scope.setCountrySelectPage(1);
                $scope.get_countries_shipping_agent();
            } else if ($scope.areas_tab == "region") {
                $scope.setRegionSelectPage(1);
                $scope.get_regions_shipping_agent();
            } else if ($scope.areas_tab == "county") {
                $scope.setCountySelectPage(1);
                $scope.get_county_shipping_agent();
            } else if ($scope.areas_tab == "area") {
                $scope.setAreaSelectPage(1);
                $scope.get_area_shipping_agent();
            }
        } else if (search_agent == 'price') {
            $scope.get_sale_area('');
        }
    }

<<<<<<< HEAD
    $scope.unset_search_shipping_agent = function (search_agent) {
=======
    $scope.unset_search_shipping_agent = function(search_agent) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (search_agent == 'listing') {
            angular.element('#search_sale_listing_data').val('');
            if ($scope.areas_listing_tab == "country") {
                $scope.setShipCountrySelectPage(1);
                $scope.get_shipping_countries();
            } else if ($scope.areas_listing_tab == "region") {
                $scope.setShipRegionSelectPage(1);
                $scope.get_shipping_regions();
            } else if ($scope.areas_listing_tab == "county") {
                $scope.setShipCountySelectPage(1);
                $scope.get_shipping_counties();
            } else if ($scope.areas_listing_tab == "area") {
                $scope.setShipAreaSelectPage(1);
                $scope.get_shipping_areas();
            }
        } else if (search_agent == 'add_listing') {
            angular.element('#search_sale_add_listing_data').val('');
            if ($scope.areas_tab == "country") {
                $scope.setCountrySelectPage(1);
                $scope.get_countries_shipping_agent();
            } else if ($scope.areas_tab == "region") {
                $scope.setRegionSelectPage(1);
                $scope.get_regions_shipping_agent();
            } else if ($scope.areas_tab == "county") {
                $scope.setCountySelectPage(1);
                $scope.get_county_shipping_agent();
            } else if ($scope.areas_tab == "area") {
                $scope.setAreaSelectPage(1);
                $scope.get_area_shipping_agent();
            }
        } else if (search_agent == 'price') {
            angular.element('#search_sale_price_data').val('');
            $scope.get_sale_area('');
        }
    }

    $scope.areas_country = {};
    $scope.ship_data_country = [];
    $scope.ship_column_country = [];

<<<<<<< HEAD
    $scope.setCountrySelectPage = function (pageno) {
        $scope.areas_country.spage = pageno;
    }

    $scope.checkAllCountries = function () {
        if (angular.element('#checkAllCountries').is(':checked')) {
            angular.forEach($scope.ship_data_country, function (val, index) {
=======
    $scope.setCountrySelectPage = function(pageno) {
        $scope.areas_country.spage = pageno;
    }

    $scope.checkAllCountries = function() {
        if (angular.element('#checkAllCountries').is(':checked')) {
            angular.forEach($scope.ship_data_country, function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (!angular.element('#shipping_country_' + $scope.ship_data_country[index].id).is(':checked')) {
                    angular.element('#shipping_country_' + $scope.ship_data_country[index].id).prop('checked', true);
                }
            });
        } else {
<<<<<<< HEAD
            angular.forEach($scope.ship_data_country, function (val, index) {
=======
            angular.forEach($scope.ship_data_country, function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (angular.element('#shipping_country_' + $scope.ship_data_country[index].id).is(':checked')) {
                    angular.element('#shipping_country_' + $scope.ship_data_country[index].id).prop('checked', false);
                }
            });
        }
    }

<<<<<<< HEAD
    $scope.get_countries_shipping_agent = function () {
=======
    $scope.get_countries_shipping_agent = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.areas_tab = "country";
        $scope.title = "Countries";
        $scope.showShipLoader = true;
        //        $scope.ship_sale_areas = [];
        //        $scope.checkedsale = 0;

        var prodApi = $scope.$root.pr + "srm/srm/srm-countries";

        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.areas_country.spage,
            'country_keyword': angular.element('#search_sale_add_listing_data').val()
        };
        $http
            .post(prodApi, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {

                    $scope.areas_country.total_pages = res.data.total_pages;
                    $scope.areas_country.cpage = res.data.cpage;
                    $scope.areas_country.ppage = res.data.ppage;
                    $scope.areas_country.npage = res.data.npage;
                    $scope.areas_country.pages = res.data.pages;

                    $scope.ship_data_country = [];
                    $scope.ship_column_country = [];

                    $scope.ship_data_country = res.data.response;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.ship_column_country.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

<<<<<<< HEAD
                    angular.forEach(res.data.countries, function (val, index) {
=======
                    angular.forEach(res.data.countries, function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        angular.element('#shipping_country_' + res.data.countries[index]).prop('checked', true);
                    });

                    $scope.showShipLoader = false;

                } else {
                    $scope.areas_country
                    $scope.ship_data_country = [];
                    $scope.ship_column_country = [];
                    //  toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }

            });
        $scope.showShipLoader = false;

    }

    $scope.areas_region = {};
    $scope.ship_data_region = [];
    $scope.ship_column_region = [];

<<<<<<< HEAD
    $scope.setRegionSelectPage = function (pageno) {
        $scope.areas_region.spage = pageno;
    }

    $scope.checkAllRegions = function () {
        if (angular.element('#checkAllRegions').is(':checked')) {
            angular.forEach($scope.ship_data_region, function (val, index) {
=======
    $scope.setRegionSelectPage = function(pageno) {
        $scope.areas_region.spage = pageno;
    }

    $scope.checkAllRegions = function() {
        if (angular.element('#checkAllRegions').is(':checked')) {
            angular.forEach($scope.ship_data_region, function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (!angular.element('#shipping_region_' + $scope.ship_data_region[index].id).is(':checked')) {
                    angular.element('#shipping_region_' + $scope.ship_data_region[index].id).prop('checked', true);
                }
            });
        } else {
<<<<<<< HEAD
            angular.forEach($scope.ship_data_region, function (val, index) {
=======
            angular.forEach($scope.ship_data_region, function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (angular.element('#shipping_region_' + $scope.ship_data_region[index].id).is(':checked')) {
                    angular.element('#shipping_region_' + $scope.ship_data_region[index].id).prop('checked', false);
                }
            });
        }
    }

<<<<<<< HEAD
    $scope.get_regions_shipping_agent = function () {
=======
    $scope.get_regions_shipping_agent = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.areas_tab = "region";
        $scope.title = "Regions";
        $scope.showShipLoader = true;
        $scope.ship_sale_areas = [];
        $scope.checkedsale = 0;

        var prodApi = $scope.$root.pr + "srm/srm/srm-regions";

        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.areas_region.spage,
            'region_keyword': angular.element('#search_sale_add_listing_data').val()
        };
        $http
            .post(prodApi, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {

                    $scope.areas_region.total_pages = res.data.total_pages;
                    $scope.areas_region.cpage = res.data.cpage;
                    $scope.areas_region.ppage = res.data.ppage;
                    $scope.areas_region.npage = res.data.npage;
                    $scope.areas_region.pages = res.data.pages;

                    $scope.ship_data_region = [];
                    $scope.ship_column_region = [];

                    $scope.ship_data_region = res.data.response;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.ship_column_region.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

<<<<<<< HEAD
                    angular.forEach(res.data.regions, function (val, index) {
=======
                    angular.forEach(res.data.regions, function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        angular.element('#shipping_region_' + res.data.regions[index]).prop('checked', true);
                    });

                    $scope.showShipLoader = false;

                } else {

                    $scope.areas_region = {};
                    $scope.ship_data_region = [];
                    $scope.ship_column_region = [];
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });
        $scope.showShipLoader = false;

    }

    $scope.areas_county = {};
    $scope.ship_data_county = [];
    $scope.ship_column_county = [];

<<<<<<< HEAD
    $scope.setCountySelectPage = function (pageno) {
        $scope.areas_county.spage = pageno;
    }

    $scope.checkAllCounties = function () {
        if (angular.element('#checkAllCounties').is(':checked')) {
            angular.forEach($scope.ship_data_county, function (val, index) {
=======
    $scope.setCountySelectPage = function(pageno) {
        $scope.areas_county.spage = pageno;
    }

    $scope.checkAllCounties = function() {
        if (angular.element('#checkAllCounties').is(':checked')) {
            angular.forEach($scope.ship_data_county, function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (!angular.element('#shipping_county_' + $scope.ship_data_county[index].id).is(':checked')) {
                    angular.element('#shipping_county_' + $scope.ship_data_county[index].id).prop('checked', true);
                }
            });
        } else {
<<<<<<< HEAD
            angular.forEach($scope.ship_data_county, function (val, index) {
=======
            angular.forEach($scope.ship_data_county, function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (angular.element('#shipping_county_' + $scope.ship_data_county[index].id).is(':checked')) {
                    angular.element('#shipping_county_' + $scope.ship_data_county[index].id).prop('checked', false);
                }
            });
        }
    }

<<<<<<< HEAD
    $scope.get_county_shipping_agent = function () {
=======
    $scope.get_county_shipping_agent = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.areas_tab = "county";
        $scope.title = "Counties";
        $scope.showShipLoader = true;
        $scope.ship_sale_areas = [];
        $scope.checkedsale = 0;

        var prodApi = $scope.$root.pr + "srm/srm/srm-counties";

        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.areas_county.spage,
            'county_keyword': angular.element('#search_sale_add_listing_data').val()
        };
        $http
            .post(prodApi, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {

                    $scope.areas_county.total_pages = res.data.total_pages;
                    $scope.areas_county.cpage = res.data.cpage;
                    $scope.areas_county.ppage = res.data.ppage;
                    $scope.areas_county.npage = res.data.npage;
                    $scope.areas_county.pages = res.data.pages;

                    $scope.ship_data_county = [];
                    $scope.ship_column_county = [];

                    $scope.ship_data_county = res.data.response;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.ship_column_county.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

<<<<<<< HEAD
                    angular.forEach(res.data.counties, function (val, index) {
=======
                    angular.forEach(res.data.counties, function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        angular.element('#shipping_county_' + res.data.counties[index]).prop('checked', true);
                    });

                    $scope.showShipLoader = false;

                } else {
                    $scope.areas_county = {};
                    $scope.ship_data_county = [];
                    $scope.ship_column_county = [];
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });

        $scope.showShipLoader = false;
    }

    $scope.areas_area = {};
    $scope.ship_data_area = [];
    $scope.ship_column_area = [];

<<<<<<< HEAD
    $scope.setAreaSelectPage = function (pageno) {
        $scope.areas_area.spage = pageno;
    }

    $scope.checkAllAreas = function () {
        if (angular.element('#checkAllAreas').is(':checked')) {
            angular.forEach($scope.ship_data_area, function (val, index) {
=======
    $scope.setAreaSelectPage = function(pageno) {
        $scope.areas_area.spage = pageno;
    }

    $scope.checkAllAreas = function() {
        if (angular.element('#checkAllAreas').is(':checked')) {
            angular.forEach($scope.ship_data_area, function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (!angular.element('#shipping_area_' + $scope.ship_data_area[index].id).is(':checked')) {
                    angular.element('#shipping_area_' + $scope.ship_data_area[index].id).prop('checked', true);
                }
            });
        } else {
<<<<<<< HEAD
            angular.forEach($scope.ship_data_area, function (val, index) {
=======
            angular.forEach($scope.ship_data_area, function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (angular.element('#shipping_area_' + $scope.ship_data_area[index].id).is(':checked')) {
                    angular.element('#shipping_area_' + $scope.ship_data_area[index].id).prop('checked', false);
                }
            });
        }
    }

<<<<<<< HEAD
    $scope.get_area_shipping_agent = function () {
=======
    $scope.get_area_shipping_agent = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.areas_tab = "area";
        $scope.title = "Areas";
        $scope.showShipLoader = true;

        var prodApi = $scope.$root.pr + "srm/srm/srm-areas1";

        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.areas_area.spage,
            'name_keyword': angular.element('#search_sale_add_listing_data').val()
        };
        $http
            .post(prodApi, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {

                    $scope.areas_area.total_pages = res.data.total_pages;
                    $scope.areas_area.cpage = res.data.cpage;
                    $scope.areas_area.ppage = res.data.ppage;
                    $scope.areas_area.npage = res.data.npage;
                    $scope.areas_area.pages = res.data.pages;

                    $scope.ship_data_area = [];
                    $scope.ship_column_area = [];

                    $scope.ship_data_area = res.data.response;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.ship_column_area.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });


<<<<<<< HEAD
                    angular.forEach(res.data.areas, function (val, index) {
=======
                    angular.forEach(res.data.areas, function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        angular.element('#shipping_area_' + res.data.areas[index]).prop('checked', true);
                    });

                    $scope.showShipLoader = false;

                } else {
                    $scope.areas_area = {};
                    $scope.ship_data_area = [];
                    $scope.ship_column_area = [];
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });

        $scope.showShipLoader = false;
    }

    $scope.sale_area = {};
    $scope.sale_area.spage = 1;

<<<<<<< HEAD
    $scope.setSaleSelectPage = function (pageno) {
=======
    $scope.setSaleSelectPage = function(pageno) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.sale_area.spage = pageno;
    }


<<<<<<< HEAD
    $scope.get_sale_shipping_agent = function () {
=======
    $scope.get_sale_shipping_agent = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.showLoader = true;
        $scope.ship_sale_areas = [];
        $scope.checkedsale = 0;

        $scope.$root.breadcrumbs[3].name = 'Shipping Areas';

        $scope.shipinglistingShow = true;
        $scope.shipinglistingShowForm = true;
        $scope.customers_list = true;
        $scope.btnCancelUrl = 'app.get_shipping_agent';


        var prodApi = $scope.$root.pr + "srm/srm/srm-sale-areas";
        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.sale_area.spage,
            'keyword': angular.element('#search_sale_area_data').val()
        };
        $http
            .post(prodApi, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {

                    $scope.sale_area.total_pages = res.data.total_pages;
                    $scope.sale_area.cpage = res.data.cpage;
                    $scope.sale_area.ppage = res.data.ppage;
                    $scope.sale_area.npage = res.data.npage;
                    $scope.sale_area.pages = res.data.pages;

                    $scope.ship_sale_data = [];
                    $scope.ship_sale_column = [];

                    $scope.ship_sale_data = res.data.response;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.ship_sale_column.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    $scope.showLoader = false;

                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });


    };

    $scope.ship_sale_areas = [];
    $scope.checkedsale = 0;
<<<<<<< HEAD
    $scope.selectSaleItem = function (obj) {
=======
    $scope.selectSaleItem = function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if (angular.element('#shipping_area_' + obj.id).is(':checked')) {
            $scope.ship_sale_areas.push({
                'id': obj.id,
                'postcode': obj.postcode,
                'name': obj.name,
                'county': obj.county,
                'nuts_region': obj.nuts_region,
                'country': obj.country
            });
            $scope.checkedsale += 1;
        } else {
            var ship_areas = $scope.ship_sale_areas;
            for (var i = 0; i < ship_areas.length; i += 1) {
                if (ship_areas[i]['id'] == obj.id) {
                    $scope.checkedsale -= 1;
                    $scope.ship_sale_areas.splice(i, 1);
                }
            }
        }

    };

<<<<<<< HEAD
    $scope.addSaleAreas = function () {
=======
    $scope.addSaleAreas = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var prodApi = $scope.$root.pr + "srm/srm/srm-add-sale-areas";

        var postData = {
            'token': $scope.$root.token,
            'crm_id': $scope.$root.srm_id,
            'data': $scope.ship_sale_areas
        };
        $http
            .post(prodApi, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $scope.checkedsale = 0;
                    angular.element('#modalAreas').modal('hide');
                    $scope.get_sale_shipping_agent();
                } else {
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
                }

            });
    };

<<<<<<< HEAD
    $scope.addSaleArea = function (type) {
=======
    $scope.addSaleArea = function(type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var prodApi = $scope.$root.pr + "srm/srm/srm-add-sale-area";
        var areas = [];
        var areas_old = [];
        var message = "";
        if (type == 1) {
<<<<<<< HEAD
            angular.forEach($scope.ship_data_country, function (val, index) {
=======
            angular.forEach($scope.ship_data_country, function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (angular.element('#shipping_country_' + $scope.ship_data_country[index].id).is(':checked')) {
                    areas.push({ 'id': $scope.ship_data_country[index].id });
                    areas_old.push({ 'id': $scope.ship_data_country[index].id });
                } else {
                    areas_old.push({ 'id': $scope.ship_data_country[index].id });
                }
            });
            message = "Countries";
        } else if (type == 2) {
<<<<<<< HEAD
            angular.forEach($scope.ship_data_region, function (val, index) {
=======
            angular.forEach($scope.ship_data_region, function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (angular.element('#shipping_region_' + $scope.ship_data_region[index].id).is(':checked')) {
                    areas.push({ 'id': $scope.ship_data_region[index].id });
                    areas_old.push({ 'id': $scope.ship_data_region[index].id });
                } else {
                    areas_old.push({ 'id': $scope.ship_data_region[index].id });
                }
            });
            message = "Region";
        } else if (type == 3) {
<<<<<<< HEAD
            angular.forEach($scope.ship_data_county, function (val, index) {
=======
            angular.forEach($scope.ship_data_county, function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (angular.element('#shipping_county_' + $scope.ship_data_county[index].id).is(':checked')) {
                    areas.push({ 'id': $scope.ship_data_county[index].id });
                    areas_old.push({ 'id': $scope.ship_data_county[index].id });
                } else {
                    areas_old.push({ 'id': $scope.ship_data_county[index].id });
                }
            });
            message = "County";
        } else if (type == 4) {
<<<<<<< HEAD
            angular.forEach($scope.ship_data_area, function (val, index) {
=======
            angular.forEach($scope.ship_data_area, function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (angular.element('#shipping_area_' + $scope.ship_data_area[index].id).is(':checked')) {
                    areas.push({ 'id': $scope.ship_data_area[index].id });
                    areas_old.push({ 'id': $scope.ship_data_area[index].id });
                } else {
                    areas_old.push({ 'id': $scope.ship_data_area[index].id });
                }
            });
            message = "Area";
        }
        var postData = {
            'token': $scope.$root.token,
            'srm_id': $scope.$root.srm_id,
            'data': areas,
            'data_old': areas_old,
            'type': type
        };
        $http
            .post(prodApi, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $scope.checkedsale = 0;
                } else {
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
                }

            });
    };

<<<<<<< HEAD
    $scope.deleteSaleArea = function (id) {
=======
    $scope.deleteSaleArea = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var prodApi = $scope.$root.pr + "srm/srm/srm-delete-sale-area";

        var postData = {
            'token': $scope.$root.token,
            'id': id
        };
        $http
            .post(prodApi, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    toaster.pop('success', 'Delete', $scope.$root.getErrorMessageByCode(103));
                    $scope.get_sale_shipping_agent();
                } else {
                    toaster.pop('error', 'Delete', $scope.$root.getErrorMessageByCode(104));
                }

            });

    };

<<<<<<< HEAD
    $scope.showAreas = function () {
=======
    $scope.showAreas = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        angular.element('#modalAreas').modal({
            show: true
        });
    }

<<<<<<< HEAD
    $scope.resetSearch = function (id) {
=======
    $scope.resetSearch = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        angular.element('#' + id).val('');
    }

    $scope.location_id = 0;

<<<<<<< HEAD
    $scope.showSaleLoader = function () {
=======
    $scope.showSaleLoader = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.showLocationLoader = true;
        $scope.showLocationLoader = false;
    }

<<<<<<< HEAD
    $scope.get_sale_area = function (locationid) {
=======
    $scope.get_sale_area = function(locationid) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.showPriceLoader = true;

        if (locationid == 1 || locationid == 2) {
            $scope.location_id = locationid;
            $scope.sale_area.spage = 1;
        }
        $scope.title = 'Locations';
        var empUrl = $scope.$root.pr + "srm/srm/srm-sale-areas";

        $http
            .post(empUrl, {
                'token': $scope.$root.token,
                'id': $scope.$root.srm_id,
                'page': $scope.sale_area.spage,
                'keyword': angular.element('#search_sale_price_data').val()
            })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {

                    $scope.sale_area.total_pages = res.data.total_pages;
                    $scope.sale_area.cpage = res.data.cpage;
                    $scope.sale_area.ppage = res.data.ppage;
                    $scope.sale_area.npage = res.data.npage;
                    $scope.sale_area.pages = res.data.pages;

                    $scope.record_ship = {};
                    $scope.columns_ship = [];
                    $scope.record_ship = res.data.response;
<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columns_ship.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });


                    $scope.record = {};
                    $scope.columnss = [];
                    $scope.total = 0;
                    $scope.record = res.data.response;
                    $scope.total = res.data.total;
<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columnss.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    if (locationid == 1 || locationid == 2) {
                        ngDialog.openConfirm({
                            template: 'app/views/srm/_listing_location.html',
                            className: 'ngdialog-theme-default',
                            scope: $scope
<<<<<<< HEAD
                        }).then(function (result) {
                            if ($scope.location_id == 1) {
                                $scope.rec.valid_from = result.name;
                                $scope.rec.valid_from_id = result.id;
                            }
                            if ($scope.location_id == 2) {
                                $scope.rec.valid_to = result.name;
                                $scope.rec.valid_to_id = result.id;
                            }
                        },
                            function (reason) {
=======
                        }).then(function(result) {
                                if ($scope.location_id == 1) {
                                    $scope.rec.valid_from = result.name;
                                    $scope.rec.valid_from_id = result.id;
                                }
                                if ($scope.location_id == 2) {
                                    $scope.rec.valid_to = result.name;
                                    $scope.rec.valid_to_id = result.id;
                                }
                            },
                            function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                console.log('Modal promise rejected. Reason: ', reason);
                            });
                    }
                } else {
                    $scope.sale_area = {};
                    $scope.record_ship = {};
                    $scope.columns_ship = [];
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Area(s) From Area Covered']));
                }

            });

        $scope.showPriceLoader = false;

    }

    $scope.areas_shipping_country = {};
    $scope.ship_data_countries = [];
    $scope.ship_column_countries = [];

<<<<<<< HEAD
    $scope.setShipCountrySelectPage = function (pageno) {
=======
    $scope.setShipCountrySelectPage = function(pageno) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.areas_shipping_country.spage = pageno;
        $scope.areas_listing_tab = "country";
    }

<<<<<<< HEAD
    $scope.get_shipping_countries = function () {
=======
    $scope.get_shipping_countries = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.shipinglistingShow = true;
        $scope.shipinglistingShowForm = true;

        $scope.showLoader = true;
        var prodApi = $scope.$root.pr + "srm/srm/srm-sale-countries";

        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.areas_shipping_country.spage,
            'country_keyword': angular.element('#search_sale_listing_data').val()
        };
        $http
            .post(prodApi, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {

                    $scope.areas_shipping_country.total_pages = res.data.total_pages;
                    $scope.areas_shipping_country.cpage = res.data.cpage;
                    $scope.areas_shipping_country.ppage = res.data.ppage;
                    $scope.areas_shipping_country.npage = res.data.npage;
                    $scope.areas_shipping_country.pages = res.data.pages;

                    $scope.ship_data_countries = [];
                    $scope.ship_column_countries = [];

                    $scope.ship_data_countries = res.data.response;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.ship_column_countries.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    $scope.showLoader = false;
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });

        $scope.showLoader = false;
    }

    $scope.areas_shipping_region = {};
    $scope.ship_data_regions = [];
    $scope.ship_column_regions = [];

<<<<<<< HEAD
    $scope.setShipRegionSelectPage = function (pageno) {
=======
    $scope.setShipRegionSelectPage = function(pageno) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.areas_shipping_region.spage = pageno;
        $scope.areas_listing_tab = "region";
    }

<<<<<<< HEAD
    $scope.get_shipping_regions = function () {
=======
    $scope.get_shipping_regions = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.showLoader = true;

        var prodApi = $scope.$root.pr + "srm/srm/srm-sale-regions";

        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.areas_shipping_region.spage,
            'region_keyword': angular.element('#search_sale_listing_data').val()
        };
        $http
            .post(prodApi, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {

                    $scope.areas_shipping_region.total_pages = res.data.total_pages;
                    $scope.areas_shipping_region.cpage = res.data.cpage;
                    $scope.areas_shipping_region.ppage = res.data.ppage;
                    $scope.areas_shipping_region.npage = res.data.npage;
                    $scope.areas_shipping_region.pages = res.data.pages;

                    $scope.ship_data_regions = [];
                    $scope.ship_column_regions = [];

                    $scope.ship_data_regions = res.data.response;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.ship_column_regions.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    $scope.showLoader = false;

                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });


        $scope.showLoader = false;
    }

    $scope.areas_shipping_county = {};
    $scope.ship_data_counties = [];
    $scope.ship_column_counties = [];

<<<<<<< HEAD
    $scope.setShipCountySelectPage = function (pageno) {
=======
    $scope.setShipCountySelectPage = function(pageno) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.areas_shipping_county.spage = pageno;
        $scope.areas_listing_tab = "county";
    }

<<<<<<< HEAD
    $scope.get_shipping_counties = function () {
=======
    $scope.get_shipping_counties = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.showLoader = true;

        var prodApi = $scope.$root.pr + "srm/srm/srm-sale-counties";

        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.areas_shipping_county.spage,
            'county_keyword': angular.element('#search_sale_listing_data').val()
        };
        $http
            .post(prodApi, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {

                    $scope.areas_shipping_county.total_pages = res.data.total_pages;
                    $scope.areas_shipping_county.cpage = res.data.cpage;
                    $scope.areas_shipping_county.ppage = res.data.ppage;
                    $scope.areas_shipping_county.npage = res.data.npage;
                    $scope.areas_shipping_county.pages = res.data.pages;

                    $scope.ship_data_counties = [];
                    $scope.ship_column_counties = [];

                    $scope.ship_data_counties = res.data.response;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.ship_column_counties.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    $scope.showLoader = false;

                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });

        $scope.showLoader = false;
    }

    $scope.areas_shipping_area = {};
    $scope.ship_data_areas = [];
    $scope.ship_column_areas = [];

<<<<<<< HEAD
    $scope.setShipAreaSelectPage = function (pageno) {
=======
    $scope.setShipAreaSelectPage = function(pageno) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.areas_shipping_area.spage = pageno;
        $scope.areas_listing_tab = "area";
    }

<<<<<<< HEAD
    $scope.get_shipping_areas = function () {
=======
    $scope.get_shipping_areas = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.showLoader = true;

        var prodApi = $scope.$root.pr + "srm/srm/srm-saleareas";

        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.areas_shipping_area.spage,
            'name_keyword': angular.element('#search_sale_listing_data').val()
        };
        $http
            .post(prodApi, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {

                    $scope.areas_shipping_area.total_pages = res.data.total_pages;
                    $scope.areas_shipping_area.cpage = res.data.cpage;
                    $scope.areas_shipping_area.ppage = res.data.ppage;
                    $scope.areas_shipping_area.npage = res.data.npage;
                    $scope.areas_shipping_area.pages = res.data.pages;

                    $scope.ship_data_areas = [];
                    $scope.ship_column_areas = [];

                    $scope.ship_data_areas = res.data.response;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.ship_column_areas.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    $scope.showLoader = false;

                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });

        $scope.showLoader = false;
    }

    //Area
<<<<<<< HEAD
    $scope.get_shipping_agent_pre = function () {
=======
    $scope.get_shipping_agent_pre = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.$root.breadcrumbs[3].name = 'Shipping';

        $scope.shipinglistingShow = true;
        $scope.shipinglistingShowForm = true;
        $scope.customers_list = true;
        document.getElementById("display_area_record").innerHTML = '';
        $scope.btnCancelUrl = 'app.get_shipping_agent';


        var postUrl = $scope.$root.pr + "srm/srm/srm-shipping";
        $http
            .post(postUrl, { 'token': $scope.$root.token, 'id': $scope.$root.srm_id })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.response != null) {
                    $scope.ship_data = [];
                    $scope.ship_column = [];

                    $scope.ship_data = res.data.response;
<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.ship_column.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }

            });

    }

<<<<<<< HEAD
    $scope.add_srm_shipping = function (rec) {
=======
    $scope.add_srm_shipping = function(rec) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        rec.srm_id = $scope.$root.srm_id;
        rec.token = $scope.$root.token;
        rec.shipping_method = $scope.rec.shipping_methods !== undefined ? $scope.rec.shipping_methods.id : 0;
        rec.price_method = $scope.rec.price_methods !== undefined ? $scope.rec.price_methods.id : 0;


        var altAddUrl = $scope.$root.pr + "srm/srm/add-srm-shipping";

        $http
            .post(altAddUrl, rec)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                //	$scope.$root.count = $scope.$root.count+1;
                if (res.data.ack == true) {

                    if (rec.id > 0)
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    else {
                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                    }
                    document.getElementById("display_area_record").innerHTML = '';

                    $scope.get_shipping_agent();

                } else {
                    if (rec.id == 0)
                        toaster.pop('error', 'Edit', res.data.error);
                    // toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(104));
                    else
                        toaster.pop('error', 'Info', res.data.error);
                    //  toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(104));
                }
            });

    }

<<<<<<< HEAD
    $scope.edit_shipping_Form = function (id) {
=======
    $scope.edit_shipping_Form = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.check_readonly = true;
        $scope.showLoader = true;
        $scope.customers_list = false;

        var altcontUrl = $scope.$root.pr + "srm/srm/get-srm-shipping-by-id";
        var postViewData = {
            'token': $scope.$root.token,
            'id': id
        };

        $http
            .post(altcontUrl, postViewData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                $scope.rec = res.data.response;
                $scope.rec.id = res.data.response.id;
                $scope.rec.update_id = res.data.response.id;

<<<<<<< HEAD
                angular.forEach($scope.price_method_list, function (obj) {
=======
                angular.forEach($scope.price_method_list, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id == res.data.response.price_method) {
                        $scope.rec.price_methods = obj;
                    }
                });

<<<<<<< HEAD
                angular.forEach($scope.shiping_list, function (obj) {
=======
                angular.forEach($scope.shiping_list, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id == res.data.response.shipping_method) {
                        $scope.rec.shipping_methods = obj;
                    }
                });
            });
        $scope.showLoader = false;
    }

<<<<<<< HEAD
    $scope.delete_shipping = function (id, index, arr_data) {
=======
    $scope.delete_shipping = function(id, index, arr_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var delUrl = $scope.$root.pr + "srm/srm/delete-srm-shipping";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
=======
        }).then(function(value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.columns = [];
    $scope.record = {};
    $scope.formData_customer = {};
    $scope.selected = 0;
    $scope.total = 0;
    $scope.selected_count = 0;

<<<<<<< HEAD
    $scope.viewAllCustomers = function (id) {
=======
    $scope.viewAllCustomers = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.formData_customer = {};
        $scope.title = 'Area';
        angular.element('#model_btn_cs').modal({
            show: true
        });

        var sale_Url = $scope.$root.pr + "srm/srm/get-coverage-all-areas";
        var postData_sale = {
            'token': $scope.$root.token,
            'id': id
        };
        $http
            .post(sale_Url, postData_sale)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.formData_customer.update_id = id;

                    $scope.selection_record = {};
                    $scope.columnss = [];

                    $scope.selection_record = res.data.response;
                    $scope.total = res.data.total;
                    $scope.selected_count = res.data.selected_count;
                    $scope.from_selected = true;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columnss.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });


<<<<<<< HEAD
                    angular.forEach(res.data.response, function (value, key) {
                        if (value.checked == 1)
                            //  console.log('#selected_'+value.id);
=======
                    angular.forEach(res.data.response, function(value, key) {
                        if (value.checked == 1)
                        //  console.log('#selected_'+value.id);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            angular.element('#selected_' + value.id).click();
                        //	 $(".selected_"+value.id).click(); 
                    });
                }
            });

    }

<<<<<<< HEAD
    $scope.checkAll_cancel = function () {
=======
    $scope.checkAll_cancel = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var bool = true;
        if ($scope.selectedAll == false) {
            bool = false;
        }
        $scope.from_ch_selected = true;
        $scope.from_selected = false;
<<<<<<< HEAD
        angular.forEach($scope.selection_record, function (item) {
=======
        angular.forEach($scope.selection_record, function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            if (item.Selected == true) {

                item.Selected = false;

            } else {
                item.Selected = bool;

            }
        });
    };


    //add_customer
<<<<<<< HEAD
    $scope.add_customer = function (formData_customer) {

        $scope.selectedList = $scope.selection_record.filter(function (namesDataItem) {
=======
    $scope.add_customer = function(formData_customer) {

        $scope.selectedList = $scope.selection_record.filter(function(namesDataItem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            return namesDataItem.Selected;
        });
        var test_name = '';
        var test_id = '';
        var customer_price = '';
<<<<<<< HEAD
        angular.forEach($scope.selectedList, function (obj) {
=======
        angular.forEach($scope.selectedList, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            for (var i = 0; i < $scope.selection_record.length; i++) {
                var object = $scope.selection_record[i];
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

            document.getElementById("display_record").innerHTML = test_name;
            $scope.formData_customer.coverage_area2 = test_name;
            $scope.formData_customer.coverage_area_id2 = test_id;
            $scope.formData_customer.coverage_price2 = customer_price;
        });

        $scope.formData_customer.product_id = $stateParams.id;
        $scope.formData_customer.token = $scope.$root.token;
        //	console.log(formData_customer);return;
        var updateUrl = $scope.$root.pr + "srm/srm/add-customer";
        $http
            .post(updateUrl, formData_customer)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (res.data.ack == true) {
                    $scope.get_shipping_agent();
                    angular.element('#model_btn_cs').modal('hide');
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));

                } else {
                    toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(104));
                }
            });
    }

    //---------------- Area    ------------------------

<<<<<<< HEAD
    $scope.get_area = function () {
=======
    $scope.get_area = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // $scope.$root.breadcrumbs[3].name = 'Area';

        $scope.arealistingShow = true;
        $scope.arealistingShowForm = false;


        $scope.showLoader = true;
        var API = $scope.$root.pr + "srm/srm/srm-area";
        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.item_paging.spage
<<<<<<< HEAD
            //'country_keyword': angular.element('#search_sale_listing_data').val()
        };
        $http
            .post(API, $scope.postData)
            .then(function (res) {
=======
                //'country_keyword': angular.element('#search_sale_listing_data').val()
        };
        $http
            .post(API, $scope.postData)
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                $scope.area_data = [];
                $scope.columns = [];
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;


                    $scope.area_data = res.data.response;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

        $scope.showLoader = false;
    }

<<<<<<< HEAD
    $scope.area_add_Form = function () {
=======
    $scope.area_add_Form = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.arealistingShow = false;
        $scope.arealistingShowForm = true;

        $scope.check_readonly = false;
        //$scope.rec = {};
    }

<<<<<<< HEAD
    $scope.add_area = function (rec) {
=======
    $scope.add_area = function(rec) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        rec.srm_id = $scope.$root.srm_id;
        rec.token = $scope.$root.token;
        rec.shipping_method = $scope.rec.shipping_methods !== undefined ? $scope.rec.shipping_methods.id : 0;
        rec.price_method = $scope.rec.price_methods !== undefined ? $scope.rec.price_methods.id : 0;

        var altAddUrl = $scope.$root.pr + "srm/srm/add-srm-area";
        $http
            .post(altAddUrl, rec)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                //	$scope.$root.count = $scope.$root.count+1;
                if (res.data.ack == true) {

                    if (rec.id > 0)
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    else {
                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                    }

                    $scope.get_area();

                } else {
                    if (rec.id == 0)
                        toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(104));
                    else
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(104));
                }
            });

    }

<<<<<<< HEAD
    $scope.edit_area = function (id) {
=======
    $scope.edit_area = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.check_readonly = true;
        $scope.showLoader = true;

        $scope.arealistingShow = false;
        $scope.arealistingShowForm = true;

        var altcontUrl = $scope.$root.pr + "srm/srm/get-srm-area-by-id";
        //var altcontUrl = $scope.$root.pr+"srm/supplier/get-supplier-area-by-id";
        var postViewData = {
            'token': $scope.$root.token,
            'id': id
        };
        $http
            .post(altcontUrl, postViewData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.rec = res.data.response;
                $scope.rec.id = res.data.response.id;
                $scope.rec.update_id = res.data.response.id;

<<<<<<< HEAD
                angular.forEach($scope.price_method_list, function (obj) {
=======
                angular.forEach($scope.price_method_list, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id == res.data.response.price_method) {
                        $scope.rec.price_methods = $scope.price_method_list[index];
                    }
                });
<<<<<<< HEAD
                angular.forEach($scope.shiping_list, function (obj) {
=======
                angular.forEach($scope.shiping_list, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id == res.data.response.shipping_method) {
                        $scope.rec.shipping_methods = $scope.shiping_list[index];
                    }
                });
            });
        $scope.showLoader = false;
    }

<<<<<<< HEAD
    $scope.delete_area = function (id, index, arr_data) {
=======
    $scope.delete_area = function(id, index, arr_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        // 	var delUrl = $scope.$root.pr+"supplier/supplier/delete-supplier-area";
        var delUrl = $scope.$root.pr + "srm/srm/delete-srm-area";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
=======
        }).then(function(value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    //---------------- Area    ------------------------
    // ---------------- Shipping   	 -----------------------------------------

<<<<<<< HEAD
    $scope.reload_popup = function (div_id, div_model) {
=======
    $scope.reload_popup = function(div_id, div_model) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


        angular.element('#' + div_model).modal('hide');
        //  $scope.show_p_unit_pop = false;  
        if (div_id == 1) {
            $scope.rec.price_methods = $scope.price_method_list[0];
        } else if (div_id == 2) {
            $scope.rec.shipping_methods = $scope.shiping_list[0];
        } else if (div_id == 3) {
            $scope.rec.offer_method_ids = $scope.price_method_list[0];
<<<<<<< HEAD
        }

        else if (div_id == 7) {
=======
        } else if (div_id == 7) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.formData.volume_1 = $scope.arr_volume_1[0];
        } else if (div_id == 8) {
            $scope.formData.volume_2 = $scope.arr_volume_2[0];
        } else if (div_id == 9) {
            $scope.formData.volume_3 = $scope.arr_volume_3[0];

        } else if (div_id == 10) {
            $scope.formData.volume_1 = $scope.arr_volume_purchase_1[0];
        } else if (div_id == 11) {
            $scope.formData.volume_2 = $scope.arr_volume_purchase_2[0];
        } else if (div_id == 12) {
            $scope.formData.volume_3 = $scope.arr_volume_purchase_3[0];
        }
    }

    // ------------- 	 add method    	 ----------------------------------------

    $scope.formData6 = {};
<<<<<<< HEAD
    $scope.onChangmethod = function () {
=======
    $scope.onChangmethod = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var id = this.rec.price_methods.id;

        //	console.log(id);
        if (id == -1)
            angular.element('#modal_method').modal({
                show: true
            });


        $("#name").val('');
        $scope.name = '';
    }

<<<<<<< HEAD
    $scope.add_method_pop = function (formData6) {
=======
    $scope.add_method_pop = function(formData6) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var addcountriesUrl = $scope.$root.pr + "srm/srm/add-shiping-list";
        $scope.formData6.token = $scope.$root.token;
        $scope.formData6.data = $scope.formFields;
        $http
            .post(addcountriesUrl, formData6)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    angular.element('#model_method').modal('hide');
                    toaster.pop('success', 'Add', 'Record  Inserted.');
                    $('#modal_method').modal('hide');

                    $http
                        .post(method_url, { 'token': $scope.$root.token })
<<<<<<< HEAD
                        .then(function (res) {
=======
                        .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (res.data.ack == true) {
                                $scope.price_method_list = res.data.response;
                                if ($scope.user_type == 1) {
                                    $scope.price_method_list.push({ 'id': '-1', 'name': '++ Add New ++' });
                                }

                            }
                            //else 	toaster.pop('error', 'Error', "No brand found!");
                        });
                } else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
            });
    }

<<<<<<< HEAD
    $scope.onChangeprice = function () {
=======
    $scope.onChangeprice = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var id = this.rec.offer_method_ids.id;

        if (id == -1)
            angular.element('#modal_method2').modal({
                show: true
            });


        $("#name").val('');
        $scope.name = '';
    }

<<<<<<< HEAD
    $scope.onChangeshipping = function () {
=======
    $scope.onChangeshipping = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var id = this.rec.shipping_methods.id;

        if (id == -1)
            angular.element('#modal_shiping').modal({
                show: true
            });


        $("#name").val('');
        $scope.name = '';
    }

<<<<<<< HEAD
    $scope.add_shipping_pop = function (formData6) {
=======
    $scope.add_shipping_pop = function(formData6) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var add_shipping_method_url = $scope.$root.pr + "srm/srm/add-shiping-list";
        $scope.formData6.token = $scope.$root.token;
        $scope.formData6.data = $scope.formFields;
        $http
            .post(add_shipping_method_url, formData6)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {

                    toaster.pop('success', 'Add', 'Record  Inserted.');
                    angular.element('#modal_shiping').modal('hide');

                    $http
                        .post(shipping_method_url, { 'token': $scope.$root.token })
<<<<<<< HEAD
                        .then(function (res) {
=======
                        .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                            if (res.data.ack == true) {
                                $scope.shiping_list = res.data.response;
                                if ($scope.user_type == 1) {
                                    $scope.shiping_list.push({ 'id': '-1', 'name': '++ Add New ++' });
                                }

                            }
                            //else 	toaster.pop('error', 'Error', "No brand found!");
                        });
                } else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
            });
    }


    // ---------------- Price List   	 -----------------------------------------

    $scope.wordsLength = 0;
    $scope.arr_unit_of_measure = [];
    $scope.arr_OfferMethod = [];

    var constUrl = $scope.$root.setup + "ledger-group/get-predefine-by-type";
    var currencyUrl = $scope.$root.setup + "general/currency-list";

    var volumeUrl_item = $scope.$root.stock + "unit-measure/get-sale-offer-volume-by-type";
    var addvolumeUrl_item = $scope.$root.stock + "unit-measure/add-sale-offer-volume";

    var get_unit_setup_category = $scope.$root.stock + "unit-measure/get-unit-setup-list-category";
    var get_rec_url = $scope.$root.stock + "unit-measure/get-unit-record-popup";
    var add_unitUrl_item = $scope.$root.stock + "unit-measure/add-unit-record-popup";


    var volumeUrl_service = $scope.$root.setup + "service/products-listing/get-price-offer-volume-by-type";
    var addvolumeUrl_service = $scope.$root.setup + "service/products-listing/add-service-price-offer-volumes";

    var unitUrl_service = $scope.$root.setup + "service/unit-measure/get-all-unit";
    var add_unitUrl_service = $scope.$root.setup + "service/unit-measure/add-unit";

    $scope.items = {};
    $scope.services = {};
    $scope.showItms = true;
    $scope.showServ = true;
    var prodApi_setup = $scope.$root.stock + "products-listing/get-products-popup";
<<<<<<< HEAD
    $scope.getProduct = function () {
=======
    $scope.getProduct = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if ($scope.rec.update_id != undefined) {
            if ($scope.rec.type == 1)
                $scope.getProductListing();
            if ($scope.rec.type == 2)
                $scope.getServices();
        } else
            $scope.getProductListing();
        angular.element('#itemServModal').modal({ show: true });
    }

<<<<<<< HEAD
    $scope.getProductListing = function () {
=======
    $scope.getProductListing = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.title = 'Items';
        $scope.rec.type = 1;
        // var prodApi = $scope.$root.stock + "products-listing/get-purchase-products-popup";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
            'suppler_id': $stateParams.id
        };
        $http
            .post(prodApi_setup, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.items = res.data.response;
                }
            });
    }

<<<<<<< HEAD
    $scope.getServices = function () {
=======
    $scope.getServices = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.title = 'Services';
        $scope.rec.type = 2;
        var postData = "";
        var prodApi = $scope.$root.setup + "service/products-listing/get-products-popup";
        postData = {
            'token': $scope.$root.token,
            'all': "1"
        };
        $http
            .post(prodApi, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.services = res.data.response;
                }
            });
    }

<<<<<<< HEAD
    $scope.addItem = function (item, type) {
=======
    $scope.addItem = function(item, type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.product_description = item.description;
        $scope.rec.type = type;
        $scope.rec.product_id = item.id;
        $scope.rec.product_code = $scope.product_code;
        $scope.rec.product_description = $scope.product_description;

        if (type == 1) {
            $scope.product_code = item.product_code;
            $scope.get_item_voume_list(1, $scope.rec.product_id);
        }
        if (type == 2) {
            $scope.product_code = item.code;
            $scope.get_service_voume_list(1);
        }

        $scope.rec.list_category_check = type;

        //console.log(item.unit_price);
        if (item.unit_price == null)
            $scope.rec.volume_1_price = $scope.rec.volume_2_price = $scope.rec.volume_3_price = item.standard_price;
        else
            $scope.rec.volume_1_price = $scope.rec.volume_2_price = $scope.rec.volume_3_price = item.unit_price;

        angular.element('#itemServModal').modal('hide');
    }


<<<<<<< HEAD
    $scope.get_item_voume_list = function (arg, product_id) {
=======
    $scope.get_item_voume_list = function(arg, product_id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        //console.log(product_id);
        $scope.arr_volume_1 = [];
        $scope.arr_volume_2 = [];
        $scope.arr_volume_3 = [];
        $scope.arr_volume_purchase_1 = [];
        $scope.arr_volume_purchase_2 = [];
        $scope.arr_volume_purchase_3 = [];

        $scope.arr_volume_1 = {};
        $scope.arr_volume_2 = {};
        $scope.arr_volume_3 = {};
        $scope.arr_volume_purchase_1 = {};
        $scope.arr_volume_purchase_2 = {};
        $scope.arr_volume_purchase_3 = {};

        $http
            .post(volumeUrl_item, {
                type: 'Volume 1',
                category: arg,
                'product_id': product_id,
                'token': $scope.$root.token
            })
<<<<<<< HEAD
            .then(function (vol_data) {
=======
            .then(function(vol_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (arg == 1) {
                    $scope.arr_volume_1 = vol_data.data.response;

                    if ($scope.arr_volume_1.length == 0) {
                        $scope.arr_volume_1.push({ 'id': '-1', 'name': '++ Add New ++' });
                    } else if ($scope.arr_volume_1.length > 0)
                        if ($scope.user_type == 1)
                            $scope.arr_volume_1.push({ 'id': '-1', 'name': '++ Add New ++' });


                } else if (arg == 2) {
                    $scope.arr_volume_purchase_1 = vol_data.data.response;

                    if ($scope.arr_volume_purchase_1.length == 0) {
                        $scope.arr_volume_purchase_1.push({ 'id': '-1', 'name': '++ Add New ++' });
                    } else if ($scope.arr_volume_purchase_1.length > 0)
                        if ($scope.user_type == 1)
                            $scope.arr_volume_purchase_1.push({ 'id': '-1', 'name': '++ Add New ++' });
                }


            });

        $http
            .post(volumeUrl_item, {
                type: 'Volume 2',
                category: arg,
                'product_id': product_id,
                'token': $scope.$root.token
            })
<<<<<<< HEAD
            .then(function (vol_data) {
=======
            .then(function(vol_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (arg == 1) {
                    $scope.arr_volume_2 = vol_data.data.response;


                    if ($scope.arr_volume_2.length == 0) {
                        $scope.arr_volume_2.push({ 'id': '-1', 'name': '++ Add New ++' });
                    } else if ($scope.arr_volume_2.length > 0)
                        if ($scope.user_type == 1)
                            $scope.arr_volume_2.push({ 'id': '-1', 'name': '++ Add New ++' });


                } else if (arg == 2) {
                    $scope.arr_volume_purchase_2 = vol_data.data.response;


                    if ($scope.arr_volume_purchase_2.length == 0) {
                        $scope.arr_volume_purchase_2.push({ 'id': '-1', 'name': '++ Add New ++' });
                    } else if ($scope.arr_volume_purchase_2.length > 0)
                        if ($scope.user_type == 1)
                            $scope.arr_volume_purchase_2.push({ 'id': '-1', 'name': '++ Add New ++' });


                }

            });

        $http
            .post(volumeUrl_item, {
                type: 'Volume 3',
                category: arg,
                'product_id': product_id,
                'token': $scope.$root.token
            })
<<<<<<< HEAD
            .then(function (vol_data) {
=======
            .then(function(vol_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (arg == 1) {
                    $scope.arr_volume_3 = vol_data.data.response;

                    if ($scope.arr_volume_3.length == 0) {
                        $scope.arr_volume_3.push({ 'id': '-1', 'name': '++ Add New ++' });
                    } else if ($scope.arr_volume_3.length > 0)
                        if ($scope.user_type == 1)
                            $scope.arr_volume_3.push({ 'id': '-1', 'name': '++ Add New ++' });


                } else if (arg == 2) {
                    $scope.arr_volume_purchase_3 = vol_data.data.response;


                    if ($scope.arr_volume_purchase_3.length == 0) {
                        $scope.arr_volume_purchase_3.push({ 'id': '-1', 'name': '++ Add New ++' });
                    } else if ($scope.arr_volume_purchase_3.length > 0)
                        if ($scope.user_type == 1)
                            $scope.arr_volume_purchase_3.push({ 'id': '-1', 'name': '++ Add New ++' });


                }

            });

        $http
            .post(get_unit_setup_category, { 'token': $scope.$root.token, 'product_id': product_id })
<<<<<<< HEAD
            .then(function (unit_data) {
=======
            .then(function(unit_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.arr_unit_of_measure = unit_data.data.response;
                // $scope.arr_unit_of_measure.push({'id': '-1', 'name': '++ Add New ++'});
            });


    }

<<<<<<< HEAD
    $scope.get_service_voume_list = function (arg) {

        $http
            .post(volumeUrl_service, { type: 'Volume 1', 'token': $scope.$root.token })
            .then(function (vol_data) {
=======
    $scope.get_service_voume_list = function(arg) {

        $http
            .post(volumeUrl_service, { type: 'Volume 1', 'token': $scope.$root.token })
            .then(function(vol_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


                if (arg == 1) {
                    $scope.arr_volume_1 = vol_data.data.response;

                    if ($scope.arr_volume_1.length == 0) {
                        $scope.arr_volume_1.push({ 'id': '-1', 'name': '++ Add New ++' });
                    } else if ($scope.arr_volume_1.length > 0)
                        if ($scope.user_type == 1)
                            $scope.arr_volume_1.push({ 'id': '-1', 'name': '++ Add New ++' });


                } else if (arg == 2) {
                    $scope.arr_volume_purchase_1 = vol_data.data.response;

                    if ($scope.arr_volume_purchase_1.length == 0) {
                        $scope.arr_volume_purchase_1.push({ 'id': '-1', 'name': '++ Add New ++' });
                    } else if ($scope.arr_volume_purchase_1.length > 0)
                        if ($scope.user_type == 1)
                            $scope.arr_volume_purchase_1.push({ 'id': '-1', 'name': '++ Add New ++' });

                }


            });

        $http
            .post(volumeUrl_service, { type: 'Volume 2', 'token': $scope.$root.token })
<<<<<<< HEAD
            .then(function (vol_data) {
=======
            .then(function(vol_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (arg == 1) {
                    $scope.arr_volume_2 = vol_data.data.response;


                    if ($scope.arr_volume_2.length == 0) {
                        $scope.arr_volume_2.push({ 'id': '-1', 'name': '++ Add New ++' });
                    } else if ($scope.arr_volume_2.length > 0)
                        if ($scope.user_type == 1)
                            $scope.arr_volume_2.push({ 'id': '-1', 'name': '++ Add New ++' });


                } else if (arg == 2) {
                    $scope.arr_volume_purchase_2 = vol_data.data.response;


                    if ($scope.arr_volume_purchase_2.length == 0) {
                        $scope.arr_volume_purchase_2.push({ 'id': '-1', 'name': '++ Add New ++' });
                    } else if ($scope.arr_volume_purchase_2.length > 0)
                        if ($scope.user_type == 1)
                            $scope.arr_volume_purchase_2.push({ 'id': '-1', 'name': '++ Add New ++' });


                }

            });

        $http
            .post(volumeUrl_service, { type: 'Volume 3', 'token': $scope.$root.token })
<<<<<<< HEAD
            .then(function (vol_data) {
=======
            .then(function(vol_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (arg == 1) {
                    $scope.arr_volume_3 = vol_data.data.response;

                    if ($scope.arr_volume_3.length == 0) {
                        $scope.arr_volume_3.push({ 'id': '-1', 'name': '++ Add New ++' });
                    } else if ($scope.arr_volume_3.length > 0)
                        if ($scope.user_type == 1)
                            $scope.arr_volume_3.push({ 'id': '-1', 'name': '++ Add New ++' });


                } else if (arg == 2) {
                    $scope.arr_volume_purchase_3 = vol_data.data.response;


                    if ($scope.arr_volume_purchase_3.length == 0) {
                        $scope.arr_volume_purchase_3.push({ 'id': '-1', 'name': '++ Add New ++' });
                    } else if ($scope.arr_volume_purchase_3.length > 0)
                        if ($scope.user_type == 1)
                            $scope.arr_volume_purchase_3.push({ 'id': '-1', 'name': '++ Add New ++' });


                }

            });

        $http
            .post(unitUrl_service, { 'token': $scope.$root.token })
<<<<<<< HEAD
            .then(function (unit_data) {
=======
            .then(function(unit_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.arr_unit_of_measure = unit_data.data.response;
                // $scope.arr_unit_of_measure.push({'id': '-1', 'name': '++ Add New ++'});
            });


    }


    $scope.formData_vol_1 = {};
<<<<<<< HEAD
    $scope.get_category_list = function () {
=======
    $scope.get_category_list = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var pard_id = $scope.rec.product_id;

        if ($scope.selectedItems[0] != undefined) {
            if ($scope.rec.product_id == undefined) {
                var pard_id = $scope.selectedItems[0].id;
            }
        }


        $scope.list_unit_category = [];
        $http
            .post(get_unit_setup_category, { 'token': $scope.$root.token, 'product_id': pard_id })
<<<<<<< HEAD
            .then(function (vol_data) {
=======
            .then(function(vol_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.list_unit_category = vol_data.data.response;
            });

    }

<<<<<<< HEAD
    $scope.onChange_vol_1 = function (arg_id, arg_name) {
=======
    $scope.onChange_vol_1 = function(arg_id, arg_name) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.formData_vol_1 = {};

        var id = '';
        var volume = '';
        var category = 0;

        if (arg_id == 1) {
            id = this.rec.volume_1s.id;
            $scope.number_close = 7;
            volume = 'Volume 1';
            category = 1;
            $scope.title_type = 'Add Sale Volume 1 ';
        } else if (arg_id == 2) {
            id = this.rec.volume_2s.id;
            $scope.number_close = 8;
            volume = 'Volume 2';
            category = 1;
            $scope.title_type = 'Add Sale Volume 2 ';
        } else if (arg_id == 3) {
            id = this.rec.volume_3s.id;
            $scope.number_close = 9;
            volume = 'Volume 3';
            category = 1;
            $scope.title_type = 'Add Sale Volume 3 ';
        }

        if (arg_id == 11) {
            id = this.rec.volume_1_purchase.id;
            $scope.number_close = 10;
            volume = 'Volume 1';
            category = 2;
            $scope.title_type = 'Add Purchase   Volume 1 ';
        } else if (arg_id == 22) {
            id = this.rec.volume_2_purchase.id;
            $scope.number_close = 11;
            volume = 'Volume 2';
            category = 2;
            $scope.title_type = 'Add Purchase   Volume 2 ';
        } else if (arg_id == 33) {
            id = this.rec.volume_3_purchase.id;
            $scope.number_close = 12;
            volume = 'Volume 3';
            category = 2;
            $scope.title_type = 'Add Purchase   Volume 3 ';
        }


        $scope.rec.volume = volume;
        $scope.rec.title_type = $scope.title_type;

        $scope.rec.ref_service_type = arg_id;
        $scope.formData_vol_1.type = arg_id;
        $scope.formData_vol_1.category = category;

        if ($scope.rec.type == 2) {

            $('#model_vol_3').modal({ show: true });
            //$scope.addNewVolumePopup($scope.rec.volume, 2, $scope.rec.title_type);
            return;
        }

        if ($scope.rec.type == 1) {

            //	 if(arg_name=='sale')  {  
            if (id == -1) {
                $scope.get_category_list();
                $('#model_vol_1').modal({ show: true });
            }
            // }

            // if(arg_name=='purchase'){  $scope.get_category_list();
            // if (id == -1) $('#model_vol_purchase_1').modal({show: true});
            // }

        }
    }

<<<<<<< HEAD
    $scope.add_vol1_type = function (formData_vol_1) {
=======
    $scope.add_vol1_type = function(formData_vol_1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.formData_vol_1.token = $scope.$root.token;
        $scope.formData_vol_1.product_id = $scope.rec.product_id;

        $scope.formData_vol_1.unit_categorys = $scope.formData_vol_1.unit_category !== undefined ? $scope.formData_vol_1.unit_category.id : 0;

        if (Number($scope.formData_vol_1.quantity_from) > Number($scope.formData_vol_1.quantity_to)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(526));
            return;
        }
        $http
            .post(addvolumeUrl_item, formData_vol_1)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                    //  $scope.show_vol_1_pop = false; 
                    $('#model_vol_1').modal('hide');
                    $('#model_vol_purchase_1').modal('hide');

                    //  $scope.get_item_voume_list($scope.formData_vol_1.category,$scope.rec.product_id );

<<<<<<< HEAD
                    var match_name = $scope.formData_vol_1.quantity_from + '-' + $scope.formData_vol_1.quantity_to
                        + ' ' + $scope.formData_vol_1.unit_category.name;
=======
                    var match_name = $scope.formData_vol_1.quantity_from + '-' + $scope.formData_vol_1.quantity_to +
                        ' ' + $scope.formData_vol_1.unit_category.name;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


                    $http
                        .post(volumeUrl_item, {
                            type: 'Volume ' + $scope.rec.ref_service_type,
                            category: 1,
                            'product_id': $scope.rec.product_id,
                            'token': $scope.$root.token
                        })

<<<<<<< HEAD
                        .then(function (vol_data) {

                            if ($scope.rec.ref_service_type == 1) {
                                $scope.arr_volume_1 = vol_data.data.response;

                                if ($scope.arr_volume_1.length == 0) {
                                    $scope.arr_volume_1.push({ 'id': '-1', 'name': '++ Add New ++' });
                                }
                                else if ($scope.arr_volume_1.length > 0)
                                    if ($scope.user_type == 1)
                                        $scope.arr_volume_1.push({ 'id': '-1', 'name': '++ Add New ++' });

                                angular.forEach($scope.arr_volume_1, function (elem) {
                                    if (elem.id == res.data.id) {
                                        $scope.rec.volume_1s = elem;
                                        $scope.formData.volume_1 = elem;
                                    }
                                });
                            }

                            if ($scope.rec.ref_service_type == 2) {
                                $scope.arr_volume_2 = vol_data.data.response;


                                if ($scope.arr_volume_2.length == 0) {
                                    $scope.arr_volume_2.push({ 'id': '-1', 'name': '++ Add New ++' });
                                }
                                else if ($scope.arr_volume_2.length > 0)
                                    if ($scope.user_type == 1)
                                        $scope.arr_volume_2.push({ 'id': '-1', 'name': '++ Add New ++' });

                                angular.forEach($scope.arr_volume_2, function (elem) {
                                    if (elem.id == res.data.id) {
                                        $scope.rec.volume_2s = elem;
                                        $scope.formData.volume_2 = elem;
                                    }
                                });
                            }

                            if ($scope.rec.ref_service_type == 3) {
                                $scope.arr_volume_3 = vol_data.data.response;

                                if ($scope.arr_volume_3.length == 0) {
                                    $scope.arr_volume_3.push({ 'id': '-1', 'name': '++ Add New ++' });
                                }
                                else if ($scope.arr_volume_3.length > 0)
                                    if ($scope.user_type == 1)
                                        $scope.arr_volume_3.push({ 'id': '-1', 'name': '++ Add New ++' });

                                angular.forEach($scope.arr_volume_3, function (elem) {
                                    if (elem.id == res.data.id) {
                                        $scope.rec.volume_3s = elem;
                                        $scope.formData.volume_3 = elem;
                                    }
                                });
                            }
                        });
=======
                    .then(function(vol_data) {

                        if ($scope.rec.ref_service_type == 1) {
                            $scope.arr_volume_1 = vol_data.data.response;

                            if ($scope.arr_volume_1.length == 0) {
                                $scope.arr_volume_1.push({ 'id': '-1', 'name': '++ Add New ++' });
                            } else if ($scope.arr_volume_1.length > 0)
                                if ($scope.user_type == 1)
                                    $scope.arr_volume_1.push({ 'id': '-1', 'name': '++ Add New ++' });

                            angular.forEach($scope.arr_volume_1, function(elem) {
                                if (elem.id == res.data.id) {
                                    $scope.rec.volume_1s = elem;
                                    $scope.formData.volume_1 = elem;
                                }
                            });
                        }

                        if ($scope.rec.ref_service_type == 2) {
                            $scope.arr_volume_2 = vol_data.data.response;


                            if ($scope.arr_volume_2.length == 0) {
                                $scope.arr_volume_2.push({ 'id': '-1', 'name': '++ Add New ++' });
                            } else if ($scope.arr_volume_2.length > 0)
                                if ($scope.user_type == 1)
                                    $scope.arr_volume_2.push({ 'id': '-1', 'name': '++ Add New ++' });

                            angular.forEach($scope.arr_volume_2, function(elem) {
                                if (elem.id == res.data.id) {
                                    $scope.rec.volume_2s = elem;
                                    $scope.formData.volume_2 = elem;
                                }
                            });
                        }

                        if ($scope.rec.ref_service_type == 3) {
                            $scope.arr_volume_3 = vol_data.data.response;

                            if ($scope.arr_volume_3.length == 0) {
                                $scope.arr_volume_3.push({ 'id': '-1', 'name': '++ Add New ++' });
                            } else if ($scope.arr_volume_3.length > 0)
                                if ($scope.user_type == 1)
                                    $scope.arr_volume_3.push({ 'id': '-1', 'name': '++ Add New ++' });

                            angular.forEach($scope.arr_volume_3, function(elem) {
                                if (elem.id == res.data.id) {
                                    $scope.rec.volume_3s = elem;
                                    $scope.formData.volume_3 = elem;
                                }
                            });
                        }
                    });
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(548, ['Volume']));
            });
    }

<<<<<<< HEAD
    $scope.add_vol3_service = function (formData_vol_1) {
=======
    $scope.add_vol3_service = function(formData_vol_1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.formData_vol_1.token = $scope.$root.token;
        // $scope.formData_vol_3.type = 3;
        $scope.formData_vol_1.parent_id = 0;

        $scope.formData_vol_1.type = $scope.rec.ref_service_type;
        //$scope.formData_vol_1.type1 =  $scope.rec.type; 
        //	console.log(formData_vol_1);return;


        $http
            .post(addvolumeUrl_service, formData_vol_1)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    toaster.pop('success', 'Add', 'Record  Inserted.');
                    $('#model_vol_3').modal('hide');

                    $http
                        .post(volumeUrl_service, {
                            type: 'Volume ' + $scope.rec.ref_service_type,
                            'token': $scope.$root.token
                        })
<<<<<<< HEAD
                        .then(function (vol_data) {
=======
                        .then(function(vol_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                            if ($scope.rec.ref_service_type == 1) {
                                $scope.arr_volume_1 = vol_data.data.response;

                                if ($scope.arr_volume_1.length == 0) {
                                    $scope.arr_volume_1.push({ 'id': '-1', 'name': '++ Add New ++' });
<<<<<<< HEAD
                                }
                                else if ($scope.arr_volume_1.length > 0)
=======
                                } else if ($scope.arr_volume_1.length > 0)
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    if ($scope.user_type == 1)
                                        $scope.arr_volume_1.push({ 'id': '-1', 'name': '++ Add New ++' });


<<<<<<< HEAD
                                angular.forEach($scope.arr_volume_1, function (elem) {
=======
                                angular.forEach($scope.arr_volume_1, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    if (elem.name == $scope.formData_vol_1.description)
                                        $scope.rec.volume_1s = elem;
                                });
                            }

                            if ($scope.rec.ref_service_type == 2) {
                                $scope.arr_volume_2 = vol_data.data.response;

                                if ($scope.arr_volume_2.length == 0) {
                                    $scope.arr_volume_2.push({ 'id': '-1', 'name': '++ Add New ++' });
<<<<<<< HEAD
                                }
                                else if ($scope.arr_volume_2.length > 0)
                                    if ($scope.user_type == 1)
                                        $scope.arr_volume_2.push({ 'id': '-1', 'name': '++ Add New ++' });

                                angular.forEach($scope.arr_volume_2, function (elem) {
=======
                                } else if ($scope.arr_volume_2.length > 0)
                                    if ($scope.user_type == 1)
                                        $scope.arr_volume_2.push({ 'id': '-1', 'name': '++ Add New ++' });

                                angular.forEach($scope.arr_volume_2, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    if (elem.name == $scope.formData_vol_1.description)
                                        $scope.rec.volume_2s = elem;
                                });
                            }

                            if ($scope.rec.ref_service_type == 3) {
                                $scope.arr_volume_3 = vol_data.data.response;

                                if ($scope.arr_volume_3.length == 0) {
                                    $scope.arr_volume_3.push({ 'id': '-1', 'name': '++ Add New ++' });
<<<<<<< HEAD
                                }
                                else if ($scope.arr_volume_3.length > 0)
                                    if ($scope.user_type == 1)
                                        $scope.arr_volume_3.push({ 'id': '-1', 'name': '++ Add New ++' });

                                angular.forEach($scope.arr_volume_3, function (elem) {
=======
                                } else if ($scope.arr_volume_3.length > 0)
                                    if ($scope.user_type == 1)
                                        $scope.arr_volume_3.push({ 'id': '-1', 'name': '++ Add New ++' });

                                angular.forEach($scope.arr_volume_3, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    if (elem.name == $scope.formData_vol_1.description)
                                        $scope.rec.volume_3s = elem;
                                });
                            }
                        });
                } else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
            });
    }

<<<<<<< HEAD
    $scope.addNewVolumePopup = function (drpdown, type, title) {
=======
    $scope.addNewVolumePopup = function(drpdown, type, title) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.rec.type;
        //console.log($scope.rec.type);
        if ($scope.rec.type == 1) {
            var consnt_add = addvolumeUrl_item;
            var const_list = volumeUrl_item;
        } else {
            var consnt_add = addvolumeUrl_service;
            var const_list = volumeUrl_service;
        }

        var id = drpdown.id;
        if (id > 0)
            return false;

        $scope.popup_title = title;
        $scope.pedefined = {};

        ngDialog.openConfirm({
            template: 'app/views/product_values/add_vol_3.html',
            // template: 'app/views/p_offer/add_new_volume.html',
            className: 'ngdialog-theme-default-custom-large',
            scope: $scope
<<<<<<< HEAD
        }).then(function (pedefined) {
=======
        }).then(function(pedefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


            pedefined.token = $scope.$root.token;
            pedefined.type = type;

            $http
                .post(consnt_add, pedefined)
<<<<<<< HEAD
                .then(function (ress) {
=======
                .then(function(ress) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (ress.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        // var constUrl = $scope.$root.sales+"crm/crm/get-price-offer-volume-by-type";
                        $http
                            .post(const_list, { 'token': $scope.$root.token, type: type })
<<<<<<< HEAD
                            .then(function (res) {
=======
                            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (res.data.ack == true) {

                                    if (type == 'Volume 1') {
                                        $scope.arr_volume_1 = res.data.response;
                                        $scope.arr_volume_1.push({ 'id': '-1', 'name': '++ Add New ++' });
                                    }

                                    if (type == 'Volume 2') {
                                        $scope.arr_volume_2 = res.data.response;
                                        $scope.arr_volume_2.push({ 'id': '-1', 'name': '++ Add New ++' });
<<<<<<< HEAD
                                        angular.forEach($scope.arr_volume_2, function (elem) {
=======
                                        angular.forEach($scope.arr_volume_2, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            if (elem.id == ress.data.id)
                                                $scope.rec.volume_2s = elem;
                                        });
                                    }

                                    if (type == 'Volume 3') {
                                        $scope.arr_volume_3 = res.data.response;
                                        $scope.arr_volume_3.push({ 'id': '-1', 'name': '++ Add New ++' });

<<<<<<< HEAD
                                        angular.forEach($scope.arr_volume_3, function (elem) {
=======
                                        angular.forEach($scope.arr_volume_3, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                            if (elem.id == ress.data.id)
                                                $scope.rec.volume_3s = elem;
                                        });
                                    }
                                }
                            });
                    }
                });

<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

<<<<<<< HEAD
    $scope.addNewUnitPopup = function (drpdown, type, title) {
=======
    $scope.addNewUnitPopup = function(drpdown, type, title) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.rec.type;
        var consnt_add = "";
        var const_list = "";
        //console.log($scope.rec.type);
        if ($scope.rec.type == 1) {
            consnt_add = add_unitUrl_item;
            const_list = unitUrl_item;
        } else {
            consnt_add = add_unitUrl_service;
            const_list = unitUrl_service;
        }

        var id = drpdown.id;
        if (id > 0)
            return false;
        var indx = $scope.arr_unit_of_measure.indexOf('-1');
        $scope.arr_unit_of_measure.splice(indx, 1);
        $scope.popup_title = title;
        $scope.pedefined = {};

        ngDialog.openConfirm({
            template: 'app/views/p_offer/add_new_unit.html',
            className: 'ngdialog-theme-default-custom-large',
            scope: $scope
<<<<<<< HEAD
        }).then(function (pedefined) {
=======
        }).then(function(pedefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            /*console.log(pedefined);
             return false;*/

            pedefined.token = $scope.$root.token;
            pedefined.parent_id = pedefined.parent_ids != undefined ? pedefined.parent_ids.id : 0;
            var postUrl = $scope.$root.stock + "unit-measure/add-unit";
            $http
                .post(consnt_add, pedefined)
<<<<<<< HEAD
                .then(function (ress) {
=======
                .then(function(ress) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (ress.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        var constUrl = $scope.$root.stock + "unit-measure/get-all-unit";
                        $http
                            .post(const_list, { 'token': $scope.$root.token })
<<<<<<< HEAD
                            .then(function (res) {
=======
                            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (res.data.ack == true) {
                                    $scope.arr_unit_of_measure = res.data.response;
                                    $scope.arr_unit_of_measure.push({ 'id': '-1', 'title': '++ Add New ++' });

<<<<<<< HEAD
                                    angular.forEach($scope.arr_unit_of_measure, function (elem) {
=======
                                    angular.forEach($scope.arr_unit_of_measure, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        if (elem.id == ress.data.id) {
                                            if (type == 'Volume 1')
                                                $scope.rec.unit_of_measure_1s = elem;
                                            if (type == 'Volume 2')
                                                $scope.rec.unit_of_measure_2s = elem;
                                            if (type == 'Volume 3')
                                                $scope.rec.unit_of_measure_3s = elem;
                                        }
                                    });
                                }
                            });
                    }
                });

<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.formData = {};
<<<<<<< HEAD
    $scope.getOffer = function (arg) {
=======
    $scope.getOffer = function(arg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.columns_ship = [];
        $scope.record_ship = {};
        //var empUrl = $scope.$root.hr+"employee/listings";
        var new_template = '';

        if (arg == 'emp') {
            $scope.title = "Contacts";
            var empUrl = $scope.$root.pr + "srm/srm/alt-contacts";
            new_template = 'app/views/srm/_listing_employee.html';
        } else if (arg == 'prd') {
            $scope.title = "";
            //  var empUrl = $scope.$root.stock + "products-listing/get-purchase-products-popup";
            template: new_template = 'app/views/srm/_listing_product_modal.html';
        } else if (arg == 'price') {
            $scope.title = "Price Offer List";
            var empUrl = $scope.$root.pr + "srm/srm/srm-price-offer-volume-list";
            // var empUrl = $scope.$root.stock + "unit-measure/get-sale-offer-volume-by-type";
            new_template = 'app/views/srm/_listing_modal_new.html';
        }

        //template:  new_template='app/views/srm/_listing_modal_new.html';	

        /* var postData = {
         'token': $scope.$root.token,
         'id': $scope.$root.srm_id,
         'product_id': $scope.formData.price_list_id,
         category: 1,
         type: 'Volume 1'
         };*/


        var postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
        };
        $http
            .post(empUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.columns_ship = [];
                    $scope.record_ship = {};
                    $scope.record_ship = res.data.response;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columns_ship.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });

        ngDialog.openConfirm({
            template: new_template,
            className: 'ngdialog-theme-default',
            scope: $scope
<<<<<<< HEAD
        }).then(function (result) {

            if (arg == 'emp') {
                $scope.rec.offered_by = result.contact_name;
                $scope.rec.offered_by_id = result.id;
            } else if (arg == 'prd') {

                $scope.rec.product_id = result.id;
                $scope.rec.product_code = result.product_code;
                $scope.rec.product_description = result.description;
            } else if (arg == 'price') {

                $scope.formData.price_list_id = result.id;
                $scope.formData.product_id = result.product_id;
                $scope.formData.product_code = result.product_code;
                $scope.formData.product_description = result.item_description;

                $scope.get_item_voume_list(1, $scope.formData.product_id);

                console.log(result.product_code);


                if (result.volume_1 != undefined) {
                    angular.forEach($scope.arr_volume_1, function (elem) {
                        if (elem.id == result.volume_1) {
                            $scope.formData.volume_1 = elem;
                        }
                    });
                }

                if (result.volume_2 != undefined) {
                    angular.forEach($scope.arr_volume_2, function (elem) {
                        if (elem.id == result.volume_2) {
                            //$scope.$root.$apply(function () {
                            $scope.formData.volume_2 = elem;
                            //});
                        }
                    });
                }

                if (result.volume_3 != undefined) {
                    angular.forEach($scope.arr_volume_3, function (elem) {
                        if (elem.id == result.volume_3) {
                            // $scope.$root.$apply(function () {
                            $scope.formData.volume_3 = elem;
                            //});
                        }
                    });
                }

                if (result.volume_1_price != undefined) {
                    $scope.formData.purchase_price_1 = result.volume_1_price;
                }
                if (result.volume_2_price != undefined) {
                    $scope.formData.purchase_price_2 = result.volume_2_price;
                }
                if (result.volume_3_price != undefined) {
                    $scope.formData.purchase_price_3 = result.volume_3_price;
                }
            }
        },
            function (reason) {
=======
        }).then(function(result) {

                if (arg == 'emp') {
                    $scope.rec.offered_by = result.contact_name;
                    $scope.rec.offered_by_id = result.id;
                } else if (arg == 'prd') {

                    $scope.rec.product_id = result.id;
                    $scope.rec.product_code = result.product_code;
                    $scope.rec.product_description = result.description;
                } else if (arg == 'price') {

                    $scope.formData.price_list_id = result.id;
                    $scope.formData.product_id = result.product_id;
                    $scope.formData.product_code = result.product_code;
                    $scope.formData.product_description = result.item_description;

                    $scope.get_item_voume_list(1, $scope.formData.product_id);

                    console.log(result.product_code);


                    if (result.volume_1 != undefined) {
                        angular.forEach($scope.arr_volume_1, function(elem) {
                            if (elem.id == result.volume_1) {
                                $scope.formData.volume_1 = elem;
                            }
                        });
                    }

                    if (result.volume_2 != undefined) {
                        angular.forEach($scope.arr_volume_2, function(elem) {
                            if (elem.id == result.volume_2) {
                                //$scope.$root.$apply(function () {
                                $scope.formData.volume_2 = elem;
                                //});
                            }
                        });
                    }

                    if (result.volume_3 != undefined) {
                        angular.forEach($scope.arr_volume_3, function(elem) {
                            if (elem.id == result.volume_3) {
                                // $scope.$root.$apply(function () {
                                $scope.formData.volume_3 = elem;
                                //});
                            }
                        });
                    }

                    if (result.volume_1_price != undefined) {
                        $scope.formData.purchase_price_1 = result.volume_1_price;
                    }
                    if (result.volume_2_price != undefined) {
                        $scope.formData.purchase_price_2 = result.volume_2_price;
                    }
                    if (result.volume_3_price != undefined) {
                        $scope.formData.purchase_price_3 = result.volume_3_price;
                    }
                }
            },
            function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                console.log('Modal promise rejected. Reason: ', reason);
            });
    }


<<<<<<< HEAD
    $scope.clear_purchase_offer = function () {
=======
    $scope.clear_purchase_offer = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.check_readonly = false;

        // $scope.rec = {};
        $scope.rec.type = '';
        $scope.showItms = true;
        $scope.showServ = true;

        $scope.product_code = '';
        $scope.product_description = '';
        $scope.rec.offered_by = '';
        $scope.rec.offer_date = '';
        $scope.rec.offer_valid_date = '';
        $scope.rec.offer_method_ids = '';
        $scope.rec.volume_1_price = '';
        $scope.rec.unit_of_measure_1s = '';
        $scope.rec.volume_1s = '';
        $scope.rec.volume_2_price = '';
        $scope.rec.unit_of_measure_2s = '';
        $scope.rec.volume_2s = '';
        $scope.rec.volume_3_price = '';
        $scope.rec.unit_of_measure_3s = '';
        $scope.rec.volume_3s = '';

        $scope.rec.offered_date = $scope.$root.get_current_date();
        $scope.pOfferListingListingShow = false;
        $scope.pOfferListingFormShow = true;
    }

<<<<<<< HEAD
    $scope.get_price_list = function () {
=======
    $scope.get_price_list = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.$root.breadcrumbs[3].name = 'Price List';

        $scope.pOfferListingListingShow = true;
        $scope.pOfferListingFormShow = false;

        $scope.showLoader = true;
        var API = $scope.$root.pr + "srm/srm/srm-price-offer-listings";
        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'id': $scope.$root.srm_id,
            'page': $scope.item_paging.spage
<<<<<<< HEAD
            //'country_keyword': angular.element('#search_sale_listing_data').val()
        };
        $http
            .post(API, $scope.postData)
            .then(function (res) {
=======
                //'country_keyword': angular.element('#search_sale_listing_data').val()
        };
        $http
            .post(API, $scope.postData)
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                $scope.price_data = [];
                $scope.columns = [];
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    /*if (obj.sdate == 0)
                     $scope.ship_data[index]['sdate'] = null;
                     else
                     $scope.ship_data[index]['sdate'] = $scope.$root.convert_unix_date_to_angular(obj.sdate);

                     if (obj.edate == 0)
                     $scope.ship_data[index]['edate'] = null;
                     else
                     $scope.ship_data[index]['edate'] = $scope.$root.convert_unix_date_to_angular(obj.edate);
                     */

                    $scope.price_data = res.data.response;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

        $scope.showLoader = false;

    }

<<<<<<< HEAD
    $scope.add_form_price_list = function () {
=======
    $scope.add_form_price_list = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.check_readonly = false;

        // $scope.rec = {};
        $scope.rec.type = '';
        $scope.showItms = true;
        $scope.showServ = true;
        $scope.clear_purchase_offer();
        $scope.rec.offered_date = $scope.$root.get_current_date();
        $scope.pOfferListingListingShow = false;
        $scope.pOfferListingFormShow = true;
    }

<<<<<<< HEAD
    $scope.add_srm_price_list = function (rec) {
=======
    $scope.add_srm_price_list = function(rec) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


        rec.offer_method_id = $scope.rec.offer_method_ids != undefined ? $scope.rec.offer_method_ids.id : 0;
        //rec.currency_id = $scope.rec.currency_ids != undefined? $scope.rec.currency_ids.id:0;
        rec.volume_1 = $scope.rec.volume_1s != undefined ? $scope.rec.volume_1s.id : 0;
        rec.volume_2 = $scope.rec.volume_2s != undefined ? $scope.rec.volume_2s.id : 0;
        rec.volume_3 = $scope.rec.volume_3s != undefined ? $scope.rec.volume_3s.id : 0;
        rec.unit_of_measure_1 = $scope.rec.unit_of_measure_1s != undefined ? $scope.rec.unit_of_measure_1s.id : 0;
        rec.unit_of_measure_2 = $scope.rec.unit_of_measure_2s != undefined ? $scope.rec.unit_of_measure_2s.id : 0;
        rec.unit_of_measure_3 = $scope.rec.unit_of_measure_3s != undefined ? $scope.rec.unit_of_measure_3s.id : 0;
        rec.srm_id = $scope.$root.srm_id;
        rec.token = $scope.$root.token;


        if ($scope.formData.sp_id == "") {
            //console.log($scope.formData.volume_2s)

            if (($scope.formData.volume_2 == '-1') || ($scope.formData.volume_3 == '-1')) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Volumes']));
                return;
            }
        }


        var errorFlag = false;
        //        console.log("DiscountVal::"+$scope.formData.discount_value_1);
        if ($scope.formData.sp_id == "") {
            angular.element('#dpval ul').hide();
            if ($scope.formData.discount_value_1 != "") {
                if ($scope.formData.discount_price_1 <= 0) {
                    angular.element('#parsley-id-dp1530').show();
                    errorFlag = true;
                } else {
                    angular.element('#parsley-id-dp1530').hide();
                }
            }

            if ($scope.formData.volume_2 != "" || $scope.formData.supplier_type_2 != "" || ($scope.formData.discount_value_2 != undefined && $scope.formData.discount_value_2 != "")) {
                if ($scope.formData.discount_price_2 <= 0) {
                    angular.element('#parsley-id-dp2530').show();
                    errorFlag = true;
                } else {
                    angular.element('#parsley-id-dp2530').hide();
                }
            }

            if ($scope.formData.volume_3 != "" || $scope.formData.supplier_type_3 != "" || ($scope.formData.discount_value_3 != undefined && $scope.formData.discount_value_3 != "")) {
                if ($scope.formData.discount_price_3 <= 0) {
                    angular.element('#parsley-id-dp3530').show();
                    errorFlag = true;
                } else {
                    angular.element('#parsley-id-dp3530').hide();
                }
            }
        } else {
            if ($scope.formData.discount_value_11 != "") {
                if ($scope.formData.discount_price_11 <= 0) {
                    angular.element('#dpval ul').hide();
                    angular.element('#parsley-id-dppop0530').show();
                    errorFlag = true;
                } else {
                    angular.element('#parsley-id-dppop0530').hide();
                }
            }
        }

        if (errorFlag) {
            return;
        }

        //console.log($scope.formData);return;


        var altAddUrl = $scope.$root.pr + "srm/srm/add-srm-price-offer-listing";
        $http
            .post(altAddUrl, rec)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                //	$scope.$root.count = $scope.$root.count+1;
                if (res.data.ack == true) {

                    if (rec.id > 0)
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    else {
                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                    }

                    $scope.get_price_list();

                } else {
                    if (rec.id > 0)
                        toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(104));
                    else
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(104));
                }
            });
    }

    var ProductDetailsURL = $scope.$root.stock + "products-listing/get-product-by-id";

<<<<<<< HEAD
    $scope.edit_form_price_list = function (id) {
=======
    $scope.edit_form_price_list = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.clear_purchase_offer();
        $scope.check_readonly = true;

        //$scope.rec = {};
        $scope.pOfferListingListingShow = false;
        $scope.pOfferListingFormShow = true;

        var altcontUrl = $scope.$root.pr + "srm/srm/get-srm-price-offer-by-id";
        var postViewData = {
            'token': $scope.$root.token,
            'id': id
        };

        $http
            .post(altcontUrl, postViewData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                $scope.rec = res.data.response;

                $scope.rec.id = res.data.response.id;
                $scope.rec.update_id = res.data.response.id;

                $scope.rec.offered_by = res.data.response.offered_by;

<<<<<<< HEAD
                angular.forEach($scope.price_method_list, function (obj) {
=======
                angular.forEach($scope.price_method_list, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id == res.data.response.offer_method_id) {
                        $scope.rec.offer_method_ids = obj;
                    }
                });

                //	$scope.offer_date = $filter('date')(res.data.response.created_date, $scope.$root.dateFormats[$scope.$root.defaultDateFormat]);
                $scope.wordsLength = res.data.response.comment.length;
                if (res.data.response.primary == 'One_Four_Pallet') {
                    $scope.isPalletSet = 1;
                }
                if (res.data.response.primary == 'Half_Load') {
                    $scope.isHalfSet = 1;
                }
                if (res.data.response.primary == 'Full_Load') {
                    $scope.isFullSet = 1;
                }

                if ($scope.rec.offer_date == 0)
                    $scope.rec.offer_date = null;
                else
                    $scope.rec.offer_date = $scope.$root.convert_unix_date_to_angular($scope.rec.offer_date);

                if ($scope.rec.offer_valid_date == 0)
                    $scope.rec.offer_valid_date = null;
                else
                    $scope.rec.offer_valid_date = $scope.$root.convert_unix_date_to_angular($scope.rec.offer_valid_date);


<<<<<<< HEAD
                angular.forEach($scope.arr_OfferMethod, function (elem) {
=======
                angular.forEach($scope.arr_OfferMethod, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (elem.id == res.data.response.offer_method_id) {
                        $scope.rec.offer_method_ids = elem;
                    }
                });

                var empUrl = $scope.$root.pr + "srm/srm/get-alt-contact";
                $http
                    .post(empUrl, { id: res.data.response.offered_by_id, 'token': $scope.$root.token })
<<<<<<< HEAD
                    .then(function (emp_data) {
=======
                    .then(function(emp_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.rec.offered_by = emp_data.data.response.contact_name;
                    });


                if (res.data.response.type == 1) {

                    $scope.showItms = true;
                    $scope.showServ = false;
                    $http
                        .post(ProductDetailsURL, {
                            product_id: res.data.response.product_id,
                            'token': $scope.$root.token
                        })
<<<<<<< HEAD
                        .then(function (prod_data) {
=======
                        .then(function(prod_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.product_description = prod_data.data.response.description;
                            //$scope.product_barcode	= prod_data.data.response.prd_bar_code;
                            $scope.product_code = prod_data.data.response.product_code;
                        });

                    $scope.get_item_voume_list(1, res.data.response.product_id);
                }

                if (res.data.response.type == 2) {

                    $scope.showItms = false;
                    $scope.showServ = true;
                    $http
                        .post(prodUrl, { product_id: res.data.response.product_id, 'token': $scope.$root.token })
<<<<<<< HEAD
                        .then(function (prod_data) {
=======
                        .then(function(prod_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.product_description = prod_data.data.response.description;
                            //$scope.product_barcode	= prod_data.data.response.prd_bar_code;
                            $scope.product_code = prod_data.data.response.code;
                        });


                    $http
                        .post(volumeUrl_service, { type: 'Volume 1', 'token': $scope.$root.token })
<<<<<<< HEAD
                        .then(function (vol_data) {
=======
                        .then(function(vol_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.arr_volume_1 = vol_data.data.response;
                            $scope.arr_volume_1.push({ 'id': '-1', 'description': '++ Add New ++' });
                        });

                    $http
                        .post(volumeUrl_service, { type: 'Volume 2', 'token': $scope.$root.token })
<<<<<<< HEAD
                        .then(function (vol_data) {
=======
                        .then(function(vol_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.arr_volume_2 = vol_data.data.response;
                            $scope.arr_volume_2.push({ 'id': '-1', 'description': '++ Add New ++' });
                        });

                    $http
                        .post(volumeUrl_service, { type: 'Volume 3', 'token': $scope.$root.token })
<<<<<<< HEAD
                        .then(function (vol_data) {
=======
                        .then(function(vol_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.arr_volume_3 = vol_data.data.response;
                            $scope.arr_volume_3.push({ 'id': '-1', 'description': '++ Add New ++' });
                        });

                    $http
                        .post(unitUrl_service, { 'token': $scope.$root.token })
<<<<<<< HEAD
                        .then(function (unit_data) {
=======
                        .then(function(unit_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.arr_unit_of_measure = unit_data.data.response;
                            $scope.arr_unit_of_measure.push({ 'id': '-1', 'title': '++ Add New ++' });
                        });

                }

<<<<<<< HEAD
                angular.forEach($scope.arr_OfferMethod, function (elem) {
=======
                angular.forEach($scope.arr_OfferMethod, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (elem.id == res.data.response.offer_method_id) {
                        $scope.rec.offer_method_ids = elem;
                    }
                });

<<<<<<< HEAD
                angular.forEach($scope.arr_volume_1, function (elem) {
=======
                angular.forEach($scope.arr_volume_1, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (elem.id == res.data.response.volume_1) {
                        $scope.rec.volume_1s = elem;
                    }
                });

<<<<<<< HEAD
                angular.forEach($scope.arr_volume_2, function (elem) {
=======
                angular.forEach($scope.arr_volume_2, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (elem.id == res.data.response.volume_2) {
                        $scope.rec.volume_2s = elem;
                    }
                });

<<<<<<< HEAD
                angular.forEach($scope.arr_volume_3, function (elem) {
=======
                angular.forEach($scope.arr_volume_3, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (elem.id == res.data.response.volume_3) {
                        $scope.rec.volume_3s = elem;
                    }
                });

<<<<<<< HEAD
                angular.forEach($scope.arr_unit_of_measure, function (elem) {
=======
                angular.forEach($scope.arr_unit_of_measure, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (elem.id == res.data.response.unit_of_measure_1) {
                        $scope.rec.unit_of_measure_1s = elem;
                    }
                    if (elem.id == res.data.response.unit_of_measure_2) {
                        $scope.rec.unit_of_measure_2s = elem;
                    }
                    if (elem.id == res.data.response.unit_of_measure_3) {
                        $scope.rec.unit_of_measure_3s = elem;
                    }
                });
            });
    }

<<<<<<< HEAD
    $scope.delete_price_list = function (id, index, arr_data) {
=======
    $scope.delete_price_list = function(id, index, arr_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var delUrl = $scope.$root.pr + "srm/srm/delete-srm-price-offer-listing";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
=======
        }).then(function(value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };


    // ------------- 	 Supplier 	 ----------------------------------------

    $scope.selected = 0;
    $scope.total = 0;
    $scope.selected_count = 0;
    $scope.show_symbol = false;

    $scope.list_type = [{ name: 'Percentage', id: 1 }, { name: 'Value', id: 2 }];

<<<<<<< HEAD
    $scope.onChange_volume = function (arg_id, arg_name) {
=======
    $scope.onChange_volume = function(arg_id, arg_name) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.formData_vol_1 = {};

        var id = '';
        var volume = '';
        var category = '';

        if (arg_id == 1) {
            id = this.formData.volume_1.id;
            volume = 'Volume 1';
            category = 1;
            $scope.title_type = 'Add 1 ';
        } else if (arg_id == 2) {
            id = this.formData.volume_2.id;
            volume = 'Volume 2';
            category = 1;
            $scope.title_type = 'Add 2 ';
        } else if (arg_id == 3) {
            id = this.formData.volume_3.id;
            volume = 'Volume 3';
            category = 1;
            $scope.title_type = 'Add 3 ';
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


        $scope.rec.volume = volume;
        $scope.rec.title_type = $scope.title_type;
        $scope.rec.ref_service_type = arg_id;
        $scope.formData_vol_1.type = arg_id;
        $scope.formData_vol_1.category = category;

        //  if(arg_name=='sale')    
        if (id == -1) {
            $('#model_vol_1').modal({ show: true });
            $scope.get_category_list();
        }

        /*  if(arg_name=='purchase'){   $scope.get_category_list();

         if (id == -1) $('#model_vol_purchase_1').modal({show: true});
         }*/

    }


<<<<<<< HEAD
    $scope.onChange_vol_2 = function () {
=======
    $scope.onChange_vol_2 = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var id = this.formData.volume_2.id;
        //console.log(id );
        if (id == -1) {
            $scope.show_vol_2_pop = true;
            angular.element('#model_btn_vol_2').click();
        }

        $("#name").val('');
        $("#description").val('');
        $scope.name = '';
        $scope.description = '';
    }

<<<<<<< HEAD
    $scope.add_vol2_type = function (formData_vol_2) {
=======
    $scope.add_vol2_type = function(formData_vol_2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.formData_vol_2.token = $scope.$root.token;
        $scope.formData_vol_2.type = 2;

        $http
            .post(add_saleUrl, formData_vol_2)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {

                    toaster.pop('success', 'Add', 'Record  Inserted.');
                    $scope.show_vol_2_pop = false;

                    $http
                        .post(volumeUrl, { type: 'Volume 2', 'token': $scope.$root.token })
<<<<<<< HEAD
                        .then(function (vol_data) {
=======
                        .then(function(vol_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $scope.arr_volume_2 = vol_data.data.response;
                            if ($scope.user_type == 1) {
                                $scope.arr_volume_2.push({ id: '-1', description: '++ Add New ++' });
                            }
                        });

                } else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
            });
    }

<<<<<<< HEAD
    $scope.onChange_vol_3 = function () {
=======
    $scope.onChange_vol_3 = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var id = this.formData.volume_3.id;
        //console.log(id );
        if (id == -1) {
            $scope.show_vol_3_pop = true;
            angular.element('#model_btn_vol_3').click();
        }

        $("#name").val('');
        $("#description").val('');
        $scope.name = '';
        $scope.description = '';
    }

<<<<<<< HEAD
    $scope.add_vol3_type = function (formData_vol_1) {
=======
    $scope.add_vol3_type = function(formData_vol_1) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.formData_vol_3.token = $scope.$root.token;


        $http
            .post(add_unitUrl_service, formData_vol_1)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    toaster.pop('success', 'Add', 'Record  Inserted.');

                    $http
                        .post(unitUrl_service, { type: 'Volume 3', 'token': $scope.$root.token })
<<<<<<< HEAD
                        .then(function (vol_data) {
=======
                        .then(function(vol_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            $('#model_vol_3').modal('hide');
                            $scope.arr_volume_3 = vol_data.data.response;
                            if ($scope.user_type == 1) {
                                $scope.arr_volume_3.push({ id: '-1', description: '++ Add New ++' });
                            }
                        });

                } else
                    toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(107));
            });
    }

<<<<<<< HEAD
    $scope.show_volume_list = function () {

        $http
            .post(volumeUrl_item, { type: 'Volume 1', 'token': $scope.$root.token })
            .then(function (vol_data) {
=======
    $scope.show_volume_list = function() {

        $http
            .post(volumeUrl_item, { type: 'Volume 1', 'token': $scope.$root.token })
            .then(function(vol_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.arr_volume_1 = vol_data.data.response;
                if ($scope.user_type == 1) {
                    $scope.arr_volume_1.push({ id: '-1', description: '++ Add New ++' });
                }
            });

        $http
            .post(volumeUrl_item, { type: 'Volume 2', 'token': $scope.$root.token })
<<<<<<< HEAD
            .then(function (vol_data) {
=======
            .then(function(vol_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.arr_volume_2 = vol_data.data.response;
                if ($scope.user_type == 1) {
                    $scope.arr_volume_2.push({ id: '-1', description: '++ Add New ++' });
                }
            });

        $http
            .post(volumeUrl_item, { type: 'Volume 3', 'token': $scope.$root.token })
<<<<<<< HEAD
            .then(function (vol_data) {
=======
            .then(function(vol_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.arr_volume_3 = vol_data.data.response;
                if ($scope.user_type == 1) {
                    $scope.arr_volume_3.push({ id: '-1', description: '++ Add New ++' });
                }
            });

    }

<<<<<<< HEAD
    $scope.show_price_one = function (arg) {
=======
    $scope.show_price_one = function(arg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var price = 0;
        var final_price = 0;


        if (arg == 1) {
            price = $scope.formData.purchase_price_1;
            var f_id = this.formData.supplier_type_1.id;

            if (f_id == 1) {
                var final_price_one = (parseFloat($scope.formData.discount_value_1)) * (parseFloat(price)) / 100;

                final_price = (parseFloat(price)) - (parseFloat(final_price_one));

            } else if (f_id == 2) {
                final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value_1));
            }

            var final_new = (Math.round(final_price * 100) / 100).toFixed(2);
            if (final_new != 'NaN')
                $scope.formData.discount_price_1 = final_new;
        }

        if (arg == 2) {
            price = $scope.formData.purchase_price_2;
            var f_id = this.formData.supplier_type_2.id;
            if (f_id == 1) {
                var final_price_one = (parseFloat($scope.formData.discount_value_2)) * (parseFloat(price)) / 100;

                final_price = (parseFloat(price)) - (parseFloat(final_price_one));
            } else if (f_id == 2) {
                final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value_2));
            }

            var final_new = (Math.round(final_price * 100) / 100).toFixed(2);
            if (final_new != 'NaN')
                $scope.formData.discount_price_2 = final_new;

        }

        if (arg == 3) {
            price = $scope.formData.purchase_price_3;
            var f_id = this.formData.supplier_type_3.id;


            if (f_id == 1) {
                var final_price_one = (parseFloat($scope.formData.discount_value_3)) * (parseFloat(price)) / 100;
                final_price = (parseFloat(price)) - (parseFloat(final_price_one));
            } else if (f_id == 2) {
                final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value_3));
            }
            var final_new = (Math.round(final_price * 100) / 100).toFixed(2);
            if (final_new != 'NaN')
                $scope.formData.discount_price_3 = final_new;

        }

    }

    var postUrl = $scope.$root.pr + "srm/srm/supplier_list";
<<<<<<< HEAD
    $scope.getsupplier = function () {
=======
    $scope.getsupplier = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.$root.breadcrumbs[3].name = 'Volume';


        $scope.show_supplier_list_voume = true;
        $scope.show_supp_form = false;

        $scope.perreadonly = true;
        $scope.check_item_readonly = false;


        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'supplier_id': $scope.$root.srm_id,
            'page': $scope.item_paging.spage
<<<<<<< HEAD
            //'country_keyword': angular.element('#search_sale_listing_data').val()
        };
        $http
            .post(postUrl, $scope.postData)
            .then(function (res) {
=======
                //'country_keyword': angular.element('#search_sale_listing_data').val()
        };
        $http
            .post(postUrl, $scope.postData)
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                $scope.supplier_list = [];
                $scope.columns = [];
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;


                    $scope.supplier_list = res.data.response;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

<<<<<<< HEAD
    $scope.fn_supplier_Form = function () {
=======
    $scope.fn_supplier_Form = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.show_volume_list();
        $scope.show_supp_form = true;
        $scope.show_supplier_list = false;


        $scope.formData = {};
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

<<<<<<< HEAD
    $scope.add_supplier = function (formData) {
=======
    $scope.add_supplier = function(formData) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var updateUrl = $scope.$root.pr + "srm/srm/update_product_values";
        $scope.formData.srm_id = $scope.$root.srm_id;
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


        if ($scope.formData.sp_id == "") {
            if (($scope.formData.volume_2s == '-1') || ($scope.formData.volume_3s == '-1')) {
                toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Volumes']));
                return;
            }
        }


        var errorFlag = false;
        //        console.log("DiscountVal::"+$scope.formData.discount_value_1);
        if ($scope.formData.sp_id == "") {
            angular.element('#dpval ul').hide();
            if ($scope.formData.discount_value_1 != "") {
                if ($scope.formData.discount_price_1 <= 0) {
                    angular.element('#parsley-id-dp1530').show();
                    errorFlag = true;
                } else {
                    angular.element('#parsley-id-dp1530').hide();
                }
            }

            if ($scope.formData.volume_2 != "" || $scope.formData.supplier_type_2 != "" || ($scope.formData.discount_value_2 != undefined && $scope.formData.discount_value_2 != "")) {
                if ($scope.formData.discount_price_2 <= 0) {
                    angular.element('#parsley-id-dp2530').show();
                    errorFlag = true;
                } else {
                    angular.element('#parsley-id-dp2530').hide();
                }
            }

            if ($scope.formData.volume_3 != "" || $scope.formData.supplier_type_3 != "" || ($scope.formData.discount_value_3 != undefined && $scope.formData.discount_value_3 != "")) {
                if ($scope.formData.discount_price_3 <= 0) {
                    angular.element('#parsley-id-dp3530').show();
                    errorFlag = true;
                } else {
                    angular.element('#parsley-id-dp3530').hide();
                }
            }
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if ($scope.formData.discount_value_11 != "") {
                if ($scope.formData.discount_price_11 <= 0) {
                    angular.element('#dpval ul').hide();
                    angular.element('#parsley-id-dppop0530').show();
                    errorFlag = true;
                } else {
                    angular.element('#parsley-id-dppop0530').hide();
                }
            }
        }

        if (errorFlag) {
            return;
        }

        $http
            .post(updateUrl, $scope.formData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
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

<<<<<<< HEAD
    $scope.show_sp_edit_form = function (id) {
=======
    $scope.show_sp_edit_form = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var postUrl = $scope.$root.pr + "srm/srm/supplier_by_id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };
        $scope.formData.sp_id = id;
        $scope.sp_id = id;

        $http
            .post(postUrl, postViewBankData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (res.data.response.start_date == 0)
                    $scope.formData.start_date = null;
                else
                    $scope.rec.start_date = $scope.$root.convert_unix_date_to_angular(res.data.response.start_date);

                if (res.data.response.end_date == 0)
                    $scope.formData.end_date = null;
                else
                    $scope.rec.end_date = $scope.$root.convert_unix_date_to_angular(res.data.response.end_date);

                $scope.formData.discount_value = res.data.response.discount_value;


<<<<<<< HEAD
                angular.forEach($scope.list_type, function (index, obj) {
=======
                angular.forEach($scope.list_type, function(index, obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id == res.data.response.supplier_type) {
                        $scope.formData.supplier_type = $scope.list_type[index];
                    }
                });

                $scope.get_item_voume_list(1, res.data.response.product_id);

<<<<<<< HEAD
                angular.forEach($scope.arr_volume_1, function (obj) {
=======
                angular.forEach($scope.arr_volume_1, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    console.log(obj.id == res.data.response.volume_1);
                    if (obj.id == res.data.response.volume_1) {
                        $scope.formData.volume_1 = obj;
                    }
                });

<<<<<<< HEAD
                angular.forEach($scope.arr_volume_2, function (obj) {
=======
                angular.forEach($scope.arr_volume_2, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id == res.data.response.volume_2) {
                        $scope.formData.volume_2 = obj;
                    }
                });

<<<<<<< HEAD
                angular.forEach($scope.arr_volume_3, function (obj) {
=======
                angular.forEach($scope.arr_volume_3, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id == res.data.response.volume_3) {
                        $scope.formData.volume_3 = obj;
                    }
                });
            });
    }

<<<<<<< HEAD
    $scope.delete_sp = function (id, index, arr_data) {
=======
    $scope.delete_sp = function(id, index, arr_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var delUrl = $scope.$root.pr + "srm/srm/delete_sp_id";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
=======
        }).then(function(value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });

    }

<<<<<<< HEAD
    $scope.supplier_pop = function (id, pid) {
=======
    $scope.supplier_pop = function(id, pid) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        angular.element('#model_btn_supplier').modal({
            show: true
        });


        $scope.get_item_voume_list(1, pid);


        var postUrl = $scope.$root.pr + "srm/srm/supplier_by_id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };

        $scope.formData.sp_id = id;
        $scope.sp_id = id;


        $http
            .post(postUrl, postViewBankData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.formData.purchase_price_1 = res.data.response.purchase_price;
                $scope.formData.discount_price_1 = res.data.response.discount_price;
                $scope.formData.discount_value = res.data.response.discount_value;
                $scope.formData.volume_1 = res.data.response.volume_1;
                $scope.formData.volume_2 = res.data.response.volume_2;
                $scope.formData.volume_3 = res.data.response.volume_3;

                $scope.formData.purchase_price_11 = res.data.response.purchase_price;
                $scope.formData.discount_value_11 = res.data.response.discount_value;
                $scope.formData.discount_price_11 = res.data.response.discount_price;


<<<<<<< HEAD
                angular.forEach($scope.list_type, function (obj) {
=======
                angular.forEach($scope.list_type, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id == res.data.response.supplier_type) {
                        $scope.formData.supplier_type_11 = obj;
                    }
                });

<<<<<<< HEAD
                angular.forEach($scope.arr_volume_1, function (obj) {
=======
                angular.forEach($scope.arr_volume_1, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id == res.data.response.volume_id) {
                        $scope.formData.volume_id = obj;
                        //   console.log($scope.formData.volume_id);
                    }
                });

<<<<<<< HEAD
                angular.forEach($scope.arr_volume_2, function (obj) {
=======
                angular.forEach($scope.arr_volume_2, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id == res.data.response.volume_id) {
                        $scope.formData.volume_id = obj;
                    }
                });

<<<<<<< HEAD
                angular.forEach($scope.arr_volume_3, function (obj) {
=======
                angular.forEach($scope.arr_volume_3, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id == res.data.response.volume_id) {
                        $scope.formData.volume_id = obj;
                    }
                });
            });
    }

<<<<<<< HEAD
    $scope.show_price_one_pop = function () {
=======
    $scope.show_price_one_pop = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var price = 0;
        var final_price = 0;

        price = $scope.formData.purchase_price_11;

        var f_id = this.formData.supplier_type_11.id;

        if (f_id == 1) {
            var final_price_one = "";
            final_price_one = (parseFloat($scope.formData.discount_value_11)) * (parseFloat(price)) / 100;

            final_price = (parseFloat(price)) - (parseFloat(final_price_one));

        } else if (f_id == 2) {
            final_price = (parseFloat(price)) - (parseFloat($scope.formData.discount_value_11));
        }

        //  console.log( final_price);
        $scope.formData.discount_price_11 = final_price;
    }

<<<<<<< HEAD
    $scope.setSymbol_pop = function (div_id) {
=======
    $scope.setSymbol_pop = function(div_id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var id = $('#type_' + div_id).val();
        if (id == 0)
            $('#date_msg_' + div_id).show();
        else
            $('#date_msg_' + div_id).hide();
    }


    //--------------------   Supplier End--------------------	

    $scope.isAdded = false;
<<<<<<< HEAD
    $scope.check_dates = function (rem, formData_price_data) {
=======
    $scope.check_dates = function(rem, formData_price_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.clear_date_validation();
        $scope.isAdded = false;

        var from = dmyToDate($(".ck_sdate").val());
        from.setHours(0);
        var to = dmyToDate($(".ck_edate").val());
        to.setHours(0);

        if (rem == 1) {
            var msg = 'Start Date .';
<<<<<<< HEAD
            var check = dmyToDate($("#vl_sdate").val());//new Date(this.formData_price_data.start_date);
=======
            var check = dmyToDate($("#vl_sdate").val()); //new Date(this.formData_price_data.start_date);
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            check.setHours(0);
            if (!((Date.parse(check) >= Date.parse(from)) && (Date.parse(check) <= Date.parse(to)))) {
                $scope.isAdded = true;
                toaster.pop('error', 'info', 'Invalid ' + msg);
                $('#date_block_start_new').attr("disabled", true);
                // $('.date_block_start_validation').attr("disabled", true);
            }
        }

        if (rem == 2) {

            var msg = 'End Date .';
            var check = dmyToDate($("#vl_edate").val());
            new Date(this.formData_price_data.end_date);
            check.setHours(0);


            if (!((Date.parse(check) >= Date.parse(from)) && (Date.parse(check) <= Date.parse(to))))
            //if ( (check  >=from) && (check <= to ) )
            {
                $scope.isAdded = true;
                toaster.pop('error', 'info', 'Invalid ' + msg);
                //$('.date_block_end_validation').attr("disabled", true);
                $('.date_block_end').attr("disabled", true);
            }
        }

        console.log(check);
        console.log(from);
        console.log(to);
    }


    function dmyToDate(date) {
        //console.log(date.split("/")[2] + "-" + date.split("/")[1] + "-" +date.split("/")[0]);
        return new Date(date.split("/")[2] + "-" + date.split("/")[1] + "-" + date.split("/")[0]);
    }


<<<<<<< HEAD
    $scope.clear_date = function () {
=======
    $scope.clear_date = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $('.date_block_1').attr("disabled", false);
        $('.date_block_11').attr("disabled", false);
        $('.date_block_2').attr("disabled", false);
        $('.date_block_22').attr("disabled", false);
        $('.date_block_3').attr("disabled", false);
        $('.date_block_33').attr("disabled", false);

    }

<<<<<<< HEAD
    $scope.check_min_max_order = function (arg) {
=======
    $scope.check_min_max_order = function(arg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $('.picc_block').attr("disabled", false);
        $('.max_block').attr("disabled", false);
        return;

        var counter = 0;

        if (arg == 1) {
            if ($scope.formData.min_quantity != undefined && $scope.formData.max_quantity != undefined)
                counter++;

            if (counter) {

                //	if( (angular.element("#min_quantity").val() >= angular.element("#mix_quantity").val()) )
                if (Number($scope.formData.min_quantity) >= Number($scope.formData.max_quantity)) {
                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(321, ['Min Order ', 'Max Order']));
                    $('.picc_block').attr("disabled", true);
                    return;
<<<<<<< HEAD
                }
                else
                    $('.picc_block').attr("disabled", false);
            }
        }

        else if (arg == 2) {
=======
                } else
                    $('.picc_block').attr("disabled", false);
            }
        } else if (arg == 2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            if ($scope.priceFormData.min_quantity != undefined && $scope.priceFormData.max_quantity != undefined)
                counter++;
            if (counter) {
                //console.log(angular.element("#p_min_quantity").val());	console.log(angular.element("#p_max_quantity").val());
                //	console.log($scope.priceFormData.min_quantity >= $scope.priceFormData.max_quantity);
                //$scope.result = angular.equals($scope.user1, $scope.user2);
                //	if( (angular.element("#p_min_quantity").val() >= angular.element("#p_max_quantity").val()) )
                if (Number($scope.priceFormData.min_quantity) >= Number($scope.priceFormData.max_quantity)) {
                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(321, ['Min Order ', 'Max Order']));
                    $('.max_block').attr("disabled", true);
                    return;
<<<<<<< HEAD
                }
                else
=======
                } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $('.max_block').attr("disabled", false);
            }


        }
    }


    $scope.lead_types = [];
    $scope.lead_types = [{ 'label': 'Hours', 'value': 1 }, { 'label': 'Days', 'value': 2 }, {
        'label': 'Weeks',
        'value': 3
    }, { 'label': 'Months', 'value': 4 }];

    $scope.form_before_edit = false;
    $scope.form_after_edit = false;

<<<<<<< HEAD
    $scope.delete_sale_price = function (id, index, arr_data) {
=======
    $scope.delete_sale_price = function(id, index, arr_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var delUrl = $scope.$root.stock + "products-listing/delete-purchase-info";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
=======
        }).then(function(value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        //  $scope.show_price_price(remander_id);

                        arr_data.splice(index, 1);
<<<<<<< HEAD
                    }
                    else
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));

                });
        }, function (reason) {
=======
                    } else
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));

                });
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            //console.log('Modal promise rejected. Reason: ', reason);
        });

    }


<<<<<<< HEAD
    $scope.chkPrice = function () {
=======
    $scope.chkPrice = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if ($scope.priceFormData.unit_price == undefined)
            return;
        $scope.validatePrice($scope.priceFormData.unit_price);
    }

<<<<<<< HEAD
    $scope.validatePrice = function (price) {
=======
    $scope.validatePrice = function(price) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var isValide = true;

        if (Number($scope.priceFormData.unit_price) == 0 || $scope.priceFormData.purchase_measure == undefined || $scope.priceFormData.currency_id == undefined) {
            toaster.pop('error', 'Info', 'Please set the  U.O.M  ,Purchase Cost.');
            $('.cur_block').attr("disabled", false);
            isValide = false;
            return;
        }


        var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
        $http
            .post(currencyURL, { 'id': $scope.priceFormData.currency_id.id, token: $scope.$root.token })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                if (res.data.ack == true) {

                    if (res.data.response.conversion_rate == null) {
<<<<<<< HEAD
                        toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
=======
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Currency Conversion Rate']));
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.priceFormData.unit_price = null;
                        $scope.priceFormData.converted_price = null;
                        return;
                    }


                    var newPrice1 = Number($scope.priceFormData.unit_price);
                    var newPrice = 0;
                    if ($scope.priceFormData.purchase_measure.unit_id != $scope.priceFormData.unit_id.id) {

                        if ($scope.priceFormData.purchase_measure.ref_unit_id != $scope.priceFormData.unit_id.id) {
                            // get the quatity according to base unit id
                            console.log('hello111111==>');
                            newPrice1 = ($scope.priceFormData.unit_price) / ($scope.priceFormData.purchase_measure.ref_quantity);
<<<<<<< HEAD
                        }
                        else {
=======
                        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            console.log('hello2222222222==>');
                            newPrice1 = ($scope.priceFormData.unit_price) / ($scope.priceFormData.purchase_measure.quantity);
                        }
                    }


                    if ($scope.priceFormData.currency_id.id != $scope.$root.defaultCurrency)
                        newPrice = Number(newPrice1) / Number(res.data.response.conversion_rate);
                    else
                        newPrice = Number(newPrice1);

                    $scope.priceFormData.converted_price = Number(newPrice).toFixed(2);

                    $('.cur_block').attr("disabled", false);
<<<<<<< HEAD
                }
                else {
                    toaster.pop('error', 'Info',$scope.$root.getErrorMessageByCode(230,['Currency Conversion Rate']));
=======
                } else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Currency Conversion Rate']));
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $('.cur_block').attr("disabled", true);
                    $scope.priceFormData.unit_price = null;
                    $scope.priceFormData.converted_price = null;
                    return;
                }
            });

        // return isValide;
    }

<<<<<<< HEAD
    $scope.currency_list = function (val) {
=======
    $scope.currency_list = function(val) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var id = 0;
        if (val > 0)
            id = $scope.priceFormData.currency_id.id;
        else
            id = $scope.$root.defaultCurrency;

<<<<<<< HEAD
        angular.forEach($rootScope.arr_currency, function (elem) {
=======
        angular.forEach($rootScope.arr_currency, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (elem.id == id)
                $scope.priceFormData.currency_id = elem;
        });

        if ($scope.priceFormData.currency_id == undefined)
            $scope.priceFormData.sale_currency = $scope.priceFormData.currency_id.code;
    };

<<<<<<< HEAD
    $scope.showEditPurchasevolume_form = function () {
=======
    $scope.showEditPurchasevolume_form = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.check_item_readonly_volume = false;
        $scope.perreadonly_purchase_volume = true;

        $scope.formData_price_data.purchase_price = $scope.$root.number_format_remove($scope.formData_price_data.purchase_price, $scope.decimal_range);
        $scope.formData_price_data.discount_value = $scope.$root.number_format_remove($scope.formData_price_data.discount_value, $scope.decimal_range);
        $scope.formData_price_data.discount_price = $scope.$root.number_format_remove($scope.formData_price_data.discount_price, $scope.decimal_range);
    }

<<<<<<< HEAD
    $scope.get_price_sale_volume_pop = function (p_id, id, product_id) {
=======
    $scope.get_price_sale_volume_pop = function(p_id, id, product_id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var postUrl = $scope.$root.pr + "srm/srm/supplier_list";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
            'purchase_info_id': p_id,
            'supplier_id': id,
<<<<<<< HEAD
            'product_id': product_id//$stateParams.id
=======
            'product_id': product_id //$stateParams.id
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        };

        $http
            .post(postUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.supplier_list = [];
                $scope.columns_sale = [];
                $scope.clear_date();
                $scope.current_date = $scope.$root.get_current_date();

                if (res.data.ack == true) {

                    if (Number(res.data.total) > 0)
                        $scope.count = res.data.total;

                    $scope.supplier_list = res.data.response;
<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columns_sale.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
                //  else   toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });
        $('#model_purcase_info').modal({ show: true });
    }

<<<<<<< HEAD
    $scope.get_price_sale_volume = function (id, product_id) {
=======
    $scope.get_price_sale_volume = function(id, product_id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.price_volume_form = false;
        $scope.price_volume_list = true;

        var postData = {
            'token': $scope.$root.token,
            'all': "1",
            'purchase_info_id': $scope.priceFormData.update_id,
            'supplier_id': id,
            'product_id': product_id
        };

        $http
            .post(postUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.supplier_list = [];
                $scope.columns_sale = [];
                $scope.clear_date();
                $scope.current_date = $scope.$root.get_current_date();

                if (res.data.ack == true) {

                    if (Number(res.data.total) > 0)
                        $scope.count = res.data.total;

                    $scope.supplier_list = res.data.response;
<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.columns_sale.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                }
                //  else   toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });
    }

<<<<<<< HEAD
    $scope.fn_volume_Form = function () {
=======
    $scope.fn_volume_Form = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.check_item_readonly_volume = false;
        $scope.perreadonly_purchase_volume = true;

        $scope.clear_date_validation();
        $scope.formData_price_data = {};
        $scope.clear_date();

        $scope.change_unit_price();
        $scope.formData_price_data_start_date = $scope.$root.get_current_date();

        $scope.price_volume_form = true;
        $scope.price_volume_list = false;
        $scope.get_volume_all(2, $scope.priceFormData.product_id);

        $scope.formData_price_data.purchase_price =
            $scope.$root.number_format_remove($scope.formData_price_data.purchase_price, $scope.decimal_range);

    };


<<<<<<< HEAD
    $scope.purchase_info_edit_volume = function (id, pid) {
=======
    $scope.purchase_info_edit_volume = function(id, pid) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.check_item_readonly_volume = true;
        $scope.perreadonly_purchase_volume = false;

        var postUrl = $scope.$root.pr + "srm/srm/supplier_by_id";
        var postData = {
            'token': $scope.$root.token,
            'id': id
        };
        $scope.clear_date_validation();
        $scope.get_volume_all(2, $scope.priceFormData.product_id);
        $scope.formData_price_data.update_id = id;
        $http
            .post(postUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                $scope.formData_price_data.purchase_price = $scope.$root.number_format(res.data.response.purchase_price, $scope.decimal_range);
                $scope.formData_price_data.discount_value = $scope.$root.number_format(res.data.response.discount_value, $scope.decimal_range);
                $scope.formData_price_data.discount_price = $scope.$root.number_format(res.data.response.discount_price, $scope.decimal_range);

                $scope.formData_price_data.volume_id = res.data.response.volume_id;

                if (res.data.response.start_date == 0)
                    $scope.formData_price_data.start_date = null;
                else
                    $scope.formData_price_data.start_date = $scope.$root.convert_unix_date_to_angular(res.data.response.start_date);
                if (res.data.response.end_date == 0)
                    $scope.formData_price_data.end_date = null;
                else
                    $scope.formData_price_data.end_date = $scope.$root.convert_unix_date_to_angular(res.data.response.end_date);


<<<<<<< HEAD
                angular.forEach($scope.list_type, function (obj) {
=======
                angular.forEach($scope.list_type, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id == res.data.response.supplier_type) {
                        $scope.formData_price_data.supplier_type = obj
                    }
                });

<<<<<<< HEAD
                angular.forEach($scope.arr_volume_id, function (obj) {
=======
                angular.forEach($scope.arr_volume_id, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id == res.data.response.volume_id) {
                        $scope.formData_price_data.volume_id = obj;
                    }
                });
            });

        $scope.price_volume_form = true;
        $scope.price_volume_list = false;
    }

    var volumeUrl_item = $scope.$root.stock + "unit-measure/get-sale-offer-volume-by-type";
    var addvolumeUrl_item = $scope.$root.stock + "unit-measure/add-sale-offer-volume";

<<<<<<< HEAD
    $scope.onChange_volume_price = function (a, as, volume_type) {
=======
    $scope.onChange_volume_price = function(a, as, volume_type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var volume_type = '';
        $scope.formData_vol_1 = {};

        var id = '';
        var volume = '';
        var category = '';

        id = this.formData_price_data.volume_id.id;
        volume = 'Volume  ' + volume_type;
        category = volume_type;
        $scope.title_type = 'Add Volume ' + volume_type;

        $scope.formData_vol_1.volume = volume;
        $scope.formData_vol_1.title_type = $scope.title_type;
        $scope.formData_vol_1.ref_service_type = volume_type;

        $scope.formData_vol_1.type = volume_type;
        $scope.formData_vol_1.category = 2; //category;

        if (id == -1) {

            if ($scope.priceFormData.purchase_measure != undefined) {
                $('#model_vol_price').modal({ show: true });

                $scope.list_unit_category = [];
                $scope.list_unit_category = [{
                    'id': $scope.priceFormData.purchase_measure.id,
                    'name': $scope.priceFormData.purchase_measure.name
                }];
                $scope.formData_vol_1.unit_category = $scope.list_unit_category[0];
<<<<<<< HEAD
            }
            else
=======
            } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Unit Of Measure']));
        }
    }

<<<<<<< HEAD
    $scope.get_volume_all = function (arg, prod_id) {
=======
    $scope.get_volume_all = function(arg, prod_id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $http
            .post(volumeUrl_purchase, {
                category: arg,
                'purchase_info_id': $scope.priceFormData.update_id,
                'product_id': prod_id,
                'supplier_id': $stateParams.id,
                'token': $scope.$root.token
            })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.arr_volume_id = [];
                $scope.arr_volume_id.push({ 'id': '', 'name': '' });
                if (res.data.ack == true)
                    $scope.arr_volume_id = res.data.response;

                if ($scope.user_type == 1)
                    $scope.arr_volume_id.push({ 'id': '-1', 'name': '++ Add New ++' });
            });
    }

    var volumeUrl_purchase = $scope.$root.stock + "unit-measure/get-unit-srm-purchase-info";
    var addvolumeUrl_purchase = $scope.$root.stock + "unit-measure/add-unit-srm-purchase-info";

<<<<<<< HEAD
    $scope.show_price_price = function (arg, formData_price_data) {
=======
    $scope.show_price_price = function(arg, formData_price_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var price = 0;
        var final_price = 0;
        var final_price_one = 0;

        price = this.formData_price_data.purchase_price;
        var f_id = this.formData_price_data.supplier_type.id;

        if (f_id == 1) {
            var final_price_one = (parseFloat(this.formData_price_data.discount_value)) * (parseFloat(price)) / 100;
            final_price = (parseFloat(price)) - (parseFloat(final_price_one));
<<<<<<< HEAD
        }
        else if (f_id == 2) {
=======
        } else if (f_id == 2) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            final_price = (parseFloat(price)) - (parseFloat(this.formData_price_data.discount_value));
        }

        var final_new = (Math.round(final_price * 100) / 100).toFixed(2);
        if (final_new != 'NaN')
            this.formData_price_data.discount_price = final_new;
    }

<<<<<<< HEAD
    $scope.delete_volume = function (id, index, arr_data) {
=======
    $scope.delete_volume = function(id, index, arr_data) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        if ($scope.priceFormData.item_order_check > 0) {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(549));
            return;
        }

        var delUrl = $scope.$root.pr + "srm/srm/delete_sp_id";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
<<<<<<< HEAD
        }).then(function (value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data.splice(index, 1);
                    }
                    else
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                });
        }, function (reason) {
=======
        }).then(function(value) {
            $http
                .post(delUrl, { id: id, 'token': $scope.$root.token })
                .then(function(res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        arr_data.splice(index, 1);
                    } else
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                });
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };


<<<<<<< HEAD
    $scope.supplier_pop_price_sale = function (id, pid) {
=======
    $scope.supplier_pop_price_sale = function(id, pid) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        //  $scope.get_item_voume_list(1, pid);

        var postUrl = $scope.$root.pr + "srm/srm/supplier_by_id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };

        $scope.formData_price_data.sp_id = id;
        $scope.sp_id = id;


        $http
            .post(postUrl, postViewBankData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.formData_price_data.purchase_price_1 = res.data.response.purchase_price;
                $scope.formData_price_data.discount_price_1 = res.data.response.discount_price;
                $scope.formData_price_data.discount_value = res.data.response.discount_value;
                $scope.formData_price_data.volume_1 = res.data.response.volume_1;
                $scope.formData_price_data.volume_2 = res.data.response.volume_2;
                $scope.formData_price_data.volume_3 = res.data.response.volume_3;

                $scope.formData_price_data.purchase_price_11 = res.data.response.purchase_price;
                $scope.formData_price_data.discount_value_11 = res.data.response.discount_value;
                $scope.formData_price_data.discount_price_11 = res.data.response.discount_price;

<<<<<<< HEAD
                angular.forEach($scope.list_type, function (obj) {
=======
                angular.forEach($scope.list_type, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id == res.data.response.supplier_type) {
                        $scope.formData_price_data.supplier_type_11 = $scope.list_type[index];
                    }
                });

<<<<<<< HEAD
                angular.forEach($scope.arr_volume_1, function (obj) {
=======
                angular.forEach($scope.arr_volume_1, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id == res.data.response.volume_id) {
                        $scope.formData_price_data.volume_id = obj;
                        //   console.log($scope.formData.volume_id);
                    }
                });

<<<<<<< HEAD
                angular.forEach($scope.arr_volume_2, function (obj) {
=======
                angular.forEach($scope.arr_volume_2, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id == res.data.response.volume_id) {
                        $scope.formData_price_data.volume_id = obj;
                    }
                });

<<<<<<< HEAD
                angular.forEach($scope.arr_volume_3, function (obj) {
=======
                angular.forEach($scope.arr_volume_3, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (obj.id == res.data.response.volume_id) {
                        $scope.formData_price_data.volume_id = obj;
                    }
                });
            });

        angular.element('#model_btn_supplier_price').modal({
            show: true
        });
    }

<<<<<<< HEAD
    $scope.show_price_one_pop_price = function () {
=======
    $scope.show_price_one_pop_price = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var price = 0;
        var final_price = 0;

        price = $scope.formData_price_data.purchase_price_11;

        var f_id = this.formData_price_data.supplier_type_11.id;

        if (f_id == 1) {
            var final_price_one = "";
            final_price_one = (parseFloat($scope.formData_price_data.discount_value_11)) * (parseFloat(price)) / 100;

            final_price = (parseFloat(price)) - (parseFloat(final_price_one));

        } else if (f_id == 2) {
            final_price = (parseFloat(price)) - (parseFloat($scope.formData_price_data.discount_value_11));
        }

        $scope.formData_price_data.discount_price_11 = final_price;
    }


    var volumeUrl_item = $scope.$root.stock + "unit-measure/get-sale-offer-volume-by-type";
    var addvolumeUrl_item = $scope.$root.stock + "unit-measure/add-sale-offer-volume";

<<<<<<< HEAD
    $scope.add_sale_list = function () {
=======
    $scope.add_sale_list = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var selected_sales = "";
        var sale_currency = "";
        var selected_sales_ids = "";

<<<<<<< HEAD
        angular.forEach($scope.selection_record_get, function (val, index) {
=======
        angular.forEach($scope.selection_record_get, function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (angular.element('#selected_' + $scope.selection_record_get[index]['id']).is(':checked')) {
                selected_sales += $scope.selection_record_get[index]['name'] + ",";
                sale_currency += $scope.selection_record_get[index]['sale_currency'] + ",";
                selected_sales_ids += $scope.selection_record_get[index]['id'] + ",";
            }
        });
        angular.element('.display_record').html(selected_sales);
        $scope.priceFormData.sale_ids = selected_sales_ids;
        $scope.priceFormData.sale_names = selected_sales;
        $scope.priceFormData.sale_currency = sale_currency;
        angular.element('#price_sale_list_modal').modal('hide');
    };

<<<<<<< HEAD
    $scope.checkAll_price = function () {
=======
    $scope.checkAll_price = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.selectedList = '';
        $scope.Selected = '';

        var bool = angular.element("#selecctall_2").is(':checked');
        if (!bool) {
            angular.element('.pic_block').attr("disabled", true);
        } else {
            angular.element('.pic_block').attr("disabled", false);
        }

<<<<<<< HEAD
        angular.forEach($scope.selection_record_get, function (item) {
=======
        angular.forEach($scope.selection_record_get, function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            angular.element('#selected_' + item.id).prop('checked', bool);

        });
    };

<<<<<<< HEAD
    $scope.shownew_get_price = function (classname) {
=======
    $scope.shownew_get_price = function(classname) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $(".new_button_" + classname).hide();
        $(".replace_button_" + classname).show();
        var count = 0;

<<<<<<< HEAD
        angular.forEach($scope.selection_record_get, function (item) {
=======
        angular.forEach($scope.selection_record_get, function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            var bool = angular.element("#selected_" + item.id).is(':checked');
            if (bool) {
                count++;
            } else {
                angular.element('#selecctall_2').prop('checked', false);
            }
        });
        if (count == 0) {
            $('.pic_block').attr("disabled", true);
        } else {
            $('.pic_block').attr("disabled", false);
        }
    };

<<<<<<< HEAD
    $scope.calculate_price = function () {

        var count = 0;
        angular.forEach($scope.selection_record_get, function (value) {
=======
    $scope.calculate_price = function() {

        var count = 0;
        angular.forEach($scope.selection_record_get, function(value) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            if (angular.element('#selected_' + value.id).prop('checked'))
                count++;
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


    //---------------------   finance   ------------------------------------------


<<<<<<< HEAD
    $scope.getCharges = function (arg) {
=======
    $scope.getCharges = function(arg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if (arg == 'finance')
            var getChargesUrl = $scope.$root.setup + "crm/finance-charges";
        else
            var getChargesUrl = $scope.$root.setup + "crm/insurance-charges";
        var postData = {
            'token': $scope.$root.token,
            'all': "1",
        };
        $http
            .post(getChargesUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.columns = [];
                $scope.columns = res.data.columns;
                $scope.record = res.data.record.result;

            });

        ngDialog.openConfirm({
            template: 'modalCustDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
<<<<<<< HEAD
        }).then(function (result) {
=======
        }).then(function(result) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (arg == 'finance') {
                $scope.finance_charges_value = result['Description'];
                $scope.rec.finance_charges_id = result.id;
            } else {
                $scope.insurance_charges_value = result['Description'];
                $scope.rec.insurance_charges_id = result.id;
            }

<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

<<<<<<< HEAD
    $scope.getPaymentTerms = function (arg) {
=======
    $scope.getPaymentTerms = function(arg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.title = "Payment Terms";
        var getTermUrl = $scope.$root.setup + "crm/payment-terms";

        var postData = {
            'token': $scope.$root.token,
            'all': "1",
        };
        $http
            .post(getTermUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.columns = [];
                $scope.columns = res.data.columns;
                $scope.record = res.data.record.result;

            });

        ngDialog.openConfirm({
            template: 'modalCustDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
<<<<<<< HEAD
        }).then(function (result) {
            //console.log(result);
            $scope.rec.payment_term = result.Description;
            $scope.rec.payment_terms_id = result.id;
        }, function (reason) {
=======
        }).then(function(result) {
            //console.log(result);
            $scope.rec.payment_term = result.Description;
            $scope.rec.payment_terms_id = result.id;
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }


<<<<<<< HEAD
    $scope.getBankAccount = function (arg) {
=======
    $scope.getBankAccount = function(arg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.title = 'Payable Bank';
        var getBankUrl = $scope.$root.setup + "general/bank-accounts";
        $scope.searchKeyword_sup = "";
        //arr_bank

        var postData = { 'token': $scope.$root.token, 'filter_id': 152 };
        $http
            .post(getBankUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.columns_sup = [];
                //	$scope.columns = res.data.columns;
                $scope.record = res.data.response;


<<<<<<< HEAD
                angular.forEach(res.data.response[0], function (val, index) {
=======
                angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.columns_sup.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                });

                angular.element('#_model_modal_bank_order').modal({ show: true });

            });

    }


<<<<<<< HEAD
    $scope.confirm_bank = function (btc) {
=======
    $scope.confirm_bank = function(btc) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        // $scope.rec_finance.bank_name = btc.name;
        $scope.rec_finance.bank_name = btc.bank_name;
        $scope.rec_finance.bank_account_id = btc.id;
        // $scope.rec.bill_to_bank_name = btc.account_name;
        // $scope.rec.bill_to_bank_id = btc.id;
        angular.element('#_model_modal_bank_order').modal('hide');
    }
<<<<<<< HEAD
    $scope.getBankAccountdd = function (arg) {
=======
    $scope.getBankAccountdd = function(arg) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.title = 'Banks';
        var postData = { 'token': $scope.$root.token, 'filter_id': 152 };
        $http
            .post(getBankUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.columns = [];
                $scope.record = {};
                //$scope.columns = res.data.columns;
                // $scope.record = res.data.record.result;	

                $scope.record = res.data.response;
<<<<<<< HEAD
                angular.forEach(res.data.response[0], function (val, index) {
=======
                angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.columns.push({
                        'title': toTitleCase(index),
                        'field': index,
                        'visible': true
                    });
                });


            });

        ngDialog.openConfirm({
            template: 'modalCustDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
<<<<<<< HEAD
        }).then(function (elem) {
=======
        }).then(function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log(elem);

            $scope.rec.bank_name = elem['Account Name'];
            $scope.rec.bank_account_id = elem.id;
<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };

<<<<<<< HEAD
    $scope.getsupplier_list = function () {
=======
    $scope.getsupplier_list = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.title = 'Suppliers';

        //var custUrl = $scope.$root.sales + "customer/customer/listings";
        var custUrl = $scope.$root.pr + "supplier/supplier/listings";
        var custUrl2 = $scope.$root.sales + "customer/customer/check-customer-limit";
        var postData = {
            'token': $scope.$root.token,
            'srm_id': $stateParams.id,
            'more_fields': "code*city*contact_person*country*postcode"
        };
        $http
            .post(custUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
                $scope.columns = [];
                $scope.record = {};
                $scope.record = res.data.response;
                angular.forEach(res.data.response[0], function (val, index) {
=======
            .then(function(res) {
                $scope.columns = [];
                $scope.record = {};
                $scope.record = res.data.response;
                angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (index != "country" && index != "purchase_code") {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    }
                });

            });
        ngDialog.openConfirm({
            template: 'app/views/supplier/_listing_modal_2.html',
            className: 'ngdialog-theme-default',
            scope: $scope
<<<<<<< HEAD
        }).then(function (result) {
=======
        }).then(function(result) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            $scope.rec_finance.bill_to_customer = result.name;
            $scope.rec_finance.bill_to_customer_id = result.id;

<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };

    $scope.searchKeyword_sup_gl_code = {};

<<<<<<< HEAD
    $scope.getpurchaseGL = function (arg, item_paging) {
=======
    $scope.getpurchaseGL = function(arg, item_paging) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564


        var postUrl_cat = $scope.$root.gl + "chart-accounts/get-category-by-name";

        $scope.postData = {};
        $scope.postData.cat_id = [];

        if (arg == 'purchase') {
            $scope.type_id = 1;
            $scope.title = 'Purchase Account';
            //$scope.postData.cat_id = 3;
            $scope.postData.cat_id = [4];
<<<<<<< HEAD
        }
        else if (arg == 'payable') {
=======
        } else if (arg == 'payable') {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.type_id = 2;
            $scope.title = 'Account Payable';
            // $scope.postData.cat_id = 4;
            $scope.postData.cat_id = [1];

        }

        $scope.postData.token = $scope.$root.token;
        $scope.postData.suppler_id = $scope.rec.sell_to_cust_id;

        if (item_paging == 1)
            $rootScope.item_paging.spage = 1;
        $scope.postData.page = $rootScope.item_paging.spage;

        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;
        //$scope.postData.pagination_limits = 25;

        $scope.postData.searchKeyword = "";
        $scope.postData.searchKeyword = $scope.searchKeyword_sup_gl_code.$;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }

        $scope.showLoader = true;

        $http
            .post(postUrl_cat, $scope.postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                console.log(res);
                $scope.column_gl = [];
                // $scope.record_gl = {};
                $scope.gl_account = [];

                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.record = res.data.response;
                    $scope.record_data = res.data.response;
                    $scope.category_list = res.data.response;
                    $scope.gl_arg = arg;

<<<<<<< HEAD
                    angular.forEach(res.data.response, function (obj) {
                        $scope.gl_account.push(obj);
                    });
                }
                else
=======
                    angular.forEach(res.data.response, function(obj) {
                        $scope.gl_account.push(obj);
                    });
                } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });

        $scope.showLoader = false;
        angular.element('#financePurchase').modal({ show: true });
    };

<<<<<<< HEAD
    $scope.assignCodes = function (gl_data) {

        //console.log(gl_data);
        if ($scope.type_id == 1) {
            $scope.rec_finance.purchase_code_number = gl_data.name + " " + gl_data.code;
            $scope.rec_finance.purchase_code_id = gl_data.id;
        }
        else if ($scope.type_id == 2) {
            $scope.rec_finance.account_payable_number = gl_data.name + " " + gl_data.code;
            $scope.rec_finance.account_payable_id = gl_data.id;
        }
        angular.element('#financePurchase').modal('hide');
=======
    $scope.assignCodes = function(gl_data) {

        //console.log(gl_data);
        if ($scope.type_id == 1) {
            $scope.rec_finance.purchase_code_number = gl_data.code + " - " + gl_data.name;
            $scope.rec_finance.purchase_code_id = gl_data.id;
        } else if ($scope.type_id == 2) {
            $scope.rec_finance.account_payable_number = gl_data.code + " - " + gl_data.name;
            $scope.rec_finance.account_payable_id = gl_data.id;
        }
        angular.element('#financePurchase').modal('hide');
        angular.element('#finance_set_gl_account').modal('hide');
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
    };

    $scope.rec_finance = {};

<<<<<<< HEAD
    $scope.setGenerate = function (id) {
=======
    $scope.setGenerate = function(id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        for (var i = 0; i < $scope.arr_generate.length; i++) {
            if (id == $scope.arr_generate[i].id) {
                if ($scope.arr_generate[i].chk == true)
                    $scope.arr_generate[i].chk = false
                else
                    $scope.arr_generate[i].chk = true
            }
        }
    }


<<<<<<< HEAD
    $scope.general_finance = function () {

        $scope.arr_generate = [{ 'id': '1', 'name': 'E-Purchase Order', 'chk': false },
        { 'id': '2', 'name': 'E-Debit Note', 'chk': false },
        { 'id': '3', 'name': 'E-Remittance Advice', 'chk': false }];
=======
    $scope.general_finance = function() {

        $scope.arr_generate = [{ 'id': '1', 'name': 'E-Purchase Order', 'chk': false },
            { 'id': '2', 'name': 'E-Debit Note', 'chk': false },
            { 'id': '3', 'name': 'E-Remittance Advice', 'chk': false }
        ];
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.rec_finance = {};
        // $scope.$root.breadcrumbs[3].name = 'Finance';
        $scope.check_srm_finance_readonly = true;

        $scope.showLoader = true;

        var getFinance = $scope.$root.pr + 'supplier/supplier/get-supplier-finance';
        $http
            .post(getFinance, { 'token': $scope.$root.token, supplier_id: $scope.$root.supplier_id })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.rec_finance = res.data.response;
                    $scope.rec_finance.update_id_fin = res.data.response.id;
                    $scope.check_srm_finance_readonly = true;


                    $scope.drp.email_1 = res.data.response.purchaseOrderEmail;
                    $scope.drp.email_2 = res.data.response.debitNoteEmail;
                    $scope.drp.email_3 = res.data.response.remittanceAdviceEmail;

                    if (res.data.response.generate) {
                        var arrGen = res.data.response.generate.split(',');
<<<<<<< HEAD
                        angular.forEach($scope.arr_generate, function (elem, index) {
=======
                        angular.forEach($scope.arr_generate, function(elem, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            var indx = arrGen.indexOf(elem.id) == -1;
                            if (!indx) {
                                $scope.arr_generate[index].chk = true;
                            }
                        });
                    }


                    if (res.data.response.account_name != null)
                        angular.element("button").attr("aria-expanded", "true");

                    /* angular.forEach($scope.arr_payment_terms, function (elem, index) {
                        if (elem.id == res.data.response.payment_terms_id)
                            $scope.drp.payment_terms_ids = elem;
                    });
                    angular.forEach($scope.paymentmet, function (elem, index) {
                        if (elem.id == res.data.response.payment_method_id)
                            $scope.drp.payment_method_ids = elem;
                    }); */

<<<<<<< HEAD
                    angular.forEach($rootScope.arr_srm_payment_terms, function (elem, index) {
=======
                    angular.forEach($rootScope.arr_srm_payment_terms, function(elem, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (elem.id == res.data.response.payment_terms_id)
                            $scope.drp.payment_terms_ids = elem;
                    });

<<<<<<< HEAD
                    angular.forEach($rootScope.arr_srm_payment_methods, function (elem, index) {
=======
                    angular.forEach($rootScope.arr_srm_payment_methods, function(elem, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (elem.id == res.data.response.payment_method_id)
                            $scope.drp.payment_method_ids = elem;
                    });

                    /* angular.forEach($rootScope.arr_posting_group_ids, function (elem2, index) {

                        if (elem2.id == res.data.response.posting_group_id)
                            $scope.drp.posting_group_ids = elem2;
                    }); */

<<<<<<< HEAD
                    angular.forEach($rootScope.postingGroups, function (elem2, index) {
=======
                    angular.forEach($rootScope.postingGroups, function(elem2, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (elem2.id == res.data.response.posting_group_id)
                            $scope.drp.posting_group_ids = elem2;
                    });
                }
            });
    }

<<<<<<< HEAD
    $scope.add_finance = function (rec, drp) {
=======
    $scope.add_finance = function(rec, drp) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        rec.supplier_id = $scope.$root.supplier_id;
        rec.token = $scope.$root.token;
        rec.type = 'customer';
        rec.id = rec.update_id_fin;

        rec.purchaseOrderEmail = drp.email_1;
        rec.debitNoteEmail = drp.email_2;
        rec.remittanceAdviceEmail = drp.email_3;

<<<<<<< HEAD
        if (angular.element('#genexcl_from_report').is(':checked') == false){
            rec.excl_from_report = 0;
            $scope.rec_finance.excl_from_report = false;
        }            
        else{
            rec.excl_from_report = 1;
            $scope.rec_finance.excl_from_report = true;
        } 
=======
        if (angular.element('#genexcl_from_report').is(':checked') == false) {
            rec.excl_from_report = 0;
            $scope.rec_finance.excl_from_report = false;
        } else {
            rec.excl_from_report = 1;
            $scope.rec_finance.excl_from_report = true;
        }
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var strGen = [];
        for (var i = 0; i < $scope.arr_generate.length; i++) {
            if ($scope.arr_generate[i].chk == true)
                strGen.push($scope.arr_generate[i].id);
        }

        rec.generate = strGen.toString();

        rec.vat_bus_posting_group = $scope.drp.vat_bus_posting_group != undefined ? $scope.drp.vat_bus_posting_group.id : 0;
        rec.customer_posting_group = $scope.drp.customer_posting_group != undefined ? $scope.drp.customer_posting_group.id : 0;
        rec.payment_method_id = $scope.drp.payment_method_ids != undefined ? $scope.drp.payment_method_ids.id : 0;
        rec.payment_terms_id = $scope.drp.payment_terms_ids != undefined ? $scope.drp.payment_terms_ids.id : 0;
        rec.overrider_id = $scope.drp.overrider_ids != undefined ? $scope.drp.overrider_ids.id : 0;
        rec.posting_group_id = $scope.drp.posting_group_ids != undefined ? $scope.drp.posting_group_ids.id : 0;

        if (!(rec.posting_group_id > 0)) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(527, ['Posting Group']));
            return false;
        }
        $scope.showLoader = true;

        var addFinance = $scope.$root.pr + 'supplier/supplier/update-finance';
        $http
            .post(addFinance, rec)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

                $scope.showLoader = false;
                if (res.data.ack == true) {
                    //  $scope.general_finance();
                    $scope.check_srm_finance_readonly = true;

                    if (res.data.status == 'update')
                        toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    else if (res.data.status == 'insert')
                        toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                } else
                    toaster.pop('error', 'Info', res.data.msg);
            });
    }

<<<<<<< HEAD
    $scope.addNewCharges = function (drpdown, type, title, drp) {
=======
    $scope.addNewCharges = function(drpdown, type, title, drp) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var id = drpdown.id;
        if (id > 0)
            return false;

        $scope.popup_title = title;
        $scope.pedefined = {};

        ngDialog.openConfirm({
            template: 'app/views/supplier/add_new_charges.html',
            className: 'ngdialog-theme-default',
            scope: $scope
<<<<<<< HEAD
        }).then(function (pedefined) {
=======
        }).then(function(pedefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            /*console.log(pedefined);
             return false;*/

            pedefined.token = $scope.$root.token;
            pedefined.type = type;
            if (type == 1)
                var postUrl = $scope.$root.setup + "crm/add-finance-charges";
            if (type == 2)
                var postUrl = $scope.$root.setup + "crm/add-insurance-charges";
            if (type == 3)
                var postUrl = $scope.$root.setup + "crm/add-overrider";
            // 	var postUrl = $scope.$root.setup+"crm/add-payment-term";

            $http
                .post(postUrl, pedefined)
<<<<<<< HEAD
                .then(function (ress) {
=======
                .then(function(ress) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (ress.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        if (type == 1)
                            var constUrl = $scope.$root.setup + "crm/finance-charges";
                        if (type == 2)
                            var constUrl = $scope.$root.setup + "crm/insurance-charges";
                        if (type == 3)
                            var constUrl = $scope.$root.setup + "crm/overrider";
                        $http
                            .post(constUrl, { 'token': $scope.$root.token, 'all': 1 })
<<<<<<< HEAD
                            .then(function (res) {
=======
                            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (type == 1) {
                                    $scope.arr_finance_charges = res.data.record.result;
                                    $scope.arr_finance_charges.push({ 'id': '-1', 'Discount': '++ Add New ++' });

<<<<<<< HEAD
                                    angular.forEach($scope.arr_finance_charges, function (elem) {
=======
                                    angular.forEach($scope.arr_finance_charges, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        if (elem.id == ress.data.id)
                                            drp.finance_charges_ids = elem;
                                    });
                                }

                                if (type == 2) {
                                    $scope.arr_insurance_charges = res.data.record.result;
                                    $scope.arr_insurance_charges.push({ 'id': '-1', 'Charge': '++ Add New ++' });

<<<<<<< HEAD
                                    angular.forEach($scope.arr_insurance_charges, function (elem) {
=======
                                    angular.forEach($scope.arr_insurance_charges, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        if (elem.id == ress.data.id)
                                            drp.insurance_charges_ids = elem;
                                    });
                                }

                                if (type == 3) {
                                    $scope.arr_overrider = [];
                                    $scope.arr_overrider = res.data.response;
                                    $scope.arr_overrider.push({ 'id': '-1', 'charge': '++ Add New ++' });

<<<<<<< HEAD
                                    angular.forEach($scope.arr_overrider, function (elem) {
=======
                                    angular.forEach($scope.arr_overrider, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        if (elem.id == ress.data.id)
                                            $scope.drp.overrider_ids = elem;
                                    });
                                }
                            });
                    }
                });
<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

<<<<<<< HEAD
    $scope.addNewCharges_2 = function (drpdown, type, title, drp) {
=======
    $scope.addNewCharges_2 = function(drpdown, type, title, drp) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var id = drpdown.id;
        if (id > 0)
            return false;

        $scope.popup_title = title;
        $scope.pedefined = {};

        ngDialog.openConfirm({
            template: 'app/views/finance_customer/add_new_charges.html',
            className: 'ngdialog-theme-default',
            scope: $scope
<<<<<<< HEAD
        }).then(function (pedefined) {
=======
        }).then(function(pedefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            /*console.log(pedefined);
             return false;*/

            pedefined.token = $scope.$root.token;
            pedefined.type = type;
            if (type == 1)
                var postUrl = $scope.$root.setup + "crm/add-finance-charges";
            if (type == 2)
                var postUrl = $scope.$root.setup + "crm/add-insurance-charges";
            if (type == 3)
                var postUrl = $scope.$root.setup + "crm/add-payment-term";

            $http
                .post(postUrl, pedefined)
<<<<<<< HEAD
                .then(function (ress) {
=======
                .then(function(ress) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (ress.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        if (type == 1)
                            var constUrl = $scope.$root.setup + "crm/finance-charges";
                        if (type == 2)
                            var constUrl = $scope.$root.setup + "crm/insurance-charges";
                        if (type == 3)
                            var constUrl = $scope.$root.setup + "srm/srm-get-srm-payment-terms-list";

                        $http
                            .post(constUrl, { 'token': $scope.$root.token, 'all': 1 })
<<<<<<< HEAD
                            .then(function (res) {
=======
                            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                if (type == 1) {
                                    $scope.arr_finance_charges = res.data.record.result;
                                    $scope.arr_finance_charges.push({ 'id': '-1', 'Discount': '++ Add New ++' });

<<<<<<< HEAD
                                    angular.forEach($scope.arr_finance_charges, function (elem) {
=======
                                    angular.forEach($scope.arr_finance_charges, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        if (elem.id == ress.data.id)
                                            drp.finance_charges_ids = elem;
                                    });
                                }

                                if (type == 2) {
                                    $scope.arr_insurance_charges = res.data.record.result;
                                    $scope.arr_insurance_charges.push({ 'id': '-1', 'Charge': '++ Add New ++' });

<<<<<<< HEAD
                                    angular.forEach($scope.arr_insurance_charges, function (elem) {
=======
                                    angular.forEach($scope.arr_insurance_charges, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        if (elem.id == ress.data.id)
                                            drp.insurance_charges_ids = elem;
                                    });
                                }

                                if (type == 3) {
                                    $scope.arr_payment_terms = res.data.response;
                                    $scope.arr_payment_terms.push({ 'id': '-1', 'name': '++ Add New ++' });

<<<<<<< HEAD
                                    angular.forEach($scope.arr_payment_terms, function (elem) {
=======
                                    angular.forEach($scope.arr_payment_terms, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                        if (elem.id == ress.data.id)
                                            drp.payment_terms_ids = elem;
                                    });
                                }
                            });
                    }
                });
<<<<<<< HEAD
        }, function (reason) {
=======
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

<<<<<<< HEAD
    $scope.addNewPaymentTerm = function (drpdown, type, title, drp) {
=======
    $scope.addNewPaymentTerm = function(drpdown, type, title, drp) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var id = drpdown.id;
        if (id > 0)
            return false;

        $scope.popup_title = title;
        $scope.pedefined = {};

        ngDialog.openConfirm({
            template: 'app/views/payment_terms/add_payment_term.html',
            className: 'ngdialog-theme-default',
            scope: $scope
<<<<<<< HEAD
        }).then(function (pedefined) {
=======
        }).then(function(pedefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            /*console.log(pedefined);
             return false;*/

            pedefined.token = $scope.$root.token;
            //var postUrl = $scope.$root.setup+"crm/add-payment-term";
            var postUrl = $scope.$root.setup + "srm/srm-add-payment-term";
            $http
                .post(postUrl, pedefined)
<<<<<<< HEAD
                .then(function (ress) {
=======
                .then(function(ress) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (ress.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        var constUrl = $scope.$root.setup + "srm/srm-get-srm-payment-terms-list";
                        $http
                            .post(constUrl, { 'token': $scope.$root.token, 'all': 1 })
<<<<<<< HEAD
                            .then(function (res) {
                                $scope.arr_payment_terms = res.data.response;
                                $scope.arr_payment_terms.push({ 'id': '-1', 'name': '++ Add New ++' });

                                angular.forEach($scope.arr_payment_terms, function (elem) {
=======
                            .then(function(res) {
                                $scope.arr_payment_terms = res.data.response;
                                $scope.arr_payment_terms.push({ 'id': '-1', 'name': '++ Add New ++' });

                                angular.forEach($scope.arr_payment_terms, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    if (elem.id == ress.data.id)
                                        drp.payment_terms_ids = elem;
                                });
                            });
<<<<<<< HEAD
                    }
                    else
                        toaster.pop('error', 'Info', ress.data.error);
                });
        }, function (reason) {
=======
                    } else
                        toaster.pop('error', 'Info', ress.data.error);
                });
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

<<<<<<< HEAD
    $scope.addNewPaymentMethod = function (drpdown, type, title, drp) {
=======
    $scope.addNewPaymentMethod = function(drpdown, type, title, drp) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var id = drpdown.id;
        if (id > 0)
            return false;

        $scope.popup_title = title;
        $scope.pedefined = {};

        ngDialog.openConfirm({
            template: 'app/views/payment_methods/add_payment_method.html',
            className: 'ngdialog-theme-default',
            scope: $scope
<<<<<<< HEAD
        }).then(function (pedefined) {
=======
        }).then(function(pedefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            /*console.log(pedefined);
             return false;*/

            pedefined.token = $scope.$root.token;
            //var postUrl = $scope.$root.setup+"crm/add-payment-method";
            var postUrl = $scope.$root.setup + "srm/srm-add-payment-method";
            $http
                .post(postUrl, pedefined)
<<<<<<< HEAD
                .then(function (ress) {
=======
                .then(function(ress) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (ress.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                        //var constUrl = $scope.$root.setup+"crm/payment-methods";
                        var constUrl = $scope.$root.setup + "srm/srm-payment-methods";
                        $http
                            .post(constUrl, { 'token': $scope.$root.token, 'all': 1 })
<<<<<<< HEAD
                            .then(function (res) {
                                $scope.paymentmet = res.data.response;
                                $scope.paymentmet.push({ 'id': '-1', 'name': '++ Add New ++' });

                                angular.forEach($scope.paymentmet, function (elem) {
=======
                            .then(function(res) {
                                $scope.paymentmet = res.data.response;
                                $scope.paymentmet.push({ 'id': '-1', 'name': '++ Add New ++' });

                                angular.forEach($scope.paymentmet, function(elem) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                    if (elem.id == ress.data.id)
                                        drp.payment_method_ids = elem;
                                });
                            });
<<<<<<< HEAD
                    }
                    else
                        toaster.pop('error', 'Info', ress.data.error);
                });
        }, function (reason) {
=======
                    } else
                        toaster.pop('error', 'Info', ress.data.error);
                });
        }, function(reason) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    //---------------------   finance   ------------------------------------------
    //---------------------  price   ------------------------------------------

    //dynamic datepicker
<<<<<<< HEAD
    $scope.openDatePicker = function ($event, item) {
=======
    $scope.openDatePicker = function($event, item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $event.preventDefault();
        $event.stopPropagation();

        if (item.opened_start) {
            item.opened_start = !item.opened_start;
        } else {
            item.opened_start = true;
        }
    };

<<<<<<< HEAD
    $scope.openDatePicker_end = function ($event, item) {
=======
    $scope.openDatePicker_end = function($event, item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $event.preventDefault();
        $event.stopPropagation();


        if (item.opened_end) {
            item.opened_end = !item.opened_end;
        } else {
            item.opened_end = true;
        }
    };

<<<<<<< HEAD
    $scope.get_sale_price = function (type) {
=======
    $scope.get_sale_price = function(type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        // $scope.$root.breadcrumbs[3].name = 'Item Price';

        $scope.showLoader = true;
        if (type == 1) {
            $scope.price_sale_user = "Customer(s)";
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.price_sale_user = "Supplier(s)";
        }

        $scope.type = type;
        $scope.show_price_sale_form = false;
        $scope.show_price_sale_list = true;

        var postData = "";

        postData = {
            'token': $scope.$root.token,
            'product_id': $scope.product_id,
            'supplier_id': $stateParams.id,
            'type': type
        };

        $http
            .post(prodApi_setup, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.sale_records = [];
                    $scope.sale_columns = [];
                    $scope.total = 0;
                    //$scope.sale_records = res.data.response;
                    $scope.total = res.data.total;

<<<<<<< HEAD
                    angular.forEach(res.data.response[0], function (val, index) {
=======
                    angular.forEach(res.data.response[0], function(val, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.sale_columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

<<<<<<< HEAD
                    angular.forEach(res.data.response, function (obj_rec) {
=======
                    angular.forEach(res.data.response, function(obj_rec) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        obj_rec.id = $stateParams.id;
                        obj_rec.code = $scope.rec.customer_no; //obj_rec.code;
                        obj_rec.name = $scope.rec.name;

                        obj_rec.r_id = obj_rec.id;
                        obj_rec.purchase_measure = obj_rec.purchase_measure;
                        obj_rec.unit_price = obj_rec.unit_price;
                        obj_rec.r_id = obj_rec.r_id;

                        if (obj_rec.start_date == 0)
                            obj_rec.start_date = null;
                        else
                            obj_rec.start_date = $scope.$root.convert_unix_date_to_angular(obj_rec.start_date);

                        if (obj_rec.end_date == 0)
                            obj_rec.end_date = null;
                        else
                            obj_rec.end_date = $scope.$root.convert_unix_date_to_angular(obj_rec.end_date);

<<<<<<< HEAD
                        angular.forEach($scope.list_unit_category, function (obj) {
=======
                        angular.forEach($scope.list_unit_category, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                            if (obj.id == obj_rec.purchase_measure)
                                obj_rec.purchase_measure = obj;
                        });

                        $scope.sale_records.push(obj_rec);
                    });

                    $scope.showLoader = false;
<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.sale_records = {};
                    $scope.sale_columns = [];
                    $scope.showLoader = false;
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });
    };

<<<<<<< HEAD
    $scope.add_sale_price_customer = function (type, sale_records) {
=======
    $scope.add_sale_price_customer = function(type, sale_records) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var rec = {};
        rec.token = $scope.$root.token;
        rec.id = 0;
        rec.product_id = $scope.product_id;
        rec.type = type;
        rec.data = $scope.sale_records;


        var updateUrl = $scope.$root.stock + "products-listing/add_sale";

        $http
            .post(updateUrl, rec)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                } else {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                }
            });
    };


    //---------------------  price   ------------------------------------------


    //Balance Reciept Account start
    $scope.balance_entry_type = 'Supplier';
    $scope.module_type_account = 3;

    angular.element('.blance_payment').removeClass('dont-click');

    if ($stateParams.tab != undefined && $stateParams.tab == 'blance_payment')
        angular.element('.blance_payment a').click();


    $scope.isSalePerersonChanged = false;
    $scope.ReciptInvoiceModalarr = [];
    $scope.ReciptInvoiceModalSelectarr = [];
    $scope.final_amount = 0;
    $scope.doc_type = 0;
    $scope.item_detail = {};
    $scope.Recipt_payed = [];
    $scope.cust_id = 0;
    $scope.title_payed = '';
    $scope.invoice_sub = {};
    $scope.receipt_sub_list = {};

    $scope.searchKeyword = {};

<<<<<<< HEAD
    $scope.get_balance_info = function (id, item_paging) {
=======
    $scope.get_balance_info = function(id, item_paging) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        //console.log($scope.drp.currency.code);
        if (id == undefined) {
            id = $scope.rec.id;
        }
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        if (item_paging == 1)
            $scope.item_paging.spage = 1;
        $scope.postData.page = $rootScope.item_paging.spage;

        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        //$scope.postData.searchKeyword = $scope.searchKeyword.$;
        // if(  $scope.searchKeyword.brand !== undefined && $scope.searchKeyword.brand!==  null)$scope.postData.deprtments = $scope.searchKeyword.deprtment !== undefined ? $scope.searchKeyword.deprtment.id : 0;
        // $scope.postData.cust_id = id;
        $scope.postData.cust_id = $stateParams.id;
        $scope.postData.module_type = $scope.module_type_account;
        $scope.postData.defaultCurrency = $scope.$root.defaultCurrency;
        $scope.postData.supplierCurrencyID = $scope.drp.currency.id;

        $scope.postData.external_module = 1;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            // $scope.searchKeyword = {};
            // $scope.record_data = {};
        }

        if (!$scope.searchKeyword.totalRecords)
            $scope.searchKeyword.totalRecords = 50;

        $scope.postData.searchKeyword = $scope.searchKeyword;
        $scope.cust_id = id;
        var getUrl = $scope.$root.gl + "chart-accounts/get-jl-journal-receipt-payment-supplier";
        $scope.showLoader = true;
        $http
            .post(getUrl, $scope.postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.receipt_sub_list = [];
                if (res.data.ack == true) {
                    $scope.supplierActivitytableData = res;

<<<<<<< HEAD
                    angular.forEach(res.data.response, function (obj, index) {
=======
                    angular.forEach(res.data.response, function(obj, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        obj.on_hold = obj.on_hold == 1 ? true : false
                    });
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;

                    $scope.total_paging_record = res.data.total_paging_record;

                    $scope.supplier_balance = res.data.supplier_balance;
                    $scope.balanceInSupplierCurrency = res.data.balanceInSupplierCurrency;

                    $scope.curency_code = $scope.drp.currency.code;
                    $scope.supplierCurrencyCode = $scope.drp.currency.code;

                    $scope.receipt_sub_list = res.data.response;
<<<<<<< HEAD
                    angular.forEach($scope.supplierActivitytableData.data.response.tbl_meta_data.response.colMeta, function (obj, index) {
=======
                    angular.forEach($scope.supplierActivitytableData.data.response.tbl_meta_data.response.colMeta, function(obj, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        if (obj.event && obj.event.name && obj.event.trigger) {
                            obj.generatedEvent = $scope[obj.event.name];
                        }
                    });
                    //$scope.receipt_sub_list.push({'id':'' ,currency_id:$scope.array_submit_jurnal.currency_id });
                    $scope.showLoader = false;
<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.showLoader = false;
                    // toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
                }
            });

        $('#ReciptInvoiceModal').modal('hide');
        // $scope.getinvoice_all(id, item_paging);

    }
    $scope.$root.itemselectPage(1);
    $scope.cust_id = 0;
<<<<<<< HEAD
    $scope.getinvoice_all = function (id, item_paging) {

        $scope.postData_cust = {};
        $scope.postData_cust.sell_to_cust_id = id;//item.account_id;
=======
    $scope.getinvoice_all = function(id, item_paging) {

        $scope.postData_cust = {};
        $scope.postData_cust.sell_to_cust_id = id; //item.account_id;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.postData_cust.token = $scope.$root.token;
        $scope.postData_cust.more_fields = 1;

        if ($scope.module_type_account == 2)
            var postUrl = $scope.$root.sales + "customer/order/listings";

        if ($scope.module_type_account == 3)
            var postUrl = $scope.$root.pr + "srm/srminvoice/listings";

        $scope.postData_cust.parent_id = $scope.parent_id;
<<<<<<< HEAD
        $scope.postData_cust.cust_id = id;//item.account_id;
=======
        $scope.postData_cust.cust_id = id; //item.account_id;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.postData_cust.doc_type = 1;
        //	$scope.postData.parent_id=80;
        $scope.postData_cust.type = 2;
        //	$scope.postData.blance=1;


        if (item_paging == 1)
            $scope.item_paging.spage = 1;
        $scope.postData_cust.page = $scope.item_paging.spage;

        $scope.postData_cust.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        //$scope.postData.searchKeyword = $scope.searchKeyword.$;
        // $scope.postData.deprtments = $scope.searchKeyword.deprtment !== undefined ? $scope.searchKeyword.deprtment.id : 0;


        if ($scope.postData_cust.pagination_limits == -1) {
            $scope.postData_cust.page = -1;
            // $scope.searchKeyword = {};
            // $scope.record_data = {};
        }


        $http
            .post(postUrl, $scope.postData_cust)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {

                    $scope.invoice_sub = res.data.response;

                }
                //  else    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });
    }

    $scope.final_amount = 0;
<<<<<<< HEAD
    $scope.getInvoiceList = function (arry, id, index, p_id) {
=======
    $scope.getInvoiceList = function(arry, id, index, p_id) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.cust_id = id;
        $scope.final_amount = arry.final_amount;
        $scope.cnv_rate = arry.cnv_rate;
        $scope.current_currency_id = {};

        console.log($scope.final_amount);

        $scope.select_curency_id = arry.currency_id;
        $scope.doc_type_main = 1;
        $scope.module_type = {};
        $scope.module_type.value = arry.module_type;
        $scope.posting_groupmain = arry.posting_group_id;
        $scope.balance_id_main = arry.balance_id;

<<<<<<< HEAD
        $scope.parent_account_id = arry.parent_id;
        ;
=======
        $scope.parent_account_id = arry.parent_id;;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $scope.columns = [];
        $scope.ReciptInvoiceModalarr = [];
        //$scope.title = 'Balance Payment';
        $scope.doc_type = 1;
        $scope.curent_cust_index = index;

        if (id === undefined) {
<<<<<<< HEAD
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(231, ['Account Type','Supplier']));
            return;
        }
        else {
=======
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(231, ['Account Type', 'Supplier']));
            return;
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            $scope.postData = {};


<<<<<<< HEAD
            $scope.postData.sell_to_cust_id = id;//item.account_id;
=======
            $scope.postData.sell_to_cust_id = id; //item.account_id;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.postData.token = $scope.$root.token;
            $scope.postData.more_fields = 1;

            if ($scope.module_type_account == 2) {
<<<<<<< HEAD
                $scope.postData.title_invoice = 'Customer Payment';//('+item.account_code+')'; 
                var postUrl = $scope.$root.sales + "customer/order/listings";
            }
            if ($scope.module_type_account == 3) {
                $scope.postData.title_invoice = 'Supplier Payment';//('+item.account_code+')'; 
                var postUrl = $scope.$root.pr + "srm/srminvoice/listings";
            }
            $scope.postData.parent_id = $scope.parent_id;
            $scope.postData.cust_id = id;//item.account_id;
=======
                $scope.postData.title_invoice = 'Customer Payment'; //('+item.account_code+')'; 
                var postUrl = $scope.$root.sales + "customer/order/listings";
            }
            if ($scope.module_type_account == 3) {
                $scope.postData.title_invoice = 'Supplier Payment'; //('+item.account_code+')'; 
                var postUrl = $scope.$root.pr + "srm/srminvoice/listings";
            }
            $scope.postData.parent_id = $scope.parent_id;
            $scope.postData.cust_id = id; //item.account_id;
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

            $scope.postData.doc_type = 1;
            //	$scope.postData.parent_id=80;
            $scope.postData.type = 2;
            //	$scope.postData.blance=1;


            $http
                .post(postUrl, $scope.postData)
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        //	$scope.balance_payed = res.data.balance_payed; 

                        $scope.total = res.data.total;
                        $scope.item_paging.total_pages = res.data.total_pages;
                        $scope.item_paging.cpage = res.data.cpage;
                        $scope.item_paging.ppage = res.data.ppage;
                        $scope.item_paging.npage = res.data.npage;

                        $scope.item_paging.pages = res.data.pages;
                        $scope.total_paging_record = res.data.total_paging_record;

                        $scope.ReciptInvoiceModalarr = res.data.response;

                        angular.element('#ReciptInvoiceModal').modal({ show: true });

<<<<<<< HEAD
                    }
                    else
=======
                    } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                });
        }

    }
    $scope.postfianancedata = {};
<<<<<<< HEAD
    $scope.ValidateAllocationDate = function (record) {
=======
    $scope.ValidateAllocationDate = function(record) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var date_parts = record.allocation_date.trim().split('/');
        var doc_to_alloc_date_parts = record.invoice_date.trim().split('/');
        var doc_from_alloc_date_parts = $scope.posting_date.trim().split('/');

        var alloc_date = new Date(date_parts[2], date_parts[1] - 1, date_parts[0]);
        var doc_to_alloc_date = new Date(doc_to_alloc_date_parts[2], doc_to_alloc_date_parts[1] - 1, doc_to_alloc_date_parts[0]);
        var doc_from_alloc_date = new Date(doc_from_alloc_date_parts[2], doc_from_alloc_date_parts[1] - 1, doc_from_alloc_date_parts[0]);

        if (doc_from_alloc_date >= doc_to_alloc_date && alloc_date < doc_from_alloc_date) {
            toaster.pop('error', 'Error', 'Allocation date cannot be earlier than ' + $scope.posting_date);
            record.allocation_date = $scope.posting_date;
<<<<<<< HEAD
        }
        else if (doc_to_alloc_date >= doc_from_alloc_date && alloc_date < doc_to_alloc_date) {
=======
        } else if (doc_to_alloc_date >= doc_from_alloc_date && alloc_date < doc_to_alloc_date) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            toaster.pop('error', 'Error', 'Allocation date cannot be earlier than ' + record.invoice_date);
            record.allocation_date = record.invoice_date;
        }
    }

    $scope.amount_total = 0;
    $scope.allocated_amount = 0;
<<<<<<< HEAD
    $scope.getPaymentEntries = function (record, type, index) {
=======
    $scope.getPaymentEntries = function(record, type, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        if (record.docType == 'Purchase Invoice')
            type = 3;
        if (record.docType == 'Debit Note')
            type = 4;
        if (record.docType == 'Supplier Payment')
            type = 5;
        if (record.docType == 'Supplier Refund')
            type = 6;

        if (record.docType == 'General Journal') {
            if (record.debitAmount > 0) {
                type = 5;
            }
            if (record.creditAmount > 0) {
                type = 6;
            }
        }
        if (record.docType == 'Opening Balance Invoice')
            type = 9;
        if (record.docType == 'Opening Balance Debit Note')
            type = 10;
        if (record.docType == 'Bank Opening Balance Payment')
            type = 13;
        if (record.docType == 'Bank Opening Balance Refund')
            type = 14;
        if (record.on_hold) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(349));
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.disable_save = false;
            var id = record.order_id;
            var detail_id = record.detail_id;
            var amount = Math.abs(record.remaining_amount);
            $scope.moduleName = 'supplier';


            var postData = {};

            $scope.entry_type = type;
            // 3=> Purchase invoice 4=> Debit note, 5=>Payment, 6=> Refund, 7=> Customer opening balance invoice, 8=> Customer opening balance Credit Note, 
            // 9=> Supplier opening balance invoice, 10=> Supplier opening balance Debit Note, 11=> Customer Opening balance Payment (bank),
            // 12=> Customer Opening balance Refund (bank), 13=> Supplier Opening balance Payment (bank), 14=> Supplier Opening balance Refund (bank) 

            $scope.amount_total = Number(amount);
            $scope.module_type = {};
            if ($scope.entry_type == 3 || $scope.entry_type == 6 || $scope.entry_type == 9 || $scope.entry_type == 14) {
                $scope.module_type.value = 3;
                $scope.doc_type = 1; // purchase invoice
                $scope.postData.title = 'Allocation of ' + record.docType + ' (' + record.invoice_code + ')';
                var postUrl = $scope.$root.pr + "srm/srminvoice/invoice-for-payment-listings";

<<<<<<< HEAD
            }
            else if ($scope.entry_type == 4 || $scope.entry_type == 5 || $scope.entry_type == 10 || $scope.entry_type == 13) {
=======
            } else if ($scope.entry_type == 4 || $scope.entry_type == 5 || $scope.entry_type == 10 || $scope.entry_type == 13) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.module_type.value = 3;
                $scope.doc_type = 2; // Debite note
                var doc_type = '';
                if (record.docType == 'Opening Balance Debit Note') {
                    doc_type = 'Opening Balance Debit Note';
<<<<<<< HEAD
                }
                else {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    doc_type = record.docType;
                }
                $scope.postData.title = 'Allocation of  ' + doc_type + ' (' + record.invoice_code + ')';
                var postUrl = $scope.$root.pr + "srm/srminvoice/invoice-for-refund-listings";
            }

            if ($scope.entry_type == 3 || $scope.entry_type == 4 || $scope.entry_type == 9 || $scope.entry_type == 10 || $scope.entry_type == 13 || $scope.entry_type == 14) {
                $scope.invoice_id = id;

                $scope.payment_id = 0;
                $scope.payment_detail_id = 0;
                postData.parent_id = 0;

<<<<<<< HEAD
            }
            else if ($scope.entry_type == 5 || $scope.entry_type == 6) {
=======
            } else if ($scope.entry_type == 5 || $scope.entry_type == 6) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                $scope.payment_id = id;
                $scope.payment_detail_id = detail_id;
                postData.parent_id = id;

                $scope.invoice_id = 0;
            }
            $scope.current_payment_index = index;
            $scope.posting_date = record.posting_date;
            $scope.from_entry_currency_rate = record.currency_rate;

            postData.token = $scope.$root.token;
            postData.account_id = $scope.$root.srm_id;
            postData.currency_id = record.currency_id;
            postData.posting_date = $scope.posting_date;

            $scope.showLoader = true;
            $http
                .post(postUrl, postData)
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        $scope.total = res.data.total;
                        $scope.item_paging.total_pages = res.data.total_pages;
                        $scope.item_paging.cpage = res.data.cpage;
                        $scope.item_paging.ppage = res.data.ppage;
                        $scope.item_paging.npage = res.data.npage;
                        $scope.item_paging.pages = res.data.pages;
                        $scope.total_paging_record = res.data.total_paging_record;
                        $scope.ReciptInvoiceModalarr = res.data.response;
                        $scope.showLoader = false;
                        $scope.currency_arr = $scope.$root.get_obj_frm_arry($rootScope.arr_currency, record.currency_id);
                        $scope.currency_code = $scope.currency_arr.code;
                        angular.element('#InvoicesForPayments').modal({ show: true });
<<<<<<< HEAD
                    }
                    else
                    {
=======
                    } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.showLoader = false;
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                    }
                });
        }
    }
<<<<<<< HEAD
    $scope.openDocumentLink = function (record) {
=======
    $scope.openDocumentLink = function(record) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        var url;
        if (record.docType == 'Purchase Invoice') {
            url = $state.href("app.viewsrminvoice", ({ id: record.order_id }));
<<<<<<< HEAD
        }
        else if (record.docType == 'Debit Note') {
            url = $state.href("app.viewsrmorderreturn", ({ id: record.order_id, isInvoice: 1 }));
        }
        else if (record.docType == 'Supplier Payment') {
            url = $state.href("app.view-receipt-journal-gl-supp", ({ id: record.order_id }));
        }
        else if (record.docType == 'Supplier Refund') {
            url = $state.href("app.view-receipt-journal-gl-supp", ({ id: record.order_id }));
        }
        else if (record.docType == 'General Journal') {
            url = $state.href("app.view-receipt-journal-gl", ({ id: record.order_id }));
        }
        else if (record.docType == 'Opening Balance Invoice') {
            url = $state.href("app.openingBalances", ({ module: 'supplier' }));
        }
        else if (record.docType == 'Opening Balance Debit Note') {
            url = $state.href("app.openingBalances", ({ module: 'supplier' }));
        }
        else if (record.docType == 'Bank Opening Balance Payment') {
            url = $state.href("app.openingBalances", ({ module: 'bank' }));
        }
        else if (record.docType == 'Bank Opening Balance Refund') {
=======
        } else if (record.docType == 'Debit Note') {
            url = $state.href("app.viewsrmorderreturn", ({ id: record.order_id, isInvoice: 1 }));
        } else if (record.docType == 'Supplier Payment') {
            url = $state.href("app.view-receipt-journal-gl-supp", ({ id: record.order_id }));
        } else if (record.docType == 'Supplier Refund') {
            url = $state.href("app.view-receipt-journal-gl-supp", ({ id: record.order_id }));
        } else if (record.docType == 'General Journal') {
            url = $state.href("app.view-receipt-journal-gl", ({ id: record.order_id }));
        } else if (record.docType == 'Opening Balance Invoice') {
            url = $state.href("app.openingBalances", ({ module: 'supplier' }));
        } else if (record.docType == 'Opening Balance Debit Note') {
            url = $state.href("app.openingBalances", ({ module: 'supplier' }));
        } else if (record.docType == 'Bank Opening Balance Payment') {
            url = $state.href("app.openingBalances", ({ module: 'bank' }));
        } else if (record.docType == 'Bank Opening Balance Refund') {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            url = $state.href("app.openingBalances", ({ module: 'bank' }));
        }
        window.open(url, '_blank');

    }
<<<<<<< HEAD
    $scope.getPaidEntries = function (record, type, index) {
=======
    $scope.getPaidEntries = function(record, type, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        if (record.docType == 'Purchase Invoice')
            type = 3;
        if (record.docType == 'Debit Note')
            type = 4;
        if (record.docType == 'Supplier Payment')
            type = 5;
        if (record.docType == 'Supplier Refund')
            type = 6;
        if (record.docType == 'General Journal') {
            if (record.debitAmount > 0) {
                type = 5;
            }
            if (record.creditAmount > 0) {
                type = 6;
            }
        }
        if (record.docType == 'Opening Balance Invoice')
            type = 9;
        if (record.docType == 'Opening Balance Debit Note')
            type = 10;
        if (record.docType == 'Bank Opening Balance Payment')
            type = 13;
        if (record.docType == 'Bank Opening Balance Refund')
            type = 14;
        var id = record.order_id;
        var detail_id = record.detail_id;
        var amount = Math.abs(record.remaining_amount);
        $scope.moduleName = 'supplier';


        var postData = {};

        $scope.entry_type = type;
        // 1=> sales invoice 2=> credit note, 5=>Payment, 6=> Refund, 7=> Customer opening balance invoice, 8=> Customer opening balance Credit Note, 
        // 9=> Supplier opening balance invoice, 10=> Supplier opening balance Credit Note, 11=> Customer Opening balance Payment (bank),
        // 12=> Customer Opening balance Refund (bank), 13=> Supplier Opening balance Payment (bank), 14=> Supplier Opening balance Refund (bank) 

        $scope.amount_total = Number(amount);
        $scope.module_type = {};
        if ($scope.entry_type == 3 || $scope.entry_type == 6 || $scope.entry_type == 9 || $scope.entry_type == 14) {
            $scope.module_type.value = 3;
            $scope.doc_type = 1; // sale invoice
            $scope.postData.title = 'Allocation details for ' + record.docType + ' (' + record.invoice_code + ')';
            var postUrl = $scope.$root.pr + "srm/srminvoice/invoice-for-payment-listings-paid";

<<<<<<< HEAD
        }
        else if ($scope.entry_type == 4 || $scope.entry_type == 5 || $scope.entry_type == 10 || $scope.entry_type == 13) {
=======
        } else if ($scope.entry_type == 4 || $scope.entry_type == 5 || $scope.entry_type == 10 || $scope.entry_type == 13) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.module_type.value = 3;
            $scope.doc_type = 2; // credit note
            var doc_type = '';
            if (record.docType == 'Opening Balance Debit Note') {
                doc_type = 'Opening Balance Debit Note';
<<<<<<< HEAD
            }
            else {
=======
            } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                doc_type = record.docType;
            }
            $scope.postData.title = 'Allocation details for  ' + doc_type + ' (' + record.invoice_code + ')';
            var postUrl = $scope.$root.pr + "srm/srminvoice/invoice-for-refund-listings-paid";
        }

        if ($scope.entry_type == 3 || $scope.entry_type == 4 || $scope.entry_type == 9 || $scope.entry_type == 10 || $scope.entry_type == 13 || $scope.entry_type == 14) {
            $scope.invoice_id = id;

            $scope.payment_id = 0;
            $scope.payment_detail_id = 0;
            postData.parent_id = 0;

<<<<<<< HEAD
        }
        else if ($scope.entry_type == 5 || $scope.entry_type == 6) {
=======
        } else if ($scope.entry_type == 5 || $scope.entry_type == 6) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.payment_id = id;
            $scope.payment_detail_id = detail_id;
            postData.parent_id = id;

            $scope.invoice_id = 0;
        }
        $scope.current_payment_index = index;
        postData.token = $scope.$root.token;
        postData.account_id = $scope.$root.srm_id;
        postData.invoice_id = id;
        postData.detail_id = detail_id;
        postData.invoice_type = $scope.entry_type;

        $scope.total_amount = 0;
        $scope.total_setteled = 0;
        $scope.currency_code = '';

        $scope.showLoader = true;
        $http
            .post(postUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.total_paging_record = res.data.total_paging_record;
                    $scope.ReciptInvoiceModalarrPaid = res.data.response;

                    // $scope.total_amount = Number(record.grand_total);
                    $scope.total_amount = Math.abs(Number(record.grand_total));
                    $scope.currency_code = record.currency_code;

                    $scope.total_setteled = 0;
<<<<<<< HEAD
                    angular.forEach($scope.ReciptInvoiceModalarrPaid, function (obj) {
=======
                    angular.forEach($scope.ReciptInvoiceModalarrPaid, function(obj) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                        $scope.total_setteled += Number(obj.paid_amount);
                    });
                    $scope.showLoader = false;
                    angular.element('#InvoicesForAllocatedPayments').modal({ show: true });
<<<<<<< HEAD
                }
                else
                {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.showLoader = false;
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });
    }

<<<<<<< HEAD
    $scope.netTotal = function () {
        var ctotal = 0;
        angular.forEach($scope.ReciptInvoiceModalarr, function (item) {
=======
    $scope.netTotal = function() {
        var ctotal = 0;
        angular.forEach($scope.ReciptInvoiceModalarr, function(item) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if (item.amount >= 0)
                ctotal += Number(item.amount);
            // ctotal += Number(item.paid_amount);
        });
        $scope.amount_left = Number(Number($scope.amount_total.toFixed(2)) - Number(ctotal.toFixed(2)) - Number($scope.allocated_amount).toFixed(2)).toFixed(2);
        return $scope.amount_left;
    }

<<<<<<< HEAD
    $scope.setremainingamount = function (item, param) {
=======
    $scope.setremainingamount = function(item, param) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var amount2 = 0;

        if (item.is_infull == true) {
            if ((item.grand_total - item.paid_amount) == 0)
                item.amount = item.grand_total;
            else if (item.grand_total - item.paid_amount > 0)
                item.amount = (item.grand_total - item.paid_amount);

            if ($scope.amount_left < item.amount)
                item.amount = Number($scope.amount_left);

<<<<<<< HEAD
        }
        else if (item.amount != undefined) {
=======
        } else if (item.amount != undefined) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            if ((item.grand_total - item.paid_amount) == 0)
                item.amount = 0;
            else if (item.grand_total - item.paid_amount > 0)
                amount2 = (item.grand_total - item.paid_amount);

            if (item.amount > Number(amount2))
                item.amount = Number(amount2);

        }

        if (param != undefined && param == 1) {
            if (item.is_infull == false)
                item.amount = '';

        }

<<<<<<< HEAD
        if(Number(item.amount) > 0)
        {
=======
        if (Number(item.amount) > 0) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            item.amount = item.amount.toFixed(2);
            item.amount = Number(item.amount);
        }
    }


<<<<<<< HEAD
    $scope.AddPaymentAllocation = function (module_type, doc_type) {
=======
    $scope.AddPaymentAllocation = function(module_type, doc_type) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.disable_save = true;
        var postData = {};
        postData.token = $scope.$root.token;
        postData.transaction_type = 1;
        postData.payment_id = $scope.payment_id;
        postData.invoice_id = $scope.invoice_id;
        postData.payment_detail_id = $scope.payment_detail_id;
        postData.IsFinalPayment = 1;
        postData.module_type = 2; //supplier
        postData.entry_type = $scope.entry_type;
        postData.posting_date = $scope.posting_date;
        postData.from_entry_currency_rate = $scope.from_entry_currency_rate;

<<<<<<< HEAD
        if (doc_type == 1)// purchase invoice
        {
            postData.document_type = 1;
            postData.transaction_type = 1;
        }
        else if (doc_type == 2)// debit invoice
=======
        if (doc_type == 1) // purchase invoice
        {
            postData.document_type = 1;
            postData.transaction_type = 1;
        } else if (doc_type == 2) // debit invoice
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        {
            postData.document_type = 2;
            postData.transaction_type = 2;
        }

        var selected_items = [];
        var negative_amount_check = 0;
<<<<<<< HEAD
        angular.forEach($scope.ReciptInvoiceModalarr, function (obj) {
            if (obj.amount < 0) {
                negative_amount_check = 1;
            }
            else if (obj.amount != undefined && Number(obj.amount) > 0) {
=======
        angular.forEach($scope.ReciptInvoiceModalarr, function(obj) {
            if (obj.amount < 0) {
                negative_amount_check = 1;
            } else if (obj.amount != undefined && Number(obj.amount) > 0) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                var invoice_type = 0;
                if (obj.payment_type == "Purchase Invoice")
                    invoice_type = 3;
                else if (obj.payment_type == "Debit Note")
                    invoice_type = 4;
                else if (obj.payment_type == "Payment")
                    invoice_type = 5;
                else if (obj.payment_type == "Refund")
                    invoice_type = 6;
                else if (obj.payment_type == "Opening Balance Invoice")
                    invoice_type = 9;
                else if (obj.payment_type == "Opening Balance Debit Note")
                    invoice_type = 10;
                else if (obj.payment_type == "Bank Opening Balance Payment")
                    invoice_type = 13;
                else if (obj.payment_type == "Bank Opening Balance Refund")
                    invoice_type = 14;

                selected_items.push({
                    'invoice_id': obj.order_id,
                    'amount_allocated': obj.amount,
                    'invoice_type': invoice_type,
                    'cust_payment_id': obj.cust_payment_id,
                    'currency_id': obj.currency_id,
                    'currency_rate': obj.currency_rate,
                    'converted_currency_id': obj.converted_currency_id,
                    'posting_date': obj.invoice_date,
                    'allocation_date': obj.allocation_date
                });
            }
        });

        if (negative_amount_check > 0) {
<<<<<<< HEAD
            toaster.pop('error', 'Error',$scope.$root.getErrorMessageByCode(360, ['All the allocated amounts ', '0']));
=======
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(360, ['All the allocated amounts ', '0']));
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            return;
        }
        postData.items = selected_items;
        var allocation_url = $scope.$root.gl + "chart-accounts/add-payment-allocation-supplier";

        $http
            .post(allocation_url, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    angular.element('#InvoicesForPayments').modal('hide');
                    $scope.get_balance_info($scope.$root.crm_id);
                    // $scope.receipt_sub_list[$scope.current_payment_index].remaining_amount = Number($scope.receipt_sub_list[$scope.current_payment_index].remaining_amount)- Number(res.data.total_allocated);
<<<<<<< HEAD
                }
                else
                {
=======
                } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    $scope.disable_save = false;
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(105));
                    angular.element('#InvoicesForPayments').modal('hide');
                }

            });
    }


<<<<<<< HEAD
    $scope.edit_on_hold = function (rec, idx) {
=======
    $scope.edit_on_hold = function(rec, idx) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.on_hold_selected_data = {};

        $scope.on_hold_selected_data.id = rec.id;
        $scope.on_hold_selected_data.comments = rec.comments;
        $scope.on_hold_selected_data.index = idx;
    }

<<<<<<< HEAD
    $scope.submit_on_hold = function () {
=======
    $scope.submit_on_hold = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var updateUrl = $scope.$root.gl + "chart-accounts/add-comment-on-for-invoice-hold";
        // module_type = 1-> customer
        // module_type = 2-> supplier
        var postData = {
            'token': $scope.$root.token,
            'id': $scope.on_hold_selected_data.id,
            'comments': $scope.on_hold_selected_data.comments,
            'invoice_id': $scope.on_hold_invoice_id,
            'invoice_type': $scope.on_hold_invoice_type,
            'status': $scope.on_hold_selected_data.on_hold_invoice,
            'module_type': 2
        }
        $scope.showLoader = true;
        $http
            .post(updateUrl, postData)
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    if ($scope.on_hold_selected_data.id == undefined) {
                        $scope.showLoader = false;
                        toaster.pop('success', 'Success', 'Comment Added Successfully');
                        // $scope.receipt_sub_list[$scope.on_hold_invoice_index].on_hold = !$scope.on_hold_selected_data.on_hold_invoice;
                        $scope.receipt_sub_list[$scope.on_hold_invoice_index].on_hold = (Number($scope.on_hold_selected_data.on_hold_invoice) > 0 ? 0 : 1);
                        $scope.on_hold_selected_data.on_hold_invoice = ($scope.on_hold_selected_data.on_hold_invoice == 0) ? 1 : 0;
<<<<<<< HEAD
                    }
                    else
                    {
                        $scope.showLoader = false;
                        toaster.pop('success', 'Success', 'Comment Updated Successfully');
                    }
                        
=======
                    } else {
                        $scope.showLoader = false;
                        toaster.pop('success', 'Success', 'Comment Updated Successfully');
                    }

>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    // $scope.receipt_sub_list[$scope.on_hold_invoice_index].on_hold_message = $scope.on_hold_selected_data.comments;

                    $scope.on_hold_selected_data.id = undefined;
                    $scope.on_hold_selected_data.comments = '';

                    $scope.on_hold_data = '';
                    var updateUrl = $scope.$root.gl + "chart-accounts/get-on-hold-status";
                    $http
                        .post(updateUrl, { invoice_id: $scope.on_hold_invoice_id, invoice_type: $scope.on_hold_invoice_type, 'token': $scope.$root.token, 'status': 0, module_type: 2 })
<<<<<<< HEAD
                        .then(function (res) {
                            if (res.data.ack == true) {
                                $scope.on_hold_data = res.data.response;
                            }
                            else
=======
                        .then(function(res) {
                            if (res.data.ack == true) {
                                $scope.on_hold_data = res.data.response;
                            } else
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                                toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(400));

                        });
                    // angular.element('#on_hold_comment').modal('hide');
<<<<<<< HEAD
                }
                else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(106));
            });
    }
    $scope.CheckOnHold = function (record, index) {
=======
                } else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(106));
            });
    }
    $scope.CheckOnHold = function(record, index) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        var mainRecord = record;
        var record = mainRecord.record;
        var index = mainRecord.index;
        record.on_hold = record.on_hold ? 1 : 0;

        $scope.on_hold_selected_data = {};
        $scope.on_hold_invoice_id = 0;
        $scope.on_hold_invoice_index = mainRecord.index;
        $scope.on_hold_invoice_type = record.docType;
        $scope.on_hold_selected_data.on_hold_invoice = record.on_hold;

        if (record.docType == 'Supplier Payment' || record.docType == 'Supplier Refund' || record.docType == 'General Journal') {
            $scope.on_hold_invoice_id = record.detail_id;
<<<<<<< HEAD
        }
        else {
=======
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            $scope.on_hold_invoice_id = record.order_id;
        }
        $scope.on_hold_data = '';
        var updateUrl = $scope.$root.gl + "chart-accounts/get-on-hold-status";
        $http
            .post(updateUrl, { invoice_id: $scope.on_hold_invoice_id, invoice_type: $scope.on_hold_invoice_type, 'token': $scope.$root.token, 'status': 0, module_type: 2 })
<<<<<<< HEAD
            .then(function (res) {
=======
            .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                if (res.data.ack == true) {
                    $scope.on_hold_data = res.data.response;
                }
                // else
                //     toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(400));

            });

        angular.element('#on_hold_comment').modal({ show: true });

        /* if (!record.on_hold) {
            $rootScope.modalChangeOnHoldStatusMessage = "Are you sure to want to remove on hold from this entry?";
            ngDialog.openConfirm({
                template: 'modalChangeOnHoldStatus',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                var updateUrl = $scope.$root.gl + "chart-accounts/change-on-hold-status";
                // module_type = 1-> customer
                // module_type = 2-> supplier
                var id = 0;
                if (record.docType == 'Supplier Payment' || record.docType == 'Supplier Refund') {
                    id = record.detail_id;
                }
                else {
                    id = record.order_id;
                }
                $http
                    .post(updateUrl, { invoice_id: id, invoice_type: record.docType, 'token': $scope.$root.token, 'status': 0, module_type: 2 })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            record.on_hold = false;
                            record.on_hold_check = false;
                        }
                        else {
                            record.on_hold = true;
                            record.on_hold_check = true;
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(106));
                        }

                    });
            }, function (reason) {
                //console.log('Modal promise rejected. Reason: ', reason);
                record.on_hold = true;
                record.on_hold_check = true;
            });
        }
        else {
            $scope.on_hold_comment = {};

            $rootScope.modalChangeOnHoldStatusMessage = "Are you sure to want to make this entry on hold?";
            ngDialog.openConfirm({
                template: 'modalChangeOnHoldStatus',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {

                var updateUrl = $scope.$root.gl + "chart-accounts/change-on-hold-status";
                // module_type = 1-> customer
                // module_type = 2-> supplier
                var id = 0;
                if (record.docType == 'Supplier Payment' || record.docType == 'Supplier Refund') {
                    id = record.detail_id;
                }
                else {
                    id = record.order_id;
                }
                $http
                    .post(updateUrl, { invoice_id: id, invoice_type: record.docType, 'token': $scope.$root.token, 'status': 1, module_type: 2 })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            angular.element('#on_hold_comment').modal({ show: true });

                            record.on_hold = true;
                            record.on_hold_check = true;

                            $scope.on_hold_comment.invoice_id = id;
                            $scope.on_hold_comment.invoice_type = record.docType;
                            $scope.on_hold_comment.module_type = 2;
                            $scope.on_hold_comment.index = index;
                            $scope.on_hold_comment.token = $scope.$root.token;

                        }
                        else {
                            record.on_hold = false;
                            record.on_hold_check = false;
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(106));
                        }

                    });
            }, function (reason) {
                record.on_hold = false;
                record.on_hold_check = false;

                //console.log('Modal promise rejected. Reason: ', reason);
            });
        } */
    }
<<<<<<< HEAD
    $scope.clearOnHold = function () {
        $scope.on_hold_selected_data = {};
    }
    
    $scope.addOnHoldComment = function () {
=======
    $scope.clearOnHold = function() {
        $scope.on_hold_selected_data = {};
    }

    $scope.addOnHoldComment = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        if ($scope.on_hold_comment.comments != undefined && $scope.on_hold_comment.comments.length) {
            var updateUrl = $scope.$root.gl + "chart-accounts/add-comment-on-for-invoice-hold";
            // module_type = 1-> customer
            // module_type = 2-> supplier
            $scope.showLoader = true;
            $http
                .post(updateUrl, $scope.on_hold_comment)
<<<<<<< HEAD
                .then(function (res) {
=======
                .then(function(res) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
                    if (res.data.ack == true) {
                        $scope.showLoader = false;
                        toaster.pop('success', 'Success', 'Comment Added Successfully');
                        $scope.receipt_sub_list[$scope.on_hold_comment.index].on_hold_message = $scope.on_hold_comment.comments;
                        angular.element('#on_hold_comment').modal('hide');
<<<<<<< HEAD
                    }
                    else
                    {
                        $scope.showLoader = false;
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(106));
                    }
                        
                });
        }
        else {
=======
                    } else {
                        $scope.showLoader = false;
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(106));
                    }

                });
        } else {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(247, ['Comments']));
        }
    }

    $scope.current_currency_id = {};
    $scope.array_receipt_gl_form = {};
    $scope.array_receipt_gl_form.type = 1;
    //Balance Reciept Account Finish


    $scope.item_paging = {};
<<<<<<< HEAD
    $scope.itemselectPage = function (pageno) {
=======
    $scope.itemselectPage = function(pageno) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564
        $scope.item_paging.spage = pageno;

        /*for supplier item pagination settings */
        $rootScope.item_paging.spage = pageno;
        $rootScope.item_paging.pagination_limit = $rootScope.pagination_arry[0];
    };

    $scope.$root.set_document_internal($scope.$root.supplier_general_tab_module);


    $scope.row_id = $stateParams.id;
    $scope.module_id = $rootScope.supplier_module;
    $scope.subtype = 3;
    $scope.module = "Purchases & Supplier";
    $scope.module_name = "Supplier";
    $scope.account_id = $scope.$root.supplier_id;

    $scope.$root.$broadcast("image_module", $scope.row_id, $scope.module, $scope.module_id, $scope.module_name, $scope.module_code, $scope.subtype, $scope.$root.tab_id);


    /*-----------------------------------Email-----------------------------*/


    $scope.module_type = "2"; // supplier

    // $scope.$root.set_email_internal($scope.$root.supplier_general_tab_module);

<<<<<<< HEAD
    $scope.getAllEmails = function () {
=======
    $scope.getAllEmails = function() {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        var tabid = 0;
        $scope.$root.$broadcast("EmailReferenceList", $scope.account_id, $scope.row_id, $scope.module, $scope.module_id,
            $scope.module_name, $scope.module_code, $scope.subtype, tabid, $scope.module_type);

    }
<<<<<<< HEAD
    $scope.ComposeEmail = function (tabid) {
=======
    $scope.ComposeEmail = function(tabid) {
>>>>>>> e31237e9eb73244117d4370f0a4bd96ad1c30564

        $rootScope.set_email_internal(tabid, $scope.rec.name, $scope.module_name);

        $scope.$root.$broadcast("EmailReference", $scope.account_id, $scope.row_id, $scope.module, $scope.module_id,
            $scope.module_name, $scope.module_code, $scope.subtype, tabid, $scope.module_type);
    }

    /*-----------------------------------Email-----------------------------*/
}