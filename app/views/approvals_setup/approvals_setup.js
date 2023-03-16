ApprovalsSetupController.$inject = ["$rootScope", "$stateParams", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster"];
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        /* specific routes here (see file config.js) */
        $stateProvider
            .state('app.approvals', {
                url: '/approvals_setup',
                title: 'Setup',
                templateUrl: helper.basepath('approvals_setup/approvals_setup.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'ApprovalsSetupController'
            })
    }
]);

myApp.controller('ApprovalsSetupController', ApprovalsSetupController);

function ApprovalsSetupController($rootScope, $stateParams, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster) {
    'use strict';

    // console.log($stateParams);
    $rootScope.breadcrumbs = [ //{'name':'Dashboard','url':'app.dashboard','isActive':false},
            {'name': 'Setup', 'url': 'app.setup', 'isActive': false, 'tabIndex':'1'},
            {'name': 'Human Resources', 'url': 'app.setup', 'isActive': false, 'tabIndex':'7'},
            {'name': 'Approvals', 'url': '#', 'isActive': false}
        ];
    
    $rootScope.approvals_readonly = true;
    $rootScope.getApprovals = function () {
        
        $rootScope.approval = {};
        $rootScope.approval.selectedAllEmployees = false;
        var Api = $rootScope.$root.setup + "general/get-approvals";
        $http
            .post(Api, {
                'token': $rootScope.$root.token
            })
            .then(function (res) {
                // console.log('el');
                if (res.data.ack == 1)
                    $rootScope.approval = res.data.response.approvals;
                else {
                    $rootScope.approval.selected_emps_type_1 = [];
                    $rootScope.approval.selected_emps_type_2 = [];
                    $rootScope.approval.selected_emps_type_3 = [];
                    $rootScope.approval.selected_emps_type_4 = [];
                    $rootScope.approval.selected_emps_type_5 = [];
                    $rootScope.approval.selected_emps_type_6 = [];
                    $rootScope.approval.selected_emps_type_7 = [];
                    $rootScope.approval.selected_emps_type_8 = [];
                }
                if (res.data.ack != undefined)
                    $rootScope.emp_list = res.data.response.employees;
            });
    }
    $rootScope.getApprovals();
    $rootScope.getEmployeeList = function (type) {

        $rootScope.selected_type = type;
        $rootScope.approval.selectedAllEmployees = false;
        if (type == 1) {
            angular.forEach($rootScope.emp_list, function (obj) {
                var emp = $filter("filter")($rootScope.approval.selected_emps_type_1, { id: obj.id });
                if (emp.length > 0)
                    obj.chk = true;
                else
                    obj.chk = false;
            });
        }
        else if (type == 2) {
            angular.forEach($rootScope.emp_list, function (obj) {
                var emp = $filter("filter")($rootScope.approval.selected_emps_type_2, { id: obj.id });
                if (emp.length > 0)
                    obj.chk = true;
                else
                    obj.chk = false;
            });
        }
        else if (type == 3) {
            angular.forEach($rootScope.emp_list, function (obj) {
                var emp = $filter("filter")($rootScope.approval.selected_emps_type_3, { id: obj.id });
                if (emp.length > 0)
                    obj.chk = true;
                else
                    obj.chk = false;
            });
        }
        else if (type == 4) {
            angular.forEach($rootScope.emp_list, function (obj) {
                var emp = $filter("filter")($rootScope.approval.selected_emps_type_4, { id: obj.id });
                if (emp.length > 0)
                    obj.chk = true;
                else
                    obj.chk = false;
            });
        }
        else if (type == 5) {
            angular.forEach($rootScope.emp_list, function (obj) {
                var emp = $filter("filter")($rootScope.approval.selected_emps_type_5, { id: obj.id });
                if (emp.length > 0)
                    obj.chk = true;
                else
                    obj.chk = false;
            });
        }
        else if (type == 6) {
            angular.forEach($rootScope.emp_list, function (obj) {
                var emp = $filter("filter")($rootScope.approval.selected_emps_type_6, { id: obj.id });
                if (emp.length > 0)
                    obj.chk = true;
                else
                    obj.chk = false;
            });
        }
        else if (type == 7) {
            angular.forEach($rootScope.emp_list, function (obj) {
                var emp = $filter("filter")($rootScope.approval.selected_emps_type_7, { id: obj.id });
                if (emp.length > 0)
                    obj.chk = true;
                else
                    obj.chk = false;
            });
        }
        else if (type == 8) {
            angular.forEach($rootScope.emp_list, function (obj) {
                var emp = $filter("filter")($rootScope.approval.selected_emps_type_8, { id: obj.id });
                if (emp.length > 0)
                    obj.chk = true;
                else
                    obj.chk = false;
            });
        }

        angular.element('#_approvals_employees_list').modal({ show: true });
    }

    $rootScope.addEmployees = function () {
        var emps = $filter("filter")($rootScope.emp_list, { chk: true });
        if (emps.length > 6) {
            toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(321,['Selected Employees','6']));
            return;
        }
        var type = $rootScope.selected_type;
        if (type == 1) {
            $rootScope.approval.selected_emps_type_1 = [];
            $rootScope.approval.selected_emps_codes_type_1 = '';
            angular.forEach($rootScope.emp_list, function (obj) {
                if (obj.chk == true) {
                    $rootScope.approval.selected_emps_type_1.push({ id: obj.id, code: obj.name+'('+obj.code+')' });
                    $rootScope.approval.selected_emps_codes_type_1 = $rootScope.approval.selected_emps_codes_type_1 + obj.name+'('+obj.code+')' + ', ';
                }
            });
            $rootScope.approval.selected_emps_codes_type_1 = $rootScope.approval.selected_emps_codes_type_1.substring(0, $rootScope.approval.selected_emps_codes_type_1.length - 2);
        }
        else if (type == 2) {
            $rootScope.approval.selected_emps_type_2 = [];
            $rootScope.approval.selected_emps_codes_type_2 = '';
            angular.forEach($rootScope.emp_list, function (obj) {
                if (obj.chk == true) {
                    $rootScope.approval.selected_emps_type_2.push({ id: obj.id, code: obj.name+'('+obj.code+')' });
                    $rootScope.approval.selected_emps_codes_type_2 = $rootScope.approval.selected_emps_codes_type_2 + obj.name+'('+obj.code+')' + ', ';
                }
            });
            $rootScope.approval.selected_emps_codes_type_2 = $rootScope.approval.selected_emps_codes_type_2.substring(0, $rootScope.approval.selected_emps_codes_type_2.length - 2);
        }
        else if (type == 3) {
            $rootScope.approval.selected_emps_type_3 = [];
            $rootScope.approval.selected_emps_codes_type_3 = '';
            angular.forEach($rootScope.emp_list, function (obj) {
                if (obj.chk == true) {
                    $rootScope.approval.selected_emps_type_3.push({ id: obj.id, code: obj.name+'('+obj.code+')' });
                    $rootScope.approval.selected_emps_codes_type_3 = $rootScope.approval.selected_emps_codes_type_3 + obj.name+'('+obj.code+')' + ', ';
                }
            });
            $rootScope.approval.selected_emps_codes_type_3 = $rootScope.approval.selected_emps_codes_type_3.substring(0, $rootScope.approval.selected_emps_codes_type_3.length - 2);
        }
        else if (type == 4) {
            $rootScope.approval.selected_emps_type_4 = [];
            $rootScope.approval.selected_emps_codes_type_4 = '';
            angular.forEach($rootScope.emp_list, function (obj) {
                if (obj.chk == true) {
                    $rootScope.approval.selected_emps_type_4.push({ id: obj.id, code: obj.name+'('+obj.code+')' });
                    $rootScope.approval.selected_emps_codes_type_4 = $rootScope.approval.selected_emps_codes_type_4 + obj.name+'('+obj.code+')' + ', ';
                }
            });
            $rootScope.approval.selected_emps_codes_type_4 = $rootScope.approval.selected_emps_codes_type_4.substring(0, $rootScope.approval.selected_emps_codes_type_4.length - 2);
        }
        else if (type == 5) {
            $rootScope.approval.selected_emps_type_5 = [];
            $rootScope.approval.selected_emps_codes_type_5 = '';
            angular.forEach($rootScope.emp_list, function (obj) {
                if (obj.chk == true) {

                    $rootScope.approval.selected_emps_type_5.push({ id: obj.id, code: obj.name+'('+obj.code+')' });
                    $rootScope.approval.selected_emps_codes_type_5 = $rootScope.approval.selected_emps_codes_type_5 + obj.name+'('+obj.code+')' + ',';
                }
            });
            $rootScope.approval.selected_emps_codes_type_5 = $rootScope.approval.selected_emps_codes_type_5.substring(0, $rootScope.approval.selected_emps_codes_type_5.length - 2);
        }
        else if (type == 6) {
            $rootScope.approval.selected_emps_type_6 = [];
            $rootScope.approval.selected_emps_codes_type_6 = '';
            angular.forEach($rootScope.emp_list, function (obj) {
                if (obj.chk == true) {
                    $rootScope.approval.selected_emps_type_6.push({ id: obj.id, code: obj.name+'('+obj.code+')' });
                    $rootScope.approval.selected_emps_codes_type_6 = $rootScope.approval.selected_emps_codes_type_6 + obj.name+'('+obj.code+')' + ', ';

                }
            });
            $rootScope.approval.selected_emps_codes_type_6 = $rootScope.approval.selected_emps_codes_type_6.substring(0, $rootScope.approval.selected_emps_codes_type_6.length - 2);
        }
        else if (type == 7) {
            $rootScope.approval.selected_emps_type_7 = [];
            $rootScope.approval.selected_emps_codes_type_7 = '';
            angular.forEach($rootScope.emp_list, function (obj) {
                if (obj.chk == true) {
                    $rootScope.approval.selected_emps_type_7.push({ id: obj.id, code: obj.name+'('+obj.code+')' });
                    $rootScope.approval.selected_emps_codes_type_7 = $rootScope.approval.selected_emps_codes_type_7 + obj.name+'('+obj.code+')' + ', ';

                }
            });
            $rootScope.approval.selected_emps_codes_type_7 = $rootScope.approval.selected_emps_codes_type_7.substring(0, $rootScope.approval.selected_emps_codes_type_7.length - 2);
        }
        else if (type == 8) {
            $rootScope.approval.selected_emps_type_8 = [];
            $rootScope.approval.selected_emps_codes_type_8 = '';
            angular.forEach($rootScope.emp_list, function (obj) {
                if (obj.chk == true) {
                    $rootScope.approval.selected_emps_type_8.push({ id: obj.id, code: obj.name+'('+obj.code+')' });
                    $rootScope.approval.selected_emps_codes_type_8 = $rootScope.approval.selected_emps_codes_type_8 + obj.name+'('+obj.code+')' + ', ';

                }
            });
            $rootScope.approval.selected_emps_codes_type_8 = $rootScope.approval.selected_emps_codes_type_8.substring(0, $rootScope.approval.selected_emps_codes_type_8.length - 2);
        }

        angular.element('#_approvals_employees_list').modal('hide');
    }

    $rootScope.selectedAllEmployeesFtn = function (flg, _filter) {
        let selection_filter = $filter('filter');
        let filtered = selection_filter($rootScope.emp_list, _filter);

        if(flg){
            angular.forEach(filtered, function (obj) {
                obj.chk = flg;
            });
        }else {
            angular.forEach($rootScope.emp_list, function (obj) {
                obj.chk = flg;
            });
        }
       
    }
    $rootScope.clearEmployees = function () {
        angular.element('#_approvals_employees_list').modal('hide');
    }
    $rootScope.addApprovals = function () {
       
        var Api = $rootScope.$root.setup + "general/update-approvals";

        if (($rootScope.approval.status_1 == true && !($rootScope.approval.selected_emps_codes_type_1 != undefined &&
                                                        $rootScope.approval.selected_emps_codes_type_1.length > 0)) ||
            ($rootScope.approval.status_2 == true && !($rootScope.approval.selected_emps_codes_type_2 != undefined &&
                                                        $rootScope.approval.selected_emps_codes_type_2.length > 0)) ||
            ($rootScope.approval.status_3 == true && !($rootScope.approval.selected_emps_codes_type_3 != undefined &&
                                                        $rootScope.approval.selected_emps_codes_type_3.length > 0)) ||
            ($rootScope.approval.status_4 == true && !($rootScope.approval.selected_emps_codes_type_4 != undefined &&
                                                        $rootScope.approval.selected_emps_codes_type_4.length > 0)) ||
            ($rootScope.approval.status_5 == true && !($rootScope.approval.selected_emps_codes_type_5 != undefined &&
                                                        $rootScope.approval.selected_emps_codes_type_5.length > 0)) ||
            ($rootScope.approval.status_6 == true && !($rootScope.approval.selected_emps_codes_type_6 != undefined &&
                                                        $rootScope.approval.selected_emps_codes_type_6.length > 0))  ||
            ($rootScope.approval.status_7 == true && !($rootScope.approval.selected_emps_codes_type_7 != undefined &&
                                                        $rootScope.approval.selected_emps_codes_type_7.length > 0))  ||
            ($rootScope.approval.status_8 == true && !($rootScope.approval.selected_emps_codes_type_8 != undefined &&
                                                        $rootScope.approval.selected_emps_codes_type_8.length > 0))) {
            toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(638));
            return;
        }
        if (($rootScope.approval.status_1 == false && ($rootScope.approval.selected_emps_codes_type_1 != undefined &&
            $rootScope.approval.selected_emps_codes_type_1.length > 0)) ||
            ($rootScope.approval.status_2 == false && ($rootScope.approval.selected_emps_codes_type_2 != undefined &&
                $rootScope.approval.selected_emps_codes_type_2.length > 0)) ||
            ($rootScope.approval.status_3 == false && ($rootScope.approval.selected_emps_codes_type_3 != undefined &&
                $rootScope.approval.selected_emps_codes_type_3.length > 0)) ||
            ($rootScope.approval.status_4 == false && ($rootScope.approval.selected_emps_codes_type_4 != undefined &&
                $rootScope.approval.selected_emps_codes_type_4.length > 0)) ||
            ($rootScope.approval.status_5 == false && ($rootScope.approval.selected_emps_codes_type_5 != undefined &&
                $rootScope.approval.selected_emps_codes_type_5.length > 0)) ||
            ($rootScope.approval.status_6 == false && ($rootScope.approval.selected_emps_codes_type_6 != undefined &&
                $rootScope.approval.selected_emps_codes_type_6.length > 0)) ||
            ($rootScope.approval.status_7 == false && ($rootScope.approval.selected_emps_codes_type_7 != undefined &&
                $rootScope.approval.selected_emps_codes_type_7.length > 0))  ||
            ($rootScope.approval.status_8 == false && ($rootScope.approval.selected_emps_codes_type_8 != undefined &&
                $rootScope.approval.selected_emps_codes_type_8.length > 0))) {
            toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(642));
            return;
        }

        var approvals = [];
        approvals.push({ id: $rootScope.approval.id_1, 'type': '1', status: $rootScope.approval.status_1, selected_emps: $rootScope.approval.selected_emps_type_1, criteria: $rootScope.approval.criteria_1 });
        approvals.push({ id: $rootScope.approval.id_2, 'type': '2', status: $rootScope.approval.status_2, selected_emps: $rootScope.approval.selected_emps_type_2, criteria: 0 });
        approvals.push({ id: $rootScope.approval.id_3, 'type': '3', status: $rootScope.approval.status_3, selected_emps: $rootScope.approval.selected_emps_type_3, criteria: 0 });
        approvals.push({ id: $rootScope.approval.id_4, 'type': '4', status: $rootScope.approval.status_4, selected_emps: $rootScope.approval.selected_emps_type_4, criteria: $rootScope.approval.criteria_4 });
        approvals.push({ id: $rootScope.approval.id_5, 'type': '5', status: $rootScope.approval.status_5, selected_emps: $rootScope.approval.selected_emps_type_5, criteria: 0 });
        approvals.push({ id: $rootScope.approval.id_6, 'type': '6', status: $rootScope.approval.status_6, selected_emps: $rootScope.approval.selected_emps_type_6, criteria: 0 });
        approvals.push({ id: $rootScope.approval.id_7, 'type': '7', status: $rootScope.approval.status_7, selected_emps: $rootScope.approval.selected_emps_type_7, criteria: $rootScope.approval.criteria_7 });
        approvals.push({ id: $rootScope.approval.id_8, 'type': '8', status: $rootScope.approval.status_8, selected_emps: $rootScope.approval.selected_emps_type_8, criteria: 0 });
        
        $rootScope.showLoader = true;
        $http
            .post(Api, {
                'token': $rootScope.$root.token,
                approvals: approvals
            })
            .then(function (res) {
                // console.log('el');
                if (res.data.ack == 1) {
                    $rootScope.showLoader = false;
                    toaster.pop('success', 'Success', "Approvals Updated Sucessfully");
                    $rootScope.approvals_readonly = true;
                    $rootScope.getApprovals();
                }
                else
                    toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(244, ['Approvals']));
            });
    }

    $rootScope.ShowEditForm = function()
    {
        $rootScope.approvals_readonly = false;
    }

    $rootScope.OnBlurMarginPercentage = function(approval)
    {
        if (Number(approval.criteria_1) < 0 || Number(approval.criteria_1) > 100)
        {
            toaster.pop('error', 'Error', $rootScope.getErrorMessageByCode(388));
            approval.criteria_1 = null;
        }
    }
    
}
