myApp.config(['$ocLazyLoadProvider', '$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($ocLazyLoadProvider, $stateProvider, $locationProvider, $urlRouterProvider, helper) {
        $stateProvider
            .state('app.hr_listing', {
                url: '/hr_listing',
                title: 'Human Resources',
                templateUrl: helper.basepath('hr_values/hr_listing.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'hr_values_controler'
            })
            .state('app.add_hr_values', {
                url: '/add_values',
                title: 'Human Resources',
                templateUrl: helper.basepath('hr_values/_form.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'edithrvalues'
            })
            .state('app.viewhrvalues', {
                url: '/hr_values/:id/view/:tab',
                title: 'Human Resources',
                templateUrl: helper.basepath('hr_values/_form.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'edithrvalues'//  controller: 'viewhrvalues'
            })
            .state('app.edithrvalues', {
                url: '/hr_values/:id/edit?isTab',
                title: 'Human Resources',
                templateUrl: helper.basepath('hr_values/_form.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"), // ,"xeditable","ui.bootstrap" //'event-calendar'
                controller: 'edithrvalues'
            })
            .state('app.edit_account_setting', {
                url: '/edit_account_setting/:id/edit/:tab',
                title: 'Human Resources',
                templateUrl: helper.basepath('hr_values/accounts/account_tabs.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'edithrvalues'
            })
            .state('app.mail_list', {
                url: '/mail_list',
                title: 'Mail Configurations',
                templateUrl: helper.basepath('hr_values/accounts/mail_list.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"),
                controller: 'edithrvalues'
            })
            .state('app.showHolidayReport', {
                url: '/employee-holiday-report/:id',
                title: 'Reports',
                templateUrl: helper.basepath('hr_values/accounts/empHolidayReport.html'),
                resolve: helper.resolveFor('ngTable', 'ngDialog'),
                controller: 'EmpHolidayReportController'
            })
            .state('app.holidayForm', {
                url: '/holiday-form/:id/view?isTab&hid',
                title: 'Human Resources',
                templateUrl: helper.basepath('hr_values/holidayForm.html'),
                resolve: helper.resolveFor('ngTable', "ngDialog"), // ,"xeditable","ui.bootstrap" //'event-calendar'
                controller: 'viewHolidayForm'
            })
    }]);

hr_values_controler.$inject = ["$scope", "$filter", "$resource", "$timeout", "$http", "ngDialog", "toaster", "$rootScope", "moduleTracker"];	  //,"xeditable", "ui.bootstrap"
ExpenseFileUploadController.$inject = ["$scope", "Upload", "$timeout", "$rootScope", "toaster"];

myApp.controller('hr_values_controler', hr_values_controler);
myApp.controller('ExpenseFileUploadController', ExpenseFileUploadController);
function hr_values_controler($scope, $filter, $resource, $timeout, $http, ngDialog, toaster, $rootScope, moduleTracker) {

    'use strict';

    moduleTracker.updateName("hr");
    moduleTracker.updateRecord("");

    $scope.formData = {};
    $scope.formData.approvalProcess = 0;
    $scope.$root.breadcrumbs =
        [////{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
            { 'name': 'Human Resources', 'url': '#', 'isActive': false },
            { 'name': 'Employees', 'url': '#', 'isActive': true }
        ];

    var vm = this;
    var Api = $scope.$root.hr + "hr_values";
    var delUrl = $scope.$root.hr + "hr_values/delete_hr_values";

    $scope.postData = [];
    $scope.postData = {
        'token': $scope.$root.token,
        'all': "1"
    };

    $scope.searchTerm = "";

    $scope.searchKeyword = {};

    $scope.gethr_list = function (item_paging, sort_column, sortform) {
        $scope.postData = {};
        $scope.postData.token = $scope.$root.token;
        if (item_paging == 1) $scope.item_paging.spage = 1;
        $scope.postData.page = $scope.item_paging.spage;

        $scope.postData.pagination_limits = $scope.item_paging.pagination_limit !== undefined ? $scope.item_paging.pagination_limit.id : 0;

        $scope.postData.searchKeyword = $scope.searchKeyword;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeyword = {};
            $scope.record_data = {};
        }


        //sort by column

        if ((sort_column != undefined) && (sort_column != null)) {
            console.log(sort_column);
            $scope.postData.sort_column = sort_column;
            $scope.postData.sortform = sortform;

            $rootScope.sortform = sortform;
            $rootScope.reversee = ('desc' === $rootScope.sortform) ? !$rootScope.reversee : false;
            $rootScope.sort_column = sort_column;

            $rootScope.save_single_value($rootScope.sort_column, 'hrsort_name')

            //$scope.sortform=sortform;
            // $scope.reversee = ('desc' === $scope.sortform) ? !$scope.reversee : false;
            // $scope.sort_column=sort_column;

        }

        // //flexi table default table getter
        // $scope.getDefaultTableMeta = function (tableName, refData) {
        //     var defaultTablePath = "api/flexiTableDefaults/defaultTables/" + tableName + ".json";
        //     $http
        //         .get(defaultTablePath)
        //         .then(function (res) {
        //             console.log(res, refData);
        //             if (refData.length) {
        //                 angular.forEach(refData, function (obj, index) {
        //                     for (var i = 0; i < res.data.length; i++) {
        //                         if (obj.column_name == res.data[i].column_name) {
        //                             res.data[i].id = obj.id;
        //                             res.data[i].user_id = obj.user_id;
        //                             res.data[i].company_id = obj.company_id;
        //                         }
        //                     }
        //                 });
        //             }
        //             //console.log($scope.tableData.data.response.tbl_meta_data.response);

        //             $scope.tableData.data.response.tbl_meta_data.response = res.data;
        //             //console.log($scope.tableData.data.response.tbl_meta_data.response);
        //         });
        // }

        $scope.showLoader = true;
        $http
            .post(Api, $scope.postData)
            .then(function (res) {
                $scope.tableData = res;
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
                    angular.forEach(res.data.response[0], function (val, index) {
                        if (index != 'chk' && index != 'id') {
                            $scope.columns.push({
                                'title': toTitleCase(index),
                                'field': index,
                                'visible': true
                            });
                        }

                    });
                    $scope.showLoader = false;
                }
                //else     toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
            });


    }
    var col = '';
    col = $rootScope.get_single_value('hrsort_name');
    // $scope.gethr_list(1, col, 'Desc');
    $scope.$root.itemselectPage(1);


    $scope.columns_general = [];
    $scope.general = [];
    $scope.columns_contact = [];
    $scope.contact = [];
    $scope.columns_personal = [];
    $scope.personal = [];
    $scope.columns_salary = [];
    $scope.salary = [];
    $scope.columns_benifit = [];
    $scope.benifits = [];
    $scope.historytype = function (id) {
        $scope.show_history_pop = true;
        angular.element('#model_btn_his').click();

        var empUrl = $scope.$root.hr + "employee/get_log";
        $scope.postData = {
            'token': $scope.$root.token,
            'id': id
        };
        $http
            .post(empUrl, $scope.postData)
            .then(function (res) {

                if (res.data.ack == true) {
                    $scope.columns_general = [];
                    $scope.general = [];
                    $scope.columns_contact = [];
                    $scope.contact = [];
                    $scope.columns_personal = [];
                    $scope.personal = [];
                    $scope.columns_salary = [];
                    $scope.salary = [];
                    $scope.columns_benifit = [];
                    $scope.benifits = [];

                    $scope.general = res.data.response_general;
                    $scope.contact = res.data.response_contact;
                    $scope.personal = res.data.response_personal;
                    $scope.salary = res.data.response_salary;
                    $scope.benifits = res.data.response_benifits;

                    angular.forEach(res.data.response_general[0], function (val, index) {
                        $scope.columns_general.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.forEach(res.data.response_contact[0], function (val, index) {
                        $scope.columns_contact.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.forEach(res.data.response_personal[0], function (val, index) {
                        $scope.columns_personal.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.forEach(res.data.response_salary[0], function (val, index) {
                        $scope.columns_salary.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    angular.forEach(res.data.response_benifits[0], function (val, index) {
                        $scope.columns_benifit.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                } else {
                    $scope.columns_general = [];
                    $scope.general = [];
                    $scope.columns_contact = [];
                    $scope.contact = [];
                    $scope.columns_personal = [];
                    $scope.personal = [];
                    $scope.columns_salary = [];
                    $scope.salary = [];
                    $scope.columns_benifit = [];
                    $scope.benifits = [];

                }

                angular.forEach($scope.status_list, function (obj, index) {
                    // console.log(obj);
                    if (obj.id == 1)
                        $scope.searchKeyword.status = obj;
                });

            });


    }


}

myApp.controller('edithrvalues', edithrvalues);
function edithrvalues($scope, $stateParams, $http, $state, toaster, $rootScope, ngDialog, $window, $resource, $timeout, moduleTracker) {


    moduleTracker.updateName("hr");
    moduleTracker.updateRecord($stateParams.id);

    $scope.currentEmpID = 0;
    $scope.recnew = 0;

    if ($stateParams.id > 0) {
        $scope.check_item_readonly = true;
        $scope.recnew = $stateParams.id;
        $scope.currentEmpID = $stateParams.id;
    }

    $scope.holidayTab = false;
    $scope.expenseTab = false;
    if ($stateParams.isTab && $stateParams.isTab == 1) {
        $scope.holidayTab = true;
    }
    else if ($stateParams.isTab && $stateParams.isTab == 2) {
        $scope.expenseTab = true;
    }

    if ($stateParams.tab && $stateParams.tab == 1) {
        $scope.holidayTab = true;
    }
    else if ($stateParams.tab && $stateParams.tab == 2) {
        $scope.expenseTab = true;
    }


    $scope.gender_type = [{ 'label': 'Male', 'value': "1" }, { 'label': 'Female', 'value': "2" }];

    $scope.holidayYearType = [{ 'name': 'Current Year', 'id': "1" }, { 'name': 'Next Year', 'id': "2" }];

    $scope.mar_status = [
        { 'label': 'Single', 'value': "1" },
        { 'label': 'Married', 'value': "2" },
        { 'label': 'Divorced', 'value': "3" },
        { 'label': 'Widowed', 'value': "4" },
        { 'label': 'Prefer not to say', 'value': "5" }
    ];

    $scope.showroleslist = true;
    $scope.formTitle = 'HR Value';
    $scope.btnCancelUrl = 'app.hr_listing';

    $scope.formData = {};
    $scope.formData2 = {};
    $scope.formData3 = {};
    $scope.formData4 = {};
    $scope.formData5 = {};
    $scope.formData6 = {};
    $scope.formsubData = {};
    $scope.expenses = {};
    $scope.employee_type_list = [];
    $scope.selected_dept_list = [];
    $scope.dept_list = {};
    //$scope.countries = {};
    $scope.religion_list = {};
    $scope.user_types = [];
    $scope.login_allow = [];
    $scope.salary_type = [];
    $scope.entitled = '';
    $scope.entitled_label = '';
    $scope.leave_types = [];
    $scope.inactivity_types = [];
    $scope.working_hours = '';
    $scope.jobStatuses = [{ 'name': 'Full Time', 'id': 1 }, { 'name': 'Part Time', 'id': 2 }];
    $scope.resign_type = [];
    $scope.car_status = [];
    $scope.fuel_cost_deduction_array = [];
    $scope.laptop_status = [];
    $scope.mobile_status = [];
    $scope.fuel_status = [];
    $scope.fuel_status = [{ 'label': 'Yes', 'value': 22 }, { 'label': 'No', 'value': 33 }];
    $scope.arr_holiday_type = [];
    $scope.arr_holiday_type = [{ 'name': 'Paid', 'id': 1 }, { 'name': 'Unpaid', 'id': 2 }];
    $scope.tablet_status = [];
    $scope.currentUserType = $rootScope.user_type;
    // $scope.formData.emp_picture = "";

    $scope.formData.approvalProcess = 0;

    $scope.documents = {};

    $scope.list_folder = [];
    $scope.salary_type_list_final_two = [];
    $scope.salary_type_list_final_one = [];
    $scope.entitle_holiday_option = [];

    $scope.entitle_holiday_option = [{ 'label': 'Days', 'value': 1 }];

    /*$scope.entitle_holiday_option = [{'label': 'Week', 'value': 1}, {'label': 'Days', 'value': 2}, {
     'label': 'Hours',
     'value': 3
     }];*/

    $scope.formData.rate = 0;
    $scope.formData.buckets = [];
    $scope.arr_type_benefit = [];
    $scope.arr_type_benefit = [{ id: 1, name: 'Yes' }, { 'id': 2, name: 'No' }];

    $scope.arr_car_fuel_type = [];
    /* $scope.arr_car_fuel_type = [{ 'label': 'Fuel Type E (Electric - Zero Emission cars)', 'value': 1 }, 
                                { 'label': 'Fuel Type D ( Diesel Cars)', 'value': 2 }, 
                                { 'label': 'Fuel Type A ( all other cars)','value': 3}]; */
    $scope.arr_car_fuel_type = [{ 'label': 'Petrol', 'value': 1 },
    { 'label': 'LPG', 'value': 2 },
    { 'label': 'Diesel', 'value': 3 }];

    $scope.arr_car_enngine = [
        { 'label': '1400cc or less', 'value': 1, 'type': 1 },
        { 'label': '1401cc to 2000cc', 'value': 2, 'type': 1 },
        { 'label': 'Over 2000cc', 'value': 3, 'type': 1 },

        { 'label': '1400cc or less', 'value': 7, 'type': 2 },
        { 'label': '1401cc to 2000cc', 'value': 8, 'type': 2 },
        { 'label': 'Over 2000cc', 'value': 9, 'type': 2 },

        { 'label': '1600cc or less', 'value': 4, 'type': 3 },
        { 'label': '1601cc to 2000cc', 'value': 5, 'type': 3 },
        { 'label': 'Over 2000cc', 'value': 6, 'type': 3 }];

    $scope.vechile_mileage = 1;

    $scope.GetApprovalPreData = function () {
        var APIUrl = $scope.$root.sales + "customer/order/get-approval-pre-data";
        var postData = {
            'token': $scope.$root.token
        };
        $http
            .post(APIUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.expense_approval_req = res.data.expense_approval_req;
                    $scope.holiday_approval_req = res.data.holiday_approval_req;
                }
                else {
                    $scope.expense_approval_req = 0;
                    $scope.holiday_approval_req = 0;

                }
            });
    }
    // if (!($stateParams.id > 0))
    $scope.GetApprovalPreData();

    $scope.updateAccountSetings = function (empAccountSettingData) {
        empAccountSettingData.employee_id = $stateParams.id;
        empAccountSettingData.token = $scope.$root.token;

        var updateAccountSetingsURL = $scope.$root.hr + "hr_values/update-account-settings-detail";

        if (!$scope.isPasswordConfirm && $scope.isPasswordTouched) {
            toaster.pop('error', 'Edit', "Confirm password do not match.");
        } else {

            $scope.showLoader = true;
            $http
                .post(updateAccountSetingsURL, empAccountSettingData)
                .then(function (res) {
                    $scope.showLoader = false;

                    if (res.data.ack == true) {
                        if (res.data.resetPassword == 1) {

                            toaster.pop('success', 'Info', 'Record updated successfully. Your password is changed, please login again.');

                            $timeout(function () {
                                $state.go('page.login');
                            }, 1500);
                        }
                        else {
                            toaster.pop('success', 'Info', res.data.msg);
                        }
                    } else
                        toaster.pop('error', 'Edit', res.data.error);
                });
        }
    }

    $scope.addGeneral = function (formData, account_setting) {
        console.log(formData);
        if (account_setting != undefined)
            $scope.formData.account_setting = 1;
        else
            $scope.formData.account_setting = 0;

        $scope.formData.employee_id = $stateParams.id;
        $scope.formData.data = $scope.formFields;
        $scope.formData.tab_id_2 = 1;
        $scope.formData.token = $scope.$root.token;

        if (typeof $scope.formData.job_status != "undefined") {
            if ($scope.formData.job_status == null) {
                $scope.formData.job_status_id = 0;
            }
            else {
                $scope.formData.job_status_id = $scope.formData.job_status.id;
            }
        }
        else {
            $scope.formData.job_status_id = 0;
        }


        $scope.formData.user_ids = $scope.formData.user_id !== undefined ? $scope.formData.user_id.value : 0;
        //  $scope.formData.allow_logins = $scope.formData.allow_login !== undefined ? $scope.formData.allow_login.value : 0;
        $scope.formData.allow_logins = $scope.formData.allow_login;
        $scope.formData.departments = $scope.formData.department !== undefined ? $scope.formData.department.id : 0;
        $scope.formData.employee_types = ($scope.formData.employee_type !== undefined && $scope.formData.employee_type != null) ? $scope.formData.employee_type.id : 0;
        // $scope.formData.cause_of_inactivitys = (typeof $scope.formData.cause_of_inactivity !== "undefined" && $scope.formData.cause_of_inactivity != null) ? $scope.formData.cause_of_inactivity.id : 0;
        $scope.formData.cause_of_inactivity = $scope.formData.cause_of_inactivity == null ? 0 : $scope.formData.cause_of_inactivity;
        $scope.formData.reason_of_leavings = $scope.formData.reason_of_leaving !== undefined ? $scope.formData.reason_of_leaving.id : 0;
        $scope.formData.statuss = $scope.formData.status !== undefined ? $scope.formData.status.id : 0;

        $scope.updateGeneral($scope.formData.account_setting);



        // if ($scope.formData.user_code != undefined) {
        //     $scope.updateGeneral($scope.formData.account_setting);
        // }
        // else {
        //     // var getCrmCodeUrl = $scope.$root.hr + "hr_values/get-code";
        //     var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
        //     var name = $scope.$root.base64_encode('employees');
        //     var no = $scope.$root.base64_encode('user_no');
        //     $scope.showLoader = true;
        //     var module_category_id = 2;
        //     $http
        //         .post(getCodeUrl, {
        //             'is_increment': 1,
        //             'token': $scope.$root.token,
        //             'tb': name,
        //             'm_id': 54,
        //             'no': no,
        //             'category': $scope.formData.category_ids,
        //             'brand': $scope.formData.brand_ids,
        //             'module_category_id': module_category_id
        //         })
        //         .then(function (res) {
        //             $scope.showLoader = false;
        //             if (res.data.ack == 1) {
        //                 $scope.formData.user_code = res.data.code;
        //                 $scope.formData.user_no = res.data.nubmer;

        //                 $scope.formData.code_type = module_category_id;//res.data.code_type;
        //                 $scope.count_result++;

        //                 if (res.data.type == 1) {
        //                     $scope.product_type = false;
        //                 }
        //                 else {
        //                     $scope.product_type = true;
        //                 }

        //                 // if ($scope.count_result > 0) {
        //                 //     // console.log($scope.count_result);
        //                 //     return true;
        //                 // }
        //                 // else {
        //                 //     console.log($scope.count_result + 'd');
        //                 //     return false;
        //                 // }

        //                 if ($scope.formData.user_code != undefined) {
        //                     $scope.updateGeneral();
        //                 }

        //             }
        //             else {
        //                 toaster.pop('error', 'info', res.data.error);
        //                 return false;
        //             }
        //         });
        // }



    }

    $scope.isPasswordTouched = false;
    $scope.isPasswordConfirm = false;
    $scope.checkPassword = function () {
        console.log("comparison : ", $scope.formData.user_password);
        console.log("with : ", $scope.formData.confirm_password);
        $scope.isPasswordTouched = true;
        if ($scope.formData.user_password == $scope.formData.confirm_password) {
            $scope.isPasswordConfirm = true;
        } else {
            $scope.isPasswordConfirm = false;
        }
    }
    $scope.updateGeneral = function (accountSetting) {
        var updategeral = $scope.$root.hr + "hr_values/update-hr-general";
        // var updateUrl = $scope.$root.hr + "hr_values/update-tab-col-val";
        if ($scope.formData.user_id.value == undefined) {
            $scope.formData.user_ids = $scope.formData.user_id;
        }
        else {
            $scope.formData.user_ids = $scope.formData.user_id.value;
        }
        if (accountSetting == undefined || accountSetting == 0)
            $scope.formData.statuss = $scope.formData.status.id;
        else {
            $scope.formData.statuss = 1;//$scope.formData.status;

        }

        if (!$scope.isPasswordConfirm && $scope.isPasswordTouched) {
            toaster.pop('error', 'Edit', "Confirm password do not match.");
        } else {
            $scope.formData.token = $scope.$root.token;
            $scope.showLoader = true;
            $http
                .post(updategeral, $scope.formData)
                .then(function (res) {
                    $scope.showLoader = false;
                    if (res.data.ack == true) {
                        $scope.employee_id = res.data.employee_id;
                        toaster.pop('success', 'Info', res.data.msg);
                        if (res.data.allow_login_exceeding) {
                            $scope.formData.allow_login = false;
                            toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(369));
                        }
                        $scope.check_hrvalues_readonly = true;
                        if (res.data.employee_id == $rootScope.userId) {
                            $rootScope.known_as = $scope.formData.known_as;
                            $rootScope.$storage.setItem("known_as", $scope.formData.known_as);
                        }
                        if ($scope.selectedrolesrecord.length > 0) $scope.add_employee_roles(res.data.employee_id);

                        if ($scope.isSalePerersonChanged) {
                            if ($scope.selectedSalespersons.length > 0)
                                $scope.add_salespersons(res.data.employee_id);
                        }


                        if (res.data.info == 'insert') {
                            $scope.recnew = res.data.employee_id;
                            $timeout(function () {
                                $state.go("app.edithrvalues", { id: res.data.employee_id });
                            }, 1000);
                            $scope.check_hrvalues_readonly = true;

                        }


                    } else
                        toaster.pop('error', 'Edit', res.data.error);
                    //toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(102));

                });
        }
    }

    $scope.showLoader = true;

    //var emp_last_status_Url = $scope.$root.hr + "hr_values/employee-last-status-history";
    var empFormDetails = $scope.$root.hr + "hr_values/get-emp-form-details";
    var postData = {
        'token': $scope.$root.token,
        'company_id': $scope.$root.defaultCompany,
        'employee_id': $stateParams.id
    };


    $http
        .post(empFormDetails, postData)
        .then(function (res) {
            $scope.showLoader = false;
            res = res.data;

            $scope.empAccountData = {};

            if (res.ack == 1) {
                // debugger
                //                 if ($scope.recnew == 0){
                //                     $scope.formData.status.id = 1;
                //                 }

                $scope.moduleCodeData = res.response.moduleCodeData;

                //employee type list
                moduleTracker.updateRecordName(res.response.emp_details.first_name + ' ' + res.response.emp_details.last_name);
                $scope.employee_type_list = res.response.emp_type_list;
                // if ($scope.user_type == 1)
                //     $scope.employee_type_list.push({ 'id': '-1', 'name': '++ Add New ++' });

                //employee inactive type list
                $scope.inactivity_types = res.response.emp_inactive_type;
                //$scope.inactivity_types.push({ 'id': '999', 'name': 'Left the Company' });


                //employee leaving reasons
                $scope.resign_type = res.response.emp_leaving_reasons;
                // $scope.resign_type.push({ 'id': '-1', 'name': '++ Add New ++' });



                // get working hours
                //$scope.formData.workingHours = res.response.emp_details.working_hours;

                //get department list
                $scope.dept_list = res.response.emp_all_hr_depts;
                // if ($scope.user_type == 1) $scope.dept_list.push({ 'id': '-1', 'name': '++ Add New ++' });


                //get religions list
                $scope.religion_list = res.response.emp_religion_list;
                // if ($scope.user_type == 1) {
                //     $scope.religion_list.push({ 'id': '-1', 'name': '++ Add New ++' });
                // }

                //get allow Login
                //$scope.formData.allow_login = res.response.emp_details.allow_login == "1" ? true:false;

                //get territories
                //$scope.all_territories = res.response.all_territories.response;

                //get all HR Roles
                $scope.all_roles = res.response.all_roles;


                // get status
                if (!$stateParams.id) {
                    $scope.formData.status = $scope.status_data[0];
                }


                //get all employee listing
                $scope.all_employees = res.response.emp_listings.response;
                $scope.lineManagerShowCols = [
                    "Employee No.", "name", "Email", "Department", "job_title"
                ]
                // $scope.all_employees.forEach(function (v, i) {
                //     delete v.Email;
                //     delete v["internal_ext."];
                //     delete v.Telephone;
                //     delete v.Mobile;
                //     delete v.employee_type;
                //     delete v.Allow_login;
                //     delete v.status;
                //     //delete v.job_title;
                //     v["Job Title"] = v.job_title;
                //     delete v.job_title;

                //     if ($stateParams.id && $stateParams.id == v.id) { // this will remove the employee himself from the list of line managers
                //         $scope.all_employees.splice(i, 1);
                //     }
                // });

                // get View Buckets
                $scope.viewBuckets = res.response.viewBuckets;

                // get last status history
                $scope.last_status_history = res.response.emp_last_status_history;

                if ($scope.recnew != 0) {
                    if (res.response.emp_details.length != 0)
                        $scope.formData = res.response.emp_details;

                    $scope.formData.approvalProcess = 0;


                    // get assigned View Buckets
                    // $scope.formData.buckets = [];
                    // angular.forEach(res.response.emp_get_buckets, function (obj) {
                    //     $scope.formData.buckets.push(obj.bucket_id);
                    // })
                    // $scope.formData.buckets = $scope.formData.buckets.join(",")
                    $scope.formData.buckets = res.response.emp_get_buckets;

                    // get working hours
                    $scope.formData.working_hours = Number(res.response.emp_details.working_hours);
                    $scope.formData.bonus = Number(res.response.emp_details.bonus);

                    // job status
                    angular.forEach($scope.jobStatuses, function (obj) {
                        if (obj.id == res.response.emp_details.job_status_id)
                            $scope.formData.job_status = obj;
                    });

                    // get selected departments
                    $scope.formData.department = res.response.selected_dept;

                    //get role to employee
                    $scope.formData.roles = res.response.emp_get_role;

                    //get employee details
                    $scope.$root.model_code = res.response.emp_details.first_name + ' ' + res.response.emp_details.last_name + '( ' + res.response.emp_details.user_code + ' )';
                    $scope.module_code = $scope.$root.model_code;

                    // get gender
                    //$scope.formData.emp_gender = parseInt(res.response.emp_details.emp_gender);
                    angular.forEach($scope.gender_type, function (obj) {
                        if (obj.value == res.response.emp_details.emp_gender_id)
                            $scope.formData.emp_gender = obj;
                    });
                    // get marital status
                    angular.forEach($scope.mar_status, function (obj) {
                        if (obj.value == res.response.emp_details.mar_status_id)
                            $scope.formData.mar_status = obj;
                    });
                    // get line manager
                    $scope.formData.line_manager_name = res.response.emp_details.line_manager_name;
                    $scope.formData.line_manager_name_id = res.response.emp_details.line_manager_name_id;
                    $scope.sel_linemanger_tooltip = res.response.emp_details.line_manager_name;

                    //get default currency
                    $scope.currency_list = $rootScope.arr_currency;
                    angular.forEach($rootScope.arr_currency, function (obj, index) {
                        if (obj.id == $scope.$root.defaultCurrency) {
                            // console.log(obj.id + "currency default");
                            $scope.formData.salary_currency = $rootScope.arr_currency[index];
                        }
                    });

                    // get Sales Target if any
                    // $scope.salesTarget = res.response.salesTarget.response;


                    $scope.$root.breadcrumbs.push(
                        { 'name': $scope.$root.model_code, 'url': '#', 'isActive': false }
                    );

                    if (res.response.emp_details.emp_picture)
                        $scope.$root.$broadcast("get_single_image_edit", res.response.emp_details.emp_picture);

                    //expense images settings.

                    /* if (res.response.emp_details.emp_picture)
                     $scope.$root.$broadcast("get_expense_image_edit", res.response.emp_details.emp_picture);*/


                    if (res.response.emp_details.case_date == 0)
                        $scope.formData.case_date = null;
                    else
                        $scope.formData.case_date = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.case_date);


                    if (res.response.emp_details.status_date == 0)
                        $scope.formData.status_date = null;
                    else
                        $scope.formData.status_date = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.status_date);

                    if (res.response.emp_details.status_inactive_date == 0)
                        $scope.formData.status_inactive_date = null;
                    else
                        $scope.formData.status_inactive_date = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.status_inactive_date);

                    if (res.response.emp_details.start_date == 0)
                        $scope.formData.start_date = null;
                    else
                        $scope.formData.start_date = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.start_date);
                    if (res.response.emp_details.leave_date == 0)
                        $scope.formData.leave_date = null;
                    else
                        $scope.formData.leave_date = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.leave_date);
                    if (res.response.emp_details.date_of_birth == 0)
                        $scope.formData.date_of_birth = null;
                    else
                        $scope.formData.date_of_birth = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.date_of_birth);
                    if (res.response.emp_details.salary_date == 0)
                        $scope.formData.salary_date = null;
                    else
                        $scope.formData.salary_date = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.salary_date);
                    if (res.response.emp_details.salary_date_review == 0)
                        $scope.formData.salary_date_review = null;
                    else $scope.formData.salary_date_review = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.salary_date_review);

                    if (res.response.emp_details.car_date_assign == 0)
                        $scope.formData.car_date_assign = null;
                    else
                        $scope.formData.car_date_assign = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.car_date_assign);

                    if (res.response.emp_details.laptop_date_assign == 0)
                        $scope.formData.laptop_date_assign = null;
                    else $scope.formData.laptop_date_assign = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.laptop_date_assign);

                    if (res.response.emp_details.mobile_date_assign == 0)
                        $scope.formData.mobile_date_assign = null;
                    else
                        $scope.formData.mobile_date_assign = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.mobile_date_assign);

                    if (res.response.emp_details.car_date_return == 0)
                        $scope.formData.car_date_return = null;
                    else
                        $scope.formData.car_date_return = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.car_date_return);

                    if (res.response.emp_details.laptop_return_date_assign == 0)
                        $scope.formData.laptop_return_date_assign = null;
                    else
                        $scope.formData.laptop_return_date_assign = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.laptop_return_date_assign);

                    if (res.response.emp_details.mobile_return_date_assign == 0)
                        $scope.formData.mobile_return_date_assign = null;
                    else
                        $scope.formData.mobile_return_date_assign = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.mobile_return_date_assign);

                    if (res.response.emp_details.er_start_date == 0)
                        $scope.formData.er_start_date = null;
                    else
                        $scope.formData.er_start_date = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.er_start_date);

                    if (res.response.emp_details.er_end_date == 0)
                        $scope.formData.er_end_date = null;
                    else
                        $scope.formData.er_end_date = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.er_end_date);
                    if (res.response.emp_details.er_change_date == 0)
                        $scope.formData.er_change_date = null;
                    else
                        $scope.formData.er_change_date = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.er_change_date);
                    if (res.response.emp_details.ee_start_date == 0)
                        $scope.formData.ee_start_date = null;
                    else
                        $scope.formData.ee_start_date = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.ee_start_date);

                    if (res.response.emp_details.ee_change_date == 0)
                        $scope.formData.ee_change_date = null;
                    else
                        $scope.formData.ee_change_date = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.ee_change_date);
                    if (res.response.emp_details.ee_end_date == 0)
                        $scope.formData.ee_end_date = null;
                    else
                        $scope.formData.ee_end_date = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.ee_end_date);

                    if (res.response.emp_details.tablet_date_assign == 0)
                        $scope.formData.tablet_date_assign = null;
                    else
                        $scope.formData.tablet_date_assign = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.tablet_date_assign);

                    if (res.response.emp_details.tablet_return_date_assign == 0) $scope.formData.tablet_return_date_assign = null;
                    else $scope.formData.tablet_return_date_assign = $scope.$root.convert_unix_date_to_angular(res.response.emp_details.tablet_return_date_assign);

                    if (res.response.emp_details.company_car == 22) $scope.car_list_detail = true;
                    else $scope.car_list_detail = false;


                    $scope.formData.piid = res.response.emp_details.piid;
                    // $scope.formData.user_ids = res.response.emp_details.user_type;
                    // $scope.formData.statuss = res.response.emp_details.status;

                    if (res.response.emp_details.company_laptop_model == 22) $scope.laptop_list_detail = true;
                    else $scope.laptop_list_detail = false;

                    if (res.response.emp_details.company_mobile_model == 22) $scope.mobile_list_detail = true;
                    else $scope.mobile_list_detail = false;


                    if (res.response.emp_details.tablet_status_id == 22) $scope.tablit_list_detail = true;
                    else $scope.tablit_list_detail = false;


                    // if (res.response.emp_details.other_benifits != 1 || res.response.emp_details.other_benifits != 2) $scope.formData.other_benifits = 1;


                    if ((res.response.emp_details.case_date != 0) && (res.response.emp_details.cause_of_inactivity != 0))
                        $scope.is_case_date = true;

                    if ((res.response.emp_details.status_date != 0) && (res.response.emp_details.status == 1)) $scope.is_status = true;

                    if (res.response.emp_details.other_leave != 0) $scope.is_leave_other = true;

                    if ((res.response.emp_details.other_case != 0) && (res.response.emp_details.cause_of_inactivity == 4)) $scope.is_case_no = true;

                    if (res.response.emp_details.other_ethinic != 0) $scope.is_ethinic = true;
                    // console.log(res.response.emp_details.status);
                    //if ((res.response.emp_details.status == 2))     $scope.is_cause_data = true;
                    if ((res.response.emp_details.status != 1)) $scope.is_cause_data = true;


                    $scope.formData.work_email = res.response.emp_details.user_email;

                    //codemark2
                    //$timeout(function () {
                    // angular.forEach($scope.dept_list, function (obj, index) {
                    //     if (obj.id == res.response.emp_details.department) $scope.selected_dept_list.push(obj);
                    // });


                    angular.forEach($scope.employee_type_list, function (obj, index) {
                        if (obj.id == res.response.emp_details.employee_type) $scope.formData.employee_type = obj;
                    });
                    /*console.log($scope.user_types);
                     console.log(res.response.emp_details.user_type);*/
                    var isValid = 0;
                    angular.forEach($scope.user_types, function (obj, index) {
                        if (obj.value == res.response.emp_details.user_type) {
                            isValid = 1;
                            $scope.formData.user_id = obj;
                        }
                    });
                    if (!isValid)
                        $scope.formData.user_id = 1;
                    /* $.each($scope.login_allow, function (index, obj) {
                     if (obj.value == res.response.emp_details.allow_login)   $scope.formData.allow_login = obj;
                     });*/


                    //post_code_country
                    angular.forEach($scope.country_type_arr, function (obj, index) {
                        if (res.response.emp_details.post_code_country != undefined && res.response.emp_details.post_code_country != "") {
                            if (obj.id == res.response.emp_details.post_code_country)
                                $scope.formData.post_code_country = obj;
                        }
                        else {

                            if (obj.id == $scope.$root.defaultCountry)
                                $scope.formData.post_code_country = obj;
                        }

                    });

                    // get salary type

                    // angular.forEach($scope.salary_type_list_final_two, function (obj, index) {
                    //     if (obj.id == res.response.emp_details.salary_type) {
                    //         $scope.formData.salary_type = obj.id;
                    //     }
                    // });
                    //salary currency selection

                    if (res.response.emp_details.salary_currency_id > 0) {

                        angular.forEach($rootScope.arr_currency, function (obj, index) {
                            if (obj.id == res.response.emp_details.salary_currency_id) {
                                $scope.formData.salary_currency = obj;
                            }
                        });

                    } else {

                        angular.forEach($rootScope.arr_currency, function (obj, index) {
                            if (obj.id == $scope.$root.defaultCurrency) {
                                $scope.formData.salary_currency = obj;
                            }
                        });
                    }
                    angular.forEach($scope.status_data, function (obj, index) {
                        if (obj.id == res.response.emp_details.status)
                            $scope.formData.status = obj;
                    });

                    // console.log(res.response.emp_details.status.id);

                    /*if (res.response.emp_details.status.id == 0) {
    
                     }*/

                    if (res.response.emp_details.status.id != 1) {
                        $scope.is_cause_data = true;
                    } else {
                        //$scope.chk_for_active_status();
                    }

                    // select cause of inactivities
                    if (res.response.emp_details.cause_of_inactivity == "0")
                        res.response.emp_details.cause_of_inactivity = null;
                    angular.forEach($scope.inactivity_types, function (obj, index) {
                        if (obj.id == res.response.emp_details.cause_of_inactivity)
                            $scope.formData.cause_of_inactivity = obj.id;
                    });


                    /*$.each($scope.laptop_status, function (index, obj) {
                     if (obj.value == res.response.emp_details.company_laptop_model) {
                     $scope.formData.company_laptop_model = $scope.laptop_status[index];
                     }
                     });*/
                    /*$.each($scope.car_status, function (index, obj) {
                     if (obj.value == res.response.emp_details.company_car) {
                     $scope.formData.company_car = $scope.car_status[index];
                     }
                     });*/

                    /* $.each($scope.fuel_cost_deduction_array, function (index, obj) {
                     if (obj.value == res.response.emp_details.fuel_cost_deduction) {
                     $scope.formData.fuel_cost_deduction = $scope.fuel_cost_deduction_array[index];
                     }
                     });*/

                    /*$.each($scope.mobile_status, function (index, obj) {
                     if (obj.value == res.response.emp_details.company_mobile_model) {
                     $scope.formData.company_mobile_model = $scope.mobile_status[index];
                     }
                     });*/
                    /*$.each($scope.fuel_status, function (index, obj) {
                     if (obj.value == res.response.emp_details.car_fuel_card) {
                     $scope.formData.car_fuel_card = $scope.fuel_status[index];
                     $scope.show_fuel_card_num = true;
                     }
                     });*/
                    /*$.each($scope.tablet_status, function (index, obj) {
                     if (obj.value == res.response.emp_details.tablet_status_id) {
                     $scope.formData.tablet_status_id = $scope.tablet_status[index];
                     }
                     });*/
                    if ($scope.formData.employee_type !== undefined && $scope.formData.employee_type != null && $scope.formData.employee_type.id == 2) {
                        $scope.$root.salary_type_one = true;

                        angular.forEach($scope.salary_type_list_final_one, function (obj, index) {
                            if (obj.value == res.response.emp_details.salary_type) {
                                $scope.formData.salary_type = $scope.salary_type_list_final_one[index];
                            }
                        });
                    } else {
                        $scope.$root.salary_type_two = true;
                        angular.forEach($scope.salary_type_list_final_two, function (obj, index) {
                            if (obj.value == res.response.emp_details.salary_type) {
                                $scope.formData.salary_type = $scope.salary_type_list_final_two[index].value;
                            }
                        });
                    }

                    angular.forEach($scope.entitle_holiday_option, function (obj, index) {
                        if (obj.value == res.response.emp_details.entitle_holiday_opti) {
                            $scope.entitled_label = obj.label;
                            $scope.formData.entitle_holiday_opti = $scope.entitle_holiday_option[index];
                        }
                    });

                    $scope.formData.entitle_holiday_opti = $scope.entitle_holiday_option[0];

                    $scope.entitled = res.response.emp_details.entitle_holiday;
                    $scope.formData.annual_allownce = res.response.emp_details.entitle_holiday + " " + $scope.entitled_label;

                    angular.forEach($scope.arr_car_fuel_type, function (obj, index) {
                        if (obj.value == res.response.emp_details.car_fuel_type) {
                            $scope.formData.car_fuel_type = obj.value;
                            //$scope.formData.car_fuel_type2 = obj.label;
                        }

                    });
                    angular.forEach($scope.arr_car_enngine, function (obj, index) {
                        if (obj.value == res.response.emp_details.car_enngine) {
                            $scope.formData.car_enngine = obj.value;
                            $scope.formData.car_enngine2 = obj.label;
                        }

                    });

                    angular.forEach($scope.arr_type_benefit, function (obj, index) {
                        if (res.response.emp_details.other_benifits != null)
                            if (obj.id == res.response.emp_details.other_benifits.id) $scope.formData.other_benifits = obj;

                    });
                    /*$.each($scope.car_status, function (index, obj) {
                     if (obj.value == res.response.emp_details.company_car) {
                     $scope.formData.company_car = obj;
                     }
                     });
                     if (res.response.emp_details.company_car != 22)    $scope.formData.other_benifits = 1;*/
                    //$scope.formData.company_car = res.response.emp_details.company_car;


                    angular.forEach($scope.resign_type, function (obj, index) {
                        if (obj.id == res.response.emp_details.reason_of_leaving)
                            $scope.formData.reason_of_leaving = obj;

                    });

                    angular.forEach($scope.religion_list, function (obj, index) {
                        if (obj.id == res.response.emp_details.religion) $scope.formData.religion = obj;

                    });

                    angular.forEach($scope.options, function (obj) {
                        if (obj.id == res.response.emp_details.ethical_origin)
                            $scope.formData.ethical_origin = obj;//$scope.options[index];
                    });

                    //$scope.getAssignRoles(1);
                    //$scope.getRoles_edit($stateParams.id);

                    //$scope.getSalePersons(1);
                    //$scope.getSalePersons_edit(res.response.emp_details.id);

                    $scope.formData.bank_account_collapse = "";
                    //console.log($scope.formData.hr_account_name);
                    // console.log(res.response.emp_details.hr_account_name);

                    if ($scope.formData.hr_account_name != "") {
                        $scope.formData.bank_account_collapse = "in";
                    }


                    //}, 3000);

                    $scope.empAccountData = $scope.formData;




                    $scope.showLoader = false;
                }
            }
        });

    // $scope.$watch("selected_dept_list", function () {
    //     debugger
    //     $scope.formData.department = '';
    //     for (var i = 0; i < $scope.selected_dept_list.length; i++) {
    //         $scope.formData.department += $scope.selected_dept_list[i].id;
    //     }
    // },true)


    if ($stateParams.id > 0) $scope.check_hrvalues_readonly = true;


    $scope.showEditForm = function () {
        $scope.check_hrvalues_readonly = false;
    }
    $scope.showReadonlyForm = function () {
        $scope.check_hrvalues_readonly = true;
    }
    $scope.showExpenseEditForm = function () {
        $scope.check_expense_form_readonly = false;
    }



    //open Direct Holiday expense and fuel deduction module Tab

    angular.element('.holidays').removeClass('dont-click');
    if ($stateParams.tab != undefined && $stateParams.tab == 'holidays') angular.element('.holidays a').click();

    angular.element('.expenses').removeClass('dont-click');
    if ($stateParams.tab != undefined && $stateParams.tab == 'expenses') angular.element('.expenses a').click();

    angular.element('.deduction').removeClass('dont-click');
    if ($stateParams.tab != undefined && $stateParams.tab == 'deduction') angular.element('.deduction a').click();


    $scope.formData.holiday_num_days = "";

    $scope.get_num_of_days = function (ck_startDate, ck_end_date) {

        var from = $("#" + ck_startDate).val().split("/")[2] + "-" + $("#" + ck_startDate).val().split("/")[1] + "-" + $("#" + ck_startDate).val().split("/")[0];

        var to = $("#" + ck_end_date).val().split("/")[2] + "-" + $("#" + ck_end_date).val().split("/")[1] + "-" + $("#" + ck_end_date).val().split("/")[0];

        if (from != null && to != null) {

            var from1 = new Date(from.replace(/\s/g, ''));
            var to1 = new Date(to.replace(/\s/g, ''));

            //console.log(from1); console.log(to1);

            var timeDiff = Math.abs(to1.getTime() - from1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            var num_of_days = diffDays + 1;

            $scope.formData.holiday_num_days = num_of_days;
        }
    }


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
    };

    $scope.formData.showprev_code = false;

    $scope.hideShowPrevcode = function () {

        if ($scope.formData.showprev_code == true) $scope.formData.showprev_code = false;
        else $scope.formData.showprev_code = true;
    }

    /* $scope.arr_car_enngine = [];
    $scope.arr_car_enngine = [
        { 'label': '1400cc or less', 'value': 1 },
        { 'label': '1401cc to 2000cc', 'value': 2 },
        { 'label': 'Over 2000cc', 'value': 3 }
    ]; */

    $scope.arr_vehicle_rate = [];
    $scope.arr_vehicle_rate = [{ name: 'Car & Van', id: '0.45' }, { name: 'Motorcycle', id: '0.24' }
        , { name: 'Bicycle', id: '0.20' }];
    $scope.arr_vehicle_expense = [];
    $scope.arr_vehicle_expense = [{ 'name': 'Personal Vehicle', 'id': 1 }, { 'name': 'Company Vehicle', 'id': 2 }];
    $scope.roless = [];
    $scope.module_list = [];
    $scope.role_list = [];
    $scope.status_data = [{ id: "1", title: "Active" }, { id: "0", title: "Inactive" }];

    // if ($scope.status_data === 'undefined' || $scope.status_data === null || $scope.status_data.length == 0) {
    //     $rootScope.get_status_list('hr_status');
    //     $scope.status_data = $rootScope.status_list;
    // }

    //$scope.status_data= $rootScope.remove_dupciation_in_array($scope.status_data);
    //if ($stateParams.id === undefined)    $scope.formData.status = $scope.status_data[0];

    if ($stateParams.id === undefined) {
        /*$.each($scope.status_data, function (index, obj) {
         // console.log(obj);
         if (obj.id == 1)
         $scope.formData.status = obj;
         });*/
        $scope.formData.status = $scope.status_data[0];
    }


    $scope.formData.holiday_id = '';
    $scope.holiday_id = '';
    // $scope.datePicker = Calendar.get_caledar();

    var Url_curency = $scope.$root.setup + "general/currency-list";

    $scope.onChangeethinictype = function () {

        var e_id = document.getElementById('case_ethnic').value;
        // console.log(e_id);
        //var e_id = this.formData.case_ethnic.value; 

        //     if (jQuery.inArray(e_id, names))  
        if (e_id == 2 || e_id == 6 || e_id == 10 || e_id == 13 || e_id == 15)
            $scope.is_ethinic = true;
        else $scope.is_ethinic = false;
    }


    $scope.onChangeResigntype = function () {
        //var owner_id = this.formData.reason_of_leaving.value;
        var leave_reason_id = this.formData.reason_of_leaving.id;
        //console.log(owner_id );

        if (leave_reason_id == -1) {

            angular.element('#model_emp_leaving_reason').modal({ show: true });
            //  console.log("here");
        }

        if (leave_reason_id != 5) $scope.is_leave_other = false;
        else $scope.is_leave_other = true;

    }


    /* $scope.change_engine_sizes = function (fuel_type, index) {
        console.log(fuel_type);
        $scope.arr_company_expense[index].arr_car_enngine = [];
        if (fuel_type == 1)
        {
            $scope.arr_company_expense[index].arr_car_enngine = [
                { 'label': '1400cc or less', 'value': 1, 'type': 1 },
                { 'label': '1401cc to 2000cc', 'value': 2, 'type': 1 },
                { 'label': 'Over 2000cc', 'value': 3, 'type': 1 }];
        }
        else if (fuel_type == 2)
        {         
            $scope.arr_company_expense[index].arr_car_enngine = [
                { 'label': '1400cc or less', 'value': 7, 'type': 2 },
                { 'label': '1401cc to 2000cc', 'value': 8, 'type': 2 },
                { 'label': 'Over 2000cc', 'value': 9, 'type': 2 }];
        }
        else if (fuel_type == 3)
        {
            $scope.arr_company_expense[index].arr_car_enngine = [
                { 'label': '1600cc or less', 'value': 4, 'type': 3 },
                { 'label': '1601cc to 2000cc', 'value': 5, 'type': 3 },
                { 'label': 'Over 2000cc', 'value': 6, 'type': 3 }];
        }

    }
    */


    //--------------------   Inactivity type Selection and Addition  start--------------------

    /* Commenting this code as I believe this isn't being used anywhere. Ahmad Hassan
       $scope.add_inactivity_type = function (formData3) {
   
           $scope.formData3.token = $scope.$root.token;
           $scope.formData3.data = $scope.formFields;
   
   
           var submit_inactive_types_url = $scope.$root.hr + "hr_values/submit-emp-inactive-type-form";
   
           $http
               .post(submit_inactive_types_url, $scope.formData3)
               .then(function (res) {
                   if (res.data.ack == true) {
                       toaster.pop('success', 'Add', 'Record Successfully Insert!');
                       //  $scope.show_emp_type = false;
                       $('#model_inactivity').modal('hide');
   
   
                       var emp_leave_types_Url = $scope.$root.hr + "hr_values/get-employee-inactive-type";
                       $http
                           .post(emp_leave_types_Url, { 'token': $scope.$root.token })
                           .then(function (res) {
                               if (res.data.ack == true) {
                                   $scope.leave_types = res.data.response;
   
                                   angular.forEach($scope.leave_types, function (elem, index) {
   
                                       //console.log(elem.name == $scope.formData3.name);
                                       if (elem.name == $scope.formData3.name)
                                           $scope.formData.cause_of_inactivity = elem;
                                   });
                               }
   
                               // $scope.leave_types.push({ 'id': '-1', 'name': '++ Add New ++' });
                           });
   
                   } else
                       toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(107));
   
               });
       };
   
       */

    //--------------------   leaving reason Selection and Addition  start--------------------

    /* Commenting this code as I believe this isn't being used anywhere. Ahmad Hassan
        $scope.add_leaving_reason = function (formData4) {
    
            $scope.formData4.token = $scope.$root.token;
            $scope.formData4.data = $scope.formFields;
    
            var submit_inactive_types_url = $scope.$root.hr + "hr_values/submit-emp-leaving-reason-form";
    
            $http
                .post(submit_inactive_types_url, $scope.formData4)
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Add', 'Record Successfully Insert!');
                        //  $scope.show_emp_type = false;
                        $('#model_emp_leaving_reason').modal('hide');
    
                        var emp_resign_type_Url = $scope.$root.hr + "hr_values/get-employee-leaving-reasons";
                        $http
                            .post(emp_resign_type_Url, { 'token': $scope.$root.token })
                            .then(function (res) {
    
                                if (res.data.ack == true) {
                                    $scope.resign_type = res.data.response;
    
                                    angular.forEach($scope.resign_type, function (elem, index) {
    
                                        //console.log(elem.name == $scope.formData3.name);
                                        if (elem.name == $scope.formData4.name)
                                            $scope.formData.reason_of_leaving = elem;
                                    });
    
                                    // if ($scope.user_type == 1)
                                    //     $scope.leave_types.push({ 'id': '-1', 'name': '++ Add New ++' });
                                }
                            });
    
                    } else
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(107));
    
                });
        };
    
        */


    $scope.onChangeCasetype = function () {
        //	var oCase_id = this.formData.cause_of_inactivity.value;
        //var oCase_id = document.getElementById('cause_of_inactivity').value;

        var oCase_id = $scope.formData.cause_of_inactivity.id;
        // console.log(oCase_id);

        if (oCase_id == -1) {
            $('#model_inactivity').modal({
                show: true
            });
        }

        if (oCase_id != null) {
            if (oCase_id == 4) $scope.is_case_no = true;
            else $scope.is_case_no = false;

            $scope.is_case_date = true;
        } else {
            $scope.is_case_no = false;
            $scope.is_case_date = false;
        }

    }
    //--------------------   Inactivity type Selection and Addition  end--------------------

    $scope.is_cause_data = false;
    $scope.is_active_cause_data = false;


    $scope.onChangestatustype = function () {
        var st_id = this.formData.status.id;
        //console.log(st_id);


        //if (st_id == 0)
        if (st_id != 1)
            $scope.is_cause_data = true;
        else $scope.is_cause_data = false;

        if (st_id == 1) {
            //codemark status history
            if (last_status_history.total == 1) {

                if (last_status_history.status_name != null) {
                    var status_name = last_status_history.status_name;
                    //  console.log(status_name);

                    if (status_name != 1) $scope.is_active_cause_data = true;
                    else $scope.is_active_cause_data = false;
                }
            }

            // var emp_last_status_Url = $scope.$root.hr + "hr_values/employee-last-status-history";

            // var postData = {
            //     'token': $scope.$root.token,
            //     'company_id': $scope.$root.defaultCompany,
            //     'employee_id': $stateParams.id
            // };

            // $http
            //     .post(emp_last_status_Url, postData)
            //     .then(function (res) {
            //         // console.log(res);

            //         if (res.data.total == 1) {

            //             if (res.data.status_name != null) {
            //                 var status_name = res.data.status_name;
            //                 //  console.log(status_name);

            //                 if (status_name != 1) $scope.is_active_cause_data = true;
            //                 else $scope.is_active_cause_data = false;
            //             }
            //         }
            //     });
        }

        $scope.is_status = false;
        if (st_id == 1)
            $scope.is_status = true;


    }

    $scope.chk_for_active_status = function () {
        console.log("checking active status");
        var emp_last_status_Url = $scope.$root.hr + "hr_values/employee-last-status-history";

        var postData = {
            'token': $scope.$root.token,
            'company_id': $scope.$root.defaultCompany,
            'employee_id': $stateParams.id,
            'rec_sec': 'sec'
        };

        if ($scope.last_status_history.status_name != null) {
            var status_name = $scope.last_status_history.status_name;
            //console.log(status_name);

            if (status_name != 1) $scope.is_active_cause_data = true;
            else $scope.is_active_cause_data = false;
        }

        // $http
        //     .post(emp_last_status_Url, postData)
        //     .then(function (res) {
        //         //console.log(res);

        //         if (res.data.ack == true) {

        //             if (res.data.status_name != null) {
        //                 var status_name = res.data.status_name;
        //                 //console.log(status_name);

        //                 if (status_name != 1) $scope.is_active_cause_data = true;
        //                 else $scope.is_active_cause_data = false;
        //             }

        //         }
        //     });
    }

    $scope.onChangecar_list = function () {
        //  var crr_id = this.formData.company_car.value;
        var crr_id = this.formData.company_car;
        /*console.log(crr_id);
         console.log(this.formData.company_car);
         console.log($scope.formData.company_car);*/

        if (crr_id != 22) {

            $scope.car_list_detail = false;

            $scope.formData.company_car_make = "";
            $scope.formData.car_model = "";
            $scope.formData.car_vin = "";
            $scope.formData.car_emisions = "";
            $scope.formData.car_marked_value = "";
            $scope.formData.car_enngine = "";
            $scope.formData.car_fuel_type = "";
            $scope.formData.car_date_assign = "";
            $scope.formData.car_date_return = "";
            $scope.formData.car_fuel_card = "";

        } else {
            $scope.car_list_detail = true;
        }
    }

    $scope.show_fuel_card_num = false;

    $scope.onChangefuel_card = function () {

        //var fuel_card_id = this.formData.car_fuel_card.value;
        var fuel_card_id = this.formData.car_fuel_card;
        //console.log(fuel_card_id);

        if (fuel_card_id == 22) $scope.show_fuel_card_num = true;
        else {
            $scope.show_fuel_card_num = false;
            $scope.formData.car_fuel_card_num = "";
        }
    }

    /*if (res.data.response.company_laptop_model == 22)   $scope.laptop_list_detail = true;
     else   $scope.laptop_list_detail = false;

     if (res.data.response.company_mobile_model == 22)     $scope.mobile_list_detail = true;
     else    $scope.mobile_list_detail = false;


     if (res.data.response.tablet_status_id == 22)      $scope.tablit_list_detail = true;
     else        $scope.tablit_list_detail = false;


     if (res.data.response.other_benifits != 1 || res.data.response.other_benifits != 2)    $scope.formData.other_benifits = 1;

     if ((res.data.response.case_date != 0) && (res.data.response.cause_of_inactivity != 0))
     $scope.is_case_date = true;*/

    $scope.onChange_laptop_list = function () {
        // var lap_id = this.formData.company_laptop_model.value;
        var lap_id = this.formData.company_laptop_model;

        //console.log(lap_id);

        if (lap_id != 22) {
            $scope.laptop_list_detail = false;

            $scope.formData.laptop_make = "";
            $scope.formData.laptop_model = "";
            $scope.formData.company_laptop_serial = "";
            $scope.formData.laptop_date_assign = "";
            $scope.formData.laptop_return_date_assign = "";
        }
        else
            $scope.laptop_list_detail = true;

    }

    $scope.onChange_mobile_list = function () {
        //  var m_id = this.formData.company_mobile_model.value;
        var m_id = this.formData.company_mobile_model;
        //console.log(crr_id); 
        if (m_id != 22) {
            $scope.mobile_list_detail = false;

            $scope.formData.mobile_make = "";
            $scope.formData.mobile_model = "";
            $scope.formData.company_mobile_serial = "";
            $scope.formData.mobile_date_assign = "";
            $scope.formData.mobile_return_date_assign = "";
        }

        else $scope.mobile_list_detail = true;

    }

    $scope.onChange_tablet_list = function () {

        // var tb_id = this.formData.tablet_status_id.value;
        var tb_id = this.formData.tablet_status_id;

        if (tb_id != 22) {
            $scope.tablit_list_detail = false;

            $scope.formData.tablet_make = "";
            $scope.formData.tablet_model = "";
            $scope.formData.company_tablet_serial = "";
            $scope.formData.tablet_date_assign = "";
            $scope.formData.tablet_return_date_assign = "";
        }
        else
            $scope.tablit_list_detail = true;


    }


    $scope.deletehrvalues = function () {
        var delUrl = $scope.$root.hr + "hr_values/delete_hr_values";
        var deleteHRValuePostData = {
            token: $scope.$root.token,
            id: $stateParams.id
        }
        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delUrl, deleteHRValuePostData)
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $timeout(function () {
                            $state.go('app.hr_listing');
                        }, 1000);

                    } else {
                        toaster.pop('error', 'Error', res.data.error);
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };


    /*$scope.rec = {};  
     var postUrl = $scope.$root.hr+"hr-tabs";
     var postData = {
     'token': $scope.$root.token,
     'all': 1
     };

     $http
     .post(postUrl, postData)
     .then(function (res) {
     if(res.data.ack == true){
     $scope.rec = res.data.response;
     }
     });*/

    /* var vm = this;
     vm.Total = 0;
     var vmm = this;
     vmm.total_sub = 0;*/

    /*	varUrl_curency = $scope.$root.hr+"hr_values/get_company_base_currency"; 
     $http
     .post(postUrl_curency, {'token':$scope.$root.token})
     .then(function (res) {
     if(res.data.ack == true){  
     //$scope.base_currency_name  = res.data.response.code;  
     $scope.base_currency  = res.data.response.code;  
     //console.log($scope.base_currency);
     }   		 //else toaster.pop('error', 'Error', "No countries found!");
     }); */


    $scope.product_type = true;
    $scope.count_result = 0;
    // $scope.getCode = function (rec) {


    //     // var getCrmCodeUrl = $scope.$root.hr + "hr_values/get-code";
    //     var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
    //     var name = $scope.$root.base64_encode('employees');
    //     var no = $scope.$root.base64_encode('user_no');

    //     var module_category_id = 2;
    //     /*if( $scope.formData.brand_ids != 0)  module_category_id=1;
    //      if( $scope.formData.brand_ids == 0)
    //      {
    //      if( $scope.formData.category_ids != 0) module_category_id=3;
    //      }*/

    //     $http
    //         .post(getCodeUrl, {
    //             'is_increment': 1,
    //             'token': $scope.$root.token,
    //             'tb': name,
    //             'm_id': 54,
    //             'no': no,
    //             'category': $scope.formData.category_ids,
    //             'brand': $scope.formData.brand_ids,
    //             'module_category_id': module_category_id
    //         })
    //         .then(function (res) {
    //             if (res.data.ack == 1) {
    //                 $scope.formData.user_code = res.data.code;
    //                 $scope.formData.user_no = res.data.nubmer;

    //                 $scope.formData.code_type = module_category_id;//res.data.code_type;
    //                 $scope.count_result++;

    //                 if (res.data.type == 1) {
    //                     $scope.product_type = false;
    //                 }
    //                 else {
    //                     $scope.product_type = true;
    //                 }

    //                 if ($scope.count_result > 0) {
    //                     // console.log($scope.count_result);
    //                     return true;
    //                 }
    //                 else {
    //                     console.log($scope.count_result + 'd');
    //                     return false;
    //                 }

    //             }
    //             else {
    //                 toaster.pop('error', 'info', res.data.error);
    //                 return false;
    //             }
    //         });
    // }


    $scope.showLoader = true;


    $scope.emp_full_name = '';

    $scope.total_final = {};
    $scope.total_sub = {};
    $scope.total_sub = 0;
    $scope.total_final = 0;
    $scope.image_path = '1878331758.png';


    // ---------  General Tab	 -----------------------



    $scope.updatePreferredName = function () {
        if ($scope.formData.known_as == "" || typeof $scope.formData.known_as == "undefined") {
            $scope.formData.known_as = $scope.formData.first_name;
        }
    }


    $scope.gender_type = {};
    $scope.user_types = [{ 'label': 'Administrator', 'value': 2 }, { 'label': 'User', 'value': 3 }];//, {'label': 'Normal User', 'value': 3}
    //if ($scope.user_type == 1) $scope.user_types.push({ 'label': 'Administrator', 'value': '1' });


    $scope.login_allow = [{ 'label': 'Yes', 'value': 1 }, { 'label': 'No', 'value': 0 }];


    /* $scope.leave_types = [{'label': 'Long Term Sickness Leave', 'value': 1}, {'label': 'Maternity Leave', 'value': 2},
     {'label': 'Garden Leave', 'value': 3}, {'label': 'Paternity Leave', 'value': 4}, {
     'label': 'Other',
     'value': 5
     }];

     $scope.resign_type = [{'label': 'Resigned', 'value': 1}, {'label': 'Redundent', 'value': 2},
     {'label': 'Poor Performance', 'value': 3}, {'label': 'Disclipenary Action', 'value': 4}, {
     'label': 'Other',
     'value': 5
     }];*/


    $scope.car_status = [{ 'label': 'Yes', 'value': 22 }, { 'label': 'No', 'value': 33 }];
    $scope.fuel_cost_deduction_array = [{ 'label': 'Yes', 'value': 22 }, { 'label': 'No', 'value': 33 }];
    $scope.laptop_status = [{ 'label': 'Yes', 'value': 22 }, { 'label': 'No', 'value': 33 }];
    $scope.mobile_status = [{ 'label': 'Yes', 'value': 22 }, { 'label': 'No', 'value': 33 }];

    $scope.tablet_status = [{ 'label': 'Yes', 'value': 22 }, { 'label': 'No', 'value': 33 }];

    $scope.options = [
        { type: 'White', value: 'British', id: '1' },
        { type: 'White', value: 'Irish', id: '2' },
        { type: 'White', value: 'White Other (Please Specify)', id: '3' },
        { type: 'Mixed', value: 'White and Black Caribbean', id: '4' },
        { type: 'Mixed', value: 'White and Black African', id: '5' },
        { type: 'Mixed', value: 'White and Asian	', id: '6' },
        { type: 'Mixed', value: 'Any Other Mixed Background (Please Specify)', id: '7' },
        { type: 'Asian or Asian British', value: 'Indian', id: '8' },
        { type: 'Asian or Asian British', value: 'Pakistani', id: '9' },
        { type: 'Asian or Asian British', value: 'Bangaldeshi', id: '10' },
        { type: 'Asian or Asian British', value: 'Any Other Asain Background (Please Specify)', id: '11' },
        { type: 'Black or Black British', value: 'Caribbean', id: '12' },
        { type: 'Black or Black British', value: 'African', id: '13' },
        { type: 'Black or Black British', value: 'Any Other Black Background (Please Specify)', id: '14' },
        { type: 'Chinese', value: 'Chinese', id: '15' },
        { type: 'Chinese', value: 'Chinese Other (Please Specify)', id: '16' },
        { type: 'Prefer Not to Say', value: 'Prefer Not to Say', id: '17' },];

    /* $scope.companies = {};
     var companiesUrl = $scope.$root.hr+"hr_values/get-companies";
     $http
     .post(companiesUrl, {'token':$scope.$root.token})
     .then(function (res) {
     if(res.data.ack == true){
     $scope.companies = res.data.response;
     $scope.formData.company_name = res.data.respones.name;
     }
     //else toaster.pop('error', 'Error', "No company found!");
     }); */

    // $rootScope.get_country_list();


    // var emp_Url = $scope.$root.hr + "hr_values/get_employee_type";
    // $http
    //     .post(emp_Url, { 'token': $scope.$root.token })
    //     .then(function (res) {
    //         if (res.data.ack == true) {
    //             $scope.employee_type_list = res.data.response;

    //             if ($scope.user_type == 1)
    //                 $scope.employee_type_list.push({ 'id': '-1', 'name': '++ Add New ++' });

    //         }
    //     });

    /* Get all Case of Inactive types */

    // var emp_leave_types_Url = $scope.$root.hr + "hr_values/get-employee-inactive-type";
    // $http
    //     .post(emp_leave_types_Url, { 'token': $scope.$root.token })
    //     .then(function (res) {
    //         if (res.data.ack == true) {
    //             $scope.leave_types = res.data.response;
    //         }

    //         $scope.leave_types.push({ 'id': '-1', 'name': '++ Add New ++' });
    //     });


    /* Get all Reasons for Employee leaving*/

    // var emp_leave_reasons_Url = $scope.$root.hr + "hr_values/get-employee-leaving-reasons";
    // $http
    //     .post(emp_leave_reasons_Url, { 'token': $scope.$root.token })
    //     .then(function (res) {
    //         if (res.data.ack == true) {
    //             $scope.resign_type = res.data.response;
    //         }
    //         $scope.resign_type.push({ 'id': '-1', 'name': '++ Add New ++' });
    //     });


    /*$scope.religion_list =
     [{'name':'None','id':1},{'name':'Christian','id':2},
     {'name':'Buddist','id':3},{'name':'Hindu','id':4},{'name':'Jewish','id':5}
     ,{'name':'Muslim','id':6},{'name':'Sikh','id':7},{'name':'Prefer Not To Say','id':8},{'name':'Any other Religion','id':9}];*/


    /* var  ColsUrl = $scope.$root.hr+"hr_values/get-cols-by-tab-id";var ColPostData = {
     'token': $scope.$root.token,
     'all': "1",
     'tab_id':$tab_id
     };

     $http
     .post(ColsUrl, ColPostData)
     .then(function (res) {
     if(res.data.ack == true){

     $scope.fields_rec = res.data.response;
     }
     //  else 	toaster.pop('error', 'Error', "No column found!");
     });*/
    // var departmentUrl = $scope.$root.hr + "hr_department/get-all-department";
    // $http
    //     .post(departmentUrl, { 'token': $scope.$root.token })
    //     .then(function (res) {
    //         if (res.data.ack == true)
    //         $scope.dept_list = res.data.response;


    //         //codemark1

    //         if ($scope.user_type == 1) $scope.dept_list.push({ 'id': '-1', 'name': '++ Add New ++' });

    //     });


    $scope.$root.breadcrumbs =
        [////{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
            { 'name': 'Human Resources', 'url': '#', 'isActive': false },
            { 'name': 'Employees', 'url': 'app.hr_listing', 'isActive': false }];//HR


    //console.log($scope.login_allow[1]);

    $scope.$root.model_code = '';
    if ($stateParams.id !== undefined) {
        // var HRDetailsURL = $scope.$root.hr + "hr_values/get-employee-details";
        // $http
        //     .post(HRDetailsURL, { 'token': $scope.$root.token, 'employee_id': $stateParams.id })
        //     .then(function (res) {
        //         console.log(res.data.response.status);
        //         if (res.data.ack == true) {

        //             $scope.$root.model_code = res.data.response.first_name + ' ' + res.data.response.last_name + '( ' + res.data.response.user_code + ' )';
        //             $scope.module_code = $scope.$root.model_code;


        //             $scope.$root.breadcrumbs.push(
        //                 { 'name': $scope.$root.model_code, 'url': '#', 'isActive': false }
        //                 , { 'name': 'General', 'url': '#', 'isActive': false });

        //             $scope.formData = res.data.response;
        //             if (res.data.response.emp_picture)
        //                 $scope.$root.$broadcast("get_single_image_edit", res.data.response.emp_picture);

        //             //expense images settings.

        //             /* if (res.data.response.emp_picture)
        //              $scope.$root.$broadcast("get_expense_image_edit", res.data.response.emp_picture);*/


        //             if (res.data.response.case_date == 0)
        //                 $scope.formData.case_date = null;
        //             else
        //                 $scope.formData.case_date = $scope.$root.convert_unix_date_to_angular(res.data.response.case_date);


        //             if (res.data.response.status_date == 0)
        //                 $scope.formData.status_date = null;
        //             else
        //                 $scope.formData.status_date = $scope.$root.convert_unix_date_to_angular(res.data.response.status_date);

        //             if (res.data.response.status_inactive_date == 0)
        //                 $scope.formData.status_inactive_date = null;
        //             else
        //                 $scope.formData.status_inactive_date = $scope.$root.convert_unix_date_to_angular(res.data.response.status_inactive_date);

        //             if (res.data.response.start_date == 0)
        //                 $scope.formData.start_date = null;
        //             else
        //                 $scope.formData.start_date = $scope.$root.convert_unix_date_to_angular(res.data.response.start_date);
        //             if (res.data.response.leave_date == 0)
        //                 $scope.formData.leave_date = null;
        //             else
        //                 $scope.formData.leave_date = $scope.$root.convert_unix_date_to_angular(res.data.response.leave_date);
        //             if (res.data.response.date_of_birth == 0)
        //                 $scope.formData.date_of_birth = null;
        //             else
        //                 $scope.formData.date_of_birth = $scope.$root.convert_unix_date_to_angular(res.data.response.date_of_birth);
        //             if (res.data.response.salary_date == 0)
        //                 $scope.formData.salary_date = null;
        //             else
        //                 $scope.formData.salary_date = $scope.$root.convert_unix_date_to_angular(res.data.response.salary_date);
        //             if (res.data.response.salary_date_review == 0)
        //                 $scope.formData.salary_date_review = null;
        //             else $scope.formData.salary_date_review = $scope.$root.convert_unix_date_to_angular(res.data.response.salary_date_review);

        //             if (res.data.response.car_date_assign == 0)
        //                 $scope.formData.car_date_assign = null;
        //             else
        //                 $scope.formData.car_date_assign = $scope.$root.convert_unix_date_to_angular(res.data.response.car_date_assign);

        //             if (res.data.response.laptop_date_assign == 0)
        //                 $scope.formData.laptop_date_assign = null;
        //             else $scope.formData.laptop_date_assign = $scope.$root.convert_unix_date_to_angular(res.data.response.laptop_date_assign);

        //             if (res.data.response.mobile_date_assign == 0)
        //                 $scope.formData.mobile_date_assign = null;
        //             else
        //                 $scope.formData.mobile_date_assign = $scope.$root.convert_unix_date_to_angular(res.data.response.mobile_date_assign);

        //             if (res.data.response.car_date_return == 0)
        //                 $scope.formData.car_date_return = null;
        //             else
        //                 $scope.formData.car_date_return = $scope.$root.convert_unix_date_to_angular(res.data.response.car_date_return);

        //             if (res.data.response.laptop_return_date_assign == 0)
        //                 $scope.formData.laptop_return_date_assign = null;
        //             else
        //                 $scope.formData.laptop_return_date_assign = $scope.$root.convert_unix_date_to_angular(res.data.response.laptop_return_date_assign);

        //             if (res.data.response.mobile_return_date_assign == 0)
        //                 $scope.formData.mobile_return_date_assign = null;
        //             else
        //                 $scope.formData.mobile_return_date_assign = $scope.$root.convert_unix_date_to_angular(res.data.response.mobile_return_date_assign);

        //             if (res.data.response.er_start_date == 0)
        //                 $scope.formData.er_start_date = null;
        //             else
        //                 $scope.formData.er_start_date = $scope.$root.convert_unix_date_to_angular(res.data.response.er_start_date);

        //             if (res.data.response.er_end_date == 0)
        //                 $scope.formData.er_end_date = null;
        //             else
        //                 $scope.formData.er_end_date = $scope.$root.convert_unix_date_to_angular(res.data.response.er_end_date);
        //             if (res.data.response.er_change_date == 0)
        //                 $scope.formData.er_change_date = null;
        //             else
        //                 $scope.formData.er_change_date = $scope.$root.convert_unix_date_to_angular(res.data.response.er_change_date);
        //             if (res.data.response.ee_start_date == 0)
        //                 $scope.formData.ee_start_date = null;
        //             else
        //                 $scope.formData.ee_start_date = $scope.$root.convert_unix_date_to_angular(res.data.response.ee_start_date);

        //             if (res.data.response.ee_change_date == 0)
        //                 $scope.formData.ee_change_date = null;
        //             else
        //                 $scope.formData.ee_change_date = $scope.$root.convert_unix_date_to_angular(res.data.response.ee_change_date);
        //             if (res.data.response.ee_end_date == 0)
        //                 $scope.formData.ee_end_date = null;
        //             else
        //                 $scope.formData.ee_end_date = $scope.$root.convert_unix_date_to_angular(res.data.response.ee_end_date);

        //             if (res.data.response.tablet_date_assign == 0)
        //                 $scope.formData.tablet_date_assign = null;
        //             else
        //                 $scope.formData.tablet_date_assign = $scope.$root.convert_unix_date_to_angular(res.data.response.tablet_date_assign);

        //             if (res.data.response.tablet_return_date_assign == 0) $scope.formData.tablet_return_date_assign = null;
        //             else $scope.formData.tablet_return_date_assign = $scope.$root.convert_unix_date_to_angular(res.data.response.tablet_return_date_assign);

        //             if (res.data.response.company_car == 22) $scope.car_list_detail = true;
        //             else $scope.car_list_detail = false;


        //             $scope.formData.piid = res.data.response.piid;

        //             if (res.data.response.company_laptop_model == 22) $scope.laptop_list_detail = true;
        //             else $scope.laptop_list_detail = false;

        //             if (res.data.response.company_mobile_model == 22) $scope.mobile_list_detail = true;
        //             else $scope.mobile_list_detail = false;


        //             if (res.data.response.tablet_status_id == 22) $scope.tablit_list_detail = true;
        //             else $scope.tablit_list_detail = false;


        //             if (res.data.response.other_benifits != 1 || res.data.response.other_benifits != 2) $scope.formData.other_benifits = 1;


        //             if ((res.data.response.case_date != 0) && (res.data.response.cause_of_inactivity != 0))
        //                 $scope.is_case_date = true;

        //             if ((res.data.response.status_date != 0) && (res.data.response.status == 1)) $scope.is_status = true;

        //             if (res.data.response.other_leave != 0) $scope.is_leave_other = true;

        //             if ((res.data.response.other_case != 0) && (res.data.response.cause_of_inactivity == 4)) $scope.is_case_no = true;

        //             if (res.data.response.other_ethinic != 0) $scope.is_ethinic = true;
        //             // console.log(res.data.response.status);
        //             //if ((res.data.response.status == 2))     $scope.is_cause_data = true;
        //             if ((res.data.response.status != 1)) $scope.is_cause_data = true;


        //             $scope.formData.work_email = res.data.response.user_email;

        //             //codemark2
        //             $timeout(function () {
        //                 angular.forEach($scope.dept_list, function (obj, index) {
        //                     if (obj.id == res.data.response.department) $scope.selected_dept_list.push(obj);
        //                 });

        //                 angular.forEach($scope.employee_type_list, function (obj, index) {
        //                     if (obj.id == res.data.response.employee_type) $scope.formData.employee_type = obj;
        //                 });
        //                 /*console.log($scope.user_types);
        //                  console.log(res.data.response.user_type);*/

        //                 angular.forEach($scope.user_types, function (obj, index) {
        //                     if (obj.value == res.data.response.user_type) $scope.formData.user_id = obj;
        //                 });

        //                 /* $.each($scope.login_allow, function (index, obj) {
        //                  if (obj.value == res.data.response.allow_login)   $scope.formData.allow_login = obj;
        //                  });*/


        //                 //post_code_country
        //                 angular.forEach($scope.country_type_arr, function (obj, index) {
        //                     if (res.data.response.post_code_country != undefined) {
        //                         if (obj.id == res.data.response.post_code_country)
        //                             $scope.formData.post_code_country = obj;
        //                     }
        //                     else {

        //                         if (obj.id == $scope.$root.defaultCountry)
        //                             $scope.formData.post_code_country = obj;
        //                     }

        //                 });

        //                 //salary currency selection

        //                 if (res.data.response.salary_currency_id > 0) {

        //                     angular.forEach($rootScope.arr_currency, function (obj, index) {
        //                         if (obj.id == res.data.response.salary_currency_id) {
        //                             $scope.formData.salary_currency = obj;
        //                         }
        //                     });

        //                 } else {

        //                     angular.forEach($rootScope.arr_currency, function (obj, index) {
        //                         if (obj.id == $scope.$root.defaultCurrency) {
        //                             $scope.formData.salary_currency = obj;
        //                         }
        //                     });
        //                 }
        //                 console.log("Status Data: ", $scope.status_data);
        //                 angular.forEach($scope.status_data, function (obj, index) {
        //                     console.log("Status Obj: ", obj);
        //                     if (obj.id == res.data.response.status)
        //                         $scope.formData.status = obj;
        //                 });


        //                 // console.log(res.data.response.status.id);

        //                 /*if (res.data.response.status.id == 0) {

        //                  }*/
        //                 if (res.data.response.status.id != 1) {
        //                     $scope.is_cause_data = true;
        //                 } else {
        //                     $scope.chk_for_active_status();
        //                 }

        //                 angular.forEach($scope.leave_types, function (obj, index) {
        //                     if (obj.id == res.data.response.cause_of_inactivity)
        //                         $scope.formData.cause_of_inactivity = obj;

        //                 });


        //                 /*$.each($scope.laptop_status, function (index, obj) {
        //                  if (obj.value == res.data.response.company_laptop_model) {
        //                  $scope.formData.company_laptop_model = $scope.laptop_status[index];
        //                  }
        //                  });*/
        //                 /*$.each($scope.car_status, function (index, obj) {
        //                  if (obj.value == res.data.response.company_car) {
        //                  $scope.formData.company_car = $scope.car_status[index];
        //                  }
        //                  });*/

        //                 /* $.each($scope.fuel_cost_deduction_array, function (index, obj) {
        //                  if (obj.value == res.data.response.fuel_cost_deduction) {
        //                  $scope.formData.fuel_cost_deduction = $scope.fuel_cost_deduction_array[index];
        //                  }
        //                  });*/

        //                 /*$.each($scope.mobile_status, function (index, obj) {
        //                  if (obj.value == res.data.response.company_mobile_model) {
        //                  $scope.formData.company_mobile_model = $scope.mobile_status[index];
        //                  }
        //                  });*/
        //                 /*$.each($scope.fuel_status, function (index, obj) {
        //                  if (obj.value == res.data.response.car_fuel_card) {
        //                  $scope.formData.car_fuel_card = $scope.fuel_status[index];
        //                  $scope.show_fuel_card_num = true;
        //                  }
        //                  });*/
        //                 /*$.each($scope.tablet_status, function (index, obj) {
        //                  if (obj.value == res.data.response.tablet_status_id) {
        //                  $scope.formData.tablet_status_id = $scope.tablet_status[index];
        //                  }
        //                  });*/
        //                 if ($scope.formData.employee_type.id == 2) {
        //                     $scope.$root.salary_type_one = true;

        //                     angular.forEach($scope.salary_type_list_final_one, function (obj, index) {
        //                         if (obj.value == res.data.response.salary_type) {
        //                             $scope.formData.salary_type = $scope.salary_type_list_final_one[index];
        //                         }
        //                     });
        //                 } else {
        //                     $scope.$root.salary_type_two = true;
        //                     angular.forEach($scope.salary_type_list_final_two, function (obj, index) {
        //                         if (obj.value == res.data.response.salary_type) {
        //                             $scope.formData.salary_type = $scope.salary_type_list_final_two[index];
        //                         }
        //                     });
        //                 }

        //                 angular.forEach($scope.entitle_holiday_option, function (obj, index) {
        //                     if (obj.value == res.data.response.entitle_holiday_opti) {
        //                         $scope.entitled_label = obj.label;
        //                         $scope.formData.entitle_holiday_opti = $scope.entitle_holiday_option[index];
        //                     }
        //                 });

        //                 $scope.formData.entitle_holiday_opti = $scope.entitle_holiday_option[0];

        //                 $scope.entitled = res.data.response.entitle_holiday;
        //                 $scope.formData.annual_allownce = res.data.response.entitle_holiday + " " + $scope.entitled_label;
        //                 angular.forEach($scope.arr_car_fuel_type, function (obj, index) {
        //                     if (obj.value == res.data.response.car_fuel_type) {
        //                         $scope.formData.car_fuel_type = $scope.arr_car_fuel_type[index];
        //                         $scope.formData.car_fuel_type2 = obj.label;
        //                     }

        //                 });
        //                 angular.forEach($scope.arr_car_enngine, function (obj, index) {
        //                     if (obj.value == res.data.response.car_enngine) {
        //                         $scope.formData.car_enngine = obj;
        //                         $scope.formData.car_enngine2 = obj.label;
        //                     }

        //                 });

        //                 angular.forEach($scope.arr_type_benefit, function (obj, index) {
        //                     if (obj.id == res.data.response.other_benifits.id) $scope.formData.other_benifits = obj;

        //                 });
        //                 /*$.each($scope.car_status, function (index, obj) {
        //                  if (obj.value == res.data.response.company_car) {
        //                  $scope.formData.company_car = obj;
        //                  }
        //                  });
        //                  if (res.data.response.company_car != 22)    $scope.formData.other_benifits = 1;*/
        //                 //$scope.formData.company_car = res.data.response.company_car;


        //                 angular.forEach($scope.resign_type, function (obj, index) {
        //                     if (obj.id == res.data.response.reason_of_leaving)
        //                         $scope.formData.reason_of_leaving = obj;

        //                 });

        //                 angular.forEach($scope.religion_list, function (obj, index) {
        //                     if (obj.id == res.data.response.religion) $scope.formData.religion = obj;

        //                 });
        //                 angular.forEach($scope.options, function (obj, index) {
        //                     if (obj.id == res.data.response.ethical_origin)
        //                         $scope.formData.ethical_origin = $scope.options[index];

        //                 });

        //                 $scope.getAssignRoles(1);
        //                 $scope.getRoles_edit($stateParams.id);

        //                 $scope.getSalePersons(1);
        //                 $scope.getSalePersons_edit(res.data.response.id);

        //                 $scope.formData.bank_account_collapse = "";
        //                 //console.log($scope.formData.hr_account_name);
        //                 // console.log(res.data.response.hr_account_name);

        //                 if ($scope.formData.hr_account_name != "") {
        //                     $scope.formData.bank_account_collapse = "in";
        //                 }

        //                 $scope.showLoader = false;
        //             }, 3000);
        //         }

        //     });

        /* Commenting this code as I believe this isn't being used anywhere. Ahmad Hassan
                $scope.getSalePersons_edit = function (id) {
        
                    $scope.sel_linemanger_tooltip = "";
        
                    var salepersonUrl = $scope.$root.sales + "crm/crm/get-crm-salesperson";
                    $http
                        .post(salepersonUrl, { id: id, 'token': $scope.$root.token, 'type': 7 })
                        .then(function (emp_data) {
        
        
                            if (emp_data.data.ack == true) {
                                console.log(emp_data);
                                //$scope.$root.$apply(function () {
                                angular.forEach($scope.salepersons, function (obj, indx) {
        
                                    obj.chk = false;
                                    obj.isPrimary = false;
        
                                    angular.forEach(emp_data.data.response, function (obj2, indx) {
        
                                        // console.log(obj2);
                                        //
        
                                        if (obj.id == obj2.salesperson_id) {
        
                                            $scope.sel_linemanger_tooltip = $scope.sel_linemanger_tooltip + obj.first_name + " " + obj.last_name + "; ";
        
                                            obj.chk = true;
                                            if (obj2.is_primary == 1)
                                                obj.isPrimary = true;
        
                                            $scope.selectedSalespersons.push(obj);
                                        }
                                    });
        
                                });
                                //});
        
                                // console.log($scope.sel_linemanger_tooltip);
                                $scope.sel_linemanger_tooltip = $scope.sel_linemanger_tooltip.slice(0, -2);
                                //  console.log($scope.sel_linemanger_tooltip);
                            }
                        });
                }
                */

        /*var  selTabValuesUrl = $scope.$root.hr+"hr_values/get_hr_value_by_undefined"; 
         $http
         .post(selTabValuesUrl, {'token':$scope.$root.token, 'employee_id': $stateParams.id, "tab_id": $tab_id})
         .then(function (res) {
         if(res.data.ack == true)
         { 
         $scope.formData.fields_data= res.data.response;

         }

         }); */

        $scope.showdatac = false;
        // $scope.get_benefits_data($stateParams.id);
        /* console.log($scope.benefits_data);
         console.log($scope.benefits_data.length);*/
        /* console.log($scope.columns_benefits);
         console.log($scope.columns_benefits.length);
         if ($scope.columns_benefits.length > 0) $scope.showdatac = true;*/


    } else {
        $scope.currency_list = $rootScope.arr_currency;
        angular.forEach($rootScope.arr_currency, function (obj, index) {
            if (obj.id == $scope.$root.defaultCurrency) {
                // console.log(obj.id + "currency default");
                $scope.formData.salary_currency = $rootScope.arr_currency[index];
            }
        });
        //console.log($scope.login_allow[1]);

        $scope.formData.allow_login = 0;
        //$scope.login_allow[1];
        $scope.formData.user_id = $scope.user_types[1];
        //console.log($scope.formData.allow_login);
    }


    $scope.showdatac = false;

    $scope.generalInformation = function () {

        // $scope.$root.breadcrumbs[3].name = 'General Information';
    }
    $scope.$on("get_single_image", function (event, image) {
        $scope.formData.emp_picture = image;
        $scope.formDataExpense.exp_image = image;
    });
    // var updateUrl = $scope.$root.hr + "hr_values/update-tab-col-val";

    $scope.selectSaleperson = function (sp, isPrimary) {
        $scope.selectedSalespersons.length = 0;
        $scope.selectedSalespersons = sp;
        $scope.sel_linemanger_tooltip = sp.name;
        $scope.formData.line_manager_name = sp.name;
        $scope.formData.line_manager_name_id = sp.id;
        // $scope.selected_role_tooltip = "";
        // $scope.isSalePerersonChanged = true;
        // for (var i = 0; i < $scope.salepersons.length; i++) {
        //     if (isPrimary == 1)
        //         $scope.salepersons[i].isPrimary = false;
        //     if (sp.id == $scope.salepersons[i].id) {
        //         if ($scope.salepersons[i].chk == true && isPrimary == 0) {
        //             $scope.salepersons[i].chk = false;
        //             $scope.salepersons[i].isPrimary = false;
        //             angular.forEach($scope.selectedSalespersons, function (obj, indx) {
        //                 if (obj != undefined) {

        //                     $scope.sel_linemanger_tooltip = $scope.sel_linemanger_tooltip + obj.name + "; ";

        //                     if (obj.id == sp.id)
        //                         $scope.selectedSalespersons.splice(indx, 1);
        //                 }
        //             });
        //         } else {

        //             // console.log('i==>>'+i);
        //             if (isPrimary == 1 || $scope.selectedSalespersons.length == 0) {
        //                 var isExist = false;
        //                 $scope.salepersons[i].isPrimary = true;
        //                 $scope.sel_linemanger_tooltip = "";
        //                 angular.forEach($scope.selectedSalespersons, function (obj, indx) {
        //                     if (obj != undefined) {

        //                         $scope.sel_linemanger_tooltip = obj.name;

        //                         $scope.selectedSalespersons[indx].isPrimary = false;
        //                         if (obj.id == sp.id) {
        //                             isExist = true;
        //                             $scope.selectedSalespersons[indx].isPrimary = true;
        //                         }

        //                     }
        //                 });
        //                 if (!isExist) {
        //                     $scope.salepersons[i].chk = true;
        //                     $scope.selectedSalespersons.push($scope.salepersons[i]);
        //                 }

        //             } else {
        //                 $scope.salepersons[i].chk = true;
        //                 $scope.selectedSalespersons.push($scope.salepersons[i]);
        //             }
        //         }

        //     }

        // }


        // $scope.sel_linemanger_tooltip = $scope.sel_linemanger_tooltip.slice(0, -2);
    }


    /* Commenting this code as I believe this isn't being used anywhere. Ahmad Hassan
    $scope.add_salespersons = function (id) {
        var excUrl = $scope.$root.sales + "crm/crm/add-crm-salesperson";
        var post = {};
        var temp = [];
        angular.forEach($scope.selectedSalespersons, function (obj, index) {
            if (obj.chk) temp.push({ id: obj.id, isPrimary: obj.isPrimary });
        });

        post.id = id;
        post.salespersons = temp;
        post.type = 7;
        post.token = $scope.$root.token;

        $http
            .post(excUrl, post)
            .then(function (res) {

            });
    }

    */


    $scope.isrolesChanged = false;
    $scope.selectedrolesrecord = [];
    $scope.all_roles_record = [];

    /* Commenting this code as I believe this isn't being used anywhere. Ahmad Hassan
    $scope.getAssignRoles = function (isShow) {
        $scope.columns = [];
        $scope.all_roles_record = [];
        $scope.title = 'roles';


        angular.forEach($scope.all_roles, function (obj, indx) {
            obj.chk = false;
            if ($scope.selectedrolesrecord.length > 0) {
                angular.forEach($scope.selectedrolesrecord, function (obj2, indx) {
                    //         console.log(obj2);
                    if (obj.id == obj2.id) obj.chk = true;
                });
            }
            $scope.all_roles_record.push(obj);
        });
        angular.forEach($scope.all_roles[0], function (val, index) {
            if (index != 'chk' && index != 'id') {
                $scope.columns.push({
                    'title': toTitleCase(index),
                    'field': index,
                    'visible': true
                });
            }
        });

        var postUrl = $scope.$root.hr + "roles/roles";
        var postData = { 'token': $scope.$root.token };

        // $http
        //     .post(postUrl, postData)
        //     .then(function (res) {
        //         if (res.data.ack == true) {
        //             angular.forEach($scope.all_roles, function (obj, indx) {
        //                 obj.chk = false;
        //                 if ($scope.selectedrolesrecord.length > 0) {
        //                     angular.forEach($scope.selectedrolesrecord, function (obj2, indx) {
        //                         //         console.log(obj2);
        //                         if (obj.id == obj2.id) obj.chk = true;
        //                     });
        //                 }
        //                 $scope.all_roles_record.push(obj);
        //             });
        //             angular.forEach($scope.all_roles[0], function (val, index) {
        //                 if (index != 'chk' && index != 'id') {
        //                     $scope.columns.push({
        //                         'title': toTitleCase(index),
        //                         'field': index,
        //                         'visible': true
        //                     });
        //                 }
        //             });
        //         } //else   toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));


        //     });
        if (!isShow)
            angular.element('#RolesAssignModal').modal({ show: true });
    }

    */


    /* Commenting this code as I believe this isn't being used anywhere. Ahmad Hassan
        angular.element(document).on('click', '.checkAllRoles', function () {
            $scope.selectedrolesrecord = [];
    
            $scope.selected_role_tooltip = "";
    
            if (angular.element('.checkAllRoles').is(':checked') == true) {
                $scope.isrolesChanged = true;
                var isPrimary = false;
                for (var i = 0; i < $scope.all_roles_record.length; i++) {
                    if ($scope.all_roles_record[i].isPrimary)
                        isPrimary = true;
    
                    $scope.all_roles_record[i].chk = true;
    
                    if ($scope.all_roles_record[i] != undefined) {
                        //console.log($scope.all_roles_record[i]);
                        $scope.selectedrolesrecord.push($scope.all_roles_record[i]);
    
                        $scope.selected_role_tooltip = $scope.selected_role_tooltip + $scope.all_roles_record[i].name + "; ";
                    }
    
    
                    //
                }
                $scope.selected_role_tooltip = $scope.selected_role_tooltip.slice(0, -2);
            }
            else {
                for (var i = 0; i < $scope.all_roles_record.length; i++) {
                    $scope.all_roles_record[i].chk = false;
                    $scope.all_roles_record[i].isPrimary = false;
                }
                $scope.selectedrolesrecord = [];
                $scope.selected_role_tooltip = "";
            }
    
            // $timeout(function () {
            //     $scope.$root.$apply(function () {
            //         $scope.selectedrolesrecord;
            //     });
            // }, 500);
    
        });
    */


    /* Commenting this code as I believe this isn't being used anywhere. Ahmad Hassan
        angular.element(document).on('click', '.checkAllSalesperson', function () {
            $scope.selectedSalespersons = [];
    
            $scope.sel_linemanger_tooltip = "";
    
            if (angular.element('.checkAllSalesperson').is(':checked') == true) {
                $scope.isrolesChanged = true;
                var isPrimary = false;
                for (var i = 0; i < $scope.salepersons.length; i++) {
                    if ($scope.salepersons[i].isPrimary)
                        isPrimary = true;
    
                    $scope.salepersons[i].chk = true;
    
                    if ($scope.salepersons[i] != undefined) {
                        console.log($scope.salepersons[i]);
                        $scope.selectedSalespersons.push($scope.salepersons[i]);
    
                        $scope.sel_linemanger_tooltip = $scope.sel_linemanger_tooltip + $scope.salepersons[i].first_name + " " + $scope.salepersons[i].last_name + "; ";
                    }
    
    
                    //
                }
                // if (!isPrimary) {
                //  $scope.all_roles_record[0].isPrimary = true;
                //  $scope.selectedrolesrecord[0].isPrimary = true;
                //  }
                $scope.sel_linemanger_tooltip = $scope.sel_linemanger_tooltip.slice(0, -2);
            }
            else {
                for (var i = 0; i < $scope.all_roles_record.length; i++) {
                    $scope.salepersons[i].chk = false;
                    $scope.salepersons[i].isPrimary = false;
                }
                $scope.selectedSalespersons = [];
                $scope.sel_linemanger_tooltip = "";
            }
    
            // $timeout(function () {
            //     $scope.$root.$apply(function () {
            //         $scope.selectedSalespersons;
            //     });
            // }, 500);
    
        });
    
        */
    /* Commenting this code as I believe this isn't being used anywhere. Ahmad Hassan
        $scope.selectValueRoles = function (sp, isPrimary) {
    
            $scope.selected_role_tooltip = "";
            $scope.isrolesChanged = true;
    
            for (var i = 0; i < $scope.all_roles_record.length; i++) {
                if (isPrimary == 1)
                    $scope.all_roles_record[i].isPrimary = false;
                if (sp.id == $scope.all_roles_record[i].id) {
                    if ($scope.all_roles_record[i].chk == true && isPrimary == 0) {
                        $scope.all_roles_record[i].chk = false;
                        $scope.all_roles_record[i].isPrimary = false;
                        angular.forEach($scope.selectedrolesrecord, function (obj, indx) {
                            //console.log($scope.selected_role_tooltip);
                            console.log(obj);
    
    
                            if (obj != undefined) {
                                $scope.selected_role_tooltip = $scope.selected_role_tooltip + obj.name + "; ";
                                if (obj.id == sp.id)
                                    $scope.selectedrolesrecord.splice(indx, 1);
                            }
                        });
                    } else {
    
                        // console.log('i==>>'+i);
                        if (isPrimary == 1 || $scope.selectedrolesrecord.length == 0) {
                            var isExist = false;
                            $scope.all_roles_record[i].isPrimary = true;
                            angular.forEach($scope.selectedrolesrecord, function (obj, indx) {
                                // console.log($scope.selected_role_tooltip);
                                $scope.selected_role_tooltip = $scope.selected_role_tooltip + obj.name + "; ";
    
                                if (obj != undefined) {
                                    $scope.selectedrolesrecord[indx].isPrimary = false;
                                    if (obj.id == sp.id) {
                                        isExist = true;
                                        $scope.selectedrolesrecord[indx].isPrimary = true;
                                    }
    
                                }
                            });
                            if (!isExist) {
                                $scope.all_roles_record[i].chk = true;
                                $scope.selectedrolesrecord.push($scope.all_roles_record[i]);
                            }
    
                        } else {
                            $scope.all_roles_record[i].chk = true;
                            $scope.selectedrolesrecord.push($scope.all_roles_record[i]);
                        }
                    }
    
                }
    
            }
            // console.log($scope.selected_role_tooltip);
            $scope.selected_role_tooltip = $scope.selected_role_tooltip.slice(0, -2);
            // console.log($scope.selected_role_tooltip);
    
        }
    
        */


    /* Commenting this code as I believe this isn't being used anywhere. Ahmad Hassan
    $scope.getRoles_edit = function (id) {

        $scope.selected_role_tooltip = "";
        angular.forEach($scope.all_roles_record, function (obj, indx) {
            obj.chk = false;
            angular.forEach($scope.roleToEmployee, function (obj2, indx) {
                if (obj.id == obj2.role_id) {
                    obj.chk = true;
                    $scope.selected_role_tooltip = $scope.selected_role_tooltip + obj.name + "; ";

                    $scope.selectedrolesrecord.push(obj);
                }
            });
            //$scope.all_roles_record.push(obj);
        });
        $scope.selected_role_tooltip = $scope.selected_role_tooltip.slice(0, -2);
        // var salepersonUrl = $scope.$root.hr + "roles/get-role-to-employee";
        // $http
        //     .post(salepersonUrl, { id: id, 'token': $scope.$root.token, 'type': 1 })
        //     .then(function (emp_data) {

        //         if (emp_data.data.ack == true) {
        //             // $scope.$root.$apply(function () {
        //             //     angular.forEach($scope.all_roles_record, function (obj, indx) {
        //             //         obj.chk = false;
        //             //         angular.forEach(emp_data.data.response, function (obj2, indx) {
        //             //             if (obj.id == obj2.role_id) {
        //             //                 obj.chk = true;
        //             //                 $scope.selected_role_tooltip = $scope.selected_role_tooltip + obj.name + "; ";

        //             //                 $scope.selectedrolesrecord.push(obj);
        //             //             }
        //             //         });
        //             //         //$scope.all_roles_record.push(obj);
        //             //     });
        //             // });
        //             angular.forEach($scope.all_roles_record, function (obj, indx) {
        //                 obj.chk = false;
        //                 angular.forEach(emp_data.data.response, function (obj2, indx) {
        //                     if (obj.id == obj2.role_id) {
        //                         obj.chk = true;
        //                         $scope.selected_role_tooltip = $scope.selected_role_tooltip + obj.name + "; ";

        //                         $scope.selectedrolesrecord.push(obj);
        //                     }
        //                 });
        //                 //$scope.all_roles_record.push(obj);
        //             });
        //             $scope.selected_role_tooltip = $scope.selected_role_tooltip.slice(0, -2);
        //         }
        //     });
    }

    */

    /* Commenting this code as I believe this isn't being used anywhere. Ahmad Hassan
    $scope.add_employee_roles = function (id) {
        var excUrl = $scope.$root.hr + "roles/add-role-to-employee";
        var post = {};
        var temp = [];
        angular.forEach($scope.selectedrolesrecord, function (obj, index) {

            if (obj.chk) temp.push({ id: obj.id, isPrimary: obj.isPrimary });
        })

        post.id = id;
        post.rolesdata = temp;
        post.type = 1;
        post.token = $scope.$root.token;
        $http
            .post(excUrl, post)
            .then(function (res) {

            });
    }
    */


    //--------------------   Employee type --------------------

    $scope.onChangeEmployeetype = function () {
        var id = this.formData.employee_type.id;

        $scope.$root.salary_type_one = false;
        $scope.$root.salary_type_two = true;

        if (id == 2) {
            $scope.$root.salary_type_one = true;
            $scope.$root.salary_type_two = false;
        }
        if (id == -1) {
            //   $scope.show_emp_type = true;
            //   angular.element('#modaladdeventbtn_new').click();
            $('#model_emp_type').modal({
                show: true
            });
        }
    }

    /* Commenting this code as I believe this isn't being used anywhere. Ahmad Hassan
    $scope.add_employee_type = function (formData2) {

        $scope.formData2.token = $scope.$root.token;
        $scope.formData2.data = $scope.formFields;

        var submit_emplyeetype_url = $scope.$root.hr + "hr_values/submit_emp_type_form";

        $http
            .post(submit_emplyeetype_url, $scope.formData2)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Add', 'Record Successfully Insert!');
                    //  $scope.show_emp_type = false; 
                    $('#model_emp_type').modal('hide');
                    var emp_Url = $scope.$root.hr + "hr_values/get_employee_type";
                    $http
                        .post(emp_Url, { 'token': $scope.$root.token })
                        .then(function (res) {

                            if (res.data.ack == true) {
                                $scope.employee_type_list = res.data.response;

                                angular.foreEach($scope.employee_type_list, function (elem, index) {
                                    console.log(elem.name == $scope.formData2.name);
                                    if (elem.name == $scope.formData2.name)
                                        $scope.formData.employee_type = elem;
                                });

                                // if ($scope.user_type == 1)
                                //     $scope.employee_type_list.push({ 'id': '-1', 'name': '++ Add New ++' });


                            }

                        });
                } else
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(107));

            });
    };*/

    //--------------------   Add line manager --------------------

    /* Commenting this code as I believe this isn't being used anywhere. Ahmad Hassan
    
    $scope.isSalePerersonChanged = false;
    $scope.selectedSalespersons = [];
    $scope.searchKeywordhr_lm = {};

    $scope.getSalePersons = function (isShow, item_paging, clr) {
        if (clr == 77) {
            $scope.searchKeywordhr_lm = {};
        }
        $scope.columns = [];
        $scope.salepersons = [];
        $scope.title = 'Line Manager';
        $scope.employee_id = $stateParams.id;
        $scope.postData = {};
        var postUrl = $scope.$root.hr + "employee/listings";
        $scope.postData.token = $scope.$root.token;
        $scope.postData.all = 1;

        if (item_paging == 1) $rootScope.item_paging.spage = 1;
        $scope.postData.page = $rootScope.item_paging.spage;
        $scope.postData.pagination_limits = $rootScope.item_paging.pagination_limit !== undefined ? $rootScope.item_paging.pagination_limit.id : 0;

        if ($scope.searchKeywordhr_lm.$)
            $scope.postData.searchKeyword = $scope.searchKeywordhr_lm.$;

        if ($scope.searchKeywordhr_lm.emp_type !== undefined && $scope.searchKeywordhr_lm.emp_type !== null) {
            $scope.postData.emp_types = $scope.searchKeywordhr_lm.emp_type.id;
        }

        if ($scope.searchKeywordhr_lm.deprtment !== undefined && $scope.searchKeywordhr_lm.deprtment !== null)
            $scope.postData.deprtments = $scope.searchKeywordhr_lm.deprtment.id;

        if ($scope.postData.pagination_limits == -1) {
            $scope.postData.page = -1;
            $scope.searchKeywordhr_lm = {};
            $scope.record_data = {};
        }

        $scope.postData.admin_emp_chk = 1;

        $scope.total = $scope.all_employees.total;
        $scope.item_paging.total_pages = $scope.all_employees.total_pages;
        $scope.item_paging.cpage = $scope.all_employees.cpage;
        $scope.item_paging.ppage = $scope.all_employees.ppage;
        $scope.item_paging.npage = $scope.all_employees.npage;
        $scope.item_paging.pages = $scope.all_employees.pages;

        $scope.total_paging_record = $scope.all_employees.total_paging_record;
        //codemark listings

        // angular.forEach($scope.all_employees, function (obj, indx) {
        //     obj.chk = false;
        //     obj.isPrimary = false;
        //     if ($scope.selectedSalespersons.length > 0) {
        //         angular.forEach($scope.selectedSalespersons, function (obj2, indx) {
        //             if (obj.id == obj2.id) {
        //                 obj.chk = true;
        //                 if (obj2.isPrimary)
        //                     obj.isPrimary = true;

        //             }
        //         });
        //     }
        //     $scope.salepersons.push(obj);
        // });

        for (var i = 0; i < $scope.salepersons.length; i++) {
            var object = $scope.salepersons[i];
            if (object.id == $scope.employee_id)
                $scope.salepersons.splice(i, 1);

        }

        angular.forEach($scope.all_employees[0], function (val, index) {
            //  if (index != 'chk' && index != 'id') {
            $scope.columns.push({
                'title': toTitleCase(index),
                'field': index,
                'visible': true
            });
            // }
        });
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
                    angular.forEach(res.data.response, function (obj, indx) {
                        obj.chk = false;
                        obj.isPrimary = false;
                        if ($scope.selectedSalespersons.length > 0) {
                            angular.forEach($scope.selectedSalespersons, function (obj2, indx) {
                                if (obj.id == obj2.id) {
                                    obj.chk = true;
                                    if (obj2.isPrimary)
                                        obj.isPrimary = true;

                                }
                            });
                        }
                        $scope.salepersons.push(obj);
                    });

                    for (var i = 0; i < $scope.salepersons.length; i++) {
                        var object = $scope.salepersons[i];
                        if (object.id == $scope.employee_id)
                            $scope.salepersons.splice(i, 1);

                    }

                    angular.forEach(res.data.response[0], function (val, index) {
                        //  if (index != 'chk' && index != 'id') {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                        // }
                    });
                }
                //else    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));


            });

        if (!isShow)
            angular.element('#salesPersonModal').modal({ show: true });

    }


    //--------------------   department name --------------------

    $scope.onChangedepartmenttype = function () {

        var id = this.formData.department.id;
        if (id == -1) {
            // $scope.show_dept_pop = true;
            //  angular.element('#model_btn_deprtment').click();
            console.log("add department");
            angular.element('#model_cat').modal({ show: true });
            // $('#model_cat').modal({show: true});
            console.log("add department2");

        }

        $("#name").val('');
        $scope.name = '';
        
    }

    // $scope.add_dep = function (formData5) {

    //     var addcatUrl = $scope.$root.hr + "hr_department/add_department";

    //     $scope.formData5.token = $scope.$root.token;
    //     $scope.formData5.data = $scope.formFields;

    //     $http
    //         .post(addcatUrl, formData5)
    //         .then(function (res) {
    //             if (res.data.ack == true) {

    //                 toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
    //                 //  $scope.show_dept_pop = false; 
    //                 $('#model_cat').modal('hide');

    //                 var departmentUrl = $scope.$root.hr + "hr_department/get-all-department";
    //                 $http
    //                     .post(departmentUrl, { 'token': $scope.$root.token })
    //                     .then(function (res) {
    //                         if (res.data.ack == true) {
    //                             $scope.dept_list = res.data.response;

    //                             angular.forEach($scope.dept_list, function (elem, index) {
    //                                 if (elem.name == $scope.formData5.name)
    //                                     $scope.formData.department = elem;
    //                             });

    //                         }
    //                         // if ($scope.user_type == 1)
    //                         //     $scope.dept_list.push({ 'id': '-1', 'name': '++ Add New ++' });

    //                     });

    //             } else
    //                 toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(107));
    //         });
    // }

    $scope.getSalePerson = function () {

        $scope.employee_id = $stateParams.id;
        var empUrl = $scope.$root.hr + "employee/listings";
        postData = {
            'token': $scope.$root.token,
            'employee_id': $scope.employee_id
        };
        $http
            .post(empUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.columns = [];
                    $scope.record = {};
                    $scope.record = res.data.response;


                    for (var i = 0; i < $scope.record.length; i++) {
                        var object = $scope.record[i];
                        if (object.id == $scope.employee_id) {
                            $scope.record.splice(i, 1);
                        }
                    }


                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                }
                //else  toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));

            });

        ngDialog.openConfirm({
            //  template: 'modalDialogId',
            template: 'app/views/hr_values/_listing_modal.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (result) {
            $scope.formData.line_manager_name = result.name;
            $scope.formData.line_manager_name_id = result.id;

        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }
    */

    //--------------------    Religion  --------------------

    // var reg_Url = $scope.$root.hr + "hr_values/get_religion_type";
    // $http
    //     .post(reg_Url, { 'token': $scope.$root.token })
    //     .then(function (res) {
    //         if (res.data.ack == true) {

    //             $scope.religion_list = res.data.response;
    //             if ($scope.user_type == 1) {
    //                 $scope.religion_list.push({ 'id': '-1', 'name': '++ Add New ++' });
    //             }
    //         }
    //     });

    $scope.onChangereligiontype = function () {
        var r_id = this.formData.religion.id;
        if (r_id == -1) {
            //  angular.element('#religion_popup').click();
            //  $scope.show_religion_type = true;
            $('#religion_type').modal({
                show: true
            });
        }

    }

    /* Commenting this code as I believe this isn't being used anywhere. Ahmad Hassan
    $scope.add_religion = function (formData2) {

        $scope.formData2.token = $scope.$root.token;
        $scope.formData2.data = $scope.formFields;

        var submit_url = $scope.$root.hr + "hr_values/submit_religion_form";
        $http
            .post(submit_url, $scope.formData2)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Add', $scope.$root.getErrorMessageByCode(101));
                    // $scope.show_religion_type = false; 
                    $('#religion_type').modal('hide');

                    $scope.religion_list = {};
                    var reg_Url = $scope.$root.hr + "hr_values/get_religion_type";
                    $http
                        .post(reg_Url, { 'token': $scope.$root.token })
                        .then(function (res) {
                            if (res.data.ack == true) {
                                $scope.religion_list = res.data.response;

                                angular.forEach($scope.religion_list, function (elem, index) {
                                    if (elem.name == $scope.formData2.name)
                                        $scope.formData.religion = elem;
                                });

                                // if ($scope.user_type == 1)
                                //     $scope.religion_list.push({ 'id': '-1', 'name': '++ Add New ++' });


                            }
                        });
                } else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(107));
                }
            });
    };
    */

    // ---------------- Personal   Tab	 ----------------------------------------- 

    $scope.gender_type = [{ 'label': 'Male', 'value': 1 }, { 'label': 'Female', 'value': 2 }];
    $scope.mar_status = [
        { 'label': 'Single', 'value': 1 },
        { 'label': 'Married', 'value': 2 },
        { 'label': 'Divorced', 'value': 3 },
        { 'label': 'Widowed', 'value': 4 },
        { 'label': 'Prefer not to say', 'value': 5 }
    ];


    $scope.getpersonalhr = function () {
        $scope.is_ethinic = false;
        $scope.check_readonly = true;

        //$scope.$root.breadcrumbs[3].name = 'Personal Information';

    }

    $scope.addpersonal = function (formData) {
        $scope.formData.employee_id = $scope.$root.employee_id;
        $scope.formData.token = $scope.$root.token;
        $scope.formData.data = $scope.formFields;
        $scope.formData.tab_id_2 = 2;

        $scope.formData.rec_id = $scope.rec_id;

        /*  var counter = 0;
         if ($scope.formData.tab_id_2 == 2) {
         var niNumber = document.getElementById('insurance_number').value;
         //var insurance_number =	ni_validate(niNumber);
         if (niNumber != "") {
         var regNI = /^([a-zA-Z]){2}( )?([0-9]){2}( )?([0-9]){2}( )?([0-9]){2}( )?([a-zA-Z]){1}?$/;

         if (niNumber != null)
         {
         if (regNI.test(niNumber) == false)
         {
         counter++;
         document.getElementById("ini_msg").innerHTML = "National Insurance Number is not yet valid.";
         }
         }
         }

         }

         if (counter > 0) {
         $scope.date_msg = true;
         $scope.ini_msg = true;
         jQuery("html, body").animate({
         scrollTop: 0
         }, "slow");
         jQuery("html, body").animate({
         scrollTop: '+=500px'
         });
         return true;
         } else {
         $scope.date_msg = false;
         $scope.ini_msg = false;
         }*/

        $scope.formData.religions = $scope.formData.religion !== undefined ? $scope.formData.religion.id : 0;
        $scope.formData.ethical_origins = $scope.formData.ethical_origin !== undefined ? $scope.formData.ethical_origin.value : 0;

        if (typeof $scope.formData.mar_status != "undefined") {
            if ($scope.formData.mar_status == null) {
                $scope.formData.mar_status_id = 0;
            }
            else {
                $scope.formData.mar_status_id = $scope.formData.mar_status.value;
            }
        }


        if (typeof $scope.formData.emp_gender != "undefined") {
            if ($scope.formData.emp_gender == null) {
                $scope.formData.gender_id = 0;
            }
            else {
                $scope.formData.gender_id = $scope.formData.emp_gender.value;
            }
        }

        var updateper = $scope.$root.hr + "hr_values/update-hr-personal";
        $scope.showLoader = true;
        $http
            .post(updateper, $scope.formData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    //$scope.$root.employee_id = res.data.employee_id;
                    toaster.pop('success', 'Info', res.data.msg);
                    $scope.check_hrvalues_readonly = true;

                } else {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $scope.check_hrvalues_readonly = true;
                    /*$timeout(function(){ $state.go('app.hr_listing'); }, 1000);*/
                }
            });
    }


    // ---------------- Contact   Tab	 ----------------------------------------- 

    $scope.getcontact = function () {

        $scope.check_readonly = true;


        // $scope.$root.breadcrumbs[3].name = 'Contact Information';


    }

    $scope.addcontact = function (formData) {

        $scope.formData.employee_id = $scope.$root.employee_id;
        $scope.formData.token = $scope.$root.token;
        $scope.formData.data = $scope.formFields;
        $scope.formData.tab_id_2 = 22;

        $scope.formData.post_code_countrys = $scope.formData.post_code_country !== undefined ? $scope.formData.post_code_country.id : 0;

        //$scope.formData.country = $scope.formData.country !== undefined ? $scope.formData.country.id:0;


        var updateconc = $scope.$root.hr + "hr_values/update-hr-contact";
        $scope.showLoader = true;
        $http
            .post(updateconc, $scope.formData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {

                    //$scope.$root.employee_id = res.data.employee_id;
                    toaster.pop('success', 'Info', res.data.msg);
                    $scope.check_hrvalues_readonly = true;

                } else {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $scope.check_hrvalues_readonly = true;
                    /*$timeout(function(){ $state.go('app.hr_listing'); }, 1000);*/
                }
            });
    }


    // --------- 	Salary   	 --------------------------------------------

    $scope.addCommasToSalary = function () {
        $scope.formData.salary = $scope.formData.salary.replace(/,/g, "");
        $scope.formData.salary = Number($scope.formData.salary).toLocaleString("en");
    }

    $scope.showSalesTarget = function () {
        angular.element('#salesTargetModal').modal({ show: true });
    }

    $scope.checkEEEndDate = function () {
        if ($scope.formData.leave_date != $scope.formData.ee_end_date) {
            $scope.formData.ee_end_date = $scope.formData.leave_date;
        }
        else {
            $scope.formData.ee_end_date = "";
        }
    }

    $scope.checkEREndDate = function () {
        if ($scope.formData.leave_date != $scope.formData.er_end_date) {
            $scope.formData.er_end_date = $scope.formData.leave_date;
        }
        else {
            $scope.formData.er_end_date = "";
        }
    }

    $scope.testDateOfBirthFromCtrl = function (date) {
        if (date) {
            if (!$rootScope.testDateOfBirth(date)) {
                $scope.formData.date_of_birth = '';
                $scope.formData.date_of_birth_invalid = true;
            }
            else {
                $scope.formData.date_of_birth_invalid = false;
            }
        }
        else {
            $scope.formData.date_of_birth_invalid = false;
            return;
        }

    }

    $scope.salary_type_list_final_two = [{ 'label': 'Hourly', 'value': 1 }, { 'label': 'Weekly', 'value': 2 }
        , { 'label': 'Monthly', 'value': 3 }, { 'label': 'Annual', 'value': 4 }];

    $scope.salary_type_list_final_one = [{ 'label': 'Hourly', 'value': 1 }];


    $scope.getsalaryhr = function () {

        $scope.check_readonly = true;
        // $scope.$root.breadcrumbs[3].name = 'Salary Information';
    }

    $scope.addsalary = function (formData) {
        var startDate = ($rootScope.convert_date_to_unix(formData.salary_date));
        var endDate = ($rootScope.convert_date_to_unix(formData.salary_date_review));

        if (startDate && endDate && endDate < startDate) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(333, ['Salary Review', 'Start Date']));
            return;
        }

        // var commission_effective_date = ($rootScope.convert_date_to_unix(formData.commission_effective_date));

        if (formData.commission && formData.commission.length > 0 && formData.commission != 0 && !formData.commission_effective_date) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Commission Effective Date']));
            return;
        }

        var startDate = ($rootScope.convert_date_to_unix(formData.ee_start_date));
        var middleDate = ($rootScope.convert_date_to_unix(formData.ee_change_date));
        var endDate = ($rootScope.convert_date_to_unix(formData.ee_end_date));

        if ((endDate && middleDate && (endDate < middleDate)) || (endDate && startDate && (endDate < startDate)) || (startDate && middleDate && (middleDate < startDate))) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(370, ['Date fields under Employee Pension Contribution']));
            return;
        }

        var startDate = ($rootScope.convert_date_to_unix(formData.er_start_date));
        var middleDate = ($rootScope.convert_date_to_unix(formData.er_change_date));
        var endDate = ($rootScope.convert_date_to_unix(formData.er_end_date));

        if ((endDate && middleDate && (endDate < middleDate)) || (endDate && startDate && (endDate < startDate)) || (startDate && middleDate && (middleDate < startDate))) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(370, ['Date fields under Employer Pension Contribution']));
            return;
        }

        $scope.formData.employee_id = $scope.$root.employee_id;
        $scope.formData.token = $scope.$root.token;
        $scope.formData.data = $scope.formFields;
        $scope.formData.tab_id_2 = 3;

        $scope.formData.rec_id = $scope.rec_id;
        $scope.formData.salary = (typeof $scope.formData.salary !== "undefined" && $scope.formData.salary != null && $scope.formData.salary != "") ? $scope.formData.salary : 0;
        $scope.formData.bonus = (typeof $scope.formData.bonus !== "undefined" && $scope.formData.bonus != null && $scope.formData.bonus != "") ? $scope.formData.bonus : 0;
        $scope.formData.salary_types = (typeof $scope.formData.salary_type !== "undefined" && $scope.formData.salary_type != null) ? $scope.formData.salary_type.value : 0;
        $scope.formData.salary_currency_id = $scope.formData.salary_currency !== undefined ? $scope.formData.salary_currency.id : 0;
        $scope.formData.entitle_holiday_optis = $scope.formData.entitle_holiday_opti !== undefined ? $scope.formData.entitle_holiday_opti.value : 0;
        var updatesalary = $scope.$root.hr + "hr_values/update-hr-salary";

        $scope.showLoader = true;
        $http
            .post(updatesalary, $scope.formData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {

                    toaster.pop('success', 'Info', res.data.msg);
                    $scope.check_hrvalues_readonly = true;

                } else {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $scope.check_hrvalues_readonly = true;
                    /*$timeout(function(){ $state.go('app.hr_listing'); }, 1000);*/
                }
            });
    }

    $scope.getCommissionRateHistory = function () {

        $scope.formData2 = {};
        // $scope.commissionRateHistory = [];
        $scope.history_title = '';

        $scope.columns_commhis = [];
        $scope.commissionRateHistory = {};

        var commissionRateHistoryURL = $scope.$root.hr + "hr_values/employee-commission-history";

        $scope.formData2.employee_id = $scope.formData.id;
        $scope.formData2.token = $scope.$root.token;

        $scope.showLoader = true;
        $http
            .post(commissionRateHistoryURL, $scope.formData2)
            .then(function (res) {
                $scope.showLoader = false;
                $scope.history_title = 'Commission History';

                if (res.data.ack == true) {
                    $scope.commissionRateHistory = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_commhis.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    //console.log($scope.columns_commhis);

                    angular.element('#hr_commission_modal').modal({ show: true });

                } else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });
    }


    // ---------------- Benefits   	 ----------------------------------------- 


    $scope.getBenifits = function () {
        $scope.activeBenefit = null;
        $scope.editOtherBenefit = false;
        $scope.check_readonly = true;
        // $scope.$root.breadcrumbs[3].name = 'Benefits Information';
        $scope.formData.token = {

        };

        var benefitpostData = {
            'token': $scope.$root.token,
            'employee_id': $stateParams.id,
            'company_id': $scope.$root.defaultCompany
        };
        var getbenefitsUrl = $scope.$root.hr + "hr_values/get-other-benefits";

        $http
            .post(getbenefitsUrl, benefitpostData)
            .then(function (res) {
                if (res.data.ack == true) {
                    if (res.data.response.length > 0) {
                        $scope.showdatac = true;
                        var all_expired = 1;
                        var ts = Math.round((new Date()).getTime() / 1000);
                        angular.forEach(res.data.response, function (obj) {
                            if (Number(obj.end_date_temp) > Number(ts))
                                all_expired = 0;
                        });

                        if (all_expired == 1)
                            $scope.show_benifits_ending = 1;
                        else
                            $scope.show_benifits_ending = 0;
                    }
                }
            });
    }

    $scope.addBenifits = function (formData) {

        var startDate = ($rootScope.convert_date_to_unix(formData.car_date_assign));
        var endDate = ($rootScope.convert_date_to_unix(formData.car_date_return));
        if (startDate && endDate && endDate < startDate) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(333, ['Return Date', 'Assign Date']));
            return;
        }

        var startDate = ($rootScope.convert_date_to_unix(formData.tablet_date_assign));
        var endDate = ($rootScope.convert_date_to_unix(formData.tablet_return_date_assign));
        if (startDate && endDate && endDate < startDate) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(333, ['Return Date', 'Assign Date']));
            return;
        }

        var startDate = ($rootScope.convert_date_to_unix(formData.mobile_date_assign));
        var endDate = ($rootScope.convert_date_to_unix(formData.mobile_return_date_assign));
        if (startDate && endDate && endDate < startDate) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(333, ['Return Date', 'Assign Date']));
            return;
        }

        $scope.formData.employee_id = $scope.$root.employee_id;
        $scope.formData.token = $scope.$root.token;
        $scope.formData.data = $scope.formFields;
        $scope.formData.tab_id_2 = 33;

        //$scope.formData.company_cars = $scope.formData.company_car !== undefined ? $scope.formData.company_car.value : 0;
        $scope.formData.company_cars = $scope.formData.company_car;

        // $scope.formData.fuel_cost_deductions = $scope.formData.fuel_cost_deduction !== undefined ? $scope.formData.fuel_cost_deduction.value : 0;
        $scope.formData.fuel_cost_deductions = $scope.formData.fuel_cost_deduction;

        $scope.formData.car_enngines = $scope.formData.car_enngine !== undefined ? $scope.formData.car_enngine : 0;
        // $scope.formData.car_fuel_types = $scope.formData.car_fuel_type !== undefined ? $scope.formData.car_fuel_type.value : 0;
        $scope.formData.car_fuel_type = $scope.formData.car_fuel_type == null ? 0 : $scope.formData.car_fuel_type;

        // $scope.formData.company_laptop_models = $scope.formData.company_laptop_model !== undefined ? $scope.formData.company_laptop_model.value : 0;
        $scope.formData.company_laptop_models = $scope.formData.company_laptop_model;

        //$scope.formData.company_mobile_models = $scope.formData.company_mobile_model !== undefined ? $scope.formData.company_mobile_model.value : 0;
        $scope.formData.company_mobile_models = $scope.formData.company_mobile_model;

        // $scope.formData.car_fuel_cards = $scope.formData.car_fuel_card !== undefined ? $scope.formData.car_fuel_card.value : 0;
        $scope.formData.car_fuel_cards = $scope.formData.car_fuel_card;

        // $scope.formData.tablet_status_ids = $scope.formData.tablet_status_id !== undefined ? $scope.formData.tablet_status_id.value : 0;
        $scope.formData.tablet_status_ids = $scope.formData.tablet_status_id;
        
        var updatebenifit = $scope.$root.hr + "hr_values/update-hr-benefit";
        $scope.showLoader = true;
        $http
            .post(updatebenifit, $scope.formData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', res.data.msg);
                    $scope.check_hrvalues_readonly = true;
                } else {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    $scope.check_hrvalues_readonly = true;
                }
                $scope.check_hrvalues_readonly = true;
            });
    }

    $scope.selectEngineSize = function(){
        var counter =0;
        angular.forEach($scope.arr_car_enngine, function (value, key) {
            if ($scope.formData.car_fuel_type == value.type && counter==0) {
                $scope.formData.car_enngine = value.value;
                counter++;
            }
        });
    }
    
    $scope.benefit_history = function (type) {
        $scope.historyData = {};
        $scope.historyData.employee_id = $scope.formData.id;
        $scope.historyData.token = $scope.$root.token;

        if (type == 'car') {
            if(!$scope.formData.company_car_make){
                return false;
            }
            $scope.historyData.company_car      = 1;
            $scope.historyData.company_car_make = $scope.formData.company_car_make;
            $scope.historyData.car_model        = $scope.formData.car_model;
            $scope.historyData.car_vin          = $scope.formData.car_vin;
            $scope.historyData.car_emisions     = $scope.formData.car_emisions;
            $scope.historyData.car_marked_value = $scope.formData.car_marked_value;
            $scope.historyData.car_fuel_type    = $scope.formData.car_fuel_type;
            $scope.historyData.car_enngine      = $scope.formData.car_enngine;
            $scope.historyData.car_date_assign  = $scope.formData.car_date_assign;
            $scope.historyData.car_date_return  = $scope.formData.car_date_return;

            $scope.formData.company_car_make = "";
            $scope.formData.car_model = "";
            $scope.formData.car_vin = "";
            $scope.formData.car_emisions = "";
            $scope.formData.car_marked_value = "";
            $scope.formData.car_fuel_type = "";
            $scope.formData.car_enngine = "";
            $scope.formData.car_date_assign = "";
            $scope.formData.car_date_return = "";
        }else if (type == 'fuel') {
            if(!$scope.formData.car_fuel_card_num){
                return false;
            }
            $scope.historyData.car_fuel_card      = 1;
            $scope.historyData.car_fuel_card_num = $scope.formData.car_fuel_card_num;
            $scope.historyData.fuel_cost_deduction        = $scope.formData.fuel_cost_deduction;

            $scope.formData.car_fuel_card_num = "";
            $scope.formData.fuel_cost_deduction = 0;
        }else if (type == 'laptop') {
            if(!$scope.formData.laptop_make){
                return false;
            }
            $scope.historyData.company_laptop               = 1;
            $scope.historyData.laptop_make                  = $scope.formData.laptop_make;
            $scope.historyData.laptop_model                 = $scope.formData.laptop_model;
            $scope.historyData.company_laptop_serial        = $scope.formData.company_laptop_serial;
            $scope.historyData.laptop_date_assign           = $scope.formData.laptop_date_assign;
            $scope.historyData.laptop_return_date_assign     = $scope.formData.laptop_return_date_assign;

            $scope.formData.laptop_make = "";
            $scope.formData.laptop_model = "";
            $scope.formData.company_laptop_serial = "";
            $scope.formData.laptop_date_assign = "";
            $scope.formData.laptop_return_date_assign = "";
        }else if (type == 'tablet') {
            if(!$scope.formData.tablet_make){
                return false;
            }
            $scope.historyData.company_tablet              = 1;
            $scope.historyData.tablet_make                  = $scope.formData.tablet_make;
            $scope.historyData.tablet_model                 = $scope.formData.tablet_model;
            $scope.historyData.company_tablet_serial        = $scope.formData.company_tablet_serial;
            $scope.historyData.tablet_date_assign           = $scope.formData.tablet_date_assign;
            $scope.historyData.tablet_return_date_assign     = $scope.formData.tablet_return_date_assign;

            $scope.formData.tablet_make = "";
            $scope.formData.tablet_model = "";
            $scope.formData.company_tablet_serial = "";
            $scope.formData.tablet_date_assign = "";
            $scope.formData.tablet_return_date_assign = "";
        }else if (type == 'mobile') {
            if(!$scope.formData.mobile_make){
                return false;
            }
            $scope.historyData.company_mobile              = 1;
            $scope.historyData.mobile_make                  = $scope.formData.mobile_make;
            $scope.historyData.mobile_model                 = $scope.formData.mobile_model;
            $scope.historyData.company_mobile_serial        = $scope.formData.company_mobile_serial;
            $scope.historyData.mobile_date_assign           = $scope.formData.mobile_date_assign;
            $scope.historyData.mobile_return_date_assign     = $scope.formData.mobile_return_date_assign;

            $scope.formData.mobile_make = "";
            $scope.formData.mobile_model = "";
            $scope.formData.company_mobile_serial = "";
            $scope.formData.mobile_date_assign = "";
            $scope.formData.mobile_return_date_assign = "";
        }

        var updatebenifitHistory = $scope.$root.hr + "hr_values/add-hr-benefit-history";

        $http
            .post(updatebenifitHistory, $scope.historyData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                   // toaster.pop('success', 'Info', res.data.msg);
                } else {
                    //toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(102));
                }
            });


    }

    $scope.clear_benefits = function () {
        $scope.formData.benefits_start_date = "";
        $scope.formData.benefits_end_date = "";
        $scope.formData.benefits_title = "";
        $scope.formData.comments = "";
        $scope.formData.benefit_id = "";
    }

    $scope.submit_benefits = function () {
        var startDate = $scope.formData.benefits_start_date.trim().split('/');
        startDate = new Date(startDate[2], startDate[1] - 1, startDate[0]);

        var endDate = $scope.formData.benefits_end_date.trim().split('/');
        endDate = new Date(endDate[2], endDate[1] - 1, endDate[0]);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) { // checking if any of the date is invalid - means empty or something..
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(247, ['Dates']));
            return;
        }

        if (endDate < startDate) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(333, ['End Date ', 'Start Date']));
            return;
        }

        if ($scope.formData.benefits_title == "" || $scope.formData.benefits_start_date == "" || $scope.formData.benefits_title == undefined || $scope.formData.benefits_start_date == undefined) {
            // console.log("here");//undefined
            //|| $scope.formData.benefits_end_date == ""
            // || $scope.formData.benefits_end_date == undefined
            return false;
        }

        var updatecommision = $scope.$root.hr + "hr_values/add-other-benefits";

        var rec = {};
        //rec = $scope.array_submit_comision;
        rec.token = $scope.$root.token;
        rec.type = $scope.type_define;
        rec.employee_id = $stateParams.id;
        rec.company_id = $scope.$root.defaultCompany;
        rec.start_date = $scope.formData.benefits_start_date;
        rec.end_date = $scope.formData.benefits_end_date;
        rec.benefits_title = $scope.formData.benefits_title;
        rec.benefit_id = $scope.formData.benefit_id;
        rec.comments = $scope.formData.comments;

        /*if($scope.type_define==1 ||$scope.type_define==2)   rec.module_id =$scope.$root.sale_target_id;
         else  if($scope.type_define==3 ||$scope.type_define==4)  rec.module_id =$scope.altContactMediaForm.id;
         */

        $http
            .post(updatecommision, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Add', res.data.error);
                    $scope.get_benefits_data($stateParams.id);
                    $scope.showdatac = true;
                }
                else toaster.pop('error', 'info', res.data.error);

                $scope.formData.benefits_start_date = "";
                $scope.formData.benefits_end_date = "";
                $scope.formData.benefits_title = "";
                $scope.formData.comments = "";
                $scope.formData.benefit_id = "";
            });

    }

    $scope.edit_other_Benifit = function (benefit_rec) {

        $scope.editOtherBenefit = true;
        $scope.activeBenefit = benefit_rec.id;
        // console.log(benefit_rec);
        $scope.formData.benefits_start_date = benefit_rec.start_date;
        $scope.formData.benefits_end_date = benefit_rec.end_date;
        $scope.formData.benefits_title = benefit_rec.benefit;
        $scope.formData.comments = benefit_rec.Description;
        $scope.formData.benefit_id = benefit_rec.id;
    }

    $scope.show_popup_benefits = function () {
        $scope.title = "Other Benefits";
        $scope.clear_benefits();
        $scope.get_benefits_data($stateParams.id);
        $('#benefits_pop').modal({ show: true });
    }

    $scope.delete_benefits = function (id) {

        var postData = {
            'benefit_id': id
        };
        postData.token = $scope.$root.token;
        var getexpUrl = $scope.$root.hr + "hr_values/del-other-benefits";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $scope.showLoader = true;
            $http
                .post(getexpUrl, postData)
                .then(function (res) {

                    if (res.data.ack == true) {
                        $scope.activeBenefit = null;
                        // for (var p in $scope.formData) {
                        //     $scope.formData[p] = null;
                        // } here i am
                        $scope.benefits_data = res.data.response;
                        $scope.clear_benefits();
                        $scope.get_benefits_data($stateParams.id);
                        toaster.pop('success', 'info', 'Record Deleted');
                    }
                    else {

                        toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(108));
                    }

                    $scope.showLoader = false;


                });



        });



    };

    $scope.clearOtherBenefits = function () {
        $scope.activeBenefit = null;
        $("#benefits_pop form").parsley().reset();
        console.log($("#benefits_pop").trigger("reset"));
    }

    $scope.get_benefits_data = function (employeeID) {

        $scope.activeBenefit = null;
        $scope.editOtherBenefit = false;
        $scope.benefits_data = {};
        $scope.columns_benefits = [];

        var postData = {
            'employee_id': employeeID,
            'company_id': $scope.$root.defaultCompany
        };
        postData.token = $scope.$root.token;
        var getexpUrl = $scope.$root.hr + "hr_values/get-other-benefits";

        $http
            .post(getexpUrl, postData)
            .then(function (res) {

                if (res.data.ack == true) {
                    $scope.benefits_data = res.data.response;
                    if ($scope.benefits_data.length) {
                        $scope.showdatac = true;
                        var all_expired = 1;
                        var ts = Math.round((new Date()).getTime() / 1000);

                        angular.forEach($scope.benefits_data, function (obj) {
                            if (Number(obj.end_date_temp) > Number(ts))
                                all_expired = 0;
                        });

                        if (all_expired == 1)
                            $scope.show_benifits_ending = 1;
                        else
                            $scope.show_benifits_ending = 0;

                    }
                    else {
                        $scope.showdatac = false;
                        $scope.show_benifits_ending = 0;
                    }

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_benefits.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                }
                else {

                    //toaster.pop('error', 'info',$scope.$root.getErrorMessageByCode(400));
                }


            });

    }

    $scope.getBefitsHistory = function (benefit_type) {

        $scope.formData2 = {};
        // $scope.commissionRateHistory = [];
        $scope.history_title = '';

        $scope.columns_benhis = [];
        $scope.benefitsHistory = {};

        var benefitHistoryURL = $scope.$root.hr + "hr_values/employee-benefit-history";

        $scope.formData2.employee_id = $scope.formData.id;
        $scope.formData2.token = $scope.$root.token;
        $scope.formData2.benefit_type = benefit_type;

        $scope.showLoader = true;
        $http
            .post(benefitHistoryURL, $scope.formData2)
            .then(function (res) {
                $scope.showLoader = false;
                if (benefit_type == 1) {
                    $scope.history_title = 'Car History';
                } else if (benefit_type == 2) {
                    $scope.history_title = 'Fuel Card History';
                } else if (benefit_type == 3) {
                    $scope.history_title = 'Laptop History';
                } else if (benefit_type == 4) {
                    $scope.history_title = 'Tablet/Ipad Card History';
                } else if (benefit_type == 5) {
                    $scope.history_title = 'Mobile History';
                } else if (benefit_type == 6) {
                    $scope.history_title = 'Other Benefits History';
                }

                if (res.data.ack == true) {
                    $scope.benefitsHistory = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_benhis.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    //console.log($scope.columns_commhis);

                    angular.element('#hr_benefit_history_modal').modal({ show: true });

                } else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });
    }


    // ------------- 	 Roles 	 ----------------------------------------
    /*	$scope.selection=[];
     // toggle selection for a given id
     $scope.toggleSelection = function toggleSelection(list_single) {
     var idx = $scope.selection.indexOf(list_single);

     // is currently selected
     if (idx > -1) {
     $scope.selection.splice(idx, 1);
     }

     // is newly selected
     else {
     $scope.selection.push(list_single);
     }
     };*/

    $scope.onChangeModule = function () {
        var m_id = this.formData.module_id.id;
        var p_id = $scope.formData.per_id;

        //  console.log(p_id);  console.log(m_id); 

        var postData = {
            'token': $scope.$root.token,
            'id': m_id,
            'permisions': p_id
        };

        var getchild = $scope.$root.hr + "hr_values/get_child_module_list_selected";
        $http
            .post(getchild, postData)
            .then(function (res) {
                $scope.childdata = res.data.response;
                // console.log($scope.childdata); 
            });


    }

    // $scope.getRoles = function () {
    //     // $scope.$root.breadcrumbs[3].name = 'Roles & PermissionsInformation';
    //     var employee_id = $stateParams.id;
    //     // var employee_id =$scope.$root.employee_id;
    //     //  console.log(employee_id); 
    //     $scope.showroleslist = true;
    //     $scope.showroles = false;
    //     $scope.compBankData = [];
    //     $scope.columns = [];

    //     var postData = {};

    //     var vm = this;
    //     var postUrl = $scope.$root.hr + "hr_values/role_list";
    //     postData = {
    //         'token': $scope.$root.token,
    //         'all': "1",
    //         'column': 'company_id',
    //         'employee_id': employee_id
    //     };

    //     $http
    //         .post(postUrl, postData)
    //         .then(function (res) {
    //             if (res.data.response != null) {
    //                 $scope.roleslist = res.data.response;
    //                 // $scope.columns = res.data.columns;
    //                 // console.log(res.data.record.result);
    //                 angular.forEach(res.data.response[0], function (val, index) {
    //                     $scope.columns.push({
    //                         'title': toTitleCase(index),
    //                         'field': index,
    //                         'visible': true
    //                     });
    //                 });
    //             }

    //         });


    // }

    /* Commenting this code as I believe this isn't being used anywhere. Ahmad Hassan
    $scope.fnrolesForm = function () {

        $scope.formData.roles_id = '';
        $scope.roles_id = '';

        $scope.roles_id = '';
        $scope.per_id = '';
        $scope.emp_role_status = '';
        $scope.emp_role_status = '';

        $scope.childdata = {};
        $scope.list_values = {};
        $scope.roless = {};

        $scope.showroles = true;
        $scope.showroleslist = false;

        // 	 $scope.check_hrvalues_readonly = false;
        //  $scope.perreadonly = true;
        var role_url = $scope.$root.hr + "roles/roles";
        $http
            .post(role_url, { 'token': $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.role_list = res.data.response;
                }
            });

        var role_url = $scope.$root.hr + "hr_values/get_parent_module_list";
        $http
            .post(role_url, { 'token': $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.module_list = res.data.response;
                }
            });
    }

    $scope.addroles = function (formData) {

        $scope.formData.selectedList = $scope.childdata.filter(function (namesDataItem) {
            return namesDataItem.checked;
        });

        $scope.formData.employee_id = $stateParams.id;//$scope.$root.employee_id;
        $scope.formData.token = $scope.$root.token;
        $scope.formData.data = $scope.formFields;
        $scope.formData.tab_id_2 = 5;
        $scope.formData.roles_id = $scope.roles_id;

        $scope.formData.emp_roles = $scope.formData.emp_role !== undefined ? $scope.formData.emp_role.id : 0;
        $scope.formData.emp_role_statuss = $scope.formData.emp_role_status !== undefined ? $scope.formData.emp_role_status.id : 0;
        $scope.formData.module_ids = $scope.formData.module_id !== undefined ? $scope.formData.module_id.id : 0;


        var updaterole = $scope.$root.hr + "hr_values/update-hr-role";
        $http
            .post(updaterole, $scope.formData)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', res.data.msg);

                    // if(res.data.tab_change=="tab_role"){    
                    //$timeout(function () {
                    $scope.getRoles();
                    //}, 1000);
                    // } 

                } else {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                    //$timeout(function(){ $state.go('app.hr_listing'); }, 1000);
                }
            });
    }

    $scope.showroleEditForm = function (id) {


        $scope.showroles = true;
        $scope.showroleslist = false;
        //	 $scope.check_hrvalues_readonly = false;
        // $scope.perreadonly = true;
         
        $scope.formData.roles_id = id;
        $scope.roles_id = id;

        var roles_url = $scope.$root.hr + "roles/roles";
        $http
            .post(roles_url, { 'token': $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.role_list = res.data.response;
                }
            });


        var getUrl = $scope.$root.hr + "hr_values/role_by_id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };
        $http
            .post(getUrl, postViewBankData)
            .then(function (res) {


                $scope.formData.per_id = res.data.response.permisions;
                $scope.formData.module_idd = res.data.response.module_id;
                $scope.module_idd = res.data.response.module_id;
                //	console.log($scope.module_idd);
                //console.log($scope.formData.module_idd );

                var postData = {
                    'token': $scope.$root.token,
                    'id': res.data.response.module_id,
                    'permisions': res.data.response.permisions
                };
                var getchild = $scope.$root.hr + "hr_values/get_child_module_list_selected";
                $http
                    .post(getchild, postData)
                    .then(function (res) {
                        $scope.childdata = res.data.response;
                    });


                angular.forEach($scope.status_data, function (obj, index) {
                    console.log("Status Obj: ", obj);
                    if (obj.id == res.data.response.status) {
                        $scope.formData.emp_role_status = obj;

                    }
                });
                angular.forEach($scope.role_list, function (obj, index) {
                    if (obj.id == res.data.response.role_id) {
                        $scope.formData.emp_role = $scope.role_list[index];
                    }
                });
                angular.forEach($scope.module_list, function (obj, index) {
                    if (obj.id == res.data.response.module_id) {
                        $scope.formData.module_id = $scope.module_list[index];

                    }
                });
            });

        // $scope.datePicker = Calendar.get_caledar();    
        // angular.element('#event_date').datepick({dateFormat: 'dd/mm/yyyy'}); 
    }

    $scope.deleteroles = function (id, index, role_Data) {
        var delCompAddressesUrl = $scope.$root.hr + "hr_values/delete_roles";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delCompAddressesUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        role_Data.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };


    $scope.onChangRoletype = function (id) {

        $('#model_pop_role').modal({
            show: true
        });
        //   $scope.model_role_pop = true;

        //  angular.element('#model_role_pop').click();
        // 	$scope.showroles = true;
        //  $scope.showroleslist = false;
        //  $scope.check_hrvalues_readonly = false;
        //  $scope.perreadonly = true;


        var role_url = $scope.$root.hr + "hr_values/get_parent_module_list";
        $http
            .post(role_url, { 'token': $scope.$root.token })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.module_list = res.data.response;
                    //	 console.log($scope.module_list);
                }
                //else toaster.pop('error', 'Error', "No company found!");
            });

        var getUrl = $scope.$root.hr + "hr_values/role_by_id";
        var postViewpopData = {
            'token': $scope.$root.token,
            'id': id
        };
        $http
            .post(getUrl, postViewpopData)
            .then(function (res) {

                $scope.formData.per_id = res.data.response.permisions;

                // 	var postData = {
                //  'token': $scope.$root.token,
                //  'id': res.data.response.module_id ,
                //  'permisions': res.data.response.permisions
                //  };	 
                //  var getchild = $scope.$root.hr+"hr_values/get_child_module_list_selected"; 
                //  $http
                //  .post(getchild, postData) 
                //  .then(function (res) { 
                //  $scope.childdata = res.data.response;  
                //  });	

                //  $.each($scope.module_list,function(index,obj){   
                //  if(obj.id == res.data.response.module_id){
                //  $scope.formData.module_id = $scope.module_list[index]; 
                //  // 	 console.log($scope.formData.module_id );
                //  }
                //  });  
            });
    }

    $scope.add_role_pop = function (formData) {
        $scope.formData.selectedList = $scope.childdata.filter(function (namesDataItem) {
            return namesDataItem.checked;
        });

        $scope.formData.employee_id = $stateParams.id;//$scope.$root.employee_id;
        $scope.formData.token = $scope.$root.token;
        $scope.formData.data = $scope.formFields;
        $scope.formData.tab_id_2 = 5;
        $scope.formData.roles_id = $scope.roles_id;

        $scope.formData.emp_roles = $scope.formData.emp_role !== undefined ? $scope.formData.emp_role.id : 0;
        $scope.formData.emp_role_statuss = $scope.formData.emp_role_status !== undefined ? $scope.formData.emp_role_status.id : 0;
        $scope.formData.module_ids = $scope.formData.module_id !== undefined ? $scope.formData.module_id.id : 0;
        var updaterole = $scope.$root.hr + "hr_values/update-hr-role";
        $http
            .post(updaterole, $scope.formData)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', res.data.msg);
                    $('#model_pop_role').modal('hide');
                    // $scope.model_role_pop = false;
                    // $timeout(function () {
                    $scope.getRoles();
                    // }, 1000);
                } else {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                }
            });
    }
    */


    // ------------- 	 Expenses 	 ----------------------------------------


    $scope.formDataExpense = {};
    $scope.getexpenses = function () {


        // if ($scope.$root.breadcrumbs[3] != undefined)
        //  $scope.$root.breadcrumbs[3].name = 'Expenses Information';

        if ($stateParams.id == undefined) {
            return;
        }

        var employee_id = $stateParams.id;

        $scope.showLoader = true;
        $scope.add_row_table = false;
        $scope.showexpenseslist = true;
        $scope.showexpenses = false;
        $scope.subexpensesform = false;
        $scope.subexpenseslist = false;

        $scope.row_sub_list_expenses_form = false;
        $scope.row_sub_list_expenses = false;


        $scope.show_tab_holiday = false;
        $scope.show_tab_expense = true;
        $scope.show_tab_fuel_cost = false;


        var API = $scope.$root.hr + "hr_values/expences_list";
        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'all': "1",
            'employee_id': employee_id,
            'page': $scope.item_paging.spage,
            //'country_keyword': angular.element('#search_sale_listing_data').val()
        };

        $http
            .post(API, $scope.postData)
            .then(function (res) {
                $scope.expenses = [];
                $scope.expense_columns = [];
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;


                    $scope.expenses = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.expense_columns.push({
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

        // $scope.showLoader = false;


        $scope.showsub_rowexpenses = false;
    }


    $scope.addexpenses = function (expenseForm) {

        $scope.expenseForm.employee_id = $stateParams.id;//$scope.$root.employee_id;
        $scope.expenseForm.token = $scope.$root.token;
        $scope.expenseForm.data = $scope.formFields;
        $scope.expenseForm.tab_id_2 = 6;
        $scope.expenseForm.expense_id = $scope.expense_id;


        $scope.expenseForm.expense_statuss = $scope.expenseForm.expense_status !== undefined ? $scope.expenseForm.expense_status.id : 0;
        $scope.expenseForm.vehicleTypes = $scope.expenseForm.vehicleType !== undefined ? $scope.expenseForm.vehicleType.id : 0;
        $scope.expenseForm.basecurrencys = $scope.$root.defaultCurrency;
        //$scope.formData.basecurrency !== undefined ? $scope.formData.basecurrency.id : 0;


        var updateexpece = $scope.$root.hr + "hr_values/update-hr-expense";


        $http
            .post(updateexpece, $scope.expenseForm)
            .then(function (res) {
                if (res.data.ack == true) {
                    if (expenseForm != 1)
                        toaster.pop('success', 'Info', res.data.msg);
                    $scope.expenseForm.id = res.data.id;
                    expenseForm.event_code = res.data.code;
                    // if(res.data.tab_change=="tab_expense"){    
                    // $scope.getexpenses();
                    if (res.data.id > 0) {
                        $scope.showexpensesEditForm(res.data.id);
                    } else {
                        $scope.showexpensesEditForm($scope.expenseForm.id);
                        // console.log($scope.formData.expense_id+"else");
                    }
                    // } 

                } else {
                    toaster.pop('error', 'Edit', res.data.error);
                    /*$timeout(function(){ $state.go('app.hr_listing'); }, 1000);*/
                }
            });

    }

    $scope.deleteexpenses = function (id) {
        var del_Url = $scope.$root.hr + "hr_values/delete_expence_main";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(del_Url, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        if ($scope.expenses.length == 0)
                            $scope.expense_columns = [];
                        $scope.getexpenses();
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    $scope.ConvertToPurchaseOrder = function (expense_id) {
        var isValid = true;
        console.log($scope.choices);
        angular.forEach($scope.choices, function (obj) {
            if (Number(obj.id) > 0 && Number(obj.category) == 0)
                isValid = false;
        });
        if (isValid) {
            var check_approvals = $scope.$root.setup + "general/check-for-approvals";
            //'warehouse_id': item.warehouses.id
            $http
                .post(check_approvals, {
                    'object_id': expense_id,
                    type: "5",
                    'token': $scope.$root.token
                })
                .then(function (res) {
                    if (res.data.ack == true) {
                        var cnvrt_Url = $scope.$root.hr + "hr_values/convert-expense-to-purchase-order";

                        $rootScope.quote_post_invoice_msg = "Are you sure you want to convert this expense to a Purchase Order?";

                        ngDialog.openConfirm({
                            template: '_confirm_quote_to_order_invoice_modal',
                            className: 'ngdialog-theme-default-custom'
                        }).then(function (value) {
                            $scope.showLoader = true;
                            $http
                                .post(cnvrt_Url, { id: expense_id, 'token': $scope.$root.token })
                                .then(function (res) {
                                    if (res.data.ack == true) {
                                        $scope.showLoader = false;
                                        toaster.pop('success', 'Success', $scope.$root.getErrorMessageByCode(229, ['Purchase Order']));
                                        $state.go("app.editsrmorder", { id: res.data.purchase_order_id });
                                    } else {
                                        $scope.showLoader = false;
                                        toaster.pop('error', 'Error', res.data.error);
                                    }
                                });
                        }, function (reason) {
                            console.log('Modal promise rejected. Reason: ', reason);
                        });
                    }
                    else {
                        var response = res.data.response;

                        if (Number(response[0].type) == 5) {
                            if (Number(response[0].prev_status) == -1 || Number(response[0].prev_status) == 3) {
                                var str = '';
                                if (Number(response[0].prev_status) == 3) {
                                    str = "Previously disapproved by " + response[0].responded_by + ", ";

                                }
                                //console.log($scope.choices[0]);
                                $rootScope.approval_message = str + "You need approval for this expense before converting into Purchase order.";
                                check_profit = 1;
                                ngDialog.openConfirm({
                                    template: '_confirm_approval_required_modal',
                                    className: 'ngdialog-theme-default-custom'
                                }).then(function (value) {
                                    $scope.showLoader = true;
                                    var check_approvals = $scope.$root.setup + "general/send-for-approval";
                                    //'warehouse_id': item.warehouses.id
                                    $http
                                        .post(check_approvals, {
                                            'object_id': expense_id,
                                            'object_code': $scope.expenseForm.event_code,
                                            'source_name': $scope.formData.first_name + ' ' + $scope.formData.last_name,
                                            'source_code': $scope.formData.user_code,
                                            'detail_id': $stateParams.id,
                                            'currency_code': $scope.choices[0].currencyCode,
                                            'code': $scope.expenseForm.event_code,
                                            'approval_id': response[0].id,
                                            'type': "5",
                                            'emp_id_1': response[0].emp_id_1,
                                            'emp_id_2': response[0].emp_id_2,
                                            'emp_id_3': response[0].emp_id_3,
                                            'emp_id_4': response[0].emp_id_4,
                                            'emp_id_5': response[0].emp_id_5,
                                            'emp_id_6': response[0].emp_id_6,
                                            'emp_email_1': response[0].emp_email_1,
                                            'emp_email_2': response[0].emp_email_2,
                                            'emp_email_3': response[0].emp_email_3,
                                            'emp_email_4': response[0].emp_email_4,
                                            'emp_email_5': response[0].emp_email_5,
                                            'emp_email_6': response[0].emp_email_6,
                                            'prev_status': response[0].prev_status,
                                            'token': $scope.$root.token
                                        })
                                        .then(function (res) {
                                            if (res.data.ack == true) {
                                                $scope.showLoader = false;
                                                toaster.pop('success', 'Success', 'Successfully Queued for Approvals');
                                                $scope.getexpenses();
                                                return;
                                            }
                                            else {
                                                $scope.showLoader = false;
                                                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(371));
                                                return;
                                            }
                                        });
                                },
                                    function (reason) {
                                        $scope.showLoader = false;
                                        console.log('Modal promise rejected. Reason: ', reason);
                                    });
                            }
                            else if (Number(response[0].prev_status) == 1) {
                                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(372));
                                return;
                            }
                            else if (Number(response[0].prev_status) == 0) {
                                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(391));
                                return;
                            }
                        }
                    }
                });
        }
        else {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Category in expenses']));
        }
    }

    $scope.GetApprovalStatus = function (object_id, type) {
        // type = 5 -> Expense, type = 6 -> Holiday
        $scope.approval_history = [];
        $scope.show_approval_btn = false;
        $scope.show_disapproval_btn = false;
        var postUrl_ref_cat = $scope.$root.setup + "general/get-approval-status";
        $scope.approval_object_id = object_id;
        $scope.approval_type = type;
        $http
            .post(postUrl_ref_cat, {
                'object_id': object_id,
                'type': type,
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.approval_history = res.data.response;
                    if ($scope.approval_history[$scope.approval_history.length - 1].statuss == 'Awaiting Approval' && Number($scope.approval_history[$scope.approval_history.length - 1].approver) == 1) {
                        $scope.show_approval_btn = true;
                        $scope.show_disapproval_btn = true;
                    }

                    if ($scope.approval_history[$scope.approval_history.length - 1].statuss == 'Approved' && Number($scope.approval_history[$scope.approval_history.length - 1].approver) == 1)
                        $scope.show_disapproval_btn = true;
                }
            });
        angular.element('#_approval_history').modal({ show: true });
    }

    $scope.ChangeApprovalStatus = function (status, comments) {
        var update_approvals_status = $scope.$root.setup + "general/update-approval-status";
        var id = $scope.approval_history[$scope.approval_history.length - 1].id;
        var req_by_email = $scope.approval_history[$scope.approval_history.length - 1].requested_by_email;
        var object_code = $scope.approval_history[$scope.approval_history.length - 1].object_code;
        if (status == 3 && (comments == undefined || comments.length == 0)) {
            toaster.pop('error', 'error', $scope.$root.getErrorMessageByCode(664));
            return;
        }
        $http
            .post(update_approvals_status, {
                'object_id': $scope.approval_object_id,
                'object_code': object_code,
                'detail_id': $stateParams.id,
                'id': id,
                'requested_by_email': req_by_email,
                'type': $scope.approval_type,
                'status': status,
                'comments': comments,
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.showLoader = false;
                    if (status == 2)
                        toaster.pop('success', 'Success', 'Successfully Approved');
                    else
                        toaster.pop('success', 'Success', 'Approval Rejected');
                    $scope.getHoliday();
                    return;
                }
                else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(371));
                    // return;
                }
            });
    }
    $scope.get_data = function (expense_id, employee_id, sub_expense_id) {

        $scope.showsubform = true;
        $scope.exp_id = expense_id;
        $scope.employee_id = employee_id;

        if (employee_id == undefined) {
            $scope.employee_id = $stateParams.id;
        }


        /*{id: "1", name: "Vehicle"}, */
        $scope.category_expense = [{ id: "2", name: "Accomodation" }
            , { id: "3", name: "Travel" }, { id: "4", name: "Communication" }, { id: "5", name: "Entertainment" }
            , { id: "6", name: "Food" }, { id: "7", name: "Misc" }];

        /*	varUrl_curency = $scope.$root.hr+"hr_values/get_company_base_currency"; 
         $http
         .post(postUrl_curency, {'token':$scope.$root.token})
         .then(function (res) {
         if(res.data.ack == true){ 
         $scope.formData2.base_currency = res.data.response.name;  
         // console.log($scope.formData); 
         }    //else toaster.pop('error', 'Error', "No countries found!");
         });*/


        if (sub_expense_id != 0) {

            $scope.choices = [];
            var getUrl = $scope.$root.hr + "hr_values/sub_expence_data_by_id";
            var postViewBankData = {
                'token': $scope.$root.token,
                'id': sub_expense_id
            };
            $scope.sub_expense_id = sub_expense_id;
            $http
                .post(getUrl, postViewBankData)
                .then(function (res) {
                    $scope.formData2 = res.data.response;
                    //console.log($scope.formData2);

                    //	$scope.num_str = parseInt(res.data.response.amount, 10);  

                    if (res.data.response.event_sub_date != null) {
                        $scope.formData2.event_sub_date = $scope.$root.convert_unix_date_to_angular(res.data.response.event_sub_date);
                    }

                    if (res.data.response.category != null) {
                        angular.forEach($scope.category_expense, function (obj, index) {
                            if (obj.id == res.data.response.category) {
                                $scope.formData2.category = $scope.category_expense[index];

                            }
                        });
                    }
                    if (res.data.response.currency != null) {
                        angular.forEach($rootScope.arr_currency, function (obj, index) {
                            if (obj.id == res.data.response.currency) {
                                $scope.formData2.currency = $rootScope.arr_currency[index];

                            }
                        });
                    }
                });
        }

        if (sub_expense_id == 0) {
            $scope.check_sub_readonly = false;
            $scope.formData2.currency = '';
            $scope.formData2.amount = '';
            $scope.formData2.exchange_rate = '';
            $scope.formData2.invoice_id = '';
            $scope.formData2.event_sub_date = '';
            $scope.formData2.exp_image = '';
            $scope.formData2.exchange_description = '';
            $("#currency").val('');
            $("#amount").val('');
            $("#invoice_id").val('');
            $("#exchange_rate").val('');
            $("#event_sub_date").val('');
            $("#exp_image").val('');
            $("#exchange_description").val('');

        }

        //   $scope.datePicker = Calendar.get_caledar();   
        //	   angular.element('#editEventFromDate').datepick();
        // angular.element('#event_sub_date').datepick({dateFormat: 'dd/mm/yyyy'});
    }

    $scope.onChangecat = function () {
        //var m_id = this.formData.category.value; 

        $scope.expenses_sub.push(
            {
                /*		column1: 'row #' + $scope.expenses_sub.length,
                 column2: 'this is new',
                 column3: true ,*/
                category: '',
                currency: '',
                amount: '',
                base_currency: '',
                exchange_rate: '',
                exchange_description: '',
                invoice_id: '',
                event_sub_date: '',
                exp_image: ''
            }
        );

    }

    $scope.adddatasubexpences = function (formData2) {

        $scope.formData2.employee_id = $stateParams.id;
        $scope.formData2.token = $scope.$root.token;
        $scope.formData2.tab_id_2 = 7;
        $scope.formData2.tab_data = $scope.expenses_sub;

        var updatesubexpe = $scope.$root.hr + "hr_values/update-hr-subexpense";

        $http
            .post(updatesubexpe, $scope.formData2)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', res.data.msg);
                    //$scope.showsubform = false; 
                    //  $timeout(function(){$scope.getsubexpenses($scope.exp_id); }, 1000);
                    // if(res.data.tab_change=="tab_expense_detail"){    

                    // $state.go("app.hredit_values",{id:res.data.employee_id} );  
                    // $state.go("app.hr_listing");
                    //this.hide(); 
                    //$scope.reload();
                    //$window.location.reload()
                    // } 

                } else {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                }
            });
    };

    $scope.adddata = function (formData2) {

        $scope.formData2.employee_id = $stateParams.id;//$scope.$root.employee_id; 
        $scope.formData2.token = $scope.$root.token;
        $scope.formData2.data = $scope.formFields;
        $scope.formData2.tab_id_2 = 7;
        $scope.formData2.sub_expense_id = $scope.sub_expense_id;
        $scope.formData2.exp_id = $scope.exp_id;

        var updatesubexpe = $scope.$root.hr + "hr_values/update-hr-subexpense";

        var counter = 0;
        var amount = document.getElementById('amount').value;
        var invoice_id = document.getElementById('invoice_id').value;
        if ((amount == 0) || (invoice_id == 0)) {
            counter++;
        }
        // console.log(counter);

        if (counter > 0) {
            $scope.empty_form = true;
            jQuery("html, body").animate({
                scrollTop: 0
            }, "slow");
            jQuery("html, body").animate({
                scrollTop: '+=500px'
            });
            return true;
        } else {
            $scope.empty_form = false;
        }

        $http
            .post(updatesubexpe, $scope.formData2)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', res.data.msg);
                    $scope.showsubform = false;
                    $scope.getsubexpenses($scope.exp_id);
                    // if(res.data.tab_change=="tab_expense_detail"){    

                    // $state.go("app.hredit_values",{id:res.data.employee_id} );  
                    // $state.go("app.hr_listing");
                    //this.hide(); 
                    //$scope.reload();
                    //$window.location.reload()
                    // } 

                } else {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                }
            });
    };

    $scope.fnexpensesForm = function () {
        $scope.expenseForm = {};
        /* $scope.expense_status_list = [{ 'name': 'Queued For Approval', 'id': 0 }, { 'name': 'Awaiting Approval', 'id': 1 }, { 'name': 'Approved', 'id': 2 }
            , { 'name': 'Rejected', 'id': 3 }]; */
        $scope.expense_status_list = [{ 'name': 'In Progress', 'id': 0 }, { 'name': 'Queued For Approval', 'id': 0 }, { 'name': 'Awaiting Approval', 'id': 1 }, { 'name': 'Approved', 'id': 2 }
            , { 'name': 'Disapproved', 'id': 3 }, { 'name': 'Cancel Rejected', 'id': 4 }, { 'name': 'Not Responded', 'id': 5 }, { 'name': 'Un Locked', 'id': 6 }, { 'name': 'On Hold', 'id': 7 }];

        $scope.expenseForm.expense_status = $scope.expense_status_list[0];

        $scope.showexpenseslist = false;
        $scope.check_hrexpenses_readonly = false;
        $scope.check_expense_form_readonly = false;

        $scope.showexpenses = true;
        // $scope.getCodeexpence();
        $scope.expense_id = 0;

        $scope.expenseForm.event_name = '';
        $scope.expenseForm.event_code = '';
        $scope.expenseForm.event_code = '';
        $scope.expenseForm.event_description = '';
        $scope.expenseForm.event_date = $scope.$root.get_current_date();
        $scope.expenseForm.emp_name = $scope.formData.first_name + ' ' + $scope.formData.last_name;

    }


    var expUrl = $scope.$root.hr + "hr_values/expences_sublist";

    $scope.fnsubexpensesForm = function () {

        $scope.subexpenseslist = false;
        $scope.subexpensesform = true;

        $scope.formData.currency = '';
        $scope.formData.amount = '';
        $scope.formData.base_currency = '';
        $scope.formData.exchange_rate = '';
        $scope.formData.invoice_id = '';
        $scope.formData.event_sub_date = '';
        $scope.formData.exp_image = '';
        $scope.formData.exchange_description = '';


        $scope.employee_id = $stateParams.id;
        /*{id: "1", name: "Vehicle"},*/
        $scope.category_expense = [{ id: "2", name: "Accomodation" }
            , { id: "3", name: "Travel" }, { id: "4", name: "Communication" }, { id: "5", name: "Entertainment" }
            , { id: "6", name: "Food" }, { id: "7", name: "Misc" }];


    }

    $scope.add_sub_expense = function (expense_id) {

        $scope.datePicker = Calendar.get_caledar();
        //$scope.showexpenceform = false;
        /*	 $scope.check_hrvalues_readonly = false;
         $scope.perreadonly = true;*/
        $scope.showexpenseslist = false;
        $scope.subexpensesform = false;
        $scope.subexpenseslist = true;


        $scope.exp_id = expense_id;
        // console.log($scope.exp_id); 
        var employee_id = $stateParams.id;

        $scope.rec_document = {};
        var postData = {
            'token': $scope.$root.token,
            'all': 1,
            'expense_id': expense_id,
            'employee_id': employee_id,
        };

        $http
            .post(expUrl, postData)
            .then(function (res) {
                console.log(res.data.response);
                if (res.data.ack == true) {

                    $scope.expenses_sub = res.data.response;
                    // console.log(res.data.response);

                    $scope.check_expense_form_readonly = true;
                    /* angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    }); */
                }
            });
    }

    $scope.getsubexpenses = function (expense_id) {

        var employee_id = $stateParams.id;

        $scope.subexpenseslist = true;
        $scope.subexpensesform = false;


        $scope.expenses_sub = [];
        $scope.columns = [];
        var vm = this;

        var postData = {};
        $scope.expenses_sub = {};
        var postData = {
            'token': $scope.$root.token,
            'all': 1,
            'expense_id': expense_id,
            'employee_id': employee_id
        };

        $http
            .post(expUrl, postData)
            .then(function (res) {
                console.log(res.data.response);
                if (res.data.ack == true) {

                    $scope.expenses_sub = res.data.response;
                    console.log($scope.expenses_sub);
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

    $scope.showexpensessubEditForm = function (id) {


        //$scope.datePicker = Calendar.get_caledar(); 
        /*	 $scope.check_hrvalues_readonly = false;
         $scope.perreadonly = true;*/
        $scope.showexpenseslist = false;
        $scope.subexpensesform = true;
        $scope.subexpenseslist = false;


        //{id: "1", name: "Vehicle"},
        $scope.category_expense = [{ id: "2", name: "Accomodation" }
            , { id: "3", name: "Travel" }, { id: "4", name: "Communication" }, { id: "5", name: "Entertainment" }
            , { id: "6", name: "Food" }, { id: "7", name: "Misc" }];


        /*	varUrl_curency = $scope.$root.hr+"hr_values/get_company_base_currency"; 
         $http
         .post(postUrl_curency, {'token':$scope.$root.token})
         .then(function (res) {
         if(res.data.ack == true){ 
         $scope.formData.base_currency = res.data.response.name;  
         // console.log($scope.formData); 
         }    //else toaster.pop('error', 'Error', "No countries found!");
         }); */


        /*
         $scope.rec_document = {};  
         var postData = {
         'token': $scope.$root.token,
         'all': 1,
         'expense_id':expense_id,
         };

         $http
         .post(expUrl, postData)
         .then(function (res) {
         if(res.data.ack == true){

         $scope.expenses_sub = res.data.response;

         angular.forEach(res.data.response[0],function(val,index){
         $scope.columns.push({
         'title':toTitleCase(index),
         'field':index,
         'visible':true
         }); 
         }); 
         }
         }); */


        $scope.showLoader = true;


        var getUrl = $scope.$root.hr + "hr_values/sub_expence_data_by_id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };
        $scope.sub_expense_id = id;
        // console.log($scope.sub_expense_id);

        // $timeout(function(){
        $http
            .post(getUrl, postViewBankData)
            .then(function (res) {
                $scope.formData = res.data.response;
                //console.log($scope.formData);

                //	$scope.num_str = parseInt(res.data.response.amount, 10);  

                if (res.data.response.event_sub_date != null) {
                    $scope.formData.event_sub_date = $scope.$root.convert_unix_date_to_angular(res.data.response.event_sub_date);
                }

                if (res.data.response.category != null) {
                    angular.forEach($scope.category_expense, function (obj, index) {
                        if (obj.id == res.data.response.category) {
                            $scope.formData.category = $scope.category_expense[index];

                        }
                    });
                }
                if (res.data.response.currency != null) {
                    angular.forEach($rootScope.arr_currency, function (obj, index) {
                        if (obj.id == res.data.response.currency) {
                            $scope.formData.currency = $rootScope.arr_currency[index];

                        }
                    });
                } else {
                    angular.forEach($rootScope.arr_currency, function (obj, index) {
                        if (obj.id == $scope.$root.defaultCurrency) {
                            console.log(obj.id + "currency default");
                            $scope.formData.currency = $rootScope.arr_currency[index];

                        }
                    });
                }
            });

        $scope.showLoader = false;
        //	}, 2000);


    }

    $scope.product_type = true;
    $scope.count_result = 0;
    $scope.getCodeexpence = function () {
        var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
        var name = $scope.$root.base64_encode('employee_expenses');
        var no = $scope.$root.base64_encode('event_no');

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
                'type': '',
                'status': ''
            })
            .then(function (res) {

                if (res.data.ack == 1) {
                    $scope.showLoader = false;
                    $scope.formData.event_code = res.data.code;
                    $scope.formData.event_no = res.data.nubmer;
                    //console.log(res.data.code+" "+res.data.nubmer);
                    //$scope.rec.code_type = module_category_id;//res.data.code_type;
                    $scope.count_result++;

                    /* if (res.data.type == 1) {
                     $scope.product_type = false;
                     } else {
                     $scope.product_type = true;
                     }*/

                    if ($scope.count_result > 0) {
                        //  console.log($scope.count_result);
                        return true;
                    } else {
                        //    console.log($scope.count_result + 'd');
                        return false;
                    }

                } else {
                    toaster.pop('error', 'info', res.data.error);
                    return false;
                }
            });


    }


    //--------------------   sub Expenses -------------------


    var postUrl_curency = $scope.$root.hr + "hr_values/get_company_base_currency";

    //new method 10 default 
    $scope.choices = {};
    $scope.arr_personal_expense = {};
    $scope.arr_company_expense = {};
    $scope.arr_fuel_cost_deduction = {};
    //$scope.choices = [{ sort_id: '1' }, { sort_id: '2' }, { sort_id: '3' }, { sort_id: '4' }, { sort_id: '5' }, { sort_id: '6' }, { sort_id: '7' }, { sort_id: '8' }, { sort_id: '9' }, { sort_id: '10' }, { sort_id: '11' }, { sort_id: '12' }, { sort_id: '13' }, { sort_id: '14' }, { sort_id: '15' }, { sort_id: '16' }, { sort_id: '17' }, { sort_id: '18' }, { sort_id: '19' }, { sort_id: '20' }];
    // $scope.arr_personal_expense = [{ sort_id: '1' }, { sort_id: '2' }, { sort_id: '3' }, { sort_id: '4' }, { sort_id: '5' }, { sort_id: '6' }, { sort_id: '7' }, { sort_id: '8' }, { sort_id: '9' }, { sort_id: '10' }, { sort_id: '11' }, { sort_id: '12' }, { sort_id: '13' }, { sort_id: '14' }, { sort_id: '15' }, { sort_id: '16' }, { sort_id: '17' }, { sort_id: '18' }, { sort_id: '19' }, { sort_id: '20' }];
    // $scope.arr_company_expense = [{ sort_id: '1' }, { sort_id: '2' }, { sort_id: '3' }, { sort_id: '4' }, { sort_id: '5' }, { sort_id: '6' }, { sort_id: '7' }, { sort_id: '8' }, { sort_id: '9' }, { sort_id: '10' }, { sort_id: '11' }, { sort_id: '12' }, { sort_id: '13' }, { sort_id: '14' }, { sort_id: '15' }, { sort_id: '16' }, { sort_id: '17' }, { sort_id: '18' }, { sort_id: '19' }, { sort_id: '20' }];
    // $scope.arr_fuel_cost_deduction = [{ sort_id: '1' }, { sort_id: '2' }, { sort_id: '3' }, { sort_id: '4' }, { sort_id: '5' }, { sort_id: '6' }, { sort_id: '7' }, { sort_id: '8' }, { sort_id: '9' }, { sort_id: '10' }, { sort_id: '11' }, { sort_id: '12' }, { sort_id: '13' }, { sort_id: '14' }, { sort_id: '15' }, { sort_id: '16' }, { sort_id: '17' }, { sort_id: '18' }, { sort_id: '19' }, { sort_id: '20' }];
    $scope.choices = [{ sort_id: '1' }];
    $scope.arr_personal_expense = [{ sort_id: '1' }];
    $scope.arr_company_expense = [{ sort_id: '1' }];
    $scope.arr_fuel_cost_deduction = [{ sort_id: '1' }];
    $scope.showEditFormExpense = function () {
        $scope.check_hrexpenses_readonly = false;
        //$scope.perreadonly = true;
    }
    $scope.vt = '';
    $scope.showexpensesEditForm = function (id) {
        $scope.expenseForm = {};
        $scope.expense_status_list = [{ 'name': 'In Progress', 'id': -1 }, { 'name': 'Queued For Approval', 'id': 0 }, { 'name': 'Awaiting Approval', 'id': 1 }, { 'name': 'Approved', 'id': 2 }
        , { 'name': 'Disapproved', 'id': 3 }, { 'name': 'Cancel Rejected', 'id': 4 }, { 'name': 'Not Responded', 'id': 5 }, { 'name': 'Un Locked', 'id': 6 }, { 'name': 'On Hold', 'id': 7 }];

        var employee_id = $stateParams.id;
        $scope.expense_id = id;
        $scope.expenseForm.expense_id = id;
        $scope.expenseForm.status = 1;
        $scope.formData2.expense_id = id;
        $scope.expenseForm.exp_id = id;
        $scope.expenseForm.id = id;
        $scope.expenseForm.emp_name = $scope.formData.first_name + ' ' + $scope.formData.last_name;
        $scope.base_currency_expense = '';
        $scope.expense_status_readonly = false;
        if (id > 0) {

            $scope.check_hrexpenses_readonly = true;
            $scope.check_expense_form_readonly = true;

            //$scope.check_hrexpenses_vt_readonly = true;
        }


        $scope.choices = [];
        var getUrl = $scope.$root.hr + "hr_values/expence_data_by_id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };
        //  angular.element('#event_sub_date').datepick({dateFormat: 'dd/mm/yyyy'} );
        $scope.showLoader = true;
        //  $timeout(function(){

        $http
            .post(getUrl, postViewBankData)
            .then(function (res) {

                $scope.expenseForm.base_currency_expense = $scope.$root.defaultCurrency;
                //console.log($scope.$root.defaultCurrency);
                $scope.expenseForm.event_name = res.data.response.event_name;
                $scope.expenseForm.event_code = res.data.response.event_code;
                $scope.expenseForm.event_description = res.data.response.event_description;
                $scope.expenseForm.status = res.data.response.status;

                //  $scope.formData.event_date = $scope.$root.convert_unix_date_to_angular(res.data.response.event_date);


                if (res.data.response.event_date == 0)
                    $scope.expenseForm.event_date = null;
                else
                    $scope.expenseForm.event_date = $scope.$root.convert_unix_date_to_angular(res.data.response.event_date);


                angular.forEach($scope.expense_status_list, function (obj, index) {
                    if (obj.id == res.data.response.expense_status) {
                        $scope.expense_status_readonly = (Number(res.data.response.expense_status) == 2) ? true : false;
                        $scope.expenseForm.expense_status = $scope.expense_status_list[index];

                    }
                });
                // for no record in approval table
                if (res.data.response.approvalStatus < 0) {
                    $scope.expense_status_list[0].name = "In Progress";
                }
                angular.forEach($scope.arr_vehicle_expense, function (obj, index) {
                    if (obj.id == res.data.response.vehicleType) {
                        $scope.expenseForm.vehicleType = $scope.arr_vehicle_expense[index];
                        //console.log(res.data.response.vehicleType);
                    }
                });
                $scope.vt = res.data.response.vehicleType;
                if ($scope.vt == 1) {
                    //$timeout(function () {
                    angular.element('.personelVehicle a').click();
                    angular.element('.personelVehicle').removeClass('dont-click');
                    //}, 500);

                }
                if ($scope.vt == 2) {
                    // $timeout(function () {
                    angular.element('.companyVehicle a').click();
                    angular.element('.companyVehicle').removeClass('dont-click');
                    // }, 500);
                    //console.log($scope.vt);
                }

                angular.forEach($rootScope.arr_currency, function (obj, index) {
                    if (obj.id == res.data.response.base_currency) {
                        $scope.expenseForm.basecurrency = $rootScope.arr_currency[index];

                    }
                });
            });

        /*{id: "1", name: "Vehicle"},*/
        $scope.category_expense = [
            { id: "1", name: "Accomodation" },
            { id: "2", name: "Travel" },
            { id: "3", name: "Communication" },
            { id: "4", name: "Entertainment" },
            { id: "5", name: "Food" },
            { id: "6", name: "Misc" }];

        $scope.total_sub = 0;
        $scope.total_amount = 0;
        $scope.total_exchange_rate = 0;
        $scope.total_final = 0;
        $scope.amount = 0;
        $scope.exchange_rate = 0;

        $scope.showsubexpnselisting = true;
        var postData = {
            'token': $scope.$root.token,
            'all': 1,
            'expense_id': id,
            'employee_id': employee_id
        };
        $http
            .post(expUrl, postData)
            .then(function (res) {
                $scope.choices = [];
                ///   console.log(res);
                // console.log(res.data.response);
                if (res.data.ack == true) {

                    //if (res.data.total > 0) {

                    $scope.choices = res.data.response;


                    angular.forEach($scope.choices, function (_choice, _idx) {
                        angular.forEach($scope.category_expense, function (_cat) {
                            if (_cat.id == _choice.category) {
                                $scope.choices[_idx].categoryName = _cat.name;
                            }
                        })

                    })
                    // #pointer
                    //$scope.expenses_sub = res.data.response;
                    $scope.total_grand = res.data.total_grand;

                    // console.log(res.data.response);
                    // var new_add = 10 - res.data.total;

                    var newItemNo = 0;
                    var new_add = res.data.total;
                    /*console.log(new_add);
                     console.log(newItemNo);*/
                    //if (new_add > 0 && new_add < 11) {
                    if (new_add > 0) {


                        // newItemNo = $scope.choices.length + new_add;
                        newItemNo = $scope.choices.length;
                        var start = (parseFloat(res.data.total)) + 1;

                        // 	console.log(start);	console.log(newItemNo);
                        for (var i = start; i <= newItemNo; i++) {
                            //	var object = $scope.new_add[i];
                            $scope.choices.push({ sort_id: [i] }); //object.i
                        }

                    }
                    //}
                    $scope.showLoader = false;
                }
                else {
                    // for (var i = 0; i <= 11; i++) 
                    {
                        $scope.choices.push({ sort_id: 1, 'currency': $scope.$root.defaultCurrency, 'exchange_rate': 1, 'exp_image': '' });
                    }
                    $scope.showLoader = false;
                }
            });

        // $scope.showLoader = false;
        jQuery("html, body").animate({
            scrollTop: '+=1500px'
        });
        //  }, 1000); 

        //	var basecurrency1 = this.formData.base_currency_expense.value;	 console.log(basecurrency1);	
        //	var basecurrency2 =document.getElementById('base_currency_expense').value; 	 console.log(basecurrency2);	

        $scope.showsub_rowexpenses = true;
        $scope.row_sub_list_expenses_form = true;
        $scope.row_sub_list_expenses = true;
        $scope.showexpenseslist = false;
        $scope.showexpenses = true;

        if (id != undefined) {
            /*	 $scope.check_hrvalues_readonly = false;
             $scope.perreadonly = true;*/
        }
        $scope.new_button = true;
    }


    $scope.check_for_default_exchange_rate = function (expense_currency) {
        console.log(expense_currency);
        console.log($scope.$root.defaultCurrency);

    }


    $scope.addNewChoice = function () {
        jQuery("html, body").animate({
            scrollTop: '+=500px'
        });
        var newItemNo = $scope.choices.length + 1;
        $scope.choices.push({ 'id': $scope.choices.length });
    };

    $scope.deletesubexpenses = function (id, index, exp_sub, amount) {

        // console.log(amount);
        if (id > 0) {
            var del_sub_exp = $scope.$root.hr + "hr_values/delete_expence_sub";

            ngDialog.openConfirm({
                template: 'modalDeleteDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                $http
                    .post(del_sub_exp, { id: id, 'token': $scope.$root.token })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                            //    exp_sub.splice(index, 1);
                            $scope.getsubexpenses_final_list($scope.expenseForm.expense_id);
                        } else {
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                        }
                    });
            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });

        }
        else {
            $scope.choices.splice(index, 1);
            if ($scope.choices.length == 0)
                $scope.addNewChoice_exp();
        }


        /*  var lastItem = $scope.choices.length-1;
         $scope.choices.splice(lastItem);*/
    };

    $scope.deletesubexpensesPV = function (id, index) {

        // console.log(amount);
        if (id > 0) {
            var del_sub_exp = $scope.$root.hr + "hr_values/delete_expence_sub_pv";

            ngDialog.openConfirm({
                template: 'modalDeleteDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                $http
                    .post(del_sub_exp, { id: id, 'token': $scope.$root.token })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                            $scope.arr_personal_expense.splice(index, 1);
                        } else {
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                        }
                    });
            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });

        }
        else {
            $scope.arr_personal_expense.splice(index, 1);
            if ($scope.arr_personal_expense.length == 0)
                $scope.addNewChoice_PV();
        }


        /*  var lastItem = $scope.choices.length-1;
         $scope.choices.splice(lastItem);*/
    };

    $scope.deletesubexpensesCV = function (id, index) {

        // console.log(amount);
        if (id > 0) {
            var del_sub_exp = $scope.$root.hr + "hr_values/delete_expence_sub_cv";

            ngDialog.openConfirm({
                template: 'modalDeleteDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                $http
                    .post(del_sub_exp, { id: id, 'token': $scope.$root.token })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                            $scope.arr_company_expense.splice(index, 1);
                        } else {
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                        }
                    });
            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });

        }
        else {
            $scope.arr_company_expense.splice(index, 1);
            if ($scope.arr_company_expense.length == 0)
                $scope.addNewChoice_CV();
        }


        /*  var lastItem = $scope.choices.length-1;
         $scope.choices.splice(lastItem);*/
    };

    $scope.submitnew_all = function (choices) {

        var rec = {};
        rec.token = $scope.$root.token;
        rec.tab_id_2 = 7;
        rec.employee_id = $stateParams.id;
        rec.expence_id = $scope.expenseForm.id;
        rec.data = $scope.choices;

        if (!$scope.expenseForm.event_name || $scope.expenseForm.event_name.trim() == "") {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Name']));
            return;
        }

        angular.forEach($scope.choices, function (obj, index) {
            if (!obj.amount) {
                obj.amount = 0;
            }
            if (isNaN(obj.total_sub)) {
                obj.total_sub = 0;
            }
        });

        $scope.addexpenses(1);

        // console.log('$scope.choices: ', $scope.choices); return;
        /*console.log($scope.choices);
         console.log($scope.choices[0]);*/
        // $scope.choices[0].exp_image = $scope.formDataExpense.exp_image;
        //rec.data2 = $scope.formDataExpense;

        /*console.log($scope.choices[0].exp_image);
         console.log($scope.choices[1].exp_image);
         console.log($scope.choices[2].exp_image);
         // console.log($scope.formDataExpense);
         console.log(rec);*/

        var updatesubexpe = $scope.$root.hr + "hr_values/update-hr-subexpense";

        $http
            .post(updatesubexpe, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', res.data.msg);
                    $scope.add_row_table = false;
                    $scope.getsubexpenses_final_list($scope.expenseForm.expense_id);
                }

            });
    }


    $scope.change_exchange_rate = function (exchange_index) {
        /*console.log($scope.defaultCurrency);
         console.log(exchange_index);*/
        var def_conversion_rate;

        var currency_id = $scope.choices[exchange_index].currency; //angular.element($('#currency' + exchange_index)).val();

        if (currency_id != $scope.defaultCurrency) {

            var currencyURL = $scope.$root.sales + "customer/customer/get-currency-conversion-rate";
            $http
                .post(currencyURL, { 'token': $scope.$root.token, 'id': currency_id, 'or_date': $scope.expenseForm.event_date })
                .then(function (res) {

                    if (res.data.ack == true && res.data.response.conversion_rate > 0) {
                        def_conversion_rate = res.data.response.conversion_rate;

                        $scope.choices[exchange_index].exchange_rate = def_conversion_rate;
                    }
                    else {
                        $scope.choices[exchange_index].exchange_rate = 1;
                    }
                });
        }
        else {
            $scope.choices[exchange_index].exchange_rate = 1;
        }
        angular.forEach($scope.currency_list, function (currency, index) {
            if ($scope.choices[exchange_index].currency == currency.id) {
                $scope.choices[exchange_index].currencyCode = currency.code;
            }
        });
    }


    $scope.getsubexpenses_final_list = function (expense_id) {
        /* jQuery("html, body").animate({
         scrollTop: 0
         }, "slow");
         jQuery("html, body").animate({
         scrollTop: '+=1500px'
         }); */
        var postData = {
            'token': $scope.$root.token,
            'all': 1,
            'expense_id': $scope.expense_id,
            'employee_id': $stateParams.id
        };
        $http
            .post(expUrl, postData)
            .then(function (res) {

                if (res.data.ack == true) {


                    // if (res.data.total > 0) {
                    $scope.choices = res.data.response;
                    $scope.total_grand = res.data.total_grand;
                    $scope.check_expense_form_readonly = true;
                    //console.log(res.data.response);
                    //var new_add = 20 - res.data.total;
                    var new_add = res.data.total;
                    //console.log(new_add);	console.log(newItemNo);
                    //if (new_add > 0 && new_add < 21) {
                    if (new_add > 0) {
                        // var newItemNo = $scope.choices.length + new_add;
                        var newItemNo = $scope.choices.length;

                        var start = (parseFloat(res.data.total)) + 1;

                        //	console.log(start);	console.log(newItemNo);
                        for (var i = start; i <= newItemNo; i++) {
                            //	var object = $scope.new_add[i];
                            $scope.choices.push({ sort_id: [i] }); //object.i
                        }
                    }
                    //}

                }
                else {
                    $scope.choices = [];
                    $scope.addNewChoice_exp();
                }
            });

    }

    $scope.row_amount = function (item) {
        var subtotal = 0;
        var subtotal = item.amount * item.exchange_rate;
        return subtotal;
    }

    $scope.net_total_amount = function () {
        var total = 0;

        angular.forEach($scope.choices, function (item) {
            //if (typeof item.amount == 'undefined') item.amount = 0;
            item.total_sub = item.amount / item.exchange_rate;
            total += Number(item.total_sub.toFixed(2));
            item.total_sub = item.total_sub.toFixed(2);
        });

        $scope.total_grand = total;

        return total;
    }
    //new method 10 default


    //subexpenses add final
    $scope.add_subexpense = function (formData2) {

        //	$scope.formDatas.employee_id = $stateParams.id;//$scope.$root.employee_id;
        $scope.formData.token = $scope.$root.token;
        $scope.formData.data = $scope.formData2;
        $scope.formData.tab_id_2 = 7;
        $scope.formData.sub_expense_id = $scope.sub_expense_id;
        $scope.formData.exp_id = $scope.exp_id;

        /*$scope.formData.currencys = $scope.formData.currency !== undefined ? $scope.formData.currency.id:0;
         $scope.formData.categorys = $scope.formData.category !== undefined ? $scope.formData.category.id:0;
         */
        var updatesubexpe = $scope.$root.hr + "hr_values/update-hr-subexpense";

        $http
            .post(updatesubexpe, $scope.formData)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', res.data.msg);
                    $scope.add_row_table = false;
                    $scope.getsubexpenses_final_list($scope.expense_id);
                } else {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                }
            });
    }

    $scope.shownew = function (classname) {
        // console.log(classname);

        $scope.add_row_table = false;
        $(".new_button_" + classname).hide();
        $(".replace_button_" + classname).show();

        $(".new_" + classname).removeAttr("disabled");
        // document.getElementByClass(classname).disabled = false;


        $scope.category_expense = [{ id: "2", name: "Accomodation" }
            , { id: "3", name: "Travel" }, { id: "4", name: "Communication" }, { id: "5", name: "Entertainment" }
            , { id: "6", name: "Food" }, { id: "7", name: "Misc" }];


        var getUrl = $scope.$root.hr + "hr_values/sub_expence_data_by_id";
        var postViewData = {
            'token': $scope.$root.token,
            'id': classname
        };

        $http
            .post(getUrl, postViewData)
            .then(function (res) {
                //	$scope.rows.splice($scope.rows.indexOf(oldObj),1, objToReplace)

                // $('.'+classname).find('#category option:selected').val();
                // console.log(res.data.response.category);
                /* if(res.data.response.category!=null)
                 {
                 $.each($scope.category_expense,function(index,obj){ 
                 //   console.log( obj.id +'====='+ res.data.response.category);
                 if( obj.id==res.data.response.category){
                 $scope.formData.category = $scope.category_expense[index];
                 // console.log($scope.formData.category );
                 }
                 }); 
                 }*/


            });


    }

    $scope.submitnew = function (Arraydata) {

        var e_id = this.formData.id;
        $scope.formData.token = $scope.$root.token;
        $scope.formData.tab_id_2 = 7;
        $scope.formData.sub_expense_id = e_id;
        $scope.formData.data = Arraydata;
        // console.log( $scope.formData.data);   
        //$scope.formData.currencys = $scope.formData.currency !== undefined ? $scope.formData.currency.id:0;
        //$scope.formData.categorys = $scope.formData.category !== undefined ? $scope.formData.category.id:0;
        var updatesubexpe = $scope.$root.hr + "hr_values/update-hr-subexpense";

        $http
            .post(updatesubexpe, $scope.formData)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', res.data.msg);
                    $scope.add_row_table = false;
                    $scope.getsubexpenses_final_list($scope.expense_id);
                } else {
                    toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
                }
            });
    }

    $scope.submitcancel = function (classname) {
        //  console.log(classname);

        $scope.getsubexpenses_final_list($scope.expense_id);
        // $(".new_button_"+classname).hide(); 
        // $(".replace_button_"+classname).hide();
        //  $scope.add_row_table  = true;

    }

    $scope.deletesubexpenses2 = function (id, index, exp_sub) {
        var delCompAddressesUrl = $scope.$root.hr + "hr_values/delete_expence_sub";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(delCompAddressesUrl, { id: id, 'token': $scope.$root.token })
                .then(function (res) {
                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        exp_sub.splice(index, 1);
                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    $scope.add_option_row = function (expense_id) {


        var basecurrency1 = this.formData.basecurrency.value;
        var basecurrency2 = document.getElementById('basecurrency').value;

        // console.log(basecurrency1);// 	console.log(basecurrency2);


        $scope.add_row_table = true;
        $scope.formData2.category = '';
        $scope.formData2.currency = '';
        $scope.formData2.amount = '';
        $scope.formData2.exchange_rate = '';
        $scope.formData2.exp_image = '';
        $scope.formData2.exchange_description = '';


        $("#category").val('');
        $("#currency").val('');
        $("#exchange_rate").val('');
        $("#exp_image").val('');
        $("#exchange_description").val('');
    }

    $scope.resetnew = function () {
        $scope.add_row_table = false;


        $scope.formData2.category = '';
        $scope.formData2.currency = '';
        $scope.formData2.amount = '';
        $scope.formData2.exchange_rate = '';
        $scope.formData2.exp_image = '';
        $scope.formData2.exchange_description = '';


        $("#category").val('');
        $("#currency").val('');
        $("#exchange_rate").val('');
        $("#exp_image").val('');
        $("#exchange_description").val('');

    }


    //before final row

    $scope.showEdit_final = function (id) {

        $scope.category_expense = [{ id: "2", name: "Accomodation" }
            , { id: "3", name: "Travel" }, { id: "4", name: "Communication" }, { id: "5", name: "Entertainment" }
            , { id: "6", name: "Entertainment" }, { id: "7", name: "Misc" }];


        /*varUrl_curency = $scope.$root.hr+"hr_values/get_company_base_currency"; 
         $http
         .post(postUrl_curency, {'token':$scope.$root.token})
         .then(function (res) {
         if(res.data.ack == true){ 
         $scope.formData.base_currency = res.data.response.name;  
         // console.log($scope.formData); 
         }    //else toaster.pop('error', 'Error', "No countries found!");
         }); */


        var getUrl = $scope.$root.hr + "hr_values/sub_expence_data_by_id";
        var postViewBankData = {
            'token': $scope.$root.token,
            'id': id
        };
        $scope.sub_expense_id = id;
        // console.log($scope.sub_expense_id);

        // $timeout(function(){
        $http
            .post(getUrl, postViewBankData)
            .then(function (res) {
                //$scope.formData = res.data.response;
                //console.log($scope.formData); 
                $scope.formData.amount = res.data.response.amount;
                $scope.formData.exchange_rate = res.data.response.exchange_rate;
                //$scope.formData.invoice_id = res.data.response.invoice_id;
                $scope.formData.exchange_description = res.data.response.exchange_description;


                //	$scope.num_str = parseInt(res.data.response.amount, 10);  


                if (res.data.response.category != null) {
                    angular.forEach($scope.category_expense, function (obj, index) {
                        if (obj.id == res.data.response.category) {
                            $scope.formData.category = $scope.category_expense[index];

                        }
                    });
                }
                if (res.data.response.currency != null) {
                    angular.forEach($rootScope.arr_currency, function (obj, index) {
                        if (obj.id == res.data.response.currency) {
                            $scope.formData.currency = $rootScope.arr_currency[index];

                        }
                    });
                }
                /*	if(res.data.response.event_sub_date!= null) 	{
                 $scope.formData.event_sub_date= $scope.$root.convert_unix_date_to_angular(res.data.response.event_sub_date);
                 }
                 */

            });

        $scope.showLoader = false;
        //	}, 2000);


    }

    //--------------------   sub Expenses -------------------

    //ng-click="reload_popup(1,'model_btn_purchase')"
    $scope.reload_popup = function (div_id, div_model) {

        $('#' + div_model).modal('hide');
        if (div_id == 1)
            $scope.formData.department = $scope.dept_list[0];
        else if (div_id == 2)
            $scope.formData.employee_type = $scope.employee_type_list[0];
        else if (div_id == 3)
            $scope.formData.religion = $scope.religion_list[0];
        else if (div_id == 4) $scope.formData.folder_id = $scope.list_folder[0];

    }


    //Peronal Vehicle Expense.

    $scope.searchKeyword = '';
    $scope.count_filter_item = function (arry) {

        var brand = '';
        var cat = '';
        if ($scope.searchKeyword.brand_name != undefined) brand = $scope.searchKeyword.brand_name;
        if ($scope.searchKeyword.category_name != undefined) cat = $scope.searchKeyword.category_name;

        var count = 0;
        var match_b = 0;
        var match_c = 0;

        console.log(document.getElementById('brnd'));
        console.log($('#brnd').attr('value'));
        console.log($('#brnd').val);
        console.log($scope.searchKeyword.brand_name);

        //if (obj.srh != null )   if (srh != null  || srh != undefined )

        angular.forEach(arry, function (obj, index) {

            if (brand == obj.brand_name) {
                if (obj.chk) match_b++;
            }
            if (cat == obj.category_name) {
                if (obj.chk) match_c++;
            }

            if (obj.chk) count++;
        });

        console.log(match_b);
        console.log(match_c);
        return Number(count) - Number(match_b + match_c);
    };

    $scope.getPersonaexpenses_final_list = function (expense_id) {
        $scope.$root.load_date_picker('Hr');
        //console.log(expense_id);
        /*jQuery("html, body").animate({
         scrollTop: 0
         }, "slow");
         jQuery("html, body").animate({
         scrollTop: '+=1500px'
         }); */
        //$scope.choices ='';
        var expense_id = $scope.expenseForm.expense_id;
        var postData = {
            'token': $scope.$root.token,
            'all': 1,
            'expense_id': expense_id,
            'employee_id': $stateParams.id
        };
        $scope.showLoader = true;
        $scope.arr_personal_expense = [];
        var perExpUrl = $scope.$root.hr + "hr_values/expences-perlist";
        $http
            .post(perExpUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {

                    // if (res.data.total > 0) 
                    {
                        $scope.arr_personal_expense = res.data.response;
                        $scope.total_grand_personal = res.data.total_grand;


                        /*console.log(res.data.calc_milage_total);
                         console.log(res.data.total);*/

                        $scope.calc_milage_total = res.data.calc_milage_total;

                        /*if ($scope.calc_milage_total > 10000) {

                         $scope.arr_vehicle_rate = [{name: 'Car and Van', id: '0.25'}, {
                         name: 'Motor cycles',
                         id: '0.24'
                         }, {name: 'Bicycle', id: '0.20'}];
                         }*/

                        var new_add = 20 - res.data.total;
                        //console.log(new_add);	console.log(newItemNo);
                        if (new_add > 0 && new_add < 21) {
                            var newItemNo = $scope.arr_personal_expense.length + new_add;

                            var start = (parseFloat(res.data.total)) + 1;

                            //	console.log(start);	console.log(newItemNo);
                            for (var i = start; i <= newItemNo; i++) {
                                //	var object = $scope.new_add[i]; 
                                $scope.arr_personal_expense.push({ sort_id: '' + [i] }); //object.i
                            }
                        }

                        angular.forEach($scope.arr_personal_expense, function (pvobj) {

                            // pvobj.total_sub = pvobj.total_sub.toFixed(2);

                            angular.forEach($scope.arr_vehicle_rate, function (vehObj) {
                                if (pvobj.pvehicleType == vehObj.id) {
                                    pvobj.vehicleName = vehObj.name;
                                    // pvobj.total_sub = pvobj.total_sub.toFixed(2);
                                }
                            });
                        });

                        /*$timeout(function () {
                         //$scope.showLoader = true; 
                         $scope.showLoader = true;
                         }, 2000);*/
                    }

                    $scope.showLoader = false;
                }
                else {
                    $scope.calc_milage_total = res.data.calc_milage_total;
                    $scope.showLoader = false;
                    $scope.addNewChoice_PV();
                }
            });

    }


    $scope.ChangeVehicleType = function (vehicleType, index) {
        angular.forEach($scope.arr_vehicle_rate, function (vehRateObj) {
            if ($scope.arr_personal_expense[index].pvehicleType == vehRateObj.id) {
                $scope.arr_personal_expense[index].vehicleName = vehRateObj.name;
            }
        });
    }


    $scope.deletePersonalExpenses = function (id, index, exp_sub, amount) {

        // console.log(amount);
        if (amount > 0) {
            var del_sub_exp = $scope.$root.hr + "hr_values/delete_expence_sub";

            ngDialog.openConfirm({
                template: 'modalDeleteDialogId',
                className: 'ngdialog-theme-default-custom'
            }).then(function (value) {
                $http
                    .post(del_sub_exp, { id: id, 'token': $scope.$root.token })
                    .then(function (res) {
                        if (res.data.ack == true) {
                            toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                            //    exp_sub.splice(index, 1);
                            $scope.getPersonaexpenses_final_list($scope.formData.expense_id);
                        } else {
                            toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                        }
                    });
            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });

        }


        /*  var lastItem = $scope.choices.length-1;
         $scope.choices.splice(lastItem);*/
    };

    $scope.submitPersonal_all = function (arr_personal_expense) {
        $scope.addexpenses(1);
        var rec = {};

        rec.token = $scope.$root.token;
        rec.tab_id_2 = 8;
        rec.employee_id = $stateParams.id;
        rec.expence_id = $scope.expenseForm.expense_id;
        rec.data = $scope.arr_personal_expense;
        //console.log($scope.choices);
        //return false;
        var updateperonal = $scope.$root.hr + "hr_values/update-hr-exppersonal";

        $http
            .post(updateperonal, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', res.data.msg);
                    $scope.add_row_table = false;
                    $scope.check_expense_form_readonly = true;
                    $scope.getPersonaexpenses_final_list($scope.formData.expense_id);
                }

            });
    }

    $scope.tickedPersonalExpense = function (clickedRow) {
        nextRow = clickedRow + 1;
        /*var date_of_travel = angular.element($('#date_of_travel'+clickedRow)).val();
         var description = angular.element($('#description'+clickedRow)).val();
         var postcodeFrom = angular.element($('#postcodeFrom'+clickedRow)).val();
         var via = angular.element($('#via'+clickedRow)).val();
         var postcodeTo = angular.element($('#postcodeTo'+clickedRow)).val();
         var miles = angular.element($('#miles'+clickedRow)).val();
         var mileage_rate = angular.element($('#mileage_rate'+clickedRow)).val();
         var tamount = angular.element($('#tamount'+clickedRow)).val();


         var date_of_travel = angular.element($('#date_of_travel'+clickedRow)).val();
         var description = angular.element($('#description'+clickedRow)).val();
         var postcodeFrom = angular.element($('#postcodeFrom'+clickedRow)).val();
         var via = angular.element($('#via'+clickedRow)).val();
         var postcodeTo = angular.element($('#postcodeTo'+clickedRow)).val();
         var miles = angular.element($('#miles'+clickedRow)).val();
         var mileage_rate = angular.element($('#mileage_rate'+clickedRow)).val();
         var tamount = angular.element($('#tamount'+clickedRow)).val();



         var myEl = angular.element( document.querySelector( '#description'+clickedRow ) );
         myEl.val();

         console.log(myEl.val());

         angular.element($('#date_of_travel'+nextRow)).val(date_of_travel);
         angular.element($('#description'+nextRow)).val(description);
         angular.element($('#postcodeFrom'+nextRow)).val(postcodeTo);
         angular.element($('#via'+nextRow)).val(via);
         angular.element($('#postcodeTo'+nextRow)).val(postcodeFrom);
         angular.element($('#miles'+nextRow)).val(miles);
         angular.element($('#mileage_rate'+nextRow)).val(mileage_rate);
         angular.element($('#tamount'+nextRow)).val(tamount);*/
    }


    $scope.net_total_amount_personal = function () {
        //	console.log($scope.choices);

        var total = 0;
        var total_calculated_miles_personal = 0;
        //  console.log($scope.arr_personal_expense);
        $scope.net_calculate_miles_personal = 0;
        $scope.net_calculate_miles_personal_current_year = 0;
        angular.forEach($scope.arr_personal_expense, function (item) {

            if (item.pactual_miles > 0.0001) {
                $scope.net_calculate_miles_personal += Number(item.pactual_miles);
                var tax_year_start = Math.round((new Date((new Date()).getFullYear(), 3, 6)).getTime() / 1000);
                var tax_year_end = Math.round((new Date(((new Date()).getFullYear()) + 1, 3, 5)).getTime() / 1000);
                var current_date = $rootScope.ConvertDateToUnixTimestamp(item.pdate_of_travel);

                if (current_date >= tax_year_start && tax_year_start < tax_year_end)
                    $scope.net_calculate_miles_personal_current_year += Number(item.pactual_miles);
                /*console.log(item.pactual_miles);
                 console.log(item.pmileage_rate);*/
                //if ((total_calculated_miles_personal > 10000) && (item.pmileage_rate = 0.45)) {
                if (($scope.calc_milage_total > 10000) && (item.pmileage_rate = 0.45)) {
                    item.pmileage_rate = 0.25;
                }
                //console.log(item.pmileage_rate);

                item.total_sub = item.pactual_miles * item.pmileage_rate;
                //  console.log(item.pactual_miles+" "+ item.pmileage_rate);	
                total += Number(item.total_sub.toFixed(2));

                item.total_sub = item.total_sub.toFixed(2);

                //   console.log(item.pmiles);
                total_calculated_miles_personal += Number(item.pmiles);
                //	console.log(total);
            }
        });
        // console.log(total_calculated_miles_personal);

        if (total_calculated_miles_personal > 0) $scope.vechile_mileage = "personal";

        $scope.total_grand_personal = total.toFixed(2);
        //  $scope.calc_milage_total = total_calculated_miles_personal.toFixed(2);
        //console.log($scope.total_grand);
        return total;
    }

    $scope.chkVT = function () {

        /*console.log($scope.calc_milage_total);
         $scope.vechile_mileage;*/

        $scope.vt = 1;

        if ($scope.vt == 1) {
            // $timeout(function () {
            // angular.element('.personelVehicle a').click();
            $scope.getPersonaexpenses_final_list($scope.expenseForm.expense_id);
            angular.element('.personelVehicle').removeClass('dont-click');
            // }, 500);

        }
        if ($scope.vt == 2) {
            // $timeout(function () {
            // angular.element('.companyVehicle a').click();
            $scope.getCompanyexpenses_final_list($scope.expenseForm.expense_id);
            angular.element('.companyVehicle').removeClass('dont-click');
            // }, 500);
            //console.log($scope.vt);
        }


    }

    $scope.getXRate = function (ddValue, index) {
        console.log(ddValue + " " + index);
    }

    // Company Vehicle

    $scope.submitCompany_all = function (arr_company_expense) {
        $scope.addexpenses(1);
        var rec = {};

        rec.token = $scope.$root.token;
        rec.tab_id_2 = 9;
        rec.employee_id = $stateParams.id;
        rec.expence_id = $scope.expenseForm.expense_id;
        rec.data = $scope.arr_company_expense;
        //console.log($scope.choices);
        //return false;
        var updatecomp = $scope.$root.hr + "hr_values/update-hr-expcompany";
        $http
            .post(updatecomp, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', res.data.msg);
                    $scope.add_row_table = false;
                    $scope.getCompanyexpenses_final_list($scope.formData.expense_id);
                }

            });
    }

    $scope.getCompanyexpenses_final_list = function (expense_id) {
        $scope.$root.load_date_picker('Hr');
        //console.log(expense_id);
        /* jQuery("html, body").animate({
         scrollTop: 0
         }, "slow");
         jQuery("html, body").animate({
         scrollTop: '+=1500px'
         }); */
        var expense_id = $scope.expenseForm.expense_id;

        var postData = {
            'token': $scope.$root.token,
            'all': 1,
            'expense_id': expense_id,
            'employee_id': $stateParams.id
        };
        var perExpUrl = $scope.$root.hr + "hr_values/expences_complist";
        $scope.arr_company_expense = [];
        $scope.company_calc_milage_total = 0;
        $scope.showLoader = true;
        $http
            .post(perExpUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {


                    // if (res.data.total > 0) 
                    {
                        $scope.arr_company_expense = res.data.response;
                        $scope.total_grand_company = res.data.total_grand;

                        /*console.log(res.data.company_calc_milage_total);
                         console.log(res.data.total);*/

                        $scope.company_calc_milage_total = res.data.company_calc_milage_total;

                        var new_add = 20 - res.data.total;
                        //console.log(new_add);	console.log(newItemNo);
                        if (new_add > 0 && new_add < 21) {
                            var newItemNo = $scope.arr_company_expense.length + new_add;

                            var start = (parseFloat(res.data.total)) + 1;

                            //	console.log(start);	console.log(newItemNo);
                            for (var i = start; i <= newItemNo; i++) {
                                //	var object = $scope.new_add[i]; 
                                $scope.arr_company_expense.push({ sort_id: '' + [i] }); //object.i
                            }

                        }

                        angular.forEach($scope.arr_company_expense, function (cexobj) {
                            angular.forEach($scope.arr_car_fuel_type, function (fuelObj) {
                                if (cexobj.fuelType == fuelObj.value) {
                                    cexobj.fuelTypeName = fuelObj.label
                                }
                            });
                            angular.forEach($scope.arr_car_enngine, function (enginObj) {
                                if (cexobj.engineType == enginObj.value) {
                                    cexobj.engineTypeName = enginObj.label
                                }
                            });
                        });
                    }
                    /* else {
                        $scope.arr_company_expense = '';
                    } */
                    $scope.showLoader = false;
                }
                else {
                    $scope.company_calc_milage_total = res.data.company_calc_milage_total;
                    $scope.showLoader = false;
                    $scope.addNewChoice_CV();
                }
            });

    }

    $scope.net_total_amount_company = function () {
        //	console.log($scope.choices);

        var comp_total_calculated_miles = 0;
        var total = 0;
        $scope.net_calculate_miles_company = 0;
        $scope.net_calculate_miles_company_current_year = 0;

        angular.forEach($scope.arr_company_expense, function (item) {
            if (item.actual_miles > 0.0001) {
                $scope.net_calculate_miles_company += Number(item.actual_miles);

                var tax_year_start = Math.round((new Date((new Date()).getFullYear(), 3, 6)).getTime() / 1000);
                var tax_year_end = Math.round((new Date(((new Date()).getFullYear()) + 1, 3, 5)).getTime() / 1000);
                var current_date = $rootScope.ConvertDateToUnixTimestamp(item.date_of_travel);

                if (current_date >= tax_year_start && tax_year_start < tax_year_end)
                    $scope.net_calculate_miles_company_current_year += Number(item.actual_miles);

                // console.log(item.pmileage_rate);
                // if ((comp_total_calculated_miles > 10000) && (item.mileage_rate = 0.45)) {
                if (($scope.company_calc_milage_total > 10000) && (item.mileage_rate = 0.45)) {
                    item.mileage_rate = 0.25;
                }
                //console.log(item.mileage_rate);

                item.total_sub = item.actual_miles * item.mileage_rate;
                //console.log(subtotal);	
                total += Number(item.total_sub.toFixed(2));
                item.total_sub = item.total_sub.toFixed(2);

                comp_total_calculated_miles += Number(item.miles);
                //	console.log(total);
            }
        });

        //console.log(comp_total_calculated_miles);
        // $scope.company_calc_milage_total = comp_total_calculated_miles.toFixed(2);
        if (comp_total_calculated_miles > 0) $scope.vechile_mileage = "company";

        $scope.total_grand_company = total.toFixed(2);
        //console.log($scope.total_grand);
        return total;
    }

    $scope.getdistance = function (clickedRow) {
        nextRow = clickedRow + 1;
        /*$scope.postcode1='AB101XG';
         $scope.postcode2='AB106RN';*/
        $scope.postcode1 = angular.element($('#postcodeFrom' + clickedRow)).val();
        $scope.postcode2 = angular.element($('#postcodeTo' + clickedRow)).val();
        console.log($scope.postcode1 + " " + $scope.postcode2);
        var postData = {
            'token': $scope.$root.token,
            'origins': $scope.postcode1,
            'destination': $scope.postcode2
        };
        //var distance = "http://maps.googleapis.com/maps/api/distancematrix/json?origins="+$scope.postcode1+"&destinations="+$scope.postcode2+"&mode=driving&language=en-EN&sensor=false";
        //var distance = "https://maps.googleapis.com/maps/api/json?key=AIzaSyCBTzTa1UHKPyo9syFZKXjE8sGP1lqpjfw";
        var distance = $scope.$root.hr + "hr_values/getDistance";
        $http
            .post(distance, postData)
            .then(function (res) {
                //$scope.personelVehical.pmiles=res.data;
                console.log(res.data);
                angular.element($('#pactual_miles' + clickedRow)).val(res.data);
                angular.element($('#pmiles' + clickedRow)).val(res.data);
                if (Number(res.data) == 0)
                    toaster.pop('error', "Error", $scope.$root.getErrorMessageByCode(373));


            });
    }

    $scope.getDistanceFromGooglePersonal = function (index) {

        $scope.postcode1 = "";
        $scope.postcode2 = "";

        $scope.postcode1 = ($scope.arr_personal_expense[index].ppostcodeTo != undefined) ? $scope.arr_personal_expense[index].ppostcodeTo : ''; //angular.element($('#ppostcodeFrom' + index)).val();
        //$scope.via = angular.element($('#pvia'+index)).val();
        $scope.postcode2 = ($scope.arr_personal_expense[index].ppostcodeFrom) ? $scope.arr_personal_expense[index].ppostcodeFrom : ''; // angular.element($('#ppostcodeTo' + index)).val();
        //console.log($scope.postcode1+ "-"+index+"-"+$scope.postcode2);

        if ($scope.postcode1.length == 0 || $scope.postcode2.length == 0)
            return;

        var postData = {
            'token': $scope.$root.token,
            'origins': $scope.postcode1,
            'destination': $scope.postcode2
        };

        var distance = $scope.$root.hr + "hr_values/getDistance";
        $http
            .post(distance, postData)
            .then(function (res) {
                //$scope.personelVehical.pmiles=res.data;
                console.log(res.data);
                var pmiles = $('#pmiles' + index);
                pmiles.val(res.data);
                pmiles.trigger("change");

                var pactual_miles = $('#pactual_miles' + index);
                pactual_miles.val(res.data);
                pactual_miles.trigger("change");

                if (Number(res.data) == 0)
                    toaster.pop('error', "Error", $scope.$root.getErrorMessageByCode(373));

            });
    }

    $scope.getDistanceFromGoogleCompany = function (index) {

        // $scope.postcode1 = angular.element($('#postcodeFrom' + index)).val();
        //$scope.via = angular.element($('#via'+index)).val();
        // $scope.postcode2 = angular.element($('#postcodeTo' + index)).val();
        //console.log($scope.postcode1+ "-"+index+"-"+$scope.postcode2);
        $scope.postcode1 = "";
        $scope.postcode2 = "";
        $scope.postcode1 = ($scope.arr_company_expense[index].postcodeFrom != undefined) ? $scope.arr_company_expense[index].postcodeFrom : ''; //angular.element($('#ppostcodeFrom' + index)).val();
        //$scope.via = angular.element($('#pvia'+index)).val();
        $scope.postcode2 = ($scope.arr_company_expense[index].postcodeTo != undefined) ? $scope.arr_company_expense[index].postcodeTo : ''; // angular.element($('#ppostcodeTo' + index)).val();
        //console.log($scope.postcode1+ "-"+index+"-"+$scope.postcode2);

        if ($scope.postcode1.length == 0 || $scope.postcode2.length == 0)
            return;

        var postData = {
            'token': $scope.$root.token,
            'origins': $scope.postcode1,
            'destination': $scope.postcode2
        };

        var distance = $scope.$root.hr + "hr_values/getDistance";
        $http
            .post(distance, postData)
            .then(function (res) {
                //$scope.personelVehical.pmiles=res.data;
                console.log(res.data);
                var miles = $('#miles' + index);
                miles.val(res.data);
                miles.trigger("change");

                var actual_miles = $('#actual_miles' + index);
                actual_miles.val(res.data);
                actual_miles.trigger("change");
                if (Number(res.data) == 0)
                    toaster.pop('error', "Error", $scope.$root.getErrorMessageByCode(373));


            });
    }

    $scope.calculateRate = function (engine, index) {


        var rate = '';
        if (engine == 1) {
            rate = 0.11;
        }
        if (engine == 2) {
            rate = 0.13;
        }
        if (engine == 3) {
            rate = 0.20;
        }
        if (engine == 4) {
            rate = 0.9;
        }
        if (engine == 5) {
            rate = 0.11;
        }
        if (engine == 6) {
            rate = 0.13;
        }
        if (engine == 7) {
            rate = 0.7;
        }
        if (engine == 8) {
            rate = 0.9;
        }
        if (engine == 9) {
            rate = 0.13;
        }


        var mileage_rate = $('#mileage_rate' + index);
        mileage_rate.val(rate);
        mileage_rate.trigger("change");

        angular.forEach($scope.arr_car_enngine, function (enginObj) {
            if ($scope.arr_company_expense[index].engineType == enginObj.value) {
                $scope.arr_company_expense[index].engineTypeName = enginObj.label;
            }
        });

    }

    $scope.change_engine_sizes = function (fuelType, index) {

        angular.forEach($scope.arr_car_fuel_type, function (fuelObj) {
            if ($scope.arr_company_expense[index].fuelType == fuelObj.value) {
                $scope.arr_company_expense[index].fuelTypeName = fuelObj.label;
            }
        });
    }

    //----------- Holidays----------------------


    $scope.deleteHoliday = function (id, passed, holidayStatus) {
        if (passed == "Yes") {
            toaster.pop('error', "Info", $scope.$root.getErrorMessageByCode(374));
            return;
        }
        if (holidayStatus != "Queued For Approval") {
            toaster.pop('error', "Info", "Holiday is already " + holidayStatus);
            return;
        }

        var getUrl = $scope.$root.hr + "hr_values/delete-holiday-by-id";
        var deleteHolidayData = {
            'id': id
        };


        deleteHolidayData.token = $scope.$root.token;

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(getUrl, deleteHolidayData)
                .then(function (res) {
                    if (res.data.ack) {
                        toaster.pop('success', "Info", "Holiday Deleted Successfully");
                        $scope.getHoliday();
                    }

                });
        });
    }


   /*  $scope.holidayStatus = [
        { value: "0", name: "Queued For Approval" },
        { value: "1", name: "Awaiting Approval" },
        { value: "2", name: "Approved" },
        { value: "3", name: "Disapproved" },
        { value: "4", name: "Queued For Cancellation" },
        { value: "5", name: "Awaiting Cancellation" },
        { value: "6", name: "Cancelled" },
    ] */

    $scope.sendForApproval = function (object_id, code) { // for holidays
        var check_approvals = $scope.$root.setup + "general/check-for-approvals";
        //'warehouse_id': item.warehouses.id
        $http
            .post(check_approvals, {
                'object_id': $scope.holiday_id,
                'type': 6,
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    var update_approvals_status = $scope.$root.setup + "general/update-approval-status-direct";

                    $http
                        .post(update_approvals_status, {
                            'object_id': $scope.holiday_id,
                            'type': 6,
                            'status': 2,
                            'token': $scope.$root.token
                        })
                        .then(function (res) {
                            if (res.data.ack == true) {
                                $scope.showLoader = false;
                                toaster.pop('success', 'Success', 'Successfully Approved');
                                $scope.getHoliday();
                                return;
                            }
                            else {
                                $scope.showLoader = false;
                                toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(371));
                                // return;
                            }
                        });
                }
                else {
                    var response = res.data.response;
                    if (Number(response[0].type) == 6) {
                        if (Number(response[0].prev_status) == -1 || Number(response[0].prev_status) == 3) {
                            var str = '';
                            if (Number(response[0].prev_status) == 3) {
                                str = "Previously disapproved by " + response[0].responded_by + ", ";

                            }
                            $rootScope.approval_message = str+"Are you sure to want to queue this holiday for approval.";
                            check_profit = 1;
                            ngDialog.openConfirm({
                                template: '_confirm_approval_required_modal',
                                className: 'ngdialog-theme-default-custom'
                            }).then(function (value) {
                                $scope.showLoader = true;
                                var check_approvals = $scope.$root.setup + "general/send-for-approval";
                                //'warehouse_id': item.warehouses.id
                                $http
                                    .post(check_approvals, {
                                        'object_id': $scope.holiday_id,
                                        'object_code': $scope.formData.holiday_code,
                                        'source_name': $scope.formData.first_name + ' ' + $scope.formData.last_name,
                                        'source_code': $scope.formData.user_code,
                                        'detail_id': $stateParams.id,
                                        'currency_code': $scope.choices[0].currencyCode,
                                        'code': code,
                                        'approval_id': response[0].id,
                                        'type': "6",
                                        'emp_id_1': response[0].emp_id_1,
                                        'emp_id_2': response[0].emp_id_2,
                                        'emp_id_3': response[0].emp_id_3,
                                        'emp_id_4': response[0].emp_id_4,
                                        'emp_id_5': response[0].emp_id_5,
                                        'emp_id_6': response[0].emp_id_6,
                                        'emp_email_1': response[0].emp_email_1,
                                        'emp_email_2': response[0].emp_email_2,
                                        'emp_email_3': response[0].emp_email_3,
                                        'emp_email_4': response[0].emp_email_4,
                                        'emp_email_5': response[0].emp_email_5,
                                        'emp_email_6': response[0].emp_email_6,
                                        'prev_status': response[0].prev_status,
                                        'token': $scope.$root.token
                                    })
                                    .then(function (res) {
                                        if (res.data.ack == true) {
                                            $scope.showLoader = false;
                                            toaster.pop('success', 'Success', 'Successfully Queued for Approvals');
                                            $scope.getHoliday();
                                            return;
                                        }
                                        else {
                                            $scope.showLoader = false;
                                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(371));
                                            return;
                                        }
                                    });
                            },
                                function (reason) {
                                    $scope.showLoader = false;
                                    console.log('Modal promise rejected. Reason: ', reason);
                                });
                        }
                        else if (Number(response[0].prev_status) == 1) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(372));
                            return;
                        }
                        else if (Number(response[0].prev_status) == 0) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(391));
                            return;
                        }
                    }
                }
            });
    }

    $scope.EntitledHolidays = true;
    $scope.AvailedHolidays = true;
    $scope.requestedDays = true;
    $scope.sickDays = false;
    $scope.otherDays = false;
    $scope.remainingHolidays = true;

    $scope.hrHolidayForm = function () {
        $scope.holidayReadOnly = false;
        $scope.showHolidaylist = false;
        $scope.showHoliday = true;

        $scope.showHoliday_days = "Days";

        $scope.formData.description = '';
        $scope.formData.holiday_used = '';
        $scope.formData.holiday_booked = '';
        $scope.formData.holiday_date_from = '';
        $scope.formData.holiday_date_to = '';
        $scope.formData.holiday_type = '';
        $scope.formData.holiday_num_days_exist = '';

        $scope.formData.holidayStatus = 0;   //$scope.holidayStatus[0].id;
        $scope.formData.holidayYear = $scope.holidayYearType[0];

        // $scope.holidayYearType = [{ 'name': 'Current Year', 'id': "1" }, { 'name': 'Next Year', 'id': "2" }];

        $scope.getHolidayDetail();

    }

    $scope.showHolidayType = function (type) {

        if (type == 1) {
            $scope.EntitledHolidays = true;
            $scope.AvailedHolidays = true;
            $scope.remainingHolidays = true;
        } else if (type == 2) {
            $scope.EntitledHolidays = false;
            $scope.AvailedHolidays = false;
            $scope.remainingHolidays = false;
        } else if (type == 3) {
            $scope.EntitledHolidays = false;
            $scope.AvailedHolidays = false;
            $scope.remainingHolidays = false;
        } else {
            $scope.EntitledHolidays = true;
            $scope.AvailedHolidays = true;
            $scope.remainingHolidays = true;
        }

        if ($scope.formData.holiday_nature_existing == type) {
            $scope.formData.holiday_num_days = $scope.formData.holiday_num_days_exist;
        }
        else {
            $scope.formData.holiday_num_days = '';
        }


    }

    $scope.holidayYearUpdate = function (holidayYearID) {
        /* if(holidayYearID == 2){
            $scope.holidayRangeStart = res.data.response.startDate;
            $scope.holidayRangeEnd = res.data.response.endDate;
        }
        else{ */
        // $scope.holidayRangeStart = res.data.response.startDate;
        // $scope.holidayRangeEnd = res.data.response.endDate;

        $scope.holidayRangeStart = '';
        $scope.holidayRangeEnd = '';
        $scope.nextYeartotalHoliday = 0;

        var getHolidayDetail = $scope.$root.hr + "hr_values/get-holiday-start-end-date-limits-byYear";

        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'holidayYearID': holidayYearID
        };
        $scope.showLoader = true;

        $http
            .post(getHolidayDetail, $scope.postData)
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.holidayRangeStart = res.data.startDate;
                    $scope.holidayRangeEnd = res.data.endDate;
                    $scope.nextYeartotalHoliday = res.data.nextYeartotalHoliday;
                }
                else {
                    toaster.pop('error', 'info', res.data.error);
                    return false;
                }
            });
    }

    $scope.getCode_holiday = function () {
        $scope.showLoader = true;
        var startDate = ($rootScope.convert_date_to_unix($scope.formData.holiday_date_from));
        var endDate = ($rootScope.convert_date_to_unix($scope.formData.holiday_date_to));

        // validation added
        if (!startDate || !endDate) {
            toaster.pop('error', 'Info', "Date From and To are required.");
            $scope.showLoader = false;
            return;
        }

        if (startDate && endDate && endDate < startDate) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(333, ['Holiday Date To ', 'Holiday Date From']));
            $timeout(function () { $scope.showLoader = false; }, 500);
            return;
        }

        if ($scope.formData.holiday_num_days == 0) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(375));
            $timeout(function () { $scope.showLoader = false; }, 500);
            return;
        }
        else if (!$scope.formData.holiday_num_days) {
            // $scope.formData.holiday_num_days = 0
            // toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(375));
            toaster.pop('error', 'Info', "No. of Days should be less than or equal to Remaining Annual Leave(s).");
            $timeout(function () { $scope.showLoader = false; }, 500);
            return;
        }

        $scope.formData.holidayYearID = ($scope.formData.holidayYear && $scope.formData.holidayYear.id) ? $scope.formData.holidayYear.id : 0;

        if ($scope.formData.holidayYearID > 0) {
            if ($scope.formData.holidayYearID == 1 && startDate && endDate) {

                var from = $scope.formData.holiday_date_from.split("/")[2];
                var to = $scope.formData.holiday_date_to.split("/")[2];

                var d = new Date();
                var currentYear = d.getFullYear();

                if (currentYear != from) {
                    toaster.pop('error', 'Info', 'Holiday Start Date is not in Current Year Period');
                    $scope.showLoader = false;
                    return;
                }

                if (currentYear != to) {
                    toaster.pop('error', 'Info', 'Holiday End Date is not in Current Year Period');
                    $scope.showLoader = false;
                    return;
                }
            }

            if ($scope.formData.holidayYearID == 2 && startDate && endDate) {

                var from = $scope.formData.holiday_date_from.split("/")[2];
                var to = $scope.formData.holiday_date_to.split("/")[2];

                var d = new Date();
                var nextYear = d.getFullYear() + 1;

                if (nextYear != from) {
                    toaster.pop('error', 'Info', 'Holiday Start Date is not in Next Year Period');
                    $scope.showLoader = false;
                    return;
                }

                if (nextYear != to) {
                    toaster.pop('error', 'Info', 'Holiday End Date is not in Next Year Period');
                    $scope.showLoader = false;
                    return;
                }
            }
        }
        else {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Holiday Year']));
            $scope.showLoader = false;
            return;
        }


        // validation added
        $scope.remaining_holidays = $scope.formData.entitle_holiday - $scope.formData.holiday_used;

        if ($scope.formData.holiday_code == '' &&
            $scope.formData.holiday_nature == 1 &&
            (isNaN($scope.formData.holiday_num_days) ||
                isNaN($scope.remaining_holidays) ||
                ($scope.formData.holiday_num_days > $scope.remaining_holidays)
            )
        ) {
            toaster.pop('error', 'Info', "No. of Days should be less than or equal to Remaining Annual Leave(s).");
            $scope.showLoader = false;
            return;
        }
        else if ($scope.formData.holiday_code && $scope.formData.holiday_nature == 1 && $scope.remaining_holidays < 0) {
            toaster.pop('error', 'Info', "No. of Days should be less than 0.");
            $scope.showLoader = false;
            return;
        }

        if ($scope.formData.holiday_code) {
            $scope.add_holiday($scope.formData);
            return;
        }

        var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
        var name = $scope.$root.base64_encode('hr_holidays');
        var no = $scope.$root.base64_encode('holiday_no');

        var module_category_id = 2;
        $scope.postData.token = {

        };
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
                'type': '',
                'status': ''
            })
            .then(function (res) {

                if (res.data.ack == 1) {

                    $scope.holiday_new = true;
                    // $scope.formData.holidayStatus = "1";
                    // $scope.formData.holiday_type = "1";
                    $scope.holidayReadOnly = false;
                    $scope.showLoader = false;
                    $scope.formData.holiday_code = res.data.code;

                    //$scope.formData.holiday_no = res.data.nubmer;
                    //console.log(res.data.code+" "+res.data.nubmer);
                    //$scope.rec.code_type = module_category_id;//res.data.code_type;
                    $scope.count_result++;

                    $scope.add_holiday($scope.formData);

                    /* if (res.data.type == 1) {
                     $scope.product_type = false;
                     } else {
                     $scope.product_type = true;
                     }*/

                    if ($scope.count_result > 0) {
                        //  console.log($scope.count_result);
                        return true;
                    } else {
                        //    console.log($scope.count_result + 'd');
                        return false;
                    }

                } else {
                    toaster.pop('error', 'info', res.data.error);
                    return false;
                }
            });


    }

    $scope.getHolidayDetail = function () {
        var employee_id = $stateParams.id;
        var getHolidayDetail = $scope.$root.hr + "hr_values/get-holiday-detail";
        $scope.formData.holiday_code = "";
        $scope.formData.holiday_nature = 1;
        $scope.formData.holiday_num_days = "";
        $scope.formData.approvalProcess = 0;
        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'all': "1",
            'employee_id': employee_id
        };
        $scope.showLoader = true;

        $http
            .post(getHolidayDetail, $scope.postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.holidayRangeStart = res.data.startDate;
                    $scope.holidayRangeEnd = res.data.endDate;
                    if ($scope.formData.entitle_holiday == "" || $scope.formData.entitle_holiday <= 0) {
                        $scope.forceUnpaid = true;
                        $scope.formData.holiday_type = "2";
                    }
                    else {
                        $scope.forceUnpaid = false;
                        $scope.formData.holiday_type = "1";
                    }
                    if (res.data.response != null) {
                        $scope.tempHolidayBooked = 0;
                        $scope.formData.holiday_used = res.data.used;
                        $scope.formData.holiday_description = "";
                        //$scope.formData.holiday_booked = res.data.total - res.data.used;
                        $scope.showLoader = false;
                    }
                    else {
                        $scope.formData.holiday_used = 0;
                        $scope.tempHolidayBooked = 0;
                        $scope.formData.holiday_description = "";
                        // $scope.formData.holiday_booked = $scope.formData.entitle_holiday - $scope.formData.holiday_used;

                    }
                    $scope.showLoader = false;
                }

                $scope.showHolidayType(1);

            });

    }

    $scope.showHolidayReport = function (employee_id) {

        // var employee_id = $stateParams.id;
        var getHolidayDetail = $scope.$root.hr + "hr_values/get-holiday-detail";
        // $scope.formData.holiday_code = "";
        // $scope.formData.holiday_nature = 1;
        // $scope.formData.holiday_num_days = "";
        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'employee_id': employee_id
        };
        $scope.showLoader = true;

        $http
            .post(getHolidayDetail, $scope.postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    /* $scope.holidayRangeStart = res.data.startDate;
                    $scope.holidayRangeEnd = res.data.endDate;
                    if ($scope.formData.entitle_holiday == "" || $scope.formData.entitle_holiday <= 0) {
                        $scope.forceUnpaid = true;
                        $scope.formData.holiday_type = "2";
                    }
                    else {
                        $scope.forceUnpaid = false;
                        $scope.formData.holiday_type = "1";
                    }
                    if (res.data.response != null) {
                        $scope.tempHolidayBooked = 0;
                        $scope.formData.holiday_used = res.data.used;
                        $scope.formData.holiday_description = "";
                        $scope.showLoader = false;
                    }
                    else {
                        $scope.formData.holiday_used = 0;
                        $scope.tempHolidayBooked = 0;
                        $scope.formData.holiday_description = "";
                    } */
                    $scope.showLoader = false;
                }
            });
    }

    $scope.clearPassword = function () {
        if ($scope.formData && $scope.formData.user_password && $scope.formData.user_password == "You should not be doing this" && !$scope.check_hrvalues_readonly) {
            $scope.formData.user_password = "";
        }
    }

    $scope.add_holiday = function (formData) {
        $scope.showLoader = true;
        if ($scope.formData.holiday_id > 0) var updateholi = $scope.$root.hr + "hr_values/update-holiday";
        else var updateholi = $scope.$root.hr + "hr_values/add-holiday";

        $scope.formData.holiday_id;
        $scope.formData.employee_id = $stateParams.id;//$scope.$root.employee_id;
        $scope.formData.token = $scope.$root.token;
        $scope.formData.data = $scope.formFields;
        // $scope.formData.tab_id_2 = 6;
        $scope.formData.expense_id = $scope.holiday_id;


        $scope.formData.holiday_types = ($scope.formData.holiday_type && $scope.formData.holiday_type.id) ? $scope.formData.holiday_type.id : 0;
        $scope.formData.holiday_booked = ($scope.formData.holiday_booked) ? $scope.formData.holiday_booked : 0;
        $scope.formData.holiday_num_days = ($scope.formData.holiday_num_days) ? $scope.formData.holiday_num_days : 0;

        $http
            .post(updateholi, $scope.formData)
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', res.data.error);//res.data.info,
                    //$scope.last_expense_id=res.data.last_expense_id;
                    // $scope.getHoliday();
                    // $scope.holidayReadOnly = true;

                    if (!$scope.formData.holiday_id)
                        $scope.formData.holiday_id = res.data.lastInsertID;

                    $scope.showHolidayEditForm($scope.formData.holiday_id);

                } else {
                    toaster.pop('error', 'Error', res.data.error);
                }
            });

    }
    $scope.show_tab_holiday = false;
    $scope.show_tab_expense = false;
    $scope.show_tab_fuel_cost = false;

    $scope.holidayPeriod = {
        period: 0
    }
    $scope.getHoliday = function (holidayPeriod) {

        if (holidayPeriod == undefined) {
            $scope.holidayPeriod.period = 0;
        }

        if ($stateParams.isTab && $stateParams.isTab == 1) {
            holidayPeriod = 2;
        }

        $scope.formData.holiday_id = 0;
        //if ($scope.$root.breadcrumbs[3] != undefined) $scope.$root.breadcrumbs[3].name = 'Holidays';

        var employee_id = $stateParams.id;

        if ($stateParams.id == undefined) {
            return;
        }

        $scope.showLoader = true;
        $scope.showHolidaylist = true;
        $scope.showHoliday = false;
        $scope.show_tab_holiday = true;
        $scope.show_tab_expense = false;
        $scope.show_tab_fuel_cost = false;

        //console.log($scope.show_tab_holiday);

        var getHolidayApi = $scope.$root.hr + "hr_values/holiday-listing";
        $scope.postData = {};

        $scope.postData = {
            'token': $scope.$root.token,
            'all': "1",
            'employee_id': employee_id,
            'page': $scope.item_paging.spage,
            'period': holidayPeriod
        };

        $http
            .post(getHolidayApi, $scope.postData)
            .then(function (res) {

                $scope.holidays = [];
                // $scope.columns = [];
                $scope.holidays_columns = [];

                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;
                    $scope.holidays = res.data.response;
                    $scope.totalAvailed = 0;
                    $scope.totalBooked = 0;
                    $scope.totalUnpaidAvailed = 0;
                    $scope.totalUnpaidBooked = 0;
                    $scope.totalRemaining = 0;

                    angular.forEach(res.data.response, function (val, index) {
                        if (val['Holiday Year'] == 'Current Year') {

                            if (val['holiday type'] == "Annual Leave" && val['Status'] != "Disapproved") {
                                if (val.passed == "Yes") {
                                    $scope.totalAvailed += parseFloat(val['No. of Days']);
                                }
                                else {
                                    $scope.totalBooked += parseFloat(val['No. of Days']);
                                }
                            }
                        }
                        // else if (val['holiday type'] == "Unpaid" && val['Status'] != "Disapproved") {
                        //     if (val.passed == "Yes") {
                        //         $scope.totalUnpaidAvailed += parseFloat(val['No. of Days']);
                        //     }
                        //     else {
                        //         $scope.totalUnpaidBooked += parseFloat(val['No. of Days']);
                        //     }
                        // }

                    });

                    if (holidayPeriod == 2) {
                        $scope.totalAvailed = res.data.totalAvailed;
                        $scope.totalBooked = res.data.totalBooked;
                    }

                    $scope.minEntitledHolidays = $scope.totalAvailed + $scope.totalBooked;

                    $scope.sickLeaves = (res.data.response[0]['leaves'].sick_leaves) ? res.data.response[0]['leaves'].sick_leaves : 0;
                    $scope.otherLeaves = (res.data.response[0]['leaves'].other_leaves) ? res.data.response[0]['leaves'].other_leaves : 0;
                    try {
                        angular.forEach(res.data.response[0], function (val, index) {
                            if (index != 'leaves') {
                                $scope.holidays_columns.push({
                                    'title': toTitleCase(index),
                                    'field': index,
                                    'visible': true
                                });
                            }

                        });
                    }
                    catch (ex) {

                    }

                    $scope.showLoader = false;
                }
                else if (res.data.ack == 2) {
                    toaster.pop('error', 'info', res.data.error);
                }

            });

        $scope.showLoader = false;
    }

    $scope.showEditFormHoliday = function () {
        $scope.holidayReadOnly = false;
    }

    $scope.showHolidayEditForm = function (id) {
        $scope.holidayReadOnly = true;
        $scope.formData.holidayStatus = "";
        //console.log(id);
        //$scope.getHolidayDetail();
        $scope.showHolidaylist = false;
        $scope.showHoliday = true;
        var employee_id = $stateParams.id;
        $scope.holiday_id = id;
        $scope.formData.holiday_id = id;

        var getUrl = $scope.$root.hr + "hr_values/holiday-data-by-id";

        var postViewHolidayData = {
            'token': $scope.$root.token,
            'id': id,
            'employee_id': employee_id
        };

        $scope.showLoader = true;
        $http
            .post(getUrl, postViewHolidayData)
            .then(function (res) {
                $scope.holiday_new = false;

                if (res.data.response.passed == "Yes" || res.data.response.holidayStatus >= '1') {
                    $scope.editNotAllowed = true;
                }
                else {
                    $scope.editNotAllowed = false;
                }

                $scope.holidayRangeStart = res.data.response.startDate;
                $scope.holidayRangeEnd = res.data.response.endDate;
                $scope.formData.holidayStatus = res.data.response.holidayStatus;
                $scope.nextYeartotalHoliday = res.data.nextYeartotalHoliday;

                $scope.formData.holiday_id = res.data.response.id;
                $scope.holiday_id = res.data.response.id;
                $scope.formData.holiday_code = res.data.response.holiday_code;
                $scope.formData.holiday_date_from = res.data.response.holiday_date_from;
                $scope.formData.holiday_date_to = res.data.response.holiday_date_to;
                $scope.formData.holiday_description = res.data.response.holiday_description;
                $scope.formData.holiday_booked = res.data.response.holiday_booked;
                $scope.formData.holiday_num_days = parseFloat(res.data.response.total_holiday);
                $scope.tempHolidayBooked = res.data.response.current_year == "Yes" ? $scope.formData.holiday_num_days : 0;
                $scope.formData.holiday_used = res.data.response.used == null ? 0 : res.data.response.used;
                $scope.formData.holiday_type = res.data.response.holiday_type;
                $scope.formData.holiday_nature = res.data.response.holiday_nature;
                $scope.formData.holiday_nature_existing = res.data.response.holiday_nature;
                $scope.formData.holiday_num_days_exist = parseFloat(res.data.response.total_holiday);
                $scope.showHolidayType($scope.formData.holiday_nature);

                if (res.data.response.holidayYear) {

                    angular.forEach($scope.holidayYearType, function (obj) {
                        if (obj.id == res.data.response.holidayYear)
                            $scope.formData.holidayYear = obj;
                    });
                }
                else
                    $scope.formData.holidayYear = $scope.holidayYearType[0];

                $scope.formData.approvalProcess = 0;

                if (res.data.response.approval_status && res.data.response.approval_status.response && res.data.response.approval_status.response[0]) {
                   // if (res.data.response.approval_status.response[res.data.response.approval_status.response.length - 1].statuss == 'Queued for Approval')
                        $scope.formData.approvalProcess = 1;

                   // if (res.data.response.approval_status.response[res.data.response.approval_status.response.length - 1].statuss == 'Awaiting Approval')
                    //    $scope.formData.holidayStatus = 1;
                }

                console.log($scope.formData);
                //$scope.formData.holiday_used -= $scope.formData.holiday_num_days;
                //$scope.formData.holiday_remaining = res.data.response.remaining_holidays;

                // angular.forEach($scope.arr_holiday_type, function (obj, index) {
                //     if (obj.id == res.data.response.holiday_type) {
                //         $scope.formData.holiday_type = $scope.arr_holiday_type[index];

                //     }
                // });
                $scope.showLoader = false;

            });

        /*{id: "1", name: "Vehicle"},*/
        /* $scope.category_expense = [{ id: "2", name: "Accomodation" }, { id: "3", name: "Travel" }, {
            id: "4",
            name: "Communication"
        }, { id: "5", name: "Entertainment" }, { id: "6", name: "Food" }, { id: "7", name: "Misc" }];

        $scope.total_sub = 0;
        $scope.total_amount = 0;
        $scope.total_exchange_rate = 0;
        $scope.total_final = 0;
        $scope.amount = 0;
        $scope.exchange_rate = 0;

        $scope.showsubexpnselisting = true;
        var postData = {
            'token': $scope.$root.token,
            'all': 1,
            'expense_id': id,
            'employee_id': employee_id
        };
        $http
            .post(expUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    console.log(res.data.response);
                    if (res.data.total > 0) {
                        $scope.choices = res.data.response;
                        $scope.total_grand = res.data.total_grand;

                        console.log(res.data.response);

                        var new_add = 20 - res.data.total;
                        //console.log(new_add);	console.log(newItemNo);
                        if (new_add > 0 && new_add < 21) {
                            var newItemNo = $scope.choices.length + new_add;

                            var start = (parseFloat(res.data.total)) + 1;

                            // 	console.log(start);	console.log(newItemNo);
                            for (var i = start; i <= newItemNo; i++) {
                                //	var object = $scope.new_add[i]; 
                                $scope.choices.push({ sort_id: '' + [i] }); //object.i
                            }

                        }
                    }


                }
            });
         */
        jQuery("html, body").animate({
            scrollTop: '+=1500px'
        });

        /* $scope.showsub_rowexpenses = true;
        $scope.row_sub_list_expenses_form = true;
        $scope.row_sub_list_expenses = true;
        $scope.showexpenseslist = false;
        $scope.showexpenses = true; */

        if (id != undefined) {
            /*	 $scope.check_hrvalues_readonly = false;
             $scope.perreadonly = true;*/
        }
        $scope.new_button = true;
    }

    $scope.cancelHoliday = function (){
        $scope.cancelData = {};
        $scope.cancelData.holiday_id = $scope.formData.holiday_id;
        $scope.cancelData.holiday_num_days = $scope.formData.holiday_num_days;
        $scope.cancelData.cancel_no_of_days = '';

        angular.element('#hr_cancel_holiday_modal').modal({ show: true });
    }

    $scope.requestToCancelHoliday = function (){
        
        if($scope.cancelData.cancel_no_of_days > $scope.cancelData.holiday_num_days){
            toaster.pop('error', 'Info', "No. Of Cancelled days should be less than or equal to total no of days approved.");
            return;
        }
        var check_approvals = $scope.$root.setup + "general/check-for-approvals";
        //'warehouse_id': item.warehouses.id
        $http
            .post(check_approvals, {
                'object_id': $scope.cancelData.holiday_id,
                'type': 6,
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    var response = res.data.response;
                    if (Number(response[0].type) == 6 || Number(response[0].type) == 9) {
                        if (Number(response[0].prev_status) == 2) {
                            var str = '';
                            str = "Previously approved by " + response[0].responded_by + ", ";
                            $rootScope.approval_message = str+ "Are you sure to want to queue this holiday for Cancellation.";
                            check_profit = 1;
                            ngDialog.openConfirm({
                                template: '_confirm_approval_required_modal',
                                className: 'ngdialog-theme-default-custom'
                            }).then(function (value) {
                                $scope.showLoader = true;
                                $scope.cancelData.token= $scope.$root.token;
                                var cancelHolidayUrl = $scope.$root.setup + "general/holiday-cancellation-request";
                                $http
                                    .post(cancelHolidayUrl, $scope.cancelData)
                                    .then(function (res) {
                                        if (res.data.ack == 1) {
                                            $scope.showLoader = false;
                                            toaster.pop('success', 'Success', 'Successfully Queued for Approvals');
                                            angular.element('#hr_cancel_holiday_modal').modal('hide');
                                            $scope.getHoliday();
                                            return;
                                        } else {
                                            $scope.showLoader = false;
                                            toaster.pop('error', 'info', res.data.error);
                                            return false;
                                        }
                                    });
                            },
                                function (reason) {
                                    $scope.showLoader = false;
                                    console.log('Modal promise rejected. Reason: ', reason);
                                });
                        }
                        else if (Number(response[0].prev_status) == 1) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(372));
                            return;
                        }
                        else if (Number(response[0].prev_status) == 0) {
                            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(391));
                            return;
                        }
                    }
                }
            });

    }

    //----------- Fuel Cost Deduction----------------------
    $scope.hrDeductionForm = function () {
        $scope.showDeductionlist = false;
        $scope.showDeduction = true;
        $scope.showDeductionDetail = false;
        $scope.getCode_deduction();

        $scope.formData.description = '';
        $scope.formData.holiday_used = '';
        $scope.formData.holiday_booked = '';
        $scope.formData.holiday_date_from = '';
        $scope.formData.holiday_date_to = '';
        $scope.formData.holiday_type = '';

    }

    $scope.getCode_deduction = function () {
        var getCodeUrl = $scope.$root.stock + "products-listing/get-code";
        var name = $scope.$root.base64_encode('hr_fuel_cost_deduction');
        var no = $scope.$root.base64_encode('fcd_no');
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
                'type': '',
                'status': ''
            })
            .then(function (res) {

                if (res.data.ack == 1) {
                    $scope.showLoader = false;
                    $scope.formData.fcd_code = res.data.code;
                    $scope.formData.fcd_no = res.data.nubmer;
                    //console.log(res.data.code);
                    $scope.count_result++;
                    if ($scope.count_result > 0) {
                        //  console.log($scope.count_result);
                        return true;
                    } else {
                        //    console.log($scope.count_result + 'd');
                        return false;
                    }

                } else {
                    toaster.pop('error', 'info', res.data.error);
                    return false;
                }
            });


    }

    $scope.add_deduction = function (formData) {

        if ($scope.formData.deduction_id > 0) var updatededuction = $scope.$root.hr + "hr_values/update-hr-deduction";
        else var updatededuction = $scope.$root.hr + "hr_values/add-deduction";

        $scope.formData.deduction_id;
        $scope.formData.employee_id = $stateParams.id;//$scope.$root.employee_id;
        $scope.formData.token = $scope.$root.token;
        $scope.formData.data = $scope.formFields;
        // $scope.formData.tab_id_2 = 6;
        $scope.formData.deduction_id = $scope.deduction_id;


        $scope.formData.fuel_types = $scope.formData.fuel_type !== undefined ? $scope.formData.fuel_type.value : 0;
        $scope.formData.engine_types = $scope.formData.engine_type !== undefined ? $scope.formData.engine_type.value : 0;
        //console.log($scope.formData.fuel_types);
        $http
            .post(updatededuction, $scope.formData)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', res.data.error);
                    //$scope.last_expense_id=res.data.last_expense_id;
                    $scope.getDeduction();

                } else {
                    toaster.pop('error', res.data.error);
                }
            });

    }

    $scope.getDeduction = function () {

        // if ($scope.$root.breadcrumbs[3] != undefined) $scope.$root.breadcrumbs[3].name = 'Fuel Cost Deduction';

        var employee_id = $stateParams.id;

        $scope.showLoader = true;
        $scope.showDeductionlist = true;
        $scope.showDeduction = false;
        $scope.showDeductionDetail = false;

        $scope.show_tab_holiday = false;
        $scope.show_tab_expense = false;
        $scope.show_tab_fuel_cost = true;


        var getDeductionApi = $scope.$root.hr + "hr_values/deduction-listing";
        $scope.postData = {};
        $scope.postData = {
            'token': $scope.$root.token,
            'all': "1",
            'employee_id': employee_id,
            'page': $scope.item_paging.spage,

        };

        $http
            .post(getDeductionApi, $scope.postData)
            .then(function (res) {
                $scope.deduction = [];
                $scope.fuel_cost_ded_columns = [];
                if (res.data.ack == true) {

                    $scope.total = res.data.total;
                    $scope.item_paging.total_pages = res.data.total_pages;
                    $scope.item_paging.cpage = res.data.cpage;
                    $scope.item_paging.ppage = res.data.ppage;
                    $scope.item_paging.npage = res.data.npage;
                    $scope.item_paging.pages = res.data.pages;


                    $scope.deduction = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.fuel_cost_ded_columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    $scope.showLoader = false;
                }

            });


        $scope.showLoader = false;
    }

    $scope.showDeductionEditForm = function (id) {
        //console.log(id);

        $scope.showDeductionlist = false;
        $scope.showDeduction = true;
        $scope.showDeductionDetail = true;
        var employee_id = $stateParams.id;
        $scope.deduction_id = id;
        $scope.formData.deduction_id = id;

        var getUrl = $scope.$root.hr + "hr_values/deduction-data-by-id";
        var postViewdeductionData = {
            'token': $scope.$root.token,
            'id': id
        };
        $scope.showLoader = true;
        $http
            .post(getUrl, postViewdeductionData)
            .then(function (res) {

                $scope.formData.deduction_id = res.data.response.id;
                $scope.deduction_id = res.data.response.id;
                $scope.formData.fcd_code = res.data.response.fcd_code;
                $scope.formData.start_miles = res.data.response.start_miles;
                $scope.formData.end_miles = res.data.response.end_miles;
                //$scope.formData.engine_type = res.data.response.engine_type;
                //dd$scope.formData.fuel_type = res.data.response.fuel_type;

                angular.forEach($scope.arr_car_enngine, function (obj, index) {
                    if (obj.value == res.data.response.engine_type) {
                        $scope.formData.engine_type = $scope.arr_car_enngine[index];

                    }
                });
                angular.forEach($scope.arr_car_fuel_type, function (obj, index) {
                    if (obj.value == res.data.response.fuel_type) {
                        $scope.formData.fuel_type = $scope.arr_car_fuel_type[index];

                    }
                });
                var rate = 0;
                if (res.data.response.engine_type == 1 && res.data.response.fuel_type == 1) {
                    rate = 0.11;
                }
                if (res.data.response.engine_type == 2 && res.data.response.fuel_type == 1) {
                    rate = 0.13;
                }
                if (res.data.response.engine_type == 5 && res.data.response.fuel_type == 1) {
                    rate = 0.20;
                }
                if (res.data.response.engine_type == 3 && res.data.response.fuel_type == 2) {
                    rate = 0.9;
                }
                if (res.data.response.engine_type == 4 && res.data.response.fuel_type == 2) {
                    rate = 0.11;
                }
                if (res.data.response.engine_type == 5 && res.data.response.fuel_type == 2) {
                    rate = 0.13;
                }
                if (res.data.response.engine_type == 1 && res.data.response.fuel_type == 3) {
                    rate = 0.7;
                }
                if (res.data.response.engine_type == 2 && res.data.response.fuel_type == 3) {
                    rate = 0.9;
                }
                if (res.data.response.engine_type == 5 && res.data.response.fuel_type == 3) {
                    rate = 0.13;
                }
                $scope.formData.rate = rate;
                console.log($scope.formData.rate);
            });


        $scope.total_sub = 0;
        $scope.total_amount = 0;
        $scope.total_exchange_rate = 0;
        $scope.total_final = 0;
        $scope.amount = 0;
        $scope.exchange_rate = 0;

        $scope.showsubexpnselisting = true;
        var postData = {
            'token': $scope.$root.token,
            'all': 1,
            'expense_id': id,
            'employee_id': employee_id
        };
        $http
            .post(expUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    console.log(res.data.response);
                    if (res.data.total > 0) {
                        $scope.choices = res.data.response;
                        $scope.total_grand = res.data.total_grand;

                        var new_add = 20 - res.data.total;
                        //console.log(new_add);	console.log(newItemNo);
                        if (new_add > 0 && new_add < 21) {
                            var newItemNo = $scope.choices.length + new_add;

                            var start = (parseFloat(res.data.total)) + 1;

                            // 	console.log(start);	console.log(newItemNo);
                            for (var i = start; i <= newItemNo; i++) {
                                //	var object = $scope.new_add[i]; 
                                $scope.choices.push({ sort_id: '' + [i] }); //object.i
                            }

                        }
                    }


                }
            });

        $scope.showLoader = false;
        jQuery("html, body").animate({
            scrollTop: '+=1500px'
        });

        $scope.showsub_rowexpenses = true;
        $scope.row_sub_list_expenses_form = true;
        $scope.row_sub_list_expenses = true;
        $scope.showexpenseslist = false;
        $scope.showexpenses = true;

        if (id != undefined) {
            /*	 $scope.check_hrvalues_readonly = false;
             $scope.perreadonly = true;*/
        }
        $scope.new_button = true;
    }
    $scope.addNewChoice_exp = function () {
        $scope.choices.push({ sort_id: $scope.choices.length, 'currency': $scope.$root.defaultCurrency, 'currencyCode': $scope.$root.defaultCurrencyCode, 'exchange_rate': 1, 'exp_image': '' });
    };

    $scope.addNewChoice_PV = function () {
        $scope.arr_personal_expense.push({ sort_id: $scope.arr_personal_expense.length });
    };

    $scope.addNewChoice_CV = function () {
        $scope.arr_company_expense.push({ sort_id: $scope.arr_company_expense.length });
    };

    $scope.getDistanceFromGoogleFcd = function (index) {

        $scope.postcode1 = angular.element($('#fpostcodeFrom' + index)).val();
        //$scope.via = angular.element($('#via'+index)).val();
        $scope.postcode2 = angular.element($('#fpostcodeTo' + index)).val();
        //console.log($scope.postcode1+ "-"+index+"-"+$scope.postcode2);
        var postData = {
            'token': $scope.$root.token,
            'origins': $scope.postcode1,
            'destination': $scope.postcode2
        };

        var distance = $scope.$root.hr + "hr_values/getDistance";
        $http
            .post(distance, postData)
            .then(function (res) {
                //$scope.personelVehical.pmiles=res.data;
                console.log(res.data);
                var miles = $('#fmiles' + index);
                miles.val(res.data);
                miles.trigger("change");

                var actual_miles = $('#factual_miles' + index);
                actual_miles.val(res.data);
                actual_miles.trigger("change");

            });
    }
    $scope.net_total_amount_fcd = function () {
        //	console.log($scope.choices);
        var total = 0;
        angular.forEach($scope.arr_fuel_cost_deduction, function (item) {
            if (item.factual_miles > 0.0001) {
                var subtotal = item.factual_miles * 1;
                //console.log(subtotal);	
                total += subtotal;
                // console.log(total);	
            }
        });

        $scope.total_grand_fcd = total;
        //console.log($scope.total_grand);

        return total;
    }
    $scope.submitDeduction_all = function (arr_fuel_cost_deduction) {
        var rec = {};

        rec.token = $scope.$root.token;
        rec.tab_id_2 = 8;
        rec.employee_id = $stateParams.id;
        rec.deduction_id = $scope.formData.deduction_id;
        rec.fmileage_rate = $scope.formData.rate;
        rec.data = $scope.arr_fuel_cost_deduction;
        //console.log($scope.choices);
        //return false;
        var updateFCD = $scope.$root.hr + "hr_values/update-hr-deduction";

        $http
            .post(updateFCD, rec)
            .then(function (res) {
                if (res.data.ack == true) {
                    toaster.pop('success', 'Info', res.data.msg);
                    $scope.add_row_table = false;
                    //$scope.getPersonaexpenses_final_list($scope.formData.expense_id);
                }

            });
    }

    //--------------------   call event for image document & caments module --------------------


    // ------------- 	 Mail Configurations 	 ----------------------------------------

    /*var companiesUrl = $scope.$root.hr+"hr_values/get-companies";
     $http
     .post(companiesUrl, {'token':$scope.$root.token})
     .then(function (res) {
     if(res.data.ack == true){ 
     //	console.log( res.data.response.name);  
     $scope.formData.company_name = res.data.response.name;

     }
     }); */

    $scope.mails = {};
    $scope.mailstotal = 0;
    $scope.mailFormData = {};
    $scope.mailFormData.id = "";
    $scope.mailFormData.username = "";
    $scope.mailFormData.password = "";
    angular.element('#cpassword').val('');
    $scope.mailFormData.imapServer = "";
    $scope.mailFormData.imapPort = "";
    $scope.mailFormData.imapSSL = "";
    $scope.mailFormData.imapSPA = "";
    $scope.mailFormData.pop3Server = "";
    $scope.mailFormData.pop3Port = "";
    $scope.mailFormData.pop3SSL = "";
    $scope.mailFormData.pop3SPA = "";
    $scope.mailFormData.smtpServer = "";
    $scope.mailFormData.smtpPort = "";
    $scope.mailFormData.smtpSSL = "";
    $scope.mailFormData.smtpSPA = "";
    $scope.mailFormData.smtpAuth = "";
    $scope.mailFormData.alias = "";

    $scope.getMailConfigurations = function () {

        $scope.showLoader = true;
        $scope.mailstotal = 0;
        $scope.mailFormData.id = "";
        $scope.mailFormData.username = "";
        $scope.mailFormData.password = "";
        angular.element('#cpassword').val('');
        $scope.mailFormData.imapServer = "";
        $scope.mailFormData.imapPort = "";
        $scope.mailFormData.imapSSL = "";
        $scope.mailFormData.imapSPA = "";
        $scope.mailFormData.pop3Server = "";
        $scope.mailFormData.pop3Port = "";
        $scope.mailFormData.pop3SSL = "";
        $scope.mailFormData.pop3SPA = "";
        $scope.mailFormData.smtpServer = "";
        $scope.mailFormData.smtpPort = "";
        $scope.mailFormData.smtpSSL = "";
        $scope.mailFormData.smtpSPA = "";
        $scope.mailFormData.smtpAuth = "";
        $scope.mailFormData.alias = "";

        // $scope.$root.breadcrumbs =
        //     [////{'name': 'Dashboard', 'url': 'app.dashboard', 'isActive': false},
        //         { 'name': 'Account Setting', 'url': '#', 'isActive': false },
        //         { 'name': $scope.$root.model_code, 'url': '#', 'isActive': false },
        //        ];


        var employee_id = $stateParams.id;

        $scope.showLoader = true;
        $scope.showmaillist = true;
        $scope.showmailform = false;
        $scope.showvirtuallist = true;
        $scope.showvirtualform = false;


        var postData = {};

        var postUrl = $rootScope.com + "mail/configurations";
        postData = {
            'employee_id': employee_id, 'token': $rootScope.token
        };

        $http.post(postUrl, postData).then(function (res) {


            $scope.mailstotal = res.data.total;
            $scope.mails = [];
            if (res.data.response != null) {
                $scope.mails = res.data.response;
            }

            $scope.showLoader = false;
        });
    };

    $scope.addmailFlag = true;
    $scope.editmailFlag = false;

    $scope.clearConfigForm = function () {
        $scope.mailFormData = {};
        $scope.editMailReadonly = false;
    }

    $scope.submitMail = function () {

        if ($scope.mailFormData.mailDomain == undefined || $scope.mailFormData.mailDomain.trim() == "") {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Domain']));
            return;
        }


        if ($scope.mailFormData.imapport && $scope.mailFormData.imapport.toString().indexOf(".") > -1) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(644, ['IMAP Port']));
            return;
        }

        if ($scope.mailFormData.pop3port && $scope.mailFormData.pop3port.toString().indexOf(".") > -1) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(644, ['POP3 Port']));
            return;
        }
        if ($scope.mailFormData.smtpport && $scope.mailFormData.smtpport.toString().indexOf(".") > -1) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(644, ['SMTP Port']));
            return;
        }
        $scope.showLoader = true;
        $scope.formData.employee_id = $stateParams.id;
        /* if ($scope.mailFormData.password != angular.element('#cpassword').val()) {
            toaster.pop('error', 'Not Added', 'Confirm password doesn\'t match');
            return;
        } */
        var clientPath = "";
        if ($scope.mailFormData.id) {
            clientPath = $rootScope.com + 'mail/updateclientconfiguration';
        } else {
            clientPath = $rootScope.com + 'mail/addclientconfiguration';
        }
        $scope.mailFormData.token = $rootScope.token;
        $http.post(clientPath, $scope.mailFormData).then(function (result) {
            if (result.data.ack) {

                if ($scope.mailFormData.id != "") {
                    toaster.pop('success', 'Updated', $scope.$root.getErrorMessageByCode(102));
                } else {
                    toaster.pop('success', 'Added', 'Record added.');
                }
                $scope.getMailConfigurations();
                $scope.getDomains();
                $scope.clearConfigForm();
                $('#mail_form').modal('hide');
            } else {

                if (result.data.duplicateCheck) {
                    toaster.pop('error', 'Info', 'Domain already exists!');
                }
                else {
                    toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(102));
                    $('#mail_form').modal('hide');
                }
                // if ($scope.mailFormData.id != "") {
                //     toaster.pop('error', 'Updated', result.data.errorMessage);
                // } else {
                //     toaster.pop('error', 'Added', result.data.errorMessage);
                // }
            }
            $scope.showLoader = false;
        });

    };

    $scope.enableEditMailForm = function () {
        $scope.editMailReadonly = false;
    };

    $scope.addmail = function () {

        $scope.formData.employee_id = $stateParams.id;
        if ($scope.mailFormData.password != angular.element('#cpassword').val()) {
            toaster.pop('error', 'Not Added', $scope.$root.getErrorMessageByCode(376));
            return;
        }
        var clientData = {
            username: $scope.mailFormData.username,
            password: $scope.mailFormData.password,
            pop3server: $scope.mailFormData.pop3Server,
            pop3port: $scope.mailFormData.pop3Port,
            pop3ssl: $scope.mailFormData.pop3SSL,
            pop3spa: $scope.mailFormData.pop3SPA,
            imapserver: $scope.mailFormData.imapServer,
            imapport: $scope.mailFormData.imapPort,
            imapssl: $scope.mailFormData.imapSSL,
            imapspa: $scope.mailFormData.imapSPA,
            smtpserver: $scope.mailFormData.smtpServer,
            smtpport: $scope.mailFormData.smtpPort,
            smtpssl: $scope.mailFormData.smtpSSL,
            smtpspa: $scope.mailFormData.smtpSPA,
            smtpauth: $scope.mailFormData.smtpAuth,
            alias: $scope.mailFormData.alias,
            token: $rootScope.token
        };
        var clientPath = $rootScope.com + 'mail/addclientconfiguration';
        $http.post(clientPath, clientData).then(function (result) {
            if (!result.data.isError) {
                toaster.pop('success', 'Added', 'Record added.');
                $scope.getMailConfigurations();
            }
        });

    };

    $scope.updatemail = function () {

        $scope.formData.employee_id = $stateParams.id;

        var clientData = {
            id: $scope.mailFormData.id,
            domain: $scope.mailFormData.mailDomain,
            username: $scope.mailFormData.username,
            password: $scope.mailFormData.password,
            pop3server: $scope.mailFormData.pop3Server,
            pop3port: $scope.mailFormData.pop3Port,
            pop3ssl: $scope.mailFormData.pop3SSL,
            pop3spa: $scope.mailFormData.pop3SPA,
            imapserver: $scope.mailFormData.imapServer,
            imapport: $scope.mailFormData.imapPort,
            imapssl: $scope.mailFormData.imapSSL,
            imapspa: $scope.mailFormData.imapSPA,
            smtpserver: $scope.mailFormData.smtpServer,
            smtpport: $scope.mailFormData.smtpPort,
            smtpssl: $scope.mailFormData.smtpSSL,
            smtpspa: $scope.mailFormData.smtpSPA,
            smtpauth: $scope.mailFormData.smtpAuth,
            alias: $scope.mailFormData.alias,
            token: $rootScope.token
        };
        var clientPath = $rootScope.com + 'mail/updateclientconfiguration';
        $http.post(clientPath, clientData).then(function (result) {
            if (!result.data.isError) {
                toaster.pop('success', 'Updated', $scope.$root.getErrorMessageByCode(102));
                $scope.getMailConfigurations();
            }
        });

    };

    $scope.getDomains = function () {
        $scope.showLoader = true;
        var getDomainsAPI = $rootScope.com + 'mail/getDomains';
        var $httpPromise = $http
            .post(getDomainsAPI, { 'token': $scope.$root.token })
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data) {
                    $scope.domainList = res.data.response;

                }
            });
        return $httpPromise;
    }

    $scope.virtualEmailData = {};

    $scope.editVirtualEmail = function () {
        $scope.virtualEmailReadonly = false;
    }


    $scope.getDomainById = function (id) {
        var domainName = "";
        if ($scope.domainList == undefined) {
            $scope.getDomains().then(function () {
                angular.forEach($scope.domainList, function (obj) {
                    if (obj.id == id) {
                        domainName = obj.mailDomain;
                        return false;
                    }
                });
                return domainName;
            })
        }
        else {
            angular.forEach($scope.domainList, function (obj) {
                if (obj.id == id) {
                    domainName = obj.mailDomain;
                    return false;
                }
            });
            return domainName;
        }


    }

    $scope.getVirtualEmails = function () {
        $scope.EmployeeSelectAllowedCols = [
            "Employee No.", "name", "Department", "job_title", "Email"
        ]
        $scope.showLoader = true;
        $scope.virtualEmails = [];
        var getVirtualEmailsAPI = $rootScope.com + 'mail/getVirtualEmails';
        $http
            .post(getVirtualEmailsAPI, { 'token': $scope.$root.token })
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack) {
                    if (res.data.response.length && res.data.response[0].length != 0)
                        $scope.virtualEmails = res.data.response;
                    $scope.allEmployees = res.data.allEmployees.response;
                }
            });
    }

    $scope.clearVirtualEmailForm = function () {
        $scope.virtualEmailData = {};
        $scope.virtualEmailReadonly = false;
        angular.element('#confirmVirtualPassword').val("");
    }

    $scope.addVirtualEmail = function (virtualEmailData) {

        if (virtualEmailData.alias == undefined || virtualEmailData.alias.trim() == '') {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Alias']));
            return;
        }
        if (virtualEmailData.username == undefined || virtualEmailData.username.trim() == '') {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Username']));
            return;
        }
        if (virtualEmailData.mailDomain == undefined) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Domain']));
            return;
        }
        if (virtualEmailData.password == undefined || virtualEmailData.password.trim() == '') {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(230, ['Password']));
            return;
        }

        if (virtualEmailData.password != angular.element('#confirmVirtualPassword').val()) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(376));
            return;
        }
        $scope.showLoader = true;
        // console.table(virtualEmailData);
        var addVirtualEmailAPI = $rootScope.com + 'mail/addVirtualEmail';
        $http
            .post(addVirtualEmailAPI, { 'token': $scope.$root.token, data: virtualEmailData })
            .then(function (res) {
                $scope.showLoader = false;
                if (res.data.ack) {
                    $scope.clearVirtualEmailForm();
                    $('#virtual_form').modal('hide');
                    $scope.getVirtualEmails();
                }
                else {
                    if (res.data.duplicate) {
                        toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(377));
                    }
                }
            });
    }


    $scope.showmailEditForm = function (id) {
        $scope.showLoader = true;
        $scope.editMailReadonly = true;
        angular.forEach($scope.mails, function (obj) {
            if (obj.id == id) {
                $scope.mailFormData = obj;
                return false;
            }
        });

        $scope.showLoader = false;

    };

    $scope.showVirtualMailEditForm = function (obj) {
        $scope.virtualEmailData = angular.copy(obj);
        $scope.showLoader = true;
        $scope.virtualEmailReadonly = true;

        angular.forEach($scope.domainList, function (obj) {
            if (obj.id == $scope.virtualEmailData.configurationId) {
                $scope.virtualEmailData.mailDomain = obj;
                return false;
            }
        });

        $scope.showLoader = false;

    };

    $scope.deleteVirtualMail = function (virtualEmailData) {
        $scope.showLoader = true;

        // if primary, return;

        var del_expUrl = $rootScope.com + "mail/deleteVirtualMail";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(del_expUrl, { id: virtualEmailData.id, 'token': $scope.$root.token })
                .then(function (res) {
                    $scope.showLoader = false;

                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $scope.virtualEmailData = {};
                        angular.element('#confirmVirtualPassword').val("");
                        $scope.virtualEmailReadonly = false;
                        angular.element('#virtual_form').modal('hide');
                        $scope.getVirtualEmails();

                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    $scope.deleteMailConfig = function (mailFormData) {
        $scope.showLoader = false;

        // if primary, return;
        if (mailFormData.primaryConfiguration != "0") {
            toaster.pop('error', 'info', $scope.$root.getErrorMessageByCode(378, ['Primary configuration']));
            return;
        }
        var del_expUrl = $rootScope.com + "mail/deletemail";

        ngDialog.openConfirm({
            template: 'modalDeleteDialogId',
            className: 'ngdialog-theme-default-custom'
        }).then(function (value) {
            $http
                .post(del_expUrl, { id: mailFormData.id, 'token': $scope.$root.token })
                .then(function (res) {
                    $scope.showLoader = false;

                    if (res.data.ack == true) {
                        toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
                        $scope.mailFormData = {};
                        angular.element('#mail_form').modal('hide');
                        $scope.editMailReadonly = false;
                        $scope.getMailConfigurations();
                        $scope.getDomains();

                    } else {
                        toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
                    }
                });
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });

    };

    $scope.mailVirtualForm = function () {
        $scope.showvirtualform = true;
        $scope.showvirtuallist = false;
    }
    $scope.mailVirtualList = function () {
        $scope.showvirtualform = false;
        $scope.showvirtuallist = true;
    }
    $scope.mailForm = function () {

        //        $scope.expense_status_list = [{'name': 'Pending', 'id': 1}, {'name': 'Approved', 'id': 2}
        //            , {'name': 'Awaiting to be approved', 'id'showEditForm: 3}, {'name': 'Declined', 'id': 4}];

        $scope.mailFormData.id = "";
        $scope.mailFormData.username = "";
        $scope.mailFormData.password = "";
        $scope.mailFormData.imapServer = "";
        $scope.mailFormData.imapPort = "";
        $scope.mailFormData.imapSSL = "";
        $scope.mailFormData.imapSPA = "";
        $scope.mailFormData.pop3Server = "";
        $scope.mailFormData.pop3Port = "";
        $scope.mailFormData.pop3SSL = "";
        $scope.mailFormData.pop3SPA = "";
        $scope.mailFormData.smtpServer = "";
        $scope.mailFormData.smtpPort = "";
        $scope.mailFormData.smtpSSL = "";
        $scope.mailFormData.smtpSPA = "";
        $scope.mailFormData.smtpAuth = "";
        $scope.mailFormData.alias = "";
        $scope.addmailFlag = true;
        $scope.editmailFlag = false;

        $scope.showmaillist = false;
        $scope.showmailform = true;


        //        $("#expense_id").val('');
        //        $scope.expense_id = '';
        //
        //        $scope.formData.event_name = '';
        //        $scope.formData.event_code = '';
        //        $scope.formData.event_code = '';
        //        $scope.formData.event_description = '';
        //        $("#event_date").val('');
        //        $("#event_name").val('');
        //        $("#event_code").val('');
        //        $("#event_description").val('');

    }

    //--------------------   Mail Configurations --------------------


    //History Popup


    $scope.history_title = "";
    $scope.history_type = "";

    $scope.historyHrTab = function (type) {
        $scope.history_type = type;

        if (type == "employeestatus") {

            $scope.history_title = "Employee Status History";
            var Url = $scope.$root.hr + "hr_values/employee-status-history";

        } else if (type == "salarystatus") {

            $scope.history_title = $scope.formData.first_name + " " + $scope.formData.last_name + " Salary History";//Employee
            // $scope.salary_history_emplname = $scope.formData.first_name + " " + $scope.formData.last_name;
            var Url = $scope.$root.hr + "hr_values/employee-salary-history";
        }

        var postData = {
            'token': $scope.$root.token,
            'company_id': $scope.$root.defaultCompany,
            'employee_id': $stateParams.id
        };
        $scope.columns_his = [];
        $scope.history = {};

        $http
            .post(Url, postData)
            .then(function (res) {
                if (res.data.ack == true) {

                    $scope.history = res.data.response;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns_his.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });
                    //console.log($scope.columns_his);

                    angular.element('#hr_history_modal').modal({ show: true });

                } else {
                    toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(400));
                }
            });
    };

    /*$scope.list_internal_document=false;
     $scope.set_document_internal =function (id){	$scope.tab_id=id;

     if(id==0)    $scope.list_internal_document=false;
     else  if(id>0) {
     $scope.list_internal_document=true;
     $timeout(function(){  	$('#reclickdoc').click();  }, 1000);

     }
     else{
     $scope.list_internal_document=false;

     $scope.List=''; 
     if($scope.$root.hr_general_module >0) $scope.List  +=  $scope.$root.hr_general_module+',';
     if($scope.$root.hr_contact_module >0) $scope.List += $scope.$root.hr_contact_module+',';
     if($scope.$root.hr_personal_module >0) $scope.List += $scope.$root.hr_personal_module+',';
     if($scope.$root.hr_salary_module >0)$scope.List  += $scope.$root.hr_salary_module+',';
     if($scope.$root.hr_benifit_module >0)$scope.List  += $scope.$root.hr_benifit_module+',';
     if($scope.$root.hr_expenses_module >0)$scope.List  += $scope.$root.hr_expenses_module+',';
     if($scope.$root.hr_benifit_module  >0)$scope.List  += $scope.$root.hr_benifit_module+',';
     if($scope.$root.hr_holidays_module >0){$scope.List  += $scope.$root.hr_holidays_module+',';

     }

     $scope.tab_id=   $scope.List.substring(0, $scope.List.length - 1);

     $timeout(function(){  	$('#reclickdoc_all').click();  }, 2000);
     }

     console.log($scope.tab_id);
     }*/
    $scope.$root.set_document_internal($scope.$root.hr_general_module);


    $scope.row_id = $stateParams.id;
    $scope.module_id = 36;
    $scope.subtype = 1;
    $scope.module = "Human Resources";
    $scope.module_name = "HR";
    //$scope.module_code= $scope.$root.model_code ;
    //console.log( $scope.module_id+'call'+$scope.module+'call'+$scope.module_name+'call'+$scope.module_code);
    $scope.$root.$broadcast("image_module", $scope.row_id, $scope.module, $scope.module_id, $scope.module_name, $scope.module_code, $scope.subtype, $scope.$root.tab_id);


    $scope.$root.load_date_picker('HR');
}


