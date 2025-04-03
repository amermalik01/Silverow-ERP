myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.opportunity-cycle-tabs', {
                url: '/opportunity-cycle-stages',
                title: 'Setup',
                templateUrl: helper.basepath('opp_cycle_tabs/opp_cycle_tabs.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog')
            })
            .state('app.add-opportunity-cycle-tabs', {
                url: '/opportunity-cycle-stages/add',
                title: 'Setup',
                templateUrl: helper.basepath('add.html'),
                controller: 'OppCycleTabsAddController'
            })
            .state('app.view-opportunity-cycle-tabs', {
                url: '/opportunity-cycle-stages/:id/view',
                title: 'Setup',
                templateUrl: helper.basepath('view.html'),
                resolve: helper.resolveFor('ngDialog'),
                controller: 'OppCycleTabsViewController'
            })
            .state('app.edit-opportunity-cycle-tabs', {
                url: '/opportunity-cycle-stages/:id/edit',
                title: 'Setup',
                templateUrl: helper.basepath('edit.html'),
                resolve: helper.resolveFor('ngDialog'),
                controller: 'OppCycleTabsEditController'
            })

    }]);

myApp.controller('OppCycleTabsController', OppCycleTabsController);
myApp.controller('OppCycleTabsAddController', OppCycleTabsAddController);
myApp.controller('OppCycleTabsViewController', OppCycleTabsViewController);
myApp.controller('OppCycleTabsEditController', OppCycleTabsEditController);

function OppCycleTabsController($state, $scope, $filter, $resource, $timeout, $http, ngDialog, toaster, $rootScope) {
    'use strict';

    $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
    { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
    { 'name': 'Opportunity Cycle Stages', 'url': '#', 'isActive': false }];

    var Api = $scope.$root.setup + "crm/opportunity-cycle-tabs";
    var postData = {
        'token': $scope.$root.token,
        'all': "1",
        'is_opp_cyle': 0
    };
    $scope.MainSaveBtn = false;

    $scope.showMainSaveBtn = function () {
        $scope.MainSaveBtn = true;
    }

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

    $scope.get_opp_listing = function () {

        $scope.data = {};
        $scope.columns = [];
        $scope.showLoader = true;
        $timeout(function () {
            $http
                .post(Api, postData)
                .then(function (res) {
                    //console.log(res.data.response);
                    $scope.active_counter = 0;

                    if (res.data.ack == 1) {
                        angular.forEach(res.data.response[0], function (val, index) {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        });

                        angular.forEach(res.data.response, function (val, index) {
                            if (val.status == "Active")
                                $scope.active_counter++;

                            //console.log(val.status);
                        });
                        $scope.data = res.data.response;
                    }
                    // console.log($scope.active_counter);
                });
            $scope.showLoader = false;
        }, 2000);
    }
    $scope.get_opp_listing();


    var move = function (origin, destination) {
        var temp = $scope.data[destination];
        $scope.data[destination] = $scope.data[origin];
        $scope.data[origin] = temp;

        var sortUrl = $scope.$root.setup + "crm/sort-opportunity-cycle-tabs";
        $http
            .post(sortUrl, { 'record': $scope.data, 'token': $scope.$root.token })
            .then(function (res) {
                $scope.get_opp_listing();
            });
    };

    $scope.moveUp = function (indx) {

        angular.forEach($scope.data, function (obj, index) {

            if (index == indx - 1) {
                if (obj.start_end == 1.1) {
                    toaster.pop('success', 'Info', 'Record Sorted Successfully');
                    move(indx, indx - 1);

                }
                else
                    toaster.pop('warning', 'Warning', 'This Stage is not allowed to move up. ');

                return;
            }

        });

    };

    $scope.moveDown = function (indx) {

        angular.forEach($scope.data, function (obj, index) {

            if (index == indx + 1) {
                if (obj.start_end == 1.1) {
                    toaster.pop('success', 'Info', 'Record Sorted Successfully');
                    move(indx, indx + 1);

                }
                else
                    toaster.pop('warning', 'Warning', 'This Stage is not allowed to move down. ');

                return;
            }

        });
    };

    $scope.delete = function (id, index, data) {

        var delUrl = $scope.$root.setup + "crm/delete-opportunity-cycle-tab";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: $scope.rec.id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        data.splice(index, 1);
                        $timeout(function () {
                            $state.go('app.opportunity-cycle-tabs');
                        }, 2000);
                    }
                    else
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(385));

                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    var general = {};
    $scope.addGeneralOppCycle = function (oct) {

        if (oct.opp_cycle_limit <= 0 || oct.opp_cycle_limit > 9) {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(386));
            return;
        }
        $scope.MainSaveBtn = false;
        /*if (angular.element('#oop_cycle_edit_role').is(':checked') == true)
            oct.oop_cycle_edit_role = 1;
        else
            oct.oop_cycle_edit_role = 0;*/

        if (angular.element('#oop_cycle_edit_role').is(':checked') == false)
            oct.oop_cycle_edit_role = 0;

        //console.log(oct.oop_cycle_edit_role);
        $rootScope.oop_cycle_edit_role = $scope.oct.oop_cycle_edit_role;
        $rootScope.$storage.setItem("oop_cycle_edit_role", $rootScope.oop_cycle_edit_role);

        /*console.log(oct.opp_cycle_limit);
         console.log($scope.active_counter);*/
        //console.log($scope.user_type);

        if (oct.opp_cycle_limit < $scope.active_counter) {
            toaster.pop('error', 'info', 'Please Inactive Record(s) first. ' + $scope.active_counter + ' Records are Active Now');
            return false;
        }


        if ($scope.$root.defaultCompany > 0 && oct.opp_cycle_limit > 0) {

            var addGenUrl = $scope.$root.setup + "general/update-company-opertunity-cycle";
            general.opp_cycle_limit = oct.opp_cycle_limit;
            general.oop_cycle_edit_role = oct.oop_cycle_edit_role;
            general.oppCycleFreqstartmonth = (oct.freqstartmonth != undefined && oct.freqstartmonth != '') ? oct.freqstartmonth.id : 0;

            general.id = $scope.$root.defaultCompany;
            general.token = $scope.$root.token;
        }

        $http
            .post(addGenUrl, general)
            .then(function (res) {
                if (res.data.ack == true) {

                    $rootScope.oop_cycle_edit_role = res.data.oop_cycle_edit_role;
                    $rootScope.oppCycleFreqstartmonth = general.oppCycleFreqstartmonth;

                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
                }
                else
                    toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(387));
            });
    }

    var getCompUrl = $scope.$root.setup + "general/get-company-opertunity";
    $scope.oct = {};
    var postData = {
        'token': $scope.$root.token,
        'id': $scope.$root.defaultCompany
    };
    $timeout(function () {
        $http
            .post(getCompUrl, postData)
            .then(function (res) {
                if (res.data.ack == 1) {
                    //console.log(res);
                    $scope.general = res.data.response;
                    $scope.oct.opp_cycle_limit = res.data.response.opp_cycle_limit;
                    $scope.oct.oop_cycle_edit_role = res.data.response.oop_cycle_edit_role;

                    // $scope.oct.oppCycleFreqstartmonth = res.data.response.oppCycleFreqstartmonth;

                    if (res.data.response.oppCycleFreqstartmonth > 0) {
                        angular.forEach($scope.startMonthArr, function (obj) {
                            if (obj.id == res.data.response.oppCycleFreqstartmonth) {
                                $scope.oct.freqstartmonth = obj;
                            }
                        });
                    }

                    $rootScope.oop_cycle_edit_role = $scope.oct.oop_cycle_edit_role;
                    $rootScope.$storage.setItem("oop_cycle_edit_role", $rootScope.oop_cycle_edit_role);
                }
            });
    }, 2000);
}