myApp.controller('viewHolidayForm', viewHolidayForm);
function viewHolidayForm($scope, $stateParams, $http, $state, toaster, $rootScope, ngDialog, $window, $resource, $timeout, moduleTracker) {


    moduleTracker.updateName("hr");
    moduleTracker.updateRecord($stateParams.id);

    $scope.currentEmpID = 0;
    $scope.recnew = 0;

    if ($stateParams.id > 0) {
        $scope.check_item_readonly = true;
        $scope.recnew = $stateParams.id;
        $scope.currentEmpID = $stateParams.id;
    }

    /* $scope.holidayTab = false;
    $scope.expenseTab = false;
    if ($stateParams.isTab && $stateParams.isTab == 1){
        $scope.holidayTab = true;
    }
    else if ($stateParams.isTab && $stateParams.isTab == 2){
        $scope.expenseTab = true;
    } */

    // console.log($stateParams.hid);
    // console.log($stateParams.isTab);

    $scope.formData = {};
    $scope.formData.approvalProcess = 0;

    $scope.GetApprovalPreData = function () {
        var APIUrl = $scope.$root.sales + "customer/order/get-approval-pre-data";
        var postData = {
            'token': $scope.$root.token
        };
        $http
            .post(APIUrl, postData)
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.expense_approval_req = res.data.expense_approval_req;
                    $scope.holiday_approval_req = res.data.holiday_approval_req;
                }
                else {
                    $scope.expense_approval_req = 0;
                    $scope.holiday_approval_req = 0;

                }
            });
    }

    $scope.GetApprovalPreData();

    $scope.GetApprovalStatus = function (object_id, type) {
        // type = 5 -> Expense, type = 6 -> Holiday
        $scope.approval_history = [];
        $scope.show_approval_btn = false;
        $scope.show_disapproval_btn = false;
        var postUrl_ref_cat = $scope.$root.setup + "general/get-approval-status";
        $scope.approval_object_id = object_id;
        $scope.approval_type = type;
        $http
            .post(postUrl_ref_cat, {
                'object_id': object_id,
                'type': type,
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.approval_history = res.data.response;
                    if (($scope.approval_history[$scope.approval_history.length - 1].statuss == 'Awaiting Approval' || $scope.approval_history[$scope.approval_history.length - 1].statuss == 'Awaiting Cancellation') && Number($scope.approval_history[$scope.approval_history.length - 1].approver) == 1) {
                        $scope.show_approval_btn = true;
                        $scope.show_disapproval_btn = true;
                    }

                    if ($scope.approval_history[$scope.approval_history.length - 1].statuss == 'Approved' && Number($scope.approval_history[$scope.approval_history.length - 1].approver) == 1)
                        $scope.show_disapproval_btn = true;
                }
            });
        angular.element('#_approval_history').modal({ show: true });
    }

    $scope.ChangeApprovalStatus = function (status, comments) {
        var update_approvals_status = $scope.$root.setup + "general/update-approval-status";
        var id = $scope.approval_history[$scope.approval_history.length - 1].id;
        var req_by_email = $scope.approval_history[$scope.approval_history.length - 1].requested_by_email;
        var object_code = $scope.approval_history[$scope.approval_history.length - 1].object_code;
        if (status == 3 && (comments == undefined || comments.length == 0)) {
            toaster.pop('error', 'error', $scope.$root.getErrorMessageByCode(664));
            return;
        }
        $http
            .post(update_approvals_status, {
                'object_id': $scope.approval_object_id,
                'object_code': object_code,
                'detail_id': $stateParams.id,
                'id': id,
                'requested_by_email': req_by_email,
                'type': $scope.approval_type,
                'status': status,
                'comments': comments,
                'token': $scope.$root.token
            })
            .then(function (res) {
                if (res.data.ack == true) {
                    $scope.showLoader = false;
                    if (status == 2)
                        toaster.pop('success', 'Success', 'Successfully Approved');
                    else
                        toaster.pop('success', 'Success', 'Approval Rejected');
                    // $scope.getHoliday();

                    $timeout(function () {
                        window.close();
                    }, 1500);

                    return;
                }
                else {
                    $scope.showLoader = false;
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(371));
                    // return;
                }
            });
    }

    $scope.holidayYearType = [{ 'name': 'Current Year', 'id': "1" }, { 'name': 'Next Year', 'id': "2" }];

    $scope.entitle_holiday_option = [];
    $scope.entitle_holiday_option = [{ 'label': 'Days', 'value': 1 }];

    $scope.arr_holiday_type = [];
    $scope.arr_holiday_type = [{ 'name': 'Paid', 'id': 1 }, { 'name': 'Unpaid', 'id': 2 }];

    $scope.$root.breadcrumbs =
        [{ 'name': 'Human Resources', 'url': '#', 'isActive': false },
        { 'name': 'Employees', 'url': 'app.hr_listing', 'isActive': false }];

    $scope.showHolidayType = function (type) {

        if (type == 1) {
            $scope.EntitledHolidays = true;
            $scope.AvailedHolidays = true;
            $scope.remainingHolidays = true;
        } else if (type == 2) {
            $scope.EntitledHolidays = false;
            $scope.AvailedHolidays = false;
            $scope.remainingHolidays = false;
        } else if (type == 3) {
            $scope.EntitledHolidays = false;
            $scope.AvailedHolidays = false;
            $scope.remainingHolidays = false;
        } else {
            $scope.EntitledHolidays = true;
            $scope.AvailedHolidays = true;
            $scope.remainingHolidays = true;
        }

        if ($scope.formData.holiday_nature_existing == type) {
            $scope.formData.holiday_num_days = $scope.formData.holiday_num_days_exist;
        }
        else {
            $scope.formData.holiday_num_days = '';
        }
    }

    $scope.showHolidayEditForm = function (id) {

        $scope.holidayReadOnly = true;
        $scope.formData.holidayStatus = "";

        $scope.showHolidaylist = false;
        $scope.showHoliday = true;
        var employee_id = $stateParams.id;
        $scope.holiday_id = id;
        $scope.formData.holiday_id = id;

        var getUrl = $scope.$root.hr + "hr_values/holiday-data-by-id";

        var postViewHolidayData = {
            'token': $scope.$root.token,
            'id': id,
            'employee_id': employee_id
        };

        $scope.showLoader = true;
        $http
            .post(getUrl, postViewHolidayData)
            .then(function (res) {
                $scope.holiday_new = false;

                if (res.data.response.passed == "Yes" || res.data.response.holidayStatus >= '1') {
                    $scope.editNotAllowed = true;
                }
                else {
                    $scope.editNotAllowed = false;
                }

                $scope.holidayRangeStart = res.data.response.startDate;
                $scope.holidayRangeEnd = res.data.response.endDate;
                $scope.formData.holidayStatus = res.data.response.holidayStatus;
                $scope.nextYeartotalHoliday = res.data.nextYeartotalHoliday;

                $scope.formData.holiday_id = res.data.response.id;
                $scope.holiday_id = res.data.response.id;
                $scope.formData.holiday_code = res.data.response.holiday_code;
                $scope.formData.holiday_date_from = res.data.response.holiday_date_from;
                $scope.formData.holiday_date_to = res.data.response.holiday_date_to;
                $scope.formData.holiday_description = res.data.response.holiday_description;
                $scope.formData.holiday_booked = res.data.response.holiday_booked;
                $scope.formData.holiday_num_days = parseFloat(res.data.response.total_holiday);
                $scope.tempHolidayBooked = res.data.response.current_year == "Yes" ? $scope.formData.holiday_num_days : 0;
                $scope.formData.holiday_used = res.data.response.used == null ? 0 : res.data.response.used;
                $scope.formData.holiday_type = res.data.response.holiday_type;
                $scope.formData.holiday_nature = res.data.response.holiday_nature;

                $scope.formData.empName = res.data.empName;
                $scope.formData.empCode = res.data.empCode;
                $scope.formData.entitle_holiday = res.data.empEntitleHoliday;

                $scope.formData.holiday_nature_existing = res.data.response.holiday_nature;
                $scope.formData.holiday_num_days_exist = parseFloat(res.data.response.total_holiday);
                $scope.showHolidayType($scope.formData.holiday_nature);

                if (res.data.response.holidayYear) {

                    angular.forEach($scope.holidayYearType, function (obj) {
                        if (obj.id == res.data.response.holidayYear)
                            $scope.formData.holidayYear = obj;
                    });
                }
                else
                    $scope.formData.holidayYear = $scope.holidayYearType[0];

                    $scope.formData.approvalProcess = 0;

                    if (res.data.response.approval_status && res.data.response.approval_status.response && res.data.response.approval_status.response[0]) {
                       // if (res.data.response.approval_status.response[res.data.response.approval_status.response.length - 1].statuss == 'Queued for Approval')
                            $scope.formData.approvalProcess = 1;
    
                       // if (res.data.response.approval_status.response[res.data.response.approval_status.response.length - 1].statuss == 'Awaiting Approval')
                        //    $scope.formData.holidayStatus = 1;
                    }

                $scope.showLoader = false;

            });

        jQuery("html, body").animate({
            scrollTop: '+=1500px'
        });

        $scope.new_button = true;
    }

    if ($stateParams.hid)
        $scope.showHolidayEditForm($stateParams.hid);
}