function OppCycleTabsAddController($scope, $stateParams, $http, $state, toaster, $timeout) {

    $scope.formTitle = 'Opportunity Cycle Tabs';
    $scope.btnCancelUrl = 'app.opportunity-cycle-tabs';
    $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
    { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
    { 'name': 'Opportunity Cycle Stage', 'url': 'app.opportunity-cycle-tabs', 'isActive': false }];
    // { 'name': 'Add', 'url': '#', 'isActive': false }];

    $scope.formUrl = function () {
        return "app/views/opp_cycle_tabs/_form.html";
    }

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


    /*var moduleUrl = $scope.$root.setup+"general/modules-codes";
     $http
     .post(moduleUrl, {'token':$scope.$root.token,'all':1})
     .then(function (res) {
     if(res.data.ack == true){
     $scope.arr_modules = res.data.response;
     }
     });*/
    $scope.rec = {};
    $scope.arr_percentage = {};
    $scope.arr_percentage = [{ 'label': 'Yes', 'value': 1 }, { 'label': 'No', 'value': 0 }];

    $scope.arr_status = {};
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];
    $scope.rec.tab_status = $scope.arr_status[0];

    $scope.arr_position = {};
    $scope.arr_position = [{ 'label': 'Start', 'value': 1 }, { 'label': 'Middle', 'value': 1.1 }, {
        'label': 'End',
        'value': 2
    }];


    $scope.is_defaults = 0;
    $scope.setDefault = function (value) {
        $scope.is_defaults = value;
    }

    var postUrl = $scope.$root.setup + "crm/add-opportunity-cycle-tab";
    $scope.add = function (rec) {

        if ($scope.rec.tab_status == undefined || $scope.rec.tab_status == ''){
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Status']));
            return false;
        }

        rec.statuss = $scope.rec.tab_status != undefined ? $scope.rec.tab_status.value : 1;
        //rec.module_id = $scope.rec.tab_module_id != undefined? $scope.rec.tab_module_id.id:0
        rec.token = $scope.$root.token;
        rec.is_defaults = $scope.is_defaults;
        //Number(rec.percentage) < 1 ||
        if (Number(rec.percentage) < 0 || Number(rec.percentage > 100)) {
            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(388));
            return false;
        }

        rec.tab_postions = $scope.rec.tab_postion != undefined ? $scope.rec.tab_postion.value : 0;

        if (rec.tab_postions == 0) {
            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(230, ['Stage Order within Opp. Cycle']));
            return false;
        }

        rec.edit_percentages = $scope.rec.edit_percentage != undefined ? $scope.rec.edit_percentage.value : 1;


        $http
            .post(postUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.is_defaults = 0;
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
                    $timeout(function () {
                        $state.go('app.opportunity-cycle-tabs');
                    }, 1000);
                }
                else
                    toaster.pop('error', 'Add', res.data.error);
            });
    }
}

function OppCycleTabsViewController($scope, $stateParams, $http, $state, $resource, ngDialog, toaster, $timeout) {
    $scope.formTitle = 'Opportunity Cycle Tabs';
    $scope.btnCancelUrl = 'app.opportunity-cycle-tabs';
    $scope.hideDel = false;
    $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
    { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
    { 'name': 'Opportunity Cycle Stage', 'url': 'app.opportunity-cycle-tabs', 'isActive': false }];
    // { 'name': 'Detail', 'url': '#', 'isActive': false }];

    $scope.formUrl = function () {
        return "app/views/opp_cycle_tabs/_form.html";
    }

    $scope.gotoEdit = function () {
        $state.go("app.edit-opportunity-cycle-tabs", { id: $stateParams.id });
    };

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


    /*var moduleUrl = $scope.$root.setup+"general/modules-codes";
     $http
     .post(moduleUrl, {'token':$scope.$root.token,'all':1})
     .then(function (res) {
     if(res.data.ack == true){
     $scope.arr_modules = res.data.response;
     }
     });*/
    $scope.rec = {};
    $scope.arr_percentage = {};
    $scope.arr_percentage = [{ 'label': 'Yes', 'value': 1 }, { 'label': 'No', 'value': 0 }];

    $scope.arr_status = {};
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];
    $scope.arr_position = {};
    $scope.arr_position = [{ 'label': 'Start', 'value': 1 }, { 'label': 'Middle', 'value': 1.1 }, {
        'label': 'End',
        'value': 2
    }];


    var postUrl = $scope.$root.setup + "crm/get-opportunity-cycle-tab";
    var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };
    $scope.showLoader = true;
    $scope.is_defaults = 0;
    $http
        .post(postUrl, postData)
        .then(function (res) {
            $scope.rec = res.data.response;
            $scope.rec.percentage = parseFloat(res.data.response.percentage);
            $scope.is_defaults = res.data.response.is_default;

            $scope.showLoader = false;
            //$scope.oop_cycle_codes = res.data.response.oop_cycle_codes.response;

            // $timeout(function () {
            // $scope.$root.$apply(function () {
            /*angular.forEach($scope.arr_status, function (obj, index) {
             if (obj.label == res.data.response.status)
             $scope.rec.tab_status = obj;
             });*/
            angular.forEach($scope.arr_status, function (obj, index) {
                if (obj.value == res.data.response.status)
                    $scope.rec.tab_status = obj;
            });

            //                 angular.forEach($scope.arr_percentage, function (obj, index) {
            //                     if (obj.value == res.data.response.edit_percentage)
            //                         $scope.rec.edit_percentage = obj;
            //                 });
            angular.forEach($scope.arr_position, function (obj, index) {
                if (obj.value == res.data.response.start_end)
                    $scope.rec.tab_postion = obj;
            });
            // });
            // }, 1000);
            /*angular.forEach($scope.arr_modules,function(obj,index){
             if(obj.id == res.data.response.module_id){$scope.rec.tab_module_id = obj};
             });*/
        });


    $scope.delete = function (id, index, data) {

        var delUrl = $scope.$root.setup + "crm/delete-opportunity-cycle-tab";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: $scope.rec.id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        // data.splice(index, 1);
                        $timeout(function () {
                            $state.go('app.opportunity-cycle-tabs');
                        }, 2000);
                    }
                    else
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(385));

                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };
}