function ExpenseFileUploadController($scope, Upload, $timeout, $rootScope, toaster) {
    $scope.genera = {};
    $scope.uploadFiles = function (file, errFiles, formDataExpense, empData) {
        if (errFiles.length) {
            toaster.pop('error', 'Info', $scope.$root.getErrorMessageByCode(334));
            return;
        }
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        var postUrl = $scope.$root.setup + "general/upload-expense-image";

        if (file) {
            var imgWidth = file.$ngfWidth;
            var imgHeight = file.$ngfHeight;
            // var imgType = file.type;
            /* if (file.type.indexOf('image') === -1) {
                toaster.pop('error', 'Info', 'Upload Image file only!');
                return false;
            } */

            /* if (imgWidth > 200 || imgHeight > 200) {
                toaster.pop('error', 'Info', 'Uploaded file size is too large (Max size 2MB and dimension 200*200)!');
                return false;
            } */
            $rootScope.showLoader1 = true;
            file.upload = Upload.upload({
                url: postUrl,
                data: { file: file, image_token: $scope.$root.token, moduleName: "HR", type: 11, typeId: empData.id, recordName: empData.known_as, subTypeId: 1 }
            });

            file.upload.then(function (response) {
                //$timeout(function () {
                //console.log(response);return;
                //$scope.get_response = response.data.response;
                formDataExpense.exp_image = response.data.uploadedPaths[0];
                formDataExpense.imageId = response.data.uploadedFiles[0];
                // formDataExpense.imagePath = response.data.path;
                $rootScope.showLoader1 = false;
                // $rootScope.uploaded_logo = response.data.response;
                file.result = response.data;
                //});
            }, function (response) {
                if (response.status > 0) {
                    $rootScope.showLoader1 = false;
                    $scope.errorMsg = response.status + ': ' + response.data;
                }
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
    }
}



myApp.controller('hrTabsController', hrTabsController);
function hrTabsController($scope, $stateParams, $http, $state) {

    $scope.rec = {};
    var postUrl = $scope.$root.hr + "hr-tabs";
    var postData = {
        'token': $scope.$root.token,
        'all': 1
    };

    $http
        .post(postUrl, postData)
        .then(function (res) {
            if (res.data.ack == true) {
                $scope.rec = res.data.response;
            }
        });

}


function toTitleCase(str) {
    var title = str.replace('_', ' ');
    return title.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function ni_validate(niNumber) {

    var regNI = /^([a-zA-Z]){2}( )?([0-9]){2}( )?([0-9]){2}( )?([0-9]){2}( )?([a-zA-Z]){1}?$/;

    if (regNI.test(niNumber) == false) {

        document.getElementById("status").innerHTML = "National Insurance Number is not yet valid.";
        return false;
    } else {
        return true;
        //document.getElementById("status").innerHTML = "You have entered a valid National Insurance Number!";

    }
}

myApp.controller('EmpHolidayReportController', ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService", "$http", "ngDialog", "toaster", "$stateParams", "$state", "$rootScope", "ModalService", "jsreportService", function EmpHolidayReportController($scope, $filter, ngParams, $resource, $timeout, ngDataService, $http, ngDialog, toaster, $stateParams, $state, $rootScope, ModalService, jsreportService) {
    'use strict';

    $scope.module = 'AbsencesList';
    $scope.searchKeyword = {};
    $scope.dontShowModal = false;

    $scope.reportTitle = 'Employee Absence List';
    $scope.reportType = 'employeeAbsences';
    $scope.breadcrumbs = [{ 'name': 'Reports', 'url': '#', 'isActive': false }, { 'name': 'Employee Absence List', 'url': '#', 'isActive': false }];
    //{ 'name': 'All Reports', 'url': 'app.allReports', 'isActive': false }, 

    $scope.searchKeyword = {};
    $scope.searchKeywordHistory = {};

    $scope.filterReport = {};

    $scope.employeeReportListing = {};
    $scope.employeeReportListing.token = $rootScope.token;

    $scope.holidayType_arr = [
        { 'id': '1', 'title': 'Annual Leave(s)' },
        { 'id': '2', 'title': 'Sick Leave(s)' },
        { 'id': '3', 'title': 'Other Leave(s)' }
    ];
    $scope.filterReport.reporttype = 'Summary';
    $scope.filterReport.filter_by = 1;

    $scope.change_emp_dpt = function (type) {
        $scope.filterReport.filter_by = type;
    }

    $scope.filterReport.dateTo = $scope.$root.get_current_date();
    $scope.reportsDataArr = [];

    $scope.generateEmpAbsenceReport = function (_reportType = 'pdf') {
        $scope.printPdfVals = {};
        $scope.filterReport.token = $rootScope.token;
        $scope.filterReport.module = $scope.module;
        $scope.filterReport.employeesArr = $scope.employeesArr;
        $scope.filterReport.dateFrom = $scope.filterReport.dateFrom;
        $scope.filterReport.dateTo = $scope.filterReport.dateTo;

        if ($scope.filterReport.dateFrom != undefined && $scope.filterReport.dateFrom != 0) {
            var from, to, check;

            from = $scope.filterReport.dateFrom.split("/")[2] + "-" + $scope.filterReport.dateFrom.split("/")[1] + "-" + $scope.filterReport.dateFrom.split("/")[0];
            to = $scope.filterReport.dateTo.split("/")[2] + "-" + $scope.filterReport.dateTo.split("/")[1] + "-" + $scope.filterReport.dateTo.split("/")[0];

            if (from != null && to != null) {

                var from1, to1;
                from1 = new Date(from.replace(/\s/g, ''));
                to1 = new Date(to.replace(/\s/g, ''));

                var fDate, lDate;
                fDate = Date.parse(from1);
                lDate = Date.parse(to1);

                if (fDate > lDate) {
                    toaster.pop('error', 'Error', "Date To is earlier then Date From!");
                    return false;
                }
            }
        } else {
            $scope.filterReport.dateFrom = '';
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Date From']));
            return false;
        }


        if ($scope.filterReport.dateTo == undefined || $scope.filterReport.dateTo == 0 || $scope.filterReport.dateTo == '') {
            toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(230, ['Date To']));
            return false;
        }

        $scope.showLoader = true;
        var employeeReportListingApi = $scope.$root.reports + "module/employee-absence-report";

        $http
            .post(employeeReportListingApi, $scope.filterReport)
            .then(function (res) {
                $scope.showLoader = false;

                if (res.data.ack == true) {
                    $scope.printPdfVals.reportTitle = 'Employee Absence List - ' + $scope.filterReport.reporttype;
                    $scope.printPdfVals.reportName = 'AbsencesList';
                    $scope.printPdfVals.reportsDataArr = res.data.response;
                    $scope.printPdfVals.dateTo = $scope.filterReport.dateTo;
                    $scope.printPdfVals.dateFrom = $scope.filterReport.dateFrom;
                    $scope.printPdfVals.reporttype = $scope.filterReport.reporttype;
                    $scope.printPdfVals.filter_by = $scope.filterReport.filter_by;

                    if (_reportType == 'xlsx') {
                        $scope.showLoader = true;
                        jsreportService.downloadXlsx($scope.printPdfVals, 'Hyap5l0WB').success(function (data) {
                            $scope.showLoader = false;
                            let file = new Blob([data], { type: 'application/xlsx' });
                            saveAs(file, $scope.printPdfVals.reportName + ".xlsx");
                        })

                    } else {
                        var invoicePdfModal = ModalService.showModal({
                            templateUrl: 'app/views/reports/employeeAbsenceList.html',
                            controller: 'pdfPrintModalController',
                            inputs: {
                                printPdfVals: $scope.printPdfVals
                            }
                        });

                        invoicePdfModal.then(function (res) {
                            res.element.modal();
                        });
                    }
                }
                else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            });
    }

    $scope.clearReport = function () {
        $scope.dontShowModal = true;
        $scope.filterReport = {};
        $scope.reportsDataArr = [];
        $scope.filterReport.dateTo = $scope.$root.get_current_date();
        $scope.filterReport.filter_by = 1;
        $scope.filterReport.reporttype = 'Summary';
    }

    $scope.employeesArr = [];
    var recData = {};

    recData.custID = $stateParams.id;
    recData.id = $stateParams.id;
    $scope.employeesArr.push(recData);

    $scope.showPdfModal = function (_reportType = "pdf") {

        $scope.printPdfVals = {};
        $scope.showLoader = true;
        $scope.filterReport.token = $rootScope.token;
        $scope.filterReport.module = $scope.module;
        $scope.filterReport.items = $scope.items;
        $scope.filterReport.dateFrom = $scope.filterReport.dateFrom;
        $scope.filterReport.dateTo = $scope.filterReport.dateTo;
        $scope.filterReport.employeesArr = $scope.employeesArr;
        $scope.currentDate = $rootScope.get_current_date();

        $rootScope.printinvoiceFlag = false;

        var employeeReportListingApi = $scope.$root.reports + "module/employee-report";

        $http
            .post(employeeReportListingApi, $scope.filterReport)
            .then(function (res) {

                $scope.showLoader = false;
                $scope.reportsDataArr = [];
                $scope.columns = [];

                if (res.data.ack == true) {
                    $scope.reportsDataArr = res.data.response;

                    $scope.printPdfVals = {};
                    $scope.printPdfVals.columns = [];
                    $scope.printPdfVals.reportName = 'employeeList';

                    if ($scope.reportType == 'employeeAbsences') {
                        $scope.printPdfVals.reportName = 'employeeAbsencesReport';
                    }

                    $scope.printPdfVals.currentDate = $scope.currentDate;
                    $scope.printPdfVals.dateTo = $scope.filterReport.dateTo;
                    $scope.printPdfVals.dateFrom = $scope.filterReport.dateFrom;
                    $scope.printPdfVals.company_reg_no = $scope.filterReport.company_reg_no;
                    $scope.printPdfVals.reportType = $scope.reportType;
                    $scope.printPdfVals.reportsDataArr = res.data.response;
                    $scope.printPdfVals._reportType = _reportType;

                    angular.forEach(res.data.response[0], function (val, index) {
                        $scope.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });

                        $scope.printPdfVals.columns.push({
                            'title': toTitleCase(index),
                            'field': index,
                            'visible': true
                        });
                    });

                    if (_reportType == "xlsx") {
                        $scope.showLoader = true;
                        jsreportService.downloadXlsx($scope.printPdfVals, "rkeM2R9vOV").success(function (data) {
                            let file = new Blob([data], { type: 'application/xlsx' });
                            saveAs(file, $scope.printPdfVals.reportName + ".xlsx");
                            $scope.showLoader = false;
                        });
                    } else {

                        var invoicePdfModal = ModalService.showModal({
                            templateUrl: 'app/views/reports/empReportModal.html',
                            controller: 'pdfPrintModalController',
                            inputs: {
                                printPdfVals: $scope.printPdfVals
                            }
                        });

                        invoicePdfModal.then(function (res) {
                            res.element.modal();
                        });
                    }
                }
                else
                    toaster.pop('error', 'Error', $scope.$root.getErrorMessageByCode(400));
            });
    }

}]);