function OppCycleTabsEditController($scope, $stateParams, $http, $state, $resource, toaster, ngDialog, $timeout) {

    $scope.formTitle = 'Opportunity Cycle Tabs';
    $scope.btnCancelUrl = 'app.opportunity-cycle-tabs';
    $scope.hideDel = false;
    $scope.breadcrumbs = [{ 'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex': '1' },
    { 'name': 'Sales', 'url': 'app.setup', 'isActive': false, 'tabIndex': '3' },
    { 'name': 'Opportunity Cycle Stage', 'url': 'app.opportunity-cycle-tabs', 'isActive': false }];
    // { 'name': 'Edit', 'url': '#', 'isActive': false }];

    $scope.formUrl = function () {
        return "app/views/opp_cycle_tabs/_form.html";
    }

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


    /*var moduleUrl = $scope.$root.setup+"general/modules-codes";
     $http
     .post(moduleUrl, {'token':$scope.$root.token,'all':1})
     .then(function (res) {
     if(res.data.ack == true){
     $scope.arr_modules = res.data.response;
     }
     });*/
    $scope.rec = {};
    $scope.arr_percentage = {};
    $scope.arr_percentage = [{ 'label': 'Yes', 'value': 1 }, { 'label': 'No', 'value': 0 }];

    $scope.arr_status = {};
    $scope.arr_status = [{ 'label': 'Active', 'value': 1 }, { 'label': 'Inactive', 'value': 0 }];

    $scope.arr_position = {};
    $scope.arr_position = [{ 'label': 'Start', 'value': 1 }, { 'label': 'Middle', 'value': 1.1 }, {
        'label': 'End',
        'value': 2
    }];

    var postUrl = $scope.$root.setup + "crm/get-opportunity-cycle-tab";
    var postData = { 'token': $scope.$root.token, 'id': $stateParams.id };

    $scope.is_defaults = 0;
    $http
        .post(postUrl, postData)
        .then(function (res) {
            $scope.rec = res.data.response;
            $scope.rec.percentage = parseFloat(res.data.response.percentage);

            $scope.rec.deletePerm = 1;
            $scope.is_defaults = res.data.response.is_default;

            // if (res.data.oop_cycle_codes.response != undefined || res.data.oop_cycle_codes != null) {
            if (res.data.oop_cycle_codes.response != undefined && res.data.oop_cycle_codes != null) {
                var message = "";

                angular.forEach(res.data.oop_cycle_codes.response, function (obj) {
                    message += obj.oop_code + " , ";
                });

                toaster.pop('warning', 'Info', 'This Stage is being used in one or more records therefore status cannot be changed.');
            }

            // $timeout(function () {
            //     $scope.$root.$apply(function () {
            angular.forEach($scope.arr_status, function (obj, index) {
                if (obj.value == res.data.response.status)
                    $scope.rec.tab_status = obj;
            });

            //                 angular.forEach($scope.arr_percentage, function (obj, index) {
            //                     if (obj.value == res.data.response.edit_percentage)
            //                         $scope.rec.edit_percentage = obj;
            //                 });
            angular.forEach($scope.arr_position, function (obj, index) {
                if (obj.value == res.data.response.start_end)
                    $scope.rec.tab_postion = obj;
            });
            // });
            // }, 1000);
            /*angular.forEach($scope.arr_modules,function(obj,index){
             if(obj.id == res.data.response.module_id){$scope.rec.tab_module_id = obj};
             });*/
        });

    $scope.setDefault = function (value) {
        $scope.is_defaults = value;
    }

    $scope.update = function (rec) {

        if ($scope.rec.tab_status == undefined || $scope.rec.tab_status == '') {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Status']));
            return false;
        }

        var updateUrl = $scope.$root.setup + "crm/update-opportunity-cycle-tab";
        rec.statuss = $scope.rec.tab_status != undefined ? $scope.rec.tab_status.value : 1;

        rec.tab_postions = $scope.rec.tab_postion != undefined ? $scope.rec.tab_postion.value : 0;
        //rec.module_id = $scope.rec.tab_module_id != undefined? $scope.rec.tab_module_id.id:0
        rec.token = $scope.$root.token;
        rec.is_defaults = $scope.is_defaults;

        if (Number(rec.percentage) < 0 || Number(rec.percentage > 100)) {
            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(388));
            return false;
        }

        if (rec.tab_postions == 0) {
            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(230, ['Stage Order within Opp. Cycle']));
            return false;
        }

        // rec.tab_postions = $scope.rec.tab_postion != undefined ? $scope.rec.tab_postion.value : 1;

        $http
            .post(updateUrl, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $timeout(function () {
                        $state.go('app.opportunity-cycle-tabs');
                    }, 1000);
                } else
                    toaster.pop('error', 'Info', res.data.error);
                /* $timeout(function () {
                    $state.go('app.opportunity-cycle-tabs');
                }, 2000); */
            });
    }


    $scope.delete = function (id, index, data) {

        var delUrl = $scope.$root.setup + "crm/delete-opportunity-cycle-tab";
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, { id: $scope.rec.id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
                        // data.splice(index, 1);
                        $timeout(function () {
                            $state.go('app.opportunity-cycle-tabs');
                        }, 2000);
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


